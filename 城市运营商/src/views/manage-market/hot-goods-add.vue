<template>
  <div class="hot-goods-add-container">
    <h1>添加爆款商品</h1>
    <div class="index-banner-start-time">
      <base-time-picker
        @pickerTime="pickerStartTime"
        dataType="datetime"
        placeholder="选择开始时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="开始时间：">
      </base-time-picker>
    </div>
    <div class="index-banner-end-time">
      <base-time-picker
        @pickerTime="pickerEndTime"
        dataType="datetime"
        placeholder="选择结束时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="结束时间：">
      </base-time-picker>
    </div>
    <div class="add-goods-button">
      <span>爆款分类</span>
      <el-select v-model="classifyName" filterable placeholder="请选择">
        <el-option
          v-for="item in optionsList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <!-- <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button> -->
    </div>
    <div class="add-goods-button">
      <span>爆款商品</span>
      <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button>
    </div>
    <base-table
      v-show="choosedDataLenth"
      :data="selectedData"
      :columns="selectedColumns"
      :total="1"
      :limit-total="999"
      :componentList="selectedComponentList"
      @buttonSubmit="deleteCurrentData">
    </base-table>
    <!-- 选择商品弹窗 -->
    <div class="choose-goods-container" v-show="isShowTable">
      <div class="choose-goods-wrapper">
        <div class="choose-goods-title">
          <span>添加商品</span>
          <i class="el-icon-close" @click="closePopup"></i>
        </div>
        <div class="choose-goods-header">
          <p>添加到限时抢购里的商品 不可以再添加到爆款商品里</p>
          <div>
            <base-select
              placeholder="请选择"
              :options="options"
              @changeCurrentOption="getSearchType">
            </base-select>
            <base-input
              placeholder="请输入关键字查找"
              @changeInputValue="getSearchKeyWords"
              class="search-input">
            </base-input>
            <base-button
              :type="1"
              text="搜索"
              @clickCurrentButton="searchList">
            </base-button>
          </div>
        </div>
        <div class="choose-goods-body">
          <base-table
            :data="tableData"
            :total="total"
            :columns="columns"
            :tableHeight="300"
            :componentList="componentList"
            columnType="selection"
            @selectionChange="selectAll"
            @changePage="changeALLPage">
          </base-table>
        </div>
        <div class="choos-goods-comfirm">
          <base-button
            text="确定"
            :type="1"
            @clickCurrentButton="confirmChoosedGoods">
          </base-button>
          <base-button
            text="取消"
            @clickCurrentButton="closePopup">
          </base-button>
        </div>
      </div>
    </div>
    <!-- 提交新增与编辑 -->
    <div class="seperate"></div>
    <div class="edit-button" v-show="choosedDataLenth">
      <base-button :type="1" text="确认提交" @clickCurrentButton="comfirmSubmitContent"></base-button>
      <base-button text="放弃" @clickCurrentButton="giveupSubmitContent"></base-button>
    </div>
  </div>
</template>

