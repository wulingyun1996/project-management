<template>
  <div class="alliance-add-staff">
     <base-header>
      <div class="special-authen-help" @click="goAuthenHelp">操作指南</div>
    </base-header>
    <div class="alliance-wrapper">
      <scroll class="alliance-container">
        <div>
           <div class="form-group account">
            <label for="name">账户名</label>
              <img src="./images/username.png" alt="">
              <input
                id="name"
                type="text"
                placeholder="请输入2-6个文字"
                v-model.trim="accountName"
                maxlength="6"
                @focus="justifyBodyHeight"
                @blur="restoreBodyHeight">
          </div>
          <!-- <p class="prompt-mes">2-6个文字，员工账号不支持修改，请仔细考虑</p> -->
          <div class="form-group">
            <label for="passwordone">密码</label>
            <img src="./images/password.png" alt="">
            <input
              id="passwordone"
              type="password"
              placeholder="请设置6~16位登录密码"
              v-model.trim="passwordOne"
              maxlength="16"
              @focus="justifyBodyHeight"
              @blur="restoreBodyHeight">
          </div>
          <div class="form-group">
            <label for="passwordtwo">确认密码</label>
            <img src="./images/password.png" alt="">
            <input
              id="passwordtwo"
              type="password"
              placeholder="请重复输入密码"
              v-model.trim="passwordTwo"
              maxlength="16"
              @focus="justifyBodyHeight"
              @blur="restoreBodyHeight">
            <!-- <input id="passwordtwo" type="text" placeholder="请重复输入密码" v-model.trim="passwordTwo" maxlength="16"> -->
          </div>
          <div class="jurisdiction">
            <div class="line"></div>
            <div class="staff-jurisdiction">员工权限</div>
            <div class="staff-check" @click="allCheck">
              <div class="check-img" :class="{ 'checkActive': isCheckShow }"></div>
              <p>全部选择</p>
            </div>
            <!-- <div class="jurisdiction-info">
              <span>员工权限</span>
              <span @click="allCheck">全选选择</span>
            </div> -->
            <div class="jurisdiction-list">
              <div :class="{linechecked: value.checked}" v-for="(value, index) in permissionList" :key="value.id" @click="checked(index)">
                <!-- <span :class="{nochecked: !item.checked, ischecked: item.checked}"></span> -->
                {{ value.display_name }}
              </div>
            </div>
          </div>
         
        </div>
      </scroll>
    </div>
    <div ref="button" class="button_submit" :class="{ active: isActive }" @click="submitInfo">
      确认新增
    </div>
  </div>
</template>

