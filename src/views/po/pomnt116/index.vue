<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm008</div>
  <div class="pending">
  <!-- <basic-container> -->
    <mybottons>
    <!-- <el-row span="12"> -->
      <el-button

        type="primary"
        @click="query()"
      >
        {{ $t(`Action.Query`) }}
      </el-button>
      <el-button

        type="primary"
        @click="dataImport()"
      >
        {{ $t(`Action.Import`) }}
      </el-button>
      <!-- <el-button

        type="primary"
        @click="cancel()"
      >
        取消上架
      </el-button> -->
      <el-button

        type="primary"
        @click="showExportDialog()"
      >
        {{ $t(`Action.Export`) }}
      </el-button>
    <!-- </el-row> -->
    <div style="margin: 0px 0px 10px 0px"></div>
    </mybottons>

  <div class="second-main-container">
    <avue-form
      class="pomnt116_avuefrom_query"
      :option="queryFormOption"
      v-model="queryFormData"
      ref="queryForm"
    ></avue-form>

    <div class="midcontainer">
    <div>
      <div class="color-description">
        <i class="el-icon-star-on"></i>
        <span>试销款</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #32CD32;"
        ></div>
        <span>已通过</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #caebca;"
        ></div>
        <span>部分通过</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #E6A23C;"
        ></div>
        <span>未通过</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #dd6e6e;"
        ></div>
        <span>超出时间</span>
      </div>
    </div>
  </div>

    <avue-crud
      ref="pomnt116crud"
      style="margin-top: 15px"
      :option="crudTableOption"
      v-model="crudTable"
      :data="crudTableData"
      :page="crudPage"
      :table-loading="crudTableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
      :before-open="beforeopen"
      :before-close="handleSimpleClose"
      v-horizontal-scroll="'always'"
    >
      <template
      #menu="{ row}"
      >
        <!-- <el-button
          type="primary"
          icon="el-icon-check"
          text
          :size="size"
          v-if="(row.state !== '2' && btn_check1 && row.qualitycheckstate != '4')"
          @click="check1(row)"
        >检测报告</el-button> -->



        <!-- <el-button
          type="primary"
          icon="el-icon-check"
          text
          :size="size"
          v-if="(row.state !== '2' && btn_check3 && row.stockcheckstate != '6')"
          @click="check3(row)"
        >查货</el-button> -->
        <!-- <el-button
          type="primary"
          icon="el-icon-check"
          text
          :size="size"
          v-if="row.state !== '2' && btn_check2 && row.itemofptstate != '8'"
          @click="check2(row)"
        >款号对应</el-button> -->

      </template>
    </avue-crud>
  </div>

  <!-- </div> -->
    <el-dialog
      :title="'导入'"
      v-model="importDialogVisible"
      :before-close="importDialogBeforeClose"
      @open="importDialogBeforeOpen()"
      width="50%"
    >
    <Upload drag ref='importUpload' multiple :action="uploadUrl" :limit="1" :maxSize="20"
          :accept="'.xls,.xlsx'" :on-remove="importhandleDelete" :file-list="importFileList"
          :fileList="importFileList" @getfileId="getfileId"
          @delfileId="delfileId">
          <el-icon><el-icon-upload /></el-icon>
          <div class="el-upload__text">
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传xlsx,xls文件,且不超过10M
            </div>
          </template>
        </Upload>
      <!-- <Sysfile-Upload
        :multiple="true"
        :limit="1"
        :maxSize="5"
        :fileList="importFileList"
        :auto-upload="true"
        :accept="'.xls,.xlsx'"
        :subPath="subPath"
        :on-remove="importhandleDelete"
        ref="importUpload"
      ></Sysfile-Upload> -->
      <span

        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dowmloadTemplate()"
        >{{
            $t(`Action.DownloadTemplate`)
          }}</el-button>
        <el-button
          type="primary"
          @click="importSubmit"
          v-loading.fullscreen.lock="Loading"
        >确定导入</el-button>
        <el-button @click="importCancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导出选项"
      v-model="exportDialogVisable"
      :before-close="exportDialogBeforeClose"
      width="30%"
    >
      <avue-form
        :option="exportDialogOption"
        v-model="exportDialogForm"
        ref="exportDialog"
      ></avue-form>
      <span

        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="exportOk()"
        >确认</el-button>
        <el-button @click="exportClose">关 闭</el-button>
      </span>
    </el-dialog>
  <!-- </basic-container> -->
  </div>
  </basic-container>
