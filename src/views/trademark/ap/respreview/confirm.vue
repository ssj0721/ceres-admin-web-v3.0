<template>
  <div class="form-page">
    <div class="page-top">
      <h1 class="page-title">编制确认表</h1>
      <div class="topBtn">
        <el-button v-if="!isReadonly" class="btn-submit" :loading="saving" @click="handleSave">保存</el-button>
        <el-button v-if="!isReadonly" class="btn-cancel" :loading="saving" @click="handleSaveAndSubmit">保存并提交</el-button>
        <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
      </div>
    </div>

    <el-form class="mainForm" :disabled="isReadonly">
      <!-- 基本信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('basic')">
          <span class="section-title"><span class="section-bar"></span>基本信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.basic" class="info-table">
          <table class="basic-info-table">
            <tr><td class="label-cell">申请类型</td><td class="value-cell">商标异议复审申请(我司为被异议人)</td><td class="label-cell">申请编号</td><td class="value-cell link">{{ basic.applyNumber }}</td></tr>
            <tr><td class="label-cell">单据申请人</td><td class="value-cell">{{ basic.applyPerson }}</td><td class="label-cell">申请日期</td><td class="value-cell">{{ basic.applyDate }}</td></tr>
            <tr><td class="label-cell">申请部门</td><td class="value-cell">{{ basic.applyDepartment }}</td><td class="label-cell"></td><td class="value-cell"></td></tr>
            <tr><td class="label-cell">备注</td><td class="value-cell" colspan="3">{{ basic.remarks }}</td></tr>
          </table>
        </div>
      </div>

      <!-- 商标信息（申请信息 | 确认信息） -->
      <div class="section">
        <div class="section-header" @click="toggle('brand')">
          <span class="section-title"><span class="section-bar"></span>商标信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon>
        </div>
        
        <div v-show="!collapsed.brand" class="info-table">
          <table class="confirm-info-table">
            <thead style="background-color: #d6e8fd;"><tr><th style="width:180px"></th><th style="width:300px">申请信息</th><th style="width:180px"><span class="req-label"></span>确认信息</th><th></th></tr></thead>
            <tbody>
              <tr><td class="label-cell">境内/境外</td><td class="value-cell">{{ appInfo.scopeLabel }}</td><td class="label-cell">/</td><td class="value-cell">/</td></tr>
              <tr><td class="label-cell">所属地区/国家</td><td class="value-cell">{{ appInfo.countryRegion }}</td><td class="label-cell req-label">商标所属国家/地区</td><td class="value-cell"><el-select v-model="form.confirmCountryRegion" placeholder="请选择" style="width:100%" :disabled="isReadonly"><el-option label="全部" value="全部" /><el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.name" /></el-select></td></tr>
              <tr><td class="label-cell">/</td><td class="value-cell"></td><td class="label-cell req-label">* 异议复审申请日</td><td class="value-cell"><el-date-picker v-model="form.reviewApplyDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">商标申请/ 注册证号</td><td class="value-cell link">{{ appInfo.trademarkApplyNo }}</td><td class="label-cell req-label">商标申请/ 注册证号</td><td class="value-cell"><el-input v-model="form.confirmTrademarkApplyNo" placeholder="请输入" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">被异议商标</td><td class="value-cell"><img v-if="appInfo.opposedBrandPicUrl" :src="appInfo.opposedBrandPicUrl" class="brand-thumb" /></td><td class="label-cell req-label">被异议商标</td><td class="value-cell"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'confirmOpposedBrandPicUrl')"><el-button class="btn-upload" plain>上传图片</el-button></el-upload><img v-if="opposedBrandPreview" :src="opposedBrandPreview" class="brand-thumb" /></td></tr>
              <tr><td class="label-cell">被异议人</td><td class="value-cell">{{ appInfo.opposedPerson }}</td><td class="label-cell req-label">被异议人</td><td class="value-cell"><el-input v-model="form.confirmOpposedPerson" placeholder="请输入" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">引证商标</td><td class="value-cell"><img v-if="appInfo.citedBrandPicUrl" :src="appInfo.citedBrandPicUrl" class="brand-thumb" /></td><td class="label-cell req-label">引证商标</td><td class="value-cell"><el-input v-model="form.confirmCitedBrand" placeholder="请输入" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">类别数量</td><td class="value-cell">{{ appInfo.classCount }}</td><td class="label-cell req-label">类别数量</td><td class="value-cell"><el-input v-model="form.confirmClassCount" placeholder="请输入" :disabled="isReadonly" /></td></tr>
            </tbody>
          </table>
        </div>

        <!-- 类别子表（确认侧含异议人/理由/期限） -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column label="* 类别编号" width="100" align="center"><template #default="scope"><el-input v-model="scope.row.categoryNo" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="商品/服务项目" min-width="160"><template #default="scope"><el-input v-model="scope.row.productService" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="* 异议人" min-width="120"><template #default="scope"><el-input v-model="scope.row.objector" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="* 异议理由" min-width="120"><template #default="scope"><el-input v-model="scope.row.objectionReason" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="* 异议答辩理由" min-width="130"><template #default="scope"><el-input v-model="scope.row.defenseReason" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="* 异议复审理由" min-width="130"><template #default="scope"><el-input v-model="scope.row.reviewReason" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="* 异议复审期限" width="220"><template #default="scope"><el-date-picker v-model="scope.row.reviewDeadline" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" style="width: 100%" :disabled="isReadonly" /></template></el-table-column>
            <el-table-column label="操作" width="100" align="center"><template #default="scope"><div class="category-actions"><el-button class="btn-circle" @click="addCategory(scope.$index)" :disabled="isReadonly"><el-icon><Plus /></el-icon></el-button><el-button class="btn-circle" @click="removeCategory(scope.$index)" :disabled="isReadonly || form.categories.length <= 1"><el-icon><Minus /></el-icon></el-button></div></template></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 批件与意见信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('opinion')">
          <span class="section-title"><span class="section-bar"></span>批件与意见信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.opinion }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.opinion" class="form-grid-single">
          <div class="form-row-full"><label class="form-label">商标局批件：</label><div class="form-input"><el-input v-model="form.approvalOpinion" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /><div class="opinion-upload"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :on-change="(f) => handleOpinionUpload(f, 'approvalOpinionAttachment')"><el-button class="btn-upload" plain size="small">{{ form.approvalOpinionAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.approvalOpinionAttachment && fileUrlMap['approvalOpinionAttachment']" :href="fileUrlMap['approvalOpinionAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['approvalOpinionAttachment'].name || '查看文件' }}</a></div></div></div>
          <div class="form-row-full"><label class="form-label">商标异议复审申请书附件：</label><div class="form-input"><el-input v-model="form.reviewApplicationText" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /><div class="opinion-upload"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :on-change="(f) => handleOpinionUpload(f, 'reviewApplicationAttachment')"><el-button class="btn-upload" plain size="small">{{ form.reviewApplicationAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload><a v-if="form.reviewApplicationAttachment && fileUrlMap['reviewApplicationAttachment']" :href="fileUrlMap['reviewApplicationAttachment'].url" target="_blank" class="file-link">{{ fileUrlMap['reviewApplicationAttachment'].name || '查看文件' }}</a></div></div></div>
        </div>
      </div>

      <!-- 附件信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('attachment')">
          <span class="section-title"><span class="section-bar"></span>附件信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.attachment }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.attachment" class="attachment-content">
          <div class="attachment-item"><label class="attachment-label">附件：</label><div class="attachment-input"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :on-change="(f) => handleOpinionUpload(f, 'attachment')"><el-button class="btn-upload" plain>{{ form.attachment ? '重新上传' : '上传文件' }}</el-button></el-upload><template v-for="(att, idx) in attachmentList" :key="idx"><a v-if="att.url" :href="att.url" target="_blank" class="file-link">{{ att.fileName || '查看文件' }}</a></template></div></div>
          <div class="attachment-item"><label class="attachment-label">备注：</label><div class="attachment-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /></div></div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Minus, DArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { respReviewGetConfirmDetail, respReviewSaveConfirm, respReviewSubmitConfirm } from '@/api/trademark/ap/respReview'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'

const route = useRoute()
const router = useRouter()
const saving = ref(false)
const isReadonly = ref(false)
const collapsed = ref({ basic: false, brand: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const options = ref({ countryRegion: [] })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const opposedBrandPreview = ref('')
const changeHeaderStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const basic = ref({})
const appInfo = ref({})
const newCat = () => ({ categoryNo: '', productService: '', objectionProductService: '', objector: '', objectionReason: '', defenseReason: '', reviewReason: '', reviewDeadline: null })

const form = ref({
  id: route.query.id || null,
  confirmCountryRegion: '', reviewApplyDate: '', confirmTrademarkApplyNo: '',
  confirmOpposedBrandPicUrl: null, confirmOpposedPerson: '', confirmCitedBrand: '', confirmClassCount: '',
  categories: [],
  approvalOpinion: '', approvalOpinionAttachment: null,
  reviewApplicationText: '', reviewApplicationAttachment: null,
  attachment: null, remark: '',
})

const pendingFiles = ref({ confirmOpposedBrandPicUrl: null, approvalOpinionAttachment: null, reviewApplicationAttachment: null, attachment: null })

function addCategory(i) { form.value.categories.splice(i + 1, 0, newCat()) }
function removeCategory(i) { if (form.value.categories.length > 1) form.value.categories.splice(i, 1) }

function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
  if (field === 'confirmOpposedBrandPicUrl') opposedBrandPreview.value = URL.createObjectURL(file.raw)
}
function handleOpinionUpload(file, field) { pendingFiles.value[field] = file.raw; form.value[field] = null }

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
    confirmCountryRegion: form.value.confirmCountryRegion,
    reviewApplyDate: form.value.reviewApplyDate,
    confirmTrademarkApplyNo: form.value.confirmTrademarkApplyNo,
    confirmOpposedBrandPicUrl: form.value.confirmOpposedBrandPicUrl,
    confirmOpposedPerson: form.value.confirmOpposedPerson,
    confirmCitedBrand: form.value.confirmCitedBrand,
    confirmClassCount: form.value.confirmClassCount ? Number(form.value.confirmClassCount) : null,
    categories: form.value.categories.map(c => ({
      categoryNo: c.categoryNo, productService: c.productService, objectionProductService: c.objectionProductService,
      objector: c.objector, objectionReason: c.objectionReason, defenseReason: c.defenseReason, reviewReason: c.reviewReason,
      reviewDeadlineStart: c.reviewDeadline ? c.reviewDeadline[0] : null,
      reviewDeadlineEnd: c.reviewDeadline ? c.reviewDeadline[1] : null,
    })),
    approvalOpinion: form.value.approvalOpinion,
    approvalOpinionAttachment: form.value.approvalOpinionAttachment,
    reviewApplicationAttachment: form.value.reviewApplicationAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

// 提交前校验（保存不校验，支持部分保存）
function validateConfirm() {
  if (!form.value.confirmCountryRegion) return '商标所属国家/地区不能为空'
  if (!form.value.reviewApplyDate) return '异议复审申请日不能为空'
  if (!form.value.confirmTrademarkApplyNo || !form.value.confirmTrademarkApplyNo.trim()) return '商标申请/注册证号不能为空'
  if (!form.value.confirmOpposedBrandPicUrl && !pendingFiles.value.confirmOpposedBrandPicUrl) return '被异议商标图片不能为空'
  if (!form.value.confirmOpposedPerson || !form.value.confirmOpposedPerson.trim()) return '被异议人不能为空'
  if (!form.value.confirmCitedBrand || !form.value.confirmCitedBrand.trim()) return '引证商标不能为空'
  if (form.value.confirmClassCount === '' || form.value.confirmClassCount == null) return '类别数量不能为空'
  const seen = []
  for (const c of form.value.categories) {
    if (!c.categoryNo || !String(c.categoryNo).trim()) return '类别编号不能为空'
    const no = Number(c.categoryNo)
    if (!Number.isInteger(no) || no < 1 || no > 45) return `类别编号“${c.categoryNo}”应为 1-45 之间的整数`
    if (seen.includes(no)) return `类别“${no}”重复填写`
    seen.push(no)
    if (!c.objector || !String(c.objector).trim()) return `类别“${no}”的异议人不能为空`
    if (!c.objectionReason || !String(c.objectionReason).trim()) return `类别“${no}”的异议理由不能为空`
    if (!c.defenseReason || !String(c.defenseReason).trim()) return `类别“${no}”的异议答辩理由不能为空`
    if (!c.reviewReason || !String(c.reviewReason).trim()) return `类别“${no}”的异议复审理由不能为空`
    if (!c.reviewDeadline || !c.reviewDeadline[0] || !c.reviewDeadline[1]) return `类别“${no}”的异议复审期限不能为空`
  }
  return ''
}

async function handleSave() {
  try { saving.value = true; await uploadPendingFiles(); await respReviewSaveConfirm(buildParam()); ElMessage.success('保存成功') }
  catch (e) { ElMessage.error(e.message || '保存失败') } finally { saving.value = false }
}
async function handleSaveAndSubmit() {
  const err = validateConfirm()
  if (err) { ElMessage.error(err); return }
  try { saving.value = true; await uploadPendingFiles(); const p = buildParam(); await respReviewSaveConfirm(p); await respReviewSubmitConfirm(p); ElMessage.success('提交成功'); router.back() }
  catch (e) { ElMessage.error(e.message || '提交失败') } finally { saving.value = false }
}
function handleCancel() { router.back() }

async function loadDetail() {
  const res = await respReviewGetConfirmDetail(route.query.id)
  const vo = res.data
  if (!vo) return
  isReadonly.value = vo.basic?.status === 3
  basic.value = vo.basic || {}
  if (vo.respReview) {
    const o = vo.respReview
    appInfo.value = {
      scopeLabel: o.scopeType === 1 ? '境内' : '境外',
      countryRegion: o.countryRegion || '',
      trademarkApplyNo: o.trademarkApplyNo || '',
      opposedBrandPicUrl: '', citedBrandPicUrl: '',
      opposedPerson: o.opposedPerson || '',
      classCount: o.categories ? o.categories.length : 0,
    }
    form.value.confirmCountryRegion = o.confirmCountryRegion || o.countryRegion || ''
    form.value.reviewApplyDate = o.reviewApplyDate || ''
    form.value.confirmTrademarkApplyNo = o.confirmTrademarkApplyNo || o.trademarkApplyNo || ''
    // 被异议商标：确认侧优先已保存值，否则用申请侧/主商标图预填
    const opposedFileId = o.confirmOpposedBrandPicUrl || o.opposedBrandPicUrl || (vo.brand && vo.brand.brandPicUrl) || null
    form.value.confirmOpposedBrandPicUrl = o.confirmOpposedBrandPicUrl || null
    if (opposedFileId) {
      if (/^https?:\/\//.test(opposedFileId)) {
        opposedBrandPreview.value = opposedFileId
      } else {
        getImageUrl(opposedFileId).then(r => { if (r && r.data) opposedBrandPreview.value = r.data }).catch(() => {})
      }
      if (!form.value.confirmOpposedBrandPicUrl) form.value.confirmOpposedBrandPicUrl = opposedFileId
    }
    form.value.confirmOpposedPerson = o.confirmOpposedPerson || o.opposedPerson || ''
    form.value.confirmCitedBrand = o.confirmCitedBrand || ''
    form.value.confirmClassCount = o.confirmClassCount || (o.categories ? o.categories.length : '')
    form.value.categories = o.categories && o.categories.length ? o.categories.map(c => ({
      categoryNo: c.categoryNo, productService: c.productService, objectionProductService: c.objectionProductService,
      objector: c.objector, objectionReason: c.objectionReason, defenseReason: c.defenseReason, reviewReason: c.reviewReason,
      reviewDeadline: (c.reviewDeadlineStart || c.reviewDeadlineEnd) ? [c.reviewDeadlineStart, c.reviewDeadlineEnd] : null,
    })) : [newCat()]
    form.value.approvalOpinion = o.approvalOpinion || ''
    form.value.approvalOpinionAttachment = o.approvalOpinionAttachment
    resolveFileUrl('approvalOpinionAttachment', o.approvalOpinionAttachment)
    form.value.reviewApplicationAttachment = o.reviewApplicationAttachment
    resolveFileUrl('reviewApplicationAttachment', o.reviewApplicationAttachment)
    form.value.attachment = o.attachment
    if (o.attachmentList) attachmentList.value = o.attachmentList
    form.value.remark = o.remark || ''
    // 申请信息侧被异议商标图片：申请未单独存图时回退到主商标图（VO 已解析为 URL）
    if (o.opposedBrandPicUrl) {
      getImageUrl(o.opposedBrandPicUrl).then(r => { if (r && r.data) appInfo.value.opposedBrandPicUrl = r.data }).catch(() => {})
    } else if (vo.brandPicUrl) {
      appInfo.value.opposedBrandPicUrl = vo.brandPicUrl
    }
    if (o.citedBrandPicUrl) getImageUrl(o.citedBrandPicUrl).then(r => { if (r && r.data) appInfo.value.citedBrandPicUrl = r.data }).catch(() => {})
  }
}

onMounted(async () => {
  const crRes = await countryRegionGetList({ page: 1, pageSize: 1000 })
  options.value.countryRegion = (crRes.data && crRes.data.list) || crRes.data || []
  await loadDetail()
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
  .form-grid-single { display: flex; flex-direction: column; gap: 20px; padding: 0 260px 0 120px; }
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
  .info-table { padding: 0 24px 16px; }
  .basic-info-table, .confirm-info-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .basic-info-table td, .confirm-info-table td, .confirm-info-table th { border: 1px solid #E8E8E8; padding: 10px 12px; }
  .label-cell { background: #f2f8ff; color: #666; width: 140px; text-align: center; }
  .value-cell { color: #333; }
  .link { color: #1890FF; cursor: pointer; }
  .req-label { color: #333; }
  .req-label::before { content: '* '; color: #FF4D4F; }
  .brand-thumb { width: 40px; height: 40px; object-fit: contain; vertical-align: middle; margin-right: 4px; }
}
</style>
