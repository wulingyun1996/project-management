export default class Observer {
  constructor () {
    this._observer = {}
  }
  on (...rest) {
    let [type, callback] = rest
    if (!this._observer[type]) this._observer[type] = []
    this._observer[type].push(callback)
    return this
  }
  emit (...rest) {
    let [type, ...theme] = rest
    let subscribes = this._observer[type]
    for (let callback of subscribes) {
      callback.apply(this, theme)
    }
    return this
  }
}
