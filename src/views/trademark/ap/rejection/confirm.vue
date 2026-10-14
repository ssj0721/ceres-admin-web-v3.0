<template>
  <div class="form-page">
    <div class="page-head">
      <h1 class="page-title">编制确认表</h1>
      <div class="topBtn">
        <el-button v-if="!isReadonly" type="primary" @click="handleSave">保存</el-button>
        <el-button v-if="!isReadonly" @click="handleSaveAndSubmit">保存并提交</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('basic')">
        <span class="section-title"><span class="section-bar"></span>基本信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
      </div>
      <table v-show="!collapsed.basic" class="info-table">
        <colgroup>
          <col style="width: 20%" /><col style="width: 30%" /><col style="width: 20%" /><col style="width: 30%" />
        </colgroup>
        <tr>
          <td class="info-label">申请类型</td><td class="info-value">商标驳回复审申请</td>
          <td class="info-label">申请编号</td><td class="info-value link">{{ form.applyNumber }}</td>
        </tr>
        <tr>
          <td class="info-label">单据申请人</td><td class="info-value">{{ form.applyPerson }}</td>
          <td class="info-label">申请日期</td><td class="info-value">{{ form.applyDate }}</td>
        </tr>
        <tr>
          <td class="info-label">申请部门</td><td class="info-value">{{ form.applyDepartment }}</td>
          <td class="info-label"></td><td class="info-value"></td>
        </tr>
        <tr>
          <td class="info-label">备注</td><td class="info-value" colspan="3">{{ form.remarks || '-' }}</td>
        </tr>
      </table>
    </div>

    <!-- 商标信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('brand')">
        <span class="section-title"><span class="section-bar"></span>商标信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon>
      </div>
      <div v-show="!collapsed.brand">
        <table class="info-table">
          <colgroup>
            <col style="width: 20%" /><col style="width: 30%" /><col style="width: 20%" /><col style="width: 30%" />
          </colgroup>
          <tr>
            <td class="info-label">商标注册/申请编号</td><td class="info-value">{{ regFirstNo || '-' }}</td>
            <td class="info-label">境内/境外</td><td class="info-value">{{ scopeLabel }}</td>
          </tr>
          <tr>
            <td class="info-label">所属国家/地区</td><td class="info-value">{{ countryRegionName || '-' }}</td>
            <td class="info-label">商标申请/注册人</td><td class="info-value">{{ personLabel || '-' }}</td>
          </tr>
          <tr>
            <td class="info-label">商标申请/注册号</td><td class="info-value">{{ appFirstNo || '-' }}</td>
            <td class="info-label">商标状态</td><td class="info-value">{{ statusLabel || '-' }}</td>
          </tr>
          <tr>
            <td class="info-label">商标申请号</td><td class="info-value">{{ form.trademarkApplyNoInput || '-' }}</td>
            <td class="info-label">商标申请日期</td><td class="info-value">{{ form.trademarkApplyDate || '-' }}</td>
          </tr>
        </table>

        <!-- 类别子表（含驳回字段，确认侧可编辑） -->
        <div class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="类别编号" width="120" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.categoryNo" placeholder="请输入" :disabled="isReadonly" />
              </template>
            </el-table-column>
            <el-table-column label="商品/服务项目" min-width="200">
              <template #default="scope">
                <el-input v-model="scope.row.productService" placeholder="请输入" :disabled="isReadonly" />
              </template>
            </el-table-column>
            <el-table-column label="驳回商品/服务项目" min-width="200">
              <template #default="scope">
                <el-input v-model="scope.row.rejectedProductService" placeholder="请输入" :disabled="isReadonly" />
              </template>
            </el-table-column>
            <el-table-column label="驳回理由" min-width="150">
              <template #default="scope">
                <el-input v-model="scope.row.rejectionReason" placeholder="请输入" :disabled="isReadonly" />
              </template>
            </el-table-column>
            <el-table-column label="申请复审理由" min-width="150">
              <template #default="scope">
                <el-input v-model="scope.row.reviewReason" placeholder="请输入" :disabled="isReadonly" />
              </template>
            </el-table-column>
            <el-table-column label="驳回期限" width="220">
              <template #default="scope">
                <el-date-picker v-model="scope.row.rejectionDeadline" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 100%" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 确认信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('confirm')">
        <span class="section-title"><span class="section-bar"></span>确认信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.confirm }"><DArrowRight /></el-icon>
      </div>
      <div v-show="!collapsed.confirm" class="form-grid">
        <div class="form-row">
          <label class="form-label">确认国家/地区：</label>
          <div class="form-input"><el-input v-model="form.confirmCountryRegion" placeholder="请输入" :disabled="isReadonly" /></div>
        </div>
        <div class="form-row">
          <label class="form-label">驳回复审申请日：</label>
          <div class="form-input"><el-date-picker v-model="form.rejectionReviewDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择" :disabled="isReadonly" style="width: 100%" /></div>
        </div>
        <div class="form-row">
          <label class="form-label">商标申请编号：</label>
          <div class="form-input"><el-input v-model="form.confirmTrademarkApplyNo" placeholder="请输入" :disabled="isReadonly" /></div>
        </div>
        <div class="form-row">
          <label class="form-label">类别数量：</label>
          <div class="form-input"><el-input v-model="form.confirmClassCount" type="number" placeholder="请输入" :disabled="isReadonly" /></div>
        </div>
      </div>
      <div v-show="!collapsed.confirm" class="form-basic-row-full">
        <label class="form-label">驳回商标注册申请复审理由书附件：</label>
        <div class="form-input">
          <div class="upload-line">
            <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'rejectionReviewAttachment')">
              <el-button class="btn-upload" plain>上传附件</el-button>
            </el-upload>
            <a v-if="form.rejectionReviewAttachment && !pendingFiles.rejectionReviewAttachment && fileUrlMap['rejectionReviewAttachment']" :href="fileUrlMap['rejectionReviewAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['rejectionReviewAttachment'].name || '查看文件' }}</a>
            <span v-else-if="form.rejectionReviewAttachment && !pendingFiles.rejectionReviewAttachment" class="uploaded-tip">已上传附件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 批件与意见信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('opinion')">
        <span class="section-title"><span class="section-bar"></span>批件与意见信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.opinion }"><DArrowRight /></el-icon>
      </div>
      <div v-show="!collapsed.opinion" class="block-body">
        <div class="block-row">
          <label class="block-label">代理人意见：</label>
          <div class="block-input">
            <el-input v-model="form.agentOpinion" type="textarea" :rows="3" disabled />
            <div class="upload-line">
              <a v-if="form.agentOpinionAttachment && !pendingFiles.agentOpinionAttachment && fileUrlMap['agentOpinionAttachment']" :href="fileUrlMap['agentOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['agentOpinionAttachment'].name || '查看文件' }}</a>
              <span v-else-if="form.agentOpinionAttachment && !pendingFiles.agentOpinionAttachment" class="uploaded-tip">已上传附件</span>
            </div>
          </div>
        </div>
        <div class="block-row">
          <label class="block-label">秘书处意见：</label>
          <div class="block-input">
            <el-input v-model="form.secretaryOpinion" type="textarea" :rows="3" disabled />
            <div class="upload-line">
              <a v-if="form.secretaryOpinionAttachment && !pendingFiles.secretaryOpinionAttachment && fileUrlMap['secretaryOpinionAttachment']" :href="fileUrlMap['secretaryOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['secretaryOpinionAttachment'].name || '查看文件' }}</a>
              <span v-else-if="form.secretaryOpinionAttachment && !pendingFiles.secretaryOpinionAttachment" class="uploaded-tip">已上传附件</span>
            </div>
          </div>
        </div>
        <div class="block-row">
          <label class="block-label">旭日管理层意见：</label>
          <div class="block-input">
            <el-input v-model="form.managementOpinion" type="textarea" :rows="3" disabled />
            <div class="upload-line">
              <a v-if="form.managementOpinionAttachment && !pendingFiles.managementOpinionAttachment && fileUrlMap['managementOpinionAttachment']" :href="fileUrlMap['managementOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['managementOpinionAttachment'].name || '查看文件' }}</a>
              <span v-else-if="form.managementOpinionAttachment && !pendingFiles.managementOpinionAttachment" class="uploaded-tip">已上传附件</span>
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
      <div v-show="!collapsed.attachment" class="block-body">
        <div class="block-row">
          <label class="block-label">附件：</label>
          <div class="block-input">
            <div class="upload-line">
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'attachment')">
                <el-button class="btn-upload" plain>上传文件</el-button>
              </el-upload>
              <template v-for="(att, idx) in attachmentList" :key="idx">
                <a v-if="att.url" :href="att.url" target="_blank" class="file-link" @click.stop>{{ att.fileName || '查看文件' }}</a>
              </template>
              <span v-if="form.attachment && !pendingFiles.attachment && !attachmentList.length" class="uploaded-tip">已上传附件</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { rejectionReviewSaveConfirm, rejectionReviewSubmitConfirm, rejectionReviewGetConfirmDetail } from '@/api/trademark/ap/rejectionReview'
