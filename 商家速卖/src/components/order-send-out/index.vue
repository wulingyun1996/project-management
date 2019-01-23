<template>
  <div class="send-out">
    <div class="logisticstype">
      <div class="item">
        <p class="title">
          请选择发货方式
        </p>
      </div>
      <div class="item">
        <check-icon :value.sync="self_lifting">自提</check-icon>
      </div>
      <div class="item">
        <check-icon :value.sync="logistics">物流发货</check-icon>
      </div>
    </div>
    <div v-show="logistics" class="logistics">
      <div class="item">
        <p class="title">
          物流公司
        </p>
        <div class="company c-input">
          <popup-picker  :columns='1' :data="list1" v-model="delivery_id" @on-show="onShow" @on-hide="onHide" @on-change="onChange" placeholder='选择物流公司' show-name></popup-picker>
        </div>
      </div>
      <div class="item">
        <p class="title">
          快递单号
        </p>
        <!--<input name="delivery_code" class="c-input " type="text" v-model="delivery_code" />-->
        <x-input placeholder="请输入快递单号" v-model="delivery_code" show-clear></x-input>
      </div>
    </div>
    <footBtn text="确定" @footBtnClick="comfirm"></footBtn>
  </div>
</template>

<script>
  import { loadData, STATUS_OK } from 'api/common'
  import { PopupPicker, XInput, CheckIcon } from 'vux'
  import footBtn from 'base/foot-btn/foot-btn'
  const express = require('data/express.json')
  export default {
    data() {
      return {
        list1: express.data,
        delivery_id: ['1'],
        delivery_code: '',
        logistics: false,
        self_lifting: false
      }
    },
    created() {
    },
    activated() {
      this.list1 = express.data
      this.logistics = false
      this.self_lifting = false
    },
    deactivated() {
      this.delivery_code = ''
    },
    methods: {
      onShow () {
//        console.log('on show')
      },
      onHide (type) {
//        console.log('on hide', type)
      },
      onChange (val, i) {
//        console.log('val change', val, this.value1)
      },
      comfirm() {
        if (!this.logistics && !this.self_lifting) {
          this.$vux.toast.text('请选择发货方式', 'middle')
          return
        }
        if (this.logistics) {
          if (this.delivery_code.length > 10) {
            this.sendOut(this.delivery_id[0], this.delivery_code)
          } else {
            this.$vux.toast.text('请输入正确的快递单号', 'middle')
          }
        } else {
          this.sendOut()
        }
      },
      sendOut(deliveryId = 21, deliveryCode = '') {
        let URL = 'order/distributor/delivery'
        let obj = {
          id: this.$route.params.id,
          delivery_id: deliveryId,
          delivery_code: deliveryCode
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('完成', 'middle')
            this.$router.back()
          } else if (this.logistics) {
            this.$vux.toast.text('请输入正确的快递单号', 'middle')
          } else {
            this.$vux.toast.text('自提失败', 'middle')
          }
        })
      }
    },
    watch: {
      self_lifting(newVal) {
        if (newVal) this.logistics = !newVal
      },
      logistics(newVal) {
        if (newVal) this.self_lifting = !newVal
      }
    },
    components: {
      PopupPicker,
      footBtn,
      XInput,
      CheckIcon
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "~common/stylus/vux"
  #app
    .vux-check-icon
      span
        color #333 !important
  .send-out
    position fixed
    top 0
    left: 0
    right 0
    bottom 0
    background $color-white
    clearfix()
    .logisticstype
      .item
        .title
          color: #000
          margin-left: -20px
      .item:nth-child(1)
        height: 90px
        line-height 90px
        .title
          margin 0
          padding 0
          color #333
      .item:nth-last-child(-n + 2)
          padding 18px 32px
    .logistics
      padding-left 60px
    .vux-x-input
      border: 1px solid #cccccc;/*no*/
    .weui-icon-clear
      font-size 30px
    .item
      margin-top: 11px
      padding: 0 32px
      .title
        font-size 24px;/*px*/
        padding 30px 0
        color $color-orange
      .c-input
        display inline-block
        width: 100%
        height: 86px;/*px*/
        line-height: 86px;/*px*/
        border: 1px solid #cccccc;/*no*/
        border-radius 2px
        &.i
          padding-left:20px
          line-height: inherit
      .company
        arrow-down()
        .weui-cell__ft
          &:after
            display :none
  .vux-popup-picker-select
    text-align left!important;
  popPicker()
</style>
