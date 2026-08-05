<template>
  <div class="scm-report-container">
    <div class="report-header">
      <div class="header-left">
        <h2 class="report-title">SCM联营商送审数据报表</h2>
        
     
       <div class="mode-switch-wrapper">
          <el-radio-group v-model="activeMode" @change="handleModeChange" class="custom-radio-group">
            <el-radio-button label="realtime">
              <el-icon><DataLine /></el-icon> 实时统计
            </el-radio-button>
            <el-radio-button label="history">
              <el-icon><Calendar /></el-icon> 时间段统计
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="header-right">
        
        <div v-if="activeMode === 'history'" class="filter-item fade-in">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            @change="handleSearch"
            style="width: 260px;"
          />
          <el-button 
            type="primary" 
            @click="handleHistorySearch" 
            :loading="loading"
            :disabled="!dateRange || dateRange.length === 0"
          >
            <el-icon style="margin-right: 4px"><Search /></el-icon> 查询
          </el-button>
        </div> 

        <div class="filter-item report-desc fade-in">
          <el-icon><Clock /></el-icon> 数据更新时间：{{ updateTime }}
        </div>

        <el-button
          type="success"
          plain
          class="export-btn"
          @click="exportToExcel"
          :loading="exportLoading"
        >
          <el-icon style="margin-right: 6px"><Download /></el-icon>
          导出Excel表格
        </el-button>
      </div>
    </div>

    <div class="report-card">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
        :loading-text="loadingText"
        :header-cell-style="{ background: '#f8fafc', color: '#2d3748', fontWeight: '600' }"
        :row-style="{ height: '50px' }"
        :cell-style="{ verticalAlign: 'middle' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          prop="name"
          label="联营商名称"
          align="center"
          min-width="140"
          class-name="table-column-name"
        />
        <el-table-column
          v-if="activeMode === 'realtime'"
          prop="created"
          label="开始使用SCM日期"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="logs"
          label="登录次数"
          align="center"
          width="100"
        />
        <el-table-column
          prop="depname"
          label="品种"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="f"
          label="送审数"
          align="center"
          width="120"
          class-name="table-column-success"
        />
        <el-table-column
          prop="g"
          label="通过款数"
          align="center"
          width="120"
          class-name="table-column-warning"
        />
        <el-table-column
          prop="h"
          label="总款数"
          align="center"
          width="80"
        />
        <el-table-column
          prop="yess"
          label="已搜图款数"
          align="center"
          width="80"
        />
        <el-table-column
          prop="nos"
          label="未搜图款数"
          align="center"
          width="80"
        />
        <el-table-column
          prop="k"
          label="已送审款数"
          align="center"
          width="80"
        />
        <el-table-column
          prop="l"
          label="已送审款通过款数"
          align="center"
          width="100"
        />
        <el-table-column
          prop="m"
          label="未送审款数"
          align="center"
          width="80"
        />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          class="report-pagination"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup name="ScmReport">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DataLine, Calendar, Search, Clock, Download } from '@element-plus/icons-vue'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getScmResultList, getScmResultAll, update, update2 } from '@/api/scmResult'

const activeMode = ref('realtime')
const dateRange = ref([])
const loading = ref(false)
const exportLoading = ref(false)
const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const updateTime = ref('')
const currentLoadingText = ref('')

const loadingText = computed(() => {
  if (currentLoadingText.value) return currentLoadingText.value
  return activeMode.value === 'realtime' ? '正在加载实时数据...' : '正在查询历史数据...'
})

const shortcuts = [
  { text: '最近一周', value: () => { const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); return [start, end] } },
  { text: '最近一个月', value: () => { const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 30); return [start, end] } },
  { text: '最近三个月', value: () => { const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 90); return [start, end] } },
]

const handleModeChange = async (val) => {
  pageNum.value = 1
  pageSize.value = 10
  tableData.value = []
  total.value = 0
  
  if (val === 'realtime') {
    loading.value = true
    try {
      currentLoadingText.value = '正在更新实时数据，请稍候...'
      await update()
      currentLoadingText.value = '更新完成，正在加载列表...'
      await getReportData()
    } catch (error) {
      console.error('实时模式切换失败', error)
      ElMessage.warning('数据更新失败，尝试加载旧数据')
      await getReportData()
    } finally {
      loading.value = false
      currentLoadingText.value = ''
    }
  } else {
    dateRange.value = []
  }
}

