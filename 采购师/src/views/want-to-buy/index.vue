<template>
  <div class="container iphone-x-bottom">
    <div class="tab-container">
      <tab class="nav-box" :line-width="2" custom-bar-width="80px">
        <tab-item :selected="currentTab === 0" @on-item-click="onItemClick">商品求购</tab-item>
        <tab-item :selected="currentTab === 1" @on-item-click="onItemClick">工程合作</tab-item>
      </tab>
    </div>
    <base-scroll
      class="want-to-bue-container"
      ref="scroll"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh"
      :scrollPosY="m_scrollPosY">
      <base-buy
        :wantBuy="m_dataList"
        :type="currentTab + 1"
        :show="true"
        @viewBigPic="viewBigPic">
      </base-buy>
    </base-scroll>
    <div class="placeholder"></div>
    <div class="want-to-buy-footer ipone-x-absolute-bottom1" @click="showPopup">
      <div class="footer-icon"></div>
      <div class="footer-description">发布求购</div>
    </div>
    <base-popup-transition ref="popup">
      <div class="wang-to-buy-nav" @click.self="hidePopup">
        <div class="wang-to-buy-category ipone-x-absolute-bottom2">
          <div class="category-top">
            <div class="wang-to-buy-goods" @click="publishWantToBuy(0)">
              <img src="./images/want-to-buy-goods.png" alt="">
              <p>商品求购</p>
            </div>
            <div class="enginee-cooperation" @click="publishWantToBuy(1)">
              <img src="./images/enginee-cooperation.png" alt="">
              <p>工程合作</p>
            </div>
          </div>
          <div class="category-bottom">
            <span @click="hidePopup"></span>
          </div>
        </div>
      </div>
    </base-popup-transition>
    <x-dialog
      :hide-on-blur="true"
      v-model="showBigPic"
      class="dialog-img">
      <div class="img-div">
        <img :src="imgPath" @click="showBigPic = false"/>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import BaseScroll from 'components/scroll/scroll'
import BaseBuy from 'components/want-to-buy/list-item'
import BasePopupTransition from 'components/popup/popup-transition'
import { goNativeWantToBuy, invokeNativeMethod } from 'native'
import { Tab, TabItem, XDialog } from 'vux'
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      currentTab: 0,
      showBigPic: false,
      imgPath: ''
    }
  },
  created () {
    goNativeWantToBuy(this.goNativeWantToBuy)
    let listInfo = this.$root.listInfo
    if (listInfo) {
      /* eslint-disable */
      let { m_loading, m_hasMore, m_refresh, m_page, m_dataList, currentTab } = listInfo
      this.m_loading = m_loading
      this.m_hasMore = m_hasMore
      this.m_refresh = m_refresh
      this.m_page = m_page
      this.m_dataList = m_dataList
      this.currentTab = currentTab
      /* eslint-enable */
    } else {
      this.getData(this.currentTab)
    }
  },
  methods: {
    onItemClick (i) {
      this.statusInit()
      this.currentTab = i
      this.$refs.scroll.scrollTo(0, 0)
      this.getData()
    },
    async getData () {
      if (!this.m_hasMore) return
      let url = 'asktobuy/askToBuyList'
      let obj = {
        type: this.currentTab === 0 ? 1 : 2,
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
        }
      })
    },
    viewBigPic (imgPath) {
      this.showBigPic = true
      this.imgPath = imgPath
    },
    publishWantToBuy (type) {
      let name = type === 0 ? 'WantToBuyGoods' : 'EngineeCooperation'
      this.$router.push({name})
    },
    showPopup () {
      this.$refs.popup.show()
    },
    hidePopup () {
      this.$refs.popup.hide()
    },
    goNativeWantToBuy () {
      invokeNativeMethod('needBuyHome', -1)
    }
  },
  beforeRouteLeave (to, from, next) {
    let listInfo
    let regName = /WantToBuyGoods|WantBuyDetail|EngineeCooperation/
    if (regName.test(to.name)) {
      listInfo = Object.create(null)
      listInfo.m_loading = this.m_loading
      listInfo.m_hasMore = this.m_hasMore
      listInfo.m_refresh = this.m_refresh
      listInfo.m_page = this.m_page
      listInfo.m_dataList = this.m_dataList
      listInfo.currentTab = this.currentTab
    } else {
      listInfo = null
      this.$route.meta.y = 0
    }
    this.$root.listInfo = listInfo
    next()
  },
  components: {
    BaseScroll,
    BaseBuy,
    BasePopupTransition,
    Tab,
    TabItem,
    XDialog
  }
}
</script>
<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/vux'
.container
  height 100%
  flex-col()
  position relative
  .tab-container
    max-height 94px
    .nav-box
      bd-b($color-f5, 2px)
  .want-to-bue-container
    flex 1
  .placeholder
    height 100px
    width 100%
  .want-to-buy-footer
    position absolute
    left 0
    bottom 0
    right 0
    flex-align-item()
    justify-content center
    foot-flex()
    fz(18px)
    .footer-icon
      width 60px
      height 52px
      bg('want-to-buy.png')
      margin-right 10px
.wang-to-buy-nav
  width 100%
  height 100%
  position relative
  bg('want-to-buy-bg.png')
  .wang-to-buy-category
    position absolute
    left 0
    right 0
    bottom 60px
    .category-top
      flex-s-btw()
      tc()
      img
        wh(160px)
        margin-bottom 12px
      >div
        width 160px
        p
          fz(13px)
          color $color-6
      .wang-to-buy-goods
        margin-left 144px
      .enginee-cooperation
        margin-right 144px
    .category-bottom
      margin-top 34px
      flex-f()
      justify-content center
      span
        wh(34px)
        bg('close-bottom.png')
.dialog-img
  width: 100%
  .weui-dialog
    width 96%
    max-width 96%
    border-radius(40px)
    img
      display block
      width 100%
</style>
