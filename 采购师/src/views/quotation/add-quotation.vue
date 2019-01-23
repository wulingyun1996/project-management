<template>
  <div class="iphone-x-container" v-if="loading" style="height: 100%;">
    <div style="height: 100%;" v-if="quotation.length" class="quotation">
      <header ref="header">
        <div class="arrow-left" @click="$router.go(-1)">
          <img src="./images/arrow_left.png" alt=''>
        </div>
        <div class="title">
          购物车({{ total.totalAmount }})
        </div>
      </header>
      <Scroll class="add-quatation-scroll" @scrollToEnd="getData" :hasMore="hasMore" :pullup="true" :pulldown="true">
        <quotation-item
          :item="item" v-for="(item, index) in quotation"
          :key="index"
          @selectShop="selectShop"
          @selectGood="selectGood"
          @selectKind="selectKind"
          @reduce="reduce"
          @add="add"
          @jump="jump"
          >
        </quotation-item>
      </Scroll>
      <footer>
        <add @checkAll="selectAll" @addQuotation="addQuotation" :totalNumber="total.totalNumber" :totalKinds="total.totalKinds" :isCheckAll="isCheckAll"></add>
      </footer>
    </div>
    <div v-if="!quotation.length" style="height: 100%" class="no-quotation">
      <header>
        <div class="arrow-left" @click="$router.go(-1)">
          <img src="./images/arrow_left.png" alt=''>
        </div>
        <div class="title" style="color: #000;">
          购物车
        </div>
        <div class="build">
          <span style="color: #000;" @click="toggleManage">管理</span>
        </div>
      </header>
      <div class="quotation-no-data">
        <img src="./images/empty-cart.png" alt="">
        <p>
          把商品加入购物车，不仅方便自购结算，
          还可快速制作报价单分享给您的业主们，
          赶快行动吧！
        </p>
        <!-- <div class="quotation-button" @click="goHome">去逛逛</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import delItem from './del'
