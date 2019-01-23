<template>
  <div class="main-li">
    <div class="text-input">
      <i class="close" @click="closeBox"></i>
      <div class="d-name">采购数量</div>
      <div class="d-num">起批量</div>
      <group class="third">
        <x-input title="" v-model="value[0]" @on-focus="removeError(0)" @on-blur="loseBug"></x-input>
      </group>
      <div class="dw">个以上</div>
      <p v-show="errorArr[0].isShow">{{errorType[errorArr[0].errorType]}}</p>
    </div>
    <div class="text-input">
      <div class="d-name">零售标价</div>
      <group class="third">
        <x-input title="" v-model="value[1]" @on-focus="removeError(1)" @on-blur="loseBug"></x-input>
      </group>
      <div class="dw">元/{{this.unit}}</div>
      <p v-show="errorArr[1].isShow">{{errorType[errorArr[1].errorType]}}</p>
    </div>
    <div class="text-input">
      <div class="d-name">零售底价</div>
      <group class="third">
        <x-input title="" v-model="value[2]" @on-focus="removeError(2)" @on-blur="loseBug"></x-input>
      </group>
      <div class="dw">元/{{this.unit}}</div>
      <p v-show="errorArr[2].isShow">{{errorType[errorArr[2].errorType]}}</p>
    </div>
    <div class="text-input">
      <div class="d-name">采购单价</div>
      <group class="third">
        <x-input title="" v-model="value[3]" @on-focus="removeError(3)" @on-blur="loseBug"></x-input>
      </group>
      <div class="dw">元/{{this.unit}}</div>
      <p v-show="errorArr[3].isShow">{{errorType[errorArr[3].errorType]}}</p>
    </div>
    <div class="text-input">
      <h2>佣金：
        <span :class="{active: value[2] - value[3] > 0}">{{ splitMoney((value[2] - value[3]) * value[0]) }}</span>
      </h2>
    </div>
    <div class="split-div"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {dev} from 'common/js/dev'
  import {mapGetters} from 'vuex'
  import {Group, XInput, XNumber} from 'vux'
  import { splitMoney } from 'commons'
  export default {
    props: {
      value: {
        type: Array,
        default: [0, 0, 0]
      },
      errorArr: {
        type: Array,
        default: [{isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}, {isShow: false, errorType: 'errTipOne'}]
      },
      unit: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        errorType: {
          errTipOne: '起批量必须大于前者起批量',
          errTipTwo: '零售标价必须小于前者零售标价',
          errTipThree: '采购单价必须小于前者采购单价',
          errTipFour: '直采价必须小于零售底价',
          errTipFive: '起批量必须大于0',
          errTipFiveTwo: '请输入正确的起批量',
          errTipSix: '单价必须大于0',
          errTipSeven: '请输入正确的价格',
          errTipEight: '零售底价必须小于零售标价',
          errTipNine: '零售底价必须小于前者零售底价'
        },
        errTree: this.errorArr
      }
    },
    computed: {
      ...mapGetters(['company'])
      // errTree() {
      //   return this.errorArr
      // }
    },
    methods: {
      splitMoney (val) {
        let {init, zero} = splitMoney(val)
        return `${init}.${zero}`
      },
      loseBug() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.remove('full-body')
        }
      },
      closeBox() {
        this.$emit('closeItem')
      },
      removeError (i) {
        this.errorArr[i].isShow = false
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.add('full-body')
        }
      }
    },
    components: {
      Group,
      XInput,
      XNumber
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    .split-div
      width: 100%
      height: 20px;/*px*/
      background: $color-body
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
        top: -12px
    .text-input
      padding: 0 25px 40px 25px
      width: 100%
      font-size: 26px;/*px*/
      color: $color-6
      flex-box-center()
      position: relative
      .d-name
        width: 133px
      .d-num
        padding-right: 22px
      .third
        width: 31.4%
      .dw
        margin-left: 16px
      &:first-child
        p
          left: 256px
      p
        line-height: 40px
        font-size: 22px;/*px*/
        color: $color-red
        background: url('iRed.png') no-repeat left center
        background-size: 20px 20px;/*px*/
        padding-left: 25px
        position: absolute
        left: 158px
        bottom: 0
      h2
        span
          &.active
            color $color-red
    .add
      padding: 40px 25px 40px 85px
      font-size: 28px;/*px*/
      color: $color-orange
      background: url('add.png') no-repeat 25px center
      background-size: 38px 38px;/*px*/
</style>
