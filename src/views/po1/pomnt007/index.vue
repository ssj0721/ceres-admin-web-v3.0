<template>
  <basic-container class="container">
  <div class="pending">
    <mybottons>
    <!-- <el-row span="12" style="margin-left: 100px;margin-top: 10px"> -->
      <el-button type="primary" @click="query">查詢</el-button>
      <el-button type="primary" @click="exportExcels">导出</el-button>
    <!-- </el-row> -->
  </mybottons>
    <div style="margin: 0px 0px 10px 0px"></div>
    <div class="second-main-container">
    <avue-form :option="formOption" v-model="form"></avue-form>
    <avue-crud ref="crud" style="margin-top: 15px" :option="option" v-model="table" :data="data" :page="page"
      :table-loading="tableLoading" @size-change="sizeChange" @current-change="currentChange" 
      @selection-change="selectionChange" v-horizontal-scroll="'always'">
    </avue-crud>
    </div>
  </div>
  </basic-container>
</template>

<script setup>
import { excel } from '@/utils/excelExport';
import {
  exportExcel,
  queryCmpKey,
  queryShopList,
  querySuppliername,
  queryVendorList,
  querylist
} from '@/views/po1/pomnt007/index.js';
import {
  fOption,
  tableOption,
} from '@/views/po1/pomnt007/option.js';
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const props = defineProps({
  pl_no: {
    type: Object,
  },
});
const form = ref({});
const formOption = ref(fOption);
const tableLoading = ref(false);
const data = ref([]);
const table = ref({});
const selection = ref([]);
const MAXSL = ref("");
const option = reactive(tableOption);
let page = ref({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
});
const uploadData = reactive({});
const crudTable = reactive([]);
const textts = ref("");

const elements = computed(() => store.getters.elements);
const permission = computed(() => store.getters.permission);

onMounted(() => {
  // 初始化代码
  queryCmpKey({}).then((res) => {
    formOption.value.column[0].dicData = res.data.result.tableData;
  });
});

watch(() => form.value.CmpKey, (val) => {
  if (val != null && val != "") {
    console.log('val', val);
    const params = {
      cmpkey: val
    };
    querySuppliername(params).then((res) => {
      console.log('供应商', res);
      if (res.data.code === 0) {
        formOption.value.column[1].dicData = res.data.result.tableData;
        console.log('this.formOption.value.column[1].dicData', formOption.value.column[1].dicData);
      }
    });
  }
});

watch(() => form.value.SupplierCode, (val) => {
  console.log('this.formOption.value.column', formOption.value.column, val);
  if (val != null && val != "") {
    console.log('val', val);
    const params = {
      suppliercode: val
    };
    const params2 = {
      suppliercode: val,
      cmpkey: form.value.CmpKey
    };
    queryVendorList(params).then((res) => {
      console.log('获取供货商的res', res);
      if (res.data.code === 0) {
        formOption.value.column[2].dicData = res.data.result.tableData;
        form.value.VendorCode = [...res.data.result.tableData.map(item => item.id)];
        console.log('this.formOption.value.column[2].dicData', formOption.value.column[2].dicData, form.value.VendorCode);
      }
    });
    queryShopList(params2).then((res) => {
      console.log('获取网店的res', res);
      if (res.data.code === 0) {
        formOption.value.column[3].dicData = res.data.result.tableData;
        form.value.ShopCode = [...res.data.result.tableData.map(item => item.id)];
        console.log('this.formOption.value.column[3].dicData', formOption.value.column[3].dicData, form.value.ShopCode);
      }
    });
  }
});

watch(() => form.value.SalesDeadlineDate, (val) => {
  form.value.QueryDate2 = val;
});

watch(() => form.value.QueryDate1, (val) => {
  form.value.RealQueryDate1 = val;
  console.log('类型', typeof form.value.RealQueryDate1, typeof val);
});
function sizeChange(val) {
  page.value.currentPage = 1;
  page.value.pageSize = val;
  query();
};

function currentChange(val) {
  console.log('页数变了',val);
  page.value.currentPage = val;
  query();
};

function query() {

  if (form.value.CmpKey.length == 0) {
    return ElMessage.error("公司不能为空");
  }
  if (form.value.SupplierCode.length == 0) {
    return ElMessage.error("供应商不能为空");
  }
  if (form.value.VendorCode.length == 0) {
    return ElMessage.error("供货商不能为空");
  }
  if (form.value.ShopCode.length == 0) {
    return ElMessage.error("网店不能为空");
  }
  if (form.value.SalesDeadlineDate == "") {
    return ElMessage.error("销售截数日期不能为空");
  }
  if (form.value.QueryDate1 == "") {
    return ElMessage.error("累计开始日期不能为空");
  }
  if (form.value.RealQueryDate1 == "") {
    return ElMessage.error("累计实际开始日期不能为空");
  }
  if (form.value.QueryDate2 == "") {
    return ElMessage.error("累计时段结束不能为空");
  }
  if (form.value.buHuoJianYi === "") {
    return ElMessage.error("补货建议不能为空");
  }
  if (form.value.UserType === "") {
    return ElMessage.error("数据类型不能為空");
  }
  const params = {
    PageSize: page.value.pageSize,
    PageNumber: page.value.currentPage,
    form: form.value,
  };
  console.log("查询的params", params);
  tableLoading.value = true;
  querylist(params).then((response) => {
    console.log("查询的res---------", response);
    data.value = response.data.list;
    page.value.total = response.data.total;
    // page.value.pageSize = page.pageSize;
    // page.value.currentPage = page.currentPage;
    console.log('page',page.value);
    tableLoading.value = false;
  });
};

function selectionChange(list) {
  if (list.length > 0) {
    selection.value = list;
    console.log(selection.value);
    console.log("sss" + selection.value);
  }
};

function exportExcels() {
  if (selection.value.length === 0) {
    return ElMessage.error("未选择需要导出的数据");
  }
  selection.value.forEach(s => {
    s.salesdeadlinedate = form.value.SalesDeadlineDate;
  });
  const params = {
    list: selection.value,
    SalesDeadlineDate: form.value.SalesDeadlineDate,
    QueryDate1: form.value.QueryDate1,
    QueryDate2: form.value.QueryDate2
  };
  tableLoading.value = true;
  console.log('导出的参数',params);
  exportExcel(params)
    .then((res) => {
      console.log('导出的结果', res);
      const base64 = res.data.result.base64;
      // 调用导出
      excel.excelExport(res.data.result.fileName, base64, ".xls");
      ElMessage.success("导出成功！");
      tableLoading.value = false;
    })
    .catch((e) => {
      console.log('导出错误', e);
      ElMessage.error("导出错误！");
      tableLoading.value = false;
    })
}
</script>

<style lang="scss">
.dc {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
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
//   padding-top: 16px;
}

.button{
    // margin-top: 16px;
}

:deep(.avue-crud__tip-button){
  border:0
}
</style>
