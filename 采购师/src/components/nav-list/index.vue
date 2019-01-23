<template>
  <div class="nav-container" v-show="isShowNav">
    <div class="nav-mask-layer" @click="hide"></div>
    <div class="nav-list-wrapper">
      <ul
        class="nav-list"
        :class="{ 'arrow-top': isShowTopArrow, 'arrow-bottom': isShowBottomArrow }"
        >
        <li
          class="nav-item"
          :class="{ active: item.isChoosed, message: showUnreadMessage && item.type === 1 }"
          v-for="item in navListData"
          :key="item.type"
          @click="operateCurrentItem(item)"
          >
          <img :src="item.icon" alt="" v-show="!item.isChoosed">
          <img :src="item.iconLight" alt="" v-show="item.isChoosed">
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod, invokeNativeMethodAndGetResult } from 'native'
import { mapActions, mapState } from 'vuex'
const navList = [
  {
    index: 0,
    type: 0,
    isChoosed: false,
    icon: require('./images/icon-home.png'),
    iconLight: require('./images/icon-light-home.png'),
    alias: 'home',
    text: '首页'
  },
  {
    index: 1,
    type: 1,
    isChoosed: false,
    icon: require('./images/icon-message.png'),
    iconLight: require('./images/icon-light-message.png'),
    alias: 'message',
    text: '消息'
  },
  {
    index: 2,
    type: 2,
    isChoosed: false,
    icon: require('./images/icon-concat.png'),
    iconLight: require('./images/icon-light-concat.png'),
    alias: 'lineQuery',
    text: '在线咨询'
  },
  {
    index: 3,
    type: 3,
    isChoosed: false,
    icon: require('./images/icon-tel.png'),
    iconLight: require('./images/icon-light-tel.png'),
    alias: 'concat',
    text: '联系卖家'
  },
  {
    index: 4,
    type: 4,
    isChoosed: false,
    icon: require('./images/icon-share.png'),
    iconLight: require('./images/icon-light-share.png'),
    alias: 'share',
    text: '分享'
  }
]
export default {
  props: {
    include: {
      type: Array,
      default: () => ['home', 'message', 'lineQuery', 'concat', 'share']
    },
    exclude: {
      type: Array,
      default: () => []
    },
    isShowTopArrow: {
      type: Boolean,
      default: true
    },
    isShowBottomArrow: {
      type: Boolean,
      default: false
    },
    serviceMobile: {
      default: ''
    },
    imInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      navListData: [],
      isShowNav: false
    }
  },
  computed: {
    ...mapState(['showUnreadMessage'])
  },
  created () {
    window.getSystemMessage = this.getSystemMessage
    this.handlerListData()
    invokeNativeMethodAndGetResult('returnSystemMessage')
      .then(n => {
        if (this.$dev === 1) this.getSystemMessage(n)
      })
      .catch(() => {
        //
      })
  },
  methods: {
    ...mapActions(['MODIFYMESSAGESTATUS']),
    // 获取原生返回未读消息数量
    getSystemMessage (n) {
      if (n > 0) {
        this.MODIFYMESSAGESTATUS(true)
      } else {
        this.MODIFYMESSAGESTATUS(false)
      }
    },
    handlerListData () {
      let { include, exclude } = this
      let includeLength = include.length
      let excludeLength = exclude.length
      if (includeLength < 5 && !!excludeLength) {
        throw new Error('不允许同时指定 include 和 exclude 属性')
      }
      let tempArr = []
      if (excludeLength) {
        exclude.forEach(item => {
          navList.some((navItem, index, arr) => {
            if (item !== navItem.alias) {
              tempArr.push(navItem)
              return true
            }
          })
        })
        this.navListData = tempArr
        return
      }
      include.forEach(item => {
        navList.some((navItem, index, arr) => {
          if (item === navItem.alias) {
            tempArr.push(navItem)
            return true
          }
        })
      })
      this.navListData = tempArr
    },
    operateCurrentItem (item) {
      /**
       * type 0 -> 首页；1 - 消息；2 - 在线咨询；3 - 联系卖家；4 - 分享；
       */
      let { type } = item
      let { serviceMobile, imInfo } = this
      // let { index, type, isChoosed } = item
      // let { navListData, serviceMobile } = this
      // navListData.forEach(navItem => {
      //   if (navItem.index === index) {
      //     navItem.isChoosed = !isChoosed
      //   } else {
      //     navItem.isChoosed = false
      //   }
      // })
      switch (type) {
        case 0:
          if (this.$dev === 1) {
            invokeNativeMethod('nativeGoHomeNew')
          } else {
            invokeNativeMethod('nativeGoHomeNormalTab', 0)
          }
          invokeNativeMethod('setAppBottomTab', 1)
          break
        case 1:
          invokeNativeMethod('goSystemMessagePanel')
          break
        case 2:
          invokeNativeMethod('nativeGoIM', JSON.stringify(imInfo))
          break
        case 3:
          invokeNativeMethod('invokeTel', serviceMobile)
          break
        case 4:
          this.$emit('showShare')
          break
      }
      this.hide()
    },
    show () {
      this.isShowNav = true
    },
    hide () {
      this.isShowNav = false
    }
  },
  watch: {
    include (val) {
      this.handlerListData()
    },
    exclude (val) {
      this.handlerListData()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.nav-container
  wh(100%)
  position relative
  .nav-mask-layer
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    background #fff
    opacity 0
  .nav-list-wrapper
    position relative
    min-width 244px
    .nav-list
      position relative
      min-width 244px
      height auto
      padding 0 32px
      background rgba(0, 0, 0, .8)
      box-shadow 0 4px 8px 0 rgba(255, 255, 255, .3)
      border-radius(16px)
      overflow unset
      &.arrow-top
        &:before
          content ''
          position absolute
          top -12px;/*no*/
          right 12px;/*no*/
          width 0
          height 0
          bd(transparent, 6px)
          bd-b(rgba(0, 0, 0, .8), 6px)
      &.arrow-bottom
        &:after
          content ''
          position absolute
          bottom -12px;/*no*/
          left 12px;/*no*/
          width 0
          height 0
          bd(transparent, 6px)
          bd-t(rgba(0, 0, 0, .8), 6px)
      .nav-item
        flex-f-align()
        position relative
        width 100%
        min-width 100%
        padding 24px 0
        box-sizing content-box
        height 40px
        f14()
        color $color-white
        &.active
          color $color-orange
        &.message
          &:before
            content ''
            position absolute
            top 24px
            left 32px
            wh(16px)
            bg('icon-tips.png')
        &:after
          content ''
          position absolute
          left 0
          right 0
          bottom 0
          bd-b(rgba(255, 255, 255, .15))
        img
          wh(40px)
          margin-right 20px
        // span
        //   position absolute
        //   // width 100%
        //   // tc()
        //   // padding-left 40px
        //   left 50%
        //   top 50%
        //   transform translate(-50%, -50%)
</style>
