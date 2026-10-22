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

    <el-form class="mainForm" :disabled="!canSave">
      <div class="section">
        <div class="section-header" @click="toggle('basic')"><span class="section-title"><span class="section-bar"></span>基本信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon></div>
        <div v-show="!collapsed.basic" class="form-grid">
          <div class="form-row"><label class="form-label">申请类型：</label><div class="form-input"><el-input value="商标更正申请" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请编号：</label><div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div></div>
          <div class="form-row"><label class="form-label">单据申请人：</label><div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请日期：</label><div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div></div>
          <div class="form-row"><label class="form-label">申请部门：</label><div class="form-input"><el-input v-model="form.applyDepartment" placeholder="请输入" /></div></div>
        </div>
        <div v-show="!collapsed.basic" class="form-basic-row-full"><label class="form-label">备注：</label><div class="form-input"><el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入" /></div></div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('brand')"><span class="section-title"><span class="section-bar"></span>商标信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon></div>
        <div v-show="!collapsed.brand" class="form-grid">
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 境内/境外：</label><div class="form-input"><el-select v-model="form.scopeType" placeholder="请选择" style="width: 100%"><el-option label="境内" :value="1" /><el-option label="境外" :value="2" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 所属国家/地区：</label><div class="form-input"><el-select v-model="form.countryRegion" placeholder="请选择" style="width: 100%"><el-option label="全部" value="全部" /><el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.name" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 商标申请/注册编号：</label><div class="form-input"><el-input v-model="form.trademarkApplyNo" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 商标申请/注册人：</label><div class="form-input"><el-input v-model="form.trademarkApplicant" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 类别数量：</label><div class="form-input"><el-input :value="form.classCount" disabled class="input-disabled" /></div></div>
        </div>
        <!-- 更正项目表 -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="correctionRows" :header-cell-style="headerStyle" :cell-style="{ height: '50px' }">
            <el-table-column prop="label" label="更正项目" width="200" align="center" />
            <el-table-column prop="before" label="更正前" min-width="400" />
            <el-table-column label="* 更正后" min-width="400">
              <template #default><el-input v-model="form.correctionAfter" placeholder="请输入" /></template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('agent')"><span class="section-title"><span class="section-bar"></span>代理人及费用信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.agent }"><DArrowRight /></el-icon></div>
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
        <div v-show="!collapsed.agent" class="form-basic-row-full"><label class="form-label">付款公司信息：</label><div class="form-input"><el-input v-model="form.agentFee.payCompany" type="textarea" :rows="3" placeholder="请输入" /></div></div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('opinion')"><span class="section-title"><span class="section-bar"></span>批件与意见信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.opinion }"><DArrowRight /></el-icon></div>
        <div v-show="!collapsed.opinion" class="form-grid-single">
          <div class="form-row-full"><label class="form-label">旭日管理层意见：</label><div class="form-input"><el-input v-model="form.managementOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'managementOpinionAttachment')" :on-remove="() => handleOpinionRemove('managementOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.managementOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.managementOpinionAttachment && fileUrlMap['managementOpinionAttachment']" :href="fileUrlMap['managementOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['managementOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('attachment')"><span class="section-title"><span class="section-bar"></span>附件信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.attachment }"><DArrowRight /></el-icon></div>
        <div v-show="!collapsed.attachment" class="attachment-content">
          <div class="attachment-item"><label class="attachment-label">附件：</label><div class="attachment-input"><AttachmentUpload ref="attUpload" v-model="attachmentList" :readonly="!canSave" /></div></div>
          <div class="attachment-item"><label class="attachment-label">备注：</label><div class="attachment-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" /></div></div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { DArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { correctionAdd, correctionUpdate, correctionSubmit, correctionGetDetail, correctionGetBrandInfo } from '@/api/trademark/ap/correction'
import { agentGetList } from '@/api/trademark/bd/agent'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'
import AttachmentUpload from '@/components/AttachmentUpload.vue'
import { getUserName } from '@/utils/auth'

function getToday() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }

