<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import licZcAuditReport from './licZcAuditReport.vue'
import licZcFirstAudit from './licZcFirstAudit.vue'
import licZcSecondAudit from './licZcSecondAudit.vue'
import { useRouter, useRoute } from 'vue-router'
import { useLicZcAuditStore } from '@/stores/licZcAuditStore'
import { ElMessage } from 'element-plus'

// 路由实例
const router = useRouter()
const route = useRoute()

// 确保从所有子组件正确引用 Pinia 数据
const licZcAuditStore = useLicZcAuditStore()

// tabs 配置和组件映射
const tabsConfig = [
  {
    name: '审阅自查报告',
    value: '1',
    component: licZcAuditReport,
  },
  {
    name: '一审',
    value: '2',
    component: licZcFirstAudit,
  },
  {
    name: '二审',
    value: '3',
    component: licZcSecondAudit,
  },
]

const activeTab = ref('1')

// 当前显示的组件
const currentComponent = computed(() => {
  const tab = tabsConfig.find(tab => tab.value === activeTab.value)
  return tab?.component
})

// 处理 tab 切换
const handleTabChange = (tabName) => {
  activeTab.value = tabName

  // 确保当前表单数据已同步到 store
  if (activeTab.value === '1') {
    // 如果切换回第一个 tab，确保数据已同步
    console.log('切换到审阅自查报告 tab')
  }
}

// 检查是否有审阅数据
onMounted(() => {
  const auditData = licZcAuditStore.getAuditData()
  if (!auditData) {
    ElMessage.warning('未找到审阅信息，请返回列表重新选择')
    // 可选：导航回列表页
    // router.push('/etds/licZcChahuo')
  } else {
    console.log('审阅数据:', auditData)
  }
})

// 返回
function handleBack () {
  licZcAuditStore.reset()
  router.back()
}

</script>

<template>
  <div class="audit-container">
    <div class="nav-header">
      <div class="left">
        <!-- 左侧预留空间，保持对称 -->
      </div>
      <span class="title">联营商自查审阅</span>

      <!-- 右侧预留空间 -->
      <div class="right">
        <el-button type="primary" @click="handleBack">返回</el-button>
      </div>

    </div>
    <!-- Tabs 区域 -->
    <div class="tabs-wrapper">
      <el-tabs
        v-model="activeTab"
        class="audit-tabs"
        @tab-change="handleTabChange"
      >
        <el-tab-pane
          v-for="tab in tabsConfig"
          :key="tab.value"
          :label="tab.name"
          :name="tab.value"
        />
      </el-tabs>
    </div>
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.audit-container {
  height: 100%;
  background-color: #F5F7FA;
  display: flex;
  flex-direction: column;

  .nav-header {
    height: 50px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 20px;

    .left {
      // 左侧预留空间
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      color: $primary-text-color;
      text-align: center;
    }

    .right {
      display: flex;
      justify-content: flex-end;
    }
  }

  .tabs-wrapper {

    background-color: #ffffff;
    width: 97%;
    margin: 0 auto;
    margin-top: 10px;
    box-shadow: $shadow-2;

    .audit-tabs {
      height: 100%;

      :deep(.el-tabs__header) {
        margin: 0;

        .el-tabs__nav-wrap {
          &::after {
            display: none;
          }
        }

        .el-tabs__nav {
          width: 30%;
          display: flex;
          border: none;

          .el-tabs__item {
            flex: 1;
            height: 50px;
            line-height: 50px;
            padding: 0;
            text-align: center;
            color: #131313;
            font-size: 14px;
            border: none;

            &.is-active {
              color: $menuActiveText;
              font-weight: bold;
            }

            &:hover {
              color: #222222;
            }
          }
        }
      }

      :deep(.el-tabs__content) {
        display: none;
      }
      :deep(.el-tabs__active-bar) {
        background-color: $menuActiveText;
        width: 30%;
      }
    }
  }

  .content-wrapper {
    flex: 1;
    padding: 16px 24px;
    margin: 0 auto;
    width: 100%;
    overflow: auto;
  }
}

// 响应式样式

</style>

