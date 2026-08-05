import request from '@/utils/request'

export function login (data) {
  return request({
    url: 'admin/login',
    method: 'post',
    data,
  })
}

export function resetPassword (data) {
  return request({
    url: 'admin/forgetPassword',
    method: 'post',
    data,
  })
}

export function adminBuild (data) {
  return request({
    url: 'admin/build',
    method: 'post',
    data,
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post',
  })
}

// 获取短信验证码
export function getCode (data) {
  return request({
    url: 'admin/getCode',
    method: 'post',
    data,
  })
}

// 获取登录审款的token
export function getSKtoken () {
  return request({
    url: 'admin/getSKtoken',
    method: 'get',
  })
}

// 获取登录审款的主域名网址
export function getIframeUrl () {
  return request({
    url: 'admin/getIframeUrl',
    method: 'get',
  })
}

// 修改密码
export function changePwd (data) {
  return request({
    url: '/platform_user/updatePassword',
    method: 'post',
    data,
  })
}

// 修改头像
export function changeHeader (data) {
  return request({
    url: '/platform_user/updateAvatar',
    method: 'post',
    data,
  })
}

// 根据userId获取用户权限
export function getUserInfo (data) {
  return request({
    url: '/platform_user/findUserRole',
    method: 'post',
    data,
  })
}

// 获取iRetail用户信息
export function getUserInfo_iRetail () {
  return request({
    url: '',
    method: 'post',
    timeout: 1800000,
    data: {
      method: 'getuserinfo@retail.sys.user',
      params: {}
    }
  });
}

// 查询是否强制sso登录
export function checkForceSSO () {
  return request({
    url: '/admin/maxkeyForce',
    method: 'get'
  })
}

// 保存点击菜单的记录
export function saveMenuHist (data) {
  return request({
    url: '/admin/saveMenuHist',
    method: 'post',
    data
  })
}

// 获取登录查货的主域名网址
export function getEtdsIframeUrl () {
  return request({
    url: 'admin/getEtdsIframeUrl',
    method: 'get',
  })
}