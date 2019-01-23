<template>
  <div class="cardone-condition">
    <div class="upgrade">
      <i class="shape"></i>
      <span>升级条件</span>
    </div>
    <div class="apply">
      <p>采购师提交特约卡申请，且商家认证通过</p>
      <div class="money">
        <span>交易额</span><span class="rmb">¥</span><input type="text" name="" v-model="input_amount">
        <p>交易额必须为大于0的数字,最多7位整数,两位小数</p>
      </div>
      <div class="degree">
        <span>和交易次数</span><input type="text" name="" v-model="input_count">
        <p>交易额必须为大于0的数字,最多7位整数</p>
      </div>
    </div>
    <div class="column"></div>
    <div class="equity">
      <i class="shape"></i>
      <span>特约权益</span> 
      <span class="rights">一级特约采购师可享受的店铺折扣权益</span>
    </div>
    <div class="discount">
      <span>折扣</span>
      <group>
        <x-input title="" type="text" v-model="input_discount" @on-blur="change"></x-input>
      </group>
    </div>
    <p class="num">最低折扣不能低于7.0</p>
    <div class="btn" @click="commit">提交</div>
    <modal ref="Modal"></modal>
    <pop ref="pop" :title="showMess"></pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import {closeCertification} from 'api/navtive'
  import {Group, XInput} from 'vux'
  import Pop from 'base/pop/pop'
  import Modal from 'base/modal/modaltwo'
  import {loadDataPost, STATUS_OK} from 'api/common'
  export default {
    data() {
      return {
        showMess: '',
        input_amount: this.$route.query.money,
        input_count: this.$route.query.count,
        input_discount: this.$route.query.discount
      }
    },
    created() {
      closeCertification()
    },
    methods: {
      showPop(title) {
        this.showMess = title
        this.$refs.pop.show()
        this.$refs.pop.hide()
        return
      },
      change(val) {
        let regZero = /^[1-9]\.\d?$|^[1-9]$/
        let arrZero = val.match(regZero)
        if (arrZero !== null) {
          this.input_discount = arrZero[0]
        } else {
          this.input_discount = +val.substr(0, val.indexOf('.') + 2)
        }
      },
      commit() {
        let regZero = /(^0\.\d{0,2})$|(^[1-9]\d{0,6}\.?\d{0,2}$)/
        let arrZero = this.input_amount.match(regZero)
        if (arrZero !== null) {
          if (+arrZero[0] > this.$route.query.twoMoney) {
            let reg = /^[1-9]\d{0,6}$/
            let arr = String(this.input_count).match(reg)
            if (arr) {
              if (+arr[0] > this.$route.query.twoCount) {
                if (+this.input_discount >= 7.0) {
                  if (+this.input_discount < +this.$route.query.twonum) {
                    let URL = 'setSpecialCard'
                    let obj = {
                      one_amount: this.input_amount,
                      one_count: this.input_count,
                      one_discount: this.input_discount
                    }
                    loadDataPost(URL, obj).then((res) => {
                      if (res.code === STATUS_OK) {
                        if (+this.$route.query.discount !== 0) {
                          this.showPop('提交成功')
                          setTimeout(() => {
                            this.$router.back()
                          }, 1000)
                          return false
                        } else {
                          this.$refs.Modal.show()
                        }
                      }
                    })
                  } else {
                    this.showPop('一级折扣数值不能大于二级折扣数值')
                  }
                } else {
                  this.showPop('最低折扣不能低于7.0')
                }
              } else {
                this.showPop('一级交易次数不能小于二级交易次数')
              }
            } else {
              this.showPop('交易次数必须为大于0的整数，最多7位')
            }
          } else {
            this.showPop('一级交易额不能小于二级交易额')
          }
        } else {
          this.showPop('交易额必须为大于0的数字，最多7位整数，两位小数')
        }
      }
    },
    components: {
      Pop,
      Modal,
      Group,
      XInput
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .cardone-condition
    background: $color-white
  .upgrade, .equity
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    border-bottom: 1px solid $color-border;/*no*/
    position: relative
    i
      display: block
      width: 4px;/*px*/
      height: 25px;/*px*/
      position: absolute
      left: 25px
      top: 35%
      background-image: url('shape.png')
      background-size: 100% auto
    span
      font-size: 28px;/*px*/
      color: $color-orange
      padding-left: 44px
    .rights
      font-size: 24px;/*px*/
      padding-left: 22px
      color: $color-9
  .apply
    padding: 32px 66px 40px 40px
    p
      font-size: 26px;/*px*/
      color: $color-6
    .money, .degree
      span
        font-size: 26px;/*px*/
        color: $color-6
    .money, .degree
      padding-top: 34px
      .rmb
        padding-left: 66px
      input
        border: 1px solid $color-border;/*no*/
        border-radius: 6px
        width: 180px;/*px*/
        height: 48px;/*px*/
        margin-left: 15px
        padding-left: 10px
      p
        padding-left: 175px
        padding-top: 24px
        color: $color-9
        font-size: 24px/*px*/
    .degree
      padding-top: 40px
      input
        margin-left: 46px
  .column
    height: 20px;/*px*/
    background: $color-f4
  .discount
    padding: 0 25px
    padding-top: 30px
    flex-box-center()
    span
      font-size: 26px;/*px*/
      padding-left: 20px
      color: $color-6
  .num
    padding: 27px 0 33px 94px
    font-size: 24px;/*px*/
    color: $color-9
  .btn  
    position: fixed
    bottom: 0
    left: 0
    right: 0
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    text-align: center
    background: $color-orange
    font-size: 36px/*px*/
    color: $color-white
</style>
