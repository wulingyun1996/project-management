<template>
  <div class="order">
    <div class="info" @click="jumpAddress">
      <div v-if="userInfo">
        <div class="user-info">
          <span v-show="userInfo.full_name">{{userInfo.full_name}}</span>
          <span v-show="userInfo.mobile">{{userInfo.mobile}}</span>
        </div>
        <div class="address" v-show="userInfo.provinceChinese && userInfo.cityChinese && userInfo.areaChinese">
          {{userInfo.provinceChinese}}{{userInfo.cityChinese}}{{userInfo.areaChinese}}{{userInfo.address}}
        </div>
      </div>
      <div v-if="!userInfo">
        请选择收货地址
      </div>
      <img src="./images/arrow_right.png" alt="">
    </div>
    <img src="./images/address.png" alt="">
    <div class="orders">
      <header>
        <img src="./images/orders.png" alt="">
        <span>货品清单</span>
      </header>
      <div class="list">
        <div v-for="(item, index) in order" :key="index">
          <div class="header"><span>订单{{ index + 1 }}:</span><span>{{ item.shop_name }}</span></div>
          <order-item
            :item="item"
            @jump="jump(item)"
            @add="add"
            @reduce="reduce"
            @valid="valid">
          </order-item>
        </div>
      </div>
    </div>
    <!-- <footer class="ipone-x-absolute-bottom1">
      <div>
        <div class="total">
          <span>共{{ total.totalKinds }}种{{ total.totalNumber }}件</span>
          <span>合计：<span>￥{{ formatPrice(total.totalPrice).split('.')[0] }}</span><span>.{{ formatPrice(total.totalPrice).split('.')[1] }}</span></span>
          <div class="bottom">
            共节省：￥{{ savePrice | retainTwoDecimal }}(不含运费)
          </div>
        </div>
        <div class="btn" @click="commitOrder">
          确定提交
        </div>
      </div>
    </footer> -->
    <div class="commit-order-footer ipone-x-absolute-bottom1">
      <div class="order-price">
        <div class="total-price">
          <b>合计：</b><span class="price-int">￥{{ orderStatistics.payMoney | getPriceInt }}</span><span class="price-zero">.{{ orderStatistics.payMoney | getPriceZero }}</span>
        </div>
        <p class="saved-money" v-show="orderStatistics.hasNotFlashGoods">省: ￥{{ orderStatistics.totalSavedMoney | retainTwoDecimal }}</p>
      </div>
      <div class="order-submit-button" @click="commitOrder">确认提交</div>
    </div>
  </div>
</template>

