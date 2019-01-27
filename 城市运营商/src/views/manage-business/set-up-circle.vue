<template>
  <div class="set-up-circle-container">
    <div class="circle-name">
      <span>商圈</span>
      {{ name }}
    </div>
    <div class="add-shopper">
      <span>商家</span>
      <base-button :type="1" text="添加账号" @clickCurrentButton="addShopper"></base-button>
    </div>
    <!-- 选中商家 -->
    <base-table
      :data="choosedShoppers"
      :columns="shoppersColumns"
      :total="choosedShopperNum"
      :limit-total="999"
      :componentList="componentList"
      @buttonSubmit="deleteCurrentData">
    </base-table>
    <!-- 选择商品弹窗 -->
    <div class="add-shopper-container" v-show="isShowAllShopper">
      <div class="add-shopper-wrapper">
        <div class="add-shopper-title">
          <span></span>
          <i class="el-icon-close" @click="cancleAllShopper"></i>
        </div>
        <div class="add-shopper-header">
          <base-select
            placeholder="店铺名称"
            :options="filterOptions"
            @changeCurrentOption="changeCurrentOption">
          </base-select>
          <base-input
            placeholder="请输入店铺名称/账号"
            @changeInputValue="getSearchKeyWords"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchGoodsList">
          </base-button>
        </div>
        <base-table
          :data="allShopper"
          :columns="shoppersColumns"
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
    <div class="add-shopper-submit">
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
    </div>
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
    insertIndex: 5,
    width: 100,
    buttonList,
    eventType: 'buttonSubmit'
  }
]
const filterOptions = [
  {
    label: '店铺名称',
    value: 1
  },
  {
    label: '账号',
    value: 2
  }
]
// 全部商家
export default {
  name: 'SetUpCircle',
  mixins: [mixins],
  data () {
    return {
      shoppersColumns,
      componentList,
      isShowAllShopper: false,
      allShopper: [],
      selectedAllShoppers: [],
      // 选中的商家
      choosedShoppers: [],
      filterOptions,
      currentOption: 1,
      keywords: ''
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
  },
  methods: {
    // 获所有商家
    getShoppers () {
      let url = 'circle/distributors'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        user_id: this.id,
        type: Number(this.currentOption),
        keyword: this.keywords
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
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
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
      this.choosedShoppers = this.selectedAllShoppers.map((item, index) => {
        item.index = index + 1
        return item
      })
      this.isShowAllShopper = false
    },
    // 添加商家
    addShopper () {
      this.isShowAllShopper = true
    },
    // 移除选中的商家
    deleteCurrentData (row) {
      let { user_id } = row
      this.choosedShoppers.some((item, i, arr) => {
        if (item.user_id === user_id) {
          arr.splice(i, 1)
          return true
        }
      })
    },
    // 提交
    confirmSubmit () {
      if (!this.choosedShoppers.length) {
        this.$mes('请添加商家', 2)
        return
      }
      let arr = []
      this.choosedShoppers.forEach(item => {
        arr.push(item.seller_id + '')
      })
      let url = 'circle/save'
      /* eslint-disable */
      let obj = {
        store_id: JSON.stringify(arr),
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
        // this.$mes(res.message, 4)
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
    },
    changeCurrentOption (val) {
      this.currentOption = val
    },
    getSearchKeyWords (val) {
      this.keywords = val
    },
    searchGoodsList () {
      this.page = 1,
      this.getShoppers()
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.set-up-circle-container
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
