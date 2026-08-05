/**
 * 处理minio图片前缀
 */
const baseUrl = 'http://upload.gsitcloud.com/'
export const etdsImgPrefix = (url) => {
  if (url.startsWith(baseUrl)) {
    return url
  }
  return `${baseUrl}${url}`
}

// 去掉图片前缀
export const removeImgPrefix = (url) => {
  return url.replace(baseUrl, '')
}
