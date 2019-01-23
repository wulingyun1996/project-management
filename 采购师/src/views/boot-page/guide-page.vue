<template>
  <div class="register-container" :style="{'margin-top': isFullScreen ? '-12px' : '0'}">
    <div v-if="isVideo" class="video-area" :class="isFullScreen ? 'fullscreen' : ''">
      <div class="video-content" @click="showControlArea">
        <div class="mask" v-show="isPaused">
        </div>
        <!-- <img class="img" ref="img" :src="videoUrl" alt=""> -->
        <div class="pause" @click="play" v-show="isPaused">
          <img :src="require('./images/video_play.png')" alt="">
        </div>
        <video ref="media" id="media" :src="mediaSrc" preload="meta" :poster="videoUrl" webkit-playsinline playsinline>
        </video>
        <div class="control-area" v-show="isShowControlArea">
          <img @click="play" :src="isPaused ? require('./images/video_play.png') : require('./images/video_pause.png')" alt="">
          <div class="current-duration">
            {{currentDuration}}
          </div>
          <div class="progress" ref="progress">
            <div class="inner" ref="inner">
            </div>
            <div class="outer" ref="outer">
            </div>
          </div>
          <div class="duration">
            {{ this.duration }}
          </div>
          <!-- <div class="toggle-fullscreen" @click="toggleFullScreen">
            <img :src="isFullScreen ? require('./images/video_fullscreen_close.png') : require('./images/video_fullscreen_open.png')" alt="">
          </div> -->
        </div>
      </div>
    </div>
    <div v-if="!isVideo">
      <img :src="imgSrc" alt="" width="100%;">
    </div>
    <section class="item" v-for="(item, index) in list" :key="index">
      <div class="title">
        <img :src="item.img" alt="">
        <div class="label">
          {{item.title}}
        </div>
      </div>
      <div class="bg" @click="jump(item)">
        <img :src="item.bg" alt="">
      </div>
    </section>
    <div class="logo" ref="logo" @click="login">
      <img src="./images/logo.png" alt="">
    </div>
  </div>
</template>