</template>

<script>
 import { queryData,
  dataExportApi,
  getUserByPoNo,
  ADD,
  queryvw_bs_brand_GBM,
  downLoadTemplate,
} from "@/views/po/pomnt116/index.js";
import { mapGetters } from "vuex";
import { queryFormOption, tableOption } from "@/views/po/pomnt116/option.js";
import {excel} from '@/utils/excelExport'

export default {
  name: "pomnt116",

  data() {
    return {
      Loading:false,
      btn_query: false,
      btn_add: false,
      btn_cancel: false,
      btn_export: false,
      btn_check1: false,
      btn_check2: false,
      btn_check3: false,

      queryFormOption: queryFormOption,
      queryFormData: {},
      tableLoading: false,
      crudTableData: [],
      crudTable: {},
      fileidList:[],
      selectiondate: [],
      crudTableOption: tableOption,
      crudPage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200, 500, 1000],
      },
      crudTableLoading: false,
      stateDict: [],

      //新增导入对话框
      importDialogVisible: false,
      importFileList: [],
      alterFileList: [],

      subPath: "attachment/itemQualityCheck/" ,
      exportDialogVisable: false,
      exportDialogForm: { incImage: true },
      exportDialogOption: {
        submitBtn: false,
        emptyBtn: false,
        menuBtn: false,
        label: "是否导出选项",
      },
    };
  },

  created() {
    this.initData();
    // this.btn_query = this.permission["Pomnt116_query"] || false;
    // this.btn_add = this.permission["Pomnt116_add"] || false;
    // this.btn_cancel = this.permission["Pomnt116_cancel"] || false;
    // this.btn_export = this.permission["Pomnt116_export"] || false;
    this.btn_check1 = true;
    this.btn_check2 = true;
    this.btn_check3 = true;
  },

  methods: {
    // 基础功能

    initData() {
       var ss=["orgdata","itemPrefix","placeid"]


        let params = {
        dataSource:"orgdata",
         radio: false,
         addTitle: false,

      }
      let params2 = {
        dataSource: "itemPrefix",
         radio: false,
         addTitle: false,

      }
      let params3 = {
        dataSource: "placeid",
         radio: false,
         addTitle: false,

      }
      console.log("非尼替");
      queryvw_bs_brand_GBM(params)
        .then((res) => {
          console.log("非尼替111");
          console.log(res);
          console.log(JSON.stringify(res));
          const data = res.data.orgdata;
          this.queryFormOption.column[3].dicData=data


        })

        queryvw_bs_brand_GBM(params2)
        .then((res) => {
          console.log("非尼替11122");
          console.log(res);
          console.log(JSON.stringify(res));
          const data = res.data.itemPrefix;
          this.queryFormOption.column[4].dicData=data


        })
        queryvw_bs_brand_GBM(params3)
        .then((res) => {
          console.log("非尼替11133");
          console.log(res);
          console.log(JSON.stringify(res));
          const data = res.data.placeid;
          this.queryFormOption.column[5].dicData=data



        })





    },

    // form功能

    /**
     * @title 查询
     *
     */
    async query() {
      this.selectiondate = "";
      this.crudTableLoading = true;

      let itemcode = this.queryFormData.itemCode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }



      console.log( this.queryFormData.orgId);
      let params = {
        PageSize: this.crudPage.pageSize,
        PageNumber: this.crudPage.currentPage,
        applyNo: this.queryFormData.applyNo,
        orgId: this.queryFormData.orgId,
        state: this.queryFormData.state,
        upshelfDateRange: this.queryFormData.upshelfDateRange,
        bndId: this.queryFormData.bndId,
        depId: this.queryFormData.depId,
        itemcode: itemcode,
        itemcodelist: itemcodelist,
        placeId: this.queryFormData.placeId,
        testitemstockrange: this.queryFormData.testitemstockrange,
        testitemstockday: this.queryFormData.testitemstockday,
      };

      if (
        params.state.find((el) => el === "1") !== undefined &&
        params.state.find((el) => el === "3") === undefined
      ) {
        params.state.push("3");
      }

      console.log(params);
      // await pomnt116Api
      queryData(params)
        .then((res) => {
          console.log(res);
          console.log(JSON.stringify(res));
          const data = res.data.pageSize;
            this.crudPage.total =res.data.total;
            this.crudTableData = res.data.tableData;
            this.crudTableLoading = false;
          // if (res.data.code === "OK") {
          //   console.log(1);
            
          // } else {
          //   this.$dlg.showError("查询失败！请检查查询条件");
          // }
        })
        .catch(() => {
          console.log("error");
        });
    },

    /**
     * @title 新增
     *
     */

    dataImport() {
      console.log("导入")
      this.importDialogVisible = true;
    },

    importDialogBeforeOpen() {
      this.importfileList = [];
      this.alterFileList = [];
    },

    async importDialogBeforeClose(done) {
      if (this.alterFileList.length !== 0) {
        //非保存关闭,回滚上传文件
        let params = {
          alterFileList: this.alterFileList,
        };
        await pomnt116Api
          .delFile(params)
          .then((res) => {
            let state = res.data.code;
            if (state == "") {
              console.log("deletetempSuccess");
            } else {
              console.log("deletetempfailure");
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
      this.importfileList = [];
      done();
    },

    showExportDialog() {
      console.log(111);
      this.exportDialogVisable = true;
    },

    exportClose() {
      this.exportDialogVisable = false;
    },

    exportDialogBeforeClose(done) {
      this.exportDialogVisable = false;
      done();
    },
    exportOk() {
      this.dataExport();
      this.exportDialogVisable = false;
    },

    async dowmloadTemplate() {
     // this.$dlg.Loading("正在下载...");
      //await pomnt116Api.
      
      let params = {
       
      };
      downLoadTemplate(params).then((res) => {
        let base64 = res.data.base64;
           excel.excelExport( res.data.fileName,  res.data.base64, '.xlsx')
       // this.$dlg.showMessage("下载成功！");
       // let base64 = res.data.result.base64;
        // 调用导出
        // this.$excel.excelExport(res.data.result.fileName, base64, ".xlsx");
        // this.$dlg.Loading(false);
      });
    },

    async importSubmit() {
/*
      if (!this.$refs.importUpload.isAllFileUploaded()) {
        this.$dlg.showMessage("文件上传中，尚未全部上传完成，请稍后重新尝试！");
        return;
      }

      if (this.importFileList.length <= 0) {
        this.$dlg.showMessage("未有任何上传的文件！");
        return;
      }

      let fileId = this.importFileList[0].fileId;
*/

      if (this.fileidList.length <= 0) {
        ElMessage.warning("未有任何上传的文件！");
        return;
      }

      
      
      
      console.log(this.fileidList);
      let fileId = this.fileidList[0];

      // this.$dlg.Loading("导入中...");
      this.Loading = true;
      let params = {
        fileId: fileId,
      };
      console.log(params);
       ADD(params)
        .then((res) => {
          console.log("base64",res);
          // if (res.code != 0) {
            let data = res.data.base64;
            if (data == undefined ) {
              this.Loading = false
              // this.$dlg.showSuccess("导入成功！");
              this.importDialogVisible = false
              this.query();
              ElMessage.success("导入成功");
            } else {
              // 调用导出
              console.log("base64",res.data);
              ElMessage.warning("导入完成，有数据错误产生！");
              let base64 = res.data.base64;
              excel.excelExport("错误信息",  res.data.base64, '.xlsx')
              this.importDialogVisible = false
              // this.$dlg.showMessage("导入完成，有数据错误产生！");
              // this.$excel.excelExport("错误信息", data, ".xlsx");
            }
            this.fileidList = [];
            this.importFileList = [];
            // this.$dlg.Loading(false);
            this.Loading = false
          // } else {
          //   ElMessage.warning("导入失败！请检查Excel表");
          //   // this.$dlg.showError("导入失败！请检查Excel表。");
          // }
        })
        .catch((e) => {
          console.log("error",e);
          this.Loading = false;
        });

      this.importFileList = [];
      this.importDialogVisible = false; //关闭Dialog
      this.query();
    },
    importCancel() {
      this.importDialogVisible = false; //关闭Dialog
    },

    async importhandleDelete(file) {
      await this.importfileList.forEach(async (item) => {
        await axios
          .delete("/sys/file/delete", { params: { fileId: item.fileId } })
          .then((res) => {
            console.log("success", res);
          })
          .catch((res) => {
            console.log("error", res);
          });
      });
    },
    async dataExport() {
      console.log("11111",);
      if (Object.keys(this.selectiondate).length === 0) {
        this.$message.warning("导出前请选择要导出的数据");
        return;
      }
      let applynoList = [];
      let applynoString = "";
      console.log("长度为", this.selectiondate.length);
      for (var i = 0; i < this.selectiondate.length; i++) {
        applynoList.push(this.selectiondate[i].applyno);
      }
      applynoString = applynoList.join(",");
      console.log(applynoString);
      console.log("选中的数据啊", this.selectiondate);
      // this.$dlg.Loading("数据导出中...");
      let selection = [];
      let selection_item = [];
      let str_selection_item = "";
      this.selectiondate.forEach((e) => {
        //selection.push(e.id);
        selection_item.push(e.itemcode);
      });

      str_selection_item = selection_item.join(",");
      selection_item = str_selection_item.split(/[,\n ]/);
      let itemcode = this.queryFormData.itemCode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      let params = {
        //selection: selection,
        upshelfDateRange: this.queryFormData.upshelfDateRange,
        itemcode: itemcode,
        itemcodelist: itemcodelist,
        selection_item: selection_item,
        applynoList: applynoList,
        qualitycheckstate: this.queryFormData.qualitycheckstate,
        orgId: this.queryFormData.orgId,
        bndId: this.queryFormData.bndId,
        depId: this.queryFormData.depId,
        state: this.queryFormData.state,
        placeId: this.queryFormData.placeId,
      };
      // await pomnt116Api
      dataExportApi(params)
        .then(async (res) => {
          ElMessage.success("导出成功");
          console.log('导出',res);
           let base64 = res.data.base64;
           excel.excelExport( res.data.fileName,  res.data.base64, '.xlsx')
            // 调用导出

          // if (res.data.code === 0) {

          // }
        })
        .catch(() => {
          ElMessage.success("导出错误");
          // this.$dlg.Loading(false);
          // this.$dlg.showError("导出错误");
        });
      // this.$dlg.Loading(false);
    },

    /**
     * @title 取消上架
     *
     */
    async cancel() {
      let selection = [];
      this.selectiondate.forEach((e) => {
        selection.push(e.itemcode);
      });

      let itemcodelist = selection.join(",");
      localStorage.setItem("itemcode201", itemcodelist);
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: "审款上架维护",
          src: "/po/pomnt201",
        }),
      });
    },

    // crud功能

    /**
     * @title 检测报告
     *
     */
    check1(row) {
      localStorage.setItem("itemcode007", row.itemcode);
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: "自检报告上传/审核",
          src: "/po/Pomnt007",
        }),
      });
    },

    /**
     * @title 款号对应
     *
     */
    check2(row) {
      localStorage.setItem("itemcode117", row.itemcode);
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: "平台商品信息维护",
          src: "/po/Pomnt117",
        }),
      });
    },

    /**
     * @title 查货
     *
     */
    async check3(row) {
      let params = {
        applyNo: row.applyno,
        itemcode: row.itemcode,
      };
      console.log(params);
      // await pomnt116Api
        getUserByPoNo(params)
        .then((res) => {
          getUserByPoNo(res)
          if (res.data.code === "") {
            let userId = res.data.result.userId;
            // window.open(
            //   "http://tradingerp.gsitcloud.com/APP/?user=" +
            //     userId +
            //     "&licstatus=true&applyNo=" +
            //     row.applyno +
            //     "&itemcode=" +
            //     row.itemcode
            // );
            // window.open('http://172.20.41.23:8090/#/?user=' + userId +'&licstatus=true&applyNo=' + row.applyno + '&itemcode=' + row.itemcode)
          }
        })
        .catch(() => {
          console.log("error");
        });
    },

    /**
     * @title 改变每页记录数
     *
     **/
    async sizeChange(val) {
      this.crudPage.currentPage = 1;
      this.crudPage.pageSize = val;
      await this.query();
    },

    /**
     * @title 换页
     *
     **/
    async currentChange(val) {
      this.crudPage.currentPage = val;
      await this.query();
    },

    /**
     * @title 复选框选中
     *
     */
    selectionChange(list) {
      if (list.length > 0) {
        this.selectiondate = list;
        this.del_state = false;
      } else {
        this.del_state = true;
        this.selectiondate = [];
      }
    },

    /**
     * @title 打开窗口
     *
     */
    beforeopen(done, type) {
      done();
    },

    /**
     * @title 关闭窗口
     *
     */
    handleSimpleClose(done) {
      done();
    },
     getfileId (val, name) {
    this.fileidList.push(val)
  // batchFileList.value.push(val)
  console.log("getfileId", this.fileidList)
},


 delfileId  (val)  {

  this.fileidList = val
  console.log("delfileId", this.fileidList)
}


  },
  watch: {},
  computed: {
    ...mapGetters(["elements", "permission", "userInfo"]),
  },
  mounted() {},
};
</script>

