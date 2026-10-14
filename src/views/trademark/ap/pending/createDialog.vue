<template>
  <el-dialog v-model="visible" title="选择申请类型" width="720px" :close-on-click-modal="false">
    <el-form class="dialog-form">
      <el-form-item>
        <label class="dialog-label"><span class="req">*</span> 申请类型：</label>
        <div class="dialog-input">
          <el-radio-group v-model="selectedType" class="radio-grid">
            <el-radio :value="1">注册</el-radio>
            <el-radio :value="3">更正</el-radio>
            <el-radio :value="2">变更</el-radio>
            <el-radio :value="4">转让</el-radio>
            <el-radio :value="5">续展</el-radio>
            <el-radio :value="6">异议申请</el-radio>
            <el-radio :value="7">异议答辩</el-radio>
            <el-radio :value="8">异议复审<br/>（我司为异议人）</el-radio>
            <el-radio :value="9">异议复审<br/>（我司为被异议人）</el-radio>
            <el-radio :value="10">驳回复审</el-radio>
            <el-radio :value="11">行政诉讼结案</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
        <el-button class="btn-confirm" @click="handleConfirm">创建申请</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['update:show', 'confirm'])

const visible = ref(false)
const selectedType = ref(0)

watch(() => props.show, (val) => {
  visible.value = val
  if (val) selectedType.value = 0
})

watch(visible, (val) => {
  if (!val) emit('update:show', false)
})

function handleCancel() { visible.value = false }

function handleConfirm() {
  if (selectedType.value === null || selectedType.value === undefined) return ElMessage.warning('请选择申请类型')
  emit('confirm', selectedType.value)
}
</script>

<style lang="scss" scoped>
.dialog-form {
  padding: 20px 0;
  color: #000000;

  :deep(.el-form-item) {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0;
  }

  .dialog-label {
    margin-bottom: 115px;
    flex: 0 0 120px;
    text-align: right;
    padding-right: 16px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    color: #000000;
    line-height: 32px;
    font-weight: normal;

    .req {
      color: #FF4D4F;
      font-weight: normal;
      margin-right: 2px;
    }
  }

  .dialog-input {
    flex: 1;

    .radio-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px 16px;

      :deep(.el-radio) {
        margin-right: 0;
        font-size: 14px;
        color: #000000;
        height: auto;
        font-weight: normal;

        .el-radio__label {
          white-space: normal;
          line-height: 1.4;
          font-weight: normal;
          color: #000000;
        }

        .el-radio__input .el-radio__inner {
          border-color: #D9D9D9;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-bottom: 8px;

  .btn-cancel {
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    color: #000000;
    font-size: 14px;
    min-width: 120px;
    height: 40px;
    font-weight: normal;
  }

  .btn-confirm {
    background: #1890FF;
    border: none;
    border-radius: 6px;
    color: #FFFFFF;
    font-size: 14px;
    min-width: 120px;
    height: 40px;
    font-weight: normal;
  }
}

// White background, black font for entire dialog
:deep(.el-dialog) {
  background: #FFFFFF;
  color: #000000;
}

:deep(.el-dialog__header) {
  background: #FFFFFF !important;
  border-bottom: none;
  padding-bottom: 12px;
}

:deep(.el-dialog__title) {
  font-weight: normal;
  font-size: 16px;
  color: #000000 !important;
}

:deep(.el-dialog__body) {
  background: #FFFFFF !important;
  color: #000000;
}

:deep(.el-dialog__footer) {
  background: #FFFFFF;
}
</style>
