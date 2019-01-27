<template>
  <div class="upload" v-if="flag">
    <el-form ref="upForm" :rules="rules" :model="upForm" >
      <el-form-item label="推荐商户首页广告位" prop="baseImg">
        <upload @uploadFile="upImg" :imgUrl="indexImg"></upload>
        <div class="el-upload__tip">请上传png、jpg及jpeg格式图片(大小300k以下,建议分辨率288*108)</div>
      </el-form-item>
      <el-form-item label="推荐商户详情页广告位" prop="baseImg">
        <upload @uploadFile="loadImg" :imgUrl="detaImg"></upload>
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
      detaImg: '',
      baseImg: '',
      minImg: '',
      flag: false,
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
    },
    loadImg (res) {
      this.minImg = res
    },
    getDate () {
      this.$http('adv/merchantAdvDetail').then(res => {
        console.log(res)
        this.detaImg = res.data.detail_img
        this.indexImg = res.data.index_img
        this.flag = true
      })
    },
    onSubmit (formName) {
      let obj = {
        detail_img: this.minImg || this.detaImg,
        index_img: this.baseImg || this.indexImg
      }
      this.$http('adv/editMerchantAdv', obj).then(res => {
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
          this.$router.push('/manage-market/hot-business')
        }
      })
    },
    resetForm () {
      this.$router.push('/manage-market/hot-business')
    }
  }
}
</script>
<style lang='stylus' scoped>
.el-upload__tip
  margin-left 140px
.el-button
  margin-left 140px
  width 100px
.buttom
  width 500px
  height 40px
  .el-button
    width 100px
    height 40px
</style>
