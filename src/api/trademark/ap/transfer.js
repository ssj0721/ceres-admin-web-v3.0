import request from '@/utils/request'

const API = {
  ADD: '/transfer/add',
  UPDATE: '/transfer/update',
  SUBMIT: '/transfer/submit',
  APPROVE: '/transfer/approve',
  UNAPPROVE: '/transfer/unapprove',
  SAVE_CONFIRM: '/transfer/saveConfirm',
  SUBMIT_CONFIRM: '/transfer/submitConfirm',
  GET_DETAIL: '/transfer/get',
  GET_CONFIRM_DETAIL: '/transfer/getConfirm',
  GET_BRAND_INFO: '/transfer/getBrandInfo',
}

// 新建转让申请
export function transferAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
    data,
  })
}

// 编辑转让申请
export function transferUpdate(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 提交转让申请（待提交 -> 签批中），id 为申请基本信息ID
export function transferSubmit(id) {
  return request({
    url: `${API.SUBMIT}/${id}`,
    method: 'post',
  })
}

// 审批转让申请（签批中 -> 待确认），id 为申请基本信息ID
export function transferApprove(id) {
  return request({
    url: `${API.APPROVE}/${id}`,
    method: 'post',
  })
}

// 撤回转让申请（签批中 -> 待提交），id 为申请基本信息ID
export function transferUnapprove(id) {
  return request({
    url: `${API.UNAPPROVE}/${id}`,
    method: 'post',
  })
}

// 保存确认（不改变状态）
export function transferSaveConfirm(data) {
  return request({
    url: API.SAVE_CONFIRM,
    method: 'post',
    data,
  })
}

// 提交确认（保存 + 改为已确认 + 回写商标台账）
export function transferSubmitConfirm(data) {
  return request({
    url: API.SUBMIT_CONFIRM,
    method: 'post',
    data,
  })
}

// 查询转让申请详情，id 为申请基本信息ID
export function transferGetDetail(id) {
  return request({
    url: `${API.GET_DETAIL}/${id}`,
    method: 'get',
  })
}

// 查询商标转让确认信息详情，id 为申请基本信息ID
export function transferGetConfirmDetail(id) {
  return request({
    url: `${API.GET_CONFIRM_DETAIL}/${id}`,
    method: 'get',
  })
}

// 按商标ID查询当前商标信息（供转让编制页回填），brandId 为商标ID
export function transferGetBrandInfo(brandId) {
  return request({
    url: `${API.GET_BRAND_INFO}/${brandId}`,
    method: 'get',
  })
}

export function transferCheckConflict(brandId) {
  return request({ url: `/transfer/checkConflict/${brandId}`, method: 'get' })
}
