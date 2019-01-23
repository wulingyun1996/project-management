<template>
  <div class="manager-container">
    <base-header>
    </base-header>
    <div class="manager-management" :class="{active: !hasNoData && flag}" v-show="flag">
      <div class="detail-main" v-show="hasNoData && flag">
        <scroll
        class="scroll-content"
        :data="managerLi"
        ref="scroll"
        :pullup="pullup"
        :beforeScroll="beforeScroll"
        @scrollToEnd="searchMore"
        @beforeScroll="listScroll">
          <div>
            <div class="manager-list" v-show="loading">
              <div v-show="!noData">
                <swipeout v-for="(item, index) in managerLi" :key="index">
                  <swipeout-item>
                    <div slot="right-menu">
                      <swipeout-button :width="buttonWidth" @click.native="onButtonClick(index, item.id)" type="warn">删除</swipeout-button>
                    </div>
                    <div slot="content" class="manager-box">
                      <div class="manager-li">
                        <div class="left">
                          <h5>
                            {{item.salesman_name}}
                            <span v-show="item.check === 1">特约采购师</span>
                            <span v-show="item.check === 2">平台采购师</span>
                            <span v-show="item.check === 3">未注册用户</span>
                          </h5>
                          <p>{{item.salesman_mobile}}</p>
                        </div>
                        <div class="right">
                          <span @click="goStatistics(item.id,item.salesman_name,item.salesman_mobile)">推广统计</span>
                        </div>
                        <!-- <router-link :to="`/sales-statistic?salesmanid=${item.id}&shopid=${distributor}`" @click.native="setAct" tag="div" class="right">推广统计</router-link> -->
                      </div>
                    </div>
                  </swipeout-item>
                </swipeout>
              </div>
              <!-- <div class="manager-liTwo">
                <div class="left">采购师平台</div>
                <router-link to="/platform-statistic" tag="div" class="right">推广统计</router-link>
              </div> -->
              <loading v-show="hasMore" title=""></loading>
              <no-more v-show="!hasMore && managerLi.length" message="没有更多了"></no-more>
            </div>
          </div>
        </scroll>
      </div>
      <div class="no-data" :class="{active: isIphoneX}" v-show="!hasNoData && flag">
        <img src="./images/icon-price.png" alt="">
        <h1>欢迎使用推广员管理</h1>
        <ul>
          <li>
            <span></span>
            <span>自主添加及管理推广员</span>
          </li>
          <li>
            <span></span>
            <span>按活动统计推广数据</span>
          </li>
          <li>
            <span></span>
            <span>推广员业绩随时查看</span>
          </li>
        </ul>
        <router-link tag="div" to="/add-manager" class="no-data-add"></router-link>
      </div>
      <confirm ref="popSure" @confirm="goSure" @cancel="cancelSure" text="删除后，该推广员推广数据将会一起删除，您确认删除该推广员信息吗？" confirmBtnText="确定"></confirm>
      <router-link tag="div" to="/add-manager" class="add" v-show="hasNoData && flag"></router-link>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  import { Swipeout, SwipeoutItem, SwipeoutButton, XDialog } from 'vux'
  // import {nativeBackBase, navBack} from 'api/init'
  import { getIPhoneType } from 'commons'
  import Confirm from 'base/confirm/confirm'
  const perpage = 10
  export default {
    name: 'managerManagement',
    data() {
      return {
        managerLi: [],
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        refresh: false,
        noData: true,
        loading: false,
        deleteIndex: -1,
        deleteId: -1,
        indexN: 180,
        distributor: '',
        flag: false
      }
    },
    computed: {
      hasNoData () {
        return this.managerLi.length
      },
      isIphoneX () {
        return this.$isX
      },
      buttonWidth () {
        let dev = getIPhoneType()
        if (dev === 'iPone6Plus') {
          return 180
        }
        if (dev === 'iPoneX') {
          return 160
        }
        if (dev === 'Android') {
          return 50
        }
        return 80
      }
    },
    created() {
      this.getListSaleman()
      this.setButtonWidth()
      // window.shopStatistic = this.shopStatistic
      // window.nav_back = this.nav_back
      // this.nav()
    },
    methods: {
      setButtonWidth () {
        let currentDev = this.$dev
        try {
          if (currentDev === 1) {
            this.indexN = 80
          } else {
            this.indexN = 180
          }
        } catch (e) {
          //
        }
      },
      setAct() {
        this.$store.commit('SetUnionWhichAct', 0)
      },
      // shopStatistic() {
      //   this.setAct()
      //   this.$router.push({
      //     path: `/shop-statistic?shopid=${this.distributor}`
      //   })
      // },
      // nav_back() {
      //   navBack()
      // },
      // nav() {
      //   let param = {
      //     'left': [{
      //       'title': 'back',
      //       'function': 'nav_back()' // 默认
      //     }],
      //     'right': [{
      //       'title': '店铺统计',
      //       'icon_url': '/static/images/icon1.png',
      //       'function': 'shopStatistic()'
      //     }]
      //   }
      //   nativeBackBase(param)
      // },
      getListSaleman () {
        let URL = 'salesman/listSaleman'
        let obj = {
          page: 1
        }
        this.$http(URL, obj).then((res) => {
          if (res.code === this.$ok) {
            this.refresh = false
            this.loading = true
            this.noData = res.data.total === 0 ? 1 : 0
            if (res.data.total === 0) {
              this.hasMore = false
              return false
            }
            this.distributor = res.data.distributor
            this.managerLi = res.data.list.data
            this._checkMore(res.data.list)
          }
          this.flag = true
        })
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        let URL = 'salesman/listSaleman'
        let obj = {
          page: this.page
        }
        this.$http(URL, obj).then((res) => {
          if (res.code === this.$ok) {
            this.managerLi = this.managerLi.concat(res.data.list.data)
            this._checkMore(res.data.list)
          }
        })
      },
      _checkMore (data) {
        const dataList = data
        if (!dataList.data.length || (dataList.current_page * perpage) > dataList.total) {
          this.hasMore = false
        }
      },
      listScroll () {
        this.$emit('listScroll')
      },
      onButtonClick (index, id) {
        this.deleteIndex = index
        this.deleteId = id
        // 弹窗
        this.$refs.popSure.show()
      },
      goSure () {
        let URL = 'salesman/delSaleman'
        let obj = {
          id: this.deleteId
        }
        this.$http(URL, obj).then((res) => {
          if (res.code === this.$ok) {
            this.managerLi.splice(this.deleteIndex, 1)
          }
        })
      },
      cancelSure () {
        this.$refs.popSure.hide()
      },
      // 去店铺推广统计
      goShopStatistics () {
        this.$router.push('/shop-activity-statistics')
      },
      // 去推广统计
      goStatistics (id, name, mobile) {
        this.$router.push({ path: '/generalize-statistics', query: { id, name, mobile } })
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'AddManager') {
        this.$del(to, from, next, this, true)
      }
      next()
    },
    components: {
      NoMore,
      Scroll,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XDialog,
      Confirm,
      Loading
    }
  }
