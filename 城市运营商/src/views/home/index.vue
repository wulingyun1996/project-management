<template>
  <div class="home-container">
    <div class="home-header">
      <base-header></base-header>
    </div>
    <div class="home-body">
      <base-sider-bar class="sider-bar" :shouldFoldSiderBar="shouldFoldSiderBar"></base-sider-bar>
      <base-main-body class="main-body" @toggleSiderBar="toggleSiderBar"></base-main-body>
    </div>
  </div>
</template>

<script>
import BaseHeader from 'components/header'
import BaseSiderBar from 'components/sider-bar'
import BaseMainBody from 'components/main-body'
export default {
  data () {
    return {
      shouldFoldSiderBar: false
    }
  },
  methods: {
    toggleSiderBar (payload) {
      this.shouldFoldSiderBar = payload
    }
  },
  components: {
    BaseHeader,
    BaseSiderBar,
    BaseMainBody
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.home-container
  width 100%
  height 100%
  flex-col()
  .home-header
    //
  .home-body
    flex 1
    flex-f()
    .sider-bar
      //
    .main-body
      flex 1
</style>
