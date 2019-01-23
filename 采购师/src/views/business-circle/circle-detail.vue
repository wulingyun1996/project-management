<template>
  <div class="circle-detail" :class="{iphoneX: $isNeedFit}">
    <cgs-header :title="circle.name"  @back="back"></cgs-header>
    <div class="placeholder"></div>
    <base-scroll
      class="circle-scroll"
      :data="shopList">
      <div class="place-holder"></div>
      <div class="cd-m" v-show="!isShow">
        <div class="cd-pic">
          <img :src="circle.img" alt="">
        </div>
        <p class="cd-t">{{circle.name}}</p>
        <p class="cd-l">
          <span v-for="(tab, index) in circle.tabs" :key="index">{{tab}}</span>
        </p>
      </div>
      <div class="product-status" v-show="isShow">
        <div class="status-img">
          <img :src="circle.img" alt="" v-if="circle.img !== ''">
          <img src="./images/icon-logo-1.png" v-else alt="">
        </div>
        <p>{{ circle.name }}</p>
      </div>
      <div class="act-box" v-if="actList.length != 0" >
        <div class="act-h" >
          <div>活动进行时~</div>
          <div @click="goHotActivities()">查看更多</div>
        </div>
        <div class="act-item" v-for="(act, index) in actList" :key="index" @click="goUnionDetail(act.id)">
          <div class="act-pic">
            <img :src="act.image_path" alt="">
          </div>
          <div class="act-info">
            <p>{{act.title}}</p>
            <p>{{act.act_time}}</p>
            <p>{{(act.op_province || '') + (act.op_city || '') + (act.op_area || '') + (act.address || '')}}</p>
          </div>
        </div>
      </div>
      <div class="cd-b">
        <div class="cb-h">
          圈内商家
        </div>
        <div class="cb-list">
          <div class="cb-item" v-for="(shop, index) in shopList" :key="index" @click="goShopDetail(shop.seller_id)">
            <div class="item-main">
              <div class="cb-pic item-right img-pic">
                <img :src="shop.shop_logo_path" alt="">
                <!-- <div class="img-approae" v-show="shop.is_display_audit && shop.is_audit">
                  <img src="./images/icon-approae.png" alt="">
                </div> -->
              </div>
              <div class="cb-info">
                <div class="right-top">
                  <img src="./images/icon-approae-two.png" v-show="shop.is_display_audit && shop.is_audit" alt="">
                  <div>{{ shop.shop_name }}</div>
                </div>
                <p v-if="shop.brand.length!=0">
                  品牌：<span>{{shop.brand.replace(/\//g, ',')}}</span>
                </p>
                <p v-if="shop.main_product.length!=0">
                  主营商品：<span>{{shop.main_product.replace(/\//g, ',')}}</span>
                </p>
                <p>
                  服务城市：<span>{{shop.op_city || ''}}{{shop.op_area ? '/' + shop.op_area : ''}}</span>
                </p>
                <!-- <div v-show="shop.is_display_audit && shop.is_audit" class="authed-box">
                  <div>认证店铺再返佣{{shop.one_discount}}%</div>
                  <div>已认证</div>
                </div> -->
              </div>
            </div>
            <!-- <div v-show="shop.is_display_audit && !shop.is_audit" class="auth-guide">
              <div>认证店铺再享XX%佣金及认证奖励</div>
              <div>去认证</div>
            </div> -->
             <div class="footer" v-show="shop.is_display_audit && !shop.is_audit">
              <div class="left-sgin">
                <img src="./images/icon-sign.png" alt="">
                <span>认证店铺低价购买+蜂蜜奖励</span>
              </div>
              <div class="right-sgin">
                <img class="line" src="./images/icon-line.png" alt="">
                <span>去认证</span>
                <img class="arrow" src="./images/icon-arrow.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import CgsHeader from 'components/circle-header/index.vue'
import { closeWebview } from 'native'
export default {
  data () {
    return {
      id: this.$route.query.id,
      circle: {
        name: '',
        img: '',
        tabs: []
      },
      actList: [],
      shopList: [],
      unionId: ''
    }
  },
  created () {
    this.getCircleDetail()
  },
  computed: {
    isShow () {
      if (this.$route.query.isHot === '2') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getCircleDetail () {
      let url = 'union/groupDetail'
      let obj = {
        id: this.id,
        is_hot: this.$route.query.isHot === '2' ? 2 : 1
      }
      this.$http(url, obj)
        .then(res => {
          if (res.code === this.$ok) {
            let data = res.data
            this.circle.name = data.group_name
            this.circle.img = data.head_img
            this.circle.tabs = data.tab
            this.actList = data.act_info
            this.shopList = data.shop_info
            this.unionId = data.union_id
          }
        })
    },
    goUnionDetail (id) {
      this.$router.push({
        path: '/unionDetail',
        query: {
          id
        }
      })
    },
    goShopDetail (id) {
      this.$router.push({
        path: '/shop-detail',
        query: {
          id
        }
      })
    },
    goHotActivities () {
      this.$router.push({
        path: '/circle-activity',
        query: {
          id: this.unionId
        }
      })
    },
    back () {
      if (this.isFromNative) {
        closeWebview()
        return
      }
      this.$router.back()
    }
  },
  components: {
    CgsHeader,
    BaseScroll
  }
}

</script>
<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.circle-detail
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  flex-col()
  &.iphoneX
    padding-top 88px
  .circle-scroll
    padding 0 30px
    background #f4f4f4
    flex 1
    .place-holder
      height 20px
  .placeholder
    width 100%
    height 110px
  .product-status
    width 100%
    height 332px
    bg('icon-bg.png')
    border-radius(16px)
    margin-bottom 30px
    text-align center
    padding 0 76px
    .status-img
      width 160px
      height 160px
      bd(#f4f4f4)
      border-radius 16px
      margin 30px auto
      img
        width 100%
        height 100%
    p
      font-family: PingFangSC-Medium
      font-size: 32px
      color: #333333
      letter-spacing: 0
      line-height 35px
  .cd-m
    background #fff
    padding 20px 30px
    border-radius(16px)
    margin-bottom 30px
    .cd-pic
      width 100%
      height 200px
      overflow hidden
      img
        width 100%
    .cd-t
      color #333
      fz(16px)
      margin 10px 0 0 0
    .cd-l
      line-height 3
      span
        color #eaa723
        f12()
        padding 5px 10px
        bd(#eaa723, 1px)
        border-radius(5px)
        margin-right 10px
        &:last-child
          margin-right 0
  .act-box
    background #fff
    border-radius(10px)
    padding 20px
    .act-h
      display flex
      justify-content space-between
      margin-bottom 20px
      div
        &:first-child
          color #000
          fz(16px)
        &:last-child
          fz(13px)
          color #999
          background url('./images/act-arrow.png') right center no-repeat
          padding-right 24px
          background-size 14px
          line-height 1.4
    .act-item
      display flex
      justify-content flex-start
      align-items center
      margin-bottom 20px
      .act-pic
        width 160px
        height 160px
        bd(#f4f4f4)
        margin-right 30px
        border-radius 16px
        overflow hidden
        img
          width 100%
          height 100%
      .act-info
        p
          fz(13px)
          color #999
          line-height 1.8
          text-over(1)
          &:first-child
            fz(14px)
            color #333
            text-over(1)
            line-height 2
  .cd-b
    .cb-h
      text-align center
      fz(16px)
      color #000
      position relative
      padding 20px 0
      &:before
        border-top: 1px dashed #F5A623;/*no*/
        content ''
        position absolute
        left 0
        top 50%
        width 36%
      &:after
        border-top: 1px dashed #F5A623;/*no*/
        content ''
        position absolute
        right 0
        top 50%
        width 36%
    .cb-list
      .cb-item
        border-radius(10px)
        background #fff
        margin-bottom 20px
        padding-bottom 20px
        &:last-child
          margin-bottom 0
        .item-main
          padding 30px 0 16px 20px
          display flex
          justify-content flex-start
          align-items center
          .cb-pic
            width 160px
            height 160px
            margin-right 30px
            overflow hidden
            position relative
            bd(#f4f4f4)
            border-radius 16px
            img
              width 100%
              max-height 100%
            .img-approae
              position absolute
              top 0
              right 0
              width 76px
              height 40px
              img
                width 100%
                height 100%
          .cb-info
            display flex
            flex-direction column
            justify-content flex-start
            flex 1
            .right-top
              display flex
              // justify-content space-between
              align-items center
              img
                width 28px
                height 28px
                margin-right 10px
              div
                font-family: PingFangSC-Regular
                font-size: 28px
                color: #333333
                letter-spacing: 0
                // width 80%
                text-over(1)
                line-height 1.3
            p
              text-over(1)
              color #000
              line-height 32px
              margin-bottom 6px
              fz(11px)
              &:first-child
                fz(14px)
                color #000
                line-height 2
              &:nth-child(2)
                fz(11px)
              &:last-child
                margin-bottom 0
              &:nth-last-of-type(1)
                padding-bottom 10px
                // border-bottom 1px dashed #f3f3f3;/*no*/
            .authed-box
              height 50px
              line-height 50px
              display flex
              justify-content space-between
              align-items center
              border-top 1px dashed #f3f3f3;/*no*/
              padding 10px 0 0 0
              box-sizing content-box
              // margin-top 10px
              div
                &:first-child
                  fz(11px)
                  color: #F5A623
                  background url('./images/icon-comision.png') left center no-repeat
                  background-size 36px
                  padding-left 50px
                &:last-child
                  f12()
                  color #fff
                  background: #FFDFBA
                  border-radius(26px)
                  width 100px
                  height 40px
                  text-align center
                  line-height 40px
                  margin-right 30px
        .footer
          width 650px
          background: #FF8D8D
          height 40px
          display flex
          padding 0 20px
          align-items center
          justify-content space-between
          border-top-left-radius 20px
          border-bottom-left-radius 20px
          float right
          .left-sgin
            display flex
            align-items center
            img
              width 28px
              height 28px
              margin-right 10px
            span
              font-family: PingFangSC-Regular
              font-size: 22px
              color: #FFF5C1
              letter-spacing: 0
          .right-sgin
            width 130px
            display flex
            align-items center
            justify-content space-between
            .line
              width 4px
              height 28px
            .arrow
              width 24px
              height 24px
            span
              font-family: PingFangSC-Semibold
              font-size: 26px
              color: #FFFFFF
              letter-spacing: 0
        .auth-guide
          background: #FCD4D3
          height 60px
          display flex
          justify-content space-between
          line-height 60px
          margin 0  0 20px  0
          div
            &:first-child
              fz(12px)
              color #000
              background url('./images/bs-au-guide.png') left center no-repeat
              background-size 28px 34px
              padding-left 40px
              margin-left 20px
            &:last-child
              color: #D0021B
              f12()
              background url('./images/icon-go-auth.png') right center no-repeat
              background-size 12px
              padding-right 30px
              margin-right 20px
  .img-pic
    width 192px!important
    height 176px!important
  .item-right
    margin-right 20px!important
</style>
