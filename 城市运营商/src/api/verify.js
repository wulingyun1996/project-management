import MD5 from 'js-md5'
const verifySign = function (param) {
  const constParams = {
    os: 'web',
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
  body.sign = MD5(paramstr + 'c2ZBcGlQQzIwMTgwNjA2')
  return body
}
export default verifySign
