<template>
  <div class="board">
    <div class="grid">
      <template v-for="dim in dimensions" :key="`${state}-${dim}`">
        <dimension-sunburst-card
          v-if="isSunburstDimension(dim)"
          :title="dimTitle(dim)"
          :dimension="dim"
          :state="state"
          :loading="loadingMap[dim] || false"
          :pie-data="pieDataMap[dim] || []"
          :filters="filters"
          :switch-value="switchOutMap[dim] || false"
          @show-detail="handleShowDetail"
          @switch-change="handleSwitchChange"
        />
        <dimension-pie-card
          v-else
          :title="dimTitle(dim)"
          :dimension="dim"
          :state="state"
          :loading="loadingMap[dim] || false"
          :pie-data="pieDataMap[dim] || []"
          :filters="filters"
          @show-detail="handleShowDetail"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { queryStyleStatusDashboard, queryStyleStatusDashboardOut, queryStyleStatusDashboardUpshelf } from '../api.js';
import DimensionPieCard from './DimensionPieCard.vue';
import DimensionSunburstCard from './DimensionSunburstCard.vue';

defineOptions({
  name: 'StyleStatusDashboardBoard'
});

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  state: {
    type: String,
    required: true
  },
  dimensions: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['show-detail']);

const loadingMap = ref({});
const pieDataMap = ref({});
const cacheMap = ref({});
const switchOutMap = ref({});
const IN_MAIN_DIMS = ['试销款/正常款/试销转正常款', '试销款-联营商', '试销款-平台', '销售状态'];
const UPSHELF_DIM = '真实上架与销售状态';
const OUT_SALE_DIM = '销售状态';

const isSunburstDimension = (dim) => props.state === 'IN' && dim === UPSHELF_DIM;
const dimTitle = (dim) => {
  if (dim === OUT_SALE_DIM) return OUT_SALE_DIM;
  return `${dim}分布`;
};
const getSwitchCacheKey = () => `${cacheKey.value}_upshelf`;

const handleShowDetail = (payload) => {
  emit('show-detail', payload);
};

const handleSwitchChange = ({ dimension, value }) => {
  switchOutMap.value[dimension] = value;

  if (!value) {
    pieDataMap.value[dimension] = [];
    loadingMap.value[dimension] = false;
    return;
  }

  const switchKey = getSwitchCacheKey();
  const cached = cacheMap.value[switchKey];

  if (cached && Array.isArray(cached[dimension])) {
    pieDataMap.value[dimension] = clonePieDataList(cached[dimension]);
    loadingMap.value[dimension] = false;
    return;
  }

  loadingMap.value[dimension] = true;
  fetchSwitchData(dimension, switchKey);
};

const fetchSwitchData = async (dimension, switchKey) => {
  const requestId = ++currentSwitchRequestId;
  const requestFn = props.state === 'IN' ? queryStyleStatusDashboardUpshelf : queryStyleStatusDashboardOut;

  ensureCacheBucket(switchKey);

  try {
    await requestFn({
      ...requestParams.value,
      dimensions: [dimension]
    }, (partialMap) => {
      if (requestId !== currentSwitchRequestId) return;

      writePartialData(switchKey, partialMap);
    });
  } finally {
    if (requestId === currentSwitchRequestId) {
      loadingMap.value[dimension] = false;
    }
  }
};

const clearPieData = () => {
  pieDataMap.value = {};
};

const clearCache = () => {
  cacheMap.value = {};
};

const createLoadingMap = (dimensions) => {
  const nextLoadingMap = {};
  (Array.isArray(dimensions) ? dimensions : []).forEach((dim) => {
    nextLoadingMap[dim] = true;
  });
  return nextLoadingMap;
};

const clonePieDataMap = (map) => {
  const cloned = {};
  Object.keys(map || {}).forEach((k) => {
    const list = Array.isArray(map[k]) ? map[k] : [];
    cloned[k] = list.map((item) => (item && typeof item === 'object' ? { ...item } : item));
  });
  return cloned;
};

const clonePieDataList = (list) => {
  return (Array.isArray(list) ? list : []).map((item) => (item && typeof item === 'object' ? { ...item } : item));
};

const applyPieData = (map) => {
  pieDataMap.value = clonePieDataMap(map);
};

const getCurrentCachedData = () => {
  return cacheMap.value[cacheKey.value] || null;
};

