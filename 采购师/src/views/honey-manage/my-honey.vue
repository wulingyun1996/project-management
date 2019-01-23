<template>
  <div class="my-honey-container">
    <base-header :is-show-title="false">
      <div class="header-center" @click="goHeader" slot="center">
        我的蜂蜜
      </div>
    </base-header>
    <div class="honey-tab-info" v-show="sortShow">
      <div class="merchant-left-tab" :class="{ merchantActive: honyTab === 0 }" @click="shopTab(0)">综合</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-center-tab" :class="{ merchantActive: honyTab === 1 }" @click="shopTab(1)">新品</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-right-tab" :class="{ merchantActive: honyTab === 2 }" @click="shopTab(2)">
        蜂蜜
        <div class="arrow">
          <div class="first-arrow" @click="sortesTab(3)">
            <div class="arrow-top" :class="{ upActive: sortTab === 3 }"></div>
          </div>
          <div class="last-arrow" @click="sortesTab(4)">
            <div class="arrow-bottom" :class="{ downActive: sortTab === 4 }"></div>
          </div>
        </div>
      </div>
    </div>
    <base-scroll
        message="未找到喜欢的商品？可线下到建材采购师体验馆再逛逛哦~"
        :data="m_dataList"
        :pullup="m_pullup"
        @scroll="scroll"
        :probeType='3'
        :listenScroll='true'
        ref="delegateScroll"
        :pulldown="m_pulldown"
        @scrollToEnd="getData"
        @pulldown="pullDownRefresh"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh"
        >
    <div class="honey-info-top" ref="infoTop">
      <div class="honey-info-container">
        <div class="honey-images">
          <img src="./images/honey2.png" alt="">
        </div>
        <div class="name">我的蜂蜜：</div>
        <div class="price">{{ honeyNumber }}</div>
        <!-- <div class="price" v-if="this.$route.query.number">{{ isHoney }}</div> -->
      </div>
      <div class="rule" @click="ruleShow">蜂蜜规则</div>
    </div>
    <div class="honey-shop" ref="tabHeight">
      <div class="shop-left">
        <img src="./images/careful.png" alt="">
        <span @click="gotoDetails">蜂蜜明细</span>
      </div>
      <div class="shop-right">
        <img src="./images/convert.png" alt="">
        <span @click="gotoExchange">兑换记录</span>
      </div>
    </div>
    <div class="honey-shopping" ref="bgHeight">
      <img src="./images/honeyShop.png" alt="">
    </div>
    <div class="merchant-tab" v-show="!sortShow">
      <div class="merchant-left-tab" :class="{ merchantActive: honyTab === 0 }" @click="shopTab(0)">综合</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-center-tab" :class="{ merchantActive: honyTab === 1 }" @click="shopTab(1)">新品</div>
      <img src="./images/icon-line.png" alt="">
      <div class="merchant-right-tab" :class="{ merchantActive: honyTab === 2 }" @click="shopTab(2)">
        蜂蜜
        <div class="arrow">
          <div class="first-arrow" @click="sortesTab(3)">
            <div class="arrow-top" :class="{ upActive: sortTab === 3 }"></div>
          </div>
          <div class="last-arrow" @click="sortesTab(4)">
            <div class="arrow-bottom" :class="{ downActive: sortTab === 4 }"></div>
          </div>
        </div>
      </div>
    </div>
        <ul class="honey-hot-list">
          <li v-for="goods in m_dataList" :key="goods.hot_id" @click="goodsDetail(goods.id)">
            <div class="shop-img">
              <img :src="goods.image" alt="">
            </div>
            <p>{{goods.title}}</p>
            <div class="shop-list-bottom">
              <div class="honey-images">
                <img src="./images/honey1.png" alt="">
              </div>
              <div class="name">{{goods.integral_sum}}</div>
              <div class="price">蜂蜜</div>
            </div>
          </li>
        </ul>
        <div class="no-data" v-show="hasData">
          <img src="./images/kong.png" alt="">
          <p>暂无可兑换商品，可线下到体验馆逛逛哦</p>
        </div>
      </base-scroll>
    <base-senior-popup ref="rulePopup" height="auto" class="rule-popup">
      <img src="./images/rule.png" alt="">
    </base-senior-popup>
  </div>
