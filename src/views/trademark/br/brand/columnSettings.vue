<template>
  <div class="column_settings">
    <el-dialog
      v-model="diaShow"
      :close-on-click-modal="false"
      title="列设置"
      width="640px"
      :before-close="handleClose"
    >
      <div class="toolbar">
        <el-button type="primary" link @click="handleShowAll">全部显示</el-button>
        <el-button type="primary" link @click="handleHideAll">全部隐藏</el-button>
        <el-button type="primary" link @click="handleReset">恢复默认</el-button>
      </div>
      <el-table
        :data="innerColumns"
        border
        max-height="420"
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="label" label="列名" min-width="140" show-overflow-tooltip />
        <el-table-column label="显示" width="90" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.show" />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="140" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              :disabled="scope.$index === 0"
              @click="handleMove(scope.$index, -1)"
            >上移</el-button>
            <el-button
              link
              type="primary"
              :disabled="scope.$index === innerColumns.length - 1"
              @click="handleMove(scope.$index, 1)"
            >下移</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: () => false,
  },
  columns: {
    type: Array,
    default: () => [],
  },
})
const { show, columns } = toRefs(props)
const $emit = defineEmits(['update:show', 'confirm'])
const diaShow = computed({
  get: () => show.value,
  set: (value) => $emit('update:show', value),
})
const innerColumns = ref([])

watch(show, (val) => {
  if (val) {
    innerColumns.value = columns.value.map((col) => ({ ...col }))
  }
})

function handleMove (index, step) {
  const target = index + step
  const arr = innerColumns.value
  const temp = arr[index]
  arr[index] = arr[target]
  arr[target] = temp
  innerColumns.value = [...arr]
}

function handleShowAll () {
  innerColumns.value.forEach((col) => { col.show = true })
}

function handleHideAll () {
  innerColumns.value.forEach((col) => { col.show = false })
}

function handleReset () {
  innerColumns.value = JSON.parse(localStorage.getItem('trademarkBrandColumns') || '[]')
}

function handleConfirm () {
  $emit('confirm', innerColumns.value.map((col) => ({ ...col })))
  diaShow.value = false
}

function handleClose () {
  diaShow.value = false
}
</script>

<style lang="scss" scoped>
.column_settings {
  .toolbar {
    margin-bottom: 10px;
    text-align: right;
  }
}

.dialog-footer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
