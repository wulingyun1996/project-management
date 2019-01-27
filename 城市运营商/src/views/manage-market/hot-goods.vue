<template>
  <div class="hot-goods-container">
    <base-tab
      :tab-items="tabItems"
      :default-tab="currentTabStatus"
      @clickCurrentTab="clickCurrentTab">
    </base-tab>
    <div class="hot-goods-list" v-show="currentTabStatus === '1'">
      <div class="add-goods-header">
        <div class="goods-header-left">
          <base-button :type="1" text="添加商品" @clickCurrentButton="addGoods"></base-button>
          <base-button :type="4" text="批量删除" @clickCurrentButton="deleteAllSelectButton"></base-button>
        </div>
        <div class="page-header">
          <div class="time-select">
            <base-time-picker
              timeText="结束时间："
              @pickerTime="goodsPickerTime"
              >
            </base-time-picker>
          </div>
          <div>
            <el-select v-model="optionsId" filterable placeholder="爆款分类">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div>
            <!-- <base-input
              placeholder="商品名称/商品编号"
              @changeInputValue="getSearchKeyWords"
              >
            </base-input> -->
            <el-input
              placeholder="商品名称/商品编号"
              v-model="keyWords"
              clearable>
            </el-input>
          </div>
          <base-button
            text="搜索"
            :type="1"
            @clickCurrentButton="clickSearch"
            >
          </base-button>
        </div>
      </div>
      <div class="table-container">
        <base-table
          :data="tableData"
          :columns="columns"
          :total="total"
          :componentList="choosedComponentList"
          columnType="selection"
          @selectionChange="selectAll"
          @buttonSubmit="operateCurrentRow"
          @changePage="changePage"
          >
        </base-table>
      </div>
    </div>
    <div class="hot-goods-banner" v-show="currentTabStatus === '2'">
      <!-- 第一次添加广告位 -->
      <base-button :type="1" text="新增广告图" @clickCurrentButton="addBanner" v-if="isFirst"></base-button>
      <!-- 广告位详情 -->
      <div class="hot-banner-wapper" v-else>
        <div class="activity-name">
          <div class="description">
            <span class="red">*</span>
            <span class="name">活动名称：</span>
          </div>
          <span class="title">{{ brandName }}</span>
        </div>
        <div class="activity-banner">
          <div class="description">
            <span class="red">*</span>
            <span class="name">首页广告图：</span>
          </div>
          <div class="upload-banner">
            <img :src="homeUrl" alt="">
          </div>
        </div>
        <!-- <div class="activity-banner">
          <div class="description">
            <span class="red">*</span>
            <span class="name">活动广告图banner：</span>
          </div>
          <div class="upload-banner">
            <img :src="bannerUrl" alt="">
          </div>
        </div> -->
        <!-- <div class="banner-label">
          <div class="description">
            <span class="red">*</span>
            <span class="name">爆款商品标签：</span>
          </div>
          <img :src="hotLabel" alt="">
        </div> -->
        <base-button :type="1" text="修改" @clickCurrentButton="modifyBanner"></base-button>
      </div>
    </div>
    <div class="hot-goods-slideshow" v-show="currentTabStatus === '3'">
      <div class="index-banner-header">
        <div class="banner-modify">
          <base-button :type="2" v-show="addBannerShow" text="新增" @clickCurrentButton="addIndexBanner"></base-button>
          <base-button :type="4" text="批量删除" @clickCurrentButton="deleteAllSelectBannerButton"></base-button>
        </div>
        <div class="banner-filter">
          <base-time-picker
            @pickerTime="pickerStartTime"
            timeText="结束时间">
          </base-time-picker>
          <base-select
            :options="bannerOptions"
            @changeCurrentOption="changeCurrentOption"
            placeholder="状态"
            class="select-options">
          </base-select>
          <base-input
            @changeInputValue="changeInputValue"
            placeholder="请输入广告名称"
            class="input-wapper">
          </base-input>
          <base-button
            :type="1"
            @clickCurrentButton="searchTableData"
            text="搜索">
          </base-button>
        </div>
      </div>
      <div class="index-banner-body">
        <div class="table-container">
          <base-table
            :data="bannerTableData"
            :columns="bannerColumns"
            :total="total"
            :componentList="bannerChoosedComponentList"
            columnType="selection"
            @selectionChange="bannerSelectAll"
            @buttonSubmit="bannerOperateCurrentRow"
            @changePage="bannerChangePage"
            @sortCurrentRow="sortCurrentRow"
            >
          </base-table>
        </div>
      </div>
    </div>
    <div class="hot-goods-classify" v-show="currentTabStatus === '4'">
      <div class="classify-header">
      <base-button :type="2" @clickCurrentButton="addClassify" text="新增"></base-button>
      <span class="suggest">建议添加2-9个分类</span>
      </div>
      <div class="goods-classify-body">
        <base-table
          :data="classifyTableData"
          :columns="classifyColumns"
          :total="total"
          :componentList="classifyChoosedComponentList"
          @buttonSubmit="classifyOperateCurrentRow"
          @changePage="classifyChangePage"
          @sortCurrentRow="classifySortCurrentRow"
          >
        </base-table>
      </div>
       <!-- 添加分类的弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <div class="classify-center">
          <p>为了APP展示效果，分类名称最多允许输入4个汉字</p>
          <p>请输入新的分类名称：</p>
          <el-input
            placeholder="请输入内容"
            v-model="classifyName"
            maxlength="4"
            type="text"
            clearable>
          </el-input>
          <!-- onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')" -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClassifyName">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BaseTableImage from 'components/table-image'
