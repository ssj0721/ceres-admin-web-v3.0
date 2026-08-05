import request from '@/utils/request'

// 查询
export function queryapi (data) {
  return request({
    url: '/jwscontract/query',
    method: 'post',
    data
  });
}

// 查询实际入仓的记录
export function queryRuCan (data) {
  return request({
    url: '/jwscontract/queryRuCan',
    method: 'post',
    data
  });
}
// 查询上下架的记录
export function queryUDJia (data) {
  return request({
    url: '/jwscontract/queryUDJia',
    method: 'post',
    data
  })
}

// 导出
export function dataExport (data) {
  return request({
    url: '/jwscontract/dataExport',
    method: 'post',
    data
  });
}

// 导入到采购单
export function dataImport (data) {
  return request({
    url: '/jwscontract/dataImport',
    method: 'post',
    data
  });
}

export function checkCGD (data) {
  return request({
    url: '/jwscontract/checkCGD',
    method: 'post',
    data
  });
}

// 初始化
export function fninit (data) {
  return request({
    url: '/jwscontract/fninit',
    method: 'post',
    data
  });
}

// 获取国标代码
export function getGbCode (data) {
  return request({
    url: '/jwscontract/queryGb',
    method: 'post',
    data
  });
}
// 根据款号获取国标代码
export function getGbCodeByItem (data) {
  return request({
    url: '/jwscontract/queryGbByParams',
    method: 'post',
    data
  });
}

// 查询供应商
export function querySupporter (data) {
  return request({
    url: '/jwscontract/querySupporter',
    method: 'post',
    data
  })
}

// 修改供应商
export function updateSupporter (data) {
  return request({
    url: '/jwscontract/updateSupporter',
    method: 'post',
    data
  })
}

// 加载下拉框供应商
export function loadSupplier (data) {
  return request({
    url: '/jwscontract/querySupplierInfo',
    method: 'post',
    data
  })
}

export function itemdtlquery3 (data) {
  return request({
    url: '/jwscontract/stylequerydtl',
    method: 'post',
    data
  })
}