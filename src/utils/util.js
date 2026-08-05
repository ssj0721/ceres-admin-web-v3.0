import {
    validatenull
} from "./validate-iRetail"
import store from '@/store'
// import {
//     api
// } from "../plugins/axios";
// import * as CryptoJS from "crypto-js";
import { downloadFileUrl, delFileUrl } from "@/config/env"
import axios from 'axios'
// import Vue from 'vue';
// import store from '../store'

//表单序列化
export const serialize = data => {
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join("&");
};
export const getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
    };
    if (obj instanceof Element) {
        return "element";
    }
    return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
export const deepClone = data => {
    var type = getObjType(data);
    var obj;
    if (type === "array") {
        obj = [];
    } else if (type === "object") {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if (type === "array") {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === "object") {
        for (var key in data) {
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
    if (status) {
        document.body.className = document.body.className + " grayMode";
    } else {
        document.body.className = document.body.className.replace(" grayMode", "");
    }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
    document.body.className = name;
}

/**
 * 加密处理
 */
export const encryption = (params) => {
    let {
        data,
        type,
        param,
        key
    } = params;
    let result = JSON.parse(JSON.stringify(data));
    if (type == "Base64") {
        param.forEach(ele => {
            result[ele] = btoa(result[ele]);
        })
    } else if (type == "Aes") {
        param.forEach(ele => {
            var orgData = result[ele];
            key = CryptoJS.enc.Latin1.parse(key)
            var iv = key
            // 加密
            var encrypted = CryptoJS.AES.encrypt(
                orgData,
                key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            })
            result[ele] = encrypted.toString()

            //result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
        })

    } else if (type == "Des") {
        param.forEach(ele => {
            result[ele] = CryptoJS.DES.encrypt(result[ele], key).toString();
        })

    }
    return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
        exitFullScreen();
    } else {
        reqFullScreen();
    }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
    function listen() {
        callback()
    }
    document.addEventListener("fullscreenchange", function () {
        listen();
    });
    document.addEventListener("mozfullscreenchange", function () {
        listen();
    });
    document.addEventListener("webkitfullscreenchange", function () {
        listen();
    });
    document.addEventListener("msfullscreenchange", function () {
        listen();
    });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
    var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length != 0) {
            for (let j = 0; j < menu[i].children.length; j++) {
                if (menu[i].children[j].id == id) {
                    return menu[i];
                } else {
                    if (menu[i].children[j].children.length != 0) {
                        return findParent(menu[i].children[j].children, id);
                    }
                }
            }
        }
    }
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
    delete obj1.close;
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) {
        /*  判断不是对象  */
        return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }

    for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
            return false;
        }
    }
    return true;
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
    let result = "";
    if (validatenull(dic)) return value;
    if (typeof (value) == "string" || typeof (value) == "number" || typeof (value) == "boolean") {
        let index = 0;
        index = findArray(dic, value);
        if (index != -1) {
            result = dic[index].label;
        } else {
            result = value;
        }
    } else if (value instanceof Array) {
        result = [];
        let index = 0;
        value.forEach(ele => {
            index = findArray(dic, ele);
            if (index != -1) {
                result.push(dic[index].label);
            } else {
                result.push(value);
            }
        });
        result = result.toString();
    }
    return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
        if (dic[i].value == value) {
            return i;
        }
    }
    return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = "";
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
    if (date) random = random + Date.now();
    return random;
};
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}

/**
 *  <img> <a> src 处理
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
export function handleImg(fileName, id) {
    return validatenull(fileName) ? null : api.fetch({
        url: "/admin/file/" + fileName,
        method: "get",
        responseType: "blob"
    }).then((response) => { // 处理返回的文件流
        let blob = response.data;
        let img = document.getElementById(id);
        img.src = URL.createObjectURL(blob);
        window.setTimeout(function () {
            window.URL.revokeObjectURL(blob)
        }, 0)
    })
}

/**
 * Excel导出
 */

export const FILE_CONTECT_TYPE = {
    EXCEL_TYPE: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    DOC_TYPE: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    GIF_TYPE: "image/gif",
    IMG_TYPE: "image/jpeg,application/x-jpg,application/x-png",
    TXT_TYPE: "text/plain",
    CSV_TYPE: ".csv,text/csv",
    PPT_TYPE: "application/x-ppt,application/vnd.ms-powerpoint",
    ZIP_TYPE: "application/x-zip-compressed,application/octet-stream"
}

