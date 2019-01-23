<template>
  <div class="quote-goods">
    <div v-if="isShow" class="showData">
      <div class="quote-top"><i></i>产品引用选择确认引用后，需编辑该商品信息后再发布为商品。</div>
      <div class="quote-content">
        <div class="quote-title">
          <div class="left">选择需引用的厂家产品</div>
        </div>
        <div class="quote-list">
          <scroll
            ref="scroll"
            class="main-content"
            :data="quoteList" 
            :pulldown="pulldown"
            :pullup="pullup"
            @pulldown="pulldownRefresh"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll">
            <div>
              <Loading :class="refresh ? 'show' : 'hide'"></Loading>
              <div v-show="!noData && loading">
                <div class="quote-all">
                  <div class="quote-div" v-for="(item, index) in quoteList">
                    <div class="pic-box">
                      <img :src="item.image_path | smallPic(150, 150)" />
                    </div>
                    <div class="text-box">
                      <h5>{{item.title}}</h5>
                      <p>{{item.price_range}}</p>
                      <div class="choose-icon">
                        <label :for="item.id">
                          <span :class="{active: item.id === currentId}"></span>
                          <!-- <input :id="item.id" name="item" type="radio"  @change="chooseItem(item.id, index)"> -->
                          <input :id="item.id" name="item" type="radio" :value="item.id"  v-model="currentId">
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <loading v-show="hasMore" title=""></loading>
                <no-more v-show="!hasMore && quoteList.length" message="没有更多啦"></no-more>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <pop ref="pop" :title="showMess"></pop>
      <foot-btn text="立即引用" @footBtnClick="showConfirm"></foot-btn>
      <!-- <confirm ref="confirm" text="产品已成功引用为商品！" cancelBtnText="继续引用" confirmBtnText="查看商品" @confirm="confirmBtn" @cancel="cancelBtn"></confirm> -->
    </div>
    <div v-if="isData" class="no-data">
      <img src="./noDate.png" />
      <p>该厂家暂无产品可引用~</p>
    </div>
  </div>
</template>  
<script type="text/ecmascript-6">
  import FootBtn from 'base/foot-btn/foot-btn-two'
  import { CheckIcon } from 'vux'
  import { nativeBackBase } from 'api/init'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  import Confirm from 'base/confirm/confirm'
  import Pop from 'base/pop/pop'
  import { loadDataPost, STATUS_OK } from 'api/common'

  const perpage = 10

  export default {
    data() {
      return {
        showMess: '',
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        pulldown: true,
        refresh: false,
        noData: false,
        loading: false,
        page: 1,
        quoteList: [],
        isShow: false,
        isData: false,
        checkedId: null,
        currentId: ''
      }
    },
    created() {
      this.getRoute()
    },
    beforeRouteEnter (to, from, next) {
      nativeBackBase()
      next()
    },
    methods: {
      pulldownRefresh() {
        this.refresh = true
        this.hasMore = true
        this.page = 1
        setTimeout(() => {
          this.getRoute()
        }, 2000)
      },
      getRoute() {
        // 初始化 chooseArr toto
        let URL = 'goods/getProductList'
        let obj = {
          page: 1,
          pageSize: perpage
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (res.data.total > 0) {
              this.isShow = true
            } else {
              this.isData = true
            }
            this.refresh = false
            this.loading = true
            this.quoteList = res.data.data
            this.noData = this.quoteList.length === 0 ? 1 : 0
            this._checkMore(res.data)
          }
        })
      },
      freshData() {
        this.getRoute()
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        let URL = 'goods/getProductList'
        let obj = {
          page: this.page,
          pageSize: perpage
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.quoteList = this.quoteList.concat(res.data.data)
            this._checkMore(res.data)
          }
        })
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
      showPop(title) {
        this.showMess = title
        this.$refs.pop.show()
        this.$refs.pop.hide()
        return
      },
      chooseItem (id, index) {
        this.checkedId = id
        this.quoteList.forEach((item, i, arr) => {
          if (index === i) {
            arr[i].is_check = true
          } else {
            arr[i].is_check = false
          }
        })
      },
      // 弹窗
      showConfirm() {
        if (!this.currentId) {
          this.showPop('请选择需引用的产品')
          return
        }
        this.$router.push({
          path: `/edit-goods/${this.currentId}`,
          query: {
            is: 0
          }
        })
      },
      confirmBtn() {
        this.$router.push('/shop-manage')
      },
      cancelBtn() {
        this.$refs.confirm.hide()
        location.reload()
      }
    },
    components: {
      FootBtn,
      Scroll,
      Loading,
      NoMore,
      Confirm,
      Pop,
      CheckIcon
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .quote-goods
    position: fixed
    z-index: 200
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: $color-body
    .showData
      height: 100%
      background: $color-white
      flex-between()
      flex-direction: column
    .no-data
      width: 100%
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      padding-top: 186px
      img
        width: 45%
        display: block
        margin: 0 auto
      p
        text-align: center
        font-size: 28px;/*px*/
        color: $color-6
        margin-top: 96px
    .quote-top
      font-size: 26px;/*px*/
      color: $color-ab
      padding: 28px 15px 28px 25px
      line-height: 1.2
      background: $color-f4
      i
        width: 52px;/*px*/
        height: 26px;/*px*/
        background: url('i.png') no-repeat left center
        background-size: 26px auto
        display: inline-block
    .quote-content
      position: relative
      flex: 1
    .quote-title
      width: 100%
      background: $color-white
      padding: 34px 25px
      flex-box-center()
      justify-content: space-between
      font-size: 28px;/*px*/
      .left
        color: $color-orange
        padding-left: 16px
        position: relative
        &:before
          content: ''
          width: 4px;/*px*/
          height: 100%
          background: $color-orange
          position: absolute
          left: 0
          top: 50%
          transform: translateY(-50%)
      .right
        span
          display: inline-block
          vertical-align: middle
          margin-right: 20px
    .quote-list
      width: 100%
      position: absolute
      left: 0
      bottom: 0
      right: 0
      top: 92px
    .main-content
      height: 100%
      overflow: hidden
      .quote-all
        width: 100%
      .quote-div
        display: flex
        margin-bottom: 10px
        padding: 20px 25px
        background: $color-body
        .pic-box
          width: 150px;/*px*/
          img
            width: 150px;/*px*/
            height: 150px;/*px*/
            display: block
        .text-box
          padding: 0 0 0 20px
          position: relative
          flex: 1
          h5
            font-size: 28px;/*px*/
            line-height: 1.2
            text-over(2)
          p
            font-size: 26px;/*px*/
            color: $color-orange
            padding-left: 6px
            margin-top: 12px
        .choose-icon
          position: absolute
          right: 0
          bottom: 0
          label
            color $color-0
            font-weight 700
            display flex
            align-items center
            line-height 40px
            span
              width 36px
              height 36px
              border-radius 50%
              border 1px solid $color-c;/*no*/
              margin-right 12px
              &.active
                background url('./choiced.png') no-repeat center
                background-size 100% 100%
                border none
</style>