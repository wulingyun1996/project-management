<template>
  <transition name="has-data">
    <div class="shop-manage-container" v-if="isFirstEnterGoodsManage">
      <base-header>
        <span class="shop-manage-publish" @click="goPublishGoods">发布</span>
      </base-header>
      <div class="shop-manage-tab">
        <div class="tab-item" :class="{ active: currentTab === 0 }" @click="toggleGoodsListStatus(0)">
          <span>在售商品</span>
          <span class="goods-num">({{ goodsListNum.onSale }})</span>
        </div>
        <div class="tab-item" :class="{ active: currentTab === 1 }" @click="toggleGoodsListStatus(1)">
          <span>未上架商品</span>
          <span class="goods-num">({{ goodsListNum.unSale }})</span>
        </div>
        <div class="tab-item" :class="{ active: currentTab === 2 }" @click="toggleGoodsListStatus(2)">
          <span>草稿箱</span>
          <span class="goods-num">({{ goodsListNum.draft }})</span>
        </div>
        <div
          class="line"
          :class="{ one: currentTab === 0, two: currentTab === 1, three: currentTab === 2 }">
        </div>
      </div>
      <div class="shop-manage-search" v-show="currentTab === 0">
        <input type="text" placeholder="请输入关键词" v-model="keyWords">
        <i v-show="keyWords" @click="keyWords = ''"></i>
        <label @click="searchOnSaleGoods">搜索</label>
      </div>
      <div class="draft-guide" @click="showDraftGuide" v-show="currentTab === 2">点击了解草稿箱功能?</div>
      <transition name="has-data">
        <base-scroll
          ref="goodsManageScroll"
          v-show="m_dataList.length"
          message="已加载完"
          :data="m_dataList"
          :pullup="m_pullup"
          :hasLoading="m_loading"
          :hasMore="m_hasMore"
          :hasRefresh="m_refresh"
          :pulldown="m_pulldown"
          @scrollToEnd="getData"
          @pulldown="pullDownRefreshData"
          >
          <ul class="goods-list">
            <li
              class="goods-item"
              v-for="(goodsItem, goodsIndex) in m_dataList"
              :key="goodsItem.id"
              @click="goGoodsDetail(goodsItem.id)"
              >
              <div class="goods-main-info">
                <div class="goods-pic">
                  <span v-show="goodsItem.is_delete === 3">审核未通过</span>
                  <img :src="goodsItem.image_path" alt="">
                </div>
                <div class="goods-info">
                  <h2>
                    <span class="hot-goods" v-show="goodsItem.isHot">【爆款】</span>
                    <span class="flash-goods" v-show="goodsItem.isflash">限时抢购</span>
                    {{ goodsItem.title }}
                  </h2>
                  <div class="goods-category">
                    <span class="new-goods" v-show="goodsItem.is_stock_good">现货</span>
                    <span class="best-goods" v-show="goodsItem.boutique">精品馆</span>
                    <span class="meterial-goods" v-show="goodsItem.material">材料馆</span>
                  </div>
                  <div class="goods-price">
                    <div class="price">￥{{ goodsItem.purchase_price }}</div>
                    <div class="commission">
                      <i></i>
                      <span>￥{{ goodsItem.commission | retainTwoDecimal }}</span>
                    </div>
                  </div>
                  <div class="goods-stock">
                    <p class="saled-num">
                      已售
                      <span>{{ goodsItem.sales_amount }}</span>
                    </p>
                    <p class="unsaled-num">
                      库存
                      <span>{{ goodsItem.stock }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <ul class="goods-operate-list">
                <li
                  class="operate-item"
                  v-if="(currentTab === 0 && operateItem.type !== 3) ||
                        (currentTab === 1 && operateItem.type !== 4 && operateItem.type !== 6) ||
                        (currentTab === 2 && (operateItem.type === 2 || operateItem.type === 5))"
                  v-for="operateItem in goodsItem.operateList"
                  :key="operateItem.type"
                  :class="{ forbidden: currentTab === 0 && (goodsItem.isflash !== 0 || goodsItem.isHot !== 0) && operateItem.type !== 1 && operateItem.type !== 6,
                            active: operateItem.selected }"
                  @click.stop="operateCurrentGoods(goodsItem, operateItem, goodsIndex)">
                  <span>{{ operateItem.text }}</span>
                  <img
                    :src="operateItem.selected ? operateItem.activatedIcon : operateItem.defaultIcon"
                    :class="{ [operateItem.class]: true }"
                    alt="">
                </li>
              </ul>
            </li>
          </ul>
        </base-scroll>
      </transition>
      <transition name="no-data">
        <div class="no-data" v-show="!m_dataList.length">
          <img src="./images/img-no-data.png" alt="">
          <p v-show="currentTab !== 0">未找到符合条件的商品~</p>
          <p v-show="currentTab === 0">无在售商品，店铺将不会在买家端展示</p>
          <p v-show="currentTab === 0" class="txt">赶紧去发布商品吧~</p>
        </div>
      </transition>
      <!-- 草稿箱弹窗 -->
      <base-senior-popup ref="draft" width="100%" height="100%" :opacity="0">
        <div class="draft-guide-wrapper">
          <img src="./images/img-draft.png" alt="">
          <p>商品信息随时保存，方便快捷！</p>
          <p>上限20条，超过上限保存新草稿将自动顶替保存时间最早的草稿</p>
          <p>存放60天无编辑行为后，系统将自动删除</p>
          <h2 @click="hideDraftGuide">知道了</h2>
        </div>
      </base-senior-popup>
      <!--下架弹窗-->
      <base-confirm
        ref="downGoods"
        @confirm="confirmDownCurrentGoods"
        @cancel="cancelDownCurrentGoods"
        text="下架后，商品将不可进行交易， 您确定要下架此商品吗？"
        confirmBtnText="确定">
      </base-confirm>
      <!--上架弹窗-->
      <base-confirm
        ref="upGoods"
        @confirm="confirmUpCurrentGoods"
        @cancel="cancelUpCurrentGoods"
        text="您确定要上架此商品吗？"
        confirmBtnText="确定">
      </base-confirm>
      <!--删除弹窗-->
      <base-confirm
        ref="deleteGoods"
        @confirm="confirmDeleteCurrentGoods"
        @cancel="cancelDeleteCurrentGoods"
        text="确定要删除吗？"
        confirmBtnText="确定">
      </base-confirm>
      <!-- 分享弹窗 -->
      <base-share
        ref="goodsShare"
        :goods-picture="currentGoodsItem.goodsPicture"
        :goods-detail="currentGoodsItem"
        @hide="hideShareGoodsPopup">
      </base-share>
      <!--运营强制下架原因弹窗-->
      <base-down-pop
        ref="forceDownPopup"
        confirmBtnText="稍后再说"
        goEditText='去编辑'
        :reason="forceDownReason"
        @cancel="hideForceDownPopup"
        @goEdit='goEditeGoods(currentGoodsItem.id)'>
      </base-down-pop>
    </div>
  </transition>
