import axios from 'axios'
import { dev } from 'native'
import verifySign from './verify'
import { STATUS_OK, TOKEN_ERR } from './status'

export function loadDataPost (URL, obj) {
  const url = `${process.env.API_ROOT}v1/${URL}`
  let param = verifySign(obj)
  return axios({
    method: 'post',
    timeout: 15000,
    url: url,
    data: param,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Authorization': window.sessionStorage.getItem('token')
    }
  }).then((res) => {
    return res.data
  })
}

// axios.interceptors.request.use(function (config) {
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })

axios.interceptors.response.use(res => {
  if (res.data.code !== STATUS_OK) {
    if (res.data.code === TOKEN_ERR) {
      let currentDev = dev()
      try {
        if (currentDev === 'iOS') {
          window.webkit.messageHandlers.checkTokenFailed.postMessage('')
          return
        }
        if (currentDev === 'Android') {
          window.android.checkTokenFailed()
        }
      } catch (e) {
        //
      }
    }
  }
  return res
}, (error) => {
  return Promise.reject(error)
})
