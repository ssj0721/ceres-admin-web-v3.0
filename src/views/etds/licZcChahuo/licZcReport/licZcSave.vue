<script setup>
import ZcDetailForm from '@/components/etds/ZcDetailsForm.vue';
import { useLicZcStore } from '@/stores/licZcStore';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { licZcSaveFormOption } from './option';
import { useRoute } from 'vue-router';
import { checkLicPoCanAudit } from '@/api/etds';
const route = useRoute();
const licZcStore = useLicZcStore();

// 判断是否是新增模式
const isAdd = computed(() => route.query.mode === 'add');

// 判断是否已送审
const isSubmitted = computed(
  () => licZcStore.checkFormData?.sconfirm === '已送审'
);

// 控制整体禁用状态
const isDisabled = computed(() => {
  // 新增模式下不禁用
  if (isAdd.value) {
    return false;
  }
  // 如果是工厂报告或已送审,则禁用
  return licZcStore.disabledGcReport || isSubmitted.value;
});

// 表单数据
const saveForm = computed(() => ({
  qdqty: licZcStore.detailsFormData.record.reduce(
    (total, item) => total + (item.bs_value || 0),
    0
  ),
  notaccectqty: licZcStore.detailsFormData.disAccNum || 0,
  checkResult: licZcStore.checkFormData.result || '',
}));
const baseData = computed(() => licZcStore.checkFormData);
const detailData = computed(() => licZcStore.detailsFormData);
const problemData = computed(() => licZcStore.problemFormData);
// radio选中值
const radioValue = computed({
  get: () => {
    const result = licZcStore.checkFormData.bc_result;
    // 如果 result 本身就是数字字符串，直接返回
    return typeof result === 'string' ? result : result.toString();
  },
  set: (val) => {
    const result = val;
    licZcStore.updateCheckForm({ bc_result: result });
  },
});

// 送审状态
const stateName = computed(() => licZcStore.checkFormData.sconfirm);

// 按钮禁用状态
const disableSub = computed(() => isDisabled.value);

// 疵点配置
const defectFormConfig = computed(() => ({
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  headerConfig: {
    labelText: '疵点项目',
    valueText: '备注',
  },
  columns: detailData.value.record.map((item, index) => ({
    label: item.itemsName || `疵点${index + 1}`,
    prop: `defect${index}`,
    remarkProp: `remark${index}`,
    type: 'number',
    labelSlot: 'defectLabel',
    slot: 'defectValue',
  })),
}));

// 疵点数据
const defectData = computed(() => {
  const data = {};
  detailData.value.record.forEach((item, index) => {
    data[`defect${index}`] = item.bs_value || 0;
    data[`remark${index}`] = item.remark || '';
  });
  return data;
});

// 处理疵点数量输入
const handleDefectInput = (value, prop) => {
  const index = Number.parseInt(prop.replace('defect', ''));
  if (!Number.isNaN(index) && detailData.value.record[index]) {
    const newRecord = { ...detailData.value.record[index] };
    newRecord.bs_value = Number(value) || 0;
    detailData.value.record[index] = newRecord;
    // 更新总数
    saveForm.value.qdqty = detailData.value.record.reduce(
      (total, item) => total + (item.bs_value || 0),
      0
    );
  }
};

// 处理疵点备注输入
const handleRemarkInput = (value, prop) => {
  const index = Number.parseInt(prop.replace('remark', ''));
  if (!Number.isNaN(index) && detailData.value.record[index]) {
    const newRecord = { ...detailData.value.record[index] };
    newRecord.remark = value;
    detailData.value.record[index] = newRecord;
  }
};

// 存档
async function handleArchive () {
  try {
    const radio = radioValue.value;
    if (!radio) {
      ElMessage.error('请先选择查货结果');
      return;
    }

    // 2. 查货系统保存成功后,再保存到自查系统
    const saveAllResult = await licZcStore.saveAllData(radio);
    if (saveAllResult) {
      ElMessage.success('保存成功');
    } else {
      ElMessage.error('保存到scm失败');
    }
    const saveToInspectionResult = await licZcStore.saveToInspection(
      radio,
      isAdd.value
    );
    if (!saveToInspectionResult) {
      ElMessage.error('保存到查货系统失败');
      return;
    }
  } catch (error) {
    console.error('保存过程出错:', error);
    ElMessage.error('保存失败');
  }
}

// 取回
async function handleRetrieve () {
  if (stateName.value === '未送审') {
    ElMessage.warning('未送审，不能取回');
    return false;
  }
  const code = await licZcStore.handleRetrieve();

  if (code === 1) {
    ElMessage.success('取回成功');
  } else {
    ElMessage.error('一审已通过，不能取回');
  }
}

// 送审
async function handleSendAudit () {
  // 已送审不能送审
  if (stateName.value === '已送审') {
    ElMessage.warning('已送审，不能送审');
    return false;
  }
  const res1 = await checkLicPoCanAudit({
    bc_pono: baseData.value.bc_pono,
  });
  if (!res1.data.result.Examples || res1.data.result.Examples.length === 0) {
    ElMessage.error('该款号在查货系统没有资料不能送审');
    return;
  }
  const res = await licZcStore.handleSendAudit();
  if (res) {
    ElMessage.success('送审成功');
  } else {
    ElMessage.error('送审失败');
  }
}
</script>

