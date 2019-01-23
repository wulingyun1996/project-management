<template>
  <div class="pop" v-show="isShow">
    <div class="pop-content">
      <h1>{{ title }}</h1>
      <div class="choice">
        <div class="cancel" @click="cancel">取消</div>
        <div class="confirm" @click="confirm">{{ confirmTxt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '您还未开通联盟商~'
    },
    confirmTxt: {
      type: String,
      default: '去开通'
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    cancel () {
      this.isShow = false
    },
    confirm () {
      alert('去开通角色')
    }
  }
}
</script>

<style lang='stylus' scoped>
.pop
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  background rgba(0, 0, 0, 0.3)
  .pop-content
    width 500px
    height 300px
    background #fff
    position absolute
    border 1px solid #ccc;/*no*/
    border-radius 20px
    left 50%
    top 50%
    transform translate(-50%, -50%)
    h1
      height 100px
      line-height 100px
    .choice
      position absolute
      width 100%
      bottom 0
      left 0
      height 100px
      line-height 100px
      display flex
      border-top 1px solid #ccc;/*no*/
      >div
        flex 1
      .cancel
        border-right 1px solid #ccc;/*no*/
</style>
