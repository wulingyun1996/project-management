<template>
  <div class="buy-content">
    <div class="buy-guide" v-show="showGuide" @click="viewBuyHelp">
      <div class="buy-guide-left">
        <span class="left-icon"></span>
        <span>什么是买卖速配？</span>
      </div>
      <div class="buy-guide-right">
        <span class="right-icon" @click.stop="closeHelpGuide"></span>
      </div>
    </div>
    <div class="buy-top">
      <tab :line-width="4" active-color='orange' bar-active-color="orange" :custom-bar-width="tabBarWidth" v-model="index">
        <tab-item @on-item-click="handler(index)" :selected="currentIndex === 0">系统匹配
          <span v-show="sysNum>0">{{sysNum > 99 ? 'n' : sysNum}}</span>
        </tab-item>
        <tab-item @on-item-click="handler(index)" :selected="currentIndex === 1">最新求购
          <span v-show="newNum>0">{{newNum > 99 ? 'n' : newNum}}</span>
        </tab-item>
      </tab>
    </div>
    <!-- 系统匹配 -->
    <scroll ref="scroll"
            class="main-content"
            :data="wantBuy"
            v-if="currentIndex===0"
            :pullup="pullup"
            :pulldown="pulldown"
            :beforeScroll="beforeScroll"
            @pulldown="pulldownRefresh"
            @scrollToEnd="searchMore(0)"
            @beforeScroll="listScroll">
      <div class="buy-main">
        <!-- 有数据-->
        <div>
          <Loading :class="refresh ? 'show' : 'hide'"></Loading>
          <div v-show="!noData && loading">
            <buy :wantBuy="wantBuy" @freshData="freshData(currentIndex)" :show="true" track-by="$index"></buy>
            <loading v-show="hasMore" title=""></loading>
            <no-more v-show="!hasMore && wantBuy.length" message="这个商家好勤快，没有更多啦"></no-more>
          </div>
        </div>
        <!--无数据-->
        <div class="no-data no-system" v-show="flag && !wantBuy.length">
          <div class="system-in">
            <img src="./nosystem.png">
            <p>您目前没有速配信息 可能原因为：</p>
            <ul>
              <li>◆ 店铺信息资料不够完善<router-link to="/set-shop" tag="a" href="javascript:;" class="btn">马上完善店铺</router-link></li>
              <li>◆ 近期没有发布商品信息!<router-link to="/creat-goods" tag="a" href="javascript:;" class="btn">马上发布商品</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </scroll>
    <!-- 最新求购 -->
    <scroll ref="scroll"
            class="main-content"
            :data="wantNew"
            v-else
            :pullup="pullup"
            :pulldown="pulldown"
            :beforeScroll="beforeScroll"
            @pulldown="pulldownRefreshTwo"
            @scrollToEnd="searchMore(1)"
            @beforeScroll="listScroll">
      <div class="buy-main">
        <!-- 有数据-->
        <div>
          <Loading :class="refresh ? 'show' : 'hide'"></Loading>
          <div v-show="!noData && loading">
            <buy :wantBuy="wantNew" @freshData="freshData(currentIndex)" :show="true"></buy>
            <loading v-show="hasMore" title=""></loading>
            <no-more v-show="!hasMore && wantNew.length" message="没有更多了"></no-more>
          </div>
        </div>
        <!--无数据-->
        <div class="no-data no-new" v-show="isShowWantNew">
          <img src="./no-city-buy.png" />
          <p>您服务的城市暂无求购信息~</p>
        </div>
      </div>
    </scroll>
    <system ref="system"></system>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { nativeBackBase, navBack } from 'api/init'
