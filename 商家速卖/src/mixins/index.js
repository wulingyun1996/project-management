import { destroyComponent } from 'commons'
import { invokeNativeMethod } from 'common/js/dev'
import filters from 'filters'
import appConfig from 'appConfig'
const { sellerOpenInstall } = appConfig
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
      // setTimeout(() => {
      //   this.getData().then(() => {
      //     this.m_refresh = false
      //   })
      // }, 10000)
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
      let { m_dataList, m_hasMore, m_pageSize } = this
      let length = m_dataList.length
      // eslint-disable-next-line
      if (m_hasMore && length <= m_pageSize) {
        this.getData()
      }
    }
  }
}

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
    isSharedPage () {
      return !!this.$route.query.shareId
    }
  },
  methods: {
    justifyBodyHeight () {
      // let height = this.$refs.button.clientHeight
      // document.body.style.height = (window.screen.availHeight - height) + 'px'
    },
    restoreBodyHeight () {
      // document.body.style.height = '100%'
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
                      `http://test-mseller.cgs18.com${pathName}` :
                isTest ?
                      (isCustomVersion ? `http://test-mseller.cgs18.com/${VERSION}${pathName}` : `http://test-mseller.cgs18.com${pathName}`) :
                      (isCustomVersion ? `http://mseller.cgs18.com/${VERSION}${pathName}` : `http://mseller.cgs18.com${pathName}`)
      /* eslint-enable */
      return url
    },
    // 定向到指定 url，主要用于分享
    goCustomiedPage (pathName) {
      let url = this.getCustomiedPageUrl(pathName)
      location.replace(url)
    },
    preventMoreClickEvent () {
      this.preventMoreClick = false
      setTimeout(() => {
        this.preventMoreClick = true
      }, 1000)
    }
  },
  filters,
  beforeRouteLeave (to, from, next) {
    invokeNativeMethod('setNavigationBarHidden', 1)
    destroyComponent(to, from, next, this)
  }
}

/**
 * openInstall 混入
 * 注意事项：需要提供 dom 的 id 作为选择器
 */
export const openInstallMixins = {
  methods: {
    openAppByOpenInstall (openInstall = sellerOpenInstall) {
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
