<template>
  <div class="form-page">
    <div class="page-head">
      <h1 class="page-title">商标详情</h1>
      <div class="topBtn">
        <el-button @click="handleBack">返 回</el-button>
      </div>
    </div>

    <!-- 商标基本信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('basic')">
        <span class="section-title"><span class="section-bar"></span>商标基本信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.basic }"><DArrowRight /></el-icon>
      </div>
      <div class="section-body">
      <table v-show="!collapsed.basic" class="info-table">
        <colgroup>
          <col style="width: 20%" /><col style="width: 30%" /><col style="width: 20%" /><col style="width: 30%" />
        </colgroup>
        <tr>
          <td class="info-label">商标申请/注册编号</td><td class="info-value">{{ text(detail.docNo) }}</td>
          <td class="info-label">注册状态</td><td class="info-value">{{ text(applyStatusMap[brand.applyStatus]) }}</td>
        </tr>
        <tr>
          <td class="info-label">境内/境外</td><td class="info-value">{{ text(scopeTypeMap[brand.scopeType]) }}</td>
          <td class="info-label">所属国家/地区</td><td class="info-value">{{ text(detail.countryRegionName) }}</td>
        </tr>
        <tr>
          <td class="info-label">商标申请/注册人</td><td class="info-value">{{ text(detail.person) }}</td>
          <td class="info-label">商标申请/注册人地址</td><td class="info-value">{{ text(detail.address) }}</td>
        </tr>
        <tr>
          <td class="info-label">商标申请/注册日期</td><td class="info-value">{{ text(detail.applyDate) }}</td>
          <td class="info-label">商标</td>
          <td class="info-value">
            <img v-if="brand.brandPicUrl" :src="brand.brandPicUrl" class="brand-thumb" />
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td class="info-label">商标首次注册期限起始日</td><td class="info-value">{{ text(detail.firstValidityStartDate) }}</td>
          <td class="info-label">最新注册期限</td><td class="info-value">{{ latestPeriod }}</td>
        </tr>
      </table>
      </div>
    </div>

    <!-- 商标系列与类别信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('series')">
        <span class="section-title"><span class="section-bar"></span>商标系列与类别信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.series }"><DArrowRight /></el-icon>
      </div>
      <div v-show="!collapsed.series" class="section-body">
        <table class="info-table">
          <colgroup>
            <col style="width: 20%" /><col style="width: 30%" /><col style="width: 20%" /><col style="width: 30%" />
          </colgroup>
          <tr>
            <td class="info-label">商标系列</td><td class="info-value">{{ text(detail.seriesName) }}</td>
            <td class="info-label">类别数量</td><td class="info-value">{{ categoryCount }}</td>
          </tr>
        </table>
        <table class="info-table category-table">
          <colgroup>
            <col style="width: 20%" /><col style="width: 80%" />
          </colgroup>
          <tr class="group-head">
            <td class="cat-no">类别编号</td>
            <td class="cat-scope">商品/服务项目</td>
          </tr>
          <tr v-for="(c, i) in categories" :key="i">
            <td class="cat-no">{{ c.brandCategory }}</td>
            <td class="cat-scope">{{ c.producsecScope || '-' }}</td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="2" class="empty-cell">暂无数据</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 商标全生命周期单据信息 -->
    <div class="section">
      <div class="section-header" @click="toggle('lifecycle')">
        <span class="section-title"><span class="section-bar"></span>商标全生命周期单据信息</span>
        <el-icon class="collapse-icon" :class="{ collapsed: collapsed.lifecycle }"><DArrowRight /></el-icon>
      </div>
      <div v-show="!collapsed.lifecycle" class="section-body">
        <el-tabs v-model="activeTab" type="card" class="lifecycle-tabs">
          <el-tab-pane v-for="(t, i) in lifecycleTabs" :key="i" :label="t" :name="String(i)" />
        </el-tabs>
        <el-table
          v-loading="loading"
          class="dataTable"
          :header-cell-style="headStyle"
          :cell-style="cellStyle"
          :data="lifecycleRows"
        >
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column align="center" label="申请编号" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              <el-button v-if="scope.row.applyNumber" type="primary" link @click="handleDocClick(scope.row)">{{ scope.row.applyNumber }}</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="100">
            <template #default="scope">{{ statusMap[scope.row.status] || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="申请人" min-width="140" show-overflow-tooltip>
            <template #default="scope">{{ scope.row.applyPerson || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="申请时间" width="170">
            <template #default="scope">{{ fmtDateTime(scope.row.applyTime) }}</template>
          </el-table-column>
          <el-table-column align="center" label="确认人" min-width="120">
            <template #default="scope">{{ scope.row.confirmPerson || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="确认时间" width="170">
            <template #default="scope">{{ text(scope.row.confirmTime) }}</template>
          </el-table-column>
          <template #empty><div class="empty-cell">暂无数据</div></template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { brBrandGetDetail } from '@/api/trademark/br/brBrand'
