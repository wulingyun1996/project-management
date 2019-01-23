<template>
  <div class="myOrder-wrap">
    <div>
      <div class="order-header">
        <div class="header-drop-down">
          <div class="choosed-category" @click="selectRole">
            <span>{{ currentBuyerRole }}</span>
          </div>
          <div class="role-list" v-show="isShowRole">
            <ul>
              <li
                :class="{ active: currentBuyerRole === role.name }"
                v-for="(role, index) in buyerRoles"
                :key="index"
                @click="comfirmRole(role.name, role.type)">
                {{ role.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="seperate"></div>
        <base-scroll
          ref="headerWrap"
          direction="horizontal"
          :has-more="true">
          <ul ref="tabList">
            <li v-for="(item, index) in tabCount" :key="index" @click="selectTab(item.state, index)">
              <span class="text" :class="{ 'active': currentIndex === index }">{{ item.text }}
              <span class="line" :class="{ 'active': currentIndex === index }"></span>
                <i v-show="item.count" class="pops">{{ item.count }}</i>
              </span>
            </li>
          </ul>
        </base-scroll>
      </div>
      <!-- <div class="header-wrap" ref="headerWrap">
        <scroll class="scroll-wrapper" direction="horizontal" ref="scroll">
          <div class="scroll-content">
            <ul ref="tabList">
              <li v-for="(item, index) in tabCount" @click="selectTab(item.state, index)">
                <span class="text" :class="{'active': currentIndex === index}">{{item.text}}
                <span class="line" :class="{'active': currentIndex === index}"></span>
                  <i v-show="item.count" class="pops">{{item.count}}</i>
                </span>
              </li>
            </ul>
          </div>
          <div class="select-box-wrapper">
            <div class="select-box-content">
              <div class="select-box-main" @click="selectRole">
                <span>{{ currentBuyerRole }}</span>
                <span class="select-icon"></span>
              </div>
              <div class="select-box-tab" v-show="isShowRole">
                <p v-for="role in buyerRoles" @click="comfirmRole(role.name, role.type)">{{ role.name }}</p>
              </div>
            </div>
          </div>
        </scroll>
      </div> -->
      <div class="content-wrap">
        <scrollloadcontent
          v-show="(!noData) && loading"
          class="content-c"
          :data="data"
          :pulldown="pulldown"
          :pullup="pullup"
          :currentIndex="currentIndex"
          @pulldown="pulldownRefresh"
          @scrollToEnd="LoadMore">
          <div>
            <div style="overflow:hidden;height:100%">
              <!-- 在下拉刷新的时候会有提示信息 -->
              <Loading :class="refresh ? 'show' : 'hide'"></Loading>
              <div>
                <div class="content-item" v-for="(sellers, index) in data">
                  <!-- 订单编号及买家 -->
                  <div class="buyer-info"><span class="sn">订单编号:{{sellers.order_sn}}</span></div>
                  <div class="order-info">
                    <div class="order-role-type">
                      <span class="buyer">{{sellers.buyer.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}}</span>
                      <span class="role-type common-buyer" v-show="sellers.user_type === 4"></span>
                      <span class="role-type cgs-buyer" v-show="sellers.user_type === 1"></span>
                      <span class="role-type svip-buyer" v-show="sellers.user_type === 5"></span>
                    </div>
                    <span class="display-name">{{sellers.display_name}}</span>
                  </div>
                  <!-- 购买的商品列表 -->
                  <div class="list">
                    <div class="item" v-for="goods in sellers.goods">
                      <!-- 注册点击事件，路由的编程式导航实现跳转到商品详情页 -->
                      <div class="order-list" @click="goDetail(index, sellers.id)">
                        <div class="info-left">
                          <img :src="goods.image_path"/>
                          <img v-show="goods.activity_type === 2" src="./images/hot.png" alt="">
                          <img v-show='goods.activity_type === 1' src="./images/limit.png" alt="">
                        </div>
                        <div class="info-main">
                          <div class="title-price item-info">
                            <span class="goods-title">{{goods.goods_name}}</span>
                          </div>
                          <div class="price-wrap item-info">
                            <p class="goods-price">￥{{goods.goods_price}}</p>
                            <p class="original-price" v-if="goods.original_price">￥{{goods.original_price}}</p>
                          </div>
                          <div class="prop-count item-info">
                            <div class='shop'>
                              <span v-show="goods.is_stock_good === 1">现货</span>
                              <span v-show="goods.boutique === 1">精品馆</span>
                              <span v-show="goods.material === 1">材料馆</span>
                            </div>
                            <span class="goods-prop">{{goods.spec_name}}</span>
                            <span class="goods-count">×{{goods.goods_num}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="total-bar">
                      <div class="all-price">
                        <span class="num">共{{sellers.goods_num}}件货品 实付款：</span>
                        ￥<span class="big">{{sellers.priceInt}}</span>.{{sellers.priceFloat}}
                        <span class="num">{{sellers.free}}</span>
                      </div>
                      <!-- 路由编程式导航，跳转对应的路由 -->
                      <div class="btn-wrap">
                        <div class="btn" v-if="sellers.order_status === 20" @click="cancelOrder(index, sellers.id)">取消订单</div>
                        <div class="btn" v-if="sellers.order_status === 20" @click="editPrice(index, sellers.id)">修改价格</div>
                        <div class="btn" v-if="sellers.order_status === 30" @click="sendOut(index, sellers.id)">发货</div>
                        <div class="btn" v-if="sellers.order_status === 40 && sellers.delivery_id !== 21" @click="goLogistics(index, sellers.id, sellers.order_sn)">查看物流</div>
                        <div class="btns" v-if="sellers.order_status === 40 && sellers.delivery_id === 21" >发货方式: 自提</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 如果数据数量很大，那么该选项一直显示，只是没有看到，只有在上拉的时候才会显示，算是一个 bug-->
              <loading v-show="hasMore" title=""></loading>
              <noMore v-if="!hasMore" message="没有更多了"></noMore>
            </div>
          </div>
        </scrollloadcontent>
      </div>
      <noData id="noData" v-show="noData && loading" text="没有数据"></noData>
    </div>
  </div>
</template>

<script>
import confirm from 'base/confirm/confirm'
import NoResult from 'base/no-result/no-result'
import Loading from 'base/loading/loading'
import noMore from 'base/no-more/no-more'
import noData from 'base/no-data'
import scrollloadcontent from 'base/scroll/scrollloadcontent'
import { loadData, STATUS_OK } from 'api/common'
import { PopupPicker } from 'vux'
import { mapMutations, mapGetters } from 'vuex'
const tabCount = [
  {
    text: '全部',
    count: 0,
    state: '0',
    status: 'all'
  },
  {
    text: '待付款',
    count: 0,
    state: '20',
    status: 'waitPayment'
  },
  {
    text: '待发货',
    count: 0,
    state: '30',
    status: 'waitDelivery'
  },
  {
    text: '待收货',
    count: 0,
    state: '40',
    status: 'waitReceiving'
  },
  // {
  //   text: '交易成功',
  //   count: 0,
  //   state: '50',
  //   status: 'success'
  // },
  {
    text: '订单异常',
    count: 0,
    state: '70',
    status: 'abnormal'
  }
]
const buyerRoles = [
  {
    name: '全部买家',
    type: 0
  },
  {
    name: '采购师',
    type: 1
  },
  {
    name: '普通买家',
    type: 4
  }
]

export default {
  name: 'orderList',
  data() {
    return {
      // loading在mounted初始化的时候回置为 true；
      loading: false,
      // 显不显示滚动区域组件，主要是由该数据来决定的；
      noData: Boolean,
      noDataSrc: require('./nodata@2x.png'),
      tabCount,
      data: [], // 下拉加载更多
      pullup: true, // 上拉加载
      pulldown: true,
      hasMore: true,
      count: {},
      state: '',
      page: 1,
      pageSize: 20,  // 一次加载条数
      noMore: false,
      refresh: false,
      abnormal_reason: '',
      // 买家身份
      currentBuyerRole: '全部买家',
      isShowRole: false,
      buyerRoles,
      // 当前身份类型
      currentRoleType: 0,
      currentIndex: ''
    }
  },
  created() {
    this.currentIndex = Number(this.$route.query.currentIndex)
  },
  mounted() {
    this.$nextTick(() => {
      this._initTabListWidth()
    })
    if (this.currentIndex === 0) {
      this.state = 0
    }
    if (this.currentIndex === 1) {
      this.state = 20
    }
    if (this.currentIndex === 2) {
      this.state = 30
    }
    if (this.currentIndex === 3) {
      this.state = 40
    }
    if (this.currentIndex === 4) {
      this.state = 50
    }
    if (this.currentIndex === 5) {
      this.state = 70
    }
    // 在第一次加载以及刷新列表页的时候弥补路由监听的不足
    this.loadData().then(() => {
      this.loading = true
    })
  },
  watch: {
    // 监听路由的变化,之所以会发送两次 ajax 请求，是因为加载一次，路由这里又会发送一次
    '$route'(to, from) {
      if (to.path === '/order-list' && this.orderInfo.hasOwnProperty('id')) {
        const URL = `order/distributor/detail`
        let obj = {
          id: this.orderInfo.id
        }
        loadData(URL, obj).then(res => {
          if (res.code === STATUS_OK) {
            this.splitPrices(res.data)
            this.data.splice(this.orderInfo.index, 1, res.data)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters(['orderInfo'])
  },
  methods: {
    ...mapMutations(['SET_ORDER_INFO']),
    // 将 商品的索引和 id 存放到 vuex 中，只要是修改了其数据，计算属性(orderInfo)就能够更新；
    _storage (index, id) {
      this.SET_ORDER_INFO({
        index: index,
        id: id
      })
    },
    selectRole () {
      this.isShowRole = !this.isShowRole
    },
    comfirmRole (name, type) {
      this.currentBuyerRole = name
      this.currentRoleType = type
      this.isShowRole = false
      this.loadData(undefined, type).then(() => {
        this.loading = true
      })
    },
    // 获取 tap 栏的总宽度；
    _initTabListWidth () {
      const wrapper = document.querySelector('.scroll-content')
      const tabList = this.$refs.tabList
      const items = tabList.children
      let width = 0
      for (let i = 0; i < items.length; i++) {
        width += items[i].clientWidth
      }
      tabList.style.width = (width + 10) + 'px'
      wrapper.style.width = (width + 10) + 'px'
    },
    _adjust (tabId) {
      const viewportWidth = this.$refs.headerWrap.$el.clientWidth
      const tabListWidth = this.$refs.tabList.clientWidth
      const minTranslate = Math.min(0, viewportWidth - tabListWidth)
      const middleTranslate = viewportWidth / 2
      const items = this.$refs.tabList.children
      let width = 0
      this.tabCount.every((item, index) => {
        if (index === tabId) {
          return false
        }
        width += items[index].clientWidth
        return true
      })
      let translate = middleTranslate - width
      translate = Math.max(minTranslate, Math.min(0, translate))
      // translate = tabId <= 1 ? translate : translate - 190
      // this.$refs.scroll.scrollTo(translate, 0, 300)
      this.$refs.headerWrap.scrollTo(translate, 0, 300)
    },
    // 点击滑动
    selectTab (state = '', index = 0) {
      // 01-添加：如果多次点击当前 tap ，取消发送 ajax 请求；
      if (this.currentIndex === index) return
      this.loadData(state).then(() => {
        this.loading = true
      })
      this.state = state
      // 修改索引和state状态；
      this.currentIndex = index
      // 调整横向tap栏位置；
      this._adjust(index)
    },
    // 编程式导航，跳转路由并且存储当前商品信息到 vuex；
    editPrice (index, id) {
      this._storage(index, id)
      this.$router.push({
        path: '/order-edit-price/' + id
      })
    },
    cancelOrder (index, id) {
      this._storage(index, id)
      this.$router.push({
        path: '/order-cancel-order/' + id
      })
    },
    sendOut (index, id) {
      this._storage(index, id)
      this.$router.push({
        path: '/order-send-out/' + id
      })
    },
    goLogistics (index, id, orderCode) {
      this._storage(index, id)
      this.$router.push({
        path: '/order-logistics-details/' + id,
        query: { orderCode }
      })
    },
    _checkMore (data) {
      const song = data
      if (!song.data.length || song.current_page * song.per_page >= song.total) {
        this.hasMore = false
      }
    },
    splitPrice (data) {
      data.forEach(val => {
        let priceArr = val.pay_price.split('.')
        val.priceInt = priceArr[0]
        val.priceFloat = priceArr[1]
      })
    },
    splitPrices (data) {
      let priceArr = data.pay_price.split('.')
      data.priceInt = priceArr[0]
      data.priceFloat = priceArr[1]
    },
    loadData (status = this.state, type = this.currentRoleType) {
      const URL = 'order/distributor'
      this.page = 1
      this.hasMore = true
      let obj = {
        status,
        type
      }
      return loadData(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          let resData = res.data
          let data = resData.data
          this.data = Object.assign([], data)
          this.status = status
          this.refresh = false
          this.page = 1
          this.noData = this.data.length === 0 ? 1 : 0
          this.hasData = this.data.length === 0 ? 0 : 1
          this.splitPrice(this.data)
          this.getCount(resData)
          this._checkMore(resData)
          return Promise.resolve()
        }
      })
    },
    // 上拉加载更多
    LoadMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      const URL = 'order/distributor'
      let obj = {
        status: this.status,
        page: this.page
      }
      loadData(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          let resData = res.data
          let data = resData.data
          // 合并数据；
          this.data = this.data.concat(data)
          this.splitPrice(this.data)
          this.getCount(resData)
          this._checkMore(resData)
        }
      })
    },
    pulldownRefresh () {
      this.refresh = true
      setTimeout(() => {
        this.loadData()
      }, 2000)
    },
    getCount (res) {
      let COUNT = this.count = res.count
      for (let key in COUNT) {
        // 目的就是将tabCount中的数量同步；
        this.tabCount.forEach(v => {
          if (key === v.status) {
            v.count = COUNT[key]
          }
        })
      }
    },
    goDetail (index, id) {
      this._storage(index, id)
      this.$router.push({
        path: '/order-detail/' + id
      })
    }
  },
  components: {
    confirm,
    PopupPicker,
    scrollloadcontent,
    NoResult,
    Loading,
    noMore,
    noData
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
$pl = 24px
.myOrder-wrap
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .order-header
    bd-b(#e5e5e5)
    background $color-white
    height 92px
    fz(15px)
    padding-left $pl
    flex-f-align()
    .header-drop-down
      min-width 160px
      height 100%
      color $color-orange
      position relative
      .choosed-category
        width 100%
        height 100%
        flex-center()
        // flex-align-item()
        background url('./images/arrow-down.png') no-repeat right center
        background-size 16px auto
        padding-right 20px
      .role-list
        position absolute
        // width 160px
        left 0
        right 0
        top 75px
        background rgba(0, 0, 0, .65)
        padding 14px 0
        border-radius(8px)
        overflow unset
        &:after
          content ''
          position absolute
          width 0
          height 0
          border 10px solid transparent
          border-bottom 10px solid rgba(0, 0, 0, .65)
          // bd(transparent, 5px)
          // bd-b(rgba(0, 0, 0, .65), 5px)
          left 20px
          top -20px
        li
          color #fff
          f13()
          padding 14px
          &.active
            color $color-orange
    .seperate
      width 1px;/*no*/
      height 30px
      background $color-orange
      margin 0 20px
    .scroll-container
      flex 1
      height 100%
      overflow hidden
      li
        display inline-block
        padding: 0 40px
        text-align: center
        position: relative
        .text
          display: inline-block
          position: relative
          line-height: 92px
          height: 92px
          font-size: 30px; /*px*/
          color: #000
          &.active
            // border-bottom: 1px solid $color-orange
            color: $color-orange
          .pops
            display: inline-block
            position: absolute
            right: -30px;
            top: 6px;
            height: 24px; /*px*/
            line-height: 24px; /*px*/
            padding: 1px 10px; /*px*/
            font-size: 20px; /*px*/
            border-radius: 10px;
            background-color: $color-orange
            color: $color-white
            font-style: normal
        .line
          display: none
          width: 56px; /*px*/
          height: 4px;
          background-color: $color-orange
          position: absolute
          bottom: 0
          left: 50%
          margin-left: -28px; /*px*/
          z-index: 99
          border-radius: 10px
          &.active
            display: inline-block
  .headerRight
    width: 36px; /*px*/
    height: 36px; /*px*/
    bg-image('top-mes-icon')
  .header-wrap
    border-bottom: 1px solid #e5e5e5; /*no*/
    background-color: $color-white
    position: relative;
    .scroll-wrapper
      position relative
      .scroll-content
        display inline-block
        padding-left 190px
        position relative
      .select-box-wrapper
        font-size: 30px; /*px*/
        position absolute
        left 0
        top 0
        width 190px
        height 101%
        padding-left $pl
        background-color $color-white
        flex-align-item()
        .select-box-content
          width 100%
          height 42px
          line-height 42px
          position relative
          .select-box-main
            height 100%
            background-color #fee7cb
            border-radius(6px)
            flex-align-item()
            justify-content flex-start
            position relative
            padding-left 2px
            .select-icon
              position absolute
              top 50%
              right 4px
              transform translateY(-50%)
              width 16px;/*no*/
              height 10px;/*no*/
              bg('arrow-down.png')
          .select-box-tab
            width 166px
            position absolute
            top 48px
            left 0
            border-radius(6px)
            background rgba(0, 0, 0, .65)
            color $color-white
            padding 10px 20px
            p
              font-size 26px;/*px*/
              line-height 44px
    ul
      li
        display inline-block
        padding: 0 40px
        text-align: center
        position: relative
        .text
          display: inline-block
          position: relative
          line-height: 92px; /*px*/
          height: 92px; /*px*/
          font-size: 30px; /*px*/
          color: #000
          &.active
            // border-bottom: 1px solid $color-orange
            color: $color-orange
          .pops
            display: inline-block
            position: absolute
            right: -30px;
            top: 6px;
            height: 24px; /*px*/
            line-height: 24px; /*px*/
            padding: 1px 10px; /*px*/
            font-size: 20px; /*px*/
            border-radius: 10px;
            background-color: $color-orange
            color: $color-white
            font-style: normal
        .line
          display: none
          width: 56px; /*px*/
          height: 4px;
          background-color: $color-orange
          position: absolute
          bottom: 0
          left: 50%
          margin-left: -28px; /*px*/
          z-index: 99
          border-radius: 10px
          &.active
            display: inline-block
  .content-wrap
    position absolute
    top: 89px; /*px*/
    left 0
    right: 0
    bottom: 0;
    z-index: -1;
    .content-c
      height: 100%
      overflow: hidden
    .content-item
      margin-top: 17px
      background-color: $color-white
      .buyer-info
        padding-left: $pl
        height: 80px
        line-height: 80px
        border-bottom 1px solid #e5e5e5; /*no*/
        .sn
          font-size 28px; /*px*/
          color #000
      .order-info
        display flex
        justify-content space-between
        height: 80px
        line-height: 80px
        font-size 28px; /*px*/
        padding: 0 $pl
        .order-role-type
          flex-align-item()
        .buyer
          color $color-6
          display inline-block
          font-size 28px;/*px*/
        .role-type
          display inline-block
          height 30px
          margin-left 20px
          &.common-buyer
            width 123px
            bg('buyer.png')
          &.cgs-buyer
            width 103px
            bg('cgs.png')
          &.svip-buyer
            width 145px
            bg('svip-cgs.png')
        .display-name
          color $color-orange
      .list
        .item
          margin-bottom: 20px
          .order-list
            display: flex
            padding: 20px $pl
            background: #f8f8f8
            .info-left
              position relative
              flex: 0 0 150px; /*px*/
              width: 150px; /*px*/
              height: 150px; /*px*/
              margin-right: 20px
              img:nth-child(1)
                border-radius 8px;
                height: 100%
                width: 100%
              img:nth-child(2)
                position absolute
                top 0
                left 0
                width 100%
                height 100%
              img:nth-child(3)
                position absolute
                top 0
                left 0
                width 100%
                height 100%
            .info-main
              flex: 1
              .item-info
                display flex
                justify-content: space-between
                &.title-price
                  font-size: 26px; /*px*/
                  // color: $color-highlight-background
                  padding-bottom: 14px
                  justify-content flex-start
                  align-items center
                  .goods-title
                    flex 1
                    font-size 28px; /*px*/
                    line-height 1.25
                    color #000
                    word-break break-all
                    margin-left 10px
                  .priceType
                    display inline-block
                    text-align: center
                    font-size: 26px; /*px*/
                    height: 30px; /*px*/
                    line-height: 30px; /*px*/
                    color $color-white
                    padding 0 8px
                    &.bgnull
                      background-color: #83cd79
                    &.bg0,&.bg1,&.bg2,&.bg3
                      background-color: #61bfef
                &.price-wrap
                  flex 0 0 200px; /*px*/
                  justify-content: flex-end
                  .goods-price
                    font-size: 26px; /*px*/
                    line-height: 1.5
                    white-space: nowrap;
                  .original-price
                    padding-top: 10px
                    text-decoration line-through
                    color: $color-a6
                &.prop-count
                  font-size: 24px; /*px*/
                  line-height: 30px; /*px*/
                  color: #999
                  .shop
                    font-size 20px;
                    span:nth-child(1)
                      margin-right 16px
                      padding  6px 8px
                      background: rgba(244,117,117,0.10);
                      border-radius 2px;
                      color #F47575
                    span:nth-child(2)
                      margin-right 16px
                      padding  6px 8px
                      background rgba(255, 138, 0, .1)
                      border-radius 2px;
                      color #FF8A00
                    span:nth-child(3)
                      padding  6px 8px
                      background rgba(109, 172, 246, .1);
                      border-radius 2px
                      color #6DACF6
        .total-bar
          padding-right: $pl
          .all-price
            text-align: right
            color: $color-orange
            font-size: 24px; /*px*/
            .num
              color: #333
            .big
              font-size: 36px;
          /*px*/
          .btn-wrap
            display: flex
            justify-content: flex-end
            padding: 24px 0
            .btn
              width: 150px; /*px*/
              height: 54px; /*px*/
              border-radius: 2px
              font-size: 26px; /*px*/
              line-height: 54px; /*px*/
              text-align: center
              margin-left: 24px
              border: 1px solid #b8b8b8; /*no*/
              color: #666
            .btns
              width: 200px; /*px*/
              height: 54px; /*px*/
              border-radius: 2px
              font-size: 26px; /*px*/
              line-height: 54px; /*px*/
              text-align: center
              margin-left: 24px
              border: 1px solid #a1d5f6; /*no*/
              color: #a1d5f6
    .no-more
      color $color-a6
      text-align center

.loading
  transition margin-top 380ms
  &.show
    margin-top 0
  &.hide
    margin-top: -90px

vuxPopPicker()
.no-result-wrapper
  position: absolute
  width: 100%
  top: 50%
  transform: translateY(-50%)

#noData
  img
    width: 70%
</style>
