import request from '@/utils/request'

/**
 * 获取报表结果列表（分页）
 * @param {Number} pageNum - 页码，默认1
 * @param {Number} pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export const getScmResultList = (pageNum = 1, pageSize = 10) => {
  return request({
    url: '/scm/getresultlist',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

/**
 * 获取报表全量数据（用于Excel导出）
 * @returns {Promise}
 */
export const getScmResultAll = () => {
  return request({
    url: '/scm/getresultall',   
    method: 'get'
  })
}

/**
 * 更新报表全量数据
 * 
 */
export const update = () => {
  return request({
    url: '/scm/update', 
    method: 'post'
  })
}


/**
 * 强制更新指定时间段数据 (历史模式用)
 * @param {Object} data - { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
 */
export const update2 = (data) => {
  return request({
    url: '/scm/historyupdate', 
    method: 'post',
    data 
  })
}