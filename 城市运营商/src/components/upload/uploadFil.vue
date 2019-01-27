<template>
  <div class="upload">
    <el-form ref="upForm" :rules="rules" :model="upForm" >
      <el-form-item label="活动名称" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :multiple="true"
          :file-list="fileList"
          list-type="picture"
          accept="image/jpeg,image/gif,image/png,image/bmp"
          :on-error="uploadError"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="upForm.imageUrl" :src="upForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="el-upload__tip">请上传png、jpg及jpeg格式图片(大小2M以下,建议分辨率256*256)</div>
      </el-form-item>
      <el-form-item class="buttom">
        <el-button type="primary" @click="onSubmit('upForm')">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      upForm: {
        imageUrl: ''
      },
      rules: {
        imageUrl: [
          {required: true, message: '请上传应用图标', trigger: 'change'}
        ]
      },
      fileList: []
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadError () {
      this.$message.error('上传失败，请重新上传')
    },
    handleAvatarSuccess (res, file) {
      this.upForm.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 230px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 230px;
    height: 178px;
    display: block;
  }
</style>
