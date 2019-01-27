<template>
  <div class="add-materials-container">
    <div class="materials-name">
      <span>{{ materialsName }}</span>
      <span @click="getAmend" v-show="amendShow">修改</span>
    </div>
    <div class="materials-nav-hiti">
      <base-step :step-num="3" :current-index="currentStep"></base-step>
    </div>
    <!-- 选择分类页面 -->
    <div class="add-category-container" v-show="currentStep === 1">
      <div class="search-wrapper">
        <span>查找类目：</span>
        <base-input :input-value="keyWords" @changeInputValue="getKeywords" placeholder="请输入类目名称检索"></base-input>
        <base-button :type="1" text="检索" @clickCurrentButton="searchCategory"></base-button>
      </div>
      <div class="category-container">
        <div class="category-button">
          <base-button text="选择类目" @clickCurrentButton="selectShowCategoryList"></base-button>
        </div>
        <div class="category-wrapper" id="el-menu" v-if="!isGetCategoryDataBySearch">
          <div
            class="category-item"
            v-for="(categoryListItem, index) in categoryList"
            :key="index">
            <el-menu
              active-text-color="#ff8a00"
              class="el-menu-container"
              @select="chooseCurrentMenu">
              <!-- 有子菜单 -->
              <el-submenu
                v-for="categoryItem in categoryListItem"
                v-if="categoryItem.next"
                :index="`${index}-${categoryItem.id}-${categoryItem.parentId}-${categoryItem.level}-${categoryItem.ids}-${categoryItem.isLast}-${categoryItem.names}`"
                :key="categoryItem.id">
                <template slot="title">
                  <span>{{ categoryItem.name }}</span>
                </template>
                <el-menu-item
                  v-if="categoryItem.next.length"
                  v-for="category in categoryItem.next"
                  :index="`${index}-${category.id}-${category.parentId}-${category.level}-${category.ids}-${category.isLast}-${category.names}`"
                  :key="category.id">
                  {{ category.name }}
                </el-menu-item>
              </el-submenu>
              <!-- 无子菜单 -->
              <el-menu-item
                v-if="!categoryItem.next"
                v-for="categoryItem in categoryListItem"
                :index="`${index}-${categoryItem.id}-${categoryItem.parentId}-${categoryItem.level}-${categoryItem.ids}-${categoryItem.isLast}-${categoryItem.names}`"
                :key="categoryItem.id">
                {{ categoryItem.name }}
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="category-wrapper-search-no-data" v-else>
          <div class="category-wrapper" v-if="categorySearchedList.length && searchedFlag">
            <div class="category-item search-list">
              <ul>
                <li
                  class="search-item"
                  v-for="(searchItem, index) in categorySearchedList"
                  :key="index"
                  @click="chooseCurrentCategoryItem(searchItem, index)">
                  <base-radio :row="searchItem"></base-radio>
                  <p>{{ searchItem.name }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="category-wrapper-search-no-data" v-if="!categorySearchedList.length && searchedFlag">
            <p>系统未找到匹配的分类，您可以自行<ins @click="selectCategoryList">选择分类</ins></p>
          </div>
        </div>
      </div>
      <div class="category-names">
        <p>您当前选择的是：
          <span v-if="categoryNames" class="active">{{ categoryNames }}</span>
          <span v-else>无</span>
        </p>
      </div>
      <div class="edit-goods-button">
        <div class="edit-next-button" :class="{ active: isChoosedLast }" @click="goEditGoodsDetail">下一步，填写商品信息</div>
      </div>
    </div>
    <div class="add-check-container" v-show="currentStep === 2">
      <div class="edit-goods-selected-category">
        <span>您选择的类目：</span>
        <p>{{ categoryNames }}</p>
        <span class="modify-category" @click="modifyCategory">修改</span>
      </div>
      <hr>
      <h2>
        <b>【属性共同点】</b>
        <span>请勾选您需要筛选的共同点，非必选，每个属性共同点值为单选</span>
      </h2>
      <div class="check-color" v-for="(skuItem, skuIndex) in goodsSkuList"
          :key="skuIndex">
          <div class="form-group flex-start">
            <label for="">
              <i v-if="skuItem.require === 'isRequire'" class="star">*</i>
              <i v-else class="star"></i>
              <span>{{ skuItem.name }}：</span>
            </label>
            <div class="group-container flex1">
              <base-checkbox
                :data="skuItem.sku"
                @checkCurrentBox="getCurrentSkuItem"
                @removeCustomSkuItem="removeCustomSkuItem">
              </base-checkbox>
            </div>
          </div>
        <!-- <div class="form-group flex-start" v-show="cruxSkuList.length>0">
          <label for="">
            <span>颜色：</span>
          </label>
          <div class="group-container flex1">
            <base-checkbox
              :data="cruxSkuList"
              @checkCurrentBox="getCurrentCruxSkuItem"
              >
            </base-checkbox>
          </div>
        </div>
        <div class="form-group flex-start" v-show="skuList.length>0">
          <label for="">
            <span>规格：</span>
          </label>
          <div class="group-container flex1">
            <base-checkbox
              :data="skuList"
              @checkCurrentBox="getCurrentSkuItem"
              >
            </base-checkbox>
          </div>
        </div> -->

      </div>
      <p class="no-data" v-show="skuShow">! 啊哦~该分类下没有属性共同点</p>
      <hr>
      <div class="place-code">
        <span>场馆位置代码：</span>
        <!-- <input type="text"> -->
        <el-input
          v-model="input10"
          clearable  maxlength="20" placeholder="请输入位置码">
        </el-input>
      </div>
      <div class="fotter-button">
        <base-button text='预览商品' @clickCurrentButton="previewGoods" type="danger"></base-button>
        <base-button text='确认生成二维码' @clickCurrentButton="commfirCode" type="primary"></base-button>
        <base-button text='放弃' @clickCurrentButton="giveUp"></base-button>
      </div>
    </div>
    <!-- 选择材料馆的弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
       <el-radio-group v-model="materialsId" >
        <el-radio v-for="item in materialsList" @change="getName(item.name)" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 商品预览的弹框 -->
    <el-dialog :title="materialsName" :visible.sync="goodsTableVisible">
     <base-table
      v-if="newShow"
      :data="tableData"
      :columns="goodsColumns"
      :total="total"
      :componentList="goodsComponentList"
      @changePage="changePage"
      >
    </base-table>
    <span v-else-if="!newShow">啊哦~您筛选的分类下没有符合条件的商品，请重新筛选~</span>
    <div class="goods-fotter" v-if="newShow">
      <base-button text='确认生成二维码' @clickCurrentButton="commfirCode" type="primary"></base-button>
    </div>
    <div class="goods-fotter" v-else-if="!newShow">
      <base-button text='重新选择' @clickCurrentButton="getNewShow" type="primary"></base-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseStep from 'components/step'
import BaseRadio from 'components/table-radio/table-radio'
import BaseCheckbox from 'components/checkbox/edit-goods-checkbox'
import BaseTableImage from 'components/table-image'
import { mixins } from 'mixins'
const goodsColumns = [
  {
    label: '商铺编号',
    prop: 'product_code'
  },
  {
    label: '商品名称',
    prop: 'title'
  },
  {
    label: '市场标价',
    prop: 'price'
  },
  {
    label: '零售现价',
    prop: 'promotion_price'
  },
  {
    label: '特约采购师价',
    prop: 'purchase_price'
  },
  {
    label: '商家名称',
    prop: 'shop_name'
  }
]
const goodsComponentList = [
  {
    component: BaseTableImage,
    label: '图片',
    insertIndex: 1,
    height: 100
  }
]
export default {
  mixins: [mixins],
  data () {
    return {
      newShow: true,
      goodsTableVisible: false,
      goodsColumns,
      goodsComponentList,
      input10: '',
      materialsName: '',
      materialsId: '',
      materialsList: [],
      // 选择材料馆的弹框
      centerDialogVisible: false,
      // 步骤条高亮
      currentStep: 1,
      // 选择分类模块
      keyWords: '',
      // 类目分级列表数据
      categoryList: [],
      // 类目搜索列表数据
      categorySearchedList: [],
      searchedFlag: false,
      isGetCategoryDataBySearch: false,
      idList: '',
      isChoosedLast: false,
      categoryNames: '',
      // ------------------------------- 商品 sku 模块 ------------------------------
      
      goodsSkuList: [],
      // sku 组合数据
      // goodsCurxSkuCombineData: [],
      goodsSkuCombineData: [],
      skuData: [],
      skuShow: false,
      amendShow: true
    }
  },
  computed: {
    goodsId () {
      return this.$route.query.id
    }
  },
  created () {
    if (this.goodsId) {
      this.currentStep = 2
      this.getDetails().then(() => {
        this.getSkuData()
      })
    }
    this.getMaterials()
    this.getCategoryList()
  },
  methods: {
    // 获取材料馆
    getMaterials () {
      // let obj = {
      //   category: 36,
      //   material_id: 4,
      //   place: da45,
      //   sku: {"attr_id":144,"id":5921,"is_custom":0,"val":"1000*1000"},
      //   crux: {"attr_id":40,"id":269,"is_custom":0,"val":"仿古"}
      // }
      let url = 'adv/getMaterialMuseumList'
      // let catId = this.idList.split(',')
      this.$http(url, { is_all : 1}).then(res => {
        if (res.code === this.$ok) {
          this.materialsList = res.data
          if (res.data.length === 1) {
            this.amendShow = false
          }
          this.materialsId = res.data[res.data.length - 1].id
          this.materialsName = res.data[res.data.length - 1].name

        }
      })
    },
    getName (item) {
      this.materialsName = item
    },
    getAmend () {
      this.centerDialogVisible = true
    },
    // 分类模块
    selectShowCategoryList () {
      this.keyWords = ''
    },
    getKeywords (k) {
      this.keyWords = k
    },
    // 搜索分类
    searchCategory () {
      if (!this.keyWords.trim()) {
        this.$mes('请输入要搜索的类目名称', 2)
        return
      }
      this.searchedFlag = false
      this.isGetCategoryDataBySearch = true
      let url = 'category/searchCategory'
      let obj = {
        key_word: this.keyWords.trim(),
        type: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          res.data.forEach(item => {
            item.customRadio = false
          })
          this.categorySearchedList = res.data
          this.searchedFlag = true
        }
      })
    },
    chooseCurrentCategoryItem (item, index) {
      let { name, id } = item
      item.customRadio = true
      this.idList = id
      this.categoryNames = name
      this.isChoosedLast = true
      this.categorySearchedList.forEach((categoryItem, categoryIndex, arr) => {
        if (index === categoryIndex) {
          arr.splice(index, 1, item)
        } else {
          categoryItem.customRadio = false
        }
      })
    },
    selectCategoryList () {
      this.keyWords = ''
    },
    // 分类列表
    getCategoryList () {
      let url = 'category/list'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.handlerCategoryListData(res.data)
          this.categoryList.push(res.data)
        }
      })
    },
    // 分类页面的数据处理
    handlerCategoryListData (data) {
      data.forEach(parentCategory => {
        let { id, parentId, level, next, ids, names, name } = parentCategory
        if (level === 1) {
          parentCategory.ids = `${id}`
          parentCategory.names = `${name}`
        }
        if (next) {
          next.forEach(childCategory => {
            let { id, name } = childCategory
            if (level === 1) {
              childCategory.ids = `${parentCategory.ids},${id}`
              childCategory.names = `${parentCategory.names} > ${name}`
            } else {
              childCategory.ids = `${ids},${id}`
              childCategory.names = `${names} > ${name}`
            }
          })
          this.handlerCategoryListData(next)
          parentCategory.isLast = 0
        } else {
          parentCategory.isLast = 1
        }
      })
    },
    // 选择的某一个子菜单
    chooseCurrentMenu (parentIndex, childIndex) {
      console.log(parentIndex)
      let [currentListIndex, childId, parentId, level, ids, isLast, names] = parentIndex.split('-')
      this.idList = ids
      console.log(this.idList)
      this.isChoosedLast = Number(isLast) === 1 ? true : false
      this.categoryNames = names
      this.categoryList[currentListIndex].some(parentItem => {
        let { id, next } = parentItem
        let flag = false
        if (next && id === Number(parentId)) {
          next.some(childItem => {
            let { id, next } = childItem
            if (next && id === Number(childId)) {
              flag = true
              this.categoryList.splice(currentListIndex + 1)
              this.categoryList.splice(currentListIndex + 1, 1, next)
              return true
            }
            // 如果不存在下一级子菜单，代表全部选中
            if (!next) {
              this.categoryList.splice(currentListIndex + 1)
              flag = true
              return true
            }
          })
          return flag
        }
        // 如果不存在下一级子菜单，代表全部选中
        if (!next) {
          this.categoryList.splice(currentListIndex + 1)
          return true
        }
      })
    },
    // 分类选择完去下一步
    goEditGoodsDetail () {
      this.currentStep = 2
      this.getSkuData()
    },
    // 修改
    modifyCategory () {
      this.currentStep = 1
      // 商品 sku 模块
      this.goodsSkuCombineData = []
      this.goodsSkuList = []
      // this.goodsCurxSkuCombineData = []
    },
   

    // -----------------------------  选择属性  --------------------------------
    // 详情
    async getDetails () {
      let url = 'materialQr/editInfo'
      let obj = {
        id: this.goodsId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.idList = res.data.cate_info.id
          this.categoryNames = res.data.cate_info.name
          this.input10 = res.data.place
          this.materialsId = res.data.material_user_id
          this.materialsName = res.data.material_name
        }
      })
    },
    // 获取sku
    getSkuData () {
      let url = 'category/goodsSku'
      let catId = this.idList.split(',')
      let obj = {
        categoryId: catId[catId.length - 1]
      }
      if (this.goodsId) {
        obj.id = this.goodsId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.handlerCruxSkuListData(res.data.crux.sku)
          // this.handlerSkuListData(res.data.sku.sku)
          if (res.data === false) {
            this.skuShow = true
          }
          this.handlerSkuListData(res.data)
          // this.cruxSkuList = res.data.crux.sku
          // this.skuList = res.data.sku.sku
          this.goodsSkuList = res.data
        }
      })
    },
    // 处理 sku 模块数据
    // handlerCruxSkuListData (data) {
    //     // this.goodsSkuCombineData.push(obj)
    //   data.forEach((skuItem, skuItemIndex) => {
    //     let { val, select } = skuItem
    //     skuItem.name = val
    //     skuItem.childIndex = skuItemIndex
    //     skuItem.childId = skuItem.id
    //     // skuItem.checked = true
    //     if (select === 0) {
    //       // this.goodsSkuCombineData[skuTypeIndex].list.push(skuItem)
    //       skuItem.checked = true
    //     }
    //     if (this.goodsId && select === 1) {
    //       skuItem.checked = true
    //     }
    //   })
    // },
    handlerSkuListData (data) {
      data.forEach((skuType, skuTypeIndex) => {
        skuType.showAddCustomSkuInput = false
        let { id, name, require } = skuType
        let obj = {
          id,
          index: skuTypeIndex,
          list: []
        }
        this.goodsSkuCombineData.push(obj)
        skuType.sku.forEach((skuItem, skuItemIndex) => {
          let { val, select } = skuItem
          skuItem.name = val
          skuItem.childIndex = skuItemIndex
          skuItem.childId = skuItem.id
          skuItem.checked = select ? true : false
          // 注入属性到 checkbox
          skuItem.parentIndex = skuTypeIndex
          skuItem.parentAttrName = name
          skuItem.parentId = id
          skuItem.require = require
          if (select) {
            this.goodsSkuCombineData[skuTypeIndex].list.push(skuItem)
          }
        })
      })
    },
    // 颜色点击选择
    getCurrentCruxSkuItem (item) {
      this.cruxSkuList.forEach((skuItem, stuIndex) => {
        if (item.id === skuItem.id) {
          skuItem.checked = true
        } else {
          skuItem.checked = false
        }
      })
      let { checked, childIndex } = item
      if (checked) {
        this.goodsCurxSkuCombineData.push(item)
        return
      }
      // this.goodsSkuCombineData[parentIndex].list.some((skuItem, index, arr) => {
      //   if (childIndex === skuItem.childIndex) {
      //     arr.splice(index, 1)
      //     return true
      //   }
      // })
    },
    // 选择
    getCurrentSkuItem (item) {
      let { checked, parentIndex, childIndex } = item
      if (parentIndex === 0 || parentIndex === 1) {
        this.goodsSkuList[parentIndex].sku.forEach(skuItem => {
          if (item.id === skuItem.id && skuItem.checked === true) {
            skuItem.checked = true
          } else {
            skuItem.checked = false
            this.goodsSkuCombineData[parentIndex].list = []
          }
        })
      }
      if (checked) {
        this.goodsSkuCombineData[parentIndex].list.push(item)
        return
      }
      this.goodsSkuCombineData[parentIndex].list.some((currItem, index, arr) => {
        if (childIndex === currItem.childIndex) {
          arr.splice(index, 1)
          return true
        }
      })
    },
    removeCustomSkuItem (payload) {
      let { parentIndex, childIndex } = payload
      console.log(parentIndex)
      if (parentIndex === 0 || parentIndex === 1) {
        this.goodsSkuList[parentIndex].sku.forEach(skuItem => {
          if (item.id === skuItem.id) {
            skuItem.checked = false
            this.goodsSkuCombineData[parentIndex].list = []
          }
        })
      }
    },
    commfirCode () {
      let catId = this.idList.split(',')
      let url = 'materialQr/add'
      let obj = {
        category: catId[catId.length - 1],
        material_id: this.materialsId,
        place: this.input10
      }
      if (this.goodsId) {
        obj.id = this.goodsId
      }
      if (!this.goodsSkuCombineData.length) {
        obj.crux = ''
        obj.sku = ''
      } else {
        let length = this.goodsSkuCombineData.length
        if (length <= 1) {
          // let rqera = cruxSkuList.require
          if (!this.goodsSkuCombineData[0].list.length) {
            obj.sku = ''
          } else {
            let cruxSkuList = this.goodsSkuCombineData[0].list.pop()
            obj.sku = JSON.stringify({ "attr_id":cruxSkuList.attr_id,"id":cruxSkuList.id,"is_custom":cruxSkuList.is_custom,"val":cruxSkuList.val })
          }
        }
        if (length >= 2) {
          if (!this.goodsSkuCombineData[0].list.length) {
            obj.crux = ''
          } else {
            let cruxSkuList = this.goodsSkuCombineData[0].list.pop()
            obj.crux = JSON.stringify({ "attr_id":cruxSkuList.attr_id,"id":cruxSkuList.id,"is_custom":cruxSkuList.is_custom,"val":cruxSkuList.val })
          }
          if (!this.goodsSkuCombineData[1].list.length) {
            obj.sku = ''
          } else {
            let skuList = this.goodsSkuCombineData[1].list.pop()
            obj.sku = JSON.stringify({ "attr_id":skuList.attr_id,"id":skuList.id,"is_custom":skuList.is_custom,"val":skuList.val })
          }
        }
      }
      
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.$router.push({ name: 'MaterialsCode' })
        }
        if (res.code === 400) {
          this.$message({
            message: res.message
          })
        }
      })
    },
    // 放弃
    giveUp () {
      this.$confirm('你确定放弃吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.currentStep = 1
        this.goodsSkuList = []
        this.goodsSkuCombineData = []
        this.$message({
          type: 'success',
          message: '放弃成功!'
        })
        this.$router.push({ name: 'MaterialsCode' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 预览商品
    previewGoods () {
      let { page, pageSize } = this
      let catId = this.idList.split(',')
      let url = 'materialQr/goodsPreview'
      let obj = {
        category: catId[catId.length - 1],
        material_id: this.materialsId,
        page,
        pageSize
      }
      if (!this.goodsSkuCombineData.length) {
        obj.crux = ''
        obj.sku = ''
      } else {
        let length = this.goodsSkuCombineData.length
        if (length <= 1) {
          // let rqera = cruxSkuList.require
          if (!this.goodsSkuCombineData[0].list.length) {
            obj.sku = ''
          } else {
            if (this.goodsSkuCombineData[0].list.length === 1) {
              let cruxSkuList = this.goodsSkuCombineData[0].list[0]
            } else {
              let cruxSkuList = this.goodsSkuCombineData[0].list.pop()
            }
            obj.sku = JSON.stringify({ "attr_id":cruxSkuList.attr_id,"id":cruxSkuList.id,"is_custom":cruxSkuList.is_custom,"val":cruxSkuList.val })
          }
        }
        if (length >= 2) {
          if (!this.goodsSkuCombineData[0].list.length) {
            obj.crux = ''
          } else {
            // let cruxSkuList = this.goodsSkuCombineData[0].list.pop()
            if (this.goodsSkuCombineData[0].list.length === 1) {
              let cruxSkuList = this.goodsSkuCombineData[0].list[0]
              obj.crux = JSON.stringify({ "attr_id":cruxSkuList.attr_id,"id":cruxSkuList.id,"is_custom":cruxSkuList.is_custom,"val":cruxSkuList.val })
            } else {
              let cruxSkuList = this.goodsSkuCombineData[0].list.pop()
              obj.crux = JSON.stringify({ "attr_id":cruxSkuList.attr_id,"id":cruxSkuList.id,"is_custom":cruxSkuList.is_custom,"val":cruxSkuList.val })
            }
          }
          if (!this.goodsSkuCombineData[1].list.length) {
            obj.sku = ''
          } else {
            // let skuList = this.goodsSkuCombineData[1].list.pop()
            if (this.goodsSkuCombineData[1].list.length === 1) {
              let skuList = this.goodsSkuCombineData[1].list[0]
              obj.sku = JSON.stringify({ "attr_id":skuList.attr_id,"id":skuList.id,"is_custom":skuList.is_custom,"val":skuList.val })
            } else {
              let skuList = this.goodsSkuCombineData[1].list.pop()
              obj.sku = JSON.stringify({ "attr_id":skuList.attr_id,"id":skuList.id,"is_custom":skuList.is_custom,"val":skuList.val })
            }
            // obj.sku = JSON.stringify({ "attr_id":skuList.attr_id,"id":skuList.id,"is_custom":skuList.is_custom,"val":skuList.val })
          }
        }
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          this.goodsTableVisible = true
          if (!res.data.data.length) {
            this.newShow = false
          }
          res.data.data.forEach(item => {
            item.src = item.image_path
          })
          return
        }
      })
    },
    getNewShow () {
      this.newShow = true
      this.goodsTableVisible = false
    },
    // 分页事件
    changePage (page) {
      this.page = page
      this.previewGoods()
    },
  },
  components: {
    BaseStep,
    BaseCheckbox,
    BaseRadio
  }
}
</script>

<style lang="stylus">
@import './add-materials-code'
</style>
