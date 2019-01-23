<template>
  <div class="establish-activity-container" v-show="isShow">
    <div class="establish-activity-content">
      <base-scroll class="activity-scroll-wrapper">
        <div>
          <div class="establish-activity-banner">
            <img :src="bannerSrc" alt="">
            <div class="activit-expire">
              <span v-show="!isActivityDown && isActivityExpires">已结束</span>
              <span class="bg-9" v-show="isActivityDown">已下架</span>
            </div>
          </div>
          <!-- 活动主题 -->
          <div class="form-group bd-b">
            <label for="theme">
              <span>主题：</span>
              <input id="theme" type="text" readonly placeholder="活动主题" class="flex-1" maxlength="25" :value='activityTheme'>
            </label>
          </div>
          <!-- 开始-结束时间 -->
          <div class="form-group bd-b flex-f">
            <label class="min-width">
              <span class="">时间：</span>
                <group class="time-begin">
                  <datetime
                    v-model="startTime"
                    :format="format"
                    :min-year='2018'
                    :readonly='true'></datetime>
                </group>
            </label>
            <label class="">
              <span class="">至</span>
                <group class="time-end">
                  <datetime
                    v-model="endTime"
                    :format="format"
                    :min-year='2018'
                    :readonly='true'></datetime>
                </group>
            </label>
          </div>
          <!-- 地址 -->
          <div class="form-group bd-b flex-f">
            <label>
              <span>地址：</span>
            </label>
            <div class="address">
              <group>
                <x-address :disabled='true' value-text-align="right" title="" :list='cityList' v-model="city"></x-address>
              </group>
            </div>
          </div>
          <!-- 街道地址 -->
          <div class="form-group bd-b">
            <label for="street">
              <input id="street" type="text" readonly class="flex-1" maxlength="50" :value="streetInfo">
            </label>
          </div>
          <!-- 费用 -->
          <div class="form-group bd-b">
            <label for="cost">
              <span>费用（选填）：</span>
              <input id="cost" type="text" readonly class="tr flex-1" :value="activityCost">
            </label>
          </div>
          <!-- 参与品牌 -->
          <div class="form-group bd-b">
            <div class="edit-brand">
              <span class="margin-0">参与品牌（选填）：</span>
              <div class="brand-list" v-for="img in brandList">
                <img :src="img" alt="">
              </div>
            </div>
          </div>
          <!-- 活动详情 -->
          <div class="form-group">
            <label>
              <span>活动详情：</span>
            </label>
            <div class="activity-detail" v-html="activityContent">
              <!--  -->
            </div>
          </div>
        </div>
      </base-scroll>
    </div>
    <div class="bottom" v-show="!isActivityDown && !isActivityExpires" @click.stop="showSharePopup()">
      分享给采购师
    </div>
    <transition name="fade">
      <div class="share-popup" v-show = "isShowSharePopup" >
        <div class="share-popup-wrapper">
          <div class="share-close" @click="hideSharePopup">
            <i></i>
          </div>
          <div class="info">
            <h1 class="share-title">分享活动</h1>
            <div class="share-pic">
              <img :src="bannerSrc" alt="">
            </div>
            <div class="share-text">
              <p>推荐【{{activityTheme}}】活动给采购师，帮
              您邀请更多人参与。
              </p>
            </div>
            <div class="line"></div>
            <div class="share-icon">
              <img src="./images/share_weixin.png" alt="" @click="share">
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
import { Group, Datetime, XAddress } from 'vux'
import cityList from 'data/areaAddress.json'
import { invokeNativeMethod } from 'api/navtive'
import { smallPic } from 'api/common'
export default {
  name: 'shopActivityDetail',
  data () {
    return {
      isShow: false,
      bannerSrc: '',
      activityTheme: '',
      format: 'YYYY-MM-DD HH:mm',
      startTime: '',
      endTime: '',
      cityList,
      city: [],
      streetInfo: '',
      activityCost: '',
      activityContent: '',
      brandList: [],
      isShowSharePopup: false
    }
  },
  computed: {
    activityId () {
      return this.$route.query.id
    },
    // 是否下架, 默认下架
    isActivityDown () {
      return this.$route.query.isActivityDown === 1
    },
    // 是否结束
    isActivityExpires () {
      return this.$route.query.isActivityExpires
    }
  },
  created() {
    this.viewActivityDetail()
  },
  methods: {
    // 查看活动详情
    viewActivityDetail () {
      let url = 'UnionAct/actDetails'
      let obj = {
        id: this.activityId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.bannerSrc = res.data.image_path
          this.activityTheme = res.data.title
          this.startTime = res.data.start_at.substring(0, res.data.start_at.length - 3)
          this.endTime = res.data.end_at.substring(0, res.data.end_at.length - 3)
          this.city = [res.data.province, res.data.city, res.data.area]
          this.streetInfo = res.data.address
          this.activityCost = res.data.cost
          this.brandList = res.data.brand
          this.activityContent = res.data.description
          this.isShow = true
        }
      })
    },
    // 显示弹出框
    showSharePopup () {
      this.isShowSharePopup = true
    },
    // 隐藏弹出框
    hideSharePopup () {
      this.isShowSharePopup = false
    },
    // 分享功能
    share () {
      let {activityId, activityTheme, bannerSrc} = this
      let url = `/pages/activities/main`
      let obj = {}
      obj.type = 4
      obj.url = url
      obj.title = activityTheme
      // obj.discriable = 1
      obj.imgUrl = smallPic(bannerSrc, 200, 200)
      obj.from = 1
      obj.goodsId = activityId
      invokeNativeMethod('share', JSON.stringify(obj))
      this.isShowSharePopup = false
    }
  },
  components: {
    BaseScroll,
    Group,
    Datetime,
    XAddress
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
@import "~common/stylus/vux.styl"
.establish-activity-container
  flex-col()
  height 100%
  background $color-white
  .establish-activity-content
    flex 1
    overflow hidden
    .activity-scroll-wrapper
      padding 0 30px
      height 100%
    .establish-activity-banner
      margin 0 -30px
      height 350px
      position relative
      img
        wh(100%)
      .activit-expire
        span
          display block
          f12()
          height 42px
          line-height 42px
          font-weight 700
          padding 0 22px
          color $color-white
          position absolute
          top 20px
          right 0
          background #BA9870
          border-radius(100px 0 0 100px)
    .form-group
      f14()
      color $color-6
      label
        height 100px
        flex-f()
        align-items center
        >span
          margin-right 40px
        .time-begin,
        .time-end
          flex 1
        .weui-cells
          .weui-cell__ft
            padding-right 13px;/*no*/
          span.vux-cell-value
            f14()
            color $color-9
        #street
          margin-left 120px
        input
          color $color-c
      .edit-brand
        flex-f()
        align-items center
        position relative
        flex-wrap wrap
        padding-top 30px
        min-height 100px
        .brand-list
          width 100px
          height 60px
          margin-right 8px
          margin-bottom 30px
          position relative
          img
            wh(100%)
        .brand-list:nth-child(6),
        .brand-list:nth-child(12)
          margin-left 42px
      .address
        position relative
        flex 1
        padding-right 30px
        .weui-cells
          height 100px
          line-height 100px
          f14()
          color: $color-c
          span.vux-popup-picker-value
            f14()
            color $color-3
  .establish-activity-footer
    flex-f()
    line-height 100px
    f16()
    tc()
    .save-activity
      flex 1
      height 100px
      background $color-orange
      color $color-white
  .activity-cancel-wrapper
    pf(100%)
    background rgba(0, 0, 0, .5)
    .activity-cancel
      width 72%
      height 40%
      padding 0 46px
      background $color-white
      border-radius(20px)
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      h1
        f18()
        color $color-orange
        line-height 50px
        tc()
        margin-top 84px
        margin-bottom 44px
      p
        f16()
        line-height 40px
      .activity-cancel-reason
        color $color-3
        margin-bottom 20px
      .activity-explain
        color $color-9
        margin-bottom 64px
      .activity-button
        tc()
        button
          display inline-block
          width 260px
          height 64px
          line-height 64px
          border-radius(8px)
          f16()
          background $color-orange
          color $color-white
  .tr
    tr()
  .flex-f
    flex-f()
  .flex-1
    flex 1
  .bd-b
    bd-b($color-f4)
  .margin-0
    margin-right 0!important
  .min-width
    min-width 270px
  .forbidden-click
    pointer-events none
  .bottom 
    width 100%
    height 88px
    line-height 88px
    text-align center
    background-color #FF8A00
    f16()
    color #FFFFFF
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
