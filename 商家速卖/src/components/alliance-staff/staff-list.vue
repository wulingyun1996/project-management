<template>
  <div class="staff-list-container">
    <base-header>
      <div class="special-authen-help" @click="goAuthenHelp">操作指南</div>
    </base-header>
     <div class="wirth" v-show="bgimg"></div>
     <div class="adffScorll" v-show="bgimg">
       <div class="scoll-container">
         <base-scroll message="">
          <div class="list">
              <swipeout>
                <swipeout-item
                  :threshold=".5"
                  :disabled="item.status === '启用'"
                  v-for="(item, index) in staffList"
                  :key="item.user_id">
                  <div slot="right-menu">
                    <swipeout-button @click.native="delStaff(item.user_id, item.union_id || item.seller_id, index)" background-color="#FF332F" :width="buttonWidth">删除</swipeout-button>
                  </div>
                  <div slot="content" class="vux-1px-tb staff-list" @click="goDetail(item.user_id, item.union_id || item.seller_id)">
                  <div :class="{'is-using': item.status === '启用', 'no-use':  item.status !== '启用'}" class="staff-detail">
                    <div class="user-img">
                      <img src="./images/users.png" alt="">
                    </div>
                    <div class="user-info">
                      <span class="right">{{item.use}}</span>
                    </div>
                  </div>
                    </div>
                </swipeout-item>
              </swipeout>
            </div>
         </base-scroll>
       </div>
       <div class="bottom-write" v-show="bgimg"></div>
     </div>
      <div class="add-staff-list" v-show="hasData">
        <div class="staff-img">
          <!-- <img src="./images/staff.png" alt=""> -->
        </div>
        <div class="staff-info">
          <p>欢迎使用员工管理</p>
          <div class="staff-info-top">
            <div class="ball"></div>
            <div class="content">方便多人打理同一个{{ mes }}</div>        
          </div>
          <div class="staff-info-top">
            <div class="ball"></div>
            <div class="content">提高{{ info }}的效率&信息安全</div>        
          </div>
        </div>
      </div>
      <div class="addStaff" v-show="addShow">
        <img src="./images/add.png" @click="addStaff" alt="">
      </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { loadData, STATUS_OK } from 'api/common'
