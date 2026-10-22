<template>
  <div class="banner">
    <div class="page-wrapper">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">商标申请与确认</h1>
      </div>

      <!-- Tab 胶囊按钮 -->
      <div class="tab-bar">
        <button
          v-for="tab in tabList"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >{{ tab.label }}</button>
      </div>

      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="formInline" class="search-form">
          <el-form-item label="申请类型">
            <el-select v-model="formInline.type" placeholder="全部" clearable style="width: 140px">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker v-model="dateRange" type="daterange" range-separator="～" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item label="境内/境外">
            <el-select v-model="formInline.applyScope" placeholder="全部" clearable style="width: 120px">
              <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属国家/地区">
            <el-select v-model="formInline.country_id" placeholder="全部" clearable filterable style="width: 140px">
              <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.applyMessage" placeholder="申请编码/申请人" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn-search" @click="handleSearch">查询</el-button>
            <el-button class="btn-reset" @click="handleClear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮栏 -->
      <div class="action-bar">
        <div class="action-left">
          <el-button type="primary" class="btn-create" @click="showCreateDialog = true">+ 创建申请</el-button>
        </div>
        <div class="action-right">
          <el-button class="btn-outline" @click="handleBatchDelete" v-if="activeTab === 0">批量删除</el-button>
          <el-button class="btn-outline" @click="handleExport">导出excel</el-button>
          <el-button class="btn-outline" @click="handleBatchSubmit" v-if="activeTab === 0">提交</el-button>
          <el-button class="btn-outline" @click="handleBatchWithdraw" v-if="activeTab === 1">撤回</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table v-loading="tableLoading" class="dataTable" :header-cell-style="tableOptions.headStyle" :cell-style="tableOptions.cellStyle" :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column type="index" align="center" label="序号" width="70" :index="(index) => (queryOptions.page - 1) * queryOptions.pageSize + index + 1" />
          <el-table-column prop="applyNumber" align="center" label="申请编码" min-width="140" show-overflow-tooltip>
            <template #default="scope">
              <el-button v-if="scope.row.applyNumber" type="primary" link @click="handleEdit(scope.row)">{{ scope.row.applyNumber }}</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="申请类型" width="160" show-overflow-tooltip>
            <template #default="scope">{{ detailTypeMap[scope.row.type] || '-' }}</template>
          </el-table-column>
          <el-table-column prop="brandNO" align="center" label="所属商标申请编码" min-width="140" show-overflow-tooltip />
          <el-table-column prop="seriesName" align="center" label="商标系列" width="120" show-overflow-tooltip />
          <el-table-column prop="applyScope" align="center" label="境内/境外" width="100">
            <template #default="scope">{{ scopeMap[scope.row.applyScope] || '-' }}</template>
          </el-table-column>
          <el-table-column prop="countryRegionName" align="center" label="所属国家/地区" width="120" show-overflow-tooltip />
          <el-table-column prop="applyPerson" align="center" label="单据申请人" width="120" show-overflow-tooltip />
          <el-table-column prop="updateTime" align="center" label="最新操作时间" width="170" show-overflow-tooltip>
            <template #default="scope">{{ formatDate(scope.row.updateTime) }}</template>
          </el-table-column>
          <el-table-column v-if="activeTab !== 3" align="center" label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button v-if="activeTab === 0" type="primary" link @click="handleSubmit(scope.row)">提交</el-button>
              <el-button v-if="activeTab === 0" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
              <el-button v-if="activeTab === 1" type="success" link @click="handleApprove(scope.row)">同意</el-button>
              <el-button v-if="activeTab === 2" type="primary" link @click="handleConfirm(scope.row)">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-bar">
        <span class="pagination-info">共 {{ tableOptions.total }} 条记录</span>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="queryOptions.page"
          :page-size="queryOptions.pageSize"
          :page-sizes="tableOptions.pageSizes"
          :total="tableOptions.total"
          @size-change="(val) => handlePageChange(val, 1)"
          @current-change="(val) => handlePageChange(val, 2)"
        />
      </div>

      <!-- 创建申请弹窗 -->
      <CreateDialog v-model:show="showCreateDialog" @confirm="handleCreateConfirm" />
      <ExportDialog v-model:show="showExportDialog" :ids="exportIds" :types="exportTypes" :filters="{ status: activeTab, applyMessage: formInline.applyMessage, applyScope: formInline.applyScope, country_id: formInline.country_id, beginDate: dateRange[0], endDate: dateRange[1] }" />
    </div>
  </div>
