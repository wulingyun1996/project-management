<template>
  <div class="staff-list-container">
     <scroll class="staff-list-wrapper"
     :scrolling='true'
     @scrollToEnd='viewAllStaff'
     :pullup='pullup'
     :data='staffList'>
       <div>
        <swipeout>
          <swipeout-item :threshold=".5" v-for="(item, index) in staffList" :key="item.user_id" :disabled="item.status === '启用'">
              <div slot="right-menu">
                <swipeout-button @click.native="delStaff(item.user_id, item.union_id || item.seller_id, index)" background-color="#FF332F" :width="100">删除</swipeout-button>
              </div>
              <div slot="content" class="vux-1px-tb staff-list" @click="goDetail(item.user_id, item.union_id || item.seller_id)">
                <div class="staff-detail">
                  <div class="staff-desc">
                    <p>账号:</p>
                    <p>使用者:</p>
                    <!-- <p>所属岗位:</p> -->
                  </div>
                  <div class="staff-content">
                    <p class="staff-list-name"><span class="staff-info">{{ item.account }}</span><span :class="{'is-using': item.status === '启用', 'no-use':  item.status !== '启用'}">{{ item.status }}</span></p>
                    <p>{{ item.use }}</p>
                    <!-- <p class="role">{{ item.role.join() }}</p> -->
                  </div>
                </div>
              </div>
          </swipeout-item>
        </swipeout>
        <!-- <loading v-show="hasMore" title=""></loading> -->
        <!-- <no-more v-show="!hasMore && staffList.length" message="没有更多了"></no-more> -->
       </div>
     </scroll>
      <div class="add-staff" v-show="hasData">
        <img src="./nostaff.png" alt="">
        <p>您还没有员工，赶紧去添加吧~</p>
        <div class="add-staff-btn" @click="addStaff">
          新建员工
        </div>
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
const perpage = 15
export default {
  name: 'staffList',
  data () {
    return {
      staffList: [],
      page: 0,
      hasMore: true,
      pullup: true,
      hasData: false
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
  },
  computed: {
    ...mapState(['allianceList']),
    identity () {
      return this.$route.name === 'AllianceStaffList' ? 1 : 0
    },
    role () {
      return this.$route.name === 'AllianceStaffList' ? 'union_id' : 'seller_id'
    },
    roleLength () {
      return this.staffList.length >= 10
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
        if (res.code === STATUS_OK) {
          this.staffList = [...this.staffList, ...res.data.data]
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
.staff-list-container
  position relative
  padding-top 48px
  height 100%
.staff-list-wrapper
  height 100%
  padding 0 30px
  .vux-swipeout
    overflow visible
    .vux-swipeout-item
      margin-bottom 28px
      box-shadow 0 6px 20px #ccc
      overflow hidden
      border-radius 8px;/*px*/
    button
      font-size 28px;/*px*/
  .staff-list
    // height 232px
    padding 26px 28px 0
    font-size 28px;/*px*/
    background $color-white
    .staff-detail
      display flex
      .staff-desc
        text-align right
        color $color-3
        font-weight 700
      p
        margin-bottom 22px
        line-height 40px;/*px*/
        height 40px;/*px*/
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
          color #46B308
        .no-use
          color #D0021B
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
