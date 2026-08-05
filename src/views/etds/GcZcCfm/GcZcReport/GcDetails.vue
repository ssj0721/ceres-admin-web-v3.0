<script setup>
import { ref, computed, onMounted } from 'vue';
import { licZcDetailsFormOption } from './option';
import { ElMessage, ElMessageBox } from 'element-plus';
import ZcDetailsForm from '@/components/etds/ZcDetailsForm.vue';
import { getGcDefectList, getGcDefectDetailList } from '@/api/etds';
import { useGcZcStore } from '@/stores/GcZcStore';

const gcZcStore = useGcZcStore();

// 表单数据
const formData = computed({
  get: () => gcZcStore.GcDetailsData,
  set: (val) => gcZcStore.updateGcDetailsData(val),
});

// 颜色标签列表
const colorList = computed(() => {
  return formData.value.color ? formData.value.color.split(',') : [];
});

// 疵点列表
// const defectList = ref([]);
const defectList = computed({
  get: () => gcZcStore.GcDetailsList,
  set: (val) => gcZcStore.updateGcDetailsList(val)
})

// 疵点大类选项
const defectOptions = ref([]);

// 疵点小类列表
const defectDetailList = ref([]);

// 弹窗控制
const openDefectList = ref(false);
const openDefectModal = ref(false);
const currentDefectType = ref('');

async function initDefectOptions () {
  // 初始化疵点的数据
  const res = await getGcDefectList({});
  defectOptions.value = res.data.Examples.map((item) => {
    return {
      label: item,
      value: item,
    };
  });
}

// TODO: 初始化数据
async function initData () {
  await initDefectOptions();
}

// 获取疵点详情的测试数据
async function getDefectDetails (type) {
  const res = await getGcDefectDetailList({
    itemsName: type,
  });
  defectDetailList.value = res.data.Examples.map((item) => {
    return {
      defectSpotOid: item.defectSpotOid,
      itemsName: item.itemsName,
      item: item.item,
    };
  });
  openDefectModal.value = true;
  openDefectList.value = false;
}

// 处理颜色标签关闭
function handleCloseColor (tag) {
  const index = colorList.value.indexOf(tag);
  if (index > -1) {
    const newList = [...colorList.value];
    newList.splice(index, 1);
    formData.value.color = newList.join(',');
  }
}

// 颜色输入框状态
const inputColorList = ref(false);

// 处理颜色输入完成
function handleColorInput () {
  inputColorList.value = false;
  let tempColorList = formData.value.color.split(',');
  // 去掉重复的
  tempColorList = Array.from(new Set(tempColorList));
  formData.value.color = tempColorList.join(',');
}

// 处理打开疵点列表
function handleOpenDefectList (type) {
  currentDefectType.value = type;
  openDefectModal.value = true;
  openDefectList.value = false;
  getDefectDetails(type);
}

// 处理返回到疵点大类列表
function handleBackToDefectList () {
  openDefectModal.value = false;
  openDefectList.value = true;
}

// 选择疵点
function handleSelectDefect (item) {
  if (
    defectList.value.some(
      (item1) =>
        item1.defectSpotOid === item.defectSpotOid && item1.item === item.item
    )
  ) {
    ElMessage.error('该疵点已存在');
    return
  }
  const defect = {
    defectSpotOid: item.defectSpotOid,
    itemsName: item.itemsName,
    item: item.item,
    file1: null, // 第一个图片
    file2: null, // 第二个图片
    src1: '', // 第一个图片预览地址
    src2: '', // 第二个图片预览地址
    bs_pic: '', // 数据库图片地址
    bs_pic2: '', // 数据库图片地址
    bs_value: 1, // 数据库图片值
    _status1: 'add', // 表示这个数据是状态
    _status2: 'add', // 表示这个数据是状态
  };
  defectList.value.push(defect);
  openDefectModal.value = false;
}
// 删除疵点
function deleteDefect (index) {
  defectList.value.splice(index, 1);
}

// 处理图片上传
function handleUpload (index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 创建预览URL
      const preview = URL.createObjectURL(file);
      const record = defectList.value[index];

      // 判断能不能存图 src1 src2
      if (!record.src1) {
        record.file1 = file;
        record.src1 = preview;
        if (record._status1 !== 'delete') {
          record._status1 = 'add'; // 表示这个数据是状态
        }
      } else if (!record.src2) {
        record.file2 = file;
        record.src2 = preview;
        if (record._status2 !== 'delete') {
          record._status2 = 'add'; // 表示这个数据是状态
        }
      } else {
        ElMessage.warning('最多只能上传两张图片');
        URL.revokeObjectURL(preview);
      }
    }
  };

  input.click();
}

