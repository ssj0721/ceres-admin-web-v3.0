<template>
  <div class="menu-access-report-container">

    <div>
      <button @click="addadd">add</button>
    </div>

    <div class="report-header">
      <div class="title-group">
        <h2 class="report-title">菜单访问历史统计报表</h2>
        <div class="report-desc">数据实时更新 | 最后更新时间：{{ updateTime }}</div>
      </div>
      <div class="tab-switch">
        <el-button
          v-for="item in tabList"
          :key="item.key"
          :type="activeTab === item.key ? 'primary' : 'default'"
          @click="switchTab(item.key)"
          size="medium"
        >
          {{ item.name }}
        </el-button>
      </div>
    </div>

    <div class="filter-container">
      <el-form 
        :inline="isDesktop" 
        :model="filterForm" 
        class="filter-form"
      >
        <el-form-item label="统计日期：" v-if="activeTab === 'daily'">
          <el-date-picker
            v-model="filterForm.targetDate"
            type="date"
            placeholder="请选择统计日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="loading"
            class="date-picker"
            clearable
          />
        </el-form-item>

        <el-form-item label="统计时间段：" v-if="activeTab === 'range'">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="loading"
            class="date-picker"
            clearable
            unlink-panels
          />
        </el-form-item>

        <el-form-item label="平台类型：">
          <el-radio-group v-model="filterForm.appType" :disabled="loading">
            <el-radio :label="''">全平台</el-radio>
            <el-radio :label="1">PC</el-radio>
            <el-radio :label="2">小程序</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
            :loading="loading"
          >
            查询
          </el-button>
          <el-button
            type="default"
            icon="el-icon-refresh"
            @click="resetFilter"
            :disabled="loading"
            style="margin-left: 8px;"
          >
            重置
          </el-button>
          <el-button
            type="success"
            icon="el-icon-download"
            @click="exportExcel"
            :disabled="loading || chartData.length === 0"
            style="margin-left: 8px;"
          >
            导出Excel
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="chart-card">
      <div
        ref="chartRef"
        class="chart-wrapper"
        v-show="!loading || chartData.length > 0"
        style="width: 100%; height: 480px;"
        v-loading="loading"
        loading-text="正在加载数据..."
      ></div>

      <div class="empty-container" v-if="!loading && chartData.length === 0">
        <el-empty description="暂无当前条件下的统计数据"></el-empty>
      </div>
    </div>
  </div>
</template>

<script setup name="MenuAccessReport">
// 1. 导入核心依赖
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { ElMessage, ElEmpty } from 'element-plus'
import * as echarts from 'echarts'
import { saveAs } from 'file-saver'

// 2. 导入接口
import { statDailyData, statRangeData, exportMenuReport } from '@/api/reportStatistic'

// 3. 定义响应式状态
const activeTab = ref('daily') // 默认为每日统计
const tabList = ref([
  { key: 'daily', name: '每日数据统计' },
  { key: 'range', name: '时间段数据统计' }
])
const filterForm = ref({
  targetDate: '', // 每日统计日期
  dateRange: [],  // 时间段统计日期范围
  appType: ''     // 终端类型：'' 为全平台，1 为 PC，2 为小程序
})
const loading = ref(false) // 加载状态
const updateTime = ref('') // 最后更新时间
const chartRef = ref(null) // 图表容器引用
const chartData = ref([])  // 统计数据
let myChart = null // ECharts实例
let resizeHandler = null // 窗口resize事件处理器（用于规范解绑）    

// 4. 计算属性：判断是否为桌面端（用于表单自适应）
const isDesktop = computed(() => {
  return window.innerWidth >= 768
})

// 5. 标签切换方法
const switchTab = (tabKey) => {
  activeTab.value = tabKey
  resetFilter()
  if (myChart) updateChartTitle()
}

