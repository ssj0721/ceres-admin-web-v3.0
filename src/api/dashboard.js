import request from '@/utils/request'

//* ******************** 财务统计  *********************
// 财务统计数据查询

export function indexTest(data) {
  return request({
    url: '/index/indexTest',
    method: 'post',
    data,
  })
}

export function dashIndex(data) {
  return request({
    url: '/index/index',
    method: 'post',
    data,
  })
}

// 用户访问数据导出
export function userVisitExport(data) {
  return request({
    url: '/index/exportUserVisit',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 订单转换导出
export function orderConvertExport(data) {
  return request({
    url: '/index/exportOrderConvert',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 热卖商品导出
export function hotProductsExport(data) {
  return request({
    url: '/index/exportHotProducts',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 审核商品统计数据导出
export function productStatsExport(data) {
  return request({
    url: '/index/exportProductStats',
    method: 'post',
    data,
    responseType: 'blob',
  })
}


//滚动条消息栏
export function getNotice(data) {
  return request({
    url: '/index/getNotice',
    method: 'post',
    data,
  })
}

//获取采购单状态统计信息
export function getPoOrderStats(data) {
  return request({
    url: '/index/getPoOrderStats',
    method: 'post',
    data
  })
}

// 采购单/追单统计导出
export function poOrderStatsExport(data) {
  return request({
    url: '/index/exportPoOrderStats',
    method: 'post',
    data,
    responseType: 'blob',
  })
}