import { setShopBack, addStaffs } from 'api/navtive'
import Loading from 'base/loading/loading'
import NoMore from 'base/no-more/no-more'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { mapMutations, mapState } from 'vuex'
import { getIPhoneType } from 'commons'
const perpage = 15
export default {
  name: 'staffList',
  data () {
    return {
      staffList: [],
      page: 0,
      mes: '',
      info: '',
      hasMore: true,
      pullup: true,
      hasData: false,
      bgimg: false
    }
  },
  computed: {
    ...mapState(['allianceList']),
    buttonWidth () {
      let dev = getIPhoneType()
      if (dev === 'iPone6Plus') {
        return 180
      }
      if (dev === 'iPoneX') {
        return 160
      }
      if (dev === 'Android') {
        return 60
      }
      return 80
    },
    identity () {
      return this.$route.name === 'AllianceStaffList' ? 1 : 0
    },
    role () {
      return this.$route.name === 'AllianceStaffList' ? 'union_id' : 'seller_id'
    },
    roleLength () {
      return this.staffList.length >= 10
    },
    addShow () {
      if (this.staffList.length >= 10) {
        return false
      }
      return true
    }
  },
  created () {
    let allianceInfo = this.$root.allianceInfo
    if (!allianceInfo) {
      this.viewAllStaff()
    } else {
      let { page, hasMore } = allianceInfo
      this.page = page
      this.hasMore = hasMore
      this.shopList = JSON.parse(JSON.stringify(this.allianceList))
      if (!this.staffList.length) this.hasData = true
    }
    if (this.identity === 1) {
      this.mes = '商圈'
      this.info = '圈主'
    } else if (this.identity === 0) {
      this.mes = '店铺'
      this.info = '店长'
    }
  },
  methods: {
    ...mapMutations(['ADDALLIANCE']),
    goDetail (id, identityId) {
      if (this.identity) {
        this.$router.push(`/alliance-staff-detail/${id}?identityId=${identityId}&role=${this.role}`)
      } else {
        this.$router.push(`/shop-staff-detail/${id}?identityId=${identityId}&role=${this.role}`)
      }
    },
    delStaff (userId, identityId, index) {
      let url = 'UnionStaff/delStaff'
      let obj = {
        'user_id': userId,
        'union_id': identityId,
        'seller_id': identityId,
        identity: this.identity
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.staffList.splice(index, 1)
          this.judgeLength()
          this.ADDALLIANCE(JSON.parse(JSON.stringify(this.staffList)))
          this.viewAllStaff()
          this.$vux.toast.text('删除成功', 'middle')
          if (this.staffList.length === 0) {
            this.bgimg = false
          }
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    addStaff () {
      if (this.identity) {
        this.$router.push(`/alliance-add-staff`)
      } else {
        this.$router.push(`/shop-add-staff`)
      }
    },
    viewAllStaff () {
      if (!this.hasMore) return
      let url = this.identity ? 'union/unionStaff' : 'seller/sellerStaff'
      let obj = {
        page: ++this.page
      }
      loadData(url, obj).then((res) => {
        console.log(res)
        if (res.code === STATUS_OK) {
          this.staffList = [...this.staffList, ...res.data.data]
          if (this.staffList.length > 0) {
            this.bgimg = true
          }
          this.judgeLength()
          this.ADDALLIANCE(JSON.parse(JSON.stringify(this.staffList)))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) >= dataList.total) {
        this.hasMore = false
      }
    },
    judgeLength () {
      if (!this.staffList.length || this.roleLength) {
        setShopBack()
        if (!this.staffList.length) {
          this.hasData = true
        }
      } else {
        if (this.identity) {
          addStaffs(this.$router, {name: 'AllianceAddStaff'})
        } else {
          addStaffs(this.$router, {name: 'ShopAddStaff'})
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/alliance') {
        this.$root.allianceInfo = null
        this.$route.meta.y = 0
      } else {
        let allianceInfo = {}
        allianceInfo.page = this.page
        allianceInfo.hasMore = this.hasMore
        this.$root.allianceInfo = allianceInfo
      }
      next()
    },
    goAuthenHelp () {
      if (this.identity) {
        this.$router.push('/alliance-operation-guide')
      } else {
        this.$router.push('/shop-operation-guide')
      }
    }
  },
  components: {
    Scroll,
    Loading,
    NoMore,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.staff-list-container
  overflow hidden
  position relative
  height 100%
  .special-authen-help
    color #4A90E2
  .wirth
    width 80%
    position absolute
    top 280px
    bd-t(#efefef)
    bd-r(#efefef)
    bd-l(#efefef)
    margin-left 80px
    // border-radius 20px
    border-top-left-radius: 20px
    border-top-right-radius: 20px
    height 70px
    background-color #fff
  .bottom-write
    width 80%
    position absolute
    margin-left 80px
    height 80px
    background-color #fff
    bootom 10px
    border-bottom-right-radius: 20px
    border-bottom-left-radius: 20px
    bd-l(#efefef)
    bd-r(#efefef)
.adffScorll
  background url('images/bg.png') no-repeat
  background-size 100%
  height 100%
  overflow hidden
  .scoll-container
    width 80%
    margin-left 80px
    height 750px
    background-color #fff
    margin-top 250px
    // border-radius 20px
    bd-l(#efefef)
    bd-r(#efefef)
    overflow hidden
    .list
      width 620px
      padding 50px 72px 0 72px
    .vux-swipeout
      .vux-swipeout-item
        margin-top 24px
        width 476px
        height 129px
    .staff-list
      font-size 28px;/*px*/
      border-radius 20px;/*px*/
      background $color-white
      .staff-detail
        border-radius 20px;/*px*/
        display flex
        width 476px
        height 129px
        .user-img
          width 104px
          height 104px
          margin-top 10px
          margin-left 20px
          img
            display block
            width 100%
            height 100%
        .user-info
          line-height 129px
          margin-left 20px
          p
            .left
              img
                width 20px
                height 24px
            .right
              margin-left 20px
              color $color-3
              font-size 26px
        .staff-desc
          text-align right
          color $color-3
          font-weight 700
          &.role
            height auto
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
            word-break: break-all
        .staff-content
          padding-left 20px
          flex 1
          color $color-6
        .staff-list-name
          display flex
          justify-content space-between
.is-using
  background url('images/start.png') no-repeat
  background-size 480px 139px
.no-use
  background url('images/stop.png') no-repeat
  background-size 480px 139px
.add-staff-list
  position relative
  width 100%
  height 100%
  bg('addbg.png')
  .staff-img
    width 200px
    height 150px
    position absolute
    top 500px
    left 50%
    margin-left -100px
    bg('staff.png')
  .staff-info
    width 400px
    height 300px
    position absolute
    left 50%
    margin-left -200px
    top 680px
    text-align center
    p
      font-size 36px
      color #FF8A00 
    .staff-info-top
      padding-left 10px
      width 100%
      height 40px
      line-height 40px
      margin-top 20px
      overflow hidden
      .ball
        width 12px
        height 12px
        margin-top 6px
        margin-left 6px
        background-color #FF8A00
        border-radius 50%
        float left
      .content
        float left
        margin-left 20px
        color #333333
        font-size 28px
.addStaff
  width 200px
  height 200px
  position absolute
  left 50%
  margin-left -100px
  bottom 0px
  img
    width 100%
    height 100%
.add-staff
  position absolute
  width 382px
  top 152px
  left 50%
  transform translateX(-50%)
  text-align center
  font-size 28px;/*px*/
  img
    width 208px
    height 188px
    margin-bottom 40px
  p
    margin-bottom 50px
    line-height 40px
    color $color-9
.add-staff-btn
  width 260px
  height 76px
  margin 0 auto
  line-height 76px
  text-align center
  background $color-orange
  color $color-white
  border-radius 60px;/*px*/
</style>
