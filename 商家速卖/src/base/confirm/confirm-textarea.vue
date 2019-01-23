<template>
  <transition name="confirm-fade">
    <div>
      <div class="confirm" v-show="showFlag" @click.stop>
      </div>
      <div class="confirm-wrapper" v-show="showFlagTwo" @click.stop>
        <div class="confirm-content">
          <div class="text-wrap">
            <p class="text">{{ text }}</p>
            <group>
              <x-textarea
                :max='max'
                show-counter
                :placeholder="placeholder"
                v-model="areaText"
                :rows="3"
                @on-focus="changeBug"
                @on-blur="loseBug">
              </x-textarea>
            </group>
          </div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{ cancelBtnText }}</div>
            <div @click="confirm" class="operate-btn">{{ confirmBtnText }}</div>
          </div>
          <!-- <i class="close" @click="cancel"></i> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { dev } from 'common/js/dev'
import { mapMutations } from 'vuex'
import { XTextarea, Group } from 'vux'
export default {
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
    inputValue: {
      default: ''
    },
    placeholder: ''
  },
  data() {
    return {
      showFlag: false,
      showFlagTwo: false,
      areaText: this.inputValue || ''
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
    cancel () {
      // this.areaText = ''
      this.COMMODITY(this.areaText)
      this.hide()
      this.$emit('cancel')
    },
    ...mapMutations(['COMMODITY']),
    confirm() {
      this.areaText = this.areaText.replace(/\s/g, '')
      this.areaText = this.areaText.replace(/[\r\n]/g, '')
      if (this.areaText.length === 0) {
        this.$vux.toast.text('内容不能为空', 'middle')
      } else {
        this.hide()
        this.COMMODITY(this.areaText)
        this.areaText = ''
        this.$emit('confirm')
      }
    },
    closePop() {
      this.hide()
      this.$emit('cancel')
    },
    hideOper() {
      document.querySelector('.operate').style.display = 'none'
    },
    hideClose() {
      document.querySelector('.close').style.display = 'none'
    }
  },
  components: {
    XTextarea,
    Group
  },
  watch: {
    inputValue (val) {
      this.areaText = val
    }
  }
}
</script>

<style lang="stylus">
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
  margin: 0 auto
  z-index: 999
  width: 70%
  border-radius: 22px
  background: $color-white
  overflow: hidden
  .confirm-content
    font-size: 28px;/*px*/
    position: relative
    .text-wrap
      padding: 0 30px 40px;/*px*/
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
    .text
      line-height: 1.5
      text-align: center
      color: $color-0
      font-size: 34px;/*px*/
      padding: 40px
    .close
      display: block
      width: 26px;/*px*/
      height: 26px;/*px*/
      background: url('x@2x.png') no-repeat center
      background-size: 100% auto
      position: absolute
      right: 26px
      top: 24px
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