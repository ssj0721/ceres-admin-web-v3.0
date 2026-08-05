<template>
  <div class="content">
    <!-- <el-upload
      v-loading="isUploading"
      :disabled="componentError"
      class="upload-demo"
      drag
      :headers="headers"
      :file-list="viewFileList"
      :name="name"
      :show-file-list="showFileList"
      :list-type="showFileListType"
      :multiple="multiple"
      :action="uploadUrl"
      :limit="limit"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :before-remove="handleBeforeRemove"
      :on-remove="handleRemove"
      :on-preview="handlePreviewOpen"
      :on-change="handleChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div v-if="!componentError" class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <div v-else class="error-text">组件配置错误，请查看控制台</div>
      <template #tip>
        <div class="el-upload__tip">
          文件大小不超过{{ limitSize }}m，文件类型为{{ types.toString() }}
        </div>
      </template>
    </el-upload> -->

    <el-upload ref="uploadRef" :list-type="listType" :on-preview="handlePreviewOpen" :before-upload="handleBeforeUpload"
      :before-remove="handleBeforeRemove" :on-remove="handleRemove"
      :headers="uploadSetting.headers" :file-list="fileList" :limit="limit" :accept="accept"
      :on-success="handleUploadSuccess" :action="uploadUrl" :multiple="multiple" :on-exceed="handleExceed"
      v-loading="isUploading" :disabled="componentError" :fileList="fileList" :fileidlist="fileidlist" :previewlist="previewlist"
      :imagelist="imagelist" :isSee="isSee" :auto-upload="isAuto" :imgtype="imgtype" :isbutton="isbutton" :maxTotalSize="maxTotalSize">
      <el-icon v-if="!isbutton">
        <Plus />
      </el-icon>
    <!-- 自定义文件项模板 -->
    <template #file="{ file }">
      <div class="custom-file-item">
        <div v-if="isExcelFile(file)" style="display:flex;flex-wrap:wrap;">
          <!-- Excel 图标 -->
          <div>
            <el-icon :size="isbutton?20:100" color="#1d6f42">
              <Document />
            </el-icon>
          </div>
          <div class="file-name" style="margin:0 7px 0 7px">{{ file.name }}
            <span class="file-status" v-if="file.status === 'success'">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
            </span>
        </div>
        </div>
        <div v-else>
          <!-- 默认图片预览 -->
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
        </div>
        <!-- 操作按钮 -->
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreviewOpen(file)"
          >
            <el-icon v-if="isExcelFile(file)"><Download /></el-icon>
            <el-icon v-else><ZoomIn /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="uploadRef.handleRemove(file)"
            v-if="!isSee"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
      <!-- 上传附件时用到 -->
      <el-button type="primary" v-if="isbutton" :disabled="isSee">上传</el-button>
    </el-upload>

    <!-- 预览 -->
    <!-- <el-dialog
      v-model="previewObj.show"
      title="预览"
      width="60%"
      :before-close="handlePreviewClose"
    >
      <div class="preview-content">
        <template
          v-if="previewObj.file && previewObj.file.type.includes('image')"
        >
          <el-image class="preview-item" :src="previewObj.file.url" />
        </template>
        <template
          v-if="previewObj.file && previewObj.file.type.includes('video')"
        >
          <video class="preview-item" controls :src="previewObj.file.url"></video>
        </template>
      </div>
    </el-dialog> -->
    <el-dialog v-model="visible.image" :append-to-body="true" class="check-image" title="查看图片" center="center" style="width: 800px; height: 800px; text-align: center;" v-if="!isbutton">
      <img style="width: 700px; height: 700px;" width="100%" :src="detailImage" alt />
    </el-dialog>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="imgViewerVisible"
      @close="closeImgViewer"
      width="20%"
      :url-list="urlList"
      alt="非图片不能预览"
      :rotate="rotate"
    >
    <template
        #toolbar="{ actions, prev, next, reset, activeIndex, setActiveItem }"
      >
      <el-icon @click="prev"><Back /></el-icon>
        <el-icon @click="next"><Right /></el-icon>
        <el-icon v-if="false" @click="setActiveItem(srcList.length - 1)">
          <DArrowRight />
        </el-icon>
        <el-icon @click="actions('zoomOut')"><ZoomOut /></el-icon>
        <el-icon
          @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })"
        >
          <ZoomIn />
        </el-icon>
        <el-icon
          @click="
            actions('clockwise', { rotateDeg: 180, enableTransition: false })
          "
        >
          <RefreshRight />
        </el-icon>
        <el-icon @click="actions('anticlockwise')"><RefreshLeft /></el-icon>
        <el-icon @click="reset"><Refresh /></el-icon>
        <el-icon @click="download(activeIndex)"><Download /></el-icon>
      </template> 
  </el-image-viewer>
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, shallowRef } from 'vue';
import { getToken } from '@/utils/auth'
import { UploadFilled } from '@element-plus/icons-vue'
import mime from 'mime'
import { watch } from 'vue'
// import canvasConfig from '../canvasShow/config/config'
// import api from '../canvasShow/config/api'
import { uploadUrl } from '@/utils/request'
import { getfileid, deletefile } from '@/api/file'
import { ElMessage } from 'element-plus';
import imageCompressor from '@/utils/imageCompressor'
import checkWidthHeight from '@/utils/checkWidthHeight'
import downloadByBlod from '@/utils/downloadByBlod'
import {
  Plus,
  Document,
  CircleCheck,
  ZoomIn,
  Delete
} from '@element-plus/icons-vue'

