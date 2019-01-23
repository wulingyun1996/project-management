<template>
  <transition name="slide">
    <div class="goodDetail">
      <!--有内容-->
      <div class="goodDetail-wrapper" v-if="detailStatus === 1">
        <base-header :intercept-back="true" @headerBack="backShopManage"></base-header>
        <div class="scroll-main" :class="{ active: isOpenByShare }">
          <div class="share-app" v-show="isOpenByShare">
            <div class="share-left">
              <img src="./images/icon-share-logo.png" alt="">
            </div>
            <div class="share-center">
              【建材采购师】自购省钱，分享赚钱
            </div>
            <div class="share-right" @click="getDownApp">
              打开APP
            </div>
          </div>
          <scroll ref="scroll" class="goodDetail-content">
            <div>
              <div class="good-main" v-for="item in goodDataFull" :key="item.id">
                <Slider :goodImgs="item.imaList"></Slider>
                <div class="time-buy" v-if="item.actionInfo">
                  <div class="time-left">
                    <div class="price-div"><span>￥</span>{{item.actionInfo.price}}</div>
                    <div class="price-num">
                      <span>￥{{item.max_price}}</span>
                      <div>{{item.mqq}}{{item.unit}}起批</div>
                    </div>
                  </div>
                  <div class="time-right">
                    <p>距结束还有</p>
                    <div><span>{{day}}</span>天<span>{{hour}}</span>：<span>{{minute}}</span>：<span>{{second}}</span></div>
                  </div>
                </div>
                <!-- 信息 -->
                <div class="good-mess">
                  <div class="good-mess-price" v-show="!isOpenByShare">
                    <div class="left-price">
                      <p>零售限价：</p>
                      <p><span>￥</span><span>{{ item.promotionPrice }}</span><span>起</span></p>
                    </div>
                    <div class="center-line">
                      <p></p>
                    </div>
                    <div class="right-price">
                      <p>特约采购师价：</p>
                      <p><span>￥</span><span>{{ item.purchasePrice }}</span><span>起</span></p>
                    </div>
                  </div>
                  <div class="good-share-price" v-show="isOpenByShare">
                    <div class="share-price-left">
                      <span>特约采购师价：</span><span>￥</span><span>{{ item.purchasePrice }}</span><span>起</span></p>
                    </div>
                    <div class="share-price-right" @click="getDownApp">
                      认证后可享此底价
                    </div>
                  </div>
                  <div class="padding-value">
                    <div class="mess-brand">
                      <div class="tag-left" v-show="item.is_stock_good === 1">现货</div>
                      <div class="tag-center" v-show="item.boutique === 1">精品馆</div>
                      <div class="tag-right" v-show="item.material === 1">材料馆</div>
                      <p>{{item.minimum_quantity}}{{item.unit}}起批</p>
                    </div>
                    <h5>{{item.title}}</h5>
                    <!-- <div v-if="item.goodsPriceInterval.length > 1">
                      <div class="price-type">零售标价</div>
                      <div class="price-range">
                        <div v-for="(goodPrice, index) in item.goodsPriceInterval" :key="index">
                          <div class="price-new" :class="{'small-size': + goodPrice.price.length > 6}"><i>￥</i>{{goodPrice.price}}</div>
                          <div class="num-unit">{{goodPrice.minimum_quantity}}{{item.unit}}起批</div>
                        </div>
                      </div>
                    </div>
                    <div class="mar-top" v-else>
                      <div class="price-new"><i>￥</i>{{item.interPrice}}<span v-if="item.max_price !== item.price"><i>~￥</i>{{item.max_price}}</span></div>
                      <div class="price-type">零售标价</div>
                      <div class="num-unit">{{item.minimum_quantity}}{{item.unit}}起批</div>
                    </div> -->
                  </div>
                    <!-- 快递方式 -->
                  <div class="other-mess">
                    <div>{{item.freight}}</div>
                    <div>{{item.deliver_date}}</div>
                    <div>{{item.deliveryAddress}}</div>
                  </div>
                  <!-- 规格选择弹框 -->
                  <div class="specifications" @click="spePop" v-if="item.skuList.length">
                    <div class="spec-left">规格选择</div>
                    <div class="spec-right">
                      <span v-for="(sku, index) in item.skuList" :key="index" v-if="sku.spec_value">
                        {{sku.spec_value}};
                      </span>
                    </div>
                  </div>
                  <div class="details-materilas" v-if="metarilsShow">
                    <div class="materilas-top">
                      <div class="top-left">
                        <span>线下实体</span>
                        <img src="./images/icon-line.png" alt="">
                        <span>材料图书馆</span>
                      </div>
                      <div class="top-right" @click="getLook" v-show="getLookShow">
                        <span>查看更多</span>
                        <img src="./images/icon-right.png" alt="">
                      </div>
                    </div>
                    <div class="materilas-bottom" :class="{ active: lookShow }">
                      <ul>
                        <li v-for="(addressItem, index) in item.MaterialData" :key="index">
                          <div class="bottom-place">
                            <img src="./images/icon-address.png" alt="">
                            <p>{{ addressItem.name }}</p>
                          </div>
                          <div class="bottom-address">
                            <img src="./images/icon-place.png" alt="">
                            <p @click="getMap(addressItem)">{{ addressItem.op_city }}{{ addressItem.op_province }}{{ addressItem.op_area }}{{ addressItem.address }}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="main-wrapper">
                  <!-- 三个tab栏 -->
                  <div>
                    <ul class="tab-scroll">
                      <li :class="{'active': currentIndex===index}" v-for="(item, index) in tabLi" :key="index" @click="goAnchor('#anchor-'+ index, index)">
                        <a>{{item}}</a>
                      </li>
                    </ul>
                  </div>
                  <div class="good-detail">
                    <div class="box-wrapper" id="anchor-0">
                      <div class="box" v-for="attr in item.custom_attr">
                        <div class="name">{{attr.attr_key}}</div>
                        <div class="des">{{attr.attr_value}}</div>
                      </div>
                    </div>
                    <div class="commodity" id="anchor-1">
                      <div class="title-box">商品评价</div>
                      <div class="commodity-wrapper" v-if="comNum>=1">
                        <h5>商品评价({{comNum}})</h5>
                        <commodity></commodity>
                      </div>
                      <div class="no-commodity" v-else>暂无评价</div>
                    </div>
                    <div class="shop" v-if="item.shopInfo">
                      <div>
                        <div class="logo">
                          <img v-if="item.shopInfo.shop_logo_path !== ''" :src="item.shopInfo.shop_logo_path">
                          <img v-else src="./images/icon-logo.png" alt="">
                        </div>
                        <h5>{{item.shopInfo.shop_name}}</h5>
                      </div>
                    </div>
                    <div class="good-des" id="anchor-2">
                      <div class="title-box">商品详情</div>
                      <div class="photo" v-html="item.content"></div>
                      <div class="price-s">
                        <img src="./js.jpg" />
                      </div>
                      <no-more message="已经到底了"></no-more>
                    </div>
                  </div>
                </div>
                <div class="laid hide">已下架</div>
              </div>
            </div>
          </scroll>
        </div>
        <div class="goods-fotter" @click="getDownApp" :class="{ 'ipone-x': isIponeX }" v-show="isOpenByShare">
          <span>立即认证享受低价（自购省钱/分享赚钱）</span>
        </div>
        <div class="goods-share-fotter" @click="goodShare" v-show="!isOpenByShare">
          <img src="./images/icon-share.png" alt="">
          <span>推荐给采购师</span>
        </div>
        <!-- <div class="good-foot">
          <div class="foot-icon">
            <img src="./tel.png" />
            咨询
          </div>
          <div class="foot-icon">
            <img src="./boss.png" />
            议价
          </div>
          <div class="foot-icon">
            <img src="./sc.png" />
            收藏
          </div>
          <div class="foot-right go-order" @click="spePop">加入进货单</div>
          <div class="foot-right go-buy" @click="spePop">立即订购</div>
        </div> -->
        <!--商品规格-->
        <specification ref="specification"></specification>
        <!-- <pop ref="pop" title="添加成功"></pop> -->
      </div>
      <!--内容不存在-->
      <div class="buy-delete" v-if="detailStatus === 0">
        <base-header :intercept-back="true" @headerBack="backShopManage"></base-header>
        <img src="./delete2.png" />
        <p>内容不存在或被删除</p>
      </div>
      <!-- 商品分享弹框 -->
    <base-goods-share
      ref="goodsShare"
      :goodsPicture="mainPic"
      :goods-detail="goodsDetails">
      </base-goods-share>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import NoMore from 'base/no-more/no-more'
  import Pop from 'base/pop/pop'
  import Slider from 'components/good-detail/slider'
  import Star from 'base/star/star'
  import Commodity from 'base/commodity/commodity'
  import baseGoodsShare from 'base/share/goods-share'
  import Specification from 'components/good-detail/specification-popups'
  import { mapMutations } from 'vuex'
  import { loadDataPost, STATUS_OK } from 'api/common'
  import { splitMoney } from 'commons'
  import { invokeNativeMethod } from 'api/navtive'
  export default {
    data() {
      return {
        currentIndex: 0,
        tabLi: ['商品参数', '商品评价', '商品详情'],
        detailStatus: 1,
        commodity: [],
        comNum: 0,
        skuMore: false,
        typeIndex: 0,
        goodImgs: [],
        goodDataFull: [],
        day: '',
        hour: '',
        minute: '',
        second: '',
        lookShow: false,
        metarilsShow: true,
        getLookShow: false,
        mainPic: '',
        goodsDetails: {},
        isIponeX: this.$isX
      }
    },
    created() {
      this.getRoute()
    },
    computed: {
      isOpenByShare () {
        return !!this.$route.query.shareId
      }
    },
    methods: {
      backShopManage () {
        this.$push({ path: '/shop-manage', query: { fromNative: 1, h5Page: 1 } })
      },
      spePop() {
        this.$refs.specification.show()
      },
      // 跳转到锚点
      goAnchor(selector, index) {
        this.currentIndex = index
        // 获取带有锚点的 DOM ；
        let anchor = this.$el.querySelector(selector)
        this.$refs.scroll.scrollToElement(anchor, 300)
      },
      // 倒计时
      padNumber(num, fill) {
        let len = ('' + num).length
        return (Array(
          fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num)
      },
      getRTime(inputTime) {
        let outTime = new Date(inputTime * 1000)
        let nowTime = new Date()
        let t = outTime.getTime() - nowTime.getTime()
        var d = 0
        var h = 0
        var m = 0
        var s = 0
        if (t >= 0) {
          d = Math.floor(t / 1000 / 60 / 60 / 24)
          h = Math.floor(t / 1000 / 60 / 60 % 24)
          m = Math.floor(t / 1000 / 60 % 60)
          s = Math.floor(t / 1000 % 60)
        }
        this.day = this.padNumber(d, 2)
        this.hour = this.padNumber(h, 2)
        this.minute = this.padNumber(m, 2)
        this.second = this.padNumber(s, 2)
      },
      grouping(data) {
        let arg = [].slice.call(arguments, 1)
        let arr = data
        for (var i = 0, l = arg.length; i < l; i++) {
          var newArr = []
          if (arr[0].constructor === Array) {
            arr.forEach(function(arrChild) {
              newArr = newArr.concat(group(arrChild, arg[i]))
            })
          } else {
            newArr = group(arr, arg[i])
          }
          arr = newArr
        }
        function group (d, type) {
          let num = 0
          let typeCount = []
          let map = {}
          d.forEach((obj) => {
            var value = map[String(obj[type])]
            if (value !== void 0) {
              typeCount[value].push(obj)
            } else {
              map[obj[type]] = num
              typeCount[num] = [].concat([obj])
              num++
            }
          })
          return typeCount
        }
        return arr
      },
      // 查看更多
      getLook () {
        if (this.lookShow === true) {
          this.lookShow = false
        } else {
          this.lookShow = true
        }
      },
      getRoute() {
        let URL = 'goods/detail'
        let obj = {
          id: this.$route.params.id ? this.$route.params.id : 976
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (typeof res.data === 'object') {
              this.mainPic = res.data.imaList[0].image_path
              let obj = {
                retailPrice: res.data.purchasePrice,
                title: res.data.title,
                id: res.data.id,
                isHot: false,
                isFlash: false
              }
              if (res.data.is_stock_good === 0) {
                obj.isNewGoods = false
              } else {
                obj.isNewGoods = true
              }
              if (res.data.material === 0) {
                obj.isJoinedMeterialGoods = false
              } else {
                obj.isJoinedMeterialGoods = true
              }
              if (res.data.boutique === 0) {
                obj.isJoinedBestGoods = false
              } else {
                obj.isJoinedBestGoods = true
              }
              this.goodsDetails = obj
              let prices = splitMoney(res.data.intervalprice.substring(1))
              res.data.interPrice = prices.init + '.' + prices.zero
              let arr = []
              arr.push(res.data)
              this.goodDataFull = arr
              // banner
              this.goodPhoto(res.data)
              if (!res.data.MaterialData.length) {
                this.metarilsShow = false
              }
              if (res.data.MaterialData.length > 2) {
                this.getLookShow = true
              }
              if (res.data.actionInfo !== null) {
                // 倒计时
                setInterval(() => {
                  this.getRTime(res.data.actionInfo.end_at)
                }, 0)
              }
              // 评价
              let commodity = res.data.evaluateList
              if (commodity) {
                this.comNum = commodity.length
                this.commodityList(commodity)
              }
              // 弹窗主图信息
              this.goodInfo([{title: res.data.title, image: res.data.image_path, priceRange: res.data.promotionPrice, is_stock_good: res.data.is_stock_good, boutique: res.data.boutique, material: res.data.material}])
              // 规格处理
              let specPrice = res.data.skuList ? res.data.skuList : []
              let catArr = []
              let newCatArr
              if (specPrice.length > 0) {
                specPrice.map((obj, index) => {
                  let typeCount = obj['spec_value'].split('_')
                  if (typeCount.length > 1) {
                    obj['key_one'] = typeCount[0]
                    obj['key_two'] = typeCount[1]
                    obj['product_Quantity'] = 0
                    this.skuMore = true
                  } else {
                    this.skuMore = false
                    obj['key_one'] = typeCount[0]
                    obj['key_two'] = typeCount[0]
                    obj['product_Quantity'] = 0
                  }
                  catArr.push(obj)
                  newCatArr = this.grouping(catArr, 'key_one')
                })
                this.setSize(newCatArr)
              } else {
                let moArr = []
                let newArr = []
                let obj = {
                  key_two: '默认',
                  price: res.data.price,
                  product_Quantity: 0,
                  store: res.data.store
                }
                moArr.push(obj)
                newArr.push(moArr)
                this.setSize(newArr)
              }
            } else {
              this.detailStatus = 0
              return
            }
          }
        })
      },
      getMap (row) {
        let obj = {
          city: row.op_city,
          province: row.op_province,
          area: row.op_area,
          address: row.address
        }
        invokeNativeMethod('nativeMapNavigation', JSON.stringify(obj))
      },
      goodShare () {
        this.$refs.goodsShare.show()
      },
      // 去下载页面
      goDownLoad () {
        this.$router.push('/share')
      },
      getDownApp () {
        this.goDownLoad()
      },
      ...mapMutations({
        setSize: 'SET_SIZE',
        goodInfo: 'GOOD_INFO',
        commodityList: 'COMMODITY_LIST',
        goodPhoto: 'GOODPHOTO'
      })
    },
    components: {
      NoMore,
      Pop,
      Slider,
      Commodity,
      Specification,
      Star,
      Scroll,
      baseGoodsShare
    },
    destroyed() {
      // 当前组件销毁的时候，清空状态管理中的 setSize 数组
      this.setSize([])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .goodDetail
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 10
    background: $color-body
    .buy-delete
      width: 100%
      height: 100%
      position: fixed
      z-index: 100
      background: $color-body
      img
        display: block
        width: 442px;/*px*/
        margin: 160px auto 0
      p
        font-size: 30px;/*px*/
        color: $color-5
        line-height: 48px;/*px*/
        margin-top: 66px
        text-align: center
  .goodDetail-wrapper
    width: 100%
    height: 100%
    .scroll-main
      position: absolute
      width: 100%
      left: 0
      top: 95px;/*px*/
      bottom: 0px;/*px*/
      right: 0
      overflow: hidden
      &.active
        top: 0px
      .share-app
        width 100%
        height 80px
        opacity: 0.9
        background: #FFFFFF
        position absolute
        left 0
        top 0
        padding 0 16px
        display flex
        align-items center
        z-index 1000
        justify-content space-between
        .share-left
          width 48px
          height 48px
          img
            width 100%
            height 100%
        .share-center
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #333333
          letter-spacing: 0
        .share-right
          width 156px
          height 56px
          background: #FF8A00
          border-radius: 4px
          font-family: PingFangSC-Regular
          font-size: 28px
          color: #FFFFFF
          letter-spacing: 0
          text-align: center
          line-height: 56px
    .goodDetail-content
      height: 100%
      overflow: hidden
  .time-buy
    display: flex
    color: $color-white
    .time-left
      background: #fd3d31
      flex: 1
      flex-box-center()
      padding: 18px 0 18px 26px
      .price-div
        font-size: 54px;/*px*/
        span
          font-size: 36px;/*px*/
      .price-num
        margin-left: 16px
        span
          text-decoration: line-through
          font-size: 24px;/*px*/
        div
          font-size: 24px;/*px*/
          color: $color-bg
          background: #ce3329
          width: 118px;/*px*/
          line-height: 40px;/*px*/
          text-align: center
          border-radius: 4px
          margin-top: 12px
    .time-right
      background: #ff877f
      padding: 0 16px
      flex-box()
      flex-direction: column
      p
        font-size: 24px;/*px*/
        padding-left: 52px
        background: url('time-white.png') no-repeat 16px center
        background-size: 24px 24px;/*px*/
      div
        flex-box-center()
        margin-top: 12px
        span
          background: #59360c
          color: $color-white
          display: block
          width: 36px;/*px*/
          line-height: 36px;/*px*/
          text-align: center
          border-radius: 6px
          &:first-child
            margin-right: 10px
          &:nth-child(2)
            margin-left: 10px
  .good-mess
    background: $color-white
    padding: 25px 0 40px
    .good-share-price
      display flex
      padding 20px 26px
      padding-top 0px
      align-items center
      justify-content space-between
      .share-price-left
        font-family: PingFangSC-Regular
        span:first-child
          font-size: 24px
          color: #333333
        span:nth-child(2)
          font-size: 26px
          color: #FF0000
        span:nth-child(3)
          font-size: 38px
          color: #FF0000
        span:last-child(4)
          font-size: 22px
          color: #999999
      .share-price-right
        width 212px
        height 36px
        border-radius: 18px
        bd(#FE3E58)
        text-align center
        line-height 36px
        font-family: PingFangSC-Regular
        font-size: 24px
        color: #FE3E58
    .good-mess-price
      display flex
      padding 0 0 20px 0
      .left-price
        width 49%
        // height 100px
        text-align center
        p:first-chilld
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #333333
        p:last-child
          margin-top 10px
          font-family: PingFangSC-Medium
          font-size: 26px
          color: #FF0000
          span:nth-child(2)
            font-size: 38px
            color: #FF0000
          span:nth-child(3)
            font-size: 22px
            color: #333333
        // background-color #f00
      .center-line
        width 2%
        // height 100px
        // background-color #0f0
        p
          width 2px
          height 100%
          background-color #EBEBEB
      .right-price
        width 49%
        text-align center
        p:first-chilld
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #333333
        p:last-child
          margin-top 10px
          font-family: PingFangSC-Medium
          font-size: 26px
          color: #FF0000
          span:nth-child(2)
            font-size: 38px
            color: #FF0000
          span:nth-child(3)
            font-size: 22px
            color: #333333
        // height 100px
        // background-color #00f
    .padding-value
      padding: 20px 26px
      bd-t(#ccc)
      bd-b(#ccc)
    .mess-brand
      display flex
      align-items center
      margin-bottom 10px
      .tag-left
        width 52px
        height 32px
        background: rgba(244,117,117,0.10)
        border-radius: 4px
        font-family: PingFangSC-Regular
        font-size: 20px
        color: #F47575
        letter-spacing: 0
        text-align center
        line-height 32px
        margin-right 8px
      .tag-center
        width 72px
        height 32px
        background: rgba(255,138,0,0.10)
        border-radius: 4px
        font-family: PingFangSC-Regular
        font-size: 20px
        color: #FF8A00
        letter-spacing: 0
        text-align center
        line-height 32px
        margin-right 8px
      .tag-right
        width 72px
        height 32px
        background: rgba(109,172,246,0.10)
        border-radius: 4px
        font-family: PingFangSC-Regular
        font-size: 20px
        color: #6DACF6
        letter-spacing: 0
        text-align center
        line-height 32px
      p
        font-family: PingFangSC-Regular
        font-size: 22px
        color: #999999
        line-height 32px
    h5
      font-size: 30px;/*px*/
      line-height: 1.2
      text-over(2)
      color: #333333
    .price-type
      font-size: 24px;/*px*/
      color: $color-orange
      display: inline-block
      border: 1px solid $color-orange;/*no*/
      border-radius: 20px
      padding: 6px 14px
      margin-top: 16px
    .price-range
      display: flex
      margin-top: 30px
      >div
        width: 33.3%
        flex-between()
        flex-direction: column
        &:nth-child(2)
          text-align: center
          .num-unit
            text-align: center
        &:nth-child(3)
          text-align: right
    .mar-top
      margin-top: 30px
      flex-box-center()
      .price-type, .num-unit
        margin-top: 0
      .price-type
        margin-left: 18px
    .price-new
      color: $color-orange
      font-size: 50px;/*px*/
      &.small-size
        font-size: 30px;/*px*/
      i
        font-style: normal
        font-size: 30px;/*px*/
    .num-unit
      margin-top: 15px
      padding: 0 26px
      >div
        font-size: 22px;/*px*/
        color: $color-6
    .other-mess
      flex-between()
      font-size: 24px;/*px*/
      color: $color-a6
      padding: 0 26px
      margin-top: 30px
    .details-materilas
      margin-top 20px
      .materilas-top
        display flex
        align-items center
        justify-content space-between
        padding 20px 30px
        bd-b(#ccc)
        .top-left
          display flex
          align-items center
          font-family: PingFangSC-Medium
          font-size: 28px
          color: #333333
          img
            margin 5px 10px
            margin-bottom 0
        .top-right
          font-family: PingFangSC-Regular
          font-size: 24px
          color: #CCCCCC
      .materilas-bottom
        max-height 220px
        overflow hidden
        &.active
          max-height none
        li
          bd-b(#ccc)
          padding 15px 30px
        .bottom-place, .bottom-address
          display flex
          align-items center
          margin-bottom 10px
          img
            width 36px
            height 30px
            margin-right 10px
          p
            font-family: PingFangSC-Regular
            font-size: 26px
            color: #999999
          p:first-child
            text-over(1)
            line-height 1
    .specifications
      flex-box-center()
      border: 1px solid $color-border;/*no*/
      border-radius: 10px
      color: $color-6
      margin: 46px 36px 0
      padding: 25px 0 20px
      arrow-down()
      &:after
        top: 36%
      .spec-left
        font-size: 22px;/*px*/
        padding: 62px 26px 0
        white-space: nowrap;
        bg-image(spec)
        background-size: 44px 42px;/*px*/
        background-repeat: no-repeat
        background-position: center top
      .spec-right
        font-size: 24px;/*px*/
        border-left: 1px solid $color-border;/*no*/
        padding-left: 20px
        padding-right: 60px
        margin-left: 10px
        line-height: 1.3
        flex: 1
        display: flex
        align-items: center
        flex-wrap: wrap
        overflow: hidden
        max-height: 60px;/*px*/
        span
          white-space: nowrap
          margin-right: 2px
  .tab-scroll
    display: flex
    background: $color-white
    border-bottom: 1px solid $color-border;/*no*/
    line-height: 84px;/*px*/
    &.fixed
      width: 100%
      position: fixed
      top: 86px;/*px*/
      z-index: 200
    li
      flex: 1
      text-align: center
      a
        display: inline-block
        font-size: 26px;/*px*/
        color: $color-a6
      &.active
        a
          color: $color-orange
          border-bottom: 4px solid $color-orange;/*px*/
  .box-wrapper
    background: $color-white
    .box
      display: flex
      font-size: 26px;/*px*/
      color: $color-a6
      padding: 34px
      line-height: 1.3
      border-top: 1px solid $color-border;/*no*/
      .name
        width: 30%
      .des
        flex: 1
      &:first-child
        border-top: none
  .title-box
    background: $color-body url("icon1.png") no-repeat center center
    background-size: 392px 24px;/*px*/
    font-size: 24px;/*px*/
    text-align: center
    line-height: 70px;/*px*/
    color: $color-9
  .commodity-wrapper
    padding: 30px 0 0
    background: $color-white
    h5
      padding: 0 25px
      font-size: 30px;/*px*/
  .no-commodity
    padding-left: 26px
    background: $color-white
    color: $color-orange
    line-height: 70px;/*px*/
    font-size: 26px;/*px*/
  .main-wrapper
    margin-top: 20px
  .shop
    display: flex
    background: $color-white
    justify-content: space-between
    align-items: center
    padding: 0 48px 0 35px
    margin-top: 20px
    >div
      display: flex
      align-items: center
      padding: 30px 0
      h5
        margin-left: 20px
    .logo
      width: 90px;/*px*/
      height: 90px;/*px*/
      border: 1px solid $color-text;/*no*/
      border-radius: 5px
      display: flex
      justify-content: center
      align-items: center
      overflow: hidden
      img
        width: 90px;/*px*/
        height: 90px;/*px*/
        border-radius: 5px
  .photo
    width 100%
    background: $color-white
    padding: 26px
  .photo >>> p
    width 100%!important 
    img
      width: 100%
      display: block
  .laid
    width: 100%
    line-height: 80px;/*px*/
    background: $color-a6
    text-align: center
    font-size: 36px;/*px*/
    color: $color-white
  .hide
    display: none
  .price-s
    background: $color-white
    padding: 0 26px
    img
      width: 100%!important
      display: block
  .goods-fotter
    position: fixed
    left: 0
    bottom: 0
    right: 0
    background: #FF8A00
    height: 88px;/*px*/
    display: flex
    align-items center
    justify-content center
    &.ipone-x
      bottom 20px
    span
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #FFFFFF
      letter-spacing: 0
  .goods-share-fotter
    position: fixed
    left: 0
    bottom: 0
    right: 0
    background: #FF8A00
    height: 88px;/*px*/
    display: flex
    align-items center
    justify-content center
    img
      width 32px
      height 32px
      margin-right 5px
      margin-top 3px
    span
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #FFFFFF
      letter-spacing: 0
  .good-foot
    position: fixed
    left: 0
    bottom: 0
    right: 0
    background: $color-bc
    height: 98px;/*px*/
    display: flex
    .foot-right
      flex: 1
      font-size: 30px;/*px*/
      display: flex
      justify-content: center
      align-items: center
      &.go-buy
        background: $color-orange
        color: $color-white
      &.go-order
        background: #fddfaf
        color: $color-orange
    .foot-icon
      font-size: 20px;/*px*/
      color: $color-white
      display: flex
      flex-direction: column
      justify-content: center
      padding: 0 30px
      position: relative
      &:after
        content: ''
        width: 1px;/*no*/
        height: 56px;/*px*/
        background: #ccc
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
      img
        margin-bottom: 12px
        width: 40px;/*px*/
        height: 40px;/*px*/
</style>
