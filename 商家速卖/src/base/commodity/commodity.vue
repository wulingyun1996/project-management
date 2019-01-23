<template>
  <div>
	  <div class="commodity-mess" v-for="(item, index) in commodityList">
      <div class="tou">
        <img :src="item.image_path" v-if="item.image_path">
        <img src="../../../static/images/seller-sale/logo-small.png" v-else>
        <span class="span-tel">{{item.goods_name}}</span>
        <star :size="48" :score="item.star_level"></star>
      </div>
      <p class="date">{{item.created_at}}</p>
      <p class="dd">{{item.spec_name}}</p>
      <p class="des">{{item.comment}}</p>
      <div class="apply" v-if="item.seller_reply">商家回复：{{item.seller_reply}}</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Star from 'base/star/star'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['commodityList'])
    },
    components: {
      Star
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .commodity-mess
    padding: 32px 25px 20px
    border-bottom: 1px solid $color-border;/*no*/
    .tou
      display: flex
      align-items: center
      img
        width: 68px;/*px*/
        height: 68px;/*px*/
      .span-tel
        margin-left: 14px
        font-size: 30px;/*px*/
        color: $color-3
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
      text-over()
    .des
      font-size: 26px;/*px*/
      color: $color-3
      line-height: 1.3
      text-over()
      -webkit-line-clamp: 3
    .apply
      line-height: 70px;/*px*/
      background: $color-body
      padding-left: 10px
      margin: 40px 0 22px
</style>