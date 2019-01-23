<template>
  <div class="edit">
    <div class="editone">
      <div class="brand">
        <span class="shape"></span>
        <span class="name">品牌名称</span>
        <div class="ipt">
          <input type="text" placeholder="请输入品牌名称" v-model="name" maxlength="25"/>
          <span class="number"><i>{{this.name.length}}</i>/25</span>
        </div>
      </div>
      <div class="logo">
        <span class="shape"></span>
        <span class="name">品牌LOGO</span>
        <div class="upload"  @click="load">
          <div class="uploadJia">
            <i v-show="!image_path"></i>
            <img :src="image_path">
            <span v-show="!image_path">上传照片</span>
          </div>
          <div class="size">尺寸432PX*432PX</div>
        </div>
      </div>
      <div class="introduce">
        <span class="shape"></span>
        <span class="name">品牌介绍</span>
        <div class="txt">
          <textarea type="text" placeholder="请输入品牌介绍" v-model="introduce" maxlength="300" @focus="justifyBodyHeight" @blur="restoreBodyHeight"></textarea>
          <span class="number"><i>{{this.introduce.length}}</i>/300</span>
        </div>
      </div>
    </div>
    <div ref="button" class="submit_button editbtn" @click="addBrand" :class="{ active: isActive }">保存
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { loadData, STATUS_OK } from 'api/common'
  import {dev, _postMessage} from 'common/js/dev'
  import { ToastPlugin } from 'vux'
  import Vue from 'vue'
  Vue.use(ToastPlugin)
  export default {
    data() {
      return {
        name: '',
        image_path: '',
        introduce: '',
        data: []
      }
    },
    created() {
      this.EditDetail()
      this.Btn()
      window.album = this.album
    },
    computed: {
      isActive: {
        get () {
          return this.name && this.image_path && this.introduce
        },
        set () {}
      }
    },
    methods: {
      load() {
        let currentDev = dev()
        if (currentDev === 'Android') {
          window.android.selectPic()
        } else if (currentDev === 'iOS') {
          _postMessage('', 'selectPic').then((val) => {
            this.image_path = val
          })
        } else {
          console.log('ll')
        }
      },
      album(imgUrl) {
        this.image_path = imgUrl
      },
      Btn() {
        if (this.name && this.image_path && this.introduce) {
          this.isActive = true
        } else {
          console.log(2)
        }
      },
       // 文件上传
      changeFile(imgs) {
        this.image_path = imgs.target.value
      },
      // 编辑品牌详情接口
      EditDetail(id) {
        let URL = '/shop/brandDetail'
        let obj = {
          id: this.$route.params.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.data = res.data
            this.name = res.data.name
            this.introduce = res.data.introduce
            this.image_path = res.data.image_path
            this.id = res.data.id
            // this.$vux.toast.text('保存成功')
          } else {
            console.log(7)
          }
        })
      },
      // 保存按钮
      addBrand() {
        if (!this.name.trim()) {
          this.$vux.toast.text('品牌名称不得为空')
        } else if (!this.image_path) {
          this.$vux.toast.text('请上传图片')
        } else if (!this.introduce.trim()) {
          this.$vux.toast.text('品牌介绍不得为空')
        } else {
          this.Addtrademark()
        }
      },
      // 编辑接口
      Addtrademark() {
        let URL = '/shop/shopBrand'
        let obj = {
          name: this.name.trim(),
          image_path: this.image_path,
          introduce: this.introduce,
          id: this.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('保存成功')
            this.$router.push('/brand')
          } else {
            this.$vux.toast.text(res.message)
          }
        })
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    background: $color-white
  .edit
    height 100%
    overflow hidden
    flex-col()
  .editone
    flex 1
    padding: 0 25px!important
    .brand
      display: flex
      align-items: center
      height: 70px
      margin-top: 40px
      position: relative
      .shape
        display: inline-block
        width: 8px;/*px*/
        height: 24px;/*px*/
        background: $color-orange
        font-size: 28px
        color: $color-3
      .name
        padding-left: 18px
      .ipt
        margin-left: 24px
        width: 75%
        height: auto
        border-radius: 2px
        border: 1px solid $color-df;/*no*/
        position: relative
        input
          text-indent: 18px
          padding: 24px 0
          width: 78%
          font-size: 28px;/*px*/
          color: $color-3
          &::-webkit-input-placeholder
            color: $color-bc
            font-size: 28px;/*px*/
            background-size: 100% auto
          &:-moz-placeholder
            color: $color-bc
            font-size: 28px;/*px*/
            background-size: 100% auto
        .number
          font-size: 24px;/*px*/
          color: $color-bc
          position: absolute
          right: 18px
          top: 40%
          i
            color: $color-orange
            font-style: normal
    .logo
      display: flex
      align-items: center
      height: 140px;/*px*/
      margin-top: 80px
      width: 100%
      .shape
        display: inline-block
        width: 8px;/*px*/
        height: 24px;/*px*/
        background: $color-orange
        font-size: 28px
        color: $color-3
      .name
        padding-left: 18px
      .upload
        padding-left: 24px
        position: relative
        .uploadJia
          width: 140px;/*px*/
          height: 140px;/*px*/
          border: 1px dashed $color-c;/*no*/
          position: relative
          i
            display: inline-block
            width: 39px;/*px*/
            height: 40px;/*px*/
            background: url('cross.png') no-repeat
            background-size: 100% auto
            position: absolute
            left: 50px
            top: 40px
          span
            color: $color-9
            font-size: 24px;/*px*/
            position: absolute
            bottom: 15px
            left: 20px
        .size
          color: $color-9
          font-size: 24px;/*px*/
          padding-top: 24px
    .introduce
      display: flex
      padding-top: 80px
      width: 100%
      .shape
        display: inline-block
        width: 8px;/*px*/
        height: 24px;/*px*/
        background: $color-orange
        font-size: 28px
        color: $color-3
        margin-top: 24px
      .name
        padding-left: 18px
        margin-top: 24px
      .txt
        width: 75%
        height: 380px;/*px*/
        border-radius: 2px
        border: 1px solid $color-df;/*no*/
        margin-left: 24px
        overflow: hidden
        position: relative
        textarea
          padding-left: 24px
          color: $color-3
          padding-top: 24px
          border: 0
          font-size: 28px;/*px*/
          position: relative
          width: 100%
          height: 88%
          resize: none
          touch-action auto
          overflow hidden
          overflow-y auto
          &::-webkit-input-placeholder
            color: $color-bc
            font-size: 28px;/*px*/
          &:-moz-placeholder
            color: $color-bc
            font-size: 28px;/*px*/
        .number
          font-size: 24px;/*px*/
          color: $color-bc
          position: absolute
          right: 20px
          bottom: 20px
          i
            color: $color-orange
            font-style: normal
  .editbtn
    width 100%
    text-align: center
    height: 94px
    line-height: 94px
    background :$color-bc
    font-size :36px
    color: $color-white
    &.active
      background :$color-orange
  .weui-toast
    top: 50%
    .weui-toast__content
      font-size: 32px/*px*/;
      padding: 20px!important
</style>
