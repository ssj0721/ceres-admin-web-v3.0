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
          <td class="info-label">境内/境外</td><td class="info-value">{{ scopeMap[form.applyScope] || '-' }}</td>
          <td class="info-label">申请部门</td><td class="info-value">{{ form.applyDepartment }}</td>
        </tr>
        <tr>
          <td class="info-label">注册商标业务</td><td class="info-value">{{ registerTypeName }}</td>
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
          <tr class="group-head">
            <td colspan="2">申请信息</td>
            <td colspan="2"><span class="req">*</span>确认信息</td>
          </tr>
          <tr>
            <td class="info-label">/</td><td class="info-value"></td>
            <td class="info-label"><span class="req">*</span>商标首次注册期限起始日</td>
            <td class="info-value"><el-date-picker v-model="form.firstValidityStartDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 200px" /></td>
          </tr>
          <tr>
            <td class="info-label">申请日期</td><td class="info-value">{{ form.applyDate }}</td>
            <td class="info-label"><span class="req">*</span>商标注册日期</td>
            <td class="info-value"><el-date-picker v-model="form.registrationDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 200px" /></td>
          </tr>
          <tr>
            <td class="info-label">/</td><td class="info-value"></td>
            <td class="info-label"><span class="req">*</span>最新注册期限</td>
            <td class="info-value"><el-date-picker v-model="regPeriodRange" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 240px" /></td>
          </tr>
          <tr>
            <td class="info-label">所属地区/国家</td><td class="info-value">{{ origCountryRegionName || '-' }}</td>
            <td class="info-label"><span class="req">*</span>商标所属国家/地区</td>
            <td class="info-value">
              <el-select v-model="form.countryRegionId" placeholder="请选择" filterable :disabled="isReadonly" style="width: 200px">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="info-label">商标申请人</td><td class="info-value">{{ form.applyPerson }}</td>
            <td class="info-label"><span class="req">*</span>商标注册人</td>
            <td class="info-value"><el-input v-model="form.registerPerson" placeholder="请输入" :disabled="isReadonly" /></td>
          </tr>
          <tr>
            <td class="info-label">商标申请人地址</td><td class="info-value">{{ form.applyAddress }}</td>
            <td class="info-label"><span class="req">*</span>注册人地址</td>
            <td class="info-value"><el-input v-model="form.registerAddress" placeholder="请输入" :disabled="isReadonly" /></td>
          </tr>
          <tr>
            <td class="info-label">商标申请编号</td><td class="info-value link">{{ form.applyNumber }}</td>
            <td class="info-label"><span class="req">*</span>商标注册编号</td>
            <td class="info-value"><el-input v-model="form.registerNumber" placeholder="请输入" :disabled="isReadonly" /></td>
          </tr>
          <tr>
            <td class="info-label">商标</td>
            <td class="info-value"><img v-if="originalBrandImg" :src="originalBrandImg" class="brand-thumb" /><span v-else>/</span></td>
            <td class="info-label"><span class="req">*</span>商标</td>
            <td class="info-value">
              <div class="brand-confirm-wrap">
                <img v-if="confirmBrandImg" :src="confirmBrandImg" class="brand-thumb" />
                <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" accept=".jpg,.jpeg" :show-file-list="false" :on-change="handleBrandChange">
                  <el-button class="btn-upload" plain>上传图片</el-button>
                </el-upload>
              </div>
            </td>
          </tr>
          <tr>
            <td class="info-label">商标系列</td><td class="info-value">{{ origSeriesName || '-' }}</td>
            <td class="info-label"><span class="req">*</span>商标系列</td>
            <td class="info-value">
              <el-select v-model="form.seriesId" placeholder="请输入" filterable :disabled="isReadonly" style="width: 200px">
                <el-option v-for="item in options.brandSeries" :key="item.id" :label="item.seriesName" :value="item.id" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="info-label">类别数量</td><td class="info-value">{{ original.categoryCount }}</td>
            <td class="info-label"><span class="req">*</span>类别数量</td>
            <td class="info-value"><el-input :model-value="String(acceptedCount)" disabled style="width: 80px" /></td>
          </tr>
        </table>

        <!-- 类别子表 -->
        <table class="info-table category-table">
          <colgroup>
            <col style="width: 10%" /><col style="width: 30%" /><col style="width: 16%" /><col style="width: 34%" /><col style="width: 10%" />
          </colgroup>
          <tr class="group-head">
            <td class="cat-no"><span class="req">*</span>类别编号</td>
            <td class="cat-scope">申请使用商品/服务项目</td>
            <td class="cat-approved" colspan="2"><span class="req">*</span>核定使用商品/服务项目</td>
            <td class="cat-ops"></td>
          </tr>
          <tr v-for="(c, i) in form.categories" :key="i">
            <td class="cat-no"><el-input v-model="c.categoryNo" placeholder="请输入" :disabled="isReadonly" /></td>
            <td class="cat-scope">{{ c.productService || '/' }}</td>
            <td class="cat-result">
              <el-select v-model="c.acceptResult" placeholder="选择受理结果" :disabled="isReadonly" style="width: 140px">
                <el-option label="通过" value="1" />
                <el-option label="不通过" value="0" />
              </el-select>
            </td>
            <td class="cat-approved"><el-input v-model="c.approvedScope" placeholder="请输入" :disabled="isReadonly || c.acceptResult !== '1'" /></td>
            <td class="cat-ops">
              <el-button v-if="!isReadonly" type="primary" link :icon="Plus" circle @click="addCategory(i)" />
              <el-button v-if="!isReadonly" type="danger" link :icon="Minus" circle :disabled="form.categories.length <= 1" @click="removeCategory(i)" />
            </td>
          </tr>
        </table>
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
            <el-input v-model="form.agensecOpinion" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" />
            <div class="upload-line">
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'agensecOpinionUrl')">
                <el-button class="btn-upload" plain>上传附件</el-button>
              </el-upload>
              <span v-if="form.agensecOpinionUrl && !pendingFiles.agensecOpinionUrl" class="uploaded-tip">已上传附件</span>
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
import { registerSaveConfirm, registerSubmitConfirm, registerGetConfirmDetail } from '@/api/trademark/ap/register'
import { typeMap, scopeMap, registerTypeOptions } from '../config'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { brandSeriesGetList } from '@/api/trademark/bd/brandSeries'
import { uploadFileApi, getImageUrl } from '@/api/file'
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

