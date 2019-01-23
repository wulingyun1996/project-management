<template>
  <div class="alliance-activity-statistics-container">
    <base-header></base-header>
    <div class="alliance-activity-statistics-wrapper">
      <div class="statistics-wrapper">
        <!-- <div class="establish-activity-guide" v-if="true" @click="goEstablishActivity">
          <div class="left-guide">
            <i></i>
            <span>您暂时还没有创建活动</span>
          </div>
          <div class="right-guide">
            <span>去发布</span>
            <i></i>
          </div>
        </div> -->
        <div class="user-info">
          <img src="./images/icon-user.png" alt="">
          <span>{{ this.$route.query.name }}</span>
          <span>{{ this.$route.query.mobile }}</span>
        </div>
        <base-select-statistics
          :data="selectStatisticsData"
          @change="getStatisticsData">
        </base-select-statistics>
        <base-scroll :has-more="true">
          <ul>
            <li
              class="item"
              :class="{ [item.icon]: true }"
              v-show="item.show"
              v-for="item in statisticsData"
              :key="item.id"
              @click="viewAllianceStatisticsDetail(item)">
              <h3>{{ item.title }}</h3>
              <p>{{ item.count }}</p>
              <!-- 销售金额弹窗 -->
              <i class="icon-sale-guide" @click.stop="showSaleGuidePopup(false)" v-if="item.id === 9"></i>
              <div class="sale-explain-wrapper" v-show="saleGuidePopup" v-if="item.id === 7">
                <div class="explain-mask" @click.stop="showSaleGuidePopup(true)"></div>
                <div class="explain-body">此活动圈内所有商家的销售业绩总金额</div>
              </div>
              <!-- 带单金额弹窗 -->
              <i class="icon-money-guide" @click.stop="showMoneyGuidePopup(false)" v-if="item.id === 9"></i>
              <div class="money-explain-wrapper" v-show="moneyGuidePopup" v-if="item.id === 9">
                <div class="explain-mask" @click.stop="showMoneyGuidePopup(true)"></div>
                <div class="explain-body">此活动圈内所有商家推广员为其他商家带单的金额</div>
              </div>
            </li>
          </ul>
        </base-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSelectStatistics from 'base/select/select-statistics'
