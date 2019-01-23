<template>
  <div class="del">
    <div class="left">
      <img :src="isCheckAll ? require('./images/check_on.png') : require('./images/check_off.png')" alt="" @click="checkAll">
      <span>全选</span>
      <span>共{{totalKinds}}种{{totalNumber}}件</span>
    </div>
    <div class="right can-del" @click="addQuotation">
      添加
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isCheckAll: {
      type: Boolean,
      default: false
    },
    totalKinds: {
      type: Number,
      default: 0
    },
    totalNumber: {
      type: Number,
      default: 0
    }
  },
  methods: {
    addQuotation () {
      this.$emit('addQuotation')
    },
    checkAll () {
      this.$emit('checkAll')
    }
  }
}
</script>

<style lang="stylus" scoped>
.del
  display flex
  align-items center
  height 98px
  .left
    display flex
    flex 1
    align-items center
    height 100%
    border-top 1px solid  #E4E4E4;/*no*/
    padding-left 30px
    img
      width 30px
      height 30px
    span:nth-of-type(1)
      margin-left 16px
      color #333
      font-size 28px
    span:nth-of-type(2)
      margin-left 16px
      font-size 24px
      color #9B9B9B
  .right
    width 280px
    font-size 36px
    color #FFF
    background #CCCCCC
    height 98px
    line-height 98px
    text-align center
  .can-del
    background #FF8A00
</style>
