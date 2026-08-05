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
      span: 12,
    },

    {
      prop: 'edate',
      label: '结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 12,
    },
    {
      label: '供应商款号',
      prop: 'po_no',
      type: 'input',
      span: 12,
    },
  ],
};

export const licZcChahuoTableOption = {
  selection: true,
  page: true,
  align: 'center',
  menuAlign: 'center',
  highlightCurrentRow: true,
  column: [
    {
      prop: 'bc_pono',
      label: '供应商款号',
      width: 140,
      sortable: true
    },
    {
      prop: 'bc_date',
      label: '自查日期',
      width: 120,
      sortable: true,
      formatter: (row, column, cellValue) => {
        if (!cellValue) return '';
        const date = new Date(cellValue);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      },
    },
    {
      prop: 'ch_result',
      label: '查货结果',
      width: 100,
    },
    {
      prop: 'state',
      label: '联营选择',
      width: 100,
    },
    {
      prop: 'gc_result',
      label: '工厂处理',
      width: 100,
    },
    {
      prop: 'review_state/back_count',
      label: '重审状态/返修次数',
      width: 140,
    },
    {
      prop: 'review_reason',
      label: '重审原因',
      width: 100,
    },
    {
      prop: 'gc_confirm_time',
      label: '工厂确认时间',
      width: 120,
    },
    {
      prop: 'bc_qs',
      label: '中尾期',
      width: 80,
      formatter: (row) => {
        return row.bc_qs === '1' || row.bc_qs === 1 ? '中期' : '尾期';
      },
    },
    {
      prop: 'bc_batchNo',
      label: '出货批次',
      width: 80,
    },
    {
      prop: 'bc_num',
      label: '查货次数',
      width: 80,
    },
    {
      prop: 'lic_type',
      label: '联营类型',
      width: 100,
      formatter: (row) => {
        return row.lic_type === '1' ? '联营业务' : '联营款';
      },
    },
  ],
};

export const licHomePageFormConfig = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: false,
  columns: [
    {
      label: '供应商款号',
      prop: 'bc_pono',
      disabled: true,
    },
    {
      label: '联营类型',
      prop: 'lic_typename',
      disabled: true,
    },
    {
      label: '自查日期',
      prop: 'bc_date',
      disabled: true,
    },
    {
      label: '中尾期',
      prop: 'bc_qs_name',
      disabled: true,
    },
    {
      label: '查货批次',
      prop: 'bc_batchNo',
      disabled: true,
    },
    {
      label: '查货次数',
      prop: 'bc_num',
      disabled: true,
    },
    {
      label: '重审/返修',
      prop: 'reviewOrBack',
      slot: 'reviewOrBack',
      hidden: (row) => {
        return !('check_revision_count' in row) && !('review_state' in row)
      }
    },
    {
      label: '重审状态/返修次数',
      prop: 'review_state_Or_back_count',
      slot: 'reviewOrBackState',
      hidden: (row) => {
        return !('check_revision_count' in row) && !('review_state' in row)
      }
    },
    {
      label: '重审原因',
      prop: 'review_reason',
      disabled: true,
      hidden: (row) => {
        return !('review_reason' in row)
      }
    }
  ],
};

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
};

// 二审结果选项
export const resultOptions = [
  { label: '不适用', value: '0' },
  { label: '接受', value: '1' },
  { label: '不接受', value: '2' },
  { label: '联营商选择不上架', value: '3' },
  { label: '不接受并联营商选择不上架', value: '4' },
];
