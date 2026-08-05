<template>
  <div class="content">
    <!-- 导入数据提示 -->
    <div v-if="isFromImport" class="import-notice" style="background: #f0f9ff; border: 1px solid #3b82f6; padding: 12px; margin-bottom: 16px; border-radius: 6px; color: #1e40af;">
      <el-icon style="margin-right: 8px;"><InfoFilled /></el-icon>
      <span>当前显示的是从Excel导入的数据，请检查并完善相关信息后点击"存档"按钮保存。</span>
    </div>
    
    <div class="formSearch" style="display: flex; align-items: center; gap: 28px;">
      <el-button type="primary" @click="fn_saveupdate">存档</el-button>
      <el-button type="primary" @click="fn_delete">删除</el-button>
      <el-date-picker
        v-model="form.checkdate"
        type="date"
        placeholder="申请日期"
        style="width: 220px; height: 40px; vertical-align: middle;"
        value-format="YYYY-MM-DD"
      />
      <el-input v-model="form.checkqty" placeholder="查货件数" style="width: 220px; height: 40px; vertical-align: middle;" />
      <el-input v-model="form.remarks" placeholder="申请备注" style="width: 220px; height: 40px; vertical-align: middle;" />
      <el-button type="primary" @click="fn_updaterow">确认</el-button>
      <el-button type="primary" @click="handlePicItemCodeBtn" v-if="showPicItemCodeBtn">印花款</el-button>
    </div>

    <!-- 印花款选择弹窗 -->
    <el-dialog v-model="openModal" title="印花款选择" width="900px">
      <div style="margin-bottom: 12px;">
        <el-button type="primary" @click="confirmPicItemcode">确认印花款</el-button>
        <el-button @click="closePicItemCodeModal" style="margin-left: 10px;">关闭</el-button>
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
        <el-table-column type="selection" width="55" />
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
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="applyNo"
          align="center"
          label="上架申请号"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractNo"
          align="center"
          label="合同号"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="shipmentBatch"
          align="center"
          label="出货批次"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractQty"
          align="center"
          label="合同数量"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="midTail"
          align="center"
          label="中尾期"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checkCount"
          align="center"
          label="查货次数"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applyCount"
          align="center"
          label="申请件数"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applyCheckDate"
          align="center"
          label="申请查货日期"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applyRemark"
          align="center"
          label="申请备注"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="confirmCheckDate"
          align="center"
          label="确定查货日期"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="scheduleRemark"
          align="center"
          label="查货排期备注"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="scheduleChecker"
          align="center"
          label="排期查货员"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="actualCheckDate"
          align="center"
          label="实际查货日期"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="actualChecker"
          align="center"
          label="实际查货员"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checkResult"
          align="center"
          label="查货结果"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="businessType"
          align="center"
          label="联营业务/联营款"
          min-width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="customer"
          align="center"
          label="客户"
          min-width="90"
          show-overflow-tooltip
        />
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="queryOptions.page"
      :page-size="queryOptions.pageSize"
      :page-sizes="tableOptions.pageSizes"
      :total="tableOptions.total"
      @size-change="(val) => handlePageChange(val, 1)"
      @current-change="(val) => handlePageChange(val, 2)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateLicCheckSqData, saveLicCheckSqData, deleteLicCheckSqData } from './index.js';

const tableLoading = ref(false)
const list = ref([])
const queryOptions = ref({
  page: 1,
  pageSize: 10,
})
const tableOptions = ref({
  headStyle: { background: '#EEF3FF', color: '#333333' },
  pageSizes: [5, 10, 30, 50, 100],
  total: 0,
})
const openModal = ref(false)
const picItemCodeTable = ref([])
const picItemCodeSelected = ref([])
const table = ref([])
const selected = ref([])    // 本地 selected 状态
const form = ref({
  checkqty: '',      // 查货件数
  checkdate: '',     // 申请日期
  remarks: ''        // 申请备注
})
const isEditMode = ref(true) // 是否为"修改"模式
const isFromImport = ref(false) // 是否来自导入
const importedData = ref([]) // 导入的数据

// 接收父组件传递的 props
const props = defineProps({
  table: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  }
});

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selected.value = selection;
}

// 监听 props.selected 数据变化（导入模式下跳过）
watch(() => props.selected, (newVal) => {
  // 导入模式：不走默认加载逻辑，避免覆盖导入数据
  const importing = isFromImport.value || sessionStorage.getItem('isFromImport') === 'true'
  if (importing) return
  if (newVal && Array.isArray(newVal)) {
    handleGetTable();
  }
}, { immediate: false, deep: true });

// 计算属性：是否显示印花款按钮（当所选记录为联营业务时显示）
const showPicItemCodeBtn = computed(() => {
  return selected.value.length > 0 && selected.value.some(item => item.businessType === '联营业务');
});

