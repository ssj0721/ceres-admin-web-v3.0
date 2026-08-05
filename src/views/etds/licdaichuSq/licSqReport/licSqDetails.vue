<template>
    <div class="details-container">
      <div class="content-area">
        <!-- 基础信息表单 -->
        <!-- {{ formData }} -->
  
        <ZcDetailForm
          v-model="formData"
          :form-config="licSqDetailsFormOption"
          :disabled="isDisabled"
        >
          <!-- 查货标准插槽 -->
          <template #checkScrit>
            <div class="select-wrapper">
              <el-select
                v-model="formData.checkScrit"
                :disabled="isDisabled"
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
          </template>
  
          <!-- 颜色插槽 -->
          <template #color>
            <div v-if="!inputColorList" class="color-tags">
              <el-tag
                v-for="color in colorList"
                :key="color"
                :closable="!isDisabled"
                type="primary"
                class="color-tag"
                @close="handleCloseColor(color)"
              >
                {{ color }}
              </el-tag>
              <el-icon
                v-if="!isDisabled"
                class="add-color-icon"
                @click="inputColorList = true"
              >
                <plus />
              </el-icon>
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
          <template #standard1>
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
          </template>
        </ZcDetailForm>
        <el-button
          type="primary"
          class="custom-button"
          :disabled="isDisabled"
          @click="openDefectList = true"
        >
          <el-icon><plus /></el-icon>
          新增疵点
        </el-button>
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
              v-for="(defect, index) in formData.record"
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
                            :disabled="isDisabled"
                          />
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="control-item">
                          <span class="label">小类：</span>
                          <el-input
                            v-model="defect.item"
                            readonly
                            placeholder="点击选择小类"
                            class="defect-input-remark"
                            :disabled="isDisabled"
                            @click="handleReSelect(index, defect.itemsName)"
                          />
                        </div>
                      </el-col>
  
                      <div class="control-item">
                        <el-button
                          type="primary"
                          class="custom-button"
                          :disabled="isDisabled"
                          @click="handleUpload(index)"
                        >
                          选择图片
                        </el-button>
                      </div>
  
                      <el-col :span="8">
                        <div class="image-preview">
                          <!-- pic1预览 -->
                          <div class="preview-item">
                            <el-image
                              v-if="defect.pic1?.path || defect.pic1"
                              :src="defect.pic1?.path || defect.pic1"
                              :preview-src-list="[defect.pic1?.path || defect.pic1]"
                              fit="contain"
                            />
                            <el-icon
                              v-if="(defect.pic1?.path || defect.pic1) && !isDisabled"
                              class="delete-icon"
                              @click.stop="deleteImage(index, true)"
                            >
                              <close />
                            </el-icon>
                          </div>
                          <!-- pic2预览 -->
                          <div class="preview-item">
                            <el-image
                              v-if="defect.pic2?.path || (defect.pic2 && defect.pic2 !== '')"
                              :src="defect.pic2?.path || defect.pic2"
                              :preview-src-list="[defect.pic2?.path || defect.pic2]"
                              fit="contain"
                            />
                            <el-icon
                              v-if="(defect.pic2?.path || defect.pic2) && !isDisabled"
                              class="delete-icon"
                              @click.stop="deleteImage(index, false)"
                            >
                              <close />
                            </el-icon>
                          </div>
                        </div>
                      </el-col>
                      <el-button
                        type="danger"
                        :style="{ width: '100px' }"
                        :disabled="isDisabled"
                        @click="deleteDefect(index)"
                      >
                        删除
                      </el-button>
                    </div>
  
                  </div>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></template>

<script setup>
import { ref, computed } from 'vue'
import { licSqDetailsFormOption } from './option'
import { ElMessage } from 'element-plus'
import ZcDetailForm from '@/components/etds/ZcDetailsForm.vue'
import { useLicZcStore } from '@/stores/licZcStore'
import { useRoute } from 'vue-router'

const licZcStore = useLicZcStore()
const route = useRoute()

// 表单数据使用store中的computed
const formData = computed({
  get: () => licZcStore.detailsFormData,
  set: val => licZcStore.updateDetailsForm(val)
})

// 将逗号分隔的字符串转换为数组
const colorList = computed(() => formData.value.color ? formData.value.color.split(',') : [])

