<template>
  <div class="hot-goods-container">
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
      :data='m_dataList'>
      <div class="hot-goods-banner">
        <!-- <img :src="banner.image" alt=""> -->
        <swiper loop auto height="140px" :show-desc-mask='false' dots-position="center" v-model="currentIndex" :list="bannerList"></swiper>
      </div>
      <div class="hot-goods-header" v-show="waitFlag">
        <span class="clock"></span>
        <b class="title-description">{{ bannerTitle }}</b>
      </div>
      <div class="hot-goods-tab" v-show="categoryShow">
        <base-scroll
          ref="headerWrap"
          direction="horizontal"
          :has-more="true">
          <ul ref="tabList">
            <li v-for="(item, index) in tabCount" :key="index" @click="selectTab(item, index)">
              <span class="text" :class="{ 'active': currentTabIndex === index }">{{ item.name }}
              <span class="line" :class="{ 'active': currentTabIndex === index }"></span>
              </span>
            </li>
          </ul>
        </base-scroll>
      </div>
      <ul class="hot-goods-list">
        <li v-for="goods in m_dataList" :key="goods.hot_id" @click="goodsDetail(goods.goods_id)">
          <div class="hot-goods-pic">
            <img :src="goods.image_page" alt="">
            <img src="./images/icon-hot.png" alt="">
            <img src="./images/icon-hot-line.png" alt="">
          </div>
          <div class="hot-goods-detail">
            <div class="main-title">
              {{ goods.title }}
            </div>
            <div class='main-share'>
              <div class='lable'>
                <span class='goods' v-show="goods.is_stock_good === 1">现货</span>
                <span class='boutique' v-show="goods.boutique === 1">精品馆</span>
                <span class='material' v-show="goods.material === 1">材料馆</span>
              </div>
              <div class='share' @click.stop="getGoodsShare(goods)" v-if='goods.audit_status === 2'>
                <img src="./images/share-icon.png" alt="">
                <span>分享</span>
              </div>
            </div>
            <div class='main-identity'>特约采购师价:</div>
            <div class='main-price' v-show="goods.audit_status === 2">
              <div class='price'>
                 <span>￥</span> <span class="big-price">{{ goods.money.init }}</span><span>.</span><span class='small-price'>{{ goods.money.zero }}</span>
              </div>
              <div class='commission'>
                <span>赚 ￥{{ goods.commision_price }}</span>
              </div>
            </div>
            <div class='no-price' v-show="goods.audit_status !== 2">
              <div class='price'>
                 <span>￥</span><span class='star'>***</span>
              </div>
              <div class='certify'>
                <span>认证看底价</span>
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
import BasePopupShare from 'components/popup/popup-share'
import baseGoodsShare from 'components/share/goods-share'
import { Swiper } from 'vux'
import { mixins, navMixins, wxMixins } from 'mixins'
import { smallPic, splitHref, splitMoney } from 'common'
import { invokeNativeMethod } from 'native'
import { mapState } from 'vuex'

