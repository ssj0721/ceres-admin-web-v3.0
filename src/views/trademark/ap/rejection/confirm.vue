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
      <!-- 基本信息（只读表格） -->
      <div class="section">
        <div class="section-header" @click="toggle('basic')">
          <span class="section-title"><span class="section-bar"></span>基本信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.basic" class="info-table">
          <table class="basic-info-table">
            <tr><td class="label-cell">申请类型</td><td class="value-cell">商标驳回复审申请</td><td class="label-cell">申请编号</td><td class="value-cell link">{{ basic.applyNumber }}</td></tr>
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
            <thead style="background-color: #d6e8fd;"><tr><th style="width:180px"></th><th style="width:300px">申请信息</th><th style="width:180px">确认信息</th><th></th></tr></thead>
            <tbody>
              <tr><td class="label-cell">境内/境外</td><td class="value-cell">{{ appInfo.scopeLabel }}</td><td class="label-cell">/</td><td class="value-cell">/</td></tr>
              <tr><td class="label-cell">所属地区/国家</td><td class="value-cell">{{ appInfo.countryRegion }}</td><td class="label-cell req-label">商标所属国家/地区</td><td class="value-cell"><el-select v-model="form.confirmCountryRegion" placeholder="请选择" style="width:100%" :disabled="isReadonly"><el-option label="全部" value="全部" /><el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.name" /></el-select></td></tr>
              <tr><td class="label-cell">商标申请日期</td><td class="value-cell">{{ appInfo.trademarkApplyDate }}</td><td class="label-cell req-label">驳回复审申请日</td><td class="value-cell"><el-date-picker v-model="form.rejectionReviewDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">商标申请号</td><td class="value-cell">{{ appInfo.trademarkApplyNo }}</td><td class="label-cell req-label">商标申请编号</td><td class="value-cell"><el-input v-model="form.confirmTrademarkApplyNo" placeholder="请输入" :disabled="isReadonly" /></td></tr>
              <tr><td class="label-cell">申请商标</td><td class="value-cell"><img v-if="appInfo.brandPicUrl" :src="appInfo.brandPicUrl" class="brand-thumb" /></td><td class="label-cell req-label">申请商标</td><td class="value-cell"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'confirmBrandPicUrl')"><el-button class="btn-upload" plain>上传图片</el-button></el-upload><img v-if="brandPreview" :src="brandPreview" class="brand-thumb" /></td></tr>
              <tr><td class="label-cell">类别数量</td><td class="value-cell">{{ appInfo.classCount }}</td><td class="label-cell req-label">类别数量</td><td class="value-cell"><el-input v-model="form.confirmClassCount" placeholder="请输入" :disabled="isReadonly" /></td></tr>
            </tbody>
          </table>
        </div>

        <!-- 类别子表（确认侧含驳回复审结果） -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="类别编号" width="110" align="center">
              <template #default="scope"><el-input v-model="scope.row.categoryNo" placeholder="请输入" :disabled="isReadonly" /></template>
            </el-table-column>
            <el-table-column label="商品/服务项目" min-width="200">
              <template #default="scope"><span class="cell-text">{{ scope.row.productService || '-' }}</span></template>
            </el-table-column>
            <el-table-column label="驳回商品/服务项目" min-width="200">
              <template #default="scope"><el-input v-model="scope.row.rejectedProductService" placeholder="请输入" :disabled="isReadonly" /></template>
            </el-table-column>
            <el-table-column label="驳回理由" min-width="160">
              <template #default="scope"><el-input v-model="scope.row.rejectionReason" placeholder="请输入" :disabled="isReadonly" /></template>
            </el-table-column>
            <el-table-column label="申请复审理由" min-width="160">
              <template #default="scope"><el-input v-model="scope.row.reviewReason" placeholder="请输入" :disabled="isReadonly" /></template>
            </el-table-column>
            <el-table-column label="驳回复审结果" width="150" align="center">
              <template #default="scope">
                <el-select v-model="scope.row.reviewResult" placeholder="请选择" style="width:100%" :disabled="isReadonly">
                  <el-option label="成功" value="成功" />
                  <el-option label="失败" value="失败" />
                  <el-option label="部分成功" value="部分成功" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="驳回期限" width="240">
              <template #default="scope">
                <el-date-picker :model-value="deadlineValue(scope.row)" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 100%" @update:model-value="(v) => onDeadlineChange(scope.row, v)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default="scope">
                <div class="category-actions">
                  <el-button class="btn-circle" @click="addCategory(scope.$index)" :disabled="isReadonly"><el-icon><Plus /></el-icon></el-button>
                  <el-button class="btn-circle" @click="removeCategory(scope.$index)" :disabled="isReadonly || form.categories.length <= 1"><el-icon><Minus /></el-icon></el-button>
                </div>
              </template>
            </el-table-column>
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
          <div class="form-row-full">
            <label class="form-label">驳回商标注册申请复审申请书附件：</label>
            <div class="form-input">
              <el-input v-model="form.reviewApplicationText" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" />
              <div class="opinion-upload">
                <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleOpinionUpload(f, 'rejectionReviewAttachment')"><el-button class="btn-upload" plain size="small">{{ form.rejectionReviewAttachment ? '重新上传' : '上传附件' }}</el-button></el-upload>
                <a v-if="form.rejectionReviewAttachment && fileUrlMap['rejectionReviewAttachment']" :href="fileUrlMap['rejectionReviewAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['rejectionReviewAttachment'].name || '查看文件' }}</a>
                <span v-else-if="form.rejectionReviewAttachment" class="upload-status">已上传</span>
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
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleOpinionUpload(f, 'attachment')"><el-button class="btn-upload" plain>{{ form.attachment ? '重新上传' : '上传文件' }}</el-button></el-upload>
              <template v-for="(att, idx) in attachmentList" :key="idx"><a v-if="att.url" :href="att.url" target="_blank" class="file-link" @click.stop>{{ att.fileName || '查看文件' }}</a></template>
            </div>
          </div>
          <div class="attachment-item">
            <label class="attachment-label">备注：</label>
            <div class="attachment-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /></div>
          </div>
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
import { rejectionReviewGetConfirmDetail, rejectionReviewSaveConfirm, rejectionReviewSubmitConfirm } from '@/api/trademark/ap/rejectionReview'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { scopeMap } from '../config'