let visible = reactive({
  image: false,
})
const fullLoading = ref(null)
const props = defineProps({
  /** 上传时候表单的KEY */
  name: {
    type: String,
    default: () => 'file',
  },
  /** 上传类型限制 */
  accept: {
    type: String,
    default: () => 'image/jpeg,image/png,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
  },
  /** 限制上传数量 */
  limit: {
    type: Number,
    default: () => 5,
  },
  /** 限制的那张大小 单位M */
  // limitSize: {
  //   type: Number,
  //   default: () => 5,
  // },
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: () => true,
  },
  /** 是否展示文件列表 */
  showFileList: {
    type: Boolean,
    default: () => true,
  },
  /** 文件展示方式 text/picture/picture-card */
  showFileListType: {
    type: String,
    default: () => 'picture-card',
  },
  /** 允许上传的文件尾缀 string[] */
  types: {
    type: Array,
    default: () => ['jpg', 'png', 'jpeg', 'xlsx', 'xls', '.xlsm', 'pdf', 'doc', 'docx'],
  },
  /** 默认的文件列表 string[] */
  defaultFileList: {
    type: Array,
    default: () => [],
  },
  /** 上传成功后端返回的字段名称 */
  responseFileName: {
    type: String,
    default: () => 'url',
  },
  /** 是否需要全屏loading */
  needFullScreenLoading: {
    type: Boolean,
    default: () => true,
  },
  /** 其实我也没搞清楚这东西有啥用，毕竟图片列表都看fileList，不用这家伙 */
  formdata: {
    type: Array,
    default: () => [{}],
  },
  /** 文件/图片列表，展示的图片列表 */
  fileList: {
    type: Array,
    default: () => [],
  },
  /** 文件/图片列表，展示的图片fileid列表 */
  fileidlist: {
    type: Array,
    default: () => [],
  },
  isSee: {
    type: Boolean,
    default: () => false,
  },
  isAuto: {
    type: Boolean,
    default: () => true,
  },
  imagelist: {
    type: Array,
    default: () => [],
  },
  /** 图片类型，0表示普通图片（不填写默认为0），1表示正面图片，2表示反面图片，3表示侧面图片，4表示细节图片 */
  imgtype: {
    type: Number,
    default: () => 0,
  },
  /** 是否需要按钮上传 */
  isbutton: {
    type: Boolean,
    default: () => false,
  },
  /** 组件显示列表类型 */
  listType: {
    type: String,
    default: () => 'picture-card',
  },
  /** 上传的总量限制 */
  maxTotalSize: {
    type: Number,
    default: () => 120 * 1024 * 1024,
  },
  /** 图片预览列表 */
  previewlist: {
    type: Array,
    default: () => [],
  },
});
const {
  name,
  limit,
  // limitSize,
  multiple,
  showFileList,
  showFileListType,
  types,
  defaultFileList,
  responseFileName,
  needFullScreenLoading,
  formdata,
  fileList,
  fileidlist,
  isSee,
  isAuto,
  imagelist,
  imgtype,
  isbutton,
  listType,
  maxTotalSize,
  previewlist
 } = toRefs(props);
const emits = defineEmits(['change', 'getfileId', 'getimglist', 'delfileId', 'getImgPath', 'finish', 'update:fileList']);
// const headers = {
//   'Authorization-admin': canvasConfig.getToken()
// }
const uploadRef = ref(null)
let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
// const formdata = ref(props.formdata);
// const uploadUrl = api.fileUpload
// 真实文件列表
// const fileList = ref(props.fileList);
// const fileList = ref([])
const limitSize = ref(10)
// 默认展示的list，解决多上传只回调success一次的问题
const viewFileList = ref([])
// 组件是否部署错误
const componentError = ref(false)
// 是否正在上传
const isUploading = ref(false)
// 是否改变（是否触发handleChange）
const isChange = ref(false)
// 预览对象
const previewObj = ref({
  show: false,
  file: null,
})
const filemap = ref([{}])
let imglist = ref([])
let detailImage = shallowRef('');
//图片的大小像素类型是否都正确
let isright = ref(true)
let batchFileList = ref([]) //上传文件
let isNeedCompress = ref(false) //是否需要压缩图片
const filesum = ref(0)
const rightFileUid = ref([])