// 6. 重置筛选条件方法
const resetFilter = () => {
  filterForm.value.targetDate = ''
  filterForm.value.dateRange = []
  filterForm.value.appType = '' // 重置为全平台
  chartData.value = []
  if (myChart) {
    myChart.setOption({
      xAxis: { data: [] },
      series: [{ data: [] }]
    })
    updateChartTitle()
  }
}

// 7. 更新图表标题方法
const updateChartTitle = () => {
  if (!myChart) return
  const typeText = filterForm.value.appType === 1 ? '（PC端）' : (filterForm.value.appType === 2 ? '（小程序端）' : '（全平台）')
  const title = activeTab.value === 'daily'
    ? `每日菜单访问次数统计${typeText} - ${filterForm.value.targetDate || '未选择日期'}`
    : `时间段菜单访问次数统计${typeText} - ${filterForm.value.dateRange[0] || '未选择'} 至 ${filterForm.value.dateRange[1] || '未选择'}`
  myChart.setOption({ title: { text: title } })
}

// 8. 提取公共样式配置方法
const getChartStyleConfig = (dataLen, domWidth) => {
  let barWidth = 25
  if (dataLen > 0) {
    const calcWidth = (domWidth - 100) / dataLen - 15
    barWidth = Math.min(40, Math.max(25, calcWidth))
  }
  const barGap = dataLen <= 5 ? '30%' : '20%'
  const barCategoryGap = dataLen <= 5 ? '40%' : '30%'

  const labelFontSize = dataLen > 8 ? 10 : (dataLen > 3 ? 11 : 13)
  const labelRotate = 0
  const labelMargin = 15
  const labelAlign = 'center'
  const labelVerticalAlign = 'top'
  const gridBottom = dataLen > 8 ? '22%' : (dataLen > 3 ? '20%' : '18%')

  return {
    barStyle: { barWidth, barGap, barCategoryGap },
    labelStyle: { labelFontSize, labelRotate, labelMargin, labelAlign, labelVerticalAlign },
    gridStyle: { gridBottom }
  }
}

// 9. 初始化ECharts图表
const initChart = () => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }

  const dom = chartRef.value
  if (!dom) {
    ElMessage.error('图表容器不存在，初始化失败')
    return false
  }

  const domRect = dom.getBoundingClientRect()
  if (domRect.width === 0 || domRect.height === 0) {
    ElMessage.error('图表容器宽高为0，请检查样式配置')
    return false
  }

  myChart = echarts.init(dom)
  const domWidth = domRect.width
  const dataLen = chartData.value.length
  const { barStyle, labelStyle, gridStyle } = getChartStyleConfig(dataLen, domWidth)

  const baseOption = {
    title: {
      text: '每日菜单访问次数统计',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600, color: '#2d3748' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      padding: 12,
      textStyle: { fontSize: 12 },
      formatter: (params) => {
        return `<div style="text-align: left;">
                  <div>菜单：${params[0].name}</div>
                  <div>访问次数：${params[0].value} 次</div>
                </div>`
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: gridStyle.gridBottom,
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        interval: 0,
        rotate: labelStyle.labelRotate,
        color: '#4a5568',
        fontSize: labelStyle.labelFontSize,
        margin: labelStyle.labelMargin,
        align: labelStyle.labelAlign,
        verticalAlign: labelStyle.verticalAlign,
        overflow: 'breakAll',
        ellipsis: '...',
        formatter: (value) => {
          if (value.length > 6) {
            const firstLine = value.slice(0, 6)
            const secondLine = value.slice(6)
            return secondLine.length > 6 ? `${firstLine}\n${secondLine.slice(0, 6)}...` : `${firstLine}\n${secondLine}`
          }
          return value
        }
      },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { 
        show: true,
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: '访问次数（次）',
      nameTextStyle: { color: '#4a5568', fontSize: 12 },
      axisLabel: { color: '#4a5568', fontSize: 11 },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#f8fafc' } },
      min: 0,
      boundaryGap: [0, 0.1]
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: chartData.value.length > 10 ? 50 : 100
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        height: 16,
        bottom: '5%',
        borderColor: '#e2e8f0',
        backgroundColor: '#f5f7fa',
        handleStyle: { color: '#409eff' },
        show: chartData.value.length > 10
      }
    ],
    series: [
      {
        name: '访问次数',
        type: 'bar',
        barWidth: barStyle.barWidth,
        barGap: barStyle.barGap,
        barCategoryGap: barStyle.barCategoryGap,
        data: [],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#337ecc' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#66b1ff' },
              { offset: 1, color: '#409eff' }
            ])
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#2d3748',
          fontSize: 11,
          formatter: '{c} 次',
          align: 'center'
        }
      }
    ]
  }

  myChart.setOption(baseOption)
  return true
}

