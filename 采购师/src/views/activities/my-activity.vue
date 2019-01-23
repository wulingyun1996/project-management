<template>
  <div class="activities">
    <tab v-model="tabIndex" active-color="#FF8A00" default-color="#333" bar-active-color="#FF8A00">
      <tab-item @on-item-click="changeTab">报名的活动</tab-item>
      <tab-item @on-item-click="changeTab">推广的活动</tab-item>
    </tab>
    <div class="acti-box">
      <div v-if="hasNoData" class="no-data">
        <img src="./images/nodata.png" alt="">
        <p>暂无活动~</p>
      </div>
      <base-scroll
        v-if="!hasNoData"
        :hasMore='m_hasMore'
        :scrollPosY='m_scrollPosY'
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        :hasLoading="m_loading"
        :hasRefresh="m_refresh"
        @scrollToEnd="getData"
        :data="m_dataList">
        <ul class="acti-list">
          <li v-for="(item, index) in m_dataList" :key="index" class="acti-item" @click="goDetail(item.id)">
            <div class="acti">
              <div class="acti-status">
                <span v-if="item.status_pay"><i class="sign sign-succ"></i>报名成功</span>
                <span v-if="item.status_pay === 0"><i class="sign sign-wait-pay"></i>待付款</span>
                <span class="review-ticket"  v-if="!tabIndex && item.status_pay" @click.stop="goTicket(item.id, item.mobile, item.name)">查看入场券</span>
                <span class="review-ticket" @click.stop="goPay(item.id, item.mobile)"  v-if="showGoPay(item)">去付款</span>
              </div>
              <div class="acti-info">
                <div class="acti-img-box">
                  <img class="acti-img" :src="item.image_path" alt="">
                  <img class="acti-label" v-if="item.status_activity.code === 2" src="./images/low-frame.png" alt="">
                  <img class="acti-label" v-if="item.status_activity.code === 6" src="./images/tiemout.png" alt="">
                </div>
                <div class="acti-detail">
                  <p>{{ item.title }}</p>
                  <p>{{ item.start_at | timeFormate }}至{{ item.end_at | timeFormate }}</p>
                  <p>{{ item.province + item.city + item.area + item.address }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
    </div>
    <div class="ticket-box" v-transfer-dom>
      <x-dialog v-model="showTicket" hide-on-blur>
        <div class="ticket" id="ticket">
          <div class="ticket-info">
            <p class="ticket-title">诚邀</p>
            <p class="user-name">{{ticket.userName}}</p>
            <div class="ticket-base">
              <p><img class="icon-clock" src="./images/icon-clock-white.png" alt=""><span>{{ticket.time}}</span></p>
              <p><img class="icon-address" src="./images/icon-address.png" alt=""><span>{{ticket.address}}</span></p>
            </div>
          </div>
          <div class="ticket-no">
            {{ticket.id}}
          </div>
        </div>
        <div class="download-box">
          <!-- <a class="download" href="javascript:">下载保存至相册</a> -->
          <span class="screenshot">手机截图保存图片</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem, XDialog, TransferDom, XButton} from 'vux'
