<!--
  组件名称：owsUpload

  描述：
  这是一个通用的文件上传组件，支持上传图片和 Excel 文件（.jpg, .jpeg, .png, .xls, .xlsx）。
  组件支持单文件和多文件上传，并在上传后显示预览区域。

  属性：
  - modelValue (Boolean, required): 控制对话框的显示与隐藏。
  - accept (String, default: '.jpg,.jpeg,.png,.xls,.xlsx'): 允许上传的文件类型。
  - single (Boolean, default: false): 是否只允许上传一个文件。

  事件：
  - update:modelValue: 当对话框显示状态变化时触发。
  - files-selected: 当文件选择完成时触发，传递选中的文件列表。

  插槽：
  - header: 自定义对话框头部内容。
  - footer-tip: 自定义对话框底部左侧提示内容。
  - footer: 自定义对话框底部右侧按钮内容。

  使用示例：
  <template>
    <ows-upload
      v-model="uploadVisible"
      accept=".xls,.xlsx"
      :single="true"
      @files-selected="handleFilesSelected"
    >
      <template #header>
        <h3>自定义头部</h3>
      </template>
      <template #footer-tip>
        <div>注意：文件大小不得超过50MB</div>
      </template>
      <template #footer>
        <el-button type="primary" @click="confirmUpload">确认</el-button>
        <el-button @click="uploadVisible = false">取消</el-button>
      </template>
    </ows-upload>
  </template>

  <script>
  import owsUpload from '@/components/Upload/owsUpload.vue';

  export default {
    components: {
      owsUpload,
    },
    data() {
      return {
        uploadVisible: false,
      };
    },
    methods: {
      handleFilesSelected(files) {
        console.log('选中的文件：', files);
      },
      confirmUpload() {
        // 确认上传的逻辑
      },
    },
  };
  </script>
-->
<template>
  <el-dialog
    v-model="visible"
    title="导入"
  >
    <!-- 自定义头部 -->
    <slot name="header"></slot>

    <div class="upload-container">
      <div class="upload-area" @click="triggerFileUpload">
        <el-icon class="upload-icon">
          <Plus />
        </el-icon>
      </div>

      <input
        ref="fileInput"
        type="file"
        :multiple="!single"
        :accept="accept"
        style="display: none"
        @change="handleFileUpload"
      />

      <div class="preview">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="preview-item"
        >
          <img
            v-if="file.type.startsWith('image/')"
            :src="file.url"
            alt="图片预览"
          />
          <div v-else class="file-preview">
            <el-icon class="excel-icon"><Document /></el-icon>
            <p>{{ file.name }}</p>
          </div>
          <div
            class="delete-button"
            type="danger"
            size="mini"
            @click="removeFile(index)"
          >X
          </div>
        </div>
      </div>
    </div>

    <div>
      <p class="upload-tip">
        {{ uploadTip }}
      </p>
    </div>

    <!-- 默认尾部 -->
    <template v-if="!$slots.footer">
      <div class="default-footer">
        <span class="footer-tip">注意文件大小</span>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>

    <!-- 自定义尾部 -->
    <template v-else>
      <div class="default-footer">
        <div class="footer-tip">
          <slot name="footer-tip"></slot>
        </div>
        <div class="footer-buttons">
          <slot name="footer"></slot>
        </div>
      </div>
    </template>

  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Plus, Document } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.xls,.xlsx',
  },
  single: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:modelValue', 'files-selected']);

const files = ref([]);
const visible = ref(props.modelValue);

const fileInput = ref(null);

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
  }
);

watch(visible, (newVal) => {
  emits('update:modelValue', newVal);
});

// 关闭弹窗
function closeDialog () {
  visible.value = false;
}

// 根据 accept 属性生成提示信息
const uploadTip = computed(() => {
  let types = props.accept.split(',');
  types = types.map((type) => type.replace('.', '').toUpperCase());
  return `仅支持上传 ${types.join('、')} 文件，且不超过 50MB`;
});

// 从 accept 属性生成有效的文件类型列表
const validExtensions = computed(() => {
  return props.accept
    .split(',')
    .map((ext) => ext.trim().replace('.', '').toLowerCase());
});

function triggerFileUpload () {
  fileInput.value.click();
}

function handleFileUpload (event) {
  const selectedFiles = event.target.files;
  const selectedFilesArray = [];
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // 校验文件类型
    if (!validExtensions.value.includes(fileExtension)) {
      ElMessage.warning(`文件 "${file.name}" 类型不支持`);
      continue;
    }

    // 校验文件大小（50MB）
    if (file.size > 50 * 1024 * 1024) {
      ElMessage.warning(`文件 "${file.name}" 大小超过 50MB`);
      continue;
    }
    selectedFilesArray.push(file);
  }

  if (props.single) {
    files.value = selectedFilesArray.slice(0, 1); // 只保留最新上传的一个文件
  } else {
    files.value = selectedFilesArray;
  }

  emits('files-selected', files.value);
}

function removeFile (index) {
  files.value.splice(index, 1);
  emits('files-selected', files.value);
  fileInput.value.value = ''; // 重置 input 元素的值
}
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.upload-area {
  cursor: pointer;
  text-align: center;
  background: #fbfdff;
  width: 10rem;
  height: 10rem;
  margin: 10px;
  box-shadow: 0px 1px 5px 1px #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-icon {
  font-size: 3rem;
  color: #c0c4cc;
}

.preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.preview-item {
  margin: 10px;
  text-align: center;
  position: relative;
}

.preview-item img,
.file-preview {
  width: 10rem;
  height: 10rem;
  background: #fbfdff;
  box-shadow: 0px 1px 5px 1px #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-item img {
  object-fit: cover;
}

.file-preview {
  position: relative;
}

.file-preview .excel-icon {
  font-size: 3rem;
  color: #c0c4cc;
}

.file-preview p {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.7);
  color: rgb(88, 174, 255);
}

.upload-tip {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

/* 默认尾部样式 */
.default-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.footer-tip {
  color: #292929;
  font-size: 12px;
  min-height: 1px;
}

.footer-buttons {
  display: flex;
  gap: 3px; /* 按钮间距 */
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>