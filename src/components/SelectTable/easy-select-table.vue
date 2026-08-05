<!--  该组件只依赖tableOption和tableData两个变量, 如果想复用该组件, 修改script最后的自定义逻辑，写你自己的逻辑 -->
<template>
  <div style="width: 100%">
    <!-- Popover组件 -->
    <!-- 该弹窗宽度已固定，高度适应内容  -->
    <el-popover
        placement="bottom-end"
        :width="600"
        :visible="popVisible"
        trigger="click"
        :popper-class="'easy-select-table-popover'+' easy-select-table-'+id"
        transition="el-zoom-in-top"
    >
      <!---------------------------------- 展示的输入框 ---------------------------------->
      <template #reference>
        <span @click="popVisible = !popVisible; testShouldRetryLoad()">
          <el-input
              :class="'easy-select-table-input'+' easy-select-table-'+id"
              v-model="selectedLabels"
              placeholder="点击选择数据"
              readonly
              style="width: 100%"
          >
          <template #suffix>
            <el-icon :class="{'el-input__icon':true, rotate:popVisible}"><arrow-down /></el-icon>
          </template>
        </el-input>
        </span>
      </template>

      <!----------------------------------- 弹窗内容  ------------------------------------->
      <el-container>
        <el-header height="auto">

          <!--  搜索栏  -->
          <el-form :model="searchFrom" v-if="tableOption?.tableTitle">
            <el-row height="auto" :gutter="10">
              <el-col :span="12" v-for="title in tableOption.tableTitle.filter(t=>t?.issearch)">
                <el-form-item :label="title.label">
                  <el-input
                      :placeholder="'请填写' + title.label + ',回车查询. eg: xx,xx,xx'"
                      v-model="searchFrom[title.prop]"
                      @keyup.enter="queryHandler()"
                      style="font-size: 12px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!--   选择控制栏    -->
          <div class="selection-controls">
            <div class="selected-count">
              <el-tag size="small" >已选中 {{ selectedRows.length }} 项</el-tag>
            </div>
            <div class="action-buttons">
              <el-button-group>
                <el-button size="small" @click="resetTable">重置</el-button>
                <el-button size="small" @click="allSelection">全选</el-button>
                <el-button size="small" @click="invertSelection">反选</el-button>
                <el-button size="small" @click="clearSelection">清空</el-button>
              </el-button-group>
            </div>
          </div>
        </el-header>

        <el-main>
          <!--  表格内容  -->
          <el-table
              v-loading="loading"
              :row-key="row => row[tableOption.rowKey]"
              :data="pagedTableData"
              @selection-change="handleSelectionChange"
              @filter-change="filterHandler"
              style="width: 100%"
              :height="308"
              ref="tableRef"
              size="small"
              empty-text="暂无数据"
          >
            <el-table-column type="selection" width="55" reserve-selection />
            <template v-if="tableOption?.tableTitle" v-for="title in tableOption.tableTitle">
              <el-table-column
                  :show-overflow-tooltip="true"
                  :property="title.prop"
                  :label="title.label"
                  :filters="title?.filter ? getPropFilters(title.prop) : undefined"
              />
            </template>
          </el-table>

        </el-main>

        <el-footer>
          <!--   分页栏  -->
          <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :pager-count="3"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              size="small" />
          <div>
            <el-button @click="popVisible=false" size="small" :icon="Close">关闭</el-button>
            <el-button @click="confirmSelection" size="small" type="primary" :icon="Check">确认</el-button>
          </div>
        </el-footer>
      </el-container>
    </el-popover>
  </div>
</template>

<script setup>
import {computed, nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch} from 'vue'
import {Check, Close} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

/* ------------------------------------此处定义变量-------------------------------------------- */
// 接受父组件的参数
const prop = defineProps({
  //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传回父组件。
  modelValue: {
    type: Array,
    default : () => []
  },
  props: {
    type: Object,
    default : () => {},
  },
});
// 组件的id,用于区分多个该组件
const id = ref(prop.props?.id ?? '')

// 声明 emits
const emits = defineEmits(['update:modelValue'])

// 数据加载中?
const loading = ref(true);

// 手动控制是否显示弹窗
const popVisible = ref(false)

