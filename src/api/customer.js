import request from '@/utils/request'

// ******客服******

// 提交问题
export function commit(data) {
  return request({
    url: '/customer/commit',
    method: 'post',
    data,
  })
}

export function query(data) {
    return request({
      url: '/customer/query',
      method: 'post',
      data,
    })
}

export function deleteData(data) {
  return request({
    url: '/customer/delete',
    method: 'post',
    data,
  })
}