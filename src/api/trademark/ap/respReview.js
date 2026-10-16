import request from '@/utils/request'

export function respReviewAdd(data) {
  return request({ url: '/respReview/add', method: 'post', data })
}

export function respReviewUpdate(data) {
  return request({ url: '/respReview/update', method: 'post', data })
}

export function respReviewSubmit(id) {
  return request({ url: `/respReview/submit/${id}`, method: 'post' })
}

export function respReviewApprove(id) {
  return request({ url: `/respReview/approve/${id}`, method: 'post' })
}

export function respReviewUnapprove(id) {
  return request({ url: `/respReview/unapprove/${id}`, method: 'post' })
}

export function respReviewSaveConfirm(data) {
  return request({ url: '/respReview/saveConfirm', method: 'post', data })
}

export function respReviewSubmitConfirm(data) {
  return request({ url: '/respReview/submitConfirm', method: 'post', data })
}

export function respReviewGetDetail(id) {
  return request({ url: `/respReview/get/${id}`, method: 'get' })
}

export function respReviewGetConfirmDetail(id) {
  return request({ url: `/respReview/getConfirm/${id}`, method: 'get' })
}

export function respReviewGetBrandInfo(brandId) {
  return request({ url: `/respReview/getBrandInfo/${brandId}`, method: 'get' })
}

export function respReviewCheckConflict(brandId) {
  return request({ url: `/respReview/checkConflict/${brandId}`, method: 'get' })
}
