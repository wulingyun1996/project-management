import * as types from './mutation-types'

export default {
  handler: () => {},
  [types.MODIFYMESSAGESTATUS] ({ commit }, payload) {
    if (!payload) {
      setTimeout(() => {
        commit(types.MODIFYMESSAGESTATUS, payload)
      }, 200)
      return
    }
    commit(types.MODIFYMESSAGESTATUS, payload)
  }
}
