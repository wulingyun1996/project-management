<template>
  <div class="index-banner-detail-container">
    <transition name="has-data">
      <div class="banner-detail-wrapper" v-if="!hasNoData && flag">
        <base-header :title="title | sliceChar(8)">
          <div class="banner-detail-share" v-if="!isShared" @click="showShareGuide">分享</div>
        </base-header>
        <base-scroll
          :has-more="true"
          :before-scroll="true"
          @beforeScroll="beforeScroll">
          <div class="banner-list">
            <div
              class="banner-item"
              v-for="(item, index) in bannerList"
              :key="index"
              v-html="item.content">
            </div>
            <div ref="placeholder"></div>
          </div>
        </base-scroll>
      </div>
    </transition>
    <transition name="no-data">
      <div class="banner-detail-placeholder" v-if="hasNoData && flag">
        <base-header title="已过期"></base-header>
        <h2>哎呀，该活动已过期！</h2>
        <h3>可下载app查看更多其他活动</h3>
        <div class="download-guide" v-if="isShared && showGuide" id="downloadApp">
        </div>
      </div>
    </transition>
    <div class="share-popup" v-if="!isShared" v-show="isShowShareGuide" @click.self="hideShareGuide">
      <div class="share-content" :class="{ active: $isX }">
        <h2>
          <span>分享</span>
          <i @click="hideShareGuide"></i>
        </h2>
        <div class="share-list">
          <div class="item" ref="one" @click="share(0)">
            <img src="./images/img-wx.png">
            <p>微信好友</p>
          </div>
          <div class="item" ref="two" @click="share(1)">
            <img src="./images/img-circle.png">
            <p>朋友圈</p>
          </div>
          <div class="item" ref="three" @click="share(2)">
            <img src="./images/img-qq.png">
            <p>QQ好友</p>
          </div>
          <div class="item" ref="four" @click="share(3)">
            <img src="./images/img-qqzoom.png">
            <p>QQ空间</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sliceChar, judgeObjectLen, smallPic, splitHref } from 'common'
