import request from '@/utils/request';

// 查询表单配置
export const searchFormConfig = {
  submitBtn: false,
  emptyBtn: false,
  menuSpan: 3,
  dialogClickModal: false,
  column: [
    {
      prop: 'sdate',
      label: '提交开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },
    {
      prop: 'edate',
      label: '提交结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },
    {
      prop: 'spot_sdate',
      label: '抽检开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },
    {
      prop: 'spot_edate',
      label: '抽检结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },
    {
      prop: 'lic_sname',
      label: '联营商',
      type: 'select',
      multiple: true,
      filterable: true,
      dicData: [], // 运行时动态赋值
      span: 10,
    },
    {
      prop: 'cfm_state',
      label: '确认结果',
      type: 'select',
      multiple: true,
      dicData: [], // 运行时动态赋值
      span: 10,
    },
    {
      prop: 'po_no',
      label: '合同号',
      type: 'input',
      placeholder: '请输入合同号(模糊查询)，多款用空格、逗号分隔',
      span: 10,
    },
    {
      prop: 'lic_type',
      label: '联营类型',
      type: 'select',
      multiple: true,
      filterable: true,
      dicData: [
        { label: '联营业务', value: 0 },
        { label: '联营款', value: 1 }
      ],
      span: 10,
    },
    {
      prop: 'result',
      label: '确认结果',
      type: 'select',
      multiple: true,
      filterable: true,
      dicData: [
        { label: '返修', value: '0' },
        { label: '不再上架', value: '1' },
        { label: '复测', value: '2' },
        { label: '未确认', value: 'null' }
      ],
      span: 10,
    },
  ],
}

// 表格配置
export const tableConfig = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  columns: [
    { label: '报告id', prop: 'report_id', sortable: true },
    { label: '合同号', prop: 'po_no', sortable: true },
    { label: '联营类型', prop: 'lic_type', sortable: true },
    { label: '确认结果', prop: 'result', sortable: true },
    { label: '结果', prop: 'spot_status', sortable: true },
    { label: '提交日期', prop: 'date', sortable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    { label: '抽检日期', prop: 'spot_date', sortable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    { label: '联营商', prop: 'lic_sname', sortable: true },
    { label: '客户', prop: 'cust_name', sortable: true },
    { label: '备注', prop: 'remarks', sortable: true }
  ]
}

// 确认结果类型选项
export const confirmTypeOptions = [
  { label: '返修', value: 0 },
  { label: '不再上架', value: 1 },
  { label: '复测', value: 2 }
]

export function fetchReportList(data) {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/getliczcpsw',
    method: 'post',
    data,
  });
}

export function fetchLicCodeOptions() {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/getliccodelist3',
    method: 'post',
    data: {},
  });
}

export function updateLicSpotResult(data) {
  return request({
    url: '/etds/LiZcTestDqr/etdsLicZcReport/updateLicSpotPsw',
    method: 'post',
    data,
  });
}

/**
 * 日期格式化工具函数
 * @param {Date|number|string} date - 需要格式化的日期
 * @param {string} format - 格式字符串，兼容 'yyyy-MM-dd' 和 'YYYY-MM-DD'，默认 'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 */
export function formatTimeToStr(date, format = "yyyy-MM-dd") {
  if (!date) return "";
  const d = new Date(date);
  const pad = n => (n < 10 ? "0" + n : n);
  // 兼容大小写格式
  return format
    .replace(/yyyy|YYYY/, d.getFullYear())
    .replace(/MM/, pad(d.getMonth() + 1))
    .replace(/dd|DD/, pad(d.getDate()));
}