<template>
  <div>
    <div class="commodity-mess" v-for="item in data">
      <div class="tou">
        <img v-if="item.avatar" :src="item.avatar" />
        <img v-else src="../../../static/images/seller-sale/logo-small.png" />
        <span class="span-tel">{{item.buyer}}</span>
        <star :size="36" :score="item.star_level"></star>
      </div>
      <p class="date">{{item.date}}</p>
      <p class="dd">{{item.spec_name}}</p>
      <p class="des">{{item.comment}}</p>
      <div class="apply" v-show="item.seller_reply">商家回复：<span v-html="item.seller_reply">{{item.seller_reply}}</span></div>
      <div class="pic-text" @click="goGoods(item)" >
        <div class="pic-box">
          <img :src="item.image_path" />
        </div>
        <div class="text-boxes">
          <h5>{{item.goods_name}}</h5>
          <div>￥{{item.price}}</div>
        </div>
      </div>
      <div class="todo" v-if="!item.seller_reply">
        <a href="javascript:;" @click.stop="reply(item)" class="orange">回复</a>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Star from 'base/star/star'
  import Vue from 'vue'
  import {ConfirmPlugin} from 'vux'
  Vue.use(ConfirmPlugin)
  export default {
    props: {
      commodity: {
        type: Array,
        default: []
      }
    },
    computed: {
      data() {
        this.commodity.forEach(val => {
          if (val.seller_reply) {
            val.seller_reply = val.seller_reply.replace(/\n/g, '<br/>')
          }
        })
        return this.commodity
      }
    },
    methods: {
      reply(item) {
        this.$emit('reply', item)
      },
      goGoods(item) {
        this.$router.push('/detail/' + item.goods_id)
      }
    },
    components: {
      Star
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/vux.styl"
  .commodity-mess
    padding: 20px 25px
    border-bottom: 1px solid $color-border;/*no*/
    margin-top: 18px
    background: $color-white
    &:first-child
      margin-top: 0
    &:last-child
      border-bottom none
    .tou
      display: flex
      align-items: center
      img
        width: 68px;/*px*/
        height: 68px;/*px*/
        border-radius 50%
      .span-tel
        margin-left: 14px
        font-size: 30px;/*px*/
        color: $color-highlight-background
      .star
        position: absolute
        right: 25px
    p
      margin-top: 20px
      color: $color-a6
    .date
      font-size: 24px;/*px*/
    .dd
      font-size: 22px;/*px*/
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    .des
      font-size: 28px;/*px*/
      color: $color-3
      line-height: 1.2
      // text-over(3)
    .pic-text
      margin: 20px 0 0
      background: $color-body
      padding: 8px
      flex-box-center()
      img
        width: 150px;/*px*/
        height: 150px;/*px*/
        display: block
      .text-boxes
        padding: 0 0 0 12px
        color: $color-highlight-background
        font-size: 28px;/*px*/
        h5
          text-over(1)
          line-height: 1.3
        div
          margin-top: 36px
    .todo
      display: flex
      justify-content: flex-end
      padding-top: 20px
      a
        display: block
        width: 130px;/*px*/
        line-height: 53px;/*px*/
        text-align: center
        font-size: 28px;/*px*/
      .gray
        border: 1px solid $color-a6;/*no*/
      .orange
        border: 1px solid $color-orange;/*no*/
        color: $color-orange
        margin-left: 20px
    .apply
      line-height: 34px;/*px*/
      background: $color-body
      padding: 19px 11px;/*px*/
      margin: 40px 0 22px
      font-size 28px;/*px*/
      color #4a5e97
      position relative
      span
        color $color-6
        word-break: break-all;
      &:before
        content ''
        display inline-block
        border-color  transparent transparent $color-body transparent
        border-width 20px;/*px*/
        border-style solid
        position absolute
        top -40px;/*px*/
        left 40px

</style>
