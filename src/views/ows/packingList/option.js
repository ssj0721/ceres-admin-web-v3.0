export const packingListOption1 = {
  size: 'mini',
  emptyBtn: false,
  submitBtn: false,
  selection: true,
  selectable: null,
  reserveSelection: true,
  highlightCurrentRow: true,
  maxheight: '150',
  height: '300',
  addBtn: false,
  menu: false,
  columnBtn: false,
  refreshBtn: false,
  rowKey: 'itemcode',
  column: [
    {
      prop: 'itemcode',
      label: '款号',
      span: 12,
      slot: true,
      align: 'center',
    },
    {
      prop: 'ttlship_qty',
      label: '预计装箱数',
      span: 12,
      align: 'center',
    },
    // {
    //   prop: 'ttl_carton',
    //   label: '箱数',
    //   span: 12,
    //   align: 'center',
    // },
    // {
    //   prop: 'ttl_netweight',
    //   label: '发车概括',
    //   span: 12,
    //   align: 'center',
    // }
  ],
}

export const packingListOption2 = {
  height: 500,
  selection: true,
  page: false,
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: true,
  // 操作拦配置
  menuWidth: 380,
  // align: 'center',
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  dialogClickModal: false,
  column: [
    {
      label: '发车编号',
      prop: 'cargo_no',

    },
    {
      label: '走货序号',
      prop: 'dest_seq',

    },
    {
      label: '装箱序号',
      prop: 'pk_seqno',

    },
    {
      label: '版本号',
      prop: 'pk_verno',
    },
    // {
    //   label: '收货口岸',
    //   prop: 'dest_brief',

    //   dic_data: [],
    // },
    {
      label: '走货日期',
      prop: 'ship_date',
      formatter: (row, column, cellValue) => {
        const date = new Date(cellValue);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

    },
    {
      label: '走货数量（件）',
      prop: 'ttlship_qty',
      width: 120,
      align: 'right',
    },
    {
      label: '箱数',
      prop: 'ttl_carton',

      align: 'right',
    },
    {
      label: '状态',
      prop: 'status',

      align: 'center',
    },
  ],
}

export const packingListformOption = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'itemcode',
      label: '款号',
      labelWidth: 100,
      span: 12,
      placeholder: '多款用空格、半角逗号或换行符分隔，单款时模糊查询',
    },
  ],
}

export const packingListformOption2 = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'itemcode',
      label: '款号',
      span: 12,
      align: 'center',
      disabled: true,
    },
    {
      prop: 'ttlship_qty',
      label: '预计装箱数',
      span: 12,
      align: 'center',
      disabled: true,
    },
  ],
}

export const packingListformOption3 = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'address',
      label: '地址',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入地址',
          trigger: 'blur',
        },
      ],
    },
    {
      prop: 'tel',
      label: '电话',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入电话',
          trigger: 'blur',
        },
      ],
    },
    {
      prop: 'person',
      label: '联系人',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入联系人',
          trigger: 'blur',
        },
      ],
    },
  ],
}

export const packingListformOption4 = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      label: '发车编号',
      prop: 'cargoNo',
      disabled: true,
      width: 160,
    },
    {
      label: '版本号',
      prop: 'cargoVer',
      disabled: true,
    },
    {
      label: '起运地 ',
      prop: 'cargoFrom',
      disabled: true,
    },
    {
      label: '发车日期',
      prop: 'cargoDate',
      disabled: true,
      type: 'date',
      width: 150,
    },
    {
      label: '是否已列印',
      prop: 'prnFlag',
      disabled: true,
      width: 100,
    },
    {
      prop: 'address',
      label: '地址',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入地址',
          trigger: 'blur',
        },
      ],
    },
    {
      prop: 'tel',
      label: '电话',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入电话',
          trigger: 'blur',
        },
      ],
    },
    {
      prop: 'person',
      label: '联系人',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入联系人',
          trigger: 'blur',
        },
      ],
    },
  ],
}

export const packingListTopFormOp = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'itemcode',
      label: '订单号',
      span: 6,
      disabled: true,
    },
    // {
    //   prop: 'dest_brief',
    //   label: '收货口岸',
    //   span: 6,
    //   disabled: true,
    // },
    {
      prop: 'ship_date',
      label: '走货日期',

      span: 6,
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
    },
    {
      prop: 'unit_gei',
      label: '单位重量（KG）',
      labelWidth: 150,
      value: 0.0,
      type: 'number',
      span: 6,
    },
    {
      prop: 'source_place',
      label: '发货',
      span: 6,
    },
    {
      prop: 'is_en',
      label: '有无尾数',
      span: 6,
      type: 'select',
      dicData: [
        {
          label: '无尾数',
          value: 'N',
        },
        {
          label: '有尾数',
          value: 'Y',
        },
      ],
      value: 'N',

    },
  ],
}

export const packingListDtlTableOp = {
  menu: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  stripe: true,
  border: true,
  highlightCurrentRow: true,
  headerAlign: 'center',
  selection: true,
  header: false,
  height: 550,
  column: [
    {
      prop: 'startPkno',
      label: '开始箱号',
      min: 0,
      width: 100,
      cell: true,
      type: 'number',
    },
    {
      prop: 'endPkno',
      label: '结束箱号',
      min: 0,
      width: 100,
      cell: true,
      type: 'number',
    },
    {
      prop: 'pkType',
      label: '箱类型',
      width: 80,
      cell: true,
      // type:"select",
      // cell:true,
    },
    {
      prop: 'pkBarcode',
      label: '外箱条码',
      cell: true,
      width: 170,
    },
    {
      prop: 'cartonPkqty',
      label: '装箱数量(件)',
      cell: true,
      disabled: true,
      width: 120,
    },
    {
      prop: 'netWeight',
      label: '净重(KG)',
      cell: true,
    },
    {
      prop: 'grossWeight',
      label: '毛重(KG) ',
      cell: true,
    },
    {
      prop: 'cubaNum',
      label: '体积(立方)',
      cell: true,
      width: 100,
    },
  ],
}
// avue 中如果要使用单元格编辑的插槽需要使用prop-form的形式
export const packingListDtlTableOp2 = {
  menu: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  stripe: true,
  border: true,
  selection: true,
  highlightCurrentRow: true,
  headerAlign: 'center',
  header: false,
  height: 590,
  showSummary: true,
  sumColumnList: [
    {
      label: '合计:',
      name: 'pkQty',
      type: 'sum',
      decimals: 1,
    },
  ],
  column: [
    {
      prop: 'colorNo',
      label: '颜色',
      cell: true,
    },
    {
      prop: 'assinseam',
      label: '内长',
      slot: true,
      cell: true,
    },
    {
      prop: 'asssize',
      label: '尺码',
      cell: true,
      width: 80,
    },
    {
      prop: 'pkQty',
      label: '装箱件数',
      cell: true,
      type: 'number',
      diabled: true,
      min: 0,
      slot: true,
      blur: () => { },
      // blur: _this.handleBlur()
    },
  ],
}