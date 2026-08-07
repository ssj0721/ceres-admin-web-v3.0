import request from '@/utils/request'

const API = {
  SAVE: '/agent/save',
  UPDATE: '/agent/update',
  DELETE: '/agent/delete',
  GET_BY_ID: '/agent/getById',
  GET_ALL: '/agent/getAll',
  SEARCH: '/agent/search',
}

// 新增商标代理人
export function agentAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改商标代理人
export function agentEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除商标代理人（逻辑删除）
export function agentDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询商标代理人详情
export function agentGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询商标代理人列表
export function agentGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询商标代理人（支持分页）
export function agentSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
