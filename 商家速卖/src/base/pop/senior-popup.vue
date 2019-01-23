<template>
  <div class="senior-popup-container" v-show="isShow" :style="backgroundColor" @click.self="hide">
    <div class="senior-popup-wrapper" :style="[wrapperHeight, wrapperWidth]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // div.senior-popup-wrapper 该元素的背景颜色，默认是 白色
    background: {
      default: '#fff'
    },
    time: {
      type: Number,
      default: 0.5
    },
    opacity: {
      type: Number,
      default: 0.4
    },
    height: {
      type: [Number, String],
      default: 0
    },
    width: {
      type: [Number, String],
      default: 0
    },
    // 是否阻止外层容器的点击事件，默认 true
    stop: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  computed: {
    backgroundColor () {
      return {
        backgroundColor: `rgba(0, 0, 0, ${this.opacity})`
      }
    },
    wrapperHeight () {
      return {
        height: `${this.height}`
      }
    },
    wrapperWidth () {
      return {
        width: `${this.width}`
      }
    },
    popupBackground () {
      return {
        background: this.background
      }
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      if (!this.stop) return
      this.isShow = false
      this.$emit('hide')
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.senior-popup-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  z-index 1000
  .senior-popup-wrapper
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background #fff
</style>
