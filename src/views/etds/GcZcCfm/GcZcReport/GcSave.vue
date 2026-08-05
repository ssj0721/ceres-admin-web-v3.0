<script setup>
import ZcDetailsForm from '@/components/etds/ZcDetailsForm.vue';
import { ElMessage } from 'element-plus';
import { computed, ref, onMounted } from 'vue';
import { licZcSaveFormOption } from './option';
import { useGcZcStore } from '@/stores/GcZcStore';
import { useRouter, useRoute } from 'vue-router';
import {
  gcZcCheckReportSaveOrUpdate,
  gcZcUploadPic,
  pswGcZcCheckReport,
} from '@/api/etds';

const gcZcStore = useGcZcStore();

const route = useRoute();

const gcOid = ref(route.query.oid);

const GcCheckData = ref(gcZcStore.GcCheckData);
const GcDetailsList = ref(gcZcStore.GcDetailsList);
const GcDetailsData = ref(gcZcStore.GcDetailsData);
const GcProblem = ref(gcZcStore.GcProblem);
const GcUploadData = ref(gcZcStore.GcUploadData);

const qdqty = computed(() => {
  let qdqty = 0;
  GcDetailsList.value.forEach((item) => {
    qdqty += item.bs_value;
  });
  return qdqty;
});

// 送审状态
const stateName = ref(
  GcCheckData.value.state === 1 || GcCheckData.value.state === '1'
    ? '联营接受'
    : GcCheckData.value.state === 2 || GcCheckData.value.state === '2'
      ? '联营拒绝'
      : GcCheckData.value.state === 0 || GcCheckData.value.state === '0'
        ? '已提交'
        : '未提交'
);

const colorList = ref(
  GcDetailsData.value.color === '' ? [] : GcDetailsData.value.color.split(',')
);

// 按钮禁用状态
const disableSub = ref(GcCheckData.value.state !== -1);

const disableSave = ref(false); // 防止重复提交

