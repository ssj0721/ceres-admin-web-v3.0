import request from '@/utils/request'

export function stylequery (data) {
  return request({
    url: '/pogoods/stylequery',
    method: 'post',
    data
  })
}

// 实际细表保存的数量
export function stylequerydtl (data) {
  return request({
    url: '/pogoods/stylequerydtl',
    method: 'post',
    data
  })
}
export function Savestyledata (data) {
  return request({
    url: '/pogoods/Savestyledata',
    method: 'post',
    data
  })
}

export function itemdtlquery (data) {
  return request({
    url: '/pogoods/itemdtlquery',
    method: 'post',
    data
  })
}

export function itemdtlquery2 (data) {
  return request({
    url: '/pogoods/itemdtlquery2',
    method: 'post',
    data
  })
}
