<template>
  <div class="specification" v-show="showFlag" @click.stop>
    <div class="spe-wrapper">
      <div class="spe-top">
        <i class="close" @click="closeSpe"></i>
        <div class="pic-text" v-for="item in goodInfo">
          <img :src="item.image" />
          <div class="textP">
            <div class="mess-brand">
              <div class="tag-left" v-show="item.is_stock_good === 1">现货</div>
              <div class="tag-center" v-show="item.boutique === 1">精品馆</div>
              <div class="tag-right" v-show="item.material === 1">材料馆</div>
            </div>
            {{item.title}}
            </div>
          <div class="price">￥{{item.priceRange}}</div>
        </div>
        <div class="spec-tab">
          <div class="spec-nav">
            <i class="left-arrow"></i>
            <div class="inner">
              <ul>
                <li v-if="setSize.length>1" v-for="(item, index) in setSize" :class="{'active': index === currenIndex}" @click="selectIndex(index)">{{item[0].key_one}}</li>
              </ul>
            </div>
            <i class="arrow"></i>
          </div>
          <div class="spec-des" ref="specDes" v-for="(type, index) in setSize" v-if="index === currenIndex">
            <div>
              <div class="spec-li" v-for="(item, index) in type">
                <div class="spe-left">
                  <h5>{{item.key_two}}</h5>
                  <p>￥{{item.purchase_price}}</p>
                </div>
                <div class="spe-right">
                  <div>库存：{{item.store}}</div>
                  <!-- <div class="changeNum">
                    <div class="numLeft" @click="changeQuantity(item,-1)">-</div>
                    <input class="numCenter" type="text" v-model="item.product_Quantity" disabled />
                    <div class="numRight" @click="changeQuantity(item,1)">+</div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="spe-bottom">
        共<span>{{numTotall}}</span>个<span>{{moneyTotall | formatMoney('元') }}</span>
      </div>
      <button @click="goCart">确定</button> -->
    </div>
    <pop :title="title" ref="pop"></pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import Pop from 'base/pop/pop'
  import {mapGetters} from 'vuex'
  import {dev} from 'common/js/dev'
  export default {
    computed: {
      ...mapGetters(['setSize']),
      ...mapGetters(['goodInfo'])
    },
    mounted() {
      this.$nextTick(() => {
        this.calcTotalMoney()
      })
    },
    data() {
      return {
        currenIndex: 0,
        showFlag: false,
        gimgUrl: '../../assets/images/gui1.jpg',
        numTotall: 0,
        moneyTotall: 0,
        postInfo: [],
        title: '',
        errNum: ''
      }
    },
    filters: {
      formatMoney(value, param) {
        return '￥' + value.toFixed(2) + param
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      selectIndex(index) {
        this.currenIndex = index
      },
      closeSpe() {
        this.showFlag = false
      },
      changeQuantity(product, type) {
        if (type > 0) {
          product.product_Quantity ++
        } else {
          product.product_Quantity >= 1 ? product.product_Quantity -- : product.product_Quantity = 0
        }
        this.calcTotalMoney()
      },
      calcTotalMoney() {
        this.numTotall = 0
        this.moneyTotall = 0
        this.setSize.map((product) => {
          product.map((value) => {
            this.numTotall += value.product_Quantity
            this.moneyTotall += value.price * value.product_Quantity
          })
        })
      },
      goCart() {
        let currentDev = dev()
        try {
          if (currentDev === 'Android') {
            window.android.getToken()
          } else if (currentDev === 'iOS') {
            window.webkit.messageHandlers.getToken.postMessage('')
          }
        } catch (e) {
          if (localStorage.getItem('baseHref') === null) {
            localStorage.setItem('baseHref', 'http://os.cgs18.com/')
          }
          window.location.href = `${localStorage.getItem('baseHref')}api/share`
          return false
        }
        this.title = '您不能购买自己的商品哦~'
        this.$refs.pop.show()
        this.$refs.pop.hide()
      }
    },
    components: {
      Pop
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .specification
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: rgba(0, 0, 0, 0.65)
    .spe-wrapper
      position: absolute
      bottom: 0
      left: 0
      right: 0
      background: $color-white
      .spe-top
        border-bottom: 1px solid $color-border;/*no*/
        position: relative
        padding-top: 65px
        .close
          position: absolute
          right: 0
          top: 15px
          padding: 10px 25px
          box-sizing: content-box
          width: 25px;/*px*/
          height: 25px;/*px*/
          background: url('x.png') no-repeat center center
          background-size: 25px 25px;/*px*/
      .pic-text
        padding-left: 28px
        padding-bottom: 28px
        border-bottom: 1px solid $color-border;/*no*/
        position: relative
        height: 150px;/*px*/
        img
          width: 236px;/*px*/
          height: 236px;/*px*/
          position: absolute
          left: 28px
          top: -98px
          border-radius: 10px
        .textP
          font-size: 28px;/*px*/
          color: $color-3
          padding-left: 236px;/*px*/
          margin-left: 22px
          padding-right: 85px
          line-height: 1.3
          text-over(2)
          display flex
          .mess-brand
            display flex
            align-items center
            margin-bottom 10px
            .tag-left
              width 52px
              height 32px
              background: rgba(244,117,117,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #F47575
              letter-spacing: 0
              text-align center
              line-height 32px
              margin-right 8px
            .tag-center
              width 72px
              height 32px
              background: rgba(255,138,0,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #FF8A00
              letter-spacing: 0
              text-align center
              line-height 32px
              margin-right 8px
            .tag-right
              width 72px
              height 32px
              background: rgba(109,172,246,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #6DACF6
              letter-spacing: 0
              text-align center
              line-height 32px
        .price
          color: $color-orange
          padding-left: 236px;/*px*/
          margin-left: 22px
          margin-top: 26px
      .spec-tab
        .spec-nav
          position: relative
          overflow: hidden
          .left-arrow, .arrow
            display: none
            padding: 0 25px
            top: 50%
          .left-arrow
            left: 26px
            arrow-left()
            position: absolute
          .arrow
            right: 0
            arrow-right()
            position: absolute
        .inner
          padding: 0 24px
          overflow: hidden
        ul
          white-space: nowrap
          overflow-x: auto
          &::-webkit-scrollbar
            display: none
          li
            display: inline-block
            height: 88px;/*px*/
            line-height: 88px;/*px*/
            font-size: 26px;/*px*/
            color: $color-a6
            margin-right: 38px
            padding: 0 16px;/*px*/
            &.active
              color: $color-orange
              border-bottom: 3px solid $color-orange;/*px*/
      .spec-des
        padding-left: 28px
        height: 500px;/*px*/
        overflow-y: auto
        border-top: 1px solid $color-border;/*no*/
        >div
          .spec-li
            &:last-child
              border-bottom: none
        .spec-li
          flex-box-center()
          justify-content: space-between
          border-bottom: 1px solid $color-border;/*no*/
          padding: 30px 40px 30px 10px
        .spe-left
          h5
            font-size: 26px;/*px*/
            color: $color-3
            margin-top: 10px
          p
            color: $color-a6
            font-size: 22px;/*px*/
            margin-top: 16px
        .spe-right
          flex-box-center()
          color: $color-a6
          .changeNum
            display: flex
            border: 1px solid $color-9;/*no*/
            border-radius: 5px
            line-height: 62px;/*px*/
            height: 62px;/*px*/
            margin-left: 24px
            .numLeft
              font-size: 38px;/*px*/
              padding: 0 18px
            .numCenter
              border-left: 1px solid $color-9;/*no*/
              border-right: 1px solid $color-9;/*no*/
              font-size: 34px;/*px*/
              display: block
              width: 118px;/*px*/
              text-align: center
              color: $color-3
            .numRight
              font-size: 38px;/*px*/
              padding: 0 18px
      .spe-bottom
        font-size: 30px;/*px*/
        color: $color-a6
        text-align: right
        padding: 20px 40px 20px 0
        i
          font-style: normal
          color: $color-orange
          display: inline-block
          margin-right: 24px
        span
          color: $color-orange
          &:last-child
            margin-left: 35px
      button
        width: 100%
        background: $color-bc
        color: $color-white
        display: block
        text-align: center
        font-size: 36px;/*px*/
        line-height: 98px;/*px*/
</style>
