const util = {}
util.isNum = (value) => { // 1到8的数字
  let reg = /(^[1-9]\d{0,8})/
  let val = reg.test(value)
  if (val) {
    return true
  }
  return false
}
util.isMoney = (value) => { // 校验金额
  let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
  let val = reg.test(value)
  if (val) {
    return true
  }
  return false
}
util.checkPrice = (value, typeText) => { // 零售标价，直采价，合法性
  let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
  if (!value) {
    return {is: 'N', msg: `请输入${typeText}价`}
  }
  let checkResult = reg.test(value)
  if (isNaN(Number(value)) || !checkResult) {
    // return {is: 'N', msg: `零售标价最多可输入8位数（不包括小数），可输入两位小数`}
    return {is: 'N', msg: `${typeText}价最多可输入8位数（不包括小数），可输入两位小数`}
  }
  return {is: 'Y', msg: `通过`}
}
util.checkStock = (value) => { // 库存合法性
  if (!value) {
    return {is: 'N', msg: '请填写库存'}
  }
  if (isNaN(Number(value)) || Number(value) < 1 || value % 1 !== 0) {
    return {is: 'N', msg: '请输入大于0的整数'}
  }
  return {is: 'Y', msg: '格式通过'}
}
util.checkGoodsCode = value => {
  let reg = /^([0-9]|[a-z]|[A-Z]){0,13}$/
  if (value) {
    if (!reg.test(value)) {
      return {is: 'N', msg: '商品编码长度最多为13位字母数字组合'}
    } else {
      return {is: 'Y', msg: '格式通过'}
    }
  } else {
    return {is: 'Y', msg: '商品编码为可选，格式通过'}
  }
}
export default util
