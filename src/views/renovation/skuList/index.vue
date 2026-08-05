<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm012</div>
  <div class="pending">
    <!-- 搜索 -->
    <!-- <div class="formSearch"> -->
    <mybottons>
      <el-form :inline="true" :model="searchData">
        <el-form-item label="类型">
          <el-select v-model="searchData.type" placeholder="请选择类型" clearable size="large" style="width: 200px">
              <el-option v-for="(item, index) in typelist" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="searchData.guige" placeholder="请输入规格" clearable size="large" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </mybottons>
    <!-- </div> -->
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
        <el-table-column prop="guige" label="规格"/>
        <el-table-column prop="code" label="代号" />
        <el-table-column prop="type" label="类型" >
          <template #default="scope">
              <span v-if="scope.row.type == '1'">颜色</span>
              <span v-if="scope.row.type == '2'">尺码</span>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" />
        <el-table-column prop="creater" label="创建人" />
        <el-table-column prop="modified" label="修改时间" />
        <el-table-column prop="modifier" label="修改人" />
        <el-table-column label="操作">
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
      :title="userState ? '新增颜色尺码' : '修改颜色尺码'"
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
          <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择类型">
                  <el-option v-for="(item, index) in typelist" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="颜色id" prop="colid" v-if="addForm.type=='1'">
            <el-input
              v-model="addForm.colid"
              maxlength="60"
              placeholder="请输入颜色id，然后点击回车生成【规格名】和【代码】"
              @change="colidChange"
            />
          </el-form-item>
          <el-form-item label="规格名" prop="guige">
            <el-input
              v-model="addForm.guige"
              maxlength="60"
              placeholder="请输入规格名"
              :disabled="addForm.type=='1'"
            />
          </el-form-item>
          <el-form-item label="代码" prop="code">
            <el-input
              v-model="addForm.code"
              maxlength="60"
              placeholder="请输入颜色尺码代码"
              :disabled="addForm.type=='1'"
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
  import { ref, onBeforeMount, watch } from 'vue'
  import {
    getAllData,
    skuAdd,
    skuUpdate,
    getById,
    deleteSku,
    getGuigeByColid
  } from '@/api/skuList'
import { ElMessage } from 'element-plus'
  
  const formRef = ref(null)
  const tableLoading = ref(false)
  const submitLoading = ref(false)
  const searchData = ref({
    type:'', //类型
    guige: '', //规格
    page: 1, // 当前页
    pageSize: 10, // 每页记录数
  })
  const total = ref(1)
  const tableData = ref([])
  const userState = ref(1)
  const addForm = ref({
    id:0,
    type:'',  //颜色尺码类型
    guige: '', // 规格名称
    code: '', // 颜色尺码代码
    colid:''  //颜色id
  })
  const addFormDialog = ref(false)
  const userRules = ref({
    type: [
      { required: true, message: '请输入类型', trigger: 'blur' },
    ],
    guige: [
      { required: true, message: '请输入颜色尺码名称', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入颜色尺码的代码,不可以是中文汉字', trigger: 'blur' },
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

  const colidChange = (val) => {
    console.log("颜色id回车确定", val)
    if(val!=undefined){
      getGuigeByColid({colid:val}).then((res) => {
        console.log('颜色id的res',res);
        if (res.code === '') {
          if(res.data.length>0){
            addForm.value.guige = res.data[0].guige
            addForm.value.code = res.data[0].code
          }
        }
      }).finally(() => {
    })
    }
  }

  watch(() => addForm.value.colid, (newVal, oldVal) => {
    console.log("监听颜色id", newVal, oldVal=='')
    if(newVal!=undefined&&oldVal!=undefined&&oldVal!=''&&newVal!=oldVal){
      addForm.value.guige = ''
      addForm.value.code = ''
    }
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
        if(addForm.value.type=='1' && addForm.value.colid==''){
          ElMessage.warning("请补充颜色id")
          return
        }
        if (userState.value) {
          skuAdd(addForm.value).then((res) => {
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
          skuUpdate(addForm.value).then((res) => {
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
        deleteSku({ id: row.id }).then((res) => {
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