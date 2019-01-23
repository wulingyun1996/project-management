<template>
  <div class="materials-library-container" :class="{ active: !hasNoData }">
    <base-header></base-header>
    <base-scroll
      v-show="!hasNoData"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
      <ul>
        <li v-for="item in m_dataList" :key="item.id">
          <div class="materials-left">
            <img :src="item.image_path" alt="">
          </div>
          <div class="materials-right">
            <p>{{ item.title }}</p>
            <div class="bottom-price">
              <div class="price-left">
                <span>￥</span>
                <span>{{ item.purchase_price }}</span>
              </div>
              <div class="tocke-right">
                库存：{{ item.stock }}
              </div>
            </div>
            <div class="bootom-brand">
              <div class="brand-left">
                所属材料馆：
              </div>
              <div class="brand-right">
                <p v-for="brandItem in item.Library" :key="brandItem.id">{{ brandItem.name }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </base-scroll>
    <!-- 缺省图 -->
    <div class="no-data" v-show="hasNoData">
      <img src="./images/icon-liarly.png" alt="">
      <p>您还没有商品入驻线下材料馆哦,</p>
      <p>想要加入，赶快联系我们，</p>
      <p>tel:{{ servicePhone }}</p>
    </div>
    <div class="fotter-tel" v-show="!hasNoData">
      <span>想要更多商品加入材料图书馆，赶快联系我们，tel:{{ servicePhone }}</span>
    </div>
  </div>
</template>

<script>
import { mixins } from 'mixins'
export default {
  name: 'materialsList',
  mixins: [mixins],
  data () {
    return {
      hasNoData: false,
      servicePhone: '',
      message: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'material/getGoodsList'
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.servicePhone = res.data.customer.service_phone
          this.message = '想要更多商品加入精品馆，赶快联系我们，tel:' + this.servicePhone
          this.m_dataList = [...this.m_dataList, ...res.data.list.data]
          this._checkMore(res.data.list)
        }
      })
    }
  },
  watch: {
    'm_dataList' (value) {
      let lengths = value.length
      if (lengths) {
        this.hasNoData = false
        return
      }
      this.hasNoData = true
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.materials-library-container
  background #F5F4F9
  height 100%
  &.active
    flex-col-btw()
  .scroll-container
    flex 1
    overflow hidden
  .fotter-tel
    height 70px
    background-color #FAFBE7
    display flex
    align-items center
    justify-content center
    span
      font-family: PingFangSC-Regular
      font-size 24px
      color #D0021B
  .no-data
    text-align center
    img
      width 240px
      height 240px
      margin 180px auto 60px
    p
      text-align center
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #999999
      letter-spacing: 0
    p:nth-child(3)
      margin-top 10px
    p:nth-child(4)
      font-size: 36px
      color: #F6333D
      margin-top 32px
  li
    padding 30px
    display flex
    align-items center
    background-color #fff
    margin-top 10px
    .materials-left
      width 200px
      height 200px
      bd(#f4f4f4)
      border-radius 10px
      img
        width 100%
        height 100%
    .materials-right
      flex 1
      padding-left 20px
      padding-top 10px
      p
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #333333
        letter-spacing: 0
        line-height 36px
        text-over(2)
      .bottom-price
        margin-top 40px
        display flex
        align-items center
        justify-content space-between
        .price-left
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #F6333D
          letter-spacing: 0
          span:last-child
            font-size 36px
        .tocke-right
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #CCCCCC
          letter-spacing: 0
      .bootom-brand
        margin-top 10px
        display flex
        .brand-left, .brand-right p
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #999999
          letter-spacing: 0
        .brand-left
          margin-top 6px
</style>
