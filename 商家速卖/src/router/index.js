import Vue from 'vue'
import Router from 'vue-router'
import { nativeBackBase } from 'api/init'
import { invokeNativeMethod } from 'common/js/dev'
Vue.use(Router)
/* eslint-disable */
const { NODE_ENV, IS_TEST_ENV, VERSION } = process.env

const isProd = NODE_ENV === 'production'

const isLoadVersion = isProd && VERSION !== 'static'

const base = (!isProd || !isLoadVersion) ? '/' : `/${VERSION}/`

const rediectedPage = (!isProd ? 'home' : ((isProd && IS_TEST_ENV) ? 'home' : '404'))
/* eslint-enable */
const _import = (file) => () => import(`components/${file}`)

/**
 *  level 2 用于组件缓存，数量级越高，代表的路由嵌套越深
    start 1 用于 H5 头部返回判断，如果当前路由是从首页进来的，回退的时候就会关闭 webview,
    hidden: 1 用于隐藏原生的头部，默认是不隐藏
 */
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
      path: '/demo',
      component: _import('demo/index'),
      meta: {
        title: '测试页面'
      }
    },
    {
      path: '/404',
      component: _import('404/404')
    },
    {
      path: '/home',
      component: _import('home/home'),
      meta: {
        level: 1
      }
    },
    {
      path: '/set-shop',
      component: _import('set-shop/set-shop'),
      meta: {
        title: '店铺信息',
        hidden: 1
      }
    },
    {
      path: '/shop-manage',
      component: _import('shop-manage/index'),
      meta: {
        title: '商品管理',
        level: 3,
        hidden: 1
      }
    },
    // 商品详情页；
    {
      path: '/detail/:id',
      component: _import('good-detail/good-detail'),
      meta: {
        title: '商品详情',
        hidden: 1
      }
    },
    {
      path: '/old-detail/:id',
      component: _import('good-detail/old-good-detail'),
      meta: {
        title: '商品详情',
        hidden: 1
      }
    },
    {
      path: '/name-edit/:id',
      component: _import('set-shop/name-edit'),
      meta: {
        title: '店铺名称',
        hidden: 1
      }
    },
    {
      path: '/pic-manage',
      component: _import('set-shop/pic-manage'),
      meta: {
        title: '店铺背景管理',
        hidden: 1
      }
    },
    {
      path: '/publish-goods',
      name: 'PublishGoods',
      component: _import('publish-goods/publish-goods'),
      meta: {
        title: '发布商品',
        hidden: 1
      },
      children: [
        {
          path: 'create-goods-help',
          component: _import('publish-goods/create-goods-help'),
          meta: {
            title: '发布商品',
            hidden: 1
          }
        },
        {
          path: 'select-category',
          component: _import('publish-goods/select-category'),
          meta: {
            title: '选择类目',
            hidden: 1
          },
          children: [
            {
              path: '/create-category',
              name: 'CreateCategory',
              component: _import('select-category/create-category'),
              meta: {
                title: '类目需求',
                hidden: 1
              }
            }
          ]
        },
        {
          path: 'select-brand',
          component: _import('publish-goods/goods-brands'),
          meta: {
            title: '品牌',
            hidden: 1
          }
        },
        {
          path: 'select-specification-price',
          component: _import('publish-goods/specification-price'),
          meta: {
            title: '商品规格',
            hidden: 1
          }
        },
        {
          path: 'select-interval-price',
          component: _import('publish-goods/interval-price'),
          meta: {
            title: '区间报价',
            hidden: 1
          }
        }
      ]
    },
    // 发布商品
    {
      path: '/creat-goods',
      name: 'creat-goods',
      component: _import('publish-goods/edit-draft'),
      meta: {
        title: '发布商品',
        hidden: 1
      },
      children: [
        {
          path: 'create-goods-help',
          component: _import('publish-goods/create-goods-help'),
          meta: {
            title: '发布商品',
            hidden: 1
          }
        },
        {
          path: 'select-category',
          component: _import('publish-goods/select-category'),
          meta: {
            title: '选择类目',
            hidden: 1
          }
        },
        {
          path: 'select-brand',
          component: _import('publish-goods/goods-brands'),
          meta: {
            title: '品牌',
            hidden: 1
          }
        },
        {
          path: 'select-specification-price',
          component: _import('publish-goods/specification-price'),
          meta: {
            title: '商品规格',
            hidden: 1
          }
        },
        {
          path: 'select-interval-price',
          component: _import('publish-goods/interval-price'),
          meta: {
            title: '区间报价',
            hidden: 1
          }
        }
      ]
    },
    // 编辑草稿
    {
      path: '/edit-draft/:id',
      name: 'edit-draft',
      component: _import('publish-goods/edit-draft'),
      meta: {
        title: '编辑草稿',
        hidden: 1
      },
      children: [
        {
          path: 'select-category',
          component: _import('publish-goods/select-category'),
          meta: {
            title: '选择类目',
            hidden: 1
          }
        },
        {
          path: 'select-brand',
          component: _import('publish-goods/goods-brands'),
          meta: {
            title: '品牌',
            hidden: 1
          }
        },
        {
          path: 'select-specification-price',
          component: _import('publish-goods/specification-price'),
          meta: {
            title: '商品规格',
            hidden: 1
          }
        },
        {
          path: 'select-interval-price',
          component: _import('publish-goods/interval-price'),
          meta: {
            title: '区间报价',
            hidden: 1
          }
        }
      ]
    },
    // 编辑商品
    {
      path: '/edit-goods/:id',
      name: 'edit-goods',
      component: _import('publish-goods/edit-goods'),
      meta: {
        title: '编辑商品',
        hidden: 1
      },
      children: [
        {
          path: 'select-category',
          component: _import('publish-goods/select-category'),
          mete: {
            title: '编辑类目',
            hidden: 1
          }
        },
        {
          path: 'select-brand',
          component: _import('publish-goods/goods-brands'),
          mete: {
            title: '编辑品牌',
            hidden: 1
          }
        },
        {
          path: 'select-specification-price',
          component: _import('publish-goods/specification-price'),
          mete: {
            title: '编辑规格',
            hidden: 1
          }
        },
        {
          path: 'select-interval-price',
          component: _import('publish-goods/interval-price'),
          mete: {
            title: '编辑区间',
            hidden: 1
          }
        }
      ]
    },
    // 商品详情
    {
      path: '/good-detail/:id',
      component: _import('good-detail/good-detail'),
      meta: {
        title: '商品详情',
        hidden: 1
      }
    },
    // 订单列表
    {
      path: '/order-list',
      name: 'orderList',
      meta: {
        title: '订单管理',
        y: 0,
        page: 1,
        level: 2
      },
      component: _import('order-list/order-list')
    },
    // 订单详情
    {
      path: '/order-detail/:id',
      meta: {
        title: '订单详情'
      },
      component: _import('order-detail/order-detail')
    },
    // 修改价格
    {
      path: '/order-edit-price/:id',
      meta: {
        title: '修改价格'
      },
      component: _import('order-edit-price/index')
    },
    // 取消订单
    {
      path: '/order-cancel-order/:id',
      meta: {
        title: '取消订单'
      },
      component: _import('order-cancel-order/index')
    },
    // 查看物流
    {
      path: '/order-logistics-details/:id',
      meta: {
        title: '物流详情',
        x: 0,
        y: 0
      },
      component: _import('order-logistics-details/index')
    },
    // 发货
    {
      path: '/order-send-out/:id',
      meta: {
        title: '发货'
      },
      component: _import('order-send-out/index')
    },
    {
      path: '/phone-service',
      component: _import('phone-service/phone-service'),
      meta: {
        title: '电话客服'
      }
    },
    {
      path: '/comments',
      meta: {
        title: '评价管理',
        y: 0
      },
      component: _import('comments/index')
    },
    {
      path: '/main-product',
      component: _import('main-product/main-product'),
      meta: {
        title: '主营商品',
        hidden: 1
      }
    },
    {
      path: '/address',
      name: 'address',
      component: _import('address/address'),
      meta: {
        title: '经营地址'
      }
    },
    {
      path: '/brand',
      component: _import('brand/brand'),
      meta: {
        title: '品牌信息'
      }
    },
    {
      path: '/add-brand',
      component: _import('brand/add-brand'),
      meta: {
        title: '新增品牌'
      }
    },
    {
      path: '/check-brand/:id',
      component: _import('brand/check-brand'),
      meta: {
        title: '品牌信息'
      }
    },
    {
      path: '/edit-brand/:id',
      component: _import('brand/edit-brand'),
      meta: {
        title: '编辑品牌'
      }
    },
    {
      path: '/help-feedback',
      component: _import('help-feedback/help-feedback'),
      meta: {
        title: '帮助中心'
      }
    },
    {
      path: '/help-feedback/:id',
      component: _import('help-feedback/help-detail'),
      meta: {
        title: '查看帮助详情'
      }
    },
    {
      path: '/want-to-buy',
      component: _import('want-to-buy/want-to-buy'),
      meta: {
        title: '买卖速配',
        level: 2
      },
      children: [
        {
          path: 'buy-help',
          component: _import('want-to-buy/buy-help'),
          meta: {
            title: '买卖速配介绍'
          }
        }]
    },
    {
      path: '/want-to-buy/:id',
      component: _import('want-to-buy/buy-detail'),
      meta: {
        title: '求购详情页'
      }
    },
    {
      path: '/reply-he',
      component: _import('want-to-buy/reply-he')
    },
    {
      path: '/me-answer',
      component: _import('want-to-buy/me-answer'),
      meta: {
        title: '我来回答'
      }
    },
    {
      path: '/buy-detail/:id',
      component: _import('want-to-buy/buy-detail'),
      meta: {
        title: '求购详情页'
      }
    },
    {
      path: '/special-card',
      component: _import('special-card/special-card'),
      meta: {
        title: '特约采购师'
      }
    },
    // 特约采购师详情界面
    {
      path: '/special-card/:id',
      component: _import('approve-detail/approve-detail')
    },
    {
      path: '/approve-condition',
      component: _import('approve-condition/approve-condition'),
      meta: {
        title: '认证设置'
      }
    },
    {
      path: '/card-manage',
      component: _import('card-manage/card-manage'),
      meta: {
        title: '特约卡管理'
      }
    },
    {
      path: '/cardthree-condition',
      component: _import('card-condition/cardthree-condition'),
      meta: {
        title: '三级特约卡条件'
      }
    },
    {
      path: '/cardone-condition',
      component: _import('card-condition/cardone-condition'),
      meta: {
        title: '一级特约卡条件'
      }
    },
    {
      path: '/cardtwo-condition',
      component: _import('card-condition/cardtwo-condition'),
      meta: {
        title: '二级特约卡条件'
      }
    },
    {
      path: '/activity-product',
      component: _import('activity-product/activity-product'),
      meta: {
        title: '特约卡活动商品'
      }
    },
    {
      path: '/related-good',
      component: _import('want-to-buy/related-good'),
      meta: {
        title: '关联商品'
      }
    },
    {
      path: '/my-buy',
      component: _import('my-buy/my-buy'),
      meta: {
        title: '我关注的'
      }
    },
    {
      path: '/share',
      component: _import('share/share')
    },
    {
      path: '/share-buy',
      component: _import('share/share-buy'),
      meta: {
        title: '建材商家速卖'
      }
    },
    {
      path: '/channel-statistics',
      component: _import('share/channel-statistics'),
      meta: {
        title: '建材商家速卖'
      }
    },
    {
      path: '/set-telephone',
      component: _import('set-telephone/set-telephone'),
      meta: {
        title: '客服电话'
      }
    },
    {
      path: '/phone-service',
      component: _import('phone-service/phone-service'),
      meta: {
        title: '电话客服'
      }
    },
    {
      path: '/issue-product',
      component: _import('issue-product/issue-product'),
      name: 'IssueProduct',
      meta: {
        title: '发布商品'
      }
    },
    {
      path: '/issue-brand',
      component: _import('issue-brand/issue-brand'),
      meta: {
        title: '品牌'
      }
    },
    {
      path: '/quote-goods',
      component: _import('publish-goods/quote-goods'),
      meta: {
        title: '引用产品'
      }
    },
    {
      path: '/commodity-spec',
      component: _import('publish-goods/commodity-spec'),
      meta: {
        title: '商品规格'
      }
    },
    {
      path: '/interval-quotation',
      component: _import('publish-goods/interval-quotation'),
      meta: {
        title: '区间报价'
      }
    },
    {
      path: '/manager-management',
      name: 'ManagerManagement',
      component: _import('manager-management/manager-management'),
      meta: {
        title: '推广员管理',
        hidden: 1
      }
    },
    {
      path: '/add-manager',
      name: 'AddManager',
      component: _import('manager-management/add-manager'),
      meta: {
        title: '新增推广员'
      }
    },
    {
      path: '/shop-statistic',
      name: 'shop-statistic',
      component: _import('union-statistic/shop-statistic'),
      meta: {
        title: '店铺统计'
      }
    },
    {
      path: '/all-statistic',
      component: _import('union-statistic/all-statistic'),
      meta: {
        title: '店铺统计'
      },
      children: [
        {
          path: 'line-submit/:id',
          name: 'line-submit',
          component: _import('union-statistic/line-submit'),
          meta: {
            title: '线下录入'
          }
        },
        {
          path: 'data-count/:id',
          nmae: 'data-count',
          component: _import('union-statistic/data-count'),
          meta: {
            title: '提交资料数'
          }
        },
        {
          path: 'pay-count/:id',
          name: 'pay-count',
          component: _import('union-statistic/pay-count'),
          meta: {
            title: '活动支付数'
          }
        },
        {
          path: 'sign/:id',
          name: 'sign',
          component: _import('union-statistic/sign'),
          meta: {
            title: '签到成功'
          }
        },
        {
          path: 'sale-count/:id',
          name: 'sale-count',
          component: _import('union-statistic/sale-count'),
          meta: {
            title: '销售金额'
          }
        },
        {
          path: 'sale-count2/:id',
          name: 'sale-count2',
          component: _import('union-statistic/sale-count'),
          meta: {
            title: '定金金额'
          }
        }
      ]
    },
    {
      path: '/sales-statistic',
      name: 'sales-statistic',
      component: _import('union-statistic/salesman-statistic'),
      meta: {
        title: '推广统计'
      }
    },
    {
      path: '/platform-statistic',
      component: _import('union-statistic/platform-statistic'),
      meta: {
        title: '平台统计'
      }
    },
    {
      path: '/accounting',
      component: _import('accounting/accounting'),
      meta: {
        title: '活动记账'
      }
    },
    {
      path: '/accounting/:id',
      component: _import('accounting/add-account'),
      meta: {
        title: '活动记账',
        hasDone: false
      }
    },
    {
      path: '/check-in',
      component: _import('check-in/check-in'),
      meta: {
        title: '活动签到'
      }
    },
    {
      path: '/check-in/:id',
      component: _import('check-in/add-check'),
      meta: {
        title: '活动签到',
        hasDone: false
      }
    },
    {
      path: '/alliance',
      component: _import('alliance/index'),
      meta: {
        level: 1
      }
    },
    {
      path: '/alliance-apply',
      component: _import('alliance-apply/index'),
      meta: {
        title: '申请商圈',
        hidden: 1
      }
    },
    {
      path: '/shop-apply',
      component: _import('alliance-apply/shop-apply'),
      meta: {
        title: '申请开店',
        hidden: 1,
        level: 2
      },
      children: [
        {
          path: 'apply-detail',
          component: _import('topspeed-set-shop/apply-detail'),
          meta: {
            title: '审核开店说明',
            hidden: 1
          }
        },
        {
          path: 'topspeed-detail',
          component: _import('topspeed-set-shop/topspeed-detail'),
          meta: {
            title: '极速开店说明',
            hidden: 1
          }
        }
      ]
    },
    {
      path: '/topspeed-set-shop',
      component: _import('topspeed-set-shop/topspeed-set-shop'),
      meta: {
        title: '极速开店',
        hidden: 1
      }
    },
    {
      path: '/guidance-shop',
      name: 'guidanceShop',
      component: _import('topspeed-set-shop/guidance-shop'),
      meta: {
        title: '开通店铺',
        hidden: 1
      }
    },
    {
      path: '/shop-auditing',
      name: 'ShopAuditing',
      component: _import('alliance-apply/shop-auditing'),
      meta: {
        title: '审核开店',
        hidden: 1
      }
    },
    {
      path: '/shop-no-pass',
      component: _import('alliance-apply/shop-no-pass'),
      meta: {
        title: '审核未通过',
        hidden: 1
      }
    },
    {
      path: '/shop-closed',
      component: _import('alliance-apply/shop-closed'),
      meta: {
        title: '店铺关闭',
        hidden: 1
      }
    },
    {
      path: '/alliance-shop-list',
      component: _import('alliance-shop/alliance-list'),
      meta: {
        title: '圈内商家',
        x: 0,
        y: 0
      }
    },
    {
      path: '/shop-alliance-list',
      component: _import('alliance-shop/shop-list'),
      meta: {
        title: '联盟商圈',
        x: 0,
        y: 0,
        level: 2
      }
    },
    {
      path: '/alliance-shop-detail/:id',
      component: _import('alliance-shop/alliance-detail'),
      meta: {
        title: '圈内商家详情'
      }
    },
    {
      path: '/shop-to-alliance-list/:id',
      component: _import('alliance-shop/shop-to-alliance-list'),
      meta: {
        title: '圈内商家',
        x: 0,
        y: 0
      }
    },
    {
      path: '/alliance-detail/:id',
      component: _import('alliance-shop/shop-detail'),
      meta: {
        title: '商圈详情',
        level: 3
      }
    },
    {
      path: '/alliance-operation-guide',
      name: 'operationsGuide',
      component: _import('alliance-staff/alliance-operation-guide'),
      meta: {
        hidden: 1,
        title: '员工管理操作指南'
      }
    },
    {
      path: '/shop-operation-guide',
      name: 'ShopOperationGuide',
      component: _import('alliance-staff/shop-operation-guide'),
      meta: {
        hidden: 1,
        title: '员工管理操作指南'
      }
    },
    {
      path: '/alliance-add-staff',
      component: _import('alliance-staff/index'),
      name: 'AllianceAddStaff',
      meta: {
        hidden: 1,
        title: '新增员工账号'
      }
    },
    {
      path: '/shop-add-staff',
      component: _import('alliance-staff/index'),
      name: 'ShopAddStaff',
      meta: {
        hidden: 1,
        title: '新增员工账号'
      }
    },
    {
      path: '/alliance-staff-list',
      component: _import('alliance-staff/staff-list'),
      name: 'AllianceStaffList',
      meta: {
        x: 0,
        y: 0,
        hidden: 1,
        title: '员工管理'
      }
    },
    {
      path: '/alliance-staff-detail/:id',
      component: _import('alliance-staff/staff-detail'),
      name: 'AllianceStaffDetail',
      meta: {
        hidden: 1,
        title: '员工详情'
      }
    },
    {
      path: '/alliance-staff-edit/:id',
      component: _import('alliance-staff/staff-edit'),
      name: 'AllianceStaffEdit',
      meta: {
        hidden: 1,
        title: '编辑员工账号'
      }
    },
    {
      path: '/shop-staff-list',
      component: _import('alliance-staff/staff-list'),
      name: 'ShopStaffList',
      meta: {
        x: 0,
        y: 0,
        hidden: 1,
        title: '员工管理'
      }
    },
    {
      path: '/shop-staff-detail/:id',
      component: _import('alliance-staff/staff-detail'),
      name: 'ShopStaffDetail',
      meta: {
        hidden: 1,
        title: '员工详情'
      }
    },
    {
      path: '/shop-staff-edit/:id',
      component: _import('alliance-staff/staff-edit'),
      name: 'ShopStaffEdit',
      meta: {
        hidden: 1,
        title: '编辑员工账号'
      }
    },
    {
      path: '/alliance-base-info',
      component: _import('alliance-base-info/index'),
      meta: {
        hidden: 1,
        title: '商圈信息'
      }
    },
    {
      path: '/alliance-name/:id',
      component: _import('alliance-base-info/alliance-name'),
      meta: {
        hidden: 1,
        title: '商圈名称'
      }
    },
    {
      path: '/establish-activity',
      component: _import('establish-activity/index'),
      meta: {
        title: '建活动'
      }
    },
    {
      path: '/view-activity',
      name: 'ViewActivity',
      component: _import('establish-activity/view-activity'),
      meta: {
        title: '活动详情'
      }
    },
    {
      path: '/activity-list',
      component: _import('establish-activity/activity-list'),
      meta: {
        title: '活动管理'
      }
    },
    {
      path: '/shop-activity-list',
      name: 'ShopActivityList',
      component: _import('shop-activity/shop-activity-list'),
      meta: {
        title: '联盟活动',
        level: 2,
        hidden: 1
      }
    },
    {
      path: '/shop-activity-detail',
      name: 'ShopActivityDetail',
      component: _import('shop-activity/shop-activity-detail'),
      meta: {
        title: '活动详情',
        level: 3
      }
    },
    {
      path: '/alliance-activity-statistics',
      name: 'AllianceActivityStatistics',
      component: _import('alliance-statistics/alliance-activity-statistics'),
      meta: {
        hidden: 1,
        title: '活动统计',
        level: 2
      }
    },
    {
      path: '/alliance-statistics-detail',
      name: 'AllianceStatisticsDetail',
      component: _import('alliance-statistics/alliance-statistics-detail'),
      meta: {
        hidden: 1,
        title: '',
        level: 3
      }
    },
    {
      path: '/delegate-list',
      name: 'DelegateList',
      component: _import('alliance-statistics/delegate-list'),
      meta: {
        hidden: 1,
        title: '带单排行',
        level: 4
      }
    },
    {
      path: '/shop-activity-statistics',
      name: 'ShopActivityStatistics',
      component: _import('shop-statistics/shop-activity-statistics'),
      meta: {
        hidden: 1,
        title: '店铺统计',
        level: 2
      }
    },
    {
      path: '/shop-statistics-detail',
      name: 'ShopStatisticsDetail',
      component: _import('shop-statistics/shop-statistics-detail'),
      meta: {
        hidden: 1,
        title: '',
        level: 3
      }
    },
    {
      path: '/generalize-statistics',
      name: 'GeneralizeStatistics',
      component: _import('shop-statistics/generalize-statistics'),
      meta: {
        hidden: 1,
        title: '推广统计',
        level: 2
      }
    },
    {
      path: '/generalize-statistics-detail',
      name: 'GeneralizeStatisticsDetail',
      component: _import('shop-statistics/generalize-statistics-detail'),
      meta: {
        hidden: 1,
        title: '',
        level: 3
      }
    },
    {
      path: '/register',
      component: _import('register/index')
    },
    {
      path: '/card-router',
      name: 'CardRouter',
      component: _import('card-manage/card-router'),
      meta: {
        title: '特约认证管理'
      },
      children: [
        {
          path: 'card-identify',
          name: 'CardIdentify',
          component: _import('card-manage/card-identify'),
          meta: {
            title: '特约认证管理'
          }
        },
        {
          path: 'identify-info',
          name: 'IdentifyInfo',
          component: _import('card-manage/identify-info'),
          meta: {
            title: '特约认证编辑'
          }
        }
      ]
    },
    {
      path: '/identify-goods',
      name: 'IdentifyGoods',
      component: _import('card-manage/identify-goods'),
      meta: {
        title: '特约认证活动商品'
      }
    },
    {
      path: '/cgs-manage',
      name: 'CgsManage',
      component: _import('cgs-manage/cgs-manage'),
      meta: {
        title: '特约采购师管理',
        level: 2,
        hidden: 1
      }
    },
    {
      path: '/cgs-check',
      name: 'CgsCheck',
      component: _import('cgs-manage/cgs-check'),
      meta: {
        title: '待审核',
        hidden: 1
      }
    },
    {
      path: '/cgs-pass',
      component: _import('cgs-manage/cgs-pass'),
      meta: {
        title: '已通过',
        hidden: 1
      }
    },
    {
      path: '/cgs-unpass',
      component: _import('cgs-manage/cgs-nopass'),
      meta: {
        title: '未通过',
        hidden: 1
      }
    },
    {
      path: '/activity-enroll',
      component: _import('activity/activity-enroll'),
      meta: {
        title: '活动报名'
      }
    },
    // 特约活动管理
    {
      path: '/special-authen-manage',
      name: 'SepcialAuthenManage',
      component: _import('special-authen/special-authen-manage'),
      meta: {
        title: '特约认证',
        hidden: 1
      }
    },
    {
      path: '/authen-guide',
      name: 'AuthenGuide',
      component: _import('special-authen/authen-guide'),
      meta: {
        title: '特约认证使用帮助',
        hidden: 1
      }
    },
    // 特约认证设置
    {
      path: '/special-authen-set',
      name: 'SpecialAuthenSet',
      component: _import('special-authen/authen-set'),
      meta: {
        title: '特约认证设置',
        hidden: 1
      }
    },
    // 特约认证
    {
      path: '/special-authen',
      name: 'SpecialAuthen',
      component: _import('special-authen/special-authen'),
      meta: {
        title: '特约认证',
        hidden: 1
      }
    },
    {
      path: '/honey',
      component: _import('honey/index')
    },
    {
      path: '/honey-management',
      name: 'HoneyManagement',
      component: _import('honey-management/index'),
      meta: {
        hidden: 1,
        title: '蜂蜜管理'
      },
      children: [{
        path: 'honey-rule',
        name: 'HoneyRule',
        component: _import('honey-management/honey-rule'),
        meta: {
          hidden: 1,
          title: '蜂蜜规则'
        }
      }]
    },
    {
      path: '/honey-detail',
      name: 'HoneyDetail',
      component: _import('honey-management/honey-detail'),
      meta: {
        hidden: 1,
        title: '蜂蜜明细'
      },
      children: [{
        path: 'honey-rule',
        name: 'HoneyRule',
        component: _import('honey-management/honey-rule'),
        meta: {
          hidden: 1,
          title: '蜂蜜规则'
        }
      }]
    },
    {
      path: '/honey-edit',
      component: _import('honey-shop/honey-edit'),
      meta: {
        title: '添加蜂蜜兑换商品',
        hidden: 1
      }
    },
    {
      path: '/honey-manage',
      component: _import('honey-manage/honey-goods'),
      meta: {
        title: '蜂蜜商品',
        hidden: 1,
        level: 2
      }
    },
    {
      path: '/exchange-record',
      component: _import('honey-manage/exchange-record'),
      meta: {
        title: '兑换记录',
        hidden: 1
      }
    },
    {
      path: '/market-announce',
      component: _import('market-announce/index'),
      meta: {
        hidden: 1,
        level: 1
      }
    },
    {
      path: '/market-announcement',
      name: 'MarketAnnouncement',
      component: _import('market-announcement/index'),
      meta: {
        title: '营销公告',
        hidden: 1,
        level: 2
      }
    },
    {
      path: '/edit-announcement',
      name: 'EditAnnouncement',
      component: _import('market-announcement/edit-announcement'),
      meta: {
        title: '发公告',
        hidden: 1
      }
    },
    {
      path: '/announcement-detail',
      component: _import('market-announcement/announcement-detail'),
      meta: {
        title: '',
        hidden: 1
      }
    },
    {
      path: '/draft-detail',
      name: 'DraftDetail',
      component: _import('market-announcement/draft-detail'),
      meta: {
        title: '',
        hidden: 1
      }
    },
    {
      path: '/boutique-liarly',
      component: _import('boutique-liarly/index'),
      meta: {
        hidden: 1,
        level: 1
      }
    },
    {
      path: '/boutique-materials',
      name: 'BoutiqueMaterials',
      component: _import('boutique-materials/index'),
      meta: {
        title: '精品材料馆',
        hidden: 1,
        level: 2
      }
    },
    {
      path: '/materials-library',
      name: 'MaterialsLibrary',
      component: _import('materials-library/index'),
      meta: {
        title: '材料图书馆',
        hidden: 1,
        level: 2
      }
    },
    {
      path: '/tmall-flow',
      name: 'TmallFlow',
      component: _import('tmall-flow/index'),
      meta: {
        title: '线上流量',
        hidden: 1
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!to.meta.hidden) {
    invokeNativeMethod('setNavigationBarHidden', 0)
    nativeBackBase()
  }
  next()
})

export default router
