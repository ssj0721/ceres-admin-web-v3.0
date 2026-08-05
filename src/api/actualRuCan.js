import request from '@/utils/request'

// 查询
export function queryapi (data) {
  return request({
    url: '/actualRuCanApi/query',
    method: 'post',
    data,
  })
}
// 查询
export function query2api (data) {
  return request({
    url: '/actualRuCanApi/query2',
    method: 'post',
    data,
  })
}
// 保存
export function save (data) {
  return request({
    url: '/actualRuCanApi/save',
    method: 'post',
    data,
  })
}

// 获取合同数据
export function itemdtlquery3 (data) {
  return request({
    url: '/actualRuCanApi/stylequerydtl',
    method: 'post',
    data,
  })
}