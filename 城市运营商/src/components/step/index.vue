<template>
  <div>
    <div class="step-container">
      <div class="step-item" :class="{active: item !== stepNum}"  v-for="item in stepNum" :key="item">
        <span class="step-nums" :class="{active: item <= currentIndex}">{{ item }}</span>
        <div class="step-gutter" :class="{active: item < currentIndex}" v-show="item !== stepNum"></div>
      </div>
    </div>
    <div class="step-container description">
      <div class="step-item active">
        <span class="step-description" :class="{active: 0 <= currentIndex - 1}">选择分类</span>
      </div>
      <div class="step-item active step-two">
        <span class="step-description" :class="{active: 1 <= currentIndex - 1}">选择属性共同点</span>
      </div>
      <div class="step-item">
        <span class="step-description" :class="{active: 2 <= currentIndex - 1}">提交生成二维码</span>
      </div>
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
  &.description
    padding 10px 64px 0
  .step-item
    flex-f()
    align-items center
    position relative
    &.active
      flex 1
    &.step-two
      margin-left -40px
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
      f30()
      background $color-c
      position relative
      z-index 1
    .step-description
      f18()
      &.active
        color $color-orange
    .step-gutter
      position absolute
      left 0
      top 50%
      transform translateY(-50%)
      width 100%
      height 5px
      background $color-c
</style>
