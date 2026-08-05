<template>
  <el-upload
    class="upload-demo inline-block margin-right-10"
    :action="uploadTempFileUrl"
    :on-change="handleChange"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :accept="config.accept === undefined ? '' : config.accept.join(',')"
    :file-list="fileList"
    :show-file-list="!config.directImport"
  >
    <slot name="button"></slot>
    <div
      v-if="!(config.accept === undefined) && (config.tipShow === undefined? false:config.tipShow)"
      class="el-upload__tip"
    >
      只能上传
      <q v-for="itm in accept" :key="itm">{{itm}}</q>
      文件
    </div>
  </el-upload>

</template>
<script>
import { uploadTempFileUrl } from "@/config/env";
export default {
  name: "ExcelImport",
  components: {},
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      uploadTempFileUrl: uploadTempFileUrl,
      accept: [],
      fileList: [],
      uploadData: {
        file: {},
        fileName: "",
        fileId: "", // 返回Id值
        isReady: false // true表示未生成完
      },
      isReady: false,
      buttontype: "primary"
    };
  },
  watch: {
    // 更新数据
    isReady: {
      handler(val) {
        //console.log("isReady", val);
        this.config.uploadData.isReady = val;
        this.$parent.$emit("config", this.config);
        if (val) this.$emit("on-ready", this.config);
        // this.handleRemove();
      }
    }
  },
  created() {
      console.log("uploadTempFileUrl: ", this.uploadTempFileUrl);
    this.config.uploadData = {
      file: {},
      fileName: "",
      fileId: "",
      content: "", // content-type+base64
      isReady: this.config.isReady // true表示未生成完
    };
    if (this.config.accept !== undefined) {
      let arr = this.config.accept;
      let _this = this;
      arr.map(function(i) {
        if (i === _this.$FILETYPE.EXCEL_TYPE) {
          _this.accept.push(".xls,.xlsx");
        }
        if (i === _this.$FILETYPE.DOC_TYPE) {
          _this.accept.push(".doc,.dot ");
        }
        if (i === _this.$FILETYPE.GIF_TYPE) {
          _this.accept.push(".gif");
        }
        if (i === _this.$FILETYPE.IMG_TYPE) {
          _this.accept.push(".png,.jpe,.jpeg,.jpg");
        }
        if (i === _this.$FILETYPE.TXT_TYPE) {
          _this.accept.push(".txt");
        }
        if (i === _this.$FILETYPE.CSV_TYPE) {
          _this.accept.push(".csv");
        }
        if (i === _this.$FILETYPE.ZIP_TYPE) {
          _this.accept.push(".zip, .rar");
        }
      });
    }
  },

  methods: {
    /* 上传第一步，替换文件列表 */
    /* 添加文件， 上传成功， 上传失败都会被调用 */
    handleChange(value, fileList) {
      //console.log("handleChange");
      // 初始化状态
      if (fileList !== undefined) {
        // 超出限制替换
        //console.log("fileList", fileList);
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        } else if (fileList.length === 0) {
          this.$message.error("上传出错, 请刷新重试");
        }
      }
    },
    /* 上传第二步，限制上传文件类型*/
    beforeUpload(file) {
      console.log("当前上传地址为：", this.uploadTempFileUrl);
      console.log("file.type", file);
      this.isReady = false;
      if (this.config.accept !== undefined) {
        // 使用文件后缀名判断
        let filename = file.name;
        var flieArr = filename.split(".");
        var suffix = "." + flieArr[flieArr.length - 1];
        let arr = this.accept.join(",");
        let acc = arr.split(",");
        let findtype = acc.find(ele => ele === suffix.toLowerCase());
        if (findtype === undefined) {
          this.$message.error("请上传符合的文件类型！");
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    /* 上传成功， 回调文件数据*/
    uploadSuccess(response, file) {
      //console.log("uploadSuccess");
      if (response.code === 0) {
        this.config.uploadData.file = file.raw;
        this.config.uploadData.fileName = file.name;
        this.config.uploadData.fileId = response.fileId;
        this.config.uploadData.isReady = true;
        this.isReady = true;
      } else {
        this.$message.error(response.message);
      }
    },
    /* 上传出错 */
    uploadError(response) {
      //console.log("uploadError");
      this.$message.error(response.write);
    },
    /** 移除操作 */
    handleRemove() {
      this.config.uploadData = {
        file: {},
        fileName: "",
        fileId: "", // content-type+base64
        isReady: false // 0表示未生成完
      };
      this.isReady = false;
      //console.log(this.config.uploadData, "isReady");
    }
  }
};
</script>

<style>
.inline-block {
  display: inline-block;
}
</style>








<!-- <template>
  <el-upload
    class="upload-demo inline-block margin-right-10"
    :action="uploadTempFileUrl"
    :on-change="handleChange"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :accept="acceptAttr"
    :file-list="fileList"
    :show-file-list="!config.directImport"
  >
    <slot name="button"></slot>
    <div
      v-if="showTip"
      class="el-upload__tip"
    >
      只能上传
      <q v-for="itm in acceptList" :key="itm">{{ itm }}</q>
      文件
    </div>
  </el-upload>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadTempFileUrl as uploadUrl } from '@/config/env'

