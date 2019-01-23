<template>
  <div class="add-manager">
    <div class="add-box">
      <div class="add-input">
        <label>姓名</label>
        <!-- <input type="text" v-model="inputName" name="name" maxlength="8" @focus="changeBug" @blur="loseBug"> -->
        <input type="text" v-model="inputName" name="name" maxlength="8" @focus="justifyBodyHeight" @blur="restoreBodyHeight">
      </div>
      <div class="add-input">
        <label>手机号</label>
        <!-- <input type="text" v-model="inputTel" name="tel" maxlength="11" @focus="changeBug" @blur="loseBug"> -->
        <input type="text" v-model="inputTel" name="tel" maxlength="11" @focus="justifyBodyHeight" @blur="restoreBodyHeight">
      </div>
      <p>为能正常推广活动，请认真核对录入信息</p>
    </div>
    <foot-btn text="提交" @footBtnClick="footBtnClick" ref="button"></foot-btn>
    <pop ref="pop" :title="mess"></pop>
  </div>
</template>

<script>
import { dev } from 'common/js/dev'
import FootBtn from 'base/foot-btn/foot-btn'
import Pop from 'base/pop/pop'
import { loadDataPost, STATUS_OK, DELETE_CODE } from 'api/common'
export default {
  data() {
    return {
      inputName: '',
      inputTel: '',
      mess: ''
    }
  },
  methods: {
    changeBug() {
      let currentDev = dev()
      if (currentDev === 'iOS') {
        document.body.classList.add('full-body')
      }
    },
    loseBug() {
      let currentDev = dev()
      if (currentDev === 'iOS') {
        document.body.classList.remove('full-body')
      }
    },
    showMess(mess) {
      this.mess = mess
      this.$refs.pop.show()
      this.$refs.pop.hide()
    },
    isName(val) {
      let strs = val.replace(/(^\s+)|(\s+$)/g, '')
      if (!strs.match(/^[\u4e00-\u9fa5]{2,8}$/)) {
        return false
      }
      return true
    },
    isTel(val) {
      if (!(/^1([3568][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(val))) {
        return false
      }
      return true
    },
    isCheck() {
      let isName = this.isName(this.inputName)
      if (!isName) {
        this.showMess('请正确输入2-8字汉字')
        return false
      }
      let isTel = this.isTel(this.inputTel)
      if (!isTel) {
        this.showMess('请正确输入手机号')
        return false
      }
      return true
    },
    footBtnClick() {
      let isCheck = this.isCheck()
      if (isCheck) {
        let URL = 'salesman/addSaleman'
        let obj = {
          salesman_name: this.inputName,
          salesman_mobile: this.inputTel
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$router.back()
          }
          if (res.code === DELETE_CODE) {
            this.showMess('该手机号已是推广员身份，不可重复')
          }
          return
        })
      }
    }
  },
  components: {
    FootBtn,
    Pop
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.add-manager
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  background: #ffe8cd url('./bg.png') no-repeat left 28px
  background-size: 100% auto
  z-index: 200
  .add-box
    position: absolute
    top: 154px;/*px*/
    left: 25px
    bottom: 136px;/*px*/
    right: 25px
    background: $color-white
    padding: 80px 66px 0
    .add-input
      display: flex
      align-items: center
      margin-bottom: 32px
      label
        font-size: 28px;/*px*/
        display: block
        width: 20%
      input
        display: block
        height: 70px;/*px*/
        flex: 1
        border: 1px solid $color-c;/*no*/
        padding-left: 10px
    p
      font-size: 24px;/*px*/
      color: $color-c
      padding-left: 20%
      line-height: 1.3
</style>