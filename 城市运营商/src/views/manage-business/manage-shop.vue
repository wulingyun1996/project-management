<template>
  <div class="manage-alliance-container">
    <div class="manage-alliance-header">
      <div class="shop-search-input">
        <span>店铺名称：</span>
        <base-input
          @changeInputValue="getShopName"
          placeholder="请输入店铺名称"
          class="input-wapper">
        </base-input>
      </div>
      <!-- <div class="shop-select-city">
        <span>服务城市：</span>
        <base-select
          :options="provinceList"
          @changeCurrentOption="getProvince"
          placeholder="请选择省"
          class="select-options">
        </base-select>
        <base-select
          :options="cityList"
          @changeCurrentOption="getCity"
          placeholder="请选择"
          class="select-options">
        </base-select>
        <base-select
          :options="areaList"
          @changeCurrentOption="getArea"
          placeholder="请选择"
          class="select-options">
        </base-select>
      </div> -->
      <div class="shop-select-audit">
        <span>审核状态：</span>
        <base-select
          :options="auditStatus"
          @changeCurrentOption="getAuditStatus"
          placeholder="全部"
          class="select-options">
        </base-select>
      </div>
      <div class="shop-select-pay">
        <span>付款状态：</span>
        <base-select
          :options="payStatus"
          @changeCurrentOption="getPaytatus"
          placeholder="全部"
          class="select-options">
        </base-select>
      </div>
      <div class="shop-search-input">
        <span>账号：</span>
        <base-input
          @changeInputValue="getAccount"
          placeholder="请输入手机号"
          class="input-wapper">
        </base-input>
      </div>
      <div class="shop-search">
        <base-button
          :type="1"
          @clickCurrentButton="searchTableData"
          text="搜索">
        </base-button>
      </div>
    </div>
    <div class="manage-alliance-body">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        :componentList="passedComponentList"
        @changePage="getCurrentPage"
        @auditStaff="auditStaff"
        @auditShop="auditShop">
      </base-table>
    </div>
    <base-popup ref="popup" class="popup-container">
      <h1>确认通过该商家吗？</h1>
      <el-checkbox v-model="isStartStaff">备选项</el-checkbox>
      <div class="button-wrapper">
        <base-button
          :type="0"
          :size="1"
          @clickCurrentButton="giveUpAuditPass"
          text="放弃">
        </base-button>
        <base-button
          :type="1"
          :size="1"
          @clickCurrentButton="auditPass"
          text="确认">
        </base-button>
      </div>
    </base-popup>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import BasePopup from 'components/popup'