const formatMoney = function (data, priceName, customeName = 'money') {
  data.forEach(item => {
    item[customeName] = splitMoney(item[priceName])
  })
  return data
}
export default {
  name: 'CgsHotGoods',
  mixins: [mixins, navMixins, wxMixins],
  data () {
    return {
      waitFlag: false,
      bannerTitle: '',
      title: '',
      goodsCommission: '',
      mainPic: '',
      goodsDetails: {},
      shopName: '',
      bannerList: [],
      currentIndex: 0,
      currentTabIndex: 0,
      tabCount: [],
      categoryId: '',
      // cityId: '',
      // provinceId: '',
      categoryShow: true,
      flag: false
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
    this.getBanner().then(() => {
      this.getData()
    })
  },
  methods: {
    async getBanner () {
      const { provinceId, cityId } = this
      let url = this.isShare ? 'nologin/hotGoodsBanners' : 'hotGoods/banners'
      let obj = {
      }
      if (this.isShare) {
        obj.shareId = this.shareId
        obj.city = cityId
        obj.province = provinceId
      }
      if (!this.isShare) delete obj.shareId
      await this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.handlerBanner(res.data.banner)
          this.bannerList = res.data.banner
          this.tabCount = res.data.category
          this.bannerTitle = res.data.title
          // this.cityId = res.data.city
          // this.provinceId = res.data.province
          if (!res.data.category.length) {
            this.categoryShow = false
            this.categoryId = 0
          } else {
            this.categoryId = res.data.category[0].id
          }
          this.$nextTick(() => {
            this._initTabListWidth()
          })
          // this.bannerList = res.data.banner.map((item, index) => ({
          //   img: item.image
          // }))
        }
      })
    },
    handlerBanner (data) {
      data.forEach((item, index) => {
        // if (!item.pic_and_text) {
        //   item.url = this.getCustomiedPageUrl(`/banner-detail?id=${item.id}`)
        // } else if (!item.act_url) {
        //   item.url = item.act_url
        // } else if (!item.outside_url) {
        //   invokeNativeMethod('openView', JSON.stringify({ 'url': 'cgs://web', 'param': { 'url': item.outside_url, 'title': item.title } }))
        // } else if (!item.goods_id) {
        //   item.url = this.getCustomiedPageUrl(`/goods-detail?goodsId=${item.goods_id}`)
        // }
        if (item.type_style === 0) {
          item.url = ''
        } else if (item.type_style === 1) {
          item.url = this.getCustomiedPageUrl(`/goods-detail?goodsId=${item.goods_id}&bannerListUrl=1`)
          // item.url = `http://127.0.0.1:2018/goods-detail?goodsId=${item.goods_id}&bannerListUrl=1`
        } else if (item.type_style === 2) {
          // invokeNativeMethod('openView', JSON.stringify({ 'url': 'cgs://web', 'param': { 'url': item.outside_url, 'title': item.title } }))
          item.url = item.outside_url
        } else if (item.type_style === 3) {
          item.url = this.getCustomiedPageUrl(`/banner-detail?id=${item.kId}`)
        } else if (item.type_style === 4) {
          item.url = this.getCustomiedPageUrl(`/unionDetail?id=${item.act_url}&bannerListUrl=1`)
        }
      })
    },
    async getData () {
      if (!this.m_hasMore) return
      const { provinceId, cityId } = this
      let url = this.isShare ? 'nologin/hotGoodsList2' : 'hotGoods/list2'
      let obj = {
        page: ++this.m_page,
        category_id: this.categoryId
      }
      if (this.isShare) {
        obj.shareId = this.shareId
        obj.city = cityId
        obj.province = provinceId
      }
      // if (!this.isShare) delete obj.shareId
      // if (this.m_page === 1) {
      //   this.waitFlag = false
      //   await this.getBanner()
      // }
      await this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.waitFlag = true
          this.title = res.data.title
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          formatMoney(this.m_dataList, 'purchase_price')
          this._checkMore(res.data)
          this.flag = false
          // 微信内二次分享
          if (this.isShare) {
            if (this.m_page === 1) {
              let obj = {
                title: '【爆款推荐】',
                desc: '【建材采购师】质量好，价格低，品类齐全，优惠多多!',
                imgUrl: smallPic(this.bannerList[0].img, 200, 200)
              }
              this.wxShare(obj)
            }
          }
        }
      })
    },
    goodsDetail (goodsId) {
      if (this.isShare) {
        this.$router.push({ name: 'GoodsDetail', query: { goodsId, isShare: 1, shareId: this.shareId } })
        return
      }
      this.$router.push({ name: 'GoodsDetail', query: { goodsId } })
    },
    share (payload) {
      const { provinceId, cityId } = this
      let obj = {}
      obj.type = payload
      obj.url = splitHref(`isShare=1&provinceId=${provinceId}&cityId=${cityId}`)
      obj.title = '【爆款推荐】'
      obj.discriable = '【建材采购师】质量好，价格低，品类齐全，优惠多多!'
      obj.imgUrl = smallPic(this.bannerList[0].img, 200, 200)
      obj.from = 5
      invokeNativeMethod('share', JSON.stringify(obj))
      this.$refs.share.hide()
    },
    shareUrl () {
      const { provinceId, cityId } = this
      let url = splitHref(`isShare=1&provinceId=${provinceId}&cityId=${cityId}`)
      invokeNativeMethod('copyToClipboard', url)
      this.$refs.share.hide()
    },
    getGoodsShare (row) {
      this.$refs.goodsShare.show()
      this.goodsCommission = row.commision_price
      this.mainPic = row.image_page
      this.shopName = row.shop_name
      let obj = {
        retailPrice: row.promotion_price,
        marketPrice: row.max_price,
        title: row.title,
        id: row.goods_id,
        isHot: true,
        isFlash: false
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
    _adjust (tabId) {
      const viewportWidth = this.$refs.headerWrap.$el.clientWidth
      const tabListWidth = this.$refs.tabList.clientWidth
      const minTranslate = Math.min(0, viewportWidth - tabListWidth)
      const middleTranslate = viewportWidth / 2
      const items = this.$refs.tabList.children
      let width = 0
      this.tabCount.every((item, index) => {
        if (index === tabId) {
          return false
        }
        width += items[index].clientWidth
        return true
      })
      let translate = middleTranslate - width
      translate = Math.max(minTranslate, Math.min(0, translate))
      // translate = tabId <= 1 ? translate : translate - 190
      // this.$refs.scroll.scrollTo(translate, 0, 300)
      this.$refs.headerWrap.scrollTo(translate, 0, 300)
    },
    // 获取 tap 栏的总宽度；
    _initTabListWidth () {
      const wrapper = document.querySelector('.hot-goods-tab .scroll-content')
      const tabList = this.$refs.tabList
      const items = tabList.children
      let width = 0
      for (let i = 0; i < items.length; i++) {
        width += items[i].clientWidth
      }
      tabList.style.width = (width + 10) + 'px'
      wrapper.style.width = (width + 10) + 'px'
    },
    // 点击滑动
    selectTab (row, index) {
      // 01-添加：如果多次点击当前 tap ，取消发送 ajax 请求；
      if (this.flag) return
      if (this.currentTabIndex === index) return
      // 修改索引和state状态；
      this.currentTabIndex = index
      this.categoryId = row.id
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      this.flag = true
      this.m_dataList = []
      this.getData()
      // 调整横向tap栏位置；
      this._adjust(index)
    }
  },
  components: {
    BaseScroll,
    BasePopupShare,
    BaseNavList,
    baseGoodsShare,
    Swiper
  }
}
</script>

