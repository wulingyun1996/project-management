<template>
  <div class="popup-container" v-show="isShow">
    <slot></slot>
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
  position fixed
  max-width 400px
  max-height 300px
  left 50%
  top 50%
  transform translate(-50%, -50%)
  background #fff
  border-radius(20px)
</style>
