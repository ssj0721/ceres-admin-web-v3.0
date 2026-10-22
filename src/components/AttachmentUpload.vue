<template>
  <div class="att-upload">
    <el-upload
      v-if="!readonly"
      :auto-upload="false"
      multiple
      :show-file-list="false"
      :on-change="onFile"
    >
      <el-button class="btn-upload" plain>上传文件</el-button>
    </el-upload>
    <div v-for="(att, idx) in modelValue" :key="idx" class="att-row">
      <a v-if="att.url" :href="att.url" target="_blank" class="file-link">{{ att.fileName || '查看文件' }}</a>
      <span v-else class="file-name">{{ att.fileName }}</span>
      <el-button v-if="!readonly" link type="danger" size="small" @click="removeAt(idx)">删除</el-button>
    </div>
  </div>
</template>

<script setup>
import { uploadFileApi } from '@/api/file'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

function onFile(file) {
  const list = props.modelValue.slice()
  list.push({ fileId: '', fileName: file.name, url: '', _raw: file.raw })
  emit('update:modelValue', list)
}

function removeAt(idx) {
  const list = props.modelValue.slice()
  list.splice(idx, 1)
  emit('update:modelValue', list)
}

// 保存前收口：把新选的待上传文件真正上传，返回全部 fileId 列表
async function flush() {
  for (const item of props.modelValue) {
    if (item._raw) {
      const fd = new FormData()
      fd.append('fileList', item._raw)
      const res = await uploadFileApi(fd)
      const id = res.data && res.data.fileId
      if (id) { item.fileId = String(id); delete item._raw }
    }
  }
  return props.modelValue.map(i => i.fileId).filter(Boolean)
}

defineExpose({ flush })
</script>

<style lang="scss" scoped>
.att-upload {
  .att-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .file-link { color: #409eff; text-decoration: none; cursor: pointer; font-size: 13px; }
  .file-link:hover { text-decoration: underline; }
  .file-name { color: #333; font-size: 13px; }
  .btn-upload { border-radius: 6px; font-size: 14px; padding: 12px 15px; font-weight: 500 !important; }
}
</style>
