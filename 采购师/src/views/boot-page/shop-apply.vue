
<template>
  <div class="apply-container apply-container-wrapper">
    <base-header :intercept-back="true" @headerBack="headerBack"></base-header>
    <div class="wrapper">
      <!-- 步骤条 -->
      <div class="apply-up">
        <div class="step-bar">
          <span></span>
          <span :class="{activeT : isActiveT, noActive: isNoActive}"></span>
          <span><b>Step1&nbsp;&nbsp;</b>基本信息</span>
          <span :class="{complete: isActiveT}"><b :class="{completeT: isActiveT}">Step2&nbsp;&nbsp;</b>证件信息</span>
        </div>
        <div class="invite-code" v-show="this.page === 0 ? true:false">
          <p>邀请码</p>
          <input
            type="tel"
            placeholder="2-8位数字邀请码（选填）"
            maxlength="8"
            v-model="inviteCode"
            @focus="justifyBodyHeight"
            @blur="restoreBodyHeight">
          <p>若输入推荐人的邀请码，他将为您提供专业服务</p>
        </div>
      </div>
      <div class="special-content-all">
        <div class="step-content">
          <!-- 步骤一 -->
          <div class="step-all" v-if="showStepone">
            <div class="step-one">
              <div><span>*</span> 联系人</div>
              <div class="form">
                <input
                  type="text"
                  placeholder="请输入姓名"
                  v-model="name"
                  maxlength="10"
                  @focus="justifyBodyHeight"
                  @blur="restoreBodyHeight">
              </div>
            </div>
            <div class="step-one">
              <div><span>*</span> 手机号码</div>
              <div class="form">
                <input
                  type="text"
                  placeholder="用于客服人员与您联系"
                  v-model.trim="tel"
                  maxlength="11"
                  @focus="justifyBodyHeight"
                  @blur="restoreBodyHeight">
              </div>
            </div>
            <div class="step-one" @click="showPopup">
              <div><span>*</span> 服务城市</div>
              <div class="form">
                <input type="text" placeholder="商品仅在该城市展示，提交后不可修改" v-model="serviceCitys" readonly/>
                <img class="arrow" src="images/arrow.png" alt="">
              </div>
            </div>
          </div>
          <!-- 步骤二 -->
          <div class="step-all-two" v-if="showSteptwo">
            <div class="step-two-des">
              <p><span>* </span>身份证</p>
              <p>（大小不超过2M）</p>
            </div>
            <div class="apply-pic">
              <div class="photo" :class="{no: id_front, 'id-front': !id_front}" @click="upLoad(3)">
                <img :src="id_front" alt=""  v-show="id_front">
                <i v-if="id_front" @click.stop="removePic(3)"></i>
              </div>
              <div class="photo" :class="{no: id_back, 'id-back': !id_back}" @click="upLoad(4)">
                <img :src="id_back" alt="" v-show="id_back">
                <i v-if="id_back" @click.stop="removePic(4)"></i>
              </div>
            </div>
            <!-- 营业执照 -->
            <div class="step-two-des-down clearfix">
              <div class="step-two-des">
                <p><span>* </span>营业执照</p>
                <p>（大小不超过5M）</p>
              </div>
            </div>
            <div class="step-two-des-down clearfix">
              <div class="step-two-des">
                <p><span>* </span>品牌授权书</p>
                <p>（大小不超过5M）</p>
              </div>
            </div>
            <div class="apply-pic">
              <!-- 营业执照 -->
              <div class="photo photo-licence" :class="{no: company_img}" @click="upLoad(1)">
                <img :src="company_img" alt="" v-show="company_img">
                <i v-if="company_img" @click.stop="removePic(1)"></i>
              </div>
              <!-- 授权证书 -->
              <div class="photo photo-brand" :class="{no: brand_abImage}" @click="upLoad(2)">
                <img :src="brand_abImage" alt="" v-show="brand_abImage">
                <i v-if="brand_abImage" @click.stop="removePic(2)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-footer ref="button" v-show="this.page === 0" class="button" :class="{ active: isActive }" @footerSubmit="submit" background="this.background">
      <span>点击下一步，就快完成啦~</span>
    </base-footer>
    <div v-show="this.page === 1" class="buttonTwo">
      <div class="keep-saveBtn"><span></span><span @click="submitBtn(1)">审核开店</span><span @click="lookStatement(1)"></span></div>
      <div class="keep-saveBtnT"><span></span><span @click="submitBtn(2)">极速开店</span><span @click="lookStatement(2)"></span></div>
    </div>
    <!-- 弹窗 -->
    <base-senior-popup ref="confirmPop" height="auto" class="confirmPop">
      <div class="popdes">
        <p>提示</p>
        <p>你确定放弃申请吗？</p>
      </div>
      <div class="popbtn">
        <a href="javascript:" @click="cancel">取消</a>
        <a href="javascript:" @click="confirm">确定</a>
      </div>
    </base-senior-popup>
    <popup @click='goHome' ref="popup"></popup>
    <base-service-city @choosedCity="choosedCity" ref="showPopup"></base-service-city>
    <router-view></router-view>
  </div>
