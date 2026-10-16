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

    <el-form ref="formRef" :model="form" class="mainForm" :disabled="!canSave">
      <!-- 基本信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('basic')">
          <span class="section-title"><span class="section-bar"></span>基本信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.basic" class="form-grid">
          <div class="form-row"><label class="form-label">申请类型：</label><div class="form-input"><el-input value="商标异议复审申请(我司为异议人)" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请编号：</label><div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div></div>
          <div class="form-row"><label class="form-label">单据申请人：</label><div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请日期：</label><div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请部门：</label><div class="form-input"><el-input v-model="form.applyDepartment" placeholder="请输入" /></div></div>
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
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 所属国家/地区：</label><div class="form-input"><el-select v-model="form.countryRegion" placeholder="请选择" style="width: 100%"><el-option label="全部" value="全部" /><el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.name" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 境内/境外：</label><div class="form-input"><el-select v-model="form.scopeType" placeholder="请选择" style="width: 100%"><el-option label="境内" :value="1" /><el-option label="境外" :value="2" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 被异议人：</label><div class="form-input"><el-input v-model="form.opposedPerson" placeholder="请输入" /></div></div>
          <div class="form-row"><label class="form-label">被异议商标：</label><div class="form-input"><img v-if="brandPicUrl" :src="brandPicUrl" class="brand-preview" /><span v-else class="upload-status">由所选商标自动带出</span></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 引证商标申请/注册编号：</label><div class="form-input"><el-input v-model="form.citedTrademarkNo" placeholder="请输入"><template #suffix><el-icon class="search-icon"><Search /></el-icon></template></el-input></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 异议人：</label><div class="form-input"><el-input v-model="form.objector" placeholder="请输入" /></div></div>
          <div class="form-row"><label class="form-label">类别数量：</label><div class="form-input"><el-input :value="form.categories.length" disabled class="input-disabled" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 异议结果：</label><div class="form-input"><el-select v-model="form.objectionResult" placeholder="请选择" style="width: 100%"><el-option label="全部" value="全部" /><el-option label="成立" value="成立" /><el-option label="不成立" value="不成立" /><el-option label="部分成立" value="部分成立" /></el-select></div></div>
        </div>
        <div v-show="!collapsed.brand" class="form-basic-row-full">
          <label class="form-label"><span class="req">*</span> 异议理由：</label>
          <div class="form-input"><el-input v-model="form.objectionReason" type="textarea" :rows="3" placeholder="请输入" /></div>
        </div>
        <div v-show="!collapsed.brand" class="form-basic-row-full">
          <label class="form-label"><span class="req">*</span> 复审理由：</label>
          <div class="form-input"><el-input v-model="form.reviewReason" type="textarea" :rows="3" placeholder="请输入" /></div>
        </div>

        <!-- 类别子表 -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="150" align="center" />
            <el-table-column label="类别编号" min-width="50"><template #default="scope"><el-input v-model="scope.row.categoryNo" placeholder="请输入" /></template></el-table-column>
            <el-table-column label="异议商品/服务项目" min-width="400"><template #default="scope"><el-input v-model="scope.row.objectionProductService" placeholder="请输入" /></template></el-table-column>
            <el-table-column label="操作" width="140" align="center"><template #default="scope"><div class="category-actions"><el-button class="btn-circle" @click="addCategory(scope.$index)"><el-icon><Plus /></el-icon></el-button><el-button class="btn-circle" @click="removeCategory(scope.$index)" :disabled="form.categories.length <= 1"><el-icon><Minus /></el-icon></el-button></div></template></el-table-column>
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
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 代理人名称：</label><div class="form-input"><el-select v-model="form.agentFee.agentId" placeholder="请选择" filterable style="width: 100%" @change="handleAgentChange"><el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 地址：</label><div class="form-input"><el-input v-model="form.agentFee.address" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 外所费用（人民币)：</label><div class="form-input"><el-input v-model="form.agentFee.outsideFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 官费（人民币)：</label><div class="form-input"><el-input v-model="form.agentFee.domesticFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 代理费（人民币)：</label><div class="form-input"><el-input v-model="form.agentFee.agentFee" placeholder="请输入" type="number"><template #append>元</template></el-input></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 开户名：</label><div class="form-input"><el-input v-model="form.agentFee.accountName" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 开户行：</label><div class="form-input"><el-input v-model="form.agentFee.bankName" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 收款账号：</label><div class="form-input"><el-input v-model="form.agentFee.bankNumber" placeholder="请输入" /></div></div>
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
          <div class="form-row-full"><label class="form-label">商标局批件意见：</label><div class="form-input"><el-input v-model="form.tmOfficeOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'tmOfficeOpinionAttachment')" :on-remove="() => handleOpinionRemove('tmOfficeOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.tmOfficeOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.tmOfficeOpinionAttachment && fileUrlMap['tmOfficeOpinionAttachment']" :href="fileUrlMap['tmOfficeOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['tmOfficeOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
          <div class="form-row-full"><label class="form-label">代理人意见：</label><div class="form-input"><el-input v-model="form.agentOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'agentOpinionAttachment')" :on-remove="() => handleOpinionRemove('agentOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.agentOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.agentOpinionAttachment && fileUrlMap['agentOpinionAttachment']" :href="fileUrlMap['agentOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['agentOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
          <div class="form-row-full"><label class="form-label">旭日内部法律意见：</label><div class="form-input"><el-input v-model="form.legalOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'legalOpinionAttachment')" :on-remove="() => handleOpinionRemove('legalOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.legalOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.legalOpinionAttachment && fileUrlMap['legalOpinionAttachment']" :href="fileUrlMap['legalOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['legalOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
          <div class="form-row-full"><label class="form-label">旭日内部业务意见：</label><div class="form-input"><el-input v-model="form.businessOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'businessOpinionAttachment')" :on-remove="() => handleOpinionRemove('businessOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.businessOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.businessOpinionAttachment && fileUrlMap['businessOpinionAttachment']" :href="fileUrlMap['businessOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['businessOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
        </div>
      </div>

      <!-- 附件信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('attachment')">
          <span class="section-title"><span class="section-bar"></span>附件信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.attachment }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.attachment" class="attachment-content">
          <div class="attachment-item"><label class="attachment-label">附件：</label><div class="attachment-input"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'attachment')" :on-remove="() => handleOpinionRemove('attachment')"><el-button class="btn-upload" plain>{{ form.attachment ? '重新上传' : '上传文件' }}</el-button></el-upload><template v-for="(att, idx) in attachmentList" :key="idx"><a v-if="att.url" :href="att.url" target="_blank" class="file-link">{{ att.fileName || '查看文件' }}</a></template></div></div>
          <div class="attachment-item"><label class="attachment-label">备注：</label><div class="attachment-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" /></div></div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Minus, DArrowRight, Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { oppReviewAdd, oppReviewUpdate, oppReviewSubmit, oppReviewGetDetail, oppReviewGetBrandInfo } from '@/api/trademark/ap/oppReview'
