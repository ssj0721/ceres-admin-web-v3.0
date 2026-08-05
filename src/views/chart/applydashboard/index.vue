<template>
  <div class="statistical-center">
    <div class="bg">
      <div class="filter-area">
        <avue-form
          ref="filterForm"
          v-model="filters"
          :option="filterFormOption"
        />
      </div>

      <el-tabs v-model="activeState" class="tabs">
        <el-tab-pane
          v-for="t in tabs"
          :key="t.value"
          :label="t.label"
          :name="t.value"
        />
      </el-tabs>

      <summary-status-pie
        v-show="activeState === SUMMARY_STATE"
        :active="activeState === SUMMARY_STATE"
        :filters="filters"
        @show-detail="handleShowDetail"
      />

      <style-status-dashboard-board
        v-show="activeState !== SUMMARY_STATE"
        :active="activeState !== SUMMARY_STATE"
        :state="activeState"
        :dimensions="activeDimensions"
        :filters="filters"
        @show-detail="handleShowDetail"
      />

      <el-dialog
        :title="detailDialogTitle"
        v-model="detailDialogVisible"
        width="80%"
      >
        <avue-crud
          ref="detailCrud"
          v-model="detailCrudTable"
          :option="detailCrudOption"
          :data="detailTableData"
          :page="detailPage"
          :table-loading="detailLoading"
          @current-change="detailCrudCurrentChange"
          @size-change="detailCrudSizeChange"
          @selection-change="detailSelectionChange"
        >
        </avue-crud>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { exportStyleStatusItemList, queryPlanSaleList, queryStyleStatusItemList } from './api.js';
import StyleStatusDashboardBoard from './components/StyleStatusDashboardBoard.vue';
import SummaryStatusPie from './components/SummaryStatusPie.vue';
import { createStyleStatusDetailCrudOption, createStyleStatusFilterFormOption, getDefaultStyleStatusFilters } from './option.js';

defineOptions({
  name: 'ApplyDashboard'
});

const SUMMARY_STATE = 'SUMMARY';
const tabs = ref([
  { label: '汇总', value: SUMMARY_STATE },
  { label: '已入货期', value: 'IN' },
  { label: '未入货期', value: 'OUT' }
]);
const activeState = ref(SUMMARY_STATE);

const embedMode = ref(false);
const parentOrigin = ref('');

const postToParent = (message) => {
  if (!embedMode.value) return;
  if (!window || window.parent === window) return;
  if (!parentOrigin.value) return;

  window.parent.postMessage(message, parentOrigin.value);
};

const reportHeight = () => {
  if (!embedMode.value) return;
  const height = Math.max(
    document.documentElement ? document.documentElement.scrollHeight : 0,
    document.body ? document.body.scrollHeight : 0
  );

  postToParent({
    type: 'B_HEIGHT',
    payload: { height }
  });
};

const filters = ref(getDefaultStyleStatusFilters());
const filterFormOption = ref(createStyleStatusFilterFormOption());

const loadPlanSaleOptions = async () => {
  try {
    const resp = await queryPlanSaleList();
    const list = (Array.isArray(resp)) ? resp : [];

    const columns = filterFormOption.value && Array.isArray(filterFormOption.value.column) ? filterFormOption.value.column : [];
    const target = columns.find((c) => c && c.prop === 'planSaleDate');
    if (target) {
      target.dicData = list;
    }
  } catch (_) {
    // ignore
  }
};

const handleMessageFromParent = (event) => {
  if (!embedMode.value) return;
  if (!event || !event.data) return;

  if (parentOrigin.value && event.origin !== parentOrigin.value) return;

  const msg = event.data || {};
  if (!msg.type) return;

  if (msg.type === 'A_INIT') {
    const payload = msg.payload || {};
    const f = payload.filters || {};
    if (Array.isArray(f.dateRange)) filters.value.dateRange = [...f.dateRange];
    if (Array.isArray(f.orgid)) filters.value.orgid = [...f.orgid];
    if (Array.isArray(f.planSaleDate)) filters.value.planSaleDate = [...f.planSaleDate];

    reportHeight();
    return;
  }

  if (msg.type === 'A_REQUEST_HEIGHT') {
    reportHeight();
  }
};

const mapSummaryToTab = (payload) => {
  const rawValue = payload && payload.value !== undefined && payload.value !== null ? String(payload.value) : '';

  if (rawValue === 'IN' || rawValue === 'OUT') return rawValue;
  return '';
};

let ro;

onMounted(() => {
  const search = window && window.location ? window.location.search : '';
  embedMode.value = /(^|[?&])embed=1(&|$)/.test(search);

  if (!embedMode.value) return;

  const url = new URL(window.location.href);
  const qOrigin = url.searchParams.get('parentOrigin');
  if (qOrigin) {
    parentOrigin.value = qOrigin;
  } else if (document && document.referrer) {
    try {
      parentOrigin.value = new URL(document.referrer).origin;
    } catch (_) {
      parentOrigin.value = '';
    }
  }

  if (!parentOrigin.value) return;

  window.addEventListener('message', handleMessageFromParent);
  postToParent({ type: 'B_READY' });

  ro = new ResizeObserver(() => {
    reportHeight();
  });
  if (document && document.body) ro.observe(document.body);

  reportHeight();
});

onMounted(() => {
  loadPlanSaleOptions();
});

