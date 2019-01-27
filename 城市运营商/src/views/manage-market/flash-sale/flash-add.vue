<template>
  <div class="flashAdd">
    <div class="flashName">
      <span>*活动名称</span>
      <el-input
        placeholder="请输入内容"
        v-model="input10"
        clearable>
      </el-input>
    </div>
    <div class="flashstart">
      <span>*</span>
      <base-time-picker
        @pickerTime="pickerStartTime"
        dataType="datetime"
        placeholder="选择开始时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="开始时间：">
      </base-time-picker>
    </div>
    <div class="flashstart">
      <span>*</span>
      <base-time-picker
        @pickerTime="pickerEndTime"
        dataType="datetime"
        placeholder="选择结束时间"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="结束时间：">
      </base-time-picker>
    </div>
    <div class="flashImg">
      <span>*活动图片</span>
      <span class="info">【限时抢购入口图】( 尺寸大小 288*108，建议格式：'.png', '.jpeg', '.jpg'，不超过400KB )】</span>
      <div class="flashupload">
        <upload @uploadFile="leftimg"></upload>
        <!-- <upload @uploadFile="centerimg"></upload>
        <upload @uploadFile="rightimg"></upload> -->
      </div>
    </div>
    <div class="bannerimg">
      <span>【抢购详情banner】 ( 尺寸大小 750*280，建议格式：'.png', '.jpeg', '.jpg'，小于400KB )】</span>
      <div class="banupload">
        <upload @uploadFile="downimg"></upload>
      </div>
    </div>
    <div class="flashShop">
      <span>*添加商品</span>
      <div class="addButton" @click="show">
        <!-- <el-button type="primary" @click="show">添加商品</el-button> -->
        添加商品
      </div>
    </div>
    <div class="addtable">
      <base-table
        :data="data"
        :columns="columns"
        :componentList="componentList"
        :total="2"
        :columnType="indexx"
        @bSubmit="buttonSubmit"
        @getCurrentRowInputValue="getCurrentRowInputValue">
      </base-table>
    </div>
    <div class="flashButton">
      <el-button type="primary" @click="addFlash">提交</el-button>
      <el-button type="primary" @click="forgo">放弃</el-button>
    </div>
    <!-- 添加商品的弹框 -->
      <el-dialog title="添加商品" :visible.sync="dialogTableVisible" width="60%">
        <div class="choose-goods-header">
          <base-select
            placeholder="请选择"
            :options="options"
            @changeCurrentOption="changeCurrentOption">
          </base-select>
          <base-input
            placeholder="请输入关键字查找"
            @changeInputValue="getSearchKeyWords"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchshopsList">
          </base-button>
        </div>
        <base-table
          :data="data1"
          :total="Number(cheTotal)"
          :columns="columns1"
          @bSubmit="buSubmit"
          @changePage="getGoodsListByPage"
          :componentList="componentList1"
          @selectionChange="selection"
          :columnType="checkbo">
        </base-table>
        <div class="addmit">
          <el-button type="primary" @click="adshop">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import upload from 'components/upload-img'
