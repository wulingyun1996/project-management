<template>
  <div class="step-container">
    <div class="step-item" :class="{active: item !== stepNum}"  v-for="item in stepNum" :key="item">
      <span class="step-nums" :class="{active: item <= currentIndex}">{{ item }}</span>
      <div class="step-gutter" :class="{active: item < currentIndex}" v-show="item !== stepNum"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepNum: {
      type: Number,
      default: 1
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.step-container
  flex-f()
  padding 0 80px
  align-items center
  width 100%
  .step-item
    flex-f()
    align-items center
    position relative
    &.active
      flex 1
    .step-nums,
    .step-gutter
      &.active
        background $color-orange
    .step-nums
      wh(50px)
      border-radius(50%)
      text-align center
      line-height 50px
      color $color-white
      f16()
      background $color-c
      position relative
      z-index 10
    .step-gutter
      position absolute
      left 0
      top 50%
      transform translateY(-50%)
      width 100%
      height 2px;/*no*/
      background $color-c
</style>
