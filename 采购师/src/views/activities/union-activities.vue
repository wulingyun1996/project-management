<template>
  <div class="union-wrapper">
    <div v-if="hasNoData" class="no-data">
      <img src="./images/nodata.png" alt="">
      <p>暂无活动~</p>
    </div>
    <base-scroll
      v-if="!hasNoData"
      :hasMore="bothHasMore"
      :pullup="m_pullup"
      :hasLoading="m_loading"
      :hasRefresh="m_refresh"
      @scrollToEnd="getData"
      :data="m_dataList">
        <ul class="union-list">
          <li class="union-item" v-for="(acti,index) in m_dataList" :key="index" :class="{timeout:acti.status_activity.code === 6}" @click="goActiDetail(acti.id)">
            <div class="union">
              <div class="circle-info">
                <img src="./images/icon-circle.png" alt="">
                <p>{{ acti.union_name }}</p>
              </div>
              <div class="acti-img-box">
                <img :src="acti.image_path" alt="">
              </div>
              <div class="acti-title-box">
                <!-- <img src="./images/ho-label.png" alt=""> -->
               <!-- <div class="acti-title">{{acti.title}}</div> -->
               <span>{{acti.title}}</span>
              </div>
              <!-- <div class="joined-brand">
                <div class="less-four">
                  <div class="brand-img-box" v-for="(brand, brandIndex) in acti.brands" :key="brandIndex">
                    <img :src="brand" alt="">
                  </div>
                </div>
              </div> -->
              <div class="acti-address">
                <img src="./images/icon-addresser.png" alt="">
                <p>{{ acti.address }}</p>
              </div>
              <div class="acti-time">
                <div class="time-left">
                  <img src="./images/icon-time.png" alt="">
                  <p>{{ acti.start_at.substr(5, 11) }} 至 {{ acti.end_at.substr(5, 11) }}</p>
                </div>
                <div class="price-right" v-if="acti.cost - 0 != 0">
                  ￥{{ acti.cost }}
                </div>
                <div v-else class="price-right">免费</div>
              </div>
            </div>
            <div v-if="acti.status_activity.code === 6" class="timeout-mask">
              <img src="./images/timeout-label.png" alt="">
            </div>
          </li>
          <div v-if="showGetTimeoutUnion" class="getTimeEnd" @click="getTimeoutUnion">
            <p>点击查看已结束活动</p>
            <img src="./images/look-time-end.png" alt="">
        </div>
        </ul>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import { mixins } from 'mixins'
import {invokeNativeMethod, updateLocation} from 'native'
export default {
  mixins: [mixins],
  data () {
    return {
      isTimeout: false,
      requestTime: '',
      showGetTimeoutUnion: true,
      end: 0,
      timeIn: false,
      timeOut: false
    }
  },
  created () {
    this.getData()
    invokeNativeMethod('setAppBottomTab', 1)
    invokeNativeMethod('navigationItem', JSON.stringify({}))
    window.refreshWebView = this.refreshWebView
  },
  methods: {
    refreshWebView () {
      updateLocation().then(res => {
        this.m_hasMore = true
        this.end = 0
        this.m_page = 0
        this.m_dataList = []
        this.getData()
      })
    },
    getData () {
      if (!this.m_hasMore) return false
      this.$http('activity/lists', {
        page: ++this.m_page,
        time: this.requestTime,
        end: this.end
      }).then(res => {
        if (res.code === this.$ok) {
          if (!this.end) {
            this.timeIn = res.data.total === 0
            if (this.timeIn) {
              this.getTimeoutUnion()
              return
            }
          }
          if (this.end) {
            this.timeOut = res.data.total === 0
          }
          this.m_refresh = false
          this.m_dataList = this.m_dataList.concat(res.data.data)
          this.requestTime = res.data.request_time
          this._checkMore(res.data)
        } else {
          this.timeIn = true
          this.timeOut = true
        }
      })
    },
    getData1 () {
      this.m_refresh = true
      this.m_hasMore = true
      this.m_page = 0
      this.end = 0
      this.requestTime = ''
      this.m_dataList = []
      this.showGetTimeoutUnion = true
      this.getData()
    },
    getTimeoutUnion () {
      this.showGetTimeoutUnion = false
      this.end = 1
      this.m_hasMore = true
      this.m_page = 0
      this.getData()
    },
    goActiDetail (id) {
      this.$router.push({
        path: '/unionDetail',
        query: {
          id
        }
      })
    }
  },
  computed: {
    hasNoData () {
      return this.timeIn && this.timeOut
    },
    bothHasMore () {
      return this.m_hasMore
    }
  },
  components: {
    BaseScroll
  }
}

</script>
<style  scoped lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.union-wrapper
  height 100%
  background #f5f5f5
  .no-data
    display flex
    justify-content center
    align-items center
    flex-direction column
    padding 40px 0
    img
      width 270px
      height 284px
    p
      color #999
      font-size 28px
      margin-top 64px
      text-align center
  .union-list
    height 100%
    padding 30px
    .union-item
      border-radius(20px)
      background #fff
      margin-bottom 30px
      .union
        display flex
        flex-direction column
        justify-content center
        // align-items center
        padding 20px
        .circle-info
          display flex
          align-items center
          margin-left 20px
          img
            width 24px
            height 24px
            margin-right 12px
          p
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #999999
            letter-spacing: 0
            text-over(1)
            line-height 1.2
        .acti-img-box
          width 620px
          height 280px
          line-height 0
          font-size 0
          margin 20px auto
          img
            width 620px
            height 280px
        .acti-title-box
          display flex
          justify-content flex-start
          padding 10px 0 10px 20px
          margin-bottom 10px
          img
            width 40px
            height 34px
            margin  0 10px
          span
            // f14()
            // color #333
            // text-over(2)
            // overflow unset
            font-family: PingFangSC-Medium
            font-size: 32px
            color: #333333
            text-over(1)
            line-height 40px
        .acti-address
          display flex
          align-items center
          padding-left 20px
          img
            width 20px
            height 22px
            margin-right 10px
          p
            font-family: PingFangSC-Regular
            font-size: 24px
            color: #999999
            letter-spacing: 0
        .acti-time
          display flex
          align-items center
          justify-content space-between
          padding 20px 20px
          .time-left
            display flex
            align-items center
            img
              width 20px
              height 20px
              margin-right 10px
            p
              font-family: PingFangSC-Regular
              font-size: 24px
              color: #999999
              letter-spacing: 0
          .price-right
            font-family: PingFangSC-Medium
            font-size: 32px
            color: #F63F55
            letter-spacing: 0
        .joined-brand
          width 100%
          .less-four
            display flex
            justify-content flex-start
            margin 0px auto
            width 544px
            flex-flow wrap
            .brand-img-box
              width 124px
              height 102px
              font-size 0
              line-height 0
              display flex
              justify-content center
              align-items center
              border-radius(8px)
              margin-right 10px
              bd(#f4f4f4)
              img
                width 108px
                height 52px
      &.timeout
        position relative
        .timeout-mask
          position absolute
          top: 0
          right 0
          left 0
          bottom 0
          background rgba(0,0,0,0.2)
          img
            position absolute
            right 60px
            top 60px
            width 200px
            height 164px
  .getTimeEnd
    text-align center
    margin-top:30px
    p
      f16()
      color #666
      text-align center
      margin-bottom 10px
    img
      width 40px
      heig 12px
</style>
