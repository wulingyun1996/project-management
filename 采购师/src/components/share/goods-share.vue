<template>
  <div class="goods-share-container" v-if="showShareGoods">
    <div class="goods-share-wrapper">
      <i class="close-goods-share" @click="hide"></i>
      <div class="goods-share-info">
        <h2>分享赚钱</h2>
        <div class="share-commission">
          分享预计可赚 <span>￥{{ commission }}</span>
        </div>
        <p class="share-description">客户通过您分享的链接购买商品，订单完成后即可获得此佣金，赚取的佣金可提现,具体佣金金额已实际结算结果为准。</p>
        <div class="goods-info">
          <div
            class="goods-pic"
            :class="{
                      'bg-hot': goodsDetail.isHot,
                      'bg-flash': goodsDetail.isFlash
                    }">
            <i class="label-hot" v-show="goodsDetail.isHot"></i>
            <i class="label-flash" v-show="goodsDetail.isFlash"></i>
            <img :src="goodsPicture" alt="">
          </div>
          <div class="goods-description">
            <h1>{{ goodsDetail.title }}</h1>
            <div class="goods-category">
              <span class="new-goods" v-show="goodsDetail.isNewGoods">现货</span>
              <span class="best-goods" v-show="goodsDetail.isJoinedBestGoods">精品馆</span>
              <span class="meterial-goods" v-show="goodsDetail.isJoinedMeterialGoods">材料馆</span>
            </div>
            <p class="goods-price">
              <b>￥</b><span>{{ goodsDetail.retailPrice | getPriceInt }}</span><b>.{{ goodsDetail.retailPrice | getPriceZero }}</b>
            </p>
          </div>
        </div>
        <div class="seperate"></div>
      </div>
      <div class="goods-share-type">
        <div class="share-type" @click="share(5)">
          <img src="./images/scan-code.png" alt="">
          <p>二维码</p>
        </div>
        <div class="share-type" @click="share(4)">
          <img src="./images/img-wx.png" alt="">
          <p>微信</p>
        </div>
        <div class="share-type" @click="share(1)">
          <img src="./images/img-circle.png" alt="">
          <p>朋友圈</p>
        </div>
        <div class="share-type" @click="share(2)">
          <img src="./images/img-url.png" alt="">
          <p>复制链接</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'native'
