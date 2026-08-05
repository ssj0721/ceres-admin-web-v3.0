<!--
  bmmnt311 - 全年销售预算模板
 -->
 <template>
  <basic-container>
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm020</div>
    <el-row :gutter="5" style="margin-bottom: 10px">
      <el-col :span="1.5">
        <el-button v-if="true" type="primary" @click="queryList(true)">{{
          $t(`Action.Query`)
        }}</el-button>
      </el-col>
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
            <!-- v-if="!userInfo.organize.league" -->
      <!-- <el-col :span="1.5">
        <xvue-file-import :config="excelConfig">
          <el-button
            slot="button"
            type="primary"
            >{{ $t(`Action.Import`) }}</el-button
          >
        </xvue-file-import>
      </el-col> -->
          <el-col :span="1.5">
      <xvue-file-import :config="excelConfig">
        <template #button>
          <el-button 
          v-if="!userInfo.organize.league"
           type="primary">{{ $t(`Action.Import`) }}</el-button>
        </template>
      </xvue-file-import>
    </el-col>

    </el-row>
    <el-row>
      <avue-form :option="formOption" v-model="form" >
         <template #yearDatePicker="{ disabled }">
         <div>
          <el-date-picker
            v-model="form.yearDatePicker"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          >
          </el-date-picker>
          </div>
        </template>
        <!-- <template slot="autoCalc" slot-scope="scope">
          <el-checkbox v-model="autoCalc">参考去年同期,且不低于保底</el-checkbox>
        </template>
        <template slot="growthRate" slot-scope="scope">
          <el-input v-model="growthRate" placeholder="增长率%" :disabled="!autoCalc"></el-input>
        </template> -->
      </avue-form>
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
        <!-- <xvue-file-import :config="excelConfig">
          <el-button
            slot="button"
            icon="el-icon-upload"
            type="text"
            v-if="btn_import"
            @click="importExcelByRow(scope.row)">
            {{ $t(`Action.Import`) }}
          </el-button>
        </xvue-file-import> -->
        <el-button
          icon="el-icon-download"
          type="text"
           v-if="btn_import"
          @click="exportExcel(0, row)"
        >
          {{ $t(`Action.Export`) }}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { bmmnt311Api } from "@/views/buget/bmmnt311/index.js";
