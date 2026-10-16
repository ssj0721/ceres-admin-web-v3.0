import request from '@/utils/request'

export function defenseAdd(data) {
  return request({ url: '/defense/add', method: 'post', data })
}

export function defenseUpdate(data) {
  return request({ url: '/defense/update', method: 'post', data })
}

export function defenseSubmit(id) {
  return request({ url: `/defense/submit/${id}`, method: 'post' })
}

export function defenseApprove(id) {
  return request({ url: `/defense/approve/${id}`, method: 'post' })
}

export function defenseUnapprove(id) {
  return request({ url: `/defense/unapprove/${id}`, method: 'post' })
}

export function defenseSaveConfirm(data) {
  return request({ url: '/defense/saveConfirm', method: 'post', data })
}

export function defenseSubmitConfirm(data) {
  return request({ url: '/defense/submitConfirm', method: 'post', data })
}

export function defenseGetDetail(id) {
  return request({ url: `/defense/get/${id}`, method: 'get' })
}

export function defenseGetConfirmDetail(id) {
  return request({ url: `/defense/getConfirm/${id}`, method: 'get' })
}

export function defenseGetBrandInfo(brandId) {
  return request({ url: `/defense/getBrandInfo/${brandId}`, method: 'get' })
}

export function defenseCheckConflict(brandId) {
  return request({ url: `/defense/checkConflict/${brandId}`, method: 'get' })
}
