<template>
  <div class="flash-sale-container">
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
      <!-- <div class="flash-sale-banner"> -->
      <div class="flash-sale-banner" v-show="waitFlag">
        <img :src="banner.banner_path" alt="">
      </div>
      <!-- <div class="flash-sale-header"> -->
      <div class="flash-sale-header" v-show="waitFlag">
        <div class="flash-sale-title">
          <span class="clock"></span>
          <b class="title-description">{{ banner.name }}</b>
        </div>
        <div class="flash-sale-time">
          <b class="time-description">距结束</b>
          <div class="times">
            <b class="hours">{{ countTime.hours }}</b>
            <span>:</span>
            <b class="minutes">{{ countTime.minutes }}</b>
            <span>:</span>
            <b class="seconds">{{ countTime.seconds }}</b>
          </div>
        </div>
      </div>
      <ul class="flash-sale-list">
        <li v-for="goods in m_dataList" :key="goods.goods_id" @click="goodsDetail(goods.goods_id, goods.flash_sale_id)">
          <div class="goods-pic">
            <img :src="goods.image_path" alt="">
            <!-- <img src="./images/limit.png" alt=""> -->
            <img src="./images/icon-time.png" alt="">
            <img src="./images/icon-time-line.png" alt="">
            <div class="no-goods" v-show="goods.stock === '100'"></div>
          </div>
          <div class="flash-sale-detail" style="flex: 1">
            <h5 class="main-title">
             {{ goods.title }}
            </h5>
            <div class='main-share'>
              <div class='lable'>
                <span class='goods' v-show="goods.is_stock_good === 1">现货</span>
                <span class='boutique' v-show="goods.boutique === 1">精品馆</span>
                <span class='material' v-show="goods.material === 1">材料馆</span>
              </div>
              <div class='share' @click.stop="getGoodsShare(goods)">
                <img src="./images/share-icon.png" alt="">
                <span>分享</span>
              </div>
            </div>
            <div class="main-price">
              <div class="main-price-top">
                <p>限时抢购价</p>
                <p class="main-price-desc">
                  <b>￥</b><b class="big-price">{{ goods.priceItem.init }}</b><b>.</b><b>{{ goods.priceItem.zero }}</b>
                </p>
              </div>
            </div>
            <div class="main-progress">
              <base-progress-bar
                :ratio='Number(goods.stock)'>
              </base-progress-bar>
              <div class="sale-out" v-show="isNone">已售罄</div>
              <div class="go-buy" :class="{'no-goods': goods.stock === '100'}">
                <b class="flash"></b>
                <b>马上抢</b>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </base-scroll>
    <base-popup-share
      ref="share"
      :isFlashSale='true'
      @share='share'
      @shareUrl='shareUrl'>
    </base-popup-share>
    <!-- 商品分享弹框 -->
    <base-goods-share
    ref="goodsShare"
    :commission="goodsCommission"
    :goodsPicture="mainPic"
    :shopName="shopName"
    :goods-detail="goodsDetails">
    </base-goods-share>
  </div>
</template>

<script>
import BaseNavList from 'components/nav-list'
import BaseScroll from 'components/scroll/scroll'
import BaseProgressBar from 'components/progress-bar'
import BasePopupShare from 'components/popup/popup-share'
import { mixins, navMixins, wxMixins } from 'mixins'
import { initTime, countDown, smallPic, splitHref, splitMoney } from 'common'
import { invokeNativeMethod } from 'native'
import { mapState } from 'vuex'
import baseGoodsShare from 'components/share/goods-share'
/**
 * 分割数组中每一项的价格，并且添加到当前项本身
 * @param {Array} data
 * @param {String} priceName 每一项中要分割的 价格字段 的名称
 * @param {*} customeName 指定生成的新字段名称，默认是 money
 */
