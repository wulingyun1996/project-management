<template>
  <base-popup-transition ref="showAuthen">
    <div class="authen-popup-wrapper">
      <div class="authen-close">
        <span @click="hide"></span>
      </div>
      <div class="authen-header">
        <div class="authen-header-pic"></div>
        <h2>特约认证</h2>
        <div class="authen-header-pic"></div>
      </div>
      <div class="authen-title">
        <h2 v-show="authend">恭喜您已获得店铺特约采购师专属特权！！</h2>
      </div>
      <div class="authen-body">
        <div class="authen-body-left">
          <h2>认证店铺特约采购师</h2>
          <p>即享特价购买权限+认证奖励</p>
        </div>
        <div class="authen-body-seperate"></div>
        <div class="authen-body-right">
          <!-- <button class="no-authen" :class="{'hot-or-flash': !isCommonGoods}" v-show="unAuthen" @click="goAuthen">未认证</button> -->
          <button class="no-authen" v-show="unAuthen" @click="goAuthen">点我认证</button>
          <button class="auditing" v-show="auditing">待审核</button>
          <button class="authened" v-show="authend">已认证</button>
        </div>
      </div>
      <div class="authen-seperate"></div>
      <div class="authen-footer">
        <h3>说明</h3>
        <p>特价购买权限仅开放给认证采购师，点击认证即可进入认证流程，认证申请通过后即可享受特价购买；此优惠仅限本店使用。此优惠不包含限时抢购、特殊活动商品；最终解释权归商户所有。</p>
        <!-- <p>{{ cardDescription }}</p> -->
      </div>
    </div>
  </base-popup-transition>
</template>

<script>
import BasePopupTransition from './popup-transition'
export default {
  props: {
    authenInfo: {
      type: Number,
      default: 0
    },
    discount: {
      default: '8'
    },
    cardDescription: {
      default: '特价购买权限仅开放给认证采购师，点击认证即可进入认证流程，认证申请通过后即可享受特价购买；此优惠仅限本店使用。此优惠不包含限时抢购、特殊活动商品；最终解释权归商户所有。'
    },
    isCommonGoods: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 未认证
    unAuthen () {
      return this.authenInfo === 0 || this.authenInfo === 3
    },
    // 待审核
    auditing () {
      return this.authenInfo === 1
    },
    // 已认证
    authend () {
      return this.authenInfo === 2
    }
  },
  methods: {
    show () {
      this.$refs.showAuthen.show()
    },
    hide () {
      this.$refs.showAuthen.hide()
    },
    goAuthen () {
      this.$emit('goAuthen')
    }
  },
  components: {
    BasePopupTransition
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.authen-popup-wrapper
  width 94%
  height 50%
  padding 30px
  position absolute
  left 50%
  right 0
  bottom 0
  transform translateX(-50%)
  background $color-white
  flex-col()
  align-items center
  border-radius(16px 16px 0 0)
  h2
    font-weight 700
  .authen-close
    width 100%
    tr()
    margin-bottom 25px
    span
      display inline-block
      wh(30px)
      bg('close.png')
  .authen-header
    flex-align-item()
    margin-bottom 20px
    .authen-header-pic
      width 166px
      height 42px
      bg('flower-pic.png')
    h2
      f18()
      margin 0 36px
      color #d0021b
      line-height 50px
  .authen-title
    fz(13px)
    line-height 36px
    color #d0021b
    margin-bottom 16px
  .authen-body
    flex-align-item()
    padding 20px 40px
    background rgba(248, 231, 28, .2)
    margin-bottom 30px
    border-radius(16px)
    .authen-body-left
      h2
        f16()
        line-height 44px
        color $color-orange
        letter-spacing 1px;/*no*/
      p
        f12()
        color $color-96
        line-height 36px
    .authen-body-seperate
      bd-r($color-c)
      height 72px
      margin 0 30px
    .authen-body-right
      border-radius(100px)
      button
        display block
        f14()
        width 150px
        padding 10px 0
        tc()
        color $color-white
        line-height 40px
        border-radius(100px)
        &.no-authen
          f12()
          background #d0021b
        &.hot-or-flash
          pointer-events none
        &.authened
          background #417505
          pointer-events none
        &.auditing
          background $color-orange
          pointer-events none
  .authen-seperate
    width 100%
    border-bottom 1px dotted $color-de;/*no*/
    margin-bottom 40px
  .authen-footer
    width 100%
    padding 0 30px
    h3
      f14()
      tc()
      line-height 40px
      margin-bottom 10px
    p
      fz(13px)
      line-height 44px
      color $color-4a
</style>
