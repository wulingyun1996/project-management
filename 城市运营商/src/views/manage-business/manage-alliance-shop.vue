<template>
  <div class="manage-alliance-shop-container">
    <div class="add-shopper">
      <base-button :type="1" text="添加账号" @clickCurrentButton="addShopper"></base-button>
    </div>
    <!-- 选中商家 -->
    <base-table
      :data="choosedShoppers"
      :columns="shoppersColumns"
      :total="choosedShopperNum"
      :limit-total="999"
      :componentList="componentList"
      @buttonSubmit="getDisbandCircleStatus">
    </base-table>
    <!-- 选择商品弹窗 -->
    <div class="add-shopper-container" v-show="isShowAllShopper">
      <div class="add-shopper-wrapper">
        <div class="add-shopper-title">
          <span></span>
          <i class="el-icon-close" @click="cancleAllShopper"></i>
        </div>
        <base-table
          :data="allShopper"
          :columns="columns"
          :total="total"
          :tableHeight="300"
          columnType="selection"
          @selectionChange="selectAll"
          @changePage="changeALLPage">
        </base-table>
        <div class="add-shopper-comfirm">
          <base-button
            text="确定"
            :type="1"
            @clickCurrentButton="confirmChoosedShoppers">
          </base-button>
          <base-button
            text="取消"
            @clickCurrentButton="cancleAllShopper">
          </base-button>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <!-- <div class="add-shopper-submit">
      <base-button
        text="确定"
        :type="1"
        :size="1"
        @clickCurrentButton="confirmSubmit">
      </base-button>
      <base-button
        text="放弃"
        :size="1"
        @clickCurrentButton="cancleSubmit">
      </base-button>
    </div> -->
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import { mixins } from 'mixins'
// 已添加的表格数据
const shoppersColumns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'mobile'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '所属圈子数',
    prop: 'group_count'
  },
  {
    label: '加入时间',
    prop: 'created_at'
  },
  {
    label: '商家状态',
    prop: 'status'
  }
]
// 弹窗表格数据
const columns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '账号',
    prop: 'mobile'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '服务城市',
    prop: 'address'
  },
  {
    label: '联系人',
    prop: 'contact'
  }
]
// 插入按钮组件
const buttonList = [
  {
    text: '删除',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  }
]
const componentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 6,
    width: 100,
    buttonList,
    eventType: 'buttonSubmit'
  }
]
// 全部商家
export default {
  name: 'ManageAlliance',
  mixins: [mixins],
  data () {
    return {
      shoppersColumns,
      componentList,
      isShowAllShopper: false,
      columns,
      allShopper: [],
      selectedAllShoppers: [],
      // 选中的商家
      choosedShoppers: [],
      groupId: '',
      currentRow: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    name () {
      return this.$route.query.name
    },
    choosedShopperNum () {
      return this.choosedShoppers.length
    }
  },
  created () {
    this.getShoppers()
    this.getCircleShoppers()
  },
  methods: {
    // 获取圈内商家
    getCircleShoppers () {
      let url = 'circle/getStore'
      let obj = {
        user_id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          res.data.forEach((item, index) => {
            item.index = index + 1
            this.groupId = item.group_id
            if (!item.shop_name) {
              item.shop_name = '/'
            }
          })
          this.choosedShoppers = res.data
        }
      })
    },
    // 获所有商家
    getShoppers () {
      let url = 'circle/distributors'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        user_id: this.id,
        type: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerAllShopperData(res.data.data)
          this.allShopper = res.data.data
          this.total = res.data.total
        }
      })
    },
    handlerAllShopperData (data) {
      data.forEach((item, index) => {
        item.index = (index + 1) + ((this.page - 1) * 15)
      })
    },
    // 所有商家分页事件
    changeALLPage (page) {
      this.page = page
      this.getShoppers()
    },
    // 所有商家的多选事件
    selectAll (rows) {
      this.selectedAllShoppers = rows
    },
    // 关闭弹窗
    cancleAllShopper () {
      this.selectedAllShoppers = []
      this.isShowAllShopper = false
    },
    confirmChoosedShoppers () {
      if (!this.selectedAllShoppers.length) {
        this.$mes('请添加商家', 2)
        return
      }
      let arr = []
      let id
      this.selectedAllShoppers.forEach((item, index) => {
        arr.push(item.seller_id)
      })
      id = arr.join()
      this.addShopers(id)
      this.isShowAllShopper = false
    },
    // 添加商家的接口
    addShopers (id) {
      let url = 'circle/addCricleSeller'
      let obj = {
        seller_id: id,
        group_id: this.groupId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getCircleShoppers()
          this.$mes('添加成功')
          return
        }
        this.$mes(res.message, 4)
      })
    },
    // 添加商家
    addShopper () {
      this.isShowAllShopper = true
    },
    // 查询当前圈子状态
    getDisbandCircleStatus (row) {
      this.currentRow = row
      let url = 'circle/bismissStatus'
      let obj = {
        // unionId: this.id
        unionId: row.group_id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let code = res.data
          if (this.choosedShoppers.length === 1) {
            // 被设置成为热门商圈
            this.$mesBox(`该商圈为热门圈子不能解散该圈子`, '提示', 1, 1, '确定', '取消')
            return
          }
          // 活动进行，但是未有用户付款
          // if (code === 1) {
          //   this.$mesBox(`该圈子有活动在进行中，解散后该活动将无法进行，确定要解散嘛？`, '提示', 1, 1, '确定', '取消', this.deleteCurrentData)
          //   return
          // }
          // 有用户报名参与，不可解散
          if (code === 2) {
            this.$mesBox(`活动正在进行中，不可删除`, '提示', 1, 1, '确定', '取消')
            // this.$mesBox(`已有用户报名参加活动，不可解散圈子`, '提示', 1, 1, '确定', '取消')
            return
          }
          // 未有用户参与
          if (code === 3 || code === 1) {
            this.$mesBox(`是否删除！`, '提示', 1, 1, '确定', '取消', this.deleteCurrentData)
          }
        }
      })
    },
    // 移除选中的商家
    deleteCurrentData (t) {
      if (t === 'confirm') {
        let { seller_id } = this.currentRow
        let url = 'circle/delStore'
        let obj = {
          group_id: this.groupId,
          store_id: seller_id,
          user_id: this.id
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.choosedShoppers.some((item, i, arr) => {
              if (item.seller_id === seller_id) {
                arr.splice(i, 1)
                return true
              }
            })
            if (!this.choosedShopperNum) this.$router.back()
            this.$mes('删除成功')
            return
          }
          this.$mes(res.message, 4)
        })
      }
    },
    // 提交
    confirmSubmit () {
      if (!this.choosedShoppers.length) {
        this.$mes('请添加商家', 2)
        return
      }
      let arr = []
      this.choosedShoppers.forEach(item => {
        arr.push(item.seller_id)
      })
      let url = 'circle/save'
      /* eslint-disable */
      let obj = {
        store_id: arr,
        user_id: this.id,
        union_name: this.name
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('提交成功')
          this.$router.back()
          return
        }
        this.$mes(res.message, 4)
      })
    },
    cancleSubmit () {
      this.$mesBox(`您确定要放弃此次编辑吗？`, '提示', 1, 1, '确定', '取消', this.goBack)
    },
    // 放弃编辑
    goBack (t) {
      if (t === 'confirm') {
        this.$router.back()
      }
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.manage-alliance-shop-container
  .el-button
    width auto
  .circle-name,
  .add-shopper
    margin-bottom 20px
    flex-f-align()
    >span
      margin-right 20px
    button
      f14()
  // 选择商家弹窗
  .add-shopper-container,
  .alliance-add-table
    wh(100%)
    position absolute
    left 0
    top 0
    background rgba(0, 0, 0, .4)
    .add-shopper-wrapper
      width 1300px
      padding 20px
      padding-bottom 0
      z-index 999
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      background #fff
      .add-shopper-title
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
      .add-shopper-header
        padding-bottom 20px
        flex-f-align()
        justify-content flex-end
        .search-input
          margin 0 10px
      .add-shopper-body
        height 380px
      .add-shopper-comfirm
        flex-f-align()
        justify-content flex-end
        padding 0 20px
        padding-bottom 20px
        margin-top 20px
        >div
          margin-right 10px
  .add-shopper-submit
    flex-f-align()
    justify-content center
    padding 0 20px
    margin-top 20px
    >div
      margin-right 20px
      button
        f14()
</style>
