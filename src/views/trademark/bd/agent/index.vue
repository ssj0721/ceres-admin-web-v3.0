<template>
  <div class="content">
    <!-- 搜索 -->
    <div class="topSearch">
      <div class="formSearch">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="代理人">
            <el-input
              v-model="formInline.agent"
              placeholder="请输入代理人"
              clearable
            />
          </el-form-item>
          <el-form-item label="代理人地址">
            <el-input
              v-model="formInline.agentAddress"
              placeholder="请输入代理人地址"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="handleSearch">查询</el-button>
            <el-button plain @click="handleClear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rightBTn">
        <el-button type="primary" @click="handleEditForm()">新增</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="tableLoading"
      class="table dataTable"
      stripe
      border
      :header-cell-style="tableOptions.headStyle"
      :data="list"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column
        prop="id"
        align="center"
        label="ID"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="agent"
        align="center"
        label="代理人"
        show-overflow-tooltip
      />
      <el-table-column
        prop="agentAddress"
        align="center"
        label="代理人地址"
        show-overflow-tooltip
      />
      <el-table-column
        prop="accountName"
        align="center"
        label="开户名"
        show-overflow-tooltip
      />
      <el-table-column
        prop="bankName"
        align="center"
        label="开户行"
        show-overflow-tooltip
      />
      <el-table-column
        prop="receiptAccount"
        align="center"
        label="收款账号"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        width="180"
        show-overflow-tooltip
      /> -->
      <el-table-column
        align="center"
        label="操作"
        width="200"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="handleEditForm(scope.row)"
          >编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="queryOptions.page"
      :page-size="queryOptions.pageSize"
      :page-sizes="tableOptions.pageSizes"
      :total="tableOptions.total"
      @size-change="(val) => handlePageChange(val, 1)"
      @current-change="(val) => handlePageChange(val, 2)"
    />
    <!-- 表单弹框 -->
    <AgentForm
      v-model:show="showForm"
      :item="formItem"
      @confirm="handleResetTable"
      @cancel="handleResetTable"
    />
  </div>
</template>

<script setup>
import AgentForm from './form.vue'
import { agentAdd, agentEdit, agentDel, agentGetList, agentSearch } from '@/api/trademark/bd/agent'
import { onMounted, ref } from 'vue'

const showForm = ref(false)
const formItem = ref({})
const tableLoading = ref(false)
const list = ref([])
const formInline = ref({
  agent: '',
  agentAddress: '',
  page: 1,
  pageSize: 10,
})
const queryOptions = ref({
  page: 1,
  pageSize: 10,
})
const tableOptions = ref({
  headStyle: { background: '#EEF3FF', color: '#333333' },
  pageSizes: [5, 10, 30, 50, 100],
  total: 0,
})

onMounted(() => {
  handleGetTable()
})

function handleResetTable () {
  queryOptions.value.page = 1
  handleGetTable()
}

function handleGetTable () {
  tableLoading.value = true
  agentSearch({ ...formInline.value, page: queryOptions.value.page, pageSize: queryOptions.value.pageSize }).then(res => {
    list.value = res.data.list
    tableOptions.value.total = res.data.total
  }).catch(() => {
    agentGetList(queryOptions.value).then(res => {
      list.value = res.data.list
      tableOptions.value.total = res.data.total
    })
  }).finally(() => {
    tableLoading.value = false
  })
}

function handleSearch () {
  queryOptions.value.page = 1
  handleGetTable()
}

function handleClear () {
  formInline.value = {
    agent: '',
    agentAddress: '',
    page: 1,
    pageSize: 10,
  }
  handleGetTable()
}

function handlePageChange (val, type) {
  type === 1
    ? (queryOptions.value.pageSize = val)
    : (queryOptions.value.page = val)
  handleGetTable()
}

function handleEditForm (item) {
  if (!item) {
    formItem.value = {}
  } else {
    formItem.value = { ...item }
  }
  showForm.value = true
}

function handleDelete (item) {
  agentDel({ id: item.id }).then(() => {
    ElMessage.success('删除成功')
    handleGetTable()
  })
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #FFFFFF;
  .topSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .formSearch,
    .rightBTn {
      margin-left: 20px;
    }
  }
  .table {
    margin: 20px 0;
  }
}
</style>
