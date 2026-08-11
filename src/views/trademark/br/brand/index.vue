<template>
  <div class="content">
    <!-- 快捷搜索区 -->
    <div class="quickSearch">
      <div class="quickSearchLeft">
        <span class="quickLabel">商标注册号</span>
        <el-input
          v-model="formInline.brandNo"
          placeholder="请输入商标注册号"
          clearable
          style="width: 300px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleClear">重置</el-button>
      </div>
      <div class="quickSearchRight">
        <el-button plain @click="showFilter = !showFilter">
          {{ showFilter ? '关闭过滤' : '展开过滤' }}
        </el-button>
        <el-button plain @click="showColumnSettings = true">列设置</el-button>
        <!-- <el-button type="primary" @click="handleEditForm()">新增</el-button> -->
      </div>
    </div>

    <!-- 可折叠过滤表单 -->
    <div v-show="showFilter" class="filterForm">
      <el-form :inline="true" :model="formInline" label-width="90px">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="申请状态">
              <el-select v-model="formInline.applyStatus" placeholder="请选择" clearable style="width: 100%">
                <el-option label="申请中" :value="0" />
                <el-option label="已注册" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册类型">
              <el-select v-model="formInline.registerType" placeholder="请选择" clearable style="width: 100%">
                <el-option label="新设计" :value="0" />
                <el-option label="扩大商品类别" :value="1" />
                <el-option label="新增国家地区" :value="2" />
                <el-option label="保护下注册" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="国家地区">
              <el-select v-model="formInline.countryRegionId" placeholder="请选择" clearable filterable style="width: 100%">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权利人">
              <el-select v-model="formInline.companyId" placeholder="请选择" clearable filterable style="width: 100%">
                <el-option v-for="item in options.companyName" :key="item.id" :label="item.companyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商标系列">
              <el-select v-model="formInline.seriesId" placeholder="请选择" clearable filterable style="width: 100%">
                <el-option v-for="item in options.brandSeries" :key="item.id" :label="item.seriesName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境内境外">
              <el-select v-model="formInline.scopeType" placeholder="请选择" clearable style="width: 100%">
                <el-option label="境内" :value="0" />
                <el-option label="境外" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有效">
              <el-select v-model="formInline.isValid" placeholder="请选择" clearable style="width: 100%">
                <el-option label="无效" :value="0" />
                <el-option label="有效" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理人">
              <el-select v-model="formInline.agensecId" placeholder="请选择" clearable filterable style="width: 100%">
                <el-option v-for="item in options.agent" :key="item.id" :label="item.agent" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人">
              <el-input v-model="formInline.manager" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商标备注">
              <el-input v-model="formInline.brandRemarks" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="续展状态">
              <el-select v-model="formInline.renewalStatus" placeholder="请选择" clearable style="width: 100%">
                <el-option label="未续展" :value="0" />
                <el-option label="已续展" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转让状态">
              <el-select v-model="formInline.transferStatus" placeholder="请选择" clearable style="width: 100%">
                <el-option label="未转让" :value="0" />
                <el-option label="已转让" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="正本存储">
              <el-select v-model="formInline.storageId" placeholder="请选择" clearable filterable style="width: 100%">
                <el-option v-for="item in options.originalStorage" :key="item.id" :label="item.address" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="首次申请">
              <el-date-picker v-model="formInline.firssecApplyDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册证日期">
              <el-date-picker v-model="formInline.registrationDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="续展申请">
              <el-date-picker v-model="formInline.renewalDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" style="width: 100%">
              <el-date-picker
                v-model="validityDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="tableLoading"
      class="table dataTable"
      stripe
      border
      :header-cell-style="tableOptions.headStyle"
      :data="list"
    >
      <el-table-column type="selection" align="center" width="55" />
      <template v-for="col in displayColumns" :key="col.prop">
        <el-table-column
          :label="col.label"
          :width="col.width"
          :align="col.align || 'center'"
          show-overflow-tooltip
        >
          <template #default="scope">
            <img
              v-if="col.isImage && scope.row[col.prop]"
              :src="scope.row[col.prop]"
              class="brandPic"
            >
            <span v-else-if="col.isImage">-</span>
            <span v-else>{{ formatCell(scope.row, col) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <!-- <el-button link type="primary" @click="handleEditForm(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="queryOptions.page"
      :page-size="queryOptions.pageSize"
      :page-sizes="tableOptions.pageSizes"
      :total="tableOptions.total"
      @size-change="(val) => handlePageChange(val, 1)"
      @current-change="(val) => handlePageChange(val, 2)"
    />

    <!-- 表单弹框 -->
    <BrandForm
      v-model:show="showForm"
      :item="formItem"
      :options="options"
      @confirm="handleResetTable"
      @cancel="handleResetTable"
    />
    <!-- 详情弹框 -->
    <BrandDetail ref="detailRef" />
    <!-- 列设置弹框 -->
    <ColumnSettings
      v-model:show="showColumnSettings"
      :columns="baseColumns"
      @confirm="handleColumnUpdate"
    />
  </div>
</template>

<script setup>
import BrandForm from './form.vue'
import BrandDetail from './detail.vue'
import ColumnSettings from './columnSettings.vue'
import { columnConfig, applyStatusMap, registerTypeMap, scopeTypeMap, isValidMap, renewalStatusMap, transferStatusMap } from './config'
import { brBrandDel, brBrandGetList, brBrandSearch } from '@/api/trademark/br/brBrand'
import { agentGetList } from '@/api/trademark/bd/agent'
import { companyNameGetList } from '@/api/trademark/bd/companyName'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { brandSeriesGetList } from '@/api/trademark/bd/brandSeries'
import { brandCategoryGetList } from '@/api/trademark/bd/brandCategory'
import { originalStorageGetList } from '@/api/trademark/bd/originalStorage'
import { computed, onMounted, ref } from 'vue'

const DEFAULT_COLUMNS_KEY = 'trademarkBrandColumns'
const CUSTOM_COLUMNS_KEY = 'trademarkBrandColumnsCustom'

const showForm = ref(false)
const showColumnSettings = ref(false)
const showFilter = ref(false)
const formItem = ref({})
const tableLoading = ref(false)
const list = ref([])
const detailRef = ref(null)

const validityDateRange = ref([])

const formInline = ref({
  brandNo: '',
  applyNo: '',
  applyStatus: null,
  registerType: null,
  countryRegionId: null,
  companyId: null,
  seriesId: null,
  scopeType: null,
  isValid: null,
  agensecId: null,
  manager: '',
  brandRemarks: '',
  renewalStatus: null,
  transferStatus: null,
  storageId: null,
  firssecApplyDate: '',
  registrationDate: '',
  renewalDate: '',
})

const queryOptions = ref({ page: 1, pageSize: 10 })
const tableOptions = ref({
  headStyle: { background: '#EEF3FF', color: '#333333' },
  pageSizes: [5, 10, 30, 50, 100],
  total: 0,
})

// 关联下拉数据
const options = ref({
  agent: [],
  companyName: [],
  countryRegion: [],
  brandSeries: [],
  brandCategory: [],
  originalStorage: [],
})

// 关联 id -> 名称 映射
const maps = ref({
  countryRegion: {},
  company: {},
  series: {},
  agent: {},
  storage: {},
  scope: {},
})

// 枚举映射
const enumMaps = {
  applyStatus: applyStatusMap,
  registerType: registerTypeMap,
  scopeType: scopeTypeMap,
  isValid: isValidMap,
  renewalStatus: renewalStatusMap,
  transferStatus: transferStatusMap,
}

// 列配置
const baseColumns = ref(columnConfig.map((col) => ({ ...col })))
const displayColumns = computed(() => baseColumns.value.filter((col) => col.show !== false))

onMounted(() => {
  if (!localStorage.getItem(DEFAULT_COLUMNS_KEY)) {
    localStorage.setItem(DEFAULT_COLUMNS_KEY, JSON.stringify(columnConfig))
  }
  const custom = localStorage.getItem(CUSTOM_COLUMNS_KEY)
  if (custom) {
    try {
      const saved = JSON.parse(custom)
      // Merge: use latest config properties, but keep custom show/order
      const configMap = {}
      columnConfig.forEach(col => { configMap[col.prop] = col })
      baseColumns.value = saved
        .filter(col => configMap[col.prop])
        .map(col => ({ ...configMap[col.prop], show: col.show }))
    } catch (e) { console.error(e) }
  }
  loadOptions()
  handleGetTable()
})

function toMap(list, field) {
  const map = {}
  list.forEach((item) => { map[item.id] = item[field] })
  return map
}

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
    options.value = {
      agent: agentRes.data.list || [],
      companyName: companyRes.data.list || [],
      countryRegion: regionRes.data.list || [],
      brandSeries: seriesRes.data.list || [],
      brandCategory: categoryRes.data.list || [],
      originalStorage: storageRes.data.list || [],
    }
    maps.value = {
      countryRegion: toMap(options.value.countryRegion, 'name'),
      company: toMap(options.value.companyName, 'companyName'),
      series: toMap(options.value.brandSeries, 'seriesName'),
      agent: toMap(options.value.agent, 'agent'),
      storage: toMap(options.value.originalStorage, 'address'),
      scope: toMap(options.value.brandCategory, 'type'),
    }
  } catch (e) { console.error(e) }
}