export const FILE_CONFIG = {
    IMPORT_TABLE: {
        uploadData: {
            file: {},
            fileName: "",
            fileId: "",
            content: "", // content-type+base64
            isReady: false // true表示未生成完
        },
        tipShow: false,
        accept: ["application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], // 数组定义文件接受类型, 不定义为所有类型
        directImport: true // 控制显示组件是否是直接导入类型
    },
    IMPORT_FORM: {
        importTip: "选择文件",
        tipShow: false,
        uploadData: {
            file: {},
            fileName: "",
            fileId: "",
            content: "", // content-type+base64
            isReady: false // true表示未生成完
        },
        accept: ["application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], // 数组定义文件接受类型, 不定义为所有类型
        directImport: false // 控制显示组件是否是直接导入类型
    }
}
export const excel = {
    excelExport: (fileName, base64, fileext) => {
        if (fileext == undefined)
            fileext = ".xls";
        let name = fileName + fileext
        let bstr = atob(base64.split(",")[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr]);
        if ("download" in document.createElement("a")) {
            // if (window.addEventListener && !document.all && !(navigator.appName == navigatorName)) {
            // 谷歌运行
            let objectUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.setAttribute("style", "display:none");
            a.setAttribute("href", objectUrl);
            a.setAttribute("download", name);
            // 此写法兼容可火狐浏览器
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(objectUrl);
            document.body.removeChild(a);
        } else {
            // 兼容ie运行
            navigator.msSaveBlob(blob, name);
        }
    }
}

export const httputil = {
    downloadFileUrl: downloadFileUrl,
    deleteFileUrl: delFileUrl,

    openUrlInNewWindow: (url) => {
        window.open(encodeURI(url), "_blank"); //打开新窗口
    },

    base64ToBstr: (base64) => {
        let bstr = atob(base64.split(",")[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        } return bstr;
    },

    savefile: (blob, fileName) => {
        if ("download" in document.createElement("a")) {
            // if (window.addEventListener && !document.all && !(navigator.appName == navigatorName)) {
            // 谷歌运行
            //let objectUrl = window.URL.createObjectURL(blob);
            let objectUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
            let a = document.createElement("a");
            a.setAttribute("style", "display:none");
            a.setAttribute("href", objectUrl);
            a.setAttribute("download", fileName);
            // 此写法兼容可火狐浏览器
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(objectUrl);
            document.body.removeChild(a);
        } else {
            // 兼容ie运行
            navigator.msSaveBlob(blob, fileName);
        }
    },

    downloadFileByBrowser: (fileId, fileName, deletAfterDownload) => {
        let url = httputil.downloadFileUrl + "?fileId=" + fileId;
        httputil.openUrlInNewWindow(url);
        if (deletAfterDownload) {
            setTimeout(() => {
                httputil.deleteFile(fileId);
            }, 60000);
        }
    },

    downloadFile: async (fileId, fileName, deletAfterDownload) => {
    // 定义目标路径
    const targetPath = '/smc/sys/file/download/';
    // 从 downloadFileUrl 中查找目标路径的起始位置
    const index = httputil.downloadFileUrl.indexOf(targetPath);

    // 如果找到了目标路径
    let correctedDownloadFileUrl;
    if (index!== -1) {
        // 截取目标路径作为修正后的 URL
        correctedDownloadFileUrl = targetPath;
    } else {
        // 如果没找到，使用原始的 downloadFileUrl（这种情况理论上不应该出现）
        correctedDownloadFileUrl = httputil.downloadFileUrl;
    }

    // 生成最终的下载 URL
    let url = correctedDownloadFileUrl + "?fileId=" + fileId;
    console.log('生成的下载 URL:', url); 
    console.log('修正后的 downloadFileUrl:', correctedDownloadFileUrl);


        // 获取 iRetailToken
        const iRetailToken = localStorage.getItem('iRetailToken');
        const headers = {};
        
        // const token = store.getters.token;
        // if (token) {
        //     headers['Authorization-admin'] = token;
        //     headers['Content-Type'] = 'application/json; charset=UTF-8';
        // }

        
        if (iRetailToken) {
            headers['Authorization'] = `Bearer ${iRetailToken}`;
        }

        axios.get(url, {
            responseType: "arraybuffer",
            headers
        }).then((response) => { // 处理返回的文件流
            console.log("response", response)
            //const { data, headers } = response
            //const origFileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
            // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
            //const blob = new Blob([JSON.stringify(data)], ...)
            //const blob = new Blob([data], {type: headers['content-type']});
            let blob = new Blob([response.data]);
            //let blob = response.data;
            httputil.savefile(blob, fileName);
            if (deletAfterDownload) {
                setTimeout(() => {
                    httputil.deleteFile(fileId);
                }, 10000);
            }
        });
    },

    deleteFile: (fileId) => {
        let url = httputil.deleteFileUrl;

        api.delete(url, {
            fileId: fileId,
        }).then(() => { // 处理返回
            //let data = response.data;
        });
    },
}


export function debounce(func, delay) {
    let timer
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
/**
 * 判断数组是否存在字符value
 */
export const array = {
    contain: (array, value) => {
        if (array !== undefined) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] == value) {
                    return true;
                }
            }
        }
        return false;
    }
};

export const StringUtil = {
    strToStrArr: function (str, sep) {
        let arr = [];
        if (str !== undefined && str !== "") {
            arr = str.split(sep);
        }
        return arr;
    },
    strToIntArr: function (str, sep) {
        let arr = [];
        let strArr = this.strToStrArr(str, sep);
        strArr.forEach(
            (e) => {
                arr.push(parseInt(e));
            }
        );
        return arr;
    },
    arrToStr: function (arr, sep) {
        if (arr == undefined)
            return undefined;
        return arr.join(sep);
    },
};


export const logUtil = {
    log: (info, msg, stack) => {
        Vue.nextTick(() => {
            // store.commit('ADD_LOGS', {
            //     type: 'error',
            //     message: msg,
            //     stack: stack,
            //     info
            // })

            if (process.env.NODE_ENV === 'development') {
                console.group('>>>>>> 错误信息 >>>>>>')
                console.log(info)
                console.log(msg)
                console.log(stack)
                console.groupEnd();
            }

            //throw new Error(msg);
        })
    }
};

// export default ({
//     Vue
// }) => {
//     Vue.prototype.$logUtil = logUtil
//     Vue.prototype.$httputil = httputil
//     Vue.prototype.$excel = excel
//     Vue.prototype.$FILETYPE = FILE_CONTECT_TYPE
//     Vue.prototype.$FILE_CONFIG = FILE_CONFIG
//     Vue.prototype.$array = array
// }

export default {
    install(app) {
      app.config.globalProperties.$logUtil = logUtil
      app.config.globalProperties.$httputil = httputil
      app.config.globalProperties.$excel = excel
      app.config.globalProperties.$FILETYPE = FILE_CONTECT_TYPE
      app.config.globalProperties.$FILE_CONFIG = FILE_CONFIG
      app.config.globalProperties.$array = array
    }
  }