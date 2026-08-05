export default function downloadByBlod(url,name) {
    let fileUrl = url;
    let fileName = name;

let xhr = new XMLHttpRequest();
xhr.open('GET', fileUrl, true);
xhr.responseType = 'blob'; // 对于任何类型的文件下载，都设置为'blob'

xhr.onload = function() {
    if (xhr.status === 200) {
        let fileBlob = xhr.response;
        let url = window.URL.createObjectURL(fileBlob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.download = fileName; // 设置下载的文件名
        a.href = url;
        document.body.appendChild(a); // 添加到DOM中（虽然隐藏了，但某些浏览器可能需要这一步）
        a.click(); // 触发下载

        // 清理：释放URL对象并从DOM中移除<a>标签
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        console.error('Failed to download file:', xhr.statusText);
    }
};

xhr.onerror = function() {
    console.error('Network error occurred while downloading file.');
};

xhr.send();

}