<template>
  <div class="card-identify" v-if="loading">
    <div v-if="hasIdentify">
      <header>
        <div class="left">
          <span></span>
          <span>特约认证返佣</span>
        </div>
        <div class="right" @click="viewQRcode">
          <img src="" alt="">
          查看二维码
        </div>
      </header>
      <div class="card">
        <div>专属特权</div>
        <div>再返佣{{info.one_discount}}%</div>
        <div>
          <div class="left">
            <img src="./identify_shop.png" alt="">
            <span>认证店铺，可在原直采价基础上再返佣{{info.one_discount}}%</span>
          </div>
          <img src="./identify_edit.png" alt="" class="edit" @click="edit">
        </div>
      </div>
      <p class="explain">说明：{{info.explain}}</p>
      <p class="tips">最终解释权归商户所有</p>
      <div class="hr"></div>
      <div class="goods" @click="$router.push({path: '/identify-goods'})">
        <span>特约认证活动商品<span v-if="info.goodsCount !== 0">（{{info.goodsCount}}）</span></span>
        <img src="./arrow_right.png" alt="">
      </div>
    </div>
    <div v-if="!hasIdentify" style="height: 100%;">
      <div class="unIdentify">
        <img src="./unIdentify_center.png" alt="">
        <div class="btn" @click="$router.push({path: '/card-router/identify-info'})">
          <div>
            <img src="./add.png" alt="">
            <span>点我立即设置</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="mask" v-show="showModule" @click="showModule = false">
      </div>
    </transition>
    <transition name="fade">
      <div class="module" v-show="showModule">
        <div class="title">
          <span></span><span>{{info.shopName}}</span><span></span>
        </div>
        <p>专属特权</p>
        <p>再返佣{{info.one_discount}}%</p>
        <div class="box">
          <Qrcode :value="url" type="img"></Qrcode>
        </div>
        <p>扫描二维码立享优惠</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { Qrcode } from 'vux'
function resultUrl () {
  if (process.env.API_ROOT === '//test-sapi.cgs18.com/') {
    return 'http://test-c.cgs18.com'
  } else if (process.env.API_ROOT === '//pre-sapi.cgs18.com/') {
    return 'http://pre-c.cgs18.com'
  } else {
    return 'http://c.cgs18.com'
  }
}
export default {
  components: {
    Qrcode
  },
  data () {
    return {
      loading: false,
      hasIdentify: true,
      showModule: false,
      url: '',
      info: {}
    }
  },
  mounted () {
    this.getData()
    console.log(process.env.API_ROOT)
  },
  methods: {
    viewQRcode () {
      this.showModule = true
    },
    getData () {
      this.$http('card/getCradDetails').then(res => {
        this.loading = true
        console.log(res)
        if (res.code === 200) {
          if (!res.data) {
            this.hasIdentify = false
            return
          }
          this.info = res.data
          let text = this.info.one_discount
          if (text.indexOf('.') !== -1) {
            if (parseInt(text.split('.')[1]) === 0) {
              this.info.one_discount = text.split('.')[0]
            }
          }
          this.url = resultUrl()
          this.url = this.url + '/shop-auth/?shopId=' + this.info.seller_id
          console.log(this.url)
        } else {
          this.$vux.toast.text(res.message, 'middle')
        }
      })
    },
    edit () {
      this.$router.push({path: '/card-router/identify-info', query: {one_discount: this.info.one_discount, explain: this.info.explain, id: this.info.id}})
    }
  }
}
</script>
<style lang="stylus">
.card-identify
  .box
    >div
      img
        width 100%!important
        height 100%!important
</style>

<style lang="stylus" scoped>
.card-identify
  height 100%
  background #F4F4F4
  >div
    background #FFF
header
  display flex
  justify-content space-between
  padding 40px 0 56px 0
  font-size 28px
  .left
    display flex
    align-items center
    span:first-child
      height 26px
      width 2px;/*no*/
      background #FF8A00
      margin-left 30px
    span:last-child
      line-height 40px
      color #333
      margin-left 12px
  .right
    color #FF8A00
    margin-right 28px
    line-height 40px
.card
  width 580px
  height 300px
  background url('./identify_card.png') no-repeat
  background-size 100% 100%
  border-radius 28px
  margin 0 auto
  position relative
  color #FFE8C8
  border-top 1px solid transparent
  .left
    display flex
    align-items center
    img
      width 24px
      height 20px
  .edit
    position absolute
    width 48px
    height 48px
    bottom 12px
    right 12px
  >div:first-child
    font-size 28px
    line-height 40px
    margin-top 104px
    padding-left 40px
  >div:nth-child(2)
    font-size 32px
    line-height 44px
    padding-left 40px
  >div:last-child
    display flex
    padding-left 40px
    padding-right 32px
    justify-content space-between
    margin-top 32px
    span
      font-size 24px
      color #CC7E1E
      transform scale(.9)
      transform-origin left
      display inline-block
p.explain
  color #999
  font-size 24px
  line-height 34px
  padding 0 30px
  margin-top 56px
p.tips
  margin-left 30px
  color #CCC
  font-size 40px
  transform scale(.5)
  transform-origin left
.hr
  background #F4F4F4
  height 20px
  margin-top 48px
.goods
  display flex
  padding 0 30px
  justify-content space-between
  align-items center
  height 76px
  span
    color #333
    font-size 28px
  img
    width 10px
    height 20px
div.mask
  position fixed
  width 100%
  height 100%
  left 0
  top 0
  background rgba(0, 0, 0, .5)
.module
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 540px
  height 638px
  border-radius 20px
  background #FFF
  text-align center
  .title
    display flex
    margin-top 40px
    color #333
    font-size 26px
    justify-content center
    align-items center
    span:nth-child(2)
      margin-left 21px
      margin-right 21px
    span:first-child, span:last-child
      width 74px
      height 1px;/*no*/
      background #ccc
  p:nth-of-type(1)
    margin-top 52px
    color #333
    font-size 32px
    line-height 44px
  p:nth-of-type(2)
    color #FF0000
    font-size 36px
    line-height 50px
    margin-top 4px
  .box
    width 280px
    height 280px
    border 1px solid #ccc;/*no*/
    margin 40px auto 0
    padding 14px
    img
      width 100%
      height 100%
  p:nth-of-type(3)
    margin-top 8px
    color #999
    font-size 24px
    line-height 34px
  .bottom
    margin-top 58px
    border-top 1px solid #ccc;/*no*/
    color #333
    font-size 26px
    height 72px
    line-height 72px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
.unIdentify
  height 100%
  background url('./unIdentify_bg.png') no-repeat
  background-size 100% 100%
  overflow hidden
  >img
    display block
    width 696px
    margin 52px auto 0
  .btn
    position fixed
    left 50%
    transform translateX(-50%)
    width 508px
    height 92px
    border-radius 8px
    bottom 206px
    background #FF8A00
    >div
      display flex
      height 100%
      align-items center
      justify-content center
      color #FFF
      font-size 32px
      img
        width 30px
        height 30px
        margin-right 16px
.fade-enter-active, .fade-leave-active
  transition all 1s ease
.fade-enter, .fade-leave-to
  opacity 0
</style>
