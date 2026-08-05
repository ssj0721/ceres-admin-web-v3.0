<!--
  bmmnt332 - 分周分品种销售预算(DY)
 -->
<template>
  <basic-container>
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm023</div>
    <el-row :gutter="5" style="margin-bottom: 10px">
      <el-col :span="1.5">
         <!-- v-if="permissions.query" -->
        <el-button
          v-if="true"
          type="primary"
          @click="queryList(true)"
          >{{ $t(`Action.Query`) }}</el-button
        ></el-col
      >
      <el-col :span="1.5">
      <!-- v-if="btn_split" -->
        <el-button v-if="btn_split" type="primary" @click="split()"
          >分拆</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <!-- v-if="permissions.export" -->
        <el-button
          v-if="permissions.export"
          type="primary"
          @click="exportExcel()"
          >{{ $t(`Action.Export`) }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <xvue-file-import :config="excelConfig">
        <!-- v-if="btn_import" -->
        <template #button>
          <el-button v-if="btn_import" slot="button" type="primary">{{
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
        <el-button
          icon="el-icon-check"
          size="mini"
          type="text"
          v-if="false && permissions.approve"
          @click="approve(scope.row)"
          >确认</el-button
        >
         <!-- v-if="permissions.export" -->
        <el-button
          icon="el-icon-download"
          size="mini"
          type="text"
          v-if="permissions.export"
          @click="exportExcel(row)"
          >导出</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { bmmnt332Api } from "@/views/buget/bmmnt332/index.js";
import { mapGetters } from "vuex";

export default {
  name: "bmmnt332",
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
      //权限
      permissions: {},
      form: {
        cmpOrgId: undefined,
        periodId: undefined,
        brandIdList: undefined,
        daterange: undefined,
        daterangeLY: undefined,
        catIdList: undefined,
        supplierIdList: undefined,
        eshopTypeList: undefined,
        orgType: undefined,
        bmType: "shopg",
        options: ["BP_DEPT", "NoDY"],
      },
      formOption: {
        emptyBtn: false,
        submitBtn: false,
        labelWidth: 90,
        column: [
          {
            label: "预算公司",
            prop: "cmpOrgId",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              api: "queryCmpData@retail.sys.comSelect",
              radio: true,
              firstItems: true,
            },
          },
          {
            label: "预算周范围",
            prop: "daterange",
            span: 8,
            component: "datePicker",
            props: {
              // fromDate,
              // toDate,
              type: "daterange",
              selectionMode: "week",
              showWeekNumber: true,
            },
            valueDefault: [],
          },
          {
            label: "去年同期",
            prop: "daterangeLY",
            span: 8,
            component: "datePicker",
            props: {
              // fromDate,
              // toDate,
              type: "daterange",
              selectionMode: "week",
              showWeekNumber: true,
            },
            valueDefault: [],
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
              api: "querySupplier@retail.bm.bgmcommon",
            },
          },
          {
            label: "平台",
            prop: "eshopTypeList",
            span: 6,
            component: "iRetailDroplistControl",
            props: {
              checkall: false,
              api: "queryEshopType@retail.bm.bgmcommon",
            },
          },
          {
            label: "合作方",
            prop: "orgType",
            span: 6,
            component: "iRetailDroplistControl",
            props: {
              radio: true,
              firstItems: true,
              api: "querySysDictData@retail.sys.comSelect",
              params: { type: "biz.bgm.orgtype" },
            },
          },
          {
            label: "预算类型",
            prop: "bmType",
            span: 6,
            // type: "select",
             component: "iRetailDroplistControl",
            props: {
            dicData: [
              {
                name: "分合同",
                id: "shopg",
              },
              {
                name: "分店",
                id: "shop",
              },
            ],
            // clearable: false,
            // valueDefault: "shopg",
              radio: true,
              firstItems: true,
            }
          },
          {
            label: "其他选项",
            prop: "options",
            span: 6,
            component: "iRetailDroplistControl",
            props: {
              radio: false,
              dicData: [
                {
                  name: "默认分品种买货比例",
                  id: "BP_DEPT",
                },
                {
                  name: "无月DY预算不导出",
                  id: "NoDY",
                },
                {
                  name: "覆盖分拆",
                  id: "OVERWRITE_SPLIT",
                },
              ],
            },
            valueDefault: ["BP_DEPT", "NoDY"],
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
          {
            label: "预算公司",
            prop: "cmpname",
            span: 12,
          },
          {
            label: "预算月份(期)",
            prop: "periodname",
            span: 12,
            hide: true,
          },
          {
            label: "周",
            prop: "weekname",
            span: 12,
            width: 160,
          },
          {
            label: "周序号",
            prop: "bmYearweekid",
            span: 12,
            hide: true,
          },
          {
            label: "周开始日期",
            prop: "fromdate",
            span: 12,
            hide: true,
          },
          {
            label: "周结束日期",
            prop: "todate",
            span: 12,
            hide: true,
          },
          {
            label: "品牌",
            prop: "bndname",
            span: 12,
          },
          {
            label: "品类",
            prop: "catname",
            span: 12,
          },
          {
            label: "联营商",
            prop: "suppliername",
            span: 12,
          },
          {
            label: "平台",
            prop: "eshopdesc",
            span: 12,
          },
          {
            label: "合同",
            prop: "contractno",
            span: 12,
          },
          {
            label: "合作方",
            prop: "orgtypename",
            span: 12,
            width: 80,
          },
          {
            label: "最近提交时间",
            prop: "modified",
            span: 12,
            width: 150,
          },
          {
            label: "提交人",
            prop: "modifier",
            span: 12,
            width: 100,
          },
        ],
      },
      crudData: [],
      crudModel: [{}],
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
    this.$viewUtil.initView(this, "bmmnt332", "split");
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
    ...mapGetters(["elements", "permission", "userInfo"]),

    // btn_import() {
    //   return (
    //     this.permissions.import &&
    //     this.userInfo.organize.league === (this.form.orgType === "PNR")
    //   );
    // },
    // btn_split() {
    //   return (
    //     this.permissions.split &&
    //     this.userInfo.organize.league === (this.form.orgType === "PNR")
    //   );
    // },

      btn_import() {
      return (
        this.permissions.import &&
        this.userInfo.organize.league === (this.form.orgType === "PNR")
      );
    },
    btn_split() {
      console.log("分拆");
      
      console.log(this);
      
      return (
        this.permissions.split &&
        this.userInfo.organize.league === (this.form.orgType === "PNR")
      );
    },
  },
  watch: {
    isReady: function(val) {
      if (val) {
        // 表格文件导入调用上传事件
        this.importExcel();
      }
    },
  },
  methods: {
    initData() {},
   async exportExcel(row, reset) {
    console.log(this.form);
    
      let params = {};
      if (row == undefined) {
        if (this.form.daterange === undefined) {
          this.$message.error("请选择预算周范围！");
          return;
        }
        if (this.form.daterangeLY === undefined) {
          this.$message.error("请选择去年同期范围！");
          return;
        }
        let dateFrom = new Date(this.form.daterange[0]);
        let dateTo = new Date(this.form.daterange[1]);
        let dateFromLY = new Date(this.form.daterangeLY[0]);
        let dateToLY = new Date(this.form.daterangeLY[1]);
        if (dateFrom.getDay() !== 1) {
          this.$message.error("预算周开始日期请选择周一日期！");
          return;
        }
        if (dateTo.getDay() !== 0) {
          this.$message.error("预算周结束日期请选择周日日期！");
          return;
        }
        if (dateFromLY.getDay() !== 1) {
          this.$message.error("去年同期开始日期请选择周一日期！");
          return;
        }
        if (dateToLY.getDay() !== 0) {
          this.$message.error("去年同期周结束日期请选择周日日期！");
          return;
        }
        // if (
        //   dateFrom.getDiffDays(dateTo) > 49 ||
        //   dateFromLY.getDiffDays(dateToLY) > 49
        // ) {
        //   this.$message.error("预算周、去年同期最多选择7周！");
        //   return;
        // }
        const diff1 = this.getDiffDays(dateFrom, dateTo);
        const diff2 = this.getDiffDays(dateFromLY, dateToLY);
        if (diff1 > 49 || diff2 > 49) {
          this.$message.error("时间范围不能超过 7 周！");
          return;
        }
        params = {
          cmpOrgId: this.form.cmpOrgId,
          periodId: this.form.periodId,
          dateFrom: this.form.daterange[0],
          dateTo: this.form.daterange[1],
          dateFromLY: this.form.daterangeLY[0],
          dateToLY: this.form.daterangeLY[1],
          brandIdList: this.form.brandIdList,
          catIdList: this.form.catIdList,
          supplierIdList: this.form.supplierIdList,
          eshopTypeList: this.form.eshopTypeList,
          bmOrgType: this.form.orgType,
          bmType: this.form.bmType,
          options: this.form.options,

          reset: reset || true,
        };
      } else {
        params = {
          selectList: [
            {
              bm_group: row.bmGroup,
              bm_yearSeasonId: row.bmYearseasonid,
              bm_periodId: row.bmPeriodid,
              bm_yearWeekId: row.bmYearweekid,
            },
          ],
          cmpId: row.cmpid,
          cmpName: row.cmpname,
          periodId: row.periodid,
          dateFromLY: this.form.daterangeLY[0],
          dateToLY: this.form.daterangeLY[1],
          bmOrgType: row.bmorgtype,
          bmType: this.form.bmType,
          options: this.form.options,
        };
      }
      console.log("导出。。。");
      
      this.$dlg.Loading("正在导出...");
      // bmmnt332Api
      //   .exportExcel(params)
      //   .then((res) => {
      //     this.$message.success("导出成功！");
      //     if (res.data.code === 0) {
      //       let base64 = res.data.result.base64;
      //       // 调用导出
      //       this.$excel.excelExport(res.data.result.fileName, base64, ".xlsx");
      //       this.$dlg.Loading(false);
      //     }
      //   })
      //   .catch((res) => {
      //     console.log("导出异常", res);
      //     this.$dlg.Loading(false);
      //   });
      try{
          const res =  await bmmnt332Api.exportExcel(params)
          console.log("导出332ve");
          console.log(res);
          
          
          if (res.code === 0) {
            this.$message.success("导出成功！");
            let base64 = res.result.base64;
            // 调用导出
            console.log(res);
            
            this.$excel.excelExport(res.result.fileName, base64, ".xlsx");
            this.$dlg.Loading(false);
          }
        }
        catch{
          console.log("导出异常", res);
          this.$dlg.Loading(false);
        };
    },
    async importExcel() {
      //导入
      this.$dlg.Loading("数据导入中...");
      let params = {
        cmpOrgId: this.form.cmpOrgId,
        bmOrgType: this.form.orgType,
        file: {
          fileId: this.excelConfig.uploadData.fileId,
          titleRows: 1,
          headRows: 1,
        },
      };
      // await bmmnt332Api
      //   .importExcel(params)
      //   .then((res) => {
      //     if (res.data.code === 0) {
      //       let msg = "";
      //       if (
      //         res.data.result.errsheet !== undefined &&
      //         res.data.result.errsheet !== ""
      //       ) {
      //         msg = `部分导入成功！<font color="red"><br>以下工作表的预算占比分配异常未导入(占比汇总超100%或占比有负数)，请检查再导入：<br>${
      //           res.data.result.errsheet
      //         }<font>`;
      //       } else {
      //         msg = `导入成功！`;
      //       }
      //       this.$dlg.success(`${msg}`);
      //     } else {
      //       this.$dlg.showError("导入失败, 请检查文件!");
      //     }
      //   })
      //   .catch((err) => {
      //     this.$dlg.error(err.data.message, err);
      //   });
      try{
        const res =  await bmmnt332Api.importExcel(params);
          if (res.code === 0) {
            let msg = "";
            if (
              res.result.errsheet !== undefined &&
              res.result.errsheet !== ""
            ) {
              msg = `部分导入成功！<font color="red"><br>以下工作表的预算占比分配异常未导入(占比汇总超100%或占比有负数)，请检查再导入：<br>${
                res.result.errsheet
              }<font>`;
            } else {
              msg = `导入成功！`;
            }
            this.$dlg.success(`${msg}`);
          } else {
            this.$dlg.showError("导入失败, 请检查文件!");
          }
        }
        catch {
            this.$dlg.showError("导入失败, 请检查文件!");
        };

      this.$dlg.Loading(false);
      this.initExcelConfig();
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
          if (this.form.daterange === undefined) {
        this.$message.error("请选择预算周范围！");
        return;
      }
      if (this.form.daterangeLY === undefined) {
        this.$message.error("请选择去年同期范围！");
        return;
      }
      console.log(this.form);
      
      this.crudLoading = true;

      this.crudPage.currentPage =
        resetPage === true ? 1 : this.crudPage.currentPage;
      let params = Object.assign(this.form, {
        bmOrgType: this.form.orgType,
        PageSize: this.crudPage.pageSize,
        PageNumber: this.crudPage.currentPage,
      });
      params = Object.assign(params, {
        dateFrom: this.form.daterange[0],
        dateTo: this.form.daterange[1],
      });

      // await bmmnt332Api
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
           const res = await bmmnt332Api.query(params);
           console.log("bmmnt332");
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
        catch {
          this.crudLoading = false;
        };

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
    async split() {
      if (this.form.daterange === undefined) {
        this.$message.error("请选择预算周范围！");
        return;
      }
      if (this.form.daterangeLY === undefined) {
        this.$message.error("请选择去年同期范围！");
        return;
      }
      this.$dlg.Loading("操作中,请稍后...");

      let params = {
        cmpOrgId: this.form.cmpOrgId,
        periodId: this.form.periodId,
        dateFrom: this.form.daterange[0],
        dateTo: this.form.daterange[1],
        dateFromLY: this.form.daterangeLY[0],
        dateToLY: this.form.daterangeLY[1],
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        bmOrgType: this.form.orgType,
        bmType: this.form.bmType,
        options: this.form.options,
      };
   
      // await bmmnt332Api.split(params)
      //   .then(async (res) => {
      //     let state = res.data.code;
      //     if (state === 0) {
      //       this.$message.success("操作成功");
      //       await this.queryList();
      //     } else {
      //       this.$message.error("操作失败，错误信息：" + res.data.msg);
      //     }
      //   })
      //   .catch((res) => {
      //     console.log("error", res);
      //   });
      // this.$dlg.Loading(false);

        try{
        const res = await bmmnt332Api.split(params)
          let state = res.code;
          if (state === 0) {
            this.$message.success("操作成功");
            await this.queryList();
          } else {
            this.$message.error("操作失败，错误信息：" + res.msg);
          }
        }
        
        catch{
          console.log("error", res);
        }
      this.$dlg.Loading(false);
    },
    approve(row) {
      console.log("row", row);
      let params = {
        selectList: [
          {
            bm_group: row.bmGroup,
            bm_yearSeasonId: row.bmYearseasonid,
            bm_periodId: row.bmPeriodid,
            bm_yearWeekId: row.bmYearweekid,
          },
        ],
        bmOrgType: row.bmorgtype,
        bmType: this.form.bmType,
      };
      this.$confirm("确定要确认选择的资料？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          bmmnt332Api.approve(params).then((res) => {
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
    getDiffDays(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
}
  },
};
</script>
