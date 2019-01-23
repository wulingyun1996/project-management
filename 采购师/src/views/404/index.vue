<template>
  <div class="not-find-container">
    <img src="./images/xiud.png" />
    <p>服务器秀逗了，点击重试</p>
  </div>
</template>
<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.not-find-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background $color-f4
  padding-top 28%
  img
    display block
    width 52%
    height auto
    margin 0 auto
  p
    color $color-6
    f13()
    tc()
    margin-top 92px
</style>
