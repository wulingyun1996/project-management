<template>
  <div class="signPay">
    <group>
      <cell @click.native="updateSignInfo" title="报名人信息" :value="signInfo" is-link></cell>
      <cell-box>
        <div class="acti-info">
          <div class="acti-img-box">
            <img class="acti-img" :src="actiImg" alt="">
          </div>
          <div class="acti-detail">
            <p>{{actiTitle}}</p>
            <p>{{startTime}} 至 {{endTime}}</p>
            <p>{{address}}</p>
          </div>
        </div>
      </cell-box>
      <cell class="acti-price" title="活动费用" :value="actiPrice"></cell>
      <cell-box class="pay-type-box">
        <div class="pay-type">
          <div class="wx-pay">
            <img src="./images/wx-pay.png" alt="">
            微信
          </div>
          <div class="chekbox">
            <check-icon :value.sync="checkWePay" ></check-icon>
          </div>
        </div>
      </cell-box>
      <div class="btn-pay-box">
        <div class="pay-price">
          <span>金额：</span>
          <span>{{actiPrice}}</span>
        </div>
        <div class="btn-pay" @click="goPay">
          马上支付
        </div>
      </div>
    </group>
  </div>
</template>

<script>
import {CellBox, Cell, Group, XButton, CheckIcon} from 'vux'
import {nativeBackAndClose, invokeNativeMethod, closeWebview} from 'native'

export default {
  data () {
    return {
      id: this.$route.query.id,
      mobile: this.$route.query.mobile,
      signUpId: 0,
      checkWePay: true,
      userName: '',
      actiImg: '',
      actiTitle: '',
      startTime: '',
      endTime: '',
      address: '',
      actiPrice: 0

    }
  },
  created () {
    nativeBackAndClose('活动报名')
    this.getSignInfo()
    window.confirmBack = this.confirmBack
    window.closeMyView = this.closeMyView
    window.paySucc = this.paySucc
  },
  methods: {
    goPay () {
      if (!this.checkWePay) {
        this.$t('请选择支付方式', 'middle')
        return false
      }
      if (!this.signUpId) {
        return false
      }
      invokeNativeMethod('Pay', this.signUpId)
    },
    updateSignInfo () {
      this.$router.push({
        path: '/signupInfo',
        query: {
          id: this.id,
          mobile: this.mobile,
          userName: this.userName,
          signUpId: this.signUpId
        }
      })
    },
    getSignInfo () {
      this.$http('activity/signPayInfo', {
        id: this.id,
        mobile: this.mobile
      }).then(res => {
        if (res.code === this.$ok) {
          this.signUpId = res.data.user.sign_up_id
          this.userName = res.data.user.name
          this.actiImg = res.data.act.image_path
          this.actiTitle = res.data.act.title
          this.startTime = res.data.act.start_at.substr(5, 11)
          this.endTime = res.data.act.end_at.substr(5, 11)
          this.address = res.data.act.province + res.data.act.city + res.data.act.area + res.data.act.address
          this.actiPrice = '￥' + res.data.act.cost
        }
      })
    },
    paySucc () {
      this.$router.replace({
        path: '/signupSucc',
        query: {
          id: this.id,
          mobile: this.mobile,
          userName: this.userName
        }
      })
    },
    closeMyView () {
      closeWebview()
    },
    confirmBack () {
      this.$router.back(-1)
    }
  },
  computed: {
    signInfo () {
      return this.userName + '(' + this.mobile + ')'
    }
  },
  components: {
    CellBox,
    Cell,
    Group,
    XButton,
    CheckIcon
  }
}

</script>
<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.signPay
  height 100%
  background #f5f5f5
  .weui-cells
    margin-top: 0
    background #f5f5f5
    .weui-cell
      height 100px
      line-height 100px
      margin-bottom  20px
      background #fff
      .vux-label
        f14()
        color #000
      .weui-cell__ft
        f14()
        color #333
        padding-right 40px
        &:after
          width 18px
          height 18px
          top: 45%
      &.acti-price
        .weui-cell__ft
          color #D70110
          fz(18px)
          padding 10px
    .vux-cell-box
      height 246px
      .acti-info
        display flex
        line-height 1
        justify-content space-around
        margin 0 auto
        .acti-img-box
          width 180px
          height 180px
          font-size 0
          line-height 0
          margin-right 30px
          img
            width 180px
            height 180px
        .acti-detail
          p:first-child
            width 482px
            f14()
            color #333
            margin-bottom 40px
          p:nth-child(2)
            f12()
            padding 10px 0
            color #999
            background url('./images/icon-time-gray.png') left center no-repeat
            padding-left 40px
            background-size 28px 26px
          p:nth-child(3)
            padding 10px 0
            background url('./images/icon-address-gray.png') left center no-repeat
            padding-left 40px
            background-size 26px 28px
            f12()
            color #999
  .weui-cells
    .pay-type-box
      height 100px
      .pay-type
        width 100%
        display flex
        justify-content space-between
        align-items center
        .wx-pay
          f14()
          color #000
          img
            width 62px
            height 54px
            vertical-align middle
            margin-right 20px
        .weui-icon
          fz(24px)
  .btn-pay-box
    position fixed
    bottom 0
    left 0
    right 0
    display flex
    justify-content space-between
    .pay-price
      line-height 98px
      width 450px
      background #fff
      span:first-child
        margin-left 40px
        f18()
        color #333
      span:last-child
        color #D70110
        f18()
    .btn-pay
      width 300px
      height 98px
      text-align center
      background #D70110
      line-height 98px
      f18()
      color #fff
</style>
