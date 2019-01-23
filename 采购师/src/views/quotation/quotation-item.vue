<template>
  <div class="item" :class="{'border-top5': index === 0}">
    <div class="shop-info">
      <div class="img" @click.stop="selectShop(item)">
        <img v-if="hasSelect" :src="item.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
      </div>
      <div class="right" @click="goShopDetail(item.seller_id)">
        <img src="./images/business.png" alt="">
        <span>{{ item.shopName }}</span>
        <img src="./images/arrow_left.png" alt="">
      </div>
    </div>
    <div class="good-info" v-if="item.goodsInfo" v-for="(good, goodIndex) in item.goodsInfo" :key="goodIndex">
      <div class="good-name" style="margin-bottom: 8px;">
        <div class="img" @click.stop="selectGood(good)">
          <img v-if="hasSelect" :src="good.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
        </div>
        <div class="good-info-header" @click="goGoodsDetail(good.goods_id)">
          <img class="goods-label-flash" v-show="good.goods_type === 1" src="./images/limit-icon.png" alt="">
          <img class="goods-label-hot" v-show="good.goods_type === 2" src="./images/hot-icon.png" alt="">
          <img :src="good.goods_img" alt="">
          <div class="right">
            <h2 class="good-title">
              {{ good.goods_name }}
            </h2>
            <div class="good-type" style="margin-top: 8px;">
              <span v-if="good.is_stock_good === 1" class="first">现货</span>
              <span v-if="good.boutique === 1" class="boutique">精品馆</span>
              <span v-if="good.material === 1" class="material">材料馆</span>
              <span :class="good.goods_type === 1 ? 'second' : 'third'">
                {{ good.goods_type === 1 ? `限购${good.buy_number} ${good.kinds[0].goods_unit}` : `${good.buy_number}${good.kinds[0].goods_unit}起批` }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="good-name" v-for="(kind, kindIndex) in good.kinds" :key="kindIndex" style="margin-bottom: 5px;">
        <div class="img" @click.stop="selectKind(kind, good.kinds, good)">
          <img v-if="hasSelect" :src="kind.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
        </div>
        <div class="good-detail">
          <div class="left">
            <h2>{{ kind.title ? kind.title : '默认' }}</h2>
            <!-- 限时 -->
            <div class="price-detail" v-show="good.goods_type === 1">
              <p class="price">
                <b>￥{{ kind.price | getPriceInt }}</b><span>.{{ kind.price | getPriceZero }}</span>/{{ kind.goods_unit }}
              </p>
              <p class="saved-money">赚 ￥0.00</p>
            </div>
            <!-- 非限时 - 常规 -->
            <div class="price-detail" v-show="good.goods_type !== 1 && good.price_type === 0">
              <p class="price">
                <b>￥{{ kind.promotion_price | getPriceInt }}</b><span>.{{ kind.promotion_price | getPriceZero }}</span>/{{ kind.goods_unit }}
              </p>
              <p class="saved-money">赚 ￥{{ getSavedMoney(kind) }}</p>
            </div>
            <!-- 非限时 - 区间 -->
            <!-- <div class="price-detail" v-show="good.goods_type !== 1 && good.price_type === 1">
              <p class="price">
                <b>￥{{ kind.max_price | getPriceInt }}</b><span>.{{ kind.max_price | getPriceZero }}</span>/{{ kind.goods_unit }}
              </p>
              <p class="saved-money">赚 ￥{{ getSavedMoney(kind) }}</p>
            </div> -->
          </div>
          <div class="right">
            <span @click.stop="reduce(kind, goodIndex, kindIndex)"><span :class="kind.count === 1 ? '' : 'active'">-</span></span>
            <input v-model="kind.count" type="text" @blur="valid(kind, good)">
            <span @click.stop="add(good, kind, goodIndex, kindIndex)"><span class="active">+</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="quotation-item-statistics">
      <div class="number-price-statistics">
        <b>共{{ total.totalKinds }}种{{ total.totalNumber }}件</b>
        <span class="price-int">￥{{ total.totalPrice | getPriceInt }}</span><span class="price-zero">.{{ total.totalPrice | getPriceZero }}</span>
      </div>
      <div class="saved-money-statistics">
        赚: ￥{{ total.totalCommission | retainTwoDecimal }}
      </div>
    </div>
  </div>
</template>

<script>
import { retainTwoDecimal } from 'common'
import { formatCommission, formatPrice, resultPrice, totalNum, solove } from './mixins'
export default {
  props: {
    goodsArr: {
      type: Array,
      default: function () {
        return {}
      }
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hasSelect: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      max: '',
      goods: [],
      count: 0
    }
  },
  created () {
    this.inverse()
  },
  methods: {
    getSavedMoney (kind) {
      /* eslint-disable */
      let { count, promotion_price, purchase_price } = kind
      let res = (promotion_price - purchase_price) * count
      return retainTwoDecimal(res)
      /* eslint-enable */
    },
    valid (kind, good) {
      this.$emit('valid', kind, good)
    },
    selectShop () {
      this.$emit('selectShop', this.item)
    },
    selectGood (good) {
      this.$emit('selectGood', good, this.item)
    },
    selectKind (kind, kinds, good) {
      this.$emit('selectKind', kind, kinds, good, this.item)
    },
    add (good, kind, goodIndex, kindIndex) {
      if (good.goods_type === 1) {
        if (kind.count === good.buy_number) {
          this.$t(`限购${good.buy_number}${kind.goods_unit}`)
          return
        }
      }
      this.$emit('add', kind, this.index, goodIndex, kindIndex)
    },
    reduce (kind, goodIndex, kindIndex) {
      this.$emit('reduce', kind, this.index, goodIndex, kindIndex)
    },
    retulstSvipPrice (purchasePrice, promotionPrice, oneDiscount) {
      return solove(purchasePrice, formatCommission(solove(solove(promotionPrice, purchasePrice, '-'), oneDiscount, '*')), '-')
    },
    jump () {
      this.$emit('jump', this.item)
    },
    formatPrice (num) {
      return formatPrice(num)
    },
    formatCommission (num) {
      return formatCommission(num)
    },
    // 返回对应区间的价格
    resultPrice (count, arr, k, flag) {
      return resultPrice(count, arr, k, flag)
    },
    totalNum (arr) {
      return totalNum(arr, this.hasSelect)
    },
    goShopDetail (id) {
      this.$push({ path: '/shop-detail', query: { id, fromGoodsDetail: 1 } })
    },
    goGoodsDetail (goodsId) {
      this.$push({ path: '/goods-detail', query: { goodsId } })
    },
    // 实现反选功能
    inverse () {
      let arrUpdatedTime = []
      this.goodsArr.forEach(item => {
        item.goodsInfo.forEach(item => {
          arrUpdatedTime.push(new Date(item.updated_at.split(' ')[0]).getTime())
        })
      })
      this.max = Math.max.apply(null, arrUpdatedTime)
      this.goodsArr.forEach(item => {
        this.goods = item.goodsInfo.filter(value => {
          return this.max < new Date(value.updated_at).getTime()
        })
        this.goods.forEach(item => {
          if (+new Date() - this.max > 1 * 24 * 3600 * 1000) {
            item.checked = false
            item.kinds[0].checked = false
          } else {
            item.checked = true
            item.kinds[0].checked = true
          }
        })
        item.goodsInfo.forEach(value => {
          if (value.checked) {
            this.count = this.count + 1
          }
        })
        if (this.count === item.goodsInfo.length) {
          item.checked = true
          this.count = 0
        } else {
          item.checked = false
        }
      })
    }
  },
  computed: {
    total () {
      let price = 0
      let number = 0
      let kinds = 0
      let commission = 0
      let payMoney = 0
      if (this.item.goodsInfo.length > 0) {
        this.item.goodsInfo.map(j => {
          j.kinds.map(k => {
            if (this.hasSelect) {
              if (k.checked) {
                if (j.goods_type === 1) {
                  price = solove(price, solove(k.count, k.price, '*'), '+')
                  commission += 0
                } else {
                  if (j.price_type === 0) {
                    if (k.svip_price) {
                      price = solove(price, solove(k.count, k.svip_price, '*'), '+')
                      commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                    } else {
                      price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                      commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                    }
                  } else {
                    let total = totalNum(j.kinds)
                    let item = resultPrice(total, j.intervalPrice, k)
                    if (k.svip_price) {
                      let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                      let tempPrice = formatCommission(solove(item.purchase_price, solove(solove(item.promotion_price, item.purchase_price, '-'), k.one_discount, '*'), '-'))
                      price = solove(price, solove(k.count, tempPrice, '*'), '+')
                      commission = solove(commission, solove(k.count, temp, '*'), '+')
                    } else {
                      price = solove(price, solove(k.count, item.purchase_price, '*'), '+')
                      commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                    }
                  }
                }
                kinds++
                number += k.count
              }
            } else {
              if (j.goods_type === 1) {
                price = solove(price, solove(k.count, k.price, '*'), '+')
                commission += 0
              } else {
                if (j.price_type === 0) {
                  if (k.svip_price) {
                    price = solove(price, solove(k.count, k.svip_price, '*'), '+')
                    commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                  } else {
                    price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                    commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                  }
                } else {
                  let total = totalNum(j.kinds)
                  let item = resultPrice(total, j.intervalPrice, k)
                  if (k.svip_price) {
                    let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                    let tempPrice = formatCommission(solove(item.purchase_price, solove(solove(item.promotion_price, item.purchase_price, '-'), k.one_discount, '*'), '-'))
                    price = solove(price, solove(k.count, tempPrice, '*'), '+')
                    commission = solove(commission, solove(k.count, temp, '*'), '+')
                  } else {
                    price = solove(price, solove(k.count, item.purchase_price, '*'), '+')
                    commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                  }
                }
              }
              kinds++
              number += k.count
            }
          })
        })
      }
      payMoney = price - commission
      return {
        totalPrice: price,
        totalNumber: number,
        totalKinds: kinds,
        totalCommission: commission,
        payMoney
      }
    }
  },
  filters: {
    retainTwoDecimal
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
    height 102px
    padding-right 20px
    bd-b($color-de)
    .img
      padding-right 22px
      padding-left 38px
      height 100%
      display flex
      align-items center
    .right
      flex 1
      align-items center
      display flex
      height 100%
      >img:nth-last-of-type(2)
        width 40px
        height 34px
      >img:last-of-type
        width 14px
        height 26px
        transform rotate(180deg)
        margin-left 12px
      span
        color $color-0
        f14()
        margin-left 16px
        line-height 40px
  .good-info
    padding 16px 24px 12px 0
    border-bottom 1px solid #DEDEDE;/*no*/
    .good-name
      display flex
      align-items center
      .img
        padding-right 22px
        padding-left 38px
        height 140px
        display flex
        align-items center
      .good-info-header
        flex 1
        display flex
        height 140px
        position relative
        .goods-label-hot
          position absolute
          top 0
          left 0
          img
            width 100%
            height 100%
        .goods-label-flash
          position absolute
          top 0
          left 0
          img
            width 100%
            height 100%
.good-info-header
  img
    width 140px
    height 140px
  .right
    flex 1
    margin-left 22px
    .good-title
      f14()
      color $color-0
      line-height 40px
      text-over(2)
      img
        width 80px
        height 36px
        vertical-align middle
      span
        color #D0021B
        font-size 26px
        line-height 36px
    .good-type
      margin-top 8px
      span
        border-radius: 4px;
        font-size 20px
        padding 2px 6px
        & + span
          margin-left 8px
        &.first
          background rgba(244, 117, 117, .1)
          color #F47575
        &.boutique
          background rgba(255, 138, 0, .1)
          color #FF8A00
        &.material
          background rgba(109, 172, 246, .1)
          color #6DACF6
        &.second
          color #D0021B
          font-size 24px
        &.third
          color #333
          f11()
.quotation-item-statistics
  height 80px
  padding 20px 25px 24px 40px
  flex-align-item()
  .number-price-statistics
    flex-f-align()
    b
      f14()
      color $color-0
      position relative
      margin-right 6px
      padding-right 12px
      &:after
        content ''
        position absolute
        width 1px;/*no*/
        background-color #000
        height 24px
        top 50%
        transform translateY(-50%)
        right 0
    span
      color #D0021B
    .price-int
      f16()
    .price-zero
      f12()
  .saved-money-statistics
    padding 6px 16px
    color $color-orange
    bd($color-orange)
    border-radius(4px)
    f12()
.good-detail
  flex 1
  display flex
  background #F4F4F4
  padding 16px 24px
  .left
    flex 1
    font-size 24px
    line-height 34px
    margin-right 20px
    h2
      f12()
      color $color-0
      text-over(1)
      // font-weight 700
      margin-bottom 5px
    .price-detail
      flex-f-align()
      .price
        color $color-3
        f12()
        b
          f14()
          color #D0021B
        span
          color #D0021B
      .saved-money
        color $color-orange
        margin-left 20px
        f12()
    div:last-child
      >span:first-child
        color #FF8A00
        font-size 28px
        line-height 40px
        >span:last-child
          color #000
      >span:last-child
        color #CCC
  .right
    display flex
    align-items center
    >span
      display flex
      justify-content center
      align-items center
      border 1px solid #CCC;/*no*/
      height 54px
      width 54px
      text-align center
      color #CCC
      font-size 30px
    input
      font-size 14px
      border 1px solid #CCC;/*no*/
      border-left none
      border-right none
      color #000
      width 72px
      height 54px
      color #000
      text-align center
      font-size 30px
    span.active
      color #000
.border-top
  border-top none!important
.border-top10
  border-top 10px solid #F5F5F5
img.checked
  width 30px!important
  height 30px!important
</style>
