import { querySelectTable } from '@/views/po/pomnt116/index.js'

export function createStyleStatusDetailCrudOption() {
  return {
    selection: true,
    addBtn: false,
    viewBtn: false,
    editBtn: false,
    delBtn: false,
    columnBtn: false,
    refreshBtn: false,
    index: true,
    menu: false,
    height: 400,
    indexLabel: '序号',
    column: [
      {
        label: 'id',
        prop: 'id',
        span: 12,
        addDisabled: true,
        editDisabled: true,
        placeholder: '系统生成',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '最后修改时间',
        prop: 'modified',
        span: 12,
        width: 135,
        addDisabled: true,
        editDisabled: true,
        placeholder: '系统生成',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '品牌',
        prop: 'rbndname',
        span: 12,
        width: 110,
        addDisabled: true,
        editDisabled: true,
        placeholder: '系统带出',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '款字头',
        prop: 'bndid',
        type: 'select',
        span: 12,
        dicData: [],
        disabled: true,
        props: {
          label: 'name',
          value: 'id'
        },
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '款号',
        prop: 'itemcode',
        span: 12,
        width: 120,
        overHidden: true,
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '款式描述',
        prop: 'itemdescr',
        width: 120,
        span: 12,
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '年份',
        prop: 'yeaid',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '季度',
        prop: 'seaname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '年份季度',
        prop: 'yeasea',
        type: 'select',
        dicData: [],
        span: 12,
        disabled: true,
        props: {
          label: 'name',
          value: 'id'
        },
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '性别',
        prop: 'sexname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '大类',
        prop: 'lcname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '品种',
        prop: 'depname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '类别',
        prop: 'scname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '成人/童装',
        prop: 'isadult',
        type: 'select',
        dicData: [
          {
            label: '成人',
            value: '1'
          },
          {
            label: '童装',
            value: '0'
          },
          {
            label: '不適用',
            value: '2'
          }
        ],
        span: 12,
        rules: [],
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '基本/非基本',
        prop: 'isbase',
        type: 'select',
        width: 120,
        dicData: [
          {
            label: '基本',
            value: '1'
          },
          {
            label: '非基本',
            value: '0'
          }
        ],
        span: 12,
        rules: [],
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '品种细分',
        prop: 'pricename',
        headerAlign: 'center',
        align: 'center',
        width: 200
      },
      {
        label: '销售季期',
        prop: 'plansaledate',
        span: 12,
        labelWidth: 130,
        type: 'text',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '组织',
        prop: 'orgname',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '分类二',
        prop: 'poitemclassstr',
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '平台',
        prop: 'platform',
        width: 100,
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '组合款/换款号',
        prop: 'iscombo',
        type: 'select',
        dicData: [
          {
            label: '正常款',
            value: 0
          },
          {
            label: '组合款',
            value: 1,
            disabled: true
          },
          {
            label: '换款号',
            value: 2,
            disabled: true
          }
        ],
        valueDefault: 0,
        span: 12,
        headerAlign: 'center',
        align: 'center'
      },
      {
        label: '开发渠道',
        prop: 'devchannelliststr',
        width: 140,
        headerAlign: 'center',
        align: 'center',
        display: false
      },
      {
        label: '销售渠道',
        prop: 'salechannelliststr',
        headerAlign: 'center',
        align: 'center',
        display: false
      },
      {
        label: '否决原因',
        prop: 'rejectreason',
        width: 140,
        headerAlign: 'center',
        align: 'center',
        display: false
      },
      {
        label: '备注',
        prop: 'remark',
        span: 24,
        overHidden: true,
        headerAlign: 'center',
        align: 'center'
      }
    ]
  };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatYmd(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function createRecentDateRangeShortcuts() {
  const createRange = (days) => () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    return [start, end];
  };

  return [
    {
      text: '最近一周',
      value: createRange(7)
    },
    {
      text: '最近一个月',
      value: createRange(30)
    },
    {
      text: '最近三个月',
      value: createRange(90)
    },
    {
      text: '最近半年',
      value: createRange(180)
    },
    {
      text: '最近一年',
      value: createRange(365)
    }
  ];
}

export function getDefaultStyleStatusFilters() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return {
    dateRange: [formatYmd(start), formatYmd(end)],
    planSaleDate: [],
    orgid: []
  };
}

export function createStyleStatusFilterFormOption() {
  return {
    emptyBtn: false,
    submitBtn: false,
    menuBtn: false,
    labelWidth: 120,
    column: [
      {
        label: '款式创建时间',
        prop: 'dateRange',
        span: 8,
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: createRecentDateRangeShortcuts(),
        clearable: true
      },
      {
        label: '组织',
        prop: 'orgid',
        span: 8,
        component: 'easySelectTable',
        props: {
          id: 1,
          api: querySelectTable,
          params: {
            dataSource: 'orgdata'
          }
        }
      },
      {
        label: '销售季期',
        prop: 'planSaleDate',
        span: 8,
        type: 'select',
        multiple: true,
        clearable: true,
        filterable: true,
        dicData: [],
        props: {
          label: 'name',
          value: 'id'
        }
      }
    ]
  };
}
