<template>
  <div class="my-activity-container">
    <base-header></base-header>
    <div class="my-activity-tab" :class="{ active: tabIndex === 1}">
      <div class="tab-item" :class="{ active: tabIndex === 0}" @click="toggleTab(0)">报名的活动</div>
      <div class="tab-item" :class="{ active: tabIndex === 1}" @click="toggleTab(1)">推广的活动</div>
    </div>
    <div class="my-activity-wrapper">
      <base-scroll
        ref="activityScroll"
        v-show="!hasNoData"
        :hasMore='m_hasMore'
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        :hasLoading="m_loading"
        :hasRefresh="m_refresh"
        @scrollToEnd="getData"
        @pulldown="pullDownRefreshData"
        :data="m_dataList">
        <ul class="activity-list">
          <li
            class="list-item"
            v-for="(item, index) in m_dataList"
            :key="index"
            @click="viewActivityDetail(item.id)">
            <div class="item-status" v-show="!tabIndex">
              <p v-show="item.status_pay">
                <i class="status-success"></i>
                <span class="status-success">报名成功</span>
              </p>
              <p v-show="item.status_pay === 0">
                <i class="status-wait-pay"></i>
                <span class="status-wait-pay">待付款</span>
              </p>
            </div>
            <div class="activity-picture">
              <i class="icon-down" v-if="item.status_activity.code === 2"></i>
              <i class="icon-end" v-if="item.status_activity.code === 6"></i>
              <span v-if="item.status_activity.code === 2"></span>
              <img :src="item.image_path" alt="">
            </div>
            <h1>{{ item.title }}</h1>
            <p class="item-time">
              <i class="icon-time"></i>
              <span>{{ item.start_at | formatTime }}至{{ item.end_at | formatTime }}</span>
            </p>
            <p class="item-address">
              <i class="icon-address"></i>
              <span>{{ item.province + item.city + item.area + item.address }}</span>
            </p>
            <div class="activity-guide">
              <span v-if="!tabIndex && item.status_pay" @click.stop="goTicket(item.id, item.mobile, item.name)">查看入场券</span>
              <span v-if="showPayEntry(item)" @click.stop="goPay(item.id, item.mobile)">去付款</span>
              <span v-if="tabIndex" @click.stop="viewStatistics(item.active_id)">查看统计</span>
            </div>
          </li>
        </ul>
      </base-scroll>
      <div class="no-data" v-show="hasNoData">
        <img src="./images/img-no-datas.png" alt="">
        <p>暂无活动~</p>
      </div>
    </div>
    <div class="ticket-box" v-transfer-dom>
      <x-dialog v-model="showTicket" hide-on-blur>
        <div class="ticket" id="ticket">
          <div class="ticket-info">
            <p class="ticket-title">诚邀</p>
            <p class="user-name">{{ ticket.userName }}</p>
            <div class="ticket-base">
              <p>
                <img class="icon-clock" src="./images/icon-time.png" alt="">
                <span>{{ ticket.time }}</span>
              </p>
              <p>
                <img class="icon-address" src="./images/icon-address.png" alt="">
                <span>{{ ticket.address }}</span>
              </p>
            </div>
          </div>
          <div class="ticket-no">
            {{ ticket.id }}
          </div>
        </div>
        <div class="download-box">
          <span class="screenshot">手机截图保存图片</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, TransferDom, XButton } from 'vux'
