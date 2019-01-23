<template>
  <div class="order-detail">
    <scroll class="wrap" :data="[]">
      <div class="scroll">
        <div class="status">
          <div><i class="icon" :class="'icon-' + order.order_status"></i><span>{{order.display_name}}</span></div>
          <div v-if="order.surplusTime">{{order.surplusTime}}</div>
          <div class="reason" v-if="order.abnormal_reason">异常原因：{{order.abnormal_reason}}</div>
          <!-- <div v-if="order.cancel_reason">订单取消原因：{{order.cancel_reason}}</div> -->
        </div>
        <div class="goods-wrap">
          <div class="goods-list">
            <div class="buyer-info">
              <div>
                <span class="buyer">买家:{{order.buyer}}</span>
                <i class="appellation common-buyer" v-show="isCommonBuyer"></i>
                <i class="appellation cgs-buyer" v-show="order.user_type === 1"></i>
                <i class="appellation svip-buyer" v-show="order.user_type === 5"></i>
              </div>
              <div class="total-commission" v-show="isCommonBuyer">总返佣：￥{{ order.commision_price_sum }}</div>
              <!--<span class="im">给我留言</span>-->
            </div>
            <div class="goods-item" v-for="goods in order.goods">
              <div class="item-left">
                <img :src="goods.image_path" />
                <!-- <span class="goods-label-hot" v-show="goods.activity_type === 2"><img src="./images/hot.png" alt=""></span> -->
                <!-- <span class="goods-label-flash" v-show="goods.activity_type === 1"><img src="./images/limit.png" alt=""></span> -->
                <img v-if="goods.activity_type === 2" src="./images/hot.png" alt="">
                <img v-else-if="goods.activity_type === 1" src="./images/limit.png" alt="">
              </div>
              <div class="item-right">
                <div class="title-price item-info">
                    <div>
                      <span class="goods-title">{{goods.goods_name}}</span>
                    </div>
                    <span class="goods-price">￥{{goods.goods_price}}</span>
                </div>
                <div class="prop-count item-info">
                    <span class="goods-prop">{{goods.spec_name}}</span>
                    <span class="goods-count">×{{goods.goods_num}}</span>
                </div>
                <!-- <div class='shop'>
                  <span v-show="goods.boutique === 1">精品馆</span>
                  <span v-show="goods.material === 1">材料馆</span>
                </div> -->
                <div class="brand-left">
                  <div class="tag-left" v-show="goods.is_stock_good === 1">现货</div>
                  <div class="tag-center" v-show="goods.boutique === 1">精品馆</div>
                  <div class="tag-right" v-show="goods.material === 1">材料馆</div>
                </div>
                <div class="order-commission">
                  <span v-if="isCommonBuyer && goods.activity_type !== 1">下单来源：{{ orderSource }}</span>
                  <span v-if="isCommonBuyer && goods.activity_type !== 1 && goods.is_retail_price !== 1">返佣：￥{{ goods.commision_price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="order-info">
            <div class="freight-item">
              <span>运费</span>
              <span>{{order.free}}</span>
            </div>
            <div class="total-item">
              <span>实收款({{order.free}})</span>
              <span class="price">￥<span class="price-big">{{order.priceInt}}</span>.{{order.priceFloat}}</span>
            </div>
            <div class="address-item">
              <div>
                收货人：{{order.full_name}}
                <span>{{ order.mobile }}</span>
              </div>
              <div>收货地址：{{order.province}}{{order.city}}{{order.area}}{{order.address}}</div>
              <div class="self_lighting" v-if="order.delivery_id === 21">发货方式：自提</div>
            </div>
          </div>
        </div>
        <div class="order-info-wrap">
          <div class="txt-wrap">
            <div class="txt">订单编号：{{order.order_sn}}
              <!--<i class="btn-copy">复制</i>-->
            </div>
            <div class="txt">创建时间：{{order.order_time}}</div>
            <div class="txt" v-if="order.pay_time">付款时间：{{order.pay_time}}</div>
            <div class="txt" v-if="order.pay_way">付款方式：{{order.pay_way}}</div>
            <div class="txt" v-if="order.send_time">发货时间：{{order.send_time}}</div>
            <div class="txt" v-if="order.done_time">结束时间：{{order.done_time}}</div>
            <div class="txt" v-if="order.cancel_time">关闭时间：{{order.cancel_time}}</div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="foot-wrap" v-if="order.delivery_id !== 21">
      <div class="btn" v-if="order.order_status === 20" @click="cancelOrder(order.id)">取消订单</div>
      <div class="btn" v-if="order.order_status === 20" @click="editPrice(order.id)">修改价格</div>
      <div class="btn" v-if="order.order_status === 30" @click="sendOut(order.id)">发货</div>
      <div class="btn" v-if="order.order_status === 40" @click="goLogistics(order.id, order.order_sn)">查看物流</div>
    </div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { loadData, STATUS_OK } from 'api/common'
  import { Scroller, PopupPicker } from 'vux'
  import confirm from 'base/confirm/confirm'

  export default {
    data () {
      return {
        headerTitle: '订单详情',
        order: {},
        pickerData: []
      }
    },
    created () {
      // 当前组件激活的时候发送请求
      this.loadData()
      console.log(this.$route)
    },
    activated() {
      // this.loadData()
    },
    deactivated() {
      // this.order = Object.assign({})
    },
    methods: {
      loadData() {
        const URL = `order/distributor/detail`
        let obj = {
          id: this.$route.params.id
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            this.order = res.data
            let priceArr = this.order.pay_price.split('.')
            this.order.priceInt = priceArr[0]
            this.order.priceFloat = priceArr[1]
          }
        })
      },
      sendOut(id) {
        this.$router.push({
          path: '/order-send-out/' + id
        })
      },
      cancelOrder(id) {
        this.$router.push({
          path: '/order-cancel-order/' + id
        })
      },
      editPrice(id) {
        this.$router.push({
          path: '/order-edit-price/' + id
        })
      },
      goLogistics(id, orderCode) {
        this.$router.push({
          path: '/order-logistics-details/' + id,
          query: { orderCode }
        })
      }
    },
    computed: {
      totalPrice () {
        let totalPrice = 0
        this.order.order_goods.forEach((v, i) => {
          totalPrice += v.goods_price * 100
        })
        totalPrice = Object.assign([], (totalPrice / 100).toString().split('.'))
        return totalPrice
      },
      // 订单角色是否是普通买家，默认是普通买家
      isCommonBuyer () {
        return this.order.user_type === 4
      },
      // 商品下单来源
      orderSource () {
        if (Number(this.order.source) === 1) {
          return '报价单'
        }
        return '商品分享'
      },
      orderStauts () {
        let str = ''
        switch (this.order.order_status) {
          case 'waitConfirmed':
            str = '待确认'
            break
          case 'waitPayment':
            str = '待付款'
            break
          case 'waitDelivery':
            str = '待发货'
            break
          case 'waitReceiving':
            str = '待收货'
            break
          case 'evaluate':
            str = '待评价'
            break
          case 'success':
            str = '交易成功'
            break
          case 'closed':
            str = '交易关闭'
            break
          case 'abnormal':
            str = '异常订单'
            break
        }
        return str
      }
    },
    components: {
      Scroll,
      confirm,
      Scroller,
      PopupPicker
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  $pl = 26px
  $pd = 20px
  .order-detail
    position fixed
    top: 0
    left:0
    right: 0
    bottom: 0
    background-color: #fff;
    .wrap
      height: 100%
      overflow hidden
      background-color: #f8f8f8;
    .status
      display: flex
      justify-content: space-between
      align-items: center
      height: 129px; /*px*/
      bg-image('status-bg')
      background-size: 100% 100%;
      padding: 0 $pd 0 $pl;
      .reason
        padding-left: 20px
        line-height: 1.5
        flex 1
        text-over(1)
      div
        font-size: 30px; /*px*/
        color: $color-white
        display: flex
        align-items: center
        .icon
          display: inline-block
          height: 32px;/*px*/
          width: 60px;/*px*/
          &.icon-20
            bg-image('icon-20')
          &.icon-30
            bg-image('icon-30')
          &.icon-40
            bg-image('icon-40')
          &.icon-50
            bg-image('icon-50')
          &.icon-60
            bg-image('icon-60')
          &.icon-70
            bg-image('icon-70')
          background-size: 32px auto!important;/*px*/
    .goods-wrap
      background: $color-white
      .goods-list
        .buyer-info
          display flex
          justify-content space-between
          align-items center
          padding 0 $pd 0 $pl
          height: 92px;/*px*/
          font-size 28px;/*px*/
          >div
            flex-align-item()
            justify-content flex-start
          .buyer
            color $color-3
          .appellation
            display inline-block
            height 30px
            margin-left 30px
            // background: #ffa438
            font-style  normal
            // color: $color-white
            position relative
            // font-size:22px;/*px*/
            // line-height 1.5
            // padding: 0 10px
            // border-top-right-radius: 4px
            // border-bottom-right-radius: 4px
            &.common-buyer
              width 123px
              bg('buyer.png')
            &.cgs-buyer
              width 103px
              bg('cgs.png')
            &.svip-buyer
              width 145px
              bg('svip-cgs.png')
            // &:before
            //   content: ''
            //   display: inline-block
            //   width: 30px;/*px*/
            //   height: 100%
            //   position:absolute
            //   bottom: 0
            //   left: -28px;/*px*/
            //   background: url('./arrow.png')
            //   background-repeat: no-repeat
            //   background-size: auto 100%
            //   background-position: bottom right
            //   z-index: 9
          .im
            color $color-orange
        .goods-item
          padding: $pd $pd $pd $pl
          display: flex
          background: $color-body
          margin-bottom: 10px
          .item-left
            position relative
            flex: 0 0 150px;/*px*/
            width: 150px;/*px*/
            margin-right: 20px
            img:nth-child(1)
              width: 150px
              height: 150px
              border-radius 8px;
            img:nth-child(2)
                position absolute
                top 0
                left 0
                width 100%
                height 100%
            img:nth-child(3)
              position absolute
              top 0
              left 0
              width 100%
              height 100%
          .item-right
            flex 1
            flex-col-btw()
            .item-info
              display flex
              justify-content: space-between
              &.title-price
                font-size: 26px;/*px*/
                color: $color-highlight-background
                padding-bottom: 14px
                .goods-price
                  white-space: nowrap;
                  padding-left: 20px
              &.prop-count
                font-size: 24px;/*px*/
                color: $color-a6
            .shop
              span
                background-color #cccccc;
                margin-right 10px
                margin-top 5px
                border-radius 2px
                padding  6px 20px
                color black
            .brand-left
              display flex
              align-items center
              .tag-left
                padding 6px 8px
                background: rgba(244,117,117,0.10)
                border-radius: 4px
                font-family: PingFangSC-Regular
                font-size: 20px
                color: #F47575
                letter-spacing: 0
                text-align center
                margin-right 10px
              .tag-center
                padding 6px 8px
                background: rgba(255,138,0,0.10)
                border-radius: 4px
                font-family: PingFangSC-Regular
                font-size: 20px
                color: #FF8A00
                letter-spacing: 0
                text-align center
                margin-right 10px
              .tag-right
                padding 6px 8px
                background: rgba(109,172,246,0.10)
                border-radius: 4px
                font-size: 20px
                color: #6DACF6
            .order-commission
              flex-align-item()
    .order-info
      padding: 0 $pd 0 $pl
      border-bottom 1px solid #e3e3e3;/*no*/
      .freight-item
        display: flex
        justify-content: space-between
        font-size: 24px;/*px*/
        line-height: 1.5
        color: $color-a6
        padding-top 10px
        padding-bottom 10px
      .total-item
        display: flex
        justify-content: space-between
        align-items: center
        font-size: 24px;/*px*/
        line-height: 1.5
        padding-bottom  10px
        border-bottom 1px solid #e3e3e3;/*no*/
        color: $color-3
        .price
          color: $color-orange
          .price-big
            font-size: 36px;/*px*/
      .address-item
        padding $pd 0
        div
          font-size 24px;/*px*/
          line-height: 1.667
          color $color-6
    .order-info-wrap
      background: $color-white
      padding: $pd $pl
      padding-bottom 98px;/*px*/
      .txt-wrap
        .txt
          font-size: 24px; /*px*/
          line-height: 1.5
          color: $color-a6
          .btn-copy
            display: inline-block
            float: right
            font-style: normal
            width: 120px; /*px*/
            line-height: 44px; /*px*/
            border: 1px solid $color-border; /*no*/
            border-radius: 4px
            text-align: center
            font-size: 24px; /*px*/
            color: $color-6
    .foot-wrap
      position fixed
      left 0
      width 100%
      bottom 0
      background: $color-white
      height: 98px; /*px*/
      line-height: 98px; /*px*/
      text-align: right
      border-top: 1px solid $color-border; /*no*/
      .btn
        display inline-block
        /*padding: 0 17px*/
        text-align center
        height: 52px; /*px*/
        width: 150px;/*px*/
        line-height: 52px; /*px*/
        border: 1px solid $color-orange; /*no*/
        margin-right: 23px
        font-size: 26px; /*px*/
        color: $color-orange
  vuxPopPicker()
</style>
