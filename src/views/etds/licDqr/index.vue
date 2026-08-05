


<template> <!-- 模板开始 -->
  <div class="page-bg"> <!-- 页面背景容器 -->
    <el-card class="main-card" shadow="never"> <!-- 主卡片容器 -->
      <!-- 顶部按钮区 -->
      <div class="table-footer" style="margin-bottom: 16px;">
        <el-button type="primary" class="custom-button" @click="getData">查询</el-button>
        <el-button type="primary" class="custom-button" @click="clear">重置</el-button>
        <el-button type="primary" class="custom-button" @click="handleBatchConfirm">批量联营业务/联营款确认</el-button>
        <!--<el-button type="primary" class="custom-button" @click="fn_check2">确认</el-button>
        <el-button type="primary" class="custom-button" @click="fn_check">查看查货资料</el-button>-->
        
      </div>
      <!-- 查询区 - 整合日期和合同号查询 -->
      <el-form :inline="true" :model="form" class="search-panel">
        <!-- 合同号输入框 -->
        <el-form-item label="合同号">
          <el-input v-model="form.po_no" placeholder="请输入合同号(模糊查询)" clearable />
        </el-form-item>
        <!-- 查货日期范围选择器 -->
        <el-form-item label="查货日期">
          <el-date-picker 
            v-model="form.dateRange" 
            type="daterange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期" 
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <el-table
        :data="table"
        style="width: 100%; margin-top: 16px;"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="applyNo" label="上架申请号" sortable="true" align="left" />
        <el-table-column prop="check_typenam" label="查货类型" ali sortable="true" gn="left" />
        <el-table-column prop="po_no" label="合同号"  sortable="true" align="left" />
        <el-table-column prop="po_state" label="款状态"  sortable="true" align="left" />
        <el-table-column prop="picItemcode" label="印花款号"  sortable="true" align="left" />
        <el-table-column prop="bc_seq" label="出货批次"  sortable="true" align="left" />
        <el-table-column prop="bc_qsname" label="中尾期"  sortable="true" align="left" />
        <el-table-column prop="bc_num" label="查货次数"  sortable="true" align="left" />
        <el-table-column prop="po_style" label="款号"  sortable="true" align="left" />
        <el-table-column prop="bc_checknum" label="查货数量"  sortable="true" align="left" />
        <el-table-column prop="bc_date" label="实际查货日期"  sortable="true" align="left" />
        <el-table-column prop="checker2" label="实际查货员"  sortable="true" align="left" />
        <el-table-column prop="fact_code" label="授权商"  sortable="true" align="left" />
        <el-table-column prop="attachkport_name" label="口岸"  sortable="true" align="left" />
        <el-table-column prop="lic_typename" label="联营业务/联营款"  sortable="true" align="left" />
        <el-table-column prop="cust_code" label="客户"  sortable="true" align="left" />
        <!-- 新增操作列 -->
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <div style="display: flex; justify-content: center; gap: 8px;">
              <el-button type="primary" link @click="fn_check2(scope.row)">确认</el-button>
              <el-button type="primary" link @click="fn_check(scope.row)">查看查货资料</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

            <!-- 分页区域 -->
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px;"
      />
    </el-card>

      <!-- 分页区域（如有需要可加） -->
      <!--
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.rowsPerPage"
        :total="table.length"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px;"
      />
      -->
    
    <!-- 查看查货资料弹窗 谢佩容 2025.8.25 -->
    <el-dialog
      v-model="inspectionDialogVisible"
      :title="inspectionDialogTitle"
      width="100%"
      top="0"
      class="fullscreen-dialog"
      :fullscreen="true" 
      :lock-scroll="false"
      @close="handleCloseDialog"
    >
      <div class="inspection-dialog-content">
        <!-- 弹窗内容区域 -->
        <!-- 顶部按钮区域 -->
        <div class="history">
          <el-button type="primary" @click="openReportDialog">查看报告</el-button>
        </div>
        <!-- 间距 -->
        <div style="margin-bottom: 20px;"></div>
        <!-- 主数据表格 - 使用合并后的数据 -->
        <el-table
          v-loading="listLoading"
          :data="[inspectionTableData]"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          style="width: 100%"
          class="dataTable"
        >
          <!-- 表格列定义, 查货资料详情-->
          <el-table-column prop="applyNo" label="上架申请号" />
          <el-table-column prop="picItemcode" label="印花款" />
          <el-table-column prop="po_no" label="合同号" />
          <el-table-column prop="bc_seq" label="出货批次" />
          <el-table-column prop="bc_qsname" label="中尾期" />
          <el-table-column prop="bc_num" label="查货次数" />
          <el-table-column prop="planDate" label="计划时间" />
          <el-table-column prop="po_shipdate" label="合同日期" />
          <el-table-column prop="bc_checkqty" label="申请数量" />
          <el-table-column prop="po_shipqty" label="合同数量" />
          <el-table-column prop="sconfirm" label="状态" />
          <el-table-column prop="fact_code" label="授权商" />
          <el-table-column prop="lic_typename" label="联营业务/联营款" />
        </el-table>
        <!-- 合同详情 -->
        <div class="detail-container">
          <h2 class="section-title">
            <i class="el-icon-document"></i> 详细信息
          </h2>
        <div class="detail-box">
          <div class="detail-header">
            <i class="el-icon-info"></i> 当前选中记录详细信息
          </div>  
          <div class="detail-content">
            <div class="detail-item">
              <div class="detail-label">查货类型：</div>
              <div class="detail-value">{{ inspectionDetailData.check_typenam }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">授权商：</div>
              <div class="detail-value">{{ inspectionDetailData.factName }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">品牌：</div>
              <div class="detail-value">{{ inspectionDetailData.pduName }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">客户：</div>
              <div class="detail-value">{{ inspectionDetailData.custCode }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">款号：</div>
              <div class="detail-value">
                <span class="highlight">{{ inspectionDetailData.styleNo }}</span>
                <span v-if="inspectionDetailData.iseshop" class="not-on-shelf">
                  <i class="el-icon-warning"></i> {{ inspectionDetailData.iseshop }}
                </span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">款式描述：</div>
              <div class="detail-value">{{ inspectionDetailData.styleDesc }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">合同数量：</div>
              <div class="detail-value highlight">{{ inspectionDetailData.po_shipqty }}</div>
            </div>
          </div>
        </div>
    <!-- 附件下载区域（只有在非出口查货且lic_typename为联营业务或联营款时才显示附件下载） -->
    <div v-if="currentRowData.check_typenam !== '出口查货' && 
          (currentRowData.lic_typename === '联营业务' || 
           currentRowData.lic_typename === '联营款')" 
     class="detail-box">
      <div class="detail-header">
        <el-icon><InfoFilled /></el-icon> 附件下载
      </div>
      <el-table
        v-loading="attachmentLoading"
        :data="attachmentList"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        style="width: 100%"
        class="dataTable"
      >
          <el-table-column prop="po_no" label="合同号/款号" />
          <el-table-column prop="file_name" label="文件名" />
          <el-table-column prop="file_remark" label="备注" />
          <el-table-column prop="upload_date" label="上传日期" />
      
          <!-- 下载操作列 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="downloadFile(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    </div>
    </el-dialog>

    <!-- 查看报告弹窗 -->
    <ReportDialog v-model="reportDialogVisible" :row-data="currentRowData" />
    <!-- 联营业务/联营款确认弹窗 -->
<LicqrDialog
  v-model:visible="licqrDialogVisible"
  :params="licqrDialogParams"
/>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox  } from 'element-plus'
import { getLicDqrList,updateLicDqr,getlicStaffCon,getContractDetail,getlicFileDown,checkShenKuanPic_un } from './option.js'
import { useRouter } from 'vue-router'
import ReportDialog from './ReportDialog.vue'
import LicqrDialog from './LicqrDialog.vue'

const router = useRouter()

const form = reactive({
  po_no: '',
  dateRange: [] // 使用日期范围数组 [开始日期, 结束日期]
})

const table = ref([])
const loading = ref(false)
const selected = ref([]) // 新增：存储选中项

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 查看查货资料相关变量 谢佩容 2025.8.25
const inspectionDialogVisible = ref(false)// 控制弹窗显示/隐藏
const selectedItem = ref({})// 存储选中的项
const inspectionDialogTitle = ref('查看查货资料')// 弹窗标题
const currentRowData = ref({}) // 存储当前行数据用于弹窗展示
const listLoading = ref(false) // 列表加载状态
const attachmentLoading = ref(false) // 附件加载状态
const inspectionTableData = ref({})
const inspectionDetailData = ref({})

// 附件列表
const attachmentList = ref()

// 报告弹窗相关
const reportDialogVisible = ref(false)

function handleSelectionChange(val) {
  selected.value = val
}
// 重置表单
function clear() {
  form.po_no = '';
  form.dateRange = [];
  pagination.currentPage = 1;
  getData();
}

/*// 处理选择变化
function handleSelectionChange(val) {
  selected.value = val;
}*/

// 分页大小变化
function handleSizeChange(newSize) {
  pagination.pageSize = newSize;
  pagination.currentPage = 1;
  getData();
}

// 当前页变化
function handleCurrentChange(newPage) {
  pagination.currentPage = newPage;
  getData();
}

// 禁用开始日期的函数
const disabledStartDate = (time, endDate) => {
  if (endDate) {
    // 禁用开始日期之后的所有日期（大于结束日期的日期）
    return time > endDate
  }
  return false
}

// 禁用结束日期的函数
const disabledEndDate = (time, startDate) => {
  if (startDate) {
    // 禁用结束日期之前的所有日期（小于开始日期的日期）
    return time < startDate
  }
  return false
}



function getData() {
  loading.value = true;
     const user_name = localStorage.getItem("username");
  // 构建查询参数
  const params = {
    po_no: form.po_no,
    sdate: form.dateRange?.length === 2 ? form.dateRange[0] : '',
    edate: form.dateRange?.length === 2 ? form.dateRange[1] : '',
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    //usename: user_name
  };

  table.value = [];
  
  // 设置超时定时器
  const timeoutTimer = setTimeout(() => {
    if (loading.value) {
      table.value = mockData.filter(item => {
        const poMatch = params.po_no ? 
          item.po_no.toLowerCase().includes(params.po_no.toLowerCase()) : true;
        
        let dateMatch = true;
        if (params.sdate && params.edate) {
          const itemDate = new Date(item.bc_date);
          const startDate = new Date(params.sdate);
          const endDate = new Date(params.edate);
          endDate.setDate(endDate.getDate() + 1);
          
          dateMatch = itemDate >= startDate && itemDate < endDate;
        }
        
        return poMatch && dateMatch;
      });
      
      loading.value = false;
      ElMessage.warning('查询超时，已显示模拟数据');
    }
  }, 3000);

  // 实际API调用
  getLicDqrList(params)
    .then(res => {
      clearTimeout(timeoutTimer);
      
      // 正确处理后端数据结构
      if (res.data.result) {
        table.value = res.data.result;
        pagination.total = res.data.TotalCount;
        
        // 查询成功提示
        if (table.value.length > 0) {
          ElMessage({
            message: '查询成功',
            type: 'success',
            duration: 2000
          });
        } else {
          ElMessage({
            message: '查询成功，但没有符合条件的数据',
            type: 'warning',
            duration: 2000
          });
        }
      } else {
        table.value = [];
        const errorMsg = res.data?.message || res.data?.data?.message || '未查询到数据';
        pagination.total = res.data.TotalCount || 0;
        
        // 查询失败提示
        ElMessage({
          message: errorMsg,
          type: 'error',
          duration: 3000
        });
      }
    })
    .catch(error => {
      clearTimeout(timeoutTimer);s
      table.value = [];

      // 网络错误提示
      ElMessage({
        message: `查询失败: ${error.message}`,
        type: 'error',
        duration: 3000
      });      

    })
    .finally(() => {
      loading.value = false;
    });
}
// 日期格式化函数
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
// 联营业务/联营款确认弹窗相关变量
const licqrDialogVisible = ref(false)
const licqrDialogParams = ref({})
/* 联营业务/联营款确认按钮
   25.9.3 新增sh_address 用于使用pdf
*/  
function fn_check2(row) {
   

  if (!row || !row.checkoid) {
    ElMessage.error('查货数据异常，无法确认')
    return
  }

  let b_sign_id=true;
  let b_sign_id2=false;

  let sh_address
  if (row.check_typenam === '出口查货') {
    sh_address = `https://gsreport.gsitcloud.com/report/decision/view/report?viewlet=TradingERP%252FckChReport_Lic.cpt&oid=${row.checkoid}&lang=ch&__bypagesize__=false`
  } else {
    sh_address = `https://gsreport.gsitcloud.com/report/decision/view/report?viewlet=TradingERP%252FchReport_Lic.cpt&oid=${row.checkoid}&lang=ch&__bypagesize__=false`
  }
  
  licqrDialogParams.value = {
    oid: row.checkoid,
    check_typenam: row.check_typenam,
    bc_result: row.bc_result,
    sh_sign_id: b_sign_id,
    sh_sign_id2: b_sign_id2,
    sh_address: sh_address,
    // ... 其余需要传递的参数
  }
  licqrDialogVisible.value = true  // 这行代码实际打开弹窗
}

// 处理下拉菜单选择
function handleBatchConfirm() {
  // 显示确认弹窗，使用固定的操作名称
  ElMessageBox.confirm(
    '是否批量确认联营业务/联营款？',
    '批量确认操作',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 用户点击确认，执行批量确认操作
    fn_save2All();
  }).catch(() => {
    // 用户点击取消，什么都不做
  });
}

// 批量确认
  async function fn_save2All () {
   const user_name = localStorage.getItem("username");

  if (selected.value.length === 0) {
    ElMessage.warning('请选择要确认的数据')
    return
  }

   let b = await fn_checkShenKuanPic_un(selected.value)
  //判断审款图片是否不符(查货报告里面有疵点可选,看这个)
  if (b.result) {
          ElMessage.warning(`合同号${b.item}疵点存在与审款图不符，需要进入联营业务/联营款确认页面选择处理方式后确认`);
          return;
        }

  //判断是否有“不接受”的
  for (let i = 0; i < selected.value.length; i++) {
    if (selected.value[i].bc_result === "不接受") {
      ElMessage.error(`合同号${selected.value[i].po_no}查货结果不接受，需要进入联营业务/联营款确认页面选择处理方式后确认`)
      return
    }
  }

  /*const storageData = localStorage.getItem('storage_key_etds')
  if (!storageData) {
    ElMessage.error('获取用户信息失败')
    return
  }*/

  /*const userInfo = JSON.parse(storageData)
  const isSqs = userInfo.is_sqs === '1' || userInfo.is_sqs === 1 ? 'true' : 'false'
  if (isSqs !== 'true') {
    ElMessage.error('非联营业务/联营款账号不能确认')
    return
  }*/

  try {
    const params = {
      oidList: JSON.stringify(selected.value),//获取列表
      bc_factApply: user_name,
      confirmstate: 1,
      //result: confirmType.value
    }

    // 调用接口
    const res = await updateLicDqr(params)
    // 取后端返回的失败oid数组
    const errOid = res.data.result.msg || []

    if (errOid.length > 0) {
      // 找出失败的合同对象
      const errPo = selected.value.filter(item => errOid.includes(item.oid))
      // 拼接合同号
      let errmsg = errPo.map(item => item.po_no).join(',')
      alert(`确认失败的合同号: ${errmsg}`)
    } else {
      ElMessage.success('批量确认成功')
      await getData();
      selected.value = []
    }
  } catch (err) {
    console.error('确认失败:', err)
    ElMessage.error('确认失败')
  }
}

// 检查审款图片是否不符 25.9.4 郭景群
async function fn_checkShenKuanPic_un(selectedItems) {
  // 辅助函数：检查单个项目
  const checkRequest = async (oid, item) => {
    try {
      // 调用接口，传递参数
      const res = await checkShenKuanPic_un({ oid });
      
      // 检查接口返回结果
      if (res.data.result === "1") {
        return { result: true, item: item };
      }
    } catch (error) {
      console.error(`检查合同号 ${item} 的审款图片时出错:`);
      ElMessage.error(`检查合同号 ${item} 的审款图片失败`);
    }
    return { result: false };
  };

  // 遍历选中的项目
  for (let i = 0; i < selectedItems.length; i++) {
    const item = selectedItems[i];
    // 验证必要参数
    if (!item.checkoid) {
      ElMessage.warning(`合同号 ${item.po_no} 缺少必要的查货ID，跳过检查`);
      continue;
    }
    
    const result = await checkRequest(item.checkoid, item.po_no);
    if (result.result) {
      return result; // 找到符合条件的项，返回结果
    }
  }
  
  return { result: false }; // 没有找到符合条件的项
}

// 查看查货资料按钮处理函数 谢佩容 2025.8.25
async function fn_check(row) {
  currentRowData.value = row;// 设置当前行数据
  inspectionDialogTitle.value = `查看查货资料 - ${row.po_no}`;// 设置弹窗标题
  inspectionDialogVisible.value = true;// 显示弹窗
  
  try {
    listLoading.value = true;
    
    // 确定查货类型和联营类型
    const isExportCheck = row.check_typenam === "出口查货";
    let licTypeValue = isExportCheck ? 
      (row.lic_type !== undefined ? String(row.lic_type) : "0") : 
      (row.lic_typename === "联营业务" ? "0" : "1");
    
    // 构建查询参数
    const inspectionParams = {
      checkTypenam: row.check_typenam,
      checkoid: row.checkoid,
      po_no: row.po_no,
      bc_seq: row.bc_seq,
      bc_qs: row.bc_qsname === '中期' ? 1 : 3,
      bc_num: row.bc_num
    };
    
    // 获取查货资料
    const inspectionResponse = await getlicStaffCon(inspectionParams);
  
      const responseData = inspectionResponse.data;
      const item = responseData?.[0] || {};
      console.log("inspectionResponse.data:", inspectionResponse.data);
      // 直接更新 inspectionTableData
      inspectionTableData.value = {
        // 映射字段到表格所需属性
        applyNo: row.applyNo,
        picItemcode: row.picItemcode,
        po_no: item.pono || "", // 使用返回的 pono
        bc_seq: item.bcBatchNo || "", // 使用返回的 bcBatchNo
        bc_qsname: item.bcQsname || "", // 使用返回的 bcQsname
        bc_num: item.bcNum || "", // 使用返回的 bcNum
        planDate: item.planDate || "",
        po_shipdate: item.po_shipdate|| "",
        bc_checkqty: item.bc_checkqty || "",
        po_shipqty: item.po_shipqty || "",
        sconfirm: item.sconfirm || "",
        fact_code: row.fact_code,
        lic_typename: row.lic_typename
      };    
    // 获取合同详情
    const contractResponse = await getContractDetail({
      checkTypenam: row.check_typenam,
      pono: item.pono,
      licType: item.lic_type
    });
      inspectionDetailData.value = {
        ...currentRowData.value,
        ...contractResponse.data,
      }; 
    // 如果是非出口查货，获取附件列表
    if (!isExportCheck) {
      const attachmentResponse = await getlicFileDown({
        poNo: contractResponse.pono,
        styleNo: contractResponse.styleNo
      });
        attachmentList.value = attachmentResponse.data;
    } else {
      attachmentList.value = [];
    }
  } catch (error) {
    console.error('获取查货资料失败:', error);
    ElMessage.error('获取查货资料失败');
  } finally {
    listLoading.value = false;
    attachmentLoading.value = false;
  }
}

// 打开报告弹窗
function openReportDialog() {
  reportDialogVisible.value = true
}

// 下载文件
function downloadFile(file) {
  if (!file.FILE_DIR) {
    ElMessage.warning('文件路径不存在');
    return;
  }
  
  
  // 修复双斜杠问题
  const fileUrl = file.FILE_DIR;
  
  // 改用新窗口打开避免阻塞
  window.open(fileUrl, '_blank');
  
  ElMessage.success(`开始下载: ${file.file_name}`);
}

// 关闭弹窗时的处理
function handleCloseDialog() {
  selectedItem.value = {}
  currentRowData.value = {}  // 清空当前行数据
  attachmentList.value = []  // 清空附件列表
  inspectionTableData.value = {} // 新增
  inspectionDetailData.value = {} // 新增
}

</script>

<style scoped>
.page-bg {
  min-height: 100vh;
  background: #f6f8fc;
  padding: 24px;
}
.main-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
  padding: 24px;
}

/*添加的日期
/* 调整查询面板样式 */
.search-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}
.search-panel .el-form-item {
  margin-right: 16px;
  margin-bottom: 0;
}
/* 使日期选择器宽度自适应 */
.el-date-editor.el-input, .el-date-editor.el-input__wrapper {
  width: 320px;
}
/*添加的日期*/
.table-footer {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.table-footer > * { margin-right: 8px; }
.custom-button {
  min-width: 90px;
}

.highlight-row {
background-color: #ecf5ff !important;

td {
  background-color: #ecf5ff !important;
  }
      
&:hover > td {
      background-color: #d9ecff !important;
  }
}

/* 详情容器样式 */
.detail-container {
    margin-top: 30px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 10px;
        color: #409EFF;
      }
    }
  }

