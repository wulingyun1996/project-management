<template>
  <transition name="slide">
    <div class="edit-price-wrap">
      <Scroll class="bg">
      <div>
        <div v-for="(item, index) in order.goods" class="item">
          <div class="goods-item">
            <div class="item-left">
              <img :src="item.image_path" />
            </div>
            <div class="item-right">
              <div class="title-price item-info">
                <span class="goods-title">{{item.goods_name}}</span>
                <span class="goods-price">￥{{item.goods_price}}</span>
              </div>
              <div class="prop-count item-info">
                <span class="goods-prop">{{item.spec_name}}</span>
                <span class="goods-count">×{{item.goods_num}}</span>
              </div>
            </div>
          </div>
          <div class="handle-item cell">
            <div>原价: <span class="text">{{item.old_price}}</span></div>
            <div>修改价格: <input @focus="justifyBodyHeight" type="number" v-model="edit_price[index]" :data-g='item.purchase_price' @blur="liFloat($event, index)"></div>
          </div>
        </div>
        <div class="freight cell">
          <div class="check"><span>运费:</span><check-icon :value.sync="free_flag">包邮</check-icon></div>
          <div class="right"><input @focus="justifyBodyHeight" type="number" :class="{'disabled': free_flag}" :data-g='order.oldFreight' :disabled="free_flag" v-model="order.freight" @blur="freightFloat($event)"><span>￥{{order.freight}}</span></div>
        </div>
        <div class="total cell">
          <div>订单原价： <span class="text">￥{{order.order_price}}</span></div>
          <div>买家实付： <span class="text-o">￥{{payPrice}}</span></div>
        </div>
        <div></div>
      </div>
      </Scroll>
      <footBtn text="确认修改" ref="button" @footBtnClick="footBtnClick"></footBtn>
    </div>
  </transition>
