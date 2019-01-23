<template>
  <transition name="popup">
    <div class="transition-popup" v-show="isShow" :style="backgroundColor" @click.self="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      default: 0.5
    },
    opacity: {
      type: Number,
      default: 0.4
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
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
      this.$emit('hide')
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.transition-popup
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  z-index 999
.popup-enter-active,
.popup-leave-active
  transition all .5s
.popup-enter,
.popup-leave-to
  transform translateY(100%)
  opacity 0
</style>
