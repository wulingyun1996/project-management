<template>
  <div class="loading">
    <img src="./images/loading.gif">
    <span class="desc">{{ title }}</span>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>
<style scoped lang="stylus">
  @import '~@/assets/css/variable'
  .loading
    width: 100%
    display flex
    align-items center
    justify-content center
    padding: 20px 0
    img
      width: 50px;/*px*/
      height: 50px;/*px*/
      margin-right: 10px
    .desc
      line-height: 20px
      font-size: 24px;/*px*/
      color: $color-6
</style>
