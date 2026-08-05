<template>
  <basic-container class="container">
    <div class="pic" v-if="permission">
      <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm009</div>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="供货商新增款式" />
        <el-step class="step" title="联营商款式预审核" />
        <el-step class="step" title="运营团队选款" />
        <el-step class="step" title="送品牌方审款" />
        <el-step class="step" title="品牌方审款" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <div class="pic" v-else>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="新增基本款式资料" />
        <el-step class="step" title="补充详细货品资料" />
        <el-step class="step" title="真维斯款式审批" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <el-dialog v-model="imgstate"  title="流程图" style="width: 850px; height: 700px; text-align: center;">
      <img style="width: 800px; height: 550px;" width="100%" :src="permission ? auditpic : DTauditpic" alt >
    </el-dialog>
    <div class="pending">
      <!-- 搜索 -->
      <!-- <div class="formSearch"> -->
      <mybottons>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="primary" @click="clear">重置</el-button>
        <el-button type="primary" @click="handleCreate">新增商品</el-button>
        <el-button type="primary" @click="refresh">刷新页面</el-button>
        <el-button type="primary" @click="sends">批量导入</el-button>
        <!-- <el-button type="success" plain @click="productDataExport">导出商品</el-button> -->
        <el-button type="primary" @click="send" v-if="permission">送批</el-button>
        <el-button type="primary" @click="exportTips2" v-if="!permission">导出初审资料</el-button>
        <el-button type="primary" @click="sendsAudit" v-if="!permission">导入补充资料</el-button>
        <el-button type="primary" @click="Submittals" v-if="!permission">送品牌方审批</el-button>
        <el-button type="primary" @click="itemDraftIdUpdate">同步审款id</el-button>
        <el-form :inline="true" :model="query" class="formSearch">
          <el-form-item label="创建时间" style="font-weight: bold;">
            <datePickerGyl v-model="query.createTimeList" :defaultTimeType="'day'" :clearable="true"></datePickerGyl>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="query.search" maxlength="20" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="款号">
            <el-input v-model="query.itemcode" maxlength="50" placeholder="多款用空格、半角逗号或换行符分隔，单款时模糊查询" />
          </el-form-item>
          <el-form-item label="联营商审批" v-if="permission">
            <el-select v-model="query.ifCredit" placeholder="请选择联营商审批状态" size="large" style="width: 200px" clearable>
              <el-option label="全部" value="null" />
              <el-option label="草稿" value="0" />
              <el-option label="待审" value="2" />
              <el-option label="通过" value="1" />
              <el-option label="否决" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌商审款状态" v-if="!permission">
            <el-select v-model="query.irestates" placeholder="请选择品牌商审款状态" clearable multiple size="large" style="width: 200px"
              collapse-tags>
              <el-option label="已补充资料待送批" value="DRAFT" />
              <el-option label="待审" value="APPROVED" />
              <el-option label="作废" value="CANCELED" />
              <el-option label="通过" value="ACCECTED" />
              <el-option label="否决" value="REJECTED" />
              <!-- <el-option label="INSIGNING1" value="INSIGNING1" /> -->
              <el-option label="待申诉" value="INSIGNING2" />
              <el-option label="申诉中" value="INSIGNING3" />
              <el-option label="作废申请" value="CANCELED00" />
              <el-option label="待批办" value="APPROVED00" />
              <el-option label="暂缓" value="SUSPEND" />
            </el-select>
          </el-form-item>
          <el-form-item label="平台分类">
            <el-cascader v-model="query.classifyId" :options="categoryList" clearable :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'categoryName',
              value: 'id',
              children: 'childs',
            }" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-select v-model="query.shopIds" placeholder="请选择供应商" clearable multiple size="large" style="width: 200px">
              <el-option v-for="shop in shops" :key="shop.shopId" :label="shop.shopName" :value="shop.shopId" />
            </el-select>
          </el-form-item>
          <el-form-item label="只看待补充资料的商品" v-if="!permission">
            <el-switch v-model="query.unfill" @change="queryByUnfill" />
          </el-form-item>
        </el-form>
      </mybottons>
      <!-- </div> -->
      <!-- 表格 -->
      <div class="second-main-container">
        <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="{
          background: '#EEF3FF',
          color: '#333333'
        }" tooltip-effect="dark" style="width: 100%"  max-height="500" class="dataTable" @selection-change="handleSelectionChange" v-horizontal-scroll="'always'">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="productId" label="商品id" width="70" show-overflow-tooltip />
          <el-table-column label="商品主图" width="200" align="center">
            <template #default="scope">
              <img height="80" width="80" :src="scope.row.productImage" alt srcset />
            </template>
          </el-table-column>
          <el-table-column prop="itemcode" label="款号" width="150"/>
          <el-table-column prop="productName" label="商品名称" width="300" />
          <template>
            <el-table-column prop="section" label="售价区间" show-overflow-tooltip width="140" v-if="false" />
            <el-table-column prop="memberSection" label="会员价" show-overflow-tooltip width="140" v-if="false" />
            <el-table-column prop="ifCredit" label="积分兑换" show-overflow-tooltip width="100" v-if="false">
              <template #default="scope">
                <span v-if="scope.row.ifCredit == 1">允许</span>
                <span v-if="scope.row.ifCredit == 0">不允许</span>
              </template>
            </el-table-column>
          </template>
          <template>
            <el-table-column prop="stockNumber" label="库存" show-overflow-tooltip v-if="false" /></template>
          <template><el-table-column prop="volume" label="销量" show-overflow-tooltip v-if="false" /></template>
          <!-- <el-table-column prop="volume" label="上架状态" show-overflow-tooltip width="100">
        <template #default="scope">
          <span v-if="scope.row.shelveState == 0">未上架</span>
          <span v-if="scope.row.shelveState == 1">已上架</span>
          <span v-if="scope.row.shelveState == 2">待审核</span>
          <span v-if="scope.row.shelveState == 3">审核失败</span>
        </template>
      </el-table-column> -->
          <el-table-column prop="ifCredit" label="联营商审批" show-overflow-tooltip width="100">
            <template #default="scope">
              <span v-if="!permission">\</span>
              <span v-else-if="scope.row.ifCredit == 0">草稿</span>
              <span v-else-if="scope.row.ifCredit == 1">通过</span>
              <span v-else-if="scope.row.ifCredit == 2">待审</span>
              <span v-else-if="scope.row.ifCredit == 3">否决</span>
            </template>
          </el-table-column>
          <el-table-column prop="ireState" label="品牌商审款状态" width="130">
            <template #default="scope">
              <span v-if="scope.row.ireState == 1">待审</span>
              <span v-if="scope.row.ireState == 2">作废</span>
              <!-- <span v-if="scope.row.ireState == 2">否决</span> -->
              <span v-if="scope.row.ireState == 3">通过</span>
              <span v-if="scope.row.ireState == 4">否决</span>
              <!-- <span v-if="scope.row.ireState == 12">否决</span>
              <span v-if="scope.row.ireState == 5">否决</span>
              <span v-if="scope.row.ireState == 6">否决</span>
              <span v-if="scope.row.ireState == 7">否决</span>
              <span v-if="scope.row.ireState == 8">否决</span>
              <span v-if="scope.row.ireState == 9">待批办</span>
              <span v-if="scope.row.ireState == 10">否决</span> -->
              <span v-if="scope.row.ireState == 11">已补充资料</span>
              <span v-if="scope.row.ireState == 12">可上架</span>
              <span v-if="scope.row.ireState == 5">INSIGNING1</span>
              <span v-if="scope.row.ireState == 6">待审诉</span>
              <span v-if="scope.row.ireState == 7">申诉中</span>
              <span v-if="scope.row.ireState == 8">作废申请</span>
              <span v-if="scope.row.ireState == 9">待批办</span>
              <span v-if="scope.row.ireState == 10">暂缓</span>
              <!-- <span v-if="scope.row.ireState == 11">草稿</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" width="100"></el-table-column>
          <el-table-column prop="reject" label="驳回原因" show-overflow-tooltip width="100" v-if="false" />
          <el-table-column :formatter="(row) => getBrandName(row)" label="品牌" show-overflow-tooltip v-if="false" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="seeMore(scope.row)">查看</el-button>
              <el-button type="primary" link @click="edit(scope.row)"
                v-if="scope.row.ifCredit == 0 || scope.row.ifCredit == 1 || (scope.row.ifCredit == 2 && !permission)">编辑</el-button>
              <el-button type="primary" link @click="editAudit(scope.row)" v-if="!permission">补充资料</el-button>
              <!-- <el-button
            v-if="scope.row.shelveState == 0"
            type="primary"
            link
            @click="down(scope.row)"
          >上架</el-button> -->
              <!-- <el-button
            v-if="scope.row.shelveState == 1"
            type="primary"
            link
            @click="down(scope.row)"
          >下架</el-button>
          <el-button
            v-if="scope.row.shelveState == 1"
            type="primary"
            link
            @click="setVipPrice(scope.row)"
          >设置会员价</el-button> -->
              <el-popconfirm title="确认删除？" @confirm="del(scope.row)">
                <template #reference>
                  <el-button type="danger" link v-if="scope.row.ifCredit == 0">删除</el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm v-if="scope.row.ifCredit == '0'" title="是否确认送批？" @confirm="send(scope.row)">
                <template #reference>
                  <el-button type="primary" link v-if="permission">送批</el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm v-if="scope.row.ifCredit != '1'" title="是否确认送批？" @confirm="Singlesubmittals(scope.row.productId)">
                <template #reference>
                  <el-button type="primary" link v-if="!permission">送批</el-button>
                </template>
              </el-popconfirm>
              <!--  
                供应链：联营商否决可以取回；
              -->
            <el-popconfirm
              v-if="(scope.row.ifCredit == '3' && permission)"
              title="是否确认取回？"
              @confirm="singleRetrieval(scope.row)"
            >
              <template #reference>
                <el-button type="primary" link v-if="permission">取回</el-button>
              </template>
            </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="page.page" :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500]" :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" background :total="page.total" style="margin: 20px 0 0 0;"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>

      <!-- 批量导入 -->
      <el-dialog v-model="visible.productImport" title="批量导入商品" :close-on-click-modal="false" center width="400px">
        <div class="uploadDialog">
          <el-upload drag :limit="uploadSetting.limit" :auto-upload="uploadSetting.isAutoUpload"
            :accept="uploadSetting.accept" :headers="uploadSetting.headers" :action="uploadUrl"
            :before-upload="beforeUploadFile" :on-change="fileChange" :on-remove="batchRemove" :on-exceed="exceedFile"
            :on-success="handleSuccess" :on-error="handleError" :file-list="batchFileList">
            <el-icon><el-icon-upload /></el-icon>
            <div class="el-upload__text">
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传xlsx,xls,文件，且不超过10M
              </div>
              <div class="el-upload__tip">
                上传前不知道excel模板的，请点击
                <span class="clickMe" @click="poDownload">点我下载模板</span> 去下载
              </div>
            </template>
          </el-upload>
          <!-- <span id="selectDerectory">
            <input type="file" multiple webkitdirectory @change="getFiles" />
          </span>
          <hr />已选择审款图片文件夹:<br />
          <ul id="inputUl">
          </ul>
          <hr style="border:1px dashed;height:1px" />
          <div class="wenjianjia">
            <div class="el-upload__tip">
              只能上传.jpeg,.jpg,.png图片文件,且图片分辨率800×800
            </div>
            <div class="el-upload__tip">
              使用说明：上传的文件夹名称需要与原款号对应，且上传的每个款都需要上传对应的审款图片;
            </div>
            <div class="el-upload__tip">
              图片名要求：在图片名后添加 "_正"、"_反"、"_细"、"_侧" 区分
            </div>
          </div> -->
          <br />
          <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        </div>
      </el-dialog>

      <!-- 设置会员价弹窗 -->
      <el-dialog v-model="visible.vipPrice" title="设置会员价" width="50%" class="vipDialog">
        <el-form ref="form" label-width="80px">
          <el-form-item label="优惠方式">
            <el-radio-group v-model="vipDiscountType" @change="modeChange">
              <el-radio :label="1">折扣</el-radio>
              <el-radio :label="2">指定价格</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="priceTable">
            <table>
              <tr>
                <th>规格</th>
                <th>售价</th>
                <th v-for="(item, index) in gradeList" :key="index">
                  {{ item }}
                </th>
              </tr>
              <tr v-for="(item, index) in productData" :key="index">
                <td>
                  {{ item.value }}
                </td>
                <td>
                  {{ item.price }}
                </td>
                <td v-for="(itemJ, indexJ) in item.memberPrices" :key="indexJ" class="td-input">
                  <el-input v-model="itemJ.price" maxlength="9" oninput="value=value.replace(/([^\d|\.])/g, '')" />
                  {{ vipDiscountType === 1 ? '折' : '元' }}
                </td>
              </tr>
            </table>
          </div>
          <el-button type="success" class="clearBtn" @click="clearProductMemberPrice">清除所有旧会员价</el-button>
        </el-form>
        <template #footer>
          <el-button @click="visible.vipPrice = false">取 消</el-button>
          <el-button type="primary" @click="vipPriceSubmit">确 定</el-button>
        </template>
      </el-dialog>
      <!-- 新增/修改商品弹窗 -->
      <div v-if="visible.commidy">
        <el-dialog v-model="visible.commidy" :title="!currentProduct.productId ? '新增商品' : '编辑商品'" width="74%"
          :align-center="true" center :style="{ left: '60px' }" :close-on-click-modal="false" @close="closeModal">
          <CommAdd ref="commFormRef" :product-code="productCode" :product-id="currentProduct.productId" :permission="permission"
            @cancel="cancelForm" />
        </el-dialog>
      </div>

      <EditDialog v-model:editVisible="editVisible" v-model:editloading="editloading" :editRow="editRow" :permission="permission" @getAll="getAll"></EditDialog>

      <!-- 查看弹窗 -->
      <el-dialog v-model="detailsVisible" :align-center="true" title="查看商家" width="74%" center :style="{ left: '60px' }"
        :close-on-click-modal="false" @close="closeViewModal">
        <CommView ref="commFormRef1" :product-code="productCode" :product-id="currentProduct.productId" :isSee="true" :permission="permission"
          @cancel="cancelViewForm" />

        <div style="position: relative; left: 8%;">
          <div style="margin-bottom: 15px;margin-top: 20px; font-weight:bold">审批历程:</div>
          <li v-for="(item, index) of history" :key="index" style="font-size: smaller;">{{ item }}</li>
          <div v-if="SKHistroy.length>0" style="margin-bottom: 15px;margin-top: 20px; font-size:small; font-weight: bold;">-- 品牌方审批历程:</div>
          <li v-for="(item, index) of SKHistroy" :key="index" style="font-size: smaller;">{{ item }}</li>
          <!-- <div>2023-12-19 ......</div> -->
        </div>
        <!-- <el-button type="primary" @click="detailsVisible=false" style="position: relative; left: 90%;">取消</el-button>
        </div> -->
      </el-dialog>

      <el-dialog v-model="imageVisible" append-to-body class="check-image-dialog" title="查看图片" center="center">
        <img :src="dialogImageUrl" style="
            display: block;
            margin: auto;
            max-width: 500px;
            max-height: 500px;
          " alt />
      </el-dialog>

      <!-- 导入补充资料 -->
      <ImportDialog v-model:productImport="productImport" v-model:uploading="uploading" :batchFileList="batchFileList" @getAll="getAll"></ImportDialog>
    </div>
  </basic-container>
