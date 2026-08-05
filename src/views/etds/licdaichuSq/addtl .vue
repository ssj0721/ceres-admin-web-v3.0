<!-- 蔡锦涛修改于2025/8/25 -->
<template>
  <div class="content">
    <div class="formSearch" style="display: flex; align-items: center; gap: 28px;">
      <el-button type="primary" @click="fn_savedate" :disabled="isSaved">存档</el-button>
      <el-button type="primary" @click="fn_delete" :disabled="!isSaved">删除</el-button>
      <el-date-picker
        v-model="applyDate"
        type="date"
        placeholder="申请日期"
        style="width: 220px; height: 40px; vertical-align: middle;"
        value-format="YYYY-MM-DD"
      />
      <el-input v-model="form.checkqty" placeholder="查货件数" style="width: 220px; height: 40px; vertical-align: middle;" />
      <el-input v-model="form.remarks" placeholder="申请备注" style="width: 220px; height: 40px; vertical-align: middle;" />
      <el-button type="primary" @click="fn_updaterow" :disabled="isSaved">确认</el-button>              <!-- 确认按钮，用于更新选中行的数据 -->
      <el-button type="primary" @click="handlePicItemCodeBtn" v-if="shouldShowPicButton">印花款</el-button>    <!-- 印花款按钮，根据 lic_type 控制显示 -->
    </div>

    <!-- 印花款选择弹窗 -->
    <el-dialog v-model="openModal" title="印花款选择" width="900px">
      <div style="margin-bottom: 12px;">
        <el-button type="primary" @click="confirmPicItemcode">确认印花款</el-button>
      </div>
      <el-table
        :data="picItemCodeTable"
        style="width: 100%"
        border
        ref="picTable"
        @selection-change="val => picItemCodeSelected = val"
        :row-key="row => row.picItemcode"
        :default-selection="picItemCodeSelected"
        height="400"
      >
  <el-table-column type="selection" width="55"/>
        <el-table-column prop="picItemcode" label="印花款号" align="center" />
        <el-table-column prop="pic1" label="图片1" align="center">
          <template #default="scope">
            <img v-if="scope.row.pic1" :src="getPicUrl(scope.row.pic1)" style="width: 120px;" />
          </template>
        </el-table-column>
        <el-table-column prop="pic2" label="图片2" align="center">
          <template #default="scope">
            <img v-if="scope.row.pic2" :src="getPicUrl(scope.row.pic2)" style="width: 120px;" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 数据表格 -->
    <div style="overflow-x: auto;">
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        class="table dataTable"
        stripe
        border
        fit
        :header-cell-style="tableOptions.headStyle"
        :data="table"
        style="width: 100%; min-width: 1200px;"
        @selection-change="handleSelectionChange"
      >
  <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column
          prop="applyNo"
          align="center"
          label="上架申请号"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="po_no"
          align="center"
          label="合同号"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_seq"
          align="center"
          label="出货批次"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="po_qty"
          align="center"
          label="合同数量"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_qsname"
          align="center"
          label="中尾期"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_num"
          align="center"
          label="查货次数"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_checkqty"
          align="center"
          label="申请件数"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_plandate"
          align="center"
          label="申请查货日期"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_planremark"
          align="center"
          label="申请备注"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_checkdate"
          align="center"
          label="确定查货日期"
          min-width="110"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_checkremark"
          align="center"
          label="查货排期备注"
          min-width="110"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checker1"
          align="center"
          label="排期查货员"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_date"
          align="center"
          label="实际查货日期"
          min-width="110"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checker2"
          align="center"
          label="实际查货员"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="bc_result"
          align="center"
          label="查货结果"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="confirm_statename"
          align="center"
          label="状态"
          min-width="80"
          show-overflow-tooltip
        />
        <el-table-column
          prop="lic_typename"
          align="center"
          label="联营业务/联营款"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="cust_code"
          align="center"
          label="客户"
          min-width="80"
          show-overflow-tooltip
        />
  <!-- 印花款列已删除 -->
      </el-table>
      <!-- 表格底部信息区域 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0;">
        <!-- 已选择合同数量显示 - 左侧 -->
        <div style="font-size: 14px; display: flex; align-items: center;">
          已选择 <span style="color: #1890ff; font-weight: bold; margin: 0 4px;">{{ globalSelectedRows.length }}</span> 个合同
          <el-button 
            v-if="globalSelectedRows.length > 0" 
            size="small" 
            type="danger" 
            style="margin-left: 12px;" 
            @click="clearSelectedRows"
          >清空</el-button>
        </div>
        
        <!-- 分页器 - 右侧 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current-page="pagination.current"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fnGetlicCheckSqDetail, fnGetlicCheckSqDetailNew, fnSaveNewLicCheckSqDetail, fnDeleteLicCheckSqDetail, getPicItemCodeData } from './index.js'

