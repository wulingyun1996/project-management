export const mixins = {
  methods: {
    // 选择全部
    selectAll () {
      this.isCheckAll = !this.isCheckAll
      this.checkArr(this.quotation, this.isCheckAll)
    },
    // 判断某个节点是否全选
    checkSelectAll (arr) {
      let flag = true
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].checked) {
          flag = false
          break
        }
      }
      return flag
    },
    // 对数组和其子数组进行选中操作
    checkArr (arr, flag) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = flag
        for (let o in arr[i]) {
          if (Array.isArray(arr[i][o]) && o !== 'title') {
            this.checkArr(arr[i][o], flag)
          }
        }
      }
    },
    // 选择店铺
    selectShop (item) {
      item.checked = !item.checked
      this.checkArr(item.goodsInfo, item.checked)
      this.isCheckAll = this.checkSelectAll(this.quotation)
    },
    // 选择商品
    selectGood (good, item) {
      good.checked = !good.checked
      this.checkArr(good.kinds, good.checked)
      item.checked = this.checkSelectAll(item.goodsInfo)
      this.isCheckAll = this.checkSelectAll(this.quotation)
    },
    // 选择规格
    selectKind (kind, kinds, good, item) {
      kind.checked = !kind.checked
      good.checked = this.checkSelectAll(kinds)
      item.checked = this.checkSelectAll(item.goodsInfo)
      this.isCheckAll = this.checkSelectAll(this.quotation)
    }
  }
}

// 从数组中移除选中或未选择的商品 false 移除未选择的
export function removeUnselect (arr, flag = false) {
  for (let i = arr.length - 1; i > -1; i--) {
    for (let j = arr[i].goodsInfo.length - 1; j > -1; j--) {
      for (let k = arr[i].goodsInfo[j].kinds.length - 1; k > -1; k--) {
        if (arr[i].goodsInfo[j].kinds[k].checked === flag) {
          arr[i].goodsInfo[j].kinds.splice(k, 1)
        }
      }
      if (arr[i].goodsInfo[j].kinds.length === 0) {
        arr[i].goodsInfo.splice(j, 1)
      }
    }
    if (arr[i].goodsInfo.length === 0) {
      arr.splice(i, 1)
    }
  }
}

export function solove (a, b, dig) {
  if (dig === '+') {
    return parseFloat((a + b).toFixed(10))
  }
  if (dig === '-') {
    return parseFloat((a - b).toFixed(10))
  }
  if (dig === '*') {
    return parseFloat((a * b).toFixed(10))
  }
  if (dig === '/') {
    return parseFloat((a / b).toFixed(10))
  }
}

// 对佣金进行四舍五入
export function formatCommission (num) {
  num = num + ''
  if (num.indexOf('.') !== -1) {
    let temp = num.split('.')[1]
    if (temp.length === 1) {
      num = num + '0'
    } else if (temp.length > 2) {
      num = solove(Math.round(solove(num, 100, '*')), 100, '/') + ''
      let a = num.split('.')[1]
      if (!a) {
        a = '00'
      } else {
        if (a.length === 1) {
          a = a + '0'
        } else if (a.length > 2) {
          a = a.substr(0, 2)
        }
      }
      num = num.split('.')[0] + '.' + a
      return num
    }
    return num
  } else {
    num = num + '.00'
    return num
  }
}

// 格式化价格：保留两位小数
export function formatPrice (num) {
  num = num + ''
  if (num.indexOf('.') !== -1) {
    if (num.split('.')[1].length !== 2) {
      num = num + '0'
    }
    return num
  } else {
    num = num + '.00'
    return num
  }
}

// 判断是否选择数组某一项
export function isSelectArr (arr) {
  if (arr.length === 0) return false
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked) {
        return true
      }
      for (let j = 0; j < arr[i].goodsInfo.length; j++) {
        if (arr[i].goodsInfo[j].checked) {
          return true
        }
        for (let k = 0; k < arr[i].goodsInfo[j].kinds.length; k++) {
          if (arr[i].goodsInfo[j].kinds[k].checked) {
            return true
          }
        }
      }
    }
  }
  return false
}

