export const licZcChahuoFormOption = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      label: '单号',
      prop: 'Lic_mailmodelid',
      type: 'input',
      span: 12,
      labelWidth: '150',
    },
    {
      label: '快递公司',
      prop: 'mailCompany',
      type: 'input',
      span: 12,
      labelWidth: '150',
    },
    {
      prop: 'sdate',
      label: '寄办开始日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 12,
      labelWidth: '150',
    },
    {
      prop: 'edate',
      label: '寄办结束日期',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      span: 12,
      labelWidth: '150',
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
      prop: 'acceptdate',
      label: '收办日期',
      width: 180,
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
      prop: 'acceptNum',
      label: '收办件数',
      width: 80,
    },
    {
      prop: 'remarks',
      label: '备注',
      width: 100,
    },
    {
      prop: 'Lic_mailmodelid',
      label: '快递单号/系统单号',
      width: 140,
    },
    {
      prop: 'style_no',
      label: '款号',
      width: 120,
    },
    {
      prop: 'lic_type',
      label: '联营类型',
      width: 100,
    },
    {
      prop: 'color_name',
      label: '色号',
      width: 100,
    },
    {
      prop: 'size',
      label: '尺码',
      width: 100,
    },
    {
      prop: 'num',
      label: '件数',
      width: 80,
    },
    {
      prop: 'maildate',
      label: '寄办日期',
      width: 120,
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
      prop: 'mailAddress',
      label: '收货地点',
      width: 120,
    },
    {
      prop: 'deliverydate',
      label: '预计收货日期',
      width: 120,
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
      prop: 'same_no',
      label: '相同款型款号',
      width: 120,
    },
    {
      prop: 'barcode',
      label: '条码号',
      width: 120,
    },
    {
      prop: 'mailCompany',
      label: '快递公司',
      width: 120,
    },
  ]
};

export const formOption = {
  submitBtn: false,
  emptyBtn: false,
  dialogClickModal: false,
  column: [
    {
      label: '单号类型',
      prop: 'sysormail',
      type: 'select',
      labelWidth: '110',
      dicData: [
        { label: '系统单号', value: 0 },
        { label: '快递单号', value: 1 },
      ],
      rules: [
        { required: true, message: '请输入单号类型', trigger: 'blur' }
      ],
    },
    {
      label: '单号',
      prop: 'Lic_mailmodelid',
      type: 'input',
      labelWidth: '110',
      rules: [
        { required: true, message: '请输入单号', trigger: 'blur' }
      ],
    },
    {
      label: '快递公司',
      prop: 'mailCompany',
      type: 'input',
      labelWidth: '110',
    },
    {
      prop: 'maildate',
      label: '寄办日期',
      type: 'date',
      labelWidth: '110',
      valueFormat: 'YYYY-MM-DD',
      rules: [
        { required: true, message: '请输入寄办日期', trigger: 'blur' }
      ],
      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
        {
          text: '昨天',
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: '一周前',
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
    },
    {
      prop: 'mailAddress',
      label: '收货地点',
      type: 'input',
      labelWidth: '110',
    },
    {
      prop: 'deliverydate',
      label: '预计收货日期',
      type: 'date',
      labelWidth: '110',
      valueFormat: 'YYYY-MM-DD',
      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
        {
          text: '昨天',
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: '一周前',
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
    },
  ],
};

export const crudOption = {
  // excelBtn: true,
  border: true,
  index: true,
  // expandLevel: 3,
  headerAlign: 'center',
  align: 'center',
  // tree: true,
  labelWidth: 120,
  // menu: false,
  // addBtn: false,
  // refreshBtn: false,
  // columnBtn: false,
  // stripe: true,
  // border: true,
  // highlightCurrentRow: true,
  // headerAlign: 'center',
  selection: true,
  header: false,
  height: 550,
  // cellBtn: true,
  // addRowBtn: true,
  // menuWidth: 250,
  column: [
    {
      label: '款号',
      prop: 'style_no',
      type: 'input',
      rules: [
        { required: true, message: '请输入款号', trigger: 'blur' }
      ],
    },
    {
      label: '联营类型',
      prop: 'lic_type',
      cell: true,
      type: 'select',
      dicData: [
        { label: '联营业务', value: 0 },
        { label: '联营款', value: 1 }
      ],
      rules: [
        { required: true, message: '请输入联营类型', trigger: 'blur' }
      ],
    },
    { label: '色号', prop: 'color_name', cell: true, type: 'input' },
    { label: '尺码', prop: 'size', cell: true, type: 'input' },
    { label: '件数', prop: 'num', cell: true, type: 'input' },
    { label: '相同款型款号', prop: 'same_no', cell: true, type: 'input' },
    { label: '条码号', prop: 'barcode', cell: true, type: 'input' },
  ]
}