<template>
  <div class="identity-container">
    <base-header :is-show-back="false"></base-header>
    <div class="identity-wrapper">
      <div class="identity-select-explain" @click="goExplainIdentity">
        <i></i>
        <span>不清楚您的身份，没关系！看看身份说明</span>
      </div>
      <div class="identity-select-guide">
        <img src="./images/img-padding.png" alt="">
        <h3>采购师身份支持多选，请根据您的从业内</h3>
        <h4>容合理选择您的身份,最多可选择3个</h4>
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
        <img src="./images/img-confirm.png" alt="">
      </div>
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
import { invokeNativeMethod, nativeGoHome } from 'native'
import { inArray, cloneDeep } from 'common'
import { Toast } from 'vux'
import identityList from './identity'
export default {
  name: 'OldUserIdentityGuide',
  data () {
    return {
      identityList: cloneDeep(identityList),
      seletedIdentity: [],
      ispassedAuthend: false,
      showTips: false,
      // 是否是八月份以后注册的用户，默认为 是，值为 0
      isOlder: 0
    }
  },
  computed: {
    isSelectedIdentity () {
      return !!this.seletedIdentity.length
    }
  },
  created () {
    this.queryIdentityRole()
  },
  methods: {
    queryIdentityRole () {
      let url = 'isOldBuyer'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { title, is_old } = res.data
          if (is_old !== 1) {
            this.setSelectedIdentity(title)
            this.seletedIdentity = title
            return
          }
          this.isOlder = is_old
          /* eslint-enable */
        }
      })
    },
    goAuthen () {
      let url = 'oldBuyerIdentity'
      let obj = {
        title: this.seletedIdentity.join()
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.ispassedAuthend = true
          invokeNativeMethod('setIsNew', 1)
          // if (this.isOlder) {
          //   invokeNativeMethod('setIsOld', 2)
          // } else {
          //   invokeNativeMethod('setIsNew', 1)
          // }
          return
        }
        this.$t(res.message)
      })
    },
    goExplainIdentity () {
      this.$router.push({ name: 'OldUserExplainIdentity' })
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
    // 设置已选身份
    setSelectedIdentity (selectedIndentity) {
      selectedIndentity.forEach(item => {
        this.identityList.forEach(identityItem => {
          if (item === identityItem.name) {
            identityItem.selected = true
          }
        })
      })
    },
    goHome () {
      nativeGoHome()
    }
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
  flex-col()
  .identity-wrapper
    flex 1
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
      width max-content
      height 44px
      line-height 44px
      padding 0 10px
      margin 0 auto 24px
      f13()
      tc()
      color #8B572A
      background #FEE56E
      border-radius(50px)
    h4
      width max-content
      height 56px
      line-height 56px
      padding 0 10px
      margin 0 auto
      font-weight 700
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
