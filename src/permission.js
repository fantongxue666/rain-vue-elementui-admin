import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' 
//修改标题到setting.js中修改
import getPageTitle from '@/utils/get-page-title'
//NProgress是封装的进度条
NProgress.configure({ showSpinner: false }) 

const whiteList = ['/login', '/auth-redirect'] // 路由白名单，即不登陆也可以访问
/**
 * beforeEach：全局钩子
 * to：router即将进入的路由对象
 * from：当前导航即将离开的路由
 * next：Function，进行管道中的一个钩子，如果执行完了，则导航的状态是confirmed（确认的），否则为false，终止导航
 */
router.beforeEach(async(to, from, next) => {
  // 请求路由时进度条开始
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录，这里的getToken（）就是上面导入的auth.js的getToken方法
  const hasToken = getToken()

  //如果存在token
  if (hasToken) {
    //并且请求的为登录页面，就让用户直接跳转到首页
    if (to.path === '/login') {
      next({ path: '/' })
      //关闭进度条
      NProgress.done() 
    } else {
      //如果用户存在token，且请求的不是登录页面，是其他页面，此处确定用户是否含有角色信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        //如果含有角色信息，信息拿到后，用户请求哪就跳哪
        next()
      } else {
        try {
          //如果存在token，但是没有角色信息，则是第一次登录，getInfo请求用户信息并存储
          const { roles } = await store.dispatch('user/getInfo')

          //根据后台返回数据（可访问的路由表）
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态挂载路由
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          console.log("获取roles失败，并返回登录页")
          // 删除token并跳转登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //如果登录的用户没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 判断用户请求的路由是否在白名单里，不是-1就说明存在白名单里，不管有没有token，都直接去到白名单路由对应的页面
      next()
    } else {
      // 如果页面不在白名单里，将重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 每次请求结束后，都关闭进度条
  NProgress.done()
})
