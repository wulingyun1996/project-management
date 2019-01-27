<template>
  <div class="payment-flow-container">
    <base-table
      :data="tableData"
      :columns="columns"
      :total="total"
      @changePage="changePage">
    </base-table>
  </div>
</template>

<script>
import { mixins } from 'mixins'
const columns = [
  {
    label: '序号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '店铺名称',
    prop: 'shopName'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '申请时间',
    prop: 'created_time'
  },
  {
    label: '付款金额',
    prop: 'pay_money'
  },
  {
    label: '付款时间',
    prop: 'pay_at'
  },
  {
    label: '付款方式',
    prop: 'pay_type'
  }
]
export default {
  name: 'MarketAnnouncement',
  mixins: [mixins],
  data () {
    return {
      columns
    }
  },
  created () {
    this.getPayMentFlow()
  },
  methods: {
    getPayMentFlow () {
      let { page, pageSize } = this
      let url = 'seller/getSellerHistoryList'
      let obj = {
        page,
        pageSize
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
      })
    },
    handlerTableData (data) {
      data.forEach((item, index, arr) => {
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        item.shopName = item.shopName ? item.shopName : '/'
        item.contact = item.contact ? item.contact : '/'
        item.mobile = item.mobile ? item.mobile : '/'
        item.address = item.address ? item.address : '/'
        item.pay_money = item.pay_money ? item.pay_money : 0
      })
    },
    changePage (page) {
      this.page = page
      this.getPayMentFlow()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'

</style>
