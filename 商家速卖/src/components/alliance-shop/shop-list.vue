<template>
  <div class="shop-list-container">
    <scroll class="shop-list-wrapper"
    :scrolling='true'
    @scrollToEnd='getAllianceList'
    :pullup='pullup'
    :data='shopList'
    >
      <div>
        <ul>
          <li @click="goDetail(item.group_id)" v-for="(item, index) in shopList" :key="index">
            <div class="shop-img">
              <img class="stop" src="./stop.png" alt="" v-if="item.status_str === '停用'">
              <img class="alliance-pic" :src="item.image" alt="" v-if="item.image">
              <img class="alliance-pic" src="../../../static/images/seller-sale/logo-light.png" alt="" v-if="!item.image && item.status_str === '启用'">
              <img class="alliance-pic" src="../../../static/images/seller-sale/logo-gray.png" alt="" v-if="!item.image && item.status_str === '停用'">
            </div>
            <div class="shop-desc">
              <h1>商圈名称：<span>{{ item.display_name }}</span></h1>
              <p>圈内商家：<span>{{ item.count }}</span></p>
              <p>服务城市：
                <span>{{ item.addr.province }}</span>
                <span>{{ item.addr.city }}</span>
                <span>{{ item.addr.area }}</span>
              </p>
            </div>
          </li>
        </ul>
        <no-more v-show="!hasMore" message="没有更多了"></no-more>
      </div>
    </scroll>
    <div class="no-shop" v-show="hasData">
      <div>
        <img src="./addshop.png" alt="">
        <p>啊偶~您还没有加入圈子！</p>
      </div>
    </div>
    <div class="circle-description" :class="{active: isPhoneX}" @click="showAlliancePopup"></div>
    <!-- 介绍弹窗 -->
  <base-senior-popup ref="alliancePopup" height="auto" class="alliance-popup">
    <div class="icon-top"></div>
    <p>联盟商圈是多商家联合组建的商圈，商圈可创建发布活动来促销和推广；</p>
    <p>您可查看自己组建的商圈和参与的商圈及详情。</p>
    <div class="icon-bottom" @click="closeAlliancePopup"></div>
  </base-senior-popup>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { loadData, STATUS_OK } from 'api/common'
import NoMore from 'base/no-more/no-more'
import { mapMutations, mapState } from 'vuex'
const perpage = 15
export default {
  name: 'allianceShopList',
  data () {
    return {
      shopList: [],
      hasMore: true,
      page: 0,
      pullup: true,
      hasData: false
    }
  },
  created() {
    // let allianceInfo = this.$root.allianceInfo
    // if (!allianceInfo) {
    //   this.getAllianceList()
    // } else {
    //   let { page, hasMore } = allianceInfo
    //   this.page = page
    //   this.hasMore = hasMore
    //   this.shopList = this.allianceList
    //   if (!this.shopList.length) this.hasData = true
    // }
    this.getAllianceList()
  },
  computed: {
    ...mapState(['allianceList']),
    isPhoneX () {
      return this.$isX
    }
  },
  methods: {
    ...mapMutations(['ADDALLIANCE']),
    showAlliancePopup () {
      this.$refs.alliancePopup.show()
    },
    closeAlliancePopup () {
      this.$refs.alliancePopup.hide()
    },
    getAllianceList () {
      if (!this.hasMore) return
      let url = 'group/sellerPartGroups'
      let obj = {
        page: ++this.page
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.shopList = [...this.shopList, ...res.data.data]
          if (!this.shopList.length) this.hasData = true
          this.ADDALLIANCE(this.shopList)
          this._checkMore(res.data)
          return
        }
        if (res.code === 420) {
          this.hasData = true
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    _checkMore(data) {
      const dataList = data
      if (!dataList.data.length || (dataList.current_page * perpage) >= dataList.total) {
        this.hasMore = false
      }
    },
    goDetail (id) {
      this.$router.push(`/alliance-detail/${id}`)
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.path === '/alliance') {
  //     this.$root.allianceInfo = null
  //     this.$route.meta.y = 0
  //   } else {
  //     let allianceInfo = {}
  //     allianceInfo.page = this.page
  //     allianceInfo.hasMore = this.hasMore
  //     this.$root.allianceInfo = allianceInfo
  //   }
  //   next()
  // },
  components: {
    Scroll,
    NoMore
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.shop-list-container
  position relative
  height 100%
  background $color-white
  .shop-list-wrapper
    height 100%
    overflow hidden
    ul
      padding 0 30px
    li
      display flex
      width 100%
      position relative
      margin-top 28px
      padding 40px
      border-radius(8px)
      &:nth-child(3n+1)
        background #FFF1DC
      &:nth-child(3n+2)
        background #FFEEEE
      &:nth-child(3n+3)
        background #E9F3FF
      .shop-img
        width 184px
        height 184px
        position relative
        .stop
          width 108px
          height 108px
          position absolute
          left 0
          top 0
        .alliance-pic
          width 100%
          height 100%
      .shop-desc
        padding-left 32px
        flex 1
        display flex
        flex-direction column
        justify-content space-around
        align-items start
        font-family: PingFangSC-Regular
        h1
          color $color-3
          font-size 28px;/*px*/
          margin-bottom 66px;
        p
          color $color-6
          font-size 24px;/*px*/
        p:nth-child(even)
          margin-bottom 16px
  .no-shop
    position absolute
    width 100%
    top 0
    height 60%
    background $color-white
    >div
      width 360px
      text-align center
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      img
        margin-bottom 40px
      p
        font-size 28px;/*px*/
        line-height 52px
        color $color-9
  .discard-shop
    position absolute
    width 100%
    top 0
    height 60%
    background $color-white
    >div
      width 504px
      text-align center
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      img
        margin-bottom 40px
      p
        font-size 28px;/*px*/
        line-height 52px
        color $color-9
        .tel
          font-size 36px;/*px*/
          color $color-orange
  .circle-description
    width 208px
    height 116px
    position fixed
    right 0
    bottom 76px
    bg('bg-circle.png')
    &.active
      bottom 110px
  .alliance-popup
    >div
      width 560px!important
      padding 128px 40px 66px
      border-radius(24px)
      overflow unset
      position relative
      background url('./images/bg-alliance.png') no-repeat center bottom #fff
      background-size 100% auto
      p
        f14()
        color $color-3
        line-height 44px
        &:nth-child(1)
          margin-bottom 5px
      .icon-top,
      .icon-bottom
        position absolute
        left 50%
        transform translateX(-50%)
      .icon-top
        top -85px
        width 310px
        height 170px
        bg('icon-alliance.png')
      .icon-bottom
        wh(56px)
        bottom -132px
        padding 20px
        bg('icon-close.png')
        box-sizing content-box
        background-origin content-box
        background-clip content-box
</style>
