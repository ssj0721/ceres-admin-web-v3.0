<template>
  <div class="form-page">
    <div class="page-top">
      <h1 class="page-title">{{ isEdit ? "编辑申请" : "编制申请" }}</h1>
      <div class="topBtn">
        <el-button v-if="canSave" class="btn-submit" @click="handleSave">保存</el-button>
        <el-button v-if="canSave" class="btn-cancel" @click="handleSaveAndSubmit">保存并提交</el-button>
        <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="formRules" class="mainForm" :disabled="!canSave">
      <!-- 基本信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('basic')">
          <span class="section-title"><span class="section-bar"></span>基本信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.basic" class="form-grid">
          <div class="form-row">
            <label class="form-label">申请类型：</label>
            <div class="form-input"><el-input value="商标变更申请" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标注册编号：</label>
            <div class="form-input"><el-input :value="docNo" disabled class="input-disabled" placeholder="由所选商标带出" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请日期：</label>
            <div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">单据申请人：</label>
            <div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 申请部门：</label>
            <div class="form-input"><el-input v-model="form.applyDepartment" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 境内/境外：</label>
            <div class="form-input">
              <el-select v-model="form.applyScope" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </div>
        <div v-show="!collapsed.basic" class="form-basic-row-full">
          <label class="form-label">备注：</label>
          <div class="form-input"><el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入" /></div>
        </div>
      </div>

      <!-- 商标信息（所选商标现状，只读） -->
      <div class="section">
        <div class="section-header" @click="toggle('brand')">
          <span class="section-title"><span class="section-bar"></span>商标信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.brand" class="form-grid">
          <div class="form-row">
            <label class="form-label">所属国家/地区：</label>
            <div class="form-input"><el-input :value="countryRegionName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标状态：</label>
            <div class="form-input"><el-input :value="statusLabel" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请/注册号：</label>
            <div class="form-input"><el-input :value="docNo" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请/注册人：</label>
            <div class="form-input"><el-input :value="personLabel" disabled class="input-disabled" /></div>
          </div>
        </div>

        <!-- 变更项目三列表 -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="changeRows" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column prop="label" label="变更项目" width="200" align="center" />
            <el-table-column prop="before" label="变更前" min-width="300" />
            <el-table-column label="* 变更后（不变更的仍须填写）" min-width="400">
              <template #default="scope">
                <el-select v-if="scope.row.key === 'afterAgensecId'" v-model="form.afterAgensecId" placeholder="请选择" filterable style="width: 100%">
                  <el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" />
                </el-select>
                <template v-else-if="scope.row.key === 'afterProducsecScope'">
                  <el-input
                    v-model="form.afterProducsecScope"
                    type="textarea"
                    :rows="2"
                    placeholder="格式：类别编号: 商品/服务项目（项目间以；分隔），多个类别以空格分隔，如 9: 计时器; 18: 动物皮;"
                    @blur="checkScopeFormat"
                    @input="onScopeInput"
                  />
                  <div v-if="scopeFormatError" style="color: #f56c6c; font-size: 12px; line-height: 1.6; margin-top: 2px;">{{ scopeFormatError }}</div>
                </template>
                <el-input v-else v-model="form[scope.row.key]" placeholder="请输入" :disabled="!registered" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 代理人及费用信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('agent')">
          <span class="section-title"><span class="section-bar"></span>代理人及费用信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.agent }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.agent" class="form-grid">
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 代理人名称：</label>
            <div class="form-input">
              <el-select v-model="form.agentFee.agentId" placeholder="请选择" filterable style="width: 100%" @change="handleAgentChange">
                <el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 地址：</label>
            <div class="form-input"><el-input v-model="form.agentFee.address" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 外所费用（人民币)：</label>
            <div class="form-input"><el-input v-model="form.agentFee.outsideFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 官费（人民币)：</label>
            <div class="form-input"><el-input v-model="form.agentFee.domesticFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 代理费（人民币)：</label>
            <div class="form-input"><el-input v-model="form.agentFee.agentFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 开户名：</label>
            <div class="form-input"><el-input v-model="form.agentFee.accountName" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 开户行：</label>
            <div class="form-input"><el-input v-model="form.agentFee.bankName" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 收款账号：</label>
            <div class="form-input"><el-input v-model="form.agentFee.bankNumber" placeholder="请输入" /></div>
          </div>
        </div>
        <div v-show="!collapsed.agent" class="form-basic-row-full">
          <label class="form-label">付款公司信息：</label>
          <div class="form-input"><el-input v-model="form.agentFee.payCompany" type="textarea" :rows="3" placeholder="请输入" /></div>
        </div>
      </div>

      <!-- 批件与意见信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('opinion')">
          <span class="section-title"><span class="section-bar"></span>批件与意见信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.opinion }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.opinion" class="form-grid-single">
          <div class="form-row-full">
            <label class="form-label">旭日管理层意见：</label>
            <div class="form-input">
              <el-input v-model="form.managementOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'managementOpinionAttachment')" :on-remove="() => handleOpinionRemove('managementOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.managementOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <span v-if="form.managementOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 附件信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('attachment')">
          <span class="section-title"><span class="section-bar"></span>附件信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.attachment }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.attachment" class="attachment-content">
          <div class="attachment-item">
            <label class="attachment-label">附件：</label>
            <div class="attachment-input">
              <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'attachment')" :on-remove="() => handleOpinionRemove('attachment')">
                <el-button class="btn-upload" plain>{{ form.attachment ? '重新上传' : '上传文件' }}</el-button>
              </el-upload>
              <span v-if="form.attachment" class="upload-status">已上传</span>
            </div>
          </div>
          <div class="attachment-item">
            <label class="attachment-label">备注：</label>
            <div class="attachment-input">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" />
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { brandChangeAdd, brandChangeUpdate, brandChangeSubmit, brandChangeGetDetail, brandChangeGetBrandInfo } from '@/api/trademark/ap/brandChange'
import { scopeOptions, brandStatusOptions } from '../config'
import { agentGetList } from '@/api/trademark/bd/agent'
import { uploadFileApi } from '@/api/file'
import { onMounted, ref, computed } from 'vue'
import { DArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserName } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const isEdit = ref(false)
const basicStatus = ref(null) // 编辑模式基础状态：0待提交 1签批中 2待确认 3已确认
// 仅新建或待提交状态可编辑/保存，提交后整表只读
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const editBasicId = ref(null)   // 编辑模式：申请基本信息ID（提交/审批用）
const editChangeId = ref(null)  // 编辑模式：变更申请ID（update 用）
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

