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
          <td class="info-label">申请类型</td><td class="info-value">{{ typeName }}</td>
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
        </table>

        <!-- 变更项目三列表 -->
        <div class="categoryTable">
          <el-table :data="changeRows" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column prop="label" label="变更项目" width="200" align="center" />
            <el-table-column prop="before" label="变更前" min-width="300" />
            <el-table-column label="* 变更后" min-width="400">
              <template #default="scope">
                <el-input
                  v-if="scope.row.key === 'afterRegisterName' || scope.row.key === 'afterRegisterAddress'"
                  v-model="form[scope.row.key]"
                  placeholder="请输入"
                  :disabled="isReadonly || !registered"
                />
                <el-select
                  v-else-if="scope.row.key === 'afterAgensecId'"
                  v-model="form.afterAgensecId"
                  placeholder="请选择"
                  filterable
                  :disabled="isReadonly"
                  style="width: 100%"
                >
                  <el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" />
                </el-select>
                <div v-else class="cat-editor">
                  <div v-for="(c, i) in form.categories" :key="i" class="cat-row">
                    <el-input v-model="c.categoryNo" placeholder="类别编号" :disabled="isReadonly" class="cat-no" />
                    <el-input v-model="c.productService" placeholder="商品/服务项目" :disabled="isReadonly" class="cat-scope" />
                    <el-button v-if="!isReadonly" type="primary" link :icon="Plus" circle @click="addCategory(i)" />
                    <el-button v-if="!isReadonly" type="danger" link :icon="Minus" circle :disabled="form.categories.length <= 1" @click="removeCategory(i)" />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
          <label class="block-label">商标局批件：</label>
          <div class="block-input">
            <el-input v-model="form.approvalOpinion" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" />
            <div class="upload-line">
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'approvalOpinionAttachment')">
                <el-button class="btn-upload" plain>上传附件</el-button>
              </el-upload>
              <span v-if="form.approvalOpinionAttachment && !pendingFiles.approvalOpinionAttachment" class="uploaded-tip">已上传附件</span>
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
              <span v-if="form.attachment && !pendingFiles.attachment" class="uploaded-tip">已上传附件</span>
            </div>
          </div>
        </div>
        <div class="block-row">
          <label class="block-label">备注：</label>
          <div class="block-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { brandChangeSaveConfirm, brandChangeSubmitConfirm, brandChangeGetConfirmDetail } from '@/api/trademark/ap/brandChange'
import { typeMap, scopeMap, brandStatusOptions } from '../config'
import { agentGetList } from '@/api/trademark/bd/agent'
import { uploadFileApi } from '@/api/file'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Minus, DArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref({ basic: false, brand: false, opinion: false, attachment: false })
// 已确认状态下为只读展示
const isReadonly = ref(false)
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

// 被变更商标现状（只读展示）
const brand = ref(null)
const countryRegionName = ref('')
// 变更前留痕（来自变更申请表快照）
const before = ref({ registerName: '', registerAddress: '', producsecScope: '' })
const beforeAgensecName = ref('')

// 待上传文件（保存时统一上传）
const pendingFiles = ref({ approvalOpinionAttachment: null, attachment: null })
const options = ref({ agent: [] })

const changeHeaderStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const form = ref({
  id: route.query.id || null,
  type: 1,
  applyNumber: '', applyDate: '', applyPerson: '', applyScope: null, applyDepartment: '', remarks: '',
  afterRegisterName: '', afterRegisterAddress: '', afterAgensecId: null,
  approvalOpinion: '', approvalOpinionAttachment: null, attachment: null, remark: '',
  categories: [],
})

