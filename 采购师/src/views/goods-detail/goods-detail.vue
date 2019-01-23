<template>
  <div class="common-goods-detail-container iphone-x-container" :class="{'share-iponer-x': isOpenByShare, 'is-ipone': isPone}">
      <!-- 导航菜单 -->
    <div class="goods-detail-nav" v-if="!outTime" :style="backgroundColor">
      <div class="nav-left">
        <div class="nav-back nav-icon" :class="{active: showAuthenNav}" @click="goBack"></div>
      </div>
      <!-- <div class="nav-center">
        <img src="" alt="">
      </div> -->
      <div class="nav-right">
        <!-- <div class="nav-quotation nav-icon" :class="{active: showAuthenNav}" @click="goQuotation"></div> -->
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
          :include="['home', 'message', 'lineQuery', 'concat', 'share']"
          :serviceMobile="shopDetail.service_mobile"
          @showShare="showSharePop">
        </base-nav-list>
      </div>
    </div>
    <base-scroll
      ref="scroll"
      :hasMore='true'
      :listenScroll='true'
      :probeType='3'
      :data="commentList"
      @scroll="scroll"
      :beforeScroll="beforeScroll"
      @beforeScroll="justifyContentHeight"
      v-if="!isFlashSale && !outTime"
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
      <div class="goods-detail-authen" v-show="isSpecialCard && isSpecialGoods && unAuthen" @click="showAuthenPop">
        <div class="authen-nav">
          <div class="authen-title">
            <span class="shop-icon"></span>
            <p class="authen-description" v-if="authened">
              <!-- <span>认证店铺优惠 可额外再返</span><span class="authen-commission">佣金{{ specialCard.one_discount }}%</span> -->
              认证店铺再享<span class="authen-commission">{{ specialCard.one_discount }}%佣金</span>+认证奖励
            </p>
            <p class="authen-description" v-else>
              <!-- <span>认证店铺优惠 可额外再返</span><span class="authen-commission">佣金**%</span> -->
              认证店铺再享<span class="authen-commission">**%佣金</span>+认证奖励
            </p>
          </div>
          <div class="authen-url">
            <div class="unauthen-icon">未认证</div>
            <div class="unauthen-arrow"></div>
          </div>
        </div>
      </div>
      <!-- 价格模块 -->
      <div class="goods-detail-main-price">
        <div class="goods-detail-title">
          <h1 class="goods-title">
            <span class="goods-storage" v-show="isStockGoods">现货</span>
            <span class="goods-storage-text">{{ goodsDetail.title }}</span>
          </h1>
          <div class="goods-separate"></div>
          <div class="goods-share" @click="showSharePop"></div>
        </div>
        <!-- 规格报价 -->
        <div class="goods-detail-price" v-if="!intervalPrice">
          <div class="goods-description-price">
            <!-- 未认证 - 采购价 -->
            <div class="goods-price" v-if="!showSvipPrice && !isOpenByShare">
              <p class="goods-price-detail">
                <span class="goods-price-icon-0" v-show="isHotGoods">爆款价</span>
                <span>
                  ￥<i class="price-init">{{ goodsDetail.purchaseInit }}</i>.{{ goodsDetail.purchaseZero }}
                </span>
                <span class="price-num" v-show="showPriceIntervalOne">起</span>
              </p>
              <p class="goods-price-icon-1" v-show="!isHotGoods">直采价</p>
            </div>
            <!-- 分享 - 未认证 - 推荐价 -->
            <div class="goods-price" v-else-if="!showSvipPrice && isOpenByShare">
              <p class="goods-price-detail">
                <span class="goods-price-icon-0" v-show="isHotGoods">爆款价</span>
                <span>
                  ￥<i class="price-init">{{ goodsDetail.promotionPriceInit }}</i>.{{ goodsDetail.promotionPriceZero }}
                </span>
                <span class="price-num" v-show="showPriceIntervalOne">起</span>
              </p>
              <p class="goods-price-icon-1" v-show="!isHotGoods">零售底价</p>
            </div>
            <!-- 已认证 - svip 价 -->
            <div class="goods-price" v-else-if="showSvipPrice && !isOpenByShare">
              <p class="goods-price-detail">
                <span class="goods-price-icon-0" v-show="isHotGoods">爆款价</span>
                <span>
                  ￥<i class="price-init">{{ goodsDetail.svipInit }}</i>.{{ goodsDetail.svipZero }}
                </span>
                <span class="price-num" v-show="showPriceIntervalOne">起</span>
              </p>
              <!-- <p class="goods-price-vip-1" v-show="!isHotGoods"> -->
              <p class="goods-price-vip-1">
                <span></span>
                VIP直采价
              </p>
            </div>
            <!-- 已认证 - 分享 - 推荐价 -->
            <div class="goods-price" v-else>
              <p class="goods-price-detail">
                <span class="goods-price-icon-0" v-show="isHotGoods">爆款价</span>
                <span>
                  ￥<i class="price-init">{{ goodsDetail.promotionPriceInit }}</i>.{{ goodsDetail.promotionPriceZero }}
                </span>
                <span class="price-num" v-show="showPriceIntervalOne">起</span>
              </p>
              <!-- <p class="goods-price-vip-1" v-show="!isHotGoods"> -->
              <p class="goods-price-vip-1">
                <span></span>
                VIP直采价
              </p>
            </div>
            <div class="wholesale-num">
              <span class="goods-num">{{ goodsDetail.minimum_quantity }}{{ goodsDetail.unit }}起批</span>
              <del class="retail-price">零售标价：¥{{ goodsDetail.max_price }}</del>
            </div>
          </div>
          <div class="goods-commission" v-show="!isOpenByShare">
            <!-- <p class="commission-top" v-if="!showSvipPrice"> -->
            <p class="commission-top">
              <span class="commission-icon"></span>
              <span class="commission-init">{{ goodsDetail.maxCommission.init }}</span>&nbsp;<span>.{{ goodsDetail.maxCommission.zero }}</span>
            </p>
            <!-- <p class="commission-top" v-else>
              <span class="commission-icon"></span>
              <span class="commission-init">{{ goodsDetail.svipCommission.init }}</span>&nbsp;<span>.{{ goodsDetail.svipCommission.zero }}</span>
            </p> -->
            <div class="commission-bottom">
              <span class="commission-text">佣金</span>
              <span class="commission-descption" @click="commissionIntroduce1 = !commissionIntroduce1">?</span>
              <!-- 佣金介绍 -->
              <div class="commission-introduce1" v-show="commissionIntroduce1">
                <!-- <p>分享产品，用户购买后即可获得此佣金，佣金根据购买数量累计，佣金可提现。</p> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 区间报价 -->
        <div class="goods-wholesale-price-container" v-else>
          <div class="goods-wholesale-title" v-if="isHotGoods">
            <h2>爆款价</h2>
            <div v-if="!isOpenByShare">
              <span class="commission-icon"></span>
              <span class="commission-text">最低可赚取佣金</span>
              <!-- <span  v-if="!showSvipPrice"> -->
              <span>
                <i class="commission-init-num">{{ goodsDetail.maxCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.maxCommission.zero }}</b>
              </span>
              <!-- <span  v-else>
                <i class="commission-init-num">{{ goodsDetail.svipCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.svipCommission.zero }}</b>
              </span> -->
              <span class="commission-descption" @click="commissionIntroduce2 = !commissionIntroduce2">?</span>
              <!-- 佣金介绍 -->
              <div class="commission-introduce2" v-show="commissionIntroduce2">
                <!-- <p>分享产品，用户购买后即可获得此佣金，佣金根据购买数量累计，佣金可提现。</p> -->
              </div>
            </div>
          </div>
          <div class="goods-wholesale-title" v-else-if="isCommonGoods">
            <p class="goods-price-icon-1" v-if="!showSvipPrice">直采价</p>
            <p class="goods-price-vip-1" v-else>
              <span></span>
              VIP直采价
            </p>
            <div v-if="!isOpenByShare">
              <span class="commission-icon"></span>
              <span class="commission-text">最低可赚取佣金</span>
              <!-- <span  v-if="!showSvipPrice"> -->
              <span>
                <i class="commission-init-num">{{ goodsDetail.maxCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.maxCommission.zero }}</b>
              </span>
              <!-- <span  v-else>
                <i class="commission-init-num">{{ goodsDetail.svipCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.svipCommission.zero }}</b>
              </span> -->
              <span class="commission-descption" @click="commissionIntroduce2 = !commissionIntroduce2">?</span>
              <!-- 佣金介绍 -->
              <div class="commission-introduce2" v-show="commissionIntroduce2">
                <!-- <p>分享产品，用户购买后即可获得此佣金，佣金根据购买数量累计，佣金可提现。</p> -->
              </div>
            </div>
          </div>
          <!-- <div class="goods-wholesale-title" v-else-if="isCommonGoods">
            <div>
              <span class="commission-descption no-right-margin" @click="commissionIntroduce2 = !commissionIntroduce2">?</span>
              <span class="commission-icon"></span>
              <span class="commission-text">最低可赚取佣金</span>
              <span  v-if="!showSvipPrice">
                <i class="commission-init-num">{{ goodsDetail.maxCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.maxCommission.zero }}</b>
              </span>
              <span  v-else>
                <i class="commission-init-num">{{ goodsDetail.svipCommission.init }}</i>.<b class="commission-zero">{{ goodsDetail.svipCommission.zero }}</b>
              </span>
              佣金介绍
              <div class="commission-introduce2 right-commission-icon" v-show="commissionIntroduce2">
                <p>分享产品，用户购买后即可获得此佣金，佣金根据购买数量累计，佣金可提现。</p>
              </div>
            </div>
          </div> -->
          <!-- 已认证 - svip 区间报价 -->
          <ul class="goods-wholesale-price" v-if="showSvipPrice && !isOpenByShare">
            <li v-for="(item, index) in goodsDetail.price_level.int_price" :key="index">
              <h1>
                ￥<span class="wholesale-price-init">{{ item.info.svipPrice.init }}</span>.<span>{{ item.info.svipPrice.zero }}</span>
              </h1>
              <h2>{{ item.interval }}{{ goodsDetail.unit }}起批</h2>
              <h3>
                <del>¥{{ item.info.commonPrice.init }}.{{ item.info.commonPrice.zero }}</del>
              </h3>
            </li>
          </ul>
          <!-- 未认证 - 特约采购师区间报价 -->
          <ul class="goods-wholesale-price" v-else-if="!showSvipPrice && !isOpenByShare">
            <li v-for="(item, index) in goodsDetail.price_level.int_price" :key="index">
              <h1>
                ￥<span class="wholesale-price-init">{{ item.info.purchasePrice.init }}</span>.<span>{{ item.info.purchasePrice.zero }}</span>
              </h1>
              <h2>{{ item.interval }}{{ goodsDetail.unit }}起批</h2>
              <h3>
                <del>¥{{ item.info.commonPrice.init }}.{{ item.info.commonPrice.zero }}</del>
              </h3>
            </li>
          </ul>
          <!-- 分享 - 推荐价 -->
          <ul class="goods-wholesale-price" v-else-if="isOpenByShare">
            <li v-for="(item, index) in goodsDetail.price_level.int_price" :key="index">
              <h1>
                ￥<span class="wholesale-price-init">{{ item.info.promotionPrice.init }}</span>.<span>{{ item.info.promotionPrice.zero }}</span>
              </h1>
              <h2>{{ item.interval }}{{ goodsDetail.unit }}起批</h2>
              <h3>
                <del>¥{{ item.info.commonPrice.init }}.{{ item.info.commonPrice.zero }}</del>
              </h3>
            </li>
          </ul>
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
      <!-- 价格以及佣金说明 -->
      <div class="price-explain-container" @click="ToggleExplainPricePopup(true)">
        <div class="separate"></div>
        <div class="price-explain">
          <div class="explain-left">
            <div class="left-icon"></div>
            <div class="left-text">商品价格和佣金规则不清楚，点这里</div>
          </div>
          <div class="explain-right"></div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="separate"></div>
      <!-- 选择规格 -->
      <div class="goods-detail-specification" @click="addGoods" v-if="!(singleSpecPrice1 || singleIntervelPirce)">
        <div class="specification-desc">
          <div class="specification-icon"></div>
          <h1>选择规格</h1>
        </div>
        <div class="specification-text">
          {{ specification }}
        </div>
        <div class="specification-arrow"></div>
      </div>
      <!-- 分割线 -->
      <div class="separate" v-if="!(singleSpecPrice1 || singleIntervelPirce)"></div>
      <!-- 特约认证 -->
      <div class="special-authen-container" v-show="isSpecialCard && isSpecialGoods" @click="showAuthenPop">
        <div class="special-authen">
          <div class="special-authen-text">
            <span class="special-authen-icon"></span>
            <span class="special-authen-desc">特约认证</span>
            <!-- <p v-if="authened">认证店铺后在原佣金基础上<i>再累加返佣{{ specialCard.one_discount }}%</i></p>
            <p v-else>认证店铺后在原佣金基础上<i>再累加返佣**%</i></p> -->
            <p v-if="authened">
              认证店铺再享<i>{{ specialCard.one_discount }}%佣金</i>+认证奖励
            </p>
            <p v-else>
              认证店铺再享<i>XX%佣金</i>+认证奖励
            </p>
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
        <div class="goods-details-introduce">
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
            <div class="shop-entry" @click="goShop(shopDetail.seller_id)">
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
        <base-no-more message="已经到底了"></base-no-more>
      </div>
    </base-scroll>
    <div class="footer-container" v-if="!isFlashSale && !outTime">
      <div class="footer-left">
        <div class="footer-consult" @click="showBottomMenuTab">
          <span class="footer-consult-icon"></span>
          <span class="footer-left-text">咨询</span>
        </div>
        <div class="footer-seperate"></div>
        <!-- <div class="footer-collect">
          <span class="footer-collect-icon"></span>
          <span class="footer-left-text">收藏</span>
        </div>
        <div class="footer-seperate"></div> -->
        <!-- <div class="footer-shop" @click="goShop(shopDetail.seller_id)"> -->
        <div class="footer-shop" @click="goQuotation">
          <span class="footer-shop-icon"></span>
          <span class="footer-left-text">购物车</span>
        </div>
      </div>
      <div class="footer-right">
        <div
          class="footer-right-message"
          :class="{forbidden: isInvoked}"
          @click="showSharePop"
          v-if="!isOpenByShare">
          <div class="footer-right-icon">
            <span class="flash-icon"></span>
          </div>
          <div class="footer-right-seperate"></div>
          <div class="footer-right-message-text">
            <h2>
              ￥<span>{{ commissionInitAndZero.init }}</span>.{{ commissionInitAndZero.zero }}
            </h2>
            <p>分享可赚取佣金</p>
          </div>
        </div>
        <div
          class="footer-right-quotation"
          :class="{forbidden: isInvoked, share: isOpenByShare}"
          @click="addGoods">
          <span class="footer-quotation-icon"></span>
          <h2>加入购物车</h2>
        </div>
      </div>
      <!-- 导航 tab -->
      <div class="nav-menu-wrapper">
        <base-nav-list
          ref="bottomNav"
          :serviceMobile="shopDetail.service_mobile"
          :imInfo="{type: 1,im_name:imName,goods_id:goodsId,goods_image:bannerList[0].img,goods_name:goodsDetail.title,goods_price:goodsDetail.purchaseInit + '.' + goodsDetail.promotionPriceZero}"
          :include="['lineQuery','concat']"
          :is-show-top-arrow="false"
          :is-show-bottom-arrow="true">
        </base-nav-list>
      </div>
    </div>
    <!-- 加入购物车弹窗 -->
    <base-popup-transition
      v-if="!isFlashSale && !outTime"
      ref="popup">
      <div class="add-goods-wrapper iphone-x-bottom">
        <div class="goods-description-price padding-30">
          <div class="goods-price-description bd-b">
            <div class="goods-price-pic">
              <!-- <img src="./images/logo.png" alt=""> -->
              <img :src="mainPic" alt="">
            </div>
            <div class="goods-price-body">
              <h1>
                <span class="title-icon" v-show="isStockGoods">现货</span>
                <span class="goods-title">{{ goodsDetail.title }}</span>
              </h1>
              <!-- 已认证 - svip 价-->
              <div v-if="showSvipPrice && !isOpenByShare">
                <p v-show="showPriceIntervalTwo">
                  ￥<span>{{ goodsDetail.svipInit }}</span>.{{ goodsDetail.svipZero }} ~ ￥<span>{{ goodsDetail.MaxSvipInit }}</span>.{{ goodsDetail.MaxSvipZero }}
                </p>
                <p v-show="!showPriceIntervalTwo">
                  ￥<span>{{ goodsDetail.svipInit }}</span>.{{ goodsDetail.svipZero }}
                </p>
              </div>
              <!-- 未认证 或者 认证了但是该商品不是特约商品 - 特约采购师 -->
              <div v-else-if="!showSvipPrice && !isOpenByShare">
                <p v-show="showPriceIntervalOne">
                  ￥<span>{{ goodsDetail.purchaseInit }}</span>.{{ goodsDetail.purchaseZero }} ~ ￥<span>{{ goodsDetail.MaxPurchaseInit }}</span>.{{ goodsDetail.MaxPurchaseZero }}
                </p>
                <p v-show="!showPriceIntervalOne">
                  ￥<span>{{ goodsDetail.purchaseInit }}</span>.{{ goodsDetail.purchaseZero }}
                </p>
              </div>
              <!-- 分享 - 推荐价-->
              <div v-else-if="isOpenByShare">
                <p v-show="showPriceIntervalThree">
                  ￥<span>{{ goodsDetail.promotionPriceInit }}</span>.{{ goodsDetail.promotionPriceZero }} ~ ￥<span>{{ goodsDetail.maxPromotionPriceInit }}</span>.{{ goodsDetail.maxPromotionPriceZero }}
                </p>
                <p v-show="!showPriceIntervalThree">
                  ￥<span>{{ goodsDetail.promotionPriceInit }}</span>.{{ goodsDetail.promotionPriceZero }}
                </p>
              </div>
            </div>
            <div class="goods-price-icon" @click="closePriceList"></div>
          </div>
          <div class="goods-lists">
            <!-- 单一规格报价 - 1-->
            <ul v-if="singleSpecPrice1">
              <li class="goods-item bd-b">
                <div class="goods-item-left">
                  <!-- <h2 class="goods-item-name">{{ goodsDetail.product_code }}</h2> -->
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
            <!-- 单一规格报价 - 2 -->
            <ul v-if="singleSpecPrice2">
              <li class="goods-item bd-b" v-for="item in goodsDetail.price_level.spec_price" :key="item.info.id">
                <div class="goods-item-left">
                  <h2 class="goods-item-name">{{ item.specval }}</h2>
                  <h2 class="goods-item-price">¥{{ item.info.price }}</h2>
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
            <!-- 多规格报价 - 3 -->
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
                        <h2 class="goods-item-name">{{ goodsItem.specval }}</h2>
                        <h2 class="goods-item-price">¥{{ goodsItem.info.price }}</h2>
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
                <!-- <swiper-item v-for="item in goodsDetail.price_level.spec_price" :key="item.info.id">
                  <div class="tab-swiper vux-center">
                    <div class="goods-item bd-b">
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
                    </div>
                  </div>
                </swiper-item> -->
              </swiper>
            </div>
            <!-- 单一规格区间报价 - 1 -->
            <ul v-if="singleIntervelPirce">
              <li class="goods-item bd-b">
                <div class="goods-item-left">
                  <!-- <h2 class="goods-item-name">{{ goodsDetail.product_code }}</h2> -->
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
            <!-- 多规格区间报价 - 2 -->
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
        <div class="goods-total-price">
          <div class="goods-price padding-30">
            <p class="total-price">
              共<span>{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsAttr.goods_num) || multiGoodsNum }}</span>个
              <span>￥{{ ((singleSpecPrice1 || singleIntervelPirce) && singleGoodsPirce) || multipGoodsPrice }}</span>
            </p>
            <p class="total-commission" v-show="!isOpenByShare">
              <span class="commission-icon-money"></span>
              <span>分享赚佣金：</span>
              <span>￥{{ quotationCommission }}</span>
            </p>
          </div>
          <button class="add-button" @click="addGoodsToCart">确定</button>
        </div>
      </div>
    </base-popup-transition>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--                限时抢购模块                 -->
    <!--  -->
    <!--  -->
    <base-scroll
      ref="scroll"
      :hasMore='true'
      :listenScroll='true'
      :probeType='3'
      :data="commentList"
      @scroll="scroll"
      :beforeScroll="beforeScroll"
      @beforeScroll="justifyContentHeight"
      v-if="isFlashSale && !outTime"
      class="goods-scroll-wrapper">
      <!-- banner模块 -->
      <div class="goods-detail-banner">
        <swiper :list='bannerList' :show-desc-mask='false' :show-dots='false' :aspect-ratio='1' v-model="currentIndex"></swiper>
        <div class="banner-progress">
          <span v-show="bannerList.length">{{ picIndex }}/{{ bannerList.length }}</span>
        </div>
      </div>
      <!-- 认证导航 -->
      <div class="goods-detail-authen" v-show="isSpecialCard && isSpecialGoods && unAuthen" @click="showAuthenPop">
        <div class="authen-nav">
          <div class="authen-title">
            <span class="shop-icon"></span>
            <p class="authen-description">
              <span>认证店铺优惠 可额外再返</span><span class="authen-commission">佣金{{ specialCard.one_discount }}%</span>
            </p>
          </div>
          <div class="authen-url">
            <div class="unauthen-icon">未认证</div>
            <div class="unauthen-arrow"></div>
          </div>
        </div>
      </div>
      <!-- 限时抢购导航 -->
      <div class="goods-flash-sale">
        <div class="flash-sale-price">
          <div class="flash-sale-icon"></div>
          <div class="flash-sale-seperate"></div>
          <div class="flash-sale-main-price">
            ￥<span>{{ flashSalePrice.init }}</span>.{{ flashSalePrice.zero }}
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
      <!-- 价格模块 -->
      <div class="goods-detail-main-price">
        <div class="goods-detail-title">
          <h1 class="goods-title">
            <!-- <span class="goods-storage" v-show="isStockGoods">现货</span> -->
            <span class="goods-flash-label" v-show="isStockGoods">
              <i>限时抢</i>
              <i>现货</i>
            </span>
            <span class="goods-storage-text">{{ goodsDetail.title }}</span>
          </h1>
          <div class="goods-separate"></div>
          <div class="goods-share" @click="showSharePop"></div>
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
      <div class="goods-detail-specification" @click="addGoods" v-show="isSingleFlashSaleGoods">
        <div class="specification-desc">
          <div class="specification-icon"></div>
          <h1>选择规格</h1>
        </div>
        <div class="specification-text">
          {{ singleFlashSaleSpecfication }}
        </div>
        <div class="specification-arrow"></div>
      </div>
      <!-- 分割线 -->
      <div class="separate" v-show="isSingleFlashSaleGoods"></div>
      <!-- 特约认证 -->
      <!-- <div class="special-authen-container" v-show="isSpecialCard && isSpecialGoods" @click="showAuthenPop">
        <div class="special-authen">
          <div class="special-authen-text">
            <span class="special-authen-icon"></span>
            <span class="special-authen-desc">特约认证</span>
            <p>认证店铺后在原佣金基础上<i>再累加返佣{{ specialCard.one_discount }}%</i></p>
          </div>
          <div class="special-authen-arrow"></div>
        </div>
        <div class="separate"></div>
      </div> -->
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
        <div class="goods-details-introduce">
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
            <div class="shop-entry" @click="goShop(shopDetail.seller_id)">
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
        <base-no-more message="已经到底了"></base-no-more>
      </div>
    </base-scroll>
    <!-- 限时抢购页脚 -->
    <div class="footer-container" v-if="isFlashSale && !outTime">
      <div class="footer-left">
        <div class="footer-consult" @click="showBottomMenuTab">
          <span class="footer-consult-icon"></span>
          <span class="footer-left-text">咨询</span>
        </div>
        <div class="footer-seperate"></div>
        <!-- <div class="footer-collect">
          <span class="footer-collect-icon"></span>
          <span class="footer-left-text">收藏</span>
        </div>
        <div class="footer-seperate"></div> -->
        <!-- <div class="footer-shop" @click="goShop(shopDetail.seller_id)"> -->
        <div class="footer-shop" @click="goQuotation">
          <span class="footer-shop-icon"></span>
          <span class="footer-left-text">购物车</span>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-right-message">
          <div class="footer-right-icon">
            <span class="flash-icon"></span>
          </div>
          <div class="footer-right-seperate"></div>
          <div class="footer-right-message-text">
            <h2>
              ￥<span>{{ flashSalePrice.init }}</span>.{{ flashSalePrice.zero }}
            </h2>
            <p class="count-down-bottom">
              <span class="hours">{{ countTime.hours }}</span>:
              <span class="minutes">{{ countTime.minutes }}</span>:
              <span class="seconds">{{ countTime.seconds }}</span>
            </p>
          </div>
        </div>
        <div class="footer-right-quotation"  @click="addGoods">
          <span class="footer-quotation-icon"></span>
          <h2>加入购物车</h2>
        </div>
      </div>
      <!-- 导航 tab -->
      <div class="nav-menu-wrapper">
        <base-nav-list
          ref="bottomNav"
          :serviceMobile="shopDetail.service_mobile"
          :include="['lineQuery','concat']"
          :is-show-top-arrow="false"
          :is-show-bottom-arrow="true">
        </base-nav-list>
      </div>
    </div>
    <!-- 限时抢购 - 加入购物车弹窗 -->
    <base-popup-transition
      v-if="isFlashSale && !outTime"
      ref="popup">
      <div class="add-goods-wrapper">
        <div class="goods-description-price padding-30">
          <div class="goods-price-description bd-b">
            <div class="goods-price-pic">
              <!-- <img src="./images/logo.png" alt=""> -->
              <img :src="mainPic" alt="">
            </div>
            <div class="goods-price-body">
              <h1>
                <span class="title-icon flash-sale">限时抢</span>
                <span class="goods-title">{{ goodsDetail.title }}</span>
              </h1>
              <div>
                <p>
                  ¥<span>{{ flashSalePrice.init }}</span>.{{ flashSalePrice.zero }}
                </p>
              </div>
            </div>
            <div class="goods-price-icon" @click="closePriceList"></div>
          </div>
          <div class="goods-lists">
            <ul>
              <li class="goods-item bd-b">
                <div class="goods-item-left">
                  <!-- <h2 class="goods-item-name">{{ goodsDetail.product_code }}</h2> -->
                  <h2 class="goods-item-name">{{ singleFlashSaleSpecfication }}</h2>
                  <h2 class="goods-item-price">¥{{ goodsDetail.max_price }}</h2>
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
        <div class="goods-total-price">
          <div class="goods-price padding-30">
            <p class="total-price">
              共<span>{{ goodsDetail.number }}</span>个
              <span>￥{{ singleGoodsPirce }}</span>
              <!-- <span>（限购{{ goodsDetail.sell_number }}{{ goodsDetail.unit }}）</span> -->
              <span>（限购{{ flashSaleMaxNumber }}{{ goodsDetail.unit }}）</span>
            </p>
            <p class="total-commission">
              <span class="commission-flash-icon"></span>
              <span>省：</span>
              <span>￥{{ flashSaleSavedMon }}</span>
            </p>
          </div>
          <button class="add-button" @click="addGoodsToCart">确定</button>
        </div>
      </div>
    </base-popup-transition>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--                公共模块                 -->
    <!--  -->
    <!--  -->
    <!-- 限时抢购分享弹窗 -->
    <base-popup-share
      ref="share"
      :price='totalCommission'
      :isFlashSale='isFlashSale'
      @share='share'
      @shareUrl='shareUrl'
      v-if="!outTime">
    </base-popup-share>
    <!-- 普通/爆款商品分享弹窗 -->
    <transition name="fade">
      <div class="share-popup-container" v-show="shareGoodsPopup">
        <div class="share-popup-wrapper">
          <span class="share-close" @click='shareGoodsPopup = false'></span>
          <h2>分享赚佣金</h2>
          <h1>
            <span class="commission-text">分享预计可赚取佣金</span>
            <span class="commission-price">￥{{ totalCommission }}</span>
          </h1>
          <p class="commission-introduce">
            <span>佣金规则：</span>分享商品，家装业主购买后即可获得此佣金，佣金根据购买数量累计，佣金可提现。
          </p>
          <base-share
            class="share-body"
            :types="[2, 3, 4]"
            @share="shareGoods">
          </base-share>
          <div class="share-seperate"></div>
          <p class="buyer-price-text">家装业主购买价格</p>
          <p class="buyer-price">¥{{ goodsDetail.promotion_price }}</p>
        </div>
      </div>
    </transition>
    <!-- 特约认证弹窗 -->
    <base-popup-authen
      ref="authen"
      @goAuthen='goAuthen(shopDetail.seller_id)'
      :authenInfo='(authenInfo && authenInfo.audit_status) || 0'
      :discount='specialCard.one_discount'
      :cardDescription='specialCard.explain'
      :isCommonGoods='isCommonGoods'
      v-if="!outTime">
    </base-popup-authen>
    <!-- 过期页面 -->
    <div class="out-time-container" v-if="outTime">
      <div class="out-time-back">
        <span class="out-time-arrow" @click="goBack"></span>
        <i class="out-time-title">商品详情</i>
      </div>
      <img src="./images/out-time.png" alt="">
      <h2>商品已过期不存在</h2>
    </div>
    <!-- 已下架页面 -->
    <div class="invoked-goods-wrapper ipone-x-absolute-bottom" v-if="!outTime && isInvoked">
      <p>商品已下架</p>
    </div>
    <!-- 限时商品购买完，但是存在暂未付款的弹窗 -->
    <div class="invoked-goods-wrapper active ipone-x-absolute-bottom" v-if="!outTime && isNoPay">
      <p>有人已拍下，若30分钟后仍未付款，您将有购买机会</p>
    </div>
    <!-- 价格以及佣金解释说明弹窗 -->
    <div
      class="explain-price-popup-container"
      :class="{'share-iponer-x': isOpenByShare, 'is-ipone': isPone, 'is-iponex': $isX}"
      v-show="isShowExplainPopup">
      <div class="explain-price-popup-wrapper">
        <div class="popup-header">
          <span class="clound-left"></span>
          <span class="header-bg"></span>
          <span class="clound-right"></span>
          <span class="header-text" v-show="currentPopupIndex === 0">商品价格说明</span>
          <span class="header-text" v-show="currentPopupIndex === 1">佣金计算规则</span>
        </div>
        <div class="popup-body">
          <swiper
            :show-dots='false'
            v-model="currentPopupIndex">
            <swiper-item>
              <div class="body-title">
                商品的价格有“零售标价”，“零售底价”和“直采价”三种形式。
              </div>
              <div class="body-item">
                <h2>【零售标价】</h2>
                <p>是商品的出厂指导价格；</p>
              </div>
              <div class="body-item">
                <h2>【零售底价】</h2>
                <p>您分享商品或报价单时可见，此价格为家装业主所见及购买价格；</p>
              </div>
              <div class="body-item">
                <h2>【直采价】</h2>
                <p>是您专属的自购价格，自购价不参与返佣；</p>
              </div>
              <div class="body-item">
                <h2>【VIP直采价】</h2>
                <p>若商户设置特约认证，您已认证通过，可享受到的VIP自购价格，参与特约活动商品价格更优惠。</p>
              </div>
            </swiper-item>
            <swiper-item>
              <div class="commission-item-body">
                <div class="commission-item">
                  <span class="commission-item-icon"></span>
                  <p>详情页展示的佣金金额为一个计量单位所获得的佣金金额；</p>
                </div>
                <div class="commission-item">
                  <span class="commission-item-icon"></span>
                  <p>您分享商品给家装业主，购买后订单完成即可获得此佣金，您赚取的佣金可提现；</p>
                </div>
                <div class="commission-item">
                  <span class="commission-item-icon"></span>
                  <p>佣金根据购买数量累计，最终以实际计算结果为准（小秘诀！！分享特约认证的商品佣金赚更多哦）。</p>
                </div>
              </div>
            </swiper-item>
          </swiper>
        </div>
        <div class="popup-footer">
          <span :class="{active: currentPopupIndex === 0}" @click="switchExplainPricePopup(0)"></span>
          <span :class="{active: currentPopupIndex === 1}" @click="switchExplainPricePopup(1)"></span>
        </div>
        <div class="popup-left-arrow" v-show="currentPopupIndex === 1" @click="switchExplainPricePopup(0)"></div>
        <div class="popup-right-arrow" v-show="currentPopupIndex === 0" @click="switchExplainPricePopup(1)"></div>
        <div class="popup-close-icon" v-show="currentPopupIndex === 1" @click="ToggleExplainPricePopup(false)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseNavList from 'components/nav-list'
