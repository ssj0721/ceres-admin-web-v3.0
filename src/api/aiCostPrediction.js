import request from '@/utils/request'

// 获取品类列表
export function getCategorylist (data) {
  return request({
    url: '/AICostPrediction/getCategorylist',
    method: 'post',
    data,
  })
}

// 查询
export function getByCategory (data) {
  return request({
    url: '/AICostPrediction/getByCategory',
    method: 'post',
    data,
  })
}

//预测
export function predict (data) {
  return request({
    url: '/AICostPrediction/predict',
    method: 'post',
    data,
  })
}

//获取面料信息
export function getFapData (data) {
  return request({
    url: '/AICostPrediction/getFapData',
    method: 'post',
    data,
  })
}

//获取面料系统的token
export function getFapToken (data) {
  return request({
    url: '/AICostPrediction/getFapToken',
    method: 'get',
  })
}

//获取面料app端网址
export function getFapAppUrl (data) {
  return request({
    url: '/AICostPrediction/getFapAppUrl',
    method: 'get',
  })
}

//更新评价
export function updateComment (data) {
  return request({
    url: '/AICostPrediction/updateComment',
    method: 'post',
    data,
  })
}