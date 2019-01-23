<template>
  <div class="register">
    <div class="box">
      <label>手机号</label><input type="text" name="" placeholder="手机号" v-model="tel">
    </div>
    <div class="box">
      <label>密码</label><input type="text" name="" placeholder="密码" v-model="password">
    </div>
    <div class="box">
      <input type="text" v-model="verify">
      <button @click="getType">获取验证码</button>
    </div>
    <button @click="register">注册</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tel: '',
      password: '',
      verify: ''
    }
  },
  methods: {
    register () {
      let obj = {
        mobile: this.tel,
        password: this.password,
        verify: this.verify
      }
      this.$http('register', obj).then((res) => {
        this.$t(res.message, 'middle')
      })
    },
    getType () {
      let obj = {
        mobile: this.tel,
        type: 'register'
      }
      this.$http('send', obj).then((res) => {
        this.$t('提交成功', 'middle')
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
.register
  padding-top 100px
.box
  display: flex
  align-item: center
  padding: 0 25px
  line-height: 68px;/*px*/
  margin-bottom: 20px
  label
    width: 100px;/*px*/
  input
    display: block
    flex: 1
    border: 1px solid $color-c;/*no*/
    padding-left: 10px
  button
    width: 200px;/*px*/
    margin-left 40px
button
  display: block
  margin: 0 auto
  width: 120px
  line-height: 68px;/*px*/
  font-size: 26px;/*px*/
  border: 1px solid $color-c;/*no*/

</style>
