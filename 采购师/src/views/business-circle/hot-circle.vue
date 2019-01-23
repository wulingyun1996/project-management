<template>
  <div class="hot-cirle-container">
    <div class="cirle-banner" v-show="bannerShow">
      <img src="./images/icon-banner.png" alt="">
    </div>
    <div class="cirle-nav">
      <div class="cirle-tab" :class="{ 'ipone-x': isIponeX, 'ipone': isPone }">
        <div class="left-tab" :class="{ active: currentTab === 0 }" @click="toggleTab(0)">
          <div class="left-img" :class="{ leftActive: currentTab === 0 }"></div>
          <span class="left-info" :class="{ infoActive: currentTab === 0 }">热门商圈</span>
        </div>
        <div class="right-tab" :class="{ active: currentTab === 1 }" @click="toggleTab(1)">
          <div class="content-img" :class="{ rightActive: currentTab === 1 }"></div>
          <span class="content-info" :class="{ infoActive: currentTab === 1 }">圈内商家</span>
        </div>
      </div>
      <div class="cirle-search" v-show="false" @click="goSearch">
        <img src="./images/icon-search.png" alt="">
        <span>搜索店铺名称</span>
      </div>
    </div>
    <!-- 商家的导航 -->
    <div class="merchant-tab" v-show="false">
      <div class="merchant-left-tab" :class="{ merchantActive: merchantTab === 0 }" @click="shopTab(0)">全部</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-center-tab" :class="{ merchantActive: merchantTab === 1 }" @click="shopTab(1)">圈内商家</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-right-tab" :class="{ merchantActive: merchantTab === 2 }" @click="shopTab(2)">
        认证佣金
        <div class="arrow">
          <div class="first-arrow" @click="getSortTop">
            <div class="arrow-top" :class="{ upActive: sortShow }"></div>
          </div>
          <div class="last-arrow" @click="getSortBottom">
            <div class="arrow-bottom" :class="{ downActive: sortShow }"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-line" v-show="false"></div>
    <!-- 热门商圈页面 -->
    <div class="hot-cirle" v-if="currentTab === 0">
      <base-scroll
      @scroll="scroll"
      :probeType='3'
      :listenScroll='true'
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
        <ul>
          <li v-for="item in m_dataList" :key="item.id" @click="goUnionDetail(item.id)">
            <div class="left">
              <img :src="item.head_img" alt="">
            </div>
            <div class="right">
              <div class="circle-tag">
                <div class="tag-hige" v-for="(tagItem, index) in item.tips" :key="index">
                  <img v-show="tagItem === '1'" src="./images/icon-hige.png" alt="">
                  <img v-show="tagItem === '2'" src="./images/icon-sift.png" alt="">
                  <img v-show="tagItem === '3'" src="./images/icon-moods.png" alt="">
                </div>
                <!-- <div class="tag-sift">
                  <img src="./images/icon-sift.png" alt="">
                </div>
                <div class="tag-moods">
                  <img src="./images/icon-moods.png" alt="">
                </div> -->
              </div>
              <div class="right-top">{{ item.group_name }}</div>
              <div class="right-count">圈内商家数: {{ item.shops_count }}</div>
              <div class="right-brand">
                <p v-for="(brandItem, index) in item.tab.slice(0, 2)" :key="index">{{ brandItem }}</p>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
    </div>
    <!-- 热门商家页面 -->
    <div class="hot-merchant" v-else-if="currentTab === 1">
      <div class="all-merchant" v-if="merchantTab === 0">
        <base-scroll
        ref="delegateScroll"
        @scroll="scroll"
        :probeType='3'
        :listenScroll='true'
        :data="m_dataList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getCircleMerchantData"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh">
          <ul>
            <li v-for="item in m_dataList" :key="item.id" @click="goCircleDetail(item.seller_id, item.groups_count)">
              <div class="left">
                <img :src="item.shop_logo_path" alt="">
              </div>
              <div class="right" :class="{ active: item.audit_status === 2 || item.one_discount === null }">
                <div class="right-top">
                  <img src="./images/icon-approae-two.png" v-show="item.audit_status === 2" alt="">
                  <p>{{ item.shop_name }}</p>
                </div>
                <div class="right-content">
                  <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                  <span v-show="item.groups_count !== 0">所属商圈: {{ item.groups_count }}</span>
                  <span v-show="item.goods_count !== 0">商品数: {{ item.goods_count }}</span>
                </div>
                <div class="right-tag">
                  <div class="right-tag-new" v-show="item.is_new === 1">
                    <img src="./images/icon-new.png" alt="">
                  </div>
                  <div class="right-tag-boutique" v-show="item.is_boutique === 1">
                    <img src="./images/icon-boutique.png" alt="">
                  </div>
                  <div class="right-tag-materials" v-show="item.is_material === 1">
                    <img src="./images/icon-materials.png" alt="">
                  </div>
                </div>
                <!-- <div class="right-footer" v-if="item.audit_status === 1">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>认证优惠再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>审核中</span>
                </div> -->
                <!-- <div class="right-bottom" v-if="item.audit_status === 2">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>下定可再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>已认证</span>
                </div> -->
                <div class="footer" v-if="(item.audit_status === 0 && item.one_discount !== null) || item.audit_status === 1">
                  <div class="left-sgin">
                    <img src="./images/icon-sign.png" alt="">
                    <span>认证店铺低价购买+蜂蜜奖励</span>
                  </div>
                  <div class="right-sgin">
                    <img class="line" src="./images/icon-line.png" alt="">
                    <span v-show="item.audit_status === 0 && item.one_discount !== null">去认证</span>
                    <span v-show="item.audit_status === 1">审核中</span>
                    <img class="arrow" src="./images/icon-arrow.png" alt="">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </base-scroll>
      </div>
      <div class="circle-merchant" v-else-if="merchantTab === 1">
        <base-scroll
        v-show="!noData"
        @scroll="scroll"
        :probeType='3'
        :listenScroll='true'
        ref="delegateScroll"
        :data="m_dataList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getCircleMerchantData"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh">
          <ul>
            <li v-for="item in m_dataList" :key="item.id" @click="goCircleDetail(item.seller_id, item.groups_count)">
              <div class="left">
                <img :src="item.shop_logo_path" alt="">
              </div>
              <div class="right">
                <div class="right-top">
                  <p>{{ item.shop_name }}</p>
                </div>
                <div class="right-content">
                  <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                  <span v-show="item.groups_count !== 0">所属商圈: {{ item.groups_count }}</span>
                  <span v-show="item.goods_count !== 0">商品数: {{ item.goods_count }}</span>
                </div>
                <div class="right-footer" v-if="item.audit_status === 1">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>认证优惠再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>审核中</span>
                </div>
                <div class="right-bottom" v-if="item.audit_status === 2">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>下定可再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>已认证</span>
                </div>
                <div class="footer" v-if="item.one_discount !== null">
                  <div class="left-sgin">
                    <img src="./images/icon-sign.png" alt="">
                    <span>认证优惠再返 佣金 xx%</span>
                  </div>
                  <div class="right-sgin">
                    <img class="line" src="./images/icon-line.png" alt="">
                    <span>去认证</span>
                    <img class="arrow" src="./images/icon-arrow.png" alt="">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </base-scroll>
        <div class="no-data" v-show="noData">
          <img src="./images/icon-circle.png" alt="">
          <p>圈内商家正在努力搭建中</p>
        </div>
      </div>
      <div class="attestation" v-else-if="merchantTab === 2">
        <base-scroll
        @scroll="scroll"
        :probeType='3'
        :listenScroll='true'
        v-show="!specialData"
        ref="delegateScroll"
        :data="specialList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getSpecialData"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh">
          <ul>
            <li v-for="item in specialList" :key="item.id" @click="goCircleDetail(item.seller_id, item.groups_count)">
              <div class="left">
                <img :src="item.shop_logo_path" alt="">
              </div>
              <div class="right">
                <div class="right-top">
                  <p>{{ item.shop_name }}</p>
                </div>
                <div class="right-content">
                  <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                  <span v-show="item.groups_count !== 0">所属商圈: {{ item.groups_count }}</span>
                  <span v-show="item.goods_count !== 0">商品数: {{ item.goods_count }}</span>
                </div>
                <div class="right-footer" v-if="item.audit_status === 1">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>认证优惠再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>审核中</span>
                </div>
                <div class="right-bottom" v-if="item.audit_status === 2">
                  <div class="left-sgin">
                    <img src="./images/icon-origin.png" alt="">
                    <span>下定可再返佣金{{ item.one_discount }}%</span>
                  </div>
                  <span>已认证</span>
                </div>
                <div class="footer" v-if="item.one_discount !== null">
                  <div class="left-sgin">
                    <img src="./images/icon-sign.png" alt="">
                    <span>认证优惠再返 佣金 xx%</span>
                  </div>
                  <div class="right-sgin">
                    <img class="line" src="./images/icon-line.png" alt="">
                    <span>去认证</span>
                    <img class="arrow" src="./images/icon-arrow.png" alt="">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </base-scroll>
        <div class="no-data" v-show="specialData">
          <img src="./images/icon-product.png" alt="">
          <p>暂时还没有可认证的商家</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateLocation, invokeNativeMethod } from 'native'
