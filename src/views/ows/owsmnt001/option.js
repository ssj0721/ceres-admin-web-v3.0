// 库存的表单
export const packOption = {
    submitBtn: false,
    emptyBtn: false,
    dialogClickModal: false,
    column: [
      {
        label: "sku",
        prop: "sku",
        // dicData: [],
        span: 7,
        placeholder: "多款用空格、半角逗号或换行符分隔，单sku时模糊查询",
        hide: true,
        overHidden: true,
      },
      // {
      //   label: "生产时段",
      //   prop: "product_date",
      //   span: 8,
      //   type: "daterange",
      //   format: "yyyy-MM-dd",
      //   valueFormat: "yyyy-MM-dd",
      // },
    ],
  };
  
  // 库存的表格
  export const packTableOption = {
    index: true,
    selection: false,
    indexLabel: "序号",
    menuAlign: "center",
    editBtn: false,
    delBtn: false,
    viewBtn: true,
    menu: false,
    align: "center",
    addBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuWidth: "180",
    height: "400",
    labelWidth: "100",
    dialogWidth: "50%",
    dialogHeight: "50%",
    dialogClickModal: false,
    column: [
      {
        label: "sku",
        prop: "sku_id",
        width: "200",
      },
      {
        label: "款号",
        prop: "style_no",
        width: "200",
      },
      {
        label: "色码",
        prop: "col_id",
      },
      {
        label: "尺码",
        prop: "siz_id",
      },
      {
        label: "商品名称",
        prop: "name",
        width: "200",
      },
      {
        label: "实际库存",
        prop: "qty",
      },
      {
        label: "虚拟库存",
        prop: "virtual_qty",
      },
      {
        label: "采购在途数",
        prop: "purchase_qty",
      },
      {
        label: "销退仓库存",
        prop: "return_qty",
      },
      {
        label: "进货仓库存",
        prop: "in_qty",
      },
      {
        label: "次品仓库存",
        prop: "defective_qty",
      },
    ],
    // column: [
    //   {
    //     label: "类型",
    //     prop: "packType",
    //   },
    //   {
    //     label: "明细仓位",
    //     prop: "itemBin",
    //   },
    //   {
    //     label: "分仓编号",
    //     prop: "wmsCoId",
    //   },
    //   {
    //     label: "箱号",
    //     prop: "packId",
    //   },
    //   {
    //     label: "仓库类型",
    //     prop: "whId",
    //   },
    //   {
    //     label: "主仓位",
    //     prop: "bin",
    //   },
    //   {
    //     label: "数量",
    //     prop: "qty",
    //   },
    //   {
    //     label: "修改时间",
    //     prop: "modified",
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //     valueFormat: "yyyy-MM-dd",
    //   },
    //   {
    //     label: "商品编码",
    //     prop: "skuId",
    //   },
    //   {
    //     label: "有效期",
    //     prop: "expirationDate",
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //     valueFormat: "yyyy-MM-dd",
    //   },
    //   {
    //     label: "生产日期",
    //     prop: "productDate",
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //     valueFormat: "yyyy-MM-dd",
    //   },
    //   {
    //     label: "生产批次",
    //     prop: "batchNo",
    //   },
    //   {
    //     label: "供应商ID",
    //     prop: "supplierId",
    //   },
    // ],
  };
  
  // 入库的表单
  export const purchaseinOption = {
    submitBtn: false,
    emptyBtn: false,
    dialogClickModal: false,
    column: [
      {
        label: "sku",
        prop: "sku",
        // dicData: [],
        span: 7,
        placeholder: "多款用空格、半角逗号或换行符分隔，单sku时模糊查询",
        hide: true,
        overHidden: true,
      },
      {
        label: "入库日期",
        prop: "io_date",
        span: 8,
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    ],
  };
  
  // 入库的表格
  export const purchaseinTableOption = {
    index: true,
    selection: false,
    indexLabel: "序号",
    menuAlign: "center",
    editBtn: false,
    delBtn: false,
    viewBtn: true,
    menu: false,
    align: "center",
    addBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuWidth: "180",
    height: "400",
    labelWidth: "100",
    dialogClickModal: false,
    column: [
      {
        label: "sku",
        prop: "sku_id2",
        width: "200",
      },
      {
        label: "款号",
        prop: "itemcode",
        width: "200",
      },
      {
        label: "商品名称",
        prop: "name",
        width: "200",
      },
      {
        label: "尺码",
        prop: "siz_id",
        width: "80",
      },
      {
        label: "色码",
        prop: "col_id",
        width: "80",
      },
      {
        label: "入库数量",
        prop: "qty2",
        width: "80",
      },
      {
        label: "入库日期",
        prop: "io_date",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
      {
        label: "进仓类型",
        prop: "type",
      },
    ],
  };
  