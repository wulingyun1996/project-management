<template>
  <div class="shop-closed-container">
    <base-header
      :is-show-back="false"
      :is-show-close="true">
    </base-header>
    <div class="shop-closed-wrapper" :class="{ active: $isX }">
      <div class="shop-closed-top">
        <img src="./images/icon-close.png" alt="">
        <h1>店铺已关闭</h1>
        <p>感谢您申请平台商家！由于<span>“{{ reason }}”</span>原因店铺被关闭，我们深表歉意。</p>
      </div>
      <div class="shop-closed-center">
        <img src="./images/icon-fast-apply.png" alt="">
      </div>
      <div class="shop-closed-bottom">
        <div class="shop-closed-button" @click="goFastApplyShop">点我-极速开店</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopClosed',
  computed: {
    reason () {
      return this.$route.query.reason
    }
  },
  methods: {
    goFastApplyShop () {
      this.$router.push('/topspeed-set-shop')
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.shop-closed-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .shop-closed-wrapper
    flex 1
    flex-col-btw()
    bg('bg-shop.png')
    &.active
      bg('bg-x-shop.png')
    .shop-closed-top
      margin-bottom 140px
      img
        display block
        margin 66px auto 40px
        width 160px
        height 146px
      h1
        color $color-3
        f18()
        tc()
        font-weight 700
        margin-bottom 16px
      p
        padding 0 80px
        tc()
        f14()
        color $color-6
        line-height 40px
        span
          color $color-red
    .shop-closed-center
      img
        display block
        width 612px
        height 414px
        margin 0 auto
    .shop-closed-bottom
      tc()
      margin-bottom 66px
      .shop-closed-button
        width 500px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        background #D0021B
        color $color-white
        f16()
        margin-bottom 20px
</style>