<style scoped>
:deep(.avue-crud__header) {
  display: none;
}
.color-description {
  margin-left: 30px;
  float: left;
}

.color-box {
  width: 30px;
  height: 20px;
  display: inline-block;
  margin-right: 10px;
}

.description {
  font-size: 16px;
  display: inline-block;
  vertical-align: middle;
}

:deep(.avue-crud__tip-button){
  border:0
}

</style>
<style>
.pomnt116_avuefrom_query .avue-form__group > * {
  height: 35px;
}
.pomnt116_avuefrom_query .avue-group__item {
  margin-top: 0px;
}
.pomnt116_avuefrom_query > .el-form > .el-row > .el-col {
  display: none;
}

</style>
<style lang="scss" scoped>

.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container{
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;
  .el-form .el-form-item {
    margin-bottom: 0px;
  }
  box-shadow: $shadow-1;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin:24px;
  // margin-left:24px;
}

.midcontainer{
  // padding:.4rem;
  display: flex;
  justify-content: center;
  width: 100%;
  // padding-top: 16px;
}

// .userStyle {
//   padding: 20px;
//   margin-top: 20px;
//   background-color: #FFFFFF;
//   .newPhone {
//     width: 100%;
//     height: 40px;
//     line-height: 40px;
//     padding: 0 15px;
//     border-radius: 4px;
//     border: 1px solid #dcdfe6;
//     cursor: text;
//   }
// }
// .container {
//     display: flex;
//     flex-direction: column;
//   }
</style>
