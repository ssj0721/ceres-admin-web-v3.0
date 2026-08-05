<script setup>
import { ref, watch } from 'vue'
import { getReport1, exportExcel1, exportPdf1 } from '@/api/etds'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  previewData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 存储报告数据
const reportData = ref({})

// 格式化问题列表
const formatQuestions = (questions) => {
  if (!questions || !Array.isArray(questions)) {
    return '-'
  }
  console.log('questions', questions.length)
  if (questions.length === 0) {
    return '-'
  }
  return questions
    .map(item => item?.bq_question)
    .filter(Boolean) // 过滤掉可能的空值
    .join(' ') // 用空格连接
}

// 格式化图片列表
const formatPics = (pics) => {
  if (!pics || pics.length === 0) {
    return []
  }
  return pics.map((item) => {
    // 使用正则表达式提取src属性的值
    const match = item.pic64.match(/src="([^"]+)"/)
    return match ? match[1] : null
  }).filter(Boolean)
}

// 提取图片URL的方法
const getImageUrl = (imgString) => {
  if (!imgString) { return '' }

  try {
    const srcMatch = imgString.match(/src="([^"]+)"/)
    return srcMatch ? srcMatch[1] : ''
  } catch (error) {
    console.error('Error extracting image URL:', error)
    return ''
  }
}

const exportToExcel = async () => {
  try {
    const res = await exportExcel1({ data: reportData.value })

    // 直接使用返回的 blob 数据
    if (res.type === 'application/json') {
      // 如果返回的是 JSON 错误信息
      const reader = new FileReader()
      reader.onload = e => {
        const error = JSON.parse(e.target.result)
        ElMessage.error(error.message || '导出失败')
      }
      reader.readAsText(res)
      return
    }

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(res)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = `自查报告_${new Date().getTime()}.xlsx`

    document.body.appendChild(link)
    link.click()

    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败：' + (error.message || '未知错误'))
  }
}

const exportToPDF = async () => {
  try {
    console.log('reportData.value', reportData.value)
    const res = await exportPdf1({ data: reportData.value })

    // 检查是否是错误响应
    if (res.type === 'application/json') {
      // 如果返回的是 JSON 错误信息
      const reader = new FileReader()
      reader.onload = e => {
        const error = JSON.parse(e.target.result)
        ElMessage.error(error.message || '导出失败')
      }
      reader.readAsText(res)
      return
    }

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(res)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = `自查报告_${new Date().getTime()}.pdf`

    document.body.appendChild(link)
    link.click()

    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败：' + (error.message || '未知错误'))
  }
}

// 获取报告数据
const fetchReportData = async () => {
  try {
    const res = await getReport1(props.previewData)
    reportData.value = res.data
    console.log('报告数据:', reportData.value)
  } catch (error) {
    console.error('获取报告数据失败:', error)
  }
}

