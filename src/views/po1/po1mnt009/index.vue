<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm007</div>
    <div class="pending">
      <mybottons>
        <el-button type="primary" @click="exporBuyExcell">
          采购单导出
        </el-button>
        <el-button type="primary" @click="exportRepairExcell()">
          补货单导出
        </el-button>
      </mybottons>
      <!-- <div style="margin: 0px 0px 10px 0px"></div> -->
      <div class="second-main-container">
        <avue-form :option="queryFormOption" v-model="queryFormData" ref="queryForm">
        </avue-form>
      </div>
    </div>
  </basic-container>
</template>
  
<script setup>
import { excel } from "@/utils/excelExport";
import { exporBuyExcel, exportRepairExcel } from "@/views/po1/po1mnt009/index";
import { ElLoading, ElMessage } from "element-plus";
import { getCurrentInstance, ref } from "vue";

const instance = getCurrentInstance(); // 获取当前组件实例
const dateutil = instance.appContext.config.globalProperties.$dateutil;  // 访问全局属性

const queryFormOption = ref({
  emptyBtn: false,
  submitBtn: false,
  menuBtn: false,
  labelWidth: 120,
  column: [
    {
      label: "下单日期",
      prop: "daterange",
      span: 10,
      component: "datePicker",
      props: {
        fromDate: dateutil.curdatenear(-7),
        toDate: dateutil.curdate(),
        clearable: true
      },
    }
  ],
})
const queryFormData = ref({})

const exporBuyExcell = async () => {

  let params = {
    daterange: queryFormData.value.daterange

  };
  var loading = ElLoading.service({ fullscreen: true })
  await exporBuyExcel(params)
    .then((res) => {
      let base64 = res.data.base64;
      // 调用导出
      excel.excelExport(res.data.fileName, base64, ".xlsx");
      loading.close();
      ElMessage.success("导出成功！");
    }).catch(() => {
      ElMessage.error("导出失败！");
    }).finally(() => { loading.close() });
}
const exportRepairExcell = async () => {

  let params = {
    daterange: queryFormData.value.daterange

  };
  var loading = ElLoading.service({ fullscreen: true })
  await exportRepairExcel(params)
    .then((res) => {
      let base64 = res.data.base64;
      // 调用导出
      excel.excelExport(res.data.fileName, base64, ".xlsx");
      ElMessage.success("导出成功！");
    })
    .catch(() => {
      ElMessage.error("导出失败！");
    }).finally(() => {
      loading.close();
    });
}
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
</style>