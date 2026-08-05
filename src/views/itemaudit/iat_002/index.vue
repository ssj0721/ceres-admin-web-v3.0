<template>
    <div class="tipStyle">
      <!-- 搜索 -->
      <div class="topSearch">
        <div class="rightBTn">
          <el-button type="primary" @click="exportTips">导出初审资料</el-button>
          <el-button type="primary" @click="sends">导入补充资料</el-button>
          <el-button type="primary" @click="Submittals">送真维斯审批</el-button>
          <!-- <el-button type="primary" @click="test">test</el-button> -->
        </div>
        <div class="formSearch">
          <el-form :inline="true" :model="formInline" label-width="100px">
            <el-form-item label="品牌" label-width="80px">
                <el-select
                v-model="formInline.brand"
                placeholder="请选择品牌"
                clearable
              >
                <el-option label="JEANSWEST" value="1" />
                <el-option label="MOFEEL" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="款号" label-width="135px">
              <el-input
                v-model="formInline.itemcode"
                maxlength="100"
                style="width: 500px;"
                placeholder="多款用空格、半角逗号或换行符分隔，单款时模糊查询"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品名称" label-width="80px">
              <el-input
                v-model="formInline.productName"
                maxlength="20"
                style="width: 216px;"
                placeholder="商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="供应商名称" label-width="135px">
                <el-input
                v-model="formInline.supplierName"
                maxlength="20"
                style="width: 500px;"
                placeholder="请填入供应商名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="导出否" label-width="80px">
                <el-select
                v-model="formInline.isExport"
                placeholder="请选择"
                clearable
              >
                <el-option label="已导" value="1" />
                <el-option label="未导" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="真维斯审批" label-width="85px">
                <el-select
                v-model="formInline.state"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="草稿" value="0" />
                <el-option label="通过" value="1" />
                <el-option label="待审" value="2" />
                <el-option label="否决" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        class="dataTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品ID" width="80">
          <template #default="scope">{{ scope.row.productId }}</template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌*" width="120"/>
        <el-table-column prop="itemcode" label="款号*" width="125"/>
        <el-table-column label="商品主图" width="150" align="center">
          <template #default="scope">
            <img height="80" width="80" :src="scope.row.image" alt srcset />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" width="150"/>
        <el-table-column prop="supplierName" label="供应商名称" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="170"/>
        <!-- <el-table-column prop="isExport" label="导出否" width="80"/> -->
        <el-table-column prop="isExport" label="导出否" width="80">
          <template #default="scope">
            <span v-if="scope.row.isExport == 1">已导</span>
            <span v-if="scope.row.isExport == 2">未导</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="state" label="真维斯审批" width="90"/> -->
        <!-- <el-table-column prop="state" label="真维斯审批" width="90">
          <template #default="scope">
            <span v-if="scope.row.state == 0">草稿</span>
            <span v-if="scope.row.state == 1">通过</span>
            <span v-if="scope.row.state == 2">待审</span>
            <span v-if="scope.row.state == 3">否决</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="found" label="真维斯审批" width="100%">
          <template #default="scope">
            <span v-if="scope.row.found == true">已送出</span>
            <span v-if="scope.row.found == false">未送出</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgin" label="组织" width="150" />
        <el-table-column prop="bndId" label="款字头" width="150" />
        <el-table-column prop="year" label="年份" width="150" />
        <el-table-column prop="quarter" label="季度" width="150" />
        <el-table-column prop="yearquarter" label="年份季度" width="150"/> >
        <el-table-column prop="sex" label="性别" width="150" >
        <template #default="scope">
            <span v-if="scope.row.sex == 'M'">男</span>
            <span v-if="scope.row.sex == 'L'">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="lcName" label="大类" width="150" />
        <el-table-column prop="depName" label="品种" width="150" />
        <el-table-column prop="scName" label="类别" width="150" />
        <el-table-column prop="poitemclass" label="二分类" width="150" />
        <el-table-column prop="isAdult" label="成人/童装" width="150" >
        <template #default="scope">
            <span v-if="scope.row.isAdult == 0">童装</span>
            <span v-if="scope.row.isAdult == 1">成人</span>
          </template>
        </el-table-column>
        <el-table-column prop="isBase" label="基本/非基本" width="150">
        <template #default="scope">
            <span v-if="scope.row.isBase == 0">非基本</span>
            <span v-if="scope.row.isBase == 1">基本</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceName" label="品种细分" width="150" />
        <!-- <el-table-column prop="priceList" label="价位" width="150" /> -->
        <el-table-column prop="plansaledate" label="销售季期" width="150" />
        <el-table-column prop="isCombo" label="组合款/换款号" width="150" >
        <template #default="scope">
            <span v-if="scope.row.isCombo == 0">正常款</span>
            <span v-if="scope.row.isCombo == 1">组合款</span>
            <span v-if="scope.row.isCombo == 2">换款号</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformlist" label="平台" width="150" />
        <el-table-column prop="salechannellist" label="销售渠道" width="150" />
      </el-table>
      <div style="margin-top: 3%; margin-bottom: 3%;">
        <p>说明</p>
        <p>1、导出初审资料：将当前表格初审的资料导出excel</p>
        <p>2、导入补充资料：在1基础上补充二审所需的资料并导入</p>
        <p>3、送真维斯审批：导入补充资料，送品牌方审款系统待品牌方审款(即二审)</p>
      </div>
      <el-pagination
        :current-page="formInline.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total"
        style="margin: 12px 0;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 批量导入 -->
    <el-dialog
      v-model="productImport"
      title="批量导入商品"
      :close-on-click-modal="false"
      center
      width="600px"
      @close="closeModal"
    >
      <div class="uploadDialog">
        <el-upload
          drag
          multiple
          :limit="uploadSetting.limit"
          :auto-upload="uploadSetting.isAutoUpload"
          :headers="uploadSetting.headers"
          :action="uploadUrl"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-remove="batchRemove"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="batchFileList"
          :accept="uploadSetting.accept"
          ref="upload"
        >
          <el-icon><el-icon-upload /></el-icon>
          <div class="el-upload__text">
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传xlsx文件，且不超过10M
            </div>
          </template>
        </el-upload>
        <Upload
          ref='uploadRef'
          :multiple="false"
          :action="uploadUrl"
          :limit="5"
          :maxSize="5"
          :accept="uploadSetting.accept"
          :file-list="batchFileList"
          :fileList="fileList"
          @getfileId="getfileId"
          @delfileId="delfileId"
        >
          <template #tip>
            <div class="el-upload__tip">
              只能上传xlsx,.png,.jpg'文件，且不超过10M
            </div>
          </template>
        </Upload>
        <br />
        <el-button
          size="small"
          type="primary"
          @click="uploadFile"
        >立即上传</el-button>
      </div>
    </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { brandGetAll,productExport2,importProduct,update1,productExportErr,Submit } from '@/api/itemaudit/ait002'
  import {getfileid} from '@/api/file'
  import Upload from '@/components/Upload/index.vue'
  import { ref, onBeforeMount, onMounted } from 'vue'
  import { getToken } from '@/utils/auth'
  import { uploadUrl } from '@/utils/request'

  onMounted(()=>{
 document.getElementsByClassName(  "el-upload__input"  )[0].webkitdirectory = true; //布尔值，true: 选择文件夹，false: 选中文件
})
  const tableLoading = ref(false)
  const formInline = ref({
    brand: '', // 品牌
    itemcode: '', //款号
    productName: '', // 商品名称
    supplierName: '', // 供应商名称
    isExport: '', //导出否
    state: '', // 真维斯审批
    page: 1,
    pageSize: 10
  })
  const total = ref(1)
  const tableData = ref([])
  const multipleSelection = ref([])
  const alterFileList = ref([]) //存放fileid
  const fileList = ref([])
  // const form = {comment:'',select:''}
  
  const getfileId = (val,name) =>{
    alterFileList.value.push(val)
    // batchFileList.value.push(val)
    console.log("getfileId",batchFileList.value,alterFileList.value)
  }

  const delfileId = (val) =>{
  // fileid1.value=[]
  // fileid1.value.splice(fileid1.value.indexOf(val),1)
  // alterFileList.value.forEach(i=>{
  //   batchFileList.value.splice(batchFileList.value.indexOf(i),1)
  // })
  // val.forEach(i=>{
  //   batchFileList.value.push(i)
  // })
  alterFileList.value = val
  console.log("delfileId",batchFileList.value, alterFileList.value)
}

  //进入页面执行
  onBeforeMount(() => {
    getAll()
  })
  
  //改变页数大小
  const handleSizeChange = (val) => {
    formInline.value.pageSize = val
    getAll()
  }
  //改变当前页
  const handleCurrentChange = (val) => {
    formInline.value.page = val
    getAll()
  }
  //选择数据行
  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }

  // 查询
  const search = () => {
    total.value = 1
    formInline.value.page = 1
    getAll()
  }
   // 初始化查询所有数据
  const getAll = () => {
    tableLoading.value = true
    brandGetAll(formInline.value).then(res => {
      tableData.value = res.data.list
      total.value = res.data.total
    }).finally(() => {
      tableLoading.value = false
    })
  }

  const test = () => {
    tableLoading.value = true
    update1(formInline.value).then(res => {
      console.log(res.data.key1);
    }).finally(() => {
      tableLoading.value = false
    })
  }
  // // 清除
  // const clear = () => {
  //   formInline.value = {
  //   brand: '', // 品牌
  //   itemcode: '', //款号
  //   productName: '', // 商品名称
  //   supplierName: '', // 供应商名称
  //   isExport: '', //导出否
  //   state: '', // 真维斯审批
  //   page: 1,
  //   pageSize: 10
  //   }
  //   getAll()
  // }
 

  // // 删除
  // const deleteTips = async (row) => {
  //   let ids = []
  //   if (multipleSelection.value.length === 0) {
  //     ids = [row.buyerLabelId]
  //   } else {
  //     multipleSelection.value.forEach((item) => {
  //       ids.push(item.buyerLabelId)
  //     })
  //   }
  //   const res = await tipsDelete({ ids })
  //   if (res.code === '') {
  //     ElMessage({
  //       message: '删除成功',
  //       type: 'success',
  //     })
  //     getAll()
  //   }
  // }


  //导入
  let uploadSetting = ref({
  limit: 2,
  isAutoUpload: false,
  headers: {
    'Authorization-admin': getToken(),
  },
  accept: '.xlsx,.png,.jpg'
  // accept:''
})
  const productImport = ref(false)  //弹窗
  let batchFileList = ref([]) //上传文件
  // *********************导入部分
