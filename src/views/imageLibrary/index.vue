<template>
    <basic-container class="container">
        <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm036</div>
        <div class="pending">
        <!-- 搜索 -->
        <!-- <div class="formSearch"> -->
            <mybottons>
              <el-form ref="searchRef" :inline="true" :model="searchData">
                <el-form-item label="图库">
                  <el-select v-model="searchData.typestr" placeholder="请选择图库" size="large" style="width: 200px" clearable>
                    <!-- <el-option label="阿里云图库" value="1" /> -->
                    <el-option label="AI图库" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="款号" prop="itemcode">
                  <el-input
                    v-model="searchData.itemcode"
                    maxlength="20"
                    placeholder="请输入款号"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上传时间">
                  <el-date-picker
                    v-model="searchData.dates"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" @click="add">上传图片</el-button>
                  <el-popconfirm title="是否要从图库删除这些图片？" placement="bottom-start" @confirm="deletePic()">
                    <template #reference>
                        <el-button type="primary">删除图片</el-button>
                    </template>
                </el-popconfirm>
                </el-form-item>
              </el-form>
            </mybottons>
        </div>
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
            max-height="500"
            class="dataTable"
            v-horizontal-scroll="'always'"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="序号" width="70" show-overflow-tooltip />
            <el-table-column 
              label="图片" 
              width="200"
              >
              <template #default="scope">
                <img height="80" width="80" :src="scope.row.imgpath" alt srcset />
              </template>
            </el-table-column>
            <el-table-column
              prop="itemcode"
              label="款号"
              width="150"
            />
            <el-table-column
              prop="productCode"
              label="商品编码"
              width="150"
            />
            <el-table-column
              prop="productBrief"
              label="款式描述"
              width="200"
            />
            <el-table-column
              prop="type"
              label="所属图库"
              width="180"
            >
              <template #default="scope">
                <span>{{scope.row.type==1 ? "阿里云图库" : scope.row.type==2 ? "AI图库" : "未知"}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="所属联营商"
              width="180"
            />
            <el-table-column
              prop="creater"
              label="创建人"
              width="150"
            />
            <el-table-column
              prop="created"
              label="创建时间"
              width="380"
            />
          </el-table>
          <div class="pagination-container">
            <el-pagination
                :current-page="searchData.page"
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
        <el-dialog
          v-model="uploadVisible"
          title="上传图片"
          center
          :fullscreen="true"
          :close-on-click-modal="false"
          @close="cancelDialog"
        >
        <div>
            <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="menuSelect"
            >
            <!-- <el-menu-item index="1">阿里云图库上传</el-menu-item> -->
            <el-menu-item index="2">AI图库上传</el-menu-item>
            </el-menu>
            <div style="margin: 10px 0; height: 150px; overflow: auto;" v-horizontal-scroll="'always'">
                <Upload ref='uploadRef' 
                :multiple="true" 
                :action="uploadUrl" 
                :limit="300" 
                :maxSize="5" 
                :accept="accept"
                :file-list="fileList" 
                :data="uploadSetting.data" 
                :fileList="fileList"
                :maxTotalSize="150 * 1024 * 1024" 
                @getfileId="getfileId"
                @delfileId="delfileId"
                @getImgPath="getImgPath"
                >
                </Upload>
            </div>
            <!-- 分割线 -->
            <el-divider style="margin: 15px 0;"/>
            <div style="margin-bottom: 10px;">
                <el-popconfirm title="是否要清空所有图片？" placement="bottom-start" @confirm="deleteAllPic()">
                    <template #reference>
                        <el-button type="primary">清空所有图片</el-button>
                    </template>
                </el-popconfirm>
                <el-popconfirm title="是否要上传至图库？" placement="bottom-start" @confirm="uploadToLibrary()">
                    <template #reference>
                        <el-button type="primary">上传</el-button>
                    </template>
                </el-popconfirm>
            </div>
            <div>
                <el-table
                v-loading="uploadDataLoading"
                :data="uploadData"
                border
                stripe
                :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="500"
                class="uploadData"
                v-horizontal-scroll="'always'"
                >
                <el-table-column
                prop="id"
                label="序号"
                width="70"
                />
                <el-table-column 
                  label="图片" 
                  width="200"
                  >
                  <template #default="scope">
                    <img height="80" width="80" :src="scope.row.imgpath" alt srcset />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="itemcode"
                  label="款号(必填)"
                >
                <template #default="scope">
                    <el-input style="width: 200px;" v-model="scope.row.itemcode"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                  prop="productCode"
                  label="商品编码"
                >
                <template #default="scope">
                    <el-input style="width: 200px;" v-model="scope.row.productCode"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                  prop="productBrief"
                  label="款式描述"
                >
                <template #default="scope">
                    <el-input style="width: 300px;" v-model="scope.row.productBrief"></el-input>
                </template>
                </el-table-column>
                </el-table>
            </div>
        </div>
        </el-dialog>
        <el-dialog
          v-model="tipVisible"
          title="提示"
          width="500"
          @handleClose="cancelUpload"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <span>{{ message }}</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="cancelUpload">取消</el-button>
              <el-button type="primary" @click="uploadToLibrary">确定</el-button>
            </div>
          </template>
        </el-dialog>
    </basic-container>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, watch, toRefs } from 'vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import { getList,upload,deleteImage } from '@/api/imageLibrary'
