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
    color: #a6a6a6
    font-size: 24px;/*px*/
    padding: 22px 0
    text-align: center
    line-height: 1.5
</style>
