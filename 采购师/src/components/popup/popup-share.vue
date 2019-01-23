<template>
  <base-popup-transition ref="sharePop">
    <div class="share-container">
      <div class="share-header">
        <span class="fw">分享</span>
        <span @click="hide"></span>
      </div>
      <div class="share-title" v-show="!isFlashSale">
        <h2>
          分享购买可赚取佣金
          <span>￥{{ price }}</span>
        </h2>
      </div>
      <div class="share-body">
        <ul class="share-types" :class="{active: isFlashSale}">
          <!-- <li class="share-item" @click="share(1)">
            <div class="share-pic">
              <img src="./images/share-code.png" alt="">
            </div>
            <p>二维码</p>
          </li> -->
          <li class="share-item" @click="share(0)">
            <div class="share-pic">
              <img src="./images/weixin.png" alt="">
            </div>
            <p>微信</p>
          </li>
          <li class="share-item" @click="share(1)">
            <div class="share-pic">
              <img src="./images/share-circle.png" alt="">
            </div>
            <p>朋友圈</p>
          </li>
          <li class="share-item" @click="share(2)">
            <div class="share-pic">
              <img src="./images/share-url.png" alt="">
            </div>
            <p>复制链接</p>
          </li>
        </ul>
      </div>
    </div>
  </base-popup-transition>
</template>

<script>
import BasePopupTransition from './popup-transition'
export default {
  props: {
    price: {
      type: [String, Number],
      default: 0
    },
    isFlashSale: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      //
    }
  },
  methods: {
    show () {
      this.$refs.sharePop.show()
    },
    hide () {
      this.$refs.sharePop.hide()
    },
    share (t) {
      if (t !== 2) {
        this.$emit('share', t)
        return
      }
      this.$emit('shareUrl', t)
    }
  },
  components: {
    BasePopupTransition
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
@import '~@/assets/css/variable'
.share-container
  width 100%
  height 30%
  padding 30px
  padding-bottom 40px
  f14()
  color $color-3
  position absolute
  left 0
  right 0
  bottom 0
  background rgba(255, 255, 255, .95)
  .share-header
    flex-align-item()
    line-height 40px
    margin-bottom 30px
    span:nth-child(2)
      wh(24px)
      bg('close.png')
  .share-title
    tc()
    line-height 40px
    color $color-orange
    margin-bottom 40px
    span
      color $color-red
  .share-types
    flex-align-item()
    justify-content center
    &.active
      margin-top 70px
    .share-item
      padding 0 25px
      tc()
      .share-pic
        wh(120px)
        border-radius(50%)
        margin-bottom 16px
        img
          wh(100%)
        p
          f12()
          line-height 32px
  .fw
    font-weight 700
</style>