</template>

<script setup>
import {
  Retrieval,
  clearProductMember,
  downloadTemplate,
  getBrandList,
  getClassify,
  getClassifyDelete,
  getClassifyGetAll,
  getClassifyStart,
  getProductMembers,
  importProduct,
  productExport,
  sendAudit,
  setProductMember,
  findPermission,
  saveClassify
} from '@/api/commodity'
import { Submit, importProduct2, productExport2, productExportErr, updateItemDraftId } from '@/api/itemaudit/ait002'
import { getshop } from '@/api/shopSys'
import { getById } from '@/api/itemaudit/ait001'
import { getToken } from '@/utils/auth'
import { uploadUrl } from '@/utils/request'
import CommView from '@/views/itemaudit/iat_001/addCommodity.vue'
import CommAdd from '@/views/renovation/commoditySystem/addCommodity.vue'
import { Upload as ElIconUpload } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import auditpic from '@/assets/images/audit.jpg'
import DTauditpic from '@/assets/images/DTaudit.jpg'
import { ElMessage } from 'element-plus'
import { excel } from '@/utils/excelExport'

let imgstate = ref(false)
const route = useRoute()

function refresh() {
  // this.$router.go(0)
  location.reload();
}


function getBrandName(row) {
  const find = brandList.value.find(item =>
    item.id === row && row.brandId
  )
  return find ? find.brandName : '-'
}

