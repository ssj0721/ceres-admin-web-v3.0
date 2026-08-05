<template>
  <div>
    <!-- 导入补充资料 -->
    <el-dialog v-model="productUpdateImport" title="批量修改导入" :close-on-click-modal="false" center width="600px"
      @close="closeModal2">
      <div class="uploadDialog" v-loading="uploading">
        <el-upload drag multiple :limit="uploadSetting.limit" :auto-upload="uploadSetting.isAutoUpload"
          :headers="uploadSetting.headers" :action="uploadUrl" :before-upload="beforeUploadFile" :on-change="fileChange"
          :on-remove="batchRemove" :on-exceed="exceedFile" :on-success="handleSuccess" :on-error="handleError"
          :file-list="batchFileList" :accept="uploadSetting.accept" ref="upload">
          <el-icon><el-icon-upload /></el-icon>
          <div class="el-upload__text">
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传xlsx,xls,xlsm文件,且不超过50M。
              <br/>
              <span style="color:red">注：不可修改款号</span>
            </div>
          </template>
        </el-upload>
        <br />
        <el-button size="small" type="primary" @click="uploadFile2">立即上传</el-button>
      </div>
    </el-dialog>
    <!-- 展示错误信息 -->
    <ShowErrorDialog v-model:errorDialogVisable="errorDialogVisable" :tableData="errorList"></ShowErrorDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, watch, toRefs } from 'vue'
import { getToken } from '@/utils/auth'
import { uploadUrl } from '@/utils/request'
import { ElLoading,ElMessage } from 'element-plus'
import { excel } from '@/utils/excelExport'
import { importUpdateProduct} from '@/api/itemaudit/ait002'

const prop = defineProps({
    productUpdateImport: {
        type: Object,
        default : () => false,
    },
    // uploading: {
    //     type: Object,
    //     default : () => false,
    // },
    batchFileList: {
        type: Array,
        default : () => []
    },
    //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
    //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
    modelValue: {
        type: Array,
        default : () => []
    } 
});

const {productUpdateImport,batchFileList} = toRefs(prop);
const emits = defineEmits(['update:productUpdateImport','update:uploading','getAll']);

const uploadSetting = ref({
  limit: 1,
  isAutoUpload: true,
  headers: {
    'Authorization-admin': getToken(),
  },
  accept: '.xlsx,.xls,.xlsm,.png,.jpg'
})

const uploading = ref(false)
const errorDialogVisable = ref(false)
const errorList = ref([])

// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
function beforeUploadFile(file) {
  console.log('上传前校验',file);
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
  const size = file.size / 1024 / 1024
  console.log('extension--size',extension,size);
  if (extension !== 'xlsx' && extension !== 'xls' && extension !== 'xlsm') {
    ElMessage.warning('只能上传后缀是.xlsx和.xls和.xlsm的文件')
    return false
  }
  if (size > 50) {
    ElMessage.warning('文件大小不得超过50M')
    return false
  }
}
// 文件状态改变时的钩子
function fileChange(_file, _batchFileList) {
  // batchFileList.value=[..._file.raw]
  console.log('文件改变batchFileList',batchFileList.value);
}
function batchRemove(_file, _batchFileList) {
  batchFileList.value.pop()
  console.log('移除', _batchFileList,batchFileList.value);
}
// 文件超出个数限制时的钩子
function exceedFile(_files, _batchFileList) {
  ElMessage.warning(`只能选择1个文件`)
}
// 文件上传成功时的钩子
function handleSuccess(_res, _file, _batchFileList) {
  console.log('上传成功',_file);
  batchFileList.value=[]
  batchFileList.value.push(_file.raw)
  console.log('上传成功batchFileList',batchFileList.value);
  ElMessage.success('文件上传成功')
}
// 文件上传失败时的钩子
function handleError() {
  ElMessage.error('文件上传失败')
}

//导入补充资料
function uploadFile2() {
  console.log('补充资料',batchFileList.value);
  if (batchFileList.value.length === 0) {
    ElMessage.warning('请上传文件')
  } else {
    // 创建一个 FormData 对象
    const formData = new FormData();
    // 假设 batchFileList.value[0] 是你要添加的文件对象
    formData.append('file', batchFileList.value[0]);
    formData.append('imageList', []);
    console.log("上传文件参数", formData, batchFileList.value)
    uploading.value = true
    importUpdateProduct(formData).then((res) => {
      uploading.value = false
      if(res.code=="" && res.data[0].code == 0){
        let base64 = res.data[0].base64;
        console.log('导入的res',res);
        ElMessage.error("有错误数据产生")
        excel.excelExport("有错误数据产生", base64, '.xls')
        productUpdateImport.value = false
        emits("update:productUpdateImport", false)
        batchFileList.value = []
        // getAll()
        emits('getAll');
      }else if(res.code=="" && res.data[0].code == 1){
        if(res.data[0].message!=undefined && res.data[0].message!=""){
          ElMessage.success('导入成功，但'+res.data[0].message)
        }else{
          ElMessage.success('导入成功')
        }
        productUpdateImport.value = false
        emits("update:productUpdateImport", false)
        batchFileList.value = []
        // getAll()
        emits('getAll');
      }else if(res.code=="" && res.data[0].code == "errorlist"){
        if(res.data[0].message!=undefined && res.data[0].message!=""){
          ElMessage.error('有错误数据产生，且'+res.data[0].message)
        }else{
          ElMessage.error("有错误数据产生")
        }
        errorDialogVisable.value = true
        errorList.value = res.data[0].data
      }
      console.log(Object.keys(res.data).length);
    }).catch(res => {
      uploading.value = false
    })
  }
}

function closeModal2() {
  console.log("点x退出")
  batchFileList.value = []
  productUpdateImport.value = false
  emits("update:productUpdateImport", false)
  // getAll()
}

</script>

<style scoped>

</style>