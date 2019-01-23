<template>
  <div class="home">
    <div class="tab-main">
      <router-link to="/alliance-apply" tag="div">联盟商开通申请</router-link>
      <router-link to="/shop-apply" tag="div">商家开通申请</router-link>
      <router-link to="/alliance-shop-list" tag="div">联盟商圈内商家</router-link>
      <router-link to="/topspeed-set-shop" tag="div">极速开店</router-link>
      <router-link to="/alliance-staff-list" tag="div">联盟商员工列表</router-link>
      <router-link to="/shop-alliance-list" tag="div">商家圈子</router-link>
      <router-link to="/alliance-base-info" tag="div">联盟商基本信息</router-link>
      <router-link to="/shop-staff-list" tag="div">商家员工列表</router-link>
      <router-link to="/establish-activity" tag="div">联盟商建活动</router-link>
      <router-link to="/shop-activity-list" tag="div">商家查看活动列表</router-link>
      <router-link to="/shop-activity-list" tag="div">联盟活动</router-link>
      <router-link to="/shop-auditing" tag="div">开店审核中</router-link>
      <router-link to="/activity-enroll" tag="div">联盟商活动报名支付列表</router-link>
      <router-link to="/shop-no-pass" tag="div">店铺审核未通过</router-link>
      <router-link to="/alliance-activity-statistics" tag="div">商圈联盟活动统计主面板</router-link>
      <router-link to="/shop-closed" tag="div">店铺关闭</router-link>
      <router-link to="/alliance-statistics-detail" tag="div">商圈联盟活动统计详情</router-link>
      <router-link to="/alliance" tag="div">商家占位项</router-link>
      <router-link to="/delegate-list" tag="div">商圈联盟活动带单排行</router-link>
      <router-link to="/guidance-shop" tag="div">为开店引导</router-link>
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
