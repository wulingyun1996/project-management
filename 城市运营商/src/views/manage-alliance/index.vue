<template>
  <div class="manage-alliance-container">
    <div class="page-header">
      <div class="time-select">
        <base-time-picker
          timeText="时间："
          @pickerTime="pickerTime">
        </base-time-picker>
      </div>
      <div>
        <base-select
          :options="options"
          placeholder="所有状态"
          @changeCurrentOption="getActivityStatus">
        </base-select>
      </div>
      <div>
        <base-select
          :options="optionsT"
          placeholder="活动主题"
          @changeCurrentOption="getActivityTheme">
        </base-select>
      </div>
      <div>
        <base-input
          text="请输入关键字"
          @changeInputValue="getSearchKeyWords">
        </base-input>
      </div>
      <base-button
        text="搜索"
        :type="1"
        @clickCurrentButton="clickSearch">
      </base-button>
    </div>
    <base-table
      :data="data"
      :total="total"
      :pageSize="pageSize"
      :columns="columns"
      :componentList="componentList"
      :buttonCellWidth="150"
      @buttonSubmit="buttonSubmit"
      @dialogVisible="dialogVisible"
      @sellerTable="sellerTable"
      @changePage="changePage"
      >
    </base-table>
    <div class="look-details">
      <el-dialog  :visible.sync="centerDialogVisible"
      center>
        <h3>{{ detailsData.title }}</h3>
        <div class="topicDetails"><img :src="detailsData.image_path" alt=""></div>
        <div class="topicDetails"><span>时间：</span>{{ detailsData.created_at }}<span>至{{ detailsData.end_at }}</span></div>
        <div class="topicDetails"><span>地点：</span><span>{{detailsData.province}}-{{detailsData.city}}-{{detailsData.area}}</span></div>
        <div class="topicDetails"><span>费用：</span>{{ detailsData.cost }}<span></span></div>
        <div class="topicDetails"><span>参与品牌：</span>
          <ul class="brandImg">
            <li v-for="index in detailsData.brands" :key="index"><img :src="index" alt=""></li>
          </ul>
        </div>
        <div class="topicDetails">
          <span>活动详情：</span>
          <div class="detailsImg" v-html="detailsData.description"></div>
        </div>
      </el-dialog>
    </div>
    <div class="business-details">
      <el-dialog
      :visible.sync="businessDetails"
      center>
      <p><span>商圈名称：</span><span>{{ union_name }}</span></p>
        <base-table
          :data="sellerData"
          :columns="columnsN"
          :total="totalT"
          :pageSize="pageSize"
          >

        </base-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BaseButton from 'components/table-button'
