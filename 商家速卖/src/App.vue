<template>
  <div id="app">
    <keep-alive :include="include">
      <router-view v-wechat-title='$route.meta.title'></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data () {
    return {
      include: [
        'orderList',
        'shopManage',
        'specialCard',
        'wangToBuy',
        'myBuy',
        'comment',
        'account',
        'checkIn',
        'managerManagement',
        'allianceShopList',
        'allianceShopDetail',
        'shopActivityList',
        'CgsManage',
        'SpecialAuthen',
        'Announcement',
        'ShopApply',
        'AllianceActivityStatistics',
        'AllianceStatisticsDetail',
        'BoutiqueList',
        'materialsList'
      ]
    }
  }
}
</script>
