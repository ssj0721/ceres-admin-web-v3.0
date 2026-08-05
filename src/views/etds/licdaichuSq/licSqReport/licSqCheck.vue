<template>
    <div class="check-container">
      <div class="content-area">
        <ZcDetailForm
          v-model="formData"
          :form-config="formConfig"
          :disabled="licZcStore.disabledGcReport"
        />
      </div>
    </div>
  </template>
  <script setup>
  import { computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { licSqCheckFormOption } from "./option";
  import ZcDetailForm from "@/components/etds/ZcDetailsForm.vue";
  import { useLicZcStore } from "@/stores/licZcStore";
  import { ElMessage } from "element-plus";
  import { watch } from "vue";
  const route = useRoute();
  const licZcStore = useLicZcStore();
  
  // 判断是否是新增模式
  const isAdd = computed(() => route.query.mode === "add");
  
  // 判断是否已送审
  const isSubmitted = computed(
    () => licZcStore.checkFormData?.sconfirm === "已送审"
  );
  
  // 表单数据使用store中的computed
  const formData = computed({
    get: () => licZcStore.checkFormData,
    set: (val) => licZcStore.updateCheckForm(val),
  });
  
  // 动态生成表单配置
  const formConfig = computed(() => {
    const config = { ...licSqCheckFormOption };
  
    // 根据不同状态设置字段的禁用状态
    config.columns = config.columns.map((col) => {
      const newCol = { ...col };
  
      // 新增模式下可编辑的字段
      if (isAdd.value) {
        if (["bc_pono", "lic_type", "bc_date", "batchNo"].includes(col.prop)) {
          newCol.disabled = false;
        }
      } else {
        // 编辑模式下
        if (isSubmitted.value) {
          // 已送审状态下全部禁用
          newCol.disabled = true;
        } else {
          // 未送审状态下部分字段可编辑
          if (["bc_date", "batchNo"].includes(col.prop)) {
            newCol.disabled = false;
          } else {
            newCol.disabled = true;
          }
        }
      }
  
      // 某些字段始终禁用
      if (["state", "bc_num"].includes(col.prop)) {
        newCol.disabled = true;
      }
  
      return newCol;
    });
  
    return config;
  });
  
  // 初始化数据
  async function initData() {
    try {
      const mode = route.query.mode;
      if (mode === "add") {
        // 新增模式，初始化空数据
        await licZcStore.initEmptyState();
      } else {
        // 编辑模式，获取已有数据
        await licZcStore.initAllData();
      }
      // 如果是工厂报告，所有表单配置项的disabled为true
    } catch (error) {
      console.error("初始化数据失败:", error);
      ElMessage.error("初始化数据失败");
    }
  }
  
  // 验证款号格式
  const validatePoNo = (poNo) => {
    const pattern = /^[0-9a-zA-Z]{2}-[0-9][12349]-[0-9a-zA-Z]{6}$/;
    return pattern.test(poNo);
  };
  
  // 节流定时器
  let throttleTimer = null;
  
  // 获取查货次数（带节流的版本）
  function getCheckNum() {
    // 如果定时器存在，说明还在节流时间内，直接返回
    if (throttleTimer) return;
  
    //  仅在新增模式下获取查货次数
    if (!isAdd.value) {
      return;
    }
  
    if (
      formData.value.bc_pono &&
      formData.value.batchNo &&
      validatePoNo(formData.value.bc_pono)
    ) {
      // 设置节流标志
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 1000); // 1秒内不重复请求
  
      licZcStore.fetchBcNum({
        bcBatchNo: formData.value.batchNo,
        bcPoNo: formData.value.bc_pono,
      });
    }
  }
  
  // 监听 bc_pono 和 batchNo 的变化
  watch(
    () => [formData.value.bc_pono, formData.value.batchNo],
    () => {
      getCheckNum();
    },
  );
  
  onMounted(() => {
    initData();
  });
  </script>

<style lang="scss" scoped>
.check-container {
  height: 100%;

  .content-area {
    padding: 20px;
    height: 100%;

    :deep(.avue-form) {
      background-color: #fff;
      min-height: 200px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: $shadow-1;
    }
  }
}
</style>
