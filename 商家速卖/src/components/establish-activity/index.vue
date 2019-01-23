<template>
  <div class="establish-activity-container">
    <div class="establish-activity-content" ref="container">
      <base-scroll class="activity-scroll-wrapper">
        <div>
          <div id="banner" ref="banner" class="establish-activity-banner" @click="uploadBannerImg">
            <img :src="bannerSrc" alt="">
            <div class="banner-icons" v-show="isBanner">
              <span class="edite-icon" @click.stop="uploadBannerImg"></span>
              <span class="delete-icon" @click.stop="clearBannerImg"></span>
            </div>
            <div class="activit-expire">
              <span v-show="false">已结束</span>
              <span class="bg-9" v-show="false">已下架</span>
            </div>
          </div>
          <!-- 活动主题 -->
          <div class="form-group bd-b">
            <label for="theme">
              <span>主题：</span>
              <input id="theme" type="text" placeholder="活动主题" class="flex-1" @blur="restoreBodyHeight" maxlength="25" :value='activityTheme' @input="inputActivityTheme($event.target.value)">
            </label>
          </div>
          <!-- 开始-结束时间 -->
          <div class="form-group bd-b flex-f">
            <label class="min-width">
              <span class="">时间：</span>
                <group class="time-begin">
                  <datetime
                    :inline-desc="showedStartTime"
                    v-model="startTime"
                    :format="format"
                    placeholder="开始时间"
                    :start-date='startDate'
                    @on-change="modifyStartTime">
                  </datetime>
                </group>
            </label>
            <label class="">
              <span class="">至</span>
                <group class="time-end">
                  <datetime
                    :inline-desc="showedEndTime"
                    v-model="endTime"
                    :format="format"
                    placeholder="结束时间"
                    :start-date='startDate'
                    @on-change="modifyEndTime">
                  </datetime>
                </group>
            </label>
          </div>
          <!-- 地址 -->
          <div class="form-group bd-b flex-f">
            <label>
              <span>地址：</span>
            </label>
            <div class="address">
              <group>
                <x-address value-text-align="right" title="" :list='cityList' v-model="city" placeholder='请选择'></x-address>
              </group>
              <span class="arrow"></span>
            </div>
          </div>
          <!-- 街道地址 -->
          <div class="form-group bd-b">
            <label for="street" class="street">
                <textarea
                  id="street"
                  type="text"
                  placeholder="请填写街道地址"
                  class="flex-1"
                  maxlength="50"
                  :value="streetInfo"
                  @input="inputStreetInfo($event.target.value)"
                  @focus="justifyBodyHeight"
                  @blur="restoreBodyHeight">
                </textarea>
            </label>
          </div>
          <!-- 费用 -->
          <div class="form-group bd-b">
            <label for="cost">
              <span>费用（选填）：</span>
              <input
                id="cost"
                type="number"
                placeholder="0.00"
                class="tr flex-1"
                :value="activityCost"
                @input="inputActivityCost($event.target.value)"
                @focus="justifyBodyHeight"
                @blur="finishInputCost">
            </label>
          </div>
          <!-- 参与品牌 -->
          <div class="form-group bd-b">
            <div class="edit-brand">
              <span class="margin-0">参与品牌（选填）：</span>
              <div class="brand-list" v-for="(img, index) in brandList">
                <img :src="img" alt="" @click="deleteCurrentBrand(index)">
                <span @click="deleteCurrentBrand(index)"></span>
              </div>
              <span class="add-brand" v-show="fullBrandList" @click="addBrandItem"></span>
              <span class="brand-size margin-0" v-show="noBrand">50px*50px</span>
            </div>
          </div>
          <!-- 活动详情 -->
          <div class="form-group">
            <label>
              <span>活动详情：</span>
            </label>
            <div class="add-activity-detail" @click="addActivityDetail" v-show="!activityContent"></div>
            <div class="activity-detail" v-html="activityContent" @click="addActivityDetail">
              <!--  -->
            </div>
          </div>
        </div>
      </base-scroll>
    </div>
    <div ref="button" class="establish-activity-footer" :class="{ 'm-34': $isX }">
      <div class="save-activity" @click="submitActivity">立即发布</div>
    </div>
  </div>
</template>

