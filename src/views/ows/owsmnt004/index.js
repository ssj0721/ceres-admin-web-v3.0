import request from '@/utils/request';

//主页查询
export function query(data) {
  return request({
    url: '/owsmnt004/queryPage',
    method: 'post',
    data,
  })
}

//检查sku是否存在
export function checkSku(data) {
  return request({
    url: '/owsmnt004/checkSku',
    method: 'post',
    data,
  })
}

//根据单号去查
export function getByReturnNo(data) {
  return request({
    url: '/owsmnt004/getByReturnNo',
    method: 'post',
    data,
  })
}

//根据单号去查
export function getByReturnNo1(data) {
  return request({
    url: '/owsmnt004/getByReturnNo1',
    method: 'post',
    data,
  })
}

export function save(data) {
  return request({
    url: '/owsmnt004/save',
    method: 'post',
    data,
  })
}

export function delObj(data) {
  return request({
    url: '/owsmnt004/delObj',
    method: 'post',
    data,
  })
}

// export function update(params) {
//   return api.fetch({
//     method: "update@retail.ows.ows004",
//     params,
//   });
// }

