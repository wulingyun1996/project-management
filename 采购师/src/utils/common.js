/**
 * 判断对象是否是空对象
 * {Object} obj
 */
export function judgeObjectLen (obj) {
  return Object.keys(obj).length
}

/**
 * 判断数组是否包含指定元素
 * @param {*} ele 要判断的元素
 * @param {Array} array 数组
 * @returns {Object} 返回一个包含是否存在元素的标识以及存在的索引的对象
 */
export function inArray (ele, array) {
  let i = array.indexOf(ele)
  let o = {
    include: i !== -1,
    index: i
  }
  return o
}

/**
 * 判断数据是否是数组
 * @param {*} t
 * @returns {Boolean}
 */
export function isArray (t) {
  return Array.isArray(t)
}

/**
 *
 * @param {*} t
 * @returns {Boolean}
 */
export function isUnDef (t) {
  return t === null || t === undefined
}

/**
 * 数据转为 JSON
 * @param {*} d
 * @returns {JSON}
 */
export function toJson (d) {
  return JSON.stringify(d)
}

/**
 * JSON数据转为初始值
 * @param {*} d
 * @returns {*}
 */
export function parseJson (d) {
  return JSON.parse(d)
}

/**
 * 克隆数据
 * @param {*} d
 * @returns {*} 返回克隆后的数据
 */
export function cloneDeep (d) {
  return JSON.parse(JSON.stringify(d))
}

/**
 * slice-str
 * @param {String} str
 * @param {Number} defaultLength
 * @return {String}
 */
export function sliceChar (str, defaultLength = 6) {
  if (str.length > defaultLength) {
    str = str.substr(0, defaultLength) + '...'
  }
  return str
}

/**
 * format-money：123456789 -> 1,234,567,89
 * @param {String|Number} money
 * @return {String}
 */
export function formatMoney (money) {
  let reg = /\B(?=(\d{3})+(?!\d))/g
  money = money.toString().replace(reg, ',')
  return money
}

/**
 * 分割价格整数位及小数位
 * @param {*} str
 */
export function splitMoney (str) {
  let [init, zero] = (str + '').split('.')
  zero = zero === undefined ? '00' : (zero.length < 2 ? zero + '0' : zero.substr(0, 2))
  return {init, zero}
}

/**
 * 保留两位小数位
 * @param {Number} num 待分割的数字
 */
export function retainTwoDecimal (num) {
  let res = parseInt(num * 10000) / 10000
  let {init, zero} = splitMoney(res)
  return `${init}.${zero}`
}

/**
 * checkout-mobile
 * @param {String} phoneNumber
 * @return {Boolean}
 */
export function checkPhone (phoneNumber) {
  let reg = /^1[3,4,5,7,8,9]\d{9}$/
  return reg.test(phoneNumber)
}

/**
 * checkout-num
 * @param {String} number
 * @return {Boolean}
 */
export function isNum (number) {
  let reg = /^\d+$/
  return reg.test(number)
}

/**
 * picture-filter
 * @param {String} imgUrl
 * @param {*} width
 * @param {*} height
 * @return {String}
 */
export function smallPic (imgUrl, width, height) {
  let imgLink = imgUrl.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  if (imgLink === null) {
    return ''
  }
  let imgArr = imgUrl.split(imgLink[0])
  return `${imgArr[0]}_c${width}x${height}${imgLink[0]}`
}

/**
 * 格式化时间请使用该方法，为避免 iOS 默认时区导致获取的时间差错误
 * @param {String} t
 */
export function initTime (t) {
  let time = t.split(/[- :]/)
  let [year, month, day, hours = 0, minutes = 0, seconds = 0] = time
  let currentTime = new Date(year, month - 1, day, hours, minutes, seconds)
  return Math.round(currentTime.getTime() / 1000)
}

/**
 * time-filter
 * @param {String} value
 * @return {String}
 */
export function timeFormat (value) {
  let todayDate = new Date().getMonth() + 1
  if (Number(todayDate) < 10) {
    todayDate = '0' + todayDate
  }
  let today = new Date().getFullYear() + '-' + todayDate + '-' + new Date().getDate()
  let yesterday = new Date().getFullYear() + '-' + todayDate + '-' + (new Date().getDate() - 1)
  let year = String(value).slice(0, 4)
  let month = String(value).slice(4, 6)
  let day = String(value).slice(6, 8)
  let currentTime = year + '-' + month + '-' + day
  if (currentTime === today) {
    currentTime = '今天'
  }
  if (currentTime === yesterday) {
    currentTime = '昨天'
  }
  return currentTime
}

