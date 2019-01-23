<template>
  <div class="seller-download-container">
    <base-header
      :is-show-back="false"
      :intercept-close="false"
      :is-show-close="true"
      @headerClose="goHome">
    </base-header>
    <div class="seller-mike">
      <img src="./images/logo_downlode.png" alt="">
      <p>建材商家速卖</p>
    </div>
    <div class="seller-description">
      <img src="./images/slogon.png" alt="">
    </div>
    <div id="downloadApp">打开APP</div>
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
  },
  methods: {
    goHome () {
      this.$router.push('/register-boot-page')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.seller-download-container
  height 100%
  overflow hidden
  bg('bg-downLode.png')
  img
    wh(100%)
  .seller-mike
    margin 150px 0 370px 0
    img
      wh(160px)
      display block
      margin 0 auto 22px
    p
      f16()
      color #666666
      tc()
  .seller-description
    margin-bottom 225px
    img
      width 320px
      height 112px
      display block
      margin 0 auto
  #downloadApp
    width 352px
    height 96px
    line-height 96px
    margin 0 auto
    f18()
    color #FFFFFF
    tc()
    background-image linear-gradient(-270deg, #FF8700 0%, #F5CE00 100%);
    border-radius(52px)
</style>
