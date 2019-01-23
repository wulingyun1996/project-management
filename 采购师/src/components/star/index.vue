<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass, index) in itemClasses" :key="index" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.star
  font-size: 0
  .star-item
    display: inline-block
    background-repeat: no-repeat
  &.star-48
    .star-item
      width: 40px
      height: 40px
      margin-right: 22px
      background-size: 40px 40px
      &:last-child
        margin-right: 0
      &.on
        bg('star48s_on.png')
      &.half
        bg('star48_half.png')
      &.off
        bg('star48s_off.png')
  &.star-36
    .star-item
      width: 24px
      height: 24px
      margin-right: 10px
      background-size: 24px 24px
      &:last-child
        margin-right: 0
      &.on
        bg('star36s_on.png')
      &.half
        bg('star36_half.png')
      &.off
        bg('star36s_off.png')
  &.star-24
    .star-item
      width: 16px
      height: 16px
      margin-right: 3px
      background-size: 16px 16px
      &:last-child
        margin-right: 0
      &.on
        bg('star24_on.png')
      &.half
        bg('star24_half.png')
      &.off
        bg('star24_off.png')
</style>
