<template>
  <div>
    <div class="item">
      <span><i>*</i>选择商圈：</span>
      <base-button v-if="showBsCircle" text="添加商圈"  type="primary" @clickCurrentButton="dialogTableVisible=true"></base-button>
      <p class="circle-description">请选择一个商圈，且圈内商家数不少于3个</p>
    </div>
    <div class="selected-circle" v-show="showSelected">
      <egrid
      border
      :columns="bsColumns"
      :data="selectedData"
      :columns-handler="selectedColumnsHander"></egrid>
    </div>
    <div class="item">
      <span><i>*</i>商圈广告图:</span>
      <div class="advImg">
        <upload-img :imgUrl="imgUrl" ref="uploadEle"  @uploadFile=uploadFile></upload-img>
      </div>
    </div>
    <p class="upInfo">【尺寸大小 750*280，建议格式：'.png', '.jpeg', '.jpg'，不超过2M 】</p>
    <div class="item">
      <span><i>*</i>商圈标签一</span>
      <el-input
        placeholder="最多可输入6个字的商圈标签"
        v-model="cityLabel1"
        :maxlength="6"
        clearable>
      </el-input>
    </div>
    <div class="item">
      <span>商圈标签二</span>
      <el-input
        placeholder="最多可输入6个字的商圈标签"
        v-model="cityLabel2"
        :maxlength="6"
        clearable>
      </el-input>
    </div>
    <div class="item">
      <span>商圈标签三</span>
      <el-input
        placeholder="最多可输入6个字的商圈标签"
        v-model="cityLabel3"
        :maxlength="6"
        clearable>
      </el-input>
    </div>
    <div class='item'>
      <span>商圈短标签</span>
        <el-checkbox-group v-model="checkList" ref='checkbox'>
          <el-checkbox  label="1">优质</el-checkbox>
          <el-checkbox  label="2">精选</el-checkbox>
          <el-checkbox  label="3">人气</el-checkbox>
        </el-checkbox-group>
    </div>
    <!-- <div class="item">
      <span><i>*</i>选择商家</span>
      <div class="addShopButton" @click="showGroupShop">
        选择圈内商家
      </div>
    </div>
    <div class="selected-shop" v-show="showSelectedShop">
      <egrid
      border
      :columns="bsColumns2"
      :data="selectedShop"
      :columns-handler="selectedColumnsHander2"></egrid>
    </div> -->
    <div class="submit-box">
      <!-- <base-button text="确认提交" class="btn-submit" size="large"  type="primary" @clickCurrentButton="submit"></base-button> -->
      <!-- <base-button text="放弃"  type="primary" size="large"  @clickCurrentButton="giveUp"></base-button> -->
      <p @click="submit">确认提交</p>
      <p @click="giveUp">放弃</p>
    </div>
    <el-dialog title="添加商圈" :visible.sync="dialogTableVisible" width="60%">
      <test :data="bsData" :total="total" :columns="bsColumns" @radioSubmit="changeRadio" :componentList="componentList"  @changePage="getGoodsListByPage"></test>
      <div class="addmit">
        <el-button type="primary" @click="shopShow">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="选择店铺" :visible.sync="dialogTableVisible2">
      <egrid border
      :data="shopData"
      :columns="bsColumns2"
      column-type="selection"
      @selection-change="selectionChange"
      >
      </egrid>
      <base-pagination :total="total" @changePage="changePage"></base-pagination>
      <div class="btn-ok">
        <base-button text="确定" @clickCurrentButton="selectedShopBtn" type="primary"></base-button>
        <span v-show="selectedShop.length < 3">请至少勾选三个店铺</span>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import test from 'components/table'
