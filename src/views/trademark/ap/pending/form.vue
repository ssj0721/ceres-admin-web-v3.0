<template>
  <div class="form-page">
    <div class="page-top">
      <h1 class="page-title">{{ isEdit ? "编辑申请" : "编制申请" }}</h1>

      <div class="topBtn">
        <el-button class="btn-submit" @click="handleSave">保存</el-button>
        <el-button class="btn-cancel" @click="handleSaveAndSubmit">保存并提交</el-button>
        <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="formRules" class="mainForm">
      <!-- 基本信息 -->
      <div class="section">
        <div class="section-header" @click="toggle('basic')">
          <span class="section-title"><span class="section-bar"></span>基本信息</span>
          <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
        </div>
        <div v-show="!collapsed.basic" class="form-grid">
           <div class="form-row">
            <label class="form-label">申请类型：</label>
            <div class="form-input"><el-input :value="typeMap[form.type] || '-'" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">单据申请人：</label>
            <div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请日期：</label>
            <div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 境内/境外：</label>
            <div class="form-input">
              <el-select v-model="form.applyScope" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 申请部门：</label>
            <div class="form-input"><el-input v-model="form.applyDepartment" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 注册商标业务：</label>
            <div class="form-input">
              <el-select v-model="form.registerType" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in registerTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-select v-model="form.countryRegionId" placeholder="全部" filterable style="width: 100%">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标申请人：</label>
            <div class="form-input"><el-input v-model="form.applyPerson" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标：</label>
            <div class="form-input">
              <div class="brand-preview-wrap">
                <img v-if="brandImageUrl" :src="brandImageUrl" class="brand-preview-img" />
                <el-upload class="brand-uploader" :auto-upload="false" :limit="1" accept=".jpg,.jpeg" :on-change="handleBrandChange">
                  <el-button class="btn-upload" plain>{{ brandImageUrl ? '重新上传' : '上传图片' }}</el-button>
                  <template #tip><div class="upload-tip">注：图片限制JPG格式、像素246*43、英文文件名</div></template>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标申请人地址：</label>
            <div class="form-input"><el-input v-model="form.applyAddress" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标系列：</label>
            <div class="form-input">
              <el-select v-model="form.seriesId" placeholder="请输入" filterable style="width: 100%">
                <el-option v-for="item in options.brandSeries" :key="item.id" :label="item.seriesName" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">类别数量：</label>
            <div class="form-input"><el-input :value="form.categories.length" disabled class="input-disabled" /></div>
          </div>
        </div>

        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="categoryHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="150" align="center" />
            <el-table-column label="类别编号" min-width="50">
              <template #default="scope"><el-input v-model="scope.row.categoryNo" placeholder="请输入" /></template>
            </el-table-column>
            <el-table-column label="商品/服务项目" min-width="400">
              <template #default="scope"><el-input v-model="scope.row.productService" placeholder="请输入" /></template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template #default="scope">
                <div class="category-actions">
                  <el-button class="btn-circle" @click="addCategory(scope.$index)">
                    <el-icon><Plus /></el-icon>
                  </el-button>
                  <el-button class="btn-circle" @click="removeCategory(scope.$index)" :disabled="form.categories.length <= 1">
                    <el-icon><Minus /></el-icon>
                  </el-button>
                </div>
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
            <label class="form-label">代理人意见：</label>
            <div class="form-input">
              <el-input v-model="form.agensecOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'agensecOpinionUrl')" :on-remove="() => handleOpinionRemove('agensecOpinionUrl')">
                  <el-button class="btn-upload" plain size="small">{{ form.agensecOpinionUrl ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <span v-if="form.agensecOpinionUrl" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
          <div class="form-row-full">
            <label class="form-label">秘书处意见：</label>
            <div class="form-input">
              <el-input v-model="form.secretaryOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'secretaryOpinionAttachment')" :on-remove="() => handleOpinionRemove('secretaryOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.secretaryOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <span v-if="form.secretaryOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
          <div class="form-row-full">
            <label class="form-label">旭日内部法律意见：</label>
            <div class="form-input">
              <el-input v-model="form.legalOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'legalOpinionAttachment')" :on-remove="() => handleOpinionRemove('legalOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.legalOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <span v-if="form.legalOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
          <div class="form-row-full">
            <label class="form-label">旭日内部业务意见：</label>
            <div class="form-input">
              <el-input v-model="form.businessOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'businessOpinionAttachment')" :on-remove="() => handleOpinionRemove('businessOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.businessOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <span v-if="form.businessOpinionAttachment" class="upload-status">已上传</span>
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
              <el-upload :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'attachment')" :on-remove="() => handleOpinionRemove('attachment')">
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
import { registerAdd, registerUpdate, registerSubmit, registerGetDetail } from '@/api/trademark/ap/register'
import { typeMap, scopeOptions, registerTypeOptions } from '../config'
import { agentGetList } from '@/api/trademark/bd/agent'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { brandSeriesGetList } from '@/api/trademark/bd/brandSeries'
import { uploadFileApi, deletefile, getImageUrl } from '@/api/file'
import { onMounted, ref } from 'vue'
import { Plus, Minus, DArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserName } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const isEdit = ref(false)
const editId = ref(null)
// 各区块折叠状态（点击蓝色标题展开/收起）
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }
// 待上传文件（保存时统一上传）
const brandImageUrl = ref('')
const pendingFiles = ref({
  brandUrl: null,
  agensecOpinionUrl: null,
  secretaryOpinionAttachment: null,
  legalOpinionAttachment: null,
  businessOpinionAttachment: null,
  attachment: null
})

