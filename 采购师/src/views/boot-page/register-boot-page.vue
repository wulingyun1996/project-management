<template>
  <div class="guide iphone-x-container">
    <div class="guide-description">
      <h1>请选择您的身份</h1>
      <p>根据您的选择,我们将给您提供更精准的信息和服务</p>
    </div>
    <div class="identity-list">
      <div
        class="identity-item"
        v-for="(item, index) in modules"
        :key="index"
        :class="{ active: tabItem === index }"
        @click="jumpTo(index)">
        <div class="item-left">
          <h2>{{ item.title }}</h2>
          <p>{{ item.describe }}</p>
        </div>
        <div class="item-right">
          <img :src="item.image" alt="">
        </div>
      </div>
    </div>
    <div class="logo" ref="logo" @click="showHoneyPopup">
      <img src="./images/icon-logo.png" alt="">
    </div>
    <base-senior-popup ref="popup" class="honey-container">
      <div class="view-gift" @click="login"></div>
      <p class="honey-role" @click="showRolePopup">蜂蜜规则</p>
      <div class="honey-close" @click="closeHoneyPopup"></div>
    </base-senior-popup>
    <base-senior-popup width="100%" height="100%" ref="role" class="role-container">
      <base-scroll :has-more="true" :beforeScroll="true" @beforeScroll="beforeScroll">
        <img src="./images/bg-role.png" alt="" ref="img">
      </base-scroll>
    </base-senior-popup>
    <div
      class="icon-close"
      :class="{active: $isX}"
      @click="closeRolePopup"
      v-show="isShowRolePopup">
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'native'
import { createDragTouch } from 'common'
export default {
  name: 'UnregisterGuidePage',
  data () {
    return {
      tabItem: -1,
      modules: [],
      isBeforeScroll: true,
      isShowRolePopup: false
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      createDragTouch(this.$refs.logo)
    })
  },
  methods: {
    getData () {
      this.$http('homepage/getList').then(res => {
        if (res.code === this.$ok) {
          this.modules = res.data.sort((a, b) => {
            return a.sort - b.sort
          })
        }
      })
    },
    // 蜂蜜弹窗
    showHoneyPopup () {
      this.$refs.popup.show()
    },
    closeHoneyPopup () {
      this.$refs.popup.hide()
    },
    // 规则弹窗
    showRolePopup () {
      this.$refs.role.show()
      this.isShowRolePopup = true
    },
    closeRolePopup () {
      this.$refs.role.hide()
      this.isShowRolePopup = false
    },
    login () {
      invokeNativeMethod('showLogin')
    },
    jumpTo (i) {
      this.tabItem = i
      const { type, id, title } = this.modules[i]
      let path = ''
      switch (type) {
        case 'sellerguide': {
          path = '/business-boot-page'
          break
        }
        case 'businessguide': {
          path = '/cppb-boot-page'
          break
        }
        case 'customerguide': {
          path = '/custom-boot-page'
          break
        }
      }
      this.$router.push({
        path: path,
        query: {
          id,
          title
        }
      })
    },
    // 强制重排
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.img
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.guide
  padding 0 30px
  height 100%
  overflow hidden
  .guide-description
    padding 80px 0 60px
    h1
      fz(28px)
      font-weight 700
      color $color-3
      margin-bottom 32px
    p
      f14()
      color $color-9
  .identity-list
    .identity-item
      flex-f-align()
      height 200px
      padding-left 66px
      padding-right 28px
      border-radius(200px)
      bg('bg-default.png')
      background-size 100% auto
      &.active
        bg('bg-activated.png')
        background-size 100% auto
      & + .identity-item
        margin-top 40px
      .item-left
        padding-top 32px
        height 100%
        flex 1
        h2
          color #8B572A
          f20()
          font-weight 700
          margin-bottom 16px
        p
          color #B37743
          f12()
          text-over(2)
          line-height 1.2
      .item-right
        width 200px
        height 180px
        img
          wh(100%)
  .logo
    position fixed
    width 142px
    height 152px
    right 0
    bottom 100px
    z-index 999
    img
      wh(100%)
  .honey-container
    .senior-popup-wrapper
      width 620px!important
      height 550px!important
      padding-top 330px
      position relative
      bg('bg-gift.png')
      flex-center()
      flex-col()
      .view-gift
        width 530px
        height 84px
        bg('icon-gift.png')
        margin-bottom 20px
      .honey-role
        f14()
        color #fff
        line-height 40px
      .honey-close
        position absolute
        wh(84px)
        bg('icon-close.png')
        left 50%
        bottom -125px
        transform translateX(-50%)
  .role-container
    z-index 1000
    overflow hidden
  .icon-close
    position fixed
    wh(40px)
    top 14px
    right 14px
    bg('icon-close2.png')
    padding 20px
    box-sizing content-box
    background-origin content-box
    background-clip content-box
    z-index 10000
    &.active
      top 74px
  img
    display block
    width 100%
</style>
