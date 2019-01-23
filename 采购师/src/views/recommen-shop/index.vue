<template>
  <div class="recommen-shop-container">
    <base-header :is-show-header="!inWx">
      <div class="header-nav-container" @click="showNav">
        <i
          class="icon-nav"
          :class="{ active: showUnreadMessage }">
        </i>
      </div>
      <div class="header-nav-wrapper">
        <base-nav-list
          ref="nav"
          :include="['home', 'message', 'share']"
          @showShare="showSharePopup">
        </base-nav-list>
      </div>
    </base-header>
    <base-scroll
      :hasMore='m_hasMore'
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      :hasLoading="m_loading"
      :hasRefresh="m_refresh"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :data="m_dataList">
      <div class="recommen-shop-banner" v-show="waitFlag">
        <img :src="banner" alt="">
      </div>
      <div class="recommen-shop-header" v-show="waitFlag">
        <div class="recommen-shop-title">
          <span class="clock"></span>
          <b class="title-description">优选好店</b>
          <b class="description">精选优质好店 高返佣赚更多</b>
        </div>
      </div>
      <ul class="shop-lists">
        <li v-for="shop in m_dataList" :key="shop.id" @click="shopDetail(shop.seller_id)">
          <div class="recommen-shop-banner">
            <img :src="shop.merchant_img" alt="">
          </div>
          <!-- <div class="recommen-shop-commission" v-show="shop.shopSpecialCard === 1 && shop.shopAuth !== 1">
            <div class="recommen-shop-title">
              <span class="shop"></span>
              <b class="title-description">认证店铺再享XX%佣金及认证奖励</b>
            </div>
            <div class="shop-authen">
              去认证
            </div>
          </div> -->
          <div class="shop-commission" v-show="shop.shopSpecialCard === 1 && shop.shopAuth !== 1">
            <div class="commission-info">
                <div class="left-sgin">
                  <img src="./images/icon-sign.png" alt="">
                  <span>认证店铺低价购买+蜂蜜奖励</span>
                </div>
                <div class="right-sgin">
                  <img class="line" src="./images/icon-line.png" alt="">
                  <span>去认证</span>
                  <img class="arrow" src="./images/icon-arrow.png" alt="">
                </div>
              </div>
          </div>
          <ul class="recommen-shop-list">
            <li v-for="goods in shop.goodsList" :key="goods.id">
              <!-- <img class="hot-pic" :src="goods.label" alt=""> -->
              <div class="goods-img" :class="{ hotActive: goods.hot === 1, timeActive: goods.sale === 1 }">
                <img class="main-pic" :src="goods.image_path" alt="">
                <img v-if="goods.hot === 1" src="./images/icon-hot.png" alt="">
                <img v-if="goods.sale === 1" src="./images/icon-time.png" alt="">
              </div>
              <p class="main-title">
                {{ goods.title }}
              </p>
              <div class="recommen-tag">
                <div class="tag-left" v-show="goods.is_stock_good === 1">现货</div>
                <div class="tag-center" v-show="goods.boutique === 1">精品馆</div>
                <div class="tag-right" v-show="goods.material === 1">材料馆</div>
              </div>
              <div class="commission-price">
                <div class="commission-left">
                  <!-- <span>￥</span> -->
                  <b v-if="!shop.shopAuth">￥***</b>
                  <b v-else>￥{{ goods.purchase_price }}</b>
                </div>
                <!-- <div class="commission-left" v-else-if="(!shop.shopAuth || !goods.is_special) && goods.goods_type === 1">
                  <span>￥</span>
                  <b v-if="shop.shopSpecialCard === 1 && shop.shopAuth !== 1">***</b>
                  <b v-else>{{ goods.price }}</b>
                </div>
                <div class="commission-left" v-else-if="shop.shopAuth && goods.is_special && goods.goods_type !== 1">
                  <span>￥</span>
                  <b v-if="shop.shopSpecialCard === 1 && shop.shopAuth !== 1">***</b>
                  <b v-else>{{ goods.svip_price }}</b>
                </div>
                <div class="commission-left" v-else>
                  <span>￥</span>
                  <b v-if="shop.shopSpecialCard === 1 && shop.shopAuth !== 1">***</b>
                  <b v-else>{{ goods.price }}</b>
                </div> -->
                <div class="commission-right-icon" v-show="!shop.shopAuth">
                  认证看底价
                </div>
                <div class="commission-right" v-show="shop.shopAuth">
                  <!-- <span>赚</span> -->
                  <!-- <span class="item-commission-price" v-if="isShare">￥{{ (goods.promotion_price - goods.purchase_price) | retainTwoDecimal }}</span> -->
                  <span class="item-commission-price">
                    赚￥{{ goods.commission }}
                  </span>
                </div>
                <!-- <div class="commission-right" v-show="(shop.shopSpecialCard !== 1 && shop.shopAuth === 1) && goods.goods_type === 1">
                  <span class="item-commission-price">限时抢购</span>
                </div> -->
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </base-scroll>
    <base-popup-share
      ref="share"
      :isFlashSale='true'
      @share='share'
      @shareUrl='shareUrl'>
    </base-popup-share>
  </div>
