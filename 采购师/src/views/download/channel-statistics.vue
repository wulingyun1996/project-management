<template>
  <div class="app-container">
    <div class="app-top">
      <img src="./images/bg-app-download.png" alt="">
    </div>
    <div class="app-center">
      <div class="center" :class="{ share: inWx }">
        <img src="./images/img-app-download.png" alt="">
      </div>
      <div class="button" id="downloadApp" @click="staticticsDownLoad">
        <img src="./images/img-button.png" alt="">
      </div>
    </div>
    <div class="app-bottom"></div>
  </div>
</template>

<script>
import { openInstallMixins } from 'mixins'
export default {
  mixins: [openInstallMixins],
  computed: {
    channelId () {
      return this.$route.query.channels
    }
  },
  mounted () {
    this.openAppByOpenInstall()
  },
  methods: {
    staticticsDownLoad () {
      let { channelId, $dev } = this
      let url = 'channelDownAppCount'
      let obj = {
        channel_id: channelId,
        system: $dev === 1 ? 2 : 1
      }
      this.$http(url, obj)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
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
      width 638px
      height 463px
      margin-top 40px
      margin-bottom 280px
      &.share
        margin-bottom 240px
    .button
      width 280px
      height 136px
      flex-center()
      img
        width 182px
        height 38px
  .app-bottom
    height 147px
    background #eeb032
    margin-top -1px;/*no*/
</style>
