<template>
  <basic-container class="container">
    <div class="pic" v-if="permission">
      <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm004</div>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="抽取审款生成采购单" />
        <el-step class="step" title="联营商新增采购单" />
        <el-step class="step" title="供货商确认采购单" />
        <el-step class="step" title="联营商下采购单" />
        <el-step class="step" title="聚水潭采购流程" />
        <el-step class="step" title="采购完成" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <div class="pic" v-else>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="真维斯审款通过" />
        <el-step class="step" title="选款网站选款" />
        <el-step class="step" title="大投生成采购单" />
        <el-step class="step" title="供货商确认采购单" />
        <el-step class="step" title="大投下采购单" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <el-dialog v-model="imgstate"  title="流程图" style="width: 850px; height: 700px; text-align: center;">
      <img style="width: 800px; height: 550px;" width="100%" :src="permission ? shoppingpic : DTshoppingpic" alt >
    </el-dialog>
    <div class="pending">
      <mybottons>
        <!-- <div style="margin-left: 30px;margin-top:10px;margin-bottom:10px"> -->
        <!-- <el-button type="primary" v-if="btn_query" @click="query">查询</el-button> -->
        <!-- <el-button type="primary" v-if="btn_dataExport2" :disabled="!btn_dataExport2"
          @click="dataExport">抽取审款生成采购单</el-button> -->
          <el-button type="primary" @click="query()">{{ $t(`Action.Query`) }}</el-button>
          <el-button type="primary" v-if="btn_dataExport2" :disabled="!btn_dataExport2"
          @click="exportData">抽取审款生成采购单</el-button>
        <!-- <el-button type="primary" v-if="btn_dataExport" :disabled="!btn_dataExport" @click="dataExport">导出采购单</el-button> -->
        <!-- </div> -->
      </mybottons>
      <div class="second-main-container">
        <avue-form :option="formoption" v-model="form">
        </avue-form>
      </div>
      <div class="second-main-container">
        <!-- <avue-crud v-model="table" ref="crud" :table-loading="tableLoading" :option="tableOption" :data="crudTableData"
          :page="page" @current-change="currentChange"
          @size-change="sizeChange" @selection-change="selectionChange" v-horizontal-scroll="'always'">
        </avue-crud> -->
        <avue-crud v-model="table" ref="crud" :table-loading="tableLoading" :option="tableOption" :data="crudTableData"
            :page="page" @current-change="currentChange"
            @size-change="sizeChange" @selection-change="selectionChange" v-horizontal-scroll="'always'">
        </avue-crud>
      </div>
      <!-- <avue-crud v-model="table" ref="crud" :table-loading="tableLoading" :option="tableOption" :data="crudTableData"
      :page="page" @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange">
    </avue-crud> -->
    </div>
  </basic-container>
</template>

<script setup>
import { excel } from '@/utils/excelExport';
import { dataExport2, querySupplierList, querylist,dataExport3 } from '@/views/po1/po1mnt008/index.js';
import {
  findPermission
} from '@/api/commodity';
import { formOption, tOption } from '@/views/po1/po1mnt008/option.js';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import shoppingpic from '@/assets/images/shopping.jpg'
import DTshoppingpic from '@/assets/images/DTshopping.jpg'

const permission = ref(true)  // 区分是供应连true还是智慧供销false

let imgstate = ref(false)
const formoption = ref(formOption)
const form = ref({
  suppliercode: [],
  modified: '' // 或 null，取决于日期类型
});
const tableOption = ref(tOption)
const table = ref([])
const tableLoading = ref(false)
//如果遇到选择框多选功能在我单选的时候，前端样式显示全部都被勾选，但内容实则还是只选择了我勾选的那一个的问题时，检查一下是不是数据列表缺少id字段或者id字段为空。
const tableSelections = ref([])
const crudTableData = ref([])
const page = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
});

const btn_query = ref(true)
const btn_dataExport = ref(true)
const btn_dataExport2 = ref(true)

