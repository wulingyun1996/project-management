<template>
  <div class="confirm-container" v-show="isShow">
    <div class="confirm-body">
      <div class="comfirm-close">
        <span @click="hide"></span>
      </div>
      <div class="comfirm-title">
        <h1>{{ title }}</h1>
      </div>
      <div class="comfirm-button">
        <button class="btn-comfirm" @click="confirmBtn">{{ comfirm }}</button>
        <button class="btn-cancel" @click="cancelBtn">{{ cancel }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '您确定要放弃答题吗？'
    },
    comfirm: {
      type: String,
      default: '确认'
    },
    cancel: {
      type: String,
      default: '取消'
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
    },
    cancelBtn () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.confirm-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .4)
  z-index 998
  .confirm-body
    width 72%
    height 24%
    padding 32px
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    border-radius(24px)
    flex-col-btw()
    .comfirm-close
      flex-f()
      justify-content flex-end
      margin-bottom 24px
      span
        wh(24px)
        bg('close.png')
    .comfirm-title
      f16()
      color #646464
      line-height 44px
      text-align center
      margin-bottom 56px
    .comfirm-button
      flex-f()
      justify-content center
      >button
        width 160px
        height 56px
        line-height 56px
        border-radius(10px)
        color $color-orange
        bd($color-orange)
      .btn-comfirm
        background $color-orange
        color $color-white
        margin-right 36px
</style>
