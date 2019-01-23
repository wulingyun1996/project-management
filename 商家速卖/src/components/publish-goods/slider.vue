<template>
  <div id="goodsBanner">
    <div v-if="goodImgs.length" class="slide-wrapper">
      <div class="slide-content">
        <swiper :show-dots="showDot">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in goodImgs" :key="index"><img @click="checkPhoto(index)" :src="item"></swiper-item>
        </swiper>
      </div>
    </div>
    <div v-if="goodImgs.length < 8" class="photo-btn" @click="goCheck"></div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'
  export default {
    props: {
      goodImgs: {
        type: Array
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    data() {
      return {
        currentIndex: 0
      }
    },
    computed: {
      showDot() {
        if (this.goodImgs.length > 1) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      goCheck() {
        this.$emit('goAddActive')
      },
      checkPhoto(index) {
        this.currentIndex = index
        this.$emit('goCheckActive', this.currentIndex)
      }
    }
  }
</script>

<style lang="stylus">
@import "~common/stylus/variable"
#goodsBanner
  position: relative
  overflow: hidden
  .photo-btn
    width: 100px;/*px*/
    height: 100px;/*px*/
    position: absolute
    left: 25px
    bottom: 25px
    background: url('./photo.png') $color-orange no-repeat center center
    background-size: 52px 42px;/*px*/
    border-radius: 50%
    z-index 10
  .slide-wrapper
    position: relative
    overflow: hidden
    height 350px
  .slide-content,
  .vux-slider,
  .vux-swiper
    height 100%!important
  .vux-slider
    .vux-swiper .vux-swiper-item
      display: flex
      justify-content: center
      align-items: center
      img
        display: block
        height 100%
        width 100%
    .vux-indicator, .vux-indicator-right
      bottom: 30px
      left: 50%
      transform: translateX(-50%)
      text-align: center
      a
        float: none
        display: inline-block
        margin-left: 18px
        .vux-icon-dot, .vux-icon-dot
          background: $color-white
          width: 16px;/*px*/
          height: 16px;/*px*/
          border-radius: 50%
          &.active
            background: $color-orange
</style>
