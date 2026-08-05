export const formOption = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'bndId',
      label: '款字头',
      width: 50,
      type: 'select',
      dicData: [],
      multiple: true, // 多选
      span: 8,
      editDisabled: true,
    },
    {
      label: '款号', // 6
      prop: 'styleNo',
      width: 95,
      span: 12,
      placeholder: '多款用空格、半角逗号或换行符分隔，单款时模糊查询',
    },
  ],
};

export const tableOption = {
  selection: true,
  dialogDrag: true,
  index: true,
  indexLabel: '序号',
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  menu: true,
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menuWidth: '180',
  height: '700',
  labelWidth: '100',
  dialogWidth: '60%',
  dialogHeight: '50%',
  dialogClickModal: false,
  border: true,
  column: [
    {
      prop: 'itmseq',
      label: 'itmseq',
      span: 12,
      align: 'center',
      viewDisplay: true,
      hide: true,
      editDisabled: true,
      resizable: true,
      border: true,
    },
    {
      prop: 'bndId',
      label: '款字头',
      span: 12,
      resizable: true,
      border: true,
    },
    {
      prop: 'orderNo',
      label: '采购单号',
      span: 12,
      resizable: true,
      border: true,
    },
    {
      prop: 'supportName',
      label: '供应商名称',
      resizable: true,
      border: true,
    },
    {
      prop: 'styleNo',
      label: '款号',
      resizable: true,
      border: true,
    },
    {
      prop: 'origpri',
      label: '价格',
      type: 'number',
      resizable: true,
      border: true,
    },
    {
      label: '图片',
      prop: 'pictureaddr',
      slot: true,
      type: 'upload',
      listType: 'picture-img',
      //   propsHttp: {
      //     res: 'data',
      //     url: 'url',
      //     name: 'name',
      //     home: 'http://localhost:8080'
      //   },
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
      resizable: true,
      border: true,
    },
    {
      prop: 'yeaId',
      label: '年度',
      resizable: true,
      border: true,
    },
    {
      prop: 'seaId',
      label: '季度',
      resizable: true,
      border: true,
    },
    {
      prop: 'name60',
      label: '商品名称',
      //  hide: true,
      viewDisplay: true,
      resizable: true,
      border: true,
    },
    // {
    //   prop: 'supplierName',
    //   label: '联营商名称',
    //   resizable: true,
    //   border: true,
    // },
    // {
    //   prop: 'supplierId',
    //   label: '联营商代码',
    //   resizable: true,
    //   border: true,
    // },
    {
      prop: 'createdate',
      label: '确认时间',
      resizable: true,
      border: true,
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    // {
    //     prop: "goodscode",
    //     label: "商品编码",
    //     width: 250,
    // },
  ],
};
export const formOption2 = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      prop: 'bndId',
      label: '款字头',
      width: 120,
      span: 12,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'orderNo',
      label: '采购单号',
      width: 190,
      span: 12,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'styleNo',
      label: '款号',
      width: 120,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'origpri',
      label: '价格',
      width: 120,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'yeaId',
      label: '年度',
      width: 100,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'seaId',
      label: '季度',
      width: 100,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'name60',
      label: '商品名称',
      width: 300,
      placeholder: ' ',
      disabled: true,
      //  hide: true,
    },
    // {
    //   prop: 'supplierName',
    //   label: '联营商名称',
    //   width: 100,
    //   placeholder: ' ',
    //   disabled: true,
    // },
    // {
    //   prop: 'supplierId',
    //   label: '联营商代码',
    //   width: 100,
    //   placeholder: ' ',
    //   disabled: true,
    // },
    // {
    //     prop: "goodscode",
    //     label: "商品编码",
    //     width: 100,
    //     placeholder: " ",
    //     disabled: true,
    // },
    {
      prop: 'supportName',
      label: '供应商名称',
      width: 100,
      placeholder: ' ',
      disabled: true,
    },
    {
      prop: 'createdate',
      label: '确认时间',
      width: 100,
      placeholder: ' ',
      disabled: true,
    },
  ],
};

export const tableOption2 = {
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: false,
  // align: 'center',
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  menuWidth: '180',
  labelWidth: '100',
  dialogWidth: '70%',
  dialogHeight: '80%',
  dialogClickModal: false,
  showSummary: true, // 合计
  column: [
    {
      prop: 'colId',
      label: '颜色',
      width: 140,
    },

    {
      prop: 'actualDaoCanDate',
      label: '实际到仓期',
      width: '150',
      cell: true,
      overHidden: true,
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    {
      label: '合计',
      prop: 'sizQty',
      width: 100,
      type: 'number',
      align: 'center',
      disabled: true,
    },
    {
      label: '实际到仓数量',
      prop: 'actualQty',
      width: '150',
      align: 'center',
      children: []
    },

  ],
}

export const tableOption22 = {
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: false,
  // align: 'center',
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  menuWidth: '180',
  labelWidth: '100',
  dialogWidth: '70%',
  dialogHeight: '80%',
  dialogClickModal: false,
  showSummary: true, // 合计
  column: [
    {
      prop: 'colId',
      label: '颜色',
      width: 140,
    },

    // {
    //   prop: 'createdate',
    //   label: '确认时间',
    //   width: '150',
    //   overHidden: true,
    //   type: 'date',
    //   format: 'YYYY-MM-DD',
    // },
    {
      label: '合计',
      prop: 'sizQty',
      width: 100,
      type: 'number',
      align: 'center',
      disabled: true,
    },
    {
      label: '实际备货数量',
      prop: 'actualQty',
      width: '150',
      align: 'center',
      children: []
    },

  ],
}

export const tableOption3 = {
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: false,
  // align: 'center',
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  menuWidth: '180',
  height: '400',
  labelWidth: '100',
  dialogWidth: '60%',
  dialogHeight: '50%',
  dialogClickModal: false,
  column: [
    {
      prop: 'upshelfdate',
      label: '上架日期',
      width: '200',
      span: 5,
      overHidden: true,
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      prop: 'iseshop',
      label: '取消上架标识',
      width: 200,
      span: 12,
      dicData: [
        {
          label: '无',
          value: 1,
        },
        {
          label: '无',
          value: '',
        },
        {
          label: '有',
          value: 0,
        },
      ]
    },
  ],

}

export const supperForm = {
  border: true,
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      prop: 'styleNo',
      label: '款号',
      disabled: true

    },
    {
      prop: 'supporter',
      label: '供应商',
    }
  ]
}

export const gbTableOption = {
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  cancelBtn: false,
  menu: false,
  // align: 'center',
  addBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  menuWidth: '250',
  height: '400',
  labelWidth: '100',
  dialogWidth: '60%',
  dialogHeight: '50%',
  dialogClickModal: false,
  column: [
    {
      prop: 'itemcode',
      label: '款号',
      width: 190,
      span: 12,
    },
    {
      prop: 'gbBarcode',
      label: '国标号',
      width: 200,
      span: 12,
    },
  ],
};