<script>
import { loadData, STATUS_OK } from 'api/common'
import Jsencrypt from 'assets/util/encrypt'
import Scroll from 'base/scroll/scroll'
import { nativeBackAndJump } from 'navtive'
import buutton from 'base/foot-btn/foot-btn'
const message = {
  right: [
    {
      title: '操作指南',
      function: 'checkGuide()',
      name: 'operationsGuide'
    }
  ]
}
export default {
  name: 'addStaff',
  data () {
    return {
      accountMobile: '',
      accountName: '',
      passwordOne: '',
      passwordTwo: '',
      jurisdiction: [],
      permissionList: [],
      isCheckShow: false
    }
  },
  computed: {
    isActive () {
      return this.jurisdiction.length && this.accountName && this.passwordOne && this.passwordTwo
    },
    identity () {
      return this.$route.name === 'ShopAddStaff' ? 0 : 1
    }
  },
  created () {
    this.getPermission()
    let _router
    if (this.identity) {
      _router = {
        router: this.$router,
        path: '/alliance-add-staff/alliance-operation-guide'
      }
    } else {
      _router = {
        router: this.$router,
        path: '/shop-add-staff/shop-operation-guide'
      }
    }
    nativeBackAndJump(message, _router, 1)
  },
  methods: {
    submitInfo () {
      if (!this.isActive) return
      let regName = /^[\u4e00-\u9fa5]{2,6}$/
      let regAccRes = regName.test(this.accountName)
      let regPass = /[a-zA-Z0-9!@#$%^&*()_?<>{}.-]{6,16}/
      let regPassRes = regPass.test(this.passwordOne)
      if (this.accountName.length < 2) {
        this.$vux.toast.text('用户名2-6位', 'middle')
        return false
      }
      if (!regAccRes) {
        this.$vux.toast.text('用户名只能输入汉字', 'middle')
        return false
      }
      if (this.passwordOne.length < 6 || this.passwordOne.length > 16) {
        this.$vux.toast.text('密码长度为6-16位', 'middle')
        return false
      }
      if (!regPassRes) {
        this.$vux.toast.text('密码仅限数字，英文大小写组合', 'middle')
        return false
      }
      if (this.passwordOne !== this.passwordTwo) {
        this.$vux.toast.text('密码不一致', 'middle')
        return false
      }
      this.addStaff()
      this.jurisdiction = []
    },
    getPermission () {
      let url = 'UnionStaff/getRole'
      let obj = {
        identity: this.identity
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          res.data.permissions.forEach(item => {
            item.checked = false
          })
          this.accountMobile = res.data.mobile + ':'
          this.permissionList = res.data.permissions
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    addStaff () {
      let url = 'UnionStaff/addStaff'
      let obj = {
        permission_id: this.jurisdiction.join(),
        name: this.accountMobile + this.accountName,
        password: Jsencrypt(this.passwordOne),
        identity: this.identity
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          if (this.identity) {
            this.$router.push({ path: '/alliance-staff-list', query: { path: '/alliance-staff-list?fromNative=1' } })
          } else {
            this.$router.push({ path: '/shop-staff-list', query: { path: '/shop-staff-list?fromNative=1' } })
          }
          return
        }
        if (res.message === '员工账号已注册') {
          this.jurisdiction = []
          this.permissionList.forEach(item => {
            item.checked = false
          })
          this.accountName = ''
          this.passwordOne = ''
          this.passwordTwo = ''
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    checked (index) {
      let newArry = []
      let currentItem = this.permissionList[index]
      let flag = currentItem.checked
      currentItem.checked = !flag
      this.permissionList.splice(index, 1, currentItem)
      if (currentItem.checked === true) {
        newArry.push(currentItem.id)
        newArry.forEach(item => {
          if (this.jurisdiction.indexOf(item) === -1) {
            this.jurisdiction.push(item)
          }
        })
      }
      if (currentItem.checked === false) {
        this.jurisdiction.splice(this.jurisdiction.findIndex(item => item === currentItem.id), 1)
      }
    },
    allCheck () {
      if (this.jurisdiction.length === this.permissionList.length) {
        this.jurisdiction = []
        this.permissionList.forEach(item => {
          item.checked = false
        })
        this.isCheckShow = false
      } else {
        this.jurisdiction = []
        this.permissionList.forEach(item => {
          item.checked = true
          this.jurisdiction.push(item.id)
        })
        this.isCheckShow = true
      }
    },
    goAuthenHelp () {
      if (this.identity) {
        this.$router.push('/alliance-operation-guide')
      } else {
        this.$router.push('/shop-operation-guide')
      }
    }
  },
  watch: {
    'jurisdiction' (val) {
      let length = val.length
      if (length < this.permissionList.length) {
        this.isCheckShow = false
      }
      if (length === this.permissionList.length) {
        this.isCheckShow = true
      }
    }
  },
  components: {
    Scroll,
    buutton
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.special-authen-help
    color #4A90E2
    font-size 28px
.alliance-add-staff
  background-color #fff
  height 100%
  position relative
  flex-col()
  overflow hidden
  font-size 28px;/*px*/
  color $color-3
  .alliance-wrapper
    flex 1
    padding 0 28px
    overflow hidden
  .alliance-container
    height 100%
    >div
      overflow hidden
  .jurisdiction
    // display flex
    margin-top 60px
    margin-bottom 26px
    position relative
    .staff-check
      display flex
      align-items center
      margin-top 46px
      margin-left 20px
      .check-img
        width 36px
        height 36px
        margin-right 16px
        bg('icon-no-check.png')
        &.checkActive
          bg('icon-check.png')
      p
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #FF8A00
        letter-spacing: 0
    .line
      width 100%
      height 5px
      border-top 3px dashed #F5A623
    .staff-jurisdiction
      width 200px
      text-align center
      font-size 32px
      color #4A4A4A
      position absolute
      left 50%
      top: -15px;
      margin-left: -100px;
      background-color #fff
    .jurisdiction-list
      margin-top 50px
      overflow hidden
      div
        float left
        width 30%
        margin-left 20px
        // border 1px solid #FF8A00
        display flex
        height 60px
        font-size 28px
        color #4a4a4a
        line-height 60px
        margin-bottom 30px
        border-radius 10px
        background-color #f8f8f8
        justify-content center
        .ischecked
          width 36px
          height 36px
          margin-right 20px
          background url('./checked.png') no-repeat center
          background-size 100%
        .nochecked
          width 36px
          height 36px
          margin-right 20px
          background url('./nochecked.png') no-repeat center
          background-size 100%
      .linechecked
        // border 1px solid #FF8A00
        bd(#FF8A00)
        color #FF8A00
  .form-group
    display flex
    align-items center
    margin-bottom 40px
    height 70px;
    &.account
      margin-bottom 40px
      margin-top 60px
    img
      position relative
      left 45px
      width 36px
      height 40px
    label
      width 164px;
      height inherit
      color #4A4A4A
      font-size 28px
      line-height 68px
      margin-right 28px
      text-align right
    input
      display block
      width 540px
      height inherit
      bd($color-c)
      padding-left 70px
      border-radius 8px;/*px*/
      font-size 24px;/*px*/
      color $color-0
    .account-name
      width 540px
      height inherit
      bd($color-c, width = 1px)
      // padding-left 18px
      border-radius 8px;/*px*/
      font-size 24px;/*px*/
      color $color-0
      position relative
      .account-mobile
        height inherit
        position absolute
        line-height 68px
        border 1px solid transparent;/*no*/
      input
        display block
        width 100%
        height inherit
        // padding-left 168px
  .prompt-mes
    font-size 20px;/*px*/
    color $color-9
    line-height 28px
    padding-left 190px
    margin-bottom 40px
.button_submit
  width 100%
  height 100px;
  line-height 100px;
  // position fixed
  // left 0
  // right 0
  // bottom 0
  background $color-bc
  color #fff
  font-size 36px;/*px*/
  text-align center
  &.active
    background $color-orange
</style>
