<template>
  <div class="shop-success-container">
    <base-header
      :is-show-back="false"
      :intercept-close="false"
      :is-show-close="true"
      @headerClose="goHome">
    </base-header>
    <div class="shop-success-wrapper" :class="{ active: $isX }">
      <div class="shop-success-top">
        <img src="./images/icon-success.png" alt="">
        <p>恭喜您已成功开店</p>
        <p>赠送您一份会员商家大礼包</p>
        <p>下载商家速卖APP即可领取</p>
      </div>
      <div class="shop-success-center">
        <div class="gift">三重好礼</div>
        <div class="content">
          <p>一 . 价值<span>6000</span>元，APP首页广告位<span>3天</span></p>
          <p>二 . 价值<span>6000</span>元，优选好店推荐位<span>3天</span></p>
          <p>三 . 价值<span>6000</span>元，爆款商品推荐位<span>3天</span></p>
        </div>
      </div>
      <div class="shop-success-bottom">
        <div class="shop-success-button" @click="downLode">下载商家速卖APP</div>
        <p>请您尽快下载APP完善店铺资料,</p>
        <p>发布商品开始赚钱吧!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopAuditing',
  methods: {
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
.shop-success-container
  height 100%
  overflow hidden
  flex-col()
  background #fff
  .shop-success-wrapper
    flex 1
    flex-col-btw()
    bg('bg-shop.png')
    &.active
      bg('bg-x-shop.png')
    .shop-success-top
      margin-bottom 108px
      img
        display block
        margin 32px auto 20px
        wh(160px)
      p:nth-of-type(1)
        f16()
        tc()
        font-weight 700
        margin-bottom 48px
        color #FF9933
        text-align center
      p:nth-of-type(2)
        margin-bottom 24px
        tc()
        f14()
        color #F7675D
        margin-bottom 22px
      p:nth-of-type(3)
        tc()
        f12()
        color #999999
    .shop-success-center
      height 414px
      margin-bottom 94px
      padding 34px 30px 0
      position relative
      .content
        width 100%
        height 100%
        bg('gift-bg.png')
        padding-top 108px
        p
          margin-bottom 48px
          f16()
          color #FFFFFF
          tc()
          span
            f16()
            color #FFFBC4;
            tc()
      .gift
        width 260px
        height 74px
        line-height 74px
        bg('gift-icon.png')
        margin 0 auto
        f18()
        color #8B572A
        tc()
        position absolute
        top 0
        left 50%
        transform translate(-50%)
    .shop-success-bottom
      tc()
      margin-bottom 64px
      .shop-success-button
        width 356px
        height 80px
        margin 0 auto
        border-radius(100px)
        line-height 80px
        background #FDF8B6
        f16()
        margin-bottom 32px
        color #EA8621
      p
        f12()
        color #FFFFFF
        tc()
        line-height 33px
</style>
