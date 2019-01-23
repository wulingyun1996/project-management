<template>
  <div class="home-container">
    <div class="home-logo">
      <img src="./images/logo.png" alt="">
      <span>建材·采购师</span>
    </div>
    <a href="javascript:" class="go-down" id="downloadApp">
      打开APP
    </a>
  </div>
</template>

<script>
export default {
  mounted () {
    /* eslint-disable */
    let { IS_TEST_ENV, NODE_ENV } = process.env
    var appKey = NODE_ENV !== 'production' ? 'ue2rov' : (NODE_ENV === 'production' && IS_TEST_ENV ? 'ue2rov' : 'al3sef')
    /* eslint-enable */
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.id = 'openinstall'
    s.defer = true
    s.src = '//res.cdn.openinstall.io/openinstall.js'
    document.body.appendChild(s)
    setTimeout(() => {
      var src = document.createElement('script')
      src.type = 'text/javascript'
      src.defer = true
      src.innerHTML = `
        var data = window.OpenInstall.parseUrlParams();
        var appKey = "${appKey}";
        new window.OpenInstall({
          appKey,
          onready: function () {
          var that = this;
          var button = document.querySelector('#downloadApp');
          button.style.visibility = "visible";
          that.schemeWakeup();
          button.addEventListener("click", function () {
            that.wakeupOrInstall();
            return false
          })
        }
      }, data)`
      document.body.appendChild(src)
    }, 100)
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.home-container
  height 100%
  flex-col()
  f18()
  color $color-3
  padding-top 60px
  bg('bg.png')
  .home-logo
    height 72px
    flex-align-item()
    justify-content center
    fz(20px)
    color $color-orange
    margin-bottom 80px
    span
      font-weight 700
    img
      width 72px
      height 72px
      display block
      margin-right 16px
  .go-down
    display block
    width 280px
    height 80px
    line-height 80px
    tc()
    bd($color-9)
    border-radius(8px)
    margin 0 auto
    font-weight 700
</style>
