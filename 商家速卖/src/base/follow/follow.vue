<template>
  <div class="follow-content">
    <div class="follow-box" v-for="(item, index) in wantBuy">
      <div class="follow-mar" @click="goDetail(item, index)">
        <div class="follow-top">
          <h5 :class="{'part': item.type !== 1}">{{item.type === 1 ? '商品求购' : '工程合作'}}</h5>
          <span class="date">{{item.created_at | formatMoney}}</span>
        </div>
        <p>{{item.title}}</p>
        <div class="status" v-if="item.status === 3">
          <img src="./over.png">
        </div>
      </div>
      <div class="gap-wrapper" :class="{'marTop': item.status === 3}">
        <div class="gap">
          <div :class="[item.if_focus===1 ? 'gap0 active' : 'gap0']" @click="onFocus(item, index)">{{item.focus_num === 0 ? '关注' : item.focus_num}}</div>
          <div class="gap1" @click="goDetail(item, index)">{{item.comment_num === 0 ? '回复' : item.comment_num}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import {loadDataPost, STATUS_OK} from 'api/common'
  export default {
    props: {
      wantBuy: {
        type: Array
      },
      currentIndex: {
        type: Number
      }
    },
    filters: {
      formatMoney(value) {
        value = value.split(' ')
        return value[0]
      }
    },
    methods: {
      goDetail(item, index) {
        if (!this.$route.params.id) {
          this.myIndex(index)
          this.$router.push({
            path: `/want-to-buy/${item.id}`
          })
        } else {
          return
        }
      },
      // 关注取消
      onFocus(item, index) {
        let URL = 'sale/focus'
        let obj = {
          id: item.id
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (this.currentIndex === 0) {
              this.$emit('freshDataOne', index, item)
            } else {
              this.$emit('freshDataTwo', index, item)
            }
          }
        })
      },
      ...mapMutations({
        myIndex: 'MY_INDEX'
      })
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .follow-content
    width: 100%
  .follow-box
    background: $color-white
    padding: 30px 25px 18px 35px
    border-bottom: 1px solid $color-border;/*no*/
    position: relative
    .follow-top
      flex-box-center()
      justify-content: space-between
      h5
        font-size: 32px;/*px*/
        font-weight: bold
        padding-left: 48px
        background-image: url('icon1.png')
        background-size: 34px 34px;/*px*/
        background-position: left center
        background-repeat: no-repeat
        &.part
          background-image: url('icon2.png')
      .date
        color: $color-a6
        font-size: 24px;/*px*/
    p
      margin-top: 42px
      font-size: 30px
      color: $color-highlight-background
      padding-right: 158px
      line-height 1.4
      text-over(1)
    .follow-mar
      padding-bottom: 40px
    .gap-wrapper
      flex-box-center()
      justify-content: flex-end
      &.marTop
        margin-top: 30px;/*px*/
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
    .status
      position: absolute
      right: 48px
      bottom: 82px
      width: 135px;/*px*/
      height: 112px;/*px*/
      img
        width: 100%
        height: auto
</style>