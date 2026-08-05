import {requestSmc} from '@/utils/request';


export const bmmnt316Api = {
  queryOption: (obj) => {
    return requestSmc({
      method: "queryOption@retail.bm.bmmnt316",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "queryOption@retail.bm.bmmnt316",
      //   params: obj
      // }
    })
  },
  query: (obj) => {
    return requestSmc({
      method: "query@retail.bm.bmmnt316",
      params: obj

      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "query@retail.bm.bmmnt316",
      //   params: obj
      // }
    })
  },
  approve: (obj) => {
    return requestSmc({
      method: "approve@retail.bm.bmmnt316",
      params: obj
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "approve@retail.bm.bmmnt316",
      //   params: params
      // }
    })
  },
  exportExcel: (params) => {
    return requestSmc({
      method: "export@retail.bm.bmmnt316",
      timeout: 1800000,
      params
      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "export@retail.bm.bmmnt316",
      //   params: params
      // }
    })
  },
  importExcel: (obj) => {
    return requestSmc({
      method: "import@retail.bm.bmmnt316",
      params: obj

      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "import@retail.bm.bmmnt316",
      //   params: obj
      // }
    })
  },
};

export const editModeDict = {
  editMode: [
    {
      id: "AMT2",
      name: "金额(预算+保底)"
    },
    {
      id: "AMT",
      name: "金额(预算)"
    },
    {
      id: "SCALE",
      name: "比例(预算)"
    }
  ],
};

export const exportTypeDict = {
  exportType: [
    {
      id: "CONTRACT",
      name: "分合同"
    },
    {
      id: "TOTAL",
      name: "汇总"
    }
  ]
};

export const newShopTypeDict = {
  newShopType: [
    {
      id: "NOPLAT",
      name: "不分平台"
    },
    {
      id: "HASPLAT",
      name: "分平台"
    }
  ]
};