<template>
  <div class="establish-activity-container" v-show="isShow">
    <div class="establish-activity-content">
      <base-scroll class="activity-scroll-wrapper">
        <div>
          <div class="establish-activity-banner" @click="uploadBannerImg">
            <img :src="bannerSrc" alt="">
            <div class="banner-icons" v-show="isShowBannerIcon">
              <span class="edite-icon" @click.stop="uploadBannerImg"></span>
              <span class="delete-icon" @click.stop="clearBannerImg"></span>
            </div>
            <div class="activit-expire">
              <span v-show="!isActivityDown && isActivityExpires">已结束</span>
              <span class="bg-9" v-show="isActivityDown">已下架</span>
            </div>
          </div>
          <!-- 活动主题 -->
          <div class="form-group bd-b" v-show="isEditeActivity">
            <label for="theme">
              <span>主题：</span>
              <!-- <input id="theme" type="text" readonly placeholder="活动主题" class="flex-1" maxlength="25" :value='activityTheme' @input="inputActivityTheme($event.target.value)"> -->
              <input id="theme" type="text" disabled placeholder="活动主题" class="flex-1" maxlength="25" :value='activityTheme'>
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
                    :min-year='2018'
                    :readonly='true'></datetime>
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
                    :min-year='2018'
                    :readonly='true'></datetime>
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
                <x-address :disabled='true' value-text-align="right" title="" :list='cityList' v-model="city" placeholder='请选择'></x-address>
              </group>
              <span class="arrow" v-show="false"></span>
            </div>
          </div>
          <!-- 街道地址 -->
          <div class="form-group bd-b">
            <label for="street">
              <!-- <input id="street" type="text" :readonly='isEditeActivity' placeholder="请填写街道地址" class="flex-1" maxlength="50" :value="streetInfo" @input="inputStreetInfo($event.target.value)"> -->
              <input id="street" type="text" disabled placeholder="请填写街道地址" class="flex-1" maxlength="50" :value="streetInfo">
            </label>
          </div>
          <!-- 费用 -->
          <div class="form-group bd-b">
            <label for="cost">
              <span>费用（选填）：</span>
              <!-- <input id="cost" type="text" :readonly='isEditeActivity' placeholder="0.00" class="tr flex-1" :value="activityCost" @input="inputActivityCost($event.target.value)" @blur="finishInputCost"> -->
              <input id="cost" type="text" disabled placeholder="0.00" class="tr flex-1" :value="activityCost">
            </label>
          </div>
          <!-- 参与品牌 -->
          <div class="form-group bd-b">
            <div class="edit-brand">
              <span class="margin-0">参与品牌（选填）：</span>
              <div class="brand-list" v-for="(img, index) in brandList">
                <img :src="img" alt="" v-if="!isEditeActivity">
                <img :src="img" alt="" @click="deleteCurrentBrand(index)" v-if="isEditeActivity">
                <!-- <span @click="deleteCurrentBrand(index)" v-show="isEditeActivity"></span> -->
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
            <div class="add-activity-detail" @click="addActivityDetail" v-show="!activityContent && isEditeActivity"></div>
            <div class="activity-detail" v-html="activityContent" @click="addActivityDetail">
              <!--  -->
            </div>
          </div>
        </div>
      </base-scroll>
    </div>
    <div class="establish-activity-footer" v-show="isEditeActivity">
      <div class="save-activity" @click="submitActivity">立即发布</div>
    </div>
    <div class="activity-cancel-wrapper" v-show="isActivityDown">
      <div class="activity-cancel">
        <h1>该活动已下架！</h1>
        <p class="activity-cancel-reason">
          <span>下架原因：{{ downReason }}</span>
        </p>
        <p class="activity-explain">
          <span>如有疑问请联系平台客服</span>
          <br>
          <span>021-52781888</span>
        </p>
        <div class="activity-button">
          <button @click="goBack">返回上一页</button>
        </div>
      </div>
    </div>
    <!-- <base-pop title="发布成功" ref="popup"></base-pop> -->
  </div>
</template>

