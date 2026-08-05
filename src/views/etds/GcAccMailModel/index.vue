<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { licZcChahuoFormOption, licZcChahuoTableOption } from './option';
import { getGcAcceptMailModelList, saveGcAcceptMailModelList } from '@/api/etds'
import * as XLSX from 'xlsx';

// 表单数据
const form = ref({
  sdate: '',
  edate: '',
  Lic_mailmodelid: '',
  mailCompany: '',
});

// 表格数据
const tableData = ref([]);
const tableLoading = ref(false);
const total = ref(0);

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 5,
});

// 选中的行
const selectedRows = ref([]);

// 配置项
const formOption = licZcChahuoFormOption;
const tableOption = licZcChahuoTableOption;

// 配置中心
const updateConfig = {
  // Excel列名到数据字段的映射
  fieldMapping: {
    '收办日期': 'acceptdate',
    '收办件数': 'acceptNum',
    '备注': 'remarks',
    '快递单号/系统单号': 'Lic_mailmodelid',
    '款号': 'style_no',
    '联营类型': 'lic_type',
    '色号': 'color_name',
    '尺码': 'size',
    '件数': 'num',
    '寄办日期': 'maildate',
    '收货地点': 'mailAddress',
    '预计收货日期': 'deliverydate',
    '相同款型款号': 'same_no',
    '条码号': 'barcode',
    '快递公司': 'mailCompany'
  },
  // 复合匹配字段（映射后的字段名）
  compositeKeys: ['Lic_mailmodelid', 'style_no', 'lic_type'],
  // 需要更新的字段（映射后的字段名）
  updateFields: ['acceptdate', 'acceptNum', 'remarks']
};

const dialogVisible = ref(false);

const editingIndex = ref(-1);

const dialogForm = ref({
  acceptdate: '',
  acceptNum: 0,
  remarks: '',
});

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 处理查询
const handleSearch = () => {
  tableLoading.value = true;
  fn_getdata();
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
const fn_getdata = async () => {
  tableLoading.value = true;

  // 处理供应商款号参数
  let sid = form.value.Lic_mailmodelid
    .replace(/ /g, ',')
    .replace(/\r\n/g, ',')
    .replace(/，/g, ',')
    .replace(/；/g, ',')
    .replace(/;/g, ',');
  sid = `('${sid.replace(/,/g, "','")}')`;
  let scp = form.value.mailCompany
    .replace(/ /g, ',')
    .replace(/\r\n/g, ',')
    .replace(/，/g, ',')
    .replace(/；/g, ',')
    .replace(/;/g, ',')
  scp = `('${scp.replace(/,/g, '\',\'')}')`;

  const params = {
    sdate: form.value.sdate,
    edate: form.value.edate,
    Lic_mailmodelid: form.value.Lic_mailmodelid,
    sid: sid,
    mailCompany: form.value.mailCompany,
    scp: scp,
  };

  const res = await getGcAcceptMailModelList(params);
  if (res.data) {
    tableData.value = res.data || [];
    total.value = tableData.value.length;
    // 重置分页到第一页
    pagination.value.current = 1;
    tableLoading.value = false;
  } else {
    tableData.value = [];
    total.value = 0;
    tableLoading.value = false;
    tableData.value = [];
    total.value = 0;
    ElMessage.error('获取数据失败');
  }

  tableLoading.value = false;
}

const exportExcel = () => {
  if (selectedRows.value === null || selectedRows.value.length === 0) {
    ElMessage.error('没有勾选联营寄办资料,不能导出excel');
    return;
  }
  const data = selectedRows.value.map(item => ({
    '收办日期': item.acceptdate,
    '收办件数': item.acceptNum,
    '备注': item.remarks,
    '快递单号/系统单号': item.Lic_mailmodelid,
    '款号': item.style_no,
    '联营类型': item.lic_type,
    '色号': item.color_name,
    '尺码': item.size,
    '件数': item.num,
    '寄办日期': item.maildate,
    '收货地点': item.mailAddress,
    '预计收货日期': item.deliverydate,
    '相同款型款号': item.same_no,
    '条码号': item.barcode,
    '快递公司': item.mailCompany
  }));

  // 1. 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3. 定义需要固定格式的日期字段
  const dateFields = ['收办日期', '寄办日期', '预计收货日期'];

  // 4. 获取表头行，确定日期列的索引
  const header = Object.keys(data[0]);
  const dateColIndices = dateFields.map(field => header.indexOf(field));

  // 5. 遍历所有行，设置日期列的格式
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    dateColIndices.forEach(colIdx => {
      if (colIdx === -1) return; // 跳过不存在的字段
      const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colIdx });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.z = 'yyyy-mm-dd'; // 设置日期格式
      }
    });
  }

  // 6. 创建工作簿并导出
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 7. 生成文件并下载 联营收办资料(yyyy-mm-dd).xlsx
  XLSX.writeFile(workbook, `联营收办资料(${formatDate(new Date())}).xlsx`, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true // 启用样式支持
  });
}

