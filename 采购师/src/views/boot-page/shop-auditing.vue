<template>
  <div class="shop-auditing-container">
    <base-header
      :is-show-back="false"
      :intercept-close="false"
      :is-show-close="true"
      @headerClose="goHome">
    </base-header>
    <div class="shop-auditing-wrapper" :class="{ active: $isX }">
      <div class="shop-auditing-top">
        <img src="./images/icon-auditing.png" alt="">
        <p>感谢您提交入驻申请！</p>
        <p>平台正在快马加鞭审核中，请您耐心等待~</p>
        <p>审核时间预计1个工作日</p>
      </div>
      <div class="shop-auditing-center">
        <div class="item">
          <img src="./images/icon-data.png" alt="">
          <p>经营数据</p>
          <p>一手掌握</p>
        </div>
        <div class="item">
          <img src="./images/icon-deal.png" alt="">
          <p>商品交易</p>
          <p>一目了然</p>
        </div>
        <div class="item">
          <img src="./images/icon-market.png" alt="">
          <p>多种营销方式</p>
          <p>任你选择</p>
        </div>
        <div class="item">
          <img src="./images/icon-buyer.png" alt="">
          <p>10W+采购师</p>
          <p>买家等着您</p>
        </div>
      </div>
      <div class="shop-auditing-bottom">
        <div class="shop-auditing-button" @click="goFastApplyShop">极速开店-无需审核</div>
        <div class="shop-auditing-button" @click="downLode">下载商家速卖APP</div>
        <p>查看审核结果</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopAuditing',
  methods: {
    goFastApplyShop () {
      this.$router.push('/topspeed-set-shop')
    },
    downLode () {
      this.$router.push('/seller-download')
    },
    goHome () {
      this.$router.push('/register-boot-page')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.shop-auditing-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .shop-auditing-wrapper
    flex 1
    flex-col-btw()
    bg('bg-shop.png')
    &.active
      bg('bg-x-shop.png')
    .shop-auditing-top
      margin-bottom 80px
      img
        display block
        margin 32px auto 36px
        width 170px
        height 164px
      p:nth-of-type(1)
        f16()
        tc()
        font-weight 700
        margin-bottom 22px
        color #FF9933
        text-align center
      p:nth-of-type(2)
        margin-bottom 24px
        tc()
        f12()
        color #666666
      p:nth-of-type(3)
        tc()
        f14()
        color #F74F4F
    .shop-auditing-center
      margin-bottom 40px
      padding 0 65px
      display flex
      flex-wrap wrap
      justify-content space-between
      align-content space-between
      .item
        width 280px
        height 200px
        background rgba(255,253,228,0.16)
        border-radius(16px)
        padding 24px 0
        display flex
        flex-direction column
        justify-content space-between
        img
          wh(80px)
          display block
          margin 0 auto
        p
          f12()
          color #FFFFFF
          tc()
      .item:nth-of-type(1),
      .item:nth-of-type(2)
        margin-bottom 30px
    .shop-auditing-bottom
      tc()
      margin-bottom 64px
      .shop-auditing-button:nth-of-type(1)
        width 356px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        background #FDF8B6
        f16()
        margin-bottom 20px
        color #EA8621
      .shop-auditing-button:nth-of-type(2)
        bd(#FDF8B6)
        border-radius(38px)
        width 356px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        f16()
        color #FDF8B6
        margin-bottom 32px
      p
        f12()
        color #FFFFFF
        tc()
        line-height 24px
</style>
