// qian5
export const goodInfo = state => state.goodInfo

export const setSize = state => state.setSize

export const commodityList = state => state.commodityList

export const goodPhoto = state => state.goodPhoto

export const goDownId = state => state.goDownId

export const goodShareInfo = state => state.goodShareInfo

export const helpId = state => state.helpId

export const addressId = state => state.addressId

export const commodity = state => state.commodity

export const orderState = state => state.orderState

export const orderIndex = state => state.orderIndex

export const recruitScrollY = state => state.recruitScrollY

export const modIndex = state => state.modIndex

export const myIndex = state => state.myIndex

export const submitId = state => state.submitId

export const currentId = state => state.currentId

export const orderInfo = state => state.orderInfo

// export const company = state => state.company

export const category = state => state.category

export const categoryId = state => state.categoryId

export const brandShow = state => {
  if (state.brandSku.length < 1) {
    return false
  }
  return true
}

export const brandSku = state => state.brandSku

export const chooseBrand = state => state.chooseBrand
export const specSku = state => state.specSku
export const isEditCate = state => state.isEditCate
export const skuArr = state => state.skuArr
