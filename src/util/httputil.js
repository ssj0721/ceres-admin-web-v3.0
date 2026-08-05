import { subDomain, downloadTempFileUrl, delTempFileUrl } from "@/config/env"
import { api } from "@/plugins/axios"

export function getSubDomain() {
    let subDomain = window.location.pathname;
    if (subDomain.substr(subDomain.length - 1) == "/")
        subDomain = subDomain.substr(0, subDomain.length - 1);
    console.log("subDomain", subDomain);
    return subDomain;
}

export function checkSubDomainChanged() {
    return subDomain != getSubDomain();
}

//检查二级域名切换，自动切换租户
export function checkAndSwitchSubDomainChanged() {
}

export function openUrlInNewWindow(url) {
    window.open(encodeURI(url), "_blank"); //打开新窗口
}

export function downloadFile(fileId) {
    let url = downloadTempFileUrl + fileId;
    openUrlInNewWindow(url);
}

export function delTempFile(fileId) {
    api.get(delTempFileUrl + fileId);
}