// 疵点配置
const defectFormConfig = computed(() => ({
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  headerConfig: {
    labelText: '疵点项目',
    valueText: '备注',
  },
  columns: GcDetailsList.value.map((item, index) => ({
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
  GcDetailsList.value.forEach((item, index) => {
    data[`defect${index}`] = item.bs_value || 0;
    data[`remark${index}`] = item.item || '';
  });
  return data;
});

// 存档
async function handleArchive () {
  try {
    // 存档逻辑
    let gcCheckData = GcCheckData.value;
    let gcDetailsData = GcDetailsData.value;
    let gcDetailsList = GcDetailsList.value.map((item) => {
      return {
        ...item,
        file1: null,
        file2: null,
      };
    });
    let gcProblem = GcProblem.value;
    let gcUploadData = GcUploadData.value.map((item) => {
      return {
        ...item,
        file: null,
      };
    });
    const params = {
      gcCheckData: gcCheckData,
      gcDetailsData: gcDetailsData,
      gcDetailsList: gcDetailsList,
      gcProblem: gcProblem,
      gcUploadData: gcUploadData,
      oid: gcOid.value,
    };
    const res = await gcZcCheckReportSaveOrUpdate(params);
    if (res.data === 1 || res.data === '1') {
      // 成功
      // 存档GcUploadData 过滤出需要保存的图片 没oid意味着新增的图片
      let needSaveUploadData = GcUploadData.value.filter((item) => {
        return item.oid === '';
      });
      // 循环上传图片
      let i = 0;
      for (const item of needSaveUploadData) {
        const formData = new FormData();
        // 生成文件名
        const dt = new Date();
        const filename = `${dt.getFullYear()}${
          dt.getMonth() + 1
        }${dt.getDate()}${dt.getTime()}${i}`;
        console.log(filename);
        formData.append('file', item.file, filename);
        formData.append('bp_fileSize', item.size);
        formData.append('fk', gcOid.value);
        formData.append('bs_item', '');
        formData.append('type', '1'); // 1:普通图片
        // 上传文件
        await gcZcUploadPic(formData);
        i++;
      }

      // 存档GcDetailsList 过滤出需要保存的图片 oid==""意味着新增的图片并且有图片
      // oid!="" 但file1/file2有图片 也需要上传图片
      // 因为如果从数据库获取有oid的数据是不会有file1/file2 有file1/file2
      // 有oid的数据用的是bs_pic1/bs_pic2这样的网络路径
      // 如果有file1/file2则说明原本图片删除了 上传新的图片
      let needSaveDetailsList = GcDetailsList.value.filter((item) => {
        return (
          (item.oid === '' && (item.file1 || item.file2)) ||
          (item.oid !== '' && item.file1) ||
          (item.oid !== '' && item.file2)
        );
      });
      // 循环上传图片
      i = 0;
      for (const item of needSaveDetailsList) {
        const formData = new FormData();
        // 生成文件名
        const dt = new Date();
        if (item.file1) {
          const filename = `${dt.getFullYear()}${
            dt.getMonth() + 1
          }${dt.getDate()}${dt.getTime()}${i}pic1`;
          formData.append('file', item.file1, filename);
          formData.append('bp_fileSize', item.file1.size);
          formData.append('fk', gcOid.value);
          formData.append('bs_item', item.defectSpotOid);
          formData.append('type', 'pic1'); // 1:普通图片
          // 上传文件
          await gcZcUploadPic(formData);
        }
        if (item.file2) {
          const filename = `${dt.getFullYear()}${
            dt.getMonth() + 1
          }${dt.getDate()}${dt.getTime()}${i}pic2`;
          formData.append('file', item.file2, filename);
          formData.append('bp_fileSize', item.file2.size);
          formData.append('fk', gcOid.value);
          formData.append('bs_item', item.defectSpotOid);
          formData.append('type', 'pic21'); // 1:普通图片
          // 上传文件
          await gcZcUploadPic(formData);
        }
        i++;
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function handleSave () {
  disableSave.value = true;
  const res = await handleArchive();
  if (res) {
    ElMessage.success('存档成功');
    disableSave.value = false;
    gcZcStore.initState(gcOid.value);
  } else {
    ElMessage.error('存档失败');
    disableSave.value = false;
  }
}

// 取回
function handleRetrieve () {
  ElMessage.success('模拟取回成功');
}

// 提交联营商
async function handleSendAudit () {
  let arr = [];
  arr.push(gcOid.value);
  const params = {
    oidlist: arr,
  };
  const res = await pswGcZcCheckReport(params);
  if (res.data.data === 1 || res.data.data === '1') {
    ElMessage.success('提交成功');
    // 刷新
    gcZcStore.initState(gcOid.value);
  } else {
    ElMessage.error('提交失败，请稍后重试');
  }
}

onMounted(() => {});
</script>

<template>
  <div class="container">
    <div class="content-area">
      <!-- 查货结果 -->
      <div class="result-section">
        <!-- <div> GcCheckData:{{ GcCheckData }} </div>
        <div> GcDetailsData:{{ GcDetailsData }} </div>
        <div> GcDetailsList:{{ GcDetailsList }} </div>
        <div> GcProblem:{{ GcProblem }} </div>
        <div> GcUploadData:{{ GcUploadData }} </div>
        <div> gcOid:{{ gcOid }} </div> -->
        <div class="section-title">查货结果</div>
        <div class="radio-group">
          <el-radio-group v-model="GcCheckData.bc_result">
            <el-radio
              v-for="item in licZcSaveFormOption.resultOptions"
              :key="item.value"
              :label="item.value"
              disabled
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
              <span class="value">{{ qdqty }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="status-item">
              <span class="label">不接受件数:</span>
              <span class="value">{{ GcDetailsData.disAccNum }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- <el-row justify="center" class="mb-4">
          <el-col :span="8">
            <el-button
              type="primary"
              :disabled="disableSub || disableSave"
              class="custom-button"
              @click="handleSave"
            >
              存档
            </el-button>
          </el-col>
        </el-row>
        <el-row justify="center" class="mb-4">
          <el-col :span="8">
            <el-button
              type="primary"
              :disabled="disableSub"
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
              :disabled="disableSub"
              class="custom-button"
              @click="handleSendAudit"
            >
              提交联营商
            </el-button>
          </el-col>
        </el-row> -->
      </div>

      <!-- 基本资料 -->
      <div class="detail-section">
        <div class="section-title">基本资料</div>
        <ZcDetailsForm
          v-model="GcCheckData"
          :form-config="licZcSaveFormOption.baseFormConfig"
        />
      </div>

      <!-- 详细资料 -->
      <div class="detail-section">
        <div class="section-title">详细资料</div>
        <ZcDetailsForm
          v-model="GcDetailsData"
          :form-config="licZcSaveFormOption.detailFormConfig"
        >
          <template #color>
            <div class="color-tags">
              <el-tag v-for="item in colorList" :key="item">
                {{ item }}
              </el-tag>
            </div>
          </template>
        </ZcDetailsForm>
      </div>

      <!-- 疵点 -->
      <div class="detail-section">
        <div class="section-title">疵点</div>
        <ZcDetailsForm v-model="defectData" :form-config="defectFormConfig">
          <template #defectLabel="{ column }">
            <div class="defect-label">
              <span class="label-text">{{ column.label }}</span>
              <el-input-number
                v-model="defectData[column.prop]"
                :min="0"
                size="small"
                disabled
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
              />
            </div>
          </template>
        </ZcDetailsForm>
      </div>

      <!-- 问题跟进 -->
      <div class="detail-section">
        <div class="section-title">问题跟进</div>
        <ZcDetailsForm
          v-model="GcProblem"
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
