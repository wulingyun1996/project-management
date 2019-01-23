<template>
  <div>
    <div class="detail-content">
      <!--有内容-->
      <div class="detail-wrapper" v-if="detailStatus === 1">
        <div class="detail-main" :class="{'full-height':isOver === false}">
          <scroll
            class="scroll-content"
            ref="scroll"
            :data="applyLi"
            :pullup="pullup"
            :pulldown="pulldown"
            :beforeScroll="beforeScroll"
            @pulldown="pulldownRefresh"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll">
            <div>
              <div>
                <Loading :class="refresh ? 'show' : 'hide'"></Loading>
                <buy :wantBuy="selectBuy" @freshData="freshData" @bigPic="bigPic"></buy>
                <div class="split-div"></div>
                <div class="all-answer" v-show="!noData && applyLi.length">全部回答</div>
                <div class="apply-list">
                  <swipeout v-for="(item, index) in applyLi" :key="index">
                    <swipeout-item :disabled="userId === item.replier_id ? !disabled : disabled">
                      <div slot="right-menu">
                        <swipeout-button :width="120" @click.native="onButtonClick(item.replier_id, item.id, index)" type="warn">删除</swipeout-button>
                      </div>
                      <div slot="content" class="apply-li" @click="showAnswer(item.replier_id, item.id, item.replier_info.nickname)">
                        <div class="img-div">
                          <img :src="item.replier_info.avatar" v-if="item.replier_info.avatar" />
                          <img src="../../../static/images/seller-sale/logo-small.png" v-else />
                        </div>
                        <div class="text-div" >
                          <!-- <div> -->
                            <div class="top-text" >
                              <div class="text-left">{{ item.replier_info.nickname }}</div>
                              <div class="text-right">{{ item.replier_info.created_at }}</div>
                            </div>
                            <div class="bottom-text">
                              <span v-if="item.be_replier_info"><i>回复</i>{{ item.be_replier_info.nickname }}: </span>
                              {{ item.comment_txt }}
                            </div>
                          <!-- </div> -->
                          <div class="tui" v-if="item.goodInfo" @click.stop="goGoodDetail(item.goods_id)">
                            <img :src="item.goodInfo.image_path" />
                            <div class="tui-right">
                              <p v-if="item.goodInfo.title">{{ item.goodInfo.title }}</p>
                              <div class="price">￥ {{ item.goodInfo.price }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </swipeout-item>
                  </swipeout>
                </div>
                <loading v-show="hasMore" title=""></loading>
                <no-more v-show="!hasMore && applyLi.length" message="没有更多了"></no-more>
              </div>
              <div class="noAnswer" v-show="!hasMore && !applyLi.length">
                <i></i>
                <p>回复的人正在赶来的路上</p>
              </div>
            </div>
          </scroll>
        </div>
        <div v-if="isOver" class="answer" @click="goMeAnswer">
          <i></i>我来回答
        </div>
      </div>
      <!--内容违规-->
      <div class="buy-lllegal" v-if="detailStatus === 2">
        <img src="./lllegal.png" />
        <h5>内容违规</h5>
        <p>违规原因：{{illegal_info}}</p>
      </div>
      <!--内容不存在-->
      <div class="buy-delete" v-if="detailStatus === 4">
        <img src="./delete2.png" />
        <p>内容不存在或被删除</p>
      </div>
      <div class="share-foot" v-if="shareTrue">
        <foot-app></foot-app>
      </div>
      <confirm ref="deletePop" @confirm="goDelete" text="确定删除留言吗?" confirmBtnText="确定"></confirm>
      <x-dialog v-model="showFlag" class="dialog-demo big-photo" :hide-on-blur="true">
        <div class="img-div">
          <img :src="bigPicSrc" @click="showFlag=false" />
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { mapGetters, mapMutations } from 'vuex'
import { dev } from 'common/js/dev'
import { nativeBackBase, navBack } from 'api/init'
import Buy from 'base/buy/buy'
import Loading from 'base/loading/loading'
import NoMore from 'base/no-more/no-more'
import FootApp from 'base/foot-app/foot-app'
import { Swipeout, SwipeoutItem, SwipeoutButton, XDialog } from 'vux'
import Confirm from 'base/confirm/confirm'
import { loadDataPost, STATUS_OK } from 'api/common'
const perpage = 10
export default {
  data() {
    return {
      selectBuy: [],
      applyLi: [],
      buyId: 0,
      goodsId: 0,
      detailStatus: 1,
      noData: false,
      isOver: false,
      deleteId: 0,
      deleteIndex: 0,
      userId: 0,
      disabled: false,
      showFlag: false,
      bigPicSrc: '',
      shareObj: {},
      page: 1,
      pullup: true,
      pulldown: true,
      beforeScroll: true,
      hasMore: true,
      refresh: false,
      noShow: 0,
      shareTrue: false,
      firstItem: {}
    }
  },
  created() {
    this.CURRENT_ID(this.$route.params.id)
    // 去除右上角分享按钮
    // window.sharePop = this.sharePop
    // window.nav_back = this.nav_back
    // this.nav()
    sessionStorage.setItem('buyId', this.$route.params.id)
    if (window.location.href.indexOf('/want-to-buy') !== -1) {
      this.getRoute()
    }
    let token = sessionStorage.getItem('token')
    if (token) {
      this.shareTrue = false
    } else {
      this.shareTrue = true
    }
  },
  activated() {
    this.nav()
    this.page = 1
    this.hasMore = true
    this.isOver = false
    if (window.location.href.indexOf('/want-to-buy') !== -1) {
      this.getRoute()
    }
  },
  deactivated() {
    this.selectBuy = []
    this.applyLi = []
  },
  computed: {
    ...mapGetters(['submitId', 'currentId'])
  },
  watch: {
    '$route' () {
      this.nav()
      this.getRoute()
    }
  },
  methods: {
    ...mapMutations(['SUBMIT_ID', 'CURRENT_ID']),
    sharePop () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.showShare(JSON.stringify(this.shareObj))
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.showShare.postMessage(this.shareObj)
        } else {
          // alert('PC')
        }
      } catch (e) {
      }
    },
    nav_back () {
      navBack()
    },
    nav () {
      var param = {
        'left': [{
          'title': 'back',
          'function': 'nav_back()' // 默认
        }],
        'right': [{
          'title': 'share',
          'function': 'sharePop()'
        }]
      }
      nativeBackBase(param)
    },
    pulldownRefresh () {
      this.page = 1
      this.hasMore = true
      this.refresh = true
      setTimeout(() => {
        this.getRoute().then(() => {
          this.refresh = false
        })
      }, 2000)
    },
    searchMore(index) {
      if (!this.hasMore) {
        return
      }
      this.page++
      this.getRoute(index)
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) > dataList.total) {
        this.hasMore = false
      }
    },
    listScroll() {
      this.$emit('listScroll')
    },
    getRoute() {
      let URL = 'sale/detail'
      let obj = {
        id: sessionStorage.getItem('buyId'),
        page: this.page
      }
      loadDataPost(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.shareObj = {
            'title': res.data.buy.title,
            'imageURL': res.data.buy.image_path ? res.data.buy.image_path : '',
            'link': '/want-to-buy/' + this.$route.params.id
          }
          if (res.data) {
            this.userId = res.data.sellerId
            let status = res.data.buy.status
            // status： 1 进行中 2 违规 3 以结束 4 已删除
            if (status !== 3) {
              this.isOver = true
            }
            if (status === 1 || status === 3) {
              let arr = []
              arr.push(res.data.buy)
              this.selectBuy = arr
              this.buyId = res.data.buy.id
              if (res.data.comment.data.length === 0) {
                this.noData = true
                this.hasMore = false
              } else {
                if (this.page === 1) {
                  this.applyLi = []
                }
                this.detailStatus = 1
                res.data.comment.data ? res.data.comment.data : []
                this.applyLi = this.applyLi.concat(res.data.comment.data)
                this.firstItem = this.applyLi[0]
                this._checkMore(res.data.comment)
              }
            } else {
              if (status === 2) {
                this.illegal_info = res.data.buy.illegal_info
              }
              this.detailStatus = status
            }
          }
        }
      })
      return Promise.resolve()
    },
    freshData() {
      this.getRoute()
    },
    goMeAnswer() {
      sessionStorage.removeItem('textInput')
      sessionStorage.removeItem('chooseGood')
      this.$router.push({
        path: '/me-answer',
        query: {
          id: this.buyId
        }
      })
    },
    showAnswer(user, id, nickname) {
      sessionStorage.removeItem('textInput')
      sessionStorage.removeItem('chooseGood')
      if (sessionStorage.getItem('token')) {
        // 如果是用户自己发表的评论，不必跳转
        if (this.userId === user) {
          return false
        } else {
          this.$router.push({
            path: '/reply-he',
            query: {
              replyId: id,
              name: nickname,
              buyId: this.buyId
            }
          })
        }
      } else {
        return false
      }
    },
    // 删除本评论
    onButtonClick(userId, id, index) {
      this.deleteId = id
      this.deleteIndex = index
      this.$refs.deletePop.show()
    },
    goDelete() {
      let URL = 'sale/delComment'
      let obj = {
        id: this.deleteId
      }
      loadDataPost(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.applyLi.splice(this.deleteIndex, 1)
        }
      })
    },
    goGoodDetail(id) {
      if (sessionStorage.getItem('token')) {
        this.$router.push({path: `/detail/${id}`})
      } else {
        return
      }
    },
    bigPic(imgSrc) {
      this.bigPicSrc = imgSrc
      this.showFlag = true
    }
  },
  components: {
    Buy,
    NoMore,
    Scroll,
    FootApp,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XDialog,
    Confirm,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/mixin.styl"
@import "~common/stylus/variable.styl"
.vux-swipeout-button-box
  div
    padding:3px 0px;/*no*/
    overflow hidden
.detail-content
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  background: $color-white
  z-index: 200
  .detail-wrapper
    height: 100%
  .detail-main
    position: absolute
    top: 0
    left: 0
    bottom: 100px;/*px*/
    right: 0
    &.full-height
      bottom: 0
    .scroll-content
      height: 100%
      overflow: hidden
      background: $color-white
  .split-div
    height: 24px;/*px*/
    background: $color-body
  .all-answer
    font-size: 30px;/*px*/
    padding: 20px 0 20px 25px
    border-bottom: 1px solid $color-border;/*no*/
  .apply-list
    background: $color-white
    .apply-li
      padding: 46px 25px 28px 25px
      background: $color-white
      flex-box()
      .img-div
        width: 90px;/*px*/
        height: 90px;/*px*/
        img
          width: 100%
          height: 100%
          border-radius: 50%
      .text-div
        flex: 1
        padding-left: 18px
        position: relative
        .top-text
          flex-between()
          padding-top: 18px
          .text-left
            font-size: 30px;/*px*/
            color: $color-9
          .text-right
            font-size: 24px;/*px*/
            color: $color-a6
        .bottom-text
          font-size: 26px;/*px*/
          margin-top: 24px
          line-height: 1.3
          word-break break-all
          span
            color: #4a5e97
          i
            color: $color-3
            font-style: normal
            padding-right: 2px
        .tui
          margin-top: 20px
          background: $color-body
          flex-box-center()
          width: 82%
          img
            width: 150px;/*px*/
            height: 150px;/*px*/
            display: block
          .tui-right
            padding-left: 18px
            font-size: 24px;/*px*/
            p
              color: $color-6
              line-height: 1.3
              text-over(2)
              word-break: break-all
            .price
              margin-top: 20px
              color: $color-6
  .noAnswer
    background: $color-white
    flex-box()
    flex-direction: column
    height: 480px;/*px*/
    i
      display: block
      width: 178px;/*px*/
      height: 178px;/*px*/
      border-radius: 50%
      margin: 0 auto
      background: $color-border url('da.png') no-repeat center center
      background-size: 84px 80px;/*px*/
    p
      margin-top: 30px
      color: $color-a6
      font-size: 26px;/*px*/
      text-align: center
  .answer
    background: $color-white
    width: 100%
    flex-center()
    position: absolute
    left: 0
    bottom: 0
    line-height: 98px;/*px*/
    border-top: 1px solid $color-border;/*no*/
    font-size: 36px;/*px*/
    color: $color-a6
    i
      display: block
      width: 40px;/*px*/
      height: 40px;/*px*/
      background: url('answer.png') no-repeat center center
      background-size: 100% 100%
      margin-right: 18px
  .buy-lllegal
    width: 100%
    height: 100%
    position: fixed
    z-index: 100
    background: $color-body
    padding: 148px 48px 0;/*px*/
    img
      display: block
      width: 306px;/*px*/
      margin: 0 auto
    h5
      text-align: center
      color: $color-orange
      font-size: 30px;/*px*/
      margin-top: 66px
    p
      font-size: 30px;/*px*/
      color: $color-5
      margin-top: 35px
      line-height: 48px;/*px*/
  .buy-delete
    width: 100%
    height: 100%
    position: fixed
    z-index: 100
    background: $color-body
    padding: 160px 48px 0;/*px*/
    img
      display: block
      width: 442px;/*px*/
      margin: 0 auto
    p
      font-size: 30px;/*px*/
      color: $color-5
      line-height: 48px;/*px*/
      margin-top: 66px
      text-align: center
.share-foot
  width: 100%
  position: fixed
  left: 0
  bottom: 0
  z-index: 101
.dialog-demo
  width: 100%
  .img-div
    img
      width: 100%
</style>
