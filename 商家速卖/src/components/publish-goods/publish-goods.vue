<template>
  <transition name="has-data">
    <div class="publish-goods-container" v-show="showPublishGoods">
      <base-header
        :intercept-back="true"
        @headerBack="backShopManage">
      </base-header>
      <div class="scroll-container">
      <!-- <base-scroll
        :has-more="true"
        :beforeScroll="true"
        @beforeScroll="beforeScroll"> -->
        <base-goods-banner
          :goods-banner-list="goodsBannerList"
          @uploadedGoodsBanner="getGoodsBannerList">
        </base-goods-banner>
        <ul class="form-group">
          <li class="form-item no-height title">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item title"></i>
            </label>
            <div class="item-content no-padding-left">
              <base-textarea
                class="textarea"
                placeholder="请输入商品名称，如“亚细亚瓷砖法国木纹地砖厨房墙砖卫生间地砖木纹墙地面砖300*300”"
                :max="48"
                v-model="goodsTitle">
              </base-textarea>
            </div>
          </li>
          <li class="form-item arrow">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item category"></i>
              <b class="item-name">类目</b>
            </label>
            <div class="item-content" @click="setGoodsAttr">
              <span class="ellipsis">{{ goodsCategory.name }}</span>
            </div>
          </li>
          <li class="form-item arrow">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item measurement"></i>
              <b class="item-name">计量单位</b>
            </label>
            <div class="item-content" @click="setGoodsUnit">
              <span>{{ goodsSelectedUnit }}</span>
            </div>
          </li>
          <li class="form-item arrow" v-show="brandCount">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item brand"></i>
              <b class="item-name">品牌<span v-show="brandCount && brandList[0].list[0].require !== 'isRequire'"> (可选)</span></b>
            </label>
            <div class="item-content" @click="setGoodsBrand">
              <span>{{ goodsSelectedBrand.val }}</span>
            </div>
          </li>
          <li class="form-item arrow">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <i class="icon-item quotation-type"></i>
              <b class="item-name">报价方式</b>
            </label>
            <div class="item-content" @click="setGoodsPriceType">
              <span>{{ goodsSelectedPriceType }}</span>
            </div>
          </li>
          <li class="form-item arrow"
            v-show="isShowMultiSpecGuide">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <i class="icon-item specification"></i>
              <b class="item-name">商品规格<span> (可选)</span></b>
            </label>
            <div class="item-content" @click="setGoodsSku">
              <span>{{ multiSpecificationGoodsTips }}</span>
            </div>
          </li>
          <li class="form-item"
            v-show="!isMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item purchase-price"></i>
              <b class="item-name">市场标价</b>
            </label>
            <div class="item-content">
              <input
                type="number"
                placeholder="商品市场标价"
                v-model="commonPrice"
                >
            </div>
          </li>
          <li class="form-item"
            v-show="!isMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item sale-price"></i>
              <b class="item-name">零售限价</b>
            </label>
            <div class="item-content">
              <input
                type="number"
                placeholder="家装业主购买价"
                v-model="promotionPrice"
                >
            </div>
          </li>
          <li class="form-item"
            :class="{ 'no-border': !goodsId }"
            v-show="!isMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star">*</i>
              <i class="icon-item vip-price"></i>
              <b class="item-name">特约采购师价</b>
            </label>
            <div class="item-content">
              <input
                type="number"
                placeholder="采购师自购价"
                v-model="purchasePrice"
                >
            </div>
          </li>
          <li class="price-desc"
            v-show="!goodsId">
            (只有通过您认证的特约采购师才能看见商品价格，其他均不可见)
          </li>
          <li class="form-item"
            v-show="!isMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <i class="icon-item commission"></i>
              <b class="item-name">佣金金额 <span>(￥)</span></b>
            </label>
            <div class="item-content">
              <input
                class="commission"
                type="text"
                readonly
                disabled
                placeholder="佣金金额=零售限价-特约采购师价"
                v-model="commission">
            </div>
          </li>
          <li class="form-item">
            <div class="choose-now-goods">
              <div class="now-goods-left">
                <span>是否现货</span>
              </div>
              <div class="now-goods-center">
                <label for="1">
                  <span :class="{active: isStockGood === 1}"></span>
                  <input id="1" name="item" type="radio" :value="1" v-model="isStockGood">现货
                </label>
                <label for="2">
                  <span :class="{active: isStockGood === 0}"></span>
                  <input id="2" name="item" type="radio" :value="0" v-model="isStockGood">非现货
                </label>
              </div>
              <div class="now-goods-right" v-show="isStockGood === ''">
                <span>请选择</span>
              </div>
            </div>
          </li>
        </ul>
        <ul class="form-group">
          <li class="form-item" v-show="goodsType">
            <label class="label">
              <i class="icon-star">*</i>
              <b class="item-name">最小起订量</b>
            </label>
            <div class="item-content">
              <input
                type="number"
                v-model="minBuyNumber">
            </div>
          </li>
          <li class="form-item" v-show="!isEditMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star">*</i>
              <b class="item-name">总库存</b>
            </label>
            <div class="item-content">
              <input
                type="number"
                max="9"
                v-model="goodsStock"
                >
            </div>
          </li>
          <li
            class="form-item arrow"
            :class="{ 'no-border': isEditMultiSpecificationGoods }"
            @click="editGoodsDescription">
            <label class="label">
              <i class="icon-star">*</i>
              <b class="item-name">商品描述</b>
            </label>
            <div class="item-content">
              <span>{{ isEditGoodsDescription }}</span>
            </div>
          </li>
          <li class="form-item" v-show="!isEditMultiSpecificationGoods">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <b class="item-name">商品编码</b>
            </label>
            <div class="item-content">
              <input type="number" max="13" v-model="goodsCode">
            </div>
          </li>
        </ul>
        <ul class="form-group">
          <li class="form-item arrow">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <b class="item-name">运费</b>
            </label>
            <div class="item-content" @click="setGoodsFreight">
              <span>{{ goodsSelectedFreight }}</span>
            </div>
          </li>
          <li class="form-item arrow">
            <label class="label">
              <i class="icon-star no-star">*</i>
              <b class="item-name">发货日期</b>
            </label>
            <div class="item-content" @click="setGoodsDeliverDate">
              <span>{{ goodsSelectedDate }}</span>
            </div>
          </li>
        </ul>
        <p ref="placeholder"></p>
      <!-- </base-scroll> -->
      </div>
      <div class="goods-footer">
        <div class="save-to-draft" @click="publishGoods(0)" v-show="!isEditNormalGoods">保存草稿</div>
        <div class="publish-goods" @click="publishGoods(1)">立即发布</div>
      </div>
      <base-picker
        ref="goodsUnit"
        :data='goodsUnitList'
        @change='getGoodsSelectedUnit'>
      </base-picker>
      <base-picker
        ref="goodsPriceType"
        :data='goodsPriceType'
        @change='getGoodsPriceType'>
      </base-picker>
      <base-picker
        ref="goodsFreight"
        :data='goodsFreightList'
        @change='getGoodsFreight'>
      </base-picker>
      <base-picker
        ref="goodsDeliverDate"
        :data='goodsDeliverDateList'
        @change='getGoodsDeliverDate'>
      </base-picker>
      <router-view
        :brand-list="brandList"
        :spec-list="goodsSkuList"
        :spec-comb-data="multiSpecificationGoods"
        :post-inter="intervalGoods"
        :is-choose-sec="!goodsType"
        :is-edit-normal-goods="isEditNormalGoods"
        @getCategoryAndBrandAndSku="getCategoryAndBrandAndSku"
        @getSelectedBrand="getSelectedBrand"
        @getGoodsSku="getGoodsSkuCombination"
        @getGoodsIntervalInfo="getGoodsIntervalInfo">
      </router-view>
      <i class="goods-guide" ref="guide" @click="viewHelp" v-show="!goodsId"></i>
    </div>
  </transition>