const getMissingDimensions = (cached) => {
  return (Array.isArray(props.dimensions) ? props.dimensions : []).filter((dim) => {
    if (props.state === 'IN' && dim === UPSHELF_DIM) return false;
    return !cached || !Array.isArray(cached[dim]);
  });
};

const ensureCacheBucket = (key) => {
  if (!cacheMap.value[key]) {
    cacheMap.value[key] = {};
  }
  return cacheMap.value[key];
};

const writePartialData = (key, partialMap) => {
  const cached = ensureCacheBucket(key);
  Object.keys(partialMap || {}).forEach((dim) => {
    const list = clonePieDataList(partialMap[dim]);
    pieDataMap.value[dim] = list;
    cached[dim] = list;
    loadingMap.value[dim] = false;
  });
};

const syncDashboardData = () => {
  if (!props.active) {
    loadingMap.value = {};
    return;
  }

  const cached = getCurrentCachedData();
  if (cached) {
    applyPieData(cached);
  } else {
    clearPieData();
  }

  const missingDimensions = getMissingDimensions(cached);
  if (!missingDimensions.length) {
    loadingMap.value = {};
  } else {
    loadingMap.value = createLoadingMap(missingDimensions);
    fetchData(missingDimensions);
  }

  if (props.state === 'IN' && props.dimensions.includes(UPSHELF_DIM)) {
    if (!switchOutMap.value[UPSHELF_DIM]) {
      pieDataMap.value[UPSHELF_DIM] = [];
      loadingMap.value[UPSHELF_DIM] = false;
      return;
    }

    const switchKey = getSwitchCacheKey();
    const switchCached = cacheMap.value[switchKey];
    if (switchCached && Array.isArray(switchCached[UPSHELF_DIM])) {
      pieDataMap.value[UPSHELF_DIM] = clonePieDataList(switchCached[UPSHELF_DIM]);
      loadingMap.value[UPSHELF_DIM] = false;
      return;
    }

    loadingMap.value[UPSHELF_DIM] = true;
    fetchSwitchData(UPSHELF_DIM, switchKey);
  }
};

// 使用 computed 生成稳定的请求参数，避免引用变化导致重复请求
const requestParams = computed(() => {
  return {
    state: props.state,
    dimensions: Array.isArray(props.dimensions) ? [...props.dimensions] : [],
    ...JSON.parse(JSON.stringify(props.filters || {}))
  };
});

// 使用 computed 生成稳定的缓存 key（包含 state + dimensions + filters）
const cacheKey = computed(() => {
  return JSON.stringify(requestParams.value);
});

// 仅用于监听 filters 变化的 key，不包含 state/dimensions
const filterCacheKey = computed(() => {
  return JSON.stringify(props.filters || {});
});

let currentRequestId = 0;
let currentSwitchRequestId = 0;

const fetchDimensionGroup = async ({ dimensions, requestFn, requestId, cacheKeyValue }) => {
  if (!Array.isArray(dimensions) || !dimensions.length) return;
  try {
    await requestFn(
      {
        ...requestParams.value,
        dimensions
      },
      (partialMap) => {
        if (requestId !== currentRequestId) return;
        writePartialData(cacheKeyValue, partialMap);
      }
    );
  } finally {
    if (requestId === currentRequestId) {
      dimensions.forEach((dim) => {
        loadingMap.value[dim] = false;
      });
    }
  }
};

const fetchData = (dimensionsToFetch = []) => {
  const requestId = ++currentRequestId;
  const currentKey = cacheKey.value;
  const dims = Array.isArray(dimensionsToFetch) ? dimensionsToFetch : [];
  ensureCacheBucket(currentKey);

  if (props.state === 'IN') {
    const mainDims = dims.filter((dim) => IN_MAIN_DIMS.includes(dim));

    fetchDimensionGroup({
      dimensions: mainDims,
      requestFn: queryStyleStatusDashboard,
      requestId,
      cacheKeyValue: currentKey
    });
    return;
  }

  fetchDimensionGroup({
    dimensions: dims,
    requestFn: props.state === 'OUT' ? queryStyleStatusDashboardOut : queryStyleStatusDashboard,
    requestId,
    cacheKeyValue: currentKey
  });
};

watch(
  () => ({
    active: props.active,
    cacheKey: cacheKey.value,
    filterCacheKey: filterCacheKey.value
  }),
  (current, previous) => {
    if (previous && current.filterCacheKey !== previous.filterCacheKey) {
      clearCache();
      switchOutMap.value = {};
    }

    syncDashboardData();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
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
