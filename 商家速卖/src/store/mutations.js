import * as types from './mutation-types'

const mutations = {
  [types.GOOD_INFO](state, goodInfo) {
    state.goodInfo = goodInfo
  },
  [types.SET_SIZE](state, setSize) {
    state.setSize = setSize
  },
  [types.COMMODITY_LIST](state, commodityList) {
    state.commodityList = commodityList
  },
  [types.GOODPHOTO](state, goodPhoto) {
    state.goodPhoto = goodPhoto
  },
  [types.GODOWNID](state, goDownId) {
    state.goDownId = goDownId
  },
  [types.GOODSHAREINFO](state, goodShareInfo) {
    state.goodShareInfo = goodShareInfo
  },
  [types.HELPID](state, helpId) {
    state.helpId = helpId
  },
  [types.ADDRESSID](state, addressId) {
    state.addressId = addressId
  },
  [types.COMMODITY](state, commodity) {
    state.commodity = commodity
  },
  [types.SET_ORDER_STATE](state, orderState) {
    state.orderState = orderState
  },
  [types.SET_ORDER_INDEX](state, orderIndex) {
    state.orderIndex = orderIndex
  },
  [types.SET_ORDER_INFO](state, orderInfo) {
    state.orderInfo = orderInfo
  },
  [types.RECRUITSCROLLY](state, recruitScrollY) {
    state.recruitScrollY = recruitScrollY
  },
  [types.MOD_INDEX](state, modIndex) {
    state.modIndex = modIndex
  },
  [types.MY_INDEX](state, myIndex) {
    state.myIndex = myIndex
  },
  [types.SUBMIT_ID](state, submitId) {
    state.submitId = submitId
  },
  [types.CURRENT_ID](state, currentId) {
    state.currentId = currentId
  },
  // [types.COMPANY](state, company) {
  //   state.company = company
  // },
  [types.CATEGORY](state, category) {
    state.category = category
  },
  [types.CATEGORY_ID](state, categoryId) {
    state.categoryId = categoryId
  },
  [types.BRANDSHOW](state, brandShow) {
    state.brandShow = brandShow
  },
  [types.BRANDSKU](state, brandSku) {
    state.brandSku = brandSku
  },
  [types.CHOOSEBRAND](state, chooseBrand) {
    state.chooseBrand = chooseBrand
  },
  [types.SKUSHOW](state, skuShow) {
    state.skuShow = skuShow
  },
  [types.SET_EDIT_CATEGORY](state, isEditCate) {
    state.isEditCate = isEditCate
  },
  GOODSSPEC(state, spec) {
    state.specSku = spec
  },
  SetShowRecommend(state, isShow) {
    state.isShowRecommend = isShow
  },
  SetUnionWhichAct(state, num) {
    state.whichActivity = num
  },
  // edit-goods
  [types.MODEDATA](state, modeData) {
    state.modeData = Object.assign({}, state.modeData, modeData)
  },
  [types.CLEARMODEDATA](state) {
    state.modeData = {}
  },
  [types.ADDALLIANCE](state, payload) {
    state.allianceList = payload
  },
  [types.ADDALLIANCENAME](state, payload) {
    state.allianceName = payload
  },
  [types.SAVAACTIVITY](state, payload) {
    state.establishActivity = payload
  },
  [types.MODIFYTABNUMBER](state, payload) {
    state.isModifyTabNumber = payload
  },
  [types.SETALLIANCESTATISTICSDATALIST](state, payload) {
    state.allianceStatisticsDataList = payload
  }
}
export default mutations
