<template>
  <div class="set-telephone">
    <div class="text-mess">
      <span></span>
      <p>买家可通过客服电话与您联系，将展示在采购师App用户的订单详情和商品详情，默认展示注册手机号，可编辑修改。</p>
    </div>
    <div class="text-input">
      <label>
        <span>联系方式</span>
        <input type="text" v-model="value" maxlength="11" v-focus autofocus="autofocus">
      </label>
    </div>
    <div class="footer" @click="setSave">
      <h5>保存</h5>
    </div>
    <pop ref="popShow" :title="title"></pop>
  </div>
</template>

<script>
import Pop from 'base/pop/pop'
export default {
  data() {
    return {
      value: this.$route.query.tel,
      title: ''
    }
  },
  created () {
    // this.getServicePhone()
  },
  methods: {
    getServicePhone () {
      let URL = 'phone/findPhone'
      this.$http(URL).then((res) => {
        if (res.code === this.$ok) {
          this.value = res.data.service_num
        }
      })
    },
    popMess (mess) {
      this.title = mess
      this.$refs.popShow.show()
      this.$refs.popShow.hide()
    },
    setSave () {
      if (this.value.trim()) {
        console.log(this.value)
        if (!/^[0-9]+$/.test(this.value)) {
          this.popMess('格式错误，请输入正确的联系方式')
          return
        }
        // this.popMess('联系方式不能为空')
        // return
      }
      // if (!/(1\d{2}-?\d{4}-?\d{4}$)|(1\d{2}-?\d{4}-?\d{4}$)|(0\d{2,3}-?\d{7,8}$)|(0\d{2,3}-?\d{7,8}$)$/.test(this.value)) {
      // if (!/^[1-9][0-9]+$/.test(this.value)) {
      // if (!/^[0-9]+$/.test(this.value)) {
      //   this.popMess('格式错误，请输入正确的联系方式')
      //   return
      // }
      let URL = 'shop/editShop'
      let obj = {
        service_mobile: this.value
      }
      this.$http(URL, obj).then(res => {
        if (res.code === this.$ok) {
          this.popMess('修改成功')
          this.$router.replace('/set-shop')
        } else {
          this.popMess('格式错误，请输入正确的联系方式')
        }
      })
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
  components: {
    Pop
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.set-telephone
  position: fixed
  z-index: 200
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: $color-f4
  .text-mess
    width: 100%
    padding 24px 24px 30px 14px
    background: #FFF2E3
    color $color-orange
    font-size: 26px;/*px*/
    flex-f()
    span
      margin-top -2px;/*no*/
      width 44px
      height 42px
      bg('warning.png')
    p
      flex 1
      padding-left 12px
      line-height 36px
  .text-input
    padding 0 28px
    padding-top 32px
    padding-bottom 60px
    width: 100%
    background #fff
    flex-between()
    label
      width: 100%
      flex-col()
      f14()
      color #333
      input
        margin-top 20px
        bd(#ccc)
        height 88px
        padding 0 24px
        border-radius(8px)
        color #7C7C7C
        fz(13px)
  .footer
    width: 100%
    line-height: 98px;/*px*/
    text-align: center
    font-size: 36px;/*px*/
    color: $color-white
    position: fixed
    left: 0
    bottom: 0
    background: $color-orange
</style>