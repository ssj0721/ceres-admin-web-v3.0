<template>
  <basic-container class="container">
    <div class="pic">
      <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm001</div>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="供货商新增款式" />
        <el-step class="step" title="联营商款式预审核" />
        <el-step class="step" title="运营团队选款" />
        <el-step class="step" title="送品牌方审款" />
        <el-step class="step" title="品牌方审款" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <el-dialog v-model="imgstate"  title="流程图" style="width: 850px; height: 700px; text-align: center;">
      <img style="width: 800px; height: 550px;" width="100%" :src="auditpic" alt >
    </el-dialog>
    <div class="pending">
      <!-- 搜索 -->
      <mybottons>
        <!-- <div class="topSearch"> -->
        <div class="rightBTn" style="width: 100%;">
          <!-- <el-button type="primary" @click="addTips">新建标签</el-button> -->
          <!-- <el-button type="primary" @click="exportTips">导出</el-button> -->
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="audits">批量审批</el-button>
          <el-button type="primary" @click="exportTips2">导出初审资料</el-button>
          <el-button type="primary" @click="sends">导入补充资料</el-button>
          <el-button type="primary" @click="Submittals">送品牌方审批</el-button>
          <!-- <el-button type="primary" @click="serchPic(false)">预审搜图</el-button> -->
          <div class="formSearch">
            <el-form :inline="true" :model="formInline" style="width: 100%;">
              <el-form-item label="款字头" style="width: 30%;" label-width="40%">
                <el-select v-model="formInline.brandId" placeholder="请选择款字头" clearable size="large">
                  <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="款号" label-width="12%" style="width: 66%;">
              <el-input
                v-model="formInline.itemcode"
                maxlength="20"
                style="width: 150%;"
                placeholder="多款用空格、半角逗号或换行符分隔，单款时模糊查询"
              />
            </el-form-item> -->

          <el-form-item label="商品名称" label-width="40%" style="width: 30%;">
            <el-input v-model="formInline.productName" maxlength="20" placeholder="商品名称" />
          </el-form-item>
          <el-form-item label="供应商名称" label-width="40%" style="width: 30%;">
            <el-input v-model="formInline.supplierName" maxlength="20" style="width: 100%;" placeholder="请填入供应商名称" />
          </el-form-item>
          <el-form-item label="联营商审批" label-width="40%" style="width: 30%;">
            <el-select v-model="formInline.ifcredit" placeholder="请选择状态" clearable multiple size="large">
              <el-option label="通过" value="1" />
              <el-option label="待审" value="2" />
              <el-option label="否决" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌商审款状态" label-width="40%" style="width: 30%;">
            <el-select v-model="formInline.irestates" placeholder="请选择品牌商审款状态" clearable multiple size="large"
              collapse-tags>
              <el-option label="待审" value="APPROVED" />
              <el-option label="作废" value="CANCELED" />
              <el-option label="通过" value="ACCECTED" />
              <el-option label="否决" value="REJECTED" />
              <!-- <el-option label="INSIGNING1" value="INSIGNING1" /> -->
              <!-- <el-option label="待申诉" value="INSIGNING2" />
              <el-option label="申诉中" value="INSIGNING3" />
              <el-option label="作废申请" value="CANCELED00" />
              <el-option label="待批办" value="APPROVED00" />
              <el-option label="暂缓" value="SUSPEND" />
              <el-option label="草稿" value="DRAFT" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="联营商代码" label-width="40%" style="width: 30%;">
            <el-input v-model="formInline.orgcode" maxlength="20" placeholder="请输入联营商代码" />
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item> -->
        </el-form>
      </div>
      </div>
      <br>
    <!-- </div> -->
  </mybottons>
    <!-- 表格 -->
    <div class="second-main-container">
    <el-table v-loading="tableLoading" :data="tableData" border
      :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" tooltip-effect="dark" style="width: 100%"
      max-height="500" class="dataTable" @selection-change="handleSelectionChange" v-horizontal-scroll="'always'">
      <el-table-column type="selection" />
      <el-table-column label="商品ID" width="70">
        <template #default="scope">{{ scope.row.productId }}</template>
      </el-table-column>
      <el-table-column prop="state" label="联营商审批" width="100%">
        <template #default="scope">
          <span v-if="scope.row.state == 0">草稿</span>
          <span v-if="scope.row.state == 1">通过</span>
          <span v-if="scope.row.state == 2">待审</span>
          <span v-if="scope.row.state == 3">否决</span>
        </template>
      </el-table-column>
      <el-table-column prop="found" label="真维斯审批" width="100%">
        <template #default="scope">
          <span v-if="scope.row.found == true">已送出</span>
          <span v-if="scope.row.found == false">未送出</span>
        </template>
      </el-table-column>
      <el-table-column prop="ireState" label="品牌商审款状态" width="125">
        <template #default="scope">
          <span v-if="scope.row.ireState == 1">待审</span>
          <span v-if="scope.row.ireState == 2">作废</span>
          <!-- <span v-if="scope.row.ireState == 2">否决</span> -->
          <span v-if="scope.row.ireState == 3">通过</span>
          <span v-if="scope.row.ireState == 4">否决</span>
          <!-- 暂时把否决之后的操作状态改为否决，因为申述的流程还涉及到采购部门 -->
          <!-- <span v-if="scope.row.ireState == 5">否决</span>
          <span v-if="scope.row.ireState == 6">否决</span>
          <span v-if="scope.row.ireState == 7">否决</span>
          <span v-if="scope.row.ireState == 8">否决</span>
          <span v-if="scope.row.ireState == 9">待批办</span>
          <span v-if="scope.row.ireState == 10">否决</span> -->
          <span v-if="scope.row.ireState == 5">INSIGNING1</span>
          <span v-if="scope.row.ireState == 6">待申诉</span>
          <span v-if="scope.row.ireState == 7">申诉中</span>
          <span v-if="scope.row.ireState == 8">作废申请</span>
          <span v-if="scope.row.ireState == 9">待批办</span>
          <span v-if="scope.row.ireState == 10">暂缓</span>
          <span v-if="scope.row.ireState == 11"></span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌*" width="100" />
      <el-table-column prop="itemcode" label="款号*" width="130" />
      <el-table-column label="商品主图" width="150">
        <template #default="scope">
          <img height="80" width="80" :src="scope.row.image" alt srcset />
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="140"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" width="150"/>
      <el-table-column prop="createTime" label="创建时间" width="130" />
      <!-- <el-table-column prop="isExport" label="导出否" width="80">
          <template #default="scope">
            <span v-if="scope.row.isExport == 1">已导</span>
            <span v-if="scope.row.isExport == 2">未导</span>
          </template>
        </el-table-column> -->
          <!-- <el-table-column prop="state" label="真维斯审批" width="90"/> -->
          <!-- <el-table-column prop="state" label="真维斯审批" width="90">
          <template #default="scope">
            <span v-if="scope.row.state == 0">草稿</span>
            <span v-if="scope.row.state == 1">通过</span>
            <span v-if="scope.row.state == 2">待审</span>
            <span v-if="scope.row.state == 3">否决</span>
          </template>
        </el-table-column> -->
          <el-table-column prop="orgin" label="组织" width="120" />
          <el-table-column prop="bndId" label="款字头" width="80" />
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="quarter" label="季度" width="80" />
          <el-table-column prop="yearquarter" label="年份季度" width="100" /> >
          <el-table-column prop="sex" label="性别" width="80">
            <template #default="scope">
              <span v-if="scope.row.sex == 'M'">男</span>
              <span v-if="scope.row.sex == 'L'">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="lcName" label="大类" width="100" />
          <el-table-column prop="depName" label="品种" width="100" />
          <el-table-column prop="scName" label="类别" width="100" />
          <el-table-column prop="poitemclass" label="二分类" width="100" />
          <el-table-column prop="isAdult" label="成人/童装" width="100">
            <template #default="scope">
              <span v-if="scope.row.isAdult == 0">童装</span>
              <span v-if="scope.row.isAdult == 1">成人</span>
            </template>
          </el-table-column>
          <el-table-column prop="isBase" label="基本/非基本" width="100">
            <template #default="scope">
              <span v-if="scope.row.isBase == 0">非基本</span>
              <span v-if="scope.row.isBase == 1">基本</span>
            </template>
          </el-table-column>
          <el-table-column prop="priceName" label="品种细分" width="150" />
          <!-- <el-table-column prop="priceList" label="价位" width="150" /> -->
          <el-table-column prop="plansaledate" label="销售季期" width="100" />
          <el-table-column prop="isCombo" label="组合款/换款号" width="100">
            <template #default="scope">
              <span v-if="scope.row.isCombo == 0">正常款</span>
              <span v-if="scope.row.isCombo == 1">组合款</span>
              <span v-if="scope.row.isCombo == 2">换款号</span>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="平台" width="100" />
          <el-table-column prop="salechannellist" label="销售渠道" width="100" >
            <template #default="scope">
              <span v-if="scope.row.salechannellist == 'LYD'">联营店</span>
              <span v-if="scope.row.salechannellist == 'ZYD'">联营款</span>
              <span v-if="scope.row.salechannellist == 'LYZG'">联营专供</span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="found" label="是否送出">
          <template #default="scope">
            <span v-if="scope.row.found == true">已送出</span>
            <span v-if="scope.row.found == false">未送出</span>
          </template>
        </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <div class="btnList">
                <el-button link type="primary" @click="seeMore(scope.row)">查看</el-button>
                <el-button link type="primary" @click="audit(scope.row)" v-if="scope.row.state == '2'">审批</el-button>
                <!-- <el-button type="primary" link @click="edit(scope.row)">编辑</el-button> -->
                <el-button type="primary" link @click="edit(scope.row)" v-if="!scope.row.found && scope.row.isJeans">补充资料</el-button>
                <el-button type="primary" link @click="serchPic(scope.row)" v-if="scope.row.isJeans">预审搜图</el-button>
                <el-popconfirm title="确认删除？" @confirm="deleteTips(scope.row)" v-if="scope.row.state == '0'">
                  <template #reference>
                    <el-button type="danger" link>删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 批量删除 -->
      <!-- <div class="batch_btn">
        <el-button
          plain
          :disabled="!multipleSelection.length"
          @click="deleteTips"
        >批量删除</el-button>
      </div> -->
      <div class="bottomnav">
        <div>
          <p>操作声明</p>
          <p>1、审批：进入审批窗体</p>
          <p>2、查看：进入查看窗体</p>
        </div>
        <div class="pagination-container">
          <el-pagination :current-page="formInline.page" :page-sizes="[10, 20, 50, 100]" :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next, jumper" background :total="total" style="margin: 12px 0;"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>

      <!-- ******************************************************弹框开始***************************************************************** -->
      <!-- 达标详情弹框 -->
      <el-dialog v-model="dialogVisible" title="达标详情" width="30%" center :close-on-click-modal="false">
        <div class="diaddStyle">
          <h1>满足以下任意条件即可</h1>
          <div class="jiaoyi">
            <div class="leftJ">交易条件:</div>
            <div class="rightJ">
              <p v-for="(item, index) in text" :key="index">{{ item }}</p>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">我知道了</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- <tips-form ref="tipsFormRef" @reset="reset" /> -->
      <el-dialog v-model="detailsVisible" :align-center="true" title="查看商家" width="74%" center :style="{ left: '60px' }"
        :close-on-click-modal="false" @close="closeModal">
        <CommAdd ref="commFormRef" :product-code="productCode" :product-id="currentProduct.productId" :isSee="true"
          @cancel="cancelForm" />
        <!-- <div> -->
        <!-- <el-descriptions v-loading="detailLoading" class="see" :column="2" size="large">
            <el-descriptions-item label="商品ID&nbsp;&nbsp;&nbsp;&nbsp;:">{{ formData.productId }}</el-descriptions-item>
            <el-descriptions-item label="品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌:">{{ formData.brandName }}</el-descriptions-item>
            <el-descriptions-item label="款&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:">{{ formData.itemcode }}</el-descriptions-item>
            <el-descriptions-item label="商品名称:">{{ formData.productName }}</el-descriptions-item>
            <el-descriptions-item label="商品主图:">
              <div>
                  <img
                    :src="formData.image"
                    alt=""
                    @click="handlePictureCardPreview(formData)"
                  />
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="供应商名称:">{{ formData.supplierName }}</el-descriptions-item>
          </el-descriptions> -->
        <div style="position: relative; left: 8%;">
          <div style="margin-bottom: 15px;margin-top: 20px;">审批历程:</div>
          <li v-for="(item, index) of history" :key="index" style="font-size: smaller;">{{ item }}</li>
          <!-- <div>2023-12-19 ......</div> -->
        </div>
        <!-- <el-button type="primary" @click="detailsVisible=false" style="position: relative; left: 90%;">取消</el-button>
        </div> -->
      </el-dialog>

      <el-dialog v-model="auditVisible" :align-center="true" title="审批" width="74%" center :close-on-click-modal="false"
        @close="closeModal">
        <CommAdd ref="commFormRef" :product-code="productCode" :product-id="currentProduct.productId"
          @cancel="cancelForm" />
        <el-card style="margin-top: 1%;">
          <div style="position: relative;">
            <el-form :model="form" label-width="100px">
              <el-form-item label="审批意见">
                <el-input v-model="form.reviewComments" type="textarea" placeholder="请输入审批意见" :rows="8"></el-input>
              </el-form-item>
              <el-form-item label="否决原因">
                <el-select v-model="form.remark" placeholder="请选择">
                  <el-option v-for="item in rejectReasons" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
              <el-form-item class="auditbuttonmain">
                <span class="auditbutton">
                  <el-button type="primary" @click="auditAccept(form, 1)">通过</el-button>
                  <el-button type="primary" @click="auditReject(form, 1)">否决</el-button>
                  <el-button type="primary" @click="auditVisible = false">关闭</el-button>
                </span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-dialog>

      <el-dialog v-model="auditVisible2" :align-center="true" title="批量审批" width="74%" center
        :close-on-click-modal="false" @close="closeModal3">
        <el-card style="margin-top: 1%;">
          <div style="position: relative;">
            <el-form :model="form" label-width="100px">
              <el-form-item label="审批意见">
                <el-input v-model="form.reviewComments" type="textarea" placeholder="请输入审批意见" :rows="8"></el-input>
              </el-form-item>
              <el-form-item label="否决原因">
                <el-select v-model="form.remark" placeholder="请选择">
                  <el-option v-for="item in rejectReasons" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
              <el-form-item class="auditbuttonmain">
                <span class="auditbutton">
                  <el-button type="primary" @click="auditAccept(form, 2)">通过</el-button>
                  <el-button type="primary" @click="auditReject(form, 2)">否决</el-button>
                  <el-button type="primary" @click="auditVisible2 = false">关闭</el-button>
                </span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-dialog>

      <el-dialog v-model="imageVisible" append-to-body class="check-image-dialog" width="50%" title="查看图片"
        center="center">
        <img :src="dialogImageUrl" style="
            display: block;
            margin: auto;
            max-width: 80%;
            max-height: 80%;
          " alt />
      </el-dialog>

      <EditDialog v-model:editVisible="editVisible" v-model:editloading="editloading" :editRow="editRow" @getAll="getAll"></EditDialog>

      <!-- 导入补充资料 -->
      <ImportDialog v-model:productImport="productImport" v-model:uploading="uploading" :batchFileList="batchFileList" @getAll="getAll"></ImportDialog>

      <!--预审搜图-->
      <el-dialog v-model="searchPicVisible" title="预审搜图" :close-on-click-modal="false" :fullscreen="true" center
        width="1000px" @close="closeSearchPic">
        <!-- <el-button @click="closeSearchPic" style="position: relative; right">关闭</el-button> -->
        <SearchPic :imagelist="imagelist" :isClose="isClose" :isSee="true" :productId="picproductid"
          @close="closeSearchPic">
        </SearchPic>
      </el-dialog>
    </div>
  </basic-container>