const route = useRoute()
const router = useRouter()
const saving = ref(false)
const isReadonly = ref(false)
const collapsed = ref({ basic: false, brand: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const options = ref({ countryRegion: [] })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const brandPreview = ref('')
const changeHeaderStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const basic = ref({})
const appInfo = ref({})

const form = ref({
  id: route.query.id || null,
  confirmCountryRegion: '', rejectionReviewDate: '',
  confirmTrademarkApplyNo: '', confirmBrandPicUrl: null, confirmClassCount: '',
  categories: [],
  reviewApplicationText: '', rejectionReviewAttachment: null,
  attachment: null, remark: '',
})

const pendingFiles = ref({
  confirmBrandPicUrl: null,
  rejectionReviewAttachment: null,
  attachment: null,
})

function emptyCategory() {
  return { categoryNo: '', productService: '', rejectedProductService: '', rejectionReason: '', reviewReason: '', reviewResult: '', rejectionDeadlineStart: '', rejectionDeadlineEnd: '' }
}
function addCategory(i) { form.value.categories.splice(i + 1, 0, emptyCategory()) }
function removeCategory(i) { if (form.value.categories.length > 1) form.value.categories.splice(i, 1) }

function deadlineValue(row) {
  return row.rejectionDeadlineStart && row.rejectionDeadlineEnd ? [row.rejectionDeadlineStart, row.rejectionDeadlineEnd] : []
}
function onDeadlineChange(row, val) {
  row.rejectionDeadlineStart = val && val[0] ? val[0] : ''
  row.rejectionDeadlineEnd = val && val[1] ? val[1] : ''
}

function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
  if (field === 'confirmBrandPicUrl') brandPreview.value = URL.createObjectURL(file.raw)
}
function handleOpinionUpload(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
  if (field === 'attachment') attachmentList.value = []
}

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
    rejectionReviewDate: form.value.rejectionReviewDate,
    confirmTrademarkApplyNo: form.value.confirmTrademarkApplyNo,
    confirmBrandPicUrl: form.value.confirmBrandPicUrl,
    confirmClassCount: form.value.confirmClassCount === '' || form.value.confirmClassCount == null ? null : Number(form.value.confirmClassCount),
    categories: form.value.categories,
    rejectionReviewAttachment: form.value.rejectionReviewAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

// 提交前校验（保存不校验，支持部分保存）
function validateConfirm() {
  if (!form.value.confirmCountryRegion) return '商标所属国家/地区不能为空'
  if (!form.value.rejectionReviewDate) return '驳回复审申请日不能为空'
  if (!form.value.confirmTrademarkApplyNo || !form.value.confirmTrademarkApplyNo.trim()) return '商标申请编号不能为空'
  if (!form.value.confirmBrandPicUrl && !pendingFiles.value.confirmBrandPicUrl) return '申请商标图片不能为空'
  if (form.value.confirmClassCount === '' || form.value.confirmClassCount == null) return '类别数量不能为空'
  const seen = []
  for (const c of form.value.categories) {
    if (!c.categoryNo || !String(c.categoryNo).trim()) return '类别编号不能为空'
    const no = Number(c.categoryNo)
    if (!Number.isInteger(no) || no < 1 || no > 45) return `类别编号“${c.categoryNo}”应为 1-45 之间的整数`
    if (seen.includes(no)) return `类别“${no}”重复填写`
    seen.push(no)
    if (!c.rejectedProductService || !c.rejectedProductService.trim()) return `类别“${no}”的驳回商品/服务项目不能为空`
    if (!c.rejectionReason || !c.rejectionReason.trim()) return `类别“${no}”的驳回理由不能为空`
    if (!c.reviewReason || !c.reviewReason.trim()) return `类别“${no}”的申请复审理由不能为空`
    if (!c.reviewResult) return `类别“${no}”的驳回复审结果不能为空`
    if (!c.rejectionDeadlineStart || !c.rejectionDeadlineEnd) return `类别“${no}”的驳回期限不能为空`
  }
  return ''
}

async function handleSave() {
  try { saving.value = true; await uploadPendingFiles(); await rejectionReviewSaveConfirm(buildParam()); ElMessage.success('保存成功') }
  catch (e) { ElMessage.error(e.message || '保存失败') } finally { saving.value = false }
}
async function handleSaveAndSubmit() {
  const err = validateConfirm()
  if (err) { ElMessage.error(err); return }
  try { saving.value = true; await uploadPendingFiles(); await rejectionReviewSubmitConfirm(buildParam()); ElMessage.success('提交成功'); router.back() }
  catch (e) { ElMessage.error(e.message || '提交失败') } finally { saving.value = false }
}
function handleCancel() { router.back() }

async function loadDetail() {
  const res = await rejectionReviewGetConfirmDetail(route.query.id)
  const vo = res.data
  if (!vo) return
  isReadonly.value = vo.basic?.status === 3
  basic.value = vo.basic || {}
  const applyCategories = vo.categories || []
  appInfo.value = {
    scopeLabel: scopeMap[vo.basic?.applyScope] || '-',
    countryRegion: vo.countryRegionName || '',
    trademarkApplyNo: vo.rejection?.trademarkApplyNo || vo.brand?.applyNo || '',
    trademarkApplyDate: vo.rejection?.trademarkApplyDate || '',
    brandPicUrl: vo.brandPicUrl || '',
    classCount: applyCategories.length,
  }
  const o = vo.rejection || {}
  form.value.confirmCountryRegion = o.confirmCountryRegion || vo.countryRegionName || ''
  form.value.rejectionReviewDate = o.rejectionReviewDate || ''
  form.value.confirmTrademarkApplyNo = o.confirmTrademarkApplyNo || o.trademarkApplyNo || appInfo.value.trademarkApplyNo || ''
  form.value.confirmClassCount = o.confirmClassCount || applyCategories.length || ''

  // 申请商标：确认侧优先已保存值，否则用主商标图预填
  form.value.confirmBrandPicUrl = o.confirmBrandPicUrl || null
  if (o.confirmBrandPicUrl) {
    if (/^https?:\/\//.test(o.confirmBrandPicUrl)) brandPreview.value = o.confirmBrandPicUrl
    else getImageUrl(o.confirmBrandPicUrl).then(r => { if (r && r.data) brandPreview.value = r.data }).catch(() => {})
  } else {
    const masterFileId = vo.brand && vo.brand.brandPicUrl
    if (masterFileId && vo.brandPicUrl) {
      brandPreview.value = vo.brandPicUrl
      form.value.confirmBrandPicUrl = masterFileId
    }
  }

  // 类别子表：以申请快照为准，商品/服务项目按类别号从申请侧类别列表回填
  const scopeByNo = {}
  applyCategories.forEach(c => { if (c.brandCategory != null) scopeByNo[String(c.brandCategory)] = c.producsecScope || '' })
  const rows = (o.categories && o.categories.length)
    ? o.categories.map(c => ({ ...emptyCategory(), ...c, productService: c.productService || scopeByNo[String(c.categoryNo)] || '' }))
    : applyCategories.map(c => ({ ...emptyCategory(), categoryNo: c.brandCategory, productService: c.producsecScope || '', rejectedProductService: c.producsecScope || '' }))
  form.value.categories = rows.length ? rows : [emptyCategory()]

  form.value.rejectionReviewAttachment = o.rejectionReviewAttachment
  resolveFileUrl('rejectionReviewAttachment', o.rejectionReviewAttachment)
  form.value.attachment = o.attachment
  if (o.attachmentList && o.attachmentList.length) {
    attachmentList.value = o.attachmentList
  } else if (o.attachment) {
    const n = String(o.attachment).includes('/') ? String(o.attachment).split('/').pop() : ''
    getImageUrl(o.attachment).then(r => { if (r && r.data) attachmentList.value = [{ fileName: n || '查看文件', url: r.data, fileId: o.attachment }] }).catch(() => {})
  }
  form.value.remark = o.remark || ''
}

onMounted(async () => {
  const crRes = await countryRegionGetList({ page: 1, pageSize: 1000 })
  options.value.countryRegion = (crRes.data && crRes.data.list) || crRes.data || []
  if (route.query.id) await loadDetail()
})
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  margin: 0 80px;

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
    .form-label { flex: 0 0 220px; text-align: right; padding-right: 12px; color: #333333; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 36px; white-space: wrap; font-weight: 500 !important; }
    .form-input { flex: 1; min-width: 0; }
  }
  .categoryTable { margin-top: 25px; padding: 0 24px 16px;
    :deep(.el-table) { border: none; }
    :deep(.el-table__header) { th { background: #FAFAFA; color: #333333; font-weight: 600; border: none; border-bottom: 1px solid #EBEEF5; } }
    :deep(.el-table__body) { td { height: 50px; border: none; border-bottom: 1px solid #EBEEF5; } }
    :deep(.el-table::before) { display: none; }
  }
  .cell-text { color: #333333; font-size: 14px; }
  .btn-upload { border-radius: 6px; font-size: 14px; padding: 15px 15px; font-weight: 500 !important; }
  .opinion-upload { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .upload-status { font-size: 12px; color: #67C23A; margin-left: 8px; }
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
}
.info-table { padding: 0 24px 16px; }
.basic-info-table, .confirm-info-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.basic-info-table td, .confirm-info-table td, .confirm-info-table th { border: 1px solid #E8E8E8; padding: 10px 12px; }
.label-cell { background: #f2f8ff; color: #666; width: 140px; text-align: center; }
.value-cell { color: #333; }
.link { color: #1890FF; cursor: pointer; }
.req-label { color: #333; }
.req-label::before { content: '* '; color: #FF4D4F; }
.brand-thumb { width: 40px; height: 40px; object-fit: contain; vertical-align: middle; margin-right: 4px; }
</style>
