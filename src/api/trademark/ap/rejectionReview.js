import request from '@/utils/request'

const API = {
  ADD: '/rejectionReview/add',
  UPDATE: '/rejectionReview/update',
  SUBMIT: '/rejectionReview/submit',
  APPROVE: '/rejectionReview/approve',
  UNAPPROVE: '/rejectionReview/unapprove',
  SAVE_CONFIRM: '/rejectionReview/saveConfirm',
  SUBMIT_CONFIRM: '/rejectionReview/submitConfirm',
  GET_DETAIL: '/rejectionReview/get',
  GET_CONFIRM_DETAIL: '/rejectionReview/getConfirm',
  GET_BRAND_INFO: '/rejectionReview/getBrandInfo',
}

// 新建驳回复审申请
export function rejectionReviewAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
    data,
  })
}

// 编辑驳回复审申请
export function rejectionReviewUpdate(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 提交驳回复审申请（待提交 -> 签批中）
export function rejectionReviewSubmit(id) {
  return request({
    url: `${API.SUBMIT}/${id}`,
    method: 'post',
  })
}

// 审批驳回复审申请（签批中 -> 待确认）
export function rejectionReviewApprove(id) {
  return request({
    url: `${API.APPROVE}/${id}`,
    method: 'post',
  })
}

// 撤回驳回复审申请（签批中 -> 待提交）
export function rejectionReviewUnapprove(id) {
  return request({
    url: `${API.UNAPPROVE}/${id}`,
    method: 'post',
  })
}

// 保存确认（不改变状态）
export function rejectionReviewSaveConfirm(data) {
  return request({
    url: API.SAVE_CONFIRM,
    method: 'post',
    data,
  })
}

// 提交确认（保存 + 改为已确认 + 回写商标台账）
export function rejectionReviewSubmitConfirm(data) {
  return request({
    url: API.SUBMIT_CONFIRM,
    method: 'post',
    data,
  })
}

// 查询驳回复审申请详情
export function rejectionReviewGetDetail(id) {
  return request({
    url: `${API.GET_DETAIL}/${id}`,
    method: 'get',
  })
}

// 查询驳回复审确认信息详情
export function rejectionReviewGetConfirmDetail(id) {
  return request({
    url: `${API.GET_CONFIRM_DETAIL}/${id}`,
    method: 'get',
  })
}

// 按商标ID查询当前商标信息
export function rejectionReviewGetBrandInfo(brandId) {
  return request({
    url: `${API.GET_BRAND_INFO}/${brandId}`,
    method: 'get',
  })
}

export function rejectionReviewCheckConflict(brandId) {
  return request({ url: `/rejectionReview/checkConflict/${brandId}`, method: 'get' })
}
