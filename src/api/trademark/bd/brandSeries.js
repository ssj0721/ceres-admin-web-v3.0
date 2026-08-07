import request from '@/utils/request'

const API = {
  SAVE: '/brandSeries/save',
  UPDATE: '/brandSeries/update',
  DELETE: '/brandSeries/delete',
  GET_BY_ID: '/brandSeries/getById',
  GET_ALL: '/brandSeries/getAll',
  SEARCH: '/brandSeries/search',
}

// 新增商标系列表
export function brandSeriesAdd(data) {
  return request({
    url: API.SAVE,
    method: 'post',
    data,
  })
}

// 修改商标系列表
export function brandSeriesEdit(data) {
  return request({
    url: API.UPDATE,
    method: 'post',
    data,
  })
}

// 删除商标系列表（逻辑删除）
export function brandSeriesDel(data) {
  return request({
    url: API.DELETE,
    method: 'post',
    data,
  })
}

// 查询商标系列表详情
export function brandSeriesGetById(data) {
  return request({
    url: API.GET_BY_ID,
    method: 'post',
    data,
  })
}

// 分页查询商标系列表列表
export function brandSeriesGetList(data) {
  return request({
    url: API.GET_ALL,
    method: 'post',
    data,
  })
}

// 模糊查询商标系列表（支持分页）
export function brandSeriesSearch(data) {
  return request({
    url: API.SEARCH,
    method: 'post',
    data,
  })
}
