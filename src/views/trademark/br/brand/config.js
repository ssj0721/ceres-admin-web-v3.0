// 商标台账枚举映射
// 申请状态
export const applyStatusMap = { 0: '申请中', 1: '已注册' }
// 商标状态
export const brandStatusMap = { 0: '注册中', 1: '驳回复审失败', 2: '异议答辩失败', 3: '异议复审失败', 4: '驳回复审中', 5: '异议答辩中', 6: '异议复审中' }
// 注册类型
export const registerTypeMap = { 0: '新设计', 1: '扩大商品类别', 2: '新增国家地区', 3: '保护下注册' }
// 境内境外
export const scopeTypeMap = { 1: '境内', 2: '境外' }
// 是否有效
export const isValidMap = { 0: '无效', 1: '有效' }
// 续展状态
export const renewalStatusMap = { 0: '未续展', 1: '已续展' }
// 转让状态
export const transferStatusMap = { 0: '未转让', 1: '已转让' }
// 注册状态（台账派生） 0-未注册 1-注册成功 2-注册失败
export const registerStatusMap = { 0: '未注册', 1: '注册成功', 2: '注册失败' }
// 注册状态下拉选项
export const registerStatusOptions = [
  { label: '未注册', value: 0 },
  { label: '注册成功', value: 1 },
  { label: '注册失败', value: 2 },
]
// 境内/境外下拉选项
export const scopeOptions = [
  { label: '境内', value: 1 },
  { label: '境外', value: 2 },
]
