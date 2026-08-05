<template>
  <basic-container class="container">
    <mybottons :show-list="['check', 'export']" @handleCheck="query(1)" @handleExport="dataExport()">
      <el-button type="primary" class="custom-button" @click="dataImport()">导入到采购单</el-button>
      <el-button type="primary" class="custom-button" @click="selectsSupporter()">
        编辑供应商
      </el-button>
    </mybottons>
    <div class="second-main-container">
      <avue-form v-model="form" :option="formOption" />
      <avue-crud
        ref="crud"
        v-model="table"
        class="transparent-border"
        style="padding: 0 32px;"
        :option="option"
        :data="data"
        :page="page"
        :resizable="true"
        :table-loading="tableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-dblclick="dbClick"
        @selection-change="selectionChange"
      >
        <template #pictureaddr="{ row }">
          <el-image
            :src="`https://iretail.gsitcloud.com/esp/${row.pictureaddr}`"
            :preview-src-list="[`https://iretail.gsitcloud.com/esp/${row.pictureaddr}`]"
            style="width: 100px; height: 70px"
            fit="contain"
            preview-teleported="true"
          /></template>
        <template #menu="{ row, index, size, type }">
          <el-button type="primary" class="custom-button" @click="dbClick(row)">
            查看详情
          </el-button>
        </template>
      </avue-crud>
    </div>
    <!--供应商编辑-->
    <el-dialog v-model="supplierTable" width="30%" @close="onCloseDialog">
      <el-table :data="spData" border style="width: 100%; font-size: 14px; color: #333">
        <el-table-column prop="styleNo" label="款号" align="center" />
        <el-table-column prop="supporter" label="供应商" align="center">
          <template #default="{ row }">
            <el-select
              v-model="row.supporter"
              clearable
              placeholder="请选择供应商"
              size="small"
              filterable
              @change="onChangeSupplier(row)"
            >
              <el-option
                v-for="option in supplierForm"
                :key="option.prop"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <br /><br />
      <div class="save-cancel-buttons">
        <el-button type="primary" class="custom-button" @click="quitSelect()">取 消</el-button>
        <el-button type="primary" class="custom-button" @click="submitSupport()">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="详情页" center fullscreen :modal="false" class="fixed-dialog">
      <el-row span="12">
        <el-button type="primary" class="custom-button" style="margin-top:3rem;" @click="close()">
          关闭
        </el-button>
      </el-row>
      <br />
      <el-row>
        <avue-form ref="form" v-model="form2" :option="formOption2" />
      </el-row>
      <el-row class="footder">
        <el-tabs v-model="activeName" width="100%" class="bottom-tab" type="border-card">
          <el-tab-pane label="合同" name="A">
            <avue-crud
              v-model="table22"
              style="margin-top: 15px"
              :option="option22"
              :summary-method="summaryMethod22"
              :data="data22"
            />
          </el-tab-pane>
          <el-tab-pane label="实际到仓期" name="B">
            <avue-crud
              v-model="table2"
              style="margin-top: 15px"
              :option="option2"
              :summary-method="summaryMethod"
              :data="data2"
            />
          </el-tab-pane>
          <el-tab-pane label="国标码" name="C">
            <avue-crud v-model="gbTable" :option="gbTableOption" :data="gbData" />
          </el-tab-pane>
          <el-tab-pane label="上下架日期" name="D">
            <avue-crud v-model="table3" :option="option3" :data="data3" />
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  fninit,
  queryapi,
  dataExport,
  dataImport,
  queryRuCan,
  queryUDJia,
  getGbCodeByItem,
  itemdtlquery3,
  querySupporter,
  updateSupporter,
  loadSupplier,
} from '@/api/jwscontract';
import {
  tableOption,
  formOption,
  formOption2,
  tableOption2,
  tableOption22,
  tableOption3,
  gbTableOption,
  supperForm,
} from '@/views/ows/jwscontract/option.js';
// import { v1 } from 'uuid';
import * as XLSX from 'xlsx';
import { ElLoading, ElMessage } from 'element-plus';
import { excel } from '@/utils/excelExport'

