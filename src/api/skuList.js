import request from '@/utils/request'

// ******颜色尺码规格表******
export function getAllData(data) {
  return request({
    url: '/skulist/getAll',
    method: 'post',
    data,
  })
}
export function skuAdd(data) {
  return request({
    url: '/skulist/add',
    method: 'post',
    data,
  })
}
export function skuUpdate(data) {
  return request({
    url: '/skulist/update',
    method: 'post',
    data,
  })
}

export function getById(data) {
    return request({
      url: '/skulist/getById',
      method: 'post',
      data,
    })
}

export function deleteSku(data) {
    return request({
      url: '/skulist/delete',
      method: 'post',
      data,
    })
}

export function getColorList(data) {
    return request({
      url: '/skulist/getColorList',
      method: 'post',
      data,
    })
}

export function getSizeList(data) {
    return request({
      url: '/skulist/getSizeList',
      method: 'post',
      data,
    })
}

export function getGuigeByColid(data) {
  return request({
    url: '/skulist/getGuigeByColid',
    method: 'post',
    data,
  })
}
