import axios from 'axios'
import verifySign from './verify'
import { STATUS_OK, TOKEN_ERR, LOGIN_ERR } from './status'
import { getToken, removeToken } from 'utils/token'
import { Message, MessageBox } from 'element-ui'

export default function loadDataPost (URL, obj, rootUrl = process.env.VUE_APP_API_ROOT, method = 'post') {
  const url = `${rootUrl}${URL}`
  let param = verifySign(obj)
  return axios({
    method,
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
      'Authorization': getToken('token')
    }
  }).then((response) => {
    return response
  })
}
axios.interceptors.response.use(response => {
  let res = response.data
  let code = res.code
  if (code !== STATUS_OK) {
    // token 失效
    if (code === TOKEN_ERR) {
      MessageBox.alert('登录失效请重新登录', '提示', {
        confirmButtonText: '重新登录',
        type: 'warning',
        showClose: false
      }).then(() => {
        removeToken('token')
        window.location.href = '/login'
      }).catch(() => {
        console.log('token 清空出错')
      })
    }
    // 账号被停用
    if (code === LOGIN_ERR) {
      MessageBox.confirm(`唉呀！您的账号已被停用如有疑问,请联系商服 商服热线：${res.msg}`, '提示', {
        confirmButtonText: '',
        cancelButtonText: '',
        type: 'error',
        center: true
      }).then(() => {
        removeToken('token')
        window.location.href = '/login'
      }).catch(() => {
        //
      })
    }
  }
  return res
}, (error) => {
  Message({
    message: error.message,
    type: 'error',
    duration: 3000
  })
  return Promise.reject(error)
})
