<template>
  <div class="quotation-list" v-if="loading" :class="m_dataList.length === 0 ? 'noquotation' : ''">
    <div class="quotation-wrapper iphone-x-container" style="height: 100%;" v-if="m_dataList.length">
      <header ref="header">
        <div class="arrow-left" @click="back">
          <img src="./images/arrow_left.png" alt="">
        </div>
        <div class="title">
          报价单管理
        </div>
      </header>
      <div class="quotation-list-nav" @click="goQuotationExplain">
        <h2>
          <img class="question-symbol" src="./images/question-symbol.png" alt="">
          <span class="nav-text">必看！新手解读，什么是报价单？</span>
        </h2>
      </div>
      <Scroll
        class="scroll-wrapper"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getData"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :data="m_dataList">
        <div class="wrapper-content">
          <Swipeout :right-menu-width="70">
            <swipeout-item v-for="(item, index) in m_dataList" :key="index">
              <div slot="right-menu">
                <swipeout-button type="primary" @click.native.stop="del(index)" background-color="#CB0000" :width="70">删除</swipeout-button>
              </div>
              <div slot="content" @click="jump(item)" class="quotation-main-body">
                <div class="quotation-item-header">
                  <div class="header-title">
                    <span class="header-title-text">{{ item.offer_name }}</span>
                  </div>
                  <div class="header-arrow">
                    详情>>
                  </div>
                </div>
                <div class="quotation-item-body">
                   <div class="quotation-item-detail">
                    <div class="item">
                      <img  class="item-dot" src="./images/shop.png" alt="">
                      <span class="item-text">店铺数：</span>
                      <span class="item-number">{{ item.shop_num }}</span>
                    </div>
                    <div class="item">
                      <img  class="item-dot" src="./images/product.png" alt="">
                      <span class="item-text">商品数：</span>
                      <span class="item-number">{{ item.goods_num }}</span>
                    </div>
                    <div class="item">
                      <img  class="item-dot" src="./images/share.png" alt="">
                      <span class="item-text">分享次数：</span>
                      <span class="item-number">{{ item.share_num }}</span>
                    </div>
                    <div class="item">
                      <img  class="item-dot" src="./images/browse.png" alt="">
                      <span class="item-text">浏览次数：</span>
                      <span class="item-number">{{ item.view_num }}</span>
                    </div>
                    <div class="item">
                      <img  class="item-dot" src="./images/money.png" alt="">
                      <span class="item-text">报价单总金额：</span>
                      <span class="item-number">￥{{ item.promotion_price | retainTwoDecimal }}</span>
                    </div>
                  </div>
                  <div class="quotation-item-seperate"></div>
                  <div class="quotation-commission-share">
                    <div class="quotation-item-commission">
                      <span class="commission-icon"></span>
                      <span class="commission-text">分享可赚取佣金：</span>
                      <span class="commission-detail">￥{{ item.commission | retainTwoDecimal }}</span>
                    </div>
                    <div class="quotation-item-share" @click.stop="shareQuotationItem(item)"></div>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </Swipeout>
        </div>
      </Scroll>
      <div class="quotation-add" @click="buildQuotation">
        <img src="./images/add.png" alt="">
        <span>新建报价单</span>
      </div>
    </div>
    <div  class="quotation-wrapper iphone-x-container" style="height: 100%;" v-if="m_dataList.length === 0">
      <header ref="header">
        <div class="arrow-left" @click="back">
          <img src="./images/arrow_left.png" alt="">
        </div>
        <div class="title">
          报价单管理
        </div>
      </header>
      <div class="quotation-list-nav" @click="goQuotationExplain">
        <h2>
          <img class="question-symbol" src="./images/question-symbol.png" alt="">
          <span class="nav-text">必看！新手解读，什么是报价单？</span>
        </h2>
      </div>
      <div class="nodata">
        <div>
          <img src="./images/no_quotation.png" alt="">
          <p>一名合格的采购师，怎么可以没有报价单呢!</p>
          <p>赶快去创建分享报价单赚取佣金吧！</p>
        </div>
        <div class="foot-btn" @click="buildQuotation">创建报价单</div>
      </div>
    </div>
    <div class="warn-popup" v-show="isShowWarnPopup">
      <div class="warn-wrapper">
        <h1>报价单内商品<span>库存不足</span>或<span>下架</span>，请修改后再分享</h1>
      </div>
    </div>
    <transition name="fade">
      <div class="share-popup" v-show="isShowSharePopup" @click.self="hideSharePopup">
        <div class="share-popup-wrapper">
          <h1 class="share-title">分享报价单</h1>
          <span class="share-close" @click="hideSharePopup"></span>
          <div class="share-body">
            <p>您只需要将此报价单分享出去，不用囤货，不用发货，无额外费用，产生成交就有佣金拿，多劳多得，上不封顶哦！</p>
            <h5>
              <span class="share-title-text">分享可赚取佣金：</span>
              <span class="share-title-comission">￥{{ currentInfo.commission | retainTwoDecimal }}</span>
            </h5>
            <h2>
              <img src="./images/quotation-list-shop.png" alt="">
              <span class="share-text">{{ currentInfo.offer_name }}</span>
            </h2>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">店铺数：</span>
              <span class="item-number">{{ currentInfo.shop_num }}</span>
            </div>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">商品数：</span>
              <span class="item-number">{{ currentInfo.goods_num }}</span>
            </div>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">报价单总金额：</span>
              <span class="item-number">￥{{ currentInfo.promotion_price | retainTwoDecimal }}</span>
            </div>
          </div>
          <div class="share-icon" @click="shareQuotation">
            <img src="./images/share_weixin.png" alt="">
            <p>微信好友</p>
          </div>
        </div>
      </div>
    </transition>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'components/scroll/scroll'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { retainTwoDecimal, smallPic, toJson } from 'common'
