<template>
  <base-senior-popup width="100%" height="100%" ref="helpPopup" class="help-wrapper">
    <base-header></base-header>
    <base-scroll :has-more="true" :beforeScroll="true" @beforeScroll="beforeScroll">
      <img src="./images/1.jpg" alt="" ref="img">
      <img src="./images/2.jpg" alt="" ref="img">
      <img src="./images/3.jpg" alt="" ref="img">
      <img src="./images/4.jpg" alt="" ref="img">
      <img src="./images/5.jpg" alt="" ref="img">
      <img src="./images/6.jpg" alt="" ref="img">
      <img src="./images/7.jpg" alt="" ref="img">
      <img src="./images/8.jpg" alt="" ref="img">
    </base-scroll>
  </base-senior-popup>
</template>

<script>
export default {
  data () {
    return {
      isBeforeScroll: true
    }
  },
  mounted () {
    this.$refs.helpPopup.show()
  },
  methods: {
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.img
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.help-wrapper
  overflow hidden
  >div
    flex-col()
  .scroll-container
    overflow hidden
    img
      width 100%
</style>
