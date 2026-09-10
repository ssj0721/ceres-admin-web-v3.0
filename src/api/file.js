import request from '@/utils/request'

export function uploadFileApi (data) {
  return request({
    // url: '/sys/file/upload',
    // url: '/ali/file/upload',
    url: '/sys/file/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getfileid (data) {
  return request({
    // url: '/sys/file/upload',
    // url: '/ali/file/upload',
    url: '/sys/file/upload',
    method: 'post',
    data: data,
  })
}

export function deletefile (data) {
  return request({
    // url: '/sys/file/delete',
    // url: '/ali/file/delete',
    url: '/sys/file/delete',
    method: 'post',
    data: data,
  })
}

//大投配置不用改下面的所有方法
export function getIretailUrlByfileId (data) {
  return request({
    url: '/sys/file/getIretailUrlByfileId',
    method: 'post',
    data: data,
  })
}

//AI处理图片--去背景
export function handleImage (data) {
  return request({
    url: '/nas/file/handleImage',
    method: 'post',
    data: data,
  })
}

//AI处理图片--旋转角度
export function angleImage (data) {
  return request({
    url: '/nas/file/angleImage',
    method: 'post',
    data: data,
  })
}

//手动处理图片--旋转角度
export function angleImageByHand (data) {
  return request({
    url: '/nas/file/angleImageByHand',
    method: 'post',
    data: data,
  })
}
// 根据文件ID获取图片URL
export function getImageUrl(fileId) {
  return request({
    url: '/sys/file/getImage',
    method: 'post',
    data: { fileId }
  })
}
