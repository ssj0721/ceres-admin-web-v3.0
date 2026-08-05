import axios from 'axios'

// 修正后的 getData 方法，接收 url 和 params 两个参数
export function getData(url, params) {
  return axios.post(url, params)
}