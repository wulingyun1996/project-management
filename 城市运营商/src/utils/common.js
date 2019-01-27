/**
 * checkout-mobile
 * @param {String} phoneNumber
 * @return {Boolean}
 */
export function checkPhoneNumber (phoneNumber) {
  let reg = /^1[3-9][0-9]{9}$/
  return reg.test(phoneNumber)
}
export function initTime (t) {
  let time = t.split(/[- :]/)
  let [year, month, day, hours = 0, minutes = 0, seconds = 0] = time
  let currentTime = new Date(year, month - 1, day, hours, minutes, seconds)
  return currentTime.getTime()
}
// 首页广告轮播格式化图文编辑器内容
export function splitEditContent (c) {
  let formatedContent = []
  // 匹配换行
  let regNewLine = /\n/g
  // 移除 空格 和 p 标签
  let regRemoveSpace = /<p>|<\/p>|&nbsp;/gi
  // 匹配 img 标签
  let regImageTag = /<img.*?src=[\'|\"](.*?(?:[\.gif|\.jpg|\.png]))[\'|\"].*?[\/]?>/gi
  // 匹配 img 标签 src 属性
  let regScrOfImage = /^http:\/\/\w+\.gif|\.jpg|\.png|\.jpeg/
  // 分割 p 标签个数，用于确定换行标签个数
  let contentArray = c.split(regNewLine)
  let length = contentArray.length
  contentArray.forEach((pTag, pIndex) => {
    let removedSpace = pTag.replace(regRemoveSpace, '')
    let splitedContent = removedSpace.split(regImageTag)
    splitedContent.forEach(item => {
      // 排除空格
      if (item) {
        let obj = {}
        obj.content = item
        obj.extent = null
        if (regScrOfImage.test(item)) {
          obj.type = 'img'
        } else {
          obj.type = 'text'
        }
        formatedContent.push(obj)
      }
    })
    if (pIndex !== length - 1) {
      let obj = {}
      obj.type = 'newLine'
      obj.content = '<br/>'
      formatedContent.push(obj)
    }
  })
  return formatedContent
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
