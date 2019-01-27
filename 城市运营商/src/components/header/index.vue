<template>
  <el-header>
    <div class="logo-wrapper">
      <div class="logo-icon">
        <img src="./images/logo.png">
      </div>
      <div class="logo-text">神采家居建材 城市运营商管理中心</div>
    </div>
    <div class="header-nav">
      <ul>
        <li>
          <router-link to="/dashboard" tag="a">
            <svg-icon icon-class="home"></svg-icon>
            首页
          </router-link>
        </li>
        <li v-if="judgePlatform">
          <a href="javascript:" @click="goManagePlatform">
            <svg-icon iconClass="mes"></svg-icon>
            返回运营平台
          </a>
        </li>
        <li>
          <el-dropdown class="" trigger="click" @command="goAccount">
            <a href="#" class="">
              <svg-icon iconClass="account"></svg-icon>账号信息
              <i class="el-icon-caret-bottom"></i>
            </a>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <el-dropdown-item :command="0">
                <span style="display:block;">账户信息</span>
              </el-dropdown-item>
              <el-dropdown-item divided :command="1">
                <span style="display:block;">修改密码</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <a href="javascript:" @click="logout">
            <svg-icon icon-class="logout"></svg-icon>
            退出系统
          </a>
        </li>
      </ul>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex'
const isDev = process.env.NODE_ENV !== 'production'
const baseUrl = isDev ? 'http://test-op.cgs18.com/#views/home' : 'http://op.cgs18.com/#views/home'
export default {
  computed: {
    ...mapGetters(['judgePlatform'])
  },
  methods: {
    // 返回运营平台
    goManagePlatform () {
      window.location.href = baseUrl
    },
    goAccount (command) {
      if (!command) {
        this.goAccountInfo()
        return
      }
      this.goModifyPassword()
    },
    // 账户信息
    goAccountInfo () {
      this.$router.replace({ name: 'ModifyPassword', query: { type: 1 }})
    },
    // 修改密码
    goModifyPassword () {
      this.$router.replace({ name: 'ModifyPassword', query: { type: 2 }})
    },
    logout () {
      this.removeToken()
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.el-header
  height 80px!important
  f12()
  background-color $color-f6
  color $color-3
  flex-align-item()
  bd-b($color-de, 2px)
  .logo-wrapper
    flex-align-item()
    .logo-icon
      margin-left 27px
      margin-right 34px
    .logo-text
      f24()
      border-left 1px solid $color-c
      padding-left 35px
  .header-nav
    ul
      flex-align-item()
    li
      a
        line-height 20px
        color $color-3
        f16()
        .svg-icon
          margin-right 10px
      & + li
        margin-left 45px
.avatar-container
  height 50px
  display inline-block
  .avatar-wrapper
    cursor pointer
    margin-top 5px
    position relative
    .user-avatar
      width 40px
      height 40px
      border-radius 10px
    .el-icon-caret-bottom
      position absolute
      right -20px
      top 25px
      font-size 12px
</style>
