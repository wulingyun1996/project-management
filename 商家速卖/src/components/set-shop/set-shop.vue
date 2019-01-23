<template>
  <div id="shopset">
    <base-header :intercept-back="true" @headerBack="headerBack"></base-header>
    <div class="top">
      <div class="name shop-logo" @click="setShopLogo">
        <i></i>
        <span class="k">店铺LOGO</span>
        <div class="m" v-show="shopFlag">
          <img :src="shopLogo" alt="" v-if="shopLogo">
          <img src="./images/logo.png" alt="" v-if='!shopLogo'>
        </div>
        <span class="v"></span>
      </div>
      <div class="name" @click="proName(AllInfo.shop_name)">
        <i></i>
        <span class="k">店铺名称</span>
        <span class="m">{{ shop }}</span>
        <span class="v"></span>
      </div>
      <!-- 2018/10月三期优化去除联系人选项 -->
      <!-- <div class="name" @click="conTact(AllInfo.contacts)">
        <i></i>
        <span class="k">联系人</span>
        <span class="m">{{ AllInfo.contacts }}</span>
        <span class="v"></span>
      </div> -->
      <div class="name pro" @click="mainProduct">
        <i></i>
        <span class="k">主营商品</span>
        <!-- <span class="m" v-if=" AllInfo.main_product.length === 1">{{ AllInfo.main_product[0]}}</span> -->
        <!-- <span class="m" v-else-if=" AllInfo.main_product.length >= 2 ">{{ AllInfo.main_product[0]}}、{{AllInfo.main_product[1] }}</span> -->
        <span class="m" v-if=" AllInfo.main_product">{{ AllInfo.main_product[0]}}</span>
        <span class="v"></span>
      </div>
    </div>
    <div class="column"></div>
    <div class="top">
      <div class="name">
        <!-- <i></i> -->
        <span class="k">服务城市</span>
        <div class="m">{{ cityList }}</div>
      </div>
      <div class="name" @click='onShow'>
        <i></i>
        <span class="k">发货地</span>
        <group>
          <x-address title="" v-model="value4" :list="addressData" placeholder="请选择地区" @on-hide="SellAddress" :show.sync='addressShow' ref="address"></x-address>
        </group>
        <span class="v"></span>
      </div>
      <!-- 2018/10月三期优化新增客服电话选项 -->
      <div class="name" @click="goServiceTel(AllInfo.service_mobile)">
        <!-- <i></i> -->
        <span class="k">客服电话</span>
        <span class="m">{{ AllInfo.service_mobile }}</span>
        <span class="v"></span>
      </div>
      <!-- 2018/09月二期优化去除 -->
      <!-- <div class="name" @click="manageAddress">
        <i></i>
        <span class="k">经营地址</span>
        <div class="m">{{ManageAddress.city}}{{ManageAddress.area}}{{ManageAddress.address}}</div>
        <span class="v"></span>
      </div> -->
      <div class="name manage" @click="brand">
        <span class="k">品牌信息</span>
        <span class="m" v-if="AllInfo.shopBrand.length === 1 && index === 0" v-for="(k,index) in AllInfo.shopBrand" :key="index">{{ k.name }}</span>
        <span class="m" v-if="AllInfo.shopBrand.length > 1 && index === 0" v-for="(k,index) in AllInfo.shopBrand" :key="index">{{ k.name }}...</span>
        <span class="v"></span>
      </div>
      <div class="name manage" @click="backgroundManage(AllInfo.shop_background)">
        <span class="k">店铺背景管理</span>
        <span v-if='!AllInfo.shop_background' class="m"><img class='background' src="./images/background1.png" alt=""></span>
        <span class="m"><img class='background' :src="AllInfo.shop_background" alt=""></span>
        <span class="v"></span>
      </div>
      <div class="name bd manage" @click="readPdf" v-show="AllInfo.attachment_name">
        <span class="k">附件</span>
        <a href='javascript:void(0)' ref="path" class="m accessory manage">{{ AllInfo.attachment_name }}</a>
        <span class="v" v-show="isShow"></span>
      </div>
    </div>
      <!-- 弹窗 -->
    <base-senior-popup ref="confirmPop" height="auto" class="confirmPop">
      <div class="popdes">
        <p>{{tips}}</p>
      </div>
      <div class="popbtn">
        <a href="javascript:" @click="cancel">否</a>
        <a href="javascript:" @click="confirm">是</a>
      </div>
    </base-senior-popup>
  </div>
