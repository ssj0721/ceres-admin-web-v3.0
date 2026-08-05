<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm030</div>
  <div class="pending">
    <!-- <div class="content"> -->
      <!-- 顶部搜索 -->
      <mybottons>
        <el-form :inline="true" :model="formParams">
        <el-form-item label="店铺运营昵称">
          <el-input
            v-model="formParams.name"
            maxlength="20"
            placeholder="请输入店铺运营昵称"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="formParams.phone"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formParams.type" placeholder="请选择类型" size="large" style="width:150px" clearable>
            <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标签">
          <el-select v-model="formParams.labelId" placeholder="请选择" size="large" style="width: 200px" clearable>
            <el-option
              v-for="(item, index) in tipsList"
              :key="index"
              :label="item.labelName"
              :value="item.buyerLabelId"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="最近消费时间">
          <el-date-picker
            v-model="formParams.dates"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item> -->
        <!-- <el-form-item>
          <el-form-item label="累计消费金额">
            <el-input
              v-model="formParams.minMoney"
              maxlength="9"
              placeholder="请输入最小值"
            />
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="formParams.maxMoney"
              maxlength="9"
              placeholder="请输入最大值"
            />
          </el-form-item>
        </el-form-item> -->
        <el-form-item>
          <el-form-item label="下载次数">
            <el-input
              v-model="formParams.minBuyers"
              maxlength="9"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入最小值"
            />
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="formParams.maxBuyers"
              maxlength="9"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入最大值"
            />
          </el-form-item>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="clear">重置</el-button>
          <el-button type="primary" @click="add">新增</el-button>
          <el-button
            type="primary"
            :loading="loading.export"
            @click="handleExport"
          >导出</el-button>
        </el-form-item>
        </el-form>
      </mybottons>
      <!--  表格 -->
      <div class="second-main-container">
        <!-- <div class="table"> -->
          <el-table
            v-loading="loading.table"
            :data="tableData"
            border
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            style="width: 100%"
            class="dataTable"
            v-horizontal-scroll="'always'"
          >
            <el-table-column prop="groupName" label="所属分组" />
            <el-table-column prop="name" label="店铺运营昵称" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="memberLevelName" label="店铺运营等级" />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <span v-if="scope.row.type == 1">线上</span>
                <span v-else-if="scope.row.type == 2">线下</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="total" label="消费总额" /> -->
            <el-table-column prop="buyers" label="下载次数" />
            <!-- <el-table-column prop="credit" label="剩余积分" /> -->
            <el-table-column prop="time" label="最近下载时间" />
            <el-table-column prop="createTime" label="注册时间" />
            <!-- <el-table-column
              :formatter="(row) => (row.registerIp ? row.registerIp : '-')"
              label="注册IP"
              show-overflow-tooltip
            />
            <el-table-column
              :formatter="(row) => (row.lastLoginIp ? row.lastLoginIp : '-')"
              prop="time"
              label="最后登录IP"
              show-overflow-tooltip
            /> -->
            <el-table-column label="操作" fixed="right">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click.native.prevent="details(scope.row)"
                >详情</el-button>
                <el-button
                  type="primary"
                  link
                  @click.native.prevent="edit(scope.row)"
                >编辑</el-button>
                <!-- <el-button
                  type="primary"
                  link
                  @click.native.prevent="setIntegral(scope.row)"
                >设置积分</el-button> -->
                <!-- <el-button
                  type="primary"
                  link
                  @click.native.prevent="makeTag(scope.row.buyerUserId)"
                >打标签</el-button> -->
                <el-button
                  type="primary"
                  link
                  @click.native.prevent="addBlackList(scope.row)"
                >
                  {{ scope.row.ifBlack ? '取消禁用' : '禁用' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              :current-page="formParams.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="formParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        <!-- </div> -->
      </div>
    <!-- </div> -->

    <!-- *************对话框开始************* -->
    <!-- 打标签 -->
    <el-dialog
      v-model="addFormDialog"
      title="选择标签"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div>
        <!-- 表单搜索 -->
        <el-form :inline="true" :model="tipsForm">
          <el-form-item label="标签名称">
            <el-input
              v-model="tipsForm.labelName"
              maxlength="20"
              placeholder="请输入标签名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="searchTips">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" link @click="runTips">管理标签</el-button>
          </el-form-item>
        </el-form>
        <!-- 多选 -->
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(item, index) in tipsList"
            :key="index"
            class="checkBoxStyle"
            :label="item.buyerLabelId"
          >{{ item.labelName }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveTips">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改店铺运营积分 -->
    <el-dialog
      v-model="editIntegral"
      title="修改店铺运营积分"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="credit = 0"
    >
      <el-form label-width="100px">
        <el-form-item label="修改积分">
          <el-radio-group v-model="updateWay" @change="changeWayRadio">
            <el-radio :label="true">增加</el-radio>
            <el-radio :label="false">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分">
          <el-input-number
            v-if="updateWay"
            v-model="credit"
            :min="0"
            :max="9999999"
          />
          <el-input-number v-if="!updateWay" v-model="credit" :max="0" />
        </el-form-item>
        <el-form-item style="margin-top: -18px; color: #999999">
          <span>提示 : 在原有积分上增加或减少</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editIntegral = false">取 消</el-button>
          <el-button type="primary" @click="saveIntegral">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增账号 -->
    <el-dialog
      v-model="addvisible"
      title="新增账号"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="addclose"
    >
      <el-form label-width="100px" :rules="rules" :model="addform">
        <!-- <el-form-item label="所属联营商" prop="merchantName">
          <el-select v-model="addform.merchantName" placeholder="请选择">
            <el-option v-for="(item, index) in merchantList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="昵称" prop="name">
          <el-input
            v-model="addform.name"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="addform.phone"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addform.password"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addform.type" placeholder="请选择类型" size="large" clearable>
            <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="款字头" prop="bndids" v-if="addform.type==1">
          <el-select
            v-model="addform.bndids" 
            placeholder="请选择款字头，支持搜索查询" 
            size="large" 
            clearable 
            multiple
            filterable
            collapse-tags 
            collapse-tags-tooltip
          >
            <el-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addvisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAccount">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 会员详情 -->
    <member-details ref="memberDetailsRef" @reset="reset" />

    <!-- 编辑账号 -->
    <el-dialog
      v-model="editvisible"
      title="编辑账号"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="editclose"
    >
      <el-form label-width="100px" :rules="editRules" :model="editform">
        <el-form-item label="昵称" prop="name">
          <el-input
            v-model="editform.name"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="editform.phone"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="editform.password"
            maxlength="11"
            clearable
            placeholder="不修改密码请留空"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editform.type" placeholder="请选择类型" size="large" clearable>
            <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="款字头" prop="bndids" v-if="editform.type==1">
          <el-select
            v-model="editform.bndids" 
            placeholder="请选择款字头，支持搜索查询" 
            size="large" 
            clearable 
            multiple
            filterable
            collapse-tags 
            collapse-tags-tooltip
          >
            <el-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editvisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAccount">保存</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
  </basic-container>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  addCustomer,
  customerMageGetAll,
  getLabels,
  getBrandList,
  getBndids,
  customerSaveUserLabel,
  customerBlacklist,
  updateBuyerCredit,
  exportBuyerUser,
  updateCustomer,
} from '@/api/customerMage'
// import { getSelect } from '../../../api/renovation'
import memberDetails from './details.vue'
// import { constants } from 'fs';
import { usernameSelect } from '@/api/business'

const router = useRouter()
const memberDetailsRef = ref(null)
let loading = reactive({
  table: false,
  export: false,
})
const formParams = ref({
  name: '', // 用户昵称
  phone: '', // 手机号
  labelId: '', // 标签id
  dates: [], // 最近消费时间日期数组
  minMoney: '', // 累计消费金额最小值
  maxMoney: '', // 累计消费金额最大值
  minBuyers: '', // 下载次数最小值
  maxBuyers: '', // 下载次数最大值
  startTime: '', // 申请开始时间
  endTime: '', // 申请结束时间
  type:'', //类型
  page: 1,
  pageSize: 10
})
const tipsForm = ref({
  labelName: ''
})
const total = ref(1)
const tableData = ref([])
const tipsList = ref([])
const checkList = ref([])
const addFormDialog = ref(false)
const editIntegral = ref(false)
const buyerUserId = ref('') // 用户id
const credit = ref(0) // 积分值 扣减积分则传负数
const updateWay = ref(true) // 修改积分单选绑定
const addvisible = ref(false) //新增窗口状态
const addform = ref({
  phone:'',
  password:'',
  verificationCode: 9999,
  merchantName:'',
  name:'',
  type:1,
  bndids:[],
})
const editvisible = ref(false) // 编辑窗口状态
const editform = ref({
  buyerUserId: '',
  phone:'',
  password:'',
  name:'',
  type:0,
})

const types = ref([
  {
  id: 1,
  name:'线上',
  },
  {
  id: 2,
  name:'线下',
  }
])

const brands = ref([])

const merchantList = ref([])

const rules = ref({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '目前只支持中国大陆的手机号码',
    },
  ],
  merchantName: [
    { required: true, message: '请选择联营商', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请输入类型', trigger: 'blur' },
  ],
})

// 编辑表单的验证规则
const editRules = ref({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '目前只支持中国大陆的手机号码',
    },
  ],
  type: [
    { required: true, message: '请输入类型', trigger: 'blur' },
  ],
})

