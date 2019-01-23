<template>
  <div class="honey-details-container">
    <base-header>
      <div @click="showRegular">蜂蜜规则</div>
    </base-header>
    <base-scroll v-if="m_dataList.length && flag"
    :data="m_dataList"
    :pullup="m_pullup"
    :pulldown="m_pulldown"
    @scrollToEnd="getData"
    @pulldown="pullDownRefresh"
    :hasLoading="m_loading"
    :hasMore="m_hasMore"
    :hasRefresh="m_refresh"
    >
      <!-- 蜂蜜明细 -->
      <section class="honey-details-list" v-for="(value, index) in m_dataList" :key="index">
        <ul>
          <li>
            <div class="des-details">
              <div>{{value.credits_content}}</div>
              <div>{{value.created_title}}</div>
            </div>
          </li>
          <li class="color-red" v-if="value.credits_state == 2">+{{value.credits_value}}</li>
          <li class="color-orange" v-else>-{{value.credits_value}}</li>
        </ul>
      </section>
    </base-scroll>
    <section v-if="!m_dataList.length && flag">
      <div class="no-data">
        <img src="./images/icon-norecord.png" alt="">
        <p>暂无蜂蜜记录~</p>
      </div>
    </section>
    <base-senior-popup ref="regPopup" class="rule-popup" width="280px" height="500px">
      <img src="./images/icon-reg.png" alt="">
      <!-- <div class="help-close" @click="hideRegPopup"></div> -->
    </base-senior-popup>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseHeader from 'components/header/index'
import BaseScroll from 'components/scroll/scroll'
// import BaseFooter from 'components/footer/index'
import { mixins } from 'mixins'
export default {
  name: 'HoneyDeatails',
  mixins: [mixins],
  data () {
    return {
      flag: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let url = 'integral/history'
      let obj = {
        page: ++this.m_page
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.flag = true
        }
      })
      return Promise.resolve()
    },
    // 蜂蜜规则
    showRegular () {
      this.$router.push('/honey-details/honey-rule')
    },
    pullDownRefresh () {
      this.statusInit()
      this.flag = false
      this.getData().then(() => {
        this.m_refresh = false
      })
    }
  },
  components: {
    BaseHeader,
    BaseScroll
    // BaseFooter
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.honey-details-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .cgs-header-container
    background $color-white
  .scroll-container
    flex 1
    background #F4F4F4
    .honey-details-list
      height 166px
      bd-b(#F4F4F4, width = 1px)
      background $color-white
      ul
        height 166px
        flex-f()
        flex 1
        li:nth-child(1)
          flex 0.9
          align-items center
          .des-details
            line-height 42px
            div:nth-child(1)
              margin 40px 0 0 30PX
              font-size 30px
              color $color-3
              width 440px
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            div:nth-child(2)
              f12()
              color $color-9
              margin 0 0 0 30PX
        li:nth-child(2)
          flex 0.1
          margin-top 50px
          font-family PingFangSC-Regular
          font-size 26px
          &.color-red
            color #D0021B
          &.color-orange
            color #FF8A00
  .no-data
    color $color-9
    f16()
    tc()
    img
      display block
      width 288px
      height 308px
      margin: 2.666667rem auto
    p
      font-size 26px
      color #ccc
      margin-top -150px
  .senior-popup-wrapper
    overflow scroll
  .rule-popup
    >div
      position relative
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