const detailDialogVisible = ref(false);
const detailLoading = ref(false);
const detailDialogTitle = ref('款明细');
const detailTableData = ref([]);
const detailSelection = ref([]);
const detailCrudTable = ref({});
const detailCrudOption = ref(createStyleStatusDetailCrudOption());
const detailCrud = ref(null);
const detailPage = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100, 200, 500]
});

const detailFilter = reactive({
  dimension: '',
  value: '',
  pvalue: ''
});

const queryDetailList = async () => {
  detailLoading.value = true;
  try {
    const params = {
      pageSize: detailPage.pageSize,
      page: detailPage.currentPage,
      state: activeState.value,
      dimension: detailFilter.dimension,
      value: detailFilter.value
    };

    if (detailFilter.pvalue !== '' && detailFilter.pvalue !== undefined && detailFilter.pvalue !== null) {
      params.pvalue = detailFilter.pvalue;
    }

    const f = filters.value || {};
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

    const resp = await queryStyleStatusItemList(params);
    const data = resp && resp.data ? resp.data : resp;
    if (data && data.code === 0 && data.result) {
      detailTableData.value = data.result.tableData || [];
      detailPage.total = data.result.total || 0;
    } else {
      detailTableData.value = [];
      detailPage.total = 0;
    }
  } finally {
    detailLoading.value = false;
  }
};

const handleShowDetail = (payload) => {
  if (activeState.value === SUMMARY_STATE) {
    const next = mapSummaryToTab(payload);
    if (next) {
      activeState.value = next;
      return;
    }
  }

  detailFilter.dimension = payload && payload.dimension ? payload.dimension : '';
  detailFilter.value = payload && payload.value !== undefined ? payload.value : '';
  detailFilter.pvalue = payload && payload.pvalue !== undefined ? payload.pvalue : '';
  detailDialogTitle.value = payload && payload.title ? payload.title : '款明细';
  detailDialogVisible.value = true;
  detailPage.currentPage = 1;
  detailSelection.value = [];
  queryDetailList();
};

const detailSelectionChange = (list) => {
  detailSelection.value = Array.isArray(list) ? list : [];
};

const detailCrudCurrentChange = (val) => {
  detailPage.currentPage = val;
  queryDetailList();
};

const detailCrudSizeChange = (val) => {
  detailPage.currentPage = 1;
  detailPage.pageSize = val;
  queryDetailList();
};

const handleExport = async () => {
  ElMessage.success('正在导出...');
  const params = {
    state: activeState.value,
    dimension: detailFilter.dimension,
    value: detailFilter.value,
    page: detailPage.currentPage,
    pageSize: detailPage.pageSize
  };

  const f = filters.value || {};
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

  const selectedIds = (detailSelection.value || [])
    .map((it) => (it ? it.id : undefined))
    .filter((id) => id !== undefined && id !== null && id !== '');

  if (selectedIds.length) {
    params.ids = Array.from(new Set(selectedIds));
  }

  const resp = await exportStyleStatusItemList(params);
  const data = resp && resp.data ? resp.data : resp;
  const base64 = data && data.result ? data.result.base64 : undefined;
  if (!base64) return;

  const apiFileName = data && data.result ? data.result.fileName : '';
  const fallbackName = `${detailDialogTitle.value || '款明细'}_${new Date().toISOString().slice(0, 10)}`;
  const fileName = apiFileName || fallbackName;

  const link = document.createElement('a');
  link.href = base64;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const EXPORT_BTN_ID = 'style-status-export-btn';

const removeInjectedExportButton = () => {
  const btn = document.getElementById(EXPORT_BTN_ID);
  if (btn && btn.parentNode) {
    btn.parentNode.removeChild(btn);
  }
};

const injectExportButton = async () => {
  await nextTick();
  removeInjectedExportButton();

  const root = detailCrud.value && detailCrud.value.$el ? detailCrud.value.$el : null;
  if (!root) return;

  const tip = root.querySelector('.avue-crud__tip');
  if (!tip) return;

  const btn = document.createElement('button');
  btn.id = EXPORT_BTN_ID;
  btn.type = 'button';
  btn.className = 'el-button el-button--primary el-button--small';
  btn.style.marginLeft = '8px';
  btn.innerText = '导出Excel';
  btn.addEventListener('click', handleExport);

  tip.appendChild(btn);
};

watch(
  () => detailDialogVisible.value,
  (visible) => {
    if (visible) {
      injectExportButton();
    } else {
      removeInjectedExportButton();
    }
  }
);

onBeforeUnmount(() => {
  if (embedMode.value) {
    window.removeEventListener('message', handleMessageFromParent);
    if (ro) ro.disconnect();
  }
  removeInjectedExportButton();
});

const activeDimensions = computed(() => {
  if (activeState.value === SUMMARY_STATE) return [];
  if (activeState.value === 'OUT') return ['销售状态'];
  // return ['试销款/正常款/试销转正常款', '试销款-联营商', '试销款-平台', '真实上架与销售状态'];
  return ['试销款/正常款/试销转正常款', '试销款-联营商', '试销款-平台', '销售状态'];
});
</script>

<style lang="scss" scoped>
.statistical-center {
  padding: 0 10px;

  .bg {
    padding: 20px;
    background-color: white;
  }

  .filter-area {
    margin-bottom: 10px;
  }

  .tabs {
    margin-bottom: 10px;
  }
}
</style>
