<template>
  <basic-container class="container">
    <mybottons
      :show-list="['check', 'add']"
      @handleCheck="subquery"
      @handleAdd="handleCreate"
    />
    <div class="second-main-container">
      <avue-form ref="form" v-model="formData" :option="option" />
      <avue-crud
        ref="crud"
        v-model="form"
        :option="tableOption"
        :data="list"
        :page="page"
        :table-loading="listLoading"
        :before-close="handleCloseBefore"
        @size-change="handleSizechange"
        @current-change="handleCurrentChange"
      >
        <!-- default-expand-all="false" -->
        <!-- <template #menu-left>
          <el-button :size="btsize" type="primary" @click="subquery">查询</el-button>
          <el-button
            :size="btsize"
            class="filter-item"
            type="primary"
            @click="handleCreate"
            >新增</el-button
          >
        </template> -->
        <template #menu="{ row, index }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(row, index)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row, index)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row, index)"
          >删除</el-button>
        </template>
      </avue-crud>
    </div>
    <el-dialog
      v-model="openDialog"
      fullscreen
      center
      style="height: 100%"
      class="wosmnt004_1 wosmnt004_2"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="收客户退款" name="1">
          <mybottons
            model="1"
            :show-list="['cancel', 'save']"
            @handleSave="saveAll"
            @handleCancel="handleCloseDialog"
          />
          <!-- <el-button
            :size="btsize"
            type="primary"
            @click="saveAll"
            style="margin-bottom: 10px;margin-left: 0.5%;"
            :disabled="viewDialog"
            >保存</el-button
          >
          <el-button
            :size="btsize"
            type="primary"
            @click="handleCloseDialog"
            style="margin-bottom: 10px;margin-left: 0.5%;"
            >关闭</el-button
          > -->
          <avue-form
            ref="form1"
            v-model="dialogFrom"
            :option="dialogOption"
            :disabled="viewDialog"
          >
            <template #returnNo>
              <el-input
                v-model="dialogFrom.returnNo"
                type="text"
                :disabled="viewDialog || dialogOption.column[0].disabled"
                @change="changeReturnNo"
              />
            </template>
          </avue-form>
          <avue-crud
            ref="crud1"
            :option="dialogListOption"
            :data="dialogList"
            :page="dialogPage"
            :table-loading="dialogListLoading"
            :disabled="viewDialog"
            @size-change="handleDialogSizechange"
            @current-change="handleDialogCurrentChange"
            @selection-change="selectionChange"
          >
            <template #menu-left>
              <el-button
                :size="btsize"
                class="filter-item"
                type="primary"
                :disabled="viewDialog"
                @click="addRow"
              >新增</el-button>
              <el-button
                :size="btsize"
                type="danger"
                :disabled="viewDialog"
                @click="deleteRow"
              >删除</el-button>
            </template>
            <template #sku="{ row }">
              <el-input v-model="row.sku" :disabled="viewDialog" />
            </template>
            <template #name="{ row }">
              <el-input v-model="row.name" :disabled="viewDialog" />
            </template>
          </avue-crud>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  formOption,
  tableOption,
  dialogOption,
  dialogListOption,
} from '@/views/ows/owsmnt004/option.js';
import {
  query,
  getByReturnNo,
  getByReturnNo1,
  checkSku,
  save,
  delObj,
} from '@/views/ows/owsmnt004/index.js';
export default {
  name: '',
  components: {},
  props: [''],
  data () {
    return {
      option: formOption,
      dialogOption: dialogOption,
      tableOption: tableOption,
      dialogListOption: dialogListOption,
      formData: {},
      dialogFrom: {}, // 弹窗内部的form
      list: [],
      dialogList: [], // 弹窗内部的list
      listLoading: false,
      dialogListLoading: false,
      form: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 50, 100],
      },
      dialogPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 50, 100],
      },
      btsize: 'middle',
      openDialog: false,
      activeName: '1',
      viewDialog: false,
      selection: [],
    };
  },
  computed: {},
  watch: {},
  mounted () {
    this.initializeFormData();
    this.subquery();
  },
  created () {

  },
  methods: {
    /**
    * @description: 初始化form的数据以便可以开局查询
    */
    initializeFormData () {
      this.formData.sku = this.formData.sku || '';
      this.formData.returnNo = this.formData.returnNo || '';
      this.formData.returnDate = this.formData.returnDate || ['', ''];
    },
    subquery () {
      this.page.currentPage = 1;
      this.query();
    },
    query () {
      let sku = this.formData.sku;

      // 字符串转数组
      let skulist = sku.split(/[,\n ]/);
      console.log(sku);
      skulist = skulist.filter((item) => item.trim() !== '');
      if (skulist.length > 1) {
        sku = undefined;
        // skulist = skulist.join(",");
        // skulist = "('" + skulist.replace(/,/g, "','") + "')";
      } else {
        skulist = undefined;
      }
      let returnNo = this.formData.returnNo;
      let returnNolist = returnNo.split(/[,\n ]/);
      console.log(returnNo);
      returnNolist = returnNolist.filter((item) => item.trim() !== '');
      if (returnNolist.length > 1) {
        returnNo = undefined;
        // returnNolist = returnNolist.join(",");
        // returnNolist = "('" + returnNolist.replace(/,/g, "','") + "')";
      } else {
        returnNolist = undefined;
      }
      this.listLoading = true;
      // let params = this.formData;
      let sdate = this.formData.returnDate[0];
      let edate = this.formData.returnDate[1];
      let ps = Object.assign(
        {
          pageSize: this.page.pageSize,
          page: this.page.currentPage,
        },
        // params,
        {
          sku: sku,
          skulist: skulist,
          returnNo: returnNo,
          returnNolist: returnNolist,
          sdate: sdate,
          edate: edate,
        }
      );
      query(ps).then((res) => {
        console.log(res);
        this.list = res.data.list;
        this.page.total = res.data.total;
        // this.page.pageSize = res.data.result.pageSize;
        this.listLoading = false;
      });
    },
    handleSizechange (size) {
      this.page.pageSize = size;
      // this.query();
    },
    handleDialogSizechange (size) {
      this.dialogPage.pageSize = size;
      this.getByReturnNo();
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage;
      // this.query();
    },
    handleDialogCurrentChange (currentPage) {
      this.dialogPage.currentPage = currentPage;
      this.getByReturnNo();
    },
    handleCreate () {
      this.openDialog = true;
      this.dialogFrom = {};
      //   this.$refs.form1.resetForm();
      this.dialogList = [];
      this.dialogPage.total = 0;
      this.dialogPage.currentPage = 1;
      this.dialogPage.pageSize = 10;
      this.dialogOption.column[0].disabled = false;
    },
    saveRow (done, params) {
      save(params)
        .then(async (res) => {
          if (res.data.msg == 1 || res.data.msg == '1') {
            this.dialogOption.column[0].disabled = true;
            this.subquery();
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000,
            });
            let param = {
              // PageSize: this.page.pageSize,
              // PageNumber: this.page.currentPage,
              returnNo: this.dialogFrom.returnNo,
            };
            getByReturnNo(param).then((res) => {
              this.dialogList = res.data.tableData;
              // this.dialogPage.total = res.data.result.total;
              // this.dialogPage.pageSize = res.data.result.pageSize;
            });
          } else if (res.data.msg == 0 || res.data.msg == '0') {
            this.dialogOption.column[0].disabled = false;
            this.$message.error({
              message: '保存失败',
            });
          }
        })
        .catch((err) => {
          this.dialogOption.column[0].disabled = false;
          this.$message.error({
            message: '保存失败',
          });
        });
    },
    // handleRowUpdate(row, index, done, loading) {
    //   update(this.form)
    //     .then(() => {
    //       this.subquery();
    //       this.$notify({
    //         title: "成功",
    //         message: "修改成功",
    //         type: "success",
    //         duration: 2000,
    //       });
    //       done();
    //       loading();
    //     })
    //     .catch((err) => {
    //       done();
    //       loading();
    //       this.$message.error({
    //         message: "修改失败",
    //       });
    //     });
    // },
    handleView (row, index) {
      this.dialogOption.column[0].disabled = true;
      this.openDialog = true;
      this.viewDialog = true;
      this.dialogFrom = row;
      let params = {
        // PageSize: this.page.pageSize,
        // PageNumber: this.page.currentPage,
        returnNo: row.returnNo,
      };
      getByReturnNo(params).then((res) => {
        this.dialogList = res.data.tableData;
        // this.dialogPage.total = res.data.result.total;
        // this.dialogPage.pageSize = res.data.result.pageSize;
      });
    },
    handleUpdate (row, index) {
      // this.$refs.crud.rowEdit(row, index);
      this.dialogOption.column[0].disabled = true;
      this.openDialog = true;
      this.dialogFrom = row;
      let params = {
        // PageSize: this.page.pageSize,
        // PageNumber: this.page.currentPage,
        returnNo: row.returnNo,
      };
      getByReturnNo(params).then((res) => {
        this.dialogList = res.data.tableData;
        // this.dialogPage.total = res.data.result.total;
        // this.dialogPage.pageSize = res.data.result.pageSize;
      });
    },
    handleDelete (row, index) {
      var _this = this;
      this.$confirm(
        '是否确认删除sku为"' + row.sku + '"' + '的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delObj(Object.assign({}, { id: row.id }));
        })
        .then((res) => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          this.subquery();
        })
        .catch(function () {}); // 这个catch是confirm的catch
    },
    handleCloseBefore () {
      this.dialogOption.column[0].disabled = true;
    },
    handleCloseDialog () {
      this.openDialog = false;
      this.viewDialog = false;
      this.dialogFrom = {};
      this.$refs.form1.resetForm();
      this.dialogList = [];
      this.dialogPage.total = 0;
      this.dialogPage.currentPage = 1;
      this.dialogPage.pageSize = 10;
    },
    selectionChange (selection) {
      this.selection = selection;
    },
    addRow () {
      this.dialogList.push({
        sku: '',
        name: '',
      });
    },
    deleteRow () {
      // 遍历selected数组，从Data数组中删除对应$index的元素
      this.selection.forEach((selectedItem) => {
        const index = this.dialogList.findIndex(
          (item) => item.$index === selectedItem.$index
        );
        if (index !== -1) {
          this.dialogList.splice(index, 1);
        }
      });
      this.selection = [];
      this.$refs.crud1.toggleSelection();
    },
    saveAll () {
      this.$refs.form1.validate((valid, done, msg) => {
        if (valid) {
          for (let i = 0; i < this.dialogList.length; i++) {
            const item = this.dialogList[i];
            // 检查每个字段是否为空字符串、null或未定义
            if (!item.sku || item.sku.trim() === '') {
              done();
              return this.$message.error('请检查下方sku不能为空');
            }
          }
          const skuSet = new Set();
          let result = this.dialogList.some((item) => {
            if (skuSet.has(item.sku)) {
              return true; // 发现重复的sku
            }
            skuSet.add(item.sku);
            return false;
          });
          if (result) {
            done();
            return this.$message.error('发现重复的sku,请检查下方sku是否重复');
          } // 发现重复的sku
          if (this.dialogList.length === 0) {
            done();
            return this.$message.error('请至少添加一条退款记录');
          } // 未添加任何退款记录
          let params = Object.assign({}, this.dialogFrom, {
            tableData: this.dialogList,
          });
          var _this = this;
          let skulist = this.dialogList.map((item) => item.sku);
          checkSku(Object.assign({}, { skulist: skulist })).then(
            async (res) => {
              if (res.data.msg == 0 || res.data.msg == '0') {
                // sku不存在
                this.$confirm('发现有SKU不存在，是否继续保存?', '警告', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                })
                  .then(function () {
                    _this.saveRow(done, params);
                    done();
                  })
                  .catch(function () {
                    done();
                  }); // 这个catch是confirm的catch
              } else if (res.data.msg == 1 || res.data.msg == '1') {
                // sku存在
                this.saveRow(done, params);
                done();
              }
            }
          );
        } else {
          done();
          return;
        }
      });
    },
    changeReturnNo () {
      let params = {
        // PageSize: this.page.pageSize,
        // PageNumber: this.page.currentPage,
        returnNo: this.dialogFrom.returnNo,
      };
      getByReturnNo1(params).then((res) => {
        // this.dialogPage.total = res.data.result.total;
        // this.dialogPage.pageSize = res.data.result.pageSize;
        if (res.data) {
          if (res.data.tableData) {
            this.dialogList = res.data.tableData;
          }
          this.dialogFrom.qty = res.data.qty;
          this.dialogFrom.returnBy = res.data.returnBy;
          this.dialogFrom.returnDate = res.data.returnDate;
          this.dialogFrom.returnReason = res.data.returnReason;
          this.dialogFrom.returnPhone = res.data.returnPhone;
          this.dialogFrom.returnAddress = res.data.returnAddress;
          this.dialogFrom.returnType = res.data.returnType;
          this.dialogFrom.deliverNo = res.data.deliverNo;
        } else {
          this.dialogFrom.qty = null;
          this.dialogFrom.returnBy = null;
          this.dialogFrom.returnDate = null;
          this.dialogFrom.returnReason = null;
          this.dialogFrom.returnPhone = null;
          this.dialogFrom.returnAddress = null;
          this.dialogFrom.returnType = null;
          this.dialogFrom.deliverNo = null;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.second-main-container {
    margin-top: $container-margin;
    width: 95%;
    background: $neutral-color-1;
    display: flex;
    flex-direction: column;
    // margin: $container-margin;
    padding: $container-base-padding-2;
    border-radius: $border-radius-medium;
    box-shadow: $shadow-1;
  }
.wosmnt004 .avue-crud__menu {
  margin-bottom: 15px;
}
.wosmnt004_1 .el-dialog__body {
  padding: 0 !important;
}

.wosmnt004_2 .el-dialog__header {
  padding: 0 !important;
}
</style>
