<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { searchFormConfig, tableConfig, confirmTypeOptions } from './option'
import { getLicZcPsw, updateLicZcPsw } from '@/api/etds'

// 表单数据

const searchForm = ref({
  sdate: `${new Date().getFullYear() - 1}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`, // 开始日期 默认值为上个礼拜 是字符串
  edate: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`, // 结束日期 默认值为今天 是字符串
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

// 确认类型选择
const confirmType = ref('')

// 获取表格数据
async function getData () {
  loading.value = true
  try {
    const storageData = localStorage.getItem('storage_key_etds')
    if (!storageData) {
      ElMessage.error('获取用户信息失败')
      return
    }

    const userInfo = JSON.parse(storageData)
    const isSqs = userInfo.is_sqs === '1' ? 'true' : 'false'

    const params = {
      sdate: searchForm.value.sdate,
      edate: searchForm.value.edate,
      issqs: 'true',
      userId: userInfo.userId
    }

    const res = await getLicZcPsw(params)
    if (res.data.result.Examples) {
      tableData.value = res.data.result.Examples
      total.value = res.data.result.Examples.length
    }
  } catch (err) {
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
async function handleConfirm () {
  if (selected.value.length === 0) {
    ElMessage.warning('请选择要确认的数据')
    return
  }

  const storageData = localStorage.getItem('storage_key_etds')
  if (!storageData) {
    ElMessage.error('获取用户信息失败')
    return
  }

  const userInfo = JSON.parse(storageData)
  const isSqs = userInfo.is_sqs === '1' || userInfo.is_sqs === 1 ? 'true' : 'false'
  if (isSqs !== 'true') {
    ElMessage.error('非联营业务/联营款账号不能确认')
    return
  }

  try {
    const params = {
      list: selected.value,
      result: confirmType.value
    }

    await updateLicZcPsw(params)
    ElMessage.success('批量确认成功')
    getData()
  } catch (err) {
    console.error('确认失败:', err)
    ElMessage.error('确认失败')
  }
}

// 表格选择事件
function handleSelectionChange (selection) {
  selected.value = selection
}

// 查看按钮处理函数
function handleView (row) {
  console.log('查看详情:', row)
  // TODO: 实现查看逻辑
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm016</div>
    <div class="second-main-container">
      <!-- 第一行：自查日期标题 -->
      <div class="form-header">
        <span class="form-title">自查日期</span>
      </div>

      <!-- 第二行：日期选择器 -->
      <div class="date-picker-row">
        <avue-form
          v-model="searchForm"
          :option="searchFormConfig"
        >
          <template #menu-form="{}">
            <el-button
              class="custom-button"
              :style="{
                margin: '2px 5px',
              }"
              type="primary"
              @click="getData"
            >
              查询
            </el-button>
          </template>
        </avue-form>

      </div>

      <!-- 第三行：搜索条件 -->
      <div class="search-row">

      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="400"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
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

      <!-- 底部操作区 -->
      <div class="footer-actions">
        <el-select
          v-model="confirmType"
          placeholder="请选择确认结果"
          class="confirm-select"
        >
          <el-option
            v-for="item in confirmTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="button-group">
          <el-button
            type="primary"
            class="custom-button"
            @click="handleConfirm"
          >
            批量确认
          </el-button>
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

    // 底部操作区
    .footer-actions {
      display: flex;
      align-items: center;
      gap: $container-base-padding-2;
      margin-top: $container-base-padding-2;

      .confirm-select {
        width: 200px;
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
  gap: 10px;
}
</style>

