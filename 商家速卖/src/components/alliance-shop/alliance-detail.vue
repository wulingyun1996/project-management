<template>
  <div class="shop-detail-container">
    <div class="shop-detail-wrapper">
      <div class="shop-desc">
        <div class="shop-pic">
          <img :src="shopInfo.shop_logo_path" alt="" v-if="shopInfo.shop_logo_path">
          <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
        </div>
        <h1 class="shop-title">
          {{ shopInfo.shop_name }}
        </h1>
      </div>
      <div class="shop-detail">
        <h1>所属圈子数：<span>{{ shopInfo.count }}</span></h1>
        <h1>服务城市：
            <span>{{ addr.province }}</span>
            <span>{{ addr.city }}</span>
            <span>{{ addr.area }}</span>
        </h1>
        <h1>加入时间：<span>{{ shopInfo.inTime }}</span></h1>
      </div>
    </div>
  </div>
</template>

<script>
import { loadData, STATUS_OK } from 'api/common'
export default {
  name: 'shopDetail',
  data () {
    return {
      shopId: this.$route.params.id,
      shopInfo: {},
      addr: {}
    }
  },
  created () {
    this.getShopDetail()
  },
  methods: {
    getShopDetail () {
      let url = 'group/getStoreDetail'
      let obj = {
        id: this.shopId
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.shopInfo = res.data
          this.addr = res.data.addr
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
.shop-detail-container
  height 100%
  .shop-detail-wrapper
    position relative
    height 60%
    background $color-white
    padding-top 48px
    padding-left 164px
  .shop-desc
    margin-bottom 48px
    width 400px
    .shop-pic
      height 300px
      margin-bottom 36px
      img
        width 100%
        height inherit
    .shop-title
      color $color-3
      text-align center
      line-height 44px
      font-size 32px;/*px*/
  .shop-detail
    color $color-6
    font-size 28px;/*px*/
    h1
      line-height 40px;/*px*/
      margin-bottom 16px
</style>
