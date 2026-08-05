<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm013</div>
  <div class="pending">
    <!-- 搜索 -->
    <mybottons>
      <el-form :inline="true" :model="searchData">
        <el-form-item label="分组">
          <el-input v-model="searchData.group" placeholder="请输入分组" clearable size="large" style="width: 200px" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="searchData.key" placeholder="请输入代码" clearable size="large" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </mybottons>
    <!-- 表格 -->
    <div class="second-main-container">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ 'background': '#EEF3FF', 'color': '#333333' }"
        tooltip-effect="dark"
        :style="{ 'width': '100%' }"
        class="dataTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="序号" width="100">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="group" label="分组" width="100"/>
        <el-table-column prop="key" label="代码" width="200"/>
        <el-table-column prop="value" label="值" />
        <el-table-column prop="desc" label="描述" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="btnList">
              <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除？" @confirm="del(scope.row)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="searchData.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- *************对话框开始************* -->
    <!-- 新增颜色尺码 -->
    <el-dialog
      v-model="addFormDialog"
      :title="userState ? '新增参数' : '修改参数值'"
      width="30%"
      center
      :close-on-click-modal="false"
      @closed="onClosed"
    >
      <!-- 新增颜色尺码 -->
      <div>
        <el-form
          ref="formRef"
          :model="addForm"
          label-width="80px"
          :rules="userRules"
        >
          <el-form-item label="分组" prop="group">
            <el-input
              v-model="addForm.group"
              maxlength="60"
              placeholder="请输入分组名"
              :disabled="userState==0"
            />
          </el-form-item>
          <el-form-item label="代码" prop="key">
            <el-input
              v-model="addForm.key"
              maxlength="60"
              placeholder="请输入代码"
              :disabled="userState==0"
            />
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input
              v-model="addForm.value"
              maxlength="60"
              placeholder="请输入值"
            />
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input
              v-model="addForm.desc"
              maxlength="60"
              placeholder="请输入描述"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormDialog = false">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="addForm_enter(formRef)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  </basic-container>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue'
  import {
    getAllData,
    paramsAdd,
    paramsUpdate,
    getById,
    deleteParams
  } from '@/api/params'
import { ElMessage } from 'element-plus'
  
  const formRef = ref(null)
  const tableLoading = ref(false)
  const submitLoading = ref(false)
  const searchData = ref({
    group:'', //分组
    key: '', //代码
    page: 1, // 当前页
    pageSize: 10, // 每页记录数
  })
  const total = ref(1)
  const tableData = ref([])
  const userState = ref(1)
  const addForm = ref({
    id:0,
    group:'',  //分组
    key: '', // 代码
    value: '', // 值
    desc:'' //描述
  })
  const addFormDialog = ref(false)
  const userRules = ref({
    group: [
      { required: true, message: '请输入分组', trigger: 'blur' },
    ],
    key: [
      { required: true, message: '请输入代码', trigger: 'blur' },
    ],
    value: [
      { required: true, message: '请输入值', trigger: 'blur' },
    ],
    desc: [
      { required: true, message: '请输入描述', trigger: 'blur' },
    ],
  })
  const typelist = ref([
    {
        id:'1',
        name:"颜色"
    },
    {
        id:'2',
        name:"尺码"
    }
])
  
  onBeforeMount(() => {
    getAll()
  })
  // 方法集合
  const handleSizeChange = (val) => {
    searchData.value.pageSize = val
    getAll()
  }
  const handleCurrentChange = (val) => {
    searchData.value.page = val
    getAll()
  }
  // 查询
  const search = () => {
    total.value = 1
    searchData.value.page = 1
    getAll()
  }
  // 新增颜色尺码
  const add = () => {
    userState.value = 1
    addFormDialog.value = true
  }
  
  // 确认新增颜色尺码
  const addForm_enter = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        submitLoading.value = true
        if (userState.value) {
          paramsAdd(addForm.value).then((res) => {
            console.log('新增保存的res',res);
            if (res.code === '') {
              ElMessage({
                message: '新增成功',
                type: 'success',
              })
            getAll()
            addFormDialog.value = false
            }
            else{
                ElMessage.error(res.message)
            }
          }).finally(() => {
            submitLoading.value = false
          })
        } else {
          paramsUpdate(addForm.value).then((res) => {
            console.log('编辑保存的res',res);
            if (res.code === '') {
              ElMessage({
                message: '修改成功',
                type: 'success',
              })
            getAll()
            addFormDialog.value = false
            }
            else{
                ElMessage.error(res.message)
            }
          }).finally(() => {
            submitLoading.value = false
          })
        }
      } else {
        return false
      }
    })
  }
  // 弹窗关闭
  const onClosed = () => {
    formRef.value.resetFields()
  }
  // 编辑颜色尺码
  const edit = (row) => {
    userState.value = 0
    addFormDialog.value = true
    getById({ id: row.id }).then((res) => {
      console.log('编辑弹窗',res.data);
      addForm.value = res.data
      addForm.value.id = row.id
      // this.addForm.groupIds = [1];
    })
  }
  // 删除颜色尺码
  const del = async (row) => {
    ElMessageBox.confirm(
      '此操作将永久删除该颜色尺码分组, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        deleteParams({ id: row.id }).then((res) => {
          if (res.code === '') {
            ElMessage({
              type: 'success',
              message: '删除成功!',
            })
          }
          getAll()
        })
      })
      .catch(() => {})
  }
  
  // 初始化查询所有数据
  const getAll = async () => {
    tableLoading.value = true
    try {
      const res = await getAllData(searchData.value)
      tableData.value = res.data.list
      total.value = res.data.total
    } finally {
      tableLoading.value = false
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .userStyle {
    padding: 20px;
    margin-top: 20px;
    background-color: #FFFFFF;
  }
  .el-tree {
    width: 100%;
  }
  </style>
  
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
  
  </style>