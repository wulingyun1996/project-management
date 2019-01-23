<template>
  <div slot="content" id="goodsBanner">
    <div v-if="goodImgs.length" class="slide-wrapper">
      <div class="slide-content">
        <swiper :aspect-ratio="750/750" :show-dots="showDot" :loop="true" @on-index-change="setCurIndex">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in goodImgs" :key="index"><img @click="checkPhoto(index)" :src="item.image_path"></swiper-item>
        </swiper>
      </div>
    </div>
    <div class="num">{{currentIndex + 1}}/{{goodImgs.length}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
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
      setCurIndex(num) {
        this.currentIndex = num
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  #goodsBanner
    position: relative
    overflow: hidden
    height 720px
    .num
      position: absolute
      right: 26px
      bottom: 20px
      background-color: rgba(0, 0, 0, .5)
      border-radius: 20px
      width: 76px;/*px*/
      line-height: 40px;/*px*/
      color: $color-white
      text-align: center
      font-size: 26;/*px*/
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
      height 720px!important
    .vux-slider
      height 720px!important
      .vux-swiper .vux-swiper-item
        display: flex
        justify-content: center
        align-items: center
        height 720px!important
        img
          width 100%
          height 100%
          display: block
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