onBeforeMount(() => {
  getAll()
  getSelect({ labelName: '' })
  getBrands()
})

/**
 * 导出
 */
function handleExport () {
  ElMessage({
    message: '数据导出中，请勿重复操作！',
    type: 'success',
  })
  loading.export = true
  exportBuyerUser(formParams.value).then(res => {
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const fileName = '用户列表.xls'
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.href = URL.createObjectURL(blob)
      elink.style.display = 'none'
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }).finally(() => {
    loading.export = false
  })
}
const handleSizeChange = (val) => {
  formParams.value.pageSize = val
  getAll()
}
const handleCurrentChange = (val) => {
  formParams.value.page = val
  getAll()
}
// 查询
const search = () => {
  total.value = 1
  formParams.value.page = 1
  getAll()
}
// 查询标签
const searchTips = () => {
  getSelect({ labelName: tipsForm.value.labelName })
}
const changeWayRadio = (val) => {
  updateWay.value = val
}
// 设置积分（更新积分）
const setIntegral = (row) => {
  editIntegral.value = true
  buyerUserId.value = row.buyerUserId
}
function saveIntegral () {
  if (credit.value === '' || credit.value === undefined) {
    return ElMessage('积分不能为空！')
  } else if (credit.value === 0) {
    return ElMessage('请输入修改积分')
  } else {
    updateBuyerCredit({
      buyerUserId: buyerUserId.value,
      credit: credit.value,
    }).then(res => {
      if (res.code === '') {
        getAll()
        editIntegral.value = false
        ElMessage.success('修改积分成功')
      }
    })
  }
}