import { invokeNativeMethod } from 'native'
import { wxMixins, openInstallMixins } from 'mixins'
export default {
  name: 'BannerDetail',
  mixins: [wxMixins, openInstallMixins],
  data () {
    return {
      hasNoData: false,
      flag: false,
      showGuide: true,
      title: '',
      bannerUrl: '',
      bannerList: [],
      isShowShareGuide: false
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    // 是否通过分享判断
    isShared () {
      return this.$route.query.bannerShareId
    },
    // 原生添加分享 id
    sharedId () {
      return this.$route.query.shareId
    }
  },
  created () {
    this.getBannerDetail()
  },
  mounted () {
    if (this.isShared) {
      this.openAppByOpenInstall()
    }
  },
  methods: {
    beforeScroll () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    },
    getBannerDetail () {
      const { id, isShared, provinceId, cityId } = this
      const url = 'home/bannerImageText'
      let obj = {
        keyword: id,
        opProvince: provinceId,
        opCity: cityId
      }
      if (isShared) {
        obj.keyword = isShared
      }
      this.$http(url, obj).then(res => {
        let { code, data } = res
        if (code === this.$ok) {
          this.title = data.title
          this.bannerUrl = data.image_path
          this.handlerBannerDetail(data.content)
          this.bannerList = data.content
        }
        if (code === 400) {
          this.hasNoData = true
        }
        if (isShared) {
          let obj = {
            title: data.title,
            desc: '让采购更简单！',
            imgUrl: smallPic(data.image_path, 200, 200)
          }
          this.wxShare(obj)
        }
        this.flag = true
      })
    },
    handlerBannerDetail (data) {
      data.forEach(item => {
        let { type, data } = item
        let str = ''
        if (type === 2) {
          data.forEach(child => {
            str += `
              <div class="banner-shop-item" data-id="${child.seller_id}" data-type="${type}">
                <img src="${child.url}" data-id="${child.seller_id}" data-type="${type}"/>
              </div>
            `
          })
          item.content = `<div class="index-banner-shop-container">${str}</div>`
        }
        if (type === 3) {
          data.forEach(child => {
            str += `
              <div class="banner-goods-item" data-id="${child.id}" data-type="${type}">
                <img src="${child.url}" data-id="${child.id}" data-type="${type}"/>
              </div>
            `
          })
          item.content = `<div class="index-banner-goods-container">${str}</div>`
        }
      })
    },
    getCurrentTypes (e) {
      let { dataset } = e.target
      let { isShared, sharedId, provinceId, cityId } = this
      if (judgeObjectLen(dataset)) {
        let { type, id } = dataset
        if (type === '2') {
          if (isShared) {
            this.$push({ name: 'ShopDetail', query: { id, shareId: sharedId, provinceId, cityId } })
            return
          }
          this.$push({ name: 'ShopDetail', query: { id } })
          return
        }
        if (isShared) {
          this.$push({ name: 'GoodsDetail', query: { goodsId: id, isShare: sharedId, sharedId, provinceId, cityId } })
          return
        }
        this.$push({ name: 'GoodsDetail', query: { goodsId: id } })
      }
    },
    share (payload) {
      let { title, id, bannerUrl, provinceId, cityId } = this
      let obj = {}
      obj.type = payload
      obj.url = splitHref(`bannerShareId=${id}&provinceId=${provinceId}&cityId=${cityId}`)
      obj.title = title
      obj.discriable = ''
      obj.imgUrl = smallPic(bannerUrl, 200, 200)
      obj.from = 20
      invokeNativeMethod('share', JSON.stringify(obj))
      this.hideShareGuide()
    },
    showShareGuide () {
      this.isShowShareGuide = true
      setTimeout(() => {
        this.$refs.one.style.transform = 'scale(1)'
      }, 400)
      setTimeout(() => {
        this.$refs.two.style.transform = 'scale(1)'
      }, 600)
      setTimeout(() => {
        this.$refs.three.style.transform = 'scale(1)'
      }, 800)
      setTimeout(() => {
        this.$refs.four.style.transform = 'scale(1)'
      }, 1000)
    },
    hideShareGuide () {
      this.isShowShareGuide = false
      this.$refs.one.style.transform = 'scale(0)'
      this.$refs.two.style.transform = 'scale(0)'
      this.$refs.three.style.transform = 'scale(0)'
      this.$refs.four.style.transform = 'scale(0)'
    }
  },
  filters: {
    sliceChar
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.index-banner-detail-container
  height 100%
  .banner-detail-wrapper
    height 100%
    overflow hidden
    flex-col()
    background #fff
    position relative
    .banner-detail-share
      color #4A90E2
      f14()
      height 100%
      flex-center()
    .scroll-container
      flex 1
    .index-banner-goods-container,
    .index-banner-shop-container
      flex-f()
      > div
        flex 1
      img
        display block
        width 100%
        height auto
        margin 0
  .banner-detail-placeholder
    height 100%
    overflow hidden
    flex-col()
    background #fff
    color $color-orange
    tc()
    f16()
    position relative
    h2
      margin-top 500px
      line-height 40px
    .download-guide
      position absolute
      height 96px
      width 100%
      left 0
      bottom 0
      right 0
      bg('bg-guide.png')
      flex-f-align()
      .icon-close
        box-sizing content-box
        wh(43px)
        bg('icon-close.png')
        padding 20px
        background-origin content-box
        background-clip content-box
  .share-popup
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    z-index 1000
    background rgba(0, 0, 0, .5)
  .share-content
    position fixed
    left 0
    right 0
    bottom 0
    width 100%
    opacity .9
    background #fff
    z-index 10001
    padding 30px
    &.active
      padding-bottom 64px
    h2
      color $color-3
      f14()
      line-height 40px
      flex-align-item()
      margin-bottom 40px
      i
        wh(30px)
        bg('close.png')
    .share-list
      flex-align-item()
    .item
      transform scale(0)
      transition all 0.4s ease-in
      p
        flex 1
        color $color-3
        f12()
        tc()
      img
        height 120px
        width 120px
        margin-bottom 15px
</style>
