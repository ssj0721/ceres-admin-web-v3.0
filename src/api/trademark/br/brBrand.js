import request from '@/utils/request'

const API = {
  SAVE: '/brBrand/save',
  UPDATE: '/brBrand/update',
  DELETE: '/brBrand/delete',
  GET_BY_ID: '/brBrand/getById',
  GET_ALL: '/brBrand/getAll',
  SEARCH: '/brBrand/search',
}

// 新增商标信息表
export function brBrandAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改商标信息表
export function brBrandEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除商标信息表（逻辑删除）
export function brBrandDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询商标信息表详情
export function brBrandGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询商标信息表列表
export function brBrandGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询商标信息表（支持分页）
export function brBrandSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
