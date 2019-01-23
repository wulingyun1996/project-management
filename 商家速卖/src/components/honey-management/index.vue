<template>
  <div class="honey-management-container">
    <base-header>
      <div class="special-authen-help" @click="gotoDetail">蜂蜜明细</div>
    </base-header>
    <div class="honey-magges-rewper">
        <div class="honey-management-info">
          <div class="honey-info-meager">
              <div class="honey-images">
                <img src="./images/honey.png" alt="">
              </div>
              <div class="name">我的蜂蜜：</div>
              <div class="price">{{ honey }}</div>
          </div>
          <div class="rule" @click="rule">蜂蜜规则</div>
        </div>
        <div class="honey-shop">
          <div class="shop-left">
            <img src="./images/shopping.png" alt="">
            <span @click="gotoShop">蜂蜜商品</span>
          </div>
          <div class="shop-right">
            <img src="./images/convert.png" alt="">
            <span @click="gotoinfo">兑换记录</span>
          </div>
        </div>
        <div class="honey-management-allocation">
          <p>蜂蜜配置</p>
          <input
            type="text"
            placeholder="请输入采购师手机号码 "
            v-model.trim="phone"
            maxlength="11"
            @blur="restoreBodyHeight"
          >
          <div class="allocation-button">
            <div class="button-left" @click="givehoney" :class="{ leftActive: isActive }">赠送蜂蜜</div>
            <div class="button-right" @click="deducthoney" :class="{ rightActive: isActive }">扣除蜂蜜</div>
          </div>
        </div>
    </div>

    <!-- <div ref="button" class="button_submit">
    </div> -->
  <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
      <div class="icon-top"></div>
      <p>赠送蜂蜜后将从</p>
      <p>您的蜂蜜账户中等额扣除</p>
      <input
        id="honey"
        type="number"
        placeholder="请输入赠送的蜂蜜"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        v-model.trim="honeyNumber"
        @focus="justifyBodyHeight"
        @blur="restoreBodyHeight">
        <div class="hint" v-show="hintInfo">
          <img src="./images/stop.png" alt="">
          {{text}}
        </div>
      <div class="fotButton">
        <div class="buttonLeft" @click="dropped">取消</div>
        <div class="buttonRight" @click="comfin" :class="{ buttonRightActive: buttonActive }">确认</div>
      </div>
    </base-senior-popup>


    <!-- 扣除的弹框 -->
    <base-senior-popup ref="deductPopup" height="auto" class="alliance-popup">
      <div class="icon-top"></div>
      <p>扣除采购师的蜂蜜</p>
      <p>将等额增加到您的蜂蜜账户中</p>
      <input
        id="honey"
        type="number"
        placeholder="请输入扣除的蜂蜜数"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        v-model.trim="deductNumber"
        @focus="justifyBodyHeight"
        @blur="restoreBodyHeight">
        <div class="hint" v-show="hintInfo">
          <img src="./images/stop.png" alt="">
          {{text}}
        </div>
      <div class="fotButton">
        <div class="buttonLeft" @click="dropped">取消</div>
        <div class="buttonRight" @click="comfing" :class="{ buttonRightActive: buttonActive }">确认</div>
      </div>
    </base-senior-popup>


    <base-senior-popup ref="successPopup" height="auto" class="success-popup">
      <img src="./images/success.png" alt="">
      <p>赠送成功啦</p>
      <p @click="isOk">知道了</p>
    </base-senior-popup>


    <base-senior-popup ref="makePopup" height="auto" class="success-popup">
      <img src="./images/success.png" alt="">
      <p>成功发起扣除，待采购师确认</p>
      <p @click="makeOk">知道了</p>
    </base-senior-popup>
    <router-view></router-view>
  </div>
</template>

