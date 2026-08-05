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