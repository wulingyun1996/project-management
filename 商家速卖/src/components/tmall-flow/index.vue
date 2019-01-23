<template>
  <div class="shop-operation-container">
    <base-header></base-header>
    <base-scroll message='' :beforeScroll="true" @beforeScroll="beforeScroll">
      <img :class="{ 'ipone-x': isIponeX }" src="./images/icon-bg-x.png" alt="" ref="img">
    </base-scroll>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isBeforeScroll: true,
      isIponeX: this.$isX
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
  // background-color orange
  height 100%
  .scroll-container
    // overflow hidden
    height 100%
    img
      width 100%
      margin-bottom 50px
      &.ipone-x
        height 1624px
</style>
