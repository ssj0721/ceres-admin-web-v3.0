import request from '@/utils/request'

export function oppositionAdd(data) {
  return request({ url: '/opposition/add', method: 'post', data })
}

export function oppositionUpdate(data) {
  return request({ url: '/opposition/update', method: 'post', data })
}

export function oppositionSubmit(id) {
  return request({ url: `/opposition/submit/${id}`, method: 'post' })
}

export function oppositionApprove(id) {
  return request({ url: `/opposition/approve/${id}`, method: 'post' })
}

export function oppositionUnapprove(id) {
  return request({ url: `/opposition/unapprove/${id}`, method: 'post' })
}

export function oppositionSaveConfirm(data) {
  return request({ url: '/opposition/saveConfirm', method: 'post', data })
}

export function oppositionSubmitConfirm(data) {
  return request({ url: '/opposition/submitConfirm', method: 'post', data })
}

export function oppositionGetDetail(id) {
  return request({ url: `/opposition/get/${id}`, method: 'get' })
}

export function oppositionGetConfirmDetail(id) {
  return request({ url: `/opposition/getConfirm/${id}`, method: 'get' })
}

export function oppositionGetBrandInfo(brandId) {
  return request({ url: `/opposition/getBrandInfo/${brandId}`, method: 'get' })
}

export function oppositionCheckConflict(brandId) {
  return request({ url: `/opposition/checkConflict/${brandId}`, method: 'get' })
}