// 所选商标现状（只读展示 + 变更前来源）
const brand = ref(null)
const countryRegionName = ref('')
const beforeAgensecName = ref('')
const categories = ref([])
// 待上传文件（保存时统一上传）
const pendingFiles = ref({ managementOpinionAttachment: null, attachment: null })

const changeHeaderStyle = { background: '#fafafa', textAlign: 'center', color: '#333333', fontWeight: '600' }

function getToday() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

// 类别拼接为“编号: 项目;”文本（变更前展示）
function joinCategories(list) {
  if (!list || !list.length) return ''
  return list.map(c => `${c.brandCategory}: ${c.producsecScope};`).join(' ')
}
const beforeScope = computed(() => joinCategories(categories.value))
const docNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.brandNo || '') : (brand.value.applyNo || '')
})
// 商标申请/注册人：已注册显示注册人，申请中显示申请人（与台账口径一致）
const personLabel = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.registerPerson || '') : (brand.value.applyPerson || '')
})
// 是否已注册：申请中商标尚无注册人/注册人地址，对应变更项禁止输入
const registered = computed(() => !!brand.value && brand.value.applyStatus === 1)
const statusLabel = computed(() => {
  if (!brand.value || brand.value.applyStatus == null) return ''
  const hit = brandStatusOptions.find(o => o.value === brand.value.applyStatus)
  return hit ? hit.label : ''
})

// 变更项目三列表数据
const changeRows = computed(() => [
  { label: '注册人名称', before: (brand.value && brand.value.registerPerson) || '', key: 'afterRegisterName' },
  { label: '注册人地址', before: (brand.value && brand.value.registerAddress) || '', key: 'afterRegisterAddress' },
  { label: '商标代理人', before: beforeAgensecName.value, key: 'afterAgensecId' },
  { label: '商标/服务项目', before: beforeScope.value, key: 'afterProducsecScope' },
])