</template>

<script>
import BaseGoodsBanner from 'base/goods-banner'
import BaseTextarea from 'base/input/textarea'
import BasePicker from 'base/confirm/confirm-picker'
import brandList from 'data/brandList'
import REGMONEY from 'common/js/util'
import { isUnDef, isArray, judgeObjectLen, toJson, cloneDeep, splitMoney, createDragTouch } from 'commons'
import { closeWebview } from 'navtive'
let tempBrandList = cloneDeep(brandList)
export default {
  name: 'PublishGoods',
  data () {
    return {
      isBeforeScroll: true,
      showPublishGoods: false,
      goodsBannerList: [],
      goodsTitle: '',
      goodsCategory: {},
      historyItem: {},
      // 计量单位
      goodsSelectedUnit: '',
      goodsUnitList: [],
      // 品牌信息
      brandList: [],
      goodsSelectedBrand: {},
      // 报价方式
      goodsPriceType: [['规格报价']],
      goodsSelectedPriceType: '',
      // 商品 sku
      goodsSkuList: [],
      // 多规格商品容器
      multiSpecificationGoods: [],
      // 区间报价数据
      intervalGoods: [],
      // 市场标价
      commonPrice: '',
      // 零售限价
      promotionPrice: '',
      // 采购师价
      purchasePrice: '',
      // 是否现货
      isStockGood: 1,
      // 最小起订量
      minBuyNumber: 1,
      // 总库存
      goodsStock: '',
      // 商品描述
      goodsDescription: '',
      goodsCode: '',
      // 运费列表
      goodsFreightList: [],
      goodsSelectedFreight: '',
      // 发货日期列表
      goodsDeliverDateList: [],
      goodsSelectedDate: '',
      goodsDetail: {}
    }
  },
  computed: {
    // 是否从商品管理列表跳转过来
    isFromShopManage () {
      return !!this.$route.query.fromShopManage
    },
    goodsId () {
      return this.$route.query.id
      // return 2315
      // return 2040
    },
    // 是否是编辑草稿
    isEditDraft () {
      return this.goodsId && Number(this.$route.query.type) === 2
    },
    // 是否是编辑上架/未上架商品
    isEditNormalGoods () {
      return this.goodsId && Number(this.$route.query.type) !== 2
    },
    brandCount () {
      return this.brandList.length
    },
    // 商品类型，默认是无规格报价，否则区间报价
    goodsType () {
      return this.goodsSelectedPriceType === '规格报价'
    },
    // 是否要显示多规格商品项添加导航
    isShowMultiSpecGuide () {
      return this.goodsType && this.isSkuGoods
    },
    // 是否是区间商品
    isIntervalGoods () {
      return !this.goodsType && this.intervalGoods.length
    },
    // 是否具有 sku 属性
    isSkuGoods () {
      return !!this.goodsSkuList.length
    },
    // 是否编辑了多规格商品
    isEditMultiSpecificationGoods () {
      return !!this.multiSpecificationGoods.length
    },
    // 是否是多规格商品
    isMultiSpecificationGoods () {
      return this.goodsType && this.isEditMultiSpecificationGoods && !this.intervalGoods.length
    },
    // 是否编辑过多规格商品的提示信息
    multiSpecificationGoodsTips () {
      return this.isEditMultiSpecificationGoods ? '已编辑' : ''
    },
    // 多规格下，计算总库存
    totalStock () {
      let { isEditMultiSpecificationGoods, multiSpecificationGoods, goodsStock } = this
      let total = 0
      if (isEditMultiSpecificationGoods) {
        multiSpecificationGoods.forEach(item => {
          total += Number(item.stock)
        })
        return total
      }
      return Number(goodsStock)
    },
    commission () {
      let {init, zero} = splitMoney(this.promotionPrice - this.purchasePrice)
      let res = `${init}.${zero}`
      if (parseFloat(res) > 0) {
        return res
      }
      return ''
    },
    // 是否编辑过商品描述
    isEditGoodsDescription () {
      return this.goodsDescription ? '已编辑' : ''
    }
  },
  created () {
    this.initGoods()
    window.returnGoodsDetail = this.getGoodsDescription
  },
  methods: {
    backShopManage () {
      if (this.isFromShopManage) {
        this.$push({ path: '/shop-manage', query: { fromNative: 1, h5Page: 1 } })
      } else {
        closeWebview()
      }
    },
    viewHelp () {
      this.$push('/publish-goods/create-goods-help')
    },
    // 初始化商品
    initGoods () {
      try {
        let url = 'goods/initialize'
        if (this.goodsId) {
          this.editDraftGoods().then(categoryId => {
            this.getGoodsSkuData(categoryId)
          })
          return
        }
        this.$http(url).then(res => {
          if (res.code === this.$ok) {
            let { dataUnit, freight, data } = res.data
            this.handlerGoodsUnit(dataUnit)
            this.handlerGoodsFreight(freight)
            this.handlerGoodsDeliverDate(data)
          }
          this.showPublishGoods = true
        })
      } catch (e) {
        console.log(e)
        this.showPublishGoods = true
      }
    },
    // 编辑草稿箱商品
    async editDraftGoods () {
      /* eslint-disable */
      const url = 'goods/editGoods'
      const obj = {
        id: this.goodsId
      }
      let categoryId
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let { cateArr, category_id, dateArr, freightArr, generalAttr, priceInterval, productImage,
                productObject, specPriceArr, unitArr } = res.data
          let { content, title, unit, freight, price, promotion_price, purchase_price, minimum_quantity,
                stock, is_stock_good, deliver_date, priceTerms, seller_code } = productObject
          // 市场标价&零售限价&特约采购师价&最小起批&库存
          let regPrice = /null|^0.00$|^0$/
          categoryId = category_id
          // 商品图片
          this.goodsBannerList = productImage
          // 商品标题
          this.goodsTitle = isUnDef(title) ? '' : title
          // 已选计量单位
          this.goodsSelectedUnit = isUnDef(unit) ? '' : unit
          this.commonPrice = regPrice.test(String(price)) ? '' : price
          this.promotionPrice = regPrice.test(String(promotion_price)) ? '' : promotion_price
          this.purchasePrice = regPrice.test(String(purchase_price)) ? '' : purchase_price
          this.minBuyNumber = regPrice.test(String(minimum_quantity)) ? 1 : minimum_quantity
          this.goodsStock = regPrice.test(String(stock)) ? '' : stock
          // 是否现货
          this.isStockGood = is_stock_good
          if ((specPriceArr.length > 0 && !priceInterval.length) || !priceTerms) {
            this.goodsSelectedPriceType = '规格报价'
          } else if (priceInterval.length || priceTerms) {
            this.goodsSelectedPriceType = '区间报价'
          }
          this.goodsDetail = productObject
          // 商品编码
          this.goodsCode = isUnDef(seller_code) ? '' : seller_code
          // 商品描述
          this.goodsDescription = isUnDef(content) ? '' : content
          // 已选运费
          this.goodsSelectedFreight = isUnDef(deliver_date) ? '' : deliver_date
          // 已选发货时间
          this.goodsSelectedDate = isUnDef(freight) ? '' : freight
          // 处理类目
          this.handlerGoodsCategory(category_id, cateArr)
          // 处理品牌
          this.handlerGoodsBrand(generalAttr)
          // 处理多规格
          this.handlerMultiSpecGoods(specPriceArr)
          // 处理区间
          this.handlerIntervalGoods(priceInterval)
          this.handlerGoodsUnit(unitArr)
          this.handlerGoodsDeliverDate(dateArr)
          this.handlerGoodsFreight(freightArr)
        }
      })
      return Promise.resolve(categoryId)
      /* eslint-enable */
    },
    // 获取商品 sku 属性列表
    getGoodsSkuData (categoryId) {
      const url = 'goods/goodsSku'
      const obj = {
        categoryId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.goodsSkuList = res.data
        }
        this.showPublishGoods = true
      })
    },
    // 处理类目信息
    handlerGoodsCategory (categoryId, data) {
      let categoryNames = ''
      let categoryIds = ''
      data.forEach(categoryItem => {
        let { name, id } = categoryItem
        categoryNames += name + '>>'
        categoryIds += id + ','
      })
      categoryNames = categoryNames.substr(0, categoryNames.length - 2)
      categoryIds = categoryIds.substr(0, categoryIds.length - 1)
      // 已选类目
      this.goodsCategory = { id: categoryId, name: categoryNames }
      // 历史记录
      this.historyItem = { id: categoryIds, name: categoryNames }
    },
    // 处理多规格报价数据
    handlerMultiSpecGoods (data) {
      /* eslint-disable */
      data.forEach(skuItem => {
        let { price, purchase_price, promotion_price, store, seller_code, crux, sku } = skuItem
        let obj = {
          price: isUnDef(price) ? '0' : price,
          purchasePrice: isUnDef(purchase_price) ? '0' : purchase_price,
          promotionPrice: isUnDef(promotion_price) ? '0' : promotion_price,
          stock: store,
          sellerCode: seller_code
        }
        if (crux && !isArray(crux)) obj.crux = crux
        if (sku && !isArray(sku)) obj.sku = sku
        this.multiSpecificationGoods.push(obj)
      })
      /* eslint-enable */
    },
    // 处理区间报价数据
    handlerIntervalGoods (data) {
      data.forEach(intervalItem => {
        let { purchase_amount, price, promotion_price, purchase_price } = intervalItem
        let obj = {
          mqq: purchase_amount,
          price,
          purchasePrice: purchase_price,
          promotionPrice: promotion_price
        }
        this.intervalGoods.push(obj)
      })
    },
    // 处理品牌数据
    handlerGoodsBrand (brandInfo) {
      /* eslint-disable */
      if (brandInfo && judgeObjectLen(brandInfo)) {
        let { isRequire = '', is_change, require, attr_values } = brandInfo
        if (require) isRequire = 'isRequire'
        this.brandList = attr_values.map(brandItem => {
          let { is_select, attr_value, attr_id, id, is_custom = 0, shopBrand = 0, pinyin } = brandItem
          if (is_select) this.goodsSelectedBrand.val = attr_value
          return {
            attrId: attr_id,
            id,
            val: attr_value,
            require: isRequire,
            custom: is_custom,
            shopBrand: shopBrand,
            pinyin
          }
        })
        tempBrandList.forEach((listItem, index, arr) => {
          this.brandList.forEach(brandItem => {
            if (!brandItem.pinyin) {
              if (index === 0) {
                arr[0].list.push(brandItem)
              }
            } else {
              if (brandItem.pinyin === listItem.categorySymbol) {
                listItem.list.push(brandItem)
              }
            }
          })
        })
        for (var i = 0; i < tempBrandList.length; i++) {
          if (!tempBrandList[i].list.length) {
            tempBrandList.splice(i, 1)
            i--
          }
        }
        this.brandList = tempBrandList
        if (is_change) this.goodsSelectedBrand.val = '品牌已被您删除，请重选选择'
      }
      /* eslint-enable */
    },
    // 处理计量单位
    handlerGoodsUnit (data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.title)
      })
      this.goodsUnitList.push(arr)
    },
    // 处理运费
    handlerGoodsFreight (data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.title)
      })
      this.goodsFreightList.push(arr)
    },
    // 处理发货日期
    handlerGoodsDeliverDate (data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.title)
      })
      this.goodsDeliverDateList.push(arr)
    },
    getGoodsBannerList (list) {
      this.goodsBannerList = list
    },
    // 选择类目
    setGoodsAttr () {
      if (this.isEditNormalGoods) {
        this.$push({ path: '/publish-goods/select-category', query: { isEditNormalGoods: 1 } })
        return
      }
      this.$push({ path: '/publish-goods/select-category' })
    },
    // 选择计量单位
    setGoodsUnit () {
      this.$refs.goodsUnit.show()
    },
    // 获取计量单位
    getGoodsSelectedUnit (unit) {
      this.goodsSelectedUnit = unit[0]
    },
    // 选择品牌
    setGoodsBrand () {
      if (this.isEditNormalGoods) {
        this.$push({ path: '/publish-goods/select-brand', query: { isEditNormalGoods: 1 } })
        return
      }
      this.$push({ path: '/publish-goods/select-brand' })
    },
    // 获取选中的品牌
    getGoodsSelectedBrand (brand) {
      this.goodsSelectedBrand = brand
    },
    // 选择报价方式
    setGoodsPriceType () {
      this.$refs.goodsPriceType.show()
    },
    // 获取选中的报价方式
    getGoodsPriceType (priceType) {
      this.goodsSelectedPriceType = priceType[0]
    },
    // 选择商品规格
    setGoodsSku () {
      if (this.isEditNormalGoods) {
        this.$push({ path: '/publish-goods/select-specification-price', query: { isEditNormalGoods: 1 } })
        return
      }
      this.$push({ path: '/publish-goods/select-specification-price' })
    },
    editGoodsDescription () {
      let { $dev, goodsDescription, goodsDetail } = this
      if ($dev === 1) {
        window.android.goodsDetail(goodsDescription, goodsDetail.is_pc)
      } else if ($dev === 2) {
        window.webkit.messageHandlers.goodsDetail.postMessage({
          content: goodsDescription,
          isEditeInPc: goodsDetail.is_pc,
          type: 1
        })
      }
    },
    getGoodsDescription (content) {
      this.goodsDescription = content
    },
    // 设置运费
    setGoodsFreight () {
      this.$refs.goodsFreight.show()
    },
    getGoodsFreight (freight) {
      this.goodsSelectedFreight = freight[0]
    },
    // 设置发货时间
    setGoodsDeliverDate () {
      this.$refs.goodsDeliverDate.show()
    },
    getGoodsDeliverDate (date) {
      this.goodsSelectedDate = date[0]
    },
    getCategoryAndBrandAndSku (payload) {
      // 已选类目，历史类目，品牌数据，sku 列表数据
      let { cate, historyItem, brandListData, specListData } = payload
      this.goodsCategory = cate
      this.historyItem = historyItem
      this.brandList = brandListData
      this.goodsSkuList = specListData
      // 重置所选 sku 组合和品牌
      this.multiSpecificationGoods = []
      this.goodsSelectedBrand = {}
    },
    // 获取重选品牌数据
    getSelectedBrand (brand) {
      this.goodsSelectedBrand = brand
    },
    // 获取重选 sku 数据
    getGoodsSkuCombination (sku) {
      this.multiSpecificationGoods = sku
    },
    // 获取重选区间数据
    getGoodsIntervalInfo (intervalCombination) {
      this.intervalGoods = intervalCombination
    },
    publishGoods (type) {
      // 保存草稿
      if (!type) {
        if (!this.goodsCategory.name) {
          this.$t('请选择类目信息')
          return
        }
      } else {
        if (!this.validateCommonFields()) return
      }
      let { goodsTitle, goodsBannerList, goodsCategory, historyItem, goodsSelectedBrand, goodsType,
            intervalGoods, goodsId, isIntervalGoods, isMultiSpecificationGoods, commonPrice, promotionPrice,
            purchasePrice, minBuyNumber, isStockGood, isEditMultiSpecificationGoods, totalStock,
            goodsCode, goodsSelectedUnit, goodsDescription, goodsSelectedFreight, goodsSelectedDate, $ok, $t, $http, $push } = this
      delete goodsSelectedBrand.pinyin
      const url = type ? 'goods/save' : 'goods/draftSave'
      const obj = {
        // =====================公共字段 -- 开始==============================
        imagePath: goodsBannerList.join(),
        title: goodsTitle.trim(),
        categoryId: goodsCategory.id,
        categoryIds: historyItem.id,
        name: historyItem.name,
        unit: goodsSelectedUnit,
        brandName: toJson(goodsSelectedBrand),
        priceTerms: goodsType ? 0 : 1,
        content: goodsDescription,
        stock: totalStock,
        freight: goodsSelectedFreight,
        deliverDate: goodsSelectedDate,
        draft: type ? 0 : 1,
        // 是否为特约商品
        special: 1,
        // 是否现货
        isStockGood,
        // =====================公共字段 -- 结束==============================
        // 最小起订量
        mqq: minBuyNumber,
        // 市场标价
        price: commonPrice,
        // 零售限价
        promotionPrice,
        // 特约采购师价
        purchasePrice,
        sellerCode: goodsCode,
        // 区间
        interval: toJson(intervalGoods),
        // 规格
        attr: this.formatMultiSpecGoods()
      }
      // 无规格报价移除字段
      const baseRemovedFileds = ['attr', 'interval']
      // 规格报价去除字段
      const multiSpecRemovedFileds = ['interval', 'price', 'purchasePrice', 'sellerCode']
      // 区间报价去除字段
      const intervalRemovedFileds = ['attr', 'mqq', 'price', 'purchasePrice', 'promotionPrice']
      // 混合报价移除字段
      const mixinsRemovedFileds = ['mqq', 'price', 'purchasePrice', 'promotionPrice']
      if (goodsId) obj.goodsId = goodsId
      // 无规格
      if (goodsType && !isMultiSpecificationGoods) this.removeCustomedAttr(obj, baseRemovedFileds)
      // 多规格
      if (isMultiSpecificationGoods) {
        this.removeCustomedAttr(obj, multiSpecRemovedFileds)
        obj.sellerCode = ''
      }
      // 区间
      if (isIntervalGoods) this.removeCustomedAttr(obj, intervalRemovedFileds)
      // 混合
      if (isEditMultiSpecificationGoods && intervalGoods.length) this.removeCustomedAttr(obj, mixinsRemovedFileds)
      $http(url, obj).then(res => {
        if (res.code === $ok) {
          if (type) {
            $push({ path: '/shop-manage', query: { type: 0, h5Page: 1, isEdited: 1, fromNative: 1 } })
          } else {
            $push({ path: '/shop-manage', query: { type: 2, h5Page: 1, isEdited: 1, fromNative: 1 } })
          }
          return
        }
        $t(res.message)
      })
    },
    // 校验通用字段
    validateCommonFields () {
      let { goodsTitle, goodsCategory, brandCount, brandList, goodsSelectedBrand, goodsType, intervalGoods,
            isMultiSpecificationGoods, commonPrice, promotionPrice, purchasePrice, minBuyNumber, goodsStock,
            totalStock, goodsCode, goodsSelectedUnit, goodsDescription } = this
      if (!goodsTitle.trim()) {
        this.$t('请填写商品标题')
        return false
      }
      if (!goodsCategory.name) {
        this.$t('请选择类目信息')
        return false
      }
      if (brandCount > 0 && brandList[0].require === 'isRequire') {
        if (!goodsSelectedBrand.val) {
          this.$t('请选择品牌')
          return false
        }
      }
      if (!goodsType) {
        if (!intervalGoods.length) {
          this.$t('请填写区间报价')
          return false
        }
      }
      if (goodsType) {
        if (!minBuyNumber || Number(minBuyNumber) < 0) {
          this.$t('请填写大于0的起订量')
          return false
        }
        if (!REGMONEY.isMoney(minBuyNumber)) {
          this.$t('起订量最多可输入9位数')
          return false
        }
        if (Number(minBuyNumber) > totalStock) {
          this.$t('起订量要小于库存总量')
          return false
        }
      }
      // 无规格报价
      if (!isMultiSpecificationGoods) {
        if (!commonPrice || Number(commonPrice) < 0) {
          this.$t('请填写大于0的市场标价')
          return false
        }
        if (!REGMONEY.isMoney(commonPrice)) {
          this.$t('市场标价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!promotionPrice) {
          this.$t('请填写零售限价')
          return false
        }
        if (Number(promotionPrice) > Number(commonPrice)) {
          this.$t('零售限价必须小于市场标价')
          return false
        }
        if (!REGMONEY.isMoney(promotionPrice)) {
          this.$t('零售限价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!purchasePrice) {
          this.$t('请填写特约采购师价')
          return false
        }
        if (Number(purchasePrice) > Number(promotionPrice)) {
          this.$t('特约采购师价必须小于零售限价')
          return false
        }
        if (!REGMONEY.isMoney(purchasePrice)) {
          this.$t('特约采购师价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!goodsStock || Number(goodsStock) < 0) {
          this.$t('请填写供应总量')
          return false
        }
        if (!REGMONEY.isMoney(goodsStock)) {
          this.$t('供应总量最多可输入9位数')
          return false
        }
        if (!REGMONEY.checkGoodsCode(goodsCode).is === 'N') {
          this.$t(REGMONEY.checkGoodsCode(goodsCode).msg)
          return false
        }
      }
      if (!goodsSelectedUnit) {
        this.$t('请选择计量单位')
        return false
      }
      if (!goodsDescription) {
        this.$t('请选择商品描述')
        return false
      }
      return true
    },
    // 移除多规格每项中 crux 和 sku 的 attr_val 以及其他属性
    formatMultiSpecGoods () {
      let multiSpecificationGoods = cloneDeep(this.multiSpecificationGoods)
      let arr = []
      arr = multiSpecificationGoods.map(item => {
        // 赋值 val 字段
        if (item.crux) {
          item.crux.val = item.crux.attr_value
          // 赋值 custom 字段
          item.crux.custom = item.crux.is_custom ? item.crux.is_custom : 0
          // 移除 crux 无关属性
          item.crux.attr_id && delete item.crux.attr_id
          item.crux.attr_name && delete item.crux.attr_name
          // eslint-disable-next-line
          ;(item.crux.is_custom === 0 || item.crux.is_custom === 1) && delete item.crux.is_custom
          delete item.crux.attr_value
        }
        if (item.sku) {
          item.sku.val = item.sku.attr_value
          item.sku.custom = item.sku.is_custom ? item.sku.is_custom : 0
          item.sku.attr_id && delete item.sku.attr_id
          item.sku.attr_name && delete item.sku.attr_name
          // eslint-disable-next-line
          ;(item.sku.is_custom === 0 || item.sku.is_custom === 1) && delete item.sku.is_custom
          delete item.sku.attr_value
        }
        return item
      })
      return toJson(arr)
    },
    // 移除相关字段
    removeCustomedAttr (attrObj, removedAttrList) {
      removedAttrList.forEach(attr => {
        delete attrObj[attr]
      })
    },
    // 强制重排
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    }
  },
  watch: {
    showPublishGoods () {
      if (!this.goodsId) {
        this.$nextTick(() => {
          createDragTouch(this.$refs.guide, { edgeDis: 200 })
        })
      }
    }
  },
  components: {
    BaseGoodsBanner,
    BaseTextarea,
    BasePicker
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.publish-goods-container
  // height 100%
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  overflow hidden
  background $color-body
  flex-col()
  .scroll-container
    flex 1
    overflow hidden
    overflow-y auto
    -webkit-overflow-scrolling touch
    &::-webkit-scrollbar
      width 0
  .form-group
    background $color-white
    padding 0 30px
    & + .form-group
      margin-top 20px
    .form-item
      border-b(#dfdfdf)
      padding 8px 0
      min-height 100px
      height 100px
      flex-f-align()
      &.arrow
        background url(./images/arrow.png) no-repeat center right
        background-size 16px auto
      &:last-child
        position relative
        &:after
          content unset
      &.no-height
        height auto
      &.title
        align-items flex-start
        padding-top 24px
      .label
        height 100%
        flex-f-align()
        .icon-star
          color $color-orange
          margin-right 12px
          padding-top 10px
          &.no-star
            opacity 0
            width 10px
        .icon-item
          &.title
            wh(32px)
            margin-right 12px
            bg('goods-title.png')
          &.category
            wh(28px)
            margin-right 12px
            bg('category.png')
          &.measurement
            width 34px
            height 28px
            margin-right 6px
            bg('measurement.png')
          &.brand
            width 30px
            height 32px
            bg('brand.png')
            margin-right 10px
          &.quotation-type
            width 26px
            height 34px
            margin-right 14px
            bg('quotation-type.png')
          &.specification
            wh(30px)
            margin-right 10px
            bg('specification.png')
          &.interval-price
            wh(36px)
            margin-right 4px
            bg('interval-price.png')
          &.purchase-price
            wh(32px)
            margin-right 8px
            bg('purchase-price.png')
          &.sale-price
            width 32px
            height 24px
            margin-right 8px
            bg('sale-price.png')
          &.vip-price
            width 32px
            height 28px
            margin-right 8px
            bg('vip-price.png')
          &.commission
            width 32px
            height 34px
            margin-right 8px
            bg('commission.png')
        .item-name
          f14()
          color $color-6
          span
            color $color-orange
      .item-content
        flex-f-align()
        justify-content flex-end
        height 100%
        flex 1
        padding 0 40px
        f14()
        tr()
        .textarea
          width 100%
        span
          &.ellipsis
            line-height 1.4
            text-over(1)
          color $color-6
        input
          wh(100%)
          color $color-3
          tr()
          &:placeholder
            color $color-c
          &.commission
            text-over(1)
            color $color-red
    .price-desc
      background #FFFAF5
      height 60px
      line-height 60px
      tc()
      fz(11px)
      color $color-c
    .choose-now-goods
      padding-left 60px
      height 84px
      f14()
      color $color-6
      flex-box-center()
      .now-goods-center
        flex-between()
        margin 0 55px
        label
          flex-f-align()
          line-height 40px
          &:nth-child(1)
            margin-right 72px
          span
            wh(36px)
            border-radius(50%)
            bd($color-c)
            margin-right 15px
            &.active
              bg('icon-choiced.png')
              border none
      .now-goods-right
        color $color-c
        f11()
  .goods-footer
    flex-f-align()
    height 88px
    > div
      flex 1
      height 100%
      width 50%
      line-height 88px
      tc()
      color $color-white
      f16()
      &.save-to-draft
        background-color #FFBB66
      &.publish-goods
        background-color $color-orange
  .no-padding-left
    padding-left 0!important
  .no-padding-right
    padding-right 0!important
  .no-border
    &:after
      content unset!important
.goods-guide
  position fixed
  right 0
  top 250px
  width 112px
  height 108px
  bg('bg-guide.png')
  z-index 1000
</style>
