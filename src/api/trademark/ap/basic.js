import request from '@/utils/request'

const API = {
  LIST: '/basic/list',
}

// 分页查询申请基本信息列表
export function basicGetList(params) {
  return request({
    url: API.LIST,
    method: 'get',
    params,
  })
}
