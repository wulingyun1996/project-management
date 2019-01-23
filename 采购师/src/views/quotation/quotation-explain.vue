<template>
  <div class="quotation-explain-container iphone-x-container-header">
    <base-scroll :hasMore="true">
      <div class="quotation-explain-body"></div>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
export default {
  components: {
    BaseScroll
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.quotation-explain-container
  pf(100%)
  left 0
  top 0
  background $color-white
  .quotation-explain-body
    width 100%
    height 7735px
    bg('quotation-explain.png')
</style>