const imgViewerVisible = ref(false)
const urlList = ref([])

onMounted(() => {
  console.log("上传组件upload挂载fileList.value---formdata.value", fileList.value, formdata.value)
  // fileList.value=formdata.value
});

function rotate(deg){
  console.log('旋转图片',deg);
}

const download = (index) => {
  const url = previewlist.value[index]
  const suffix = url.slice(url.lastIndexOf('.'))
  const filename = Date.now() + suffix

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
}

// 判断是否为 Excel 文件
const isExcelFile = (file) => {
  const excelTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls',
    '.xlsm',
    '.xlsx',
    '.pdf',
    '.doc',
    '.docx'
  ]
  
  return excelTypes.some(type => 
    file.type?.includes(type) || 
    file.name?.endsWith(type.replace('.', '')) ||
    file.raw?.type?.includes(type) ||
    file.url?.endsWith('.xls') ||
    file.url?.endsWith('.xlsm') ||
    file.url?.endsWith('.xlsx')
  )
}

/**
     * 检查type是否符合types的mime
     * @param type 文件后缀
     * @param types 可用文件后缀集合
     */
async function handleCheckFileMime(type, types) {
  const typeMimes = types.map((item) => mime.getType(item))
  console.log('检查type是否符合types的mime',typeMimes.includes(type),type);
  return typeMimes.includes(type)
}

async function handleCheckFileSize(fileSize, limitSize) {
  const limitByteSize = limitSize * 1024 * 1024
  return limitByteSize > fileSize
}


async function handleCheckWidthHeight(file) {
  return checkWidthHeight(file)
}

/**
     * 上传之前的钩子
     * @param file
     * @return {undefined}
     */
async function handleBeforeUpload(file) {
  // 检查mime
  const fileType = mime.getType(file.name.slice(file.name.lastIndexOf('.') + 1)) || file.type
  console.log('类型',fileType,types.value,file);
  const checkFileMime = await handleCheckFileMime(fileType, types.value)
  console.log("limitSize",limitSize.value)
  const checkFileSize = await handleCheckFileSize(file.size, limitSize.value)
  !checkFileSize ? (file.isJumpRemove = true) : undefined
  !checkFileSize
    ? ElMessage.warning(`文件大小不得超出${limitSize.value}m`)
    : undefined
  !checkFileMime ? (file.isJumpRemove = true) : undefined
  !checkFileMime
    ? ElMessage.warning(`文件类型不在合法列表 ${types.value}`)
    : undefined
  console.log('file-----',file);
  let valid = false
   // 使用正则表达式来匹配图片后缀
   const excelExtensions = /\.(jpg|png|jpeg)$/i;
  console.log('excelExtensions.test(file.name)',excelExtensions.test(file.name));
  if(!excelExtensions.test(file.name)&&fileType.includes("image")){
    //如果是图片类型但后缀不是jpg|png|jpeg
    ElMessage.warning(`图片文件后缀不在合法列表（jpg、png、jpeg）`)
    checkFileMime = false
  }
  if(excelExtensions.test(file.name)){
    //非excel文件不用检测大小
    valid = await handleCheckWidthHeight(file)
    console.log('是否需要压缩',isNeedCompress.value);
    console.log('checkFileSize && checkFileMime && valid',checkFileSize , checkFileMime , valid);
    isright.value = checkFileSize && checkFileMime && valid
  }else{
    valid = true
    isright.value = checkFileSize && checkFileMime && valid
  }
  console.log(file.name+'的isright',isright.value);
  if(isright.value){
    rightFileUid.value.push(file.uid)
  }
  return checkFileSize && checkFileMime && valid
}

const uploadIndex = ref(0) //因为上传成功的file不按顺序来，但是他的fileListData顺序是对的

/**
     * 上传成功钩子
     * @param response
     * @param file
     * @param fileList
     */
