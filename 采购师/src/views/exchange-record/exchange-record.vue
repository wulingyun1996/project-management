<template>
  <div class="record-list-container">
    <base-header></base-header>
    <div class="record-list-content">
      <!-- 有记录 -->
      <base-scroll v-if="m_dataList.length && flag"
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh"
      >
        <section v-for="(value, index) in m_dataList" :key="index">
          <div class="record-details-list">
            <!-- <ul class="line-one">
              <li><img src="./images/icon-time.png" alt=""></li>
              <li>
                <div>
                  <div>{{value.created_at}}</div>
                </div>
              </li>
              <li @click="concactCall(value.seller_mobile)"><img src="./images/icon-tel.png">联系卖家</li>
            </ul> -->
            <div class="record-header">
              <div class="header-left">
                <img :src="value.shop_logo_path" alt="">
                <p>{{ value.shop_name }}</p>
              </div>
              <div v-if="value.delivery_status === 1" class="header-right">
                已自提
              </div>
              <div v-else-if="value.delivery_status === 0" class="header-right">
                未发货
              </div>
              <div v-else-if="value.delivery_status === 2" class="header-right">
                已发货
              </div>
            </div>
            <div class="record-goods-details clearfix">
              <div><img :src="value.image" alt=""></div>
              <div>
                <div>
                  <p>{{value.title}}</p>
                  <ul class="clearfix">
                    <li>
                      <img src="./images/icon-bottle-2.png" alt="">
                      <span>{{value.integral_sum}}</span><b>蜂蜜</b>
                    </li>
                    <li>x<span>{{value.number}}</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="record-price">
              <div class="record-time">
                <img src="./images/icon-time.png" alt="">
                <p>{{ value.created_at }}</p>
              </div>
              <div class="goods-price">合计：  <span>{{value.total_cost}}</span>蜂蜜</div>
            </div>
            <div class="receive-address">
              <img src="./images/icon-address.png" alt="">
              <div><b>收货地址:</b><span>&nbsp;&nbsp;<span>{{value.full_name}}</span>，<span>{{value.mobile}}</span>，<span>{{value.province}}{{value.city}}{{value.area}}{{value.address}}</span></span></div>
            </div>
            <div class="record-phone" @click="concactCall(value.seller_mobile)">
              <img src="./images/icon-phone.png" alt="">
              <p>联系卖家</p>
            </div>
          </div>
        </section>
      </base-scroll>
      <!-- 无记录 -->
      <section class="record-none" v-if="!m_dataList.length && flag">
        <div class="record-none-bg"></div>
        <div class="record-none-des">您还没有兑换过商品，赶紧去兑换哦~</div>
        <div class="add-goods" @click="goExchange">
          <img src="./images/icon-add.png" alt="">
          <a href="#">去兑换</a>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import BaseHeader from 'components/header/index'
