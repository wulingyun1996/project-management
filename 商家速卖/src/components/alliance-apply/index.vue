
<template>
  <div class="apply-container">
    <div class="apply-container-wrapper">
      <base-header :intercept-back="true" @headerBack="headerBack"></base-header>
      <div class="wrapper">
        <!-- 步骤条 -->
        <div class="step-bar-all">
          <div class="step-bar">
            <span></span>
            <span :class="{ active: isActive }"></span>
            <span :class="{ active: isActive }"></span>
            <span :class="{ active: allActive, activetwo: activetwo  }"></span>
            <span></span>
          </div>
          <div class="step-des">
            <i>基本信息</i>
            <i :class="{complete : isComplete , nocomPlete : isnoComplete}">证件信息</i>
          </div>
        </div>
        <!-- 步骤一 -->
        <div class="step-all" v-if="showStepone">
          <div class="step-one">
            <div><span>*</span> 联系人</div>
            <div class="form"><input type="text" placeholder="请输入姓名" v-model="name" maxlength="10"></div>
          </div>
          <div class="step-one">
            <div><span>*</span> 手机号码</div>
            <div class="form"><input type="text" placeholder="用于客服人员与您联系" v-model.trim="tel" maxlength="11"/></div>
          </div>
          <div class="step-one" @click="showPopup">
            <div><span>*</span> 服务城市</div>
            <div class="form">
              <input type="text" placeholder="圈子/活动仅在该城市展示，提交后不可修改" v-model="serviceCitys" readonly/>
              <img class="arrow" src="./arrow.png" alt="">
            </div>
          </div>
          <div class="step-one">
            <div><span>*</span>参与品牌</div>
            <div class="form">
              <textarea id="brand"
                placeholder="品牌与品牌之间请用“、”分开"
                v-model="brand"
                maxlength="300"
                @focus="justifyBodyHeight"
                @blur="restoreBodyHeight"></textarea>
              <div class="text-num">
                <span><b>{{ brandLenth }}</b><span class="total-num">/300</span></span>
              </div>
            </div>
          </div>
          <div class="step-one">
            <div><span>*</span>活动简介</div>
            <div class="form">
              <textarea id="introduction"
                placeholder="请输入活动简介"
                v-model="introduction"
                maxlength="300"
                @focus="justifyBodyHeight"
                @blur="restoreBodyHeight"></textarea>
              <div class="text-num">
                <span><b>{{ intructionLength }}</b><span class="total-num">/300</span></span>
              </div>
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
            <div class="photo" :class="{no: id_front, 'id-front': !id_front}" @click="upLoad(1)" >
              <img :src="id_front" alt="" v-show="id_front">
              <i v-if="id_front" @click.stop='removePic(1)'></i>
            </div>
            <div class="photo" :class="{no: id_back, 'id-back': !id_back}" @click="upLoad(2)" >
              <img :src="id_back" alt="" v-show="id_back">
              <i v-if="id_back" @click.stop='removePic(2)'></i>
            </div>
          </div>
          <div class="step-two-des-down clearfix">
            <div class="step-two-des">
              <p><span>* </span>营业执照</p>
              <p>（大小不超过5M）</p>
            </div>
          </div>
          <div class="apply-pic">
            <div class="photo photo-licence" :class="{no: company_img}" @click="upLoad(3)">
              <img :src="company_img" alt="" v-show="company_img">
              <i v-if="company_img" @click.stop='removePic(3)'></i>
            </div>
          </div>
        </div>
      </div>`
      <div class="button" :class="{ active: isActive }" @click="submit" ref="button">
        <span>{{this.page === 1 ? '点击提交，完成审核就可赚钱咯~':'点击下一步，就快完成啦~'}}</span>
      </div>
    </div>
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
    <!-- <popup @backHome='goHome' ref="popup"></popup> -->
    <!-- 提交成功弹框 -->
    <base-senior-popup ref="popup" height="auto" class="sucessPop" :stop="stop">
      <div>
        <img src="./成功@2x.png" alt="">
        <p>提交成功</p>
        <p>感谢您提交的商圈申请，我们会在<span>1个工作日</span>内受理，请您耐心等待</p>
      </div>
      <img @click='goHome' class="close-btn" src="./close.png" alt="">
    </base-senior-popup> 
    <base-service-city @choosedCity="choosedCity" ref="showPopup"></base-service-city>
  </div>
</template>

<script>
import { closeWebview } from 'navtive'
import areaAddress from 'data/areaAddress'
import Scroll from 'base/scroll/scroll'
import { dev, getPic, invokeNativeMethod } from 'common/js/dev'
import { loadData, STATUS_OK } from 'api/common'
import { setBack } from 'api/navtive'
import Popup from 'base/pop/popup'
import BaseServiceCity from 'base/address/service-city'
import { id2Name } from 'base/address/service'
export default {
  name: 'alianceApply',
  data () {
    return {
      stop: false,
      city: [],
      name: '',
      tel: '',
      brand: '',
      introduction: '',
      flag: true,
      // id_front: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg',
      id_front: '',
      id_back: '',
      // id_back: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg',
      company_img: '',
      // company_img: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg',
      data: {},
      serviceCitys: '',
      showSteptwo: false, // 步骤二
      showStepone: true, // 步骤一
      page: 0, // 当前页
      isComplete: false, // 步骤字体
      isnoComplete: true
    }
  },
  computed: {
    isActive () {
      return this.name && this.tel && this.brand && this.introduction && this.city.length
    },
    allActive () {
      return this.page === 1 && this.isActive && this.id_front && this.id_back && this.company_img
    },
    activetwo () {
      return this.page === 1 && this.isActive
    },
    brandLenth () {
      return this.brand.replace(/\n|\r/g, '  ').length
    },
    intructionLength () {
      return this.introduction.replace(/\n|\r/g, '  ').length
    },
    // 是否申请过角色
    isApplied () {
      let arr = Object.keys(this.data)
      return !arr.length ? 0 : 1
    }
  },
  created () {
    this.viewApply()
    window.album = this.album
    setBack()
    // invokeNativeMethod('getNativeInfo')
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
    // 返回第一个步骤
    headerBack () {
      if (this.page === 1) {
        this.showSteptwo = false
        this.showStepone = true
        this.page = 0
      } else if (this.page === 0) {
        this.$refs.confirmPop.show()
      }
    },
    // 取消关闭弹窗
    cancel () {
      this.$refs.confirmPop.hide()
      this.$refs.popup.hide()
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
    album(imgUrl, index) {
      if (index === '1') {
        this.id_front = imgUrl
      } else if (index === '2') {
        this.id_back = imgUrl
      } else {
        this.company_img = imgUrl
      }
    },
    upLoad (index) {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic(index)
        return false
      }
      if (currentDev === 'iOS') {
        getPic('selectPic', index).then((val) => {
          let [i, url] = val
          if (i === '1') {
            this.id_front = url
          } else if (i === '2') {
            this.id_back = url
          } else {
            this.company_img = url
          }
        })
      }
    },
    removePic (index) {
      if (index === 1) {
        this.id_front = ''
      } else if (index === 2) {
        this.id_back = ''
      } else {
        this.company_img = ''
      }
    },
    submit () {
      console.log(this.page)
      if (this.page === 0) {
        if (!this.isActive) return
        let regName = /^[0-9-A-z\u4e00-\u9fa5]{2,10}$/
        let regNameRes = regName.test(this.name)
        let regTel = /^1[3,4,5,6,7,8,9]\d{9}$/
        let regTelRes = regTel.test(this.tel)
        let cityLength = this.city.length
        let regBrand = /^[0-9-A-z\u4e00-\u9fa5]+(、[0-9-A-z\u4e00-\u9fa5]+)*$/
        let regBrandRes = regBrand.test(this.brand)
        if (!this.name.trim()) {
          this.$vux.toast.text('名称不能为空', 'middle')
          return false
        }
        if (!regNameRes) {
          this.$vux.toast.text('联系人为2-10个字', 'middle')
          return false
        }
        if (!this.tel) {
          this.$vux.toast.text('手机号不能为空', 'middle')
          return false
        }
        if (!regTelRes) {
          this.$vux.toast.text('手机号码错误', 'middle')
          return false
        }
        if (cityLength <= 1) {
          this.$vux.toast.text('请选择服务城市', 'middle')
          return false
        }
        if (!this.brand.trim()) {
          this.$vux.toast.text('联盟品牌不能为空', 'middle')
          return false
        }
        if (!regBrandRes) {
          this.$vux.toast.text('请勿输入除、外其他符号', 'middle')
          return false
        }
        if (!this.introduction.trim()) {
          this.$vux.toast.text('活动简介不能为空', 'middle')
          return false
        }
        this.showSteptwo = true
        this.showStepone = false
        this.isComplete = true
        this.isnoComplete = false
        this.page = 1
        console.log(this.page)
      } else if (this.page === 1) {
        this.applyAlliance()
      }
    },
    applyAlliance () {
      let url = 'apply/applyUnion'
      let obj = {
        mobile: this.tel,
        contact: this.name,
        idImage: this.id_front,
        idImage1: this.id_back,
        opAddress: this.city.join(),
        brand: this.brand,
        blurb: this.introduction,
        license: this.company_img,
        edit: this.isApplied
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          // 提交成功
          this.$refs.popup.show()
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    viewApply () {
      loadData('apply/viewApplyUnion').then((res) => {
        if (res.code === STATUS_OK) {
          this.data = res.data
          this.name = res.data.contact || ''
          this.tel = res.data.mobile || ''
          this.id_front = res.data.id_card || ''
          this.id_back = res.data.id_card1 || ''
          this.brand = res.data.brand || ''
          this.introduction = res.data.blurb || ''
          this.company_img = res.data.license || ''
          if (res.data.op_province === undefined || res.data.op_city === undefined || res.data.op_area === undefined) {
            this.city = []
          } else {
            this.city = [String(res.data.op_province), String(res.data.op_city), String(res.data.op_area)]
          }
          this.serviceCitys = id2Name(this.city, areaAddress).replace(/ /g, '-')
        }
      })
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
    callbackNativeInfo (data) {
      let obj = JSON.parse(data)
      this.tel = obj.account
    }
  },
  components: {
    BaseServiceCity,
    Scroll,
    Popup
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.apply-container
  position relative
  height 100%
  background $color-white
  .apply-container-wrapper
    display flex
    flex-direction column
    height 100%
    .apply-top
      height 88px
      line-height 88px
      font-family PingFangSC-Regular
      display flex
      bd-b(rgba(0,0,0,0.25), width = 1px)
      f17()
      color #333333
      .apply-arrow
        float left
        display flex
        vertical-align middle
        justify-content center
        align-items center
        width 100%
        img
          display block
          width 24px
          height 44px
          position absolute
          left 48px
      .apply-top-title
        text-align center
    .wrapper
      width 100%
      height 100%
      overflow hidden
      padding-left 24px
      display flex
      flex-direction column
      height 100%
      f14()
      .step-bar-all
        width 100%
        height 145px;/*px*/
        padding-top 20px
        flex-center()
        flex-col()
        .step-bar
          margin-bottom 14px
          flex-center()
          span:nth-child(1)
            background url('./Group2@2x.png') no-repeat center
            width 116px
            height 14px
            background-size 100%
            display inline-block
          span:nth-child(2)
            width 40px
            height 40px
            display inline-block
            margin 10px
            background url('./Group7@2x.png') no-repeat center
            background-size 100% 100%
            &.active
              background url('./Group8@2x.png') no-repeat center
              background-size 100% 100%
          span:nth-child(3)
            width 128px
            height 14px
            display inline-block
            background url('./Group@2x.png') no-repeat center
            background-size 100%
            &.active
              background url('./Group2@2x.png') no-repeat center
              background-size 100%
          span:nth-child(4)
            width 42px
            height 42px
            display inline-block
            margin 10px
            background url('./灰色@2x.png') no-repeat center
            background-size 100% 100%
            &.activetwo
              background url('./Group7@2x.png') no-repeat center
              background-size 100%
            &.active
              background url('./Group8@2x.png') no-repeat center
              background-size 100%
          span:nth-child(5)
            background url('./Line2@2x.png') no-repeat center
            width 122px
            height 2px
            background-size 100%
            display inline-block
            &.active
              background url('./complete@2x.png') no-repeat center
              background-size 100%
        .step-des
          // flex-center()
          i 
            font-style normal
          i:nth-child(1)
            margin-right 80px
            color $color-orange
          .nocomPlete
            color #999
          .complete
            color $color-orange
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
              .total-num
                color $color-orange
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
              transform: translateY(-50%);
            textarea 
              width 692px
              height 146px
              border 1px solid $color-c
              padding-left 20px
            .text-num
              width 100%
              margin-top 14px
              padding-right 34px
              display flex
              font-size 22px
              justify-content flex-end
              color $color-c
              position absolute 
              bottom 10px
              right 10px
                span
                  color #CCC!important
                b
                  color $color-orange!important 
      // 步骤二
      .step-all-two
        margin-top 50px
        .step-two-des
          padding-left 20px
          color #151515
          span
            color $color-orange
          p:nth-child(2)
            color #3F3F3F
        .brand
          padding-left 60px
        .apply-pic
          display flex
          .photo
            width 300px
            height 200px
            margin-right 38px
            background url('./plus2.png') no-repeat center
            position relative
            margin 20px 54px 0 20px
            &.id-front
              background url('./正面@2x.png') no-repeat center
              background-size 100% 100%
            &.id-back
              background url('./反面@2x.png') no-repeat center
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
              background url('./close2.png') no-repeat center
              background-size 100%
          .photo-licence
            background url('./营业执照@2x.png') no-repeat center
            background-size 100% 100%
        .step-two-des-down
          margin-top 62px
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
  .confirmPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      .popdes
        padding 40px 0
        bd-b(#ccc, width = 1px)
        p:nth-child(1)
          font-weight bold
          f16()
        p:nth-child(2)
          margin-top 30px
      .popbtn
        width 100%
        a
          width 50%
          text-align center
          display inline-block
          float left
          bd-r(#ccc, width = 1px)
          padding 30px 0
  .sucessPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      >div
        font-size 30px
        img
          width 178px
          height 80px
          margin 18px 0 3px
        p:nth-child(2)
          color #FF8A00
          margin-top 10px
        p:nth-child(3)
          color #4A4A4A
          margin 46px 0 80px
          width 85%
          padding 0.613333rem 0 1.066667rem
          margin 0 auto
          span
            color red
    .close-btn
      width 56px
      height 56px
      display block
      position absolute
      left 50%
      transform translateX(-50%)
      bottom -112px
</style>
