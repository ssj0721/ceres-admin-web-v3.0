import request from '@/utils/request'

export function queryData(data) {
  return request({
      url: '/po1mnt116/queryData',
      method: 'post',
      data,
  })
}
export function dataExportApi(data) {
  return request({
      url: '/po1mnt116/dataExport',
      method: 'post',
      data,
  })
}

export function getUserByPoNo(data) {
  return request({
      url: '/po1mnt116/getUserByPoNo',
      method: 'post',
      data,
  })
}

export function queryvw_bs_brand_GBM(data) {
  return request({
      url: '/po1mnt116/queryvw_bs_brand_GBM',
      method: 'post',
      data,
  })
}

export function querySelectTable(data) {
    return request({
        url: '/po1mnt116/querySelectTable',
        method: 'post',
        data,
    })
}

export function queryDept(data) {
  return request({
      url: '/po1mnt116/queryDept',
      method: 'post',
      data,
  })
}

export function ADD(data) {
  return request({
      url: '/po1mnt116/add',
      method: 'post',
      data,
  })
}

export function downLoadTemplate(data) {
  return request({
      url: '/po1mnt116/downLoadTemplate',
      method: 'post',
      data,
  })
}




//   getUserByPoNo: (obj) => {
//     return api.fetch({
//       method: "getUserByPoNo@retail.po.pomnt116",
//       params: obj
//     })
//   },

//

// export const pomnt116Api = {
//   query: (obj) => {
//     return api.fetch({
//       method: "query@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   add: (obj) => {
//     return api.fetch({
//       method: "add@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   dataExport: (obj) => {
//     return api.fetch({
//       method: "dataExport@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   delFile: (obj) => {
//     return api.fetch({
//       method: "delFile@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   downLoadTemplate: (obj) => {
//     return api.fetch({
//       method: "downLoadTemplate@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   cancel: (obj) => {
//     return api.fetch({
//       method: "cancel@retail.po.pomnt116",
//       params: obj
//     })
//   },

//   getUserByPoNo: (obj) => {
//     return api.fetch({
//       method: "getUserByPoNo@retail.po.pomnt116",
//       params: obj
//     })
//   },
// }