// 左列：原申请信息（只读）
const original = ref({ countryRegionName: '', seriesName: '', categoryCount: 0, countryRegionId: null, seriesId: null })
const originalBrandImg = ref('')
// 右列：确认信息图片预览
const confirmBrandImg = ref('')

const regPeriodRange = ref([])
const pendingFiles = ref({ brandPicUrl: null, agensecOpinionUrl: null, attachment: null })
const options = ref({ countryRegion: [], brandSeries: [] })

const form = ref({
  id: route.query.id || null,
  type: 0,
  applyNumber: '', applyDate: '', applyPerson: '', applyScope: null, applyDepartment: '', remarks: '',
  registerType: null, applyAddress: '',
  firstValidityStartDate: '', registrationDate: '',
  countryRegionId: null, registerPerson: '', registerAddress: '', registerNumber: '',
  brandPicUrl: '', seriesId: null,
  agensecOpinion: '', agensecOpinionUrl: null, attachment: null, remark: '',
  categories: [],
})

const acceptedCount = computed(() => form.value.categories.filter(c => c.acceptResult !== '0').length)
const origCountryRegionName = computed(() => {
  if (original.value.countryRegionName) return original.value.countryRegionName
  const item = options.value.countryRegion.find(i => i.id === original.value.countryRegionId)
  return item ? item.name : ''
})
const origSeriesName = computed(() => {
  if (original.value.seriesName) return original.value.seriesName
  const item = options.value.brandSeries.find(i => i.id === original.value.seriesId)
  return item ? item.seriesName : ''
})
const typeName = computed(() => typeMap[form.value.type] || '-')
const registerTypeName = computed(() => {
  const item = registerTypeOptions.find(t => t.value === form.value.registerType)
  return item ? item.label : '-'
})

onMounted(() => {
  loadOptions()
  if (form.value.id) loadDetail()
})

async function loadOptions() {
  try {
    const [cr, bs] = await Promise.all([
      countryRegionGetList({ page: 1, pageSize: 1000 }),
      brandSeriesGetList({ page: 1, pageSize: 1000 }),
    ])
    options.value.countryRegion = cr.data.list || []
    options.value.brandSeries = bs.data.list || []
  } catch (e) { console.error(e) }
}

