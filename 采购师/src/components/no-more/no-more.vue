<template>
  <div class="no-more">{{ message }}</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    message: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.no-more
  color #ccc
  font-size 20px;/*px*/
  padding 20px 0 44px
  text-align center
  line-height 1.5
</style>
