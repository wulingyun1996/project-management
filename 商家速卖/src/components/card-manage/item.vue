<template>
  <div class="item">
    <img :src="item.checked ? require('./check_on.png') : require('./check_off.png')" alt="" v-if="hasSelect" class="check" @click="check">
    <img :src="item.image_path" alt="" class="item-img">
    <div class="right">
      <div class="good-name">
        <span v-if="item.goods_type === '2'" class="first">限时抢</span>
        <span v-if="item.goods_type === '1'" class="second" style="color：#FF0000;">【爆款】</span>
        {{item.title}}
      </div>
      <div class="good-price">
        <div v-if="item.goods_type === '1'">
          ￥{{formatPrice(item.price)}}
        </div>
        <div v-if="item.goods_type !== '1'">
          ￥{{formatPrice(item.purchase_price)}}
        </div>
        <div class="commission">
          <img src="./commission.png" alt="">
          <span>￥</span>
          <span>{{item.commission}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hasSelect: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    check () {
      this.$emit('check', this.item)
    },
    formatPrice (num) {
      num = num + ''
      if (num.indexOf('.') !== -1) {
        if (num.split('.')[1].length !== 2) {
          num = num + '0'
        }
        return num
      } else {
        num = num + '.00'
        return num
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.item
  display flex
  padding 14px
  align-items center
  border-bottom 1px solid #F4F4F4
  .check
    width 44px
    height 44px
    margin-right 20px
  .item-img
    width 200px
    height 200px
    margin-right 32px
  .right
    flex 1
    display flex
    flex-direction column
    justify-content space-between
    height 200px
    .good-name
      color #151515
      font-size 28px
      line-height 40px
      word-break break-all
      .second
        color #FF0000
      .first
        background: #FF8A00
        font-size 26px
        line-height 36px
        color #FFF
        padding 4px 10px
    .good-price
      display flex
      justify-content space-between
      color #FF0000
      font-size 28px
      line-height 40px
  .commission
    background #FF8A00
    border-radius 200px
    height 36px
    padding-left 12px
    padding-right 12px
    display flex
    align-items center
    color #FFF
    img
      width 27px
      height 30px
    span:nth-of-type(1)
      font-size 24px
      transform scale(.7)
      transform-origin left center
    span:nth-of-type(2)
      font-size 24px
      transform scale(.9)
      transform-origin right center
      margin-left -10px
</style>