</template>
  
<script setup>
import { getBrandList, getClassifyDelete, getProductCode } from '@/api/commodity'
import { brandGetAll, editProduct, getById, getEdit, getSKimage, getdepName, getlcName, getpriceName, 
  getscName, productExport, stateAccept, stateReject, getRejectReasons, queryitemcode, getPoItemClassList,getPlatformList,getSKBrandList,getDictList } from '@/api/itemaudit/ait001'
import { Submit, importProduct, productExport2, productExportErr } from '@/api/itemaudit/ait002'
import SearchPic from '@/components/searchPic/SearchPic.vue'
import { getToken } from '@/utils/auth'
import CommAdd from '@/views/itemaudit/iat_001/addCommodity.vue'
import { ElLoading,ElMessage } from 'element-plus'
import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import auditpic from '@/assets/images/audit.jpg'
import { useRoute } from 'vue-router'
import { excel } from '@/utils/excelExport'
// import TipsForm from './tipsForm.vue'

const formItem = ref()
let imgstate = ref(false)
//预审搜图
const searchPicVisible = ref(false)
const imagelist = ref([])
const isClose = ref(false)
const editRow = ref({})
const dialogImageUrl = ref('')
const editloading = ref(false)
const editVisible = ref(false)
const auditVisible = ref(false)
const auditVisible2 = ref(false)
const detailsVisible = ref(false)
const detailLoading = ref(false)
// const tipsFormRef = ref(null)
const tableLoading = ref(false)
const uploading = ref(false)
const reject = ref(false)
const formInline = ref({
  brandId: '', // 品牌
  brandName: '', // 品牌名称
  itemcode: '', //款号
  productName: '', // 商品名称
  supplierName: '', // 供应商名称
  ifcredit: [], // 联营商审批
  irestates: [],
  orgcode:'',//联营商代码
  page: 1,
  pageSize: 10
})

