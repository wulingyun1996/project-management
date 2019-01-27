<template>
  <div class="upload-img-container">
    <el-upload
      class="uploader-pic"
      accept="image/jpeg,image/png,image/jpg"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="uploadFile"
      :before-upload="beforeUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <i class="el-icon-error" ref="close" @click.stop="clearImg"></i>
    </el-upload>
  </div>
</template>

<script>
const baseUrl = process.env.VUE_APP_IMG_ROOT
export default {
  props: {
    limitedSize: {
      type: Number,
      default: 400
    },
    imgUrl: {
      type: String,
      default: ''
    },
    data: {
      default: ''
    }
  },
  data () {
    return {
      imageUrl: this.imgUrl,
      uploadUrl: `http://${baseUrl}/upload`
    }
  },
  created () {
    this.imageUrl = this.imgUrl
  },
  methods: {
    uploadFile (res) {
      this.imageUrl = res
      this.$emit('uploadFile', res)
      if (this.data) {
        let obj = {
          url: res,
          data: this.data
        }
        this.$emit('uploadFileData', obj)
      }
      this.$refs.close.style.display = "block"
    },
    beforeUpload (file) {
      let size = file.size / 1024
      if (size > this.limitedSize) {
        this.$mes(`上传图片大小不能超过${this.limitedSize}kb!`, 2)
        return false
      }
      this.$emit('beforeUpload', file.size)
    },
    clearImg () {
      this.imageUrl = ''
      this.$emit('uploadFile', '')
      this.$refs.close.style.display="none"
    }
  },
  watch: {
    imgUrl (val) {
      this.imageUrl = val
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.upload-img-container
  wh(178px)
  display inline-block
  .uploader-pic
    wh(100%)
    .el-upload
      wh(100%)
      border 1px dashed #d9d9d9
      border-radius 6px
      cursor pointer
      position relative
      overflow unset
    .el-icon-plus
      fz(30px)
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
    .el-icon-error
      f20()
      z-index 888
      position absolute
      right -10px
      top -10px
      display none
    .avatar
      wh(100%)
      display block
</style>