</script>
<style lang="stylus">
@import "~common/stylus/mixin"
@import "~common/stylus/variable.styl"
.manager-container
  .right-icon
    width 40px
    height 42px
    box-sizing content-box
    bg('icon-right.png')
    padding 20px
    margin-right -20px
    background-origin content-box
    background-clip content-box
  .manager-management
    position: fixed
    left: 0
    top: 85px
    bottom: 0
    right: 0
    bg('bg1.png')
    padding 110px 66px 120px
    z-index: 200
    &.active
      padding 0
      bg('bg2.png')
    &:after
      content: ''
      width: 100%
    .detail-main
      position relative
      width 100%
      height 100%
      bd(#EFEFEF)
      border-radius(20px)
      background #fff
      padding 20px 30px 0
      .scroll-content
        height: 100%
        overflow: hidden
        background: $color-white
        .vux-swipeout
          border-bottom 1px dashed $color-de;/*no*/
          .vux-swipeout-item
            height 120px
            &:after
              content unset
      .manager-li
        height 100%
        flex-between()
        align-items: center
        .left
          font-size: 28px;/*px*/
        .right
          font-size: 28px;/*px*/
        h5, p
          background-repeat: no-repeat
          background-position: left bottom
          background-size: 30px 30px;/*px*/
          padding-left: 42px
        h5
          background-image: url('./images/icon-avatar.png')
          margin-bottom: 22px
          span
            display inline-block
            padding-top 2px;/*no*/
            padding-left 5px;/*no*/
            min-width 124px
            height 34px
            text-align center
            line-height 34px
            vertical-align bottom
            background url('./cgs.png') no-repeat center
            background-size 100% 100%
            color #fff
            font-size 18px;/*px*/
        p
          background-image: url('./images/icon-tel.png')
        .right
          font-size: 28px;/*px*/
          color: $color-orange
          width: 30%
          height: 100%
          flex-box-center()
          justify-content: flex-end
      .swipeoutCss
        background: #fff9e2
      .manager-liTwo
        padding: 30px
        background: #fff9e2
        height: 140px;/*px*/
        flex-between()
        align-items: center
        .left
          font-size: 30px;/*px*/
          background: url('icon1.png') no-repeat left center
          background-size: 32px 32px;/*px*/
          padding-left: 44px
        .right
          font-size: 26px;/*px*/
          color: $color-red
          width: 30%
          height: 100%
          flex-box-center()
          justify-content: flex-end
    .add
      wh(184px)
      bg('icon-add.png')
      position: absolute
      bottom 20px
      left 50%
      transform: translateX(-50%)
    .no-data
      position absolute
      top 420px
      left 50%
      transform translateX(-50%)
      width 610px
      height 600px
      bd(#EFEFEF)
      border-radius(20px)
      background #fff
      overflow unset
      tc()
      &.active
        top 500px
      img
        width 168px
        height 148px
        margin-top 66px
      h1
        margin 30px 0
        f18()
        color $color-orange
      ul
        padding-left 156px
      li
        flex-f-align()
        f14()
        color $color-3
        line-height 40px
        margin-bottom 20px
        span:nth-child(odd)
          wh(12px)
          border-radius(50%)
          background $color-orange
          margin-right 16px
      .no-data-add
        wh(184px)
        bg('icon-add.png')
        position: absolute
        bottom -95px
        left 50%
        transform: translateX(-50%)
</style>