import { mapMutations } from 'vuex'
export default {
  name: 'AllianceActivityStatistics',
  data () {
    return {
      selectStatisticsData: [],
      statisticsData: [],
      // 是否是未建活动状态
      isInitialStatus: false,
      // 销售金额/带单金额指导弹窗
      saleGuidePopup: false,
      saleTimer: null,
      moneyGuidePopup: false,
      moneyTimer: null,
      actId: ''
    }
  },
  created () {
    this.getSelectStatisticsData()
    this.getStatisticsData()
    this.getStatisticsDataList()
  },
  methods: {
    ...mapMutations({
      setAllianceStatisticsDataList: 'SETALLIANCESTATISTICSDATALIST'
    }),
    // 面板下拉列表
    getSelectStatisticsData () {
      let url = 'analytics/getActList'
      let obj = {
        type: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          res.data.unshift({ id: 0, title: '全部' })
          this.selectStatisticsData = res.data
        }
      })
    },
    // 面板数据
    getStatisticsData (item) {
      let url = 'salemanAnalytics/index'
      let obj = {
        salesman: this.$route.query.id,
        actId: (item && item.id) || 0
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerStatisticsData(res.data)
          this.statisticsData = res.data
        }
      })
      if (item === undefined) {
        this.actId = 0
      } else {
        this.actId = item.id
      }
    },
    handlerStatisticsData (data) {
      let item = JSON.parse(JSON.stringify(data[0]))
      // 判断是否未创建过活动
      let flag = true
      data.splice(0, 1)
      data.splice(1, 0, item)
      data.forEach(item => {
        let { id, count } = item
        if (Number(count)) flag = false
        switch (id) {
          case 1:
            item.title = '浏览量'
            item.icon = 'list-one-item'
            item.show = true
            item.click = false
            break
          case 2:
            item.title = '转发量'
            item.icon = 'list-one-item'
            item.show = true
            item.click = false
            break
          case 3:
            item.title = '提交资料数'
            item.icon = 'list-two-item icon-submit'
            item.show = true
            item.click = true
            break
          case 4:
            item.title = '活动支付数'
            item.icon = 'list-two-item icon-pay'
            item.show = true
            item.click = true
            break
          case 5:
            item.title = '线下录入'
            item.icon = 'list-two-item icon-input'
            item.show = true
            item.click = true
            break
          case 6:
            item.title = '签到成功'
            item.icon = 'list-two-item icon-checked'
            item.show = true
            item.click = true
            break
          case 7:
            item.title = '销售金额'
            item.icon = 'list-two-item icon-sale'
            item.show = true
            item.click = true
            break
          case 8:
            item.title = '定金金额'
            item.icon = 'list-two-item icon-money'
            item.show = true
            item.click = true
            break
        }
      })
      if (flag) {
        this.isInitialStatus = true
      }
    },
    // 活动统计详情数据
    getStatisticsDataList () {
      let url = 'salemanAnalytics/getCountList'
      this.$http(url, { salesman: this.$route.query.id }).then(res => {
        if (res.code === this.$ok) {
          let selectList = res.data.pop()
          console.log(selectList)
          this.setAllianceStatisticsDataList(res.data)
        }
      })
    },
    // 查看详情
    viewAllianceStatisticsDetail (item) {
      let { id, click } = item
      if (!click && this.isInitialStatus) return
      if (id === 1 || id === 2) return
      this.$router.push({ name: 'GeneralizeStatisticsDetail', query: { id, salesman: this.$route.query.id, actId: this.actId } })
    },
    // 弹窗事件
    showSaleGuidePopup (flag) {
      if (flag) {
        this.saleGuidePopup = false
        if (this.saleTimer) clearTimeout(this.saleTimer)
        return
      }
      this.saleGuidePopup = true
      this.saleTimer = setTimeout(() => {
        this.saleGuidePopup = false
        clearTimeout(this.saleTimer)
      }, 5000)
    },
    showMoneyGuidePopup (flag) {
      if (flag) {
        this.moneyGuidePopup = false
        if (this.moneyTimer) clearTimeout(this.moneyTimer)
        return
      }
      this.moneyGuidePopup = true
      this.moneyTimer = setTimeout(() => {
        this.moneyGuidePopup = false
        clearTimeout(this.moneyTimer)
      }, 5000)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'ManagerManagement') {
      this.$del(to, from, next, this, true)
    }
    next()
  },
  components: {
    BaseSelectStatistics
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.alliance-activity-statistics-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .alliance-activity-statistics-wrapper
    flex 1
    padding 30px
    padding-bottom 0
    .statistics-wrapper
      height 100%
      flex-col()
      .drop-down-container .drop-down-list
        top: 270px
      .user-info
        margin-bottom 30px
        display flex
        align-items center
        img
          width 32px
          height 32px
          margin-right 12px
        span
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #333333
          letter-spacing: -0.34px
        span:last-child
          margin-left 32px
      .establish-activity-guide
        height 64px
        background #FEF1F3
        margin -30px
        margin-bottom 0
        padding 0 30px
        flex-align-item()
        color $color-orange
        > div
          flex-f-align()
        .left-guide
          f14()
          align-items flex-end
          i
            width 34px
            height 32px
            margin-right 6px
            bg('icon-star.png')
        .right-guide
          f13()
          i
            width 18px
            height 16px
            margin-left 6px
            bg('icon-arrow.png')
      .scroll-container
        flex 1
    ul
      flex-f()
      flex-wrap wrap
      .item
        position relative
        width 48.5%
        margin-bottom 40px
        .icon-sale-guide,
        .icon-money-guide
          position absolute
          right 15px
          top 0
          width 62px
          height 56px
        .icon-sale-guide
          bg('icon-sale-guide.png')
        .icon-money-guide
          bg('icon-money-guide.png')
        .sale-explain-wrapper,
        .money-explain-wrapper
          position absolute
          top -170px
          right 0
          width 242px
          height 158px
          color #FF8F8A
          f13()
          tc()
          line-height 36px
          padding 20px
          padding-top 15px
          bg('bg-sale.png')
          .explain-mask
            position fixed
            left -1000%
            right -1000%
            top -1000%
            bottom -1000%
            background rgba(0, 0, 0, 0)
            opacity 0
        .money-explain-wrapper
          width 290px
          height 178px
          color #62BEFF
          top -187px
          padding 30px 15px
          bg('bg-money.png')
        &:nth-child(2n+1)
          margin-right 20px
      .list-one-item
        margin 70px 0
        tc()
        h3
          color $color-orange
          fz(24px)
          line-height 66px
          margin-bottom 10px
        p
          color $color-6
          fz(15px)
          text-over(1)
      .list-two-item
        height 192px
        border-radius(20px)
        overflow unset
        padding 0 28px
        background-size 76px auto
        flex-col()
        align-items flex-end
        justify-content center
        h3
          f14()
        p
          fz(20px)
          line-height 56px
        &.icon-submit
          box-shadow 0 10px 0 0 #FDE8D3
          background url('./images/icon-submit.png') no-repeat left 28px center #FFF7EF
          background-size 76px auto
          color $color-orange
        &.icon-pay
          box-shadow 0 10px 0 0 #D5E4FC
          background url('./images/icon-pay.png') no-repeat left 28px center #F1F6FF
          background-size 76px auto
          color #5F97FF
        &.icon-input
          box-shadow 0 10px 0 0 #EDDFFA
          background url('./images/icon-input.png') no-repeat left 28px center #F9F5FF
          background-size 76px auto
          color #AF7AFF
        &.icon-checked
          box-shadow 0 10px 0 0 #FFDFED
          background url('./images/icon-checked.png') no-repeat left 28px center #FFF5F9
          background-size 76px auto
          color #FF83B9
        &.icon-sale
          box-shadow 0 10px 0 0 #FFDBDB
          background url('./images/icon-sale.png') no-repeat left 28px center #FFF6F5
          background-size 76px auto
          color #FF837E
        &.icon-money
          box-shadow 0 10px 0 0 #D9EEFF
          background url('./images/icon-money.png') no-repeat left 28px center #F5FBFF
          background-size 76px auto
          color #5CBCFF
</style>