import { mixins } from 'mixins'
export default {
  name: 'HotCircle',
  mixins: [mixins],
  data () {
    return {
      // 缺省页显示与隐藏
      noData: false,
      specialData: false,
      currentTab: 0,
      specialList: [],
      // 商家的tab
      merchantTab: 0,
      // 排序的高亮显示
      sortShow: false,
      // banner是否隐藏
      bannerShow: true,
      sort: 1,
      isIponeX: '',
      flag: true
    }
  },
  created () {
    this.getData()
    invokeNativeMethod('setAppBottomTab', 1)
    window.refreshWebView = this.refreshWebView
    window.viewDidAppear = this.viewDidAppear
  },
  methods: {
    // 商圈和商家的tab切换
    toggleTab (i) {
      if (this.currentTab === i) return
      this.currentTab = i
      this.initData()
      if (i === 0) {
        this.m_dataList = []
        this.sortShow = false
        this.getData()
      } else {
        this.m_dataList = []
        this.sortShow = false
        this.merchantTab = 0
        this.getCircleMerchantData()
      }
    },
    // 全部 圈内商家 认证 tab切换
    shopTab (i) {
      if (this.merchantTab === i) return
      this.merchantTab = i
      this.initData()
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      if (i === 0) {
        this.m_dataList = []
        this.sortShow = false
        this.getMerchantData()
      } else if (i === 1) {
        this.m_dataList = []
        this.sortShow = false
        this.getCircleMerchantData()
      } else {
        this.specialList = []
        this.sortShow = false
        this.sort = 1
        this.getSortTop()
      }
    },
    // 热门商圈的列表
    async getData () {
      if (!this.m_hasMore) return
      let url = 'union/groupList'
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        // console.log(res)
        if (res.code === this.$ok) {
          // this.circleList = res.data.data
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.m_refresh = false
        }
      })
    },
    // 热门商家的全部的列表
    async getMerchantData () {
      if (!this.m_hasMore) return
      let url = 'union/groupSeller'
      let obj = {
        page: ++this.m_page,
        page_size: this.m_pageSize,
        is_group: 0,
        is_sort: 0
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.merchantList = res.data.data
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.m_refresh = false
        }
      })
    },
    // 圈内商家列表
    async getCircleMerchantData () {
      if (!this.m_hasMore) return
      let url = 'union/groupSeller'
      let obj = {
        page: ++this.m_page,
        page_size: this.m_pageSize,
        is_group: 1,
        is_sort: 0
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.circleMerchantList = res.data.data
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          if (!this.m_dataList.length) {
            this.noData = true
          }
          this._checkMore(res.data)
          this.m_refresh = false
        }
      })
    },
    // 特约认证的列表
    async getSpecialData () {
      if (!this.m_hasMore) return
      let url = 'union/groupSeller'
      let obj = {
        page: ++this.m_page,
        page_size: this.m_pageSize,
        is_group: 0,
        is_sort: this.sort
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.specialList = res.data.data
          this.specialList = [...this.specialList, ...res.data.data]
          if (!this.specialList.length) {
            this.specialData = true
          }
          // this._checkMore(res.data)
          this.m_loading = true
          this.dataTotalNum = res.data.total
          if (!this.specialList.length || (this.m_page * this.m_pageSize) >= this.dataTotalNum) {
            this.m_loading = false
            this.m_hasMore = false
          }
          this.m_refresh = false
        }
      })
    },
    // 下排序
    async getSortBottom () {
      if (!this.flag) return
      let that = this
      if (this.flag) {
        if (this.merchantTab !== 2) return
        this.specialList = []
        this.initData()
        this.sortShow = true
        this.sort = 2
        this.getSpecialData()
        this.flag = false
      }
      setTimeout(function () {
        that.flag = true
      }, 1000)
    },
    // 上排序
    async getSortTop () {
      if (!this.flag) return
      let that = this
      if (this.flag) {
        if (this.merchantTab !== 2) return
        this.specialList = []
        this.sortShow = false
        this.initData()
        this.sort = 1
        this.getSpecialData()
        this.flag = false
      }
      setTimeout(function () {
        that.flag = true
      }, 1000)
    },
    refreshWebView () {
      updateLocation().then(res => {
        this.m_hasMore = true
        this.m_page = 0
        this.m_dataList = []
        this.getData()
      })
    },
    viewDidAppear () {
      invokeNativeMethod('setTitle', '商圈')
    },
    // 圈子详情页
    goUnionDetail (id) {
      this.$router.push({
        path: '/circle-detail',
        query: {
          id
        }
      })
    },
    // 去搜索页
    goSearch () {
      this.$router.push('/circle-search')
    },
    scroll (payload) {
      let posY = payload.y
      if (posY > -10) {
        this.bannerShow = true
        this.isIponeX = ''
      } else {
        this.isIponeX = this.$isX
        this.bannerShow = false
      }
      // this.bannerShow = false
    },
    // 去详情页
    goCircleDetail (id) {
      this.$router.push({ path: '/shop-detail', query: { id } })
    },
    pullDownHotcircle () {
      this.statusInit()
      this.m_refresh = true
      this.getMerchantData().then(() => {
        this.m_refresh = false
      })
    },
    pullDownCircle () {
      this.statusInit()
      this.m_refresh = true
      this.getCircleMerchantData().then(() => {
        this.m_refresh = false
      })
    },
    pullDownSpecial () {
      this.specialList.length = 0
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      this.m_refresh = true
      this.getSpecialData().then(() => {
        this.m_refresh = false
        this.sortShow = false
      })
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.name === 'CircleShopDetail' || to.name === 'CircleDetail') {
  //     this.bannerShow = true
  //   }
  //   next()
  // },
  activated () {
    invokeNativeMethod('setAppBottomTab', 1)
    window.refreshWebView = this.refreshWebView
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.hot-cirle-container
  height 100%
  flex-col-btw()
  overflow hidden
  .cirle-banner
    width 100%
    height 304px
    img
      width 100%
      height 100%
  .cirle-nav
    padding 0 30px
    background-color #44187C
    .cirle-tab
      width 100%
      height 100px
      display flex
      justify-content space-between
      // background-color #44187C
      &.ipone-x
        margin-top 68px
      &.ipone
        margin-top 30px
      .left-tab,
      .right-tab
        width 340px
        height 68px
        display flex
        align-items center
        justify-content center
        border-radius: 8px
        background-image: linear-gradient(-180deg, #5F1CB4 0%, #C975F7 91%)
        box-shadow: 0 4px 8px 0 rgba(105,3,196,0.50), inset 0 -6px 0 0 #9544FB
        &.active
          background-image: linear-gradient(-180deg, #CC7BF6 0%, #C164F8 23%, #44187C 100%)
          box-shadow: inset 0 4px 0 0 rgba(255,255,255,0.50)
      .left-img
        width 28px
        height 28px
        bg('icon-no-cirle.png')
        margin-right 20px
        &.leftActive
          bg('icon-cirle.png')
      .content-img
        width 28px
        height 28px
        bg('icon-no-shop.png')
        margin-right 20px
        &.rightActive
          bg('icon-shop.png')
      .left-info,
      .content-info
        font-family: PingFangSC-Medium
        font-size: 28px
        color: #DDB2FF
        letter-spacing: 0
        &.infoActive
          color #ffffff
    .cirle-search
      width 100%
      height 60px
      background: #F8F8F8
      border-radius: 30px
      display flex
      align-items center
      margin-bottom 14px
      img
        width 28px
        height 28px
        margin-left 32px
      span
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #CCCCCC
        letter-spacing: 0
        margin-left 24px
  .merchant-tab
    width 100%
    height 88px
    display flex
    align-items center
    bg('icon-handle.png')
    >div
      height 100%
      width 33%
      line-height 88px
      text-align center
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #E0C7FF
      letter-spacing: 0
      &.merchantActive
        color: #F8E71C
    .merchant-right-tab
      display flex
      align-items center
      padding-left 30px
      justify-content center
      .arrow
        // margin-left 16px
        .first-arrow
          width 100px
          height 50px
          display flex
          align-items flex-end
          // padding-left 10px
          // justify-content center
          .arrow-top
            width 20px
            height 12px
            margin-left 18px
            bg('icon-up-yellow.png')
            &.upActive
              bg('icon-up.png')
        .last-arrow
          width 100px
          height 50px
          margin-top 6px
          display flex
          // padding-left 10px
          align-items flex-start
          // justify-content center
          .arrow-bottom
            width 20px
            margin-left 18px
            height 12px
            bg('icon-down.png')
            &.downActive
              bg('icon-yellow-down.png')
    img
      width 6px
      height 38px
  .tab-line
    width 100%
    height 2px
    bg('icon-footer-line.png')
  .hot-cirle
    flex 1
    padding 10px 30px 0 30px
    background-color  #9568CE
    overflow hidden
    li:first-child
      margin-top 0
    li
      width 100%
      height 200px
      padding 20px
      display flex
      background: #FFFFFF
      border-radius: 20px
      margin-top 16px
      .left
        width 160px
        height 160px
        border-radius: 16px
        bd(#f4f4f4)
        img
          width 100%
          height 100%
      .right
        margin-left 20px
        padding-top 20px
        position relative
        flex 1
        .circle-tag
          position absolute
          right 0
          top -20px
          display flex
          align-items center
          .tag-hige,.tag-sift,.tag-moods
            width 60px
            height 32px
            margin-right 12px
            img
              width 100%
              height 100%
        .right-top
          font-family: PingFangSC-Medium
          font-size: 30px
          color: #333333
          letter-spacing: 0
        .right-count
          margin-top 20px
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #999999
          letter-spacing: 0
        .right-brand
          margin-top 24px
          display flex
          p
            // width 168px
            padding-left 10px
            padding-right 10px
            height 40px
            border-radius: 8px
            bd(#FF8A00)
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #FF8A00
            text-align center
            line-height 40px
            margin-right 16px
            letter-spacing: 0
            text-shadow: 2px 0 0 rgba(255,255,255,0.40)
  .hot-merchant
    flex 1
    overflow hidden
    background-color  #9568CE
    padding 10px 30px 0 30px
    .all-merchant, .circle-merchant, .attestation
      width 100%
      height 100%
      li
        width 100%
        height 220px
        background-color #fff
        padding 20px 0 20px 20px
        border-radius: 16px
        display flex
        margin-top 16px
        .left
          width 160px
          height 160px
          border-radius: 16px
          bd(#f4f4f4)
          img
            width 100%
            height 100%
        .right
          flex 1
          // padding-left 20px
          // padding-top 20px
          &.active
            padding-top 20px
          .right-top
            display flex
            // justify-content space-between
            align-items center
            padding-left 20px
            img
              width 28px
              height 28px
              margin-right 10px
            p
              font-family: PingFangSC-Regular
              font-size: 28px
              color: #333333
              letter-spacing: 0
              text-over(1)
              line-height 32px
            .top-img
              width 80px
              height 40px
              img
                width 100%
                height 100%
          .right-content
            margin-top 16px
            padding-left 20px
            height 26px
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #999999
              letter-spacing: 0
              margin-right 54px
          .right-tag
            display flex
            align-items center
            height 32px
            padding-left 20px
            margin-top 16px
            .right-tag-new
              width 56px
              height 32px
              margin-right 12px
              img
                width 100%
                height 100%
            .right-tag-boutique, .right-tag-materials
              width 76px
              height 32px
              // margin-left 12px
              img
                width 100%
                height 100%
            .right-tag-boutique
              margin-right 12px
          .right-footer
            margin-top 24px
            display flex
            align-items center
            justify-content space-between
            padding-right 24px
            .left-sgin
              display flex
              align-items center
              img
                width 28px
                height 28px
                margin-right 10px
              span
                font-family: PingFangSC-Regular
                font-size: 24px
                color: #FF8A00
                letter-spacing: 0
                text-shadow: 1px 0 0 rgba(255,255,255,0.40)
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #FF8A00
              letter-spacing: 0
          .right-bottom
            margin-top 40px
            display flex
            align-items center
            justify-content space-between
            padding-right 24px
            .left-sgin
              display flex
              align-items center
              img
                width 28px
                height 28px
                margin-right 10px
              span
                font-family: PingFangSC-Regular
                font-size: 24px
                color: #FF8A00
                letter-spacing: 0
                text-shadow: 1px 0 0 rgba(255,255,255,0.40)
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #999999
              letter-spacing: 0
          .footer
            margin-top 24px
            width 100%
            background: #FF8D8D
            height 40px
            display flex
            padding 0 15px
            // padding-left 10px
            align-items center
            justify-content space-between
            border-top-left-radius 20px
            border-bottom-left-radius 20px
            .left-sgin
              display flex
              align-items center
              img
                width 28px
                height 28px
                margin-right 8px
              span
                font-family: PingFangSC-Regular
                font-size: 22px
                color: #FFF5C1
                letter-spacing: 0
            .right-sgin
              width 130px
              display flex
              align-items center
              justify-content space-between
              .line
                width 4px
                height 28px
                margin-top 2px
              .arrow
                width 24px
                height 24px
              span
                font-family: PingFangSC-Semibold
                font-size: 26px
                color: #FFFFFF
                margin-top 5px
                letter-spacing: 0
  .no-data
    text-align center
    margin-top 160px
    img
      width 320px
      height 320px
    p
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #E0C7FF
      letter-spacing: 0
      margin-top 32px
</style>
