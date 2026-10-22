import request from '@/utils/request'

const API = {
  LIST: '/basic/list',
  EXPORT_COLUMNS: '/basic/exportColumns',
  EXPORT: '/basic/export',
  DELETE: '/basic/delete',
  DELETE_BATCH: '/basic/deleteBatch',
}

// 分页查询申请基本信息列表
export function basicGetList(params) {
  return request({
    url: API.LIST,
    method: 'get',
    params,
  })
}

// 删除申请（逻辑删除，仅待提交可删）
export function basicDelete(id) {
  return request({
    url: `${API.DELETE}/${id}`,
    method: 'post',
  })
}

// 批量删除申请（逻辑删除，仅待提交可删）
export function basicDeleteBatch(ids) {
  return request({
    url: API.DELETE_BATCH,
    method: 'post',
    data: ids,
  })
}

// 某类型可导出的列
export function basicExportColumns(type) {
  return request({ url: API.EXPORT_COLUMNS, method: 'get', params: { type } })
}

// 导出商标申请列表（blob）
export function basicExportExcel(data) {
  return request({ url: API.EXPORT, method: 'post', data, responseType: 'blob' })
}
