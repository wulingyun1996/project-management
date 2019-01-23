<template>
  <div class="home">
    <div class="tab-main">
      <router-link to="/honey-management" tag="div">蜂蜜管理</router-link>
      <router-link to="/honey-manage" tag="div">蜂蜜商品列表</router-link>
      <router-link to="/exchange-record" tag="div">兑换记录</router-link>
      <router-link to="/honey-detail" tag="div">蜂蜜明细</router-link>
      <router-link to="/honey-edit" tag="div">添加/编辑蜂蜜商品</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    //
  }
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
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
    border: 1px solid $color-border;/*no*/
    padding-left: 10px
button
  display: block
  margin: 0 auto
  width: 120px
  line-height: 68px;/*px*/
  font-size: 26px;/*px*/
  border: 1px solid $color-border;/*no*/
</style>
