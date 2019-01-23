<template>
  <div class="popup-nopass-container" v-show="isShow">
    <div class="popup-nopass-body">
      <div class="popup-pass-close">
        <span @click="hide"></span>
      </div>
      <div class="popup-nopass-title">
        <h1>
          <span></span>
          认证未通过！
        </h1>
      </div>
      <!-- <div class="popup-nopass-desc">
        <h1>您可以再答题一次，或换种其他认证方式。</h1>
      </div> -->
      <div class="button-wrapper">
        <div class="button-left" @click="changeAuthenType">换种认证方式</div>
        <div class="button-right" @click="hide">再答题一次</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comfirm: {
      type: String,
      default: '开启'
    }
  },
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
      this.$emit('refreshQues')
    },
    changeAuthenType () {
      this.isShow = false
      this.$emit('changeAuthenType')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.popup-nopass-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .4)
  z-index 998
  .popup-nopass-body
    width 540px
    padding-top 32px
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    border-radius(24px)
    flex-col-btw()
    justify-content center
    .popup-pass-close
      padding 0 28px
      position relative
      height 24px
      margin-bottom 32px
      span
        position absolute
        right 0
        top -24px
        box-sizing content-box
        wh(24px)
        padding 24px
        bg('close.png')
        background-origin content-box
        background-clip content-box
    .popup-nopass-title
      padding 0 28px
      margin-bottom 54px
      f16()
      color #D0021B
      line-height 44px
      h1
        font-weight 700
        flex-align-item()
        justify-content center
        span
          wh(60px)
          bg('no-pass.png')
          margin-right 16px
    .popup-nopass-desc
      padding 0 28px
      color $color-9b
      f14()
      line-height 40px
      text-align center
      margin 32px 0
    .button-wrapper
      flex-f()
      >div
        flex 1
        height 80px
        f14()
        line-height 80px
        tc()
        bd-t(#F2F2F2)
      .button-left
        color #4A90E2
        bd-r(#F2F2F2)
      .button-right
        color #D0021B
</style>