import Loading from 'base/loading/loading'
import Buy from 'base/buy/buy'
import NoMore from 'base/no-more/no-more'
import System from 'base/confirm/system'
import { Tab, TabItem } from 'vux'
import { loadDataPost, STATUS_OK } from 'api/common'
const perpage = 10
export default {
  name: 'wangToBuy',
  data() {
    return {
      index: 0,
      orange: '$color-orange',
      wantBuy: [],
      wantNew: [],
      currentIndex: 0,
      sysNum: 0,
      newNum: 0,
      page: 1,
      pullup: true,
      pulldown: true,
      beforeScroll: true,
      hasMore: true,
      firstEnter: 0,
      refresh: false,
      loading: false,
      noData: false,
      isPulldownRefresh: false,
      flag: false,
      showGuide: true
    }
  },
  created() {
    window.myBuy = this.myBuy
    window.nav_back = this.nav_back
    this.nav()
    this.getRoute()
  },
  watch: {
    '$route' (to, from) {
      let location = this.$route.path
      if (location === '/want-to-buy') {
        this.nav()
        this.changeItem()
      }
      if (to.path === '/home') {
        this.index = 0
        this.currentIndex = 0
        this.page = 1
        this.hasMore = true
        this.flag = false
        this.wantBuy.splice(0)
        this.wantNew.splice(0)
      }
      if (from.path === '/home') {
        window.myBuy = this.myBuy
        window.nav_back = this.nav_back
        this.nav()
        this.getRoute()
      }
    }
  },
  computed: {
    ...mapGetters(['modIndex']),
    isShowWantNew () {
      return this.flag && this.wantNew.length === 0
    },
    tabBarWidth () {
      let standardWidth = (this.$dpr / 2).toFixed(2) * 120
      return `${standardWidth}px`
    }
  },
  methods: {
    viewBuyHelp () {
      this.$router.push('/want-to-buy/buy-help')
    },
    closeHelpGuide () {
      this.showGuide = false
    },
    changeItem() {
      let changeValue = window.sessionStorage.getItem('changeItem')
      if (changeValue) {
        if (this.currentIndex === 0) {
          this.$set(this.wantBuy, this.modIndex, JSON.parse(changeValue))
        } else {
          this.$set(this.wantNew, this.modIndex, JSON.parse(changeValue))
        }
        window.sessionStorage.removeItem('changeItem')
      } else {
        return false
      }
    },
    myBuy() {
      this.$router.push('/my-buy')
    },
    nav_back() {
      navBack()
    },
    nav() {
      let param = {
        'left': [{
          'title': 'back',
          'function': 'nav_back()' // 默认
        }],
        'right': [{
          'title': '我关注的',
          'function': 'myBuy()'
        }]
      }
      nativeBackBase(param)
    },
    pulldownRefresh() {
      this.page = 1
      this.hasMore = true
      this.isPulldownRefresh = true
      this.refresh = true
      this.flag = false
      setTimeout(() => {
        this.wantBuy.splice(0)
        this.getRoute().then(() => {
          this.refresh = false
        })
      }, 2000)
    },
    pulldownRefreshTwo() {
      this.page = 1
      this.hasMore = true
      this.isPulldownRefresh = true
      this.refresh = true
      this.flag = false
      setTimeout(() => {
        this.wantNew.splice(0)
        this.getProject().then(() => {
          this.refresh = false
        })
      }, 2000)
    },
    getRoute() {
      let URL = 'sale/systemMatching'
      let obj = {
        page: 1
      }
      loadDataPost(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.wantBuy = res.data.data.data
          this.sysNum = res.data.sys_num
          this.newNum = res.data.new_num
          this.firstEnter = res.data.if_first_enter
          if (this.firstEnter === 1) {
            this.$refs.system.show()
            this.$set(res.data, 'if_first_enter', 0)
          }
          this.noData = this.wantBuy.length === 0 ? 1 : 0
          this.flag = true
          this.loading = true
          this._checkMore(res.data.data)
        }
      })
      return Promise.resolve()
    },
    getProject() {
      let URL = 'sale/latestPurchase'
      let obj = {
        page: 1
      }
      loadDataPost(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.wantNew = res.data.data.data
          this.noData = this.wantNew.length === 0 ? 1 : 0
          this.flag = true
          this.loading = true
        }
        this._checkMore(res.data.data)
      })
      return Promise.resolve()
    },
    searchMore(index) {
      if (!this.hasMore) return
      this.page++
      if (index === 0) {
        let URL = 'sale/systemMatching'
        let obj = {
          page: this.page
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.wantBuy = this.wantBuy.concat(res.data.data.data)
            this._checkMore(res.data.data)
          }
        })
        return Promise.resolve()
      } else {
        let URL = 'sale/latestPurchase'
        let obj = {
          page: this.page
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.wantNew = this.wantNew.concat(res.data.data.data)
          }
          this._checkMore(res.data.data)
        })
        return Promise.resolve()
      }
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) >= dataList.total) {
        this.hasMore = false
      }
    },
    listScroll() {
      this.$emit('listScroll')
    },
    handler(index) {
      if (this.currentIndex === index) return
      this.currentIndex = index
      this.wantBuy.splice(0)
      this.wantNew.splice(0)
      this.page = 1
      this.hasMore = true
      this.$refs.scroll.scrollTo(0, 300)
      this.flag = false
      if (index === 0) {
        this.getRoute()
      } else {
        this.getProject()
      }
    },
    freshData(index) {
      this.flag = false
      if (index === 0) {
        this.getRoute()
      } else {
        this.getProject()
      }
    }
  },
  components: {
    Scroll,
    Loading,
    Buy,
    NoMore,
    Tab,
    TabItem,
    System
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/mixin"
@import "~common/stylus/variable"
.buy-content
  height 100%
  flex-col()
  .buy-guide
    height 72px
    background #FF9641
    flex-s-btw()
    fz(13px)
    color #fff
    padding 0 30px
    >div
      flex-f-align()
      .left-icon
        width 32px
        height 38px
        margin-top 2px
        margin-right 10px
        bg('icon-ask.png')
      .right-icon
        wh(36px)
        margin-right -20px
        bg('icon-close.png')
        box-sizing content-box
        padding 20px
        background-origin content-box
        background-clip content-box
  .main-content
    height: 100%
    overflow: hidden
    flex 1
    .no-data
      text-align: center
      color: $color-9
      font-size: 32px;/*px*/
    .no-system
      width: 100%
      padding: 116px 0 0
      text-align: left
      .system-in
        text-align: center
        img
          display: block
          margin: 0 auto
          width: 60%
      p
        margin-top: 116px
      ul
        margin-top: 92px
      li
        margin-bottom: 46px
        color: $color-9
        .btn
          text-decoration: underline
          color: $color-orange
          display: inline-block
          margin-left: 10px
    .no-new
      width: 100%
      padding: 200px 0 0
      img
        width: 41.6%
        margin: 0 auto
        display: block
      p
        margin-top: 48px
.buy-top
  height: 92px;/*px*/
  background: $color-white
  .vux-tab
    span
      color: $color-white
      background: url('circle.png') no-repeat center center
      background-size: 100% auto
      position: absolute
      width: 38px;/*px*/
      line-height: 24px;/*px*/
      top: 8px
      font-size: 20px;/*px*/
      margin-left: 6px
      display: inline-table
      text-align: center
      vertical-align: middle
</style>
