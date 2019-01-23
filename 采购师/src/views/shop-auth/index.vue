<template>
  <div class="scan-code-container">
    <div class="scan-code-shop-detail">
      <div class="shop-logo">
        <img :src="shopLogo" alt="" v-if="shopLogo">
        <img src="./images/auth-logo.png" alt="" v-else>
      </div>
      <h1 class="shop-name">{{ shopTitle }}</h1>
      <p>恭喜！</p>
      <p>您已成为特约采购师！</p>
    </div>
    <div class="authen-description">
      <p class="description">自购享低价 分享赚高额佣金</p>
      <div class="authen-honey">
        <i></i>
        <div class="honey-num">
          <span class="num">+5</span>
          <span class="text">蜂蜜</span>
        </div>
      </div>
      <p class="txt">登陆后可领取</p>
      <div class="authen-shop-button" @click="showAuthDialog">立即查看特权</div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="authShow" class="auth-box-dialog" hide-on-blur>
        <div class="auth-ident-box">
          <div class="logo">
            <img src="./images/auth-logo.png" alt="">
          </div>
          <div class="form">
            <div class="form-item">
              <input type="text" placeholder="请输入手机号码" v-model="phoneNumber">
              <div class="code-button" :class="{ disabled: isDisable }" @click="getCode">{{ getCodeText }}</div>
            </div>
            <div class="form-item">
              <input type="text" placeholder="请输入验证码" v-model="messageCode">
            </div>
            <div class="form-item" v-show="isPrivilege">
              <input type="password" placeholder="请输入密码" v-model="password">
            </div>
          </div>
          <div class="add-identity" v-show="isPrivilege" @click="showRoles">
            <i></i>
            <span>选择您的身份</span>
          </div>
          <div class="identity-list">
            <div
              class="identity-item"
              v-for="(item, index) in seletedIdentity"
              :key="index">
              {{ item }}
            </div>
          </div>
          <div class="register-identity" @click="goAuthen">打开建材采购师</div>
          <p>未注册的手机将自动创建建材采购师账户</p>
        </div>
      </x-dialog>
    </div>
    <base-popup-transition ref="popup">
      <div class="register-content">
        <h1 class="title">
          请选择您的身份
          <span @click="hideRoles"></span>
        </h1>
        <p>请根据您的从业内容合理选择您的身份</p>
        <p>最多可选择3个</p>
        <div class="seperate"></div>
        <div class="form">
          <div
            class="form-group"
            v-for="(role, index) in identity"
            :key="role.id"
             @click="selectCurrentIdentity(role, index)">
            <label>
              <span :class="{ active: role.selected }"></span>
              {{ role.name }}
            </label>
            <h2>{{ role.title }}</h2>
          </div>
        </div>
        <div class="register-submit" @click="hideRoles">确定</div>
      </div>
    </base-popup-transition>
    <toast v-model="showTips" type="text" position="middle" :time="2000">最多可选择3个</toast>
    <div class="authen-popup-container" v-show="isShowAuthendPopup" @click="isShowAuthendPopup = false">
      <div class="authen-popup-wrapper">
        <div class="honey-wrapper">
          <i></i>
          <div class="honey-num">
            <span class="num">+35</span>
            <span class="text">蜂蜜</span>
          </div>
        </div>
        <h2>注册成功！</h2>
        <p>您已成功注册为平台特约采购师并已成功</p>
        <p>认证【{{ shopTitle }}】特权优惠</p>
        <p>自购省钱，分享赚钱，快去享受特权吧</p>
        <button class="button" @click="goHome">立即体验</button>
      </div>
    </div>
  </div>
</template>

