<!--
  bmmnt331 - 分店分天销售预算模板
 -->
 <template>
  <basic-container>
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm022</div>
    <el-row :gutter="5" style="margin-bottom: 10px">
      <el-col :span="1.5">
        <el-button v-if="true" type="primary" @click="queryList(true)">{{
          $t(`Action.Query`)
        }}</el-button></el-col
      >
      <el-col :span="1.5">
        <el-button type="primary" @click="exportExcel(1)">{{
          $t(`Action.Preview`)
        }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="exportExcel(0)">{{
          $t(`Action.Export`)
        }}</el-button>
      </el-col>
      <el-col :span="1.5">
      <!-- v-if="btn_import" -->
        <xvue-file-import :config="excelConfig">
        <template #button>
          <el-button v-if="btn_import"  slot="button" type="primary">{{
            $t(`Action.Import`)
          }}</el-button>
          </template>
        </xvue-file-import>
      </el-col>
    </el-row>
    <el-row>
      <avue-form :option="formOption" v-model="form" ref="form"> </avue-form>
    </el-row>

    <avue-crud
      ref="crud"
      v-model="crudModel"
      :option="crudOption"
      :data="crudData"
      :page="crudPage"
      :table-loading="crudLoading"
      @selection-change="crudSelectionChange"
      @current-change="crudCurrentChange"
      @size-change="crudSizeChange"
    >
      <template #menu="{row}">
        <!-- <el-button
          icon="el-icon-check"
          size="mini"
          type="text"
          v-if="true"
          @click="approve(scope.row)"
          >确认</el-button
        > -->
        <xvue-file-import :config="excelConfig">
         <template #button>
          <el-button
            slot="button"
            icon="el-icon-upload"
            type="text"
            v-if="btn_import"
            @click="importExcelByRow(row)"
          >
            {{ $t(`Action.Import`) }}
          </el-button>
           </template>
        </xvue-file-import>
        
        <el-button
          icon="el-icon-download"
          type="text"
          v-if="true"
          @click="exportExcel(0, row)"
        >
          {{ $t(`Action.Export`) }}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { bmmnt331Api, exportTypeDict } from "@/views/buget/bmmnt331/index.js";
import { mapGetters } from "vuex";

export default {
  name: "bmmnt331",
  data() {
    return {
      userInfo:{},
      excelConfig: {
        uploadData: {
          file: {},
          fileName: "",
          fileId: "",
          content: "",
          isReady: false,
        },
        tipShow: false,
        accept: [
          "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        directImport: true,
      },
      selectRow: undefined,
      //权限
      permissions: {},
      form: {
        cmpOrgId: undefined,
        periodId: undefined,
        brandIdList: undefined,
        catIdList: undefined,
        supplierIdList: undefined,
        eshopTypeList: undefined,
        contractNoList: undefined,
        orgType: undefined,
        //默认选第一个是"CONTRACT"
        exportType: "CONTRACT",
        dataVer: undefined,
        // ysDataVer: undefined,
      },
      formOption: {
        emptyBtn: false,
        submitBtn: false,
        labelWidth: 110,
        column: [
          {
            label: "预算公司",
            prop: "cmpOrgId",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              api: "queryOrgCmp@retail.sys.comSelect",
              radio: true,
              firstItems: true,
            },
          },
          {
            label: "预算期(月份)",
            prop: "periodId",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              api: "queryBmPeriod@retail.bm.bgmcommon",
              radio: true,
            },
          },
          {
            label: "品牌",
            prop: "brandIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              checkall: false,
              api: "queryPrdBrand@retail.sys.comSelect",
            },
          },
          {
            label: "品类",
            prop: "catIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              checkall: false,
              api: "queryPrdCategory@retail.sys.comSelect",
            },
          },
          {
            label: "联营商",
            prop: "supplierIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              filterable: true,
              checkall: false,
              // radio: true,
              // firstItems: true,
              api: "queryAllSupplier@retail.bm.bgmcommon",
            },
          },
          {
            label: "平台",
            prop: "eshopTypeList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              checkall: false,
              api: "queryEshopType@retail.bm.bgmcommon",
            },
          },
          {
            label: "合同申请号",
            prop: "contractNoList",
            span: 8,
            component: "DroplistControlExt",
            props: {
              filterable: true,
              checkall: false,
              api: "queryContractNoList@retail.bm.bgmcommon",
              watch: true,
              params: {
                cmpId: undefined,
                brandIdList: undefined,
                catIdList: undefined,
                supplierIdList: undefined,
                eshopTypeList: undefined,
              },
            },
          },
          {
            label: "合作方",
            prop: "orgType",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              radio: true,
              firstItems: true,
              api: "queryBgmOrgType@retail.sys.comSelect",
            },
          },
          {
            label: "数据版本",
            prop: "dataVer",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              radio: true,
              firstItems: true,
              api: "queryDataVerList@retail.bm.bgmcommon",
              watch: true,
              params: {
                cmpId: undefined,
                bmOrgType: undefined,
                bmType: "DY_DAILY",
              },
            },
          },
          // {
          //   label: "分季预算版本",
          //   prop: "ysDataVer",
          //   span: 8,
          //   component: "DroplistControl",
          //   props: {
          //     radio: true,
          //     firstItems: true,
          //     api: "queryLastMasterDataVer@retail.bm.bgmcommon",
          //     watch: true,
          //     params: { cmpId: undefined, bmOrgType: undefined, bmType: "SP_PERIOD", master: 1},
          //   },
          //   display: true
          // },
          {
            label: "导出选项",
            prop: "exportType",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              dicData: exportTypeDict.exportType,
              radio: true,
              firstItems: true,
            },
          },
          {
            label: "参考比例",
            prop: "scaleId",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              radio: true,
              firstItems: true,
              api: "queryScaleNameList@retail.bm.bgmcommon",
              watch: true,
              params: {
                cmpId: undefined,
                scaleType: "DAILY_MONTH",
              },
            },
          },
        ],
      },
      crudOption: {
        //selection: true,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        index: true,
        menu: true,
        menuWidth: 240,
        height: 500,
        labelWidth: 120,
        indexLabel: "序号",
        column: [
          // {
          //   label: "预算公司",
          //   prop: "companyName",
          //   span: 12,
          // },
          {
            label: "预算月份(期)",
            prop: "periodName",
            span: 12,
            width: 100,
          },
          {
            label: "品牌",
            prop: "bndName",
            span: 12,
            // width: 140,
          },
          {
            label: "品类",
            prop: "catName",
            span: 12,
            width: 100,
          },
          {
            label: "联营商",
            prop: "supplierName",
            span: 12,
            width: 100,
          },
          {
            label: "平台",
            prop: "eshopDesc",
            span: 12,
            width: 100,
          },
          {
            label: "合同",
            prop: "groupName",
            span: 12,
            width: 200,
          },
          {
            label: "合作方",
            prop: "orgTypeName",
            span: 12,
            // width: 80,
          },
          // {
          //   label: "状态",
          //   prop: "status",
          //   span: 12,
          //   width: 80,
          // },
          {
            label: "最近提交时间",
            prop: "modified",
            span: 12,
            width: 200,
          },
          {
            label: "提交人",
            prop: "modifier",
            span: 12,
            width: 120,
          },
        ],
      },
      crudData: [],
      crudLoading: false,
      crudSelectList: [],
      crudPage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  props: {},
  components: {},
  created() {
    //初始化权限变量
    this.$viewUtil.initView(this, "bmmnt331", "");
    this.initData();
        const local = localStorage.getItem("userInfo");
    if (local) {
      this.userInfo = JSON.parse(local);
    }
  },
  mounted() {},
  computed: {
    isReady() {
      return this.excelConfig.uploadData.isReady;
    },
    // ...mapGetters(["elements", "permission", "userInfo"]),

    
    // btn_import() {
    //   if (this.form.cmpOrgId === "A") {
    //     return (
    //       !this.userInfo.organize.league ||
    //       (this.userInfo.organize.league && this.form.orgType === "PNR")
    //     );
    //   } else {
    //     return (
    //       (!this.userInfo.organize.league && this.form.orgType === "CMP") ||
    //       (this.userInfo.organize.league && this.form.orgType === "PNR")
    //     );
    //   }
    // },

      btn_import() {
      if (this.form.cmpOrgId === "A") {
        return (
          !this.userInfo.organize.league ||
          (this.userInfo.organize.league && this.form.orgType === "PNR")
        );
      } else {
        return (
          (!this.userInfo.organize.league && this.form.orgType === "CMP") ||
          (this.userInfo.organize.league && this.form.orgType === "PNR")
        );
      }
    },
  },
  watch: {
    isReady: function (val) {
      if (val) {
        // 表格文件导入调用上传事件
        this.importExcel();
      }
    },
    form: {
      deep: true,
      handler(val) {
        this.formOption.column.forEach((item) => {
          if (item.prop === "dataVer" /*|| item.prop === "ysDataVer"*/) {
            item.props.params.cmpId = val.cmpOrgId;
            item.props.params.bmOrgType = val.orgType;
          } else if (item.prop === "contractNoList") {
            item.props.params.cmpId = val.cmpOrgId;
            item.props.params.brandIdList = val.brandIdList;
            item.props.params.catIdList = val.catIdList;
            item.props.params.supplierIdList = val.supplierIdList;
            item.props.params.eshopTypeList = val.eshopTypeList;
          }
        });
      },
    },
  },
  methods: {
    initData() {},
    exportExcel(isPreview, row) {
      if (this.form.periodId === undefined) {
        this.$message.error("请选择预算期数(月份)！");
        return;
      }
      console.log("导出中。。。");
      
      console.log( this.form);
      

      // if (row === undefined) {
      //   if (
      //     this.form.supplierIdList === undefined ||
      //     this.form.supplierIdList.length < 1
      //   ) {
      //     this.$message.error("请选择一个联营商！");
      //     return;
      //   }
      //   // if (this.form.supplierIdList.length > 1 && this.form.exportType === "CONTRACT") {
      //   //   this.$message.error("分合同导出时,只能选择一个联营商！");
      //   //   return;
      //   // }
      // }

      let params = {
        isPreview: isPreview,
        cmpId: this.form.cmpOrgId,
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        contractNoList: this.form.contractNoList,
        exportType: this.form.exportType,
        bmGroup: row !== undefined ? row.bmGroup : undefined,
        bmYearSeasonId: row !== undefined ? row.bmYearseasonid : undefined,
        bmPeriodId: row !== undefined ? row.bmPeriodid : undefined,
        bmOrgType: row !== undefined ? row.bmOrgtype : this.form.orgType,
        periodId: row !== undefined ? undefined : this.form.periodId,
        dataVer: this.form.dataVer,
        scaleId: this.form.scaleId,
        // ysDataVer: this.form.ysDataVer
      };
      this.$dlg.Loading("正在导出...");
      bmmnt331Api
        .exportExcel(params)
        .then((res) => {
          this.$message.success("导出成功！");
          if (res.code === 0) {
            if (isPreview === 1) {
              let url = res.result.reportUrl;
              this.$httputil.openUrlInNewWindow(url);
            } else {
              let base64 = res.result.base64;
              // 调用导出
              this.$excel.excelExport(res.result.fileName, base64, ".xlsx");
            }
            this.$dlg.Loading(false);
          }
        })
        .catch(() => {
          this.$dlg.Loading(false);
        });
    },
    importExcelByRow(row) {
      this.selectRow = row;
    },
    async importExcel() {
      //导入
      this.$dlg.Loading("数据导入中...");
      let params = {
        cmpId: this.form.cmpOrgId,
        bmGroup:
          this.selectRow !== undefined ? this.selectRow.bmGroup : undefined,
        bmYearSeasonId:
          this.selectRow !== undefined
            ? this.selectRow.bmYearseasonid
            : undefined,
        bmPeriodId:
          this.selectRow !== undefined ? this.selectRow.bmPeriodid : undefined,
        bmOrgType:
          this.selectRow !== undefined
            ? this.selectRow.bmOrgtype
            : this.form.orgType,
        file: {
          fileId: this.excelConfig.uploadData.fileId,
          titleRows: 0,
          headRows: 1,
        },
      };
      // await bmmnt331Api
      //   .importExcel(params)
      //   .then((res) => {
      //     if (res.data.code === 0) {
      //       this.$dlg.showSuccess("导入成功！");
      //     } else {
      //       this.$dlg.showError("导入失败, 请检查文件!");
      //     }
      //   })
      //   .catch((err) => {
      //     this.$dlg.error(err.data.message);
      //   });
        try{
       const res =  await bmmnt331Api.importExcel(params);
          if (res.code === 0) {
            this.$dlg.showSuccess("导入成功！");
          } else {
            this.$dlg.showError("导入失败, 请检查文件!");
          }
        }
        catch{
         this.$dlg.showError("导入失败, 请检查文件!");
        };
      this.$dlg.Loading(false);
      this.initExcelConfig();
      this.selectRow = undefined;
    },
    initExcelConfig() {
      this.excelConfig.uploadData = {
        file: {},
        fileName: "",
        fileId: "",
        content: "",
        isReady: false,
      };
    },
    async queryList(resetPage) {
      if (this.form.periodId === undefined) {
        this.$message.error("请选择预算期数(月份)！");
        return;
      }

      this.crudLoading = true;

      this.crudPage.currentPage =
        resetPage === true ? 1 : this.crudPage.currentPage;
      let params = Object.assign(this.form, {
        PageSize: this.crudPage.pageSize,
        PageNumber: this.crudPage.currentPage,
        cmpId: this.form.cmpOrgId,
        bmPeriodId: this.form.periodId,
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        contractNoList: this.form.contractNoList,
        bmOrgType: this.form.orgType,
        dataVer: this.form.dataVer,
        // ysDataVer: this.form.ysDataVer
      });
      // await bmmnt331Api
      //   .query(params)
      //   .then((res) => {
      //     if (res.data.code === 0) {
      //       let data = res.data.result;
      //       this.crudData = data.tableData;
      //       this.crudPage.total = data.total;
      //       this.crudPage.pageSize = data.pageSize;
      //     } else {
      //       this.$dlg.showError("查询失败！");
      //     }
      //   })
      //   .catch(() => {
      //     this.crudLoading = false;
      //   });

      try{
        console.log(111);
        
       const res = await bmmnt331Api.query(params);
       console.log("bmmnt331");
       console.log(res);
       
       
          if (res.code === 0) {
            let data = res.result;
            this.crudData = data.tableData;
            this.crudPage.total = data.total;
            this.crudPage.pageSize = data.pageSize;
          } else {
            this.$dlg.showError("查询失败！");
          }
      }
        catch{
          this.crudLoading = false;
        }

      this.crudLoading = false;
    },
    crudSelectionChange(list) {
      this.crudSelectList = list;
    },
    crudCurrentChange(val) {
      this.crudPage.currentPage = val;
      this.queryList(false);
    },
    crudSizeChange(val) {
      this.crudPage.currentPage = 1;
      this.crudPage.pageSize = val;
      this.queryList(false);
    },
    approve(row) {
      let params = {
        bmGroup: row !== undefined ? row.bmGroup : undefined,
        bmYearSeasonId: row !== undefined ? row.bmYearseasonid : undefined,
        bmPeriodId: row !== undefined ? row.bmPeriodid : undefined,
      };
      this.$confirm("确定要确认选择的资料？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          bmmnt331Api.approve(params).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("确认成功");
              this.queryList();
            } else {
              this.$message.error("确认失败，未知错误!");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消确认",
          });
        });
    },
  },
};
</script>
