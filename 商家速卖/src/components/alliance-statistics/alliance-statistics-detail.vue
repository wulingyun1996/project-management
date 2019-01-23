<template>
  <div class="alliance-statistics-detail-container">
    <base-header :is-show-title="false">
      <base-select-header
        slot="center"
        :id="selectedId"
        @select="getStatisticsData"
        @showDropDown="showDropDown">
      </base-select-header>
      <!-- 排行入口 -->
      <div
        class="header-sort"
        v-if="selectedId === 9"
        @click="viewDelegateList">
      </div>
    </base-header>
    <div class="alliance-statistics-detail-wrapper">
      <transition name="has-data">
        <div class="statistics-wrapper" :class="{ active: selectedId !== 9 && isShowNoDataPage }">
          <!-- 带单数据 -->
          <div class="delegate-container" v-if="selectedId === 9">
            <base-select-statistics
              ref="dropDown"
              :data="allianceShopList"
              @change="selectDelegateDataByShop">
            </base-select-statistics>
            <div v-show="!isShowNoDataPage && delegateDetailLength">
              <!-- <div class="delegate-detail" v-if="delegateDetailLength"> -->
              <div class="delegate-detail">
                <div class="delegate-number">
                  <h3>{{ delegateDetail.sale }}</h3>
                  <p>带单总数</p>
                </div>
                <div class="delegate-money">
                  <h3>{{ delegateDetail.bring | retainTwoDecimal }}</h3>
                  <p>总金额</p>
                </div>
              </div>
              <!-- <div class="delegate-detail" v-else>
                <div class="delegate-number">
                  <h3>0</h3>
                  <p>带单总数</p>
                </div>
                <div class="delegate-money">
                  <h3>0.00</h3>
                  <p>总金额</p>
                </div>
              </div> -->
            </div>
            <!-- 有数据 -->
            <transition name="has-data">
              <base-scroll
                v-show="!isShowNoDataPage"
                ref="delegateScroll"
                :data="m_dataList"
                :pullup="m_pullup"
                :pulldown="m_pulldown"
                @scrollToEnd="getDelegateStatisticsData"
                @pulldown="pullDownRefreshDelegateData"
                :hasLoading="m_loading"
                :hasMore="m_hasMore"
                :hasRefresh="m_refresh">
                <ul class="statistics-detail-list">
                  <li
                    class="statistics-detail"
                    v-for="delegateItem in m_dataList"
                    :key="delegateItem.sellerId">
                    <ul class="detail-list">
                      <li class="detail-item">
                        <!-- 推广员 -->
                        <div class="item">
                          <span class="item-name">推广员：</span>
                          <p class="item-detail">
                            {{ delegateItem.recomonOrigin }}
                            <span v-show="delegateItem.belong">（{{ delegateItem.belong }}）</span>
                          </p>
                        </div>
                        <!-- 带单数量 -->
                        <div class="item">
                          <span class="item-name">带单数量：</span>
                          <p class="item-detail">
                            {{ delegateItem.count }}
                          </p>
                        </div>
                        <!-- 成交金额 -->
                        <div class="item">
                          <span class="item-name">成交金额：</span>
                          <p class="item-detail red">
                            {{ delegateItem.sales | retainTwoDecimal }}
                          </p>
                        </div>
                        <!-- 成交商家 -->
                        <div class="item">
                          <span class="item-name">成交商家：</span>
                          <p class="item-detail">
                            {{ delegateItem.shops }}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </base-scroll>
            </transition>
            <!-- 无数据 -->
            <transition name="no-data">
              <div class="statistics-no-data" v-show="isShowNoDataPage">
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
          <!-- 非带单列表 -->
          <base-scroll
            ref="detailScroll"
            v-else
            v-show="!isShowNoDataPage"
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
                        <span>（{{ statisticsItem.mobile }}）</span>
                      </p>
                    </div>
                    <!-- 推荐来源 -->
                    <div class="item">
                      <span class="item-name">推荐来源：</span>
                      <p class="item-detail">
                        {{ statisticsItem.recomonOrigin }}
                        <span v-show="statisticsItem.belong">（{{ statisticsItem.belong }}）</span>
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
                    <!-- 录入时间 -->
                    <div
                      class="item"
                      v-show="selectedId === 5">
                      <span class="item-name">录入时间：</span>
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
                      <p class="item-detail">
                        {{ statisticsItem.sales | retainTwoDecimal }}
                      </p>
                    </div>
                    <!-- 定金金额 -->
                    <div
                      class="item"
                      v-show="selectedId === 7">
                      <span class="item-name">定金金额：</span>
                      <p class="item-detail">
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
        <div class="statistics-no-data bg-f4" v-show="selectedId !== 9 && isShowNoDataPage">
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
import BaseSelectHeader from 'base/select/select-header'
import BaseSelectStatistics from 'base/select/select-statistics'
import { retainTwoDecimal, judgeObjectLen } from 'commons'
import { mixins } from 'mixins'
export default {
  name: 'AllianceStatisticsDetail',
  mixins: [mixins],
  data () {
    return {
      isShowNoDataPage: false,
      selectedId: this.$route.query.id,
      // 带单店铺
      allianceShopList: [],
      // 带单数量统计
      delegateDetail: {},
      currentDelegateId: ''
    }
  },
  computed: {
    // 是否存在带单数据
    delegateDetailLength () {
      return !!judgeObjectLen(this.delegateDetail)
    },
    activityId () {
      return this.$route.query.activityId
    }
  },
  created () {
    this.getShopList()
    this.getStatisticsData()
  },
  methods: {
    /**
     * 该函数承接 上拉加载，下拉刷新以及初始化
     * flag 用于区分是下拉刷新、头部下拉框与上拉加载更多事件，为 true 需要初始化数据，false 不需要
     */
    async getStatisticsData (id = this.selectedId, flag = true) {
      this.selectedId = id
      if (this.selectedId === 9) {
        this.statusInit()
        this.getDelegateStatisticsData()
        return
      }
      if (flag) {
        if (id !== 9) {
          this.$nextTick(() => {
            this.$refs.detailScroll.scrollTo(0, 0, 0, 0)
          })
        }
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
        case 5:
          baseUrl = 'getBelowLine'
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
    // 销售金额数据处理
    handlerData (data) {
      data.forEach(item => {
        /* eslint-disable */
        let { salesman_name, seller, ticket, type, sellerName } = item
        // 卡号
        item.card = ticket
        // 推荐来源
        item.recomonOrigin = salesman_name ? salesman_name : '采购师平台'
        // 所属商圈
        if (this.selectedId === 7) {
          item.belong = sellerName ? sellerName : ''
        } else {
          item.belong = seller ? seller : ''
        }
        // 报名方式
        item.signType = type ? '线下' : '线上'
        /* eslint-enable */
      })
    },
    // ------------------------------ 带单模块 ------------------------------
    // 下拉刷新
    pullDownRefreshDelegateData () {
      this.initData()
      this.getDelegateStatisticsData().then(() => {
        this.m_refresh = false
      })
    },
    // 带单统计数据
    async getDelegateStatisticsData () {
      if (!this.m_hasMore) return
      let url = 'analytics/bringSales'
      let obj = {
        actId: this.activityId,
        seller: this.currentDelegateId,
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { data, total } = res.data
          this.handlerDelegateData(data)
          if (this.m_page === 1) {
            this.m_dataList = data
          } else {
            this.m_dataList = [...this.m_dataList, ...data]
          }
          this.delegateDetail = total
          this.checkMore(res.data)
        }
      })
      return Promise.resolve()
    },
    // 带单统计列表数据处理
    handlerDelegateData (data) {
      data.forEach(item => {
        /* eslint-disable */
        let { salesman_name, seller, sellerName } = item
        // 推荐来源
        item.recomonOrigin = salesman_name ? salesman_name : '采购师平台'
        // 所属商家
        item.belong = seller ? seller : ''
        item.shops = sellerName.join('、')
        /* eslint-enable */
      })
    },
    // 根据商家筛选带单信息
    selectDelegateDataByShop (item) {
      this.currentDelegateId = item.id
      this.pullDownRefreshDelegateData()
    },
    // 带单店铺信息 -- 圈内商家下拉框数据
    getShopList () {
      let url = 'analytics/getShop'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          res.data.unshift({ shop_name: '全部', seller_id: '' })
          res.data.forEach(item => {
            item.title = item.shop_name
            item.id = item.seller_id
          })
          this.allianceShopList = res.data
        }
      })
    },
    // ------------------------------ 带单模块 ------------------------------
    checkMore (data) {
      this.m_loading = true
      this.dataTotalNum = data.count
      if (!this.m_dataList.length || (this.m_page * this.m_pageSize) >= this.dataTotalNum) {
        this.m_loading = false
        this.m_hasMore = false
      }
    },
    // 解决头部下拉框显示，带单下拉框并行显示的问题
    showDropDown () {
      if (this.selectedId === 9) this.$refs.dropDown.isShowDropDown = false
    },
    viewDelegateList () {
      this.$router.push({ path: '/delegate-list', query: { activityId: this.activityId } })
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
    BaseSelectHeader,
    BaseSelectStatistics
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
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
    .statistics-wrapper
      &.active
        flex none
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
          border-b()
          f14()
          padding 36px 0
          &:last-child
            &:after
              content unset
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
  .has-data-enter-active
    transition opacity .5s
  .has-data-leave-active
    transition opacity 0s
  .has-data-enter,
  .has-data-leave-to
    opacity 0
  .no-data-enter-active,
  .no-data-leave-active
    transition opacity .5s
  .no-data-enter,
  .no-data-leave-to
    opacity 0
</style>