// 判断是否是新增模式
const isAdd = computed(() => route.query.mode === 'add')

// 判断是否已送审
const isSubmitted = computed(() => licZcStore.checkFormData?.sconfirm === '已送审')

// 控制整体禁用状态
const isDisabled = computed(() => {
  // 新增模式下不禁用
  if (isAdd.value) {
    return false
  }
  // 如果是工厂报告或已送审,则禁用
  return licZcStore.disabledGcReport || isSubmitted.value
})

// 控制状态
const openList = ref(false)
const openDefectModal = ref(false)
const openDefectList = ref(false)
const inputColorList = ref(false)
const isEdit = ref(false) // 用来处理重新选择疵点小类和大类
const itemsName = ref('')
const currentEditIndex = ref(-1)

// 从store获取选项列表
const checkItems = computed(() => licZcStore.checkItems)
const defectOptions = computed(() => licZcStore.defectOptions)
const defectDetailList = computed(() => licZcStore.defectDetailList)

// 查货标准选择回调
function handleCheckScrit (e) {
  console.log(e)
  const selectedOption = checkItems.value.find(item => item.value === e)
  console.log(selectedOption)
  if (selectedOption) {
    formData.value.checkScrit = selectedOption.label
    licZcStore.getInspectionStandardData()
  }
  openList.value = false
}

// 处理颜色标签关闭
function handleCloseColor (tag) {
  const index = colorList.value.indexOf(tag)
  if (index > -1) {
    const newList = [...colorList.value]
    newList.splice(index, 1)
    formData.value.color = newList.join(',')
  }
}

// 处理颜色输入完成
function handleColorInput () {
  inputColorList.value = false
  let tempColorList = formData.value.color.split(',')
  // 去掉重复的
  tempColorList = Array.from(new Set(tempColorList))
  formData.value.color = tempColorList.join(',')
}

// 疵点相关操作
async function handleOpenDefectList (e) {
  openDefectModal.value = true
  openDefectList.value = false
  itemsName.value = e

  await licZcStore.getDefectDetailsData(itemsName.value)
}

// 处理返回到疵点大类列表
function handleBackToDefectList () {
  openDefectModal.value = false
  openDefectList.value = true
}

// 选择疵点
function handleSelectDefect (item) {
  if (isEdit.value) {
    licZcStore.updateDefectRecord(currentEditIndex.value, {
      item: item.item,
      itemOid: item.defectSpotOid,
      remark: item.item,
      itemsName: itemsName.value
    })
    isEdit.value = false
  } else {
    licZcStore.addDefectRecord(item)
  }
  openDefectModal.value = false
}
// 删除疵点
function deleteDefect (index) {
  licZcStore.removeDefectRecord(index)
}

// 图片处理
function handleUpload (index) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      const record = formData.value.record[index]
      const updateData = {}

      if (!record.pic1) {
        updateData.pic1 = {
          file,
          path: preview,
          size: file.size,
          name: file.name
        }
        updateData.BS_SIZE = file.size
      } else if (!record.pic2) {
        updateData.pic2 = {
          file,
          path: preview,
          size: file.size,
          name: file.name
        }
        updateData.BS_SIZE2 = file.size
      } else {
        ElMessage.warning('最多只能上传两张图片')
        return
      }

      licZcStore.updateDefectRecord(index, updateData)
    }
  }

  input.click()
}
function deleteImage (index, isPic1) {
  licZcStore.updateDefectRecord(index, {
    [isPic1 ? 'pic1' : 'pic2']: null,
    [isPic1 ? 'BS_SIZE' : 'BS_SIZE2']: 0,
  })
}
// 处理重新选择
function handleReSelect (index, itemsName) {
  isEdit.value = true
  currentEditIndex.value = index
  handleOpenDefectList(itemsName)
}

</script>

<style lang="scss" scoped>
.details-container {
  height: 100%;
  background-color: #F5F7FA;

  .content-area {
    padding: 20px 32px 32px 32px;
    height: 100%;
    overflow-y: auto;
  }
}

.select-wrapper {
    flex:1;
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
    color: #409EFF;
    font-size: 20px;
  }
}

.color-input {
  display: flex;
  align-items: center;
  gap: 8px;

  .confirm-icon {
    cursor: pointer;
    color: #409EFF;
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
          justify-content:space-around;
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