import { mapGetters } from "vuex";
import { ref } from 'vue'
export default {
  name: "bmmnt311",
  
  data() {
    return {
      excelConfig: {
        userInfo:{},
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
      year: undefined,
      // autoCalc: true,
      // growthRate: 10,
      selectRow: undefined,
      //权限
      permissions: {},
      form: {
        cmpOrgId: undefined,
        brandIdList: undefined,
        catIdList: undefined,
        supplierIdList: undefined,
        eshopTypeList: undefined,
        orgType: undefined,
        dataGenerateType: 1,
        dataVer: undefined,
        yearDatePicker: '',
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
            label: "预算年度",
            // prop: "yearDatePicker",
            span: 8,
            prop:"year",
            type: "year",
            // type:"date",
            // format:"yyyy"
            // component: "datePicker",
            // props: {
            //     // fromDate: dateutil.curdatenear(-180),
            //     // toDate: dateutil.curdate(),
            //     //type: "datetimerange",
            //     clearable: true,
            //     format:"yyyy",
            //     valueFormat:"yyyy"
            // },
            // formslot: true,
          },
          {
            label: "品牌",
            prop: "brandIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              checkall: true,
              api: "queryPrdBrand@retail.sys.comSelect",
            },
          },
          {
            label: "品类",
            prop: "catIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              checkall: true,
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
                bmType: "SP_YEAR",
              },
            },
          },
          {
            label: "分月/期",
            prop: "dispMode",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              dicData: [
                  {
                    id: "DISP_MONTH",
                    name: "分月"
                  },
                  {
                    id: "DISP_PERIOD",
                    name: "分期"
                  },
                ],
              radio: true,
              firstItems: true,
            },
          },
          // {
          //   label: "数据来源",
          //   prop: "dataGenerateType",
          //   span: 8,
          //   component: "DroplistControl",
          //   props: {
          //     api: "queryDataGenerateType@retail.bm.bmmnt311",
          //     radio: true,
          //     firstItems: true,
          //   },
          // },
          // {
          //   label: "自动计算预算",
          //   prop: "autoCalc",
          //   span: 8,
          //   formslot: true,
          // },
          // {
          //   label: "增长率%",
          //   prop: "growthRate",
          //   span: 8,
          //   formslot: true,
          // },
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
            label: "年度",
            prop: "bmYear",
            span: 12,
            width: 80,
          },
          {
            label: "品牌",
            prop: "bndName",
            span: 12,
            width: 180,
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
            width: 100, 
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
            // width: 80,
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
    this.$viewUtil.initView(this, "bmmnt311", "");
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
  userInfo() {
    const userStr = localStorage.getItem('userInfo');
    return userStr ? JSON.parse(userStr) : {};
  },
    btn_import() {
      // return (!this.userInfo.organize.league && this.form.orgType === "CMP") ||
      // (this.userInfo.organize.league && this.form.orgType === "PNR");
      // console.log(this.userInfo);
      
          const u = this.userInfo;
          return (!u.organize.league && this.form.orgType === "CMP") ||
          (u.organize.league && this.form.orgType === "PNR");
      
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
          if (item.prop === "dataVer") {
            item.props.params.cmpId = val.cmpOrgId;
            item.props.params.bmOrgType = val.orgType;
          }
        });
      },
    },
  },
  methods: {
    initData() {},
   async exportExcel(isPreview, row) {

      const yearValue = this.form.year instanceof Date
      ? this.form.year.getFullYear()
       : this.form.year;
       console.log(7878787);
       console.log(yearValue);
       
       
      if (!yearValue) {
        this.$message.error("请选择预算年度！");
        return;
      }

      let params = {
        isPreview: isPreview,
        cmpId: this.form.cmpOrgId,
        // nextYear: this.year,
        nextYear: yearValue,
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        // autoCalc: this.autoCalc,
        // growthRate: this.growthRate,
        bmGroup: row !== undefined ? row.bmGroup : undefined,
        bmYear: row !== undefined ? row.bmYear : undefined,
        bmOrgType: row !== undefined ? row.bmOrgtype : this.form.orgType,
        dataGenerateType:
          row !== undefined ? 0 : Number(this.form.dataGenerateType),
        dataVer: this.form.dataVer,
        dispMode: this.form.dispMode,
      };
      this.$dlg.Loading("正在导出...");
      // bmmnt311Api
      //   .exportExcel(params)
      //   .then((res) => {
      //     this.$message.success("导出成功！");
      //     if (res.data.code === 0) {
      //       if (isPreview === 1) {
      //         let url = res.data.result.reportUrl;
      //         this.$httputil.openUrlInNewWindow(url);
      //       } else {
      //         let base64 = res.data.result.base64;
      //         // 调用导出
      //         this.$excel.excelExport(res.data.result.fileName, base64, ".xlsx");
      //       }
      //       this.$dlg.Loading(false);
      //     }
      //   })
      //   .catch(() => {
      //     this.$dlg.Loading(false);
      //   });
        const res = await  bmmnt311Api.exportExcel(params)
        // .then((res) => {
          if (res.code === 0) {
              this.$message.success("导出成功！");
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
        // })
        // .catch(() => {
        //   this.$dlg.Loading(false);
        // });
    },
    importExcelByRow(row) {
      this.selectRow = row;
    },
    async importExcel() {
      //导入
      this.$dlg.Loading("数据导入中...");
      let params = {
        cmpId: this.form.cmpOrgId,
        yearId: this.form.yearId,
        bmGroup:
          this.selectRow !== undefined ? this.selectRow.bmGroup : undefined,
        bmYear:
          this.selectRow !== undefined ? this.selectRow.bmYear : undefined,
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
      // await bmmnt311Api
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
           const res =  await bmmnt311Api.importExcel(params);
          if (res.code === 0) {
            this.$dlg.showSuccess("导入成功！");
          } else {
            this.$dlg.showError("导入失败, 请检查文件!");
          }
        }
        catch{
            this.$dlg.showError("导入失败, 请检查文件!");
        }
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
      const yearValue = this.form.year instanceof Date
      ? this.form.year.getFullYear()
       : this.form.year;

           console.log(7878787);
       console.log(yearValue);
  
      if (!yearValue) {
        this.$message.error("请选择预算年度！");
        return;
      }
      

      this.crudLoading = true;

      this.crudPage.currentPage =
        resetPage === true ? 1 : this.crudPage.currentPage;
      let params = Object.assign(this.form, {
        PageSize: this.crudPage.pageSize,
        PageNumber: this.crudPage.currentPage,
        cmpId: this.form.cmpOrgId,
        // nextYear: this.year,
        nextYear: yearValue,
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        bmOrgType: this.form.orgType,
        dataVer: this.form.dataVer,
      });
    //   await bmmnt311Api
    //     .query(params)
    //     .then((res) => {
    //       if (res.data.code === 0) {
    //         let data = res.data.result;
    //         this.crudData = data.tableData;
    //         this.crudPage.total = data.total;
    //         this.crudPage.pageSize = data.pageSize;
    //       } else {
    //         this.$dlg.showError("查询失败！");
    //       }
    //     })
    //     .catch(() => {
    //       this.crudLoading = false;
    //     });

    //   this.crudLoading = false;
    // },
      console.log("bmmnt31111111  ");
       const res =   await bmmnt311Api.query(params)
       console.log(2222222222);
       
      //  console.log(res);
       
       
       
        // .then((res) => {
          if (res.code === 0) {
            let data = res.result;
            this.crudData = data.tableData;
            this.crudPage.total = data.total;
            this.crudPage.pageSize = data.pageSize;
          } else {
            this.$dlg.showError("查询失败！");
          }
        // })
        // .catch(() => {
        //   this.crudLoading = false;
        // });

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
        bmYear: row !== undefined ? row.bmYear : undefined,
      };
      this.$confirm("确定要确认选择的资料？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          bmmnt311Api.approve(params).then((res) => {
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
