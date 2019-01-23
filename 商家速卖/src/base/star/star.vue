<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass, index) in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
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
      starType() {
        return 'star-' + this.size
      },
      itemClasses() {
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

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
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
          bg-image('star48s_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48s_off')
    &.star-36
      .star-item
        width: 24px
        height: 24px
        margin-right: 10px
        background-size: 24px 24px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36s_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36s_off')
    &.star-24
      .star-item
        width: 16px
        height: 16px
        margin-right: 3px
        background-size: 16px 16px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>