let currentProduct = reactive({
  productId: null
})

const commFormRef = ref();
let productCode = ref()

let visible = reactive({
  vipPrice: false,
  productImport: false,
  commidy: false,
})

const formData = ref({
  brandId: '', // 品牌
  brandName: '', // 品牌名称
  itemcode: '', //款号
  productName: '', // 商品名称
  supplierName: '', // 供应商名称
  state: '', // 联营商审批
  productId: '', //商品ID
  printItemCode: 0, //印花款号
  image: '', //商品主图
  fimages: '', //商品主图
  createTime: '', // 创建时间
  ifCredit: '', // 联营商审批
})
let imageVisible = ref(false)
let isaudit = ref(false)
const total = ref(1)
const tableData = ref([])
const dialogVisible = ref(false)
const text = ref('')
const multipleSelection = ref([])
const form = ref({ reviewComments: '', remark: '' })
let auditrow
let history = ref([])
let lclist = ref([])
let deplist = ref([])
let sclist = ref([])
let pricelist = ref([])
let picproductid = ref()
let rejectReasons = ref([])
let poItemClassList = ref([])
let platformList = ref([])
let devChannelList = ref([])
// let imageSrc

const formdisabled = ref(true) // 新增弹窗的form-item禁用状态

const handleSizeChange = (val) => {
  formInline.value.pageSize = val
  getAll()
}
const handleCurrentChange = (val) => {
  formInline.value.page = val
  getAll()
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log('选中的数据', multipleSelection.value);
}