</template>

<script setup>
import CreateDialog from './createDialog.vue'
import ExportDialog from './exportDialog.vue'
import { basicGetList, basicDelete, basicDeleteBatch } from '@/api/trademark/ap/basic'
import { registerSubmit, registerUnapprove, registerApprove } from '@/api/trademark/ap/register'
import { brandChangeSubmit, brandChangeUnapprove, brandChangeApprove } from '@/api/trademark/ap/brandChange'
import { renewalSubmit, renewalUnapprove, renewalApprove } from '@/api/trademark/ap/renewal'
import { transferSubmit, transferUnapprove, transferApprove } from '@/api/trademark/ap/transfer'
import { rejectionReviewSubmit, rejectionReviewUnapprove, rejectionReviewApprove } from '@/api/trademark/ap/rejectionReview'
import { oppositionSubmit, oppositionUnapprove, oppositionApprove } from '@/api/trademark/ap/opposition'
import { brandChangeCheckConflict } from '@/api/trademark/ap/brandChange'
import { renewalCheckConflict } from '@/api/trademark/ap/renewal'
import { transferCheckConflict } from '@/api/trademark/ap/transfer'
import { rejectionReviewCheckConflict } from '@/api/trademark/ap/rejectionReview'
import { oppositionCheckConflict } from '@/api/trademark/ap/opposition'
import { defenseSubmit, defenseUnapprove, defenseApprove, defenseCheckConflict } from '@/api/trademark/ap/defense'
import { oppReviewSubmit, oppReviewUnapprove, oppReviewApprove, oppReviewCheckConflict } from '@/api/trademark/ap/oppReview'
import { respReviewSubmit, respReviewUnapprove, respReviewApprove, respReviewCheckConflict } from '@/api/trademark/ap/respReview'
import { correctionSubmit, correctionUnapprove, correctionApprove, correctionCheckConflict } from '@/api/trademark/ap/correction'
import { adminLitSubmit, adminLitUnapprove, adminLitApprove, adminLitCheckConflict } from '@/api/trademark/ap/adminLit'
import { tabList, detailTypeMap, typeOptions, scopeMap, scopeOptions } from '../config'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref(0)
const showCreateDialog = ref(false)
const showExportDialog = ref(false)
const exportIds = ref([])
const exportTypes = ref([])
const tableLoading = ref(false)
const list = ref([])
const dateRange = ref([])
const selectedRows = ref([])

const formInline = ref({ applyMessage: '', type: null, applyScope: null, country_id: null })
const queryOptions = ref({ page: 1, pageSize: 10 })
const tableOptions = ref({
  headStyle: { background: '#FAFAFA', color: '#000', fontWeight: '600', height: '54px' },
  cellStyle: { height: '54px' },
  pageSizes: [5, 10, 20, 50],
  total: 0,
})
const options = ref({ countryRegion: [] })

onMounted(() => { loadOptions(); handleGetTable() })

async function loadOptions() {
  try {
    const res = await countryRegionGetList({ page: 1, pageSize: 1000 })
    options.value.countryRegion = res.data.list || []
  } catch (e) { console.error(e) }
}

function handleTabChange(val) {
  activeTab.value = val
  formInline.value.status = val
  queryOptions.value.page = 1
  handleGetTable()
}

function handleGetTable() {
  tableLoading.value = true
  const params = { page: queryOptions.value.page, pageSize: queryOptions.value.pageSize, status: activeTab.value }
  if (formInline.value.applyMessage) params.applyMessage = formInline.value.applyMessage
  if (formInline.value.type !== null && formInline.value.type !== undefined) params.type = formInline.value.type
  if (formInline.value.applyScope !== null && formInline.value.applyScope !== undefined) params.applyScope = formInline.value.applyScope
  if (formInline.value.country_id) params.country_id = formInline.value.country_id
  if (dateRange.value && dateRange.value.length === 2) { params.beginDate = dateRange.value[0]; params.endDate = dateRange.value[1] }
  basicGetList(params).then(res => {
    list.value = res.data.list || []
    tableOptions.value.total = res.data.total || 0
  }).catch(() => { list.value = []; tableOptions.value.total = 0 }).finally(() => { tableLoading.value = false })
}

