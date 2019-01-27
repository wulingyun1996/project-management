<template>
  <div class="index-banner-container">
    <div class="index-banner-header">
      <div class="banner-modify">
        <base-button :type="2" text="新增" @clickCurrentButton="addIndexBanner"></base-button>
        <base-button :type="4" text="批量删除" @clickCurrentButton="deleteAllSelectButton"></base-button>
      </div>
      <div class="banner-filter">
        <base-time-picker
          dataType="date"
          @pickerTime="pickerStartTime"
          timeText="结束时间">
        </base-time-picker>
        <base-select
          :options="options"
          @changeCurrentOption="changeCurrentOption"
          placeholder="状态"
          class="select-options">
        </base-select>
        <base-input
          @changeInputValue="changeInputValue"
          placeholder="请输入广告名称"
          class="input-wapper">
        </base-input>
        <base-button
          :type="1"
          @clickCurrentButton="searchTableData"
          text="搜索">
        </base-button>
      </div>
    </div>
    <div class="index-banner-body">
      <div class="table-container">
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
  </div>
</template>

<script>
import BaseTableImage from 'components/table-image'
import BaseTableButton from 'components/table-button'
import BaseTableSort from 'components/table-sort/table-sort'
import { mixins } from 'mixins'
const columns = [
  {
    label: '广告序号',
    prop: 'index'
  },
  {
    label: '广告名称',
    prop: 'title'
  },
  {
    label: '广告链接/商品号',
    prop: 'url'
  },
  {
    label: '开始时间',
    prop: 'start_time'
  },
  {
    label: '结束时间',
    prop: 'end_time'
  },
  {
    label: '当前状态',
    prop: 'bannerStatus'
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
    text: '停用',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '编辑',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
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
    label: '广告图片',
    insertIndex: 2,
    height: 100
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 8,
    width: 240,
    eventType: 'buttonSubmit'
  },
  {
    component: BaseTableSort,
    label: '排序',
    insertIndex: 9,
    width: 100,
    eventType: 'sortCurrentRow'
  }
]
export default {
  name: 'IndexBanner',
  mixins: [mixins],
  data () {
    return {
      columns,
      options,
      choosedComponentList,
      deleteSelect: [],
      startTime: '',
      endTime: '',
      filterStatus: '',
      adName: '',
      currentRow: {}
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    showPagination () {
      return this.total > 10
    }
  },
  methods: {
    // 获取表格数据
    getTableData () {
      let url = 'adv/getAdvList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        start_time: this.startTime,
        end_time: this.endTime,
        title: this.adName,
        status: this.filterStatus
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
        item.src = item.image
        item.index = index + 1
        item.buttonList = JSON.parse(JSON.stringify(buttonList))
        if (item.status === 1) {
          item.bannerStatus = '停用'
          item.buttonList[0].text = '启用'
        } else {
          item.bannerStatus = '启用'
          item.buttonList[0].text = '停用'
        }
        if (item.type_style === 3) item.url = '图文内容'
        if (item.type_style !== 3 && item.goods_product_code) item.url = item.goods_product_code
        if (item.type_style !== 3 && !item.goods_product_code) item.url = '/'
      })
    },
    // 新增轮播图
    addIndexBanner () {
      this.$router.push({ name: 'IndexBannerAdd' })
    },
    // 时间选择器
    pickerStartTime (t) {
      // 清空日期的时候赋值为空
      if (!t) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = t[0]
      this.endTime = t[1]
    },
    // 下拉框
    changeCurrentOption (option) {
      this.filterStatus = option
    },
    // input 输入框
    changeInputValue (value) {
      this.adName = value
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.getTableData()
    },
    // 根据点击按钮，操作当前行
    operateCurrentRow (row, type) {
      this.currentRow = row
      // 启用/停用弹窗
      if (type === 1) {
        this.$mesBox(`您确定要${row.buttonList[0].text}" ${row.title} "吗`, '提示', 1, 1, '确定', '取消', this.openOrCloseButton)
        return
      }
      if (type === 3) {
        this.$router.push({ name: 'IndexBannerEdit', query: { id: row.id } })
      }
      // 删除弹窗
      if (type === 4) {
        this.$mesBox(`您确定要删除" ${row.title} "吗`, '提示', 1, 1, '确定', '取消', this.deleteCurrentBannerButton)
      }
    },
    // 启用或者停用按钮
    openOrCloseButton (t) {
      // 点击确定执行启用停用操作
      if (t === 'confirm') {
        this.openOrClose()
      }
    },
    // 启用/停用接口
    openOrClose () {
      let { id, status, index } = this.currentRow
      let isOpen = status === 1 // 启用判断
      status = isOpen ? 2 : 1
      let url = 'adv/changeStatusPic'
      let obj = {
        id,
        status
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (isOpen) {
            this.currentRow.buttonList[0].text = '停用'
            this.currentRow.bannerStatus = '启用'
          } else {
            this.currentRow.buttonList[0].text = '启用'
            this.currentRow.bannerStatus = '停用'
          }
          this.currentRow.status = status
          this.tableData.splice(index - 1, 1, this.currentRow)
        }
      })
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
      let url = 'adv/delIndexPic'
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
      let url = 'adv/delIndexPic'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('删除成功')
          this.getTableData()
        }
      })
    },
    selectAll (rows) {
      this.deleteSelect = rows
    },
    // 排序事件
    sortCurrentRow (row) {
      let { id, sortBy, sort } = row
      let url = 'adv/changeIndexPicSort'
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
    changePage (page) {
      this.page = page
      this.getTableData()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.index-banner-header
  flex-align-item()
  margin-bottom 10px
  .banner-modify
    flex-f()
    >div:first-child
      margin-right 10px
  .banner-filter
    flex-align-item()
    .select-options
      margin 0 10px
      width 150px
    .input-wapper
      width 150px
      margin-right 20px
</style>