function formatDate(val, full) {
  if (!val) return '-'
  // Handle string dates
  if (typeof val === 'string') {
    const s = val.replace('T', ' ')
    return full ? s.substring(0, 19) : s.substring(0, 10)
  }
  // Handle Date objects or timestamps - avoid timezone shift
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 10)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  if (full) {
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    const secs = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`
  }
  return `${year}-${month}-${day}`
}

function relationMap(prop) {
  switch (prop) {
    case 'countryRegionId': return maps.value.countryRegion
    case 'companyId': return maps.value.company
    case 'seriesId': return maps.value.series
    case 'agensecId': return maps.value.agent
    case 'storageId': return maps.value.storage
    case 'producsecScopeId': return maps.value.scope
    default: return null
  }
}

function formatCell(row, col) {
  const val = row[col.prop]
  if (val === null || val === undefined || val === '') return '-'
  if (col.isDate) return formatDate(val, col.isDateTime)
  if (enumMaps[col.prop]) return enumMaps[col.prop][val] !== undefined ? enumMaps[col.prop][val] : val
  const map = relationMap(col.prop)
  if (map) return map[val] !== undefined ? map[val] : val
  return val
}

function handleResetTable() {
  queryOptions.value.page = 1
  handleGetTable()
}

function handleGetTable() {
  tableLoading.value = true
  // 构造搜索参数，去掉空值
  const params = { page: queryOptions.value.page, pageSize: queryOptions.value.pageSize }
  Object.keys(formInline.value).forEach((k) => {
    const v = formInline.value[k]
    if (v !== null && v !== undefined && v !== '') params[k] = v
  })
  if (validityDateRange.value && validityDateRange.value.length === 2) {
    params.validityStarsecDate = validityDateRange.value[0]
    params.validityEndDate = validityDateRange.value[1]
  }
  brBrandSearch(params).then((res) => {
    list.value = res.data.list
    tableOptions.value.total = res.data.total
  }).catch(() => {
    brBrandGetList(queryOptions.value).then((res) => {
      list.value = res.data.list
      tableOptions.value.total = res.data.total
    })
  }).finally(() => { tableLoading.value = false })
}

function handleSearch() {
  queryOptions.value.page = 1
  handleGetTable()
}

function handleClear() {
  formInline.value = {
    brandNo: '', applyNo: '', applyStatus: null, registerType: null,
    countryRegionId: null, companyId: null, seriesId: null, scopeType: null,
    isValid: null, agensecId: null, manager: '', brandRemarks: '',
    renewalStatus: null, transferStatus: null, storageId: null,
    firssecApplyDate: '', registrationDate: '', renewalDate: '',
  }
  validityDateRange.value = []
  handleGetTable()
}

function handlePageChange(val, type) {
  type === 1 ? (queryOptions.value.pageSize = val) : (queryOptions.value.page = val)
  handleGetTable()
}

function handleDetail(item) {
  detailRef.value.show(item, maps.value)
}

function handleEditForm(item) {
  formItem.value = item ? { ...item } : {}
  showForm.value = true
}

function handleDelete(item) {
  brBrandDel({ id: item.id }).then(() => {
    ElMessage.success('删除成功')
    handleGetTable()
  })
}

function handleColumnUpdate(cols) {
  baseColumns.value = cols
  localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(cols))
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #FFFFFF;

  .quickSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .quickSearchLeft {
      display: flex;
      align-items: center;
      gap: 10px;

      .quickLabel {
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
      }
    }

    .quickSearchRight {
      display: flex;
      gap: 10px;
    }
  }

  .filterForm {
    padding: 15px 20px 0;
    margin-bottom: 10px;
    background: #fafafa;
    border-radius: 4px;

    :deep(.el-form-item) {
      width: 100%;
    }
    :deep(.el-select) {
      width: 100% !important;
    }
  }

  .table {
    margin: 10px 0;
  }

  .brandPic {
    width: 80px;
    height: 60px;
    object-fit: contain;
    border-radius: 4px;
    vertical-align: middle;
  }
}
</style>