// 模板引用
const tableRef = ref(null)

const props = defineProps({
  licType: {
    type: [String, Array],
    default: '0'  // 修改默认值为 '0'，与其他逻辑保持一致
  },
  selectedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])
// 响应式变量定义
const tableLoading = ref(false)                               // 表格加载状态
const tableOptions = ref({
  headStyle: { background: '#EEF3FF', color: '#333333' },    // 表头样式
  total: 0,                                                  // 数据总数
})
const applyDate = ref('')                                    // 申请日期
const openModal = ref(false)                                 // 印花款弹窗显示状态
const picItemCodeTable = ref([])                             // 印花款表格数据
const picItemCodeSelected = ref([])                          // 选中的印花款
const table = ref([])                                        // 主表格数据（当前页）
const allTableData = ref([])                             // 所有表格数据
const selected = ref([])                                     // 选中的行数据
const globalSelectedRows = ref([])                       // 全局选择状态（跨页选择）
const isRestoring = ref(false)                          // 恢复选择状态标志
const isSaved = ref(false)                                   // 是否已存档状态

// 分页配置
const pagination = ref({
  current: 1,        // 当前页码
  pageSize: 10,      // 每页条数（默认10条）
  total: 0           // 总记录数
})

const form = ref({
  checkqty: '',                                              // 查货件数
  remarks: ''                                                // 申请备注
})

// 计算属性：是否显示印花款按钮
const shouldShowPicButton = computed(() => {
  // 如果有选中行，检查选中行的 lic_type
  if (selected.value.length > 0) {
    const firstSelected = selected.value[0]
    // 检查选中行的 lic_type 字段，如果为 0 或 '0' 则显示印花款按钮
    return firstSelected.lic_type === 0 || firstSelected.lic_type === '0'
  }
  
  // 如果没有选中行，根据当前联营类型判断
  const { licTypeValue } = getDataParams()
  return licTypeValue === '0'
})

// 通用函数：获取数据参数
function getDataParams() {
  let selectedList = []
  let licTypeValue = '0'
  
  if (Array.isArray(props.selectedRows) && props.selectedRows.length > 0) {
    selectedList = props.selectedRows
    licTypeValue = Array.isArray(props.licType) ? props.licType[0] || '0' : props.licType || '0'
  } else {
    const sessionSelectedRows = sessionStorage.getItem('selectedRows')
    const sessionLicType = sessionStorage.getItem('currentLicType')
    
    if (sessionSelectedRows) {
      selectedList = JSON.parse(sessionSelectedRows)
    }
    if (sessionLicType) {
      const parsedLicType = JSON.parse(sessionLicType)
      licTypeValue = Array.isArray(parsedLicType) ? parsedLicType[0] || '0' : parsedLicType || '0'
    }
  }
  
  return { selectedList, licTypeValue }
}

// 分页处理函数
const handleSizeChange = (val) => {
  console.log('分页大小变化:', val);
  pagination.value.pageSize = val;
  pagination.value.current = 1; // 重置到第一页
  updateCurrentPageData();
};

