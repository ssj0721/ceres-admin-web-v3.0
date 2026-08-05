import router from './router'
import store from './store'
import { ElMessage as Message } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getUserId, getToken, removeToken} from '@/utils/auth' // get token from cookie
import { adminBuild } from '@/api/user.js'
import { filterAsyncRouter } from '@/store/modules/permission.js'
import getPageTitle from '@/utils/get-page-title'
import { UserActionEnum } from './store/modules/user/state'
import { etdsRoutes } from '@/utils/auth'
NProgress.configure({
  showSpinner: false,
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  if ((from.query && from.query.embed === '1') && !(to.query && Object.prototype.hasOwnProperty.call(to.query, 'embed'))) {
    next({
      ...to,
      query: {
        ...to.query,
        embed: from.query.embed,
      },
      replace: true,
    })
    NProgress.done()
    return
  }
  // set page title
  document.title = getPageTitle(to.meta.title)

  // 如果是认证中心登录, 直接清空token, 防止报token失效的错误
  if(to.query.maxkey && to.path === '/login') {
    removeToken()
    localStorage.clear()
  }

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/',
      })
      NProgress.done()
    } else {
      // if (store.getters.routers.length === 0) {}
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   console.log('hasGetUserInfo')
      //   // console.log('hasGetUserInfo', hasGetUserInfo)
      //   next()
      // }
      if (store.getters.routers.length === 0) {
        // 条件加载
        await loadMenus(next, to)
        store.commit('SET_LOAD', true)
      } else if (!store.getters.hasLoad) {
        // 是否加载过动态路由
        // // 修改hasLoad为false，防止死循环
        await loadMenus(next, to)
        store.commit('SET_LOAD', true)
      } else {
        try {
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch(UserActionEnum.RESET_TOKEN)
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      console.log('no token')
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      const q = to.query || {}
      const extra = {}
      if (q.maxkey) extra.maxkey = q.maxkey
      if (q.embed) extra.embed = q.embed
      if (q.parentOrigin) extra.parentOrigin = q.parentOrigin
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
          ...extra
        }
      })
      NProgress.done()
    }
  }
})

export const loadMenus = async (next, to) => {
  const adminRes = await adminBuild({ platformUserId: getUserId() })
  console.log('adminRes',adminRes);
  // 这里过滤路由是不会过滤顶层路由的
  const asyncRouter = filterAsyncRouter(adminRes.data)

  // 获取后端返回的权限路径集合，用于判断用户是否拥有特定路由权限
  const userPermissionPaths = new Set()
  const collectPermissionPaths = (routes) => {
    routes.forEach(route => {
      if (route.path) {
        userPermissionPaths.add(route.path)
      }
      if (route.children && route.children.length > 0) {
        collectPermissionPaths(route.children)
      }
    })
  }
  collectPermissionPaths(adminRes.data)

  // 需要处理成顶级路由的路径和对应组件配置
  const specialRoutes = etdsRoutes
  console.log('asyncRouter',asyncRouter);
  // 根据用户权限，添加特殊路由
  specialRoutes.forEach(route => {
    if (userPermissionPaths.has(route.permissionPath)) {
      const { ...routeConfig } = route
      asyncRouter.push(routeConfig)
    }
  })

  // 画布设置
  asyncRouter.forEach((item) => {
    if (item.path.indexOf('.html') !== -1) {
      item.path = item.path + '?' + getToken()
    }
  })

  // 异常跳转添加
  asyncRouter.push({ path: '*', redirect: '/404', hidden: true })

  await store.dispatch('GenerateRoutes', asyncRouter).then(() => {
    // 存储路由
    // 动态添加可访问路由表
    asyncRouter.forEach((route) => {
      if (route.path.indexOf('/') === -1 || route.path.indexOf('http') === 0) {
        route.path = '/' + route.path
      }
      router.addRoute(route);
    });
    next({ ...to, replace: true })
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