</template>

<script>
import { closeWebview, setBack, dev, getPic, invokeNativeMethod } from 'native'
import areaAddress from 'data/areaAddress'
import Scroll from 'components/scroll/scroll'
import { loadDataPost } from 'api/ajax'
import { STATUS_OK } from 'api/status'
import Popup from 'components/pop/popup'
import BaseServiceCity from 'components/address/service-city'
import { id2Name } from 'components/address/service'
export default {
  name: 'ShopApply',
  data () {
    return {
      name: '',
      tel: '',
      city: [],
      brandAccreditBook: [],
      id_front: '',
      brand_abImage: '',
      id_back: '',
      company_img: '',
      // id_front: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg', // 身份证正面 test
      // id_back: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg', // 反面 test
      // company_img: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg', // 营业执照 test
      // brand_abImage: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg', // 授权证书 test
      data: {},
      serviceCitys: '',
      selectedIndex: 0,
      showSteptwo: false, // 步骤二
      showStepone: true, // 步骤一
      page: 0, // 当前页
      isNoActive: true,
      inviteCode: '', // 邀请码
      shopStatus: 1, // 开店状态
      background: '#bcbcbc'
    }
  },
  computed: {
    isActive () {
      return this.name && this.tel && this.city.length
    },
    isActiveT () {
      return this.page === 1
    },
    // 是否申请过角色
    isApplied () {
      let arr = Object.keys(this.data)
      return !arr.length ? 0 : 1
    }
  },
  created () {
    // this.viewApply()
    window.album = this.album
    setBack()
    let currentDev = dev()
    if (currentDev === 'Android') {
      let phoneTel = window.android.getNativeInfo()
      let obj = JSON.parse(phoneTel)
      this.tel = obj.account
    } else if (currentDev === 'iOS') {
      invokeNativeMethod('getNativeInfo')
    }
    window.callbackNativeInfo = this.callbackNativeInfo
  },
  methods: {
    headerBack () {
      if (this.page) {
        this.showSteptwo = false
        this.showStepone = true
        this.page = 0
        return
      }
      this.$refs.confirmPop.show()
    },
    // 取消关闭弹窗
    cancel () {
      this.$refs.confirmPop.hide()
    },
    // 确定离开页面
    confirm () {
      closeWebview()
    },
    // 选择城市弹窗
    showPopup () {
      this.$refs.showPopup.showPopup()
    },
    choosedCity (payload, cityArr) {
      this.city = payload
      this.serviceCitys = cityArr.replace(/ /g, '-')
    },
    album (imgUrl, index) {
      if (index === '1') {
        this.company_img = imgUrl
      } else if (index === '2') {
        // let length = this.brandAccreditBook.length
        // if (length < 3) {
        //   this.brandAccreditBook.push(imgUrl)
        // } else {
        //   this.brandAccreditBook.splice(this.selectedIndex, 1, imgUrl)
        // }
        this.brand_abImage = imgUrl
      } else if (index === '3') {
        this.id_front = imgUrl
      } else {
        this.id_back = imgUrl
      }
    },
    upLoad (index, selectedIndex) {
      this.selectedIndex = selectedIndex
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic(index)
        return false
      }
      if (currentDev === 'iOS') {
        getPic('selectPic', index).then((val) => {
          let [i, url] = val
          if (i === '1') {
            this.company_img = url
          } else if (i === '2') {
            this.brand_abImage = url
          } else if (i === '3') {
            this.id_front = url
          } else {
            this.id_back = url
          }
        })
      }
    },
    removePic (picture, i) {
      if (picture === 1) {
        this.company_img = ''
        return
      }
      if (picture === 2) {
        this.brand_abImage = ''
        return
      }
      if (picture === 3) {
        this.id_front = ''
        return
      }
      if (picture === 4) {
        this.id_back = ''
      }
    },
    // 验证邀请码
    valiCode () {
      let url = 'apply/testCode'
      let params = {
        code: this.inviteCode
      }
      this.$http(url, params).then(res => {
        if (res.code === this.$ok) {
          if (!this.isActive) return
          let regName = /^[0-9-A-z\u4e00-\u9fa5]{2,10}$/
          let regNameRes = regName.test(this.name)
          let regTel = /^1[3,4,5,6,7,8,9]\d{9}$/
          let regTelRes = regTel.test(this.tel)
          let cityLength = this.city.length
          if (!this.name.trim()) {
            this.$t('名称不能为空')
            return false
          }
          if (!regNameRes) {
            this.$t('联系人为2-10个字')
            return false
          }
          if (!this.tel) {
            this.$t('手机号不能为空')
            return false
          }
          if (!regTelRes) {
            this.$t('手机号码错误')
            return false
          }
          if (cityLength <= 1) {
            this.$t('请选择服务城市')
            return false
          }
          this.showSteptwo = true
          this.showStepone = false
          this.page = 1
        } else if (res.code === 600) {
          this.$t('您输入的邀请码错误')
          return false
        } else if (res.code === 400) {
          this.$t('您输入的邀请码错误')
          return false
        }
      })
    },
    // 点击下一步
    submit () {
      if (this.page === 0) {
        // let regCode = /^[0-9]*[1-9][0-9]*$/
        // let codeStyle = regCode.test(this.inviteCode)
        if (this.inviteCode) {
          if (this.isActive) {
            this.valiCode()
          } else {
            return false
          }
        } else {
          if (!this.isActive) return
          let regName = /^[0-9-A-z\u4e00-\u9fa5]{2,10}$/
          let regNameRes = regName.test(this.name)
          let regTel = /^1[3,4,5,6,7,8,9]\d{9}$/
          let regTelRes = regTel.test(this.tel)
          let cityLength = this.city.length
          if (!this.name.trim()) {
            this.$t('名称不能为空')
            return false
          }
          if (!regNameRes) {
            this.$t('联系人为2-10个字')
            return false
          }
          if (!this.tel) {
            this.$t('手机号不能为空')
            return false
          }
          if (!regTelRes) {
            this.$t('手机号码错误')
            return false
          }
          if (cityLength <= 1) {
            this.$t('请选择服务城市')
            return false
          }
          this.showSteptwo = true
          this.showStepone = false
          this.page = 1
        }
        // this.showSteptwo = true
        // this.showStepone = false
        // this.page = 1
      } else if (this.page === 1) {
        //
      }
      // if (!this.company_img) {
      //   this.$vux.toast.text('营业执照不能为空', 'middle')
      //   return false
      // }
      // if (!this.brandAccreditBook.length) {
      //   this.$vux.toast.text('品牌授权书不能为空', 'middle')
      //   return false
      // }
      // if (!this.id_front || !this.id_back) {
      //   this.$vux.toast.text('身份证信息不完整', 'middle')
      //   return false
      // }
      // this.sendData()
    },
    // 审核极速开店
    submitBtn (type) {
      if (!this.id_front || !this.id_back) {
        this.$t('身份证信息不完整')
        return false
      }
      if (!this.company_img) {
        this.$t('营业执照不能为空')
        return false
      }
      if (!this.brand_abImage) {
        this.$t('品牌授权书不能为空')
        return false
      }
      // 审核开店
      if (type === 1) {
        this.shopStatus = 1
        this.sendData(type)
      } else { // 极速开店
        this.shopStatus = 2
        this.sendData(type)
      }
    },
    sendData (type) {
      let URL = 'apply/applySeller'
      let data = {
        mobile: this.tel,
        contact: this.name,
        opAddress: this.city.join(),
        license: this.company_img,
        idImage: this.id_front,
        idImage1: this.id_back,
        grant: this.brand_abImage,
        edit: this.isApplied,
        sellerCode: this.inviteCode,
        shopStatus: this.shopStatus
      }
      this.$http(URL, data).then(res => {
        console.log(res)
        if (res.code === this.$ok) {
          this.$t('提交成功')
          if (type === 1) {
            this.$router.push({path: '/shop-auditing'})
          } else if (type === 2) {
            this.$router.push({ path: '/topspeed-set-shop', query: {tel: this.tel} })
          }
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    viewApply () {
      let url = 'apply/viewApplySeller'
      loadDataPost(url).then((res) => {
        if (res.code === STATUS_OK) {
          this.data = res.data
          this.name = res.data.contact || ''
          this.tel = res.data.mobile || ''
          this.id_front = res.data.id_card || ''
          this.id_back = res.data.id_card1 || ''
          this.company_img = res.data.license || ''
          this.brand_abImage = res.data.grant || ''
          if (res.data.op_province === undefined || res.data.op_city === undefined || res.data.op_area === undefined) {
            this.city = []
          } else {
            this.city = [String(res.data.op_province), String(res.data.op_city), String(res.data.op_area)]
          }
          this.serviceCitys = id2Name(this.city, areaAddress).replace(/ /g, '-')
        }
      })
    },
    // 查看声明
    lookStatement (type) {
      if (type === 1) {
        this.$router.push({ path: '/shop-apply/apply-detail' })
      } else {
        this.$router.push({ path: '/shop-apply/topspeed-detail' })
      }
    },
    goHome () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.finish()
        return false
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeClose.postMessage('')
      }
    },
    justifyBodyHeight () {
      let height = this.$refs.button.$el.clientHeight
      document.body.style.height = (window.screen.availHeight - height) + 'px'
    },
    restoreBodyHeight () {
      document.body.style.height = '100%'
    },
    callbackNativeInfo (data) {
      let obj = JSON.parse(data)
      this.tel = obj.account
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'ShopAuditing') {
      this.$del(to, from, next, this, true)
    }
    next()
  },
  components: {
    BaseServiceCity,
    Scroll,
    Popup
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.apply-container
  position relative
  overflow hidden
  height 100%
  background $color-white
  flex-col()
.apply-container-wrapper
  .wrapper
    flex 1
    width 100%
    overflow hidden
    display flex
    flex-direction column
    background #f4f4f4
    f14()
    .apply-up
      // height 380px
      background #fff
      .step-bar
        height 158px
        position relative
        flex-center()
        span:nth-child(1)
          background url('images/icon-first-step.png') no-repeat center
          width 294px
          height 54px
          background-size 100% 100%
          display inline-block
        span:nth-child(2)
          width 270px
          height 54px
          background-size 100% 100%
          display inline-block
        .noActive
          background url('images/icon-editing.png') no-repeat center
        .activeT
          background url('images/icon-second-step.png') no-repeat center
        span:nth-child(3)
          position absolute
          left 125px
          color #fff
          b
            color #F8E71C
        span:nth-child(4)
          position absolute
          left 420px
          color #737373
          &.complete
            color #FFF
          b
            color #737373
            &.completeT
              color #F8E71C
      .invite-code
        text-align center
        p:nth-child(1)
          f16()
          color $color-orange
          text-align center
        input
          bd-b(#ccc, width = 1px)
          margin-top 40px
          padding 8px 0
          text-align center
          border-top-width 0px
          border-right-width 0px
          border-left-width 0px
          width 340px
        p:nth-child(3)
          font-family PingFangSC-Regular
          f12()
          color #CCC
          text-align center
          padding 33px 0 20px
    // .bg-gray
    //   width 100%
    //   height 20px
    //   background #F4F4F4
    .special-content-all
      width 100%
      height 100%
      background #fff
      margin-top 20px
    .step-content
      width 692px
      margin 0 auto
      .step-all
        margin-top 40px
        .step-one
          margin 32px 0 32px
          >div
            font-family 'PingFangSC-Regular'
            f14()
            color #151515
            margin-top 14px
            span
              color #FF0000
          .form
            position relative
            margin-top 20px
            input
              width 692px
              height 88px
              padding-left 20px
              bd(#CCCCCC, width = 1px)
            img
              position absolute
              top 50%
              right 50px
              width 14px
              height 24px
              overflow auto
              transform translateY(-50%)
      // 步骤二
      .step-all-two
        margin-top 50px
        .step-two-des
          padding-left 20px
          color #151515
          line-height 30px
          span
            color $color-orange
          p:nth-child(2)
            color #ccc
            f12()
        .brand
          padding-left 60px
        .apply-pic
          display flex
          .photo
            width 300px
            height 200px
            margin-right 38px
            position relative
            margin 20px 54px 0 20px
            &.id-front
              background url('images/正面@2x.png') no-repeat center
              background-size 100% 100%
            &.id-back
              background url('images/反面@2x.png') no-repeat center
              background-size 100% 100%
            &.no
            img
              display block
              width 300px
              height 200px
            i
              position absolute
              width 30px
              height 30px
              right -15px
              top -15px
              border-radius 50%
              overflow hidden
              background url('images/close2.png') no-repeat center
              background-size 100%
          .photo-licence
            background url('images/营业执照@2x.png') no-repeat center
            background-size 100% 100%
          .photo-brand
            background url('images/icon-auth.png') no-repeat center
            background-size 100% 100%
        .step-two-des-down
          margin-top 62px
        .step-two-des-down:nth-child(4)
          .step-two-des
            padding-left 80px
        .apply-pic-down
          img
            display block
            width 300px
            height 200px
            margin 20px 0 0 18px
.button
  height 88px
  line-height 88px
  text-align center
  background  $color-bc
  &.active
    background-image linear-gradient(-269deg, #FFBF00 0%, #FF8A00 100%)
    box-shadow 0 2px 6px 0 rgba(255,138,0,0.14)
  span
    color $color-white
    f16()
// 第二页btn
.buttonTwo
    width 100%
    height 88px
    line-height 88px
    text-align center
    // background #000
    f16()
    color $color-white
    .keep-saveBtn
      width 50%
      background-image linear-gradient(-269deg, #FFBF00 0%, #FF8A00 100%)
      box-shadow 0 2px 6px 0 rgba(255,138,0,0.14)
      float left
      position relative
      span:nth-child(1)
        background url('images/icon-detailsOne.png') no-repeat center top
        background-size 100% 100%
        width 46px
        height 40px
        display block
        position absolute
        top 50%
        transform translateY(-50%)
        left 40px
      span:nth-child(2)
        // margin-left 50px
      span:nth-child(3)
        background url('images/icon-statement-left.png') center top
        width 44px
        height 44px
        display block
        position absolute
        top 50%
        transform translateY(-50%)
        right 20px
        background-size 100% 100%
    .keep-saveBtnT
      width 50%
      float right
      background-image linear-gradient(-269deg, #FF7200 4%, #FC3167 98%)
      box-shadow 0 2px 6px 0 rgba(255,138,0,0.14)
      position relative
      span:nth-child(1)
        background url('images/icon-detailsTwo.png') center top
        background-size 100% 100%
        position absolute
        width 46px
        height 42px
        display block
        top 50%
        transform translateY(-50%)
        left 40px
      span:nth-child(2)
        // margin-left 50px
      span:nth-child(3)
        background url('images/icon-statement.png') center top
        width 44px
        height 44px
        display block
        position absolute
        top 50%
        transform translateY(-50%)
        right 20px
        background-size 100% 100%
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
