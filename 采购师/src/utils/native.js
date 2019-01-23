import { Observer } from 'common'
/**
 * checkout device type
 */
export function dev () {
  let ua = navigator.userAgent
  let devType = ''
  if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
    devType = 'iOS'
  } else if (/(Android)/i.test(ua)) {
    devType = 'Android'
  } else {
    devType = 'PC'
  }
  return devType
}

export function dev2Id () {
  let currentDev = dev()
  let id
  switch (currentDev) {
    case 'Android':
      id = 1
      break
    case 'iOS':
      id = 2
      break
    default:
      id = 3
  }
  return id
}

/**
 * postMessage-to-iOS
 * @param {*} rest
 */
export function _postMessage (...rest) {
  let observer = new Observer()
  let [val, name] = rest
  window.nativeCallBack = function (rest) {
    observer.emit('nativeMessage', rest)
  }
  window.webkit.messageHandlers[name].postMessage(val)
  return new Promise((resolve, reject) => {
    observer.on('nativeMessage', function (...rest) {
      resolve(rest)
      observer = null
      window.nativeCallBack = null
    })
  })
}

/**
 * 获取 token、用户信息、设备号以及省市 id
 */
export function getToken () {
  let currentDev = dev()
  let observer = new Observer()
  window.nativeCallBack = function (data) {
    observer.emit('getToken', JSON.parse(data))
  }
  return new Promise((resolve, reject) => {
    observer.on('getToken', function (data) {
      resolve(data)
    })
    try {
      if (currentDev === 'Android') {
        let token = JSON.parse(window.android.getToken())
        let citys = JSON.parse(window.android.getLocationCity())
        let data = Object.assign({}, token, citys)
        observer.emit('getToken', data)
        return
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.getToken.postMessage('')
      }
      if (currentDev === 'PC') {
        resolve({})
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取带有返回值的原生方法
 * @param {String} nativeFunc 原生方法名
 * @param {String} callback IOS 执行的回调函数
 * @param {*} message 传递给原生的消息
 * @returns {*} 返回获取到的原生消息
 */
export function invokeNativeAndGetResult (nativeFunc, callback, message = '') {
  let t = dev2Id()
  let observer = new Observer()
  window[callback] = function (data) {
    observer.emit('getNativeMessage', data)
    delete window[callback]
  }
  return new Promise((resolve, reject) => {
    observer.on('getNativeMessage', function (data) {
      resolve(data)
    })
    try {
      if (t === 1) {
        let data
        if (message === '') {
          data = window.android[nativeFunc]()
        } else {
          data = window.android[nativeFunc](message)
        }
        observer.emit('getNativeMessage', data)
      }
      if (t === 2) {
        window.webkit.messageHandlers[nativeFunc].postMessage(message)
      }
    } catch (e) {
      reject(e)
    }
  })
}

// 数据埋点
export function getDeviceParameter () {
  let currentDev = dev()
  let observer = new Observer()
  window.returnApiRequestData = function (rest) {
    observer.emit('getDeviceParameter', rest)
  }
  return new Promise((resolve, reject) => {
    observer.on('getDeviceParameter', function (rest) {
      let res = JSON.parse(rest)
      res.userId = window.sessionStorage.getItem('userId')
      resolve(res)
    })
    try {
      if (currentDev === 'Android') {
        let res = window.android.getApiRequestData()
        observer.emit('getDeviceParameter', res)
        return
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.getApiRequestData.postMessage('')
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function invokeNativeMethodAndGetResult (fnName, message = '') {
  let t = dev2Id()
  let data
  try {
    if (t === 1) {
      if (message === '') {
        data = window.android[fnName]()
      } else {
        data = window.android[fnName](message)
      }
    }
    if (t === 2) {
      _postMessage(message, fnName).then(res => {
        data = res
      })
    }
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function invokeNativeMethod (fnName, message = '') {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      if (message === '') {
        window.android[fnName]()
      } else {
        window.android[fnName](message)
      }
      return
    }
    if (currentDev === 'iOS') {
      _postMessage(message, fnName).then(res => {
        return Promise.resolve(res)
      })
    }
  } catch (error) {
    //
  }
}

export function invokeNativeMethod2 (fnName, message = '', message2 = '') {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      window.android[fnName](message, message2)
      return
    }
    if (currentDev === 'iOS') {
      _postMessage(message, message2, fnName).then(res => {
        return Promise.resolve(res)
      })
    }
  } catch (error) {
    //
  }
}

export const updateLocation = () => {
  let currentDev = dev()
  return new Promise((resolve, reject) => {
    try {
      if (currentDev === 'Android') {
        let { opProvinceId, opCityId } = JSON.parse(window.android.getLocationCity())
        window.sessionStorage.setItem('opProvince', opProvinceId)
        window.sessionStorage.setItem('opCity', opCityId)
        resolve(true)
      } else if (currentDev === 'iOS') {
        _postMessage('', 'getToken').then((...data) => {
          let [nativeRes] = data
          let { opProvinceId, opCityId } = JSON.parse(nativeRes)
          window.sessionStorage.setItem('opProvince', opProvinceId)
          window.sessionStorage.setItem('opCity', opCityId)
          resolve(true)
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function hiddenNativeBackArrow () {
  let currentDev = dev()
  let obj = {
    left: [],
    right: []
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(obj))
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(obj)
    }
  } catch (e) {
    //
  }
}

/**
 * navigationItem 回退
 * setNavigationBarHidden 导航条的隐藏与否 true-隐藏 false-显示
 * setTitle 导航标题
 * setAppBottomTab 底部导航的隐藏，默认隐藏
 * @param {String} title
 * @param {Number|Boolean} i
 */
export function nativeBack (title = '', i = 0, isHiddenTab = 0) {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.setNavigationBarHidden(i)
      if (!i) window.android.navigationItem(JSON.stringify(leftFun))
      if (!i) window.android.setTitle(title)
      window.android.setAppBottomTab(isHiddenTab)
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.setNavigationBarHidden.postMessage(i)
      if (!i) window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
      if (!i) window.webkit.messageHandlers.setTitle.postMessage(title)
      window.webkit.messageHandlers.setAppBottomTab.postMessage(isHiddenTab)
    }
  } catch (e) {
    //
  }
}
/**
 * regresses-and-jump
 * @param {Object} param
 * @param {Object} _router
 */
export function nativeBackAndJump (param, _router) {
  let funcName = param['right'][0]['name']
  let { router, path } = _router
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      }]
  }
  let rightFun = param
  param = Object.assign({}, leftFun, rightFun)
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(param))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(param)
    }
  } catch (e) {
    console.warn(e)
  }
  window.nav_back = navBack
  window[funcName] = function () {
    router.push(path)
  }
}

export function nativeRight (rigthFun = {}, functionName) {
  let currentDev = dev()
  let func = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      }],
    'right': []
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(func))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(func)
    }
  } catch (e) {
    //
  }
  window.nav_back = navBack
  window.setRightFun = functionName
}

