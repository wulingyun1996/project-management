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
import BaseTab from 'components/tab'
import { mixins } from 'mixins'
// 公共 url
const URL = 'union/applyList'
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
    prop: 'user_id'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '商圈参与品牌',
    prop: 'brand'
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
    insertIndex: 8,
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
    prop: 'user_id'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '商圈名称',
    prop: 'union_name'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '商圈参与品牌',
    prop: 'brand'
  },
  {
    label: '申请日期',
    prop: 'created_at'
  }
]
// 已通过 -- 编辑商家 -- 插入按钮组件
let passedButtonList1 = [
  {
    text: '停用',
    buttonType: 3,
    type: 'primary',
    size: 'small'
  },
  {
    text: '编辑商家',
    buttonType: 2,
    type: 'success',
    size: 'small'
  },
  {
    text: '解散圈子',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
// 已通过 -- 未创建圈子 -- 插入按钮组件
let passedButtonList2 = [
  {
    text: '停用',
    buttonType: 3,
    type: 'primary',
    size: 'small'
  },
  {
    text: '组建圈子',
    buttonType: 1,
    type: 'danger',
    size: 'small'
  }
]
const passedComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 10,
    width: 280,
    eventType: 'passedButtonSubmit'
  }
]
// ---------------------------------- 未通过 ----------------------------------------
// 未通过
const unpassColumns = [
  {
    label: '编号',
    prop: 'user_id'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '商圈参与品牌',
    prop: 'brand'
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
    prop: 'user_id'
  },
  {
    label: '账号',
    prop: 'account'
  },
  {
    label: '商圈名称',
    prop: 'union_name'
  },
  {
    label: '联系人',
    prop: 'contact'
  },
  {
    label: '手机号',
    prop: 'mobile'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '员工',
    prop: 'staff'
  },
  {
    label: '停用日期',
    prop: 'stop_at'
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
    insertIndex: 9,
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
    // 切换接口
    clickCurrentTab (tab) {
      this.page = 1
      switch (tab) {
        case '1':
          this.currentTabStatus = 'audit'
          this.getWaitAuditing()
          this.isShowWaitPage = true
          this.isShowPassedPage = false
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = false
          break
        case '2':
          this.currentTabStatus = 'startUse'
          this.getpassedData()
          this.isShowWaitPage = false
          this.isShowPassedPage = true
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = false
          break
        case '3':
          this.currentTabStatus = 'rejected'
          this.getunpassData()
          this.isShowWaitPage = false
          this.isShowPassedPage = false
          this.isShowUnpassPage = true
          this.isShowNoUsedPage = false
          break
        case '4':
          this.currentTabStatus = 'stopUse'
          this.getNoUsedData()
          this.isShowWaitPage = false
          this.isShowPassedPage = false
          this.isShowUnpassPage = false
          this.isShowNoUsedPage = true
          break
      }
    },
    handlerTableData (data) {
      data.forEach(item => {
        if (!item.union_name) {
          item.union_name = '/'
        }
        if (!item.reject_at) {
          item.reject_at = '/'
        }
        if (!item.stop_at) {
          item.stop_at = '/'
        }
        if (!item.address) {
          item.address = '/'
        }
        if (!item.brand) {
          item.brand = '/'
        }
      })
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
        this.$mesBox(`确认启用该商家吗？`, '提示', 1, 1, '确定', '放弃', this.comfirmPass)
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
      }).then(({ action, value }) => {
        this.canclePass(value)
        })
    },
    // 确定通过
    comfirmPass (t) {
      if (t === 'confirm') {
        let { id } = this.awaitRow
        let url = 'union/applyVerify'
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
      let url = 'union/applyVerify'
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
        if (!item.group) {
          item.buttonList = passedButtonList2
        } else {
          item.buttonList = passedButtonList1
        }
        if (!item.union_name) {
          item.union_name = '/'
        }
        if (!item.reject_at) {
          item.reject_at = '/'
        }
        if (!item.stop_at) {
          item.stop_at = '/'
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
      // 组建圈子
      if (type === 1) {
        // 联盟商名称不存在情况不允许组件圈子
        if (!row.union_name) {
          this.$mes('该联盟商还未完善基本信息，不可组件圈子', 2)
          return
        }
        this.$router.push({ name: 'SetUpCircle', query: { id: row.user_id, name: row.union_name } })
        return
      }
      // 编辑商家
      if (type === 2) {
        this.$router.push({ name: 'ManageAllianceShop', query: { id: row.user_id } })
        return
      }
      // 停用圈子
      if (type === 3) {
        this.$mesBox(`您确定要停用该联盟商吗？`, '提示', 1, 1, '确定', '放弃', this.stopUseCircle)
        return
      }
      // 获取要解散圈子的状态
      this.getDisbandCircleStatus()
    },
    // 停用圈子
    stopUseCircle (t) {
      if (t === 'confirm') {
        let url = 'union/setStatus'
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
    // 获取解散圈子的状态
    getDisbandCircleStatus () {
      let url = 'circle/bismissStatus'
      let obj = {
        // 需要获取联盟商 id
        unionId: this.passedRow.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let code = res.data
          // 活动进行，但是未有用户付款
          if (code === 1) {
            this.$mesBox(`该圈子有活动在进行中，解散后该活动将无法进行，确定要解散嘛？`, '提示', 1, 1, '确定', '取消', this.disbandCircle)
            return
          }
          // 有用户报名参与，不可解散
          if (code === 2) {
            this.$mesBox(`已有用户报名参加活动，不可解散圈子`, '提示', 1, 1, '确定', '取消')
            return
          }
          // 未有用户参与
          if (code === 3) {
            this.$mesBox(`您确定要解散该圈子吗？`, '提示', 1, 1, '确定', '取消', this.disbandCircle)
            return
          }
          // 被设置成为热门商圈
          this.$mesBox(`该圈子已设置为热门商圈，请先下架后再解散圈子`, '提示', 1, 1, '确定', '取消')
        }
      })
    },
    // 解散圈子
    disbandCircle (t) {
      if (t === 'confirm') {
        let { id } = this.passedRow
        let url = 'circle/deleteGroup'
        let obj = {
          user_id: this.passedRow.user_id,
          status: 'stopUse'
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.passedData.some((item, index, arr) => {
              if (item.id === id) {
                arr.splice(index, 1)
                return true
              }
            })
            this.getpassedData()
            this.$mes('提交成功')
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
    // 启用商家
    startUse (t) {
      if (t === 'confirm') {
        let url = 'union/setStatus'
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
