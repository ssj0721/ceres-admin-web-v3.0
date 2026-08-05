import {requestSmc} from '@/utils/request';

export const bmmnt331Api = {
  queryOption: (obj) => {
    return requestSmc({
      method: "queryOption@retail.bm.bmmnt331",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "queryOption@retail.bm.bmmnt331",
      //   params: obj
      // }
    })
  },
  query: (obj) => {
    return requestSmc({
      method: "query@retail.bm.bmmnt331",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "query@retail.bm.bmmnt331",
      //   params: obj
      // }
    })
  },
  approve: (obj) => {
    return requestSmc({
      method: "approve@retail.bm.bmmnt331",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "approve@retail.bm.bmmnt331",
      //   params: obj
      // }
    })
  },
  exportExcel: (params) => {
    return requestSmc({
      method: "export@retail.bm.bmmnt331",
      timeout: 1800000,
      params
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "export@retail.bm.bmmnt331",
      //   params: params
      // }
    })
  },
  importExcel: (obj) => {
    return requestSmc({
      method: "import@retail.bm.bmmnt331",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "import@retail.bm.bmmnt331",
      //   params: obj
      // }
    })
  },
};

export const exportTypeDict = {
  exportType: [
    {
      id: "CONTRACT",
      name: "分合同"
    },
    {
      id: "SHOP",
      name: "分店铺"
    },
    {
      id: "TOTAL",
      name: "汇总"
    },
    {
      id: "TOTAL-B",
      name: "汇总(格式B)"
    }

  ]
};