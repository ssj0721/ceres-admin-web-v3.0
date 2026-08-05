<!--
  bmmnt357 - 分系列购货预算(BP)
 -->
<template>
  <basic-container>
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm026</div>
    <el-row :gutter="5" style="margin-bottom: 10px">
      <el-col :span="1.5">
          <el-button v-if="permissions.query" type="primary" @click="queryList(true)">{{ $t(`Action.Query`)
        }}</el-button></el-col>
      <el-col :span="1.5">
         <el-button v-if="btn_split" type="primary" @click="split()">分拆</el-button>
      </el-col>
      <el-col :span="1.5">
         <el-button v-if="permissions.export" type="primary" @click="exportExcel()">{{ $t(`Action.Export`) }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <!--
        <xvue-file-import :config="excelConfig">
          <el-button v-if="btn_import" slot="button" type="primary">{{
            $t(`Action.Import`)
          }}</el-button>
        </xvue-file-import>
      -->
        <el-button v-if="btn_import" @click="importExcel()" type="primary">{{
          $t(`Action.Import`)
        }}</el-button>
      </el-col>
      <el-col>
        <file-upload-dialog :title="文件上传" :visible.sync="visible" :fileList.sync="uploadFileList" :subPath="subPath"
          limit="10" maxSize="50" accept=".xls,.xlsx" @visible-change="onVisibleChange" @confirm="onConfirm"
          @cancel="cancel" @close="close">
        </file-upload-dialog>
      </el-col>
    </el-row>
    <el-row>
      <avue-form :option="formOption" v-model="form" ref="form"> </avue-form>
    </el-row>

    <avue-crud ref="crud" v-model="crudModel" :option="crudOption" :data="crudData" :page="crudPage"
      :table-loading="crudLoading" @selection-change="crudSelectionChange" @current-change="crudCurrentChange"
      @size-change="crudSizeChange">
      <!--
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-check" size="mini" type="text" v-if="false && permissions.approve"
          @click="approve(scope.row)">确认</el-button>
        <el-button icon="el-icon-download" size="mini" type="text" v-if="permissions.export"
          @click="exportExcel(scope.row)">导出</el-button>
      </template>
    -->
    </avue-crud>
  </basic-container>
</template>

<script>
import { bmmnt357Api } from "@/views/buget/bmmnt357/index.js";
import { mapGetters } from "vuex";

export default {
  name: "bmmnt357",
  data() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // 月份从 0 开始计数，所以加 1，同时用 padStart 方法补零至两位
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');    
    return {
      subPath: "bm/tmp/bmmnt357" + year + month, //存储路径
      uploadFileList: [],
      visible: false,
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
        bmYeasea: undefined,
        supplierIdList: undefined,
        eshopTypeList: undefined,
        orgType: undefined,
        brandIdList: undefined,
        catIdList: undefined,
      },

      formOption: {
        emptyBtn: false,
        submitBtn: false,
        labelWidth: 120,
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
            label: "预算季度",
            prop: "bmYeasea",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              api: "queryYeasea@retail.bm.bmcommon",
              radio: true,
              items:
                new Date().getFullYear() * 10 +
                Math.floor((new Date().getMonth() + 3) / 3),
            },
            rules: [
              {
                required: true,
                message: "预算季度不能为空",
              },
            ],
          },
          {
            label: "对比前年季度",
            prop: "bmCompareYeasea",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              api: "queryYeasea@retail.bm.bmcommon",
              radio: true,
              items:
                (new Date().getFullYear()-2) * 10 +
                Math.floor((new Date().getMonth() + 3) / 3),
            },
            rules: [
              {
                required: true,
                message: "预算季度不能为空",
              },
            ],
          },
          {
            label: "品牌",
            prop: "brandIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              //checkall: false,
              filterable: true,
              //radio: true,
              //firstItems: true,
              api: "queryPrdBrand@retail.sys.comSelect",
            },
          },
          {
            label: "品类",
            prop: "catIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              //checkall: false,
              filterable: true,
              //radio: true,
              //firstItems: true,
              api: "queryPrdCategory@retail.sys.comSelect",
            },
          },
          {
            label: "联营商",
            prop: "supplierIdList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              //filterable: true,
              //checkall: false,
              filterable: true,
              //radio: true,
              //firstItems: true,
              api: "querySupplier@retail.bm.bgmcommon",
            },
          },
          {
            label: "平台",
            prop: "eshopTypeList",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              //checkall: false,
              filterable: true,
              //radio: true,
              //firstItems: true,
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
              api: "querySysDictData@retail.sys.comSelect",
              params: { type: "biz.bgm.orgtype" },
            },
          },

          {
            label: "其他选项",
            prop: "options",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              radio: false,
              dicData: [
                {
                  name: "覆盖分拆",
                  id: "OVERWRITE_SPLIT",
                },
              ],
            },
            //valueDefault: ["OVERWRITE_SPLIT"],
          },

          /*
          {
            label: "其他选项",
            prop: "initoprations",
            span: 8,
            component: "iRetailDroplistControl",
            props: {
              radio: false,
              dicData: [
                {
                  name: "初始化导出",
                  id: "init",
                },
              ],
            },
            valueDefault: [],
          },
          */
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
        menu: false,
        menuWidth: 240,
        height: 280,
        labelWidth: 120,
        indexLabel: "序号",
        indexWidth: 60,
        column: [
          {
            label: "预算公司",
            prop: "cmpname",
            span: 12,
          },
          {
            label: "预算年份",
            prop: "bmYear",
            span: 12,
          },
          {
            label: "预算月份",
            prop: "bmMonth",
            span: 12,
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
            prop: "supplierName",
            span: 12,
          },
          {
            label: "平台",
            prop: "eshopDesc",
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
            width: 120,
          },
          {
            label: "提交人",
            prop: "modifier",
            span: 12,
            width: 80,
          },
        ],
      },
      options: [],
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
    this.$viewUtil.initView(this, "bmmnt357", "split");
    this.initData();
    const local = localStorage.getItem("userInfo");
        // const local1 = localStorage.getItem("iRetailPermission");
    if (local) {
      this.userInfo = JSON.parse(local);
    }
  },
  mounted() { },
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
      return (
        this.permissions.import &&
        this.userInfo.organize.league === (this.form.orgType === "PNR")
      );
    },

    btn_split() {
      return (
        this.permissions.split &&
        this.userInfo.organize.league === (this.form.orgType === "PNR")
      );
    },
  },
  watch: {
    isReady: function (val) {
      if (val) {
        // 表格文件导入调用上传事件
        this.importExcel();
      }
    },
  },
  methods: {

    initData() { },
    async exportExcel(row) {
      let params = {};
      if (this.form.bmYeasea === undefined) {
        this.$message.error("请选择预算季度！");
        return;
      }
      if (this.form.bmCompareYeasea === undefined) {
        this.$message.error("请选择对比前年季度！");
        return;
      }
      if (this.form.brandIdList === undefined || this.form.brandIdList.length > 1) {
        this.$message.error("导出时请选择品牌并只能选择一个！");
        return;
      }

      if (this.form.catIdList === undefined || this.form.catIdList.length > 1) {
        this.$message.error("导出时请选择品类并只能选择一个！");
        return;
      }

      if (this.form.supplierIdList === undefined || this.form.supplierIdList.length > 1) {
        this.$message.error("导出时请选择联营商并只能选择一个！");
        return;
      }

      if (this.form.eshopTypeList === undefined || this.form.eshopTypeList.length > 1) {
        this.$message.error("导出时请选择平台并只能选择一个！");
        return;
      }

      let init = false;

      /*
      let index = this.form.initoprations.indexOf("init");

      if (index !== -1) {
        init = true;

      }
      */


      /*
      this.options = [];
      if (this.form.yearmonth.getMonth() + 1 == 2 || this.form.yearmonth.getMonth() + 1 == 8) {
        this.options = ["TWO_SEA"]
      }
      */


      if (row == undefined) {
        params = {
          cmpOrgId: this.form.cmpOrgId,
          bmYeasea: this.form.bmYeasea,
          bmCompareYeasea: this.form.bmCompareYeasea,
          brandIdList: this.form.brandIdList,
          catIdList: this.form.catIdList,
          supplierIdList: this.form.supplierIdList,
          eshopTypeList: this.form.eshopTypeList,
          bmOrgType: this.form.orgType,
          //options: this.options,

          init: init,
        };
      } else {
        params = {
          cmpOrgId: this.form.cmpOrgId,
          bmOrgType: this.form.orgType,
          bmYeasea: this.form.bmYeasea,
          bmCompareYeasea: this.form.bmCompareYeasea,
          //options: this.options,

          //init: init,

          /*
          selectList: [
            {
              bm_orgType: row.bmOrgtype,
              cmp_id: row.cmpId,
              supplier_id: row.supplierId,
              eshop_type: row.eshopType,
              bm_year: row.bmYear,
              bm_month: row.bmMonth,
              prd_bnd_id: row.prdBndId,
              prd_cat_id: row.prdCatId,
            },
            
          ],
          */
        };
      }

      this.$dlg.Loading("正在导出...");
      // bmmnt357Api
      //   .exportExcel(params)
      //   .then((res) => {
      //     this.$dlg.Loading(false);
      //     if (res.data.code === 0) {
      //       let fileId = res.data.result.fileId;
      //       // 调用导出
      //       this.$httputil.downloadFile(fileId, res.data.result.fileName, true);
      //       let msg =
      //         "导出模板成功！"
      //       this.$dlg.success(msg);
      //     }
      //   })
      //   .catch((res) => {
      //     this.$dlg.error("导出失败！", res);
      //     console.log("导出异常", res);
      //     this.$dlg.Loading(false);
      //   });
      const res =   await bmmnt357Api.exportExcel(params)
      if (res.code === 0) {
        this.$dlg.Loading(false);
            let fileId = res.result.fileId;
            // 调用导出
            this.$httputil.downloadFile(fileId, res.result.fileName, true);
            let msg =
              "导出模板成功！"
            this.$dlg.success(msg);
          }else {
            this.$dlg.error("导出失败！", res);
          console.log("导出异常", res);
          this.$dlg.Loading(false);
          }
    },

    async importExcel() {
      this.visible = true
    },

    async onVisibleChange(fileList, visiable) {
      console.log("onVisibleChange", fileList, visiable);

      if (fileList == null || fileList == [] || JSON.stringify(fileList) == "[]")
        return
      fileList.forEach((item) => {
        axios
          .delete("/sys/file/delete", { params: { fileId: item.fileId } })
          .then((res) => {
            console.log("success", res);
          })
          .catch((res) => {
            console.log("error", res);
          });
      });
      fileList = [];

    },

    async onConfirm(fileList) {
      console.log("onConfirm", fileList);
      if (fileList == null || fileList == [] || JSON.stringify(fileList) == "[]") {
        this.$message.error("请选择导入文件！");
        return
      }

      this.$dlg.Loading("数据导入中...");
      let params = {
        cmpOrgId: this.form.cmpOrgId,
        bmOrgType: this.form.orgType,
        //options: this.options,
        file: fileList
      };
      // await bmmnt357Api
      //   .importExcel(params)
      //   .then((res) => {
      //     if (res.data.code === 0) {
      //       let msg = "";
      //       if (
      //         res.data.result.errsheet !== undefined &&
      //         res.data.result.errsheet !== ""
      //       ) {
      //         msg = `部分导入成功！<font color="red"><br>以下工作表的预算占比分配异常未导入(占比汇总超100%或占比有负数)，请检查再导入：<br>${res.data.result.errsheet}<font>`;
      //       } else {
      //         msg = `导入成功！`;
      //       }
      //       this.$dlg.success(`${msg}`);
      //     } else {
      //       this.$dlg.error("导入失败, 请检查文件!");
      //     }
      //   })
      //   .catch((err) => {
      //     this.$dlg.error("导入失败！", err);
      //   });
      const res = await bmmnt357Api.importExcel(params)
      if (res.code === 0) {
        let msg = "";
            if (
              res.result.errsheet !== undefined &&
              res.result.errsheet !== ""
            ) {
              msg = `部分导入成功！<font color="red"><br>以下工作表的预算占比分配异常未导入(占比汇总超100%或占比有负数)，请检查再导入：<br>${res.data.result.errsheet}<font>`;
            } else {
              msg = `导入成功！`;
            }
            this.$dlg.success(`${msg}`);
          } else {
            this.$dlg.error("导入失败, 请检查文件!");
          }
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
      if (this.form.bmYeasea === undefined) {
        this.$message.error("请选择预算季度！");
        return;
      }
      this.crudLoading = true;

      this.crudPage.currentPage =
        resetPage === true ? 1 : this.crudPage.currentPage;
      /*  
      let params = Object.assign(this.form, {
        bmOrgType: this.form.orgType,
        PageSize: this.crudPage.pageSize,
        PageNumber: this.crudPage.currentPage,
      });
      */

      let params = {
        cmpOrgId: this.form.cmpOrgId,
        bmYeasea: this.form.bmYeasea,
        brandIdList: this.form.brandIdList,
        catIdList: this.form.catIdList,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        bmOrgType: this.form.orgType,
        //options: this.options,

        //init: init,
      };


    //   await bmmnt357Api
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

    const res =   await bmmnt357Api.query(params)
        // .then((res) => {
          if (res.code === 0) {
            let data = res.result;
            this.crudData = data.tableData;
            this.crudPage.total = data.total;
            this.crudPage.pageSize = data.pageSize;
          } else {
            this.$dlg.showError("查询失败！");
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

    async split(row) {
      let params = {};
      if (this.form.bmYeasea === undefined) {
        this.$message.error("请选择预算季度！");
        return;
      }
      if (this.form.bmCompareYeasea === undefined) {
        this.$message.error("请选择对比前年季度！");
        return;
      }
      let init = false;

      this.$dlg.Loading("操作中,请稍后...");
      if (row == undefined) {
        params = {
          cmpOrgId: this.form.cmpOrgId,
          bmYeasea: this.form.bmYeasea,
          bmCompareYeasea: this.form.bmCompareYeasea,
          brandIdList: this.form.brandIdList,
          catIdList: this.form.catIdList,
          supplierIdList: this.form.supplierIdList,
          eshopTypeList: this.form.eshopTypeList,
          bmOrgType: this.form.orgType,
          options: this.form.options,
          //options: this.options,

          init: init,
        };
      } else {
        params = {
          cmpOrgId: this.form.cmpOrgId,
          bmOrgType: this.form.orgType,
          bmYeasea: this.form.bmYeasea,
          bmCompareYeasea: this.form.bmCompareYeasea,
          options: this.form.options,
        };
      }
      // await bmmnt357Api
      //   .split(params)
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
        const res =   await bmmnt357Api.split(params)
        let state = res.code;
        if (state === 0) {
          this.$message.success("操作成功");
          await this.queryList();
        } else {
          this.$message.error("操作失败，错误信息：" + res.msg);
        }
      this.$dlg.Loading(false);
    },

    /*
    async split() {
      this.$dlg.Loading("操作中,请稍后...");
      let params = {
        cmpOrgId: this.form.cmpOrgId,
        yearmonth: this.form.yearmonth,
        supplierIdList: this.form.supplierIdList,
        eshopTypeList: this.form.eshopTypeList,
        bmOrgType: this.form.orgType,
      };
      await bmmnt357Api
        .split(params)
        .then(async (res) => {
          let state = res.data.code;
          if (state === 0) {
            this.$message.success("操作成功");
            await this.queryList();
          } else {
            this.$message.error("操作失败，错误信息：" + res.data.msg);
          }
        })
        .catch((res) => {
          console.log("error", res);
        });
      this.$dlg.Loading(false);
    },
    */
    approve(row) {
      console.log("row", row);
      let params = {
        selectList: [
          {
            bm_orgType: row.bmOrgtype,
            cmp_id: row.cmpId,
            supplier_id: row.supplierId,
            eshop_type: row.eshopType,
            bm_year: row.bmYear,
            bm_month: row.bmMonth,
            prd_bnd_id: row.prdBndId,
            prd_cat_id: row.prdCatId,
          },
        ],
      };
      this.$confirm("确定要确认选择的资料？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          bmmnt357Api.approve(params).then((res) => {
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
