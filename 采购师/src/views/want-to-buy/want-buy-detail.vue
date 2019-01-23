<template>
  <div class="detail">
    <base-header :title="titleInfo">
      <div class="right-icon" v-show="detail.status !== 3" @click="showShareGuide">
      </div>
    </base-header>
    <base-scroll
      class="want-to-buy-scroll"
      v-if="detail.status === 1 || detail.status === 3"
      :hasMore='m_hasMore'
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      :hasLoading="m_loading"
      :hasRefresh="m_refresh"
      @scrollToEnd="getData"
      @pulldown="pullDownRefreshData"
      :data="m_dataList">
      <div class="detail-area">
        <img v-if="detail.status === 3" src="./images/over.png" alt="" class="over">
        <div class="top">
          <div class="info">
            <img :src="detail.avatar ? detail.avatar : require('./images/avatar.png')" alt="">
            <span>{{ detail.nickname }}</span>
          </div>
          <div class="time">
            {{ detail.created_title }}
          </div>
        </div>
        <div class="detail-content">
          <div class="title">
            {{ detail.title }}
          </div>
          <div class="area">
            供应商首选区域：<span>{{ detail.province_name }}{{ detail.city_name }}</span>
          </div>
          <div class="count" v-if="detail.type === 1">
            <img src="./images/count.png" alt="">
            <span>数量</span>
            <span>{{ detail.goods_num }}</span>
          </div>
          <div class="end-time">
            <img src="./images/clock.png" alt="">
            <span>截止</span>
            <span>{{ detail.deadline }}</span>
          </div>
          <div class="imgs">
            <img :src="detail.image_path" alt="" v-if="detail.image_path" @click="showPic(detail.image_path)">
            <img :src="detail.image_path_two" alt="" v-if="detail.image_path_two" @click="showPic(detail.image_path_two)">
          </div>
          <div class="describe">
            <span>更多描述：</span>
            <span>{{ detail.content }}</span>
          </div>
          <div class="views">
            <img :src="detail.focus ? require('./images/followed.png') : require('./images/follow.png')" alt="" @click="focus">
            <span @click="focus">{{detail.follow_count > 0 ? detail.follow_count : '关注'}}</span>
            <img src="./images/comment.png" alt="" @click="answerBuyDetail">
            <span @click="answerBuyDetail">{{ detail.message_count }}</span>
          </div>
        </div>
      </div>
      <div class="comments">
        <div class="comments-item" v-for="(item, index) in m_dataList" :key="index" v-if="m_dataList.length > 0">
          <div class="top">
            <div class="info">
              <img :src="item.replier_info.avatar" alt="" v-if="item.replier_info.avatar">
              <img src="./images/avatar.png" alt="" v-else>
              <span style="color: #999; font-size: 15px;" @click="replyPurchaser(item)">{{ item.replier_info.nickname }}</span>
            </div>
            <div class="time" @click="replyPurchaser(item)">
              {{ item.replier_info.created_title }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span v-if="item.be_replier_info"><i>回复</i>{{ item.be_replier_info.nickname }}: </span>
              {{ item.comment_txt }}
            </div>
            <div class="goods-info" v-if="item.goodInfo" @click="goGoodsDetail(item.goodInfo.goods_id)">
              <img :src="item.goodInfo.image_path" alt="">
              <div class="goods-content">
                <div class="goods-name">
                  {{ item.goodInfo.title }}
                </div>
                <div class="goods-price">
                  ￥&nbsp;&nbsp;{{ item.goodInfo.price }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="m_dataList.length === 0" class="no-comments">
          <img src="./images/da.png" alt="">
          <p>回复的人在赶来的路上</p>
        </div>
      </div>
    </base-scroll>
    <base-footer v-if="detail.status !== 3" class="buy-footer" ref="footer" background="#fff" @footerSubmit="answerBuyDetail">
      <img src="./images/answer.png" alt="">
      <span>我来回答</span>
    </base-footer>
    <div v-if="detail.status === 2" class="illega">
      <base-header title="已过期"></base-header>
      <img src="./images/illega.png" alt="">
      <p>内容违规</p>
      <p>违规原因： 这里是违规详细说明这里是详细违规说明这里是详细违规说明</p>
    </div>
    <div v-if="detail.status === 4" class="deleted">
      <img src="./images/deleted.png" alt="">
      <p>内容不存在或被删除</p>
    </div>
    <x-dialog
      :hide-on-blur="true"
      v-model="showBigPic"
      class="dialog-img">
      <div class="img-div">
        <img :src="imgPath" @click="showBigPic = false"/>
      </div>
    </x-dialog>
    <div class="share-popup" v-if="!isOpenByShare" v-show="isShowShareGuide" @click.self="hideShareGuide">
      <div class="share-content" :class="{ active: $isX }">
        <h2>
          <span>分享</span>
          <i @click="hideShareGuide"></i>
        </h2>
        <div class="share-list">
          <div class="item" ref="one" @click="share(0)">
            <img src="./images/img-wx.png">
            <p>微信好友</p>
          </div>
          <div class="item" ref="two" @click="share(1)">
            <img src="./images/img-circle.png">
            <p>朋友圈</p>
          </div>
          <div class="item" ref="three" @click="share(2)">
            <img src="./images/img-qq.png">
            <p>QQ好友</p>
          </div>
          <div class="item" ref="four" @click="share(3)">
            <img src="./images/img-qqzoom.png">
            <p>QQ空间</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XDialog } from 'vux'
import { smallPic } from 'common'
import { invokeNativeMethod } from 'native'
import { mixins, wxMixins } from 'mixins'
export default {
  name: 'WantToBuyDetail',
  mixins: [mixins, wxMixins],
  data () {
    return {
      detail: {
        status: 1
      },
      showBigPic: false,
      imgPath: '',
      title: '',
      bannerUrl: '',
      isShowShareGuide: false
    }
  },
  computed: {
    // 是否是通过分享页面打开
    isOpenByShare () {
      return !!this.$route.query.shareId
    },
    id () {
      return this.$route.query.id
    },
    wantToBuyType () {
      return this.$route.query.type
    },
    titleInfo () {
      if (this.$route.query.type === 1) {
        return '商品求购详情'
      } else {
        return '工程合作详情'
      }
    }
  },
  created () {
    this.getWantToBuyDetails().then(() => {
      this.getData()
    })
  },
  methods: {
    async getWantToBuyDetails () {
      let url = 'asktobuy/askToBuyDetails'
      let { wantToBuyType, id } = this
      let obj = {
        ask_id: id
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.detail = res.data
          if (this.isOpenByShare) {
            let obj = {
              title: `${res.data.city_name}项目急需${wantToBuyType === 1 ? '求购' : '合作'}：${res.data.title}`,
              desc: '让采购更简单！',
              imgUrl: !res.data.image_path ? 'http://os.cgs18.com/static/images/showtu.png' : res.data.image_path
            }
            this.wxShare(obj)
          }
          return
        }
        this.$t(res.message)
      })
      return Promise.resolve()
    },
    async getData () {
      if (!this.m_hasMore) return
      let url = 'asktobuy/askReplyComments'
      let obj = {
        ask_id: this.id,
        page: ++this.m_page,
        pageSize: this.m_pageSize
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (this.m_page === 1) {
            this.m_dataList = res.data.data
          } else {
            this.m_dataList = [...this.m_dataList, ...res.data.data]
          }
          this._checkMore(res.data)
          return
        }
        this.$t(res.message)
      })
      return Promise.resolve()
    },
    showPic (path) {
      this.showBigPic = true
      this.imgPath = path
    },
    focus () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      if (this.detail.focus) {
        this.detail.focus = 0
        this.detail.follow_count--
      } else {
        this.detail.focus = 1
        this.detail.follow_count++
      }
      this.$http('asktobuy/focusOn', {
        ask_id: this.id,
        focus: this.detail.focus
      })
    },
    replyPurchaser (item) {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      if (item.replier_id === Number(sessionStorage.userId)) return
      this.$router.push({ path: '/answer', query: { id: item.id, name: item.replier_info.nickname } })
    },
    goGoodsDetail (id) {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      this.$push({ path: '/goods-detail', query: { goodsId: id } })
    },
    report () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      this.$push({ path: '/report', query: { id: this.id } })
    },
    answerBuyDetail () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      if (this.detail.status !== 1) return
      this.$push({ path: '/answer', query: { id: this.id } })
    },
    share (payload) {
      let { detail, wantToBuyType } = this
      let obj = {}
      obj.type = payload
      obj.url = location.href
      obj.title = `${detail.city_name}项目急需${wantToBuyType === 1 ? '求购' : '合作'}：${detail.title}`
      obj.discriable = ''
      obj.imgUrl = smallPic(!detail.image_path ? './images/avatar.png' : detail.image_path, 200, 200)
      obj.from = 20
      invokeNativeMethod('share', JSON.stringify(obj))
      this.hideShareGuide()
    },
    // 分享的按钮
    showShareGuide () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/seller-download')
        return
      }
      this.isShowShareGuide = true
      setTimeout(() => {
        this.$refs.one.style.transform = 'scale(1)'
      }, 400)
      setTimeout(() => {
        this.$refs.two.style.transform = 'scale(1)'
      }, 600)
      setTimeout(() => {
        this.$refs.three.style.transform = 'scale(1)'
      }, 800)
      setTimeout(() => {
        this.$refs.four.style.transform = 'scale(1)'
      }, 1000)
    },
    hideShareGuide () {
      this.isShowShareGuide = false
      this.$refs.one.style.transform = 'scale(0)'
      this.$refs.two.style.transform = 'scale(0)'
      this.$refs.three.style.transform = 'scale(0)'
      this.$refs.four.style.transform = 'scale(0)'
    }
  },
  components: {
    XDialog
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/mixins'
.right-icon
  width 42px
  height 40px
  box-sizing content-box
  background url('./images/gray-share.png') no-repeat center
  background-size 100% 100%
  padding 20px
  margin-right -20px
  background-origin content-box
  background-clip content-box
.dialog-img
  width: 100%
  .weui-dialog
    width 96%
    max-width 96%
    border-radius(40px)
    img
      display block
      width 100%
.share-popup
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index 1000
  background rgba(0, 0, 0, .5)
.share-content
  position fixed
  left 0
  right 0
  bottom 0
  width 100%
  opacity .9
  background #fff
  z-index 10001
  padding 30px
  &.active
    padding-bottom 64px
  h2
    color $color-3
    f14()
    line-height 40px
    flex-align-item()
    margin-bottom 40px
    i
      wh(30px)
      bg('close.png')
  .share-list
    flex-align-item()
  .item
    transform scale(0)
    transition all 0.4s ease-in
    p
      flex 1
      color $color-3
      f12()
      tc()
    img
      height 120px
      width 120px
      margin-bottom 15px
</style>

<style lang="stylus" scoped>
@import '~@/assets/css/mixins'
.detail
  height 100%
  flex-col()
  overflow hidden
  .top
    padding 0 20px 0 25px
    display flex
    align-items center
    justify-content space-between
    .info
      display flex
      align-items center
      img
        border-radius(50%)
        width 66px
        height 66px
        margin-right 12px
    .time
      color #A6A6A6
      font-size 24px
  .want-to-buy-scroll
    flex 1
.detail-area
  padding 22px 0 28px 0
  border-bottom 12px solid rgb(248, 248, 248)
  position relative
  .over
    position absolute
    width 135px;/*px*/
    height 112px;/*px*/
    right 20px
    top 48%
.detail-content
  padding 50px 50px 0 103px
  color #333
  .title
    font-weight bold
    font-size 30px
    line-height 44px
    margin-bottom 20px
  .area
    font-size 26px
    margin-bottom 20px
    span:last-child
      color #a6a6a6
  .count
    font-size 26px
    color #555
    display flex
    align-items center
    height 30px
    margin-bottom 20px
    span:first-of-type
      color #FF8A00
      margin-left 16px
      margin-right 16px
    img
      height 28px
  .end-time
    display flex
    align-items center
    height 30px
    img
      height 28px
    span:first-of-type
      color #FF8A00
      font-size 26px
      margin-left 16px
    span:last-of-type
      color #555
      margin-left 16px
  .imgs
    display flex
    margin-top 34px
    position relative
    img
      width 200px;/*px*/
      height 200px;/*px*/
      margin-right 20px
  .describe
    margin-top 30px
    font-size 26px
    line-height 40px
    span:last-child
      color #a6a6a6
  .views
    display flex
    align-items center
    margin-top 22px
    justify-content flex-end
    img
      height 40px
      margin-right 16px
    span
      color #a6a6a6
    span:first-of-type
      margin-right 62px
// .comments
//   overflow auto
  .comments-item
    border-bottom 1px solid #DEDEDE;/*no*/
    padding 40px 0 20px 103px
    .top
      margin-left -103px
  .item
    margin-top 20px
    .title
      font-size 26px
      line-height 40px
      color #333
      margin-bottom 20px
      span
        color #4a5e97
      i
        color #333
        font-style normal
    .goods-info
      display flex
      width 520px
      height 150px
      img
        width 150px
        height 150px
      .goods-content
        flex 1
        padding 20px 20px 0 18px
        background rgb(248, 248, 248)
        font-size 24px
        line-height 34px
        color #666
        height 150px
    .goods-name
      overflow: hidden;
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      margin-bottom 10px
footer
  position fixed
  width 100%
  height 98px
  left 0
  bottom 0
  display flex
  align-items center
  justify-content center
  color #a6a6a6
  font-size 36px
  border-top 1px solid #ccc;/*no*/
  background #FFF
  img
    width 42px
    margin-right 18px
.buy-footer
  color #a6a6a6
  f18()
  bd-t(#ccc)
  height 98px
  img
    width 42px
    margin-right 18px
.illega
  height 100vh
  background #f2f2f2
  overflow hidden
  padding-top 148px
  img
    width 306px
    height 263px
    display block
    margin 0 auto 66px
  p
    font-size 30px
    text-align center
  p:nth-of-type(1)
    color #ff9d00
    margin-bottom 40px
  p:last-of-type
    color #555
    line-height 48px
    padding 0 40px
.deleted
  height 100vh
  background #f2f2f2
  overflow hidden
  padding-top 148px
  img
    width 441px
    height 307px
    display block
    margin 0 auto 66px
  p
    text-align center
    font-size 30px
    color rgb(86, 86, 86)
.no-comments
  height 100%
  img
    width 84px
    height 80px
    display block
    margin 120px auto 40px
  p
    text-align center
    color rgb(192, 192, 192)
</style>
