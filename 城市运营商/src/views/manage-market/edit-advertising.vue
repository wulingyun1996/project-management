
+++<template>
  <div class="editadvtising">
    <div class="addmit">
      <span class="red">* </span>
      <span>添加广告位</span>
      <!-- <el-button type="success" @click="show">添加</el-button> -->
      <div class="addBuutton" @click="show">
        添加
      </div>
    </div>
    <div class="addSpace" v-show="isShow">
      <div class="spaceIput">
        <span class="red">* </span>
        <span>广告位名称：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="spaceRideo">
        <span class="red">* </span>
        <span>广告位位置：</span>
        <div class="place">
          <div class="left">左大图</div>
          <div class="right-top">右图一</div>
          <div class="right-down">右图二</div>
        </div>
        <div class="radio">
          <el-radio-group v-model="radio2">
            <el-radio :label="0">左大图(可配置4个)</el-radio>
            <el-radio :label="1">右图一(可配置1个)</el-radio>
            <el-radio :label="2">右图二(可配置1个)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="addstore">
        <span class="red">* </span>
        <span>关联店铺：</span>
        <el-button type="success" @click="addShop" v-show="shopshow">添加店铺</el-button>
        <div class="addtable">
         <test :total="1" :data="data1" :columns="columns1" :componentList="componentList1" @bSubmit="delet"></test>
        </div>
      </div>
      <div class="addupload">
        <span class="red">* </span>
        <span>上传图片：</span>
        <span class="info">【 左图尺寸：346*346，右图尺寸：360*168，建议格式：'.png', '.jpeg', '.jpg'，不超过400KB 】</span>
        <div class="uploadImg">
          <upload @uploadFile="getImg"></upload>
        </div>
      </div>
      <div class="addButton">
        <el-button type="success" @click="add">确认提交</el-button>
        <el-button @click="forgo">放弃</el-button>
      </div>
    </div>
    <div class="table">
      <test :total="1" :data="data" :columns="columns" :componentList="componentList" @bSubmit="buttonSubmit"></test>
    </div>
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
            @clickCurrentButton="searchGoodsList">
          </base-button>
        </div>
        <test :data="data2" :total="Number(threeTotal)" :columns="columns1" @radioSubmit="changeRadio" :componentList="componentList2" @changePage="getGoodsListByPage"></test>
        <div class="addmitt">
          <el-button type="primary" @click="shopShow">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import test from 'components/table/index'
