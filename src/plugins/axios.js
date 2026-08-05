import axios from "axios"
import { dialog } from "@/utils/dialog"
import * as env from "@/config/env"
import { logUtil } from "@/utils/util"

// let Axios = axios.create({
//     /*
//     baseURL: 'http://localhost:8080/',
//     */
//     //baseURL: api.url,
//     //withCredentials: true,
//     // headers: {
//     //   'Content-Type': 'application/json;charset=utf-8'
//     // }
// })


function checkStatus(response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return Promise.reject({
        status: -404,
        msg: "网络异常"
    });
}

function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        dialog.showError(res.msg);
        logUtil.log("发生错误，错误代码：" + res.status, res.msg);

        return Promise.reject(res);
    }
    if (res.data && (res.data.code !== 0)) {
        logUtil.log("发生错误，错误代码：" + res.data.code, res.data.message);
    }
    if (res.data && (res.data.code < 0)) {
        dialog.showError(res.data.message);
        logUtil.log("发生错误，错误代码：" + res.data.code, res.data.message);

        //router.replace('/')
        return Promise.reject(res);
    }
    return res
}

let defaultApi = env.baseUrl
let reportApi = env.reportApiUrl

export const api = {
    post: (url, params, quiet, timeout) => {
        //params.params必须有一个参数
        if (params != undefined && params.params == undefined) {

            params.params = { temp: "" };
        }

        return axios.request({
            method: "post",
            url,
            data: params,
            params: null,
            timeout: timeout,
            quiet: quiet || false
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },

    get: (url, params, quiet) => {
        return axios.request({
            method: "get",
            url,
            params: params,
            quiet: quiet || false
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },

    delete: (url, params, quiet) => {
        return axios.request({
            method: "delete",
            url,
            params: params,
            quiet: quiet || false
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },

    fetch: (params, path, timeout) => {
        // console.log(path)
        let apiPath = path || defaultApi
        return api.post(apiPath, params, undefined, timeout)
    },

    submit: (params, path) => {
        let apiPath = path || defaultApi
        return api.post(apiPath, params)
    },

    fetchQuiet: (params, path) => {
        // console.log(path)
        let apiPath = path || defaultApi
        return api.post(apiPath, params, true)
    },

    report: (params, path, timeout) => {
        // console.log(path)
        let apiPath = path || reportApi
        return api.post(apiPath, params, undefined, timeout)
    },

    fetchFile: async (path, params, api) => {
        const fetchApi = api || defaultApi;
        const apiPath = fetchApi + path;
        const res = await fetch(apiPath, {
            method: params.method || "POST",
            headers: params.headers || {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params.data),
        });

        const reg = /filename=([^;]+)/;
        const fileName = decodeURI(res.headers.get("content-disposition").match(reg)[1]);
        // console.log("headers", res.headers);
        const blob = await res.blob();
        return {
            data: blob,
            total: res.headers.get("content-length") || null,
            fileName: fileName || "unknowfile"
        };
    },
    fetchReportFile: (path, params) => {
        return api.fetchFile(path, params, reportApi);
    }
}

export default ({ Vue }) => {
    Vue.prototype.$api = api
}