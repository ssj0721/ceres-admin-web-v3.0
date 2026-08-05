export const licZcCheckFormOption = {
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
      label: '业务类型',
      prop: 'lic_type',
      type: 'select',
      dicData: [
        { label: '联营业务', value: 0 },
        { label: '联营款', value: 1 },
      ],
      disabled: true,
    },
    {
      label: '查货日期',
      prop: 'bc_date',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      disabled: true,
    },
    {
      label: '状态',
      prop: 'state',
      type: 'select',
      dicData: [
        { label: '未提交', value: -1 },
        { label: '已提交', value: 0 },
        { label: '联营接受', value: 1 },
        { label: '联营拒绝', value: 2 },
      ],
      disabled: true,
    },
  ],
};

export const licZcDetailsFormOption = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  headerConfig: {
    labelText: '检查项目',
    valueText: '检查结果',
  },
  columns: [
    {
      label: '查货标准',
      prop: 'checkScrit',
      type: 'select',
      disabled: true,
      dicData: [
        { label: 'AQL2.5II', value: 'AQL2.5II' },
        { label: 'AQL1.0II', value: 'AQL1.0II' },
        { label: 'AQL1.5II', value: 'AQL1.5II' },
        { label: '100%', value: '100%' },
      ],
    },
    {
      label: '落货总数',
      prop: 'totalNum',
      type: 'number',
      disabled: true,
    },
    {
      label: '查货数量',
      prop: 'checkNum',
      type: 'number',
      disabled: true,
    },
    {
      label: '接受数量',
      prop: 'accNum',
      type: 'number',
      disabled: true,
    },
    {
      label: '不接受数量',
      prop: 'disAccNum',
      type: 'number',
      disabled: true,
    },
    {
      label: '颜色',
      prop: 'color',
      slot: 'color',
      disabled: true,
    },
  ],
};

export const licZcSaveFormOption = {
  // 基本资料配置
  baseFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    disabled: true,
    headerConfig: {
      labelText: '字段',
      valueText: '内容',
    },
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
        label: '中/尾期',
        prop: 'bc_qs_name',
      },
      {
        label: '出货批次',
        prop: 'bc_batchNo',
      },
      {
        label: '查货次数',
        prop: 'bc_num',
      },
      {
        label: '查货日期',
        prop: 'bc_date',
      },

    ],
  },
  // 详细资料配置
  detailFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    headerConfig: {
      labelText: '检查项目',
      valueText: '检查结果',
    },
    columns: [
      {
        label: '查货标准',
        prop: 'checkScrit',
        disabled: true,
      },
      {
        label: '落货总数',
        prop: 'totalNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '查货数量',
        prop: 'checkNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '接受数',
        prop: 'accNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '不接受数',
        prop: 'disAccNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '颜色',
        prop: 'color',
        slot: 'color',
        disabled: true,
      },
    ],
  },
  // 问题跟进配置
  problemFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    headerConfig: {
      labelText: '问题类型',
      valueText: '问题描述',
    },
    columns: [
      {
        label: '问题及跟进',
        prop: 'bq_question',
        type: 'textarea',
        disabled: true,
      },
    ],
  },
  // 查货结果选项
  resultOptions: [
    { label: '接受', value: 1 },
    { label: '不接受', value: 2 },
    { label: '不适用', value: 0 },
  ],
};
