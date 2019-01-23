<template>
  <div class="make-quotation iphone-x-container">
    <header ref="header">
      <div class="arrow-left" @click="showConfirm = true">
        <img src="./images/arrow_left.png" alt=''>
      </div>
      <div class="title">
        新建报价单
      </div>
      <div class="build" v-show="!isFromGoodsDetail">
        <span class="add-icon"></span>
        <span @click="goBack">添加商品</span>
      </div>
    </header>
    <div class="quotation-title">
      <span>名称</span>
      <input type="text" placeholder="请输入报价单名称 最多12个字" v-model="name" maxlength="12">
    </div>
    <scroll class="make-quotation-scroll" v-show="quotationLength">
      <div class="list" :class="hasSelect ? 'list-del' : ''">
        <make-quotation-item
          :item="item" v-for="(item, index) in quotation"
          :key="index"
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
        </make-quotation-item>
      </div>
    </scroll>
    <footer v-show="quotationLength">
      <div class='btn-save' @click="save(false)">
        <div class= 'make'>
          <img src="./images/save.png" alt="">
          <span>保存报价单</span>
        </div>
      </div>
      <div class="btn-area" @click="share">
        <div class='make'>
          <img src="./images/share-list.png" alt="">
          <span>分享报价单</span>
        </div>
      </div>
    </footer>
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
              <img src="./images/quotation-list-shop.png" alt="">
              <span class="share-text">{{ name }}</span>
            </h2>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">店铺数：</span>
              <span class="item-number">{{ quotation.length }}</span>
            </div>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">商品数：</span>
              <span class="item-number">{{ total.totalAmount }}</span>
            </div>
            <div class="item">
              <span class='item-dot'></span>
              <span class="item-text">家装业主购买价：</span>
              <span class="item-number">￥{{ total.totalPrice | retainTwoDecimal }}</span>
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
    <div class="quotation-guide1" v-show="isFirstEnter">
      <div class="guide-bg1" v-show="firstGuidePage" @click="showNextGuidePage"></div>
      <div class="guide-bg2" v-show="twoGuidePage" @click="closeGuidePopup"></div>
    </div>
    <div class="quotation-no-quotation" v-show="!quotationLength">
      <img src="./images/no-quotation.png" alt="">
      <p>报价单内没有商品哦，快去添加商品吧！</p>
      <div class="add-quotation" @click="addQuotation">
        <span class="add-icon"></span>
        <span class="add-text">添加商品</span>
      </div>
    </div>
  </div>
</template>

