<template>
  <div class="index-banner-edit-container" v-if="flag">
    <div class="index-banner-header">
      编辑广告
    </div>
    <div class="index-banner-adname">
      <span class="red">*</span>
      <span class="right-25">广告名称</span>
      <base-input
        @changeInputValue="changeInputValue"
        placeholder=""
        :input-value="adName"
        class="input-wrapper">
      </base-input>
    </div>
    <div class="index-banner-start-time">
      <span class="red">*</span>
      <base-time-picker
        @pickerTime="pickerStartTime"
        dataType="datetime"
        placeholder="选择开始时间"
        :data-time="startTime"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="开始时间：">
      </base-time-picker>
    </div>
    <div class="index-banner-end-time">
      <span class="red">*</span>
      <base-time-picker
        @pickerTime="pickerEndTime"
        dataType="datetime"
        placeholder="选择结束时间"
        :data-time="endTime"
        valueFormat="yyyy-MM-dd HH:mm:ss"
        timeText="结束时间：">
      </base-time-picker>
    </div>
    <div class="index-banner-img-title">
      <span class="red">*</span>
      <span class="right-25">广告图片</span>
      <span>图片尺寸690*290，建议格式：'.png', '.jpeg', '.jpg'，不超过400KB</span>
    </div>
    <div class="index-banner-img">
      <base-upload-img @uploadFile="uploadFile" :img-url="imgUrl"></base-upload-img>
    </div>
    <div class="index-banner-category">
      <span class="red">*</span>
      <span class="right-25">内容类型</span>
       <el-radio v-model="contentType" label="1">图文内容</el-radio>
       <el-radio v-model="contentType" label="2">选择商品</el-radio>
       <el-radio v-model="contentType" label="4">添加联盟活动</el-radio>
       <el-radio v-model="contentType" label="3">添加外链</el-radio>
    </div>
    <!-- 图文内容 -->
    <div class="add-content-pic" v-show="isShowEdit">
      <span class="red">*</span>
      <span class="right-25">页面标题</span>
      <base-input
        @changeInputValue="getContentTitle"
        placeholder="页面标题"
        :input-value="contentTitle"
        class="input-wrapper">
      </base-input>
    </div>
    <!-- <div class="show-edit" v-show="isShowEdit">
      <base-button :type="1" text="添加图文" @clickCurrentButton="addContentPic"></base-button>
    </div> -->
    <div class="show-edit" v-show="isShowEdit">
      <base-button :type="1" text="添加图文" @clickCurrentButton="addContentPic"></base-button>
      <base-button :type="1" text="添加店铺" @clickCurrentButton="addShops"></base-button>
      <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button>
    </div>
    <!-- 编辑器 -->
    <div class="index-banner-container" v-if="editIndexBanner.length">
      <div
        class="edit-container"
        v-for="(item, index) in editIndexBanner"
        :key="index">
        <!-- 文本编辑器 -->
        <div class="edit-wrapper" v-if="item.type === 1">
          <span class="shop-close el-icon-close" @click="removeCurrentEdit(index)"></span>
          <h1>
            添加图文
          </h1>
          <base-edit v-model="item.content" :id="index + ''"></base-edit>
        </div>
        <!-- 添加店铺 -->
        <div class="shop-container" v-if="item.type === 2">
          <span class="shop-close el-icon-close" @click="removeCurrentEdit(index)"></span>
          <h1>
            添加店铺
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>图片建议:尺寸640*304，不大于400KB</span>
          </h1>
          <div class="add-shop-container">
            <div class="shop-item" v-for="(shopItem, shopIndex) in item.content">
              <base-upload-img @uploadFileData="uploadEditFile" :img-url="shopItem.url" :data="shopItem"></base-upload-img>
              <div class="select-shop" @click="addEditShop(index, shopIndex)">
                {{ shopItem.text || '添加店铺'}}
              </div>
            </div>
          </div>
        </div>
        <!-- 添加商品 -->
        <div class="shop-container" v-if="item.type === 3">
          <span class="shop-close el-icon-close" @click="removeCurrentEdit(index)"></span>
          <h1>
            添加商品
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>图片建议:尺寸640*304，不大于400KB</span>
          </h1>
          <div class="add-shop-container">
            <div class="shop-item" v-for="(goodsItem, goodsIndex) in item.content">
              <base-upload-img @uploadFileData="uploadEditFile" :img-url="goodsItem.url" :data="goodsItem"></base-upload-img>
              <div class="select-shop" @click="addEditGoods(index, goodsIndex)">
                {{ goodsItem.text || '添加商品'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择店铺弹窗 -->
    <div class="choose-goods-container" v-show="isShowShopList">
      <div class="choose-goods-wrapper">
        <div class="choose-goods-title">
          <span>选择店铺：</span>
          <i class="el-icon-close" @click="cancleChooseShop"></i>
        </div>
        <div class="choose-goods-header">
          <base-input
            placeholder="请输入店铺名称或行业"
            @changeInputValue="getShopSearchKeyWords"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchShopList">
          </base-button>
        </div>
        <div class="choose-goods-body">
          <base-table
            :data="shopList"
            :total="total"
            :columns="shopColumns"
            :tableHeight="300"
            :componentList="shopComponentList"
            @changeRadio="changeShopRadio"
            @changePage="getShopListByPage">
          </base-table>
        </div>
        <div class="choos-goods-comfirm">
          <base-button
            text="确定"
            :type="1"
            @clickCurrentButton="comfirmChooseShop">
          </base-button>
          <base-button
            text="取消"
            @clickCurrentButton="cancleChooseShop">
          </base-button>
        </div>
      </div>
    </div>
    <!-- 选择商品弹窗 -->
    <div class="choose-goods-container" v-show="isShowGoods">
      <div class="choose-goods-wrapper">
        <div class="choose-goods-title">
          <span>添加商品：</span>
          <i class="el-icon-close" @click="cancleChooseGoods"></i>
        </div>
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
        <div class="choose-goods-body">
          <base-table
            :data="tableData"
            :total="total"
            :columns="columns"
            :tableHeight="300"
            :componentList="componentList"
            @changeRadio="changeRadio"
            @changePage="getGoodsListByPage">
          </base-table>
        </div>
        <div class="choos-goods-comfirm">
          <base-button
            text="确定"
            :type="1"
            @clickCurrentButton="comfirmChooseGoods">
          </base-button>
          <base-button
            text="取消"
            @clickCurrentButton="cancleChooseGoods">
          </base-button>
        </div>
      </div>
    </div>
    <!-- 已选中的商品的表格 -->
    <div class="choosed-goods-table" v-show="isShowChoosedTable">
      <base-table
        :data="choosedTableData"
        :columns="choosedColumn"
        :componentList="choosedComponentList"
        :total="1"
        @deleteChoosedTable="deleteChoosedTable">
      </base-table>
    </div>
    <!-- 添加外链 -->
    <div class="add-ad-href" v-show="isShowHref">
      <base-input
      placeholder="请输入广告地址"
      :input-value="hrefValue"
      @changeInputValue="getHrefValue">
      </base-input>
    </div>
    <!-- 联盟活动 -->
    <div class="alliance-add-button" v-show="isShowAlliance">
      <base-button :type="1" text="选择联盟活动" @clickCurrentButton="showAddAlliance"></base-button>
    </div>
    <!-- 联盟活动表格弹窗 -->
    <div class="alliance-add-table" v-show="isShowAlliancePopup">
      <div class="choose-goods-wrapper">
        <div class="choose-goods-title">
          <span>信息</span>
          <i class="el-icon-close" @click="cancleAlliance"></i>
        </div>
        <div class="choose-goods-header">
          <base-select
            placeholder="请选择"
            :options="allianceOptions"
            @changeCurrentOption="getAllianceOption">
          </base-select>
          <base-input
            placeholder="请输入关键字查找"
            @changeInputValue="getAllianceKeyWords"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchAllianceList">
          </base-button>
        </div>
        <div class="choose-goods-body">
          <base-table
            :data="allianceTableData"
            :total="allianceTotal"
            :columns="allianceColumns"
            :tableHeight="300"
            :componentList="componentList"
            @changeRadio="getSingleAllianceData"
            @changePage="getAllianceListByPage">
          </base-table>
        </div>
        <div class="choos-goods-comfirm">
          <base-button
            text="确定"
            :type="1"
            @clickCurrentButton="confirmChoosedAlliance">
          </base-button>
          <base-button
            text="取消"
            @clickCurrentButton="cancleAlliance">
          </base-button>
        </div>
      </div>
    </div>
    <!-- 已选中的联盟商活动表格 -->
    <div class="choosed-alliance-table" v-show="isShowChoosedAllianceTable">
      <base-table
        :data="allianceChoosedTableData"
        :columns="allianceChoosedColumn"
        :componentList="choosedAllianceComponent"
        :total="1"
        @deleteAllianceTable="deleteAllianceTable">
      </base-table>
    </div>
    <!-- 提交新增与编辑 -->
    <div class="seperate"></div>
    <div class="edit-button">
      <base-button :type="1" text="确认提交" @clickCurrentButton="comfirmSubmitContent"></base-button>
      <base-button text="放弃" @clickCurrentButton="giveupSubmitContent"></base-button>
    </div>
    <!-- 店铺排版方式 -->
    <base-popup ref="shopPopup">
      <div class="index-banner-popup-container">
        <h1>请选择排版方式：</h1>
        <div class="layout-type">
          <el-radio v-model="shopLayoutType" label="1"></el-radio>
          <div class="layout-item"></div>
        </div>
        <div class="layout-type">
          <el-radio v-model="shopLayoutType" label="2"></el-radio>
          <div class="layout-item"></div>
          <div class="layout-item"></div>
        </div>
        <div class="add-button-wrapper">
          <base-button :type="1" text="确定" @clickCurrentButton="comfirmShopLayOut"></base-button>
          <base-button text="取消" @clickCurrentButton="giveupShopLayOut"></base-button>
        </div>
      </div>
    </base-popup>
    <!-- 商品排版方式 -->
    <base-popup ref="goodsPopup">
      <div class="index-banner-popup-container">
        <h1>请选择排版方式：</h1>
        <div class="layout-type">
          <el-radio v-model="goodsLayoutType" label="1"></el-radio>
          <div class="layout-item"></div>
        </div>
        <div class="layout-type">
          <el-radio v-model="goodsLayoutType" label="2"></el-radio>
          <div class="layout-item"></div>
          <div class="layout-item"></div>
        </div>
        <div class="add-button-wrapper">
          <base-button :type="1" text="确定" @clickCurrentButton="comfirmGoodsLayOut"></base-button>
          <base-button text="取消" @clickCurrentButton="giveupGoodsLayOut"></base-button>
        </div>
      </div>
    </base-popup>
  </div>
</template>

<script>
import { mixins } from 'mixins'
import { initTime, splitEditContent } from 'utils/common'
import BaseTableRadio from 'components/table-radio'
import BaseTableImage from 'components/table-image'
import BaseTableButton from 'components/table-button'
import BaseEdit from 'components/edit'
import BasePopup from 'components/popup/popup'
// 表格弹窗列数据
const columns = [
  {
    label: '商品ID',
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
  // {
  //   label: '品牌',
  //   prop: 'brand_name'
  // },
  {
    label: '零售标价',
    prop: 'price'
  },
  {
    label: '直采价',
    prop: 'purchase_price'
  },
  {
    label: '库存',
    prop: 'stock'
  },
  {
    label: '运费',
    prop: 'freight'
  }
]
// 表格选中列数据
const choosedColumn = [
  {
    label: '商品编号',
    prop: 'product_code'
  },
  {
    label: '商品名称',
    prop: 'title'
  }
]
// 商品表格弹窗添加单选组件
const componentList = [
  {
    component: BaseTableRadio,
    label: ' ',
    insertIndex: 0,
    eventType: 'changeRadio',
    width: 100
  },
  {
    component: BaseTableImage,
    label: '商品图',
    insertIndex: 2,
    height: 100
  }
]
// 表格图片组件与按钮组件
const choosedComponentList = [
  {
    component: BaseTableImage,
    label: '商品图片',
    insertIndex: 0
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    buttonList: [{
      text: '删除',
      buttonType: 4
    }],
    eventType: 'deleteChoosedTable'
  }
]
// 添加商品下拉框
const options = [
  {
    label: '商品名称',
    value: 1
  },
  {
    label: '商品编号',
    value: 2
  },
  {
    label: '店铺名称',
    value: 3
  }
  // {
  //   label: '品牌',
  //   value: 4
  // }
]
// 店铺列表数据
const shopColumns = [
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '公司名称',
    prop: 'company_name'
  },
  {
    label: '所属区域',
    prop: 'area'
  }
]
// 店铺列表单选组件和图片组件
const shopComponentList = [
  {
    component: BaseTableRadio,
    label: ' ',
    insertIndex: 0,
    eventType: 'changeRadio'
  },
  {
    component: BaseTableImage,
    label: '店铺LOGO',
    insertIndex: 2,
    height: 100
  }
]
// 添加联盟商下拉框
const allianceOptions = [
  {
    label: '活动名称',
    value: 1
  },
  {
    label: '商圈名称',
    value: 2
  }
]
// 联盟商弹窗列数据
const allianceColumns = [
  {
    label: '活动主题',
    prop: 'title'
  },
  {
    label: '商圈名称',
    prop: 'union_name'
  },
  {
    label: '活动开始时间',
    prop: 'start_at'
  },
  {
    label: '活动结束时间',
    prop: 'end_at'
  },
  {
    label: '活动创建时间',
    prop: 'created_at'
  },
  {
    label: '状态',
    prop: 'activityStatus'
  }
]
// 联盟商选中列数据
const allianceChoosedColumn = [
  {
    label: '活动主题',
    prop: 'title'
  },
  {
    label: '商圈名称',
    prop: 'union_name'
  },
  {
    label: '活动开始时间',
    prop: 'start_at'
  },
  {
    label: '活动结束时间',
    prop: 'end_at'
  }
]
// 联盟商删除按钮组件
const choosedAllianceComponent = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 5,
    buttonList: [{
      text: '删除',
      buttonType: 4
    }],
    eventType: 'deleteAllianceTable'
  }
]

