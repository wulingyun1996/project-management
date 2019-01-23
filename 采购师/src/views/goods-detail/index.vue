<template>
  <transition name="has-data">
    <div
      class="common-goods-detail-container iphone-x-container"
      :class="{ 'share-iponer-x': isOpenByShare, 'is-ipone': isPone }"
      v-if="isLoadGoodsDetail">
      <!--                                      导航菜单                                   -->
      <div class="goods-detail-nav"
        :style="backgroundColor"
        v-if="!outTime && !isOpenByShare">
        <div class="nav-left">
          <div class="nav-back nav-icon" :class="{active: showAuthenNav}" @click="goBack"></div>
        </div>
        <div class="nav-right">
          <div
            class="nav-menu nav-icon"
            :class="{ active: showAuthenNav, message: showUnreadMessage }"
            @click="showTopMenuTab">
          </div>
        </div>
        <!-- 导航 tab -->
        <div class="nav-menu-wrapper">
          <base-nav-list
            ref="topNav"
            :im-info="imInfo"
            :include="goodsDetailNav"
            :serviceMobile="shopDetail.service_mobile"
            @showShare="shareCurrentGoods">
          </base-nav-list>
        </div>
      </div>
      <!--                                      非限时商品                                 -->
      <div class="common-goods-container"
        v-if="!isFlashSale && !outTime">
        <base-scroll
          ref="scroll"
          message="已经到底了"
          :listenScroll='true'
          :probeType='3'
          :data="commentList"
          @scroll="scroll"
          :beforeScroll="beforeScroll"
          @beforeScroll="justifyContentHeight"
          class="goods-scroll-wrapper">
          <!-- banner模块 -->
          <div class="goods-detail-banner">
            <swiper :list='bannerList' :show-desc-mask='false' :show-dots='false' :aspect-ratio='1' v-model="currentIndex"></swiper>
            <div class="banner-progress">
              <span v-show="bannerList.length">{{ picIndex }}/{{ bannerList.length }}</span>
            </div>
          </div>
          <!-- 爆款商品icon -->
          <div class="hot-goods-wrapper" v-show="isHotGoods">
            <div class="hot-goods-left">
              <div class="hot-goods-icon"></div>
            </div>
            <div class="hot-goods-right">
              <span>精选爆款 品质保证 省的更多</span>
            </div>
          </div>
          <!-- 认证导航 -->
          <div class="goods-detail-authen" v-show="!authened && !isOpenByShare" @click="showAuthenPop">
            <div class="authen-nav">
              <div class="authen-title">
                <span class="shop-icon"></span>
                <p class="authen-description">
                  认证店铺特权得奖励，<span>自购省钱，分享赚钱</span>
                </p>
              </div>
              <div class="authen-url">
                <div class="unauthen-icon">未认证</div>
                <div class="unauthen-arrow"></div>
              </div>
            </div>
          </div>
          <!-- 已认证 - 未分享 - 价格模块 -->
          <div class="goods-price-container" v-show="authened && !isOpenByShare">
            <div class="goods-promotion-price">
              <p class="price-type">零售限价：</p>
              <div class="price-detail">
                <b class="money">￥</b><span class="price-int">{{ goodsDetail.promotion_price | getPriceInt }}</span><b class="price-zero">.{{ goodsDetail.promotion_price | getPriceZero }}</b>
                <b class="price-limit" v-show="showPriceIntervalThree">起</b>
              </div>
              <div class="commission">
                带购赚: ￥{{ goodsDetail.commission_price }}
              </div>
            </div>
            <div class="goods-purchase-price">
              <p class="price-type">特约采购师价：</p>
              <div class="price-detail">
                <b class="money">￥</b><span class="price-int">{{ goodsDetail.purchase_price | getPriceInt }}</span><b class="price-zero">.{{ goodsDetail.purchase_price | getPriceZero }}</b>
                <b class="price-limit" v-show="showPriceIntervalOne">起</b>
              </div>
              <div class="commission">
                自购省: ￥{{ goodsDetail.commission_price }}
              </div>
            </div>
          </div>
          <!-- 未认证 - 未分享 - 价格模块 -->
          <div class="unauthen-goods-price-container" v-show="!authened && !isOpenByShare">
            <div class="unauthen-tips">
              <i></i>底价仅对认证采购师可见
            </div>
            <div class="goods-price-container">
              <div class="goods-promotion-price">
                <p class="price-type">零售限价：</p>
                <div class="price-detail">
                  <span>￥</span> <b>***</b>
                </div>
                <div class="commission">
                  带购赚:￥ ***
                </div>
              </div>
              <div class="goods-purchase-price">
                <p class="price-type">特约采购师价：</p>
                <div class="price-detail">
                  <span>￥</span> <b>***</b>
                </div>
                <div class="commission">
                  自购省:￥ ***
                </div>
              </div>
            </div>
          </div>
          <!-- 分享 - 价格模块 -->
          <div class="goods-price-share-container" v-show="isOpenByShare">
            <div class="price-top">
              <div class="price-detail">
                <i v-if="isScanCode">平台价：</i>
                <i v-else>采购师价：</i>
                <b class="money">￥</b><span class="price-int">{{ goodsDetail.promotion_price | getPriceInt }}</span><b class="price-zero">.{{ goodsDetail.promotion_price | getPriceZero }}</b>
                <b class="price-limit" v-show="showPriceIntervalThree">起</b>
              </div>
              <div class="goods-attribute-container">
                <span class="new-goods" v-show="goodsDetail.isNewGoods">现货</span>
                <span class="best-goods" v-show="goodsDetail.isJoinedBestGoods">精品馆</span>
                <span class="meterial-goods" v-show="goodsDetail.isJoinedMeterialGoods">材料馆</span>
              </div>
            </div>
            <div class="price-bottom">
              <div class="price-detail">
                <i>市场标价：</i>
                <b>{{ goodsDetail.price }}</b>
              </div>
              <span class="goods-buy-limit">{{ goodsDetail.minimum_quantity }}{{ goodsDetail.unit }}起批</span>
            </div>
          </div>
          <!-- 现货/精品馆/材料馆 -->
          <div class="goods-attribute-container" v-show="!isOpenByShare">
            <span class="new-goods" v-show="goodsDetail.isNewGoods">现货</span>
            <span class="best-goods" v-show="goodsDetail.isJoinedBestGoods">精品馆</span>
            <span class="meterial-goods" v-show="goodsDetail.isJoinedMeterialGoods">材料馆</span>
            <span class="goods-buy-limit">{{ goodsDetail.minimum_quantity }}{{ goodsDetail.unit }}起批</span>
          </div>
          <!-- 商品标题 -->
          <h2 class="goods-title">{{ goodsDetail.title }}</h2>
          <!-- 浏览量以及销售量 -->
          <div class="goods-statistics-wrapper">
            <div class="sale-number">
              已售 {{ goodsDetail.buy_num }}
            </div>
            <div class="view-number">
              浏览量 {{ goodsDetail.view_num }}
            </div>
          </div>
          <!-- 自购省/带购赚导航 -->
          <div class="make-money-guide" @click="isShowMakeMoneyPopup = true" v-show="!isOpenByShare">
            <div class="make-money-explain-guide">
              <div class="explain-left">
                <i class="left-icon"></i>
                <div class="left-text">
                  <span>自购和带购分享规则不清楚</span>
                  <i class="icon-quesition"></i>
                </div>
              </div>
              <div class="explain-right">
                点这里
                <i></i>
              </div>
            </div>
          </div>
          <!-- 物流 -->
          <div class="goods-detail-logistics">
            <div class="logistics-cost">
              <span>运费：</span>
              <span>{{ goodsDetail.freight }}</span>
            </div>
            <div class="logistics-time">{{ goodsDetail.deliver_date }}发货</div>
            <div class="logistics-city">{{ shopDetail.addr.del_addr.province + shopDetail.addr.del_addr.city }}</div>
          </div>
          <!-- 分割线 -->
          <div class="separate" v-show="!(singleSpecPrice1 || singleIntervelPirce)"></div>
          <!-- 选择规格 -->
          <div class="goods-detail-specification" @click="addGoods(2)" v-if="!(singleSpecPrice1 || singleIntervelPirce)">
            <div class="specification-desc">
              <div class="specification-icon"></div>
              <h1>选择规格</h1>
            </div>
            <div class="specification-text">
              {{ specification }}
            </div>
            <i class="specification-arrow"></i>
          </div>
          <div class="separate"></div>
          <!-- 材料图书馆 -->
          <div class="meterial-goods-container" v-show="meterialGoodsList.length">
            <div class="meterial-goods-guide">
              <h2 class="meterial-description">线下实体 | 材料图书馆</h2>
              <p class="view-more" v-show="meterialGoodsList.length > 2" @click="viewAllMeterialGoods">
                查看更多<i></i>
              </p>
            </div>
            <ul class="meterial-list">
              <li
                class="meterial-item"
                v-for="meterialGoodsItem in meterialGoodsList"
                :key="meterialGoodsItem.id"
                v-show="meterialGoodsItem.show">
                <div class="item-info">
                  <div class="info">
                    <p class="meterial-name">
                      <i class="icon-house"></i>
                      {{ meterialGoodsItem.name | sliceChar(19) }}
                    </p>
                    <p class="meterial-address" @click="viewMeterialAddress(meterialGoodsItem)">
                      <i class="icon-address"></i>
                      {{ meterialGoodsItem.detailAddress }}
                    </p>
                  </div>
                  <div class="meterial-button" @click="goMeterial(meterialGoodsItem.id)">去逛逛</div>
                </div>
                <div class="separate"></div>
              </li>
            </ul>
          </div>
          <!-- 特约认证 -->
          <div class="special-authen-container" @click="showAuthenPop">
            <div class="special-authen">
              <div class="special-authen-text">
                <span class="special-authen-icon"></span>
                <span class="special-authen-desc">特约认证</span>
                <p v-show="!authened">认证店铺特权，看低价，得认证奖励</p>
                <p v-show="authened">您已认证店铺特权，享特约采购师价</p>
              </div>
              <div class="special-authen-arrow"></div>
            </div>
            <div class="separate"></div>
          </div>
          <!-- 商品参数、评价、详情 -->
          <div ref="container" class="goods-details-message">
            <div class="goods-details-header-wrapper" ref="scrollEle0">
              <div class="good-details-header">
                <div class="goods-introduce" :class="{active: scrollIndex === 0}" @click="scrollToElement(0)">商品参数</div>
                <div class="goods-comment" :class="{active: scrollIndex === 1}" @click="scrollToElement(1)">评价</div>
                <div class="goods-details-description" :class="{active: scrollIndex === 2}" @click="scrollToElement(2)">商品详情</div>
              </div>
            </div>
            <!-- 商品参数简介 -->
            <div class="goods-details-introduce" v-show="goodsDetail.goods_attr">
              <ul>
                <li class="goods-brand" v-for="(item, key, index) in goodsDetail.goods_attr" :key="index">
                  <h1>{{ key }}</h1>
                  <p>{{ item }}</p>
                </li>
              </ul>
            </div>
            <div class="goods-details-seperate" ref="scrollEle1">
              <div class="seperate-wrapper">
                <div class="seperate-left"></div>
                <div class="seperate-text">
                  <span class="comment-icon"></span>
                  <span class="comment-text">商品评价</span>
                </div>
                <div class="seperate-right"></div>
              </div>
            </div>
            <div>
              <div class="goods-details-comment-title" v-show="commentList.length">
                <div class="commnent-nums">商品评价（{{ commentTotalNums }}）</div>
                <div class="comment-more">
                  <span>查看更多评价</span>
                  <span></span>
                </div>
              </div>
              <!-- 暂无评价 -->
              <div class="goods-details-comment-title" v-show="!commentList.length">
                <div class="commnent-nums">暂无评价</div>
              </div>
            </div>
            <!-- 评论列表 -->
            <div class="goods-comment-list" v-show="commentList.length">
              <base-comment :commentList='commentList'></base-comment>
            </div>
            <!-- 分割线 -->
            <div class="separate"></div>
            <!-- 店铺导航 -->
            <div class="shop-nav">
              <div class="shop-description">
                <div class="shop-intruction">
                  <img :src="shopDetail.shop_logo_path" alt="" v-if="shopDetail.shop_logo_path">
                  <img src="./images/logo.png" alt="" v-else>
                  <span>{{ shopDetail.shop_name }}</span>
                </div>
                <div class="shop-entry" @click="goShopDetail(shopDetail.seller_id)">
                  <button>进入店铺</button>
                </div>
              </div>
              <div class="shop-message">
                <div class="shop-goods-nums">
                  <span>全部商品</span>
                  <span>{{ shopDetail.goods_cnt }}</span>
                </div>
                <div class="shop-seperate"></div>
                <div class="shop-purchaser-nums">
                  <span>采购师认证</span>
                  <span>{{ shopDetail.auth_cnt }}</span>
                </div>
              </div>
            </div>
            <div class="goods-details-seperate" ref="scrollEle2">
              <div class="seperate-wrapper">
                <div class="seperate-left"></div>
                <div class="seperate-text">
                  <span class="comment-icon detail-cion"></span>
                  <span class="comment-text">商品详情</span>
                </div>
                <div class="seperate-right"></div>
              </div>
            </div>
            <div class="goods-details-content" v-html="goodsContent">
            </div>
          </div>
        </base-scroll>
        <div class="goods-detail-footer" v-if="!outTime && !isOpenByShare">
          <div class="goods-cart" @click="goCart">
            <div class="icon-add-cart">
              <span v-show="!(!authened && !goodsDetail.cart_total)">{{ goodsDetail.cart_total }}</span>
            </div>
          </div>
          <div class="authened" v-if="authened">
            <div class="goods-buy-to-self" @click="addGoods(1)">
              <i class="icon-save-money"></i>
              <div class="saved-money">
                <p class="price-type">自购省</p>
                <p class="price">立省 ￥{{ goodsDetail.commission_price }}</p>
              </div>
            </div>
            <div class="goods-buy-to-others" @click="addGoods(2)">
              <i class="icon-make-money"></i>
              <div class="maked-money">
                <p class="price-type">带购赚</p>
                <p class="price">立赚 ￥{{ goodsDetail.commission_price }}</p>
              </div>
            </div>
          </div>
          <div class="unauthen" v-else @click="showAuthenPop">认证后可自购和分享</div>
        </div>
        <!-- 加入购物车弹窗 -->
        <base-popup-transition
          ref="popup">
          <div class="add-goods-wrapper iphone-x-bottom">
            <div class="goods-description-price padding-30">
              <div class="goods-price-description bd-b">
                <div
                  class="goods-pic"
                  :class="{
                            'hot-goods':  goodsDetail.isHot,
                            'flash-goods':  goodsDetail.isFlash
                          }">
                  <i class="hot-goods-label" v-show="goodsDetail.isHot"></i>
                  <i class="falsh-goods-label" v-show="goodsDetail.isFlash"></i>
                  <img :src="mainPic" alt="">
                </div>
                <div class="goods-main-info">
                  <h2 class="goods-name">{{ goodsDetail.title }}</h2>
                  <p>
                    ￥<span>{{ goodsDetail.promotion_price | getPriceInt }}</span><b>.{{ goodsDetail.promotion_price | getPriceZero }}</b><b class="price-limit" v-show="showPriceIntervalThree">起</b>
                  </p>
                </div>
                <i class="icon-close" @click="closePriceList"></i>
              </div>
              <div class="goods-lists">
                <!-- 无规格 -->
                <ul v-if="singleSpecPrice1">
                  <li class="goods-item bd-b">
                    <div class="goods-item-left">
                      <p class="goods-item-name">默认</p>
                      <p class="goods-item-price" v-show="!singleGoodsAttr.goods_num">¥{{ goodsDetail.promotion_price }}</p>
                      <p class="goods-item-price" v-show="singleGoodsAttr.goods_num">
                        <span>¥{{ goodsDetail.promotion_price }}/</span><b><b v-show="addGoodsType === 1">省</b><b v-show="addGoodsType === 2">赚</b><b>￥{{ savedMoney }}</b></b>
                      </p>
                    </div>
                    <div class="goods-item-right">
                      <div class="goods-item-storage">
                        <span>库存：{{ goodsDetail.orginal_stock }}</span>
                      </div>
                      <div class="goods-add-item">
                        <base-input-number
                          :min='0'
                          :max='goodsDetail.orginal_stock'
                          v-model="goodsDetail.number">
                        </base-input-number>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- 单一规格 -->
                <ul v-if="singleSpecPrice2">
                  <li class="goods-item bd-b" v-for="item in goodsDetail.price_level.spec_price" :key="item.info.id">
                    <div class="goods-item-left">
                      <p class="goods-item-name">{{ item.specval }}</p>
                      <!-- 未选择商品数量 -->
                      <p class="goods-item-price" v-show="!item.info.number">¥{{ item.info.promotion_price }}</p>
                      <!-- 选择商品数量 -->
                      <p class="goods-item-price" v-show="item.info.number">
                        <span>¥{{ item.info.promotion_price }}/</span><b><b v-show="addGoodsType === 1">省</b><b v-show="addGoodsType === 2">赚</b><b>￥{{ item.info | getSingleSpecGoodsSavedMoney }}</b></b>
                      </p>
                    </div>
                    <div class="goods-item-right">
                      <div class="goods-item-storage">
                        <span>库存：{{ item.info.store }}</span>
                      </div>
                      <div class="goods-add-item">
                        <base-input-number
                          :min='0'
                          :max='item.info.store'
                          v-model="item.info.number">
                        </base-input-number>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- 多规格 -->
                <div v-if="multipSpecPrice" class="multipart-goods">
                  <div class="goods-item-tabs">
                    <tab
                      :line-width=2
                      active-color='#ff8a00'
                      custom-bar-width="40px"
                      v-model="specificationIndex">
                      <tab-item
                        v-for="(item, index) in multipartSpec"
                        :key="index"
                        class="vux-center">
                        {{ item }}
                      </tab-item>
                    </tab>
                  </div>
                  <swiper
                    class="goods-item-swiper"
                    :show-dots="false"
                    v-model="specificationIndex">
                    <swiper-item v-for="(item, index) in goodsDetail.price_level.assembleList" :key="index">
                      <div class="tab-swiper vux-center">
                        <div class="goods-item bd-b" v-for="goodsItem in item" :key="goodsItem.info.id">
                          <div class="goods-item-left">
                            <p class="goods-item-name">{{ goodsItem.specval }}</p>
                            <p class="goods-item-price" v-show="!goodsItem.info.number">¥{{ goodsItem.info.promotion_price }}</p>
                            <p class="goods-item-price" v-show="goodsItem.info.number">
                              <span>¥{{ goodsItem.info.promotion_price }}/</span><b><b v-show="addGoodsType === 1">省</b><b v-show="addGoodsType === 2">赚</b><b>￥{{ goodsItem.info | getSingleSpecGoodsSavedMoney }}</b></b>
                            </p>
                          </div>
                          <div class="goods-item-right">
                            <div class="goods-item-storage">
                              <span>库存：{{ goodsItem.info.store }}</span>
                            </div>
                            <div class="goods-add-item">
                              <base-input-number
                                :min='0'
                                :max='goodsItem.info.store'
                                v-model="goodsItem.info.number">
                              </base-input-number>
                            </div>
                          </div>
                        </div>
                      </div>
                    </swiper-item>
                  </swiper>
                </div>
                <!-- 单一规格区间 -->
                <ul v-if="singleIntervelPirce">
                  <li class="goods-item bd-b">
                    <div class="goods-item-left">
                      <h2 class="goods-item-name">默认</h2>
                      <h2 class="goods-item-price">¥{{ goodsDetail.max_price }}</h2>
                    </div>
                    <div class="goods-item-right">
                      <div class="goods-item-storage">
                        <span>库存：{{ goodsDetail.orginal_stock }}</span>
                      </div>
                      <div class="goods-add-item">
                        <base-input-number
                          :min='0'
                          :max='goodsDetail.orginal_stock'
                          v-model="goodsDetail.number">
                        </base-input-number>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- 多规格区间 -->
                <ul v-if="multipIntervelPirce">
                  <li class="goods-item bd-b" v-for="item in goodsDetail.price_level.spec_price" :key="item.info.id">
                    <div class="goods-item-left">
                      <h2 class="goods-item-name">{{ item.specval }}</h2>
                      <h2 class="goods-item-price">¥{{ goodsDetail.max_price }}</h2>
                    </div>
                    <div class="goods-item-right">
                      <div class="goods-item-storage">
                        <span>库存：{{ item.info.store }}</span>
                      </div>
                      <div class="goods-add-item">
                        <base-input-number
                          :min='0'
                          :max='item.info.store'
                          v-model="item.info.number">
                        </base-input-number>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 自购省 -->
            <div class="goods-total-price" v-show="addGoodsType === 1">
              <div class="goods-price padding-30" v-show="singleGoodsAttr.goods_num || multiGoodsNum">
                <p class="total-price">
                  共<span>{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsAttr.goods_num) || multiGoodsNum }}</span>个
                  <span>￥{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsPirce) || multipGoodsPrice }}</span>
                </p>
                <p class="total-commission">
                  <span>自购省：</span>
                  <span>￥{{ savedMoney }}</span>
                </p>
              </div>
              <div class="button-saved-money">
                <button class="button-add-cart" @click="addGoodsToCart">
                  <i class="icon-add-cart"></i>
                  <b>加入购物车</b>
                </button>
                <button class="button-buy" @click="goBuyGoods">
                  <i class="icon-buy"></i>
                  <b>立即购买</b>
                </button>
              </div>
            </div>
            <!-- 带购赚 -->
            <div class="goods-total-price" v-show="addGoodsType === 2">
              <div class="goods-price padding-30" v-show="singleGoodsAttr.goods_num || multiGoodsNum">
                <p class="total-price">
                  共<span>{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsAttr.goods_num) || multiGoodsNum }}</span>个
                  <span>￥{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsPirce) || multipGoodsPrice }}</span>
                </p>
                <p class="total-commission">
                  <span>带购分享赚：</span>
                  <span>￥{{ savedMoney }}</span>
                </p>
              </div>
              <div class="button-wrapper">
                <div class="button-make-money">
                  <button class="button-add-cart" @click="showAddGoodsToQuotationPopup">
                    <i class="icon-quotation"></i>
                    <b>加入报价单</b>
                  </button>
                  <button class="button-buy" @click="shareCurrentGoods">
                    <i class="icon-make-money"></i>
                    <b>带购赚钱</b>
                  </button>
                </div>
                <div class="add-quotation-wrapper" v-show="isShowAddToQuotation">
                  <div class="quotation-mask" @click="hideAddGoodsToQuotationPopup"></div>
                  <div class="quotation-wrapper">
                    <div class="quotation-guide" @click="goQuotationList">
                      <p>
                        报价单管理
                        <i class="double-arrow"></i>
                      </p>
                      <i class="icon-close" @click.stop="hideAddGoodsToQuotationPopup"></i>
                    </div>
                    <div class="quotation">
                      <ul class="quotation-list">
                        <li
                          class="quotation-item"
                          v-for="quotationItem in goodsQuotationList"
                          :key="quotationItem.id"
                          @click="addGoodsToQuotation(quotationItem)">{{ quotationItem.offer_name }}</li>
                      </ul>
                      <div class="create-quotation" @click="createNewQuotation">
                        <i></i>
                        新建报价单
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </base-popup-transition>
      </div>
      <!--                                      限时商品                                   -->
      <div class="flash-goods-container"
        v-if="isFlashSale && !outTime">
        <base-scroll
          ref="scroll"
          message="已经到底了"
          :listenScroll='true'
          :probeType='3'
          :data="commentList"
          @scroll="scroll"
          :beforeScroll="beforeScroll"
          @beforeScroll="justifyContentHeight"
          class="goods-scroll-wrapper">
          <!-- banner模块 -->
          <div class="goods-detail-banner">
            <swiper :list='bannerList' :show-desc-mask='false' :show-dots='false' :aspect-ratio='1' v-model="currentIndex"></swiper>
            <div class="banner-progress">
              <span v-show="bannerList.length">{{ picIndex }}/{{ bannerList.length }}</span>
            </div>
          </div>
          <!-- 限时抢购导航 -->
          <div class="goods-flash-sale">
            <div class="flash-sale-price">
              <div class="flash-sale-icon"></div>
              <div class="flash-sale-seperate"></div>
              <div class="flash-sale-main-price">
                ￥<span>{{ goodsDetail.sell_price | getPriceInt }}</span>.{{ goodsDetail.sell_price | getPriceZero }}
              </div>
              <div class="flash-sale-description">
                <span>{{ flashEndTime.name }}</span>
                <del>¥{{ goodsDetail.max_price }}</del>
              </div>
            </div>
            <div class="flash-sale-time">
              <h1>距结束</h1>
              <div>
                <span class="hours">{{ countTime.hours }}</span>
                <i>:</i>
                <span class="minutes">{{ countTime.minutes }}</span>
                <i>:</i>
                <span class="seconds">{{ countTime.seconds }}</span>
              </div>
            </div>
          </div>
          <!-- 现货/精品馆/材料馆 -->
          <div class="goods-attribute-container">
            <span class="new-goods" v-show="goodsDetail.isNewGoods">现货</span>
            <span class="best-goods" v-show="goodsDetail.isJoinedBestGoods">精品馆</span>
            <span class="meterial-goods" v-show="goodsDetail.isJoinedMeterialGoods">材料馆</span>
            <span class="goods-buy-limit">限购{{ flashSaleMaxNumber }}{{ goodsDetail.unit }}</span>
          </div>
          <!-- 商品标题 -->
          <h2 class="goods-title">{{ goodsDetail.title }}</h2>
          <!-- 浏览量以及销售量 -->
          <div class="goods-statistics-wrapper bd-b">
            <div class="sale-number">
              已售 {{ goodsDetail.buy_num }}
            </div>
            <div class="view-number">
              浏览量 {{ goodsDetail.view_num }}
            </div>
          </div>
          <!-- 物流 -->
          <div class="goods-detail-logistics">
            <div class="logistics-cost">
              <span>运费：</span>
              <span>{{ goodsDetail.freight }}</span>
            </div>
            <div class="logistics-time">{{ goodsDetail.deliver_date }}发货</div>
            <div class="logistics-city">{{ shopDetail.addr.del_addr.province + shopDetail.addr.del_addr.city }}</div>
          </div>
          <!-- 分割线 -->
          <div class="separate"></div>
          <!-- 选择规格 -->
          <div class="goods-detail-specification" @click="addGoods(2)" v-show="isSingleFlashSaleGoods">
            <div class="specification-desc">
              <div class="specification-icon"></div>
              <h1>选择规格</h1>
            </div>
            <div class="specification-text">
              {{ singleFlashSaleSpecfication }}
            </div>
            <i class="specification-arrow"></i>
          </div>
          <!-- 分割线 -->
          <div class="separate" v-show="isSingleFlashSaleGoods"></div>
          <!-- 材料图书馆 -->
          <div class="meterial-goods-container" v-show="meterialGoodsList.length">
            <div class="meterial-goods-guide">
              <h2 class="meterial-description">线下实体 | 材料图书馆</h2>
              <p class="view-more" v-show="meterialGoodsList.length > 2" @click="viewAllMeterialGoods">
                查看更多<i></i>
              </p>
            </div>
            <ul class="meterial-list">
              <li
                class="meterial-item"
                v-for="meterialGoodsItem in meterialGoodsList"
                :key="meterialGoodsItem.id"
                v-show="meterialGoodsItem.show">
                <div class="item-info">
                  <div class="info">
                    <p class="meterial-name">
                      <i class="icon-house"></i>
                      {{ meterialGoodsItem.name | sliceChar(19) }}
                    </p>
                    <p class="meterial-address" @click="viewMeterialAddress(meterialGoodsItem)">
                      <i class="icon-address"></i>
                      {{ meterialGoodsItem.detailAddress }}
                    </p>
                  </div>
                  <div class="meterial-button" @click="goMeterial(meterialGoodsItem.id)">去逛逛</div>
                </div>
                <div class="separate"></div>
              </li>
            </ul>
          </div>
          <!-- 商品参数、评价、详情 -->
          <div ref="container" class="goods-details-message">
            <div class="goods-details-header-wrapper" ref="scrollEle0">
              <div class="good-details-header">
                <div class="goods-introduce" :class="{active: scrollIndex === 0}" @click="scrollToElement(0)">商品参数</div>
                <div class="goods-comment" :class="{active: scrollIndex === 1}" @click="scrollToElement(1)">评价</div>
                <div class="goods-details-description" :class="{active: scrollIndex === 2}" @click="scrollToElement(2)">商品详情</div>
              </div>
            </div>
            <!-- 商品参数简介 -->
            <div class="goods-details-introduce" v-show="goodsDetail.goods_attr">
              <ul>
                <li class="goods-brand" v-for="(item, key, index) in goodsDetail.goods_attr" :key="index">
                  <h1>{{ key }}</h1>
                  <p>{{ item }}</p>
                </li>
              </ul>
            </div>
            <div class="goods-details-seperate" ref="scrollEle1">
              <div class="seperate-wrapper">
                <div class="seperate-left"></div>
                <div class="seperate-text">
                  <span class="comment-icon"></span>
                  <span class="comment-text">商品评价</span>
                </div>
                <div class="seperate-right"></div>
              </div>
            </div>
            <div>
              <div class="goods-details-comment-title" v-show="commentList.length">
                <div class="commnent-nums">商品评价（299）</div>
                <div class="comment-more">
                  <span>查看更多评价</span>
                  <span></span>
                </div>
              </div>
              <!-- 暂无评价 -->
              <div class="goods-details-comment-title" v-show="!commentList.length">
                <div class="commnent-nums">暂无评价</div>
              </div>
            </div>
            <!-- 评论列表 -->
            <div class="goods-comment-list" v-show="commentList.length">
              <base-comment :commentList='commentList'></base-comment>
            </div>
            <!-- 分割线 -->
            <div class="separate"></div>
            <!-- 店铺导航 -->
            <div class="shop-nav">
              <div class="shop-description">
                <div class="shop-intruction">
                  <img :src="shopDetail.shop_logo_path" alt="" v-if="shopDetail.shop_logo_path">
                  <img src="./images/logo.png" alt="" v-else>
                  <span>{{ shopDetail.shop_name }}</span>
                </div>
                <div class="shop-entry" @click="goShopDetail(shopDetail.seller_id)">
                  <button>进入店铺</button>
                </div>
              </div>
              <div class="shop-message">
                <div class="shop-goods-nums">
                  <span>全部商品</span>
                  <span>{{ shopDetail.goods_cnt }}</span>
                </div>
                <div class="shop-seperate"></div>
                <div class="shop-purchaser-nums">
                  <span>采购师认证</span>
                  <span>{{ shopDetail.auth_cnt }}</span>
                </div>
              </div>
            </div>
            <div class="goods-details-seperate" ref="scrollEle2">
              <div class="seperate-wrapper">
                <div class="seperate-left"></div>
                <div class="seperate-text">
                  <span class="comment-icon detail-cion"></span>
                  <span class="comment-text">商品详情</span>
                </div>
                <div class="seperate-right"></div>
              </div>
            </div>
            <div class="goods-details-content" v-html="goodsContent">
            </div>
          </div>
        </base-scroll>
        <div class="goods-detail-footer" v-if="!isOpenByShare">
          <div class="goods-cart" @click="goCart">
            <div class="icon-add-cart">
              <span v-show="!(!authened && !goodsDetail.cart_total)">{{ goodsDetail.cart_total }}</span>
            </div>
          </div>
          <div class="authened">
            <div class="goods-buy-to-self" @click="addGoods(1)">
              <i class="icon-save-money"></i>
              <div class="saved-money">
                <p class="price-type">自购省</p>
                <p class="price">立省 ￥{{ goodsDetail.cutdown_price }}</p>
              </div>
            </div>
            <div class="goods-buy-to-others" @click="addGoods(2)">
              <i class="icon-make-money"></i>
              <div class="maked-money">
                <p class="price-type">带购赚</p>
                <p class="price">立赚 ￥0.00</p>
              </div>
            </div>
          </div>
        </div>
        <base-popup-transition
          v-if="!isOpenByShare"
          ref="popup">
          <div class="add-goods-wrapper iphone-x-bottom">
            <div class="goods-description-price padding-30">
              <div class="goods-price-description bd-b">
                <div class="goods-pic flash-goods">
                  <i class="falsh-goods-label"></i>
                  <img :src="mainPic" alt="">
                </div>
                <div class="goods-main-info">
                  <h2 class="goods-name">{{ goodsDetail.title }}</h2>
                  <p>
                    ￥<span>{{ goodsDetail.sell_price | getPriceInt }}</span><b>.{{ goodsDetail.sell_price | getPriceZero }}</b>
                  </p>
                </div>
                <i class="icon-close" @click="closePriceList"></i>
              </div>
              <div class="goods-lists">
                <ul>
                  <li class="goods-item bd-b">
                    <div class="goods-item-left">
                      <p class="goods-item-name">{{ singleFlashSaleSpecfication }}</p>
                      <div v-show="addGoodsType === 1">
                        <p class="goods-item-price" v-show="!goodsDetail.number">¥{{ goodsDetail.promotion_price }}</p>
                        <p class="goods-item-price" v-show="goodsDetail.number">
                          <span>¥{{ goodsDetail.promotion_price }}/</span><b>省<b>￥{{ flashSaleSavedMon }}</b></b>
                        </p>
                      </div>
                      <div v-show="addGoodsType === 2">
                        <p class="goods-item-price delete" v-show="!goodsDetail.number">¥{{ goodsDetail.promotion_price }}</p>
                        <p class="goods-item-price" v-show="goodsDetail.number">
                          <span class="delete">¥{{ goodsDetail.promotion_price }}/</span><b>赚<b>￥0.00</b></b>
                        </p>
                      </div>
                    </div>
                    <div class="goods-item-right">
                      <div class="goods-item-storage">
                        <span>库存：{{ goodsDetail.sell_stock }}</span>
                      </div>
                      <div class="goods-add-item">
                        <base-input-number
                          :min='0'
                          :max='flashSaleMaxNumber'
                          v-model="goodsDetail.number">
                        </base-input-number>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 自购省 -->
            <div class="goods-total-price" v-show="addGoodsType === 1">
              <div class="goods-price padding-30" v-show="goodsDetail.number">
                <p class="total-price">
                  共<span>{{ goodsDetail.number }}</span>个
                  <span>￥{{ singleGoodsPirce }}</span>
                  <span>(限购{{ flashSaleMaxNumber }}{{ goodsDetail.unit }})</span>
                </p>
                <p class="total-commission">
                  <span>自购省：</span>
                  <span>￥{{ flashSaleSavedMon }}</span>
                </p>
              </div>
              <div class="button-saved-money">
                <button class="button-add-cart" @click="addGoodsToCart">
                  <i class="icon-add-cart"></i>
                  <b>加入购物车</b>
                </button>
                <button class="button-buy" @click="goBuyGoods">
                  <i class="icon-buy"></i>
                  <b>立即购买</b>
                </button>
              </div>
            </div>
            <!-- 带购赚 -->
            <div class="goods-total-price" v-show="addGoodsType === 2">
              <div class="goods-price padding-30" v-show="goodsDetail.number">
                <p class="total-price">
                  共<span>{{ goodsDetail.number }}</span>个
                  <span>￥{{ singleGoodsPirce }}</span>
                  <span>(限购{{ flashSaleMaxNumber }}{{ goodsDetail.unit }})</span>
                </p>
                <p class="total-commission">
                  <span>带购分享赚：</span>
                  <span>￥0.00</span>
                </p>
              </div>
              <div class="button-wrapper">
                <div class="button-make-money">
                  <button class="button-add-cart" @click="showAddGoodsToQuotationPopup">
                    <i class="icon-quotation"></i>
                    <b>加入报价单</b>
                  </button>
                  <button class="button-buy" @click="shareCurrentGoods">
                    <i class="icon-make-money"></i>
                    <b>带购赚钱</b>
                  </button>
                </div>
                <div class="add-quotation-wrapper" v-show="isShowAddToQuotation">
                  <div class="quotation-mask" @click="hideAddGoodsToQuotationPopup"></div>
                  <div class="quotation-wrapper">
                    <div class="quotation-guide" @click="goQuotationList">
                      <p>
                        报价单管理
                        <i class="double-arrow"></i>
                      </p>
                      <i class="icon-close" @click.stop="hideAddGoodsToQuotationPopup"></i>
                    </div>
                    <div class="quotation">
                      <ul class="quotation-list">
                        <li
                          class="quotation-item"
                          v-for="quotationItem in goodsQuotationList"
                          :key="quotationItem.id"
                          @click="addGoodsToQuotation(quotationItem)">{{ quotationItem.offer_name }}</li>
                      </ul>
                      <div class="create-quotation" @click="createNewQuotation">
                        <i></i>
                        新建报价单
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </base-popup-transition>
      </div>
      <!--                                      公共模块                                   -->
      <!--                                      特约认证弹窗                               -->
      <base-popup-authen
        ref="authen"
        @goAuthen='goAuthen'
        :authenInfo='(authenInfo && authenInfo.audit_status) || 0'
        v-if="!outTime">
      </base-popup-authen>
      <!--                                      过期页面                                   -->
      <div class="out-time-container"
        v-show="outTime">
        <div class="out-time-back">
          <span class="out-time-arrow" @click="goBack"></span>
          <i class="out-time-title">商品详情</i>
        </div>
        <img src="./images/out-time.png" alt="">
        <h2>商品已过期不存在</h2>
      </div>
      <!--                                      已下架页面                                 -->
      <div class="invoked-goods-wrapper ipone-x-absolute-bottom"
        v-show="!outTime && isInvoked">
        <p>商品已下架</p>
      </div>
      <!--                                限时商品购买完，但是存在暂未付款的弹窗              -->
      <div class="invoked-goods-wrapper active ipone-x-absolute-bottom"
        v-show="!outTime && isNoPay">
        <p>有人已拍下，若30分钟后仍未付款，您将有购买机会</p>
      </div>
      <!--                                      商品分享弹窗                               -->
      <base-goods-share
        ref="goodsShare"
        :is-scan-code="isScanCode"
        :commission="shareCommission"
        :goods-picture="mainPic"
        :shop-name="shopDetail.shop_name"
        :goods-detail="goodsDetail">
      </base-goods-share>
      <!--                                  自购省和带购赚说明弹窗                           -->
      <div
        class="make-money-explain"
        v-show="isShowMakeMoneyPopup"
        @click="isShowMakeMoneyPopup = false">
        <img src="./images/img-make-money.png" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
