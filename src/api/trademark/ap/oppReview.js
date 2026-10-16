import request from '@/utils/request'

export function oppReviewAdd(data) {
  return request({ url: '/oppReview/add', method: 'post', data })
}

export function oppReviewUpdate(data) {
  return request({ url: '/oppReview/update', method: 'post', data })
}

export function oppReviewSubmit(id) {
  return request({ url: `/oppReview/submit/${id}`, method: 'post' })
}

export function oppReviewApprove(id) {
  return request({ url: `/oppReview/approve/${id}`, method: 'post' })
}

export function oppReviewUnapprove(id) {
  return request({ url: `/oppReview/unapprove/${id}`, method: 'post' })
}

export function oppReviewSaveConfirm(data) {
  return request({ url: '/oppReview/saveConfirm', method: 'post', data })
}

export function oppReviewSubmitConfirm(data) {
  return request({ url: '/oppReview/submitConfirm', method: 'post', data })
}

export function oppReviewGetDetail(id) {
  return request({ url: `/oppReview/get/${id}`, method: 'get' })
}

export function oppReviewGetConfirmDetail(id) {
  return request({ url: `/oppReview/getConfirm/${id}`, method: 'get' })
}

export function oppReviewGetBrandInfo(brandId) {
  return request({ url: `/oppReview/getBrandInfo/${brandId}`, method: 'get' })
}

export function oppReviewCheckConflict(brandId) {
  return request({ url: `/oppReview/checkConflict/${brandId}`, method: 'get' })
}
