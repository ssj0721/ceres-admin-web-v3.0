import request from '@/utils/request'

const API = {
  SAVE: '/brandCategory/save',
  UPDATE: '/brandCategory/update',
  DELETE: '/brandCategory/delete',
  GET_BY_ID: '/brandCategory/getById',
  GET_ALL: '/brandCategory/getAll',
  SEARCH: '/brandCategory/search',
}

// 新增商标品牌类别表
export function brandCategoryAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改商标品牌类别表
export function brandCategoryEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除商标品牌类别表（逻辑删除）
export function brandCategoryDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询商标品牌类别表详情
export function brandCategoryGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询商标品牌类别表列表
export function brandCategoryGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询商标品牌类别表（支持分页）
export function brandCategorySearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