const handleCurrentChange = (val) => {
  console.log('页码变化:', val, '当前全局选择数:', globalSelectedRows.value?.length || 0);
  pagination.value.current = val;
  updateCurrentPageData();
};

// 更新当前页显示的数据
const updateCurrentPageData = () => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  table.value = allTableData.value.slice(start, end);
  
};

// 获取行的唯一标识
const getRowKey = (row) => {
  const poNo = row.po_no || row.poNo || row.applyNo;
  const bcSeq = row.bc_seq || row.bcSeq || '';
  const bcNum = row.bc_num || row.bcNum || '';
  return `${poNo}_${bcSeq}_${bcNum}`;
};


// 更新全局选择状态
const updateGlobalSelection = (currentPageSelection) => {
  console.log('=== 更新全局选择状态 ===');
  console.log('当前页选择数量:', currentPageSelection.length);
  console.log('更新前全局选择数量:', globalSelectedRows.value.length);
  
  // 获取当前页的所有数据的唯一标识
  const currentPageKeys = table.value.map(getRowKey);
  console.log('当前页的所有键值:', currentPageKeys);
  
  // 从全局选择中移除当前页的所有项目
  const filteredGlobalRows = globalSelectedRows.value.filter(row => {
    const key = getRowKey(row);
    const shouldKeep = !currentPageKeys.includes(key);
    if (!shouldKeep) {
      console.log('从全局选择中移除:', key);
    }
    return shouldKeep;
  });
  
  // 添加当前页新选择的项目到全局选择
  const newSelection = [...filteredGlobalRows, ...currentPageSelection];
  globalSelectedRows.value = newSelection;
  
  console.log('更新后全局选择数量:', globalSelectedRows.value.length);
  console.log('=== 全局选择状态更新完成 ===');
};


// 通用函数：获取唯一合同号列表
function getUniquePoList(selectedList) {
  const poListArr = selectedList
    .map(row => (row.poNo || row.po_no || '').toString().trim())    // 兼容不同字段名
    .filter(Boolean)
  return Array.from(new Set(poListArr))     // 去重
}

onMounted(() => {     // 组件挂载时加载表格数据
  loadTableData()
})

watch(() => [props.selectedRows, props.licType], () => {
  if (props.selectedRows && props.selectedRows.length > 0) {
    loadTableData()
  }
}, { deep: true })


