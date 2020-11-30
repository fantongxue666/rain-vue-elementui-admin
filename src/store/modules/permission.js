import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role';
import { getToken, setToken, removeToken, setAccount, getAccount } from '@/utils/auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let accessRoutes=[]
      getRoutes(getAccount()).then(response => {
        //组装动态路由
         accessRoutes=getTreeRoutes(response.data,0)
        commit('SET_ROUTES',accessRoutes)
        resolve(accessRoutes)
      })
      
     
    })
  }
}

/**
 * 生成动态路由层级列表
 */
export function getTreeRoutes(list, parentId) {
  
  const children=[]
  list.forEach(item=>{
    const res=dataToRoutes(item)
    //如果是一级节点
    if(item.parentid===parentId){
      //设置该元素的子元素
      res.children=getTreeRoutes(list,item.id)
      children.push(res)
    }
  })
  return children
}

/**
 * 将data转为路由格式
 */
export function dataToRoutes(data){
  return {
    path:data.url,
    name:data.name,
    component:() => import(data.component),
    meta:{
      title:data.name,
      icon:data.icon ? data.icon : 'icon'
    },
    children:[]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
