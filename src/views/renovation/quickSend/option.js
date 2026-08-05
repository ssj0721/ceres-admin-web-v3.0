
import { reactive } from 'vue'
export const queryFormOptionExt = reactive({
  emptyBtn: false,
  submitBtn: false,
  menuBtn: false,
  labelWidth: 110,
  column: [
    {
      label: "通过时间",
      prop: "daterangeAccect",
      span: 24,
      component: "datePickerGyl",
      props: {
        fromDate: undefined,
        toDate: undefined,
        type: "datetimerange",
      },
      valueDefault: [],
    },
    // {
    //   label: "作废时间",
    //   prop: "daterangeCancel",
    //   span: 24,
    //   component: "datePicker",
    //   props: {
    //     fromDate: undefined,
    //     toDate: undefined,
    //     type: "datetimerange",
    //   },
    //   valueDefault: [],
    // },
    {
      label: "状态更新时间",
      prop: "datestateModified",
      span: 24,
      component: "datePickerGyl",
      props: {
        fromDate: undefined,
        toDate: undefined,
        type: "datetimerange",
      },
      valueDefault: [],
    },
    {
      label: "最后修改时间",
      prop: "daterangeModified",
      span: 24,
      component: "datePickerGyl",
      props: {
        fromDate: undefined,
        toDate: undefined,
        type: "datetimerange",
      },
      valueDefault: [],
    },
    {
      label: "关键词",
      prop: "keyword",
      placeholder: "模糊查询",
      span: 12,
      hide: true,
      overHidden: true,
    },
    {
      label: "排序方式",
      prop: "orderType",
      span: 12,
      type: "select",
      clearable: false,
      dicData: [
        {
          label: "默认",
          value: "default",
        },
        {
          label: "修改时间",
          value: "modified",
        },
      ],
      valueDefault: "modified",
    },
    {
      label: "已导出款",
      prop: "endDerive",
      span: 12,
      type: "select",
      dicData: [
        {
          label: "否",
          value: 0,
        },
        {
          label: "是",
          value: 1,
        },
      ],
    },
    {
      label: "平台",
      prop: "platformlist",
      span: 12,
      type: "select",
      multiple: false,
      //viewDisplay: true,
      dicData: [],
      props: {
        //checkall: false,
        label: "name",
        value: "id",
      },
    },
    {
      label: "风格",
      prop: "itemStyleId",
      span: 12,
      type: "select",
      dicData: [
        {
          label: "基本",
          value: "1",
        },
        {
          label: "非基本",
          value: "0",
        },
      ],
    },
    {
      label: "审批意见",
      prop: "reviewComments",
      placeholder: "模糊查询",
      span: 12,
      hide: true,
      overHidden: true,
    },
    {
      label: "否决原因",
      prop: "rejectReasonId",
      span: 12,
      type: "select",
      dicData: [],
      props: {
        label: "name",
        value: "id",
      },
    },
    {
      label: "审批次数",
      prop: "isReview",
      span: 12,
      component: "DroplistControl",
      props: {
        dicData: [
          { id: 0, name: "0次" },
          { id: 1, name: "1次" },
          { id: 2, name: "2次" },
          { id: 3, name: "3次" },
          { id: 4, name: "4次" },
          { id: 5, name: "5次" },
        ],
      },
    },
    {
      label: "年份",
      prop: "yeaid",
      span: 12,
      component: "yearSelect",
    },
    {
      label: "基本/非基本",
      prop: "isBase",
      span: 12,
      type: "select",
      display: false,
      clearable: false,
      dicData: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "基本",
          value: "1",
        },
        {
          label: "非基本",
          value: "0",
        },
      ],
      valueDefault: "",
    },
    {
      label: "季度",
      prop: "seaid",
      span: 12,
      type: "select",
      multiple: true,
      limit: 3,
      dicData: [
        {
          label: "春季",
          value: 1,
        },
        {
          label: "夏季",
          value: 2,
        },
        {
          label: "秋季",
          value: 3,
        },
        {
          label: "冬季",
          value: 4,
        },
        {
          label: "長青款",
          value: 9,
        }
      ],
      valueDefault: "",
    },
    {
      label: "款式描述",
      prop: "itemDescr",
      span: 24,
      type: "input",
      multiple: false,
      //viewDisplay: true,
      dicData: [],
    },
  ],
})