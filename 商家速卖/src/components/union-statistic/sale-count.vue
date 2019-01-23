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
      <div class="item" v-for="item in listData">
        <div class="left">
          <p class="num">卡号：{{item.ticket}}</p>
          <p class="name">{{item.name}}<br />{{item.mobile}}</p>
        </div>
        <div class="right">
          <h5 v-if="isShowRecommend">推荐来源：{{item.salesman_name}}</h5>
          <h5 v-if="$route.params.id==='0'">参与活动：{{item.actName}}</h5>
          <h5>报名方式：{{item.type===0?'线上':'线下'}}</h5>
          <p>销售金额：{{item.sales}}元<br />定金金额：{{item.deposit}}元</p>
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
  import NoData from './no-data'
  import NoMore from 'base/no-more/no-more'
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
        loadData('analytics/getAccount', {
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
.scroll-content
  padding 0 26px
  overflow hidden
  padding-top 20px
  .no-data
    text-align center
    margin-top 220px
.space_box
  height 90px
  background transparent
.count_list
  .item
    display: flex
    background: #ffa722 url('./li-bg.png') no-repeat right top
    background-size: auto 100%
    border-radius: 10px
    padding: 18px 0 18px 24px
    margin-bottom: 25px
    .left
      width: 42%
      .num
        font-size: 24px;/*px*/
        color: #ffe1b4
      .name
        font-size: 28px;/*px*/
        color: $color-white
        margin-top: 32px
        line-height: 1.3
    .right
      font-size: 24px;/*px*/
      padding-top: 32px
      flex: 1
      h5
        color: $color-white
        padding-bottom: 16px
        border-btm()
        &:after
          content: ''
          width: 146%
          background: #cc6633
      p
        color: #ac5a31
        line-height: 1.5
        margin-top: 1%
</style>

