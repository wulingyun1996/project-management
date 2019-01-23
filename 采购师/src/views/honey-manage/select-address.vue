<template>
  <div class="select-address-container">
    <base-header>
    </base-header>
    <div class="info" @click="jumpAddress">
      <div v-if="userInfo">
        <div class="user-info">
          <span v-show="userInfo.full_name">{{userInfo.full_name}}</span>
          <span v-show="userInfo.mobile">{{userInfo.mobile}}</span>
        </div>
        <div class="address" v-show="userInfo.provinceChinese && userInfo.cityChinese && userInfo.areaChinese">
          {{userInfo.provinceChinese}}{{userInfo.cityChinese}}{{userInfo.areaChinese}}{{userInfo.address}}
        </div>
      </div>
      <div v-if="!userInfo">
        请选择收货地址
      </div>
      <img src="./images/arrow_right.png" alt="">
    </div>
    <img src="./images/address.png" alt="">
    <div class="shop-detail">
      <div class="shop-detail-info">
        <div class="detail-info-left">
          <img :src="bannerImg" alt="">
        </div>
        <div class="detail-info-right">
          <p>{{ title }}</p>
          <div class="bootom">
            <div class="honey-images">
              <img src="./images/honey1.png" alt="">
            </div>
            <div class="name">{{ honeyNumber }}</div>
            <div class="price">蜂蜜</div>
            <div class="goods-add-item">
              <base-input-number
                :min='1'
                v-model="number"
               >
              </base-input-number>
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <span>合计：</span>
        <span>{{ price }}</span>
        <span>蜂蜜</span>
      </div>
    </div>
    <base-footer class="fotterButton" :background="isColor" text="确认" @footerSubmit="exchangeShop"></base-footer>
    <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
      <p class="red">您的蜂蜜数不足</p>
      <p class="two">认证店铺，邀请好友注册认证可</p>
      <p class="tress">赚取蜂蜜哦~</p>
      <div class="fot-button">
        <div class="left-button" @click="gohide">知道了</div>
        <div class="right-button" @click="goFirend">邀请好友赚蜂蜜</div>
      </div>
    </base-senior-popup>
    <base-senior-popup ref="successPopup" height="auto" class="alliance-popup">
      <p class="red">确定使用{{ price }}蜂蜜兑换吗？</p>
      <div class="fot-button">
        <div class="left-button" @click="hide">取消</div>
        <div class="right-button" @click="confim">确定</div>
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
import BaseInputNumber from 'components/input/input-number'
import BaseFooter from 'components/footer'
import { dev, invokeNativeMethod } from 'native'
export default {
  data () {
    return {
      bannerImg: '',
      title: '',
      honeyNumber: '',
      totalNumber: 0,
      number: 1,
      sumNumber: '',
      addressId: '',
      userInfo: null,
      flag: false
    }
  },
  mounted () {
    window.returnAddress = this.returnAddress
    if (this.flag) return
    this.getUserInfo()
  },
  created () {
    this.getUserInfo()
    this.getData()
    this.getHoney()
  },
  computed: {
    price () {
      return this.number * this.honeyNumber
    },
    isColor () {
      if (this.userInfo === '' || this.number === 0 || this.number === '') {
        return '#ccc'
      } else {
        return '#ff8a00'
      }
    },
    honey () {
      return this.sumNumber - this.price
    }
  },
  methods: {
    jumpAddress () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeGoAddress()
          return
        }
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeGoAddress.postMessage('')
        }
      } catch (e) {
        //
      }
    },
    returnAddress (obj) {
      if (obj) {
        this.flag = true
        if (typeof obj === 'string') {
          this.userInfo = JSON.parse(obj)
        } else {
          this.userInfo = obj
        }
        return
      }
      this.flag = false
    },
    async getData () {
      let url = 'integralGoods/detail'
      let obj = {
        id: this.$route.query.goodsId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.bannerImg = res.data.image
          this.title = res.data.title
          this.honeyNumber = res.data.integral_sum
        }
      })
    },
    getHoney () {
      let url = 'integral/my'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.sumNumber = res.data.credits
        }
      })
    },
    exchangeShop () {
      this.getData().then(() => {
        if (!this.userInfo) {
          this.$t('请选择收货地址', 'middle')
          return
        }
        if (this.number === '' || this.number === 0) {
          this.$t('蜂蜜数量不可为空和为0')
          return
        }
        if (this.price > this.sumNumber) {
          this.$refs.alliancePopup.show()
        } else {
          this.$refs.successPopup.show()
        }
      })
    },
    gohide () {
      this.$refs.alliancePopup.hide()
    },
    hide () {
      this.$refs.successPopup.hide()
    },
    confim () {
      let url = 'integralGoods/addOrder'
      let obj = {
        id: this.$route.query.goodsId,
        addressId: this.userInfo.id,
        number: this.number
      }
      this.$http(url, obj).then(res => {
        // this.$t(res.message)
        if (res.code === this.$ok) {
          this.$router.push({ path: '/exchange-success', query: { moobile: res.data.service_mobile } })
        }
        if (res.code === 600) {
          this.$refs.successPopup.hide()
          this.getData()
          this.$t(res.message)
        }
      })
    },
    goFirend () {
      invokeNativeMethod('nativeInviteFriends')
    },
    async getUserInfo () {
      const res = await this.$http('order/getShippingAddress')
      if (res.code === 200) {
        this.userInfo = res.data
        this.addressId = res.data.id
      } else {
        this.$t(res.message, 'middle')
      }
    }
  },
  components: {
    BaseInputNumber,
    BaseFooter
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.select-address-container
  height 100%
  overflow hidden
  position relative
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
  .cgs-footer-container
    position absolute
    bottom 0
  .info
    display flex
    align-items center
    padding 28px 24px
    background #FFF
    >div
      flex 1
    .user-info
      display flex
      justify-content space-between
      color #333
      font-size 30px
      line-height 42px
      >span:last-child
        margin-right 20px
    .address
      margin-top 10px
  .shop-detail
    padding 0 24px
    height 250px
    position relative
    .shop-detail-info
      width 100%
      height 180px
      background: #F4F4F4
      margin-top 30px
      border-radius: 10px
      overflow hidden
      .detail-info-left
        float left
        width 25%
        height 180px
        img
          width 100%
          height 100%
      .detail-info-right
        width 75%
        padding 20px
        float left
        p
          font-family: PingFangSC-Regular
          line-height 40px
          font-size: 28px
          color: #000000
          text-over(2)
        .bootom
          overflow hidden
          .honey-images
            float left
            width 30px
            height 50px
            margin-top 15px
            img
              width 100%
              height 100%
          .name
            float left
            font-size 36px
            color #D70110
            margin-top 30px
            margin-left 10px
            font-family: PingFangSC-Medium
          .price
            float left
            font-size 20px
            margin-top 42px
            margin-left 5px
            color #D70110
          .goods-add-item
            float right
            margin-top 15px
    .total
      overflow hidden
      position absolute
      right 30px
      bottom 0
      span:first-child
        font-family: PingFangSC-Regular
        font-size: 24px
        color: #D0021B
      span:nth-child(2)
        font-family: PingFangSC-Regular
        font-size: 36px
        color: #D0021B
      span:last-child
        font-family: PingFangSC-Regular
        font-size: 20px
        color: #D0021B
        text-align: right
</style>
