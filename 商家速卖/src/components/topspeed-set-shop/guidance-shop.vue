<template>
  <div class="guidance-shop-container">
    <base-header :isShowBack='false' :isShowClose='true'></base-header>
    <div class="guidance-shop-body">
      <div class="fotter-button" @click="goShop">
        立即开店
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goShop () {
      this.$router.push('/shop-apply')
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.guidance-shop-container
  height 100%
  flex-col-btw()
  background-color #fff
  .guidance-shop-body
    position relative
    flex 1
    bg('icon-no-shop.png')
    .fotter-button
      background-image: linear-gradient(-269deg, #FFBF00 0%, #FF8A00 100%)
      box-shadow: 0 4px 18px 0 rgba(255,138,0,0.25)
      border-radius: 48px
      width 376px
      height 96px
      line-height 96px
      text-align center
      font-family: PingFangSC-Regular
      font-size: 36px
      color: #FFFFFF
      letter-spacing: 0
      position absolute
      left 50%
      margin-left -188px
      bottom 66px
</style>
