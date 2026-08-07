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
          label="代理人："
          prop="agent"
        >
          <el-input
            v-model="form.agent"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入代理人"
          />
        </el-form-item>
        <el-form-item
          label="代理人地址："
          prop="agentAddress"
        >
          <el-input
            v-model="form.agentAddress"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入代理人地址"
          />
        </el-form-item>
        <el-form-item
          label="开户名："
          prop="accountName"
        >
          <el-input
            v-model="form.accountName"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入开户名"
          />
        </el-form-item>
        <el-form-item
          label="开户行："
          prop="bankName"
        >
          <el-input
            v-model="form.bankName"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入开户行"
          />
        </el-form-item>
        <el-form-item
          label="收款账号："
          prop="receiptAccount"
        >
          <el-input
            v-model="form.receiptAccount"
            maxlength="255"
            clearable
            type="text"
            placeholder="请输入收款账号"
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
import { agentAdd, agentEdit } from '@/api/trademark/bd/agent'
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
  title: '新增商标代理人',
})
const form = ref({
  id: null,
  agent: null,
  agentAddress: null,
  accountName: null,
  bankName: null,
  receiptAccount: null,
})
const formRules = {
  agent: [
    { required: true, message: '请输入代理人', trigger: 'blur' },
  ],
}
const $emit = defineEmits(['update:show', 'confirm', 'close'])
const diaShow = computed({
  get: () => show.value,
  set: (value) => $emit('update:show', value)
})
watch(item, () => {
  if (item.value?.id) {
    dialogOption.value.title = '修改商标代理人'
    form.value = { ...item.value }
  } else {
    dialogOption.value.title = '新增商标代理人'
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
        await agentEdit(form.value)
      } else {
        await agentAdd(form.value)
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
