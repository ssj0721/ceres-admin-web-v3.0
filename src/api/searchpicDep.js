import request from '@/utils/request'

// 新增
export function picDepAdd (data) {
  return request({
    url: '/searchpicDep/add',
    method: 'post',
    data
  })
}

// 查询
export function getAllData (data) {
  return request({
    url: '/searchpicDep/getAll',
    method: 'post',
    data
  })
}

// 修改
export function picDepUpdate (data) {
  return request({
    url: '/searchpicDep/update',
    method: 'post',
    data
  })
}

// 删除
export function picDepDelete (data) {
  return request({
    url: '/searchpicDep/delete',
    method: 'post',
    data
  })
}

// 更新
export function updateBySearchData (data) {
  return request({
    url: '/searchpicDep/updateBySearchData',
    method: 'post',
    data
  })
}