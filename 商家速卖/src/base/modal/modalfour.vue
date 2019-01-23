<template>
  <transition name="popup-fade">
    <div class="cover" v-show="flag">
      <transition name="popup-move">
        <div class="card-modal">
          <i @click="hide"></i>
          <div class="modal-top">
            <img src="./no-pass.png"/>
          </div>
          <div class="modal-bottom">
            <h5>审核不通过原因</h5>
          </div>
          <div class="fail">
            <div class="no-info" @click="Info(0)"><i :class="{'active': selectIndex === 0 && !this.cause}"></i><span>资料不符合</span></div>
            <div class="no-pro" @click="Info(1)"><i :class="{'active': selectIndex === 1 && !this.cause}"></i><span>期望采购品类与店铺主营品类不符</span></div>
            <div class="no-check" @click="Info(2)">
              <i :class="{'active': selectIndex === 2 || this.cause}"></i>
              <input type="text" placeholder="请输入审核不通过原因" v-model="cause" maxlength="30" autofocus="autofocus"  @on-focus="changeBug" @on-blur="loseBug"></div>
          </div>
          <div class="sure go" @click="comfirm">确定</div>
          <pop ref="popShow" :title="messPop"></pop>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { loadData, STATUS_OK } from 'api/common'
  import { ToastPlugin } from 'vux'
  import {dev} from 'common/js/dev'
  import Pop from 'base/pop/pop'
  Vue.use(ToastPlugin)
  import Vue from 'vue'
  export default {
    props: [
      'modal'
    ],
    data() {
      return {
        flag: false,
        selectIndex: 0,
        reason: 0,
        cause: '',
        messPop: ''
      }
    },
    components: {
      Pop
    },
    methods: {
      changeBug() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.add('full-body')
        }
      },
      loseBug() {
        let currentDev = dev()
        if (currentDev === 'iOS') {
          document.body.classList.remove('full-body')
        }
      },
      // 不通过接口
      comfirm() {
        let URL = 'shopAuthAudit'
        let obj = {
          status: 2,
          shopauth_id: this.$route.params.id
        }
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
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$router.push('/special-card')
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
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .cover
    position: absolute
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
  .card-modal
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
      left: 48%
      top: 110%
      width: 42px;/*px*/
      height: 43px;/*px*/
      background: url('close.png') no-repeat center center
      background-size: 100% auto  
    .modal-top
      img
        position: absolute
        top: -100px
        left: 35%
        width: 233px;/*px*/
        height: 200px;/*px*/
    .modal-bottom
      padding-top: 160px
      text-align: center
      font-size: 36px;/*px*/
      color: $color-orange
    .sure
      width: 160px;/*px*/
      height: 80px;/*px*/
      background: $color-orange
      line-height: 80px;/*px*/
      text-align: center
      margin: 0 auto
      margin-top: 90px
      margin-bottom: 50px
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
            background-size: 20px 20px;/*px*/
            border: 2px solid $color-orange;/*no*/
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
          right: 20px
          top: 165px
      .no-check
        padding-top: 135px
        margin-left: 102px
        input
          height: 56px;/*px*/
          width: 400px;/*px*/
          border: 1px solid $color-df;/*no*/
          padding-left: 20px
        input::-webkit-input-placeholder
          line-height: 30px;
        i
          display: inline-block
          width: 40px;/*px*/
          height: 40px;/*px*/
          border-radius: 50%
          position: absolute
          left: 40px
          top: 270px
          border: 2px solid $color-a6;/*no*/
          &.active
            background:url('circle.png') no-repeat center center
            border: 2px solid $color-orange;/*no*/
            background-size: 20px 20px;/*px*/
      .go
        margin-top: 50px
</style>