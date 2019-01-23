<template>
  <div class="exchange-success-container">
    <base-header :interceptBack='true' @headerBack="goBack">
      <div class="blue" @click="gotoExchange">兑换记录</div>
    </base-header>
    <div class="exchange-info">
      <p>恭喜您，兑换成功！</p>
      <p>商家会在一个工作日内联系您，您也</p>
      <p>可以主动联系商家哦~</p>
      <p @click="callPhone">
        <img src="./images/touchphone.png" alt="">
        联系卖家</p>
      <p @click="gotoMyhoney">继续兑换</p>
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'native'
// import { mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    honeyNumber () {
      return this.$route.query.number
    }
  },
  methods: {
    gotoMyhoney () {
      // this.setSortHrader(false)
      this.$router.push({ name: 'MyHoney', query: { fromNative: 1 } })
    },
    callPhone () {
      invokeNativeMethod('invokeTel', this.$route.query.moobile)
    },
    gotoExchange () {
      this.$router.push({ name: 'exchangeRecord', query: { path: '/my-honey?fromNative=1' } })
    },
    goBack () {
      // this.setSortHrader(false)
      this.$router.push({ path: '/my-honey', query: { fromNative: 1 } })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.exchange-success-container
  .blue
    font-family: PingFangSC-Regular
    font-size: 28px
    color: #4A90E2
    letter-spacing: 0
    text-align: center
  .exchange-info
    text-align center
    p:first-child
      font-family: PingFangSC-Medium
      font-size: 40px
      color: #D0021B
      letter-spacing: 0
      text-align: center
      margin-top 120px
    p:nth-child(2)
      font-family: PingFangSC-Regular
      font-size: 30px
      color: #999999
      letter-spacing: 0
      margin-top 36px
      text-align: center
    p:nth-child(3)
      font-family: PingFangSC-Regular
      font-size: 30px
      margin-top 20px
      color: #999999
      letter-spacing: 0
      text-align: center
    p:nth-child(4)
      width 440px
      height 80px
      bd(#FF8A00)
      border-radius 16px
      margin-left 50%
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #FF8A00
      margin-top 80px
      line-height 80px
      transform translateX(-220px)
      position relative
      img
        width 34px
        height 34px
        position absolute
        top 51%
        margin-top -17px
        margin-left -45px
    p:last-child
      width 440px
      height 80px
      bd(#FF8A00)
      border-radius 16px
      margin-left 50%
      background: #FF8A00;
      margin-top 30px
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #FFFFFF
      line-height 80px
      transform translateX(-220px)
</style>
