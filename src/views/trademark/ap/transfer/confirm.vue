<template>
  <div class="form-page">
    <div class="page-head">
      <h1 class="page-title">编制确认表</h1>
      <div class="topBtn">
        <el-button v-if="!isReadonly" type="primary" :loading="saving" @click="handleSave">保存</el-button>
        <el-button v-if="!isReadonly" :loading="saving" @click="handleSaveAndSubmit">保存并提交</el-button>
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

    <!-- 商标信息：申请信息 | 确认信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('brand')">
        <span class="section-title"><span class="section-bar"></span>商标信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.brand }"><DArrowRight /></el-icon>
      </div>
      <table v-show="!collapsed.brand" class="info-table four-col">
        <colgroup>
          <col style="width: 16%" /><col style="width: 34%" /><col style="width: 16%" /><col style="width: 34%" />
        </colgroup>
        <thead>
          <tr>
            <th class="info-label" colspan="2">申请信息</th>
            <th class="info-label req-label" colspan="2">确认信息</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="info-label">境内/境外</td><td class="info-value">{{ scopeLabel }}</td><td class="info-label">/</td><td class="info-value">/</td></tr>
          <tr><td class="info-label">转让类型</td><td class="info-value">{{ transferTypeLabel }}</td><td class="info-label">/</td><td class="info-value">/</td></tr>
          <tr><td class="info-label">商标</td><td class="info-value"><img v-if="applyBrandImageUrl" :src="applyBrandImageUrl" class="brand-preview-img" /><span v-else>-</span></td><td class="info-label req-label">申请/注册商标</td><td class="info-value"><el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" accept=".jpg,.jpeg" :show-file-list="false" :on-change="handleConfirmPicChange"><el-button class="btn-upload" plain>上传图片</el-button></el-upload><img v-if="confirmBrandImageUrl" :src="confirmBrandImageUrl" class="brand-preview-img" /></td></tr>
          <tr><td class="info-label">/</td><td class="info-value"></td><td class="info-label req-label">商标系列</td><td class="info-value"><el-select v-model="form.trademarkSeries" placeholder="请选择" filterable :disabled="isReadonly" style="width: 100%"><el-option v-for="item in options.brandSeries" :key="item.id" :label="item.seriesName" :value="item.seriesName" /></el-select></td></tr>
          <tr><td class="info-label">/</td><td class="info-value"></td><td class="info-label req-label">商标注册日期</td><td class="info-value"><el-date-picker v-model="form.trademarkRegisterDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" :disabled="isReadonly" style="width: 100%" /></td></tr>
          <tr><td class="info-label">所属地区/国家</td><td class="info-value">{{ applyInfo.applyCountryRegion || '-' }}</td><td class="info-label req-label">商标所属国家/地区</td><td class="info-value"><el-select v-model="form.countryRegionId" placeholder="请选择" filterable :disabled="isReadonly" style="width: 100%"><el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" /></el-select></td></tr>
          <tr><td class="info-label">出让人名称</td><td class="info-value">{{ applyInfo.transferorName || '-' }}</td><td class="info-label req-label">商标申请人/出让人</td><td class="info-value"><el-input v-model="form.confirmTransferorName" placeholder="请输入" :disabled="isReadonly" /></td></tr>
          <tr><td class="info-label">出让人地址</td><td class="info-value">{{ applyInfo.transferorAddress || '-' }}</td><td class="info-label req-label">出让人注册地址</td><td class="info-value"><el-input v-model="form.transferorRegisterAddress" placeholder="请输入" :disabled="isReadonly" /></td></tr>
          <tr><td class="info-label">商标申请/注册号</td><td class="info-value link">{{ applyInfo.applyRegisterNo || '-' }}</td><td class="info-label req-label">商标申请/注册编号</td><td class="info-value"><el-input v-model="form.registerNumber" placeholder="请输入" :disabled="isReadonly" /></td></tr>
          <tr><td class="info-label">受让人名称</td><td class="info-value">{{ applyInfo.transfereeName || '-' }}</td><td class="info-label req-label">商标受让人</td><td class="info-value"><el-input v-model="form.confirmTransfereeName" placeholder="请输入" :disabled="isReadonly" /></td></tr>
          <tr><td class="info-label">受让人地址</td><td class="info-value">{{ applyInfo.transfereeAddress || '-' }}</td><td class="info-label req-label">受让人地址</td><td class="info-value"><el-input v-model="form.confirmTransfereeAddress" placeholder="请输入" :disabled="isReadonly" /></td></tr>
          <tr><td class="info-label">/</td><td class="info-value"></td><td class="info-label req-label">首次注册期限起始日</td><td class="info-value"><el-date-picker v-model="form.firstRegisterStartDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" :disabled="isReadonly" style="width: 100%" /></td></tr>
          <tr><td class="info-label">原商标专用权期限</td><td class="info-value">{{ originalValidityText }}</td><td class="info-label req-label">原商标专用权期限</td><td class="info-value"><el-date-picker v-model="originalValidityRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 100%" /></td></tr>
          <tr><td class="info-label">/</td><td class="info-value"></td><td class="info-label req-label">转让后商标专用权期限</td><td class="info-value"><el-date-picker v-model="transferValidityRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" :disabled="isReadonly" style="width: 100%" /></td></tr>
          <tr><td class="info-label">类别数量</td><td class="info-value">{{ applyInfo.applyClassCount ?? '-' }}</td><td class="info-label req-label">类别数量</td><td class="info-value"><el-input v-model="form.classCount" placeholder="请输入" type="number" :disabled="isReadonly" /></td></tr>
        </tbody>
      </table>

      <!-- 类别确认表：类别编号 | 申请转让 | 确认转让(受理结果+项目) | 操作 -->
      <div v-show="!collapsed.brand" class="categoryTable">
        <el-table :data="form.confirmClasses" :header-cell-style="confirmHeaderStyle" :cell-style="{ height: '50px' }">
          <el-table-column width="120" align="center"><template #header><span class="req-star">*</span> 类别编号</template>
            <template #default="scope"><el-input v-model="scope.row.classNo" placeholder="请输入" :disabled="isReadonly" /></template>
          </el-table-column>
          <el-table-column label="申请转让的商品/服务项目" min-width="300">
            <template #default="scope"><span>{{ scope.row.productService || '/' }}</span></template>
          </el-table-column>
          <el-table-column min-width="340"><template #header><span class="req-star">*</span> 确认转让的商品/服务项目</template>
            <template #default="scope">
              <div style="display: flex; gap: 8px">
                <el-select v-model="scope.row.acceptResult" placeholder="选择受理结果" :disabled="isReadonly" style="width: 140px">
                  <el-option v-for="item in acceptResultOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input v-model="scope.row.approvedGoods" placeholder="请输入" :disabled="isReadonly" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <div class="category-actions">
                <el-button class="btn-circle" :disabled="isReadonly" @click="addClass(scope.$index)"><el-icon><Plus /></el-icon></el-button>
                <el-button class="btn-circle" :disabled="isReadonly || form.confirmClasses.length <= 1" @click="removeClass(scope.$index)"><el-icon><Minus /></el-icon></el-button>
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
      <div v-show="!collapsed.opinion" class="block-body">
        <div class="block-row">
          <label class="block-label">商标注册证：</label>
          <div class="block-input">
            <el-input v-model="form.registerCertOpinion" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" />
            <div class="upload-line">
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'registerCertAttachment')">
                <el-button class="btn-upload" plain>上传附件</el-button>
              </el-upload>
              <a v-if="form.registerCertAttachment && !pendingFiles.registerCertAttachment && fileUrlMap['registerCertAttachment']" :href="fileUrlMap['registerCertAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['registerCertAttachment'].name || '查看文件' }}</a>
              <span v-else-if="form.registerCertAttachment && !pendingFiles.registerCertAttachment" class="uploaded-tip">已上传附件</span>
            </div>
          </div>
        </div>
        <div class="block-row">
          <label class="block-label">商标核/准转让证明：</label>
          <div class="block-input">
            <el-input v-model="form.transferApproveOpinion" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" />
            <div class="upload-line">
              <el-upload v-if="!isReadonly" :auto-upload="false" :limit="1" :show-file-list="false" :on-change="(f) => handleFilePick(f, 'transferApproveAttachment')">
                <el-button class="btn-upload" plain>上传附件</el-button>
              </el-upload>
              <a v-if="form.transferApproveAttachment && !pendingFiles.transferApproveAttachment && fileUrlMap['transferApproveAttachment']" :href="fileUrlMap['transferApproveAttachment'].url" target="_blank" class="file-link" @click.stop>{{ fileUrlMap['transferApproveAttachment'].name || '查看文件' }}</a>
              <span v-else-if="form.transferApproveAttachment && !pendingFiles.transferApproveAttachment" class="uploaded-tip">已上传附件</span>
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
        <div class="block-row">
          <label class="block-label">备注：</label>
          <div class="block-input"><el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" :disabled="isReadonly" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { transferSaveConfirm, transferSubmitConfirm, transferGetConfirmDetail } from '@/api/trademark/ap/transfer'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { brandSeriesGetList } from '@/api/trademark/bd/brandSeries'
