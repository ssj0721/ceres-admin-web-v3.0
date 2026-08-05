export const searchFormConfig = {
  submitBtn: false,
  emptyBtn: false,
  menuSpan: 3,
  dialogClickModal: false,
  column: [
    {
      prop: 'sdate',
      label: '开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },

    {
      prop: 'edate',
      label: '结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 10,
    },

  ],
}

export const tableConfig = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  columns: [
    {
      label: '款号',
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

export const confirmTypeOptions = [
  { label: '返修', value: 0 },
  { label: '不再上架', value: 1 },
  { label: '重审', value: 2 }
]
