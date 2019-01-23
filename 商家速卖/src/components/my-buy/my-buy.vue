<template>
  <div class="mybuy-wrapper">
    <div>
      <div class="mybuy-top">
        <tab :line-width="4" active-color='orange' bar-active-color="orange" custom-bar-width="58px" v-model="index">
          <tab-item @on-item-click="handler(index)" :selected="currentIndex === 0">我关注的</tab-item>
          <tab-item @on-item-click="handler(index)" :selected="currentIndex === 1">我回复的</tab-item>
        </tab>
      </div>
      <div class="content">
        <scroll ref="scroll" class="main-content" v-if="currentIndex===0" :data="followLi"
        :pulldown="pulldown" :pullup="pullup" @pulldown="pulldownRefresh" :beforeScroll="beforeScroll" @scrollToEnd="searchMore(0)" @beforeScroll="listScroll">
          <div>
            <Loading :class="refresh ? 'show' : 'hide'"></Loading>
            <div v-show="!noData && loading">
              <follow :wantBuy="followLi" @freshDataOne="freshData" :currentIndex='currentIndex'></follow>
              <loading v-show="hasMore" title=""></loading>
              <no-more v-show="!hasMore && followLi.length" message="这个商家好勤快，没有更多啦"></no-more>
            </div>
            <div class="no-data" v-show="noData && !hasMore && !followLi.length">
              <img src="./noFocus.png">
              <p>竟然一条关注都没有<br />万千的世界，怎么会没有你的真爱呢...</p>
              <a href="javascript:;" class="go-see" @click="goSee">去看看</a>
            </div>
          </div>
        </scroll>
        <scroll ref="scroll" class="main-content" v-else :data="followComment" :pulldown="pulldown" :pullup="pullup" @pulldown="pulldownRefreshTwo" :beforeScroll="beforeScroll" @scrollToEnd="searchMore(1)" @beforeScroll="listScroll">
          <div>
            <div>
              <Loading :class="refresh ? 'show' : 'hide'"></Loading>
              <div v-show="!noData && loading">
                <follow :wantBuy="followComment" :currentIndex='currentIndex' @freshDataTwo="freshData"></follow>
                <!-- <div class="clear-all" @click="clearAll" v-show="hasMore || followComment.length">一键清空</div> -->
                <loading v-show="hasMore" title=""></loading>
                <no-more v-show="!hasMore && followComment.length" message="这个商家好勤快，没有更多啦"></no-more>
              </div>
            </div>
            <div class="no-data" v-show="!hasMore && !followComment.length">
              <img src="./noReplay.png">
              <p>您目前还没有回复的信息<br />马上去看看吧</p>
              <a href="javascript:;" class="go-see" @click="goSee">去看看</a>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {nativeBackBase} from 'api/init'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import Buy from 'base/buy/buy'
  import Follow from 'base/follow/follow'
  import {Tab, TabItem} from 'vux'

  const perpage = 10

  export default {
    name: 'myBuy',
    data() {
      return {
        index: 0,
        currentIndex: 0,
        followLi: [],
        followComment: [],
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        pulldown: true,
        refresh: false,
        noData: false,
        loading: false
      }
    },
    created() {
      this.getRoute()
    },
    beforeRouteEnter (to, from, next) {
      nativeBackBase()
      next()
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/home') {
          this.hasMore = true
          this.index = 0
          this.page = 1
          this.currentIndex = 0
          this.followLi.splice(0)
          this.followComment.splice(0)
        }
        if (from.path === '/home') {
          this.getRoute()
        }
        this.changeItem()
      }
    },
    computed: {
      ...mapGetters(['myIndex'])
    },
    methods: {
      changeItem() {
        let myItem = window.sessionStorage.getItem('myItem')
        if (myItem) {
          if (this.currentIndex === 0) {
            this.followLi.splice(this.myIndex, 1)
            if (this.followLi.length === 0) {
              this.getRoute()
            }
          } else {
            this.$set(this.followComment, this.myIndex, JSON.parse(myItem))
          }
          window.sessionStorage.removeItem('myItem')
        } else {
          return false
        }
      },
      pulldownRefresh() {
        this.refresh = true
        this.hasMore = true
        this.page = 1
        setTimeout(() => {
          this.getRoute()
        }, 2000)
      },
      pulldownRefreshTwo() {
        this.refresh = true
        this.hasMore = true
        this.page = 1
        setTimeout(() => {
          this.getComment()
        }, 2000)
      },
      getRoute() {
        let URL = 'sale/mineConcerned'
        let obj = {
          page: 1
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.refresh = false
            this.loading = true
            this.followLi = res.data.data.data
            this.noData = this.followLi.length === 0 ? 1 : 0
            this._checkMore(res.data.data)
          }
        })
      },
      getComment() {
        let URL = 'sale/mineReplied'
        let obj = {
          page: 1
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.refresh = false
            this.loading = true
            let followData = res.data.data.data
            this.noData = followData.length === 0 ? 1 : 0
            if (followData.length > 0) {
              this.followComment = followData
            }
            this._checkMore(res.data.data)
          }
        })
      },
      freshData(index, item) {
        this.page = 1
        this.hasMore = true
        this.$refs.scroll.scrollTo(0, 0, 0)
        if (this.currentIndex === 0) {
          // this.followLi.splice(index, 1)
          this.getRoute()
        } else {
          // this.followComment.splice(index, 1)
          this.getComment()
        }
      },
      searchMore(index) {
        if (!this.hasMore) {
          return
        }
        this.page++
        if (index === 0) {
          let URL = 'sale/mineConcerned'
          let obj = {
            page: this.page
          }
          loadDataPost(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              this.followLi = this.followLi.concat(res.data.data.data)
              this._checkMore(res.data.data)
            }
          })
        } else {
          let URL = 'sale/mineReplied'
          let obj = {
            page: this.page
          }
          loadDataPost(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              this.followComment = this.followComment.concat(res.data.data.data)
              this._checkMore(res.data.data)
            }
          })
        }
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
      handler(index) {
        if (this.currentIndex === index) return
        this.currentIndex = index
        this.page = 1
        this.hasMore = true
        this.followLi.splice(0)
        this.followComment.splice(0)
        if (index === 0) {
          this.getRoute()
        } else {
          this.getComment()
        }
      },
      goSee() {
        this.$router.push('/want-to-buy')
      },
      clearAll() {
        // 一键清空
        let URL = 'sale/delMineReplied'
        loadDataPost(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.followComment = []
          }
        })
      }
    },
    components: {
      Scroll,
      Loading,
      NoMore,
      Buy,
      Follow,
      Tab,
      TabItem
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .mybuy-wrapper
    position: fixed
    z-index: 200
    top: 0
    left: 0
    width: 100%
    height: 100%
    .mybuy-top
      width: 100%
    .content
      position: absolute
      width: 100%
      top: 92px;/*px*/
      bottom: 0
      .clear-all
        width: 150px;/*px*/
        line-height: 54px;/*px*/
        text-align: center
        border: 1px solid $color-9;/*no*/
        margin: 40px auto 0
        color: $color-9
        border-radius: 2px
    .no-data
      padding-top: 150px
      img
        width: 29.06%
        height: auto
        display: block
        margin: 0 auto
      p
        text-align: center
        font-size: 28px;/*px*/
        color: $color-6
        margin-top: 90px
        line-height: 1.5
      .go-see
        font-size: 30px;/*px*/
        color: $color-orange
        text-align: center
        border: 1px solid $color-orange;/*no*/
        border-radius: 5px
        display: block
        width: 200px;/*px*/
        line-height: 80px;/*px*/
        margin: 35px auto 0
    .content
      .main-content
        height: 100%
        overflow: hidden
      .report-bg
        background: $color-body
</style>
