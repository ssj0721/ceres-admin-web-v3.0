import request from '@/utils/request'

const API = {
  ADD: '/brandChange/add',
  UPDATE: '/brandChange/update',
  SUBMIT: '/brandChange/submit',
  APPROVE: '/brandChange/approve',
  UNAPPROVE: '/brandChange/unapprove',
  SAVE_CONFIRM: '/brandChange/saveConfirm',
  SUBMIT_CONFIRM: '/brandChange/submitConfirm',
  GET_DETAIL: '/brandChange/get',
  GET_CONFIRM_DETAIL: '/brandChange/getConfirm',
  GET_BRAND_INFO: '/brandChange/getBrandInfo',
}

// 新建变更申请
export function brandChangeAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
    data,
  })
}

// 编辑变更申请
export function brandChangeUpdate(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 提交变更申请（待提交 -> 签批中），id 为申请基本信息ID
export function brandChangeSubmit(id) {
  return request({
    url: `${API.SUBMIT}/${id}`,
    method: 'post',
  })
}

// 审批变更申请（签批中 -> 待确认），id 为申请基本信息ID
export function brandChangeApprove(id) {
  return request({
    url: `${API.APPROVE}/${id}`,
    method: 'post',
  })
}

// 撤回变更申请（签批中 -> 待提交），id 为申请基本信息ID
export function brandChangeUnapprove(id) {
  return request({
    url: `${API.UNAPPROVE}/${id}`,
    method: 'post',
  })
}

// 保存确认（不改变状态）
export function brandChangeSaveConfirm(data) {
  return request({
    url: API.SAVE_CONFIRM,
    method: 'post',
    data,
  })
}

// 提交确认（保存 + 改为已确认 + 回写商标台账）
export function brandChangeSubmitConfirm(data) {
  return request({
    url: API.SUBMIT_CONFIRM,
    method: 'post',
    data,
  })
}

// 查询变更申请详情，id 为申请基本信息ID
export function brandChangeGetDetail(id) {
  return request({
    url: `${API.GET_DETAIL}/${id}`,
    method: 'get',
  })
}

// 查询商标变更确认信息详情，id 为申请基本信息ID
export function brandChangeGetConfirmDetail(id) {
  return request({
    url: `${API.GET_CONFIRM_DETAIL}/${id}`,
    method: 'get',
  })
}

// 按商标ID查询当前商标信息（供变更编制页回填变更前），brandId 为商标ID
export function brandChangeGetBrandInfo(brandId) {
  return request({
    url: `${API.GET_BRAND_INFO}/${brandId}`,
    method: 'get',
  })
}
