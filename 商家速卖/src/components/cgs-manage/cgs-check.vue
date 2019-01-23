<template>
  <div class="cgs-check-container">
    <base-header :title="title"></base-header>
    <base-scroll
      v-show="checkFlag"
      :data="m_dataList"
      :pullup="m_pullup"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
      <div class="check-list" v-show="hasMoreData">
        <div
          class="nopass-item"
          v-for="(item, index) in m_dataList"
          :key="index"
          >
          <div class="item-avatar">
            <img :src="item.avatar" alt="" v-if="item.avatar">
            <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
          </div>
          <div class="item-detail">
            <h2 class="item-name" v-if="item.nickname">{{ item.nickname }}</h2>
            <h2 class="item-name" v-else-if="item.mobile">{{ item.mobile | sliceNumber }}</h2>
            <h2 class="item-name" v-else>{{ item.title }}</h2>
            <p class="item-time">申请时间：{{ item.created_at | sliceTime }}</p>
          </div>
          <div class="item-status">
            <span class="pass" @click="pass(item, index)">通过</span>
            <span class="nopass" @click="nopass(item, id)">不通过</span>
          </div>
        </div>
      </div>
      <div class="nopass-no-data" v-show="!hasMoreData">
        <img src="./no_order.png" alt="">
        <p>暂无数据！</p>
      </div>
    </base-scroll>
    <transition name="fade">
      <div class="reason-popup" v-show="showCheckPopup">
        <div class="reason-wrapper">
          <div class="close" @click="closeCheckPopup"></div>
          <div class="reason-title">
            请输入审核不通过的原因
          </div>
          <div class="reason-input">
            <textarea maxlength="40" v-model="noPassReason"></textarea>
            <span>{{ reasonLength }}/40</span>
          </div>
          <div class="reason-button" @click="submitReason">提交</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixins } from 'mixins'
export default {
  name: 'CgsCheck',
  mixins: [mixins],
  data () {
    return {
      checkNum: this.$route.query.audit_buyer,
      checkFlag: false,
      showCheckPopup: false,
      noPassReason: '',
      currentId: '',
      currentIndex: ''
    }
  },
  computed: {
    title () {
      let num = this.checkNum
      if (num) {
        return `待审核(${num})`
      }
      return `待审核`
    },
    hasMoreData () {
      return this.checkFlag && !!this.m_dataList.length
    },
    reasonLength () {
      return this.noPassReason.replace(/\n|\r/g, '  ').length
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
        audit_status: 1
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.checkFlag = true
        }
      })
    },
    closeCheckPopup () {
      this.showCheckPopup = false
      this.noPassReason = ''
    },
    pass (item, index) {
      let url = 'purchaser/updatePurchaserStatus'
      let obj = {
        id: item.id,
        audit_status: 2,
        identity_form: 2
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$t('审核已通过!')
          this.m_dataList.splice(index, 1)
          this.loadMoreData()
          return
        }
        this.$t(res.message)
      })
    },
    nopass (item, index) {
      this.showCheckPopup = true
      this.currentId = item.id
      this.currentIndex = index
    },
    submitReason () {
      let { currentId, currentIndex, noPassReason, m_dataList, loadMoreData } = this
      if (!noPassReason.trim()) {
        this.$t('请输入不通过原因')
        return
      }
      let url = 'purchaser/updatePurchaserStatus'
      let obj = {
        id: currentId,
        audit_status: 3,
        reject_reason: noPassReason,
        identity_form: 2
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.showCheckPopup = false
          this.noPassReason = ''
          m_dataList.splice(currentIndex, 1)
          loadMoreData()
          return
        }
        this.$t(res.message)
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
  },
  watch: {
    m_dataList (val) {
      let length = val.length
      this.checkNum = length
      if (length <= 0) {
        this.m_hasMore = true
      }
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.cgs-check-container
  height 100%
  overflow hidden
  background #fff
  flex-col()
  .scroll-container
    flex 1
    overflow hidden
  .check-list
    .nopass-item
      width 100%
      height 180px
      padding 0 30px
      border-b()
      flex-align-item()
      &.last-child
        border none
      .item-avatar
        wh(120px)
        border-radius(50%)
        img
          wh(100%)
      .item-detail
        //
        .item-name
          f14()
          color $color-3
          line-height 40px
          margin-bottom 15px
        .item-time
          f12()
          color $color-9
          line-height 34px
      .item-status
        f14()
        line-height 40px
        .pass
          color $color-orange
          margin-right 10px
        .nopass
          color #4A90E2
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
  .reason-popup
    pf(100%)
    left 0
    top 0
    background rgba(0, 0, 0, .5)
    opacity 1
    z-index 5
  .reason-wrapper
    z-index 6
    position fixed
    background #FFF
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 600px
    height 570px
    border-radius 20px
    opacity 1
    padding 58px 40px 46px
    .reason-title
      f14()
      color $color-3
      line-height 40px
    .reason-input
      height 294px
      margin-top 28px
      position relative
      textarea
        width 100%
        height 100%
        border 1px solid #ccc;/*no*/
        border-radius 2px;/*no*/
      span
        position absolute
        right 12px
        bottom 12px
        color #ccc
    .reason-button
      width 228px
      height 72px
      line-height 72px
      tc()
      margin 32px auto 0
      background $color-orange
      border-radius(8px)
      f14()
      color $color-white
    .close
      position absolute
      top 10px
      right 10px
      wh(22px)
      bg('icon-close2.png')
      padding 20px
      box-sizing content-box
      background-origin content-box
      background-clip content-box
// .fade-enter-active, .fade-leave-active
//   transition: opacity 1s
// .fade-enter, .fade-leave-to
//   opacity: 0
</style>