const categoryHeaderStyle = {
  background: '#fafafa',
  textAlign: 'center',
  color: '#333333',
  fontWeight: '600'
}

// 获取当前日期 YYYY-MM-DD
function getToday() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

const form = ref({
  type: Number(route.query.type ?? 0),
  applyNumber: '',
  applyDate: getToday(),
  applyPerson: getUserName() || '',
  applyDepartment: '',
  applyScope: null,
  registerType: null,
  remarks: '',
  countryRegionId: null,
  applyAddress: '',
  brandUrl: '',
  seriesId: null,
  agentFee: { agentId: null, address: '', outsideFee: null, domesticFee: null, agentFee: null, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  agensecOpinion: '', agensecOpinionUrl: null, secretaryOpinion: '', secretaryOpinionAttachment: null, legalOpinion: '', legalOpinionAttachment: null, businessOpinion: '', businessOpinionAttachment: null, remark: '',
  categories: [{ categoryNo: null, productService: '' }],
})

const formRules = {}
const options = ref({ agent: [], countryRegion: [], brandSeries: [] })

onMounted(() => {
  loadOptions()
  // 检查是否为编辑模式
  if (route.query.id) {
    isEdit.value = true
    editId.value = Number(route.query.id)
    loadEditData()
  }
})

async function loadOptions() {
  try {
    const [a, r, s] = await Promise.all([agentGetList({page:1,pageSize:1000}), countryRegionGetList({page:1,pageSize:1000}), brandSeriesGetList({page:1,pageSize:1000})])
    options.value = { agent: a.data.list||[], countryRegion: r.data.list||[], brandSeries: s.data.list||[] }
  } catch (e) { console.error(e) }
}

async function loadEditData() {
  try {
    const res = await registerGetDetail(editId.value)
    const data = res.data
    if (!data) return
    // 填充基本信息
    if (data.basic) {
      form.value.applyNumber = data.basic.applyNumber || ''
      form.value.applyDate = data.basic.applyDate || getToday()
      form.value.applyPerson = data.basic.applyPerson || ''
      form.value.applyDepartment = data.basic.applyDepartment || ''
      form.value.applyScope = data.basic.applyScope
      form.value.remarks = data.basic.remarks || ''
    }
    // 填充商标信息
    form.value.registerType = data.registerType
    form.value.countryRegionId = data.countryRegionId
    form.value.applyAddress = data.applyAddress || ''
    form.value.brandUrl = data.brandPicUrl || ''
    // 加载已有商标图片预览
    if (data.brandPicUrl) {
      if (/^https?:\/\//.test(data.brandPicUrl)) {
        // 后端已解析为图片URL：直接展示，不回传fileId
        brandImageUrl.value = data.brandPicUrl
        form.value.brandUrl = null
      } else {
        getImageUrl(data.brandPicUrl).then(res => {
          if (res && res.data) {
            brandImageUrl.value = res.data
          }
        }).catch(() => {})
      }
    }
    form.value.seriesId = data.seriesId
    // 填充代理人费用
    if (data.agentFee) {
      form.value.agentFee = {
        agentId: data.agentFee.agentId,
        address: data.agentFee.address || '',
        outsideFee: data.agentFee.outsideFee,
        domesticFee: data.agentFee.domesticFee,
        agentFee: data.agentFee.agentFee,
        accountName: data.agentFee.accountName || '',
        bankName: data.agentFee.bankName || '',
        bankNumber: data.agentFee.bankNumber || '',
        payCompany: data.agentFee.payCompany || ''
      }
    }
    // 填充意见信息
    form.value.agensecOpinion = data.agensecOpinion || ''
    form.value.agensecOpinionUrl = data.agensecOpinionUrl
    form.value.secretaryOpinion = data.secretaryOpinion || ''
    form.value.secretaryOpinionAttachment = data.secretaryOpinionAttachment
    form.value.legalOpinion = data.legalOpinion || ''
    form.value.legalOpinionAttachment = data.legalOpinionAttachment
    form.value.businessOpinion = data.businessOpinion || ''
    form.value.businessOpinionAttachment = data.businessOpinionAttachment
    form.value.attachment = data.attachment
    form.value.remark = data.remark || ''
    // 填充类别
    if (data.categories && data.categories.length > 0) {
      form.value.categories = data.categories.map(c => ({
        categoryNo: c.brandCategory,
        productService: c.producsecScope
      }))
    }
  } catch (e) {
    console.error('加载编辑数据失败:', e)
    ElMessage.error('加载数据失败')
  }
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

function addCategory(i) { form.value.categories.splice(i+1, 0, {categoryNo:null, productService:''}) }
function removeCategory(i) { if(form.value.categories.length>1) form.value.categories.splice(i,1) }
function handleBrandChange(file) {
  // console.log('handleBrandChange - file:', file)
  // console.log('handleBrandChange - file.raw:', file.raw)
  pendingFiles.value.brandUrl = file.raw
  form.value.brandUrl = null
  // console.log('pendingFiles.value.brandUrl:', pendingFiles.value.brandUrl)
}
// 附件与意见附件均为单文件，复用 handleOpinionUpload / handleOpinionRemove

// 意见附件选择（暂存，保存时统一上传）
function handleOpinionUpload(file, field) {
  // 暂存文件对象，覆盖之前的待上传文件
  pendingFiles.value[field] = file.raw
  // 清除已上传的文件ID（因为将被新文件覆盖）
  form.value[field] = null
}

// 意见附件移除（清除待上传文件）
function handleOpinionRemove(field) {
  pendingFiles.value[field] = null
  form.value[field] = null
}

// 统一上传待上传文件
async function uploadPendingFiles() {
  const fields = ['brandUrl', 'agensecOpinionUrl', 'secretaryOpinionAttachment', 'legalOpinionAttachment', 'businessOpinionAttachment', 'attachment']
  for (const field of fields) {
    const file = pendingFiles.value[field]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('fileList', file)
        const res = await uploadFileApi(formData)
        const fileId = res.data && res.data.fileId
        if (fileId) {
          form.value[field] = fileId
        }
      } catch (e) {
        console.error(field + ' 上传失败:', e)
        throw new Error(field + ' 上传失败')
      }
    }
  }
}

