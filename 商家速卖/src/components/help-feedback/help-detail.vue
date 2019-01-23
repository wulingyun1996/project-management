<template>
  <div class="help-detail" @click.stop>
    <scroll ref="scroll" class="feedback" :data="select">
      <div class="detail-container">
        <div v-for="item in select">
          <div class="title">{{item.question_name}}</div>
          <div class="detail" v-html="item.question_answer"></div>
        </div>
        <div class="help-status">
          <a href="javascript:;" class="btn over" :class="{'active':flag, 'gray':flagshow}" @click="clickBtn(1)">已解决</a>
          <a href="javascript:;" class="btn no" :class="{'gray':flag, 'active':flagshow}" @click="clickBtn(2)">未解决</a>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {dev} from 'common/js/dev'
  import {nativeBackBase, navBack} from 'api/init'
  import {loadDataPost, STATUS_OK} from 'api/common'
  export default {
    data() {
      return {
        select: [],
        flag: false,
        flagshow: false,
        helpId: 0
      }
    },
    created() {
      this.helpId = this.$route.params.id
      this.getRoute()
      this.nav()
      window.nav_back = this.nav_back
      window.nav_close = this.nav_close
      window.nav_refresh = this.nav_refresh
    },
    methods: {
      nav_back() { //eslint-disable-line
        navBack()
      },
      nav_close() {
        let currentDev = dev()
        try {
          if (currentDev === 'Android') {
            window.android.nativeClose()
          } else if (currentDev === 'iOS') {
            window.webkit.messageHandlers.nativeClose.postMessage('')
          } else {
            // alert('PC')
          }
        } catch (e) {
          console.warn(e)
        }
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
            },
            {
              'title': 'close',
              'function': 'nav_close()'
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
        let URL = 'helpCenter'
        let obj = {
          id: this.helpId
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            let arr = []
            arr.push(res.data)
            this.select = arr
          }
        })
      },
      clickBtn(type) {
        let URL = 'helpClick'
        let obj = {
          type: type,
          id: this.helpId
        }
        // 已经解决以后，应该跳转路由，并且后天数据应该更新
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (type === 1) {
              this.flag = true
              // this.$router.back()
            } else {
              this.flagshow = true
            }
          }
        })
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .help-detail
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    background: $color-white
    z-index: 2000
    .feedback
      height: 100%
      overflow: hidden
    .detail-container
      width: 100%
      .title
        font-size: 36px;/*px*/
        color: $color-orange
        padding: 32px 26px 32px 90px
        background: url('helpIcon.png') no-repeat 30px center
        background-size: 40px auto;/*px*/
        text-over(2)
      .detail
        padding: 36px 26px
        border-top: 1px solid $color-orange;/*no*/
        p
          text-align: justify
          color: $color-9
          font-size: 28px;/*px*/
          line-height: 1.3
      .help-status
        padding: 46px 70px
        text-align: center
        flex-box-center()
        justify-content: space-around
        .btn
          display: block
          padding: 0 16px 0 64px
          line-height: 60px;/*px*/
          border: 1px solid $color-9;/*no*/
          border-radius: 8px
          color: $color-9
          font-size: 28px;/*px*/
          background-size: 30px auto;/*px*/
          background-position: 18px center
          background-repeat: no-repeat
          &.over
            background-image: url('helpIcon1.png')
            &.active
              background-image: url('helpIcon1hover.png')
              color: $color-orange
              border-color: $color-orange
              pointer-events: none
            &.gray
              background-image: url('helpIcon12hover.png')
              color: $color-c
              border-color: $color-c
              pointer-events: none
          &.no
            background-image: url('helpIcon2.png')
            &.active
              background-image: url('helpIcon22hover.png')
              color: $color-orange
              border-color: $color-orange
              pointer-events: none
            &.gray
              background-image: url('helpIcon2hover.png')
              color: $color-c
              border-color: $color-c
              pointer-events: none
</style>
