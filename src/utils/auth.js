import Cookies from 'js-cookie'
// import { getUserInfo } from '@/api/user'
const TokenKey = 'cereShopAdminToken'
const roleName = 'roleName'
const platformUser = 'platformUserId'
const userAvatar = 'avatar'
const userName = 'username'
const reportKey = 'Reportsvrauth'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function getUserName () {
  return localStorage.getItem(userName)
}

export function getUserId () {
  return localStorage.getItem(platformUser)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
export function setEtdsToken (token) {
  return localStorage.setItem('storage_key_etds_token', token)
}

export function setReportKey (key) {
  return Cookies.set(reportKey, key)
}

export function setName (name) {
  return localStorage.setItem(roleName, name)
}

export function setUserName (username) {
  return localStorage.setItem(userName, username)
}

export function setUserId (platformUserId) {
  return localStorage.setItem(platformUser, platformUserId)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function setUserAvatar (avatar) {
  return localStorage.setItem(userAvatar, avatar)
}

export function getUserAvatar () {
  return localStorage.getItem(userAvatar)
}

// 设置一些特殊的权限判断用于防止请求拦截器拦截查货的数据
// 检查是否为查货用户
export function isEtdsUser () {
  const etdsUserStr = localStorage.getItem('storage_key_etds')
  return !!etdsUserStr // 如果有值，表示是查货用户
}
export const etdsRoutes = [
  {
    path: '/etds/licHomePage',
    name: 'LicHomePage',
    component: () => import('@/views/etds/licZcChahuo/licHomePage.vue'),
    meta: {
      title: '自查报告',
    },
    hidden: true,
    permissionPath: '/etds/licZcChahuo' // 对应权限表中的路径
  },
  {
    path: '/etds/licZcReport',
    name: 'LicZcReport',
    component: () => import('@/views/etds/licZcChahuo/licZcReport/index.vue'),
    meta: {
      title: '写报告',
    },
    hidden: true,
    permissionPath: '/etds/licZcChahuo'
  },
  {
    path: '/etds/licZcAudit',
    name: 'LicZcAudit',
    component: () => import('@/views/etds/licZcAudit/index.vue'),
    meta: {
      title: '写报告',
    },
    hidden: true,
    permissionPath: '/etds/licZcChahuo'
  },
  {
    path: '/etds/GcHomePage',
    name: 'GcHomePage',
    component: () => import('@/views/etds/GcZcCfm/GcHomePage.vue'),
    meta: {
      title: '工厂报告',
    },
    hidden: true,
    permissionPath: '/etds/GcZcCfm'
  },
  {
    path: '/etds/GcZcReport',
    name: 'GcZcReport',
    component: () => import('@/views/etds/GcZcCfm/GcZcReport/index.vue'),
    meta: {
      title: '写报告',
    },
    hidden: true,
    permissionPath: '/etds/GcZcCfm'
  },
]


//在这里面去引用user.js会导致形成了 auth.js ↔ user.js 互相引用的循环依赖，因为user.js里面引用了request，而request引用了auth.js
//现转到etds.js文件
// export async function checkEtdsRole () {
//   const res = await getUserInfo({
//     platformUserId: parseInt(getUserId())
//   })
//   return res.data.data
// }