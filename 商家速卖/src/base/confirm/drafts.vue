<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="drafts-wrapper">
        <div class="drafts-top">
          <img src="./draft.png">
          <p class="first">商品信息随时保存，方便快捷！</p>
　　      <p>上限20条，超过上限保存新草稿将自动顶替保存时间最早的草稿</p>
　　      <p>存放60天无编辑行为后，系统将自动删除</p>
        </div>
        <div class="know" @click="hide">{{confirmBtnText}}</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      confirmBtnText: {
        type: String,
        default: '知道了'
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
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .drafts-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      width: 72%
      border-radius: 24px
      background: $color-white
      overflow: hidden
      padding: 35px 0 0
      .drafts-top
        padding: 0 30px
      img
        display: block
        margin: 0 auto
        width: 48.3%
      .first
        margin-top: 52px
      p
        font-size: 30px;/*px*/
        color: $color-6
        text-indent: 60px
        line-height: 1.4
      .know
        line-height: 104px;/*px*/
        text-align: center
        font-size: 34px;/*px*/
        color: $color-blue
        border-top: 1px solid $color-border;/*no*/
        margin-top: 42px
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