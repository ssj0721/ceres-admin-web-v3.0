// rule 检验是不是数字
const validateNum = (rule, value, callback) => {
  if (!/^[0-9]*$/.test(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
};

// 外部表单配置
export const formOption = {
  emptyBtn: false,
  submitBtn: false,
  menuPostion: 'left',
  column: [
    {
      label: '退货单号',
      prop: 'returnNo',
      span: 7,
    },
    {
      label: 'sku',
      prop: 'sku',
      span: 7,
    },
    {
      label: '退货日期',
      prop: 'returnDate',
      span: 10,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  ],
};

// 外部list配置
export const tableOption = {
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  index: true,
  indexLabel: '序号',
  indexWidth: 80,
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  viewBtn: false,
  excelBtn: false,
  defaultExpandAll: false,
  selection: false,
  gridBtn: false,
  labelWidth: 150,
  column: [
    {
      label: '退货单号',
      prop: 'returnNo',
      width: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货单号',
          trigger: 'blur',
        },
      ],
    },
    {
      label: 'sku',
      prop: 'sku',
      width: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入sku',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '款号',
      prop: 'styleNo',
      width: 150,
      span: 12,
    },
    {
      label: '商品名称',
      prop: 'name',
      width: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '尺码',
      prop: 'sizId',
      span: 12,
    },
    {
      label: '色码',
      prop: 'colId',
      span: 12,
    },
    {
      label: '退货数量',
      prop: 'qty',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货数量',
          trigger: 'blur',
        },
        { validator: validateNum, trigger: 'blur' },
      ],
    },
    {
      label: '退货人',
      prop: 'returnBy',
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货人',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货人联系电话',
      prop: 'returnPhone',
      width: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货人联系电话',
          trigger: 'blur',
        },
        { validator: validateNum, trigger: 'blur' },
      ],
    },
    {
      label: '退货地址',
      prop: 'returnAddress',
      width: 200,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货地址',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货日期',
      prop: 'returnDate',
      type: 'date',
      width: 100,
      span: 12,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      rules: [
        {
          required: true,
          message: '请输入退货日期',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货原因',
      prop: 'returnReason',
      span: 12,
    },
    {
      label: '退货方式',
      prop: 'returnType',
      span: 12,
    },
    {
      label: '发货单号',
      prop: 'deliverNo',
      span: 12,
    },
  ],
};

// dialog表单配置
export const dialogOption = {
  emptyBtn: false,
  submitBtn: false,
  menuPostion: 'left',
  column: [
    {
      label: '退货单号',
      prop: 'returnNo',
      labelWidth: 150,
      span: 12,
      disabled: true,
      formslot: true,
      rules: [
        {
          required: true,
          message: '请输入退货单号',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货数量',
      prop: 'qty',
      labelWidth: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货数量',
          trigger: 'blur',
        },
        { validator: validateNum, trigger: 'blur' },
      ],
    },
    {
      label: '退货人',
      prop: 'returnBy',
      labelWidth: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货人',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货人联系电话',
      prop: 'returnPhone',
      labelWidth: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货人联系电话',
          trigger: 'blur',
        },
        { validator: validateNum, trigger: 'blur' },
      ],
    },
    {
      label: '退货地址',
      prop: 'returnAddress',
      labelWidth: 150,
      span: 12,
      rules: [
        {
          required: true,
          message: '请输入退货地址',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货日期',
      prop: 'returnDate',
      type: 'date',
      labelWidth: 150,
      span: 12,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      rules: [
        {
          required: true,
          message: '请输入退货日期',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '退货方式',
      prop: 'returnType',
      labelWidth: 150,
      span: 12,
    },
    {
      label: '退货原因',
      prop: 'returnReason',
      labelWidth: 150,
      span: 12,
    },
    {
      label: '发货单号',
      prop: 'deliverNo',
      labelWidth: 150,
      span: 12,
    },
  ],
};

// dialog list配置
export const dialogListOption = {
  columnBtn: false,
  refreshBtn: false,
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  viewBtn: false,
  excelBtn: false,
  defaultExpandAll: false,
  menu: false,
  border: true,
  stripe: true,
  selection: true,
  column: [
    {
      label: 'sku',
      prop: 'sku',
      // slot: true,
    },
    {
      label: '商品名称',
      prop: 'name',
      // slot: true,
    },
  ],
};
