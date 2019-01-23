<template>
  <transition name="popup-fade">
    <div class="cover" v-show="flag">
      <transition name="popup-move">
        <div class="card-box">
          <div class="card-modal">
            <i @click="hide"></i>
            <div class="modal-bottom">
              <h5>恭喜您，特约卡活动成功开通！</h5>
              <div class="btn-box">
                <a href="javascript:;" class="info" @click="goSet">去设置特约卡活动商品</a>
              </div>
            </div>
          </div>
          <div class="hover"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modaltwo'
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
      goSet() {
        this.$router.push('/activity-product')
      },
      hide() {
        this.flag = false
        this.$router.push('/card-manage')
      }
    },
    components: {
      Modal
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
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
  .card-box
    width: 90%
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background: url('light.png') no-repeat center center
    background-size: 100% auto
    padding: 172px 64px 120px
  .card-modal
    width: 100%
    background: $color-white
    border-radius: 28px
    &.popup-move-enter, &.popup-move-leave-active
      transform: translate3d(0, 100%, 0);/*px*/
    &.popup-move-enter-active, &.popup-move-leave-active
      transition: all .3s ease-in-out
    i
      position: absolute
      right: 50%
      bottom: 24px
      width: 44px;/*px*/
      height: 44px;/*px*/
      background: url('close.png') no-repeat center center
      background-size: 100% auto  
    .modal-bottom
      padding: 154px 46px 50px
      h5
        text-align: center
        font-size: 30px;/*px*/
        color: $color-6
      .btn-box
        margin: 46px 0 0
        background: $color-orange
        .info
          text-align: center
          display: block
          font-size: 34px;/*px*/
          color: $color-white
          line-height: 80px;/*px*/
  .hover
    width: 74%
    height: 228px;/*px*/
    background: url('open.png') no-repeat top center
    background-size: 100% auto
    position: absolute
    top: 85px
    left: 50%
    transform: translateX(-50%)
</style>