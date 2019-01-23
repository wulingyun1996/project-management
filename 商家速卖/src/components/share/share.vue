<template>
  <div class="app-container">
    <div class="app-top">
      <img src="./images/bg-app-download.png" alt="">
    </div>
    <div class="app-center">
      <div class="center">
        <img src="./images/img-app-download.png" alt="">
      </div>
      <div class="button" id="downloadApp">
        <img src="./images/img-button.png" alt="">
      </div>
    </div>
    <div class="app-bottom"></div>
  </div>
</template>

<script>
import appConfig from 'appConfig'
import { openInstallMixins } from 'mixins'
const { cgsOpenInstall } = appConfig
export default {
  mixins: [openInstallMixins],
  mounted () {
    this.openAppByOpenInstall(cgsOpenInstall)
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.app-container
  height 100%
  position relative
  overflow hidden
  flex-col()
  img
    wh(100%)
    display block
  .app-top
    height 127px
  .app-center
    flex 1
    bg('bg-app-bg.png')
    div
      margin 0 auto
    .center
      width 636px
      height 414px
      margin-top 40px
      margin-bottom 280px
    .button
      width 280px
      height 136px
  .app-bottom
    height 147px
    background #eeb032
    margin-top -1px;/*no*/
</style>
