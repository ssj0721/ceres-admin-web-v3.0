<template>
  <div class="board">
    <div class="grid">
      <dimension-pie-card
        v-for="dim in dimensions"
        :key="dim"
        :title="dimTitle(dim)"
        :dimension="dim"
        :loading="loading"
        :pie-data="pieDataMap[dim] || []"
        @show-detail="handleShowDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import DimensionPieCard from './DimensionPieCard.vue';
import { queryStyleStatusDashboard } from '../api.js';

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

const loading = ref(false);
const pieDataMap = reactive({});
const cacheMap = reactive({});
const requestToken = ref(0);
const lastFilterSignature = ref('');

const dimTitle = (dim) => `${dim}分布`;

const handleShowDetail = (payload) => {
  emit('show-detail', payload);
};

const normalizeResp = (resp) => {
  if (!resp) return { code: -1 };
  if (resp.data) return resp.data;
  return resp;
};

const clearPieData = () => {
  Object.keys(pieDataMap).forEach((k) => delete pieDataMap[k]);
};

const clearCache = () => {
  Object.keys(cacheMap).forEach((k) => delete cacheMap[k]);
};

const clonePieDataMap = (map) => {
  const cloned = {};
  Object.keys(map || {}).forEach((k) => {
    const list = Array.isArray(map[k]) ? map[k] : [];
    cloned[k] = list.map((item) => (item && typeof item === 'object' ? { ...item } : item));
  });
  return cloned;
};

const applyPieData = (map) => {
  clearPieData();
  Object.keys(map || {}).forEach((k) => {
    pieDataMap[k] = Array.isArray(map[k]) ? map[k] : [];
  });
};

const buildCacheKey = () => JSON.stringify({
  state: props.state,
  dimensions: Array.isArray(props.dimensions) ? props.dimensions : [],
  filters: props.filters || {}
});

const restoreCachedData = () => {
  const cached = cacheMap[buildCacheKey()];
  if (!cached) return false;

  applyPieData(clonePieDataMap(cached));
  return true;
};

const fetchData = async () => {
  const currentKey = buildCacheKey();
  const currentToken = requestToken.value + 1;
  requestToken.value = currentToken;
  loading.value = true;
  try {
    const params = {
      state: props.state,
      dimensions: Array.isArray(props.dimensions) ? props.dimensions : [],
      ...(props.filters || {})
    };

    const raw = await queryStyleStatusDashboard(params);
    if (currentToken !== requestToken.value) return;

    const data = normalizeResp(raw);
    if (data && data.code === 0 && data.result && data.result.pieDataMap) {
      const map = data.result.pieDataMap || {};
      cacheMap[currentKey] = clonePieDataMap(map);
      applyPieData(map);
    } else {
      delete cacheMap[currentKey];
      clearPieData();
    }
  } finally {
    if (currentToken === requestToken.value) {
      loading.value = false;
    }
  }
};

watch(
  () => [props.active, props.state, JSON.stringify(props.dimensions || []), JSON.stringify(props.filters || {})],
  ([active, , , filterSignature]) => {
    if (filterSignature !== lastFilterSignature.value) {
      lastFilterSignature.value = filterSignature;
      requestToken.value += 1;
      clearCache();
      clearPieData();
    }

    if (!active) {
      loading.value = false;
      return;
    }

    if (restoreCachedData()) return;
    fetchData();
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
