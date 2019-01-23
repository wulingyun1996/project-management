<template>
  <!-- <div class="page"> -->
    <div class="wrapper" ref="wrapper">
        <slot name="content">{{content}}</slot>
    </div>
  <!-- </div> -->
</template>

<script scoped type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: 1,
          click: true,
          scrollX: false
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .page
    position: fixed
    z-index: 200
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #f8f8f8
  .wrapper
    // position: absolute
    // top: 92px;/*px*/
    // top: 0
    // bottom: 0
    width: 100%
    height: 100%
    background: $color-white
</style>
