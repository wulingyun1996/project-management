<template>
  <div class="shop-detail-container">
    <div class="share-app" ref="share" v-show="isOpenByShare">
      <div class="left-share">
        <img @click="closeShare" src="./images/icon-close-gui.png" alt="">
        <img src="./images/icon-honey-logo.png" alt="">
        <div class="share-info">
          <p>建材采购师</p>
          <p>让采购变简单</p>
        </div>
      </div>
      <div class="share-right" id="downloadApp">
        打开APP
      </div>
    </div>
    <base-scroll
      :hasMore='m_hasMore'
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      :hasLoading="m_loading"
      :hasRefresh="m_refresh"
      message="已经到底了"
      :has-more="true"
      :beforeScroll="true"
      @beforeScroll="beforeScroll"
      @scrollToEnd="getData"
      @pulldown="pullDownRefresh"
      :data='m_dataList'>
      <div class="nav-back" @click="goBack" v-show="!isOpenByShare"></div>
      <div class="shop-detail-top" ref="img">
        <img :src="topImg" alt="">
      </div>
      <div class="shop-detail-info">
        <div class="honey-number">
          <div class="honey-images">
            <img src="./images/honey2.png" alt="">
          </div>
          <div class="name">{{honeyNumber}}</div>
          <div class="price">蜂蜜</div>
        </div>
        <div class="shop-detail-share" @click="showShareGuide">
          <img src="./images/icon-share.png" alt="">
          <span>分享</span>
        </div>
      </div>
      <div class="shop-describe">
        {{honeyTitle}}
      </div>
      <div class="shop-product">
        <img :src="shopLogo" alt="">
        <span>{{ shopName }}</span>
      </div>
      <div class="shop-line">
        <div class="line"></div>
        <p>商品详情</p>
      </div>
      <div class="shopdetail-img" v-html="infoImg"></div>
    </base-scroll>
    <base-footer text="马上兑换" @footerSubmit="exchangeShop"></base-footer>
    <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
      <p class="red">您的蜂蜜数不足</p>
      <p class="two">认证店铺，邀请好友注册认证可</p>
      <p class="tress">赚取蜂蜜哦~</p>
      <div class="fot-button">
        <div class="left-button" @click="gohide">知道了</div>
        <div class="right-button" @click="goFirend">邀请好友赚蜂蜜</div>
      </div>
    </base-senior-popup>
    <div class="share-popup" v-if="!isOpenByShare" v-show="isShowShareGuide" @click.self="hideShareGuide">
      <div class="share-content" :class="{ active: $isX }">
        <h2>
          <span>分享</span>
          <i @click="hideShareGuide"></i>
        </h2>
        <div class="share-list">
          <div class="item" ref="one" @click="share(0)">
            <img src="./images/img-wx.png">
            <p>微信好友</p>
          </div>
          <div class="item" ref="two" @click="share(1)">
            <img src="./images/img-circle.png">
            <p>朋友圈</p>
          </div>
          <div class="item" ref="three" @click="share(2)">
            <img src="./images/img-qq.png">
            <p>QQ好友</p>
          </div>
          <div class="item" ref="four" @click="share(3)">
            <img src="./images/img-qqzoom.png">
            <p>QQ空间</p>
          </div>
          <div class="item" ref="five" @click="shareUrl">
            <img src="./images/share-url.png" alt="">
            <p>复制链接</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import BaseFooter from 'components/footer'