function handleSearch() { queryOptions.value.page = 1; handleGetTable() }
function handleClear() {
  formInline.value = { applyMessage: '', type: null, applyScope: null, country_id: null }
  dateRange.value = []
  queryOptions.value.page = 1
  handleGetTable()
}
function handlePageChange(val, type) {
  type === 1 ? (queryOptions.value.pageSize = val) : (queryOptions.value.page = val)
  handleGetTable()
}
function handleSelectionChange(rows) { selectedRows.value = rows }

function handleSubmit(row) {
  ElMessageBox.confirm('确认提交该申请？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const submitApi = row.type === 2 ? brandChangeSubmit : (row.type === 4 ? transferSubmit : (row.type === 5 ? renewalSubmit : (row.type === 6 ? oppositionSubmit : row.type === 7 ? defenseSubmit : row.type === 8 ? oppReviewSubmit : row.type === 9 ? respReviewSubmit : row.type === 3 ? correctionSubmit : row.type === 11 ? adminLitSubmit : row.type === 10 ? rejectionReviewSubmit : registerSubmit)))
    submitApi(row.id).then(() => { ElMessage.success('提交成功'); handleGetTable() })
  }).catch(() => {})
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除该申请？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
    try {
      await basicDelete(row.id)
      ElMessage.success('删除成功')
    } catch (e) {
      // 失败原因（如：当前单据已送批/已删除）已由请求拦截器统一提示
    } finally {
      handleGetTable()
    }
  }).catch(() => {})
}

function handleBatchDelete() {
  if (selectedRows.value.length === 0) return ElMessage.warning('请先选择要删除的记录')
  ElMessageBox.confirm('确认删除选中的 ' + selectedRows.value.length + ' 条记录？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
    try {
      await basicDeleteBatch(selectedRows.value.map(row => row.id))
      ElMessage.success('批量删除成功')
    } catch (e) {
      // 失败原因已由请求拦截器统一提示
    } finally {
      handleGetTable()
    }
  }).catch(() => {})
}

function handleBatchSubmit() {
  if (selectedRows.value.length === 0) return ElMessage.warning('请先选择要提交的记录')
  ElMessageBox.confirm('确认提交选中的 ' + selectedRows.value.length + ' 条记录？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const promises = selectedRows.value.map(row => (row.type === 2 ? brandChangeSubmit : (row.type === 4 ? transferSubmit : (row.type === 5 ? renewalSubmit : (row.type === 6 ? oppositionSubmit : row.type === 7 ? defenseSubmit : row.type === 8 ? oppReviewSubmit : row.type === 9 ? respReviewSubmit : row.type === 3 ? correctionSubmit : row.type === 11 ? adminLitSubmit : row.type === 10 ? rejectionReviewSubmit : registerSubmit))))(row.id))
    Promise.all(promises).then(() => { ElMessage.success('批量提交成功'); handleGetTable() })
  }).catch(() => {})
}

function handleBatchWithdraw() {
  if (selectedRows.value.length === 0) return ElMessage.warning('请先选择要撤回的记录')
  ElMessageBox.confirm('确认撤回选中的 ' + selectedRows.value.length + ' 条记录？撤回后将退回待提交状态', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const promises = selectedRows.value.map(row => (row.type === 2 ? brandChangeUnapprove : (row.type === 4 ? transferUnapprove : (row.type === 5 ? renewalUnapprove : (row.type === 6 ? oppositionUnapprove : row.type === 7 ? defenseUnapprove : row.type === 8 ? oppReviewUnapprove : row.type === 9 ? respReviewUnapprove : row.type === 3 ? correctionUnapprove : row.type === 11 ? adminLitUnapprove : row.type === 10 ? rejectionReviewUnapprove : registerUnapprove))))(row.id))
    Promise.all(promises).then(() => { ElMessage.success('批量撤回成功'); handleGetTable() }).catch(() => { handleGetTable() })
  }).catch(() => {})
}

function handleApprove(row) {
  ElMessageBox.confirm('确认同意该申请？同意后将进入待确认状态', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const approveApi = row.type === 2 ? brandChangeApprove : (row.type === 4 ? transferApprove : (row.type === 5 ? renewalApprove : (row.type === 6 ? oppositionApprove : row.type === 7 ? defenseApprove : row.type === 8 ? oppReviewApprove : row.type === 9 ? respReviewApprove : row.type === 3 ? correctionApprove : row.type === 11 ? adminLitApprove : row.type === 10 ? rejectionReviewApprove : registerApprove)))
    approveApi(row.id).then(() => { ElMessage.success('已同意，进入待确认'); handleGetTable() })
  }).catch(() => {})
}

