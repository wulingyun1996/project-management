<template>
  <div class="popup-container" v-show="isShow" @click.self="isShow = !isShow">
    <div class="popup-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.popup-container
  position absolute
  left 0
  top -100%
  right 0
  bottom -10000%
  background rgba(0, 0, 0, .4)
  .popup-wrapper
    position fixed
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background #fff
</style>
