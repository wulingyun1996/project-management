<template>
  <div class="brandinfo">
    <div class="brandbox">
      <scroll
        ref="scroll"
        :pullup="pullup"
        :beforeScroll="beforeScroll"
        class="scroll">
        <div>
          <div class="brandcheck">
            <div class="top">
              <i class="k"></i>
              <span>品牌名称</span>
              <P>{{ data.name }}</P>
            </div>
            <div class="middle">
              <i></i>
              <span>品牌LOGO</span>
              <div class="pic">
                <img :src="data.image_path"/>
              </div>
            </div>
            <div class="content">
              <i></i>
              <span>品牌介绍</span>
              <p v-cloak>{{ data.introduce }}</p>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="managebtn">
      <span class="edit" @click="Edit">编辑</span>
      <span class="del" @click="Del">删除</span>
    </div>
  <confirm
    v-model="show2"
    title="您确认删除品牌信息吗？"
    confirm-text="取消"
    cancel-text="确定"
    @on-cancel="confirm">
  </confirm>
</div>
</template>
<script>
  import { loadData, STATUS_OK } from 'api/common'
  import Scroll from 'base/scroll/scroll'
  import { Confirm } from 'vux'
  export default {
    data() {
      return {
        name: '',
        image_path: '',
        introduce: '',
        data: [],
        show2: false,
        pullup: true,
        beforeScroll: true
      }
    },
    created() {
      this.EditDetail()
    },
    methods: {
      Del() {
        this.show2 = true
      },
      // 删除接口
      confirm() {
        let URL = 'shop/delBrand'
        let obj = {
          id: this.data.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('删除成功')
            this.$router.push('/brand')
          }
        })
      },
      changeFile(imgs) {
        this.image_path = imgs.target.value
      },
      addBrand() {
        this.Addtrademark()
      },
      // 编辑详情接口
      EditDetail(id) {
        let URL = 'shop/brandDetail'
        let obj = {
          id: this.$route.params.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.data = res.data
          }
        })
      },
      // 品牌详情接口
      Edit() {
        let URL = 'shop/brandDetail'
        let obj = {
          id: this.data.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$router.push(`/edit-brand/${obj.id}`)
          }
        })
      },
      // 品牌新增、编辑接口
      Addtrademark() {
        let URL = 'shop/shopBrand'
        let obj = {
          name: this.name,
          image_path: this.image_path,
          introduce: this.introduce
        }
        loadData(URL, obj)
      }
    },
    components: {
      Confirm,
      Scroll
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .brandinfo
    background: $color-white
    position: fixed
    width: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    .brandbox
      position: absolute
      width: 100%
      top: 0
      left: 0
      right: 0
      bottom: 100px;/*px*/
      .scroll
        height: 100%
        overflow: hidden
    .brandcheck
      padding: 0 25px
      .top
        padding-top: 40px
        border-bottom: 1px solid $color-df;/*no*/
        width: 100%
        position: relative
        i
          background: url('circle.png') no-repeat center center
          display: block
          width: 15px;/*px*/
          background-size: 100% auto
          height: 27px;/*px*/
          top: 40px
          position: absolute
          left: 0
        span
          color: $color-3
          fone-size: 28px;/*px*/
          font-weight: 700
          padding-left: 16px
          top: 40px
          position: absolute
          left: 20px
        p
          color: $color-6
          fone-size: 28px;/*px*/
          padding: 80px 0 40px 35px
      .middle
        border-bottom: 1px solid $color-df;/*no*/
        width: 100%
        padding-bottom: 20px
        i
          background: url('circle.png') no-repeat center center
          background-size: 100% auto
          display: inline-block
          width: 15px;/*px*/
          height: 27px;/*px*/
          margin-top: 40px
        span
          color: $color-3
          fone-size: 28px;/*px*/
          font-weight: 700
          padding-left: 16px
          margin-top: 40px
        .pic
          margin: 40px 0 40px 31px
          display: flex
          img
            width: 204px;/*px*/
            height: 204px;/*px*/
            overflow: hidden
            // border: 1px solid $color-df;/*no*/
          &:nth-child(2n)
            margin-left: 100px
      .content
        width: 100%
        i
          background: url('circle.png') no-repeat center center
          display: inline-block
          width: 15px;/*px*/
          height: 27px;/*px*/
          margin-top: 40px
        span
          color: $color-3
          font-size: 28px;/*px*/
          font-weight: 700
          padding-left: 16px
          margin-top: 40px
        p
          padding: 40px 16px 0 31px
          text-indent: 50px
          line-height: 48px
          font-size: 28px/*px*/
          color: $color-6
    .managebtn
      border-top: 1px solid $color-df;/*no*/
      position: fixed
      bottom: 0
      left: 0
      right: 0
      width: 100%
      height: 88px;/*px*/
      line-height: 88px;/*px*/
      font-size: 36px;/*px*/
      display: flex
      .edit
        display: inline-block
        width:50%
        background: $color-orange
        line-height: 94px
        height: 94px;/*px*/
        text-align: center
        color: $color-white
      .del
        display: inline-block
        width: 50%
        background: $color-white
        line-height: 94px
        height: 94px;/*px*/
        text-align: center
        color: $color-orange
  .vux-confirm
    .vux-x-dialog
      .weui-dialog
        border-radius: 28px
        background-color: $color-f7
        max-width: 70%
        .weui-dialog__hd
          padding: 45px 0 20px 0
          .weui-dialog__title
            font-size: 34px;/*px*/
            color: $color-0
            font-weight: 700
        .vux-prompt
          padding: 0 32px 94px 32px
          input
            height: 56px;/*px*/
            border: 1px solid $color-gray;/*no*/
            width: 90%
            background: $color-white
            font-size: 26px;/*px*/
            color: $color-a6
        .weui-dialog__ft
          border-top: 1px solid $color-gray;/*no*/
          .weui-dialog__btn
            border-left: 1px solid $color-gray;/*no*/
          .weui-dialog__btn_default,.weui-dialog__btn_primary
            color: $color-blue
            font-size: 34px;/*px*/
            height: 88px;/*px*/
            line-height: 88px;/*px*/
</style>