async function loadTableData() {      // 加载表格数据的异步函数
  tableLoading.value = true
  
  try {
    const { selectedList, licTypeValue } = getDataParams()
    const uniquePoList = getUniquePoList(selectedList)

    if (uniquePoList.length === 0) {         // 检查是否有选中的合同号
      table.value = []
      allTableData.value = []
      pagination.value.total = 0
      ElMessage.warning('未获取到选中的合同号，无法加载数据')
      return
    }

    const params = {         // 构造请求参数
      polist: "'" + uniquePoList.join("','") + "'",
      sq_poqtylist: uniquePoList.join(','),
      is_sqsorlys: licTypeValue
    }
    
    const response = await fnGetlicCheckSqDetailNew(params)        // 调用API获取表格数据
    
    if (response?.data?.Examples && Array.isArray(response.data.Examples)) {     // 处理响应数据
      // 保存所有数据
      allTableData.value = [...response.data.Examples]

      // 根据导入选择的 midTail 覆盖中尾期显示
      /*try {
        const importedRows = Array.isArray(selectedList) ? selectedList : []
        if (importedRows.length > 0) {
          // 构建 poNo -> midTail 对照表（兼容不同字段名）
          const poToMidTail = new Map()
          importedRows.forEach(r => {
            const po = (r.poNo || r.po_no || r.contractNo || '').toString().trim()
            const mt = (r.midTail || '').toString().trim()
            if (po && mt) {
              poToMidTail.set(po, mt)
            }
          })
          if (poToMidTail.size > 0) {
            allTableData.value = allTableData.value.map(item => {
              const po = (item.po_no || item.poNo || '').toString().trim()
              const mt = poToMidTail.get(po)
              if (mt) {
                // 将 midTail 转换为 bc_qs/bc_qsname
                const isZhongQi = (mt === '中期' || mt === '1' || mt === 1)
                const isWeiQi = (mt === '尾期' || mt === '3' || mt === 3)
                if (isZhongQi) {
                  return { ...item, bc_qs: 1, bc_qsname: '中期' }
                }
                if (isWeiQi) {
                  return { ...item, bc_qs: 3, bc_qsname: '尾期' }
                }
              }
              return item
            })
          }
        }
      } catch (e) {
        console.warn('应用导入的中尾期映射失败:', e)
      } 
     
     */

      pagination.value.total = allTableData.value.length
      
      // 重置到第一页
      pagination.value.current = 1
      
      // 更新当前页数据
      updateCurrentPageData()
    } else {
      table.value = []
      allTableData.value = []
      pagination.value.total = 0
      ElMessage.warning('未获取到数据')
    }
    
    // 重置选中项和表单数据
    globalSelectedRows.value = []  // 清空全局选择
    selected.value = []
    form.value.checkqty = ''
    form.value.remarks = ''
    isSaved.value = false  // 重置存档状态
    
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    table.value = []
    tableOptions.value.total = 0
  } finally {
    tableLoading.value = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  // 如果正在恢复选择状态，则忽略这个事件
  if (isRestoring.value) {
    console.log('正在恢复选择状态，忽略选择变化事件');
    return;
  }
  
  console.log('表格选择变化:', selection.length, '行');
  
  // 更新全局选择状态
  updateGlobalSelection(selection);
  
  // selected.value 应该始终反映全局选择状态
  selected.value = [...globalSelectedRows.value];
  
  console.log('全局选择状态更新完成，总数:', globalSelectedRows.value.length);
  
  // 同步显示选中行的信息到顶部输入框
  if (globalSelectedRows.value.length > 0) {
    // 如果只选择了一行，同步显示该行的详细信息
    if (globalSelectedRows.value.length === 1) {
      const selectedRow = globalSelectedRows.value[0];
      
      // 同步申请件数（如果该行已填写）
      if (selectedRow.bc_checkqty) {
        form.value.checkqty = selectedRow.bc_checkqty.toString();
      } else {
        // 如果该行未填写，使用合同数量
        form.value.checkqty = (parseInt(selectedRow.po_qty) || 0).toString();
      }
      
      // 同步申请查货日期（如果该行已填写）
      if (selectedRow.bc_plandate) {
        applyDate.value = selectedRow.bc_plandate;
      } else {
        applyDate.value = '';
      }
      
      // 同步申请备注（如果该行已填写）
      if (selectedRow.bc_planremark) {
        form.value.remarks = selectedRow.bc_planremark;
      } else {
        form.value.remarks = '';
      }
      
      console.log('同步单行选择信息:', {
        checkqty: form.value.checkqty,
        plandate: applyDate.value,
        remarks: form.value.remarks
      });
      
    } else {
      // 多行选择时，计算申请件数总和，但不同步日期和备注
      const totalQty = globalSelectedRows.value.reduce((sum, item) => {
        // 优先使用已填写的申请件数，否则使用合同数量
        const qty = item.bc_checkqty ? parseInt(item.bc_checkqty) : (parseInt(item.po_qty) || 0);
        return sum + qty;
      }, 0);
      form.value.checkqty = totalQty.toString();
      
      // 多行选择时，检查是否所有选中行的日期和备注都相同
      const dates = [...new Set(globalSelectedRows.value.map(item => item.bc_plandate).filter(Boolean))];
      const remarks = [...new Set(globalSelectedRows.value.map(item => item.bc_planremark).filter(Boolean))];
      
      // 如果所有选中行的日期相同，显示该日期
      if (dates.length === 1) {
        applyDate.value = dates[0];
      } else {
        applyDate.value = '';
      }
      
      // 如果所有选中行的备注相同，显示该备注
      if (remarks.length === 1) {
        form.value.remarks = remarks[0];
      } else {
        form.value.remarks = '';
      }
      
      console.log('多行选择信息同步:', {
        totalQty: form.value.checkqty,
        commonDate: applyDate.value,
        commonRemark: form.value.remarks
      });
    }
  } else {
    // 无选择时，清空所有输入框
    form.value.checkqty = '';
    applyDate.value = '';
    form.value.remarks = '';
  }
};

function fn_updaterow() {      // 更新选中行数据的函数
  if (selected.value.length === 0) {
    ElMessage.warning('请选择合同')
    return
  }
  if (!form.value.checkqty) {
    ElMessage.warning('请输入查货件数')
    return
  }
  if (!applyDate.value) {
    ElMessage.warning('请选择申请日期')
    return
  }
  if (!form.value.remarks || form.value.remarks.trim() === '') {
    ElMessage.warning('请输入申请备注')
    return
  }
  
  const adjustedRows = []
  
  // 批量更新选中行的数据（在全局数据中更新，而不仅仅是当前页）
  allTableData.value.forEach(item => {
    const isSelected = selected.value.some(sel => 
      (sel.oid && sel.oid === item.oid) || 
      (sel.po_no && sel.po_no === item.po_no)
    )
    
    if (isSelected) {
      item.bc_plandate = applyDate.value                 // 设置申请查货日期
      item.bc_planremark = form.value.remarks || ''      // 设置申请备注
      
      const inputQty = parseInt(form.value.checkqty) || 0
      const maxQty = parseInt(item.po_qty) || 0
      
      if (inputQty > maxQty) {     // 检查申请件数是否超过合同数量，如果超过则自动调整为合同数量
        item.bc_checkqty = maxQty 
        adjustedRows.push({ po_no: item.po_no, maxQty })
      } else {
        item.bc_checkqty = inputQty
      }
    }
  })
  
  // 更新当前页数据以反映变化
  updateCurrentPageData()
  
  ElMessage.success(`已更新 ${selected.value.length} 条记录`)
}

// 删除功能
async function fn_delete() {
  if (selected.value.length === 0) {        // 检查是否选择了要删除的记录
    ElMessage.warning('请选择要删除的记录')
    return
  }
  try {
    await ElMessageBox.confirm(        // 弹出确认删除对话框
      `确定要删除选中的 ${selected.value.length} 条记录吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const deletePromises = selected.value.map(item => {    // 删除选中的记录
      const params = {
        po_no: item.po_no,
        bc_seq: item.bc_seq || 1,
        bc_num: item.bc_num || 1
      }
      return fnDeleteLicCheckSqDetail(params)
    })

    const results = await Promise.allSettled(deletePromises)    // 等待所有删除操作完成
    
    const successCount = results.filter(result => result.status === 'fulfilled').length
    const failCount = results.filter(result => result.status === 'rejected').length

    if (successCount > 0) {
      ElMessage.success(`成功删除 ${successCount} 条记录`)
      if (failCount > 0) {
        ElMessage.warning(`${failCount} 条记录删除失败`)
      }
      // 从前端表格中移除已删除的行（从全局数据中移除）
      const deletedIds = selected.value.map(item => item.oid || item.po_no)
      allTableData.value = allTableData.value.filter(item => 
        !deletedIds.includes(item.oid || item.po_no)
      )
      
      // 更新总记录数
      pagination.value.total = allTableData.value.length
      
      // 检查当前页是否还有数据，如果没有则回到上一页
      const maxPage = Math.ceil(pagination.value.total / pagination.value.pageSize)
      if (pagination.value.current > maxPage && maxPage > 0) {
        pagination.value.current = maxPage
      }
      
      // 更新当前页数据
      updateCurrentPageData()
      
      // 清空全局选择
      globalSelectedRows.value = []
      selected.value = []      // 清空选择
      
      // 如果删除后没有数据了，重置存档状态
      if (allTableData.value.length === 0) {
        isSaved.value = false
      }
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

async function fn_savedate() {
  const emptyItems = []
  
  // 检查全局数据而不是仅当前页数据
  allTableData.value.forEach(item => {
    if (!item.bc_plandate || !item.bc_checkqty) {
      emptyItems.push(item.po_no || '未知合同')
    }
  })
  

  
  fn_add()
}

function fn_add() {
  const licTypeValue = Array.isArray(props.licType) ? props.licType[0] || '0' : props.licType || '0'    // 获取联营类型值
  
  // 构造要保存的数据（使用全局数据而不是仅当前页）
  const addData = allTableData.value.map(item => ({
    po_no: item.po_no,
    bc_seq: item.bc_seq || 1,
    bc_checkqty: item.bc_checkqty,
    bc_plandate: item.bc_plandate,
    bc_planremark: item.bc_planremark || '',
    bc_ttlcheckqty: item.bc_checkqty,
    bc_ttlcheckqty2: 0,
    is_sqsorlys: licTypeValue,
    // 添加印花款相关数据
    applyNo: item.applyNo || '',
    picItemcode: item.picItemcode || null,
    lic_type: licTypeValue  // 确保lic_type字段存在
  }))
  saveData(addData)    // 调用保存API
}

async function saveData(dataList) {         // 保存数据到后端的异步函数
  try {
    const params = { dataList }
    const response = await fnSaveNewLicCheckSqDetail(params)
    
    if (response?.data?.success) {
      ElMessage.success(response.data.message || '保存成功')
      isSaved.value = true  // 设置已存档状态
      setTimeout(async () => {       // 保存成功后等待一段时间再刷新表格数据，确保数据库事务完成
        await refreshTableData()
      }, 500)  
      // 不关闭弹窗，让用户继续操作
    } else {
      ElMessage.error(response?.data?.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败: ' + (error?.message || '未知错误'))
  }
}

async function refreshTableData() {
  try {
    tableLoading.value = true
    const { selectedList, licTypeValue } = getDataParams()
    const uniquePoList = getUniquePoList(selectedList)

    if (uniquePoList.length === 0) {
      console.warn('未获取到选中的合同号，无法刷新数据')
      return
    }

    const params = {
      sq_poqtylist: uniquePoList.join(','),
      is_sqsorlys: licTypeValue
    }
    
    console.log('刷新表格数据请求参数:', params)
    const response = await fnGetlicCheckSqDetail(params)
    
    if (response?.data?.Examples && Array.isArray(response.data.Examples)) {
      // 更新全局数据
      allTableData.value = [...response.data.Examples]
      pagination.value.total = allTableData.value.length
      
      // 重置到第一页
      pagination.value.current = 1
      
      // 更新当前页数据
      updateCurrentPageData()
      
      console.log('表格数据刷新成功，获取到', allTableData.value.length, '条记录')
      ElMessage.success('数据已刷新')
    } else {
      console.warn('刷新数据返回格式不正确:', response)
      ElMessage.warning('数据刷新异常')
    }
  } catch (error) {
    console.error('刷新表格数据失败:', error)
    ElMessage.error('数据刷新失败')
  } finally {
    tableLoading.value = false
  }
}

function handlePicItemCodeBtn() {    // 处理印花款按钮点击事件
  if (selected.value.length === 0) {
    ElMessage.warning('请先选择合同')
    return
  }
  
  // 获取第一个选中合同的合同号用于获取印花款数据
  const firstSelected = selected.value[0]
  const poNo = firstSelected.po_no || firstSelected.poNo || ''
  
  if (!poNo) {
    ElMessage.error('无法获取合同号')
    return
  }
  
  openModal.value = true
  loadPicItemCodeData(poNo)
}

// 获取印花款数据的函数
async function loadPicItemCodeData(poNo) {
  try {
    // 调用API获取印花款数据
    const response = await getPicItemCodeData({ po_no: poNo })
    if (response?.data?.Examples) {
      picItemCodeTable.value = response.data.Examples
    } else {
      picItemCodeTable.value = []
    }
    console.log('获取印花款数据成功，合同号:', poNo, '数量:', picItemCodeTable.value.length)
  } catch (error) {
    console.error('获取印花款数据失败:', error)
    ElMessage.error('获取印花款数据失败')
    // 设置空数据避免界面异常
    picItemCodeTable.value = []
  }
}

function confirmPicItemcode() {
  // 将选中的印花款数据保存到相应的表格行
  if (picItemCodeSelected.value.length > 0 && selected.value.length > 0) {
    const selectedPicItems = picItemCodeSelected.value.map(item => ({
      picItemcode: item.picItemcode
    }))
    
    // 更新所有选中行的印花款数据
    const selectedKeys = new Set(selected.value.map(getRowKey))
    allTableData.value.forEach(item => {
      const key = getRowKey(item)
      if (selectedKeys.has(key)) {
        item.picItemcode = JSON.stringify(selectedPicItems)
      }
    })
    
    // 更新当前页数据
    updateCurrentPageData()
    
    ElMessage.success(`已为 ${selected.value.length} 个合同设置印花款`)
  }
  
  openModal.value = false
}

// 显示印花款信息的辅助函数
function getPicItemcodeDisplay(picItemcodeStr) {
  if (!picItemcodeStr || picItemcodeStr === 'null') {
    return '未设置'
  }
  
  try {
    const picItems = JSON.parse(picItemcodeStr)
    if (Array.isArray(picItems) && picItems.length > 0) {
      const codes = picItems.map(item => item.picItemcode).filter(Boolean)
      return codes.length > 0 ? codes.join(', ') : '未设置'
    }
  } catch (e) {
    console.error('解析印花款数据失败:', e)
  }
  
  return '未设置'
}

function closePicItemCodeModal() {
  openModal.value = false
  picItemCodeSelected.value = []
  picItemCodeTable.value = []
}

// 清空已选合同
function clearSelectedRows() {
  globalSelectedRows.value = [];
  selected.value = [];
  // 清除表格勾选
  if (tableRef.value && tableRef.value.clearSelection) {
    tableRef.value.clearSelection();
  }
}

function getPicUrl(fileId) {
  // 默认内部图片
  return `https://iretail.gsitcloud.com/esp/sys/file/downloadImageAnonymous?fileId=${fileId}&thumbnail=false`;
}

</script>

<style lang="scss" scoped>
.content {
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #FFFFFF;
  .table {
    margin: 20px 0;
  }
}

.selection-summary {
  margin-bottom: 20px;
  
  .summary-card {
    border: 1px solid #E4E7ED;
    
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .summary-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
      
      .summary-count {
        font-size: 14px;
        color: #909399;
        background-color: #F5F7FA;
        padding: 4px 12px;
        border-radius: 12px;
      }
    }
    
    .summary-content {
      padding: 16px 0;
      
      .summary-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        label {
          font-weight: 500;
          color: #606266;
          min-width: 80px;
          margin-right: 8px;
        }
        
        span {
          color: #303133;
          word-break: break-all;
        }
      }
    }
  }
}
.formSearch :deep(.el-input__wrapper),
.formSearch :deep(.el-date-editor) {
  height: 40px;
  box-sizing: border-box;
  align-items: center;
}

.uploadDialog {
  :deep(.el-upload__tip) {
    display: inline-block;
    width: 360px;
    margin: auto;
  }
}
</style>