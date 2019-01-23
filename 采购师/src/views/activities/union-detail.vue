<template>
  <div class="unionDetail">
    <div class="acti-info-box">
      <div class="acti-img-box">
        <img :src="mainImg" alt="">
        <div class="acti-title">{{ title }}</div>
      </div>
      <div class="acti-info">
        <div class="acti-info-item">
         <div class="acti-time">
          <img src="./images/icon-clock.png" alt="">
          <span>{{ startTime }}</span>
          至
          <span>{{ endTime }}</span>
         </div>
         <div v-if="actiPrice - 0 != 0" class="acti-price">￥{{ actiPrice }}</div>
         <div v-else class="acti-price">免费</div>
        </div>
        <div class="acti-address">
          <img src="./images/icon-address-blue.png" alt="">
          <span>{{ address }}</span>
        </div>
      </div>
    </div>
    <div class="union-img-detail" v-html="description">
    </div>
    <div class="placeholder1"></div>
    <div class="placeholder2"></div>
    <div v-if="actiStatus !== 6 && actiStatus !== 2" class="btn-sign ipone-x-absolute-bottom1" @click="goSignupInfo">立即报名</div>
    <div v-if="actiStatus === 6 " class="btn-sign timeout ipone-x-absolute-bottom1">活动已结束</div>
    <div v-if="actiStatus === 2 || actiStatus === 3" class="btn-sign timeout ipone-x-absolute-bottom1">活动已下架</div>
  </div>
</template>

<script>
import { nativeBackAndShare, nativeBack, invokeNativeMethod, closeWebview } from 'native'
import { sliceChar, smallPic } from 'common'
export default {
  data () {
    return {
      id: this.$route.query.id,
      title: '',
      mainImg: '',
      startTime: '',
      endTime: '',
      actiPrice: 0,
      address: '',
      actiStatus: 4,
      description: '',
      recommendId: '',
      salesmanId: '',
      h5Router: false
    }
  },
  created () {
    this.getUnionDetail().then(() => {
      let { actiStatus, title } = this
      if (actiStatus === 4 || actiStatus === 5) {
        invokeNativeMethod('setTitle', title)
        nativeBackAndShare()
        window.navback = this.navBack
        window.share = this.share
      } else {
        nativeBack(title)
      }
    })
  },
  computed: {
    // 是否是爆款商品轮播图跳过来的
    bannerListUrl () {
      return this.$route.query.bannerListUrl
    }
  },
  beforeRouteEnter (to, from, next) {
    let regRouteName = /CircleDetail|hotActivities|AnnouncementDetail|MyActivity|ShopDetail/
    next(vm => {
      if (regRouteName.test(from.name)) {
        vm.h5Router = true
      }
    })
  },
  methods: {
    async getUnionDetail () {
      await this.$http('activity/detail', {
        id: this.id
      }).then(res => {
        if (res.code === 200) {
          var data = res.data
          this.mainImg = data.image_path
          this.title = sliceChar(data.title, 8)
          this.startTime = data.start_at.substr(5, 11)
          this.endTime = data.end_at.substr(5, 11)
          this.actiPrice = data.cost
          this.address = data.province + data.city + data.area + data.address
          this.actiStatus = data.status_activity.code
          this.description = data.description
          this.recommendId = data.recommend_id
          this.salesmanId = data.salesman_id || 0
        }
      })
      return Promise.resolve()
    },
    goSignupInfo () {
      this.$router.push({
        path: '/signupInfo',
        query: {
          id: this.id
        }
      })
    },
    navBack () {
      if (this.bannerListUrl === '1') {
        this.$router.push({ path: '/hot-goods', query: { fromNative: 1 } })
        return
      }
      if (this.h5Router) {
        this.$router.back(-1)
      } else {
        closeWebview()
      }
    },
    share () {
      this.$http('activity/recommend', {
        id: this.id
      })
      let url = `/pages/unionDetail/main?id=${this.id}&recommendId=${this.recommendId}&salesmanId=${this.salesmanId}`
      let obj = {
        type: 4,
        url,
        title: this.title,
        discriable: this.title,
        imgUrl: smallPic(this.mainImg, 400, 400),
        from: 3,
        actId: this.id
      }
      invokeNativeMethod('share', JSON.stringify(obj))
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.unionDetail
  height 100%
  width 100%
  background #f5f5f5
  .acti-info-box
    display flex
    flex-direction column
    justify-content space-between
    align-items center
    background #fff
    padding 30px 0
    .acti-img-box
      width 692px
      height 300px
      font-size 0
      line-height 0
      position relative
      img
        width 692px
        height 300px
      .acti-title
        position absolute
        left 0
        right 0
        bottom 0
        height 76px
        background rgba(0,0,0,.5)
        color #fff
        f14()
        line-height 76px
        text-indent 30px
    .acti-info
      width 692px
      color #333
      f14()
      .acti-info-item
        display flex
        justify-content space-between
        padding 20px 0 10px 0
        .acti-time
          img
            width 28px
            vertical-align middle
        .acti-price
          f16()
          color #D70110
      .acti-address
        display flex
        justify-content flex-start
        align-items flex-start
        img
          width 26px
          vertical-align top
          margin-right 5px
        span
          text-over(2)
          width 630px
  .union-img-detail
    margin-top 30px
    background #fff
    width 100%
    f16()
  .placeholder1
    height 92px
    width 100%
  .placeholder2
    position fixed
    left 0
    right 0
    bottom 0
    background #fff
    height 92px
    width 100%
  .btn-sign
    position fixed
    width 100%
    height 92px
    background #D70110
    color #fff
    f18()
    text-align center
    line-height 92px
    bottom 0
    &.timeout
      background #ccc
</style>
