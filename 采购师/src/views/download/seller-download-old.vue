<template>
  <div class="seller-download-container">
    <div class="seller-mike">
      <img src="./images/img-mike.png" alt="">
    </div>
    <div class="seller-description">
      <img src="./images/img-seller.png" alt="">
    </div>
    <div id="downloadApp"></div>
    <div class="seller-logo">
      <img src="./images/logo-seller.png" alt="">
      <b>建材商家速卖</b>
    </div>
  </div>
</template>

<script>
import appConfig from 'appConfig'
import { openInstallMixins } from 'mixins'
const { sellerOpenInstall } = appConfig
export default {
  mixins: [openInstallMixins],
  mounted () {
    this.openAppByOpenInstall(sellerOpenInstall)
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.seller-download-container
  height 100%
  overflow hidden
  bg('bg-seller.png')
  img
    wh(100%)
  .seller-mike
    width 214px
    height 110px
    margin-top 170px
  .seller-description
    width 556px
    height 280px
    margin 100px auto 0
  #downloadApp
    width 272px
    height 144px
    bg('bg-button.png')
    margin 180px auto 0
  .seller-logo
    flex-center()
    color $color-3
    f14()
    margin-top 100px
    img
      wh(60px)
      margin-right 20px
</style>
