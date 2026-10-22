<template>
  <div class="form-page">
    <div class="page-top">
      <h1 class="page-title">{{ isEdit ? "编辑申请" : "编制申请" }}</h1>
      <div class="topBtn">
        <el-button v-if="canSave" class="btn-submit" :loading="saving" @click="handleSave">保存</el-button>
        <el-button v-if="canSave" class="btn-cancel" :loading="saving" @click="handleSaveAndSubmit">保存并提交</el-button>
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
            <div class="form-input"><el-input value="商标续展申请" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标注册编号：</label>
            <div class="form-input"><el-input :value="registerNo" disabled class="input-disabled" placeholder="由所选商标带出" /></div>
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

      <!-- 商标信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('brand')">
          <span class="section-title"><span class="section-bar"></span>商标信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.brand" class="form-grid">
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 所属国家/地区：</label>
            <div class="form-input">
              <el-select v-model="form.countryRegionId" placeholder="请选择" filterable style="width: 100%">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请/注册号：</label>
            <div class="form-input"><el-input :value="registerNo" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标注册人：</label>
            <div class="form-input"><el-input v-model="form.registerPerson" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 注册地址：</label>
            <div class="form-input"><el-input v-model="form.registerAddress" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标专用权开始日：</label>
            <div class="form-input">
              <el-date-picker v-model="form.validityStartDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%" />
            </div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标专用权结束日：</label>
            <div class="form-input">
              <el-date-picker v-model="form.validityEndDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%" />
            </div>
          </div>
        </div>

        <!-- 商标图样 -->
        <div v-show="!collapsed.brand" class="form-basic-row-full">
          <label class="form-label">商标图样：</label>
          <div class="form-input">
            <div class="brand-preview-wrap">
              <img v-if="brandImageUrl" :src="brandImageUrl" class="brand-preview-img" />
              <el-upload class="brand-uploader" :auto-upload="false" :limit="1" accept=".jpg,.jpeg" :on-change="handleBrandChange">
                <el-button class="btn-upload" plain>{{ brandImageUrl ? '重新上传' : '上传图片' }}</el-button>
                <template #tip><div class="upload-tip">注：图片限制JPG格式、英文文件名</div></template>
              </el-upload>
            </div>
          </div>
        </div>

        <!-- 续展理由 -->
        <div v-show="!collapsed.brand" class="form-basic-row-full">
          <label class="form-label"><span class="req">*</span> 续展理由：</label>
          <div class="form-input"><el-input v-model="form.renewalReason" type="textarea" :rows="3" placeholder="请输入" /></div>
        </div>

        <!-- 类别编辑表 -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="categoryHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="70" align="center" />
            <el-table-column label="* 类别编号" width="180" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.categoryNo" placeholder="请输入" :disabled="!canSave" />
              </template>
            </el-table-column>
            <el-table-column label="* 商品/服务项目" min-width="400">
              <template #default="scope">
                <el-input v-model="scope.row.productService" placeholder="请输入" :disabled="!canSave" />
              </template>
            </el-table-column>
            <el-table-column v-if="canSave" label="操作" width="120" align="center">
              <template #default="scope">
                <el-button type="primary" link :icon="Plus" circle @click="addCategory(scope.$index)" />
                <el-button type="danger" link :icon="Minus" circle :disabled="form.categories.length <= 1" @click="removeCategory(scope.$index)" />
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
                <a v-if="form.managementOpinionAttachment && fileUrlMap['managementOpinionAttachment']" :href="fileUrlMap['managementOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['managementOpinionAttachment'].name || '查看文件' }}</a>
                <span v-else-if="form.managementOpinionAttachment" class="upload-status">已上传</span>
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
              <AttachmentUpload ref="attUpload" v-model="attachmentList" :readonly="!canSave" />
              
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
import { renewalAdd, renewalUpdate, renewalSubmit, renewalGetDetail, renewalGetBrandInfo } from '@/api/trademark/ap/renewal'
import { scopeOptions } from '../config'
import { agentGetList } from '@/api/trademark/bd/agent'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'
import AttachmentUpload from '@/components/AttachmentUpload.vue'
import { onMounted, ref, computed, reactive} from 'vue'
import { Plus, Minus, DArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserName } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const isEdit = ref(false)
const basicStatus = ref(null) // 编辑模式基础状态：0待提交 1签批中 2待确认 3已确认
// 仅新建或待提交状态可编辑/保存，提交后整表只读
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const editBasicId = ref(null)  // 编辑模式：申请基本信息ID（提交用）
const editRenewalId = ref(null) // 编辑模式：续展申请ID（update 用）
const editBrandId = ref(null)  // 编辑模式：被续展商标ID
// 保存/提交进行中标记，防止连点重复建单
const saving = ref(false)
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