const handleHistorySearch = async () => {
  if (!dateRange.value || dateRange.value.length === 0) return
  pageNum.value = 1
  loading.value = true
  try {
    const [startDate, endDate] = dateRange.value
    currentLoadingText.value = `正在同步 ${startDate} 至 ${endDate} 的历史数据...`
    await update2({ startDate, endDate })
    currentLoadingText.value = '数据同步完成，正在加载列表...'
    await getReportData()
    ElMessage.success('历史数据查询成功')
  } catch (error) {
    console.error('历史查询失败', error)
    ElMessage.error('历史数据同步失败')
  } finally {
    loading.value = false
    currentLoadingText.value = ''
  }
}

const handleSearch = () => {
  if (!dateRange.value || dateRange.value.length === 0) return
  pageNum.value = 1
}

const getReportData = async () => {
  const isInternalLoading = !loading.value
  if (isInternalLoading) loading.value = true
  try {
    const res = await getScmResultList(pageNum.value, pageSize.value)
    if (res && res.data) {
      const { list, total: totalCount } = res.data
      tableData.value = list
      total.value = totalCount
      if (activeMode.value === 'realtime') {
        updateTime.value = new Date().toLocaleString('zh-CN', { 
          year: 'numeric', month: '2-digit', day: '2-digit', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      }
    } else {
      ElMessage.error(res?.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取列表异常：', error)
    if (isInternalLoading) ElMessage.error('获取列表数据失败')
  } finally {
    if (isInternalLoading) loading.value = false
  }
}

const exportToExcel = async () => {
  if (activeMode.value === 'history' && (!dateRange.value || dateRange.value.length === 0)) {
    ElMessage.warning('请先选择时间段')
    return
  }

  try {
    const confirmText = activeMode.value === 'realtime' 
      ? '是否导出当前【实时】统计数据？' 
      : `是否导出【${dateRange.value[0]} 至 ${dateRange.value[1]}】的历史数据？`

    await ElMessageBox.confirm(confirmText, '导出确认', {
      confirmButtonText: '立即导出',
      cancelButtonText: '取消',
      type: 'info'
    })

    exportLoading.value = true
    const res = await getScmResultAll()
    const allData = res.data || []

    if (allData.length === 0) {
      ElMessage.warning('当前条件下暂无数据可导出')
      return
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SCM联营商数据');

    const merchantGroup = {}
    allData.forEach(item => {
      if (!merchantGroup[item.name]) {
        merchantGroup[item.name] = {
          info: { name: item.name, created: item.created, logs: item.logs },
          list: []
        }
      }
      merchantGroup[item.name].list.push(item)
    })
    const merchantList = Object.values(merchantGroup)
    const isRealtimeMode = activeMode.value === 'realtime'
    
    let titleText = isRealtimeMode 
      ? `SCM联营商送审数据报表（实时统计 - 截止 ${new Date().toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}）`
      : `SCM联营商送审数据报表（${dateRange.value[0]} 至 ${dateRange.value[1]}）`
    
    const titleRow = worksheet.addRow([titleText])
    titleRow.height = 30
    titleRow.font = { name: '宋体', size: 14, bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    const titleMergeEnd = isRealtimeMode ? 'M1' : 'L1'
    worksheet.mergeCells(`A1:${titleMergeEnd}`)

    let header1, header2
    if (isRealtimeMode) {
      header1 = ['序号', '联营商名称', '开始使用SCM日期', '登录【统一身份认证系统】次数', '品种', 'iRetail旧模式', '', 'SCM新模式', '', '', '', '', '']
      header2 = ['', '', '', '', '', '送审数', '通过款数', '总款数', '已搜图款数', '未搜图款数', '已送审款数', '已送审款通过款数', '未送审款数']
    } else {
      header1 = ['序号', '联营商名称', '登录【统一身份认证系统】次数', '品种', 'iRetail旧模式', '', 'SCM新模式', '', '', '', '', '']
      header2 = ['', '', '', '', '送审数', '通过款数', '总款数', '已搜图款数', '未搜图款数', '已送审款数', '已送审款通过款数', '未送审款数']
    }
    
    worksheet.addRow(header1)
    worksheet.addRow(header2)

    if (isRealtimeMode) {
      worksheet.mergeCells('A2:A3'); worksheet.mergeCells('B2:B3'); worksheet.mergeCells('C2:C3');
      worksheet.mergeCells('D2:D3'); worksheet.mergeCells('E2:E3'); worksheet.mergeCells('F2:G2'); worksheet.mergeCells('H2:M2');
    } else {
      worksheet.mergeCells('A2:A3'); worksheet.mergeCells('B2:B3'); worksheet.mergeCells('C2:C3');
      worksheet.mergeCells('D2:D3'); worksheet.mergeCells('E2:F2'); worksheet.mergeCells('G2:L2');
    }

    let currentRow = 4 
    const summaryData = { f: 0, g: 0, h: 0, yess: 0, nos: 0, k: 0, l: 0, m: 0 }
    
    merchantList.forEach((merchant, merchantIndex) => {
      const { info, list } = merchant
      const startRow = currentRow
      list.forEach((item, varietyIndex) => {
        summaryData.f += item.f || 0; summaryData.g += item.g || 0; summaryData.h += item.h || 0;
        summaryData.yess += item.yess || 0; summaryData.nos += item.nos || 0; summaryData.k += item.k || 0;
        summaryData.l += item.l || 0; summaryData.m += item.m || 0;
        
        let rowData = isRealtimeMode 
          ? [varietyIndex === 0 ? (merchantIndex + 1) : '', varietyIndex === 0 ? info.name : '', varietyIndex === 0 ? info.created : '', varietyIndex === 0 ? info.logs : '', item.depname, item.f, item.g, item.h, item.yess, item.nos, item.k, item.l, item.m]
          : [varietyIndex === 0 ? (merchantIndex + 1) : '', varietyIndex === 0 ? info.name : '', varietyIndex === 0 ? info.logs : '', item.depname, item.f, item.g, item.h, item.yess, item.nos, item.k, item.l, item.m]
        worksheet.addRow(rowData)
        currentRow++
      })
      const endRow = currentRow - 1
      if (endRow > startRow) {
        const cols = isRealtimeMode ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C']
        cols.forEach(col => worksheet.mergeCells(`${col}${startRow}:${col}${endRow}`))
      }
    })
    
    // --- 修复空行逻辑：先 addRow，再 mergeCells ---
    let summaryRowData = isRealtimeMode 
      ? ['汇总：', '', '', '', '', summaryData.f, summaryData.g, summaryData.h, summaryData.yess, summaryData.nos, summaryData.k, summaryData.l, summaryData.m]
      : ['汇总：', '', '', '', summaryData.f, summaryData.g, summaryData.h, summaryData.yess, summaryData.nos, summaryData.k, summaryData.l, summaryData.m]
    
    const summaryRow = worksheet.addRow(summaryRowData)
    const summaryRowNumber = summaryRow.number // 获取实际添加的行号

    if (isRealtimeMode) {
      worksheet.mergeCells(`A${summaryRowNumber}:E${summaryRowNumber}`)
    } else {
      worksheet.mergeCells(`A${summaryRowNumber}:D${summaryRowNumber}`)
    }
    
    summaryRow.eachCell((cell, colNumber) => {
      const dataColCount = isRealtimeMode ? 13 : 12
      if (colNumber <= dataColCount) {
        cell.font = { bold: true, size: 11 }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD966' } }
        cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } }
      }
    })
    
    const finalDataRow = summaryRowNumber // 用于后续样式排除

    const now = new Date()
    const fileNameTime = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
    const descColumn = isRealtimeMode ? 'P' : 'O'
    worksheet.getColumn(descColumn).width = 100
    
    worksheet.getCell(`${descColumn}2`).value = '说明：'
    worksheet.getCell(`${descColumn}2`).font = { name: '宋体', size: 11, bold: true }
    const cellDesc3 = worksheet.getCell(`${descColumn}3`)
    cellDesc3.value = '登录【统一身份认证系统】次数：指登录【统一身份认证系统】平台的次数，使用SCM需经过【统一身份认证系统】登录入口'
    cellDesc3.font = { name: '宋体', size: 10 }
    cellDesc3.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
    worksheet.getRow(3).height = 35
    const cellDesc5 = worksheet.getCell(`${descColumn}5`)
    cellDesc5.value = `注：${isRealtimeMode ? '统计截止时间 ' + now.toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute:'2-digit' }) : '统计区间: ' + dateRange.value[0] + ' 至 ' + dateRange.value[1]}`
    cellDesc5.font = { name: '宋体', size: 10 }

    const dataColCount = isRealtimeMode ? 13 : 12
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === finalDataRow) return // 跳过已设置过样式的汇总行
      row.eachCell((cell, colNumber) => {
        if (colNumber <= dataColCount) {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          let fgColor = null
          if (isRealtimeMode) {
            if (colNumber >= 8 && colNumber <= 10) fgColor = 'FFDEEBF7'
            else if (colNumber >= 11 && colNumber <= 12) fgColor = 'FFB4C6E7'
            else if (colNumber === 13) fgColor = 'FFFCE4D6'
          } else {
            if (colNumber >= 7 && colNumber <= 9) fgColor = 'FFDEEBF7'
            else if (colNumber >= 10 && colNumber <= 11) fgColor = 'FFB4C6E7'
            else if (colNumber === 12) fgColor = 'FFFCE4D6'
          }
          if (rowNumber === 1) {
            cell.font = { name: '宋体', size: 14, bold: true }; fgColor = 'FFE7F3FF'
          } else if (rowNumber >= 2 && rowNumber <= 3) {
            cell.font = { bold: true }
            if (rowNumber === 2) {
              const grayStart = isRealtimeMode ? 6 : 5
              const grayEnd = isRealtimeMode ? 13 : 12
              if (colNumber >= grayStart && colNumber <= grayEnd) fgColor = 'FFD9D9D9'
              else if (!fgColor) fgColor = 'FFDCE6F1'
            } else if (rowNumber === 3 && !fgColor) fgColor = 'FFF8FAFC'
          }
          if (fgColor) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColor } }
        }
      })
    })

    const colWidths = isRealtimeMode ? [8, 22, 18, 20, 12, 10, 10, 10, 12, 12, 12, 18, 12] : [8, 22, 20, 12, 10, 10, 10, 12, 12, 12, 18, 12]
    colWidths.forEach((w, i) => worksheet.getColumn(i + 1).width = w)

    const buffer = await workbook.xlsx.writeBuffer()
    const fileName = isRealtimeMode 
      ? `SCM联营商送审情况${fileNameTime}_V1(按款统计).xlsx`
      : `SCM联营商送审情况_${dateRange.value[0].replace(/-/g, '')}至${dateRange.value[1].replace(/-/g, '')}_V1(按款统计).xlsx`
    
    saveAs(new Blob([buffer]), fileName)
    ElMessage.success('导出成功')
  } catch (error) {
    if (error !== 'cancel') { console.error('导出失败', error); ElMessage.error('Excel导出遇到问题') }
  } finally { exportLoading.value = false }
}