function handleWithdraw(row) {
  ElMessageBox.confirm('确认撤回该申请？撤回后将退回待提交状态', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const unapproveApi = row.type === 2 ? brandChangeUnapprove : (row.type === 4 ? transferUnapprove : (row.type === 5 ? renewalUnapprove : (row.type === 6 ? oppositionUnapprove : row.type === 7 ? defenseUnapprove : row.type === 8 ? oppReviewUnapprove : row.type === 9 ? respReviewUnapprove : row.type === 3 ? correctionUnapprove : row.type === 11 ? adminLitUnapprove : row.type === 10 ? rejectionReviewUnapprove : registerUnapprove)))
    unapproveApi(row.id).then(() => { ElMessage.success('撤回成功'); handleGetTable() })
  }).catch(() => {})
}

function handleConfirm(row) {
  // 变更类：跳转变更确认页（id 为申请基本信息ID）
  if (row.type === 2) {
    router.push({ name: 'ChangeConfirm', query: { id: row.id } })
    return
  }
  // 续展类：跳转续展确认页（id 为申请基本信息ID）
  if (row.type === 5) {
    router.push({ name: 'RenewalConfirm', query: { id: row.id } })
    return
  }
  // 转让类：跳转转让确认页（id 为申请基本信息ID）
  if (row.type === 4) {
    router.push({ name: 'TransferConfirm', query: { id: row.id } })
    return
  }
  // 异议申请类：跳转异议确认页
  if (row.type === 6) {
    router.push({ name: 'OppositionConfirm', query: { id: row.id } })
    return
  }
  // 答辩类：跳转答辩确认页
  if (row.type === 7) {
    router.push({ name: 'DefenseConfirm', query: { id: row.id } })
    return
  }
  // 异议复审类：跳转异议复审确认页
  if (row.type === 8) {
    router.push({ name: 'OppReviewConfirm', query: { id: row.id } })
    return
  }
  // 异议复审(被异议人)类：跳转其确认页
  if (row.type === 9) {
    router.push({ name: 'RespReviewConfirm', query: { id: row.id } })
    return
  }
  // 更正类：无独立确认页，跳更正编制页查看
  if (row.type === 3) {
    router.push({ name: 'Correction', query: { id: row.id } })
    return
  }
  // 行政诉讼结案类：无独立确认页，跳其编制页查看
  if (row.type === 11) {
    router.push({ name: 'AdminLit', query: { id: row.id } })
    return
  }
  // 驳回复审类：跳转驳回复审确认页
  if (row.type === 10) {
    router.push({ name: 'RejectionReviewConfirm', query: { id: row.id } })
    return
  }
  router.push({ name: 'RegisterConfirm', query: { id: row.id } })
}

