<template>
  <div class="banner">
    <div class="page-wrapper">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">商标台账</h1>
      </div>

      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="formInline" class="search-form">
          <el-form-item>
            <el-input v-model="formInline.keyword" placeholder="申请编号/注册编号/申请人/注册人" clearable :prefix-icon="Search" style="width: 280px" />
          </el-form-item>
          <el-form-item label="注册状态">
            <el-select v-model="formInline.registerStatus" placeholder="全部" clearable style="width: 140px">
              <el-option v-for="item in registerStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="境内/境外">
            <el-select v-model="formInline.scopeType" placeholder="全部" clearable style="width: 120px">
              <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属国家/地区">
            <el-select v-model="formInline.countryRegionId" placeholder="全部" clearable filterable style="width: 160px">
              <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请/注册日期">
            <el-date-picker v-model="dateRange" type="daterange" range-separator="～" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn-search" @click="handleSearch">查 询</el-button>
            <el-button class="btn-reset" @click="handleClear">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮栏 -->
      <div class="action-bar">
        <div class="action-left">
          <el-button class="btn-outline" @click="handleExport">导出excel</el-button>
        </div>
        <div class="action-right">
          <span class="note-text">注：未注册/注册失败的商标，单据编号为商标申请注册编号；已注册成功的商标，单据编号为商标注册编号。</span>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table v-loading="tableLoading" class="dataTable" :header-cell-style="tableOptions.headStyle" :cell-style="tableOptions.cellStyle" :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column type="index" align="center" label="序号" width="80" :index="(index) => (queryOptions.page - 1) * queryOptions.pageSize + index + 1" />
          <el-table-column align="center" label="商标申请/注册编号" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              <el-button v-if="docNo(scope.row)" type="primary" link @click="handleDetail(scope.row)">{{ docNo(scope.row) }}</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册状态" width="110">
            <template #default="scope">{{ registerStatusMap[regStatus(scope.row)] }}</template>
          </el-table-column>
          <el-table-column align="center" label="境内/境外" width="100">
            <template #default="scope">{{ scope.row.scopeType !== null && scope.row.scopeType !== undefined ? scopeTypeMap[scope.row.scopeType] || '-' : '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="所属国家/地区" width="130" show-overflow-tooltip>
            <template #default="scope">{{ maps.countryRegion[scope.row.countryRegionId] || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="商标系列" width="130" show-overflow-tooltip>
            <template #default="scope">{{ maps.series[scope.row.seriesId] || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="商标申请/注册人" min-width="160" show-overflow-tooltip>
            <template #default="scope">{{ applicant(scope.row) }}</template>
          </el-table-column>
          <el-table-column align="center" label="申请/注册日期" width="140">
            <template #default="scope">{{ formatDate(applyDate(scope.row)) }}</template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-bar">
        <span class="pagination-info">共 {{ tableOptions.total }} 条记录 第 {{ queryOptions.page }} / {{ pageCount }} 页</span>
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

    </div>
  </div>
</template>

<script setup>
import { registerStatusMap, registerStatusOptions, scopeTypeMap, scopeOptions } from './config'
import { brBrandSearch } from '@/api/trademark/br/brBrand'
import { agentGetList } from '@/api/trademark/bd/agent'
import { companyNameGetList } from '@/api/trademark/bd/companyName'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { brandSeriesGetList } from '@/api/trademark/bd/brandSeries'
import { brandCategoryGetList } from '@/api/trademark/bd/brandCategory'
import { originalStorageGetList } from '@/api/trademark/bd/originalStorage'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const tableLoading = ref(false)
const list = ref([])
const dateRange = ref([])
const selectedRows = ref([])

const formInline = ref({ keyword: '', registerStatus: null, scopeType: null, countryRegionId: null })
const queryOptions = ref({ page: 1, pageSize: 10 })
const tableOptions = ref({
  headStyle: { background: '#FAFAFA', color: '#000', fontWeight: '600', height: '54px' },
  cellStyle: { height: '54px' },
  pageSizes: [5, 10, 20, 50],
  total: 0,
})
const options = ref({ countryRegion: [] })
const maps = ref({ countryRegion: {}, company: {}, series: {}, agent: {}, storage: {}, scope: {} })

const pageCount = computed(() => Math.max(1, Math.ceil(tableOptions.value.total / queryOptions.value.pageSize)))

onMounted(() => { loadOptions(); handleGetTable() })

