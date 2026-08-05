import request from '@/utils/request'

// 查询
export function queryapi (obj) {
  return request({
    url: '/ows/packingListApi/query',
    method: 'post',
    data: obj,
  })
}

// 查询
export function query2api (obj) {
  return request({
    url: '/ows/packingListApi/query2',
    method: 'post',
    data: obj,
  })
}

// 新增部分
export function ImportInfpkdatjws (obj) {
  return request({
    url: '/ows/packingListApi/importInfpkdatjws',
    method: 'post',
    data: obj,
  })
}

// 修改部分
export function updateInfpkdatjws (obj) {
  return request({
    url: '/ows/packingListApi/updateInfpkdatjws',
    method: 'post',
    data: obj,
  })
}
// 删除部分
export function deleteInfpkdatjws (obj) {
  return request({
    url: '/ows/packingListApi/deleteInfpkdatjws',
    method: 'post',
    data: obj,
  })
}

// 装箱资料发车
export function SalCargoSave2 (obj) {
  return request({
    url: '/ows/packingListApi/SalCargoSave2',
    method: 'post',
    data: obj,
  })
}

// 装箱资料详情
export function getinfpkdatdtlajws (obj) {
  return request({
    url: '/ows/packingListApi/getinfpkdatdtlajws',
    method: 'post',
    data: obj,
  })
}
// 装箱资料修改
export function infpkdatjwsPre (obj) {
  return request({
    url: '/ows/packingListApi/saveOrUpdateInfPkDatJws',
    method: 'post',
    data: obj,
  })
}

// 装箱资料详情页修改
export function infpkdatdtlajwsPre (obj) {
  return request({
    url: '/ows/packingListApi/saveOrUpdateddtla',
    method: 'post',
    data: obj,
  })
}

// 导出装箱资料
export function dataExport (obj) {
  return request({
    url: '/ows/packingListApi/dataExport',
    method: 'post',
    data: obj,
  })
}
// 导出装箱资料
export function dataExport2 (obj) {
  return request({
    url: '/ows/packingListApi/dataExport2',
    method: 'post',
    data: obj,
  })
}

// 导出装箱列印资料
export function dataExport3 (obj) {
  return request({
    url: '/ows/packingListApi/dataExport3',
    method: 'post',
    data: obj,
  })
}
// 修改是否已列印flag
export function updateflag (obj) {
  return request({
    url: '/ows/packingListApi/updateflag',
    method: 'post',
    data: obj,
  })
}

// 查看发车信息
export function findCaogoByNo (obj) {
  return request({
    url: '/ows/packingListApi/findCaogoByNo',
    method: 'post',
    data: obj,
  })
}

// 修改发车信息
export function editCaogo (obj) {
  return request({
    url: '/ows/packingListApi/editCaogo',
    method: 'post',
    data: obj,
  })
}