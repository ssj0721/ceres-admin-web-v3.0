<template>
  <div class="content-card" v-loading="loading">
    <div class="chart-header">
      <div class="header-left">
        <div class="chart-title">{{ title }}</div>
        <el-switch v-model="hideLowRate" active-text="隐藏5%以下联营商" size="small" />
      </div>
      <div class="chart-total">总数：{{ totalCount }}</div>
    </div>
    <div ref="chartEl" class="chart-container"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch, ref } from 'vue';
import * as echarts from 'echarts';

defineOptions({
  name: 'FranchiseeRejectRateCard'
});

const props = defineProps({
  title: {
    type: String,
    default: '联营商否决率'
  },
  loading: {
    type: Boolean,
    default: false
  },
  chartData: {
    type: Array,
    default: () => []
  }
});

const chartEl = shallowRef(null);
const chartInstance = shallowRef(null);
const hideLowRate = ref(true);
let breatheTimer = null;

const defaultBarColor = '#5470c6';
const warningColor = '#fa8c16';
const dangerColor = '#ff4d4f';

const getRateLevel = (rate) => {
  const safeRate = Number(rate) || 0;
  if (safeRate >= 30) return 'danger';
  if (safeRate >= 15) return 'warning';
  return '';
};

const getLevelColor = (level) => {
  if (level === 'danger') return dangerColor;
  if (level === 'warning') return warningColor;
  return defaultBarColor;
};

const getLevelText = (level) => {
  if (level === 'danger') return '危险';
  if (level === 'warning') return '警告';
  return '';
};

const clearBreatheTimer = () => {
  if (breatheTimer) {
    clearInterval(breatheTimer);
    breatheTimer = null;
  }
};

const buildRateData = (data, strong = false) => {
  return data.map(item => {
    const total = Number(item.value) || 0;
    const reject = Number(item.count) || 0;
    const rate = total > 0 ? Number(((reject / total) * 100).toFixed(1)) : 0;
    const level = getRateLevel(rate);
    const color = getLevelColor(level);
    const alertStyle = level
      ? {
          shadowColor: color,
          shadowBlur: strong ? 28 : 12,
          opacity: strong ? 1 : 0.86,
          borderColor: color,
          borderWidth: strong ? 2 : 1
        }
      : {};

    return {
      value: rate,
      rawReject: reject,
      rawTotal: total,
      alertLevel: level,
      itemStyle: {
        color,
        ...alertStyle
      }
    };
  });
};

const filteredData = computed(() => {
  if (!hideLowRate.value) return props.chartData;
  return props.chartData.filter(item => {
    const total = Number(item.value) || 0;
    const reject = Number(item.count) || 0;
    const rate = total > 0 ? (reject / total) * 100 : 0;
    return rate >= 5;
  });
});

const totalCount = computed(() => {
  return props.chartData.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
});

const buildOption = (data) => {
  const hasData = data && data.length > 0;
  
  const names = data.map(item => item.name);
  const rates = buildRateData(data);

  return {
    title: !hasData
      ? {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: { color: '#999', fontSize: 14, fontWeight: 'normal' }
        }
      : { show: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        if (!params || !params.length) return '';
        const p = params[0];
        const item = rates[p.dataIndex];
        const levelText = getLevelText(item.alertLevel);
        const alertText = levelText ? `<br/>${levelText}: 已达到${item.alertLevel === 'danger' ? '30%' : '15%'}阈值` : '';
        return `${p.name}<br/>${p.marker}否决率: ${p.value}% (${item.rawReject}/${item.rawTotal})${alertText}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
      max: (value) => Math.max(35, Math.ceil(Number(value.max || 0) * 1.2))
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 60,
        data: rates,
        label: {
          show: true,
          position: 'top',
          formatter: (p) => {
            const level = p.data && p.data.alertLevel;
            const levelText = getLevelText(level);
            if (level === 'danger') return `{alertDanger|${levelText}}\n{rateDanger|${p.value}%}`;
            if (level === 'warning') return `{alertWarning|${levelText}}\n{rateWarning|${p.value}%}`;
            return `{rate|${p.value}%}`;
          },
          rich: {
            alertWarning: {
              color: '#fff',
              fontSize: 12,
              padding: [2, 6],
              borderRadius: 10,
              backgroundColor: warningColor,
              lineHeight: 18,
              align: 'center'
            },
            alertDanger: {
              color: '#fff',
              fontSize: 12,
              padding: [2, 6],
              borderRadius: 10,
              backgroundColor: dangerColor,
              lineHeight: 18,
              align: 'center'
            },
            rate: {
              color: '#333',
              fontSize: 12,
              lineHeight: 20,
              align: 'center',
              fontWeight: 'bold'
            },
            rateWarning: {
              color: warningColor,
              fontSize: 12,
              lineHeight: 20,
              align: 'center',
              fontWeight: 'bold'
            },
            rateDanger: {
              color: dangerColor,
              fontSize: 12,
              lineHeight: 20,
              align: 'center',
              fontWeight: 'bold'
            }
          }
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: hasData ? [
            {
              yAxis: 15,
              name: '警告线 15%',
              lineStyle: { color: warningColor, type: 'dashed', width: 2 },
              label: { formatter: '警告 15%', color: warningColor, position: 'end' }
            },
            {
              yAxis: 30,
              name: '危险线 30%',
              lineStyle: { color: dangerColor, type: 'dashed', width: 2 },
              label: { formatter: '危险 30%', color: dangerColor, position: 'end' }
            }
          ] : []
        }
      }
    ]
  };
};

const renderChart = async () => {
  await nextTick();
  if (!chartEl.value) return;
  clearBreatheTimer();

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartEl.value);
  }

  const option = buildOption(filteredData.value);
  chartInstance.value.setOption(option, true);

  const hasAlert = filteredData.value.some(item => {
    const total = Number(item.value) || 0;
    const reject = Number(item.count) || 0;
    const rate = total > 0 ? (reject / total) * 100 : 0;
    return getRateLevel(rate);
  });

  if (hasAlert) {
    let strong = false;
    breatheTimer = setInterval(() => {
      if (!chartInstance.value) return;
      strong = !strong;
      chartInstance.value.setOption({
        series: [
          {
            data: buildRateData(filteredData.value, strong)
          }
        ]
      }, { notMerge: false, lazyUpdate: true });
    }, 800);
  }
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
  clearBreatheTimer();
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

watch(
  filteredData,
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;

      .chart-title {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }
    }

    .chart-total {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  .chart-container {
    flex: 1;
    min-height: 0;
    padding: 10px;
  }
}
</style>
