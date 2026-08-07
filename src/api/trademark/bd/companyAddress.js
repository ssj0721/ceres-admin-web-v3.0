import request from '@/utils/request'

const API = {
  SAVE: '/companyAddress/save',
  UPDATE: '/companyAddress/update',
  DELETE: '/companyAddress/delete',
  GET_BY_ID: '/companyAddress/getById',
  GET_ALL: '/companyAddress/getAll',
  SEARCH: '/companyAddress/search',
}

// 新增注册公司地址表
export function companyAddressAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改注册公司地址表
export function companyAddressEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除注册公司地址表（逻辑删除）
export function companyAddressDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询注册公司地址表详情
export function companyAddressGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询注册公司地址表列表
export function companyAddressGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询注册公司地址表（支持分页）
export function companyAddressSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
