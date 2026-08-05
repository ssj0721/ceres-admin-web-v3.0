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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import StyleStatusDashboardBoard from './components/StyleStatusDashboardBoard.vue';
import SummaryStatusPie from './components/SummaryStatusPie.vue';
import { createStyleStatusDetailCrudOption, createStyleStatusFilterFormOption, getDefaultStyleStatusFilters } from './option.js';
import { exportStyleStatusItemList, queryStyleStatusItemList, queryStyleStatusTabs } from './api.js';

defineOptions({
  name: 'StyleStatusDashboard'
});

const SUMMARY_STATE = 'SUMMARY';
const tabs = ref([]);
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

const filterForm = ref(null);
const filterFormOption = ref(createStyleStatusFilterFormOption());

const handleMessageFromParent = (event) => {
  if (!embedMode.value) return;
  if (!event || !event.data) return;

  // 安全校验 - 只接受来自 parentOrigin 的消息
  if (parentOrigin.value && event.origin !== parentOrigin.value) return;

  const msg = event.data || {};
  if (!msg.type) return;

  if (msg.type === 'A_INIT') {
    const payload = msg.payload || {};

    // 接收初始过滤条件（会触发组件 watch -> 自动刷新）
    const f = payload.filters || {};
    if (Array.isArray(f.dateRange)) filters.value.dateRange = f.dateRange;

    reportHeight();
    return;
  }

  if (msg.type === 'A_REQUEST_HEIGHT') {
    reportHeight();
  }
};

let ro;

onMounted(() => {
  // 识别被嵌入模式（由 A 系统 iframeSrc 拼接 embed=1）
  const search = window && window.location ? window.location.search : '';
  console.log("onMounted", window, window.location, window.location.search)
  embedMode.value = /(^|[?&])embed=1(&|$)/.test(search);

  if (!embedMode.value) return;

  // 建议由 A 系统在 query 里传入 parentOrigin；若没有则退化为 document.referrer 提取
  console.log("url", window.location.href)
  const url = new URL(window.location.href);
  console.log("searchParams", url.searchParams)
  const qOrigin = url.searchParams.get('parentOrigin');
  if (qOrigin) {
    parentOrigin.value = qOrigin;
  } else if (document && document.referrer) {
    console.log("document.referrer", document.referrer)
    try {
      parentOrigin.value = new URL(document.referrer).origin;
    } catch (_) {
      parentOrigin.value = '';
    }
  }

  // 没有拿到 parentOrigin 时，禁用通信（避免使用 '*')
  if (!parentOrigin.value) return;

  window.addEventListener('message', handleMessageFromParent);

  // 通知父页面 B 已就绪
  postToParent({ type: 'B_READY' });

  // 自动监听高度变化并上报
  ro = new ResizeObserver(() => {
    reportHeight();
  });
  if (document && document.body) ro.observe(document.body);

  // 初次上报一次高度
  reportHeight();
});

const loadTabs = async () => {
  try {
    const resp = await queryStyleStatusTabs();
    const data = resp && resp.data ? resp.data : resp;
    const list = (data && data.code === 0 && Array.isArray(data.result)) ? data.result : [];
    tabs.value = list;

    if (!activeState.value) {
      const first = list.find((it) => it && it.value && it.value !== SUMMARY_STATE) || list[0];
      activeState.value = first && first.value ? first.value : SUMMARY_STATE;
    }
  } catch (e) {
    
  }
};

onMounted(() => {
  loadTabs();
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
  value: ''
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

    const f = filters.value || {};
    if (f.dateRange && f.dateRange.length === 2) {
      params.from = f.dateRange[0];
      params.to = f.dateRange[1];
    }

    if (Array.isArray(f.orgid) && f.orgid.length) {
      params.orgid = f.orgid;
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
    const next = payload && payload.value ? String(payload.value) : '';
    if (next) {
      activeState.value = next;
      return;
    }
  }

  detailFilter.dimension = payload && payload.dimension ? payload.dimension : '';
  detailFilter.value = payload && payload.value !== undefined ? payload.value : '';
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
  const fileName = `${detailDialogTitle.value || '款明细'}_${new Date().toISOString().slice(0, 10)}` || apiFileName;

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
  if (activeState.value === 'REJECTED') return ['联营商', '大类', '平台', '否决原因'];
  return ['联营商', '大类', '平台'];
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
