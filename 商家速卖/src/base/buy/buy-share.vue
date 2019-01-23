<template>
  <div>
    <div class="buy-list" v-for="item in wantBuy">
      <div class="img-box">
        <img :src="item.avatar" v-if="item.avatar">
        <img v-else :src="defaultPhoto">
      </div>
      <div class="text-box">
        <div>
          <div class="text-top">
            <div class="text-left">{{item.nickname}}<span v-if="item.type" :class="{'part': item.type === 2}">{{item.type === 1 ? '商品求购' : '工程合作'}}</span></div>
            <div class="text-right">{{item.created_at | formatTime}}</div>
          </div>
          <h5>{{item.title}}</h5>
          <div class="text-p">供应商首选区域：<span>{{item.province_name}}{{item.city_name}}</span></div>
          <div class="icon-text icon1"><span>数量</span>{{item.goods_num}}</div>
          <div class="icon-text icon2"><span>截止</span>{{item.deadline === '1970-06-27' ? '长期合作':item.deadline}}</div>
          <div class="img-li">
            <img :src="item.image_path" v-if="item.image_path" @click="bigPic(item.image_path)">
            <img :src="item.image_path_two" v-if="item.image_path_two" @click="bigPic(item.image_path_two)">
          </div>
          <div class="more" v-if="item.content"><span>更多描述：</span>{{item.content}}</div>
          <div class="status" v-if="item.status === 3">
            <img src="./over.png">
          </div>
        </div>
        <div class="gap-wrapper">
          <div class="gap">
            <div :class="[item.if_focus===1 ? 'gap0 active' : 'gap0']" ref="gapFocus">{{item.focus_num === 0 ? '关注' : item.focus_num}}</div>
            <div class="gap1">{{item.comment_num === 0 ? '回复' : item.comment_num}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      wantBuy: {
        type: Array
      }
    },
    data() {
      return {
        defaultPhoto: require('../../../static/images/seller-sale/logo-small.png')
      }
    },
    filters: {
      formatTime(value) {
        value = value.split(' ')
        return value[0]
      }
    },
    methods: {
      bigPic(value) {
        this.$emit('bigPic', value)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .buy-list
    background: $color-white
    padding: 22px 25px 8px 25px
    display: flex
    margin-bottom: 24px
    &:last-child
      margin-bottom: 0
    .img-box
      width: 66px;/*px*/
      height: 66px;/*px*/
      img
        width: 100%
        height: 100%
        border-radius: 50%
    .text-box
      flex: 1
      padding-left: 18px
      position: relative
      .status
        width: 134px;/*px*/
        height: 112px;/*px*/
        position absolute
        right: 0
        bottom: 22%
        img
          width: 100%
      .text-top
        display: flex
        justify-content: space-between
        padding-top: 18px
        .text-left
          font-size: 30px;/*px*/
          color: $color-3
          span
            display: inline-block
            padding: 0 8px
            margin-left: 24px
            font-size: 24px;/*px*/
            background-color: $color-orange2
            line-height: 40px;/*px*/
            color: $color-white
            &.part
              background-color: #8f98f4
        .text-right
          font-size: 24px;/*px*/
          color: $color-a6
      h5
        text-over(1)
        line-height: 1.5
        color: $color-3
        font-size: 30px;/*px*/
        font-weight: bold
        margin-top: 32px
      .text-p
        color: $color-3
        font-size: 26px;/*px*/
        margin-top: 20px
        margin-bottom: 26px
        span
          color: $color-a6
      .icon-text
        font-size: 26px;/*px*/
        color: $color-5
        margin-top: 20px
        span
          color: $color-orange
          margin-right: 15px
      .icon1, .icon2
        background-size: 28px 28px;/*px*/
        background-position: left center
        background-repeat: no-repeat
        padding-left: 50px;/*px*/
      .icon1
        background-image: url('icon1.png')
      .icon2
        background-image: url('icon2.png')
      .img-li
        margin-top: 34px
        display: flex
        img
          display: block
          margin-right: 20px
          width: 200px;/*px*/
          height: 200px;/*px*/
      .more
        margin-top: 28px
        color: $color-a6
        font-size: 26;/*px*/
        line-height: 1.3
        span
          color: $color-a6
      .gap-wrapper
        flex-box-center()
        justify-content: flex-end
        .gap
          display: flex
          justify-content: flex-end
          font-size: 24px;/*px*/
          color: #909090
          >div
            margin-left: 68px
            padding-left: 58px;/*px*/
            line-height: 80px;/*px*/
            width: 106px;/*px*/
            cursor: pointer
          .gap0, .gap1
            background-position: left center
            background-repeat: no-repeat
            background-size: 40px 40px;/*px*/
          .gap0
            background-image: url('icon3.png')
            &.active
              color: $color-orange
              background-image: url('icon3hover.png')
          .gap1
            background-image: url('icon4.png')
</style>