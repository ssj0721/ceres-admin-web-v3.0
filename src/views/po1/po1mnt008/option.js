import { h } from 'vue';

export const formOption = {
  submitBtn: false,
  emptyBtn: false,
  refreshBtn: false,
  dialogClickModal: false,
  labelWidth: "150",
  column: [
    {
      prop: "suppliercode",
      label: "联营商",
      labelWidth: 130,
      // type: "select",
      props: {
          api: "/po1mnt001/querySupplierList",
          checkall: true,
          params: {
              // userid: store.state.user.userInfo.code,
              //localStorage.getItem("po1_userid"),
          },
          // editDisabled:true
      },
      component: "DroplistControl",
      span: 8,
    },
    {
      label: '审款创建日期',
      prop: 'modified',
      type: 'date',
      component: "datePicker",
      props: {
        clearable: true,
        // fromDate: new Date().datePart().addDays(-1),
        // toDate: new Date().dayLastTime(),
      },
      // format: 'YYYY-MM-DD',
      // valueFormat: 'YYYY-MM-DD',
      span: 10,
      placeholder: '请选择审款创建日期'
    }
  ]
}

export const tOption = {
  selection: true,
  delBtn: false,
  menuWidth: 150,
  height: 400,
  addBtn: true,
  editBtn: false,
  cancelBtn: false,
  cellBtn: false /* 行内编辑 */,
  columnBtn: false /* 行显隐按钮 */,
  refreshBtn: false /* 表格刷新按钮 */,
  menu: false,
  keyId: "id",
  column: [

      {
          label: '图片',
          prop: 'pictureaddr',
          width: "120",
          type: 'upload',
          labelWidth:"180",
          listType: 'picture-img',
          //propsHttp: {
          //home:'https://avuejs.com',
          // },
          viewDisplay: false,
          editDisplay: false,
          addDisplay: false,
          span: 12
      },

      {
            prop: "isCompleted",
            label: "是否可导",
            width: "150",
            labelWidth: "150",
            span: 8,
            // editDisabled: true,
            editDisplay: false,
            addDisplay: false,
            render: ({ row }) => {
              if (!row) return h('span', ''); // 或返回空
              const isError = row.errmsg != null && row.errmsg !== "";
              return h('p', {}, isError ? "不可导" : "可导");
            },
        },

      {
          prop: 'errmsg',
          label: '错误信息',
          width: '240',
          editDisplay: false,
          addDisplay: false,
      },

      // {
      //     prop: "isUpload",
      //     label: "上传聚水潭",
      //     width: "80",
      //     span: 5,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "poid",
      //     label: "聚水潭采购单号",
      //     width: "80",
      //     span: 8,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "orderno",
      //     label: "采购单号",
      //     width: "100",
      //     span: 8,
      //     editDisplay: false,
      //     addDisplay: false,
      // },
      // {
      //     prop: "jstSupplierId",
      //     label: "聚水潭供应商编号",
      //     labelWidth: "140",
      //     width: "200",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },
      // {
      //     prop: "jstGoodsCode",
      //     label: "聚水潭商品编码(skuId)",
      //     labelWidth: "180",
      //     width: "180",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "goodscode",
      //     label: "商品编码(外部码)",
      //     width: "170",
      //     labelWidth: "140",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },
      {
        prop: "id",
        label: "商品id",
        width: "100",
        labelWidth: "140",
        span: 8,
        overHidden: true,
        rules: [
          {
            // trigger: "blur",
            required: true,
            // message: "",
          },
        ],
    },

      {
          prop: "goodsname",
          label: "商品名称",
          width: "200",
          labelWidth: "140",
          span: 8,
          overHidden: true,
          rules: [
            {
              // trigger: "blur",
              required: true,
              // message: "",
            },
          ],
      },

      // {
      //     prop: "yaoqiudaocangdate",
      //     label: "要求到仓日期",
      //     labelWidth: "140",
      //     width: "150",
      //     span: 8,
      //     overHidden: true,
      //     // component: "date",
      //     format: "YYYY-MM-DD",
      //     valueFormat: "YYYY-MM-DD",
      //     type: "date",
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },
      // {
      //     prop: "yaoqiudaocangqty",
      //     label: "要求到仓数量",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "price",
      //     label: "采购单单价",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         message: "采购单单价不能为空",
      //       },
      //     ],
      // },

      // {
      //     prop: "sumprice",
      //     label: "总金额",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     // editDisabled: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "vendordaocangdate",
      //     label: "供货商确认到仓日期",
      //     width: "150",
      //     labelWidth: "140",
      //     span: 8,
      //     // format: "yyyy-MM-dd",
      //     format: "YYYY-MM-DD",
      //     valueFormat: "YYYY-MM-DD",
      //     overHidden: true,
      //     // component: "date",
      //     type: "date",
      //     editDisplay: false,
      //     addDisplay: false,
      // },
      // {
      //     prop: "vendordaocangqty",
      //     label: "供货商确认到仓数量",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "recaddress",
      //     label: "收货地址",
      //     width: "150",
      //     labelWidth: "140",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "orderdate",
      //     label: "下单日期",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     format: "YYYY-MM-DD",
      //     valueFormat: "YYYY-MM-DD",
      //     type: "date",
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "salesdeadlinedate",
      //     label: "销售截数日期",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     format: "YYYY-MM-DD",
      //     valueFormat: "YYYY-MM-DD",
      //     type: "date",
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         // required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      {
          prop: "suppliercode",
          label: "联营商代码",
          width: "200",
          labelWidth: "140",
          span: 8,
          editDisabled: true,
          addDisplay: false,
      },
      {
          prop: "suppliername",
          label: "联营商名称",
          width: "200",
          labelWidth: "140",
          span: 8,
          overHidden: true,
          editDisabled: true,
          addDisplay: false,
      },
      // {
      //     prop: "vendorname",
      //     label: "供货商",
      //     width: "150",
      //     labelWidth: "140",
      //     span: 8,
      //     overHidden: true,
      //     // editDisabled: true,
      //     type: "select",
      //     dicData: [],
      //     props: {
      //         label: "name",
      //         value: "id",
      //       },
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },
      {
          prop: "itemno",
          label: "款号/款式编码",
          width: "200",
          labelWidth: "140",
          span: 8,
          overHidden: true,
          rules: [
            {
              // trigger: "blur",
              required: true,
              // message: "",
            },
          ],
      },
      // {
      //     prop: "huohao",
      //     label: "货号/款+颜色",
      //     width: "80",
      //     labelWidth: "140",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         // required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "colorguige",
      //     label: "颜色及规格",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     overHidden: true,
      //     rules: [
      //       {
      //         // trigger: "blur",
      //         required: true,
      //         // message: "",
      //       },
      //     ],
      // },

      // {
      //     prop: "audidate",
      //     label: "审核日期",
      //     width: "100",
      //     labelWidth: "140",
      //     span: 8,
      //     format: "yyyy-MM-dd",
      //     valueFormat: "yyyy-MM-dd",
      //     overHidden: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "audiman",
      //     label: "审核人",
      //     width: "80",
      //     span: 5,
      //     //cell: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },


      // {
      //     prop: "vendorconfirmdate",
      //     label: "供货商确认日期",
      //     width: "100",
      //     span: 5,
      //     format: "yyyy-MM-dd",
      //     valueFormat: "yyyy-MM-dd",
      //     overHidden: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },
      // {
      //     prop: "finishdate",
      //     label: "完成日期",
      //     width: "80",
      //     span: 5,
      //     format: "yyyy-MM-dd",
      //     valueFormat: "yyyy-MM-dd",
      //     overHidden: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },

      // {
      //     prop: "lastmodidate",
      //     label: "最后修改日期",
      //     width: "100",
      //     span: 5,
      //     format: "yyyy-MM-dd",
      //     valueFormat: "yyyy-MM-dd",
      //     overHidden: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },
      // {
      //     prop: "voiddate",
      //     label: "作废日期",
      //     width: "100",
      //     span: 5,
      //     format: "yyyy-MM-dd",
      //     valueFormat: "yyyy-MM-dd",
      //     overHidden: true,
      //     editDisplay: false,
      //     addDisplay: false,
      // },


      //viewDisplay: false,
      //editDisplay: false,
      //addDisplay: false,
      //tip: '只能上传jpg/png用户头像，且不超过500kb',
      //action: '/imgupload'
  ]
}
