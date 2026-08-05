import request from '@/utils/request'

// 新增图片
export function upload (data) {
  return request({
    url: '/imageLibrary/add',
    method: 'post',
    data
  })
}

// 查询图库
export function getList (data) {
  return request({
    url: '/imageLibrary/getAll',
    method: 'post',
    data
  })
}

// 删除图片
export function deleteImage (data){
  return request({
    url: '/imageLibrary/delete',
    method: 'post',
    data
  })
}