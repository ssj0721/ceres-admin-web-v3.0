  <template>
    <div>
      <el-upload
        ref="upload"
        :show-file-name="showFileName"
        :new-preview-window="newPreviewWindow"
        :class="{ noneUploadBtn: noneUploadBtn }"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error="handleError"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :before-upload="handleBeforeUpload"
        :before-remove="handleBeforeRemove"
        :multiple="multiple"
        :limit="limit"
        :auto-upload="autoUpload"
        :on-exceed="handleExceed"
        :data="uploadData"
        :file-list="fileList"
        list-type="picture-card"
        :accept="accept"
        :http-request="httpRequest"
        :headers="authHeaders"
        :disabled="disabled"
        >
        <!-- 提示文字区域 -->
        <template #tip>
          <div class="el-upload__tip">
            {{ errMsg }}
          </div>
        </template>

        <!-- 默认插槽：上传按钮 -->
        <template #default>
          <i class="el-icon-plus"></i>
        </template>

        <!-- 文件插槽：自定义每个文件的显示 -->
        <template #file="{ file }">
          <div v-if="showFileName">{{ file.name }}</div>
          <img
            v-if="showFileName"
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt="请单击打开附件"
          />
          <img
            v-else
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt="非图片不能预览"
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <el-icon><Plus /></el-icon>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="$refs.upload.handleRemove(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </template>
      </el-upload>


      <el-image-viewer
          v-if="previewType == 'IMAGE' && imgViewerVisible"
          :on-close="closeImgViewer"
          width="20%"
          :url-list="Previewlist"
          alt="非图片不能预览"
          />
      <el-dialog
        :visible.sync="dialogVisible"
        customClass="previewDialog"
        append-to-body
      >
        <!-- <img
          v-if="previewType == 'IMAGE'"
          width="100%"
          fit="contain"
          :src="dialogImageUrl"
          alt="非图片不能预览"
        /> -->
          <!-- <el-image-viewer
          v-if="previewType == 'IMAGE' && imgViewerVisible"
          :on-close="closeImgViewer"
          width="20%"
          :url-list="Previewlist"
          alt="非图片不能预览"
          /> -->
        <embed
          v-if="previewType == 'PDF'"
          width="100%"
          height="600"
          :src="dialogImageUrl"
          type="application/pdf"
        />
      </el-dialog>
      <el-button
        v-if="!autoUpload"
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传</el-button
      >
    </div>
  </template>

  <script>
  import { ElImageViewer } from 'element-plus';
  import { uploadFileUrl, uploadMultiFileUrl } from "@/config/env";
  import Signal from "@/plugins/await-signal";
  import { getToken } from "@/utils/auth-iRetail";
  import axios from "axios";
  import defaultPic from "@/assets/img/datafile.png";
  // import Compressor from 'compressorjs';
  function noop() {}

  export default {
    name: "sysfileupload",
    props: {
      // 是否显示文件名
      showFileName: { type: Boolean, default: false },
      // 是否打开新预览窗口
      newPreviewWindow: { type: Boolean, default: false },
      noneUploadBtn: { type: Boolean, default: false },
      minSize: { type: Number, default: 0 },
      maxSize: { type: Number, default: 2 },
      limit: { type: Number, default: 3 },
      imageMaxWidth: { type: Number, default: 2048 },
      imageMaxHeight: { type: Number, default: 2048 },
      imageMinWidth: { type: Number, default: 800 },
      imageMinHeight: { type: Number, default: 800 },
      multiple: { type: Boolean, default: true },
      autoUpload: { type: Boolean, default: true },
      accept: { type: String, default: ".jpg,.jpeg,.png,.gif,.bmp" },
      subPath: { type: String, default: "tmp" },
      fileList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      onRemove: { type: Function, default: noop },
      onUploadSuccess: { type: Function, default: noop },
      onUploadError: { type: Function, default: noop },
    },
    data() {
      return {
        //authHeaders: undefined,
        uploadUrl: uploadFileUrl,
        uploadMultiUrl: uploadMultiFileUrl,
        uploadData: {},
        errMsg: "",
        formData: undefined,
        defaultPic,
        dialogImageUrl: "",
        dialogVisible: false,
        previewType: undefined,
        imgViewerVisible: false,
        Previewlist:[]
      };
    },
    components:{
        // 'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
        'el-image-viewer': ElImageViewer
      },
    mounted() {
      const acceptFiles = this.accept;
      const minSize = this.minSize;
      const maxSize = this.maxSize;
      const sizeMsg = [];
      if (minSize > 0) sizeMsg.push(`>=${minSize} MB`);
      if (maxSize > 0) sizeMsg.push(`<=${maxSize} MB`);

      const totMsg = [];
      totMsg.push(`只能上传 ${acceptFiles} 文件`);
      if (sizeMsg.length > 0) {
        const s = sizeMsg.join("，");
        totMsg.push(`且文件大小${s}`);
      }

      this.errMsg = totMsg.join("，");
      console.log("errMsg", this.errMsg);
    },
    computed: {
      httpRequest: function () {
        if (!this.autoUpload) {
          return this.handleHttpRequest;
        } else {
          return undefined;
        }
      },
      authHeaders: function () {
        return { Authorization: "Bearer " + getToken() };
      },
    },
    methods: {



      showImgViewer(){
        this.imgViewerVisible = true;
        this.fileList.forEach((e) => {
        if (!this.Previewlist.includes(e.url)) {
              this.Previewlist.push(e.url);
        }
        });
        const m = (e) => { e.preventDefault() };
        document.body.style.overflow = 'hidden';
        document.addEventListener("touchmove", m, false); // 禁止页面滑动
        },
      closeImgViewer(){
        this.imgViewerVisible = false;
        this.dialogVisible = false;
        const m = (e) => { e.preventDefault() };
        document.body.style.overflow = 'auto';
        document.removeEventListener("touchmove", m, true);
        },



      isImage(fileName) {
        return /\.(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIT|BMP)$/.test(fileName);
      },
      isPdf(fileName) {
        return /\.(pdf|PDF)$/.test(fileName);
      },
      /**
       * @param {string} s
       * @param {string} p
       * @return {boolean}
       */
      isMatch(s, p) {
        // 构造 dp 函数
        let dp = [];
        for (let i = 0; i <= s.length; i++) {
          let child = [];
          for (let j = 0; j <= p.length; j++) {
            child.push(false);
          }
          dp.push(child);
        }
        dp[s.length][p.length] = true;
        // 执行
        for (let i = p.length - 1; i >= 0; i--) {
          if (p[i] != "*") break;
          else dp[s.length][i] = true;
        }

        for (let i = s.length - 1; i >= 0; i--) {
          for (let j = p.length - 1; j >= 0; j--) {
            if (s[i] == p[j] || p[j] == "?") {
              dp[i][j] = dp[i + 1][j + 1];
            } else if (p[j] == "*") {
              dp[i][j] = dp[i + 1][j] || dp[i][j + 1];
            } else {
              dp[i][j] = false;
            }
          }
        }
        return dp[0][0];
      },
      isAcceptFiles(fileName) {
        const acceptFiles = this.accept.split(",");
        const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        let thiz = this;
        console.log("isAcceptFiles", acceptFiles);
        return (
          acceptFiles.filter((e) => {
            let b = thiz.isMatch(ext, e);
            // console.log("isAcceptFiles", b, e);
            return b;
          }).length > 0
        );
      },
      isAcceptImageSizeFile(file) {
        let thiz = this;
        // 上传图片前处理函数
        const imgSizeAcceptPromise = new Promise(function (resolve, reject) {
          let width = thiz.imageMaxWidth;
          let height = thiz.imageMaxHeight;
          // let width = thiz.imageMaxWidth;
          // let height = thiz.imageMaxHeight;
          let image = new Image();
          image.onload = function () {
            console.log("image.onload");
            let valid = image.width <= width && image.height <= height;
            // let validl = image.width>=width2
            valid ? resolve() : reject();
          };
          image.src = URL.createObjectURL(file);
        }).catch((error) => {
          console.log(error);
          //Promise.reject(false);
        });

        // let r = false;
        // await imgSizeAcceptPromise.then(
        //   () => {
        //     console.log("imgSizeAcceptPromise.resolve");
        //     r = true;
        //   },
        //   () => {
        //     console.log("imgSizeAcceptPromise.reject");
        //     r = false;
        //   }
        // );
        return imgSizeAcceptPromise;
      },
      async checkAcceptImageSizeFile(file) {
        console.log("checkAcceptImageSizeFile.run");
        let traffic = new Signal("stop");
        let r = false;
        this.isAcceptImageSizeFile(file).then(
          () => {
            r = true;
            traffic.state = "pass";
            console.log("checkAcceptImageSizeFile", r);
          },
          () => {
            r = false;
            traffic.state = "pass";
            console.log("checkAcceptImageSizeFile", r);
          }
        );
        await traffic.until("pass");
        return r;
      },
      //判断是否所有文件上传完毕
      isAllFileUploaded: function () {
        // 检查 upload 引用是否存在
        if (!this.$refs.upload) {
          console.log("upload 组件未初始化");
          return true; // 默认为所有文件已上传（避免阻止提交）
        }
        console.log("isAllFileUploaded", this.$refs);
        
        // 检查 uploadFiles 是否存在
        if (!this.$refs.upload.uploadFiles) {
          console.log("uploadFiles 未初始化");
          console.log("upload 组件内容:", this.$refs.upload);
          return true; // 默认为所有文件已上传（避免阻止提交）
        }

        for (var i = 0; i < this.$refs.upload.uploadFiles.length; i++) {
          //console.log("isAllFileUploaded", this.$refs.upload.uploadFiles[i]);
          //console.log("isAllFileUploaded.status", this.$refs.upload.uploadFiles[i].status);
          if (this.$refs.upload.uploadFiles[i].status === "ready") {
            return false;
          }
          if (this.$refs.upload.uploadFiles[i].status === "uploading") {
            return false;
          }
          //if (this.$refs.upload.uploadFiles[i].status === 'success') {
          //
          //}
          //if (this.$refs.upload.uploadFiles[i].status === 'fail') {
          //
          //}
        }
        return true;
      },
      handleChange(file, fileList) {
        console.log("handleChange", fileList);
        if (fileList.length > 0) {
          fileList.forEach((e) => {
            if (this.newPreviewWindow) {
              if (e.fix == undefined) {
                e.fix = true;
              }
            } else {
              if (!this.isImage(e.name) && e.fix == undefined) {
                console.log("handleChange", e);
                e.url = this.defaultPic;
                e.fix = true;
              }
            }
          });
        }
        this.$emit("update:fileList", fileList);
      },
      handlePreview(file) {
        console.log("handlePreview", file);
      },
      //上传格式校验
      handlePictureCardPreview(file) {
        if (this.newPreviewWindow) {
          window.open(file.url, '_blank');
        } else {
          console.log("handlePictureCardPreview", file);
          console.log("handlePictureCardPreview", file.url);
          if (this.isImage(file.name)) {
            this.Previewlist=[];
            this.Previewlist.push(file.url);
            this.showImgViewer();
            this.dialogImageUrl = file.url;
            // this.dialogVisible = true;
            this.previewType = "IMAGE";
          } else if (this.isPdf(file.name)) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            this.previewType = "PDF";
          } else {
            this.dialogImageUrl = "";
            this.dialogVisible = false;
            this.previewType = undefined;
            this.$message.warning("暂不支持预览该格式文件！");
            return false;
          }
        }
      },
      handleRemove(file) {
        console.log("handleRemove", file);
        this.onRemove(file);
      },
      handleError(response, file) {
        console.log("handleError", response);
        console.log("file", file);
      },
      handleSuccess(response, file, fileList) {
        console.log(
          "handleSuccess",
          response,
          "file",
          file,
          "fileList",
          fileList
        );
        if (this.autoUpload) {
          if (
            response.fileMap != undefined &&
            response.fileMap[file.name] != undefined
          ) {
            file.fileId = response.fileMap[file.name];
          }
          this.onUploadSuccess(response, fileList, file);
        }
      },
      handleBeforeUpload(rawFile) {
        console.log("handleBeforeUpload.rawFile", rawFile);
        this.uploadData.subPath = this.subPath;
        const acceptFiles = this.accept;
        /*
        const imageext = rawFile.type.substring(6);
        console.log("handleBeforeUpload.rawFile.type", rawFile.type);
        console.log("handleBeforeUpload.acceptFiles", acceptFiles);
        console.log("handleBeforeUpload.rawFile.imageext", imageext);
        */

        const isAccept = this.isAcceptFiles(rawFile.name);
        const maxSize = this.maxSize;
        const minSize = this.minSize;
        const isLeMaxSize = rawFile.size / 1024 / 1024 <= maxSize;
        const isGeMaxSize = rawFile.size / 1024 / 1024 >= minSize;

        let errors = [];
        if (!isAccept) {
          errors.push(`上传文件只能是 ${acceptFiles} 格式文件!`);
        }
        if (!isLeMaxSize && maxSize > 0) {
          errors.push(`上传文件大小不能超过 ${maxSize} MB!`);
        }
        if (!isGeMaxSize && minSize > 0) {
          errors.push(`上传文件大小不能小于 ${minSize} MB!`);
        }

        let thiz = this;
        // 上传文件处理函数
        const acceptPromise = new Promise(function (resolve, reject) {
          let accept = errors.length == 0;
          if (thiz.isImage(rawFile.name) && accept) {
            let width = thiz.imageMaxWidth;
            let height = thiz.imageMaxHeight;
            let width2 = thiz.imageMinWidth;
            let height2 = thiz.imageMinHeight;
            let image = new Image();
            image.onload = function () {
              console.log("image.onload");
              let valid = width2 <= image.width && image.width<=width  && height2 <= image.height && image.height <= height;
              //let valid = image.width <=width && image.height <= height;
              if (!valid) {
                let width = thiz.imageMaxWidth;
                let height = thiz.imageMaxHeight;
                let width2 = thiz.imageMinWidth;
                let height2 = thiz.imageMinHeight;
                errors.push(`上传图片文件的需在分辨率${width2}x${height2}--${width}x${height}!`);
              }

              valid ? resolve() : reject();
            };
            image.src = URL.createObjectURL(rawFile);
          } else {
            accept ? resolve() : reject();
          }
        }).then(
          () => {
            // if (thiz.isImage(rawFile.name)) {
            //   return new Promise((resolve, reject) => {
            //     new Compressor(rawFile, {
            //       quality: 0.6,
            //       success: (result) => {
            //         console.log('compressor', result);
            //         let size = result.size;
            //         if (size > 4 * 1024 * 1024 - 256 * 1024) {
            //           this.$message.error({
            //             dangerouslyUseHTMLString: true,
            //             message: '图片不符合上传要求（图片大小过大或图片分辨率过高）',
            //           });
            //           reject();
            //         } else {
            //           resolve(result);
            //         }
            //       },
            //       error(err) {
            //         console.error('comperssorError',err.message);
            //         this.$message.error({
            //           dangerouslyUseHTMLString: true,
            //           message: '图片上传失败',
            //         });
            //         reject();
            //       },
            //     });
            //   });
            // } else {
            //   return rawFile;
            // }
            return rawFile;
          },
          () => {
            this.$message.error({
              dangerouslyUseHTMLString: true,
              message: errors.join("<br/>"),
            });
            let theUploadFile = this.$refs.upload.getFile(rawFile);
            theUploadFile.accept = false;
            console.log("handleBeforeUpload.theUploadFile", theUploadFile);
            return Promise.reject();
          }
        );

        return acceptPromise;
      },
      handleExceed(files, fileList) {
        console.log("handleExceed");
        const limit = this.limit;
        this.$message.warning(
          `当前限制选择 ${limit} 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      handleBeforeRemove(file) {
        console.log("handleBeforeRemove", file);

        if (file.accept === true) return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleHttpRequest(file) {
        console.log("handleHttpRequest", file.file);
        if (!this.autoUpload) this.formData.append("files", file.file);
      },
      submitUpload() {
        console.log("submitUpload");
        this.formData = new FormData();
        this.$refs.upload.submit(); //执行此步骤 相当于执行 http-request 的自定义实现方法
        this.formData.append("subPath", this.subPath);
        console.log(this.formData);
        console.log('subPath', this.subPath)
        let config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        axios
          .post(this.uploadUrl, this.subPath, config)
          .then((res) => {
            if (res.fileMap != undefined) {
              this.fileList.forEach((file) => {
                if (res.fileMap[file.name] != undefined)
                  file.fileId = res.fileMap[file.name];
              });
            }
            console.log(
              "submitUploadSuccess",
              "fileList",
              this.fileList,
              "res",
              res
            );
            this.onUploadSuccess(res, this.fileList);
          })
          .catch((res) => {
            console.log("submitUploadError", this.fileList, res);
            this.onUploadError(res, this.fileList);
          });
      },
    },
  };
  </script>

  <style lang="scss">
  .noneUploadBtn .el-upload--picture-card,
  .noneUploadBtn .el-upload-list__item-delete .el-icon-delete,
  .noneUploadBtn .el-upload__tip {
    display: none;
  }
  .previewDialog {
    width: 90%;
  }
  </style>
