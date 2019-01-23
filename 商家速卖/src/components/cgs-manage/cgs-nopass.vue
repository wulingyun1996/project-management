<template>
  <div class="cgs-nopass-container">
    <base-header :title="title"></base-header>
    <base-scroll
      v-show="noPassFlag"
      :data="m_dataList"
      :pullup="m_pullup"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
      <div class="nopass-list" v-show="hasMoreData">
        <div
          class="nopass-item"
          v-for="item in m_dataList"
          :key="item.id"
          >
          <div class="item-top">
            <div class="item-avatar">
              <img :src="item.avatar" alt="" v-if="item.avatar">
              <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
            </div>
            <div class="item-detail">
              <h2 class="item-name" v-if="item.nickname">{{ item.nickname }}</h2>
              <h2 class="item-name" v-else-if="item.mobile">{{ item.mobile | sliceNumber }}</h2>
              <h2 class="item-name" v-else>{{ item.title }}</h2>
              <p class="item-time">申请时间：{{ item.created_at | sliceTime }}</p>
              <p class="item-time">审核时间：{{ item.audited_at | sliceTime }}</p>
            </div>
          </div>
          <div class="item-bottom">
            <p>
              <span class="nopass-title">未通过原因：</span>
              <span class="nopass-text">{{ item.reject_reason }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="nopass-no-data" v-show="!hasMoreData">
        <img src="./no_order.png" alt="">
        <p>暂无数据！</p>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import { mixins } from 'mixins'
export default {
  name: 'CgsNoPass',
  mixins: [mixins],
  data () {
    return {
      noPassFlag: false
    }
  },
  computed: {
    title () {
      let num = this.$route.query.nopass_buyer
      if (num) {
        return `未通过(${num})`
      }
      return `未通过`
    },
    hasMoreData () {
      return this.noPassFlag && !!this.m_dataList.length
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'purchaser/getPurchaserList'
      let obj = {
        page: ++this.m_page,
        audit_status: 3
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          if (res.data.total === 0) {
            this.m_hasMore = true
          }
          this.noPassFlag = true
        }
      })
    }
  },
  filters: {
    sliceNumber (str) {
      return str.substr(0, 3) + '****' + str.substr(7)
    },
    sliceTime (str) {
      return str.split(' ')[0]
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.cgs-nopass-container
  height 100%
  overflow hidden
  background #f4f4f4
  flex-col()
  .scroll-container
    flex 1
    overflow hidden
  .nopass-list
    .nopass-item
      width 100%
      background #fff
      margin-bottom 20px
      &.last-child
        border none
      .item-top
        height 170px
        flex-f-align()
        border-b()
        padding 0 30px
        .item-avatar
          wh(100px)
          border-radius(50%)
          margin-right 24px
          img
            wh(100%)
        .item-detail
          .item-name
            f14()
            color $color-3
            line-height 40px
            margin-bottom 8px
          .item-time
            f12()
            color $color-9
            line-height 40px
      .item-bottom
        padding 20px 30px
        flex-f-align()
        p
          f12()
          line-height 40px
          color #2A2A2A
          .nopass-title
            color $color-orange
  .nopass-no-data
    padding-top 152px
    >img
      width 270px
      height 284px
      display block
      margin 0 auto
    p
      color $color-9
      f14()
      margin-top 64px
      tc()
</style>
