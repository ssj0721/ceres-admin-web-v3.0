<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { licHomePageFormConfig } from './option';
import { getGcZcHomePageData } from '@/api/etds';
import ZcDetailsForm from '@/components/etds/ZcDetailsForm.vue';

const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({});

const handleBack = () => {
  router.push('/etds/GcZcCfm');
};

const handleWriteReport = async () => {
  router.push({
    path: '/etds/GcZcReport',
    query: {
      oid: route.query.oid
    },
  });
};

// 初始化数据
async function init () {
  const { oid, pswOid } = route.query;

  const res = await getGcZcHomePageData({ oid: oid, pswOid: pswOid });
  if (res.data) {
    formData.value = res.data;
  }
}

onMounted(async () => {
  init();
});
</script>
<template>
  <div class="homepage-container">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="left">
        <!-- 左侧预留空间，保持对称 -->
      </div>
      <span class="title">工厂自查分析</span>
      <div class="right">
        <el-button type="primary" @click="handleBack">返回列表</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-body">
        <div class="order-detail">
          <div class="header">
            <ZcDetailsForm
              v-model="formData"
              :form-config="licHomePageFormConfig"
            >
              <template #reviewOrBack="{ row }">

                <!-- 返修次数 -->
                <div v-if="row.check_revision_count > 0">
                  <el-tag
                    class="status-tag"
                    type="warning"
                    size="small"
                  >
                    返修
                  </el-tag>
                </div>
                <div v-else-if="row.review_state">
                  <el-tag
                    class="status-tag"
                    type="warning"
                    size="small"
                  >
                    重审
                  </el-tag>
                </div>
              </template>
              <template #reviewOrBackState="{ row }">
                <!-- 返修次数 -->
                <div v-if="row.check_revision_count > 0">
                  {{ row.check_revision_count }}
                </div>
                <!-- 重审的状态 -->
                <el-tag
                  v-else-if="row.review_state"
                  :type="row.review_state === '1' || row.review_state === 1 ? 'warning'
                    : row.review_state === '2' || row.review_state === 2 ? 'success'
                      : row.review_state === '3' || row.review_state === 3 ? 'danger'
                        : 'info'"
                >
                  {{ row.review_state === '1' || row.review_state === 1 ? '重审待确认'
                    : row.review_state === '2' || row.review_state === 2 ? '重审接受'
                      : row.review_state === '3' || row.review_state === 3 ? '重审拒绝'
                        : '' }}
                </el-tag>
              </template>
            </ZcDetailsForm>
            <div class="row justify-content-center mt-5">
              <el-button type="primary" @click="handleWriteReport">
                写报告
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.homepage-container {
  min-height: 100vh;
  background-color: #f0f2f5;
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

    // .left {
    //   // 左侧预留空间
    // }

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

  .main-content {
    flex: 1;
    padding: 24px;
    margin: 0 auto;
    width: 100%;

    .order-detail {
      background-color: #fff;
      border-radius: 8px;

      .header {
        padding: 20px;

        .status-bar {
          margin-bottom: 20px;

          .status-tag {
            background-color: #e6f7ff;
            color: #1890ff;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
          }

          .location-info {
            color: #666;
            font-size: 14px;
          }
        }

        .divider {
          height: 1px;
          background-color: #eee;
          margin: 20px 0;
        }

        .basic-info {
          margin-bottom: 20px;

          .label {
            color: #666;
            font-size: 14px;
            margin-right: 8px;
          }

          .value {
            color: #333;
            font-size: 14px;
            font-weight: 500;
          }

          .mt-3 {
            margin-top: 16px;
          }
        }

        .button-row {
          display: flex;
          button {
            width: 100%;
          }
        }
      }
    }
  }
}

// 响应式样式
@media screen and (max-width: 768px) {
  .homepage-container {
    .main-content {
      padding: 12px;

      .order-detail {
        .header {
          padding: 16px;

          .status-bar {
            .el-col {
              margin-bottom: 8px;
            }
          }

          .basic-info {
            .el-col {
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
