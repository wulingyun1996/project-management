<template>
  <div class="help-detail">
    <!-- <base-header
      :is-show-close="true">
      <i class="icon-reload" @click="reloadPage"></i>
    </base-header> -->
    <base-scroll
      ref="scroll"
      :has-more="true"
      class="feedback">
      <div class="detail-container">
        <div class="title">{{ helpDetail.question_name }}</div>
        <div class="detail" v-html="helpDetail.question_answer"></div>
        <div class="help-status">
          <a href="javascript:;" class="btn over" :class="{'active':flag, 'gray':flagshow}" @click="chooseAnswer(1)">已解决</a>
          <a href="javascript:;" class="btn no" :class="{'gray':flag, 'active':flagshow}" @click="chooseAnswer(2)">未解决</a>
        </div>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import { nativeCloseViewAndRefresh } from 'native'
export default {
  data () {
    return {
      helpDetail: {},
      flag: false,
      flagshow: false
    }
  },
  computed: {
    helpId () {
      return this.$route.query.id
    }
  },
  created () {
    nativeCloseViewAndRefresh(this.reloadPage)
    this.getHelpDetail()
  },
  methods: {
    getHelpDetail () {
      let url = 'helpDetail'
      let obj = {
        id: this.helpId
      }
      this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.helpDetail = res.data
        }
      })
    },
    chooseAnswer (type) {
      let url = 'helpClick'
      let obj = {
        type: type,
        id: this.helpId
      }
      this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          if (type === 1) {
            this.flag = true
          } else {
            this.flagshow = true
          }
        }
      })
    },
    reloadPage () {
      window.location.reload()
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.help-detail
  position fixed
  left 0
  top 0
  bottom 0
  right 0
  background $color-white
  z-index 2000
  overflow hidden
  flex-col()
  .icon-reload
    display inline-block
    box-sizing content-box
    width 36px
    height 42px
    bg('icon-reload.png')
    padding 20px
    margin-right -20px
    background-origin content-box
    background-clip content-box
  .feedback
    flex 1
  .detail-container
    width 100%
    .title
      f18()
      color $color-orange
      padding 32px 26px 32px 90px
      background url('./images/helpIcon.png') no-repeat 30px center
      background-size 40px auto
      text-over(2)
    .detail
      padding 36px 26px
      bd-t($color-orange)
      p
        text-align justify
        color $color-9
        f14()
        line-height 1.3
    .help-status
      padding 46px 70px
      tc()
      flex-align-item()
      .btn
        display block
        padding 0 16px 0 64px
        line-height 60px
        bd($color-9)
        border-radius 8px
        color $color-9
        f14()
        background-size 30px auto;/*px*/
        background-position 18px center
        background-repeat no-repeat
        &.over
          background-image url('./images/helpIcon1.png')
          &.active
            background-image url('./images/helpIcon1hover.png')
            color $color-orange
            border-color $color-orange
            pointer-events none
          &.gray
            background-image url('./images/helpIcon12hover.png')
            color $color-c
            border-color $color-c
            pointer-events none
        &.no
          background-image url('./images/helpIcon2.png')
          &.active
            background-image url('./images/helpIcon22hover.png')
            color $color-orange
            border-color $color-orange
            pointer-events none
          &.gray
            background-image url('./images/helpIcon2hover.png')
            color $color-c
            border-color $color-c
            pointer-events none
</style>
