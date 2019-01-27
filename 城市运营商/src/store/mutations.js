import * as types from './mutation-types'

export default {
  [types.MODIFYENTRY] (state, payload) {
    state.fromPlatform = payload
  }
}
