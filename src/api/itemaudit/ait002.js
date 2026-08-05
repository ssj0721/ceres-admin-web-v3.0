import request from '@/utils/request'

// 品牌方审核查询
export function brandGetAll(data) {
    return request({
      url: '/itemCheck/getAll',
      method: 'post',
      data,
    })
  }

// 导入商品
export const importProduct = (data = {}) => {
  return request({
    url: 'itemCheck/importProduct',
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  })
}

// 导入商品（跟上面那个是一样的，但是商品管理也有个importProduct是用来批量导入，因为重名所以加个importProduct2）
export const importProduct2 = (data = {}) => {
  return request({
    url: 'itemCheck/importProduct',
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  })
}

//批量修改导入
export const importUpdateProduct = (data = {}) => {
  return request({
    url: 'itemCheck/importUpdateProduct',
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  })
}

// 导出错误信息
export function productExportErr(data) {
  return request({
    url: '/itemCheck/exporterr',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 导出商品
export function productExport2(data) {
  return request({
    url: '/itemCheck/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 导出修改商品
export function batchUpdateExport(data) {
  return request({
    url: '/itemCheck/batchUpdateExport',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 送真维斯审批
export function Submit(data) {
  return request({
    url: '/itemCheck/submit',
    method: 'post',
    data,
  })
}

// 同步审款id
export function updateItemDraftId(data) {
  return request({
    url: '/itemCheck/updateItemDraftId',
    method: 'post',
    data,
  })
}


// test
export function update1(data) {
  return request({
    url: '/itemCheck/update1',
    method: 'post',
    data,
  })
}

// 导出模板
export function downloadTemplate(data) {
  return request({
    url: '/itemCheck/downloadTemplate',
    method: 'post',
    data,
  })
}

// 同时导入excel和图片方法
export function importData(data) {
  return request({
    url: '/itemCheck/importData',
    method: 'post',
    data,
  })
}

export function matchCurDateForImportDataBeforeApi (data) {
  return request({
    url: '/itemCheck/matchCurDateForImportDataBefore',
    method: 'post',
    data,
  })
}

export function matchCurDateForImportProduct (data) {
  return request({
    url: '/itemCheck/matchCurDateForImportProduct',
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  })
}

// 导出excel
export function dataExport(data) {
  return request({
    url: '/itemCheck/dataExport',
    method: 'post',
    data,
  })
}