<template>
  <div class="activity-list-container" v-show="isShow">
    <!-- <div class="activity-list-tabs"></div> -->
    <div class="activity-list-content">
      <base-scroll
        class="activity-list-scroll"
        :pullup='true'
        @scrollToEnd='getActivityList'
        :data='activityList'>
        <div>
          <swipeout>
            <div v-for="(item, index) in activityList">
              <swipeout-item :threshold=".5">
                  <div slot="right-menu">
                    <swipeout-button background-color="#FF332F" :width="buttonWidth" @click.native="deletActivityItem(index, item.id, item.isExpires)">删除</swipeout-button>
                  </div>
                  <div slot="content" class="vux-1px-tb staff-list" @click="goActivityDetail(item.id, item.status, item.isExpires)">
                    <div class="activity-detail">
                      <div class="activity-pic">
                        <img :src="item.image_path" alt="">
                        <div class="activity-expire" v-show="!item.status && item.isExpires">已结束</div>
                        <div class="activity-expire bg-9" v-show="item.status">已下架</div>
                      </div>
                    </div>
                  </div>
              </swipeout-item>
              <h2 class="activity-title">{{ item.title }}</h2>
              <div class="activity-time-line">
                <div class="activity-time">
                  <span class="clock"></span>
                  <span class="time-begin">{{ item.start_at | formatDateOne }}</span>
                  <span>至</span>
                  <span class="time-end">{{ item.end_at | formatDateOne }}</span>
                </div>
                <div class="activity-money">
                  <span v-if="item.isFree">免费</span>
                  <span v-else>￥{{ item.cost }}</span>
                </div>
              </div>
              <div class="seperate"></div>
            </div>
          </swipeout>
          <base-loading v-show="hasMore" title=""></base-loading>
          <base-no-more v-show="!hasMore && activityList.length" message="没有更多了"></base-no-more>
        </div>
      </base-scroll>
      <div class="add-staff" v-if="!activityList.length">
        <img src="./images/nostaff.png" alt="">
        <p>您还没有活动，赶紧去添加吧~</p>
        <!-- <div class="add-staff-btn" @click="addActivity">
          建活动
        </div> -->
      </div>
    </div>
    <base-footer @footerSubmit="addActivity" class="activity-list-footer">
     <span class="icon-add"></span>
     <span>新建活动</span>
    </base-footer>
    <base-confirm ref="confirm" @confirm="confirmDelete" text="您确定要删除该活动吗？" confirmBtnText="确定"></base-confirm>
    <base-pop ref="pop" :title="title"></base-pop>
  </div>
</template>

<script>
import BaseScroll from 'base/scroll/scroll'
import BaseConfirm from 'base/confirm/confirm'
import BasePop from 'base/pop/pop'
import BaseLoading from 'base/loading/loading'
import BaseNoMore from 'base/no-more/no-more'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
// import { nativeBackAndJump } from 'navtive'
import { initTime, getIPhoneType } from 'commons'
const perpage = 10
// const message = {
//   right: [
//     {
//       title: '新建',
//       function: 'addActivity()',
//       name: 'addActivity'
//     }
//   ]
// }
export default {
  data () {
    return {
      isShow: false,
      activityList: [],
      currentIndex: 0,
      currentId: 0,
      hasMore: true,
      page: 0,
      servicePhone: ''
    }
  },
  computed: {
    title () {
      return `已有用户报名参加，请联系运营平台 tel：${this.servicePhone}`
    },
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
    }
  },
  created() {
    this.getServicePhone()
    this.getActivityList()
    // let _router = {
    //   router: this.$router,
    //   path: '/establish-activity'
    // }
    // nativeBackAndJump(message, _router, 1)
  },
  methods: {
    getActivityList () {
      if (!this.hasMore) return
      let url = 'UnionAct/actList'
      let obj = {
        act_status: 1,
        is_page: true,
        page: ++this.page,
        status: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          res.data.data.forEach(item => {
            item.isExpires = initTime(item.end_at) < initTime() ? 1 : 0
            item.isFree = Number(item.cost) === 0
          })
          this.activityList = [...this.activityList, ...res.data.data]
          this._checkMore(res.data)
        }
        this.isShow = true
      })
    },
    deletActivityItem (index, id, isExpires) {
      if (isExpires) {
        this.$vux.toast.text('活动已结束，不可删除', 'middle')
        return
      }
      this.currentIndex = index
      this.currentId = id
      this.$refs.confirm.show()
    },
    confirmDelete () {
      let url = 'UnionAct/actDelete'
      let obj = {
        id: this.currentId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.activityList.splice(this.currentIndex, 1)
          this.$vux.toast.text('删除成功', 'middle')
          return
        }
        if (res.code === 202) {
          this.$refs.pop.show()
          this.$refs.pop.hide()
        }
      })
    },
    goActivityDetail (id, isActivityDown, isActivityExpires) {
      this.$router.push({name: 'ViewActivity', query: { id, isActivityDown, isActivityExpires }})
    },
    addActivity () {
      this.$router.push('/establish-activity')
    },
    getServicePhone () {
      let url = 'getSrvPhone'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.servicePhone = res.data.service_phone
        }
      })
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) >= dataList.total) {
        this.hasMore = false
      }
    }
  },
  filters: {
    formatDateOne (date) {
      return date.substring(5, date.length - 3)
    }
  },
  components: {
    BaseScroll,
    BaseConfirm,
    BasePop,
    BaseLoading,
    BaseNoMore,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
@import "~common/stylus/vux"
.activity-list-container
  height 100%
  flex-col()
  background $color-f4
  .activity-list-content
    flex 1
    overflow hidden
    // padding 0 30px
    position relative
    .activity-list-scroll
      height 100%
    .activity-detail
      .activity-pic
        width 100%
        height 324px
        position relative
        img
          wh(100%)
        .activity-expire
          f12()
          height 42px
          line-height 42px
          font-weight 700
          padding 0 22px
          color $color-white
          position absolute
          bottom 8px
          left 0
          background #BA9870
          border-radius(0 100px 100px 0)
    h2
      f14()
      color $color-3
      line-height 40px
      margin 14px 0
      text-over(1)
    .activity-time-line
      flex-align-item()
      f14()
      color $color-9
      margin-bottom 28px
      .activity-time
        span
          display inline-block
          vertical-align middle
        span.clock
          width 28px
          height 30px
          bg('clock.png')
      .activity-money
        color $color-red
    .seperate
      height 20px
      margin 0 -30px
      margin-bottom -1px
      background $color-f4
    // vux
    .vux-swipeout
      padding 0 30px
      background $color-white
      overflow unset
      .vux-swipeout-item
        margin-top 28px
    .add-staff
      position absolute
      min-width 382px
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
        white-space nowrap
    .add-staff-btn
      width 260px
      height 76px
      margin 0 auto
      line-height 76px
      text-align center
      background $color-orange
      color $color-white
      border-radius 60px;/*px*/
  .activity-list-footer
    .icon-add
      wh(24px)
      bg('icon-add.png')
      margin-right 16px
  .bg-9
    background $color-9
</style>
