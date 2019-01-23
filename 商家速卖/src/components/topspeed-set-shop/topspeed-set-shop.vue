<template>
  <div class="setShop-container">
    <base-header></base-header>
    <div class="setShop-bannerImg">
      <div class="banner-img">
        <img src="./images/icon-set.png" alt="">
      </div>
    </div>
    <div class="setShop-radeo">
      <ul>
        <li>支付方式</li>
        <li @click="weiPay">
          <div class="set-left">
            <img src="./images/icon-weixin.png" alt="">
            <span>微信</span>
          </div>
          <div class="set-right" :class="{ 'active': this.weiShow }">
          </div>
        </li>
        <li @click="zhiPay">
          <div class="set-left">
            <img src="./images/icon-zhi.png" alt="">
            <span>支付宝</span>
          </div>
          <div class="set-right" :class="{ 'active': this.zhiShow }">
          </div>
        </li>
      </ul>
    </div>
    <base-footer :text="buttonInfo" @footerSubmit="getPayment"></base-footer>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'api/navtive'
export default {
  data () {
    return {
      weiShow: true,
      zhiShow: false,
      buttonInfo: '微信支付￥2980.00'
    }
  },
  methods: {
    weiPay () {
      this.weiShow = true
      this.zhiShow = false
      this.buttonInfo = '微信支付￥2980.00'
    },
    zhiPay () {
      this.zhiShow = true
      this.weiShow = false
      this.buttonInfo = '支付宝支付￥2980.00'
    },
    getPayment () {
      if (this.weiShow) {
        if (this.$dev === 1) {
          invokeNativeMethod('wxPay')
        } else if (this.$dev === 2) {
          invokeNativeMethod('wxPay')
        }
        return
      }
      if (this.zhiShow) {
        if (this.$dev === 1) {
          invokeNativeMethod('aliPay')
        } else if (this.$dev === 2) {
          invokeNativeMethod('aliPay')
        }
      }
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.setShop-container
  height 100%
  flex-col-btw()
  background-color #fff
  overflow hidden
  bg('icon-bg.png')
  .setShop-bannerImg
    padding 40px 26px 0 26px
    .banner-img
      width 100%
      height 620px
      img
        width 100%
        height 100%
  .setShop-radeo
    flex 1
    li
      display flex
      padding 0 26px
      align-items center
      justify-content space-between
      height 110px
      bd-b(#EDF0F5)
      .set-left
        display flex
        align-items center
        img
          width 40px
          height 40px
          margin-right 20px
        span
          font-size: 32px
          color: #666666
          letter-spacing: 0
      .set-right
        width 36px
        height 36px
        bg('icon-check.png')
      .active
        bg('icon-checked.png')
    li:first-child
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #000000
      letter-spacing: 0
</style>
