<template>
  <div class="hot-goods-add-container" v-if="flag">
    <h1>编辑爆款商品</h1>
    <div class="index-banner-start-time">
      <base-time-picker
        @pickerTime="pickerStartTime"
        dataType="datetime"
        :data-time="startTime"
        placeholder="选择开始时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="开始时间：">
      </base-time-picker>
    </div>
    <div class="index-banner-end-time">
      <base-time-picker
        @pickerTime="pickerEndTime"
        dataType="datetime"
        :data-time="endTime"
        placeholder="选择结束时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="结束时间：">
      </base-time-picker>
    </div>
    <div class="add-goods-button">
      <span>爆款分类</span>
      <el-select v-model="classifyName" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <!-- <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button> -->
    </div>
    <base-table
      :data="tableData"
      :columns="selectedColumns"
      :total="total"
      :componentList="selectedComponentList"
      @buttonSubmit="deleteCurrentData">
    </base-table>
    <!-- 提交新增与编辑 -->
    <div class="seperate"></div>
    <div class="edit-button">
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
export default {
  name: 'AddHotGoods',
  mixins: [mixins],
  data () {
    return {
      flag: false,
      startTime: '',
      endTime: '',
      selectedColumns,
      selectedComponentList,
      options: [],
      classifyName: ''
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    goods_id () {
      return this.$route.query.goods_id
    }
  },
  created () {
    this.getGoodsDetail()
    this.getClassifyData()
  },
  methods: {
    getClassifyData () {
      let url = 'adv/classifyData'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.options = res.data
          this.classifyName = res.data[0].id
        }
      })
    },
    pickerStartTime (t) {
      this.startTime = t
    },
    pickerEndTime (t) {
      this.endTime = t
    },
    getGoodsDetail () {
      let url = 'adv/editInfo'
      let obj = {
        hot_id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          res.data.src = res.data.image_path
          res.data.index = 1
          this.startTime = res.data.start_time
          this.endTime = res.data.end_time
          this.tableData.push(res.data)
          this.flag = true
          // return
        }
        // this.$mes(res.message, 4)
      })
    },
    deleteCurrentData (row) {
      this.tableData = []
    },
    comfirmSubmitContent () {
      if (!this.validateCommonFileds()) return
      let url = 'adv/editHot'
      /* eslint-disable */
      let obj = {
        goods_id:  this.goods_id,
        start_date: this.startTime,
        end_date: this.endTime,
        category_id: this.classifyName
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('编辑成功')
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
      // if (initTime(this.startTime) < nowTime) {
      //   this.$mes('开始时间需大于当前时间', 2)
      //   return false
      // }
      if (!this.endTime) {
        this.$mes('结束时间不能为空', 2)
        return false
      }
      if (initTime(this.endTime) <= initTime(this.startTime)) {
        this.$mes('结束时间需大于开始时间', 2)
        return false
      }
      if (initTime(this.endTime) <= nowTime) {
        this.$mes('结束时间需大于当前时间', 2)
        return false
      }
      if (!this.tableData.length) {
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
        flex-f-align()
        justify-content flex-end
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
    background $color-c
    margin 20px 0
  .edit-button
    flex-f-align()
    justify-content center
    >div
      margin-right 10px
      f14()
</style>
