<template>
  <div class="explain-identity-container">
    <div class="explain-header">
      <img src="./images/explain-header.png" alt="">
      <span>采购师身份说明</span>
    </div>
    <div class="seperate"></div>
    <div class="explain-body">
      <div class="identity-item" v-for="item in identity" :key="item.id">
        <div class="left">
          <span></span>
        </div>
        <div class="right">
          <h1>{{ item.name }}</h1>
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import identity from 'data/old-identity'
export default {
  data () {
    return {
      identity
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.explain-identity-container
  pf(100%)
  left 0
  top 0
  background $color-white
  z-index 2000
  .explain-header
    height 156px
    flex-align-item()
    justify-content center
    img
      width 60px
      height 80px
    span
      f18()
      color $color-orange
      margin-left 26px
  .seperate
    height 10px
    background $color-f5
  .explain-body
    padding-left 80px
    padding-right 52px
    padding-top 40px
    .identity-item
      margin-bottom 28px
      flex-f()
      .left
        flex-f()
        span
          wh(10px)
          border-radius(50%)
          background $color-orange
          margin-top 4px;/*no*/
          margin-right 4px;/*no*/
      .right
        flex 1
        h1
          f16()
          color $color-0
          line-height 44px
          margin-bottom 3px;/*no*/
        p
          fz(13px)
          color $color-9b
          line-height 36px
</style>
