<template>
  <div class="business-compile">
     <div class="upload" v-if="flag">
       <span class="new">* </span><span>商户广告图：</span>
        <div class="uploadImg">
        <upload :imgUrl="adverImg" @uploadFile="getImg"></upload>
        <p>【尺寸大小 750*280，建议格式：'.png', '.jpeg', '.jpg'，不超过2M 】</p>
        </div>
     </div>
     <div class="addShop" v-show="isShow">
       <span class="new">* </span><span>选择店铺：</span>
       <el-button type="success" @click="addShop">添加店铺</el-button>
       <span>请选择一个店铺</span>
     </div>
     <div class="userInfo">
       <test :data="data" :columns="columns" :componentList="componentList2" :total="2" @bSubmit="delet" :tableHeight="107"></test>
     </div>
     <div class="addShop">
       <span class="new">* </span><span>添加商品：</span>
       <el-button type="success" @click="addShoping">添加商品</el-button>
       <span>请选择三件商品</span>
     </div>
     <div class="shopList">
       <test :componentList="componentList" :total="2" :columns="columns1" :data="data1" @bSubmit="buttonSubmit" :tableHeight="330"></test>
     </div>
     <div class="shopbutton">
       <el-button type="success" @click="addInfo">确认提交</el-button>
       <el-button type="primary" @click="forgo">放弃</el-button>
     </div>
     <!-- 选择商品的弹框 -->
      <el-dialog title="添加商品" :visible.sync="dialogTableVisible" width="60%">
        <div class="choose-goods-header">
          <base-select
            placeholder="请选择"
            :options="options1"
            @changeCurrentOption="CurrentOption">
          </base-select>
          <base-input
            placeholder="请输入关键字查找"
            @changeInputValue="getSearch"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchGoodsList">
          </base-button>
        </div>
        <test :data="data2" :total="Number(cheTotal)" :columns="columns2" @changePage="getGoodsByPage" :componentList="componentList1" @selectionChange="selection" :columnType="checkbo"></test>
        <div class="addmit">
          <el-button type="primary" @click="shopList">确定</el-button>
        </div>
      </el-dialog>
       <!-- 选择店铺的弹框 -->
      <el-dialog title="添加店铺" :visible.sync="dialogTableVi" width="60%">
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
        <test :data="data3" :total="Number(threeTotal)" :columns="columns3" :pageSize="3" @changePage="getGoodsListByPage"  @radioSubmit="changeRadio" :componentList="componentList3"></test>
        <div class="addmit">
          <el-button type="primary" @click="shopShow">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import Img from 'components/table-image'