// 查看
const seeMore = async (row) => {
  console.log("row", row);
  detailsVisible.value = true
  detailLoading.value = true
  visible.commidy = true
  currentProduct.productId = row.productId
  nextTick(() => {
    commFormRef.value.details()
  })
  // 自动获取内部商品编号
  // await getProductCode().then(res => {
  //   productCode = res.data
  // })
  try {
    const res = await getById({ productId: row.productId })
    if (res.code === '') {
      formData.value = res.data[0]
      history.value = res.data[1]
    }
  } finally {
    detailLoading.value = false
  }
}

const audits = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先选择需要批量审批的数据")
  } else {
    let isapproved = true
    multipleSelection.value.forEach(i => {
      if (i.state != 2) {
        isapproved = false
      }
    })
    if (!isapproved) {
      ElMessage.error("批量审批的数据状态必须为待审状态")
    } else auditVisible2.value = true
  }
}

// 审批
const audit = async (row) => {
  console.log("row111", row)
  auditVisible.value = true
  form.value.remark = ''
  form.value.reviewComments = ''
  auditrow = row
  visible.commidy = true
  currentProduct.productId = row.productId
  nextTick(() => {
    commFormRef.value.details()
  })
  // await getProductCode().then(res => {
  //   productCode = res.data
  // })
  // detailLoading.value = true
  // try {
  //   getAll()
  //   if (res.code === '') {
  //       formData.value = res.data.list
  //   }
  // } finally {
  //   detailLoading.value = false
  // }
}

