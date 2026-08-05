export const formOption = {
  submitBtn: false,
  emptyBtn: false,
  column: [
    {
      label: '款号',
      prop: 'style_no',
      type: 'text',
      span: 6
    }
  ],
}

export const tableOption = {
  index: true,
  indexLabel: '序号',
  selection: true,
  menu: false,
  menuAlign: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  height: '360',
  labelWidth: '150',
  dialogClickModal: false,
  column: [
    {
      label: '公司',
      prop: 'ordcmp',
      hide: true,
      addDisplay: true,
      editDisabled: true,
      span: 12,
    },
    {
      label: '款字头',
      prop: 'bndId',
      hide: true,
      addDisplay: true,
      editDisabled: true,
      span: 12,
    },
    {
      label: '版本号',
      prop: 'ver',
      addDisplay: true,
      editDisabled: true,
      span: 6,
    },
    {
      label: '款号',
      prop: 'styleNo',
      addDisplay: true,
      editDisabled: true,
      span: 12,
    },
    {
      label: '备货协议数',
      prop: 'skQty',
      editDisabled: true,
      addDisplay: true,
      span: 12,
    },
    {
      label: '实际数量',
      prop: 'qty',
      editDisabled: true,
      addDisplay: true,
      span: 12,
    },
    {
      label: '确认状态',
      prop: 'status',
      span: 12,
    },
    {
      label: 'po更新时间',
      prop: 'poUpdatedate',
      hide: true,
      addDisplay: true,
      editDisabled: true,
      span: 12,
    }
  ],
}

export const itemdtl2 = {
  index: true,
  indexLabel: '序号',
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: false,
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  labelWidth: '130',
  dialogClickModal: false,
  column: [
    {
      label: '公司',
      prop: 'ordcmp',
      hide: true,
      width: 150,
    },
    {
      label: '款字头',
      prop: 'bndId',
      hide: true,
      width: 150,
    },
    {
      label: '款号',
      prop: 'styleNo',
      hide: true,
      width: 150,
    },
    {
      label: '颜色',
      prop: 'colId',
      width: 150,
    },
    {
      label: '尺码',
      prop: 'sizId',
      width: 150,
    },

    {
      label: '备货协议数',
      prop: 'skQty',
      addDisplay: true,
      editDisabled: true,
      width: 150,
    },
    {
      label: '实际数量',
      prop: 'qty',
      type: 'number',
      slot: true,
      width: 150,
    },
    {
      label: 'PO更新时间',
      prop: 'poUpdatedate',
      hide: true,
      width: 150,
    }
  ],
}

export const verOp = {
  submitBtn: false,
  emptyBtn: false,
  column: [
    {
      prop: 'styleNo',
      label: '款号',
      labelWidth: 130,
      formslot: true,
      disabled: true,
      span: 7,
    },
    {
      prop: 'ver',
      label: '历史版本',
      dicData: [],
      type: 'select',
      labelWidth: 130,
      span: 7,
      display: true
    },
  ]
}