// 商标图样预览（URL），表单存 fileId
const brandImageUrl = ref('')
// 待上传文件（保存时统一上传）
const pendingFiles = ref({ brandPicUrl: null, managementOpinionAttachment: null, attachment: null })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const attUpload = ref(null)

const categoryHeaderStyle = { background: '#fafafa', textAlign: 'center', color: '#333333', fontWeight: '600' }

function getToday() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

// 后端 null 的可空对象（LocalDate/Integer/Long）经全局序列化器会变成 {}，统一归一为 null
// 组件形态（{year,monthValue,dayOfMonth}）还原为 YYYY-MM-DD 字符串
function norm(v) {
  if (v && typeof v === 'object') {
    if (v.year != null && v.monthValue != null && v.dayOfMonth != null) {
      return v.year + '-' + String(v.monthValue).padStart(2, '0') + '-' + String(v.dayOfMonth).padStart(2, '0')
    }
    return null
  }
  return v === undefined ? null : v
}

// 商标注册编号（只读展示，由所选商标带出）
const registerNo = ref('')

const form = ref({
  applyNumber: '',
  applyDate: getToday(),
  applyPerson: getUserName() || '',
  applyDepartment: '',
  applyScope: null,
  remarks: '',
  countryRegionId: null,
  registerPerson: '',
  registerAddress: '',
  validityStartDate: '',
  validityEndDate: '',
  renewalReason: '',
  categories: [{ categoryNo: '', productService: '' }],
  agentFee: { agentId: null, address: '', outsideFee: null, domesticFee: null, agentFee: null, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  managementOpinion: '',
  managementOpinionAttachment: null,
  brandPicUrl: null,
  attachment: null,
  remark: '',
})

const formRules = {}
const options = ref({ agent: [], countryRegion: [] })

onMounted(() => {
  loadOptions()
  if (route.query.id) {
    // 编辑模式：id 为申请基本信息ID
    isEdit.value = true
    editBasicId.value = Number(route.query.id)
    loadEditData(editBasicId.value)
  } else if (route.query.brandId) {
    // 新建模式：brandId 为被续展商标ID
    loadBrandInfo(Number(route.query.brandId))
  }
})

async function loadOptions() {
  try {
    const a = await agentGetList({ page: 1, pageSize: 1000 })
    const c = await countryRegionGetList({ page: 1, pageSize: 1000 })
    options.value = { agent: (a.data && a.data.list) || [], countryRegion: (c.data && c.data.list) || [] }
  } catch (e) { console.error(e) }
}

// 新建：按商标ID回填商标信息（注册人/地址/权期限/类别预填为当前值）
async function loadBrandInfo(brandId) {
  try {
    const res = await renewalGetBrandInfo(brandId)
    const vo = res.data
    if (!vo) return
    editBrandId.value = vo.brandId || brandId
    applyBrandVo(vo)
    const info = vo.renewal || {}
    form.value.countryRegionId = norm(vo.countryRegionId)
    form.value.registerPerson = info.applyRegisterPerson || ''
    form.value.registerAddress = info.applyRegisterAddress || ''
    form.value.validityStartDate = norm(info.applyValidityStartDate) || ''
    form.value.validityEndDate = norm(info.applyValidityEndDate) || ''
  } catch (e) {
    // 拦截器已全局弹出后端原因（含防冲突拦截提示），此处不重复 toast
    console.error('加载商标信息失败:', e)
  }
}

// 编辑：加载已有续展申请
async function loadEditData(basicId) {
  try {
    const res = await renewalGetDetail(basicId)
    const vo = res.data
    if (!vo) return
    editRenewalId.value = vo.renewalId
    editBrandId.value = vo.brandId
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
    if (vo.renewal) {
      const info = vo.renewal
      form.value.countryRegionId = norm(vo.countryRegionId) ?? norm(info.confirmCountryRegionId)
      form.value.registerPerson = info.applyRegisterPerson || ''
      form.value.registerAddress = info.applyRegisterAddress || ''
      form.value.validityStartDate = norm(info.applyValidityStartDate) || ''
      form.value.validityEndDate = norm(info.applyValidityEndDate) || ''
      form.value.renewalReason = info.renewalReason || ''
      form.value.managementOpinion = info.managementOpinion || ''
      form.value.managementOpinionAttachment = info.managementOpinionAttachment
      resolveFileUrl('managementOpinionAttachment', info.managementOpinionAttachment)
      form.value.attachment = info.attachment
      if (info.attachmentList && info.attachmentList.length) {
      attachmentList.value = info.attachmentList
    } else if (info.attachment) {
      const n = String(info.attachment).includes('/') ? String(info.attachment).split('/').pop() : ''
      getImageUrl(info.attachment).then(r => { if (r && r.data) attachmentList.value = [{ fileName: n || '查看文件', url: r.data, fileId: info.attachment }] }).catch(() => {})
    }
      form.value.remark = info.remark || ''
    }
  } catch (e) {
    console.error('加载编辑数据失败:', e)
    ElMessage.error('加载数据失败')
  }
}

// 把 RenewalVO 中的商标现状部分套到只读展示区
function applyBrandVo(vo) {
  registerNo.value = (vo.renewal && vo.renewal.applyRegisterNo) || ''
  // 商标图样：后端已解析为URL则直接展示，否则按 fileId 换取URL；保存时才回传新上传的 fileId
  if (vo.brandPicUrl) {
    if (/^https?:\/\//.test(vo.brandPicUrl)) {
      brandImageUrl.value = vo.brandPicUrl
    } else {
      getImageUrl(vo.brandPicUrl).then(res => {
        if (res && res.data) brandImageUrl.value = res.data
      }).catch(() => {})
    }
  }
  const list = (vo.categories || []).map(c => ({ categoryNo: norm(c.brandCategory) == null ? '' : String(norm(c.brandCategory)), productService: c.producsecScope || '' }))
  if (list.length) form.value.categories = list
}

function addCategory(i) {
  form.value.categories.splice(i + 1, 0, { categoryNo: '', productService: '' })
}
function removeCategory(i) {
  if (form.value.categories.length > 1) form.value.categories.splice(i, 1)
}

// 类别子表校验：全空行视为未填写跳过，半空行报错
function validateCategories() {
  const rows = form.value.categories.filter(c => c.categoryNo || c.productService)
  if (!rows.length) return '请至少填写一条类别信息'
  const seen = []
  for (const c of rows) {
    const no = Number(c.categoryNo)
    if (!c.categoryNo || !Number.isInteger(no) || no < 1 || no > 45) return `类别编号“${c.categoryNo || ''}”应为 1-45 之间的整数`
    if (!String(c.productService || '').replace(/[;；\s]/g, '')) return `类别“${no}”的商品/服务项目不能为空`
    if (seen.includes(no)) return `类别“${no}”重复填写`
    seen.push(no)
  }
  return ''
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

// 商标图样选择（暂存，保存时统一上传）
function handleBrandChange(file) {
  pendingFiles.value.brandPicUrl = file.raw
  form.value.brandPicUrl = null
  brandImageUrl.value = URL.createObjectURL(file.raw)
}


function resolveFileUrl(field, fileId) {
  if (!fileId) return
  const name = fileId.includes('/') ? fileId.split('/').pop() : ''
  fileUrlMap[field] = { url: fileId, name }
  if (!/^https?:\/\//.test(fileId)) {
    getImageUrl(fileId).then(res => {
      if (res && res.data) {
        const n = res.data.includes('/') ? res.data.split('/').pop() : name
        fileUrlMap[field] = { url: res.data, name: n }
      }
    }).catch(() => {})
  }
}
// 附件选择（暂存，保存时统一上传）
function handleOpinionUpload(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
  if (field === 'attachment') { attachmentList.value = [] }
}
function handleOpinionRemove(field) {
  pendingFiles.value[field] = null
  form.value[field] = null
  delete fileUrlMap[field]
  if (field === 'attachment') { attachmentList.value = [] }
}

async function uploadPendingFiles() {
  for (const field of ['brandPicUrl', 'managementOpinionAttachment', 'attachment']) {
    const file = pendingFiles.value[field]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('fileList', file)
        const res = await uploadFileApi(formData)
        const fileId = res.data && res.data.fileId
        if (fileId) form.value[field] = String(fileId)
      } catch (e) {
        console.error(field + ' 上传失败:', e)
        throw new Error(field + ' 上传失败')
      }
    }
  }
}

