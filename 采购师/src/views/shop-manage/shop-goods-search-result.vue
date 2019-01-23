<template>
  <div class="goods-search-result-container animation_slide_to_left" ref="searchResultWrapper">
    <div class="goods-search-header">
      <div
        class="search-header"
        :class="{ 'ipone-x': $isX && !inWx, 'ipone': isPone && !inWx }">
        <a href="javascript:" class="arrow-back" @click="goBack">
          <i class="icon-back"></i>
        </a>
        <div class="search-input" @click="goBack">
          <input type="text" v-model="keyWords" readonly>
        </div>
      </div>
    </div>
    <div class="goods-search-content-wrapper">
      <div class="shop-goods-tabs-wrapper">
        <ul class="goods-tab-list">
          <li
            class="goods-tab-item"
            :class="{ active: goodsTab ===  goodsTypeTabItem.id }"
            v-for="goodsTypeTabItem in goodsTypeTabList"
            :key="goodsTypeTabItem.id"
            @click="filterShopGoods(goodsTypeTabItem)">
            {{ goodsTypeTabItem.text }}
            <i
              v-show="goodsTypeTabItem.id !== 1"
              :class="{ [goodsTypeTabItem.sort]: true }">
            </i>
          </li>
        </ul>
      </div>
      <transition name="has-data">
        <base-scroll
          v-show="m_dataList.length"
          ref="searchGoodsScroll"
          :has-more='m_hasMore'
          :pullup="m_pullup"
          :pulldown="m_pulldown"
          :has-loading="m_loading"
          :has-refresh="m_refresh"
          :data="m_dataList"
          @scrollToEnd="getData"
          @pulldown="pullDownRefreshData">
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
              <h2 class="goods-title">{{ goodsItem.title }}</h2>
              <div class="goods-category">
                <span class="new-goods" v-show="goodsItem.is_stock_good">现货</span>
                <span class="best-goods" v-show="goodsItem.boutique">精品馆</span>
                <span class="meterial-goods" v-show="goodsItem.material">材料馆</span>
                <span class="placeholder">占位</span>
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
                </div>
                <!-- 普通商品且未认证 -->
                <div class="unauthen-price" v-else>
                  <p class="price">￥<span>***</span></p>
                  <b class="authen">认证看底价</b>
                </div>
              </div>
            </li>
          </ul>
        </base-scroll>
      </transition>
      <transition name="no-data">
        <div class="search-no-goods" v-show="!m_dataList.length">
          <img src="./images/img-placeholder.png" alt="">
          <p>在该店铺没有找到相关商品</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mixins } from 'mixins'
const goodsTypeTabList = [
  { text: '综合', id: 1 },
  { text: '佣金', id: 2, sort: 'default' },
  { text: '价格', id: 3, sort: 'default' }
]
export default {
  name: 'ShopGoodsSearchResult',
  mixins: [mixins],
  props: {
    id: {
      type: Number,
      default: 211
    },
    authenStatus: {
      default: 2
    },
    keyWords: ''
  },
  data () {
    return {
      goodsTab: 1,
      goodsTypeTabList,
      // 记录商品列表筛选条件
      filterGoodsRule: {
        type: 1,
        sort: null
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    goBack () {
      this.$refs.searchResultWrapper.classList.add('goods-search-result-container', 'animation_slide_to_right')
      setTimeout(() => {
        this.$back()
      }, 500)
    },
    filterShopGoods (item) {
      let { sort, id } = item
      this.goodsTab = id
      this.filterGoodsRule.type = id
      this.goodsTypeTabList[1].sort = 'default'
      this.goodsTypeTabList[2].sort = 'default'
      if (sort) {
        if (sort === 'up') {
          this.goodsTypeTabList[id - 1].sort = 'down'
          this.filterGoodsRule.sort = 'down'
        } else {
          this.goodsTypeTabList[id - 1].sort = 'up'
          this.filterGoodsRule.sort = 'up'
        }
      } else {
        this.filterGoodsRule.sort = null
      }
      this.pullDownRefreshData()
      this.$nextTick(() => {
        this.$refs.searchGoodsScroll.scrollTo(0, 0, 0, 0)
      })
    },
    async getData () {
      /* eslint-disable */
      let { filterGoodsRule, m_hasMore, m_pageSize, id, keyWords } = this
      let { type, sort } = filterGoodsRule
      if (!m_hasMore) return
      let url = 'adv/goodsList'
      let obj =  {
        id,
        search: keyWords.trim(),
        page: ++this.m_page,
        pageSize: m_pageSize
      }
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
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (this.m_page === 1) {
            this.m_dataList = res.data.data
          } else {
            this.m_dataList = [...this.m_dataList, ...res.data.data]
          }
          this._checkMore(res.data)
          return
        }
        this.$t(res.message)
      })
      return Promise.resolve()
    },
    goGoodsDetail (goodsId) {
      this.$push({ name: 'GoodsDetail', query: { goodsId } })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.goods-search-result-container
  pf(100%)
  top 0
  bottom 0
  z-index 10000
  flex-col()
  .goods-search-header
    overflow hidden
    background $color-orange
    .search-header
      height 90px
      padding-left 48px
      padding-right 40px
      flex-align-item()
      &.ipone-x
        margin-top 88px
      &.ipone
        margin-top 40px
    .arrow-back
      height 100%
      padding 0 20px
      margin-left -20px
      margin-right 20px
      flex-f-align()
      .icon-back
        width 24px
        height 44px
        bg('icon-arrow-left.png')
    .search-button
      f14()
      height 100%
      line-height 90px
      color $color-white
      padding 0 20px
      margin-right -20px
    .search-input
      height 60px
      flex 1
      position relative
      user-select none
      &:before
        content ''
        position absolute
        wh(28px)
        left 20px
        top 50%
        transform translateY(-50%)
        bg('icon-search.png')
      .icon-clear
        position absolute
        width 32px
        height 34px
        right 20px
        top 50%
        transform translateY(-50%)
        bg('icon-clear.png')
      input
        wh(100%)
        border-radius(100px)
        background #F8F8F8
        padding-left 72px
        padding-right 55px
        f14()
        color $color-6
        &:placeholder
          color $color-c
  .goods-search-content-wrapper
    flex 1
    flex-col()
    background $color-white
    .goods-tab-list
      flex-f()
      width 100%
      height 88px
      bd-b($color-f4)
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
    .scroll-container
      flex 1
      overflow hidden
    .goods-list
      flex-f()
      flex-wrap wrap
      justify-content space-between
      padding 0 30px
      .goods-item
        max-width 49%
        margin-bottom 32px
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
            display block
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
          text-over(1)
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
            &.placeholder
              opacity 0
        .goods-price
          f10()
          .authened-price
            flex-f-align()
            .price
              color $color-red
              margin-right 20px
              .price-int
                f16()
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
    .search-no-goods
      padding-top 84px
      img
        display block
        wh(320px)
        margin 0 auto 68px
      p
        f14()
        tc()
        color $color-9
</style>