/* 详情框样式 */
.detail-box {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    
    .detail-header {
      padding: 12px 20px;
      background-color: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 10px;
        color: #409EFF;
      }
    }

    .detail-content {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      
      .detail-item {
        display: flex;
        min-height: 30px;
        line-height: 30px;
        
        .detail-label {
          width: 100px;
          font-weight: bold;
          color: #606266;
          flex-shrink: 0;
        }
        
        .detail-value {
          flex: 1;
          color: #333;
          word-break: break-word;
        }
        
        .highlight {
          color: #409EFF;
          font-weight: bold;
        }
        
        .not-on-shelf {
          background: #fff0f0;
          color: #f56c6c;
          border: 1px solid #fbc4c4;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
          display: inline-flex;
          align-items: center;
          
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }

/* 添加上架状态样式 */
.not-on-shelf {
  background: #fff0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
}

/* 添加批量确认弹窗样式 */
:deep(.batch-confirm-dialog) {
  min-width: 400px;
}
:deep(.batch-confirm-dialog .el-message-box__content) {
  font-size: 16px;
  padding: 20px;
}
:deep(.batch-confirm-dialog .el-message-box__btns) {
  padding: 10px 20px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .detail-content {
      grid-template-columns: 1fr !important;
    }
    
    .detail-item {
      flex-direction: column;
      gap: 5px;
      
      .detail-label {
        width: 100% !important;
      }
    }
  }
  .search-panel .el-form-item {
  margin-right: 16px;
  margin-bottom: 12px;
  }

</style>


