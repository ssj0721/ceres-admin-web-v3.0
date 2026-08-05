<template>
    <div>
      <!-- 批量导入 -->
      <el-dialog v-model="oldimportVisible" title="批量导入" :close-on-click-modal="false" center width="650px"
        @close="closeModal">
        <el-radio-group
          v-model="importOption"
          style="margin-bottom: 1%"
        >
          <el-radio label="fzg">联营店+联营款</el-radio>
          <el-radio label="zg">联营专供款</el-radio>
        </el-radio-group>
        <div class="uploadDialog" v-loading="uploading">
          <!-- <el-upload drag multiple :limit="uploadSetting.limit" :auto-upload="uploadSetting.isAutoUpload"
            :headers="uploadSetting.headers" :action="uploadUrl" :before-upload="beforeUploadFile" :on-change="fileChange"
            :on-remove="batchRemove" :on-exceed="exceedFile" :on-success="handleSuccess" :on-error="handleError"
            :file-list="batchFileList" :accept="uploadSetting.accept" ref="upload">
            <el-icon><el-icon-upload /></el-icon>
            <div class="el-upload__text">
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 .jpg,.jpeg,.png,.PNG,.JPG,.JPEG,.xls,.xlsm 文件，且文件大小<=50 MB
              </div>
            </template>
          </el-upload> -->
          <Upload ref='uploadRef' 
            :multiple="true" 
            :action="uploadUrl" 
            :limit="100" 
            :maxSize="50" 
            :accept="uploadSetting.accept"
            :file-list="fileList" 
            :data="uploadSetting.data" 
            :fileList="fileList"
            @getfileId="getfileId"
            @delfileId="delfileId"
            @finish="isfinish"
          >
          </Upload>
          <div class="el-upload__tip">
            只能上传 .jpg,.jpeg,.png,.PNG,.JPG,.JPEG,.xls,.xlsm 文件，且文件大小<=50 MB
          </div>
          <br />
          <span>
            <span class="importTip">
                注意： 
                <br/>
                1、单个图片不能超过3.5MB。
                <br/>
                2、Excel文件中的款號必須按xx-yy-zzzzzz格式，其中：xx=款字頭, yy = 年季, zzzzzz=流水號。
                <br/>
                3、同一個Excel文件，款號前6位是一致的【即：同一“款字頭”、“年度”、“季度”】。
                <br/>
                4、主图：款號后无横线加数字后缀为主图，例如："AB-52-123456"。
                <br/>
                5、附图：款號后接横线和数字为附图，例如："AB-52-123456-1"。
            </span>
            <br />
            <span style="color: red"> 从2025-04-10 开始，请使用新的模板文件。 
            </span>
            <br />
            <br />
            <div style="display: flex; justify-content: flex-end;">
                <el-button
                  v-if="!importtype"
                  type="primary"
                  @click="templateDownload"
                  >下载模板</el-button
                >
                <el-button type="primary" @click="uploadFile" :disabled="!iscanupload">确定导入</el-button>
                <el-button @click="closeModal">取 消</el-button>
            </div>
          </span>
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
import { ElLoading,ElMessage,ElMessageBox } from 'element-plus'
import { excel } from '@/utils/excelExport'
import { importData,downloadTemplate,matchCurDateForImportDataBeforeApi} from '@/api/itemaudit/ait002'
import { dialog } from '@/utils/dialog'
  
  const prop = defineProps({
      oldimportVisible: {
          type: Object,
          default : () => false,
      },
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
  
  const {oldimportVisible,batchFileList} = toRefs(prop);
  const emits = defineEmits(['update:oldimportVisible','getAll']);
  
  const uploadSetting = ref({
    limit: 100,
    isAutoUpload: false,
    headers: {
      'Authorization-admin': getToken(),
    },
    accept: '.jpg,.jpeg,.png,.PNG,.JPG,.JPEG,.xls,.xlsm'
  })
  const uploading = ref(false)
  const importOption = ref("fzg")

  const fileList = ref([]) //图片路径存放
  const fileid = ref([]) //图片fileid存放

  const errorDialogVisable = ref(false)
  const errorList = ref([])
  const iscanupload = ref(false)

  watch(() => oldimportVisible.value, (nVal, oVal) => {
    console.log('触发了oldimportVisible的监听', nVal);
    if (nVal) {
      iscanupload.value = false;
    }
});

  const getfileId = (val) => {
    fileid.value.push(val);
    console.log("上传图库的图片列表", fileList.value,fileid.value)
  }

  const delfileId = (val) => {
    fileid.value = val
  }
  
  const isfinish = (val) => {
    if(val){
      setTimeout(() => {
      iscanupload.value = val;
      }, 1000);
    }else{
      iscanupload.value = val;
    }
  }

  // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
  function beforeUploadFile(file) {
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
    const size = file.size / 1024 / 1024
    if (extension !== '.xlsm' || extension !== 'xls') {
      ElMessage.warning('只能上传后缀是.xlsm和.xls的文件')
    }
    if (size > 50) {
      ElMessage.warning('文件大小不得超过50M')
    }
  }
  // 文件状态改变时的钩子
  function fileChange(_file, _batchFileList) {
    batchFileList.value.push(_file.raw)
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
    ElMessage.success('文件上传成功')
  }
  // 文件上传失败时的钩子
  function handleError() {
    ElMessage.error('文件上传失败')
  }
  
// 导入补充资料
async function uploadFile () {
  if (fileid.value.length <= 0) {
    ElMessage.error('请上传文件')
    return;
  } else {
    let params = {
      fileids: fileid.value,
      importOption: importOption.value,
    };
    uploading.value = true

    const matchRes = await matchCurDateForImportDataBeforeApi(params)
    console.log('批量导入前校验年季、销售季期是否与当前日期匹配的res', matchRes);
    if (matchRes.data.result.tableData) {
      try {
        await dialog.showDialog({
          message: '年季、销售季期与当前日期不匹配，是否继续保存?',
          title: '提示',
          ok: '确定',
          cancel: '取消',
          type: 'warning'
        });
      } catch (e) {
        ElMessage({
          type: 'info',
          message: '已取消'
        });
        uploading.value = false;
        return;
      }
    }
    importData(params).then((res) => {
      uploading.value = false
      console.log('导入的res', res);
      if (res.data.base64 != undefined && res.data.base64 != "") {
        let base64 = res.data.base64;
        ElMessage.error("有错误数据产生")
        excel.excelExport("有错误数据产生", base64, '.xls')
        closeModal()
        emits('getAll');
      }else if(res.message!=null&&res.message!=""){
        ElMessage.error(res.message)
      }else if(res.code=="errorlist"){
        ElMessage.error("有错误数据产生")
        errorDialogVisable.value = true
        errorList.value = res.data
      }
      else{
          ElMessage.success("导入成功")
          closeModal()
          emits('getAll');
      }
    }).catch(res => {
        uploading.value = false
    })
  }
}
  
  function closeModal() {
    console.log("点x退出")
    batchFileList.value = []
    fileList.value=[]
    fileid.value=[]
    oldimportVisible.value = false
    emits("update:oldimportVisible", false)
    // getAll()
  }

  const templateDownload = () => {
    console.log('准备下载模板');
    uploading.value = true
    downloadTemplate(importOption.value).then((res) => {
        uploading.value = false
        console.log('下载模板的res',res);
        if(res.code==""){
          let base64 = res.data.base64;
          let fileName = res.data.fileName;
          excel.excelExport(fileName, base64, '.xlsm')
        }
    }).catch(res => {
        uploading.value = false
    })
  }
  
  </script>
  
  <style scoped>
  
  </style>