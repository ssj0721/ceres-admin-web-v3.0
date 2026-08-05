<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm010</div>
    <div class="pending">
      <!-- <div class="toolbar formSearch">
      <el-button type="success" @click="addBar">添加一级类别</el-button>
    </div> -->
      <div class="second-main-container">
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" border row-key="id"
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" :tree-props="{ children: 'childs' }"
          class="dataTable">
          <el-table-column prop="classifyHierarchy" label="平台分类" />
          <el-table-column prop="status" label="操作">
            <template #default="scope">
              <el-button type="primary" link @click.native.prevent="checkRow(scope.row)">查看</el-button>
              <el-button type="primary" link @click.native.prevent="updateRow(scope.row)">编辑</el-button>
              <!-- <el-popconfirm title="确认删除？" @confirm="deleteRow(scope.row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm> -->
              <!-- <el-button v-if="scope.row.isBan == 1" link type="primary"
            @click.stop="disableOrEnable(scope.row)">禁用</el-button>
          <el-button v-else link type="primary" @click.stop="disableOrEnable(scope.row)">启用</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
    <el-pagination :current-page="formParams.page" :page-sizes="[10, 20, 50, 100]" :page-size="formParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper" background :total="total" style="margin: 12px 0;"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <edit-dialog ref="edit" :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose"
      @success="getProductCategory" />
    </div>
    </div>
    </div>
  </basic-container>
</template>

<script setup>
import { classifyListStart, commdityClassDelete, getAssociate } from '@/api/renovation';
import { onMounted, ref } from 'vue';
import EditDialog from './Edit.vue';
const tableLoading = ref(false)
const formParams = ref({
  page: 1,
  pageSize: 10,
})
const total = ref(1)
const tableData = ref([])
const dialog = ref({
  type: 'add',
  isVisible: false,
})
onMounted(() => {
  getProductCategory()
  getAll(formParams.value)
})

function handleSizeChange(val) {
  formParams.value.pageSize = val
  getAll(formParams.value)
}
function handleCurrentChange(val) {
  formParams.value.page = val
  getAll(formParams.value)
}
function fetch(config) {
  const { limit, page } = config
  formParams.value.pageIndex = page || 1
  formParams.value.pageSize = limit || 10
  getProductCategory()
}
const edit = ref()
function addBar() {
  dialog.value = {
    type: 'add',
    isVisible: true,
  }
  edit.value.setParams({ treeData: [] })
}
function editClose() {
  dialog.value.isVisible = false
}
// 编辑
function updateRow(row) {
  console.log("编辑的行", row)
  const id = row.classifyId
  dialog.value = {
    type: 'edit',
    isVisible: true,
  }
  edit.value.setParams({
    id: id,
  })
}
// 查看
function checkRow(row) {
  const id = row.classifyId
  dialog.value = {
    type: 'check',
    isVisible: true,
  }
  edit.value.setParams({
    id
  })
}

// 停用/启动
const disableOrEnable = async (row) => {
  console.log('禁用的row', row);
  if (row.isBan === 1) {
    const res = await classifyListStart({
      classifyId: row.classifyId,
      isBan: 0,
    })
    if (res.code === '') {
      ElMessage({
        message: '停用成功',
        type: 'success',
      })
    }
    getAll(formParams.value)
  } else {
    const res = await classifyListStart({
      classifyId: row.classifyId,
      isBan: 1,
    })
    if (res.code === '') {
      ElMessage({
        message: '启用成功',
        type: 'success',
      })
    }
    getAll(formParams.value)
  }
}

// 删除
async function deleteRow(row) {
  ElMessageBox.confirm('此操作将永久删除该类别, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      commdityClassDelete({ oneClassifyId: row.classifyId }).then((res) => {
        if (res.code === '') {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
        }
        getAll(formParams.value)
      })
    })
    .catch(() => { })
}
async function getProductCategory() {
  getAll(formParams.value)
}
function getAll(formParams) {
  tableLoading.value = true
  getAssociate(formParams).then(res => {
    tableData.value = res.data.list
    total.value = res.data.total
  }).finally(() => {
    tableLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container {
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;

  .el-form .el-form-item {
    margin-bottom: 0px;
  }

  box-shadow: $shadow-1;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin: 24px;
  // margin-left:24px;
}

.classification-page {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;

  .toolbar {
    margin-bottom: 15px;
    text-align: right;
  }
}
</style>
