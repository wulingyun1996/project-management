<template>
  <transition name="has-data">
    <div class="shop-detail-container" v-if="firstEnter">
      <!-- 店铺导航 -->
      <div
        class="shop-guide"
        :class="{ 'ipone-x': $isX }"
        :style="[bannerOpacity]"
        v-show="isShowShopGuide">
        <div class="guide">
          <i
            class="icon-nav"
            :class="{ message: showUnreadMessage }"
            @click="showShopNavMenu"
            >
          </i>
          <i class="icon-line"></i>
          <i class="icon-close-back" @click="backToBeforePage"></i>
        </div>
        <base-nav-list
          ref="nav"
          :im-info="imInfo"
          :include="['home', 'message', 'lineQuery']"
          :serviceMobile="serviceMobile">
        </base-nav-list>
      </div>
      <!-- 头部 -->
      <div class="shop-detail-banner-wrapper" :style="[bannerOpacity]">
        <div class="shop-attribute">
          <h2>{{ shopName }}</h2>
          <div class="shop-label">
            <div
              class="authen-label"
              :class="{
                        unauthen: authenStatus === 0 || authenStatus === 1,
                        authened: authenStatus === 2,
                        auditing: authenStatus === 3
                      }">
            </div>
            <div class="cicle-label" @click="viewShopJoinedCircle">
              所属商圈：{{ shopJoinedCircleNum }}
            </div>
          </div>
        </div>
      </div>
      <!-- 主体信息 -->
      <div
        class="shop-detail-main-container"
        :class="{ 'ipone-x': $isX }">
        <div
          class="background"
          :style="[backgroundOpacity]">
        </div>
        <div
          class="detail-container"
          ref="shopScrollContainer"
          :class="{ 'ipone-x': $isX }"
          :style="[moveDistance]">
          <div class="main-wrapper" ref="scrollWrapper">
            <!-- 店铺 tab 切换 -->
            <div class="shop-tabs-container" ref="shopTabs">
              <div
                class="tabs-wrapper"
                :class="{
                          fixed: isShowFixedTabs,
                          'fixed-ipone': isShowFixedTabs && isPone,
                          'fixed-iponex': isShowFixedTabs && $isX
                        }">
                <div class="shop-search-guide" @click="goSearchShopGoods">
                  <i class="icon-search"></i>
                  搜索
                </div>
                <ul class="tabs-list">
                  <li
                    class="tabs-item"
                    v-if="tabItem.id !== 3 || (tabItem.id === 3 && isJoinActivity)"
                    :class="{ active: shopCurrentTab === tabItem.id }"
                    v-for="tabItem in shopTabList"
                    :key="tabItem.id"
                    @click="toggleShopGuideTab(tabItem.id)">
                    {{ tabItem.text }}
                  </li>
                  <li
                    class="line"
                    :class="{
                              [`tab${shopCurrentTab}`]: true,
                              'four-tab': isJoinActivity,
                              'three-tab': !isJoinActivity
                            }">
                  </li>
                </ul>
              </div>
              <div class="tabs-wrapper" v-show="isShowFixedTabs"></div>
            </div>
            <!-- 店铺 全部商品 筛选 tab -->
            <div class="shop-goods-tabs-wrapper"  v-show="isShowFixedTabs && shopCurrentTab === 2">
              <ul class="goods-tab-list">
                <li
                  class="goods-tab-item"
                  :class="{ active: goodsCurrentTab ===  goodsTabItem.id }"
                  v-for="goodsTabItem in goodsTabList"
                  :key="goodsTabItem.id"
                  @click="toggleShopGoods(goodsTabItem)">
                  {{ goodsTabItem.text }}
                  <i
                    v-show="goodsTabItem.id !== 1"
                    :class="{ [goodsTabItem.sort]: true }">
                  </i>
                </li>
              </ul>
            </div>
            <!-- 滚动容器 -->
            <div class="shop-scroll-container">
              <base-scroll
                ref="shopScroll"
                :class="{ 'no-padding': shopCurrentTab === 3 }"
                :has-more='hasMore'
                :pullup="m_pullup"
                :pulldown="m_pulldown"
                :has-loading="m_loading"
                :has-refresh="m_refresh"
                :scroll-over="true"
                :listen-scroll='true'
                :probeType='3'
                :data="m_dataList"
                @scrollToEnd="getData"
                @pulldown="pullDownRefreshData"
                @scrollOver="scrollOver"
                @scroll="watchScroll">
                <!-- 首页模块 -->
                <div class="shop-home-container" v-if="shopCurrentTab === 1">
                  <div class="authen-acitivity-wrapper">
                    <div class="authen-guide" v-show="authenStatus !== 2" @click="showAuthPopup"></div>
                    <div class="activity-adv" v-if="isJoinActivity" @click="goActivityDetail(joinedActivity.id)">
                      <img :src="joinedActivity.image_path" alt="">
                      <div class="activity-info">
                        <h2>{{ joinedActivity.title }}</h2>
                        <span>{{ joinedActivity.cost | calculateCost }}</span>
                      </div>
                    </div>
                  </div>
                  <h1 class="hot-goods-guide">
                    <i class="guide-icon-left"></i>
                    <span>人气热卖</span>
                    <i class="guide-icon-right"></i>
                  </h1>
                  <ul class="goods-list">
                    <li
                      class="goods-item"
                      v-for="goodsItem in m_dataList"
                      :key="goodsItem.id"
                      @click="goGoodsDetail(goodsItem.id)">
                      <div class="goods-pic">
                        <i
                          class="goods-bg"
                          :class="{
                                    'hot-goods':  goodsItem.isHot === 'yes',
                                    'flash-goods':  goodsItem.isSale === 'yes'
                                  }">
                        </i>
                        <i class="hot-goods-label" v-show="goodsItem.isHot === 'yes'"></i>
                        <i class="falsh-goods-label" v-show="goodsItem.isSale === 'yes'"></i>
                        <img :src="goodsItem.image_path" alt="">
                      </div>
                      <h2 class="goods-title">{{ goodsItem.title | sliceTitle }}</h2>
                      <div class="goods-category">
                        <span class="new-goods" v-show="goodsItem.is_stock_good">现货</span>
                        <span class="best-goods" v-show="goodsItem.boutique">精品馆</span>
                        <span class="meterial-goods" v-show="goodsItem.material">材料馆</span>
                      </div>
                      <div class="goods-price">
                        <!-- 限时抢购价 -->
                        <div class="authened-price" v-if="goodsItem.isSale === 'yes'">
                          <p class="price">
                            <span>￥</span><span class="price-int">{{ goodsItem.sale_price | getPriceInt }}</span><span class="price-zero">.{{ goodsItem.sale_price | getPriceZero }}</span>
                          </p>
                        </div>
                        <!-- 普通商品且认证 -->
                        <div class="authened-price" v-else-if="authenStatus === 2">
                          <p class="price">
                            <span>￥</span><span class="price-int">{{ goodsItem.purchase_price | getPriceInt }}</span><span class="price-zero">.{{ goodsItem.purchase_price | getPriceZero }}</span>
                          </p>
                          <p class="commission">赚 ￥{{ goodsItem.commission | retainTwoDecimal }}</p>
                        </div>
                        <!-- 普通商品且未认证 -->
                        <div class="unauthen-price" v-else>
                          <p class="price">￥<span>***</span></p>
                          <b class="authen">认证看底价</b>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="all-goods-guide" @click="toggleShopGuideTab(2)" v-show="m_dataList.length >= 10">
                    全部商品
                  </div>
                </div>
                <!-- 全部商品模块 -->
                <div class="shop-goods-container" v-if="shopCurrentTab === 2">
                  <div class="shop-goods-tabs-wrapper" v-show="!isShowFixedTabs">
                    <ul class="goods-tab-list">
                      <li
                        class="goods-tab-item"
                        :class="{ active: goodsCurrentTab ===  goodsTabItem.id }"
                        v-for="goodsTabItem in goodsTabList"
                        :key="goodsTabItem.id"
                        @click="toggleShopGoods(goodsTabItem)">
                        {{ goodsTabItem.text }}
                        <i
                          v-show="goodsTabItem.id !== 1"
                          :class="{ [goodsTabItem.sort]: true }">
                        </i>
                      </li>
                    </ul>
                  </div>
                  <ul class="goods-list">
                    <li
                      class="goods-item"
                      v-for="goodsItem in m_dataList"
                      :key="goodsItem.id"
                      @click="goGoodsDetail(goodsItem.id)">
                      <div class="goods-pic">
                        <i
                          class="goods-bg"
                          :class="{
                                    'hot-goods':  goodsItem.isHot === 'yes',
                                    'flash-goods':  goodsItem.isSale === 'yes'
                                  }">
                        </i>
                        <i class="hot-goods-label" v-show="goodsItem.isHot === 'yes'"></i>
                        <i class="falsh-goods-label" v-show="goodsItem.isSale === 'yes'"></i>
                        <img :src="goodsItem.image_path" alt="">
                      </div>
                      <h2 class="goods-title">{{ goodsItem.title | sliceTitle }}</h2>
                      <div class="goods-category">
                        <span class="new-goods" v-show="goodsItem.is_stock_good">现货</span>
                        <span class="best-goods" v-show="goodsItem.boutique">精品馆</span>
                        <span class="meterial-goods" v-show="goodsItem.material">材料馆</span>
                      </div>
                      <div class="goods-price">
                        <!-- 限时抢购价 -->
                        <div class="authened-price" v-if="goodsItem.isSale === 'yes'">
                          <p class="price">
                            <span>￥</span><span class="price-int">{{ goodsItem.sale_price | getPriceInt }}</span><span class="price-zero">.{{ goodsItem.sale_price | getPriceZero }}</span>
                          </p>
                        </div>
                        <!-- 普通商品且认证 -->
                        <div class="authened-price" v-else-if="authenStatus === 2">
                          <p class="price">
                            <span>￥</span><span class="price-int">{{ goodsItem.purchase_price | getPriceInt }}</span><span class="price-zero">.{{ goodsItem.purchase_price | getPriceZero }}</span>
                          </p>
                          <p class="commission">赚 ￥{{ goodsItem.commission | retainTwoDecimal }}</p>
                        </div>
                        <!-- 普通商品且未认证 -->
                        <div class="unauthen-price" v-else>
                          <p class="price">￥<span>***</span></p>
                          <b class="authen">认证看底价</b>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- 活动模块 -->
                <div class="shop-activity-container" v-if="shopCurrentTab === 3">
                  <ul class="activity-list">
                    <li
                      class="activity-item"
                      :class="{ 'out-time-activity': activityItem.time_status === '已结束' }"
                      v-for="activityItem in m_dataList"
                      :key="activityItem.id"
                      @click="goActivityDetail(activityItem.id)">
                      <div class="shop-circle">
                        <i class="icon-circle"></i>
                        {{ activityItem.union_name }}
                      </div>
                      <div class="activity-pic">
                        <img :src="activityItem.image_path" alt="">
                      </div>
                      <h2 class="activity-title">{{ activityItem.title }}</h2>
                      <div class="activity-address">
                        <i class="icon-address"></i>
                        {{ activityItem.address }}
                      </div>
                      <div class="activity-info">
                        <div class="activity-time">
                          <i class="icon-time"></i>
                          <b>{{ activityItem | getActivityTime }}</b>
                        </div>
                        <b class="activity-cost" v-if="activityItem.cost">￥{{ activityItem.cost | calculateCost }}</b>
                        <b class="activity-cost-free" v-else>免费</b>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- 店铺介绍模块 -->
                <div class="shop-description-info" v-show="shopCurrentTab === 4">
                  <div class="shop-brief">
                    <div class="brief-title">店铺简介</div>
                    <div class="brief-item">
                      <div>
                        <span class="item-left">店铺名称</span>
                        <span class="item-right">{{ shopName }}</span>
                      </div>
                      <div>
                        <span class="item-left">服务城市</span>
                        <span class="item-right">{{ servieceCity }}</span>
                      </div>
                      <div>
                        <span class="item-left">开店时间</span>
                        <span class="item-right">{{ createShopTime }}</span>
                      </div>
                      <div class="sell-brand">
                        <span class="item-left">销售品牌</span>
                        <div
                          class="label-con"
                          v-for="(saleBrand, saleIndex) in manageBrandsList"
                          :key="saleIndex">
                          <span class="item-label">{{ saleBrand.brand_name | sliceChar(10) }}</span>
                        </div>
                      </div>
                      <div>
                        <span class="item-left">联系方式</span>
                        <span class="item-right">{{ serviceMobile }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="brand-brief" v-if="manageBrandsList.length">
                    <div class="brief-title">品牌介绍</div>
                    <div
                      v-for="(brandItem, brandIndex) in manageBrandsList"
                      :key="brandIndex">
                      <div class="brand-logo">
                        <img :src="brandItem.image_path" alt="">
                        {{ brandItem.brand_name }}
                      </div>
                      <div class="brief-text">{{ brandItem.introduce }}</div>
                    </div>
                  </div>
                </div>
                <transition name="no-data">
                  <div class="has-no-goods" v-show="!m_dataList.length && shopCurrentTab !== 4">
                    <img src="./images/img-no-goods.png" alt="">
                    <p>掌柜太忙啦！</p>
                    <p>还没来得及上架商品，稍后再来吧~</p>
                  </div>
                </transition>
              </base-scroll>
            </div>
          </div>
        </div>
      </div>
      <!-- 页脚 -->
      <div
        class="shop-detail-footer-wrapper"
        :class="{ 'ipone-x': $isX }"
        @click="concatService">
        <i></i>
        <span>联系客服</span>
      </div>
      <!-- 特约认证弹窗 -->
      <base-popup-authen
        ref="authen"
        @goAuthen='goAuthenCurrentShop'
        :authenInfo='authenStatus || 0'>
      </base-popup-authen>
      <!-- 所属圈子的弹框 -->
      <div
        class="shop-joined-circle-popup"
        v-show="isShowCirclePopup"
        @click="isShowCirclePopup = false">
        <div class="circle-wrapper">
          <base-scroll
            ref="circleScroll"
            :has-more="true"
            direction='horizontal'>
            <ul class="circle-list clearfix" ref="circleList">
              <li
                class="circle-item"
                ref="circleItem"
                :class="{ 'no-margin': circleIndex === shopJoinedCircleList.length - 1 }"
                v-for="(item, circleIndex) in shopJoinedCircleList"
                :key="item.id">
                <div class="circle-logo">
                  <img :src="item.avatar" alt="" v-if="item.avatar">
                  <img src="./images/img-circle.png" alt="" v-else>
                </div>
                <h2 class="circle-title">{{ item.union_name }}</h2>
                <p class="circle-number">圈内商家数: {{ item.group_count }}</p>
                <p>所在地: {{ item.op_city }}<span v-show="item.op_area">/{{ item.op_area }}</span></p>
              </li>
            </ul>
          </base-scroll>
          <i class="circle-close" @click="closeCirclePopup"></i>
        </div>
      </div>
      <!-- 店铺被关闭弹窗 -->
      <div class="shop-close-wrapper" v-show="shopCurrentStatus === 3">
        <div class="shop-close" @click="backToBeforePage"></div>
      </div>
      <!-- 店铺认证送蜂蜜弹窗 -->
      <div class="authen-popup-container" v-show="isShowAuthendPopup" @click="isShowAuthendPopup = false">
        <div class="honey-authen-popup-wrapper">
          <div class="honey-wrapper">
            <i></i>
            <div class="honey-num">
              <span class="num">+5</span>
              <span class="text">蜂蜜</span>
            </div>
          </div>
          <h2>认证成功！</h2>
          <p>恭喜！您已成为【{{ shopName }}】特约采购师，</p>
          <p class="txt">自购省钱，分享赚钱，快去体验一下吧。</p>
          <div class="button" @click="isShowAuthendPopup = false">去逛逛</div>
        </div>
      </div>
      <router-view
        :id="id"
        :authen-status="authenStatus">
      </router-view>
    </div>
  </transition>
</template>

<script>
import BaseNavList from 'components/nav-list'
import BasePopupAuthen from 'components/popup/popup-authen'
import { closeWebview, nativeGoHomeNormal, invokeNativeMethod } from 'native'
import { mixins, navMixins } from 'mixins'
import { mapState } from 'vuex'
import { splitMoney, retainTwoDecimal, cloneDeep, sliceChar } from 'common'
const shopTabList = [
  { text: '首页', id: 1 },
  { text: '全部商品', id: 2 },
  { text: '活动', id: 3 },
  { text: '店铺介绍', id: 4 }
]
const goodsTabList = [
  { text: '综合', id: 1 },
  { text: '佣金', id: 2, sort: 'default' },
  { text: '价格', id: 3, sort: 'default' }
]
export default {
  name: 'ShopDetail',
  mixins: [mixins, navMixins],
  data () {
    return {
      firstEnter: false,
      // 店铺关闭导航, 当顶部固定时，控制其隐藏
      isShowShopGuide: true,
      // 是否还有更多
      hasMore: false,
      // 滚动行为相关 -- 开始
      scrollY: 1,
      shopScrollContainerTop: 0,
      scrollWrapperTop: 0,
      moveDistance: {},
      isShowFixedTabs: false,
      scrollTimer: null,
      // 滚动行为相关 -- 结束
      shopTabList,
      goodsTabList,
      shopCurrentTab: 1,
      goodsCurrentTab: 1,
      // 记录商品列表筛选条件
      filterGoodsRule: {
        type: 1,
        sort: null
      },
      shopName: '',
      shopJoinedCircleNum: 0,
      serviceMobile: '',
      shopLogo: '',
      servieceCity: '',
      createShopTime: '',
      manageBrandsList: [],
      shopCurrentStatus: 0,
      // 是否参与了活动
      isJoinActivity: false,
      // 首页展示的活动
      joinedActivity: {},
      // 采购师是否认证该店铺
      isAuthenedCurrentShop: false,
      authenStatus: null,
      // 店铺商圈
      shopJoinedCircleList: [],
      isShowCirclePopup: false,
      isShowAuthendPopup: false,
      imInfo: {}
    }
  },
  computed: {
    ...mapState(['showUnreadMessage']),
    id () {
      return this.$route.query.id
    },
    isFromHome () {
      return this.$route.query.goHome
    },
    // 是否从单品详情页进入，用于清除店铺缓存
    isFromGoodsDetail () {
      return this.$route.query.fromGoodsDetail
    },
    // app 内扫码认证弹窗
    isFromScanCode () {
      return !!this.$route.query.showAuthen
    },
    // banner 透明度
    bannerOpacity () {
      return {
        opacity: 1 - this.scrollY / 60
      }
    },
    backgroundOpacity () {
      return {
        opacity: this.scrollY / 100
      }
    },
    // 苹果 x 以外系列顶部状态栏高度计算
    iponeTopStatusHeight () {
      return parseInt(this.$dpr * 10)
    },
    // 苹果 x 以上系列顶部状态栏计算
    iponeXTopStatusHeight () {
      return 44
    }
  },
  created () {
    this.getShopDetail().then(() => {
      this.getData()
    })
  },
  methods: {
    showShopNavMenu () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.nav.show()
    },
    backToBeforePage () {
      let { isOpenByShare, isFromNative, isFromHome, isFromScanCode } = this
      if (isOpenByShare) {
        this.goDownLoad()
        return
      }
      if (isFromHome || isFromScanCode) {
        nativeGoHomeNormal()
        return
      }
      if (isFromNative) {
        closeWebview()
        return
      }
      this.$back()
    },
    toggleShopGuideTab (i) {
      this.shopCurrentTab = i
      this.goodsTabList = cloneDeep(goodsTabList)
      this.goodsCurrentTab = 1
      if (i === 4) return
      this.pullDownRefreshData()
      this.$nextTick(() => {
        this.$refs.shopScroll.scrollTo(0, 0, 0, 0)
      })
    },
    toggleShopGoods (item) {
      let { sort, id } = item
      this.goodsCurrentTab = id
      this.filterGoodsRule.type = id
      this.goodsTabList[1].sort = 'default'
      this.goodsTabList[2].sort = 'default'
      if (sort) {
        if (sort === 'up') {
          this.goodsTabList[id - 1].sort = 'down'
          this.filterGoodsRule.sort = 'down'
        } else {
          this.goodsTabList[id - 1].sort = 'up'
          this.filterGoodsRule.sort = 'up'
        }
      } else {
        this.filterGoodsRule.sort = null
      }
      this.pullDownRefreshData()
      this.$nextTick(() => {
        this.$refs.shopScroll.scrollTo(0, 0, 0, 0)
      })
    },
    goSearchShopGoods () {
      this.$push({ name: 'ShopGoodsSearch' })
    },
    // 店铺详情
    async getShopDetail () {
      let { id, isOpenByShare, isFromScanCode } = this
      if (!id) return
      let url = isOpenByShare ? 'adv/shopDetailCode' : 'adv/shopDetail'
      let obj = { id }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { shop_name, group_cnt, service_mobile, shop_logo_path, has_act, act, audit_status, isAuth,
                op_city, op_area, created_at, brand, shop_status, im_name } = res.data
          this.imInfo = {
            type: 2,
            im_name,
            seller_id : id,
            seller_name: shop_name,
          }      
          this.shopName = shop_name
          this.shopJoinedCircleNum = group_cnt
          this.serviceMobile = service_mobile
          this.shopLogo = shop_logo_path
          this.servieceCity = (op_city || '') + (op_area || '')
          this.createShopTime = created_at.substr(0, 10)
          this.manageBrandsList = brand
          this.shopCurrentStatus = shop_status
          this.isJoinActivity = has_act === 'yes'
          this.joinedActivity = act
          this.isAuthenedCurrentShop = isAuth === 'yes'
          this.authenStatus = audit_status ? audit_status : 0
          if (isFromScanCode) this.isShowAuthendPopup = true
          /* eslint-enable */
        }
      })
    },
    // 获取列表数据
    async getData () {
      /* eslint-disable */
      let { shopCurrentTab, filterGoodsRule, m_hasMore, m_pageSize, id } = this
      let { type, sort } = filterGoodsRule
      if (shopCurrentTab === 4 || !m_hasMore) return
      let url = ''
      let obj =  {
        id,
        page: ++this.m_page,
        pageSize: m_pageSize
      }
      switch (shopCurrentTab) {
        case 1:
          url = 'adv/popularGoods'
          break
        case 2:
          url = 'adv/goodsList'
          switch (type) {
            case 2:
              switch (sort) {
                case 'up':
                  obj.commission_order = 'asc'
                  obj.price_order = ''
                  break
                case 'down':
                  obj.commission_order = 'desc'
                  obj.price_order = ''
                  break
              }
              break
            case 3:
              switch (sort) {
                case 'up':
                  obj.price_order = 'asc'
                  obj.commission_order = ''
                  break
                case 'down':
                  obj.price_order = 'desc'
                  obj.commission_order = ''
                  break
              }
              break
          }
          break
        case 3:
          url = 'adv/shopAct'
          break
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        try {
          if (res.code === this.$ok) {
            if (this.m_page === 1) {
              this.m_dataList = res.data.data
            } else {
              this.m_dataList = [...this.m_dataList, ...res.data.data]
            }
            this._checkMore(res.data)
          }
          this.firstEnter = true
        } catch (e) {
          this.firstEnter = true
        }
      })
      return Promise.resolve()
    },
    pullDownRefreshData () {
      this.initData()
      this.getData().then(() => {
        setTimeout(() => {
          this.m_refresh = false
        }, 500)
      })
    },
    viewShopJoinedCircle () {
      let { shopCurrentStatus, id, shopJoinedCircleNum } = this
      if (!shopCurrentStatus || !shopJoinedCircleNum) return
      let url = 'union/groupListDetail'
      let obj = {
        seller_id: id
      }
      this.$http(url, obj).then(res => {
        this.shopJoinedCircleList = res.data
        this.isShowCirclePopup = true
      })
    },
    closeCirclePopup () {
      this.isShowCirclePopup = false
    },
    showAuthPopup () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.authen.show()
    },
    goAuthenCurrentShop () {
      let { isOpenByShare, id } = this
      if (isOpenByShare) {
        this.goDownLoad()
        return
      }
      let url = 'adv/buyerShopAuth'
      let obj = { seller_id: id }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.authenStatus = res.data.audit_status
          this.$refs.authen.hide()
          this.$t('认证已提交，等待商家审核')
        }
      })
    },
    // 跳转商品详情
    goGoodsDetail (id) {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$push({ name: 'GoodsDetail', query: { goodsId: id } })
    },
    goActivityDetail (id) {
      this.$push({ path: '/unionDetail', query: { id } })
    },
    concatService () {
      invokeNativeMethod('invokeTel', this.serviceMobile)
    },
    // 滚动监听
    watchScroll (position) {
      let { y } = position
      if (y < 0) {
        this.scrollY = Math.abs(parseInt(y))
        return
      }
      this.scrollY = 0
    },
    // 滚动结束
    scrollOver () {
      this.$refs.shopScroll.refresh()
    },
    // 设置固定 tab 栏 和容器滚动
    setTabsFixedToTop (scrollY) {
      let { shopScrollContainerTop, scrollWrapperTop, iponeTopStatusHeight, iponeXTopStatusHeight, isPone, $isX } = this
      let deltaOne = shopScrollContainerTop - scrollWrapperTop
      let deltaTwo = shopScrollContainerTop - scrollY
      if (isPone) {
        deltaOne += iponeTopStatusHeight
      }
      if ($isX) {
        deltaOne += iponeXTopStatusHeight
      }
      if (deltaTwo <= deltaOne) {
        // 顶部固定时，让店铺导航隐藏，修复 点击店铺介绍关闭店铺的问题(店铺导航z-index等级高)
        this.isShowShopGuide = false
        this.isShowFixedTabs = true
        return
      }
      this.moveDistance.top = deltaTwo + 'px'
      this.isShowFixedTabs = false
      this.isShowShopGuide = true
    },
    // 去下载页面
    goDownLoad () {
      this.$router.push('/app')
    }
  },
  filters: {
    retainTwoDecimal,
    sliceTitle (str) {
      return sliceChar(str, 10)
    },
    sliceChar (str) {
      str = str.substr(0, 10)
      return str
    },
    calculateCost (cost) {
      return cost === 0 ? '免费' : cost
    },
    getPriceInt (p) {
      return splitMoney(p * 0.01).init
    },
    getPriceZero (p) {
      return splitMoney(p * 0.01).zero
    },
    getActivityTime (d) {
      try {
        return `${d.start_at.substring(5, 16)} 至 ${d.end_at.substring(5, 16)}`
      } catch (e) {
        //
      }
    }
  },
  watch: {
    firstEnter () {
      invokeNativeMethod('setNavigationBarHidden', 1)
      try {
        this.$nextTick(() => {
          let { isAuthenedCurrentShop, $refs } = this
          let { shopScrollContainer, scrollWrapper, authen } = $refs
          this.shopScrollContainerTop = parseInt(shopScrollContainer.getBoundingClientRect().top)
          this.scrollWrapperTop = parseInt(scrollWrapper.getBoundingClientRect().top)
          this.moveDistance.top = this.shopScrollContainerTop + 'px'
          // 认证弹窗
          if (!isAuthenedCurrentShop) {
            authen.show()
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    m_hasMore (val) {
      let { shopCurrentTab } = this
      switch (shopCurrentTab) {
        case 1:
          if (this.m_dataList.length >= 10) this.hasMore = true
          break
        case 2:
        case 3:
          this.hasMore = val
          break
        case 4:
          this.hasMore = true
          break
      }
    },
    shopCurrentTab (val) {
      if (val === 4) {
        this.m_loading = false
        this.hasMore = true
        return
      }
      this.m_loading = true
    },
    scrollY (y) {
      this.setTabsFixedToTop(y)
    },
    shopJoinedCircleList (val) {
      let length = val.length
      this.$nextTick(() => {
        let { marginRight, width } = window.getComputedStyle(this.$refs.circleItem[0])
        let totalWidth = Math.ceil(parseFloat(width) * length + parseFloat(marginRight) * (length - 1))
        this.$refs.circleList.style.width = totalWidth + 'px'
        this.$refs.circleScroll.$el.children[0].style.width = totalWidth + 'px'
      })
    }
  },
  components: {
    BaseNavList,
    BasePopupAuthen
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'GoodsDetail' && this.isFromGoodsDetail) {
      this.$del(to, from, next, this, true)
    }
    next()
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.shop-detail-container
  height 100%
  position relative
  overflow hidden
  background $color-white
  .shop-guide
    position fixed
    z-index 10
    top 48px
    right 30px
    width 164px
    height 56px
    background rgba(0, 0, 0, .3)
    bd(rgba(255, 255, 255, .5))
    border-radius(100px)
    overflow unset
    &.ipone-x
      top 88px
    .guide
      flex-center()
      height 100%
      width 170px
      .icon-nav
        wh(32px)
        bg('icon-more.png')
        position relative
        &.message
          &:after
            content ''
            position absolute
            top 0
            right -16px
            wh(12px)
            bg('icon-tips.png')
      .icon-line
        width 1px;/*no*/
        height 40px
        background $color-c
        opacity .5
        margin 0 24px
      .icon-close-back
        box-sizing content-box
        padding 10px
        padding-left 0
        wh(32px)
        bg('icon-close.png')
        background-origin content-box
        background-clip content-box
    .nav-container
      position absolute
      left -170px
      top 72px
  .shop-detail-banner-wrapper,
  .shop-detail-footer-wrapper
    position absolute
    width 100%
    z-index 1
  .shop-detail-banner-wrapper
    left 0
    top 0
    height 400px
    bg('bg-banner.png')
    .shop-attribute
      padding 110px 30px 0
      &.ipone-x
        padding-top 144px
      h2
        f18()
        font-weight 700
        color $color-white
        margin-bottom 32px
      .shop-label
        flex-f-align()
        .authen-label
          margin-right 20px
          width 120px
          height 36px
          &.unauthen
            bg('icon-unauthen.png')
          &.authened
            bg('icon-authened.png')
          &.auditing
            bg('icon-auditing.png')
        .cicle-label
          bd(rgba(255, 255, 255, .5))
          fz(11px)
          color $color-white
          padding 6px 12px
          padding-top 7px
          border-radius(4px)
  .shop-detail-footer-wrapper
    z-index 20
    left 0
    bottom 0
    height 88px
    flex-center()
    box-shadow 0 -1px 2px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 0 #CCCCCC;/*no*/
    border-top-left-radius 16px
    border-top-right-radius 16px
    f16()
    color $color-6
    &.ipone-x
      bottom 34px
    i
      wh(40px)
      bg('icon-service.png')
      margin-right 22px
  .shop-detail-main-container
    position relative
    padding-top 400px
    padding-bottom 88px
    height 100%
    &.ipone-x
      padding-bottom 122px
    .background
      position absolute
      width 100%
      height 400px
      left 0
      top 0
      background-image linear-gradient(to bottom, $color-orange, $color-white)
      opacity 0
    .detail-container
      position absolute
      width 100%
      left 0
      top 400px
      bottom 88px
      &.ipone-x
        bottom 122px
      .main-wrapper
        position absolute
        width 100%
        bottom 0
        top -160px
        z-index 3
        flex-col()
  .shop-tabs-container
    .tabs-wrapper
      height 88px
      flex-f-align()
      padding 0 30px
      &.fixed
        position fixed
        width 100%
        top 0
        background-image linear-gradient(to bottom, $color-orange, #FFA338)
      &.fixed-ipone
        top 40px
        background-image linear-gradient(to bottom, #FF9518, #FFB053)
      &.fixed-iponex
        top 88px
        background-image linear-gradient(to bottom, #FFA63E, #FFC077)
      .shop-search-guide
        width 140px
        height 56px
        flex-center()
        border-radius(100px)
        background $color-white
        opacity .8
        f14()
        color $color-6
        margin-top -10px
        .icon-search
          wh(28px)
          bg('icon-search.png')
          margin-right 10px
      .tabs-list
        width 100%
        flex 1
        flex-f()
        position relative
        .tabs-item
          position relative
          flex 1
          tc()
          f14()
          color rgba(255, 255, 255, .8)
          bd-b(transparent, 2px)
          padding-bottom 12px
          &.active
            color $color-white
        .line
          position absolute
          height 2px;/*no*/
          bottom 0
          left 0
          transition all .6s
          &.four-tab
            width 25%
            &:after
              content ''
              display block
              margin 0 auto
              width 56px
              height 100%
              background $color-white
            &.tab1
              left 0
            &.tab2
              left 25%
            &.tab3
              left 50%
            &.tab4
              left 75%
          &.three-tab
            width 33.33%
            &:after
              content ''
              display block
              margin 0 auto
              width 56px
              height 100%
              background $color-white
            &.tab1
              left 0
            &.tab2
              left 33.33%
            &.tab4
              left 66.66%
  .shop-goods-tabs-wrapper
    flex-f-align()
    height 88px
    background $color-white
    &.fixed
      position fixed
      width 100%
      top 88px
      background $color-orange
    &.fixed-ipone
      top 128px
    &.fixed-iponex
      top 176px
    .goods-tab-list
      flex-f()
      width 100%
      height 100%
      .goods-tab-item
        position relative
        f14()
        color $color-9
        flex 1
        flex-center()
        i
          wh(24px)
          margin-left 16px
          &.up
            bg('icon-sort-up.png')
          &.down
            bg('icon-sort-down.png')
          &.default
            bg('icon-sort-default.png')
        &.active
          color $color-orange
          font-weight 700
        & + .goods-tab-item
          &:after
            content ''
            position absolute
            width 1px;/*no*/
            height 36px
            background #E5E5E5
            opacity .5
            left 0
            top 50%
            transform translateY(-50%)
  .shop-scroll-container
    flex 1
    overflow hidden
    padding 0 20px
  .scroll-container
    overflow hidden
    background $color-white
    border-top-left-radius 16px
    border-top-right-radius 16px
    &.no-padding
      .scroll-content
        padding 0
    .scroll-content
      padding 20px 0
  .shop-home-container
    .authen-acitivity-wrapper
      padding 0 20px
      > div
        margin-bottom 32px
      .authen-guide
        height 160px
        bg('bg-authen.png')
      .activity-adv
        position relative
        height 240px
        border-radius(8px)
        .activity-info
          position absolute
          width 100%
          height 40px
          bottom 0
          background rgba(0, 0, 0, .5)
          f12()
          flex-align-item()
          padding 0 16px
          color #FFF8A6
          h2
            text-over(1)
            flex 1
            line-height 1.4
            color $color-white
            margin-right 16px
    .hot-goods-guide
      margin-top 10px
      margin-bottom 32px
      flex-center()
      f16()
      color $color-3
      span
        margin 0 24px
        font-weight 700
      .guide-icon-left,
      .guide-icon-right
        wh(40px)
        bg('icon-title.png')
    .all-goods-guide
      tc()
      f16()
      color #FBB35E
      height 88px
      line-height 88px
      background #FFEED3
      border-radius(8px)
  .shop-activity-container
    .activity-list
      .activity-item
        position relative
        padding 20px
        f12()
        color $color-9
        border-radius(16px)
        bd($color-c)
        & + .activity-item
          margin-top 16px
        &.out-time-activity
          bd(transparent)
          &:after
            content ''
            position absolute
            wh(100%)
            left 0
            top 0
            right 0
            bottom 0
            background url(./images/img-over.png) no-repeat top 64px right 32px rgba(0, 0, 0, .3)
            background-size 168px auto
        .shop-circle
          flex-f-align()
          margin-bottom 20px
          .icon-circle
            wh(24px)
            bg('icon-circle.png')
            margin-right 12px
        .activity-pic
          margin-bottom 24px
          height 280px
          img
            wh(100%)
        .activity-title
          f16()
          color $color-3
          margin-bottom 28px
          font-weight 700
          line-height 1.4
          text-over(1)
        .activity-address
          margin-bottom 20px
          flex-f-align()
          .icon-address
            width 24px
            height 26px
            bg('icon-address.png')
            margin-right 8px
        .activity-info
          flex-s-btw()
          .activity-time
            flex-f-align()
            .icon-time
              width 24px
              height 26px
              bg('icon-clock.png')
              margin-right 8px
            .year
              margin-right 14px
          .activity-cost
            f16()
            color #F63F55
          .activity-cost-free
            f14()
            color #F63F55
  .shop-description-info
    .shop-brief
    .brand-brief
      padding 30px
      .brief-title
        border-left 2px solid $color-orange;/*no*/
        padding-left 20px
        f14()
        color $color-orange
      .brief-item
        padding 20px
        div
          margin 20px 0
          flex-f-align()
          justify-content flex-start
          flex-wrap wrap
          .item-left
            f13()
            color $color-9
            margin-right 30px
            white-space nowrap
          .item-right
            f13()
            color $color-3
            line-height 1.4
        .sell-brand
          flex-wrap nowrap
          align-items flex-start
          .label-con
            flex-f()
            flex-wrap wrap
            margin 0
            .item-label
              background #EBEBEB
              padding 4px 10px
              margin 0px 10px 20px
              fz(11px)
              color $color-3
              white-space nowrap
      .concat-seller
        height 88px
        color $color-orange
        f16()
        background #ffffff
        bd($color-orange)
        margin-top 10px
        &.click-get-manual
          margin 40px 0px 60px
      .brand-logo
        vertical-align middle
        padding 30px 0
        f14()
        color #000
        img
          bd(#f4f4f4)
          width 108px
          height 108px
          margin-right 30px
          vertical-align middle
          display inline-block
      .brief-text
        f14()
        color $color-3
        line-height 40px
    .brand-brief
      padding-top 0
  .goods-list
    flex-f()
    flex-wrap wrap
    justify-content space-between
    padding 0 10px
    .goods-item
      max-width 49%
      margin-bottom 32px
      // padding 1px;/*no*/
      .goods-pic
        position relative
        wh(340px)
        border-radius(8px)
        background $color-white
        padding 2px
        .goods-bg
          position absolute
          left 0
          top 0
          right 0
          bottom 0
          &.hot-goods
            bg('bd-hot.png')
          &.flash-goods
            bg('bd-flash.png')
        img
          // display block
          wh(100%)
        .hot-goods-label,
        .falsh-goods-label
          position absolute
          left 0
          top 0
          width 140px
          height 48px
        .hot-goods-label
          bg('icon-hot-label.png')
        .falsh-goods-label
          bg('icon-flash-label.png')
      .goods-title
        f14()
        color $color-0
        margin 16px 0
        line-height 1.4
        // text-over(1)
      .goods-category
        flex-f-align()
        margin-bottom 16px
        span
          f10()
          border-radius(4px)
          padding 6px
          padding-top 7px
          & + span
            margin-left 8px
          &.new-goods
            color #F47575
            background rgba(244, 117, 117, .1)
          &.best-goods
            color $color-orange
            background rgba(255, 138, 0, .1)
          &.meterial-goods
            color #6DACF6
            background rgba(109, 172, 246, .1)
      .goods-price
        f10()
        .authened-price
          flex-f-align()
          .price
            color $color-red
            margin-right 20px
            .price-int
              f16()
          .commission
            border-radius(4px)
            bd($color-orange)
            color $color-orange
            padding 5px 8px
        .unauthen-price
          flex-f-align()
          .price
            height 36px
            margin-right 32px
            color $color-9
            flex-f()
            align-items flex-end
            span
              height 100%
              fz(22px)
              padding-top 12px
          .authen
            border-radius(20px)
            bd(#FE3E58)
            color #FE3E58
            padding 6px 10px
  .shop-joined-circle-popup
    pf(100%)
    left 0
    top 0
    right 0
    bottom 0
    background rgba(0, 0, 0, .6)
    z-index 999
    .circle-wrapper
      position absolute
      top 35%
      width 100%
      .scroll-container
        border-radius(0)
        background transparent
      .scroll-content
        padding 0
        tc()
        margin 0 auto
      .circle-list
        // flex-center()
      .circle-item
        width 420px
        height 540px
        bd($color-d)
        float left
        border-radius(16px)
        background $color-white
        padding 0 28px
        margin-right 32px
        &.no-margin
          margin-right 0
        .circle-logo
          border-radius(8px)
          bd($color-d)
          wh(280px)
          margin 64px auto 0
          img
            display block
            wh(100%)
        .circle-title
          f14()
          color $color-3
          text-over(1)
          line-height 40px
          margin 32px 0
          font-weight 700
        p
          f12()
          color $color-9
          &.circle-number
            margin-bottom 16px
      .circle-close
        display block
        width 80px
        height 80px
        margin 64px auto 0
        bg('icon-circle-close.png')
  .circle-popup
    > div
      width 100%!important
      height 460px!important
      background-color $color-white
      padding 36px 0px
      position relative
      .close
        position absolute
        width 80px
        height 80px
        left 50%
        transform translateX(-50%)
        bottom -100px
        // bg('icon-circle-close.png')
        z-index 8888
        img
          wh(100%)
      ul
        height 388px
        li
          width 370px
          height 390px
          padding-left 32px
          float left
          display flex
          .banner-left
            width 340px
            height 100%
            .top-img
              width 240px
              height 240px
              margin 0 auto
              bd(#f4f4f4)
              border-radius 5px
              img
                wh(100%)
            .center-info
              text-over(1)
              f14()
              color $color-3
              margin-top 20px
              line-height 1.4
            .bottom-info
              margin-top 14px
              p
                f12()
                color $color-6
                line-height 1.3
          .banner-right
            padding-left 5px
  .shop-close-wrapper
    pf(100%)
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0, 0, 0, .7)
    .shop-close
      position absolute
      width 372px
      height 426px
      top 50%
      left 50%
      transform translate(-50%, -50%)
      bg('bg-shop-close.png')
  .has-no-goods
    img
      display block
      width 290px
      height auto
      margin 20px auto 50px
    p
      color $color-9
      margin 10px
      f12()
      tc()
  .border-bottom
    bd-b($color-c)
  .authen-popup-container
    pf(100%)
    left 0
    top 0
    right 0
    bottom 0
    background rgba(0, 0, 0, .6)
    z-index 100
    .honey-authen-popup-wrapper
      position absolute
      width 620px
      min-height 612px
      bg('authen-popup.png')
      left 50%
      top 50%
      transform translate(-50%, -50%)
      .honey-wrapper
        wh(220px)
        margin 0 auto 16px
        overflow hidden
        i
          display block
          margin 20px auto 0
          width 54px
          height 90px
          bg('icon-honey1.png')
        .honey-num
          margin-top 12px
          margin-bottom 10px
          f10()
          flex-center()
          .num
            fz(30px)
            color #F6333D
            margin-right 4px
          .text
            margin-top 10px
      h2
        fz(30px)
        color #F6333D
        tc()
        font-weight 700
        margin-bottom 68px
        line-height 84px
      p
        padding-left 40px
        f14()
        color $color-white
        line-height 40px
        text-align left
      .button
        display block
        width 230px
        margin 30px auto 10px
        padding 25px 0 28px
        tc()
        background #fdd229
        border-radius(10px)
        color #D0021B
        font-weight 700
        f18()
</style>
