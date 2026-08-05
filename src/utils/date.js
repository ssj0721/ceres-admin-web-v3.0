
// 格式化日期显示
export function formatDate (date) {
  if (!date) { return '' }
  return date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日')
}
