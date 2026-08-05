import { ElNotification } from 'element-plus'
import request from '@/utils/request'

//错误信息通知
export const showError = (message) => {
  ElNotification({
    title: '错误提示',
    message: message,
    type: 'error',
    position: 'bottom-right', // Element 不支持 center，但可自定义位置
    duration: 3000,          // 延长显示时间
    customClass: 'custom-notify', // 添加自定义类名
  })
}

//正确信息通知
export const showCorrect = (message) => {
  ElMessage({
    message: message,
    type: 'success',
    duration: 2000,  // 比错误信息稍短
    customClass: 'message-correct',
    offset: 40,     // 距离顶部偏移量
  })
}

/**
* 日期格式化工具函数
 * @param {Date|number|string} date - 需要格式化的日期
 * @param {string} format - 格式字符串，默认 'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 */
export function formatTimeToStr(date, format = "yyyy-MM-dd") {
  if (!date) return "";
  const d = new Date(date);
  const pad = n => (n < 10 ? "0" + n : n);
  return format
    .replace("yyyy", d.getFullYear())
    .replace("MM", pad(d.getMonth() + 1))
    .replace("dd", pad(d.getDate()));
}

export function getLicZcPsw(params) {
  return request({
    url: '/liczcpsw/getLicZcPsw',
    method: 'post',
    data: params,
  })
}

export function updateLicZcPsw(params) {
  return request({
    url: '/liczcpsw/updateLicZcPsw',
    method: 'post',
    data: params,
  })
}

export const searchFormConfig = {
  submitBtn: false,
  emptyBtn: false,
  menuSpan: 6,
  dialogClickModal: false,
  column: [
    {
      prop: 'sdate',
      label: '开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 24,
    },
    {
      prop: 'edate',
      label: '结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 24,
      pickerOptions: {},
    },
    {
      prop: 'z_sdate',
      label: '开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 12,
    },
    {
      prop: 'z_edate',
      label: '结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 8,
      pickerOptions: {},
    },
    {
      prop: 'po_no',
      label: '款号',
      type: 'input',
      span: 24,
      placeholder: '请输入款号'
    }
  ],
}

export const tableConfig = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  columns: [
    {
      label: '合同号',
      prop: 'po_no',
      sortable: true
    },
    {
      label: '联营类型',
      prop: 'lic_type',
      sortable: true
    },
    {
      label: '确认结果',
      prop: 'result',
      sortable: true
    },
    {
      label: '提交日期',
      prop: 'psw_time',
      sortable: true,
      type: 'date',
      valueFormat: 'YYYY-MM-DD'
    },
    {
      label: '自查日期',
      prop: 'bc_date',
      sortable: true,
      type: 'date',
      valueFormat: 'YYYY-MM-DD'
    }
  ]
}


