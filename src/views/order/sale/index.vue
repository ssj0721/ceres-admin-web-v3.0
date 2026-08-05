<template>
  <basic-container class="container">
  <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm002</div>
  <div class="pending">
    <!-- <div class="tab_show"> -->
      <mybottons>
      <!-- 搜索 -->
      <el-form
        :inline="true"
        :model="formInline"
      >
        <el-form-item label="供应商名称">
          <el-select v-model="formInline.shopIds" placeholder="请选择供应商" clearable multiple size="large" style="width: 200px">
            <el-option v-for="shop in shops" :key="shop.shopId" :label="shop.shopName" :value="shop.shopId" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" v-if="permission" style="width: 250px">
          <selectAll v-model="formInline.brandId" :multiple="true" :placeholder="'请选择品牌'" :options="brandList"/>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="formInline.search"
            maxlength="20"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="计划销售日期">
          <el-date-picker
            v-model="formInline.dates"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="search"
          >查询
          </el-button>
          <el-button
            type="primary"
            :disabled="!rowisfinish"
            @click="dialogVisible = true"
          >生成采购单
          </el-button>
          <el-button
            type="primary"
            @click="exportSale"
          >根据查询条件导出
          </el-button>
        </el-form-item>
      </el-form>
    </mybottons>
      <!-- 表格 -->
      <div class="second-main-container">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        class="dataTable"
        v-horizontal-scroll="'always'"
        @row-dblclick="rowclick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="productId" label="商品id" width="70" show-overflow-tooltip />
        <el-table-column 
          label="商品图片" 
          width="200"
          >
          <template #default="scope">
            <img height="80" width="80" :src="scope.row.image" alt srcset />
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          width="250"
        />
        <el-table-column
          prop="shopName"
          label="商品所属供应商"
          width="250"
        />
        <el-table-column
          prop="isFinish"
          label="是否可生成采购单"
          width="180"
        >
          <template #default="scope">
            <span>{{scope.row.isFinish ? "可生成" : "不可生成"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="原因"
          width="380"
        />

        <!-- <el-table-column
          label="操作"
        >
          <template #default="scope">
            <div class="btnList">
              <el-button
                link
                type="primary"
                @click="seeMore(scope.row)"
              >查看
              </el-button>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination-container">
      <el-pagination
        :current-page="formInline.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    </div>
    </div>
    <el-dialog
      v-model="detailVisible"
      title="详情"
      center
      :fullscreen="true"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
    <mybottons>
      <el-form
        :inline="true"
        :model="formInline2"
      >
        <el-form-item label="运营团队名称">
          <el-select v-model="formInline2.buyerGroups" placeholder="请选择运营团队" clearable multiple size="large" style="width: 200px">
            <el-option v-for="group in buyerGroups" :key="group.id" :label="group.name" :value="group.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划销售日期">
          <el-date-picker
            v-model="formInline2.dates"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="innerSearch"
          >查询
          </el-button>
          <el-button
            type="primary"
            :disabled="!rowisfinish"
            @click="dialogVisible2 = true"
          >生成采购单
          </el-button>
        </el-form-item>
      </el-form>
    </mybottons>
    <el-table
        v-loading="tableLoading"
        :data="tableData2"
        border
        stripe
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        class="dataTable"
        v-horizontal-scroll="'always'"
        @selection-change="innerSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="saleId" label="需求单id" width="100" show-overflow-tooltip />
        <el-table-column
          prop="creater"
          label="下单商户"
          width="220"
        />
        <el-table-column
          prop="size"
          label="尺码"
          width="150"
        />
        <el-table-column
          prop="color"
          label="颜色"
          width="150"
        />
        <el-table-column
          prop="price"
          label="价格"
          width="150"
        />
        <el-table-column
          prop="number"
          label="数量"
          width="150"
        />
        <el-table-column
          prop="saledate"
          label="计划销售日期"
          width="200"
        />
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="200"
        />
        <el-table-column
          prop="isCreateOrder"
          label="是否已生成采购单"
          width="500"
        >
          <template #default="scope">
            <span>{{scope.row.isCreateOrder ? "已生成" : "未生成"}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
      <el-pagination
        :current-page="formInline2.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formInline2.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total2"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
      />
    </div>
    </el-dialog>

    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="500"
      :before-close="handleClose"
    >
      <span>是否确定生成采购单</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createByProductIds">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogVisible2"
      title="提示"
      width="500"
      :before-close="handleClose"
    >
      <span>是否确定生成采购单</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="createBySaleIds">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script setup>
import OrderDetail from '@/views/order/pending/pendDetails.vue'
import { getsaleList,saleExport,getBuyerGroups,createOrderEs } from '@/api/sale'
import { getBrandList,findPermission } from '@/api/commodity'
import { onMounted, ref } from 'vue';
import { getshop } from '@/api/shopSys'
import { ElLoading,ElMessage } from 'element-plus'

const formInline = ref({
  search: '', // 搜索字段
  dates: [], // 选款时间数组
  page: 1,
  pageSize: 10,
  shopIds:[],
  brandId:[]
})
const formInline2 = ref({
  dates: [],
  buyerGroups:[],
  page: 1,
  pageSize: 10,
})
const total = ref(1)
const tableData = ref([])
const tableLoading = ref(false)
const detailVisible = ref(false)
const total2 = ref(1)
const tableData2 = ref([])
const tableLoading2 = ref(false)
const rowproductid = ref()
const rowisfinish = ref(true)
const form = ref({})
let shops = ref([]);
const buyerGroups = ref([])
const multipleSelection = ref([]) //外部筛选
const innerSelection = ref([]) //内部筛选
const permission = ref(true)  // 区分是供应连true还是智慧供销false
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)

/** 品牌数据 */
let brandList = ref([]);
function getBrandListData() {
  getBrandList().then(res => {
    brandList.value = res.data
  })
}

function getShopName() {
  getshop().then(res => {
    shops.value = res.data
    // form.value.shopId = shop.value.shopId
  })
}

function queryBuyerGroups() {
  getBuyerGroups().then(res => {
    buyerGroups.value = res.data
  })
}

function findpermission() {
  findPermission().then(res => {
    permission.value = (res.data == '1')
  })
}

onMounted(() => {
  // handleClick({ name: '' })
  getShopName()
  getBrandListData()
  queryBuyerGroups()
  findpermission()
  getAll(formInline.value)
})

function handleSizeChange (val) {
  formInline.value.pageSize = val
  getAll(formInline.value)
}

function handleCurrentChange (val) {
  formInline.value.page = val
  getAll(formInline.value)
}

function handleSizeChange2 (val) {
  formInline2.value.pageSize = val
  getSecond()
}

function handleCurrentChange2 (val) {
  formInline2.value.page = val
  getSecond()
}

//  查询
function search () {
  total.value = 1
  formInline.value.page = 1
  getAll(formInline.value)
}

//  查询
function innerSearch () {
  total2.value = 1
  formInline2.value.page = 1
  console.log('商品id',rowproductid.value);
  getSecond()
}

function cancel () {
  console.log('二级页面关闭');
  detailVisible.value = false
  rowproductid.value = 0
  innerSelection.value = []
}

// 初始化查询所有数据
async function getAll(formInline) {
  detailVisible.value = false
  tableLoading.value = true
  console.log('查询的参数',formInline,formInline.brandId);
  await getsaleList(formInline).then(res => {
    console.log('查询的结果',res);
    tableData.value = res.data.list
    total.value = res.data.total
  })
  tableLoading.value = false
}

function rowclick (row) {
  console.log('点击的行',row);
  rowproductid.value = row.productId
  rowisfinish.value = row.isFinish
  multipleSelection.value = []
  getSecond()
}

// 初始化查询二级数据
async function getSecond() {
  detailVisible.value = true
  tableLoading2.value = true
  let params = {
    productId:rowproductid.value != 0 ? rowproductid.value : null,
    buyerGroups:formInline2.value.buyerGroups,
    dates:formInline2.value.dates,
    page:formInline2.value.page,
    pageSize:formInline2.value.pageSize
  }
  await getsaleList(params).then(res => {
    console.log('查询22222的结果',res);
    tableData2.value = res.data.list
  })
  tableLoading2.value = false
}

const exportSale = () => {
  tableLoading.value = true
  saleExport(formInline.value).then((res) => {
    console.log('导出的res',res);
    const blob = new Blob([res])
    const fileName = '销售需求单列表.xlsx'
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    tableLoading.value = false
  })
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  for(let i=0; multipleSelection.value.length>i; i++){
    if(!multipleSelection.value[i].isFinish){
      rowisfinish.value = false
      break;
    }else{
      rowisfinish.value = true
    }
  }
  console.log("复选框变化", multipleSelection)
}

const innerSelectionChange = (val) => {
  innerSelection.value = val
  console.log("内部复选框变化", innerSelection)
}

//根据销售需求单的id生成采购单
async function createBySaleIds() {
  var loading = ElLoading.service({ fullscreen: true })
  const ids = innerSelection.value.map(item => item.saleId);
  let params = {
    saleIds:ids
  }
  await createOrderEs(params).then(res => {
    console.log('根据销售需求单的id生成采购单的结果',res);
    if (res.message == 'success') {
      ElMessage.success("生成采购单成功！");
    }else if(res.message == 'notallsuccess'){
      ElMessage.warning("生成采购单失败！");
    }
  }).catch(error => {
      console.error('发生错误', error);
  }).finally(() => {
    loading.close();
  });
  dialogVisible2.value = false
  getSecond()
}

//根据商品的id生成采购单
async function createByProductIds() {
  var loading = ElLoading.service({ fullscreen: true })
  const ids = multipleSelection.value.map(item => item.productId);
  let params = {
    productIds:ids
  }
  await createOrderEs(params).then(res => {
    console.log('根据商品的id生成采购单的结果',res);
    if (res.message == 'success') {
      ElMessage.success("生成采购单成功！");
    }else if(res.message == 'notallsuccess'){
      ElMessage.warning("生成采购单失败！");
    }
  }).catch(error => {
      console.error('发生错误', error);
  }).finally(() => {
    loading.close();
  });
  dialogVisible.value = false
  getAll(formInline.value)
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

.dialog-footer{
  padding: 0 5px 10px 0;
}
// .pending {
//   padding: 20px;
//   margin-top: 20px;
//   background-color: #FFFFFF;
// }
// .tab_show {
//   padding-left: 30px;
// }
</style>