import BaseScroll from 'components/scroll/scroll'
import BaseComment from 'components/comment'
import BaseInputNumber from 'components/input/input-number'
import BasePopupTransition from 'components/popup/popup-transition'
import BasePopupAuthen from 'components/popup/popup-authen'
import BasePopupShare from 'components/popup/popup-share'
import BaseNoMore from 'components/no-more/no-more'
import BaseShare from 'components/share'
import { navMixins, wxMixins } from 'mixins'
import { mapState } from 'vuex'
import { splitMoney, judgeObjectLen, toRawType, retainTwoDecimal, countDown, smallPic } from 'common'
import { invokeNativeMethod, closeWebview } from 'native'
import { Swiper, SwiperItem, Tab, TabItem } from 'vux'
const setInterval = window.setInterval
// 城市 id
const CITYID = window.sessionStorage.getItem('opCity')
/**
 * 轮播图数据组装
 * {Array} list
 */
const assembleBannerList = function assembleBannerList (list) {
  let arr = []
  list.forEach(item => {
    let obj = Object.create(null)
    obj.url = 'javascript:'
    obj.img = item
    obj.title = ''
    arr.push(obj)
  })
  return arr
}

/**
 * 区间报价数组组装
 * @param {Array} list
 */
const assembleInterList = function assembleInterList (list) {
  list.forEach(item => {
    item['info']['commonPrice'] = splitMoney(item['info']['price'])
    item['info']['purchasePrice'] = splitMoney(item['info']['purchase_price'])
    item['info']['svipPrice'] = splitMoney(item['info']['svip_purchase_price'])
    item['info']['commissionPrice'] = splitMoney(item['info']['Commission_price'])
    item['info']['svipCommissionPrice'] = splitMoney(item['info']['svip_Commission_price'])
    item['info']['promotionPrice'] = splitMoney(item['info']['promotion_price'])
  })
}
const spliceContent = function (data) {
  let str = ''
  data.forEach(item => {
    str += item.info.spec_value + '；'
  })
  return str.substr(0, str.length - 1)
}
const singleGoodsAttr = {
  goods_id: null,
  goods_num: null,
  goods_name: null,
  seller_id: null,
  spec_key: null
}
export default {
  mixins: [navMixins, wxMixins],
  data () {
    return {
      bannerList: [],
      commentList: [],
      commentTotalNums: 0,
      goodsDetail: {},
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
      commissionIntroduce1: false,
      commissionIntroduce2: false,
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
      // 价格和佣金弹窗模块
      currentPopupIndex: 0,
      isShowExplainPopup: false,
      // 普通/爆款商品分享弹窗
      shareGoodsPopup: false,
      // im聊天名字
      imName: ''
    }
  },
  computed: {
    ...mapState(['showUnreadMessage']),
    picIndex () {
      return this.currentIndex + 1
    },
    goodsId () {
      return this.$route.query.goodsId
    },
    // 是否是通过分享页面打开
    isOpenByShare () {
      return !!this.$route.query.isShare
    },
    shareId () {
      return this.$route.query.shareId
    },
    // 是否是原生跳转过来的
    isNative () {
      return this.$route.query.isNative
    },
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
      if (this.authenInfo && this.authenInfo.audit_status === 2) {
        return true
      }
      return false
    },
    // 是否展示 svip 价以及以 svip 价进行计算
    showSvipPrice () {
      return this.isSpecialCard && this.isSpecialGoods && this.authened
    },
    // 未认证
    unAuthen () {
      return (this.authenInfo && this.authenInfo.audit_status === 0) || (this.authenInfo && this.authenInfo.audit_status === 3)
    },
    // 是否下架
    isInvoked () {
      return this.goodsDetail.sale === '已下架' || this.goodsDetail.is_delete === 3
    },
    // 是否商品已被人购买完，但是有未付款的情况
    isNoPay () {
      return this.isFlashSale && this.goodsDetail.sell_has_nopay === 1
    },
    // 是否是区间报价
    intervalPrice () {
      return !this.isFlashSale && this.goodsDetail.price_type === '区间报价'
    },
    // 是否是单一规格报价 - 1
    singleSpecPrice1 () {
      return !this.isFlashSale && !this.intervalPrice && this.isArray && (this.goodsDetail.is_var_spec === 0)
    },
    // 是否是单一规格报价 - 2
    singleSpecPrice2 () {
      return !this.isFlashSale && !this.intervalPrice && !this.isArray && (this.goodsDetail.is_var_spec === 0)
    },
    // 是否是多规格报价 - 3
    multipSpecPrice () {
      // 限时抢购当前默认无多规格，但是不排除运营后台误操作，导致在多规格限时抢购商品详情的时候该判断成立，在加入购物车的时候出现问题
      return !this.isFlashSale && !this.intervalPrice && !this.isArray && this.goodsDetail.is_var_spec
    },
    // 是否是单一规格区间报价 - 1
    singleIntervelPirce () {
      return this.intervalPrice && !this.isArray && !this.goodsDetail.is_var_spec
    },
    // 是否是多规格区间报价 - 2
    multipIntervelPirce () {
      return this.intervalPrice && !this.isArray && this.goodsDetail.is_var_spec
    },
    // 特约采购师 - 是否设置报价的 起 字
    showPriceIntervalOne () {
      return parseFloat(this.goodsDetail.max_purchase_price) > parseFloat(this.goodsDetail.purchase_price)
    },
    // svip - 是否设置报价的 起 字
    showPriceIntervalTwo () {
      return parseFloat(this.goodsDetail.svip_max_purchase_price) > parseFloat(this.goodsDetail.svip_purchase_price)
    },
    // 分享 - 设置报价的 起 字
    showPriceIntervalThree () {
      return parseFloat(this.goodsDetail.max_promotion_price) > parseFloat(this.goodsDetail.promotion_price)
    },
    // 是否是爆款商品
    isHotGoods () {
      return judgeObjectLen(this.hotEndTime) !== 0
    },
    // 是否是限时抢购商品
    isFlashSale () {
      return judgeObjectLen(this.flashEndTime) !== 0
    },
    // 是否是普通商品
    isCommonGoods () {
      return !this.isHotGoods && !this.isFlashSale
    },
    // 是否是数组
    isArray () {
      return toRawType(this.goodsDetail.price_level) === 'Array'
    },
    // 派生区间报价的数量区间
    numsInterval () {
      if (this.intervalPrice) {
        return this.goodsDetail.price_level.int_price.map(item => {
          return item.info.purchase_amount
        })
      }
      return null
    },
    // 派生区间报价的数量与价格对应的区间
    priceInterval () {
      if (this.numsInterval) {
        let obj = {}
        this.goodsDetail.price_level.int_price.forEach((item, index) => {
          obj[this.numsInterval[index]] = item.info
        })
        return obj
      }
      return null
    },
    // 单一规格商品以及单一区间数量统计
    singleGoodsAttr () {
      singleGoodsAttr.goods_id = this.goodsDetail.id
      singleGoodsAttr.goods_num = this.goodsDetail.number
      singleGoodsAttr.goods_name = this.goodsDetail.title
      singleGoodsAttr.seller_id = this.goodsDetail.seller_id
      // 如果是限时抢购单一规格的商品，预取第一个商品的 spec_key
      if (this.isSingleFlashSaleGoods) {
        singleGoodsAttr.spec_key = this.goodsDetail.sell_spec_level.spec_price[0].info.spec_key
      } else {
        singleGoodsAttr.spec_key = this.goodsDetail.spec_key || ''
      }
      return singleGoodsAttr
    },
    // 单一规格以及单一区间价格统计
    singleGoodsPirce () {
      // 单一区间报价价格统计
      if (this.singleIntervelPirce) {
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
      // 单一规格报价价格统计
      if (this.singleSpecPrice1) {
        if (this.showSvipPrice) {
          return retainTwoDecimal(this.goodsDetail.svip_purchase_price * this.goodsDetail.number)
        }
        return retainTwoDecimal(this.goodsDetail.purchase_price * this.goodsDetail.number)
      }
      if (this.isFlashSale) {
        return retainTwoDecimal(this.goodsDetail.sell_price * this.goodsDetail.number)
      }
      return 0
    },
    // 多规格以及多区间报价
    multiGoodsAttr () {
      if (this.goodsDetail.price_level && this.goodsDetail.price_level.spec_price) {
        let arr = this.goodsDetail.price_level.spec_price.map(item => {
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
      if (this.multiGoodsAttr.length) {
        let total = 0
        this.multiGoodsAttr.forEach(item => {
          total += item.number
        })
        return total
      }
      return 0
    },
    // 多规格以及多区间价格统计
    multipGoodsPrice () {
      let total = 0
      // 多区间价格统计
      if (this.multipIntervelPirce) {
        let [min, center, max] = this.numsInterval
        let priceInterval = this.priceInterval
        // 认证 svip 价
        if (this.showSvipPrice) {
          this.multiGoodsAttr.forEach(item => {
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
        this.multiGoodsAttr.forEach(item => {
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
      if (this.singleSpecPrice2 || this.multipSpecPrice) {
        // 认证 svip 价
        if (this.showSvipPrice) {
          this.multiGoodsAttr.forEach(item => {
            total += item.number * item.svip_purchase_price
          })
          return retainTwoDecimal(total)
        }
        // 未认证 采购价
        this.multiGoodsAttr.forEach(item => {
          total += item.number * item.purchase_price
        })
        return retainTwoDecimal(total)
      }
      return 0
    },
    // 多规格以及多区间派生加入购物车数据
    addGoodsCart () {
      let arr = []
      // eslint-disable-next-line
      this.multiGoodsAttr.forEach(item => {
        let obj = {}
        obj.goods_id = item.goods_id
        obj.goods_num = item.number
        obj.goods_name = item.spec_value
        obj.seller_id = item.seller_id
        obj.spec_key = item.spec_key
        arr.push(obj)
      })
      return arr
    },
    // 佣金金额统计
    totalCommission () {
      // 未加入商品，则区间采用最小佣金，其他采用最大佣金
      if (this.singleGoodsAttr.goods_num || this.multiGoodsNum) {
        let total = 0
        // 单一规格报价 - 1 佣金计算
        if (this.singleSpecPrice1) {
          let commission = this.goodsDetail.Commission_price
          let svipCommission = this.goodsDetail.svip_Commission_price
          if (this.showSvipPrice) {
            total = retainTwoDecimal(this.singleGoodsAttr.goods_num * svipCommission)
            return total
          }
          total = retainTwoDecimal(this.singleGoodsAttr.goods_num * commission)
          return total
        }
        // 单一规格报价以及多规格 - 2 佣金计算
        if (this.singleSpecPrice2 || this.multipSpecPrice) {
          if (this.showSvipPrice) {
            this.multiGoodsAttr.forEach(item => {
              total += item.number * item.svip_Commission_price
            })
            return retainTwoDecimal(total)
          }
          this.multiGoodsAttr.forEach(item => {
            total += item.number * item.Commission_price
          })
          return retainTwoDecimal(total)
        }
        // 单一规格区间报价 - 3 佣金计算
        if (this.singleIntervelPirce) {
          // 还需要判断 center max 是否有值
          let [min, center, max] = this.numsInterval
          let priceInterval = this.priceInterval
          let number = this.singleGoodsAttr.goods_num
          // svip 佣金
          if (this.showSvipPrice) {
            if (number < center || !center) {
              return retainTwoDecimal(priceInterval[min].svip_Commission_price * number)
            }
            if (number >= center && (number < max || !max)) {
              return retainTwoDecimal(priceInterval[center].svip_Commission_price * number)
            }
            return retainTwoDecimal(priceInterval[max].svip_Commission_price * number)
          }
          // 未认证 佣金
          if (number < center || !center) {
            return retainTwoDecimal(priceInterval[min].Commission_price * number)
          }
          if (number >= center && (number < max || !max)) {
            return retainTwoDecimal(priceInterval[center].Commission_price * number)
          }
          return retainTwoDecimal(priceInterval[max].Commission_price * number)
        }
        // 多规格区间报价 - 4 佣金计算
        if (this.multipIntervelPirce) {
          let [min, center, max] = this.numsInterval
          let priceInterval = this.priceInterval
          // 认证 svip 价
          if (this.showSvipPrice) {
            this.multiGoodsAttr.forEach(item => {
              if (item.number < center || !center) {
                total += priceInterval[min].svip_Commission_price * item.number
              } else if (item.number >= center && (item.number < max || !max)) {
                total += priceInterval[center].svip_Commission_price * item.number
              } else {
                total += priceInterval[max].svip_Commission_price * item.number
              }
            })
            return retainTwoDecimal(total)
          }
          // 未认证 采购价
          this.multiGoodsAttr.forEach(item => {
            if (item.number < center || !center) {
              total += priceInterval[min].Commission_price * item.number
            } else if (item.number >= center && (item.number < max || !max)) {
              total += priceInterval[center].Commission_price * item.number
            } else {
              total += priceInterval[max].Commission_price * item.number
            }
          })
          return retainTwoDecimal(total)
        }
        return retainTwoDecimal(total)
      }
      // 如果认证，未添加商品，则展示 svip 佣金 ---> 后台统一判断了，统一用 max_Commission_price 字段表示未加入时候的佣金
      // if (this.showSvipPrice) {
      //   return retainTwoDecimal(this.goodsDetail.svip_Commission_price)
      // }
      // （否则展示普通佣金） ---> 修改 max_Commission_price 统一表示区间最小佣金以及其他规格最大佣金
      return retainTwoDecimal(this.goodsDetail.max_Commission_price)
    },
    // 佣金金额分割
    commissionInitAndZero () {
      return splitMoney(this.totalCommission)
    },
    // 加入购物车时，佣金展示规则 --> 未加入显示 0，加入显示佣金金额
    quotationCommission () {
      if (((this.singleSpecPrice1 || this.singleIntervelPirce) && !this.singleGoodsAttr.goods_num) ||
      ((this.singleSpecPrice2 || this.multipSpecPrice || this.multipIntervelPirce) && !this.multiGoodsNum)) {
        return '0.00'
      }
      return this.totalCommission
    },
    // 是否是无规格的限时抢购商品，默认是 true
    isNoSpecFlashSaleGoods () {
      if (this.isFlashSale) {
        return this.goodsDetail.is_var_spec === 0 && this.goodsDetail.sell_is_spec === 0
      }
      return false
    },
    // 是否是单一规格限时抢购商品，默认为 true
    isSingleFlashSaleGoods () {
      if (this.isFlashSale) {
        return this.goodsDetail.is_var_spec === 0 && this.goodsDetail.sell_is_spec === 1
      }
      return false
    },
    // 限时抢购商品的规格
    singleFlashSaleSpecfication () {
      if (this.isNoSpecFlashSaleGoods) {
        return '默认'
      }
      if (this.isSingleFlashSaleGoods) {
        return this.goodsDetail.sell_spec_level.spec[0]
      }
      return '默认'
    },
    // 限时抢购价
    flashSalePrice () {
      if (this.isFlashSale) {
        return splitMoney(this.goodsDetail.sell_price)
      }
      return 0
    },
    // 限时抢购节省金额
    flashSaleSavedMon () {
      if (this.isFlashSale) {
        return retainTwoDecimal((this.goodsDetail.max_price - this.goodsDetail.sell_price) * this.goodsDetail.number)
      }
      return 0
    },
    // 限时抢购最大购买数量
    flashSaleMaxNumber () {
      /* eslint-disable */
      let { sell_number, sell_cart_number, sell_order_number, sell_stock } = this.goodsDetail
      let diff = sell_number - sell_cart_number - sell_order_number
      return diff > sell_stock ? sell_stock : diff
      /* eslint-enable */
    },
    // 导航背景透明度
    backgroundColor () {
      return {
        backgroundColor: `rgba(255, 255, 255, ${this.opacity})`
      }
    }
  },
  created () {
    this.getGoodsDetail()
  },
  methods: {
    // 强制浏览器重排，修复商品描述区域显示不全bug
    justifyContentHeight () {
      if (!this.beforeScroll) return
      let dom = this.$refs.container
      dom.style.height = dom.scrollHeight + 1 + 'px'
      this.beforeScroll = false
    },
    // 商品详情
    getGoodsDetail () {
      let isOpenByShare = this.isOpenByShare
      let url = isOpenByShare ? 'nologin/particulars' : 'goods/particulars'
      let obj = {
        id: this.goodsId,
        shareId: this.shareId
      }
      if (!isOpenByShare) delete obj.shareId
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          // eslint-disable-next-line
          let { city_id, name } = res.data.city
          // eslint-disable-next-line
          if (Number(CITYID) !== city_id) {
            this.$t(`该商品所属地为${name}`, 'middle')
          }
          const tempObj = res.data.goods
          // 商品是否过期
          this.outTime = tempObj.is_delete === 1 || tempObj.is_delete === 2 || res.data.shop.status === 3
          if (this.outTime) {
            invokeNativeMethod('setTitle', '商品已过期')
            return
          }
          // eslint-disable-next-line
          const reg = new RegExp(/\<div class="tab-detail active"(.|\n)+\<\/div\>/)
          this.commentList = res.data.comment.data || []
          this.commentTotalNums = res.data.comment.total
          tempObj.content.replace(reg, c => {
            this.goodsContent = c
          })
          this.goodsStock = tempObj.orginal_stock
          this.bannerList = assembleBannerList(tempObj.image)
          this.mainPic = tempObj.image[0]
          this.hotEndTime = res.data.hot
          this.flashEndTime = res.data.sale
          this.shopDetail = res.data.shop
          this.specialCard = res.data.shop.special_card
          this.authenInfo = res.data.user
          this.imName = res.data.im_name
          this.specification = tempObj.price_level && tempObj.price_level.spec_price && spliceContent(tempObj.price_level.spec_price)
          // 排除限时抢购报价
          let isFlashSale = judgeObjectLen(res.data.sale) !== 0
          if (!isFlashSale) {
            // 数据转换
            if (tempObj.price_type === '区间报价') {
              assembleInterList(tempObj.price_level.int_price)
            } else if (tempObj.price_type === '规格报价' && toRawType(tempObj.price_level) === 'Object') {
              this.multipartSpec = Object.keys(tempObj.price_level.spec)
              assembleInterList(tempObj.price_level.spec_price)
              if (tempObj.is_var_spec) {
                // 解决多规格渲染的时候 tab 组件行为表现不一致的问题
                let assembleList = []
                this.multipartSpec.forEach((specification, index) => {
                  let arr = []
                  tempObj.price_level.spec_price.forEach(item => {
                    if (specification === item.specval_pre) {
                      arr.push(item)
                    }
                  })
                  assembleList.push(arr)
                })
                tempObj.price_level.assembleList = assembleList
              }
            }
            // 最低采购价
            let priceOne = splitMoney(tempObj.purchase_price)
            tempObj.purchaseInit = priceOne.init
            tempObj.purchaseZero = priceOne.zero
            // 最高采购价
            let priceTwo = splitMoney(tempObj.max_purchase_price)
            tempObj.MaxPurchaseInit = priceTwo.init
            tempObj.MaxPurchaseZero = priceTwo.zero
            // 未认证佣金
            // tempObj.commission = splitMoney(tempObj.Commission_price)
            // svip 佣金
            tempObj.svipCommission = splitMoney(tempObj.svip_Commission_price)
            // 区间报价最低佣金、其他报价最高佣金
            tempObj.maxCommission = splitMoney(tempObj.max_Commission_price)
            // 最低 svip 价
            let priceFour = splitMoney(tempObj.svip_purchase_price)
            tempObj.svipInit = priceFour.init
            tempObj.svipZero = priceFour.zero
            // 最高 svip 价
            let priceFive = splitMoney(tempObj.svip_max_purchase_price)
            tempObj.MaxSvipInit = priceFive.init
            tempObj.MaxSvipZero = priceFive.zero
            // 推荐价 ---> 用于分享展示 promotion_price
            let promotionPrice = splitMoney(tempObj.promotion_price)
            tempObj.promotionPriceInit = promotionPrice.init
            tempObj.promotionPriceZero = promotionPrice.zero
            // 推荐价 ---> 用于分享展示 max_promotion_price
            let maxPromotionPrice = splitMoney(tempObj.max_promotion_price)
            tempObj.maxPromotionPriceInit = maxPromotionPrice.init
            tempObj.maxPromotionPriceZero = maxPromotionPrice.zero
          } else {
            this.getServerTime().then(t => {
              this.countDownTime(t)
            })
          }
          this.goodsDetail = tempObj
          if (isOpenByShare) {
            let obj = {
              title: res.data.shop.shop_name,
              desc: tempObj.title,
              imgUrl: smallPic(tempObj.image[0], 200, 200)
            }
            this.wxShare(obj)
          }
        } else if (res.code === 400) {
          this.outTime = true
        }
      })
    },
    // 添加商品到报价单
    addGoodsToCart () {
      let singleGoodsNum = this.singleGoodsAttr.goods_num
      let isFlashSale = this.isFlashSale
      let goodsDetail = this.goodsDetail
      let unit = goodsDetail.unit
      // 限时抢购超出数量判断及提示
      // if (goodsDetail.sell_cart_number >= goodsDetail.sell_number) {
      if (goodsDetail.sell_cart_number >= goodsDetail.sell_number - goodsDetail.sell_order_number) {
        // this.$t(`限购${goodsDetail.sell_number}${unit}`)
        this.$t(`限购${goodsDetail.sell_number - goodsDetail.sell_order_number}${unit}`)
        return
      }
      if (((this.singleSpecPrice1 || this.singleIntervelPirce || isFlashSale) && !singleGoodsNum) ||
          ((this.singleSpecPrice2 || this.multipSpecPrice || this.multipIntervelPirce) && !this.addGoodsCart.length)) {
        this.$t('请选择要添加的商品')
        return
      }
      // 区间报价判断数量是否达到最小起订量
      let minQuantity = goodsDetail.minimum_quantity
      if ((this.singleIntervelPirce && singleGoodsNum < minQuantity) ||
        (this.multipIntervelPirce && this.multiGoodsNum < minQuantity)) {
        this.$t(`起批量至少${minQuantity}${unit}`)
        return
      }
      let goodsInfo = []
      if (this.singleSpecPrice1 || this.singleIntervelPirce || isFlashSale) {
        goodsInfo.push(this.singleGoodsAttr)
      } else {
        goodsInfo = this.addGoodsCart
      }
      goodsInfo = JSON.stringify(goodsInfo)
      let url = 'cart/addCart'
      let obj = {
        goodsInfo
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.closePriceList()
          this.$t('加入成功')
          // 限时抢购商品更新能加入的最大数量
          if (isFlashSale) {
            this.flashSaleTotalNum += singleGoodsNum
            goodsDetail.sell_cart_number += this.flashSaleTotalNum
            if (goodsDetail.sell_cart_number >= goodsDetail.sell_number - goodsDetail.sell_order_number) goodsDetail.sell_cart_number = goodsDetail.sell_number - goodsDetail.sell_order_number
            // this.flashSaleTotalNum += singleGoodsNum
            // goodsDetail.sell_cart_number += this.flashSaleTotalNum
            // if (goodsDetail.sell_cart_number >= goodsDetail.sell_number) goodsDetail.sell_cart_number = goodsDetail.sell_number
          }
          return
        }
        this.$t(res.message)
      })
    },
    // 弹出报价单弹窗
    addGoods () {
      if (this.isInvoked || this.isNoPay) return
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.popup.show()
    },
    // 关闭添加报价单弹窗
    closePriceList () {
      this.$refs.popup.hide()
    },
    // 店铺认证弹窗
    showAuthenPop () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.authen.show()
    },
    // 特约认证
    goAuthen (shopId) {
      let url = 'adv/buyerShopAuth'
      let obj = {
        seller_id: shopId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.authenInfo.audit_status = res.data.audit_status
          this.$refs.authen.hide()
          this.$t('认证已提交，等待商家审核', 'middle')
        }
      })
    },
    // 店铺详情
    goShop (id) {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$router.push({name: 'ShopDetail', query: { id, fromGoodsDetail: 1 }})
    },
    // 报价单
    goQuotation () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$router.push('/quotation')
      // invokeNativeMethod('nativeGoHomeNormalTab', 2)
    },
    // 顶部导航回退
    goBack () {
      if (this.isNative) {
        closeWebview()
        return
      }
      this.$router.back()
    },
    // 顶部导航菜单
    showTopMenuTab () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.topNav.show()
    },
    // 底部导航菜单
    showBottomMenuTab () {
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      this.$refs.bottomNav.show()
      // this.isShowBottomMenuTab = !this.isShowBottomMenuTab
    },
    // 魔窗页面
    goDownLoad () {
      this.$router.push('/app')
    },
    // 分享弹窗
    showSharePop () {
      if (this.isInvoked) return
      if (this.isOpenByShare) {
        this.goDownLoad()
        return
      }
      // 限时抢购商品拉起弹窗
      if (this.isFlashSale) {
        this.showSharePopup()
        return
      }
      // 普通/爆款商品拉起弹窗
      this.shareGoodsPopup = true
    },
    // 限时抢购 - 微信&朋友圈&QQ
    share (payload) {
      this.handleShareInfo(payload)
      this.$refs.share.hide()
    },
    // 限时抢购 - 分享链接
    shareUrl (payload) {
      this.handleShareInfo(payload)
      this.$refs.share.hide()
    },
    // 普通/爆款商品分享
    shareGoods (payload) {
      this.handleShareInfo(payload)
      this.shareGoodsPopup = false
    },
    // 分享数据处理
    handleShareInfo (payload) {
      if (payload === 2) {
        let url = location.href + '&isShare=1'
        invokeNativeMethod('copyToClipboard', url)
        return
      }
      let obj = {}
      obj.type = payload
      obj.url = location.href + '&isShare=1'
      obj.title = this.shopDetail.shop_name
      obj.discriable = this.goodsDetail.title
      obj.imgUrl = smallPic(this.mainPic, 200, 200)
      obj.from = 1
      obj.goodsId = this.goodsDetail.id
      invokeNativeMethod('share', JSON.stringify(obj))
    },
    scrollToElement (i) {
      this.scrollIndex = i
      let dom = `scrollEle${i}`
      this.$refs.scroll.scrollToElement(this.$refs[dom], 300, false, true)
    },
    // 价格以及佣金弹窗展示与隐藏
    ToggleExplainPricePopup (t) {
      this.isShowExplainPopup = t
    },
    // 价格以及拥挤弹窗切换
    switchExplainPricePopup (i) {
      this.currentPopupIndex = i
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
    }
  },
  // 销毁定时器
  beforeDestroy () {
    if (this.timerId) clearInterval(this.timerId)
  },
  components: {
    BaseScroll,
    BaseComment,
    BaseInputNumber,
    BasePopupTransition,
    BasePopupShare,
    BasePopupAuthen,
    BaseNoMore,
    BaseShare,
    BaseNavList,
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
