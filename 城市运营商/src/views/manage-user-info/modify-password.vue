<template>
  <div class="user-account-container">
    <div class="user-account-header">
      <div class="button-account user-account-button" :class="{ active: currentStatus === 1 }" @click="toggleStatus(1)">账户信息</div>
      <div class="button-modify-password user-account-button" :class="{ active: currentStatus === 2 }" @click="toggleStatus(2)">修改密码</div>
    </div>
    <div class="user-account-info" v-show="currentStatus === 1">
      <div class="account-info-item">
        <div class="info-item">
          <span class="info-name">账号：</span>
          <span>{{ userInfo.account }}</span>
        </div>
        <div class="info-item">
          <span class="info-name">服务城市：</span>
          <span>{{ userInfo.city }}</span>
        </div>
      </div>
      <div class="account-info-item">
        <div class="info-item">
          <span class="info-name">公司名称：</span>
          <span>{{ userInfo.company_name || '/'}}</span>
        </div>
        <div class="info-item">
          <span class="info-name">公司法人：</span>
          <span>{{ userInfo.legal_person || '/' }}</span>
        </div>
      </div>
      <div class="account-info-item">
        <div class="info-item">
          <span class="info-name">联系人：</span>
          <span>{{ userInfo.contact || '/' }}</span>
        </div>
        <div class="info-item">
          <span class="info-name">联系电话：</span>
          <span>{{ userInfo.contact_number || '/' }}</span>
        </div>
      </div>
      <div class="account-info-item">
        <div class="info-item">
          <span class="info-name">创建时间：</span>
          <span>{{ userInfo.created_at }}</span>
        </div>
      </div>
    </div>
    <div class="modify-pass" v-show="currentStatus === 2">
      <el-form ref="form" :model="form" :rules="rules" status-icon label-width="100px">
        <el-form-item label="账号：">
          <span>{{form.phone}}</span>
        </el-form-item>
        <el-form-item label="旧密码：" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="pass">
          <el-input type="password" v-model="form.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input type="password" v-model="form.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Jsencrypt from 'api/encrypt'
export default {
  name: 'UserCount',
  data () {
    return {
      currentStatus: 1,
      userInfo: {},
      form: {
        phone: '',
        password: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        pass: [
          { validator: this.validatePass, trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: this.validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.currentStatus = this.$route.query.type ? Number(this.$route.query.type) : 1
    this.getUserInfo()
  },
  methods: {
    toggleStatus (t) {
      this.currentStatus = t
    },
    getUserInfo () {
      this.$http('userInfo').then(res => {
        if (res.code === this.$ok) {
          this.form.phone = res.data.account
          this.userInfo = res.data
        }
      })
    },
    validatePass (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.form.password) {
        callback(new Error('新密码与旧密码不能相同'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    },
    validatePass2 (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            oldPass: Jsencrypt(this.form.password),
            newPass: Jsencrypt(this.form.pass)
          }
          this.$http('setUserPass', obj).then(res => {
            if (res.code === this.$ok) {
              this.$mes('修改成功')
              this.$router.push('/login')
              return
            }
            if (res.code === 400) {
              this.$mes(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.user-account-container
  .user-account-header
    >div
      margin-right 30px
      &.active
        color #fff
        background-color #409EFF
        border-color #409EFF
  .user-account-info
    margin-top 30px
    .account-info-item
      margin-bottom 20px
      f14()
      .info-item
        display inline-block
        width 250px
        height 40px
        line-height 40px
        max-width 250px
        margin-right 30px
        span
          display inline-block
          height 100%
          &.info-name
            width 100px
            tr()
            color #606266
            & + span
              width 150px
  .modify-pass
    .el-form
      margin-top 30px
      width 500px
  .user-account-button
    display inline-block
    line-height 1
    white-space nowrap
    cursor pointer
    background #fff
    border 1px solid #dcdfe6
    color #606266
    outline 0
    margin 0
    transition .1s
    font-weight 500
    padding 12px 20px
    tc()
    f14()
    border-radius(4px)
</style>
