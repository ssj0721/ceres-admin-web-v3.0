<template>
  <div class="content-card" v-loading="loading">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div class="header-actions">
        <span class="chart-total">总数：{{ chartTotal }}</span>
        <el-button type="primary" size="small" @click="handleExport">导出Excel</el-button>
      </div>
    </div>
    <div ref="chartEl" class="chart-container"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

defineOptions({
  name: 'SummaryStatusBarCard'
});

const props = defineProps({
  title: {
    type: String,
    default: '联营商状态分布'
  },
  loading: {
    type: Boolean,
    default: false
  },
  barData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['show-detail']);

const chartEl = shallowRef(null);
const chartInstance = shallowRef(null);

const chartTotal = computed(() => {
  if (!Array.isArray(props.barData)) return 0;
  return props.barData.reduce((total, item) => total + (Number(item.value) || 0), 0);
});

const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#69c0ff',
  '#ff9c6e', '#95de64', '#ff85c0', '#b37feb', '#ffd666',
  '#ff85c0', '#5cdbd3', '#85a5ff', '#ff85c0', '#ffa39e',
  '#d3adf7', '#ffbb96', '#ffe58f', '#adc6ff', '#87e8de'
];

const transformData = (data) => {
  if (!Array.isArray(data)) return { xAxisData: [], series: [] };
  const xAxisData = [...new Set(data.map(d => d.axis).filter(Boolean))];
  const seriesNames = [...new Set(data.map(d => d.series).filter(Boolean))];

  const series = seriesNames.map(sName => {
    return {
      name: sName,
      data: xAxisData.map(a => {
        const item = data.find(d => d.axis === a && d.series === sName);
        return item ? (Number(item.value) || 0) : 0;
      })
    };
  });

  return { xAxisData, series };
};

const handleExport = () => {
  const { barData } = props;
  const { xAxisData, series } = transformData(barData);
  
  if (!xAxisData || !xAxisData.length) {
    ElMessage.warning('暂无数据可导出');
    return;
  }

  const headers = ['联营商', ...series.map(s => s.name), '总计'];
  const rows = [headers];

  xAxisData.forEach((franchisee, index) => {
    const row = [franchisee];
    let rowTotal = 0;
    series.forEach(s => {
      const val = Number(s.data[index]) || 0;
      row.push(val);
      rowTotal += val;
    });
    row.push(rowTotal);
    rows.push(row);
  });

  const totalRow = ['总计'];
  let grandTotal = 0;
  series.forEach(s => {
    const colTotal = (s.data || []).reduce((sum, val) => sum + (Number(val) || 0), 0);
    totalRow.push(colTotal);
    grandTotal += colTotal;
  });
  totalRow.push(grandTotal);
  rows.push(totalRow);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '交叉表数据');
  
  const fileName = `${props.title}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const buildOption = (rawData) => {
  const { xAxisData, series } = transformData(rawData);
  
  const hasData = xAxisData.length > 0 && series.length > 0;

  const totals = xAxisData.map((_, i) => {
    return series.reduce((sum, s) => sum + (Number(s.data[i]) || 0), 0);
  });

  const processedSeries = series.map(s => ({
    ...s,
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      position: 'inside',
      formatter: (params) => {
        const val = params.value;
        if (val > 0) {
          const total = totals[params.dataIndex];
          const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
          return `${val} (${percent}%)`;
        }
        return '';
      }
    }
  }));

  if (hasData) {
    processedSeries.push({
      name: '总计',
      type: 'bar',
      barGap: '-100%',
      itemStyle: { color: 'transparent' },
      tooltip: { show: false },
      data: totals,
      label: {
        show: true,
        position: 'top',
        color: '#666',
        fontWeight: 600,
        formatter: (params) => params.value > 0 ? params.value : ''
      },
      z: -1
    });
  }

  return {
    title: !hasData
      ? {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 14,
            fontWeight: 'normal'
          }
        }
      : { show: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      type: 'scroll',
      top: 0,
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    color: colors,
    series: processedSeries
  };
};

const renderChart = async () => {
  await nextTick();
  if (!chartEl.value) return;

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartEl.value);
    
    // Add click event if needed
    // chartInstance.value.on('click', (params) => {
    //   emit('show-detail', {
    //     dimension: '联营商',
    //     value: params.name,
    //     title: `${params.seriesName} - ${params.name}`
    //   });
    // });
  }

  const option = buildOption(props.barData);
  chartInstance.value.setOption(option, true);
};

const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

watch(
  () => props.barData,
  () => {
    renderChart();
  },
  { deep: true }
);

watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      chartInstance.value?.showLoading({ text: '加载中...' });
    } else {
      chartInstance.value?.hideLoading();
    }
  }
);
</script>

<style lang="scss" scoped>
.content-card {
  display: flex;
  flex-direction: column;
  height: 400px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;

    .chart-title {
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;

      .chart-total {
        font-size: 14px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  .chart-container {
    flex: 1;
    min-height: 0;
    padding: 10px;
  }
}
</style>
