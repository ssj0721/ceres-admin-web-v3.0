import { h } from 'vue';
import { querySelectTable } from "@/views/po/pomnt116/index.js"
const DictColor = {
  '1': '#E6A23C',
  '2': '#32CD32',
  '3': '#E6A23C',
  '4': '#32CD32',
  '5': '#E6A23C',
  '6': '#32CD32',
  '7': '#E6A23C',
  '8': '#32CD32',
  '9': '#caebca'
};

const DictState = {
  '1': '未分配',
  '2': '已分配',
  '3': '未完成',
  '4': '已完成',
  '5': '未通过',
  '6': '全部通过',
  '7': '未上传',
  '8': '已上传',
  '9': '部分通过'
}

export const tableOption = {
  selection: true,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  dialogWidth: "100%",
  dialogHeight: "100%",
  dialogFullscreen: true,
  menu: true,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  index: true,


  indexLabel: "序号",
  column: [
    {
      label: "上架申请编号",
      prop: "applyno",
      span: 12,

    },
    {
      label: "款号",
      prop: "itemcode",
      span: 12,
      render: ({ row }) => {
        console.log('row',row);
        const color =  row.state === 1 || row.state === 3 ? '#32CD32' : (row.state === 0 ? '#E6A23C' : '#dd6e6e');
        const icon = row.istestitem === 1 && row.state === 3 ? '*' : '';
        return h('p',
        {
        style: { background : color },
        }, icon + row.itemcode || 'state');
    },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   const color = row.state === 1 || row.state === 3 ? '#32CD32' : (row.state === 0 ? '#E6A23C' : '#dd6e6e');
      //   const icon = row.istestitem === 1 && row.state === 3 ? 'el-icon-star-on' : null;
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);"><i class="${icon}"><i/>${row.itemcode}</div>`;
      // },
    },
    {
      label: "聚水潭商品编码(skuId)",
      prop: "isskuid",
      span: 12,
    //   render: ({ row }) => {
    //     console.log('row',row);
    //     const color = row.isskuid !== null ? (row.isskuid < 0 ? '#dd6e6e' : '#32CD32') : null;
    //     return h('p',
    //     {
    //     style: { background : color },
    //     }, row.isskuid == null ? '' : row.isskuid || 'gbbarcodestate');
    // },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   // const color = row.testitemstock != null ? (row.testitemstock < 0 ? (row.state == 1 ? '#32CD32' : '#CD5C5C') : '#E6A23C') : null;
      //   const color = row.testitemstock !== null ? (row.testitemstock < 0 ? '#dd6e6e' : '#32CD32') : null;
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
      //   ${row.testitemstock == null ? '' : row.testitemstock}</div>`;
      // },
    },
    {
      label: "取国标码",
      prop: "gbbarcodestate",
      span: 12,

      render: ({ row }) => {
        console.log('row',row);
        const color =  DictColor[row.gbbarcodestate];
        return h('p',
        {
        style: { background : color },
        }, DictState[row.gbbarcodestate] || 'gbbarcodestate');
    },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   const color = DictColor[row.gbbarcodestate];
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${DictState[row.gbbarcodestate]}</div>`;
      // },
    },
    {
      label: "上传检测报告",
      prop: "qualitycheckstate",
      span: 12,

      render: ({ row }) => {
        console.log('row',row);
        const color =  DictColor[row.qualitycheckstate];
        return h('p',
        {
        style: { background : color },
        }, DictState[row.qualitycheckstate] || 'gbbarcodestate');
    },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   const color = DictColor[row.qualitycheckstate];
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${DictState[row.qualitycheckstate]}</div>`;
      // },
    },
    {
      label: "查货",
      prop: "stockcheckstate",
      span: 12,
      render: ({ row }) => {
        console.log('row',row);
        const color =  DictColor[row.stockcheckstate];
        return h('p',
        {
        style: { background : color },
        }, DictState[row.stockcheckstate] || 'gbbarcodestate');
    },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   const color = DictColor[row.stockcheckstate];
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${DictState[row.stockcheckstate]}</div>`;
      // },
    },
    {
      label: "款号对应",
      prop: "itemofptstate",
      span: 12,

      render: ({ row }) => {
        console.log('row',row);
        const color =  DictColor[row.itemofptstate];
        return h('p',
        {
        style: { background : color },
        }, DictState[row.itemofptstate] || 'gbbarcodestate');
    },
      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   const color = DictColor[row.itemofptstate];
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${DictState[row.itemofptstate]}</div>`;
      // },
    },
    {
      label: "试销款剩余天数",
      prop: "testitemstock",
      span: 12,
      render: ({ row }) => {
        console.log('row',row);
        const color = row.testitemstock !== null ? (row.testitemstock < 0 ? '#dd6e6e' : '#32CD32') : null;
        return h('p',
        {
        style: { background : color },
        }, row.testitemstock == null ? '' : row.testitemstock || 'gbbarcodestate');
    },

      // formatter: (row) => {
      //   // 根据不同的值返回不同的背景颜色
      //   // const color = row.testitemstock != null ? (row.testitemstock < 0 ? (row.state == 1 ? '#32CD32' : '#CD5C5C') : '#E6A23C') : null;
      //   const color = row.testitemstock !== null ? (row.testitemstock < 0 ? '#dd6e6e' : '#32CD32') : null;
      //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
      //   ${row.testitemstock == null ? '' : row.testitemstock}</div>`;
      // },
    },
    {
      label: "",
      prop: "state",
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
    },
    {
      label: "",
      prop: "id",
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
    },
    {
      label: "",
      prop: "istestitem",
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
    },
  ]
};

