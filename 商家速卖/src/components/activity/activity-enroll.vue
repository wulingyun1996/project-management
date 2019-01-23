<template>
  <div class="enroll-activity-container">
    <base-scroll
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh"
      >
      <div class="enroll-activity-item" v-for="item in m_dataList">
        <p>卡号：<span class="card-number">{{ item.ticket }}</span></p>
        <p>姓名：{{ item.name }}（{{ item.mobile }}）</p>
        <p>推荐来源：{{ item.salesman_name }}<span v-show="item.salesman_name !== '平台'">（{{ item.shop_name }}）</span></p>
        <p>报名时间：{{ item.created_at }}</p>
        <div class="seperate"></div>
      </div>
      <div class="no-data" v-show="hasData">
        <img src="./images/no-data.png" alt="">
        <p>哎呀~还没有数据哦~</p>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from 'base/scroll/senior-scroll'
import { mixins } from 'mixins'
import { setTitle } from 'navtive'
export default {
  mixins: [mixins],
  data () {
    return {
      hasData: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let url = 'analytics/getSellerPayDetail'
      let obj = {
        page: ++this.m_page
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let total = res.data.total || 0
          if (this.m_page === 1) {
            setTitle(`活动支付数（${total}）`)
          }
          res.data.data.forEach(item => {
            item.mobile = item.mobile.replace(item.mobile.substring(3, 7), '****')
            item.created_at = item.created_at.replace(/-/g, '.').substring(0, 10)
          })
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          if (!this.m_dataList.length) {
            this.hasData = true
            this.m_hasMore = true
          }
        }
      })
      return Promise.resolve()
    }
  },
  components: {
    BaseScroll
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.enroll-activity-container
  background #fff
  height 100%
  flex-col()
  f14()
  color #4a4a4a
  .enroll-activity-item
    padding-top 30px
    padding-left 74px
    p
      line-height 52px
    .card-number
      color $color-orange
  .seperate
    height 10px
    margin-left -74px
    margin-top 15px
    background $color-body
  .no-data
    color $color-9
    f16()
    tc()
    img
      margin-top 200px
      margin-bottom 50px
</style>
