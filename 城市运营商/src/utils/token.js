const TokenKey = 'token'

export function getToken () {
  return window.sessionStorage.getItem(TokenKey)
}

export function setToken (token) {
  return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken () {
  return window.sessionStorage.removeItem(TokenKey)
}

export default function install (Vue, options) {
  Vue.prototype.getToken = () => {
    return window.sessionStorage.getItem(TokenKey)
  }

  Vue.prototype.setToken = (token) => {
    return window.sessionStorage.setItem(TokenKey, token)
  }

  Vue.prototype.removeToken = () => {
    return window.sessionStorage.removeItem(TokenKey)
  }

  Vue.prototype.setItem = (key, value) => {
    return window.sessionStorage.setItem(key, value)
  }
}
