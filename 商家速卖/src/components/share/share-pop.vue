<template>
  <div>
    <div class="modal" v-show="modal_show" @click="modalHide"></div>
    <div class="modal-content" v-show="modal_show">
      <div class="item" ref="one"><img src="./t-wx@2x.png"><p>微信好友</p></div>
      <div class="item" ref="two"><img src="./t-wxzoom@2x.png"><p>朋友圈</p></div>
      <div class="item" ref="three"><img src="./t-qq@2x.png"><p>QQ好友</p></div>
      <div class="item" ref="four"><img src="./t-qqzoom@2x.png"><p>QQ空间</p></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal_show: false
      }
    },
    created() {
      //
    },
    methods: {
      modalShow () {
        this.modal_show = true
        setTimeout(() => {
          this.$refs.one.style.transform = 'scale(1)'
        }, 400)
        setTimeout(() => {
          this.$refs.two.style.transform = 'scale(1)'
        }, 600)
        setTimeout(() => {
          this.$refs.three.style.transform = 'scale(1)'
        }, 800)
        setTimeout(() => {
          this.$refs.four.style.transform = 'scale(1)'
        }, 1000)
      },
      modalHide() {
        this.modal_show = false
        this.$refs.one.style.transform = 'scale(0)'
        this.$refs.two.style.transform = 'scale(0)'
        this.$refs.three.style.transform = 'scale(0)'
        this.$refs.four.style.transform = 'scale(0)'
      }
    }
  }
  
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .modal
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    z-index 100
    background :rgba(0,0,0,0.5)
  .modal-content
    position fixed
    top 50%
    width: 100%
    transform translateY(-50%)
    z-index 101
    display flex
    justify-content space-around
    align-items center
    .item
      transform: scale(0)
      transition: all 0.4s ease-in
      p
        flex 1
        color $color-white
        text-align center
      img
        height: 120px
        width: 120px
        margin-bottom: 30px
</style>