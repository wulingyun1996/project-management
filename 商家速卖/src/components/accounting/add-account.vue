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
          <p><span>手机号：</span>{{messObj.mobile}}</p>
        </div>
      </div>
      <div class="mar-top">
        <div class="add-input">
          <label>销售金额：</label>
          <input type="text" v-model="inputSales" name="sales" @focus="justifyBodyHeight" @blur="restoreBodyHeight">
          <div>元</div>
        </div>
        <p class="err-show" v-show="errShowTwo">{{messTwo}}</p>
      </div>
      <div>
        <div class="add-input">
          <label>定金金额：</label>
          <input type="text" v-model="inputDeposit" name="deposit" @focus="justifyBodyHeight" @blur="restoreBodyHeight">
          <div>元</div>
        </div>
        <p class="err-show" v-show="errShowThree">{{messThree}}</p>
      </div>
    </div>
    <foot-btn text="提交" ref="button" @footBtnClick="footBtnClick" class="gray" :class="{'orange': trueShow && !errShowTwo && !errShowThree}"></foot-btn>
    <pop ref="pop" :title="mess"></pop>
  </div>
</template>
<script>
  import {dev} from 'common/js/dev'
  import FootBtn from 'base/foot-btn/foot-btn'
  import Pop from 'base/pop/pop'
  import {nativeBackBase, navBack} from 'api/init'
  import {loadDataPost, STATUS_OK, NOHAS_CODE} from 'api/common'
  export default {
    data() {
      return {
        inputCard: '',
        inputSales: '',
        inputDeposit: '',
        mess: '',
        messOne: '',
        messTwo: '',
        messThree: '',
        messObj: {},
        noHas: true,
        timerId: ''
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
        if (!this.errShow) {
          return true
        }
        return false
      },
      errShowTwo() {
        if (!this.inputSales) {
          return true
        }
        if (this.inputDeposit && Number(this.inputDeposit) > Number(this.inputSales)) {
          this.messTwo = '销售金额需大于定金金额'
          return true
        }
        let salesLen = this.maxLength(this.inputSales)
        if (salesLen) {
          this.messTwo = '金额不得大于9位数值'
          return true
        }
        let isSales = this.isNum(this.inputSales)
        if (!isSales) {
          this.messTwo = '请输入大于等于0的数值，最多保留两位小数'
          return true
        }
        return false
      },
      errShowThree() {
        if (!this.inputDeposit) {
          return true
        }
        let depositLen = this.maxLength(this.inputDeposit)
        if (depositLen) {
          this.messThree = '金额不得大于9位数值'
          return true
        }
        let isDeposit = this.isNum(this.inputDeposit)
        if (!isDeposit) {
          this.messThree = '请输入大于等于0的数值，最多保留两位小数'
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
      // 需要防抖设置；
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
                this.noHas = false
                this.messObj = res.data
              }
            })
          }, 500)
        }
      },
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
        setTimeout(() => {
          this.$refs.pop.hide()
        }, 200)
      },
      isNum(val) {
        let regZero = /^\d{1,9}(?:\.\d{1,2})?$/
        let arrZero = val.match(regZero)
        if (arrZero === null) {
          return false
        }
        return true
      },
      maxLength(val) {
        let maxLength = /^\d{10,}(\.\d+)?$/
        let regRes = maxLength.test(val)
        if (regRes) {
          return true
        }
        return false
      },
      isCheck() {
        if (!this.inputCard) {
          this.messOne = '请输入卡号'
          return false
        }
        let isSales = this.isNum(this.inputSales)
        if (!isSales) {
          this.messTwo = '请输入大于等于0的数值，最多保留两位小数'
          return false
        }
        let isDeposit = this.isNum(this.inputDeposit)
        if (!isDeposit) {
          this.messThree = '请输入大于等于0的数值，最多保留两位小数'
          return false
        }
        return true
      },
      footBtnClick() {
        if (this.errShow || this.errShowTwo || this.errShowThree) return
        let isCheck = this.isCheck()
        if (isCheck) {
          let URL = 'tally/addTally'
          let obj = {
            active_id: this.$route.params.id,
            card_number: this.inputCard,
            sales_amount: this.inputSales,
            deposit_amount: this.inputDeposit
          }
          loadDataPost(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              this.showMess('记账成功')
              this.$route.meta.hasDone = true
              setTimeout(() => {
                this.$router.back()
              }, 1000)
            }
            return
          })
        }
        return false
      },
      justifyBodyHeight () {
        let height = this.$refs.button.$el.clientHeight
        document.body.style.height = (window.screen.availHeight - height) + 'px'
      },
      restoreBodyHeight () {
        document.body.style.height = '100%'
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
    background: $color-white
    .add-box
      padding: 50px 62px 0
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
      .mar-top
        margin 180px 0 42px 0
      .add-input
        display: flex
        align-items: center
        justify-content space-between
        font-size: 30px;/*px*/
        width: 100%
        label
          display: block
          flex: 0 0 auto
        input
          display: block
          height: 88px;/*px*/
          flex: 1
          border: 1px solid $color-c;/*no*/
          padding-left: 40px
          width 0
        div
          padding-left: 22px
          flex: 0 0 auto
  .gray
    background $color-bc
    &.orange
      background $color-orange
</style>
