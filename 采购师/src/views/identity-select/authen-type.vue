<template>
  <div class="authen-type-container">
    <div class="authen-type-guide">
      <img src="./images/img-authen-type.png" alt="">
      <h5>您选择的身份</h5>
      <div class="authen-identity-list">
        <img
          v-for="item in seletedIdentityList"
          :key="item.id"
          :src="item.selectedImg" alt="">
      </div>
      <p>认证赚钱仅差一步,马上认证，立享蜂蜜豪礼</p>
      <p>三种认证方式任意选择</p>
      <i class="next-step"></i>
    </div>
    <div class="authen-type-body">
      <div class="authen-item" @click="selectAuthenType(1)">
        <img src="./images/img-service.png" alt="">
        <div class="authen-description">
          <h6>客服电话认证</h6>
          <p>致电平台客服，省心，便捷</p>
        </div>
        <i class="arrow-right"></i>
      </div>
      <div class="authen-item" @click="selectAuthenType(2)">
        <img src="./images/img-answer.png" alt="">
        <div class="authen-description">
          <h6>答题快速认证</h6>
          <p>专业问答5题，答对4题即可认证通过</p>
        </div>
        <i class="arrow-right"></i>
      </div>
      <div class="authen-item" @click="selectAuthenType(3)">
        <img src="./images/img-scan-code.png" alt="">
        <div class="authen-description">
          <h6>扫描商户特约二维码认证</h6>
          <p>若有商户二维码，扫码极速认证享特权</p>
        </div>
        <i class="arrow-right"></i>
      </div>
    </div>
    <div class="authen-abandon">
      <span @click="abandonAuthen">以后再说</span>
      <i class="abandon-authen"></i>
    </div>
    <div class="authen-popup" v-show="isShow">
      <div class="authen-popup-body">
        <p>
          <span class="close-icon" @click="hide"></span>
        </p>
        <h2>立即拨打电话</h2>
        <div class="tel">
          <span class="tel-icon"></span>
          <h3 @click="invokeTel">{{ servicePhone }}</h3>
        </div>
      </div>
    </div>
    <base-popup-pass
      v-show="ispassedAuthend"
      @comfirm='hasAuthend'>
    </base-popup-pass>
  </div>
</template>

<script>
import BasePopupPass from 'components/popup/popup-pass'
import { invokeNativeMethod, nativeGoHome } from 'native'
import { mapState } from 'vuex'
export default {
  name: 'IdentityAuthenType',
  data () {
    return {
      servicePhone: '',
      isShow: false,
      seletedIdentityList: [],
      ispassedAuthend: false
    }
  },
  computed: {
    ...mapState(['authenRole'])
  },
  created () {
    this.getSelectedIdentity()
    this.queryIdentityStatus()
    this.queryTel()
    this.sendIdentity()
  },
  methods: {
    getSelectedIdentity () {
      let { seletedIdentityList } = this.authenRole
      this.seletedIdentityList = seletedIdentityList
    },
    // 查询当前采购师认证的状态
    queryIdentityStatus () {
      let url = 'auditResult'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.auditeStatus = res.data.audit_status
          if (this.auditeStatus === 2) {
            this.ispassedAuthend = true
            invokeNativeMethod('navigationItem', JSON.stringify({}))
          }
        }
      })
    },
    // 查询客服电话
    queryTel () {
      let url = 'home/getCustomerInfo'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.servicePhone = res.data.service_phone
        }
      })
    },
    // 认证类型
    sendIdentity (type = 2) {
      let url = 'addIdentity'
      let obj = {
        title: this.authenRole.seletedIdentity.join(),
        identity_form: type
      }
      return new Promise(resolve => {
        this.$http(url, obj).then(res => {
          resolve(res.data)
        })
      })
    },
    // 选择认证类型进行认证
    selectAuthenType (t) {
      switch (t) {
        case 1:
          this.isShow = true
          this.sendIdentity(1).then(res => {
            res ? invokeNativeMethod('setIdentityAuthId', res) : invokeNativeMethod('setIdentityAuthId', '')
          })
          break
        case 2:
          this.sendIdentity(2).then(() => {
            this.$router.push({ name: 'AuthenAnswer' })
          })
          break
        case 3:
          this.sendIdentity(3)
          invokeNativeMethod('scanCode', 'authenIdentity')
          break
      }
    },
    invokeTel () {
      invokeNativeMethod('invokeTel', this.servicePhone)
      this.isShow = false
    },
    abandonAuthen () {
      nativeGoHome()
    },
    hasAuthend () {
      invokeNativeMethod('setIdentityAuth', 2)
      nativeGoHome()
    },
    hide () {
      this.isShow = false
    }
  },
  components: {
    BasePopupPass
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.authen-type-container
  height 100%
  overflow hidden
  background url('./images/bg-authen.png') no-repeat top 0 center #FDF8B9
  background-size 100% auto
  .authen-type-guide
    padding-top 44px
    // padding-bottom 36px
    > img
      display block
      margin 0 auto 40px
      width 478px
      height 154px
    h5
      width 280px
      height 44px
      line-height 44px
      f13()
      tc()
      color #8B572A
      background #FEE56E
      border-radius(50px)
      margin 0 auto 32px
    .authen-identity-list
      flex-center()
      margin-bottom 36px
      img
        width 116px
        height 128px
        & + img
          margin-left 22px
    p
      color #E7691B
      f14()
      min-width 540px
      tc()
      line-height 1.4
      & + p
        margin-bottom 16px
    i.next-step
      display block
      margin 0 auto
      wh(44px)
      bg('icon-next-step.png')
  .authen-type-body
    margin-bottom 60px
    .authen-item
      width 690px
      height 140px
      bg('bg-authen-types.png')
      margin 20px auto 0
      flex-center()
      padding 0 34px
      img
        wh(80px)
      .authen-description
        color #8B572A
        f12()
        padding-left 20px
        flex 1
        h6
          f16()
          font-weight 700
          color #E23C3C
          margin-bottom 24px
      i.arrow-right
        wh(40px)
        bg('icon-authen-type.png')
  .authen-abandon
    flex-center()
    color #8B572A
    f14()
    margin-top -20px
    span
      padding 20px 0
    .abandon-authen
      margin-left 6px
      width 28px
      height 30px
      bg('icon-abandon-authen.png')
  .authen-popup
      pf(100%)
      left 0
      top 0
      right 0
      bottom 0
      background rgba(0, 0, 0, .5)
      .authen-popup-body
        width 540px
        height 280px
        position absolute
        left 50%
        top 50%
        transform translate(-50%, -50%)
        background #fff
        border-radius(24px)
        padding 30px
        p
          tr()
          margin-bottom 30px
          span
            display inline-block
            wh(24px)
            bg('close.png')
        h2
          f16()
          color $color-64
          line-height 44px
          tc()
          margin-bottom 25px
        .tel
          flex-center()
          fz(20px)
          line-height 58px
          color $color-0
          .tel-icon
            width 60px
            height 66px
            bg('tel.png')
            margin-right 4px;/*no*/
</style>
