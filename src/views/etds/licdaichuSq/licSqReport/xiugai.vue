  <!-- 黄浩萌修改于2025/8/27 - 添加存档功能、数据刷新功能 -->
 <template>
    <div class="content">
      <div class="formSearch" style="display: flex; align-items: center; gap: 28px;">
        <el-button type="primary" @click="fn_saveupdate">存档</el-button>
        <el-button type="primary" @click="fn_delete">删除</el-button>
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
          <el-button @click="closePicItemCodeModal" style="margin-left: 10px;">关闭</el-button>   <!-- 关闭弹窗按钮 -->
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
          <el-table-column type="selection" width="55" />    <!-- 选择列 -->
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
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="po_no"
            align="center"
            label="合同号"
            min-width="120"
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
        </el-table>
        <!-- 已选择合同数量显示 - 表格左下角 -->
        <div style="margin: 10px 0; text-align: left; font-size: 14px;">
          已选择 <span style="color: #1890ff; font-weight: bold;">{{ selected.length }}</span> 个合同
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fnCheckPortStatus, fnGetlicCheckSqDetail, fnGetlicCheckSqDetailNew, fnSaveNewLicCheckSqDetail, fnDeleteLicCheckSqDetail, fnUpdateLicCheckSqDetail, getPicItemCodeData, fnGetlicCheckSq_ly  } from '../index.js'
  
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
  
  const emit = defineEmits(['close', 'openAdd'])
  

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
  const table = ref([])                                        // 主表格数据
  const selected = ref([])                                     // 选中的行数据
  const isSaved = ref(false)                                   // 是否已存档状态
  const form = ref({
    checkqty: '',                                              // 查货件数
    remarks: ''                                                // 申请备注
  })
  
  /**
   * 计算属性：是否显示印花款按钮
   * 黄浩萌修改于2025/8/27
   * 功能：根据选中行的联营类型判断是否显示印花款按钮
   */
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
  
  /**
   * 计算属性：是否有有效数据可以保存
   * 黄浩萌修改于2025/8/27
   * 功能：检查表格中是否有有效的申请日期和件数数据
   */
  const hasValidData = computed(() => {
    const hasData = table.value.some(item => 
      item.bc_plandate && item.bc_plandate !== '' && 
      item.bc_checkqty !== undefined && item.bc_checkqty !== null && item.bc_checkqty > 0
    )
    return hasData
  })
  
  /**
   * 通用函数：获取数据参数
   * 黄浩萌修改于2025/8/27
   * 功能：从props或sessionStorage中获取选中的行数据和联营类型
   */
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
  
  /**
   * 通用函数：获取唯一合同号列表
   * 黄浩萌修改于2025/8/27
   * 功能：从选中的行数据中提取唯一的合同号列表，支持不同字段名兼容
   */
  function getUniquePoList(selectedList) {
    const poListArr = selectedList
      .map(row => (row.poNo || row.po_no || '').toString().trim())    // 兼容不同字段名
      .filter(Boolean)
    return Array.from(new Set(poListArr))     // 去重
  }
  
  /**
   * 组件挂载时加载表格数据
   * 黄浩萌修改于2025/8/27
   */
  onMounted(() => {     // 组件挂载时加载表格数据
    loadTableData()
  })
  
  /**
   * 监听props变化，重新加载数据
   * 黄浩萌修改于2025/8/27
   * 功能：当选中的行数据或联营类型发生变化时，重新加载表格数据
   */
  watch(() => [props.selectedRows, props.licType], () => {
    if (props.selectedRows && props.selectedRows.length > 0) {
      loadTableData()
    }
  }, { deep: true })
  
  
  /**
   * 加载表格数据
   * 黄浩萌修改于2025/8/27
   * 功能：根据选中的合同号加载查货申请详情数据到表格中
   */
  async function loadTableData() {      // 加载表格数据的异步函数
    tableLoading.value = true
    
    try {
      const { selectedList, licTypeValue } = getDataParams()
      const uniquePoList = getUniquePoList(selectedList)
  
      if (uniquePoList.length === 0) {         // 检查是否有选中的合同号
        table.value = []
        tableOptions.value.total = 0
        ElMessage.warning('未获取到选中的合同号，无法加载数据')
        return
      }
  
      const params = {         // 构造请求参数
        polist: "'" + uniquePoList.join("','") + "'",
        sq_poqtylist: uniquePoList.join(','),
        is_sqsorlys: licTypeValue
      }
      
      const response = await fnGetlicCheckSqDetail(params)        // 调用API获取表格数据
      
      if (response?.data?.Examples && Array.isArray(response.data.Examples) && response.data.Examples.length > 0) {     // 处理响应数据
        table.value = [...response.data.Examples]
        tableOptions.value.total = table.value.length
      } else {
        table.value = []
        tableOptions.value.total = 0
        // 显示确认弹窗询问是否新增
        try {
          await ElMessageBox.confirm(
            '暂无数据，是否新增？',
            '提示',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'info',
            }
          )
          // 用户点击"是"，跳转到新增页面
          handleAddNew()
        } catch (confirmError) {
          // 用户点击"否"或关闭弹窗
          if (confirmError !== 'cancel') {
            ElMessage.info('用户取消操作')
          }
        }
      }
    // 重置选中项和表单数据
      selected.value = []
      form.value.checkqty = ''
      form.value.remarks = ''
      isSaved.value = false  // 重置存档状态
      
    } catch (error) {
      ElMessage.error('获取数据失败')
      table.value = []
      tableOptions.value.total = 0
    } finally {
      tableLoading.value = false
    }
  }
  
  /**
   * 处理表格行选择变化
   * 黄浩萌修改于2025/8/27
   * 功能：当用户选择或取消选择表格行时，自动计算并填充申请件数
   * 
   * 自动填充申请日期和申请备注功能
   * 功能：用户勾选查货记录时，自动填充申请日期和申请备注到输入框
   * 规则：若选择多条记录，以最后一条勾选的记录为准
   * 时间：2025.09.04
   * 作者：黄浩萌
   */
  function handleSelectionChange(selection) {
    selected.value = selection
     // 如果选中了行，自动填充申请件数为选中行合同数量的总和
    if (selection.length > 0) {
      const totalQty = selection.reduce((sum, item) => {
        return sum + (parseInt(item.po_qty) || 0)
      }, 0)
      form.value.checkqty = totalQty.toString()
      
      // 自动填充申请日期和申请备注 - 以最后一条勾选的记录为准
      const lastSelectedItem = selection[selection.length - 1]
      if (lastSelectedItem) {
        // 填充申请日期
        if (lastSelectedItem.bc_plandate) {
          applyDate.value = lastSelectedItem.bc_plandate
        }
        // 填充申请备注
        if (lastSelectedItem.bc_planremark) {
          form.value.remarks = lastSelectedItem.bc_planremark
        }
      }
    } else {      // 如果没有选中任何行，清空申请件数、申请日期和申请备注
      form.value.checkqty = ''
      applyDate.value = ''
      form.value.remarks = ''
    }
  }
  /**
   * 更新选中行数据功能
   * 黄浩萌修改于2025/8/27
   * 功能：将用户输入的申请日期、件数、备注等信息更新到选中的表格行中
   */
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
    
    let hasAdjusted = false
    const adjustedRows = []
    
    // 批量更新选中行的数据
    table.value.forEach(item => {
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
          hasAdjusted = true
          adjustedRows.push({ po_no: item.po_no, maxQty })
        } else {
          item.bc_checkqty = inputQty
        }
      }
    })
    ElMessage.success(`已更新 ${selected.value.length} 条记录`)
  }
  
  /**
   * 删除功能
   * 黄浩萌修改于2025/8/27
   * 功能：删除选中的查货申请记录，支持批量删除
   */
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
        // 从前端表格中移除已删除的行
        const deletedIds = selected.value.map(item => item.oid || item.po_no)
        table.value = table.value.filter(item => 
          !deletedIds.includes(item.oid || item.po_no)
        )
        tableOptions.value.total = table.value.length
        selected.value = []      // 清空选择
        
        // 如果删除后没有数据了，重置存档状态
        if (table.value.length === 0) {
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
  
  
  
  /**
   * 处理印花款按钮点击事件
   * 黄浩萌修改于2025/8/27
   * 功能：打开印花款选择弹窗
   */
  function handlePicItemCodeBtn() {    // 处理印花款按钮点击事件
    openModal.value = true
    // getPicItemCodeData() // 这里应调用实际API
  }
  
  /**
   * 确认印花款选择
   * 黄浩萌修改于2025/8/27
   * 功能：确认用户选择的印花款并关闭弹窗
   */
  function confirmPicItemcode() {
    // 这里可加校验和赋值逻辑
    openModal.value = false
  }
  
  /**
   * 关闭印花款选择弹窗
   * 黄浩萌修改于2025/8/27
   * 功能：关闭印花款选择弹窗并清空选择数据
   */
  function closePicItemCodeModal() {
    openModal.value = false
    picItemCodeSelected.value = []
    picItemCodeTable.value = []
  }
  
  /**
   * 获取图片URL
   * 黄浩萌修改于2025/8/27
   * 功能：根据文件ID生成图片访问URL
   */
  function getPicUrl(fileId) {        // 获取图片URL的函数
    return `https://iretail.gsitcloud.com/esp/sys/file/downloadImageAnonymous?fileId=${fileId}&thumbnail=false`
  }
  

  

  
  /**
   * 刷新表格数据
   * 黄浩萌修改于2025/8/27
   * 功能：重新加载表格数据，用于存档后刷新显示最新数据
   */
  async function refreshTableData() {
    try {
      tableLoading.value = true
      const { selectedList, licTypeValue } = getDataParams()
      const uniquePoList = getUniquePoList(selectedList)
  
      if (uniquePoList.length === 0) {
        return
      }
  
      const params = {
        sq_poqtylist: uniquePoList.join(','),
        is_sqsorlys: licTypeValue
      }
      
      const response = await fnGetlicCheckSqDetail(params)
      
      if (response?.data?.Examples && Array.isArray(response.data.Examples)) {
        table.value = [...response.data.Examples]
        tableOptions.value.total = table.value.length
        ElMessage.success('数据已刷新')
      } else {
        ElMessage.warning('数据刷新异常')
      }
    } catch (error) {
      ElMessage.error('数据刷新失败')
    } finally {
      tableLoading.value = false
    }
  }
  
  /**
   * 处理新增功能
   * 黄浩萌修改于2025/8/27
   * 功能：当用户确认新增时，跳转到新增页面
   */
  function handleAddNew() {
    // 获取当前选中的行数据和联营类型
    const { selectedList, licTypeValue } = getDataParams()
    
    // 将选中的行数据存储到 sessionStorage，以便新增页面使用
    sessionStorage.setItem('selectedRows', JSON.stringify(selectedList))
    sessionStorage.setItem('currentLicType', JSON.stringify(licTypeValue))
    
    // 关闭当前修改弹窗
    emit('close')
    
    // 触发父组件打开新增弹窗
    emit('openAdd', {
      selectedRows: selectedList,
      licType: licTypeValue
    })
    
    ElMessage.success('正在跳转到新增页面...')
  }
  
  /**
   * 存档功能 - 保存修改后的数据到后端
   * 黄浩萌修改于2025/8/27
   * 功能：将用户修改的查货申请数据保存到数据库，包括申请日期、件数、备注等信息
   */
  async function fn_saveupdate() {
    // 检查是否有数据需要保存
    const validRows = table.value.filter(item => 
      item.bc_plandate && item.bc_plandate !== '' && 
      item.bc_checkqty !== undefined && item.bc_checkqty !== null && item.bc_checkqty > 0
    )
    
    if (validRows.length === 0) {
      ElMessage.warning('没有可保存的数据，请先使用"确认"按钮更新数据')
      return
    }
   
    try {
      // 批量更新数据
      const updatePromises = validRows.map(item => {
        const params = {
          po_no: item.po_no,
          bc_seq: item.bc_seq || 1,
          bc_num: item.bc_num || 1,
          bc_plandate: item.bc_plandate,
          bc_planremark: item.bc_planremark || '',
          bc_checkqty: item.bc_checkqty,
          confirm_state: 0,  // 设置为已申请状态
          confirm_state2: item.confirm_state || 0  // 当前状态
        }
        return fnUpdateLicCheckSqDetail(params)
      })
      
      const results = await Promise.allSettled(updatePromises)
      
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value?.data?.success
      ).length
      
      const failCount = results.length - successCount
      
      if (successCount > 0) {
        ElMessage.success(`成功更新 ${successCount} 条记录`)
        if (failCount > 0) {
          ElMessage.warning(`${failCount} 条记录更新失败`)
        }
        isSaved.value = true  // 设置已存档状态
        
        // 刷新表格数据
        setTimeout(async () => {
          await refreshTableData()
        }, 500)
      } else {
        ElMessage.error('更新失败')
      }
    } catch (error) {
      ElMessage.error('更新数据失败: ' + (error?.message || '未知错误'))
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .content {
    padding: 20px;
    margin-top: 0;
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
  </style>