<script>
import buutton from 'base/foot-btn/foot-btn'
export default {
  data () {
    return {
      phone: '',
      honey: 0,
      honeyNumber: '',
      deductNumber: '',
      hintInfo: false,
      text: '',
      messageNumber: ''
    }
  },
  // mounted () {
  //   const h = document.body.scrollHeight
  //   console.log(h)
  //   window.onresize = function () {
  //     if (document.body.scrollHeight < h) {
  //       document.body.style.height = h
  //     }
  //   }
  // },
  created () {
    this.getData()
  },
  computed: {
    isActive () {
      if (this.phone !== '') {
        return true
      } else {
        return false
      }
    },
    buttonActive () {
      if (this.honeyNumber !== '' || this.deductNumber !== '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getData () {
      this.$http('manage/info').then(res => {
        if (res.code === this.$ok) {
          this.honey = res.data.credits
        }
      })
    },
    getManage () {
      let url = 'manage/cgsInfo'
      let obj = {
        mobile: this.phone
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.messageNumber = res.data.credits
        }
      })
    },
    givehoney () {
      if (this.phone === '') {
        return
      }
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!myreg.test(this.phone)) {
        this.$t('手机号格式不正确')
      } else {
        this.$refs.alliancePopup.show()
      }
    },
    deducthoney () {
      if (this.phone === '') {
        return
      }
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!myreg.test(this.phone)) {
        this.$t('手机号格式不正确')
      } else {
        this.$refs.deductPopup.show()
        this.getManage()
      }
    },
    comfin () {
      if (!this.preventMoreClick) return
      // if (typeof (this.honeyNumber) !== 'number') {
      //   this.text = '输入的内容必须是数字'
      //   this.hintInfo = true
      //   return
      // }
      if (this.honeyNumber === '') {
        return
      }
      if (this.honeyNumber < 1) {
        this.text = '蜂蜜数不能小于1，请重新输入。'
        this.hintInfo = true
        return
      }
      if (this.honeyNumber % 1 !== 0) {
        this.text = '蜂蜜需为整数，请重新输入。'
        this.hintInfo = true
        return
      }
      if (this.honeyNumber > this.honey) {
        this.text = '蜂蜜数不能大于您的蜂蜜余额，请重新输入。'
        this.hintInfo = true
        return
      }
      let obj = {
        mobile: this.phone,
        credits: this.honeyNumber
      }
      this.preventMoreClick = false
      setTimeout(() => {
        this.preventMoreClick = true
      }, 1000)
      this.$http('manage/give', obj).then(res => {
        if (res.code === this.$ok) {
          this.$refs.alliancePopup.hide()
          this.honeyNumber = ''
          this.phone = ''
          this.$refs.successPopup.show()
          this.getData()
        }
        if (res.message === '采购师不存在') {
          this.$refs.alliancePopup.hide()
          this.honeyNumber = ''
          this.phone = ''
          this.$t('该用户非认证采购师')
        }
      })
    },
    comfing () {
      if (!this.preventMoreClick) return
      if (this.deductNumber === '') {
        return
      }
      if (this.deductNumber < 1) {
        this.text = '蜂蜜数不能小于1，请重新输入。'
        this.hintInfo = true
        return
      }
      if (this.deductNumber % 1 !== 0) {
        this.text = '蜂蜜需为整数，请重新输入。'
        this.hintInfo = true
        return
      }
      // if (this.deductNumber > this.messageNumber) {
      //   this.text = '蜂蜜数不能大于采购师的蜂蜜余额，请重新输入。'
      //   this.hintInfo = true
      //   return
      // }
      let obj = {
        mobile: this.phone,
        credits: this.deductNumber
      }
      this.preventMoreClick = false
      setTimeout(() => {
        this.preventMoreClick = true
      }, 1000)
      this.$http('manage/reduce', obj).then(res => {
        if (res.code === this.$ok) {
          this.$refs.deductPopup.hide()
          this.deductNumber = ''
          this.phone = ''
          this.$refs.makePopup.show()
          // this.$t('成功发起扣除，待采购师确认')
        }
        if (res.code === 600) {
          this.text = res.message
          this.hintInfo = true
        }
        if (res.code === 400) {
          this.text = res.message
          this.hintInfo = true
        }
        if (res.message === '采购师不存在') {
          this.$t('该用户非认证采购师')
          this.deductNumber = ''
          this.phone = ''
          this.$refs.deductPopup.hide()
        }
      })
    },
    gotoDetail () {
      this.$router.push('/honey-detail')
    },
    gotoShop () {
      this.$router.push('/honey-manage')
    },
    gotoinfo () {
      this.$router.push('/exchange-record')
    },
    rule () {
      this.$router.push('/honey-management/honey-rule')
    },
    hideHelpPopup () {
      this.$refs.rulePopup.hide()
    },
    dropped () {
      this.$refs.alliancePopup.hide()
      this.$refs.deductPopup.hide()
      this.text = ''
      this.hintInfo = false
      this.honeyNumber = ''
      this.deductNumber = ''
    },
    isOk () {
      this.$refs.successPopup.hide()
      this.phone = ''
      this.honeyNumber = ''
    },
    makeOk () {
      this.$refs.makePopup.hide()
    },
    restoreBodyHeight () {
      window.scroll(0, 0)
    }
  },
  components: {
    buutton
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.honey-management-container
  flex-col()
  height 100%
  background-color #fff
  overflow hidden
  .honey-magges-rewper
    flex 1
    overflow hidden
  .button_submit
    width 100%
    height 100px
    // background-color #f00
  .special-authen-help
    font-size: 28px
    color: #4A90E2
  .honey-management-info
    width 100%
    height 276px
    bg('bg.png')
    position relative
    .honey-info-meager
      width 370px
      height 130px
      line-height 130px
      text-align center
      position absolute
      left 50%
      margin-left -185px
      top 52px
      border-radius 10px
      background: rgba(255,255,255,0.30)
      overflow hidden
      .honey-images
        float left
        margin-top 15px
        margin-left 40px
        img
          width 38px
          height 64px
      .name
        float left
        margin-top 5px
        margin-left 10px
        font-size 26px
        color #000000
      .price
        float left
        font-size 48px
        color #FF8A00
    .rule
      position absolute
      right 24px
      top 24px
      font-size 26px
      color #D0021B 
  .honey-shop
    position absolute
    top 300px
    left 20px
    width 702px
    height 110px
    background: #FFFFFF
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.50)
    border-radius: 10px
    overflow hidden
    .shop-left
      float left
      width 50%
      height 100%
      line-height 110px
      font-size 28px
      color #E24A4A
      img
        width 30px
        height 32px
        vertical-align middle
        margin-top -10px
      text-align center
    .shop-right
      float left
      width 50%
      height 100%
      line-height 110px
      text-align center
      font-size 28px
      color #FF8A00
      img
        width 30px
        height 32px
        margin-top -10px
        vertical-align middle
  .honey-management-allocation
    margin-top 100px
    padding 0 20px
    p
      height 40px
      line-height 40px
      color $color-3
      font-size 30px
    input
      height 80px
      width 100%
      border-top none
      border-left none
      border-right none
      bd-b(#f4f4f4)
      margin-top 20px
      padding-left 20px
    .allocation-button
      margin-top 40px
      margin-left 130px
      overflow hidden
      .button-left
        width 200px
        float left
        height 64px
        line-height 64px
        text-align center
        color #ccc
        font-size 28px
        border-radius 200px
        margin-left 120px
        bd(#ccc)
      .button-right
        width 200px
        float left
        height 64px
        text-align center
        line-height 64px
        color #ccc
        font-size 28px
        margin-left 28px
        border-radius 200px
        bd(#ccc)
      .leftActive
        color #FF8A00
        bd(#FF8A00)
        cursor pointer
      .rightActive
        color #FF304A
        bd(#FF304A)
        cursor pointer
  .alliance-popup
    >div
      width 540px!important
      // padding 128px 52px 10px 52px
      padding-top 128px
      border-radius(24px)
      overflow unset
      text-align center
      position relative
      p
        f14()
        color #666666
        line-height 44px
        &:nth-child(1)
          margin-bottom 5px
      .icon-top
        position absolute
        left 50%
        transform translateX(-50%)
      .icon-top
        top -85px
        width 220px
        height 196px
        bg('bell.png')
      input
        height 70px
        width 300px!mportant
        bd(#FF8A00)
        border-radius 8px
        padding-left 10px
        margin-top 30px
      .hint
        margin-top 15px
        width 400px
        color #D0021B
        font-size 24px
        margin-left 75px
        // text-align left
        img
          width 20px
          height 20px
      .fotButton
        // position absolute
        // bottom 20px
        margin-top 40px
        // margin-left -10px
        width 100%
        height 100px
        bd-t(#f4f4f4, width = 1px)
        overflow hidden
        .buttonLeft
          float left
          width 50%
          line-height 100px
          text-align center
          color #999999
          bd-r(#f4f4f4, width = 1px)
          box-sizing border-box
          // border-radius 15px
          font-size 28px
        .buttonRight
          float left
          width 50%
          line-height 100px
          border-radius 15px/
          text-align center
          color #999999
          font-size 28px
        .buttonRightActive
          color #4A90E2
          border-radius 15px
          // bd(#4A90E2)
  .success-popup
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      padding 0 30px
      img
        display block
        margin 0 auto
        margin-top 36px
        margin-bottom 26px
      p
        color #333333
        line-height 50px
        font-size 30px
        margin-bottom 65px
      p:last-child
        color #4A90E2
        height 50px
        padding-top 30px
        bd-t(#F4F4F4)
  .rule-popup
    >div
      position relative
      width 500px!important
      img
        width 100%
        height 100%
        display block
      .help-close
        position absolute
        wh(60px)
        left 50%
        transform translateX(-50%)
        bottom -80px
        border-radius(50%)
        bg('icon-close.png')
</style>
