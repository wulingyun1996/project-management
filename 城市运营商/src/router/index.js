import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = (file) => () => import(`@/views/${file}`)

const HOME = _import('home')

/**
* hidden: true                   若路由记录中提供该项，则该项不会在侧边栏显示
* redirect: noredirect           提供该项，在面包屑导航中不会定位
* name:'router-name'             路由名称，每个路由记录需要设置，但暂时不考虑用作组件缓存上
* meta : {                       路由元信息，每项需要提供
    title: 'title'               该项会在面包屑中展示
    icon: 'svg-name'             在侧边栏中设置的 icon 类型，可参考 src/icon 文件夹
  }
**/

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      hidden: true,
      component: _import('login')
    },
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      hidden: true,
      component: _import('forget-password')
    },
    {
      path: '/',
      name: 'Login',
      component: HOME,
      redirect: '/login',
      hidden: true,
      children: [
        {
          path: 'dashboard',
          component: _import('dash-board')
        }
      ]
    },
    {
      path: '',
      name: 'UserAccount',
      redirect: 'noredirect',
      hidden: true,
      component: HOME,
      meta: {
        title: '账户信息',
        icon: ''
      },
      children: [
        {
          path: 'modify-password',
          name: 'ModifyPassword',
          component: _import('manage-user-info/modify-password'),
          meta: {
            title: '修改密码',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-business',
      name: 'ManageBusiness',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '商户管理',
        icon: ''
      },
      children: [
        {
          path: 'register-business',
          name: 'register-business',
          component: _import('manage-business/register-business'),
          meta: {
            title: '注册商户',
            icon: ''
          }
        },
        {
          path: 'alliance-manage',
          name: 'AllianceManage',
          component: _import('manage-business/manage-alliance'),
          meta: {
            title: '商圈管理',
            icon: ''
          }
        },
        {
          path: 'set-up-circle',
          name: 'SetUpCircle',
          hidden: true,
          component: _import('manage-business/set-up-circle'),
          meta: {
            title: '新建',
            icon: ''
          }
        },
        {
          path: 'manage-alliance-shop',
          name: 'ManageAllianceShop',
          hidden: true,
          component: _import('manage-business/manage-alliance-shop'),
          meta: {
            title: '圈内商家',
            icon: ''
          }
        },
        {
          path: 'shop-manage',
          name: 'ShopManage',
          component: _import('manage-business/manage-shop'),
          meta: {
            title: '商家管理',
            icon: ''
          }
        },
        {
          path: 'payment-flow',
          name: 'PaymentFlow',
          component: _import('manage-business/payment-flow'),
          meta: {
            title: '商家付费流水统计',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-alliance',
      name: 'ManageAlliance',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '联盟活动管理',
        icon: ''
      },
      children: [
        {
          path: 'alliance-activity',
          name: 'alliance-activity',
          hidden: true,
          component: _import('manage-alliance'),
          meta: {
            title: '联盟活动',
            icon: ''
          }
        },
        {
          path: 'alliance-activity',
          name: 'alliance-activity',
          component: _import('manage-alliance'),
          meta: {
            title: '联盟活动',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-order',
      name: 'ManageOrder',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '订单管理',
        icon: ''
      },
      children: [
        {
          path: 'manage-order-detail',
          name: 'ManageOrderDetail',
          hidden: true,
          component: _import('manage-order'),
          meta: {
            title: '订单列表',
            icon: ''
          }
        },
        {
          path: 'manage-order-detail',
          name: 'ManageOrderDetail',
          component: _import('manage-order'),
          meta: {
            title: '订单列表',
            icon: ''
          }
        },
        {
          path: 'order-Details',
          name: 'orderDetails',
          hidden: true,
          component: _import('manage-order/order-Details'),
          meta: {
            title: '订单详情',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-goods',
      name: 'ManageGoods',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '商品管理',
        icon: ''
      },
      children: [
        {
          path: 'manage-goods-detail',
          name: 'ManageGoodsDetail',
          hidden: true,
          component: _import('manage-goods'),
          meta: {
            title: '商品列表',
            icon: ''
          }
        },
        {
          path: 'manage-goods-detail',
          name: 'ManageGoodsDetail',
          component: _import('manage-goods'),
          meta: {
            title: '商品列表',
            icon: ''
          }
        },
        {
          path: 'manage-goods-detail/goods-detail',
          name: 'GoodsDetail',
          hidden: true,
          component: _import('manage-goods/goods-detail'),
          meta: {
            title: '商品详情',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-market',
      name: 'ManageMarket',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '营销管理',
        icon: ''
      },
      children: [
        {
          path: 'index-banner',
          name: 'IndexBanner',
          component: _import('manage-market/index-banner'),
          meta: {
            title: '首页广告轮播',
            icon: ''
          }
        },
        {
          path: 'index-banner-add',
          name: 'IndexBannerAdd',
          hidden: true,
          component: _import('manage-market/index-banner-add'),
          meta: {
            title: '新增广告',
            icon: ''
          }
        },
        {
          path: 'index-banner-edit',
          name: 'IndexBannerEdit',
          hidden: true,
          component: _import('manage-market/index-banner-edit'),
          meta: {
            title: '编辑广告',
            icon: ''
          }
        },
        {
          path: 'hot-activity',
          name: 'HotActivity',
          component: _import('manage-market/hot-activity'),
          meta: {
            title: '热门活动',
            icon: ''
          }
        },
        {
          path: 'hot-advertising',
          name: 'HotAdvertising',
          hidden: true,
          component: _import('manage-market/hot-advertising'),
          meta: {
            title: '广告位',
            icon: ''
          }
        },
        {
          path: 'hot-activity-details',
          name: 'HotActivityDetails',
          hidden: true,
          component: _import('manage-market/hot-activity-details'),
          meta: {
            title: '查看详情',
            icon: ''
          }
        },
        {
          path: 'hot-business',
          name: 'HotBusiness',
          component: _import('manage-market/hot-business'),
          meta: {
            title: '热门商家',
            icon: ''
          }
        },
        {
          path: 'hot-business-compile',
          name: 'HotBusinessCompile',
          hidden: true,
          component: _import('manage-market/hot-business-compile'),
          meta: {
            title: '商户信息编辑',
            icon: ''
          }
        },
        {
          path: 'add-business-compile',
          name: 'AddBusinessCompile',
          hidden: true,
          component: _import('manage-market/add-business-compile'),
          meta: {
            title: '商户信息编辑',
            icon: ''
          }
        },
        {
          path: 'recommended-advertising',
          name: 'RecommendedAdvertising',
          hidden: true,
          component: _import('manage-market/recommended-advertising'),
          meta: {
            title: '广告位',
            icon: ''
          }
        },
        {
          path: 'under-line-vips',
          name: 'UnderLineVips',
          hidden: true,
          component: _import('manage-market/under-line-vips'),
          meta: {
            title: '线下会员店',
            icon: ''
          }
        },
        {
          path: 'edit-advertising',
          name: 'EditAdvertising',
          hidden: true,
          component: _import('manage-market/edit-advertising'),
          meta: {
            title: '广告位编辑',
            icon: ''
          }
        },
        {
          path: 'edit-advertisingInof',
          name: 'EditAdvertisingInfo',
          hidden: true,
          component: _import('manage-market/edit-advertisingInof'),
          meta: {
            title: '广告位编辑',
            icon: ''
          }
        },
        {
          path: 'hot-alliance',
          name: 'HotAlliance',
          component: _import('manage-market/hot-alliance/hot-alliance'),
          meta: {
            title: '热门商圈',
            icon: ''
          }
        },
        {
          path: 'hot-alliance-add',
          name: 'HotAllianceAdd',
          component: _import('manage-market/hot-alliance/hot-alliance-add'),
          hidden: true,
          meta: {
            title: '新增'
          }
        },
        {
          path: 'flash-sale',
          name: 'FlashSale',
          component: _import('manage-market/flash-sale'),
          meta: {
            title: '限时抢购',
            icon: ''
          }
        },
        {
          path: 'flash-statistics',
          name: 'FlashStatistics',
          hidden: true,
          component: _import('manage-market/flash-sale/flash-statistics'),
          meta: {
            title: '活动统计',
            icon: ''
          }
        },
        {
          path: 'flash-details',
          name: 'FlashDetails',
          hidden: true,
          component: _import('manage-market/flash-sale/flash-details'),
          meta: {
            title: '抢购详情页',
            icon: ''
          }
        },
        {
          path: 'flash-add',
          name: 'FlashAdd',
          hidden: true,
          component: _import('manage-market/flash-sale/flash-add'),
          meta: {
            title: '新增抢购',
            icon: ''
          }
        },
        {
          path: 'flash-compile',
          name: 'FlashCompile',
          hidden: true,
          component: _import('manage-market/flash-sale/flash-compile'),
          meta: {
            title: '编辑详情',
            icon: ''
          }
        },
        {
          path: 'hot-goods',
          name: 'HotGoods',
          component: _import('manage-market/hot-goods'),
          meta: {
            title: '爆款商品',
            icon: ''
          }
        },
        {
          path: 'hot-goods-edit',
          name: 'EditHotGoods',
          hidden: true,
          component: _import('manage-market/hot-goods-edit'),
          meta: {
            title: '编辑商品',
            icon: ''
          }
        },
        {
          path: 'hot-goods-add',
          name: 'AddHotGoods',
          hidden: true,
          component: _import('manage-market/hot-goods-add'),
          meta: {
            title: '添加商品',
            icon: ''
          }
        },
        {
          path: 'hot-goods-banner-add',
          name: 'HotGoodsBannerAdd',
          hidden: true,
          component: _import('manage-market/hot-goods-banner-add'),
          meta: {
            title: '新增广告',
            icon: ''
          }
        },
        {
          path: 'hot-goods-banner-edit',
          name: 'HotGoodsBannerEdit',
          hidden: true,
          component: _import('manage-market/hot-goods-banner-edit'),
          meta: {
            title: '编辑广告',
            icon: ''
          }
        },
        {
          path: 'hot-goods-banner',
          name: 'HotGoodsBanner',
          hidden: true,
          component: _import('manage-market/hot-goods-banner'),
          meta: {
            title: '广告图',
            icon: ''
          }
        },
        {
          path: 'hot-good-banner-edit',
          name: 'HotGoodsBannerEditter',
          hidden: true,
          component: _import('manage-market/hot-good-banner-edit'),
          meta: {
            title: '编辑',
            icon: ''
          }
        },
        // {
        //   path: 'engineering-price',
        //   name: 'EngineeringPrice',
        //   component: _import('manage-market/engineering-price'),
        //   meta: {
        //     title: '工程比价',
        //     icon: ''
        //   }
        // },
        {
          path: 'market-announcement',
          name: 'MarketAnnouncement',
          component: _import('manage-market/market-announcement'),
          meta: {
            title: '营销公告',
            icon: ''
          }
        },
        {
          path: 'add-materials',
          name: 'AddMaterials',
          hidden: true,
          component: _import('manage-market/add-materials'),
          meta: {
            title: '添加材料馆广告图',
            icon: ''
          }
        },
        {
          path: 'materials-details',
          name: 'MaterialsDetails',
          hidden: true,
          component: _import('manage-market/materials-details'),
          meta: {
            title: '编辑材料馆广告图',
            icon: ''
          }
        },
        {
          path: 'material-libary-list',
          name: 'materialLibaryList',
          component: _import('manage-market/material-libary-list'),
          meta: {
            title: '材料馆广告图',
            icon: ''
          }
        },
        {
          path: 'recommend-goods',
          name: 'recommendGoods',
          component: _import('manage-market/recommend-goods'),
          meta: {
            title: '推荐商品',
            icon: ''
          }
        },
        {
          path: 'recommend-goods-add',
          name: 'recommendGoodsAdd',
          component: _import('manage-market/recommend-goods-add'),
          hidden: true,
          meta: {
            title: '添加商品',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-statistics',
      name: 'ManageStatistics',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '数据统计',
        icon: ''
      },
      children: [
        // {
        //   path: 'channel-statistics',
        //   name: 'ChannelStatistics',
        //   hidden: true,
        //   component: _import('manage-statistics/channel-statistics'),
        //   meta: {
        //     title: '渠道推广',
        //     icon: ''
        //   }
        // },
        {
          path: 'channel-statistics',
          name: 'ChannelStatistics',
          component: _import('manage-statistics/channel-statistics'),
          meta: {
            title: '采购师渠道推广',
            icon: ''
          }
        },
        {
          path: 'merchant-statistics',
          name: 'MerchantStatistics',
          component: _import('manage-statistics/merchant-statistics'),
          meta: {
            title: '商家速卖渠道推广',
            icon: ''
          }
        },
        {
          path: 'channel-statistics-detaile',
          name: 'ChannelStatisticsDetaile',
          hidden: true,
          component: _import('manage-statistics/channel-statistics-detaile'),
          meta: {
            title: '采购师渠道推广详情页',
            icon: ''
          }
        },
        {
          path: 'merchant-statistics-detail',
          name: 'MerchantStatisticsDetail',
          hidden: true,
          component: _import('manage-statistics/merchant-statistics-detail'),
          meta: {
            title: '商家速卖渠道推广详情页',
            icon: ''
          }
        }
      ]
    },
    {
      path: '/manage-materials',
      name: 'ManageMaterials',
      redirect: 'noredirect',
      component: HOME,
      meta: {
        title: '材料馆管理',
        icon: ''
      },
      children: [
        {
          path: 'manage-material',
          name: 'manageMaterial',
          component: _import('manage-business/manage-material'),
          meta: {
            title: '材料馆账号',
            icon: ''
          }
        },
        {
          path: 'materials-code',
          name: 'MaterialsCode',
          hidden: true,
          component: _import('manage-materials/materials-code'),
          meta: {
            title: '材料馆二维码',
            icon: ''
          }
        },
        {
          path: 'materials-code',
          name: 'MaterialsCode',
          component: _import('manage-materials/materials-code'),
          meta: {
            title: '材料馆二维码',
            icon: ''
          }
        },
        {
          path: 'demo',
          name: 'Demo',
          component: _import('manage-materials/demo'),
          hidden: true,
          meta: {
            title: '新增',
            icon: ''
          }
        },
        {
          path: 'add-materials-code',
          name: 'AddMaterialsCode',
          component: _import('manage-materials/add-materials-code'),
          hidden: true,
          meta: {
            title: '新增',
            icon: ''
          }
        }
      ]
    }
  ]
})

export default router
