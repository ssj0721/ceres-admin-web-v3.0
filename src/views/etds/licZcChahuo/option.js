export const licZcChahuoFormOption = {
  submitBtn: false,
  emptyBtn: false,

  dialogClickModal: false,
  column: [
    {
      prop: 'sdate',
      label: '开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 11,
    },

    {
      prop: 'edate',
      label: '结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 11,
    },
    {
      prop: 'po_no',
      label: '款号',
      type: 'input',
      placeholder: '请输入款号,模糊查询，如果是以逗号分隔需要输入完整款号',
      span: 11,
    },
    {
      prop: 'sy_state',
      label: '审阅状态',
      type: 'select',
      dicData: [
        { label: '全部', value: '0' },
        { label: '一审', value: '1' },
        { label: '二审', value: '2' },
      ],
      span: 11,
    },
  ],
}

export const licZcChahuoTableOption = {
  selection: true,
  page: true,
  align: 'center',
  menuAlign: 'center',
  highlightCurrentRow: true,
  column: [
    {
      prop: 'bc_pono',
      label: '款号',
      width: 130,
      sortable: true,
    },
    {
      prop: 'isGcReport',
      label: '报告来源',
      width: 130,
      sortable: true,
    },
    {
      prop: 'bc_qs',
      label: '中尾期',
      width: 80,
      formatter: (row) => {
        return row.bc_qs === 1 ? '中期' : '尾期'
      },
    },
    {
      prop: 'bc_batchNo',
      label: '出货批次',
      width: 130,
      sortable: true,
    },
    {
      prop: 'bc_num',
      label: '查货次数',
      width: 130,
      sortable: true,
    },
    {
      prop: 'ch_result',
      label: '查货结果',
      width: 130,
      sortable: true,
      slot: true,
    },
    {
      prop: 'state',
      label: '送审状态',
      width: 130,
      sortable: true,
      formatter: (row) => {
        return row.state === 1 ? '已送审' : '未送审'
      },
    },
    {
      prop: 'sy_state',
      label: '审阅状态',
      width: 130,
      sortable: true,
    },
    {
      prop: 'sy_result',
      label: '审阅结果',
      width: 130,
      sortable: true,
    },
    {
      prop: 'fresult',
      label: '一审结果',
      width: 130,
      sortable: true,
    },
    {
      prop: 'sresult',
      label: '二审结果',
      width: 130,
      sortable: true,
    },
    {
      prop: 'bc_date',
      label: '自查日期',
      width: 120,
      sortable: true,
      formatter: (row, column, cellValue) => {
        if (!cellValue) return ''
        const date = new Date(cellValue)
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
      },
    },
    {
      prop: 'lic_type',
      label: '联营类型',
      width: 100,
      formatter: (row) => {
        // 如果为0或者'0'，则返回'联营业务'，否则返回'联营款'
        return row.lic_type === '0' || row.lic_type === 0 ? '联营业务' : '联营款'
      },
    },
  ],
}

export const licHomePageFormConfig = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: false,
  columns: [
    {
      label: '查货类型',
      prop: 'check_typenam',
      disabled: true,
    },
    {
      label: '授权商',
      prop: 'factName',
      disabled: true,
    },
    {
      label: '品牌',
      prop: 'pduName',
      disabled: true,
    },
    {
      label: '客户',
      prop: 'custCode',
      disabled: true,
    },
    {
      label: '款号',
      prop: 'styleNo',
      disabled: true,
    },
    {
      label: '款式描述',
      prop: 'styleDesc',
      disabled: true,
    },
    {
      label: '合同数量',
      prop: 'po_shipqty',
      disabled: true,
    },
  ],
}
// 表单默认数据
export const defaultFormData = {
  portId: ['ALL'], // 口岸仓库 多选
  sdate: '', // 开始日期
  edate: '', // 结束日期
  lj_sdate: '', // 开始日期
  lj_edate: '', // 结束日期
  custCode: ['ALL'], // 客户
  licCode: ['ALL'], // 联营商 多选
  result: [], // 二审结果 多选
}

// 二审结果选项
export const resultOptions = [
  { label: '不适用', value: '0' },
  { label: '接受', value: '1' },
  { label: '不接受', value: '2' },
  { label: '联营商选择不上架', value: '3' },
  { label: '不接受并联营商选择不上架', value: '4' },
]