const permission = ref(true)  // 区分是供应连true还是智慧供销false
const editRow = ref({})
const editloading = ref(false)
const editVisible = ref(false)

let shenkuanList = {}
let imageVisible = ref(false)
const commFormRef = ref();
const commFormRef1 = ref();
const multipleSelection = ref([])
const dialogImageUrl = ref('')
let productCode = ref()
let visible = reactive({
  vipPrice: false,
  productImport: false,
  commidy: false,
})

let page = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableLoading = ref(false)

/**
 * @property {string} search 搜索字段
 * @property {string} shelveState 上架状态 1-上架 0-不上架 null-全部
 * @property {string} ifCredit 联营商审批状态
 * @property {} stock 库存状态 1-有库存 0-无库存 null-全部
 * @property {} classifyId 最下级分类id
 */
let query = reactive({
  createTimeList:[],
  search: '',
  itemcode:'',
  ifCredit: '',
  // stock: '',
  classifyId: null,
  irestates:[],
  shopIds:[],
  unfill:false
})

const queryByUnfill = (val) => {
  query.search = '' 
  query.irestates = []
  query.classifyId = null
  query.ifCredit = ''
  query.shopIds = []
  query.unfill = val
  getAll()
}

let shops = ref([]);
function getShopName() {
  getshop().then(res => {
    shops.value = res.data
    // form.value.shopId = shop.value.shopId
  })
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log("复选框变化", multipleSelection)
}