function getBrands () {
  getBrandList().then(res => {
    console.log('获取款字头列表',res);
    brands.value = res.data
  })
}
// 打标签
function saveTips (row) {
  customerSaveUserLabel({
    buyerUserId: buyerUserId.value,
    buyerLabelIds: checkList.value,
  }).then(res => {
    if (res.code === '') {
      ElMessage.success('成功')
      checkList.value = []
      tipsForm.value.labelName = ''
      addFormDialog.value = false
    }
  })
}
// 禁用
const addBlackList = (row) => {
  //  "ifBlack": "是否禁用 1-是 0-否"
  ElMessageBox.confirm(
    `${
      row.ifBlack
        ? '确认是否取消禁用'
        : '禁用后，对方将无法登录商城'
    }`,
    `${row.ifBlack ? '取消禁用' : '禁用'}`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      customerBlacklist({
        buyerUserId: row.buyerUserId,
        ifBlack: row.ifBlack ? 0 : 1,
      }).then((res) => {
        if (res.code === '') {
          ElMessage.success('成功!')
          getAll()
        }
      })
    })
    .catch(() => {})
}
// 跳转标签页面
const runTips = () => {
  router.push({
    path: '/member/tips',
  })
}
// 清除
const clear = () => {
  formParams.value = {
    name: '', // 用户昵称
    phone: '', // 手机号
    labelId: '', // 标签id
    dates: [], // 最近消费时间日期数组
    minMoney: '', // 累计消费金额最小值
    maxMoney: '', // 累计消费金额最大值
    minBuyers: '', // 下载次数最小值
    maxBuyers: '', // 下载次数最大值
    page: 1,
    pageSize: 10
  }
  getAll()
}

