<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="down-wrapper">
        <img src="./down.png">
　　    <p>该商品因：“{{ reason }}”不能直接上架
          <br/>
          <span class="cancel-reason">需编辑修改后才能上架哦~</span>  
        </p>
        <div class="know">
          <div class="know-goedit"  @click="goEdits">{{ goEditText }}</div>
          <div class="know-latercomfirm"  @click="hide">{{confirmBtnText}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      confirmBtnText: {
        type: String,
        default: '稍后再说'
      },
      reason: {
        type: String,
        default: '审核未通过'
      },
      goEditText: {
        type: String,
        default: '去编辑'
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
        this.$emit('cancel')
      },
      goEdits() {
        this.showFlag = false
        this.$emit('goEdit')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .down-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      width: 72%
      border-radius: 24px
      background: $color-white
      overflow: hidden
      padding: 46px 0 0
      img
        display: block
        margin: 0 auto
        width: 48.3%
      p
        font-size: 30px;/*px*/
        color: $color-6
        // text-indent: 60px
        line-height: 1.4
        padding: 45px 30px 0
        padding-left 60px
      .cancel-reason
        color #f00
        line-height 2
      .know
        line-height: 104px;/*px*/
        text-align: center
        font-size: 34px;/*px*/
        color: $color-blue
        border-top: 1px solid $color-border;/*no*/
        margin-top: 42px
        position relative
        display flex
        justify-content space-around
        div
          flex 1
        div:nth-child(1)
          border-right 1px solid #dfdfdf/*no*/
  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>