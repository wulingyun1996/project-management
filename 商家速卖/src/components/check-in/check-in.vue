<template>
  <div class="accounting">
    <div class="detail-main">
      <div class="check-list" v-if="flag && !noCheckIn">
        <select-li :options="options" @change="changeSelect"></select-li>
        <div class="account-price">
          <div class="total-price">活动签到数：{{ panel.is_sign }}</div>
          <div class="deposit-price">报名人数：{{ panel.signup_total }}</div>
        </div>
        <!-- 有数据 -->
        <div class="main" v-show="!noDatas && loading">
          <scroll
            class="scroll-content"
            :data="checkLi"
            ref="scroll"
            :pullup="pullup"
            :scrolling='true'
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            >
            <div>
              <div class="liCss" v-for="item in checkLi">
                <div class="left-side">
                  <div class="date">{{item.time | timeFormat}} ({{totalObj[item.time]}})</div>
                  <div class="arr"></div>
                </div>
                <div class="check-box">
                  <div class="check-li" v-for="types in item.list">
                    <div class="left">
                      <p class="num">卡号：{{types.ticket}}</p>
                      <p class="name"><span>{{types.name}}</span></p>
                      <p class="name">{{types.mobile}}</p>
                      <p class="time"><span>报名方式：</span>{{types.type === 1 ? '线下' : '线上'}}</p>
                      <i></i>
                    </div>
                  </div>
                </div>
              </div>
              <loading v-show="hasMore" title=""></loading>
              <no-more v-show="!hasMore && checkLi.length" message="没有更多了"></no-more>
            </div>
          </scroll>
        </div>
        <!-- 无数据 -->
        <div class="no-data" v-show="noDatas">
          <img src="./no-data.png">
          <p class="tishi">暂无活动签到记录</p>
        </div>
      </div>
      <div class="no-check-in" v-if="flag && noCheckIn">
        <img src="./no-check-in.png" alt="">
        <p>暂无联盟活动签到信息</p>
      </div>
    </div>
    <foot-btn text="活动签到" v-if="flag && !noCheckIn" @footBtnClick="footBtnClick"></foot-btn>
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
    name: 'checkIn',
    data() {
      return {
        checkLi: [],
        checkList: {},
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
    created() {
      this.getActId()
    },
    computed: {
      noDatas () {
        if (this.noData === 1) {
          return true
        }
        return false
      },
      noCheckIn () {
        return !this.options.length && !this.checkLi.length
      }
    },
    filters: {
      timeFormat
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/home') {
          this.checkLi.splice(0)
          this.page = 1
          this.activeId = ''
          this.hasMore = true
          this.noData = true
          this.loading = false
          this.flag = false
          this.options.splice(0)
          this.panel = {}
          this.totalObj = {}
        }
        if (from.path === '/home') {
          this.getActId()
        }
        if (to.meta.title === '活动签到') {
          to.meta.hasDone = false
        }
        // 确保 add-check 页面签到成功
        if (from.meta.title === '活动签到' && from.meta.hasDone) {
          this.page = 1
          this.$refs.scroll.scrollTo(0, 0, 0)
          this.getRoute()
        }
        if (from.meta.title === '活动签到' && !from.meta.hasDone) {
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, this.$route.meta.y, 0)
        }
      }
    },
    methods: {
      // 活动活动名称和id
      async getActId() {
        let url = 'tally/getName'
        let obj = {
          type: 2
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
        let URL = 'tally/signInList'
        let obj = {
          page: 1,
          active_id: this.activeId,
          pageSize: perpage
        }
        this.hasMore = true
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.refresh = false
            this.loading = true
            this.noData = res.data.total === 0 ? 1 : 0
            if (res.data.total === 0) {
              this.hasMore = false
            }
            this.panel = res.data.data.panel
            this.checkLi = res.data.data.list
            this.totalObj = res.data.data.total
            this.flag = true
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        let URL = 'tally/signInList'
        let obj = {
          page: this.page,
          active_id: this.activeId,
          pageSize: perpage
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.checkLi.forEach((item1, i) => {
              let tempArr = this.checkLi.map((item) => {
                return item.time
              })
              res.data.data.list.forEach((item2, n) => {
                if (item1.time === item2.time) {
                  item1.list.push.apply(item1.list, item2.list)
                }
                if (tempArr.indexOf(item2.time) === -1) {
                  this.checkLi.push(res.data.data.list[n])
                }
              })
            })
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        const dataList = data
        if (!dataList.data.list.length || (dataList.current_page * perpage) > dataList.total) {
          this.hasMore = false
        }
      },
      footBtnClick() {
        this.$router.push(`/check-in/${this.activeId}`)
      },
      // 防止频繁发送请求
      changeSelect(item) {
        if (Object.is(item.id, this.activeId)) return
        this.page = 1
        this.getRoute(item)
      }
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

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.accounting
  width: 100%
  height: 100%
  &:after
    content: ''
    width: 100%
  .detail-main
    position: absolute
    top: 0;
    left: 0
    bottom: 92px;/*px*/
    right: 0
  .scroll-content
    height: 100%
    overflow: hidden
    // background: $color-white
  .account-price
    background #FF6C66
    color $color-white
    fz(13px)
    height 72px
    padding 0 40px
    margin 0 30px
    flex-align-item()
    border-radius(100px)
  .check-list
    height: 100%
    .main
      position: absolute
      width: 100%
      top: 210px;/*px*/
      bottom: 0
      padding 0 30px
      .liCss
        padding-top: 30px
      .left-side
        // width: 41%
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
          padding-right 10px;
          flex: 1
        .arr
          width: 25px;/*px*/
          height: 52px;/*px*/
          background: url('./arr.jpg') no-repeat right center
          background-size: 100% auto
      .check-box
        padding: 0 25px 0
        margin-top 52px
      .check-li
        &:last-child
          .left
            &:after
              display: none
        .left
          border-btm()
          padding: 25px 0
          i
            position absolute
            right 29px
            top 64%
            width 88px;/*px*/
            height 88px;/*px*/
            transform translateY(-50%)
            background url('qd.png') no-repeat center center
            background-size 88px 88px;/*px*/
        .num
          padding-left: 24px
          position: relative
          color: $color-orange
          font-size: 26px;/*px*/
          &:after
            content: ''
            width: 4px
            height: 24px
            background: $color-orange
            position absolute
            left: 0
            top 50%
            margin-top -12px
        .name
          font-size: 26px;/*px*/
          color: $color-6
          margin-top: 18px
        .time
          font-size: 24px;/*px*/
          color: $color-9
          margin-top: 18px
        p
          padding-left: 24px
          span
            display: inline-block
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            vertical-align: middle;
  .no-check-in
    margin 200px 0 0
    tc()
    img
      width 262px
      height 222px
      margin-bottom 40px
    p
      f14()
      color $color-9
  .no-data
      position: fixed
      width: 100%
      left: 0
      top: 210px;/*px*/
      right: 0
      bottom: 88px;/*px*/
      z-index: 200
      background: $color-f4
      img
        width: 45%
        display: block
        margin: 110px auto 0
      .tishi
        text-align: center
        font-size: 30px;/*px*/
        color: $color-9
        margin-top: 92px
</style>
