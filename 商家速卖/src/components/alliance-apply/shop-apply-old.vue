<template>
  <div class="apply-container">
    <div class="apply-container-wrapper">
      <scroll class="wrapper">
        <div class="form">
          <div class="form-group">
            <label for="name">
              <span>*</span>
              联系人
            </label>
            <input id="name" type="text" placeholder="请输入姓名" v-model="name" maxlength="10">
          </div>
          <div class="form-group">
            <label for="number">
              <span>*</span>
              手机号码
            </label>
            <input id="number" type="text" placeholder="用于客服人员与您联系" v-model.trim="tel" maxlength="11"/>
          </div>
          <div class="form-group-addr">
            <label>
              <span>*</span>
              服务城市
            </label>
            <div class="address" @click="showPopup">
              <input id="address" type="text" placeholder="选择商品仅在该城市展示" v-model="serviceCitys" readonly/>
              <span class="arrow"></span>
            </div>
          </div>
          <div class="form-group-pic">
            <label>
              <span>*</span>
              营业执照
            </label>
            <div>
              <span>(大小不超过5M)</span>
            </div>
          </div>
          <div class="apply-pic">
            <div class="photo" :class="{no: company_img}" @click="upLoad(1)">
              <img :src="company_img" alt="" v-show="company_img">
              <i v-if="company_img" @click.stop="removePic(1)"></i>
            </div>
          </div>
          <div class="form-group-pic">
            <label>
               <span>*</span>
              品牌授权书
            </label>
            <div>
              <span>(大小不超过5M)</span>
            </div>
          </div>
          <div class="apply-pic">
            <div class="photo no" v-for="(item, index) in brandAccreditBook" @click="upLoad(2, index)" :key='index'>
              <img :src="item" alt="">
              <i @click.stop="removePic(2, index)"></i>
            </div>
            <div class="photo" @click="upLoad(2)" v-if="brandAccreditBook.length < 3"></div>
          </div>
          <div class="form-group-pic">
            <label>
              <span>*</span>
              身份证照片
            </label>
            <div>
              <span>(大小不超过2M)</span>
            </div>
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
          
        </div>
      </scroll>
    </div>
    <div class="button" :class="{ active: isActive }" @click="submit">
      <span>提交</span>
    </div>
    <popup @backHome='goHome' ref="popup"></popup>
    <base-service-city @choosedCity="choosedCity" ref="showPopup"></base-service-city>
  </div>
</template>