import { uploadUrl } from '@/utils/request'
import { getToken } from '@/utils/auth'
import { deletefile } from '@/api/file'

const searchRef = ref(null)
const searchData = ref({
  itemcode: '', // 搜索字段
  dates: [], // 上传时间数组
  typestr:'',
  page: 1, // 当前页
  pageSize: 10 // 每页记录数
})
const total = ref(1)
const tableData = ref([])
const tableLoading = ref(false)
const multipleSelection = ref([]) //外部筛选
const activeIndex = ref('2')
const uploadVisible = ref(false)
const uploadData = ref([])
const uploadDataLoading = ref(false)
const isTest = ref(false) //是否已经检测有相同款号
const message = ref("") //款号检测后的提示
const tipVisible = ref(false)

onMounted(() => {
  getAll(searchData.value)
})

function handleSizeChange (val) {
    searchData.value.pageSize = val
    getAll(searchData.value)
}

function handleCurrentChange (val) {
    searchData.value.page = val
    getAll(searchData.value)
}

//  查询
function search () {
  total.value = 1
  searchData.value.page = 1
  getAll(searchData.value)
}

// 初始化查询所有数据
async function getAll(searchData) {
  tableLoading.value = true
  console.log('查询的参数',searchData);
  await getList(searchData).then(res => {
    console.log('查询的结果',res);
    tableData.value = res.data.list
    total.value = res.data.total
  })
  tableLoading.value = false
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log("复选框变化", multipleSelection)
}

const add = () => {
    uploadVisible.value = true
}

//上传图片begin
const uploadRef = ref(null);
let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
const accept = import.meta.env.VITE_ACCEPT
const fileid = ref([]) //图片fileid存放
const fileList = ref([]) //图片路径存放
const delindex = ref(null) //删除的图片的序号
const imgpath = ref([]) //存放图片上传成功后路径的数组

const getfileId = (val) => {
  fileid.value.push(val);
  console.log("上传图库的图片列表", fileList.value,fileid.value)
}

const delfileId = (val,index) => {
  fileid.value = val
  delindex.value = index
}

const getImgPath = (val) => {
  imgpath.value.push(val);
  console.log("图片路径", imgpath.value)
}
//上传图片end

const menuSelect = (key,keyPath) => {
  console.log("点击菜单",key, keyPath)
  activeIndex.value = key
}

const cancel = () => {
    fileid.value = []
    fileList.value = []
    uploadData.value = []
    uploadDataLoading.value = false
    tipVisible.value = false
    isTest.value = false
}

const deleteAllPic = async () => {
    uploadDataLoading.value = true
    await deletefile(fileid.value).then((res) => {
        console.log('从nas里删除成功',res);
        cancel()
    })
}

const uploadToLibrary = async () => {
    uploadDataLoading.value = true
    let param = {
        datas:uploadData.value,
        isTest:isTest.value,
        type:+activeIndex.value
    }
    await upload(param).then((res) => {
        console.log('上传的res',res);
        if(res.code=="200"){
            cancel()
            ElMessage.success('上传成功')
            // uploadVisible.value = false
        }else if(res.code=="test" && res.massage!=""){
            uploadDataLoading.value = false
            message.value = res.message
            tipVisible.value = true
            isTest.value = true //表示已经检测过了
        }else if(res.code=="num" && res.massage!=""){
            uploadDataLoading.value = false
            ElMessageBox.alert( res.message, '提示', {
              confirmButtonText: '确定'
            })
        }
    })
}

const cancelDialog = () => {
    deleteAllPic()
    uploadVisible.value = false
}

const cancelUpload = () => {
    console.log('关闭提示框');
    isTest.value = false
    tipVisible.value = false
}

const deletePic = async () => {
    // const datas = multipleSelection.value.map(item => item.fileid,item.itemcode);
    await deleteImage({datas:multipleSelection.value}).then((res) => {
        console.log('删除成功',res);
        ElMessage.success('删除成功')
        getAll(searchData.value)

    })
}

watch(
  () => fileid.value, (newVal,oldval) => {
    console.log("图片列表发生改变", newVal,oldval)
    let index = uploadData.value.length;
    let index2 = fileid.value.length;
    let dif = index2-index
    console.log('表单，图片数组长度与差距',index,index2,dif);
    //由于上传图片是一张一张上传，所以dif始终为1；删除图片时也是一张一张删除，所以dif始终为-1
    if(dif==1){
        //新增图片的情况
        //每次数组改变就把最后一条fileid加上去
        uploadData.value.push({
            id:index+1,
            imgpath:imgpath.value.filter(i=>i.fileid==fileid.value[index2-1]).map(item => {return item.path})[0],
            itemcode:"",
            productCode:"",
            productBrief:"",
            fileid:fileid.value[index2-1],
        })
    }else if(dif==-1){
        //删除图片的情况
        console.log('删除的index',delindex.value);
        uploadData.value.splice(delindex.value,1)
        //序号重新排序
        for(let i=0;i<uploadData.value.length;i++){
            uploadData.value[i].id = i+1
        }
    }
    console.log('表单数据',uploadData.value);
  }, { immediate: true, deep: true },)
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
</style>