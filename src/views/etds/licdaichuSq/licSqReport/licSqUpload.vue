<template>
    <div class="container">
      <div class="content-area">
        <!-- 操作按钮区 -->
        <div class="action-buttons">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="12">
              <el-button
                class="custom-button choose-image-btn"
                type="primary"
                :disabled="isDisabled"
                @click="handleSelectImage"
              >
                <div class="choose-image-content">
                  <el-icon class="plus-icon"><Plus /></el-icon>
                  <span class="choose-image-text">选择图片</span>
                </div>
              </el-button>
            </el-col>
          </el-row>
        </div>
  
        <!-- 图片预览区 -->
        <div v-if="uploadForm.imageList.length > 0" class="preview-area">
          <div class="preview-title">已选择的图片：</div>
          <div class="image-list">
            <div
              v-for="(item, index) in uploadForm.imageList"
              :key="index"
              class="image-item"
            >
              <el-image
                :src="item.preview"
                fit="contain"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                close-on-press-escape
                :preview-teleported="true"
                :preview-src-list="previewList"
              />
              <div class="image-info">
                <div class="image-name">{{ item.name }}</div>
                <div class="image-size">{{ formatFileSize(item.bp_fileSize) }}</div>
              </div>
              <div
                v-if="!isDisabled"
                class="delete-btn"
                @click="handleDeleteImage(index)"
              >
                <el-icon :size="20" color="#ff4d4f"><Delete /></el-icon>
              </div>
              <div class="preview-mask">
                <el-icon :size="30" color="#fff"><ZoomIn /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>

import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue'
import { computed, onActivated } from 'vue'
import { useLicZcStore } from '@/stores/licZcStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const licZcStore = useLicZcStore()

// 判断是否是新增模式
const isAdd = computed(() => route.query.mode === 'add')

// 判断是否已送审
const isSubmitted = computed(() => licZcStore.checkFormData?.sconfirm === '已送审')

// 控制整体禁用状态
const isDisabled = computed(() => {
  // 新增模式下不禁用
  if (isAdd.value) {
    return false
  }
  // 如果是工厂报告或已送审,则禁用
  return licZcStore.disabledGcReport || isSubmitted.value
})

// 表单数据
const uploadForm = computed({
  get: () => licZcStore.uploadFormData,
  set: val => licZcStore.updateUploadForm(val),
})
// 格式化文件大小
function formatFileSize (size) {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)} ${units[index]}`
}
// 获取文件base64编码
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// 处理普通图片
async function handleNormalImage (imageData) {
  // 获取base64数据
  const baseData = await getBase64(imageData.file)

  // 添加到普通图片列表
  uploadForm.value.imageList.push({
    ...imageData,
    describe: '',
    baseData,
    staus: false,
    OID: uploadForm.value.imageList.length + 1,
    displand: true,
  })
}
// 获取预览列表
const previewList = computed(() => {
  return uploadForm.value.imageList.map(item => item.preview)
})
// 选择图片
function handleSelectImage () {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = 'image/*'

  input.onchange = (e) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // 创建预览URL
      const preview = URL.createObjectURL(file)

      // 添加到图片列表
      uploadForm.value.imageList.push({
        preview,
        name: file.name,
        bp_fileSize: file.size,
        file,
        describe: '',
        status: false,
        OID: uploadForm.value.imageList.length + 1,
        displand: true
      })
    })
  }

  input.click()
}
// 删除图片
function handleDeleteImage (index) {
  // 释放预览URL
  URL.revokeObjectURL(uploadForm.value.imageList[index].preview)
  // 从列表中移除
  uploadForm.value.imageList.splice(index, 1)
}

// 每次进入页面时重置滚动条位置
onActivated(() => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  })
})
</script>

<style lang="scss" scoped>
.container {
  padding: $container-base-padding-2;
}

.content-area {
  background-color: $neutral-color-1;
  border-radius: $border-radius-medium;
  padding: $container-base-padding-3;
  box-shadow: $shadow-1;
}

.action-buttons {
  margin-bottom: $container-base-padding-3;

  .choose-image-btn {
    width: 100%;
  }

  .choose-image-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .plus-icon {
      margin-right: $container-base-padding-4;
    }

    .choose-image-text {
      font-size: $font-size-base;
    }
  }
}

.preview-area {
  .preview-title {
    font-size: $font-size-base;
    color: $secondary-text-color;
    margin-bottom: $container-base-padding-2;
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: $container-base-padding-2;

    .image-item {
      position: relative;
      background: $neutral-color-2;
      border-radius: $border-radius-mini;
      padding: $container-base-padding-3;
      width: calc((100% - 4 * #{$container-base-padding-2}) / 5); // 5列布局，减去4个间隔的宽度
      &:hover .preview-mask {
          opacity: 1;
        }
      &:nth-child(5n) {
        margin-right: 0;
      }

      :deep(.el-image) {
        width: 100%;
        height: 200px;
        object-fit: contain;
      }

      .image-info {
        width: 100%;
        margin-top: $container-base-padding-4;
        text-align: center;

        .image-name {
          font-size: $font-size-small;
          color: $secondary-text-color;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .image-size {
          font-size: $font-size-mini;
          color: $placeholder-text-color;
        }
      }

      .delete-btn {
        position: absolute;
        top: $container-base-padding-4;
        right: $container-base-padding-4;
        z-index: 2;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.8);

        &:hover {
          background: rgba(255, 255, 255, 0.9);
        }
      }

      .preview-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        cursor: pointer;
        pointer-events: none;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>