// 10. 更新图表数据
const updateChart = () => {
  if (!myChart || chartData.value.length === 0) return

  const xData = chartData.value.map(item => item.dimensionValue)
  const yData = chartData.value.map(item => item.totalCount)
  const dom = chartRef.value
  const domWidth = dom.getBoundingClientRect().width
  const dataLen = xData.length
  const { barStyle, labelStyle, gridStyle } = getChartStyleConfig(dataLen, domWidth)

  myChart.setOption({
    grid: { 
      left: '5%',
      right: '5%',
      bottom: gridStyle.gridBottom,
      top: '10%',
      containLabel: true 
    },
    xAxis: {
      data: xData,
      axisLabel: {
        fontSize: labelStyle.labelFontSize,
        rotate: labelStyle.labelRotate,
        margin: labelStyle.labelMargin,
        align: labelStyle.labelAlign,
        verticalAlign: labelStyle.verticalAlign,
        formatter: (value) => {
          if (value.length > 6) {
            const firstLine = value.slice(0, 6)
            const secondLine = value.slice(6)
            return secondLine.length > 6 ? `${firstLine}\n${secondLine.slice(0, 6)}...` : `${firstLine}\n${secondLine}`
          }
          return value
        }
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    series: [{
      data: yData,
      barWidth: barStyle.barWidth,
      barGap: barStyle.barGap,
      barCategoryGap: barStyle.barCategoryGap
    }],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: xData.length > 10 ? 50 : 100
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        height: 16,
        bottom: '5%',
        show: xData.length > 10
      }
    ]
  })
  updateChartTitle()
}