export function formatDateOne () {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  month = paddingZero(month)
  day = paddingZero(day)
  return `${year}-${month}-${day}`
}

export function formatNumber (number) {
  let [int, zero] = (number + '').split('.')
  if (zero === void 0 || Number(zero) <= 5) {
    return Number(int)
  }
  return Number(int) + 1
}

/**
 * count-down
 * @param {String} startTime
 * @param {String} endTime
 * @return {Object}
 */
export function countDown (startTime, endTime) {
  let interval = endTime - startTime
  let _hours = parseInt(interval / 3600)
  let _minutes = parseInt(interval % 3600 / 60)
  let _seconds = parseInt(interval % 3600 % 60)
  let hours = paddingZero(_hours)
  let minutes = paddingZero(_minutes)
  let seconds = paddingZero(_seconds)
  return {hours, minutes, seconds}
}

function paddingZero (time) {
  if (Number(time) < 10) {
    time = `0${time}`
  }
  return time
}

export function getItem (item) {
  return window.sessionStorage.getItem(item)
}

export function setItem (item, value) {
  return window.sessionStorage.setItem(item, value)
}

export function removeItem (item) {
  return window.sessionStorage.removeItem(item)
}

export function isIPhoneX () {
  var u = navigator.userAgent
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isIOS) {
    if (screen.height >= 812 && screen.width >= 375) {
      // 是iphoneX 及以上
      return true
    } else {
      // 不是iphoneX
      return false
    }
  }
}

export function getDevicePixelRatio () {
  return window.devicePixelRatio
}

/**
 * 添加新的查询字符串到 url 中，用于分享
 * @param {param} param 要插入的查询字符串，格式：shareId=1
 * @param {href} href 当前 url
 */
export function splitHref (param, href = location.href) {
  const [domin, query] = href.split('?')
  if (query) {
    return `${domin}?${param}&${query}`
  }
  return `${domin}?${param}`
}

export function getIPhoneType () {
  var u = navigator.userAgent
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isIOS) {
    if (screen.height === 812 && screen.width === 375) {
      return 'iPoneX'
    } else if (screen.height === 736 && screen.width === 414) {
      // iPhone6P - iPhone7P - iPhone8P
      return 'iPone6Plus'
    } else if (screen.height === 667 && screen.width === 375) {
      // iPhone6 - iPhone7 - iPhone8
      return 'iPone6'
    } else if (screen.height === 568 && screen.width === 320) {
      return 'iPone5'
    } else {
      return 'iPone4'
    }
  }
}

export const isWeiXin = (function () {
  var ua = window.navigator.userAgent.toLowerCase()
  // eslint-disable-next-line
  return !!ua.match(/MicroMessenger/i)
}())

export const isNeedFit = isIPhoneX() && !isWeiXin

export function toRawType (t) {
  return Object.prototype.toString.call(t).slice(8, -1)
}

export function statisticsData (
  p = '',
  account = '',
  action = '',
  action_name = '',
  market = '',
  channel = '',
  os = '',
  version = '',
  app_version = '',
  mobile_type = '',
  imei = '',
  extras = '',
  event = 'show') {
  const { NODE_ENV, IS_TEST_ENV } = process.env
  const isProd = NODE_ENV === 'production'
  window._maq = {
    p,
    account,
    action,
    action_name,
    market,
    channel,
    os,
    version,
    app_version,
    mobile_type,
    imei,
    extras,
    event
  }
  window._maEnv = !isProd ? 'development' : (isProd && IS_TEST_ENV ? 'development' : 'production')
  var protocol = window.location.protocol === 'https:' ? 'https://' : 'http://'
  var domainName = !isProd ? 'test-sa.cgs18.com' : (isProd && IS_TEST_ENV ? 'test-sa.cgs18.com' : 'sa.cgs18.com')
  var scriptTag = document.getElementById('#statistics')
  if (scriptTag) document.body.removeChild(scriptTag)
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.defer = true
  script.id = '#statistics'
  script.src = protocol + domainName + '/static/js/ma.js'
  document.body.appendChild(script)
}

/**
 * publish-subscribe for post message to native ios
 * @class Observer
 */
