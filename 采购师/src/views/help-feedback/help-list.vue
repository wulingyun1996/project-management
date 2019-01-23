<template>
  <div class="help-list-container iphone-x-bottom">
    <div class="help-list-top">
      <div class="help-list-logo">
        <img src="./images/mf.png" />
      </div>
      <div class="help-list-description">“ 有问题就来找我，采购师一直用心倾听您的声音 ”</div>
    </div>
    <base-scroll
      ref="scroll"
      :hasMore="true"
      class="help-list-center">
      <div class="help-list" v-for="(item, index) in helpList" :key="index">
        <h5>{{ item.help_type }}</h5>
        <div class="box-wrapper">
          <div
            v-for="(list, index) in item.center"
            :key="index"
            @click="goHelpDetail(list.id)"
            class="box" >
            {{ index + 1 }}.{{ list.question_name }}
          </div>
        </div>
      </div>
    </base-scroll>
    <div class="help-list-bottom" @click="feedBack">
      <img src="./images/help3.png"/>
      <span>输入您的反馈</span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import { nativeRight, invokeNativeMethod } from 'native'
const rightFun = {
  title: 'refresh',
  function: 'setRightFun()'
}
export default {
  data () {
    return {
      helpList: []
    }
  },
  created () {
    nativeRight(rightFun, this.helpListRefresh)
    this.getHelpList()
  },
  methods: {
    helpListRefresh () {
      window.location.reload()
    },
    getHelpList () {
      let url = 'helpList'
      this.$http(url).then((res) => {
        if (res.code === this.$ok) {
          this.helpList = res.data
        }
      })
    },
    goHelpDetail (id) {
      this.$router.push({name: 'HelpDetail', query: { id }})
    },
    feedBack () {
      invokeNativeMethod('gotoSuggestion')
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'HelpList') {
      nativeRight(rightFun, this.helpListRefresh)
    }
    next()
  },
  components: {
    BaseScroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.help-list-container
  height 100%
  overflow hidden
  background $color-body
  flex-col()
  .help-list-top
    padding 80px 62px 60px 25px
    flex-f()
    align-items center
    .help-list-logo
      width 132px
      img
        width 132px
        height 130px
    .help-list-description
      flex 1
      margin-left 32px
      background #ffe9cc
      color $color-orange
      padding 34px 20px
      border-radius 12px
      fz(15px)
      text-align center
      line-height 1.3
  .help-list-center
    flex 1
    .help-list
      padding-top 20px
      h5
        fz(15px)
        color $color-orange
        padding 25px 0 25px 76px
        background url('./images/wen.png') no-repeat 25px center;
        background-size 36px auto;/*px*/
        text-over(1)
      .box-wrapper
        background $color-white
      .box
        min-height 88px
        line-height 40px
        flex-f()
        justify-content center
        fz(15px)
        padding-left 25px
        padding-right 80px
        background url('./images/leftarrow.png') no-repeat 96% center
        background-size 14px auto
        bd-b($color-border)
        text-over(2)
        &:last-child
          border-bottom none
  .help-list-bottom
    height 100px
    line-height 100px
    color $color-white
    background $color-orange
    tc()
    flex-align-item()
    justify-content center
    f18()
    img
      width 45px
      height 45px
      margin-right 5px;/*no*/
</style>
