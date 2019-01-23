<template>
  <base-senior-popup width="100%" height="100%" ref="helpPopup" class="create-goods-help">
    <base-header></base-header>
    <base-scroll :has-more="true" :beforeScroll="true" @beforeScroll="beforeScroll">
      <img src="./images/help-bg.png" alt="">
      <p ref="placeholder"></p>
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
    this.$nextTick(() => {
      this.$refs.helpPopup.show()
    })
  },
  methods: {
    goCreateGoods () {
      this.$router.back()
    },
    // 强制重排
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.create-goods-help
  z-index 2000!important
  > div
    flex-col()
  img
    width 100%
    height auto
  .scroll-container
    padding 28px
    padding-bottom 0
    flex 1
    overflow hidden
.help-close
  position fixed
  right 28px
  top 28px
  wh(26px)
  z-index 1000
  bg('help-close.png')
  box-sizing content-box
  padding 20px
  background-origin content-box
  background-clip content-box
</style>