async function loadDetail() {
  try {
    const res = await registerGetConfirmDetail(form.value.id)
    const d = res.data
    if (!d) return
    // 基本信息
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
    form.value.registerType = d.registerType
    form.value.applyAddress = d.applyAddress || ''
    // 左列原申请信息
    original.value.countryRegionName = d.countryRegionName || ''
    original.value.seriesName = d.seriesName || ''
    original.value.countryRegionId = d.countryRegionId
    original.value.seriesId = d.seriesId
    original.value.categoryCount = d.categoryCount != null ? d.categoryCount : (d.categories ? d.categories.length : 0)
    // 确认信息回填
    form.value.firstValidityStartDate = d.firstValidityStartDate || ''
    form.value.registrationDate = d.registrationDate || ''
    if (d.validityStartDate && d.validityEndDate) regPeriodRange.value = [d.validityStartDate, d.validityEndDate]
    form.value.countryRegionId = d.countryRegionId
    form.value.registerPerson = d.registerPerson || ''
    form.value.registerAddress = d.registerAddress || ''
    form.value.registerNumber = d.registerNumber || ''
    form.value.brandPicUrl = d.brandPicUrl || ''
    form.value.seriesId = d.seriesId
    form.value.agensecOpinion = d.agensecOpinion || ''
    form.value.agensecOpinionUrl = d.agensecOpinionUrl
    form.value.attachment = d.attachment
    form.value.remark = d.remark || ''
    if (d.categories && d.categories.length > 0) {
      form.value.categories = d.categories.map(c => ({
        categoryNo: c.brandCategory,
        productService: c.producsecScope,
        approvedScope: c.producsecScope || '',
        acceptResult: isReadonly.value ? '1' : null,
      }))
    }
    // 商标图样预览
    if (d.brandPicUrl) {
      if (/^https?:\/\//.test(d.brandPicUrl)) {
        // 后端已解析为图片URL：直接展示，不回传fileId
        originalBrandImg.value = d.brandPicUrl
        confirmBrandImg.value = d.brandPicUrl
        form.value.brandPicUrl = null
      } else {
        getImageUrl(d.brandPicUrl).then(r => {
          if (r && r.data) {
            originalBrandImg.value = r.data
            confirmBrandImg.value = r.data
          }
        }).catch(() => {})
      }
    }
  } catch (e) { console.error(e) }
}

function addCategory(i) {
  form.value.categories.splice(i + 1, 0, { categoryNo: '', productService: '', approvedScope: '', acceptResult: null })
}
function removeCategory(i) {
  if (form.value.categories.length > 1) form.value.categories.splice(i, 1)
}

function handleBrandChange(file) {
  pendingFiles.value.brandPicUrl = file.raw
  form.value.brandPicUrl = null
  if (file.raw) confirmBrandImg.value = URL.createObjectURL(file.raw)
}

function handleFilePick(file, field) {
  pendingFiles.value[field] = file.raw
  form.value[field] = null
}

async function uploadPendingFiles() {
  const fields = ['brandPicUrl', 'agensecOpinionUrl', 'attachment']
  for (const field of fields) {
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
    firstValidityStartDate: form.value.firstValidityStartDate || null,
    registrationDate: form.value.registrationDate || null,
    validityStartDate: regPeriodRange.value[0] || null,
    validityEndDate: regPeriodRange.value[1] || null,
    countryRegionId: form.value.countryRegionId,
    registerPerson: form.value.registerPerson,
    registerAddress: form.value.registerAddress,
    registerNumber: form.value.registerNumber,
    brandPicUrl: form.value.brandPicUrl,
    seriesId: form.value.seriesId,
    agensecOpinion: form.value.agensecOpinion,
    agensecOpinionUrl: form.value.agensecOpinionUrl,
    attachment: form.value.attachment,
    remark: form.value.remark,
    // 只提交受理的类别，类别内容取核定使用商品/服务项目
    categories: form.value.categories
      .filter(c => c.acceptResult !== '0')
      .map(c => ({
        categoryNo: c.categoryNo,
        productService: c.approvedScope || c.productService,
      })),
  }
}

async function handleSave() {
  try {
    await uploadPendingFiles()
    await registerSaveConfirm(buildParam())
    ElMessage.success('保存成功')
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '保存失败')
  }
}

async function handleSaveAndSubmit() {
  try {
    await uploadPendingFiles()
    await registerSubmitConfirm(buildParam())
    ElMessage.success('保存并提交成功')
    router.back()
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '提交失败')
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

    .group-head td {
      background: #D6E8FB;
      text-align: center;
      font-weight: 600;
    }
  }

  .brand-thumb {
    width: 60px;
    height: 32px;
    object-fit: contain;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    vertical-align: middle;
  }
  .brand-confirm-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .category-table {
    margin-top: 16px;
    table-layout: fixed;
    .cat-no { width: 10%; }
    .cat-scope { width: 30%; text-align: left; }
    .cat-result { width: 16%; }
    .cat-approved { width: 34%; }
    .cat-ops { width: 10%; text-align: center; }
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
