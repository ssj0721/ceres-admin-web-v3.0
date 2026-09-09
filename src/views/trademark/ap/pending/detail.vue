<template>
  <div class="detail-page">
    <h1 class="page-title">商标详情</h1>

    <!-- 商标系列与类别信息 -->
    <div class="section">
      <div class="section-header"><span class="section-bar"></span>商标系列与类别信息</div>
      <div class="info-grid">
        <div class="info-row">
          <label class="info-label">商标系列：</label>
          <div class="info-value">{{ detail.seriesName || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">类别数量：</label>
          <div class="info-value">{{ detail.categories ? detail.categories.length : 0 }}</div>
        </div>
      </div>
      <div class="categoryTable">
        <el-table :data="detail.categories || []" border size="small" :header-cell-style="{ background: '#FAFAFA' }">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="categoryNo" label="类别编号" width="120" align="center" />
          <el-table-column prop="productService" label="商品/服务项目" min-width="300" show-overflow-tooltip />
        </el-table>
      </div>
    </div>

    <!-- 商标基本信息 -->
    <div class="section">
      <div class="section-header"><span class="section-bar"></span>商标基本信息</div>
      <div class="info-grid">
        <div class="info-row">
          <label class="info-label">商标申请/注册编号：</label>
          <div class="info-value">{{ detail.regNumber || detail.applyNumber || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">注册状态：</label>
          <div class="info-value">
            <el-tag :type="statusTagType" size="small">{{ statusText }}</el-tag>
          </div>
        </div>
        <div class="info-row">
          <label class="info-label">境内/境外：</label>
          <div class="info-value">{{ scopeMap[detail.applyScope] || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">所属国家/地区：</label>
          <div class="info-value">{{ detail.countryRegionName || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">商标申请/注册人：</label>
          <div class="info-value">{{ detail.registrant || detail.applyPerson || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">商标申请/注册人地址：</label>
          <div class="info-value">{{ detail.registrantAddress || detail.applyAddress || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">商标申请/注册日期：</label>
          <div class="info-value">{{ detail.regDate || detail.applyDate || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">商标：</label>
          <div class="info-value">
            <img v-if="detail.brandUrl" :src="detail.brandUrl" class="brand-img" alt="商标" />
            <span v-else>-</span>
          </div>
        </div>
        <div class="info-row">
          <label class="info-label">商标首次注册期限起始日：</label>
          <div class="info-value">{{ detail.firstRegStartDate || '-' }}</div>
        </div>
        <div class="info-row">
          <label class="info-label">最新注册期限：</label>
          <div class="info-value">
            <template v-if="detail.regStartDate && detail.regEndDate">
              {{ detail.regStartDate }} ～ {{ detail.regEndDate }}
            </template>
            <template v-else>-</template>
          </div>
        </div>
      </div>
    </div>

    <!-- 商标全生命周期单据信息 -->
    <div class="section">
      <div class="section-header"><span class="section-bar"></span>商标全生命周期单据信息</div>
      <div class="lifecycle-tabs">
        <button
          v-for="tab in lifecycleTabs"
          :key="tab.value"
          class="lifecycle-tab"
          :class="{ active: activeLifecycleTab === tab.value }"
          @click="activeLifecycleTab = tab.value"
        >{{ tab.label }}</button>
      </div>
      <div class="lifecycleTable">
        <el-table :data="lifecycleList" border size="small" :header-cell-style="{ background: '#FAFAFA' }">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="applyPerson" label="申请人" width="120" align="center" />
          <el-table-column prop="applyNumber" label="申请编号" width="160" align="center" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">{{ statusMap[scope.row.status] || '-' }}</template>
          </el-table-column>
          <el-table-column prop="applyDate" label="申请时间" width="170" align="center" />
          <el-table-column prop="confirmTime" label="确认时间" width="170" align="center">
            <template #default="scope">{{ scope.row.confirmTime || '-' }}</template>
          </el-table-column>
          <el-table-column prop="confirmPerson" label="确认人" width="120" align="center">
            <template #default="scope">{{ scope.row.confirmPerson || '-' }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lifecycle-tip">点击进入单据详情页，页面只读</div>
    </div>
  </div>
</template>

<script setup>
import { registerGetDetail } from '@/api/trademark/ap/register'
import { scopeMap, statusMap } from '../config'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeLifecycleTab = ref(0)

const lifecycleTabs = [
  { label: '商标注册', value: 0 },
  { label: '商标更正', value: 1 },
  { label: '商标转让', value: 2 },
  { label: '商标续展', value: 3 },
  { label: '异议申请', value: 4 },
  { label: '异议答辩', value: 5 },
  { label: '异议复审', value: 6 },
  { label: '驳回复审', value: 7 },
  { label: '行政诉讼', value: 8 },
  { label: '商标变更', value: 9 },
]

const detail = ref({
  seriesName: '', applyNumber: '', regNumber: '', applyScope: null,
  countryRegionName: '', applyPerson: '', applyAddress: '',
  registrant: '', registrantAddress: '', applyDate: '', regDate: '',
  firstRegStartDate: '', regStartDate: '', regEndDate: '',
  brandUrl: '', categories: [],
})

const lifecycleList = ref([])

const statusText = computed(() => {
  const map = { 0: '待提交', 1: '签批中', 2: '待确认', 3: '已确认' }
  return map[detail.value.status] || '-'
})

const statusTagType = computed(() => {
  const map = { 0: 'info', 1: 'warning', 2: '', 3: 'success' }
  return map[detail.value.status] || 'info'
})

onMounted(() => {
  if (route.query.id) loadDetail()
})

async function loadDetail() {
  try {
    const res = await registerGetDetail(route.query.id)
    if (res.data) {
      Object.assign(detail.value, res.data)
    }
  } catch (e) { console.error(e) }
}
</script>

<style lang="scss" scoped>
.detail-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  max-width: 960px;
  margin: 0 auto;

  .page-title {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #333333;
    margin: 0 0 20px 0;
  }

  .section {
    margin-bottom: 32px;

    .section-header {
      display: flex;
      align-items: center;
      background: #E8F4FD;
      padding: 10px 16px;
      margin-bottom: 20px;
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
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 24px;
  }

  .info-row {
    display: flex;
    align-items: flex-start;

    .info-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;
    }

    .info-value {
      flex: 1;
      min-width: 0;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
    }
  }

  .brand-img {
    max-width: 200px;
    max-height: 80px;
    object-fit: contain;
  }

  .categoryTable, .lifecycleTable {
    margin-top: 16px;
  }

  .lifecycle-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;

    .lifecycle-tab {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-family: 'Microsoft YaHei', sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #D9D9D9;
      background: #FFFFFF;
      color: #333333;

      &.active {
        background: #1890FF;
        color: #FFFFFF;
        border-color: #1890FF;
      }

      &:hover:not(.active) {
        color: #1890FF;
        border-color: #1890FF;
      }
    }
  }

  .lifecycle-tip {
    text-align: center;
    font-size: 13px;
    color: #999999;
    margin-top: 12px;
  }
}
</style>