import BaseScroll from 'components/scroll/scroll'
import { mixins } from 'mixins'
// import html2canvas from '@/utils/html2canvas'
export default {
  name: 'MyActivity',
  mixins: [mixins],
  data () {
    return {
      tabIndex: 0,
      showTicket: false,
      ticket: {
        userName: '',
        time: '',
        address: '',
        id: ''
      },
      hasNoData: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      if (!this.m_hasMore) return
      this.$http('activity/getMyLists', {
        page: ++this.m_page,
        is_record: this.tabIndex
      }).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = this.m_dataList.concat(res.data.data)
          this.hasNoData = res.data.total === 0
          this._checkMore(res.data)
        }
      })
    },
    changeTab () {
      this.m_hasMore = true
      this.m_page = 0
      this.m_dataList = []
      this.getData()
    },
    goTicket (id, mobile, name) {
      this.$http('activity/getMyTicket', {
        id,
        mobile,
        name
      }).then(res => {
        if (res.code === this.$ok) {
          let data = res.data
          this.ticket.userName = data.name
          this.ticket.address = data.province + data.city + data.area + data.address
          this.ticket.id = 'NO:' + data.ticket
          this.showTicket = true
          this.ticket.time = this.ticketTimeFormate(data.start_at)
        }
      })
    },
    goTicketTest (id, mobile) {
      this.$router.push({
        path: '/signupSucc',
        query: {
          id,
          mobile
        }
      })
    },
    goDetail (id) {
      this.$router.push({
        path: '/unionDetail',
        query: {
          id
        }
      })
    },
    showGoPay (item) {
      return !this.tabIndex && !item.status_pay && item.status_activity.code !== 2 && item.status_activity.code !== 6
    },
    goPay (id, mobile) {
      this.$router.push({
        path: '/signupPay',
        query: {
          id,
          mobile
        }
      })
    },
    ticketTimeFormate (val) {
      var date = new Date(val)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hours = date.toTimeString().substr(0, 5)
      return year + '年' + month + '月' + day + '日 ' + hours
    }
    // 生成图片
    // downloadTicket () {
    //   let contentHtml = document.getElementById('ticket')
    //   let width = contentHtml.offsetWidth
    //   let height = contentHtml.offsetHeight
    //   let offsetTop = contentHtml.offsetTop
    //   let canvas = document.createElement('canvas')
    //   let context = canvas.getContext('2d')
    //   let scaleBy = Math.ceil(window.devicePixelRatio)
    //   canvas.width = width * scaleBy
    //   canvas.height = (height + offsetTop) * scaleBy
    //   context.scale(scaleBy, scaleBy)
    //   var opts = {
    //     allowTaint: true, // 允许加载跨域的图片
    //     tainttest: true, // 检测每张图片都已经加载完成
    //     scale: scaleBy, // 添加的scale 参数
    //     canvas: canvas, // 自定义 canvas
    //     logging: false, // 日志开关，发布的时候记得改成false
    //     width: width, // dom  原始宽度
    //     height: height // dom 原始高度
    //   }
    //   html2canvas(contentHtml, opts).then(function (canvas) {
    //     canvas.style.width = width + 'px'
    //     canvas.style.height = height + 'px'
    //     var image = new Image()
    //     // $('#grow-img').attr('src', canvas.toDataURL())
    //     image.src = canvas.toDataURL()
    //     // document.body.appendChild(image)
    //   })
    // }
  },
  filters: {
    timeFormate (time) {
      return ' ' + time.substr(5, 5) + ' ' + time.substr(10, 6) + ' '
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    BaseScroll,
    XDialog,
    XButton
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.activities
  height 100%
  .vux-tab-wrap
    height 102px
    .vux-tab-container
      height 102px
      .vux-tab
        height 102px
        .vux-tab-item
          f14()
          line-height 102px
  .acti-box
    background #f5f5f5
    width 100%
    position absolute
    bottom 0
    top 102px
    .no-data
      display flex
      justify-content center
      align-items center
      flex-direction column
      padding 40px 0
      img
        width 270px
        height 284px
      p
        color #999
        font-size 28px
        margin-top 64px
        text-align center
    .acti-list
      padding 30px
      .acti-item
        background #fff
        border-radius(8px)
        padding 30px
        // height 286px
        margin-bottom 30px
        .acti
          height 100%
          display flex
          flex-direction column
          justify-content space-between
          .acti-status
            display flex
            justify-content space-between
            padding-bottom 20px
            span:first-child
              line-height 30px
              vertical-align middle
              height 30px
              .sign
                display inline-block
                width 28px
                height 30px
                vertical-align middle
                margin-right 16px
                &.sign-succ
                  bg('sign-up-succ.png')
                &.sign-wait-pay
                  bg('sign-wait-pay.png')
          .review-ticket
            f12()
            color #4A90E2
            bd(#4A90E2)
            border-radius 100px
            padding 4px 18px
          .acti-info
            display flex
            justify-content flex-start
            .acti-img-box
              overflow hidden
              margin-right 30px
              position relative
              border-radius(10px)
              width 156px
              height 156px
              .acti-img
                width 156px
                height 156px
                vertical-align middle
              .acti-label
                width 116px
                height 52px
                position absolute
                bottom 10px
            .acti-detail
              p:first-child
                color #333
                f14()
                margin-bottom 20px
                width 446px
                text-over(2)
              p:nth-child(2)
              p:nth-child(3)
                margin 10px 0
                color #999
                f12()
                text-over(1)
.ticket-box
  .weui-dialog
    max-width 750px
    overflow auto
    width 100%
    background transparent
    .ticket
      position relative
      bg('ticket-bg.png')
      width 583px
      height 769px
      margin auto
      .ticket-info
        text-align left
        padding 40px
        .ticket-title
          color #ffff00
          text-indent 20px
          fz(22px)
          margin-top: 36px
        .user-name
          text-align center
          padding 97px 0 125px 0
          fz(25px)
          color #fff
        .ticket-base
          margin-left 26px
          p
            f16()
            margin 20px 0
            color #fff
            fz(13px)
            .icon-clock
              width 30px
              vertical-align middle
              margin-right 20px
            .icon-address
              width 28px
              vertical-align top
              margin-right 20px
              display inline-block
            span
              display inline-block
              width 370px
              line-height 1.5
      .ticket-no
        color #ffff00
        fz(22px)
        position absolute
        bottom 100px
        left: 50%
        transform translateX(-50%)
    .download-box
      margin-top 50px
      .download
        bd(1px, #fff)
        color #ffffff
        background transparent
        padding 20px 30px
        border-radius(10px)
        fz(18px)
      .screenshot
        color #fff
        f14()
        &:after
          display block
          width 100px
          height 1px; /*no*/
          background #ccc
</style>
