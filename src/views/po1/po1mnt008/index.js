import request from '@/utils/request'

export function querylist(data) {
  return request({
    url: '/po1mnt008/query',
    method: 'post',
    data,
  })
}

export function querySupplierList() {
  return request({
    url: '/po1mnt008/querySupplierList',
    method: 'post'
  })
}

export function dataExport2(data) {
  return request({
    url: '/po1mnt008/dataExport2',
    method: 'post',
    data
  })
}

export function dataExport3(data) {
  return request({
    url: '/po1mnt008/dataExport',
    method: 'post',
    data
  })
}
