<template>
  <div class="delegate-list-container">
    <base-header></base-header>
    <div class="delegate-wrapper">
        <div class="delegate-tab">
          <div class="left-tab" :class="{ active: currentTab === 0 }" @click="toggleTab(0)">按商家</div>
          <div class="right-tab" :class="{ active: currentTab === 1 }" @click="toggleTab(1)">按推广员</div>
        </div>
        <transition name="has-data">
          <base-scroll
            ref="delegateScroll"
            v-show="!hasNoData"
            :data="m_dataList"
            :pullup="m_pullup"
            :pulldown="m_pulldown"
            @scrollToEnd="getData"
            @pulldown="pullDownRefreshData"
            :hasLoading="m_loading"
            :hasMore="m_hasMore"
            :hasRefresh="m_refresh">
            <ul class="statistics-detail-list">
              <li
                class="statistics-detail"
                v-for="(item, index) in m_dataList"
                :key="index">
                <ul class="detail-list">
                  <li class="detail-item" v-show="currentTab === 0">
                    <div class="item">
                      <span class="item-name">带单商家：</span>
                      <p class="item-detail orange word-break">
                        {{ item.belong }}
                      </p>
                    </div>
                  </li>
                  <li class="detail-item">
                    <div class="item">
                      <span class="item-name">成交商家：</span>
                      <p class="item-detail word-break">
                        <span>{{ item.shops }}</span>
                      </p>
                    </div>
                  </li>
                  <li class="detail-item" v-show="currentTab === 1">
                    <div class="item">
                      <span class="item-name">推广员：</span>
                      <p class="item-detail">
                        {{ item.recomonOrigin }}
                        <span v-show="item.belong">（{{ item.belong }}）</span>
                      </p>
                    </div>
                  </li>
                  <li class="detail-item">
                    <div class="item">
                      <span class="item-name">带单总数量：</span>
                      <p class="item-detail">
                        <span>{{ item.count }}</span>
                      </p>
                    </div>
                  </li>
                  <li class="detail-item">
                    <div class="item">
                      <span class="item-name">成交总金额：</span>
                      <p class="item-detail red">
                        {{ item.sales | retainTwoDecimal }}
                      </p>
                    </div>
                  </li>
                </ul>
                <img src="./images/img-gold.png" alt="" v-if="index === 0">
                <img src="./images/img-silver.png" alt="" v-if="index === 1">
                <img src="./images/img-copper.png" alt="" v-if="index === 2">
              </li>
            </ul>
          </base-scroll>
        </transition>
        <transition name="no-data">
          <div class="delegate-placeholder" v-show="hasNoData">
            <img class="img-no-data" src="./images/img-no-data.png" alt="">
            <h2>您创建的活动各维度统计</h2>
            <ul class="explain-list">
              <li class="explain-item">
                <i></i>
                <p>线上线下活动报名数据</p>
              </li>
              <li class="explain-item">
                <i></i>
                <p>活动现场签到及销售业绩统计</p>
              </li>
              <li class="explain-item">
                <i></i>
                <p>圈内商家之间互带单的排行统计</p>
              </li>
            </ul>
          </div>
        </transition>
    </div>
  </div>
</template>

<script>
import { retainTwoDecimal } from 'commons'
import { mixins } from 'mixins'
export default {
  name: 'DelegateList',
  mixins: [mixins],
  data () {
    return {
      currentTab: 0,
      hasNoData: false
    }
  },
  computed: {
    activityId () {
      return this.$route.query.activityId
    }
  },
  created () {
    this.getData()
  },
  methods: {
    toggleTab (i) {
      this.currentTab = i
      this.initData()
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      this.getData().then(() => {
        this.m_refresh = false
      })
    },
    async getData () {
      /* eslint-disable */
      let { m_pageSize, m_hasMore, currentTab } = this
      if (!m_hasMore) return
      let url = 'analytics/getTopBringSales'
      let obj = {
        actId: this.activityId,
        page: ++this.m_page,
        pageSize: m_pageSize,
        type: currentTab
      }
      /* eslint-enable */
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { data } = res.data
          this.handlerDelegateListData(data)
          if (this.m_page === 1) {
            this.m_dataList = data
          } else {
            this.m_dataList = [...this.m_dataList, ...data]
          }
          this.checkMoreData(res.data)
        }
      })
    },
    handlerDelegateListData (data) {
      data.forEach(item => {
        /* eslint-disable */
        let { salesman_name, seller, sellerName } = item
        // 推荐来源
        item.recomonOrigin = salesman_name ? salesman_name : '采购师平台'
        // 所属商圈
        item.belong = seller ? seller : ''
        // 报名方式
        item.shops = sellerName.join('、')
        /* eslint-enable */
      })
    },
    checkMoreData (data) {
      this.m_loading = true
      this.dataTotalNum = data.count
      if (!this.m_dataList.length || (this.m_page * this.m_pageSize) >= this.dataTotalNum) {
        this.m_loading = false
        this.m_hasMore = false
      }
    }
  },
  filters: {
    retainTwoDecimal
  },
  watch: {
    'm_dataList' (value) {
      let lengths = value.length
      if (lengths) {
        this.hasNoData = false
        return
      }
      this.hasNoData = true
    }
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.delegate-list-container
  height 100%
  overflow hidden
  background #fff
  flex-col()
  .delegate-wrapper
    padding 30px
    padding-bottom 0
    flex 1
    flex-col()
    .delegate-tab
      bd($color-orange, 2px)
      border-radius(100px)
      flex-f()
      tc()
      f14()
      height 80px
      line-height 80px
      margin-bottom 8px
      > div
        height 100%
        flex 1
        color $color-orange
        &.active
          color $color-white
          background $color-orange
    .statistics-detail-list
      padding 30px 0
      .statistics-detail
        border-b()
        f14()
        padding 36px 30px
        position relative
        background #FFFAF5
        &:nth-child(-n+3)
          margin-top 32px
          border-radius(16px)
          img
            width 56px
            height 72px
            position absolute
            top 0
            right 16px
          &:after
            content unset
        &:last-child
          &:after
            content unset
        &:nth-child(1)
          margin-top 0
          background-image linear-gradient(-180deg, #FFF6E6 0%, #FFE9C8 100%)
        &:nth-child(2)
          background-image linear-gradient(-180deg, #F7F7F7 0%, #EBEBEB 100%)
        &:nth-child(3)
          background-image linear-gradient(-180deg, #F5F1EC 0%, #E6DFD4 100%)
        .detail-list
          .detail-item
            > div
              line-height 48px
              flex-f()
              .item-name
                f14()
                color #505050
                min-width 168px
                margin-right 12px
              .item-detail
                f14()
                text-over(2)
                color $color-6
                &.red
                  color $color-red
                &.orange
                  text-over(1)
                  color $color-orange
                &.word-break
                  padding-right 35px
                span
                  color $color-9
    .scroll-container,
    .delegate-placeholder
      flex 1
      overflow hidden
      .img-no-data
        display block
        width 348px
        height 208px
        margin 184px auto 94px
      h2
        f18()
        color $color-orange
        padding-left 174px
        margin-bottom 32px
      .explain-list
        padding-left 186px
        .explain-item
          flex-f-align()
          f14()
          color $color-3
          line-height 60px
          i
            background $color-orange
            wh(12px)
            border-radius(50%)
            margin-right 16px
  .has-data-enter-active,
  .no-data-enter-active
    transition opacity .5s
  .has-data-enter,
  .has-data-leave-to,
  .no-data-enter,
  .no-data-leave-to
    opacity 0
</style>
