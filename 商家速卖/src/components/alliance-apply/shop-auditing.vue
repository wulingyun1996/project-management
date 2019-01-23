<template>
  <div class="shop-auditing-container">
    <base-header
      :is-show-back="false"
      :intercept-close="false"
      :is-show-close="true"
      @headerClose="goHome">
    </base-header>
    <div class="shop-auditing-wrapper" :class="{ active: $isX }">
      <div class="shop-auditing-top">
        <img src="./images/icon-auditing.png" alt="">
        <h1>审核中~</h1>
        <p>感谢您的入驻申请，平台正在快马加鞭审核中，预计一个工作日~</p>
      </div>
      <div class="shop-auditing-center">
        <img src="./images/icon-guide.png" alt="">
      </div>
      <div class="shop-auditing-bottom">
        <div class="shop-auditing-button" @click="goFastApplyShop">极速开店-无需审核</div>
        <p>点我，换种方式，更快体验！</p>
      </div>
    </div>
  </div>
</template>

<script>
import { closeWebview } from 'navtive'
import { invokeNativeMethod } from 'common/js/dev'
export default {
  name: 'ShopAuditing',
  methods: {
    goFastApplyShop () {
      this.$router.push('/topspeed-set-shop')
    },
    goHome () {
      invokeNativeMethod('sumbitDataSucess')
      closeWebview()
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.shop-auditing-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .shop-auditing-wrapper
    flex 1
    flex-col-btw()
    bg('bg-shop.png')
    &.active
      bg('bg-x-shop.png')
    .shop-auditing-top
      margin-bottom 140px
      img
        display block
        margin 70px auto 36px
        width 170px
        height 164px
      h1
        color $color-3
        f18()
        tc()
        font-weight 700
        margin-bottom 16px
      p
        padding 0 120px
        tc()
        f14()
        color $color-6
        line-height 40px
    .shop-auditing-center
      margin-bottom 72px
      img
        display block
        width 562px
        height 380px
        margin 0 auto
    .shop-auditing-bottom
      tc()
      margin-bottom 64px
      .shop-auditing-button
        width 500px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        background #D0021B
        color $color-white
        f16()
        margin-bottom 20px
      p
        color #4A90E2
        f13()
        line-height 36px
</style>