// 监听弹窗打开
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fetchReportData()
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    fullscreen
    @close="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <span>自查报告</span>
      </div>
    </template>

    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="table-code-row">
          <span class="code-left">
            {{ reportData.ds_main?.[0]?.bc_pono }}
          </span>
          <span class="code-right">
            {{ reportData.ds_lang?.[0]?.F1 }}
          </span>
        </div>
        <div class="company-name">
          {{ reportData.ds_lang?.[0]?.C2 }}
        </div>
        <div class="report-title-row">
          <span class="title-left"></span>
          <span class="title-center">
            {{ reportData.ds_lang?.[0]?.D4 }}
          </span>
          <span class="title-right">
            {{ reportData.ds_lang?.[0]?.J4 }}
          </span>
        </div>
      </div>

      <!-- 表单部分 -->
      <div class="check-report-form">
        <div class="form-row">
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.B50 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.check_typenam || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A6 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.CUST_CODE2 || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F6 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_pono || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A7 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.FACT_NAME || '-' }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.B49 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.supplier || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A8 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.STYLE_NO || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F8 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.ZONE_NAME2 || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A9 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.STYLE_DESC || '-' }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A10 }}</span>
            <span class="value">{{ reportData.ds_dates?.[0]?.po_qty || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F10 }}</span>
            <span class="value">{{ reportData.ds_dates?.[0]?.PO_SHIPDATE || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A11 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_date || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F11 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_num || '-' }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A12 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_totalNum || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F12 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_checkNum || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A13 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.bc_color || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F13 }}</span>
            <span class="value">{{ reportData.ds_main?.[0]?.numend || '-' }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.A14 }}</span>
            <span class="value">{{ reportData.ds_po?.[0]?.STYLE_DESC || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="label">{{ reportData.ds_lang?.[0]?.F14 }}</span>
            <span class="value">外观品质</span>
          </div>
        </div>
      </div>

      <!-- 错误点数显示 -->
      <div class="error-row">
        <span class="label">{{ reportData.ds_lang?.[0]?.A23 }}</span>
        <span class="label">{{ reportData.ds_lang?.[0]?.D23 }}</span>
        <span class="label">
          {{
            reportData.ds_errorpoint?.length > 0
              ? reportData.ds_errorpoint.reduce((sum, item) => sum + (Number(item.bs_value) || 0), 0)
              : '0'
          }}
        </span>
      </div>

      <!-- 表格部分 -->
      <div class="report-table">
        <el-table :data="reportData.ds_errorpoint || []" border style="width: 100%">
          <el-table-column
            :label="reportData.ds_lang?.[0]?.A24"
            prop="parent_name"
            align="center"
          >
            <template #default="{ row }">
              {{ row?.parent_name || '-' }}
            </template>
          </el-table-column>

          <el-table-column
            :label="reportData.ds_lang?.[0]?.B24"
            prop="child_name"
            align="center"
          >
            <template #default="{ row }">
              {{ row?.child_name || '-' }}
            </template>
          </el-table-column>

          <el-table-column
            :label="reportData.ds_lang?.[0]?.C24"
            prop="check_value"
            align="center"
            width="80"
          >
            <template #default="{ row }">
              {{ row?.check_value || '-' }}
            </template>
          </el-table-column>

          <el-table-column
            :label="reportData.ds_lang?.[0]?.D24"
            prop="bs_desc"
            align="center"
          >
            <template #default="{ row }">
              {{ row?.bs_desc || '-' }}
            </template>
          </el-table-column>

          <el-table-column
            :label="reportData.ds_lang?.[0]?.F24"
            align="center"
          >
            <template #default="{ row }">
              <div class="image-cell">
                <!-- 第一张图片 -->
                <div class="image-container">
                  <template v-if="getImageUrl(row?.bs_pic)">
                    <el-image
                      :src="getImageUrl(row?.bs_pic)"
                      class="preview-image"
                      fit="contain"
                      :preview-src-list="[getImageUrl(row?.bs_pic)]"
                      :initial-index="0"
                      preview-teleported
                    />
                  </template>
                  <span v-else>-</span>
                </div>

                <div class="divider"></div>

                <!-- 第二张图片 -->
                <div class="image-container">
                  <template v-if="getImageUrl(row?.bs_pic2)">
                    <el-image
                      :src="getImageUrl(row?.bs_pic2)"
                      class="preview-image"
                      fit="contain"
                      :preview-src-list="[getImageUrl(row?.bs_pic2)]"
                      :initial-index="0"
                      preview-teleported
                    />
                  </template>
                  <span v-else>-</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="error-row">
        <span class="label">{{ reportData.ds_lang?.[0]?.A27 }}</span>
      </div>

      <div class="report-table">
        <div class="table-header">
          <span class="header-item">{{ reportData.ds_lang?.[0]?.A28 }}</span>
        </div>
        <div class="table2-row">
          <div class="table2-content">
            <span class="content-item">{{ formatQuestions(reportData.ds_question) }}</span>
            <div class="horizontal-divider"></div>
            <span class="content-item">{{ reportData.ds_lang?.[0]?.A34 }}</span>
            <div class="images-container">
              <template v-if="reportData.ds_pics && reportData.ds_pics.length > 0">
                <el-image
                  v-for="(url, index) in formatPics(reportData.ds_pics)"
                  :key="index"
                  :src="url"
                  class="report-image"
                  fit="contain"
                  :preview-src-list="formatPics(reportData.ds_pics)"
                />
              </template>
              <span v-else>-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 签收单表格 -->
      <div class="report-table">
        <div class="table3-row">
          <span class="content2-item">簽收單</span>
        </div>
      </div>

      <!-- 审核结果部分 -->
      <div class="form2-row">
        <span class="label2">二審結果：</span>
        <span class="label2">{{ reportData.ds_lang?.[0]?.B47 || '-' }}</span>
      </div>
      <div v-if="reportData.ds_lang?.[0]?.B51" class="form2-row">
        <span class="label2">联营处理：</span>
        <span class="label2">{{ reportData.ds_lang?.[0]?.B51 || '-' }}</span>
      </div>

      <!-- 签名部分 -->
      <div class="form4-row">
        <span class="label3">查貨員簽署</span>
        <div class="signature-content">
          <span class="signature-name">{{ reportData.ds_main?.[0]?.inspectionName || '' }}</span>
          <span class="signature-date">{{ reportData.ds_main?.[0]?.bc_date || '' }}</span>
        </div>
        <span class="label3">力佳复核</span>
        <div class="signature-content">
          <span class="signature-name">{{ reportData.ds_main?.[0]?.firstName || '' }}</span>
          <span class="signature-date">{{ reportData.ds_main?.[0]?.firstDate || '' }}</span>
        </div>
        <span class="label3">主管審閱</span>
        <div class="signature-content">
          <span class="signature-name">{{ reportData.ds_main?.[0]?.secondName || ' ' }}</span>
          <span class="signature-date">{{ reportData.ds_main?.[0]?.secondDate || ' ' }}</span>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="button-group">
        <el-button type="primary" @click="exportToPDF">导出PDF</el-button>
        <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
  min-height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dialog-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color:#fff
}

.page-header {
  margin-bottom: 40px;
  padding: 20px;
  width: 100%;

  .table-code-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .code-left, .code-right {
      font-size: 14px;
      color: #666;
    }
  }

  .company-name {
    display: block;
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
  }

  .report-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-left {
      flex: 1;
    }

    .title-center {
      flex: 1;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    .title-right {
      flex: 1;
      text-align: right;
      font-size: 20px;
      font-weight: bold;
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .page-header {
    padding: 10px;

    .company-name {
      font-size: 20px;
    }

    .report-title-row {
      .title-center, .title-right {
        font-size: 16px;
      }
    }
  }
}

.check-report-form {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.form-item {
  width: 23%;
  min-width: 200px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;

  .label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
  }

  .value {
    display: block;
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
}

.error-row {
  display: flex;
  margin-bottom: 1px;
  flex-wrap: wrap;

  > *:nth-child(2) {
    margin-left: 200px;
  }

  > *:nth-child(3) {
    margin-left: 30px;
  }
}

@media screen and (max-width: 768px) {
  .check-report-form {
    width: 100%;
    padding: 15px;
  }

  .form-item {
    width: 48%;
  }

  .error-row {
    flex-direction: column;
    gap: 10px;

    > * {
      margin-left: 0 !important;
    }
  }
}

.report-table {
  margin-top: 10px;
  border: 1px solid #EBEEF5;

  :deep(.el-table) {
    .el-table__header-wrapper {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: bold;
      }
    }
  }
}

.image-cell {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  gap: 10px;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.preview-image {
  max-width: 140px;
  max-height: 140px;
  object-fit: contain;
}

.divider {
  width: 1px;
  height: 100%;
  background-color: #EBEEF5;
}

.button-group {
  margin-top: 20px;
  text-align: center;

  .el-button {
    margin: 0 10px;
  }
}

.table2-row {
  overflow: visible;
  margin-top: 20px;
  width: 100%;
}

.table2-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: visible;
}

.images-container {
  display: flex;
  flex-wrap: wrap; // 允许图片换行
  gap: 20px; // 图片之间的间距
  padding: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.report-image {
  width: 200px; // 减小宽度
  height: 200px; // 减小高度
  object-fit: contain;
  border: 1px solid #eee;
  background-color: #f5f5f5;
  margin: 10px;
}

.label2 {
  font-weight: bold;
  display: inline-block;
}

.table3-row {
  position: relative;
  min-height: 150px;

  .content2-item {
    position: absolute;
    top: 2px;
    left: 2px;
    padding: 10px;
    font-size: 14px;
    color: #606266;
  }
}

.form4-row {
  display: flex;
  margin-top: 30px;

  .label3 {
    font-weight: bold;
    margin-right: 40px;
    margin-left: 60px;
    font-size: 14px;

    &:first-child {
      margin-left: 0;
    }
  }

  .signature-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
    border-bottom: 2px solid #dcdfe6;
    padding-bottom: 20px;
    margin-right: 60px;

    .signature-name {
      font-size: 14px;
    }

    .signature-date {
      font-size: 14px;
    }
  }
}

.horizontal-divider {
  height: 1px;
  background-color: #dcdfe6;
  margin: 20px 0;
  width: 100%;
}

.content-item {
  padding: 20px;
  font-size: 14px;
  color: #606266;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .form4-row {
    flex-direction: column;
    gap: 30px;

    .label3 {
      margin: 0;
      margin-bottom: 10px;
    }

    .signature-content {
      margin-right: 0;
      margin-bottom: 20px;
    }
  }

  .report-image {
    width: 95%;
    min-height: 300px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .form4-row {
    flex-wrap: wrap;
    gap: 20px;

    .signature-content {
      min-width: 150px;
    }
  }
}

@media screen and (min-width: 1025px) {
  .page-container {
    padding: 40px;
  }

  .check-report-form {
    max-width: 1400px;
  }
}

@media print {
  .page-container {
    padding: 0;
  }

  .button-group {
    display: none;
  }
}

// 优化预览样式
:deep(.el-image-viewer__wrapper) {
  .el-image-viewer__mask {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .el-image-viewer__img {
    background: none;
    border: none;
    max-width: 90%;
    max-height: 90%;
  }

  .el-image-viewer__close {
    color: #fff;
  }

  .el-image-viewer__actions {
    display: none;
  }
}
</style>