import BaseTableCustomButton from 'components/table-custom/manage-shop'
import { mixins } from 'mixins'
// 公共 url
const URL = 'seller/sellerList'
const auditStatus = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '手动审核',
    value: 'a'
  },
  {
    label: '自动审核',
    value: 'b'
  },
  {
    label: '待审核',
    value: 4
  },
  {
    label: '未通过',
    value: 2
  },
  {
    label: '已停用',
    value: 3
  },
  {
    label: '待支付',
    value: 1
  }
]
const payStatus = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '已付款',
    value: 2
  },
  {
    label: '未付款',
    value: 1
  }
]
const columns = [
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
    label: '申请时间',
    prop: 'created_at'
  },
  {
    label: '审核状态',
    prop: 'auditStatus'
  },
  {
    label: '付款状态',
    prop: 'payStatus'
  },
  {
    label: '付款金额',
    prop: 'pay_money'
  },
  {
    label: '审核时间',
    prop: 'apply_at'
  },
  {
    label: '付费时间',
    prop: 'pay_at'
  },
  {
    label: '状态',
    prop: 'shopStatus'
  }
]
// 开通员工 -- 插入按钮组件
let passedButtonList1 = {
  text: '开通',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  staffNum: '未开通'
}
// 关闭员工 -- 插入按钮组件
let passedButtonList2 = {
  text: '关闭',
  buttonType: 1,
  type: 'primary',
  size: 'small'
}
// 未创建圈子 -- 插入按钮组件
let stopUseButton = [
  {
    text: '停用',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
let startUseButton = [
  {
    text: '启用',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  }
]
let passOrUnpassButton = [
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
const passedComponentList = [
  {
    component: BaseTableCustomButton,
    label: '员工',
    insertIndex: 9,
    width: 100,
    eventType: 'auditStaff'
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 18,
    width: 150,
    eventType: 'auditShop'
  }
]
export default {
  name: 'ManageAlliance',
  mixins: [mixins],
  data () {
    return {
      columns,
      shopName: '',
      auditStatus,
      auditOption: '',
      payStatus,
      payOption: '',
      account: '',
      passedComponentList,
      currentRow: {},
      isStartStaff: false
    }
  },
  created () {
    this.getShopListData()
  },
  // mounted () {
  //   this.$refs.popup.show()
  // },
  methods: {
    getShopName (val) {
      this.shopName = val
    },
    getAuditStatus (val) {
      this.auditOption = val
    },
    getPaytatus (val) {
      this.payOption = val
    },
    getAccount (val) {
      this.account = val
    },
    searchTableData () {
      this.page = 1
      this.getShopListData()
    },
    getShopListData () {
      let { page, pageSize, account, shopName, auditOption, payOption } = this
      let obj = {
        page,
        pageSize,
        account,
        shopName,
        auditStatus: auditOption,
        payStatus: payOption
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
        }
      })
    },
    handlerTableData (data) {
      data.forEach((item, index) => {
        let passedButtonList = JSON.parse(JSON.stringify(passedButtonList1))
        let passedButtonListTwo = JSON.parse(JSON.stringify(passedButtonList2))
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        let { auditStatus, payStatus, status, onOff, shopName, address, brand, created_at, pay_money, apply_at, pay_at } = item
        if (auditStatus === '手动审核') {
          if (!onOff) {
            passedButtonList.show = false
            item.customButtonList = passedButtonList
          } else {
            passedButtonListTwo.show = false
            passedButtonListTwo.staffNum = item.staff
            item.customButtonList = passedButtonListTwo
          }
          if (status === '启用') {
            item.buttonList = stopUseButton
          }
          if (status === '停用') {
            item.buttonList = startUseButton
          }
        }
        if (auditStatus === '自动审核') {
          passedButtonListTwo.show = false
          passedButtonListTwo.staffNum = item.staff
          item.customButtonList = passedButtonListTwo
          if (status === '启用') {
            item.buttonList = stopUseButton
          }
          if (status === '停用') {
            item.buttonList = startUseButton
          }
        }
        // 待支付，待审核和未通过
        if (auditStatus === '待支付' || auditStatus === '待审核' || auditStatus === '未通过') {
          passedButtonList.show = true
          item.customButtonList = passedButtonList
          if (auditStatus === '待审核') {
            item.buttonList = passOrUnpassButton
          } else {
            item.buttonList = []
          }
        }
        if (auditStatus === '已停用') {
          if (!onOff) {
            passedButtonList.show = false
            item.customButtonList = passedButtonList
          } else {
            passedButtonListTwo.show = false
            passedButtonListTwo.staffNum = item.staff
            item.customButtonList = passedButtonListTwo
          }
          item.buttonList = startUseButton
        }
        if (status === '启用') {
          item.shopStatus = '启用'
        } else {
          item.shopStatus = '停用'
        }
        if (payStatus === 1) {
          item.payStatus = '未付款'
        } else {
          item.payStatus = '已付款'
        }
        if (!shopName) {
          item.shopName = '/'
        }
        if (!address) {
          item.address = '/'
        }
        if (!brand) {
          item.brand = '/'
        }
        if (!created_at) {
          item.created_at = '/'
        }
        if (!pay_money) {
          item.pay_money = '/'
        }
        if (!apply_at) {
          item.apply_at = '/'
        }
        if (!pay_at) {
          item.pay_at = '/'
        }
      })
    },
    // 分页
    getCurrentPage (page) {
      this.page = page
      this.getShopListData()
    },
    auditStaff (row, type) {
      this.currentRow = row
      // 开通/关闭员工
      if (!row.onOff) {
        this.$mesBox(`确认开通该商家员工管理权限吗？该商家已启用的员工账号均可使用！`, '提示', 1, 1, '确定', '放弃', this.openStaff)
      } else {
        this.$mesBox(`关闭后，该商家的员工账号均不能登录，请谨慎操作！确认关闭该商家员工管理权限吗？`, '提示', 1, 1, '确定', '放弃', this.closeStaff)
      }
    },
    // 按钮事件
    auditShop (row, type) {
      let { buttonList } = row
      this.currentRow = row
      if (buttonList.length === 1) {
        if (type === 1) {
          this.$mesBox(`确定启用该商家吗？`, '提示', 1, 1, '确定', '取消', this.startUseShop)
          return
        }
        this.$prompt('', '停用该商户', {
          center: true,
          confirmButtonText: '确认',
          cancelButtonText: '放弃',
          inputPlaceholder: '请输入停用原因',
          inputValidator (value) {
            if (!value) {
              return '停用原因不能为空'
            }
            if (!value.trim()) {
              return '停用原因不能为空'
            }
            if (value.trim().length > 50) {
              return '停用原因最多50字'
            }
          }
        })
        .then(({ value }) => {
          this.stopUseShop(value)
        })
        return
      }
      if (type === 1) {
        this.$refs.popup.show()
        return
      }
      this.$prompt('', '审核不通过', {
        center: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃',
        inputPlaceholder: '请输入审核不通过的原因',
        inputValidator (value) {
          if (!value) {
            return '停用原因不能为空'
          }
          if (!value.trim()) {
            return '原因不能为空'
          }
          // if (value.trim().length > 50) {
          //   return '停用原因最多50字'
          // }
        }
      })
      .then(({ value }) => {
        this.auditUnPass(value)
      })
    },
    // 停用商家
    stopUseShop (value) {
      let url = 'seller/setStatus'
      let obj = {
        id: this.currentRow.id,
        status: 'stopUse',
        stop_reason: value
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getShopListData()
          this.$mes('停用成功')
          return
        }
      })
    },
    // 启用商家
    startUseShop (t) {
      if (t === 'confirm') {
        // let { index, id } = this.currentRow
        // let itemIndex = index - 1 - ((this.page - 1) * this.pageSize)
        let { id } = this.currentRow
        let url = 'seller/setStatus'
        let obj = {
          id,
          status: 'startUse'
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.getShopListData()
            this.$mes('启用成功')
            return
          }
        })
      }
    },
    // 通过审核
    auditPass () {
      let { user_id } = this.currentRow
      let url = 'seller/applyVerify'
      let obj = {
        id: user_id,
        status: 'startUse',
        staff: this.isStartStaff ? 1 : 0
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getShopListData()
          this.$refs.popup.hide()
          this.isStartStaff = false
          this.$mes('修改成功')
          return
        }
      })
    },
    giveUpAuditPass () {
      this.$refs.popup.hide()
    },
    // 不通过审核
    auditUnPass (value) {
      let { user_id } = this.currentRow
      let url = 'seller/applyVerify'
      let obj = {
        id: user_id,
        status: 'rejected',
        rejectMsg: value
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getShopListData()
          this.$mes('修改成功')
          return
        }
      })
    },
    // 开通
    openStaff (t) {
      if (t === 'confirm') {
        let { index, staff, user_id } = this.currentRow
        let itemIndex = index - 1 - ((this.page - 1) * this.pageSize)
        let url = 'seller/setSub'
        let obj = {
          userId: user_id,
          status: 1
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.currentRow.onOff = true
            passedButtonList2.staffNum = staff
            this.currentRow.customButtonList = passedButtonList2
            this.tableData.splice(itemIndex, 1, this.currentRow)
            this.$mes('修改成功')
            return
          }
        })
      }
    },
    // 关闭
    closeStaff (t) {
      if (t === 'confirm') {
        let { index, user_id } = this.currentRow
        let itemIndex = index - 1 - ((this.page - 1) * this.pageSize)
        let url = 'seller/setSub'
        let obj = {
          userId: user_id,
          status: 2
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.currentRow.onOff = false
            this.currentRow.customButtonList = passedButtonList1
            this.tableData.splice(itemIndex, 1, this.currentRow)
            this.$mes('修改成功')
            return
          }
        })
      }
    }
  },
  components: {
    BasePopup
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.manage-alliance-container
  .manage-alliance-header
    flex-f-align()
    flex-wrap wrap
    > div
      margin-bottom 20px
    .register-select-circle,
    .shop-select-city,
    .shop-select-audit,
    .shop-select-pay,
    .shop-search-input,
    .shop-search
      flex-f-align()
      margin-left 20px
    .shop-search-input
      margin-left 25px
  .popup-container
    border-radius(10px)
    width 400px
    padding 20px
    background #ccc
    tc()
    h1
      f18()
      // color #409EFF
      margin-bottom 20px
    label
      margin-bottom 40px
    .button-wrapper
      flex-f-align()
      justify-content center
      > div:first-child
        margin-right 30px
</style>
