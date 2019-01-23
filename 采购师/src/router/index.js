import Vue from 'vue'
import Router from 'vue-router'
import { nativeBack } from 'native'

/* eslint-disable */
const { NODE_ENV, IS_TEST_ENV, VERSION } = process.env

const isProd = NODE_ENV === 'production'

const isLoadVersion = isProd && VERSION !== 'static'

const base = (!isProd || !isLoadVersion) ? '/' : `/${VERSION}/`

const rediectedPage = !isProd ? 'home' : (isProd && IS_TEST_ENV ? 'home' : '404')
/* eslint-enable */

/**
 * 路由元信息中配置项说明
 * title: 当前路由的名称，必须提供
 * level: 用于组件缓存，列表页面视情况添加 level：2，
 * y: 用于记录当前页面的滚动位置，用于 scroll 组件的定位
 * z: 用于是否隐藏当前页面的头部，默认是全部显示，如果想要隐藏，需要提供 z: 1，现新增 H5 头部均需要提供 z: 1
 * isHiddenBottomTab: 用于隐藏原生底部的 tab 栏
 */
Vue.use(Router)
const _import = (file) => () => import(`views/${file}`)
const router = new Router({
  mode: 'history',
  base,
  routes: [
    {
      path: '/',
      redirect: () => {
        return rediectedPage
      }
    },
    {
      path: '/404',
      name: '404',
      component: _import('404'),
      meta: {
        title: '页面未找到'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: _import('demo')
    },
    {
      path: '/home',
      name: 'Home',
      component: _import('home/home'),
      meta: {
        level: 1
      }
    },
    {
      path: '/download',
      name: 'DownLoad',
      component: _import('download/download'),
      meta: {
        title: '建材商家速卖'
      }
    },
    {
      path: '/app',
      name: 'App',
      component: _import('download/app'),
      meta: {
        title: '建材采购师'
      }
    },
    {
      path: '/channel-statistics',
      name: 'ChannelStatistics',
      component: _import('download/channel-statistics'),
      meta: {
        title: '建材采购师'
      }
    },
    {
      path: '/seller-download',
      name: 'SellerDownload',
      component: _import('download/seller-download'),
      meta: {
      }
    },
    {
      path: '/want-to-buy',
      name: 'WantToBuy',
      component: _import('want-to-buy'),
      meta: {
        y: 0,
        title: '求购'
      }
    },
    {
      path: '/enginee-cooperation',
      name: 'EngineeCooperation',
      component: _import('want-to-buy/enginee-cooperation'),
      meta: {
        title: '发布工程合作'
      },
      children: [
        {
          path: 'role-explain',
          name: 'RoleExplain',
          component: _import('want-to-buy/role-explain'),
          meta: {
            title: '求购规则说明'
          }
        }
      ]
    },
    {
      path: '/want-to-buy-goods',
      name: 'WantToBuyGoods',
      component: _import('want-to-buy/want-to-buy-goods'),
      meta: {
        title: '发布商品求购'
      },
      children: [
        {
          path: 'role-explain',
          name: 'RoleExplain',
          component: _import('want-to-buy/role-explain'),
          meta: {
            title: '求购规则说明'
          }
        }
      ]
    },
    {
      path: '/flash-sale',
      name: 'FlashSale',
      component: _import('flash-sale'),
      meta: {
        y: 0,
        title: '限时抢购',
        level: 2,
        z: 1
      }
    },
    {
      path: '/hot-goods',
      name: 'HotGoods',
      component: _import('hot-goods'),
      meta: {
        y: 0,
        title: '爆款商品',
        level: 2,
        z: 1
      }
    },
    {
      path: '/goods-detail',
      name: 'GoodsDetail',
      component: _import('goods-detail'),
      meta: {
        z: 1,
        title: '商品详情',
        level: 6
      }
    },
    {
      path: '/recommen-shop',
      name: 'RecommenShop',
      component: _import('recommen-shop'),
      meta: {
        y: 0,
        title: '优选好店',
        level: 2,
        z: 1
      }
    },
    {
      path: '/identity-select',
      name: 'IdentitySelect',
      component: _import('identity-select'),
      meta: {
        title: '选择身份'
      },
      children: [
        {
          path: 'explain-identity',
          name: 'ExplainIdentity',
          component: _import('identity-select/explain-identity'),
          meta: {
            title: '身份说明'
          }
        }
      ]
    },
    {
      path: '/old-user-authen',
      name: 'OldUserAuthen',
      component: _import('identity-select/old-user-authen'),
      meta: {
        title: '选择身份',
        z: 1
      },
      children: [
        {
          path: 'explain-identity',
          name: 'OldUserExplainIdentity',
          component: _import('identity-select/old-authen-explain-identity'),
          meta: {
            title: '身份说明'
          }
        }
      ]
    },
    {
      path: '/authen-type',
      name: 'AuthenType',
      component: _import('identity-select/authen-type'),
      meta: {
        title: '身份认证'
      }
    },
    {
      path: '/authen-answer',
      name: 'AuthenAnswer',
      component: _import('identity-select/authen-answer'),
      meta: {
        title: '答题认证'
      }
    },
    {
      path: '/auditing',
      name: 'Auditing',
      component: _import('identity-select/auditing'),
      meta: {
        title: '认证消息'
      }
    },
    {
      path: '/help',
      name: 'HelpList',
      component: _import('help-feedback/help-list'),
      meta: {
        y: 0,
        title: '帮助与反馈'
      },
      children: [
        {
          path: 'help-detail',
          name: 'HelpDetail',
          component: _import('help-feedback/help-detail'),
          meta: {
            title: '帮助详情'
          }
        }
      ]
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: _import('help-feedback/feedback'),
      meta: {
        y: 0,
        title: '意见反馈'
      }
    },
    {
      path: '/register-boot-page',
      name: 'RegisterBootPage',
      component: _import('boot-page/register-boot-page'),
      meta: {
        z: 1,
        title: '未注册引导页',
        level: 2
      }
    },
    {
      path: '/guide-page',
      name: 'GuidePage',
      component: _import('boot-page/guide-page')
    },
    {
      path: '/register',
      component: _import('register')
    },
    {
      path: '/custom-boot-page',
      name: 'CustomBootPage',
      component: _import('boot-page/custom-boot-page'),
      meta: {
        title: '会员权益'
      }
    },
    {
      path: '/business-boot-page',
      name: 'BusinessBootPage',
      component: _import('boot-page/business-boot-page'),
      meta: {
        title: '商户权益',
        level: 3
      }
    },
    {
      path: '/cppb-boot-page',
      name: 'CppbBootPage',
      component: _import('boot-page/cppb-boot-page'),
      meta: {
        title: '采购师权益'
      }
    },
    {
      path: '/shop-apply',
      name: 'shopApply',
      component: _import('boot-page/shop-apply'),
      meta: {
        title: '我要开店',
        hidden: 1
      },
      children: [
        {
          path: 'apply-detail',
          component: _import('topspeed-set-shop/apply-detail'),
          meta: {
            title: '审核开店说明',
            z: 1
          }
        },
        {
          path: 'topspeed-detail',
          component: _import('topspeed-set-shop/topspeed-detail'),
          meta: {
            title: '极速开店说明',
            z: 1
          }
        }
      ]
    },
    {
      path: '/down-lode',
      component: _import('boot-page/down-lode'),
      meta: {
        hidden: 1
      }
    },
    {
      path: '/shop-auditing',
      name: 'ShopAuditing',
      component: _import('boot-page/shop-auditing'),
      meta: {
        title: '审核开店',
        hidden: 1
      }
    },
    {
      path: '/topspeed-set-shop',
      component: _import('topspeed-set-shop/topspeed-set-shop'),
      meta: {
        title: '极速开店',
        z: 1
      }
    },
    {
      path: '/shop-success',
      name: 'shopSuccess',
      component: _import('boot-page/shop-success'),
      meta: {
        title: '开店成功',
        z: 1
      }
    },
    {
      path: '/quotation-list',
      name: 'QuotationList',
      component: _import('quotation/quotation-list'),
      meta: {
        z: 1,
        title: '报价单列表'
      },
      children: [
        {
          path: 'quotation-explain',
          name: 'QuotationExplain',
          component: _import('quotation/quotation-explain'),
          meta: {
            title: '报价单解读'
          }
        }
      ]
    },
    {
      path: '/shop-auth',
      name: 'ShopAuth',
      component: _import('shop-auth'),
      meta: {
        title: '商家认证优惠'
      }
    },
    {
      path: '/unionActivities',
      name: 'unionActivities',
      component: _import('activities/union-activities'),
      meta: {
        title: '联盟活动'
      }
    },
    {
      path: '/hotActivities',
      name: 'hotActivities',
      component: _import('activities/hot-activities'),
      meta: {
        title: '热门活动'
      }
    },
    {
      path: '/signupPay',
      name: 'signupPay',
      component: _import('activities/signup-pay'),
      meta: {
        title: '活动报名'
      }
    },
    {
      path: '/signupInfo',
      name: 'signupInfo',
      component: _import('activities/signup-info'),
      meta: {
        title: '填写报名信息'
      }
    },
    {
      path: '/signupSucc',
      name: 'signupSucc',
      component: _import('activities/signup-success'),
      meta: {
        title: '报名成功'
      }
    },
    {
      path: '/unionDetail',
      name: 'unionDetail',
      component: _import('activities/union-detail'),
      meta: {
        title: '活动详情'
      }
    },
    {
      path: '/hot-circle',
      name: 'HotCircle',
      component: _import('business-circle/hot-circle'),
      meta: {
        title: '热门商圈',
        z: 1,
        level: 2
      }
    },
    {
      path: '/circle-detail',
      name: 'CircleDetail',
      component: _import('business-circle/circle-detail'),
      meta: {
        title: '商圈详情',
        z: 1,
        level: 2
      }
    },
    {
      path: '/circle-search',
      name: 'CircleSearch',
      component: _import('business-circle/circle-search'),
      meta: {
        title: '商圈店铺搜索',
        z: 1
      }
    },
    {
      path: '/circle-search-list',
      name: 'CircleSearchList',
      component: _import('business-circle/circle-search-list'),
      meta: {
        title: '商圈店铺搜索页',
        z: 1,
        level: 2
      }
    },
    {
      path: '/circle-activity',
      name: 'CircleActivity',
      component: _import('business-circle/circle-activity'),
      meta: {
        title: '商圈活动',
        z: 1
      }
    },
    {
      path: '/quotation',
      name: 'Quotation',
      component: _import('quotation/quotation'),
      meta: {
        z: 1,
        isHiddenBottomTab: true,
        title: '报价单'
      }
    },
    {
      path: '/make-quotation',
      name: 'MakeQuotation',
      component: _import('quotation/make-quotation'),
      meta: {
        z: 1,
        title: '制作报价单'
      }
    },
    {
      path: '/edit-quotation',
      name: 'EditQuotation',
      component: _import('quotation/edit-quotation'),
      meta: {
        z: 1,
        title: '制作报价单'
      }
    },
    {
      path: '/quotation-del',
      name: 'QuotationDel',
      component: _import('quotation/quotation-del'),
      meta: {
        z: 1,
        title: '删除报价单'
      }
    },
    {
      path: '/add-quotation',
      name: 'AddQuotation',
      component: _import('quotation/add-quotation'),
      meta: {
        z: 1,
        title: '添加报价单商品'
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: _import('quotation/commit-order'),
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/want-buy-detail',
      name: 'WantBuyDetail',
      component: _import('want-to-buy/want-buy-detail'),
      meta: {
        z: 1
      }
    },
    {
      path: '/answer',
      name: 'Answer',
      component: _import('want-to-buy/answer'),
      meta: {
        title: '我来回答'
      }
    },
    {
      path: '/report',
      name: 'Report',
      component: _import('want-to-buy/report'),
      meta: {
        title: '匿名举报'
      }
    },
    {
      path: '/relate-goods',
      name: 'RelateGoods',
      component: _import('want-to-buy/relate-goods'),
      meta: {
        title: '关联商品'
      }
    },
    {
      path: '/report-success',
      name: 'ReportSuccess',
      component: _import('want-to-buy/report-success'),
      meta: {
        title: '举报成功'
      }
    },
    {
      path: '/honey',
      name: 'Honey',
      component: _import('honey'),
      meta: {
        level: 1
      }
    },
    {
      path: '/my-honey',
      name: 'MyHoney',
      component: _import('honey-manage/my-honey'),
      meta: {
        z: 1,
        title: '',
        level: 2,
        y: 0
      }
    },
    {
      path: '/shop-details',
      name: 'ShopDetails',
      component: _import('honey-manage/shop-details'),
      meta: {
        z: 1,
        title: '商品详情'
      }
    },
    {
      path: '/select-address',
      name: 'SelectAddress',
      component: _import('honey-manage/select-address'),
      meta: {
        z: 1,
        title: '选择数量及地址'
      }
    },
    {
      path: '/exchange-success',
      name: 'ExchangeSuccess',
      component: _import('honey-manage/exchange-success'),
      meta: {
        z: 1,
        title: '兑换成功'
      }
    },
    {
      path: '/honey-rule',
      name: 'HoneyRule',
      component: _import('honey-manage/honey-rule'),
      meta: {
        z: 1,
        title: '蜂蜜规则'
      }
    },
    {
      path: '/honey-details',
      name: 'HoneyDetails',
      component: _import('honey-details'),
      meta: {
        z: 1,
        title: '蜂蜜明细'
      },
      children: [
        {
          path: 'honey-rule',
          component: _import('honey-manage/honey-rule'),
          meta: {
            z: 1,
            title: '蜂蜜规则'
          }
        }
      ]
    },
    {
      path: '/exchange-record',
      name: 'exchangeRecord',
      component: _import('exchange-record/exchange-record'),
      meta: {
        z: 1,
        title: '兑换记录',
        level: 2
      }
    },
    {
      path: '/announcement-detail',
      name: 'AnnouncementDetail',
      component: _import('market-announcement/announcement-detail'),
      meta: {
        z: 1,
        title: ''
      }
    },
    {
      path: '/alliance',
      name: 'Alliance',
      component: _import('alliance'),
      meta: {
        z: 1,
        title: '',
        level: 1
      }
    },
    {
      path: '/my-activity',
      name: 'MyActivity',
      component: _import('alliance/my-activity'),
      meta: {
        title: '我的活动',
        z: 1,
        level: 2
      }
    },
    {
      path: '/alliance-activity-statistics',
      name: 'AllianceActivityStatistics',
      component: _import('alliance/alliance-activity-statistics'),
      meta: {
        z: 1,
        title: '活动推广统计',
        level: 3
      }
    },
    {
      path: '/alliance-statistics-detail',
      name: 'AllianceStatisticsDetail',
      component: _import('alliance/alliance-statistics-detail'),
      meta: {
        z: 1,
        title: '',
        level: 4
      }
    },
    {
      path: '/banner-detail',
      name: 'BannerDetail',
      component: _import('banner-detail'),
      meta: {
        z: 1,
        title: '',
        level: 1
      }
    },
    {
      path: '/shop-search',
      name: 'ShopSearch',
      component: _import('shop-search/index'),
      meta: {
        title: '店铺搜索',
        z: 1
      }
    },
    {
      path: '/shop-list',
      name: 'ShopList',
      component: _import('shop-search/shop-list'),
      meta: {
        z: 1,
        title: '店铺列表',
        level: 2
      }
    },
    {
      path: '/search-shop-list',
      name: 'SearchShopList',
      component: _import('shop-search/search-shop-list'),
      meta: {
        z: 1,
        title: '搜索列表页',
        level: 2
      }
    },
    {
      path: '/my-card',
      name: 'myCard',
      component: _import('card/my-card'),
      meta: {
        z: 1,
        title: '我的名片'
      }
    },
    {
      path: '/shop-detail',
      name: 'ShopDetail',
      component: _import('shop-manage/shop-detail'),
      meta: {
        z: 1,
        title: '店铺详情',
        level: 3
      },
      children: [
        {
          path: 'shop-goods-search',
          name: 'ShopGoodsSearch',
          component: _import('shop-manage/goods-search'),
          meta: {
            z: 1,
            title: ''
          },
          children: [
            {
              path: 'shop-goods-search-result',
              name: 'ShopGoodsSearchResult',
              component: _import('shop-manage/shop-goods-search-result'),
              meta: {
                z: 1,
                title: ''
              }
            }
          ]
        }
      ]
    },
    {
      path: '/scan-code-list',
      name: 'ScanCodeList',
      component: _import('scan-code-list/index'),
      meta: {
        z: 1,
        level: 2
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  /* eslint-disable */
  // to.meta.z && to.meta.isHiddenBottomTab ?
  //                                 nativeBack(to.meta.title, 1, 1)
  //                                 :
  to.meta.z ?
  nativeBack(undefined, 1)
  :
  nativeBack(to.meta.title)
  /* eslint-enable */
  next()
})

export default router
