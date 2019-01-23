<template>
  <div class="honey-role-container">
    <base-senior-popup width="100%" height="100%" ref="role" class="role-container">
      <base-scroll :has-more="true" :beforeScroll="true" @beforeScroll="beforeScroll">
        <img src="./images/guize.png" alt="" ref="img">
      </base-scroll>
    </base-senior-popup>
    <div
      class="icon-close"
      @click="goBack">
    </div>
    <!-- :class="{active: $isX}" -->
  </div>
</template>

<script>
export default {
  name: 'HoneyRole',
  data () {
    return {
      isBeforeScroll: true
    }
  },
  mounted () {
    this.$refs.role.show()
  },
  methods: {
    goBack () {
      this.$back()
    },
    // 强制重排
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.img
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/mixin"
.honey-role-container
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  width 100%
  height 100%
  background #fff
  z-index 1000
  .role-container
    z-index 1000
    overflow hidden
  .icon-close
    position fixed
    wh(60px)
    top 14px
    right 14px
    bg('icon-close1.png')
    padding 20px
    box-sizing content-box
    background-origin content-box
    background-clip content-box
    z-index 10000
    &.active
      top 74px
  img
    display block
    width 100%
</style>