async function handleUploadSuccess(response, file2, fileListData) {
    return new Promise((resolve, reject) => {
    // 将上传任务包装成一个函数，并放入队列
    const task = async () => {
      try {
        console.log('uploadIndex.value111',uploadIndex.value,file2);
        let file = fileListData[uploadIndex.value++]
        console.log('uploadIndex.value222',uploadIndex.value);
        console.log('一共上传的文件总数',fileListData.length);
        filesum.value = fileListData.length;
        console.log("文件改变", file, fileListData, fileList.value, imglist.value)
        // if (file.status !== 'success') return;
        emits('finish', false);
        isUploading.value = true
        // emits('getimglist', imglist)
        let raw
        const excelExtensions = /\.(jpg|png|jpeg)$/i;
        if(excelExtensions.test(file.name)){
          console.log('进到压缩图片了',file);
          const compressedFile = await imageCompressor(file.raw)
          console.log('压缩后的compressedFile',compressedFile);
          raw = compressedFile
          await new Promise(resolve => {
          // 确保赋值操作完成
          setTimeout(() => {
            console.log('赋值完成')
            resolve()
          }, 0)
        })
        }else{
          raw = file.raw
        }
        //校验上传文件的总量
        let isover = await isOverMaxTotalSize(fileListData)
        if(isover){
          ElMessage.error('总文件大小不能超过'+maxTotalSize.value+'M限制');
          return;
        }
        let newFile
        // let raw = file.raw
        batchFileList.value = []
        //审款图片根据imgtype修改文件名称,添加后缀
        if(imgtype.value!=undefined && imgtype.value!=0){
          console.log('文件名称和imgtype和raw',imgtype.value,raw);
          switch (imgtype.value) {
            case 1:
              if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                  // 去除扩展名部分
                  const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                  // 创建新的文件名
                  let newFileName
                  if (!nameWithoutExtension.endsWith('_正')) {
                    newFileName = `${nameWithoutExtension}_正.${extension}`;
                  }else{
                    newFileName = raw.name
                  }
                  newFile = new File([raw], newFileName, { type: raw.type });
                  console.log("正面",newFile);
                }
              }
              break;
            case 2:
              if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                  // 去除扩展名部分
                  const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                  // 创建新的文件名
                  let newFileName
                  if (!nameWithoutExtension.endsWith('_反')) {
                    newFileName = `${nameWithoutExtension}_反.${extension}`;
                  }else{
                    newFileName = raw.name
                  }
                  newFile = new File([raw], newFileName, { type: raw.type });
                  console.log("反面",newFile);
                }
              }
              break;
            case 3:
              if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                  // 去除扩展名部分
                  const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                  // 创建新的文件名
                  let newFileName
                  if (!nameWithoutExtension.endsWith('_侧')) {
                    newFileName = `${nameWithoutExtension}_侧.${extension}`;
                  }else{
                    newFileName = raw.name
                  }
                  newFile = new File([raw], newFileName, { type: raw.type });
                  console.log("侧面",newFile);
                }
              }
              break;
            case 4:
              if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                  // 去除扩展名部分
                  const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                  // 创建新的文件名
                  let newFileName
                  if (!nameWithoutExtension.endsWith('_细')) {
                    newFileName = `${nameWithoutExtension}_细.${extension}`;
                  }else{
                    newFileName = raw.name
                  }
                  newFile = new File([raw], newFileName, { type: raw.type });
                  console.log("细节",newFile);
                }
              }
              break;
            default:
              console.log("无");
              break;
          }
          batchFileList.value.push(newFile)
        }else{
          console.log('不修改名称');
          batchFileList.value.push(raw)
        }
        // batchFileList.value = []
        // batchFileList.value.push(newFile)
        // batchFileList.value.push(raw)
        // let f = file.raw
        // console.log("fffffffff",f)
        var date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let subPath = "img/itemDraft/" + year + month;
        console.log("subpath,batchFileList", subPath, batchFileList.value)
        const formData2 = new FormData();
        for (let i = 0; i < batchFileList.value.length; i++) {
          formData2.append('fileList', batchFileList.value[i])
        }
        formData2.append('subPath', subPath)
        console.log('获取fileid的参数', formData2.getAll("fileList"));
        let canbeuploaded = rightFileUid.value.includes(file.uid)
        console.log('canbeuploaded',canbeuploaded,rightFileUid.value);
        if(canbeuploaded){
          isUploading.value = true;
          const res = await getfileid(formData2);
          if (res.code === '') {
            console.log('获取fileid成功的res', res, formData2.getAll("fileList"));
            filemap.value.push(res.data.fileMap);
            emits('getfileId', res.data.fileId);
            if (res.data.img !== undefined) {
              emits('getImgPath', res.data.img);
            }
            imglist.value.push({ 
              url: res.data.img.path, 
              fileid: res.data.fileId 
            });
            previewlist.value.push(res.data.img.path)
            file.fileid = res.data.fileId;
            file.url = res.data.img.path;
            isChange.value = true;
            console.log("filesum.value+++filelist+++imglist", filesum.value, fileList.value, imglist.value);
            if(filesum.value == imglist.value.length){
              ElMessage.success('全部文件已上传完成')
              emits("update:fileList", imglist.value)
              emits('finish', true);
            }
            resolve(res.data.fileId);
          } else {
            reject(new Error('上传失败，返回码不正确'));
          }
        }else isUploading.value = false
      } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
        reject(error);
      } finally {
        isUploading.value = false;
      }
    };
    // 将任务放入队列
    uploadQueue.value.push(task);
    // 尝试处理队列
    processQueue();
  });
}

