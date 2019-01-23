<template>
  <div class="share-container">
    <div class="logo-title">
      <img src="./images/mifeng.png" alt="" class="logo">
      <p><span>建材采购师 让采购</span> <i>变简单！</i></p>
    </div>
    <div class="navigator">
      打开APP
    </div>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
@import '~@/assets/css/variable'
.share-container
  width 100%
  height 80px
  padding 0 30px
  position fixed
  top 0
  left 0
  z-index 999
  flex-align-item()
  f14()
  color #372407
  background-image linear-gradient(90deg, $color-orange, #ffd900)
  .logo-title
    height 44px
    flex-align-item()
    .logo
      height inherit
      width 44px
      margin-right 20px
    i
      font-style italic
      font-weight 700
      color $color-red
      letter-spacing 8px
  .navigator
    width 140px
    height 48px
    line-height 48px
    text-align center
    color $color-white
    f12()
    background $color-orange
    border-radius(4px)
</style>
