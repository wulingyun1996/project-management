<template>
  <div>
    <div class="buy-list" v-for="(item, index) in wantBuy" track-by="$index">
      <div class="img-box">
        <img :src="item.avatar | smallPic(99, 99)" v-if="item.avatar" />
        <img v-else :src="defaultPhoto" />
      </div>
      <div class="text-box">
        <div @click="goDetail(item, index)">
          <div class="text-top">
            <div class="text-left">{{item.nickname}}<span v-if="item.type && show" :class="{'part': item.type === 2}">{{item.type_name}}</span></div>
            <div class="text-right">{{item.time}}</div>
          </div>
          <h5 :class="{'one':show}">{{item.title}}</h5>
          <div class="text-p">供应商首选区域：<span>{{item.province_name}}{{item.city_name}}</span></div>
          <div class="icon-text icon1" v-if="item.goods_num"><span>数量</span>{{item.goods_num}}</div>
          <div class="icon-text icon2" v-if="item.deadline"><span>截止</span>{{item.deadline}}</div>
          <div class="img-li">
            <img :src="item.image_path | smallPic(300, 300)" v-if="item.image_path" @click="bigPic(item.image_path)" />
            <img :src="item.image_path_two | smallPic(300, 300)" v-if="item.image_path_two" @click="bigPic(item.image_path_two)" />
          </div>
          <div class="more" v-if="item.content"><span>更多描述：</span>{{item.content}}</div>
          <div class="status" v-if="item.status === 3" :class="{'has-photo':item.image_path}">
            <img src="./over.png" />
          </div>
        </div>
        <div class="gap-wrapper">
          <div class="gap">
            <div v-if="item.focus_num === 0" :class="[item.if_focus===1 ? 'gap0 active' : 'gap0']" @click="onFocus(item)" ref="gapFocus">关注</div>
            <div v-else :class="[item.if_focus===1 ? 'gap0 active' : 'gap0']" @click="onFocus(item)" ref="gapFocus">{{item.focus_num > 999 ? '999+' : item.focus_num}}</div>
            <div v-if="item.comment_num === 0" class="gap1" @click="goDetailTwo(item)">回复</div>
            <div v-else class="gap1" @click="goDetailTwo(item)">{{item.comment_num > 999 ? '999+' : item.comment_num}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import {loadDataPost, STATUS_OK} from 'api/common'
  export default {
    props: {
      wantBuy: {
        type: Array
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultPhoto: require('../../../static/images/seller-sale/logo-small.png')
      }
    },
    methods: {
      goDetail(item, index) {
        if (!this.$route.params.id) {
          this.modIndex(index)
          this.$router.push({
            path: `/want-to-buy/${item.id}`
          })
        }
      },
      goDetailTwo(item) {
        if (!sessionStorage.getItem('token')) {
          return
        }
        if (!this.$route.params.id) {
          this.$router.push({
            path: `/want-to-buy/${item.id}`
          })
        } else {
          if (item.status === 1) {
            this.$router.push({
              path: '/me-answer',
              query: {
                id: item.id
              }
            })
          }
          return
        }
      },
      // 关注取消
      onFocus(item) {
        let URL = 'sale/focus'
        let obj = {
          id: item.id
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (!sessionStorage.getItem('token')) {
              return
            }
            if (item.if_focus === 0) {
              this.$set(item, 'if_focus', 1)
              this.$set(item, 'focus_num', item.focus_num + 1)
            } else {
              this.$set(item, 'if_focus', 0)
              this.$set(item, 'focus_num', item.focus_num - 1)
            }
            if (this.$route.params.id) {
              let location = window.location.href
              if (location.indexOf('my-buy') === -1) {
                window.sessionStorage.setItem('changeItem', JSON.stringify(item))
              } else {
                window.sessionStorage.setItem('myItem', JSON.stringify(item))
              }
            }
          }
        })
      },
      bigPic(imgSrc) {
        this.$emit('bigPic', imgSrc)
      },
      ...mapMutations({
        modIndex: 'MOD_INDEX'
      })
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
        top: 26%
        img
          width: 100%
        &.has-photo
          top: 48%
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
        line-height: 1.5
        color: $color-3
        font-size: 30px;/*px*/
        font-weight: bold
        margin-top: 32px
        &.one
          text-over(1)
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
        margin-top: 14px
        line-height: 1.5
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
        margin-bottom: 22px
      .img-li
        display: flex
        img
          display: block
          margin-right: 20px
          width: 200px;/*px*/
          height: 200px;/*px*/
      .more
        margin-top: 28px
        color: $color-a6
        font-size: 26px;/*px*/
        line-height: 1.3
        word-break: break-all
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