<template>
  <div class="container">
    <div class="content-area">
      <!-- 查货结果 -->
      <div class="result-section">
        <div class="section-title">查货结果</div>
        <div class="radio-group">
          <el-radio-group v-model="radioValue">
            <el-radio
              v-for="item in licZcSaveFormOption.resultOptions"
              :key="item.value"
              :label="item.value"
              :disabled="isDisabled"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="status-section">
        <el-row justify="space-around">
          <el-col :span="8">
            <div class="status-item">
              <span class="label">送审状态</span>
              <span class="value">{{ stateName }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="status-item">
              <span class="label">疵点总件数:</span>
              <span class="value">{{ saveForm.qdqty }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="status-item">
              <span class="label">不接受件数:</span>
              <span class="value">{{ saveForm.notaccectqty }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-row justify="center" class="mb-4">
          <el-col :span="8">
            <el-button
              type="primary"
              :disabled="isDisabled"
              class="custom-button"
              @click="handleArchive"
            >
              存档
            </el-button>
          </el-col>
        </el-row>
        <el-row justify="center" class="mb-4">
          <el-col :span="8">
            <el-button
              type="primary"
              :disabled="!isSubmitted"
              class="custom-button"
              @click="handleRetrieve"
            >
              取回
            </el-button>
          </el-col>
        </el-row>
        <el-row justify="center" class="mb-4">
          <el-col :span="8">
            <el-button
              type="primary"
              :disabled="isSubmitted"
              class="custom-button"
              @click="handleSendAudit"
            >
              送审
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 基本资料 -->
      <div class="detail-section">
        <div class="section-title">基本资料</div>
        <ZcDetailForm
          v-model="baseData"
          :form-config="licZcSaveFormOption.baseFormConfig"
        />
      </div>

      <!-- 详细资料 -->
      <div class="detail-section">
        <div class="section-title">详细资料</div>
        <ZcDetailForm
          v-model="detailData"
          :form-config="licZcSaveFormOption.detailFormConfig"
        />
      </div>

      <!-- 疵点 -->
      <div class="detail-section">
        <div class="section-title">疵点</div>
        <ZcDetailForm v-model="defectData" :form-config="defectFormConfig">
          <template #defectLabel="{ column }">
            <div class="defect-label">
              <span class="label-text">{{ column.label }}</span>
              <el-input-number
                v-model="defectData[column.prop]"
                :min="0"
                size="small"
                disabled
                @change="(val) => handleDefectInput(val, column.prop)"
              />
              <span class="unit">件</span>
            </div>
          </template>

          <template #defectValue="{ column }">
            <div class="defect-value">
              <el-input
                v-model="defectData[column.remarkProp]"
                size="small"
                placeholder="请输入备注"
                disabled
                @input="(val) => handleRemarkInput(val, column.remarkProp)"
              />
            </div>
          </template>
        </ZcDetailForm>
      </div>

      <!-- 问题跟进 -->
      <div class="detail-section">
        <div class="section-title">问题跟进</div>
        <ZcDetailForm
          v-model="problemData"
          :form-config="licZcSaveFormOption.problemFormConfig"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: $container-base-padding-2;
  padding-bottom: $container-base-padding * 2;
}

.content-area {
  background-color: $neutral-color-1;
  border-radius: $border-radius-medium;
  padding: 20px;
  box-shadow: $shadow-1;
}

.section-title {
  font-size: $font-size-large;
  font-weight: bold;
  color: $primary-text-color;
  margin-bottom: $container-base-padding-4;
  padding-bottom: $container-base-padding-4;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.radio-group {
  display: flex;
  justify-content: center;
  gap: $container-base-padding-3;
}

.result-section {
  margin-bottom: $container-base-padding-2;
}

.status-section {
  margin-bottom: $container-base-padding-2;

  .status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $container-base-padding-4;

    .label {
      font-size: $font-size-base;
      color: $secondary-text-color;
    }

    .value {
      color: $primary-text-color;
      font-weight: bold;
    }
  }
}

.action-buttons {
  margin: $container-base-padding-2 0;

  :deep(.el-button) {
    width: 100%;
  }
}

.detail-section {
  margin-top: $container-base-padding-2;
}

.defect-label {
  display: flex;
  align-items: center;
  gap: $container-base-padding-4;
  padding: $container-base-padding-4;
  border-bottom: 1px solid #eee;

  .label-text {
    flex: 1;
    color: $primary-text-color;
  }

  .unit {
    margin-left: $container-base-padding-4;
    color: $secondary-text-color;
  }
}

.defect-value {
  padding: $container-base-padding-4;
}

:deep(.el-input-number) {
  width: 120px;
}

.mb-4 {
  margin-bottom: $container-base-padding-3;
}
</style>