// 用户选中的数据
// 当前显示在输入框中的文本
const selectedLabels = ref('')
// 实际选中的 value 值数组
const selectedValues = ref([])
// 临时保存选中的行数据
const selectedRows = ref([])

// 搜索参数
const searchFrom = ref({})

// 表格相关
const tableData = ref([])
const tableOption = ref({})
const filteredTableData = ref([...tableData.value])// 被筛选后的数据。展示的是这个
watch(tableData, (newVal, oldVal) => {
  filteredTableData.value = [...newVal]; // 原始数据更新，过滤数据也要更新
});
const tableRef = ref({}) // 表格组件的引用

// 分页相关
const currentPage = ref(1) // 当前页码
const pageSize = ref(10)   // 每页显示条目数
const total = computed(() => filteredTableData.value.length) // 总条目
const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTableData.value.slice(start, end)
})

// 存储属性对应的搜索/过滤词数组的对象
let filterProps = {}

/* ------------------------------------此处定义函数-------------------------------------------- */
// 表格多选变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 清空选择
const clearSelection = () => {
  if (!tableRef.value) return;
  tableRef.value.clearSelection();
}

// 反选
const invertSelection = () => {
  if (!tableRef.value || !filteredTableData.value.length) return;
  // 获取当前所有行的rowKey值
  const allRowKeys = filteredTableData.value.map(row => row[tableOption.value.rowKey]);
  // 获取当前已选中的rowKey值
  const selectedRowKeys = selectedRows.value.map(row => row[tableOption.value.rowKey]);
  // 计算需要反选的rowKey
  const invertedRowKeys = allRowKeys.filter(key => !selectedRowKeys.includes(key));
  // 清除当前选择
  clearSelection()
  // 设置新的选中状态
  invertedRowKeys.forEach(key => {
    const row = filteredTableData.value.find(row => row[tableOption.value.rowKey] === key);
    if (row) {
      tableRef.value.toggleRowSelection(row, true);
    }
  });
}

// 全选
const allSelection = () => {
  if (!tableRef.value || !filteredTableData.value.length) return;
  clearSelection()
  // 选中当前数据所有行
  filteredTableData.value.forEach(row => {
    tableRef.value.toggleRowSelection(row, true);
  });
}

// 页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 确认选择
const confirmSelection = () => {
  if(tableOption.value?.returnValue) {
    selectedValues.value = selectedRows.value.map(row => row[tableOption.value.returnValue])
    // 选择后展示的文本，如果没有指定showKey属性则默认展示returnValue
    selectedLabels.value = selectedRows.value.map(row => row[tableOption.value?.showKey?? "name"]).join(', ')
    emits('update:modelValue', selectedValues.value)
    popVisible.value=false
  }
}

// 重置表格
const resetTable = () => {
  if (!tableRef.value) return;
  //清空用户选择
  clearSelection()
  // 清空el表格的筛选
  tableRef.value.columns.forEach(column => {
    if (column.filteredValue) {
      column.filteredValue = [];
    }
  });
  // 清空用户搜索
  searchFrom.value = {};
  filterProps={};
  currentPage.value = 1;
  filteredTableData.value = [...tableData.value];
}

// 获得某个属性去重后的数组，用于展示筛选
const getPropFilters = (prop) => {
  return [...new Set(tableData.value.map(row => row[prop]))].map(prop => {return {text:prop, value:prop}})
}

// 处理表格自带的筛选
const filterHandler = (filter) => {
  const id = Object.keys(filter)[0]
  const prop = tableRef.value.columns.filter(col => col.id === id)[0].property
  filterProps[prop] = filter[id]
  filterData()
}

// 处理用户查询筛选
const queryHandler = () => {
  Object.keys(searchFrom.value).forEach((key) => {
    filterProps[key] = searchFrom.value[key].split(',')
  })
  filterData()
}

