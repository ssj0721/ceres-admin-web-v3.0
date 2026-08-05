import request from '@/utils/request'

// 添加销售需求单
export function saleAdd (data) {
  return request({
    url: '/sale/add',
    method: 'post',
    data
  })
}

// 查询销售需求单
export function getsaleList (data) {
  return request({
    url: '/sale/getAll',
    method: 'post',
    data
  })
}

// 删除订单
export function orderDelete (data) {
  return request({
    url: '/sale/delete',
    method: 'delete',
    data
  })
}

// 导出销售需求单
export function saleExport (data) {
  return request({
    url: '/sale/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 获取运营团队分组列表
export function getBuyerGroups (data) {
  return request({
    url: '/sale/getBuyerGroups',
    method: 'post',
    data
  })
}

// 根据销售需求单生成采购单
export function createOrderEs (data) {
  return request({
    url: '/sale/createOrderEs',
    method: 'post',
    data
  })
}