const typeName = computed(() => (form.value.type === 1 ? '商标变更申请' : (typeMap[form.value.type] || '-')))
const scopeLabel = computed(() => scopeMap[form.value.applyScope] || '-')
// 是否已注册：申请中商标尚无注册人/注册人地址，对应变更项禁止输入
const registered = computed(() => !!brand.value && brand.value.applyStatus === 1)
// 注册编号优先（已注册必有），否则申请编号
const regFirstNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.brandNo || brand.value.applyNo || '') : (brand.value.applyNo || '')
})
// 申请编号优先
const appFirstNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyNo || brand.value.brandNo || ''
})
// 商标申请/注册人：已注册显示注册人，申请中显示申请人（与台账口径一致）
const personLabel = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.registerPerson || '') : (brand.value.applyPerson || '')
})
const statusLabel = computed(() => {
  if (!brand.value || brand.value.applyStatus == null) return ''
  const hit = brandStatusOptions.find(o => o.value === brand.value.applyStatus)
  return hit ? hit.label : ''
})

// 变更项目三列表数据
const changeRows = computed(() => [
  { label: '注册人名称', before: before.value.registerName, key: 'afterRegisterName' },
  { label: '注册人地址', before: before.value.registerAddress, key: 'afterRegisterAddress' },
  { label: '商标代理人', before: beforeAgensecName.value, key: 'afterAgensecId' },
  { label: '商标/服务项目', before: before.value.producsecScope, key: 'categories' },
])

onMounted(() => {
  loadOptions()
  if (form.value.id) loadDetail()
})

async function loadOptions() {
  try {
    const a = await agentGetList({ page: 1, pageSize: 1000 })
    options.value = { agent: (a.data && a.data.list) || [] }
  } catch (e) { console.error(e) }
}

async function loadDetail() {
  try {
    const res = await brandChangeGetConfirmDetail(form.value.id)
    const d = res.data
    if (!d) return
    if (d.basic) {
      form.value.type = d.basic.type
      form.value.applyNumber = d.basic.applyNumber || ''
      form.value.applyDate = d.basic.applyDate || ''
      form.value.applyPerson = d.basic.applyPerson || ''
      form.value.applyScope = d.basic.applyScope
      form.value.applyDepartment = d.basic.applyDepartment || ''
      form.value.remarks = d.basic.remarks || ''
      // 已确认状态：只读展示
      isReadonly.value = d.basic.status === 3
    }
    brand.value = d.brand || null
    countryRegionName.value = d.countryRegionName || ''
    beforeAgensecName.value = d.beforeAgensecName || ''
    if (d.change) {
      before.value = {
        registerName: d.change.beforeRegisterName || '',
        registerAddress: d.change.beforeRegisterAddress || '',
        producsecScope: d.change.beforeProducsecScope || '',
      }
      form.value.afterRegisterName = d.change.afterRegisterName || ''
      form.value.afterRegisterAddress = d.change.afterRegisterAddress || ''
      form.value.afterAgensecId = d.change.afterAgensecId ?? null
      form.value.approvalOpinion = d.change.approvalOpinion || ''
      form.value.approvalOpinionAttachment = d.change.approvalOpinionAttachment
      form.value.attachment = d.change.attachment
      form.value.remark = d.change.remark || ''
      // 变更后类别：优先解析变更后快照文本，空则回退台账当前类别
      const rows = parseScopeText(d.change.afterProducsecScope)
      form.value.categories = rows.length
        ? rows
        : (d.categories || []).map(c => ({ categoryNo: String(c.brandCategory), productService: c.producsecScope || '' }))
    }
    if (!form.value.categories.length) form.value.categories = [newCategory()]
  } catch (e) {
    console.error('加载确认数据失败:', e)
  }
}

// 解析“类别编号: 商品/服务项目;”快照文本为行（切分边界与编制页校验一致）
function parseScopeText(text) {
  const val = (text || '').trim()
  if (!val) return []
  const rows = []
  const segments = val.split(/\s+(?=\d{1,2}\s*[:：])/).map(s => s.trim()).filter(Boolean)
  for (const seg of segments) {
    const m = seg.match(/^(\d{1,2})\s*[:：]\s*([\s\S]+)$/)
    if (!m) return []
    rows.push({ categoryNo: m[1], productService: m[2].replace(/[\s;；]+$/, '') })
  }
  return rows
}

function newCategory() {
  return { categoryNo: '', productService: '' }
}
function addCategory(i) {
  form.value.categories.splice(i + 1, 0, newCategory())
}
function removeCategory(i) {
  if (form.value.categories.length > 1) form.value.categories.splice(i, 1)
}

