<template>
  <base-senior-popup width="100%" height="100%" ref="select" class="select-category-container">
    <base-header
      :title="title"
      :intercept-back="isgetDataBySearch"
      @headerBack="headerBack">
    </base-header>
    <div class="select-category-wrapper" v-show="isShowMainPage">
      <div class="select-wrapper p-30">
        <div class="select-category-search">
          <i class="icon-search"></i>
          <input type="text" placeholder="请输入类目名称检索，如“墙砖”" v-model="searchedKeyWords">
          <span @click="searchedCatetoryData">搜索</span>
        </div>
        <div class="lated-category-wrapper" v-show="isShowHistoryCatlog">
          <h3>最近使用类目</h3>
          <div class="seperate"></div>
          <ul class="lated-category-list">
            <li
              v-for="(historyItem, historyIndex) in historyCategory"
              :key="historyIndex"
              @click="choosedHistoryItem(historyItem, historyIndex)">
              <i></i>
              <span>{{ historyItem.name }}</span>
            </li>
          </ul>
          <div class="lated-seperate"></div>
        </div>
      </div>
      <base-scroll :has-more="true" class="select-scroll">
        <ul class="category-item">
          <li
            class="item"
            :class="{ active: categoryItem.checked }"
            v-for="(categoryItem, categoryIndex) in categoryList"
            :key="categoryIndex"
            @click="choosedMainCatlog(categoryItem, categoryIndex)">
            {{ categoryItem.name }}
          </li>
        </ul>
        <div class="add-new-category">
          <p>以上类目都不符合</p>
          <a href="javascript:" @click="addNewCategoryItem"><i>+</i> 提报类目</a>
        </div>
      </base-scroll>
    </div>
    <!-- 选中类目 -->
    <div class="category-catlog-container" v-if="isShowSelectedCat">
      <div class="selected-category-title">
        <h2>{{ levelOneCatlog.name }}</h2>
        <i @click="closeSelectedList"></i>
      </div>
      <div class="selected-subcategory-wrapper p-30">
        <base-scroll :has-more="true" direction="horizontal">
          <div
            class="subcategory-item item"
            v-for="(guideItem, guideIndex) in subCategoryGuide"
            :key="guideIndex"
            @click="getSubCategory(guideItem, guideIndex)">
            {{ guideItem.name }} <span v-show="guideIndex !== subCategoryGuide.length - 1">></span>
          </div>
          <div class="choice-guide item" :class="{ active: subCategoryGuide.length !== 0 }">请选择</div>
        </base-scroll>
      </div>
      <base-scroll :has-more="true" class="scroll-subcategory">
        <ul class="subcategory-list">
          <li
            v-for="(subCategoryItem, subCategoryIndex) in selectedSubCatlog"
            :key="subCategoryIndex"
            :class="{ active: subCategoryItem.checked }"
            @click="choosedSubCategory(subCategoryItem, subCategoryIndex)">
            <span>{{ subCategoryItem.name }}</span>
            <i v-show="subCategoryItem.checked"></i>
          </li>
        </ul>
      </base-scroll>
    </div>
    <!-- 搜索类目 -->
    <div class="category-search-container" v-if="isgetDataBySearch">
      <div class="select-category-search">
        <i class="icon-search"></i>
        <i class="icon-clear" @click="searchedKeyWords = ''"></i>
        <input type="text" placeholder="请输入类目名称检索，如“墙砖”" v-model="searchedKeyWords">
        <span @click="searchedCatetoryData">搜索</span>
      </div>
      <div class="category-search-wrapper" v-show="showViewBySearch">
        <div class="seperate"></div>
        <base-scroll :has-more="true" class="scroll-search">
          <ul class="searched-item-list">
            <li
              v-for="(searchedItem, searchIndex) in searchedCatetory"
              :key="searchIndex"
              :class="{ 'active': searchedIndex === searchIndex }"
              @click="choosedSearchItem(searchedItem, searchIndex)">
              <span>{{ searchedItem.name }}</span>
              <i v-show="searchedIndex === searchIndex"></i>
            </li>
          </ul>
        </base-scroll>
        <base-footer
        :class="{ 'no-choiced': showFooterBySearch }"
          @footerSubmit="footerSubmit">
          确定
        </base-footer>
      </div>
      <!-- 搜索无数据 -->
      <div class="category-search-no-data" v-show="!showViewBySearch">
        <h2>没有搜索到相关类目！</h2>
        <p>原因可能是：</p>
        <p class="txt">关键词输入不够准确，请尝试修改。</p>
      </div>
    </div>
    <router-view></router-view>
  </base-senior-popup>
</template>

