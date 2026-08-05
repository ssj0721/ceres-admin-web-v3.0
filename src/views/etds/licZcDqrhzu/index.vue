<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { searchFormConfig, tableConfig,getLicZcPsw, updateLicZcPsw,formatTimeToStr} from './option'
import { ArrowDown } from '@element-plus/icons-vue'



// 表单数据
const searchForm = ref({
  //sdate: `${new Date().getFullYear() - 1}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`, // 开始日期 默认值为上个礼拜 是字符串
  //edate: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`, // 结束日期 默认值为今天 是字符串
  sdate: undefined,
  edate: undefined,
  po_no: undefined,   // 合同号
  z_sdate: undefined, // 自查开始日期
  z_edate: undefined, // 自查结束日期
  confirmType: [],
  licType: []
})
// 表格数据
const tableData = ref([])
const selected = ref([])
const loading = ref(false)

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10
})
const total = ref(0)



// 用于记录下拉菜单选择的确认类型
const selectedOption = ref({})

//选择的确认类型
const confirmTypeOptions = ref([
  { label: '返修', value: 0 },
  { label: '不再上架', value: 1 },
  { label: '重审', value: 2 },
])

const confirm_type = ref([
  { label: '返修', value: 0 },
  { label: '不再上架', value: 1 },
  { label: '重审', value: 2 },
  { label: '未确认', value: -1 }
])

////选择的联营方式
const licTypeOptions = ref([
  { label: '联营业务', value: 0 },
  { label: '联营款', value: 1 },
])

// 获取表格数据
async function getData () {
 
  loading.value = true
try {
  const params = {
    sdate: formatTimeToStr(searchForm.value.sdate),
    edate: formatTimeToStr(searchForm.value.edate),
    po_no: searchForm.value.po_no ,
    z_sdate:formatTimeToStr(searchForm.value.z_sdate),
    z_edate:formatTimeToStr(searchForm.value.z_edate),
    confirmType:searchForm.value.confirmType?.join(",") || null,
    includeUnconfirmed: searchForm.value.confirmType?.includes(-1) || false,// 参数传递未确认状态标识
    licType: searchForm.value.licType?.join(",") || null,
    pageNum: pagination.value.current,
    pageSize: pagination.value.pageSize,
    //issqs: 'true',
    //userId: userInfo.userId
  }

  const res = await getLicZcPsw(params)
  // 这里根据你的返回结构调整
  if (res.data && res.data.result) {
    tableData.value = res.data.result
    total.value = res.data.TotalCount   // 用后端返回的总条数
  } else {
    tableData.value = []
    total.value = 0} 
}catch (err) {
  console.error('获取数据失败:', err)
  ElMessage.error('获取数据失败')
} finally {
  loading.value = false
}
}

// 分页处理
function handleSizeChange (val) {
  pagination.value.pageSize = val
  getData()
}

function handleCurrentChange (val) {
  pagination.value.current = val
  getData()
}

// 批量确认
async function handleConfirm (confirmValue) {
  if (selected.value.length === 0) {
  ElMessage.warning('请选择要确认的数据')
  return
}

try {
  const params = {
    list: selected.value.map(item => ({
    oid: item.oid,
    result: confirmValue
  })),
    
  }
  await updateLicZcPsw(params)
  ElMessage.success('批量确认成功')

  selected.value = []
  await getData()
} catch (err) {
  console.error('确认失败:', err)
  ElMessage.error('确认失败')
}
}

// 表格选择事件
function handleSelectionChange (selection) {
  selected.value = selection
}

// 行可选性判断函数
const isSelectable = (row) => {
  return row.result === '未确认'
}

// 处理下拉菜单选择
function handleMenuCommand(command) {
  // 找到对应的选项对象
  selectedOption.value = confirmTypeOptions.value.find(opt => opt.value === command) || {}
  
  // 显示确认弹窗
  ElMessageBox.confirm(
    `是否批量确认为"${selectedOption.value.label}"?`,
    '批量确认操作',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 用户点击确认，执行批量确认操作
    handleConfirm(command)
  }).catch(() => {
    // 用户点击取消，什么都不做
  })
}

// 查看按钮处理函数
function handleView (row) {
  console.log('查看详情:', row)
  // TODO: 实现查看逻辑
}

// 重置表单
function resetForm() {
  searchForm.value.sdate = undefined;
  searchForm.value.edate = undefined;
  searchForm.value.po_no = undefined;
  searchForm.value.z_sdate = undefined;
  searchForm.value.z_edate = undefined;
  searchForm.value.confirmType = undefined;
  searchForm.value.licType = undefined;//联营类型
  getData();
}

