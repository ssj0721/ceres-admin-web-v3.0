<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { Document, Close, Upload } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useLicZcAuditStore } from '@/stores/licZcAuditStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const router = useRouter()
const licZcAuditStore = useLicZcAuditStore()
// 审核表单
const { stepData, problemList } = storeToRefs(licZcAuditStore)
const loading = ref(false)

// 获取审核信息
async function getAuditInfo () {
  loading.value = true
  try {
    const auditInfo = licZcAuditStore.getAuditData()
    console.log('auditInfo', auditInfo)
    if (!auditInfo?.oid) {
      ElMessage.error('未获取到审阅数据')
      return
    }

    stepData.value.oid = auditInfo.oid
    stepData.value.lic_type = auditInfo.lic_type || 1
    stepData.value.result = String(auditInfo.bc_result) || '1'
    // 获取一审数据
    const success = await licZcAuditStore.getLicZcCheckReports(1)
    await licZcAuditStore.getQuestionCheckBoxs()
    if (!success) {
      ElMessage.error('获取审阅数据失败')
    }
  } catch (error) {
    console.error('获取审核信息失败:', error)
  } finally {
    loading.value = false
  }
}
// radio选中值

// 附件图片
const showPreView = ref(false)
const currentPreviewIndex = ref(0)
const previewList = computed(() => licZcAuditStore.previewList)
const auditFileList = computed(() => licZcAuditStore.auditFileList)
const newFileList = computed(() => licZcAuditStore.newFileList)
// 关闭
function handleClose () {
  licZcAuditStore.reset()
  router.back()
}

// 是否正在提交
const isSubmit = ref(false)

// 初始化
onMounted(() => {
  getAuditInfo()
})

// radio选项列表
const radioList = ref([
  { name: '1', disabled: false },
  { name: '2', disabled: false },
  { name: '0', disabled: false },
  { name: '3', disabled: false },
])

// 选项对应的文本
const radioLabelsText = {
  1: '接受',
  2: '不接受',
  0: '不适用',
  3: '联营商选择不上架',
}

// 问题列表

// radio change事件
function radioChange (e) {
  // 同时更新 stepData 中的 result
  stepData.value.result = e.toString()
}

// 预览图片

// 按钮禁用状态
const disableSub = ref(false)

// 处理上传附件
function handleArchive () {
  licZcAuditStore.handleSelectImage()
}

// 处理删除文件
function handleDeleteFile (file) {
  licZcAuditStore.addFileToDeleteList(file)
}

// 预览图片
function handlePreviewImage (index) {
  currentPreviewIndex.value = index
  showPreView.value = true
}

// 保存
async function handleSave () {
  loading.value = true

  try {
    const success = await licZcAuditStore.saveLicZcCheckReports()
    if (success) {
      await getAuditInfo() // 刷新数据
    }
  } finally {
    loading.value = false
  }
}

// 送审/通过
async function handleSubmit () {
  if (!stepData.value.result) {
    ElMessage.warning('请选择审阅结果')
    return
  }

  isSubmit.value = true
  loading.value = true

  try {
    // 设置状态为通过（1），实际的接受/不接受结果由result值决定
    stepData.value.state = '1'

    const success = await licZcAuditStore.saveLicZcCheckReports(true)
    if (success) {
      ElMessage.success(`送审成功！结果：${radioLabelsText[stepData.value.result] || '未知'}`)
    }
  } finally {
    loading.value = false
    isSubmit.value = false
  }
}

// 添加调试控制变量
const showDetailedDebug = ref(false)
</script>

