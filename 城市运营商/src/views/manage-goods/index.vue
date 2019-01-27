<template>
  <div class="manage-goods-container">
    <div class="register-business-header">
      <div class="register-select-time">
        <base-time-picker
          @pickerTime="pickerRegisterTime"
          timeText="发布时间">
        </base-time-picker>
      </div>
      <div class="register-select-circle">
        <base-select
          :options="option1"
          @changeCurrentOption="getGoodsCategory"
          placeholder="全部"
          class="select-options">
        </base-select>
      </div>
      <div class="register-select-role">
        <base-select
          :options="option2"
          @changeCurrentOption="getGoodsStatus"
          placeholder="商品状态"
          class="select-options">
        </base-select>
      </div>
      <div class="register-select-role">
        <base-select
          :options="option3"
          @changeCurrentOption="getGoodsAttr"
          placeholder="全部"
          class="select-options">
        </base-select>
      </div>
      <div class="register-search-input">
        <base-input
          placeholder="请输入关键词"
          @changeInputValue="getSearchKeyWords"
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
    <base-table
      :data="data"
      :total="total"
      :pageSize="pageSize"
      :columns="columns"
      :heght="450"
      :componentList="componentList"
      @buttonSubmit="buttonSubmit"
      @goGoodsDetail="goGoodsDetail"
      @changePage="changePage">
    </base-table>
    <el-dialog
      :visible.sync="showAddMeterialGoods"
      center
      width="30%">
      <span>请选择材料馆</span>
      <div class="meterial-goods">
      <el-checkbox-group v-model="selectedMeterialName">
        <el-checkbox v-for="name in allMeterialName" :label="name" :key="name">{{ name }}</el-checkbox>
      </el-checkbox-group>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="joinMeterialGoods">确 定</el-button>
        <el-button @click="cancleAddMeterialGoods">放 弃</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showRemoveMeterialGoods"
      center
      width="30%">
      <span>请选择移出材料馆</span>
      <div class="meterial-goods">
        <el-checkbox-group v-model="selectedMeterialName">
          <el-checkbox v-for="name in allMeterialName" :label="name" :key="name">{{ name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="removeMeterialGoods">确 定</el-button>
        <el-button @click="cancleAddMeterialGoods">放 弃</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseButton from 'components/table-button'
import TableImg from 'components/table-image'
import TableHref from 'components/href'
import { mixins } from 'mixins'
import { inArray } from 'utils/common'
const columns = [
  { label: '商品编号', prop: 'product_code' },
  { label: '品牌', prop: 'brand_name' },
  { label: '市场标价', prop: 'price' },
  { label: '零售限价', prop: 'promotion_price' },
  { label: '特约采购师价', prop: 'purchase_price' },
  { label: '佣金', prop: 'commission' },
  { label: '库存', prop: 'stock' },
  { label: '商家名称', prop: 'shop_name' },
  { label: '发布日期', prop: 'created_at' },
  { label: '现货', prop: 'isStockGood' },
  { label: '精品馆', prop: 'bestGoods' },
  { label: '材料馆', prop: 'materialGoods' },
  // { label: '特约折扣', prop: 'isSpecial' },
  { label: '商品状态', prop: 'goodsStatus' }
]
const option1 = [
  {
    label: '全部',
    value: 1
  },
  {
    label: '精品馆',
    value: 2
  },
  {
    label: '材料馆',
    value: 3
  }
]
const option2 = [
  {
    label: '正常',
    value: 0
  },
  {
    label: '删除',
    value: 1
  },
  {
    label: '禁用',
    value: 2
  },
  {
    label: '强制下架',
    value: 3
  }
]
const option3 = [
  {
    label: '全部',
    value: 1
  },
  {
    label: '商品编号',
    value: 2
  },
  {
    label: '商品名称',
    value: 3
  },
  {
    label: '品牌',
    value: 4
  }
]
// 自定义列
const componentList = [
  {
    component: BaseButton,
    label: '操作',
    width: 380,
    insertIndex: 16
  },
  {
    component: TableImg,
    label: '图片',
    insertIndex: 1,
    height: 100,
    width: 140
  },
  {
    component: TableHref,
    label: '商品名称',
    insertIndex: 2,
    eventType: 'goGoodsDetail',
    height: 100,
    width: 140
  }
]
let downLoadGoods = {
  text: '强制下架',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  operatorType: 'downLoadGoods'
}
// 加入精品馆
let joinBestGoods = {
  text: '加入精品馆',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  operatorType: 'joinBestGoods'
}
// 加入材料馆
let joinMeterialGoods = {
  text: '加入材料馆',
  buttonType: 1,
  type: 'primary',
  size: 'small',
  operatorType: 'joinMeterialGoods'
}
// 移出精品馆
let removeBestGoods = {
  text: '移出精品馆',
  buttonType: 4,
  type: 'danger',
  size: 'small',
  operatorType: 'removeBestGoods'
}
// 移出材料馆
let removeMeterialGoods = {
  text: '移出材料馆',
  buttonType: 4,
  type: 'danger',
  size: 'small',
  operatorType: 'removeMeterialGoods'
}
export default {
  name: 'ManageGoods',
  mixins: [mixins],
  data () {
    return {
      columns,
      data: [],
      componentList,
      option1,
      option2,
      option3,
      meterialList: [],
      meterialNameToId: {},
      currentGoods: {},
      startTime: '',
      endTime: '',
      goodsCategory: '',
      goodsStatus: '',
      goodsAttrs: '',
      keyWords: '',
      selectAll: false,
      isIndeterminate: false,
      showAddMeterialGoods: false,
      showRemoveMeterialGoods: false,
      allMeterialName: [],
      selectedMeterialName: []
    }
  },
  created () {
    this.dataList()
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
    // 商品分类
    getGoodsCategory (val) {
      this.goodsCategory = val
    },
    // 商品状态
    getGoodsStatus (val) {
      this.goodsStatus = val
    },
    // 商品属性
    getGoodsAttr (val) {
      this.goodsAttrs = val
    },
    // 关键词
    getSearchKeyWords (val) {
      this.keyWords = val
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.dataList()
    },
    dataList () {
      let { page, pageSize, startTime, endTime, goodsCategory, goodsStatus, goodsAttrs, keyWords  } = this
      let title = ''
      let product_code = ''
      let brand_name = ''
      let boutique = ''
      let material = ''
      switch (goodsCategory) {
        case 1:
          boutique = ''
          material = ''
          break
        case 2:
          boutique = 1
          break
        case 3:
          material = 1
          break
      }
      switch (goodsAttrs) {
        case 1:
          title = ''
          product_code = ''
          brand_name = ''
          break
        case 2:
          product_code = keyWords
          break
        case 3:
          title = keyWords
          break
        case 4:
          brand_name = keyWords
          break
      }
      let url = 'sale/goodList'
      let obj = {
        page,
        pageSize,
        starTime: startTime,
        endTime,
        is_delete: goodsStatus,
        title,
        product_code,
        brand_name,
        boutique,
        material
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerData(res.data.data)
          this.data = res.data.data
          this.total = res.data.total
        }
      })
    },
    // 材料馆列表
    getMeterialList () {
      this.selectedMeterialName = []
      this.allMeterialName = []
      let url = 'boutique/getUserList'
      this.$http(url).then(res => {
        this.meterialList = res.data.data
        res.data.data.forEach((item, index) => {
          if (item.status === '停用') {
            this.meterialList.splice(index, 1)
          } else {
            this.allMeterialName.push(item.name)
          }
        })
        this.showAddMeterialGoods = true
      })
    },
    selectAllMeterial (val) {
      //
    },
    handlerData (data) {
      data.map((item, index) => {
        let arr = []
        item.index = index
        item.src = item.image_path
        if (item.is_stock_good) {
          item.isStockGood = '是'
        } else {
          item.isStockGood = '否'
        }
        if (item.is_special) {
          item.isSpecial = '是'
        } else {
          item.isSpecial = '否'
        }
        if (item.is_delete === 0) {
          if (item.sale === 2) {
            item.goodsStatus = '上架'
            arr.push(downLoadGoods)
          } else {
            item.goodsStatus = '下架'
          }
        }
        if (item.is_delete === 1) {
          item.goodsStatus = '已删除'
        }
        if (item.is_delete === 2) {
          item.goodsStatus = '已禁用'
        }
        if (item.is_delete === 3) {
          item.goodsStatus = '强制下架'
        }
        // 精品馆
        if (item.boutique) {
          item.bestGoods = '是'
          arr.push(removeBestGoods)
        } else {
          item.bestGoods = '否'
          if ((item.is_delete === 0 && item.sale === 1) || item.is_delete === 3) {
            //
          } else {
            arr.push(joinBestGoods)
          }
        }
        // 材料馆
        if (item.material) {
          item.materialGoods = item.material
        } else {
          item.materialGoods = '否'
        }
        // 下架和强制下架没有加入精品馆和材料馆
        if ((item.is_delete === 0 && item.sale === 1) || item.is_delete === 3) {
          //
        } else {
          arr.push(joinMeterialGoods)
        }
        arr.push(removeMeterialGoods)
        if (!item.brand_name) item.brand_name = '/'
        item.buttonList = arr
      })
    },
    // 强制下架
    buttonSubmit (row, type, flag) {
      this.currentGoods = row
      switch (flag) {
        case 'downLoadGoods':
          this.downLoadGoods(row)
          break
        case 'joinBestGoods':
          this.$mesBox(`确定将 ${row.title}  加入精品馆吗？`, '提示', 1, 1, '确定', '放弃', this.joinBestGoods)
          break
        case 'joinMeterialGoods':
          this.getMeterialList()
          break
        case 'removeBestGoods':
          this.$mesBox(`确定将 ${row.title}  移出精品馆吗？`, '提示', 1, 1, '确定', '放弃', this.removeBestGoods)
          break
        case 'removeMeterialGoods':
          this.getGoodsBelongedMeterial()
          // this.showRemoveMeterialGoods = true
          break
      }
    },
    // 强制下架商品
    downLoadGoods (row) {
      this.$prompt('请输入强制下架理由', {
      }).then(({ action, value }) => {
        if (value === null || !value.trim()) {
          this.$mes('理由不能为空', 2)
          return
        }
        if (action === 'confirm') {
          let url = 'sale/forceOut'
          let obj = {
            goods_id: row.id,
            shelf_reason: value
          }
          this.$http(url, obj).then(res => {
            if (res.code === this.$ok) {
              // row.is_delete = 3
              // row.goodsStatus = '强制下架'
              // row.buttonList = []
              // this.data.splice(row.index, 1, row)
              this.dataList()
              this.$mes('强制下架成功')
            }
          })
        }
      })
    },
    // 加入精品馆
    joinBestGoods (t) {
      if (t === 'confirm') {
        let url = 'sale/setBoutiqueStatus'
        let obj = {
          goods_id: this.currentGoods.id,
          status: 1
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.dataList()
            this.$mes('加入精品馆成功')
          }
        })
      }
    },
    // 加入材料馆
    joinMeterialGoods () {
      let arr = []
      let { currentGoods } = this
      this.meterialList.forEach(item => {
        this.selectedMeterialName.forEach(name => {
          if (item.name === name) {
            arr.push(item.id)
          }
        })
      })
      let url = 'sale/addMaterial'
      let obj = {
        goods_id: currentGoods.id,
        material_id: arr.join(),
        type: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.dataList()
          this.showAddMeterialGoods = false
          this.$mes('加入材料馆成功')
        }
      })
    },
    // 移出精品馆
    removeBestGoods (t) {
      if (t === 'confirm') {
        let url = 'sale/setBoutiqueStatus'
        let obj = {
          goods_id: this.currentGoods.id,
          status: 0
        }
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.dataList()
            this.$mes('移出精品馆成功')
          }
        })
      }
    },
    // 获取商品所属的材料馆列表
    getGoodsBelongedMeterial () {
      this.selectedMeterialName = []
      this.allMeterialName = []
      const url = 'sale/materialList'
      const obj = {
        goods_id: this.currentGoods.id
      }
      this.$http(url, obj).then(res => {
        this.meterialList = res.data
        res.data.forEach(item => {
          this.allMeterialName.push(item.name)
        })
        this.showRemoveMeterialGoods = true
      })
    },
    // 移出材料馆
    removeMeterialGoods () {
      let arr = []
      let { currentGoods } = this
      this.meterialList.forEach(item => {
        this.selectedMeterialName.forEach(name => {
          if (item.name === name) {
            arr.push(item.id)
          }
        })
      })
      let url = 'sale/addMaterial'
      let obj = {
        goods_id: currentGoods.id,
        material_id: arr.join(),
        type: 2
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.dataList()
          this.showRemoveMeterialGoods = false
          this.$mes('移出材料馆成功')
        }
      })
    },
    cancleAddMeterialGoods () {
      this.showRemoveMeterialGoods = false
      this.showAddMeterialGoods = false
    },
    // 点击分页
    changePage (page) {
      this.page = page
      this.dataList()
    },
    goGoodsDetail (row) {
      this.$push({ name: 'GoodsDetail', query: { id: row.id } })
    }
  },
  components: {
    TableImg
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
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
.meterial-goods
  max-height 600px
  overflow hidden
  overflow-y auto
  .el-checkbox-group
    height 100%
    flex-col()
    .el-checkbox
      margin-top 20px
      & + .el-checkbox
        margin-left 0
</style>
