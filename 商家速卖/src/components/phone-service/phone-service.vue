<template>
  <div class="phone">
    <div class="pic">
      <img src="./main.png" />
    </div>
    <div class="image" @click="callMe(Phone.service)">
      <p>{{Phone.service}}</p>
    </div>
    <div class="business" @click="callMe(Phone.partnership)"> 
      <i></i>
      <div>
        <span>商务合作：</span>
        <span>{{ Phone.partnership }}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { loadDataPost, STATUS_OK } from 'api/common'
  import { dev, _postMessage } from 'common/js/dev'
  export default {
    data() {
      return {
        Phone: {}
      }
    },
    created() {
      this.phone()
      window.callMe = this.callMe
    },
    methods: {
      callMe(call) {
        // console.log(call, typeof call)
        let currentDev = dev()
        try {
          if (currentDev === 'Android') {
            window.android.daCall(call)
          } else if (currentDev === 'iOS') {
            _postMessage(call, 'daCall')
          } else {
            console.log('pc')
          }
        } catch (e) {
          console.warn(e)
        }
      },
      phone() {
        let URL = 'srvPhone'
        loadDataPost(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.Phone = res.data
          } else {
            console.log('lose')
          }
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .phone
    width: 100%
    height: 100vh
    background: url('bg.png') no-repeat
    background-size: cover
    padding-top: 22px
    .pic
      img
        width: 100%
    .image
      p
        padding-top: 42px 
        font-size: 62px;/*px*/
        text-align: center
        font-style: italic 
        color: #ff8c00
        text-shadow: -2px 0 $color-white, 0 2px $color-white, 2px 0 $color-white, 0 -2px $color-white;/*no*/
    .business
      position: fixed
      width: 100%
      left: 0
      bottom: 98px;/*px*/
      padding: 0 28px
      i
        position: absolute
        left: 18px
        top: -14px
        width: 104px;/*px*/
        height: 94px;/*px*/
        background: url('telh.png') no-repeat
        background-size: 100% auto
      >div
        color: $color-white
        font-size: 34px;/*px*/
        padding-left: 145px;/*px*/
        border: 1px solid $color-white;/*no*/
        border-radius: 10px
        padding: 16px 0
</style>
