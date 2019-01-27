<template>
  <base-table
    :data="tableData"
    :columns="columns"
    :total="total"
    @changePage="changePage">
  </base-table>
</template>

<script>
import { mixins } from 'mixins'
const columns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '材料馆名称',
    prop: 'name'
  },
  {
    label: '手机号/账号',
    prop: 'mobile'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '材料馆所在地',
    prop: 'op'
  },
  {
    label: '创建时间',
    prop: 'created_at'
  },
  {
    label: '状态',
    prop: 'status'
  }
]
export default {
  mixins: [mixins],
  data () {
    return {
      columns
    }
  },
  created () {
    this.getUserData()
  },
  methods: {
    getUserData () {
      let { page, pageSize } = this
      let url = 'boutique/getUserList'
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
    // 初始化表格数据
    handlerTableData (data) {
    data.forEach((item, index, arr) => {
      item.index = index + 1
    })
    },
    // 分页
    changePage (page) {
      this.page = page
      this.getRegisterData()
    }
  }
}
</script>

<style lang='stylus'>
</style>