// 计算区间报价商品总和
export function totalNum (arr, flag = true) {
  let total = 0
  arr.map(i => {
    if (flag) {
      if (i.checked) {
        total += i.count
      }
    } else {
      total += i.count
    }
  })
  return total
}
// 计算总的价格数量等
export function calcTotal (arr, flag = true) {
  let price = 0
  let number = 0
  let kinds = 0
  let commission = 0
  let amount = 0
  let hasNotFlashGoods = false
  let payMoney = 0
  // 订单数量
  let orderNumber = 0
  orderNumber = arr.length
  if (orderNumber > 0) {
    arr.map(i => {
      i.goodsInfo.map(j => {
        amount += 1
        j.kinds.map(k => {
          if (flag) {
            if (k.checked) {
              if (j.goods_type === 1) {
                price = solove(price, solove(k.count, k.price, '*'), '+')
                commission += 0
              } else {
                hasNotFlashGoods = true
                if (j.price_type === 0) {
                  if (k.svip_price) {
                    price = solove(price, solove(k.count, k.svip_price, '*'), '+')
                    commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                  } else {
                    // 修改为零售限价
                    price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                    // price = solove(price, solove(k.count, k.purchase_price, '*'), '+')
                    commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                  }
                } else {
                  let total = totalNum(j.kinds)
                  let item = resultPrice(total, j.intervalPrice, k)
                  if (k.svip_price) {
                    let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                    let tempPrice = formatCommission(solove(item.purchase_price, solove(solove(item.promotion_price, item.purchase_price, '-'), k.one_discount, '*'), '-'))
                    price = solove(price, solove(k.count, tempPrice, '*'), '+')
                    commission = solove(commission, solove(k.count, temp, '*'), '+')
                  } else {
                    price = solove(price, solove(k.count, item.purchase_price, '*'), '+')
                    commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                  }
                }
              }
              kinds++
              number += Number(k.count)
            }
          } else {
            if (j.goods_type === 1) {
              price = solove(price, solove(k.count, k.price, '*'), '+')
              commission += 0
            } else {
              hasNotFlashGoods = true
              if (j.price_type === 0) {
                if (k.svip_price) {
                  price = solove(price, solove(k.count, k.svip_price, '*'), '+')
                  commission = solove(commission, solove(k.count, formatCommission(solove(solove(k.promotion_price, k.purchase_price, '-'), solove(1, k.one_discount, '+'), '*')), '*'), '+')
                } else {
                  price = solove(price, solove(k.count, k.promotion_price, '*'), '+')
                  commission = solove(commission, solove(k.count, solove(k.promotion_price, k.purchase_price, '-'), '*'), '+')
                }
              } else {
                let total = totalNum(j.kinds)
                let item = resultPrice(total, j.intervalPrice, k)
                if (k.svip_price) {
                  let temp = formatCommission(solove(solove(item.promotion_price, item.purchase_price, '-'), solove(1, k.one_discount, '+'), '*'))
                  let tempPrice = formatCommission(solove(item.purchase_price, solove(solove(item.promotion_price, item.purchase_price, '-'), k.one_discount, '*'), '-'))
                  price = solove(price, solove(k.count, tempPrice, '*'), '+')
                  commission = solove(commission, solove(k.count, temp, '*'), '+')
                } else {
                  price = solove(price, solove(k.count, item.purchase_price, '*'), '+')
                  commission = solove(commission, solove(k.count, solove(item.promotion_price, item.purchase_price, '-'), '*'), '+')
                }
              }
            }
            kinds++
            number += Number(k.count)
          }
        })
      })
    })
  }
  payMoney = price - commission
  return {
    totalAmount: amount,
    totalPrice: price,
    totalNumber: number,
    totalKinds: kinds,
    totalCommission: commission,
    totalSavedMoney: commission,
    hasNotFlashGoods,
    payMoney,
    orderNumber
  }
}

// 选取区间价格
export function resultPrice (count, arr, k, hasSelect, flag = true) {
  let item = {}
  if (!arr || arr.length === 0) {
    item.promotion_price = k.promotion_price
    item.purchase_price = k.purchase_price
    return item
  }
  if (hasSelect) {
    if (flag) {
      for (let i = arr.length - 1; i > -1; i--) {
        if (count >= arr[i].purchase_amount) {
          item = arr[i]
          return item
        }
      }
      item = arr[0]
      return item
    } else {
      item = arr[0]
      return item
    }
  } else {
    for (let i = arr.length - 1; i > -1; i--) {
      if (count >= arr[i].purchase_amount) {
        item = arr[i]
        return item
      }
    }
    item = arr[0]
    return item
  }
}

// 判断数组中间是否存在和item.id一样的
function checkResult (item, arr) {
  if (arr.length === 0) return -1
  for (let i = 0; i < arr.length; i++) {
    if (item.goods_id === arr[i].goods_id) {
      return i
    }
  }
  return -1
}

// 初始化数据
export function formatArr (data, self) {
  data.map(i => {
    const arr = []
    self.$set(i, 'checked', self.isCheckAll)
    self.$set(i, 'shopName', i.shop_name)
    self.$set(i, 'seller_id', i.seller_id)
    self.$set(i, 'shop_id', i.shop_id)
    i.goodsInfo.map(j => {
      if (j.flag === 1) {
        let index = checkResult(j, arr)
        if (index === -1) {
          arr.push({
            goods_id: j.goods_id,
            goods_name: j.goods_name,
            goods_type: j.goods_type,
            goods_img: j.image_path,
            buy_number: j.buy_number,
            is_stock_good: j.is_stock_good,
            checked: self.isCheckAll,
            intervalPrice: j.intervalPrice,
            price_type: j.price_type,
            kinds: [
              {
                id: j.id,
                count: j.goods_num,
                flag: j.flag,
                purchase_price: j.purchase_price,
                promotion_price: j.promotion_price,
                price: j.price,
                title: j.title,
                max_price: j.max_price,
                goods_unit: j.goods_unit,
                one_discount: j.one_discount,
                svip_price: j.svip_price,
                identity: j.identity,
                checked: self.isCheckAll,
                spec_key: j.spec_key
              }
            ]
          })
        } else {
          arr[index].kinds.push({
            id: j.id,
            count: j.goods_num,
            flag: j.flag,
            purchase_price: j.purchase_price,
            promotion_price: j.promotion_price,
            price: j.price,
            title: j.title,
            goods_unit: j.goods_unit,
            one_discount: j.one_discount,
            svip_price: j.svip_price,
            identity: j.identity,
            max_price: j.max_price,
            checked: self.isCheckAll,
            spec_key: j.spec_key
          })
        }
      }
    })
    i.goodsInfo = arr
  })
  for (let i = data.length - 1; i > -1; i--) {
    if (data[i].goodsInfo.length === 0) {
      data.splice(i, 1)
    }
  }
  return data
}
