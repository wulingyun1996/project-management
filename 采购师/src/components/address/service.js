import map from 'array-map'
import find from 'array-find'
import filter from 'array-filter'

const specialMap = {
  '北京市': '110100',
  '天津市': '120100',
  '上海市': '310100',
  '重庆市': '500100'
}
export function name2Id (name, list) {
  let rs = map(name, (one, index) => {
    let parent = ''
    if (index === 2) {
      // 可能存在区名一样的情况，比如南山区
      parent = find(list, item => {
        return item.name === name[1]
      }) || { value: '__' }
      if (specialMap[name[0]]) {
        parent = {
          value: specialMap[name[0]]
        }
      }
      return find(list, item => {
        return item.name === one && item.parent === parent.value
      })
    } else {
      if (index === 1 && specialMap[name[0]]) {
        return {
          value: specialMap[name[0]]
        }
      }
      return find(list, item => {
        return item.name === one
      })
    }
  })

  return map(rs, one => {
    return one ? one.value : '__'
  }).join(' ')
}

export function id2Name (value, list, delimiter) {
  if (value && !list.length) {
    return ''
  }
  if (!delimiter) {
    delimiter = ' '
  }

  let rs = map(value, (one, index) => {
    if (list.length && Object.prototype.toString.call(list[0]) === '[object Array]') {
      return find(list[index], item => {
        return item.value === one
      })
    } else {
      return find(list, item => {
        return item.value === one
      })
    }
  })
  rs = rs.filter(one => {
    return typeof one !== 'undefined'
  })
  return map(rs, one => {
    return one.name
  }).join(delimiter).replace('--', '')
}

/**
 * @param {String} value
 * @param {Array} list 地址列表
 * @return {Array}
 */
export function getChildren (value, list) {
  return filter(list, item => {
    return item.parent === value
  })
}
