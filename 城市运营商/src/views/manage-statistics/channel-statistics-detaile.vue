<template>
  <div class="channel-detail-container">
    <div class="detail-time">
      <span>查询日期：</span>
      <el-date-picker
      v-model="value"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      :picker-options="pickerBeginDateBefore"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <base-button :type="2" text="搜索" @clickCurrentButton="getSearch"></base-button>
    <base-button :type="2" text="导出" @clickCurrentButton="handleDownload"></base-button>
    </div>
    <div class="detail-info">
      <div class="item">
        <span>渠道推广名称：</span>
        <span>{{ statisticsName }}</span>
      </div>
      <div class="item">
        <span>下载用户数：</span>
        <span>{{ downNumber }}</span>
      </div>
      <div class="item">
        <span> 注册用户数：</span>
        <span>{{ signNumber }}</span>
      </div>
      <div class="item">
        <span>下单用户数：</span>
        <span>{{ singularNumber }}</span>
      </div>
      <div class="item">
        <span>付款用户数：</span>
        <span>{{ paymentNumber }}</span>
      </div>
    </div>
    <div class="detail-content">
      <base-tab
        :tab-items="tabItems"
        default-tab="1"
        @clickCurrentTab="clickCurrentTab">
      </base-tab>
      <div class="detail-table-ios" v-show="isShowIOs">
        <!-- IOS -->
        <base-table
          v-show="isShowIOs"
          :data="iosData"
          :columns="columns"
          :componentList="componentList"
          :total="total"
          @dialogVisible="dialogVisible"
          @sellerTable="sellerTable"
          @threeTable="threeTable"
          @fourTable="fourTable"
          @fiveTable="fiveTable"
          @sixTable="sixTable"
          @changePage="changePage"
          >
        </base-table>
        <!-- <el-table
          :data="iosData"
          border
          style="width: 100%">
          <el-table-column
            prop="date_time"
            label="日期"
            >
          </el-table-column>
          <el-table-column
            label="下载用户数"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count1 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="首次访问用户数"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count2 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="注册用户数"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count3 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="通过认证用户数"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count7 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="下单用户数"
           >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count4 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="付款用户数"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope)" type="text" size="medium">{{ scope.row.count5 }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination @changePage="changePage" :total="total" v-show="showPagination"></base-pagination> -->
      </div>
      <div class="detail-table-android" v-show="isShowAndroid">
        <!-- 安卓 -->
        <base-table
          v-show="isShowAndroid"
          :data="androidData"
          :columns="columns"
          :componentList="componentList"
          :total="total"
          @dialogVisible="dialogVisible"
          @sellerTable="sellerTable"
          @threeTable="threeTable"
          @fourTable="fourTable"
          @fiveTable="fiveTable"
          @sixTable="sixTable"
          @changePage="changePage"
          >
        </base-table>
        <!-- <el-table
          :data="androidData"
          border
          style="width: 100%">
          <el-table-column
            prop="date_time"
            label="日期"
            >
          </el-table-column>
          <el-table-column
            label="下载用户数"
            >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count1 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="首次访问用户数"
            >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count2 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="注册用户数"
            >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count3 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="通过认证用户数"
            >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count7 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="下单用户数"
           >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count4 }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="付款用户数"
            >
            <template slot-scope="scope">
              <el-button type="text" size="medium">{{ scope.row.count5 }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination @changePage="changePage" :total="total" v-show="showPagination"></base-pagination> -->
      </div>
    </div>
    <!-- 详细信息弹框 -->
    <el-dialog
      :title="infoName"
      :visible.sync="centerDialogVisible"
      width="30%"
      >
      <base-table
        :data="tableData"
        :columns="tableColumns"
        :total='infoTotal'
        >
      </base-table>
    </el-dialog>
  </div>
</template>

<script>
import BaseTab from 'components/tab'
import BasePagination from 'components/pagination'
import BaseTableClick from 'components/table-click'
import BaseTableClickT from 'components/table-clickT'
import BaseTableThreeClick from 'components/table-clickT/three-click'
import BaseTableFourClick from 'components/table-clickT/four-click'
import BaseTableFiveClick from 'components/table-clickT/five-click'
import BaseTableSixClick from 'components/table-clickT/six-click'
import { initTime } from 'utils/common'
import { mixins } from 'mixins'
const tabItems = [
  {
    label: 'IOS',
    name: '1'
  },
  {
    label: '安卓',
    name: '2'
  }
]
const columns = [
  {
    label: '日期',
    prop: 'date_time'
  }
  // {
  //   label: '下载用户数',
  //   prop: 'count1'
  // },
  // {
  //   label: '首次访问用户数',
  //   prop: 'count2'
  // },
  // {
  //   label: '注册用户数',
  //   prop: 'count3'
  // },
  // {
  //   label: '通过认证用户数',
  //   prop: 'count7'
  // },
  // {
  //   label: '下单用户数',
  //   prop: 'count4'
  // },
  // {
  //   label: '付款用户数',
  //   prop: 'count5'
  // }
]
const componentList = [
  {
    component: BaseTableClick,
    label: '下载用户数',
    insertIndex: 1,
    eventType: 'dialogVisible'
  },
  {
    component: BaseTableClickT,
    label: '首次访问用户数',
    insertIndex: 2,
    eventType: 'sellerTable'
  },
  {
    component: BaseTableThreeClick,
    label: '注册用户数',
    insertIndex: 3,
    eventType: 'threeTable'
  },
  {
    component: BaseTableFourClick,
    label: '通过认证用户数',
    insertIndex: 4,
    eventType: 'fourTable'
  },
  {
    component: BaseTableFiveClick,
    label: '下单用户数',
    insertIndex: 5,
    eventType: 'fiveTable'
  },
  {
    component: BaseTableSixClick,
    label: '付款用户数',
    insertIndex: 6,
    eventType: 'sixTable'
  }
]
export default {
  mixins: [mixins],
  data () {
    return {
      // value: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date() - 1 * 24 * 60 * 60 * 1000],
      value: [],
      tabNumber: '1',
      // tab栏
      tabItems,
      // 渠道推广名称
      statisticsName: '',
      // 下载数
      downNumber: '',
      // 注册数
      signNumber: '',
      // 下单数量
      singularNumber: '',
      // 付款数
      paymentNumber: '',
      iosData: [],
      androidData: [],
      columns,
      tableColumns: [],
      type: '',
      infoName: '',
      infoTime: '',
      infoTotal: 0,
      componentList,
      isShowIOs: true,
      isShowAndroid: false,
      centerDialogVisible: false,
      pickerBeginDateBefore: {
        /* eslint-disable */
        disabledDate: time => {
          let _now = Date.now(),
            seven = 365 * 24 * 60 * 60 * 1000,
            sevenDays = _now - seven
          return time.getTime() > _now || time.getTime() < sevenDays
        }
      }
    }
  },
  computed: {
    queryId () {
      return this.$route.query.id
    },
    dataTime () {
      return this.$route.query.dataTime
    },
    showPagination () {
      return this.total > 10
    }
  },
  created () {
    let seven = 7 * 24 * 60 * 60 * 1000
    let tiem = Date.now() - initTime(this.dataTime)
    function timestampToTime (timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    }
    if (tiem > seven) {
      this.value = [timestampToTime(new Date() - 7 * 24 * 60 * 60 * 1000), timestampToTime(new Date())]
    } else {
      this.value = [this.dataTime, timestampToTime(new Date())]
    }
    this.getIosData()
  },
  methods: {
    // tab切换
    clickCurrentTab (tab) {
      this.tabNumber = tab
      this.page = 1
      switch (tab) {
        case '1':
          this.currentTabStatus = 1
          this.getIosData()
          this.isShowIOs = true
          this.isShowAndroid = false
          break
        case '2':
          this.currentTabStatus = 2
          this.getAndroidData()
          this.isShowIOs = false
          this.isShowAndroid = true
          break
      }
    },
    // 获取ios数据
    getIosData () {
      let url = 'analytics/channelDetail'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        channel_id: this.queryId,
        system: 1,
        start_time: this.value[0],
        end_time: this.value[1]
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.statisticsName = res.data.panel.name
          this.downNumber = res.data.panel.down
          this.signNumber = res.data.panel.reg
          this.singularNumber = res.data.panel.order
          this.paymentNumber = res.data.panel.orderpay
          this.handlerData(res.data.list.data)
          this.iosData = res.data.list.data
          this.total = res.data.list.total
        }
      })
    },
    // 获取安卓数据
    getAndroidData () {
      let url = 'analytics/channelDetail'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        channel_id: this.queryId,
        system: 2,
        start_time: this.value[0],
        end_time: this.value[1]
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.statisticsName = res.data.panel.name
          this.downNumber = res.data.panel.down
          this.signNumber = res.data.panel.reg
          this.singularNumber = res.data.panel.order
          this.paymentNumber = res.data.panel.orderpay
          this.handlerData(res.data.list.data)
          this.androidData = res.data.list.data
          this.total = res.data.list.total
        }
      })
    },
    handlerData (data) {
      data.forEach((item, index) => {
        item.topicText = item.count1
        item.customTextT = item.count2
        item.threeTextT = item.count3
        item.fourTextT = item.count7
        item.fiveTextT = item.count4
        item.sixTextT = item.count5
      })
    },
    // 搜所
    getSearch () {
      this.page = 1
      if (this.tabNumber === '1') {
        this.getIosData()
      } else {
        this.getAndroidData()
      }
    },
    changePage (page) {
      this.page = page
      if (this.tabNumber === '1') {
        this.getIosData()
      } else {
        this.getAndroidData()
      }
    },
    // 导出excel
    handleDownload () {
      this.downloadLoading = true
      require.ensure([], () => {
        
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = ['日期', '下载用户数', '首次访问用户数', '注册用户数', '通过认证用户数', '下单用户数', '付款用户数']
        const filterVal = ['date_time', 'count1', 'count2', 'count3', 'count7', 'count4', 'count5']
        const list = this.tabNumber === '1' ? this.iosData : this.androidData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '渠道推广详情' + this.dataTime)
        this.downloadLoading = false
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 下载用户数
    dialogVisible (row) {
      if (row.count1 === 0) return
      this.infoName = '下载用户数'
      this.type = 7
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '下载时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 首次访问数
    sellerTable (row) {
      if (row.count2 === 0) return
      this.infoName = '首次访问用户数'
      this.type = 1
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '访问时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 注册用户数
    threeTable (row) {
      if (row.count3 === 0) return
      this.infoName = '注册用户数'
      this.type = 2
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '账号',
          prop: 'mobile'
        },
        {
          label: '注册时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 通过认证用户数
    fourTable (row) {
      if (row.count7 === 0) return
      this.infoName = '通过认证用户数'
      this.type = 4
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '账号',
          prop: 'mobile'
        },
        {
          label: '提交认证时间',
          prop: 'apply_at'
        },
        {
          label: '认证通过时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 下单用户数
    fiveTable (row) {
      if (row.count4 === 0) return
      this.infoName = '下单用户数'
      this.type = 5
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '账号',
          prop: 'mobile'
        },
        {
          label: '下单次数',
          prop: 'count'
        },
        {
          label: '首次下单时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 付款用户数
    sixTable (row) {
      if (row.count5 === 0) return
      this.infoName = '付款用户数'
      this.type = 6
      this.infoTime = row.date_time
      this.tableColumns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '设备号',
          prop: 'imei'
        },
        {
          label: '账号',
          prop: 'mobile'
        },
        {
          label: '付款次数',
          prop: 'count'
        },
        {
          label: '首次付款时间',
          prop: 'created'
        }
      ]
      this.getDate()
    },
    // 请求接口
    getDate () {
      let url = 'analytics/channelDetailList'
      let obj = {
        channel_id: this.queryId,
        type: this.type,
        date_time: this.infoTime
      }
      if (this.tabNumber === '1') {
        obj.data_os = 'ios'
      } else {
        obj.data_os = 'android'
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerInfoData(res.data)
          this.tableData = res.data
          this.centerDialogVisible = true
        }
      })
    },
    handlerInfoData (data) {
      data.forEach((item, index) => {
        item.index = index + 1
        if (!item.imei) item.imei = '/'
      })
    }
  },
  components: {
    BaseTab,
    BasePagination
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.channel-detail-container
  .el-dialog
    margin-top 300px!important
  .detail-time
    display flex
    align-items center
    .base-button-item
      margin-left 30px
  .detail-info
    margin-top 30px
    display flex
    .item
      margin-right 10px
    .item:first-child
      margin-right 30px
  .detail-content
    margin-top 30px
    .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell
      text-align center
</style>