import { scopeMap, brandStatusOptions } from '../config'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { onMounted, ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref({ basic: false, brand: false, confirm: false, opinion: false, attachment: false })
const isReadonly = ref(false)
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const brand = ref(null)
const countryRegionName = ref('')

const pendingFiles = ref({
  rejectionReviewAttachment: null,
  agentOpinionAttachment: null,
  secretaryOpinionAttachment: null,
  managementOpinionAttachment: null,
  attachment: null
})
const fileUrlMap = reactive({})
const attachmentList = ref([])

const changeHeaderStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const form = ref({
  id: route.query.id || null,
  applyNumber: '', applyDate: '', applyPerson: '', applyScope: null, applyDepartment: '', remarks: '',
  trademarkApplyNoInput: '', trademarkApplyDate: '',
  categories: [],
  confirmCountryRegion: '', rejectionReviewDate: '', confirmTrademarkApplyNo: '', confirmClassCount: null,
  rejectionReviewAttachment: null,
  agentOpinion: '', agentOpinionAttachment: null,
  secretaryOpinion: '', secretaryOpinionAttachment: null,
  managementOpinion: '', managementOpinionAttachment: null,
  attachment: null,
})

const scopeLabel = computed(() => scopeMap[form.value.applyScope] || '-')
const regFirstNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.brandNo || brand.value.applyNo || '') : (brand.value.applyNo || '')
})
const appFirstNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyNo || brand.value.brandNo || ''
})
const personLabel = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.registerPerson || '') : (brand.value.applyPerson || '')
})
const statusLabel = computed(() => {
  if (!brand.value || brand.value.applyStatus == null) return ''
  const hit = brandStatusOptions.find(o => o.value === brand.value.applyStatus)
  return hit ? hit.label : ''
})

