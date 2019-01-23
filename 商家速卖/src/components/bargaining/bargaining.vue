<template>
  <div class="bargaining" v-show="showFlag" @click.stop>
    <div class="bar-wrapper">
      <i class="close" @click="close"></i>
      <div class="bar-top">
        <h5>我要议价</h5>
        <p><i></i>请留下您的联系方式，商家会在24小时内与您联系</p>
      </div>
      <div class="bar-main" v-for="item in setConsultation">
        <div class="bar-box">
          <div class="bar-name">商品名称</div>
          <div class="bar-des">{{item.title}}</div>
        </div>
        <div class="bar-box">
          <div class="bar-name">我的电话</div>
          <div class="bar-des">{{item.mobile}}</div>
        </div>
        <button class="sub" @click="bargaining">提交</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['setConsultation'])
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      close() {
        this.showFlag = false
      },
      bargaining() {
        this.$emit('bargaining')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .bargaining
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    .close
      display: block
      width: 60px;/*px*/
      height: 148px;/*px*/
      background: url('x.png') no-repeat top right
      background-size: 100% auto
      position: absolute
      right: 0
      top: -148px;/*px*/
    .bar-wrapper
      width: 80%
      margin: 270px auto 0
      background: $color-white
      border-radius: 20px
      position: relative
      .bar-top
        padding: 52px 0 132px
        text-align: center
        background: #feb861 url('hand.png') no-repeat bottom center
        background-size: 269px 110px;/*px*/
        border-radius: 20px 20px 0 0
        color: $color-white
        h5
          font-size: 48px;/*px*/
          font-weight: normal
        p
          font-size: 22px;/*px*/
          margin-top: 25px
          i
            display: inline-block
            width: 14px;/*px*/
            height: 14px;/*px*/
            background: url('5star.png') no-repeat center bottom
            background-size: 100% auto
            margin-right: 10px
      .bar-main
        border-radius: 0 0 20px 20px
        padding-bottom: 30px
      .bar-box
        display: flex
        font-size: 26px;/*px*/
        padding: 0 28px
        >div
          padding: 30px 0
        .bar-name
          color: $color-highlight-background
          width: 122px
        .bar-des
          color: $color-dialog-background
          border-bottom: 1px solid #e3e3e3;/*no*/
          flex: 1
          line-height: 1.3
      .sub
        display: block
        width: 66.66%
        line-height: 78px;/*px*/
        text-align: center
        border-radius: 40px
        background: $color-orange
        margin: 32px auto 0
        font-size: 36px;/*px*/
        color: $color-white
</style>
