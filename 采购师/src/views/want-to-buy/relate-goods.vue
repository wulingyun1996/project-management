<template>
  <div class="relate-goods">
    <header ref="header">
      <div v-for="(item, index) in items" :key="index" @click="itemClick(index)" :class="activeIndex === index ? 'active' : ''" class="item">
        {{item.name}}
      </div>
      <div class="hr" ref="hr"></div>
    </header>
    <Scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" style="background: #F4F4F4;" :height="height">
      <div class="list" style="background: #FFF;">
        <div class="item" v-for="(item, index) in list" :key="index" v-if="item.flag === 1 && list.length > 0" @click="select(item)">
          <img :src="item.goodsInfo[0].image_path" alt="">
          <img src="./images/gou.png" alt="" class="checked" v-if="recGoods && item.id === recGoods.id">
          <div class="right">
            <div class="name">{{item.goodsInfo[0].title}}</div>
            <div class="price">￥{{item.goodsInfo[0].purchase_price}}</div>
          </div>
        </div>
        <div class="nomore" v-if="!hasMore && list.length > 4">没有更多了</div>
        <loading tips="loading" v-if="fetching"></loading>
      </div>
      <div class="list" v-if="list.length === 0 && !fetching" style="background: #F2F2F2;">
        <img src="./images/no_stock.png" alt="" v-if="activeIndex === 0" class="no-stock">
        <img src="./images/no_buy.png" alt="" v-if="activeIndex === 1" class="no-buy">
        <p>{{activeIndex === 0 ? '您的报价单还是空的，赶紧去行动吧' : '您还没有购买过商品，赶紧去行动吧'}}</p>
        <div class="btn" @click="goHome">去选购</div>
      </div>
    </Scroller>
  </div>
</template>

<script>
import {Scroller} from 'vux'
import Loading from 'components/loading/loading'
import {mapGetters, mapMutations} from 'vuex'
import { nativeGoHomeNormal } from 'native'
export default {
  components: {
    Scroller,
    Loading
  },
  data () {
    return {
      loading: false,
      list: [],
      items: [{name: '我报价单的商品'}, {name: '我购买的商品'}],
      activeIndex: 0,
      page: 0,
      pageSize: 10,
      hasMore: true,
      fetching: false,
      height: '',
      flag: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapMutations(['SET_RECGOODS']),
    select (item) {
      this.SET_RECGOODS(item)
      this.$router.back()
    },
    onScrollBottom () {
      this.getData()
    },
    getData () {
      if (!this.hasMore) return
      if (this.fetching) return
      this.fetching = true
      this.page++
      let url = this.activeIndex === 0 ? 'cart/getSingleGoods' : 'order/orderSingleGoods'
      this.$http(url, {page: this.page, pagesize: this.pageSize}).then(res => {
        this.fetching = false
        this.loading = true
        if (res.code === 200) {
          if (res.data) {
            this.list = this.list.concat(res.data.data)
            if (this.list.length >= res.data.total) {
              this.hasMore = false
            }
          } else {
            this.list = []
            this.hasMore = false
          }
          this.$nextTick(() => {
            const winH = document.documentElement.clientHeight
            const headerH = getComputedStyle(this.$refs.header, null).height.split('px')[0]
            this.height = winH - headerH + 'px'
            if (!this.flag) {
              this.$refs.scrollerBottom.reset({top: 0})
            } else {
              this.$refs.scrollerBottom.reset({bottom: 0})
            }
            this.flag = true
          })
        }
      })
    },
    itemClick (index) {
      if (this.activeIndex === index) return
      this.flag = false
      this.activeIndex = index
      this.page = 0
      this.hasMore = true
      this.list = []
      this.$refs.hr.style.left = document.documentElement.clientWidth * index / this.items.length + 'px'
      this.getData()
    },
    goHome () {
      nativeGoHomeNormal()
    }
  },
  computed: {
    ...mapGetters(['recGoods'])
  }
}
</script>

<style lang="stylus" scoped>
header
  position fixed
  left 0
  top 0
  width 100%
  height 100px
  display flex
  align-items center
  z-index 10
  background #FFF
  border-bottom 1px solid #dedede;/*no*/
  .item
    flex 1
    font-size 26px
    color #a6a6a6
    text-align center
    height 100px
    line-height 100px
  .active
    color #333
  .hr
    position absolute
    height 2px;/*no*/
    width 50%
    background #999
    bottom 0
    left 0
    transition all .5s
  .top
    height 20px
    background rgb(248, 248, 248)
.relate-goods
  height 100%
  padding-top 100px
.list
  .item
    background #FFF
    padding 20px 32px 20px 32px
    display flex
    border-bottom 1px solid #DEDEDE;/*no*/
    position relative
    img.checked
      position absolute
      width 40px
      height 40px
      right 32px
      bottom 20px
    img
      width 242px
      height 242px
      margin-right 20px
    .right
      flex 1
      padding-top 20px
      .name
        font-size 28px
        color #333
        line-height 40px
        overflow: hidden;
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
      .price
        font-size 30px
        color #ff8d00
        font-weight bold
        margin-top 96px
  .item:last-of-type
    border none
.nomore
  text-align center
  font-size 26px
  padding 14px 0
  background #F4F4F4
  color #ccc
.btn
  width 140px
  height 60px
  border-radius 200px
  line-height 60px
  border 1px solid rgb(255, 136, 16); /*no*/
  color rgb(255, 136, 16)
  margin 60px auto 0
  text-align center
p
  text-align center
  color #333
  margin-top 40px
  font-size 26px
.no-buy
.no-stock
  display block
  margin 80px auto 0
.no-stock
  width 311px
  height 286px
.no-buy
  width 325px
  height 294px
</style>