// 处理日期禁用逻辑
function disabledStartDate(time, endDate) {
  if (!endDate) return false;
  return time.getTime() > new Date(endDate).getTime();
}
function disabledEndDate(time, startDate) {
  if (!startDate) return false;
  return time.getTime() < new Date(startDate).getTime();
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="container">
    <div class="second-main-container">
      <!-- 第一行：提交日期标题 -->
      <div class="form-header">
          <el-form-item>

            <!-- 查询按钮 -->      
            <el-button
              class="custom-button"
              type="primary"
              @click="getData"
            >
              查询
            </el-button>

            <!-- 重置按钮 -->
            <el-button
              class="custom-button"
              type="primary"
              @click="resetForm"
            >
              重置
            </el-button>

            <!-- 批量确认按钮（添加禁用状态） -->
            <el-dropdown
              trigger="click"
              @command="handleMenuCommand"
              class="confirm-dropdown"
              :disabled="selected.length === 0"
            >

            <!-- 批量确认主按钮，添加禁用状态 -->
              <el-button
                type="primary"
                class="custom-button confirm-button"
                :disabled="selected.length === 0"
              >
                批量确认
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in confirmTypeOptions"
                    :key="item.value"
                    :command="item.value"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
      </div>

      <!-- 第二行：日期选择器 -->
      <div class="date-picker-row">
        <el-form :inline="true" :model="searchForm">
          
          <el-form-item label="提交日期">
            <el-date-picker 
            v-model="searchForm.sdate" 
            type="date"
            placeholder="开始日期" :disabled-date="time => disabledStartDate(time, searchForm.edate)" />
          </el-form-item>
         
          <el-form-item label="至">
            <el-date-picker v-model="searchForm.edate" type="date" placeholder="结束日期" :disabled-date="time => disabledEndDate(time, searchForm.sdate)" />
          </el-form-item>
         
          <el-form-item label="自查日期">
            <el-date-picker v-model="searchForm.z_sdate" type="date" placeholder="开始日期" :disabled-date="time => disabledStartDate(time, searchForm.z_edate)" />
          </el-form-item>
          
          <el-form-item label="至">
            <el-date-picker v-model="searchForm.z_edate" type="date" placeholder="结束日期" :disabled-date="time => disabledEndDate(time, searchForm.z_sdate)" />
          </el-form-item>
          
           <el-form-item label="合同号">
          <el-input v-model="searchForm.po_no" placeholder="请输入合同号(模糊查询)" clearable style="width: 234px" />
        </el-form-item>

        <el-form-item label="联营类型">
           <el-select
              v-model="searchForm.licType"
              multiple
              filterable
              :collapse-tags="false"
              :collapse-tags-tooltip="false"
              placeholder="请选择"
              style="width: 300px;"
            >
            <el-option
              v-for="item in licTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             />
          </el-select>
        </el-form-item>
        
       <el-form-item label="确定结果">
           <el-select
              v-model="searchForm.confirmType"
              multiple
              filterable
              :collapse-tags="false"
              :collapse-tags-tooltip="false"
              placeholder="请选择"
              style="width: 300px;"
            >
            <el-option
              v-for="item in confirm_type"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             />
          </el-select>
        </el-form-item>
        
        </el-form>
        
      </div>

     

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="400"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable"  />
          <el-table-column
            v-for="column in tableConfig.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :sortable="column.sortable"
            show-overflow-tooltip
          />

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
    min-height: 200px;

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

    // 调整底部操作区样式
    .footer-actions {
      display: flex;
      align-items: center;
      margin-top: 16px;
      margin-bottom: 10px;
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
  gap: 10px;
}


// 新增的样式
.confirm-dropdown {
  margin-right: 10px;
}

.confirm-button {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  
  .el-icon--right {
    margin-left: 5px;
  }
}

/* 禁用状态的样式 */
.confirm-button.el-button.is-disabled {
  background-color: #a0cfff;
  border-color: #a0cfff;
  color: #fff;
  opacity: 0.6;
  cursor: not-allowed;
}

/* 鼠标悬停在禁用按钮上的提示 */
.confirm-dropdown.is-disabled {
  cursor: not-allowed;
  &::before {
    content: "请先选择条目";
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: #606266;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover::before {
    opacity: 1;
  }
}

/* 添加批量确认弹窗样式 */
:deep(.batch-confirm-dialog) {
  min-width: 400px;
}
:deep(.batch-confirm-dialog .el-message-box__content) {
  font-size: 16px;
  padding: 20px;
}
:deep(.batch-confirm-dialog .el-message-box__btns) {
  padding: 10px 20px 20px;
}
</style>

