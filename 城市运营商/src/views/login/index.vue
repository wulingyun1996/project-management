<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <img src="./images/login-logo.png" alt="">
    </div>
    <div class="title-wrapper">
      <div class="title-line"></div>
      <div class="title-text">神采家居建材城市运营商管理中心</div>
      <div class="title-line"></div>
    </div>
    <div class="login-wrapper">
      <div class="left">
        <img src="./images/login-description.png" alt="">
      </div>
      <div class="right">
        <div class="tips" v-show="showErrorinfo">
          <span class="tips-icon"></span>
          <span>{{ tipsMessage }}</span>
        </div>
        <input class="input first-input" type="tel" placeholder="请输入手机号" v-model="phoneNumber" maxlength="11">
        <input class="input" type="password" placeholder="请输入密码" v-model="password">
        <div class="code">
          <input type="tel" placeholder="请输入验证码" v-model="veriCode" maxlength="4">
          <img :src="imgUrl" alt="" @click="refreshCode">
        </div>
        <div class="forget-password">
          <router-link to="/forget-password">忘记密码？</router-link>
        </div>
        <div class="login-submit" @click="loginRole">登录</div>
      </div>
      <!-- <div class="bg"></div> -->
    </div>
    <div class="login-footer">
      <p>Copyright  2016 神采(上海)网络科技有限公司</p>
      <p>版权所有 经营许可证编号：沪B1.B2-20100278 B2-20100310 (沪)-经营性-2013-0003</p>
    </div>
  </div>
</template>

<script>
import { checkPhoneNumber } from 'utils/common'
import Jsencrypt from 'api/encrypt'
const APIROOT = process.env.VUE_APP_API_ROOT
const LOCALSTORAGE = window.localStorage
const MOBILE = LOCALSTORAGE.getItem('mobile')
export default {
  data () {
    return {
      showErrorinfo: false,
      phoneNumber: MOBILE || '',
      password: '',
      tipsMessage: '',
      veriCode: '',
      verifyCode: '',
      // 图形验证码
      timeStamp: Math.round(new Date() / 1000)
    }
  },
  computed: {
    imgUrl () {
      return `http:${APIROOT}captcha?t=${this.timeStamp}`
    }
  },
  created () {
    window.addEventListener('keyup', this.listenKeyUp)
  },
  methods: {
    // 登录
    loginRole () {
      if (!this.validateNumber()) return
      if (!this.validatePass()) return
      if (!this.validateVeriCode()) return
      let url = 'Login'
      let obj = {
        username: this.phoneNumber,
        password: Jsencrypt(this.password),
        verify: this.veriCode,
        grant_type: 'password',
        client_id: 'cityop',
        client_secret: 'secret',
        t: this.timeStamp
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let token = `${res.data.token_type} ${res.data.access_token}`
          this.setToken(token)
          this.setItem('userId', res.data.userId)
          this.setItem('mobile', this.phoneNumber)
          this.$router.replace('/dashboard')
          return
        }
        // 账号被停用
        if (res.code === 402) {
          this.$confirm(`唉呀！您的账号已被停用如有疑问,请联系商服 商服热线：${res.message}`, '提示', {
            confirmButtonText: '',
            cancelButtonText: '',
            type: 'warning',
            center: true
          })
          return
        }
        this.showErrorinfo = true
        this.tipsMessage = res.message
        setTimeout(() => {
          this.showErrorinfo = false
        }, 3000)
      })
    },
    // 刷新验证码
    refreshCode () {
      this.timeStamp = Math.round(new Date() / 1000)
    },
    validateNumber () {
      let res = checkPhoneNumber(this.phoneNumber)
      if (res) return true
      this.$mes('请输入正确的手机号', 2)
      return false
    },
    validatePass () {
      if (!this.password) {
        this.$mes('请输入密码', 2)
        return false
      }
      if ((this.password + '').length < 5) {
        this.$mes('密码不能小于5位', 2)
        return false
      }
      return true
    },
    validateVeriCode () {
      if (!this.veriCode) {
        this.$mes('请输入验证码', 2)
        return false
      }
      let res = /[0-9]/.test(this.veriCode)
      if (!res) {
        this.$mes('请输入正确的验证码', 2)
        return false
      }
      return true
    },
    listenKeyUp (e) {
      if (e.keyCode === 13) {
        this.loginRole()
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.listenKeyUp)
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.login-container
  bg('login-bg.jpg')
  flex-col()
  align-items center
  .logo-wrapper
    width 250px
    height 72px
    margin-top 57px
    margin-bottom 32px
    img
      wh(100%)
  .title-wrapper
    flex-align-item()
    color $color-white
    f28()
    margin-bottom 56px
    .title-line
      width 148px
      bd-b($color-white)
    .title-text
      margin 0 48px
      letter-spacing 2px
  .login-wrapper
    bd(#fdd395)
    padding 12px 16px
    background #fbab32
    position relative
    flex-f()
    .bg
      position absolute
      width 946px
      height 136px
      bg('login-shadow.png')
      left -58px
      bottom 0
    .left
      width 318px
      height 384px
      position relative
      z-index 10
      img
        wh(100%)
    .right
      width 480px
      height 384px
      flex-col()
      align-items center
      background $color-white
      position relative
      z-index 10
      .tips
        position absolute
        top 44px
        flex-align-item()
        f12()
        color #cc3333
        .tips-icon
          width 24px
          height 20px
          bg('login-tips.png')
          margin-right 5px
      .input
        width 304px
        height 48px
        bd($color-c)
        border-radius(4px)
        margin-bottom 24px
        padding-left 10px
      .first-input
        margin-top 75px
      .code
        width 304px
        height 48px
        flex-align-item()
        margin-bottom 12px
        input
          width 175px
          height 100%
          border-radius(4px)
          bd($color-c)
          margin-right 10px
          padding-left 10px
        img
          cursor pointer
      .forget-password
        a
          color $color-orange
          fz(14px)
          margin-left -135px
      .login-submit
        cursor pointer
        width 176px
        height 40px
        margin-top 22px
        background $color-orange
        color $color-white
        tc()
        border-radius(100px)
        fz(20px)
        line-height 40px
  .login-footer
    margin-top 50px
    tc()
    p
      line-height 20px
</style>
