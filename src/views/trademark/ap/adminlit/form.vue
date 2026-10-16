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
          <div class="form-row"><label class="form-label">申请类型：</label><div class="form-input"><el-input value="商标行政诉讼通知" disabled class="input-disabled" /></div></div>
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
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 商标注册编号：</label><div class="form-input"><el-input v-model="form.trademarkRegisterNo" placeholder="请输入"><template #suffix><el-icon class="search-icon"><Search /></el-icon></template></el-input></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 境内/境外：</label><div class="form-input"><el-select v-model="form.scopeType" placeholder="请选择" style="width: 100%"><el-option label="境内" :value="1" /><el-option label="境外" :value="2" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 商标注册人：</label><div class="form-input"><el-input v-model="form.trademarkRegistrant" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 异议人：</label><div class="form-input"><el-input v-model="form.objector" placeholder="请输入" /></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 行政诉讼类型：</label><div class="form-input"><el-select v-model="form.litigationType" placeholder="请选择" style="width: 100%"><el-option label="一审" value="一审" /><el-option label="二审" value="二审" /><el-option label="再审" value="再审" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 行政诉讼案件结果：</label><div class="form-input"><el-select v-model="form.litigationResult" placeholder="请选择" style="width: 100%"><el-option label="胜诉" value="胜诉" /><el-option label="败诉" value="败诉" /><el-option label="调解" value="调解" /><el-option label="撤诉" value="撤诉" /></el-select></div></div>
          <div class="form-row required"><label class="form-label"><span class="req">*</span> 商标：</label><div class="form-input"><el-upload :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'brandPicUrl')"><el-button class="btn-upload" plain>上传图片</el-button></el-upload><div class="img-note">注：图片限制JPG格式、像素246*43、英文文件名</div><img v-if="brandPreview || (fileUrlMap['brandPicUrl'] && fileUrlMap['brandPicUrl'].url)" :src="brandPreview || (fileUrlMap['brandPicUrl'] && fileUrlMap['brandPicUrl'].url)" class="brand-preview" /></div></div>
          <div class="form-row"><label class="form-label">类别数量：</label><div class="form-input"><el-input :value="form.categories.length" disabled class="input-disabled" /></div></div>
        </div>
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="headerStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="150" align="center" />
            <el-table-column label="类别编号" min-width="50"><template #default="scope"><el-input v-model="scope.row.categoryNo" placeholder="请输入" /></template></el-table-column>
            <el-table-column label="商品/服务项目" min-width="400"><template #default="scope"><el-input v-model="scope.row.productService" placeholder="请输入" /></template></el-table-column>
            <el-table-column label="操作" width="140" align="center"><template #default="scope"><div class="category-actions"><el-button class="btn-circle" @click="addCategory(scope.$index)"><el-icon><Plus /></el-icon></el-button><el-button class="btn-circle" @click="removeCategory(scope.$index)" :disabled="form.categories.length <= 1"><el-icon><Minus /></el-icon></el-button></div></template></el-table-column>
          </el-table>
        </div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('opinion')"><span class="section-title"><span class="section-bar"></span>批件与意见信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.opinion }"><DArrowRight /></el-icon></div>
        <div v-show="!collapsed.opinion" class="form-grid-single">
          <div class="form-row-full"><label class="form-label">商标局批件意见：</label><div class="form-input"><el-input v-model="form.tmOfficeOpinion" type="textarea" :rows="3" placeholder="请输入" /><div class="opinion-upload"><el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'tmOfficeOpinionAttachment')" :on-remove="() => handleOpinionRemove('tmOfficeOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.tmOfficeOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.tmOfficeOpinionAttachment && fileUrlMap['tmOfficeOpinionAttachment']" :href="fileUrlMap['tmOfficeOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['tmOfficeOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header" @click="toggle('attachment')"><span class="section-title"><span class="section-bar"></span>附件信息</span><el-icon class="collapse-icon" :class="{ collapsed: collapsed.attachment }"><DArrowRight /></el-icon></div>
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
import { adminLitAdd, adminLitUpdate, adminLitSubmit, adminLitGetDetail, adminLitGetBrandInfo } from '@/api/trademark/ap/adminLit'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { getUserName } from '@/utils/auth'

function getToday() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }

const route = useRoute(); const router = useRouter()
const saving = ref(false)
const collapsed = ref({ basic: false, brand: false, opinion: false, attachment: false })
function toggle(k) { collapsed.value[k] = !collapsed.value[k] }
const isEdit = computed(() => !!route.query.id)
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const basicStatus = ref(0)
const options = ref({ countryRegion: [] })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const brandPreview = ref('')
const headerStyle = { background: '#fafafa', textAlign: 'center', color: '#333333', fontWeight: '600' }
const newCat = () => ({ categoryNo: '', productService: '' })

const form = ref({
  id: route.query.id || null, brandId: null,
  applyNumber: '', applyDate: getToday(), applyPerson: getUserName() || '', applyDepartment: '', remarks: '',
  trademarkRegisterNo: '', scopeType: null, trademarkRegistrant: '', objector: '', litigationType: '', litigationResult: '', brandPicUrl: null,
  categories: [newCat()],
  tmOfficeOpinion: '', tmOfficeOpinionAttachment: null,
  attachment: null, remark: '',
})
const pendingFiles = ref({ brandPicUrl: null, tmOfficeOpinionAttachment: null, attachment: null })

function addCategory(i) { form.value.categories.splice(i + 1, 0, newCat()) }
function removeCategory(i) { if (form.value.categories.length > 1) form.value.categories.splice(i, 1) }
function handleFilePick(file, field) { pendingFiles.value[field] = file.raw; form.value[field] = null; if (field === 'brandPicUrl') brandPreview.value = URL.createObjectURL(file.raw) }
function handleOpinionUpload(file, field) { pendingFiles.value[field] = file.raw; form.value[field] = null }
function handleOpinionRemove(field) { pendingFiles.value[field] = null; form.value[field] = null; delete fileUrlMap[field] }
async function uploadPendingFiles() { for (const f of Object.keys(pendingFiles.value)) { const file = pendingFiles.value[f]; if (file) { const fd = new FormData(); fd.append('fileList', file); const r = await uploadFileApi(fd); const id = r.data && r.data.fileId; if (id) form.value[f] = String(id) } } }
function resolveFileUrl(field, fileId) { if (fileId) getImageUrl(fileId).then(r => { if (r && r.data) fileUrlMap[field] = { url: r.data, name: r.data.split('/').pop() } }).catch(() => {}) }

function buildParam() {
  return {
    id: form.value.id, brandId: route.query.brandId || form.value.brandId,
    apBasicParam: { applyNumber: form.value.applyNumber || '', applyDate: form.value.applyDate || getToday(), applyPerson: form.value.applyPerson || getUserName() || '', applyDepartment: form.value.applyDepartment || '', remarks: form.value.remarks || '', applyScope: form.value.scopeType || 1 },
    apAgentFeeParam: { agentId: null, address: '', outsideFee: 0, domesticFee: 0, agentFee: 0, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
    trademarkRegisterNo: form.value.trademarkRegisterNo, scopeType: form.value.scopeType,
    trademarkRegistrant: form.value.trademarkRegistrant, objector: form.value.objector,
    litigationType: form.value.litigationType, litigationResult: form.value.litigationResult, brandPicUrl: form.value.brandPicUrl,
    categories: form.value.categories.filter(c => c.categoryNo || c.productService),
    tmOfficeOpinion: form.value.tmOfficeOpinion, tmOfficeOpinionAttachment: form.value.tmOfficeOpinionAttachment,
    attachment: form.value.attachment, remark: form.value.remark,
  }
}
async function handleSave() { try { saving.value = true; await uploadPendingFiles(); const p = buildParam(); if (form.value.id) { await adminLitUpdate(p) } else { const r = await adminLitAdd(p); if (r.data) { form.value.id = r.data.id; form.value.applyNumber = r.data.applyNo } } ElMessage.success('保存成功') } catch (e) { ElMessage.error(e.message || '保存失败') } finally { saving.value = false } }
async function handleSaveAndSubmit() { try { saving.value = true; await uploadPendingFiles(); const p = buildParam(); let id = form.value.id; if (id) { await adminLitUpdate(p) } else { const r = await adminLitAdd(p); if (r.data) { id = r.data.id; form.value.id = id; form.value.applyNumber = r.data.applyNo } } if (id) await adminLitSubmit(id); ElMessage.success('提交成功'); router.back() } catch (e) { ElMessage.error(e.message || '提交失败') } finally { saving.value = false } }
function handleCancel() { router.back() }

async function loadEditData() {
  if (!route.query.id) return
  const res = await adminLitGetDetail(route.query.id); const vo = res.data; if (!vo) return
  form.value.brandId = vo.brandId; basicStatus.value = vo.basic?.status ?? 0
  if (vo.basic) { form.value.applyNumber = vo.basic.applyNumber || ''; form.value.applyDate = vo.basic.applyDate || getToday(); form.value.applyPerson = vo.basic.applyPerson || ''; form.value.applyDepartment = vo.basic.applyDepartment || ''; form.value.remarks = vo.basic.remarks || '' }
  if (vo.adminLit) { const o = vo.adminLit; form.value.trademarkRegisterNo = o.trademarkRegisterNo || ''; form.value.scopeType = o.scopeType; form.value.trademarkRegistrant = o.trademarkRegistrant || ''; form.value.objector = o.objector || ''; form.value.litigationType = o.litigationType || ''; form.value.litigationResult = o.litigationResult || ''; form.value.brandPicUrl = o.brandPicUrl; form.value.categories = o.categories && o.categories.length ? o.categories : [newCat()]; form.value.tmOfficeOpinion = o.tmOfficeOpinion || ''; form.value.tmOfficeOpinionAttachment = o.tmOfficeOpinionAttachment; resolveFileUrl('tmOfficeOpinionAttachment', o.tmOfficeOpinionAttachment); form.value.attachment = o.attachment; if (o.attachmentList) attachmentList.value = o.attachmentList; form.value.remark = o.remark || ''; if (o.brandPicUrl) resolveFileUrl('brandPicUrl', o.brandPicUrl) }
}
async function loadBrandInfo() {
  if (!route.query.brandId || route.query.id) return
  const res = await adminLitGetBrandInfo(route.query.brandId); const vo = res.data; if (!vo) return
  form.value.brandId = vo.brandId
  if (vo.brand) { form.value.trademarkRegisterNo = vo.brand.brandNo || ''; form.value.trademarkRegistrant = vo.brand.registerPerson || vo.brand.applyPerson || ''; form.value.scopeType = vo.brand.scopeType }
  if (vo.categories && vo.categories.length) form.value.categories = vo.categories.map(c => ({ categoryNo: String(c.brandCategory), productService: c.producsecScope || '' }))
}
onMounted(async () => {
  const cr = await countryRegionGetList({ page: 1, pageSize: 1000 })
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
