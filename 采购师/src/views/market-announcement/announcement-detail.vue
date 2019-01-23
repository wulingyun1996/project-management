<template>
  <div class="market-announcement-container" :class="{ 'iphone-x-bottom': $isX }">
    <base-header :title="headerTitle"></base-header>
    <div class="market-announcement-wrapper" :style="[backgroundColor]" v-show="!isDown">
      <base-scroll
        v-show="annouceFlag"
        :has-more="true"
        :before-scroll="true"
        @beforeScroll="beforeScroll">
        <div class="preview-wrapper">
          <div class="announcement-detail-logo" :style="borderColor" @click="goShopDetail">
            <div class="logo-left">
              <img :src="shopLogo" alt="" v-if="shopLogo">
              <img src="./images/icon-logo.png" alt="" v-else>
              <span :style="[textColor]">{{ shopName }}</span>
            </div>
            <div class="logo-right">
              <span :style="[shopColor]">进店逛逛</span>
            </div>
          </div>
          <div class="announcement-detail">
            <div id="market-annnoucement"></div>
          </div>
          <div class="shop-description" ref="logo" @click="goShopDetail">
            <div class="shop-logo">
              <img :src="shopLogo" alt="" v-if="shopLogo">
              <img src="./images/icon-logo.png" alt="" v-else>
            </div>
            <p :style="[textColor]">{{ shopName }}</p>
          </div>
        </div>
        <div ref="placeholder"></div>
      </base-scroll>
    </div>
    <!-- <div class="detail-down"> -->
    <div class="detail-down" v-show="isDown">
      <img src="./images/icon-no-data.png" alt="">
      <h1>内容不存在或被删除</h1>
    </div>
    <base-senior-popup height="auto" ref="popup" class="popup-wrapper" :stop="false">
      <div class="down-reason-wrapper">
        <div class="down-reason-header">下架原因</div>
        <div class="down-reason-body">
          <p class="reason">{{ downReason }}</p>
          <div class="down-reason-button" @click="goBack">返回</div>
        </div>
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
// import data from 'data/data'
import { closeWebview } from 'native'
import { themeBackgroundData } from 'data/backgroundData'
import { patch, createVnode } from 'plugins/snabbdom'
import { sliceChar } from 'common'
export default {
  name: 'AnnouncementDetail',
  data () {
    return {
      annouceFlag: false,
      themeBackground: '#ffffff',
      title: '',
      shopName: '',
      shopLogo: '',
      shopId: '',
      isBeforeScroll: true,
      announceDetail: '',
      // announceDetail: JSON.stringify(data),
      Vnode: '',
      downReason: '',
      isDown: false
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    headerTitle () {
      return sliceChar(this.title, 6)
    },
    backgroundColor () {
      return {
        background: this.themeBackground
      }
    },
    textColor () {
      let color
      let { themeBackground } = this
      if (themeBackground === '#ef6370') {
        color = '#ffffff'
      } else {
        color = '#333333'
      }
      return {
        color
      }
      // return {
      //   color: themeBackgroundData[this.themeBackground]
      // }
    },
    shopColor () {
      let color
      let { themeBackground } = this
      if (themeBackground === '#ef6370') {
        color = '#ffffff'
      } else {
        color = '#ff8a00'
      }
      return {
        color
      }
    },
    borderColor () {
      return {
        'border-bottom': `1px dashed ${themeBackgroundData[this.themeBackground]}`
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData().then(() => {
        // if (this.isDown) this.$refs.popup.show()
        let wrapper = document.getElementById('market-annnoucement')
        this.Vnode = wrapper
        let { announceDetail, themeBackground } = this
        if (announceDetail) {
          this.vnode2html(announceDetail, themeBackground)
        }
      })
    })
  },
  methods: {
    beforeScroll () {
      // if (!this.isBeforeScroll) return
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
      // this.isBeforeScroll = false
    },
    async getData () {
      let url = 'message/noticeDetail'
      let obj = {
        notice_id: this.id
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { title, template, content, is_delete, rejected_reason, seller_id } = res.data
          let { shop_name, shop_logo_path } = res.data.seller_info
          this.title = title
          this.themeBackground = template
          this.shopName = shop_name
          this.shopLogo = shop_logo_path
          this.shopId = seller_id
          this.announceDetail = content
          this.annouceFlag = true
          this.isDown = !is_delete
          this.downReason = rejected_reason
          /* eslint-enable */
        }
      })
    },
    goShopDetail () {
      this.$router.push({ name: 'ShopDetail', query: { id: this.shopId } })
    },
    goGoodsDetail (e) {
      let id = e.target.dataset.id
      this.$router.push({ name: 'GoodsDetail', query: { goodsId: id } })
    },
    goActivityDetail (e) {
      let id = e.target.dataset.id
      this.$router.push({ name: 'unionDetail', query: { id } })
    },
    // vnode2Html
    vnode2html (data, themeBackground) {
      let vnode = createVnode('div#market-annnoucement', JSON.parse(data), themeBackground, this.goGoodsDetail, this.goActivityDetail)
      patch(this.Vnode, vnode)
    },
    goBack () {
      closeWebview()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.market-announcement-container
  flex-col()
  height 100%
  overflow hidden
  .market-announcement-wrapper
    flex 1
    overflow hidden
  .preview-wrapper
    padding 0 30px
  .announcement-detail-logo
    flex-align-item()
    padding 16px 0
    margin-bottom 28px
    .logo-left
      flex 1
      flex-f-align()
      f14()
      img
        wh(100px)
        bd(#f4f4f4)
        box-sizing content-box
        border-radius(8px)
        margin-right 20px
      span
        line-height 40px
        flex 1
        text-over(1)
        f16()
    .logo-right
      f12()
      width 150px
      margin-left 20px
      span
        padding 20px 0
  .shop-description
    width 100%
    margin-top 20px
    text-align center
    .shop-logo
      width 100%
      flex-center()
      border-radius(8px)
      img
        bd(#f4f4f4)
        box-sizing content-box
        border-radius(8px)
        width 160px
        height 160px
    p
      font-size: 30px
      color: #333333
      letter-spacing: -0.36px
      margin-top 20px
  .announcement-detail
    //
  .detail-down
    tc()
    img
      width 240px
      height 180px
      display block
      margin 120px auto 40px
    h1
      f16()
      color #999
  .popup-wrapper
    > div
      width 560px!important
      min-height 360px!important
      top 530px
      border-radius(24px)
    .down-reason-wrapper
      .down-reason-header
        height 76px
        line-height 76px
        padding-left 32px
        f14()
        color #333
        background #F4F4F4
      .down-reason-body
        p
          color #D0021B
          padding 0 110px
          line-height 40px
          f14()
          margin 50px 0
          tc()
        .down-reason-button
          width 200px
          height 68px
          background #FF8A01
          border-radius(8px)
          f16()
          color #fff
          tc()
          line-height 68px
          margin 0 auto 36px
</style>
