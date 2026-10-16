import request from '@/utils/request'

const API = {
  ADD: '/renewal/add',
  UPDATE: '/renewal/update',
  SUBMIT: '/renewal/submit',
  APPROVE: '/renewal/approve',
  UNAPPROVE: '/renewal/unapprove',
  SAVE_CONFIRM: '/renewal/saveConfirm',
  SUBMIT_CONFIRM: '/renewal/submitConfirm',
  GET_DETAIL: '/renewal/get',
  GET_CONFIRM_DETAIL: '/renewal/getConfirm',
  GET_BRAND_INFO: '/renewal/getBrandInfo',
}

// 新建续展申请
export function renewalAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
    data,
  })
}

// 编辑续展申请
export function renewalUpdate(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 提交续展申请（待提交 -> 签批中），id 为申请基本信息ID
export function renewalSubmit(id) {
  return request({
    url: `${API.SUBMIT}/${id}`,
    method: 'post',
  })
}

// 审批续展申请（签批中 -> 待确认），id 为申请基本信息ID
export function renewalApprove(id) {
  return request({
    url: `${API.APPROVE}/${id}`,
    method: 'post',
  })
}

// 撤回续展申请（签批中 -> 待提交），id 为申请基本信息ID
export function renewalUnapprove(id) {
  return request({
    url: `${API.UNAPPROVE}/${id}`,
    method: 'post',
  })
}

// 保存确认（不改变状态）
export function renewalSaveConfirm(data) {
  return request({
    url: API.SAVE_CONFIRM,
    method: 'post',
    data,
  })
}

// 提交确认（保存 + 改为已确认 + 回写商标台账）
export function renewalSubmitConfirm(data) {
  return request({
    url: API.SUBMIT_CONFIRM,
    method: 'post',
    data,
  })
}

// 查询续展申请详情，id 为申请基本信息ID
export function renewalGetDetail(id) {
  return request({
    url: `${API.GET_DETAIL}/${id}`,
    method: 'get',
  })
}

// 查询商标续展确认信息详情，id 为申请基本信息ID
export function renewalGetConfirmDetail(id) {
  return request({
    url: `${API.GET_CONFIRM_DETAIL}/${id}`,
    method: 'get',
  })
}

// 按商标ID查询当前商标信息（供续展编制页回填），brandId 为商标ID
export function renewalGetBrandInfo(brandId) {
  return request({
    url: `${API.GET_BRAND_INFO}/${brandId}`,
    method: 'get',
  })
}

export function renewalCheckConflict(brandId) {
  return request({ url: `/renewal/checkConflict/${brandId}`, method: 'get' })
}
