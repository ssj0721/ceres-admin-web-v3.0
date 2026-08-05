import request from '@/utils/request'

// *************用户管理*************
// 用户管理查询
export function verify() {
  return request({
    url: '/jushuitan/verify',
    method: 'post',
  })
}

export function createUrl() {
  return request({
    url: '/jushuitan/createUrl',
    method: 'post',
  })
}

export function updateData() {
  return request({
    url: '/jushuitan/updateData',
    method: 'post',
  })
}