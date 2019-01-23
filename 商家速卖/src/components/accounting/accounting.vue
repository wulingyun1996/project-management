<template>
  <div class="account-container">
    <select-li :options="options" @change="changeSelect" v-show="hasSelectData"></select-li>
    <div class="account-wrapper" v-show="!hasNoData">
      <div class="account-price">
        <div class="total-price">销售总金额：￥{{ panel.sales }}</div>
        <div class="deposit-price">定金总金额：￥{{ panel.deposit }}</div>
      </div>
      <!-- 有数据 -->
      <scroll
        class="scroll-content"
        v-show="!noData && loading"
        :data="accountingLi"
        ref="scroll"
        :pullup="pullup"
        :beforeScroll="beforeScroll"
        @scrollToEnd="searchMore"
        >
        <div>
          <div class="liCss" v-for="item in accountingLi">
            <div class="left-side">
              <div class="date">{{item.time | timeFormat}} ({{totalObj[item.time]}})</div>
              <div class="arr"></div>
            </div>
            <div class="accounting-box">
              <div class="accounting-li" v-for="types in item.list">
                <div class="left">
                  <p class="num">卡号：{{types.card_number}}</p>
                  <p class="name">{{types.username}}<br />{{types.mobile}}</p>
                </div>
                <div class="right">
                  <h5>报名方式：{{types.type === 1 ? '线下' : '线上'}}</h5>
                  <p>销售金额：{{types.sales_amount}}<br />定金金额：{{types.deposit_amount}}</p>
                </div>
              </div>
            </div>
          </div>
          <loading v-show="hasMore" title=""></loading>
          <no-more v-show="!hasMore && accountingLi.length" message="没有更多了"></no-more>
        </div>
      </scroll>
      <!-- 无数据 -->
      <div class="account-no-data" v-show="hasListData">
        <img src="./images/no-data.png">
        <p>暂无活动销售记录</p>
      </div>
    </div>
    <!-- 缺省页 -->
    <div class="no-all-data" v-show="hasNoData">
      <img src="./images/no-data.png">
      <p>暂无活动销售记录</p>
    </div>
    <div class="circle-description" :class="{active: isPhoneX}" @click="showAccountPopup"></div>
      <!-- 介绍弹窗 -->
    <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
      <div class="icon-top"></div>
      <p>活动记账是针对某活动所产生交易的详细记录，记录参与活动的具体用户所产生的交易金额。</p>
      <div class="icon-bottom" @click="hideAccountPopup"></div>
    </base-senior-popup>
    <div class="add-account" @click="addAccount" v-show="isShowButton"></div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SelectLi from 'base/select/select-b'
  import NoMore from 'base/no-more/no-more'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import {timeFormat} from 'common/filters/index'
  import FootBtn from 'base/foot-btn/foot-btn'
  const perpage = 10
  export default {
    name: 'account',
    data () {
      return {
        accountingLi: [],
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        refresh: false,
        noData: true,
        loading: false,
        options: [],
        activeId: '',
        panel: {},
        totalObj: {},
        flag: false
      }
    },
    computed: {
      hasSelectData () {
        return !!this.options.length && this.flag
      },
      hasListData () {
        return !this.accountingLi.length && this.flag
      },
      isPhoneX () {
        return this.$isX
      },
      hasNoData () {
        return !this.accountingLi.length && !this.options.length && this.flag
      },
      isShowButton () {
        return (this.accountingLi.length || this.options.length) && this.flag
      }
    },
    created() {
      this.getActId()
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/home') {
          this.accountingLi.splice(0)
          this.page = 1
          this.activeId = ''
          this.hasMore = true
          this.noData = true
          this.loading = false
          this.options.splice(0)
          this.panel = {}
          this.totalObj = {}
        }
        if (from.path === '/home') {
          this.getActId()
        }
        if (to.meta.title === '活动记账') {
          to.meta.hasDone = false
        }
        // 确保 add-account 页面添加信息成功
        if (from.meta.title === '活动记账' && from.meta.hasDone) {
          this.page = 1
          this.$refs.scroll.scrollTo(0, 0, 0)
          this.getRoute()
        }
      }
    },
    methods: {
      showAccountPopup () {
        this.$refs.alliancePopup.show()
      },
      hideAccountPopup () {
        this.$refs.alliancePopup.hide()
      },
      // 活动活动名称和id
      async getActId () {
        let url = 'tally/getName'
        let obj = {
          type: 1
        }
        await new Promise(resolve => {
          loadDataPost(url, obj).then((res) => {
            if (res.code === STATUS_OK) {
              if (res.data.length) {
                this.options = res.data
                this.activeId = this.options[0].id
              } else {
                this.flag = true
              }
            }
            resolve()
          })
        })
        this.getRoute()
      },
      getRoute (id) {
        if (!id) {
          this.activeId = this.activeId
        } else {
          this.activeId = id.id
        }
        let URL = 'tally/listTally'
        let obj = {
          page: 1,
          active_id: this.activeId
        }
        this.hasMore = true
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.refresh = false
            this.loading = true
            this.noData = res.data.total === 0 ? 1 : 0
            if (res.data.list === 0) {
              this.hasMore = false
              return false
            }
            this.panel = res.data.data.panel
            this.accountingLi = res.data.data.list
            this.totalObj = res.data.data.total
            this.flag = true
            this._checkMore(res.data)
          }
        })
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        let URL = 'tally/listTally'
        let obj = {
          page: this.page,
          active_id: this.activeId,
          pageSize: perpage
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.accountingLi.forEach((item1, i) => {
              let tempArr = this.accountingLi.map((item) => {
                return item.time
              })
              res.data.data.list.forEach((item2, n) => {
                if (item1.time === item2.time) {
                  item1.list.push.apply(item1.list, item2.list)
                }
                if (tempArr.indexOf(item2.time) === -1) {
                  this.accountingLi.push(res.data.data.list[n])
                }
              })
            })
            this._checkMore(res.data)
          }
        })
      },
      _checkMore (data) {
        const dataList = data
        if (!dataList.data.list.length || (dataList.current_page * perpage) > dataList.total) {
          this.hasMore = false
        }
      },
      addAccount () {
        console.log(`/accounting/${this.activeId}`)
        this.$router.push(`/accounting/${this.activeId}`)
      },
      changeSelect (item) {
        if (Object.is(item.id, this.activeId)) return
        this.page = 1
        this.getRoute(item)
      }
    },
    filters: {
      timeFormat
    },
    components: {
      NoMore,
      Scroll,
      SelectLi,
      Loading,
      FootBtn
    }
  }
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.account-container
  height 100%
  flex-col()
  .account-wrapper
    flex-col()
    flex 1
    padding 0 30px
    padding-bottom 140px
    .account-price
      background #FF6C66
      color $color-white
      fz(13px)
      height 72px
      padding 0 40px
      flex-align-item()
      border-radius(100px)
      //
    .scroll-content
      flex 1
      overflow: hidden
      // background: $color-white
      .liCss
        padding-top: 30px
      .left-side
        // width: 40%
        line-height: 52px;/*px*/
        font-size: 26px;/*px*/
        color: $color-white
        overflow: hidden
        display: flex
        background: #ff9a00
        float left
        .date
          background: url('./date.png') no-repeat 25px center
          background-size: 32px 32px;/*px*/
          padding-left: 72px
          padding-right: 10px
          flex: 1
          white-space nowrap
        .arr
          width: 25px;/*px*/
          height: 52px;/*px*/
          background: url('./arr.jpg') no-repeat right center
          background-size: 100% auto
      .accounting-box
        margin-top 52px;/*px*/
        padding: 35px 25px 0
      .accounting-li
        display: flex
        height: 220px;/*px*/
        background: #ffa722 url('./li-bg.png') no-repeat right top
        background-size: auto 100%
        border-radius: 10px
        padding: 18px 0 0 24px
        margin-bottom: 25px
        &:last-child
          margin-bottom 0
        .left
          width: 42%
          .num
            font-size: 24px;/*px*/
            color: #ffe1b4
          .name
            font-size: 28px;/*px*/
            color: $color-white
            margin-top: 32px
            line-height: 1.3
        .right
          font-size: 24px;/*px*/
          padding-top: 32px
          flex: 1
          h5
            color: $color-white
            padding-bottom: 16px
            border-btm()
            &:after
              content: ''
              width: 146%
              background: #cc6633
          p
            color: #ac5a31
            line-height: 1.5
            margin-top: 1%
  .account-no-data
    tc()
    color $color-c
    img
      width 318px
      height 228px
      margin 164px auto 0
    p
      f12()
      margin-top 40px
  .no-all-data
    tc()
    color $color-c
    img
      width 318px
      height 228px
      margin 340px auto 0
    p
      f12()
      margin-top 40px
  .circle-description
      width 208px
      height 116px
      position fixed
      right 0
      bottom 76px
      bg('icon-account.png')
      &.active
        bottom 110px
    .alliance-popup
      >div
        width 560px!important
        padding 128px 52px 112px
        border-radius(24px)
        overflow unset
        position relative
        background url('./images/bg-account.png') no-repeat center bottom #fff
        background-size 100% auto
        p
          f14()
          color $color-3
          line-height 44px
          &:nth-child(1)
            margin-bottom 5px
        .icon-top,
        .icon-bottom
          position absolute
          left 50%
          transform translateX(-50%)
        .icon-top
          top -85px
          width 310px
          height 170px
          bg('icon-top.png')
        .icon-bottom
          wh(56px)
          bottom -132px
          padding 20px
          bg('icon-close.png')
          box-sizing content-box
          background-origin content-box
          background-clip content-box
  .add-account
    position fixed
    left 50%
    transform translateX(-50%)
    bottom 50px
    wh(168px)
    border-radius(50%)
    bg('icon-button.png')
</style>