export class Observer {
  constructor () {
    this._observer = {}
    this._cache = {}
  }
  on (...rest) {
    let [type, callback] = rest
    if (toRawType(callback) !== 'Function') {
      throw new TypeError(`callback of arguments for function ${this.subscribe.name} must be a function `)
    }
    if (!this._observer[type]) this._observer[type] = []
    this._observer[type].push(callback)
    return this
  }
  emit (...rest) {
    let [type, ...theme] = rest
    let subscribes = this._observer[type]
    if (!this._cache[type]) {
      this._cache[type] = [theme]
    } else {
      this._cache[type].push(theme)
    }
    for (let callback of subscribes) {
      callback.apply(this, theme)
    }
    return this
  }
  off (...rest) {
    let [type, callback] = rest
    if (!this._observer[type] || !this._observer[type].length) return
    if (toRawType(callback) !== 'Function') {
      throw new TypeError(`callback of arguments for function ${this.subscribe.name} must be a function `)
    }
    let subscribes = this._observer[type]
    subscribes.some((item, index, arr) => {
      if (item === callback) {
        arr.splice(index, 1)
        return true
      }
    })
    return this
  }
  viewLog (...rest) {
    let [type, callback] = rest
    if (!this._cache[type] || toRawType(callback) !== 'Function') return
    let themes = this._cache[type]
    for (const theme of themes) {
      callback.apply(this, theme)
    }
    return this
  }
}

/**
 * @param {String|Object} el DOM 元素或者选择器
 * @param {Object} router Vue 路由
 * @param {Object} options 可配置项
 */
export function createTouch (el, router, options = {}) {
  return (new class {
    constructor (el, router, options) {
      this._handlerOptions(options)
      this._enable()
      this._init(el, router)
    }
    _handlerOptions (options) {
      this.options = options
      this.moveStart = 0
      this.moveEnd = 0
      this.delta = 0
      this.slideDis = this.options.slideDis ? this.options.slideDis : 100
    }
    _init (el, router) {
      if (!this.enabled) return
      this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
      if (!this.wrapper) {
        console.warn('未获取到当前DOM元素')
      }
      let _this = this
      this.wrapper.addEventListener('touchstart', function (e) {
        if (!_this.enabled) return
        _this.moveStart = e.changedTouches[0].clientX
      })
      this.wrapper.addEventListener('touchend', function (e) {
        if (!_this.enabled) return
        _this.moveEnd = e.changedTouches[0].clientX
        _this.delta = _this.moveEnd - _this.moveStart
        if (_this.delta > 0 && Math.abs(_this.delta) >= _this.slideDis) {
          router.back()
        }
        if (_this.delta < 0 && Math.abs(_this.delta) >= _this.slideDis) {
          router.forward()
        }
      })
    }
    _enable () {
      this.enabled = process.env.NODE_ENV === 'development' || process.env.IS_TEST_ENV
    }
    _disable () {
      this.enabled = false
    }
  }(el, router, options))
}

/**
 * 指定元素添加拖拽功能
 * el: dom 元素或者 选择器
 * options: disabled 是否禁用拖拽；edgeDis：距离顶部或者底部多少距离吸顶或者吸底；time：吸附到边缘的过渡时间(ms)
 */