onMounted(() => {
  if (form.value.id) loadDetail()
})

async function loadDetail() {
  try {
    const res = await rejectionReviewGetConfirmDetail(form.value.id)
    const d = res.data
    if (!d) return
    if (d.basic) {
      form.value.applyNumber = d.basic.applyNumber || ''
      form.value.applyDate = d.basic.applyDate || ''
      form.value.applyPerson = d.basic.applyPerson || ''
      form.value.applyScope = d.basic.applyScope
      form.value.applyDepartment = d.basic.applyDepartment || ''
      form.value.remarks = d.basic.remarks || ''
      isReadonly.value = d.basic.status === 3
    }
    brand.value = d.brand || null
    countryRegionName.value = d.countryRegionName || ''
    if (d.rejection) {
      form.value.trademarkApplyNoInput = d.rejection.trademarkApplyNo || ''
      form.value.trademarkApplyDate = d.rejection.trademarkApplyDate || ''
      form.value.agentOpinion = d.rejection.agentOpinion || ''
      form.value.agentOpinionAttachment = d.rejection.agentOpinionAttachment
      resolveFileUrl('agentOpinionAttachment', d.rejection.agentOpinionAttachment)
      form.value.secretaryOpinion = d.rejection.secretaryOpinion || ''
      form.value.secretaryOpinionAttachment = d.rejection.secretaryOpinionAttachment
      resolveFileUrl('secretaryOpinionAttachment', d.rejection.secretaryOpinionAttachment)
      form.value.managementOpinion = d.rejection.managementOpinion || ''
      form.value.managementOpinionAttachment = d.rejection.managementOpinionAttachment
      resolveFileUrl('managementOpinionAttachment', d.rejection.managementOpinionAttachment)
      form.value.rejectionReviewAttachment = d.rejection.rejectionReviewAttachment
      resolveFileUrl('rejectionReviewAttachment', d.rejection.rejectionReviewAttachment)
      form.value.attachment = d.rejection.attachment
      if (d.rejection.attachmentList && d.rejection.attachmentList.length) {
        attachmentList.value = d.rejection.attachmentList
      } else if (d.rejection.attachment) {
        const n = String(d.rejection.attachment).includes('/') ? String(d.rejection.attachment).split('/').pop() : ''
        getImageUrl(d.rejection.attachment).then(r => { if (r && r.data) attachmentList.value = [{ fileName: n || '查看文件', url: r.data, fileId: d.rejection.attachment }] }).catch(() => {})
      }
      // 确认侧字段
      form.value.confirmCountryRegion = d.rejection.confirmCountryRegion || ''
      form.value.rejectionReviewDate = d.rejection.rejectionReviewDate || ''
      form.value.confirmTrademarkApplyNo = d.rejection.confirmTrademarkApplyNo || ''
      form.value.confirmClassCount = d.rejection.confirmClassCount
      // 类别子表
      if (d.rejection.categories && d.rejection.categories.length) {
        form.value.categories = d.rejection.categories
      }
    }
  } catch (e) {
    console.error('加载确认数据失败:', e)
  }
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

function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
  if (field === 'attachment') { attachmentList.value = [] }
}