<script>
import BasePopupTransition from 'components/popup/popup-transition'
import { XDialog, TransferDom, Toast } from 'vux'
import { nativeBackHome, invokeNativeMethod, nativeGoHomeNormal } from 'native'
import { inArray, cloneDeep } from 'common'
import identity from 'data/identity'
import Jsencrypt from 'api/encrypt'
let description = '限时抢购，爆款活动商品不参与此优惠，此优惠仅限本店铺使用，认证申请审核通过后可享受此特权优惠。最终解释权归商户所有'
/* eslint-disable */
let { IS_TEST_ENV, NODE_ENV, VERSION } = process.env
const ENV = NODE_ENV === 'production'
const isCustomVersion = VERSION !== 'static'
const isTest = ENV && IS_TEST_ENV
const URL = !ENV ?
                `http://test-c.cgs18.com` :
          isTest ?
                (isCustomVersion ? `http://test-c.cgs18.com/${VERSION}/app` : `http://test-c.cgs18.com/app`) :
                (isCustomVersion ? `http://c.cgs18.com/${VERSION}/app` : `http://c.cgs18.com/app`)
/* eslint-enable */
export default {
  data () {
    return {
      authShow: false,
      isPrivilege: false,
      phoneNumber: '',
      password: '',
      messageCode: '',
      identity: cloneDeep(identity),
      roleName: '',
      getCodeText: '获取验证码',
      timer: null,
      isDisable: false,
      oneDiscount: '',
      buyerId: '',
      shopTitle: '',
      shopLogo: '',
      authenDescription: '',
      isAuthendByCode: false, // 是否通过采购师二维码认证过，默认是未认证
      isBeforeScroll: true,
      seletedIdentity: [],
      showTips: false,
      isShowAuthendPopup: false
    }
  },
  computed: {
    isFromApp () {
      return this.$route.query.from === 'app'
    },
    shopId () {
      return this.$route.query.shopId
    }
  },
  created () {
    this.getOneDiscount()
    this.judgeIdentityFromApp()
    nativeBackHome()
  },
  methods: {
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.bottom
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    },
    // 如果扫码过来， 跳转到 我的蜂蜜
    goHoneyShop () {
      let { isFromApp } = this
      if (isFromApp) {
        this.$router.push('/my-honey?fromNative=1')
        return
      }
      this.authShow = !this.authShow
    },
    // app 内扫码认证，默认注册成为该店铺特约采购师，返回结果是否是第一次认证还是已经认证过了
    judgeIdentityFromApp () {
      let { isFromApp, shopId } = this
      if (isFromApp) {
        let url = 'adv/buyerShopAuthAppCode'
        let obj = {
          seller_id: shopId
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            if (res.data.process === 1) {
              this.isAuthendByCode = true
              // app 内认证店铺成功，跳转到店铺详情页
              this.$push({ name: 'ShopDetail', query: { id: shopId, showAuthen: 1 } })
            } else {
              this.isShowAuthendPopup = true
              invokeNativeMethod('isFromSMIdentityAuth', 2)
            }
          }
        })
      }
    },
    showAuthDialog () {
      let { isFromApp, shopId } = this
      if (isFromApp) {
        this.$router.push({ path: '/shop-detail', query: { id: shopId, goHome: 1 } })
        return
      }
      this.authShow = !this.authShow
    },
    showAuthDialog2 () {
      this.authShow = !this.authShow
      this.isPrivilege = false
    },
    // 判断填入的手机号是否认证过采购师
    getCode () {
      var reg = /^1[3-9][0-9]{9}$/
      if (!this.phoneNumber) {
        this.$t('请输入手机号')
        return
      }
      if (!reg.test(this.phoneNumber)) {
        this.$t('手机号格式不正确')
        return
      }
      let { phoneNumber, shopId } = this
      let url = 'sendPhoneMessage'
      let obj = {
        mobile: phoneNumber,
        type: 'register'
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          var time = 59
          this.isDisable = true
          this.getCodeText = time + 's'
          if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
          }
          this.timer = setInterval(() => {
            time--
            this.getCodeText = time + 's'
            if (time === 0) {
              this.getCodeText = '获取验证码'
              this.isDisable = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
          let url = 'isRegister'
          let obj = {
            mobile: phoneNumber,
            source: 4
          }
          this.$http(url, obj).then(res => {
            this.isPrivilege = res.data.status === 2
            this.buyerId = res.data.buyer_id
            // 若是已认证，则直接认证该店铺成为特约采购师
            if (!this.isPrivilege) {
              let url = 'adv/buyerShopAuthCode'
              let obj = {
                seller_id: shopId,
                buyer_id: this.buyerId
              }
              this.$http(url, obj)
            }
            // 若是未认证，则需要选择身份，认证成为采购师，并且认证店铺
          })
          return
        }
        this.$t(res.error)
      })
    },
    // 获取返佣比例以及店铺名称
    getOneDiscount () {
      let url = 'remaidRatio'
      let obj = {
        seller_id: this.shopId,
        status: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { one_discount, shopName, explain, shop_logo_path } = res.data
          this.oneDiscount = parseFloat(one_discount).toFixed(1)
          this.shopTitle = shopName
          this.shopLogo = shop_logo_path
          this.authenDescription = explain ? explain : description
          /* eslint-enable */
        }
      })
    },
    showRoles () {
      this.$refs.popup.show()
    },
    // 确认身份之后隐藏身份选择框
    hideRoles () {
      this.$refs.popup.hide()
    },
    // 选择身份
    selectCurrentIdentity (item, i) {
      let { name, selected } = item
      let { include, index } = inArray(name, this.seletedIdentity)
      if (!include) {
        if (this.seletedIdentity.length === 3) {
          this.showTips = true
          return
        }
        this.seletedIdentity.push(name)
      } else {
        this.seletedIdentity.splice(index, 1)
      }
      item.selected = !selected
      this.identity.splice(i, 1, item)
    },
    // 开启特约采购师
    goAuthen () {
      if (this.isPrivilege) {
        this.goAuthenCurrentShop()
        return
      }
      this.openCgs()
    },
    // 未认证，则需要选择身份，认证成为采购师，并且认证店铺
    goAuthenCurrentShop () {
      let { seletedIdentity, buyerId, phoneNumber, messageCode, shopId, password } = this
      if (!messageCode.trim()) {
        this.$t('请输入验证码')
        return
      }
      if (!password.trim()) {
        this.$t('请输入密码')
        return
      }
      if (!seletedIdentity.length) {
        this.$t('请选择身份')
        return
      }
      let url = 'addIdentityCode'
      let obj = {
        title: seletedIdentity.join(),
        user_id: buyerId,
        mobile: phoneNumber,
        verify: messageCode,
        password: Jsencrypt(password)
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let url = 'adv/buyerShopAuthCode'
          let obj = {
            seller_id: shopId,
            buyer_id: buyerId
          }
          this.$http(url, obj).then(res => {
            if (res.code === this.$ok) {
              this.openCgs()
              return
            }
            this.$t(res.message)
          })
          return
        }
        this.$t(res.message)
      })
    },
    openCgs () {
      let { phoneNumber, messageCode } = this
      let url = 'verifyOrNo'
      let obj = {
        mobile: phoneNumber,
        verify: messageCode
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (!this.inWx) {
            this.$push('/app')
          } else {
            location.replace(URL)
          }
          return
        }
        this.$t(res.message)
      })
    },
    goHome () {
      this.isShowAuthendPopup = false
      nativeGoHomeNormal()
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    Toast,
    BasePopupTransition
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.scan-code-container
  height 100%
  overflow hidden
  position relative
  bg('bg-scan-code.png')
  flex-col()
  .scan-code-shop-detail
    tc()
    margin-bottom 120px
    .shop-logo
      wh(180px)
      border-radius(28px)
      margin 56px auto 32px
      img
        wh(100%)
    .shop-name
      height 36px
      f18()
      color $color-white
      margin-bottom 30px
    p
      fz(26px)
      color #F8E71C
      line-height 72px
  .authen-description
    tc()
    .description
      f18()
      color #DF8B48
      margin-top 110px
      margin-bottom 52px
    .authen-honey
      wh(180px)
      bg('bg-circle.png')
      margin 0 auto
      flex-col()
      align-items center
      justify-content center
      i
        width 50px
        height 82px
        bg('icon-honeys.png')
        margin-bottom 10px
      .honey-num
        f10()
        flex-center()
        .num
          fz(30px)
          color #F6333D
        .text
          margin-top 10px
    .txt
      f12()
      color #DF8B48
      margin-top 16px
      margin-bottom 42px
    .authen-shop-button
      width 460px
      height 90px
      margin 0 auto
      line-height 90px
      f16()
      color $color-white
      background #FE7303
      border-radius(100px)
.auth-box-dialog
  .weui-mask
    z-index 990
    background rgba(0, 0, 0, .5)
  .weui-dialog
    border-radius(24px)
    width 100%
    max-width 690px
    overflow auto
    z-index 990
    .auth-ident-box
      width 690px
      padding 0 50px
      .logo
        height 90px
        margin-bottom 40px
        position relative
        img
          position absolute
          width 180px
          height 180px
          left 50%
          top -90px
          transform translateX(-50%)
          border-radius(50%)
      .form
        .form-item
          flex-f-align()
          margin-bottom 20px
          input
            flex 1
            height 88px
            bd($color-c)
            border-radius(8px)
            f14()
            padding-left 40px
            color $color-6
          .code-button
            f14()
            border-radius(8px)
            width 180px
            margin-left 30px
            height 88px
            line-height 88px
            color $color-white
            background $color-orange
            &.disabled
              pointer-events none
      .add-identity
        flex-f-align()
        padding-top 12px
        f14()
        color $color-orange
        i
          wh(28px)
          bg('icon-add.png')
          margin-right 16px
      .identity-list
        flex-f()
        flex-wrap wrap
        .identity-item
          margin-top 20px
          height 60px
          line-height 60px
          background #FEF0D7
          border-radius(30px)
          padding 0 20px
          f14()
          color $color-3
          &:nth-child(2)
            margin 20px 16px 0
      .register-identity
        margin-top 40px
        border-radius(10px)
        color $color-white
        background $color-orange
        f18()
        height 88px
        line-height 88px
      p
        f12()
        margin 32px 0
        color #9B9B9B
.register-content
    width 100%
    height 90%
    flex-col-btw()
    background $color-white
    position absolute
    left 0
    right 0
    bottom 0
    padding 28px 50px
    h1.title
      font-weight 700
      color $color-orange
      f20()
      tc()
      position relative
      margin-bottom 16px
      span
        width 30px
        height 30px
        position absolute
        right 0
        top 50%
        transform translateY(-50%)
        bg('icon-close.png')
        padding 20px
        box-sizing content-box
        background-clip content-box
        background-origin content-box
    > p
      f12()
      color $color-9
      line-height 36px
      tc()
    .seperate
      bd-b(#979797)
      margin-top 24px
    .form
      flex 1
      display block
      overflow auto
      .form-group
        flex-col()
        margin-top 30px
        label
          f16()
          color $color-0
          font-weight 700
          flex-f-align()
          margin-bottom 16px
          span
            wh(32px)
            margin-right 20px
            bg('icon-default-checkbox.png')
            &.active
              bg('icon-selected-checkbox.png')
        h2
          f12()
          margin-left 52px
          color $color-9b
    .register-submit
      height 88px
      line-height 88px
      color $color-white
      background $color-orange
      font-weight 700
      f18()
      tc()
      border-radius(10px)
.authen-popup-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .6)
  .authen-popup-wrapper
    position absolute
    width 620px
    height 680px
    bg('authen-popup.png')
    left 50%
    top 50%
    transform translate(-50%, -50%)
    .honey-wrapper
      wh(220px)
      margin 0 auto 16px
      overflow hidden
      i
        display block
        width 54px
        height 90px
        margin 20px auto 0
        bg('icon-honey2.png')
      .honey-num
        margin-top 12px
        margin-bottom 10px
        f10()
        flex-center()
        .num
          fz(30px)
          color #F6333D
          margin-right 4px
        .text
          margin-top 10px
    h2
      fz(30px)
      color #F6333D
      tc()
      font-weight 700
      margin-bottom 68px
      line-height 84px
    p
      padding-left 40px
      f14()
      color $color-white
      line-height 40px
    .button
      display block
      width 230px
      height 80px
      margin 34px auto 0
      line-height 80px
      tc()
      padding 0
      background #fdd229
      border-radius(10px)
      color #D0021B
      font-weight 700
      f18()
      letter-spacing 2px;/*no*/
</style>
