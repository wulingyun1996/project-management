<template>
  <div class="flashSale">
    <div class="flashButton">
      <el-button type="primary" @click="addmit">新增</el-button>
    </div>
    <div class="manage-alliance-container">
      <base-tab
        :tab-items="tabItems"
        default-tab="1"
        @clickCurrentTab="clickCurrentTab">
      </base-tab>
      <div class="manage-alliance-table">
        <!--                                        进行中                                    -->
        <base-table
          v-show="isShowWaitPage"
          :data="waitData"
          :columns="waitColumns"
          :total="total"
          :componentList="waitComponentList"
          @changePage="changeWaitPage"
          @awaitButtonSubmit="awaitButtonSubmit">
        </base-table>
        <!--                                        未开始                                    -->
        <base-table
          v-show="isShowPassedPage"
          :data="passedData"
          :columns="passedColumns"
          :total="total"
          :componentList="passedComponentList"
          @changePage="changePassedPage"
          @passedButtonSubmit="passedButtonSubmit">
        </base-table>
        <!--                                        已结束                                   -->
        <base-table
          v-show="isShowUnpassPage"
          :data="unpassData"
          :total="total"
          :componentList="unpassComponentList"
          :columns="unpassColumns"
          @changePage="changeUnpassPage"
          @unpassButtonSubmit="unpassButtonSubmit">
        </base-table>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import Img from 'components/table-image'
import BaseTab from 'components/tab'
import { mixins } from 'mixins'
// 公共 url
const URL = 'sale/getSaleAct'
// tab 栏数据
const tabItems = [
  {
    label: '进行中',
    name: '1'
  },
  {
    label: '未开始',
    name: '2'
  },
  {
    label: '已结束',
    name: '3'
  }
]
// ---------------------------------- 进行中 ----------------------------------------
// 进行中
const waitColumns = [
  {
    label: '限时活动名称',
    prop: 'name'
  },
  {
    label: '开始时间',
    prop: 'start_at'
  },
  {
    label: '结束时间',
    prop: 'end_at'
  },
  {
    label: '商品数量',
    prop: 'goods_num'
  }
]
// 进行中插入按钮组件
const waitButtonList = [
  {
    text: '查看详情',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '活动统计',
    buttonType: 2,
    type: 'danger',
    size: 'small'
  }
]
const waitComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    width: 180,
    buttonList: waitButtonList,
    eventType: 'awaitButtonSubmit'
  },
  {
    component: Img,
    label: '活动图标',
    insertIndex: 1
  }
]
// ---------------------------------- 未开始 ----------------------------------------
// 未开始
const passedColumns = [
  {
    label: '限时活动名称',
    prop: 'name'
  },
  {
    label: '开始时间',
    prop: 'start_at'
  },
  {
    label: '结束时间',
    prop: 'end_at'
  },
  {
    label: '商品数量',
    prop: 'goods_num'
  }
]
// 未开始插入的按钮
const passedButtonList = [
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
const passedComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    width: 180,
    buttonList: passedButtonList,
    eventType: 'passedButtonSubmit'
  },
  {
    component: Img,
    label: '活动图标',
    insertIndex: 1
  }
]
// ---------------------------------- 已结束 ----------------------------------------
// 已结束
const unpassColumns = [
  {
    label: '限时活动名称',
    prop: 'name'
  },
  {
    label: '开始时间',
    prop: 'start_at'
  },
  {
    label: '结束时间',
    prop: 'end_at'
  },
  {
    label: '商品数量',
    prop: 'goods_num'
  }
]
// 已结束插入的按钮
const unpassButtonList = [
  {
    text: '活动统计',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  }
]
const unpassComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    width: 180,
    buttonList: unpassButtonList,
    eventType: 'unpassButtonSubmit'
  },
  {
    component: Img,
    label: '活动图标',
    insertIndex: 1
  }
]
export default {
  name: 'FlashSale',
  mixins: [mixins],
  data () {
    return {
      currentTabStatus: 1,
      tabItems,
      // 进行中数据
      waitColumns,
      waitComponentList,
      waitData: [],
      awaitRow: {},
      isShowWaitPage: true,
      // 未开始的数据
      passedColumns,
      passedComponentList,
      passedData: [],
      passedRow: {},
      isShowPassedPage: false,
      // 已结束的数据
      unpassColumns,
      unpassComponentList,
      unpassData: [],
      unpassRow: {},
      isShowUnpassPage: false
    }
  },
  created () {
    this.getWaitAuditing()
  },
  methods: {
    // 切换接口
    clickCurrentTab (tab) {
      this.page = 1
      switch (tab) {
        case '1':
          this.currentTabStatus = 1
          this.getWaitAuditing()
          this.isShowWaitPage = true
          this.isShowPassedPage = false
          this.isShowUnpassPage = false
          break
        case '2':
          this.currentTabStatus = 2
          this.getpassedData()
          this.isShowWaitPage = false
          this.isShowPassedPage = true
          this.isShowUnpassPage = false
          break
        case '3':
          this.currentTabStatus = 3
          this.getunpassData()
          this.isShowWaitPage = false
          this.isShowPassedPage = false
          this.isShowUnpassPage = true
          break
      }
    },
    // 进行中接口数据获取
    getWaitAuditing () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.waitData = res.data
          this.total = res.data.total
          this.waitData.map(item => {
            item.src = item.banner_path
            item.height = 80
          })
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    awaitButtonSubmit (row, type) {
      console.log(row, type)
      if (type === 1) {
        this.$router.push({ path: '/manage-market/flash-details', query: { id: row.id } })
      }
      if (type === 2) {
        this.$router.push({ path: '/manage-market/flash-statistics', query: { id: row.id } })
      }
    },
    // 分页事件
    changeWaitPage (page) {
      this.page = page
      this.getWaitAuditing()
    },
    // 未开始的数据
    getpassedData () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.passedData = res.data
          this.total = res.data.total
          this.passedData.map(item => {
            item.src = item.banner_path
            item.height = 80
          })
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    passedButtonSubmit (row, type) {
      if (type === 1) {
        this.$router.push({ path: '/manage-market/flash-compile', query: { id: row.id } })
      }
      if (type === 4) {
        this.$confirm('你确定要删除吗? 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('sale/deleteSale', { id: row.id }).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getpassedData()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 分页事件
    changePassedPage (page) {
      this.page = page
      this.getpassedData()
    },
    // 已结束的数据处理
    getunpassData () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.unpassData = res.data
          this.total = res.data.total
          this.unpassData.map(item => {
            item.src = item.banner_path
            item.height = 80
          })
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    unpassButtonSubmit (row, type) {
      if (type === 1) {
        this.$router.push({ path: '/manage-market/flash-statistics', query: { id: row.id } })
      }
    },
    // 分页事件
    changeUnpassPage (page) {
      this.page = page
      this.getunpassData()
    },
    addmit () {
      this.$router.push('/manage-market/flash-add')
    }
  },
  components: {
    BaseTab
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.manage-alliance-container
   margin-top 20px
  .manage-alliance-table
    margin-top 20px
</style>
