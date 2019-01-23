// 该模块的作用是设置或者重新签名，将整个请求数据重写并返回
import MD5 from 'js-md5'
import {dev} from 'common/js/dev'
import { getItem } from './common'

const verifySignBase = function(param) {
  let {
    imei = '',
    os = dev().toLowerCase(),
    osVersion = '',
    version = '0.0.2',
    versionCode = '',
    mobileType = '',
    market = '',
    channels = '',
    source = ''
  } = JSON.parse(getItem('data')) || {}
  const constParams = {
    // os: 'wap',
    // version: '0.0.2',
    // originos: dev().toLowerCase(),
    // system: 'asa',
    // timestamp: Math.round(new Date() / 1000)
    os,
    osVersion,
    version,
    versionCode,
    mobileType,
    market,
    channels,
    source,
    imei,
    // opProvince: getItem('opProvince') || '',
    // opCity: getItem('opCity') || '',
    timestamp: Math.round(new Date() / 1000)
  }
  let body = param || {}
  Object.assign(body, constParams)
  var sortKeys = Object.keys(body).sort()
  var paramstr = ''
  for (var index in sortKeys) {
    var key = sortKeys[index].toString()
    if (key !== 'sign') {
      paramstr += key + body[key]
    }
  }
  // body.sign = MD5(paramstr + 'c2ZBcGlXYXAyMDE3MDIyOA==')
  let base64 = os.toLowerCase() === 'ios' ? 'c2ZBcGlpT1MyMDE3MDIyOA==' : (os.toLowerCase() === 'android' ? 'c2ZBcGlBbmRyb2lkMjAxNzAyMjg=' : 'c2ZBcGlQQzIwMTcwMjI4')
  body.sign = MD5(paramstr + base64)
  return body
}
export default verifySignBase