import add from './add'
import checkAll from './checkAll'
import quotationItem from './quotation-item'
import Scroll from 'components/scroll/scroll'
import { mixins, removeUnselect, isSelectArr, calcTotal, formatArr } from './mixins'
import { invokeNativeMethod } from 'native'
let selectArr = []
export default {
  components: {
    Scroll,
    checkAll,
    quotationItem,
    delItem,
    add
  },
  data () {
    return {
      isCheckAll: false,
      quotation: [],
      page: 0,
      pageSize: 10,
      hasMore: true,
      loading: false,
      selectArr: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getData(from.path)
    })
  },
  mixins: [mixins],
  methods: {
    addQuotation () {
      if (!this.isSelect) {
        this.$t('请选择商品')
        return
      }
      removeUnselect(this.quotation)
      // 购物车入口添加报价单
      sessionStorage.quotation = JSON.stringify([...this.quotation, ...selectArr])
      // 报价单管理列表添加报价单
      sessionStorage.editQuotation = JSON.stringify([...this.quotation, ...selectArr])
      this.$router.back()
    },
    getData (path) {
      // 判断是否从编辑报价单页面跳转过来的
      let isFromEditQuotation = path === '/edit-quotation'
      if (isFromEditQuotation) {
        selectArr = sessionStorage.editQuotation ? JSON.parse(sessionStorage.editQuotation) : []
      } else {
        selectArr = sessionStorage.quotation ? JSON.parse(sessionStorage.quotation) : []
      }
      if (!this.hasMore) return
      const self = this
      this.page++
      this.$http('cart/getCartList', {
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = true
        if (res.code === 200) {
          const arr = formatArr(res.data.list.data, self)
          if (arr.length < 10) {
            this.hasMore = false
          }
          this.quotation = this.quotation.concat(arr)
          // 只能根据 good_id 和 spec_key 来移除，用 id 来判断不准确，因为 该 id 为报价单 id，并非规格 id
          this.removeExisted(selectArr, this.quotation)
        } else {
          this.$t(res.message)
        }
      })
    },
    // 判断数组中间是否存在和item.id一样的
    checkResult (item, arr) {
      if (arr.length === 0) return -1
      for (let i = 0; i < arr.length; i++) {
        if (item.goods_id === arr[i].goods_id) {
          return i
        }
      }
      return -1
    },
    toggleManage () {
      this.$router.push({path: '/quotation-list'})
    },
    // 制作报价单页面跳转 --- 去除已选择的商品
    splitSelect (arr, quotation) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].goodsInfo.length; j++) {
          for (let k = 0; k < arr[i].goodsInfo[j].kinds.length; k++) {
            this.splitById(arr[i].goodsInfo[j].kinds[k], quotation)
          }
        }
      }
    },
    // 制作报价单页面跳转 --- 根据id去除已选择的商品
    splitById (item, arr) {
      for (let i = arr.length - 1; i > -1; i--) {
        for (let j = arr[i].goodsInfo.length - 1; j > -1; j--) {
          for (let k = arr[i].goodsInfo[j].kinds.length - 1; k > -1; k--) {
            if (arr[i].goodsInfo[j].kinds[k].id === item.id) {
              arr[i].goodsInfo[j].kinds.splice(k, 1)
            }
          }
          if (arr[i].goodsInfo[j].kinds.length === 0) {
            arr[i].goodsInfo.splice(j, 1)
          }
        }
        if (arr[i].goodsInfo.length === 0) {
          arr.splice(i, 1)
        }
      }
    },
    // 编辑报价单页面跳转 --- 去除已选择的商品
    removeExisted (arr, quotation) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].goodsInfo.length; j++) {
          for (let k = 0; k < arr[i].goodsInfo[j].kinds.length; k++) {
            this.splitBySpecKey(arr[i].goodsInfo[j].kinds[k], arr[i].goodsInfo[j].goods_id, quotation)
          }
        }
      }
    },
    // 编辑报价单页面跳转 --- 根据 spec_key 和 goods_id 去除已选择的商品
    splitBySpecKey (item, goodsId, arr) {
      for (let i = arr.length - 1; i > -1; i--) {
        for (let j = arr[i].goodsInfo.length - 1; j > -1; j--) {
          for (let k = arr[i].goodsInfo[j].kinds.length - 1; k > -1; k--) {
            if (arr[i].goodsInfo[j].kinds[k].spec_key === item.spec_key && arr[i].goodsInfo[j].goods_id === goodsId) {
              arr[i].goodsInfo[j].kinds.splice(k, 1)
            }
          }
          if (arr[i].goodsInfo[j].kinds.length === 0) {
            arr[i].goodsInfo.splice(j, 1)
          }
        }
        if (arr[i].goodsInfo.length === 0) {
          arr.splice(i, 1)
        }
      }
    },
    // 跳转
    jump (item) {
    },
    // 增加
    add (kind) {
      kind.count++
    },
    reduce (kind) {
      if (kind.count === 1) return
      kind.count--
    },
    // 增加或者减少商品数量的时候请求接口
    editCurrentGoods (kind) {
      let url = 'cart/editCart'
      let obj = {
        id: kind.id,
        goods_num: kind.count
      }
      this.$http(url, obj)
    },
    // 回首页
    goHome () {
      invokeNativeMethod('nativeGoHomeNormalTab', 0)
    }
  },
  computed: {
    isSelect () {
      return isSelectArr(this.quotation)
    },
    total () {
      return calcTotal(this.quotation)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2)
  .iphone-x-container
    padding-top 10px;/*no*/
    background #FFF
@media (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3)
  .iphone-x-container
    padding-top 20px;/*no*/
    background #FFF
.quotation
  height 100%
  background #F4F4F4
  flex-col()
  .add-quatation-scroll
    flex 1
  .placerholder
    height 88px
header
  background #FFF
  height 88px
  display flex
  align-items center
  border-bottom 1px solid #DEDEDE;/*no*/
  .arrow-left
    height 100%
    margin-left 30px
    display flex
    align-items center
    img
      width  24px
      height 40px
  .title
    font-size 36px
    margin-left calc(50% - 54px)
    transform translateX(-50%)
  .build
    display flex
    align-items center
    font-size 28px
    color #CCC
    margin-right 28px
    flex-grow 1
    justify-content flex-end
    span:last-child
      margin-left 20px
.no-quotation
  height 100%
  overflow hidden
  >img
    width 270px
    height 284px
    display block
    margin 152px auto 0
  p
    color #999
    font-size 28px
    margin-top 64px
    text-align center
  .quotation-no-data
    margin-top 80px
    img
      display block
      width 220px
      height 240px
      margin 0 auto 46px
    p
      fz(15px)
      color $color-9
      line-height 46px
      padding 0 104px
      margin-bottom 46px
      tc()
    .quotation-button
      width 220px
      height 70px
      line-height 70px
      color $color-orange
      bd($color-orange)
      tc()
      f14()
      border-radius(100px)
      margin 0 auto
footer
  height 98px
  background #FFF
  .btn-area
    display flex
    height 98px
    font-size 36px
    .make
      width 470px
      border-top 1px solid #E4E4E4;/*no*/
      display flex
      align-items center
      justify-content center
      img
        width 50px
        height 50px
      span
        color #4A90E2
        margin-left 10px
    .calc
      background: #FF8A00
      display flex
      align-items center
      justify-content center
      flex 1
      color #FFF
</style>