export function createDragTouch (el, { disabled = false, edgeDis = 50, time = 500 } = {}) {
  return (
    new class {
      constructor (el) {
        this.startX = 0
        this.startY = 0
        this.startTime = null
        this.endTime = null
        this.offLeft = 0
        this.offTop = 0
        this.offRight = 0
        this.offBottom = 0
        this.width = 0
        this.height = 0
        this.pageClientWidth = 0
        this.pageClientHeight = 0
        this.time = time
        this.edgeDis = edgeDis
        this.disabled = disabled
        this.initTouch(el)
      }
      // 初始化
      initTouch (el) {
        if (this.disabled) return
        this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
        if (!this.wrapper) {
          console.error('未获取到当前DOM元素')
          return
        }
        this.getClientData()
        this.wrapper.addEventListener('touchstart', this.touchStart.bind(this))
        this.wrapper.addEventListener('touchmove', this.touchMove.bind(this))
        this.wrapper.addEventListener('touchend', this.touchEnd.bind(this))
      }
      // 获取当前元素和页面的可视宽高
      getClientData () {
        let { width, height } = this.wrapper.getBoundingClientRect()
        let { clientWidth, clientHeight } = document.documentElement
        this.width = parseInt(width)
        this.height = parseInt(height)
        this.pageClientWidth = parseInt(clientWidth)
        this.pageClientHeight = parseInt(clientHeight)
      }
      // touchstart
      touchStart (e) {
        if (!this.wrapper) return
        this.startTime = new Date() - 0
        this.setTransitionToEle(false)
        let { pageX, pageY } = e.targetTouches[0]
        let { left, top } = this.wrapper.getBoundingClientRect()
        this.startX = parseInt(pageX) - parseInt(left)
        this.startY = parseInt(pageY) - parseInt(top)
      }
      // touchmove
      touchMove (e) {
        if (!this.wrapper) return
        e.preventDefault()
        let { pageX, pageY } = e.targetTouches[0]
        this.setPosition(pageX, pageY)
      }
      // touchend
      touchEnd () {
        if (!this.wrapper) return
        this.endTime = new Date() - 0
        if (this.endTime - this.startTime < 200) return
        this.moveToEdgeAuto()
      }
      // 设置元素位置
      setPosition (pageX, pageY) {
        let { startX, startY, width, height, pageClientWidth, pageClientHeight } = this
        let offLeft = parseInt(pageX) - startX
        let offTop = parseInt(pageY) - startY
        let offRight = offLeft + parseInt(width)
        let offBottom = offTop + parseInt(height)
        if (offLeft <= 0 || offRight >= pageClientWidth) {
          if (offLeft <= 0) {
            this.wrapper.style.left = 0 + 'px'
          } else {
            this.wrapper.style.left = pageClientWidth - width + 'px'
          }
        } else {
          this.wrapper.style.left = offLeft + 'px'
        }
        if (offTop <= 0 || offBottom >= pageClientHeight) {
          if (offTop <= 0) {
            this.wrapper.style.top = 0 + 'px'
          } else {
            this.wrapper.style.top = pageClientHeight - height + 'px'
          }
        } else {
          this.wrapper.style.top = offTop + 'px'
        }
        this.offLeft = offLeft
        this.offTop = offTop
        this.offRight = offRight
        this.offBottom = offBottom
      }
      // 贴边操作
      moveToEdgeAuto () {
        let { startX, width, height, offLeft, pageClientWidth, pageClientHeight, edgeDis } = this
        let { bottom, top } = this.wrapper.getBoundingClientRect()
        this.setTransitionToEle()
        if (top < edgeDis) {
          this.wrapper.style.top = 0
          return
        }
        if (pageClientHeight - bottom < edgeDis) {
          this.wrapper.style.top = pageClientHeight - height + 'px'
          this.wrapper.style.bottom = 0
          return
        }
        if (offLeft + startX < pageClientWidth / 2) {
          this.wrapper.style.left = 0
          return
        }
        this.wrapper.style.left = pageClientWidth - width + 'px'
        this.wrapper.style.right = 0
      }
      // 贴边过渡增删
      setTransitionToEle (isSet = true) {
        if (isSet) {
          this.wrapper.style.transition = `all, ${this.time}ms`
          return
        }
        this.wrapper.style.transition = `none`
      }
      // 销毁事情和元素 -- TODO 内存泄漏
      destoryTouch () {
        this.wrapper.removeEventListener('touchstart', this.touchStart)
        this.wrapper.removeEventListener('touchmove', this.touchMove)
        this.wrapper.removeEventListener('touchend', this.touchEnd)
        this.wrapper = null
      }
    }(el, disabled, edgeDis, time)
  )
}

/**
 * @param {Obejct} to 跳转路由
 * @param {Obejct} from 当前路由
 * @param {*} next next 管道函数
 * @param {VNode} vm 当前组件实例
 * @param {Boolean} manualDelete 是否要手动移除缓存组件，弥补当路由缺少 level 时，清空组件缓存的不足
 */
export function destroyComponent (to, from, next, vm, manualDelete = false) {
  // 禁止向上缓存
  if ((from && from.meta.level && to.meta.level && from.meta.level > to.meta.level) || manualDelete) {
    if (vm.$vnode && vm.$vnode.data.keepAlive) {
      if (vm.$vnode.parent && vm.$vnode.parent.componentInstance && vm.$vnode.parent.componentInstance.cache) {
        if (vm.$vnode.componentOptions) {
          /* eslint-disable */
          const key = !vm.$vnode.key ?
                      vm.$vnode.componentOptions.Ctor.cid + (vm.$vnode.componentOptions.tag ? `::${vm.$vnode.componentOptions.tag}` : '')
                      :
                      vm.$vnode.key
          /* eslint-enable */
          const cache = vm.$vnode.parent.componentInstance.cache
          const keys = vm.$vnode.parent.componentInstance.keys
          // 清除缓存 component'key
          if (cache[key]) {
            if (keys.length) {
              let index = keys.indexOf(key)
              if (index > -1) {
                keys.splice(index, 1)
              }
            }
            delete cache[key]
          }
        }
      }
    }
    // 销毁缓存组件
    vm.$destroy()
  }
  next()
}