const auditAccept = (form, index) => {
  console.log("form", form)
  if (index == 1) {
    console.log('进入单个审批');
    let params = {
      reviewComments: form.reviewComments,
      remark: form.remark,
      productId: auditrow.productId,
      action: "ACCEPT",
      state: "ACCEPTED",
    }
    console.log("审批通过的params", params);
    stateAccept(params).then((res) => {
      console.log("res", res)
      if (res.code === '') {
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
      }
      auditVisible.value = false
      console.log("通过成功了", res)
      auditrow = ''
      getAll()
    }).catch((error) => {
      console.log(error);
    });
  } else if (index == 2) {
    // if(multipleSelection.value.length==0){
    //   ElMessage.error("请先选择需要批量审批的数据")
    // }else{
    console.log('进入批量审批');
    console.log('选择批量通过的数据---', multipleSelection.value);
    multipleSelection.value.forEach(i => {
      let params = {
        reviewComments: form.reviewComments,
        remark: form.remark,
        productId: i.productId,
        action: "ACCEPT",
        state: "ACCEPTED",
      }
      console.log("批量审批通过的params", params);
      stateAccept(params).then((res) => {
        // console.log("res",res)
      }).catch((error) => {
        console.log(error);
      });
    });
    auditVisible2.value = false
    console.log("批量通过成功了")
    getAll()
    // }
  }

}