import { applyStatusMap, scopeTypeMap } from './config'
import { statusMap } from '../../ap/config'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const detail = ref({})
const collapsed = ref({ basic: false, series: false, lifecycle: false })
const activeTab = ref('0')

// 生命周期 tab：当前仅"商标注册"有数据，其余暂为空表，后续实现后再补
const lifecycleTabs = ['商标注册', '商标更正', '商标变更', '商标转让', '商标续展', '异议申请', '异议答辩', '异议复审', '驳回复审', '行政诉讼']

const headStyle = { background: '#FAFAFA', color: '#000', fontWeight: '600', height: '48px' }
const cellStyle = { height: '48px' }

const brand = computed(() => detail.value.brand || {})
const categories = computed(() => detail.value.categories || [])
const categoryCount = computed(() => categories.value.length)
const latestPeriod = computed(() => {
  const s = detail.value.latestValidityStart
  const e = detail.value.latestValidityEnd
  if (!s && !e) return '-'
  return `${s || '-'} - ${e || '-'}`
})

// 生命周期"商标注册"行：register 关联 basic（by basicId）
const lifecycleRows = computed(() => {
  if (activeTab.value !== '0') return []
  const basicMap = {}
  ;(detail.value.basics || []).forEach(b => { basicMap[b.id] = b })
  return (detail.value.registers || []).map(r => {
    const b = basicMap[r.basicId]
    return {
      basicId: r.basicId,
      applyNumber: b ? b.applyNumber : '',
      status: b ? b.status : null,
      applyPerson: b ? b.applyPerson : r.applyPerson,
      applyTime: b ? b.createTime : r.createTime,
      confirmPerson: r.registerPerson,
      confirmTime: r.registrationDate,
    }
  })
})

onMounted(() => { loadDetail() })

async function loadDetail() {
  const applyNo = route.query.applyNo
  if (!applyNo) return
  loading.value = true
  try {
    const res = await brBrandGetDetail({ applyNo })
    detail.value = res.data || {}
  } catch (e) { console.error(e) } finally { loading.value = false }
}

function toggle(key) { collapsed.value[key] = !collapsed.value[key] }

function handleBack() { router.back() }

// 申请编号点击跳转注册单据确认页（与待办列表口径一致，传 basicId）
function handleDocClick(row) {
  if (row.basicId) router.push({ name: 'RegisterConfirm', query: { id: row.basicId } })
}

function text(val) {
  if (val === null || val === undefined || val === '') return '-'
  return val
}

function fmtDateTime(val) {
  if (!val) return '-'
  if (typeof val === 'string') return val.replace('T', ' ').substring(0, 16)
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 16)
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<style lang="scss" scoped>
.form-page {
  padding: 24px 20px 40px;
  margin: 0 20px;
  background-color: #fff;

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
      margin-bottom: 20px;
    }
    .topBtn {
      display: flex;
      gap: 12px;
    }
  }

  .section {
    margin-bottom: 28px;
  }

  .section-body {
    padding: 0 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f2f8ff;
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
    .empty-cell {
      background: #FFFFFF;
      color: #999;
      text-align: center;
      padding: 24px 0;
    }

    .group-head td {
      background: #d6e8fd;
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

  .category-table {
    margin-top: 16px;
    table-layout: fixed;
    .cat-no { width: 20%; }
    .cat-scope { width: 80%; text-align: left; }
  }

  .lifecycle-tabs {
    margin-bottom: 16px;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
    :deep(.el-tabs__nav-wrap) {
      margin-bottom: 0;
    }
    :deep(.el-tabs__nav) {
      display: flex;
      width: 100%;
      border: none;
      border-radius: 0;
    }
    :deep(.el-tabs__item) {
      flex: 1 1 0;
      margin-top: 0;
      min-width: 0;
      height: 40px;
      line-height: 40px;
      padding: 0 !important;
      text-align: center;
      font-size: 14px;
      background: #FFFFFF;
      color: #333333;
      border: 1px solid #1890FF;
      border-left: none;

      &:first-child {
        border-left: 1px solid #1890FF;
      }
      &.is-active {
        background: #1890FF;
        color: #FFFFFF;
        border-color: #1890FF;
      }
    }
  }

  .dataTable {
    :deep(.el-table__header) {
      th {
        background: #FAFAFA;
        border-bottom: 1px solid #EBEEF5;
      }
    }
    :deep(.el-table__body) {
      td {
        border-bottom: 1px solid #EBEEF5;
      }
    }
    :deep(.el-table::before) {
      display: none;
    }
    .empty-cell {
      color: #999;
      padding: 24px 0;
      text-align: center;
    }
  }
}
</style>