import buttonn from 'components/button/index'
import BaseButton from 'components/table-button'
import upload from 'components/upload-img'
import Img from 'components/table-image'
import rideo from 'components/table-radio'
const data = []
const columns = [
  { label: '广告图名称', prop: 'advertisement_name' },
  { label: '广告位置', prop: 'advertisement_position' },
  { label: '关联店铺名称', prop: 'shop_name' }
]
const columns1 = [
  { label: '公司名称', prop: 'company_name' },
  { label: '店铺名称', prop: 'shop_name' },
  { label: '品牌', prop: 'brand_name' }
]
const buttonList = [
  {
    text: '编辑',
    buttonType: 2
  },
  {
    text: '删除',
    buttonType: 4
  }
]
const buttonList1 = [
  {
    text: '删除',
    buttonType: 4
  }
]
const componentList1 = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    buttonList: buttonList1,
    // 要插入的索引                                                              --> Number
    insertIndex: 5,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
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
    insertIndex: 5,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
  },
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: Img,
    // 当前列的表头的名称                                                        --> String
    label: '广告图',
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
const componentList2 = [
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
export default {
  data () {
    return {
      input: '',
      radio2: 0,
      data,
      data1: [],
      shopshow: true,
      data2: [],
      checkbo: 'selection',
      isShow: false,
      options,
      componentList2,
      addStoreData: [],
      columns,
      columns1,
      componentList,
      componentList1,
      shosp: [],
      shopping: [],
      threeTotal: '',
      baseImg: '',
      dialogTableVi: false,
      currentOption: 0, // 当前选择项
      keyWords: '' // 搜索关键字,
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let id = this.$route.query.id
      let obj = {
        id: id
      }
      this.$http('adv/editDetail', obj).then(res => {
        console.log(res)
        this.data = res.data.BrandAdv
        res.data.BrandAdv.forEach(ele => {
          if (ele.advertisement_position === '0') {
            ele.advertisement_position = '左大图'
          } else if (ele.advertisement_position === '1') {
            ele.advertisement_position = '右图一'
          } else if (ele.advertisement_position === '2') {
            ele.advertisement_position = '右图二'
          }
        })
        this.data.map(item => {
          item.src = item.advertisement_img
        })
      })
    },
    show () {
      this.isShow = true
    },
    buttonSubmit (row, type) {
      if (type === 2) {
        this.$router.push({ path: '/manage-market/edit-advertisingInof', query: { id: row.id } })
      }
      if (type === 4) {
        this.$confirm('你确定要删除吗？ 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('adv/delBrandAdv', { id: row.id }).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getData()
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
    addShop () {
      this.$http('adv/getShop', { is_all: 1 }).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.threeTotal = res.data.total
          this.data2 = res.data.data
          res.data.data.forEach(ele => {
            if (ele.brand_name === '') {
              ele.brand_name = '/'
            }
            if (ele.company_name === null) {
              ele.company_name = '/'
            }
          })
        }
      })
      this.dialogTableVi = true
    },
    select (rows) {
      // this.shosp = rows
    },
    delet (row, type) {
      if (type === 4) {
        this.data1 = []
        this.shopshow = true
      }
    },
    shopShow () {
      if (this.shosp.length === 0) {
        this.$message.error('请选择店铺')
        return
      }
      this.data1 = this.shopping
      this.dialogTableVi = false
      this.shopshow = false
      this.shosp = []
    },
    getImg (res) {
      this.baseImg = res
    },
    add () {
      if (this.input === ''){
        this.$message.error('请输入广告位名称')
        return
      }
      if (this.data1.length === 0) {
        this.$message.error('请添加店铺')
        return
      }
      let id = this.$route.query.id
      let obj = {
        advertisement_name: this.input,
        advertisement_position: this.radio2,
        seller_id: this.data1[0].seller_id,
        brand_house_id: id,
        advertisement_img: this.baseImg
      }
      this.$http('adv/addBranAdv', obj).then(res => {
        if (res.code === 400) {
          this.$message.error(res.message)
        }
        if (res.code === this.$ok) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('/manage-market/under-line-vips')
        }
      })
    },
    getGoodsListByPage (page) {
      this.page = page
      this.$http('adv/getShop', { page: this.page, pageSize: 10 }).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.threeTotal = res.data.total
          this.data2 = res.data.data
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
    searchGoodsList () {
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
          this.data2 = res.data.data
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
      this.data2.forEach((row, index, arr) => {
        if (currentIndex !== index) {
          row.customRadio = false
          arr.splice(index, 1, row)
        }
      })
    },
    forgo () {
      this.$confirm('你放弃此次编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '放弃成功!'
        })
        this.isShow = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  components: {
    test,
    upload,
    buttonn
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.addBuutton
  width 100px
  height 40px
  margin-left 100px
  margin-top -20px
  background-color #67c23a
  text-align center
  line-height 40px
  color #fff
  border-radius 5px
  cursor pointer
.red
    color #f00
.addSpace
  margin-top 50px
  margin-left 200px
  .spaceRideo
    margin-top 30px
    .place
      margin-left 138px
      margin-top -20px
      width 215px
      height 120px
      position relative
      .left
        width 120px
        height 120px
        text-align center
        line-height 100px
        color #ccc
        font-size 14px
        border 1px dashed #ccc
      .right-top
        position absolute
        top 0
        right 0
        width 90px
        height 59px
        text-align center
        line-height 50px
        color #ccc
        font-size 14px
        border 1px dashed #ccc
      .right-down
        width 90px
        height 59px
        position absolute
        bottom 0
        right 0
        text-align center
        line-height 50px
        color #ccc
        font-size 14px
        border 1px dashed #ccc
    .radio
      margin-left 120px
      margin-top 20px
.spaceIput
  .el-input
    width 300px
    margin-left 30px
.table
  margin-top 20px
.addmit
  margin-left 0
  .el-button
    width 100px
    height 40px
    margin-left 30px
.addstore
  margin-top 30px
  .el-button
    width 100px
    height 40px
    margin-left 20px
  .addtable
    margin-left 50px
    margin-top 20px
    width 1200px
    .cell
      text-align center
.addupload
  margin-top 30px
  .info
    color #ccc
    font-size 14px
  .uploadImg
    margin-top 20px
    margin-left 100px
.addButton
  margin-top 30px
  margin-left 50%
  transform translateX(-200px)
  .el-button
    width 100px
    height 40px
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
.addmitt
  position relative
  left 50%
  margin-left -40px
  margin-top 20px
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
