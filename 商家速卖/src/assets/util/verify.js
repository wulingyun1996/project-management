import MD5 from 'js-md5'
import {dev} from 'common/js/dev'
import { getItem } from './common'
const verifySign = function(param) {
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
    os,
    imei,
    osVersion,
    version,
    versionCode,
    mobileType,
    market,
    channels,
    source,
    grant_type: 'password',
    client_id: 'app',
    client_secret: 'secret',
    // system: 'sc',
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
export default verifySign
