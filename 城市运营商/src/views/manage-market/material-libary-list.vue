<template>
  <div class="material-libary-container">
    <base-button
    class='addBtn'
    :type="1"
    text="添加"
    @clickCurrentButton="AddMaterials"
    v-show="isShow" >
    </base-button>
    <base-table
    :data="tableData"
    :columns="columns"
    :total="total"
    @changePage="changePage"
    :componentList="choosedComponentList"
    @buttonSubmit="operateCurrentRow"
    @sortCurrentRow="sortCurrentRow"
    >
    </base-table>
  </div>

</template>

<script>
import BaseTableImage from 'components/table-image'
import BaseTableButton from 'components/table-button'
import BaseTableSort from 'components/table-sort/table-sort'
import { mixins } from 'mixins'
const columns = [
  {
    label: '序号',
    prop: 'index'
  },
  {
    label: '材料图书馆名称',
    prop: 'materialName'
  },
  {
    label: '材料图书馆状态',
    prop: 'status'
  }
]
const options = [
  {
    label: '启用',
    value: 'start'
  },
  {
    label: '停用',
    value: 'stop'
  }
]
const buttonList = [  
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  },
  {
    text: '编辑',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
]
const choosedComponentList = [
  {
    component: BaseTableImage,
    label: '广告图片',
    insertIndex: 2,
    height: 100                                                                                                                                                                                              
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 4,
    width: 240,
    eventType: 'buttonSubmit'
  },
  {
    component: BaseTableSort,
    label: '排序',
    insertIndex: 5,
    width: 100,
    eventType: 'sortCurrentRow'
  }
]
export default {
  mixins: [mixins],
  data () {
    return {
      columns,
      options,
      choosedComponentList,
      tableData: [],
      arrPic: [],
      isShow: false
    }
  },
  computed: {
    showPagination () {
      return this.total > 10
    }
  },
  created () {
    this.getTableData()
  },
  methods :{
     // 获取表格数据
    getTableData () {
      let { page, pageSize } = this
      let url = 'adv/getMaterialMuseumPicture'
      let obj = {
        page,
        pageSize
      }
       this.$http(url,obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
         if( res.data.materialUserStatus === 1) {
           this.isShow = true
         } else {
           this.isShow = false
         }
        } 
      })
    },
      // 格式化表格数据
    handlerTableData (data) {
      let length = data.length
      data.forEach((item, index, arr) => {
        // 用来决定箭头的显示 0 => 不显示排序箭头，1 => 显示下箭头，2 => 显示排序上箭头，3 => 显示排序双箭头
        if (length === 1) item.showArrow = 0
        if (length !== 1 && index === 0) {
          item.showArrow = 1
        } else if (length !== 1 && index === length - 1) {
          item.showArrow = 2
        } else if (length !== 1 && index !== length - 1) {
          item.showArrow = 3
        }
        // 当前索引加 1，若对当前行操作，需要进行 减 1  
        item.src = item.index_img
        item.index = index + 1
        item.buttonList = JSON.parse(JSON.stringify(buttonList))
        if (item.status === 1) {
          item.status = '启用'
        } else {
          item.status = '停用'
        }
      })
    },
      // 根据点击按钮，操作当前行
    operateCurrentRow (row, type) {
      this.currentRow = row
      if (type === 3) {
        this.$router.push({ name: 'MaterialsDetails', query: { id: row.id } })
      }
      // 删除弹窗
      if (type === 4) {
        this.$mesBox('删除后对应材料馆将不在首页展示，确定删除吗？', '提示', 1, 1, '确定', '取消', this.deleteCurrentBannerButton)
      }
    },
      // 排序事件
    sortCurrentRow (row) {
      let { id, sortBy, sort } = row
      let url = 'adv/sortMaterialMuseum'
      let obj = {
        id,
        type: sortBy,
        sort
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getTableData()
        }
      })
    },
    // 新增图片
    AddMaterials () {
      this.$router.push({ name: 'AddMaterials' })
    },
       // 删除按钮
    deleteCurrentBannerButton (t) {
      if (t === 'confirm') {
        this.deleteCurrentBanner()
      }
    },
    // 删除接口
    deleteCurrentBanner () {
      let { id, index } = this.currentRow
      let url = 'adv/delMaterialMuseum'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.tableData.splice(index - 1, 1)
          this.judgeTableData()
          this.$mes('删除成功')
        }
      })
    },
    // 删除之后执行判断
    judgeTableData () {
      if (!this.tableData.length) {
        if (this.page === 1) return
        this.page--
      }
      this.getTableData()
    },
     // 分页
    changePage (page) {
      this.page = page
      this.getTableData()
    }
  }
}
</script>

<style lang='stylus'>

@import '~@/assets/css/mixins'
.material-libary-container
  .addBtn
    margin-bottom 10px;
</style>
