<template>
  <div class="home">
    <div class="tab-main">
      <router-link to="/alliance" tag="div">联盟活动统计</router-link>
      <router-link to="/honey" tag="div">我的蜂蜜</router-link>
      <router-link to="/want-to-buy" tag="div">求购管理</router-link>
      <router-link to="/flash-sale" tag="div">限时抢购</router-link>
      <router-link to="/hot-goods" tag="div">爆款商品</router-link>
      <router-link to="/recommen-shop" tag="div">推荐商户</router-link>
      <router-link to="/identity-select" tag="div">采购师注册-身份填充</router-link>
      <router-link to="/help" tag="div">帮助与反馈</router-link>
      <router-link to="/quotation" tag="div">购物车</router-link>
      <router-link to="/quotation-list" tag="div">报价单管理</router-link>
      <router-link to="/register" tag="div">注册登录账号</router-link>
      <router-link to="/shop-list" tag="div">店铺列表</router-link>
      <router-link to="/hot-circle" tag="div">热门商圈</router-link>
      <router-link to="/shop-search" tag="div">店铺搜索</router-link>
      <router-link to="/register-boot-page" tag="div">未注册引导页</router-link>
      <router-link to="/scan-code-list" tag="div">app扫码列表页</router-link>
      <router-link to="/my-card" tag="div">分享落地页</router-link>
      <router-link to="/my-card" tag="div">分享落地页</router-link>
    </div>
    <div class="box">
      <label>账号</label><input type="text" name="" placeholder="账号" v-model="inputName">
    </div>
    <div class="box">
      <label>密码</label><input type="text" name="" placeholder="密码" v-model="inputPass">
    </div>
    <button @click="login">登录</button>
  </div>
</template>

<script>
import Jsencrypt from 'api/encrypt'
import { setItem } from 'common'
export default {
  name: 'Home',
  data () {
    return {
      inputName: '15139470284',
      inputPass: '123456',
      title: ''
    }
  },
  methods: {
    login () {
      const url = 'login'
      const obj = {
        username: this.inputName,
        password: Jsencrypt(this.inputPass),
        grant_type: 'password',
        client_id: 'cgsapi',
        client_secret: 'secret'
      }
      this.$http(url, obj).then(res => {
        this.$t(res.message)
        if (res.code === this.$ok) {
          /* eslint-disable */
          const { token_type, access_token, phone, userId, nickname } = res.data
          const token = `${token_type} ${access_token}`
          setItem('token', token)
          setItem('account', phone)
          setItem('nickname', nickname)
          setItem('userId', userId)
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus">
  .tab-main
    display: flex
    flex-wrap: wrap
    margin-top: 20px
    >div
      width: 50%
      text-align: center
      line-height: 88px;/*px*/
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
      border: 1px solid #ccc;/*no*/
      padding-left: 10px
  button
    display: block
    margin: 0 auto
    width: 120px
    line-height: 68px;/*px*/
    font-size: 26px;/*px*/
    border: 1px solid #ccc;/*no*/
</style>
