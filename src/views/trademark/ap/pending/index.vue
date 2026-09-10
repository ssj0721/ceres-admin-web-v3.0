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
          <el-button class="btn-outline" @click="handleBatchDelete">批量删除</el-button>
          <el-button class="btn-outline" @click="handleExport">导出excel</el-button>
          <el-button class="btn-outline" @click="handleBatchSubmit" v-if="activeTab === 0">提交</el-button>
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
          <el-table-column align="center" label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button v-if="activeTab === 0" type="primary" link @click="handleSubmit(scope.row)">提交</el-button>
              <el-button v-if="activeTab === 0" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
              <el-button v-if="activeTab === 1" type="warning" link @click="handleWithdraw(scope.row)">撤回</el-button>
              <el-button v-if="activeTab === 1" type="primary" link @click="handleExportRow(scope.row)">导出</el-button>
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
    </div>
  </div>
</template>

<script setup>
import CreateDialog from './createDialog.vue'
import { basicGetList } from '@/api/trademark/ap/basic'
import { registerSubmit, registerUnapprove } from '@/api/trademark/ap/register'
import { tabList, detailTypeMap, typeOptions, scopeMap, scopeOptions } from '../config'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref(0)
const showCreateDialog = ref(false)
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
    registerSubmit(row.id).then(() => { ElMessage.success('提交成功'); handleGetTable() })
  }).catch(() => {})
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除该申请？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
    handleGetTable()
  }).catch(() => {})
}

function handleBatchDelete() {
  if (selectedRows.value.length === 0) return ElMessage.warning('请先选择要删除的记录')
  ElMessageBox.confirm('确认删除选中的 ' + selectedRows.value.length + ' 条记录？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    // TODO: 调用批量删除接口
    ElMessage.success('批量删除成功')
    handleGetTable()
  }).catch(() => {})
}

function handleBatchSubmit() {
  if (selectedRows.value.length === 0) return ElMessage.warning('请先选择要提交的记录')
  ElMessageBox.confirm('确认提交选中的 ' + selectedRows.value.length + ' 条记录？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    const promises = selectedRows.value.map(row => registerSubmit(row.id))
    Promise.all(promises).then(() => { ElMessage.success('批量提交成功'); handleGetTable() })
  }).catch(() => {})
}

function handleWithdraw(row) {
  ElMessageBox.confirm('确认撤回该申请？撤回后将退回待提交状态', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
    registerUnapprove(row.id).then(() => { ElMessage.success('撤回成功'); handleGetTable() })
  }).catch(() => {})
}

function handleConfirm(row) {
  console.log("Yes")
  router.push({ name: 'RegisterConfirm', query: { id: row.id } })
}

function handleEdit(row) {
  // 已确认tab下点击申请编码跳转确认页面查看数据
  if (activeTab.value === 3) {
    router.push({ name: 'RegisterConfirm', query: { id: row.id } })
    return
  }
  router.push({ name: 'Register', query: { id: row.id, type: row.type } })
}
function handleExport() { ElMessage.info('导出功能待实现') }
function handleExportRow(row) { ElMessage.info('导出功能待实现') }

const routerList = {
  0: 'Register',
}

function handleCreateConfirm(type) {
  showCreateDialog.value = false
  // 跳转到编制申请页面，携带申请类型参数
  router.push({
    name: routerList[type],
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
    border: 1px solid #E9E9E9;
    padding: 12px 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
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
