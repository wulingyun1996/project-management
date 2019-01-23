<template>
  <div class="goods-share-container" v-if="showShareGoods">
    <div class="goods-share-wrapper">
      <i class="close-goods-share" @click="hide"></i>
      <div class="goods-share-info">
        <h2>分享商品</h2>
        <p class="share-description">我有一件好物，想要分享给您！</p>
        <div class="goods-info">
          <div
            class="goods-pic"
            :class="{
                      'hot-or-flash-goods': goodsDetail.isHot || goodsDetail.isFlash
                    }">
            <i
              class="goods-bg"
              :class="{
                        'bg-hot': goodsDetail.isHot,
                        'bg-flash': goodsDetail.isFlash
                      }">
            </i>
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
              <b class="desc">特约采购师价：</b>
              <b>￥</b><span>{{ goodsDetail.retailPrice | getPriceInt }}</span><b>.{{ goodsDetail.retailPrice | getPriceZero }}</b>
            </p>
          </div>
        </div>
        <div class="seperate"></div>
      </div>
      <div class="goods-share-type">
        <div class="share-type" @click="share(0)">
          <img src="./images/img-wx.png" alt="">
          <p>微信</p>
        </div>
        <div class="share-type" @click="share(1)">
          <img src="./images/img-circle.png" alt="">
          <p>微信朋友圈</p>
        </div>
        <div class="share-type" @click="share(2)">
          <img src="./images/img-qq.png" alt="">
          <p>QQ好友</p>
        </div>
        <div class="share-type" @click="share(3)">
          <img src="./images/img-qqzoom.png" alt="">
          <p>QQ空间</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'navtive'
import { smallPic, toJson } from 'commons'
export default {
  props: {
    /**
     * 商品详情数据, 该对象需要提供一下公共字段，用于渲染视图
     * id: 商品 id
     * isHot: 是否是爆款
     * isFlash: 是否是限时抢购
     * title: 商品标题
     * isNewGoods: 是否是现货
     * isJoinedBestGoods: 是否加入精品馆
     * isJoinedMeterialGoods: 是否加入材料馆
     * retailPrice: 特约采购师价
     */
    goodsDetail: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 商品主图，用于分享
    goodsPicture: {
      default: ''
    }
  },
  data () {
    return {
      showShareGoods: false
    }
  },
  methods: {
    show () {
      this.showShareGoods = true
    },
    hide () {
      this.showShareGoods = false
      this.$emit('hide')
    },
    share (t) {
      let { goodsPicture, goodsDetail } = this
      let { id, title } = goodsDetail
      let pathName = `/detail/${id}?fromShopManage=1&isShare=1`
      let url = this.getCustomiedPageUrl(pathName)
      let obj = {}
      obj.type = t
      obj.url = url
      obj.imgUrl = smallPic(goodsPicture, 200, 200)
      obj.from = 1
      obj.goodsId = id
      if (t === 1 || t === 3) {
        obj.title = `我发现了一件自购省钱分享可赚钱的好物，【${title}】`
        obj.discriable = ''
      } else {
        obj.title = '【好物推荐】'
        obj.discriable = `我发现了一件自购省钱分享可赚钱的好物，【${title}】`
      }
      invokeNativeMethod('share', toJson(obj))
      this.hide()
    }
  }
}
</script>

<style lang='stylus' scoped>
 @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
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
    top 300px
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
      font-weight 700
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
        position relative
        border-radius(8px)
        &.hot-or-flash-goods
          padding 1px;/*no*/
          .goods-bg
            position absolute
            wh(100%)
            left 0
            top 0
            right 0
            bottom 0
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
        .desc
          color $color-9
          f12()
        b:first-child
          f12()
        span
          f16()
    .seperate
      height 32px
  .goods-share-type
    border-bottom-left-radius 16px
    border-bottom-right-radius 16px
    height 204px
    // padding 0 30px
    background #fff
    // flex-center()
    display flex
    align-items center
    justify-content space-around
    .share-type
      tc()
      f12()
      color $color-6
      & + .share-type
        // margin-left 106px
      img
        wh(100px)
        margin-bottom 16px
</style>
