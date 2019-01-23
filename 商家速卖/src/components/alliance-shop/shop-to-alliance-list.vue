<template>
  <div class="shop-list-container">
    <scroll class="shop-list-wrapper"
      :scrolling='true'
      :data='shopList'>
      <div>
        <ul>
          <li v-for="(item, index) in shopList" :key="index">
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
    <div class="no-shop" v-show="hasData">
      <div>
        <img src="./addshop.png" alt="">
        <p>啊偶~还没有商家加入圈子！</p>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import NoMore from 'base/no-more/no-more'
import { loadData, STATUS_OK } from 'api/common'
const perpage = 15
export default {
  name: 'shopToAllianceList',
  data () {
    return {
      shopList: [],
      hasMore: true,
      page: 0,
      pullup: true,
      hasData: false
    }
  },
  created () {
    this.getAllianceList()
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    getAllianceList () {
      if (!this.hasMore) return
      let url = 'group/getAllSeller'
      let obj = {
        'group_id': this.id,
        page: ++this.page
      }
      loadData(url, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.shopList = [...this.shopList, ...res.data.data]
          if (!this.shopList.length) this.hasData = true
          this._checkMore(res.data)
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
  components: {
    Scroll,
    NoMore
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/variable.styl"
.shop-list-container
  position relative
  height 100%
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