import { uploadFileApi, getImageUrl } from '@/api/file'
import { onMounted, ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DArrowRight, Search, Plus, Minus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref({ basic: false, brand: false, opinion: false, attachment: false })
// 已确认状态下为只读展示
const isReadonly = ref(false)
// 保存/提交进行中标记，防止连点
const saving = ref(false)
function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

const typeName = '商标转让申请'
// 申请侧信息（只读展示，来自转让申请表）
const applyInfo = ref({})
// 申请侧/确认侧商标图样预览（URL）
const applyBrandImageUrl = ref('')
const confirmBrandImageUrl = ref('')

// 待上传文件（保存时统一上传）
const pendingFiles = ref({ confirmBrandPicUrl: null, registerCertAttachment: null, transferApproveAttachment: null, attachment: null })
const fileUrlMap = reactive({})
const attachmentList = ref([])
const options = ref({ countryRegion: [], brandSeries: [] })

const acceptResultOptions = [
  { value: 1, label: '通过' },
  { value: 2, label: '不通过' },
]

// 后端 null 的可空对象（LocalDate/Integer/Long）经全局序列化器会变成 {}，统一归一为 null
// 组件形态（{year,monthValue,dayOfMonth}）还原为 YYYY-MM-DD 字符串
function norm(v) {
  if (v && typeof v === 'object') {
    if (v.year != null && v.monthValue != null && v.dayOfMonth != null) {
      return v.year + '-' + String(v.monthValue).padStart(2, '0') + '-' + String(v.dayOfMonth).padStart(2, '0')
    }
    return null
  }
  return v === undefined ? null : v
}

const confirmHeaderStyle = { background: '#D6E8FB', textAlign: 'center', color: '#333333', fontWeight: '600' }

const scopeLabel = computed(() => (applyInfo.value.applyScope === 1 ? '境内' : applyInfo.value.applyScope === 2 ? '境外' : '-'))
const transferTypeLabel = computed(() => ({ 1: '转出', 2: '转入', 3: '内部转让' }[applyInfo.value.applyTransferType] || '-'))
const originalValidityText = computed(() => (applyInfo.value.applyValidityStartDate || applyInfo.value.applyValidityEndDate) ? (applyInfo.value.applyValidityStartDate + ' - ' + applyInfo.value.applyValidityEndDate) : '-')
const originalValidityRange = computed({
  get: () => (form.value.originalValidityStartDate || form.value.originalValidityEndDate) ? [form.value.originalValidityStartDate, form.value.originalValidityEndDate] : null,
  set: (v) => { form.value.originalValidityStartDate = v ? v[0] : ''; form.value.originalValidityEndDate = v ? v[1] : '' },
})
const transferValidityRange = computed({
  get: () => (form.value.transferValidityStartDate || form.value.transferValidityEndDate) ? [form.value.transferValidityStartDate, form.value.transferValidityEndDate] : null,
  set: (v) => { form.value.transferValidityStartDate = v ? v[0] : ''; form.value.transferValidityEndDate = v ? v[1] : '' },
})
function addClass(i) { form.value.confirmClasses.splice(i + 1, 0, { classNo: '', productService: '', acceptResult: null, approvedGoods: '' }) }
function removeClass(i) { if (form.value.confirmClasses.length > 1) form.value.confirmClasses.splice(i, 1) }

const form = ref({
  id: route.query.id || null,
  applyNumber: '', applyDate: '', applyPerson: '', applyDepartment: '', remarks: '',
  trademarkSeries: '', trademarkRegisterDate: '',
  countryRegionId: null,
  registerNumber: '',
  confirmTransferorName: '', transferorRegisterAddress: '',
  confirmTransfereeName: '', confirmTransfereeAddress: '',
  firstRegisterStartDate: '',
  originalValidityStartDate: '', originalValidityEndDate: '',
  transferValidityStartDate: '', transferValidityEndDate: '',
  classCount: null,
  brandPicUrl: null,
  confirmClasses: [],
  registerCertOpinion: '', registerCertAttachment: null,
  transferApproveOpinion: '', transferApproveAttachment: null,
  attachment: null, remark: '',
})

onMounted(async () => {
  await loadOptions()
  if (form.value.id) await loadDetail()
})

async function loadOptions() {
  try {
    const c = await countryRegionGetList({ page: 1, pageSize: 1000 })
    options.value.countryRegion = (c.data && c.data.list) || []
    try {
      const bs = await brandSeriesGetList({ page: 1, pageSize: 1000 })
      options.value.brandSeries = (bs.data && bs.data.list) || bs.data || []
    } catch (e) { console.error(e) }
  } catch (e) { console.error(e) }
}

async function loadDetail() {
  try {
    const res = await transferGetConfirmDetail(form.value.id)
    const d = res.data
    if (!d) return
    if (d.basic) {
      form.value.applyNumber = d.basic.applyNumber || ''
      form.value.applyDate = d.basic.applyDate || ''
      form.value.applyPerson = d.basic.applyPerson || ''
      form.value.applyDepartment = d.basic.applyDepartment || ''
      form.value.remarks = d.basic.remarks || ''
      // 已确认状态：只读展示
      isReadonly.value = d.basic.status === 3
    }
    if (d.transfer) {
      const info = d.transfer
      // 申请侧只读展示字段同步归一，避免 null→{} 显示 [object Object]
      applyInfo.value = Object.assign({}, info, {
        applyCountryRegion: info.applyCountryRegion || '',
        applyRegisterNo: info.applyRegisterNo || '',
        transferorName: info.transferorName || '',
        transferorAddress: info.transferorAddress || '',
        transfereeName: info.transfereeName || '',
        transfereeAddress: info.transfereeAddress || '',
        applyValidityStartDate: norm(info.applyValidityStartDate),
        applyValidityEndDate: norm(info.applyValidityEndDate),
        applyClassCount: norm(info.applyClassCount),
      })
      form.value.trademarkSeries = info.trademarkSeries || ''
      form.value.trademarkRegisterDate = norm(info.trademarkRegisterDate) || ''
      form.value.countryRegionId = norm(info.confirmCountryRegionId)
      form.value.registerNumber = info.registerNumber || ''
      form.value.confirmTransferorName = info.confirmTransferorName || ''
      form.value.transferorRegisterAddress = info.transferorRegisterAddress || ''
      form.value.confirmTransfereeName = info.confirmTransfereeName || ''
      form.value.confirmTransfereeAddress = info.confirmTransfereeAddress || ''
      form.value.firstRegisterStartDate = norm(info.firstRegisterStartDate) || ''
      form.value.originalValidityStartDate = norm(info.originalValidityStartDate) || ''
      form.value.originalValidityEndDate = norm(info.originalValidityEndDate) || ''
      form.value.transferValidityStartDate = norm(info.transferValidityStartDate) || ''
      form.value.transferValidityEndDate = norm(info.transferValidityEndDate) || ''
      form.value.classCount = norm(info.confirmClassCount) ?? norm(info.applyClassCount)
      form.value.registerCertOpinion = info.registerCertOpinion || ''
      form.value.registerCertAttachment = info.registerCertAttachment
      resolveFileUrl('registerCertAttachment', info.registerCertAttachment)
      form.value.transferApproveOpinion = info.transferApproveOpinion || ''
      form.value.transferApproveAttachment = info.transferApproveAttachment
      resolveFileUrl('transferApproveAttachment', info.transferApproveAttachment)
      form.value.attachment = info.attachment
      if (info.attachmentList && info.attachmentList.length) {
      attachmentList.value = info.attachmentList
    } else if (info.attachment) {
      const n = String(info.attachment).includes('/') ? String(info.attachment).split('/').pop() : ''
      getImageUrl(info.attachment).then(r => { if (r && r.data) attachmentList.value = [{ fileName: n || '查看文件', url: r.data, fileId: info.attachment }] }).catch(() => {})
    }
      form.value.remark = info.remark || ''
      // 确认侧图样：后端已解析为URL则直接展示；不回填表单值，重新上传时才回传新 fileId
      if (info.confirmBrandPicUrl) confirmBrandImageUrl.value = info.confirmBrandPicUrl
    }
    // 申请侧图样展示
    if (d.brandPicUrl) {
      if (/^https?:\/\//.test(d.brandPicUrl) || d.brandPicUrl.startsWith('/')) {
        applyBrandImageUrl.value = d.brandPicUrl
      } else {
        getImageUrl(d.brandPicUrl).then(res => {
          if (res && res.data) applyBrandImageUrl.value = res.data
        }).catch(() => {})
      }
    }
    // 确认侧为空时用申请侧值预填（前端兜底）
    if (!form.value.confirmTransferorName) form.value.confirmTransferorName = applyInfo.value.transferorName || ''
    if (!form.value.transferorRegisterAddress) form.value.transferorRegisterAddress = applyInfo.value.transferorAddress || ''
    if (!form.value.registerNumber) form.value.registerNumber = applyInfo.value.applyRegisterNo || ''
    if (form.value.countryRegionId == null && applyInfo.value.applyCountryRegion) {
      const hit = options.value.countryRegion.find(x => x.name === applyInfo.value.applyCountryRegion)
      if (hit) form.value.countryRegionId = hit.id
    }
    if (!confirmBrandImageUrl.value && applyBrandImageUrl.value) confirmBrandImageUrl.value = applyBrandImageUrl.value
    // 确认侧类别受理结果：优先确认快照，空则以申请侧类别初始化待确认行
    if (d.confirmClasses && d.confirmClasses.length) {
      form.value.confirmClasses = d.confirmClasses.map(c => ({
        classNo: norm(c.classNo) == null ? '' : String(norm(c.classNo)),
        productService: c.productService || '',
        acceptResult: norm(c.acceptResult),
        approvedGoods: c.approvedGoods || '',
      }))
    } else {
      form.value.confirmClasses = (d.categories || []).map(c => ({
        classNo: c.brandCategory == null ? '' : String(c.brandCategory),
        productService: c.producsecScope || '',
        acceptResult: null,
        approvedGoods: '',
      }))
    }
  } catch (e) {
    console.error('加载确认数据失败:', e)
  }
}

// 确认侧商标图样重新上传（暂存，保存时统一上传）
function handleConfirmPicChange(file) {
  pendingFiles.value.confirmBrandPicUrl = file.raw
  form.value.brandPicUrl = null
  confirmBrandImageUrl.value = URL.createObjectURL(file.raw)
}

// 附件选择（暂存，保存时统一上传）

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
  for (const field of ['confirmBrandPicUrl', 'registerCertAttachment', 'transferApproveAttachment', 'attachment']) {
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

// 提交前校验：类别受理结果行（保存不校验，支持部分保存）
function validateConfirm() {
  const seen = []
  for (const c of form.value.confirmClasses) {
    if (!c.classNo) return '类别编号不能为空'
    const no = Number(c.classNo)
    if (!Number.isInteger(no) || no < 1 || no > 45) return `类别编号“${c.classNo}”应为 1-45 之间的整数`
    if (seen.includes(no)) return `类别“${no}”重复填写`
    seen.push(no)
  }
  return ''
}

function buildParam() {
  return {
    id: form.value.id,
    brandPicUrl: form.value.brandPicUrl,
    trademarkSeries: form.value.trademarkSeries,
    trademarkRegisterDate: form.value.trademarkRegisterDate || null,
    countryRegionId: form.value.countryRegionId,
    registerNumber: form.value.registerNumber,
    transferorName: form.value.confirmTransferorName,
    transferorRegisterAddress: form.value.transferorRegisterAddress,
    transfereeName: form.value.confirmTransfereeName,
    transfereeAddress: form.value.confirmTransfereeAddress,
    firstRegisterStartDate: form.value.firstRegisterStartDate || null,
    originalValidityStartDate: form.value.originalValidityStartDate || null,
    originalValidityEndDate: form.value.originalValidityEndDate || null,
    transferValidityStartDate: form.value.transferValidityStartDate || null,
    transferValidityEndDate: form.value.transferValidityEndDate || null,
    classCount: form.value.classCount,
    confirmClasses: form.value.confirmClasses.map(c => ({
      categoryNo: c.classNo,
      productService: c.productService,
      acceptResult: c.acceptResult,
      approvedGoods: c.approvedGoods,
    })),
    registerCertOpinion: form.value.registerCertOpinion,
    registerCertAttachment: form.value.registerCertAttachment,
    transferApproveOpinion: form.value.transferApproveOpinion,
    transferApproveAttachment: form.value.transferApproveAttachment,
    attachment: form.value.attachment,
    remark: form.value.remark,
  }
}

async function doSave() {
  if (saving.value) return false
  saving.value = true
  try {
    await uploadPendingFiles()
    await transferSaveConfirm(buildParam())
    ElMessage.success('保存成功')
    return true
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '保存失败')
    return false
  } finally {
    saving.value = false
  }
}

async function handleSave() {
  await doSave()
}

async function handleSaveAndSubmit() {
  const err = validateConfirm()
  if (err) { ElMessage.error(err); return }
  if (saving.value) return
  saving.value = true
  try {
    await uploadPendingFiles()
    await transferSubmitConfirm(buildParam())
    ElMessage.success('确认提交成功')
    router.back()
  } catch (e) {
    console.error(e)
    if (e.message && !e.message.includes('上传失败')) ElMessage.error(e.message || '确认提交失败')
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

  .brand-preview-wrap {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .brand-preview-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    background: #FFFFFF;
    padding: 2px;
    border-radius: 2px;
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    object-fit: contain;
  }

  .block-body {
    padding: 16px 0 0;
  }
  .block-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;

    .block-label {
      flex: 0 0 170px;
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
  .file-link { color: #409eff; text-decoration: none; margin-left: 8px; font-size: 13px; }
.file-link:hover { text-decoration: underline; }
.uploaded-tip {
    font-size: 12px;
    color: #67C23A;
  }

  .btn-upload {
    border-radius: 6px;
    font-size: 14px;
  }
}
  .four-col thead th { background: #D6E8FB; color: #333333; font-weight: 600; text-align: center; border: 1px solid #E8E8E8; padding: 10px 12px; }
  .req-label::before { content: '* '; color: #FF4D4F; }
  .req-star { color: #FF4D4F; }
  .search-icon { cursor: pointer; color: #999; }
  .category-actions { display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-circle { border-radius: 100%; padding: 5px; }
  .link { color: #1890FF; cursor: pointer; }
</style>