import { agentGetList } from '@/api/trademark/bd/agent'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { getUserName } from '@/utils/auth'

function getToday() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const route = useRoute()
const router = useRouter()
const saving = ref(false)
const formRef = ref(null)
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const isEdit = computed(() => !!route.query.id)
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const basicStatus = ref(0)

const options = ref({ agent: [], countryRegion: [] })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const brandPicUrl = ref('')

const changeHeaderStyle = { background: '#fafafa', textAlign: 'center', color: '#333333', fontWeight: '600' }

const newCat = () => ({ categoryNo: '', productService: '', objectionProductService: '', acceptanceResult: '' })

const form = ref({
  id: route.query.id || null,
  brandId: null,
  applyNumber: '', applyDate: getToday(), applyPerson: getUserName() || '', applyDepartment: '', remarks: '',
  countryRegion: '', scopeType: null, opposedPerson: '', citedTrademarkNo: '', objector: '', objectionResult: '', objectionReason: '', reviewReason: '',
  categories: [newCat()],
  agentFee: { agentId: null, address: '', outsideFee: 0, domesticFee: 0, agentFee: 0, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  tmOfficeOpinion: '', tmOfficeOpinionAttachment: null,
  agentOpinion: '', agentOpinionAttachment: null,
  legalOpinion: '', legalOpinionAttachment: null,
  businessOpinion: '', businessOpinionAttachment: null,
  attachment: null, remark: '',
})

const pendingFiles = ref({
  tmOfficeOpinionAttachment: null, agentOpinionAttachment: null, legalOpinionAttachment: null, businessOpinionAttachment: null,
  attachment: null,
})

function addCategory(i) { form.value.categories.splice(i + 1, 0, newCat()) }
function removeCategory(i) { if (form.value.categories.length > 1) form.value.categories.splice(i, 1) }

function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
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
function handleOpinionUpload(file, field) { pendingFiles.value[field] = file.raw; form.value[field] = null }
function handleOpinionRemove(field) { pendingFiles.value[field] = null; form.value[field] = null; delete fileUrlMap[field] }

async function uploadPendingFiles() {
  for (const field of Object.keys(pendingFiles.value)) {
    const file = pendingFiles.value[field]
    if (file) {
      const formData = new FormData(); formData.append('fileList', file)
      const res = await uploadFileApi(formData)
      const fileId = res.data && res.data.fileId
      if (fileId) form.value[field] = String(fileId)
    }
  }
}

function resolveFileUrl(field, fileId) {
  if (fileId) getImageUrl(fileId).then(res => { if (res && res.data) fileUrlMap[field] = { url: res.data, name: res.data.split('/').pop() } }).catch(() => {})
}

function buildParam() {
  return {
    id: form.value.id,
    brandId: route.query.brandId || form.value.brandId,
    apBasicParam: {
      applyNumber: form.value.applyNumber || '',
      applyDate: form.value.applyDate || getToday(),
      applyPerson: form.value.applyPerson || getUserName() || '',
      applyDepartment: form.value.applyDepartment || '',
      remarks: form.value.remarks || '',
      applyScope: form.value.scopeType || 1,
    },
    apAgentFeeParam: form.value.agentFee,
    countryRegion: form.value.countryRegion,
    scopeType: form.value.scopeType,
    opposedPerson: form.value.opposedPerson,
    citedTrademarkNo: form.value.citedTrademarkNo,
    objector: form.value.objector,
    objectionResult: form.value.objectionResult,
    objectionReason: form.value.objectionReason,
    reviewReason: form.value.reviewReason,
    categories: form.value.categories.filter(c => c.categoryNo || c.objectionProductService),
    tmOfficeOpinion: form.value.tmOfficeOpinion, tmOfficeOpinionAttachment: form.value.tmOfficeOpinionAttachment,
    agentOpinion: form.value.agentOpinion, agentOpinionAttachment: form.value.agentOpinionAttachment,
    legalOpinion: form.value.legalOpinion, legalOpinionAttachment: form.value.legalOpinionAttachment,
    businessOpinion: form.value.businessOpinion, businessOpinionAttachment: form.value.businessOpinionAttachment,
    attachment: form.value.attachment, remark: form.value.remark,
  }
}

async function handleSave() {
  try {
    saving.value = true
    await uploadPendingFiles()
    const param = buildParam()
    if (form.value.id) { await oppReviewUpdate(param) } else {
      const res = await oppReviewAdd(param)
      if (res.data) { form.value.id = res.data.id; form.value.applyNumber = res.data.applyNo }
    }
    ElMessage.success('保存成功')
  } catch (e) { console.error(e); ElMessage.error(e.message || '保存失败') }
  finally { saving.value = false }
}

async function handleSaveAndSubmit() {
  try {
    saving.value = true
    await uploadPendingFiles()
    const param = buildParam()
    let id = form.value.id
    if (id) { await oppReviewUpdate(param) } else {
      const res = await oppReviewAdd(param)
      if (res.data) { id = res.data.id; form.value.id = id; form.value.applyNumber = res.data.applyNo }
    }
    if (id) await oppReviewSubmit(id)
    ElMessage.success('提交成功'); router.back()
  } catch (e) { console.error(e); ElMessage.error(e.message || '提交失败') }
  finally { saving.value = false }
}

function handleCancel() { router.back() }

async function loadEditData() {
  if (!route.query.id) return
  const res = await oppReviewGetDetail(route.query.id)
  const vo = res.data
  if (!vo) return
  form.value.brandId = vo.brandId
  if (vo.brandPicUrl) brandPicUrl.value = vo.brandPicUrl
  basicStatus.value = vo.basic?.status ?? 0
  if (vo.basic) {
    form.value.applyNumber = vo.basic.applyNumber || ''
    form.value.applyDate = vo.basic.applyDate || getToday()
    form.value.applyPerson = vo.basic.applyPerson || ''
    form.value.applyDepartment = vo.basic.applyDepartment || ''
    form.value.remarks = vo.basic.remarks || ''
  }
  if (vo.agentFee) {
    form.value.agentFee = { agentId: vo.agentFee.agentId, address: vo.agentFee.address || '', outsideFee: vo.agentFee.outsideFee, domesticFee: vo.agentFee.domesticFee, agentFee: vo.agentFee.agentFee, accountName: vo.agentFee.accountName || '', bankName: vo.agentFee.bankName || '', bankNumber: vo.agentFee.bankNumber || '', payCompany: vo.agentFee.payCompany || '' }
  }
  if (vo.oppReview) {
    const o = vo.oppReview
    form.value.countryRegion = o.countryRegion || ''
    form.value.scopeType = o.scopeType
    form.value.opposedPerson = o.opposedPerson || ''
    form.value.citedTrademarkNo = o.citedTrademarkNo || ''
    form.value.objector = o.objector || ''
    form.value.objectionResult = o.objectionResult || ''
    form.value.objectionReason = o.objectionReason || ''
    form.value.reviewReason = o.reviewReason || ''
    form.value.categories = o.categories && o.categories.length ? o.categories : [newCat()]
    form.value.tmOfficeOpinion = o.tmOfficeOpinion || ''; form.value.tmOfficeOpinionAttachment = o.tmOfficeOpinionAttachment; resolveFileUrl('tmOfficeOpinionAttachment', o.tmOfficeOpinionAttachment)
    form.value.agentOpinion = o.agentOpinion || ''; form.value.agentOpinionAttachment = o.agentOpinionAttachment; resolveFileUrl('agentOpinionAttachment', o.agentOpinionAttachment)
    form.value.legalOpinion = o.legalOpinion || ''; form.value.legalOpinionAttachment = o.legalOpinionAttachment; resolveFileUrl('legalOpinionAttachment', o.legalOpinionAttachment)
    form.value.businessOpinion = o.businessOpinion || ''; form.value.businessOpinionAttachment = o.businessOpinionAttachment; resolveFileUrl('businessOpinionAttachment', o.businessOpinionAttachment)
    form.value.attachment = o.attachment
    if (o.attachmentList) attachmentList.value = o.attachmentList
    form.value.remark = o.remark || ''
  }
}

async function loadBrandInfo() {
  if (!route.query.brandId || route.query.id) return
  const res = await oppReviewGetBrandInfo(route.query.brandId)
  const vo = res.data
  if (!vo) return
  form.value.brandId = vo.brandId
  if (vo.brandPicUrl) brandPicUrl.value = vo.brandPicUrl
  if (vo.brand) {
    form.value.citedTrademarkNo = vo.brand.brandNo || vo.brand.applyNo || ''
    form.value.opposedPerson = vo.brand.registerPerson || vo.brand.applyPerson || ''
    form.value.scopeType = vo.brand.scopeType
  }
  if (vo.categories && vo.categories.length) {
    form.value.categories = vo.categories.map(c => ({ categoryNo: String(c.brandCategory), productService: c.producsecScope || '', objectionProductService: c.producsecScope || '', acceptanceResult: '' }))
  }
  if (vo.countryRegionName) form.value.countryRegion = vo.countryRegionName
}

onMounted(async () => {
  const [agentRes, crRes] = await Promise.all([agentGetList({ page: 1, pageSize: 1000 }), countryRegionGetList({ page: 1, pageSize: 1000 })])
  options.value.agent = (agentRes.data && agentRes.data.list) || agentRes.data || []
  options.value.countryRegion = (crRes.data && crRes.data.list) || crRes.data || []
  await loadBrandInfo()
  await loadEditData()
})
</script>

<style lang="scss" scoped>
.form-page { background: #FFFFFF; padding: 24px 32px 40px; margin: 0 80px;
  .page-top { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .page-title { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 24px; font-weight: 700; color: #333333; margin: 0 0 20px 0; }
  .topBtn { display: flex; margin-bottom: 24px;
    .btn-cancel { background: #FFFFFF; border: 1px solid #D9D9D9; border-radius: 6px; color: #333333; font-size: 14px; }
    .btn-submit { background: #1890FF; border: none; border-radius: 6px; color: #FFFFFF; font-size: 14px; }
  }
  .section { margin-bottom: 32px;
    .section-header { display: flex; align-items: center; justify-content: space-between; background: #f2f8ff; padding: 10px 16px; margin-bottom: 20px; color: #333333; margin-right: 20px; cursor: pointer;
      .section-title { display: flex; align-items: center; font-size: 16px; font-weight: 600; color: #333333;
        .section-bar { display: inline-block; width: 4px; height: 18px; background: #1890FF; margin-right: 8px; border-radius: 2px; }
      }
      .collapse-icon { color: #1890FF; transform: rotate(90deg); transition: transform 0.2s; &.collapsed { transform: rotate(0deg); } }
    }
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 100px; padding: 0 260px 0 120px; }
  .form-grid-single { display: flex; flex-direction: column; gap: 20px; padding: 0 260px 0 120px; }
  .form-row { display: flex; align-items: flex-start;
    .form-label { flex: 0 0 150px; text-align: right; padding-right: 12px; color: #333333; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 36px; white-space: nowrap; font-weight: 500 !important;
      .req { color: #FF4D4F; margin-right: 2px; font-weight: 700; }
    }
    .form-input { flex: 1; min-width: 0; }
  }
  .form-basic-row-full { display: flex; align-items: flex-start; padding: 20px 380px 0 120px;
    .form-label { flex: 0 0 150px; text-align: right; padding-right: 12px; color: #333333; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 36px; white-space: nowrap; font-weight: 500 !important; }
    .form-input { flex: 1; min-width: 0; }
  }
  .form-row-full { display: flex; align-items: flex-start; padding: 0px 120px 0 0;
    .form-label { flex: 0 0 150px; text-align: right; padding-right: 12px; color: #333333; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 36px; white-space: nowrap; font-weight: 500 !important; }
    .form-input { flex: 1; min-width: 0; }
  }
  .categoryTable { margin-top: 25px; padding: 0 60px 0 60px;
    :deep(.el-table) { border: none; }
    :deep(.el-table__header) { th { background: #FAFAFA; color: #333333; font-weight: 600; border: none; border-bottom: 1px solid #EBEEF5; } }
    :deep(.el-table__body) { td { height: 50px; border: none; border-bottom: 1px solid #EBEEF5; } }
    :deep(.el-table::before) { display: none; }
  }
  .btn-upload { border-radius: 6px; font-size: 14px; padding: 15px 15px; font-weight: 500 !important; }
  .opinion-upload { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .file-link { color: #409eff; text-decoration: none; margin-left: 8px; font-size: 13px; }
  .file-link:hover { text-decoration: underline; }
  .attachment-content { padding: 0 20px;
    .attachment-item { display: flex; align-items: flex-start; margin-bottom: 20px; padding: 0 300px 0 100px;
      .attachment-label { flex: 0 0 150px; text-align: right; padding-right: 12px; color: #333333; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 36px; white-space: nowrap; }
      .attachment-input { flex: 1; min-width: 0; }
    }
  }
  .btn-circle { border-radius: 100%; padding: 5px; }
  .category-actions { display: flex; align-items: center; justify-content: center; gap: 8px; }
  .brand-preview { width: 60px; height: 60px; object-fit: contain; margin-left: 8px; border: 1px solid #eee; border-radius: 4px; }
  .search-icon { cursor: pointer; color: #999; }
  :deep(.input-disabled .el-input__inner) { background-color: #F5F5F5; color: #999999; border-color: #D9D9D9; }
}
</style>
