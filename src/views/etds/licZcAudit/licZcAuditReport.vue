<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { useLicZcAuditStore } from '@/stores/licZcAuditStore'
import { useRouter } from 'vue-router'

const licZcAuditStore = useLicZcAuditStore()
const router = useRouter()
// 审阅表单 - 修改为匹配 auditInfo 结构
const auditForm = computed(() => licZcAuditStore.auditForm)

// 审阅结果选项
const resultOptions = [
  { label: '接受', value: 1 },
  { label: '不接受', value: 2 },
  { label: '不适用', value: 0 },
  { label: '联营商选择不上架', value: 3 },
  { label: '不接受并联营商选择不上架', value: 4 },
]

// 业务类型选项
const licTypeOptions = [
  { label: '联营业务', value: 1 },
  { label: '联营款', value: 2 },
]

// 中尾期选项
const periodOptions = [
  { label: '中期', value: 1 },
  { label: '尾期', value: 3 }
]

// 附件列表
const auditFileList = computed(() => licZcAuditStore.auditFileList)

// 获取审阅信息
const getAuditInfo = () => {
  try {
    // 从 Pinia 获取审阅数据
    const auditInfo = licZcAuditStore.getAuditData()
    console.log('auditInfo', auditInfo)
    if (!auditInfo) {
      ElMessage.warning('未找到审阅信息，请返回列表重新选择')
      return
    }

    // 填充表单数据
    auditForm.value.bc_pono = auditInfo.bc_pono || ''
    auditForm.value.bc_qs = auditInfo.bc_qs || ''
    auditForm.value.bc_batchNo = auditInfo.bc_batchNo || ''
    auditForm.value.bc_num = auditInfo.bc_num || ''
    auditForm.value.bc_date = auditInfo.bc_date || ''
    auditForm.value.problem = auditInfo.problem || ''
    auditForm.value.fresult = auditInfo.fresult || ''
    auditForm.value.lic_type = auditInfo.lic_type || 1
    auditForm.value.sresult = auditInfo.sresult || ''
    auditForm.value.oid = auditInfo.oid || ''
    auditForm.value.sy_state = auditInfo.sy_state || ''
    auditForm.value.ch_result = auditInfo.ch_result || ''
    auditForm.value.zc_step = auditInfo.zc_step || ''
    auditForm.value.state = auditInfo.state || ''
    auditForm.value.sy_result = auditInfo.sy_result || ''
    auditForm.value.bc_result = auditInfo.bc_result ?? ''

    // TODO: 获取附件列表
  } catch (error) {
    console.error('获取审阅信息失败:', error)
    ElMessage.error('获取审阅信息失败')
  }
}

// 下载全部附件
const handleDownloadAll = () => {
  const handleDownload = async (file) => {
    const res = await fetch(file.path)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
  }
  auditFileList.value.forEach(handleDownload)
  ElMessage.success('下载成功')
}

// 关闭
const handleClose = () => {
  licZcAuditStore.reset()
  router.back()
}
// 预览图片
const showPreView = ref(false)
const currentPreviewIndex = ref(0)
const previewList = computed(() => licZcAuditStore.previewList)

// 新增图片预览方法
function previewImage (index) {
  currentPreviewIndex.value = index
  showPreView.value = true
}

// 初始化
onMounted(() => {
  getAuditInfo()
  console.log('auditForm', auditForm.value)
  licZcAuditStore.getAuditFileList()
})
</script>
<template>
  <div class="audit-report-container">
    <!-- 审阅结果区域 -->
    <div class="audit-result-section">
      <div class="section-title">查货结果</div>
      <div class="radio-group">
        <el-radio-group v-model="auditForm.bc_result">
          <el-radio
            v-for="option in resultOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </div>
      <el-divider class="divider-style" />
    </div>

    <!-- 问题区域 -->
    <div class="audit-problem-section">
      <div class="section-title">业务类型</div>
      <div class="radio-group">
        <el-radio
          v-for="option in licTypeOptions"
          :key="option.value"
          v-model="auditForm.lic_type"
          :label="option.value"
          disabled
        >{{ option.label }}
        </el-radio>
      </div>
      <el-divider class="divider-style" />
    </div>

    <!-- 基本信息区域 -->
    <div class="audit-info-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <div class="info-label">合同</div>
            <div class="info-value">
              <el-input
                v-model="auditForm.bc_pono"
                placeholder="请选择"
                readonly
                class="bottom-border-input"
                disabled
              />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <div class="info-label">中尾期</div>
            <div class="info-value">
              <el-select
                v-model="auditForm.bc_qs"
                placeholder="请选择"
                class="bottom-border-input"
                disabled
              >
                <el-option
                  v-for="item in periodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <div class="info-label">出货批次</div>
            <div class="info-value">
              <el-input
                v-model="auditForm.bc_batchNo"
                placeholder="请选择"
                readonly
                class="bottom-border-input"
                disabled
              />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <div class="info-label">查货次数</div>
            <div class="info-value">
              <el-input
                v-model="auditForm.bc_num"
                placeholder="请选择"
                readonly
                class="bottom-border-input"
                disabled
              />
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <div class="info-label">自查日期</div>
            <div class="info-value">
              <el-date-picker
                v-model="auditForm.bc_date"
                type="date"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="bottom-border-input"
                disabled
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 详细问题区域 -->
    <div class="audit-detail-section">
      <div class="section-title">详细问题及跟进</div>
      <el-input
        v-model="auditForm.problem"
        type="textarea"
        :rows="4"
        placeholder="请输入详细问题"
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
          @click="previewImage(index)"
        >
          <el-icon><document /></el-icon>
          <span class="file-name">
            {{ file.name }}
          </span>
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
      <!-- <el-button type="primary" class="custom-button" @click="handleSave">保存</el-button> -->
      <el-button
        type="primary"
        class="custom-button"
        @click="handleDownloadAll"
      >
        下载全部附件
      </el-button>
      <el-button
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
  }

  .audit-result-section,
  .audit-problem-section,
  .audit-info-section,
  .audit-detail-section,
  .audit-attachment-section {
    background-color: #fff;
    padding: 5px 20px;
  }

  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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
    gap: 15px;

    .attachment-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      max-width: 33.33%;

      .file-name {
        margin-left: 8px;
        color: #409eff;
        cursor: pointer;
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