import { invokeNativeMethod } from 'native'
import { mixins, wxMixins } from 'mixins'
import { smallPic, getItem, splitHref } from 'common'
export default {
  name: 'ShopDetails',
  mixins: [mixins, wxMixins],
  data () {
    return {
      infoImg: '',
      topImg: '',
      honeyTitle: '',
      honeyNumber: '',
      number: '',
      shareShow: false,
      isBeforeScroll: true,
      isShowShareGuide: false,
      // 店铺logo
      shopLogo: '',
      // 店铺名称
      shopName: '',
      isDetail: ''
    }
  },
  created () {
    this.getHoney()
    this.getData()
  },
  mounted () {
    if (!this.isOpenByShare) {
      return
    }
    this.openByTencent()
    /* eslint-disable */
    let { IS_TEST_ENV, NODE_ENV } = process.env
    var appKey = NODE_ENV !== 'production' ? 'ue2rov' : (NODE_ENV === 'production' && IS_TEST_ENV ? 'ue2rov' : 'al3sef')
    /* eslint-enable */
    setTimeout(() => {
      var src = document.createElement('script')
      src.type = 'text/javascript'
      src.defer = true
      src.innerHTML = `
        var data = OpenInstall.parseUrlParams();
        new OpenInstall({
          appKey: "${appKey}",
          onready: function () {
          var that = this;
          var button = document.getElementById('downloadApp');
          button.style.visibility = "visible";
          that.schemeWakeup();
          button.addEventListener("click", function () {
            that.wakeupOrInstall();
            return false;
          })
        }
      }, data)`
      document.body.appendChild(src)
    }, 100)
  },
  computed: {
    // 是否是通过分享页面打开
    isOpenByShare () {
      return !!this.$route.query.shareId
    },
    goodsId () {
      return this.$route.query.goodsId
    }
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'integralGoodsOff/detail'
      let obj = {
        id: this.goodsId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.topImg = res.data.image
          this.honeyNumber = res.data.integral_sum
          this.honeyTitle = res.data.title
          this.infoImg = res.data.describe
          this.shopLogo = res.data.shop_logo_path
          this.shopName = res.data.shop_name
          this.isDetail = res.data.is_deleted
          this._checkMore(res.data)
          if (this.isOpenByShare) {
            let obj = {
              title: res.data.title,
              desc: (getItem('nickname') ? getItem('nickname') : getItem('account')) + '喊你注册采购师，立赠30蜂蜜，蜂蜜当钱花，众多好礼0元领回家！',
              imgUrl: smallPic(res.data.image, 200, 200)
            }
            this.wxShare(obj)
          }
        }
      })
    },
    getHoney () {
      let url = 'integral/my'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.number = res.data.credits
        }
      })
    },
    exchangeShop () {
      if (this.$route.query.isShare === '1') {
        this.goDownLoad()
        return
      }
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.m_hasMore = true
      this.getData().then(() => {
        if (this.isDetail === 1) {
          this.$t('该商品已被下架~')
          return
        }
        if (this.honeyNumber > this.number) {
          this.$refs.alliancePopup.show()
        } else {
          this.$router.push({ name: 'SelectAddress', query: { goodsId: this.$route.query.goodsId } })
        }
      })
    },
    goBack () {
      this.$router.back()
    },
    gohide () {
      this.$refs.alliancePopup.hide()
    },
    goFirend () {
      invokeNativeMethod('nativeInviteFriends')
    },
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.img
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    },
    // 去下载页面
    goDownLoad () {
      this.$router.push('/app')
    },
    // 分享
    showShareGuide () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      if (this.$route.query.isShare === '1') {
        this.goDownLoad()
        return
      }
      this.isShowShareGuide = true
      setTimeout(() => {
        this.$refs.one.style.transform = 'scale(1)'
      }, 400)
      setTimeout(() => {
        this.$refs.two.style.transform = 'scale(1)'
      }, 600)
      setTimeout(() => {
        this.$refs.three.style.transform = 'scale(1)'
      }, 800)
      setTimeout(() => {
        this.$refs.four.style.transform = 'scale(1)'
      }, 1000)
      setTimeout(() => {
        this.$refs.five.style.transform = 'scale(1)'
      }, 1200)
    },
    hideShareGuide () {
      this.isShowShareGuide = false
      this.$refs.one.style.transform = 'scale(0)'
      this.$refs.two.style.transform = 'scale(0)'
      this.$refs.three.style.transform = 'scale(0)'
      this.$refs.four.style.transform = 'scale(0)'
      this.$refs.five.style.transform = 'scale(0)'
    },
    share (payload) {
      let obj = {}
      obj.type = payload
      obj.url = location.href
      obj.imgUrl = smallPic(this.topImg, 200, 200)
      obj.from = 20
      if (payload === 1 || payload === 3) {
        obj.title = (getItem('nickname') ? getItem('nickname') : getItem('account')) + '喊你注册采购师，立赠30蜂蜜，蜂蜜当钱花，众多好礼0元领回家！'
        obj.discriable = ''
      } else {
        obj.title = this.honeyTitle
        obj.discriable = (getItem('nickname') ? getItem('nickname') : getItem('account')) + '喊你注册采购师，立赠30蜂蜜，蜂蜜当钱花，众多好礼0元领回家！'
      }
      invokeNativeMethod('share', JSON.stringify(obj))
      this.hideShareGuide()
    },
    shareUrl () {
      let url = splitHref('isShare=1')
      invokeNativeMethod('copyToClipboard', url)
      this.hideShareGuide()
    },
    closeShare () {
      this.$refs.share.style.display = 'none'
    },
    openByTencent () {
      const UA = navigator.userAgent.toLowerCase()
      if (!!UA.match(/MicroMessenger/i) || !!UA.match(/QQ/i)) {
        this.isShow = true
        return
      }
      this.isShow = false
    }
  },
  components: {
    BaseScroll,
    BaseFooter
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2)
  .ipone-header
    top 70px!important
