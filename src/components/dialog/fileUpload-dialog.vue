<template>
  <el-dialog
    v-model="localVisible"
    :title="title"
    width="40%"
    append-to-body
    @close="handleClose"
  >
    <Sysfile-Upload
      ref="fileUpload"
      :multiple="multiple"
      :limit="limit"
      :maxSize="maxSize"
      :fileList="fileList"
      :auto-upload="true"
      :accept="accept"
      :subPath="subPath"
      @update:fileList="updateFileList" 
    />
    <div class="btns" style="margin-top: 20px; text-align: center;">
      <el-button type="primary" class="confirmBtn" @click="confirm">确认</el-button>
      <el-button class="cancelBtn" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  multiple: { type: Boolean, default: true },
  title: { type: String, default: '' },
  subPath: { type: String, default: 'tmp/tmp' },
  limit: { type: Number, default: 10 },
  maxSize: { type: Number, default: 50 },
  accept: { type: String, default: '.*' },
  visible: { type: Boolean, default: false },
  fileList: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:visible', 'confirm', 'cancel', 'close', 'visible-change', 'update:fileList'])

const fileUpload = ref(null)
const localVisible = ref(props.visible)
const localFileList = ref([...props.fileList]) // 本地维护 fileList

// 同步外部 v-model:visible 到内部
watch(() => props.visible, val => {
  localVisible.value = val
  // if (val) ElMessage.info('🚀 文件上传弹窗打开成功')
})

// 同步内部关闭回传外部
watch(localVisible, val => {
  if (val !== props.visible) emits('update:visible', val)
})

// 同步外部 fileList 到内部
watch(() => props.fileList, val => {
  localFileList.value = [...val]
})

// 更新 fileList 并向外传递
function updateFileList(newFileList) {
  localFileList.value = newFileList
  emits('update:fileList', newFileList)
}

function confirm() {
  if (!fileUpload.value?.isAllFileUploaded()) {
    ElMessage.warning('文件正在上传中，请稍后')
    return
  }
  emits('confirm', localFileList.value)
  localVisible.value = false
}

function cancel() {
  emits('cancel', localFileList.value, false)
  emits('visible-change', localFileList.value, false)
  localVisible.value = false
}

function handleClose() {
  emits('close', localFileList.value, false)
  emits('visible-change', localFileList.value, false)
  localVisible.value = false
}
</script>

<style scoped lang="scss">
.btns {
  display: flex;
  justify-content: center;
  gap: 12px;
}

::v-deep(.el-dialog__body) {
  padding: 20px !important;
}
</style>