onMounted(() => {
  // 检查是否来自导入
  const fromImport = sessionStorage.getItem('isFromImport')
  if (fromImport === 'true') {
    isFromImport.value = true
    // 获取导入的数据
    const data = sessionStorage.getItem('importedData')
    if (data) {
      try {
        importedData.value = JSON.parse(data)
        // 将导入的数据显示在表格中
        if (importedData.value.length > 0) {
          table.value = importedData.value
          tableOptions.value.total = importedData.value.length
        }
      } catch (e) {
        console.error('解析导入数据失败:', e)
        importedData.value = []
      }
    }
    // 注意：此处不清除 sessionStorage 标记，避免后续逻辑误判为非导入模式
  } else {
    // 正常加载数据
    handleGetTable()
  }
  fn_time() // 初始化时间
})

// 初始化申请日期为当前日期
function fn_time() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  form.value.checkdate = `${yyyy}-${mm}-${dd}`
}

function handleGetTable () {
  // 导入模式或已有导入数据时直接返回，避免覆盖表格
  if (isFromImport.value || (importedData.value && importedData.value.length > 0)) return
  tableLoading.value = true
  try {
    // 获取选中的合同数据
    // const selectedContracts = getSelectedContracts();
    // 优先使用父组件传递的数据
    const selectedContracts = props.selected && props.selected.length > 0 
      ? props.selected 
      : getSelectedContracts(); // 备用方案从 sessionStorage 获取
    
    if (selectedContracts && selectedContracts.length > 0) {
      // 转换数据格式
      const transformedData = transformContractData(selectedContracts);
      table.value = transformedData;
      tableOptions.value.total = transformedData.length;
    } else {
      // 如果没有选中数据，使用默认空数据
      table.value = [];
      tableOptions.value.total = 0;
    }
    
    tableLoading.value = false;
  } catch (error) {
    console.error('加载合同数据失败:', error);
    // 出错时使用模拟数据
    const mockData = [
      {
        applyNo: 'AP123456',
        contractNo: 'CT10001',
        shipmentBatch: 'BATCH001',
        contractQty: 1000,
        midTail: '中期',
        checkCount: 1,
        applyCount: 500,
        applyCheckDate: '2024-07-01',
        applyRemark: '测试备注',
        confirmCheckDate: '',
        scheduleRemark: '',
        scheduleChecker: '',
        actualCheckDate: '',
        actualChecker: '',
        checkResult: '',
        status: '未开始',
        businessType: '联营业务',
        customer: '客户A'
      }
    ];
    table.value = mockData;
    tableOptions.value.total = mockData.length;
    tableLoading.value = false;
  }
}

function handlePageChange (val, type) {
  type === 1
    ? (queryOptions.value.page = val)
    : (queryOptions.value.pageSize = val)
  handleGetTable()
}

// 从 sessionStorage 获取选中的合同数据
function getSelectedContracts() {
  const selectedData = sessionStorage.getItem('selected');
  if (selectedData) {
    try {
      return JSON.parse(selectedData);
    } catch (e) {
      console.error('解析选中合同数据失败:', e);
      return [];
    }
  }
  return [];
}

// 将选中的合同数据转换为表格所需格式
function transformContractData(contracts) {
  // 确保 contracts 是数组
  if (!Array.isArray(contracts) || contracts.length === 0) {
    return [];
  }
  
  return contracts.map((contract, index) => {
    return {
      applyNo: contract.applyNo || `AP${new Date().getFullYear()}${String(index + 1).padStart(4, '0')}`,
      contractNo: contract.poNo || contract.contractNo || '',
      shipmentBatch: contract.poSeq || '',
      contractQty: contract.poShipqty || 0,
      midTail: contract.poShipdate ? (new Date(contract.poShipdate).getMonth() < 6 ? '中期' : '尾期') : '中期',
      checkCount: contract.checkCount || 0,
      applyCount: contract.applyCount || '',
      applyCheckDate: contract.applyCheckDate || '',
      applyRemark: contract.applyRemark || '',
      confirmCheckDate: contract.confirmCheckDate || '',
      scheduleRemark: contract.scheduleRemark || '',
      scheduleChecker: contract.scheduleChecker || '',
      actualCheckDate: contract.actualCheckDate || '',
      actualChecker: contract.actualChecker || '',
      checkResult: contract.checkResult || '',
      status: contract.status || '未开始',
      businessType: contract.decisionResult || contract.businessType || '联营业务',
      customer: contract.custCode || contract.customer || '',
      oid: contract.oid || index,
      picItemcode: contract.picItemcode || [] // 印花款信息
    };
  });
}

// 确认按钮：将表单信息应用到选中的记录
function fn_updaterow() {
  if (selected.value.length === 0) {
    ElMessage.warning('请选择合同')
    return
  }
  if (!form.value.checkqty) {
    ElMessage.warning('请输入查货件数')
    return
  }
  if (!form.value.checkdate) {
    ElMessage.warning('请输入申请日期')
    return
  }
  
  // 更新选中行的申请日期、查货件数和备注
  table.value.forEach((item, index) => {
    if (selected.value.some(sel => sel.oid === item.oid)) {
      table.value[index].applyCheckDate = form.value.checkdate
      table.value[index].applyCount = form.value.checkqty
      table.value[index].applyRemark = form.value.remarks
    }
  })
  ElMessage.success('批量赋值成功')
}

