<template>
  <div class="make-quotation iphone-x-container">
    <header ref="header">
      <div class="arrow-left" @click="showConfirm = true">
        <img src="./images/arrow_left.png" alt=''>
      </div>
      <div class="title">
        制作报价单
      </div>
      <div class="build">
        <span class="add-icon"></span>
        <span @click="goBack">添加商品</span>
      </div>
    </header>
    <div class="quotation-title">
      <span>报价单名称</span>
      <input type="text" placeholder="请输入报价单名称 最多12个字" v-model="name" maxlength="12">
    </div>
    <scroll style="flex: 1; background: #F2F2F2;" v-show="isFirstEnter && (quotationLength || isInvalidGoods)">
      <div class="list">
        <quotation-item
          :item="item" v-for="(item, index) in quotation"
          :key="index"
          @jump="jump"
          :quotation-index="index"
          :hasSelect="hasSelect"
          @selectShop="selectShop"
          @selectGood="selectGood"
          @selectKind="selectKind"
          @add="add"
          @reduce="reduce"
          @valid="valid"
          @deleteQuotationItem="del"
          >
        </quotation-item>
        <div class="invalid" v-if="invalidQuotation.length > 0">
          <div class="header">
            <span>失效商品（{{ invalidQuotation.length }}）</span>
            <!-- <span @click="showModule1 = true">清除全部失效商品</span> -->
          </div>
          <swipeout>
            <swipeout-item
              v-for="(item, index) in invalidQuotation"
              :key="index">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteInvalidQuotation(item.id)" type="primary" background-color="#CB0000" :width="70">删除</swipeout-button>
              </div>
              <div slot="content" class="item" @click="goGoodsDetail(item.goods_id)">
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
            </swipeout-item>
          </swipeout>
        </div>
      </div>
    </scroll>
    <footer v-show="quotationLength && isFirstEnter">
      <check-all
        :title="'总金额'"
        :hasSelect="hasSelect"
        :totalPrice="total.totalPrice"
        :totalCommission="total.totalCommission"
        :totalKinds="total.totalKinds"
        :totalNumber="total.totalNumber">
      </check-all>
      <div class="btn-area" @click="save">
        保存并分享报价单
      </div>
    </footer>
    <!-- <footer v-if="hasSelect" class="del">
      <del-item :isSelect="isSelect" :isCheckAll="isCheckAll" :totalNumber="selectTotal.totalNumber" :totalKinds="selectTotal.totalKinds" @checkAll="selectAll" @del="del"></del-item>
    </footer> -->
    <!-- 分享弹窗 -->
    <transition name="slide">
      <div class="share-popup" v-show="isShowSharePopup" @click.self="hideSharePopup">
        <div class="share-popup-wrapper">
          <h1 class="share-title">分享报价单</h1>
          <span class="share-close" @click="hideSharePopup"></span>
          <div class="share-body">
            <p>您只需要将此报价单分享出去，不用囤货，不用发货，无额外费用，产生成交就有佣金拿，多劳多得，上不封顶哦！</p>
            <h5>
              <span class="share-title-text">分享可赚取佣金：</span>
              <span class="share-title-comission">￥{{ total.totalCommission | retainTwoDecimal }}</span>
            </h5>
            <h2>
              <span class="share-icons"></span>
              <span class="share-text">{{ name }}</span>
            </h2>
            <div class='share-info'>
              <div class="item">
                <span class="item-text">店铺数：</span>
                <span class="item-number">{{ quotation.length }}</span>
              </div>
              <div class="item">
                <span class="item-text">商品数：</span>
                <span class="item-number">{{ total.totalAmount }}</span>
              </div>
              <div class="item">
                <span class="item-text">家装业主购买价：</span>
                <span class="item-number">￥{{ total.totalPrice | retainTwoDecimal }}</span>
              </div>
            </div>
          </div>
          <div class="share-icon" @click="shareQuotation">
            <img src="./images/share_weixin.png" alt="">
            <p>微信好友</p>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask1" v-show="showConfirm">
        <div class="module1" v-show="showConfirm">
          <div class="title1">是否放弃本次报价单编辑</div>
          <div class="btn">
            <span @click="$router.go(-1)">确定</span>
            <span @click="showConfirm = false">取消</span>
          </div>
        </div>
      </div>
    </transition>
    <div class="quotation-no-quotation" v-show="!quotationLength && !isInvalidGoods && isFirstEnter">
      <img src="./images/no-quotation.png" alt="">
      <p>报价单内没有商品哦，快去添加商品吧！</p>
      <div class="add-quotation" @click="addQuotation">
        <span class="add-icon"></span>
        <span class="add-text">添加商品</span>
      </div>
    </div>
    <div class="warn-popup" v-show="isShowWarnPopup">
      <div class="warn-wrapper">
        <h1>报价单内商品<span>库存不足</span>或<span>下架</span>，请修改后再分享</h1>
      </div>
    </div>
  </div>
