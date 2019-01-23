<template>
  <div class="my-honey-container">
    <div class="honey-info-top">
      <div class="honey-info-container">

      </div>
      <div class="rule">蜂蜜规则</div>
    </div>
  </div>
</template>

<script>
import honeyHeader from 'components/header'
import BaseScroll from 'components/scroll/scroll'
import { mixins } from 'mixins'
export default {
  name: 'MyHoney',
  mixins: [mixins],
  data () {
    return {
    }
  },
  components: {
    honeyHeader,
    BaseScroll
  }
}
</script>
<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.my-honey-container
  .honey-info-top
    width 100%
    height 276px
    bg('bg.png')
    position relative
    .honey-info-container
      width 370px
      height 130px
      background: rgba(255,255,255,0.30)
      border-radius: 10px
      position absolute
      left 50%
      margin-left -185px
      top 52px
    .rule
      position absolute
      top 16px
      right 32px
      font-size 26px
      color #D0021B
</style>