function buildParam() {
  return {
    id: isEdit.value ? editId.value : undefined,
    apBasicParam: { applyNumber:form.value.applyNumber || (Date.now()), applyDate:form.value.applyDate, applyScope:form.value.applyScope, applyPerson:form.value.applyPerson, applyDepartment:form.value.applyDepartment, remarks:form.value.remarks },
    seriesId:form.value.seriesId, registerType:form.value.registerType, countryRegionId:form.value.countryRegionId,
    applyPerson:form.value.applyPerson, applyAddress:form.value.applyAddress, brandUrl:form.value.brandUrl,
    apAgentFeeParam: { agentId:form.value.agentFee.agentId, address:form.value.agentFee.address, outsideFee:form.value.agentFee.outsideFee, domesticFee:form.value.agentFee.domesticFee, agentFee:form.value.agentFee.agentFee, accountName:form.value.agentFee.accountName, bankName:form.value.agentFee.bankName, bankNumber:form.value.agentFee.bankNumber, payCompany:form.value.agentFee.payCompany },
    agensecOpinion:form.value.agensecOpinion, agensecOpinionUrl:form.value.agensecOpinionUrl, secretaryOpinion:form.value.secretaryOpinion, secretaryOpinionAttachment:form.value.secretaryOpinionAttachment, legalOpinion:form.value.legalOpinion, legalOpinionAttachment:form.value.legalOpinionAttachment, businessOpinion:form.value.businessOpinion, businessOpinionAttachment:form.value.businessOpinionAttachment,
    attachment:form.value.attachment, remark:form.value.remark,
    categories: form.value.categories.map(c=>({categoryNo:c.categoryNo, productService:c.productService})),
  }
}

