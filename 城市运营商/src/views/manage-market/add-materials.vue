<template>
  <div class="add-materials-container">
    <div class="materials-radio">
      <div class="radio-left">
        <span>*</span>
        <span>材料图书馆</span>
      </div>
      <div class="radio-right">
        <el-radio-group v-model="materialsId">
          <el-radio v-for="item in materialsList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="materials-img">
      <div class="materials-img-top">
        <span>*</span>
        <span>材料图书馆广告图片(建议图片尺寸750*350，大小不超过400k)</span>
      </div>
      <div class="materials-img-bottom">
        <base-upload-img @uploadFile="uploadFile"></base-upload-img>
      </div>
    </div>
    <div class="materials-button">
      <base-button :type="1" text="确定提交" @clickCurrentButton="comfirm"></base-button>
      <base-button text="放弃" @clickCurrentButton="giveup"></base-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      materialsId: '',
      materialsList: [],
      imgUrl: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let url = 'adv/getMaterialMuseumList'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.materialsList = res.data
          this.materialsId = res.data[0].id
        }
      })
    },
    // 上传图片
    uploadFile (imgUrl) {
      this.imgUrl = imgUrl
    },
    addMaterials () {
      let url = 'adv/addMaterialMuseum'
      let obj = {
        head_img: this.materialsId,
        index_img: this.imgUrl
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push({ name: 'materialLibaryList' })
        }
      })
    },
    comfirm () {
      if (!this.imgUrl) {
        this.$message({
          message: '请上传图片',
          type: 'warning'
        })
        return
      }
      this.addMaterials()
    },
    giveup () {
      this.$confirm('你确定放弃添加吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ name: 'materialLibaryList' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.add-materials-container
  .materials-radio
    display flex
    align-items center
    .radio-left
      span:first-child
        color red
    .radio-right
      margin-left 50px
  .materials-img
    margin-top 50px
    .materials-img-top
      span:first-child
        color red
    .materials-img-bottom
      margin-top 30px
  .materials-button
    display flex
    align-items center
    margin-top 30px
    .el-button
      margin-right 50px
</style>