const auditReject = (form, index) => {
  if (form.remark === '') {
    ElMessage.error("请输入否决原因")
    return false;
  }
  if (index == 1) {
    console.log('进入单个审批');
    let params = {
      reviewComments: form.reviewComments,
      remark: form.remark,
      productId: auditrow.productId,
      action: "REJECT",
      state: "REJECTED",
    }
    console.log("审批否决的params", params);
    stateReject(params).then((res) => {
      auditVisible.value = false
      console.log("否决成功了", res)
      auditrow = ''
      getAll()
    }).catch((error) => {
      console.log(error);
    });
  } else if (index == 2) {
    console.log('进入批量审批');
    console.log('选择批量否决的数据---', multipleSelection.value);
    multipleSelection.value.forEach(i => {
      let params = {
        reviewComments: form.reviewComments,
        remark: form.remark,
        productId: i.productId,
        action: "REJECT",
        state: "REJECTED",
      }
      console.log("批量审批否决的params", params);
      stateReject(params).then((res) => {
        // console.log("res",res)
      }).catch((error) => {
        console.log(error);
      });
    });
    auditVisible2.value = false
    console.log("批量否决成功了")
    getAll()
  }

}
// 查询
const search = () => {
  total.value = 1
  formInline.value.page = 1
  getAll()
}
// 清楚
// const clear = () => {
//   formInline.value = {
//     labelName: '', // 标签名称
//     labelType: '', // 标签类型 1-手动标签 2-自动标签
//     page: 1,
//     pageSize: 10
//   }
//   getAll()
// }
// 编辑
// const edit = (row) => {
//   tipsFormRef.value.show({ buyerLabelId: row.buyerLabelId })
// }

// 初始化查询所有数据
const getAll = () => {
  tableLoading.value = true
  console.log('查询的参数', formInline.value);
  brandGetAll(formInline.value).then(res => {
    console.log("查询的res", res)
    tableData.value = res.data.list
    total.value = res.data.total
  }).finally(() => {
    tableLoading.value = false
  })
}

function handlePictureCardPreview(item) {
  dialogImageUrl.value = item.image
  imageVisible.value = true
}

const edit = (row) => {
  editVisible.value = true
  editloading.value = true
  editRow.value = row
}

// 送品牌方审批
function Singlesubmittals(id) {
  tableLoading.value = true
  const ids = []
  ids.push(id)
  console.log('单条---送品牌方审批的ids', ids);
  if (ids.length > 0) {
    Submit({ ids }).then((res) => {
      console.log(res);
      tableLoading.value = false
      ElMessage.success('送批成功')
      getAll()
    })
      .catch((err) => {
        // 当异步操作失败时，可以在这里处理错误情况
        // alert(err.response.status)
        tableLoading.value = false
        console.error(err)
      })
  } else ElMessage.error('无法获取到商品id')
}