let tableData = ref([]);
// 初始化查询所有数据
function getAll() {
  tableLoading.value = true
  const classifyId = Array.isArray(query.classifyId)
    ? query.classifyId[query.classifyId.length - 1]
    : query.classifyId
  getClassifyGetAll(Object.assign(
    {},
    page,
    query,
    {
      classifyId
    }
  )).then(res => {
    tableData.value = res.data.list
    page.total = res.data.total
    tableLoading.value = false
    console.log("tableData", tableData)
  })
}

const formData = ref({
  productId: '', // 商品id
  fimages: '', //商品主图
  productName: '', // 商品名称
  createTime: '', // 创建时间
  ifCredit: '', // 联营商审批
})
const history = ref([])
const SKHistroy = ref([])
const detailsVisible = ref(false)
const detailLoading = ref(false)
const auditVisible = ref(false)
// 查看
// function seeMore(row){
//     console.log("查看row",row);
//     detailsVisible.value = true
//     detailLoading.value = true
//     getClassifyGetById({
//         productId: row.productId
//       }).then(res => {
//         console.log("查看的res",res)
//       if (res.code === '') {
//         formData.value = res.data
//         history.value = res.data.history
//         detailLoading.value = false
//         console.log("formdata",formData)
//       }
//       })
//     // imageSrc = formData.value.image;
// }

