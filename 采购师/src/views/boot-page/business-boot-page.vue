<template>
  <div class="business-page">
    <div class="content">
      <div v-html="content" style="overflow: auto; flex: 1; -webkit-overflow-scrolling: touch;">
      </div>
      <div class="foot-btn">
        <div class="left item" @click="jump('/shop-apply')">
          <span>快速入驻</span>
        </div>
        <div class="seperate"></div>
        <div class="right item" @click="goDown">
          <span class="download-icon"></span>
          <span>下载APP</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nativeBack, dev } from 'native'
export default {
  name: 'SellerRights',
  data () {
    return {
      content: ''
    }
  },
  async mounted () {
    nativeBack(this.$route.query.title)
    let res = await this.$http('homepage/detail', {id: this.$route.query.id})
    if (res.code === 200) {
      this.content = res.data.pic_and_text
    } else {
      this.$t(res.message, 'middle')
    }
  },
  methods: {
    jump (path) {
      this.$router.push(path)
    },
    goDown () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        try {
          window.android.nativeGoDownload()
        } catch (error) {
          this.$router.push('/download')
        }
        return
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.gotoAppStore.postMessage('https://itunes.apple.com/us/app/id1344820999')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/mixins'
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)
  .content
    padding-bottom 34px
.content
  height 100%
  display flex
  flex-direction column
.business-page
  height 100%
  .foot-btn
    display flex
    width 100%
    height 98px
    bg('foot-bg.png')
    color #fff
    justify-content center
    align-items center
    position relative
    .seperate
      height 42px
      border-right 1px dashed #fff;/*no*/
    .item
      display flex
      justify-content center
      align-items center
      font-size 32px;/*px*/
      height 100%
      flex 1
      .download-icon
        wh(56px)
        bg('download.png')
        margin-right 10px
</style>
