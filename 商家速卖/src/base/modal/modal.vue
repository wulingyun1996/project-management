<template>
  <transition name="popup-fade">
    <div class="cover" v-show="flag">
      <transition name="popup-move">
        <div class="modalone">
          <i @click="hide"></i>
          <div class="modal-top">
            <img src="./shop.png">
          </div>
          <div class="modal-bottom">
            <h5>您的店铺信息尚未完善</h5>
            <p>请完善店铺信息后才能管理特约卡</p>
          </div>
          <div class="btn-box">
            <router-link to="/set-shop" tag="a" class="info">去完善店铺信息</router-link>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
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
        this.flag = false
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .cover
    position: fixed
    left: 0
    top: 0
    z-index: 201
    width: 100%
    height: 100%
    overflow: hidden
    background-color: $color-cover-background
    &.popup-fade-enter, &.popup-fade-leave-active
      opacity: 0
    &.popup-fade-enter-active, &.popup-fade-leave-active
      transition: all .3s ease-in-out
  .modalone
    width: 72%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    background: $color-white
    border-radius: 28px
    &.popup-move-enter, &.popup-move-leave-active
      transform: translate3d(0, 100%, 0);/*px*/
    &.popup-move-enter-active, &.popup-move-leave-active
      transition: all .3s ease-in-out
    i
      position: absolute
      right: 50%
      top: 110%
      width: 44px;/*px*/
      height: 44px;/*px*/
      background: url('close.png') no-repeat center center
      background-size: 100% auto  
    .modal-top
      padding-top: 86px
      text-align: center
      img
        width: 227px;/*px*/
        height: 148px;/*px*/
    .modal-bottom
      padding: 46px
      h5, p
        text-align: left
        font-size: 30px;/*px*/
        color: $color-6
      p
        padding-top: 14px
    .btn-box
      .info
        text-align: center
        border-top: 1px solid $color-df;/*no*/
        display: block
        font-size: 34px;/*px*/
        color: $color-blue
        padding: 30px 0
</style>