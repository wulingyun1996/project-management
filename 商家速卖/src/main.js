import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import VueWechatTitle from 'vue-wechat-title'
import { ToastPlugin } from 'vux'
import LibFlexible from 'lib-flexible'
import fastclick from 'fastclick'

import App from './App'
import router from './router'
import store from './store'
import './plugins'

import { getToken } from 'api/init'
import { loadDataPost, STATUS_OK } from 'api/common'
import { setItem, isIPhoneX, destroyComponent, getDevicePixelRatio } from 'commons'
import { smallPic } from 'common/filters'
import { dev2Id } from 'common/js/dev'
import { globalMixins } from 'mixins'

import 'stylus/base'
import 'stylus/mixin'
import 'stylus/reset'
import 'stylus/transition'
import 'stylus/animation'

Vue.config.productionTip = false

let storex = new Vuex.Store({
  modules: {
    i18n: vuexI18n.store
  }
})

storex.registerModule('vux', {
  state: {
    demoScrollTop: 0
  },
  mutations: {
    updateDemoPosition (state, payload) {
      state.demoScrollTop = payload.top
    }
  },
  actions: {
    updateDemoPosition ({commit}, top) {
      commit({type: 'updateDemoPosition', top: top})
    }
  }
})

fastclick.attach(document.body)

Vue.mixin(globalMixins)

Vue.filter('smallPic', smallPic)
Vue.use(LibFlexible)
Vue.use(Vuex)
Vue.use(VueWechatTitle)
Vue.use(ToastPlugin, {
  position: 'middle',
  time: 3000,
  type: 'text'
})
Vue.use(vuexI18n.plugin, storex)

Vue.prototype.$axios = axios
Vue.prototype.$http = loadDataPost
Vue.prototype.$ok = STATUS_OK
Vue.prototype.$dev = dev2Id()
Vue.prototype.$isX = isIPhoneX()
Vue.prototype.$del = destroyComponent
Vue.prototype.$dpr = getDevicePixelRatio()
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
    let { token = '', userId = '', account = '' } = res
    setItem('token', token)
    setItem('userId', userId)
    setItem('account', account)
    // setItem('opCity', opCityId)
    // setItem('opProvince', opProvinceId)
    // setItem('nickname', nickname)
  })
  .catch(() => {
    //
  })
  .finally(() => {
    mountApp()
  })

function mountApp () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    mounted () {
      window.addEventListener('resize', () => {
        if (document.activeElement.tagName === 'INPUT') {
          setTimeout(() => {
            document.activeElement.scrollIntoViewIfNeeded()
          }, 100)
        }
      })
      // document.body.addEventListener('click', function (e) {
      //   const input = document.querySelectorAll('input')
      //   const textarea = document.querySelectorAll('textarea')
      //   input.forEach(item => {
      //     if (e.target.nodeName !== 'INPUT') {
      //       item.blur()
      //     }
      //   })
      //   textarea.forEach(item => {
      //     if (e.target.nodeName !== 'TEXTAREA') {
      //       item.blur()
      //     }
      //   })
      // })
    }
  })
}