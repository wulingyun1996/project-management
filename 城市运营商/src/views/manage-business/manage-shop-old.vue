<template>
  <div class="manage-alliance-container">
    <base-tab
      :tab-items="tabItems"
      default-tab="1"
      @clickCurrentTab="clickCurrentTab">
    </base-tab>
    <div class="manage-alliance-table">
      <!--                                        待审核                                    -->
      <base-table
        v-show="isShowWaitPage"
        :data="waitData"
        :columns="waitColumns"
        :total="total"
        :componentList="waitComponentList"
        @changePage="changeWaitPage"
        @awaitButtonSubmit="awaitButtonSubmit">
      </base-table>
      <!--                                        已通过                                    -->
      <base-table
        v-show="isShowPassedPage"
        :data="passedData"
        :columns="passedColumns"
        :total="total"
        :componentList="passedComponentList"
        @changePage="changePassedPage"
        @passedButtonSubmit="passedButtonSubmit">
      </base-table>
      <!--                                        未通过                                    -->
      <base-table
        v-show="isShowUnpassPage"
        :data="unpassData"
        :total="total"
        :columns="unpassColumns"
        @changePage="changeUnpassPage">
      </base-table>
      <!--                                        已停用                                    -->
      <base-table
        v-show="isShowNoUsedPage"
        :data="noUsedData"
        :columns="noUsedColumns"
        :total="total"
        :componentList="noUsedComponentList"
        @changePage="changeNoUsedPage"
        @buttonSubmit="noUsedButtonSubmit">
      </base-table>
    </div>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import BaseTableCustomButton from 'components/table-custom/manage-shop'