</template>

<script>
import BaseConfirm from 'base/confirm/confirm'
import BaseDownPop from 'base/confirm/down-pop'
import BaseShare from 'base/share/goods-share'
import { mixins } from 'mixins'
import { cloneDeep } from 'commons'
import operateList from './operateList'
export default {
  name: 'shopManage',
  mixins: [mixins],
  data () {
    return {
      isFirstEnterGoodsManage: false,
      m_pageSize: 5,
      currentTab: 0,
      goodsListNum: {
        onSale: 0,
        unSale: 0,
        draft: 0
      },
      keyWords: '',
      currentGoodsItem: {},
      currentGoodsIndex: 0,
      // 强制下架操作
      forceDownReason: ''
    }
  },
  computed: {
    type () {
      let { type } = this.$route.query
      return type ? Number(type) : 0
    },
    isEdited () {
      return !!this.$route.query.isEdited
    },
    // 是否从 H5 页面跳转过来的，指的是 发布/编辑商品以及商品详情页
    isFromH5Page () {
      return !!this.$route.query.h5Page
    }
  },
  activated () {
    let { type, isEdited, isFromH5Page } = this
    if (isFromH5Page) {
      if (isEdited) {
        this.currentTab = type
        this.keyWords = ''
        this.pullDownRefreshData()
        // 页面回滚顶部
        this.$nextTick(() => {
          this.$refs.goodsManageScroll.scrollTo(0, 0, 0, 0)
        })
      }
      return
    }
    this.currentTab = type
    this.getData()
  },
  methods: {
    async getData () {
      /* eslint-disable */
      let { currentTab, keyWords, m_hasMore } = this
      if (!this.m_hasMore) return
      let url = 'goods'
      let obj = {
        type: currentTab + 1,
        page: ++this.m_page,
        keyword: keyWords
      }
      if (currentTab !== 0) delete obj.keyword
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { goodsList, topNumList } = res.data
          let { onSale, unSold, draft } = topNumList
          this.handlerGoodsList(goodsList.data)
          if (this.m_page === 1) {
            this.m_dataList = goodsList.data
          } else {
            this.m_dataList = [...this.m_dataList, ...goodsList.data]
          }
          /* eslint-enable */
          this.goodsListNum.onSale = onSale
          this.goodsListNum.unSale = unSold
          this.goodsListNum.draft = draft
          this._checkMore(goodsList)
          this.isFirstEnterGoodsManage = true
        }
      })
      return Promise.resolve()
    },
    handlerGoodsList (data) {
      data.forEach(item => {
        item.operateList = cloneDeep(operateList)
        item.price = item.price / 100
      })
    },
    goPublishGoods () {
      this.$push({ path: '/publish-goods', query: { type: this.type, fromShopManage: 1 } })
    },
    toggleGoodsListStatus (i) {
      if (this.currentTab === i) return
      this.currentTab = i
      this.keyWords = ''
      this.pullDownRefreshData()
    },
    searchOnSaleGoods () {
      this.pullDownRefreshData()
    },
    showDraftGuide () {
      this.$refs.draft.isShow = true
    },
    hideDraftGuide () {
      this.$refs.draft.isShow = false
    },
    operateCurrentGoods (goodsItem, operateItem, goodsIndex) {
      let { type } = operateItem
      this.currentGoodsItem = goodsItem
      this.currentGoodsIndex = goodsIndex
      let { id } = goodsItem
      switch (type) {
        case 1:
          this.goGoodsDetail(id)
          break
        case 2:
          this.goEditeGoods(id)
          break
        case 3:
          this.showUpGoodsPopup()
          break
        case 4:
          this.showDownGoodsPopup()
          break
        case 5:
          this.showDeleteGoodsPopup()
          break
        case 6:
          this.showShareGoodsPopup()
          break
      }
    },
    goGoodsDetail (id) {
      this.$push({ path: `/detail/${id}`, query: { fromShopManage: 1 } })
    },
    goEditeGoods (id) {
      let { currentGoodsIndex, currentTab } = this
      this.$push({ path: '/publish-goods', query: { id, type: currentTab, fromShopManage: 1 } })
      this.m_dataList[currentGoodsIndex].operateList[2].selected = false
    },
    // 上架商品
    showUpGoodsPopup () {
      /* eslint-disable */
      let { currentGoodsItem, currentGoodsIndex } = this
      let { is_delete, shelf_reason, stock } = currentGoodsItem
      this.m_dataList[currentGoodsIndex].operateList[2].selected = true
      if (is_delete === 3) {
        this.forceDownReason = shelf_reason
        this.$refs.forceDownPopup.show()
        return
      }
      if (!stock) {
        this.$t('该商品库存为0，请编辑后再上架！')
        return
      }
      this.$refs.upGoods.show()
      /* eslint-enable */
    },
    cancelUpCurrentGoods () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[2].selected = false
      this.$refs.upGoods.hide()
    },
    confirmUpCurrentGoods () {
      let { currentGoodsItem } = this
      let url = 'goods/setStatus'
      let obj = {
        type: '1',
        id: currentGoodsItem.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let index = this.findCurrentGoodsItem(currentGoodsItem.id)
          this.goodsListNum.onSale++
          this.goodsListNum.unSale--
          this.m_dataList.splice(index, 1)
          this.$t('上架成功')
          this.$refs.upGoods.hide()
          this.loadMoreData()
        }
      })
    },
    hideForceDownPopup () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[2].selected = false
    },
    // 下架商品
    showDownGoodsPopup () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[3].selected = true
      this.$refs.downGoods.show()
    },
    cancelDownCurrentGoods () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[3].selected = false
      this.$refs.downGoods.hide()
    },
    confirmDownCurrentGoods () {
      let { currentGoodsItem } = this
      let url = 'goods/setStatus'
      let obj = {
        type: '-1',
        id: currentGoodsItem.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let index = this.findCurrentGoodsItem(currentGoodsItem.id)
          this.goodsListNum.onSale--
          this.goodsListNum.unSale++
          this.m_dataList.splice(index, 1)
          this.$t('下架成功')
          this.$refs.downGoods.hide()
          this.loadMoreData()
        }
      })
    },
    // 删除商品
    showDeleteGoodsPopup () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[4].selected = true
      this.$refs.deleteGoods.show()
    },
    cancelDeleteCurrentGoods () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[4].selected = false
      this.$refs.deleteGoods.hide()
    },
    confirmDeleteCurrentGoods () {
      let { currentGoodsItem, currentTab } = this
      let url = 'goods/delete'
      let obj = {
        id: currentGoodsItem.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let index = this.findCurrentGoodsItem(currentGoodsItem.id)
          switch (currentTab) {
            case 0:
              this.goodsListNum.onSale--
              break
            case 1:
              this.goodsListNum.unSale--
              break
            case 2:
              this.goodsListNum.draft--
              break
          }
          this.m_dataList.splice(index, 1)
          this.$t('删除成功')
          this.$refs.deleteGoods.hide()
          this.loadMoreData()
        }
      })
    },
    // 分享商品
    showShareGoodsPopup () {
      /* eslint-disable */
      let { currentGoodsIndex, currentGoodsItem } = this
      let { boutique, material, is_stock_good, purchase_price, image_path, isHot, isflash, title, id } = currentGoodsItem
      let obj = {
        id,
        isHot: isHot === 1,
        isFlash: isflash === 1,
        title,
        isNewGoods: is_stock_good === 1,
        isJoinedBestGoods: boutique === 1,
        isJoinedMeterialGoods: material === 1,
        retailPrice: purchase_price,
        goodsPicture: image_path
      }
      this.currentGoodsItem = obj
      this.m_dataList[currentGoodsIndex].operateList[5].selected = true
      this.$refs.goodsShare.show()
      /* eslint-enable */
    },
    hideShareGoodsPopup () {
      let { currentGoodsIndex } = this
      this.m_dataList[currentGoodsIndex].operateList[5].selected = false
    },
    findCurrentGoodsItem (id) {
      return this.m_dataList.findIndex(item => item.id === id)
    }
  },
  filters: {
    formatMoney (value) {
      value = value.split('~')
      return value[0]
    }
  },
  components: {
    BaseConfirm,
    BaseDownPop,
    BaseShare
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
$4a = #4A4A4A
bd()
  &:after
    content ''
    position absolute
    height 1px;/*no*/
    width 100%
    background #dedede
    bottom 0
    left 0
    right 0
.shop-manage-container
  height 100%
  overflow hidden
  flex-col()
  .cgs-header-container
    .shop-manage-publish
      color #4A90E2
      f14()
      padding 20px 0
  .shop-manage-tab
    height 100px
    flex-f-align()
    background-color $color-white
    border-bottom 4px solid transparent
    position relative
    bd()
    &:after
      bottom -4px
    .tab-item
      flex 1
      flex-center()
      f14()
      height 100%
      color $4a
      &.active
        color $color-orange
      .goods-num
        margin-left 15px
    .line
      position absolute
      left 0
      bottom -3px
      width 33.33%
      height 4px
      background-color #fff
      transition all .5s
      &:after
        content ''
        display block
        width 160px
        height 100%
        margin 0 auto
        background-color $color-orange
        border-radius(2px)
      &.one
        left 0
      &.two
        left 33.33%
      &.three
        left 66.66%
  .shop-manage-search
    background $color-white
    padding 0 24px
    height 100px
    flex-f-align()
    f14()
    position relative
    bd()
    input
      flex 1
      height 60px
      border-radius(100px)
      padding-left 24px
      padding-right 60px
      color $color-9
      background #F0F0F0
    i
      position absolute
      box-sizing content-box
      z-index 10
      wh(32px)
      bg('icon-close.png')
      background-origin content-box
      background-clip content-box
      padding 10px
      margin-right -10px
      right 120px
      top 50%
      transform translateY(-50%)
    label
      color $4a
      padding 16px
      margin-right -16px
  .draft-guide
    height 60px
    line-height 60px
    f12()
    tc()
    background #ffe8cc
    color $color-orange
  .scroll-container
    flex 1
    overflow hidden
  .goods-list
    .goods-item
      background $color-white
      & + .goods-item
        margin-top 20px
    .goods-main-info
      height 220px
      padding 30px 24px
      position relative
      bd()
      flex-f()
      .goods-pic
        wh(160px)
        border-radius(10px)
        margin-right 32px
        position relative
        img
          wh(100%)
        span
          position absolute
          width 100%
          left 0
          bottom 0
          background $color-red
          color $color-white
          tc()
          f12()
          height 30px
          line-height 30px
      .goods-info
        flex 1
        flex-col-btw()
        h2
          f14()
          color $4a
          line-height 40px
          text-over(1)
          .hot-goods
            color $color-red
          .flash-goods
            padding 0 18px
            overflow hidden
            color $color-white
            background $color-orange
            border-radius 36px
            line-height 36px
            vertical-align bottom
        .goods-category
          flex-f-align()
          span
            f10()
            border-radius(4px)
            padding 6px
            padding-top 7px
            & + span
              margin-left 8px
            &.new-goods
              color #F47575
              background rgba(244, 117, 117, .1)
            &.best-goods
              color $color-orange
              background rgba(255, 138, 0, .1)
            &.meterial-goods
              color #6DACF6
              background rgba(109, 172, 246, .1)
        .goods-price
          f14()
          flex-align-item()
          .price
            color $color-orange
          .commission
            height 30px
            flex-center()
            padding 0 8px
            color $color-white
            fz(9px)
            background $color-orange
            border-radius(100px)
            i
              width 20px
              height 22px
              bg('icon-commission.png')
            span
              margin-top 3px
        .goods-stock
          f12()
          color #BCBCBC
          flex-f-align()
          .saled-num
            margin-right 26px
          .unsaled-num
            //
    .goods-operate-list
      height 80px
      flex-f()
      .operate-item
        position relative
        height 100%
        flex 1
        flex-center()
        f12()
        color $color-6
        & + .operate-item
          &:before
            content ''
            position absolute
            width 1px;/*no*/
            height 20px
            background #dedede
            left 0
            top 50%
            transform translateY(-50%)
        &.forbidden
          color $color-bc
          pointer-events none
        &.active
          color $color-orange
        img
          margin-left 12px
          &.preview
            wh(28px)
          &.edit
            width 24px
            height 26px
          &.up
            width 26px
            height 23px
          &.down
            width 24px
            height 20px
          &.delete
            width 32px
            height 28px
          &.share
            wh(28px)
  .no-data
    padding-top 192px
    img
      display block
      width 28%
      margin 0 auto
    p
      tc()
      f12()
      color $color-bc
      margin-top 40px
      &.txt
        margin-top 30px
  .senior-popup-wrapper
    background rgba(0, 0, 0, 0.4)!important
    .draft-guide-wrapper
      position absolute
      width 72%
      left: 50%
      top: 50%
      transform translate(-50%, -50%)
      border-radius(24px)
      background $color-white
      padding: 35px 30px 0
      img
        display: block
        margin: 0 auto 52px
        width: 48.3%
      p
        f15()
        color $color-6
        text-indent: 60px
        line-height: 1.4
      h2
        line-height: 104px;/*px*/
        tc()
        fz(17px)
        color $color-blue
        bd-t($color-border)
        margin-top 42px  
</style>