/**
     * 超出数量的钩子
     * @param files
     * @param fileList
     */
function handleExceed(files, fileList) {
  ElMessage.warning(`文件总数大于可上传数量 ${limit.value}`)
}

/**
     * 文件即将移除的钩子
     * @param file
     * @param fileList
     */
async function handleBeforeRemove(file, fileListData) {
  console.log("handleBeforeRemove的fileList", fileList.value)
  console.log("imglist", imglist.value)
  let list = []
  fileList.value.forEach(i => {
    list.push(i.fileid)
  })
  for (let i = 0; i < imglist.value.length; i++) {
    if (list.indexOf(imglist.value[i].fileid) === -1) {
      console.log("imglist.value[i]", imglist.value[i])
      const fileid = imglist.value[i].fileid;
      const url = imglist.value[i].url;
      console.log("imglist的fileid,url", fileid, url)
      // formData.value.avatar = url
      fileList.value.push({
        fileid: fileid,
        imgPath: url,
        url: url
      })
    }
  }
  isChange.value = true;  // handleRemove
  console.log("移除前的fileList和imglist", fileList.value, imglist.value)
  // ElMessage.success('上传成功')
  // 如果是超出文件大小调用，放行
  // if (file?.raw?.isJumpRemove) {
  //   return true
  // }
  // return await ElMessageBox.confirm(
  //   '此操作将会删除已上传的文件, 是否继续?',
  //   '提示',
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
}

async function deleteByFileid(fileids){
  console.log('进入从minio里删除');
  await deletefile(fileids).then((res) => {
    console.log('从minio里删除成功',res);
  })
}

/**
     * 移除文件的钩子
     */
function handleRemove(file, fileListData) {
  console.log("移除的file", file)
  // if (file.name == undefined || !file.name.includes('.xlsx') || !file.name.includes('.xls')) {
    let list = []
    let imgfileidlist = []
    fileList.value.forEach(i => {
      list.push(i.fileid)
    })
    imglist.value.forEach(i => {
      imgfileidlist.push(i.fileid)
    })
    console.log("移除的list和imgfileidlist", list, imgfileidlist, isChange.value, fileList.value.length)
    console.log('现在是什么模式', import.meta.env.VITE_ENV);
    let index
    //因为部署的和本地的同样的代码，本地的ok但是部署到不行，所以加了import.meta.env.VITE_ENV === 'production'这个条件
    if (isChange.value || import.meta.env.VITE_ENV === 'production') {
      if (fileList.value.length) {
        index = list.indexOf(file.fileid);
        let imgindex = imgfileidlist.indexOf(file.fileid);
        console.log("能走进来吗", index)
        if (index != -1) {
          list.splice(index, 1)
          // fileList.value.splice(index, 1)
        }
        if (imgindex != -1) {
          imglist.value.splice(imgindex, 1)
        }
        if (index != -1 && imgindex != -1) {
          let fileids = []
          fileids.push(file.fileid)
          // deleteByFileid(fileids)
        }
      }
    }
    //移除掉预览图片列表里对应的图片
    const previewindex = previewlist.value.indexOf(file.url);
    if (previewindex !== -1) {
      previewlist.value.splice(previewindex, 1);
    }
    console.log("删除后的list和fileList", list, fileList.value)
    emits('delfileId', list,index);
  // } else {
  //   fileList.value.splice(0, fileList.value.length);
  //   imglist.value.splice(0, imglist.value.length);
  //   console.log('导入excel文件fileList.value,imglist.value', fileList.value, imglist.value);
  //   emits('delfileId', []);
  // }

}
// function handleRemove(file, fileListData) {
//   console.log("移除的file", file, fileList.value, imglist.value)
//   if (file.name == undefined || !file.name.includes('.xlsx') || !file.name.includes('.xls')) {
//     let list = []
//     let imgfileidlist = []
//     fileList.value.forEach(i => {
//       list.push(i.fileid)
//     })
//     imglist.value.forEach(i => {
//       imgfileidlist.push(i.fileid)
//     })
//     console.log("移除前的list和imgfileidlist", list, imgfileidlist)
//     //因为部署的和本地的同样的代码，本地的ok但是部署到不行，所以加了import.meta.env.VITE_ENV === 'production'这个条件
//     console.log('现在是什么模式', import.meta.env.VITE_ENV);
//     if (isChange.value || import.meta.env.VITE_ENV === 'production') {
//       if (fileList.value.length || imglist.value.length) {
//         let index = list.indexOf(file.fileid);
//         let imgindex = imgfileidlist.indexOf(file.fileid);
//         console.log("能走进来吗index--imgindex--file.fileid", index, imgindex, file.fileid)
//         if (index != -1) {
//           console.log('剔除了1');
//           list.splice(index, 1)
//           fileList.value.splice(index, 1)
//         }
//         if (imgindex != -1) {
//           console.log('剔除了2');
//           imglist.value.splice(imgindex, 1)
//           imgfileidlist.splice(imgindex, 1)
//         }
//       }
//     }
//     console.log("移除后的list和imgfileidlist", list, imgfileidlist)
//     console.log("删除后的list和fileList", list, fileList.value)
//     emits('delfileId', list);
//   } else {
//     fileList.value.splice(0, fileList.value.length);
//     imglist.value.splice(0, imglist.value.length);
//     console.log('导入excel文件fileList.value,imglist.value', fileList.value, imglist.value);
//     emits('delfileId', []);
//   }
//   // console.log("handleRemove的file, fileListData",file, fileListData)
//   // if (file?.raw?.isJumpRemove) {
//   //   return
//   // }
//   // console.log("传过来的fileidlist",fileidlist.value)
//   // // if(fileidlist.value.length>0){
//   // //   fileidlist.value.forEach(i => {
//   // //       emits('delfileId', i);
//   // //   })
//   // // }
//   // console.log("移除前的file list",fileList.value,fileList.value.length)
//   // if (fileList.value.length) {
//   //   console.log("能走进来吗")
//   //   fileList.value.splice(
//   //     fileList.value.findIndex(
//   //       (fileItem) =>
//   //         file?.response?.data[responseFileName.value] === fileItem.url ||
//   //               file.url === fileItem.url
//   //     ),
//   //     1
//   //   )
//   // }
//   // console.log("filemap",filemap.value)
//   // console.log("移除的file",file)
//   // //filemap初始会有一个空的类作为第一个元素[0:{}],所以是length>1
//   // if(filemap.value.length>1){
//   //   filemap.value.forEach(i => {
//   //     let name = file.raw.name
//   //     console.log("i[name]----",i[name])
//   //     if(i[name]!=undefined){
//   //       emits('delfileId', i[name]);
//   //       return;
//   //     }
//   //   })
//   // }
// }

