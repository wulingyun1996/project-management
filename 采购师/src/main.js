// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'
import Vuex from 'vuex'
import FastClick from 'fastclick'
import { loadDataPost } from 'api/ajax'
import { STATUS_OK } from 'api/status'
import { globalMixins } from 'mixins'
import { dev2Id, getDeviceParameter, getToken } from 'native'
import { setItem, isIPhoneX, isNeedFit, destroyComponent, getDevicePixelRatio } from 'common'
import { ToastPlugin, LoadingPlugin } from 'vux'
import 'css/global'
import 'css/transition'
import 'css/animation'
import './plugins'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(ToastPlugin, {
  position: 'middle',
  time: 3000,
  type: 'text'
})
Vue.use(LoadingPlugin)

FastClick.attach(document.body)

Vue.prototype.$http = loadDataPost
Vue.prototype.$isNeedFit = isNeedFit
Vue.prototype.$ok = STATUS_OK
Vue.prototype.$dev = dev2Id()
Vue.prototype.$isX = isIPhoneX()
Vue.prototype.$del = destroyComponent
Vue.prototype.$dpr = getDevicePixelRatio()
Vue.prototype.$deviceParameter = {}
// 弹窗提示
Vue.prototype.$t = function (t) {
  Vue.$vux.toast.show(t)
}
Vue.prototype.$back = function () {
  router.back()
}
Vue.prototype.$push = function (path) {
  router.push(path)
}
getToken()
  .then(res => {
    setItem('data', JSON.stringify(res))
    let { token = '', userId = '', account = '', opCityId = '', opProvinceId = '', nickname = '' } = res
    setItem('token', token)
    setItem('userId', userId)
    setItem('account', account)
    setItem('opCity', opCityId)
    setItem('opProvince', opProvinceId)
    setItem('nickname', nickname)
  })
  .catch(() => {
    //
  })
  .finally(() => {
    mountApp()
  })

function mountApp () {
  getDeviceParameter()
    .then(res => {
      Vue.prototype.$deviceParameter = res
    }).catch(() => {
      //
    })

  Vue.mixin(globalMixins)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
    // mounted () {
    //   this.$nextTick(() => {
    //     Vue.prototype.$touch = createTouch('#app', router, {
    //       slideDis: 4000
    //     })
    //   })
    // }
  })
}
