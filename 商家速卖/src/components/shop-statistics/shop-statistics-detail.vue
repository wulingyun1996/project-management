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
    </base-header>
    <div class="alliance-statistics-detail-wrapper">
        <!-- 带单数据 -->
      <div class="delegate-container" v-if="selectedId === 9">
          <div class="delegate-wrapper">
            <div class="delegate-tab">
              <div class="left-tab" :class="{ active: currentTab === 0 }" @click="toggleTab(0)">为我带单</div>
              <div class="right-tab" :class="{ active: currentTab === 1 }" @click="toggleTab(1)">为他带单</div>
            </div>
            <div class="delegate-detail" v-if="delegateDetailLength">
              <div class="delegate-number">
                <h3>{{ delegateDetail.count }}</h3>
                <p>带单总数</p>
              </div>
              <div class="delegate-money">
                <h3>{{ delegateDetail.sale | retainTwoDecimal }}</h3>
                <p>总金额</p>
              </div>
            </div>
            <div class="delegate-detail" v-else>
              <div class="delegate-number">
                <h3>0</h3>
                <p>带单总数</p>
              </div>
              <div class="delegate-money">
                <h3>0.00</h3>
                <p>总金额</p>
              </div>
            </div>
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
                    v-for="(delegateItem, index) in m_dataList"
                    :key="index">
                    <ul class="detail-list">
                      <li class="detail-item">
                        <div class="item">
                          <span class="item-name">卡号：</span>
                          <p class="item-detail orange">
                            {{ delegateItem.ticket }}
                          </p>
                        </div>
                      </li>
                      <li class="detail-item">
                        <div class="item">
                          <span class="item-name">姓名：</span>
                          <p class="item-detail">
                            {{ delegateItem.name }}
                            <span>（{{ delegateItem.mobile }}）</span>
                          </p>
                        </div>
                      </li>
                      <li class="detail-item">
                        <div class="item">
                          <span class="item-name">推广员：</span>
                          <p class="item-detail">
                            {{ delegateItem.salesman_name }}
                            <span v-show="delegateItem.seller && currentTab === 0" >（{{ delegateItem.seller }}）</span>
                          </p>
                        </div>
                      </li>
                      <li class="detail-item" v-show="currentTab === 1">
                        <div class="item">
                          <span class="item-name">成交商家：</span>
                          <p class="item-detail">
                            <span v-for="(item, index) in delegateItem.sellerName" :key="index">{{ item }}</span>
                          </p>
                        </div>
                      </li>
                      <li class="detail-item">
                        <div class="item">
                          <span class="item-name">成交金额：</span>
                          <p class="item-detail red">
                            {{ delegateItem.sales | retainTwoDecimal }}
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
          </div>
          <!-- 有数据 -->
          <!-- <transition name="has-data">
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
                    <li class="detail-item"> -->
                      <!-- 推广员 -->
                      <!-- <div class="item">
                        <span class="item-name">推广员：</span>
                        <p class="item-detail">
                          {{ delegateItem.salesman_name }}
                        </p>
                      </div> -->
                      <!-- 带单数量 -->
                      <!-- <div class="item">
                        <span class="item-name">带单数量：</span>
                        <p class="item-detail">
                          {{ delegateItem.count }}
                        </p>
                      </div> -->
                      <!-- 成交金额 -->
                      <!-- <div class="item">
                        <span class="item-name">成交金额：</span>
                        <p class="item-detail red">
                          {{ delegateItem.sales | retainTwoDecimal }}
                        </p>
                      </div>  -->
                      <!-- 成交商家 -->
                      <!-- <div class="item">
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
          </transition> -->
          <!-- 无数据 -->
          <transition name="no-data">
            <div class="no-data" v-show="isShowNoDataPage">
              <img class="img-no-data" src="./images/img-no-data.png" alt="">
              <h2>您参加所有联盟活动的各维度统计</h2>
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
      <transition name="has-data">
        <div class="statistics-wrapper" v-show="!isShowNoDataPage">
          <!-- 非带单列表 -->
          <base-scroll
            ref="detailScroll"
            v-if="selectedId !== 9"
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
                    <!-- 手机号 -->
                    <div class="item">
                      <span class="item-name">手机号：</span>
                      <p class="item-detail">
                        {{ statisticsItem.mobile }}
                      </p>
                    </div>
                    <!-- 推荐来源 -->
                    <div class="item">
                      <span class="item-name">推荐来源：</span>
                      <p class="item-detail">
                        {{ statisticsItem.recomonOrigin }}
                      </p>
                    </div>
                    <!-- 参与活动 -->
                    <div class="item"
                    v-show="actId === 0"
                    >
                      <span class="item-name">参与活动：</span>
                      <p class="item-detail">
                        {{ statisticsItem.actName }}
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
          <h2>您参加所有联盟活动的各维度统计</h2>
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
import BaseSelectHeader from 'base/select/select-header'
import BaseSelectStatistics from 'base/select/select-statistics'
import { retainTwoDecimal, judgeObjectLen } from 'commons'
import { mapMutations } from 'vuex'
import { mixins } from 'mixins'
const countId = [
  {'id': 3, 'name': '提交资料数'},
  {'id': 4, 'name': '活动支付数'},
  {'id': 5, 'name': '线下录入'},
  {'id': 6, 'name': '签到成功'},
  {'id': 7, 'name': '销售金额'},
  {'id': 9, 'name': '带单金额'}
]
export default {
  name: 'AllianceStatisticsDetail',
  mixins: [mixins],
  data () {
    return {
      isShowNoDataPage: false,
      currentTab: 0,
      selectedId: Number(this.$route.query.id),
      actId: Number(this.$route.query.actId),
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
      return !judgeObjectLen(this.delegateDetail)
    }
  },
  created () {
    // this.getShopList()
    this.getStatisticsData()
    if (this.$dev === 1) {
      this.setAllianceStatisticsDataList(countId)
    } else if (this.$dev === 2) {
      this.setAllianceStatisticsDataList(countId)
    }
  },
  methods: {
    ...mapMutations({
      setAllianceStatisticsDataList: 'SETALLIANCESTATISTICSDATALIST'
    }),
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
      let url = `ShopAnalytics/${baseUrl}`
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize,
        actId: this.$route.query.actId
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
        let { salesman_name, sellerName, ticket, type } = item
        // 卡号
        item.card = ticket
        // 推荐来源
        item.recomonOrigin = salesman_name ? salesman_name : '采购师平台'
        // 所属商圈
        item.belong = sellerName ? sellerName : ''
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
      let url = 'ShopAnalytics/bringSales'
      let obj = {
        type: this.currentTab,
        page: ++this.m_page,
        pageSize: this.m_pageSize,
        actId: this.$route.query.actId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.delegateDetail['count'] = res.data.count
          this.delegateDetail['sale'] = res.data.sale
          let { data } = res.data
          this.handlerDelegateData(data)
          if (this.m_page === 1) {
            this.m_dataList = data
          } else {
            this.m_dataList = [...this.m_dataList, ...data]
          }
          // this.delegateDetail = sale
          this.checkMore(res.data)
        }
      })
      return Promise.resolve()
    },
    // 带单统计列表数据处理
    handlerDelegateData (data) {
      data.forEach(item => {
        item.shops = item.sellerName.join('、')
      })
    },
    // 根据商家筛选带单信息
    selectDelegateDataByShop (item) {
      this.currentDelegateId = item.id
      this.pullDownRefreshDelegateData()
    },
    // 带单店铺信息 -- 圈内商家下拉框数据
    // tab 切换
    toggleTab (i) {
      this.currentTab = i
      this.initData()
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      this.getDelegateStatisticsData().then(() => {
        this.m_refresh = false
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
      this.$router.push('/delegate-list')
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

<style lang='stylus' scoped>
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
        padding-left 130px
        margin-bottom 32px
      .explain-list
        padding-left 150px
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
      margin 40px 0 40px
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
.alliance-statistics-detail-container .alliance-statistics-detail-wrapper .delegate-wrapper
  padding 30px
  padding-bottom 0
  padding-top 0
  flex 1
  flex-col()
  .delegate-tab
    bd($color-orange)
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
  .delegate-detail
    flex-f()
    // border-b()
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
    padding 30px 30px 0
    .statistics-detail
      border-b()
      f14()
      padding 36px 30px
      position relative
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
              margin-right 30px
            .item-detail
              f14()
              text-over(2)
              color $color-6
              &.red
                color $color-red
              &.orange
                text-over(1)
                color $color-orange
              span
                color $color-9
  .scroll-container,
  .delegate-placeholder
    flex 1
    overflow hidden
.alliance-statistics-detail-container .alliance-statistics-detail-wrapper .no-data
  flex 1
  margin-top -300px
  .img-no-data
    display block
    width 348px
    height 208px
    margin 0 auto 94px
  h2
    f18()
    color $color-orange
    padding-left 130px
    margin-bottom 32px
  .explain-list
    padding-left 150px
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
</style>
