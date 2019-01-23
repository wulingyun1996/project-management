import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import actions from './actions'
Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  getters,
  actions
})
