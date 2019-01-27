<template>
  <div class="materials-code-container">
    <div class="code-add">
      <base-button :type="2" text="新增" @clickCurrentButton="addCode"></base-button>
      <div class="search-info">
        <p>分类</p>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <base-button :type="2" text="搜索" @clickCurrentButton="searchClassifty"></base-button>
        <!-- <base-button :type="2" text="导出" @clickCurrentButton="educeClassifty"></base-button> -->
        <a :href="postExcel" class="post-excel" target="_blank">导出</a>
      </div>
    </div>
    <div class="materials-table">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        :componentList="materialsComponentList"
        @buttonSubmit="typeSubmit"
        @sellerTable="sellerTable"
        @auditStaff="auditStaff"
        @changePage="changePage"
        >
      </base-table>
    </div>
    <!-- 添加或修改位置码弹框 -->
    <el-dialog
      :title="message"
      :visible.sync="placeDialogVisible"
      width="30%"
      center>
      <el-input v-model="placeInput" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="20" placeholder="请输入位置码" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPlace">确定{{ text }}</el-button>
      </span>
    </el-dialog>
    <!-- 查看商品数量的弹框 -->
    <el-dialog :title="materialsName" :visible.sync="goodsTableVisible">
     <base-table
      :data="goodsData"
      :columns="goodsColumns"
      :total="total"
      :componentList="goodsComponentList"
      @changePage="goodsChangePage"
      >
    </base-table>
    </el-dialog>
    <!-- 没有材料馆的弹框 -->
    <el-dialog
      :visible.sync="noMaterilasDialogVisible"
      width="30%"
      center>
      <span>您还没有材料馆，不能创建材料馆二维码</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noMaterilasDialogVisible = false">返回</el-button>
        <!-- <el-button type="primary" @click="noMaterilasDialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import BaseTableImage from 'components/table-image'
