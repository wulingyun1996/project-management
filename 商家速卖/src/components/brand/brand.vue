<template>
  <div id="brandmanage" v-show="isShowBrandContainer">
    <div class="brandone" :class="{active: !Brandlists.length}">
      <div class="img-box" v-for="(item, index) in Brandlists">
        <div class="pic" @click="Brandinfo(item)">
          <img :src="item.image_path" style="width: 100%"/>
          <span class="bottom-txt">{{item.name}}</span>
        </div>
        <div class="txt">
          <span class="redact" @click="showPopup(0, item)">编辑</span>
          <i class="edit" @click="showPopup(0, item)"></i>
          <span class="remove" @click="showPopup(1, item, index)">删除</span>
          <i class="del" @click="showPopup(1, item, index)"></i>
        </div>
      </div>
      <div class="brand-no-more" v-if="!Brandlists.length">
        <div class="brand-description">
          <h1>为什么添加品牌信息？</h1>
          <p>
            <span>·</span>可在采购师APP端店铺中呈现，
            便于推广传播，提升品牌背书
          </p>
          <p>
            <span>·</span>可快速选择您添加的品牌进行商品发布
          </p>
        </div>
        <div @click="AddBrand" class="addbrand">立即添加品牌</div>
      </div>
    </div>
    <div class="Addbtn" @click="AddBrand" v-if="Brandlists.length" v-show="isShow">新增品牌
    </div>
    <!-- 弹窗 -->
    <div class="brand-confirm-container" v-show="isShowPopup">
      <div class="brand-confirm-popup">
        <div class="brand-confirm-wrapper">
          <span @click="hidePopup"></span>
          <h1>您确定要{{ operationTitle }}该品牌吗?</h1>
          <p>
            {{ operationTitle }}后，使用该品牌发布的商品
          </p>
          <p>
            再次编辑时将需要重新选择品牌
          </p>
          <div class="brand-confirm-button">
            <button class="brand-cancle" @click="hidePopup">取消</button>
            <button class="brand-confirm" @click="confirm">确定</button>
          </div>
        </div>
      </div>
    </div>
    <loading v-show="!hasMore" title=""></loading>
  </div>
</template>

