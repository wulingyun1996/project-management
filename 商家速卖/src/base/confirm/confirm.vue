<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
          <i class="close" @click="closePop"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confirm() {
        this.hide()
        this.$emit('confirm')
      },
      closePop() {
        this.hide()
        this.$emit('cancel')
      },
      hideOper() {
        document.querySelector('.operate').style.display = 'none'
      },
      hideClose() {
        document.querySelector('.close').style.display = 'none'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    .confirm-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      width: 86.67%
      border-radius: 13px
      background: $color-white
      overflow: hidden
      .confirm-content
        font-size: 28px;/*px*/
        position: relative
        .text
          padding: 70px 30px;/*px*/
          line-height: 1.5
          text-align: center
          color: $color-0
          border-bottom: 1px solid $color-border;/*no*/
          font-size: 34px;/*px*/
        .close
          display: none
          width: 26px;/*px*/
          height: 26px;/*px*/
          background: url('x@2x.png') no-repeat center
          background-size: 100% auto
          position: absolute
          right: 26px
          top: 24px
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: 34px;/*px*/
          .operate-btn
            flex: 1
            line-height: 88px;/*px*/
            color: $color-blue
            &.left
              border-right: 1px solid $color-border;/*no*/
</style>