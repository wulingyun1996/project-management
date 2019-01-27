<template>
  <div class="forget-container">
    <div class="sc-box">
      <div class="sc-head">
          <a href="javascript:void(0);">
              <img src="./images/logo.png">
          </a>
          <span class="sc-header">神采家居建材 城市运营商管理中心</span>
      </div>
      <div class="sc-body">
        <div class="sc-bodyShow">
          <div class="sc-bodyContent">
            <div class="sc-nav">
                    <span>找回密码</span>
                <a href="javascript:" @click="goLogin">
                    登录
                    <img src="./images/arrow-right.png">
                </a>
            </div>
            <div class="sc-content">
              <div class="sc-input01">
                <input
                  type="text"
                  placeholder="请输入您的手机号"
                  maxlength="11"
                  onkeyup="this.value=this.value.replace(/[^0-9]+/,'');"
                  value=""
                  v-model="mobile">
                <p style="cursor: pointer; text-align: center;" id="getCode" @click="getVerifyCode">获取验证码</p>
                <div class="errorShow mobile" v-show="errorOne">
                  <img src="./images/error-show.png">
                  <span>手机号不正确</span>
                </div>
              </div>
              <div class="sc-logininput">
                <input type="text" placeholder="请输入验证码" name="captcha" maxlength="4" v-model="verifyCode">
                <div class="errorShow captcha" v-show="errorTwo">
                  <img src="./images/error-show.png">
                  <span>验证码不正确</span>
                </div>
              </div>
              <div class="sc-logininput">
                <input type="password" placeholder="请输入新密码" name="password" v-model="passwordOne">
                <div class="errorShow password" v-show="errorThree">
                  <img src="./images/error-show.png">
                  <span>新密码不正确</span>
                </div>
              </div>
              <div class="sc-logininput">
                <input type="password" placeholder="请重复新密码" name="repassword" v-model="passwordTwo">
                <div class="errorShow password_confirmation" v-show="errorFour">
                  <img src="./images/error-show.png">
                  <span>重复密码不正确</span>
                </div>
              </div>
              <div class="sc-logininput">
                <div class="sc-submit" style="cursor: pointer;" @click="submitReseted">提交</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sc-foot">
        <div class="sc-footContent">
          <p>Copyright  2016 神采(上海)网络科技有限公司</p>
          <p>版权所有 经营许可证编号：沪B1.B2-20100278 B2-20100310 (沪)-经营性-2013-0003</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Jsencrypt from 'api/encrypt.js'
import { checkPhoneNumber } from 'utils/common'
const LOCALSTORAGE = window.localStorage
export default {
  data () {
    return {
      errorOne: false,
      errorTwo: false,
      errorThree: false,
      errorFour: false,
      mobile: '',
      verifyCode: '',
      passwordOne: '',
      passwordTwo: ''
    }
  },
  methods: {
    goLogin () {
      this.$router.replace('/login')
    },
    getVerifyCode () {
      if (!this.mobile) {
        this.$mes('请输入手机号', 2)
        return
      }
      if (!checkPhoneNumber(this.mobile)) {
        this.$mes('请输入正确的手机号', 2)
        return
      }
      let url = 'send'
      let obj = {
        mobile: this.mobile,
        type: 'forget'
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('手机验证码已发送，请注意查收')
          return
        }
        this.$mes('手机号码不存在，请重新输入', 4)
      })
    },
    submitReseted () {
      if (!this.validateFileds()) return
      let url = 'forget'
      let obj = {
        mobile: this.mobile,
        password: Jsencrypt(this.passwordOne),
        captcha: this.verifyCode
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          LOCALSTORAGE.setItem('mobile', this.mobile)
          this.$router.replace('/login')
          this.$mes('提交成功', 2)
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    validateFileds () {
      if (!this.mobile) {
        this.$mes('请输入手机号', 2)
        return false
      }
      if (!checkPhoneNumber(this.mobile)) {
        this.$mes('请输入正确的手机号', 2)
        return false
      }
      if (!this.verifyCode) {
        this.$mes('请输入验证码', 2)
        return false
      }
      let res = /[0-9]/.test(this.verifyCode)
      if (!res) {
        this.$mes('请输入正确的验证码', 2)
        return false
      }
      if (!this.passwordOne || this.passwordOne.length < 6) {
        this.$mes('请输入新密码，且长度最少6位', 2)
        return false
      }
      if (!this.passwordTwo) {
        this.$mes('请输入重复密码', 2)
        return false
      }
      if (this.passwordOne !== this.passwordTwo) {
        this.$mes('新密码与重复密码不一致', 2)
        return false
      }
      return true
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/mixins'
.forget-container
.sc-box {
    width: 100%;
    background-color: #f7f7f7;
}
.sc-head{
    width: 1200px;
    height: 90px;
    vertical-align: top;
    margin:0 auto;
    flex-f-align()
}
.sc-head a{
    display: inline-block;
    width: 229px;
    border-right: 1px solid #333333;
    box-sizing content-box
    padding-right: 20px;
}
.sc-head .sc-header{
    font-size: 30px;
    display: inline-block;
    vertical-align: top;
    color: #000;
    padding-left: 20px;
}
.sc-body{
    background url("./images/backgroud.jpg") no-repeat
    height 600px
    padding-top 20px
}
.sc-bodyShow{
    width: 57%;
    height: 520px;
    border-radius: 8px;
    background-color: #f7f7f7;
    margin: 0 auto;
    padding: 34px 60px 0;
}
.sc-nav span{
   width: 100px;
    height: 34px;
    padding-bottom: 5px;
    font-size: 24px;
    border-bottom: 4px solid #eeb032;
}
.sc-nav a{
    float: right;
    color: #eeb032;
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    margin-top: 5px;
}
.sc-nav a:hover{
    color: #eeb032;
}
.sc-nav img {
    margin-left: 5px;
}
.sc-content{
    width: 315px;
    height: 311px;
    margin: 50px auto;
}
.sc-content input{
    color: #333;
}
.sc-input01{
    width: 450px;
    height: 40px;
    margin-bottom: 21px;

}
.sc-input01 input{
    height: 34px;
    width: 205px;
    padding:2px 3px;
    border: 1px solid #ccc;
}
.sc-input01 p{
    width: 100px;
    height: 34px;
    line-height: 34px;
    display: inline-block;
    margin-left: -6px;
    font-size: 16px;
    color: #ffffff;
    background-color: #eeb032;
    vertical-align: top;

}
.errorShow{
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    display: none;
    color: #ff0000;
}
.errorShow img{
    margin-right: 2px;
}
.sc-logininput{
    width: 546px;
    height: 40px;
    margin-bottom: 21px;
}
.sc-logininput input{
    height: 34px;
    width: 305px;
    padding:2px 3px;
    border: 1px solid #ccc;
}
.sc-submit{
    width: 315px;
    text-align: center;
    height: 40px ;
    line-height: 40px;
    font-size: 22px;
    background-color: #eeb032;
    color: #ffffff;
}
.sc-foot
  tc()
  p
    line-height 20px
</style>
