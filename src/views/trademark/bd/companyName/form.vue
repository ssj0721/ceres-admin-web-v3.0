<template>
  <div class="form_content">
    <el-dialog
      v-model="diaShow"
      :close-on-click-modal="false"
      :title="dialogOption.title"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-form-item
          label="公司名称："
          prop="companyName"
        >
          <el-input
            v-model="form.companyName"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入公司名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            :loading="dialogOption.loading"
            @click="handleConfirm"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { companyNameAdd, companyNameEdit } from '@/api/trademark/bd/companyName'
import { computed, ref, toRefs, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: () => false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
})
const { show, item } = toRefs(props)
const dialogOption = ref({
  loading: false,
  title: '新增公司名称',
})
const form = ref({
  id: null,
  companyName: null,
})
const formRules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
  ],
}
const $emit = defineEmits(['update:show', 'confirm', 'close'])
const diaShow = computed({
  get: () => show.value,
  set: (value) => $emit('update:show', value)
})
watch(item, () => {
  if (item.value?.id) {
    dialogOption.value.title = '修改公司名称'
    form.value = { ...item.value }
  } else {
    dialogOption.value.title = '新增公司名称'
    handleResetForm()
  }
}, { deep: true })
const formRef = ref(null)

function handleConfirm () {
  formRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善表单')
    dialogOption.value.loading = true
    try {
      if (form.value.id) {
        await companyNameEdit(form.value)
      } else {
        await companyNameAdd(form.value)
      }
      ElMessage.success(dialogOption.value.title + '成功')
      handleResetForm()
      $emit('confirm', form.value)
      diaShow.value = false
    } catch (e) {
      console.error(e)
    } finally {
      dialogOption.value.loading = false
    }
  })
}

function handleClose () {
  handleResetForm()
  diaShow.value = false
  $emit('close', form.value)
}

function handleResetForm () {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-input {
    .el-input__inner {
      height: 38px;
    }
  }
}

:deep(.el-dialog__footer) {
  padding: 0 0 16px 0px !important;
}

.dialog-footer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
