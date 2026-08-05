import {requestSmc} from '@/utils/request';

export const bmmnt311Api = {
  queryOption: (obj) => {
    return requestSmc({
      method: "queryOption@retail.bm.bmmnt311",
      params: obj

      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "queryOption@retail.bm.bmmnt311",
      //   params: obj
      // }
    });
  },
  query: (obj) => {
    return requestSmc({
      method: "query@retail.bm.bmmnt311",
      params: obj

      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "query@retail.bm.bmmnt311",
      //   params: obj
      // }
    });
  },
  approve: (obj) => {
    return requestSmc({
      method: "approve@retail.bm.bmmnt311",
      params: obj

      // url:'/rest/api/smc',
      // method:'post',
      // data:{
      //   method: "approve@retail.bm.bmmnt311",
      //   params: obj
      // }
    });
  },
  exportExcel: (params) => {
    return requestSmc({
      method: "export@retail.bm.bmmnt311",
      timeout: 1800000,
      params

      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "export@retail.bm.bmmnt311",
      //   params: params
      // }
    });
  },
  importExcel: (obj) => {
    return requestSmc({
      method: "import@retail.bm.bmmnt311",
      params: obj

      
      // url:'/rest/api/smc',
      // method:'post',
      // timeout: 1800000,
      // data:{
      //   method: "import@retail.bm.bmmnt311",
      //   params: obj
      // }
    });
  }
};
