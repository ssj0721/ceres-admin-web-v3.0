<template>
  <el-dialog :model-value="show" title="导出Excel" width="680px" :close-on-click-modal="false" @update:model-value="v => emit('update:show', v)">
    <el-form label-width="90px" class="export-form">
      <el-form-item label="导出列">
        <div class="col-select">
          <div class="col-tools">
            <el-button link type="primary" @click="selectAll">全选</el-button>
            <el-button link type="primary" @click="clearAll">清空</el-button>
          </div>
          <el-checkbox-group v-model="selected">
            <el-checkbox v-for="c in columns" :key="c.key" :value="c.key">{{ c.title }}</el-checkbox>
          </el-checkbox-group>
          <div v-if="!columns.length" class="tip">加载中…</div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('update:show', false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleExport">导出</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { brBrandExportColumns, brBrandExportExcel } from '@/api/trademark/br/brBrand'

const props = defineProps({
  show: { type: Boolean, default: false },
  filters: { type: Object, default: () => ({}) },
  ids: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:show'])

const columns = ref([])
const selected = ref([])
const loading = ref(false)

watch(() => props.show, (v) => { if (v) loadColumns() })

async function loadColumns() {
  try {
    const res = await brBrandExportColumns()
    columns.value = res.data || []
    selected.value = columns.value.map(c => c.key)
  } catch (e) { columns.value = [] }
}

function selectAll() { selected.value = columns.value.map(c => c.key) }
function clearAll() { selected.value = [] }

async function handleExport() {
  if (!props.ids || !props.ids.length) return ElMessage.warning('请先选择要导出的记录')
  if (!selected.value.length) return ElMessage.warning('请至少选择一列')
  loading.value = true
  try {
    const payload = { ids: props.ids, columns: selected.value, ...props.filters }
    const blob = await brBrandExportExcel(payload)
    const url = window.URL.createObjectURL(new Blob([blob]))
    const a = document.createElement('a')
    a.href = url
    a.download = '商标台账.xlsx'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    emit('update:show', false)
  } catch (e) {
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.export-form { padding: 8px 4px 4px; }
.col-select { width: 100%; }
.col-tools { margin-bottom: 8px; }
.col-select :deep(.el-checkbox) { margin-right: 18px; display: inline-flex; margin-bottom: 8px; }
.tip { color: #999; font-size: 13px; }
.dialog-footer { padding: 4px 8px; }
:deep(.el-dialog__body) { padding: 20px 24px 8px; }
:deep(.el-dialog__footer) { padding: 12px 24px 20px; }
</style>
