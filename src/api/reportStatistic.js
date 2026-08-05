import request from '@/utils/request'

/**
 * 每日菜单访问统计
 * @param {Object} param - 查询参数 { targetDate: String, appType: Integer }
 * @returns {Promise}
 */
export const statDailyData = (param) => {
  return request({
    url: '/scm/statDaily',
    method: 'post',
    data: param
  })
}

/**
 * 时间段菜单访问统计
 * @param {Object} param - 查询参数 { startDate: String, endDate: String, appType: Integer }
 * @returns {Promise}
 */
export const statRangeData = (param) => {
  return request({
    url: '/scm/statRange',
    method: 'post',
    data: param
  })
}

/**
 * 导出带图表的 Excel
 * @param {Object} param - 查询参数
 */
export const exportMenuReport = (param) => {
  return request({
    url: '/scm/exportExcel',
    method: 'post',
    data: param,
    responseType: 'blob' // 极其重要：告诉 axios 处理二进制流
  })
}