</template>
<script>
import { Group, XAddress } from 'vux'
import cityList from '../../../data/areaAddress.json'
import ConfirmTextarea from 'base/confirm/confirm-textarea'
// import BaseA from 'base/address'
import { mapMutations, mapGetters } from 'vuex'
import { loadData, STATUS_OK } from 'api/common'
import { setShopBack, closeWebview } from 'api/navtive'
import { getPic } from 'common/js/dev'
import { sliceChar } from 'commons'
export default {
  data() {
    return {
      addressData: cityList,
      value4: [],
      show2: true,
      shop: '',
      company: '',
      contact: '',
      AllInfo: {},
      ManageAddress: [],
      Product: [],
      BrandInfo: [],
      oldData: '',
      conName: '',
      shopLen: '',
      isShow: false,
      enclosureHref: '',
      addressShow: false,
      cityList: '',
      shopLogo: '',
      shopFlag: false,
      tips: ''
    }
  },
  computed: {
    ...mapGetters(['commodity']),
    serviceCity() {
      return (
        (this.AllInfo.service_city && this.AllInfo.service_city.split(',')) ||
        []
      )
    },
    cityStorage() {
      return (
        (this.AllInfo.storage_city && JSON.parse(this.AllInfo.storage_city)) ||
        {}
      )
    }
  },
  created() {
    this.All()
    setShopBack()
    window.album = this.getAndoriadLogo
  },
  methods: {
    // 店铺logo
    getAndoriadLogo(imgUrl) {
      this.shopLogo = imgUrl
      this.uploadShopLogo(imgUrl)
    },
    setShopLogo() {
      let dev = this.$dev
      if (dev === 1) {
        window.android.selectPic(72, 72)
        return
      }
      if (dev === 2) {
        let obj = {
          width: 72,
          height: 72
        }
        getPic('selectPic', obj).then(val => {
          let [imgUrl] = val
          this.shopLogo = imgUrl
          this.uploadShopLogo(imgUrl)
        })
      }
    },
    uploadShopLogo(logo) {
      let URL = 'shop/editShop'
      let obj = {
        shop_logo_path: logo
      }
      this.$http(URL, obj)
    },
    // 去往客服电话页面
    goServiceTel(tel) {
      this.$router.push({
        path: '/set-telephone',
        query: { tel }
      })
    },
    confirmCity(payload, cityStorage) {
      if (!payload.length) {
        this.$vux.toast.text('请选择服务城市', 'middle')
        return
      }
      let citys = payload.join()
      let URL = 'shop/editShop'
      let obj = {
        service_city: citys,
        storage_city: JSON.stringify(cityStorage)
      }
      loadData(URL, obj).then(res => {
        if (res.code === STATUS_OK) {
          this.$refs.baseA.hide()
          this.All()
        }
      })
    },
    contactNameConfirm() {
      let URL = 'shop/editShop'
      let obj = {
        contacts: this.commodity
      }
      loadData(URL, obj).then(res => {
        if (res.code === STATUS_OK) {
          this.contacts = this.commodity
          this.All()
        }
      })
    },
    conTact() {
      this.$refs.contactArea.show()
    },
    headerBack() {
      if (this.AllInfo.shop_name === undefined) {
        this.tips = '店铺名称未填写，确认退出？'
        this.$refs.confirmPop.show()
        return
      }
      if (this.AllInfo.main_product[0] === '') {
        this.tips = '未添加主营商品，确认退出？'
        this.$refs.confirmPop.show()
        return
      }
      if (this.AllInfo.shopDeliver.length === 0) {
        this.tips = '未选择发货地，确认退出？'
        this.$refs.confirmPop.show()
        return
      }
      closeWebview()
    },
      // 取消关闭弹窗
    cancel () {
      this.$refs.confirmPop.hide()
    },
    confirm () {
      closeWebview()
    },
    // 跳转到店铺编辑页
    proName(shopName) {
      this.$router.push(`/name-edit/${shopName}`)
    },
    // 店铺图片管理页
    backgroundManage(shopBackground) {
      // this.$router.push(`/pic-manage/${shopBackground}`)
      this.$router.push({ path: '/pic-manage', query: { img: shopBackground } })
    },
    mainProduct() {
      this.$router.push('/main-product')
    },
    // 店铺所有信息接口
    All() {
      let URL = 'shop/shopDetail'
      loadData(URL).then(res => {
        if (res.code === STATUS_OK) {
          this.AllInfo = res.data
          this.shopLogo = this.AllInfo.shop_logo_path
          if (this.AllInfo.shop_name && this.AllInfo.shop_name.length > 12) {
            this.shop = this.AllInfo.shop_name.substring(0, 12) + '...'
          } else {
            this.shop = this.AllInfo.shop_name
          }
          this.setCommodity(this.AllInfo.shop_name)
          this.ManageAddress = res.data.shopManage
          this.enclosureHref = res.data.attachment
          this.cityList =
            res.data.serviceCity && sliceChar(res.data.serviceCity, 16)
          if (this.AllInfo.attachment_name) {
            this.isShow = true
          } else {
            this.isShow = false
          }
          this.shopFlag = true
          this.addressId(address)
          this.value4 = [
            res.data.shopDeliver.ids[0],
            res.data.shopDeliver.ids[1],
            res.data.shopDeliver.ids[2]
          ]
          let address = [
            res.data.shopManage.ids[0],
            res.data.shopManage.ids[1],
            res.data.shopManage.ids[2]
          ]
        }
      })
    },
    readPdf() {
      if (!this.enclosureHref) return
      let dev = this.$dev
      if (dev === 1) {
        window.android.onLineReadPdf(
          this.enclosureHref,
          this.AllInfo.attachment_name
        )
      } else if (dev === 2) {
        let shopName = this.AllInfo.attachment_name
        if (shopName.length > 6) {
          shopName = shopName.substr(0, 6) + '...'
        }
        let obj = {
          url: this.enclosureHref,
          title: shopName
        }
        window.webkit.messageHandlers.onLineReadPdf.postMessage(obj)
      }
    },
    // 发货地址接口
    SellAddress() {
      let URL = 'shop/shopAddress'
      let obj = {
        province: this.value4[0],
        city: this.value4[1],
        area: this.value4[2],
        address: '',
        type: 1
      }
      loadData(URL, obj).then(res => {
        if (res.code === STATUS_OK) {
          this.addressShow = false
          this.All()
        } else {
          console.log('lose')
        }
      })
    },
    onShow() {
      this.addressShow = true
    },
    brand() {
      this.$router.push('/brand')
    },
    manageAddress() {
      this.$router.push('/address')
    },
    ...mapMutations({
      addressId: 'ADDRESSID',
      setCommodity: 'COMMODITY'
    })
  },
  components: {
    Group,
    ConfirmTextarea,
    XAddress
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/mixin';
@import '~common/stylus/variable';

#shopset {
  background: $color-white;
  height: 100vh;
  overflow: hidden;
  .column {
    height: 20px; /* px */
    background: $color-f4;
    padding-top: 0;
  }
  .top {
    padding: 0 32px;
    .name {
      display: flex;
      align-items: center;
      height: 100px;
      border-b();
      background: $color-white;
      position: relative;

      &.shop-logo {
        height: 120px;
        img {
          wh(68px);
          border:1px solid #E4E2E2;
          border-radius: 4px;
          background-color: #F4F4F4;
          // border-radius(50%);
        }

        i {
          background: none;
        }
      }

      i {
        bg('star.png');
        display: block;
        width: 14px; /* px */
        height: 14px; /* px */
      }

      .k {
        font-size: 28px; /* px */
        color: #151515;
        display: block;
        margin-left: 24px;
      }

      .m {
        color: $color-6;
        font-size: 28px; /* px */
        position: absolute;
        right: 62px;
        top: 50%;
        transform: translateY(-50%);
        .background {
          width 150px
          height 70px
        }
         
      }

      .weui-cells {
        border-right: none;
        padding: 0;
        width: 60%;
        margin-top: 0;
        height: 98px;
        line-height: 98px;
        font-size: 28px; /* px */
        color: $color-6;

        .weui-cells:before {
          border-top: 0;
        }

        .vux-cell-value {
          color: $color-6;
          overflow: hidden;
          width: 100%;
          font-size: 28px; /* px */
        }
        .vux-popup-picker-placeholder {
          font-size: 28px; /* px */
          color: $color-6;
          line-height: 100px;
        }
      }

      .vux-no-group-title {
        position: absolute;
        right: 62px;
        top: 0;
      }
    }

    // .manage {
    //   padding-left: 14px;
    // }

    .bd {
      border: 0;
    }

    .name {
      .accessory {
        color: $color-orange;
      }

      .v {
        &:after {
          content: '';
          display: inline-block;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 16px; /* px */
          height: 32px; /* px */
          bg('arrow.png');
        }
      }
    }

    .pro {
      border: 0;
    }
  }
}

.vux-confirm {
  .vux-x-dialog {
    .weui-dialog {
      border-radius: 28px;
      background-color: $color-f7;
      max-width: 80%;

      .weui-dialog__hd {
        .weui-dialog__title {
          font-size: 34px; /* px */
          color: $color-0;
          font-weight: 700;
        }

        .vux-prompt {
          margin: 0 32px;
          padding-bottom: 0 !important;
        }
      }

      .vux-prompt input {
        height: 120px; /* px */
        border: 1px solid $color-gray; /* no */
        width: 90%;
        background: $color-white;
        padding-right: 10px;
        font-size: 26px; /* px */
        color: $color-3;
      }

      .weui-dialog__ft {
        border-top: 1px solid $color-gray; /* no */
        margin-top: 94px;

        &:after {
          border-top: 0;
        }

        .weui-dialog__btn {
          border-left: 1px solid $color-gray; /* no */
        }

        .weui-dialog__btn:after {
          border-left: 0;
        }

        .weui-dialog__btn_default, .weui-dialog__btn_primary {
          color: $color-blue;
          font-size: 34px; /* px */
          height: 88px; /* px */
          line-height: 88px; /* px */
        }
      }
    }
  }
}

.v-transfer-dom {
  .vux-popup-header {
    background: $color-white;
    height: 90px !important;

    // border-bottom: 1px solid $color-df;/*no*/
    .vux-popup-header-left, .vux-popup-header-right {
      font-size: 30px; /* px */
      text-align: center;
      line-height: 90px;
    }

    .vux-popup-header-right {
      color: $color-orange9;
      padding-right: 26px;
    }

    .vux-popup-header-left {
      padding-left: 26px;
      color: $color-0;
    }
  }

  .scroller-indicator {
    height: 90px; /* px */
    top: 50%;
    transform: translateY(-50%);
    border-top: 1px solid $color-df; /* no */
    border-bottom: 1px solid $color-df; /* no */
  }

  .scroller-component {
    height: 450px; /* px */
    background: $color-white;
  }

  .scroller-item {
    font-size: 30px; /* px */
    height: 90px; /* px */
    line-height: 90px; /* px */
    color: $color-highlight-background;
  }

  .scroller-item-selected {
    color: $color-0;
  }
}

.weui-toast {
  top: 50%;

  .weui-toast__content {
    font-size: 32px; /* px */
    padding: 20px !important;  
  }
 
}
  .confirmPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      .popdes
        padding 50px 0
        bd-b(#ccc, width = 1px)
        p:nth-child(1)
          font-weight bold
          f16()
        p:nth-child(2)
          margin-top 40px
          font-size 28px
      .popbtn
        width 100%
        a
          width 50%
          text-align center
          display inline-block
          float left
          bd-r(#ccc, width = 1px)
          padding 30px 0
          font-size 32px
          color #4A90E2  
</style>
