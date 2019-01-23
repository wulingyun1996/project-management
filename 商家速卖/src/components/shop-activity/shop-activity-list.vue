<template>
  <div class="activity-list-container">
    <base-header>
    <div class="right-icon" @click="goShopStatistics">
    </div>
    </base-header>
    <div class="activity-list-tabs">
      <base-select-input
        :options='ActivityTabList'
        @change='changeSelet'>
      </base-select-input>
    </div>
    <div class="activity-list-content">
      <base-scroll
        class="activity-list-scroll"
        :pullup='true'
        @scrollToEnd='getActivityList'
        :data='activityList'>
        <div>
          <swipeout> 
            <div v-for="(item, index) in activityList" class="activity-info">
              <swipeout-item :threshold=".5" :disabled='true'>
                  <div slot="right-menu">
                    <swipeout-button background-color="#FF332F" :width="100">删除</swipeout-button>
                  </div>
                  <div slot="content" class="vux-1px-tb staff-list" @click="goActivityDetail(item.id, item.status, item.isExpires)">
                    <div class="activity-detail">
                      <div class="activity-name">
                        <i></i>
                        <span>{{item.union_name}}</span>
                      </div>
                      <div class="activity-pic">
                        <img :src="item.image_path" alt="">
                        <img src="./images/share-icon.png" alt="" v-show="!item.status && !item.isExpires" @click.stop="showSharePopup(item)">
                        <div class="activity-expire bg-9" v-show="item.status">已下架</div>
                      </div>
                    </div>
                  </div>
              </swipeout-item>
              <h2 class="activity-title">{{ item.title }}</h2>
              <div class="activity-adress">
                <i></i>
                <span>{{item.address}}</span>
               </div>
              <div class="activity-time-line">
                <div class="activity-time">
                  <span class="clock"></span>
                  <span class="time-begin">{{ item.start_at | formatDateOne }}</span>
                  <span>至</span>
                  <span class="time-end">{{ item.end_at | formatDateOne }}</span>
                </div>
                <div class="activity-money">
                  <span v-if="item.isFree">免费</span>
                  <span v-else>￥{{ item.cost }}</span>
                </div>
              </div>
              <div class="mask" v-show="!item.status && item.isExpires"></div>
              <div class="activity-expire" v-show="!item.status && item.isExpires">
                <img src="./images/end-icon.png" alt="">
              </div>
            </div>
          </swipeout>
          <base-loading v-show="hasMore" title=""></base-loading>
          <base-no-more v-show="!hasMore && activityList.length" message="没有更多了"></base-no-more>
        </div>
      </base-scroll>
    </div>
    <div class="no-data" v-show="noData">
      <img src="./images/no-data.png">
      <p class="tishi">联盟商很忙，还没创建活动~</p>
    </div>
    <div class="circle-description" :class="{active: isPhoneX}" @click="showAlliancePopup"></div>
      <!-- 介绍弹窗 -->
    <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
      <div class="icon-top"></div>
      <p>联盟活动是自己组建的商圈或参与的商圈所发布的活动，可查看活动详细信息。</p>
      <div class="icon-bottom" @click="closeAlliancePopup"></div>
    </base-senior-popup>
    <transition name="fade">
      <div class="share-popup" v-show = "isShowSharePopup" >
        <div class="share-popup-wrapper">
          <div class="share-close" @click="hideSharePopup">
            <i></i>
          </div>
          <div class="info">
            <h1 class="share-title">分享活动</h1>
            <div class="share-pic">
              <img :src="currentInfo.image_path" alt="">
            </div>
            <div class="share-text">
              <p>推荐【{{currentInfo.union_name}}】活动给采购师，帮
              您邀请更多人参与。
              </p>
            </div>
            <div class="line"></div>
            <div class="share-icon" @click="share">
              <img src="./images/share_weixin.png" alt="">
              <p>微信好友</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BaseScroll from 'base/scroll/scroll'