const form = ref({
  applyNumber: '',
  applyDate: getToday(),
  applyPerson: getUserName() || '',
  applyDepartment: '',
  applyScope: null,
  remarks: '',
  afterRegisterName: '',
  afterRegisterAddress: '',
  afterAgensecId: null,
  afterProducsecScope: '',
  agentFee: { agentId: null, address: '', outsideFee: null, domesticFee: null, agentFee: null, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  managementOpinion: '',
  managementOpinionAttachment: null,
  attachment: null,
  remark: '',
})

const formRules = {}
const options = ref({ agent: [] })
// 变更后-商标/服务项目 格式错误提示
const scopeFormatError = ref('')

/**
 * 校验“变更后-商标/服务项目”文本格式
 * 约定格式与 joinCategories 保持一致：“类别编号: 商品/服务项目;”，多个类别以空格分隔；
 * 类别段内项目以；分隔、可含空格，结尾允许多余的；
 * @returns {string} 错误提示，空串表示通过
 */
function validateScopeFormat(text) {
  const val = (text || '').trim()
  if (!val) return '商标/服务项目不能为空'
  // 以“空白 + 类别编号:”为界切分类别段，避免把段内 ； 分隔的项目误判为新类别
  const segments = val.split(/\s+(?=\d{1,2}\s*[:：])/).map(s => s.trim()).filter(Boolean)
  const seen = []
  for (const seg of segments) {
    const m = seg.match(/^(\d{1,2})\s*[:：]\s*([\s\S]+)$/)
    if (!m) return `格式错误：“${seg}”不符合“类别编号: 商品/服务项目”格式`
    const no = Number(m[1])
    if (no < 1 || no > 45) return `格式错误：类别编号“${no}”应在 1-45 之间`
    if (!m[2].replace(/[;；\s]/g, '')) return `格式错误：类别“${no}”的商品/服务项目不能为空`
    if (seen.includes(no)) return `格式错误：类别“${no}”重复填写`
    seen.push(no)
  }
  return ''
}

function checkScopeFormat() {
  scopeFormatError.value = validateScopeFormat(form.value.afterProducsecScope)
}

// 输入过程中仅在已报错时复检，避免边打字边提示
function onScopeInput() {
  if (scopeFormatError.value) checkScopeFormat()
}

onMounted(() => {
  loadOptions()
  if (route.query.id) {
    // 编辑模式：id 为申请基本信息ID
    isEdit.value = true
    editBasicId.value = Number(route.query.id)
    loadEditData(editBasicId.value)
  } else if (route.query.brandId) {
    // 新建模式：brandId 为被变更商标ID
    loadBrandInfo(Number(route.query.brandId))
  }
})

async function loadOptions() {
  try {
    const a = await agentGetList({ page: 1, pageSize: 1000 })
    options.value = { agent: (a.data && a.data.list) || [] }
  } catch (e) { console.error(e) }
}

// 新建：按商标ID回填变更前 + 商标信息展示，并把变更后预填为当前值
async function loadBrandInfo(brandId) {
  try {
    const res = await brandChangeGetBrandInfo(brandId)
    const vo = res.data
    if (!vo) return
    applyBrandVo(vo)
    form.value.afterRegisterName = (vo.brand && vo.brand.registerPerson) || ''
    form.value.afterRegisterAddress = (vo.brand && vo.brand.registerAddress) || ''
    form.value.afterAgensecId = (vo.brand && vo.brand.agensecId) ?? null
    form.value.afterProducsecScope = joinCategories(vo.categories)
  } catch (e) {
    // 拦截器已全局弹出后端原因（含防冲突拦截提示），此处不重复 toast
    console.error('加载商标信息失败:', e)
  }
}

// 编辑：加载已有变更申请
async function loadEditData(basicId) {
  try {
    const res = await brandChangeGetDetail(basicId)
    const vo = res.data
    if (!vo) return
    editChangeId.value = vo.changeId
    applyBrandVo(vo)
    if (vo.basic) {
      basicStatus.value = vo.basic.status
      form.value.applyNumber = vo.basic.applyNumber || ''
      form.value.applyDate = vo.basic.applyDate || getToday()
      form.value.applyPerson = vo.basic.applyPerson || ''
      form.value.applyDepartment = vo.basic.applyDepartment || ''
      form.value.applyScope = vo.basic.applyScope
      form.value.remarks = vo.basic.remarks || ''
    }
    if (vo.agentFee) {
      form.value.agentFee = {
        agentId: vo.agentFee.agentId,
        address: vo.agentFee.address || '',
        outsideFee: vo.agentFee.outsideFee,
        domesticFee: vo.agentFee.domesticFee,
        agentFee: vo.agentFee.agentFee,
        accountName: vo.agentFee.accountName || '',
        bankName: vo.agentFee.bankName || '',
        bankNumber: vo.agentFee.bankNumber || '',
        payCompany: vo.agentFee.payCompany || ''
      }
    }
    if (vo.change) {
      form.value.afterRegisterName = vo.change.afterRegisterName || ''
      form.value.afterRegisterAddress = vo.change.afterRegisterAddress || ''
      form.value.afterAgensecId = vo.change.afterAgensecId ?? null
      form.value.afterProducsecScope = vo.change.afterProducsecScope || ''
      form.value.managementOpinion = vo.change.managementOpinion || ''
      form.value.managementOpinionAttachment = vo.change.managementOpinionAttachment
      form.value.attachment = vo.change.attachment
      form.value.remark = vo.change.remark || ''
    }
  } catch (e) {
    console.error('加载编辑数据失败:', e)
    ElMessage.error('加载数据失败')
  }
}

// 把 BrandChangeVO 中的商标现状部分套到只读展示区
function applyBrandVo(vo) {
  brand.value = vo.brand || null
  countryRegionName.value = vo.countryRegionName || ''
  beforeAgensecName.value = vo.beforeAgensecName || ''
  categories.value = vo.categories || []
}

function handleAgentChange(agentId) {
  if (!agentId) return
  const agent = options.value.agent.find(a => a.id === agentId)
  if (agent) {
    form.value.agentFee.address = agent.agentAddress || ''
    form.value.agentFee.accountName = agent.accountName || ''
    form.value.agentFee.bankName = agent.bankName || ''
    form.value.agentFee.bankNumber = agent.receiptAccount || ''
  }
}

// 附件选择（暂存，保存时统一上传）
function handleOpinionUpload(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
}
function handleOpinionRemove(field) {
  pendingFiles.value[field] = null
  form.value[field] = null
}

async function uploadPendingFiles() {
  for (const field of ['managementOpinionAttachment', 'attachment']) {
    const file = pendingFiles.value[field]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('fileList', file)
        const res = await uploadFileApi(formData)
        const fileId = res.data && res.data.fileId
        if (fileId) form.value[field] = fileId
      } catch (e) {
        console.error(field + ' 上传失败:', e)
        throw new Error(field + ' 上传失败')
      }
    }
  }
}