<script>
import { loadData, STATUS_OK } from 'api/common'
import { nativeBackBase } from 'api/init'
import Loading from 'base/loading/loading'
const nativeFun = {
  'left': [
    {
      'title': 'back',
      'function': 'nativeBackSetShop()'
    }]
}
export default {
  data() {
    return {
      list: false,
      show2: false,
      isShow: true,
      hasMore: true,
      isShowBrandContainer: false,
      operationTitle: '编辑',
      operationType: 0,
      operationId: '',
      operationIndex: 0,
      isShowPopup: false,
      Brandlists: []
    }
  },
  created() {
    this.BrandList()
    window.nativeBackSetShop = this.nativeBackSetShop
    nativeBackBase(nativeFun)
  },
  methods: {
    nativeBackSetShop () {
      this.$router.push('/set-shop')
      delete window.nativeBackSetShop
    },
    confirm () {
      let id = this.operationId
      if (this.operationType === 1) {
        let URL = '/shop/delBrand'
        let obj = {
          id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.hidePopup()
            this.Brandlists.splice(this.operationIndex, 1)
            this.checkLength(this.Brandlists)
          }
        })
        return
      }
      this.Edit(id)
    },
    showPopup (type, item, index) {
      this.operationType = type
      this.operationId = item.id
      this.operationIndex = index
      if (type === 0) {
        this.operationTitle = '编辑'
      } else {
        this.operationTitle = '删除'
      }
      this.isShowPopup = true
    },
    hidePopup () {
      this.isShowPopup = false
    },
    Brandinfo(item) {
      this.$router.push(`/check-brand/${item.id}`)
    },
    AddBrand() {
      this.$router.replace('/add-brand')
    },
    // 品牌列表接口
    BrandList() {
      let URL = '/shop/showBrand'
      loadData(URL).then((res) => {
        if (res.code === STATUS_OK) {
          this.Brandlists = res.data
          this.checkLength(this.Brandlists)
          this.isShowBrandContainer = true
        }
      })
    },
    checkLength(data) {
      if (data.length === 5) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    // 品牌编辑接口
    Edit (id) {
      let URL = '/shop/brandDetail'
      let obj = {
        id
      }
      loadData(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.$router.push(`/edit-brand/${id}`)
        }
      })
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin.styl"
@import "~common/stylus/variable.styl"
#brandmanage
  height 100%
  background: $color-white
  .brandone
    display: flex
    overflow: hidden
    flex-wrap: wrap
    &.active
      height 100%
    .img-box
      padding-top: 50px
      padding-left: 50px
      width: 50%
      &:nth-child(2n)
        padding-left: 30px!important
      .pic
        width: 300px;/*px*/
        height: 300px;/*px*/
        position: relative
        // border: 1px solid $color-df;/*no*/
        &.active
          border: 1px solid $color-df;/*no*/
        .bottom-txt
          display: block
          position: absolute
          bottom: 0
          height: 54px;/*px*/
          text-align: center
          width: 100%
          background: $color-0
          opacity: 0.5
          color: $color-white
          line-height: 54px
          font-size: 28px;/*px*/
      .txt
        display: flex
        .redact,.remove
          font-size: 26px;/*px*/
          color: $color-8e
        .redact
          padding: 24px 14px 50px 18px!important
        .edit
          display: inline-block
          width: 27px;/*px*/
          height: 28px;/*px*/
          background: url('edit.png') no-repeat
          background-size: 100% auto
          margin-top: 22px
        .remove
          margin-left: 78px
          margin-top: 22px
          padding-right: 14px
        .del
          display: inline-block
          width: 25px;/*px*/
          height: 25px;/*px*/
          background: url('del.png') no-repeat
          background-size: 100% auto
          margin-top: 22px
    .brand-no-more
      width: 100%!important
      height 100%
      bg('bg.png')
      overflow hidden
      .brand-description
        width 580px
        height 500px
        margin 112px auto 0
        background rgba(255, 157, 0, .1)
        border-radius(16px)
        h1
          fz(24px)
          margin-top 80px
          color $color-orange
          line-height 66px
          tc()
        p
          f16()
          flex-f()
          margin-top 40px
          line-height 44px
          color $color-3
          padding 0 50px
          span
            font-weight 700
      .addbrand
        width 320px
        height 100px
        margin 66px auto 0
        line-height 100px
        background $color-orange
        color $color-white
        border-radius(10px)
        tc()
        fz(18px)
  .Addbtn
    position :fixed
    bottom :0
    left :0
    right: 0
    height: 94px
    line-height: 94px
    text-align :center
    background :$color-orange
    font-size :36px
    color: $color-white
    width: 100%
.brand-confirm-container
  pf(100%)
  top 0
  background rgba(0, 0, 0, .7)
  .brand-confirm-popup
    width 540px
    height 330px
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background $color-white
    padding 24px
    border-radius(16px)
    .brand-confirm-wrapper
      position relative
      width 100%
      height 100%
      padding 0 30px
      span
        wh(24px)
        position absolute
        right -10px
        top -10px
        bg('close.png')
        box-sizing content-box
        padding 10px
        background-origin content-box
      h1
        f16()
        tc()
        padding-top 40px
        padding-bottom 15px
        padding-left 14px
        line-height 44px
        color $color-0
      p
        color $color-9
        f12()
        line-height 34px
        tc()
      .brand-confirm-button
        margin-top 34px
        flex-align-item()
        justify-content space-around
        button
          f14()
          width 160px
          height 56px
          bd($color-orange)
          tc()
          padding 0
          border-radius(10px)
          &.brand-cancle
            color $color-orange
          &.brand-confirm
            color $color-white
            background $color-orange
</style>
