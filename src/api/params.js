import request from '@/utils/request'

// ******颜色尺码规格表******
export function getAllData(data) {
  return request({
    url: '/params/getAll',
    method: 'post',
    data,
  })
}
export function paramsAdd(data) {
  return request({
    url: '/params/add',
    method: 'post',
    data,
  })
}
export function paramsUpdate(data) {
  return request({
    url: '/params/update',
    method: 'post',
    data,
  })
}

export function getById(data) {
    return request({
      url: '/params/getById',
      method: 'post',
      data,
    })
}

export function deleteParams(data) {
    return request({
      url: '/params/delete',
      method: 'post',
      data,
    })
}