async function doSave() {
  try {
    // 先验证表单
    await formRef.value.validate()
    // 上传待上传文件
    await uploadPendingFiles()
    // 保存表单
    const param = buildParam()
    console.log("Yes")
    console.log(param)
    if (isEdit.value) {
      await registerUpdate(param)
    } else {
      await registerAdd(param)
    }
    ElMessage.success('保存成功')
    return true
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) {
      ElMessage.error('请完善表单')
    }
    return false
  }
}

function handleSave(){doSave()}

async function handleSaveAndSubmit(){
  try{
    // 先验证表单
    await formRef.value.validate()
    // 上传待上传文件
    await uploadPendingFiles()
    let registerId = editId.value
    if (isEdit.value) {
      // 已保存过：只调用提交，不调用保存
    } else {
      // 新建：先保存再提交
      const param = buildParam()
      const res = await registerAdd(param)
      if(res && res.data && res.data.id) registerId = res.data.id
    }
    if (registerId) await registerSubmit(registerId)
    ElMessage.success('提交成功')
    router.back()
  }catch(e){
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) {
      ElMessage.error('请完善表单')
    }
  }
}

function handleCancel(){router.back()}
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  margin: 0 80px;
  // max-width: 960px;
  // margin: 0 auto;

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
    // justify-content: flex-end;
    // gap: 6px;
    margin-bottom: 24px;

    .btn-cancel {
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
    }
    .btn-save {
      background: #FFFFFF;
      border: 1px solid #1890FF;
      border-radius: 6px;
      color: #1890FF;
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
      // width:500px;
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

    :deep(.el-table) {
      border: none;
    }

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

    :deep(.el-table::before) {
      display: none;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
  }

  .btn-upload {
    border-radius: 6px;
    font-size: 14px;
    padding: 15px 15px;
    font-weight: 500 !important;
  }
  .brand-preview-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-preview-img {
    width: 120px;
    height: auto;
    max-height: 60px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    object-fit: contain;
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

.btn-circle {
  border-radius: 100%;
  padding: 5px;
}
</style>