export const queryFormOption = {
  emptyBtn: false,
  submitBtn: false,
  addBtn: false,
  labelWidth: 110,
  column: [
    {
      label: "上架申请编号",
      prop: "applyNo",
      span: 8,
      width: "100px"
    },
    {
      label: "款号",
      prop: "itemCode",
      placeholder: "多款用空格、半角逗号或换行符分隔，单款时模糊查询",
      span: 8,
    },
    {
      label: "上架日期范围",
      prop: "upshelfDateRange",
      span: 8,
      component: "datePicker",
      props: {
        clearable: true,
        //fromDate: this.$dateutil.curdatenear(-180),
        //toDate: this.$dateutil.curdate(),
      },
    },
    {
      label: "组织",
      prop: "orgId",
      span: 8,
      component: "easySelectTable",
      // props: {
      //   dataSource: "orgdata",
      //   radio: false,
      //   addTitle: false,
      // },
      // separator: '|',
      // multiple: true,
      // type: 'cascader',
      // showAllLevels: false,
      // emitPath: false,
      // type: 'DroplistControl',
      props: {
        id: 1,
        api: querySelectTable,
        params: {
          dataSource: "orgdata",
        }
       },
      dicData:[
    ]
    },

    {
      label: "款字头",
      prop: "bndId",
      span: 8,
      // multiple: true,
      // type: 'cascader',
      // showAllLevels: false,
      // emitPath: false,
      // dicData:[],
      component: "easySelectTable",
      props: {
        id: 2,
        api: querySelectTable,
        params: {
          dataSource: "itemPrefix",
          justPr: true
        }
      },
    },

    {
      label: "地点",
      prop: "placeId",
      span: 8,
      // multiple: true,
      // type: 'cascader',
      // showAllLevels: false,
      // emitPath: false,
      // dicData:[],
      component: "easySelectTable",
      props: {
        id: 3,
        api: querySelectTable,
        params: {
          dataSource: "placeid",
        }
      },
    },

    {
      label: "剩余天数范围",
      prop: "testitemstockrange",
      span: 8,
      type: "select",
      placeholder: "需填写试销款剩余天数",
      dicData: [
        {
          label: "大于",
          value: 0,
        },
        {
          label: "等于",
          value: 1,
        },
        {
          label: "小于",
          value: 2,
        },
      ],
    },
    {
      type: "number",
      span: 8,
      prop: "testitemstockday",
      label: '试销款剩余天',
      rules: [
        {
          trigger: ["blur", "change"],
          required: false,
          message: "请填写正确数值",
        },
      ],
    },
    // {
    //   label: "状态",
    //   prop: "state",
    //   span: 8,
    //   component: "DroplistControl",
    //   props: {
    //    // api: "queryApplyForSales@retail.sys.comSelect",
    //    api:"/po1mnt116/queryApplyForSalesList",
    //     checkall: true,
    //     radio: false,
    //   },
    // },
    {
      prop: "state",
      label: "状态",
      labelWidth: 130,
      props: {
          api: "/po1mnt116/queryApplyForSalesList",
          checkall: true,
          // watch: true,

      },
      component: "DroplistControl",
      span: 8,
    },
    {
      label: "品种",
      prop: "depId",
      span: 8,
      component: "DroplistControl",
      props: {
        //api: "queryDepData01@retail.sys.comSelect",
        api:"/po1mnt116/queryDepData01List",
        checkall: false,

      },
    },
    // {
    //   prop: "orderstatus",
    //   label: "状态",
    //   labelWidth: 130,
    //   props: {
    //    api: "/po1mnt001/querySysDictData",
    //    checkall: true,
    //    params: {
    //    type: "biz.po1.purpostate"
    //    },
    //   },
    //    component: "DroplistControl",
    //   span: 7
    //   },


  ],
};