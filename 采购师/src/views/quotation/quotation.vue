<template>
  <transition name="has-data">
    <div class="quotation " v-if="isFirstEnterQuotation">
      <div class="iphone-x-container quotation-wrapper" style="height: 100%;" v-if="quotation.length > 0 || invalidQuotation.length > 0" >
        <header ref="header">
          <div class="arrow-left" @click="back">
            <img src="./images/arrow_left.png" alt="">
          </div>
          <div class="title">
            购物车 ({{ total.totalAmount }})
          </div>
          <div class="build" :class="{active: isSelect}" @click="showDeletePopup">
            <span :class="{active: isSelect}"></span>
            <span>删除</span>
          </div>
        </header>
        <Scroll class="qutation-scroll" @scrollToEnd="getData" :pullup="true" :pulldown="true" :hasMore="hasMore" :data="quotation" style="background: #F4F4F4;">
          <quotation-item
            :item="item" v-for="(item, index) in quotation"
            :key="index"
            :index="index"
            :goodsArr="goodsArr"
            @selectShop="selectShop"
            @selectGood="selectGood"
            @selectKind="selectKind"
            @reduce="reduce"
            @add="add"
            @valid="valid"
            >
          </quotation-item>
          <div class="invalid" v-if="!hasMore && invalidQuotation.length > 0">
            <div class="header">
              <span>失效商品（{{invalidQuotation.length}}）</span>
              <span @click="showModule = true">清除全部失效商品</span>
            </div>
            <div v-for="(item, index) in invalidQuotation" :key="index" class="item" @click="$router.push({path: '/goods-detail', query: {goodsId: item.goods_id}})">
              <span>失效</span>
              <div>
                <img :src="item.goods_img" alt="">
                <div class="right">
                  <div>{{item.goods_name}}</div>
                  <div>
                    <span>{{item.title}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scroll>
        <footer>
          <check-all
            :title="'合计'"
            :isCheckAll="isCheckAll"
            :totalPrice="total.totalPrice"
            :totalCommission="total.totalCommission"
            :totalKinds="total.totalKinds"
            :totalNumber="total.totalNumber"
            @checkAll="selectAll">
          </check-all>
          <div class="btn-area">
            <div class="make" @click="makeQuotation">
              <img src="./images/add.png" alt="">
              <span>新建报价单</span>
            </div>
            <div class="calc" @click="calc">
              <span>自购结算</span>
              <span>(可省: ￥{{ total.totalSavedMoney | retainTwoDecimal }})</span>
            </div>
          </div>
        </footer>
      </div>
      <div v-if="!quotation.length" style="height: 100%" class="iphone-x-container no-quotation quotation-wrapper">
        <header>
          <div class="arrow-left" @click="back">
            <img src="./images/arrow_left.png" alt="">
          </div>
          <div class="title" style="color: #000;">
            购物车 (0)
          </div>
          <div class="build">
            <!-- <span style="color: #000;" @click="toggleManage">管理</span> -->
          </div>
        </header>
        <div class="quotation-nav" @click="toggleManage">
          <img src="./images/qutation-list-nav.png" alt="">
          <h2>点我进入报价单管理</h2>
        </div>
        <div class="quotation-seperat"></div>
        <div class="quotation-no-data">
          <img src="./images/empty-cart.png" alt="">
          <p>
            把商品加入购物车，不仅方便自购结算，
            还可快速制作报价单分享给您的业主们，
            赶快行动吧！
          </p>
          <div class="quotation-button" @click="goHome">去逛逛</div>
        </div>
      </div>
      <transition name="fade">
        <div class="mask" v-show="showModule">
          <div class="module" v-show="showModule">
            <div class="title">是否清除所有失效商品</div>
            <div class="btn">
              <span @click="confirm">确定</span>
              <span @click="showModule = false">取消</span>
            </div>
          </div>
        </div>
      </transition>
      <div class="delete-popup-container" v-show="isShowDeletePopup">
        <div class="delete-popup-wrapper">
          <img src="./images/trash.png" alt="">
          <p>是否确定删除选中的商品？</p>
          <div class="delete-button">
            <div class="cancle-button" @click="hideDeletePopup">取消</div>
            <div class="comfirm-button" @click="deleteQuotation">确定</div>
          </div>
        </div>
      </div>
      <div class="quotation-tips-popup" v-if="isShowQuotationTips">
        <div class="tips-wrapper">
          <div class="tips-header">
            <i class="header-icon-left"></i>
            <span>少于起批量提示</span>
            <i class="header-icon-right"></i>
          </div>
          <base-scroll :has-more="true" class="tips-body">
            <ul class="tips-list">
              <li
                class="tips-item"
                v-for="(shopItem, shopIndex) in noEnoughQuotation"
                :key="shopIndex"
                >
                <h2>
                  <i></i>
                  <span>{{ shopItem.shop_name }}</span>
                </h2>
                <ul class="goods-list">
                  <li
                    class="goods-item"
                    v-for="(goodsItem, goodsIndex) in shopItem.goodsInfo"
                    :class="{ 'no-border': goodsIndex === shopItem.goodsInfo.length - 1 }"
                    :key="goodsIndex">
                    <span class="goods-name">[{{ goodsItem.goods_name }}]</span>
                    <span class="tips-text">起批量不能少于{{ goodsItem.buy_number }}{{ goodsItem.goods_unit }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </base-scroll>
          <div class="tips-bottom" @click="hideQuotationTips">知道了</div>
        </div>
      </div>
      <div class="quotation-guide" ref="quotationGuide" @click="toggleManage"></div>
    </div>
  </transition>
</template>

<script>
import delItem from './del'
import checkAll from './checkAll'
import quotationItem from './quotation-item'
import Scroll from 'components/scroll/scroll'
import { mixins, removeUnselect, isSelectArr, calcTotal, totalNum } from './mixins'
import { createDragTouch, retainTwoDecimal } from 'common'
import { invokeNativeMethod, closeWebview } from 'native'
export default {
  mixins: [mixins],
  data () {
    return {
      isFirstEnterQuotation: false,
      isCheckAll: false,
      quotation: [],
      page: 0,
      pageSize: 10,
      hasMore: true,
      amount: 0,
      invalidQuotation: [],
      showModule: false,
      isShowDeletePopup: false,
      // 购物车少于最小起批量的数据
      isShowQuotationTips: false,
      noEnoughQuotation: [],
      goodsArr: [],
      sum: 0
    }
  },
  computed: {
    fromNative () {
      return !!this.$route.query.isFromNative
    },
    isSelect () {
      return isSelectArr(this.quotation)
    },
    total () {
      return calcTotal(this.quotation)
    }
  },
  created () {
    window.viewDidAppear = this.correctBack
    // 如果是从原生跳转，将该状态记录起来，保存在根实例上
    if (this.fromNative) this.$root.fromNative = this.fromNative
    this.getData()
  },
  methods: {
    correctBack () {
      invokeNativeMethod('setNavigationBarHidden', 1)
    },
    back () {
      // 从根实例上预取是否是从原生跳转过来的判断，如果存在，关闭 webview，否则回退上一级
      let isFromNative = this.$root.fromNative
      if (isFromNative) {
        closeWebview()
        return
      }
      this.$router.back()
    },
    // 清除失效商品
    confirm () {
      let str = ''
      for (let i = 0; i < this.invalidQuotation.length; i++) {
        str += this.invalidQuotation[i].id + ','
      }
      this.$http('cart/delCart', {id: str.substr(0, str.length - 1)})
      this.invalidQuotation = []
      this.showModule = false
    },
    getData () {
      if (!this.hasMore) return
      let url = 'cart/getCartList'
      let obj = {
        page: ++this.page,
        pageSize: this.pageSize
      }
      this.$http(url, obj).then(res => {
        if (res.code === 200) {
          this.goodsArr = res.data.list.data
          const arr = this.formatArr(res.data.list.data)
          this.amount = res.data.goodsTotal
          if (arr.length < 10) {
            this.hasMore = false
          }
          this.quotation = this.quotation.concat(arr)
        } else {
          this.$t(res.message)
        }
        this.isFirstEnterQuotation = true
        this.selectedAll()
      })
    },
    formatArr (data) {
      data.map(i => {
        const arr = []
        this.$set(i, 'checked', this.isCheckAll)
        this.$set(i, 'shopName', i.shop_name)
        this.$set(i, 'seller_id', i.seller_id)
        this.$set(i, 'shop_id', i.shop_id)
        i.goodsInfo.map(j => {
          /* eslint-disable */
          let { flag, id, goods_id, goods_name, goods_type, image_path,buy_number, purchased, goods_num, freight,
                is_stock_good, boutique, material, intervalPrice, price_type, purchase_price, promotion_price, max_price,
                price, svip_price, title, goods_unit, one_discount, identity, spec_key, created_at, updated_at } = j
          this.$set(i, 'freight', freight)
          if (flag === 1) {
            let index = this.checkResult(j, arr)
            if (index === -1) {
              arr.push({
                goods_id,
                goods_name,
                goods_type,
                is_stock_good,
                boutique,
                material,
                intervalPrice,
                price_type,
                goods_img: image_path,
                created_at,
                updated_at,
                buy_number: buy_number - purchased - goods_num > 0 ? buy_number - purchased - goods_num : buy_number,
                checked: this.isCheckAll,
                kinds: [
                  {
                    id,
                    flag,
                    purchase_price,
                    promotion_price,
                    price,
                    title,
                    goods_unit,
                    one_discount,
                    svip_price,
                    identity,
                    max_price,
                    spec_key,
                    count: goods_num,
                    checked: this.isCheckAll
                  }
                ]
              })
            } else {
              arr[index].kinds.push({
                id,
                flag,
                purchase_price,
                promotion_price,
                price,
                title,
                one_discount,
                svip_price,
                identity,
                max_price,
                goods_unit,
                spec_key,
                count: goods_num,
                checked: this.isCheckAll
              })
            }
          } else {
            this.invalidQuotation.push({
              id,
              goods_id,
              flag,
              goods_name,
              title,
              goods_img: image_path
            })
          }
        })
        /* eslint-enable */
        i.goodsInfo = arr
      })
      for (let i = data.length - 1; i > -1; i--) {
        if (data[i].goodsInfo.length === 0) {
          data.splice(i, 1)
        }
      }
      return data
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
      this.$router.push({path: '/quotation-list?isFromCart=1'})
    },
    toggleDel () {
      this.$router.push({path: '/quotation-del'})
    },
    // 删除报价单弹窗
    showDeletePopup () {
      this.isShowDeletePopup = true
    },
    hideDeletePopup () {
      this.isShowDeletePopup = false
    },
    // 删除报价单
    deleteQuotation () {
      if (!this.isSelect) return
      let str = ''
      this.quotation.map(i => {
        i.goodsInfo.map(j => {
          j.kinds.map(k => {
            if (k.checked) {
              str += k.id + ','
            }
          })
        })
      })
      str = str.substr(0, str.length - 1)
      let url = 'cart/delCart'
      let obj = {
        id: str
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$t('删除成功')
          this.hideDeletePopup()
          removeUnselect(this.quotation, true)
          return
        }
        this.$t(res.message)
      })
    },
    // 制作报价单
    makeQuotation () {
      if (!this.isSelect) {
        this.$t('请选择商品')
        return
      }
      removeUnselect(this.quotation)
      sessionStorage.quotation = JSON.stringify(this.quotation)
      this.$router.push({path: '/make-quotation'})
    },
    // 提交订单
    calc () {
      if (!this.isSelect) {
        this.$t('请选择商品')
        return
      }
      if (!this.isEnough()) return
      removeUnselect(this.quotation)
      sessionStorage.order = JSON.stringify(this.quotation)
      this.$router.push({path: '/order'})
    },
    isEnough () {
      for (let i = 0; i < this.quotation.length; i++) {
        let quotation = {}
        quotation.shop_name = this.quotation[i].shop_name
        quotation.goodsInfo = []
        for (let j = 0; j < this.quotation[i].goodsInfo.length; j++) {
          let obj = {}
          obj.goods_name = this.quotation[i].goodsInfo[j].goods_name
          obj.buy_number = this.quotation[i].goodsInfo[j].buy_number
          for (let k = 0; k < this.quotation[i].goodsInfo[j].kinds.length; k++) {
            // 选中统计
            if (this.quotation[i].goodsInfo[j].kinds[k].checked) {
              // 非区间商品统计
              if (this.quotation[i].goodsInfo[j].goods_type !== 1) {
                let total = totalNum(this.quotation[i].goodsInfo[j].kinds)
                if (total < this.quotation[i].goodsInfo[j].buy_number) {
                  obj.goods_unit = this.quotation[i].goodsInfo[j].kinds[k].goods_unit
                  quotation.goodsInfo.push(obj)
                }
              }
            }
          }
        }
        if (quotation.goodsInfo.length) this.noEnoughQuotation.push(quotation)
      }
      if (this.noEnoughQuotation.length) {
        this.isShowQuotationTips = true
        return false
      }
      return true
    },
    hideQuotationTips () {
      this.isShowQuotationTips = false
      this.noEnoughQuotation = []
    },
    valid (kind, good) {
      if (!/^[1-9][0-9]*$/.test(kind.count) || !kind.count) {
        kind.count = 1
      } else {
        if (good.goods_type === 1) {
          if (kind.count > good.buy_number) {
            kind.count = good.buy_number
          }
        }
      }
    },
    // 增加单项商品的数量
    add (kind, index, goodIndex, kindIndex) {
      kind.count++
      this.editCurrentGoods(kind)
    },
    // 减少单项商品的数量
    reduce (kind, index, goodIndex, kindIndex) {
      if (kind.count === 1) return
      kind.count--
      this.editCurrentGoods(kind)
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
    goHome () {
      invokeNativeMethod('nativeGoHomeNormalTab', 0)
    },
    // 进入页面实现全选功能
    selectedAll () {
      this.$nextTick(function () {
        this.goodsArr.forEach(item => {
          if (item.checked) {
            this.sum = this.sum + 1
          }
        })
        if (this.sum === this.goodsArr.length && this.goodsArr.length !== 0) {
          this.isCheckAll = true
        } else {
          this.isCheckAll = false
        }
      })
    }
  },
  watch: {
    isFirstEnterQuotation () {
      this.$nextTick(() => {
        createDragTouch(this.$refs.quotationGuide, { edgeDis: 100 })
      })
    }
  },
  filters: {
    retainTwoDecimal
  },
  components: {
    Scroll,
    checkAll,
    quotationItem,
    delItem
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
    height 100%
@media (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3)
  .iphone-x-container
    padding-top 20px;/*no*/
    background #FFF
    height 100%
.quotation
  height 100%
.quotation-wrapper
  flex-col()
  .quotation-nav
    height 180px
    flex-align-item()
    justify-content center
    img
      wh(100px)
      position relative
    h2
      width 480px
      height 80px
      line-height 80px
      f14()
      background $color-body
      color $color-orange
      text-indent 5em
      margin-left -100px
      border-radius(100px)
  .quotation-seperat
    height 10px
    background $color-f5
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
header
  height 88px
  flex-align-item()
  position relative
  bd-b($color-de)
  background #fff
  position relative
  .arrow-left
    height 100%
    padding 0 30px
    display flex
    align-items center
    img
      width  24px
      height 40px
  .title
    font-size 36px
    position absolute
    left 50%
    transform translateX(-50%)
  .build
    flex-f()
    align-items center
    font-size 28px
    color $color-6
    margin-right 28px
    flex-grow 1
    justify-content flex-end
    pointer-events none
    &.active
      pointer-events auto
      color $color-orange
    span:first-child
      width 30px
      height 40px
      bg('delete-icon.png')
      &.active
        bg('delete-active.png')
    span:last-child
      margin-left 8px
.qutation-scroll
  flex 1
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
footer
  width 100%
  height 216px
  .btn-area
    display flex
    height 98px
    f18()
    .make
      width 50%
      display flex
      align-items center
      justify-content center
      color $color-white
      background-image linear-gradient(90deg, #EDBF62, #EC3800)
      margin-right 1px;/*no*/
      img
        width 28px
        height 28px
      span
        margin-left 10px
    .calc
      width 50%
      background #D0021B
      display flex
      align-items center
      justify-content center
      color #FFF
      flex-direction column
      span:first-child
        margin-bottom 10px
      span:last-child
        margin-bottom -10px
        f11()
.invalid
  .header
    display flex
    justify-content space-between
    padding 32px 28px 28px 40px
    border-bottom 1px solid #DEDEDE;/*no*/
    background #FFF
    span
      font-size 28px
      line-height 40px
      color #000
    span:last-child
      color #FF8A00
  .item
    display flex
    align-items center
    border-bottom 1px solid #DEDEDE;/*no*/
    padding 22px 28px 18px 18px
    background #FFF
    >span
      background #cccccc
      color #fff
      border-radius 30px
      width 70px
      height 36px
      line-height 36px
      text-align center
    >div
      display flex
      flex 1
      margin-left 12px
      img
        width 140px
        height 140px
        margin-right 22px
  .right
    flex 1
    color #9B9B9B
    >div:first-child
      font-size 28px
      line-height 40px
    >div:last-child
      font-size 24px
      line-height 34px
      margin-top 18px
      span margin-right 10px
      background #F8F8F8
.mask
  position fixed
  width 100%
  height 100%
  left 0
  top 0
  background rgba(0, 0, 0, .4)
  opacity 1
  z-index 5
.fade-enter-active, .fade-leave-active
  transition: opacity .8s
.fade-enter, .fade-leave-to
  opacity: 0
.module
  z-index 6
  position fixed
  background #FFF
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 540px
  height 280px
  border-radius 24px
  opacity 1
  .title
    font-size 32px
    color #646464
    text-align center
    margin-top 80px
  .btn
    display flex
    margin-top 56px
    justify-content center
    span
      width 160px
      height 56px
      text-align center
      line-height 56px
      font-size 28px
      color #FF8A00
      border-radius 10px
    span:first-child
      color #ffffff
      background #FF8A00
    span:last-child
      margin-left 36px
      border 1px solid #FF8A00;/*no*/
.no-border
 border none!important
.delete-popup-container
  pf(100%)
  left 0
  top 0
  background rgba(0, 0, 0, .7)
  .delete-popup-wrapper
    position absolute
    background $color-white
    width 540px
    height 330px
    border-radius(16px)
    top 28%
    left 14%
    tc()
    img
      display block
      width 100px
      height 112px
      margin 36px auto 10px
    p
      fz(13px)
      line-height 36px
      color $color-4a
      margin-bottom 40px
    .delete-button
      flex-align-item()
      justify-content center
      .comfirm-button,
      .cancle-button
        width 160px
        height 56px
        line-height 56px
        f14()
        bd($color-orange)
        border-radius(10px)
      .comfirm-button
        background $color-orange
        color $color-white
      .cancle-button
        color $color-orange
        margin-right 36px
.quotation-tips-popup
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  background rgba(0, 0, 0, .6)
  .tips-wrapper
    position absolute
    background $color-white
    width 650px
    height 485px
    border-radius(32px)
    left 7%
    top 28%
    flex-col()
    color $color-3
    f14()
    .tips-header
      height 88px
      flex-center()
      i
        width 100px
        height 20px
        &.header-icon-left
          bg('icon-tips-left.png')
        &.header-icon-right
          bg('icon-tips-right.png')
      span
        margin 0 34px
    .tips-body
      flex 1
      bd-t($color-c)
      bd-b($color-c)
      overflow hidden
      .tips-list
        padding 0 30px
        .tips-item
          padding 15px 0
          h2
            height 60px
            line-height 60px
            padding-left 22px
            color $color-orange
            background #F8F8F8
            border-radius(8px)
            text-over(1)
            i
              display inline-block
              vertical-align text-bottom
              width 28px
              height 30px
              bg('icon-tips-logo.png')
              margin-right 14px
            span
              display inline-block
          .goods-item
            height 80px
            flex-align-item()
            border-bottom 2px dashed $color-c;/*no*/
            &.no-border
              border none
            .goods-name
              font-weight 700
              flex 1
              text-over(1)
            .tips-text
              f12()
              color $color-9
    .tips-bottom
      height 88px
      flex-center()
      f16()
      font-weight 700
.quotation-guide
  position fixed
  wh(100px)
  bg('quotation-guide.png')
  right 0
  bottom 600px
</style>
