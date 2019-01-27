<template>
  <div class="order-list-page">
    <nav class="order-nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有订单" name="all"></el-tab-pane>
        <el-tab-pane label="待付款" name="waitPayment"></el-tab-pane>
        <el-tab-pane label="待发货" name="waitDelivery"></el-tab-pane>
        <el-tab-pane label="待收货" name="waitReceiving"></el-tab-pane>
        <el-tab-pane label="待评价" name="success"></el-tab-pane>
        <el-tab-pane label="异常订单" name="abnormal"></el-tab-pane>
      </el-tabs>
    </nav>
    <div class="order-list-header">
      <div class="all-buyer">
        <!-- <span>全部买家：</span> -->
        <base-select
          :options="buyerOptions"
          @changeCurrentOption="getAllOption"
          placeholder="全部买家"
          class="select-options">
        </base-select>
      </div>
      <div class="created-time">
        <base-time-picker
          @pickerTime="pickerRegisterTime"
          timeText="创建时间">
        </base-time-picker>
      </div>
      <div class="order-search-input">
        <span>订单号：</span>
        <base-input
          @changeInputValue="getNumber"
          class="input-wapper">
        </base-input>
      </div>
      <div class="order-search">
        <base-button
          :type="1"
          @clickCurrentButton="searchTableData"
          text="搜索">
        </base-button>
      </div>
       <base-button :type="2" text="导出" @clickCurrentButton="orderDownload"></base-button>
    </div>
    <div class="table-header">
      <ul class="clearfix:after">
        <li>商家</li>
        <li>商品</li>
        <li class="a">单价（元）</li>
        <li class="a">数量</li>
        <li class="a">买家</li>
        <li class="a">交易状态</li>
        <li class="a">实付款</li>
        <li class="a">交易操作</li>
      </ul>
    </div>
    <!-- 订单部分 -->
    <div class="order-list" v-for="(order, orderIndex) in data" :key="orderIndex">
      <div class="every-order">
        <div class="order-list-title"><span class="order-number">订单编号：<span>{{ order.order_sn }}</span></span><span class="create-time">创建时间：<span>{{ order.created_at }}</span></span></div>
        <ul v-for="(orderItem, index) in order.order_goods" :key="index">
          <li><div>{{ order.shop }}</div></li>
          <li>
            <div class="more-line verti-center">
              <img :src="orderItem.image_path" alt="">
              <span  class='hot' v-show="orderItem.activity_type === 1"><img src="./images/limit.png" alt=""></span>
              <span  class='limit' v-show="orderItem.activity_type === 2"><img src="./images/hot.png" alt=""></span>
              <div>{{ orderItem.goods_name }}</div>
              <div class="change-color"><span>{{ orderItem.spec_name }}</span></div>
              <div class="change-color"><span>{{ orderItem.brand_name }}</span></div>
              <div class="shop">
                <span v-show="orderItem.boutique === 1">精品馆</span>
                <span v-show="orderItem.material === 1">材料馆</span>
              </div>
            </div>
          </li>
          <li class="a">
            <div class="verti-center">
              <!-- <div class="order-price">{{ orderItem.activity_type }}</div> -->
              <div class="order-number">&yen;{{ orderItem.goods_price }}</div>
            </div>
          </li>
          <li class="a">{{ orderItem.goods_num }}</li>
          <li class="a">
            <div class="verti-center">
              <div class='identity'>{{order.buyer_type}}</div>
              <div>{{ order.buyer }}</div>
            </div>
          </li>
          <li class="a">
            <div class="verti-center">
              <div class="order-status">{{ order.display_name }}</div>
              <div class="order-details"><a href="javaScript:void(0)" @click=orderDetails(order.id)>订单详情</a></div>
            </div>
          </li>
          <li class="a">
            <div class="verti-center">
              <div>{{order.free}}</div>
              <div>&yen;{{ order.pay_price }}</div>
            </div>
          </li>
          <li class="a">
            <div class="verti-center">
              <!-- @click="remark(order.id)" -->
              <div class="remark" @click="modifyRemark(order.id)">
                <a class="word_white" :title="remarkMessage" href="JavaScript:void(0)">{{order.order_mark == null ?'备注':'修改备注'}}</a>
              </div>
              <div class="Abnormity" v-show="isenterAbnormity" @click="dialogVisible = true"><a class="word_white" href="JavaScript:void(0)">进入异常</a></div>
            </div> 
          </li>
        </ul>
      </div>
    </div>
    <!-- 备注弹框 -->
    <div class="remarkMask">
      <el-dialog :visible.sync="remark">
        <p>输入任何口令</p>
        <textarea v-model="remarkMessage" cols="30" maxlength="100" rows="4"></textarea>
        <div class="addmit">
          <el-button @click="remark = false">取消</el-button>
          <el-button type="primary" @click="remarkSubmit()">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 订单异常 -->
    <div class="Abnormity">
      <el-dialog :visible.sync="dialogVisible">
        <p>订单异常</p>
        <p class="ab-tips height">温馨提醒： 一般由于退款及退货纠纷问题，会产生异常订单，操作为异常订单后，该订单的账款不参与商户的账期结算。</p>
        <div class="ab-reason height">
          <h3>订单异常原因：</h3>
          <textarea v-model="message" cols="30" maxlength="100" rows="4"></textarea>
        </div>
        <div class="restore-stock height">
          <span class="isRestore">是否反还库存</span>
            <el-radio-group v-model="form.resource">
              <el-radio label="是" v-model="form.type"></el-radio>
              <el-radio label="否" v-model="form.type"></el-radio>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <base-pagination @changePage="changePage" :total="total" :pageSize="pageSize" v-show="showPagination"></base-pagination>
  </div>
