<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm033</div>
  <div class="pending">
      <!-- 顶部搜索 -->
      <mybottons>
      <!-- <div class="toolbar formSearch"> -->
        <el-form
          ref="formParamsRef"
          :inline="true"
          :model="formParams"
        >
          <el-form-item label="平台类型" prop="type">
            <el-select
              v-model="formParams.type"
              placeholder="请选择平台类型"
              size="large" style="width: 200px" clearable
            >
              <el-option
                v-for="(item, index) in tipsList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label-width="0">
            <el-button
              type="primary"
              @click="search"
            >查询
            </el-button>
            <el-button
              type="primary"
              @click="add"
            >新增
            </el-button>
          </el-form-item>
        </el-form>
      <!-- </div> -->
      </mybottons>
      <!-- 表格 -->
      <div class="second-main-container">
      <el-table
        v-loading="tableLoading"
        :data="list"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        style="width: 100%"
        class="dataTable"
      >
        <el-table-column prop="type" label="平台" show-overflow-tooltip width="100">
          <template #default="scope">
            <span v-if="scope.row.type == 0">全部</span>
            <span v-if="scope.row.type == 1">联营商端</span>
            <span v-if="scope.row.type == 2">供应商端</span>
            <span v-if="scope.row.type == 3">PC端</span>
          </template>
        </el-table-column>
        <el-table-column
          label="内容"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <span v-html="scope.row.text"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
        >
          <template #default="scope">
            <span v-if="scope.row.state == 0">失效</span>
            <span v-if="scope.row.state == 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="creater"
          label="创建人"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click.prevent="details(scope.row.id)"
            >编辑
            </el-button>
            <el-popconfirm title="确认删除？" @confirm="del(scope.row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
      <el-pagination
        :current-page="formParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total"
        style="margin: 12px 0;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增"
      width="60%"
      :before-close="addHandleClose"
      modal
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="内容">
          <el-input v-model="form.text" type="textarea" placeholder="请输入滚动条内容" :rows="8"></el-input>
        </el-form-item>
        <el-form-item label="所属平台">
          <el-select v-model="form.type" placeholder="请选择" :disabled="isEdit">
            <el-option
                v-for="(item, index) in tipsList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="所属联营商">
          <!-- 当选择联营商端时候联营商多选 -->
          <!-- <el-select v-model="form.merchantsUserIds" placeholder="请选择" multiple v-if="form.type==1" :disabled="isEdit">
            <el-option v-for="item in merchants" :key="item.id" :label="item.name" :value="item.id" />
          </el-select> -->
          <div v-if="form.type==1" class="el-form-item__content">
            <selectAll v-model="form.merchantsUserIds" :multiple="true" :placeholder="'请选择'" :disabled="isEdit" :options="merchants"/>
          </div>
          <!-- 当不选择联营商端的时候联营商单选 -->
          <el-select v-model="form.merchantsUserId" placeholder="请选择" v-if="form.type!=1" :disabled="isEdit">
            <el-option v-for="item in merchants" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属供应商商" v-if="form.type==2">
          <!-- <el-select v-model="form.shopIds" placeholder="请选择" multiple :disabled="isEdit">
            <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.id" />
          </el-select> -->
          <div class="el-form-item__content">
            <selectAll v-model="form.shopIds" :multiple="true" :placeholder="'请选择'" :disabled="isEdit" :options="shops"/>
          </div>
        </el-form-item>
        <div class="addbuttonmain">
          <span>
            <el-button type="primary" @click="addsave">保存</el-button>
            <el-button type="primary" @click="addHandleClose">取消</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>
  </div>
  </basic-container>
</template>

<script setup>
import { noticeTextGetAll,getBusiness,noticeTextSave,noticeTextGetById,noticeTextDel } from '@/api/notice'
import { onMounted, ref, watch } from 'vue';
import { getToken } from '@/utils/auth'

