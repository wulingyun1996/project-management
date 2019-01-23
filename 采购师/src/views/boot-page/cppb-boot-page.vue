<template>
  <div class="cppb-page">
    <div class="content">
      <div v-html="content" style="overflow: auto; flex: 1; -webkit-overflow-scrolling: touch;">
      </div>
      <div class="foot-btn" @click="jump">
        立即登录/注册
      </div>
    </div>
  </div>
</template>

<script>
import { dev, nativeBack } from 'native'
export default {
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
    jump () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.showLogin()
          return
        }
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.showLogin.postMessage('')
        }
      } catch (e) {
        console.warn(e)
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
.cppb-page
  height 100%
  .foot-btn
    height 100px
    line-height 100px
    // background #FF8A00
    background radial-gradient(#FFBE00, #FF8A00);
    font-size 32px
    color #FFF
    text-align center
</style>