const formatMoney = function (data, priceName, customeName = 'money') {
  data.forEach(item => {
    item[customeName] = splitMoney(item[priceName])
  })
  return data
}
export default {
  name: 'CgsFlashSale',
  mixins: [mixins, navMixins, wxMixins],
  data () {
    return {
      waitFlag: false,
      isNone: false,
      banner: {},
      countTime: {},
      flashStartTime: 0, // 开始时间
      flashEndTimes: 0, // 结束时间
      flashTimeId: null,
      isFlashSale: false,
      goodsCommission: '',
      mainPic: '',
      goodsDetails: {},
      shopName: ''
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
    this.getData()
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'adv/getFlashSale'
      let obj = {
        page: ++this.m_page,
        shareId: this.shareId
      }
      if (!this.isShare) delete obj.shareId
      // 下拉刷新
      if (this.m_page === 1) {
        this.waitFlag = false
        if (this.flashTimeId) clearInterval(this.flashTimeId)
      }
      await this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.banner = res.data.item
          formatMoney(res.data.goods.data, 'price', 'priceItem')
          this.flashEndTimes = initTime(res.data.item.end_at)
          this.getServerTime().then(t => {
            this.flashCountDownTime(t)
            this.m_dataList = [...this.m_dataList, ...res.data.goods.data]
            this._checkMore(res.data.goods)
            this.waitFlag = true
          })
          if (this.isShare) {
            if (this.m_page === 1) {
              let obj = {
                title: '【限时抢购】',
                desc: '【建材采购师】抢购低至一元！！！限时特惠，精选大牌，低价享不停！',
                imgUrl: smallPic(this.banner.banner_path, 200, 200)
              }
              this.wxShare(obj)
            }
          }
        }
      })
    },
    flashCountDownTime (t) {
      this.flashStartTime = (t - 0)
      this.countTime = countDown(this.flashStartTime, this.flashEndTimes)
      this.flashTimeId = setInterval(() => {
        let interval = this.flashEndTimes - this.flashStartTime
        if (interval === 0) clearInterval(this.flashTimeId)
        this.countTime = countDown(this.flashStartTime, this.flashEndTimes)
        this.flashStartTime++
      }, 1000)
    },
    // 分享统计接口
    async statisticsData (goodsId, actId) {
      let url = 'shareRecord'
      let obj = {
        type: 18,
        goodsId,
        actId
      }
      await this.$http(url, obj)
      return Promise.resolve()
    },
    goodsDetail (goodsId, actId) {
      this.statisticsData(goodsId, actId).then(() => {
        if (this.isShare) {
          this.$router.push({ name: 'GoodsDetail', query: { goodsId, isShare: 1, shareId: this.shareId } })
          return
        }
        this.$router.push({ name: 'GoodsDetail', query: { goodsId } })
      })
    },
    getGoodsShare (row) {
      this.$refs.goodsShare.show()
      this.goodsCommission = 0
      this.mainPic = row.image_path
      this.shopName = row.shop_name
      let obj = {
        retailPrice: row.price,
        marketPrice: row.max_price,
        title: row.title,
        id: row.goods_id,
        isHot: false,
        isFlash: true
      }
      if (row.is_stock_good === 0) {
        obj.isNewGoods = false
      } else {
        obj.isNewGoods = true
      }
      if (row.material === 0) {
        obj.isJoinedMeterialGoods = false
      } else {
        obj.isJoinedMeterialGoods = true
      }
      if (row.boutique === 0) {
        obj.isJoinedBestGoods = false
      } else {
        obj.isJoinedBestGoods = true
      }
      this.goodsDetails = obj
    },
    share (payload) {
      let obj = {}
      obj.type = payload
      obj.url = splitHref('isShare=1')
      obj.title = '【限时抢购】'
      obj.discriable = '【建材采购师】抢购低至一元！！！限时特惠，精选大牌，低价享不停！'
      obj.imgUrl = smallPic(this.banner.banner_path, 200, 200)
      obj.from = 4
      invokeNativeMethod('share', JSON.stringify(obj))
      this.$refs.share.hide()
    },
    shareUrl () {
      let url = splitHref('isShare=1')
      invokeNativeMethod('copyToClipboard', url)
      this.$refs.share.hide()
    },
    getServerTime () {
      let url = 'order/getime'
      return new Promise((resolve, reject) => {
        this.$http(url).then(res => {
          if (res.code === this.$ok) {
            resolve(res.data.timestamp)
          }
        })
      })
    }
  },
  components: {
    BaseScroll,
    BaseProgressBar,
    BasePopupShare,
    BaseNavList,
    baseGoodsShare
  },
  // 销毁定时器
  beforeDestroy () {
    clearInterval(this.flashTimeId)
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.flash-sale-container
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
            wh(16px)
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
  .flash-sale-banner
    height 280px
    &:after
      content ''
      position absolute
      width 100%
      height 8px;/*no*/
      background #f4f4f4
      left 0
      bottom 0
    img
      width 100%
      height inherit
  .flash-sale-header
    height 80px
    padding 0 30px
    f14()
    position relative
    flex-align-item()
    &:after
      content ''
      position absolute
      width 100%
      height 1px;/*no*/
      background $color-de
      left 0
      bottom 0
    .flash-sale-title
      height 40px
      line-height 40px
      flex-align-item()
      .clock
        width 32px
        height 32px
        margin-right 12px
        bg('clock.png')
      .title-description
        color $color-0
        font-weight 700
    .flash-sale-time
      height 40px
      line-height 40px
      color $color-0
      flex-f()
      .time-description
        color #333333
        font-weight 700
        margin-right 18px
      .times
        b
          color #ffffff
          display inline-block
          line-height 40px
          tc()
          background #333333
          border-radius(8px)
          margin-right 8px
          &:last-child
            margin-right 0
        b:nth-of-type(1)
          padding 0 10px
        b:nth-of-type(2),
        b:nth-of-type(3)
          width 50px
        span
          display inline-block
          vertical-align top
  .flash-sale-list
    padding 0 30px
    li
      padding 20px 0
      position relative
      flex-s-btw()
      &:after
        content ''
        position absolute
        width 100%
        height 1px;/*no*/
        background $color-de
        left 0
        bottom 0
      .goods-pic
        width 220px
        height 220px
        margin-right 28px
        position relative
        padding 2px
        // bg('icon-time-line.png')
        .no-goods
          position absolute
          left 0
          right 0
          top 0
          bottom 0
          bg('no-goods.png')
          background-size 70%
          background-color rgba(51,51, 51, .4)
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
          width 220px
          height 220px
          position absolute
          left 0
          top 0
    .flash-sale-detail
      color $color-3
      flex-col-btw()
      .main-title
        f14()
        line-height 40px
        text-over(2)
        span
          f10()
          display inline-block
          bd($color-orange)
          color $color-orange
          padding-left 2px;/*no*/
          padding-right 3px;/*no*/
          height 16px;/*no*/
          line-height 16px;/*no*/
      .main-share
        display flex
        justify-content space-between
        height 32px
        align-items center
        .lable
          >span
            margin-right 14px;
            font-size 20px;
            padding  4px;
          .goods
            background rgba(244, 117, 117, .1);
            border-radius 2px;
            color #F47575
          .boutique
            background rgba(255, 138, 0, .1);
            border-radius 2px;
            color #FF8A00
          .material
            background rgba(109, 172, 246, .1);
            border-radius 2px;
            color #6DACF6
        .share
          display flex
          align-items  center
          line-height 32px
          img
            width 26px;
            height 26px;
            margin-right 7px;
          span
            color #F6333D
            font-size 24px;
            padding-top 3px;
      .main-price
        margin 30px 0 16px 0
        .main-price-top
          f12()
          line-height 32px
          color #666666
          p
            display inline-block
          .main-price-desc
            color $color-orange
          .big-price
            font-size 44px;/*px*/
        .main-price-bottom
          f10()
          line-height 28px
          color $color-9
      .main-progress
        flex-s-btw()
        align-items flex-end
        .sale-out
          f12()
          color $color-9
          line-height 34px
        .go-buy
          width 120px
          height 36px
          color $color-white
          background $color-orange
          bd($color-orange)
          tc()
          line-height 48px
          f12()
          border-radius(18px)
          flex-align-item()
          justify-content center
          &.no-goods
            width 120px
            height 36px
            color #E6B780
            background none
            bd(#E6B780)
            tc()
            line-height 48px
            f12()
            .flash
              width 24px
              height 24px
          .flash
            width 24px
            height 24px
            bg('flash-icon.png')
            background-size 100%
</style>
