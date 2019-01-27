<template>
  <div class="step">
    <!-- <div class="step-status">
      <ul>
        <li class="active">
          <div class="curr">
            <div>
              <p>买家下单</p>
              <p>2018 9.26 15:35</p>
            </div>
          </div>
        </li>
        <li class="active">
          <div class="curr">
            <div>
              <p>买家下单</p>
              <p>2018 9.26 15:35</p>
            </div>
          </div>
        </li>
        <li class="active">
          <div class="curr">
            <div>
              <p>买家下单</p>
              <p>2018 9.26 15:35</p>
            </div>
          </div>
        </li>
        <li class="active">
          <div class="curr">
            <div>
              <p>买家下单</p>
              <p>2018 9.26 15:35</p>
            </div>
          </div>
        </li>
        <li class="active">
          <div class="curr">
            <div>
              <p>买家下单</p>
              <p>2018 9.26 15:35</p>
            </div>
          </div>
        </li>
      </ul>
    </div> -->
    <div class="order-status">
      <span style="font-weight: bold; font-size: 14px;">当前订单状态：<span>{{ data.display_name }}</span></span>
      <span></span>
    </div>
    <nav class="order-nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单详情" name="orderDetails"></el-tab-pane>
        <el-tab-pane label="收货和物流信息" name="logInfo"></el-tab-pane>
      </el-tabs>
    </nav>
    <!-- 订单详情信息 -->
    <div v-if="orderDetails">
      <div class="infoAll">
        <div class="line-one">
          <p class="line-title">【商家信息】</p>
          <div>
            <span>名称：<span>{{ data.seller_name }}</span></span>
            <span>账号：<span>{{ data.seller_account }}</span></span>
            <span>服务城市：<span>{{ data.seller_op_city }}</span></span>
          </div>
        </div>
        <div class="line-one">
          <p class="line-title">【买家信息】</p>
          <div>
            <span>账户：<span>{{ data.buyer_mobile }}</span><span class='identity'>{{ data.user_type }}</span></span>
            <span>身份：<span>{{ data.identity_label}}</span></span>
            <span>支付方式：{{ data.pay_way }}</span>
            <span>联系方式：{{ data.mobile }}<span></span></span>
          </div>
        </div>
        <div class="line-one">
          <p class="line-title">【订单信息】</p>
          <div>
            <span>订单编号：<span>{{ data.order_sn }}</span></span>
            <span>创建时间：{{ data.created_at }}<span></span></span>
            <span>付款时间：<span>{{ data.pay_time }}</span></span>
          </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class='product-info'>
        <div class="table-header">
          <ul class="clearfix:after">
            <li>商品</li>
            <li>价格</li>
            <li>数量</li>
            <li>交易状态</li>
            <li v-show='isShow'>订单来源</li>
            <li v-show='isShow'>返佣金额</li>
            <li v-show='isShow'>返佣人</li>
            <li>实付款</li>
          </ul>
        </div>
        <div class="order-list clearfix:after">
          <div class="every-order clearfix:after">
            <ul class="clearfix:after" v-for="(order, index) in data.order_good" :key="index">
              <!-- 商品 -->
              <li>
                <div class="more-line verti-center">
                  <img :src="order.image_path" alt="">
                  <span  class='hot' v-show="order.activity_type === 1"><img src="./images/limit.png" alt=""></span>
                  <span  class='limit' v-show="order.activity_type === 2"><img src="./images/hot.png" alt=""></span>
                  <div>{{ order.goods_name }}</div>
                  <div class="change-color"><span>{{ order.spec_name }}</span></div>
                  <div class="change-color"><span>{{ order.brand_name }}</span></div>
                  <div class="shop">
                    <span v-show="order.boutique === 1">精品馆</span>
                    <span v-show="order.material === 1">材料馆</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="verti-center">
                  <!-- <div class="order-price">{{ order.activity_type }}</div> -->
                  <div class="order-number">&yen;{{ order.goods_price }}</div>
                </div>
              </li>
              <li>{{ order.goods_num }}</li>
              <li><div>{{ data.display_name }}</div></li>
              <!-- 订单来源 -->
              <li v-show='isShow'>{{order.activity_type === 2 ? '——' : order.source}}</li>
              <!-- 返佣金额 -->
              <li v-show='isShow'>{{order.activity_type === 2 ? '——' : order.commision_price}}</li>
              <!-- 返佣人 -->
              <li v-if='isShow'> 
                <div class='identity'>
                  <span>采购师</span> 
                  <span>{{ order.share_buyer_info.mobile }}</span>
                </div>
              </li>
              <li>
                <div class="verti-center">
                  <div>{{ data.free }}</div>
                  <div>&yen;{{ data.pay_price }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class='money'>
          <div class='commission' v-show='isShow'>
            <span>总返佣:</span>
            <span>&yen;{{  data.commision_price_sum}}</span>
          </div>
          <div class='pay'>
            <span>实付款:</span>
            <span>&yen;{{ data.pay_price }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 物流信息 -->
    <div class="info" v-if="isInfo">
      <p>【物流信息】</p>
      <p><span>收货人：</span><span>{{ data.buyer}}</span></p>
      <p><span>收货人手机号码：</span><span>{{ data.buyer_mobile}}</span></p>
      <p><span>收货地址：</span><span>{{ data.full_name }}，{{ data.mobile }}，{{ data.province }}，{{ data.city }}，{{ data.area }}，{{ data.address }}，{{ data.postcode }}</span></p>
      <p><span>物流公司名称：</span><span>{{ data.express_name }}</span></p>
      <p><span>运单号：</span><span>{{ data.delivery_code }}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderDetails',
  data () {
    return {
      data:[],
      activeName: 'orderDetails',
      orderDetails: true,
      isInfo: false,
      isShow: false
    }
  },
  created () {
    this.dataList()
  },
  methods: {
    dataList () {
      let obj = {
        id: this.$route.query.id
      }
      this.$http('order/orderDetail',obj).then(res => {
        if(res.code === this.$ok) {
          this.data = res.data
          this.data.order = res.data.order_good
          if(this.data.express_name === '' || this.data.express_name === null) {
            this.data.express_name = '--'
          }
          if(this.data.delivery_code === '' || this.data.delivery_code === null) {
            this.data.delivery_code = '--'
          }
          if (res.data.user_type === 1) {
            res.data.user_type  = '采购师'
          }
          if (res.data.user_type === 4) {
            res.data.user_type  = '普通买家'
            this.isShow = true
            let flag = this.data.order.every(item=> {
              return item.activity_type === 1
            })
            console.log(flag)
            if(flag){
              this.isShow = false
            }
          }
          if (res.data.user_type === 5) {
            res.data.user_type  = '特约采购师'
          }
          this.data.order.forEach(item => {
            if(item.source === 1) {
              item.source ='报价单'
            }
            if(item.source === 2) {
              item.source ='商品分享'
            }
          })
        }
      })
    },
    handleClick(event, tab){
      console.log(event, tab)
      if(event.name === 'orderDetails'){
        this.orderDetails = true
        this.isInfo = false
      }else if (event.name === 'logInfo') {
        this.isInfo = true
        this.orderDetails = false
      }
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.step 
  .el-tabs__nav-scroll
  .el-tabs__item.is-active
    color #009688
  .order-status
    margin 0 0 10px 0
  .el-tabs__active-bar
    background-color #009688
    margin-top 10px
    .step-status
      margin 0 0 20px 0
      >ul
        background #f0f0f0
        border-radius 40px
        height 60px
        width 100%
        display flex
        justify-content: space-between
        overflow: hidden
        >li
          width 20%
          display flex
          f16()
        .active
          background: #64b9b2;
          color: #fff;
          .curr
            background url(../../assets/images/step-arrow1.png) no-repeat right center;
          >div
            display: -ms-flexbox;
            flex-col()
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            tc()
  .infoAll
    f14()
    .line-one
      margin 0 0 30px
      .line-title
        font-weight: bold;
        margin-bottom: 10px; 
        margin-top 10px
      >div
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        span 
          width 20%
          .identity
            margin-left 10px
            padding 3px 10px;
            background-color red
            color #ffffff
            border-radius 10px;
  tehead 
    >tr
      th
        width
  .product-info
    .table-header
          height 50px
          line-height 50px
          width 100%
          background-color #eee
          border-radius 3px 3px 0 0
          f14()
          font-weight bold
          ul
            width 100%
            display flex
            li
              tc()
              font-weight bold
              bd-r(#dcdfe6, width = 1px)
            li:nth-child(1)
              flex 1.5
            li:nth-child(2)
              flex 1
            li:nth-child(3)
              flex 1
            li:nth-child(4)
              flex 1
            li:nth-child(5)
              flex 1
            li:nth-child(6)
              flex 1
            li:nth-child(7)
              flex 1
            li:nth-child(8)
              flex 1
      .order-list
          bd(#eee, width = 1px)
          border-radius 4px
          f14()
        .every-order
          ul
            width 100%
            display flex
            li
              position relative
              height: 120px
              display table
              bd-r(#dcdfe6, width = 1px)
              tc()
              img 
                position absolute
                left 15px
                top 35px
              .more-line
                padding-left 85px
              .verti-center
                line-height 20px
                display: table-cell;
                vertical-align: middle;
            li:nth-child(1)
              flex 1.5
              text-align left
              .hot,.limit
                img 
                  width 50px
                  height 20px
              .shop
                span
                  background-color #cccccc;
                  margin-right 10px
                  margin-top 5px
                  border-radius 2px
                  padding  0 10px

            li:nth-child(2)
              flex 1
              .order-price 
                width 30%
                background-color red
                height 23px
                line-height 23px
                margin 0 auto
                border-radius 5px
                color #fff
                f14()
              .order-number
                color red
            li:nth-child(3)
              flex 1
              line-height 120px
            li:nth-child(4)
              flex 1
              line-height 120px
            li:nth-child(5)
              flex 1
              line-height 120px
            li:nth-child(6)
              flex 1
              line-height 120px
            li:nth-child(7)
              flex 1
              display flex
              flex-direction column
              justify-content center
              .identity
                span:nth-child(1)
                  background-color red
                  display block
                  width 70%
                  border-radius 10px;
                  color #ffffff
                  margin 0 auto
                  height 20px;
                  line-height 20px;
                  margin-bottom 10px;
            li:nth-child(8)
              flex 1
      .money
          width 300px;
          margin-top 50px;
          float right 
          font-size 20px;
          color skyblue
          .commission
            float left
            span
              margin-right 10px
          .pay
            float right
            span
              margin-right 10px
 
  .info
    p
      margin 20px 0
      f14()
      font-weight bold
      span:nth-child(1) 
        width 120px
        display inline-block
</style>