<template>
  <div class="audit-report-container">
    <!-- 调试信息面板 -->
    <!-- <div v-if="true" style="background-color: #f5f5f5; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; max-height: 300px; overflow-y: auto;">
      <div style="font-weight: bold; margin-bottom: 5px;">调试信息：</div>
      <div><b>审阅状态：</b> 审阅结果: {{ radioValue }}, 送审状态: {{ stepData.state }}</div>
      <div><b>报告ID：</b> OID: {{ stepData.oid }}, 审阅记录ID: {{ stepData.lic_zcCheckReportsDtlBOid }}</div>
      <div><b>状态：</b> loading: {{ loading }}, fileLoading: {{ licZcAuditStore.fileLoading }}</div>
      <div><b>stepData：</b></div>
      <pre>{{ JSON.stringify(stepData, null, 2) }}</pre>
      <div><b>选中问题：</b> {{ stepData.selectionData }}</div>
      <div><b>文件信息：</b></div>
      <div>已有附件: {{ auditFileList.length }}, 待上传附件: {{ newFileList.length }}, 待删除附件: {{ licZcAuditStore.deleteFileList.length }}</div>
      <button style="margin-top: 5px; padding: 2px 5px; font-size: 11px;" @click="showDetailedDebug = !showDetailedDebug">
        {{ showDetailedDebug ? '隐藏详细信息' : '显示详细信息' }}
      </button>
      <div v-if="showDetailedDebug">
        <div><b>问题列表：</b></div>
        <pre>{{ JSON.stringify(problemList, null, 2) }}</pre>
        <div v-if="auditFileList.length > 0"><b>附件详情：</b></div>
        <pre v-if="auditFileList.length > 0">{{ JSON.stringify(auditFileList, null, 2) }}</pre>
        <div v-if="newFileList.length > 0"><b>待上传附件详情：</b></div>
        <pre v-if="newFileList.length > 0">{{ JSON.stringify(newFileList, null, 2) }}</pre>
      </div>
    </div> -->

    <div class="audit-result-section">
      <div class="section-title">查货结果</div>
      <div class="radio-group">
        <el-radio-group v-model="stepData.result">
          <el-radio
            v-for="item in radioList"
            :key="item.name"
            :label="item.name"
            :disabled="item.disabled"
          >
            {{ radioLabelsText[item.name] }}
          </el-radio>
        </el-radio-group>
      </div>
      <el-divider class="divider-style" />
    </div>

    <!-- 问题区域 -->
    <div class="audit-problem-section">
      <div class="section-title">问题</div>
      <div class="checkbox-group">
        <el-checkbox-group
          v-model="stepData.selectionData"
          class="problem-list"

          :max="1"
        >
          <el-checkbox
            v-for="item in problemList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <el-divider class="divider-style" />
    </div>

    <!-- 详细问题区域 -->
    <div class="audit-detail-section">
      <div class="section-title">评语</div>
      <el-input
        v-model="stepData.remark"
        type="textarea"
        :rows="6"
        placeholder="请输入评语"
      />
    </div>

    <!-- 附件区域 -->
    <div class="audit-attachment-section">
      <div class="section-title">附件</div>
      <div class="attachment-list">
        <div
          v-for="(file, index) in auditFileList"
          :key="index"
          class="attachment-item"
          @click="handlePreviewImage(index)"
        >
          <el-icon><document /></el-icon>
          <span class="file-name">
            {{ file.name }}
          </span>
          <el-button
            type="danger"
            size="small"
            circle
            class="delete-btn"
            @click.stop.prevent="handleDeleteFile(file)"
          >
            <el-icon><close /></el-icon>
          </el-button>
        </div>

        <!-- 显示待上传的文件 -->
        <div
          v-for="(file, index) in newFileList"
          :key="`new-${index}`"
          class="attachment-item new-file"
        >
          <el-icon><upload /></el-icon>
          <span class="file-name">
            {{ file.name }} (待上传)
          </span>
          <el-button
            type="danger"
            size="small"
            circle
            class="delete-btn"
            @click.stop.prevent="newFileList.splice(index, 1)"
          >
            <el-icon><close /></el-icon>
          </el-button>
        </div>
      </div>
      <!-- 单独的图片预览器 -->
      <el-image-viewer
        v-if="showPreView"
        :url-list="previewList"
        :initial-index="currentPreviewIndex"
        show-progress
        @close="showPreView = false"
      />
    </div>

    <!-- 按钮区域 -->
    <div class="audit-buttons">
      <el-button
        type="primary"
        class="custom-button"
        :loading="licZcAuditStore.fileLoading"
        @click="handleArchive"
      >
        上传附件
      </el-button>

      <el-button
        type="primary"
        class="custom-button"
        :loading="loading || isSubmit"
        @click="handleSave"
      >
        保存
      </el-button>
      <el-button
        type="success"
        class="custom-button"
        :loading="loading || isSubmit"
        @click="handleSubmit"
      >
        送审
      </el-button>

      <el-button
        :disabled="loading || licZcAuditStore.fileLoading || isSubmit"
        @click="handleClose"
      >
        关闭
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.audit-report-container {
  padding: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    padding-bottom: 7px;

  }

  .audit-result-section,
  .audit-problem-section,
  .audit-info-section,
  .audit-detail-section,
  .audit-attachment-section {
    background-color: #fff;
    padding: 15px 20px;
  }

  .radio-group {
    display: flex;

    gap: 20px;
  }

  .checkbox-group {
    display: flex;

    .problem-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
  }

  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .info-label {
      width: 80px;
      font-size: 14px;
      color: #606266;
    }

    .info-value {
      flex: 1;
    }
  }

  :deep(.bottom-border-input) {
    width: 100%;

    .el-input__wrapper,
    .el-select__wrapper {
      box-shadow: none !important;
      border-radius: 0;
      border-bottom: 1px solid #DCDFE6;
      padding: 0;

      &.is-focus {
        border-bottom-color: #409EFF;
      }
    }

    .el-input__inner {
      height: 32px;
    }

    &.el-select .el-input {
      width: 100%;

      .el-input__wrapper {
        box-shadow: none !important;
        border-radius: 0;
        border-bottom: 1px solid #DCDFE6;
        padding: 0;
      }
    }
  }

  .attachment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .attachment-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      max-width: 33.33%;
      position: relative;

      .file-name {
        margin-left: 8px;
        color: #409eff;
        cursor: pointer;
      }

      .delete-btn {
        margin-left: 8px;
        position: absolute;
        right: -19px;
        top: -5px;
        z-index: 1;
        transform: scale(0.5);
        padding: 4px;

        :deep(.el-icon) {
          font-size: 12px;
        }
      }
    }
  }

  .audit-buttons {
    display: flex;
    gap: 20px;
    margin-top: auto;
    padding-top: 10px;

  }

  .el-divider--horizontal {
    border-top: 1px solid #eee;
  }

  .divider-style {
    margin: 10px 0 0;
    background-color: #f1f1f1;
  }
}
</style>

