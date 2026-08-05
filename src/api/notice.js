import request from '@/utils/request'

// ******消息中心******
// 历史消息查询
export function noticeGetAll(data) {
  return request({
    url: '/notice/getAll',
    method: 'post',
    data,
  })
}

// 消息详情
export function noticeGetById(data) {
  return request({
    url: '/notice/getById',
    method: 'post',
    data,
  })
}

// 消息详情
export function noticeDelete(data) {
  return request({
    url: '/notice/delete',
    method: 'post',
    data,
  })
}

// 发送消息
export function noticeSave(data) {
  return request({
    url: '/notice/save',
    method: 'post',
    data,
  })
}

// ******首页滚动条管理******
// 滚动条
export function noticeTextGetAll(data) {
  return request({
    url: '/notice/getTextAll',
    method: 'post',
    data,
  })
}

//获取商的列表
export function getBusiness(data) {
  return request({
    url: '/notice/getBusiness',
    method: 'post',
    data,
  })
}

//新增保存
export function noticeTextSave(data) {
  return request({
    url: '/notice/noticeTextSave',
    method: 'post',
    data,
  })
}

//获得详情
export function noticeTextGetById(data) {
  return request({
    url: '/notice/noticeTextGetById',
    method: 'post',
    data,
  })
}

//禁用
export function noticeTextDel(data) {
  return request({
    url: '/notice/noticeTextDel',
    method: 'post',
    data,
  })
}