function handleEdit(row) {
  // 变更类：待确认/已确认跳变更确认页（查看/确认数据），待提交/签批中跳变更编制页（提交后只读）
  if (row.type === 2) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'ChangeConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'Change', query: { id: row.id } })
    }
    return
  }
  // 续展类：待确认/已确认跳续展确认页，待提交/签批中跳续展编制页
  if (row.type === 5) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'RenewalConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'Renewal', query: { id: row.id } })
    }
    return
  }
  // 转让类：待确认/已确认跳转让确认页，待提交/签批中跳转让编制页
  if (row.type === 4) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'TransferConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'Transfer', query: { id: row.id } })
    }
    return
  }
  // 异议申请类：待确认/已确认跳异议确认页，待提交/签批中跳异议编制页
  if (row.type === 6) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'OppositionConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'Opposition', query: { id: row.id } })
    }
    return
  }
  // 答辩类：待确认/已确认跳答辩确认页，待提交/签批中跳答辩编制页
  if (row.type === 7) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'DefenseConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'Defense', query: { id: row.id } })
    }
    return
  }
  // 异议复审类：待确认/已确认跳异议复审确认页，待提交/签批中跳异议复审编制页
  if (row.type === 8) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'OppReviewConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'OppReview', query: { id: row.id } })
    }
    return
  }
  // 异议复审(被异议人)类：待确认/已确认跳其确认页，待提交/签批中跳其编制页
  if (row.type === 9) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'RespReviewConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'RespReview', query: { id: row.id } })
    }
    return
  }
  // 更正类：跳更正编制页（非待提交态只读）
  if (row.type === 3) {
    router.push({ name: 'Correction', query: { id: row.id } })
    return
  }
  // 行政诉讼结案类：跳其编制页（非待提交态只读）
  if (row.type === 11) {
    router.push({ name: 'AdminLit', query: { id: row.id } })
    return
  }
  // 驳回复审类：待确认/已确认跳驳回复审确认页，待提交/签批中跳驳回复审编制页
  if (row.type === 10) {
    if (activeTab.value === 2 || activeTab.value === 3) {
      router.push({ name: 'RejectionReviewConfirm', query: { id: row.id } })
    } else {
      router.push({ name: 'RejectionReview', query: { id: row.id } })
    }
    return
  }
  // 已确认tab下点击申请编码跳转确认页面查看数据
  if (activeTab.value === 3) {
    router.push({ name: 'RegisterConfirm', query: { id: row.id } })
    return
  }
  router.push({ name: 'Register', query: { id: row.id, type: row.type } })
}
function handleExport() {
  if (!selectedRows.value.length) { ElMessage.warning('请先选择要导出的记录'); return }
  exportTypes.value = Array.from(new Set(selectedRows.value.map(r => r.type)))
  exportIds.value = selectedRows.value.map(r => r.id)
  showExportDialog.value = true
}

const routerList = {
  1: 'Register',
}

async function handleCreateConfirm(type) {
  showCreateDialog.value = false
  // 变更：需先选中一条记录，携带商标ID跳转变更编制页
  if (type === 2) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await brandChangeCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'Change', query: { brandId: row.brandId } })
    return
  }
  // 续展：同样需先选中一条记录，携带商标ID跳转续展编制页
  if (type === 5) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await renewalCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'Renewal', query: { brandId: row.brandId } })
    return
  }
  // 转让：同样需先选中一条记录，携带商标ID跳转转让编制页
  if (type === 4) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await transferCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'Transfer', query: { brandId: row.brandId } })
    return
  }
  // 异议申请：同样需先选中一条记录，携带商标ID跳转异议编制页
  if (type === 6) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await oppositionCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'Opposition', query: { brandId: row.brandId } })
    return
  }
  // 答辩：同样需先选中一条记录，前置冲突检查后跳转答辩编制页
  if (type === 7) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await defenseCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'Defense', query: { brandId: row.brandId } })
    return
  }
  // 异议复审：同样需先选中一条记录，前置冲突检查后跳转异议复审编制页
  if (type === 8) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await oppReviewCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'OppReview', query: { brandId: row.brandId } })
    return
  }
  // 异议复审(被异议人)：同样需先选中一条记录，前置冲突检查后跳转其编制页
  if (type === 9) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await respReviewCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'RespReview', query: { brandId: row.brandId } })
    return
  }
  // 更正：需先选中一条记录，前置冲突检查后跳转更正编制页
  if (type === 3) {
    if (selectedRows.value.length !== 1) { ElMessage.warning('请先选中一条记录'); return }
    const row = selectedRows.value[0]
    if (!row.brandId) { ElMessage.warning('该记录未关联商标'); return }
    let m3 = null
    try { const r3 = await correctionCheckConflict(row.brandId); m3 = r3 && typeof r3.data === 'string' && r3.data ? r3.data : null } catch (e) { m3 = null }
    if (m3) { ElMessageBox.alert(m3, '无法新建', { confirmButtonText: '知道了' }); return }
    router.push({ name: 'Correction', query: { brandId: row.brandId } })
    return
  }
  // 行政诉讼结案：需先选中一条记录，前置冲突检查后跳转其编制页
  if (type === 11) {
    if (selectedRows.value.length !== 1) { ElMessage.warning('请先选中一条记录'); return }
    const row = selectedRows.value[0]
    if (!row.brandId) { ElMessage.warning('该记录未关联商标'); return }
    let m11 = null
    try { const r11 = await adminLitCheckConflict(row.brandId); m11 = r11 && typeof r11.data === 'string' && r11.data ? r11.data : null } catch (e) { m11 = null }
    if (m11) { ElMessageBox.alert(m11, '无法新建', { confirmButtonText: '知道了' }); return }
    router.push({ name: 'AdminLit', query: { brandId: row.brandId } })
    return
  }
  // 驳回复审：同样需先选中一条记录，携带商标ID跳转驳回复审编制页
  if (type === 10) {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请先选中一条记录')
      return
    }
    const row = selectedRows.value[0]
    if (!row.brandId) {
      ElMessage.warning('该记录未关联商标')
      return
    }
    let conflictMsg = null
    try {
      const conflict = await rejectionReviewCheckConflict(row.brandId)
      conflictMsg = conflict && typeof conflict.data === 'string' && conflict.data ? conflict.data : null
    } catch (e) { conflictMsg = null }
    if (conflictMsg) {
      ElMessageBox.alert(conflictMsg, '无法新建', { confirmButtonText: '知道了' })
      return
    }
    router.push({ name: 'RejectionReview', query: { brandId: row.brandId } })
    return
  }
  // 跳转到编制申请页面，携带申请类型参数
  router.push({
    name: routerList[type],
    query: { type },
  })
}

