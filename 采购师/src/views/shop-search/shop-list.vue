<template>
  <div class="search-list-container">
    <base-header :is-show-title="false">
      <div class="header-center" @click="goBack" slot="center">
        <div class="search">
          <img src="./images/icon-search.png" alt="">
        </div>
        <input type="text" disabled placeholder="搜索店铺名称">
        <!-- <div class="close">
          <img src="./images/icon-close.png" alt="">
        </div> -->
      </div>
      <!-- <div class="right" @click="goInfo">
        <div class="right-img">
          <img src="./images/icon-news.png" alt="">
        </div>
        <div class="news-info" v-show="showUnreadMessage">{{ mewsInfo }}</div>
      </div> -->
      <div class="header-nav-container" @click="goInfo">
        <i
          class="icon-nav"
          :class="{ active: showUnreadMessage }">
        </i>
      </div>
    </base-header>
    <div class="delegate-tab">
      <div class="left-tab" :class="{ active: currentTab === 0 }" @click="toggleTab(0)">综合</div>
      <div class="center-tab" :class="{ active: currentTab === 1 }" @click="toggleTab(1)">可认证的店</div>
      <div class="right-tab" :class="{ active: currentTab === 2 }" @click="toggleTab(2)">已认证的店</div>
    </div>
    <!-- 综合 -->
    <div class="synthesize-container" v-if="currentTab === 0">
      <base-scroll
      v-show="!noData"
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
          <li v-for="item in m_dataList" :key="item.id" @click="goShopDetail(item.seller_id)">
            <div class="left">
              <img src="http://test-capi.cgs18.com/static/images/showtu.png" v-if="!item.shop_logo_path" alt="">
              <img :src="item.shop_logo_path" alt="">
            </div>
            <div class="right" :class="{ active: item.audit_status === 2 }">
              <div class="right-top">
                <img src="./images/icon-approae-two.png" v-show="item.audit_status === 2" alt="">
                <p>{{ item.shop_name }}</p>
                <!-- <div class="top-img" v-if="item.is_new === 'yes'">
                  <img src="./images/icon-red.png" alt="">
                </div> -->
              </div>
              <div class="right-content">
                <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                <span v-show="item.main_product || item.brand.length"  v-for="(BrandItem, labelIndex) in authProduct(item.main_product, item.brand)" :key="labelIndex">{{BrandItem}}</span>
              </div>
              <div class="right-tag">
                <div class="right-tag-new" v-show="item.is_new === 'yes'">
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
              <div class="footer" v-if="(item.audit_status === null || item.audit_status === 3) || item.audit_status === 1">
                <div class="left-sgin">
                  <img src="./images/icon-sign.png" alt="">
                  <span>认证店铺低价购买+蜂蜜奖励</span>
                </div>
                <div class="right-sgin">
                  <img class="line" src="./images/icon-line.png" alt="">
                  <span v-show="item.audit_status === null || item.audit_status === 3">去认证</span>
                  <span v-show="item.audit_status === 1">审核中</span>
                  <img class="arrow" src="./images/icon-arrow.png" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
      <!-- 综合缺省页 -->
      <div class="no-data" v-show="noData">
        <img src="./images/icon-zong.png" alt="">
        <p>我们的店铺正在努力搭建中</p>
        <p>您可以先逛逛其它的哦</p>
      </div>
    </div>
    <!-- 可认证 -->
    <div class="can-certified" v-else-if="currentTab === 1">
      <base-scroll
      v-show="!unverifiedData"
      ref="delegateScroll"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getNnverified"
      @pulldown="pullDownNnverified"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
        <ul>
          <li v-for="item in m_dataList" :key="item.id" @click="goShopDetail(item.seller_id)">
            <div class="left">
              <img src="http://test-capi.cgs18.com/static/images/showtu.png" v-if="!item.shop_logo_path" alt="">
              <img :src="item.shop_logo_path" alt="">
            </div>
            <div class="right">
              <div class="right-top">
                <p>{{ item.shop_name }}</p>
                <!-- <div class="top-img" v-if="item.is_new === 'yes'">
                  <img src="./images/icon-red.png" alt="">
                </div> -->
              </div>
              <div class="right-content">
                <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                <span v-show="item.main_product || item.brand.length"  v-for="(BrandItem, labelIndex) in authProduct(item.main_product, item.brand)" :key="labelIndex">{{BrandItem}}</span>
              </div>
              <div class="right-tag">
                <div class="right-tag-new" v-show="item.is_new === 'yes'">
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
              <!-- <div class="footer" v-if="item.status !== null && item.audit_status === null || item.audit_status === 3">
                <div class="left-sgin">
                  <img src="./images/icon-sign.png" alt="">
                  <span>认证优惠再返 佣金 xx%</span>
                </div>
                <div class="right-sgin">
                  <img class="line" src="./images/icon-line.png" alt="">
                  <span>去认证</span>
                  <img class="arrow" src="./images/icon-arrow.png" alt="">
                </div>
              </div> -->
              <div class="footer" v-if="(item.audit_status === null || item.audit_status === 3) || item.audit_status === 1">
                <div class="left-sgin">
                  <img src="./images/icon-sign.png" alt="">
                  <span>认证店铺低价购买+蜂蜜奖励</span>
                </div>
                <div class="right-sgin">
                  <img class="line" src="./images/icon-line.png" alt="">
                  <span v-show="item.audit_status === null || item.audit_status === 3">去认证</span>
                  <span v-show="item.audit_status === 1">审核中</span>
                  <img class="arrow" src="./images/icon-arrow.png" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
      <!-- 可认证缺省页 -->
      <div class="no-data" v-show="unverifiedData">
        <img src="./images/icon-wei.png" alt="">
        <p class="no-product">暂时没有可认证的店哦</p>
      </div>
    </div>
    <!-- 已认证 -->
    <div class="authenticated" v-else-if="currentTab === 2">
      <base-scroll
      v-show="!authenticatedData"
      ref="delegateScroll"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getauthenticated"
      @pulldown="pullDownAuthen"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
       <ul>
          <li v-for="item in m_dataList" :key="item.id" @click="goShopDetail(item.seller_id)">
            <div class="left">
              <img src="http://test-capi.cgs18.com/static/images/showtu.png" v-if="!item.shop_logo_path" alt="">
              <img :src="item.shop_logo_path" alt="">
            </div>
            <div class="right" :class="{ active: item.audit_status === 2 }">
              <div class="right-top">
                <img src="./images/icon-approae-two.png" v-show="item.audit_status === 2" alt="">
                <p>{{ item.shop_name }}</p>
              </div>
              <div class="right-content">
                <!-- <span v-for="(itemBrand, index) in item.brand" :key="index">{{ itemBrand.brand_name }}</span> -->
                <span v-show="item.main_product || item.brand.length"  v-for="(BrandItem, labelIndex) in authProduct(item.main_product, item.brand)" :key="labelIndex">{{BrandItem}}</span>
              </div>
              <div class="right-tag">
                <div class="right-tag-new" v-show="item.is_new === 'yes'">
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
              </div>
              <div class="right-bottom" v-if="item.audit_status === 2">
                <div class="left-sgin">
                  <img src="./images/icon-origin.png" alt="">
                  <span>下定可再返佣金{{ item.one_discount }}%</span>
                </div>
                <span>已认证</span>
              </div> -->
              <div class="footer" v-if="item.audit_status === 1">
                <div class="left-sgin">
                  <img src="./images/icon-sign.png" alt="">
                  <span>认证店铺低价购买+蜂蜜奖励</span>
                </div>
                <div class="right-sgin">
                  <img class="line" src="./images/icon-line.png" alt="">
                  <!-- <span v-show="(item.status === 1 && item.audit_status === null) || item.audit_status === 3">去认证</span> -->
                  <span>审核中</span>
                  <img class="arrow" src="./images/icon-arrow.png" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
      <!-- 已认证缺省页 -->
      <div class="no-data" v-show="authenticatedData">
        <img src="./images/icon-product.png" alt="">
        <p>您还未认证特约店铺哦</p>
        <p>认证可享更高额佣金，快去逛逛吧</p>
      </div>
    </div>
  </div>