const handleSizeChange = (val) => { pageSize.value = val; pageNum.value = 1; getReportData() }
const handleCurrentChange = (val) => { pageNum.value = val; getReportData() }

onMounted(async () => {
  await handleModeChange('realtime')
})
</script>

<style scoped>
.scm-report-container { padding: 24px; background-color: #f0f2f5; min-height: 100vh; }
.report-header { background: #fff; padding: 20px 24px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,21,41,.08); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
.header-left { display: flex; flex-direction: column; gap: 12px; }
.report-title { margin: 0; font-size: 20px; color: #1f2f3d; font-weight: 700; border-left: 4px solid #409eff; padding-left: 12px; line-height: 1.2; }
.custom-radio-group :deep(.el-radio-button__inner) { padding: 9px 20px; font-weight: 500; }
.header-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 10px; }
.report-desc { color: #909399; font-size: 13px; background: #f4f4f5; padding: 8px 12px; border-radius: 4px; display: flex; align-items: center; gap: 6px; }
.export-btn { font-weight: 600; letter-spacing: 0.5px; }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.report-card { background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,21,41,.08); }
.pagination-wrapper { margin-top: 24px; display: flex; justify-content: flex-end; }
:deep(.table-column-name) { color: #303133; font-weight: 600; }
:deep(.table-column-success) { color: #67c23a; font-weight: bold; }
:deep(.table-column-warning) { color: #e6a23c; font-weight: bold; }
@media (max-width: 768px) { .report-header { flex-direction: column; align-items: flex-start; } .header-right { width: 100%; flex-direction: column; align-items: stretch; } .export-btn { width: 100%; } }
</style>