<template>
  <el-dialog v-model="visible" title="选择申请类型" width="480px" :close-on-click-modal="false">
    <el-form class="dialog-form">
      <el-form-item>
        <label class="dialog-label"><span class="req">*</span> 申请类型：</label>
        <div class="dialog-input">
          <el-radio-group v-model="selectedType">
            <el-radio :value="0">注册</el-radio>
            <el-radio :value="1">变更</el-radio>
            <el-radio :value="2">转让</el-radio>
            <el-radio :value="3">续展</el-radio>
            <el-radio :value="4">异议申请</el-radio>
            <el-radio :value="5">异议答辩</el-radio>
            <el-radio :value="6">撤三答辩</el-radio>
            <el-radio :value="7">驳回复审</el-radio>
            <el-radio :value="8">无效宣告</el-radio>
            <el-radio :value="9">无效答辩</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
        <el-button class="btn-confirm" @click="handleConfirm">确定</el-button>
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

  :deep(.el-form-item) {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0;
  }

  .dialog-label {
    flex: 0 0 100px;
    text-align: right;
    padding-right: 12px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    color: #333333;
    line-height: 32px;

    .req {
      color: #FF4D4F;
      font-weight: 700;
      margin-right: 2px;
    }
  }

  .dialog-input {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;

    :deep(.el-radio) {
      display: block;
      margin-right: 0;
      margin-bottom: 4px;
      font-size: 14px;
      color: #333333;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .btn-cancel {
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    color: #333333;
    font-size: 14px;
  }

  .btn-confirm {
    background: #1890FF;
    border: none;
    border-radius: 6px;
    color: #FFFFFF;
    font-size: 14px;
  }
}
</style>
