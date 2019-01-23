<template>
  <div class="authen-set-container">
    <base-header :intercept-back="true" @headerBack="headerBack">
      <div class="special-authen-help" @click="goAuthenHelp">使用帮助</div>
    </base-header>
    <div class="authen-set-wrapper">
      <h2 class="set-title margin-30">采购师提交认证申请商户审核通过即可享受此优惠</h2>
      <h2 class="set-description">
        <b>专属特权</b>
        <span>(采购师)</span>
      </h2>
      <div class="set-percentage">
        <span>特约认证返佣百分比</span>
        <input
          type="text"
          placeholder="1-70"
          v-model="authenRatio"
          @focus="justifyBodyHeight"
          @blur="restoreBodyHeight"
          maxlength="4">%
      </div>
      <div class="commission-description">
        <i class="icon-description"></i>
        <div class="description">
          <p>设置此优惠后，采购师认证通过可在原佣金基础上再累加享受此百分百返佣优惠</p>
          <p>认证佣金金额=（零售底价-直采价）*（1+店铺返佣百分比%）</p>
        </div>
      </div>
      <div class="seperate"></div>
      <div class="set-text">
        <h2 class="set-description">
          <b>特权说明</b>
          <span>*</span>
        </h2>
        <div class="text-area">
        <textarea
          maxlength="100" 
          @focus="justifyBodyHeight"
          @blur="restoreBodyHeight"
          v-model="authenText">
        </textarea>
        <span>60/100</span>
        </div>
      </div>
    </div>
    <base-footer
      ref="button"
      text="提交"
      @footerSubmit="modifyAuthenRatio">
    </base-footer>
    <base-confirm ref="confirm" text="您确认放弃特约认证设置吗？" @confirm="confirmBack"></base-confirm>
  </div>
</template>

<script>
import BaseConfirm from 'base/confirm/confirm'
let text = '专属返佣特权仅开放给认证采购师，点击认证即可进入认证流程，认证申请通过后即可享受特权返佣；此优惠仅限本店使用。此优惠不包含限时抢购、特殊活动商品；最终解释权归商户所有。'
export default {
  name: 'SpecialAuthenSet',
  data () {
    return {
      authenRatio: this.$route.query.ratio || '',
      authenText: this.$route.query.text || text,
      authenId: this.$route.query.id
    }
  },
  methods: {
    headerBack () {
      this.$refs.confirm.show()
    },
    confirmBack () {
      this.$back()
    },
    goAuthenHelp () {
      this.$router.push('/authen-guide')
    },
    validateFiled () {
      if (!this.authenRatio) {
        this.$t('请输入返佣比例')
        return false
      }
      if (!/^[1-9]\d?(.[0-9]{1})?$/.test(this.authenRatio)) {
        this.$t('请输入1-70的数字，可保留一位小数')
        return false
      }
      if (this.authenRatio > 70) {
        this.$t('数字在1~70之间')
        return false
      }
      if (!this.authenText) {
        this.$t('请输入特权说明')
        return false
      }
      return true
    },
    modifyAuthenRatio () {
      if (!this.validateFiled()) return
      let isModify = !!this.authenId
      let url = 'card/addCard'
      let obj = {
        one_discount: this.authenRatio,
        explain: this.authenText,
        id: this.authenId
      }
      if (!isModify) delete obj.id
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (isModify) {
            this.$router.push({ name: 'SpecialAuthen', query: { modify: 1, fromNative: 1 } })
          } else {
            this.$router.push({ name: 'SpecialAuthen', query: { modify: 0, fromNative: 1 } })
          }
          return
        }
        this.$t(res.message)
      })
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
    BaseConfirm
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.authen-set-container
  height 100%
  background #fff
  overflow hidden
  flex-col()
  .special-authen-help
    color #4A90E2
  .authen-set-wrapper
    flex 1
    padding 0 30px
    .set-title
      height 60px
      padding-left 30px
      line-height 60px
      f13()
      color #FF8A00
      background #FFF2E3
    .set-description
      margin 40px 0
      padding-left 2px
      border-left 6px solid #FF8A00;/*no*/
      f18()
      color #333
      span
        color #3F3F3F
        f13()
    .set-percentage
      f16()
      color #000
      margin-bottom 34px
      input
        max-width 140px
        height 60px
        margin-left 5px
        margin-right 5px
        tc()
        color #333
        f13()
        bd(#DFDEDE)
    .commission-description
      flex-f()
      f13()
      color #666
      line-height 36px
      margin-bottom 40px
      .icon-description
        wh(30px)
        margin-top 2px
        margin-right 8px
        bg('icon-desc.png')
      .description
        flex 1
        p:nth-child(1)
          margin-bottom 5px
    .seperate
      height 10px
      margin 0 -30px
      background #F4F4F4
    .set-text
      .set-description
        flex-f-align()
        margin-bottom 20px
        padding-left 5px
        span
          margin-top 14px
          margin-left 2px
          color #f00
      .text-area
        position relative
        font-size 28px
        line-height 40px
        width 692px
        margin 0 auto
        color #CCC
        textarea
          width 100%
          height 294px
          bd(#DFDEDE)
        span
          position absolute
          right 12px
          bottom 8px
          color #999
  .margin-30
    margin 0 -30px
</style>