<script>
import areaAddress from 'data/areaAddress'
import Scroll from 'base/scroll/scroll'
import { dev, getPic } from 'common/js/dev'
import { loadData, STATUS_OK } from 'api/common'
import { setBack } from 'api/navtive'
import Popup from 'base/pop/popup'
import BaseServiceCity from 'base/address/service-city'
import { id2Name } from 'base/address/service'
export default {
  data () {
    return {
      name: '',
      tel: '',
      city: [],
      company_img: '',
      brandAccreditBook: [],
      id_front: '',
      id_back: '',
      data: {},
      serviceCitys: '',
      selectedIndex: 0
    }
  },
  computed: {
    isActive () {
      return this.name && this.tel && this.city.length && this.company_img && this.brandAccreditBook.length && this.id_front && this.id_back
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
  },
  methods: {
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
        let length = this.brandAccreditBook.length
        if (length < 3) {
          this.brandAccreditBook.push(imgUrl)
        } else {
          this.brandAccreditBook.splice(this.selectedIndex, 1, imgUrl)
        }
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
            this.brandAccreditBook.push(url)
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
        this.brandAccreditBook.splice(i, 1)
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
    submit () {
      if (!this.isActive) return
      let regName = /^[0-9-A-z\u4e00-\u9fa5]{2,10}$/
      let regNameRes = regName.test(this.name)
      let regTel = /^1[3,4,5,6,7,8,9]\d{9}$/
      let regTelRes = regTel.test(this.tel)
      let cityLength = this.city.length
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
      this.sendData()
    },
    sendData() {
      let URL = '/apply/applySeller'
      let data = {
        mobile: this.tel,
        contact: this.name,
        opAddress: this.city.join(),
        license: this.company_img,
        idImage: this.id_front,
        idImage1: this.id_back,
        grant: this.brandAccreditBook[0],
        grant1: this.brandAccreditBook[1] === undefined ? '' : this.brandAccreditBook[1],
        grant2: this.brandAccreditBook[2] === undefined ? '' : this.brandAccreditBook[2],
        edit: this.isApplied
      }
      loadData(URL, data).then((res) => {
        if (res.code === STATUS_OK) {
          this.$refs.popup.show()
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    viewApply () {
      let url = 'apply/viewApplySeller'
      loadData(url).then((res) => {
        if (res.code === STATUS_OK) {
          this.data = res.data
          this.name = res.data.contact || ''
          this.tel = res.data.mobile || ''
          this.id_front = res.data.id_card || ''
          this.id_back = res.data.id_card1 || ''
          this.company_img = res.data.license || ''
          if (res.data.grant === undefined || res.data.grant1 === undefined || res.data.grant2 === undefined) {
            this.brandAccreditBook = []
          } else {
            let grants = [res.data.grant, res.data.grant1, res.data.grant2]
            grants.forEach((item) => {
              if (item) {
                this.brandAccreditBook.push(item)
              }
            })
          }
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
@import "~common/stylus/variable.styl"
.apply-container
  position relative
  height 100%
  background $color-white
.apply-container-wrapper
  padding-left 24px
  position absolute
  top 0
  left 0
  right 0
  bottom 120px
  .wrapper
    width 100%
    height 100%
    overflow hidden
.form
  padding-top 36px
  .form-group-addr
    display flex
    align-items center
    margin-bottom 30px
    label
      line-height 70px;
      width 146px;
      margin-right 22px
      text-align right
      color #333
      span
        color $color-orange
    .address
      width 540px
      border 1px solid $color-c;/*no*/
      border-radius 4px;/*px*/
      padding-left 20px
      position relative
      .arrow
        &:after
          content :''
          position absolute
          right 14px
          top 50%
          transform translateY(-50%)
          width 14px;/*px*/
          height 24px;/*px*/
          background url(arrow.png) no-repeat  center right
          background-size 100% auto
      input
        width 100%
        height 70px
  .form-group-pic
    display flex
    align-items center
    margin-bottom 30px
    label
      display block
      line-height 70px;
      width 146px;
      margin-right 22px
      text-align right
      color #333
      span
        color $color-orange
    div
      width 540px
      height 70px;
      line-height 70px
      color $color-9
      font-size 24px;/*px*/
  .apply-pic
    margin-left 168px
    display flex
    margin-bottom 36px
    .photo
      width 140px
      height 140px
      border 1px dashed #cfcfcf;/*no*/
      margin-right 38px
      background url('./plus2.png') no-repeat center
      background-size 40px 40px;/*px*/
      position relative
      &.id-front
        background url('./front.png') no-repeat center
        background-size 100% 100%
      &.id-back
        background url('./back.png') no-repeat center
        background-size 100% 100%
      &.no
        background none
        border none
      img
        display block
        width 100%
        height 100%
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
  .form-group
    display flex
    align-items center
    margin-bottom 30px
    &.txt
      align-items flex-start
      margin-bottom 20px
    label
      line-height 70px;
      width 146px;
      margin-right 22px
      text-align right
      color #333
      span
        color $color-orange
    input
      display block
      width 540px
      height 70px;
      border 1px solid $color-c;/*no*/
      padding-left 20px
      border-radius 4px;/*px*/
      color $color-3
      font-size 28px;/*px*/
    #tel
      color $color-3
    .description
      width 540px
      textarea
        width 100%
        height 300px
        padding 26px;
        border 1px solid $color-c;/*no*/
      .txt-num
        width 100%
        height 20px
        line-height 20px
        margin-top 14px
        padding-right 34px
        display flex
        font-size 22px;/*px*/
        justify-content flex-end
        color $color-c
.button
  width 100%
  height 100px;
  line-height 100px;
  position absolute
  left 0
  right 0
  bottom 0
  background : $color-bc
  color #fff
  font-size 36px;/*px*/
  text-align center
  &.active
    background $color-orange
</style>