</template>
<script>
  import footBtn from 'base/foot-btn/foot-btn'
  import Scroll from 'base/scroll/scroll'
  import { loadData, STATUS_OK } from 'api/common'
  import { CheckIcon } from 'vux'
  export default {
    data() {
      return {
        order: {},
        edit_price: [],
        // 用来控制运费是否能够修改的，根据 vux/CheckIcon 的组件来设置
        free_flag: false,
        temp: ''
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      // 待优化
      freightBlur() {
        let str = this.order.freight
        if (str.length > 0) {
          if (str.substr(-1) === '.') {
            this.temp = str.substring(0, str.length - 1)
          } else if (/^\d{0,12}\.{0,1}(\d{1,2})?$/.test(str)) {
            this.temp = str
          }
        } else {
          this.temp = this.temp ? this.temp : 0
        }
        this.order.freight = this.temp
      },
      freightFloat(e) {
        // 将上次的邮费更新到此次修改
        this.order.freight = this.float(this.order.freight, e.target.getAttribute('data-g'))
        // 每次失去焦点的时候再将之前的邮费和当前邮费同步；
        e.target.setAttribute('data-g', this.order.freight)
        // 更新 order 中数据；
        this.order = Object.assign({}, this.order)
      },
      // 修改价格；
      liFloat(e, index) {
        document.body.style.height = '100%'
        this.edit_price[index] = this.float(this.edit_price[index], e.target.getAttribute('data-g'))
        e.target.setAttribute('data-g', this.edit_price[index])
        this.edit_price = Object.assign([], this.edit_price)
      },
      // 对上次修改的邮费进行验证
      float(str, temp) {
        if (Number(str) <= Number(temp)) {
          if (this.order.goods[0].activity_type !== 1) {
            if (this.order.user_type === 4) {
              this.$vux.toast.text('修改价格不能小于等于采购师价', 'middle')
              return temp
            }
          }
        }
        if (str.length > 0) {
          if (str.substr(-1) === '.') {
            temp = str.substring(0, str.length - 1)
          } else if (/^\d{0,12}(\.{0,1}\d{1,2})?$/.test(str)) {
            temp = str
          }
        } else {
          if (!temp) {
            temp = 0
          }
        }
        return temp
      },
      footBtnClick() {
        const URL = 'order/distributor/modify'
        let freight = this.free_flag ? 0 : this.order.freight
        let obj = {
          id: this.order.id,
          freight: freight,           // 运费
          pay_price: this.payPrice,   // 实付款
          goods_price: this.edit_price.join()   // 商品价格
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('修改成功', 'middle')
            this.$router.back()
          } else {
            this.$vux.toast.text(res.message, 'middle')
          }
        })
      },
      conver(price) {
        let priceArr = price.toString().split('.')
        // 98.03
        if (!priceArr[1]) {
          priceArr[1] = []
        }
        for (let i = priceArr[1].length; i < 2; i++) {
          priceArr[1] = priceArr[1] + '0'
        }
        let str = priceArr.join('.')
        return str
      },
      loadData() {
        const URL = 'order/distributor/detail'
        let obj = {
          id: this.$route.params.id
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            // 数据劫持
            this.order = res.data
            this.order.goods.forEach((val, index) => {
              // 将 goods 中每一项的 编辑价格 存放到 edit_price 这个数组中，在视图渲染的时候，直接根据索引来找到每一个商品的价格，而不是在对 this.order.goods 这个选项在遍历
              this.edit_price[index] = val.edit_price
            })
            // 根据 free_flag 来决定邮费选项是否要选中；
            this.free_flag = !!this.order.free_flag
            // 拿到 freight 转移数据给 oldFreight；
            this.order.oldFreight = this.order.freight
          } else {
            this.$vux.toast.text(res.message, 'middle')
          }
        })
      }
    },
    computed: {
      payPrice() {
        let x = 1000
        let total = 0
        if (!this.order.goods) return '0.00'
        // 计算总商品价格；
        this.edit_price.forEach(val => {
          total += val * x
        })
        // 判断是否存在邮费；
        if (!this.free_flag) {
          total += this.order.freight * x
        }
        total = this.conver(total / x)
        return total
      }
    },
    components: {
      CheckIcon,
      footBtn,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/vux.styl"
  $pl = 26px
  $pd = 20px
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .edit-price-wrap
    position fixed
    top: 0
    left: 0
    width: 100%
    bottom 0
    background $color-white
  .bg
    background $color-bg
    height: 100%;
    .item
      background-color $color-white
      margin-bottom: 20px
    .goods-item
      padding: $pd $pd $pd $pl
      display: flex
      border-bottom 1px solid $color-border
      .item-left
        flex: 0 0 122px;/*px*/
        width: 122px;/*px*/
        margin-right: 20px
        img
          width: 122px;/*px*/
          height: 122px;/*px*/
      .item-right
        flex: 1
        .item-info
          display flex
          justify-content: space-between
          &.title-price
            font-size: 26px;/*px*/
            color: $color-highlight-background
            padding-bottom: 14px
            .goods-price
              white-space: nowrap;
              padding-left: 20px
          &.prop-count
            font-size: 24px;/*px*/
            color: $color-a6
    .cell
      padding:0 $pd 0 $pl
      height: 90px;/*px*/
      line-height: 90px;/*px*/
      display flex
      justify-content space-between
      align-items center
      font-size 24px;/*px*/
    .handle-item
      color $color-9
      .text
        color $color-3
    .freight
      height: 112px
      background $color-white
      color $color-9
      border-bottom :1px solid #dfdfdf;/*no*/
      .right
        span
          color $color-orange
          position relative
          height: 100%
          display inline-block
          font-size 30px;/*px*/
          // &:after
          //   content ''
          //   height: 20px;/*px*/
          //   width: 20px;/*px*/
          //   display inline-block
          //   position absolute
          //   bottom 0
          //   right 50%
          //   background $color-white
          //   border-width 1px;/*no*/
          //   border-style solid
          //   border-color #dfdfdf #dfdfdf transparent transparent
          //   transform rotate(-45deg) translateY(50%)
          //   margin-bottom -1px;/*no*/
    .total
      display: flex
      flex-wrap: wrap
      background $color-white
      color #999
      box-sizing content-box
      padding-bottom:88px
      span
        font-size 32px;/*px*/
      .text
        color #666
      .text-o
        color $color-orange
  input[type=number]
    width: 180px
    height: 48px
    border 1px solid #ccc;/*no*/
    text-align center
    color $color-3
    border-radius 4px
    -webkit-appearance: none
    font-size 24px;/*px*/
    &.disabled
      background #f4f4f4
</style>