</template>

<script>
import { mixins } from 'mixins'
// import { mapState, mapMutations } from 'vuex'
export default {
  name: 'MyHoney',
  mixins: [mixins],
  data () {
    return {
      honyTab: 0,
      sortTab: 3,
      hasData: false,
      honeyNumber: 0,
      sortShow: false,
      type: 0
    }
  },
  created () {
    this.getHoney()
    this.getData()
  },
  computed: {
    isHoney () {
      return this.$route.query.number
    },
    scrollHeight () {
      return this.$refs.infoTop.offsetHeight + this.$refs.tabHeight.offsetHeight + this.$refs.bgHeight.offsetHeight
    }
  },
  methods: {
    shopTab (i) {
      if (this.honyTab === i) return
      this.honyTab = i
      // this.initData()
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      // this.m_refresh = true
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      if (i === 0) {
        this.sortShow = false
        this.sortTab = 3
        this.m_dataList = []
        this.type = 0
        this.getData()
      } else if (i === 1) {
        this.sortShow = false
        this.sortTab = 3
        this.m_dataList = []
        this.type = 1
        this.getData()
      } else {
        this.sortShow = false
        this.sortTab = 3
        this.m_dataList = []
        this.type = 3
        this.getData()
      }
    },
    goHeader () {
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      this.sortShow = false
    },
    // 排序的按钮
    sortesTab (i) {
      if (this.honyTab !== 2) return
      if (this.sortTab === i) return
      this.sortTab = i
      // this.initData()
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      this.$refs.delegateScroll.scrollTo(0, 0, 0, 0)
      if (i === 3) {
        this.sortShow = false
        this.m_dataList = []
        this.type = 3
        this.getData()
      } else if (i === 4) {
        this.sortShow = false
        this.m_dataList = []
        this.type = 2
        this.getData()
      }
    },
    getHoney () {
      let url = 'integral/my'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.honeyNumber = res.data.credits
        }
      })
    },
    async getData () {
      if (!this.m_hasMore) return
      let url = 'integralGoods/list'
      let obj = {
        page: ++this.m_page,
        pageSize: this.m_pageSize,
        sort_type: this.type
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          // this.m_dataList = []
          this._checkMore(res.data)
          // this.m_refresh = false
          if (!this.m_dataList.length) {
            this.hasData = true
            this.m_hasMore = true
          }
        }
      })
    },
    ruleShow () {
      // this.$refs.rulePopup.show()
      this.$router.push('/honey-rule')
    },
    goodsDetail (goodsId) {
      this.$router.push({ name: 'ShopDetails', query: { goodsId } })
    },
    gotoExchange () {
      this.$router.push('/exchange-record')
    },
    gotoDetails () {
      this.$router.push('/honey-details')
    },
    // 滚动事件
    scroll (paload) {
      let posY = paload.y
      if (posY < -this.scrollHeight) {
        this.sortShow = true
        // this.setSortHrader(true)
      } else {
        this.sortShow = false
        // this.setSortHrader(false)
      }
    }
  },
  activated () {
    this.getHoney()
    // if (this.$route.query.fromNative === '1') {
    //   // this.sortShow = false
    //   this.setSortHrader(false)
    // }
  }
  // beforeRouteLeave (to, from, next) {
  //   if (this.$route.query.fromNative === '1') {
  //     // this.sortShow = false
  //     this.setSortHrader(false)
  //   }
  //   next()
  // }
}
</script>
<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.my-honey-container
  height 100%
  flex-col-btw()
  overflow hidden
  .header-center
    width 200px
    height 40px
    f18()
    color $color-0
    text-align center
  .scroll-container
    .honey-tab-info
      position fixed
      top 0
      left 0
  .merchant-tab,.honey-tab-info
    width 100%
    height 88px
    display flex
    align-items center
    bd-b(#E8E8E8)
    background-color #fff
    z-index 1000
    // bg('icon-handle.png')
    >div
      height 100%
      width 33%
      line-height 88px
      text-align center
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #666
      letter-spacing: 0
      &.merchantActive
        color: #FF8A00
    .merchant-right-tab
      display flex
      align-items center
      padding-left 30px
      justify-content center
      .arrow
        // margin-left 16px
        .first-arrow
          width 100px
          height 50px
          display flex
          align-items flex-end
          // padding-left 10px
          // justify-content center
          .arrow-top
            width 20px
            height 12px
            margin-left 18px
            bg('icon-up-gray.png')
            &.upActive
              bg('icon-orange-up.png')
        .last-arrow
          width 100px
          height 50px
          margin-top 6px
          display flex
          // padding-left 10px
          align-items flex-start
          // justify-content center
          .arrow-bottom
            width 20px
            margin-left 18px
            height 12px
            bg('icon-down-gray.png')
            &.downActive
              bg('icon-orange-down.png')
    img
      width 4px
      height 40px
  .honey-tab
    display flex
    align-items center
    width 100%
    padding 0 20px
    >div
      flex 1
      text-align center
  .honey-info-top
    width 100%
    height 276px
    bg('bg.png')
    position relative
    .honey-info-container
      width 370px
      height 130px
      line-height 130px
      text-align center
      background: rgba(255,255,255,0.30)
      border-radius: 10px
      position absolute
      left 50%
      margin-left -185px
      top 52px
      overflow hidden
      .honey-images
        float left
        margin-top 15px
        margin-left 30px
        img
          width 38px
          height 64px
      .name
        float left
        margin-top 5px
        margin-left 10px
        font-size 26px
        color #000000
      .price
        float left
        font-size 48px
        color #FF8A00
    .rule
      position absolute
      top 16px
      right 32px
      font-size 26px
      color #D0021B
  .honey-shop
    // position absolute
    position relative
    top -50px
    margin 0 auto
    // left 50%
    // margin-left -351px
    width 702px
    height 110px
    background: #FFFFFF
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.50)
    border-radius: 10px
    overflow hidden
    .shop-left
      float left
      width 50%
      height 100%
      line-height 110px
      font-size 28px
      color #417505
      img
        width 30px
        height 32px
        margin-right 10px
        vertical-align middle
      text-align center
    .shop-right
      float left
      width 50%
      height 100%
      line-height 110px
      text-align center
      font-size 28px
      color #FF8A00
      img
        width 30px
        height 32px
        margin-right 10px
        vertical-align middle
  .honey-shopping
    width 566px
    height 150px
    // margin-bottom 30px
    // position absolute
    margin 0 auto
    // top 450px
    // left 50%
    // margin-left -283px
    img
      width 100%
      height 100%
  .scroll-container
    // padding 0 54px
    // margin-top 20px
    flex 1
    .honey-hot-list
      overflow hidden
      background-color #f9f9f9
      li
        float left
        padding 18px
        margin-top 20px
        margin-left 20px
        width 46%
        height 430px
        bd(#f9f9f9)
        border-radius: 10px
        background-color #fff
        .shop-img
          width 100%
          height 280px
          img
            width 100%
            height 100%
        p
          color #000000
          font-size 28px
          letter-spacing: 0
          line-height 30px
          margin-top 10px
          padding-top 4px
          height 59px
          text-over(2)
        .shop-list-bottom
          // overflow hidden
          display flex
          align-items flex-end
          margin-top 10px
          .honey-images
            width 26px
            height 42px
            // float left
            // margin-left 10px
            // margin-top 13px
            img
              width 100%
              height 100%
          .name
            // float left
            // margin-top 25px
            // margin-left 10px
            font-size 32px
            line-height 30px
            color #D0021B
            margin 0 5px
          .price
            // float left
            font-size 20px
            color #D0021B
            // margin-left 5px
            // margin-top 35px
  .no-data
    width 300px
    height 300px
    color $color-9
    margin-top 60px
    margin-left 210px
    f16()
    tc()
    img
      width 200px
      margin-bottom 20px
    p
      line-height 40px
      font-size 28px
</style>
