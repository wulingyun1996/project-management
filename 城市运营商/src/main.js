import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from 'api'
import { STATUS_OK } from 'api/status'
import { showMessage, showMessageBox } from 'utils'
import operateToken from 'utils/token'
import 'icons'

import 'css/global'
import 'css/element'
import 'css/transition'
import 'normalize.css/normalize'

import './plugins/element'
import './plugins/element-egrid'
import './plugins/globalComponent'

Vue.use(operateToken)

Vue.prototype.$http = http
Vue.prototype.$ok = STATUS_OK
Vue.prototype.$mes = showMessage
Vue.prototype.$mesBox = showMessageBox
Vue.prototype.$back = function () {
  router.back()
}
Vue.prototype.$push = function (payload) {
  router.push(payload)
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
