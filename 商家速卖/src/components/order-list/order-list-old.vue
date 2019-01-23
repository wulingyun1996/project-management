<template>
  <div id="xiaoma" class="myOrder-wrap">
    <div>
      <div class="header-wrap" ref="headerWrap">
        <!-- <div style="height:88px;background:red;color:blue">test</div> -->
        <scroll direction="horizontal" ref="scroll">
          <div class="scroll-content">
            <ul ref="tabList">
              <!--
                根据 data 中数据生成 tap，并注册点击事件，传递当前 tap 的状态码和索引；根据状态码和索引来选择加载下方的主体内容；
               -->
              <li v-for="(item, index) in tabCount" @click="selectTab(item.state, index)">
                <!-- 判断当前点击的是哪一个然后添加相应的类名，并且在点击的时候修改 currentIndex -->
                <span class="text" :class="{'active': currentIndex === index}">{{item.text}}
                <span class="line" :class="{'active': currentIndex === index}"></span>
                  <i v-show="item.count" class="pops">{{item.count}}</i>
                </span>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
      <div class="content-wrap">
        <scrollloadcontent
                v-show="(!noData) && loading"
                class="content-c"
                :data="data"
                :pulldown="pulldown"
                :pullup="pullup"
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
                    <span class="buyer">{{sellers.buyer}}</span>
                    <span class="display-name">{{sellers.display_name}}</span>
                  </div>
                  <!-- 购买的商品列表 -->
                  <div class="list">
                    <div class="item" v-for="goods in sellers.goods">
                      <!-- 注册点击事件，路由的编程式导航实现跳转到商品详情页 -->
                      <div class="order-list" @click="goDetail(index, sellers.id)">
                        <div class="info-left">
                          <img :src="goods.image_path"/>
                        </div>
                        <div class="info-main">
                          <div class="title-price item-info">
                            <span class="goods-title">{{goods.goods_name}}</span>
                            <div>
                              <div class="priceType" :class="'bg' + goods.special_card_level">
                                <span>{{goods.priceType}}</span></div>
                            </div>
                          </div>
                          <div class="price-wrap item-info">
                            <p class="goods-price">￥{{goods.goods_price}}</p>
                            <p class="original-price" v-if="goods.original_price">￥{{goods.original_price}}</p>
                          </div>
                          <div class="prop-count item-info">
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
                        <div class="btn" v-if="sellers.order_status === 40" @click="goLogistics(index, sellers.id)">查看物流</div>
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
    <!-- 组件缓存 -->
    <!-- <keep-alive>
      <router-view></router-view>
    </keep-alive> -->
  </div>
</template>

