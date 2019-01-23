<template>
  <div class="shop-operation-container">
    <base-header></base-header>
    <base-scroll message='' :beforeScroll="true" @beforeScroll="beforeScroll">
      <img src="./images/9.jpg" alt="" ref="img">
      <img src="./images/10.jpg" alt="" ref="img">
      <img src="./images/11.jpg" alt="" ref="img">
      <img src="./images/12.jpg" alt="" ref="img">
      <img src="./images/13.jpg" alt="" ref="img">
      <img src="./images/14.jpg" alt="" ref="img">
      <img src="./images/15.jpg" alt="" ref="img">
      <img src="./images/16.jpg" alt="" ref="img">
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
      console.log(dom)
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
