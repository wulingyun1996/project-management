<template>
  <div class="recommend-goods-container">
    <div class="recommend-header">
      <div class="recommed-button">
        <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button>
        <base-button :type="4" text="批量删除" @clickCurrentButton="deleteAllSelectButton"></base-button>
      </div>
      <div class="recommed-search">
        <base-select
          :options="options"
          @changeCurrentOption="changeCurrentOption"
          placeholder="请选择"
          class="select-options">
        </base-select>
        <base-input
          @changeInputValue="changeInputValue"
          placeholder="请输入关键字"
          class="input-wapper">
        </base-input>
        <base-button
          :type="1"
          @clickCurrentButton="searchTableData"
          text="搜索">
        </base-button>
      </div>
    </div>
    <div class="recommend-body">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        :componentList="choosedComponentList"
        columnType="selection"
        @selectionChange="selectAll"
        @buttonSubmit="operateCurrentRow"
        @changePage="changePage"
        @sortCurrentRow="sortCurrentRow"
        >
      </base-table>
    </div>
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
    label: '商品编号',
    prop: 'product_code'
  },
  {
    label: '商品名称',
    prop: 'title'
  },
  {
    label: '商品状态',
    prop: 'sale'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '市场标价',
    prop: 'price'
  },
  {
    label: '特约采购师价',
    prop: 'purchase_price'
  },
  {
    label: '库存',
    prop: 'stock'
  },
  {
    label: '开始时间',
    prop: 'start_time'
  },
  {
    label: '结束时间',
    prop: 'end_time'
  }
]
const options = [
  {
    label: '商品名称',
    value: 1
  },
  {
    label: '商品编号',
    value: 2
  },
  {
    label: '店铺名称',
    value: 3
  }
]
const buttonList = [
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const choosedComponentList = [
  {
    component: BaseTableImage,
    label: '商品图片',
    insertIndex: 3,
    height: 100
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 11,
    width: 100,
    buttonList: buttonList,
    eventType: 'buttonSubmit'
  },
  {
    component: BaseTableSort,
    label: '排序',
    insertIndex: 12,
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
      type: '',
      key_word: '',
      deleteSelect: [],
      currentRow: {}
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    getTableData () {
      let url = 'adv/getRecommendList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        type: this.type,
        key_word: this.key_word
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
        this.$mes(res.message, 4)
      })
    },
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
        item.src = item.image_path
        item.index = index + 1
        if (item.sale === 1) {
          item.sale = '已下架'
        } else {
          item.sale = '已上架'
        }
      })
    },
    // 下拉框
    changeCurrentOption (option) {
      this.type = option
    },
    // input 输入框
    changeInputValue (value) {
      this.key_word = value
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.getTableData()
    },
    // 批量删除的数组
    selectAll (rows) {
      this.deleteSelect = rows
    },
    // 分页事件
    changePage (page) {
      this.page = page
      this.getTableData()
    },
    // 排序事件
    sortCurrentRow (row) {
      let { id, sortBy, sort } = row
      let url = 'adv/sortRecommendGoods'
      let obj = {
        goods_id: id,
        type: sortBy,
        sort
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getTableData()
        }
      })
    },
    // 按钮事件
    operateCurrentRow (row, type) {
      this.currentRow = row
      // 删除弹窗
      if (type === 4) {
        this.$mesBox(`您确定要删除" ${row.title} "吗`, '提示', 1, 1, '确定', '取消', this.deleteCurrentBannerButton)
      }
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
      let url = 'adv/delRecommend'
      let obj = {
        goods_id: id
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
    // 全部删除按钮弹窗
    deleteAllSelectButton () {
      if (!this.deleteSelect.length) {
        this.$mes('请选择要删除的列', 2)
        return
      }
      this.$mesBox(`您确定要批量删除吗`, '提示', 1, 1, '确定', '取消', this.comfirmDeleteAll)
    },
    // 确定删除全部
    comfirmDeleteAll (t) {
      if (t === 'confirm') {
        let arr = []
        let id
        this.deleteSelect.forEach(item => {
          arr.push(item.id)
        })
        id = arr.join()
        this.deleteAll(id)
      }
    },
    // 删除全部的接口
    deleteAll (id) {
      let url = 'adv/delRecommend'
      let obj = {
        goods_id: id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('删除成功')
          this.getTableData()
        }
      })
    },
    // 添加商品
    addGoods () {
      this.$router.push({ name: 'recommendGoodsAdd' })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.recommend-goods-container
  .recommend-header
    flex-align-item()
    margin-bottom 10px
    .recommed-button
      flex-f()
      >div:first-child
        margin-right 10px
    .recommed-search
      flex-align-item()
      .select-options
        margin 0 10px
        width 150px
      .input-wapper
        width 150px
        margin-right 20px
</style>