// 查看
const seeMore = async (row) => {
  console.log("row", row);
  detailsVisible.value = true
  detailLoading.value = true
  visible.commidy = true
  currentProduct.productId = row.productId
  //只有补充资料且商品属性和平台分类都为空才需要
  if(row.itemcode!=null&&row.itemcode!=""&&row.ireState!=null&&row.ireState!=""
  &&(row.classifyId==null||row.classifyId=="")&&(row.saleclassifyId==null||row.saleclassifyId=="")){
    await saveClassify({productId:row.productId,itemcode:row.itemcode})
  }
  nextTick(() => {
    commFormRef1.value.details()
  })
  // 自动获取内部商品编号
  // await getProductCode().then(res => {
  //   productCode = res.data
  // })
  try {
    const res = await getById({ productId: row.productId })
    if (res.code === '') {
      console.log("审批历程有值", res.data);
      formData.value = res.data[0]
      history.value = res.data[1]
      SKHistroy.value = res.data[2]
    }
  } finally {
    detailLoading.value = false
  }
}

function handlePictureCardPreview(item) {
  dialogImageUrl.value = item
  imageVisible.value = true
}

let brandList = ref([]);
function getBrandListData() {
  getBrandList().then(res => {
    brandList.value = res.data
  })
}


function cancelViewForm() {
  console.log("点取消退出")
  // commFormRef.value?.reset()
  visible.commidy = false
  detailsVisible.value = false
  // clear()
  // getAll()
}


function closeViewModal() {
  console.log("点x退出")
  visible.commidy = false
  detailsVisible.value = false
  // clear()
  commFormRef1.value?.reset()
  // getAll()
}


