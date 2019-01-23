<template>
  <transition name="has-data">
    <div class="publish-goods-container" v-if="showPublishGoods">
      <!-- 选择引用和新建 -->
      <div class="issue-box" v-if="showFlag">
        <div class="pic"><img src="./issue.png" /></div>
        <div class="li-boxes">
          <div class="select"><i></i><span>选择引用或新建商品</span></div>
          <div class="wire"></div>
          <div class="edit"><i></i><span>编辑信息</span></div>
          <div class="wire"></div>
          <div class="submit"><i></i><span>提交商品</span></div>
        </div>
        <div class="issue-btn">
          <div class="add" @click="closeIssue">新建商品</div>
          <router-link to="/quote-goods" tag="div" class="quote">引用产品</router-link>
        </div>
      </div>
      <!-- 选择引用和新建 -->
      <div class="max-height" v-if="showFlagTwo">
        <base-header :intercept-back="true" @headerBack="backShopManage"></base-header>
        <base-scroll ref="scroll" :has-more="true" :data="imaList" class="scroll-content publice-goods">
          <div class="goods-banner-wrapper">
            <div class="swiper-container" v-show="imaList.length">
              <div class="swiper-wrapper">
                <swiper :show-dots="imaList.length > 1">
                  <swiper-item v-for="(item, index) in imaList" :key="index">
                    <img @click="goCheckActive(index)" :src="item">
                  </swiper-item>
                </swiper>
              </div>
              <div class="upload-pic" @click="goAddActive" v-show="imaList.length < 8"></div>
            </div>
            <div class="no-banner" @click="goAddActive" v-show="!imaList.length"></div>
          </div>
          <div class="publish-container">
            <div class="publish-wrapper">
              <div class="publish-item publish-title">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-icon item-title"></span>
                </label>
                <group>
                  <x-textarea
                    :max='48'
                    placeholder="请输入商品名称，如“亚细亚瓷砖法国木纹地砖厨房墙砖卫生间地砖木纹墙地面砖300*300”"
                    v-model="areaText"
                    :rows="3"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-textarea>
                </group>
              </div>
              <router-link :to="linkCate" tag="div" class="publish-item publish-arrow">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-icon item-category"></span>
                  <span class="item-name">类目</span>
                </label>
                <input type="text" name="" v-model="categoryObj.name" value="" readonly="readonly" />
              </router-link>
              <div class="publish-item publish-arrow" @click="goUnit">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-icon item-measurement"></span>
                  <span class="item-name">计量单位</span>
                </label>
                <input type="text" name="" v-model="unitChoose" value="" readonly="readonly" />
              </div>
              <router-link :to="linkBrand" tag="div" class="publish-item publish-arrow" v-show="brandList.length > 0">
                <label>
                  <span class="item-star no-necessary">*</span>
                  <span class="item-icon item-brand"></span>
                  <span class="item-name">品牌</span>
                  <span class="item-no-necessary" v-if="brandList.length > 0 && brandList[0].list[0].require !== 'isRequire'">(可选)</span>
                </label>
                <input type="text" name="" v-model="brandObj.val" value="" readonly="readonly" />
              </router-link>
              <div class="publish-item publish-arrow" @click="goQuoMethod">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-icon item-quotation-type"></span>
                  <span class="item-name">报价方式</span>
                </label>
                <input type="text" name="" v-model="quoMethodChoose" value="" readonly="readonly" />
              </div>
              <router-link :to="`/edit-draft/${goodsId}/select-specification-price`" tag="div" class="publish-item publish-arrow" v-show="isShowCombSpec">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-icon item-specification"></span>
                  <span class="item-name">商品规格</span>
                  <span class="item-no-necessary">&nbsp;(可选)</span>
                </label>
                <input type="text" v-model="isSetSpecText" disabled />
              </router-link>
              <!-- <router-link :to="linkSec" tag="div" class="publish-item publish-arrow" v-show="sectionPriceArr.length > 0 || intervalQuo">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-icon item-interval-price"></span>
                  <span class="item-name">区间报价</span>
                </label>
                <input type="text" name="" v-model="isSetSectionText" readonly="readonly" />
              </router-link> -->
              <div class="publish-item" v-if="!intervalQuo && !isSetSpec">
                <label>
                  <span class="item-star special">*</span>
                  <span class="item-icon item-purchase-price"></span>
                  <span class="item-name">市场标价</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="number"
                    v-model="retailPrice"
                    class="item-input"
                    placeholder="商品市场标价"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
              <div class="publish-item" v-if="!intervalQuo && !isSetSpec">
                <label>
                  <span class="item-star special">*</span>
                  <span class="item-icon item-sale-price"></span>
                  <span class="item-name">零售限价</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="number"
                    v-model="recommonPrice"
                    class="item-input"
                    placeholder='家装业主购买价'
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
              <div class="publish-item no-border" v-if="!intervalQuo && !isSetSpec">
                <label>
                  <span class="item-star special">*</span>
                  <span class="item-icon item-vip-price"></span>
                  <span class="item-name">特约采购师价</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="number"
                    v-model="buyPrice"
                    class="item-input"
                    placeholder="采购师自购价"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
              <div class="price-description">
                <p class="price-txt">
                  (只有通过您认证的特约采购师才能看见商品价格，其他均不可见)
                </p>
              </div>
              <div class="publish-item" v-if="!intervalQuo && !isSetSpec">
                <label>
                  <span class="item-star special no-necessary"></span>
                  <span class="item-icon item-commission"></span>
                  <span class="item-name">佣金金额（￥）</span>
                </label>
                <input type="text" placeholder="佣金金额=零售限价-特约采购师价" readonly v-model="commission" class="commission">
              </div>
              <!-- <div class="commission-desc" v-if="!intervalQuo && !isSetSpec">
                <p>
                  <span></span>
                  采购师推荐商品给用户，用户购买后采购师所赚取的金额
                </p>
              </div> -->
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
            </div>
            <div class="publish-wrapper">
              <div class="publish-item" v-if="!intervalQuo">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-name">最小起订量</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="number"
                    :max="9"
                    v-model="smallNum"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
              <div class="publish-item" v-if="(!intervalQuo && !isSetSpec) || (intervalQuo&&!isSetSpec)">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-name">总库存</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="number"
                    :max="9"
                    v-model="offerNum"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
              <div class="publish-item publish-arrow" @click="goodDes">
                <label>
                  <span class="item-star">*</span>
                  <span class="item-name">商品描述</span>
                </label>
                <input type="text" name="" v-model="contentText" value="" readonly="readonly" />
              </div>
              <div class="publish-item no-border" v-if="!isSetSpec">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-name">商品编码</span>
                </label>
                <group>
                  <x-input
                    title=""
                    type="text"
                    :max="13"
                    v-model="sellerCode"
                    @on-focus="justifyBodyHeight"
                    @on-blur="restoreBodyHeight">
                  </x-input>
                </group>
              </div>
            </div>
            <div class="publish-wrapper">
              <div class="publish-item publish-arrow" @click="goFreight">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-name">运费</span>
                </label>
                <input type="text" name="" v-model="freightChoose" value="" readonly="readonly" />
              </div>
              <div class="publish-item publish-arrow" @click="goDataIss">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-name">发货日期</span>
                </label>
                <input type="text" name="" v-model="dataIssChoose" value="" readonly="readonly" />
              </div>
              <!-- <div class="mess-li mess-arrow no-border" @click="goPartIn" v-show="isCan"> -->
              <!-- <div class="publish-item publish-arrow no-border" @click="goPartIn">
                <label>
                  <span class="item-star no-necessary"></span>
                  <span class="item-name">参加特约采购师活动</span>
                </label>
                <input type="text" name="" v-model="partInChoose" value="不参与" readonly="readonly" />
              </div> -->
            </div>
          </div>
        </base-scroll>
        <div class="foot-div" ref="button">
          <div class="save-btn" @click="dataSubmit(1)">保存草稿</div>
          <div class="push-btn" @click="dataSubmit(0)">立即发布</div>
        </div>
        <picker ref="pickerFreight" :data='freights' @change='freightChange'></picker>
        <picker ref="pickerDateIss" :data='dataIsss' @change='dataIssChange'></picker>
        <picker ref="pickerPartIn" :data='partIns' @change='partInChange'></picker>
        <picker ref="pickerQuoMethod" :data='quoMethods' @change='quoMethodChange'></picker>
        <picker ref="pickerUnit" :data='units' @change='unitChange'></picker>
        <pop ref="pop" :title="showMess"></pop>
        <router-view
          @emitCateInfo="receiveCateInfo"
          @emitChooseBrand="receiveBrand"
          @emitCombSpec="receiveSpecComb"
          :specCombData="specComb"
          :brandList="brandList"
          :specList="specList"
          :isChooseSec="quoMethodChoose[0]==='区间报价'"
          @intervalQuoClick="receiveSectionComb"
          :postInter="sectionPriceArr"
          >
        </router-view>
        <i class="goods-guide" ref="guide" @click="viewHelp" v-show="!goodsId"></i>
      </div>
    </div>
  </transition>