const add = () =>{
  addvisible.value = true
  // usernameSelect().then((res)=>{
  //   console.log("处理res",res)
  //   merchantList.value = res.data
  // })
}

const addclose = () =>{
  addvisible.value=false
}

const saveAccount = () =>{
  // let reg = /^1[13456789]\d{9}$/;
  // if (!reg.test(addform.value.phone)) {
  //   ElMessage({
  //     message: '手机号格式错误',
  //     type: 'error',
  //     customClass: 'messageZindex',
  //   })
  //   return
  // }
  let params = {
    phone:addform.value.phone,
    password:addform.value.password,
    verificationCode:addform.value.verificationCode,
    terminal: 5,
    merchantName:addform.value.merchantName,
    name:addform.value.name,
    type:addform.value.type,
    bndids:addform.value.bndids
  }
  console.log('新增的参数',params);
  addCustomer(params).then((res)=>{
    console.log('新增的res',res);
    ElMessage.success('新增成功!')
    addvisible.value = false
    getAll()
  })
}

// 打标签
const makeTag = (id) => {
  checkList.value = []
  tipsForm.value.labelName = ''
  addFormDialog.value = true
  buyerUserId.value = id
}
const details = (row) => {
  // this.$router.push({
  //   name: 'customerDetails',
  //   params: { buyerUserId: row.buyerUserId, orderFormid: row.orderFormid }
  // })
  memberDetailsRef.value.getUser({
    buyerUserId: row.buyerUserId,
    orderFormid: row.orderFormid,
  })
}
// 初始化查询所有数据
function getAll () {
  loading.table = true
  customerMageGetAll(formParams.value).then(res => {
    tableData.value = res.data && res.data.list || []
    total.value = res.data && res.data.total || 0
  }).finally(() => {
    loading.table = false
  })
}
// 初始化查询所有标签
function getSelect (name) {
  getLabels(name).then(res => {
    tipsList.value = res.data || []
  })
}
const reset = () => {
  getAll()
}

async function queryBndids(buyerUserId){
  let bndids = []
  await getBndids({buyerUserId:buyerUserId}).then(res => {
    bndids = res.data
  })
  return bndids
}

// 编辑账号
async function edit (row) {
  console.log('row',row);
  let bndids = await queryBndids(row.buyerUserId)
  editform.value = {
    buyerUserId: row.buyerUserId,
    phone: row.phone,
    password: '',
    name: row.name,
    type:row.type,
    bndids:bndids
  }
  editvisible.value = true
}

const editclose = () => {
  editvisible.value = false
}

const updateAccount = () => {
  let params = {
    buyerUserId: editform.value.buyerUserId,
    phone: editform.value.phone,
    name: editform.value.name,
    type: editform.value.type,
    bndids:editform.value.bndids
  }
  // 如果密码不为空，则添加到参数中
  if (editform.value.password) {
    params.password = editform.value.password
  }
  
  updateCustomer(params).then((res) => {
    ElMessage.success('修改成功!')
    editvisible.value = false
    getAll()
  })
}
</script>

<style lang="scss" scoped>
.custom_page {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
}
.checkBoxStyle {
  margin-bottom: 20px;
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