async function loadOptions() {
  try {
    const [agentRes, companyRes, regionRes, seriesRes, categoryRes, storageRes] = await Promise.all([
      agentGetList({ page: 1, pageSize: 1000 }),
      companyNameGetList({ page: 1, pageSize: 1000 }),
      countryRegionGetList({ page: 1, pageSize: 1000 }),
      brandSeriesGetList({ page: 1, pageSize: 1000 }),
      brandCategoryGetList({ page: 1, pageSize: 1000 }),
      originalStorageGetList({ page: 1, pageSize: 1000 }),
    ])
    options.value.countryRegion = regionRes.data.list || []
    maps.value = {
      countryRegion: toMap(options.value.countryRegion, 'name'),
      company: toMap(companyRes.data.list, 'companyName'),
      series: toMap(seriesRes.data.list, 'seriesName'),
      agent: toMap(agentRes.data.list, 'agent'),
      storage: toMap(storageRes.data.list, 'address'),
      scope: toMap(categoryRes.data.list, 'type'),
    }
  } catch (e) { console.error(e) }
}

function toMap(list, field) {
  const map = {}
  ;(list || []).forEach(item => { map[item.id] = item[field] })
  return map
}

// 注册状态：注册成功=申请状态1；注册失败=商标状态1/2/3；其余未注册
function regStatus(row) {
  if (row.applyStatus === 1) return 1
  if (row.brandStatus === 1 || row.brandStatus === 2 || row.brandStatus === 3) return 2
  return 0
}

// 单据编号：注册成功显示注册号，其余显示申请号
function docNo(row) {
  return row.applyStatus === 1 ? row.brandNo : row.applyNo
}

// 商标申请/注册人：注册成功显示注册人，其余显示申请人
function applicant(row) {
  return row.applyStatus === 1 ? (row.registerPerson || '-') : (row.applyPerson || '-')
}

// 申请/注册日期：注册成功显示注册时间，其余显示申请时间（创建时间）
function applyDate(row) {
  return row.applyStatus === 1 ? row.registrationDate : row.createTime
}

function handleGetTable() {
  tableLoading.value = true
  const params = { page: queryOptions.value.page, pageSize: queryOptions.value.pageSize }
  if (formInline.value.keyword) params.keyword = formInline.value.keyword
  if (formInline.value.registerStatus !== null && formInline.value.registerStatus !== undefined) params.registerStatus = formInline.value.registerStatus
  if (formInline.value.scopeType !== null && formInline.value.scopeType !== undefined) params.scopeType = formInline.value.scopeType
  if (formInline.value.countryRegionId !== null && formInline.value.countryRegionId !== undefined) params.countryRegionId = formInline.value.countryRegionId
  if (dateRange.value && dateRange.value.length === 2) { params.applyDateStart = dateRange.value[0]; params.applyDateEnd = dateRange.value[1] }
  brBrandSearch(params).then(res => {
    console.log(res)
    list.value = res.data.list || []
    tableOptions.value.total = res.data.total || 0
  }).catch(() => { list.value = []; tableOptions.value.total = 0 }).finally(() => { tableLoading.value = false })
}

function handleSearch() { queryOptions.value.page = 1; handleGetTable() }
function handleClear() {
  formInline.value = { keyword: '', registerStatus: null, scopeType: null, countryRegionId: null }
  dateRange.value = []
  queryOptions.value.page = 1
  handleGetTable()
}
function handlePageChange(val, type) {
  type === 1 ? (queryOptions.value.pageSize = val) : (queryOptions.value.page = val)
  handleGetTable()
}
function handleSelectionChange(rows) { selectedRows.value = rows }
function handleDetail(row) { router.push({ name: 'BrandDetail', query: { applyNo: row.applyNo } }) }
function handleExport() { ElMessage.info('导出功能待实现') }

function formatDate(val) {
  if (!val) return '-'
  if (typeof val === 'string') return val.substring(0, 10)
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 10)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}
</script>

<style lang="scss" scoped>
.banner {
  padding: 10px;
}
.page-wrapper {
  background-color: #fff;
  border-radius: 5px;
  min-height: 100%;

  .page-header {
    padding: 16px 0px 16px 32px;

    .page-title {
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 20px;
      font-weight: 650;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      margin: 0;
    }
  }

  .search-bar {
    margin: 16px 32px 0;
    background: #FFFFFF;
    // border: 1px solid #E9E9E9;
    padding: 12px 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 20px;
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
      align-items: center;
    }

    .note-text {
      font-size: 14px;
      color: #666;
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
    justify-content: space-between;
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