// 11. Excel导出（同步文件名逻辑）
const exportExcel = async () => {
  try {
    loading.value = true
    
    // 1. 构建请求参数
    const params = activeTab.value === 'daily' 
      ? { 
          targetDate: filterForm.value.targetDate,
          appType: filterForm.value.appType || null 
        }
      : { 
          startDate: filterForm.value.dateRange[0], 
          endDate: filterForm.value.dateRange[1],
          appType: filterForm.value.appType || null 
        }

    // 2. 提前计算文件名（与后端保持一致）
    const platformMap = { 1: 'PC', 2: '小程序' }
    const platformName = platformMap[filterForm.value.appType] || '全平台'
    const prefix = activeTab.value === 'daily' ? '每日' : '时间段'
    
    let dateSuffix = ''
    if (activeTab.value === 'daily') {
      // 2026-03-04 -> 20260304
      dateSuffix = filterForm.value.targetDate.replace(/-/g, '')
    } else {
      const s = filterForm.value.dateRange[0].replace(/-/g, '')
      const e = filterForm.value.dateRange[1].replace(/-/g, '')
      dateSuffix = `${s}_${e}`
    }

    const fileName = `${prefix}菜单访问次数统计(${platformName})${dateSuffix}.xlsx`

    // 3. 调用后端接口
    const blobData = await exportMenuReport(params)
    
    // 4. 执行下载
    saveAs(new Blob([blobData]), fileName)
    
    ElMessage.success('导出成功！')
  } catch (error) {
    console.error('导出异常:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

// 12. 校验筛选参数
const validateParam = () => {
  if (activeTab.value === 'daily') {
    if (!filterForm.value.targetDate) {
      ElMessage.warning('请选择每日统计日期')
      return false
    }
  } else {
    const [start, end] = filterForm.value.dateRange
    if (!Array.isArray(filterForm.value.dateRange) || filterForm.value.dateRange.length !== 2 || !start || !end) {
      ElMessage.warning('请选择完整的统计时间段')
      return false
    }
    if (new Date(start) > new Date(end)) {
      ElMessage.warning('开始日期不能晚于结束日期')
      return false
    }
  }
  return true
}

// 13. 发起数据请求
const fetchData = async () => {
  if (!validateParam()) return
  if (!myChart && !initChart()) return

  try {
    loading.value = true
    
    // 构建请求参数（加入 appType）
    const param = activeTab.value === 'daily' 
      ? { 
          targetDate: filterForm.value.targetDate,
          appType: filterForm.value.appType || null 
        }
      : { 
          startDate: filterForm.value.dateRange[0], 
          endDate: filterForm.value.dateRange[1],
          appType: filterForm.value.appType || null 
        }

    // 调用接口获取数据
    const res = activeTab.value === 'daily' 
      ? await statDailyData(param)
      : await statRangeData(param)

    if (res && Array.isArray(res.data)) {
      chartData.value = res.data
      updateTime.value = new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
      updateChart()
      if (chartData.value.length === 0) {
        ElMessage.info('暂无当前条件下的统计数据')
      }
    } else {
      ElMessage.error(res?.message || '获取数据失败，请稍后重试')
      chartData.value = []
      if (myChart) {
        myChart.setOption({ xAxis: { data: [] }, series: [{ data: [] }] })
        updateChartTitle()
      }
    }
  } catch (error) {
    console.error('网络/HTTP请求异常：', error)
    ElMessage.error('网络异常，获取数据失败')
    chartData.value = []
    if (myChart) {
      myChart.setOption({ xAxis: { data: [] }, series: [{ data: [] }] })
      updateChartTitle()
    }
  } finally {
    loading.value = false
  }
}

// 14. 页面挂载生命周期
onMounted(() => {
  initChart()
  const today = new Date().toISOString().split('T')[0]
  filterForm.value.targetDate = today
  fetchData()
  resizeHandler = () => {
    if (myChart) {
      myChart.resize()
      updateChart()
    }
  }
  window.addEventListener('resize', resizeHandler)
})

// 15. 监听标签切换
watch(activeTab, () => {
  initChart()
  updateChartTitle()
})

// 16. 组件卸载生命周期
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped>
/* 全局容器样式 */
.menu-access-report-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 头部样式 */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.title-group .report-title {
  font-size: 20px;
  color: #2d3748;
  margin: 0;
  font-weight: 600;
}

.title-group .report-desc {
  font-size: 12px;
  color: #718096;
  margin-top: 4px;
}

.tab-switch .el-button {
  border-radius: 4px;
  padding: 6px 16px;
}

/* 筛选区域样式 */
.filter-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.filter-form .date-picker {
  width: 220px;
}

/* 图表卡片样式 */
.chart-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 500px;
  box-sizing: border-box;
  overflow: hidden;
}

.chart-wrapper {
  width: 100% !important;
  height: 480px !important;
  box-sizing: border-box;
  min-width: 300px;
}

/* 空数据提示样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 480px;
}

/* 移动端响应式适配 */
@media (max-width: 768px) {
  .menu-access-report-container {
    padding: 12px;
  }

  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .tab-switch {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .tab-switch .el-button {
    flex: 1;
    margin-right: 8px;
  }

  .tab-switch .el-button:last-child {
    margin-right: 0;
  }

  .filter-form {
    flex-direction: column;
    align-items: stretch !important;
  }

  .filter-form .el-form-item {
    width: 100%;
    margin-bottom: 12px;
  }

  .filter-form .date-picker {
    width: 100%;
  }

  .chart-wrapper {
    height: 380px !important;
  }

  .empty-container {
    height: 380px;
  }
}
</style>