</template>

<script>
import { dev, invokeNativeMethod } from 'native'
import { mixins } from 'mixins'
import { getItem } from 'common'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ShopList',
  mixins: [mixins],
  data () {
    return {
      noData: false,
      unverifiedData: false,
      authenticatedData: false,
      currentTab: 0,
      // 消息
      mewsInfo: ''
    }
  },
  created () {
    if (this.$route.query.index === '1') {
      this.currentTab = 1
      this.getNnverified()
    } else {
      this.currentTab = 0
      this.getData()
    }
    let currentDev = dev()
    if (currentDev === 'Android') {
      this.mewsInfo = window.android.returnSystemMessage()
      if (this.mewsInfo > 0) {
        this.MODIFYMESSAGESTATUS(true)
      } else {
        this.MODIFYMESSAGESTATUS(false)
      }
    }
    if (currentDev === 'iOS') {
      invokeNativeMethod('returnSystemMessage')
    }
    window.getSystemMessage = this.getSystemMessage
  },
  computed: {
    ...mapState(['showUnreadMessage'])
  },
  methods: {
    ...mapActions(['MODIFYMESSAGESTATUS']),
    // tab 切换
    toggleTab (i) {
      // if (!this.m_dataList.length) return
      if (this.m_refresh === true) return
      if (this.currentTab === i) return
      this.currentTab = i
      this.initData()
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      if (i === 0) {
        this.m_dataList = []
        this.getData()
      } else if (i === 1) {
        this.m_dataList = []
        this.getNnverified()
      } else {
        this.m_dataList = []
        this.getauthenticated()
      }
    },
    // 综合的列表
    async getData () {
      if (!this.m_hasMore) return
      let url = 'adv/shopSearch'
      let obj = {
        page: ++this.m_page,
        op_city: getItem('opCity')
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
    // 未认证的列表
    async getNnverified () {
      if (!this.m_hasMore) return
      let url = 'adv/shopSearch'
      let obj = {
        page: ++this.m_page,
        buyer_status: 1,
        op_city: getItem('opCity')
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.unverifiedList = res.data.data
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          if (!this.m_dataList.length) {
            this.unverifiedData = true
          }
          this._checkMore(res.data)
          this.m_refresh = false
        }
      })
    },
    // 已认证的店铺
    async getauthenticated () {
      if (!this.m_hasMore) return
      let url = 'adv/shopSearch'
      let obj = {
        page: ++this.m_page,
        buyer_status: 2,
        op_city: getItem('opCity')
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.authenticatedList = res.data.data
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          if (!this.m_dataList.length) {
            this.authenticatedData = true
          }
          this._checkMore(res.data)
          this.m_refresh = false
        }
      })
    },
    // 去店铺详情页
    goShopDetail (id) {
      this.$router.push({
        path: '/shop-detail',
        query: {
          id
        }
      })
    },
    // 消息 ios原生回调
    getSystemMessage (int) {
      if (int > 0) {
        this.MODIFYMESSAGESTATUS(true)
      } else {
        this.MODIFYMESSAGESTATUS(false)
      }
      this.mewsInfo = int
    },
    authProduct (product, brand) {
      var list = []
      if (brand.length !== 0) {
        list.push(brand[0].brand_name)
      }
      if (product != null) {
        list = list.concat(product.split('.').slice(0, 3))
      }
      return list
    },
    // 去消息中心
    goInfo () {
      invokeNativeMethod('goSystemMessagePanel')
    },
    // 去搜索页面
    goBack () {
      this.$router.push('/shop-search')
    },
    pullDownNnverified () {
      this.statusInit()
      this.m_refresh = true
      this.getNnverified().then(() => {
        this.m_refresh = false
      })
    },
    pullDownAuthen () {
      this.statusInit()
      this.m_refresh = true
      this.getauthenticated().then(() => {
        this.m_refresh = false
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.search-list-container
  height 100%
  flex-col-btw()
  overflow hidden
  .header-center
    width 520px
    height 60px
    display flex
    align-items center
    justify-content space-around
    background: #f0f0f0
    border-radius: 30px
    input
      height 100%
      width 400px
      font-family: PingFangSC-Regular
      font-size: 28px
      // padding-left 70px
      color: #999999
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
  // .right
  //   position relative
  //   .right-img
  //     width 40px
  //     height 38px
  //     img
  //       width 100%
  //       height 100%
  //   .news-info
  //     position absolute
  //     width 30px
  //     height 30px
  //     background-color #F64343
  //     color #fff
  //     border-radius 50%
  //     top -10px
  //     right -15px
  //     text-align center
  //     line-height 30px
  .header-nav-container
    position relative
    height 100%
    padding 0 20px
    margin-right -20px
    flex-center()
    .icon-nav
      position relative
      width 40px
      height 38px
      bg('icon-news.png')
      &.active
        &:after
          content ''
          position absolute
          top -5px
          right -5px
          wh(18px)
          bg('icon-tips.png')
  .delegate-tab
    display flex
    height 88px
    line-height 88px
    text-align center
    >div
      height 100%
      flex 1
      font-family: PingFangSC-Medium
      font-size: 28px
      color: #999999
      letter-spacing: 0
      &.active
        color: #FF8A00
        bd-b(#ff8a00, width = 2px)
  .synthesize-container, .can-certified, .authenticated
    flex 1
    padding 16px 30px 0 30px
    background-color #f4f4f4
    overflow hidden
    ul
      li
        width 100%
        height 224px
        background-color #fff
        padding 20px 0 20px 20px
        display flex
        border-radius: 20px
        margin-top 16px
        .left
          width 160px
          height 160px
          background-image url('./images/icon-logo.png')
          background-size 100% 100%
          border-radius: 16px
          // outline:#f4f4f4 solid 1px
          bd(#f4f4f4)
          img
            width 100%
            height 100%
        .right
          flex 1
          // padding-left 20px
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
              // width 80%
              text-over(1)
              line-height 1.3
            .top-img
              width 80px
              height 40px
              img
                width 100%
                height 100%
          .right-tag
            display flex
            align-items center
            padding-left 20px
            height 33px
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
          .right-content
            margin-top 18px
            height 26px
            padding-left 20px
            text-over(1)
            line-height 1.2
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #999999
              letter-spacing: 0
              margin-right 16px
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
      margin-top 100px
    p:last-child
      margin-top 10px
      &.no-product
        margin-top 100px
</style>
