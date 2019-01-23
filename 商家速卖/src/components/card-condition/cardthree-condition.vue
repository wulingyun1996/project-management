<template>
  <div class="cardthree-condition">
    <div class="upgrade">
      <i class="shape"></i>
      <span>升级条件</span>
    </div>
    <div class="apply">
      <p>采购师提交特约卡申请，且商家认证通过</p>
    </div>
    <div class="column"></div>
    <div class="equity">
      <i class="shape"></i>
      <span>特约权益</span> 
      <span class="rights">三级特约采购师可享受的店铺折扣权益</span>
    </div>
    <div class="discount">
      <span>折扣</span>
      <group>
        <x-input title="" type="text" v-model="input_discount" @on-blur="change"></x-input>
      </group>
    </div>
    <p class="num">最低折扣不能低于7.0</p>
    <div class="btn" @click="setNum">提交</div>
    <pop ref="pop" :title="showMess"></pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import {closeCertification} from 'api/navtive'
  import {Group, XInput} from 'vux'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import Pop from 'base/pop/pop'
  export default {
    data() {
      return {
        showMess: '',
        input_discount: this.$route.query.num
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
      loadData() {
        let URL = 'setSpecialCard'
        let obj = {
          three_discount: this.input_discount
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.showPop('提交成功')
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          }
        })
      },
      setNum() {
        if (this.input_discount >= 7.0) {
          if (this.$route.query.twoNum !== 0) {
            if (+this.input_discount > +this.$route.query.twoNum) {
              this.loadData()
            } else {
              this.showPop('三级折扣数值不能小于二级折扣')
            }
          } else {
            console.log('二级没有设置')
            this.loadData()
          }
        } else {
          this.showPop('最低折扣不能低于7.0')
        }
      },
      change(val) {
        let regZero = /^[1-9]\.\d?$|^[1-9]$/
        let arrZero = val.match(regZero)
        if (arrZero !== null) {
          this.input_discount = arrZero[0]
        } else {
          this.input_discount = +val.substr(0, val.indexOf('.') + 2)
        }
      }
    },
    components: {
      Pop,
      Group,
      XInput
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .cardthree-condition
    background: $color-white
  .upgrade, .apply, .equity
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    border-bottom: 1px solid $color-border;/*no*/
    position: relative
    i
      display: block
      width: 4px;/*px*/
      height: 25px;/*px*/
      background-image: url('shape.png')
      position: absolute
      left: 25px
      top: 35%
      background-size: 100% auto
    span
      font-size: 28px;/*px*/
      padding-left: 44px
      color: $color-orange
    .rights
      font-size: 24px;/*px*/
      padding-left: 22px
      color: $color-9
  .apply
    p
      font-size: 28px;/*px*/
      color: $color-6 
      text-indent: 18px
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