<script>
import brandList from 'data/brandList'
import { mapMutations } from 'vuex'
import { judgeObjectLen, cloneDeep } from 'commons'
let tempBrandList = cloneDeep(brandList)
export default {
  data () {
    return {
      categoryFlag: false,
      // 主页面
      isShowMainPage: true,
      // ----------------------- 历史记录数据 -----------------------
      historyCategory: [],
      historyItem: {},
      // ----------------------- 选中类目 -----------------------
      // 长按颜色交互处理
      startTime: 0,
      endTime: 0,
      timer: null,
      categoryList: [],
      // 选中的一级类目
      levelOneCatlog: {},
      // 子类目标题
      subCategoryGuide: [],
      // 选中的子类目
      selectedSubCatlog: [],
      tempSubList: [],
      // ----------------------- 搜索途径 -----------------------
      // 数据是否通过搜索获取到
      isgetDataBySearch: false,
      searchedKeyWords: '',
      searchedCatetory: [],
      searchedIndex: -1,
      searchedItem: {}
    }
  },
  computed: {
    // 是否编辑正常商品
    title () {
      // eslint-disable-next-line
      return !!this.$route.query.isEditNormalGoods ? '编辑类目' : '选择类目'
    },
    // 是否显示历史记录
    isShowHistoryCatlog () {
      return this.categoryFlag && !!this.historyCategory.length
    },
    // 是否显示所有类目
    isShowCategoryList () {
      return this.categoryFlag && !!this.categoryList.length
    },
    // 是否选中任意类目，来决定选择类目列表展示和主页面的隐藏
    isShowSelectedCat () {
      return !!judgeObjectLen(this.levelOneCatlog)
    },
    // 搜索条件下展示样式
    showViewBySearch () {
      return this.isgetDataBySearch && !!this.searchedCatetory.length
    },
    // 搜索条件下底部按钮样式
    showFooterBySearch () {
      return this.searchedIndex === -1
    },
    tabWidth () {
      return this.$dpr / 2 * 50
    }
  },
  created () {
    this.getCategoryData()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.select.show()
      this.selectSubCategory()
    })
  },
  methods: {
    ...mapMutations(['CATEGORY_ID', 'SET_EDIT_CATEGORY']),
    getCategoryData () {
      let url = 'goods/categoryList'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.historyCategory = res.data.record
          this.categoryList = res.data.Category
          this.categoryFlag = true
        }
      })
    },
    // ----------------------- 主页面类目 -----------------------
    choosedMainCatlog (item, index) {
      // 主目录中某一项设置为 true
      this.categoryList.forEach(topLevelItem => {
        if (item.id === topLevelItem.id) {
          topLevelItem.checked = true
        } else {
          topLevelItem.checked = false
        }
      })
      if (item.next) {
        item.categoryIndex = index
        this.levelOneCatlog = item
        this.isShowMainPage = false
        this.setCustomAttr(item.next)
        this.selectedSubCatlog = item.next
        this.tempSubList.push(item.next)
      } else {
        this.choosedSubCategory(item)
      }
    },
    // ----------------------- 历史记录 -----------------------
    choosedHistoryItem (item, index) {
      this.historyItem = item
      let { category, lastId, name } = item
      this.getBrandAndSku(category, lastId, name)
    },
    // ----------------------- 选中类目 -----------------------
    getSubCategory (item, index) {
      let { id } = item
      let currentList = this.tempSubList[index]
      currentList.forEach(tempItem => {
        if (tempItem.id === id) {
          tempItem.checked = true
        } else {
          tempItem.checked = false
        }
      })
      this.selectedSubCatlog = currentList
      this.tempSubList.splice(index + 1)
      this.subCategoryGuide.splice(index)
    },
    choosedSubCategory (item, index) {
      if (item.next) {
        this.setCustomAttr(item.next)
        item.categoryIndex = index
        if (item.level < 4) {
          this.subCategoryGuide.push(item)
          this.tempSubList.push(item.next)
          this.selectedSubCatlog = item.next
        } else {
          let arr = [...this.subCategoryGuide, item]
          this.handlerData(arr)
        }
      } else {
        let arr = [...this.subCategoryGuide, item]
        this.handlerData(arr)
      }
    },
    // 拼接选中类目数据
    handlerData (data) {
      let dataList
      let arr = []
      let str = ''
      // let name = ''
      let id
      let lastId
      if (this.isShowSelectedCat) {
        dataList = [this.levelOneCatlog, ...data]
      } else {
        dataList = data
      }
      dataList.forEach(item => {
        arr.push(item.id)
        str += `${item.name}》`
        // name = item.name
      })
      lastId = arr[arr.length - 1]
      id = arr.join()
      str = str.slice(0, str.length - 1)
      this.getBrandAndSku(id, lastId, str)
    },
    // 关闭选中类目
    closeSelectedList () {
      this.isShowMainPage = true
      this.levelOneCatlog = {}
      this.subCategoryGuide = []
      this.selectedSubCatlog = []
      this.tempSubList = []
    },
    // 设置选中目录列表中的 checked 属性
    setCustomAttr (data) {
      data.forEach(subItem => {
        subItem.checked = false
      })
    },
    // ----------------------- 搜索的数据 -----------------------
    searchedCatetoryData () {
      this.isShowMainPage = false
      this.isgetDataBySearch = true
      let url = 'goods/category'
      let obj = {
        keyword: this.searchedKeyWords
      }
      this.$http(url, obj).then(res => {
        if (!res.data) {
          this.searchedCatetory = []
          return
        }
        if (res.code === this.$ok) {
          this.searchedCatetory = res.data
        }
      })
    },
    choosedSearchItem (item, index) {
      this.searchedIndex = index
      this.searchedItem = item
      this.CATEGORY_ID(item.lastId)
      this.$emit('getCategory', item)
    },
    footerSubmit () {
      if (!this.preventMoreClick) return
      this.preventMoreClickEvent()
      let goodsId = this.$route.params.id
      if (goodsId && goodsId !== 0) {
        this.SET_EDIT_CATEGORY(goodsId)
      }
      let { id, lastId, name } = this.searchedItem
      this.getBrandAndSku(id, lastId, name)
    },
    // 类目返回
    headerBack () {
      this.isShowMainPage = true
      this.isgetDataBySearch = false
      this.searchedKeyWords = ''
    },
    // 获取品牌 id 以及规格
    getBrandAndSku (id, lastId, name) {
      if (!this.preventMoreClick) return
      this.preventMoreClickEvent()
      // 是否显示品牌
      let brandUrl = 'goods/brand'
      let brandObj = {
        categoryId: id
      }
      // 是否显示规格
      let skuUrl = 'goods/goodsSku'
      let skuObj = {
        categoryId: lastId
      }
      let getBrandData = new Promise(resolve => {
        this.$http(brandUrl, brandObj).then(res => {
          let brandArr = []
          if (res.code === this.$ok) {
            brandArr = res.data.sku.map(item => {
              item.require = res.data.require
              item.attrId = res.data.attrId
              item.custom = item.is_custom
              if (item.hasOwnProperty('attr_id')) delete item.attr_id
              if (!item.require) delete item.require
              delete item.is_custom
              return item
            })
          }
          tempBrandList.forEach((listItem, index, arr) => {
            brandArr.forEach(brandItem => {
              if (!brandItem.pinyin) {
                if (index === 0) {
                  arr[0].list.push(brandItem)
                }
              } else {
                if (brandItem.pinyin === listItem.categorySymbol) {
                  listItem.list.push(brandItem)
                }
              }
            })
          })
          for (var i = 0; i < tempBrandList.length; i++) {
            if (!tempBrandList[i].list.length) {
              tempBrandList.splice(i, 1)
              i--
            }
          }
          resolve(tempBrandList)
        })
      })
      let getSkuData = new Promise(resolve => {
        this.$http(skuUrl, skuObj).then(res => {
          resolve(res.data)
        })
      })
      Promise.all([getBrandData, getSkuData]).then(value => {
        this.$emit('getCategoryAndBrandAndSku', {
          cate: {name, id: lastId},
          historyItem: { name, id },
          brandListData: value[0] === null ? [] : value[0],
          specListData: value[1] === null ? [] : value[1]
        })
        this.$back()
      })
    },
    selectSubCategory () {
      if (!this.subCategoryGuide.length) return
      let width = 0
      let scrollWrapper = document.querySelector('.selected-subcategory-wrapper .scroll-content')
      const subcategoryItem = document.querySelectorAll('.subcategory-item')
      const choiceGuide = document.querySelector('.choice-guide')
      subcategoryItem.forEach(item => {
        width += item.clientWidth
      })
      width += choiceGuide.clientWidth + this.tabWidth
      scrollWrapper.style.width = width + 'px'
    },
    addNewCategoryItem () {
      if (this.$route.query.isEditNormalGoods) {
        this.$push({ name: 'CreateCategory', query: { isEditNormalGoods: 1 } })
        return
      }
      this.$push({ name: 'CreateCategory' })
    }
  },
  watch: {
    subCategoryGuide (val) {
      this.$nextTick(() => {
        this.selectSubCategory()
      })
    }
  }
  // beforeRouteLeave (to, from, next) {
  //   if (to.name === 'creat-goods') {
  //     tempBrandList = JSON.parse(JSON.stringify(brandList))
  //   }
  //   next()
  // }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.select-category-container
  z-index 2000!important
  > div.senior-popup-wrapper
    flex-col()
    background $color-body
  .select-category-wrapper
    flex 1
    flex-col()
    .select-wrapper
      background $color-white
    .lated-category-wrapper
      h3
        f12()
        padding-left 8px
        margin-bottom 14px
        color $color-orange
        border-left 3px solid $color-orange;/*no*/
      .seperate
        margin 0 -30px
        bd(#F5F5F5)
      .lated-category-list
        padding 16px 0
        li
          flex-f-align()
          padding 16px 0
          i
            width 28px
            height 30px
            bg('icon-time.png')
            margin-right 8px
          span
            f12()
            color $color-3
            line-height 34px
      .lated-seperate
        height 20px
        margin 0 -30px
        background $color-f4
    .select-scroll
      flex 1
      background $color-body
      overflow hidden
      > div
        background $color-white
        padding 0 30px
      .category-item
        .item
          height 100px
          flex-f-align()
          f14()
          color $color-3
          bd-b(#F5F5F5, 2px)
          &:last
            border none
          &.active
            color $color-orange
      .add-new-category
        height 100px
        color $color-orange
        f14()
        line-height 100px
        flex-align-item()
        p
          flex 1
          position relative
          &:after
            content ''
            position absolute
            right 0
            top 50%
            transform translateY(-50%) scale(.5)
            width 1px;/*no*/
            height 128px
            background-color $color-c
        a
          width 240px
          tc()
          color $color-orange
          i
            display inline-block
            font-style normal
            fz(30px)
            vertical-align top
  .category-catlog-container
    flex 1
    flex-col()
    background $color-body
    .category-catlog-wrapper
      height 100%
      flex-col()
    .selected-category-title
      height 100px
      flex-align-item()
      f14()
      color $color-3
      padding 16px 30px
      background $color-white
      i
        box-sizing content-box
        wh(26px)
        padding 20px
        margin-right -20px
        bg('icon-close.png')
        background-origin content-box
        background-clip content-box
    .selected-subcategory-wrapper
      width 100%
      f14()
      height 60px
      overflow hidden
      color $color-orange
      background $color-white
      bd-b($color-orange)
      .scroll-content
        .item
          display inline-block
        .subcategory-item
          padding 15px 0
          padding-left 10px
        .choice-guide
          width 160px
          height 60px
          line-height 60px
          tc()
          color $color-white
          background $color-orange
          border-top-left-radius 6px
          border-top-right-radius 6px
          &.active
            margin-left 24px
    .scroll-subcategory
      flex 1
      // height 85%
      overflow hidden
      .scroll-content
        padding 0 30px
        background $color-white
    .subcategory-list
      li
        height 100px
        flex-f-align()
        f12()
        color $color-3
        span
          margin-right 28px
        i
          width 32px
          height 26px
          bg('icon-checked.png')
        &.active
          color $color-orange
  .category-search-container
    flex 1
    flex-col()
    .select-category-search
      padding 28px 30px
      background $color-white
      .icon-search
        left 66px
      input
        padding-right 60px
    .seperate
      height 20px
      background #F4F4F4
    .category-search-wrapper
      flex 1
      flex-col()
    .scroll-search
      flex 1
      overflow hidden
      > div
        background $color-white
    .searched-item-list
      li
        flex-align-item()
        padding 0 30px
        height 100px
        bd-b(#dfdfdf)
        f14()
        color $color-6
        &:last-child
          border none
        &.active
          color $color-orange
        i
          wh(40px)
          bg('icon-selected.jpg')
    .category-search-no-data
      padding-top: 33px
      padding-left: 52px
      h2
        font-size: 28px;/*px*/
        color: $color-6
        padding-bottom: 60px
      p
        font-size: 26px;/*px*/
        color: $color-9 
      .txt
        padding-top: 15px
    .cgs-footer-container
      &.no-choiced
        pointer-events none
        background #bcbcbc!important
  .select-category-search
    padding 28px 0
    flex-align-item()
    f14()
    position relative
    .icon-search
      position absolute
      width 40px
      height 36px
      bg('icon-search.png')
      top 50%
      left 36px
      transform translateY(-50%)
    input
      height 80px
      flex 1
      color $color-9
      background #EBEBEB
      border-radius(100px)
      padding-left 100px
    span
      color $color-orange
      padding 20px
    .icon-clear
      position absolute
      box-sizing content-box
      wh(32px)
      bg('icon-clear.png')
      background-origin content-box
      background-clip content-box
      padding 10px
      margin-right -10px
      top 50%
      right 150px
      transform translateY(-50%)
      z-index 10
  .p-30
    padding 0 30px
</style>
