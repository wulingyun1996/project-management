<template>
  <div class="progress-container">
    <div class="kill-progress">
      <div class="skill-pro-bg">
        <p class="skill-iteam-progress" :class="{no: show3}">
          <span class="skill-pro-insetbg">
            <span class="skill-iteam-pro" :class="{no: show3}" :style="{width: ratio + '%'}"></span>
            <span class="prompt-info" v-show="show1">{{ ratio }}%</span>
            <span class="prompt-info" v-show="show2">即将售罄</span>
            <span class="prompt-info" v-show="show3">已售罄</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ratio: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    show1 () {
      return this.ratio >= 0 && this.ratio < 80
    },
    show2 () {
      return this.ratio >= 80 && this.ratio < 100
    },
    show3 () {
      return this.ratio === 100
    }
  }
}
</script>

<style lang='stylus'>
@import "~@/assets/css/variable"
@import "~@/assets/css/mixins"
.progress-container
  .kill-progress
    width 180px
    height 24px
    color #804500
  .skill-pro-bg
    background rgba(255, 255, 255, .8)
    height 21px
    position relative
    left auto
    bottom auto
    padding 0
    width 100%
  .skill-iteam-progress
    position relative
    top 0
    left 0
    height 45px
    width 200%
    transform scale(.5, .5)
    transform-origin 0 0
    bd($color-orange)
    border-radius(50px)
    &.no
      bd(transparent)
  .skill-pro-insetbg
    width 100%
    height 100%
    display inline-block
    bd(rgba(255, 255, 255, .2))
    .skill-iteam-pro
      position absolute
      top 0
      left -1px;/*no*/
      height 100%
      display block
      width 0
      transition width 1.8s
      background $color-orange
      &.no
        background #efd9c0
    .prompt-info
      fz(18px)
      position absolute
      top 50%
      left 50%
      transform: translate(-50%, -50%)
</style>