function UploadUrls () {
  // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
  return ''
}
  function sends () {
  productImport.value = true
  batchFileList.value = []
}

//导入
function uploadFile () {
  if (batchFileList.value.length === 0) {
    ElMessage.warning('请上传文件')
  } else {
    // 创建一个 FormData 对象
    const formData = new FormData();
    // 假设 batchFileList.value[0] 是你要添加的文件对象
    formData.append('file', batchFileList.value[0]);
    formData.append('imageList', alterFileList.value);
    console.log("上传文件参数",formData,batchFileList.value, alterFileList.value)
    importProduct(formData).then((res) => {
      if (res.code === '') {
        ElMessage.success('导入成功')
        productImport.value = false
        batchFileList.value = []
        alterFileList.value = []
        fileList.value = []
      }
      console.log(Object.keys(res.data).length);
      if (Object.keys(res.data).length !== 0) {
      // 对象不为空
        exporterrmsg(res.data)
    }
    })
    getAll()
  }
}
// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
function beforeUploadFile (file) {
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
  const size = file.size / 1024 / 1024
  this.$nextTick(() => {
   this.$refs.upload.$children[0].$refs.input.webkitdirectory = true
  })

  // if (extension !== 'xlsx') {
  //   ElMessage.warning('只能上传后缀是.xlsx的文件')
  // }
  if (size > 10) {
    ElMessage.warning('文件大小不得超过10M')
  }
}

