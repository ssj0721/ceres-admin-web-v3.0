// 商标信息表列配置
export const columnConfig = [
  { prop: 'brandPicUrl', label: '商标图样', align: 'center', width: 360, show: true, isImage: true },
  { prop: 'brandNo', label: '商标注册号', align: 'center', width: 160, show: true },
  { prop: 'applyNo', label: '商标申请号', align: 'center', width: 160, show: true },
  { prop: 'applyStatus', label: '申请状态', align: 'center', width: 100, show: true },
  { prop: 'registerType', label: '注册类型', align: 'center', width: 130, show: true },
  { prop: 'countryRegionId', label: '国家/地区', align: 'center', width: 120, show: true },
  { prop: 'companyId', label: '商标权利人', align: 'center', width: 180, show: true },
  { prop: 'seriesId', label: '商标系列', align: 'center', width: 140, show: true },
  { prop: 'scopeType', label: '境内境外', align: 'center', width: 100, show: true },
  { prop: 'firssecApplyDate', label: '首次申请日期', align: 'center', width: 130, show: true, isDate: true },
  { prop: 'validityStarsecDate', label: '有效期开始', align: 'center', width: 130, show: true, isDate: true },
  { prop: 'validityEndDate', label: '有效期结束', align: 'center', width: 130, show: true, isDate: true },
  { prop: 'isValid', label: '是否有效', align: 'center', width: 100, show: true },
  { prop: 'agensecId', label: '代理人', align: 'center', width: 140, show: true },
  { prop: 'renewalDate', label: '续展申请日期', align: 'center', width: 130, show: true, isDate: true },
  { prop: 'renewalStatus', label: '续展状态', align: 'center', width: 100, show: true },
  { prop: 'manager', label: '商标负责人', align: 'center', width: 120, show: true },
  { prop: 'brandRemarks', label: '商标备注', align: 'center', width: 200, show: false },
  { prop: 'registrationDate', label: '注册证下发日期', align: 'center', width: 130, show: true, isDate: true },
  { prop: 'transferStatus', label: '转让状态', align: 'center', width: 100, show: true },
  { prop: 'storageId', label: '正本存储位置', align: 'center', width: 160, show: false },
]

// 申请状态
export const applyStatusMap = { 0: '申请中', 1: '已注册' }
// 商标状态
export const brandStatusMap = { 0: '注册中', 1: '驳回复审失败', 2: '异议答辩失败', 3: '异议复审失败', 4: '驳回复审中', 5: '异议答辩中', 6: '异议复审中' }
// 注册类型
export const registerTypeMap = { 0: '新设计', 1: '扩大商品类别', 2: '新增国家地区', 3: '保护下注册' }
// 境内境外
export const scopeTypeMap = { 0: '境内', 1: '境外' }
// 是否有效
export const isValidMap = { 0: '无效', 1: '有效' }
// 续展状态
export const renewalStatusMap = { 0: '未续展', 1: '已续展' }
// 转让状态
export const transferStatusMap = { 0: '未转让', 1: '已转让' }