import BaseTableClickT from 'components/table-clickT'
import BaseTableCustomButton from 'components/table-custom/manage-shop'
import { mixins } from 'mixins'
const columns = [
  {
    label: '序号',
    prop: 'index',
    width: 150
  },
  {
    label: '分类',
    prop: 'cate_title'
  },
  {
    label: '属性共同点',
    prop: 'attr'
  },
  {
    label: '价格范围',
    prop: 'price_area'
  },
  {
    label: '创建时间',
    prop: 'created_at'
  }
]
const goodsColumns = [
  {
    label: '商铺编号',
    prop: 'product_code'
  },
  {
    label: '商品名称',
    prop: 'title'
  },
  {
    label: '市场标价',
    prop: 'price'
  },
  {
    label: '零售现价',
    prop: 'promotion_price'
  },
  {
    label: '特约采购师价',
    prop: 'purchase_price'
  },
  {
    label: '商家名称',
    prop: 'shop_name'
  }
]
const materialsList = [
  {
    text: '下载二维码',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '编辑',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
// 添加位置吗-- 插入按钮组件
let passedButtonList1 = {
  text: '添加',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  staffNum: '未设置'
}
// 修改位置吗 -- 插入按钮组件
let passedButtonList2 = {
  text: '修改',
  buttonType: 2,
  type: 'primary',
  size: 'small'
}
const goodsComponentList = [
  {
    component: BaseTableImage,
    label: '图片',
    insertIndex: 1,
    height: 100
  }
]
const materialsComponentList = [
  {
    component: BaseTableImage,
    label: '二维码',
    insertIndex: 3,
    height: 100
  },
  {
    component: BaseTableCustomButton,
    label: '场馆位置代码',
    insertIndex: 4,
    width: 200,
    eventType: 'auditStaff'
  },
  {
    component: BaseTableClickT,
    label: '商品数量',
    insertIndex: 5,
    eventType: 'sellerTable'
  },
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseTableButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    // 要插入的索引                                                              --> Number
    insertIndex: 8,
    buttonList: materialsList,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'buttonSubmit'
  }
]
export default {
  name: 'MaterialsList',
  mixins: [mixins],
  data () {
    return {
      message: '',
      text: '',
      placeId: '',
      placeDialogVisible: false, // 位置码
      goodsTableVisible: false, // 查看商品
      noMaterilasDialogVisible: false,
      placeInput: '',
      input: '',
      columns,
      goodsData: [],
      goodsColumns,
      goodsComponentList,
      materialsComponentList,
      materialsName: '' , // 材料馆名称
      cityId: '',
      provinceId: '',
      goodsId: ''
    }
  },
  created () {
    this.getData()
    this.getCity()
  },
  methods: {
    getCity () {
      this.$http('userInfo').then(res => {
        if (res.code === this.$ok) {
          this.cityId = res.data.service_city
          this.provinceId = res.data.service_province
        }
      })
    },
    getMaterials () {
      let url = 'adv/getMaterialMuseumList'
      // let catId = this.idList.split(',')
      this.$http(url, { is_all : 1}).then(res => {
        if (res.code === this.$ok) {
          if (!res.data.length) {
            // this.$message({
            //   message: '您还没有材料馆，不能创建材料馆二维码'
            // })
            this.noMaterilasDialogVisible = true
            return
          } else {
            this.$router.push('/manage-materials/add-materials-code')
          }
        }
      })
    },
    getData () {
      let { page, pageSize } = this
      let url = 'materialQr/list'
      let obj = {
        page,
        pageSize,
        keyWord: this.input
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
    // 数据处理
    handlerTableData (data) {
      data.forEach((item, index, arr) => {
        let passedButtonList = JSON.parse(JSON.stringify(passedButtonList1))
        let passedButtonListTwo = JSON.parse(JSON.stringify(passedButtonList2))
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        // this.sellerCount = item.goods.count
        item.src = item.qr
        item.customTextT = item.goods
        if (item.place === '') {
          passedButtonList.show = false
          item.customButtonList = passedButtonList
        } else {
          passedButtonListTwo.show = false
          passedButtonListTwo.staffNum = item.place
          item.customButtonList = passedButtonListTwo
        }
      })
    },
    // 按钮事件
    typeSubmit (row, type) {
      if (type === 4) {
        this.$confirm('您确定要删除该二维码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = 'materialQr/del'
          let obj = {
            id: row.id
          }
          this.$http(url, obj).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (type === 1) {
        this.$router.push({ name: 'AddMaterialsCode', query: { id: row.id } })
      }
      if (type === 3) {
        let url = process.env.VUE_APP_API_ROOT +'materialQr/download/' + row.id
        window.location.href = url
        this.$message({
          message: '下载成功',
          type: 'success'
        })
      }
    },
    // 分页事件
    changePage (page) {
      this.page = page
      this.getData()
    },
    // 商品分页事件
    goodsChangePage (page) {
      this.page = page
      this.getGoodsChang()
    },
    // 搜索事件
    searchClassifty () {
      this.page = 1
      this.getData()
    },
    // 商品弹框分页
    getGoodsChang () {
      let { page, pageSize } = this
      let url = 'materialQr/goodsInfo'
      let obj = {
        id: this.goodsId,
        page,
        pageSize,
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.goodsData = res.data.data
          this.total = res.data.total
          res.data.data.forEach(item => {
            item.src = item.image_path
          })
        }
      })
    },
    // 商品数量弹框
    sellerTable (row) {
      this.goodsTableVisible = true
      this.materialsName = row.material_name
      this.goodsId = row.id
      this.getGoodsChang()
    },
    // 设置位置码弹框
    auditStaff (row, type) {
      this.placeDialogVisible = true
      if (type === 1) {
        this.message = '添加场馆位置码'
        this.text = '添加'
        this.placeInput = row.place
        this.placeId = row.id
      }
      if (type === 2) {
        this.message = '修改场馆位置码'
        this.text = '修改'
        this.placeInput = row.place
        this.placeId = row.id
      }
    },
    // 设置位置码
    setPlace () {
      let url = 'materialQr/editPlace'
      let obj = {
        id: this.placeId,
        place: this.placeInput
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getData()
          this.placeDialogVisible = false
          this.placeInput = ''
        }
        if (res.code === 400) {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 新增二维码
    addCode () {
      this.getMaterials()
    }
  },
  computed: {
    postExcel () {
      let URL = `http://test-cityapi.cgs18.com/v1/materialQr/export?city=${this.cityId}&province=${this.provinceId}&keyWord=${this.input}`
      return URL
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.materials-code-container
  .code-add
    display flex
    align-items center
    justify-content space-between
    .search-info
      display flex
      align-items center
      margin-right 100px
      p
        width 100px
        height 40px
        text-align center
        line-height 40px
        border 1px solid #ccc
      a
        display block
        width 100px
        height 32px
        margin-left 20px
        border-radius 2px
        text-align center
        line-height 32px
        color #fff
        background-color #67c23a
      .base-button-item
        margin-left 20px
  .materials-table
    margin-top 30px
</style>
