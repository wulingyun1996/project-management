<template>
  <div class="pop" v-show="flag">{{ title }}</div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        flag: false
      }
    },
    methods: {
      show() {
        this.flag = true
      },
      hide() {
        setTimeout(() => {
          this.flag = false
        }, 2000)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .pop
    max-width: 56%
    font-size: 30px;/*px*/
    padding: 20px 30px
    letter-spacing: 1px;/*no*/
    line-height: 1.3
    text-align: center
    border-radius: 10px;/*px*/
    color: $color-white
    background: rgba(0, 0, 0, .6)
    position: absolute
    left: 50%
    bottom: 178px;/*px*/
    transform: translateX(-50%)
    z-index: 300
</style>