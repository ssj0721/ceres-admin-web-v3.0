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
            <div class="form-input"><el-input value="商标驳回复审申请" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" placeholder="保存后自动生成" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标注册编号：</label>
            <div class="form-input"><el-input :value="docNo" disabled class="input-disabled" placeholder="由所选商标带出" /></div>
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
          <div class="form-row">
            <label class="form-label">所属国家/地区：</label>
            <div class="form-input"><el-input :value="countryRegionName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标状态：</label>
            <div class="form-input"><el-input :value="statusLabel" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请/注册号：</label>
            <div class="form-input"><el-input :value="docNo" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请/注册人：</label>
            <div class="form-input"><el-input :value="personLabel" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请号：</label>
            <div class="form-input"><el-input v-model="form.trademarkApplyNoInput" placeholder="请输入" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请日期：</label>
            <div class="form-input"><el-date-picker v-model="form.trademarkApplyDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%" /></div>
          </div>
        </div>

        <!-- 类别子表（含驳回字段） -->
        <div v-show="!collapsed.brand" class="categoryTable">
          <el-table :data="form.categories" :header-cell-style="changeHeaderStyle" :cell-style="{ height: '50px' }">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="类别编号" width="120" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.categoryNo" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="商品/服务项目" min-width="200">
              <template #default="scope">
                <el-input v-model="scope.row.productService" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="驳回商品/服务项目" min-width="200">
              <template #default="scope">
                <el-input v-model="scope.row.rejectedProductService" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="驳回理由" min-width="150">
              <template #default="scope">
                <el-input v-model="scope.row.rejectionReason" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="申请复审理由" min-width="150">
              <template #default="scope">
                <el-input v-model="scope.row.reviewReason" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="驳回期限" width="220">
              <template #default="scope">
                <el-date-picker :model-value="deadlineValue(scope.row)" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%" @update:model-value="(v) => onDeadlineChange(scope.row, v)" />
              </template>
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
            <label class="form-label">商标局批件：</label>
            <div class="form-input">
              <el-input v-model="form.approvalOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'approvalOpinionAttachment')" :on-remove="() => handleOpinionRemove('approvalOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.approvalOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <a v-if="form.approvalOpinionAttachment && fileUrlMap['approvalOpinionAttachment']" :href="fileUrlMap['approvalOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['approvalOpinionAttachment'].name || '查看文件' }}</a>
                <span v-else-if="form.approvalOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
          <div class="form-row-full">
            <label class="form-label">代理人意见：</label>
            <div class="form-input">
              <el-input v-model="form.agentOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'agentOpinionAttachment')" :on-remove="() => handleOpinionRemove('agentOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.agentOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <a v-if="form.agentOpinionAttachment && fileUrlMap['agentOpinionAttachment']" :href="fileUrlMap['agentOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['agentOpinionAttachment'].name || '查看文件' }}</a>
                <span v-else-if="form.agentOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
          <div class="form-row-full">
            <label class="form-label">秘书处意见：</label>
            <div class="form-input">
              <el-input v-model="form.secretaryOpinion" type="textarea" :rows="3" placeholder="请输入" />
              <div class="opinion-upload">
                <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'secretaryOpinionAttachment')" :on-remove="() => handleOpinionRemove('secretaryOpinionAttachment')">
                  <el-button class="btn-upload" plain size="small">{{ form.secretaryOpinionAttachment ? '重新上传' : '上传附件' }}</el-button>
                </el-upload>
                <a v-if="form.secretaryOpinionAttachment && fileUrlMap['secretaryOpinionAttachment']" :href="fileUrlMap['secretaryOpinionAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['secretaryOpinionAttachment'].name || '查看文件' }}</a>
                <span v-else-if="form.secretaryOpinionAttachment" class="upload-status">已上传</span>
              </div>
            </div>
          </div>
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
              <el-upload v-if="canSave" :auto-upload="false" :limit="1" :on-change="(file) => handleOpinionUpload(file, 'attachment')" :on-remove="() => handleOpinionRemove('attachment')">
                <el-button class="btn-upload" plain>{{ form.attachment ? '重新上传' : '上传文件' }}</el-button>
              </el-upload>
              <template v-for="(att, idx) in attachmentList" :key="idx">
                <a v-if="att.url" :href="att.url" target="_blank" class="file-link" @click.stop>{{ att.fileName || '查看文件' }}</a>
              </template>
              <span v-if="form.attachment && !attachmentList.length" class="upload-status">已上传</span>
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
import { rejectionReviewAdd, rejectionReviewUpdate, rejectionReviewSubmit, rejectionReviewGetDetail, rejectionReviewGetBrandInfo } from '@/api/trademark/ap/rejectionReview'
import { scopeOptions, brandStatusOptions } from '../config'
import { agentGetList } from '@/api/trademark/bd/agent'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { onMounted, ref, computed, reactive } from 'vue'
import { DArrowRight, Plus, Minus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserName } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const isEdit = ref(false)
const basicStatus = ref(null)
const canSave = computed(() => !isEdit.value || basicStatus.value === 0)
const editBasicId = ref(null)
const editRejectionId = ref(null)
const saving = ref(false)
const collapsed = ref({ basic: false, brand: false, agent: false, opinion: false, attachment: false })
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const brand = ref(null)
const countryRegionName = ref('')
const categories = ref([])
const pendingFiles = ref({
  approvalOpinionAttachment: null,
  agentOpinionAttachment: null,
  secretaryOpinionAttachment: null,
  managementOpinionAttachment: null,
  attachment: null
})
const fileUrlMap = reactive({})
const attachmentList = ref([])

const changeHeaderStyle = { background: '#fafafa', textAlign: 'center', color: '#333333', fontWeight: '600' }

function getToday() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const docNo = computed(() => {
  if (!brand.value) return ''
  return brand.value.applyStatus === 1 ? (brand.value.brandNo || '') : (brand.value.applyNo || '')
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

const form = ref({
  applyNumber: '',
  applyDate: getToday(),
  applyPerson: getUserName() || '',
  applyDepartment: '',
  applyScope: null,
  remarks: '',
  trademarkApplyNoInput: '',
  trademarkApplyDate: '',
  categories: [],
  agentFee: { agentId: null, address: '', outsideFee: null, domesticFee: null, agentFee: null, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  approvalOpinion: '',
  approvalOpinionAttachment: null,
  agentOpinion: '',
  agentOpinionAttachment: null,
  secretaryOpinion: '',
  secretaryOpinionAttachment: null,
  managementOpinion: '',
  managementOpinionAttachment: null,
  attachment: null,
  remark: '',
})

const formRules = {}
const options = ref({ agent: [] })

onMounted(() => {
  loadOptions()
  if (route.query.id) {
    isEdit.value = true
    editBasicId.value = Number(route.query.id)
    loadEditData(editBasicId.value)
  } else if (route.query.brandId) {
    loadBrandInfo(Number(route.query.brandId))
  }
})

async function loadOptions() {
  try {
    const a = await agentGetList({ page: 1, pageSize: 1000 })
    options.value = { agent: (a.data && a.data.list) || [] }
  } catch (e) { console.error(e) }
}

async function loadBrandInfo(brandId) {
  try {
    const res = await rejectionReviewGetBrandInfo(brandId)
    const vo = res.data
    if (!vo) return
    applyBrandVo(vo)
    // 自动填入商标申请号/申请日期（取申请号而非注册号）
    if (vo.rejection) {
      if (vo.rejection.trademarkApplyNo) form.value.trademarkApplyNoInput = vo.rejection.trademarkApplyNo
      else if (vo.brand && vo.brand.applyNo) form.value.trademarkApplyNoInput = vo.brand.applyNo
      if (vo.rejection.trademarkApplyDate) form.value.trademarkApplyDate = vo.rejection.trademarkApplyDate
    } else if (vo.brand && vo.brand.applyNo) {
      form.value.trademarkApplyNoInput = vo.brand.applyNo
    }
    // 初始化类别子表
    if (vo.categories && vo.categories.length) {
      form.value.categories = vo.categories.map(c => ({
        categoryNo: c.brandCategory,
        productService: c.producsecScope || '',
        rejectedProductService: c.producsecScope || '',
        rejectionReason: '',
        reviewReason: '',
        rejectionDeadlineStart: '',
        rejectionDeadlineEnd: '',
      }))
    }
  } catch (e) {
    console.error('加载商标信息失败:', e)
  }
}

async function loadEditData(basicId) {
  try {
    const res = await rejectionReviewGetDetail(basicId)
    const vo = res.data
    if (!vo) return
    editRejectionId.value = vo.rejectionId
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
    if (vo.rejection) {
      form.value.trademarkApplyNoInput = vo.rejection.trademarkApplyNo || ''
      form.value.trademarkApplyDate = vo.rejection.trademarkApplyDate || ''
      form.value.approvalOpinion = vo.rejection.approvalOpinion || ''
      form.value.approvalOpinionAttachment = vo.rejection.approvalOpinionAttachment
      resolveFileUrl('approvalOpinionAttachment', vo.rejection.approvalOpinionAttachment)
      form.value.agentOpinion = vo.rejection.agentOpinion || ''
      form.value.agentOpinionAttachment = vo.rejection.agentOpinionAttachment
      resolveFileUrl('agentOpinionAttachment', vo.rejection.agentOpinionAttachment)
      form.value.secretaryOpinion = vo.rejection.secretaryOpinion || ''
      form.value.secretaryOpinionAttachment = vo.rejection.secretaryOpinionAttachment
      resolveFileUrl('secretaryOpinionAttachment', vo.rejection.secretaryOpinionAttachment)
      form.value.managementOpinion = vo.rejection.managementOpinion || ''
      form.value.managementOpinionAttachment = vo.rejection.managementOpinionAttachment
      resolveFileUrl('managementOpinionAttachment', vo.rejection.managementOpinionAttachment)
      form.value.attachment = vo.rejection.attachment
      if (vo.rejection.attachmentList && vo.rejection.attachmentList.length) {
        attachmentList.value = vo.rejection.attachmentList
      } else if (vo.rejection.attachment) {
        const n = String(vo.rejection.attachment).includes('/') ? String(vo.rejection.attachment).split('/').pop() : ''
        getImageUrl(vo.rejection.attachment).then(r => { if (r && r.data) attachmentList.value = [{ fileName: n || '查看文件', url: r.data, fileId: vo.rejection.attachment }] }).catch(() => {})
      }
      if (vo.rejection.categories && vo.rejection.categories.length) {
        form.value.categories = vo.rejection.categories.map(c => ({
          categoryNo: c.categoryNo,
          productService: c.productService || '',
          rejectedProductService: c.rejectedProductService || '',
          rejectionReason: c.rejectionReason || '',
          reviewReason: c.reviewReason || '',
          rejectionDeadlineStart: c.rejectionDeadlineStart || '',
          rejectionDeadlineEnd: c.rejectionDeadlineEnd || '',
        }))
      }
    }
  } catch (e) {
    console.error('加载编辑数据失败:', e)
  }
}

function applyBrandVo(vo) {
  brand.value = vo.brand || null
  countryRegionName.value = vo.countryRegionName || ''
  categories.value = vo.categories || []
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
  for (const field of ['approvalOpinionAttachment', 'agentOpinionAttachment', 'secretaryOpinionAttachment', 'managementOpinionAttachment', 'attachment']) {
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

function deadlineValue(row) {
  return row.rejectionDeadlineStart && row.rejectionDeadlineEnd ? [row.rejectionDeadlineStart, row.rejectionDeadlineEnd] : []
}
function onDeadlineChange(row, val) {
  row.rejectionDeadlineStart = val && val[0] ? val[0] : ''
  row.rejectionDeadlineEnd = val && val[1] ? val[1] : ''
}

function addCategory(index) {
  const row = {
    categoryNo: null,
    productService: '',
    rejectedProductService: '',
    rejectionReason: '',
    reviewReason: '',
    rejectionDeadlineStart: '',
    rejectionDeadlineEnd: '',
  }
  if (index !== undefined && index >= 0 && index <= form.value.categories.length) {
    form.value.categories.splice(index, 0, row)
  } else {
    form.value.categories.push(row)
  }
}

function removeCategory(index) {
  if (form.value.categories.length <= 1) return
  form.value.categories.splice(index, 1)
}

function buildParam() {
  return {
    id: isEdit.value ? editRejectionId.value : undefined,
    brandId: (brand.value && brand.value.id) || Number(route.query.brandId),
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
    trademarkApplyNoInput: form.value.trademarkApplyNoInput,
    trademarkApplyDate: form.value.trademarkApplyDate,
    categories: form.value.categories,
    approvalOpinion: form.value.approvalOpinion,
    approvalOpinionAttachment: form.value.approvalOpinionAttachment,
    agentOpinion: form.value.agentOpinion,
    agentOpinionAttachment: form.value.agentOpinionAttachment,
    secretaryOpinion: form.value.secretaryOpinion,
    secretaryOpinionAttachment: form.value.secretaryOpinionAttachment,
    managementOpinion: form.value.managementOpinion,
    managementOpinionAttachment: form.value.managementOpinionAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

async function doSave() {
  if (saving.value) return false
  saving.value = true
  try {
    try {
      await formRef.value.validate()
    } catch (e) {
      ElMessage.error('请完善表单')
      return false
    }
    await uploadPendingFiles()
    const param = buildParam()
    if (isEdit.value) {
      await rejectionReviewUpdate(param)
    } else {
      const res = await rejectionReviewAdd(param)
      const data = res && res.data
      const newId = data && typeof data === 'object' ? data.id : data
      if (newId) {
        editBasicId.value = newId
        editRejectionId.value = newId
        isEdit.value = true
        basicStatus.value = 0
      }
      const newApplyNo = data && typeof data === 'object' ? data.applyNo : ''
      form.value.applyNumber = String(newApplyNo || param.apBasicParam.applyNumber || '')
      if (newId && Number(route.query.id) !== Number(newId)) {
        router.replace({ query: { ...route.query, id: newId } })
      }
    }
    ElMessage.success('保存成功')
    return true
  } catch (e) {
    console.error(e)
    return false
  } finally {
    saving.value = false
  }
}

function handleSave() { doSave() }

async function handleSaveAndSubmit() {
  if (saving.value) return
  const ok = await doSave()
  if (!ok) return
  saving.value = true
  try {
    await rejectionReviewSubmit(editBasicId.value)
    ElMessage.success('提交成功')
    router.back()
  } catch (e) {
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

  .btn-circle {
    border-radius: 100%;
    padding: 5px;
  }

  .category-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  :deep(.input-disabled .el-input__inner) {
    background-color: #F5F5F5;
    color: #999999;
    border-color: #D9D9D9;
  }
}
</style>
