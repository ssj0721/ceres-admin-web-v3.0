import request from '@/utils/request';

// 1. 获取部门下拉列表（品种）
export function fnGetKindCodeList2() {
  return request({
    url: '/etdslicdaichuSq/getlicCodeList2',
    method: 'post',
    data: {}
  });
}

// 2. 获取许可证下拉列表（授权商）
export function fnGetLicCodeList(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCodeList',
    method: 'post',
    data: params
  });
}

// 3. 获取客户下拉列表
export function fnGetLicCustCodeList(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCustCodeList',
    method: 'post',
    data: params
  });
}

// 4. 获取用户权限许可证列表
export function fnGetLicCheckSqLicCodeList(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCheckSq_liccodelist',
    method: 'post',
    data: params
  });
}

// 5. 获取统计数字（品种/已申请/占比）
export function fnGetKindQty(params) {
  return request({
    url: '/etdslicdaichuSq/getkindqty',
    method: 'post',
    data: params
  });
}

// 6. 获取主表格数据（待处理）
export function fnGetLicCheckSqDaichuData(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCheckSq_daichuData',
    method: 'post',
    data: params
  });
}

// 7. 获取款式状态（批量）
export function fnGetLicPoState(params) {
  return request({
    url: '/etdslicdaichuSq/getLicPoState',
    method: 'post',
    data: params
  });
}
export function exportData(data) {
  return request({
    url: '/etdslicdaichuSq/dataExport',
    method: 'post',
    data,
  })
}


// 检查评仓状态
export function checkLicPortStatus(data) {
  return request({
    url: '/etdslicdaichuSq/licCheckPort',
    method: 'post',
    data
  });
}

// 获取联营翻查数据
export function getLicCheckSqLy(data) {
  return request({
    url: '/etdslicdaichuSq/getLicCheckSq_ly',
    method: 'post',
    data
  });
}

// 更新翻查数据
export function updateLicCheckSqData(data) {
  return request({
    url: '/etdslicdaichuSq/updateLicCheckSqData',
    method: 'post',
    data
  });
}

// 保存新数据
export function saveLicCheckSqData(data) {
  return request({
    url: '/etdslicdaichuSq/saveLicCheckSqData',
    method: 'post',
    data
  });
}

// 删除数据
export function deleteLicCheckSqData(data) {
  return request({
    url: '/etdslicdaichuSq/deleteLicCheckSqData',
    method: 'post',
    data
  });
}

// 8. 检查评仓状态
export function fnCheckPortStatus(params) {
  return request({
    url: '/etdslicdaichuSq/checkPortStatus',
    method: 'post',
    data: params
  });
}

// 9. 检查款号是否已经存在查货申请（避免重复申请）
export function fnGetlicCheckSq_ly(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCheckSq_ly',
    method: 'post',
    data: params
  });
}

// 10. 获取查货详情数据（已保存的数据）
export function fnGetlicCheckSqDetail(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCheckSq_detail',
    method: 'post',
    data: params
  });
}

// 10.1 获取新增详情数据（用于新增时初始化）
export function fnGetlicCheckSqDetailNew(params) {
  return request({
    url: '/etdslicdaichuSq/getlicCheckSqDetail_new',
    method: 'post',
    data: params
  });
}

// 11. 保存新增详情数据
export function fnSaveNewLicCheckSqDetail(params) {
  return request({
    url: '/etdslicdaichuSq/saveNewLicCheckSqDetail',
    method: 'post',
    data: params
  });
}

// 12. 删除查货计划数据
export function fnDeleteLicCheckSqDetail(params) {
  return request({
    url: '/etdslicdaichuSq/deleteLicCheckSqDetail',
    method: 'post',
    data: params
  });
}

// 12.1. 更新查货计划数据
export function fnUpdateLicCheckSqDetail(params) {
  return request({
    url: '/etdslicdaichuSq/updateLicCheckSqDetail',
    method: 'post',
    data: params
  });
}

// 13. 获取印花款数据
export function getPicItemCodeData(params) {
  return request({
    url: '/etdslicdaichuSq/getPicItemCodeData',
    method: 'post',
    data: params
  });
}

export function getLcData(params) {
  return request({
    url: '/licloucha/getLcData',
    method: 'post',
    data: params
  });
}

export function exportLcData(params) {
  return request({
    url: '/licloucha/exportLcData',
    method: 'post',
    data: params
  });
}
