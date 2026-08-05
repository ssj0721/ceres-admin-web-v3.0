<template>
  <div class="content-card" v-loading="loading">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div class="chart-total">总数：{{ chartTotal }}</div>
    </div>
    <div ref="chartEl" class="chart-container"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import * as echarts from 'echarts';

defineOptions({
  name: 'SummaryStatusPieCard'
});

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  pieData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['show-detail']);

const chartEl = shallowRef(null);
const chartInstance = shallowRef(null);
let breatheTimer = null;

const seriesName = computed(() => 'STATUS统计');

const safePieData = computed(() => (Array.isArray(props.pieData) ? props.pieData.filter((it) => it && Number(it.value || 0) !== 0) : []));

const chartTotal = computed(() => safePieData.value.reduce((sum, it) => sum + Number(it.value || 0), 0));

const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#69c0ff',
  '#ff9c6e', '#95de64', '#ff85c0', '#b37feb', '#ffd666',
  '#ff85c0', '#5cdbd3', '#85a5ff', '#ff85c0', '#ffa39e',
  '#d3adf7', '#ffbb96', '#ffe58f', '#adc6ff', '#87e8de'
];

const formatPercent = (percent) => `${Number(percent || 0).toFixed(1)}%`;

const clearBreatheTimer = () => {
  if (breatheTimer) {
    clearInterval(breatheTimer);
    breatheTimer = null;
  }
};

const isRejectedSlice = (item) => {
  if (!item) return false;
  const id = item.id !== null && item.id !== undefined ? String(item.id).toUpperCase() : '';
  const name = item.name !== null && item.name !== undefined ? String(item.name) : '';
  return id === 'REJECTED' || name.includes('否决');
};

const buildOption = (pieData) => {
  const safe = Array.isArray(pieData) ? pieData.filter((it) => it && Number(it.value || 0) !== 0) : [];
  const total = safe.reduce((sum, it) => sum + Number(it.value || 0), 0);

  const rejectedIdx = safe.findIndex((it) => isRejectedSlice(it));
  const rejectedValue = rejectedIdx >= 0 ? Number(safe[rejectedIdx].value || 0) : 0;
  const rejectedPct = total > 0 ? rejectedValue / total : 0;

  let level = '';
  if (rejectedIdx >= 0 && rejectedPct > 0.3) level = 'danger';
  else if (rejectedIdx >= 0 && rejectedPct > 0.15) level = 'warning';

  const alertColor = level === 'danger' ? '#ff4d4f' : (level === 'warning' ? '#fa8c16' : '');

  return {
    title: safe.length === 0
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
      trigger: 'item',
      formatter: (params) => {
        const percent = formatPercent(params && params.percent);
        const value = params && params.value !== undefined && params.value !== null ? params.value : 0;
        const name = params && params.name ? params.name : '';
        return `${name}: ${percent} (${value})`;
      }
    },
    legend: {
      show: true,
      orient: 'vertical',
      left: 10,
      top: 20,
      itemWidth: 14,
      itemHeight: 14,
      data: safe.map((it) => it.name)
    },
    color: colors,
    series: [
      {
        name: seriesName.value,
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {},
        label: {
          show: true,
          position: 'outside',
          formatter: function (params) {
            const idx = typeof params.dataIndex === 'number' ? params.dataIndex : -1;
            const isAlert = idx === rejectedIdx && level;
            const percentText = formatPercent(params.percent);
            if (isAlert) {
              const tag = level === 'danger' ? '危险' : '警告';
              return [
                '{tag|' + tag + '}',
                '{nameAlert|' + params.name + '}',
                '{percentAlert|' + percentText + '}'
              ].join('\n');
            }
            return ['{name|' + params.name + '}', '{percent|' + percentText + '}'].join('\n');
          },
          rich: {
            tag: {
              color: '#fff',
              fontSize: 12,
              padding: [2, 6],
              borderRadius: 10,
              backgroundColor: alertColor || '#999',
              lineHeight: 18,
              align: 'center'
            },
            name: {
              color: '#333',
              fontSize: 12,
              padding: [2, 4],
              backgroundColor: '#fff',
              borderRadius: 2,
              lineHeight: 20,
              align: 'center'
            },
            percent: {
              fontSize: 12,
              lineHeight: 20,
              align: 'center'
            },
            nameAlert: {
              color: alertColor || '#333',
              fontSize: 12,
              padding: [2, 4],
              backgroundColor: '#fff',
              borderRadius: 2,
              lineHeight: 20,
              align: 'center',
              fontWeight: 'bold'
            },
            percentAlert: {
              fontSize: 12,
              lineHeight: 20,
              align: 'center',
              color: alertColor || '#333',
              fontWeight: 'bold'
            }
          },
          fontSize: 12,
          color: '#333',
          distanceToLabelLine: 5
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 20,
          smooth: false,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        data: safe.map((it, idx) => {
          const isAlert = idx === rejectedIdx && level;
          if (!isAlert) return it;

          return {
            ...it,
            itemStyle: {
              borderWidth: 2,
              borderColor: alertColor,
              shadowColor: alertColor,
              shadowBlur: 18
            }
          };
        })
      }
    ]
  };
};

