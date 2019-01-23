import { statisticsData, destroyComponent, getItem } from 'common'
import filters from 'filter'
import appConfig from 'appConfig'
const { cgsOpenInstall } = appConfig

// 全局混入
export const globalMixins = {
  data () {
    return {
      preventMoreClick: true
    }
  },
  computed: {
    isFromNative () {
      return !!this.$route.query.fromNative
    },
    hasPath () {
      return !!this.$route.query.path
    },
    isPone () {
      return this.$dev === 2 && !this.$isX
    },
    isSharedPage () {
      return !!this.$route.query.shareId
    },
    provinceId () {
      return getItem('opProvince') || this.$route.query.provinceId || ''
    },
    cityId () {
      return getItem('opCity') || this.$route.query.cityId || ''
    },
    // 采购师昵称
    nickName () {
      const account = getItem('account')
      const nickname = getItem('nickname')
      // eslint-disable-next-line
      return nickname ? nickname : account
    },
    // 是否是在微信或者 qq 浏览器中打开
    inWx () {
      const UA = navigator.userAgent.toLowerCase()
      if (!!UA.match(/MicroMessenger/i) || !!UA.match(/QQ/i)) return true
      return false
    }
  },
  methods: {
    justifyBodyHeight () {
      let height = this.$refs.button.clientHeight
      document.body.style.height = (window.screen.availHeight - height) + 'px'
    },
    restoreBodyHeight () {
      document.body.style.height = '100%'
    },
    /**
     * @param {String} pathName 例如下载页面路由为 /app，pathName = '/app'，即只接受 pathname + search + hash 部分
     * @returns 返回指定页面的全路径
     */
    getCustomiedPageUrl (pathName) {
      /* eslint-disable */
      let { IS_TEST_ENV, NODE_ENV, VERSION } = process.env
      const ENV = NODE_ENV === 'production'
      const isCustomVersion = VERSION !== 'static'
      const isTest = ENV && IS_TEST_ENV
      const url = !ENV ?
                      `http://test-c.cgs18.com${pathName}` :
                isTest ?
                      (isCustomVersion ? `http://test-c.cgs18.com/${VERSION}${pathName}` : `http://test-c.cgs18.com${pathName}`) :
                      (isCustomVersion ? `http://c.cgs18.com/${VERSION}${pathName}` : `http://c.cgs18.com${pathName}`)
      /* eslint-enable */
      return url
    },
    // 定向到指定 url，主要用于分享
    goCustomiedPage (pathName) {
      let url = this.getCustomiedPageUrl(pathName)
      location.replace(url)
    }
  },
  filters,
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let p = 'cgsh5'
      let page = vm.$route.name
      let pageName = vm.$route.meta.title
      let extras
      if (page === 'GoodsDetail') {
        extras = vm.$route.query.goodsId
      }
      let {
        userId = '',
        market = '',
        channels = '',
        os = '',
        osVersion = '',
        version = '',
        mobileType = '',
        imei = ''
      } = vm.$deviceParameter
      statisticsData(
        p,
        userId,
        page,
        pageName,
        market,
        channels,
        os,
        osVersion,
        version,
        mobileType,
        imei,
        extras
      )
    })
  },
  beforeRouteLeave (to, from, next) {
    destroyComponent(to, from, next, this)
  }
}

// scroll 数据混入
export const mixins = {
  data () {
    return {
      m_page: 0, // 当前页 每次执行+1
      m_pageSize: 10, // 每页条数
      m_dataList: [], // 列表数据
      m_loading: true, // 是否显示加载中
      m_hasMore: true, // 是否还有数据
      m_scrollPosY: true, // 滚动行为记录
      dataTotalNum: 0, // 列表总条数
      m_pulldown: true, // 下拉刷新
      m_refresh: false, // 是否显示下拉刷新
      m_pullup: true // 上拉加载
    }
  },
  methods: {
    _checkMore (data) {
      this.m_loading = true
      this.dataTotalNum = data.total
      if (!this.m_dataList.length || (this.m_page * this.m_pageSize) >= this.dataTotalNum) {
        this.m_loading = false
        this.m_hasMore = false
      }
    },
    // 状态初始
    statusInit () {
      this.m_dataList.length = 0
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      // this.$refs.scroll.scrollTo(0, 0)
    },
    // 下拉刷新
    pullDownRefresh () {
      this.statusInit()
      this.m_refresh = true
      this.getData().then(() => {
        this.m_refresh = false
      })
    },
    // ----------------------------- 新版下拉刷新 --------------------------------
    // 初始化状态
    initData () {
      this.m_page = 0
      this.m_loading = false
      this.m_hasMore = true
      this.m_refresh = true
    },
    pullDownRefreshData () {
      this.initData()
      this.getData().then(() => {
        this.m_refresh = false
      })
    },
    // 删除列表数据的时候是否还能加载更多
    loadMoreData () {
      // eslint-disable-next-line
      let { m_dataList, m_hasMore, m_pageSize } = this
      let length = m_dataList.length
      // eslint-disable-next-line
      if (m_hasMore && length <= m_pageSize) {
        this.getData()
      }
    }
  }
}

