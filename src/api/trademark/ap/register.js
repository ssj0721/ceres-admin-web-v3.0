import request from '@/utils/request'

const API = {
  ADD: '/register/add',
  SUBMIT: '/register/submit',
  APPROVE: '/register/approve',
  CONFIRM: '/register/confirm',
  GET_DETAIL: '/register/get',
}

// 新建注册申请
export function registerAdd(data) {
  return request({
    url: API.ADD,
    method: 'post',
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

// 确认注册申请
export function registerConfirm(data) {
  return request({
    url: API.CONFIRM,
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
