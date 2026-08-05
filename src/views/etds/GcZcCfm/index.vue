<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { licZcChahuoFormOption, licZcChahuoTableOption } from "./option";
import {
  getGcZcCheckReport,
  getGcZcCheckReportCanExportLicZc,
  getGcZcCheckReportCanExportLicZc1,
  gcZcCheckReportToLicZc,
  gcZcCheckReportToLicZc1,
  gcZcCheckReportCanReject,
  gcZcCheckReportCanReject1,
  gcZcCheckReportReject,
  gcZcCheckReportAccept,
} from "@/api/etds";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();

// 表单数据
const form = ref({
  sdate: "",
  edate: "",
  po_no: "",
  sy_state: "0",
  issqs: "",
  post_type: "",
  userId: "",
  step: 0,
  spo: "",
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

// 是否为审核人员
const isAudit = ref(false);

// 添加排序配置
const sortConfig = ref({
  prop: "bc_date",
  order: "descending",
});

// 获取行的key
const getRowKeys = (row) => {
  return row.oid;
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 处理查询
const handleSearch = () => {
  tableLoading.value = true;
  fn_getdata();
};

// 处理预览
const handlePreview = (row) => {
  router.push({
    path: "/etds/GcHomePage",
    query: {
      oid: row.LIC_CheckReportsOID,
      pswOid: row.oid,
    },
  });
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

// 处理表格排序
const handleSortChange = ({ prop, order }) => {
  sortConfig.value = { prop, order };
};

// 初始化搜索框的时间
function fn_time() {
  // 获取当前日期
  const now = new Date();

  // 格式化当前日期为 edate
  const edate = formatDate(now);
  if (form.value.edate === "" || form.value.edate === null) {
    form.value.edate = edate;
  }

  // 获取去年同日为 sdate
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const sdate = formatDate(lastYear);
  if (form.value.sdate === "" || form.value.sdate === null) {
    form.value.sdate = sdate;
  }
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // 补零
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

// 定义查询数据的方法
function fn_getdata() {
  tableLoading.value = true;

  // 处理合同号参数
  let spo = form.value.po_no
    .replace(/ /g, ",")
    .replace(/\r\n/g, ",")
    .replace(/，/g, ",")
    .replace(/；/g, ",")
    .replace(/;/g, ",");

  spo = `('${spo.replace(/,/g, "','")}')`;
  const params = {
    sdate: form.value.sdate,
    edate: form.value.edate,
    po_no: form.value.po_no,
    spo: spo,
  };
  getGcZcCheckReport(params)
    .then((res) => {
      if (res.data) {
        tableData.value = res.data || [];
        total.value = tableData.value.length;
        // 重置分页到第一页
        pagination.value.current = 1;
      } else {
        tableData.value = [];
        total.value = 0;
      }
      tableLoading.value = false;
    })
    .catch((err) => {
      console.log(err);
      tableData.value = [];
      total.value = 0;
      tableLoading.value = false;
      ElMessage.error("获取数据失败");
    });
}

// 生命周期钩子
onMounted(() => {
  // 初始化时间范围
  fn_time();
  // 获取表格数据
  fn_getdata();

  // 检查用户是否为审核人员
  const etdsUserStr = localStorage.getItem("storage_key_etds");
  const etdsUser = etdsUserStr ? JSON.parse(etdsUserStr) : {};
  isAudit.value = etdsUser.is_sqs === 1 || etdsUser.is_sqs === "1";
});

// 修改 filterData computed 属性
const filterData = computed(() => {
  let result = [...tableData.value];

  // 如果有排序配置，先进行排序
  if (sortConfig.value.prop && sortConfig.value.order) {
    result.sort((a, b) => {
      let aValue = a[sortConfig.value.prop];
      let bValue = b[sortConfig.value.prop];

      // 处理特殊字段
      if (sortConfig.value.prop === "review_state/back_count") {
        // 优先比较返修次数
        aValue = a.check_revision_count || 0;
        bValue = b.check_revision_count || 0;
        if (aValue !== bValue) {
          return sortConfig.value.order === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }
        // 如果返修次数相同，比较重审状态
        aValue = a.review_state || "0";
        bValue = b.review_state || "0";
      }

      // 处理空值
      if (aValue === null || aValue === undefined) {
        return sortConfig.value.order === "ascending" ? -1 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return sortConfig.value.order === "ascending" ? 1 : -1;
      }

      // 处理日期字段
      if (
        sortConfig.value.prop === "bc_date" ||
        sortConfig.value.prop === "gc_confirm_time"
      ) {
        return sortConfig.value.order === "ascending"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // 数字类型比较
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.value.order === "ascending"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // 字符串类型比较
      return sortConfig.value.order === "ascending"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  // 然后进行分页
  const startIndex = (pagination.value.current - 1) * pagination.value.pageSize;
  const endIndex = startIndex + pagination.value.pageSize;
  return result.slice(startIndex, endIndex);
});

const handleAccept = async (row) => {
  // 检查状态为联营待定才给操作
  if (!(row.state === "0" || row.state === 0)) {
    return ElMessage.error("只有状态为联营待定，才可以同意");
  }
  const param = {
    oid: row.LIC_CheckReportsOID,
    pswOid: row.oid,
  };
  const res = await gcZcCheckReportAccept(param);
  if (res.data.msg === true || res.data.msg === "true") {
    ElMessage.success("同意成功");
    // 直接把review_state设置为2
    // row.review_state = 2;
    fn_getdata();
  } else {
    ElMessage.error("同意失败");
  }
};
// 这里表示同意以后才能进行送审 这时的送审表示复制了一份和原报告一样的报告 然后直接送审
const handleGcSendAudit = async (row) => {
  // 检查状态为联营待定才给操作
  if (!(row.state === "1" || row.state === 1)) {
    return ElMessage.error("只有状态为联营接受，才可以导入自查报告");
  }
  const param = {
    oid: row.LIC_CheckReportsOID,
    review_state: row.review_state,
    pswOid: row.oid,
    bcPoNo: row.bc_pono,
  };
  const res = await getGcZcCheckReportCanExportLicZc(param);
  if (res.data.can === "0") {
    // 不给导入
    ElMessage.error("该报告不允许导入自查");
  } else if (res.data.can === "1") {
    // 可以导入
    fn_exportLicZc(param);
  } else if (res.data.can === "2") {
    // 提示是否覆盖
    ElMessageBox.confirm("该报告已导入自查，是否覆盖？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        fn_exportLicZc(param);
      })
      .catch(() => {
        // 取消操作
      });
  }
};

const fn_exportLicZc = async (param) => {
  const res = await gcZcCheckReportToLicZc(param);
  console.log(res);
  if (res.data.msg === true || res.data.msg === "true") {
    ElMessage.success("导入成功");
    fn_getdata();
  } else if (res.data.describe) {
    ElMessage.error(res.data.describe);
  } else {
    ElMessage.error("导入失败");
  }
};

const handleReject = async (row) => {
  // 检查状态为联营待定才给操作
  if (!(row.state === "0" || row.state === 0)) {
    return ElMessage.error("只要状态为联营待定，才可以拒绝");
  }
  const param = {
    oid: row.LIC_CheckReportsOID,
    pswOid: row.oid,
    review_state: row.review_state,
  };
  console.log(param);
  const res = await gcZcCheckReportCanReject(param);
  if (res.data.can === "0") {
    ElMessage.error("该报告不允许拒绝");
  } else if (res.data.can === "1") {
    ElMessageBox.confirm("确定要拒绝该报告吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        gcZcCheckReportReject(param)
          .then(() => {
            fn_getdata();
            ElMessage.success("拒绝成功");
          })
          .catch(() => {
            ElMessage.error("拒绝失败");
          });
      })
      .catch(() => {
        // 取消操作
      });
  }
};

const fn_AllcanExportLicZc = async () => {
  // 检测是否有选择的报告
  if (selectedRows.value.length === 0) {
    ElMessage.error("请先选择要操作的报告");
    return;
  }
  const oidList = selectedRows.value.map((item) => {
    return { oid: item.LIC_CheckReportsOID };
  });

  // 发送api请求 查看是否存在不能导入或已存在数据询问是否需要覆盖的报告
  const param = {
    list: oidList,
  };
  const res = await getGcZcCheckReportCanExportLicZc1(param);
  if (res.data.errlist.length > 0) {
    // 存在不能导入 通过过滤selected.value 显示不能导入的报告
    // errlist是 [oid1,oid2]
    let errlist = res.data.errlist.map((item) => {
      return tableData.value.find(
        (item1) => item1.LIC_CheckReportsOID === item
      );
    });
    // 弹窗提示不能导入的报告 把errlist中的合同号显示在弹窗中
    ElMessageBox.confirm(
      `以下报告不能导入自查：\n${errlist
        .map((item) => item.bc_pono)
        .join(",\n")}`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        // 发送api请求 批量导入
      })
      .catch(() => {
        // 取消操作
      });
  } else if (res.data.warnlist.length > 0) {
    // 存在已存在数据 通过过滤selected.value 显示已存在数据的报告
    // warnlist是 [oid1,oid2]
    let warnlist = res.data.warnlist.map((item) => {
      return tableData.value.find(
        (item1) => item1.LIC_CheckReportsOID === item
      );
    });
    // 弹窗提示已存在数据的报告 把warnlist中的合同号显示在弹窗中
    ElMessageBox.confirm(
      `以下报告已存在数据：\n${warnlist
        .map((item) => item.bc_pono)
        .join("\n")},是否覆盖？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        fn_allExportLicZc();
      })
      .catch(() => {
        // 取消操作
      });
  } else {
    // 全部可以导入
    fn_allExportLicZc();
  }
};

const fn_allExportLicZc = async () => {
  const roleUserId = Cookies.get("roleUserId");
  // 过滤出{oid:oid}
  const oidList = selectedRows.value.map((item) => {
    return { oid: item.LIC_CheckReportsOID };
  });
  const param = {
    list: oidList,
    useroid: roleUserId,
  };
  const res = await gcZcCheckReportToLicZc1(param);
  if (res.data === true || res.data === "true") {
    ElMessage.success("导入成功");
    fn_getdata();
  }
};

const fn_AllcanRejectLicZc = async () => {
  // 检测是否有选择的报告
  if (selectedRows.value.length === 0) {
    ElMessage.error("请先选择要操作的报告");
    return;
  }
  // 过滤出{oid:oid}
  const oidList = selectedRows.value.map((item) => {
    return { oid: item.LIC_CheckReportsOID };
  });

  const param = {
    list: oidList, // [ { oid: '123' }, { oid: '456' } ]
  };

  const res = await gcZcCheckReportCanReject1(param);
  if (res.data.length > 0) {
    // 存在不能拒绝的报告
    // 弹窗提示不能拒绝的报告 把errlist中的合同号显示在弹窗中
    ElMessageBox.confirm(
      `以下报告不能拒绝：\n${res.data
        .map(
          (item) =>
            tableData.value.find(
              (item1) => item1.LIC_CheckReportsOID === item.oid
            ).bc_pono
        )
        .join(",\n")}`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        return;
      })
      .catch(() => {
        return;
      });
  } else {
    // 循环拒绝
    for (const item of oidList) {
      const param = {
        oid: item.oid,
      };
      gcZcCheckReportReject(param)
        .then(() => {})
        .catch(() => {});
    }
    ElMessage.success("批量拒绝成功");
    fn_getdata();
  }
};
</script>
<template>
  <div class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm017</div>
    <!-- 移除调试输出 {{ form }} -->
    <div class="second-main-container">
      <!-- 第一行：标题 -->
      <div class="form-header">
        <div class="button-group">
          <el-button type="primary" class="custom-button" @click="handleSearch">
            查询
          </el-button>
          <el-button
            type="primary"
            class="custom-button"
            @click="fn_AllcanExportLicZc"
          >
            批量同意
          </el-button>
          <el-button
            type="primary"
            class="custom-button"
            @click="fn_AllcanRejectLicZc"
          >
            批量拒绝
          </el-button>
        </div>
      </div>

      <!-- 第二行：日期选择器 -->
      <!-- 不要随便的绑ref -->
      <div class="date-picker-row">
        <avue-form v-model="form" :option="formOption" />
      </div>

      <!-- 第三行：搜索条件 -->
      <!-- <div class="search-row">
        <div class="search-item">
          <span class="label">合同</span>
          <el-input
            v-model="form.po_no"
            placeholder="请输入合同号(模糊查询)"
            class="bottom-border-input"
          />
        </div>
      </div> -->

      <!-- 表格区域 -->
      <div class="table-container">
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
              v-if="
                column.prop === 'ch_result' ||
                column.prop === 'state' ||
                column.prop === 'gc_result'
              "
              #default="{ row }"
            >
              <el-tag
                v-if="column.prop === 'ch_result' ? true : false"
                :type="row.ch_result === '接受' ? 'success' : 'danger'"
              >
                {{ row.ch_result }}
              </el-tag>
              <el-tag
                v-if="column.prop === 'state' ? true : false"
                :type="
                  row.state == '1'
                    ? 'success'
                    : row.state == '2'
                    ? 'danger'
                    : 'warning'
                "
              >
                {{
                  row.state == "1"
                    ? "联营接受"
                    : row.state == "2"
                    ? "联营拒绝"
                    : "联营待定"
                }}
              </el-tag>
              <el-tag
                v-if="column.prop === 'gc_result' ? true : false"
                :type="
                  row.gc_result === '0' || row.gc_result === 0
                    ? 'danger'
                    : row.gc_result === '1' ||
                      row.gc_result === 1 ||
                      row.gc_result === '2' ||
                      row.gc_result === 2
                    ? 'warning'
                    : 'success'
                "
              >
                {{
                  row.gc_result === "0" || row.gc_result === 0
                    ? "工厂未处理"
                    : row.gc_result === "1" || row.gc_result === 1
                    ? "返修"
                    : row.gc_result === "2" || row.gc_result === 2
                    ? "重审"
                    : "无需处理"
                }}
              </el-tag>
            </template>
            <template
              v-else-if="column.prop === 'review_state/back_count'"
              #default="{ row }"
            >
              <!-- 返修次数 -->
              <div v-if="row.check_revision_count > 0">
                返修次数： {{ row.check_revision_count }}
              </div>
              <!-- 重审的状态 -->
              <el-tag
                v-else-if="row.review_state"
                :type="
                  row.review_state === '1' || row.review_state === 1
                    ? 'warning'
                    : row.review_state === '2' || row.review_state === 2
                    ? 'success'
                    : row.review_state === '3' || row.review_state === 3
                    ? 'danger'
                    : 'info'
                "
              >
                {{
                  row.review_state === "1" || row.review_state === 1
                    ? "重审待确认"
                    : row.review_state === "2" || row.review_state === 2
                    ? "重审接受"
                    : row.review_state === "3" || row.review_state === 3
                    ? "重审拒绝"
                    : ""
                }}
              </el-tag>
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
                  @click="handleAccept(row)"
                >
                  同意
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  @click="handleReject(row)"
                >
                  拒绝
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
                  v-if="row.state === '1' || row.state === 1"
                  type="primary"
                  size="small"
                  class="custom-button"
                  @click="handleGcSendAudit(row)"
                >
                  导入
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