import BaseButton from 'components/table-button'
import buttonn from 'components/button/index'
import test from 'components/table/index'
import upload from 'components/upload-img/index'
import rideo from 'components/table-radio'
const data = []
const data1 = []
const data2 = []
const columns = [
  { label: '公司名称', prop: 'company_name' },
  { label: '店铺名称', prop: 'shop_name' },
  { label: '品牌', prop: 'brand_name' },
  { label: '服务城市', prop: 'region_name' }
]
const columns1 = [
  { label: '产品ID', prop: 'id' },
  { label: '产品名称', prop: 'title' },
  { label: '零售标价', prop: 'price' },
  { label: '直采价', prop: 'purchase_price' },
  { label: '产品状态', prop: 'sale' }
]
const columns2 = [
  { label: '商品编号', prop: 'product_code' },
  { label: '标题', prop: 'title' },
  { label: '店铺名称', prop: 'seller_id' },
  { label: '品牌', prop: 'brand' },
  { label: '零售标价', prop: 'price' },
  { label: '直采价', prop: 'purchase_price' },
  { label: '库存', prop: 'stock' }
]
const columns3 = [
  { label: '公司名称', prop: 'company_name' },
  { label: '店铺名称', prop: 'shop_name' },
  { label: '品牌', prop: 'brand_name' },
  { label: '服务城市', prop: 'region_name' }
]
const buttonList = [
  {
    text: '删除',
    buttonType: 4
  }
]
const componentList = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 6,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
  },
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: Img,
    // 当前列的表头的名称                                                        --> String
    label: '图片',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    // buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 1
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    // eventType: 'bSubmit'
  }
]
const componentList1 = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: Img,
    // 当前列的表头的名称                                                        --> String
    label: '商品图',
    // 当前列的宽度                                                              --> Number
    width: 150,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    // buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 1
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    // eventType: 'bSubmit'
  }
]
const componentList2 = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 6,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
  }
]
const componentList3 = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: rideo,
    // 当前列的表头的名称                                                        --> String
    label: '',
    // 当前列的宽度                                                              --> Number
    width: 100,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    // buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 0,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'radioSubmit'
  }
]
const options = [
  {
    label: '店铺名称',
    value: 1
  }
]
const options1 = [
  {
    label: '产品名称',
    value: 1
  },
  {
    label: '产品id',
    value: 2
  }
]
export default {
  data () {
    return {
      flag: false,
      input10: '',
      isShow: false,
      checkbo: 'selection',
      data,
      data1,
      data2,
      data3: [],
      columns,
      columns3,
      componentList,
      componentList1,
      componentList2,
      componentList3,
      columns1,
      columns2,
      adverImg: '',
      dialogTableVisible: false,
      dialogTableVi: false,
      cheTotal: '',
      threeTotal: '',
      shosp: [],
      shopping: [],
      shoplist: '',
      merchant_img: '',
      goodId: '',
      options,
      options1,
      currentOption: 0, // 当前选择项
      keyWords: '', // 搜索关键字,
      current: 0, // 当前选择项
      keyIfno: '',
      shopgoods: ''
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      let id = this.$route.query.id
      let obj = {
        id: id
      }
      this.$http('adv/getRecommendMerchantDeatail', obj).then(res => {
        if (res.code === this.$ok) {
          this.data = res.data
          this.data1 = res.data[0].goodsList
          this.adverImg = res.data[0].merchant_img
          this.flag = true
          res.data.forEach(ele => {
            if (ele.brand_name === '') {
              ele.brand_name = '/'
            }
            if (ele.company_name === undefined) {
              ele.company_name = '/'
            }
          })
          this.data1.map(item => {
            item.src = item.image_path
          })
          res.data[0].goodsList.forEach(ele => {
            if (ele.sale === 0) {
              ele.sale = '未开始'
            } else if (ele.sale === 1) {
              ele.sale = '已上架'
            }
          })
        }
      })
    },
    addShoping () {
      this.dialogTableVisible = true
      let sellerId = this.data[0].seller_id || this.shosp[0].seller_id
      this.$http('adv/getGoods', { seller_id: sellerId, is_all: 1 }).then(res => {
        if (res.code === this.$ok) {
          this.data2 = res.data.data
          this.cheTotal = res.data.total
          this.data2.map(item => {
            item.src = item.image_path
          })
        }
      })
    },
    addShop () {
      this.$http('adv/getShop',{ is_all: 1 }).then(res => {
        if (res.code === this.$ok) {
          this.threeTotal = res.data.total
          this.data3 = res.data.data
          res.data.data.forEach(ele => {
            if (ele.brand_name === '') {
              ele.brand_name = '/'
            }
            if (ele.company_name === null) {
              ele.company_name = '/'
            }
            if (ele.region_name === '') {
              ele.region_name = '/'
            }
          })
        }
      })
      this.dialogTableVi = true
    },
    handlerTableData (data) {
      data.forEach((item, index) => {
        item.customRadio = false
        item.index = index
      })
    },
    // 商品表格单选
    changeRadio (row) {
      this.shosp.push(row)
      this.shopping = this.shosp.slice(0,1)
      let currentIndex = row.index
      this.data3.forEach((row, index, arr) => {
        if (currentIndex !== index) {
          row.customRadio = false
          arr.splice(index, 1, row)
        }
      })
    },
    selection (rows) {
      this.shoplist = rows
      if (this.shoplist.length > 3) {
        this.shopgoods = this.shoplist.slice(0,3)
        this.$message.error('最多选择三件商品')
      }
    },
    shopShow () {
      this.data = this.shopping
      this.dialogTableVi = false
      this.isShow = false
      this.shosp = []
    },
    shopList () {
      if (!this.shoplist.length) {
        this.$mes('您还未添加商品', 2)
        return
      }
      if (this.shoplist.length < 3) {
        this.$mes('至少选择三件商品', 4)
        return
      }
      if (this.shoplist.length <=3) {
        this.data1 = this.shoplist
      } else {
        this.data1 = this.shopgoods
      }
      this.dialogTableVisible = false
    },
    delet (row, type) {
      if (type === 4) {
        this.data = []
        this.data1 = []
        this.isShow = true
      }
    },
    getImg (res) {
      this.merchant_img = res
    },
    addInfo () {
      if (this.data1.length < 3) {
        this.$message.error('至少选择三个商品')
        return
      }
      let id = this.$route.query.id
      this.goodId = this.data1.map(item => {
        return item.id
      })
      let obj = {
        merchant_img: this.merchant_img || this.adverImg,
        seller_id: this.data[0].seller_id,
        goods_ids: this.goodId.join(),
        id: id
      }
      this.$http('adv/editRecommendMerchant', obj).then(res => {
        if (res.code === 400) {
          this.$message.error(res.message)
        }
        if (res.code === 600) {
          this.$message.error(res.message)
        }
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('/manage-market/hot-business')
        }
      })
    },
    forgo () {
      this.$confirm('你确定放弃编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '确认成功!'
        })
        this.$router.push('/manage-market/hot-business')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    buttonSubmit (row, type) {
      if (type === 4) {
        this.data1.splice(this.data1.findIndex( item => item.id = row.id ), 1)
      }
    },
    // 根据页码加载
    getGoodsListByPage (page) {
      this.page = page
      this.$http('adv/getShop', { page: this.page, pageSize: 10 }).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.threeTotal = res.data.total
          this.data3 = res.data.data
          res.data.data.forEach(ele => {
            if (ele.brand_name === '') {
              ele.brand_name = '/'
            }
            if (ele.company_name === null) {
              ele.company_name = '/'
            }
            if (ele.region_name === '') {
              ele.region_name = '/'
            }
          })
        }
      })
    },
         // 下拉框
    changeCurrentOption (value) {
      this.currentOption = value
    },
     // 关键字
    getSearchKeyWords (value) {
      this.keyWords = value
    },
    // 搜索按钮
    searchshopsList () {
      let currentOption = this.currentOption
      let keyWords = this.keyWords
      let shop_name = ''
      switch (currentOption) {
        case 1:
          shop_name = keyWords
          break
      }
      let obj = {
        page: 1,
        pageSize: 5,
        shop_name,
        is_all: 1
      }
      this.$http('adv/getShop', obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.threeTotal = res.data.total
          this.data3 = res.data.data
          res.data.data.forEach(ele => {
            if (ele.brand_name === '') {
              ele.brand_name = '/'
            }
            if (ele.company_name === null) {
              ele.company_name = '/'
            }
            if (ele.region_name === '') {
              ele.region_name = '/'
            }
          })
        }
      })
    },
    CurrentOption (value) {
      this.current = value
    },
    getSearch (value) {
      this.keyIfno = value
    },
    searchGoodsList () {
      let current = this.current
      let keyIfno = this.keyIfno
      let title = ''
      let product_code = ''
      switch (current) {
        case 1:
          title = keyIfno
          break
        case 2:
          product_code = keyIfno
          break
      }
      let obj = {
        page: 1,
        pageSize: 3,
        seller_id: this.data[0].seller_id,
        is_all: 1,
        title,
        product_code,
        key_word: keyIfno,
        type: current
      }
      this.$http('adv/getGoods', obj).then(res => {
        if (res.code === this.$ok) {
          this.data2 = res.data.data
          this.cheTotal = res.data.total
          this.data2.map(item => {
            item.src = item.image_path
          })
        }
      })
    },
    // 商品根据页码加载
    getGoodsByPage (page) {
      this.page = page
      let obj = {
        page: this.page,
        pageSize: 10,
        seller_id: this.data[0].seller_id,
        is_all: 1,
      }
      this.$http('adv/getGoods', obj).then(res => {
        if (res.code === this.$ok) {
          this.data2 = res.data.data
          this.cheTotal = res.data.total
          this.data2.map(item => {
            item.src = item.image_path
          })
        }
      })
    }
  },
  components: {
    upload,
    test,
    buttonn
  }
}
</script>
<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
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
.upload
  color #000
  .new
    color #f00
  .uploadImg
    margin-left 120px
    margin-top -10px
    p
      margin-top 10px
      margin-left -5px
      font-size 12px
.userInfo
  margin-top 10px
.addShop
  margin-top 20px
  .el-button
    width 100px
    height 40px
  .new
    color #f00
  span
    margin-left 10px
.shopList
  margin-top 20PX
.shopbutton
  margin-top 20px
  margin-left 50%
  transform translateX(-130px)
  .el-button
    width 100px
    height 40px
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
