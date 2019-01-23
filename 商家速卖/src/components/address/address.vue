<template>
  <div id="content">
    <div class="addressbox">
      <group>
        <x-address title="" value-text-align="left" raw-value @on-show="logShow" v-model="value4" :list="addressData" placeholder="请选择经营地区" @on-shadow-change="shadowChange"></x-address>
      </group>
      <i></i>
    </div>
    <div class="address">
      <textarea placeholder="请输入详细地址" v-model="address" maxlength="50"></textarea>
      <span><i>{{this.address.length}}</i>/50</span>
    </div>
    <div class="addressbtn" @click="locationAddress" ref="btn" :class="isActive ? 'active' : ''">保存
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import cityList from '../../../data/areaAddress.json'
  import { Group, XAddress, ToastPlugin } from 'vux'
  import { loadData, STATUS_OK } from 'api/common'
  Vue.use(ToastPlugin)
  import Vue from 'vue'
  // import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        addressData: cityList,
        value4: [],
        address: '',
        detail: {}
      }
    },
    computed: {
      // ...mapGetters(['addressId']),
      isActive() {
        let s = null
        if (this.address.length > 0 && this.value4.length !== 0) {
          s = true
        } else {
          s = false
        }
        return s
      }
    },
    created() {
      this.addressDetail()
    },
    methods: {
      // 地址详情接口
      addressDetail() {
        let URL = '/shop/shopMange'
        loadData(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.detail = res.data
            if (res.data.ids[0] && res.data.ids[1] && res.data.ids[2]) {
              this.value4 = [res.data.ids[0], res.data.ids[1], res.data.ids[2]]
            }
            this.address = this.detail.address ? this.detail.address : ''
          } else {
            console.log(7)
          }
        })
      },
      shadowChange(ids) {
      },
      // 保存按钮
      locationAddress() {
        this.shopAddress()
      },
      logShow () {
      },
      // 经营地址接口
      shopAddress() {
        let regAddr = /[^\u0000-\uFFFF]/g
        let regAddrRes = regAddr.test(this.address)
        if (this.value4.length === 0) {
          this.$vux.toast.text('请选择经营地区')
          return false
        }
        if (this.address === '') {
          this.$vux.toast.text('请填写详细地址')
          return false
        }
        if (regAddrRes) {
          this.$vux.toast.text('含有非法词汇，请重新输入')
          return false
        }
        let URL = 'shop/shopAddress'
        let obj = {
          province: this.value4[0],
          city: this.value4[1],
          area: this.value4[2],
          address: this.address,
          type: 2
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('添加成功')
            this.$router.push('/set-shop')
          } else {
            // this.$vux.toast.text('res')
          }
        })
      }
    },
    components: {
      Group,
      XAddress
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/vux.styl"
  #content
    background: $color-white
    height: 100vh
  .addressbox
    padding: 10px 34px 10px 34px
    i
      display: inline-block
      width: 12px;/*px*/
      height: 20px;/*px*/
      background: url('arrow.png') no-repeat
      background-size: 100% auto
      position: absolute
      right: 34px
      top: 45px
    .weui-cells
      border-right: none
    .vux-popup-picker-placeholder
      font-size: 28px;/*px*/
      color: $color-6
    .vux-cell-value
      font-size: 28px;/*px*/
      color: $color-6
  .address
    padding: 0 30px 0 35px
    position: relative
    width: 100%
    textarea
      width: 100%
      height: 260px;/*px*/
      display: block
      border: 1px solid $color-bc;/*no*/
      border-radius: 2px
      padding: 24px
      font-size: 26px;/*px*/
      color: $color-3
      &::-webkit-input-placeholder
        color: $color-bc
      &:-moz-placeholder
        color: $color-bc
    span
      font-size: 26px;/*px*/
      color: $color-bc
      position: absolute
      right: 62px
      bottom: 25px
      i
        color: $color-orange
        font-style: normal
  .addressbtn
    position :fixed
    bottom :0
    left :0
    right: 0
    height: 94px;/*px*/
    line-height: 94px;/*px*/
    text-align :center
    background :$color-bc
    font-size :36px;/*px*/
    color: $color-white
    &.active
      background :$color-orange
  .v-transfer-dom
    .vux-popup-header
      background: $color-white
      height: 90px!important
      border-bottom: 1px solid $color-df;/*no*/
      .vux-popup-header-left,.vux-popup-header-right
        font-size: 30px;/*px*/
        text-align: center
        line-height: 90px
      .vux-popup-header-right
        color: $color-orange9
        padding-right: 26px
      .vux-popup-header-left
        padding-left: 26px
        color: $color-0
    .scroller-indicator
      height: 90px;/*px*/
      top: 50%
      transform: translateY(-50%)
      border-top: 1px solid $color-border;/*no*/
      border-bottom: 1px solid $color-border;/*no*/
    .scroller-component
      height: 450px;/*px*/
      background: $color-white
    .scroller-item
      font-size: 30px;/*px*/
      height: 90px;/*px*/
      line-height: 90px;/*px*/
      color: $color-highlight-background
    .scroller-item-selected
      color: $color-0
  .vux-cell-value, .vux-popup-picker-select
    width: 100%
</style>
