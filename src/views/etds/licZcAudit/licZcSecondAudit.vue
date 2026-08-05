<script setup>
import { ref, onMounted } from 'vue'
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

    // 获取二审数据
    const success = await licZcAuditStore.getLicZcCheckReports(2)
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

    // 传入step=2表示这是二审
    const success = await licZcAuditStore.saveLicZcCheckReports(true, 2)
    if (success) {
      ElMessage.success(`送审成功！结果：${radioLabelsText[stepData.value.result] || '未知'}`)
    }
  } finally {
    loading.value = false
    isSubmit.value = false
  }
}
</script>

<template>
  <div class="audit-report-container">
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

    <!-- 按钮区域 -->
    <div class="audit-buttons">
      <el-button
        type="primary"
        class="custom-button"
        :loading="loading || isSubmit"
        @click="handleSubmit"
      >
        审阅
      </el-button>

      <el-button
        :disabled="loading || isSubmit"
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
  .audit-detail-section {
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

