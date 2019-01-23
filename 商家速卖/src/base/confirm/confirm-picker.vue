<template>
  <transition name="picker-fade">
    <div class="picker" v-show="state===1" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div class="picker-panel" v-show="state===1" @click.stop>
          <div class="picker-choose">
            <span class="cancel" @click="cancel">{{cancelTxt}}</span>
            <span class="confirm-btn" @click="confirm">{{confirmTxt}}</span>
          </div>
          <div class="picker-singer">
            <picker :data='data' v-model='value' @on-change='change' ref="picker"></picker>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { Picker } from 'vux'
  export default {
    components: {
      Picker
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      cancelTxt: {
        type: String,
        default: '取消'
      },
      confirmTxt: {
        type: String,
        default: '完成'
      }
    },
    data() {
      return {
        state: 0,
        select: this.value
      }
    },
    methods: {
      show() {
        this.state = 1
      },
      change(value) {
        this.select = value
      },
      cancel() {
        this.state = 0
      },
      confirm() {
        this.$emit('change', this.select, this.$refs.picker.getNameValues())
        this.state = 0
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .picker-view
    .select
      margin: 0 10px 40px 10px
      height: 40px
      line-height: 40px
      border: 1px solid #e5e5e5;/*no*/
      text-align: center
      background: $color-white
  .picker
    position: fixed
    left: 0
    top: 0
    z-index: 201
    width: 100%
    height: 100%
    overflow: hidden
    text-align: center
    background-color: $color-cover-background
    &.picker-fade-enter, &.picker-fade-leave-active
      opacity: 0
    &.picker-fade-enter-active, &.picker-fade-leave-active
      transition: all .3s ease-in-out
    .picker-panel
      position: absolute
      z-index: 600
      bottom: 0
      width: 100%
      background: $color-white
      &.picker-move-enter, &.picker-move-leave-active
        transform: translate3d(0, 273px, 0)
      &.picker-move-enter-active, &.picker-move-leave-active
        transition: all .3s ease-in-out
      .picker-choose
        position: relative
        height: 88px;/*px*/
        font-size: 30px;/*px*/
        border-bottom()
        .confirm-btn, .cancel
          position: absolute
          padding: 0 25px
          line-height: 90px;/*px*/
        .confirm-btn
          right: 0
          color: $color-orange
        .cancel
          left: 0
          color: $color-0
</style>