async function isOverMaxTotalSize(fileListData){
  const totalSize = fileListData.reduce((sum, file) => sum + file.size, 0);
  console.log('总量和限额',totalSize , maxTotalSize.value);
  if (totalSize > maxTotalSize.value) {
    return true;
  }else return false
}

let currentUpload = Promise.resolve();

/**
     * 文件改变的钩子 
     * 因为该死的on-change和before-upload是同时进行的，
     * 导致上传excel文件的时候before-upload还没校验完给rightFileUid.value插值，
     * on-change就已经跑到校验canbeuploaded那说失败了，
     * 故取消on-change的钩子，上传服务器获取fileid放到on-success钩子那里了。
     */
async function handleChange(file, fileListData) {
  console.log("文件改变", file, fileListData, fileList.value, imglist.value)
  if (file.status !== 'success') return;
  emits('finish', false);
  isUploading.value = true
  // emits('getimglist', imglist)
  let raw
  const excelExtensions = /\.(jpg|png|jpeg)$/i;
  if(excelExtensions.test(file.name)){
    console.log('进到压缩图片了',file);
    const compressedFile = await imageCompressor(file.raw)
    console.log('压缩后的compressedFile',compressedFile);
    raw = compressedFile
  }else{
    raw = file.raw
  }
  //校验上传文件的总量
  let isover = await isOverMaxTotalSize(fileListData)
  if(isover){
    ElMessage.error('总文件大小不能超过'+maxTotalSize.value+'M限制');
    return;
  }
  let newFile
  // let raw = file.raw
  batchFileList.value = []
  //审款图片根据imgtype修改文件名称,添加后缀
  if(imgtype.value!=undefined && imgtype.value!=0){
    console.log('文件名称和imgtype和raw',raw.name,imgtype.value,raw);
    switch (imgtype.value) {
      case 1:
        if(raw.name!=undefined && raw.name!=null && raw.name!=""){
          const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
          if (['jpg', 'jpeg', 'png'].includes(extension)) {
            // 去除扩展名部分
            const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
            // 创建新的文件名
            let newFileName
            if (!nameWithoutExtension.endsWith('_正')) {
              newFileName = `${nameWithoutExtension}_正.${extension}`;
            }else{
              newFileName = raw.name
            }
            newFile = new File([raw], newFileName, { type: raw.type });
            console.log("正面",newFile);
          }
        }
        break;
      case 2:
        if(raw.name!=undefined && raw.name!=null && raw.name!=""){
          const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
          if (['jpg', 'jpeg', 'png'].includes(extension)) {
            // 去除扩展名部分
            const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
            // 创建新的文件名
            let newFileName
            if (!nameWithoutExtension.endsWith('_反')) {
              newFileName = `${nameWithoutExtension}_反.${extension}`;
            }else{
              newFileName = raw.name
            }
            newFile = new File([raw], newFileName, { type: raw.type });
            console.log("反面",newFile);
          }
        }
        break;
      case 3:
        if(raw.name!=undefined && raw.name!=null && raw.name!=""){
          const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
          if (['jpg', 'jpeg', 'png'].includes(extension)) {
            // 去除扩展名部分
            const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
            // 创建新的文件名
            let newFileName
            if (!nameWithoutExtension.endsWith('_侧')) {
              newFileName = `${nameWithoutExtension}_侧.${extension}`;
            }else{
              newFileName = raw.name
            }
            newFile = new File([raw], newFileName, { type: raw.type });
            console.log("侧面",newFile);
          }
        }
        break;
      case 4:
        if(raw.name!=undefined && raw.name!=null && raw.name!=""){
          const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
          if (['jpg', 'jpeg', 'png'].includes(extension)) {
            // 去除扩展名部分
            const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
            // 创建新的文件名
            let newFileName
            if (!nameWithoutExtension.endsWith('_细')) {
              newFileName = `${nameWithoutExtension}_细.${extension}`;
            }else{
              newFileName = raw.name
            }
            newFile = new File([raw], newFileName, { type: raw.type });
            console.log("细节",newFile);
          }
        }
        break;
      default:
        console.log("无");
        break;
    }
    batchFileList.value.push(newFile)
  }else{
    console.log('不修改名称');
    batchFileList.value.push(raw)
  }
  // batchFileList.value = []
  // batchFileList.value.push(newFile)
  // batchFileList.value.push(raw)
  // let f = file.raw
  // console.log("fffffffff",f)
  var date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let subPath = "img/itemDraft/" + year + month;
  console.log("subpath,batchFileList", subPath, batchFileList.value)
  const formData2 = new FormData();
  for (let i = 0; i < batchFileList.value.length; i++) {
    formData2.append('fileList', batchFileList.value[i])
  }
  formData2.append('subPath', subPath)
  console.log('获取fileid的参数', formData2.getAll("fileList"));
  let canbeuploaded = rightFileUid.value.includes(file.uid)
  console.log('canbeuploaded',canbeuploaded,rightFileUid.value);
  if(canbeuploaded){
    return new Promise((resolve, reject) => {
    // 将上传任务包装成一个函数，并放入队列
    const task = async () => {
      try {
        isUploading.value = true;
        const res = await getfileid(formData2);
        if (res.code === '') {
          console.log('获取fileid成功的res', res, formData2.getAll("fileList"));
          filemap.value.push(res.data.fileMap);
          emits('getfileId', res.data.fileId);
          if (res.data.img !== undefined) {
            emits('getImgPath', res.data.img);
          }
          imglist.value.push({ 
            url: res.data.img.path, 
            fileid: res.data.fileId 
          });
          file.fileid = res.data.fileId;
          file.url = res.data.img.path;
          isChange.value = true;
          console.log("filesum.value+++filelist+++imglist", filesum.value, fileList.value, imglist.value);
          if(filesum.value == imglist.value.length){
            ElMessage.success('全部文件已上传完成')
            emits('finish', true);
          }
          resolve(res.data.fileId);
        } else {
          reject(new Error('上传失败，返回码不正确'));
        }
      } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
        reject(error);
      } finally {
        isUploading.value = false;
      }
    };
    // 将任务放入队列
    uploadQueue.value.push(task);
    // 尝试处理队列
    processQueue();
  });
  }else isUploading.value = false
}

