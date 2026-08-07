import request from '@/utils/request'

const API = {
  SAVE: '/originalStorage/save',
  UPDATE: '/originalStorage/update',
  DELETE: '/originalStorage/delete',
  GET_BY_ID: '/originalStorage/getById',
  GET_ALL: '/originalStorage/getAll',
  SEARCH: '/originalStorage/search',
}

// 新增正文存储表
export function originalStorageAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改正文存储表
export function originalStorageEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除正文存储表（逻辑删除）
export function originalStorageDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询正文存储表详情
export function originalStorageGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询正文存储表列表
export function originalStorageGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询正文存储表（支持分页）
export function originalStorageSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
