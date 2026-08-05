<template>
  <div class="module-box single-img">
    <div class="single-img__box">
      <el-upload
        drag
        :headers="headers"
        :action="uploadUrl"
        :fileList="fileList"
        :on-change="handleChange"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="single-img__img" />
        <div v-else>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>选择图片</em>
          </div>
          <div class="el-upload__tip">
            {{ tip }}
          </div>
        </div>
      </el-upload>
      <div v-if="imageUrl" class="overlay">
        <i class="iconfont icon-chakan" @click="showImage" />
        <i class="iconfont icon-shanchu1" @click="delImage" />
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="图片展示">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from "vue";
import api from "@@/components/canvasShow/config/api";
import { UploadFilled } from "@element-plus/icons-vue";
import canvasConfig from "../../canvasShow/config/config";
import { sendReqMixin } from "@@/components/canvasShow/config/mixin";

const { sendReq } = sendReqMixin();

const headers = {
  "Authorization-admin": canvasConfig.getToken(),
};
const baseURL =
  import.meta.env.VITE_ENV === "development"
    ? "/api"
    : import.meta.env.VITE_BASE_URL;
const uploadUrl = `${baseURL}/file/upload`;
console.log("uploadUrl", uploadUrl);

const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const fileUploadApi = ref({
  fileUpload: "",
});

const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
  /** 文件/图片列表，展示的图片列表 */
  fileList: {
    type: Array,
    default: () => [],
  },
  tip: {
    type: String,
    default: "建议尺寸: 1080*900px, 高度自适应",
  },
});
let batchFileList = ref([]); //上传文件
const { imageUrl, tip, fileList } = toRefs(props);
const emits = defineEmits(["update:imageUrl"]);

onMounted(() => {
  fileUploadApi.value = api;
});

/**
 * 文件改变的钩子
 */
function handleChange(file, fileListData) {
  if (file.status !== "ready") return;
  console.log("文件改变", file, fileListData, fileList.value);
  // imglist.value.push({url:file.url,fileid:0})
  // emits('getimglist', imglist)
  batchFileList.value = [];
  batchFileList.value.push(file.raw);
  // let f = file.raw
  // console.log("fffffffff",f)
  var date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let subPath = "img/itemDraft/" + year + month;
  console.log("subpath,batchFileList", subPath, batchFileList.value);
  const formData2 = new FormData();
  for (let i = 0; i < batchFileList.value.length; i++) {
    formData2.append("fileList", batchFileList.value[i]);
  }
  formData2.append("subPath", subPath);
  console.log(
    "formData2---",
    formData2.getAll("fileList"),
    batchFileList.value
  );
  const params = {
    url: api.fileUpload,
    method: "POST",
    data: formData2,
  };
  sendReq(params, (res) => {
    if (res.code === "") {
      console.log("获取fileid成功的res", res);
      const params = {
        url: api.getFile,
        method: "POST",
        data: {
          fileId: res.data.fileId,
        },
      };
      sendReq(params, (res) => {
        console.log("进来咯", res.data);
        emits("update:imageUrl", res.data);
      });
      // ElMessage.success('获取fileid成功')
      // filemap.value.push(res.data.fileMap);
      // emits("getfileId", res.data.fileId);
      // f.fileid = res.data.fileId
      // fileList.value.push(f)
      // imglist.value[imglist.value.length-1].fileid = res.data.fileId
      file.fileid = res.data.fileId;
      isChange.value = true;
      // console.log("filelist+++imglist",fileList.value,imglist.value)
      return res.data.fileId;
      // emits('getfileId', res.data.fileId);
      // emits('getimglist', imglist)
    }
  });
  // getfileid(formData2).then((res) => {
  //     if (res.code === '') {
  //       console.log('获取fileid成功的res',res);
  //       // ElMessage.success('获取fileid成功')
  //       filemap.value.push(res.data.fileMap)
  //       emits('getfileId', res.data.fileId);
  //       // f.fileid = res.data.fileId
  //       // fileList.value.push(f)
  //       // imglist.value[imglist.value.length-1].fileid = res.data.fileId
  //       file.fileid = res.data.fileId
  //       isChange.value = true
  //       // console.log("filelist+++imglist",fileList.value,imglist.value)
  //       return res.data.fileId
  //       // emits('getfileId', res.data.fileId);
  //       // emits('getimglist', imglist)
  //     }
  // })
  // console.log("filelist+++imglist00000",fileList.value,imglist.value)
}

function handleAvatarSuccess(res, file) {
  emits("update:imageUrl", res.data.url);
}

function beforeAvatarUpload(file) {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    ElMessage.error("上传图片大小不能超过 1MB!");
  }
  return isLt1M;
}

function showImage() {
  dialogImageUrl.value = imageUrl.value;
  dialogVisible.value = true;
}
function delImage() {
  emits("update:imageUrl", "");
}
</script>

<style lang="scss" scoped>
.single-img {
  &__box {
    position: relative;
    :deep(.el-upload) {
      width: 100%;
    }
    :deep(.el-upload-dragger) {
      width: 100%;
      .el-upload__text {
        line-height: 40px;
      }
      .el-upload__tip {
        line-height: 1em;
      }
    }
    .overlay {
      display: none;
    }
    &:hover .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        padding: 5px;
        margin: 0 5px;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  &__img {
    position: absolute;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
