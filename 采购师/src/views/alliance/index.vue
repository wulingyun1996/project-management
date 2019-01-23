<template>
  <div class="home">
    <div class="tab-main">
      <router-link to="/unionActivities" tag="div">联盟活动</router-link>
      <router-link to="/my-activity" tag="div">我的活动</router-link>
      <router-link to="/hotActivities" tag="div">热门活动</router-link>
      <router-link to="/alliance-activity-statistics" tag="div">联盟活动推广统计主面板</router-link>
      <router-link to="/alliance-statistics-detail" tag="div">联盟活动推广统计详情</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alliance'
  //
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
