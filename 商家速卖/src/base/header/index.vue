<template>
  <div class="cgs-header-container" v-show="!isSharedPage">
    <div class="cgs-header-wrapper" v-show="isShowHeader">
      <div class="header-left">
        <span @click="headerBack" class="icon-back" v-show="isShowBack"></span>
        <span @click="headerClose" class="icon-close" v-show="isShowClose"></span>
        <slot name="left"></slot>
      </div>
      <div class="header-center">
        <span v-show="isShowTitle">{{ headerTitle }}</span>
        <slot name="center"></slot>
      </div>
      <div class="header-right">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { closeWebview } from 'navtive'
export default {
  props: {
    // 是否拦截返回事件 -> 默认返回上一级
    interceptBack: {
      type: Boolean,
      default: false
    },
    // 是否拦截关闭事件 -> 默认关闭 webview
    interceptClose: {
      type: Boolean,
      default: true
    },
    isShowBack: {
      type: Boolean,
      default: true
    },
    isShowClose: {
      type: Boolean,
      default: false
    },
    isShowTitle: {
      type: Boolean,
      default: true
    },
    title: {
      default: ''
    }
  },
  data () {
    return {
      headerTitle: this.title || this.$route.meta.title || '',
      isShowHeader: true,
      isIponeX: this.$isX
    }
  },
  created () {
    this.openByTencent()
  },
  methods: {
    headerBack () {
      if (!this.interceptBack) {
        if (this.hasPath) {
          let path = this.$route.query.path
          this.$router.push(path)
          return
        }
        if (this.isFromNative) {
          closeWebview()
          return
        }
        this.$router.back()
        return
      }
      this.$emit('headerBack')
    },
    headerClose () {
      if (this.interceptClose) {
        closeWebview()
        return
      }
      this.$emit('headerClose')
    },
    // 是否是通过 微信 或者 qq 内置浏览器打开
    openByTencent () {
      const UA = navigator.userAgent.toLowerCase()
      if (!!UA.match(/MicroMessenger/i) || !!UA.match(/QQ/i)) this.isShowHeader = false
    }
  },
  watch: {
    title (val) {
      this.headerTitle = val
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.cgs-header-container
  width 100%
  height 95px;/*px*/
  &.ipone-x
  // margin-top 88px
  .cgs-header-wrapper
    width 100%
    height 95px;/*px*/
    position fixed
    padding 0 35px
    z-index 999
    flex-align-item()
    bd-b($color-de)
    background $color-white
    .header-center
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      f18()
      color $color-0
    .header-left,
    .header-right
      height 100%
      flex-align-item()
    .header-left
      flex-f-align()
      .icon-back
        box-sizing content-box
        width 20px
        height 100%
        padding 0 20px
        margin-left -20px
        margin-right 24px
        background url('./images/icon-arrow.png') no-repeat center
        background-size 20px auto
        background-origin content-box
        background-clip content-box
      .icon-close
        box-sizing content-box
        width 32px
        height 100%
        padding 0 20px
        margin-left -20px
        background url('./images/icon-close.png') no-repeat center
        background-size 32px auto
        background-origin content-box
        background-clip content-box
    .header-right
      f13()
      color $color-3
</style>
