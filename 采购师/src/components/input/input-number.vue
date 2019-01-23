<template>
  <div class="input-number-wrapper">
    <div class="number-minus" :class="{active: !disabledMin, fobidden: disabledMin}" @click="minus">
      <span>&minus;</span>
    </div>
    <div class="number-input">
      <input type="number" v-model.number="currentVal" @blur="blur">
    </div>
    <div class="number-add" :class="{active: !disabledMax, fobidden: disabledMax}" @click="add">
      <span>&#43;</span>
    </div>
  </div>
</template>

<script>
import { formatNumber } from 'common'
export default {
  props: {
    min: Number,
    max: Number,
    value: {
      validator (value) {
        if (typeof value === 'number') {
          return true
        } else if (typeof value === 'string') {
          return value === ''
        } else {
          return false
        }
      },
      default: 0
    }
  },
  data () {
    return {
      currentVal: 0
    }
  },
  computed: {
    disabledMin () {
      return typeof this.min === 'undefined' ? false : (this.currentVal === '' ? true : this.currentVal <= this.min)
    },
    disabledMax () {
      return typeof this.max === 'undefined' ? false : (this.currentVal === '' ? true : this.currentVal >= this.max)
    }
  },
  created () {
    this.currentVal = this.value
  },
  methods: {
    minus () {
      this.currentVal--
    },
    add () {
      this.currentVal++
    },
    blur () {
      if (this.currentVal === '') {
        this.currentVal = 0
        return
      }
      this.currentVal = formatNumber(this.currentVal)
    }
  },
  watch: {
    currentVal (newVal, oldVal) {
      if (newVal !== '') {
        if (typeof this.min !== 'undefined' && this.currentVal < this.min) {
          this.currentVal = this.min
        }
        if (this.max && this.currentVal > this.max) {
          this.currentVal = this.max
        }
      }
      this.$emit('input', this.currentVal)
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.input-number-wrapper
  flex-align-item()
  .number-minus,
  .number-add
    wh(56px)
    fz(20px)
    border-radius(50%)
    bd($color-de)
    tc()
    line-height 54px
    &.active
      color $color-orange
    &.fobidden
      color $color-c
      pointer-events none
  .number-add
    line-height 48px
    padding-left 2px
  .number-input
    flex-align-item()
    justify-content center
    height 56px
    max-width 100px
    padding 0 5px;/*no*/
    input
      height 100%
      width 100%
      tc()
</style>