import { mixins } from 'mixins'
import { closeWebview, invokeNativeMethod } from 'native'
export default {
  mixins: [mixins],
  data () {
    return {
      m_dataList: [],
      m_pageSize: 5,
      loading: false,
      isShowWarnPopup: false,
      isShowSharePopup: false,
      currentInfo: {},
      quotationId: '',
      buyId: '',
      imagePath: '',
      mobile: '',
      nickName: '',
      person: ''
    }
  },
  computed: {
    // 是否从原生工作台跳转过来
    isFromNative () {
      return !!this.$route.query.isFromNative
    },
    // 是否从购物车页面跳转过来
    isFromCart () {
      return !!this.$route.query.isFromCart
    }
  },
  created () {
    // 如果是从原生跳转，将该状态记录起来，保存在根实例上
    if (this.isFromNative) this.$root.fromNative = this.isFromNative
    if (this.isFromCart) this.$root.isFromCart = this.isFromCart
    this.getData()
  },
  methods: {
    back () {
      let isFromNative = this.$root.fromNative
      let isFromCart = this.$root.isFromCart
      // 如果只从原生工作台跳转，关闭 webview，否则若从购物车页面进入，就回退上一级，之所以加上 isFromCart 判断，是因为购物车页面也会往
      // 根实例上面存放 isFromNative
      if (isFromNative && !isFromCart) {
        closeWebview()
        return
      }
      this.$router.back()
    },
    jump (item) {
      this.$router.push({path: '/edit-quotation', query: {id: item.id, sameQuotat: item.sameQuotat}})
    },
    buildQuotation () {
      this.$router.push({path: '/quotation'})
    },
    getData () {
      if (!this.m_hasMore) return
      let url = 'cart/offerList'
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      this.$http(url, obj).then(res => {
        this.loading = true
        if (res.code === 200) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    del (index) {
      let url = 'cart/delOffer'
      let obj = {
        id: this.m_dataList[index].id
      }
      let length = this.m_dataList.length
      this.$http(url, obj).then(res => {
        if (res.code === 200) {
          this.m_dataList.splice(index, 1)
          if (length < 5) {
            this.getData()
          }
          this.$t('删除成功', 'middle')
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    // 报价单解读页面
    goQuotationExplain () {
      this.$router.push({name: 'QuotationExplain'})
    },
    // 警告弹窗
    showWarnPopup () {
      this.isShowWarnPopup = true
      setTimeout(() => {
        this.isShowWarnPopup = false
      }, 3000)
    },
    // 分享弹窗
    showSharePopup () {
      this.isShowSharePopup = true
    },
    hideSharePopup () {
      this.isShowSharePopup = false
    },
    // 分享微信好友
    shareQuotationItem (item) {
      let url = 'cart/shareOffer'
      let obj = {
        id: item.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.currentInfo = item
          this.showSharePopup()
          this.quotationId = res.data.id
          this.buyId = res.data.buyer_id
          this.imagePath = res.data.image_path
          this.mobile = res.data.buyer_mobile
          this.nickName = res.data.buyer_nickname
          return
        }
        if (res.code === 400) {
          this.showWarnPopup()
        }
      })
    },
    // 分享功能
    shareQuotation () {
      const timestamp = Math.round(new Date() / 1000)
      let { nickName, mobile, quotationId, buyId, imagePath } = this
      // eslint-disable-next-line
      let alias = nickName ? nickName : mobile
      let obj = {
        type: 4,
        url: `/pages/quotationDetail/main?id=${quotationId}&buyer_id=${buyId}&timestamp=${timestamp}`,
        title: `这是采购师"${alias}"为您制作的专属报价单，点此购买省更多！！！`,
        discriable: '这是您的专属报价单，点此购买省更多！！！',
        imgUrl: smallPic(imagePath, 200, 200),
        from: 2,
        shopCartId: quotationId
      }
      invokeNativeMethod('share', toJson(obj))
      this.hideSharePopup()
    }
  },
  filters: {
    retainTwoDecimal
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Scroll
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2)
  .iphone-x-container
    padding-top 10px;/*no*/
@media (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3)
  .iphone-x-container
    padding-top 20px;/*no*/
.quotation-list

  height 100%
  >div
    height 100%
.noquotation
  overflow hidden
.quotation-wrapper
  background #F5F5F5
  margin-bottom 2px
  flex-col()
  .quotation-add
    color #ffffff
    text-align center
    height 98px
    line-height 98px
    background-color #FF8A00
    font-size 32px
    img
      wh(32px)
      margin-top 20px
  header
    background-color #fff
    height 88px
    flex-align-item()
    position relative
    overflow hidden
    .arrow-left
      height 100%
      padding 0 30px
      display flex
      align-items center
      img
        width  24px
        height 40px
    .title
      font-size 36px
      position absolute
      left 50%
      transform translateX(-50%)
    .build
      display flex
      align-items center
      font-size 28px
      color #D0021B
      margin-right 28px
      flex-grow 1
      justify-content flex-end
      img
        width 30px
        height 30px
        margin-top -2px;/*no*/
  .quotation-list-nav
    margin 4px 0 10px 0
    height 164px
    background-color #fff
    flex-f()
    align-items center
    padding 0 30px
    h2
      f14()
      flex-f()
      align-items center
      line-height 40px
      color #D0021B
      position relative
      margin 0 auto
      .question-symbol
        wh(100px)
        position absolute
        top -10px
        left 0px
      .nav-text
        display block
        width 562px
        height 80px
        line-height 80px
        background: #F8F8F8
        border-radius: 60px
        padding-left 120px
        color #FF8A00
  .scroll-wrapper
    background-color #F5F5F5
    flex 1
    .vux-swipeout-item
      background-color #ffffff
      overflow hidden
      &:after
        content unset
      .vux-swipeout-button-box
        overflow hidden
        padding 1px 1px;/*no*/
        border-bottom 20px s
        >div
          position relative
        button.vux-swipeout-button
          position absolute
          right 0
          top 0
          fz(15px)
          padding 2px 1px;/*no*/
          background-origin content-box
          background-clip content-box
    .quotation-main-body
      .quotation-item-header
        background-color #ffffff
        border-bottom 2px solid #F5F5F5
        flex-align-item()
        height 100px
        line-height 100px
        padding 0 44px
        margin-top 2px
        .header-title
          flex-f()
          .header-title-text
            f16()
            line-height 40px
            color $color-0
        .header-arrow
          color #4A90E2
          f14()
          line-height 40px
      .quotation-item-body
        padding 0 18px
        background $color-white
        border-bottom 20px solid #f5f5f5
        .quotation-commission-share
          padding 0 44px
          height 74px
          flex-align-item()
          .quotation-item-commission
            flex-f()
            align-items center
            .commission-icon
              width 24px
              height 30px
              bg('commission.png')
              margin-right 8px
            .commission-text
              f12()
              line-height 34px
              color $color-orange
            .commission-detail
              f12()
              line-height 34px
              color $color-orange
          .quotation-item-share
            wh(52px)
            bg('quotation-list-share.png')
        .quotation-item-seperate
          margin 0 -18px
          bd-b($color-de)
        .quotation-item-detail
          padding 40px
          flex-f()
          flex-wrap wrap
          .item
            width 50%
            flex-f-align()
            color $color-4a
            f14()
            line-height 40px
            margin-bottom 26px
            &:last-child
              flex 1
              margin-bottom 0
            .item-dot
              wh(24px)
              margin-right 12px
.nodata
  flex 1
  padding-top 248px
  flex-col()
  justify-content space-between
  img
    display block
    width 248px
    height 210px
    margin 0 auto 50px
  p
    font-size 28px
    color #999
    line-height 40px
    text-align center
.foot-btn
  width 100%
  height 100px
  line-height 98px
  text-align center
  color #FFF
  background #FF8A00
  font-size 32px
.warn-popup
  pf(100%)
  left 0
  top 0
  background rgba(0, 0, 0, .7)
  .warn-wrapper
    width 660px
    height 140px
    border-radius(10px)
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    flex-f-align()
    justify-content center
    h1
      color $color-0
      f14()
      line-height 40px
      span
        color $color-orange
.share-popup
  pf(100%)
  left 0
  bottom 0
  background rgba(0, 0, 0, .7)
  .share-popup-wrapper
    position absolute
    top 15%
    left 7.5%
    right 7.5%
    .share-close
      wh(24px)
      bg('close.png')
      position absolute
      right -24px
      top 8px
      box-sizing content-box
      padding 5px
      background-origin content-box
    .share-title
      f18()
      color $color-white
      line-height 50px
      tc()
    .share-body
      background url('./images/share-bg.png') center center
      background-size 100% 100%
      width 640px
      height 680px
      padding-top 34px
      padding-left 86px
      padding-right 60px
      border-radius(20px)
      margin 32px 0 80px
      background-color #fff
      p
        f14()
        color #999999
        line-height 40px
        margin-bottom 14px
      h5
        tc()
        margin-top 180px
        margin-bottom 28px
        .share-title-text
          f14()
          color #FF8A00
          line-height 40px
        .share-title-comission
          font-size 48px
          color #D0021B
          line-height 50px
      &>h2
        flex-f()
        margin-bottom 20px
        img
          width 34px;
          height 38px;
          margin-right 32px
        .share-text
          f16()
          line-height 44px
          color $color-0
      .item
        flex-f-align()
        color $color-4a
        f14()
        line-height 40px
        margin-bottom 6px
        .item-dot
          wh(10px)
          margin-right 12px
          background-color #FF8A00
          border-radius(50%)
        &:last-child
          margin-bottom 0
      .item:nth-child(1)
        margin-right 100px
    .share-icon
      tc()
      margin 0 auto
      img
        wh(120px)
        margin-bottom 24px
      p
        f12()
        color $color-white
        line-height 34px
.fade-enter-active,
.fade-leave-active
  transition opacity .6s
.fade-enter,
.fade-leave-to
  opacity 0
</style>