const uploadQueue = ref([]);
const isProcessingQueue = ref(false);

async function processQueue() {
  // 如果正在处理队列或队列为空，则返回
  if (isProcessingQueue.value || uploadQueue.value.length === 0) {
    return;
  }

  isProcessingQueue.value = true;
  const task = uploadQueue.value[0];

  try {
    await task();
  } catch (error) {
    console.error('上传任务出错:', error);
  } finally {
    // 移除已完成的任务
    uploadQueue.value.shift();
    isProcessingQueue.value = false;
    // 处理下一个任务
    processQueue();
  }
}

/**
     * 通知父组件
     */
function handleNotifyFather() {
  emits('change', fileList.value)
}

/**
     * 预览
     * 图片视频直接预览，其他下载
     * @param file
     */
// function handlePreviewOpen (file) {
//   if (!file.type) {
//     file.type =
//           mime.getType(file?.url?.slice(file?.url?.lastIndexOf('.') + 1)) ||
//           mime.getType(file?.name?.slice(file?.name.lastIndexOf('.') + 1)) ||
//           undefined
//   }
//   if (file.type.includes('image') || file.type.includes('video')) {
//     previewObj.value.file = file
//     previewObj.value.show = true
//   } else {
//     ElMessageBox.confirm('需要下载才能预览此文件, 是否继续?', '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     })
//       .then(() => {
//         let htmlAnchorElement = document.createElement('a')
//         htmlAnchorElement.download = file?.url.slice(
//           file?.url.lastIndexOf('/') + 1
//         )
//         htmlAnchorElement.target = '_bank'
//         htmlAnchorElement.href = file?.url
//         htmlAnchorElement.click()
//         htmlAnchorElement = null
//       })
//       .catch(() => {})
//   }
// }