import BaseTableButton from 'components/table-button'
import BaseTableSort from 'components/table-sort/table-sort'
import BaseTab from 'components/tab'
import { mixins } from 'mixins'
// import { initTime } from 'utils/common'
// tab 栏数据
const tabItems = [
  {
    label: '爆款商品列表',
    name: '1'
  },
  {
    label: '广告图配置',
    name: '2'
  },
  {
    label: '轮播图配置',
    name: '3'
  },
  {
    label: '分类配置',
    name: '4'
  }
]
const columns = [
  {
    label: '序号',
    prop: 'index'
  },
  {
    label: '商品编号',
    prop: 'product_code'
  },
  {
    label: '商品名称',
    prop: 'title'
  },
  {
    label: '商品状态',
    prop: 'sale'
  },
  {
    label: '爆款分类',
    prop: 'category'
  },
  {
    label: '开始时间',
    prop: 'start_time'
  },
  {
    label: '结束时间',
    prop: 'end_time'
  }
]
const goodsButtonList = [
  {
    text: '编辑',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const choosedComponentList = [
  {
    component: BaseTableImage,
    label: '商品图片',
    insertIndex: 2,
    height: 100
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 8,
    width: 150,
    buttonList: goodsButtonList,
    eventType: 'buttonSubmit'
  }
]
const bannerColumns = [
  {
    label: '广告序号',
    prop: 'index'
  },
  {
    label: '广告名称',
    prop: 'title'
  },
  {
    label: '广告链接/商品号',
    prop: 'url'
  },
  {
    label: '开始时间',
    prop: 'start_time'
  },
  {
    label: '结束时间',
    prop: 'end_time'
  },
  {
    label: '当前状态',
    prop: 'bannerStatus'
  }
]
const bannerOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '停用',
    value: 1
  }
]
const buttonList = [
  {
    text: '停用',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '编辑',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const bannerChoosedComponentList = [
  {
    component: BaseTableImage,
    label: '广告图片',
    insertIndex: 2,
    height: 100
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 8,
    width: 240,
    eventType: 'buttonSubmit'
  },
  {
    component: BaseTableSort,
    label: '排序',
    insertIndex: 9,
    width: 100,
    eventType: 'sortCurrentRow'
  }
]
const classifyColumns = [
  {
    label: '序号',
    prop: 'index'
  },
  {
    label: '分类名称',
    prop: 'name'
  },
  {
    label: '当前状态',
    prop: 'classifyStatus'
  },
  {
    label: '商品数',
    prop: 'goods_count'
  }
]
const classifyChoosedComponentList = [
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 4,
    width: 240,
    eventType: 'buttonSubmit'
  },
  {
    component: BaseTableSort,
    label: '排序',
    insertIndex: 5,
    width: 100,
    eventType: 'sortCurrentRow'
  }
]
const classifyButtonList = [
  {
    text: '停用',
    buttonType: 1,
    type: 'primary',
    size: 'small'
  },
  {
    text: '编辑名称',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
export default {
  name: 'HotGoods',
  mixins: [mixins],
  data () {
    return {
      tabItems,
      currentTabStatus: '1',
      columns,
      choosedComponentList,
      bannerColumns,
      bannerOptions,
      bannerChoosedComponentList,
      selectedData: [],
      currentRow: {},
      options: [],
      optionsId: '',
      goodsStartTime: '',
      goodsEndTime: '',
      keyWords: '',
      // isShowGoodsList: true,
      // isShowBanner: false,
      // isShowSlide: false,
      // isShowClassify: false,
      isFirst: false,
      // 轮播图数据
      bannerTableData: [],
      brandName: '',
      bannerUrl: '',
      hotLabel: '',
      homeUrl: '',
      startTime: '',
      endTime: '',
      filterStatus: '',
      adName: '',
      deleteSelect: [],
      showAdd: true,
      // 分类数据
      classifyColumns,
      classifyChoosedComponentList,
      classifyTableData: [],
      centerDialogVisible: false,
      classifyName: '',
      classifId: ''
    }
  },
  computed: {
    bannerIndex () {
      return this.$route.query.index
    },
    addBannerShow () {
      if (this.bannerTableData.length >= 8) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    if (!this.$route.query.index) {
      this.getHotGoodsList()
      this.getClassify()
    } else if (this.$route.query.index === '2') {
      this.currentTabStatus = '2'
      this.getBanner()
    } else if (this.$route.query.index === '3') {
      this.currentTabStatus = '3'
      this.getTableData()
    }
  },
  methods: {
    // tab 栏切换
    clickCurrentTab (tab) {
      this.currentTabStatus = tab
      this.page = 1
      if (tab === '1') {
        this.goodsStartTime = ''
        this.goodsEndTime = ''
        this.optionsId = ''
        this.keyWords = ''
        this.getHotGoodsList()
      } else if (tab === '2') {
        this.getBanner()
      } else if (tab === '3') {
        this.getTableData()
      } else if (tab === '4') {
        this.getClassifyData()
      }
    },
    getClassify () {
      let url = 'adv/classifyData'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.options = res.data
        }
      })
    },
    // 商品列表
    getHotGoodsList () {
      let startDate = new Date(this.goodsStartTime)
      let firstTime = startDate.getTime() + ''
      let endDate = new Date(this.goodsEndTime)
      let twoTime = endDate.getTime() + ''
      let url = 'adv/getHotList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        start_time: firstTime.substring(0, firstTime.length - 3),
        end_time: twoTime.substring(0, twoTime.length - 3),
        category_id: this.optionsId,
        key_word: this.keyWords
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          // return
        }
        // this.$mes(res.message, 4)
      })
    },
    handlerTableData (data) {
      data.forEach((item, index) => {
        item.index = index + 1
        item.src = item.image_path
        item.goods_id = item.goods_id
      })
    },
    // 全选
    selectAll (rows) {
      this.selectedData = rows
    },
    operateCurrentRow (row, type) {
      this.currentRow = row
      // 编辑
      if (type === 3) {
        this.$router.push({ name: 'EditHotGoods', query: { id: row.hot_id, goods_id: row.goods_id } })
        return
      }
      // 删除弹窗
      this.$mesBox(`您确定要将商品编号为${row.product_code}从爆款中删除？`, '提示', 1, 1, '确定', '取消', this.deleteCurrentRow)
    },
    deleteCurrentRow (t) {
      /* eslint-disable */
      let { hot_id, index } = this.currentRow
      if (t === 'confirm') {
        let url = 'adv/delHot'
        let obj = {
          hot_id
        }
      /* eslint-disable */
        this.$http(url, obj).then(res => {
          if (res.code === this.$ok) {
            this.tableData.splice(index - 1, 1)
            this.judgeTableData()
            this.$mes('删除成功')
            // return
          }
          // this.$mes(res.message, 4)
        })
      }
    },
    judgeTableData () {
      if (!this.tableData.length) {
        if (this.page === 1) return
        this.page--
      }
      this.getHotGoodsList()
    },
    // 添加商品
    addGoods () {
      this.$router.push({ name: 'AddHotGoods' })
    },
    // 全部删除按钮弹窗
    deleteAllSelectButton () {
      if (!this.selectedData.length) {
        this.$mes('请选择要删除的列', 2)
        return
      }
      this.$mesBox(`您确定要批量删除吗`, '提示', 1, 1, '确定', '取消', this.comfirmDeleteAll)
    },
    // 确定删除全部
    comfirmDeleteAll (t) {
      if (t === 'confirm') {
        let arr = []
        let id
        this.selectedData.forEach(item => {
          arr.push(item.hot_id)
        })
        id = arr.join()
        console.log(id)
        this.deleteAll(id)
      }
    },
    // 删除全部的接口
    deleteAll (id) {
      let url = 'adv/delHot'
      let obj = {
        hot_id: id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('删除成功')
          this.tableData = []
          this.getHotGoodsList()
        }
      })
    },
    changePage (page) {
      this.page = page
      this.getHotGoodsList()
    },
    // 选择时间
    // 选择时间
    goodsPickerTime (t) {
      if (!t) {
        this.goodsStartTime = ''
        this.goodsEndTime = ''
        return
      }
      this.goodsStartTime = t[0]
      this.goodsEndTime = t[1]
    },
    // 关键词
    getSearchKeyWords (val) {
      this.keyWords = val
    },
    // 点击搜索
    clickSearch () {
      this.page = 1
      this.getHotGoodsList()
    },
    // ------------------------------ 广告位 -------------------------------------
    // 新增广告位
    addBanner () {
      this.$router.push({ name: 'HotGoodsBanner' })
    },
    getBanner () {
      let url = 'adv/getHotAdv'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          if (!res.data) {
            this.isFirst = true
            return
          }
          this.brandName = res.data.hotadv.title
          this.bannerUrl = res.data.hotadv.image
          this.hotLabel = res.data.hotlabel.image
          this.homeUrl = res.data.hotindex.image
          // return
        }
        // this.$mes(res.message, 4)
      })
    },
    // 修改广告位
    modifyBanner () {
      this.$router.push({ name: 'HotGoodsBannerEditter' })
    },
    //  ------------------------  轮播图 ----------------------------------
    // 新增轮播图
    addIndexBanner () {
      this.$router.push({ name: 'HotGoodsBannerAdd' })
    },
    // 时间选择器
    pickerStartTime (t) {
      // 清空日期的时候赋值为空
      if (!t) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = t[0]
      this.endTime = t[1]
    },
    // 下拉框
    changeCurrentOption (option) {
      this.filterStatus = option
    },
    // input 输入框
    changeInputValue (value) {
      this.adName = value
    },
    // 搜索
    searchTableData () {
      this.page = 1
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      let startDate = new Date(this.startTime)
      let firstTime = startDate.getTime() + ''
      let endDate = new Date(this.endTime)
      let twoTime = endDate.getTime() + ''
      let url = 'adv/bannerList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        start_time: firstTime.substring(0, firstTime.length - 3),
        end_time: twoTime.substring(0, twoTime.length - 3),
        title: this.adName,
        status: this.filterStatus
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.bannerHandlerTableData(res.data.data)
          this.bannerTableData = res.data.data
          this.total = res.data.total
          return
        }
        this.$mes(res.message, 4)
      })
    },
    // 格式化表格数据
    bannerHandlerTableData (data) {
      let length = data.length
      data.forEach((item, index, arr) => {
        // 用来决定箭头的显示 0 => 不显示排序箭头，1 => 显示下箭头，2 => 显示排序上箭头，3 => 显示排序双箭头
        if (length === 1) item.showArrow = 0
        if (length !== 1 && index === 0) {
          item.showArrow = 1
        } else if (length !== 1 && index === length - 1) {
          item.showArrow = 2
        } else if (length !== 1 && index !== length - 1) {
          item.showArrow = 3
        }
        // 当前索引加 1，若对当前行操作，需要进行 减 1
        item.src = item.image
        item.index = index + 1
        item.buttonList = JSON.parse(JSON.stringify(buttonList))
        if (item.status === 1) {
          item.bannerStatus = '停用'
          item.buttonList[0].text = '启用'
        } else {
          item.bannerStatus = '启用'
          item.buttonList[0].text = '停用'
        }
        if (!item.url) item.url = '/'
      })
    },
    // 根据点击按钮，操作当前行
    bannerOperateCurrentRow (row, type) {
      this.currentRow = row
      // 启用/停用弹窗
      if (type === 1) {
        this.$mesBox(`您确定要${row.buttonList[0].text}" ${row.title} "吗`, '提示', 1, 1, '确定', '取消', this.openOrCloseButton)
        return
      }
      if (type === 3) {
        this.$router.push({ name: 'HotGoodsBannerEdit', query: { id: row.id } })
      }
      // 删除弹窗
      if (type === 4) {
        this.$mesBox(`您确定要删除" ${row.title} "吗`, '提示', 1, 1, '确定', '取消', this.deleteCurrentBannerButton)
      }
    },
    // 启用或者停用按钮
    openOrCloseButton (t) {
      // 点击确定执行启用停用操作
      if (t === 'confirm') {
        this.openOrClose()
      }
    },
    // 启用/停用接口
    openOrClose () {
      let { id, status, index } = this.currentRow
      let isOpen = status === 1 // 启用判断
      status = isOpen ? 2 : 1
      let url = 'adv/bannerStop'
      let obj = {
        id,
        status
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (isOpen) {
            this.currentRow.buttonList[0].text = '停用'
            this.currentRow.bannerStatus = '启用'
          } else {
            this.currentRow.buttonList[0].text = '启用'
            this.currentRow.bannerStatus = '停用'
          }
          this.currentRow.status = status
          this.bannerTableData.splice(index - 1, 1, this.currentRow)
        }
      })
    },
    // 删除按钮
    deleteCurrentBannerButton (t) {
      if (t === 'confirm') {
        this.deleteCurrentBanner()
      }
    },
    // 删除接口
    deleteCurrentBanner () {
      let { id, index } = this.currentRow
      let url = 'adv/bannerDel'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.bannerTableData.splice(index - 1, 1)
          this.judgeTableDataBanner()
          this.$mes('删除成功')
        }
      })
    },
    // 删除之后执行判断
    judgeTableDataBanner () {
      if (!this.bannerTableData.length) {
        if (this.page === 1) return
        this.page--
      }
      this.getTableData()
    },
    // 全部删除按钮弹窗
    deleteAllSelectBannerButton () {
      if (!this.deleteSelect.length) {
        this.$mes('请选择要删除的列', 2)
        return
      }
      this.$mesBox(`您确定要批量删除吗`, '提示', 1, 1, '确定', '取消', this.comfirmDeleteBannerAll)
    },
    // 确定删除全部
    comfirmDeleteBannerAll (t) {
      if (t === 'confirm') {
        let arr = []
        let id
        this.deleteSelect.forEach(item => {
          arr.push(item.id)
        })
        id = arr.join()
        this.deleteBannerAll(id)
      }
    },
    // 删除全部的接口
    deleteBannerAll (id) {
      let url = 'adv/bannerDel'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('删除成功')
          this.getTableData()
        }
      })
    },
    bannerSelectAll (rows) {
      this.deleteSelect = rows
    },
    // 排序事件
    sortCurrentRow (row) {
      let { id, sortBy } = row
      let url = 'adv/bannerSort'
      let obj = {
        id,
        sortType: sortBy
        // sort
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getTableData()
        }
      })
    },
    bannerChangePage (page) {
      this.page = page
      this.getTableData()
    },
    // -----------------------  分类列表  ----------------------------
    // 获取列表数据
    getClassifyData () {
      let url = 'adv/classifyList'
      let obj = {
        page: this.page,
        pageSize: this.pageSize
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.classifyHandlerTableData(res.data.data)
          this.classifyTableData = res.data.data
          this.total = res.data.total
          return
        }
        this.$mes(res.message, 4)
      })
    },
    // 格式化表格数据
    classifyHandlerTableData (data) {
      let length = data.length
      data.forEach((item, index, arr) => {
        // 用来决定箭头的显示 0 => 不显示排序箭头，1 => 显示下箭头，2 => 显示排序上箭头，3 => 显示排序双箭头
        if (length === 1) item.showArrow = 0
        if (length !== 1 && index === 0) {
          item.showArrow = 1
        } else if (length !== 1 && index !== length - 1) {
          item.showArrow = 3
        } else if (length !== 1 && index === length - 1) {
          item.showArrow = 2
        }
        // 当前索引加 1，若对当前行操作，需要进行 减 1
        item.index = index + 1
        item.buttonList = JSON.parse(JSON.stringify(classifyButtonList))
        if (item.status === 1) {
          item.classifyStatus = '停用'
          item.buttonList[0].text = '启用'
        } else {
          item.classifyStatus = '启用'
          item.buttonList[0].text = '停用'
        }
      })
    },
    // 按钮执行事件
    classifyOperateCurrentRow (row, type) {
      this.currentRow = row
      // 启用/停用弹窗
      if (type === 1) {
        let info
        if (row.buttonList[0].text === '停用') {
          info = '停用后分类下商品将不在爆款频道展示，确定停用吗？'
        } else {
          info = `你确定启用${row.name}吗？`
        }
        this.$mesBox(info, '提示', 1, 1, '确定', '取消', this.classifyOpenOrCloseButton)
        return
      }
      if (type === 3) {
        this.centerDialogVisible = true
        this.classifyName = row.name
        this.classifId = row.id
      }
      // 删除弹窗
      if (type === 4) {
        this.$mesBox(`删除后分类下商品将不在爆款频道展示，确定删除吗？`, '提示', 1, 1, '确定', '取消', this.deleteCurrentclassifyButton)
      }
    },
    // 删除按钮
    deleteCurrentclassifyButton (t) {
      if (t === 'confirm') {
        this.deleteCurrentClassify()
      }
    },
    // 删除接口
    deleteCurrentClassify () {
      let { id, index } = this.currentRow
      let url = 'adv/classifyDel'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.classifyTableData.splice(index - 1, 1)
          this.judgeTableDataClassify()
          this.$mes('删除成功')
        }
      })
    },
    // 删除之后执行判断
    judgeTableDataClassify () {
      if (!this.classifyTableData.length) {
        if (this.page === 1) return
        this.page--
      }
      this.getClassifyData()
    },
    // 启用或者停用按钮
    classifyOpenOrCloseButton (t) {
      // 点击确定执行启用停用操作
      if (t === 'confirm') {
        this.classifyOpenOrClose()
      }
    },
    // 启用/停用接口
    classifyOpenOrClose () {
      let { id, status, index } = this.currentRow
      let isOpen = status === 1 // 启用判断
      status = isOpen ? 2 : 1
      let url = 'adv/classifyStop'
      let obj = {
        id,
        status
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (isOpen) {
            this.currentRow.buttonList[0].text = '停用'
            this.currentRow.classifyStatus = '启用'
          } else {
            this.currentRow.buttonList[0].text = '启用'
            this.currentRow.classifyStatus = '停用'
          }
          this.currentRow.status = status
          this.classifyTableData.splice(index - 1, 1, this.currentRow)
        }
      })
    },
    // 排序
    classifySortCurrentRow (row) {
      let { id, sortBy } = row
      let url = 'adv/classifySort'
      let obj = {
        id,
        sortType: sortBy
        // sort
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.getClassifyData()
        }
      })
    },
    // 分页事件
    classifyChangePage (page) {
      this.page = page
      this.getClassifyData()
    },
    // 显示分类弹框
    addClassify () {
      if (this.classifyTableData.length >= 9) {
        this.$mes('最多只能添加9个分类', 2)
        return
      }
      this.centerDialogVisible = true
    },
    // 添加分类
    addClassifyName () {
      if (!this.classifyName) {
        this.$mes('分类不能为空', 2)
        return
      }
      if(!/^[\u4e00-\u9fa5]+$/gi.test(this.classifyName)) {
        this.$mes('只能输入汉字', 2)
        return
      }
      let url = 'adv/classifyAdd'
      let obj = {
        name: this.classifyName
      }
      if (this.classifId) {
        obj.id = this.classifId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('添加成功')
          this.classifyName = ''
          this.centerDialogVisible = false
          this.getClassifyData()
          this.classifyHandlerTableData(this.classifyTableData)
        }
      })
    }
  },
  // watch: {
  //   currentTabStatus (val) {
  //     if (val === '1') {
  //       this.isShowGoodsList = true
  //       this.isShowBanner = false
  //     } else {
  //       this.isShowGoodsList = false
  //       this.isShowBanner = true
  //     }
  //   }
  // },
  components: {
    BaseTab
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.hot-goods-container
  .add-goods-header
    display flex
    align-items center
    justify-content space-between
    .goods-header-left
      display flex
      align-items center
      >div
        margin-right 20px
    .page-header
      flex-f-align()
    .page-header
        >div
          margin-left 20px
          &:nth-child(1)
            margin-left 0
      .table-container
        margin-top 50px
  .table-container
    margin-top 20px
  .hot-goods-banner
    .activity-name,
    .activity-banner,
    .banner-label
      flex-f-align()
      margin-bottom 20px
      .description
        width 160px
        height 32px
        line-height 32px
        text-align right
        overflow hidden
        margin-right 30px
      .input-wrapper
        margin-right 10px
      .title
        color #999
    .activity-banner
      align-items flex-start
      margin-bottom 60px
      .upload-banner
        width 750px
        height 280px
        img
          wh(100%)
    .banner-label
      align-items flex-start
      img
        wh(80px)
    .red
      display inline-block
      color #ff8a00
      vertical-align sub
      margin-right 2px
    .hot-banner-wapper
      position relative
      .base-button-item
        position absolute
        right 0
        top 0
  .hot-goods-slideshow
    .index-banner-header
      flex-align-item()
      margin-bottom 10px
      .banner-modify
        flex-f()
        >div:first-child
          margin-right 10px
      .banner-filter
        flex-align-item()
        .select-options
          margin 0 10px
          width 150px
        .input-wapper
          width 150px
          margin-right 20px
  .hot-goods-classify
    .classify-header
      display flex
      align-items center
      .suggest
        color #f00
        margin-left 20px
    .classify-center
      p:first-child
        color #f00
      p
        margin-bottom 15px
</style>
