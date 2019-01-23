<template>
  <div class="sign-info">
    <div class="sign-form">
      <div class="sign-form-item">
        <span>姓名</span>
        <input type="text" ref="nameInput"  v-model="signInfo.userName" placeholder="请输入您的姓名">
      </div>
      <div class="sign-form-item">
        <span>手机号</span>
        <input type="number" ref="phoneInput"   v-model="signInfo.mobile"  placeholder="请输入您的手机号">
      </div>
    </div>
    <div class="btn-submit ipone-x-absolute-bottom1" :class="{disabled: isDisable}" @click="submitSignInfo">提交</div>
    <div v-transfer-dom class="tips-save-dialog">
      <confirm v-model="showDialog"
      title="放弃活动报名"
      @on-confirm="onConfirm"
      @on-show="onShowDialog"
      @on-cancel="onCancelDialog">
        <p style="text-align:center;">您确认放弃该活动的报名吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import {Confirm, TransferDom} from 'vux'
import {nativeBackAndClose, closeWebview} from 'native'

export default {
  data () {
    return {
      id: this.$route.query.id,
      oldUserName: this.$route.query.userName,
      oldMobile: this.$route.query.mobile,
      signInfo: {
        userName: this.$route.query.userName,
        mobile: this.$route.query.mobile || window.sessionStorage.getItem('account')
      },
      signUpId: this.$route.query.signUpId,
      showDialog: false,
      isLeave: true,
      canSubmit: true
    }
  },
  created () {
    nativeBackAndClose('请填写报名信息')
    window.closeMyView = this.closeMyView
    window.confirmBack = this.confirmBack
  },
  methods: {
    submitSignInfo () {
      if (this.isDisable) {
        return false
      }
      var reg = /^1[3-9][0-9]{9}$/
      var nameReg = /\s+/g
      if (!this.signInfo.userName) {
        this.$t('姓名不能为空', 'middle')
        return false
      }
      if (nameReg.test(this.signInfo.userName)) {
        this.$t('姓名不允许出现空格', 'middle')
        return false
      }
      if (!reg.test(this.signInfo.mobile)) {
        this.$t('请输入正确的手机号', 'middle')
        return false
      }
      if (!this.canSubmit) {
        return false
      }
      this.canSubmit = false
      if (this.signUpId) {
        this.$http('activity/modify', {
          id: this.id,
          old_name: this.oldUserName,
          old_mobile: this.oldMobile,
          new_name: this.signInfo.userName,
          new_mobile: this.signInfo.mobile,
          sign_up_id: this.signUpId
        }).then(res => {
          this.canSubmit = true
          if (res.code === 200) {
            this.$router.push({
              path: '/signupPay',
              query: {
                id: this.id,
                mobile: this.signInfo.mobile
              }
            })
          } else {
            this.$t(res.message, 'middle')
          }
        })
      } else {
        this.$http('activity/signUp', {
          id: this.id,
          mobile: this.signInfo.mobile,
          name: this.signInfo.userName
        }).then(res => {
          this.canSubmit = true
          if (res.code === this.$ok) {
            var isPay = res.data.is_pay
            if (!isPay) {
              this.$t('恭喜您，报名成功', 'middle')
              setTimeout(() => {
                this.$router.replace({
                  path: '/signupSucc',
                  query: {
                    id: this.id,
                    mobile: this.signInfo.mobile,
                    userName: this.signInfo.userName
                  }
                })
              }, 2000)
            } else {
              this.$router.replace({
                path: '/signupPay',
                query: {
                  id: this.id,
                  mobile: this.signInfo.mobile
                }
              })
            }
          } else {
            this.$t(res.message, 'middle')
          }
        }).catch(err => {
          this.canSubmit = true
          this.$t(err, 'middle')
        })
      }
    },
    handleInput () {
      if (this.$refs.nameInput.value && this.$refs.phoneInput.value) {
        this.isDisable = false
      } else {
        this.isDisable = true
      }
    },
    onShowDialog () {
      this.isLeave = false
    },
    confirmBack () {
      this.showDialog = true
    },
    closeMyView () {
      closeWebview()
    },
    onConfirm () {
      this.isLeave = true
      this.$router.back(-1)
    },
    onCancelDialog () {
      this.isLeave = true
    }
  },
  computed: {
    isDisable () {
      return !this.signInfo.userName || !this.signInfo.mobile
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Confirm
  },
  beforeRouteLeave (to, from, next) {
    if (this.isLeave) {
      next()
    } else {
      next(false)
    }
  }
}

</script>
<style   lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.sign-info
  height 100%
  background #fff
  .sign-form
    padding 30px
    .sign-form-item
      display flex
      justify-content space-around
      align-items center
      margin-bottom 30px
      input[type=text]
      input[type=number]
        width 540px
        height 88px
        bd(#ccc)
        border-radius(8px)
        text-indent 20px
      span
        f14()
        color #333
        width 100px
  .btn-submit
    background #D70110
    color #ffffff
    width 100%
    height 98px
    f18()
    text-align center
    line-height 98px
    position fixed
    bottom 0
    &.disabled
      background gray
.tips-save-dialog
  .weui-dialog
    width 600px
    max-width 750px
    .weui-dialog__hd
      padding 50px 80px 25px
      .weui-dialog__title
        f16()
    .weui-dialog__bd
      padding 0 80px 40px
      f14()
    .weui-dialog__ft
      f16()
      line-height 2.5
</style>