import { invokeNativeMethod } from 'native'
import { mixins } from 'mixins'
export default {
  name: 'exchangeRecord',
  mixins: [mixins],
  data () {
    return {
      flag: false,
      dataList: [] // 数据列表
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 兑换记录列表
    async getData () {
      let params = {
        page: ++this.m_page
      }
      await this.$http('integralGoods/orderHistory', params).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.flag = true
        }
      })
      return Promise.resolve()
    },
    // 去兑换
    goExchange () {
      this.$router.push({ path: 'my-honey' })
    },
    // 调起电话
    concactCall (sellerMmobile) {
      // console.log(sellerMmobile)
      invokeNativeMethod('invokeTel', sellerMmobile)
    },
    pullDownRefresh () {
      this.statusInit()
      this.flag = false
      this.getData().then(() => {
        this.m_refresh = false
      })
    }
  },
  components: {
    BaseHeader,
    BaseScroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.record-list-container
  height 100%
  flex-col()
  background $color-white
  overflow hidden
  .record-list-content
    flex-col()
    background $color-f4
    width 100%
    height 100%
    background #F4F4F4
    // 无记录
    .record-none-bg
      background url('./images/icon-norecord.png') no-repeat center
      width 292px
      height 254px
      background-size 100% 100%
      margin 0 auto
      margin-top 162px
    .record-none-des
      margin 0 auto
      font-family PingFangSC-Regular
      f14()
      color #999999
      text-align center
      width 292px
      margin-top 76px
    .add-goods
      width 280px
      height 88px
      line-height 88px
      background #FF8A01
      border-radius 4px
      margin 0 auto
      text-align center
      margin-top 180px
      position relative
      img
        width 32px
        height 32px
        position absolute
        top 50%
        transform translateY(-50%)
      a
        font-family PingFangSC-Regular
        f16()
        color #FFFFFF
        margin-left 40px
  // 有记录
  section
    margin-bottom 20px
  .record-details-list
    background $color-white
    // padding 0 30px
    .record-header
      padding 28px 0 28px 30px
      display flex
      align-items center
      justify-content space-between
      .header-left
        display flex
        align-items center
        img
          width 70px
          height 70px
          margin-right 20px
        p
          font-family: PingFangSC-Medium
          font-size: 28px
          color: #000000
          letter-spacing: 0
          text-over(1)
          line-height 32px
      .header-right
        width 180px
        height 60px
        background-color #f2f2f2
        border-top-left-radius 30px
        border-bottom-left-radius 30px
        text-align center
        line-height 60px
        font-family: PingFangSC-Regular
        font-size: 24px
        color: #D0021B
    .line-one
      clearfix()
      height 128px
      // flex-f()
      flex 1
      flex-center()
      li:nth-child(1)
        // float left
        flex 0.1
        img
          width 24px
          height 24px
          display block
          border-radius 50%
      li:nth-child(2)
        flex 0.9
        div:nth-child(1)
          f14()
          color #9B9B9B
          line-height 30px
        div:nth-child(2)
          font-size 22px
          color #ccc
      li:nth-child(3)
        // float right
        width 168px
        height 56px
        line-height 56px
        background #FF8A00
        border-radius 4px
        color #fff
        font-size 28px
        img
          margin-left 14px
          width 24px
          height 24px
  .record-goods-details
    padding 0 30px
    flex-f()
    border-radius 10px
    flex 1
    div:nth-child(1)
      flex 0.3
      border-top-left-radius 20px
      border-bottom-left-radius 20px
      img
        width 180px
        height 180px
        border-top-left-radius 20px
        border-bottom-left-radius 20px
    div:nth-child(2)
      flex 0.7
      padding 0 22px
      border-top-right-radius 20px
      border-bottom-right-radius 20px
      background #F4F4F4
      >div
        align-items center
        justify-content center
        p
          f14()
          color #000000
          margin-top 20px
          line-height 40px
          width 466px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        ul
          width 100%
          // clearfix()
          display flex
          align-items center
          justify-content space-between
          margin-top 65px
          li:nth-child(1)
            // float left
            color  #D70110
            // position relative
            display flex
            line-height 1.2
            flex 0.5
            img
              width 28px
              height 42px
            span
              margin-top 5px
              f18()
              margin-left 15px
            b
              margin-top 15px
              margin-left 10px
          li:nth-child(2)
            f12()
            display flex
            align-items center
            justify-content flex-end
            flex 0.5
            span
              f14()
  .record-price
    display flex
    align-items center
    padding 10px 30px
    justify-content space-between
    .record-time
      display flex
      align-items center
      img
        width 24px
        height 24px
        margin-right 12px
      p
        font-family: PingFangSC-Regular
        font-size: 26px
        color: #9B9B9B
    .goods-price
    // float right
      // padding-right 30px
      color #D0021B
      f12()
      // margin-top 32px
      span
        f18()
        margin-right 5px
  .receive-address
    // padding 90px 30px 16px
    bd-t(#f4f4f4)
    bd-b(#f4f4f4)
    padding 20px 16px 40px 30px
    f13()
    // color #FF8A00
    position relative
    img
      position absolute
      width 20px
      height 26px
      display block
    >div
      margin-left 25px
    span
      f13()
      color #999
      line-height 30px
  .record-phone
    display flex
    padding 20px 0
    align-items center
    justify-content center
    img
      width 26px
      height 26px
      margin-right 20px
    p
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #F5A623
</style>