async function uploadPendingFiles() {
  for (const field of ['rejectionReviewAttachment', 'attachment']) {
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
    id: form.value.id,
    confirmCountryRegion: form.value.confirmCountryRegion,
    rejectionReviewDate: form.value.rejectionReviewDate,
    confirmTrademarkApplyNo: form.value.confirmTrademarkApplyNo,
    confirmClassCount: form.value.confirmClassCount,
    categories: form.value.categories,
    rejectionReviewAttachment: form.value.rejectionReviewAttachment,
    attachment: form.value.attachment,
  }
}

async function doSave() {
  try {
    await uploadPendingFiles()
    const param = buildParam()
    await rejectionReviewSaveConfirm(param)
    ElMessage.success('保存成功')
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

function handleSave() { doSave() }

async function handleSaveAndSubmit() {
  try {
    await uploadPendingFiles()
    const param = buildParam()
    await rejectionReviewSubmitConfirm(param)
    ElMessage.success('提交成功')
    router.back()
  } catch (e) {
    console.error(e)
  }
}

function handleCancel() { router.back() }
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  margin: 0 80px;

  .page-head {
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

  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    .info-label {
      background: #FAFAFA;
      padding: 12px 16px;
      text-align: right;
      color: #666666;
      font-size: 14px;
      border: 1px solid #EBEEF5;
    }

    .info-value {
      padding: 12px 16px;
      color: #333333;
      font-size: 14px;
      border: 1px solid #EBEEF5;

      &.link { color: #409eff; }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 100px;
    padding: 0 260px 0 120px;
  }

  .form-row {
    display: flex;
    align-items: flex-start;

    .form-label {
      flex: 0 0 180px;
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

  .form-basic-row-full {
    display: flex;
    align-items: flex-start;
    padding: 20px 380px 0 120px;

    .form-label {
      flex: 0 0 200px;
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

  .block-body {
    padding: 0 60px;

    .block-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;

      .block-label {
        flex: 0 0 150px;
        text-align: right;
        padding-right: 12px;
        color: #333333;
        font-size: 14px;
        line-height: 36px;
      }

      .block-input {
        flex: 1;
        min-width: 0;
      }
    }
  }

  .upload-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;

    .uploaded-tip {
      font-size: 12px;
      color: #67C23A;
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

  .file-link { color: #409eff; text-decoration: none; font-size: 13px; }
  .file-link:hover { text-decoration: underline; }
}
</style>