// 消息数据混入
export const navMixins = {
  methods: {
    showNav () {
      let { isShowNav } = this.$refs.nav
      if (isShowNav) {
        this.$refs.nav.hide()
        return
      }
      this.$refs.nav.show()
    },
    showSharePopup () {
      this.$refs.share.show()
    }
  }
}

// 微信内页分享混入
export const wxMixins = {
  methods: {
    /**
     * 分享页面注入微信内再次分享功能
     * @param {Object} shareMainInfo 示例：{ title: '100*100瓷砖', desc: '爆款热卖商品', imgUrl: '主图链接' }
     */
    wxShare (shareMainInfo) {
      let url = 'api/getSignPackage'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          let vm = this
          let { appId, nonceStr, signature, timestamp, url } = res.data
          /* eslint-disable */
          wx.config({
            debug: false,
            appId,
            nonceStr,
            signature,
            timestamp,
            jsApiList: [
              'getNetworkType',
              // ---------- 旧版分享功能 ----------
              // 微信 及 QQ 好友
              'onMenuShareAppMessage',
              // QQ 好友
              'onMenuShareQQ',
              // 朋友圈
              'onMenuShareTimeline',
              // QQ 空间
              'onMenuShareQZone',
              // ---------- 新版分享功能 ----------
              // 微信 及 QQ 好友
              'updateAppMessageShareData',
              // 朋友圈 及 QQ 空间
              'updateTimelineShareData',
              // 分享到微博
              'onMenuShareWeibo'
            ]
          })
          wx.ready(() => {
            if (wx.updateAppMessageShareData) {
              vm.shareToOthersNew(shareMainInfo, url)
              return
            }
            vm.shareToOthersOld(shareMainInfo, url)
          })
        }
      })
    },
    // 旧版(v6.7.2之前) 微信 分享好友功能
    shareToOthersOld (shareMainInfo, url) {
      let vm = this
      let { title = '', desc = '', imgUrl = '', link = url } = shareMainInfo
      let callbackHandler = {
        success () {
          //
        },
        fail () {
          // vm.$t('分享失败')
        }
      }
      wx.onMenuShareAppMessage(Object.assign({ title, desc, link, imgUrl }, { type: '', dataUrl: '' }, callbackHandler))
      wx.onMenuShareQQ(Object.assign({ title, desc, link, imgUrl }, callbackHandler))
      wx.onMenuShareTimeline(Object.assign({ title, link, imgUrl }, callbackHandler))
      wx.onMenuShareQZone(Object.assign({ title, desc, link, imgUrl }, callbackHandler))
      wx.onMenuShareWeibo(Object.assign({ title, desc, link, imgUrl }, callbackHandler))
    },
    // 新版(v6.7.2之后) 微信 分享好友功能
    shareToOthersNew (shareMainInfo, url) {
      let vm = this
      let { title = '', desc = '', imgUrl = '', link = url } = shareMainInfo
      let callbackHandler = {
        success () {
          //
        },
        fail () {
          // vm.$t('分享失败')
        }
      }
      wx.updateAppMessageShareData(Object.assign({ title, desc, link, imgUrl }, callbackHandler))
      wx.updateTimelineShareData(Object.assign({ title, link, imgUrl }, callbackHandler))
      wx.onMenuShareWeibo(Object.assign({ title, desc, link, imgUrl }, callbackHandler))
    }
  }
}

/**
 * openInstall 混入，默认加载采购师下载 key
 * 注意事项：需要提供 dom 的 id 作为选择器，id 指定为 #downloadApp
 */
export const openInstallMixins = {
  methods: {
    openAppByOpenInstall (openInstall = cgsOpenInstall) {
      /* eslint-disable */
      const { IS_TEST_ENV, NODE_ENV } = process.env
      const appKey = NODE_ENV !== 'production' ? openInstall.devKey : (NODE_ENV === 'production' && IS_TEST_ENV ? openInstall.devKey : openInstall.prodKey)
      /* eslint-enable */
      setTimeout(() => {
        let src = document.createElement('script')
        src.type = 'text/javascript'
        src.defer = true
        src.innerHTML = `
          var data = OpenInstall.parseUrlParams();
          new OpenInstall({
            appKey: "${appKey}",
            onready: function () {
            var that = this;
            var button = document.getElementById('downloadApp');
            button.style.visibility = "visible";
            that.schemeWakeup();
            button.addEventListener("click", function () {
              that.wakeupOrInstall();
              return false;
            })
          }
        }, data)`
        document.body.appendChild(src)
      }, 100)
    }
  }
}