<script>
import orderItem from './order-item'
import { retainTwoDecimal } from 'common'
import { dev, invokeNativeMethod, nativeBack } from 'native'
import { calcTotal, formatCommission, formatPrice, resultPrice, totalNum } from './mixins'
export default {
  components: {
    orderItem
  },
  data () {
    return {
      order: [],
      userInfo: null,
      flag: false
    }
  },
  mounted () {
    nativeBack('确认订单')
    this.order = sessionStorage.order ? JSON.parse(sessionStorage.order) : []
    window.returnAddress = this.returnAddress
    window.viewDidAppear = this.correctBack
    if (this.flag) return
    this.getUserInfo()
  },
  beforeRouteLeave (to, from, next) {
    sessionStorage.order = JSON.stringify(this.order)
    next()
  },
  methods: {
    // 修复左侧箭头直接返回工作台的问题 --> iOS 会将导航清空导致
    correctBack () {
      // nativeBack('确认订单')
    },
    valid (kind, good) {
      if (!/^[1-9][0-9]*$/.test(kind.count) || !kind.count) {
        kind.count = 1
      } else {
        if (good.goods_type === 1) {
          if (kind.count > good.buy_number) {
            kind.count = good.buy_number
          }
        }
      }
    },
    jumpAddress () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeGoAddress()
          return
        }
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeGoAddress.postMessage('')
        }
      } catch (e) {
        //
      }
    },
    returnAddress (obj) {
      if (obj) {
        this.flag = true
        if (typeof obj === 'string') {
          this.userInfo = JSON.parse(obj)
        } else {
          this.userInfo = obj
        }
        return
      }
      this.flag = false
    },
    commitOrder () {
      if (this.order.length === 0) return
      if (!this.userInfo) {
        this.$t('请选择收货地址', 'middle')
        return
      }
      if (this.isEnough()) return
      this.$vux.loading.show({
        text: '处理中...'
      })
      const arr = []
      let idArr = ''
      let hasActivity = 0
      this.order.map(i => {
        let obj = {
          goodsInfo: [],
          seller_id: i.seller_id
        }
        i.goodsInfo.map(j => {
          if (j.goods_type === 1) {
            hasActivity = 1
          }
          j.kinds.map(k => {
            obj.goodsInfo.push({
              goods_id: j.goods_id,
              goods_name: j.goods_name,
              goods_num: k.count,
              spec_key: k.spec_key
            })
            idArr += k.id + ','
          })
        })
        arr.push(obj)
      })
      let url = 'order/orderCommit'
      let obj = {
        addressId: this.userInfo.id,
        cartids: idArr.substr(0, idArr.length - 1),
        orderInfo: JSON.stringify(arr)
      }
      if (this.isFromGoodsDetail) delete obj.cartids
      this.$http(url, obj).then(res => {
        this.$vux.loading.hide()
        if (res.code === 200) {
          let currentDev = dev()
          let idStr = ''
          let priceStr = 0
          for (let i = 0; i < res.data.length; i++) {
            idStr += res.data[i].id + ','
            priceStr = (priceStr * 1000 + parseFloat(res.data[i].order_price) * 1000) / 1000
          }
          idStr = idStr.substr(0, idStr.length - 1)
          priceStr = this.formatPrice(priceStr)
          try {
            if (currentDev === 'Android') {
              invokeNativeMethod('setNavigationBarHidden', 1)
              this.$back()
              window.android.pay(idStr, priceStr, hasActivity)
              return
            }
            if (currentDev === 'iOS') {
              window.webkit.messageHandlers.pay.postMessage({id: idStr, price: priceStr, from: 'commit-order', hasActivity: hasActivity})
              // this.$back()
            }
          } catch (e) {
            //
          }
        } else {
          this.$t(res.message)
        }
      })
    },
    isEnough () {
      for (let i = 0; i < this.order.length; i++) {
        for (let j = 0; j < this.order[i].goodsInfo.length; j++) {
          for (let k = 0; k < this.order[i].goodsInfo[j].kinds.length; k++) {
            if (this.order[i].goodsInfo[j].goods_type !== 1) {
              let total = totalNum(this.order[i].goodsInfo[j].kinds)
              if (total < this.order[i].goodsInfo[j].buy_number) {
                this.$t(`[${this.order[i].goodsInfo[j].goods_name}]起批量至少为：${this.order[i].goodsInfo[j].buy_number}件`)
                return true
              }
            }
          }
        }
      }
      return false
    },
    async getUserInfo () {
      const res = await this.$http('order/getShippingAddress')
      if (res.code === 200) {
        this.userInfo = res.data
      } else {
        this.$t(res.message, 'middle')
      }
    },
    reduce (kind) {
      if (kind.count === 1) return
      kind.count--
    },
    add (kind) {
      kind.count++
    },
    formatCommission (num) {
      return formatCommission(num)
    },
    formatPrice (num) {
      return formatPrice(num)
    },
    resultPrice (count, arr) {
      return resultPrice(count, arr)
    },
    hasActivity () {
      let i = 0
      for (let i = 0; i < this.order.length; i++) {
        for (let j = 0; j < this.order[i].goodsInfo.length; j++) {
          if (this.order[i].goodsInfo[j].goods_type === 1) {
            i = 1
            return 1
          }
        }
      }
      return i
    }
  },
  computed: {
    // 是否从商品详情添加进来的
    isFromGoodsDetail () {
      return this.$route.query.fromGoodsDetail
    },
    orderStatistics () {
      return calcTotal(this.order, false)
    }
  },
  filters: {
    retainTwoDecimal
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)
  .order
    padding-bottom 132px!important
.order
  padding-bottom 98px
  background #F2F2F2
  height 100%
  overflow auto
  -webkit-overflow-scrolling touch
  >img
    width 100%
    height 2px;/*no*/
    margin-bottom 16px
.info
  display flex
  align-items center
  padding 28px 24px
  background #FFF
  >div
    flex 1
  .user-info
    display flex
    justify-content space-between
    color #333
    font-size 30px
    line-height 42px
    >span:last-child
      margin-right 20px
  .address
    color #646464
    font-size 28px
    line-height 40px
    margin-top 8px
  img
    width 14px
    height 27px
.orders
  header
    border-bottom 1px solid #DEDEDE;/*no*/
    height 100px
    display flex
    align-items center
    padding-left 26px
    background #FFF
    img
      width 44px
      height 50px
    span
      margin-left 14px
      color #FF8A00
      font-size 36px
.list
  .header
    display flex
    align-items center
    border-bottom 1px solid #DEDEDE;/*no*/
    padding 24px 20px 28px 26px
    background #FFF
    span:first-child
      font-size 32px
      color #FF8A00
      line-height 44px
    span:last-child
      flex 1
      color #000
      font-size 28px
      margin-left 17px
      line-height 40px
footer
  position fixed
  height 98px
  width 100%
  left 0
  bottom 0
  background #FFF
  >div
    display flex
  .total
    flex 1
    line-height 98px
    text-align center
    font-size 28px
    color #000
    >span:first-child
      color #000
      >span
        color #FF8A00
      >span:first-child
        font-size 36px
  .btn
    width 200px
    height 98px
    line-height 98px
    color #FFF
    text-align center
    font-size 32px
    background #FF8A00
.commit-order-footer
  pf(98px)
  left 0
  bottom 0
  background #FFF
  flex-f()
  > div
    height 100%
  .order-price
    flex 1
    padding-left 20px
    flex-col()
    justify-content center
    .total-price
      margin-bottom 10px
      b
        font-weight 700
        color $color-0
        f14()
      span
        color $color-orange
        f18()
      .price-zero
        f11()
    .saved-money
      color #9b9b9b
      f10()
      padding-left 90px
      margin-bottom -30px
  .order-submit-button
    width 340px
    background $color-orange
    color $color-white
    f16()
    line-height 98px
    tc()
</style>
