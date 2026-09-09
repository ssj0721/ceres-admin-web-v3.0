<template>
  <div class="trademark-home">
    <!-- 商标专项预警 -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-dot title-dot--warn"></span>
          商标专项预警
        </h3>
      </div>

      <div class="problem-actions">
        <div
          v-for="item in warnLists"
          :key="item.id"
          class="action-card"
          :class="{ 'action-card--active': selectType === item.id }"
          @click="selectType = item.id"
        >
          <div class="todo-card-header">
            <span class="todo-card-icon" :style="{ color: item.color }">
              <el-icon :size="18"><component :is="item.icon" /></el-icon>
            </span>
            <span class="todo-card-type">{{ item.label }}</span>
          </div>
          <div class="action-card-body">
            <span class="action-card-count" :style="{ color: item.color }">{{ item.count }}</span>
            <span class="action-card-unit">条数据</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="display-type">{{ warnLists[selectType].label }}商标明细</h3>
        <el-table v-loading="loading" border :data="brandList" style="width: 100%">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商标图样" align="center" min-width="200">
            <template #default="scope">
              <img
                v-if="scope.row.brandPicUrl"
                :src="scope.row.brandPicUrl"
                class="brand-pic"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="brandNo" label="商标注册号" align="center" min-width="140" />
          <el-table-column prop="applyNo" label="商标申请号" align="center" min-width="140" />
          <el-table-column label="首次申请日期" align="center" min-width="120">
            <template #default="scope">
              {{ formatDate(scope.row.firssecApplyDate) }}
            </template>
          </el-table-column>
          <el-table-column label="有效期开始" align="center" min-width="120">
            <template #default="scope">
              {{ formatDate(scope.row.validityStarsecDate) }}
            </template>
          </el-table-column>
          <el-table-column label="有效期结束" align="center" min-width="120">
            <template #default="scope">
              {{ formatDate(scope.row.validityEndDate) }}
            </template>
          </el-table-column>
          <el-table-column label="是否有效" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isValid === 1 ? 'success' : 'danger'" size="small">
                {{ scope.row.isValid === 1 ? '有效' : '无效' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="140" fixed="right">
            <template #default>
              <div
                :style="{ color: warnLists[selectType].color, backgroundColor: warnLists[selectType].bgcolor }"
                class="status-tag"
              >{{ warnLists[selectType].label }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Timer, Document, WarningFilled, Calendar } from '@element-plus/icons-vue'
import { brBrandGetList } from '@/api/trademark/br/brBrand'

const warnLists = [
  { id: 0, label: '即将到期', icon: Timer, count: 4, color: '#f59e0b', bgcolor: '#fff7ed' },
  { id: 1, label: '续展中', icon: Document, count: 12, color: '#3b82f6', bgcolor: '#eff6ff' },
  { id: 2, label: '权利丧失', icon: WarningFilled, count: 2, color: '#ef4444', bgcolor: '#fef2f2' },
  { id: 3, label: '注册满三年', icon: Calendar, count: 0, color: '#10b981', bgcolor: '#ecfdf5' },
]

const selectType = ref(0)
const loading = ref(false)
const brandList = ref([])

function formatDate(val) {
  if (!val) return '-'
  if (typeof val === 'string') {
    return val.replace('T', ' ').substring(0, 10)
  }
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 10)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

const getList = async () => {
  loading.value = true
  try {
    const res = await brBrandGetList({ page: 1, pageSize: 20 })
    brandList.value = res.data.list || []
  } catch (e) {
    brandList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.trademark-home {
  min-height: calc(100vh - 84px);
  padding: 20px 24px;
  background: #f0f2f5;
}

.section-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #ebeef5;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2d3d;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .title-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: #409eff;
    display: inline-block;
  }

  .title-dot--warn {
    background: #e65f5f;
  }
}

.problem-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 20px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    background: #fff;
    cursor: pointer;
    transition: all 0.25s ease;
    min-width: 140px;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
      transform: translateY(-2px);
    }

    &--active {
      border-color: #409eff;
      box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
    }
  }

  .action-card-body {
    display: flex;
    align-items: baseline;
    gap: 4px;
    .action-card-unit { font-size: 12px; color: #909399; }
    .action-card-count { font-size: 28px; font-weight: 700; line-height: 1; }
  }
}

.todo-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  .todo-card-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .todo-card-type { font-size: 16px; color: #606266; font-weight: 500; }
}

.detail-section {
  margin-top: 8px;
}

.display-type {
  font-size: 18px;
  color: #1f2d3d;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.brand-pic {
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
}
</style>
