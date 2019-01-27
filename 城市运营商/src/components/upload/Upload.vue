<template>
  <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList2"
    list-type="picture">
    <div class="upload">
      <div class="line">
        <div class="aline"></div>
      </div>
      <span>上传图片</span>
    </div>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>
<script>
export default {
  data () {
    return {
      fileList2: []
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>
<style>
.upload-demo {
  width: 400px;
}
.upload {
  width: 300px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  position: relative;
}
.line {
  width: 30px;
  height: 1px;
  background-color: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -15px;
}
.aline {
  width: 1px;
  height: 30px;
  background-color: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  transform: translateY(-50%);
  z-index: 2;
}
span {
  position: absolute;
  bottom: 30px;
  margin-left: -30px;
}
</style>
