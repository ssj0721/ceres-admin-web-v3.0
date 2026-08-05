<template>
  <div class="content-card" v-loading="loading">
    <div class="chart-header">
      <div class="chart-title-row">
        <div class="chart-title">{{ title }}</div>
        <el-switch
          v-model="switchValue"
          active-text="启用"
          inactive-text="关闭"
          @change="handleSwitchChange"
        />
        <el-button type="primary" size="small" @click="handleExportUpshelf">导出Excel</el-button>
      </div>
      <div class="chart-total">总数：{{ chartTotal }}</div>
    </div>
    <div ref="chartEl" class="chart-container"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { exportStyleStatusUpshelf } from '../api.js';

defineOptions({
  name: 'DimensionSunburstCard'
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
  state: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  switchValue: {
    type: Boolean,
    default: false
  },
  filters: {
    type: Object,
    default: () => ({})
  },
  pieData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['show-detail', 'switch-change']);

const switchValue = ref(false);

const handleSwitchChange = (val) => {
  emit('switch-change', { dimension: props.dimension, value: val });
};

const handleExportUpshelf = async () => {
  ElMessage.success('正在导出...');

  const params = {
    state: props.state,
    dimension: props.dimension
  };
  const f = props.filters || {};

  if (f.dateRange && f.dateRange.length === 2) {
    params.from = f.dateRange[0];
    params.to = f.dateRange[1];
  }

  if (Array.isArray(f.orgid) && f.orgid.length) {
    params.orgid = f.orgid;
  }

  if (Array.isArray(f.planSaleDate) && f.planSaleDate.length) {
    params.planSaleDate = f.planSaleDate;
  }

  const resp = await exportStyleStatusUpshelf(params);
  const data = resp && resp.data ? resp.data : resp;
  const base64 = data && data.result ? data.result.base64 : undefined;
  if (!base64) return;

  const apiFileName = data && data.result ? data.result.fileName : '';
  const fallbackName = `${props.title || '真实上架与销售状态'}_${new Date().toISOString().slice(0, 10)}`;
  const fileName = apiFileName || fallbackName;

  const link = document.createElement('a');
  link.href = base64;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const chartEl = shallowRef(null);
const chartInstance = shallowRef(null);

const seriesName = computed(() => {
  return props.dimension ? `${props.dimension}统计` : '统计';
});

const safePieData = computed(() => (Array.isArray(props.pieData) ? props.pieData.filter((it) => it && (Number(it.value || 0) !== 0 || (it.children && it.children.length))) : []));

const chartTotal = computed(() => safePieData.value.reduce((sum, it) => sum + Number(it.value || 0), 0));

const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#69c0ff',
  '#ff9c6e', '#95de64', '#ff85c0', '#b37feb', '#ffd666',
  '#ff85c0', '#5cdbd3', '#85a5ff', '#ff85c0', '#ffa39e',
  '#d3adf7', '#ffbb96', '#ffe58f', '#adc6ff', '#87e8de'
];

const buildOption = (pieData) => {
  const safe = Array.isArray(pieData) ? pieData.filter((it) => it && (Number(it.value || 0) !== 0 || (it.children && it.children.length))) : [];

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
        const value = params && params.value !== undefined && params.value !== null ? params.value : 0;
        const name = params && params.name ? params.name : '';
        // 旭日图可以通过 params.treePathInfo 获取层级路径
        let pathStr = '';
        if (params && params.treePathInfo) {
           pathStr = params.treePathInfo.map(info => info.name).filter(Boolean).join(' -> ') || name;
        } else {
           pathStr = name;
        }
        return `${pathStr}: ${value}`;
      }
    },
    color: colors,
    series: [
      {
        name: seriesName.value,
        type: 'sunburst',
        data: safe,
        radius: [0, '90%'],
        nodeClick: false,
        itemStyle: {
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#fff'
        },
        label: {
          show: true,
          formatter: '{b}\n{c}'
        }
      }
    ]
  };
};

const findClickedRelation = (clickedData, pieData) => {
  if (!clickedData || !Array.isArray(pieData)) {
    return { parentNode: null, currentNode: null };
  }

  const clickedId = clickedData.id;
  const clickedParentId = clickedData.parentid;
  const clickedName = clickedData.name;
  const clickedValue = Number(clickedData.value ?? 0);

  for (const parent of pieData) {
    const children = Array.isArray(parent && parent.children) ? parent.children : [];
    const currentNode = children.find((child) => {
      if (!child) return false;
      if (
        clickedParentId !== null &&
        clickedParentId !== undefined &&
        clickedId !== null &&
        clickedId !== undefined
      ) {
        return parent.id === clickedParentId && child.id === clickedId;
      }
      if (clickedId !== null && clickedId !== undefined && child.id === clickedId && parent.id === child.parentid) return true;
      return child.name === clickedName && Number(child.value ?? 0) === clickedValue;
    }) || null;

    if (currentNode) {
      return { parentNode: parent, currentNode };
    }
  }

  return { parentNode: null, currentNode: null };
};

const handleChartClick = (params) => {
  const clickedData = params && params.data ? params.data : null;
  const isChildNode = clickedData && (!Array.isArray(clickedData.children) || clickedData.children.length === 0);
  if (!isChildNode) return;

  const { parentNode, currentNode } = findClickedRelation(clickedData, props.pieData);

  const childId = currentNode && currentNode.id !== undefined ? currentNode.id : undefined;
  const parentId = parentNode && parentNode.id !== undefined ? parentNode.id : undefined;

  if (childId === null || childId === undefined || parentId === null || parentId === undefined) return;

  emit('show-detail', {
    dimension: props.dimension,
    value: childId,
    pvalue: parentId
  });
};

const render = () => {
  if (!chartInstance.value) return;
  const option = buildOption(props.pieData);
  chartInstance.value.setOption(option);
  chartInstance.value.off('click');
  // chartInstance.value.on('click', handleChartClick);
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
  () => props.switchValue,
  (value) => {
    switchValue.value = value;
  },
  { immediate: true }
);

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

.chart-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
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