import BaseTab from 'components/tab'
import { mixins } from 'mixins'
// 公共 url
const URL = 'seller/sellerList'
// tab 栏数据
const tabItems = [
  {
    label: '待审核',
    name: '1'
  },
  {
    label: '已通过',
    name: '2'
  },
  {
    label: '未通过',
    name: '3'
  },
  {
    label: '已停用',
    name: '4'
  }
]
// ---------------------------------- 待审核 ----------------------------------------
// 待审核
const waitColumns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'account'
  },
  // {
  //   label: '联系人',
  //   prop: 'contact'
  // },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '申请日期',
    prop: 'created_at'
  }
]
// 待审核插入按钮组件
const waitButtonList = [
  {
    text: '通过',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '不通过',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const waitComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 7,
    width: 180,
    buttonList: waitButtonList,
    eventType: 'awaitButtonSubmit'
  }
]
// ---------------------------------- 已通过 ----------------------------------------
// 已通过
const passedColumns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '店铺名称',
    prop: 'shopName'
  },
  // {
  //   label: '联系人',
  //   prop: 'contact'
  // },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '品牌信息',
    prop: 'brand'
  },
  {
    label: '旗下特约采购师',
    prop: 'cgs'
  },
  {
    label: '所属圈子',
    prop: 'group'
  },
  {
    label: '通过日期',
    prop: 'apply_at'
  },
  {
    label: '状态',
    prop: 'status'
  }
]
// 已通过 -- 开通员工 -- 插入按钮组件
let passedButtonList1 = {
  text: '开通',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  staffNum: '未开通'
}
// 已通过 -- 关闭员工 -- 插入按钮组件
let passedButtonList2 = {
  text: '关闭',
  buttonType: 1,
  type: 'primary',
  size: 'small'
}
// 已通过 -- 未创建圈子 -- 插入按钮组件
let passedButtonList3 = [
  {
    text: '停用',
    buttonType: 3,
    type: 'primary',
    size: 'small'
  }
]
// insertIndex -> 12
const passedComponentList = [
  {
    component: BaseTableCustomButton,
    label: '员工',
    insertIndex: 9,
    width: 100,
    eventType: 'passedButtonSubmit'
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 12,
    width: 100,
    buttonList: passedButtonList3,
    eventType: 'passedButtonSubmit'
  }
]
// ---------------------------------- 未通过 ----------------------------------------
// 未通过
const unpassColumns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'account'
  },
  // {
  //   label: '联系人',
  //   prop: 'contact'
  // },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '驳回时间',
    prop: 'reject_at'
  },
  {
    label: '驳回原因',
    prop: 'reject_reason'
  }
]
// ---------------------------------- 已停用 ----------------------------------------
// 已停用
const noUsedColumns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '店铺名称',
    prop: 'shopName'
  },
  // {
  //   label: '联系人',
  //   prop: 'contact'
  // },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '品牌信息',
    prop: 'brand'
  },
  {
    label: '旗下特约采购师',
    prop: 'cgs'
  },
  {
    label: '所属圈子',
    prop: 'group'
  },
  {
    label: '员工',
    prop: 'staff'
  },
  {
    label: '停用日期',
    prop: 'stop_at'
  },
  {
    label: '状态',
    prop: 'status'
  }
]
// 已停用插入按钮组件
const noUsedButtonList = [
  {
    text: '启用',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  }
]
const noUsedComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 12,
    width: 100,
    buttonList: noUsedButtonList,
    eventType: 'buttonSubmit'
  }
]
export default {
  name: 'ManageAlliance',
  mixins: [mixins],
  data () {
    return {
      currentTabStatus: 'audit',
      tabItems,
      // 待审核数据
      waitColumns,
      waitComponentList,
      waitData: [],
      awaitRow: {},
      isShowWaitPage: true,
      // 已通过
      passedColumns,
      passedComponentList,
      passedData: [],
      passedRow: {},
      isShowPassedPage: false,
      // 未通过
      unpassColumns,
      unpassData: [],
      isShowUnpassPage: false,
      // 已停用
      noUsedColumns,
      noUsedComponentList,
      noUsedData: [],
      noUsedRow: {},
      isShowNoUsedPage: false
    }
  },
  created () {
    this.getWaitAuditing()
  },
  methods: {
    handlerTableData (data) {
      data.forEach((item, index) => {
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        if (!item.shopName) {
          item.shopName = '/'
        }
        if (!item.address) {
          item.address = '/'
        }
        if (!item.brand) {
          item.brand = '/'
        }
        if (!item.reject_reason) {
          item.reject_reason = '/'
        }
        if (!item.reject_at) {
          item.reject_at = '/'
        }
      })
    },
    // 切换接口
    clickCurrentTab (tab) {
      this.page = 1
      switch (tab) {
        case '1':
          this.currentTabStatus = 'audit'
          this.waitData = []
          this.getWaitAuditing()
          this.isShowWaitPage = true
          this.isShowPassedPage = false
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = false
          break
        case '2':
          this.currentTabStatus = 'startUse'
          this.passedData = []
          this.getpassedData()
          this.isShowWaitPage = false
          this.isShowPassedPage = true
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = false
          break
        case '3':
          this.currentTabStatus = 'rejected'
          this.unpassData = []
          this.getunpassData()
          this.isShowWaitPage = false
          this.isShowPassedPage = false
          this.isShowUnpassPage = true
          this.isShowNoUsedPage = false
          break
        case '4':
          this.currentTabStatus = 'stopUse'
          this.noUsedData = []
          this.getNoUsedData()
          this.isShowWaitPage = false
          this.isShowPassedPage = false
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = true
          break
      }
    },
    // ---------------------------------- 待审核 ----------------------------------------
    // 待审核接口
    getWaitAuditing () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.waitData = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 按钮事件
    awaitButtonSubmit (row, type) {
      this.awaitRow = row
      // 确定通过弹窗
      if (type === 1) {
        this.$mesBox(`确认通过该商家吗？`, '提示', 1, 1, '确定', '放弃', this.comfirmPass)
        return
      }
      // 不通过弹窗
      this.$prompt('请输入不通过的理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃',
        inputValidator (val) {
          let res = /null|^\s+$/.test(val)
          return !res
        },
        inputErrorMessage: '理由不能为空'
      })
        .then(({ action, value }) => {
          this.canclePass(value)
        })
    },
    // 确定通过 --> TODO 并行开通员工管理
    comfirmPass (t) {
      if (t === 'confirm') {
        let { id } = this.awaitRow
        let url = 'seller/applyVerify'
        let obj = {
          id,
          status: 'startUse'
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.waitData.some((item, index, arr) => {
              if (item.id === id) {
                arr.splice(index, 1)
                return true
              }
            })
            this.getWaitAuditing()
            return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    // 不通过
    canclePass (val) {
      let url = 'seller/applyVerify'
      let obj = {
        id: this.awaitRow.id,
        status: 'rejected',
        rejectMsg: val
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getWaitAuditing()
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 分页事件
    changeWaitPage (page) {
      this.page = page
      this.getWaitAuditing()
    },
    // ---------------------------------- 已通过 ----------------------------------------
    // 已通过接口
    getpassedData () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerPassedData(res.data.data)
          this.passedData = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 处理 已通过 数据
    handlerPassedData (data) {
      data.forEach((item, index, arr) => {
        item.index = index + 1
        if (!item.onOff) {
          item.customButtonList = passedButtonList1
        } else {
          passedButtonList2.staffNum = item.staff
          item.customButtonList = passedButtonList2
        }
        if (!item.shopName) {
          item.shopName = '/'
        }
        if (!item.address) {
          item.address = '/'
        }
        if (!item.brand) {
          item.brand = '/'
        }
      })
    },
    // 按钮事件
    passedButtonSubmit (row, type) {
      this.passedRow = row
      // 停用
      if (type === 3) {
        this.$mesBox(`您确定要停用该商家吗？`, '提示', 1, 1, '确定', '放弃', this.stopUseShop)
        return
      }
      // 开通/关闭员工
      if (!row.onOff) {
        this.$mesBox(`确认开通该商家员工管理权限吗？该商家已启用的员工账号均可使用！`, '提示', 1, 1, '确定', '放弃', this.openStaff)
      } else {
        this.$mesBox(`关闭后，该商家的员工账号均不能登录，请谨慎操作！确认关闭该商家员工管理权限吗？`, '提示', 1, 1, '确定', '放弃', this.closeStaff)
      }
    },
    // 停用圈子
    stopUseShop (t) {
      if (t === 'confirm') {
        let url = 'seller/setStatus'
        let obj = {
          id: this.passedRow.id,
          status: 'stopUse'
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.getpassedData()
            this.$mes('停用成功')
            return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    // 开通
    openStaff (t) {
      if (t === 'confirm') {
        let { index, staff } = this.passedRow
        let url = 'seller/setSub'
        let obj = {
          userId: this.passedRow.user_id,
          status: 1
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            passedButtonList2.staffNum = staff
            this.passedRow.customButtonList = passedButtonList2
            this.passedData.splice(index - 1, 1, this.passedRow)
            this.$mes('修改成功')
            return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    // 关闭
    closeStaff (t) {
      if (t === 'confirm') {
        let { index } = this.passedRow
        let url = 'seller/setSub'
        let obj = {
          userId: this.passedRow.user_id,
          status: 2
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.passedRow.customButtonList = passedButtonList1
            this.passedData.splice(index - 1, 1, this.passedRow)
            this.$mes('修改成功')
            return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    // 分页事件
    changePassedPage (page) {
      this.page = page
      this.getpassedData()
    },
    // ---------------------------------- 未通过 ----------------------------------------
    // 未通过接口
    getunpassData () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.unpassData = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 分页事件
    changeUnpassPage (page) {
      this.page = page
      this.getunpassData()
    },
    // ---------------------------------- 已停用 ----------------------------------------
    // 已停用接口
    getNoUsedData () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        status: this.currentTabStatus
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.noUsedData = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 按钮事件
    noUsedButtonSubmit (row) {
      this.noUsedRow = row
      this.$mesBox(`确认启用该商家吗？`, '提示', 1, 1, '确定', '放弃', this.startUse)
    },
    // 启用联盟商
    startUse (t) {
      if (t === 'confirm') {
        let url = 'seller/setStatus'
        let obj = {
          id: this.noUsedRow.id,
          status: 'startUse'
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.getNoUsedData()
            return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    // 分页事件
    changeNoUsedPage (page) {
      this.page = page
      this.getNoUsedData()
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
  .manage-alliance-table
    margin-top 20px
</style>
