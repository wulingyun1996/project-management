<template>
  <div class="union-wrapper">
    <base-scroll
      :hasMore='m_hasMore'
      :scrollPosY='m_scrollPosY'
      :pullup="m_pullup"
      :pulldown="m_pulldown"
      :hasLoading="m_loading"
      :hasRefresh="m_refresh"
      :data="m_dataList">
        <ul class="union-list">
          <li class="union-item" v-for="(acti,index) in m_dataList" :key="index" :class="{timeout:acti.status_activity.code === 6}" @click="goActiDetail(acti.id)">
            <div class="union">
              <div class="acti-img-box">
                <img :src="acti.image_path" alt="">
              </div>
              <div class="acti-title-box">
                <img src="./images/ho-label.png" alt="">
               <div class="acti-title">{{acti.title}}</div>
              </div>
              <div class="joined-brand">
                <div class="less-four">
                  <div class="brand-img-box" v-for="(brand, brandIndex) in acti.brands" :key="brandIndex">
                    <img :src="brand" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div v-if="acti.status_activity.code === 6" class="timeout-mask">
              <img src="./images/timeout-label.png" alt="">
            </div>
          </li>
          <!-- <div v-if="showGetTimeoutUnion" class="getTimeEnd" @click="getTimeoutUnion">
            <p>点击查看已结束活动</p>
            <img src="./images/look-time-end.png" alt="">
        </div> -->
        </ul>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import { mixins } from 'mixins'
export default {
  mixins: [mixins],
  data () {
    return {
      isTimeout: false,
      requestTime: '',
      showGetTimeoutUnion: true,
      end: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      if (!this.m_hasMore) return false
      this.$http('activity/hotLists', {
        page: ++this.m_page,
        time: this.requestTime,
        end: this.end
      }).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = this.m_dataList.concat(res.data)
          this.requestTime = res.data.request_time
          this.m_loading = false
          this.m_hasMore = false
          // this._checkMore(res.data)
        }
      })
    },
    getTimeoutUnion () {
      this.showGetTimeoutUnion = false
      this.end = 1
      this.m_hasMore = true
      this.m_page = 0
      // this.$http('activity/lists', {
      //   page: ++this.m_page,
      //   time: this.requestTime,
      //   end: this.end
      // }).then(res => {
      //   if (res.code === this.$ok) {
      //     this.m_dataList = this.m_dataList.concat(res.data.data)
      //     this._checkMore(res.data)
      //   }
      // })
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
        .acti-img-box
          width 600px
          height 280px
          line-height 0
          font-size 0
          margin 20px auto
          img
            width 600px
            height 280px
        .acti-title-box
          display flex
          justify-content flex-start
          padding 10px 0
          margin-bottom 10px
          img
            width 40px
            height 34px
            margin  0 10px
          .acti-title
            f14()
            color #333
            text-over(2)
        .joined-brand
          width 100%
          .less-four
            display flex
            justify-content flex-start
            // margin 20px 0
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
