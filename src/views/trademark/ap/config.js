// 申请类型枚举
export const typeMap = {
  0: '商标注册申请',
  1: '变更',
  2: '更正',
  3: '转让',
  4: '续展',
  5: '异议答辩',
  6: '异议复审（我司为异议人）',
  7: '异议复审（我司为被异议人）',
  8: '驳回复审',
  9: '行政诉讼',
}

export const detailTypeMap = {
  0: '注册',
  1: '变更',
  2: '更正',
  3: '转让',
  4: '续展',
  5: '异议答辩',
  6: '异议复审（我司为异议人）',
  7: '异议复审（我司为被异议人）',
  8: '驳回复审',
  9: '行政诉讼',
}

export const typeOptions = Object.entries(typeMap).map(([value, label]) => ({
  value: Number(value),
  label,
}))

export const scopeMap = {
  1: '境内',
  2: '境外',
}

export const scopeOptions = [
  { value: 1, label: '境内' },
  { value: 2, label: '境外' },
]

export const statusMap = {
  0: '待提交',
  1: '签批中',
  2: '待确认',
  3: '已确认',
}

export const tabList = [
  { label: '待提交', value: 0 },
  { label: '签批中', value: 1 },
  { label: '待确认', value: 2 },
  { label: '已确认', value: 3 },
]

export const registerTypeMap = {
  0: '新设计',
  1: '扩大商品类别',
  2: '新增国家/地区',
  3: '防御性保护注册',
}

export const registerTypeOptions = Object.entries(registerTypeMap).map(([value, label]) => ({
  value: Number(value),
  label,
}))

export const transferTypeOptions = [
  { value: 0, label: '转出' },
  { value: 1, label: '转入' },
  { value: 2, label: '内部转让' },
]

export const brandStatusOptions = [
  { value: 0, label: '申请中' },
  { value: 1, label: '已注册' },
]

export const objectionResultOptions = [
  { value: 0, label: '成功' },
  { value: 1, label: '失败' },
]
