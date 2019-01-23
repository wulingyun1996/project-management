<template>
  <div class="scaneer-code-container">
    <base-header :title="title" :isShowBack='backShow' :isShowHeader="headerShow"></base-header>
    <div class="code-list-info" v-show="!codeShow">
      <p><span>商 品 数 量：</span> <span>{{ goodsNumber }}件</span></p>
      <p><span>属性共同点：</span> <span>{{ natrueList }}</span></p>
      <!-- <p><span>属性共同点：</span> <span>{{ natrueList[1] }}</span></p> -->
      <p><span>价 格 范 围：</span> <span>{{ priceRange }}</span></p>
      <p v-show="placeCode !==''"><span>位 置 代 码：</span> <span>{{ placeCode }}</span></p>
    </div>
    <div class="code-list" v-show="!codeShow">
      <base-scroll
      :data="m_dataList"
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :hasLoading="m_loading"
      :hasMore="m_hasMore"
      :hasRefresh="m_refresh">
        <ul>
          <li v-for="item in m_dataList" :key="item.id" @click="goDetail(item.id)">
            <div class="list-left" :class="{ hotActive: item.hot === 1, timeActive: item.sale === 1 }">
              <img :src="item.image_path" alt="">
              <img v-if="item.hot === 1" src="./images/icon-hot.png" alt="">
              <img v-if="item.sale === 1" src="./images/icon-time.png" alt="">
            </div>
            <div class="list-right">
              <p>{{ item.title }}</p>
              <div class="scan-brand">
                <div class="brand-left">
                  <div class="tag-left" v-show="item.is_stock_good === 1">现货</div>
                  <div class="tag-center" v-show="item.boutique === 1">精品馆</div>
                  <div class="tag-right" v-show="item.material === 1">材料馆</div>
                </div>
                <div class="brand-right" @click.stop="getShare(item)" v-show="item.audit_status === 2 || (item.has_token === 1 && item.sale === 1)">
                  <img src="./images/icon-share.png" alt="">
                  <span>分享</span>
                </div>
              </div>
              <div class="list-scan-hiti">
                <span v-show="item.has_token === 1 && item.sale !== 1">特约采购师价:</span>
                <span v-show="item.has_token === 0 && item.sale !== 1">平台价:</span>
                <span v-show="(item.has_token === 1 || item.has_token === 0) && item.sale === 1">
                  限时抢购价:<span>￥</span><span>{{ item.sale_price }}</span>
                </span>
              </div>
              <div class="main-progress" v-show="(item.has_token === 1 || item.has_token === 0) && item.sale === 1">
                <base-progress-bar
                  :ratio='Number(item.stock)'>
                </base-progress-bar>
                <div class="sale-out" v-show="isNone">已售罄</div>
                <div class="go-buy" :class="{'no-goods': item.stock === '100'}">
                  <b class="flash"></b>
                  <b>马上抢</b>
                </div>
              </div>
              <!-- <div class="list-scan-hiti" v-show="item.has_token === 0">
                平台价:
              </div> -->
              <!-- <div class="list-scan-hiti" v-show="(item.has_token === 1 || item.has_token === 0) && item.sale === 1">
                限时抢购价:
              </div> -->
              <div class="csan-price" v-show="item.has_token === 1 && item.sale !== 1">
                <div class="price-left" v-show="item.audit_status === 2">
                  <span>￥</span><span>{{ item.purchase_price}}</span>
                </div>
                <div class="price-left-two" v-show="item.audit_status !== 2">
                  <span>￥</span><span>***</span>
                </div>
                <div class="price-right" v-show="item.audit_status === 2">
                  <span>赚</span> <span>¥</span><span>{{ item.commision }}</span>
                </div>
                <div class="price-right-two" v-show="item.audit_status !== 2">
                  认证看底价
                </div>
              </div>
              <div class="csan-price" v-show="item.has_token === 0 && item.sale !== 1">
                <div class="price-left">
                  <span>￥</span><span>{{ item.promotion_price }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </base-scroll>
    </div>
    <div class="no-data" v-show="codeShow">
      <img src="./images/icon-code.png" alt="">
      <p>该二维码已失效</p>
    </div>
    <!-- 商品分享弹框 -->
    <base-goods-share
      ref="goodsShare"
      :commission="goodsCommission"
      :goodsPicture="mainPic"
      :shopName="shopName"
      :isScanCode='true'
      :goods-detail="goodsDetails">
    </base-goods-share>
  </div>
</template>

<script>
import baseGoodsShare from 'components/share/goods-share'
import BaseProgressBar from 'components/progress-bar'
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      title: '',
      goodsNumber: '',
      natrueList: '',
      priceRange: '',
      isNone: false,
      placeCode: '',
      codeShow: false,
      goodsCommission: '',
      mainPic: '',
      goodsDetails: {},
      shopName: '',
      isToken: '',
      headerShow: true
    }
  },
  created () {
    this.getData()
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    backShow () {
      if (this.$route.query.fromNative === '1') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'materialQr/listInfo'
      let obj = {
        id: this.id,
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.title = res.data.material_name
          this.placeCode = res.data.place
          this.goodsNumber = res.data.goods.total
          this.priceRange = res.data.price_area
          this.natrueList = res.data.attr
          this.isToken = res.data.has_token
          this.m_dataList = [...this.m_dataList, ...res.data.goods.data]
          this._checkMore(res.data.goods)
          // if (res.data.has_token === 0 && this.$route.query.fromNative === '0') {
          //   this.headerShow = true
          // }
        }
        if (this.$route.query.fromNative === '0' && (res.code === 601 || res.code === 602 || res.code === 603 || res.code === 604)) {
          this.codeShow = true
          this.headerShow = false
        }
        if (res.code === 601 || res.code === 602 || res.code === 603 || res.code === 604) {
          this.codeShow = true
        }
      })
    },
    goDetail (id) {
      if (this.isToken === 0) {
        this.$router.push({ path: '/goods-detail', query: { goodsId: id, isShare: 1, isScanCode: 1 } })
      } else {
        this.$router.push({ path: '/goods-detail', query: { goodsId: id, isScanCode: 1 } })
      }
    },
    getShare (row) {
      this.$refs.goodsShare.show()
      this.goodsCommission = row.commision
      this.mainPic = row.image_path
      this.shopName = row.shop_name
      let obj = {
        marketPrice: row.max_price,
        title: row.title,
        id: row.id
      }
      if (row.sale === 1) {
        obj.retailPrice = row.sale_price
      } else {
        obj.retailPrice = row.promotion_price
      }
      if (row.hot === 0) {
        obj.isHot = false
      } else {
        obj.isHot = true
      }
      if (row.sale === 0) {
        obj.isFlash = false
      } else {
        obj.isFlash = true
      }
      if (row.is_stock_good === 0) {
        obj.isNewGoods = false
      } else {
        obj.isNewGoods = true
      }
      if (row.material === 0) {
        obj.isJoinedMeterialGoods = false
      } else {
        obj.isJoinedMeterialGoods = true
      }
      if (row.boutique === 0) {
        obj.isJoinedBestGoods = false
      } else {
        obj.isJoinedBestGoods = true
      }
      this.goodsDetails = obj
    }
  },
  components: {
    baseGoodsShare,
    BaseProgressBar
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.scaneer-code-container
  height 100%
  flex-col-btw()
  background-color #f4f4f4!important
  background-image none!important
  .no-data
    flex 1
    text-align center
    img
      width 280px
      height 280px
      margin 180px auto 60px
    p
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #999999
      letter-spacing: 0
  .code-list-info
    background-color #fff
    height 280px
    padding 30px
    margin-bottom 15px
    p:first-child
      margin-top 0
    p
      margin-top 15px
      span
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #999999
        letter-spacing: 0
      span:last-child
        color #151515
  .code-list
    flex 1
    overflow hidden
    li
      display flex
      align-items center
      padding 30px
      background-color #fff
      .list-left
        width 220px
        height 220px
        position relative
        // border-radius 1px
        padding 2px
        &.hotActive
          bg('icon-hot-line.png')
        &.timeActive
          bg('icon-time-line.png')
        img:nth-child(1)
          width 100%
          height 100%
        img:nth-child(2)
          width 112px
          height 40px
          position absolute
          left 0
          top 0
        img:nth-child(3)
          width 112px
          height 40px
          position absolute
          left 0
          top 0
      .list-right
        flex 1
        padding-left 20px
        p
          font-family: PingFangSC-Medium
          font-size: 28px
          color: #000000
          letter-spacing: 0
          line-height: 1.3
          text-over(2)
        .scan-brand
          display flex
          align-items center
          margin-top 15px
          justify-content space-between
          .brand-left
            display flex
            align-items center
            .tag-left
              width 52px
              height 32px
              background: rgba(244,117,117,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #F47575
              letter-spacing: 0
              text-align center
              line-height 32px
              margin-right 8px
            .tag-center
              width 72px
              height 32px
              background: rgba(255,138,0,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #FF8A00
              letter-spacing: 0
              text-align center
              line-height 32px
              margin-right 8px
            .tag-right
              width 72px
              height 32px
              background: rgba(109,172,246,0.10)
              border-radius: 4px
              font-family: PingFangSC-Regular
              font-size: 20px
              color: #6DACF6
              letter-spacing: 0
              text-align center
              line-height 32px
          .brand-right
            display flex
            align-items center
            img
              width 24px
              height 24px
              margin-right 5px
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #F6333D
        .main-progress
          flex-s-btw()
          margin-top 10px
          align-items flex-end
          .sale-out
            f12()
            color $color-9
            line-height 34px
          .go-buy
            width 120px
            height 36px
            color $color-white
            background $color-orange
            bd($color-orange)
            tc()
            line-height 48px
            f12()
            border-radius(18px)
            flex-align-item()
            justify-content center
            &.no-goods
              width 120px
              height 36px
              color #E6B780
              background none
              bd(#E6B780)
              tc()
              line-height 48px
              f12()
              .flash
                width 24px
                height 24px
            .flash
              width 24px
              height 24px
              bg('flash-icon.png')
              background-size 100%
        .list-scan-hiti
          margin-top 30px
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #666666
          letter-spacing: 0
          line-height: 28px
          span
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #F6333D
              letter-spacing: 0
            span:last-child
              font-size 36px
        .csan-price
          margin-top 15px
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
          .price-left-two
            font-size: 24px
            color: #999999
            letter-spacing: 0
            // span:last-child
            //   font-size 36px
          .price-right
            bd(#FF8A00)
            border-radius 5px
            padding 6px 15px
            span
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #FF8100
              letter-spacing: 0
          .price-right-two
            bd(#FE3E58)
            border-radius 18px
            padding 6px 12px
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #FE3E58
            letter-spacing: 0
</style>
