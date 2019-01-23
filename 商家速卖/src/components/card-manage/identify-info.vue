<template>
  <div class="identify-info">
    <div class="tip">
      采购师提交认证申请商户审核通过即可享受此优惠
    </div>
    <div class="freedom">
      <div class="title">
        <span></span>
        <span>专属特权</span>
        <span>(采购师)</span>
      </div>
      <div class="input">
        <span>特约认证返佣百分比</span>
        <input type="text" @blur="check" ref="input" v-model="info.ratio" maxlength="4" @input="input"><span>%</span>
      </div>
      <div class="ratio">
        <span>百分比数值区间为（1%-70%）</span>
      </div>
      <div class="tips">
        设置此优惠后，采购师认证通过可在原佣金基础上再累加享受此百分百返佣优惠
      </div>
      <div class="calc">
        认证佣金金额 = （零售底价-原直采价）*（1+店铺返佣百分比%）
      </div>
    </div>
    <div class="explain">
      <div class="title">
        <span></span>
        <span>特权说明</span>
        <span style="color: #FF0000;margin: 0;">*</span>
      </div>
      <div class="text">
        <textarea name="" id="" cols="30" rows="10" v-model="info.text" maxlength="100"
        >
        </textarea>
        <span>{{info.text.length}}/100</span>
      </div>
    </div>
    <footer @click="submit">
      提交
    </footer>
  </div>
</template>

<script>
import { nativeBackBase } from 'api/init'
import {dev} from 'common/js/dev'
export default {
  data () {
    return {
      info: {
        ratio: '1',
        text: '专属返佣特权仅开放给认证采购师，点击认证即可进入认证流程，认证申请通过后即可享受特权返佣；此优惠仅限本店使用。此优惠不包含限时抢购、特殊活动商品；最终解释权归商户所有。'
      }
    }
  },
  mounted () {
    window.nav_alert_back = this.nav_alert_back
    window.back = this.back
    this.nav()
    if (this.$route.query.one_discount) {
      this.info.ratio = this.$route.query.one_discount
      this.info.text = this.$route.query.explain
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    nav() {
      let param = {
        'left': [{
          'title': 'back',
          'function': 'nav_alert_back()' // 默认
        }]
      }
      nativeBackBase(param)
    },
    nav_alert_back () {
      let params = {
        'title': '提示',
        'message': '您确认放弃特约卡设置吗?',
        'confirm': 'back()',
        'cancel': ''
      }
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeAlterBack(JSON.stringify(params))
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeAlertBack.postMessage(params)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    input () {
      if (this.info.ratio.length === 1) {
        if (this.info.ratio === '0') {
          this.info.ratio = '1'
        }
      }
    },
    submit () {
      if (this.info.ratio.trim() === '') {
        this.$vux.toast.text('请输入返佣比例', 'middle')
        return
      }
      if (!this.check()) {
        return
      }
      if (!this.$route.query.one_discount) {
        this.$http('card/addCard', {one_discount: this.info.ratio, explain: this.info.text}).then(res => {
          if (res.code === 200) {
            this.$vux.toast.text('添加成功', 'middle')
            this.$router.back()
          } else {
            this.$vux.toast.text(res.message, 'middle')
          }
        })
      } else {
        this.$http('card/addCard', {one_discount: this.info.ratio, explain: this.info.text, id: this.$route.query.id}).then(res => {
          if (res.code === 200) {
            this.$vux.toast.text('修改成功', 'middle')
            this.$router.back()
          } else {
            this.$vux.toast.text(res.message, 'middle')
          }
        })
      }
    },
    check () {
      if (!/^[1-9]\d?$|^[1-9]\d?\.[1-9]$|0\.[1-9]$/.test(this.info.ratio)) {
        this.$vux.toast.text('请输入0-70的数字，可保留一位小数', 'middle')
        return false
      }
      if (this.info.ratio > 70) {
        this.$vux.toast.text('数字在1~70之间', 'middle')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="stylus" scoped>
.identify-info
  height 100%
  background #FFF
.tip
  background #FFEEDA
  height 60px
  line-height 60px
  color #FF8A00
  padding-left 30px
footer
  position fixed
  width 100%
  height 100px
  line-height 100px
  bottom 0
  left 0
  color #FFF
  background #FF8A00
  font-size 32px
  text-align center
.title
  display flex
  align-items center
  margin-bottom 24px
  span:first-child
    width 2px;/*no*/
    height 26px;
    background #FF8A00
    margin-left 30px
    margin-right 12px
  span:nth-child(2)
    font-size 28px
    color #333
    line-height 40px
  span:last-child
    color #999
    margin-left 10px
    line-height 40px
.freedom
  padding 26px 0
  border-bottom 20px solid #F4F4F4
  .ratio
    padding-left 48px
    margin-top 20px
    span:last-child
      color #999
      line-height 40px
  .input
    padding-left 48px
    margin-top 22px
    span:nth-child(1)
      font-size 28px
      color #333
      height 72px
      display inline-block
      line-height 72px
    input
      margin-left 16px
      width 200px
      height 72px
      border 1px solid #CCC;/*no*/
      border-radius 2px;/*no*/
    span
      vertical-align bottom
  .tips
    color #999
    line-height 34px
    padding-left 68px
    padding-right 74px
    margin-top 44px
  .calc
    margin-top 28px
    text-align center
    color #FF0000
.explain
  padding-top 26px
  .text
    margin-top 14px
    position relative
    font-size 28px
    line-height 40px
    width 692px
    margin 0 auto
    color #CCC
    textarea
      width 100%
      height 294px
      border 1px solid #CCC
    span
      position absolute
      right 12px
      bottom 8px
</style>
