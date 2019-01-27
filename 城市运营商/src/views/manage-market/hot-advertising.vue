<template>
  <div class="upload" v-if="flag">
    <el-form ref="upForm" :rules="rules" :model="upForm" >
      <el-form-item label="联盟活动首页广告位" prop="baseImg">
        <upload @uploadFile="upImg" :imgUrl="indexImg"></upload>
        <div class="el-upload__tip">请上传png、jpg及jpeg格式图片(大小300k以下,建议分辨率288*108)</div>
      </el-form-item>
      <el-form-item class="buttom">
        <el-button type="primary" @click="onSubmit('upForm')">确认提交</el-button>
        <el-button @click="resetForm">放弃</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import upload from 'components/upload-img/index'
export default {
  data () {
    return {
      indexImg: '',
      flag: false,
      baseImg: '',
      upForm: {},
      rules: {
        baseImg: [
          { required: true, message: '请上传应用图标', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    upload
  },
  created () {
    this.getDate()
  },
  methods: {
    upImg (res) {
      this.baseImg = res
      console.log(this.baseImg)
    },
    getDate () {
      this.$http('adv/getHotAdvImg').then(res => {
        console.log(res)
        this.indexImg = res.data.index_img
        this.flag = true
      })
    },
    onSubmit (formName) {
      let obj = {
        image: this.baseImg || this.indexImg
      }
      this.$http('adv/setHotAdvImg', obj).then(res => {
        if (res.code === 400) {
          this.$message({
            message: '请上传图片',
            type: 'error'
          })
        }
        if (res.code === this.$ok) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.$router.push('/manage-market/hot-activity')
        }
      })
    },
    resetForm () {
      this.$router.push('/manage-market/hot-activity')
    }
  }
}
</script>
<style lang='stylus'>
.el-upload__tip {
  margin-left 140px
}
.buttom
  width 300px
  height 40px
  margin-left 140px
  .el-button
    width 100px
    height 40px
</style>