// 确认提交前校验：变更后必填项 + 类别子表
function validateConfirm() {
  if (registered.value) {
    if (!form.value.afterRegisterName.trim()) return '变更后注册人名称不能为空'
    if (!form.value.afterRegisterAddress.trim()) return '变更后注册人地址不能为空'
  }
  if (!form.value.afterAgensecId) return '变更后商标代理人不能为空'
  // 全空行视为不修改类别，跳过；半空行报错
  const rows = form.value.categories.filter(c => c.categoryNo || c.productService)
  const seen = []
  for (const c of rows) {
    const no = Number(c.categoryNo)
    if (!c.categoryNo || !Number.isInteger(no) || no < 1 || no > 45) return `类别编号“${c.categoryNo || ''}”应为 1-45 之间的整数`
    if (!c.productService.replace(/[;；\s]/g, '')) return `类别“${no}”的商品/服务项目不能为空`
    if (seen.includes(no)) return `类别“${no}”重复填写`
    seen.push(no)
  }
  return ''
}

// 附件选择（暂存，保存时统一上传）
function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
}

async function uploadPendingFiles() {
  for (const field of ['approvalOpinionAttachment', 'attachment']) {
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
    id: form.value.id,
    afterRegisterName: form.value.afterRegisterName,
    afterRegisterAddress: form.value.afterRegisterAddress,
    afterAgensecId: form.value.afterAgensecId,
    // 只提交填写了的类别行；全空表示不修改类别
    categories: form.value.categories
      .filter(c => c.categoryNo || c.productService)
      .map(c => ({ categoryNo: c.categoryNo, productService: c.productService })),
    approvalOpinion: form.value.approvalOpinion,
    approvalOpinionAttachment: form.value.approvalOpinionAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

async function handleSave() {
  const err = validateConfirm()
  if (err) { ElMessage.error(err); return }
  try {
    await uploadPendingFiles()
    await brandChangeSaveConfirm(buildParam())
    ElMessage.success('保存成功')
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '保存失败')
  }
}

async function handleSaveAndSubmit() {
  const err = validateConfirm()
  if (err) { ElMessage.error(err); return }
  try {
    await uploadPendingFiles()
    await brandChangeSubmitConfirm(buildParam())
    ElMessage.success('确认提交成功')
    router.back()
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '确认提交失败')
  }
}

function handleCancel() { router.back() }
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  margin: 0 40px;

  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #333333;
      margin: 0;
    }
    .topBtn {
      display: flex;
      gap: 12px;
    }
  }

  .section {
    margin-bottom: 28px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #E8F4FD;
    padding: 10px 16px;
    margin-bottom: 16px;
    cursor: pointer;

    .section-title {
      display: flex;
      align-items: center;
      font-size: 18px;
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

  .info-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    table-layout: fixed;

    td {
      border: 1px solid #E8E8E8;
      padding: 10px 16px;
      font-size: 14px;
      color: #333333;
      vertical-align: middle;
      word-break: break-all;
      text-align: center;
    }
    .info-label {
      background: #F0F7FF;
      text-align: center;
    }
    .info-value {
      background: #FFFFFF;
      text-align: left;
    }
    .link { color: #1890FF; }
    .req { color: #FF4D4F; margin-right: 2px; }
  }

  .categoryTable {
    margin-top: 16px;

    :deep(.el-table) { border: none; }
    :deep(.el-table__header) {
      th {
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

  .cat-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 0;
  }
  .cat-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .cat-no { flex: 0 0 100px; }
    .cat-scope { flex: 1; }
  }

  .block-body {
    padding: 4px 0;
  }
  .block-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;

    .block-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-size: 14px;
      line-height: 32px;
      white-space: nowrap;
    }
    .block-input {
      flex: 1;
      max-width: 760px;
      min-width: 0;
    }
  }
  .upload-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  .uploaded-tip {
    font-size: 12px;
    color: #67C23A;
  }

  .btn-upload {
    border-radius: 6px;
    font-size: 14px;
  }
}
</style>
