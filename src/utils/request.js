import axios from 'axios'
import { ElMessageBox as MessageBox, ElMessage as Message } from 'element-plus'
import store from '@/store'
import router from '@/router'
import { getToken, removeToken, isEtdsUser } from '@/utils/auth'
import { UserActionEnum } from '@/store/modules/user/state'
import { ETDS_BASE_URL } from '@/api/etds'

// console.log("import.meta.env",import.meta.env)
const baseURL = import.meta.env.VITE_ENV === 'development' ? '/api' : import.meta.env.VITE_BASE_URL
// create an axios instance
axios.defaults.timeout = 330000
const service = axios.create({
  // baseURL: "http://172.16.101.241:8003", // url = base url + request url
  baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000, // request timeout
})

export const uploadUrl = `${baseURL}/nas/file/upload`
// export const uploadUrl = '/sys/file/upload'
// export const uploadFileUrl = '/sys/file/upload'
// export const uploadMultiFileUrl = '/sys/file/uploadMulti'
export const token = getToken()
// console.log("uploadUrl",uploadUrl)

// request interceptor
service.interceptors.request.use(
  (config) => {

    // if (config.url.includes('/rest/api/smc/')) {
    //   config.baseURL = 'http://localhost:8090'; //  只改 baseURL
    // }

    // const method = config.data?.method; // 从 data 中取 method

    // const isRetailApi = typeof method === 'string' && method.includes('@retail');

    // if (isRetailApi) {
    //   // 设置专属的 baseURL
    //   config.baseURL = 'http://localhost:8090/rest/api/smc/';

    //   // 设置 url 为空或 /
    //   config.url = ''; // 让 axios 使用 baseURL 本身
    // }

    // console.log(config)
    if (store.getters.token) {
      config.headers['Authorization-admin'] = getToken()
      // config.headers['Content-Type'] = 'application/json'
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'
      // config.headers['type'] = ' admin'
      // console.log('config',config);
    }


    const iRetailToken = localStorage.getItem('iRetailToken');

    if (iRetailToken) {
      config.headers['Authorization'] = 'Bearer ' + iRetailToken ;
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    // console.log('response!!!', response)
    console.log(1111);
    console.log(response.data);


    const res = response.data
    const res1 = response;
    console.log(res.data);

    // if (res1 && 'code' in res1 && res1.code === 0) {
    //   // code存在且等于0
    //   console.log('请求成功', res1);
    //   return res1;
    // }


    // 对于查货用户的特殊处理
    if (isEtdsUser()) {
      // 检查token相关错误
      if (res.code === 20003 || res.code === '20003' || res.code === 20004 || res.code === '20004' || res.code === 20005 || res.code === '20005') {
        localStorage.clear()
        removeToken()
        router.push({ path: '/login' })
        location.reload()
        return Promise.reject(new Error(res.message || 'Token已过期，请重新登录'))
      }

      // 文件上传接口，直接返回结果，不做校验
      if (response.config.url && (
        response.config.url.includes('/file/upload') ||
          response.config.url.includes('/file/delete') ||
          response.config.url.includes('/etdsLicZcReport/') ||
          response.config.url.includes(ETDS_BASE_URL)
     )) {
        return res
      }
    }

    if (response.config.responseType === 'blob') {
      // console.log(response.data)
      return response.data
    }

      //iRetail登录返回res
    if(res.code === 0){
      console.log("iRetaillogin");

      return res
    }
    console.log('res.code && res.status',res,res.code, res.status);
    if (res.code!=undefined && res.code !== '') {
      // 对于查货相关接口，即使code不为空也可能是正常情况
      if (isEtdsUser() && (res.code === 0 || res.message)) {
        return res
      }

      if (res.code === 'test' || res.code === "200" || res.code === 'num' || res.code === 'errorlist' || res.code === 'auditfail') {
        return res
      }

      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      const tokenerr = [20003, '20003', 20004, '20004', 20005, '20005']
      if (tokenerr.includes(res.code)) {
        localStorage.clear()
        removeToken()
        router.push({ path: '/login' })
        location.reload()
      }
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        console.log('进来了吗');
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        ).then(() => {
          store.dispatch(UserActionEnum.RESET_TOKEN).then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    // 对于查货用户的上传或请求错误，尝试提取有用信息
    if (isEtdsUser() && error.response && error.response.data) {
      // 如果错误响应包含message字段，可能是一个有效的返回值
      if (error.response.data.message) {
        return error.response.data
      }
    }

    if (!error.message.includes('timeout')) {
      Message({
        message: '服务器暂无响应，请稍后重试【'+error.message+'】',
        type: 'error',
        duration: 5 * 1000,
      })
    }
    return Promise.reject(error)
  }
)

export default service

// 文件下载请求
export async function downloadRequest (url, method = 'POST', data) {
  // 使用配置好的service实例发送请求
  const response = await service({
    url,
    data,
    method,
    responseType: 'arraybuffer',
    headers: {
      // 覆盖默认的Content-Type，因为下载请求需要使用form格式
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization-admin': getToken() // 确保携带token
    }
  })

  // 检查响应状态
  if (response) {
    return response
  } else {
    throw new Error(response.data?.message || '下载失败')
  }
}


export async function requestSmc({ method, params, timeout = 1800000 }) {
 return await service({
    url: '/rest/api/smc',
    method: 'post',
    timeout,
    data: {
      method,
      params
    }
  });
}