function buildParam() {
  return {
    id: isEdit.value ? editRenewalId.value : undefined,
    brandId: editBrandId.value || Number(route.query.brandId),
    apBasicParam: {
      applyNumber: form.value.applyNumber || '',
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
    applyScope: form.value.applyScope,
    countryRegionId: form.value.countryRegionId,
    registerPerson: form.value.registerPerson,
    registerAddress: form.value.registerAddress,
    brandPicUrl: form.value.brandPicUrl,
    validityStartDate: form.value.validityStartDate || null,
    validityEndDate: form.value.validityEndDate || null,
    renewalReason: form.value.renewalReason,
    categories: form.value.categories
      .filter(c => c.categoryNo || c.productService)
      .map(c => ({ categoryNo: c.categoryNo, productService: c.productService })),
    managementOpinion: form.value.managementOpinion,
    managementOpinionAttachment: form.value.managementOpinionAttachment,
    attachment: form.value.attachment,
    attachments: attachmentList.value.map(a => a.fileId).filter(Boolean),
    remark: form.value.remark,
  }
}

async function doSave() {
  if (saving.value) return false
  saving.value = true
  try {
    const err = validateCategories()
    if (err) {
      ElMessage.error(err)
      return false
    }
    try {
      await formRef.value.validate()
    } catch (e) {
      ElMessage.error('请完善表单')
      return false
    }
    await uploadPendingFiles()
    if (attUpload.value) await attUpload.value.flush()
    const param = buildParam()
    if (isEdit.value) {
      await renewalUpdate(param)
    } else {
      // 新建保存成功后立即转为编辑模式，之后的保存都走更新，避免重复建单
      const res = await renewalAdd(param)
      const data = res && res.data
      // 兼容后端返回：{id, applyNo} 或旧版纯ID
      const newId = data && typeof data === 'object' ? data.id : data
      if (newId) {
        editBasicId.value = newId
        editRenewalId.value = newId
        editBrandId.value = param.brandId
        isEdit.value = true
        basicStatus.value = 0
      }
      // 回填后端返回的申请编号（后续保存复用同一编号，后端幂等即可命中）
      const newApplyNo = data && typeof data === 'object' ? data.applyNo : ''
      form.value.applyNumber = String(newApplyNo || param.apBasicParam.applyNumber || '')
      if (newId && Number(route.query.id) !== Number(newId)) {
        router.replace({ query: { ...route.query, id: newId } })
      }
    }
    ElMessage.success('保存成功')
    return true
  } catch (e) {
    // 失败原因（如：当前单据已送批，无法修改）已由请求拦截器统一提示
    console.error(e)
    return false
  } finally {
    saving.value = false
  }
}

function handleSave() {
  doSave()
}

async function handleSaveAndSubmit() {
  if (saving.value) return
  // 先保存（新建即创建、已有单据即更新），保存失败则中止提交
  const ok = await doSave()
  if (!ok) return
  saving.value = true
  try {
    await renewalSubmit(editBasicId.value)
    ElMessage.success('提交成功')
    router.back()
  } catch (e) {
    // 失败原因（如：当前单据已送批）已由请求拦截器统一提示
    console.error(e)
  } finally {
    saving.value = false
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

  .brand-preview-wrap {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .brand-preview-img {
      max-width: 200px;
      max-height: 120px;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      object-fit: contain;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #999999;
    line-height: 1.6;
    margin-top: 4px;
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

  .file-link { color: #409eff; text-decoration: none; margin-left: 8px; font-size: 13px; }
.file-link:hover { text-decoration: underline; }
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