function previewPic(url){
  imgViewerVisible.value = true
  let list = rotateArray(previewlist.value, url)
  console.log('预览图片列表',list,previewlist.value);
  urlList.value = list
  console.log('预览图片的url和previewlist',url,urlList.value);
}

function closeImgViewer(){
  console.log('关闭预览');
  imgViewerVisible.value = false
}

function handlePreviewOpen(file) {
  detailImage.value = file.imgPath!=undefined?file.imgPath:file.url
  console.log("图片地址", file, file.imgPath,detailImage.value)
  const extensions = ['.xlsx', '.xls', '.xlsm', '.doc', '.docx', '.pdf'];
  let isDownload = extensions.some(ext => detailImage.value.endsWith(ext.toLowerCase()))
  console.log('能下载嘛？',isDownload);
  if (isDownload) {
    //下载
    downloadByBlod(detailImage.value,file.name)
    visible.image = false
  }else{
    previewPic(detailImage.value)
  }
}

function rotateArray(arr, selected) {
    const index = arr.indexOf(selected);
    
    // 如果元素不存在，返回原数组
    if (index === -1) return arr;
    
    // 截取从选中元素到末尾的部分 + 开头到选中元素之前的部分
    return arr.slice(index).concat(arr.slice(0, index));
}


function handlePreviewClose() {
  // previewObj.value.file = null
  // previewObj.value.show = false
  visible.image = false
}

watch(() => defaultFileList, (newVal) => {
  // 判断类型
  const flag =
    Object.prototype.toString.call(defaultFileList.value) ===
    '[object Array]' &&
    defaultFileList.value.length > 0 &&
    Object.prototype.toString.call(defaultFileList.value[0]) !==
    '[object String]'
  if (flag) {
    componentError.value = true
    throw new Error('defaultFileList格式错误，应为string[]格式')
  } else {
    componentError.value = false
  }
  console.log(defaultFileList);
  viewFileList.value = defaultFileList.value.map((defaultFilePath) => ({
    name: defaultFilePath,
    url: defaultFilePath,
  }))
  viewFileList.value.forEach((item) => {
    fileList.value.push(item)
  })
}, { immediate: true, deep: true })

//监听fileList，如果父组件那里发生变化，立即赋给子组件（本组件)的fileList
watch(
  () => fileList, (newVal) => {
    console.log("上传组件的fileList--newVal", newVal.value)
    fileList.value = newVal.value
    imglist.value = newVal.value
    console.log('重新修改uploadIndex',fileList.value.length);
    uploadIndex.value = fileList.value.length
    if(fileList.value.length==0){
      rightFileUid.value = []
    }
    // console.log("fileList",fileList.value)
    handleNotifyFather()
  }, { immediate: false, deep: true })
watch(
  () => formdata, (newVal) => {
    console.log("upload组件的formdata--newVal", newVal)
  }, { immediate: true, deep: true },)
watch(
  () => isSee, (newVal) => {
    console.log("upload组件的isSee的newval", newVal.value)
    componentError.value = newVal.value
  }, { immediate: true, deep: true },)
watch(
  () => imagelist, (newVal) => {
    console.log("upload组件的imagelist--newVal", newVal.value)
    imglist.value = newVal.value
    // console.log("fileList",fileList.value)
  }, { immediate: false, deep: true })
// watch(
//   () => showUpload, (newVal) => {
//     console.log("upload组件的showUpload的newval", newVal.value)
//     uploadIndex.value = 0
//     rightFileUid.value = []
//     if(fileList.value.length>0){
//       console.log('重新修改uploadIndex',fileList.value.length);
//       uploadIndex.value = fileList.value.length
//     }
//   }, { immediate: true, deep: true },)
</script>

<style lang="scss" scoped>
// :deep(.el-upload) {
//   width: 100% !important;

//   .el-upload-dragger {
//     width: 100% !important;
//   }
// }

.error-text {
  font-size: 18px;
  font-weight: bolder;
  color: red;
  animation: error-animation 2.5s ease-in-out infinite;
}

@keyframes error-animation {

  0%,
  100% {
    font-size: 18px;
    color: red;
  }

  25%,
  75% {
    font-size: 16px;
    color: #b9b1b1;
  }

  50% {
    font-size: 18px;
    color: #500000;
  }
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;

  .preview-item {
    min-width: 800px;
  }
}

:deep(.el-upload-list--picture-card){
  width: 100%;
}
</style>
