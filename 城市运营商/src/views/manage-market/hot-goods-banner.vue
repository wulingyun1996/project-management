<template>
  <div class="add-hot-goods-banner">
    <div class="activity-name">
      <div class="description">
        <span class="red">*</span>
        <span class="name">活动名称：</span>
      </div>
      <base-input
        @changeInputValue="getBannerName"
        placeholder=""
        :maxlength="10"
        class="input-wrapper">
      </base-input>
      <span class="title">最多可填充10个文字</span>
    </div>
    <div class="activity-banner">
      <div class="description">
        <span class="red">*</span>
        <span class="name">活动广告图banner：</span>
      </div>
      <div class="upload-banner">
        <base-upload-img @uploadFile="uploadBanner" @beforeUpload="beforeUpload"></base-upload-img>
        <p>【尺寸大小 750*280，建议格式：'.png', '.jpeg', '.jpg'，不超过2M 】</p>
      </div>
    </div>
    <div class="banner-label">
      <div class="description">
        <span class="red">*</span>
        <span class="name">爆款商品标签：</span>
      </div>
      <label class="banner-item" v-for="(item, index) in labelList" :key="index">
        <img :src="item" alt="">
          <el-radio v-model="imgLabel" :label="index"></el-radio>
      </label>
    </div>
    <div class="label-description">
      <p>自定义添加【尺寸大小 66*66，建议格式：'.png', '.jpeg', '.jpg'，不超过200KB 】 </p>
      <base-upload-img @uploadFile="uploadLabel" @beforeUpload="beforeUploadLabel"></base-upload-img>
    </div>
    <!-- 提交新增与编辑 -->
    <div class="edit-button">
      <base-button :type="1" text="确认提交" @clickCurrentButton="comfirmSubmitContent"></base-button>
      <base-button text="放弃" @clickCurrentButton="giveupSubmitContent"></base-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotGoodsBanner',
  data () {
    return {
      bannerName: '',
      imgUrl: '',
      imgLabel: '',
      labelList: [],
      customLabel: ''
    }
  },
  created () {
    this.getImgLabel()
  },
  methods: {
    getBannerName (val) {
      this.bannerName = val
    },
    uploadBanner (url) {
      this.imgUrl = url
    },
    beforeUpload (imgSize) {
      let size = imgSize / 1024 / 1024
      if (size > 2) {
        this.$mes('上传图片大小不能超过 2M!', 2)
      }
    },
    // 爆款商品标签接口
    getImgLabel () {
      let url = 'adv/hotLabels'
      this.$http(url).then(res => {
        this.labelList = res
      })
    },
    uploadLabel (val) {
      this.customLabel = val
    },
    beforeUploadLabel (imgSize) {
      let size = imgSize / 1024
      if (size > 200) {
        this.$mes('上传图片大小不能超过 200kb!', 2)
      }
    },
    comfirmSubmitContent () {
      if (!this.validateFiles()) return
      let url = 'adv/editHotAdv'
      let obj = {
        title: this.bannerName,
        hotadv_image: this.imgUrl
      }
      if ((this.imgLabel !== '' || this.imgLabel === '') && this.customLabel) {
        obj.hotlabel_image = this.customLabel
      }
      if (this.imgLabel !== '' && !this.customLabel) {
        obj.hotlabel_image = this.labelList[this.imgLabel]
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$mes('添加成功')
          this.$router.back()
          return
        }
        // this.$mes(res.message, 4)
      })
    },
    giveupSubmitContent () {
      this.$router.back()
    },
    validateFiles () {
      if (!this.bannerName) {
        this.$mes('请填写活动名称', 2)
        return false
      }
      if (!this.imgUrl) {
        this.$mes('请上传活动广告图', 2)
        return false
      }
      if (this.imgLabel === '' && !this.customLabel) {
        this.$mes('请选择爆款活动标签', 2)
        return false
      }
      return true
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.add-hot-goods-banner
  .activity-name,
  .activity-banner,
  .banner-label
    flex-f-align()
    margin-bottom 20px
    .description
      width 160px
      height 32px
      line-height 32px
      text-align right
      overflow hidden
      margin-right 30px
    .input-wrapper
      margin-right 10px
    .title
      color #999
  .activity-banner
    align-items flex-start
    margin-bottom 60px
    .upload-banner
      width 750px
      height 280px
      p
        f12()
        color #666
        padding-top 10px
      .upload-img-container
        width 100%
        height 100%
  .banner-label
    .banner-item
      position relative
      margin-right 30px
      img
        wh(80px)
      label
        position absolute
        right 0
        bottom 0
      // .el-radio__input
      //   &.is-checked
      //     .el-radio__inner
      //       color #ff8a00
      //       background #ff8a00
      //       border-color #ff8a00
      .el-radio__label
        display none
  .label-description
    margin-left 190px
    f14()
    p
      margin-bottom 10px
    >div
      wh(60px)
  .edit-button
    margin-top 40px
    flex-f-align()
    justify-content center
    >div
      margin-right 10px
      f14()
  .red
    display inline-block
    color #ff8a00
    vertical-align sub
    margin-right 2px
</style>
