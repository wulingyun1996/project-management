<template>
  <div class="home">
    <div class="tab-main">
      <router-link to="/honey-details" tag="div">蜂蜜明细</router-link>
      <router-link to="/exchange-record" tag="div">兑换记录</router-link>
      <router-link to="/my-honey" tag="div">我的蜂蜜</router-link>
      <router-link to="/shop-details" tag="div">商品详情</router-link>
      <router-link to="/exchange-success" tag="div">兑换成功</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Honey'
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
</style>