const route = useRoute(); const router = useRouter()
const saving = ref(false)
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(k) { collapsed.value[k] = !collapsed.value[k] }
const isEdit = computed(() => !!route.query.id)
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const basicStatus = ref(0)
const options = ref({ agent: [], countryRegion: [] })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const attUpload = ref(null)
const headerStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const form = ref({
  id: route.query.id || null, brandId: null,
  applyNumber: '', applyDate: getToday(), applyPerson: getUserName() || '', applyDepartment: '', remarks: '',
  scopeType: null, countryRegion: '', trademarkApplyNo: '', trademarkApplicant: '', classCount: 0,
  correctionBefore: '', correctionAfter: '',
  agentFee: { agentId: null, address: '', outsideFee: 0, domesticFee: 0, agentFee: 0, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  managementOpinion: '', managementOpinionAttachment: null,
  attachment: null, remark: '',
})
const pendingFiles = ref({ managementOpinionAttachment: null, attachment: null })
const correctionRows = computed(() => [{ label: '商标/服务项目', before: form.value.correctionBefore }])

function handleAgentChange(agentId) { if (!agentId) return; const a = options.value.agent.find(x => x.id === agentId); if (a) { form.value.agentFee.address = a.agentAddress || ''; form.value.agentFee.accountName = a.accountName || ''; form.value.agentFee.bankName = a.bankName || ''; form.value.agentFee.bankNumber = a.receiptAccount || '' } }
function handleOpinionUpload(file, field) { pendingFiles.value[field] = file.raw; form.value[field] = null }
function handleOpinionRemove(field) { pendingFiles.value[field] = null; form.value[field] = null; delete fileUrlMap[field] }
async function uploadPendingFiles() { for (const f of Object.keys(pendingFiles.value)) { const file = pendingFiles.value[f]; if (file) { const fd = new FormData(); fd.append('fileList', file); const r = await uploadFileApi(fd); const id = r.data && r.data.fileId; if (id) form.value[f] = String(id) } } }
function resolveFileUrl(field, fileId) { if (fileId) getImageUrl(fileId).then(r => { if (r && r.data) fileUrlMap[field] = { url: r.data, name: r.data.split('/').pop() } }).catch(() => {}) }

function buildParam() {
  return {
    id: form.value.id, brandId: route.query.brandId || form.value.brandId,
    apBasicParam: { applyNumber: form.value.applyNumber || '', applyDate: form.value.applyDate || getToday(), applyPerson: form.value.applyPerson || getUserName() || '', applyDepartment: form.value.applyDepartment || '', remarks: form.value.remarks || '', applyScope: form.value.scopeType || 1 },
    apAgentFeeParam: form.value.agentFee,
    scopeType: form.value.scopeType, countryRegion: form.value.countryRegion,
    trademarkApplyNo: form.value.trademarkApplyNo, trademarkApplicant: form.value.trademarkApplicant,
    classCount: form.value.classCount, correctionAfter: form.value.correctionAfter,
    managementOpinion: form.value.managementOpinion, managementOpinionAttachment: form.value.managementOpinionAttachment,
    attachment: form.value.attachment,
    attachments: attachmentList.value.map(a => a.fileId).filter(Boolean), remark: form.value.remark,
  }
}
async function handleSave() { try { saving.value = true; await uploadPendingFiles()
    if (attUpload.value) await attUpload.value.flush(); const p = buildParam(); if (form.value.id) { await correctionUpdate(p) } else { const r = await correctionAdd(p); if (r.data) { form.value.id = r.data.id; form.value.applyNumber = r.data.applyNo } } ElMessage.success('保存成功') } catch (e) { ElMessage.error(e.message || '保存失败') } finally { saving.value = false } }
async function handleSaveAndSubmit() { try { saving.value = true; await uploadPendingFiles()
    if (attUpload.value) await attUpload.value.flush(); const p = buildParam(); let id = form.value.id; if (id) { await correctionUpdate(p) } else { const r = await correctionAdd(p); if (r.data) { id = r.data.id; form.value.id = id; form.value.applyNumber = r.data.applyNo } } if (id) await correctionSubmit(id); ElMessage.success('提交成功'); router.back() } catch (e) { ElMessage.error(e.message || '提交失败') } finally { saving.value = false } }
function handleCancel() { router.back() }

async function loadEditData() {
  if (!route.query.id) return
  const res = await correctionGetDetail(route.query.id); const vo = res.data; if (!vo) return
  form.value.brandId = vo.brandId; basicStatus.value = vo.basic?.status ?? 0
  if (vo.basic) { form.value.applyNumber = vo.basic.applyNumber || ''; form.value.applyDate = vo.basic.applyDate || getToday(); form.value.applyPerson = vo.basic.applyPerson || ''; form.value.applyDepartment = vo.basic.applyDepartment || ''; form.value.remarks = vo.basic.remarks || '' }
  if (vo.agentFee) form.value.agentFee = { agentId: vo.agentFee.agentId, address: vo.agentFee.address || '', outsideFee: vo.agentFee.outsideFee, domesticFee: vo.agentFee.domesticFee, agentFee: vo.agentFee.agentFee, accountName: vo.agentFee.accountName || '', bankName: vo.agentFee.bankName || '', bankNumber: vo.agentFee.bankNumber || '', payCompany: vo.agentFee.payCompany || '' }
  if (vo.correction) { const o = vo.correction; form.value.scopeType = o.scopeType; form.value.countryRegion = o.countryRegion || ''; form.value.trademarkApplyNo = o.trademarkApplyNo || ''; form.value.trademarkApplicant = o.trademarkApplicant || ''; form.value.classCount = o.classCount || 0; form.value.correctionBefore = o.correctionBefore || ''; form.value.correctionAfter = o.correctionAfter || ''; form.value.managementOpinion = o.managementOpinion || ''; form.value.managementOpinionAttachment = o.managementOpinionAttachment; resolveFileUrl('managementOpinionAttachment', o.managementOpinionAttachment); form.value.attachment = o.attachment; if (o.attachmentList) attachmentList.value = o.attachmentList; form.value.remark = o.remark || '' }
}
async function loadBrandInfo() {
  if (!route.query.brandId || route.query.id) return
  const res = await correctionGetBrandInfo(route.query.brandId); const vo = res.data; if (!vo) return
  form.value.brandId = vo.brandId
  if (vo.correction) { form.value.correctionBefore = vo.correction.correctionBefore || ''; form.value.classCount = vo.correction.classCount || 0; form.value.trademarkApplyNo = vo.correction.trademarkApplyNo || ''; form.value.trademarkApplicant = vo.correction.trademarkApplicant || ''; form.value.scopeType = vo.correction.scopeType; form.value.countryRegion = vo.correction.countryRegion || '' }
  if (vo.countryRegionName) form.value.countryRegion = vo.countryRegionName
}
onMounted(async () => {
  const [a, cr] = await Promise.all([agentGetList({ page: 1, pageSize: 1000 }), countryRegionGetList({ page: 1, pageSize: 1000 })])
  options.value.agent = (a.data && a.data.list) || a.data || []
  options.value.countryRegion = (cr.data && cr.data.list) || cr.data || []
  await loadBrandInfo(); await loadEditData()
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
  .img-note { font-size: 12px; color: #999; margin-top: 4px; }
  :deep(.input-disabled .el-input__inner) { background-color: #F5F5F5; color: #999999; border-color: #D9D9D9; }
}
</style>
