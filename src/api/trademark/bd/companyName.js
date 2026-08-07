import request from '@/utils/request'

const API = {
  SAVE: '/companyName/save',
  UPDATE: '/companyName/update',
  DELETE: '/companyName/delete',
  GET_BY_ID: '/companyName/getById',
  GET_ALL: '/companyName/getAll',
  SEARCH: '/companyName/search',
}

// 新增注册公司名称表
export function companyNameAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改注册公司名称表
export function companyNameEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除注册公司名称表（逻辑删除）
export function companyNameDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询注册公司名称表详情
export function companyNameGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询注册公司名称表列表
export function companyNameGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询注册公司名称表（支持分页）
export function companyNameSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
