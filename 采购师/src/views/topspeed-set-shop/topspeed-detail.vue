<template>
  <base-senior-popup width="100%" height="100%" ref="helpPopup" class="help-wrapper">
    <base-header></base-header>
    <base-scroll :has-more="true" :beforeScroll="true" @beforeScroll="beforeScroll">
      <img src="./images/icon-topspeed-bg.png" alt="" ref="img">
      <div class="conent">
        <div class="topspeed-title">
        付费无需审核 极速开店
        </div>
        <div class="topspeed-info">
          <h3>1.开店费用多少？</h3>
          <p>开店费用为2980元/年，自付款之日起一自然年为计算周期。 </p>
          <h3>2.如何付费？</h3>
          <p>商家申请开店后，跳转至付费页面后，点击立即付费，即可跳转至付费界面，目前系统支持支付宝及微信付费。</p>
          <h3>3.商家付费开店可以得到什么权益？</h3>
          <p>付费开店后可，商家可以得到如下权益：建材采购师将为商家推荐特约采购师、引入天猫、京东等电商流量、免费电商渠道市场推广、免费使用商圈、联盟活动功能、APP广告位免费推广1个月等。</p>
          <h3>4.是否可以开发票？如何开票？</h3>
          <p>付费90天后，建材采购师将向商家开发票；商家向建材采购师提供开票资料和收票地址，建材采购师开票后将按照收票地址寄送发票；发票为技术服务费，税点统一为6%。</p>
        </div>
      </div>
    </base-scroll>
  </base-senior-popup>
</template>

<script>
export default {
  data () {
    return {
      isBeforeScroll: true
    }
  },
  mounted () {
    this.$refs.helpPopup.show()
  },
  methods: {
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.img
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.help-wrapper
  overflow hidden
  >div
    flex-col()
  .scroll-container
    overflow hidden
    position relative
    img
      width 100%
    .conent
      width 90%
      height 900px
      position absolute
      top 10px
      left 50%
      transform translateX(-50%)
      .topspeed-title
        font-family: PingFangSC-Semibold
        font-size: 52px
        color: #FFFFFF
        letter-spacing: 0
        text-align: center
        line-height: 68px
        font-weight 700
        text-shadow: 0 10px 10px rgba(0,0,0,.2)
        margin-top 65px
      .topspeed-info
        width 100%
        margin-top 70px
        background-color #fff
        padding 40px 20px 40px 20px
        border-radius 20px
        h3
          font-family: PingFangSC-Medium
          font-size: 32px
          color: #FF8A00
          margin-top 30px
          letter-spacing: 0
        h3:first-child
          margin-top 0
        p
          font-family: PingFangSC-Regular
          font-size: 28px
          margin-top 10px
          color: #616161
          letter-spacing: 2px
          line-height: 44px
</style>