/**
 * 所有页面直接回退到首页
 */
export function nativeBackHome () {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'nativeGoHome()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
  window.nativeGoHome = nativeGoHome
}

/**
 * 身份认证页面回退到首页
 */
export function nativeGoHome () {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      window.android.nativeGoHome()
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.nativeGoHome.postMessage('')
    }
  } catch (e) {
    console.warn(e)
  }
}

/**
 * 正常页面回退首页
 */
export function nativeGoHomeNormal () {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      window.android.nativeGoHomeNormal()
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.nativeGoHomeNormal.postMessage('')
    }
  } catch (e) {
    console.warn(e)
  }
}

/**
 * 所有页面关闭
 */
export function nativeCloseViewAndShare () {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'navBackSucc()'
      },
      {
        'title': 'close',
        'function': 'closeMyview()'
      }
    ],
    'right': [
      {
        'title': 'share',
        'function': 'share()'
      }
    ]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
}

/**
 * 帮助与反馈详情页面
 */
export function nativeCloseViewAndRefresh (refresh) {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      },
      {
        'title': 'close',
        'function': 'closeWebview()'
      }
    ],
    'right': [
      {
        'title': 'refresh',
        'function': 'refreshHelpDetail()'
      }
    ]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
  window.nav_back = navBack
  window.closeWebview = closeWebview
  window.refreshHelpDetail = refresh
}

// 导航栏返回和分享
export function nativeBackAndShare () {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'navback()'
      }
    ],
    'right': [
      {
        'title': 'share',
        'function': 'share()'
      }
    ]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
}
// 导航栏返回和关闭
export function nativeBackAndClose (title) {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'confirmBack()'
      },
      {
        'title': 'close',
        'function': 'closeMyView()'
      }
    ]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
      window.android.setTitle(title)
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
      window.webkit.messageHandlers.setTitle.postMessage(title)
    }
  } catch (e) {
    //
  }
}

/**
 * 有弹窗效果的回退
 * @param {Object} message
 * @param {*} isCloseWebview 默认是关闭 webview，否则是回到 app 首页
 */
export function nativeClose (message, isCloseWebview = 1) {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'confirmBtn()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
  window.confirmBtn = function confirmBtn () {
    let obj = {
      'title': '提示',
      'message': '您确认放弃编辑吗?',
      'confirm': 'closeWebview()',
      'cancel': ''
    }
    if (message) {
      obj = Object.assign({}, obj, message)
    }
    try {
      if (currentDev === 'Android') {
        window.android.nativeAlterBack(JSON.stringify(obj))
      } else if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeAlertBack.postMessage(obj)
      }
    } catch (e) {
      console.warn(e)
    }
  }
  window.closeWebview = isCloseWebview ? closeWebview : nativeGoHome
}

/**
 * 答题认证回退
 */
