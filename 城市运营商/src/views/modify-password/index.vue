<template>
  <div class="modifyPass">
    <div class="modifyButto">
      <el-button>主要按钮</el-button>
      <el-button type="info">信息按钮</el-button>
    </div>
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
</template>

<script>
import Jsencrypt from 'api/encrypt'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.form.password) {
        callback(new Error('新密码与旧密码不能相同'))
      } else  {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
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
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http('userInfo').then(res => {
        if (res.code === this.$ok) {
          this.form.phone = res.data.account
        }
      })
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
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push('/login')
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
.modifyButto
  .el-button + .el-button
    margin-left 30px
.el-form
  margin-top 30px
  width 500px
</style>
