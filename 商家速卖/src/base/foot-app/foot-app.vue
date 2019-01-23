<template>
  <div class="land-foot" id="landFoot">
    <div class="landFoot-left">
      <div class="landPic">
        <i id="closeFoot" @click="close"></i>
        <img :src="landlogo">
      </div>
      <div class="landText">
        <h5>建材商家速卖</h5>
        <p>门店经营更简单...</p>
      </div>
    </div>
    <router-link to="/share-buy" tag="div" class="landFoot-right"><span>打开APP</span></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        landlogo: require('../../../static/images/seller-sale/landlogo.png')
      }
    },
    methods: {
      close() {
        document.getElementById('landFoot').style.display = 'none'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .land-foot
    width: 100%
    height: 98px;/*px*/
    background: #8d8795 url('bgland.png') no-repeat center bottom
    background-size: 96% auto
    display: flex
    padding: 0 0 0 25px
    z-index: 99
    .landFoot-left
      flex: 1
      color: #fff
      display: flex
      align-items: center
      padding-right: 20px
      h5
        font-weight: normal
        font-size: 26px;/*px*/
      p
        text-over(1)
        font-size: 22px;/*px*/
        margin-top: 8px;
      .landText
        flex: 1
        padding-left: 3%
      .landPic
        img
          width: 60px;/*px*/
          height: 60px;/*px*/
          margin-left: 26px
          vertical-align: middle
        i
          display: inline-block
          width: 43px;/*px*/
          height: 43px;/*px*/
          border: 2px solid #fff;/*px*/
          border-radius: 50%
          background: url('de.png') no-repeat center center
          background-size: 20px 20px;/*px*/
          vertical-align: middle
    .landFoot-right
      width: 30%
      padding-left: 4%
      position: relative
      text-align: center
      background: #ff8a00 url('bgland2.png') no-repeat right bottom;
      background-size: 92% auto
      overflow: hidden
      &:after
        content: ''
        width: 0
        height: 0
        border-top: 120px solid #8d8795;/*px*/
        border-right: 52px solid transparent;/*px*/
        position: absolute
        left: 0
        bottom: 0
      span
        color: #fff
        display: block
        line-height: 98px;/*px*/
        font-size: 28px;/*px*/
</style>