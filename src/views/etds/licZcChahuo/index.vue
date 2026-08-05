<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { licZcChahuoFormOption, licZcChahuoTableOption } from './option';
import LicZcExport from './licZcExport.vue';
import {
  getLicZcReport,
  getLicZcGcReports,
  getAllShopItems,
  checkLicPoCanAudit,
  deleteLicZcReport,
} from '@/api/etds';
import { useLicZcStore } from '@/stores/licZcStore';
import report1 from './report1.vue';
import { useLicZcAuditStore } from '@/stores/licZcAuditStore';

const licZcStore = useLicZcStore();
const licZcAuditStore = useLicZcAuditStore();
// 表单数据
const form = ref({
  sdate: '',
  edate: '',
  po_no: '',
  sy_state: '0',
  issqs: '',
  post_type: '',
  userId: '',
  step: 0,
  spo: '',
});

// 表格数据
const tableData = ref([]);
const tableLoading = ref(false);
const total = ref(0);

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
});

// 选中的行
const selectedRows = ref([]);

// 配置项
const formOption = licZcChahuoFormOption;
const tableOption = licZcChahuoTableOption;

// 当前激活的 tab
const activeName = ref('0');

// 未出报告的表格配置
const unreleasedTableOption = {
  selection: true,
  page: true,
  align: 'center',
  menuAlign: 'center',
  highlightCurrentRow: true,
  column: [
    {
      prop: 'bc_pono',
      label: '款号',
      width: 130,
      sortable: true,
    },
  ],
};

// 是否为审核人员
const isAudit = ref(false);

const exportDialogVisible = ref(false);

// 预览弹窗显示状态
const previewVisible = ref(false);
// 预览数据
const reportData = ref({
  pooid: '',
  lang: 'ch',
});

// // 获取行的key
// const getRowKeys = (row) => {
//   return row.oid;
// };

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 处理查询
const handleSearch = () => {
  tableLoading.value = true;
  fn_getdata();
};

// 处理导出
const handleExport = () => {
  exportDialogVisible.value = true;
};

// 处理查看报告
function handleCheckReport (row) {
  router.push({
    path: '/etds/licHomePage',
    query: {
      bc_pono: row.bc_pono,
      id: row.oid,
      lic_type: row.lic_type,
      isGcReport: row.isGcReport ?? false,
      state: row.state,
    },
  });
}

// 处理批量送审
const handleBatchSendAudit = async () => {
  if (!selectedRows.value.length) {
    ElMessage.error('请先选择要送审的行');
    return;
  }
  // 先遍历，然后记录哪些送审成功，哪些送审失败，哪些不能送审
  const success = [];
  const fail = [];
  const notSend = [];

  try {
    // 使用Promise.all等待所有送审操作完成
    const results = await Promise.all(
      selectedRows.value.map(async (row) => {
        if (row.state === 1) {
          notSend.push(row.bc_pono);
          return;
        }
        try {
          const res = await licZcStore.handleSendAudit(row);
          if (res) {
            success.push(row.bc_pono);
          } else {
            fail.push(row.bc_pono);
          }
        } catch (error) {
          fail.push(row.bc_pono);
        }
      })
    );

    // 所有操作完成后，显示结果
    let message = '';
    if (success.length > 0) {
      message += `送审成功：${success.join('、')}\n`;
    }
    if (fail.length > 0) {
      message += `送审失败：${fail.join('、')}\n`;
    }
    if (notSend.length > 0) {
      message += `已送审不能送审：${notSend.join('、')}`;
    }

    if (message) {
      ElMessage({
        message: message,
        type: success.length > 0 && fail.length === 0 ? 'success' : 'warning',
        duration: 5000,
      });
      // 刷新数据
      fn_getdata();
    }
  } catch (error) {
    console.error('批量送审失败:', error);
    ElMessage.error('批量送审过程中发生错误');
  }
};

// 处理送审
const handleSendAudit = async (row) => {
  // 如果已送审，则不能送审
  if (row.state === 1) {
    ElMessage.error('已送审，不能重复送审');
    return;
  }
  const res = await checkLicPoCanAudit({
    bc_pono: row.bc_pono,
  });
  if (!res.data.result.Examples || res.data.result.Examples.length === 0) {
    ElMessage.error('该款号在查货系统没有资料不能送审');
    return;
  }
  licZcStore
    .handleSendAudit(row)
    .then((res) => {
      if (res) {
        ElMessage.success('送审成功');
        // 刷新数据
        fn_getdata();
      } else {
        ElMessage.error('送审失败');
      }
    })
    .catch((err) => {
      console.error('送审出错:', err);
      ElMessage.error('送审失败');
    });
};

