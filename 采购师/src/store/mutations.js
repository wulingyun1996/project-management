import * as types from './mutation-types'

export default {
  [types.SET_LIST_INFO] (state, payload) {
    state.listInfo = payload
  },
  [types.SET_AUTHEN_ROLE] (state, payload) {
    state.authenRole = payload
  },
  [types.SET_RECGOODS] (state, payload) {
    state.recGoods = payload
  },
  [types.SET_COMMENT_TEXT] (state, payload) {
    state.commentText = payload
  },
  [types.SET_SHOP_LIST] (state, payload) {
    state.shopList = payload
  },
  [types.MODIFYMESSAGESTATUS] (state, payload) {
    state.showUnreadMessage = payload
  },
  [types.SETALLIANCESTATISTICSDATALIST] (state, payload) {
    state.allianceStatisticsDataList = payload
  }
}
