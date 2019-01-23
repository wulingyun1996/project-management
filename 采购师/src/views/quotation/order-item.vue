<template>
  <div class="item">
    <div class="good-info" v-if="item.goodsInfo" v-for="(good, goodIndex) in item.goodsInfo" :key="goodIndex">
      <div class="good-info-main" style="margin-bottom: 8px;" @click="$router.push({path: '/goods-detail', query: {goodsId: good.goods_id}})">
        <div class="good-info-header">
          <div
            class="goods-pic"
            :class="{
                      'bg-flash': good.goods_type === 1,
                      'bg-hot': good.goods_type === 2
                    }">
            <i class="label-flash" v-show="good.goods_type === 1"></i>
            <i class="label-hot" v-show="good.goods_type === 2"></i>
            <img :src="good.goods_img" alt="">
          </div>
          <div class="right">
            <h2 class="goods-title">
              <span class="label-hot" v-show="good.goods_type === 2">【爆款】</span>
              <span class="label-flash" v-show="good.goods_type === 1">【限时购】</span>
              {{ good.goods_name }}
            </h2>
            <div class="goods-category">
              <span class="new-goods" v-show="good.is_stock_good">现货</span>
              <span class="best-goods" v-show="good.boutique">精品馆</span>
              <span class="meterial-goods" v-show="good.material">材料馆</span>
              <span class="buy-tips">{{ good.goods_type === 1 ? '限购' + good.buy_number + good.kinds[0].goods_unit : good.buy_number + good.kinds[0].goods_unit + '起批' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="good-name" v-for="(kind, kindIndex) in good.kinds" :key="kindIndex" style="margin-bottom: 5px;">
        <div class="goods-detail">
          <h2 class="order-item-name">
            {{ kind.title ? kind.title : '默认' }}
          </h2>
          <div class="order-item-price">
            <!-- 限时 -->
            <p class="price" v-show="good.goods_type === 1"><span>￥{{ kind.price | retainTwoDecimal }}</span>/{{ kind.goods_unit }}</p>
            <!-- 非限时 - 规格报价 -->
            <p class="price" v-show="good.goods_type !== 1 && good.price_type === 0"><span>￥{{ kind.promotion_price | retainTwoDecimal }}</span>/{{ kind.goods_unit }}</p>
            <!-- 非限时 - 区间报价暂不考虑 -->
            <p class="saved-money" v-show="good.goods_type !== 1">省 <span>￥{{ kind | getSavedMoney }}</span></p>
          </div>
          <!-- <div class="bottom">
            <div>
              <span v-if="good.goods_type === 1">￥{{formatPrice(kind.price)}}<span>/{{kind.goods_unit}}</span></span>
              <span v-if="good.goods_type !== 1 && good.price_type === 0">￥{{kind.svip_price ? formatPrice(kind.svip_price) : formatPrice(kind.purchase_price)}}<span>/{{kind.goods_unit}}</span></span>
              <span v-if="good.goods_type !== 1 && good.price_type === 1">
               ￥{{kind.svip_price ? formatPrice(retulstSvipPrice(resultPrice(totalNum(good.kinds), good.intervalPrice, kind, kind.checked).purchase_price, kind.promotion_price, kind.one_discount)) : formatPrice(resultPrice(totalNum(good.kinds), good.intervalPrice, kind, kind.checked).purchase_price)}}<span>/{{kind.goods_unit}}</span>
              </span>
            </div>
            <div style="display: flex">
              <span @click="reduce(kind)"><span :class="kind.count === 1 ? '' : 'active'">-</span></span>
              <input type="number" v-model="kind.count" @blur="valid(kind, good)">
              <span @click="add(good, kind)"><span class="active">+</span></span>
            </div>
          </div> -->
        </div>
        <span class="goods-number">X {{ kind.count }}</span>
      </div>
    </div>
    <div class='order-statistics'>
      <div class="order-total-price">
        <p class="description">
          <b>商品金额</b>
          <span>共{{ total.totalKinds }}种{{ total.totalNumber }}件</span>
        </p>
        <p class="price">
          <i class="price-int">￥{{ total.totalPrice | getPriceInt }}</i><i class="price-zero">.{{ total.totalPrice | getPriceZero }}</i>
        </p>
      </div>
      <div class="order-saved-money" v-show="total.hasNotFlashGoods">
        <p class="description">
          <span>自购省</span>
        </p>
        <p class="price">
          <i class="price-int">-￥{{ total.totalSavedMoney | retainTwoDecimal }}</i>
        </p>
      </div>
      <div class="order-freight">
        <p class="description">
          <span>运费</span>
        </p>
        <p class="price">
          <i class="price-int">{{ total.freight }}</i>
        </p>
      </div>
      <div class="order-pay-price">
        <p class="description">
          <b>支付金额</b>
        </p>
        <p class="price">
          <i class="price-int">￥{{ total.payMoney | getPriceInt }}</i><i class="price-zero">.{{ total.payMoney | getPriceZero }}</i>
        </p>
      </div>
      <!-- <div class="order-total-price">
        <div class='price-info'>
          <span>商品金额 </span>
          <span>共{{ total.totalKinds }}种{{ total.totalNumber }}件</span>
        </div>
        <span>￥{{formatPrice(total.totalPrice).split('.')[0]}}<span>.{{formatPrice(total.totalPrice).split('.')[1]}}</span></span>
      </div>
      <div class="order-freight">
        <span>运费</span>
        <span>+￥ 0.00</span>
      </div>
      <div class="order-pay-price">
        <span>支付金额</span>
        <span>￥{{formatPrice(total.totalPrice).split('.')[0]}}<span>.{{formatPrice(total.totalPrice).split('.')[1]}}</span></span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { retainTwoDecimal } from 'common'
import { formatCommission, formatPrice, resultPrice, totalNum, solove } from './mixins'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    valid (kind, good) {
      this.$emit('valid', kind, good)
    },
    add (good, kind) {
      if (good.goods_type === 1) {
        if (kind.count === good.buy_number) {
          this.$t(`限购${good.buy_number}${kind.goods_unit}`)
          return
        }
      }
      this.$emit('add', kind)
    },
    solove (arg1, arg2) {
      return solove(arg1, arg2, '*')
    },
    retulstSvipPrice (purchasePrice, promotionPrice, oneDiscount) {
      return solove(purchasePrice, formatCommission(solove(solove(promotionPrice, purchasePrice, '-'), oneDiscount, '*')), '-')
    },
    reduce (kind) {
      this.$emit('reduce', kind)
    },
    formatPrice (num) {
      return formatPrice(num)
    },
    formatCommission (num) {
      return formatCommission(num)
    },
    resultPrice (count, arr) {
      return resultPrice(count, arr)
    },
    totalNum (arr) {
      return totalNum(arr, false)
    }
  },
  computed: {
    total () {
      let price = 0
      let number = 0
      let commission = 0
      let kind = 0
      let payMoney = 0
      let hasNotFlashGoods = false
      let orderNumber = 0
      let freight = ''
      orderNumber = this.item.goodsInfo.length
      freight = orderNumber > 1 ? '不含运费' : this.item.freight
      // 用来控制显示运费
      // 如果订单商品有多个 不含运费
      // 如果是单个商品 显示该商品 运费
      // 如果商家修改了订单运费 。 显示该订单运费
      // 如果商家发货为自提 那么显示自提
      if (orderNumber > 0) {
        this.item.goodsInfo.map(j => {
          j.kinds.map(k => {
            if (j.goods_type === 1) {
              price = solove(price, solove(k.count, k.price, '*'), '+')
              commission += 0
            } else {
              hasNotFlashGoods = true
              if (j.price_type === 0) {
                if (k.svip_price) {
                  price = solove(price, solove(k.count, k.svip_price, '*'), '+')
                } else {
                  price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                  commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                }
              } else {
                let total = totalNum(j.kinds)
                let item = resultPrice(total, j.intervalPrice, k)
                if (k.svip_price) {
                  let tempPrice = formatCommission(solove(item.purchase_price, solove(solove(item.promotion_price, item.purchase_price, '-'), k.one_discount, '+'), '-'))
                  price = solove(price, solove(k.count, tempPrice, '*'), '+')
                } else {
                  price = solove(price, solove(k.count, item.purchase_price, '*'), '+')
                }
              }
            }
            kind++
            number += k.count
          })
        })
      }
      payMoney = price - commission
      return {
        totalPrice: price,
        totalNumber: number,
        totalSavedMoney: commission,
        totalKinds: kind,
        hasNotFlashGoods,
        payMoney,
        orderNumber,
        freight
      }
    }
  },
  filters: {
    retainTwoDecimal,
    getSavedMoney (kind) {
      /* eslint-disable */
      let { count, promotion_price, purchase_price } = kind
      let res = (promotion_price - purchase_price) * count
      return retainTwoDecimal(res)
      /* eslint-enable */
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.item
  border-bottom 10px solid #F5F5F5
  background: #FFF
  .shop-info
    display flex
    align-items center
    padding 30px 20px 30px 26px
    border-bottom 1px solid #DEDEDE;/*no*/
    img:nth-last-of-type(2)
      width 40px
      height 34px
    img:last-of-type
      width 14px
      height 26px
      transform rotate(180deg)
      margin-left 12px
    span
      color #000
      font-size 28px
      margin-left 16px
      line-height 40px
  .good-info
    padding 16px 24px 12px 26px
    .good-name,
    .good-info-main
      display flex
      align-items center
      .good-info-header
        position relative
        flex 1
        display flex
        height 140px
        .goods-label-hot
          position absolute
          top 0
          left 0
          img
            width 50px
            height 20px
        .goods-label-flash
          position absolute
          top 0
          left 0
          img
            width 50px
            height 20px
.good-info-header
  .goods-pic
    wh(140px)
    position relative
    border-radius(4px)
    &.bg-hot
      padding 1px;/*no*/
      bg('bg-hot.png')
    &.bg-flash
      padding 1px;/*no*/
      bg('bg-flash.png')
    img
      wh(100%)
    .label-hot,
    .label-flash
      position absolute
      width 72px
      height 26px
      left 0
      top 0
    .label-hot
      bg('label-hot.png')
    .label-flash
      bg('label-flash.png')
  .right
    flex 1
    margin-left 22px
    .goods-title
      f14()
      color $color-0
      text-over(2)
      line-height 40px
      .label-hot
        color $color-red
      .label-flash
        color $color-orange
      img
        width 80px
        height 36px
        vertical-align middle
    .goods-category
      flex-f-align()
      margin-bottom 16px
      span
        f10()
        border-radius(4px)
        padding 6px
        padding-top 7px
        & + span
          margin-left 8px
        &.new-goods
          color #F47575
          background rgba(244, 117, 117, .1)
        &.best-goods
          color $color-orange
          background rgba(255, 138, 0, .1)
        &.meterial-goods
          color #6DACF6
          background rgba(109, 172, 246, .1)
        &.buy-tips
          color $color-3
.order-statistics
  > div
    padding 20px 22px 38px 46px
    flex-align-item()
    bd-t(#F2F2F2)
    .description
      f11()
      color #9C9C9C
      b
        color $color-3
        f14()
        font-weight 700
        margin-right 14px
    .price
      i
        font-style normal
  .order-total-price
    border none
    .price-int
      f16()
    .price-zero
      f14()
  .order-saved-money
    i
      color $color-orange
  .order-freight
    i
      color $color-9
  .order-pay-price
    i
      color $color-orange
    .price-int
      f16()
    .price-zero
      f14()
.good-name
  padding 10px 24px 10px 30px
  background #F4F4F4
  .goods-detail
    flex 1
    .order-item-name
      color $color-0
      f14()
      font-weight 700
      line-height 40px
      margin-bottom 20px
    .order-item-price
      flex-f-align()
      p
        color $color-0
        f12()
      span
        color $color-orange
      .price
        margin-right 30px
        span
          f14()
    .bottom
      display flex
      justify-content space-between
      align-items center
      div:first-child
        font-size 24px
        color #000
        >span
          color #FF8A00
          font-size 28px
      div:last-child>span
        display flex
        justify-content center
        align-items center
        border 1px solid #CCC;/*no*/
        height 45px
        width 45px
        text-align center
        color #CCC
        font-size 30px
      div:last-child>input
        font-size 14px
        border 1px solid #CCC;/*no*/
        border-left none
        border-right none
        color #000
        width 72px
        height 45px
        color #000
        text-align center
        font-size 30px
      div:last-child>span>span.active
        color #000
  .goods-number
    font-weight 700
    f14()
    color $color-3
</style>