const importExcel = () => {
  if (tableData.value === null || tableData.value.length === 0) {
    ElMessage.error('联营收办资料并未查询出来,请先按查询按钮');
    return;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
      this.$util.showError('上传格式不正确，请上传xls或者xlsx格式');
      return false;
    }
    tableLoading.value = true;
    try {
      // 读取Excel数据
      const workbook = await readExcelFile(file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawUpdates = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      // 转换字段名
      const updates = rawUpdates.map(record =>
        translateFieldNames(record, updateConfig.fieldMapping)
      );

      // 创建复合键索引
      const dataMap = createCompositeMap(
        tableData.value,
        updateConfig.compositeKeys
      );

      updates.forEach((update, index) => {
        // 生成复合键（使用映射后的字段名）
        const compositeKey = generateCompositeKey(
          update,
          updateConfig.compositeKeys
        );

        // if (!compositeKey) {
        //   throw new Error(`第${index + 2}行：缺少匹配字段`);
        // }

        const target = dataMap.get(compositeKey);
        // if (!target) {
        //   throw new Error(`第${index + 2}行：找不到匹配记录`);
        // }
        if (target) {
          applyUpdates(target, update);
        }
      });

      tableLoading.value = false;
    } catch (e) {
      ElMessage.error('上传失败，请检查文件内容');
      tableLoading.value = false;
    }
  };

  input.click();
}

// 字段名转换器
const translateFieldNames = (rawRecord, mapping) => {
  return Object.keys(rawRecord).reduce((acc, excelField) => {
    const dataField = mapping[excelField];
    if (dataField) {
      acc[dataField] = rawRecord[excelField];
    } else {
      console.warn(`发现未映射字段: "${excelField}"`);
    }
    return acc;
  }, {});
};

// 创建复合键映射表
const createCompositeMap = (dataArray, keyFields) => {
  return new Map(
    dataArray.map(item => {
      const key = generateCompositeKey(item, keyFields);
      return [key, item];
    })
  );
};

// 生成复合键（带验证）
const generateCompositeKey = (item, keyFields) => {
  if (!keyFields.every(field =>
    field in item &&
    item[field] !== undefined &&
    item[field] !== null
  )) {
    return null;
  }
  return keyFields
    .map(field => String(item[field]).trim())
    .join('|#|');
};

// 异步读取Excel文件
const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// 应用更新（带类型转换）
const applyUpdates = (target, update) => {
  // let index = 0; 
  for (const field of updateConfig.updateFields) {
    if (field in update) {
      // 添加类型转换示例
      const newValue = update[field];
      if (field === 'acceptdate') { console.log(newValue); }

      // 检查acceptdate是否为日期格式
      // if (field === 'acceptdate' && !/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
      //   // ElMessage.error(`第${index + 2}行：${field}格式不正确`);
      //   continue;
      // }

      if (target[field] !== newValue) {
        target[field] = newValue;
      }
    }
  }
  // index++;
};

const handleSave = async () => {
  // 过滤出acceptdate或acceptNum或remarks不为空的行，只要有一个不为空就保存
  const updates = tableData.value.filter(item => {
    return item.acceptdate || item.acceptNum || item.remarks;
  });
  if (updates.length === 0) {
    ElMessage.error('没有需要保存的数据');
    return;
  }
  const res = await ElMessageBox.confirm('确认保存吗？');
  if (res === 'confirm') {
    const res = await saveGcAcceptMailModelList({ list: updates });
    if (res.data === 1 || res.data === '1') {
      ElMessage.success('保存成功');
      // 刷新页面
      fn_getdata();
    } else {
      ElMessage.error('保存失败');
    }
  }
}

const openDialog = (row) => {
  // 填充表单数据
  dialogForm.value = {
    acceptdate: row.acceptdate,
    acceptNum: row.acceptNum,
    remarks: row.remarks,
  };
  dialogVisible.value = true;
}

const closeDialog = () => {
  dialogForm.value = {
    acceptdate: '',
    acceptNum: 0,
    remarks: '',
  };
  dialogVisible.value = false;
  editingIndex.value = -1;
}

