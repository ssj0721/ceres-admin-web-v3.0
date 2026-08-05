import {requestSmc} from '@/utils/request';


export const bmmnt355Api = {
  queryOption: (obj) => {
    return requestSmc({
      method: "queryOption@retail.bm.bmmnt355",
      params: obj

    })
  },
  query: (obj) => {
    return requestSmc({
     
        method: "query@retail.bm.bmmnt355",
        params: obj
      
    })
  },
  split: (obj) => {
    return requestSmc({
      method: "split@retail.bm.bmmnt355",
      params: obj

    })
  },
  approve: (obj) => {
    return requestSmc({
      method: "approve@retail.bm.bmmnt355",
      params: obj

    })
  },
  exportExcel: (params) => {
    return requestSmc({
      method: "export@retail.bm.bmmnt355",
      timeout: 1800000,
      params

    })
  },
  importExcel: (obj) => {
    return requestSmc({
        method: "import@retail.bm.bmmnt355",
        params: obj
    })
  },
};
