<template>
  <div class="staff-detail-container">
    <base-header>
      <div class="special-authen-help" @click="goAuthenHelp">操作指南</div>
    </base-header>
    <div class="staff-detail">
      <div class="staff-desc">
        <p>
          <img src="./images/accounts.png" alt="">
          账户名：</p>
        <p>
          <img src="./images/Power.png" alt="">
          岗位权限：</p>
      </div>
      <div class="staff-content">
        <p class="staff-list-name">
          <span class="staff-info">
            {{ staffName }}
          </span>
          <span :class="{using: status, nouse: !status}"></span>
        </p>
        <!-- <p>{{ staffDetail.use }}</p> -->
        <p class="jurisdiction">
          <span v-for="(item, index) in authenList" :key="index">{{ item }}</span>
        </p>
      </div>
    </div>
    <div class="set-time">
      <div class="time-title">
        <img src="./images/time.png" alt="">
        创建时间：</div>
      <div class="caret-time">{{ staffDetail.created_at }}</div>
    </div>
    <div class="staff-detail-button" >
      <span class="return" @click="setStatus">{{ title }}</span>
      <span class="info" @click="staffEdit(staffDetail.user_id, staffDetail.union_id || staffDetail.seller_id)">编辑</span>
    </div>
    <confirm ref="confirm" :text='text' @confirm='confirm'></confirm>
  </div>
</template>

<script>
import Confirm from 'base/confirm/confirm'
import { loadData, STATUS_OK } from 'api/common'
// import { nativeBackAndJump } from 'navtive'
// const message = {
//   right: [
//     {
//       title: '操作指南',
//       function: 'checkGuide()',
//       name: 'operationsGuide'
//     }
//   ]
// }
export default {
  data () {
    return {
      statusVal: '启用',
      staffDetail: {},
      authenList: [],
      staffName: ''
    }
  },
  computed: {
    identity () {
      return this.$route.name === 'AllianceStaffDetail' ? 1 : 0
    },
    rolee () {
      return this.$route.name === 'AllianceStaffDetail' ? 'union_id' : 'seller_id'
    },
    id () {
      return this.$route.params.id
    },
    identityId () {
      return this.$route.query.identityId
    },
    role () {
      let role = this.$route.query.role
      if (role === 'union_id') {
        return 1
      }
      return 0
    },
    title () {
      return this.status ? '停用' : '启用'
    },
    text () {
      return this.status ? '确定要停用该员工吗?' : '确定要启用该员工吗?'
    },
    status () {
      return this.statusVal === '启用' ? 1 : 0
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    setStatus () {
      this.$refs.confirm.show()
    },
    confirm () {
      this.modifyStatus()
    },
    getDetail () {
      let url = this.role ? 'union/unionStaffDetail' : 'seller/sellerStaffDetail'
      let obj = {
        'user_id': this.id,
        'union_id': this.identityId,
        'seller_id': this.identityId
      }
      loadData(url, obj).then((res) => {
        console.log(res)
        if (res.code === STATUS_OK) {
          this.staffDetail = res.data.data[0]
          this.staffName = res.data.data[0].use
          this.authenList = res.data.data[0].role
          this.statusVal = res.data.data[0].status
        }
      })
    },
    modifyStatus () {
      let url = 'UnionStaff/changeStatus'
      let obj = {
        id: this.id,
        status: this.status ? 'stopUse' : 'startUse'
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.statusVal = this.status ? '停用' : '启用'
        }
        if (this.status) {
          this.$vux.toast.text('启用成功', 'middle')
        }
      })
    },
    staffEdit (id, identityId) {
      if (this.status === 0) {
        this.$t('该员工账号已被停用')
        return
      }
      if (this.identity) {
        // this.$router.push(`/alliance-staff-edit`)
        this.$router.push(`/alliance-staff-edit/${id}?identityId=${identityId}&role=${this.rolee}`)
      } else {
        // this.$router.push(`/shop-staff-edit`)
        this.$router.push(`/shop-staff-edit/${id}?identityId=${identityId}&role=${this.rolee}`)
      }
    },
    goAuthenHelp (id) {
      if (this.identity) {
        this.$router.push('/alliance-operation-guide')
      } else {
        this.$router.push('/shop-operation-guide')
      }
    }
  },
  components: {
    Confirm
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
.staff-detail-container
  background-color #fff
  position relative
  height 100%
  // padding 10px 44px 0 40px
  .special-authen-help
    font-size 28px
    color #4A90E2
  .staff-detail
  .set-time 
    font-size 28px;/*px*/
    color $color-3
    display flex
    margin-left 44px
    p
      line-height 40px
      margin-bottom 20px
    .staff-desc
      text-align center
      margin-left 8px
      margin-top 20px
      p
        text-align left
        color #FF8A00
        font-size 26px
        img
          position relative
          top 6px
          width 24px
          height 28px
          margin-right 5px
      p:nth-child(1)
        height 40px
    .staff-list-name
      height 40px
      display flex
      justify-content space-between
      .using
        width 104px
        height 48px
        background url('./using.png') no-repeat center
        background-size 100% 100%
      .nouse
        width 104px
        height 48px
        background url('./nouse.png') no-repeat center
        background-size 100% 100%
    .staff-content
    .time
      padding-left 60px
      padding-right 44px
      margin-top 20px
      flex 1
      .jurisdiction
        display flex
        flex-direction column
        justify-content space-between
        margin-bottom auto
        span
          line-height 40px
          margin-bottom 12px
  .set-time
    margin-top 15px
    line-height 40px
  .staff-detail-button
    width 100%
    height 100px;
    line-height 100px;
    position absolute
    left 0
    right 0
    bottom 0
    // background $color-orange
    // color #fff
    // font-size 36px;/*px*/
    // text-align center
    .return
      display block
      float left
      width 50%
      height 100px
      line-height 100px
      color #fff
      font-size 32px;/*px*/
      text-align center
      background-color #FEC785
    .info
      display block
      float left
      width 50%
      height 100px
      line-height 100px
      color #fff
      font-size 32px;/*px*/
      text-align center
      background-color #FF8A00
  .time-title
    color #FF8A00
    font-size 26px
    img
      position relative
      top 3px
      width 26px
      height 26px
      margin-right 5px
  .caret-time
    margin-left 60px
</style>
