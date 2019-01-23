<template>
  <div class="shop-list-container" :class="{ active: !shopList.length || isDissolution }">
    <scroll class="shop-list-wrapper"
    :scrolling='true'
    @scrollToEnd='getAllianceList'
    :pullup='pullup'
    :data='shopList'
    >
      <div>
        <ul>
          <li @click="goDetail(item.seller_id)" v-for="(item, index) in shopList" :key="index">
            <div class="shop-img">
              <img class="stop" src="./stop.png" alt="" v-if="item.status_str === '停用'">
              <img class="alliance-pic" :src="item.shop_logo_path" alt="" v-if="item.shop_logo_path">
              <img class="alliance-pic" src="../../../static/images/seller-sale/logo-light.png" alt="" v-if="!item.shop_logo_path && item.status_str === '启用'">
              <img class="alliance-pic" src="../../../static/images/seller-sale/logo-gray.png" alt="" v-if="!item.shop_logo_path && item.status_str === '停用'">
            </div>
            <div class="shop-desc">
              <h1>店铺名称：<span>{{ item.shop_name }}</span></h1>
              <p>所属圈子数：<span>{{ item.count }}</span></p>
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
    <div class="no-shop" v-if="!shopList.length">
      <div>
        <img src="./addshop.png" alt="">
        <p>啊偶~还没有商家加入圈子！</p>
      </div>
    </div>
    <div class="discard-shop" v-show="isDissolution">
      <div>
        <img src="./noshop.png" alt="">
        <p>您的圈子已被解散，如有疑问请联系平台
            客服电话：<span class="tel">{{ servicePhone }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import NoMore from 'base/no-more/no-more'
import { loadData, STATUS_OK } from 'api/common'
import { mapMutations, mapState } from 'vuex'
const perpage = 15
export default {
  name: 'shopList',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      to.meta.title = vm.$root.allianceName
    })
  },
  data () {
    return {
      shopList: [],
      hasMore: true,
      page: 0,
      pullup: true,
      isDissolution: false,
      servicePhone: ''
    }
  },
  created () {
    let allianceInfo = this.$root.allianceInfo
    if (!allianceInfo) {
      this.getAllianceList()
    } else {
      let { page, hasMore } = allianceInfo
      this.page = page
      this.hasMore = hasMore
      this.shopList = this.allianceList
    }
  },
  computed: {
    ...mapState(['allianceList', 'allianceName'])
  },
  methods: {
    ...mapMutations(['ADDALLIANCE']),
    goDetail (id) {
      this.$router.push(`/alliance-shop-detail/${id}`)
    },
    getAllianceList () {
      if (!this.hasMore) return
      let url = 'group/unionGroup'
      let obj = {
        page: ++this.page
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.shopList = [...this.shopList, ...res.data.data]
          this.ADDALLIANCE(this.shopList)
          this._checkMore(res.data)
          return
        }
        if (res.code === 600) {
          this.isDissolution = true
          this.servicePhone = res.message
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
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/alliance') {
      this.$root.allianceInfo = null
      this.$route.meta.y = 0
    } else {
      let allianceInfo = {}
      allianceInfo.page = this.page
      allianceInfo.hasMore = this.hasMore
      this.$root.allianceInfo = allianceInfo
    }
    next()
  },
  components: {
    Scroll,
    NoMore
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable"
.shop-list-container
  position relative
  height 100%
  &.active
    background #fff
  .shop-list-wrapper
    height 100%
    overflow hidden
    li
      display flex
      width 100%
      position relative
      padding 22px 16px
      background $color-white
      margin-bottom 20px
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
</style>