<script>
import BaseScroll from 'base/scroll/scroll'
import BasePop from 'base/pop/pop'
import { Group, Datetime, XAddress } from 'vux'
import cityList from 'data/areaAddress.json'
// import { formatDateTwo } from 'commons'
import { dev, getPic } from 'common/js/dev'
import { invokeNativeMethod, invokeNativeMethod2, nativeBackAndJumpTwo, setTitle } from 'navtive'
// const regCost = new RegExp(/^([1-9][0-9]*)+(.[0-9]{1,2})?$/)
const MESSAGE = {
  right: [
    {
      title: '编辑',
      function: 'editeActivity()',
      name: 'editeActivity'
    }
  ]
}
export default {
  data () {
    return {
      isShow: false,
      bannerSrc: '',
      tempBannerSrc: '',
      activityTheme: '',
      format: 'YYYY-MM-DD HH:mm',
      startTime: '',
      showedStartTime: '',
      endTime: '',
      showedEndTime: '',
      cityList,
      city: [],
      streetInfo: '',
      activityCost: '',
      activityContent: '',
      tempActivityContent: '',
      brandList: [],
      tempBrandList: [],
      downReason: ''
      // 活动详情数据
    }
  },
  computed: {
    activityId () {
      return this.$route.query.id
    },
    // 是否下架, 默认下架
    isActivityDown () {
      return this.$route.query.isActivityDown === 1
    },
    // 是否结束
    isActivityExpires () {
      return Number(this.$route.query.isActivityExpires)
    },
    // 是否要编辑
    isEditeActivity () {
      return !!this.$route.query.isEditeActivity
    },
    // 是否展示编辑 banner 的 icon
    isShowBannerIcon () {
      return !!this.bannerSrc && this.isEditeActivity
    },
    brandListLength () {
      return this.brandList.length
    },
    // 是否展示品牌尺寸说明
    noBrand () {
      return this.brandListLength === 0 && this.isEditeActivity
    },
    fullBrandList () {
      return this.brandListLength < 16 && this.isEditeActivity
    }
  },
  created () {
    window.album = this.getAndoriadBannerImg
    window.returnGoodsDetail = this.getActivityDetail
    window.returnGoodsUrl = this.getBannerList
    this.viewActivityDetail().then(() => {
      this.$route.meta.title = this.activityTheme
      // 活动可编辑时设置右上角编辑按钮
      if (!this.isActivityDown && !this.isActivityExpires) {
        let _router = {
          router: this.$router,
          path: {
            name: 'ViewActivity',
            query: {
              id: this.activityId,
              isActivityDown: this.isActivityDown,
              isActivityExpires: this.isActivityExpires,
              isEditeActivity: 1
            }
          }
        }
        nativeBackAndJumpTwo(MESSAGE, _router, this.activityTheme)
      } else if (this.isActivityDown) {
        // 下架活动左侧箭头隐藏
        setTitle(this.activityTheme, 1)
      } else {
        // 否则正常展示
        setTitle(this.activityTheme)
      }
    })
  },
  methods: {
    // 查看活动详情
    async viewActivityDetail () {
      let url = 'UnionAct/actDetails'
      let obj = {
        id: this.activityId
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.bannerSrc = res.data.image_path
          this.tempBannerSrc = res.data.image_path
          this.activityTheme = res.data.title
          this.startTime = res.data.start_at.substring(0, res.data.start_at.length - 3)
          this.showedStartTime = res.data.start_at.substring(5, res.data.start_at.length - 3)
          this.endTime = res.data.end_at.substring(0, res.data.end_at.length - 3)
          this.showedEndTime = res.data.end_at.substring(5, res.data.end_at.length - 3)
          this.city = [res.data.province, res.data.city, res.data.area]
          this.streetInfo = res.data.address
          this.activityCost = res.data.cost
          this.brandList = res.data.brand
          this.tempBrandList = JSON.parse(JSON.stringify(res.data.brand))
          this.activityContent = res.data.description
          this.tempActivityContent = res.data.description
          this.downReason = res.data.down_reason
          this.isShow = true
        }
      })
      return Promise.resolve()
    },
    getAndoriadBannerImg (imgUrl) {
      this.bannerSrc = imgUrl
    },
    uploadBannerImg () {
      // 非编辑页面阻止调起相机
      if (!this.isEditeActivity) return
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
      this.bannerSrc = ''
    },
    // inputActivityTheme (value) {
    //   let valLength = value.length
    //   if (valLength >= 25) {
    //     this.$vux.toast.text('最多可输入25个字符', 'middle')
    //   }
    //   this.activityTheme = value
    // },
    // inputStreetInfo (value) {
    //   let valLength = value.length
    //   if (valLength >= 50) {
    //     this.$vux.toast.text('最多可输入50个字符', 'middle')
    //   }
    //   this.streetInfo = value
    // },
    // inputActivityCost (value) {
    //   this.activityCost = value
    // },
    // finishInputCost () {
    //   if (!this.activityCost) return
    //   if (!regCost.test(this.activityCost)) {
    //     this.$vux.toast.text('请输入正确的费用格式', 'middle')
    //     return
    //   }
    //   let [init, zero] = this.activityCost.split('.')
    //   if (zero === undefined) {
    //     this.activityCost = `${init}.00`
    //     return
    //   }
    //   if (zero.length <= 1) {
    //     this.activityCost = `${init}.${zero}0`
    //     return
    //   }
    //   this.activityCost = `${init}.${zero}`
    // },
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
      // 非编辑页面阻止调起编辑器
      if (!this.isEditeActivity) return
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
      let brandImg = !this.brandListLength ? [] : JSON.stringify(this.brandList)
      let url = 'UnionAct/createAct'
      let obj = {
        id: this.activityId,
        image_path: this.bannerSrc,
        title: this.activityTheme,
        start_at: this.startTime,
        end_at: this.endTime,
        province,
        city,
        area,
        address: this.streetInfo,
        cost: this.activityCost,
        brandImg,
        description: this.activityContent,
        act_status: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$vux.toast.text('发布成功', 'middle')
          this.$router.push('/activity-list')
        }
      })
    },
    checkFieldValidity () {
      if (!this.bannerSrc) {
        this.$vux.toast.text('请上传商品图片', 'middle')
        return false
      }
      // if (!this.activityTheme) {
      //   this.$vux.toast.text('请填写主题', 'middle')
      //   return false
      // }
      // if (!this.startTime) {
      //   this.$vux.toast.text('请设置开始时间', 'middle')
      //   return false
      // }
      // if (formatDateTwo(this.startTime) < formatDateTwo()) {
      //   this.$vux.toast.text('开始时间不可小于当前时间', 'middle')
      //   return false
      // }
      // if (!this.endTime) {
      //   this.$vux.toast.text('请设置结束时间', 'middle')
      //   return false
      // }
      // if (formatDateTwo(this.startTime) > formatDateTwo(this.endTime)) {
      //   this.$vux.toast.text('结束时间不可小于开始时间', 'middle')
      //   return false
      // }
      // if (!this.cityList.length) {
      //   this.$vux.toast.text('请选择地址', 'middle')
      //   return false
      // }
      // if (!this.streetInfo) {
      //   this.$vux.toast.text('请填写地址', 'middle')
      //   return false
      // }
      // if (this.activityCost) {
      //   if (!regCost.test(this.activityCost)) {
      //     this.$vux.toast.text('请填写正确的费用格式', 'middle')
      //     return false
      //   }
      // }
      if (!this.activityContent.trim()) {
        this.$vux.toast.text('请填写活动详情', 'middle')
        return false
      }
      return true
    },
    goBack () {
      this.$router.back()
    }
  },
  watch: {
    // 弥补编辑回退的时候，右上角编辑按钮消失
    '$route' (to, from, next) {
      if (to.query.isEditeActivity === void 0) {
        let _router = {
          router: this.$router,
          path: {
            name: 'ViewActivity',
            query: {
              id: this.activityId,
              isActivityDown: this.isActivityDown,
              isActivityExpires: this.isActivityExpires,
              isEditeActivity: 1
            }
          }
        }
        nativeBackAndJumpTwo(MESSAGE, _router, this.activityTheme)
        // 编辑回退，内容不保存
        this.bannerSrc = this.tempBannerSrc
        this.brandList = JSON.parse(JSON.stringify(this.tempBrandList))
        this.activityContent = this.tempActivityContent
      } else {
        setTitle('编辑活动')
      }
      next()
    }
  },
  components: {
    BaseScroll,
    BasePop,
    Group,
    Datetime,
    XAddress
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
@import "~common/stylus/vux.styl"
.establish-activity-container
  flex-col()
  height 100%
  background $color-white
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
      .edit-brand
        flex-f()
        align-items center
        position relative
        flex-wrap wrap
        padding-top 30px
        min-height 100px
        span:nth-child(1)
          width 256px
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
  .activity-cancel-wrapper
    pf(100%)
    background rgba(0, 0, 0, .5)
    .activity-cancel
      width 72%
      // height 40%
      padding 0 46px
      background $color-white
      border-radius(20px)
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      h1
        f18()
        color $color-orange
        line-height 50px
        tc()
        margin-top 84px
        margin-bottom 44px
      p
        f16()
        line-height 40px
      .activity-cancel-reason
        color $color-3
        margin-bottom 20px
      .activity-explain
        color $color-9
        margin-bottom 64px
      .activity-button
        tc()
        margin-bottom 52px
        button
          display inline-block
          width 260px
          height 64px
          line-height 64px
          border-radius(8px)
          f16()
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
  .forbidden-click
    pointer-events none
</style>
