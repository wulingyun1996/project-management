<template>
  <div class="popup-pass-container" v-show="isShow">
    <div class="popup-pass-body">
      <div class="popup-pass-close">
        <!-- <span @click="hide"></span> -->
      </div>
      <div class="popup-pass-title">
        <h1>
          <span></span>
          恭喜您已通过认证！
        </h1>
      </div>
      <div class="popup-pass-desc">
        <h1>现在开启您从采购师赚钱之旅吧......</h1>
      </div>
      <div class="popup-pass-button">
        <button class="btn-popup-pass" @click="confirmBtn">{{ comfirm }}</button>
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
    },
    confirmBtn () {
      this.$emit('comfirm')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.popup-pass-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .4)
  z-index 998
  .popup-pass-body
    width 72%
    padding 32px
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    border-radius(24px)
    flex-col-btw()
    .popup-pass-close
      flex-f()
      justify-content flex-end
      margin-bottom 24px
      span
        wh(24px)
        bg('close.png')
    .popup-pass-title
      f16()
      color #417505
      line-height 44px
      h1
        flex-align-item()
        justify-content center
        span
          wh(60px)
          bg('pass.png')
          margin-right 16px
    .popup-pass-desc
      color $color-9b
      f14()
      line-height 40px
      text-align center
      margin 32px 0
    .popup-pass-button
      flex-f()
      justify-content center
      .btn-popup-pass
        width 160px
        height 56px
        line-height 56px
        border-radius(10px)
        background $color-orange
        color $color-white
        // margin-right 36px
</style>