import buttonn from 'components/button'
import BaseTableButton from 'components/table-button'
import Img from 'components/table-image'
import input from 'components/numer-input'
import promotion from 'components/promotion-price'
import stock from 'components/activity-stock'
import { initTime } from 'utils/common'
import { mixins } from 'mixins'
import { cloneDeep } from 'utils/common'
const data1 = []
const data = []
const columns = [
  {
    label: '商品id',
    prop: 'product_code'
  },
  {
    label: '标题',
    prop: 'title'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '起批量',
    prop: 'minimum_quantity'
  },
  {
    label: '运费',
    prop: 'freight'
  },
  {
    label: '零售标价',
    prop: 'price'
  },
  {
    label: '直采价',
    prop: 'purchase_range'
  }
]
const columns1 = [
  {
    label: '商品id',
    prop: 'product_code'
  },
  {
    label: '标题',
    prop: 'title'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '起批量',
    prop: 'minimum_quantity'
  },
  {
    label: '运费',
    prop: 'freight'
  },
  {
    label: '零售标价',
    prop: 'price'
  },
  {
    label: '直采价',
    prop: 'purchase_range'
  },
  {
    label: '活动库存',
    prop: 'stock'
  }
]
const ButtonList = [
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const componentList1 = [
  // {
  //   component: BaseTableButton,
  //   label: '操作',
  //   insertIndex: 9,
  //   width: 180,
  //   buttonList: ButtonList,
  //   eventType: 'bSubmit'
  // },
  {
    component: Img,
    label: '商品图',
    insertIndex: 1
  }
]
const componentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 11,
    width: 180,
    buttonList: ButtonList,
    eventType: 'bSubmit'
  },
  {
    component: Img,
    label: '商品图',
    insertIndex: 2
  },
  {
    width: 135,
    component: promotion,
    label: '活动价格',
    insertIndex: 8,
    eventType: 'getCurrentRowInputValue'
  },
  {
    width: 135,
    component: stock,
    label: '活动库存',
    insertIndex: 9,
    eventType: 'getCurrentRowInputValue'
  },
  {
    width: 135,
    component: input,
    label: '限购数/人',
    insertIndex: 10,
    eventType: 'getCurrentRowInputValue'
  }
]
const options = [
  {
    value: 1,
    label: '商品名称'
  },
  {
    value: 2,
    label: '商品id'
  },
  {
    value: 3,
    label: '店铺名称'
  }
]
export default {
  mixins: [mixins],
  data () {
    return {
      options,
      checkbo: 'selection',
      indexx: 'index',
      cheTotal: '',
      data1,
      columns1,
      componentList1,
      data,
      columns,
      componentList,
      dialogTableVisible: false,
      input10: '',
      startTime: '',
      endTime: '',
      shoplist: [],
      img1: '',
      img2: '',
      img3: '',
      img4: '',
      goodId: '',
      rempilePrice: [],
      numbesd: [],
      activityStock: [],
      sort: '',
      goods_name: '',
      max_price: '',
      goods_image_path: '',
      origStock: '',
      spec: '',
      currentOption: 0, // 当前选择项
      keyWords: '' // 搜索关键字,
    }
  },
  created () {
  },
  methods: {
    show () {
      this.$http('sale/getGoods').then(res => {
        if (res.code === this.$ok) {
          this.data1 = res.data.data
          this.cheTotal = res.data.total
          res.data.data.forEach(ele => {
            if (ele.shop_name === null) {
              ele.shop_name = '/'
            }
          })
          this.data1.map(item => {
            item.src = item.image_path
            item.height = 50
            item.width = 50
            item.spaced = 0
          })
        }
      })
      this.dialogTableVisible = true
    },
    selection (rows) {
      this.shoplist = rows
    },
    adshop () {
      if (!this.shoplist.length) {
        this.$mes('您还未添加商品', 2)
        return
      }
      this.data = [...this.data, ...this.shoplist]
      this.dialogTableVisible = false
      let arr = []
      this.data.forEach(() => {
        arr.push('')
      })
      this.rempilePrice = Object.assign(cloneDeep(arr), this.rempilePrice)
      this.activityStock = Object.assign(cloneDeep(arr), this.activityStock)
      this.numbesd = Object.assign(cloneDeep(arr), this.numbesd)
    },
    addFlash () {
      this.sort = this.data.map((item, i) => {
        return i + 1
      })
      this.goodId = this.data.map(item => {
        return item.id
      })
      this.goods_name = this.data.map(item => {
        return item.title
      })
      this.max_price = this.data.map(item => {
        return item.max_price
      })
      this.goods_image_path = this.data.map(item => {
        return item.image_path
      })
      this.origStock = this.data.map(item => {
        return item.minimum_quantity
      })
      this.spec = this.data.map(item => {
        return item.spaced
      })
      let obj = {
        name: this.input10,
        image_path: this.img1,
        banner_path: this.img4,
        id: this.goodId.join(),
        start_at: this.startTime,
        end_at: this.endTime,
        sort: this.sort.join(),
        goods_name: this.goods_name.join(),
        max_price: this.max_price.join(),
        price: this.rempilePrice.join(),
        stock: this.activityStock.join(),
        spaced: this.spec.join(),
        number: this.numbesd.join(),
        original_stock: this.origStock.join(),
        goods_image_path: this.goods_image_path.join(),
        spec: ''
      }
      if (this.rempilePrice.length < this.data.length) {
        this.$message.error('请填写活动价格')
        return
      }
      if (this.numbesd.length < this.data.length) {
        this.$message.error('请填写限购数/人')
        return
      }
      if (this.activityStock.length < this.data.length) {
        this.$message.error('请填写活动库存')
        return
      }
      const nowTime = new Date() - 0
      if (!this.startTime) {
        this.$mes('开始时间不能为空', 2)
        return false
      }
      if (initTime(this.endTime) <= initTime(this.startTime)) {
        this.$mes('结束时间需大于开始时间', 2)
        return false
      }
      if (initTime(this.endTime) <= nowTime) {
        this.$mes('结束时间需大于当前时间', 2)
        return false
      }
      this.$http('sale/save', obj).then(res => {
        if (res.code === 400) {
          this.$message.error(res.message)
        }
        if (res.code === 600) {
          this.$message.error(res.message)
        }
        if (res.code === this.$ok) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('/manage-market/flash-sale')
          this.data = []
        }
      })
    },
    leftimg (res) {
      this.img1 = res
    },
    centerimg (res) {
      this.img2 = res
    },
    rightimg (res) {
      this.img3 = res
    },
    downimg (res) {
      this.img4 = res
    },
    getCurrentRowInputValue (item) {
      let { value, type, row } = item
      let index = 0
      if (value === '') return
      this.data.some((goodsItem, goodsIndex) => {
        if (goodsItem.id === row.id) {
          index = goodsIndex
          switch (type) {
            case 'price':
              goodsItem.inputPriceVale = value
              break
            case 'stock':
              goodsItem.inputValeStock = value
              break
            case 'number':
              goodsItem.inputNumerValue = value
              break
          }
          return true
        }
      })
      switch (type) {
        case 'price':
          this.rempilePrice.splice(index, 1, value)
          break
        case 'stock':
          this.activityStock.splice(index, 1, value)
          break
        case 'number':
          this.numbesd.splice(index, 1, value)
          break
      }
    },
    // 活动价格输入
    priceChangeInputValue (value) {
      if (value === '') {
        this.$message.error('请填写活动价格')
        this.rempilePrice = []
        return
      } else {
        this.rempilePrice.push(value)
      }
    },
    // 活动库存输入
    stockChangeInputValue (value) {
      if (value === '') {
        this.$message.error('请填写活动库存')
        this.activityStock = []
        return
      } else {
        this.activityStock.push(value)
      }
    },
    //  限购人数输入
    changeInputValue (value) {
      if (value === '') {
        this.$message.error('请填写限购数/人')
        this.numbesd = []
        return
      } else {
        this.numbesd.push(value)
      }
    },
    buttonSubmit (row, type) {
      let index = this.data.findIndex( item => item.id === row.id)
      this.data.splice(index, 1)
      this.rempilePrice.splice(index, 1)
      this.activityStock.splice(index, 1)
      this.numbesd.splice(index, 1)
    },
    buSubmit (row, type) {
      if (type === 4) {
        this.data1.splice(this.data1.findIndex( item => item.id === row.id), 1)
      }
    },
    pickerStartTime (t) {
      this.startTime = t
    },
    pickerEndTime (t) {
      this.endTime = t
    },
    // 放弃按钮
    forgo () {
      this.$confirm('你确定要放弃吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        })
        this.$router.push('/manage-market/flash-sale')
        this.shoplist = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getGoodsListByPage (page) {
      this.page = page
      // this.$http('sale/getGoods', { page: this.page, pageSize: 10 }).then(res => {
      //   if (res.code === this.$ok) {
      //     this.data1 = res.data.data
      //     this.cheTotal = res.data.total
      //     this.data1.map(item => {
      //       item.src = item.image_path
      //       item.height = 50
      //       item.width = 50
      //     })
      //   }
      // })
      this.getShoplist()
    },
    // 下拉框
    changeCurrentOption (value) {
      this.currentOption = value
    },
    // 关键字
    getSearchKeyWords (value) {
      this.keyWords = value
    },
    getShoplist () {
      let currentOption = this.currentOption
      let keyWords = this.keyWords
      let title = ''
      let product_code = ''
      let shop_name = ''
      switch (currentOption) {
        case 1:
          title = keyWords
          break
        case 2:
          product_code = keyWords
          break
        case 3:
          shop_name = keyWords
          break
      }
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        title,
        product_code,
        shop_name,
        type: currentOption,
        keywords: keyWords
      }
      this.$http('sale/getGoods', obj).then(res => {
        if (res.code === this.$ok) {
          this.data1 = res.data.data
          this.cheTotal = res.data.total
          res.data.data.forEach(ele => {
            if (ele.shop_name === null) {
              ele.shop_name = '/'
            }
          })
          this.data1.map(item => {
            item.src = item.image_path
            item.height = 50
            item.width = 50
          })
        }
      })
    },
    // 搜索按钮
    searchshopsList () {
      this.page = 1
      this.getShoplist()
    }
  },
  components: {
    upload,
    buttonn
  }
}
</script>
<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.addButton
  width 100px
  height 40px
  background-color #67c23a
  text-align center
  line-height 40px
  color #fff
  margin-left 20px
  border-radius 5px
  cursor pointer