// 删除图片
function deleteImage (index, isPic1) {
  const record = defectList.value[index];
  if (isPic1) {
    URL.revokeObjectURL(record.src1);
    record.src1 = null;
    record.file1 = null;
    if (record.oid !== '' && record.bs_pic !== '') {
      record._status1 = 'delete'; // oid不为空，bs_pic不为空，代表这个图片在数据库有值，需要删除
    }
  } else {
    URL.revokeObjectURL(record.src1);
    record.src2 = null;
    record.file2 = null;
    if (record.oid !== '' && record.bs_pic2 !== '') {
      record._status2 = 'delete'; // oid不为空，bs_pic2不为空，代表这个图片在数据库有值，需要删除
    }
  }
}

onMounted(async () => {
  await initData();
});
</script>

<template>
  <div class="details-container">
    <div class="content-area">
      <!-- 基础信息表单 -->
      <ZcDetailsForm v-model="formData" :form-config="licZcDetailsFormOption">
        <!-- 查货标准插槽 -->
        <!-- <template #checkScrit>
          <div class="select-wrapper">
            <div class="select-display" @click="openList = true">
              <span>{{ formData.checkScrit }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <el-select
              v-model="openList"
              :model-value="formData.checkScrit"
              @change="handleCheckScrit"
            >
              <el-option
                v-for="item in checkItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </template> -->

        <!-- 颜色插槽 -->
        <template #color>
          <div v-if="!inputColorList" class="color-tags">
            <el-tag
              v-for="color in colorList"
              :key="color"
              type="primary"
              class="color-tag"
            >
              <!-- closable
              @close="handleCloseColor(color)" -->
              {{ color }}
            </el-tag>
            <!-- <el-icon class="add-color-icon" @click="inputColorList = true">
              <plus />
            </el-icon> -->
          </div>
          <div v-else class="color-input">
            <el-input
              v-model="formData.color"
              placeholder="请输入颜色，多个用逗号分隔"
              @blur="handleColorInput"
            />
            <el-icon class="confirm-icon" @click="handleColorInput">
              <check />
            </el-icon>
          </div>
        </template>

        <!-- 标准插槽 -->
        <!-- <template #standard1>
          <div class="standard-links">
            <a
              v-for="standard in formData.standard1"
              :key="standard"
              class="standard-link"
            >
              {{ standard }}
            </a>
          </div>
        </template>

        <template #standard2>
          <div class="standard-links">
            <a
              v-for="standard in formData.standard2"
              :key="standard"
              class="standard-link"
            >
              {{ standard }}
            </a>
          </div>
        </template>

        <template #standard3>
          <div class="standard-links">
            <a
              v-for="standard in formData.standard3"
              :key="standard"
              class="standard-link"
            >
              {{ standard }}
            </a>
          </div>
        </template> -->
      </ZcDetailsForm>
      <!-- <el-button
        type="primary"
        class="custom-button"
        @click="openDefectList = true"
      >
        <el-icon><plus /></el-icon>
        新增疵点
      </el-button> -->
      <!-- 疵点区域 -->
      <div class="defect-area">
        <!-- 疵点大类选择弹窗 -->
        <el-dialog
          v-model="openDefectList"
          title="选择疵点类型"
          width="500px"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="defect-type-list">
            <div
              v-for="option in defectOptions"
              :key="option.value"
              class="defect-type-item"
              @click="handleOpenDefectList(option.label)"
            >
              {{ option.label }}
            </div>
          </div>
        </el-dialog>

        <!-- 疵点小类选择弹窗 -->
        <el-dialog
          v-model="openDefectModal"
          :title="currentDefectType"
          width="500px"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="dialog-header">
            <el-button @click="handleBackToDefectList">
              <el-icon><back /></el-icon>
              返回
            </el-button>
          </div>
          <div class="defect-detail-list">
            <div
              v-for="item in defectDetailList"
              :key="item.defectSpotOid"
              class="defect-detail-item"
              @click="handleSelectDefect(item)"
            >
              {{ item.item }}
            </div>
          </div>
        </el-dialog>

        <!-- 疵点列表 -->
        <div class="defect-list">
          <div
            v-for="(defect, index) in defectList"
            :key="index"
            class="defect-item"
          >
            <div class="defect-content">
              <div class="defect-title">{{ defect.itemsName }}</div>
              <el-row>
                <div class="defect-row">
                  <div class="defect-controls">
                    <el-col :span="5">
                      <div class="control-item">
                        <span class="label">件数：</span>
                        <el-input-number
                          v-model="defect.bs_value"
                          :min="1"
                          :max="999"
                          class="defect-input"
                          disabled
                        />
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="control-item">
                        <span class="label">备注：</span>
                        <el-input
                          v-model="defect.item"
                          disabled
                          placeholder="请输入备注"
                          class="defect-input-remark"
                        />
                      </div>
                    </el-col>

                    <div class="control-item">
                      <!-- <el-button
                        type="primary"
                        class="custom-button"
                        @click="handleUpload(index)"
                      >
                        选择图片
                      </el-button> -->
                    </div>

                    <el-col :span="8">
                      <div class="image-preview">
                        <div class="preview-item">
                          <el-image
                            :src="defect.src1"
                            :preview-src-list="[defect.src1]"
                            fit="contain"
                          />
                          <!-- <el-icon
                            class="delete-icon"
                            @click="deleteImage(index, true)"
                          >
                            <close />
                          </el-icon> -->
                        </div>
                        <div class="preview-item">
                          <el-image
                            :src="defect.src2"
                            :preview-src-list="[defect.src2]"
                            fit="contain"
                          />
                          <!-- <el-icon
                            class="delete-icon"
                            @click="deleteImage(index, false)"
                          >
                            <close />
                          </el-icon> -->
                        </div>
                      </div>
                    </el-col>
                    <!-- <el-button
                      type="danger"
                      :style="{ width: '100px' }"
                      @click="deleteDefect(index)"
                    >
                      删除
                    </el-button> -->
                  </div>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details-container {
  height: 100%;
  background-color: #f5f7fa;

  .content-area {
    padding: 32px;
    height: 100%;
    overflow-y: auto;
  }
}

.select-wrapper {
  .select-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 12px;
    height: 32px;
    cursor: pointer;

    .select-arrow {
      color: #909399;
      font-size: 12px;
      transition: transform 0.3s;
    }

    &:hover {
      border-color: #c0c4cc;
    }
  }
}

