import {requestSmc} from '@/utils/request';

export const bmmnt332Api = {
  queryOption: (obj) => {
    return requestSmc({
      method: "queryOption@retail.bm.bmmnt332v2",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "queryOption@retail.bm.bmmnt332v2",
      //   params: obj
      // }
    })
  },
  query: (obj) => {
    return requestSmc({
      method: "query@retail.bm.bmmnt332v2",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "query@retail.bm.bmmnt332v2",
      //   params: obj
      // }
    })
  },
  split: (obj) => {
    return requestSmc({
      method: "split@retail.bm.bmmnt332v2",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "split@retail.bm.bmmnt332v2",
      //   params: params
      // }
    })
  },
  approve: (obj) => {
    return requestSmc({
      method: "approve@retail.bm.bmmnt332v2",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "approve@retail.bm.bmmnt332v2",
      //   params: params
      // }
    })
  },
  exportExcel: (params) => {
    return requestSmc({
      method: "export@retail.bm.bmmnt332v2",
      timeout: 1800000,
      params
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "export@retail.bm.bmmnt332v2",
      //   params: params
      // }
    })
  },
  importExcel: (obj) => {
    return requestSmc({
      method: "import@retail.bm.bmmnt332v2",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "import@retail.bm.bmmnt332v2",
      //   params: obj
      // }
    })
  },
};
