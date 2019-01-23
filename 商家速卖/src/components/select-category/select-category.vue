<template>
  <div id="select-box">
    <div class="search-box">
      <input type="text" placeholder="请输入类目名称检索" v-model="keyword" />
      <label @click="Search">搜索</label>
    </div>
    <div class="content">
      <!-- 无数据 -->
      <div class="no-search" v-show="isSearch">
        <h2>没有搜索到相关类目！</h2>
        <p>原因可能是：</p>
        <p class="txt">关键词输入不够准确，请尝试修改。</p>
      </div>
      <!-- 有数据 -->
      <scroll ref="scroll" class="scroll-content">
        <div>
          <div class="have-search" v-show="isData" v-for="(item, index) in Searchlist">
            <div class="wire" @click="typeClick(item, index)">
              <div class="type" :class="{'active': currentIndex === index}">
                <span :class="{'active': currentIndex === index}">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="category-confirm" @click="sendParams" :class="{active: isActive}" v-show="isConfirm">确定</div>
  </div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { loadData, STATUS_OK } from 'api/common'
import { mapMutations } from 'vuex'
let tempBrandList = [
  {
    categoryLevel: '店铺品牌',
    categorySymbol: '店铺品牌',
    shopBrand: 1,
    list: []
  },
  {
    categoryLevel: 'A',
    categorySymbol: 'A',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'B',
    categorySymbol: 'B',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'C',
    categorySymbol: 'C',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'D',
    categorySymbol: 'D',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'E',
    categorySymbol: 'E',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'F',
    categorySymbol: 'F',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'G',
    categorySymbol: 'G',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'H',
    categorySymbol: 'H',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'I',
    categorySymbol: 'I',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'J',
    categorySymbol: 'J',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'K',
    categorySymbol: 'K',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'L',
    categorySymbol: 'L',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'M',
    categorySymbol: 'M',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'N',
    categorySymbol: 'N',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'O',
    categorySymbol: 'O',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'P',
    categorySymbol: 'P',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Q',
    categorySymbol: 'Q',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'R',
    categorySymbol: 'R',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'S',
    categorySymbol: 'S',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'T',
    categorySymbol: 'T',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'U',
    categorySymbol: 'U',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'V',
    categorySymbol: 'V',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'W',
    categorySymbol: 'W',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'X',
    categorySymbol: 'X',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Y',
    categorySymbol: 'Y',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Z',
    categorySymbol: 'Z',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: '#',
    categorySymbol: '~',
    shopBrand: 0,
    list: []
  }
]
let brandList = JSON.parse(JSON.stringify(tempBrandList))
export default {
  data() {
    return {
      isActive: false,
      keyword: '',
      Searchlist: [],
      isSearch: false,
      isData: false,
      currentIndex: '',
      hasMore: false,
      postId: '',
      postName: '',
      isConfirm: false,
      lastId: ''
    }
  },
  methods: {
    sendParams() {
      if (this.$route.params.id && this.$route.params.id !== 0) {
        this.SET_EDIT_CATEGORY(this.$route.params.id)
      }
      // 是否显示品牌
      let URL = 'goods/brand'
      let obj = {
        categoryId: this.postId
      }
      // 是否显示规格
      let URLTWO = 'goods/goodsSku'
      let objTwo = {
        categoryId: this.lastId
      }
      let promise1 = new Promise((resolve) => {
        loadData(URL, obj).then((res) => {
          let brandArr = []
          if (res.code === STATUS_OK) {
            // this.BRANDSHOW(true)
            brandArr = res.data.sku.map((item) => {
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
      let promise2 = new Promise((resolve) => {
        loadData(URLTWO, objTwo).then((res) => {
          resolve(res.data)
        })
      })
      Promise.all([promise1, promise2]).then((value) => {
        this.$emit('emitCateInfo', {
          cate: {name: this.postName, id: this.lastId},
          brandListData: value[0] === null ? [] : value[0],
          specListData: value[1] === null ? [] : value[1]
        })
        this.$router.back()
      })
    },
    typeClick(value, index) {
      this.currentIndex = index
      this.isActive = true
      this.postId = value.id
      this.CATEGORY_ID(value.lastId)
      this.postName = value.name
      this.lastId = value.lastId
      this.$emit('getCategory', value)
    },
    Search() {
      let URL = 'goods/category'
      let obj = {
        keyword: this.keyword
      }
      loadData(URL, obj).then((res) => {
        if (res.data === null) {
          this.isSearch = true
          this.isData = false
        } else if (res.code === STATUS_OK) {
          this.Searchlist = res.data
          this.isSearch = false
          this.isData = true
          this.isConfirm = true
        }
      })
    },
    ...mapMutations(['CATEGORY', 'CATEGORY_ID', 'GOODSSPEC', 'BRANDSKU', 'SKUSHOW', 'SET_EDIT_CATEGORY'])
  },
  components: {
    Scroll
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'creat-goods') {
      tempBrandList = JSON.parse(JSON.stringify(brandList))
    }
    next()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    background: $color-white
  #select-box
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    background: $color-white
    .search-box
      display: flex
      background: $color-df
      position: relative
      height: 114px;/*px*/
      padding: 18px 0 20px 33px
      input
        flex: 1
        height: 75px;/*px*/
        padding: 20px 0
        background: $color-white
        border-radius: 10px
        padding-left: 20px
        font-size: 28px;/*px*/
        color: $color-6
      input::-webkit-input-placeholder
        font-size: 28px;/*px*/
        color: $color-bc
      label
        display: block
        padding: 0 25px 0 20px
        line-height: 75px;/*px*/
        font-size: 26px;/*px*/
        color: $color-6
    .content
      position: absolute
      top: 115px;/*px*/
      bottom: 94px;/*px*/
      width: 100%
      .scroll-content
        height: 100%
        overflow: hidden
      .have-search:last-child
        .wire:after
          display: none
    .content>.no-search
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
    .content .wire
      border-btm()
      .type
        padding: 32px 132px 34px 52px
        &.active
          background: url('gou.jpg') no-repeat 95% center
          background-size: 40px 40px;/*px*/
        span
          display: inline-block
          font-size: 28px;/*px*/
          color: $color-6
          line-height: 40px;/*px*/
          &.active
            color: $color-orange
    .category-confirm
      position :fixed
      bottom :0
      left :0
      right: 0
      height: 94px;/*px*/
      line-height: 94px;/*px*/
      text-align :center
      background : $color-bc
      font-size :36px;/*px*/
      color: $color-white
      pointer-events none
      &.active
        background: $color-orange
        pointer-events auto
</style>  