import BaseNavList from 'components/nav-list'
import BaseComment from 'components/comment'
import BaseInputNumber from 'components/input/input-number'
import BasePopupTransition from 'components/popup/popup-transition'
import BasePopupAuthen from 'components/popup/popup-authen'
import BaseGoodsShare from 'components/share/goods-share'
import { navMixins, wxMixins } from 'mixins'
import { mapState } from 'vuex'
import { splitMoney, toRawType, toJson, cloneDeep, setItem, getItem, sliceChar, retainTwoDecimal, countDown, smallPic, inArray } from 'common'
import { invokeNativeMethod, closeWebview } from 'native'
import { Swiper, SwiperItem, Tab, TabItem } from 'vux'
export default {
  mixins: [navMixins, wxMixins],
  data () {
    return {
      isLoadGoodsDetail: false,
      goodsDetailNav: ['home', 'message', 'lineQuery', 'concat', 'share'],
      bannerList: [],
      commentList: [],
      commentTotalNums: 0,
      goodsDetail: {},
      // 商品类型 0：常规  1：限时抢购  2：爆款商品
      goodsCategory: 0,
      // 商品价格分类 0：无规格 1：规格  2：区间
      goodsPriceType: 0,
      hotEndTime: {},
      flashEndTime: {},
      shopDetail: {},
      authenInfo: {},
      specialCard: {},
      // 商品主图
      mainPic: '',
      // 商品详情
      goodsContent: '',
      // 规格内容
      specification: '',
      // 多规格报价统计
      multipartSpec: [],
      // 限时抢购购买总和统计
      flashSaleTotalNum: 0,
      // 规格索引
      specificationIndex: 0,
      isShowTopMenuTab: false,
      isShowBottomMenuTab: false,
      showAuthenNav: false,
      startTime: 0,
      timerId: null,
      countTime: {},
      outTime: false,
      opacity: 0,
      currentIndex: 0,
      currentItem: -1,
      number: 0,
      goodsStock: 0,
      scrollIndex: 0,
      beforeScroll: true,
      // im聊天名字
      imInfo: {},
      // 自购省/带购赚弹窗
      isShowMakeMoneyPopup: false,
      // 材料馆
      meterialGoodsList: [],
      // 添加商品的弹窗，1 -> 自购省; 2 -> 带购赚
      addGoodsType: 1,
      // 添加到报价单弹窗
      isShowAddToQuotation: false,
      // 报价单列表
      goodsQuotationList: [],
      // 购物车是否包含该商品，如果有，则购物车数量不增加，反之 +1
      currentGoodsInCart: false
    }
  },
  computed: {
    /* eslint-disable */
    ...mapState(['showUnreadMessage']),
    picIndex () {
      return this.currentIndex + 1
    },
    goodsId () {
      // 无规格 2642
      // 单一规格 2643
      // 多规格 2586
      // 限时 2533
      return this.$route.query.goodsId
    },
    // 是否是通过分享页面打开
    isOpenByShare () {
      return !!this.$route.query.isShare
    },
    // 是否是通过扫码打开材料馆列表进来的
    isScanCode () {
      return !!this.$route.query.isScanCode
    },
    shareId () {
      return this.$route.query.shareId
    },
    // 是否是原生跳转过来的
    isNative () {
      return this.$route.query.isNative
    },
    // // 是否是爆款商品轮播图跳过来的
    // bannerListUrl () {
    //   return this.$route.query.bannerListUrl
    // },
    // 是否现货
    isStockGoods () {
      return this.goodsDetail.is_stock_good
    },
    // 是否配置认证，默认配置
    isSpecialCard () {
      return !!this.shopDetail.is_special
    },
    // 是否设置为特约认证商品，默认为特约认证商品
    isSpecialGoods () {
      return !!this.goodsDetail.is_special
    },
    // 已认证
    authened () {
      const { authenInfo } = this
      if (authenInfo && authenInfo.audit_status === 2) {
        return true
      }
      return false
    },
    // 是否展示 svip 价以及以 svip 价进行计算
    showSvipPrice () {
      const { isSpecialCard, isSpecialGoods, authened } = this
      return isSpecialCard && isSpecialGoods && authened
    },
    // 未认证
    unAuthen () {
      const { authenInfo } = this
      const regNumber = /[03]/
      return authenInfo && regNumber.test(authenInfo.audit_status)
    },
    // 是否下架
    isInvoked () {
      const { sale, is_delete } = this.goodsDetail
      return sale === '已下架' || is_delete === 3
    },
    // 是否商品已被人购买完，但是有未付款的情况
    isNoPay () {
      const { isFlashSale, goodsDetail } = this
      return isFlashSale && goodsDetail.sell_has_nopay === 1
    },
    // 是否是爆款商品
    isHotGoods () {
      return this.goodsCategory === 2
      // return judgeObjectLen(this.hotEndTime) !== 0
    },
    // 是否是限时抢购商品
    isFlashSale () {
      return this.goodsCategory === 1
      // return judgeObjectLen(this.flashEndTime) !== 0
    },
    // 是否是普通商品
    isCommonGoods () {
      return this.goodsCategory === 0
      // const { isHotGoods, isFlashSale } = this
      // return !isHotGoods && !isFlashSale
    },
    // 区间报价
    intervalPrice () {
      const { isFlashSale, goodsPriceType } = this
      return !isFlashSale && goodsPriceType === 2
    },
    // 无规格报价
    singleSpecPrice1 () {
      const { isFlashSale, intervalPrice, isArray, goodsDetail } = this
      return !isFlashSale && !intervalPrice && isArray && !goodsDetail.is_var_spec
    },
    // 单一规格报价
    singleSpecPrice2 () {
      const { isFlashSale, intervalPrice, isArray, goodsDetail } = this
      return !isFlashSale && !intervalPrice && !isArray && !goodsDetail.is_var_spec
    },
    // 多规格报价
    multipSpecPrice () {
      // 限时抢购当前默认无多规格，但是不排除运营后台误操作，导致在多规格限时抢购商品详情的时候该判断成立，在加入购物车的时候出现问题
      const { isFlashSale, intervalPrice, isArray, goodsDetail } = this
      return !isFlashSale && !intervalPrice && !isArray && goodsDetail.is_var_spec
    },
    // 单一规格区间报价
    singleIntervelPirce () {
      const { intervalPrice, isArray, goodsDetail } = this
      return intervalPrice && !isArray && !goodsDetail.is_var_spec
    },
    // 多规格区间报价
    multipIntervelPirce () {
      const { intervalPrice, isArray, goodsDetail } = this
      return intervalPrice && !isArray && goodsDetail.is_var_spec
    },
    // 特约采购师 - 是否设置报价的 起 字
    showPriceIntervalOne () {
      const { max_purchase_price, purchase_price } = this.goodsDetail
      return parseFloat(max_purchase_price) > parseFloat(purchase_price)
    },
    // svip - 是否设置报价的 起 字
    showPriceIntervalTwo () {
      const { svip_max_purchase_price, svip_purchase_price } = this.goodsDetail
      return parseFloat(svip_max_purchase_price) > parseFloat(svip_purchase_price)
    },
    // 分享 - 设置报价的 起 字
    showPriceIntervalThree () {
      const { max_promotion_price, promotion_price } = this.goodsDetail
      return parseFloat(max_promotion_price) > parseFloat(promotion_price)
    },
    // 是否是数组
    isArray () {
      return toRawType(this.goodsDetail.price_level) === 'Array'
    },
    // 派生区间报价的数量区间
    numsInterval () {
      const { intervalPrice, goodsDetail } = this
      if (intervalPrice) {
        return goodsDetail.price_level.int_price.map(item => {
          return item.info.purchase_amount
        })
      }
      return null
    },
    // 派生区间报价的数量与价格对应的区间
    priceInterval () {
      const { numsInterval, goodsDetail } = this
      if (numsInterval) {
        let obj = {}
        goodsDetail.price_level.int_price.forEach((item, index) => {
          obj[this.numsInterval[index]] = item.info
        })
        return obj
      }
      return null
    },
    // 单一规格商品以及单一区间数量统计
    singleGoodsAttr () {
      const { isSingleFlashSaleGoods, goodsDetail } = this
      const { id, number, title, seller_id, spec_key, sell_spec_level } = goodsDetail
      const obj = {
        goods_id: id,
        goods_num: number,
        goods_name: title,
        seller_id
      }
      // 如果是限时抢购单一规格的商品，预取第一个商品的 spec_key
      if (isSingleFlashSaleGoods) {
        obj.spec_key = sell_spec_level.spec_price[0].info.spec_key
      } else {
        obj.spec_key = spec_key || ''
      }
      return obj
    },
    // 单一规格以及单一区间价格统计
    singleGoodsPirce () {
      const { singleIntervelPirce, singleSpecPrice1, isFlashSale, goodsDetail } = this
      const { promotion_price, sell_price, number } = goodsDetail
      // 单一区间报价价格统计
      if (singleIntervelPirce) {
        // 还需要判断 center max 是否有值
        let [min, center, max] = this.numsInterval
        let priceInterval = this.priceInterval
        let number = this.singleGoodsAttr.goods_num
        // 认证 svip 价
        if (this.showSvipPrice) {
          if (number < center || !center) {
            return retainTwoDecimal(priceInterval[min].svip_purchase_price * number)
          }
          if (number >= center && (number < max || !max)) {
            return retainTwoDecimal(priceInterval[center].svip_purchase_price * number)
          }
          return retainTwoDecimal(priceInterval[max].svip_purchase_price * number)
        }
        // 未认证 采购价
        if (number < center || !center) {
          return retainTwoDecimal(priceInterval[min].purchase_price * number)
        }
        if (number >= center && (number < max || !max)) {
          return retainTwoDecimal(priceInterval[center].purchase_price * number)
        }
        return retainTwoDecimal(priceInterval[max].purchase_price * number)
      }
      // 无规格报价价格统计
      if (singleSpecPrice1) {
        return retainTwoDecimal(promotion_price * number)
      }
      if (isFlashSale) {
        return retainTwoDecimal(sell_price * number)
      }
      return 0
    },
    // 多规格以及多区间报价
    multiGoodsAttr () {
      const { goodsDetail } = this
      let { price_level } = goodsDetail
      if (price_level && price_level.spec_price) {
        let arr = price_level.spec_price.map(item => {
          if (item.info.number !== 0) {
            return item.info
          }
        })
        return arr.filter(item => {
          return item
        })
      }
      return []
    },
    // 添加的多规格以及多区间报价商品总数
    multiGoodsNum () {
      const { multiGoodsAttr } = this
      if (multiGoodsAttr.length) {
        let total = 0
        multiGoodsAttr.forEach(item => {
          total += item.number
        })
        return total
      }
      return 0
    },
    // 多规格以及多区间价格统计
    multipGoodsPrice () {
      const { multipIntervelPirce, singleSpecPrice2, multipSpecPrice, multiGoodsAttr } = this
      let total = 0
      // 多区间价格统计
      if (multipIntervelPirce) {
        let [min, center, max] = this.numsInterval
        let priceInterval = this.priceInterval
        // 认证 svip 价
        if (this.showSvipPrice) {
          multiGoodsAttr.forEach(item => {
            if (item.number < center || !center) {
              total += priceInterval[min].svip_purchase_price * item.number
            } else if (item.number >= center && (item.number < max || !max)) {
              total += priceInterval[center].svip_purchase_price * item.number
            } else {
              total += priceInterval[max].svip_purchase_price * item.number
            }
          })
          return retainTwoDecimal(total)
        }
        // 未认证 采购价
        multiGoodsAttr.forEach(item => {
          if (item.number < center || !center) {
            total += priceInterval[min].purchase_price * item.number
          } else if (item.number >= center && (item.number < max || !max)) {
            total += priceInterval[center].purchase_price * item.number
          } else {
            total += priceInterval[max].purchase_price * item.number
          }
        })
        return retainTwoDecimal(total)
      }
      // 多规格价格统计
      if (singleSpecPrice2 || multipSpecPrice) {
        multiGoodsAttr.forEach(item => {
          total += item.number * item.promotion_price
        })
        return retainTwoDecimal(total)
      }
      return 0
    },
    // 多规格以及多区间派生加入购物车数据
    addGoodsCart () {
      const arr = []
      this.multiGoodsAttr.forEach(item => {
        const { goods_id, number, spec_value, seller_id, spec_key } = item
        let obj = {
          goods_id,
          seller_id,
          spec_key,
          goods_num: number,
          goods_name: spec_value
        }
        arr.push(obj)
      })
      return arr
    },
    // 节省的金额，相当于佣金 -- 2018/12 开发周期，暂不考虑区间报价
    savedMoney () {
      let total = 0
      let { singleGoodsAttr, multiGoodsNum, singleSpecPrice1, singleSpecPrice2, multipSpecPrice, goodsDetail, multiGoodsAttr } = this
      let { goods_num } = singleGoodsAttr
      if (goods_num || multiGoodsNum) {
        // 无规格
        if (singleSpecPrice1) return retainTwoDecimal(goods_num * goodsDetail.commission_price)
        // 单一规格或者多规格
        if (singleSpecPrice2 || multipSpecPrice) {
          multiGoodsAttr.forEach(item => {
            let { number, commission_price } = item
            total += number * commission_price
          })
          return retainTwoDecimal(total)
        }
        return '0.00'
      }
      return '0.00'
    },
    // 分享弹窗的佣金展示，只统计单件
    shareCommission () {
      const { isFlashSale, goodsDetail } = this
      if (isFlashSale) return '0.00'
      return retainTwoDecimal(goodsDetail.commission_price)
    },
    // 是否是无规格的限时抢购商品，默认是 true
    isNoSpecFlashSaleGoods () {
      const { isFlashSale } = this
      const { is_var_spec, sell_is_spec } = this.goodsDetail
      if (isFlashSale) {
        return !is_var_spec && !sell_is_spec
      }
      return false
    },
    // 是否是单一规格限时抢购商品，默认为 true
    isSingleFlashSaleGoods () {
      const { isFlashSale } = this
      const { is_var_spec, sell_is_spec } = this.goodsDetail
      if (isFlashSale) {
        return !is_var_spec && sell_is_spec
      }
      return false
    },
    // 限时抢购商品的规格
    singleFlashSaleSpecfication () {
      const { isSingleFlashSaleGoods, goodsDetail } = this
      if (isSingleFlashSaleGoods) return goodsDetail.sell_spec_level.spec[0]
      return '默认'
    },
    // 限时抢购节省金额
    flashSaleSavedMon () {
      const { isFlashSale, goodsDetail } = this
      const { cutdown_price, number } = goodsDetail
      if (isFlashSale) {
        return retainTwoDecimal(cutdown_price * number)
      }
      return '0.00'
    },
    // 限时抢购最大购买数量
    flashSaleMaxNumber () {
      let { sell_number, sell_cart_number, sell_order_number, sell_stock } = this.goodsDetail
      let diff = sell_number - sell_cart_number - sell_order_number
      return diff > sell_stock ? sell_stock : diff
    },
    // 导航背景透明度
    backgroundColor () {
      return {
        backgroundColor: `rgba(255, 255, 255, ${this.opacity})`
      }
    }
    /* eslint-enable */
  },
  created () {
    this.getGoodsDetail()
  },
  methods: {
    // 顶部导航回退
    goBack () {
      if (this.isNative) {
        closeWebview()
        return
      }
      // if (this.bannerListUrl) {
      //   this.$push({ path: '/hot-goods', query: { fromNative: 1 } })
      //   return
      // }
      this.$back()
    },
    // 顶部导航菜单
    showTopMenuTab () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      this.$refs.topNav.show()
    },
    // 商品详情
    getGoodsDetail () {
      let { isOpenByShare, goodsId, shareId, provinceId, cityId, $ok, $t } = this
      let url = isOpenByShare ? 'nologin/particulars' : 'goods/particulars'
      let obj = {
        id: goodsId,
        shareId: shareId,
        opProvince: provinceId,
        opCity: cityId
      }
      if (!isOpenByShare) delete obj.shareId
      this.$http(url, obj).then(res => {
        try {
          if (res.code === $ok) {
            /* eslint-disable */
            const CITYID = getItem('opCity')
            const {
                    // 省市
                    city,
                    // 评论
                    comment,
                    // 商品类型 0 -> 常规; 1 -> 限时; 2 -> 爆款
                    good_type,
                    // 价格类型 0 -> 无规格; 1 -> 单一/多规格; 2 -> 区间
                    // price_type,
                    // 商品详情
                    goods,
                    // 爆款商品
                    hot,
                    // 限时抢购商品
                    sale,
                    // 店铺详情
                    shop,
                    // 用户状态
                    user,
                    im_name
                  } = res.data
            const { city_id, name } = city
            const { data = [], total } = comment
            const { status, special_card, seller_id, shop_name } = shop
            let { id,
                  title,
                  is_delete,
                  content,
                  boutique,
                  material,
                  is_stock_good,
                  orginal_stock,
                  image,
                  price_type,
                  price_level = {},
                  is_var_spec,
                  max_price,
                  // 特约采购师价
                  purchase_price,
                  // 零售限价
                  promotion_price,
                  // 限时商品价
                  sell_price,
                  material_info = []
                } = goods
            let { spec_price, int_price, spec } = price_level
            if (Number(CITYID) !== city_id) $t(`该商品所属地为${name}`)
            // 商品是否过期
            this.outTime = is_delete === 1 || is_delete === 2 || status === 3
            if (this.outTime) {
              throw new Error('商品已过期')
              invokeNativeMethod('setTitle', '商品已过期')
              return
            }
            this.goodsCategory = good_type
            this.goodsPriceType = res.data.price_type
            this.imInfo = {
              type: 1,
              im_name,
              seller_id,
              seller_name: shop_name,
              goods_id: id,
              goods_image: image[0],
              goods_name: title,
              goods_price: purchase_price,
            }
            this.commentList = data
            this.commentTotalNums = total
            this.goodsStock = orginal_stock
            this.mainPic = image[0]
            this.hotEndTime = hot
            this.flashEndTime = sale
            this.shopDetail = shop
            this.specialCard = special_card
            this.authenInfo = user
            this.handlerBannerData(image)
            this.handlerGoodsDetail(content)
            this.handlerMeterialData(material_info)
            this.specification = price_level && spec_price && this.handlerGoodsAttrs(spec_price)
            if (good_type !== 1) {
              // 数据转换
              if (price_type === '区间报价') {
                this.handlerIntervalGoods(int_price)
              } else if (price_type === '规格报价' && toRawType(price_level) === 'Object') {
                this.multipartSpec = Object.keys(spec)
                // this.handlerIntervalGoods(spec_price)
                if (is_var_spec) {
                  // 解决多规格渲染的时候 tab 组件行为表现不一致的问题
                  let assembleList = []
                  this.multipartSpec.forEach((specification, index) => {
                    let arr = []
                    spec_price.forEach(item => {
                      if (specification === item.specval_pre) {
                        arr.push(item)
                      }
                    })
                    assembleList.push(arr)
                  })
                  price_level.assembleList = assembleList
                }
              }
              goods.retailPrice = promotion_price
            } else {
              goods.retailPrice = sell_price
              this.getServerTime().then(t => {
                this.countDownTime(t)
              })
            }
            if (res.data.price_type !== 2) {
              goods.priceType = 0
            } else {
              goods.priceType = 1
            }
            switch (good_type) {
              case 0:
                goods.isHot = false
                goods.isFlash = false
                goods.goodsType = 0
                break
              case 1:
                goods.isHot = false
                goods.isFlash = true
                goods.goodsType = 1
                break
              case 2:
                goods.isHot = true
                goods.isFlash = false
                goods.goodsType = 2
                break
            }
            // 市场标价，用于二维码分享，传递给原生
            goods.marketPrice = max_price
            goods.isNewGoods = !!is_stock_good
            goods.isJoinedBestGoods = !!boutique
            goods.isJoinedMeterialGoods = !!material
            this.goodsDetail = goods
            if (isOpenByShare) {
              let obj = {
                title: shop_name,
                desc: title,
                imgUrl: smallPic(image[0], 200, 200)
              }
              this.wxShare(obj)
            }
            this.isLoadGoodsDetail = true
          } else if (res.code === 400) {
            this.outTime = true
            this.isLoadGoodsDetail = true
          }
          /* eslint-enable */
        } catch (e) {
          this.isLoadGoodsDetail = true
        }
      })
    },
    // 处理商品 banner 图数据
    handlerBannerData (data) {
      let arr = []
      data.forEach(item => {
        let obj = {}
        obj.url = 'javascript:'
        obj.img = item
        obj.title = ''
        arr.push(obj)
      })
      this.bannerList = arr
    },
    // 商品参数展示数据处理
    handlerGoodsAttrs (data) {
      let str = ''
      data.forEach(item => {
        str += item.info.spec_value + '；'
      })
      return str.substr(0, str.length - 1)
    },
    // 处理材料图书馆数据，用于多于两条的显示与隐藏
    handlerMeterialData (data) {
      this.meterialGoodsList = data.map((item, index) => {
        /* eslint-disable */
        let { op_province = '', op_city = '', op_area = '', address = '' } = item
        let detailAddress = `${op_province}${op_city}${op_area}${address}`
        /* eslint-enable */
        if (index <= 1) {
          item.show = true
        } else {
          item.show = false
        }
        item.detailAddress = sliceChar(detailAddress, 25)
        return item
      })
    },
    // 区间报价数组组装
    handlerIntervalGoods (data) {
      data.forEach(item => {
        item['info']['commonPrice'] = splitMoney(item['info']['price'])
        item['info']['purchasePrice'] = splitMoney(item['info']['purchase_price'])
        item['info']['svipPrice'] = splitMoney(item['info']['svip_purchase_price'])
        item['info']['commissionPrice'] = splitMoney(item['info']['Commission_price'])
        item['info']['svipCommissionPrice'] = splitMoney(item['info']['svip_Commission_price'])
        item['info']['promotionPrice'] = splitMoney(item['info']['promotion_price'])
      })
    },
    // 商品详情数据处理
    handlerGoodsDetail (t) {
      // eslint-disable-next-line
      const reg = new RegExp(/\<div class="tab-detail active"(.|\n)+\<\/div\>/)
      let str = ''
      t.replace(reg, c => {
        str = c
      })
      this.goodsContent = str.substr(0, str.length - 18)
    },
    // 判断购物车中是否包含当前商品，否的话，购物车数量 +1，否则不修改
    judgeCartHasCurrentGoods (goodsId, cartIdArr) {
      return inArray(goodsId, cartIdArr).include
    },
    // 认证店铺弹窗
    showAuthenPop () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      this.$refs.authen.show()
    },
    // 认证店铺接口
    goAuthen () {
      const { shopDetail, $ok, $refs, $t } = this
      let url = 'adv/buyerShopAuth'
      let obj = {
        seller_id: shopDetail.seller_id
      }
      this.$http(url, obj).then(res => {
        if (res.code === $ok) {
          this.authenInfo.audit_status = res.data.audit_status
          $refs.authen.hide()
          $t('认证已提交，等待商家审核')
        }
      })
    },
    // 查看材料馆所有商品
    viewAllMeterialGoods () {
      for (const item of this.meterialGoodsList) {
        if (item.show) continue
        item.show = true
      }
    },
    // 前往首页材料馆
    goMeterial (selectId) {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      let obj = {
        url: 'cgs://goodsMaterialLib',
        param: { selectId }
      }
      invokeNativeMethod('openView', toJson(obj))
    },
    // 查看材料馆地址
    viewMeterialAddress (item) {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      /* eslint-disable */
      let { op_province = '', op_city = '', op_area = '', address = '' } = item
      let obj = {
        province: op_province,
        city: op_city,
        area: op_area,
        address
      }
      /* eslint-enable */
      invokeNativeMethod('nativeMapNavigation', toJson(obj))
    },
    // 店铺详情
    goShopDetail (id) {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      this.$router.push({name: 'ShopDetail', query: { id, fromGoodsDetail: 1 }})
    },
    // 去往购物车
    goCart () {
      if (this.isOpenByShare) {
        this.goCustomiedPage('/app')
        return
      }
      this.$router.push('/quotation')
    },
    // 弹出报价单弹窗
    addGoods (t) {
      let { isInvoked, isNoPay, isOpenByShare, authened, isFlashSale, $refs } = this
      if (isInvoked || isNoPay || isOpenByShare || (!authened && !isFlashSale)) {
        if (isOpenByShare) this.goCustomiedPage('/app')
        if (!authened) this.showAuthenPop()
        return
      }
      this.addGoodsType = t
      $refs.popup.show()
    },
    // 关闭添加报价单弹窗
    closePriceList () {
      this.$refs.popup.hide()
    },
    // 添加商品到购物车
    addGoodsToCart () {
      /* eslint-disable */
      let { singleGoodsAttr, isFlashSale, goodsDetail, singleSpecPrice1, singleIntervelPirce, singleSpecPrice2, multipSpecPrice,
            multipIntervelPirce, addGoodsCart, multiGoodsNum, $t, $ok
          } = this
      let { goods_num } = singleGoodsAttr
      let { id, unit, minimum_quantity, sell_cart_number, sell_number, sell_order_number, cart_total_arr } = goodsDetail
      // 限时抢购超出数量判断及提示
      if (sell_cart_number >= sell_number - sell_order_number) {
        $t(`限购${sell_number - sell_order_number}${unit}`)
        return
      }
      if (((singleSpecPrice1 || singleIntervelPirce || isFlashSale) && !goods_num) ||
          ((singleSpecPrice2 || multipSpecPrice || multipIntervelPirce) && !addGoodsCart.length)) {
        $t('请选择要添加的商品')
        return
      }
      // 区间报价判断数量是否达到最小起订量
      if ((singleIntervelPirce && goods_num < minimum_quantity) ||
        (multipIntervelPirce && multiGoodsNum < minimum_quantity)) {
        $t(`起批量至少${minimum_quantity}${unit}`)
        return
      }
      let goodsInfo = []
      if (singleSpecPrice1 || singleIntervelPirce || isFlashSale) {
        goodsInfo.push(singleGoodsAttr)
      } else {
        goodsInfo = addGoodsCart
      }
      let url = 'cart/addCart'
      let obj = {
        goodsInfo: toJson(goodsInfo)
      }
      this.$http(url, obj).then(res => {
        if (res.code === $ok) {
          $t('添加成功')
          this.closePriceList()
          let include = this.judgeCartHasCurrentGoods(id, cart_total_arr)
          if (!include) {
            if (isFlashSale) {
              this.goodsDetail.cart_total += this.flashSaleTotalNum
            }
            else if (singleSpecPrice1) {
              this.goodsDetail.cart_total += goods_num
            }
            else {
              this.goodsDetail.cart_total += multiGoodsNum
            }
            this.goodsDetail.cart_total_arr.push(id)
          }
          // 限时抢购商品更新能加入的最大数量
          if (isFlashSale) {
            this.flashSaleTotalNum += goods_num
            goodsDetail.sell_cart_number += this.flashSaleTotalNum
            if (goodsDetail.sell_cart_number >= goodsDetail.sell_number - goodsDetail.sell_order_number) goodsDetail.sell_cart_number = goodsDetail.sell_number - goodsDetail.sell_order_number
            return
          }
          if (singleSpecPrice1) {
            this.goodsDetail.cart_number += goods_num
            return
          }
          if (singleSpecPrice2 || multipSpecPrice) {
            this.goodsDetail.cart_number += multiGoodsNum
          }
          return
        }
        $t(res.message)
      })
      /* eslint-enable */
    },
    // 带购赚中添加商品到报价单弹窗显示控制
    showAddGoodsToQuotationPopup () {
      let url = 'cart/offerList'
      let obj = {
        all: 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.goodsQuotationList = res.data
          this.isShowAddToQuotation = true
        }
      })
    },
    hideAddGoodsToQuotationPopup () {
      this.isShowAddToQuotation = false
    },
    // 立即购买跳转到下单页
    goBuyGoods () {
      let res = this.transformGoodsToQuotation(true)
      if (!res) return
      setItem('order', toJson(res))
      this.$push({ path: '/order', query: { fromGoodsDetail: 1 } })
    },
    // 去往报价单管理页面
    goQuotationList () {
      this.$push('/quotation-list')
    },
    // 添加商品到报价单
    addGoodsToQuotation (item) {
      let res = this.handlerGoodsToAddQuotation()
      if (!res) return
      // eslint-disable-next-line
      let { id, offer_name } = item
      let url = 'offer/addGoodsToOffer'
      let obj = {
        offer_id: id,
        goodsInfo: res
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // eslint-disable-next-line
          this.$t(`该商品已成功添加到“${offer_name}”报价单~`)
          this.isShowAddToQuotation = false
        }
      })
    },
    // 格式化添加到具体某报价单的数据
    handlerGoodsToAddQuotation () {
      let { singleGoodsAttr, multiGoodsNum, singleSpecPrice1, singleSpecPrice2, multipSpecPrice, addGoodsCart, isFlashSale, $t } = this
      let arr = []
      if (!singleGoodsAttr.goods_num && !multiGoodsNum) {
        $t('请选择商品')
        return false
      }
      // 无规格
      if (singleSpecPrice1 || isFlashSale) {
        let obj = cloneDeep(singleGoodsAttr)
        delete obj.goods_name
        arr.push(obj)
      }
      if (singleSpecPrice2 || multipSpecPrice) {
        let tempArr = cloneDeep(addGoodsCart)
        arr = tempArr.map(item => {
          delete item.goods_name
          return item
        })
      }
      return toJson(arr)
    },
    // 新建报价单
    createNewQuotation () {
      let res = this.transformGoodsToQuotation()
      if (!res) return
      setItem('quotation', toJson(res))
      this.$push({ path: '/make-quotation', query: { fromGoodsDetail: 1 } })
    },
    // 格式化商品数据成为报价单数据
    transformGoodsToQuotation (checked = false) {
      /* eslint-disable */
      let { singleGoodsAttr, multiGoodsNum, singleSpecPrice1, singleSpecPrice2, multipSpecPrice, isFlashSale,
            goodsDetail, multiGoodsAttr, shopDetail, specialCard, $t } = this
      let { goods_num } = singleGoodsAttr
      let { id, title, is_delete, content, boutique, material, is_stock_good, orginal_stock, image, freight,
            promotion_price, priceType, goodsType, unit, max_price, price_type, purchase_price, price,
            // 最小起订量
            minimum_quantity,
            // 限时抢购数据
            // 限时抢购价，对应制作报价单中的 kind.price
            sell_price,
            // 最大购买数量
            sell_number,
            // 加入购物车的数量
            sell_cart_number
          } = goodsDetail
      let { seller_id, shop_name } = shopDetail
      if (!goods_num && !multiGoodsNum) {
        $t('请选择商品')
        return false
      }
      let arr = []
      let quotation = {
        checked,
        shopName: shop_name,
        shop_name,
        seller_id,
        shop_id: shopDetail.id,
        freight,
        goodsInfo: [
          {
            checked,
            // 如果是限时商品，表示限购数，为最大购买 - 当前采购师已购限时商品数，否则表示的为最小起订量，为 1；
            buy_number: isFlashSale ? sell_number - sell_cart_number : minimum_quantity,
            goods_id: id,
            goods_img: image[0],
            goods_name: title,
            goods_type: goodsType,
            is_stock_good,
            boutique,
            material,
            price_type: priceType,
            kinds: []
          }
        ]
      }
      // 无规格
      if (singleSpecPrice1 || isFlashSale) {
        let obj = {
          checked,
          id: null,
          svip_price: null,
          flag: 1,
          title: '',
          one_discount: 0,
          identity: null,
          spec_key: '',
          count: goods_num,
          max_price,
          // 限时商品，取限时价，制作报价单中，该字段只有限时商品用到，其他商品用不到
          price: isFlashSale ? sell_price : price,
          purchase_price,
          promotion_price,
          goods_unit: unit
        }
        quotation.goodsInfo[0].kinds.push(obj)
      }
      // 单一规格/多规格
      if (singleSpecPrice2 || multipSpecPrice) {
        this.multiGoodsAttr.forEach(goodsItem => {
          let { number, price, purchase_price, promotion_price, spec_key, title } = goodsItem
          let goodsAttrName = ''
          title.forEach(specItem => {
            for (let key in specItem) {
              goodsAttrName += key + '：' + specItem[key]
            }
          })
          goodsAttrName = goodsAttrName.substring(0, goodsAttrName.length - 1)
          let obj = {
            checked,
            id: null,
            count: number,
            flag: 1,
            max_price,
            svip_price: null,
            price,
            purchase_price,
            promotion_price,
            title: goodsAttrName,
            goods_unit: unit,
            one_discount: 0,
            identity: null,
            spec_key
          }
          quotation.goodsInfo[0].kinds.push(obj)
        })
      }
      arr.push(quotation)
      return arr
      /* eslint-enable */
    },
    // 分享商品
    shareCurrentGoods () {
      let { isInvoked, isOpenByShare, $refs } = this
      if (isInvoked || isOpenByShare) {
        if (isOpenByShare) this.goCustomiedPage('/app')
        return
      }
      $refs.goodsShare.show()
    },
    // 倒计时
    countDownTime (t) {
      this.startTime = (t - 0)
      let endTime = this.flashEndTime.end_time
      this.countTime = countDown(this.startTime, endTime)
      this.timerId = setInterval(() => {
        let interval = endTime - this.startTime
        if (interval === 0) clearInterval(this.timerId)
        this.countTime = countDown(this.startTime, endTime)
        this.startTime++
      }, 1000)
    },
    // 获取服务器时间
    getServerTime () {
      let url = 'order/getime'
      return new Promise((resolve, reject) => {
        this.$http(url).then(res => {
          if (res.code === this.$ok) {
            resolve(res.data.timestamp)
          }
        })
      })
    },
    // 强制浏览器重排，修复商品描述区域显示不全 bug
    justifyContentHeight () {
      if (!this.beforeScroll) return
      let dom = this.$refs.container
      dom.style.height = dom.scrollHeight + 1 + 'px'
      this.beforeScroll = false
    },
    // 滚动监听
    scroll (payload) {
      let posY = payload.y
      let ratio = posY / -359
      this.opacity = ratio
      if (posY <= -359) {
        this.showAuthenNav = true
      } else {
        this.showAuthenNav = false
      }
    },
    scrollToElement (i) {
      this.scrollIndex = i
      let dom = `scrollEle${i}`
      this.$refs.scroll.scrollToElement(this.$refs[dom], 300, false, true)
    }
  },
  filters: {
    // 获取单一规格商品节省的金额/佣金
    getSingleSpecGoodsSavedMoney (goods) {
      /* eslint-disable */
      let { commission_price, number } = goods
      return retainTwoDecimal(commission_price * number)
      /* eslint-enable */
    }
  },
  watch: {
    isLoadGoodsDetail () {
      let { authened, goodsDetailNav } = this
      if (!authened) {
        goodsDetailNav.splice(4)
      } else {
        goodsDetailNav.splice(4, 1, 'share')
      }
    }
  },
  // 销毁定时器
  beforeDestroy () {
    if (this.timerId) clearInterval(this.timerId)
  },
  components: {
    BaseComment,
    BaseInputNumber,
    BasePopupTransition,
    BasePopupAuthen,
    BaseNavList,
    BaseGoodsShare,
    Swiper,
    SwiperItem,
    Tab,
    TabItem
  }
}
</script>

<style lang='stylus'>
@import './goods'
</style>
