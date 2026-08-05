<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm011</div>
  <div class="pending">
  <mybottons>
    <el-row :gutter="10" class="padding-bottom">
      <el-col :span="24">
        <el-button
          type="primary"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
  </mybottons>
    <div class="second-main-container">
    <el-table
      v-loading="tableLoading"
      :data="list"
      border
      style="width: 100%"
      :header-cell-style="{
        background: '#EEF3FF',
        color: '#333333'
      }"
    >
      <el-table-column
        prop="brandName"
        label="品牌名称"
        width="180"
      />
      <el-table-column
        prop="brandLogo"
        label="Logo"
      >
        <template #default="scope">
          <el-image
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            style="width: 100px; height: 100px"
            :preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="相关操作">
        <template #default="scope">
          <el-button
            style="margin-right: 10px"
            type="warning"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
    <el-pagination
      :current-page="query.page"
      :page-sizes="tableOptions.pageSizes"
      :page-size="query.pageSize"
      :layout="tableOptions.layout"
      :total="tableOptions.total"
      background
      style="margin: 12px 0;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </div>
    <Form
      ref="brandFormRef"
      :item="formOption"
      @confirm="getList"
    />
  </div>
  </div>
</basic-container>
</template>

<script setup>
import { getBrandAll, deleteBrand, getById} from '@/api/renovation'
import Form from './form.vue'
import { onMounted, ref } from 'vue';

const tableLoading = ref(true)
const brandFormRef = ref(null)
const list = ref([])
const query = ref({
  page: 1,
  pageSize: 10,
})
const tableOptions = ref({
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 30, 50, 100, 200],
})
const formOption = ref(null)

onMounted(() => {
  getList()
})
function getList () {
  tableLoading.value = true
  getBrandAll(query.value).then(res => {
    list.value = res.data.list
    console.log('getall-----',list.value);
    tableOptions.value.total = res.data.total
  }).finally(() => {
    tableLoading.value = false
  })
}
function handleSizeChange (val) {
  query.value.pageSize = val
  getList()
}
function handleCurrentChange (val) {
  query.value.page = val
  getList()
}
function handleAdd () {
  formOption.value = {
    id: null
  }
  brandFormRef.value.open()
}
function handleUpdate (item) {
  console.log('点击修改',item);
  // getById(item).then(res => {
  //       if (res.code === '') {
  //         ElMessage.success('获取成功')
  //         console.log('点击修改的res',res);
  //       } else {
  //         ElMessage.error(res.message)
  //       }
  //     })
  formOption.value = item
  brandFormRef.value.open()
}

function handleDelete (item) {
  ElMessageBox.confirm(
    '是否确认删除?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteBrand({id:item.id}).then(res => {
        if (res.code === '') {
          ElMessage.success('删除成功')
          getList()
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>


.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container{
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
  margin:24px;
  // margin-left:24px;
}

:deep(.el-table .cell){
  line-height: 60px;
}

.content {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
  .fenye {
    margin-top: 20px;
  }
}
// .padding-bottom {
//   padding-bottom: 30px;
// }
</style>
