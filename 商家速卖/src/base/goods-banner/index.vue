<template>
  <div class="goods-banner-container">
    <div class="goods-banner-wrapper" v-if="bannerLength">
      <div class="goods-banner-list">
        <swiper
          dots-position="center"
          :show-dots="bannerLength > 1">
          <swiper-item v-for="(bannerItem, index) in bannerList" :key="index">
            <img :src="bannerItem" @click="replaceCurrentGoodsBanner(index)">
          </swiper-item>
        </swiper>
      </div>
      <a href="javascript:" class="upload-banner" @click="uploadNewGoodsBanner" v-show="bannerLength < 8"></a>
    </div>
    <div class="goods-banner-placeholder" @click="uploadNewGoodsBanner" v-else></div>
  </div>
</template>

<script>
import { toJson } from 'commons'
import { Swiper, SwiperItem } from 'vux'
export default {
  props: {
    goodsBannerList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      bannerList: []
    }
  },
  computed: {
    bannerLength () {
      return this.bannerList.length
    }
  },
  created () {
    window.returnGoodsUrl = this.getNativeReturnedBannerList
  },
  methods: {
    // 替换当前图片
    replaceCurrentGoodsBanner (index) {
      let { $dev, bannerList } = this
      if ($dev === 1) {
        window.android.editPhotos(index, toJson(bannerList))
      } else if ($dev === 2) {
        let obj = {
          index,
          imgUrl: bannerList
        }
        window.webkit.messageHandlers.editPhotos.postMessage(obj)
      }
    },
    // 添加图片
    uploadNewGoodsBanner () {
      let { $dev, bannerLength, bannerList } = this
      let leftUploadedBannerLen = 8 - bannerLength
      if ($dev === 1) {
        window.android.addPhotos(leftUploadedBannerLen, toJson(bannerList))
      } else if ($dev === 2) {
        let obj = {
          index: leftUploadedBannerLen,
          imgUrl: bannerList
        }
        window.webkit.messageHandlers.addPhotos.postMessage(obj)
      }
    },
    // 获取原生返回的图片列表
    getNativeReturnedBannerList (list) {
      this.bannerList = list
      this.$emit('uploadedGoodsBanner', list)
    }
  },
  watch: {
    goodsBannerList (newVal) {
      this.bannerList = newVal
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.goods-banner-container
  position relative
  z-index 100
  overflow hidden
  min-height 280px
  .goods-banner-wrapper
    position relative
    overflow hidden
    height 750px
    .goods-banner-list
      wh(100%)
      position relative
      img
        display block
        wh(100%)
    .upload-banner
      position absolute
      wh(100px)
      left 25px
      bottom 25px
      background url(./images/add-banner.png) no-repeat center $color-orange
      background-size 52px 42px
      border-radius(50%)
      z-index 100
  .goods-banner-placeholder
    height 280px
    bg('banner.png')
</style>

<style lang="stylus">
@import "~common/stylus/variable"
.vux-slider,
.vux-swiper
  height 100%!important
.vux-indicator
  z-index 100
  bottom 30px!important
  a
    margin-left: 18px!important
    .vux-icon-dot
      background-color $color-white!important
      width 16px!important
      height 16px!important
      border-radius 50%!important
      &.active
        background $color-orange!important
</style>