</template>

<script>
import Slider from 'components/publish-goods/slider'
import Picker from 'base/confirm/confirm-picker'
import Pop from 'base/pop/pop'
import util from 'common/js/util'
import { dev } from 'common/js/dev'
import { Group, XTextarea, XInput, Swiper, SwiperItem } from 'vux'
import { loadDataPost, STATUS_OK, loadData } from 'api/common'
import { closeWebview } from 'navtive'
import { mapMutations } from 'vuex'
import { splitMoney, judgeObjectLen, createDragTouch } from 'commons'
let tempBrandList = [
  {
    categoryLevel: '店铺品牌',
    categorySymbol: '店铺品牌',
    shopBrand: 1,
    list: []
  },
  {
    categoryLevel: 'A',
    categorySymbol: 'A',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'B',
    categorySymbol: 'B',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'C',
    categorySymbol: 'C',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'D',
    categorySymbol: 'D',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'E',
    categorySymbol: 'E',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'F',
    categorySymbol: 'F',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'G',
    categorySymbol: 'G',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'H',
    categorySymbol: 'H',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'I',
    categorySymbol: 'I',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'J',
    categorySymbol: 'J',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'K',
    categorySymbol: 'K',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'L',
    categorySymbol: 'L',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'M',
    categorySymbol: 'M',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'N',
    categorySymbol: 'N',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'O',
    categorySymbol: 'O',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'P',
    categorySymbol: 'P',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Q',
    categorySymbol: 'Q',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'R',
    categorySymbol: 'R',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'S',
    categorySymbol: 'S',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'T',
    categorySymbol: 'T',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'U',
    categorySymbol: 'U',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'V',
    categorySymbol: 'V',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'W',
    categorySymbol: 'W',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'X',
    categorySymbol: 'X',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Y',
    categorySymbol: 'Y',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: 'Z',
    categorySymbol: 'Z',
    shopBrand: 0,
    list: []
  },
  {
    categoryLevel: '#',
    categorySymbol: '~',
    shopBrand: 0,
    list: []
  }
]
let brandList = JSON.parse(JSON.stringify(tempBrandList))
export default {
  data() {
    return {
      showPublishGoods: false,
      showFlag: false,
      showFlagTwo: true,
      areaText: '',
      imaList: [],
      freights: [],
      freightChoose: [''],
      dataIsss: [], // 发货日期
      dataIssChoose: [''],
      partIns: [['参与', '不参与']],
      partInChoose: ['参与'], // 默认
      // quoMethods: [['规格报价', '区间报价']],
      quoMethods: [['规格报价']],
      quoMethodChoose: ['规格报价'], // 默认
      units: [], //  单位
      unitChoose: [''],
      retailPrice: '', // 市场标价
      recommonPrice: '', // 零售限价
      buyPrice: '', // 特约采购师价
      smallNum: 1, // 最小起购量
      offerNum: '', // 供应总量
      // intervalQuo: false,
      isCan: false, // 是否参与特约卡
      isChangedBrand: false, // 是否编辑过品牌
      isStockGood: 1, // 是否现货
      showMess: '',
      cataList: '',
      sellerCode: '', // 商品编码
      goodsInfo: {}, // 编辑商品所有信息
      categoryObj: {}, // 所选类目
      specComb: [], // 规格数据
      sectionPriceArr: [], // 区间报价数据
      brandObj: {}, // 选择的品牌
      contentDes: '', // 商品描述
      specList: [], // 规格数据
      brandList: [], // 品牌数据,
      historyItem: {}, // 用来记录历史记录的
      goodsId: this.$route.params.id,
      linkCate: '/creat-goods/select-category',
      linkBrand: '/creat-goods/select-brand',
      linkSpec: '/creat-goods/select-specification-price',
      linkSec: '/creat-goods/select-interval-price'
    }
  },
  computed: {
    // 是否从商品管理列表跳转过来
    isFromShopManage () {
      return !!this.$route.query.fromShopManage
    },
    specIsShow() {
      if (this.specComb.length > 0 && this.sectionPriceArr.length < 1) { // 规格报价
        return true
      }
      return false
    },
    intervalQuo() {
      if (this.quoMethodChoose[0] === '区间报价') {
        return true
      }
      return false
    },
    isChooseSec() { // 是否选择区间报价
      if (this.quoMethodChoose[0] === '区间报价') {
        return true
      }
      return false
    },
    // 默认的无规格报价
    defaultSpecQua () {
      return this.quoMethodChoose[0] === '规格报价'
    },
    countStock() { // 供货量
      if (this.isSetSpec) {
        let num = 0
        this.specComb.forEach((item) => {
          num += Number(item.stock)
        })
        return num
      }
      return this.offerNum
    },
    isSetSection() { // 是否设置区间报价
      if (this.sectionPriceArr.length > 0) {
        return true
      }
      return false
    },
    isSetSectionText() { //
      if (this.isSetSection) {
        return '已编辑'
      }
      return ''
    },
    isSetSpec() { // 是否设置规格报价
      if (this.specComb.length > 0) {
        return true
      }
      return false
    },
    isSetSpecText() {
      if (this.isSetSpec) {
        return '已编辑'
      }
      return ''
    },
    contentText() {
      if (this.contentDes.length > 0) {
        return '已编辑'
      }
      return ''
    },
    // 是否展示商品规格选项
    isShowCombSpec () {
      return !!this.specList.length && this.defaultSpecQua
    },
    // 佣金
    commission () {
      let {init, zero} = splitMoney(this.recommonPrice - this.buyPrice)
      let res = `${init}.${zero}`
      if (parseFloat(res) > 0) {
        return res
      }
      return ''
    }
  },
  created () {
    // 判断是否是从商品管理的草稿页面跳转的还是从发布商品模块跳转的
    if (this.goodsId !== undefined) {
      this.showFlag = false
      this.showFlagTwo = true
      this.linkCate = `/edit-draft/${this.goodsId}/select-category`
      this.linkBrand = `/edit-draft/${this.goodsId}/select-brand`
      this.linkSpec = `/edit-draft/${this.goodsId}/select-specification-price`
      this.linkSec = `/edit-draft/${this.goodsId}/select-interval-price`
    } else {
      this.issueProduct()
    }
    this.initGoodsAttr().then(value => {
      let cateStr = ''
      let ids = ''
      value.data.cateArr.forEach((item) => {
        cateStr += item.name + '>>'
        ids += item.id + ','
      })
      cateStr = cateStr.substr(0, cateStr.length - 2)
      ids = ids.substr(0, ids.length - 1)
      // 商品图片
      this.imaList = value.data.productImage
      // 商品描述
      this.contentDes = String(value.data.productObject.content) === 'null' ? '' : value.data.productObject.content
      // 设置选择类目
      this.categoryObj = {id: value.data.category_id, name: cateStr}
      // 历史记录
      this.historyItem = {id: ids, name: cateStr}
      // 设置标题
      this.areaText = String(value.data.productObject.title) === 'null' ? '' : value.data.productObject.title
      // 计量单位列表
      this.doUnit(value.data.unitArr)
      // 计量单位
      this.unitChoose = String(value.data.productObject.unit) === 'null' ? [''] : [value.data.productObject.unit]
      // 运费列表
      this.doFreight(value.data.freightArr)
      // 运费
      this.freightChoose = String(value.data.productObject.freight) === 'null' ? [''] : [value.data.productObject.freight]
      // 品牌
      if (value.data.generalAttr && judgeObjectLen(value.data.generalAttr)) {
        let isRequire = ''
        let isChange = value.data.generalAttr.is_change
        this.isChangedBrand = isChange
        if (value.data.generalAttr.require === 1) {
          isRequire = 'isRequire'
        }
        this.brandList = value.data.generalAttr.attr_values.map((item) => {
          if (item.is_select === 1) {
            this.brandObj.val = item.attr_value
          }
          return {
            attrId: item.attr_id,
            id: item.id,
            val: item.attr_value,
            require: isRequire,
            custom: item.hasOwnProperty('is_custom') ? item.is_custom : 0,
            shopBrand: item.hasOwnProperty('shopBrand') ? item.shopBrand : 0,
            pinyin: item.pinyin
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
        this.brandObj.val = isChange ? '品牌已被您删除，请重选选择' : this.brandObj.val ? this.brandObj.val : ''
      }
      // 市场标价&特约采购师价&最小起批&库存
      let regPrice = /null|^0.00$|^0$/
      this.retailPrice = regPrice.test(String(value.data.productObject.price)) ? '' : value.data.productObject.price
      this.recommonPrice = regPrice.test(String(value.data.productObject.promotion_price)) ? '' : value.data.productObject.promotion_price
      this.buyPrice = regPrice.test(String(value.data.productObject.purchase_price)) ? '' : value.data.productObject.purchase_price
      this.smallNum = regPrice.test(String(value.data.productObject.minimum_quantity)) ? '' : value.data.productObject.minimum_quantity
      this.offerNum = regPrice.test(String(value.data.productObject.stock)) ? '' : value.data.productObject.stock
      // 是否现货
      this.isStockGood = value.data.productObject.is_stock_good
      // 发货时间列表
      this.doDate(value.data.dateArr)
      // 发货时间
      this.dataIssChoose = String(value.data.productObject.deliver_date) === 'null' ? [''] : [value.data.productObject.deliver_date]
      // 报价方式
      let priceType = []
      if ((value.data.specPriceArr.length > 0 && value.data.priceInterval.length < 1) || value.data.productObject.priceTerms === 0) {
        priceType.push('规格报价')
      }
      if (value.data.priceInterval.length > 0 || value.data.productObject.priceTerms === 1) {
        priceType.push('区间报价')
      }
      this.quoMethodChoose = priceType
      // 非规格商品商品编码
      this.sellerCode = String(value.data.productObject.seller_code) === 'null' ? '' : value.data.productObject.seller_code
      // 规格数据
      let specArr = []
      let keyArr = ['crux', 'sku']
      value.data.specPriceArr.forEach((item) => {
        let obj = {
          // 返回来的价格是 分 为单位
          price: item.price === null ? '0' : item.price,
          purchasePrice: item.purchase_price === null ? '0' : item.purchase_price,
          promotionPrice: item.promotion_price === null ? '0' : item.promotion_price,
          stock: item.store,
          sellerCode: item.seller_code
        }
        keyArr.forEach((key) => {
          if (item[key] && (item[key] instanceof Array !== true)) {
            obj[key] = item[key]
          }
        })
        specArr.push(obj)
      })
      this.specComb = specArr
      let getSkuObj = {
        url: 'goods/goodsSku',
        body: {
          categoryId: this.categoryObj.id
        }
      }
      loadData(getSkuObj.url, getSkuObj.body).then((res) => {
        if (res.code === STATUS_OK) {
          this.specList = res.data
        }
      })
      // 区间报价数据
      let secArr = []
      value.data.priceInterval.forEach((item) => {
        secArr.push({mqq: item.purchase_amount, price: item.price, promotionPrice: item.promotion_price, purchasePrice: item.purchase_price})
      })
      this.sectionPriceArr = secArr
      // 特约卡是否显示
      this.isCan = value.data.has_cart
      // 是否参与特约商品
      this.partInChoose = value.data.productObject.is_special === 1 ? ['参与'] : ['不参与']
      this.showPublishGoods = true
    }, () => {
      console.log('新建')
      this.showPublishGoods = true
    })
    window.returnGoodsUrl = this.returnGoodsUrl
    window.returnGoodsDetail = this.returnGoodsDetail
  },
  methods: {
    ...mapMutations({
      setModeData: 'MODEDATA',
      modifyTabNumber: 'MODIFYTABNUMBER'
    }),
    backShopManage () {
      if (this.isFromShopManage) {
        this.$push({ path: '/shop-manage', query: { fromNative: 1, h5Page: 1 } })
      } else {
        closeWebview()
      }
    },
    viewHelp () {
      this.$router.push('/creat-goods/create-goods-help')
    },
    issueProduct() {
      let URL = 'goods/quote'
      loadDataPost(URL).then((res) => {
        if (res.code === STATUS_OK) {
          if (res.data.quote === true) {
            // this.showFlag = true
          } else {
            this.showFlagTwo = true
          }
        }
      })
    },
    // 点击新建商品的时候，让上面的内容隐藏，让新建商品的内容显示；
    closeIssue() {
      this.showFlag = false
      this.showFlagTwo = true
    },
    receiveCateInfo (value) {
      this.categoryObj = value.cate
      this.historyItem = value.historyItem
      this.brandList = value.brandListData
      this.specList = value.specListData
      this.specComb = []
      this.brandObj = {}
    },
    receiveSpecComb(value) { // 接受规格报价数据
      this.specComb = value
    },
    receiveSectionComb(value) { // 接受区间报价数据
      this.sectionPriceArr = value
    },
    receiveBrand(value) { // 接受选择的品牌数据
      this.brandObj = value
    },
    async initGoodsAttr() {
      // 初始化 toto
      let URL = 'goods/initialize'
      const editUrl = 'goods/editGoods'
      if (this.goodsId === undefined) {
        loadDataPost(URL).then((res) => {
          if (res.code === STATUS_OK) {
            // 处理计量单位
            this.doUnit(res.data.dataUnit)
            // 处理发货日期
            this.doDate(res.data.data)
            // 处理运费
            this.doFreight(res.data.freight)
            // 是否参与特约卡
            this.isCan = res.data.specially
          }
        })
        return Promise.reject()
      }
      let editObj = {
        id: this.goodsId
      }
      let result
      await loadDataPost(editUrl, editObj).then((res) => {
        if (res.code === STATUS_OK) {
          result = res
        }
      })
      return result
    },
    // 原生 -- start
    goAddActive() {
      let bannerLength = 8 - this.imaList.length
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.addPhotos(bannerLength, JSON.stringify(this.imaList))
        } else if (currentDev === 'iOS') {
          let obj = {
            index: bannerLength,
            imgUrl: this.imaList
          }
          window.webkit.messageHandlers.addPhotos.postMessage(obj)
        } else {
          //
        }
      } catch (e) {
        console.warn(e)
      }
    },
    goCheckActive(index) {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.editPhotos(index, JSON.stringify(this.imaList))
        } else if (currentDev === 'iOS') {
          let obj = {
            index: index,
            imgUrl: this.imaList
          }
          window.webkit.messageHandlers.editPhotos.postMessage(obj)
        } else {
          //
        }
      } catch (e) {
        console.warn(e)
      }
    },
    returnGoodsUrl(json) {
      this.imaList = []
      this.imaList = json
    },
    goodDes() { // 商品描述
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.goodsDetail(this.contentDes)
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.goodsDetail.postMessage({
            content: this.contentDes,
            isEditeInPc: 0,
            type: 1
          })
        }
      } catch (e) {
        //
      }
    },
    returnGoodsDetail(json) {
      this.contentText = '已编辑'
      this.contentDes = json // 传接口描述内容
    },
    // 原生 --- end
    // 处理计量单位
    doUnit(dataUnit) {
      let unitArry = []
      dataUnit.map((value) => {
        unitArry.push(value.title)
      })
      this.units = [unitArry]
    },
    // 处理发货日期
    doDate(dataIss) {
      let dataIssArry = []
      dataIss.map((value) => {
        dataIssArry.push(value.title)
      })
      this.dataIsss = [dataIssArry]
    },
    // 处理运费
    doFreight(freights) {
      let freightArry = []
      freights.map((value) => {
        freightArry.push(value.title)
      })
      this.freights = [freightArry]
    },
    // changeBug () {
    //   let currentDev = dev()
    //   if (currentDev === 'iOS') {
    //     document.body.classList.add('full-body')
    //   }
    // },
    // loseBug () {
    //   let currentDev = dev()
    //   if (currentDev === 'iOS') {
    //     document.body.classList.remove('full-body')
    //   }
    // },
    goFreight() {
      this.$refs.pickerFreight.show()
    },
    freightChange(value) {
      this.freightChoose = value
    },
    goDataIss() {
      this.$refs.pickerDateIss.show()
    },
    dataIssChange(value) {
      this.dataIssChoose = value
    },
    goPartIn() {
      this.$refs.pickerPartIn.show()
    },
    partInChange(value) {
      this.partInChoose = value
    },
    goQuoMethod() {
      this.$refs.pickerQuoMethod.show()
    },
    quoMethodChange(value) {
      this.quoMethodChoose = value
    },
    goUnit() {
      this.$refs.pickerUnit.show()
    },
    unitChange(value) {
      this.unitChoose = value
    },
    showPop(title) {
      this.showMess = title
      this.$refs.pop.show()
      this.$refs.pop.hide()
      return
    },
    dataSubmit (num) {
      let ischeck
      if (num === 1) {
        // if (!this.validataFiled()) {
        //   this.showPop('草稿箱必须输入重要信息')
        //   return
        // }
        if (!this.categoryObj.name) {
          this.showPop('请选择类目信息')
          return false
        }
        ischeck = true
      } else {
        ischeck = this.checkGoodsInfo()
      }
      if (ischeck) {
        delete this.brandObj.pinyin
        let specComb = this.formatSpecComb()
        let URL = num === 1 ? 'goods/draftSave' : 'goods/save'
        let specRemoveArr = ['interval', 'price', 'purchasePrice', 'sellerCode'] // 规格报价去除属性
        let secRemoveArr = ['attr', 'price', 'purchasePrice', 'promotionPrice', 'mqq'] // 区间报价去除属性
        let baseRemoveArr = ['interval', 'attr'] // 一般去除属性
        let specAndSectionArr = ['price', 'purchasePrice', 'promotionPrice', 'mqq'] // 混合报价
        let obj = {
          // =====================公共字段 -- 开始==============================
          imagePath: this.imaList.join(),
          categoryId: this.categoryObj.id,
          categoryIds: this.historyItem.id,
          name: this.historyItem.name,
          title: this.areaText.trim(),
          priceTerms: this.quoMethodChoose[0] === '区间报价' ? 1 : 0,
          freight: this.freightChoose[0],
          deliverDate: this.dataIssChoose[0],
          content: this.contentDes,
          unit: this.unitChoose[0],
          brandName: JSON.stringify(this.brandObj),
          draft: num,
          stock: this.countStock,
          // 是否为特约商品
          special: 1,
          // 是否现货
          isStockGood: this.isStockGood,
          // =====================公共字段 -- 结束==============================
          goodsId: this.goodsId,
          // 最小起订量
          mqq: this.smallNum,
          // 市场标价
          price: this.retailPrice,
          // 零售限价
          promotionPrice: this.recommonPrice,
          // 特约采购师价
          purchasePrice: this.buyPrice,
          sellerCode: this.sellerCode,
          // 区间
          interval: JSON.stringify(this.sectionPriceArr),
          // 规格
          attr: JSON.stringify(specComb)
        }
        // 新建草稿
        if (this.goodsId === undefined) {
          delete obj.goodsId
        }
        let removeAttr = (arr) => {
          arr.forEach((value) => {
            delete obj[value]
          })
        }
        let price = ''
        if (this.specIsShow) { // 规格报价
          removeAttr(specRemoveArr)   // ---------
          price = this.specComb[this.specComb.length - 1].purchasePrice
        }
        if (!this.isSetSpec && this.quoMethodChoose[0] === '区间报价') { // 区间报价
          removeAttr(secRemoveArr)
          price = this.sectionPriceArr[this.sectionPriceArr.length - 1].purchasePrice
        }
        if (!this.isSetSpec && this.quoMethodChoose[0] !== '区间报价') { // 一般报价
          removeAttr(baseRemoveArr)
          price = this.buyPrice
        }
        if (this.isSetSpec && this.isSetSection) { // 混合报价
          removeAttr(specAndSectionArr)
          price = this.sectionPriceArr[this.sectionPriceArr.length - 1].purchasePrice
        }
        // 有规格清空单个编码
        if (this.isSetSpec) {
          this.sellerCode = ''
        }
        if (!obj.sellerCode) {
          obj.sellerCode = ''
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            let modeData = {
              image_path: this.imaList[0] === undefined ? '' : this.imaList[0],
              // price: this.retailPrice,
              intervalprice: `￥${price}`,
              stock: this.countStock,
              title: this.areaText
            }
            this.setModeData(modeData)
            // 编辑商品且发布商品的时候提供标识
            if (this.goodsId !== undefined && num === 0) {
              this.modifyTabNumber(1)
            }
            if (num === 1) {
              this.$push({ path: '/shop-manage', query: { type: 2, h5Page: 1, isEdited: 1, fromNative: 1 } })
              // this.$router.push('/shop-manage?isNewGoods=1')
            } else {
              this.$push({ path: '/shop-manage', query: { type: 0, h5Page: 1, isEdited: 1, fromNative: 1 } })
              // this.$router.push('/shop-manage')
            }
          }
          this.$vux.toast.text(res.message, 'middle')
        })
      }
    },
    // 移除 specComb 每项中 crux 和 sku 的 attr_val 以及其他属性
    formatSpecComb () {
      let arr = JSON.parse(JSON.stringify(this.specComb))
      return arr.map(item => {
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
    },
    checkGoodsInfo () {
      if (!this.areaText) {
        this.showPop('请填写商品标题')
        return false
      }
      if (!this.categoryObj.name) {
        this.showPop('请选择类目信息')
        return false
      }
      if (this.brandList.length > 0 && this.brandList[0].require === 'isRequire') {
        if (!this.brandObj.val) {
          this.showPop('请选择品牌')
          return false
        }
      }
      // if (this.quoMethodChoose[0] === '规格报价' && this.specList.length > 0) {
      //   if (this.specComb.length < 1) {
      //     this.showPop('请填写规格')
      //     return false
      //   }
      // }
      if (this.quoMethodChoose[0] === '区间报价') {
        if (this.sectionPriceArr.length < 1) {
          this.showPop('请填写区间报价')
          return false
        }
      }
      if (!this.intervalQuo && !this.isSetSpec) { // 没有选择区间报价，没有设置规格报价
        if (!this.retailPrice || !((+this.retailPrice) > 0)) {
          this.showPop('请填写大于0的市场标价')
          return false
        }
        if (util.isMoney(this.retailPrice) === false) {
          this.showPop('市场标价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!this.recommonPrice) {
          this.showPop('请填写零售限价')
          return false
        }
        if (!(Number(this.recommonPrice) < Number(this.retailPrice))) {
          this.showPop('零售限价必须小于市场标价')
          return false
        }
        if (util.isMoney(this.recommonPrice) === false) {
          this.showPop('零售限价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!this.buyPrice) {
          this.showPop('请填写特约采购师价')
          return false
        }
        if (!(Number(this.buyPrice) < Number(this.recommonPrice))) {
          this.showPop('特约采购师价必须小于零售限价')
          return false
        }
        if (util.isMoney(this.buyPrice) === false) {
          this.showPop('特约采购师价最多可输入8位数（不包括小数），可输入两位小数')
          return false
        }
        if (!this.offerNum || !(+this.offerNum > 0)) {
          this.showPop('请填写供应总量')
          return false
        }
        if (util.isMoney(this.offerNum) === false) {
          this.showPop('供应总量最多可输入9位数')
          return false
        }
      }
      if (this.isStockGood === '' || this.isStockGood === undefined) {
        this.showPop('请选择是否现货')
        return false
      }
      if (!this.intervalQuo) { // 没有选择区间报价
        if (!this.smallNum || !(+this.smallNum > 0)) {
          this.showPop('请填写大于0的起订量')
          return false
        }
        if (util.isMoney(this.smallNum) === false) {
          this.showPop('起订量最多可输入9位数')
          return false
        }
        if (!(Number(this.smallNum) <= Number(this.countStock))) {
          this.showPop('起订量要小于库存总量')
          return false
        }
      }
      if (!this.unitChoose[0]) {
        this.showPop('请选择计量单位')
        return false
      }
      if (!this.contentDes) {
        this.showPop('请选择商品描述')
        return false
      }
      // 校验无规格商品编码
      if (!this.isSetSpec && util.checkGoodsCode(this.sellerCode).is === 'N') {
        this.showPop(util.checkGoodsCode(this.sellerCode).msg)
        return false
      }
      // if (!this.freightChoose[0]) {
      //   this.showPop('请选择运费')
      //   return false
      // }
      // if (!this.dataIssChoose[0]) {
      //   this.showPop('请选择发货日期')
      //   return false
      // }
      // if (this.isCan && !this.partInChoose[0]) {
      //   this.showPop('请选择是否参与折扣卡')
      //   return false
      // }
      return true
    },
    // 保存草稿箱判断
    validataFiled () {
      let {
        areaText,
        retailPrice,
        recommonPrice,
        buyPrice,
        smallNum,
        offerNum,
        contentDes,
        sellerCode
      } = this
      if (areaText || retailPrice || recommonPrice || buyPrice || smallNum || offerNum || contentDes || sellerCode) {
        return true
      }
      return false
    },
    restoreBodyHeight () {
      window.scroll(0, 0)
    }
  },
  beforeRouteLeave (to, from, next) {
    tempBrandList = JSON.parse(JSON.stringify(brandList))
    next()
  },
  watch: {
    showPublishGoods () {
      this.$nextTick(() => {
        createDragTouch(this.$refs.guide, { edgeDis: 200 })
      })
    }
  },
  components: {
    Slider,
    Group,
    XTextarea,
    XInput,
    Picker,
    Pop,
    Swiper,
    SwiperItem
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
.swiper-wrapper,
.vux-slider,
.vux-swiper
  height 100%!important
.vux-slider
  .vux-swiper .vux-swiper-item
    display: flex
    justify-content: center
    align-items: center
    img
      display: block
      height 100%
      width 100%
.vux-indicator
  &.vux-indicator-right
    bottom: 30px
    left: 50%
    transform: translateX(-50%)
    text-align: center
  a
    float: none!important
    display: inline-block!important
    margin-left: 18px!important
    .vux-icon-dot
      background-color $color-white!important
      width 16px!important
      height 16px!important
      border-radius 50%!important
      &.active
        background $color-orange!important
</style>

<style scoped lang="stylus">
@import "~common/stylus/mixin"
@import "~common/stylus/variable"
.publish-goods-container
  height 100%
.max-height
  height 100%
  background $color-f4
  overflow hidden
  flex-col()
  .scroll-content
    flex 1
  .foot-div
    height 92px
    line-height: 92px
    flex-box-center()
    > div
      flex 1
      tc()
      color $color-white
      f18()
    .save-btn
      background #feb054
    .push-btn
      background $color-orange
.publice-goods
  width: 100%
  height: 100%
  overflow: hidden
  .create-goods-guide
    height 60px
    background #FFF2E3
    flex-s-btw()
    fz(13px)
    color $color-orange
    padding 0 30px
    > div
      flex-f-align()
      .left-icon
        width 26px
        height 28px
        margin-top 2px
        margin-right 12px
        bg('left-icon.png')
      .right-icon
        width 12px
        height 24px
        margin-left 12px
        bg('right-icon.png')
  .goods-banner-wrapper
    .swiper-container
      position relative
      overflow hidden
      height 750px
    .upload-pic
      wh(100px)
      position absolute
      left 25px
      bottom 25px
      background url('./photo.png') $color-orange no-repeat center center
      background-size 52px 42px;/*px*/
      border-radius(50%)
      z-index 10
    .no-banner
      min-height 280px
      bg('banner.png')
  .banner
    width: 100%
    height: 330px
    .add-banner
      height: 330px
      bg('banner.png')
  .publish-container
    width: 100%
    margin-top 10px
  .publish-wrapper
    background: $color-white
    padding: 0 40px 0 25px
    margin-bottom: 20px
    .publish-item
      height 100px
      bd-b($color-df)
      flex-align-item()
      f14()
      &.publish-title
        padding-top 24px
        height 160px
        align-items flex-start
        >div
          height 100%
      label
        flex-f-align()
        .item-star
          color $color-orange
          margin-right 12px
          padding-top 10px
          &.no-necessary
            width 10px
          &.special
            margin-right 8px
        .item-icon
          margin-right 12px
        .item-title
          wh(32px)
          bg('goods-title.png')
        .item-category
          wh(28px)
          margin-right 12px
          bg('category.png')
        .item-measurement
          width 34px
          height 28px
          margin-right 6px
          bg('measurement.png')
        .item-brand
          width 30px
          height 32px
          bg('brand.png')
          margin-right 10px
        .item-quotation-type
          width 26px
          height 34px
          margin-right 14px
          bg('quotation-type.png')
        .item-specification
          wh(30px)
          margin-right 10px
          bg('specification.png')
        .item-interval-price
          wh(36px)
          margin-right 4px
          bg('interval-price.png')
        .item-purchase-price
          wh(32px)
          margin-right 8px
          bg('purchase-price.png')
        .item-sale-price
          width 32px
          height 24px
          margin-right 8px
          bg('sale-price.png')
        .item-vip-price
          width 32px
          height 28px
          margin-right 8px
          bg('vip-price.png')
        .item-commission
          width 32px
          height 34px
          margin-right 8px
          bg('commission.png')
        .item-name
          color $color-6
        .item-no-necessary
          color $color-orange
      input
        flex 1
        text-align right
        padding 0 40px
        height 50%
        text-over(1)
        color $color-6
        &.text-left
          text-align left
        &.commission
          padding 0 22px
          color $color-red
      >div
        flex 1
        height 50%
    .publish-arrow
      background url('./images/arrow.png') no-repeat center right
      background-size: 16px auto;/*px*/
    .price-description
      .price-txt
        background #FFFAF5
        height 60px
        flex-center()
        fz(11px)
        color $color-c
    // .commission-desc
    //   min-height 60px
    //   background #ffefdd
    //   font-size 24px;/*px*/
    //   color $color-orange
    //   padding-left 30px
    //   margin 0 -40px 0 -25px
    //   flex-f()
    //   align-items center
    //   p
    //     line-height 40px
    //   span
    //     width 26px
    //     height 26px
    //     display inline-block
    //     vertical-align text-bottom
    //     background-image url('./i.png')
    //     background-size 100% 100%
  .choose-now-goods
    padding-left 60px
    height 84px
    font-size 28px;/*px*/
    color $color-6
    flex-box-center()
    // padding 0 40px
    .now-goods-center
      flex-between()
      margin 0 55px
      label
        display flex
        align-items center
        line-height 40px
        &:nth-child(1)
          margin-right 72px
        span
          width 36px
          height 36px
          border-radius 50%
          border 1px solid $color-c;/*no*/
          margin-right 15px
          &.active
            background url('./choiced.png') no-repeat center
            background-size 100% 100%
            border none
    .now-goods-right
      color $color-c
      font-size 22px;/*px*/
.no-border
  border none!important
.issue-box
  height: 100%
  background: $color-white
  position: fixed
  width: 100%
  left: 0
  top: 0
  right: 0
  bottom: 0
  z-index: 200
  .pic img
    width: 100%
    height: 100%
  .li-boxes
    padding: 60px 0 0 57px
    .select, .edit, .submit
      display: flex
      align-items: center
    .select i, .edit i, .submit i
      display: inline-block
      width: 55px;/*px*/
      height: 56px;/*px*/
      background: url('./one.png') no-repeat
      background-size: 100% auto
      .select span, .edit span, .submit span
        display: inline-block
        font-size: 30px;/*px*/
        margin-left: 50px
        color: #333333
        line-height: 55px
      .edit i
        background: url('./two.png') no-repeat
        background-size: 100% auto
      .submit i
        background: url('./three.png') no-repeat
        background-size: 100% auto
      .wire
        border-left: 2px solid $color-orange;/*no*/
        height: 110px;/*px*/
        margin: 10px 28px
  .issue-btn
    bottom: 0
    left: 0
    right: 0
    width: 100%
    height: 94px;/*px*/
    line-height: 94px;/*px*/
    font-size: 36px;/*px*/
    display: flex
    border-tp()
    position: fixed
    display: flex
    .add
      flex: 1
      background: $color-orange
      text-align: center
      color: $color-white
    .quote
      flex: 1
      background: $color-white
      text-align: center
      color: $color-orange
.goods-guide
  position fixed
  right 0
  top 250px
  width 112px
  height 108px
  bg('bg-guide.png')
  z-index 1000
</style>