.shop-detail-container
  width 100%
  height 100%
  background-color #f4f4f4
  overflow hidden
  // position relative
  flex-col()
  .share-app
    opacity 0.6
    background-color #000
    width 100%
    height 120px
    position fixed
    display flex
    align-items center
    justify-content space-between
    z-index 10000
    top 0
    left 0
    padding 20px 30px
    .left-share
      display flex
      align-items center
      img:nth-child(1)
        width 32px
        height 32px
        margin-right 50px
      img:nth-child(2)
        width 80px
        height 80px
        margin-right 26px
      .share-info
        p
          font-family: PingFangSC-Medium
          font-size: 32px
          color: #FFFFFF
          letter-spacing: 0
        p:nth-child(2)
          margin-top 10px
          font-size: 24px
          color: #fff
    .share-right
      width 146px
      height 60px
      background: #FF8A00
      border-radius: 10px
      text-align center
      line-height 60px
      font-family: PingFangSC-Regular
      font-size: 24px
      color: #FFFFFF
      letter-spacing: 0
  .scroll-container
    flex 1
    position relative
  .nav-back
    position absolute
    top 75px
    left 30px
    width 60px
    height 60px
    border-radius(50%)
    color #fff
    z-index 999
    bg('arrow-left.png')
    background-size 24px 44px
    background-color rgba(0, 0, 0, .4)
  .alliance-popup
    >div
      width 560px!important
      background: #FFFFFF
      text-align center
      border-radius: 24px
      .red
        font-family: PingFangSC-Regular
        font-size: 36px
        color: #D0021B
        letter-spacing: 0
        margin-top 66px
      .two
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #999999
        margin-top 12px
        letter-spacing: 0
      .tress
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #999999
        margin-top 10px
        letter-spacing: 0
      .fot-button
        width 100%
        height 100px
        margin-top 40px
        overflow hidden
        bd-t(#ccc)
        .left-button
          width 50%
          height 100px
          float left
          text-align center
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #4A90E2
          letter-spacing: 0
          line-height 100px
          box-sizing border-box
          bd-r(#ccc)
        .right-button
          width 50%
          height 100px
          float left
          text-align center
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #FF8A00
          letter-spacing: 0
          line-height 100px
  .shop-detail-top
    width 100%
    height 750px
    img
      width 100%
      height 100%
  .shop-detail-info
    padding 10px  28px
    padding-right 0
    overflow hidden
    background-color #fff
    display flex
    align-items center
    justify-content space-between
    .shop-detail-share
      width 140px
      height 60px
      background-color #f2f2f2
      border-top-left-radius 30px
      border-bottom-left-radius 30px
      display flex
      align-items center
      justify-content center
      img
        width 30px
        height 36px
        margin-right 12px
      span
        font-family: PingFangSC-Regular
        font-size: 26px
        color: #999999
        letter-spacing: 0
    .honey-images
      float left
      width 40px
      height 70px
      img
        width 100%
        height 100%
    .name
      float left
      font-size 40px
      color #D70110
      margin-top 30px
      margin-left 10px
      font-family: PingFangSC-Medium
    .price
      float left
      font-size 24px
      margin-top 42px
      margin-left 5px
      color #D70110
  .shop-describe
    padding 10px 28px
    font-family: PingFangSC-Medium
    background-color #fff
    font-size: 32px
    color: #333333
  .shop-product
    padding 34px 36px
    display flex
    align-items center
    background-color #fff
    margin-top 10px
    img
      width 100px
      height 100px
      margin-right 26px
      bd(#f4f4f4)
      border-radius 10px
    span
      font-family: PingFangSC-Medium
      font-size: 32px
      color: #000000
      letter-spacing: 0
  .shop-line
    margin-top 50px
    padding 10px 28px
    position relative
    .line
      width 100%
      height 2px
      background-color #cccccc
    p
      width 200px
      background-color #f4f4f4
      position absolute
      text-align center
      font-family: PingFangSC-Medium
      font-size: 32px
      color: #FF8A00
      letter-spacing: 0
      left 50%
      margin-left -100px
      top -8px
  .shopdetail-img
    margin-top 30px
  .share-popup
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    z-index 1000
    background rgba(0, 0, 0, .5)
  .share-content
    position fixed
    left 0
    right 0
    bottom 0
    width 100%
    opacity .9
    background #fff
    z-index 10001
    padding 30px
    &.active
      padding-bottom 64px
    h2
      color $color-3
      f14()
      line-height 40px
      flex-align-item()
      margin-bottom 40px
      i
        wh(30px)
        bg('close.png')
    .share-list
      flex-align-item()
    .item
      transform scale(0)
      transition all 0.4s ease-in
      p
        flex 1
        color $color-3
        f12()
        tc()
      img
        height 120px
        width 120px
        margin-bottom 15px
</style>
