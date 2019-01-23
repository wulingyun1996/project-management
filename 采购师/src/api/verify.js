import MD5 from 'js-md5'
import { getItem } from 'common'
import { dev } from 'native'
const verifySign = function (param) {
  let {
    imei = '',
    os = dev().toLowerCase(),
    osVersion = '',
    version = '2.3.6',
    versionCode = '',
    mobileType = '',
    market = '',
    channels = '',
    source = ''
  } = JSON.parse(getItem('data')) || {}
  const constParams = {
    os,
    osVersion,
    version,
    versionCode,
    mobileType,
    market,
    channels,
    source,
    imei,
    opProvince: getItem('opProvince') || '',
    opCity: getItem('opCity') || '',
    timestamp: Math.round(new Date() / 1000)
  }
  let body = param || {}
  body = Object.assign(constParams, body)
  var sortKeys = Object.keys(body).sort()
  var paramstr = ''
  for (var index in sortKeys) {
    var key = sortKeys[index].toString()
    if (key !== 'sign') {
      paramstr += key + body[key]
    }
  }
  let base64 = os.toLowerCase() === 'ios' ? 'c2ZBcGlpT1MyMDE3MDIyOA==' : (os.toLowerCase() === 'android' ? 'c2ZBcGlBbmRyb2lkMjAxNzAyMjg=' : 'c2ZBcGlQQzIwMTcwMjI4')
  body.sign = MD5(paramstr + base64)
  return body
}
export default verifySign
