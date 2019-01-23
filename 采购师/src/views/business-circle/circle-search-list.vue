<template>
  <div class="circle-search-container">
    <base-header :is-show-title="false">
      <div class="header-center"  @click="goBack" slot="center">
        <div class="search">
          <img src="./images/icon-search.png" alt="">
        </div>
        <!-- <input type="text" v-model="title" disabled> -->
        <p>{{ title }}</p>
        <div class="close">
          <img src="./images/icon-close.png" alt="">
        </div>
      </div>
      <div class="right">
        <span>搜索</span>
      </div>
    </base-header>
    <div class="merchant-tab">
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
    <div class="all-merchant" v-if="merchantTab === 0">
        <base-scroll
        ref="delegateScroll"
        :data="m_dataList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getData"
        @pulldown="pullDownRefresh"
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
      </div>
      <div class="circle-merchant" v-else-if="merchantTab === 1">
        <base-scroll
        v-show="!noData"
        ref="delegateScroll"
        :data="m_dataList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getCircleMerchantData"
        @pulldown="pullDownCircle"
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
        v-show="!specialData"
        ref="delegateScroll"
        :data="specialList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getSpecialData"
        @pulldown="pullDownSpecial"
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
</template>

<script>
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      merchantTab: 0,
      // 排序的高亮显示
      sortShow: false,
      noData: false,
      specialData: false,
      specialList: [],
      sort: 1,
      flag: true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    shopTab (i) {
      if (this.merchantTab === i) return
      this.merchantTab = i
      this.initData()
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      if (i === 0) {
        this.m_dataList = []
        this.sortShow = false
        this.getData()
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
    // 热门商家的全部的列表
    async getData () {
      if (!this.m_hasMore) return
      let url = 'union/groupSeller'
      let obj = {
        page: ++this.m_page,
        page_size: this.m_pageSize,
        is_group: 0,
        is_sort: 0,
        key_word: this.title
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
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
        is_sort: 0,
        key_word: this.title
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
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
        is_sort: this.sort,
        key_word: this.title
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
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
    // 返回
    goBack () {
      this.$router.back()
    },
    // 去详情页
    goCircleDetail (id, cound) {
      this.$router.push({ path: '/circle-shop-detail', query: { id, count: cound } })
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
  computed: {
    title () {
      return this.$route.query.shopName
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.circle-search-container
  height 100%
  flex-col-btw()
  overflow hidden
  .header-center
    width 520px
    height 60px
    display flex
    align-items center
    justify-content space-around
    background: #F8F8F8
    border-radius: 30px
    p
      height 100%
      width 400px
      line-height 60px
      font-family: PingFangSC-Regular
      font-size: 28px
      // padding-left 70px
      color: #CCCCCC
    .search
      width 28px
      height 28px
      img
        width 100%
        height 100%
    .close
      width 26px
      height 26px
      img
        width 100%
        height 100%
  .right
    span
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #333333
      letter-spacing: 0
  .merchant-tab
    width 100%
    height 88px
    display flex
    align-items center
    background-color #fff
    >div
      height 100%
      width 33%
      line-height 88px
      text-align center
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #999999
      letter-spacing: 0
      &.merchantActive
        color: #FF8A00
        bd-b(#FF8A00, width = 2px)
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
          // justify-content center
          .arrow-top
            width 20px
            height 12px
            margin-left 18px
            bg('icon-orange-up.png')
            &.upActive
              bg('icon-up-gray.png')
        .last-arrow
          width 100px
          height 50px
          margin-top 8px
          display flex
          align-items float left
          // justify-content center
          .arrow-bottom
            width 20px
            // margin-top 5px
            height 12px
            margin-left 18px
            bg('icon-down-gray.png')
            &.downActive
              bg('icon-orange-down.png')
    img
      width 6px
      height 38px
  .all-merchant, .circle-merchant, .attestation
    flex 1
    overflow hidden
    background-color #f4f4f4
    padding 0 30px
    li
      width 100%
      height 200px
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
        padding-left 20px
        padding-top 20px
        .right-top
          display flex
          justify-content space-between
          align-items center
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
          margin-top 20px
          span
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #999999
            letter-spacing: 0
            margin-right 54px
        .right-footer
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
              height 24px
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
              height 24px
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
          margin-top 37px
          width 100%
          background: #FF8D8D
          height 40px
          display flex
          padding 0 20px
          align-items center
          justify-content space-between
          border-top-left-radius 20px
          border-bottom-left-radius 20px
          .left-sgin
            display flex
            align-items center
            img
              width 28px
              height 24px
              margin-right 10px
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
            .arrow
              width 24px
              height 24px
            span
              font-family: PingFangSC-Semibold
              font-size: 26px
              color: #FFFFFF
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
      color: #999999
      letter-spacing: 0
      margin-top 32px
</style>
