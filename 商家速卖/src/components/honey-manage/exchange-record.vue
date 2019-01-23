<template>
  <div class="record-list-container">
    <base-header></base-header>
    <div class="record-list-content">
      <!-- 有记录 -->
      <base-scroll
        v-if="!isShowNoDataPage"
        :data="m_dataList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getData"
        @pulldown="pullDownRefresh"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh"
        >
        <section v-for="(value, index) in m_dataList" :key="index">
          <div class="record-details-list">
            <!-- <ul class="line-one">
              <li>
                <img :src="value.buyerAvatar" alt="" v-if="value.buyerAvatar">
                <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
              </li>
              <li>
                <div>
                  <div>{{ value.buyerMobile.substring(0,3) }}****{{ value.buyerMobile.substring(7) }}</div> -->
                  <!-- <div>{{ value.created_at }}</div>  -->
                <!-- </div> -->
              <!-- </li> -->
              <!-- <li @click="concactCall(value.mobile)"><img src="./concact.png">联系他</li> -->
              <!-- <li>{{ value.created_at.slice(0, 10) }}</li> -->
            <!-- </ul> -->
            <div class="record-top">
              <div class="record-top-left">
                <img :src="value.buyerAvatar" alt="" v-if="value.buyerAvatar">
                <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
                <span>{{ value.buyerMobile.substring(0,3) }}****{{ value.buyerMobile.substring(7) }}</span>
              </div>
              <div class="record-top-right">
                {{ value.created_at.slice(0, 10) }}
              </div>
            </div>
            <div class="record-goods-details clearfix">
              <div>
                <img :src="value.goodsImage" alt="">
                <img src="./images/icon-screw.png" v-show="value.delivery_status === 1"  alt="">
                <img src="./images/icon-goods.png" v-show="value.delivery_status === 2" alt="">
              </div>
              <div>
                <div>
                  <p>{{ value.goodsTitle }}</p>
                  <ul class="clearfix">
                    <li>
                      <img src="./goods-icon.png" alt="">
                      <span>{{ value.goodsIntegralSum }}</span><b>蜂蜜</b>
                    </li>
                    <li>x<span>{{ value.number }}</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="price-info">
              <div class="goods-price">合计：  <span>{{ value.goodsIntegralSum * value.number}}</span>蜂蜜</div>
            </div>
            <div class="receive-address">
              <img src="./address.png" alt="">
              <div><b>收货地址:</b><span>&nbsp;&nbsp;<span>{{ value.full_name }}</span>，<span>{{ value.mobile }}</span>，<span>{{ value.province }}{{ value.city }}{{ value.area }}{{ value.address }}</span></span></div>
              <!-- <div class="address-left">1</div> -->
              <!-- <div class="address-right" v-show="value.delivery_status === 0" @click="getDelive(value.id)">发货</div> -->
            </div>
            <div class="record-code" v-show="value.delivery_status === 0">
              <div class="code-left" @click="concactCall(value.mobile)">
                <img src="./images/icon-phone.png" alt="">
                <p>联系他</p>
              </div>
              <div class="code-right" @click="getDelive(value.id)">
                <img src="./images/icon-car.png" alt="">
                <p>发货</p>
              </div>
            </div>
            <div class="record-phone" v-show="value.delivery_status !== 0">
              <div class="call-phone" @click="concactCall(value.mobile)">
                <img src="./images/icon-phone.png" alt="">
                <p>联系他</p>
              </div>
            </div>
          </div>
        </section>
      </base-scroll>
      <!-- 无记录 -->
      <section class="record-none" v-if="isShowNoDataPage">
        <div class="record-none-bg"></div>
        <div class="record-none-des">暂无兑换记录去添加更多优质商品吧~</div>
        <div class="add-goods" @click="addGoods">
          <img src="./goods-add.png" alt="">
          <a href="#">蜂蜜商品</a>
        </div>
      </section>
    </div>
    <!-- 发货的弹框 -->
    <base-senior-popup ref="confirmPop" height="auto" class="confirmPop">
      <div class="popdes">
        <ul>
          <li @click="shopCheck(1)">
            <div class="left-img" :class="{ active: propTab === 1 }"></div>
            <div class="right-info" :class="{ infoActive: propTab === 1 }">用户已自提</div>
          </li>
          <li @click="shopCheck(2)">
            <div class="left-img" :class="{ active: propTab === 2 }"></div>
            <div class="right-info" :class="{ infoActive: propTab === 2 }">已物流发货</div>
          </li>
        </ul>
      </div>
      <div class="popbtn">
        <a href="javascript:" @click="cancel">取消</a>
        <a href="javascript:" @click="confirm">确定</a>
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
import { invokeNativeMethod } from 'common/js/dev'
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      buyerMobile: 'buyerMobile',
      flag: false,
      propTab: 1,
      orderId: '',
      isShowNoDataPage: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 兑换记录列表
    async getData () {
      if (!this.m_hasMore) return
      let params = {
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http('integral/getExchangeRecord', params).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          if (!this.m_dataList.length) {
            this.isShowNoDataPage = true
          }
          this._checkMore(res.data)
          // this.flag = true
        }
      })
      return Promise.resolve()
    },
    // 添加商品
    addGoods () {
      this.$router.push({ path: 'honey-edit' })
    },
    // 调起电话
    concactCall (mobile) {
      invokeNativeMethod('invokeTel', mobile)
    },
    pullDownRefresh () {
      this.statusInit()
      this.flag = false
      this.getData().then(() => {
        this.m_refresh = false
      })
    },
    getDelive (id) {
      this.orderId = id
      this.$refs.confirmPop.show()
    },
    cancel () {
      this.$refs.confirmPop.hide()
    },
    // 选择发货情况
    confirm () {
      let url = 'integral/deliveryGoods'
      let obj = {
        order_id: this.orderId,
        status: this.propTab
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$refs.confirmPop.hide()
          this.propTab = 1
          this.initData()
          this.m_dataList = []
          this.isShowNoDataPage = false
          this.getData().then(() => {
            this.m_refresh = false
          })
        }
      })
    },
    shopCheck (i) {
      if (this.propTab === i) return
      this.propTab = i
    }
  }
  // watch: {
  //   'm_dataList' (val) {
  //     let length = val.length
  //     if (length) {
  //       this.isShowNoDataPage = false
  //       return
  //     }
  //     this.isShowNoDataPage = true
  //   }
  // }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.record-list-container
  height 100%
  flex-col()
  background $color-f4
  overflow hidden
  .record-list-content
    flex-col()
    width 100%
    height 100%
    background #F4F4F4
    overflow hidden
    // 无记录
    .record-none-bg
      background url('./norecord.png') no-repeat center
      background-size 100% 100%
      width 362px
      height 254px
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
        display block
        width 32px
        height 32px
        position absolute
        top 50%
        transform translateY(-50%)
        left 58px
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
    padding 0 30px
    .record-top
      padding 20px 0px
      display flex
      align-items center
      justify-content space-between
      .record-top-left
        display flex
        align-items center
        img
          width 80px
          height 80px
          border-radius 50%
          margin-right 20px
        span
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #000000
          line-height 32px
      .record-top-right
        font-family: PingFangSC-Regular
        font-size: 24px
        color: #CCCCCC
        line-height 28px
    .line-one
      clearfix()
      height 128px
      // flex-f()
      flex 1
      flex-center()
      li:nth-child(1)
        // float left
        flex 0.2
        img
          width 80px
          height 80px
          display block
          border-radius 50%
      li:nth-child(2)
        // float left
        flex 0.8
        div:nth-child(1)
          f14()
          color #000
          line-height 30px
        div:nth-child(2)
          font-size 22px
          color #ccc
      li:nth-child(3)
        // float right
        width 128px
        height 56px
        line-height 56px
        // background #FF8A00
        // border-radius 4px
        font-size 24px
        color #ccc
        img
          margin-left 14px
          width 24px
          height 24px
  .record-goods-details
    background #F4F4F4
    flex-f()
    border-radius 18px
    flex 1
    div:nth-child(1)
      flex 0.3
      position relative
      img
        width 180px
        height 180px
      img:nth-child(2),
      img:nth-child(3)
        position absolute
        top 0
        left 0
        width 84px
        height 82px
    div:nth-child(2)
      flex 0.7
      padding 0 22px
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
          width: 100%;
          clearfix()
          margin-top 65px
          justify-content space-between
          li:nth-child(1)
            float left
            color  #D70110
            position relative
            img
              position absolute
              width 24px
              height 40px
              bottom 5px
            span
              f18()
              margin-left 40px
            b
              margin-left 16px
          li:nth-child(2)
            float right
            f12()
            margin-top 10px
            span
              f14()
  .price-info
    display flex
    justify-content flex-end
    .goods-price
      color #D0021B
      f12()
      margin-top 20px
      span
        f18()
  .record-code
    display flex
    align-items center
    // padding 20px 0
    height 80px
    .code-left,
    .code-right
      flex 0.5
      display flex
      height 100%
      align-items center
      justify-content center
      img
        width 32px
        height 32px
        margin-right 16px
      p
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #FF8A00
    .code-right
      img
        width 32px
        height 26px
  .record-phone
    display flex
    align-items center
    justify-content center
    padding 20px 0
    .call-phone
      display flex
      align-items center
      img
        width 32px
        height 32px
        margin-right 16px
      p
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #FF8A00
  .receive-address
    padding 20px 0 16px
    f13()
    // color #FF8A00
    position relative
    bd-t(#f4f4f4)
    bd-b(#f4f4f4)
    img
      position absolute
      width 20px
      height 26px
      display block
      margin-top 2px
    >div
      margin-left 25px
    span
      f13()
      color #999
      line-height 30px
  .receiver-address
    width 100%
    padding 20px 0
    display flex
    align-items center
    justify-content space-between
    .address-right
      width 100px
      height 50px
      bd(#000)
      text-align center
      line-height 50px
      color #333
      border-radius 10px
  .confirmPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      .popdes
        padding 60px 0
        bd-b(#ccc, width = 1px)
        ul
          display flex
          align-items center
          justify-content center
          li
            display flex
            align-items center
            justify-content center
            .left-img
              width 36px
              height 36px
              margin-right 20px
              bg('icon-no-check.png')
              &.active
                bg('icon-check.png')
            .right-info
              color #999
              font-size 28px
              &.infoActive
                color #333
          li:last-child
            margin-left 30px
      .popbtn
        width 100%
        a
          width 50%
          text-align center
          display inline-block
          float left
          color #666
          font-size 32px
          bd-r(#ccc, width = 1px)
          padding 30px 0
        a:last-child
          color: #FF8A01
</style>