import { mixins } from 'mixins'
export default {
  name: 'MyActivity',
  mixins: [mixins],
  data () {
    return {
      tabIndex: 0,
      showTicket: false,
      ticket: {
        userName: '',
        time: '',
        address: '',
        id: ''
      },
      hasNoData: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    toggleTab (i) {
      this.tabIndex = i
      this.$nextTick(() => {
        this.$refs.activityScroll.scrollTo(0, 0, 0, 0)
      })
      this.pullDownRefreshData()
    },
    async getData () {
      if (!this.m_hasMore) return
      let url = 'activity/getMyLists'
      let obj = {
        page: ++this.m_page,
        is_record: this.tabIndex
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let data = res.data.data
          if (this.m_page === 1) {
            this.m_dataList = data
          } else {
            this.m_dataList = [...this.m_dataList, ...data]
          }
          this._checkMore(res.data)
        }
      })
    },
    showPayEntry (item) {
      return !this.tabIndex && !item.status_pay && item.status_activity.code !== 2 && item.status_activity.code !== 6
    },
    goTicket (id, mobile, name) {
      let url = 'activity/getMyTicket'
      let obj = {
        id,
        mobile,
        name
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { name, province, city, area, address, ticket, start_at } = res.data
          this.ticket.userName = name
          this.ticket.address = province + city + area + address
          this.ticket.id = 'NO:' + ticket
          this.showTicket = true
          this.ticket.time = this.ticketTimeFormate(start_at)
          /* eslint-enable */
        }
      })
    },
    viewActivityDetail (id) {
      this.$router.push({ path: '/unionDetail', query: { id } })
    },
    viewStatistics (id) {
      this.$router.push({ name: 'AllianceActivityStatistics', query: { id } })
    },
    goPay (id, mobile) {
      this.$router.push({ path: '/signupPay', query: { id, mobile } })
    },
    ticketTimeFormate (t) {
      let time = t.split(/[- :]/)
      let [year, month, day, hours = 0, minutes = 0] = time
      return `${year}年${month}月${day}日 ${hours}:${minutes}`
    }
  },
  filters: {
    formatTime (time) {
      return ' ' + time.substr(5, 5) + ' ' + time.substr(10, 6) + ' '
    }
  },
  directives: {
    TransferDom
  },
  watch: {
    'm_dataList' (val) {
      let activityLenght = val.length
      if (activityLenght) {
        this.hasNoData = false
        return
      }
      this.hasNoData = true
    }
  },
  components: {
    XDialog,
    XButton
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.my-activity-container
  height 100%
  overflow hidden
  flex-col()
  .my-activity-tab
    position relative
    height 100px
    padding-bottom 4px
    flex-f-align()
    &:after
      content ''
      position absolute
      width 50%
      height 4px
      left 0
      bottom 0
      background $color-orange
      transition all .5s
    &.active
      &:after
        left 50%
    .tab-item
      flex 1
      height 100%
      flex-center()
      f14()
      color #666
      &.active
        color $color-orange
  .my-activity-wrapper
    flex 1
    overflow hidden
    .scroll-container
      overflow hidden
      background #D6D6D6
      .no-more
        color #A1A1A1
    .activity-list
      padding 20px 30px
      .list-item
        background $color-white
        border-radius(16px)
        padding 30px 24px
        margin-bottom 20px
        &:last-child
          margin-bottom 0
        .item-status
          p
            margin-bottom 20px
            flex-f-align()
            span
              &.status-success
                color #3DA13E
              &.status-wait-pay
                color #E03541
            i
              width 28px
              height 30px
              margin-right 16px
              &.status-success
                bg('icon-success.png')
              &.status-wait-pay
                bg('icon-wait-pay.png')
        .activity-picture
          height 304px
          margin-bottom 20px
          position relative
          i
            position absolute
            width 116px
            height 52px
            left -8px
            top 20px
            z-index 10
            &.icon-end
              bg('icon-end.png')
            &.icon-down
              bg('icon-down.png')
          span
            position absolute
            wh(100%)
            border-radius(16px)
            background rgba(102, 102, 102, .6)
          img
            border-radius(16px)
            wh(100%)
        h1
          color $color-3
          f14()
          line-height 40px
          text-over(1)
        .item-time,
        .item-address
          color #999
          f12()
          line-height 34px
          flex-f-align()
          i
            wh(24px)
            margin-right 12px
            &.icon-time
              bg('icon-time.png')
            &.icon-address
              bg('icon-address.png')
        .activity-guide
          flex-s-btw()
          justify-content flex-end
          span
            height 40px
            padding 0 20px
            line-height 40px
            tc()
            color #fff
            f12()
            background-image linear-gradient(90deg, #FFBF00 0%, #FF8A00 100%)
            border-radius(100px)
    .no-data
      height 100%
      background #f5f5f5
      flex-center()
      flex-direction column
      img
        width 270px
        height 284px
      p
        color #999
        f14()
        margin-top 64px
        tc()
.ticket-box
  .weui-dialog
    max-width 750px
    overflow auto
    width 100%
    background transparent
    .ticket
      position relative
      bg('bg-ticket.png')
      width 583px
      height 769px
      margin auto
      .ticket-info
        text-align left
        padding 40px
        .ticket-title
          color #ffff00
          text-indent 20px
          fz(22px)
          margin-top: 36px
        .user-name
          text-align center
          padding 97px 0 125px 0
          fz(25px)
          color #fff
        .ticket-base
          margin-left 26px
          p
            f16()
            margin 20px 0
            color #fff
            fz(13px)
            .icon-clock
              width 30px
              vertical-align middle
              margin-right 20px
            .icon-address
              width 28px
              vertical-align top
              margin-right 20px
              display inline-block
            span
              display inline-block
              width 370px
              line-height 1.5
      .ticket-no
        color #ffff00
        fz(22px)
        position absolute
        bottom 100px
        left: 50%
        transform translateX(-50%)
    .download-box
      margin-top 50px
      .download
        bd(1px)
        color #ffffff
        background transparent
        padding 20px 30px
        border-radius(10px)
        fz(18px)
      .screenshot
        color #fff
        f14()
        &:after
          display block
          width 100px
          height 1px; /*no*/
          background #ccc
</style>
