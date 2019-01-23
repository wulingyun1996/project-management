<template>
  <div class="identity-container">
    <div class="identity-select-explain" @click="goExplainIdentity">
      <i></i>
      <span>不清楚您的身份，没关系！看看身份说明</span>
    </div>
    <div class="identity-select-guide">
      <img src="./images/img-identity-guide.png" alt="">
      <h3>请根据您的从业内容合理选择您的身份</h3>
      <h4>最多可选择3个</h4>
    </div>
    <div class="identity-type-wrapper">
      <div
        class="identity-type-list"
        v-for="i in 3"
        :key="i">
        <div
          class="identity-type-item"
          v-for="(identity, index) in identityList"
          :key="identity.id"
          @click="selectCurrentIdentity(identity, index)"
          v-if="identity.type === i">
          <img :src="identity.selected ? identity.activatedImg : identity.defaultImg" alt="">
        </div>
      </div>
    </div>
    <div class="identity-button" v-show="isSelectedIdentity" @click="goAuthen">
      <img src="./images/img-next-step.png" alt="">
    </div>
    <base-popup-pass
      v-show="ispassedAuthend"
      @comfirm='goHome'>
    </base-popup-pass>
    <toast v-model="showTips" type="text" position="middle" :time="2000">最多可选择3个</toast>
    <router-view></router-view>
  </div>
</template>

<script>
import BasePopupPass from 'components/popup/popup-pass'
import { nativeClose, invokeNativeMethod, nativeGoHome, invokeNativeAndGetResult } from 'native'
import { inArray, parseJson, toJson, cloneDeep, judgeObjectLen } from 'common'
import { mapState, mapMutations } from 'vuex'
import { Toast } from 'vux'
import identityList from './identity'
const message = {
  message: '您还未完成认证，确定要放弃吗？',
  left: '放弃',
  right: '继续认证'
}
export default {
  name: 'IdentityGuide',
  data () {
    return {
      identityList: cloneDeep(identityList),
      roleInfo: {},
      seletedIdentity: [],
      ispassedAuthend: false,
      showTips: false
    }
  },
  computed: {
    ...mapState(['authenRole']),
    isSelectedIdentity () {
      return !!this.seletedIdentity.length
    },
    // 是否是已选择身份的老用户认证
    isAuthendRole () {
      return this.roleInfo.is_old === 1 && this.roleInfo.audit_status === 2
    },
    isFromAuditingPage () {
      return !!this.$route.query.flag
    }
  },
  created () {
    this.getSavedIdentity()
    nativeClose(message, 0)
    this.queryIdentityRole()
  },
  methods: {
    ...mapMutations(['SET_AUTHEN_ROLE']),
    // 查询是否是新老用户
    queryIdentityRole () {
      let url = 'isOldBuyer'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { audit_status, is_old } = res.data
          if (audit_status === 2 && (is_old === 0 || is_old === 2)) {
            this.ispassedAuthend = true
            if (is_old === 2) invokeNativeMethod('setIsOld', 2)
          }
          if (audit_status === 3 && !this.isFromAuditingPage) {
            this.$router.push('/auditing')
            return
          }
          /* eslint-enable */
          this.roleInfo = res.data
        }
      })
    },
    // 已认证的老用户身份认证
    authenOldIdentity () {
      let url = 'oldBuyerIdentity'
      let obj = {
        title: this.seletedIdentity.join()
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.ispassedAuthend = true
          invokeNativeMethod('navigationItem', JSON.stringify({}))
          invokeNativeMethod('setIsOld', 2)
          return
        }
        this.$t(res.message)
      })
    },
    goAuthen () {
      if (this.isAuthendRole) {
        this.authenOldIdentity()
        return
      }
      let { identityList, seletedIdentity } = this
      let obj = {
        seletedIdentityList: this.identityToList(seletedIdentity, identityList),
        identityList,
        seletedIdentity
      }
      this.SET_AUTHEN_ROLE(obj)
      this.$push('/authen-type')
    },
    // 根据已选角色名，重新排列身份列表
    identityToList (selectedIndentity, list) {
      let arr = []
      selectedIndentity.forEach(item => {
        list.some(identityItem => {
          if (item === identityItem.name) {
            arr.push(identityItem)
            return true
          }
        })
      })
      return arr
    },
    goExplainIdentity () {
      this.$router.push({ name: 'ExplainIdentity' })
    },
    // 选择身份
    selectCurrentIdentity (item, i) {
      let { name, selected } = item
      let { include, index } = inArray(name, this.seletedIdentity)
      if (!include) {
        if (this.seletedIdentity.length === 3) {
          this.showTips = true
          return
        }
        this.seletedIdentity.push(name)
      } else {
        this.seletedIdentity.splice(index, 1)
      }
      item.selected = !selected
      this.identityList.splice(i, 1, item)
    },
    // 获取即时保存的身份
    getSavedIdentity () {
      invokeNativeAndGetResult('nativeReturnData', 'returnIOSSavedContent')
        .then(res => {
          // 预取即时保存身份 - 从首页跳转过来
          if (res) {
            let data = parseJson(res)
            if (judgeObjectLen(data)) {
              let { identityList, seletedIdentity } = data
              this.identityList = identityList
              this.seletedIdentity = seletedIdentity
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          // 预取状态管理中数据 -- 从审核未通过页面跳转过来
          if (this.authenRole) {
            let { identityList, seletedIdentity } = cloneDeep(this.authenRole)
            this.identityList = identityList
            this.seletedIdentity = seletedIdentity
          }
        })
    },
    goHome () {
      if (!this.isAuthendRole) invokeNativeMethod('setIdentityAuth', 2)
      nativeGoHome()
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'IdentitySelect') {
        nativeClose(message, 0)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    let { identityList, seletedIdentity } = this
    let savedIdentity = {
      identityList,
      seletedIdentity
    }
    invokeNativeMethod('nativeSaveData', toJson(savedIdentity))
    next()
  },
  components: {
    BasePopupPass,
    Toast
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.identity-container
  height 100%
  overflow hidden
  background url('./images/bg-identity.png') no-repeat top 64px center #FDF8B9
  background-size 100% auto
  .identity-select-explain
    flex-center()
    height 64px
    f12()
    color $color-orange
    i
      wh(24px)
      bg('icon-warning.png')
      margin-right 10px
  .identity-select-guide
    img
      display block
      width 440px
      height 72px
      margin 44px auto 20px
    h3
      width 480px
      height 44px
      line-height 44px
      margin 0 auto 24px
      f13()
      tc()
      color #8B572A
      background #FEE56E
      border-radius(50px)
    h4
      width 260px
      height 56px
      line-height 56px
      margin 0 auto
      f16()
      tc()
      color #E7691B
      background #FEE56E
      border-radius(50px)
  .identity-type-wrapper
    margin 40px 0
    .identity-type-list
      flex-center()
      & + .identity-type-list
        margin-top -20px
      .identity-type-item
        & + .identity-type-item
          margin-left 30px
      img
        width 164px
        height 180px
  .identity-button
    width 180px
    height 188px
    margin 0 auto
    img
      wh(100%)
.vux-toast
  .weui-toast
    width max-content
</style>
