<template>
  <div class="register-business-container">
    <div class="register-business-header">
      <div class="register-select-time">
        <base-time-picker
          @pickerTime="pickerRegisterTime"
          timeText="注册时间">
        </base-time-picker>
      </div>
      <div class="register-select-circle">
        <span>商圈角色：</span>
        <base-select
          :options="circleOptions"
          @changeCurrentOption="getCircleOption"
          placeholder="状态"
          class="select-options">
        </base-select>
      </div>
      <div class="register-select-role">
        <span>商家角色：</span>
        <base-select
          :options="roleOptions"
          @changeCurrentOption="getRoleOption"
          placeholder="状态"
          class="select-options">
        </base-select>
      </div>
      <div class="register-select-role">
        <span>审核状态：</span>
        <base-select
          :options="auditStatus"
          @changeCurrentOption="getAuditStatus"
          placeholder="全部"
          class="select-options">
        </base-select>
      </div>
      <div class="register-search-input">
        <span>账号：</span>
        <base-input
          @changeInputValue="getAccount"
          class="input-wapper">
        </base-input>
      </div>
      <div class="register-search">
        <base-button
          :type="1"
          @clickCurrentButton="searchTableData"
          text="搜索">
        </base-button>
      </div>
    </div>
    <div class="register-business-body">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        @changePage="changePage">
      </base-table>
    </div>
  </div>
</template>

<script>
import { mixins } from 'mixins'
const columns = [
  {
    label: '编号',
    prop: 'id'
  },
  {
    label: '账号',
    prop: 'mobile'
  },
  {
    label: '商圈角色',
    prop: 'union'
  },
  {
    label: '商家角色',
    prop: 'seller'
  },
  {
    label: '审核状态',
    prop: 'sellerStatus'
  },
  {
    label: '注册时间',
    prop: 'created_at'
  }
]
const circleOptions = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '已开通',
    value: 1
  },
  {
    label: '未开通',
    value: 2
  }
]
const roleOptions = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '已开通',
    value: 1
  },
  {
    label: '未开通',
    value: 2
  }
]
const auditStatus = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '手动审核',
    value: 1
  },
  {
    label: '自动审核',
    value: 2
  },
  {
    label: '待审核',
    value: 3
  },
  {
    label: '未通过',
    value: 4
  },
  {
    label: '已停用',
    value: 5
  },
]
export default {
  name: 'RegisterBusiness',
  mixins: [mixins],
  data () {
    return {
      columns,
      circleOptions,
      circleOption: '',
      roleOptions,
      auditStatus,
      roleOption: '',
      startTime: '',
      endTime: '',
      mobile: '',
      auditOption: 0
    }
  },
  created () {
    this.getRegisterData()
  },
  methods: {
    // 时间
    pickerRegisterTime (t) {
      if (!t) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = t[0]
      this.endTime = t[1]
    },
    // 商圈角色
    getCircleOption (val) {
      this.circleOption = val
    },
    // 商家角色
    getRoleOption (val) {
      this.roleOption = val
    },
    // 账号
    getAccount (val) {
      this.mobile = val
    },
    getAuditStatus (val) {
      this.auditOption = val
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.getRegisterData()
    },
    getRegisterData () {
      let { page, pageSize, startTime, endTime, circleOption, roleOption, mobile, auditOption } = this
      let url = 'circle/registerUserList'
      /* eslint-disable */
      let obj = {
        page: page,
        pageSize: pageSize,
        start: startTime,
        end: endTime,
        union_role: circleOption,
        seller_role: roleOption,
        keyword: mobile,
        verify: auditOption
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 分页
    changePage (page) {
      this.page = page
      this.getRegisterData()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.register-business-container
  .register-business-header
    flex-f-align()
    flex-wrap wrap
    > div
      margin-bottom 20px
    .register-select-circle,
    .register-select-role,
    .register-search-input,
    .register-search
      flex-f-align()
      margin-left 20px
    .register-search-input
      margin-left 25px
  .register-business-body
    //
</style>
