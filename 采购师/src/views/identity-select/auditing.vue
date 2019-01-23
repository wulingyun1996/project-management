<template>
  <div class="audite-container personal-bg">
    <div class="no-pass">
      <div class="head-pic">
        <img src="./images/img-auditing.png" alt="">
      </div>
      <h1>认证未通过</h1>
      <h2>原因：{{ rejectReason }}</h2>
      <p>很抱歉，您申请的采购师身份认证审核未通过，</p>
      <p>如有疑问请拨打 {{ telePhone }}</p>
      <div class="btn-apply" @click="modifyStuff">重新申请认证</div>
    </div>
  </div>
</template>

<script>
import { invokeNativeMethod, hiddenNativeBackArrow } from 'native'
import { mapMutations } from 'vuex'
import { cloneDeep } from 'common'
import identityList from './identity'
export default {
  data () {
    return {
      telePhone: '',
      rejectReason: ''
    }
  },
  created () {
    hiddenNativeBackArrow()
    invokeNativeMethod('setIdentityAuth', 3)
    this.getAuditeStatus()
    this.queryTel()
  },
  methods: {
    ...mapMutations(['SET_AUTHEN_ROLE']),
    getAuditeStatus () {
      let url = 'auditResult'
      this.$http(url).then((res) => {
        if (res.code === this.$ok) {
          this.rejectReason = res.data.reject_reason
          let obj = {
            identityList: this.setSelectedIdentity(res.data.title),
            seletedIdentity: res.data.title
          }
          this.SET_AUTHEN_ROLE(obj)
        }
      })
    },
    // 查询客服电话
    queryTel () {
      let url = 'home/getCustomerInfo'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.telePhone = res.data.service_phone
        }
      })
    },
    // 设置已选身份
    setSelectedIdentity (selectedIndentity) {
      let list = cloneDeep(identityList)
      selectedIndentity.forEach(item => {
        list.forEach(identityItem => {
          if (item === identityItem.name) {
            identityItem.selected = true
          }
        })
      })
      return list
    },
    modifyStuff () {
      // flag --- 只要是从审核未通过页面跳转到身份选择页面，均不需要再重定向到本页面
      this.$router.push({ path: '/identity-select', query: { flag: 1 } })
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.audite-container
  height 100%
  f14()
  background $color-white
  &.personal-bg
    bg('bg1.png')
  &.company-bg
    bg('bg2.png')
  .is-auditing
    height 100%
    flex-col()
    align-items center
    padding-top 70px
    .audite-pic
      width 172px
      height 172px
      margin-bottom 28px
      border-radius(50%)
      overflow hidden
      img
        width 100%
        height 100%
        display block
    .audite-info
      width 100%
      height 40px
      line-height 40px
      padding-left 260px
      color $color-0
      flex-f()
      &:nth-child(even)
        margin-bottom 20px
        i
          width 32px
          height 32px
      &:nth-child(odd)
        margin-bottom 132px
      i
        width 28px
        height 40px
        margin-right 16px
        &.personal-name
          bg('name1.png')
        &.company-name
          bg('name2.png')
        &.personal-pos
          bg('position1.png')
        &.company-pos
          bg('position2.png')
    h1
      color $color-6
      line-height 36px
      margin-bottom 24px
    h2
      color $color-9
      f12()
      line-height 36px
  .no-pass
    height 100%
    f16()
    flex-col()
    align-items center
    padding-top 110px
    .head-pic
      width 164px
      height 164px
      border-radius(50%)
      overflow hidden
      margin-bottom 36px
      img
        width 100%
        height 100%
        display block
    h1
      color $color-0
      line-height 36px
      margin-bottom 24px
    h2
      width 100%
      padding 0 80px
      color $color-orange
      line-height 40px
      margin-bottom 80px
      word-break break-all
      tc()
    p
      width 100%
      line-height 56px
      padding-left 80px
      color $color-6
      f14()
      &:nth-child(odd)
        margin-bottom 160px
    .btn-apply
      width 360px
      height 88px
      tc()
      line-height 88px
      color $color-white
      background $color-orange
      border-radius(8px)
</style>
