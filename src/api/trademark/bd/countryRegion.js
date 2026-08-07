import request from '@/utils/request'

const API = {
  SAVE: '/countryRegion/save',
  UPDATE: '/countryRegion/update',
  DELETE: '/countryRegion/delete',
  GET_BY_ID: '/countryRegion/getById',
  GET_ALL: '/countryRegion/getAll',
  SEARCH: '/countryRegion/search',
}

// 新增注册国家/地区表
export function countryRegionAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改注册国家/地区表
export function countryRegionEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除注册国家/地区表（逻辑删除）
export function countryRegionDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询注册国家/地区表详情
export function countryRegionGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询注册国家/地区表列表
export function countryRegionGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询注册国家/地区表（支持分页）
export function countryRegionSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
