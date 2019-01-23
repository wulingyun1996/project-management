<template>
  <div class="cgs-pass-container">
    <base-header :title="title" class="passed-header">
      <div class="drop-down" @click="showDropDown">
        <h3 class="drop-down-title">
          <span v-show="!isShowTitle">全部身份</span>
          <span v-show="isShowTitle">{{ identityName | sliceChar(2) }}</span>
        </h3>
        <span class="drop-down-search"></span>
      </div>
    </base-header>
    <div
      class="cgs-pass-tab"
      :class="{ active: currentTabIndex === 1 }"
      >
      <div
        class="tab-item"
        :class="{ active: currentTabIndex === index }"
        v-for="(tabItem, index) in tabItems"
        :key="index"
        @click="toggleTab(index)"
        >
        {{ tabItem.name }}
      </div>
    </div>
    <base-scroll
      v-show="passedFlag"
      :data="m_dataList"
      :pullup="m_pullup"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
      <div class="passed-list" v-show="hasMoreData">
        <div
          class="passed-item"
          v-for="item in m_dataList"
          :key="item.id"
          >
          <div class="passed-avatar">
            <img :src="item.avatar" alt="" v-if="item.avatar">
            <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
          </div>
          <div class="passed-detail">
            <h2 class="passed-name" v-if="item.nickname">{{ item.nickname }}</h2>
            <h2 class="passed-name" v-else-if="item.mobile">{{ item.mobile | sliceNumber }}</h2>
            <h2 class="passed-name" v-else>{{ item.title }}</h2>
            <p class="apply-time">申请时间：{{ item.created_at | sliceTime }}</p>
            <p class="audit-time">审核时间：{{ item.audited_at | sliceTime }}</p>
          </div>
        </div>
      </div>
      <div class="nopass-no-data" v-show="!hasMoreData">
        <img src="./no_order.png" alt="">
        <p>暂无数据！</p>
      </div>
    </base-scroll>
    <div class="drop-down-wrapper" v-show="isShowDropDown">
      <div
        class="select-item"
        v-for="(identityItem, index) in identity"
        :key="identityItem.id"
        @click="selectIdentity(identityItem.name, identityItem.id, index)"
        >
        <h2>{{ identityItem.name }}</h2>
        <span v-show="identityIndex === index"></span>
      </div>
    </div>
  </div>
</template>

<script>
import identity from 'data/identity'
import { mixins } from 'mixins'
import { sliceChar } from 'commons'
export default {
  name: 'CgsPassed',
  mixins: [mixins],
  data () {
    /* eslint-disable */
    // let { check_buyer, scan_buyer } = this.$route.query
    // let num = check_buyer + scan_buyer
    return {
      passedByAudit: '',
      passedByScan: '',
      /* eslint-enable */
      currentTabIndex: 0,
      passedNum: '',
      isShowDropDown: false,
      isShowTitle: false,
      identity,
      identityIndex: 0,
      identityName: '',
      identityId: 'all',
      passedFlag: false
    }
  },
  computed: {
    title () {
      let num = this.passedNum
      if (num) {
        return `已通过(${num})`
      }
      return `已通过`
    },
    tabItems () {
      return [
        { name: `审核认证(${this.passedByAudit})` },
        { name: `扫码认证(${this.passedByScan})` }
      ]
    },
    hasMoreData () {
      return this.passedFlag && !!this.m_dataList.length
    }
  },
  created () {
    this.getData()
  },
  methods: {
    showDropDown () {
      this.isShowDropDown = !this.isShowDropDown
    },
    selectIdentity (name, id, index) {
      this.identityName = name
      this.identityIndex = index
      this.identityId = id
      this.isShowDropDown = false
      this.statusInit()
      this.getData()
    },
    toggleTab (index) {
      this.currentTabIndex = index
      this.isShowDropDown = false
      this.statusInit()
      this.getData()
    },
    async getData () {
      if (!this.m_hasMore) return
      let url = 'purchaser/getPurchaserList'
      let obj = {
        page: ++this.m_page,
        audit_status: 2,
        identity_form: this.currentTabIndex === 0 ? 2 : 1,
        procure_identity: this.identityId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.passedNum = res.data.all_total
          if (this.currentTabIndex === 0) {
            this.passedByAudit = res.data.total
            this.passedByScan = res.data.search_total - res.data.total
          } else {
            this.passedByScan = res.data.total
            this.passedByAudit = res.data.search_total - res.data.total
          }
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.passedFlag = true
        }
      })
    }
  },
  filters: {
    sliceChar,
    sliceNumber (str) {
      return str.substr(0, 3) + '****' + str.substr(7)
    },
    sliceTime (str) {
      return str.split(' ')[0]
    }
  },
  watch: {
    identityIndex () {
      this.isShowTitle = true
    },
    m_dataList (val) {
      let length = val.length
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
.cgs-pass-container
  position relative
  height 100%
  overflow hidden
  background #fff
  flex-col()
  .passed-header
    .drop-down
      width 200px
      height 56px
      padding 0 20px
      bd(#ccc)
      border-radius(100px)
      flex-align-item()
      .drop-down-title
        margin-top 3px
        f12()
        color $color-c
      .drop-down-search
        position relative
        left 10px
        box-sizing content-box
        wh(30px)
        bg('icon-search.png')
        padding 10px
        padding-left 0
        background-origin content-box
        background-clip content-box
  .cgs-pass-tab
    height 100px
    flex-f-align()
    // bd-b(#D8D8D8, 4px)
    border-bottom 4px solid #D8D8D8
    position relative
    &.active
      &:after
        transform translateX(100%)
    &:after
      content ''
      position absolute
      left 0
      bottom -4px
      width 50%
      height 4px
      background $color-orange
      transition transform .5s
    .tab-item
      flex 1
      flex-center()
      f16()
      height 100%
      color #000
      &.active
        color $color-orange
  .scroll-container
    flex 1
    overflow hidden
    position relative
  .passed-list
    .passed-item
      height 180px
      padding 0 30px
      border-b()
      flex-f-align()
      .passed-avatar
        wh(120px)
        margin-right 20px
        border-radius(50%)
        img
          wh(100%)
      .passed-detail
        .passed-name
          f14()
          color $color-3
          line-height 40px
          margin-bottom 15px
        p
          f12()
          color $color-9
          line-height 34px
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
  .drop-down-wrapper
    position absolute
    width 100%
    left 0
    top 188px
    background #fff
    .select-item
      height 90px
      flex-align-item()
      padding-left 100px
      padding-right 60px
      bd-b(#F2F2F2)
      h2
        color $color-3
        f14()
        line-height 40px
      span
        wh(36px)
        bg('icon-checked.png')
</style>
