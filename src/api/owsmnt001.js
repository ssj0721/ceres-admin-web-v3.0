import request from '@/utils/request'

export function getStock(data) {
    return request({
      url: '/owsmnt001/getStock',
      method: 'post',
      data,
    })
}

export function getInStock(data) {
    return request({
      url: '/owsmnt001/getInStock',
      method: 'post',
      data,
    })
}
export function getStock2(data) {
  return request({
    url: '/owsmnt001/getStock2',
    method: 'post',
    data,
  })
}

export function getInStock2(data) {
  return request({
    url: '/owsmnt001/getInStock2',
    method: 'post',
    data,
  })
}
export function dataExport(data) {
  return request({
    url: '/owsmnt001/dataExport',
    method: 'post',
    data,
  })
}