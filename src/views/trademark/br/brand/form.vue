<template>
  <div class="form_content">
    <el-dialog
      v-model="diaShow"
      :close-on-click-modal="false"
      :title="dialogOption.title"
      width="720px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商标注册号：" prop="brandNo">
              <el-input v-model="form.brandNo" placeholder="请输入商标注册号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标申请号：" prop="applyNo">
              <el-input v-model="form.applyNo" placeholder="请输入商标申请号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请状态：" prop="applyStatus">
              <el-radio-group v-model="form.applyStatus">
                <el-radio :value="0">申请中</el-radio>
                <el-radio :value="1">已注册</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标状态：" prop="brandStatus">
              <el-select v-model="form.brandStatus" placeholder="请选择商标状态" clearable style="width: 100%">
                <el-option v-for="(label, value) in brandStatusMap" :key="value" :label="label" :value="Number(value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册类型：" prop="registerType">
              <el-select v-model="form.registerType" placeholder="请选择注册类型" style="width: 100%">
                <el-option v-for="(label, value) in registerTypeMap" :key="value" :label="label" :value="Number(value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家/地区：" prop="countryRegionId">
              <el-select v-model="form.countryRegionId" placeholder="请选择国家/地区" clearable filterable style="width: 100%">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标权利人：" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择商标权利人" clearable filterable style="width: 100%">
                <el-option v-for="item in options.companyName" :key="item.id" :label="item.companyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标系列：" prop="seriesId">
              <el-select v-model="form.seriesId" placeholder="请选择商标系列" clearable filterable style="width: 100%">
                <el-option v-for="item in options.brandSeries" :key="item.id" :label="item.seriesName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="境内境外：" prop="scopeType">
              <el-select v-model="form.scopeType" placeholder="请选择境内境外" clearable style="width: 100%">
                <el-option v-for="(label, value) in scopeTypeMap" :key="value" :label="label" :value="Number(value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效：" prop="isValid">
              <el-select v-model="form.isValid" placeholder="请选择是否有效" clearable style="width: 100%">
                <el-option v-for="(label, value) in isValidMap" :key="value" :label="label" :value="Number(value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理人：" prop="agensecId">
              <el-select v-model="form.agensecId" placeholder="请选择代理人" clearable filterable style="width: 100%">
                <el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="正本存储位置：" prop="storageId">
              <el-select v-model="form.storageId" placeholder="请选择正本存储位置" clearable filterable style="width: 100%">
                <el-option v-for="item in options.originalStorage" :key="item.id" :label="item.address" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标品牌类别：" prop="producsecScopeId">
              <el-select v-model="form.producsecScopeId" placeholder="请选择商标品牌类别" clearable filterable style="width: 100%">
                <el-option v-for="item in options.brandCategory" :key="item.id" :label="item.type" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标负责人：" prop="manager">
              <el-input v-model="form.manager" placeholder="请输入商标负责人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商标图样：" prop="brandPicUrl">
              <el-input v-model="form.brandPicUrl" placeholder="请输入商标图样URL" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首次申请日期：" prop="firssecApplyDate">
              <el-date-picker
                v-model="form.firssecApplyDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择首次申请日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册证下发日期：" prop="registrationDate">
              <el-date-picker
                v-model="form.registrationDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择注册证下发日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期开始：" prop="validityStarsecDate">
              <el-date-picker
                v-model="form.validityStarsecDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择有效期开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期结束：" prop="validityEndDate">
              <el-date-picker
                v-model="form.validityEndDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择有效期结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续展申请日期：" prop="renewalDate">
              <el-date-picker
                v-model="form.renewalDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择续展申请日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续展状态：" prop="renewalStatus">
              <el-radio-group v-model="form.renewalStatus">
                <el-radio :value="0">未续展</el-radio>
                <el-radio :value="1">已续展</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转让状态：" prop="transferStatus">
              <el-radio-group v-model="form.transferStatus">
                <el-radio :value="0">未转让</el-radio>
                <el-radio :value="1">已转让</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商标备注：" prop="brandRemarks">
              <el-input v-model="form.brandRemarks" type="textarea" :rows="3" maxlength="600" show-word-limit placeholder="请输入商标备注" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { brBrandAdd, brBrandEdit } from '@/api/trademark/br/brBrand'
import {
  applyStatusMap,
  brandStatusMap,
  registerTypeMap,
  scopeTypeMap,
  isValidMap,
  renewalStatusMap,
  transferStatusMap,
} from './config'
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
  options: {
    type: Object,
    default: () => ({}),
  },
})
const { show, item, options } = toRefs(props)
const dialogOption = ref({
  loading: false,
  title: '新增商标信息',
})
const form = ref({
  id: null,
  brandNo: null,
  applyNo: null,
  applyStatus: null,
  registerType: null,
})
const formRules = {
  brandNo: [
    { required: true, message: '请输入商标注册号', trigger: 'blur' },
  ],
  applyStatus: [
    { required: true, message: '请选择申请状态', trigger: 'change' },
  ],
  registerType: [
    { required: true, message: '请选择注册类型', trigger: 'change' },
  ],
}
const $emit = defineEmits(['update:show', 'confirm', 'close'])
const diaShow = computed({
  get: () => show.value,
  set: (value) => $emit('update:show', value),
})
// Format date fields to YYYY-MM-DD for the date picker
function formatDates(obj) {
  const dateFields = ['firssecApplyDate', 'validityStarsecDate', 'validityEndDate', 'registrationDate', 'renewalDate']
  dateFields.forEach(f => {
    if (obj[f] && typeof obj[f] === 'string') {
      obj[f] = obj[f].substring(0, 10)
    }
  })
  return obj
}

watch(item, () => {
  if (item.value?.id) {
    dialogOption.value.title = '修改商标信息'
    form.value = formatDates({ ...item.value })
  } else {
    dialogOption.value.title = '新增商标信息'
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
        await brBrandEdit(form.value)
      } else {
        await brBrandAdd(form.value)
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
