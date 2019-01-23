<template>
  <div>
    <div class="help-wrapper">
      <div class="help-content">
        <div class="help-top">
          <div class="img"><img src="./mf.png" /></div>
          <div class="text">“ 有什么问题就来找我，我们一直用心倾听您的声音 ”</div>
        </div>
        <div class="help-center">
          <scroll ref="scroll" class="help-feedback">
            <div>
              <div class="help-list" v-for="item in helpList">
                <h5>{{item.help_type}}</h5>
                <div class="box-wrapper">
                  <div @click="goDetail(list.id)" :key="index" class="box" v-for="(list, index) in item.center">{{list.question_name}}</div>
                </div>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <div class="foot-tab">
        <!-- <div class="help-foot">
          <img src="./help1.png" /><span>在线客服</span>
        </div> -->
        <div class="help-foot" @click="setTel">
          <img src="./help2.png" /><span>电话客服</span>
        </div>
        <div class="help-foot" @click="feedBack">
          <img src="./help3.png" /><span>意见反馈</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import {dev} from 'common/js/dev'
  import Scroll from 'base/scroll/scroll'
  import {nativeBackBase, navBack} from 'api/init'
  import {loadDataPost, STATUS_OK} from 'api/common'
  export default {
    data() {
      return {
        helpList: {}
      }
    },
    created() {
      window.nav_back = this.nav_back
      window.nav_refresh = this.nav_refresh
      this.nav()
      this.getRoute()
    },
    watch: {
      '$route' () {
        this.nav()
      }
    },
    methods: {
      nav_back() { //eslint-disable-line
        navBack()
      },
      nav_refresh() {
        window.location.reload()
      },
      nav() {
        let param = {
          'left': [
            {
              'title': 'back',
              'function': 'nav_back()' // 默认
            }
          ],
          'right': [
            {
              'title': 'refresh',
              'function': 'nav_refresh()'
            }
          ]
        }
        nativeBackBase(param)
      },
      getRoute() {
        let URL = 'helpList'
        loadDataPost(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.helpList = res.data
          }
        })
      },
      goDetail(id) {
        this.$router.push(`/help-feedback/${id}`)
      },
      setTel() {
        this.$router.push('/phone-service')
      },
      feedBack() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          try {
            window.webkit.messageHandlers.gotoSuggestion.postMessage('')
          } catch (e) {
          }
        } else if (currentDev === 'Android') {
          try {
            window.android.gotoSuggestion()
          } catch (e) {
          }
        } else {
          console.log('pc')
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .help-wrapper
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    background: #f4f4f4
    z-index: 200
    .help-content
      width: 100%
      overflow: hidden
      position: absolute
      top: 0
      bottom: 98px;/*px*/
      .help-top
        padding: 80px 62px 60px 25px
        flex-box-center()
        .img
          width: 132px;/*px*/
          img
            width: 132px;/*px*/
            height: 130px;/*px*/
        .text
          flex: 1
          margin-left: 32px
          background: #ffe9cc
          color: $color-orange
          padding: 34px 20px
          border-radius: 12px
          font-size: 30px;/*px*/
          text-align: center
          line-height: 1.3
      .help-center
        width: 100%
        position: absolute
        top: 288px
        left: 0
        bottom: 0
        overflow: hidden
      .help-feedback
        height: 100%
        overflow: hidden
      .help-list
        padding-top: 20px
        h5
          font-size: 30px;/*px*/
          color: $color-orange
          padding: 25px 0 25px 76px;
          background: url('wen.png') no-repeat 25px center;
          background-size: 36px auto;/*px*/
      .box-wrapper
        background: $color-white
        .box
          display: block
          line-height: 88px;/*px*/
          padding-left: 25px
          font-size: 30px;/*px*/
          position: relative
          padding-right: 80px
          background: url('leftarrow.png') no-repeat 96% center
          background-size: 14px auto;/*px*/
          border-bottom: 1px solid $color-border;/*no*/
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
          &:last-child
            border-bottom: none
    .foot-tab
      display: flex
      height: 98px;/*px*/
      border-top: 1px solid $color-border;/*no*/
      background: $color-white
      position: fixed
      width: 100%
      left: 0
      bottom: 0
      z-index: 200
      .help-foot
        flex: 1
        flex-center()
        flex-direction: column
        font-size: 22px;/*px*/
        color: $color-6
        img
          display: block
          width: 45px;/*px*/
          height: 45px;/*px*/
        span
          margin-top: 9px
          display: block
        &:nth-child(2)
          border-left: 1px solid $color-border;/*no*/
          border-right: 1px solid $color-border;/*no*/
</style>