// 处理审阅
const handleAudit = (row) => {
  // 存储审阅数据
  // console.log('row', row)
  licZcAuditStore.setAuditData(row);

  // 导航到审阅页面
  router.push({
    path: '/etds/licZcAudit',
  });
};

// 处理预览
const handlePreview = (row) => {
  reportData.value = {
    pooid: row.oid,
    lang: 'ch',
  };
  previewVisible.value = true;
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pagination.value.pageSize = val;
  // 不再调用handleSearch()，只更新分页配置
  pagination.value.current = 1; // 重置到第一页
};

// 处理页码变化
const handleCurrentChange = (val) => {
  pagination.value.current = val;
  // 不再调用handleSearch()，只更新页码
};

// 初始化搜索框的时间
function fn_time () {
  // 获取当前日期
  const now = new Date();

  // 格式化当前日期为 edate
  const edate = formatDate(now);
  if (form.value.edate === '' || form.value.edate === null) {
    form.value.edate = edate;
  }

  // 获取去年同日为 sdate
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const sdate = formatDate(lastYear);
  if (form.value.sdate === '' || form.value.sdate === null) {
    form.value.sdate = sdate;
  }
}

// 格式化日期为 YYYY-MM-DD
function formatDate (date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // 补零
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

// 定义查询数据的方法
async function fn_getdata () {
  tableLoading.value = true;

  // 从localStorage获取用户信息
  const etdsUserStr = localStorage.getItem('storage_key_etds');

  const platformUserId = localStorage.getItem('platformUserId');

  const etdsUser = etdsUserStr ? JSON.parse(etdsUserStr) : {};

  form.value.post_type = etdsUser.post_type || '';

  // 处理is_sqs参数
  let is_show = '';
  if (etdsUser.is_sqs === 1 || etdsUser.is_sqs === '1') {
    is_show = 'true';
  } else {
    is_show = 'false';
  }
  form.value.issqs = is_show;

  // 处理合同号参数
  let spo = form.value.po_no
    .replace(/ /g, ',')
    .replace(/\r\n/g, ',')
    .replace(/，/g, ',')
    .replace(/；/g, ',')
    .replace(/;/g, ',');

  spo = `('${spo.replace(/,/g, "','")}')`;
  form.value.spo = spo;
  form.value.userId = etdsUser.userId || '';
  form.value.platformUserId = platformUserId || '';

  // 调用接口获取数据
  getLicZcReport(form.value)
    .then((res) => {
      if (res.data && res.data.licZcCheckReports1SCM) {
        tableData.value = res.data.licZcCheckReports1SCM || [];
        total.value = tableData.value.length;
        fn_handleGcReports();
        // 重置分页到第一页
        pagination.value.current = 1;
      } else {
        tableData.value = [];
        total.value = 0;
      }
      tableLoading.value = false;
    })
    .catch((err) => {
      console.error('获取数据失败:', err);
      tableData.value = [];
      total.value = 0;
      tableLoading.value = false;
      ElMessage.error('获取数据失败');
    });
}

const gcCheckReportMappings = ref([]);
function fn_handleGcReports () {
  /**
   * zc_report_oid
   * zc_report_oid
   */
  // 如果工厂的oid里面有自查的oid,进行一些特殊处理，新增一个新的字段表示isGcReport
  const gcReportOids = new Set(
    gcCheckReportMappings.value.map((gc) => gc.zc_report_oid)
  );

  if (gcCheckReportMappings.value.length > 0) {
    tableData.value.forEach((item) => {
      if (gcReportOids.has(item.oid)) {
        item.isGcReport = true;
      } else {
        item.isGcReport = false;
      }
    });
  }
}
async function fn_getLicZcGcReports () {
  const res = await getLicZcGcReports();
  if (res.data) {
    gcCheckReportMappings.value = res.data;
  }
}
// 处理工厂来的报告

// 生命周期钩子
onMounted(async () => {
  // 初始化时间范围
  fn_time();

  // 获取表格数据
  await fn_getdata();
  // 获取工厂自查报告在自查这边的数据
  await fn_getLicZcGcReports();
  // 检查用户是否为审核人员
  const etdsUserStr = localStorage.getItem('storage_key_etds');
  const etdsUser = etdsUserStr ? JSON.parse(etdsUserStr) : {};
  isAudit.value = etdsUser.is_sqs === 1 || etdsUser.is_sqs === '1';
  // await fn_getUnreleasedReports()
});

// 自定义排序
const sortConfig = ref({
  prop: 'bc_date',
  order: 'descending',
});

// 处理表格排序
const handleSortChange = ({ prop, order }) => {
  sortConfig.value = { prop, order };
};

const filterData = computed(() => {
  let result = [...tableData.value];

  // 如果有排序配置，先进行排序
  if (sortConfig.value.prop && sortConfig.value.order) {
    result.sort((a, b) => {
      const aValue = a[sortConfig.value.prop];
      const bValue = b[sortConfig.value.prop];

      // 处理空值
      if (aValue === null || aValue === undefined) {
        return sortConfig.value.order === 'ascending' ? -1 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return sortConfig.value.order === 'ascending' ? 1 : -1;
      }

      // 数字类型比较
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.value.order === 'ascending'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      // boolean类型比较
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortConfig.value.order === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }
      // 字符串类型比较
      return sortConfig.value.order === 'ascending'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  // 然后进行分页
  const startIndex = (pagination.value.current - 1) * pagination.value.pageSize;
  const endIndex = startIndex + pagination.value.pageSize;
  return result.slice(startIndex, endIndex);
});

const router = useRouter();

// 处理新增
const handleAdd = () => {
  router.push({
    path: '/etds/licZcReport',
    query: {
      mode: 'add', // 添加mode参数表示是新增模式
    },
  });
};
const unreleasedTableData = ref([]);
// 获取联营商未出的报告
async function fn_getUnreleasedReports () {
  const res = await getAllShopItems({});
  if (res.data.result.Examples.licPo) {
    unreleasedTableData.value = res.data.result.Examples.licPo.map((item) => {
      return {
        bc_pono: item.po_no,
      };
    });
  }
}

// 处理删除
async function fn_deleteLicZcReport (row) {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    // 如果已经送审，则不能删除
    if (row.state === 1) {
      ElMessage.error('已送审的记录不能删除');
      return;
    }
    const res = await deleteLicZcReport({ oid: row.oid });
    if (res.data) {
      ElMessage.success('删除成功');
      fn_getdata(); // 刷新数据
    } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除出错:', error);
      ElMessage.error('删除失败');
    }
  }
}

// 处理批量删除
async function handleBatchDelete () {
  if (!selectedRows.value.length) {
    ElMessage.error('请先选择要删除的记录');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 如果已经送审，则不能删除
    const isAudit = selectedRows.value.some((row) => row.state === 1);
    if (isAudit) {
      ElMessage.error('已送审的记录不能删除');
      return;
    }

    const deletePromises = selectedRows.value.map((row) =>
      deleteLicZcReport({ oid: row.oid })
    );
    const results = await Promise.allSettled(deletePromises);

    const successCount = results.filter(
      (result) => result.status === 'fulfilled'
    ).length;
    const failCount = results.filter(
      (result) => result.status === 'rejected'
    ).length;

    if (successCount > 0) {
      ElMessage.success(`成功删除 ${successCount} 条记录`);
      if (failCount > 0) {
        ElMessage.warning(`${failCount} 条记录删除失败`);
      }
      fn_getdata(); // 刷新数据
    } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除出错:', error);
      ElMessage.error('批量删除失败');
    }
  }
}
</script>
<template>
  <div class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm015</div>
    <!-- 移除调试输出 {{ form }} -->
    <div class="second-main-container">
      <!-- 第一行：自查日期标题 -->
      <div class="form-header">
        <div class="button-group">
          <el-button type="primary" class="custom-button" @click="handleSearch">
            查询
          </el-button>
          <el-button type="primary" class="custom-button" @click="handleAdd">
            新增
          </el-button>
          <el-button
            type="primary"
            class="custom-button"
            @click="handleBatchSendAudit"
          >
            批量送审
          </el-button>
          <el-button
            type="primary"
            class="custom-button"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button type="primary" class="custom-button" @click="handleExport">
            导出自查分析报表
          </el-button>
        </div>
      </div>

      <!-- 第二行：日期选择器 -->
      <!-- 不要随便的绑ref -->
      <div class="date-picker-row">
        <avue-form v-model="form" :option="formOption" />
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <!-- 已出报告表格 -->
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="filterData"
          :max-height="400"
          :highlight-current-row="true"
          :default-sort="{ prop: 'bc_date', order: 'descending' }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="column in tableOption.column"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :min-width="column.width"
            :sortable="column.sortable ? 'custom' : false"
            :formatter="column.formatter"
            show-overflow-tooltip
          >
            <!-- 查货结果插槽 -->
            <template
              v-if="column.prop === 'ch_result' || column.prop === 'bc_result'"
              #default="{ row }"
            >
              <el-tag
                :type="
                  row.bc_result === '1' || row.bc_result === 1
                    ? 'success'
                    : 'danger'
                "
              >
                {{
                  row.bc_result === "1" || row.bc_result === 1
                    ? "接受"
                    : "不接受"
                }}
              </el-tag>
            </template>

            <!-- 处理合同号插槽 -->
            <template
              v-else-if="column.prop === 'isGcReport'"
              #default="{ row }"
            >
              <span v-if="row.isGcReport">
                <el-tag type="primary">工厂</el-tag>
              </span>
              <span v-else>
                <el-tag type="success">联营商</el-tag>
              </span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" min-width="250" fixed="right">
            <template #default="{ row }">
              <div class="button-group">
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  @click="handleCheckReport(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  @click="handleSendAudit(row)"
                >
                  送审
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  @click="handlePreview(row)"
                >
                  预览
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :disabled="row.state === 1"
                  class="custom-button"
                  @click="fn_deleteLicZcReport(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="total"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <LicZcExport v-model="exportDialogVisible" :form="form" />
    <!-- 预览弹窗 -->
    <report1 v-model="previewVisible" :preview-data="reportData" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .second-main-container {
    width: 95%;
    background: $neutral-color-1;
    display: flex;
    flex-direction: column;
    margin: $container-margin;
    padding: $container-base-padding-2 + 8;
    border-radius: $border-radius-medium;
    box-shadow: $shadow-1;
    min-height: 200px; // 设置最小高度

    // 第一行：标题样式
    .form-header {
      margin-bottom: 20px;
      .form-title {
        font-size: 16px;
        color: $primary-text-color;
        font-weight: 500;
      }
    }

    // 第三行：搜索条件样式
    .search-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;

      .search-item {
        display: flex;
        align-items: center;
        flex: 1;

        .label {
          margin-right: 10px;

          font-size: 14px;
        }

        .bottom-border-input,
        .bottom-border-select {
          flex: 1;
          :deep(.el-input__inner) {
            border: none;

            border-radius: 0;
            &:focus {
              border-bottom-color: $theme-color-1;
            }
          }
        }
      }

      .button-group {
        display: flex;
        gap: 10px;
        margin-left: auto;
      }
    }

    .table-container {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      min-height: 200px;
      :deep(.el-table) {
        flex: 1;
        // 设置表格外层容器高度自适应
        .el-table__inner-wrapper {
          height: 100%;
        }

        // 表头样式
        .el-table__header-wrapper {
          th {
            background-color: #f5f7fa;
            color: $primary-text-color;
            font-weight: 500;
            height: 40px;
            padding: 8px 0;
          }
        }

        // 表格体样式
        .el-table__body-wrapper {
          overflow-y: auto;

          .el-table__row {
            height: 40px;

            &:hover {
              background-color: #f5f7fa;
            }

            td {
              padding: 8px 0;
            }
          }
        }

        // 空数据状态下保持合适高度
        .el-table__empty-block {
          min-height: 160px;
          height: 100%;
        }
      }

      .pagination-container {
        margin-top: 16px;
        padding: 0 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 32px;
      }
    }
  }
}

// 自定义表格样式
:deep(.el-table) {
  .el-table__header-wrapper {
    th {
      background-color: $neutral-color-2;
      color: $primary-text-color;
      font-weight: bold;
    }
  }

  .el-table__row {
    &:hover {
      background-color: $neutral-color-2;
    }
  }
}
.button-group {
  display: flex;
}
</style>
