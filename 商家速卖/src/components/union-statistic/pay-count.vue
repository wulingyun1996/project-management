<template>
  <scroll 
    class="scroll-content"
    :data="listData"
    ref="scroll" 
    :pullup="pullup" 
    :beforeScroll="beforeScroll" 
    @scrollToEnd="loadMore" 
    >
    <div class="count_list">
      <!-- <div class="item">
        <div class="user_info">
          <div class="wrap"><div class="line_horizontal"></div><div class="user_name">张三</div><div class="phone">13112345678</div></div><span class="card_num">卡号：1231</span>
        </div>
        <div class="time">
          <p>报名时间: <span>2016-10-10</span></p>
        </div>
      </div> -->
      <div class="item" v-for="item in listData">
        <div class="user_info">
          <div class="wrap"><div class="line_horizontal"></div><div class="user_name">{{item.name}}</div><div class="phone">{{item.mobile}}</div></div><span class="card_num">卡号：{{item.ticket}}</span>
        </div>
        <div class="time" v-if="isShowRecommend">
          <p>推荐来源: <span>{{item.salesman_name}}</span></p>
        </div>
        <div class="time" v-if="$route.params.id==='0'">
          <p>参与活动: <span>{{item.actName}}</span></p>
        </div>
        <div class="time">
          <p>报名时间: <span>{{item.time}}</span></p>
        </div>
      </div>
      <loading v-show="hasMore"></loading>
      <no-more v-show="!hasMore && listData.length" message="已加载完"></no-more>
      <div class="space_box"></div>
    </div>
    <no-data :listData="listData"></no-data>
  </scroll>
</template>

<script>
  import {loadData, STATUS_OK} from 'api/common'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  import NoData from './no-data'
  export default {
    components: {
      Scroll,
      NoData,
      Loading,
      NoMore
    },
    data() {
      return {
        listData: [],
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        noData: true,
        loading: true,
        perpage: 10
      }
    },
    computed: {
      isShowRecommend() {
        return this.$store.state.isShowRecommend
      }
    },
    created() {
      this.getListData()
    },
    methods: {
      getListData() {
        loadData('analytics/getPay', {
          actId: this.$route.params.id,
          distributor: this.$route.query.shopid === undefined ? '' : this.$route.query.shopid,
          salesman: this.$route.query.salesmanid === undefined ? '' : this.$route.query.salesmanid,
          pageSize: this.perpage,
          page: this.page
        }).then((data) => {
          if (data.code === STATUS_OK) {
            this.listData = this.listData.concat(data.data.data)
            this._checkMore(data.data)
          }
        })
      },
      loadMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this.getListData()
      },
      _checkMore(data) {
        const dataList = data
        if (!dataList.data.length || (this.page * this.perpage) >= dataList.count) {
          this.hasMore = false
        }
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
.container
  .scroll-content
    overflow hidden
    .no-data
      text-align center
      margin-top 220px
  .space_box
    height 90px
    background transparent
.inp_select_act
  width 100%
  height 70px
  padding-left 25px
  border-radius 5px
.mess-arrow
  background: #ffffff url('./bottom_arrow.png') no-repeat right 20px center
  background-size: 12px auto;/*px*/
.count_list
  margin-top 20px
  .item
    background $color-white
    padding 20px
    border-bottom #dfdfdf 1px solid
    .user_info
      display flex
      justify-content space-between
      .wrap
        display flex
        font-size 26px;/*px*/
      .card_num
        color #ff9933
        font-size 24px
      .line_horizontal
        width 4px
        height 24px
        background #ff8a00
        margin-right 20px
      .user_name
        margin-right 60px
        width 220px
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    .time
      color $color-9
      margin-top 20px
      margin-left 24px
</style>

