<template>
  <div class="item">
    <div class="shop-info">
      <div class="img" @click.stop="selectShop(item)">
        <img v-if="hasSelect" :src="item.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
      </div>
      <div class="right" @click="goShopDetail(item.seller_id)">
        <img src="./images/business.png" alt="">
        <span>{{item.shopName}}</span>
        <img src="./images/arrow_left.png" alt="">
      </div>
    </div>
    <div class="good-info" v-if="item.goodsInfo" v-for="(good, goodIndex) in item.goodsInfo" :key="goodIndex">
      <div class="good-name" style="margin-bottom: 8px;">
        <div class="img" @click.stop="selectGood(good)">
          <img v-if="hasSelect" :src="good.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
        </div>
        <div class="good-info-header" @click="$router.push({path: '/goods-detail', query: {goodsId: good.goods_id}})">
          <img  class="goods-label-flash" v-show="good.goods_type === 1" src="./images/limit-icon.png" alt="">
          <img  class="goods-label-hot" v-show="good.goods_type === 2" src="./images/hot-icon.png" alt="">
          <img :src="good.goods_img" alt="">
          <div class="right">
            <div class="good-title">
              {{ good.goods_name }}
            </div>
            <div class="good-type" style="margin-top: 8px;">
              <span v-if="good.is_stock_good === 1" class="first">现货</span>
              <span v-if="good.boutique === 1" class="boutique">精品馆</span>
              <span v-if="good.material === 1" class="material">材料馆</span>
              <span :class="good.goods_type === 1 ? 'second' : 'third'">{{good.goods_type === 1 ? '限购' + good.buy_number + '件' : good.buy_number + '件起批'}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="good-name" v-for="(kind, kindIndex) in good.kinds" :key="kindIndex" style="margin-bottom: 5px;">
        <div class="img" @click.stop="selectKind(kind, good.kinds, good)">
          <img v-if="hasSelect" :src="kind.checked ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" class="checked">
        </div>
        <div class="good-detail">
          <swipeout>
            <swipeout-item>
              <div slot="right-menu">
                <swipeout-button @click.native="deleteQuotationItem(kind.id, kindIndex, goodIndex)" type="primary" background-color="#CB0000" :width="70">删除</swipeout-button>
              </div>
              <div slot="content" class="quotation-item">
                <div class="left">
                  <div>
                    <span>
                      {{ kind.title ? kind.title : '默认' }}
                    </span>
                  </div>
                  <div>
                    <!-- 限时商品 -->
                    <span v-if="good.goods_type === 1">
                      <span>￥{{ kind.price | retainTwoDecimal }}</span><span>/{{ kind.goods_unit }}</span>
                    </span>
                    <!-- 非限时的规格报价商品 -->
                    <span v-if="good.goods_type !== 1 && good.price_type === 0">
                      <span>￥{{ kind.promotion_price | retainTwoDecimal }}</span><span>/{{ kind.goods_unit }}</span>
                    </span>
                    <!-- 非限时的区间报价商品 -->
                    <span v-if="good.goods_type !== 1 && good.price_type === 1">
                      <span>￥{{ formatPrice(resultPrice(totalNum(good.kinds), good.intervalPrice, kind, hasSelect, kind.checked).promotion_price) }}</span><span>/{{ kind.goods_unit }}</span>
                    </span>
                    <span  v-show="good.goods_type === 1">赚: 0.00</span>
                    <span  v-show="good.goods_type !== 1">赚: {{ getSavedMoney(kind) }}</span>
                    <!-- <span  v-show="good.goods_type === 1">赚: {{ formatPrice(total.totalCommission/total.totalNumber)}}</span> -->
                  </div>
                </div>
                <div class="right">
                  <span @click.stop="reduce(kind)"><span :class="kind.count === 1 ? '' : 'active'">-</span></span>
                  <input type="number" v-model="kind.count" @blur="valid(kind, good)">
                  <span @click.stop="add(good, kind)"><span class="active">+</span></span>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="left">
        <span>共{{ total.totalKinds }}种{{ total.totalNumber }}件</span>
        <span class="item-total-price"><span>￥{{ formatPrice(total.totalPrice).split('.')[0] }}</span><span>.{{ formatPrice(total.totalPrice).split('.')[1] }}</span></span>
      </div>
      <div class="right">
        <span>赚:<span>￥{{ formatPrice(total.totalCommission).split('.')[0] }}</span>.{{ formatPrice(total.totalCommission).split('.')[1] }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { retainTwoDecimal } from 'common'
import { formatCommission, formatPrice, resultPrice, totalNum, solove } from './mixins'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    hasSelect: {
      type: Boolean,
      default: false
    },
    quotationIndex: {
      type: Number,
      default: 0
    }
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
    add (good, kind) {
      if (good.goods_type === 1) {
        if (kind.count === good.buy_number) {
          this.$t(`限购${good.buy_number}${kind.goods_unit}`)
          return
        }
      }
      this.$emit('add', kind)
    },
    reduce (kind) {
      this.$emit('reduce', kind)
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
    // 删除对应的报价单
    deleteQuotationItem (id, kindIndex, goodsIndex) {
      this.$emit('deleteQuotationItem', id, kindIndex, goodsIndex, this.quotationIndex)
    },
    // 返回对应区间的价格
    resultPrice (count, arr, k, hasSelect, flag) {
      return resultPrice(count, arr, k, hasSelect, flag)
    },
    totalNum (arr) {
      return totalNum(arr, this.hasSelect)
    },
    goShopDetail (id) {
      this.$push({ path: '/shop-detail', query: { id, fromGoodsDetail: 1 } })
    }
  },
  computed: {
    total () {
      let price = 0
      let number = 0
      let kinds = 0
      let commission = 0
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
                    price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                    if (k.svip_price) {
                      commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                    } else {
                      commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                    }
                  } else {
                    let total = totalNum(j.kinds)
                    let item = resultPrice(total, j.intervalPrice, k, this.hasSelect, k.checked)
                    price = solove(price, solove(k.count, item.promotion_price, '*'), '+')
                    if (k.svip_price) {
                      let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                      commission = solove(commission, solove(k.count, temp, '*'), '+')
                    } else {
                      commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                    }
                  }
                }
                kinds++
                number += Number(k.count)
              }
            } else {
              // 限时商品
              if (j.goods_type === 1) {
                price = solove(price, solove(k.count, k.price, '*'), '+')
                commission += 0
              } else {
                // 常规商品
                if (j.price_type === 0) {
                  price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                  if (k.svip_price) {
                    commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                  } else {
                    commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                  }
                } else {
                  // 区间商品
                  let total = totalNum(j.kinds, this.hasSelect)
                  let item = resultPrice(total, j.intervalPrice, k, this.hasSelect, false)
                  price = solove(price, solove(k.count, item.promotion_price, '*'), '+')
                  if (k.svip_price) {
                    let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                    commission = solove(commission, solove(k.count, temp, '*'), '+')
                  } else {
                    commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                  }
                }
              }
              kinds++
              number += Number(k.count)
            }
          })
        })
      }
      return {
        totalPrice: price,
        totalNumber: number,
        totalKinds: kinds,
        totalCommission: commission
      }
    }
  },
  filters: {
    retainTwoDecimal
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
// @import '~@/assets/css/vux'
.item
  border-bottom 10px solid #F5F5F5
  background: #FFF
  .shop-info
    display flex
    align-items center
    height 102px
    border-bottom 1px solid #DEDEDE;/*no*/
    .img
      padding-right 22px
      padding-left 38px
      height 100%
      display flex
      align-items center
    .right
      flex 1
      display flex
      align-items center
      height 100%
      padding-right 20px
      >img:nth-last-of-type(2)
        width 40px
        height 34px
      >img:last-of-type
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
        position relative
        flex 1
        display flex
        height 140px
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
      font-size 28px
      color #4A4A4A
      line-height 40px
      height 80px
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      word-break break-all
      img
        width 80px
        height 36px
        vertical-align middle
      span
        font-size 26px
        line-height 36px
        color #D0021B
        // padding 4px 10px
    .good-type
      margin-top 8px
      span
        border-radius: 4px;
        font-size 20px
        padding 2px 12px
        margin-right 16px
      span.first
        background rgba(244, 117, 117, .1);
        color #F47575
      span.boutique
        background rgba(255, 138, 0, .1);
        color #FF8A00
      span.material
        background rgba(109, 172, 246, .1);
        color #6DACF6
      span.second
        color #D0021B
        font-size 24px
      span.third
        color #333
        font-size 22px
.total
  display flex
  padding 20px 22px 38px 46px
  align-items center
  justify-content space-between
  .left
    span
      font-size 28px
      color #000
      position relative
    span:first-of-type
      margin-right 6px
    >span:nth-of-type(1):after
      position absolute
      content ''
      width 1px;/*no*/
      background-color #000
      height 24px
      right -10px
      top 50%
      transform translateY(-50%)
    .item-total-price > span
      color #FF8A00
      font-size 32px
    .item-total-price > span:last-of-type
      font-size 24px
  .right
    text-align right
    border 2px solid #FF8A00
    padding 6px 18px
    span
      color #FF8100
      font-size 24px
      >span
        font-size 24px
.good-detail
  flex 1
  .vux-swipeout
    .vux-swipeout-item
      overflow hidden
      .vux-swipeout-button-box
        overflow hidden
        padding 1px 1px;/*no*/
        >div
          position relative
        button.vux-swipeout-button
          position absolute
          right 0
          top 0
          fz(15px)
          padding 2px 1px;/*no*/
          background-origin content-box
          background-clip content-box
  .quotation-item
    display flex
    background #F4F4F4
    padding 16px 24px
  .left
    flex 1
    font-size 24px
    line-height 34px
    margin-right 20px
    div:first-child
      color #000
      word-break break-all
    div:last-child
      >span:first-child
        color #FF8A00
        font-size 28px
        line-height 40px
        >span:last-child
          color #000
      >span:last-child
        color #FF8A00
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
      color #000
      width 72px
      height 54px
      color #000
      text-align center
      font-size 30px
    span.active
      color #000
img.checked
  width 30px!important
  height 30px!important
.vux-swipeout
  .vux-swipeout-item
    &:after
      content unset
</style>
