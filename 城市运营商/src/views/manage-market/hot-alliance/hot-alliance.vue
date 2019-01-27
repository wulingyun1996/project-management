<template>
  <div>
    <base-button :type="1" text="添加热门商圈" class="add-circle" @clickCurrentButton="goAdd"></base-button>
    <egrid
    border
    :data="data"
    :columns="columns"
    :columns-handler="columnsHandler">
    </egrid>
  <base-pagination :total="total" @changePage="changePage"></base-pagination>
  </div>
</template>

<script>
import TableButton from 'components/table-button'
import TableSort from 'components/table-sort'
import TableImg from 'components/table-image'
const columns = [
  { label: '商圈名称', prop: 'group_name' },
  { label: '圈内商家', prop: 'shop_count' },
  { label: '商圈标签', prop: 'tab' },
  { label: '状态', prop: 'on_status' },
  { label: '下架原因', prop: 'off_reason' }
]
const buttonList = [
  {
    text: '编辑',
    buttonType: 1
  },
  {
    text: '删除',
    buttonType: 4
  }
]
export default {
  data () {
    return {
      data: [],
      columns,
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    goAdd () {
      this.$router.push({
        path: '/manage-market/hot-alliance-add'
      })
    },
    getData (page = 1, pageSize = 10) {
      let url = '/union/unionGroupList'
      this.$http(url, {
        page: page,
        pageSize: pageSize
      }).then(res => {
        if (res.code === this.$ok) {
          this.data = res.data.data
          // this.data.map((item) => {
          //   item.src = 'http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg'
          //   item.width = 100
          // })
          this.total = res.data.total
        }
      })
    },
    changePage (page) {
      this.page = page
      this.getData(this.page)
    },
    removeCircleById (id) {
      let url = '/union/delUnionGroup'
      this.$http(url, {
        id
      }).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            message: '成功删除商圈',
            type: 'success'
          })
          this.getData(this.page, this.pageSize)
        }
      })
    },
    showConfirm (name, id) {
      this.$confirm(`是否确定删除"${name}"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.removeCircleById(id)
      })
    },
    sort (id, type) {
      let url = 'union/sort'
      this.$http(url, {
        id,
        type
      }).then(res => {
        if (res.code === this.$ok) {
          this.getData(this.page)
        }
      })
    },
    goEidt (id) {
      this.$router.push({
        path: '/manage-market/hot-alliance-add',
        query: {
          id
        }
      })
    },
    columnsHandler (cols) {
      var vm = this
      cols.forEach(item => {
        item.align = 'center'
      })
      cols.push({
        label: '操作',
        width: '180',
        align: 'center',
        component: TableButton,
        buttonList,
        listeners: {
          clickCurrentButton (row, type) {
            console.log(row)
            console.log(type)
            type === 1 ? vm.goEidt(row.id) : vm.showConfirm(row.group_name, row.id)
          }
        }
      })
      return cols.concat({
        label: '排序',
        align: 'center',
        width: 100,
        component: TableSort,
        sortMax: this.sortMax,
        sortMin: this.sortMin,
        listeners: {
          up (row) {
            vm.sort(row.id, 'up')
          },
          down (row) {
            vm.sort(row.id, 'down')
          }
        }
      })
      return cols.concat({
        label: '图片',
        align: 'center',
        component: TableImg
      })
    }
  },
  computed: {
    sortMax () {
      return Math.max(...this.data.map(item => item.sort))
    },
    sortMin () {
      return Math.min(...this.data.map(item => item.sort))
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.add-circle
  margin-bottom  30px
  .el-button
    width auto
</style>
