<template>
  <div class="homepage-container">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="left">
        <!-- 左侧预留空间，保持对称 -->
      </div>
      <span class="title">自查分析</span>
      <div class="right">
        <el-button type="primary" @click="handleBack">返回列表</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-body">
        <div class="order-detail">
          <div class="header">
            <!-- 订单状态栏 -->
            <div class="status-bar">
              <el-row :gutter="20">
                <el-col :xs="24" :md="6">
                  <span class="status-tag">{{ orderInfo.sconfirm }}</span>
                </el-col>
                <el-col :xs="24" :md="6">
                  <span class="location-info">出货批次: {{ orderInfo.bcBatchNo }}</span>
                </el-col>
                <el-col :xs="24" :md="6">
                  <span class="location-info">中尾期: {{ orderInfo.bcQsname }}</span>
                </el-col>
                <el-col :xs="24" :md="6">
                  <span class="location-info">计划时间: {{ orderInfo.planDate }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="divider"></div>
            <!-- 订单基础信息 -->
            <div class="basic-info">
              <el-row :gutter="20">
                <el-col :xs="24" :md="8">
                  <span class="label">款号：</span>
                  <span class="value">{{ orderInfo.pono }}</span>
                </el-col>
                <el-col :xs="24" :md="8">
                  <span class="label">授权商：</span>
                  <span class="value">{{ orderInfo.factCode }}</span>
                </el-col>
                <el-col :xs="24" :md="8">
                  <span class="label">联营业务/联营款：</span>
                  <span class="value">{{ orderInfo.lic_typename }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="mt-3">
                <el-col :xs="24" :md="8">
                  <span class="label">申请数量：</span>
                  <span class="value">{{ orderInfo.bc_checkqty }}</span>
                </el-col>
                <el-col :xs="24" :md="8">
                  <span class="label">款数量：</span>
                  <span class="value">{{ orderInfo.po_shipqty }}</span>
                </el-col>
                <el-col :xs="24" :md="8">
                  <span class="label">查货合同日期：</span>
                  <span class="value">{{ orderInfo.po_shipdate }}</span>
                </el-col>
              </el-row>
            </div>
            <!-- 使用 ZcDetailForm 组件 -->

            <ZcDetailForm
              v-model="formData"
              :form-config="licHomePageFormConfig"
            />
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

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ZcDetailForm from '@/components/etds/ZcDetailsForm.vue';
import { licHomePageFormConfig } from './option';
import { getLicZcContractInfo, getLicZcStaffContract } from '@/api/etds';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({
  pono: '',
  factName: '',
  pduName: '',
  custCode: '',
  styleNo: '',
  styleDesc: '',
  checkStandard: '',
  factCode: '',
  zoneName: '',
  isJwi: '',
  reportType: '',
  typeInt: 0,
  styleType: '',
  po_shipqty: 0,
  check_typenam: '',
});

// 合同状态
const orderInfo = ref({
  bcBatchNo: '', // 出货批次
  bcNum: '', // 查货数量
  sconfirm: '', // 送审状态
  pono: '', // 款号
  factCode: '', // 授权商
  lic_typename: '', // 联营业务/联营款
  bcQsname: '', // 中尾期
  planDate: '', // 计划时间
  po_shipdate: '', // 款号日期
  po_shipqty: '', // 款号数量
  bc_checkqty: '', // 申请数量
});

const handleBack = () => {
  router.push('/etds/licZcChahuo');
};

const handleWriteReport = () => {
  router.push({
    path: '/etds/licZcReport',
    query: {
      id: route.query.id,
      pono: orderInfo.value.pono,
      lic_type: orderInfo.value.lic_typename === '联营业务' ? 0 : 1,
    },
  });
};

// 初始化拿第一个table的数据
async function initOrderData (oid) {
  try {
    const res = await getLicZcStaffContract({ oid });
    if (res.data?.result?.Examples?.length > 0) {
      orderInfo.value = res.data.result.Examples[0];
    } else {
      ElMessage.warning('未获取到订单数据');
    }
  } catch (error) {
    console.error('获取订单数据失败:', error);
  }
}

// 初始化拿表单的数据
async function initContractInfo (requestData) {
  try {
    const res = await getLicZcContractInfo(requestData);
    if (res.data?.result?.Example) {
      formData.value = res.data.result.Example;
      formData.value.check_typenam = orderInfo.value.check_typenam;
    } else {
      ElMessage.warning('未获取到款号信息');
    }
  } catch (error) {
    console.error('获取款号信息失败:', error);
  }
}

// 初始化数据
async function init () {
  const { id, bc_pono, lic_type, isGcReport } = route.query;
  console.log('isGcReport', isGcReport);
  const requestData = {
    pono: bc_pono,
    lic_type,
  };
  const oid = id || '00000000-0000-0000-0000-000000000000';

  await initOrderData(oid);
  await initContractInfo(requestData);

  // 存储当前订单信息到localStorage
  const currentPonoInfo = {
    bc_pono: orderInfo.value.pono,
    lic_type: orderInfo.value.lic_type,
    sconfirm: orderInfo.value.sconfirm,
    bc_date: orderInfo.value.planDate, // 查货日期
    bc_qs: orderInfo.value.bcQsname, // 中尾期
    bc_num: orderInfo.value.bcNum, // 查货数量
    batchNo: orderInfo.value.bcBatchNo, // 出货批次
    bc_result: orderInfo.value.bc_result, // 查货结果
    oid,
    isGcReport: JSON.parse(isGcReport),
  };
  console.log('currentPonoInfo', currentPonoInfo);
  localStorage.setItem('currentPonoInfo', JSON.stringify(currentPonoInfo));
}

onMounted(() => {
  init();
});
</script>

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