<script>
  import confirm from 'base/confirm/confirm'
  import NoResult from 'base/no-result/no-result'
  import Loading from 'base/loading/loading'
  import noMore from 'base/no-more/no-more'
  import noData from 'base/no-data'
  import {loadData, STATUS_OK} from 'api/common'
  import {PopupPicker} from 'vux'
  import scrollloadcontent from 'base/scroll/scrollloadcontent'
  import Scroll from 'base/scroll/scroll'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        // loading在mounted初始化的时候回置为 true；
        loading: false,
        // 显不显示滚动区域组件，主要是由该数据来决定的；
        noData: Boolean,
        noDataSrc: require('./nodata@2x.png'),
        // currentIndex: 0,
        tabCount: [
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
          {
            text: '待评价',
            count: 0,
            state: '50',
            status: 'success'
          },
          {
            text: '订单异常',
            count: 0,
            state: '70',
            status: 'abnormal'
          }
        ],
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
        abnormal_reason: ''
      }
    },
    created() {
    },
    mounted() {
      this._initTabListWidth()
      this.loadData().then(() => {
        this.loading = true
      })
    },
    activated() {
      this.loadData().then(() => {
        this.loading = true
      })
    },
    deactivated() {
    },
    watch: {
      // 监听路由的变化,之所以会发送两次ajax请求，是因为加载一次，路由这里又会发送一次
      '$route'() {
        if (this.orderInfo) {
          const URL = `order/distributor/detail`
          let obj = {
            id: this.orderInfo.id
          }
          loadData(URL, obj).then(res => {
            if (res.code === STATUS_OK) {
              this.$set(this.data, this.orderInfo.index, res.data)
            }
          })
        }
      }
    },
    computed: {
      ...mapGetters(['orderInfo']),
      currentIndex () {
        return this.$route.query.id
      }
    },
    methods: {
      ...mapMutations(['SET_ORDER_INFO']),
      // 将 商品的索引和 id 存放到 vuex 中，只要是修改了其数据，计算属性(orderInfo)就能够更新；
      _storage(index, id) {
        this.SET_ORDER_INFO({
          index: index,
          id: id
        })
      },
      // 获取 tap 栏的总宽度；
      _initTabListWidth() {
        const tabList = this.$refs.tabList
        const items = tabList.children
        let width = 0
        for (let i = 0; i < items.length; i++) {
          width += items[i].clientWidth
        }
        tabList.style.width = (width + 10) + 'px'
      },
      _adjust(tabId) {
        const viewportWidth = this.$refs.headerWrap.clientWidth
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
        this.$refs.scroll.scrollTo(translate, 0, 300)
      },  // 点击滑动
      selectTab(state = '', index = 0) {
        // 01-添加：如果多次点击当前 tap ，取消发送 ajax 请求；
        // if (this.currentIndex === index) return
        this.loadData(state).then(() => {
          this.loading = true
        })
        // 修改索引和state状态；
        this.currentIndex = index
        this.state = state
        // 调整横向tap栏位置；
        this._adjust(index)
      },

      // 编程式导航，跳转路由并且存储当前商品信息到 vuex；
      editPrice(index, id) {
        this._storage(index, id)
        this.$router.push({
          path: '/order-edit-price/' + id
        })
      },
      cancelOrder(index, id) {
        this._storage(index, id)
        this.$router.push({
          path: '/order-cancel-order/' + id
        })
      },
      sendOut(index, id) {
        this._storage(index, id)
        this.$router.push({
          path: '/order-send-out/' + id
        })
      },
      goLogistics(index, id) {
        this._storage(index, id)
        this.$router.push({
          path: '/order-logistics-details/' + id
        })
      },
      _checkMore(data) {
        const song = data
        // 如果里面data中无数据或者数据中的当前页码乘以每页的数量大于总数据；
        if (!song.data.length || song.current_page * song.per_page >= song.total) {
          // 显示没有更多数据提示信息；
          this.hasMore = false
        }
      },
      splitPrice(data) {
        data.forEach(val => {
          let priceArr = val.pay_price.split('.')
          val.priceInt = priceArr[0]
          val.priceFloat = priceArr[1]
        })
      },
      // 根据当前 tap 栏代表的订单情况获取数据,默认是空字符串和0拿到全部的数据；
      loadData(state = this.state) {
        const URL = 'order/distributor'
        this.page = 1
        // 每次切换数据的时候有的loading效果，如果没有数据了，那么该值就置为 false；
        this.hasMore = true
        let obj = {
          status: state
        }
        return loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            let resData = res.data   // 一个数据对象；
            let data = resData.data  // data 此刻是一个数组；
            this.data = Object.assign([], data)   // 合并数组，使其成为响应式；
            this.status = state      // 拿到 当前 tap 栏的 state赋值给 vm.status，即新增一个 status 属性；
            this.refresh = false     // 隐藏加载页面时候提示文字；
            this.page = 1             // 当前分页重置为 1；
            this.noData = this.data.length === 0 ? 1 : 0   // 判断是否还有数据；
            this.hasData = this.data.length === 0 ? 0 : 1
            this.splitPrice(this.data)    // 拆分价格，整数和小数部分样式不同；
            this.getCount(resData)
            this._checkMore(resData)      // 检查是否还有更多数据；
            return Promise.resolve()      // 返回 Promise 对象进行链式编程；
          }
        })
      },
      // 上拉加载更多
      LoadMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        const URL = 'order/distributor'
        let obj = {
          // this.status 表示的是当前的 state，也就是为了获悉当前点击的哪个 tap；
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
      pulldownRefresh() {
        // 下拉刷新的时候让 正在加载提示信息显示
        this.refresh = true
        setTimeout(() => {
          // 数据请求成功之后会让 refresh 置为 false；
          this.loadData()
        }, 2000)
      },
      // 获取订单所有的状态的数据，例如：已发货\订单异常等对应的订单数量；
      getCount(res) {
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
      goDetail(index, id) {
        this._storage(index, id)
        this.$router.push({
          path: '/order-detail/' + id
        })
      },
      goSee() {
        this.$router.push('/')
      }
    },
    components: {
      confirm,
      Scroll,
      PopupPicker,
      scrollloadcontent,
      NoResult,
      Loading,
      noMore,
      noData
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  $pl = 24px
  .myOrder-wrap
    // overflow: hidden
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .headerRight
      width: 36px; /*px*/
      height: 36px; /*px*/
      bg-image('top-mes-icon')
    .header-wrap
      border-bottom: 1px solid #e5e5e5; /*no*/
      background-color: $color-white
      position: relative;
      .scroll-content
        display inline-block
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
          .buyer
            color $color-6
            display inline-block
            font-size 28px;/*px*/
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
                flex: 0 0 150px; /*px*/
                width: 150px; /*px*/
                height: 150px; /*px*/
                margin-right: 20px
                img
                  height: 100%
                  width: 100%
              .info-main
                flex: 1
                .item-info
                  display flex
                  justify-content: space-between
                  &.title-price
                    font-size: 26px; /*px*/
                    color: $color-highlight-background
                    padding-bottom: 14px
                    .goods-title
                      flex: 1
                      font-size 28px; /*px*/
                      line-height: 1.25
                      color: #000
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
