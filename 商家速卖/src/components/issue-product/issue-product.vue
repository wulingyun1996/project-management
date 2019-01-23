<template>
  <div class="issue-box" v-if="this.product">
    <div class="pic"><img src="./issue.png" /></div>
    <div class="li-box">
      <div class="select"><i></i><span>选择引用或新建商品</span></div>
      <div class="wire"></div>
      <div class="edit"><i></i><span>编辑信息</span></div>
      <div class="wire"></div>
      <div class="submit"><i></i><span>提交商品</span></div>
    </div>
    <div class="issue-btn">
      <router-link to="/creat-goods" tag="div" class="add">新建商品</router-link>
      <router-link to="/quote-goods" tag="div" class="quote">引用产品</router-link>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { loadDataPost, STATUS_OK } from 'api/common'
  export default {
    data() {
      return {
        product: false
      }
    },
    created() {
      this.issueProduct()
    },
    methods: {
      issueProduct() {
        let URL = 'goods/quote'
        loadDataPost(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.product = res.data.quote
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .issue-box
    height: 100%
    background: $color-white
    position: fixed
    width: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    .pic img
      width: 100%
      height: 100%
    .li-box
      padding: 60px 0 0 57px
      .select, .edit, .submit
        display: flex
        align-items: center
      .select i, .edit i, .submit i
        display: inline-block
        width: 55px;/*px*/
        height: 56px;/*px*/
        background: url('./one.png') no-repeat
        background-size: 100% auto
       .select span, .edit span, .submit span
          display: inline-block
          font-size: 30px;/*px*/
          margin-left: 50px
          color: #333333
          line-height: 55px
        .edit i
          background: url('./two.png') no-repeat
          background-size: 100% auto
        .submit i
          background: url('./three.png') no-repeat
          background-size: 100% auto
        .wire
          border-left: 2px solid $color-orange;/*no*/
          height: 110px;/*px*/
          margin: 10px 28px
    .issue-btn
      bottom: 0
      left: 0
      right: 0
      width: 100%
      height: 94px;/*px*/
      line-height: 94px;/*px*/
      font-size: 36px;/*px*/
      display: flex
      border-tp()
      position: fixed
      display: flex
      .add
        flex: 1
        background: $color-orange
        text-align: center
        color: $color-white
      .quote
        flex: 1
        background: $color-white
        text-align: center
        color: $color-orange
</style>  
