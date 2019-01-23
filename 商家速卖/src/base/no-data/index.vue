<template>
  <div class="no-data">
    <img :src="img">
    <p>{{text}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      img: {
        type: String,
        default: require('./no-data@2x.png')
      },
      text: ''
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
    .no-data
      padding: 192px 0 0
      img
        display: block
        width: 42.3%
        margin: 0 auto
      p
        text-align: center
        font-size: 24px;/*px*/
        color: $color-bc
        margin-top: 40px
</style>
