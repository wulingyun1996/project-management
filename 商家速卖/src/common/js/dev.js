import Observer from 'common/js/observer'
// 用来获取客户端类型；
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

export function _postMessage (val, name) {
  // 创建一个 MessageChannel
  let channel = new MessageChannel()
  window.nativeCallBack = function (nativeValue) {
    // channel有两个消息端口 - port1 负责发送 原生的 返回值 给H5
    channel.port1.postMessage(nativeValue)
  }
  // H5调用原生的方法
  window.webkit.messageHandlers[name].postMessage(val)
  // H5异步回调
  return new Promise((resolve, reject) => {
    // channel 的port2端口负责接收原生返回给H5的 返回值
    channel.port2.onmessage = function (e) {
      var data = e.data
      resolve(data)
      // 释放
      channel = null
      window.nativeCallBack = null
    }
  })
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
