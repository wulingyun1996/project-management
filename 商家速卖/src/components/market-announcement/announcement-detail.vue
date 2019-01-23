<template>
  <div class="announcement-detail-container" :class="{ active: isDown }">
    <base-header :title="headerTitle"></base-header>
    <div class="announcement-detail" v-show="flag && !isDown" :style="[backgroundColor]">
      <base-scroll
      :has-more="true"
      :before-scroll="true"
      @beforeScroll="beforeScroll">
        <div id="market-annnoucement"></div>
        <div class="detail-user" :style="[textColor]">
          <p>推送用户：</p>
          <p>
            <span v-for="(item, index) in identityList" :key="index">{{ item.title }}<i v-show="identityList.length !== index + 1">、</i> <i v-show="identityList.length === index + 1"></i></span>
          </p>
        </div>
        <div class="detail-user" :style="[textColor]">
          <p>发布时间：</p>
          <p>{{ shartData }}</p>
        </div>
        <div ref="placeholder"></div>
      </base-scroll>
    </div>
    <div class="detail-down" v-show="flag && isDown">
      <img src="./images/icon-no-data.png" alt="">
      <h1>内容不存在或被删除</h1>
    </div>
    <base-senior-popup ref="soltPopup" height="auto" class="solt-popup" :stop="false">
      <div class="solt-title">
        下架原因
      </div>
      <div class="solt-info">
        {{ soltTitle }}
      </div>
      <div class="solt-button" @click="goBack">
        返回
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
// import data from 'data/data'
import { themeBackgroundData } from 'data/backgroundData'
import { patch, createVnode } from 'plugins/snabbdom'
import { sliceChar } from 'commons'
import { closeWebview } from 'navtive'
export default {
  data () {
    return {
      flag: false,
      announceDetail: '',
      // announceDetail: JSON.stringify(data),
      background: '#ffffff',
      Vnode: '',
      soltTitle: '',
      shartData: '',
      identityList: [],
      isBeforeScroll: true,
      isDown: false
    }
  },
  computed: {
    headerTitle () {
      return sliceChar(this.$route.query.title, 6)
    },
    backgroundColor () {
      return {
        background: this.background
      }
    },
    textColor () {
      return {
        color: themeBackgroundData[this.background]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData().then(() => {
        let wrapper = document.getElementById('market-annnoucement')
        this.Vnode = wrapper
        let { announceDetail, background } = this
        if (announceDetail) {
          this.vnode2html(announceDetail, background)
        }
      })
    })
  },
  methods: {
    async getData () {
      let url = 'adv/noticesDetail'
      let obj = {
        id: this.$route.query.id
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { content, rejected_reason, identity, created_at, is_delete, template } = res.data
          this.background = template
          // this.identityList = identity
          if (!identity.length) {
            this.$http('adv/getPushGroup').then(res => {
              if (res.code === this.$ok) {
                res.data.list.forEach(item => {
                  if (item.num !== 0) {
                    this.identityList.push(item)
                  }
                })
              }
            })
          } else {
            this.identityList = identity
          }
          this.announceDetail = content
          this.soltTitle = rejected_reason
          this.shartData = created_at.split(' ')[0]
          if (is_delete !== 1) {
            this.$refs.soltPopup.show()
          }
          this.flag = true
          /* eslint-enable */
          return
        }
        if (res.code === 400) {
          this.flag = true
          this.isDown = true
        }
      })
    },
    // vnode2Html
    vnode2html (data, themeBackground) {
      let vnode = createVnode('div#market-annnoucement', JSON.parse(data), themeBackground)
      patch(this.Vnode, vnode)
    },
    // 下架返回
    goBack () {
      if (this.isFromNative) {
        closeWebview()
        return
      }
      this.$router.push({ name: 'MarketAnnouncement', query: { path: '/market-announcement?fromNative=1' } })
    },
    beforeScroll () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.announcement-detail-container
  height 100%
  flex-col-btw()
  overflow hidden
  &.active
    justify-content flex-start
  .solt-popup
    >div
      width 560px!important
      background: #FFFFFF
      border-radius: 24px
      .solt-title
        height 80px
        line-height 80px
        padding-left 30px
        background: #F4F4F4
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #333333
        letter-spacing: 0
      .solt-info
        width 340px
        height 160px
        line-height 35px
        text-align center
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #D0021B
        letter-spacing: 0
        margin 0 auto
        margin-top 60px
      .solt-button
        width 200px
        height 70px
        background: #FF8A01
        border-radius: 8px
        line-height 70px
        text-align center
        font-size: 32px
        margin-top 50px
        margin 0 auto
        margin-bottom 36px
        color: #FFFFFF
  .announcement-detail
    overflow hidden
    padding 20px 30px 0
    height 100%
    flex 1
    p
      f14()
      line-height 40px
    .detail-user
      margin-top 20px
      display flex
      font-size: 28px
      p:first-child
        width 25%
      p:last-child
        width 75%
  .detail-down
    tc()
    img
      width 240px
      height 180px
      display block
      margin 120px auto 40px
    h1
      f16()
      color #999
</style>