<style>
/* .hot-goods-banner {
  height: 286px!important
} */
.vux-slider .vux-indicator {
  bottom:20px!important
}
.vux-slider .vux-indicator a {
  margin-left:24px!important
}
.vux-slider .vux-indicator a .vux-icon-dot {
  width: 16px!important;
  height: 16px!important;
  border-radius: 50%!important;
  background-color: #fff!important;
  opacity: 0.5!important
}
.vux-slider .vux-indicator a .vux-icon-dot.active {
  background-color: #fff!important;
  opacity: 1!important
}
</style>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.hot-goods-container
  height 100%
  overflow hidden
  background-color #f4f4f4
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
  .hot-goods-banner
    height 280px;/*px*/
    position relative
    // &:after
    //   content ''
    //   position absolute
    //   width 100%
    //   height 8px;/*no*/
    //   background #f4f4f4
    //   left 0
    //   bottom 0
    // .vux-slider /deep/ .vux-indicator
    //   bottom 20px
    // .vux-slider /deep/ .vux-indicator /deep/ a
    //   margin-left 24px
    // .vux-slider /deep/ .vux-indicator /deep/ a /deep/ .vux-icon-dot
    //   width 16px
    //   height 16px
    //   border-radius 50%
    //   background-color #fff
    //   opacity 0.5
    // .vux-slider /deep/ .vux-indicator /deep/ a /deep/ .vux-icon-dot.active
    //   background-color #fff
    //   opacity 1
  .hot-goods-tab
    height 100px
    bd-t(#ccc)
    bd-b(#ccc)
    background-color #fff
    width 100%
    overflow hidden
    .scroll-container
      height 100%
      li
        display inline-block
        padding: 0 40px
        text-align: center
        position: relative
        .text
          display: inline-block
          position: relative
          line-height: 92px
          height: 92px
          font-size: 30px; /*px*/
          color: #000
          &.active
            // border-bottom: 1px solid $color-orange
            color: $color-orange
        .line
          display: none
          width: 100px; /*px*/
          height: 4px;
          background-color: $color-orange
          position: absolute
          bottom: 0
          left: 50%
          margin-left: -50px; /*px*/
          z-index: 99
          border-radius: 10px
          &.active
            display: inline-block
  .hot-goods-header
    margin-top 16px
    height 88px
    background-color #fff
    padding 0 30px
    display flex
    align-items center
    .clock
      width 32px
      height 32px
      margin-right 12px
      bg('hot-goods.png')
    .title-description
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #333333
      letter-spacing: 0
  .hot-goods-list
    padding 0 30px
    background-color #fff
    li
      padding 20px 0
      position relative
      flex-s-btw()
      .hot-goods-pic
        position relative
        width 220px
        height 220px
        margin-right 28px
        padding 2px;
        // bg('icon-hot-line.png')
        img:nth-child(1)
          width 100%
          height 100%
          border-radius 4px;
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
    .hot-goods-detail
      color $color-3
      flex 1
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
      .main-identity
        color #666666
      .main-price
        display flex
        justify-content space-between
        .price
          color #F6333D
          .big-price
            font-size 36px
        .commission
          border: 2px solid  #FF8A00;
          border-radius: 2px;
          padding  6px 18px;
          color #FF8100
          f12()
      .no-price
        display flex
        justify-content space-between
        align-items center
        f12()
        .price
          margin-top 10px
          display flex
          justify-content flex-start
          color #999999
          .star
            f12()
        .certify
          color #FE3E58
          border: 1px solid #FE3E58;/*no*/
          border-radius: 18px;
          padding 6px 12px
          font-size 24px;
          box-sizing border-box
</style>