// 文件状态改变时的钩子
function fileChange (_file, _batchFileList) {
  console.log("文件改变",_file, _batchFileList)
  batchFileList.value.push(_file.raw)
  // var date = new Date();
  // let year = date.getFullYear();
  // let month = (date.getMonth() + 1).toString().padStart(2, '0');
  // let subPath = "img/itemDraft/" + year+month;
  // console.log("subpath",subPath)
  // const formData = new FormData();
  // console.log("length",batchFileList.value.length)
  // for(let i = 0; batchFileList.value.length>i; i++){
  //   formData.append('file', batchFileList.value[i])
  //   formData.append('subPath', subPath)
  //   console.log("formData---",formData,batchFileList.value[i])
  //   getfileid(formData).then((res) => {
  //       if (res.code === '') {
  //         ElMessage.success('获取fileid成功')
  //       }
  //       console.log();
  //     })
  // }
}
function batchRemove (_file, _batchFileList) {
  batchFileList.value = []
}
// 文件超出个数限制时的钩子
function exceedFile (_files, _batchFileList) {
  ElMessage.warning(`只能选择1个文件`)
}
// 文件上传成功时的钩子
function handleSuccess (_res, _file, _batchFileList) {
  ElMessage.success('文件上传成功')
}
// 文件上传失败时的钩子
function handleError () {
  ElMessage.error('文件上传失败')
}

  // 导出
  const exportTips = () => {
    if (multipleSelection.value.length === 0) {
      ElMessage.error('请选择导出行')
      return
    }
    tableLoading.value = true
    const ids = []
    const rowlist = []
    multipleSelection.value.forEach((item) => {
      ids.push(item.productId)
      rowlist.push(item)
    })
    productExport2({ ids,rowlist }).then((res) => {
      const blob = new Blob([res])
      const fileName = '商品数据列表.xlsx'
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
      const fileName = '错误信息.xlsx'
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

  // 送真维斯审批
  const Submittals = () => {
    if (multipleSelection.value.length === 0) {
      ElMessage.error('请选择送批的数据')
      return
    }
    tableLoading.value = true
    const ids = []
    multipleSelection.value.forEach((item) => {
      ids.push(item.productId)
    })
    console.log("送真维斯审批的数据",multipleSelection.value)
    Submit({ ids }).then((res) => {
        console.log(res);
      tableLoading.value = false
      ElMessage.success('送批成功')

    })
    .catch((err) => {
    // 当异步操作失败时，可以在这里处理错误情况
    // alert(err.response.status)
    tableLoading.value = false
    console.error(err)
  })
  }

  function closeModal () {
  console.log("点x退出")
  batchFileList.value = []
  alterFileList.value = []
  fileList.value = []
  productImport.value = false

  // getAll()
}
  </script>
  
  <style lang="scss" scoped>
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

  .see{
    display: flex;
    justify-content: space-around;
  }

  :deep(.el-descriptions__label) {
    font-weight: bold;
    width: 380px;
  }

  :deep(.el-descriptions__cell) {
    width: 380px;
  }

  :deep(.el-descriptions__content) {
    background-color: rgb(209, 204, 204);
    font-weight: bold;
    width: 60%;
    display: inline-block;
  }

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
  </style>
  