function buildParam() {
  return {
    id: isEdit.value ? editChangeId.value : undefined,
    brandId: (brand.value && brand.value.id) || Number(route.query.brandId),
    apBasicParam: {
      applyNumber: form.value.applyNumber || Date.now(),
      applyDate: form.value.applyDate,
      applyScope: form.value.applyScope,
      applyPerson: form.value.applyPerson,
      applyDepartment: form.value.applyDepartment,
      remarks: form.value.remarks,
    },
    apAgentFeeParam: {
      agentId: form.value.agentFee.agentId,
      address: form.value.agentFee.address,
      outsideFee: form.value.agentFee.outsideFee,
      domesticFee: form.value.agentFee.domesticFee,
      agentFee: form.value.agentFee.agentFee,
      accountName: form.value.agentFee.accountName,
      bankName: form.value.agentFee.bankName,
      bankNumber: form.value.agentFee.bankNumber,
      payCompany: form.value.agentFee.payCompany,
    },
    afterRegisterName: form.value.afterRegisterName,
    afterRegisterAddress: form.value.afterRegisterAddress,
    afterAgensecId: form.value.afterAgensecId,
    afterProducsecScope: form.value.afterProducsecScope,
    managementOpinion: form.value.managementOpinion,
    managementOpinionAttachment: form.value.managementOpinionAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

async function doSave() {
  checkScopeFormat()
  if (scopeFormatError.value) {
    ElMessage.error(scopeFormatError.value)
    return
  }
  await formRef.value.validate()
  await uploadPendingFiles()
  const param = buildParam()
  if (isEdit.value) {
    await brandChangeUpdate(param)
  } else {
    const res = await brandChangeAdd(param)
    if (res && res.data) editBasicId.value = res.data
  }
  ElMessage.success('保存成功')
}

function handleSave() {
  doSave().catch(e => {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error('请完善表单')
  })
}

async function handleSaveAndSubmit() {
  try {
    checkScopeFormat()
    if (scopeFormatError.value) {
      ElMessage.error(scopeFormatError.value)
      return
    }
    await formRef.value.validate()
    await uploadPendingFiles()
    const param = buildParam()
    let basicId = editBasicId.value
    if (isEdit.value) {
      await brandChangeUpdate(param)
    } else {
      const res = await brandChangeAdd(param)
      if (res && res.data) basicId = res.data
    }
    if (basicId) await brandChangeSubmit(basicId)
    ElMessage.success('提交成功')
    router.back()
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error('请完善表单')
  }
}

function handleCancel() { router.back() }
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  margin: 0 80px;

  .page-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .page-title {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #333333;
    margin: 0 0 20px 0;
  }

  .topBtn {
    display: flex;
    margin-bottom: 24px;

    .btn-cancel {
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
    }
    .btn-submit {
      background: #1890FF;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 14px;
    }
  }

  .section {
    margin-bottom: 32px;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f2f8ff;
      padding: 10px 16px;
      margin-bottom: 20px;
      color: #333333;
      margin-right: 20px;
      cursor: pointer;

      .section-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #333333;

        .section-bar {
          display: inline-block;
          width: 4px;
          height: 18px;
          background: #1890FF;
          margin-right: 8px;
          border-radius: 2px;
        }
      }
      .collapse-icon {
        color: #1890FF;
        transform: rotate(90deg);
        transition: transform 0.2s;
        &.collapsed { transform: rotate(0deg); }
      }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 100px;
    padding: 0 260px 0 120px;
  }

  .form-grid-single {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 260px 0 120px;
  }

  .form-row {
    display: flex;
    align-items: flex-start;

    .form-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;
      font-weight: 500 !important;

      .req {
        color: #FF4D4F;
        margin-right: 2px;
        font-weight: 700;
      }
    }

    .form-input {
      flex: 1;
      min-width: 0;
    }
  }

  .form-basic-row-full {
    display: flex;
    align-items: flex-start;
    padding: 20px 380px 0 120px;

    .form-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;
      font-weight: 500 !important;
    }

    .form-input {
      flex: 1;
      min-width: 0;
    }
  }

  .form-row-full {
    display: flex;
    align-items: flex-start;
    padding: 0px 120px 0 0;

    .form-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;
      font-weight: 500 !important;
    }

    .form-input {
      flex: 1;
      min-width: 0;
    }
  }

  .categoryTable {
    margin-top: 25px;
    padding: 0 60px 0 60px;

    :deep(.el-table) { border: none; }
    :deep(.el-table__header) {
      th {
        background: #FAFAFA;
        color: #333333;
        font-weight: 600;
        border: none;
        border-bottom: 1px solid #EBEEF5;
      }
    }
    :deep(.el-table__body) {
      td {
        height: 50px;
        border: none;
        border-bottom: 1px solid #EBEEF5;
      }
    }
    :deep(.el-table::before) { display: none; }
  }

  .btn-upload {
    border-radius: 6px;
    font-size: 14px;
    padding: 15px 15px;
    font-weight: 500 !important;
  }

  .opinion-upload {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;

    .upload-status {
      font-size: 12px;
      color: #67C23A;
    }
  }

  .upload-status {
    font-size: 12px;
    color: #67C23A;
    margin-left: 8px;
  }

  .attachment-content {
    padding: 0 20px;

    .attachment-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 0 300px 0 100px;

      .attachment-label {
        flex: 0 0 150px;
        text-align: right;
        padding-right: 12px;
        color: #333333;
        font-family: 'Microsoft YaHei', sans-serif;
        font-size: 14px;
        line-height: 36px;
        white-space: nowrap;
      }

      .attachment-input {
        flex: 1;
        min-width: 0;
      }
    }
  }

  :deep(.input-disabled .el-input__inner) {
    background-color: #F5F5F5;
    color: #999999;
    border-color: #D9D9D9;
  }
}
</style>