export default {
  name: 'IndexBannerAdd',
  mixins: [mixins],
  data () {
    return {
      flag: false,
      adName: '',
      startTime: '',
      endTime: '',
      imgUrl: '',
      contentType: 0,
      // --------------- 文本编辑器 --------------
      isShowEdit: false,
      contentTitle: '',
      isShowEditBody: false,
      editContent: '',
      editCurrentClickedIndex: 0,
      editIndexBanner: [],
      // 店铺列表
      shopList: [],
      shopName: '',
      shopPage: 1,
      shopColumns,
      shopComponentList,
      isShowShopList: false,
      // 店铺排版方式
      shopLayoutType: '',
      editShopParentIndex: '',
      editShopChildIndex: '',
      // 商品排版方式
      goodsLayoutType: '',
      editGoodsParentIndex: '',
      editGoodsChildIndex: '',
      // 是否是通过添加商品选项弹窗商品列表弹窗的
      isShowGoodsListByAddShop: false,
      // --------------- 添加商品 --------------
      isShowGoods: false,
      columns,
      options,
      selectedRows: [],
      currentOption: 0, // 当前选择项
      keyWords: '', // 搜索关键字,
      componentList,
      choosedColumn,
      isShowChoosedTable: false, // 选中表格的隐藏与显示
      choosedTableData: [], // 选中表格的数据
      choosedComponentList, // 选中表格组件配置
      // --------------- 添加外链 --------------
      isShowHref: false,
      hrefValue: '',
      // --------------- 添加联盟活动 --------------
      isShowAlliance: false, // 联盟活动按钮
      isShowAlliancePopup: false, // 联盟活动弹窗
      alliancePage: 1,
      alliancePageSize: 10,
      allianceTableData: [],
      allianceTotal: 0,
      allianceColumns,
      allianceOptions,
      allianceOption: '', // 下拉框选项
      allianceKeyWords: '',
      // 选中联盟商的表格数据
      allianceChoosedTableData: [],
      isShowChoosedAllianceTable: false,
      allianceChoosedColumn,
      choosedAllianceComponent

    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  created () {
    // 获取编辑详情数据
    this.getEditDetail()
    // 请求联盟商数据
    this.getAllianceList()
  },
  methods: {
    // ----------------- TODO ---------------------
    getEditDetail () {
      let url = 'adv/editIndexPic'
      let obj = {
        id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let {
            title,
            start_time,
            end_time,
            image,
            pic_title, // 页面标题
            pic_and_text, // 图文
            goods_id, // 商品 id
            url,  // 外链
            act_url, // 联盟活动 id
            union_title, // 联盟活动主题
            union_name, // 联盟活动商圈名称
            start_at, // 联盟活动开始时间
            end_at, // 联盟活动结束时间
            type_style // 内容类型（1：商品；2：外联；3：图文内容；4：联盟活动）
            } = res.data.one
          this.adName = title
          this.startTime = start_time
          this.endTime = end_time
          this.imgUrl = image
          this.contentTitle = pic_title
          // ----------------- TODO ------------------
          this.editIndexBanner = pic_and_text ? JSON.parse(pic_and_text) : []
          this.hrefValue = url
          switch (type_style) {
            case 1:
              this.contentType = '2'
              break
            case 2:
              this.contentType = '3'
              break
            case 3:
              this.contentType = '1'
              break
            case 4:
              this.contentType = '4'
              break
          }
          // ------------------- 添加商品 -----------------------
          if (type_style === 1) {
            let { id, image_path, product_code, title } = res.data.goodsList
            let obj = {}
            obj.id = id
            obj.src = image_path
            obj.product_code = product_code
            obj.title = title
            this.choosedTableData.splice(0, 1, obj)
          }
          // ------------------- 添加联盟活动 -----------------------
          if (type_style === 4) {
            let obj = {}
            obj.id = act_url
            obj.title = union_title
            obj.union_name = union_name
            obj.start_at = start_at
            obj.end_at = end_at
            this.allianceChoosedTableData.splice(0, 1, obj)
          }
          this.flag = true
          /* eslint-enable */
          return
        }
      })
    },
    // 提交新增内容
    comfirmSubmitContent () {
      if (!this.validateCommonFileds()) return
      let url = 'adv/addIndexPic'
      /* eslint-disable */
      let obj = {
        title: this.adName,
        start_time: this.startTime,
        end_time: this.endTime,
        image: this.imgUrl,
        id: this.id
      }
      let contentType = this.contentType
      // 图文
      if (contentType === '1') {
        if (!this.validateContentPic()) return
        obj.type_style = 3
        obj.pic_title = this.contentTitle
        this.handlerEditData(this.editIndexBanner)
        obj.pic_and_text = JSON.stringify(this.editIndexBanner)
      }
      // 商品
      if (contentType === '2') {
        if (!this.validateGoods()) return
        obj.type_style = 1
        obj.goods_id = this.choosedTableData[0].id
      }
      // 外链
      if (contentType === '3') {
        obj.type_style = 2
        obj.url = this.hrefValue
      }
      // 联盟活动
      if (contentType === '4') {
        obj.type_style = 4
        obj.url = this.allianceChoosedTableData[0].id
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$router.push({ name: 'IndexBanner' })
          this.$mes(res.message)
          return
        }
      })
    },
    // 处理图文编辑模块数据
    handlerEditData (data) {
      data.forEach(parentItem => {
        let { type, content } = parentItem
        if (type === 1) {
          parentItem.data = splitEditContent(content)
        } else {
          parentItem.data = content.map(childItem => {
            let { extend, url } = childItem
            extend.url = url
            return extend
          })
        }
      })
    },
    // 新增或者编辑提交校验 ---- 公共校验
    validateCommonFileds () {
      const nowTime = new Date() - 0
      if (!this.adName) {
        this.$mes('广告名称不能为空', 2)
        return false
      }
      if (!this.startTime) {
        this.$mes('开始时间不能为空', 2)
        return false
      }
      if (initTime(this.startTime) < nowTime) {
        this.$mes('开始时间需大于当前时间', 2)
        return false
      }
      if (!this.endTime) {
        this.$mes('结束时间不能为空', 2)
        return false
      }
      if (initTime(this.endTime) <= initTime(this.startTime)) {
        this.$mes('结束时间需大于开始时间', 2)
        return false
      }
      if (!this.imgUrl) {
        this.$mes('您还没有上传广告图', 2)
        return false
      }
      return true
    },
    // 图文检验
    validateContentPic () {
      if (!this.contentTitle) {
        this.$mes('页面标题不能为空', 2)
        return false
      }
      let length = this.editIndexBanner.length
      if (!length) {
        this.$mes('请至少添加一项内容', 2)
        return false
      }
      if (length) {
        let isUploadPic = false
        let isChooseShopOrGoods = false
        let isEditedConent = false
        this.editIndexBanner.some(parentItem => {
          let { type, content } = parentItem
          if (type === 1) {
            if (!content.trim()) {
              this.$mes('请填写要编辑的内容', 2)
              isEditedConent = true
              return true
            }
          }
          if (type !== 1) {
            content.some(childItem => {
              if (!childItem.url || !childItem.extend) {
                if (!childItem.url) {
                  isUploadPic = true
                } else {
                  isChooseShopOrGoods = true
                }
                return true
              }
            })
          }
          if (isUploadPic && type === 2) {
            this.$mes('请上传店铺图片', 2)
            return true
          }
          if (isChooseShopOrGoods && type === 2) {
            this.$mes('请添加店铺信息', 2)
            return true
          }
          if (isUploadPic && type === 3) {
            this.$mes('请上传商品图片', 2)
            return true
          }
          if (isChooseShopOrGoods && type === 3) {
            this.$mes('请添加商品信息', 2)
            return true
          }
        })
        if (isUploadPic || isChooseShopOrGoods || isEditedConent) return false
      }
      return true
    },
    // 校验商品
    validateGoods () {
      if (!this.choosedTableData.length) {
        this.$mes('请选择要上传的商品', 2)
        return false
      }
      return true
    },
    // 校验联盟活动
    validateAlliance () {
      if (!this.allianceChoosedTableData.length) {
        this.$mes('请选择要添加的联盟活动', 2)
        return false
      }
      return true
    },
    // 放弃新增
    giveupSubmitContent () {
      this.$router.push({ name: 'IndexBanner' })
    },
    changeInputValue (value) {
      this.adName = value
    },
    pickerStartTime (t) {
      this.startTime = t
    },
    pickerEndTime (t) {
      this.endTime = t
    },
    // 上传图片
    uploadFile (imgUrl) {
      this.imgUrl = imgUrl
    },
    // -------------------------------------- 添加图文 -----------------------------------
    // 图文标题
    getContentTitle (val) {
      this.contentTitle = val
    },
    // 展示编辑器
    addContentPic () {
      let obj = {}
      obj.type = 1
      obj.content = ''
      obj.extend = null
      this.editIndexBanner.push(obj)
      // this.isShowEditBody = true
    },
    removeCurrentEdit (i) {
      this.editCurrentClickedIndex = i
      this.$mesBox(`您确认要删除该模块内容吗？`, '提示', 1, 1, '确定', '放弃', this.confimRemoveCurrentEdit)
    },
    // 移除模块
    confimRemoveCurrentEdit (t) {
      if (t === 'confirm') {
        this.editIndexBanner.splice(this.editCurrentClickedIndex, 1)
      }
    },
    // 添加店铺
    addShops () {
      this.$refs.shopPopup.show()
    },
    comfirmShopLayOut () {
      let { shopLayoutType, editIndexBanner } = this
      if (!shopLayoutType) {
        this.$mes('请选择排版方式', 2)
        return
      }
      let obj = {}
      let parentIndex = editIndexBanner.length
      obj.type = 2
      if (shopLayoutType === '1') {
        obj.content = [
          {
            index: 0,
            url: '',
            text: '',
            parentIndex,
            extend: null
          }
        ]
        obj.layout = 1
      } else {
        obj.content = [
          {
            index: 0,
            url: '',
            text: '',
            parentIndex,
            extend: null
          },
          {
            index: 1,
            url: '',
            text: '',
            parentIndex,
            extend: null
          }
        ]
        obj.layout = 2
      }
      editIndexBanner.push(obj)
      this.shopLayoutType = ''
      this.$refs.shopPopup.hide()
    },
    giveupShopLayOut () {
      this.shopLayoutType = ''
      this.$refs.shopPopup.hide()
    },
    // 店铺图片
    uploadEditFile (payload) {
      let { url, data } = payload
      let { index, parentIndex } = data
      this.editIndexBanner[parentIndex].content[index].url = url
    },
    // 添加商品
    addGoods () {
      this.$refs.goodsPopup.show()
    },
    comfirmGoodsLayOut () {
      let { goodsLayoutType, editIndexBanner } = this
      if (!this.goodsLayoutType) {
        this.$mes('请选择排版方式', 2)
        return
      }
      let obj = {}
      let parentIndex = editIndexBanner.length
      obj.type = 3
      if (goodsLayoutType === '1') {
        obj.content = [
          {
            index: 0,
            url: '',
            text: '',
            parentIndex,
            extend: null
          }
        ]
        obj.layout = 1
      } else {
        obj.content = [
          {
            index: 0,
            url: '',
            text: '',
            parentIndex,
            extend: null
          },
          {
            index: 1,
            url: '',
            text: '',
            parentIndex,
            extend: null
          }
        ]
        obj.layout = 2
      }
      editIndexBanner.push(obj)
      this.goodsLayoutType = ''
      this.$refs.goodsPopup.hide()
    },
    giveupGoodsLayOut () {
      this.goodsLayoutType = ''
      this.$refs.goodsPopup.hide()
    },
    addEditShop (index, itemIndex) {
      this.editShopParentIndex = index
      this.editShopChildIndex = itemIndex
      this.getShopList()
      this.isShowShopList = true
    },
    addEditGoods (index, itemIndex) {
      this.editGoodsParentIndex = index
      this.editGoodsChildIndex = itemIndex
      this.getGoodsList()
      this.isShowGoodsListByAddShop = true
      this.isShowGoods = true
    },
    // -------------------------------------- 添加店铺 -----------------------------------
    getShopList () {
      let { shopPage, shopName, pageSize } = this
      let url = 'adv/getShopList'
      let obj = {
        shop_name: shopName,
        page: shopPage,
        pageSize
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { data, total } = res.data
          this.handlerShopListData(data)
          this.shopList = data
          this.total = total
        }
      })
    },
    handlerShopListData (data) {
      data.forEach((item, index) => {
        item.customRadio = false
        item.index = index
        item.src = item.shop_logo_path
        if (!item.shop_name) {
          item.shop_name = '/'
        }
        if (!item.company_name) {
          item.company_name = '/'
        }
        if (!item.area) {
          item.area = '/'
        }
      })
    },
    // 关键字
    getShopSearchKeyWords (value) {
      this.shopName = value
    },
    // 搜索
    searchShopList () {
      this.shopPage = 1
      this.getShopList()
    },
    changeShopRadio (row) {
      let currentIndex = row.index
      let length = this.shopList.length
      if (length <= 1) {
        row.customRadio = true
        this.shopList.splice(currentIndex, 1, row)
        return
      }
      this.shopList.forEach((row, index, arr) => {
        if (currentIndex !== index) {
          row.customRadio = false
          arr.splice(index, 1, row)
        }
      })
    },
    getShopListByPage (page) {
      this.shopPage = page
      this.getShopList()
    },
    comfirmChooseShop () {
      let flag = true
      let obj = {}
      let { shopList, editIndexBanner, editShopParentIndex, editShopChildIndex } = this
      shopList.some(item => {
        if (item.customRadio) {
          flag = false
          obj = item
          return true
        }
      })
      if (flag) {
        this.$mes('您还没有选择店铺', 2)
        return
      }
      editIndexBanner[editShopParentIndex].content[editShopChildIndex].text = obj.shop_name
      editIndexBanner[editShopParentIndex].content[editShopChildIndex].extend = obj
      this.isShowShopList = false
    },
    cancleChooseShop () {
      this.isShowShopList = false
    },
    // -------------------------------------- 添加商品 -----------------------------------
    // 获取商品列表数据
    getGoodsList () {
      let url = 'sale/goodList'
      let currentOption = this.currentOption
      let keyWords = this.keyWords
      let title = ''
      /* eslint-disable */
      let product_code = ''
      let shop_name = ''
      let brand_name = ''
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
        case 4:
          brand_name = keyWords
          break
      }
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        title,
        product_code,
        shop_name,
        brand_name,
        sale: 2,
        is_delete: 0
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
      })
    },
    handlerTableData (data) {
      data.forEach((item, index) => {
        item.customRadio = false
        item.index = index
        item.src = item.image_path
      })
    },
    // 商品表格单选
    changeRadio (row) {
      let currentIndex = row.index
      let length = this.tableData.length
      if (length <= 1) {
        row.customRadio = true
        this.tableData.splice(currentIndex, 1, row)
        return
      }
      this.tableData.forEach((row, index, arr) => {
        if (currentIndex !== index) {
          row.customRadio = false
          arr.splice(index, 1, row)
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
    // 搜索
    searchGoodsList () {
      this.page = 1
      this.getGoodsList()
    },
    // 根据页码加载
    getGoodsListByPage (page) {
      this.page = page
      this.getGoodsList()
    },
    // 商品筛选
    comfirmChooseGoods () {
      let flag = true
      this.tableData.forEach(item => {
        if (item.customRadio) {
          flag = false
          this.choosedTableData.splice(0, 1, item)
        }
      })
      if (flag) {
        this.$mes('您还没有选择商品', 2)
        return
      }
      if (this.isShowGoodsListByAddShop) {
        let { choosedTableData, editIndexBanner, editGoodsParentIndex, editGoodsChildIndex } = this
        let { title, image_path } = choosedTableData[0]
        // editIndexBanner[editGoodsParentIndex].content[editGoodsChildIndex].url = image_path
        editIndexBanner[editGoodsParentIndex].content[editGoodsChildIndex].text = title
        editIndexBanner[editGoodsParentIndex].content[editGoodsChildIndex].extend = choosedTableData[0]
        this.isShowChoosedTable = false
      } else {
        this.isShowChoosedTable = true
      }
      this.isShowGoods = false
      this.isShowGoodsListByAddShop = false
      // this.isShowGoods = false
      // this.isShowChoosedTable = true
    },
    // 删除选中的商品
    deleteChoosedTable () {
      this.choosedTableData = []
      this.isShowChoosedTable = false
    },
    // 取消商品筛选
    cancleChooseGoods () {
      this.isShowGoods = false
    },
    // -------------------------------------- 添加外链 -------------------------------------
    // 外链值
    getHrefValue (value) {
      this.hrefValue = value
    },
    // -------------------------------------- 添加联盟活动 ----------------------------------
    // 添加联盟活动
    showAddAlliance () {
      this.isShowAlliancePopup = true
    },
    // 隐藏联盟弹窗
    cancleAlliance () {
      this.isShowAlliancePopup = false
    },
    // 获取联盟商列表数据
    getAllianceList () {
      // let url = 'union/getUnionActList'
      let url = 'union/getUnionActOnList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize
      }
      if (this.allianceOption === 1) {
        obj.title = this.allianceKeyWords
      }
      if (this.allianceOption === 2) {
        obj.union_name = this.allianceKeyWords
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.allianceTableData = this.handlerAllianceList(res.data.data)
          this.allianceTotal = res.data.total
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    handlerAllianceList (data) {
      const nowTime = new Date() - 0
      return data.filter((item, index, arr) => {
        if (!item.status) {
          if (initTime(item.start_at) > nowTime) {
            item.activityStatus = '未开始'
          } else {
            item.activityStatus = '进行中'
          }
          item.customRadio = false
          item.index = index
          item.src = item.image_path
          return item
        }
      })
    },
    // 下拉框
    getAllianceOption (val) {
      this.allianceOption = val
    },
    // 搜索关键词
    getAllianceKeyWords (val) {
      this.allianceKeyWords = val
    },
    // 搜索按钮
    searchAllianceList () {
      this.page = 1
      this.getAllianceList()
    },
    // 根据页码获取数据
    getAllianceListByPage (page) {
      this.page = page
      this.getAllianceList()
    },
    // 联盟活动单选
    getSingleAllianceData (row) {
      let currentIndex = row.index
      let length = this.allianceTableData.length
      // 单条数据的时候避免选不中
      if (length <= 1) {
        row.customRadio = true
        this.allianceTableData.splice(0, 1, row)
        return
      }
      this.allianceTableData.forEach((row, index, arr) => {
        if (currentIndex !== row.index) {
          row.customRadio = false
          arr.splice(index, 1, row)
        }
      })
    },
    // 确定选中的联盟商活动
    confirmChoosedAlliance () {
      let flag = true
      this.allianceTableData.forEach(item => {
        if (item.customRadio) {
          flag = false
          this.allianceChoosedTableData.splice(0, 1, item)
        }
      })
      if (flag) {
        this.$mes('您还没有选择活动', 2)
        return
      }
      this.isShowAlliance = false
      this.isShowAlliancePopup = false
      this.isShowChoosedAllianceTable = true
    },
    // 删除选中联盟商活动表
    deleteAllianceTable () {
      this.allianceChoosedTableData = []
      this.isShowAlliance = true
      this.isShowChoosedAllianceTable = false
    }
  },
  watch: {
    contentType (val) {
      let goodsLenth = this.choosedTableData.length
      let allianceLength = this.allianceChoosedTableData.length
      if (val === '1') {
        this.isShowEdit = true
      }
      if (val !== '1') {
        this.editIndexBanner = []
        this.isShowEdit = false
      }
      if (val === '2') {
        this.getGoodsList()
      }
      if (val === '2' && !goodsLenth) {
        this.isShowGoods = true
      }
      if (val === '2' && goodsLenth) {
        this.isShowGoods = false
        this.isShowChoosedTable = true
      }
      if (val !== '2') {
        this.isShowGoods = false
        this.isShowChoosedTable = false
        this.choosedTableData = []
      }
      if (val === '3') {
        this.isShowHref = true
      }
      if (val !== '3') {
        this.isShowHref = false
      }
      if (val === '4' && !allianceLength) {
        this.isShowAlliance = true
      }
      if (val === '4' && allianceLength) {
        this.isShowChoosedAllianceTable = true
        this.isShowAlliancePopup = false
        this.isShowAlliance = false
      }
      if (val !== '4') {
        this.isShowChoosedAllianceTable = false
        this.isShowAlliancePopup = false
        this.isShowAlliance = false
        this.allianceChoosedTableData = []
      }
    }
  },
  components: {
    BaseEdit,
    BasePopup
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.index-banner-edit-container
  position static!important
  .index-banner-header
    color $color-orange
    border-left 4px solid $color-orange
    padding-left 20px
    margin 20px 0
  .index-banner-adname,
  .index-banner-start-time,
  .index-banner-end-time,
  .index-banner-img-title,
  .index-banner-img,
  .add-content-pic,
  .show-edit
    flex-f-align()
    margin-bottom 20px
  .input-wrapper
    width 220px
  .index-banner-img-title
    span:nth-child(3)
      color #f00
      f14()
  .index-banner-img
    padding-left 95px
  .index-banner-category
    margin-bottom 20px
    .el-radio__input
      &.is-checked
        .el-radio__inner
          background $color-orange
          border-color $color-orange
        & + .el-radio__label
          color $color-orange
  .show-edit
    padding-left 95px
    > div
      margin-right 20px
  .seperate
    height 1px
    background $color-c
    margin 20px 0
  .edit-container
    margin-bottom 30px
  .edit-button
    flex-f-align()
    justify-content center
    >div
      margin-right 10px
      f14()
  // 图文编辑模块
  .index-banner-container
    padding 20px
    margin-bottom 30px
    > div
      position relative
      width 680px
      padding 20px
      bd(#ccc)
      margin-bottom 20px
    .shop-close
      position absolute
      right 20px
      top 20px
      cursor pointer
    h1
      margin 0
      margin-bottom 20px
      f16()
      span
        color #f00
        f14()
    .edit-wrapper
      //
  // 添加店铺
  .add-shop-container
    flex-f()
    .shop-item
      flex 1
      margin-right 20px
      &:last-child
        margin 0
    .upload-img-container
      width 100%
      margin-bottom 20px
    .select-shop
      width 100%
      height 40px
      line-height 40px
      tc()
      background #409EFF
      bd(#dcdfe6)
      border-radius(3px)
      color #fff
      cursor pointer
      padding 0 10px
      text-over(1)
  // 排版弹窗
  .index-banner-popup-container
    width 400px
    padding 20px
    h1
      f14()
    .layout-type
      flex-f-align()
      margin-bottom 20px
      label
        margin-right 20px
      .layout-item
        flex 1
        height 80px
        background #ccc
        margin-right 20px
        &:last-child
          margin 0
      .el-radio__input
        & + .el-radio__label
            color transparent
        &.is-checked
          .el-radio__inner
            background $color-orange
            border-color $color-orange
    .add-button-wrapper
      flex-center()
      > div
        margin-right 20px
  // 广告外链
  .add-ad-href
    width 420px
  // 联盟活动按钮
  .alliance-add-button,
  .show-edit
    .el-button--primary
      border-color $color-orange
      background $color-orange
      color #fff
      f14()
  .alliance-add-button
    .base-button-item
      button
        width auto
  // 选择商品弹窗
  .choose-goods-container,
  .alliance-add-table
    wh(100%)
    position absolute
    left 0
    top 0
    background rgba(0, 0, 0, .4)
    .choose-goods-wrapper
      width 1300px
      padding 20px
      padding-bottom 0
      z-index 999
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      background #fff
      .choose-goods-title
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
  .red
    margin-top 8px
    color $color-orange
  .right-25
    margin-right 25px
</style>
