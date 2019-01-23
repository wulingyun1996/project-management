<template>
  <div class="interval-quotation">
    <div class="split-div"></div>
    <div class="quto-main">
      <div class="main-top">
        <h5>可根据买家采购的不同数量设置不同价格</h5>
        <p>请至少设置一个价格区间，信息才能正常发布</p>
      </div>
      <div class="main-center">
        <scroll ref="scroll" class="scroll-content">
          <div>
            <section-price
            v-for="(value, index) in itemObj"
            :key="index"
            :value="value.valueArr"
            :errorArr="value.errorArr"
            :unit="unit"
            @closeItem="colseCurrentBox(index)">
            </section-price>
            <div class="add" @click="addInput" v-if="sectionCount<3">增加区间</div>
            <div class="commission-introduce">
              <div class="commisson-icon"></div>
              <div class="commission-content">
                <p>零售标价：商品标价</p>
                <p>零售底价：采购师推荐给用户，用户的购买价格</p> 
                <p>直采价：采购师自购价格</p>
                <p>佣金：采购师推荐商品给用户，用户购买后采购师赚取的金额</p>
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <foot-btn text="确定" @footBtnClick="setSave"></foot-btn>
    <pop ref="pop" :title="showMess"></pop>
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import FootBtn from 'base/foot-btn/foot-btn-two'
import { nativeBackBase } from 'api/init'
import Scroll from 'base/scroll/scroll'
import Pop from 'base/pop/pop'
import SectionPrice from './section-price'
export default {
  props: {
    postInter: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      intShow: false,
      showMess: '',
      itemObj: [
        {
          valueArr: ['', '', '', ''],
          errorArr: [{isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}]
        }
      ],
      sectionPrice: [],
      unit: ''
    }
  },
  created() {
    this.unit = this.$route.query.unit
    this.sectionPrice = this.postInter
    if (this.sectionPrice.length > 0) {
      this.itemObj.splice(0, this.itemObj.length)
      this.sectionPrice.forEach((item) => {
        let obj = Object.assign({}, {valueArr: [item.mqq, item.price, item.promotionPrice, item.purchasePrice], errorArr: [{isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}]})
        this.itemObj.push(obj)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    nativeBackBase()
    next()
  },
  computed: {
    sectionCount() {
      return this.itemObj.length
    },
    postData() { // 接口请求数据格式
      var postArr = []
      this.itemObj.forEach(item => {
        postArr.push({'mqq': item.valueArr[0], 'price': item.valueArr[1], 'promotionPrice': item.valueArr[2], 'purchasePrice': item.valueArr[3]})
      })
      return postArr
    }
  },
  methods: {
    showPop(title) {
      this.showMess = title
      this.$refs.pop.show()
      this.$refs.pop.hide()
      return
    },
    checkNum(objArr) {
      let isdone = true
      for (let i = 0; i < objArr.length; i++) {
        for (let m = 0; m < objArr[i].valueArr.length; m++) {
          var s
          if (m === 0) {
            s = this.isParse(objArr[i].valueArr[m])
            if (!s.status) {
              isdone = false
              this.itemObj[i].errorArr[m].isShow = true
              this.itemObj[i].errorArr[m].errorType = s.type
            } else {
              this.itemObj[i].errorArr[m].isShow = false
            }
          } else {
            s = this.isMoney(objArr[i].valueArr[m])
            if (!s.status) {
              isdone = false
              this.itemObj[i].errorArr[m].isShow = true
              this.itemObj[i].errorArr[m].errorType = s.type
            } else {
              this.itemObj[i].errorArr[m].isShow = false
            }
          }
        }
      }
      return isdone
    },
    // 校验起批量
    isParse(value) {
      let reg = /^\+?[1-9]\d*$/
      if (Number(value) <= 0) {
        return {status: false, type: 'errTipFive'}
      }
      value = String(value)
      let val = value.match(reg)
      if (val === null) {
        return {status: false, type: 'errTipFiveTwo'}
      } else {
        return {status: true}
      }
    },
    // 校验金额
    isMoney(value) {
      let reg = /^\d{1,8}(\.\d{1,2})?$/
      if (Number(value) <= 0) {
        return {status: false, type: 'errTipSix'}
      }
      value = String(value)
      let val = value.match(reg)
      if (val === null) {
        return {status: false, type: 'errTipSeven'}
      }
      return {status: true}
    },
    setSave() {
      var done = this.checkNum(this.itemObj)
      if (!done) {
        return false
      }
      // 理论上这一步是不会触发 checkNum 会进行格式校验
      if (this.itemObj.length === 1) {
        if (this.itemObj[0].valueArr.indexOf('') !== -1) {
          this.$vux.toast.text('请至少设置一个价格区间，信息才能正常发布', 'middle')
          return false
        }
      }
      for (let i = 0; i < this.itemObj.length; i++) {
        if (Number(this.itemObj[i].valueArr[1]) <= Number(this.itemObj[i].valueArr[2])) {
          let obj = {
            isShow: true,
            errorType: 'errTipEight' // 零售底价必须小于零售标价
          }
          Object.assign(this.itemObj[i].errorArr[2], obj)
          return false
        }
        if (Number(this.itemObj[i].valueArr[2]) <= Number(this.itemObj[i].valueArr[3])) {
          let obj = {
            isShow: true,
            errorType: 'errTipFour' // 直采价必须小于零售底价
          }
          Object.assign(this.itemObj[i].errorArr[3], obj)
          return false
        }
        if (i === 0) {
          continue
        }
        if (Number(this.itemObj[i].valueArr[0]) <= Number(this.itemObj[i - 1].valueArr[0])) {
          let obj = {
            isShow: true,
            errorType: 'errTipOne' // 起批量必须大于前者起批量
          }
          Object.assign(this.itemObj[i].errorArr[0], obj)
          return false
        }
        if (Number(this.itemObj[i].valueArr[1]) >= Number(this.itemObj[i - 1].valueArr[1])) {
          let obj = {
            isShow: true,
            errorType: 'errTipTwo' // 零售标价必须小于前者零售标价
          }
          Object.assign(this.itemObj[i].errorArr[1], obj)
          return false
        }
        if (Number(this.itemObj[i].valueArr[2]) >= Number(this.itemObj[i - 1].valueArr[2])) {
          let obj = {
            isShow: true,
            errorType: 'errTipNine' // 零售底价必须小于前者零售底价
          }
          Object.assign(this.itemObj[i].errorArr[2], obj)
          return false
        }
        if (Number(this.itemObj[i].valueArr[3]) >= Number(this.itemObj[i - 1].valueArr[3])) {
          let obj = {
            isShow: true,
            errorType: 'errTipThree' // 采购单价必须小于前者采购单价
          }
          Object.assign(this.itemObj[i].errorArr[3], obj)
          return false
        }
      }
      this.$emit('intervalQuoClick', this.postData)
      this.$router.back()
    },
    addInput() {
      this.itemObj.push({
        valueArr: ['', '', '', ''],
        errorArr: [{isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}]
      })
    },
    colseCurrentBox(index) {
      this.itemObj.splice(index, 1)
    }
  },
  components: {
    Group,
    XInput,
    FootBtn,
    Scroll,
    Pop,
    SectionPrice
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .interval-quotation
    position: fixed
    z-index: 200
    top: 0
    left: 0
    width: 100%
    height: 100%
    flex-between()
    flex-direction: column
    background: $color-white
    .split-div
      width: 100%
      height: 20px;/*px*/
      background: $color-body
    .quto-main
      flex: 1
      overflow: hidden
      position: relative
      .main-top
        padding: 14px 25px 14px 80px
        font-size: 24px;/*px*/
        background: $color-orange8 url('gg.png') no-repeat 25px center
        background-size: 34px 32px;/*px*/
        h5
          color: #cd9958
        p
          color: $color-9
          margin-top: 10px
      .main-center
        position: absolute
        width: 100%
        left: 0
        top: 86px
        right: 0
        bottom: 0
        .scroll-content
          width: 100%
          height: 100%
          overflow: hidden
        .main-li
          position: relative
          padding-top: 40px
          &:first-child
            .text-input
              .close
                display: none
          .close
            display: block
            width: 80px;/*px*/
            height: 80px;/*px*/
            background: url('close.png') no-repeat center center
            background-size: 100% auto
            position: absolute
            right: 0
            top: 27px
        .text-input
          padding: 0 25px 40px 25px
          width: 100%
          font-size: 26px;/*px*/
          color: $color-6
          flex-box-center()
          .d-name
            width: 19%
          .d-num
            padding-right: 22px
          .third
            width: 31.4%
            p
              line-height: 40px
              font-size: 22px;/*px*/
              color: $color-red
              background: url('iRed.png') no-repeat left center
              background-size: 20px 20px;/*px*/
              padding-left: 25px
              position: absolute
              left: 0
              bottom: -40px
              white-space: nowrap
              &.hideP
                display: none
          .dw
            margin-left: 16px
        .add
          padding: 40px 25px 40px 85px
          font-size: 28px;/*px*/
          color: $color-orange
          background: url('add.png') no-repeat 25px center
          background-size: 38px 38px;/*px*/
        .commission-introduce
          display: flex;
          font-size: 24px; /* px */
          color $color-c
          line-height 40px
          padding-left 25px
          .commisson-icon
            width 26px
            height 26px
            background url('./i.png') no-repeat center
            background-size 100% 100%
            margin-right 10px
            margin-top 6px
</style>