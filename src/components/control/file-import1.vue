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
  <!-- <div v-if="!config.directImport"> -->
  <!-- <el-upload
      class="upload-demo"
      :action="uploadTempFileUrl"
      :on-change="handleChange"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :accept="config.accept === undefined ? '' : config.accept.join(',')"
      :file-list="fileList"
    >
      <el-button
        :size="config.size === undefined ? 'small':config.size"
        :type="config.buttontype === undefined ? buttontype:config.buttontype"
      >{{config.importTip === undefined?'点击上传':config.importTip}}</el-button>
      <div
        slot="tip"
        v-if="!(config.accept === undefined) && (config.tipShow === undefined? true:config.tipShow)"
        class="el-upload__tip"
      >
        只能上传
        <q v-for="itm in accept" :key="itm">{{itm}}</q>
        文件
      </div>
    </el-upload>
  </div>
  <div v-else-if="config.directImport">
    <el-upload
      class="upload-demo"
      :action="uploadTempFileUrl"
      :on-change="handleChange"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :accept="config.accept === undefined ? '' : config.accept.join(',')"
      :file-list="fileList"
    >
     <slot name="button"></slot>
    </el-upload>
    <input
      ref="filElem1"
      type="file"
      style="display: none;"
      class="upload-file"
      :accept="config.accept === undefined ? '' : config.accept.join(', ')"
      @change="handleFiles($event)"
  >-->
  <!-- </div> -->
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
        // 使用file.Type判断
        // let arr = this.config.accept.join(",");
        // let acc = arr.split(",");
        // let findtype = acc.find(ele => ele === file.type);
        // let findtype2 = acc.find(ele => ele == suffix);
        // if (findtype === undefined) {
        //   this.$message.error("请上传符合的文件类型！");
        //   return false;
        // } else {
        //   return true;
        // }
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
