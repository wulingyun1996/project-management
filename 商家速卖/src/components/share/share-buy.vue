<template>
  <div class="share">
    <div class="content">
      <div class="logo"></div>
      <img src="./share.png">
      <p>下载<span>建材商家速卖</span>  发现更多<span>商机</span></p>
      <div class="btn" id="downloadApp">打开APP</div>
    </div>
  </div>
</template>

<script>
import { openInstallMixins } from 'mixins'
export default {
  mixins: [openInstallMixins],
  mounted () {
    this.openAppByOpenInstall()
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  .share
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    background: #d7eefe url('shareBg.png') no-repeat center 135px
    background-size: 100% auto
    .content
      padding: 62px 0 0
      .logo
        width: 52px;/*px*/
        height: 53px;/*px*/
        position: absolute
        left: 42px
        top: 30px
        background: url('LOGO@2x.png') no-repeat center center
        background-size: 100% auto
        display: none
      img
        width: 58%
        display: block
        margin: 0 auto
      p
        text-align: center
        margin-top: 70px
        font-size: 40px;/*px*/
        span
          color: $color-orange
          font-weight: bold
      .btn
        display: block
        text-align: center
        width: 340px;/*px*/
        height: 90px;/*px*/
        line-height: 90px;/*px*/
        border-radius: 5px
        background: $color-orange
        color: $color-white
        font-size: 36px;/*px*/
        margin: 45px auto 0
        font-weight: bold
</style>