import BaseTableClick from 'components/table-click'
import BaseTableClickT from 'components/table-clickT'
import { initTime } from 'utils/common'
const columns = [
  { label: '编号', prop: 'index' },
  { label: '账号', prop: 'mobile' },
  { label: '商圈名称', prop: 'union_name' },
  { label: '转发量', prop: 'rotat' },
  { label: '浏览量', prop: 'view_num' },
  { label: '提交资料数', prop: 'count' },
  { label: '支付数', prop: 'success' },
  { label: '活动开始时间', prop: 'start_at' },
  { label: '活动结束时间', prop: 'end_at' },
  { label: '活动创建时间', prop: 'created_at' },
  { label: '活动状态', prop: 'activityStatus' }
]
// 圈内商家表格数据
const columnsN = [
  { label: '序号', prop: 'index' },
  { label: '姓名', prop: 'contacts' },
  { label: '手机号', prop: 'service_mobile' },
  { label: '店铺名称', prop: 'shop_name' },
  { label: '所属区域', prop: 'area' }
]
const buttonList = [
  {
    text: '下架',
    buttonType: 4
  }
]
const options = [
  {
    label: '未开始',
    value: -1
  },
  {
    label: '进行中',
    value: 1
  },
  {
    label: '已结束',
    value: 2
  }

]
const optionsT = [
  {
    label: '活动主题',
    value: 1
  },
  {
    label: '商圈名称',
    value: 2
  }
]
// 自定义列
const componentList = [
  {
    component: BaseButton,
    label: '操作',
    width: 120,
    buttonList,
    insertIndex: 16
  },
  {
    component: BaseTableClick,
    label: '活动主题',
    insertIndex: 3,
    eventType: 'dialogVisible'
  },
  {
    component: BaseTableClickT,
    label: '圈内商家',
    insertIndex: 4,
    eventType: 'sellerTable'
  }
]
export default {
  data () {
    return {
      columns,
      options,
      optionsT,
      componentList,
      columnsN, // 圈内商家表格
      data: [],
      total: 0, // 总数
      totalT: 0,
      pageSize: 10, // 每页条数
      id: '',
      currentRow: {},
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      activityStatus: '',
      activityTheme: '',
      keyWords: '',
      centerDialogVisible: false,
      detailsData: [], // 联盟活动详情
      businessDetails: false, // 圈内商家详情
      union_id: '', // 商圈id
      sellerData: [], // 圈内商家数据
      union_name: '', // 商圈名称
      sellerCount: '' // 商家数
    }
  },
  created () {
    this.dataList()
  },
  methods: {
    // 联盟活动详情
    dialogVisible (row) {
      this.$http('union/actDetail', { id: row.id }).then(res => {
        if (res.code === this.$ok) {
          this.detailsData = res.data
        }
      })
      this.centerDialogVisible = true
    },
    // 圈内商家详情
    sellerTable (row) {
      if (row.seller_cnt === 0) return
      this.$http('union/actGroupList', { union_id: row.union_id }).then(res => {
        if (res.code === this.$ok) {
          if (!this.sellerCount) return
          res.data.map((item, index) => {
            item.index = index + 1
            if (!item.area) item.area = '/'
            if (!item.province) item.province = '/'
            if (!item.city) item.city = '/'
            item.area = item.province + '-' + item.city + '-' + item.area
            if (item.area === null) item.area = '/'
            if (!item.service_mobile) item.service_mobile = '/'
          })
          this.sellerData = res.data
          this.totalT = res.data.length
        }
      })
      this.businessDetails = true
    },
    // 选择时间
    pickerTime (t) {
      if (!t) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = t[0]
      this.endTime = t[1]
    },
    // 活动状态
    getActivityStatus (val) {
      this.activityStatus = val
    },
    // 活动主题
    getActivityTheme (val) {
      this.activityTheme = val
    },
    // 关键词
    getSearchKeyWords (val) {
      this.keyWords = val
    },
    // 点击搜索
    clickSearch () {
      this.page = 1
      this.dataList()
    },
    // 联盟活动列表数据
    dataList () {
      let url = 'union/getUnionActList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        start_at: this.startTime,
        end_at: this.endTime,
        type: this.activityStatus
      }
      if (this.activityTheme === 1) {
        obj.title = this.keyWords
      } else {
        obj.union_name = this.keyWords
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerData(res.data.data)
          this.data = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    handlerData (data) {
      const nowTime = new Date() - 0
      data.forEach((item, index) => {
        item.index = index
        item.topicText = item.title
        item.customTextT = item.seller_cnt
        this.union_id = item.union_id
        this.union_name = item.union_name
        item.buttonList = JSON.parse(JSON.stringify(buttonList))
        this.sellerCount = item.seller_cnt
        if (item.status === 1) {
          item.customText = '已下架'
          item.buttonList = []
        } else {
          item.buttonList[0].text = '下架'
        }
        let startTime = initTime(item.start_at)
        let endTime = initTime(item.end_at)
        if (nowTime > startTime && endTime > nowTime) {
          item.activityStatus = '进行中'
        } else if (endTime < nowTime) {
          item.activityStatus = '已结束'
        } else {
          item.activityStatus = '未开始'
        }
        item.index = index + 1
      })
    },
    // 点击下架
    buttonSubmit (row, type) {
      this.currentRow = row
      this.$prompt('确定要下架该商品吗？', {
        title: '提示'
      }).then(({ action, value }) => {
        if (value === null || !value.trim()) {
          this.$mes('理由不能为空', 2)
          return
        }
        if (action === 'confirm') {
          this.$http('union/outUnionAct', {
            id: row.id,
            down_reason: value
          }).then(res => {
            if (res.code === this.$ok) {
              row.status = 1
              row.customText = '已下架'
              row.buttonList = []
              this.data.splice(row.index, 1, row)
              this.$mes('商品下架成功')
              return
            }
            // this.$mes(res.message, 4)
          })
        }
      })
    },
    // 点击分页
    changePage (page) {
      this.page = page
      this.dataList()
    }
  },
  components: {
    BaseTableClick,
    BaseTableClickT
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.manage-alliance-container
  .page-header
    flex-f-align()
    width 1100px
  .page-header
      >div
        margin-left 20px
        &:nth-child(1)
          margin-left 0
    .table-container
      margin-top 50px
.look-details
  .el-dialog
    width 600px
    min-height 600px
    .el-dialog__header
      padding 0
    h3
      tc()
      font-weight bold
      f16()
      // margin 20px
  .topicDetails
    padding 10px 0
    span:nth-child(1)
      width 120px
      display inline-block
    img
      width 550px
      height 200px
      border 1px solid #ccc
      display block
    .brandImg
      display inline-block
      vertical-align top
      width 430px
      img
        width 50px
        height 50px
        border 1px solid #ccc
        margin 5px 0
        float left
      img:nth-child(2)
        margin-left 5px
      img:nth-child(3)
        margin-left 5px
    .detailsImg
      width 300px
      display inline-block
      vertical-align top
      img
        width 200px
        height 100px
        border 1px solid #ccc
        margin 5px 0
.business-details
  .el-dialog
    width 600px
    min-height 200px
    overflow hidden
    p
      margin: -20px 0;
</style>
