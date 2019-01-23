<template>
  <div class="comment-container">
    <ul>
      <li class="comment-item" v-for="item in commentList" :key="item.user_id">
        <div class="comment-top">
          <div class="comment-user">
            <img :src="item.avatar" alt="" v-if="item.avatar">
            <img src="./images/mifeng.png" alt="" v-else>
            <span>{{ item.mobile }}</span>
          </div>
          <div class="comment-grade">
            <base-star :size='36' :score='item.star_level'></base-star>
          </div>
        </div>
        <div class="comment-center">
          <span class="comment-time">{{ item.created_at.substr(0, 10) }}</span>
          <span class="comment-type">{{ item.spec_name }}</span>
        </div>
        <div class="comment-bottom">
          <p>{{ item.comment }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BaseStar from 'components/star'
export default {
  props: {
    commentList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    BaseStar
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.comment-container
  f14()
  color $color-3
  .comment-item
    padding 16px 0
    bd-b($color-f4)
    >div
      margin-bottom 12px
    .comment-top
      flex-align-item()
      .comment-user
        flex-align-item()
        img
          wh(60px)
          border-radius(50%)
          margin-right 16px
    .comment-center
      flex-f()
      f12()
      color $color-9
      line-height 36px
      .comment-time
        margin-right 30px
    .comment-bottom
      p
        wb()
        line-height 52px
</style>