import { smallPic, toJson } from 'common'
export default {
  props: {
    // 佣金，限时抢购不需要传，默认为 0
    commission: {
      default: '0.00'
    },
    /**
     * 商品详情数据, 该对象需要提供一下公共字段，用于渲染视图
     * id: 商品 id
     * isHot: 是否是爆款
     * isFlash: 是否是限时抢购
     * title: 商品标题
     * isNewGoods: 是否是现货
     * isJoinedBestGoods: 是否加入精品馆
     * isJoinedMeterialGoods: 是否加入材料馆
     * retailPrice: 商品零售限价
     */
    goodsDetail: {
      type: Object,
      default: () => {}
    },
    // 商品主图，用于分享
    goodsPicture: {
      default: ''
    },
    // 店铺名称，用于分享
    shopName: {
      default: ''
    },
    // 是否是扫码认证打开材料馆
    isScanCode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showShareGoods: false
    }
  },
  methods: {
    show () {
      // qrcode: {
      //   // 当前商品详情页的查询字符串，无需处理，只需要直接拼接在 url 后面即可
      //   query: '?goodsId=2543&isShare=1&isScanCode=1&provinceId=10993&cityId=10883&timestamp=1547802601',
      //   // 商品 id
      //   id: 2543,
      //   // 商品标题
      //   title: '商品标题',
      //   // 是否是 爆款 boolean
      //   isHot: true | false,
      //   // 是否是限时抢购 boolean
      //   isFlash: true | false,
      //   // 是否是现货 boolean
      //   isNewGoods: true | false,
      //   // 是否加入精品馆 boolean
      //   isJoinedBestGoods: true | false,
      //   // 是否加入材料馆 boolean
      //   isJoinedMeterialGoods: true | false,
      //   // 商品零售限价
      //   retailPrice: 200,
      //   // 商品的市场标价
      //   marketPrice: 500,
      //   // 赚取的佣金，如果是限时商品，则为 0.00，否则返回 50.00 类型数据
      //   commission: 200
      // }
      this.showShareGoods = true
    },
    hide () {
      this.showShareGoods = false
    },
    share (type) {
      /* eslint-disable */
      const timestamp = Math.round(new Date() / 1000)
      let { shopName, goodsPicture, goodsDetail, isScanCode, provinceId, cityId, commission, nickName } = this
      let { id, title } = goodsDetail
      let query = isScanCode ?
                    `?goodsId=${id}&isShare=1&isScanCode=1&provinceId=${provinceId}&cityId=${cityId}&timestamp=${timestamp}` :
                    `?goodsId=${id}&isShare=1&provinceId=${provinceId}&cityId=${cityId}&timestamp=${timestamp}`
      let url = this.getCustomiedPageUrl(`/goods-detail${query}`)
      if (type === 2) {
        invokeNativeMethod('copyToClipboard', url)
        this.hide()
        return
      }
      if (type === 4) {
        url = `/pages/goods-detail/main${query}`
      }
      let obj = {
        type,
        url,
        // title: shopName,
        discriable: title,
        title: `这是“${nickName}”采购师为您精选的商品，点我购买真的省...`,
        imgUrl: smallPic(goodsPicture, 200, 200),
        from: 1,
        goodsId: id
      }
      if (type === 5) {
        goodsDetail.query = query
        goodsDetail.commission = commission
        obj.qrcode = goodsDetail
      }
      invokeNativeMethod('share', toJson(obj))
      this.hide()
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.goods-share-container
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .5)
  z-index 2000
  .goods-share-wrapper
    position absolute
    width 100%
    padding 0 30px
    top 172px
    .close-goods-share
      position absolute
      box-sizing content-box
      top 32px
      right 62px
      width 34px
      height 32px
      padding 10px
      margin-top -10px
      margin-right -10px
      bg('icon-close.png')
      background-origin content-box
      background-clip content-box
  .goods-share-info
    background #FFF9F0
    padding 0 30px
    border-top-left-radius 16px
    border-top-right-radius 16px
    h2
      padding-top 40px
      padding-bottom 46px
      color $color-3
      f18()
      tc()
    .share-commission
      f16()
      color #444
      margin-bottom 20px
      span
        color #F6333D
    .share-description
      f12()
      color $color-9
      line-height 1.2
    .goods-info
      background #F8F8F8
      bd($color-c)
      border-radius(16px)
      padding 20px
      flex-f-align()
      margin-top 32px
      .goods-pic
        wh(180px)
        margin-right 20px
        padding 1px;/*no*/
        position relative
        border-radius(8px)
        &.bg-hot
          bg('bg-hot.png')
        &.bg-flash
          bg('bg-flash.png')
        i
          position absolute
          left 0
          top 0
          width 92px
          height 32px
          &.label-hot
            bg('label-hot.png')
          &.label-flash
            bg('label-flash.png')
        img
          wh(100%)
      .goods-description
        height 180px
        padding 5px 0
        flex 1
        h1
          f14()
          line-height 1.3
          color $color-6
          text-over(2)
          margin-bottom 10px
        .goods-category
          flex-f-align()
          margin-bottom 22px
          span
            fz(9px)
            border-radius(4px)
            padding 6px
            padding-top 7px
            & + span
              margin-left 8px
            &.new-goods
              color #F47575
              background rgba(244, 117, 117, .1)
            &.best-goods
              color $color-orange
              background rgba(255, 138, 0, .1)
            &.meterial-goods
              color #6DACF6
              background rgba(109, 172, 246, .1)
      .goods-price
        color #F6333D
        f10()
        span
          f16()
    .seperate
      height 32px
  .goods-share-type
    border-bottom-left-radius 16px
    border-bottom-right-radius 16px
    height 204px
    padding 0 30px
    background #fff
    flex-center()
    .share-type
      tc()
      f12()
      color $color-6
      & + .share-type
        margin-left 50px
      img
        display block
        wh(100px)
        margin-bottom 16px
</style>
