<template>
  <div class="shop-operation-container">
    <base-header></base-header>
    <base-scroll message='' :beforeScroll="true" @beforeScroll="beforeScroll">
      <img src="./images/1.jpg" alt="" ref="img">
      <img src="./images/2.jpg" alt="">
      <img src="./images/3.jpg" alt="">
      <img src="./images/4.jpg" alt="">
      <img src="./images/5.jpg" alt="">
      <img src="./images/6.jpg" alt="">
      <img src="./images/7.jpg" alt="">
      <img src="./images/8.jpg" alt="">
    </base-scroll>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isBeforeScroll: true
    }
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
.shop-operation-container
  overflow hidden
  // flex-s-btw()
  height 100%
  .scroll-container
    // overflow hidden
    height 100%
    img
      width 100%
</style>