</template>
<script>
import BasePagination from 'components/pagination'
const buyerOptions = [
  {
    label: '全部买家',
    value: 'all'
  },
  {
    label: '普通买家',
    value: 1
  },
  {
    label: '采购师',
    value: 2
  }
]
const orderOptions = [
  {
    label: '所有订单',
    value: 0
  },
  {
    label: '待付款',
    value: 1
  },
  {
    label: '待发货',
    value: 2
  },
  {
    label: '待收货',
    value: 3
  },
  {
    label: '待评价',
    value: 4
  },
  {
    label: '订单异常',
    value: 5
  }
]
export default {
  data () {
    return {
      data: [], // 订单抬头数据
      goodName: '',
      isenterAbnormity: true, // 是否进入异常
      activeName: 'all',
      // centerDialogVisible: true, // 进入异常弹窗
      total: 0,
      page: 1,
      pageSize: 10,
      message: '',
      id: '', // 订单id
      dialogVisible: false, // 异常
      remark: false,
      remarkMessage: '', // 备注信息
      form: {
        resource: '',
        type: 0,
      },
      buyerOptions,
      orderOptions,
      startTime: '',
      endTime: '',
      orderNumber: '',
      buyer:'',
      exelData: []
    }
  },
  created () {
    this.dataList()
  },
  computed: {
    showPagination () {
      return this.total > 10
    }
  },
  methods: {
    // 全部买家
    getAllOption (val) {
      this.buyer = val
      console.log(val)
    },
    // 时间
    pickerRegisterTime (t) {
      if (!t) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = t[0]
      this.endTime = t[1]
    },
    // 订单号
    getNumber (val) {
      this.orderNumber = val
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.$http('order/orderList',{
        status: 'all',
        page: this.page,
        pageSize: this.pageSize,
        starTime: this.startTime,
        endTime: this.endTime,
        order_sn: this.orderNumber,
        buyer_type: this.buyer
      }).then(res => {
        if(res.code === this.$ok) {
          this.data = res.data.data
          this.total = res.data.total
        }
      })
    },
    dataList (value, index) {
      this.$http('order/orderList',{
        status: 'all',
        page: this.page,
      }).then(res => {
         let exelData = []
        if(res.code === this.$ok) {
          this.data = res.data.data
          this.total = res.data.total
          res.data.data.forEach((item, index) => {
            if(item.order_status === 30 || item.order_status === 40 || item.order_status === 50 ) {
              item.order_status = '等待买家确认'
              this.isenterAbnormity = true
            }else {
              this.isenterAbnormity = false
            }
            let obj = 
              {
                shop: item.shop,
                goods_name: item.order_goods[0].goods_name,
                goods_price: item.order_goods[0].goods_price,
                goods_num: item.order_goods[0].goods_num,
                buyer: item.buyer, 
                display_name: item.display_name,
                pay_price: item.pay_price,
                order_mark: item.order_mark,
                mobile: item.mobile,         
              }
            if(item.order_goods[0].boutique === 1){
              obj.goods_name += '【精品馆】'
            }
            if(item.order_goods[0].material === 1){
               obj.goods_name += '【材料馆】'
            }
            if (item.order_goods[0].activity_type === 1) {
              obj.goods_name += '【限时】'
            }
            else if (item.order_goods[0].activity_type === 2 ) {
              obj.goods_name += '【爆款】'
            }
             exelData.push(obj) 
          })
          this.exelData = exelData
        }
      })
    },
    // 点击订单详情
    orderDetails (id) {
      this.$router.push({ path: '/manage-order/order-Details', query: { id: id } })
    },
    // 切换tab栏
    tabChange (item) {
      alert(222)
    },
    // 切换tab栏
    handleClick(tab, event) {
        this.$http('order/orderList',{
        status: tab.name,
        page: this.page
      }).then(res => {
        if(res.code === this.$ok) {
          this.data = res.data.data
          res.data.data.forEach((item, index) => {
            if(item.order_status === 30 || item.order_status === 40 || item.order_status === 50 ) {
              item.order_status = '等待买家确认'
              this.isenterAbnormity = true
            }else {
              this.isenterAbnormity = false
            }
         })
        }
      })
    },
    changePage (page) {
      this.page = page
      this.dataList()
    },
    // 点击进入异常
    enterAbnormity () {
      this.centerDialogVisible = true
    },
    // 确定提交
    submit () {
      this.dialogVisible = false
    },
    // 点击备注
    modifyRemark (id) {
      this.id = id
      this.$http('order/orderDetail', { id: this.id }).then(res => {
        this.remarkMessage = res.data.order_mark
        console.log(res)
      })
      this.remark = true
    },
    remarkSubmit () {
      console.log(this.id)
      if (!this.remarkMessage){
      this.remarkMessage = ''
      return
      }
      let obj ={
        id: this.id,
        mark: this.remarkMessage
      }
      this.$http('order/orderMark',obj).then(res => {
        if(res.code === this.$ok) {
            this.$mes('备注成功')
            this.remark = false
            this.dataList()
          }
        })
    },
    // 导出excel
    orderDownload () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = ['商家', '商品', '单价', '数量', '买家', '交易状态', '实付款', '备注' ,'手机号码']
        const filterVal = ['shop', 'goods_name', 'goods_price', 'goods_num', 'buyer','display_name', 'pay_price', 'order_mark','mobile']
        const list = this.exelData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '订单列表')
        this.downloadLoading = false
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  }
}
</script>
<style lang='stylus'>
@import '~@/assets/css/mixins'
.order-list-page
  .order-list-header
    flex-f-align()
    flex-wrap wrap
    > div
      margin-bottom 20px
    .all-buyer
      margin-right 20px
    .all-order,
    .order-search-input,
    .order-search
      flex-f-align()
      margin-left 20px
      margin-right 20px
    .order-search-input
      margin-left 25px
  .el-tabs__nav-scroll
  .el-tabs__item.is-active 
    color #009688
  .order-status
    margin 0 0 10px 0
  .el-tabs__active-bar
    background-color #009688
    margin-top 10px
  .table-header
    height 50px
    line-height 50px
    width 100%
    background-color #eee
    border-radius 3px 3px 0 0
    font-weight bold
    f14()
    font-weight bold
    ul
      width 100%
      li
        float left
        tc()
        font-weight bold
      li:nth-child(1)
        width 15%
      li:nth-child(2)
        width 37%
      .a
        width 8%
  .order-list
    bd(#eee, width = 1px)
    margin-top 15px
    border-radius 4px
    f14()
    .every-order
      .order-list-title  
        .order-number
          margin-left 20px
          color #4fbdaa
        .create-time
          margin-left 30px
          color #adabab
      >div
        background-color #eee
        padding 15px 0
      ul
        tc()
        li
          float left
          bd-r(#eee, width = 1px)
          height 120px
          position relative
          text-align left
          display table
          tc()
        li:nth-child(1) 
          width 15%
          >div
            display table-cell;
            vertical-align: middle;
        li:nth-child(2)
          width 37%
          text-align left
          .verti-center
            display table-cell
            vertical-align:middle
            *position:absolute 
            *top:50%
            *left:50%
            *width:100%
            >div
              position relative
              line-height 20px
              margin-left 110px
            .hot,.limit
              img 
                width 50px
                height 20px
            .change-color 
              color #adabab
              f12()
            .shop
              span
                background-color #cccccc;
                margin-right 10px
                margin-top 5px
                border-radius 2px
                padding  0 10px
          img 
            position absolute
            width 50px
            height 50px
            display block
            left 28px
            top 35px
        .a
          width 8%
          // line-height 120px
          .verti-center
            display table-cell
            vertical-align middle
            *position absolute 
            *top 50%
            *left 50%
            *width 100%
        li:nth-child(3)
          >div
            line-height 20px
          .verti-center
            display table-cell
            vertical-align middle
            *position absolute 
            *top 50%
            *left 50%
            *width 100%
            line-height 20px
            .order-price 
              width 65%
              background-color red
              height 23px
              line-height 23px
              margin 0 auto
              border-radius 5px
              color #fff
              f14()
            .order-number
              color red
        li:nth-child(4)
          line-height 120px
        li:nth-child(5)
          >div
            line-height 20px
          .identity
            width 80%
            height 25px
            line-height 25px
            margin 0 auto
            margin-bottom 5px
            background-color red
            color #ffffff
            border-radius 10px;
        li:nth-child(6)
          >div
            line-height 20px
          .order-details
            a
              color #409eff
        li:nth-child(7)
          >div
            line-height 20px 
        li:nth-child(8)
          color #fff
          >div
            line-height 20px 
          .remark
            width 50%
            background-color #1E9FFF
            height 25px
            line-height 25px
            margin 0 auto
            border-radius 5px
          .Abnormity
            width 65%
            margin 6px auto 
            height 25px
            line-height 25px
            background-color #1E9FFF
            border-radius 5px
  .word_white
    color #FFF
  .Abnormity
    .el-dialog
      width 600px
      height 400px
      overflow scroll; 
    .height
      margin-top 30px
    .ab-tips
      color red
      textarea 
        width 500px
        height 100px
        bd(#eee, width = 1px)
        margin-top 5px
    .restore-stock
      .isRestore
        width 100px
        display inline-block
  .el-radio__input
      &.is-checked
        .el-radio__inner
          background $color-orange
          border-color $color-orange
        & + .el-radio__label
          color $color-orange
  .remarkMask
    text-align center
    p
      text-align center
    .el-dialog
      width 500px
      height 300px
      textarea
        width 350px
        padding 10px
        height 100px
        bd(#eee, width = 1px)
        margin 20px 0
</style>
