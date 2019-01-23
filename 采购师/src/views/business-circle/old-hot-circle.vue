<template>
  <div class="business-circle"  :class="{iphoneX: $isNeedFit, isIos: isIos}">
    <div v-if="hasData" class="share-box" @click="showShare" :class="{iphoneX: $isNeedFit,isIos: isIos}">
      <img src="./images/share.png" alt="">
    </div>
    <div v-if="hasData" class="hasData">
      <div class="bc-t">
        <img src="./images/business-title.png" alt="">
      </div>
      <div class="bs-scroll" :class="{iphoneX: $isNeedFit}">
        <base-scroll
        :hasMore='m_hasMore'
        :scrollPosY='m_scrollPosY'
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        :hasLoading="m_loading"
        :hasRefresh="m_refresh"
        @scrollToEnd="getData"
        :data="m_dataList">
          <div class="bs-l-w">
            <div class="bs-item" v-for="(bs, index) in m_dataList" :key="index">
              <div class="bs-banner-box" @click="goDetail(bs.id)">
                <div class="banner">
                  <img :src="bs.head_img" alt="">
                </div>
                <div class="bs-info">
                  <div class="bs-mask"></div>
                  <div class="bs-text">
                    <div class="top-num">Top{{index + 1}}</div>
                    <div class="bs-t-b">
                      <p>{{bs.group_name}}</p>
                      <p>
                       <span v-for="(tab, tabIndex) in bs.tab" :key="tabIndex">{{tab}}</span>
                      </p>
                    </div>
                    <div class="bs-arrow">
                      <img src="./images/arrow-right.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="bs-wrap">
                <div class="bs-act" v-if="bs.act_info.length != 0">
                  <div class="act-item" v-for="(act, index) in bs.act_info" :key="index" @click="goUnionDetail(act.id)">
                    <div class="act-dot"></div>
                    <span>活动</span>
                    <p>{{act.title}}</p>
                    <div class="act-arrow"><img src="./images/act-arrow.png" alt=""></div>
                  </div>
                </div>
                <div class="shop-wrap">
                  <div class="shop-item" v-for="(shop, index) in bs.shop_list" :key="index" @click="goShopDetail(shop.seller_id)" >
                    <div class="s-m-i">
                      <img :src="shop.shop_logo_path"  alt="">
                    </div>
                    <p>{{shop.shop_name}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </base-scroll>
      </div>
    </div>
    <div v-else class="hasNoData">
      <div>
        <img  src="./images/hasNoData.png" alt="">
      </div>
      <div>
        <p>各位看官</p>
        <p>偶们的商圈正在快马加鞭搭建中</p>
        <p>敬请期待哦~</p>
      </div>
    </div>
      <!-- 分享弹窗 -->
      <base-popup-share
        ref="share"
        @share='share'
         @shareUrl='shareUrl'
        :isFlashSale='true'>
      </base-popup-share>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import BasePopupShare from 'components/popup/popup-share'
import {invokeNativeMethod, updateLocation, dev} from 'native'
import { mixins } from 'mixins'
const USERID = window.sessionStorage.getItem('userId')
export default {
  mixins: [mixins],
  data () {
    return {
      hasData: true,
      shareImg: ''
    }
  },
  created () {
    this.getData()
    invokeNativeMethod('setAppBottomTab', 1)
    window.refreshWebView = this.refreshWebView
  },
  methods: {
    dev () {
      return dev()
    },
    getData () {
      if (!this.m_hasMore) return
      let url = 'union/groupList'
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      if (this.isShare && this.opCityShare) {
        obj.op_city_share = this.opCityShare
      }
      this.$http(url, obj)
        .then(res => {
          if (res.code === this.$ok) {
            this.shareImg = res.data.shareImage
            this.m_dataList = this.m_dataList.concat(res.data.data)
            this._checkMore(res.data)
            this.hasData = this.m_dataList.length !== 0
          }
        })
    },
    refreshWebView () {
      updateLocation().then(res => {
        this.m_hasMore = true
        this.m_page = 0
        this.m_dataList = []
        this.getData()
      })
    },
    goDetail (id) {
      this.isShare ? this.goDownLoad()
        : this.$router.push({
          path: '/circle-detail',
          query: {
            id
          }
        })
    },
    goUnionDetail (id) {
      this.isShare ? this.goDownLoad()
        : this.$router.push({
          path: '/unionDetail',
          query: {
            id
          }
        })
    },
    goShopDetail (id) {
      this.isShare ? this.goDownLoad()
        : this.$router.push({
          path: '/shop-detail',
          query: {
            id
          }
        })
    },
    back () {
      this.isShare ? this.goDownLoad() : this.$router.back()
    },
    showShare () {
      this.isShare ? this.goDownLoad() : this.$refs.share.show()
    },
    share (payload) {
      let obj = {}
      obj.type = payload
      obj.url = location.href + `?v=${+new Date()}` + '&op_city_share=' + window.sessionStorage.getItem('opCity')
      obj.title = '【热门商圈】'
      obj.discriable = '【建材采购师】精选热门商圈，精选大牌，品类齐全，价格抄底~'
      obj.imgUrl = this.shareImg
      if (payload === 1) {
        obj.title = '【建材采购师】精选热门商圈，精选大牌，品类齐全，价格抄底~'
      }
      invokeNativeMethod('share', JSON.stringify(obj), payload)
    },
    shareUrl () {
      let url = `${location.href}?v=${+new Date()}&op_city_share=${window.sessionStorage.getItem('opCity')}&shareId=${USERID}`
      invokeNativeMethod('copyToClipboard', url)
    },
    // 去下载页面
    goDownLoad () {
      if (this.isShare) {
        this.$router.push({
          path: '/app'
        })
        // return false
      }
    }
  },
  computed: {
    isShare () {
      return !!this.$route.query.shareId
    },
    title () {
      return this.isShare ? '热门商圈' : ''
    },
    isIos () {
      return this.dev() === 'iOS'
    },
    opCityShare () {
      return this.$route.query.op_city_share
    }
  },
  components: {
    BaseScroll,
    BasePopupShare
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.business-circle
  height 100%
  // padding-top 110px
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  &.isIos
    padding-top 44px
  &.iphoneX
    // padding-top 176px
    padding-top 64px
  .share-box
    position absolute
    top 20px
    right 20px
    &.isIos
      top 64px
    &.iphoneX
      top 84px
    img
      width 40px
  .hasData
    height 100%
    bg('bg-business-circle.png')
    .bc-t
      padding 40px 0 40px 0
      display flex
      justify-content center
      align-items center
      img
        width 358px
        height 130px
    .bs-scroll
      position absolute
      top 238px
      bottom 0
      left 0
      right 0
      &.iphoneX
        top 302px
      .bs-l-w
        padding 20px
        .bs-item
          margin-bottom 40px
          border-radius(10px)
          &:last-child
            margin-bottom 0
          .bs-banner-box
            height 216px
            position relative
            .banner
              height 100%
              overflow hidden
              img
                width 100%
            .bs-info
              position absolute
              top 0
              bottom 0
              left 0
              right 0
              .bs-mask
                height 100%
                background rgba(0,0,0,0.4)
              .bs-text
                position absolute
                top 0
                bottom 0
                left 0
                right 0
                z-index 100
                display flex
                justify-content space-between
                align-items center
                .top-num
                  fz(24px)
                  height 140px
                  color #FCDA98
                  bd-r(#ccc, 1px)
                  line-height 140px
                  padding 0 30px
                  font-weight bold
                .bs-t-b
                  flex 1
                  p
                    width 90%
                    margin 0 auto
                    &:first-child
                      color #ffffff
                      text-over(1)
                      fz(20px)
                      font-weight bold
                    &:last-child
                      line-height 3
                      span
                        color #EAA723
                        f12()
                        padding 5px 10px
                        bd(#EAA723, 1px)
                        border-radius(5px)
                        margin-right 10px
                        &:last-child
                          margin-right 0
                .bs-arrow
                  width 16px
                  height 30px
                  margin 0 20px 0 0
          .bs-wrap
            background #fff
            padding 0 20px
            // border-top-left-radius 10px
            // border-top-right-radius 10px
            .bs-act
              padding 14px 0
              .act-item
                display flex
                justify-content space-between
                align-items center
                margin 0 0 15px 0
                &:last-child
                  margin 0
                .act-dot
                  width 15px
                  height 15px
                  background: #FF8A00
                  border-radius(15px)
                span
                  color #D0021B
                  fz(10px)
                  bd(#D0021B,1px)
                  border-radius(4px)
                  padding 4px
                  margin 0 20px 0 10px
                p
                  flex 1
                  color #333
                  fz(13px)
                  text-over(1)
                .act-arrow
                  width 12px
            .shop-wrap
              padding 10px 0 20px 0
              display flex
              // align-content flex-start
              // height 200px
              // align-content space-between
              justify-content flex-start
              .shop-item
                // flex 1
                margin-right 30px
                box-shadow 0 6px 10px #f2f2f2
                &:last-child
                  margin 0
                .s-m-i
                  width 200px
                  height 160px
                  overflow hidden
                  img
                    width 100%
                p
                  text-align center
                  fz(13px)
                  color #000000
                  line-height 2
                  text-over(1)
  .hasNoData
    display flex
    flex-direction column
    align-items center
    padding-top 100px
    img
      wh(260px)
    div
      &:last-child
        margin-top 30px
      p
      text-align center
      font-size 32px;/*px*/
      color #999
      line-height 1.2
</style>