const handleSave1 = async (row) => {
  // 检查是否有输入，只用输入其中一个就保存
  if (!row.acceptdate && !row.acceptNum && !row.remarks) {
    ElMessage.error('请至少输入一个数据');
    return;
  }
  // 检查收办件数输入的是不是数字
  if (row.acceptNum && !/^\d+$/.test(row.acceptNum)) {
    ElMessage.error('收办件数请输入数字');
    return;
  }

  // 把值更新到勾选的所有行上,然后保存
  // const updates = selectedRows.value.map(item => {
  //   return {
  //     accOid: item.accOid,
  //     dtlOid: item.dtlOid,
  //     acceptdate: dialogForm.value.acceptdate,
  //     acceptNum: dialogForm.value.acceptNum,
  //     remarks: dialogForm.value.remarks,
  //   };
  // });
  // 上面废弃 改为下面 传入row
  const updates = [
    {
      accOid: row.accOid,
      dtlOid: row.dtlOid,
      acceptdate: row.acceptdate,
      acceptNum: row.acceptNum,
      remarks: row.remarks,
    },
  ];

  const res = await saveGcAcceptMailModelList({ list: updates });
  if (res.data === 1 || res.data === '1') {
    ElMessage.success('保存成功');
    // 刷新页面
    fn_getdata();
    closeDialog();
  } else {
    ElMessage.error('保存失败');
  }
}

// 生命周期钩子
onMounted(async () => {
  // 初始化时间范围
  await fn_time();
});

const filterData = computed(() => {
  const startIndex = (pagination.value.current - 1) * pagination.value.pageSize;
  const endIndex = startIndex + pagination.value.pageSize;
  return tableData.value.slice(startIndex, endIndex);
});

</script>
<template>
  <div class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm018</div>
    <!-- 移除调试输出 {{ form }} -->
    <div class="second-main-container">
      <!-- 第一行：标题 -->
      <div class="form-header">
        <div class="button-group">
          <el-button type="primary" class="custom-button" @click="handleSearch">查询</el-button>
          <!-- <el-button type="primary" class="custom-button" @click="exportExcel">下载excel模板</el-button>
          <el-button type="primary" class="custom-button" @click="importExcel">上传excel</el-button>
          <el-button type="primary" class="custom-button" @click="handleSave">保存</el-button> -->
          <!-- <el-button type="primary" class="custom-button" @click="openDialog">编辑</el-button> -->
        </div>
      </div>

      <!-- 第二行：日期选择器 -->
      <!-- 不要随便的绑ref -->
      <div class="date-picker-row">
        <avue-form v-model="form" :option="formOption" />
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="filterData"
          :max-height="400"
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="column in tableOption.column"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :min-width="column.width"
            :sortable="column.sortable"
            :formatter="column.formatter"
          >
            <template v-if="column.prop === 'acceptdate'" #default="scope">
              <el-date-picker
                v-if="scope.$index === editingIndex"
                v-model="scope.row[column.prop]"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                :style="{ width: '100%' }"
              />
            </template>
            <template v-else-if="column.prop === 'acceptNum'" #default="scope">
              <el-input
                v-if="scope.$index === editingIndex"
                v-model="scope.row[column.prop]"
                type="number"
              />
            </template>
            <template v-else-if="column.prop === 'remarks'" #default="scope">
              <el-input
                v-if="scope.$index === editingIndex"
                v-model="scope.row[column.prop]"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140" fixed="right">
            <template #default="{ row, $index }">
              <div class="button-group">
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  primary
                  @click="editingIndex = editingIndex === $index ? -1 : $index"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="custom-button"
                  primary
                  @click="handleSave1(row)"
                >
                  保存
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

      <!-- <el-dialog
        v-model="dialogVisible"
        title="编辑"
        width="50%"
        :header="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="dialogForm" label-width="100px" :inline="true">
          <div class="date-picker-container">
            <el-form-item label="收办日期">
              <el-date-picker
                v-model="dialogForm.acceptdate"
                type="date"
                placeholder="收办日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="收办件数">
              <el-input
                v-model="dialogForm.acceptNum"
                placeholder="请输入收办件数"
                class="custom-input"
                type="number"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="dialogForm.remarks"
                placeholder="请输入备注"
                class="custom-input"
              />
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span>
            <el-button
              @click="closeDialog"
            >
              关闭
            </el-button>
            <el-button
              class="custom-button"
              type="primary"
              @click="handleSave1"
            >
              保存
            </el-button>
          </span>
        </template>
      </el-dialog> -->
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
