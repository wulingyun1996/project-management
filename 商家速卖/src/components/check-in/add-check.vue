<template>
  <div class="add-manager">
    <div class="add-box">
      <div>
        <div class="add-input">
          <input type="text" v-model="inputCard" placeholder="请输入卡号" name="name" @keyup="isTrue">
        </div>
        <p class="err-show" v-show="errShow">{{messOne}}</p>
        <div class="mess-show" v-show="trueShow">
          <p><span>姓名：</span>{{messObj.name}}</p>
          <p><span>手机号：</span>{{messObj.mobile | hiddenFour}}</p>
        </div>
      </div>
    </div>
    <foot-btn text="确认" @footBtnClick="footBtnClick" class="gray" :class="{'orange': trueShow}"></foot-btn>
    <pop ref="pop" :title="mess"></pop>
  </div>
</template>
<script type="text/ecmascript-6">
  import FootBtn from 'base/foot-btn/foot-btn'
  import Pop from 'base/pop/pop'
  import {nativeBackBase, navBack} from 'api/init'
  import {loadDataPost, STATUS_OK, DELETE_CODE, NOHAS_CODE} from 'api/common'
  export default {
    data() {
      return {
        inputCard: '',
        mess: '',
        messOne: '',
        messObj: {},
        noHas: true,
        timerId: ''
      }
    },
    filters: {
      hiddenFour(value) {
        if (value) {
          let newTel = value.substr(0, 3) + '****' + value.substr(7)
          return newTel
        }
      }
    },
    computed: {
      errShow() {
        if (!this.inputCard) {
          return true
        }
        if (this.noHas) {
          return true
        }
        return false
      },
      trueShow() {
        if (!this.noHas) {
          return true
        }
        return false
      }
    },
    created() {
      window.nav_back = this.nav_back
      this.nav()
    },
    methods: {
      nav_back() {
        navBack()
      },
      nav() {
        let param = {
          'left': [{
            'title': 'back',
            'function': 'nav_back()' // 默认
          }]
        }
        nativeBackBase(param)
      },
      // 函数防抖；
      isTrue() {
        if (!this.inputCard) {
          this.messOne = '请输入卡号'
        } else {
          clearTimeout(this.timerId)
          this.timerId = setTimeout(() => {
            let URL = 'tally/hasTicket'
            let obj = {
              active_id: this.$route.params.id,
              card_number: this.inputCard
            }
            loadDataPost(URL, obj).then((res) => {
              if (res.code === NOHAS_CODE) {
                this.messOne = '该卡号不存在'
                this.noHas = true
              }
              if (res.code === STATUS_OK) {
                this.messObj = res.data
                this.noHas = false
              }
            })
          }, 500)
        }
      },
      showMess(mess) {
        this.mess = mess
        this.$refs.pop.show()
        setTimeout(() => {
          this.$refs.pop.hide()
        }, 200)
      },
      isCheck() {
        if (!this.inputCard) {
          this.messOne = '请输入卡号'
          return false
        }
        if (this.noHas) {
          this.messOne = '该卡号不存在'
          return false
        }
        return true
      },
      footBtnClick() {
        let isCheck = this.isCheck()
        if (isCheck) {
          let URL = 'tally/addSign'
          let obj = {
            active_id: this.$route.params.id,
            card_number: this.inputCard
          }
          loadDataPost(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              this.showMess('签到成功')
              this.$route.meta.hasDone = true
              setTimeout(() => {
                this.$router.back()
              }, 1000)
            }
            if (res.code === DELETE_CODE) { // 400
              this.showMess('该卡号已签到')
            }
            if (res.code === NOHAS_CODE) { // 420
              this.showMess('该卡号不存在')
            }
            return
          })
        }
        return false
      }
    },
    components: {
      FootBtn,
      Pop
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .add-manager
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 200
    .add-box
      position: absolute
      top: 0
      left: 0
      bottom: 88px;/*px*/
      right: 0
      background: $color-white
      padding: 80px 66px 0
      >div
        width: 100%
        position relative
        .err-show
          line-height 42px
          position absolute
          left: 32px
          bottom -40px
          font-size 24px;/*px*/
          color: $color-red
          padding-left 28px
          background url('i.png') no-repeat left center
          background-size 20px 20px;/*px*/
        .mess-show
          padding: 28px
          font-size 28px;/*px*/
          position absolute
          width 100%
          left 0
          p
            margin-bottom 6px
          span
            display inline-block
            width 115px
            white-space nowrap
      .add-input
        display: flex
        align-items: center
        label
          font-size: 28px;/*px*/
          display: block
          width: 20%
        input
          display: block
          height: 88px;/*px*/
          flex: 1
          border: 1px solid $color-c;/*no*/
          padding-left: 40px
  .gray
    background $color-bc
    &.orange
      background $color-orange
</style>
