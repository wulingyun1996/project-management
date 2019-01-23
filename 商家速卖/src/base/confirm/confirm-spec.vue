<template>
  <transition name="confirm-fade">
    <div>
      <div class="confirm" v-show="showFlag" @click.stop>
      </div>
      <div class="confirm-wrapper" v-show="showFlagTwo" @click.stop>
        <div class="confirm-content">
          <div class="text-wrap">
            <p class="text">{{text}}</p>
            <group v-if="!isChooseSec">
              <x-input placeholder="统一输入零售标价" v-model="inputTextOne" @on-focus="changeBug" @on-blur="loseBug"></x-input>
            </group>
            <group v-if="!isChooseSec">
              <x-input placeholder="统一输入零售底价" v-model="inputTextTwo" @on-focus="changeBug" @on-blur="loseBug"></x-input>
            </group>
            <group>
              <x-input placeholder="统一输入直采价" v-model="inputTextThree" @on-focus="changeBug" @on-blur="loseBug"></x-input>
            </group>
            <group>
              <x-input placeholder="统一输入库存" v-model="inputTextFour" @on-focus="changeBug" @on-blur="loseBug"></x-input>
            </group>
          </div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {dev} from 'common/js/dev'
  import {XInput, Group} from 'vux'
  export default {
    components: {
      XInput,
      Group
    },
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      max: {
        type: Number,
        default: null
      },
      isChooseSec: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showFlag: false,
        showFlagTwo: false,
        inputTextOne: '',
        inputTextTwo: '',
        inputTextThree: '',
        inputTextFour: ''
      }
    },
    methods: {
      changeBug() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.add('full-body')
        }
      },
      loseBug() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.remove('full-body')
        }
      },
      show() {
        this.showFlag = true
        this.showFlagTwo = true
      },
      hide() {
        this.showFlag = false
        this.showFlagTwo = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confirm() {
        if (!this.isChooseSec) {
          if (this.inputTextOne.length === 0) {
            this.$vux.toast.text('请输入零售标价', 'middle')
            return false
          }
          if (this.inputTextTwo.length === 0) {
            this.$vux.toast.text('请输入零售底价', 'middle')
            return false
          }
          if (!(+this.inputTextOne > +this.inputTextTwo)) {
            this.$vux.toast.text('零售底价应小于零售标价', 'middle')
            return false
          }
          if (this.inputTextThree.length === 0) {
            this.$vux.toast.text('请输入直采价', 'middle')
            return false
          }
          if (!(+this.inputTextTwo > +this.inputTextThree)) {
            this.$vux.toast.text('直采价应小于零售底价', 'middle')
            return false
          }
        }
        if (this.inputTextFour.length === 0) {
          this.$vux.toast.text('请输入库存', 'middle')
          return false
        }
        this.hide()
        this.$emit('confirm', this.inputTextOne, this.inputTextTwo, this.inputTextThree, this.inputTextFour)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
  .confirm-wrapper
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    z-index: 999
    width: 86.67%
    border-radius: 13px
    background: $color-f7
    overflow: hidden
    .confirm-content
      font-size: 28px;/*px*/
      position: relative
      .text-wrap
        padding: 0 30px 70px;/*px*/
        border-bottom: 1px solid $color-border;/*no*/
        display: block
        .vux-x-textarea
          position: relative
          height: auto;
          clearfix()
        textarea
          width: 100%
          height: 112px;/*px*/
          line-height: 1.3
          border 1px solid $color-border!important;/*no*/
          font-size: 26px;/*px*/
        >div
          margin-bottom: 26px
      .text
        line-height: 1.5
        text-align: center
        color: $color-0
        font-size: 34px;/*px*/
        padding: 40px
      .operate
        display: flex
        align-items: center
        text-align: center
        font-size: 34px;/*px*/
        .operate-btn
          flex: 1
          line-height: 88px;/*px*/
          color: $color-blue
          &.left
            border-right: 1px solid $color-border;/*no*/

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>