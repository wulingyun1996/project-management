<template>
  <div class="download-container">
    <div class="banner-top"></div>
    <div class="down-load">
      <a href="javascript:" class="android-down" id="android-download" @click="loadMLink">
        <img src="./images/icon1.png" alt="">
        <span>安卓版下载</span>
      </a>
      <a href="javascript:" class="ios-down" id="ios-download" @click="loadMLink">
        <img src="./images/icon2.png" alt="">
        <span>iOS版下载</span>
      </a>
    </div>
    <div class="banner-bottom">
      <div></div>
    </div>
  </div>
</template>

<script>
import { dev } from 'native'
export default {
  mounted () {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://static.mlinks.cc/scripts/dist/mlink.min.js'
    document.body.appendChild(script)
    setTimeout(() => {
      document.body.removeChild(script)
      this.loadMLink()
    }, 50)
  },
  methods: {
    loadMLink () {
      // eslint-disable-next-line
      new Mlink({
        mlink: 'AbEG',
        button: document.querySelector('#android-download'),
        autoLaunchApp: true,
        inapp: true
      })
    },
    // 安卓打开浏览器
    goAndroidDownload () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.nativeGoDownload()
      }
    },
    // iOS 前往 AppStore
    goAppStore () {
      let currentDev = dev()
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.gotoAppStore.postMessage('https://itunes.apple.com/app/id1344820999')
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.download-container
  height 100%
  f16()
  flex-col()
  .banner-top
    height 480px
    bg('banner1.png')
    margin-bottom 104px
  .down-load
    height 240px
    flex-col-btw()
    align-items center
    margin-bottom 140px
    >a
      width 372px
      height 100px
      flex-align-item()
      justify-content center
      bd($color-orange)
      background $color-orange
      color $color-white
      tc()
      line-height 100px
      border-radius(10px)
      &.ios-down
        color #4a4a4a
        background $color-white
        bd($color-df)
      img
        width 56px
        height 64px
        margin-right 28px
  .banner-bottom
    flex-f()
    justify-content center
    >div
      width 320px
      height 84px
      bg('banner2.png')
</style>
