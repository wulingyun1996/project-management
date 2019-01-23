<template>
  <transition name="popup-fade">
    <div class="cover" v-show="flag">
      <transition name="popup-move">
        <div class="modalthree">
          <i @click="hide"></i>
          <div class="modal-top">
            <img src="./check.png">
          </div>
          <div class="modal-bottom">
            <div class="pass"><i :class="{'active': currentIndex === 0}" @click="changeTab(0)" class="circle"></i><span>通过</span></div>
            <div class="besides"><i :class="{'active': currentIndex === 1}" @click="changeTab(1)"></i><span>不通过</span></div>
          </div>
          <div class="fail" v-show="currentIndex === 1">
            <div class="no-info" @click="Info(0)"><i :class="{'active': selectIndex === 0 && !this.cause}"></i><span>资料不符合</span></div>
            <div class="no-pro" @click="Info(1)"><i :class="{'active': selectIndex === 1 && !this.cause}"></i><span>期望采购品类与店铺主营品类不符</span></div>
            <div class="no-check" @click="Info(2)">
              <i :class="{'active': selectIndex === 2 || this.cause}"></i>
              <textarea placeholder="请输入审核不通过原因" v-model="cause" maxlength="30"></textarea>
            </div>
          </div>
          <div class="sure" @click="comfirm">确定</div>
          <pop ref="popShow" :title="messPop"></pop>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { loadData, STATUS_OK } from 'api/common'
  import Pop from 'base/pop/pop'
  import { ToastPlugin } from 'vux'
  Vue.use(ToastPlugin)
  import Vue from 'vue'
  export default {
    props: [
      'modal'
    ],
    data() {
      return {
        messPop: '',
        flag: false,
        currentIndex: 0,
        selectIndex: 0,
        reason: 0,
        cause: ''
      }
    },
    methods: {
      changeTab(index) {
        this.currentIndex = index
      },
      comfirm() {
        let URL = 'shopAuthAudit'
        let obj = {
          status: this.currentIndex + 1,
          shopauth_id: this.modal.id
        }
        if (this.currentIndex === 1) {
          if (this.selectIndex === 2) {
            if (!this.cause) {
              this.messPop = '请选择未通过原因'
              this.$refs.popShow.show()
              this.$refs.popShow.hide()
            } else {
              obj = Object.assign({}, obj, {reject_reason: this.cause})
            }
          } else {
            obj = Object.assign({}, obj, {reject_id: this.reason + 1})
          }
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (this.currentIndex === 0) {
              this.$vux.toast.text('审核通过')
            }
            this.flag = false
            this.currentIndex = 0
            this.selectIndex = 0
            this.reason = 0
            this.$emit('confirm')
          } else {
            console.log('lose')
          }
        })
      },
      Info(index) {
        this.selectIndex = index
        if (index !== 2) {
          this.reason = index
          this.cause = ''
        } else {
          this.reason = 0
        }
      },
      show() {
        this.flag = true
      },
      hide() {
        this.flag = false
        this.currentIndex = 0
        this.selectIndex = 0
        this.reason = 0
        this.cause = ''
      }
    },
    components: {
      Pop
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
    background-color: $color-cover-background
    &.popup-fade-enter, &.popup-fade-leave-active
      opacity: 0
    &.popup-fade-enter-active, &.popup-fade-leave-active
      transition: all .3s ease-in-out
  .modalthree
    width: 80%
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
      left: 45%
      top: 110%
      width: 42px;/*px*/
      height: 43px;/*px*/
      background: url('close.png') no-repeat
      background-size: 100% auto
    .modal-top
      img
        display: inline-block
        width: 190px;/*px*/
        height: 223px;/*px*/
        position: absolute
        top: -100px
        left: 35%
    .modal-bottom
      padding-top: 180px
      display: flex
      padding-left: 102px
      .pass,.besides
        i
          display: inline-block
          width: 40px;/*px*/
          height: 40px;/*px*/
          border-radius: 50%
          border: 2px solid $color-a6;/*no*/
          position: absolute
          top: 172px
          left: 40px
          &.active
            background:url('circle.png') no-repeat center center
            border: 2px solid $color-orange;/*no*/
            background-size: 20px 20px;/*px*/
        span
          color: $color-6
          font-size: 30px;/*px*/
      .besides
        padding-left: 120px
        i
         left: 280px
        span
          margin-left: 70px
    .sure
      width: 160px;/*px*/
      height: 80px;/*px*/
      background: $color-orange
      line-height: 80px;/*px*/
      text-align: center
      margin: 0 auto
      margin-bottom: 50px
      margin-top: 90px
      font-size: 34px;/*px*/
      color: $color-white
    .fail
      position: relative
      .no-info
        padding-top: 66px
        i
          display: inline-block
          width: 40px;/*px*/
          height: 40px;/*px*/
          border-radius: 50%
          position: absolute
          left: 40px
          top: 66px
          border: 2px solid $color-a6;/*no*/
          &.active
            background:url('circle.png') no-repeat center center
            border: 2px solid $color-orange;/*no*/
            background-size: 20px 20px;/*px*/
        span
          position: absolute
          color: $color-6
          font-size: 30px;/*px*/
          left: 98px
          top: 70px
      .no-pro
        padding-top: 58px
        i
          display: inline-block
          width: 40px;/*px*/
          height: 40px;/*px*/
          border-radius: 50%
          position: absolute
          left: 40px
          top: 160px
          border: 2px solid $color-a6;/*no*/
          &.active
            background:url('circle.png') no-repeat center center
            border: 2px solid $color-orange;/*no*/
            background-size: 20px 20px;/*px*/
        span
          position: absolute  
          color: $color-6
          font-size: 30px;/*px*/
          left: 98px
          top: 165px
      .no-check
        margin-top: 120px
        margin-left: 102px
        textarea
          display: flex
          align-item: center
          height: 66px;/*px*/
          padding-left: 20px
          width: 450px;/*px*/
          border: 1px solid $color-df;/*no*/
          font-size: 26px;/*px*/
          padding: 12px 20px
          word-wrap: break-word
          outline: none
          overflow-x: hidden
          overflow-y: auto
          -webkit-user-modify: read-write-plaintext-only
        i
          display: inline-block
          width: 40px;/*px*/
          height: 40px;/*px*/
          border-radius: 50%
          position: absolute
          left: 40px
          top: 250px
          border: 2px solid $color-a6;/*no*/
          &.active
            background:url('circle.png') no-repeat center center
            border: 2px solid $color-orange;/*no*/
            background-size: 20px 20px;/*px*/
      .go
        margin-top: 50px
</style>