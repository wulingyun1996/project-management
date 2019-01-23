<template>
  <div class="foot-btn" @click="footBtnClick">
    {{text}}
  </div>
</template>

<script>
  export default {
    props: ['text'],
    methods: {
      footBtnClick() {
        this.$emit('footBtnClick')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .foot-btn
    position :fixed
    bottom :0
    left :0
    right: 0
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    text-align :center
    background :$color-orange
    font-size :36px;/*px*/
    color: #fff
</style>