</template>

<script>
import BaseNavList from 'components/nav-list'
import BaseScroll from 'components/scroll/scroll'
import BasePopupShare from 'components/popup/popup-share'
import { mixins, navMixins, wxMixins } from 'mixins'
import { invokeNativeMethod } from 'native'
import { retainTwoDecimal, splitHref, smallPic } from 'common'
import { mapState } from 'vuex'
export default {
  name: 'CgsRecommenShop',
  mixins: [mixins, navMixins, wxMixins],
  data () {
    return {
      waitFlag: false,
      banner: ''
    }
  },
  computed: {
    ...mapState(['showUnreadMessage']),
    isShare () {
      return !!this.$route.query.isShare
    },
    shareId () {
      return this.$route.query.shareId
    }
  },
  created () {
    // nativeShare(this.showSharePopup)
    this.getData()
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = this.isShare ? 'adv/recommendList' : 'adv/recommendMerchantList'
      let obj = {
        page: ++this.m_page,
        shareId: this.shareId
      }
      if (!this.isShare) delete obj.shareId
      if (this.m_page === 1) this.waitFlag = false
      await this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.waitFlag = true
          this.m_dataList = [...this.m_dataList, ...res.data.list.data]
          this.banner = res.data.merchantMsg
          this._checkMore(res.data.list)
          if (this.isShare) {
            if (this.m_page === 1) {
              let obj = {
                title: '【优选好店】',
                desc: '【建材采购师】精选优质好店，认证专享赚高额佣金！！',
                imgUrl: smallPic(this.banner, 200, 200)
              }
              this.wxShare(obj)
            }
          }
        }
      })
    },
    shopDetail (id) {
      if (this.isShare) {
        this.$router.push({ name: 'ShopDetail', query: { id, shareId: this.shareId } })
        return
      }
      this.$router.push({name: 'ShopDetail', query: { id }})
    },
    share (payload) {
      let obj = {}
      obj.type = payload
      obj.url = splitHref('isShare=1')
      obj.title = '【优选好店】'
      obj.discriable = '【建材采购师】精选优质好店，认证专享赚高额佣金！！'
      obj.imgUrl = smallPic(this.banner, 200, 200)
      obj.from = 7
      invokeNativeMethod('share', JSON.stringify(obj))
      this.$refs.share.hide()
    },
    shareUrl () {
      let url = splitHref('isShare=1')
      invokeNativeMethod('copyToClipboard', url)
      this.$refs.share.hide()
    },
    // 魔窗页面
    goDownLoad () {
      this.$router.push('/app')
    }
  },
  filters: {
    retainTwoDecimal (val) {
      return retainTwoDecimal(val)
    }
  },
  components: {
    BaseScroll,
    BasePopupShare,
    BaseNavList
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.recommen-shop-container
  height 100%
  overflow hidden
  flex-col()
  .cgs-header-container
    .header-nav-container
      position relative
      height 100%
      padding 0 20px
      margin-right -20px
      flex-center()
      .icon-nav
        position relative
        width 44px
        height 10px
        bg('icon-nav.png')
        &.active
          &:after
            content ''
            position absolute
            top -20px
            right -10px
            wh(20px)
            bg('icon-tips.png')
    .header-nav-wrapper
      position absolute
      top 95px;/*px*/
      right -12px;/*px*/
      // .nav-container
      //   div.nav-mask-layer
      //     top 140px
  .scroll-container
    flex 1
  .recommen-shop-banner
    height 280px
    img
      width 100%
      height inherit
  .recommen-shop-header
    height 80px
    padding 0 30px
    f16()
    position relative
    flex-align-item()
    .recommen-shop-title
      height 40px
      line-height 40px
      flex-align-item()
      .clock
        width 32px
        height 32px
        margin-right 16px
        bg('shop.png')
      .title-description
        color $color-0
        font-weight 700
      .description
        f14()
        color $color-9
        margin-left 20px
  .shop-lists
    background $color-f4
    li
      background-color #fff
  .shop-commission
    display flex
    align-items center
    justify-content flex-end
    .commission-info
      margin-top 16px
      width 550px
      background: #FF8D8D
      // height 40px
      display flex
      padding 10px 20px
      // padding-left 10px
      align-items center
      justify-content space-between
      border-top-left-radius 20px
      border-bottom-left-radius 20px
      .left-sgin
        display flex
        align-items center
        img
          width 28px
          height 28px
          margin-right 8px
        span
          font-family: PingFangSC-Regular
          font-size: 22px
          color: #FFF5C1
          letter-spacing: 0
      .right-sgin
        width 130px
        display flex
        align-items center
        justify-content space-between
        .line
          width 4px
          height 28px
        .arrow
          width 24px
          height 24px
        span
          font-family: PingFangSC-Semibold
          font-size: 26px
          color: #FFFFFF
          letter-spacing: 0
  .recommen-shop-commission
    height 60px
    padding 0 30px
    f12()
    position relative
    background #ffddea
    margin-top 20px
    flex-align-item()
    .recommen-shop-title
      height 40px
      line-height 40px
      flex-align-item()
      .shop
        width 32px
        height 32px
        margin-right 16px
        bg('shop-icon.png')
      .title-description
        color $color-0
    .shop-authen
      color $color-red
      position relative
      padding-right 28px
      &:after
        content ''
        position absolute
        width 12px
        height 24px
        top 0
        right 0
        bg('arrow.png')
  .recommen-shop-list
    padding 20px 30px
    margin-bottom 20px
    flex-s-btw()
    li
      width 220px
      position relative
      color $color-0
      flex-col()
      .goods-img
        width 220px
        height 220px
        margin-bottom 5px
        position relative
        padding 2px
        &.hotActive
          bg('icon-hot-line.png')
        &.timeActive
          bg('icon-time-line.png')
        img:nth-child(1)
          width 100%
          height 100%
          border-radius 4px
        img:nth-child(2)
          width 112px
          height 40px
          position absolute
          left 0
          top 0
        img:nth-child(3)
          width 112px
          height 40px
          position absolute
          left 0
          top 0
      .recommen-tag
        display flex
        align-items center
        margin-top 10px
        .tag-left
          width 52px
          height 32px
          background: rgba(244,117,117,0.10)
          border-radius: 4px
          font-family: PingFangSC-Regular
          font-size: 20px
          color: #F47575
          letter-spacing: 0
          text-align center
          line-height 32px
          margin-right 8px
        .tag-center
          width 72px
          height 32px
          background: rgba(255,138,0,0.10)
          border-radius: 4px
          font-family: PingFangSC-Regular
          font-size: 20px
          color: #FF8A00
          letter-spacing: 0
          text-align center
          line-height 32px
          margin-right 8px
        .tag-right
          width 72px
          height 32px
          background: rgba(109,172,246,0.10)
          border-radius: 4px
          font-family: PingFangSC-Regular
          font-size: 20px
          color: #6DACF6
          letter-spacing: 0
          text-align center
          line-height 32px
      .hot-pic
        position absolute
        right 0px
        top 0px
        max-width 70px!important
        max-height 70px
      .main-title
        font-family: PingFangSC-Medium
        font-size: 24px
        color: #000000
        letter-spacing: 0
        line-height: 1.3
        text-over(1)
      .commission-price
        flex-align-item()
        font-size 18px;/*px*/
        margin-top 20px
      .commission-left
        b
         f10()
      .commission-right
        bd(#FF8A00)
        padding 4px 10px
        // height 32px
        // line-height 36px
        tc()
        font-size 18px
        // background $color-orange
        color #FE961C
        border-radius(36px)
        img
          width 20px
          height 22px
          vertical-align sub
        .commission-price
          fz(9px)
      .commission-right-icon
        // width 120px
        padding 1px 10px
        height 32px
        bd(#FE3E58)
        border-radius: 18px
        font-family: PingFangSC-Medium
        font-size: 20px
        color: #FE3E58
        letter-spacing: 0
        text-align center
        line-height 28px
</style>