function formatDate(val) {
  if (!val) return '-'
  if (typeof val === 'string') return val.substring(0, 19).replace('T', ' ')
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 19)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  const secs = String(d.getSeconds()).padStart(2, '0')
  return year + '-' + month + '-' + day + ' ' + hours + ':' + mins + ':' + secs
}


</script>

<style lang="scss" scoped>
.banner {
  padding: 10px;
}
.page-wrapper {
  background-color: #fff;
  // margin: 0 10px 10px 10px;
  border-radius: 5px;
  min-height: 100%;
  // padding-top: 10px;

  .page-header {
    // background: #fff;
    padding: 16px 0px 16px 32px;
    // margin-top: 100px;

    .page-title {
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 20px;
      font-weight: 650;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      margin: 0;
    }
  }

  .tab-bar {
    display: flex;
    padding: 16px 32px 0;

    .tab-btn {
      width: 115px;
      height: 38px;
      font-size: 16px;
      font-family: 'Microsoft YaHei', sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #1890FF;
      border-right: none;
      background: #FFFFFF;
      color: #333333;
      // border-color: #1890FF;

      &:first-child {
        border-radius: 6px 0 0 6px;
      }

      &:last-child {
        border-radius: 0 6px 6px 0;
        border-right: 1px solid #1890FF;
      }

      &.active {
        background: #1890FF;
        color: #FFFFFF;
        border-color: #1890FF;
      }

      &:hover:not(.active) {
        color: #1890FF;
        // border-color: #1890FF;
      }
    }
  }

  .search-bar {
    margin: 16px 32px 0;
    background: #FFFFFF;
    // border: 1px solid #E9E9E9;
    padding: 12px 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 10px;
        margin-right: 16px;
      }
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px 0;

    .action-left, .action-right {
      display: flex;
      gap: 12px;
    }

    .btn-create {
      background: #1890FF;
      color: #FFFFFF;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      padding: 8px 20px;
      height: 38px;

      &:hover {
        background: #40a9ff;
      }
    }

    .btn-outline {
      background: #FFFFFF;
      color: #333333;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      font-size: 16px;
      padding: 8px 20px;
      height: 38px;

      &:hover {
        color: #1890FF;
        border-color: #1890FF;
      }
    }
  }

  .table-wrapper {
    margin: 16px 32px 0;
    background: #FFFFFF;
    border-radius: 4px;

    .dataTable {
      :deep(.el-table) {
        border: none;
      }
      :deep(.el-table__header) {
        th {
          background: #FAFAFA;
          height: 54px;
          border: none;
          border-bottom: 1px solid #EBEEF5;
        }
      }
      :deep(.el-table__body) {
        td {
          height: 54px;
          border: none;
          border-bottom: 1px solid #EBEEF5;
        }
      }
      :deep(.el-table::before) {
        display: none;
      }
    }
  }

  .pagination-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 16px 32px;

    .pagination-info {
      font-size: 14px;
      color: #666;
    }
  }

  .btn-search {
    background: #1890FF;
    border-color: #1890FF;
    border-radius: 6px;
    font-size: 14px;
  }

  .btn-reset {
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    font-size: 14px;
  }
}
</style>
