<template>
  <div class="success">
    <img src="./images/report_success.png" alt="">
    <p>举报成功</p>
    <p>感谢您的匿名举报，一旦查实我们将立即处理</p>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
img
  display block
  width 144px
  height 144px
  margin 200px auto 0
p:nth-of-type(1)
  margin-top 40px
  margin-bottom 100px
  color rgb(105, 97, 117)
  font-size 30px
p
  text-align center
  font-size 26px
  color rgb(166, 166, 166)
</style>
