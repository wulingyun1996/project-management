<template>
  <div class="honey-detail-container">
    <base-header>
      <div class="special-authen-help" @click="getShow">蜂蜜规则</div>
    </base-header>
    <div class="scorll">
      <base-scroll
      message="没有更多了~"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh"
      :before-scroll="true"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      @beforeScroll="beforeScroll">
        <div class="honey-detail-item" v-for="item in m_dataList" :key="item.id">
          <div class="honey-detail-left">
            <!-- <p class="info">
              <span>{{item.credits_content.slice(0, 6)}}</span>
              <span>{{item.credits_content.slice(7)}}</span>
            </p> -->
            <div class="info">
              <p>{{ item.credits_content_header }}</p>
              <p v-show="item.credits_content_body !== ''">—</p>
              <p>{{ item.credits_content_body }}</p>
              <p>{{ item.credits_content_foot }}</p>
            </div>
            <P class="time">
              <!-- <span>今天</span> -->
              <span>{{item.time}}</span>
            </P>
          </div>
          <div class="honey-detail-right">
            <p :class="{'active': item.number.slice(0, 1) !== '-'}">{{ item.number }}</p>
            <p :class="{'active': item.number.slice(0, 1) !== '-'}" v-show="item.show_status === 1">{{ item.history_status_name }}</p>
          </div>
        </div>
        <div class="no-data" v-show="hasData">
          <img src="./images/kong.png" alt="">
          <p>暂无蜂蜜记录~</p>
        </div>
        <div ref="placeholder"></div>
      </base-scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import BaseScroll from 'base/scroll/senior-scroll'
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      hasData: false,
      isBeforeScroll: true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let url = 'history/historyList'
      let obj = {
        page: ++this.m_page
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          // this.m_dataList = []
          this._checkMore(res.data)
          if (!this.m_dataList.length) {
            this.hasData = true
            this.m_hasMore = true
          }
        }
      })
    },
    getShow () {
      this.$router.push('/honey-detail/honey-rule')
    },
    hideHelpPopup () {
      this.$refs.rulePopup.hide()
    },
    beforeScroll () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    }
  },
  components: {
    BaseScroll
  }
}
</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.honey-detail-container
  width 100%
  height 100%
  overflow hidden
  .special-authen-help
    font-size: 28px
    color: #4A90E2
  .scorll
    width 100%
    height 94%
  .honey-detail-item
    width 100%
    height 166px
    padding 20px 5px 20px 20px
    overflow hidden
    .honey-detail-left
      float left
      .info
        margin-top 20px
        display flex
        align-items center
        p:first-child
          color $color-3
          font-size: 30px
        p:nth-child(3)
          font-size 26px
          color $color-6
          overflow: hidden
          // width 340px
          max-width 340px
          line-height 40px
          text-overflow:ellipsis
          white-space: nowrap
          letter-spacing: -0.36px
      .time
        margin-top 20px
        span:first-child
          font-size 24px
          color $color-9
        span:last-child
          font-size 24px
          color $color-9
    .honey-detail-right
      float right
      text-align center
      width 150px
      p
        margin-top 22px
        font-size 24px
        color #FF8A00
        text-align center
        line-height 35px
      p:last-child
        margin-top 10px
      .active
        color: #D0021B
  .no-data
    color $color-9
    f16()
    tc()
    img
      width 300px!important
      height 300px!important
      margin-top 200px
      margin-bottom 50px
  .rule-popup
    >div
      position relative
      width 500px!important
      img
        width 100%
        height 100%
        display block
      .help-close
        position absolute
        wh(60px)
        left 50%
        transform translateX(-50%)
        bottom -80px
        border-radius(50%)
        bg('icon-close.png')
</style>
