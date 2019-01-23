<template>
  <div class="sign-succ-wrapper">
    <p class="sign-succ-title">报名成功</p>
    <div class="ticket">
      <div class="ticket-title">
        {{ticket.title}}
      </div>
      <div class="ticket-action">
        <div>诚</div>
        <div>邀</div>
      </div>
      <div class="user-name">{{ticket.userName}}</div>
      <div class="ticket-base">
        <p><img class="icon-clock" src="./images/icon-clock-white.png" alt=""><span>{{ticket.time}}</span></p>
        <p><img class="icon-address" src="./images/icon-address.png" alt=""><span>{{ticket.address}}</span></p>
      </div>
      <div class="ticket-no">
        {{ticket.id}}
      </div>
    </div>
    <p class="ticket-tips">手机截图保存图片</p>
    <div class="btn-invitation" @click="share">邀请好友</div>
  </div>
</template>

<script>
import {nativeCloseViewAndShare, invokeNativeMethod, dev} from 'native'
import { smallPic } from 'common'
export default {
  data () {
    return {
      id: this.$route.query.id,
      mobile: this.$route.query.mobile,
      userName: this.$route.query.userName,
      salesmanId: 0,
      recommendId: '',
      mainImg: '',
      ticket: {
        userName: '',
        time: '2018年4月16日 18:00',
        address: '上海普陀区同普路1272号建材采购师1F',
        id: '',
        title: ''
      }
    }
  },
  created () {
    this.goTicket()
    nativeCloseViewAndShare()
    window.navBackSucc = this.navBack
    window.closeMyview = this.closeWebview
    window.share = this.share
  },
  methods: {
    goTicket () {
      this.$http('activity/getMyTicket', {
        id: this.id,
        mobile: this.mobile,
        name: this.userName
      }).then(res => {
        if (res.code === this.$ok) {
          let data = res.data
          this.ticket.title = data.title
          this.ticket.userName = data.name
          this.ticket.address = data.province + data.city + data.area + data.address
          this.ticket.id = 'NO:' + data.ticket
          this.showTicket = true
          this.ticket.time = this.ticketTimeFormate(data.start_at)
          this.salesmanId = data.salesmanId
          this.recommendId = data.recommendId || 0
          this.mainImg = data.image_path
        }
      })
    },
    ticketTimeFormate (time) {
      var year = time.substr(0, 4)
      var month = time.substr(5, 2)
      var day = time.substr(8, 2)
      var hours = time.substr(11, 5)
      return year + '年' + month + '月' + day + '日 ' + hours
    },
    navBack () {
      this.$router.go(-1)
    },
    closeWebview () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeClose()
          return
        }
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeClose.postMessage('')
        }
      } catch (e) {
        console.warn(e)
      }
    },
    share () {
      this.$http('activity/recommend', {
        id: this.id
      })
      let url = `/pages/unionDetail/main?id=${this.id}&recommendId=${this.recommendId}&salesmanId=${this.salesmanId}`
      let obj = {
        type: 4,
        url,
        title: this.ticket.title,
        discriable: this.ticket.title,
        imgUrl: smallPic(this.mainImg, 400, 400),
        from: 3,
        actId: this.id
      }
      invokeNativeMethod('share', JSON.stringify(obj))
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.sign-succ-wrapper
  width 100%
  height 100%
  bg('signup-succ-bg.png')
  text-align center
  .sign-succ-title
    display inline-block
    text-align center
    background url('./images/pay-succ.png') left center no-repeat
    background-size 60px
    height 60px
    line-height 60px
    padding-left 90px
    color #FF8A00
    fz(16px)
    margin 60px 0
  .ticket
    bg('sign-succ-bg.png')
    width 624px
    height 814px
    margin 0 auto
    overflow hidden
    position relative
    .ticket-title
      bd(#FFFF00,2px)
      fz(18px)
      color #FFFF00
      width 500px
      margin 60px auto
      padding 20px 30px
      line-height 1.2
    .ticket-action
      display flex
      justify-content center
      div
        background #FFFF00
        width 52px
        height 52px
        border-radius 26px
        color #FF7700
        f16()
        line-height 52px
        &:last-child
          margin-left -10px
    .user-name
      fz(25px)
      color #Fff
      margin 64px 0
    .ticket-base
        margin-left 100px
        text-align left
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
      position absolute
      bottom 100px
      left 50%
      transform translateX(-50%)
      color #ffff00
      fz(22px)
  .ticket-tips
    position relative
    f14()
    color #333
    display inline-block
    width 624px
    margin-top 40px
    &:after
      content ''
      position absolute
      top 50%
      right 22px
      width 140px
      height 1px;/*no*/
      background #333
    &:before
      content ''
      position absolute
      top 50%
      width 140px
      left 22px
      height 1px;/*no*/
      background #333
  .btn-invitation
    position fixed
    width 100%
    height 92px
    background #D70110
    color #fff
    f18()
    text-align center
    line-height 92px
    bottom 0

</style>
