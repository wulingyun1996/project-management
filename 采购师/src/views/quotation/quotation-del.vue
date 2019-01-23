<template>
  <div class="quotation" v-if="loading">
    <div style="height: 100%;" class="quotation-wrapper iphone-x-container" v-if="quotation.length > 0 || invalidQuotation.length > 0" >
      <header ref="header">
        <div class="arrow-left" @click="$router.go(-1)">
          <img src="./images/arrow_left.png" alt=''>
        </div>
        <div class="title">
          购物车({{ total.totalAmount }})
        </div>
        <div class="build">
          <span @click="toggleManage">管理</span><span style="color: #D0021B;">删除</span>
        </div>
      </header>
      <Scroll style="flex: 1; background: #F2F2F2;" @scrollToEnd="getData" :hasMore="hasMore" :pullup="true">
        <quotation-item
          :item="item" v-for="(item, index) in quotation"
          :key="index"
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
        <del-item :isCheckAll="isCheckAll" :totalKinds="total.totalKinds" :totalNumber="total.totalNumber" @del="del" :isSelect="isSelect" @checkAll="selectAll"></del-item>
      </footer>
    </div>
    <div v-if="quotation.length === 0 && invalidQuotation.length === 0" style="height: 100%" class="no-quotation quotation-wrapper iphone-x-container">
      <header>
        <div class="arrow-left" @click="$router.go(-1)">
          <img src="./images/arrow_left.png" alt=''>
        </div>
        <div class="title" style="color: #000;">
          报价单
        </div>
        <div class="build">
          <span style="color: #000;" @click="toggleManage">管理</span>
        </div>
      </header>
      <img src="./images/no_order.png" alt="">
      <p>报价单空空滴，快去逛逛吧！</p>
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
  </div>
</template>

<script>
import delItem from './del'
import checkAll from './checkAll'
import quotationItem from './quotation-item'
import Scroll from 'components/scroll/scroll'
import { mixins, removeUnselect, isSelectArr, calcTotal } from './mixins'
export default {
  components: {
    Scroll,
    checkAll,
    quotationItem,
    delItem
  },
  data () {
    return {
      isCheckAll: false,
      quotation: [],
      page: 0,
      pageSize: 10,
      hasMore: true,
      isManage: true,
      amount: 0,
      loading: false,
      invalidQuotation: [],
      showModule: false
    }
  },
  mounted () {
    this.getData()
  },
  mixins: [mixins],
  methods: {
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
    getData (pageSize) {
      if (!this.hasMore) {
        return
      }
      this.page++
      this.$http('cart/getCartList', {
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = true
        if (res.code === 200) {
          const arr = this.formatArr(res.data.list.data)
          this.amount = res.data.goodsTotal
          this.quotation = this.quotation.concat(arr)
          if (arr.length < 10) {
            this.hasMore = false
          }
        } else {
          this.$t(res.message)
        }
      })
    },
    del () {
      if (!this.isSelect) {
        return
      }
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
      this.$http('cart/delCart', {
        id: str
      }).then(res => {
        if (res.code === 200) {
          this.$t('删除成功')
          removeUnselect(this.quotation, true)
        } else {
          this.$t(res.message)
        }
      })
    },
    toggleManage () {
      this.$router.push({path: '/quotation-list'})
    },
    // 对数据进行处理
    formatArr (data) {
      data.map(i => {
        const arr = []
        this.$set(i, 'checked', this.isCheckAll)
        this.$set(i, 'shopName', i.shop_name)
        this.$set(i, 'seller_id', i.seller_id)
        this.$set(i, 'shop_id', i.shop_id)
        i.goodsInfo.map(j => {
          if (j.flag === 1) {
            let index = this.checkResult(j, arr)
            if (index === -1) {
              arr.push({
                goods_id: j.goods_id,
                goods_name: j.goods_name,
                goods_type: j.goods_type,
                goods_img: j.image_path,
                buy_number: j.buy_number,
                is_stock_good: j.is_stock_good,
                checked: this.isCheckAll,
                intervalPrice: j.intervalPrice,
                price_type: j.price_type,
                kinds: [
                  {
                    id: j.id,
                    count: j.goods_num,
                    flag: j.flag,
                    purchase_price: j.purchase_price,
                    promotion_price: j.promotion_price,
                    price: j.price,
                    title: j.title,
                    goods_unit: j.goods_unit,
                    one_discount: j.one_discount,
                    svip_price: j.svip_price,
                    identity: j.identity,
                    max_price: j.max_price,
                    checked: this.isCheckAll,
                    spec_key: j.spec_key
                  }
                ]
              })
            } else {
              arr[index].kinds.push({
                id: j.id,
                count: j.goods_num,
                flag: j.flag,
                purchase_price: j.purchase_price,
                promotion_price: j.promotion_price,
                price: j.price,
                title: j.title,
                one_discount: j.one_discount,
                svip_price: j.svip_price,
                identity: j.identity,
                max_price: j.max_price,
                goods_unit: j.goods_unit,
                checked: this.isCheckAll,
                spec_key: j.spec_key
              })
            }
          } else {
            this.invalidQuotation.push({
              goods_id: j.goods_id,
              goods_img: j.image_path,
              goods_name: j.goods_name,
              title: j.title,
              id: j.id,
              flag: j.flag
            })
          }
        })
        i.goodsInfo = arr
      })
      for (let i = data.length - 1; i > -1; i--) {
        if (data[i].goodsInfo.length === 0) {
          data.splice(i, 1)
        }
      }
      return data
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
    // 增加
    add (kind) {
      kind.count++
    },
    reduce (kind) {
      if (kind.count === 1) return
      kind.count--
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
.quotation-wrapper
  flex-col()
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
.placeholder
  height 88px
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
  height 98px
  background #FFF
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
</style>
