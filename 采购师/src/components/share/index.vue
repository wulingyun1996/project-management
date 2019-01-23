<template>
  <div class="baes-share-container">
    <div class="base-share-body">
      <div class="share-item" @click="share(5)" v-show="isShowScanCode">
        <img src="./images/scan-code.png" alt="">
        <p>二维码</p>
      </div>
      <div class="share-item" @click="share(0)" v-show="isShowWeiXin">
        <img src="./images/wei-xin.png" alt="">
        <p>微信</p>
      </div>
      <div class="share-item" @click="share(1)" v-show="isShowFriendCircle">
        <img src="./images/friend-circle.png" alt="">
        <p>朋友圈</p>
      </div>
      <div class="share-item" @click="share(2)" v-show="isShowShareUrl">
        <img src="./images/share-url.png" alt="">
        <p>复制链接</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4]
      }
    }
  },
  data () {
    return {
      //
    }
  },
  computed: {
    isShowScanCode () {
      return this.types.indexOf(1) > -1
    },
    isShowWeiXin () {
      return this.types.indexOf(2) > -1
    },
    isShowFriendCircle () {
      return this.types.indexOf(3) > -1
    },
    isShowShareUrl () {
      return this.types.indexOf(4) > -1
    }
  },
  methods: {
    share (t) {
      this.$emit('share', t)
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
@import '~@/assets/css/variable'
.baes-share-container
  .base-share-body
    tc()
    .share-item
      display inline-block
      margin-right 25px
      &:last-child
        margin 0
      img
        wh(100px)
        display block
        margin-bottom 16px
      p
        f12()
        color $color-6
        line-height 34px
        tc()
</style>