.serach
  position absolute
  right 120px
  top 40px
.buttonItem
  position absolute
  top 45px
  right 50px;
.el-input
  width 260px
  margin-left 10px
.addmit
  position relative
  left 50%
  margin-left -40px
  margin-top 20px
.flashName
  display flex
  span
    height 40px
    line-height 40px
    font-size 15px
  .el-input
    width 220px
    margin-left 30px
.flashstart
  display flex
  margin-top 20px
  span
    height 32px
    line-height 32px
    font-size 15px
.flashImg
  margin-top 20px
  span
    font-size 15px
  .info
    color #999
    margin-left 20px
.flashupload
  margin-top 20px
  margin-left 100px
  .upload-img-container:nth-child(1)
    width 300px
    height 300px
  .upload-img-container:nth-child(2)
    width 360px
    height 150px
    margin-left 20px
  .upload-img-container:nth-child(3)
    width 360px
    height 150px
    margin-left 20px
.bannerimg
  margin-top 20px
  margin-left 100px
  span
    color #999
  .banupload
    margin-top 20px
    .upload-img-container
      width 750px
      height 280px
.flashShop
  margin-top 20px
  display flex
  span
    height 40px
    line-height 40px
    font-size 15px

.addtable
  margin-top 20px
.flashButton
  margin-top 20px
  width 100%
  text-align center
.choose-goods-header
  padding-bottom 20px
  flex-f-align()
  justify-content flex-end
  .search-input
    margin 0 10px
.choose-goods-body
  height 380px
.choos-goods-comfirm
  flex-f-align()
  justify-content flex-end
  padding 0 20px
  padding-bottom 20px
  margin-top -10px
  >div
    margin-right 10px
</style>
