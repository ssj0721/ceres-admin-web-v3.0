import request from '@/utils/request';

/**
 * 获取联营自查品审数据列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getLicZcPswList (params) {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/getliczcpsw',
    method: 'post',
    data: params
  });
}

/**
 * 获取联营商下拉列表
 * @returns {Promise}
 */
export function getLicCodeList3 () {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/getliccodelist3',
    method: 'post',
    data: {}
  });
}

/**
 * 批量更新联营自查品审结果
 * @param {Object} params - 包含 list 和 result 的参数对象
 * @returns {Promise}
 */
export function updateLicSpotPsw (params) {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/updateLicSpotPsw',
    method: 'post',
    data: params
  });
}
