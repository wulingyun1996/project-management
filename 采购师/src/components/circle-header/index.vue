<template>
  <div class="header" :class="{iphoneX: $isNeedFit}">
    <div class="left">
      <div @click="back" v-if="showBack" class="icon-left">
        <img src="./images/left.png" alt="">
      </div>
      <div @click="close" v-if="showClose" class="icon-left-near">
        <img src="./images/close.png" alt="">
      </div>
    </div>
    <div class="title">{{title}}</div>
    <div class="right">
      <div @click="share" v-if="showShare" class="icon-right">
         <img src="./images/share.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showBack: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: false
    },
    showShare: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    close () {
      this.$emit('close')
    },
    share () {
      this.$emit('share')
    }
  }
}

</script>
<style lang="stylus" scoped>
.header
  position fixed
  top 0
  left 0
  display flex
  justify-content space-between
  align-items center
  height 88px
  background #fff
  width 100%
  box-sizing content-box
  padding-top 22px
  &.iphoneX
    padding-top 88px
  .left
    display flex
    width 20%
    .icon-left
      padding 0 30px
      img
        width 20px
        height 40px
    .icon-left-near
      img
        width 40px
  .title
    font-size 36px;/*px*/
    color #000
    width 45%
    overflow hidden
    text-align center
    white-space nowrap
    text-overflow ellipsis
    line-height 1.2
  .right
    width 20%
    display flex
    justify-content flex-end
    .icon-right
      padding 0 30px
      img
        width 46px
</style>