<script>
import delItem from './del'
import checkAll from './checkAll'
import makeQuotationItem from './make-quotation-item'
import Scroll from 'components/scroll/scroll'
import { invokeNativeMethod, dev } from 'native'
import { smallPic, retainTwoDecimal } from 'common'
import { mixins, isSelectArr, formatCommission, formatPrice, totalNum, solove, resultPrice } from './mixins'
export default {
  data () {
    return {
      quotation: [],
      isManage: true,
      hasSelect: false,
      name: '',
      isCheckAll: false,
      id: '',
      buyer_id: '',
      showConfirm: false,
      // 是否是第一次进入报价单
      isFirstEnter: false,
      firstGuidePage: true,
      twoGuidePage: false,
      isShowSharePopup: false,
      limitMoreClick: true,
      mobile: '',
      nickName: '',
      person: ''
    }
  },
  computed: {
    // 是否从商品详情添加进来的
    isFromGoodsDetail () {
      return !!this.$route.query.fromGoodsDetail
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
                  number += Number(k.count)
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
                    let item = resultPrice(total, j.intervalPrice, k, this.hasSelect, false)
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
                number += Number(k.count)
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
                number += Number(k.count)
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
  mixins: [mixins],
  created () {
    this.judgeFirstEnter()
  },
  mounted () {
    // 从商品详情页制作报价单过来，不取之前保存的名称
    if (!this.isFromGoodsDetail) this.name = sessionStorage.quotationName ? sessionStorage.quotationName : ''
    this.quotation = JSON.parse(sessionStorage.quotation)
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
    sessionStorage.quotation = JSON.stringify(this.quotation)
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
  },
  methods: {
    // 是否是第一次进入制作报价单页面， 来决定是否显示引导页
    judgeFirstEnter () {
      let url = 'cart/firstLogin'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.isFirstEnter = !res.data
        }
      })
    },
    showNextGuidePage () {
      this.firstGuidePage = false
      this.twoGuidePage = true
    },
    closeGuidePopup () {
      this.isFirstEnter = false
      this.firstGuidePage = true
      this.twoGuidePage = false
    },
    // 关闭/拉起分享弹窗
    showSharePopup () {
      this.isShowSharePopup = true
    },
    hideSharePopup () {
      this.isShowSharePopup = false
      this.$router.push({ name: 'MakeQuotation' })
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
      if (this.isFromGoodsDetail) {
        this.save(true)
      } else {
        this.hideSharePopup()
        this.$push({ name: 'QuotationList' })
      }
    },
    checkResult (item, arr, id) {
      if (arr.length === 0) return -1
      for (let i = 0; i < arr.length; i++) {
        if (item[id] === arr[i][id]) {
          return i
        }
      }
      return -1
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
    // isStayCurrentPage：如果是从商品详情页分享，保存报价单同时，页面不做回退到商品详情页，如果是单纯保存，回退到商品详情页
    save (isStayCurrentPage) {
      if (!this.limitMoreClick) return
      if (this.name.trim() === '') {
        this.$t('请输入报价单名称')
        return
      }
      if (this.quotation.length === 0) {
        this.$t('报价单无商品')
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
        goodsInfo: JSON.stringify(arr),
        id: '',
        sameQuotat: ''
      }
      this.limitMoreClick = false
      this.$http('cart/offerEdit', obj).then(res => {
        if (res.code === 200) {
          this.limitMoreClick = false
          this.id = res.data.id
          this.buyer_id = res.data.buyer_id
          sessionStorage.quotation = ''
          this.$t('保存成功')
          if (this.isFromGoodsDetail && !isStayCurrentPage) {
            this.$back()
            return
          }
          if (!this.isFromGoodsDetail) this.$push('/quotation-list')
        } else {
          this.$t(res.message)
        }
      })
    },
    share () {
      if (this.isEnough()) return
      // if (!this.limitMoreClick) return
      if (this.name.trim() === '') {
        this.$t('请输入报价单名称')
        return
      }
      if (this.quotation.length === 0) {
        this.$t('报价单无商品')
        return
      }
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
        goodsInfo: JSON.stringify(arr),
        id: '',
        sameQuotat: ''
      }
      this.$http('cart/offerEdit', obj).then(res => {
        if (res.code === 200) {
          this.id = res.data.id
          this.buyer_id = res.data.buyer_id
          this.mobile = res.data.buyer_mobile
          this.nickName = res.data.buyer_nickname
          sessionStorage.quotation = ''
        }
      })
      this.showSharePopup()
    },
    addQuotation () {
      sessionStorage.quotation = JSON.stringify(this.quotation)
      this.$router.push({path: '/add-quotation'})
    },
    toggleDel () {
      this.hasSelect = true
    },
    formatPrice (num) {
      return formatPrice(num)
    },
    add (kind) {
      if (!this.hasSelect) {
        kind.count++
      }
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.path === '/quotation') {
        vm.name = ''
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    sessionStorage.quotationName = this.name
    sessionStorage.quotation = JSON.stringify(this.quotation)
    next()
  },
  filters: {
    retainTwoDecimal
  },
  components: {
    delItem,
    checkAll,
    makeQuotationItem,
    Scroll
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
  .placeholder
    height 88px
  .make-quotation-scroll
    flex 1
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
    font-size 36px/*no*/
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
  border-top 1px solid #DEDEDE
  height 120px
  display flex
  align-items center
  background #fff
  span
    color $color-4a
    f14()
    line-height 40px
    margin-left 36px
  input::-webkit-input-placeholder
    color #CCC
  input
    width 80%
    height 45%
    line-height 60px
    margin-left 18px
    border-radius(30px)
    text-indent 20px
    outline none
    background $color-white
    color #333
    border 2px solid #CCCCCC
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
      font-size 36px/*no*/
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
      font-size 28px/*no*/
    .commission
      margin-top 28px
      font-size 28px/*no*/
      color #D0021B
      padding-left 132px
      text-align left
      span>span:first-child
        font-size 48px/*no*/
      span>span
        font-size 12px/*no*/
    .total
      margin-top 18px
      color #000
      display flex
      font-size 26px;/*no*/
      padding-left 132px
      span:first-child
        margin-right 90px
    .price
      color #000
      font-size 26px;/*no*/
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
  display flex
  height 216px
  background #FFF
  .btn-save
    width 50%
    height 98px
    f16()
    color #ffffff
    background #FF8A00
    text-align center
    line-height 98px
    margin-top 120px
    .make
      display flex
      justify-content center
      align-items center
      img
        width 36px
        height 38px
      span
        margin-left 10px
  .btn-area
    width 50%
    height 98px
    f16()
    color #ffffff
    background #F5A623
    text-align center
    line-height 98px
    margin-top 120px
   .make
      display flex
      justify-content center
      align-items center
      img
        width 36px
        height 38px
      span
        margin-left 10px
footer.del
  height 98px
.mask
  position fixed
  height 100%
  width 100%
  left 0
  top 0
  opacity 0
  background #FFF
.slide-enter-active, .slide-leave-active
  transition all .6s
.slide-enter, .slide-leave-to
  opacity 0
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
.quotation-guide1
  pf(100%)
  left 0
  top 0
  background rgba(0, 0, 0, .8)
  .guide-bg1
    position absolute
    top 40px
    right 24px
    width 422px
    height 496px
    bg('quotation-guide1.png')
  .guide-bg2
    width 732px
    height 838px
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    bg('quotation-guide2.png')
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
.share-popup
  pf(100%)
  width 100%
  height 100%
  left 0
  bottom 0
  background rgba(0, 0, 0, .7)
  .share-popup-wrapper
    position absolute
    bottom 4%
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
      background url('./images/share-bg.png') center center
      background-size 100% 100%
      width 640px
      height 680px
      padding-top 34px
      padding-left 86px
      padding-right 60px
      border-radius(20px)
      margin 32px 0 80px
      p
        f14()
        color #999999
        line-height 40px
        margin-bottom 14px
      h5
        tc()
        margin-top 180px
        margin-bottom 28px
        .share-title-text
          f14()
          color #FF8A00
          line-height 40px
        .share-title-comission
          font-size 48px
          color #D0021B
          line-height 50px
      &>h2
        flex-f()
        margin-bottom 20px
        img
          width 34px;
          height 38px;
          margin-right 32px
        .share-text
          f16()
          line-height 44px
          color $color-0
      .item
        flex-f-align()
        color $color-4a
        f14()
        line-height 40px
        margin-bottom 6px
        .item-dot
          wh(10px)
          margin-right 12px
          background-color #FF8A00
          border-radius(50%)
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
</style>