export function authenAnswerAlert (message = '您确定要放弃答题吗？') {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'confirmBtn()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
  window.confirmBtn = function confirmBtn () {
    let obj = {
      'title': '提示',
      'message': message,
      'confirm': 'nav_back()',
      'cancel': ''
    }
    try {
      if (currentDev === 'Android') {
        window.android.nativeAlterBack(JSON.stringify(obj))
      } else if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeAlertBack.postMessage(obj)
      }
    } catch (e) {
      console.warn(e)
    }
  }
  window.nav_back = navBack
}

/**
 * close-webview-and-jump
 * @param {Object} param
 * @param {Object} _router
 * @param {Object} message
 */
export function nativeCloseAndJump (param, _router, message) {
  let funcName = param['right'][0]['name']
  let { router, path } = _router
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'confirmBtn()'
      }]
  }
  let rightFun = param
  param = Object.assign({}, leftFun, rightFun)
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(param))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(param)
    }
  } catch (e) {
    console.warn(e)
  }
  window.confirmBtn = function confirmBtn () {
    let obj = {
      'title': '提示',
      'message': '您确认放弃编辑吗?',
      'confirm': 'closeWebview()',
      'cancel': ''
    }
    if (message) {
      obj = Object.assign({}, obj, message)
    }
    try {
      if (currentDev === 'Android') {
        window.android.nativeAlterBack(JSON.stringify(obj))
      } else if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeAlertBack.postMessage(obj)
      }
    } catch (e) {
      console.warn(e)
    }
  }
  window.closeWebview = closeWebview
  window[funcName] = function () {
    router.push(path)
  }
}

/**
 * 限时抢购、爆款商品、推荐商户分享功能
 */
export function nativeShare (functionName) {
  let currentDev = dev()
  let func = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      }],
    'right': [
      {
        'title': 'share',
        'function': 'showSharePopup()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(func))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(func)
    }
  } catch (e) {
    //
  }
  window.nav_back = navBack
  window.showSharePopup = functionName
}

export function nativeReport (functionName) {
  let currentDev = dev()
  let func = {
    'left': [
      {
        'title': 'back',
        'function': 'nav_back()'
      }],
    'right': [
      {
        'title': '举报',
        'function': 'report()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(func))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(func)
    }
  } catch (e) {
    //
  }
  window.nav_back = navBack
  window.report = functionName
}

export function goNativeWantToBuy (functionName) {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': 'nativeToBack()'
      }
    ],
    'right': [
      {
        'title': '我的求购',
        'function': 'myBuy()'
      }
    ]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
    }
  } catch (e) {
    //
  }
  window.nativeToBack = navBack
  window.myBuy = functionName
}
export function nativeBackUpgrade (title = '', backFun = 'nav_back') {
  let currentDev = dev()
  let leftFun = {
    'left': [
      {
        'title': 'back',
        'function': backFun + '()'
      }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(leftFun))
      window.android.setTitle(title)
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(leftFun)
      window.webkit.messageHandlers.setTitle.postMessage(title)
    }
  } catch (e) {
    //
  }
}
export function navBack () {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      window.android.nativeBack()
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.nativeBack.postMessage('')
    }
  } catch (e) {
    console.warn(e)
  }
}

/**
 * close-webview
 */
export function closeWebview () {
  let currentDev = dev()
  try {
    if (currentDev === 'Android') {
      window.android.nativeClose()
      return
    }
    if (currentDev === 'iOS') {
      window.webkit.messageHandlers.nativeClose.postMessage('')
    }
  } catch (e) {
    console.warn(e)
  }
}
// 开店引导新增
export function getPic (...rest) {
  let observer = new Observer()
  let [name, index] = rest
  window.nativeCallBack = function (...rest) {
    observer.emit('getPic', ...rest)
  }
  window.webkit.messageHandlers[name].postMessage(index)
  return new Promise((resolve, reject) => {
    observer.on('getPic', function (...rest) {
      resolve(rest)
      observer = null
      window.nativeCallBack = null
    })
  })
}
// 申请放弃编辑回退
export function setBack () {
  let currentDev = dev()
  var param = {
    'left': [{
      'title': 'back',
      'function': 'confirmBtn()'
    }]
  }
  try {
    if (currentDev === 'Android') {
      window.android.navigationItem(JSON.stringify(param))
    } else if (currentDev === 'iOS') {
      window.webkit.messageHandlers.navigationItem.postMessage(param)
    } else {
      // alert('PC')
    }
  } catch (e) {
  }
  window.closeBtn = function () {
    try {
      if (currentDev === 'Android') {
        window.android.finish()
        return
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeClose.postMessage('')
      }
    } catch (e) {
    }
  }
  window.confirmBtn = function () {
    let params = {
      'title': '提示',
      'message': '您确定放弃申请吗?',
      'confirm': 'closeBtn()',
      'cancel': ''
    }
    try {
      if (currentDev === 'Android') {
        window.android.nativeAlterBack(JSON.stringify(params))
        return
      }
      if (currentDev === 'iOS') {
        window.webkit.messageHandlers.nativeAlertBack.postMessage(params)
      }
    } catch (e) {
    }
  }
}

/**
 * 返回按钮默认功能调用,优先 goBack (返回上一级路由 / 历史),否则关闭 webview
 */
window.nav_back = navBack
