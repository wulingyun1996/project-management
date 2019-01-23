<template>
  <div class="cgs-footer-container" :class="{'ipone-x': isIponeX && !isSharedPage}" :style="backgroundColor" @click="footerSubmit">
    {{ footerText }}
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      default: '#ff8a00'
    },
    text: {
      default: ''
    }
  },
  data () {
    return {
      footerText: this.text,
      isIponeX: this.$isX
    }
  },
  computed: {
    backgroundColor () {
      return {
        background: this.background
      }
    }
  },
  methods: {
    footerSubmit () {
      if (!this.preventMoreClick) return
      this.preventMoreClick = false
      this.$emit('footerSubmit')
      setTimeout(() => {
        this.preventMoreClick = true
      }, 1000)
    }
  },
  watch: {
    text (val) {
      this.footerText = val
    }
  }
}
</script>

<style lang="stylus">
// @import "~common/stylus/variable"
@import "~common/stylus/mixin"
.cgs-footer-container
  width 100%
  height 88px
  line-height 88px
  color #fff
  overflow hidden
  f16()
  flex-center()
  &.ipone-x
    // margin-bottom 34px
</style>
