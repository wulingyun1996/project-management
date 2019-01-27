<template>
  <div class="materials-details-container">
    <div class="details-info">
      <div class="info-left"></div>
      <div class="info-right">{{ title }}材料图书馆</div>
    </div>
    <div class="materials-img">
      <div class="materials-img-top">
        <span>*</span>
        <span>材料图书馆广告图片(<span>建议图片尺寸750*350，大小不超过400k</span>)</span>
      </div>
      <div class="materials-img-bottom">
        <base-upload-img @uploadFile="uploadFile" :imgUrl="imgUrl"></base-upload-img>
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
      title: '',
      imgUrl: '',
      // detailsImg: '',
      materialsId: ''
    }
  },
  created () {
    this.getData()
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getData () {
      let url = 'adv/getMaterialMuseumDetails'
      let obj = {
        id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.title = res.data.name
          this.imgUrl = res.data.index_img
          this.materialsId = res.data.head_img
        }
      })
    },
    // 上传图片
    uploadFile (imgUrl) {
      this.imgUrl = imgUrl
    },
    comfirm () {
      if (!this.imgUrl) {
        this.$mes('请上传图片', 2)
        return false
      }
      let url = 'adv/addMaterialMuseum'
      let obj = {
        head_img: this.materialsId,
        index_img: this.imgUrl,
        id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({ name: 'materialLibaryList' })
        }
      })
    },
    giveup () {
      this.$confirm('你确定放弃编辑吗?', '提示', {
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
.materials-details-container
  .details-info
    display flex
    align-items center
    .info-left
      width 5px
      height 20px
      background-color #ccc
      margin-right 50px
  .materials-img
    margin-top 50px
    .materials-img-top
      span:first-child
        color red
    .materials-img-bottom
      margin-top 30px
      .upload-img-container
        width 400px
        height 220px
  .materials-button
    display flex
    align-items center
    margin-top 30px
    .el-button
      margin-right 50px
</style>
