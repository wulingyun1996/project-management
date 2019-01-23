<template>
  <div class="confirm" v-show="showFlag" @click.stop>
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <h1 class="title">
          提交成功
        </h1>
        <p class="description">
          {{ text }}
        </p>
        <div class="btn" @click="goHome">
          回首页
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: '客服会在一个工作日内受理，审核结果将以app消息方式通知您，请留意审核结果！'
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      },
      goHome () {
        this.$emit('backHome')
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
    background rgba(0, 0, 0, .4)
    .confirm-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      width: 72%
      border-radius: 24px
      background: $color-white
      overflow: hidden
      .confirm-content
        font-size: 28px;/*px*/
        display flex
        flex-direction column
        .title
          height 50px
          padding 30px 0 20px
          box-sizing content-box
          text-align: center
          color: $color-orange
          border-bottom: 1px solid $color-border;/*no*/
          position: relative
          font-size: 36px;/*px*/
        .description
          margin 6px 30px
          font-family PingFangSC-Regular
          font-size 28px;/*px*/
          color #9B9B9B
          line-height 40px
        .btn
          width 160px
          height 56px
          font-size 28px;/*px*/
          color $color-orange
          text-align center
          line-height 56px
          border 1px solid $color-orange;/*no*/
          border-radius 30px
          margin 0 auto 30px
</style>