.color-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  .color-tag {
    margin-right: 8px;
  }

  .add-color-icon {
    cursor: pointer;
    color: #409eff;
    font-size: 20px;
  }
}

.color-input {
  display: flex;
  align-items: center;
  gap: 8px;

  .confirm-icon {
    cursor: pointer;
    color: #409eff;
    font-size: 20px;
  }
}

.standard-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .standard-link {
    color: #3664f9;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.defect-area {
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: $shadow-1;

  .defect-header {
    margin-bottom: 20px;
  }

  .defect-item {
    margin-bottom: 20px;
    padding: 16px 20px;
    background-color: rgb(224, 236, 252);
    border-radius: 8px;

    .defect-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      .defect-title {
        font-weight: 500;
        min-width: 80px;
      }

      .defect-controls {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;

        .control-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .label {
            white-space: nowrap;
            color: #606266;
          }

          .defect-input {
            width: 120px;
          }

          .defect-input-remark {
            width: 200px;
          }
        }

        .image-preview {
          display: flex;
          justify-content: space-around;
          gap: 8px;
          margin: 0;

          .preview-item {
            width: 100px;
            height: 60px;
            background-color: #fff;

            .delete-icon {
              padding: 2px;
            }
          }
        }
      }
    }
  }
}

.defect-type-list,
.defect-detail-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;

  .defect-type-item,
  .defect-detail-item {
    padding: 12px;
    text-align: center;
    background-color: #f5f7fa;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #e6f1fc;
      color: #409eff;
    }
  }
}

.dialog-header {
  padding: 0 16px;
}

.defect-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: start;

  .defect-input {
    width: 100%;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.image-preview {
  display: flex;
  gap: 16px;
  margin-top: 16px;

  .preview-item {
    position: relative;
    width: 180px;
    height: 130px;
    border-radius: 4px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .delete-icon {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      z-index: 1;
    }
  }
}

.defect-item {
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: rgb(224, 236, 252);
  border-radius: 8px;

  .defect-row {
    display: flex;
    align-items: center;
    gap: 16px;

    .defect-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 80px;
    }

    .defect-controls {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 16px;

      .control-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .label {
          white-space: nowrap;
          color: #606266;
          font-size: 14px;
        }

        .defect-input {
          width: 120px;
        }
      }

      .image-preview {
        display: flex;
        gap: 8px;
        margin: 0;

        .preview-item {
          width: 60px;
          height: 60px;

          .el-image {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }

          .delete-icon {
            padding: 2px;
          }
        }
      }
    }
  }
}
</style>