function cancelForm() {
  console.log('点击取消按钮----');
  closeModal()
  visible.commidy = false
  clear()
  getAll()
}
function closeModal() {
  commFormRef.value?.reset()
}
// function btnClick (id) {
//   if (id.permissionName === '批量导入') {
//     sends()
//   } else if (id.permissionName === '新增商品') {
//     handleCreate()
//   }
// }
function handleSizeChange(val) {
  page.pageSize = val
  getAll()
}
function handleCurrentChange(val) {
  page.page = val
  getAll()
}
//  查询
function handleSearch() {
  page.page = 1
  getAll()
}
// 重置
function clear() {
  query.classifyId = null
  query.search = ''
  query.ifCredit = ''
  page.page = 1
  getAll()
}

let currentProduct = reactive({
  productId: null
})


// 新增商品   必须使用异步同步方法，不然拿不到数据
async function handleCreate() {
  // await getProductCode().then(res => {
  //   productCode = res.data
  // })
  currentProduct.productId = null
  visible.commidy = true
}

const productImport = ref(false)  //弹窗
const uploading = ref(false)

function sendsAudit() {
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
  const ids = []
  const rowlist = []
  multipleSelection.value.forEach((item) => {
    ids.push(item.productId)
    rowlist.push(item)
  })
  console.log("选择的数据", rowlist)
  rowlist.forEach(i => {
    if (i.ireState != null) {
      isexport = true
    }
  })
  if (isexport) {
    isexport = false
    ElMessage.error('不能导出已补充的资料')
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
    // if(item.state!=1){
    //   ElMessage.error('只能送批联营商审批为通过的数据')
    //   tableLoading.value = false
    //   nosend = true
    // }
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

const itemDraftIdUpdate = () => {
  updateItemDraftId().then(res => {
    if(res.code==''){
      ElMessage.success('数据更新完成')
    }
  })
}

// 导出商品
function productDataExport() {
  ElMessage.success('数据导出中，请勿重复操作！')
  productExport(Object.assign({}, page, query)).then(res => {
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const fileName = '商品数据明细表.xls'
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
  })
}

/**
 * **********************
 * ************** 商品导入
 * **********************
 */
let uploadSetting = reactive({
  limit: 1,
  isAutoUpload: false,
  headers: {
    'Authorization-admin': getToken(),
  },
  accept: '.xlsx,.xls'
})
let batchFileList = ref([]);
let productids = [];
let isSelect;

// 批量导入
function sends() {
  visible.productImport = true
  batchFileList.value = []
}
// 编辑商品
async function edit(row) {
  // await getProductCode().then(res => {
  //   productCode = res.data
  // })
  console.log('点击编辑的row',row);
  visible.commidy = true
  currentProduct.productId = row.productId
  //只有补充资料且商品属性和平台分类都为空才需要
  if(row.itemcode!=null&&row.itemcode!=""&&row.ireState!=null&&row.ireState!=""
    &&(row.classifyId==null||row.classifyId=="")&&(row.saleclassifyId==null||row.saleclassifyId=="")){
    await saveClassify({productId:row.productId,itemcode:row.itemcode})
  }
  nextTick(() => {
    commFormRef.value.details()
  })
}

const editAudit = (row) => {
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

// 送批
function send(row) {
  console.log("送批的row", row)
  let i = true
  if (row.productId) {
    isSelect = true
    if(row.classifyHierarchy == ""){
      let message = `请补充商品名为"${row.productName}"的平台分类和商品属性（真）!`
      ElMessage.error(message)
      return;
    }
    if(row.productImage == ""){
      let message = `请补充商品名为"${row.productName}"的图片信息!`
      ElMessage.error(message)
      return;
    }
  } else {
    console.log("判断复选框", multipleSelection.value)
    if (multipleSelection.value.length <= 0) {
      ElMessage.error('请选择你要送批的数据')
      i = false
    } else {
      isSelect = false
      // 批量送批
      multipleSelection.value.forEach((item) => {
        if (item.ifCredit == 0) {
          productids.push(item.productId)
        } else {
          ElMessage.error('送批的数据只能是草稿状态')
          i = false
        }
        if(item.classifyHierarchy == ""){
          let message = `请补充商品名为"${item.productName}"的平台分类和商品属性（真）!`
          ElMessage.error(message)
          i = false
        }
        if(item.productImage == ""){
          let message = `请补充商品名为"${item.productName}"的图片信息!`
          ElMessage.error(message)
          i = false
        }
      })
      if (!i) return
    }
  }
  ElMessageBox.confirm('选中数据将被送批, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      sendAudit({
        productId: row.productId,
        productIds: productids,
        isSelect: isSelect
      }).then((res) => {
        if (res.code === '') {
          ElMessage.success('送批成功')
          getAll()
        }
      })
    })
    .catch(() => { })
}


