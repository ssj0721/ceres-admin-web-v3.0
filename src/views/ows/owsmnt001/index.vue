<template>
  <basic-container class="container">
    <mybottons :show-list="['check', 'export']" @handleCheck="query(1)" @handleExport="dataExport()" />
    <div class="second-main-container">
      <!-- <el-button type="primary" plain @click="query(1)">查询</el-button>
            <el-button type="primary" plain @click="dataExport()">导出EXCEl</el-button> -->
      <el-select v-model="value" placeholder="请选择" style="margin-left: 10px; width: 300px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div style="margin: 0px 0px 10px 0px"></div>
      <avue-form ref="form" v-model="queryFormData" :option="formOption" />
      <avue-crud
        ref="crud"
        v-model="crudTableRow"
        style="margin-top: 15px; padding: 0 32px;"
        :option="option"
        :data="crudTableData"
        :page="crudTablePage"
        :table-loading="crudTableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </basic-container>
</template>

<script>
import {
  packOption,
  packTableOption,
  purchaseinOption,
  purchaseinTableOption,
} from '@/views/ows/owsmnt001/option.js';
import { getStock, getInStock, dataExport, getStock2, getInStock2 } from '@/api/owsmnt001'
import { excel } from '@/utils/excelExport'
export default {
  name: '',
  components: {},
  props: [''],

  data () {
    return {
      formOption: packOption,
      option: packTableOption,
      options: [
        {
          value: '0',
          label: '库存',
        },
        {
          value: '1',
          label: '入库',
        },
      ],
      value: '0',
      queryFormData: {},
      crudTableRow: {},
      crudTableData: [],
      crudTablePage: {
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
        currentPage: 1,
        pageSize: 10,
      },
      crudTableLoading: false,
    }
  },
  computed: {},
  watch: {
    value: {
      handler (val) {
        this.$refs.form.resetForm();
        // 清空数据
        this.crudTableData = [];
        this.queryFormData = {};

        // 更新配置
        if (val === '0') {
          this.option = packTableOption;
          this.formOption = packOption;
        } else if (val === '1') {
          this.option = purchaseinTableOption;
          this.formOption = purchaseinOption;
        }
        // 重新查询
        this.query(1);
      },
    },
  },
  methods: {

    sizeChange (val) {
      this.crudTablePage.currentPage = 1;
      this.crudTablePage.pageSize = val;
      this.query();
    },
    currentChange (val) {
      this.crudTablePage.currentPage = val;
      this.query();
    },
    async query (index) {
      this.crudTableLoading = true;
      let params = {};
      console.log('当前的type', this.value)
      if (this.value === '0') {
        params = Object.assign(
          params,
          JSON.parse(JSON.stringify(this.queryFormData)),
          {
            sku2: this.queryFormData.sku,
            type: this.value,
            pageSize: this.crudTablePage.pageSize,
            page: index || this.crudTablePage.currentPage,
          }
        );
        await getStock(params).then((res) => {
          const data = res.data;
          this.crudTablePage.total = data.total;
          this.crudTableData = data.list;
        });
        this.crudTableLoading = false;
      } else {
        params = Object.assign(
          params,
          JSON.parse(JSON.stringify(this.queryFormData)),
          {
            ...(this.queryFormData.io_date ? {
              date1: this.queryFormData.io_date[0],
              date2: this.queryFormData.io_date[1],
            } : {}),
            sku2: this.queryFormData.sku,
            type: this.value,
            pageSize: this.crudTablePage.pageSize,
            page: index || this.crudTablePage.currentPage,
          }
        );
        await getInStock(params).then((res) => {
          const data = res.data;
          this.crudTablePage.total = data.total;
          this.crudTableData = data.list;
        });
        this.crudTableLoading = false;
      }
    },
    async dataExport () {
      console.log("export")
      if (this.crudTableData.length === 0) return this.$message.warning('请查询数据');
      this.loadingInstance = ElLoading.service({ text: '数据导出中...' });
      let crudTableData;
      let params = {};
      if (this.value === '0') {
        params = Object.assign(
          params,
          JSON.parse(JSON.stringify(this.queryFormData)),
          {
            sku2: this.queryFormData.sku,
            type: this.value,
          }
        );
        console.log("导出前的参数", params)
        await getStock2(params).then((res) => {
          crudTableData = res.data;
          console.log("导出的数据", crudTableData)
        });
      } else {
        params = Object.assign(
          params,
          JSON.parse(JSON.stringify(this.queryFormData)),
          {
            ...(this.queryFormData.io_date ? {
              date1: this.queryFormData.io_date[0],
              date2: this.queryFormData.io_date[1],
            } : {}),
            sku2: this.queryFormData.sku,
            type: this.value,
          }
        );
        await getInStock2(params).then((res) => {
          crudTableData = res.data;
        });
      }
      let params2 = {
        data: crudTableData,
        value: this.value
      };

      await dataExport(params2)
        .then(async (res) => {
          let base64 = res.data;
          // console.log(res.data)
          const name = res.name;
          await excel.excelExport(
            name,
            base64,
            '.xlsx'
          );
          // this.$dlg.showSuccess('导出成功！');
          this.loadingInstance.service.success('导出成功');
          this.loadingInstance.close();
        })
        .catch(() => {
          // this.loadingInstance.close();
          this.loadingInstance.close();
          this.loadingInstance.service.error('导出失败');
          // this.$dlg.showError('导出错误');
        });
      if (this.loadingInstance) {
        this.loadingInstance.close();
      }
    },
  }

}
</script>

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
</style>