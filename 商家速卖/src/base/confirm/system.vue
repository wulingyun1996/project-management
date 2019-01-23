<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="system-wrapper">
        <div class="bg-top"></div>
　　    <div class="inner">
          <p>速配信息推荐原则包括：该店铺信息的主营商品、服务城市、店铺商品，这些资料越完善匹配信息越多越精准哦!</p>
　　      <p>同一条速配信息将保留4个月，系统将定期删除4个月以前的速配信息。</p>
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
    .system-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      width: 72%
      border-radius: 24px
      background: $color-white
      overflow: hidden
      .bg-top
        width: 100%
        height: 170px;/*px*/
        background: #fee5e5 url('topbg.png') no-repeat center bottom
        background-size: 100% auto
      .inner
        padding: 32px 26px 36px 26px
      p
        font-size: 30px;/*px*/
        color: $color-6
        text-indent: 60px
        line-height: 1.4
        margin-top: 10px
        text-align: justify
      .know
        line-height: 104px;/*px*/
        text-align: center
        font-size: 34px;/*px*/
        color: $color-blue
        border-top: 1px solid $color-border;/*no*/
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