// 取回
function singleRetrieval(row) {
  console.log("取回的row", row)
  let params = []
  if(row){
    params = [{
        productId: row.productId,
        ifCredit:row.ifCredit,
        ireState:row.ireState
    }]
  }
  ElMessageBox.confirm('选中数据将被取回, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      Retrieval({
        params
      }).then((res) => {
        if (res.code === '') {
          ElMessage.success('取回成功')
          getAll()
        }
      })
    })
    .catch(() => { })

}

let gradeList = ref([]);
let productData = ref([]);
let vipDiscountType = ref(1);
// 设置会员价
function setVipPrice(row) {
  currentProduct.productId = row.productId
  getProductMembers({ productId: row.productId }).then((res) => {
    if (res.code === '') {
      productData.value = res.data
      if (res.data && res.data.length > 0) {
        gradeList.value = []
        res.data[0].memberPrices.forEach(item => {
          gradeList.value.push(item.memberLevelName)
        })
        vipDiscountType.value = productData.value[0].mode ? productData.value[0].mode : 1
        visible.vipPrice = true
      }
    }
  })
}
// 设置会员价提交
function vipPriceSubmit() {
  for (let i = 0; i < productData.value.length; i++) {
    productData.value[i].mode = vipDiscountType.value
    for (let j = 0; j < productData.value[i].memberPrices.length; j++) {
      productData.value[i].memberPrices[j].mode = vipDiscountType.value
      var _price = productData.value[i].memberPrices[j].price
      if (!_price) {
        ElMessage.warning('会员价格不能为空！')
        return false
      } else if (productData.value[i].mode === 1) {
        if (_price <= 0 || _price >= 10) {
          ElMessage.warning('会员折数必须大于0小于10！')
          return false
        }
      } else if (productData.value[i].mode === 2) {
        if (_price > productData.value[i].price) {
          ElMessage.warning('会员价格不能大于原价！')
          return false
        }
      }
    }
  }
  setProductMember({
    productId: currentProduct.productId,
    members: productData.value,
  }).then((res) => {
    if (res.code === '') {
      ElMessage.success('设置成功!')
      getAll()
      visible.vipPrice = false
    }
  })
}
// 清空会员价
function clearProductMemberPrice() {
  ElMessageBox.confirm('该商品所有旧设置的会员价将被清除, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    clearProductMember({ productId: currentProduct.productId }).then((res) => {
      if (res.code === '') {
        productData.value.map((item) => {
          item.memberPrices.map((itemChild) => {
            itemChild.price = null
          })
        })
        ElMessage.success('清除成功')
      }
    })
  })
}
// 删除商品
async function del(row) {
  tableLoading.value = true
  console.log('删除',row,row!=null);
  let productIds = []
  if(row!=null){
    productIds.push(row.productId)
  }else{
    if (multipleSelection.value.length === 0) {
        ElMessage.error('请选择删除的数据')
        return
    }else{
        multipleSelection.value.forEach((item) => {
            if(item.ireState!=null){
                ElMessage.error('不能删除已补充资料的商品')
                return
            }else productIds.push(item.productId)
        })
    }
  }
    await getClassifyDelete({
        productIds: productIds
      }).then((res) => {
        if (res.code === '') {
          ElMessage.success('删除成功')
          tableLoading.value = false
          getAll()
        }
      })
    .catch(() => { })
}
// 商品上下架
function down(row) {
  if (row.shelveState) {
    getClassifyStart({
      productId: row.productId,
      shelveState: 0,
    }).then(res => {
      if (res.code === '') {
        ElMessage.success('下架成功')
        getAll()
      }
    })
  } else {
    getClassifyStart({
      productId: row.productId,
      shelveState: 1,
    }).then(res => {
      if (res.code === '') {
        ElMessage.success('上架成功')
        getAll()
      }
    })
  }
}