import BaseSelectInput from 'base/select/select-b'
import BasePop from 'base/pop/pop'
import BaseLoading from 'base/loading/loading'
import BaseNoMore from 'base/no-more/no-more'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { initTime } from 'commons'
import { invokeNativeMethod } from 'api/navtive'
import { smallPic } from 'api/common'
const perpage = 10
export default {
  name: 'shopActivityList',
  data () {
    return {
      activityList: [],
      ActivityTabList: [],
      hasMore: true,
      page: 0,
      noData: null,
      isShowSharePopup: false,
      currentInfo: {}
    }
  },
  computed: {
    isPhoneX () {
      return this.$isX
    }
  },
  created() {
    this.getActivityTab()
    this.getActivityList()
  },
  methods: {
    showAlliancePopup () {
      this.$refs.alliancePopup.show()
    },
    closeAlliancePopup () {
      this.$refs.alliancePopup.hide()
    },
    // 活动列表
    getActivityList (id = 0) {
      if (!this.hasMore) return
      let url = 'UnionAct/getGroupAllList'
      let obj = {
        id,
        is_page: true,
        page: ++this.page
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.noData = res.data.total === 0 ? 1 : 0
          res.data.data.forEach(item => {
            item.isExpires = initTime(item.end_at) < initTime()
            item.isFree = Number(item.cost) === 0
          })
          this.activityList = [...this.activityList, ...res.data.data]
          this._checkMore(res.data)
        }
      })
    },
    // 活动列表选项卡
    getActivityTab () {
      let url = 'UnionAct/getGroupList'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          let obj = {
            title: '全部商圈',
            id: 0
          }
          res.data.data.unshift(obj)
          this.ActivityTabList = res.data.data
        }
      })
    },
    // 切换选项卡
    changeSelet (item) {
      this.initStatus()
      this.getActivityList(item.id)
    },
    // 活动详情
    goActivityDetail (id, isActivityDown, isActivityExpires) {
      this.$router.push({name: 'ShopActivityDetail', query: { id, isActivityDown, isActivityExpires }})
    },
    // 初始化状态
    initStatus () {
      this.page = 0
      this.hasMore = true
      this.noData = null
      this.activityList.splice(0)
    },
    // 去店铺推广统计
    goShopStatistics () {
      this.$router.push('/shop-activity-statistics')
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) >= dataList.total) {
        this.hasMore = false
      }
    },
    // 显示弹出框
    showSharePopup (item) {
      this.currentInfo = item
      this.isShowSharePopup = true
    },
    // 隐藏弹出框
    hideSharePopup () {
      this.isShowSharePopup = false
    },
    // 分享功能
    share () {
      let { currentInfo } = this
      let url = `/pages/activities/main`
      let obj = {}
      obj.type = 4
      obj.url = url
      obj.title = currentInfo.union_name
      obj.discriable = currentInfo.title
      obj.imgUrl = smallPic(currentInfo.image_path, 200, 200)
      obj.goodsId = currentInfo.id
      invokeNativeMethod('share', JSON.stringify(obj))
      this.isShowSharePopup = false
    }
  },
  filters: {
    formatDateOne (date) {
      return date.substring(5, date.length - 3)
    }
  },
  components: {
    BaseScroll,
    BaseSelectInput,
    BasePop,
    BaseLoading,
    BaseNoMore,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
@import "~common/stylus/vux"
.activity-list-container
  height 100%
  flex-col()
  background $color-white
  .right-icon
    width 40px
    height 42px
    box-sizing content-box
    bg('icon-right.png')
    padding 20px
    margin-right -20px
    background-origin content-box
    background-clip content-box
  .drop-down-container
    .drop-down-list
      top 190px!important
      .seperate
        height 0!important
  .activity-list-content
    background-color #f4f4f4
    flex 1
    overflow hidden
    padding 16px 30px
    position relative
    .activity-list-scroll
      height 100%
      .activity-info
        background-color #ffffff
        border-radius(16px)
        padding 0 16px
        margin-bottom 16px
        position relative
        .mask 
          width 100%
          height 100%
          position absolute
          top 0
          left 0
          background rgba(0,0,0,.3)
          border-radius(16px)
        .activity-expire
          img
            width 168px
            height 132px
            position absolute
            right 32px
            top 64px
            z-index 2
    .activity-detail
      .activity-name
        display flex
        align-items center
        font-family: PingFangSC-Regular;
        fz(12px)
        color #999999
        line-height 68px;/*no*/
        i
          wh(24px)
          bg('alliance-icon.png')
          margin-right 12px
      .activity-pic
        width 100%
        height 324px
        position relative
        img:nth-child(1)
          wh(100%)
        img:nth-child(2)
          position absolute
          top 16px
          right 16px     
    h2
      f14()
      color $color-3
      line-height 40px
      margin 14px 0
      text-over(1)
    .activity-adress
      margin-bottom 19px
      display flex
      align-items center
      font-family: PingFangSC-Regular;
      f12()
      color #999999
      i
        wh(28px)
        bg('adress-icon.png')
        margin-right 8px
    .activity-time-line
      flex-align-item()
      f14()
      color $color-9
      margin-bottom 28px
      .activity-time
        span
          display inline-block
          vertical-align middle
        span.clock
          wh(24px)
          bg('clock.png')
      .activity-money
        color $color-red
  .bg-9
    background $color-9
  .no-data
    position fixed
    width 100%
    left 0
    top 178px;/*px*/
    right 0
    bottom 88px;/*px*/
    // z-index 200
    img
      width 45%
      display block
      margin 110px auto 0
    .tishi
      text-align center
      font-size 30px;/*px*/
      color $color-9
      margin-top 92px
  .circle-description
    width 180px
    height 72px
    position fixed
    right 0
    bottom 60px
    bg('icon-alliance.png')
    &.active
      bottom 110px
  .alliance-popup
    >div
      width 560px!important
      padding 128px 66px 100px
      border-radius(24px)
      overflow unset
      position relative
      background url('./images/bg-alliance.png') no-repeat center bottom #fff
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
.share-popup
  pf(100%)
  left 0
  top 0
  z-index 999
  background rgba(0,0,0,.6)
  padding 0 20px
  .share-popup-wrapper
    margin-top 132px
    .share-close
      display flex
      justify-content flex-end
      i
        display block
        width 56px
        height 56px
        bg('close.png')
    .info
      background-color #fff
      border-radius(16px)
      margin-top 20px
      padding 30px
      .share-title
        font-family PingFangSC-Medium;
        f18()
        color #333333;
        text-align center
        line-height 36px
        margin-bottom 32px
      .share-pic
        width 100%
        height 272px
        margin 32px 0
        img
          wh(100%)
      .share-text
        p
          font-family PingFangSC-Regular;
          f16()
          color #333333
          line-height 38px
      .line
        width 100%
        bd-d(#cccccc, width = 1px)
        margin 37px 0 31px 0
      .share-icon
        img
          display block
          margin 0 auto
        p
          text-align center
          f12()
          color #666666
          text-align: center;
          margin 16px 0
.fade-enter-active,
.fade-leave-active
  transition opacity .6s
.fade-enter,
.fade-leave-to
  opacity 0
</style>
