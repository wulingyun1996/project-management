<template>
  <div class="amount">
    <div class="check-img" @click="checkAll">
      <img v-if="hasSelect" :src="isCheckAll ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
    </div>
    <span class="check-all" v-if="hasSelect">全选</span>
    <span class="total-number">共{{ totalKinds }}种{{ totalNumber }}件,不含运费</span>
    <div class="price">
      <div class="total-price">
        {{ title }}：<span>￥{{ formatPrice(totalPrice).split('.')[0] }}.</span><span>{{ formatPrice(totalPrice).split('.')[1] }}</span>
      </div>
      <div class="total-commission">
        分享赚：<span>￥{{ formatPrice(totalCommission).split('.')[0] }}.</span><span>{{ formatPrice(totalCommission).split('.')[1]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasSelect: {
      type: Boolean,
      default: true
    },
    isCheckAll: {
      type: Boolean,
      default: false
    },
    totalKinds: {
      type: Number,
      default: 0
    },
    totalNumber: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    totalCommission: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '自购合计'
    }
  },
  mounted () {
  },
  methods: {
    formatNumber (num) {
      return num * 1000000 / 1000000
    },
    checkAll () {
      this.$emit('checkAll')
    },
    formatPrice (num) {
      num = num + ''
      if (num.indexOf('.') !== -1) {
        if (num.split('.')[1].length !== 2) {
          num = num + '0'
        }
        return num
      } else {
        num = num + '.00'
        return num
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.amount
  height 118px
  display flex
  align-items center
  padding-right 18px
  background #FFF
  .check-img
    height 118px
    padding-left 38px
    padding-right 15px
    display flex
    align-items center
  img
    width 30px
    height 30px
  span.check-all
    f12()
    color #333333
  span.total-number
    f11()
    color #9B9B9B
    margin-left 26px
  .price
    flex 1
    text-align right
.total-price
  color #4A4A4A
  f13()
  line-height 32px
  span
    color #FF8A00
  span:first-child
    f14()
  span:last-child
    f11()
.total-commission
  margin-top 4px
  line-height 32px
  color #D0021B
  f13()
</style>
