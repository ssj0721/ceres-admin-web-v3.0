// 配置编译环境和线上环境之间的切换
import { getSubDomain } from '@/utils/httputil'

let baseUrl = '';
let rootUrl = window.location.origin;
let reportApiUrl = '';
let iconfontVersion = ['567566_qo5lxgtishg', '1237903_nowkk7iihod'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
//图标库：http://at.alicdn.com/t/font_567566_qo5lxgtishg.css
//       http://at.alicdn.com/t/font_1237903_c5qsmcvfhw.css
//       http://at.alicdn.com/t/font_1237903_nowkk7iihod.css
let codeUrl = `${baseUrl}/code`
let devToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQT1MiLCJleHAiOjE1MzExOTE0MTIsImlhdCI6MTUzMTEwNTAxMn0.EfNGlkeOtWQvV3V7DgenSugfhK9KSmYbuRZBfhKZ4ZA'
const env = process.env
if (env.NODE_ENV == 'development') {
  //baseUrl = `http://localhost:8090`; // 开发环境地址
  baseUrl = "/rest/api/smc/";
  reportApiUrl = "/rest/api/report/";
} else if (env.NODE_ENV == 'production') {
  baseUrl = `/rest/api/smc/`; //生产环境地址
  reportApiUrl = "/rest/api/report/";
} else if (env.NODE_ENV == 'test') {
  baseUrl = `/rest/api/smc/`; //测试环境地址
  reportApiUrl = "/rest/api/report/";
}
//fineReport服务器地址
let fineReportRootURL = '' //'http://172.20.41.3:8075/webroot/decision/view/report'
//临时文件上传地址
let uploadTempFileUrl = import.meta.env.VITE_BASE_PREFIX + 'smc/sys/file/uploadTempFile'
//临时文件下载地址
let downloadTempFileUrl = '/sys/file/downloadTempFile/'
//临时文件删除地址
let delTempFileUrl = '/sys/file/delTempFile/'
//文件下载地址
let downloadFileUrl = import.meta.env.VITE_BASE_PREFIX +'smc/sys/file/download/'
//文件删除地址
let delFileUrl = '/sys/file/delete/'
let fileRootUrl = '';
//文件上传地址
let uploadFileUrl = import.meta.env.VITE_BASE_PREFIX +'smc/sys/file/upload'
//多个文件上传地址
let uploadMultiFileUrl = '/sys/file/uploadMulti'
//处理二级域名
let subDomain = getSubDomain();

// if (subDomain != undefined && subDomain != "" && !baseUrl.startsWith(subDomain)) {

//   // uploadTempFileUrl = subDomain + uploadTempFileUrl;
  
//   // if (!subDomain.includes('buget'||'dashboard')) {
//   //   uploadTempFileUrl = subDomain + uploadTempFileUrl;
//   //   }else {
//   //     uploadTempFileUrl = uploadTempFileUrl;
//   //   }

//   downloadTempFileUrl = subDomain + downloadTempFileUrl;
//   delTempFileUrl = subDomain + delTempFileUrl;
//   downloadFileUrl = subDomain + downloadFileUrl;
//   delFileUrl = subDomain + delFileUrl;
//   // uploadFileUrl = subDomain + uploadFileUrl;
//   // uploadMultiFileUrl = subDomain + uploadMultiFileUrl;

//   // 添加 if 判断
//   if (subDomain.includes('budget') || subDomain.includes('dashboard')) {
//       // 如果子域名包含 'budget' 或 'dashboard'，则保持原URL不变
//       uploadFileUrl = uploadFileUrl;
//       uploadMultiFileUrl = uploadMultiFileUrl;
//       uploadTempFileUrl = uploadTempFileUrl;
//   } else {
//       // 如果子域名不包含 'budget' 和 'dashboard'，则拼接子域名
//       uploadFileUrl = subDomain + uploadFileUrl;
//       uploadMultiFileUrl = subDomain + uploadMultiFileUrl;
//       uploadTempFileUrl = subDomain + uploadTempFileUrl;
//   }

//   baseUrl = subDomain + baseUrl;
//   reportApiUrl = subDomain + reportApiUrl;
//   rootUrl = rootUrl + "/" + subDomain;
// }
// console.log("subDomain");

console.log("rootUrl", rootUrl);
//alert("baseUrl:" + baseUrl);
//alert("uploadTempFileUrl:" + uploadTempFileUrl);
//处理二级域名

export const Setter = {
  setFineReportRootURL: (value) => {
    if (value != undefined && value != "")
      fineReportRootURL = value;
  },
  setFileRootUrl: (value) => {
    if (value != undefined && value != "")
      fileRootUrl = value;
  }
}

export {
  baseUrl,
  rootUrl,
  reportApiUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  devToken,
  env,
  fineReportRootURL,
  subDomain,
  uploadTempFileUrl,
  downloadTempFileUrl,
  delTempFileUrl,
  downloadFileUrl,
  delFileUrl,
  uploadFileUrl,
  uploadMultiFileUrl,
  fileRootUrl
}