// Props
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['on-ready', 'config'])

// 引用变量
const uploadTempFileUrl = uploadUrl
const fileList = ref([])
const acceptList = ref([])
const isReady = ref(false)

// 处理 accept 属性
const acceptAttr = computed(() => {
  return props.config.accept ? props.config.accept.join(',') : ''
})

const showTip = computed(() => {
  return props.config.accept !== undefined &&
         (props.config.tipShow === undefined ? false : props.config.tipShow)
})

// 初始化配置
onMounted(() => {
  props.config.uploadData = {
    file: {},
    fileName: '',
    fileId: '',
    content: '',
    isReady: props.config.isReady || false
  }

  const acceptMap = {
    EXCEL_TYPE: '.xls,.xlsx',
    DOC_TYPE: '.doc,.dot',
    GIF_TYPE: '.gif',
    IMG_TYPE: '.png,.jpe,.jpeg,.jpg',
    TXT_TYPE: '.txt',
    CSV_TYPE: '.csv',
    ZIP_TYPE: '.zip,.rar'
  }

  if (props.config.accept) {
    props.config.accept.forEach(type => {
      if (acceptMap[type]) {
        acceptList.value.push(acceptMap[type])
      }
    })
  }
})

// 监听 isReady 变化
watch(isReady, (val) => {
  props.config.uploadData.isReady = val
  emit('config', props.config)
  if (val) {
    emit('on-ready', props.config)
  }
})

// 方法定义
function handleChange(file, fileListNew) {
  if (fileListNew.length > 1) {
    fileListNew.splice(0, 1)
  } else if (fileListNew.length === 0) {
    ElMessage.error('上传出错, 请刷新重试')
  }
  fileList.value = fileListNew
}

function beforeUpload(file) {
  isReady.value = false

  if (props.config.accept) {
    const suffix = '.' + file.name.split('.').pop().toLowerCase()
    const allowed = acceptList.value.join(',').split(',')
    const isValid = allowed.includes(suffix)

    if (!isValid) {
      ElMessage.error('请上传符合的文件类型！')
      return false
    }
  }

  return true
}

function uploadSuccess(response, file) {
  if (response.code === 0) {
    props.config.uploadData.file = file.raw
    props.config.uploadData.fileName = file.name
    props.config.uploadData.fileId = response.fileId
    props.config.uploadData.isReady = true
    isReady.value = true
  } else {
    ElMessage.error(response.message)
  }
}

function uploadError(err) {
  ElMessage.error(err?.message || '上传失败')
}

function handleRemove() {
  props.config.uploadData = {
    file: {},
    fileName: '',
    fileId: '',
    isReady: false
  }
  isReady.value = false
  fileList.value = []
}
</script>

<style scoped>
.inline-block {
  display: inline-block;
}
</style> -->
