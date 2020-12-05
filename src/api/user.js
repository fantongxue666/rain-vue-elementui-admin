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

export function addRoleUser(data){
  return request({
    url:'/addRoleUser',
    method:'post',
    data
  })
}
export function updateRoleUser(data){
  return request({
    url:'/updateRoleUser',
    method:'post',
    data
  })
}
export function deleteRoleUser(id){
  return request({
    url:'/deleteRoleUser',
    method:'get',
    params:{id}
  })
}

export function getMenuByRole(roleid){
  return request({
    url:'/getMenuByRole',
    method:'get',
    params:{roleid}
  })
}


export function saveRoles(roleid,powerids){
  return request({
    url:'/saveRoles?roleid='+roleid+'&powerids='+powerids,
    method:'get'
  })
}


export function getAuthUserList(data){
  return request({
    url:'/getAuthUserList',
    method:'post',
    data
  })
}