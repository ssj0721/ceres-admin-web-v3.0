<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLicZcStore } from '@/stores/licZcStore'

import licZcCheck from './licZcCheck.vue'
import licZcDetails from './licZcDetails.vue'
import licZcProblem from './licZcProblem.vue'
import licZcUpload from './licZcUpload.vue'
import licZcSave from './licZcSave.vue'

const route = useRoute()
const router = useRouter()
const licZcStore = useLicZcStore()

// tabs 配置和组件映射
const tabsConfig = [
  {
    name: '查货信息_自查',
    value: '1',
    component: licZcCheck,
  },
  {
    name: '详细资料_自查',
    value: '2',
    component: licZcDetails,
  },
  {
    name: '问题跟进_自查',
    value: '3',
    component: licZcProblem,
  },
  {
    name: '图片上传_自查',
    value: '4',
    component: licZcUpload,
  },
  {
    name: '保存页_自查',
    value: '5',
    component: licZcSave,
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
}

// 返回
function handleBack () {
  router.back()
}

onMounted(async () => {
  // 初始化数据
  const mode = route.query.mode
  if (mode === 'add') {
    // 新增模式，初始化空数据
    await licZcStore.initEmptyState()
  }
})
</script>

<template>
  <div class="report-container">
    <div class="nav-header">
      <div class="left">
        <!-- 左侧预留空间，保持对称 -->
      </div>
      <span class="title">自查报告写报告</span>
      <div class="right">
        <el-button type="primary" @click="handleBack">返回</el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>

    <!-- Tabs 区域 -->
    <div class="tabs-wrapper">
      <el-tabs
        v-model="activeTab"
        class="report-tabs"
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
  </div>
</template>

<style lang="scss" scoped>
.report-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #F5F7FA;
  position: relative; // 添加相对定位

  .content-wrapper {
    flex: 1;
    overflow: auto;

  }

  .tabs-wrapper {
    height: 50px;
    background-color: #7996F8;

    .report-tabs {
      height: 100%;

      :deep(.el-tabs__header) {
        margin: 0;

        .el-tabs__nav-wrap {
          &::after {
            display: none;
          }
        }

        .el-tabs__nav {
          width: 100%;
          display: flex;
          border: none;

          .el-tabs__item {
            flex: 1;
            height: 50px;
            line-height: 50px;
            padding: 0;
            text-align: center;
            color: #F5F7FA;
            font-size: 14px;
            border: none;

            &.is-active {
              color: #F5F7FA;
              font-weight: bold;
            }

            &:hover {
              color: #F5F7FA;
            }
          }
        }
      }

      :deep(.el-tabs__content) {
        display: none;
      }
      :deep(.el-tabs__active-bar) {
        background-color:rgb(255, 255, 255);
      }
    }
  }

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
}
</style>