<script>
import BaseTableImage from 'components/table-image'
import BaseTableButton from 'components/table-button'
import { mixins } from 'mixins'
import { initTime } from 'utils/common'
// 下列表格筛选框
// 1商品名搜索,2商品id搜索（多个用英文逗号隔开）,3商品编号,4商家名称搜索,5品牌搜索
const options = [
  {
    label: '标题',
    value: 1
  },
  {
    label: '商品编号',
    value: 3
  },
  {
    label: '店铺名称',
    value: 4
  },
  {
    label: '品牌',
    value: 5
  }
]
// 已添加的表格数据
const selectedColumns = [
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
  }
]
// 插入按钮组件
const buttonList = [
  {
    text: '删除',
    buttonType: 4,
    type: 'primary',
    size: 'small'
  }
]
const selectedComponentList = [
  {
    component: BaseTableImage,
    label: '商品图片',
    insertIndex: 2,
    height: 100
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    width: 100,
    buttonList,
    eventType: 'buttonSubmit'
  }
]
// 弹窗表格数据
const columns = [
  {
    label: '商品编号',
    prop: 'product_code'
  },
  {
    label: '标题',
    prop: 'title'
  },
  {
    label: '店铺名称',
    prop: 'seller_id'
  },
  {
    label: '品牌',
    prop: 'brand'
  },
  {
    label: '零售标价',
    prop: 'price'
  },
  {
    label: '直采价',
    prop: 'purchase_price'
  },
  {
    label: '库存',
    prop: 'stock'
  }
]
// 弹窗表格图片组件
const componentList = [
  {
    component: BaseTableImage,
    label: '商品图',
    insertIndex: 1,
    height: 100
  }
]
export default {
  name: 'AddHotGoods',
  mixins: [mixins],
  data () {
    return {
      startTime: '',
      endTime: '',
      options,
      searchType: 0,
      searchKeyWords: '',
      selectedColumns,
      selectedData: [],
      selectedComponentList,
      columns,
      componentList,
      selectedMoreData: [],
      isShowTable: false,
      optionsList: [],
      classifyName: ''
    }
  },
  created () {
    this.getClassifyData()
  },
  computed: {
    choosedDataLenth () {
      return this.selectedData.length
    }
  },
  methods: {
    getClassifyData () {
      let url = 'adv/classifyData'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.optionsList = res.data
          this.classifyName = res.data[0].id
        }
      })
    },
    handlerTableData (data) {
      data.forEach(item => {
        item.src = item.image_path
      })
    },
    pickerStartTime (t) {
      this.startTime = t
    },
    pickerEndTime (t) {
      this.endTime = t
    },
    addGoods () {
      this.isShowTable = true
      this.getHotList()
    },
    getHotList () {
      let url = 'adv/getGoods'
      let obj = {
        type: this.searchType,
        key_word: this.searchKeyWords,
        page: this.page,
        pageSize: this.pageSize
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          // return
        }
        // this.$mes(res.message, 4)
      })
    },
    getSearchType (val) {
      this.searchType = val
    },
    getSearchKeyWords (val) {
      this.searchKeyWords = val
    },
    deleteCurrentData (row) {
      let { id } = row
      this.selectedData.forEach((item, index, arr) => {
        if (item.id === id) {
          arr.splice(index, 1)
        }
      })
    },
    // 弹窗
    closePopup () {
      this.isShowTable = false
      this.selectedMoreData = []
    },
    // 多选
    selectAll (rows) {
      this.selectedMoreData = rows
    },
    // 多选确定
    confirmChoosedGoods () {
      if (!this.selectedMoreData.length) {
        this.$mes('您还未添加商品', 2)
      }
      this.isShowTable = false
      this.selectedMoreData.forEach(item => {
        this.selectedData.push(item)
      })
      this.selectedData.forEach((item, index) => {
        item.index = index + 1
      })
    },
    // 分页
    changeALLPage (page) {
      this.page = page
      this.getHotList()
    },
    // 搜索
    searchList () {
      this.page = 1
      this.getHotList()
    },
    comfirmSubmitContent () {
      if (!this.validateCommonFileds()) return
      let arr = []
      this.selectedData.forEach(item => {
        arr.push(item.id)
      })
      let url = 'adv/addHot'
      /* eslint-disable */
      let obj = {
        goods_id: arr.join(),
        start_date: this.startTime,
        end_date: this.endTime,
        category_id: this.classifyName
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('添加成功')
          this.$router.back()
          // return
        }
        // this.$mes(res.message, 4)
      })
    },
    giveupSubmitContent () {
      this.$router.back()
    },
    // 新增或者编辑提交校验 ---- 公共校验
    validateCommonFileds () {
      const nowTime = new Date() - 0
      if (!this.startTime) {
        this.$mes('开始时间不能为空', 2)
        return false
      }
      if (initTime(this.startTime) < nowTime) {
        this.$mes('开始时间需大于当前时间', 2)
        return false
      }
      if (!this.endTime) {
        this.$mes('结束时间不能为空', 2)
        return false
      }
      if (initTime(this.endTime) <= initTime(this.startTime)) {
        this.$mes('结束时间需大于开始时间', 2)
        return false
      }
      if (!this.selectedData.length) {
        this.$mes('您还未添加商品', 2)
        return false
      }
      return true
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.hot-goods-add-container
  h1
    margin 0
    margin-bottom 20px
    f24()
  .index-banner-start-time,
  .index-banner-end-time,
  .add-goods-button
    flex-f-align()
    margin-bottom 20px
  .add-goods-button
    >span
      margin-right 25px
  // 选择商品弹窗
  .choose-goods-container,
  .alliance-add-table
    wh(100%)
    position absolute
    left 0
    top 0
    background rgba(0, 0, 0, .4)
    .choose-goods-wrapper
      width 1300px
      padding 20px
      padding-bottom 0
      z-index 999
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      background #fff
      .choose-goods-title
        flex-align-item()
        background #f8f8f8
        bd-b($color-e)
        height 40px
        margin-top -20px
        margin-left -20px
        margin-right -20px
        padding 0 20px
        i
          cursor pointer
      .choose-goods-header
        padding-bottom 20px
        flex-align-item()
        p
          color #f00
          f14()
        > div
          flex-f-align()
        .search-input
          margin 0 10px
      .choose-goods-body
        height 380px
      .choos-goods-comfirm
        flex-f-align()
        justify-content flex-end
        padding 0 20px
        padding-bottom 20px
        margin-top -10px
        >div
          margin-right 10px
  .seperate
    height 1px
    background #ccc
    margin 20px 0
  .edit-button
    flex-f-align()
    justify-content center
    >div
      margin-right 10px
      f14()
</style>
