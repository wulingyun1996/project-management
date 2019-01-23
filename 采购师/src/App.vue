<template>
  <div id="app">
    <keep-alive :include="include">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      include: [
        'UnregisterGuidePage',
        'SellerRights',
        'CgsHotGoods',
        'CgsFlashSale',
        'CgsRecommenShop',
        'CgsShopList',
        'AnnouncementDetail',
        'MyHoney',
        'MyActivity',
        'AllianceActivityStatistics',
        'AllianceStatisticsDetail',
        'BannerDetail',
        'ShopList',
        'ProductList',
        'HotCircle',
        'ShopDetail'
      ]
    }
  }
}
</script>
