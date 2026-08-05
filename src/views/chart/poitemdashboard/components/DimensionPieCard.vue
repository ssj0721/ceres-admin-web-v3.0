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
  name: 'DimensionPieCard'
});

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  dimension: {
    type: String,
    default: ''
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

const seriesName = computed(() => {
  return props.dimension ? `${props.dimension}统计` : '统计';
});

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

const buildOption = (pieData) => {
  const safe = Array.isArray(pieData) ? pieData.filter((it) => it && Number(it.value || 0) !== 0) : [];
  const total = safe.reduce((sum, it) => sum + Number(it.value || 0), 0);

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
            return ['{name|' + params.name + '}', '{percent|' + formatPercent(params.percent) + '}'].join('\n');
          },
          rich: {
            name: {
              color: '#333',
              fontSize: 12,
              padding: [2, 4]
            },
            percent: {
              color: '#333',
              fontSize: 12,
              padding: [2, 4]
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
        data: safe
      }
    ]
  };
};

const handleChartClick = (params) => {
  const id = params && params.data ? params.data.id : undefined;
  const hasId = id !== null && id !== undefined;
  const value = hasId ? id : (params ? params.name : '');
  const title = `款明细 - ${params && params.name ? params.name : ''}`;

  emit('show-detail', {
    dimension: props.dimension,
    value,
    title
  });
};

const render = () => {
  if (!chartInstance.value) return;
  const option = buildOption(props.pieData);
  chartInstance.value.setOption(option);
  chartInstance.value.off('click');
  chartInstance.value.on('click', handleChartClick);
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
  () => [props.dimension, JSON.stringify(props.pieData || [])],
  () => {
    render();
  },
  { deep: false }
);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
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
