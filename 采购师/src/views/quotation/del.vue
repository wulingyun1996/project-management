<template>
  <div class="del">
    <div class="left">
      <div class="check-img" @click="checkAll">
        <img :src="isCheckAll ? require('./images/check_on.png') : require('./images/check_off.png')" alt="">
      </div>
      <span>全选</span>
      <span>共{{totalKinds}}种{{totalNumber}}件</span>
    </div>
    <div class="right" :class="isSelect ? 'can-del' : ''" @click="del">
      删除
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSelect: {
      type: Boolean,
      default: false
    },
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
    del () {
      this.$emit('del')
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
    .check-img
      height 98px
      padding-left 38px
      display flex
      align-items center
      padding-right 16px
    img
      width 30px
      height 30px
    span:nth-of-type(1)
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
