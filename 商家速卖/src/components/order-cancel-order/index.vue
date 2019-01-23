<template>
  <transition name="slide">
    <div class="cancel-wrap">
      <div class="cancel-wrap">
        <div class="tip">请您在与卖家达成一致前提下，使用取消订单这个功能哟！</div>
        <checklist :options="commonList" v-model="radioValue" :max="1" @on-change="change"></checklist>
      </div>
      <div class="footer">
        <div class="footer-tip">温馨提醒：在取消订单后，系统会自动恢复商品库存，但不会影
          响已下架商品的状态</div>
      </div>
      <footBtn text="确认关闭" @footBtnClick="footBtnClick"></footBtn>
    </div>
  </transition>
</template>

<script>
  import { Checklist } from 'vux'
  import footBtn from 'base/foot-btn/foot-btn'
  import { loadData, STATUS_OK } from 'src/api/common'
//  import { orderCancelReason } from 'data/phpReason.js'
  var orderCancelReason = require('data/orderCancelReason.json')
  export default {
    data() {
      return {
        commonList: [],
        radioValue: [],
        id: '',
        reason: {
          type: Number
        }
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      change (val, label) {
        // val 表示的就是当前的 this.radioValue 这个数组；
        // console.log(val === this.radioValue, label)
        // this.reason 表示的是退货的代码，为 6、7、8；
        this.reason = this.radioValue[0]
      },
      footBtnClick() {
        let URL = `order/distributor/cancel`
        let obj = {
          id: this.$route.params.id,
          reason: this.reason
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('已取消', 'middle')
            this.$router.replace('/order-list')
          } else {
            this.$vux.toast.text(res.message, 'middle')
          }
        })
      },
      loadData() {
        this.commonList = orderCancelReason.data
        // 设置当前选中的一项，形式为一个数组；
        this.radioValue = [this.commonList[0].key]
        this.reason = this.commonList[0].key
        this.change()
      }
    },
    components: {
      Checklist,
      footBtn
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/vux.styl"
  .cancel-wrap
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    .tip
      height: 60px
      line-height: 60px
      background #ffedd6
      color $color-orange
      text-align center
  .footer
    position: fixed;
    left: 0;
    width: 100%
    bottom: 88px;/*px*/
    .footer-tip
      padding 30px 40px
      background-color #f4f4f4
      color #999
      font-size 24px;/*px*/
      line-height: 1.3333
    .foot-btn
      position static
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