// 详情弹框
const modelTouch = (row) => {
  text.value = row.conditions
  dialogVisible.value = true
}
// 删除
const deleteTips = async (row) => {
  let ids = []
  if (multipleSelection.value.length === 0) {
    ids = [row.buyerLabelId]
  } else {
    multipleSelection.value.forEach((item) => {
      ids.push(item.buyerLabelId)
    })
  }
  console.log("删除的row", row)
  const res = await getClassifyDelete({ productId: row.productId })
  if (res.code === '') {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getAll()
  }
}
// 导出标签
const exportTips = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择导出行')
    return
  }
  tableLoading.value = true
  const ids = []
  multipleSelection.value.forEach((item) => {
    ids.push(item.productId)
  })
  productExport({ ids }).then((res) => {
    const blob = new Blob([res])
    const fileName = '商品数据列表.xls'
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
// 重置
function clear() {
  // query.classifyId = null
  // query.search = ''
  // query.shelveState = ''
  // page.page = 1
  // getAll()
}

const reset = () => {
  getAll()
}
/** 品牌数据 */
let brandList = ref([]);
function getBrandListData() {
  //供应链自己的品牌
  // getBrandList().then(res => {
  //   console.log("品牌数据", res.data)
  //   brandList.value = res.data
  // })
  //审款获取的品牌
  getSKBrandList().then(res => {
    console.log("品牌数据", res.data)
    brandList.value = res.data
  })
}

function cancelForm() {
  console.log("点取消退出")
  // commFormRef.value?.reset()
  visible.commidy = false
  auditVisible.value = false
  detailsVisible.value = false
  clear()
  // getAll()
}

function closeModal() {
  console.log("点x退出")
  commFormRef.value?.reset()
  // getAll()
}

function closeModal3() {
  console.log("点x退出3")
  form.value.reviewComments = ""
  form.value.remark = ""
  // getAll()
}


//导出初审资料、导入、送真维斯审批begin
onMounted(() => {
  document.getElementsByClassName("el-upload__input")[0].webkitdirectory = true; //布尔值，true: 选择文件夹，false: 选中文件
})

// const tableLoading2 = ref(false)
//   const formInline2 = ref({
//     brand: '', // 品牌
//     itemcode: '', //款号
//     productName: '', // 商品名称
//     supplierName: '', // 供应商名称
//     isExport: '', //导出否
//     state: '', // 真维斯审批
//     page: 1,
//     pageSize: 10
//   })
//   const total2 = ref(1)
//   const tableData2 = ref([])
//   const multipleSelection2 = ref([])
const alterFileList = ref([]) //存放fileid
const fileList = ref([])
// const form = {comment:'',select:''}

//存放fileid的数组不能跟:fileList里的同一个，得分开，例如alterFileList存放fileid，fileList存放上传组件里文件信息
const getfileId = (val, name) => {
  alterFileList.value.push(val)
  // batchFileList.value.push(val)
  console.log("getfileId", batchFileList.value, alterFileList.value)
}

const delfileId = (val) => {
  // fileid1.value=[]
  // fileid1.value.splice(fileid1.value.indexOf(val),1)
  // alterFileList.value.forEach(i=>{
  //   batchFileList.value.splice(batchFileList.value.indexOf(i),1)
  // })
  // val.forEach(i=>{
  //   batchFileList.value.push(i)
  // })
  alterFileList.value = val
  console.log("delfileId", batchFileList.value, alterFileList.value)
}

const route = useRoute()

//进入页面执行
onBeforeMount(() => {
  if (route.query && route.query.name) {
    console.log('route.query',route.query);
    formInline.value.ifcredit = route.query.name
  }
  getAll()
  getRejectReasons().then(res => {
    rejectReasons.value = res.data
  })
  getBrandListData()
})


//导入
const productImport = ref(false)  //弹窗
let batchFileList = ref([]) //上传文件
// *********************导入部分
function UploadUrls() {
  // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
  return ''
}
function sends() {
  productImport.value = true
  batchFileList.value = []
}


// 导出初审资料
const exportTips2 = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择导出行')
    return
  }
  let isexport = false
  let notjeans = false
  const ids = []
  const rowlist = []
  multipleSelection.value.forEach((item) => {
    ids.push(item.productId)
    rowlist.push(item)
  })
  console.log("选择的数据", rowlist)
  rowlist.forEach(i => {
    if (i.ireState != null && i.ireState != 11) {
      isexport = true
    }
    if (!i.isJeans){
      notjeans = true
    }
  })
  if (isexport) {
    isexport = false
    ElMessage.error('不能导出品牌方已审批的资料')
    return
  }
  if (notjeans) {
    notjeans = false
    ElMessage.error('不能导出非真维斯品牌的资料')
    return
  }
  tableLoading.value = true
  productExport2({ ids, rowlist }).then((res) => {
    const blob = new Blob([res])
    const fileName = '商品数据列表.xls'
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

// 导入后导出错误信息
const exporterrmsg = (e) => {
  tableLoading.value = true
  productExportErr(e).then((res) => {
    const blob = new Blob([res])
    const fileName = '错误信息.xls'
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

// 送品牌方审批
const Submittals = () => {
  let nosend = false
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择送批的数据')
    return
  }
  tableLoading.value = true
  const ids = []
  multipleSelection.value.forEach((item) => {
    if(item.state!=1){
      ElMessage.error('只能送批联营商审批为通过的数据')
      tableLoading.value = false
      nosend = true
    }
    if (!item.found) {
      ids.push(item.productId)
    } else {
      // ElMessage.error('无法送批真维斯审批为“未送出”的数据')
      ElMessage.error('无法送批真维斯审批为“已送出”的数据')
      tableLoading.value = false
      nosend = true
    }
  })
  console.log("送真维斯审批的数据", multipleSelection.value)
  if (!nosend) {
    Submit({ ids }).then((res) => {
      console.log(res);
      tableLoading.value = false
      ElMessage.success('送批成功')
      getAll()
    })
      .catch((err) => {
        // 当异步操作失败时，可以在这里处理错误情况
        // alert(err.response.status)
        tableLoading.value = false
        getAll()
        console.error(err)
      })
  }
}
//导出初审资料、导入、送真维斯审批end

//预审搜图

function serchPic(row) {
  isClose.value = false
  if (row) {
    console.log("预审搜图按钮点击1", row)
    searchPicVisible.value = true
    getSKimage({ productId: row.productId }).then((res) => {
      console.log('获取审款图片信息的res', res);
      imagelist.value = res.data
      picproductid.value = row.productId
    })
  } else {
    console.log("预审搜图按钮点击2")
    searchPicVisible.value = true
  }
}

function closeSearchPic() {
  console.log('关闭预审搜图弹窗');
  searchPicVisible.value = false
  isClose.value = true
  imagelist.value = []
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

.pic{
  width: 100%; 
  height:50px; 
  display: flex; 
  justify-content: end;
  padding: 16px;
  margin: 24px;
  margin-top: 0;
  padding-top: 0;
  .steps{
    max-width: 400px;
  }
}

:deep(.el-step__title){
  font-size:small;
  line-height: normal;
  width:60px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // background-color: #FFFFFF;
  width: 100%;
  margin: 24px;
  margin-top: 0;
  padding-top: 0;
  // margin-left:24px;
}

.bottomnav {
  width: 100%;
  margin: 0 24px 0 24px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
}

.formSearch {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
}

.tipStyle {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;

  .topSearch {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .rightBTn {
      .el-button {
        flex-basis: 100%;
        flex-grow: 0;
        flex-shrink: 0;
        height: 38px;
        margin-bottom: 18px;
      }
    }
  }
}

/*查看弹窗的css样式--begin*/
.see {
  display: flex;
  justify-content: space-around;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
  width: 380px;
}

:deep(.el-descriptions__cell) {
  vertical-align: top;
  width: 380px;
}

:deep(.el-descriptions__content) {
  vertical-align: top;
  font-weight: bold;
  width: 60%;
  display: inline-block;
}

/*查看弹窗的css样式--end*/


// background-color: rgb(209, 204, 204);
.diaddStyle {
  h1 {
    text-align: center;
    font-size: 24px;
    color: #333333;
  }

  .jiaoyi {
    display: flex;
    justify-content: center;
  }

  .leftJ {
    margin: 15px;
  }

  .leftJ,
  .rightJ {
    font-size: 16px;
    color: #333333;
  }
}

.batch_btn {
  padding: 5px 10px;
  border: 1px solid #dfe6ec;
  background-color: #fff;
  border-top: 0;
}

// :deep(.el-form-item__content){
//   display: flex;
//   justify-content: flex-end;
// }

:deep(.auditbuttonmain) {
  //position: relative;
  //left: 75%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: right;
}

:deep(.auditbutton) {
  position: relative;
  left: 65%;
  // display: flex;
  // flex-wrap: nowrap;
}

:deep(.editbutton) {
  position: relative;
  left: 50%;
  // display: flex;
  // flex-wrap: nowrap;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  /* width: 4px !important; */
  height: 20px;
}

.auditbutton {
  @media screen and (max-width: 1920px) and (max-height: 1080px) {
    :deep(.el-button) {
      width: 55px;
      height: 30px;
      font-size: 14px;
    }
  }

  @media screen and (max-width: 1280px) and (max-height: 1024px) {
    :deep(.el-button) {
      width: 38px;
      height: 25px;
      font-size: 13px;
    }
  }
}
</style>
  