// 初始化查询所有分类
let categoryList = ref([]);
function queryAllCategory() {
  getClassify().then(res => {
    categoryList.value = res.data
    handleRemoveEmptyChild(categoryList.value)
  })
}
function handleRemoveEmptyChild(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].childs) {
      if (Array.isArray(arr[i].childs) &&
        arr[i].childs.length === 0) {
        delete arr[i].childs
      } else {
        handleRemoveEmptyChild(arr[i].childs)
      }
    }
  }
}
// *********************导入部分
function UploadUrls() {
  // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
  return ''
}
// 下载模板
function poDownload() {
  downloadTemplate().then(res => {
    const blob = new Blob([res])
    const fileName = '批量导入商品模板.xls'
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
  }).catch(res => {
    ElMessage.error("服务异常，请联系管理员")
  })
}

// 导入
function uploadFile() {
  if (batchFileList.value.length === 0) {
    ElMessage.warning('请上传文件')
  } else {
    const formDate = new FormData()
    formDate.append('file', batchFileList.value[0])
    formDate.append('imgList', JSON.stringify(shenkuanList));
    importProduct(formDate).then((res) => {
      console.log("importProduct", res.size)
      if (res.size != 0) {
        const blob = new Blob([res]);
        const fileName = '批量导入商品错误数据.xls'
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
          navigator.msSaveBlob(blob, fileName);
        }
      } else {
        ElMessage.success('导入成功')
        visible.productImport = false
        batchFileList.value = []
        getAll()
      }
    })
  }
}
// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
function beforeUploadFile(file) {
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
  const size = file.size / 1024 / 1024
  if (extension !== 'xlsx' || extension !== 'xls') {
    ElMessage.warning('只能上传后缀是.xlsx和.xls的文件')
  }
  if (size > 10) {
    ElMessage.warning('文件大小不得超过10M')
  }
}
// 文件状态改变时的钩子
function fileChange(_file, _batchFileList) {
  batchFileList.value.push(_file.raw)
}
function batchRemove(_file, _batchFileList) {
  batchFileList.value = []
}
// 文件超出个数限制时的钩子
function exceedFile(_files, _batchFileList) {
  ElMessage.warning(`只能选择1个文件`)
}
// 文件上传成功时的钩子
function handleSuccess(_res, _file, _batchFileList) {
  ElMessage.success('文件上传成功')
}
// 文件上传失败时的钩子
function handleError() {
  ElMessage.error('文件上传失败')
}
// 切换优惠方式清除内容
function modeChange() {
  productData.value.forEach((item) => {
    item.memberPrices.forEach((itemJ) => {
      itemJ.price = ''
    })
  })
}

function findpermission() {
  findPermission().then(res => {
    permission.value = (res.data == '1')
  })
}

onMounted(() => {
  findpermission()
  getBrandListData()
  queryAllCategory()
  getShopName()

  if (route.query && route.query.name) {
    switch (route.query.name) {
      case '全部':
        query.ifCredit = 'null'
        break;
      case '草稿':
        query.ifCredit = '0'
        break;
      case '待审':
        query.ifCredit = '2'
        break;
      case '通过':
        query.ifCredit = '1'
        break;
      case '否决':
        query.ifCredit = '3'
        break;
      default:
        query.ifCredit = route.query.name
        break;
    }
  }
})
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

.formSearch {
  margin-top: 16px;
}

/*查看弹窗的css样式--begin*/
.see {
  display: flex;
  justify-content: space-around;
}

:deep(.el-table__header-wrapper) {
  height: 60px;
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
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin: 24px;
  margin-top: 0;
  padding-top: 0;
  // margin-left:24px;
}

.clickMe {
  color: #3a68f2;
  cursor: pointer;
}

.uploadDialog {

  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  :deep(.el-upload__tip) {
    display: inline-block;
    width: 360px;
    margin: auto;
  }
}

.vipDialog {
  .priceTable {
    table {
      width: 100%;
      text-align: center;
      border-left: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      font-size: 14px;
      color: #606266;
      border-collapse: collapse;

      tr {
        border-top: 1px solid #ebeef5;

        th {
          padding: 12px 0;
          background: #eef3ff;
          color: #333;
          border-right: 1px solid #ebeef5;
        }

        td {
          padding: 12px 0;
          border-right: 1px solid #ebeef5;

          &.td-input {
            .el-input {
              width: 80px;
              margin-right: 0;
            }
          }

          &:nth-child(1),
          &:nth-child(2) {
            width: 80px;
          }

          .el-input {
            width: 100px;
            margin-right: 10px;
          }
        }
      }
    }
  }

  .clearBtn {
    margin-top: 20px;
  }
}

:deep(.el-overlay) {
  z-index: 1001 !important;
}
</style>