</template>

<script>
import delItem from './del'
import checkAll from './checkAll'
import quotationItem from './make-quotation-item'
import Scroll from 'components/scroll/scroll'
import { dev, invokeNativeMethod } from 'native'
import { smallPic, retainTwoDecimal } from 'common'
import { mixins, isSelectArr, formatCommission, formatPrice, solove, resultPrice, totalNum } from './mixins'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default {
  mixins: [mixins],
  data () {
    return {
      // 闪屏处理
      isFirstEnter: false,
      quotation: [],
      hasSelect: false,
      showModule: false,
      name: '',
      isCheckAll: false,
      isManage: true,
      id: '',
      buyer_id: '',
      showConfirm: false,
      // 失效报价单
      invalidQuotation: [],
      // 失效报价单备份，删除之后不保存的情况下，页面回退的时候扔存在
      tempInvalidQuotation: [],
      // 分享弹窗
      isShowSharePopup: false,
      // 报价单内存在失效商品的提示弹窗
      isShowWarnPopup: false,
      // 阻止多次点击
      limitMoreClick: true,
      nickName: '',
      mobile: '',
      person: ''
    }
  },
  computed: {
    // 报价单 id
    quotationId () {
      return this.$route.query.id
    },
    sameQuotat () {
      return this.$route.query.sameQuotat
    },
    // 是否有失效商品
    isInvalidGoods () {
      return !!this.invalidQuotation.length
    },
    // 报价单长度
    quotationLength () {
      return !!this.quotation.length
    },
    isSelect () {
      return isSelectArr(this.quotation)
    },
    total () {
      let price = 0
      let number = 0
      let kinds = 0
      let commission = 0
      let amount = 0
      if (this.quotation.length > 0) {
        this.quotation.map(i => {
          i.goodsInfo.map(j => {
            amount += 1
            j.kinds.map(k => {
              if (this.hasSelect) {
                if (k.checked) {
                  if (j.goods_type === 1) {
                    price = solove(price, solove(k.count, k.price, '*'), '+')
                    commission += 0
                  } else {
                    if (j.price_type === 0) {
                      price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                      if (k.svip_price) {
                        commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                      } else {
                        commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                      }
                    } else {
                      let total = totalNum(j.kinds)
                      let item = resultPrice(total, j.intervalPrice, k, this.hasSelect, k.checked)
                      price = solove(price, solove(k.count, item.promotion_price, '*'), '+')
                      if (k.svip_price) {
                        let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                        commission = solove(commission, solove(k.count, temp, '*'), '+')
                      } else {
                        commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                      }
                    }
                  }
                  kinds++
                  number += k.count
                }
              } else {
                if (j.goods_type === 1) {
                  price = solove(price, solove(k.count, k.price, '*'), '+')
                  commission += 0
                } else {
                  if (j.price_type === 0) {
                    price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                    if (k.svip_price) {
                      commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                    } else {
                      commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                    }
                  } else {
                    let total = totalNum(j.kinds, this.hasSelect)
                    let item = resultPrice(total, j.intervalPrice, k, this.hasSelect, k.checked)
                    price = solove(price, solove(k.count, item.promotion_price, '*'), '+')
                    if (k.svip_price) {
                      let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                      commission = solove(commission, solove(k.count, temp, '*'), '+')
                    } else {
                      commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                    }
                  }
                }
                kinds++
                number += k.count
              }
            })
          })
        })
      }
      return {
        totalAmount: amount,
        totalPrice: price,
        totalNumber: number,
        totalKinds: kinds,
        totalCommission: commission
      }
    },
    selectTotal () {
      let number = 0
      let kinds = 0
      if (this.quotation.length > 0) {
        this.quotation.map(i => {
          i.goodsInfo.map(j => {
            j.kinds.map(k => {
              if (k.checked) {
                kinds++
                number += k.count
              }
            })
          })
        })
      }
      return {
        totalNumber: number,
        totalKinds: kinds
      }
    }
  },
  created () {
    if (sessionStorage.editQuotation) {
      this.quotation = sessionStorage.editQuotation ? JSON.parse(sessionStorage.editQuotation) : []
      this.invalidQuotation = sessionStorage.invalidQuotation ? JSON.parse(sessionStorage.invalidQuotation) : []
      this.name = sessionStorage.name
      const arr = sessionStorage.addQuotation ? JSON.parse(sessionStorage.addQuotation) : []
      for (let i = 0; i < arr.length; i++) {
        let sellerIndex = this.checkResult(arr[i], this.quotation, 'seller_id')
        if (sellerIndex === -1) {
          this.quotation.push(arr[i])
        } else {
          for (let j = 0; j < arr[i].goodsInfo.length; j++) {
            let goodIndex = this.checkResult(arr[i].goodsInfo[j], this.quotation[sellerIndex].goodsInfo, 'goods_id')
            if (goodIndex === -1) {
              this.quotation[sellerIndex].goodsInfo.push(arr[i].goodsInfo[j])
            } else {
              for (let k = 0; k < arr[i].goodsInfo[j].kinds.length; k++) {
                this.quotation[sellerIndex].goodsInfo[goodIndex].kinds.push(arr[i].goodsInfo[j].kinds[k])
              }
            }
          }
        }
      }
      sessionStorage.editQuotation = JSON.stringify(this.quotation)
      sessionStorage.addQuotation = ''
      this.quotation.map(i => {
        i.checked = false
        i.goodsInfo.map(j => {
          j.checked = false
          j.kinds.map(k => {
            k.checked = false
          })
        })
      })
      this.isFirstEnter = true
    } else {
      this.getData()
    }
  },
  methods: {
    // 关闭/拉起分享弹窗
    showSharePopup () {
      this.isShowSharePopup = true
    },
    hideSharePopup () {
      this.isShowSharePopup = false
      this.$router.push({ name: 'QuotationList' })
    },
    // 分享报价单
    shareQuotation () {
      if (this.nickName) {
        this.person = this.nickName
      } else {
        this.person = this.mobile
      }
      let currentDev = dev()
      let obj = {
        type: 4,
        url: '/pages/quotationDetail/main?id=' + this.id + '&buyer_id=' + this.buyer_id,
        title: `这是"${this.person}"采购师为您制定的专属报价单，点此购买省更多！！！`,
        discriable: '这是您的专属报价单，点此购买省更多！！！',
        imgUrl: smallPic(this.quotation[0].goodsInfo[0].goods_img, 200, 200),
        from: 2,
        shopCartId: this.id
      }
      try {
        if (currentDev === 'Android') {
          window.android.share(JSON.stringify(obj))
          return
        }
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.share.postMessage(JSON.stringify(obj))
        }
      } catch (e) {
        //
      }
      this.hideSharePopup()
    },
    addQuotation () {
      sessionStorage.editQuotation = JSON.stringify(this.quotation)
      if (this.tempInvalidQuotation.length > 0) {
        sessionStorage.invalidQuotation = JSON.stringify(this.tempInvalidQuotation)
      }
      sessionStorage.name = this.name
      this.$router.push({path: '/add-quotation'})
    },
    isEnough () {
      for (let i = 0; i < this.quotation.length; i++) {
        for (let j = 0; j < this.quotation[i].goodsInfo.length; j++) {
          for (let k = 0; k < this.quotation[i].goodsInfo[j].kinds.length; k++) {
            if (this.quotation[i].goodsInfo[j].goods_type !== 1) {
              let total = totalNum(this.quotation[i].goodsInfo[j].kinds, false)
              if (total < this.quotation[i].goodsInfo[j].buy_number) {
                this.$t(`[${this.quotation[i].goodsInfo[j].goods_name}]起批量至少为：${this.quotation[i].goodsInfo[j].buy_number}件`, 'bottom')
                return true
              }
            }
          }
        }
      }
      return false
    },
    getData () {
      let url = 'cart/offerDetail'
      let obj = {
        id: this.quotationId,
        sameQuotat: this.sameQuotat
      }
      this.$http(url, obj).then(res => {
        if (res.code === 200) {
          this.name = res.data.offer_name
          this.quotation = this.formatArr(res.data.list)
          this.isFirstEnter = true
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    // 清除失效商品
    confirm () {
      let str = ''
      for (let i = 0; i < this.invalidQuotation.length; i++) {
        str += this.invalidQuotation[i].id + ','
      }
      this.$http('cart/delCart', {id: str.substr(0, str.length - 1)})
      this.invalidQuotation = []
      this.showModule1 = false
    },
    // 指定 id
    checkResult (item, arr, id) {
      if (arr.length === 0) return -1
      for (let i = 0; i < arr.length; i++) {
        if (item[id] === arr[i][id]) {
          return i
        }
      }
      return -1
    },
    // 判断数组中间是否存在和item.id一样的
    checkResults (item, arr) {
      if (arr.length === 0) return -1
      for (let i = 0; i < arr.length; i++) {
        if (item.goods_id === arr[i].goods_id) {
          return i
        }
      }
      return -1
    },
    formatArr (data) {
      data.map(i => {
        const arr = []
        this.$set(i, 'checked', this.isCheckAll)
        this.$set(i, 'shopName', i.shop_name)
        this.$set(i, 'seller_id', i.seller_id)
        this.$set(i, 'shop_id', i.shop_id)
        i.goodsInfo.map(j => {
          if (j.flag === 1) {
            let index = this.checkResults(j, arr)
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
      this.tempInvalidQuotation = JSON.parse(JSON.stringify(this.invalidQuotation))
      return data
    },
    jump () {
      this.$router.push({path: '/register-boot-page'})
    },
    save () {
      if (!this.limitMoreClick) return
      if (this.name.trim() === '') {
        this.$t('请输入报价单名称')
        return
      }
      if (this.quotation.length === 0) {
        this.$t('报价单无商品')
        return
      }
      if (this.isInvalidGoods) {
        this.showWarnPopup()
        return
      }
      if (this.isEnough()) return
      const arr = []
      this.quotation.map(i => {
        i.goodsInfo.map(j => {
          j.kinds.map(k => {
            arr.push({
              goods_num: k.count,
              seller_id: i.seller_id,
              goods_id: j.goods_id,
              spec_key: k.spec_key
            })
          })
        })
      })
      let obj = {
        offer_name: this.name,
        id: this.quotationId,
        sameQuotat: this.sameQuotat,
        goodsInfo: JSON.stringify(arr)
      }
      this.$http('cart/offerEdit', obj).then(res => {
        if (res.code === 200) {
          this.limitMoreClick = false
          this.isShowSharePopup = true
          this.id = res.data.id
          this.buyer_id = res.data.buyer_id
          this.mobile = res.data.buyer_mobile
          this.nickName = res.data.buyer_nickname
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    // 警告弹窗
    showWarnPopup () {
      this.isShowWarnPopup = true
      setTimeout(() => {
        this.isShowWarnPopup = false
      }, 3000)
    },
    // 删除失效商品
    deleteInvalidQuotation (id) {
      this.invalidQuotation.some((item, index, arr) => {
        if (item.id === id) {
          arr.splice(index, 1)
          return true
        }
      })
    },
    // 跳转到商品详情
    goGoodsDetail (goodsId) {
      this.$router.push({path: '/goods-detail', query: { goodsId }})
    },
    toggleDel () {
      this.hasSelect = true
    },
    formatPrice (num) {
      return formatPrice(num)
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
    add (kind) {
      if (!this.hasSelect) {
        kind.count++
      }
    },
    reduce (kind) {
      if (!this.hasSelect) {
        if (kind.count === 1) {
          return
        }
        kind.count--
      }
    },
    finish () {
      this.hasSelect = false
    },
    del (id, kindIndex, goodsIndex, quotationIndex) {
      this.checkQuotationList(kindIndex, goodsIndex, quotationIndex)
    },
    // 删除商品之后检查商品数量，如果不足1，就清空上一级，依次类推
    checkQuotationList (kindIndex, goodsIndex, quotationIndex) {
      console.log(this.quotation[quotationIndex].goodsInfo[goodsIndex])
      let kindsLength = this.quotation[quotationIndex].goodsInfo[goodsIndex].kinds.length
      let goodsInforLength = this.quotation[quotationIndex].goodsInfo.length
      if (kindsLength <= 1) {
        if (goodsInforLength <= 1) {
          this.quotation.splice(quotationIndex, 1)
        } else {
          this.quotation[quotationIndex].goodsInfo.splice(goodsIndex, 1)
        }
      } else {
        this.quotation[quotationIndex].goodsInfo[goodsIndex].kinds.splice(kindIndex, 1)
      }
    },
    formatCommission (num) {
      return formatCommission(num)
    },
    goBack () {
      invokeNativeMethod('nativeGoHomeNormalTab', 0)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/quotation-list') {
      sessionStorage.editQuotation = ''
      sessionStorage.addQuotation = ''
    }
    next()
  },
  filters: {
    retainTwoDecimal
  },
  components: {
    delItem,
    checkAll,
    quotationItem,
    Scroll,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style scoped lang="stylus">
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
.make-quotation
  flex-col()
  height 100%
header
  background #FFF
  height 88px
  flex-align-item()
  position relative
  .del
    padding-left 96px
  .arrow-left
    height 100%
    padding 0 30px
    display flex
    align-items center
    img
      width  24px
      height 40px
  .title
    color $color-0
    font-size 36px
    position absolute
    left 50%
    transform translateX(-50%)
  .build
    display flex
    align-items center
    f14()
    color #D0021B
    margin-right 28px
    flex-grow 1
    justify-content flex-end
    .add-icon
      wh(40px)
      bg('add-icon.png')
    span:last-child
      margin-left 8px
.quotation-title
  height 120px
  display flex
  align-items center
  background #ffffff
  border-top 2px solid #f5f5f5
  border-bottom 20px solid #f5f5f5
  span
    color $color-4a
    f14()
    line-height 40px
    margin-left 36px
  input::-webkit-input-placeholder
    color #CCC
  input
    width 460px
    height 60px
    line-height 60px
    margin-left 18px
    border-radius(30px)
    text-indent 20px
    outline none
    border 2px solid #CCCCCC;
    f12()
.foot
  foot-btn()
.module
  position fixed
  left 0
  bottom 0
  width 100%
  height 750px
  background rgba(0, 0, 0, .5)
  .title
    display flex
    margin-top 36px
    align-items center
    span
      padding-left 56px
      text-align center
      color #ffffff
      font-size 36px
      flex 1
    img
      width 24px
      height 24px
      margin-right 16px
  .content
    width 640px
    height 294px
    margin 48px auto 0
    background rgba(255, 255, 255, .9)
    border-radius 11px;/*no*/
    text-align center
    .name
      margin-top 54px
      color #000
      font-size 28px
    .commission
      margin-top 28px
      font-size 28px
      color #D0021B
      padding-left 132px
      text-align left
      span>span:first-child
        font-size 48px
      span>span
        font-size 12px
    .total
      margin-top 18px
      color #000
      display flex
      font-size 26px
      padding-left 132px
      span:first-child
        margin-right 90px
    .price
      color #000
      font-size 26px
      padding-left 132px
      margin-top 10px
      text-align left
  .share-area
    display flex
    margin-top 28px
    justify-content center
    .item>div
      text-align center
      color #ffffff
      margin-top 24px
    img
      width 120px
      height 120px
footer
  height 216px
  background #FFF
  .btn-area
    height 98px
    font-size 36px
    color #ffffff
    background #FF8A00
    text-align center
    line-height 98px
footer.del
  height 98px
.mask1
  position fixed
  width 100%
  height 100%
  left 0
  top 0
  background rgba(0, 0, 0, .4)
  opacity 1
  z-index 5
.fade-enter-active, .fade-leave-active
  transition: opacity .6s
.fade-enter, .fade-leave-to
  opacity: 0
.module1
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
  .title1
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
  .vux-swipeout
    .vux-swipeout-item
      overflow hidden
      .vux-swipeout-button-box
        overflow hidden
        padding 1px 1px;/*no*/
        >div
          position relative
        button.vux-swipeout-button
          position absolute
          right 0
          top 0
          fz(15px)
          padding 2px 1px;/*no*/
          background-origin content-box
          background-clip content-box
.quotation-no-quotation
  tc()
  img
    display block
    width 200px
    height 190px
    margin 70px auto 30px
  p
    f14()
    color $color-9
    line-height 40px
    margin-bottom 76px
  .add-quotation
    width 220px
    height 80px
    border-radius(100px)
    background $color-orange
    color $color-white
    f16()
    margin 0 auto
    flex-f-align()
    justify-content center
    .add-icon
      wh(30px)
      bg('add-quotation.png')
      margin-right 10px
    .add-text
      //
.slide-enter-active, .slide-leave-active
  transition all .6s
.slide-enter, .slide-leave-to
  opacity 0
.share-popup
  pf(100%)
  height 100%
  left 0
  bottom 0
  background rgba(0, 0, 0, .7)
  .share-popup-wrapper
    position absolute
    top 15%
    bottom 0
    left 7.5%
    right 7.5%
    .share-close
      wh(24px)
      bg('close.png')
      position absolute
      right -24px
      top 8px
      box-sizing content-box
      padding 5px
      background-origin content-box
    .share-title
      f18()
      color $color-white
      line-height 50px
      tc()
    .share-body
      width 640px
      height 680px
      padding-top 34px
      padding-left 86px
      padding-right 60px
      border-radius(20px)
      margin 32px 0 80px
      background-color #fff
      p
        f14()
        color #000
        line-height 40px
        margin-bottom 14px
      h5
        tc()
        margin-bottom 28px
        .share-title-text
          f14()
          color #D0021B
          line-height 40px
        .share-title-comission
          font-size 48px
          color #D0021B
          line-height 50px
      &>h2
        flex-f()
        border-top 4px dashed #979797
        margin-bottom 20px
        .share-text
          margin-top 20px
          f16()
          line-height 44px
          color $color-0
      .share-info
        display flex
        flex-wrap wrap
        .item
          flex-f-align()
          color $color-4a
          f14()
          line-height 40px
          margin-bottom 6px
          &:last-child
            margin-bottom 0
        .item:nth-child(1)
          margin-right 100px
    .share-icon
      tc()
      margin 0 auto
      img
        wh(120px)
        margin-bottom 24px
      p
        f12()
        color $color-white
        line-height 34px
.warn-popup
  pf(100%)
  left 0
  top 0
  background rgba(0, 0, 0, .7)
  .warn-wrapper
    width 660px
    height 140px
    border-radius(10px)
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    flex-f-align()
    justify-content center
    h1
      color $color-0
      f14()
      line-height 40px
      span
        color $color-orange
</style>
