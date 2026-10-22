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
import { basicExportColumns, basicExportExcel } from '@/api/trademark/ap/basic'

const props = defineProps({
  show: { type: Boolean, default: false },
  filters: { type: Object, default: () => ({}) },
  ids: { type: Array, default: () => [] },
  types: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:show'])

const columns = ref([])
const selected = ref([])
const loading = ref(false)

watch(() => props.show, (v) => { if (v) loadColumns() })

async function loadColumns() {
  columns.value = []
  selected.value = []
  const types = Array.from(new Set((props.types || []).filter(t => t != null)))
  if (!types.length) return
  try {
    const resList = await Promise.all(types.map(t => basicExportColumns(t)))
    const merged = []
    const seen = new Set()
    resList.forEach(res => (res.data || []).forEach(col => {
      if (!seen.has(col.key)) { seen.add(col.key); merged.push(col) }
    }))
    columns.value = merged
    selected.value = merged.map(c => c.key)
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
    const blob = await basicExportExcel(payload)
    const url = window.URL.createObjectURL(new Blob([blob]))
    const a = document.createElement('a')
    a.href = url
    a.download = '商标申请列表.xlsx'
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