function findpermission() {
  findPermission().then(res => {
    permission.value = (res.data == '1')
  })
}

const query = () => {
  if (form.value.suppliercode.length == 0) {
    ElMessage.warning('请选择联营商！')
    return;
  }
  var loading = ElLoading.service({ fullscreen: true })
  querylist(form.value).then(res => {
    console.log('查询的结果',res);
    if(res.code == ""){
      crudTableData.value = res.data
    }
  }).catch(e => {
    loading.close();
   })
  .finally(() => {
    loading.close();
  })

}
const dataExport = () => {
  if (form.value.suppliercode.length == 0) {
    ElMessage.warning('请选择联营商！')
    return;
  }
  var loading = ElLoading.service({ fullscreen: true })
  dataExport2(form.value).then(res => {
    console.log("导出结果", res)
    if (res.message == 'success') {
      ElMessage.success("导入成功！");
    }else if(res.message == 'notallsuccess'){
      ElMessage.warning("部分导入失败！");
      var base64 = res.data.base64
      excel.excelExport(res.data.fileName, base64, ".xlsx");
    }else{
      var base64 = res.data.base64
      // 调用导出
      excel.excelExport(res.data.fileName, base64, ".xlsx");
    }
  }).catch((error) => {
    ElMessage.error(error);
  }).finally(() => {
    loading.close();
  });
}

const exportData = () => {
  // if (form.value.suppliercode.length == 0) {
  //   ElMessage.warning('请选择联营商！')
  //   return;
  // }
  let con = true
  let ids = []
  console.log("选择的数据",tableSelections.value)
  tableSelections.value.forEach(i => {
    if(i.errmsg != null && i.errmsg != ""){
      ElMessage.warning('未完善的数据无法生成采购单')
      con = false;
    }else{
      ids.push(i.itemno)
    }
  })
  if (!con) {
    //判断是否有误，是否需要继续走下去
    return;
  }
  var loading = ElLoading.service({ fullscreen: true })
  let paras = {
    // form:form.value,
    list:tableSelections.value,
    ids:ids
  }
  dataExport3(paras).then(res => {
    console.log("导出结果", res)
    if (res.message == 'success') {
      ElMessage.success("导入成功！");
    }else if(res.message == 'notallsuccess'){
      ElMessage.warning("部分导入失败！");
      var base64 = res.data.base64
      excel.excelExport(res.data.fileName, base64, ".xlsx");
    }else{
      var base64 = res.data.base64
      // 调用导出
      excel.excelExport(res.data.fileName, base64, ".xlsx");
    }
  }).catch((error) => {
    ElMessage.error(error);
  }).finally(() => {
    query()
    loading.close();
  });
}

const selectionChange = (val) => {
  console.log('选择的数据',tableSelections.value,val);
  tableSelections.value = val
}
const currentChange = (val) => {
  page.currentPage = val
}
const sizeChange = (val) => {
  page.pageSize = val
}

onMounted(() => {
  findpermission()
  // 初始化代码
  // querySupplierList().then((res) => {
  //   console.log('联营商数据',res,formoption.value.column[0]);
  //   formoption.value.column[0].dicData = res.data;
  // }).catch(() => {
  //   formoption.value.column[0].dicData = [];
  // });
});



</script>

<style lang="scss" scoped>
.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container {
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

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin: 24px;
  // margin-left:24px;
}

:deep(.avue-crud__tip-button){
  border:0
}

.pic{
  width: 100%; 
  height:50px; 
  display: flex; 
  justify-content: end;
  // padding: 16px;
  // margin: 24px;
  // margin-top: 0;
  // padding-top: 0;
  .steps{
    max-width: 400px;
  }
}

:deep(.el-step__title){
  font-size:small;
  line-height: normal;
  width:60px;
}

:deep(.el-form-item--default .el-form-item__label) {
    height: 33px;
    line-height: 32px;
}
</style>