// 根据属性值过滤表格数据
const filterData = () => {
  //先取消全选
  clearSelection()
  // 以下过滤
  filteredTableData.value = tableData.value.filter(row => {
    return Object.keys(filterProps).every(key => {
      // 获取当前属性在row中的值
      const rowValue = String(row[key] || '').toLowerCase();
      // 获取 filter 中该属性对应的搜索词数组
      const keywords = filterProps[key];
      // 检查 rowValue 是否包含 keywords 数组中的任意一个字符串
      return Object.keys(keywords).length === 0 || keywords.some(keyword => {
        return rowValue.includes(keyword.toLowerCase());
      });
    });
  })
  // 过滤完数据之后需要重置页码
  currentPage.value = 1
}

// 以下方法检测用户的点击，当点击到popover组件外时，关闭弹窗
const isPopoverChildComponent = (element) => {
  if (element && element.classList) {
    if (element.classList.contains('easy-select-table-'+id.value) ||
    element.classList.contains('el-table-filter')) {
      return true;
    }
  }
  if (element.parentElement) {
    return isPopoverChildComponent(element.parentElement);
  }
  return false;
};

const handleGlobalClick = (event) => {
  nextTick(() => {
    if (!isPopoverChildComponent(event.target)) {
      confirmSelection()
      popVisible.value=false
    }
  });
};
const registerGlobalClick = () => {
  window.addEventListener('click', handleGlobalClick);
};
const unregisterGlobalClick = () => {
  window.removeEventListener('click', handleGlobalClick);
};

/* ----------------------------------此处自定义组件逻辑----------------------------------------- */

const loadTableData = async ()=>{
  const api = prop.props?.api
  if(api) {
    try {
      const res = (await api(prop.props?.params ?? {})).data;
      // 检查返回码
      if (res.code !== 0) {
        console.log(`%c (组件easy-select-table遇到了错误响应:${res.message}) `, 'background: #FCE4EC; color: #AD1457; padding: 2px 6px; border-radius: 4px');
      }
      tableOption.value = res.result?.tableOption || {};
      tableData.value = res.result?.tableData || [];
    } catch (err) {
      console.error("组件easy-select-table API请求错误:", err);
      ElMessage.error("加载表格数据失败，请检查网络连接");
    } finally {
      loading.value = false;
    }
  }else{
    // 未指定api时，展示示例数据
    tableOption.value = {
      returnValue: "id", // 作为返回值的属性, 指定后可以向父组件传递选中的行这个属性的数组
      rowKey: "id", // 作为el表格的rowkey的属性,必须指定
      showKey: 'id', // 作为选择后展示值的属性, 不指定默认为name
      tableTitle: [{
        issearch: true,
        prop: "id",
        label: "编号"
      },{
        issearch: true, // 该属性是否可以搜索
        filter: true, // 该属性是否可以过滤
        prop: "message",
        label: "备注"
      }]
    }
    tableData.value = [{
      id: 1,
      message: "你现在看到的是示例数据",
    },{
      id: 2,
      message: "需要指定api以使用该组件"
    }]
    loading.value = false;
  }
}

const retryLoad = async () => {
  try {
    loading.value = true;
    await loadTableData(); // 复用原有加载方法
  } finally {
    loading.value = false;
  }
};

// 一个奇怪的bug导致数据有时会加载失败，因此在用户点击时需要检查是否需要重新加载，复用时记得删除
const testShouldRetryLoad = async () => {
  if(!tableData.value.length > 0){
    await retryLoad()
  }
}
/* ------------------------------------此处定义生命周期-------------------------------------------- */
onBeforeMount(()=>{
  loadTableData();
})

onMounted(() => {
  registerGlobalClick();
});

onUnmounted(() => {
  unregisterGlobalClick();
});
</script>

<style scoped>
.selection-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(236, 245, 255); /* 浅灰色背景 */
  border-radius: 4px; /* 圆角 */
  padding: 8px 12px; /* 调整内边距 */

  .action-buttons {
    display: flex;
    gap: 8px; /* 按钮间距 */
  }
}
</style>
<style lang="scss" scoped>
:deep(.easy-select-table-input) {
  cursor: pointer !important;
  * {
    cursor: inherit;
  }
}
// input-icon的旋转动画
:deep(.el-input__icon) {
  transition: transform 0.3s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}
</style>
<style lang="scss">
// popover弹窗生成在组件外部，若加scope会导致样式无效
.easy-select-table-popover {
  .el-container {
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0;
    }
    .el-footer {
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>