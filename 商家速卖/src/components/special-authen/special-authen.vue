<template>
  <div class="special-authen-container" v-show="authenFlag">
    <base-header>
      <div class="special-authen-help" @click="goAuthenHelp">使用帮助</div>
    </base-header>
    <div class="special-authen-wrapper">
      <div class="authen-logo">
        <h1>
          特约认证返佣比<span>{{ ratio }}%</span>
        </h1>
        <div class="modify-entry">
          <span @click="goAuthenSet">修改</span>
          <i></i>
        </div>
      </div>
      <p class="authen-desc">{{ text }}</p>
      <div class="seperate"></div>
      <h2>特约认证二维码</h2>
      <div class="scan-code">
        <Qrcode :value="authenUrl" type="img"></Qrcode>
      </div>
      <p class="desc">用户打开采购师App扫描您店铺专属的特约认证二维码，可直接认证为您店铺的特约采购师，无需审核。</p>
    </div>
    <base-footer @footerSubmit="goManageGoods">管理活动商品</base-footer>
    <base-senior-popup ref="success" class="modify-wrapper">
      <img src="./images/success.png" alt="">
      <h2>店铺特约认证开通成功啦~</h2>
      <div class="manage-goods" @click="goManageGoods">管理活动商品</div>
      <div class="close-popup" @click="closeGuidePopup"></div>
    </base-senior-popup>
    <base-senior-popup ref="modify" class="modify-wrapper">
      <img src="./images/modify.png" alt="" class="modify">
      <h2>店铺特约认证修改成功啦~</h2>
      <div class="manage-goods" @click="goManageGoods">管理活动商品</div>
      <div class="close-popup" @click="closeGuidePopup"></div>
    </base-senior-popup>
  </div>
</template>

<script>
const { cgsVersion } = require('../../../package.json')
import { Qrcode } from 'vux'
/* eslint-disable */
let { IS_TEST_ENV, NODE_ENV, VERSION } = process.env
const ENV = NODE_ENV === 'production'
const isCustomVersion = VERSION !== 'static'
const isTest = ENV && IS_TEST_ENV
var URL = !ENV ?
                `http://test-c.cgs18.com` :
          isTest ?
                (isCustomVersion ? `http://test-c.cgs18.com/${cgsVersion}/` : `http://test-c.cgs18.com/`) :
                (isCustomVersion ? `http://c.cgs18.com/${cgsVersion}/` : `http://c.cgs18.com/`)
/* eslint-enable */
export default {
  name: 'SpecialAuthen',
  data () {
    return {
      ratio: '',
      text: '',
      id: '',
      authenUrl: '',
      authenFlag: false,
      isDestroyCache: false // 解决未认证的时候，该页面的缓存
    }
  },
  created () {
    this.getAuthenDetail()
  },
  computed: {
    isSuccess () {
      return this.$route.query.modify === 0
    },
    isModify () {
      return this.$route.query.modify === 1
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isSuccess) {
        this.$refs.success.show()
      }
      if (this.isModify) {
        this.$refs.modify.show()
      }
    })
  },
  methods: {
    getAuthenDetail () {
      let url = 'card/getCradDetails'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          if (res.data) {
            /* eslint-disable */
            let { one_discount, explain, id, seller_id } = res.data
            if (one_discount.indexOf('.') !== -1) {
              if (parseInt(one_discount.split('.')[1]) === 0) {
                this.ratio = one_discount.split('.')[0]
              }
            }
            this.ratio = one_discount
            this.text = explain
            this.id = id
            this.authenUrl = `${URL}shop-auth?shopId=${seller_id}`
            this.authenFlag = true
            /* eslint-enable */
          } else {
            this.isDestroyCache = true
            this.$router.replace({ name: 'SepcialAuthenManage', query: { fromNative: 1 } })
          }
        }
      })
    },
    goAuthenHelp () {
      this.$router.push('/authen-guide')
    },
    goManageGoods () {
      this.closeGuidePopup()
      this.$router.push({ path: '/identify-goods' })
    },
    goAuthenSet () {
      let { ratio, text, id } = this
      this.$router.push({ name: 'SpecialAuthenSet', query: { ratio, text, id } })
    },
    closeGuidePopup () {
      if (this.isSuccess) {
        this.$refs.success.hide()
        return
      }
      this.$refs.modify.hide()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'SpecialAuthenSet' || this.isDestroyCache) {
      this.$del(to, from, next, this, true)
    }
    next()
  },
  components: {
    Qrcode
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.special-authen-container
  height 100%
  background #fff
  overflow hidden
  flex-col-btw()
  .special-authen-help
    color #4A90E2
  .special-authen-wrapper
    flex 1
    padding 0 44px
    bg('bg-atuhen1.png')
    .authen-logo
      width 660px
      height 330px
      margin-top 20px
      margin-bottom 36px
      position relative
      overflow hidden
      // bg('authen-logo.png')
      bg('yxy-authen-logo.png')
      h1
        tc()
        margin-top 130px
        margin-bottom 40px
        color #D0021B
        fz(20px)
        span
          fz(36px)
      .modify-entry
        padding-right 36px
        flex-f()
        justify-content flex-end
        f13()
        color #333
        span
          padding 20px
          margin-top -20px
          margin-right -10px
        i
          width 14px
          height 24px
          bg('icon-arrow.png')
    .authen-desc
      f13()
      color #DF8B48
      line-height 40px
      padding-left 20px
      margin-bottom 26px
    .seperate
      border 2px dashed #FDDDA8
    h2
      fz(20px)
      color #f00
      tc()
      margin 40px 0 20px
    .scan-code
      wh(270px)
      margin 0 auto 26px
      img
        width 100%!important
        height 100%!important
    .desc
      f13()
      color #999
      padding-left 20px
      line-height 40px
  .modify-wrapper
    >div
      width 540px!important
      height 460px!important
      border-radius(20px)
      overflow unset
      position relative
      top 35%
      tc()
      padding-top 26px
      img
        display block
        width 288px
        height 190px
        margin 0 auto 40px
        &.modify
          width 260px
          height 158px
      h2
        f16()
        color #666
        line-height 48px
        margin-bottom 40px
      .manage-goods
        width 300px
        height 80px
        background #FF8A00
        border-radius(100px)
        line-height 80px
        color #fff
        f16()
        margin 0 auto
      .close-popup
        wh(60px)
        border-radius(50%)
        bg('icon-close.png')
        position absolute
        left 50%
        bottom -100px
        transform translateX(-50%)
</style>