<script>
import BaseScroll from 'base/scroll/scroll'
import { Group, Datetime, XAddress } from 'vux'
import cityList from 'data/areaAddress.json'
import { formatDateOne, initTime } from 'commons'
import { dev, getPic, _postMessage } from 'common/js/dev'
import { invokeNativeMethod, invokeNativeMethod2 } from 'api/navtive'
// 校验金额，最多有两位小数
// const regCost = new RegExp(/^([0-9]*)+(.[0-9]{1,2})?$/)
const regCost = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)
const bannerPath = require('./images/add-banner.png')
export default {
  data () {
    return {
      // bannerSrc: 'https://goss.veer.com/creative/vcg/veer/800water/veer-139492002.jpg',
      bannerSrc: '',
      activityTheme: '',
      format: 'YYYY-MM-DD HH:mm',
      startDate: formatDateOne(),
      startTime: '',
      showedStartTime: '',
      endTime: '',
      showedEndTime: '',
      cityList,
      city: [],
      streetInfo: '',
      activityCost: '',
      activityContent: '',
      // brandList: [
      //   'https://bpic.588ku.com/original_pic/18/07/05/f0d07bc55cb8ded9f8d3de60234a9386.jpg!/fw/260/quality/90/unsharp/true/compress/true',
      //   'https://bpic.588ku.com/original_pic/18/06/12/02aaf8d733759bf5b973e1d4f9367001.jpg!/fw/260/quality/90/unsharp/true/compress/true',
      //   'https://bpic.588ku.com/original_pic/18/07/14/3bc9cae7dfd3bd0469420725f65cdb6c.jpg!/fw/260/quality/90/unsharp/true/compress/true'],
      brandList: [],
      isNeedSave: 1
    }
  },
  computed: {
    isBanner () {
      return !!this.bannerSrc && true
    },
    defaultBanner () {
      return require('./images/add-banner.png')
    },
    brandListLength () {
      return this.brandList.length
    },
    noBrand () {
      return this.brandListLength === 0
    },
    fullBrandList () {
      return this.brandListLength < 16
    }
  },
  created() {
    this.returnAndroidSavedContent()
    window.album = this.getAndoriadBannerImg
    window.returnGoodsDetail = this.getActivityDetail
    window.returnGoodsUrl = this.getBannerList
    window.returnIOSSavedContent = this.returnIOSSavedContent
  },
  methods: {
    // android 返回即时保存的内容
    returnAndroidSavedContent () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          let data = window.android.returnActiveData()
          this.parseSavedData(data)
          return
        }
        if (currentDev === 'iOS') {
          _postMessage('', 'returnActiveData')
        }
      } catch (error) {
        //
      }
    },
    // iOS 返回即时保存的内容
    returnIOSSavedContent (data) {
      this.parseSavedData(data)
    },
    getAndoriadBannerImg (imgUrl) {
      this.bannerSrc = imgUrl
    },
    uploadBannerImg () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic()
        return false
      }
      if (currentDev === 'iOS') {
        getPic('selectPic', '').then((val) => {
          let [imgUrl] = val
          this.bannerSrc = imgUrl
        })
      }
    },
    clearBannerImg () {
      // 强迫浏览器重排，修复 iOS 清空 banner 图后视图不更新的问题
      let banner = this.$refs.banner
      banner.style.background = `#FFF6EC url(${bannerPath}) center no-repeat`
      banner.style.backgroundSize = `2.24rem 1.306667rem`
      this.bannerSrc = ''
    },
    inputActivityTheme (value) {
      let valLength = value.length
      if (valLength >= 25) {
        this.$vux.toast.text('最多可输入25个字符', 'middle')
      }
      this.activityTheme = value
    },
    modifyStartTime (startTime) {
      this.showedStartTime = startTime.substring(5)
    },
    modifyEndTime (endTime) {
      this.showedEndTime = endTime.substring(5)
    },
    inputStreetInfo (value) {
      let valLength = value.length
      if (valLength >= 50) {
        this.$vux.toast.text('最多可输入50个字符', 'middle')
      }
      this.streetInfo = value
    },
    inputActivityCost (value) {
      this.activityCost = value
    },
    finishInputCost () {
      // document.body.style.height = '100%'
      window.scroll(0, 0)
      if (!this.activityCost) return
      if (!regCost.test(this.activityCost) || parseFloat(this.activityCost) - 10000 > 0) {
        this.$vux.toast.text('费用不超过10000元，小数点后最多输入2位', 'middle')
        return
      }
      let [init, zero] = this.activityCost.split('.')
      if (zero === undefined) {
        this.activityCost = `${init}.00`
        return
      }
      if (zero.length <= 1) {
        this.activityCost = `${init}.${zero}0`
        return
      }
      this.activityCost = `${init}.${zero}`
    },
    addBrandItem () {
      let brandListLength = 16 - this.brandListLength
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.addPhotos(brandListLength, JSON.stringify(this.brandList))
          return
        }
        if (currentDev === 'iOS') {
          let obj = {
            index: brandListLength,
            imgUrl: this.brandList
          }
          window.webkit.messageHandlers.addPhotos.postMessage(obj)
        }
      } catch (e) {
        //
      }
    },
    getBannerList (list) {
      this.brandList = list
    },
    deleteCurrentBrand (index) {
      this.brandList.splice(index, 1)
    },
    addActivityDetail () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        invokeNativeMethod2('goodsDetail', this.activityContent, 0, 2)
        return
      }
      if (currentDev === 'iOS') {
        invokeNativeMethod('goodsDetail', {
          content: this.activityContent,
          isEditeInPc: 0,
          type: 2
        })
      }
    },
    getActivityDetail (content) {
      this.activityContent = content
    },
    submitActivity () {
      let isPassChecked = this.checkFieldValidity()
      if (!isPassChecked) return
      let [province, city, area] = this.city
      let cost = !this.activityCost ? 0 : this.activityCost
      let brandImg = !this.brandListLength ? [] : JSON.stringify(this.brandList)
      let url = 'UnionAct/createAct'
      let obj = {
        image_path: this.bannerSrc,
        title: this.activityTheme.trim(),
        start_at: this.startTime,
        end_at: this.endTime,
        province,
        city,
        area,
        address: this.streetInfo.trim(),
        cost,
        brandImg,
        description: this.activityContent,
        act_status: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.isNeedSave = 0
          invokeNativeMethod('saveActiveData', '')
          this.$vux.toast.text('发布成功，该活动已展示在采购师APP端', 'middle')
          this.$router.push({ path: '/activity-list', query: { fromNative: 1 } })
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    checkFieldValidity () {
      if (!this.bannerSrc) {
        this.$vux.toast.text('请上传商品图片', 'middle')
        return false
      }
      if (!this.activityTheme.trim()) {
        this.$vux.toast.text('请填写主题', 'middle')
        return false
      }
      if (!this.startTime) {
        this.$vux.toast.text('请设置开始时间', 'middle')
        return false
      }
      if (initTime(this.startTime) < initTime()) {
        this.$vux.toast.text('开始时间不可小于当前时间', 'middle')
        return false
      }
      if (!this.endTime) {
        this.$vux.toast.text('请设置结束时间', 'middle')
        return false
      }
      if (initTime(this.startTime) > initTime(this.endTime)) {
        this.$vux.toast.text('结束时间不可小于开始时间', 'middle')
        return false
      }
      if (!this.cityList.length) {
        this.$vux.toast.text('请选择地址', 'middle')
        return false
      }
      if (!this.streetInfo.trim()) {
        this.$vux.toast.text('请填写地址', 'middle')
        return false
      }
      if (this.activityCost) {
        if (!regCost.test(this.activityCost)) {
          this.$vux.toast.text('请填写正确的费用格式', 'middle')
          return false
        }
      }
      if (!this.activityContent.trim()) {
        this.$vux.toast.text('请填写活动详情', 'middle')
        return false
      }
      return true
    },
    parseSavedData (data) {
      if (!data) return
      data = JSON.parse(data)
      let { bannerSrc, activityTheme, startTime, showedStartTime, endTime, showedEndTime, city, streetInfo, activityCost, activityContent, brandList } = data
      this.bannerSrc = bannerSrc
      this.activityTheme = activityTheme
      this.startTime = startTime
      this.showedStartTime = showedStartTime
      this.endTime = endTime
      this.showedEndTime = showedEndTime
      this.city = city
      this.streetInfo = streetInfo
      this.activityCost = activityCost
      this.activityContent = activityContent
      this.brandList = brandList
    },
    restoreBodyHeight () {
      window.scroll(0, 0)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isNeedSave) {
      let establishActivity = Object.create(null)
      establishActivity.bannerSrc = this.bannerSrc
      establishActivity.activityTheme = this.activityTheme
      establishActivity.startTime = this.startTime
      establishActivity.showedStartTime = this.showedStartTime
      establishActivity.endTime = this.endTime
      establishActivity.showedEndTime = this.showedEndTime
      establishActivity.city = this.city
      establishActivity.streetInfo = this.streetInfo
      establishActivity.activityCost = this.activityCost
      establishActivity.activityContent = this.activityContent
      establishActivity.brandList = this.brandList
      invokeNativeMethod('saveActiveData', JSON.stringify(establishActivity))
    }
    next()
  },
  components: {
    BaseScroll,
    Group,
    Datetime,
    XAddress
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
@import "~common/stylus/vux"
.establish-activity-container
  flex-col()
  height 100%
  background $color-white
  overflow hidden
  .establish-activity-content
    flex 1
    overflow hidden
    .activity-scroll-wrapper
      padding 0 30px
      height 100%
    .establish-activity-banner
      margin 0 -30px
      height 350px
      background #FFF6EC url('./images/add-banner.png') center no-repeat
      background-size 168px 98px
      position relative
      img
        wh(100%)
      .banner-icons
        position absolute
        flex-align-item()
        bottom 12px
        right 30px
        span
          wh(48px)
        .edite-icon
          bg('edite.png')
          margin-right 12px
        .delete-icon
          bg('close-banner.png')
      .activit-expire
        span
          display block
          f12()
          height 42px
          line-height 42px
          font-weight 700
          padding 0 22px
          color $color-white
          position absolute
          top 20px
          right 0
          background #BA9870
          border-radius(100px 0 0 100px)    
    .form-group
      f14()
      color $color-6
      label
        height 100px
        flex-f()
        align-items center
        &.street
          min-height 100px
        >span
          margin-right 40px
        .time-begin,
        .time-end
          flex 1
        .weui-cells
          span.vux-label-desc
            f14()
            color $color-3
          .weui-cell__ft
            padding-right 13px;/*no*/
          span.vux-cell-value
            display none
            f14()
            color $color-3
        #street
          margin-left 120px
        input
          color $color-3
          wb()
      .edit-brand
        flex-f()
        align-items center
        position relative
        flex-wrap wrap
        padding-top 30px
        min-height 100px
        span:nth-child(1)
          min-width 256px
        .add-brand
          wh(32px)
          bg('add-brand.png')
          margin-left 24px
          margin-right 0
        .brand-size
          f12()
          color $color-c
          position absolute
          right 0
          top 60%
          transform translateY(-50%)
        .brand-list
          width 100px
          height 60px
          margin-right 8px
          margin-bottom 30px
          position relative
          img
            wh(100%)
          span
            wh(14px)
            position absolute
            right 0
            top 0
            bg('close-brand.png')
        .brand-list:nth-child(6),
        .brand-list:nth-child(12)
          margin-left 42px
      .add-activity-detail
        height 200px
        background url('./images/add-activity.png') center no-repeat
        background-size 168px 98px
      .activity-detail
        // height 400px
        img
          width 100%
          height 400px
        //
      .address
        position relative
        flex 1
        padding-right 30px
        .arrow
          &:after
            content :''
            position: absolute
            right 0
            top 50%
            transform translateY(-50%)
            width: 14px;/*px*/
            height: 24px;/*px*/
            bg('./arrow.png')
        .weui-cells
          height 100px
          line-height 100px
          f14()
          color: $color-c
          span.vux-popup-picker-value
            f14()
            color $color-3
  .establish-activity-footer
    flex-f()
    line-height 100px
    f16()
    tc()
    .save-activity
      flex 1
      height 100px
      background $color-orange
      color $color-white
  .tr
    tr()
  .flex-f
    flex-f()
  .flex-1
    flex 1
  .bd-b
    bd-b($color-f4)
  .margin-0
    margin-right 0!important
  .min-width
    min-width 270px
</style>