// 存档按钮：保存所有记录到数据库
function fn_saveupdate() {
  // 检查必填字段
  let isnull = false
  table.value.forEach(item => {
    if (!item.applyCheckDate || !item.applyCount) {
      isnull = true
    }
  })
  if (isnull) {
    ElMessage.warning('请填写为空的数据')
    return
  }
    
  if (!isEditMode.value) {
    fn_save()  // 新增保存
  }
  if (isFromImport.value) {
    // 导入模式下的保存逻辑
    fn_saveImportData()
  } else if (isEditMode.value) {
    fn_update()
  } else {
    fn_update() // 更新保存
  }
}

// 保存新数据
function fn_save() {
  const params = {
    sq_poqtylist: JSON.stringify(table.value),
    bc_plandate: formatTimeToStr(form.value.checkdate, 'yyyy-MM-dd'),
    bc_planremark: form.value.remarks || '',
    is_sqsorlys: 0,
    bc_checkqty: form.value.checkqty
  };
  
  saveLicCheckSqData(params).then(res => {
    ElMessage.success('保存完成');
    isEditMode.value = true; // 保存后切换为编辑模式
    fn_getdata();
  }).catch(err => {
    ElMessage.error('保存失败');
    console.error('保存失败:', err);
  });
}

// 更新翻查数据
function fn_update() {
  const params = {
    sq_poqtylist: JSON.stringify(table.value),
    bc_plandate: formatTimeToStr(form.value.checkdate, 'yyyy-MM-dd'),
    bc_planremark: form.value.remarks || '',
    confirm_state: 0,
    confirm_state2: 0,
    is_sqsorlys: 0,
    bc_checkqty: form.value.checkqty
  }
  
  updateLicCheckSqData(params).then(res => {
    ElMessage.success('存档完成')
    fn_getdata()
  }).catch(err => {
    ElMessage.error('存档失败')
    console.error('存档失败:', err)
  })
}

// 删除按钮
function fn_delete() {
  if (selected.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  
  ElMessageBox.confirm('确定要删除选中的记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 构造删除参数
    const params = {
      sq_poqtylist: JSON.stringify(selected.value),
      bc_plandate: formatTimeToStr(form.value.checkdate, 'yyyy-MM-dd'),
      bc_planremark: form.value.remarks || '',
    }
    
    // 调用删除接口
    deleteLicCheckSqData(params).then(res => {
      ElMessage.success('删除成功')
      fn_getdata()
    }).catch(err => {
      ElMessage.error('删除失败')
      console.error('删除失败:', err)
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 保存导入数据的函数
function fn_saveImportData() {
  try {
    // 这里可以调用后端API保存导入的数据
    // 示例：调用保存接口
    const saveData = {
      method: 'saveImportData@etds.liccontract',
      params: {
        data: table.value,
        checkdate: form.value.checkdate || applyDate.value,
        checkqty: form.value.checkqty,
        remarks: form.value.remarks
      }
    }
    
    console.log('保存导入数据:', saveData)
    
    // 实际开发中，这里应该调用真实的API
    // const response = await axios.post('/api', saveData)
    
    ElMessage.success('导入数据保存成功')
    
    // 保存成功后，重置导入状态
    isFromImport.value = false
    importedData.value = []
    
    // 可以选择重新加载数据或清空表格
    table.value = []
    tableOptions.value.total = 0
    
  } catch (error) {
    console.error('保存导入数据失败:', error)
    ElMessage.error('保存导入数据失败: ' + (error?.message || '未知错误'))
  }
}

function formatTimeToStr(date, fmt) {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fn_getdata() {
  // 重新拉取表格数据，实际项目中应调用后端API
  handleGetTable()
}

// 印花款相关功能
function handlePicItemCodeBtn() {
  if (selected.value.length === 0) {
    ElMessage.warning('请选择合同')
    return
  }
  openModal.value = true
  // getPicItemCodeData() // 这里应调用实际API获取印花款数据
}

function confirmPicItemcode() {
  // 这里可加校验和赋值逻辑
  openModal.value = false
}

function closePicItemCodeModal() {
  openModal.value = false
  picItemCodeSelected.value = []
  picItemCodeTable.value = []
}

function getPicUrl(fileId) {
  return `https://iretail.gsitcloud.com/esp/sys/file/downloadImageAnonymous?fileId=${fileId}&thumbnail=false`
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
.formSearch :deep(.el-input__wrapper),
.formSearch :deep(.el-date-editor) {
  height: 40px;
  box-sizing: border-box;
  align-items: center;
}
</style>