const handleChartClick = (params) => {
  const id = params && params.data ? params.data.id : undefined;
  const hasId = id !== null && id !== undefined;
  const value = hasId ? id : (params ? params.name : '');
  const name = params && params.name ? String(params.name) : '';
  const title = `款明细 - ${name}`;

  emit('show-detail', {
    dimension: 'STATUS',
    value,
    name,
    title
  });
};

const render = (replayAnimation = false) => {
  if (!chartInstance.value) return;
  clearBreatheTimer();

  const option = buildOption(props.pieData);
  if (replayAnimation) {
    chartInstance.value.clear();
  }
  chartInstance.value.setOption(option, replayAnimation);
  chartInstance.value.off('click');
  chartInstance.value.on('click', handleChartClick);

  const safe = Array.isArray(props.pieData) ? props.pieData.filter((it) => it && Number(it.value || 0) !== 0) : [];
  const total = safe.reduce((sum, it) => sum + Number(it.value || 0), 0);
  const idx = safe.findIndex((it) => isRejectedSlice(it));
  const rejectedValue = idx >= 0 ? Number(safe[idx].value || 0) : 0;
  const pct = total > 0 ? rejectedValue / total : 0;
  const level = pct > 0.3 ? 'danger' : (pct > 0.15 ? 'warning' : '');

  if (idx >= 0 && level) {
    const alertColor = level === 'danger' ? '#ff4d4f' : '#fa8c16';
    let strong = false;
    breatheTimer = setInterval(() => {
      if (!chartInstance.value) return;
      strong = !strong;
      chartInstance.value.setOption({
        series: [
          {
            data: safe.map((it, i) => {
              if (i !== idx) return it;
              return {
                ...it,
                itemStyle: {
                  borderWidth: 2,
                  borderColor: alertColor,
                  shadowColor: alertColor,
                  shadowBlur: strong ? 30 : 12,
                  opacity: strong ? 1 : 0.9
                }
              };
            })
          }
        ]
      }, { notMerge: false, lazyUpdate: true });
    }, 800);
  }
};

const handleResize = () => {
  if (chartInstance.value) chartInstance.value.resize();
};

onMounted(async () => {
  await nextTick();
  if (!chartEl.value) return;

  chartInstance.value = echarts.init(chartEl.value);
  render();
  window.addEventListener('resize', handleResize);
});

watch(
  () => props.active,
  async (active) => {
    if (!active || !chartInstance.value) return;
    await nextTick();
    chartInstance.value.resize();
    render(true);
  }
);

watch(
  () => JSON.stringify(props.pieData || []),
  () => {
    render();
  },
  { deep: false }
);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  clearBreatheTimer();
  if (chartInstance.value) {
    chartInstance.value.off('click');
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});
</script>

<style lang="scss" scoped>
.content-card {
  flex: 1;
  background: #fff;
  border: 1px solid rgb(189, 189, 189);
  border-radius: 4px;
  min-height: 36px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.chart-container {
  height: 400px;
  width: 100%;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  min-width: 0;
}

.chart-total {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}
</style>
