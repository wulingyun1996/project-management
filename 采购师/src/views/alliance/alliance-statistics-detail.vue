<template>
  <div class="alliance-statistics-detail-container">
    <base-header :is-show-title="false">
      <base-select-header
        slot="center"
        :id="selectedId"
        @select="getStatisticsData">
      </base-select-header>
    </base-header>
    <div class="alliance-statistics-detail-wrapper">
      <transition name="has-data">
        <div class="statistics-wrapper" v-show="!isShowNoDataPage">
          <!-- 非带单列表 -->
          <base-scroll
            ref="statisticsScroll"
            :data="m_dataList"
            :pullup="m_pullup"
            :pulldown="m_pulldown"
            @scrollToEnd="getStatisticsData(undefined, false)"
            @pulldown="getStatisticsData"
            :hasLoading="m_loading"
            :hasMore="m_hasMore"
            :hasRefresh="m_refresh">
            <ul class="statistics-detail-list">
              <li
                class="statistics-detail"
                v-for="(statisticsItem, index) in m_dataList"
                :key="index">
                <ul class="detail-list">
                  <li class="detail-item">
                    <!-- 卡号 -->
                    <div
                      class="item"
                      v-show="selectedId !== 3">
                      <span class="item-name">卡号：</span>
                      <p class="item-detail">
                        {{ statisticsItem.card }}
                      </p>
                    </div>
                    <!-- 姓名 -->
                    <div class="item">
                      <span class="item-name">姓名：</span>
                      <p class="item-detail">
                        {{ statisticsItem.name }}
                      </p>
                    </div>
                    <!-- 成交店铺 -->
                    <div class="item">
                      <span
                        class="item-name"
                        v-show="selectedId === 7">成交店铺：</span>
                      <p class="item-detail">
                        {{ statisticsItem.belong }}
                      </p>
                    </div>
                    <!-- 报名时间 -->
                    <div
                      class="item"
                      v-show="selectedId === 3 || selectedId === 4">
                      <span class="item-name">报名时间：</span>
                      <p class="item-detail">
                        {{ statisticsItem.time }}
                      </p>
                    </div>
                    <!-- 报名方式 -->
                    <div
                      class="item"
                      v-show="selectedId === 6 || selectedId === 7">
                      <span class="item-name">报名方式：</span>
                      <p class="item-detail">
                        {{ statisticsItem.signType }}
                      </p>
                    </div>
                    <!-- 签到时间 -->
                    <div
                      class="item"
                      v-show="selectedId === 6">
                      <span class="item-name">签到时间：</span>
                      <p class="item-detail">
                        {{ statisticsItem.time }}
                      </p>
                    </div>
                    <!-- 销售金额  -->
                    <div
                      class="item"
                      v-show="selectedId === 7">
                      <span class="item-name">销售金额：</span>
                      <p class="item-detail red">
                        {{ statisticsItem.sales | retainTwoDecimal }}
                      </p>
                    </div>
                    <!-- 定金金额 -->
                    <div
                      class="item"
                      v-show="selectedId === 7">
                      <span class="item-name">定金金额：</span>
                      <p class="item-detail red">
                        {{ statisticsItem.deposit | retainTwoDecimal }}
                      </p>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </base-scroll>
        </div>
      </transition>
      <transition name="no-data">
        <div class="statistics-no-data" v-show="isShowNoDataPage">
          <img class="img-no-data" src="./images/img-no-data.png" alt="">
          <h2>您分享的活动各维度统计</h2>
          <ul class="explain-list">
            <li class="explain-item">
              <i></i>
              <p>线上线下活动报名数据</p>
            </li>
            <li class="explain-item">
              <i></i>
              <p>活动现场签到及销售业绩统计</p>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import BaseSelectHeader from 'components/select/select-header'
import { retainTwoDecimal } from 'common'
import { mixins } from 'mixins'
export default {
  name: 'AllianceStatisticsDetail',
  mixins: [mixins],
  data () {
    return {
      isShowNoDataPage: false,
      selectedId: this.$route.query.id,
      activityId: this.$route.query.activityId
    }
  },
  created () {
    this.getStatisticsData()
  },
  methods: {
    /**
     * 该函数承接 上拉加载，下拉刷新以及初始化
     * flag 用于区分是下拉刷新、头部下拉框与上拉加载更多事件，为 true 需要初始化数据，false 不需要
     */
    async getStatisticsData (id = this.selectedId, flag = true) {
      this.selectedId = id
      if (flag) {
        this.$nextTick(() => {
          this.$refs.statisticsScroll.scrollTo(0, 0, 0, 0)
        })
        this.initData()
      }
      if (!this.m_hasMore) return
      let baseUrl = ''
      switch (id) {
        case 3:
          baseUrl = 'getApplications'
          break
        case 4:
          baseUrl = 'getPay'
          break
        case 6:
          baseUrl = 'getSignIn'
          break
        case 7:
          baseUrl = 'getAccount'
          break
      }
      let url = `analytics/${baseUrl}`
      let obj = {
        actId: this.activityId,
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { data } = res.data
          this.handlerData(data)
          if (this.m_page === 1) {
            this.m_dataList = data
          } else {
            this.m_dataList = [...this.m_dataList, ...data]
          }
          this.m_refresh = false
          this.checkMore(res.data)
        }
      })
    },
    handlerData (data) {
      data.forEach(item => {
        /* eslint-disable */
        let { sellerName, seller, ticket, type } = item
        // 卡号
        item.card = ticket
        // 所属商圈
        item.belong = sellerName ? sellerName : ''
        // 报名方式
        item.signType = type ? '线下' : '线上'
        /* eslint-enable */
      })
    },
    checkMore (data) {
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
    'm_dataList' (val) {
      let length = val.length
      if (length) {
        this.isShowNoDataPage = false
        return
      }
      this.isShowNoDataPage = true
    }
  },
  components: {
    BaseSelectHeader
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.alliance-statistics-detail-container
  height 100%
  overflow hidden
  background #fff
  flex-col()
  .header-sort
    width 40px
    height 42px
    box-sizing content-box
    bg('icon-sort.png')
    padding 20px
    margin-right -20px
    background-origin content-box
    background-clip content-box
  .alliance-statistics-detail-wrapper
    flex 1
    overflow hidden
    flex-col()
    .statistics-wrapper,
    .statistics-no-data
      flex 1
    .statistics-no-data
      &.bg-f4
        background #f4f4f4
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
    .statistics-wrapper
      padding 0 30px
      flex-col()
      .scroll-container
        flex 1
        overflow hidden
      .delegate-container
        height 100%
        padding-top 30px
        flex-col()
        .delegate-detail
          flex-f()
          border-b()
          .delegate-number,
          .delegate-money
            width 48.5%
            margin 75px 0 40px
            tc()
            h3
              color $color-orange
              fz(24px)
              text-over(1)
              line-height 66px
              margin-bottom 10px
            p
              color $color-6
              fz(15px)
      .statistics-detail-list
        padding 0 30px
        .statistics-detail
          f14()
          padding 36px 0
          bd-b(#e8e8e8)
          &:last-child
            border none
          .detail-list
            .detail-item
              > div
                line-height 48px
                flex-f()
                .item-name
                  f14()
                  color $color-3
                  min-width 140px
                  margin-right 30px
                .item-detail
                  f14()
                  text-over(2)
                  color $color-6
                  &.red
                    color $color-red
                  span
                    color $color-9
  .has-data-enter-active,
  .no-data-enter-active
    transition opacity .5s
  .has-data-enter,
  .has-data-leave-to,
  .no-data-enter,
  .no-data-leave-to
    opacity 0
</style>
