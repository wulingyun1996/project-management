<template>
  <div class="business">
    <div class="business-button">
      <el-button type="success" @click="addemit">新增</el-button>
       <el-button type="primary" @click="board">广告位</el-button>
    </div>
    <div class="business-table">
        <el-table
          ref="singleTable"
          :data="data"
          border
          :align="aligning"
          style="width: 100%">
          <el-table-column
            type="index"
            width="100"
            label=" ">
          </el-table-column>
          <el-table-column
            property="conpany_name"
            label="公司名称"
            width="200">
          </el-table-column>
          <el-table-column
            property="shop_name"
            label="店铺名称"
            >
          </el-table-column>
          <el-table-column
            property="brand_name"
            label="品牌"
           >
          </el-table-column>
          <el-table-column
            property="region_name"
            label="服务城市"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="300"
           >
            <template slot-scope="scope">
              <el-button
                type="success"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>
<script>
import buttonn from 'components/button/index'
const data = []
export default {
  data () {
    return {
      aligning: 'center',
      data,
      total: 20,
      pageSize: 10
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http('adv/getRecommendMerchantList').then(res => {
        console.log(res)
        this.data = res.data.data
        res.data.data.forEach(ele => {
          if (ele.brand_name === '') {
            ele.brand_name = '/'
          }
          if (ele.conpany_name === null) {
            ele.conpany_name = '/'
          }
          if (ele.region_name === '') {
            ele.region_name = '/'
          }
        })
      })
    },
    addemit () {
      this.$router.push('/manage-market/add-business-compile')
    },
    board () {
      this.$router.push('/manage-market/recommended-advertising')
    },
    handleEdit (row) {
      this.$router.push({ path: '/manage-market/hot-business-compile', query: { id: row.id } })
    },
    handleDelete (row) {
      this.$confirm('你确定要删除吗？ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http('adv/delRecommendMerchant', { id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage (page) {
      this.page++
      this.getTableData()
    }
  },
  components: {
    buttonn
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.cell
  text-align center
.business-button
  width 180px
  height 40px
  display flex
  justify-content space-between
.business-table
  margin-top 30px

</style>
