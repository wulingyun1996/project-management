<template>
  <div class="set-pro">
    <base-header></base-header>
    <div class="no-more" v-if="!main_product.length">
      <div class="pic"><img src="./vacancy.png"></div>
      <p>您还没有添加主营商品哦~</p>
      <div class='add' @click="Add">
        <b class="icon" @click="Add"></b>
        <span @click="Add">主营商品</span>
      </div>
    </div>
    <div>
      <ul class="mainPro">
        <li v-for="(item,index) in main_product">
          <!-- <span>{{item}}</span> -->
          <!-- <i @click="delProduct(product[index], index)"></i> -->
          <div class="main-left">{{ item }}</div>
          <div class="main-right" @click="delProduct(product[index], index)">
            <i></i>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="isShow" v-if="main_product.length" class="lastLi"  @click="Add"> 
      <b class="icon" @click="Add"></b>
      <span class="addition" @click="Add">主营添加</span>
    </div>
    <confirm-input ref="textInput" @confirm="onConfirm" text="添加主营商品" placeholder="最多可输入10个字哦~" :max="10"></confirm-input>
      <!-- 弹窗 -->
    <base-senior-popup ref="confirmPop" height="auto" class="confirmPop">
      <div class="popdes">
        <p>退出此次编辑</p>
      </div>
      <div class="popbtn">
        <a href="javascript:" @click="cancel">否</a>
        <a href="javascript:" @click="confirm">是</a>
      </div>
    </base-senior-popup>
  </div>
  
