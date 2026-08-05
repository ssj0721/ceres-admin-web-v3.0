import request from '@/utils/request'

// 联营商款式审核查询
export function brandGetAll(data) {
  return request({
    url: '/itemCheck/getAll01',
    method: 'post',
    data,
  })
}

// 获得大类下拉框内容
export function getlcName(data) {
  return request({
    url: '/itemCheck/getlcName',
    method: 'post',
    data,
  })
}

// 获得品种下拉框内容
export function getdepName(data) {
  return request({
    url: '/itemCheck/getdepName',
    method: 'post',
    data,
  })
}

// 获得类别下拉框内容
export function getscName(data) {
  return request({
    url: '/itemCheck/getscName',
    method: 'post',
    data,
  })
}

// 获得品种细分下拉框内容
export function getpriceName(data) {
  return request({
    url: '/itemCheck/getpriceName',
    method: 'post',
    data,
  })
}

// 编辑弹窗信息
export function getEdit(data) {
  return request({
    url: '/itemCheck/getEdit',
    method: 'post',
    data,
  })
}

// 保存编辑弹窗信息
export function editProduct(data) {
  return request({
    url: '/itemCheck/editProduct',
    method: 'post',
    data,
  })
}

// 补充资料前校验年季、销售季期是否与当前日期匹配
export function matchCurDateApi(data) {
  return request({
    url: '/itemCheck/matchCurDate',
    method: 'post',
    data,
  })
}

// 校验销售季期
export function checkplansaledate(data) {
  return request({
    url: '/itemCheck/checkplansaledate',
    method: 'post',
    data,
  })
}

// 导出商品
export function productExport(data) {
  return request({
    url: '/itemCheck/export01',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 商家编辑查询
export function getById(data) {
  return request({
    url: '/itemCheck/getById',
    method: 'post',
    data,
  })
}

// 审批通过
export function stateAccept(data) {
  return request({
    url: '/itemCheck/stateAccept',
    method: 'post',
    data,
  })
}

// 审批否决
export function stateReject(data) {
  return request({
    url: '/itemCheck/stateReject',
    method: 'post',
    data,
  })
}

// 获取审款的列表
export function querySysDictData(data) {
  return request({
    url: '/itemCheck/querySysDictData',
    method: 'post',
    data,
  })
}

// 否决原因
export function getRejectReasons(data) {
  return request({
    url: '/itemCheck/getRejectReasons',
    method: 'post',
    data,
  })
}

// 预审搜图
export function searchImage(data) {
  return request({
    url: '/itemCheck/searchImage',
    method: 'post',
    data,
  })
}

// 预审搜图--获取审款图片信息
export function getSKimage(data) {
  return request({
    url: '/itemCheck/getSKimage',
    method: 'post',
    data,
  })
}

// 批量搜图
export function searchMorePic(data) {
  return request({
    url: '/itemCheck/searchMorePic',
    method: 'post',
    data,
  })
}

// 获取上次批量搜图结果
export function getLastSearchImageResult(data) {
  return request({
    url: '/itemCheck/getLastSearchImageResult',
    method: 'post',
    data,
  })
}

export function queryitemcode(data) {
  return request({
    url: '/itemCheck/queryitemcode',
    method: 'post',
    data
  })
}

export function getPoItemClassList(data) {
  return request({
    url: '/itemCheck/getPoItemClassList',
    method: 'post',
    data
  })
}

export function getPlatformList(data) {
  return request({
    url: '/itemCheck/getPlatformList',
    method: 'post',
    data
  })
}

export function getOrglist(data) {
  return request({
    url: '/itemCheck/getOrglist',
    method: 'post',
    data
  })
}

export function getPlanSaleDate(data) {
  return request({
    url: '/itemCheck/getPlanSaleDateList',
    method: 'post',
    data
  })
}

export function getCorgcodes(data) {
  return request({
    url: '/itemCheck/getCorgcodes',
    method: 'post',
    data
  })
}

// 品牌列表
export function getSKBrandList() {
  return request({
    url: '/itemCheck/getBrandList',
    method: 'post',
  })
}

// 获取审款的列表
export function getDictList(data) {
  return request({
    url: '/itemCheck/getDictList',
    method: 'post',
    data
  })
}

// 获取开发渠道列表
export function getDevChannel(data) {
  return request({
    url: '/itemCheck/getDevChannel',
    method: 'post',
    data
  })
}

// 获得审款品种下拉框内容
export function queryDepData01(data) {
  return request({
    url: '/itemCheck/queryDepData01',
    method: 'post',
    data,
  })
}

// 获得审款性别下拉框内容
export function querySexData(data) {
  return request({
    url: '/itemCheck/querySexData',
    method: 'post',
    data,
  })
}

// 获得审款大类下拉框内容
export function queryAssData01(data) {
  return request({
    url: '/itemCheck/queryAssData01',
    method: 'post',
    data,
  })
}

// 获得审款平台下拉框内容
export function queryFormList(data) {
  return request({
    url: '/itemCheck/queryFormList',
    method: 'post',
    data,
  })
}

// 获得审款否决原因下拉框内容
export function queryRejectReason(data) {
  return request({
    url: '/itemCheck/queryRejectReason',
    method: 'post',
    data,
  })
}


export function updateSearchpicStatus(data) {
  return request({
    url: '/itemCheck/updateSearchpicStatus',
    method: 'post',
    data,
  })
}

// 作废申请
export function stateCancel(data) {
  return request({
    url: '/itemCheck/stateCancel',
    method: 'post',
    data,
  })
}

// 申请取回
export function appealBack(data) {
  return request({
    url: '/itemCheck/appealBack',
    method: 'post',
    data,
  })
}

// 导出搜图记录
export function exportSearchPicResult(data) {
  return request({
    url: '/itemCheck/exportSearchPicResult',
    method: 'post',
    data,
  })
}

// 获取支持的审核类型
export function getMyAuditScope(data) {
  return request({
    url: '/itemCheck/getMyAuditScope',
    method: 'post',
    data,
  })
}