<script>
import {STATUS_OK} from '@/api/status'
import { dev } from 'native'
export default {
  data () {
    return {
      adv: {},
      mediaSrc: '',
      media: null,
      imgSrc: '',
      isPaused: true,
      timer: null,
      width: 0,
      currentWidth: 0,
      canPlay: false,
      isShowControlArea: false,
      duration: '',
      currentDuration: '00:00',
      isFullScreen: false,
      list: [],
      isVideo: false,
      left: 0,
      top: 0,
      url: '',
      videoUrl: ''
    }
  },
  async mounted () {
    window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             function (callback) {
               window.setTimeout(callback, 1000 / 60)
             }
    })()
    let res = await this.$http('homepage/getList')
    if (res.code === STATUS_OK) {
      res = res.data
      this.isVideo = res.topadv.is_video === 1
      this.$nextTick(function () {
        if (this.isVideo) {
          this.videoUrl = res.topadv.video_image_title
          this.mediaSrc = res.topadv.pic_and_text
          this.media = document.getElementById('media')
          this.width = getComputedStyle(this.$refs.inner, null).width
          // const self = this;
          // (function () {
          //   const init = function () {
          //     const video = document.getElementById('media')
          //     const captureImage = function () {
          //       const canvas = document.createElement('canvas')
          //       canvas.width = video.videoWidth
          //       canvas.height = video.videoHeight
          //       canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          //       self.$refs.img.src = canvas.toDataURL('image/jpeg', 1)
          //     }
          //     video.addEventListener('loadeddata', captureImage)
          //   }
          //   init()
          // })()
          this.media.addEventListener('ended', (e) => {
            this.isShowControlArea = true
            this.isPaused = true
          })
          this.media.addEventListener('canplay', () => {
            this.duration = this.formate(this.media.duration)
            this.canPlay = true
          })
          this.media.addEventListener('timeupdate', (e) => {
            this.currentDuration = this.formate(this.media.currentTime)
            requestAnimationFrame(() => {
              this.currentWidth = Number(this.media.currentTime) / Number(this.media.duration)
              this.$refs.outer.style.width = this.currentWidth * 100 + '%'
            })
          }, false)
          const progress = this.$refs.progress
          progress.addEventListener('touchstart', (e) => {
            clearTimeout(this.timer)
          })
          progress.addEventListener('touchmove', (e) => {
            if (!this.canPlay) return
            requestAnimationFrame(() => {
              this.currentWidth = e.touches[0].pageX - progress.getBoundingClientRect().x
              if (this.currentWidth > getComputedStyle(this.$refs.inner, null).width.split('px')[0]) {
                this.currentWidth = getComputedStyle(this.$refs.inner, null).width.split('px')[0]
              }
              this.$refs.outer.style.width = this.currentWidth / getComputedStyle(this.$refs.inner, null).width.split('px')[0] * 100 + '%'
              this.media.currentTime = parseInt(this.currentWidth / getComputedStyle(this.$refs.inner, null).width.split('px')[0] * this.media.duration)
              this.currentDuration = this.formate(this.media.currentTime)
            })
          })
          progress.addEventListener('touchend', (e) => {
            this.timer = setTimeout(() => {
              this.isShowControlArea = false
            }, 3000)
          })
        } else {
          this.imgSrc = res.topadv.image
          this.url = res.topadv.url
        }
        const logo = this.$refs.logo
        const width = document.documentElement.clientWidth
        const height = document.documentElement.clientHeight
        const logoWidth = Number(getComputedStyle(logo, null).width.split('px')[0])
        const logoHeight = Number(getComputedStyle(logo, null).height.split('px')[0])
        const finger = {x: 0, y: 0}
        logo.addEventListener('touchstart', function (e) {
          this.x = e.touches[0].pageX
          this.y = e.touches[0].pageY
          finger.x = this.x - logo.getBoundingClientRect().x
          finger.y = this.y - logo.getBoundingClientRect().y
        })
        logo.addEventListener('touchmove', function (e) {
          requestAnimationFrame(() => {
            this.left = e.touches[0].pageX - finger.x
            this.top = e.touches[0].pageY - finger.y
            if (this.left <= 0) {
              this.left = 0
            }
            if (this.left + logoWidth >= width) {
              this.left = width - logoWidth
            }
            if (this.top <= 0) {
              this.top = 0
            }
            if (this.top + logoHeight >= height) {
              this.top = height - logoHeight
            }
            logo.style.left = this.left + 'px'
            logo.style.top = this.top + 'px'
          })
        })
        logo.addEventListener('touchend', function (e) {
          setTimeout(() => {
            logo.style.left = width - logoWidth + 'px'
            logo.style.top = this.top + 'px'
          }, 20)
        })
        this.list = [
          {img: require('./images/boot_custom.png'), title: res.customerguide.title, bg: res.customerguide.image, id: res.customerguide.id, path: '/custom-boot-page'},
          {img: require('./images/boot_business.png'), title: res.businessguide.title, bg: res.businessguide.image, id: res.businessguide.id, path: '/cppb-boot-page'},
          {img: require('./images/boot_cgs.png'), title: res.sellerguide.title, bg: res.sellerguide.image, id: res.sellerguide.id, path: '/business-boot-page'}
        ]
      })
    } else {
      this.$t(res.message, 'bottom')
    }
  },
  methods: {
    login () {
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
    },
    jump (item) {
      this.$router.push({path: item.path, query: {id: item.id, title: item.title}})
    },
    toggleFullScreen () {
      this.isFullScreen = !this.isFullScreen
    },
    formate (time) {
      time = parseInt(time)
      let x, y
      x = parseInt(time / 60) >= 10 ? parseInt(time / 60) : `0${parseInt(time / 60)}`
      y = time % 60 >= 10 ? time % 60 : `0${time % 60}`
      return x + ':' + y
    },
    showControlArea () {
      this.isShowControlArea = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isShowControlArea = false
      }, 3000)
    },
    play () {
      console.log('play')
      clearTimeout(this.timer)
      if (this.isPaused) {
        this.timer = setTimeout(() => {
          this.isShowControlArea = false
        }, 3000)
        this.media.play()
        this.isPaused = false
      } else {
        this.isShowControlArea = true
        this.media.pause()
        this.isPaused = true
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.register-container
  padding-bottom 40px
  background #eeeeee
  height 100%
  overflow-y auto
.video-area
  padding 80px 88px 36px 88px; /*px*/
  background url('./images/video_bg.png') no-repeat
  background-size 100% 100%
  .video-content
    height 324px
    position relative
    border 3px solid #1A0E01;/*no*/
    box-shadow: 0 2px 14px 0 rgba(51, 51, 51, .5); /*no*/
    margin 0 auto
    .progress
      position relative
      flex 1
      height 100%
      .inner
        position absolute
        width 100%
        height 6px
        border-radius 16px
        background #F1F1F1
        top 50%
        transform translateY(-50%)
      .outer
        position absolute
        border-radius 16px
        background  #FF8A00
        height 6px
        top 50%
        transform translateY(-50%)
        z-index 3
        &:after
          content ''
          position absolute
          width 24px
          height 24px
          transform scale(.5)
          right -15px
          top -10px
          border-radius 50%
          background-image: linear-gradient(-180deg, #FFBE00 0%, #FF8A00 100%)
          border 1px solid rgba(255,255,255,0.30) /*no*/
    .mask
      width 100%
      height 100%
      position absolute
      left 0
      top 0
      z-index 10
      background rgba(51, 51, 51, .5)
    .img
      width 100%
      height 100%
      position absolute
      left 0
      top 0
      z-index 5
    video
      width 100%
      height 100%
      object-fit fill
    .pause
      position absolute
      width 96px
      height 96px
      left 50%
      top 50%
      background rgba(51, 51, 51, .7)
      border-radius 50%
      display flex
      align-items center
      justify-content center
      transform translate(-50%, -50%)
      border 2px solid #FFF; /*no*/
      z-index 20
      img
        margin-left 6px
        width 28px
        height 38px
.control-area
  z-index 20
  position absolute
  background rgba(0, 0, 0, .7)
  left 0
  bottom 0
  width 100%
  height 52px
  display flex
  align-items center
  img
    width 24px
    height 24px
    margin-left 24px
    margin-right 12px
  .current-duration
  .duration
    color #FFF
    margin 0 14px 0 12px
  .duration
    margin-right 0
  .toggle-fullscreen
    >img
      width 24px
      height 24px
.item
  margin-top 12px;/*no*/
  padding 0 32px
  .bg
    height 300px
    >img
      width 100%
      height 100%
  .title
    text-align center
    margin-bottom 24px
    position relative
    .label
      position absolute
      font-weight bold
      height 84px
      top 0
      left 200px
      line-height 84px
      color #ffffff
      font-size 32px
    img
      height 84px
      width 400px
.fullscreen
  padding 0!important
  background rgba(0, 0, 0, .7)
  position fixed
  width 100vw
  height 100vh
  display flex
  align-items center
  z-index 99999
  .video-content
    width 100%
    height 421.875px
    .control-area
      bottom -1px;/*no*/
.item:nth-of-type(1)
  .label
    left 215px
    width 320px
.item:nth-of-type(2)
  .label
    width 340px
    left 190px
.item:nth-of-type(3)
  .label
    width 270px
    left 230px
    margin-top 8px
.logo
  position fixed
  right 0
  top 600px
  z-index 99999999
  img
    width 147px
    height 165px
</style>
