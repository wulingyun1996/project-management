<template>
  <div class="market-announcement-container">
    <base-header></base-header>
    <div class="announcement-tab">
      <tab bar-active-color="#FF8A00" active-color="#FF8A00" v-model="index">
        <tab-item @on-item-click="handler(index)" :selected="currentIndex === 0">已发布</tab-item>
        <tab-item @on-item-click="handler(index)" :selected="currentIndex === 1">草稿箱</tab-item>
      </tab>
    </div>
    <!-- 已发布的页面 -->
    <div class="announcement-issue" v-if="currentIndex === 0">
      <div class="hint-info" v-show="infoShow" v-if="infoShowW">
        <div class="left-img">
          <img src="./images/icon-warn.png" alt="">
        </div>
        <div class="info">
          每周限发不超过七次公告
        </div>
        <div class="right-img" @click="closeInfo">
          <img src="./images/icon-close.png" alt="">
        </div>
      </div>
      <div class="announcement-list" v-show="hintShow">
        <base-scroll
        :data="announcementList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getData"
        @pulldown="pullDownRefresh"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh">
          <swipeout>
            <swipeout-item
              :threshold=".5"
              :disabled="item.is_delete === 1"
              v-for="(item, index) in announcementList"
              :key="item.id">
              <div slot="right-menu">
                <swipeout-button @click.native="delStaff(item.id, index)" background-color="#FF332F" :width="buttonWidth">删除</swipeout-button>
              </div>
              <div slot="content" class="vux-1px-tb staff-list" @click="goDetail(item.id, item.title)">
                <div class="hint-img">
                  <img :src="item.image" :class="{ 'active': item.is_delete === 0 }" alt="">
                  <div class="solt" v-show="item.is_delete === 0"></div>
                </div>
                <p :class="{ 'activep': item.is_delete === 0 }">{{ item.title }}</p>
                <div class="time">
                  <span>{{ item.created_at }}</span>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </base-scroll>
      </div>
      <!-- 底部添加按钮 -->
      <div class="footerButto" v-show="hintShow">
        <div class="addNotice" @click="goAddNotice">
        </div>
      </div>
      <!-- 缺省页面 -->
      <div class="default" v-show="defaultShow">
        <div class="bg-img">
          <img src="./images/default-bg.png" alt="">
        </div>
        <p>您可以发公告给特约采购师：</p>
        <div class="staff-info-top">
          <div class="ball"></div>
          <div class="content">宣传推广您的品牌形象</div>        
        </div>
        <div class="staff-info-top">
          <div class="ball"></div>
          <div class="content">推送介绍您的店铺或商品活动</div>        
        </div>
        <div class="fotter-button" @click="goAddNotice">
          <img src="./images/icon-jia.png" alt="">
          发公告
        </div>
      </div>
    </div>
    <!-- 草稿箱的页面 -->
    <div class="draft-issue" v-else-if="currentIndex === 1">
      <div class="draft-list" v-show="draftShow">
        <base-scroll
        :data="draftList"
        :pullup="m_pullup"
        :pulldown="m_pulldown"
        @scrollToEnd="getDraftList"
        @pulldown="pullDownRefresh"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh">
          <swipeout>
            <swipeout-item
              :threshold=".5"
             v-for="(draftItem, index) in draftList"
              :key="draftItem.id">
              <div slot="right-menu">
                <swipeout-button @click.native="delDrflt(draftItem.id, index)" background-color="#FF332F" :width="buttonWidth">删除</swipeout-button>
              </div>
              <div slot="content" class="vux-1px-tb staff-list" @click="goDraftDetail(draftItem.id, draftItem.title)">
                <div class="hint-img" :class="{ 'hintActive': draftItem.image === '' }">
                  <img :src="draftItem.image" alt="">
                </div>
                <p>{{ draftItem.title }}</p>
                <div class="time">
                  <span>{{ draftItem.created_at }}</span>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </base-scroll>
      </div>
      <!-- 底部添加按钮 -->
      <div class="footerButto" v-show="draftShow">
        <div class="addNotice" @click="goAddNotice">
        </div>
      </div>
      <!-- 缺省页面 -->
      <div class="default" v-show="footShow">
        <div class="bg-img">
          <img src="./images/icon-kong.png" alt="">
        </div>
        <p>啊偶~什么都没有</p>
        <div class="fotter-button" @click="goAddNotice">
          <img src="./images/icon-jia.png" alt="">
          发公告
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { getIPhoneType } from 'commons'
import { dev } from 'common/js/dev'
import { mixins } from 'mixins'
import { invokeNativeMethod } from 'api/navtive'
export default {
  name: 'Announcement',
  mixins: [mixins],
  data () {
    return {
      index: 0,
      currentIndex: 0,
      hintShow: true,
      defaultShow: false,
      draftShow: true,
      footShow: false,
      announcementList: [],
      draftList: [],
      infoShow: false,
      infoShowW: true
    }
  },
  created () {
    if (this.isShowDraft) {
      this.currentIndex = 1
      this.getDraftList()
      return
    }
    this.getData()
    window.callbackNativeCache = this.callbackNativeCache
  },
  computed: {
    buttonWidth () {
      let dev = getIPhoneType()
      if (dev === 'iPone6Plus') {
        return 296
      }
      if (dev === 'iPoneX') {
        return 276
      }
      if (dev === 'Android') {
        return 88
      }
      return 168
    },
    isShowDraft () {
      return this.$route.query.showDraft
    }
  },
  methods: {
    async getData () {
      if (!this.m_hasMore) return
      let url = 'adv/noticesList'
      let obj = {
        type: 1
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.announcementList = res.data.data
          this._checkMore(res.data)
          if (!this.announcementList.length) {
            this.defaultShow = true
            this.m_hasMore = true
            this.hintShow = false
            this.infoShow = false
          } else {
            // this.infoShow = true
            let currentDev = dev()
            if (currentDev === 'Android') {
              // alert('11')
              let hintInfo = window.android.getNativeCache('infoCode')
              if (hintInfo === '' || !hintInfo) {
                this.infoShow = true
              }
            }
            if (currentDev === 'iOS') {
              // alert('11')
              // window.webkit.messageHandlers.isShowAnnouncementLimit.postMessage()
              invokeNativeMethod('getNativeCache', 'infoCode')
            }
          }
        }
      })
    },
    async getDraftList () {
      if (!this.m_hasMore) return
      let url = 'adv/noticesList'
      let obj = {
        type: 0
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.draftList = res.data.data
          this._checkMore(res.data)
          if (!this.draftList.length) {
            this.footShow = true
            this.m_hasMore = true
            this.draftShow = false
          }
        }
      })
    },
    // tap 栏点击事件
    handler(index) {
      if (this.currentIndex === index) return
      this.currentIndex = index
      this.announcementList.splice(0)
      this.draftList.splice(0)
      this.m_hasMore = true
      if (index === 0) {
        this.getData()
      } else {
        this.getDraftList()
      }
    },
    // 关闭上面的提示文字
    closeInfo () {
      this.infoShowW = false
      let currentDev = dev()
      if (currentDev === 'Android') {
        invokeNativeMethod('setNativeCache', '{ \'infoCode\': \'isShow\' }')
      }
      if (currentDev === 'iOS') {
        invokeNativeMethod('setNativeCache', { 'infoCode': 'isShow' })
      }
    },
    // 原生回掉方法
    callbackNativeCache (data) {
      // console.log(data)
      if (data === '') {
        this.infoShow = true
      }
    },
    // 删除公告
    delStaff (id, index) {
      let url = 'adv/deleteData'
      let obj = {
        id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let url = 'adv/noticesList'
          let obj = {
            type: 1
          }
          this.$http(url, obj).then(res => {
            if (res.code === this.$ok) {
              this.announcementList = res.data.data
              this._checkMore(res.data)
              if (!this.announcementList.length) {
                this.footShow = true
                this.m_hasMore = true
                this.draftShow = false
              }
            }
          })
          // this.getData()
          this.$t('删除成功')
          return
        }
        this.$t(res.message)
      })
    },
    // 草稿箱公告删除
    delDrflt (deleteId, index) {
      let url = 'adv/deleteData'
      let obj = {
        id: deleteId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let url = 'adv/noticesList'
          let obj = {
            type: 0
          }
          this.$http(url, obj).then(res => {
            if (res.code === this.$ok) {
              this.draftList = res.data.data
              this._checkMore(res.data)
              if (!this.draftList.length) {
                this.footShow = true
                this.m_hasMore = true
                this.draftShow = false
              }
            }
          })
          this.$t('删除成功')
          return
        }
        this.$t(res.message)
      })
    },
    // 添加公告入口
    goAddNotice () {
      this.$router.push('/edit-announcement')
    },
    // 公告详情页面
    goDetail (id, title) {
      this.$router.push({ path: '/announcement-detail', query: { id, title } })
    },
    // 草稿箱详情
    goDraftDetail (id, title) {
      this.$router.push({ path: '/draft-detail', query: { id, title, showDraft: 1 } })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'EditAnnouncement' || to.name === 'DraftDetail') {
      this.$del(to, from, next, this, true)
    }
    next()
  },
  components: {
    Tab,
    TabItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.market-announcement-container
  height 100%
  flex-col-btw()
  overflow hidden
  // position relative
  .announcement-tab
    height 100px
    .vux-tab-ink-bar
      z-index 999
  .announcement-issue
    // height 100%
    flex 1
    flex-col-btw()
    overflow hidden
    .default
      height 100%
      padding-top 200px
      .bg-img
        width 280px
        height 240px
        margin-left 50%
        transform translateX(-140px)
        img
          width 100%
          height 100%
      p
        font-family: PingFangSC-Regular
        font-size: 36px
        color: #4A4A4A
        text-align center
        margin-top 20px
        letter-spacing: 0
      .staff-info-top
        padding-left 10px
        width 420px
        height 40px
        margin-left 50%
        transform translateX(-210px)
        line-height 40px
        margin-top 20px
        overflow hidden
        .ball
          width 12px
          height 12px
          margin-top 15px
          margin-left 6px
          background-color #FF8A00
          border-radius 50%
          float left
        .content
          float left
          margin-left 20px
          color: #FF8A00
          font-size 28px
      .fotter-button
        width 100%
        height 100px
        display flex
        align-items center
        justify-content center
        background-color #FF8A00
        position absolute
        font-family: PingFangSC-Regular
        font-size: 32px
        color: #FFFFFF
        line-height 100px
        text-align center
        bottom 0px
        img
          width 30px
          margin-right 10px
          height 30px
    .hint-info
      width 430px
      height 60px
      display flex
      margin-top 5px
      align-items center
      justify-content space-around
      // line-height 60px
      overflow hidden
      bg('icon-bg.png')
      .left-img
        // margin-left 30px
        // margin-top 5px
        width 30px
        height 26px
        img
          width 100%
          height 100%
      .info
        // margin-left 15px
        font-family: PingFangSC-Regular
        font-size: 26px
        color: #FFFFFF
        margin-top 2px
        letter-spacing: 0
      .right-img
        // margin-left 10px
        // margin-top 4px
        width 22px
        height 22px
        img
          width 100%
          height 100%
    .announcement-list
      // height 950px
      flex 1
      margin-top 10px
      // padding 0 30px
      overflow hidden
      background-color #f4f4f4
      .vux-swipeout
        padding 0 30px
        background-color #fff
      .vux-swipeout-item
        margin-top 10px
        bd-b(#f4f4f4, width = 3px)
        .hint-img
          height 300px
          position relative
          img
            width 100%
            height 100%
          .active
            opacity 0.5
            background: #333333
            z-index 999
          .solt
            width 100px
            height 90px
            position absolute
            right 20px
            top 20px
            bg('icon-solt.png')
        p
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #333333
          // margin-left 20px
          letter-spacing: 0
          margin-top 15px
          line-height 40px
        .activep
          color: #CCCCCC
        .time
          overflow hidden
          span
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #CCCCCC
            letter-spacing: 0
            float right
            margin-right 10px
            margin-bottom 10px
      .vux-swipeout-item:last-child
        border-bottom none
    .footerButto
      height 210px
      background-color #f4f4f4
      .addNotice
        width 210px
        height 210px
        // position absolute
        // left 50%
        // margin-left -70px
        // bottom 5px
        margin 20px auto
        bg('icon-add.png')
  .draft-issue
    // height 100%
    flex 1
    flex-col-btw()
    overflow hidden
    .default
      padding-top 200px
      height 100%
      .bg-img
        width 280px
        height 240px
        margin-left 50%
        transform translateX(-140px)
        img
          width 100%
          height 100%
      p
        font-family: PingFangSC-Regular
        font-size: 36px
        color: #4A4A4A
        text-align center
        margin-top 50px
        letter-spacing: 0
      .fotter-button
        width 100%
        height 100px
        display flex
        align-items center
        justify-content center
        background-color #FF8A00
        position absolute
        font-family: PingFangSC-Regular
        font-size: 32px
        color: #FFFFFF
        line-height 100px
        text-align center
        bottom 0px
        img
          width 30px
          margin-right 10px
          height 30px
    .draft-list
      // height 75%
      flex 1
      margin-top 10px
      // padding 0 30px
      background-color #f4f4f4
      overflow hidden
      .vux-swipeout
        padding 0 30px
        background-color #fff
      .vux-swipeout-item
        bd-b(#f4f4f4, width = 3px)
        margin-top 10px
        .hint-img
          height 300px
          position relative
          img
            width 100%
            height 100%
        .hintActive
          // background-color #ECECEC
          background #ECECEC url('./images/icon-mi.png') no-repeat center center
          background-size 160px 160px
        p
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #333333
          letter-spacing: 0
          // margin-left 20px
          margin-top 15px
          line-height 40px
        .time
          overflow hidden
          span
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #CCCCCC
            letter-spacing: 0
            float right
            margin-right 10px
            margin-bottom 10px
      .vux-swipeout-item:last-child
        border-bottom none
    .footerButto
      height 210px
      background-color #f4f4f4
      .addNotice
        width 210px
        height 210px
        // position absolute
        // left 50%
        // margin-left -70px
        // bottom 5px
        margin 20px auto
        bg('icon-add.png')
</style>
