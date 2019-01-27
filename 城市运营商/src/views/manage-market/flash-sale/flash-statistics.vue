<template>
  <div class="alliance">
    <div class="nameSpace">
      <span class="firstName">活动名称：</span>
      <span class="red">{{name}}</span>
      <span class="name">访问量：</span>
      <span class="red">{{page_view}}</span>
      <span class="name">访问用户数：</span>
      <span class="red">{{imei_count}}</span>
      <span class="name">订单：</span>
      <span class="red">{{order_count}}</span>
      <span class="name">抢购商品数量：</span>
      <span class="red">{{rob_num}}</span>
      <span class="name">总金额：</span>
      <span class="red">￥{{amount}}</span>
    </div>
    <div class="flashtable">
      <test :total="Number(total)" :data="data" :columns="columns" :componentList="componentList"></test>
    </div>
  </div>
</template>
<script>
import test from 'components/table'
import Img from 'components/table-image'
const data = []
const columns = [
  {
    label: '商品名称',
    prop: 'title'
  },
  {
    label: '抢购价',
    prop: 'active_price'
  },
  {
    label: '原活动库存',
    prop: 'original_stock'
  },
  {
    label: '剩余活动库存',
    prop: 'rem_stock'
  },
  {
    label: '抢购数量',
    prop: 'number'
  },
  {
    label: 'C用户订单数量',
    prop: 'c_user_order_num'
  },
  {
    label: '采购师订单数量',
    prop: 'cgs_user_order_num'
  },
  {
    label: '小程序访问量',
    prop: 'app_open_nums'
  },
  {
    label: 'APP访问量',
    prop: 'page_view'
  },
  {
    label: 'C用户金额',
    prop: 'c_user_order_amount'
  },
  {
    label: '采购师金额',
    prop: 'cgs_user_order_amount'
  },
  {
    label: '总金额',
    prop: 'total_price'
  }
]
const componentList = [
  {
    component: Img,
    label: '商品图片',
    insertIndex: 0
  }
]
export default {
  data () {
    return {
      data,
      columns,
      componentList,
      name: '',
      page_view: '',
      imei_count: '',
      order_count: '',
      rob_num: '',
      amount: '',
      total: ''
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      let obj = {
        id: this.$route.query.id
      }
      this.$http('sale/statistics', obj).then(res => {
        if (res.code === this.$ok) {
          this.name = res.data.item.name
          this.page_view = res.data.item.page_view
          this.imei_count = res.data.item.imei_count
          this.order_count = res.data.item.order_count
          this.rob_num = res.data.item.rob_num
          this.amount = res.data.item.amount
          this.data = res.data.list.data
          this.total = res.data.list.total
          this.data.map(item => {
            item.src = item.image_path
            item.height = 50
            item.width = 50
          })
        }
      })
    }
  },
  components: {
    test
  }
}
</script>
<style lang='stylus'>
.firstName
  font-weight 700
  font-size 14px
.name
  margin-left 20px
  font-weight 700
  font-size 14px
.red
  color #f00
  font-size 14px
.flashtable
  margin-top 20px
</style>
