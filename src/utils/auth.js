import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const account='account'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

//存储登录进来的account
export function setAccount(username){
  return Cookies.set(account,username)
}
export function getAccount(){
  return Cookies.get(account)
}
