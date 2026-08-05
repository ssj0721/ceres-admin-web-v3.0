<template>
  <div class="summary-wrapper">
    <div class="top-action-bar">
      <el-button type="primary" size="small" @click="handleExportSummary">联营商上架状态统计报表</el-button>
    </div>
    <div class="grid">
      <summary-status-pie-card
        title="上架状态汇总分布"
        :active="active"
        :loading="loading"
        :pie-data="pieData"
        @show-detail="handleShowDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import SummaryStatusPieCard from './SummaryStatusPieCard.vue';
import { queryStyleStatusSummaryPie, queryFranchiseeState } from '../api.js';

defineOptions({
  name: 'SummaryStatusPie'
});

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  filters: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['show-detail']);

const loading = ref(false);
const pieData = ref([]);
const cacheMap = {};
const requestToken = ref(0);
const lastFilterSignature = ref('');

const cloneData = (list) => (Array.isArray(list) ? list.map((item) => (item && typeof item === 'object' ? { ...item } : item)) : []);
const clonePieData = cloneData;

const fetchData = async () => {
  const filterSignature = JSON.stringify(props.filters || {});
  const currentToken = requestToken.value + 1;
  requestToken.value = currentToken;
  loading.value = true;
  try {
    const resp = await queryStyleStatusSummaryPie(props.filters || {});
    if (currentToken !== requestToken.value) return;

    const data = resp && resp.data ? resp.data : resp;
    const nextPieData = (data && data.result && Array.isArray(data.result.pieData)) ? data.result.pieData : [];
    cacheMap[filterSignature] = clonePieData(nextPieData);
    pieData.value = clonePieData(nextPieData);
  } finally {
    if (currentToken === requestToken.value) {
      loading.value = false;
    }
  }
};

const handleShowDetail = (payload) => {
  emit('show-detail', payload);
};

const handleExportSummary = async () => {
  const barResp = await queryFranchiseeState(props.filters || {});
  const bData = barResp && barResp.data ? barResp.data : barResp;
  const nextBarData = (bData && bData.result && Array.isArray(bData.result.barData)) ? bData.result.barData : [];

  const data = cloneData(nextBarData);
  if (!Array.isArray(data) || !data.length) {
    ElMessage.warning('暂无汇总数据可导出');
    return;
  }

  const axes = [...new Set(data.map(d => d.axis).filter(Boolean))];
  const seriesNames = [...new Set(data.map(d => d.series).filter(Boolean))];

  const headers = ['联营商', ...seriesNames, '总计'];
  const rows = [headers];

  let grandTotal = 0;
  const colTotals = new Array(seriesNames.length).fill(0);

  axes.forEach((axis) => {
    const row = [axis];
    let rowTotal = 0;
    
    seriesNames.forEach((sName, idx) => {
      const item = data.find(d => d.axis === axis && d.series === sName);
      const val = item ? (Number(item.value) || 0) : 0;
      row.push(val);
      rowTotal += val;
      colTotals[idx] += val;
    });

    row.push(rowTotal);
    rows.push(row);
    grandTotal += rowTotal;
  });

  const totalRow = ['总计', ...colTotals, grandTotal];
  rows.push(totalRow);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '汇总数据');

  const fileName = `联营商上架状态统计_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

watch(
  () => [props.active, JSON.stringify(props.filters || {})],
  ([active, filterSignature]) => {
    if (filterSignature !== lastFilterSignature.value) {
      lastFilterSignature.value = filterSignature;
      requestToken.value += 1;
      Object.keys(cacheMap).forEach((key) => delete cacheMap[key]);
      pieData.value = [];
    }

    if (!active) {
      loading.value = false;
      return;
    }

    const cached = cacheMap[filterSignature];
    if (cached) {
      pieData.value = clonePieData(cached);
      return;
    }

    fetchData();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.summary-wrapper {
  .top-action-bar {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
}

.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