</template>
<script type="text/ecmascript-6">
  import {dev} from 'common/js/dev'
  import {mapGetters} from 'vuex'
  import {nativeBackBase} from 'api/init'
  import { loadData, STATUS_OK } from 'api/common'
  import { ToastPlugin } from 'vux'
  Vue.use(ToastPlugin)
  import ConfirmInput from 'base/confirm/confirm-input'
  import Vue from 'vue'
  export default {
    components: {
      ConfirmInput
    },
    data() {
      return {
        main_product: [],
        isShow: true,
        product: []
      }
    },
    created() {
      this.getProduct()
    },
    beforeRouteEnter (to, from, next) {
      nativeBackBase()
      next()
    },
    computed: {
      ...mapGetters(['commodity'])
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
      Add() {
        this.$refs.textInput.show()
      },
      onConfirm () {
        let THIS = this
        let product = this.commodity
        let preg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
        if (product === '') {
          THIS.$vux.toast.text('请输入主营商品')
        } else if (!preg.test(product)) {
          THIS.$vux.toast.text('主营商品含有特殊字符')
        } else {
          let URL = 'shop/addProduct'
          let obj = {
            main_product: product
          }
          loadData(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              // if (product.length > 4) {
              //   product = product.substr(0, 4) + '...'
              // }
              this.getProduct()
              // THIS.$vux.toast.text('添加成功')
              this.$t('添加成功')
            } else if (res.code === 400) {
              THIS.$vux.toast.text(res.message)
            } else {
              // console.log(5)
            }
          })
        }
      },
      addFinished() {
        this.$router.push('./set-shop')
        this.$vux.toast.text('编辑成功')
      },
      headerBack() {
        this.$refs.confirmPop.show()
      },
      // 取消关闭弹窗
      cancel () {
        this.$refs.confirmPop.hide()
      },
      confirm () {
        this.$router.back()
      },
      // addition() {
      //   let THIS = this
      //   this.$vux.confirm.prompt('最多可输入10个字哦~', {
      //     title: '添加主营商品',
      //     inputAttrs: {
      //       maxlength: 10
      //     },
      //     onConfirm (product) {
      //       let preg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      //       THIS.product = product
      //       if (product === '') {
      //         THIS.$vux.toast.text('请输入主营商品')
      //       } else if (!preg.test(product)) {
      //         THIS.$vux.toast.text('主营商品含有特殊字符')
      //       } else {
      //         let URL = 'shop/addProduct'
      //         let obj = {
      //           main_product: product
      //         }
      //         loadData(URL, obj).then((res) => {
      //           if (res.code === STATUS_OK) {
      //             THIS.$vux.toast.text('添加成功')
      //             THIS.getProduct()
      //           } else if (res.code === 400) {
      //             THIS.$vux.toast.text(res.message)
      //           } else {
      //             console.log(5)
      //           }
      //         })
      //       }
      //     }
      //   })
      // },
      getProduct() {
        let URL = 'shop/showProduct'
        loadData(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.main_product = res.data.main_product
            this.product = res.data.product
            this.judgeLenth(this.main_product)
          }
        })
      },
      delProduct(item, index) {
        let URL = 'shop/delProduct'
        let obj = {
          main_product: item
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            // this.$vux.toast.text('删除成功')
            this.$t('删除成功')
            this.getProduct()
          }
        })
      },
      judgeLenth(data) {
        if (data.length === 6) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    background: $color-white
  .set-pro
    // background: $color-f4
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    .finished
      color #4A90E2
  .mainPro
    display: flex
    // justify-content: space-between
    flex-wrap: wrap
    width: 100%
    padding: 0 25px
    margin-top: 38px
    li
      display flex
      // margin-right 20px
      padding: 0 33px
      // position: relative
      // line-height: 72px
      // font-size: 30px;/*px*/
      background-color #F0F0F0
      border-radius 36px
      margin-bottom 28px
      align-items center
      justify-content space-between
      .main-left
        // margin-right 48px
        font-size 28px
        height: 72px
        line-height 72px
      .main-right
        width 40px
        height 40px
        margin-left 20px
        display flex
        align-items center
        justify-content center
        i
          display: inline-block
          width: 27px;/*px*/
          height: 27px;/*px*/
          background: url('two.png') no-repeat center center
          background-size: 100% auto
  .lastLi
    justify-content: center 
    align-items center
    display flex
    text-align center
    line-height 90px
    width: 100%
    height: 90px
    position: absolute
    bottom: 0
    background-color #FF8A00
    .icon
      display: block
      color: #FFFFFF 
      width: 24px;/*px*/
      height: 24px;/*px*/
      background: url('add.png')
      background-size: 100% auto
      margin-right: 10px
    .addition 
      color: #FFFFFF 
      font-size: 32px/*px*/ 
  .vux-confirm
  .product
    position: relative
    background: $color-white
  
    .vux-x-dialog
      .weui-dialog
        border-radius: 28px
        background-color: $color-f7
        max-width: 80%
        .weui-dialog__hd
          .weui-dialog__title
            font-size: 34px;/*px*/
            color: $color-0
            font-weight: 700
        .vux-prompt
          margin: 0 32px
          padding-bottom: 0!important
          .vux-prompt-msgbox
            height: 56px;/*px*/
            border: 1px solid $color-gray;/*no*/
            width: 90%
            line-height: 56px;/*px*/
            background: $color-white
            font-size: 26px;/*px*/
            color: $color-3
        .weui-dialog__ft
          border-top: 1px solid $color-gray;/*no*/
          margin-top: 94px
          &:after
            border-top: 0
          .weui-dialog__btn
            border-left: 1px solid $color-gray;/*no*/
          .weui-dialog__btn:after
            border-left: 0
          .weui-dialog__btn_default,.weui-dialog__btn_primary
            color: $color-blue
            font-size: 34px;/*px*/
            height: 88px;/*px*/
            line-height: 88px;/*px*/
  .no-more
    background: $color-body
    padding-top: 234px
    width: 100%
    padding-bottom: 620px
    margin: 0 auto
    .pic
      flex-center()
      img
        width: 345px;/*px*/
        height: 232px;/*px*/
    p 
      padding-top: 96px
      text-align: center
      font-size: 28px;/*px*/
    .add
      display: flex
      justify-content: center 
      align-items center
      text-align center
      line-height 90px
      width: 100%
      height: 90px
      position: absolute
      bottom: 0
      background-color #FF8A00
      .icon
        display: block
        color: #FFFFFF 
        width: 24px;/*px*/
        height: 24px;/*px*/
        background: url('add.png')
        background-size: 100% auto
        margin-right: 10px
      span 
        color: #FFFFFF 
        font-size: 32px/*px*/ 
  .weui-toast
    top: 40%
    .weui-toast__content 
      font-size: 32px/*px*/;
      padding: 20px!important
  .confirmPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      .popdes
        padding 50px 0
        bd-b(#ccc, width = 1px)
        p:nth-child(1)
          font-weight bold
          f16()
        p:nth-child(2)
          margin-top 40px
          font-size 28px
      .popbtn
        width 100%
        a
          width 50%
          text-align center
          display inline-block
          float left
          bd-r(#ccc, width = 1px)
          padding 30px 0
          font-size 32px
          color #4A90E2    
</style>