import UploadImg from 'components/upload-img'
import TableButton from 'components/table-button'
import CityInput from 'components/input'
import rideo from 'components/table-radio'
const bsColumns = [
  { label: '商圈名称', prop: 'group_name' },
  { label: '圈内商家', prop: 'shop_count' },
  { label: '手机号', prop: 'contact_mobile' },
  { label: '所在城市', prop: 'address' }
]
const bsColumns2 = [
  { label: '公司名称', prop: 'company_name' },
  { label: '店铺名称', prop: 'shop_name' },
  { label: '主营商品', prop: 'main_product' },
  { label: '上架商品数', prop: 'goods_count' },
  { label: '服务城市', prop: 'op_city' }
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
export default {
  data () {
    return {
      page: 1,
      flag: false,
      bsData: [],
      bsColumns: bsColumns,
      bsColumns2: bsColumns2,
      selectedShop: [],
      total: 0,
      shosp: [],
      componentList,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      showSelectedShop: false,
      currentRow: null,
      selectedData: [],
      showSelected: false,
      cityLabel1: '',
      cityLabel2: '',
      cityLabel3: '',
      shopData: [],
      groupId: '',
      imgUrl: '',
      showBsCircle: true,
      checkList: [],     
    }
  },
  created () {
    this.getGroupList()
    if (this.id) {
      this.isEdit()
    }
  },
  methods: {
    isEdit () {
      let url = '/union/unionGroupDetail'
      this.showSelected = true
      this.$http(url, {
        id: this.id
      }).then(res => {
        this.cityLabel1 = res.data.tab[0]
        this.cityLabel2 = res.data.tab[1]
        this.cityLabel3 = res.data.tab[2]
        this.checkList = res.data.tips
        var res = res.data
        this.selectedData.push({
          group_name: res.group_name,
          shop_count: res.group_shop_count,
          contact_mobile: res.contact_mobile,
          address: (res.op_province || '') + (res.op_city || '') + (res.op_area || ''),
          id: res.id
        })
        this.$refs.uploadEle.uploadFile(res.head_img)
        res.tab.forEach((item, index) => {
          if (item) {
            this['cityLabel' + (index + 1)] = item
          }
        })
        this.selectedShop = res.shop_list
        this.showSelectedShop = true
        this.groupId = res.group_id
      })
    },
    showGroupShop () {
      this.dialogTableVisible2 = true
      this.getShopListById(this.groupId)
    },
    uploadFile (res) {
      this.imgUrl = res
    },
    label1 (val) {
      this.cityLabel1 = val
    },
    label2 (val) {
      this.cityLabel2 = val
    },
    label3 (val) {
      this.cityLabel3 = val
    },
    submit () {
      console.log(this.checkList)
      let url = 'union/addUnionGroup'
      let obj = {
        group_id: this.groupId,
        head_img: this.imgUrl,
        tab: [this.cityLabel1, this.cityLabel2, this.cityLabel3, this.cityLabel4].join(),
        tips: this.checkList.join()
        // shop_ids: this.selectedShop.map(item => item.id).join()
      }
      if (this.id) {
        obj.id = this.id
      }
      if (this.selectedData.length === 0) {
        this.$mes('您还未选择商圈')
        return false
      }
      if (!obj.head_img) {
        this.$mes('请先上传图片')
        return false
      }
      if (this.cityLabel1.length > 6) {
        this.$message.error('标签名最多可输入6个字')
        return false
      }
      if (this.cityLabel2 && this.cityLabel2.trim().length && this.cityLabel2.length > 6) {
        this.$message.error('标签名最多可输入6个字')
        return false
      }
      if (this.cityLabel3 && this.cityLabel3.trim().length && this.cityLabel3.length > 6) {
        this.$message.error('标签名最多可输入6个字')
        return false
      }
      if (!obj.tab[0]) {
        this.$mes('请添加商圈标签')
        return false
      }
      // if (this.selectedShop.length < 3) {
      //   this.$mes('请至少勾选三个店铺')
      //   return false
      // }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$router.back()
        } else {
          this.$mes(res.message)
        }
      })
    },
    giveUp () {
      this.$confirm('你确定要放弃此次编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getShopListById (id) {
      let url = 'union/shopList'
      this.$http(url, {
        group_id: id
      }).then(res => {
        if (res.code === this.$ok) {
          this.shopData = res.data.data
        }
      })
    },
    changePage (page) {
      //
    },
    showDialog () {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    getGroupList (shopName = '', page = 1, pageSize = 10) {
      let url = 'union/groupList'
      this.$http(url, {
        shop_name: shopName,
        page: page,
        pageSize: pageSize
      }).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.bsData = res.data.data
          this.bsData.map(item => {
            item.address = (item.op_province || '') + (item.op_city || '') + (item.op_area || '')
            item.customRadio = false
          })
          this.total = res.data.total
        }
      })
    },
    bsColumnsHandler (cols) {
      var vm = this
      cols.forEach(item => {
        item.align = 'center'
      })
    },
    removeCircle (id) {
      this.selectedData = []
      this.selectedShop = []
      this.showSelectedShop = false
      this.showSelected = false
    },
    selected () {
      this.selectedData = [this.currentRow]
      this.showSelected = true
      this.dialogTableVisible = false
      this.groupId = this.currentRow.group_id
      this.showBsCircle = false
    },
    selectedShopBtn () {
      if (this.shopData.length < 3) {
        this.$mes('请至少勾选三个店铺')
        return false
      }
      this.dialogTableVisible2 = false
      this.showSelectedShop = true
    },
    showGroupList () {
      //
    },
    selectedColumnsHander (cols) {
      let vm = this
      cols.forEach(item => {
        item.align = 'center'
      })
      return cols.concat({
        label: '操作',
        align: 'center',
        component: TableButton,
        buttonList,
        listeners: {
          clickCurrentButton (row, type) {
            vm.removeCircle(row.id)
            vm.showBsCircle = true
          }
        }
      })
    },
    selectedColumnsHander2 (cols) {
      let vm = this
      cols.forEach(item => {
        item.align = 'center'
      })
      return cols.concat({
        label: '操作',
        align: 'center',
        component: TableButton,
        buttonList,
        listeners: {
          clickCurrentButton (row, type) {
            vm.selectedShop.splice(vm.selectedShop.findIndex(item => item.id === row.id), 1)
          }
        }
      })
    },
    selectionChange (rows) {
      // this.selectedShop = rows.length > 3 ? rows.slice(0, 3) : rows
      this.selectedShop = rows
    },
    handlerTableData (data) {
      data.forEach((item, index) => {
        if (item.shop_count < 3) {
          item.disabled = true
        }
        item.customRadio = false
        item.index = index
      })
    },
    // 商品表格单选
    changeRadio (row) {
      this.shosp.push(row)
      this.shopping = this.shosp.slice(0, 1)
      let currentIndex = row.index
      this.bsData.forEach((row, index, arr) => {
        if (currentIndex !== index) {
          row.customRadio = false
          arr.splice(index, 1, row)
        }
      })
    },
    shopShow () {
      this.selectedData = this.shopping
      this.showSelected = true
      this.dialogTableVisible = false
      this.groupId = this.shopping[0].group_id
      this.showBsCircle = false
      this.shosp = []
    },
    // 商圈页码
    getGoodsListByPage (page) {
      this.page = page
      this.getGroupList(undefined, page)
    },
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  components: { TableButton, UploadImg, CityInput, test }
}
</script>

<style lang="stylus" scoped>
.upInfo
  margin-left 110px
  font-size: 12px
.addmit
  position relative
  left 50%
  margin-left -40px
  margin-top 20px
.el-input
  width 215px
.addShopButton
  width 100px
  height 40px
  background-color #409EFF
  color #fff
  text-align center
  line-height 40px
  font-size 14px
  border-radius 5px
  cursor pointer
.btn-ok
  display flex
  justify-content center
  align-items center
  span
    color red
    margin-left 10px
.item
  display flex
  justify-content flex-start
  align-items center
  margin 20px 0
  overflow hidden
  .circle-description
    margin-left 20px
  &>span
    display inline-block
    width 120px
    i
      color red
  .el-checkbox-group
    margin-top 20px;
    .el-checkbox 
      display block 
      margin 0 0 10px 0;
      border-radius 50%
.selected-circle
  width 90%
  margin 30px auto
.selected-shop
  width 90%
  margin 30px auto
.submit-box
  display flex
  align-items center
  justify-content center
  margin-top 30px
  p:first-child
    margin-right 20px
  p
    width 100px
    height 40px
    color #fff
    background-color #409EFF
    text-align center
    line-height 40px
    border-radius 5px
    cursor pointer
</style>
