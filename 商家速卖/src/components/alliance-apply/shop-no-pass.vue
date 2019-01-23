<template>
  <div class="shop-no-pass-container">
    <base-header
      :is-show-back="false"
      :is-show-close="true">
    </base-header>
    <div class="shop-no-pass-wrapper" :class="{ active: $isX }">
      <div class="shop-no-pass-top">
        <img src="./images/icon-reject.png" alt="">
        <h1>审核未通过~</h1>
        <p>感谢您申请平台商家！由于<span>“{{ reason }}”</span>原因审核未通过，我们深表歉意。</p>
      </div>
      <div class="shop-no-pass-bottom">
        <h2>您可以选择以下方式：</h2>
        <div class="fast-apply-shop-button" @click="goFastApplyShop">极速开店-无需审核</div>
        <div class="modify-meterial-button" @click="modifyApplyMeterial">审核开店-修改资料</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopNoPass',
  computed: {
    reason () {
      return this.$route.query.reason
    }
  },
  methods: {
    goFastApplyShop () {
      this.$router.push('/topspeed-set-shop')
    },
    modifyApplyMeterial () {
      this.$router.push('/shop-apply')
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.shop-no-pass-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .shop-no-pass-wrapper
    flex 1
    bg('bg-shop.png')
    flex-col-btw()
    &.active
      bg('bg-x-shop.png')
    .shop-no-pass-top
      img
        display block
        margin 66px auto 46px
        width 152px
        height 162px
      h1
        color $color-3
        f18()
        tc()
        font-weight 700
        margin-bottom 16px
      p
        padding 0 52px
        tc()
        f14()
        color $color-6
        line-height 44px
        span
          color $color-red
    .shop-no-pass-bottom
      tc()
      margin-bottom 244px
      h2
        f14()
        color #D0021B
        line-height 40px
        margin-bottom 50px
      > div
        width 500px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        background #D0021B
        color $color-white
        f16()
        margin-bottom 20px
      .modify-meterial-button
        background none
        bd($color-orange)
        color $color-orange
</style>
