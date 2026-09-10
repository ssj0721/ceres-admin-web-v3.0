import request from '@/utils/request'

const API = {
  ADD: '/register/add',
  UPDATE: '/register/update',
  SUBMIT: '/register/submit',
  APPROVE: '/register/approve',
  UNAPPROVE: '/register/unapprove',
  SAVE_CONFIRM: '/register/saveConfirm',
  SUBMIT_CONFIRM: '/register/submitConfirm',
  GET_DETAIL: '/register/get',
  GET_CONFIRM_DETAIL: '/register/getConfirm',
}

// 新建注册申请
export function registerAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
    data,
  })
}

// 编辑注册申请
export function registerUpdate(data) {
  return request({
    url: API.UPDATE,
    method: 'put',
    data,
  })
}

// 提交注册申请
export function registerSubmit(id) {
  return request({
    url: `${API.SUBMIT}/${id}`,
    method: 'put',
  })
}

// 审批注册申请
export function registerApprove(id) {
  return request({
    url: `${API.APPROVE}/${id}`,
    method: 'put',
  })
}

// 撤回注册申请（签批中 -> 待提交）
export function registerUnapprove(id) {
  return request({
    url: `${API.UNAPPROVE}/${id}`,
    method: 'put',
  })
}

// 保存确认（不改变状态）
export function registerSaveConfirm(data) {
  return request({
    url: API.SAVE_CONFIRM,
    method: 'post',
    data,
  })
}

// 提交确认（保存 + 改为已确认）
export function registerSubmitConfirm(data) {
  return request({
    url: API.SUBMIT_CONFIRM,
    method: 'post',
    data,
  })
}

// 查询注册申请详情
export function registerGetDetail(id) {
  return request({
    url: `${API.GET_DETAIL}/${id}`,
    method: 'get',
  })
}

// 查询商标确认信息详情
export function registerGetConfirmDetail(id) {
  return request({
    url: `${API.GET_CONFIRM_DETAIL}/${id}`,
    method: 'get',
  })
}
