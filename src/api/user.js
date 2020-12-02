import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(account) {
  return request({
    url: '/getPersonInfo',
    method: 'get',
    params: { account }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getRoleList(data){
  return request({
    url:'/getRoleList',
    method:'post',
    data
  })
}
