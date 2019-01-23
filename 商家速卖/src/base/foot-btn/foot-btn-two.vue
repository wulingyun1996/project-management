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
  .foot-btn
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    text-align: center
    background: #ff8a00
    font-size: 36px;/*px*/
    color: #fff
</style>