export default {
  data () {
    return {
      activeName: 'A',
      dialogVisible: false,
      form: {},
      form2: {},
      formOption: formOption,
      formOption2: formOption2,
      tableLoading: false,
      data: [],
      table: {},
      option: tableOption,
      data2: [],
      data22: [],
      table2: {},
      table22: {},
      option2: tableOption2,
      option22: tableOption22,
      gbData: [], // 款号对应国标数据
      gbTableOption: gbTableOption,
      gbTable: {}, // 国标表绑定数据
      data3: [],
      table3: {},
      option3: tableOption3,
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      selectList: [], // 存储选中的数据行
      // 供应商
      supperForm: supperForm,
      supplierTable: false,
      supplierForm: [], // 初始化供应回显列表
      spData: [], // 存储选择了复选框的数据
      spIdData: [], // 存储选中的供应商id
      filteredData: [], // 用于存储过滤后的数据
      loadingInstance: null,
    };
  },

  async created () {
    // 初始化
    // 获取字典
    fninit().then((res) => {
      // 品牌初始化
      this.formOption.column[0].dicData = res.data;
    });
    let params = {
      pageSize: this.page.pageSize,
      page: this.page.currentPage,
    };
    this.tableLoading = true;
    const respose = await queryapi(params);
    // this.data = respose.data.tableData;
    this.data = respose.data.tableData.map(item => {
      // 保留 origpri 两位小数
      item.origpri = parseFloat(item.origpri).toFixed(2);
      return item;
    });
    this.page.total = respose.data.total;
    this.page.pageSize = respose.data.pageSize;
    console.log(this.data);
    this.data.forEach((item) => {
      item.styleNo = item.styleNo.trim();
    });
    this.fetchSuppliers(); // 加载下拉框数据
    await this.getSupporter();
    this.tableLoading = false;
  },
  methods: {
    async getSupporter () {
      const resData = await querySupporter();
      const supportData = resData.data;
      if (this.data.length > 0 && this.data[0].supportName) return;
      this.data = this.data.map((item) => {
        const supportName = supportData.find(
          (item2) => item2.styleNo === item.styleNo
        );
        return {
          ...item,
          supportName: supportName ? supportName.supporter : '',
        };
      });
      console.log('执行1');
      console.log(this.data);
    },
    sizeChange (val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.query();
    },
    currentChange (val) {
      this.page.currentPage = val;
      this.query();
    },
    async query (i) {
      if (i) {
        this.page.currentPage = 1;
      }
      let styleNo = this.form.styleNo;
      let styleNolist = styleNo.split(/[,\n ]/);
      if (styleNolist.length > 1) {
        styleNo = undefined;
      } else {
        styleNolist = [];
      }
      let params = {
        pageSize: this.page.pageSize,
        page: this.page.currentPage,
        form: this.form,
        styleNolist: styleNolist,
      };
      this.tableLoading = true;
      queryapi(params).then((respose) => {
        // this.data = respose.data.tableData;
        this.data = respose.data.tableData.map(item => {
          // 保留 origpri 两位小数
          item.origpri = parseFloat(item.origpri).toFixed(2);
          return item;
        });
        this.page.total = respose.data.total;
        this.page.pageSize = respose.data.pageSize;
        this.data.forEach((item) => {
          item.styleNo = item.styleNo.trim();
        });
        this.getSupporter();
        this.tableLoading = false;
      });
    },
    selectsSupporter () {
      let styleNos = this.selectList
        .filter((item) => item.orderNo)
        .map((item) => item.styleNo)
        .join(',');
      if (styleNos.length > 0) {
        return this.$message.warning(
          `订单号${styleNos}已存在采购单,无法修改供应商,请重新选择!`
        );
      }
      if (this.selectList.length > 0) {
        this.selectList.forEach((row) => {
          this.spData.push({
            styleNo: row.styleNo,
            supporter: row.supportName,
            supporterId: row.id,
          });
          this.supplierTable = true;
        });
      } else {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning',
        });
      }
    },
    onCloseDialog () {
      this.spData.forEach((row) => {
        // this.$delete(row, 'editing');
        delete row.editing;
        (this.spData = []);
        (this.supplierTable = false);
      });
    },
    onChangeSupplier (row) {
      let selectedSupplier;
      if (row.supporter) {
        selectedSupplier = this.supplierForm.find(
          (option) => option.label === row.supporter
        );
      }
      if (selectedSupplier) {
        row.supporterId = selectedSupplier.prop;
      } else {
        row.supporter = null;
        row.supporterId = null;
      }
    },
    async fetchSuppliers () {
      try {
        const response = await loadSupplier();
        this.supplierForm = response.data.map((item) => {
          return {
            label: item.shop_name,
            prop: item.shop_id,
          };
        });
      } catch (error) {
        console.error('Failed to fetch suppliers', error);
      }
    },
    async submitSupport () {
      try {
        await Promise.all(
          this.spData.map((row) =>
            updateSupporter(row).finally(() => {
              delete row.editing;
            })
          )
        );
        // 假设 updateSupporter 返回的结果是一个对象，包含 code 字段
        const response = await Promise.all(this.spData.map(row => updateSupporter(row)));
        const success = response.every(res => res.code === ''); // 检查所有响应的 code

        if (success) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
        } else {
          this.$message({
            message: '部分或全部修改失败，请检查数据后重试。',
            type: 'error',
          });
        }
      } catch (error) {
        console.error('更新失败: ', error);
        this.$message({
          message: '请求失败，请检查网络或服务器状态。',
          type: 'error',
        });
      }
      this.query();
      this.supplierTable = false;
    },
    quitSelect () {
      this.spData = [];
      this.supplierTable = false;
    },
    async dbClick (row) {
      this.activeName = 'A';
      this.dialogVisible = true;
      this.form2 = row;
      let params = {
        bndId: row.bndId,
        itemcode: row.styleNo.trim(),
      };
      // 合同tab部分
      let params3 = {
        bndId: row.bndId,
        styleNo: row.styleNo.trim(),
      };
      await itemdtlquery3(params3).then((res) => {
        let uniqueSizIds = res.data.sizeSort;
        this.option22.column[2].children = uniqueSizIds.map((e) => {
          return {
            label: e.trim(),
            prop: e.trim(),
            align: 'left',
            type: 'number',
            width: 80,
          };
        });
        let colId;
        let createdate;
        let i = -1;
        this.data22 = [];
        res.data.itemdtlquery.forEach((e, index) => {
          if (!index || e.col_id !== colId || e.createdate !== createdate) {
            i++;
            this.data22.push({
              createdate: e.createdate,
              [e.siz_id]: e.qty || 0,
              colId: e.col_id + '-' + e.name20,
              sizQty: e.qty || 0,
            });
            createdate = e.createdate;
            colId = e.col_id;
          } else {
            // this.$set(this.data22[i], e.sizId, e.qty || 0);
            this.data22[i][e.siz_id] = e.qty || 0;
            this.data22[i].sizQty += Number(e.qty) || 0;
          }
        });
      });
      queryRuCan(params).then((respose) => {
        let uniqueSizIds = respose.data.sizeSort;
        this.option2.column[3].children = uniqueSizIds.map((e) => {
          return {
            label: e.trim(),
            prop: e.trim(),
            align: 'left',
            type: 'number',
            width: 80,
          };
        });
        let colId;
        let actualDaoCanDate;
        let i = -1;
        this.data2 = [];
        respose.data.list.forEach((e, index) => {
          const currentActualDaoCanDate = JSON.stringify(e.actualDaoCanDate) === '{}' ? '' : e.actualDaoCanDate;
          if (!index || e.colId !== colId || JSON.stringify(e.actualDaoCanDate) !== JSON.stringify(actualDaoCanDate)) {
            console.log('kkk', currentActualDaoCanDate)
            i++;
            this.data2.push({
              actualDaoCanDate: currentActualDaoCanDate,
              [e.sizId]: e.qty || 0,
              colId: e.colId + '-' + e.name20,
              sizQty: e.qty || 0,
            });
            actualDaoCanDate = e.actualDaoCanDate;
            colId = e.colId;
          } else {
            // this.$set(this.data2[i], e.sizId, e.qty || 0);
            this.data2[i][e.sizId] = e.qty || 0;
            this.data2[i].sizQty += Number(e.qty) || 0;
          }
        });
      });
      let params2 = {
        itemcode: row.styleNo.trim(),
      };
      queryUDJia(params2).then((respose) => {
        this.data3 = respose.data;
      });
      this.getGb(row);
    },
    selectionChange (list) {
      const promises = list.map((item) => {
        return new Promise((resolve) => {
          querySupporter()
            .then((response) => {
              const matchedRecord = response.data.find(
                (record) => record.styleNo === item.styleNo
              );
              item.id = matchedRecord ? matchedRecord.id : null;
              resolve(item);
            })
            .catch(() => {
              resolve(item);
            });
        });
      });
      Promise.all(promises)
        .then((updatedList) => {
          this.selectList = updatedList;
          console.log('selectList数据:', this.selectList);
        })
        .catch((error) => {
          console.error('获取id时发生错误:', error);
        });
    },
    async dataExport () {
      this.loadingInstance = ElLoading.service({ text: '数据导出中...' });
      let selection = this.selectList.map(e => e.itmseq);
      let params = {};
      let styleNolist = this.form.styleNo.split(/[,\n ]/);
      if (styleNolist.length > 1) {
        params = {
          selection: selection,
          form: this.form,
          styleNo: this.form.styleNo,
          styleNolist: styleNolist,
        };
      } else {
        params = {
          selection: selection,
          form: this.form,
          styleNo: this.form.styleNo,
        };
      }
      await dataExport(params)
        .then(async (res) => {
          if (res.data.code === 0) {
            let base64 = res.data.result.base64;
            await excel.excelExport(
              res.data.result.fileName,
              base64,
              '.xlsx'
            );
            this.loadingInstance.service.success('导出成功');
          }
        })
        .catch(() => {
          this.loadingInstance.close();
          this.loadingInstance.service.error('导出失败');
        });
      this.loadingInstance.close();
    },
    dataImport () {
      if (this.selectList.length === 0) {
        ElMessage('请勾选数据！');
        return;
      }
      this.loadingInstance = ElLoading.service({ text: '数据导入中...' });
      let styleNos = this.selectList
        .filter((item) => item.orderNo)
        .map((item) => item.styleNo)
        .join(',');
      if (styleNos.length > 0) {
        this.$confirm(`订单号${styleNos}已存在采购单,是否要覆盖?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.dataImport2();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            });
            this.loadingInstance.close();
          });
      } else {
        this.dataImport2();
      }
    },
    dataImport2 () {
      let selectedList1 = this.selectList.map((item) => ({
        goodsname: item.name60,
        suppliername: item.supplierName,
        suppliercode: item.supplierId.trim(),
        vendorname: item.supportName,
        itemno: item.styleNo.trim(),
        orderno: item.orderNo,
        orderstatus: '0',
        ordertype: 0,
        color: '',
        size: '',
      }));
      let paras = {
        list: selectedList1,
      };
      dataImport(paras)
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.result.base64;
            if (data === undefined) {
              ElMessage({
                message: '导入成功！',
                type: 'success',
              })
              this.query();
            } else {
              ElMessage('导入完成，有数据错误产生！.');
              excel.excelExport(res.data.result.fileName, data, '.xlsx');
            }
          } else {
            ElMessage.error('导入失败！请检查Excel表。');
          }
          this.loadingInstance.close();
        })
        .catch(() => {
          console.log('error');
          this.loadingInstance.close();
        });
    },
    close () {
      this.dialogVisible = false;
    },
    summaryMethod ({ columns, data }) {
      let sums = [];
      let sum = 0;
      columns.forEach((column, index) => {
        if (index >= 3 && column.property) {
          sums[index] = data.reduce((acc, item) => acc + (Number(item[column.property]) || 0), 0);
          sum += sums[index];
        }
      });
      sums[2] = '合计: ' + sum;
      return sums;
    },
    summaryMethod22 ({ columns, data }) {
      let sums = [];
      let sum = 0;
      columns.forEach((column, index) => {
        if (index >= 3 && column.property) {
          sums[index] = data.reduce((acc, item) => acc + (Number(item[column.property]) || 0), 0);
          sum += sums[index];
        }
      });
      sums[2] = '合计: ' + sum;
      return sums;
    },
    async getGb (row) {
      let params = {
        itemcode: row.styleNo.trim(),
      };
      const response = await getGbCodeByItem(params);
      this.gbData = response.data;
      console.log('款号对应国标码数据', response.data);
    },
  },
};
</script>

<style scoped lang="scss">
.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* 表格美化 */
.bottom-tab {
  width: 100vw;
}

:deep(.el-dialog .el-dialog__header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
:deep(.transparent-border .el-table) {
  border-radius: $border-radius-medium;
  border: 1px solid #dcdcdc;
}

/* 保留行的边框，设置列的边框为透明 */
:deep(.transparent-border .el-table .el-table__body tr) {
  border: none;
  /* 确保行的边框不受影响 */
}

:deep(.transparent-border .el-table .el-table__body td) {
  border-right: 1px solid transparent;
  /* 设置列的右边框为透明 */
}

:deep(.transparent-border .el-table .el-table__body td:last-child) {
  border-right: none;
  /* 最后一列不需要右边框 */
}
.second-main-container{
  width: 95%;
  background: $neutral-color-1;
  padding: 0 32px;
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
</style>