const tableLoading = ref(false)
const list = ref([])
const total = ref(1)
const dialogVisible = ref(false)
const formParams = ref({
  noticeTitle: null,
  noticeType: null,
  dates: [],
  page: 1,
  pageSize: 10,
})
const tipsList = ref([
  // {
  //   id: 0,
  //   name: '全部',
  // },
  {
    id: 1,
    name: '联营商端',
  },
  {
    id: 2,
    name: '供应商端',
  },
  // {
  //   id: 3,
  //   name: 'PC端',
  // }
])
const rules = {
  noticeTitle: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, message: '请输入标题', trigger: 'blur' },
  ],
  noticeType: [
    { required: true, message: '请选择消息类型', trigger: 'change' },
  ]
}
const form = ref({
  text:'',
  type:0,
  merchantsUserIds:[],
  merchantsUserId:0,
  shopIds:[],
  shopId:0
})
const shops = ref([])
const merchants = ref([])
const isEdit = ref(false)
onMounted(() => {
  getAll()
  // console.log('token',getToken());
})

watch(() => form.value.type, (nVal, oVal) => {
  console.log('触发了平台的监听', nVal);
  if (nVal) {
    let param = {
      type: 1,
    };
    getBusiness(param).then(res => {
      console.log('选择平台获得的res', res);
      merchants.value = res.data
    }).catch(error => {
      console.error('在选择平台时发生错误', error);
    }).finally(() => {
    });
  }
});

watch(() => form.value.merchantsUserId, (nVal, oVal) => {
  console.log('触发了联营商的监听', nVal);
  if (nVal) {
    let param = {
      type: 2,
      merchantsUserId:nVal
    };
    getBusiness(param).then(res => {
      console.log('选择联营商获得的res', res);
      shops.value = res.data
    }).catch(error => {
      console.error('在选择联营商时发生错误', error);
    }).finally(() => {
    });
  }
});

// 历史消息列表
async function getAll () {
  tableLoading.value = true
  await noticeTextGetAll(formParams.value).then(res => {
    list.value = res.data.list
    console.log('查询的结果',list.value);
    total.value = res.data.total
  }).finally(() => {
    tableLoading.value = false
  })
}

async function add() {
  isEdit.value = false
  form.value = {}
  dialogVisible.value = true
}

function addsave(){
  noticeTextSave(form.value).then(res => {
    console.log('新增的res',res);
    addHandleClose()
    getAll()
  }).finally(() => {
  })
}

// 编辑
async function details (id) {
  isEdit.value = true
  const res = await noticeTextGetById({ id: id })
  console.log('编辑查看的res',res);
  form.value = res.data
  console.log('form.value',form.value);
  if(form.value.type == 1){
    form.value.merchantsUserIds= [form.value.merchantsUserId]
  }else{
    form.value.shopIds= [form.value.shopId]
  }
  dialogVisible.value = true
}

//禁用
async function del (id) {
  console.log('删除',id);
  const res = await noticeTextDel({ id: id})
  if (res.code === '') {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    await getAll()
  }
}

// 查询
const formParamsRef = ref()

async function search () {
  formParamsRef.value.validate((valid) => {
    if (valid) {
      total.value = 1
      formParams.value.page = 1
      getAll()
    } else {
      return false
    }
  })
}

// 重置表单
// function clear () {
//   formParamsRef.value.resetFields()
//   formParams.value.page = 1
//   getAll()
// }

// 更改页数
function handleSizeChange (val) {
  formParams.value.pageSize = val
  getAll()
}

// 翻页
function handleCurrentChange (val) {
  formParams.value.page = val
  getAll()
}

// 关闭新增
function addHandleClose () {
  dialogVisible.value = false
  form.value = {}
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

.history {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
  :deep(.el-table) {
    .cell.el-tooltip img {
      max-height: 100px;
    }
  }
}

.addbuttonmain{
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
.el-tooltip__popper {
  max-width: 50%;
}
</style>
