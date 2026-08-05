<template>
  <div class="container">
    <!-- 顶部按钮模块 -->
    <div class="second-main-container button-module">
      <div class="button-area">
        <el-button type="primary" @click="fnGetData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="edit">修改</el-button>
        <el-button type="primary" @click="fn_add">翻查</el-button>
        <el-button type="primary" @click="sends">导入</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="showPreviewModal = true">预览漏查</el-button>
        </div>  
      </div>
    <!-- 查询表单+表格模块 -->
    <div class="second-main-container">
      <div class="form-area">
        <el-form :inline="true" :model="form" class="search-form">
          <div class="form-row">
            <el-form-item label="合同" class="form-item">     <!-- 双向绑定合同号输入框的值 -->
              <el-input 
                v-model="form.po_no"                            
                placeholder="请输入合同号（模糊查询）" 
                style="width: 220px;"
                clearable
              />
          </el-form-item>
            
            <el-form-item label="口岸" class="form-item">
              <el-input 
                v-model="form.port" 
                placeholder="请输入口岸（模糊查询）" 
                style="width: 220px;"
                clearable
              />
            </el-form-item>
            
            <el-form-item label="客户" class="form-item">
            <el-select 
              v-model="form.cust_code" 
              multiple 
              filterable
              remote
              reserve-keyword
              :remote-method="remoteCustMethod"
              :loading="custLoading"
              placeholder="请选择或搜索客户" 
              clearable
                style="width: 220px;"
              popper-class="wide-select-dropdown"
              :teleported="false"           
            >
              <el-option v-for="item in filteredCustList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
            
            <el-form-item label="品种" class="form-item">
            <el-select 
              v-model="kinds" 
              filterable
              remote
              reserve-keyword
              :remote-method="remoteKindMethod"
              :loading="kindLoading"
              placeholder="请选择或搜索品种" 
              clearable
                style="width: 220px;"
              popper-class="wide-select-dropdown"
              :teleported="false"
            >
              <el-option v-for="item in filteredKindList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
            
            <el-form-item label="联营类型" class="form-item">
              <el-select 
                v-model="lic_type" 
                multiple 
                placeholder="请选择联营类型" 
                style="width: 220px;"
                clearable
              >
                <el-option v-for="item in licTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <!-- 第二行：授权商和日期范围 -->
          <div class="form-row">
            <el-form-item label="授权商" class="form-item">
            <el-select 
              v-model="liccode" 
              multiple 
              filterable
              remote
              reserve-keyword
              :remote-method="remoteLicMethod"
              :loading="licLoading"
              placeholder="请选择或搜索授权商" 
              clearable
                style="width: 220px;"
              popper-class="wide-select-dropdown"
              :teleported="false"
            >
              <el-option v-for="item in filteredLicList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

            <el-form-item label="客期" class="form-item">
              <div class="date-range">
                <el-date-picker 
                  v-model="form.sdate" 
                  type="date" 
                  placeholder="开始日期"
                  style="width: 150px;"
                />
                <span class="date-separator">至</span>
                <el-date-picker 
                  v-model="form.edate" 
                  type="date" 
                  placeholder="结束日期"
                  style="width: 150px;"
                />
              </div>
          </el-form-item>
            
            <el-form-item label="审款通过时间" class="form-item form-item-long-label">
              <div class="date-range">
                <el-date-picker 
                  v-model="form.crosssdate" 
                  type="date" 
                  placeholder="开始日期"
                  style="width: 150px;"
                />
                <span class="date-separator">至</span>
                <el-date-picker 
                  v-model="form.crossedate" 
                  type="date" 
                  placeholder="结束日期"
                  style="width: 150px;"
                />
              </div>
          </el-form-item>
          </div>
        </el-form>
        <!-- 统计信息三行居中显示 -->
        <div class="summary-info-inline">
          <span v-if="!summaryLoading && !summaryError">品种总数量:{{ summaryData.totalKinds }}</span>     <!-- 显示品种总数量，只有在统计数据加载完成且无错误时才显示 -->
          <span v-if="!summaryLoading && !summaryError">申请数:{{ summaryData.appliedCount }}</span>
          <span v-if="!summaryLoading && !summaryError">占比(%):{{ formatPercentage(summaryData.percentage) }}</span>
          <span v-if="summaryLoading" style="color: #909399;">统计数据加载中...</span>                      <!-- 显示统计数据加载中的提示信息 -->
          <span v-if="!summaryLoading && summaryError" style="color: #f56c6c;">统计数据获取失败</span>
        </div>
<div class="divider-line"></div>
         </div> 
      <!-- 数据表格区 -->
      <div class="table-area">

        <el-table
          ref="tableRef"
          :data="tableData"
          v-loading="tableLoading"
          style="width: 100%; margin-top: 16px;"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          border
          :highlight-current-row="true"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column
            v-for="col in tablecolumns"
            :key="col.name"
            :prop="col.field"
            :label="col.label"
            :align="col.align"
            :sortable="col.sortable"
          >
            <template #default="scope">
              {{ col.format ? col.format(scope.row[col.field]) : scope.row[col.field] }}
            </template>
          </el-table-column>
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
            :total="total"
            :page-size="pagination.pageSize"
            :current-page="pagination.current"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
          />
        </div>
          </div>
          </div>
    <!-- <el-dialog v-model="showDtlDialog" title="翻查详情" width="90vw" top="2vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <component :is="DtlComponent" :table="selectedRows.value" :selected="selectedRows.value" />
    </el-dialog> -->
    <!-- 将原来的 component 使用方式改为直接使用组件并传递 props -->
    <el-dialog v-model="showDtlDialog" title="翻查详情" width="90vw" top="2vh" @opened="onDialogOpened" @closed="onDialogClosed">
      <!-- <component :is="DtlComponent" :table="selectedRows.value" :selected="selectedRows.value" /> -->
       <licdaichu-sqdtl 
          :table="selectedRows.value" 
          :selected="selectedRows.value" 
          @close="showDtlDialog = false"
          :key="dialogKey"
        />
    </el-dialog>
    <el-dialog v-model="showAddDialog" title="新增详情" width="90vw" top="2vh" :key="`add-${Date.now()}`">    <!-- 新增详情弹窗，通过时间戳确保组件重新渲染 -->
      <component 
        :is="AddDtlComponent" 
        :key="`add-component-${Date.now()}`"
        :table="globalSelectedRows.value"
        :selected="globalSelectedRows.value"
        :lic-type="lic_type.value"
        :po-no="(globalSelectedRows.value && globalSelectedRows.value.length>0) ? (globalSelectedRows.value[0].poNo || globalSelectedRows.value[0].po_no || '') : ''"
        :port="form.port"
        :selected-rows="globalSelectedRows.value"
        @close="showAddDialog = false"
      />
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="修改详情" width="90vw" top="2vh" :key="`edit-${Date.now()}`">
      <component 
        :is="EditComponent" 
        :key="`edit-component-${Date.now()}`"
        :selected-rows="selectedRows.value"
        :lic-type="lic_type.value"
        @close="showEditDialog = false"
        @openAdd="handleOpenAddFromEdit"
      />
    </el-dialog>
    <!-- 批量导入 -->
    <el-dialog v-model="visible.productImport" title="导入" :close-on-click-modal="false" center width="400px">
        <div class="uploadDialog">
          <el-upload
            drag
            :limit="uploadSetting.limit"
            :auto-upload="uploadSetting.isAutoUpload"
            :accept="uploadSetting.accept"
            :headers="uploadSetting.headers"
            :action="'/'"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-remove="batchRemove"
            :on-exceed="exceedFile"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="batchFileList"
          >
            <el-icon><el-icon-upload /></el-icon>
            <div class="el-upload__text">
              <em>点击上传</em>
  </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传xlsx,xls文件，且不超过10M
              </div>
              <div class="el-upload__tip">
                上传前不知道excel模板的，请点击
                <span class="clickMe" @click="poDownload">点我下载模板</span>
                去下载
  </div>
            </template>
          </el-upload>
          <br />
          <el-button size="small" type="primary" @click="uploadFile">立即导入</el-button>
        </div>
      </el-dialog>
  </div>

  <!-- 导出选项弹窗 -->
<el-dialog
  v-model="exportOptionVisible"
  title="导出选项"
  width="400px"
  :close-on-click-modal="false"
>
  <div style="padding: 20px 0;">
    <el-radio-group v-model="exportOption">
      <el-radio value="current" style="display: block; margin-bottom: 16px;">
        <div>
          <div style="font-weight: bold;">导出当前页</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            导出当前显示的第 {{ previewPagination.current }} 页，共 {{ previewTableData.length }} 条数据
          </div>
        </div>
      </el-radio>
      <el-radio value="all">
        <div>
          <div style="font-weight: bold;">导出全部数据</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            导出全部 {{ previewTotal }} 条数据
          </div>
        </div>
      </el-radio>
    </el-radio-group>
  </div>
  
  <template #footer>
    <el-button @click="exportOptionVisible = false">取消</el-button>
    <el-button type="primary" @click="confirmExport" :loading="exportLoading">
      确认导出
    </el-button>
  </template>
</el-dialog>
  <el-dialog
  v-model="showPreviewModal"
  title="未出查货申请的款号信息"
  width="800px"
  :close-on-click-modal="false"
>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <el-button @click="handleExportPreview" type="primary" size="small">导出</el-button>
    <!-- 保持分页在右下，导出在左上 -->
  </div>


  <el-table
    ref="tableRef"
    :data="previewTableData"
    v-loading="previewLoading"
    style="width: 100%;"
    border
    empty-text="暂无数据"
  >
    <el-table-column
      v-for="col in previewTableColumns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :align="col.align"
      :formatter="col.formatter"
    />
  </el-table>
  <div style="margin: 16px 0; display: flex; justify-content: flex-end;">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="previewTotal"
      :page-size="previewPagination.pageSize"
      :current-page="previewPagination.current"
      @size-change="handlePreviewSizeChange"
      @current-change="handlePreviewPageChange"
      :page-sizes="[10, 20, 50, 100]"
    />
  </div>
</el-dialog>
<el-dialog
  v-model="showLcDialog"
  width="400px"
  :show-close="false"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  top="10vh"
  custom-class="lc-remind-dialog"
>
  <div style="text-align:center;">
    <div style="margin-bottom: 24px;">
      <span v-html="lcRemindMsg"></span>
    </div>
    <el-button type="primary" @click="handlePreviewLc">预览漏查</el-button>
    <el-button @click="handleDontRemind" style="margin-left: 16px;">不再提醒</el-button>
  </div>
</el-dialog>

    <!-- 导出选项弹窗 -->
<el-dialog
  v-model="exportOptionVisible"
  title="导出选项"
  width="480px"
  :close-on-click-modal="false"
  class="export-option-dialog"
>
  <div class="export-option-content">
    <div class="export-options">
      <div 
        class="export-option-card"
        :class="{ 'export-option-card--active': exportOption === 'current' }"
        @click="exportOption = 'current'"
      >
        <div class="option-radio">
          <el-radio v-model="exportOption" value="current" />
        </div>
        <div class="option-content">
          <div class="option-title">导出当前页</div>
          <div class="option-desc">导出当前显示的第 {{ previewPagination.current }} 页，共 {{ previewTableData.length }} 条数据</div>
        </div>
      </div>

      <div 
        class="export-option-card"
        :class="{ 'export-option-card--active': exportOption === 'all' }"
        @click="exportOption = 'all'"
      >
        <div class="option-radio">
          <el-radio v-model="exportOption" value="all" />
        </div>
        <div class="option-content">
          <div class="option-title">导出全部数据</div>
          <div class="option-desc">导出全部 {{ previewTotal }} 条数据</div>
        </div>
      </div>
    </div>
  </div>
  
  <template #footer>
    <div class="export-dialog-footer">
      <el-button @click="exportOptionVisible = false">取消</el-button>
      <el-button 
        type="primary" 
        @click="confirmExport" 
        :loading="exportLoading"
      >
        确认导出
      </el-button>
    </div>
  </template>
</el-dialog>
    
</template>

<script setup>
// import { ref, onMounted, computed, watch } from 'vue';
import { ref, onMounted, computed, watch, reactive, defineAsyncComponent, nextTick } from 'vue'; 
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import {excel} from '@/utils/excelExport'
import {
  fnGetKindCodeList2,
  fnGetLicCodeList,
  fnGetLicCustCodeList,
  fnGetLicCheckSqLicCodeList,
  fnGetKindQty,
  fnGetLicCheckSqDaichuData,
  fnGetLicPoState,
  fnGetlicCheckSq_ly,
  fnCheckPortStatus,
  checkLicPortStatus,
  getLicCheckSqLy,
  exportData,
  fnGetlicCheckSqDetail,       //检查是否有已存在的新增记录-黄浩萌 2025.09.04
  getLcData
} from './index.js';
import {
  getAllShopItems,
  checkLicPoCanAudit,
  deleteLicZcReport,
} from '@/api/etds.js';
import axios from 'axios';
import { getToken } from '@/utils/auth'
import * as XLSX from 'xlsx';
import { h } from 'vue'
// 导入子组件
import LicdaichuSqdtl from './licdaichuSqdtl.vue';

// 表单数据模型，用于存储查询条件
const form = ref({
  sdate: '',              // 查询开始日期
  edate: '',              // 查询结束日期
  po_no: '',              // 合同号查询条件
  sy_state: '0',          // 状态筛选条件，默认为'0'
  post_type: '',          // 岗位类型
  userId: '',             // 用户ID
  step: 0,                // 步骤标识
  spo: '',                // 合同号相关参数
  cust_code: [],          // 客户代码数组，支持多选
  crosssdate: '',         // 审款通过开始日期
  crossedate: '',         // 审款通过结束日期
  port: ''                // 口岸信息
});
const kinds = ref('');        // 品种
const liccode = ref([]);      // 授权商
const lic_type = ref(['0']);  // 默认选中"联营业务"
const licTypeOptions = [
  { label: '联营业务', value: '0' },
  { label: '联营款', value: '1' }
];
const kindlist = ref([]);     // 品种下拉
const liccodelist = ref([]);  // 授权商下拉
const custcodelist = ref([]); // 客户下拉
// 过滤后的列表
const filteredKindList = ref([]);
const filteredLicList = ref([]);
const filteredCustList = ref([]);
// 搜索加载状态
const kindLoading = ref(false);
const licLoading = ref(false);
const custLoading = ref(false);
const summaryData = ref({     // 统计数据
  totalKinds: 0,              // 品种总数量
  appliedCount: 0,            // 申请数
  percentage: 0               // 占比(%)
});
const summaryLoading = ref(false);  // 统计数据加载状态
const summaryError = ref(false);    // 统计数据错误状态
const tableLoading = ref(false);
const total = ref(0);
const pagination = ref({    // 分页配置
  current: 1,
  pageSize: 10,
});
/********************预览漏查导出功能完善********************/
// 添加导出选项相关变量
const exportOptionVisible = ref(false); // 导出选项弹窗显示状态
const exportOption = ref('current'); // 'current' | 'all' - 导出选项

const selectedRows = ref([]);   // 选中的行
const currentRow = ref(null);   // 当前点击的行数据
const tableSelectList = ref([]); 
// 导出弹窗相关
const exportLoading = ref(false);  // 导出加载状态
const exportDialogVisible = ref(false);
const exportDialogForm = ref({ 
  incImage: false,
  showSheet: false  // 改为布尔值，默认为false
});
const exportDialogOption = {
  submitBtn: false,
  emptyBtn: false,
  menuBtn: false,
  labelWidth: 120,
  column: [
    {
      label: '是否导图',
      prop: 'incImage',
      type: 'radio',
      dicData: [
      
        { label: '导图', value: true },
        { label: '不导图', value: false }
      ],
      value: false,
      span: 24
    }
  ]
};


// 控制弹窗显示
const showPreviewModal = ref(false);

// 漏查表格相关
const previewTableData = ref([]);
const previewTotal = ref(0);
const previewLoading = ref(false);
const previewPagination = ref({
  current: 1,
  pageSize: 10,
});
const selected = ref([]);   // 选中项
// 格式化时间函数
const formatTimeToStr = (time, format) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
};

// 格式化百分比函数
const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0';
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  if (Math.abs(num) < 0.000001) {   // 处理科学计数法，如 0E-7
    return '0.00';
  }

  return num.toFixed(2);
};
// snake_case 转 camelCase (蛇形命名法转换为驼峰命名法)
function snakeToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      newObj[camelKey] = obj[key];
    }
    return newObj;
  }
  return obj;
}
// 表格列配置
const tablecolumns = [
  // {
  //   name: "id",                                    // 字段名
  //   label: "ID",                                   // 列标题
  //   field: "id",                                   // 字段
  //   align: "center",                               // 居中
  //   format: val => `${val || ''}`,                 // 格式化
  //   sortable: true                                 // 可排序
  // },
  {
    name: "applyNo",                               // 字段名
    label: "上架申请号",                             // 列标题
    field: "applyNo",                             // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "decisionResult",                        // 字段名
    label: "查货类型",                             // 列标题
    field: "decisionResult",                      // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poNo",                                  // 字段名
    label: "合同号",                               // 列标题
    field: "poNo",                                // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poState",                               // 字段名
    label: "款状态",                               // 列标题
    field: "poState",                             // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poSeq",                                 // 字段名
    label: "合同批次",                             // 列标题
    field: "poSeq",                               // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poStyle",                               // 字段名
    label: "款号",                               // 列标题
    field: "poStyle",                             // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "depName",                               // 字段名
    label: "品种",                             // 列标题
    field: "depName",                             // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poShipqty",                             // 字段名
    label: "合同数量",                           // 列标题
    field: "poShipqty",                           // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "poShipdate",                            // 字段名
    label: "客期",                           // 列标题
    field: "poShipdate",                          // 字段
    align: "center",                              // 居中
    format: val => {
      if (!val) return '';
      if (typeof val === 'string' && val.includes('T')) {   // 兼容字符串带T的格式
        return val.split('T')[0];
      }
      return formatTimeToStr(val, "yyyy-MM-dd");   // 其它情况用原有格式化
    },
    sortable: true                                // 可排序
  },
  {
    name: "isMj",                                  // 字段名
    label: "是否免检",                               // 列标题
    field: "isMj",                                // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "factName",                              // 字段名
    label: "授权商",                             // 列标题
    field: "factName",                            // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "attachkportName",                       // 字段名
    label: "口岸",                         // 列标题
    field: "attachkportName",                     // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "custCode",                              // 字段名
    label: "客户",                             // 列标题
    field: "custCode",                            // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
  {
    name: "brandNo",                               // 字段名
    label: "品牌",                             // 列标题
    field: "brandNo",                             // 字段
    align: "center",                              // 居中
    format: val => `${val || ''}`,                // 格式化
    sortable: true                                // 可排序
  },
];
// 表格列
const previewTableColumns = [
  { prop: 'poNo', label: '合同号', align: 'center' },
  { prop: 'regulartime', label: '客期', align: 'center' },
  { 
    prop: 'businessType', 
    label: '联营业务/联营款', 
    align: 'center',
    formatter: (row) => {
      const type = row.businessType;
      return type === 1 || type === '1' ? '联营款' : '联营业务';
    }
  },
  { prop: 'depName', label: '授权商', align: 'center' },
];
const tableData = ref([]);  // 表格数据源
// 全局选择状态管理
const globalSelectedRows = ref([]);  // 全局已选择的行数据
const isRestoring = ref(false);  // 标记是否正在恢复选择状态

// 处理选择变化
const handleSelectionChange = (selection) => {
  // 如果正在恢复选择状态，则忽略这个事件
  if (isRestoring.value) {
    console.log('正在恢复选择状态，忽略选择变化事件');
    return;
  }
  
  console.log('=== handleSelectionChange 开始 ===');
  console.log('表格选择变化:', selection.length, '行');
  console.log('选择的行键值:', selection.map(getRowKey));
  console.log('更新前全局选择数量:', globalSelectedRows.value.length);
  console.log('更新前全局选择键值:', globalSelectedRows.value.map(getRowKey));
  
  // 更新全局选择状态
  updateGlobalSelection(selection);
  
  // selectedRows.value 应该始终反映全局选择状态
  selectedRows.value = [...globalSelectedRows.value];
  tableSelectList.value = [...globalSelectedRows.value];
  
  console.log('最终全局选择状态更新完成，总数:', globalSelectedRows.value.length);
  console.log('最终全局选择键值:', globalSelectedRows.value.map(getRowKey));
  console.log('=== handleSelectionChange 结束 ===');
};

// 更新全局选择状态
const updateGlobalSelection = (currentPageSelection) => {
  console.log('=== 更新全局选择状态 ===');
  console.log('当前页选择数量:', currentPageSelection.length);
  console.log('更新前全局选择数量:', globalSelectedRows.value.length);
  
  // 获取当前页用户实际选择的行的键值
  const currentPageSelectedKeys = currentPageSelection.map(getRowKey);
  console.log('当前页实际选择的键值:', currentPageSelectedKeys);
  
  // 获取当前页所有数据的键值
  const currentPageAllKeys = tableData.value.map(getRowKey);
  console.log('当前页所有数据的键值:', currentPageAllKeys);
  
  // 找出当前页中用户取消选择的项目（在当前页存在但用户没有选择）
  const currentPageUnselectedKeys = currentPageAllKeys.filter(key => 
    !currentPageSelectedKeys.includes(key)
  );
  console.log('当前页被取消选择的键值:', currentPageUnselectedKeys);
  
  // 从全局选择中移除当前页被取消选择的项目，保留其他页面的选择
  const filteredGlobalRows = globalSelectedRows.value.filter(row => {
    const key = getRowKey(row);
    const shouldKeep = !currentPageUnselectedKeys.includes(key);
    if (!shouldKeep) {
      console.log('从全局选择中移除（用户取消选择）:', key);
    }
    return shouldKeep;
  });
  
  console.log('移除取消选择项后的全局选择数量:', filteredGlobalRows.length);
  
  // 添加当前页新选择的项目到全局选择（避免重复）
  const existingKeys = new Set(filteredGlobalRows.map(getRowKey));
  const newSelections = currentPageSelection.filter(row => {
    const key = getRowKey(row);
    const isNew = !existingKeys.has(key);
    if (isNew) {
      console.log('添加新选择的项目:', key);
    }
    return isNew;
  });
  
  const newSelection = [...filteredGlobalRows, ...newSelections];
  globalSelectedRows.value = newSelection;
  
  console.log('更新后全局选择数量:', globalSelectedRows.value.length);
  console.log('全局选择的键值:', globalSelectedRows.value.map(getRowKey));
  console.log('=== 全局选择状态更新完成 ===');
};

// 获取行的唯一标识
const getRowKey = (row) => {
  if (!row) return '';
  
  const poNo = row.poNo || row.po_no || row.applyNo || '';
  const custCode = row.custCode || row.cust_code || row.custcode || '';
  
  // 如果两个字段都为空，使用其他可能的唯一标识
  if (!poNo && !custCode) {
    const oid = row.oid || row.id || '';
    if (oid) return `oid_${oid}`;
    return `unknown_${JSON.stringify(row).slice(0, 50)}`;
  }
  
  return `${poNo}_${custCode}`;
};

// 处理行点击事件
const handleRowClick = (row) => {
  currentRow.value = row;
};
const tableRef = ref(null);
//蔡锦涛2025/8/25
// 获取表格数据
async function fnGetData() {
  console.log('fnGetData 调用');
  
  // 验证联营类型是否选择
  if (!lic_type.value || lic_type.value.length === 0) {
    ElMessage.warning('请选择联营类型');
    return;
  }

  // 验证客期是否选择（新增验证）
  if (!form.value.sdate || !form.value.edate) {
    ElMessage.warning('请选择客期日期范围');
    return;
  }

  tableLoading.value = true;    // 显示加载中

  let sliccodex = '';           // 授权商参数
  if (Array.isArray(liccode.value) && liccode.value.length > 0) {   // 检查是否为非空数组
    sliccodex = liccode.value                                       // 获取授权商参数，用逗号连接成字符串
      .filter(code => code && typeof code === 'string')
      .join(',');
    console.log('构建的授权商参数:', sliccodex);
  }
  // 处理客户代码数组
  let custCodeStr = '';
  if (Array.isArray(form.value.cust_code) && form.value.cust_code.length > 0) {   // 检查是否为非空数组
    custCodeStr = form.value.cust_code.join(',');                                 // 获取客户代码参数，用逗号连接成字符串
  }

  const lic_type_param = lic_type.value;      // 获取当前选择的联营类型参数

  try {
    // 1. 品种列表下拉
    const res2 = await fnGetKindCodeList2();
    kindlist.value = Array.isArray(res2?.data?.Examples)    // 处理返回的品种列表数据，转换为下拉选项格式
      ? res2.data.Examples.map(e => ({
          label: (e.kindname || ''),                        // 品种名称作为显示标签
          value: e.kindcode                                 // 品种代码作为值
        }))
      : [];
    filteredKindList.value = [...kindlist.value];     // 初始化过滤列表
    if (!res2?.data?.Examples) {      // 如果返回的品种列表数据为空，记录警告日志
      console.warn('品种列表数据为空');
    }

    // 2. 授权商列表下拉
    try {
      const licParams = {
      po_no: form.value.po_no,       // 合同号
        lic_type: lic_type_param,    // 联营类型
        cust: custCodeStr            // 客户代码 
      };
      console.log('授权商API请求参数:', licParams);
      const res3 = await fnGetLicCodeList(licParams);              // 调用API获取授权商列表
      console.log('授权商API响应:', res3);
      liccodelist.value = Array.isArray(res3?.data?.Examples)      // 处理返回的授权商列表数据，转换为下拉选项格式
        ? res3.data.Examples.map(e => {
            const code = e.liccode || '';                          // 处理授权商显示：代码 + 名称
            const name = e.licname || e.factName || '';
            return {
              label: code && name ? `${code} - ${name}` : (code || name || ''),
              value: e.liccode                                      // 选项值为授权商代码
            };
          })
        : [];
      filteredLicList.value = [...liccodelist.value];   // 初始化过滤列表
    } catch (error) { 
      console.error('获取授权商列表失败:', error);
      ElMessage.error('获取授权商列表失败: ' + (error?.message || '未知错误'));
      liccodelist.value = [];         // 获取授权商列表失败，清空授权商列表
      filteredLicList.value = [];
    }

    // 3. 获取客户下拉列表数据
    const res6 = await fnGetLicCustCodeList({
      po_no: form.value.po_no,       // 合同号
      lic_type: lic_type_param       // 联营类型
    });
    custcodelist.value = Array.isArray(res6?.data?.Examples)      // 处理返回的客户列表数据，转换为下拉选项格式
      ? res6.data.Examples.map(e => {                             // 处理客户显示：代码 + 名称
          const code = e.liccustcode || '';
          const name = e.liccustname || e.custName || '';
          return {
            label: code && name ? `${code} - ${name}` : (code || name || ''),
            value: e.liccustcode                                  // 选项值为客户代码
          };
        })
      : [];
    filteredCustList.value = [...custcodelist.value];     // 初始化过滤列表

    // 4. 用户权限许可证列表（根据用户权限过滤授权商）
    const resX = await fnGetLicCheckSqLicCodeList({
      userid: JSON.parse(sessionStorage.getItem('userId'))        // 用户ID
    });
    let sliccodex2 = '';
    if (resX?.data?.result?.msg?.rst === 'true') {                // 如果用户有权限限制，处理权限范围内的授权商代码
      sliccodex2 = resX.data.result.msg.msg;
      sliccodex2 = `('${sliccodex2.replace(/[ \r\n]/g, ',').replace(/,/g, "','")})`;     // 将授权商代码格式化为SQL查询所需的格式：('code1','code2','code3')
    }

    // 5. 主表格数据，带分页参数
    const params5 = {
      startdate: form.value.sdate,
      enddate: form.value.edate,
      po_no: form.value.po_no,
      lic_type: lic_type_param,
      kinds: kinds.value,
      liccode: sliccodex,
      liccustcode: custCodeStr,
      port: form.value.port || '',
      spo: form.value.po_no || '',
      iscorssdate: (form.value.crosssdate && form.value.crossedate) ? 'true' : 'false',
      crosssdate: form.value.crosssdate,
      crossedate: form.value.crossedate,
      liccode2: sliccodex2,
      pageNum: pagination.value.current,      // 当前页码
      pageSize: pagination.value.pageSize,    // 每页数量
    };
    const res5 = await fnGetLicCheckSqDaichuData(params5);        // 调用API获取主表格数据
    const allData = Array.isArray(res5?.data?.Examples) ? snakeToCamel(res5.data.Examples) : [];    // 处理返回的数据，蛇形命名法转换为驼峰命名法
    total.value = typeof res5?.data?.total === 'number' ? res5.data.total : allData.length;         // 设置总记录数，优先使用后端返回的总数，否则使用数据长度
    tableData.value = allData;      // 更新表格数据

    // 6. 获取统计数据（品种总数量、申请数、占比）
    try {
      summaryLoading.value = true;        // 设置统计数据加载状态，显示加载提示
      summaryError.value = false;         // 重置统计数据错误状态
      const summaryParams = {             // 统计参数
        startdate: form.value.sdate,
        enddate: form.value.edate,
        po_no: form.value.po_no,
        lic_type: lic_type_param,
        kinds: kinds.value,
        liccode: sliccodex,
        liccustcode: custCodeStr,
        port: form.value.port || '',
        spo: form.value.po_no || '',
      iscorssdate: (form.value.crosssdate && form.value.crossedate) ? 'true' : 'false',     // 是否启用审款通过时间筛选
      crosssdate: form.value.crosssdate,
      crossedate: form.value.crossedate,
      liccode2: sliccodex2                   // 用户权限范围内的授权商代码
    };
      const summaryRes = await fnGetKindQty(summaryParams);     // 调用API获取统计数据
      if (summaryRes?.data?.Examples && Array.isArray(summaryRes.data.Examples) && summaryRes.data.Examples.length > 0) {   // 检查返回数据结构是否符合预期
        const data = summaryRes.data.Examples[0];

        summaryData.value = {                    // 根据实际返回的字段名进行映射
          totalKinds: data.c_qty || 0,           // 品种总数量
          appliedCount: data.c_qty2 || 0,        // 申请数
          percentage: data.per_qty || 0          // 占比
        };
        console.log('解析后的统计数据:', summaryData.value);
      } else {
        console.warn('统计数据格式不符合预期:', summaryRes?.data);
        summaryData.value = {
          totalKinds: 0,
          appliedCount: 0,
          percentage: 0
        };
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      summaryError.value = true;     // 设置默认值
      summaryData.value = {
        totalKinds: 0,
        appliedCount: 0,
        percentage: 0
      };
    } finally {       // 无论成功或失败，都关闭统计数据加载状态
      summaryLoading.value = false;
    }

  // 7. 款式状态
    const tableMap = tableData.value.map(item => ({
      pono: item.poNo || item.po_no,     // 兼容不同字段名
      cust_code: item.custCode || item.cust_code,
      lic_type: Array.isArray(lic_type_param) ? lic_type_param[0] : lic_type_param    // 确保传递单个值而不是数组
    }));
    if (tableMap.length > 0) {
    const res7 = await fnGetLicPoState({ tableMap });     // 传递对象包含tableMap属性
    if (Array.isArray(res7?.data?.Examples)) {   // 修改为期望 Examples
      res7.data.Examples.forEach(item => {             // 遍历返回的款式状态列表
        const idx = tableData.value.findIndex(            // 在表格数据中查找对应的记录
          r => (r.poNo || r.po_no) === item.po_no && (r.custCode || r.cust_code) === item.cust_code
        );
        if (idx !== -1) tableData.value[idx].poState = item.po_state;      // 如果找到对应记录（idx 不等于 -1），更新其款式状态
      });
    }
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  } finally {
    tableLoading.value = false;
  }
}

//初始化表单
const initDropdownData = async () => {
  try {
    let custCodeStr = '';
    if (Array.isArray(form.value.cust_code) && form.value.cust_code.length > 0) {
      custCodeStr = form.value.cust_code.join(',');
    }
    
    // 品种
    const kindResponse = await fnGetKindCodeList2();
    kindlist.value = Array.isArray(kindResponse?.data?.Examples)
      ? kindResponse.data.Examples.map(e => ({
          label: `${e.kindcode || ''} ${e.kindname || ''}`.trim(),
          value: e.kindcode
        }))
      : [];
    filteredKindList.value = [...kindlist.value];         // 初始化过滤列表

    try {
      const licResponse = await fnGetLicCodeList({
        po_no: form.value.po_no,
        lic_type: lic_type.value, 
        cust: custCodeStr
      });
      console.log('初始化授权商API响应:', licResponse);
      liccodelist.value = Array.isArray(licResponse?.data?.Examples)
        ? licResponse.data.Examples.map(e => {
            // 处理授权商显示：代码 + 名称
            const code = e.liccode || '';
            const name = e.licname || e.factName || '';
            return {
              label: code && name ? `${code} - ${name}` : (code || name || ''),
              value: e.liccode
            };
          })
        : [];
      filteredLicList.value = [...liccodelist.value];     // 初始化过滤列表
    } catch (error) {
      console.error('初始化授权商列表失败:', error);
      liccodelist.value = [];
      filteredLicList.value = [];
    }

    // 客户下拉数据加载
    const custResponse = await fnGetLicCustCodeList({
      po_no: form.value.po_no,
      lic_type: lic_type.value
    });
    custcodelist.value = Array.isArray(custResponse?.data?.Examples)
      ? custResponse.data.Examples.map(e => {
          // 处理客户显示：代码 + 名称
          const code = e.liccustcode || '';
          const name = e.liccustname || e.custName || '';
          return {
            label: code && name ? `${code} - ${name}` : (code || name || ''),
            value: e.liccustcode
          };
        })
      : [];
    filteredCustList.value = [...custcodelist.value];     // 初始化过滤列表
  } catch (error) {
    ElMessage.error('初始化下拉数据失败');
  }
};

// 品种远程搜索方法
const remoteKindMethod = (query) => {
  if (!query) {
    filteredKindList.value = [...kindlist.value];
  } else {
    kindLoading.value = true;
    setTimeout(() => {
      filteredKindList.value = kindlist.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase()) ||
               item.value.toLowerCase().includes(query.toLowerCase());
      });
      kindLoading.value = false;
    }, 200);
  }
};

// 授权商远程搜索方法
const remoteLicMethod = (query) => {
  if (!query) {
    filteredLicList.value = [...liccodelist.value];
  } else {
    licLoading.value = true;
    setTimeout(() => {
      filteredLicList.value = liccodelist.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase()) ||
               item.value.toLowerCase().includes(query.toLowerCase());
      });
      licLoading.value = false;
    }, 200);
  }
};

// 客户远程搜索方法
const remoteCustMethod = (query) => {
  if (!query) {
    filteredCustList.value = [...custcodelist.value];
  } else {
    custLoading.value = true;
    setTimeout(() => {
      filteredCustList.value = custcodelist.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase()) ||
               item.value.toLowerCase().includes(query.toLowerCase());
      });
      custLoading.value = false;
    }, 200);
  }
};

// 清空已选合同
function clearSelectedRows() {
  globalSelectedRows.value = [];
  selectedRows.value = [];
  tableSelectList.value = [];
  // 清除表格勾选
  if (tableRef && tableRef.value && tableRef.value.clearSelection) {
    tableRef.value.clearSelection();
  }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  console.log('分页大小变化:', val);
  pagination.value.pageSize = val;// 更新分页配置
  pagination.value.current = 1; // 重置到第一页
  fnGetData().then(() => {
    // 数据加载完成后恢复选择状态
    nextTick(() => {
      restoreCurrentPageSelection();
    });
  });
};

// 处理页码变化
const handleCurrentChange = (val) => {
  console.log('页码变化:', val, '当前全局选择数:', globalSelectedRows.value?.length || 0);
  pagination.value.current = val; // 更新页码
  fnGetData().then(() => {
    // 数据加载完成后恢复选择状态
    nextTick(() => {
      restoreCurrentPageSelection();
    });
  });
};

// 恢复当前页的选择状态
const restoreCurrentPageSelection = () => {
  if (!tableRef.value || globalSelectedRows.value.length === 0) {
    return;
  }
  
  console.log('=== 开始恢复当前页选择状态 ===');
  console.log('全局选择数量:', globalSelectedRows.value.length);
  console.log('当前页数据数量:', tableData.value.length);
  
  // 设置恢复状态标志，防止触发 handleSelectionChange
  isRestoring.value = true;
  
  try {
    // 清除当前选择
    tableRef.value.clearSelection();
    
    // 获取全局选择的键值集合
    const globalSelectedKeys = new Set(globalSelectedRows.value.map(getRowKey));
    console.log('全局选择的键值:', Array.from(globalSelectedKeys));
    
    // 遍历当前页数据，恢复选择状态
    tableData.value.forEach((row, index) => {
      const rowKey = getRowKey(row);
      if (globalSelectedKeys.has(rowKey)) {
        console.log('恢复选择行:', rowKey, '索引:', index);
        tableRef.value.toggleRowSelection(row, true);
      }
    });
    
    console.log('=== 当前页选择状态恢复完成 ===');
  } catch (error) {
    console.error('恢复选择状态失败:', error);
  } finally {
    // 延迟重置标志，确保选择状态完全恢复
    setTimeout(() => {
      isRestoring.value = false;
    }, 100);
  }
};

// 从 sessionStorage 恢复全局选择状态
const restoreGlobalSelectionFromSession = () => {
  try {
    const savedSelection = sessionStorage.getItem('globalSelectedRows');
    if (savedSelection) {
      const parsedSelection = JSON.parse(savedSelection);
      if (Array.isArray(parsedSelection) && parsedSelection.length > 0) {
        globalSelectedRows.value = parsedSelection;
        selectedRows.value = [...parsedSelection];
        tableSelectList.value = [...parsedSelection];
        console.log('从 sessionStorage 恢复全局选择:', parsedSelection.length, '条');
        return true;
      }
    }
  } catch (error) {
    console.error('从 sessionStorage 恢复选择状态失败:', error);
  }
  return false;
};

// 保存全局选择状态到 sessionStorage
const saveGlobalSelectionToSession = () => {
  try {
    sessionStorage.setItem('globalSelectedRows', JSON.stringify(globalSelectedRows.value));
    console.log('保存全局选择状态到 sessionStorage:', globalSelectedRows.value.length, '条');
  } catch (error) {
    console.error('保存选择状态到 sessionStorage 失败:', error);
  }
};

// 初始化搜索框的时间
function fn_time () {
  const now = new Date();             // 获取当前日期
  const edate = formatDate(now);      // 结束日期为今天
  form.value.edate = edate;

  const lastMonth = new Date(now);    // 开始日期为前一个月的同一天
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const sdate = formatDate(lastMonth);
  form.value.sdate = sdate;
}

// 格式化日期为 YYYY-MM-DD
function formatDate (date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? `0${month}` : month;   // 补零
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

const unreleasedTableData = ref([]);
// 获取联营商未出的报告
async function fn_getUnreleasedReports () {
  const res = await getAllShopItems({});
  if (res.data.result.Examples.licPo) {
    unreleasedTableData.value = res.data.result.Examples.licPo.map((item) => {
              return {
        bc_pono: item.po_no,
      };
    });
  }
}

// 处理删除
async function fn_deleteLicZcReport (row) {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    // 如果已经送审，则不能删除
    if (row.state === 1) {
      ElMessage.error('已送审的记录不能删除');
    return;
  }
    const res = await deleteLicZcReport({ oid: row.oid });
    if (res.data) {
      ElMessage.success('删除成功');
      fn_getdata(); // 刷新数据
    } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除出错:', error);
      ElMessage.error('删除失败');
    }
  }
}

// 处理批量删除
async function handleBatchDelete () {
  if (!globalSelectedRows.value.length) {
    ElMessage.error('请先选择要删除的记录');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${globalSelectedRows.value.length} 条记录吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 如果已经送审，则不能删除
    const isAudit = globalSelectedRows.value.some((row) => row.state === 1);
    if (isAudit) {
      ElMessage.error('已送审的记录不能删除');
              return;
              }

    const deletePromises = globalSelectedRows.value.map((row) =>
      deleteLicZcReport({ oid: row.oid })
    );
    const results = await Promise.allSettled(deletePromises);

    const successCount = results.filter(
      (result) => result.status === 'fulfilled'
    ).length;
    const failCount = results.filter(
      (result) => result.status === 'rejected'
    ).length;

    if (successCount > 0) {
      ElMessage.success(`成功删除 ${successCount} 条记录`);
      if (failCount > 0) {
        ElMessage.warning(`${failCount} 条记录删除失败`);
      }
      fn_getdata(); // 刷新数据
        } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除出错:', error);
      ElMessage.error('批量删除失败');
    }
  }
}

/***********************  导出  欧悦  ************************/
// 弹出导出选项对话框
function handleExport() {
  // 检查导出数据量
  let exportCount = 0;
  
  // 如果有选中的行，计算选中行数量；否则计算查询结果总数
  if (tableSelectList.value && tableSelectList.value.length > 0) {
    exportCount = tableSelectList.value.length;
  } else {
    exportCount = total.value;
  }
  
  // 检查导出数据量是否超过400条
  if (exportCount > 400) {
    ElMessage.error(`导出数据量为 ${exportCount} 条，超过400条限制，导出数据过多，不可以导出！`);
    return;
  } else {
    // 数据量在400条以内，直接弹出导出选项对话框
    exportDialogVisible.value = true;
  }
}

// 确认导出
function exportOk() {
  const includeImage = exportDialogForm.value.incImage;
  const showSheet = exportDialogForm.value.showSheet;
  dataExport(includeImage, showSheet);
  exportDialogVisible.value = false;
}

// 关闭导出弹窗
function exportClose() {
  exportDialogVisible.value = false;
}

/***********************  导出  欧悦  ************************/
// 核心导出处理函数
async function dataExport(includeChart, showSheet) {
 const loading = ElLoading.service({ lock: true, text: '数据导出中...' });  // 显示加载动画
 
 // 标记导出类型：0=未勾选行（导出查询结果），1=勾选了行（导出选中数据）
 let type = 0;
 let list = [];

 // 检查是否有选中的行
  if (tableSelectList.value && tableSelectList.value.length > 0) {
   type = "1";  // 字符串格式

   // 调试：打印选中的数据结构
   console.log('选中的原始数据:', tableSelectList.value);

   // 提取po_no作为标识
    list = [...tableSelectList.value];
   console.log('提取的list列表:', list);

   if (list.length === 0) {
   ElMessage.warning('选中的数据中没有有效的数据');
   loading.close();
    return;
  }
  }
  let sliccodex = '';           // 授权商参数
  if (Array.isArray(liccode.value) && liccode.value.length > 0) {   // 检查是否为非空数组
    sliccodex = liccode.value                                       // 获取授权商参数，用逗号连接成字符串
      .filter(code => code && typeof code === 'string')
      .join(',');
    console.log('构建的授权商参数:', sliccodex);
  }
// 处理客户代码数组
  let custCodeStr = '';
  if (Array.isArray(form.value.cust_code) && form.value.cust_code.length > 0) {   // 检查是否为非空数组
    custCodeStr = form.value.cust_code.join(',');                                 // 获取客户代码参数，用逗号连接成字符串
  }

  const lic_type_param = lic_type.value;      // 获取当前选择的联营类型参数

  try {
    // 1. 品种列表下拉
    const res2 = await fnGetKindCodeList2();
    kindlist.value = Array.isArray(res2?.data?.Examples)    // 处理返回的品种列表数据，转换为下拉选项格式
      ? res2.data.Examples.map(e => ({
          label: (e.kindname || ''),                        // 品种名称作为显示标签
          value: e.kindcode                                 // 品种代码作为值
        }))
      : [];
    filteredKindList.value = [...kindlist.value];     // 初始化过滤列表
    if (!res2?.data?.Examples) {      // 如果返回的品种列表数据为空，记录警告日志
      console.warn('品种列表数据为空');
    }

    // 2. 授权商列表下拉
    try {
      const licParams = {
      po_no: form.value.po_no,       // 合同号
        lic_type: lic_type_param,    // 联营类型
        cust: custCodeStr            // 客户代码 
      };
      console.log('授权商API请求参数:', licParams);
      const res3 = await fnGetLicCodeList(licParams);              // 调用API获取授权商列表
      console.log('授权商API响应:', res3);
      liccodelist.value = Array.isArray(res3?.data?.Examples)      // 处理返回的授权商列表数据，转换为下拉选项格式
        ? res3.data.Examples.map(e => {
            const code = e.liccode || '';                          // 处理授权商显示：代码 + 名称
            const name = e.licname || e.factName || '';
            return {
              label: code && name ? `${code} - ${name}` : (code || name || ''),
              value: e.liccode                                      // 选项值为授权商代码
            };
          })
        : [];
      filteredLicList.value = [...liccodelist.value];   // 初始化过滤列表
    } catch (error) { 
      console.error('获取授权商列表失败:', error);
      ElMessage.error('获取授权商列表失败: ' + (error?.message || '未知错误'));
      liccodelist.value = [];         // 获取授权商列表失败，清空授权商列表
      filteredLicList.value = [];
    }

    // 3. 获取客户下拉列表数据
    const res6 = await fnGetLicCustCodeList({
      po_no: form.value.po_no,       // 合同号
      lic_type: lic_type_param       // 联营类型
    });
    custcodelist.value = Array.isArray(res6?.data?.Examples)      // 处理返回的客户列表数据，转换为下拉选项格式
      ? res6.data.Examples.map(e => {                             // 处理客户显示：代码 + 名称
          const code = e.liccustcode || '';
          const name = e.liccustname || e.custName || '';
          return {
            label: code && name ? `${code} - ${name}` : (code || name || ''),
            value: e.liccustcode                                  // 选项值为客户代码
          };
        })
      : [];
    filteredCustList.value = [...custcodelist.value];     // 初始化过滤列表

    // 4. 用户权限许可证列表（根据用户权限过滤授权商）
    const resX = await fnGetLicCheckSqLicCodeList({
      userid: JSON.parse(sessionStorage.getItem('userId'))        // 用户ID
    });
    let sliccodex2 = '';
    if (resX?.data?.result?.msg?.rst === 'true') {                // 如果用户有权限限制，处理权限范围内的授权商代码
      sliccodex2 = resX.data.result.msg.msg;
      sliccodex2 = `('${sliccodex2.replace(/[ \r\n]/g, ',').replace(/,/g, "','")})`;     // 将授权商代码格式化为SQL查询所需的格式：('code1','code2','code3')
    }

    // 5. 主表格数据，带分页参数
    const params5 = {
      startdate: form.value.sdate,
      enddate: form.value.edate,
      po_no: form.value.po_no,
      lic_type: lic_type_param,
      kinds: kinds.value,
      liccode: sliccodex,
      liccustcode: custCodeStr,
      port: form.value.port || '',
      spo: form.value.po_no || '',
      iscorssdate: (form.value.crosssdate && form.value.crossedate) ? 'true' : 'false',
      crosssdate: form.value.crosssdate,
      crossedate: form.value.crossedate,
      liccode2: sliccodex2,
    };
    const res5 = await fnGetLicCheckSqDaichuData(params5);        // 调用API获取主表格数据
    const allData = Array.isArray(res5?.data?.Examples) ? snakeToCamel(res5.data.Examples) : [];    // 处理返回的数据，蛇形命名法转换为驼峰命名法
    total.value = typeof res5?.data?.total === 'number' ? res5.data.total : allData.length;         // 设置总记录数，优先使用后端返回的总数，否则使用数据长度
    // tableData.value = allData;      // 更新表格数据
 // 7. 款式状态
    const tableMap = allData.map(item => ({
      pono: item.poNo || item.po_no,     // 兼容不同字段名
      cust_code: item.custCode || item.cust_code,
      lic_type: Array.isArray(lic_type_param) ? lic_type_param[0] : lic_type_param    // 确保传递单个值而不是数组
    }));

 // 6. 构建完整的导出参数
 let params = {
     startdate: form.value.sdate,
      enddate: form.value.edate,
      po_no: form.value.po_no,
      lic_type: lic_type_param,
      kinds: kinds.value,
      liccode: sliccodex,
      liccustcode: custCodeStr,
      port: form.value.port || '',
      spo: form.value.po_no || '',
      iscorssdate: (form.value.crosssdate && form.value.crossedate) ? 'true' : 'false',
      crosssdate: form.value.crosssdate,
      crossedate: form.value.crossedate,
      liccode2: sliccodex2,
      type: type,  // 导出类型（0=查询结果，1=选中数据）
      list: list,  // 选中的项目编号列表
      includeChart: includeChart ? 'true' : 'false',
      showSheet: showSheet ? 'true' : 'false',  // 将布尔值转换为字符串传给后端
      tableMap : tableMap
     };
    console.log('导出待申请的params',params);
    console.log('type值:', params.type, '类型:', typeof params.type);
    console.log('list值:', params.list, '长度:', params.list.length);

    // 7. 调用后端导出API
    const res = await exportData(params);
    console.log('导出待申请的res',res);
  
    // 8. 处理导出结果
    if (res.data != "") {
     let base64 = res.data;  // 获取base64编码的文件数据
     excel.excelExport(res.name, base64, '.xls');  // 调用Excel导出工具下载文件
     }
  } catch (error) {
   ElMessage.warning("导出错误");  // 显示错误提示
    console.error("导出错误:", error);
  } finally {
    loading.close();  // 无论成功失败都关闭加载动画
  }
}




/***********************  预览漏查    唐金灵     8-26（修改导出功能）  ************************/

// 获取预览漏查数据
async function fetchPreviewData() {
  previewLoading.value = true;
  
  try {   

    const res = await getLcData({});
        
    const list = res.data?.list || [];
    previewTotal.value = list.length;

    console.log('✅ 获取到的漏查列表数据:', list);

    // 分页处理
    const start = (previewPagination.value.current - 1) * previewPagination.value.pageSize;
    const end = start + previewPagination.value.pageSize;
    previewTableData.value = list.slice(start, end);
    
  } catch (error) {
    console.error('❌ 获取漏查数据失败:', error);
    ElMessage.error('获取漏查数据失败: ' + (error.message || '未知错误'));
    previewTableData.value = [];
    previewTotal.value = 0;
  } finally {
    previewLoading.value = false;
  }
}

// 导出预览漏查数据
// 显示导出选项弹窗
function showExportOptions() {
  exportOptionVisible.value = true;
}

// 确认导出
async function confirmExport() {
  exportOptionVisible.value = false;
  exportLoading.value = true;
  
  try {
    if (exportOption.value === 'current') {
      await exportCurrentPage();
    } else {
      await exportAllData();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exportLoading.value = false;
  }
}

// 导出当前页
async function exportCurrentPage() {
  try {
    const data = previewTableData.value;
    if (data.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '漏查款号信息');
    XLSX.writeFile(workbook, `漏查款号信息_当前页_${new Date().toISOString().split('T')[0]}.xlsx`);
    ElMessage.success(`导出成功，共 ${data.length} 条数据`);
  } catch (error) {
    console.error('导出当前页失败:', error);
    throw error;
  }
}

// 导出全部数据
async function exportAllData() {
  try {
    // 重新获取所有数据（不分页）
    const res = await getLcData({});
    const allData = res.data?.list || [];
    
    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '漏查款号信息');
    XLSX.writeFile(workbook, `漏查款号信息_全部_${new Date().toISOString().split('T')[0]}.xlsx`);
    ElMessage.success(`导出成功，共 ${allData.length} 条数据`);
  } catch (error) {
    console.error('导出全部数据失败:', error);
    throw error;
  }
}

// 修改原来的 handleExportPreview 函数
function handleExportPreview() {
  showExportOptions(); // 显示导出选项而不是直接导出
}



// // 从响应头中提取文件名
// function getFileNameFromResponse(response) {
//   const contentDisposition = response.headers['content-disposition'];
//   if (contentDisposition) {
//     const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
//     if (fileNameMatch && fileNameMatch.length > 1) {
//       return fileNameMatch[1];
//     }
//   }
//   return null;
// }

// 初始化漏查提醒数据
async function fn_getLcData() {
  if (dontRemind.value) {
    console.log('用户已选择不再提醒，跳过弹窗显示');
    return;
  }

  const res = await getLcData();

  try {
    console.log('正在请求漏查数据...');
    
    
    console.log('漏查提醒API响应:', res);
    
    // 检查响应状态
    if (res.status !== 200) {
      throw new Error(`HTTP状态码异常: ${res.status}`);
    }
    
    // 检查业务状态
    if (res.data.code !== "0") {
      throw new Error(res.data.message || '获取数据失败');
    }
    
    const responseData = res.data.data || res.data;
    
    if (!responseData) {
      throw new Error('响应数据为空');
    }
    
    // 检查是否为"未找到调查统计数据"的情况
    if (res.data.message === '未找到调查统计数据') {
      console.log('没有漏查数据，不显示弹窗');
      return;
    }

    // 获取漏查数据
    const lyywNum = responseData.lyywNum || 0;
    const lykNum = responseData.lykNum || 0;
    
    console.log(`解析成功 - 联营业务: ${lyywNum}款, 联营款: ${lykNum}款`);
    
    // 如果没有漏查数据，不显示弹窗
    if (lyywNum === 0 && lykNum === 0) {
      console.log('没有漏查数据，不显示弹窗');
      return;
    }

    // 设置弹框内容
    lcRemindMsg.value = `未出查货申请的联营业务${lyywNum}款<br>联营款${lykNum}款<br>点击下方按钮查看完整信息`;
    
    // 显示弹框
    showLcDialog.value = true;
    console.log('弹框状态已设置为显示');
    
  } catch (error) {
    console.error('获取漏查数据失败:', error);
    
    // 根据错误类型处理
    if (error.message === '未找到调查统计数据' || error.response?.data?.message === '未找到调查统计数据') {
      console.log('没有漏查数据');
    } else if (error.response?.status === 404) {
      console.log('漏查接口不存在');
    } else {
      ElMessage.error(`获取漏查数据失败: ${error.message}`);
    }
  }
}

// 弹窗打开时加载数据
watch(showPreviewModal, (val) => {
  if (val) {
    previewPagination.value.current = 1;
    fetchPreviewData();
  }
});

// 分页处理
function handlePreviewPageChange(page) {
  previewPagination.value.current = page;
  fetchPreviewData();
}

function handlePreviewSizeChange(size) {
  previewPagination.value.pageSize = size;
  previewPagination.value.current = 1;
  fetchPreviewData();
}

// 预览漏查按钮点击事件
function handlePreviewLc() {
  showLcDialog.value = false;
  showPreviewModal.value = true;
}

// 不再提醒功能
function handleDontRemind() {
  setDontRemind();
  showLcDialog.value = false;
}

function setDontRemind() {
  const settings = {
    dontRemind: true,
    expires: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3天后过期
  };
  localStorage.setItem('dontRemindLicdaichu', JSON.stringify(settings));
  dontRemind.value = true;
}

// 修改初始化代码
onMounted(async () => {
  // 初始化不再提醒设置
  const savedSettings = localStorage.getItem('dontRemindLicdaichu');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    // 检查是否过期
    dontRemind.value = settings.dontRemind && (!settings.expires || settings.expires > Date.now());
  }

  // 1. 从 sessionStorage 恢复全局选择状态
  const hasRestoredFromSession = restoreGlobalSelectionFromSession();
  
  fn_time();
  await initDropdownData();
  await fnGetData();
  
  // 2. 数据加载完成后，如果有全局选择状态，恢复当前页的选择
  if (hasRestoredFromSession && globalSelectedRows.value.length > 0) {
    nextTick(() => {
      restoreCurrentPageSelection();
    });
  }
  
  // 只有用户没有选择"不再提醒"时才获取漏查数据
  if (!dontRemind.value) {
    fn_getLcData();
  }
});

// 在适当的位置添加重置功能
function resetDontRemind() {
  localStorage.removeItem('dontRemindLicdaichu');
  dontRemind.value = false;
  fn_getLcData(); // 重新显示弹窗
}

// 页面加载时自动弹出
onMounted(async () => {
  fn_time(); // 自动设置日期范围
  await initDropdownData();
  await fnGetData();
  fn_getLcData();
});


/***********************  导   入   开   始  ***********************/
// 导入相关响应式变量
const visible = reactive({
  productImport: false
});
const uploadSetting = reactive({
  limit: 1,
  isAutoUpload: false,
  headers: {
    'Authorization-admin': getToken(),
  },
  accept: '.xlsx,.xls'
});
const batchFileList = ref([]);

// 导入相关方法
function sends() {
  visible.productImport = true;        // 显示导入对话框
  batchFileList.value = [];            // 清空文件列表（避免残留上次文件）
}

function uploadFile() {
  if (batchFileList.value.length === 0) {
    ElMessage.warning('请上传文件');
  } else {
    const file = batchFileList.value[0];
    // 前端本地解析Excel
    readExcelFromFile(file)
      .then((mapped) => {
        if (!mapped || mapped.length === 0) {
          ElMessage.error('导入失败：未解析到数据，请检查Excel模板与内容');
          return;
        }
        // 映射为新增页表格字段结构
        const forDisplay = (mapped || []).map((r, idx) => {
          const midTailTxt = (r.BC_QS === '1' || r.BC_QS === 1 || r.BC_QS === '中期') ? '中期'
            : (r.BC_QS === '3' || r.BC_QS === 3 || r.BC_QS === '尾期') ? '尾期' : '';
          const contract = r.PO_NO || '';
          return {
            applyNo: r.applyNo || `AP${new Date().getFullYear()}${String(idx + 1).padStart(4, '0')}`,
            // 新增这行，供新增组件识别"选中的合同号"
            poNo: contract,
            contractNo: contract,
            shipmentBatch: r.BC_SEQ ?? '',
            contractQty: r.bc_totalNum ?? '',
            midTail: midTailTxt,
            checkCount: r.BC_NUM ?? '',
            applyCount: r.applyCount ?? '',
            applyCheckDate: r.BC_PLANDATE ?? '',
            applyRemark: r.BC_PLANREMARK ?? '',
            checkResult: r.checkResult ?? '',
            businessType: r.lic_type || '联营业务',
            oid: r.oid || `import_${Date.now()}_${idx}`,
          };
        });
        // 调试：打印映射后的数据
        try {
          console.log('映射后的新增页数据（前10行）:', JSON.stringify(forDisplay.slice(0, 10), null, 2));
          console.log('映射后的新增页数据 总行数:', forDisplay.length);
          forDisplay.forEach((row, i) => {
            if (!row.contractNo) {
              console.warn(`第 ${i + 1} 行缺少 contractNo（源 PO_NO 可能为空）`, row);
            }
          });
        } catch (e) {
          console.warn('打印映射数据日志出错:', e);
        }
        sessionStorage.setItem('importedData', JSON.stringify(forDisplay));
        sessionStorage.setItem('selectedRows', JSON.stringify(forDisplay)); // 新增这行
        sessionStorage.setItem('isFromImport', 'true');
        globalSelectedRows.value = forDisplay;
        tableSelectList.value = forDisplay;
        visible.productImport = false;
        batchFileList.value = [];
        // 打开新增详情弹窗
        showAddDialog.value = true;
        ElMessage.success('导入成功');
      })
      .catch((err) => {
        console.error('本地解析Excel失败:', err);
        ElMessage.error('解析Excel失败，请检查文件格式与内容');
      });
  }
}

// Excel日期格式化
function formatExcelSerialDate(num, format = '-') {
  const n = Number(num);
  if (Number.isNaN(n)) return '';
  let millisecond = 0;
  if (n > 60) {
    millisecond = (n - 25569) * 60 * 60 * 24 * 1000;
  } else {
    millisecond = (n - 25568) * 60 * 60 * 24 * 1000;
  }
  const date = new Date(millisecond);
  const yy = date.getFullYear();
  const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return `${yy}${format}${mm}${format}${dd}`;
}

// 将工作表数据映射为新增页所需字段
function mapRowToAddFields(row, index) {
  // 兼容多种表头：中文/英文字段，统一以字符串保真
  const get = (r, keys, def = '') => {
    for (const k of keys) {
      if (r[k] !== undefined && r[k] !== null && r[k] !== '') {
        const v = r[k];
        return typeof v === 'string' ? v : (v === undefined || v === null ? def : String(v));
      }
    }
    return def;
  };

  // 原始字段
  const PO_NO = get(row, [
    '合同号', '款号', 'PO号', 'PO_NO', 'po_no', '合同', 'pono', 'PO', '合同号/款号'
  ]);
  const BC_QS = get(row, [
    '中尾期', 'midTail', 'bc_qs'
  ]);
  const BC_SEQ = get(row, [
    '出货批次', 'batchNo', '批次', '合同批次', 'po_seq'
  ]);
  const BC_NUM = get(row, [
    '查货次数', 'checkCount'
  ]);
  const BC_PLANDATE = get(row, [
    '查货日期(不填默认当前日期)', '申请查货日期', '申请日期', 'applyCheckDate', 'bc_plandate'
  ]);
  const bc_checkScrit = get(row, [
    '查货标准'
  ]);
  const bc_totalNum = get(row, [
    '落货总数(不填默认0)', '落货总数'
  ]);
  const bc_color = get(row, [
    '颜色'
  ]);
  const BC_PLANREMARK = get(row, [
    '洋行及问题跟进', '申请备注', 'remarks', 'applyRemark', 'bc_planremark'
  ]);
  const checkResult = get(row, [
    '查货接受', '查货结果'
  ]);
  const lic_type = get(row, [
    '联营类型', '联营业务/联营款', 'businessType', '联营类型'
  ]);

  const normalizeDate = (v) => {
    if (v === undefined || v === null || v === '') return '';
    // 数字当作Excel序列号
    if (typeof v === 'number') return formatExcelSerialDate(v, '-');
    // 字符串尝试截断或原样
    const s = String(v).trim();
    if (!s) return '';
    // 形如 2024-01-02 或 2024/01/02
    if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(s)) {
      const d = new Date(s.replace(/\//g, '-'));
      if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    // 尝试直接 new Date
    const d2 = new Date(s);
    if (!isNaN(d2.getTime())) return `${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,'0')}-${String(d2.getDate()).padStart(2,'0')}`;
    return s;
  };

  return {
    applyNo: `AP${new Date().getFullYear()}${String(index + 1).padStart(4, '0')}`,
    PO_NO: PO_NO || '',
    BC_QS: BC_QS || '',
    BC_SEQ: BC_SEQ || 0,
    BC_NUM: BC_NUM || 0,
    BC_PLANDATE: BC_PLANDATE || '',
    bc_checkScrit: bc_checkScrit || '',
    bc_totalNum: bc_totalNum || '',
    bc_color: bc_color || '',
    BC_PLANREMARK: BC_PLANREMARK || '',
    checkResult: checkResult || '',
    lic_type: (lic_type === 1 || lic_type === '1') ? '联营款' : (lic_type || '联营业务'),
    oid: `import_${Date.now()}_${index}`
  };
}

// 从文件解析Excel为新增页数据
async function readExcelFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], { raw: false, defval: '' });
        // 调试：打印原始表数据与表头
        try {
          if (ws && ws.length > 0) {
            console.log('Excel表头字段(keys):', Object.keys(ws[0]));
          }
          console.log('Excel原始sheet JSON（前10行）:', JSON.stringify(ws.slice(0, 10), null, 2));
          console.log('Excel原始sheet 总行数:', ws.length);
        } catch (e) {
          console.warn('打印Excel原始数据日志出错:', e);
        }
        // 映射为新增页面字段
        const mapped = ws.map((row, idx) => mapRowToAddFields(row, idx));
        resolve(mapped);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

function beforeUploadFile(file) {
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  const size = file.size / 1024 / 1024;
  if (extension !== 'xlsx' && extension !== 'xls') {
    ElMessage.warning('只能上传后缀是.xlsx和.xls的文件');
    return false;
  }
  if (size > 10) {
    ElMessage.warning('文件大小不得超过10M');
    return false;
  }
  return true;
}

function fileChange(file, fileList) {
  batchFileList.value = fileList.map(f => f.raw);
}
function batchRemove(file, fileList) {
  batchFileList.value = fileList.map(f => f.raw);
}
function exceedFile(files, fileList) {
  ElMessage.warning('只能选择1个文件');
}
function handleSuccess(res, file, fileList) {
  ElMessage.success('文件上传成功');
}
function handleError() {
  ElMessage.error('文件上传失败');
}

//下载模板
function poDownload() {
  axios.post('/api/etdslicdaichuSq/downloadTemplate', {}, {
    responseType: 'blob',
    headers: { 'Authorization-admin': getToken() }
  })
    .then(res => {
      const blob = new Blob([res.data]);
      const fileName = '联营商查货批量导入模板.xlsx';
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        navigator.msSaveBlob(blob, fileName);
      }
      ElMessage.success('模板下载成功');
    })
    .catch(error => {
      console.error('模板下载失败:', error);
      let errorMsg = '模板下载失败';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMsg = '模板下载接口不存在';
        } else if (error.response.status === 500) {
          errorMsg = '服务器内部错误';
        } else {
          errorMsg = `下载失败 (${error.response.status})`;
        }
      }
      
      ElMessage.error(errorMsg);
    });
}

// 工具函数：从 cookie 获取 token
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return undefined;
// }

const radio1 = ref('0'); // 假设你有 radio1 变量
// const domain = ref(JSON.parse(localStorage.getItem('domain')) || null);

/***********************  导   入   结   束  ***********************/


const showDtlDialog = ref(false);
const DtlComponent = defineAsyncComponent(() => import('./licdaichuSqdtl.vue'));
const showAddDialog = ref(false);
const AddDtlComponent = defineAsyncComponent(() => import('./addtl .vue'));
const showEditDialog = ref(false);
const EditComponent = defineAsyncComponent(() => import('./licSqReport/xiugai.vue'));

// 处理新增
const handleAdd = async () => {
  
  // 检查是否选择了合同
  if (!globalSelectedRows.value || globalSelectedRows.value.length === 0) {    // 使用全局选择检查
    ElMessage.error('需选择申请查货合同号');
    return;
  }

  try {
    // 1. 首先检查评仓状态
    console.log('开始检查评仓状态...');
    const portStatusPromises = globalSelectedRows.value.map(row => ({
      promise: fnCheckPortStatus({
        po_no: row.po_no || row.poNo || '',
        lic_type: Array.isArray(lic_type.value) ? lic_type.value[0] : lic_type.value
      }),
      po_no: row.po_no || row.poNo || ''
    }));

    const portStatusResults = await Promise.all(portStatusPromises.map(item => item.promise));
    
    // 检查是否有未评仓的合同，并收集未评仓的合同号
    const unCheckedPorts = [];
    portStatusResults.forEach((result, index) => {
      if (!result?.data?.Examples || result.data.Examples.length === 0) {
        unCheckedPorts.push(portStatusPromises[index].po_no);
      }
    });

    if (unCheckedPorts.length > 0) {
      const unCheckedPortsMsg = `以下合同号未评仓：<br>${unCheckedPorts.join(', ')}<br>是否继续？`;
      await ElMessageBox.confirm(
        unCheckedPortsMsg,
        '未评仓提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true  // 允许使用HTML标签
        }
      );
    }
    
    // // 对每个选中合同进行重复申请检查
    // const duplicateContracts = [];
    // const styleNumbersMap = {};
    
    // // 构建款号和合同号的映射关系
    // globalSelectedRows.value.forEach(row => {
    //   const styleNo = row.poStyle || row.po_style || '';
    //   const poNo = row.po_no || row.poNo || '';
    //   if (styleNo && styleNo.trim() !== '') {
    //     styleNumbersMap[styleNo] = poNo;
    //   }
    // });
    
    // const styleNumbers = Object.keys(styleNumbersMap);
    // console.log('检查重复申请，款号列表:', styleNumbers);
    
    // if (styleNumbers.length > 0) {
    //   // 批量检查所有款号
    //   const duplicateCheckParams = {
    //     style_no: JSON.stringify(styleNumbers),  // 传递所有款号
    //     lic_type: Array.isArray(lic_type.value) ? lic_type.value[0] : lic_type.value
    //   };
      
    //   try {
    //     const duplicateResult = await fnGetlicCheckSq_ly(duplicateCheckParams);
    //     console.log('重复检查结果:', duplicateResult);
        
    //     if (duplicateResult && duplicateResult.data && duplicateResult.data.Examples && duplicateResult.data.Examples.length > 0) {
    //       // 处理返回的重复申请结果
    //       duplicateResult.data.Examples.forEach(checkResult => {
    //         if (checkResult.rst === "1" && checkResult.style_no) {
    //           // 发现重复申请
    //           const styleNo = checkResult.style_no;
    //           const poNo = styleNumbersMap[styleNo];
    //           duplicateContracts.push({
    //             styleNo: styleNo,
    //             poNo: poNo
    //           });
    //           console.log(`发现重复申请 - 款号: ${styleNo}, 合同号: ${poNo}`);
    //         }
    //       });
    //     }
    //   } catch (error) {
    //     // 出现异常时也要提示用户
    //     ElMessage.warning('检查重复申请时出现异常，请稍后重试');
    //     return;
    //   }
    // }
    
    // // 如果有重复申请，显示详细提示
    // if (duplicateContracts.length > 0) {
    //   const duplicateList = duplicateContracts
    //     .map(item => `${item.poNo} `)
    //     .join('\n');
      
    //   const duplicateMsg = `以下合同已存在申请记录：\n${duplicateList},\n是否继续？`;
      
    //   await ElMessageBox.confirm(
    //     duplicateMsg,
    //     '重复申请提示',
    //     {
    //       confirmButtonText: '继续',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //       customClass: 'duplicate-warning-dialog'
    //     }
    //   );
    // }

    // 3. 所有检查通过，存储数据并打开新增弹窗
    sessionStorage.setItem('selectedRows', JSON.stringify(globalSelectedRows.value));     // 使用全局选择存储
    sessionStorage.setItem('currentLicType', JSON.stringify(lic_type.value));       // 以便在新增详情页面组件中可以获取这些数据
    sessionStorage.setItem('currentPort', JSON.stringify(form.value?.port || ''));
    showAddDialog.value = true;        // 设置 showAddDialog 响应式变量为 true，触发显示新增详情弹窗

  } catch (error) {
    if (error !== 'cancel') {
      console.error('新增处理失败:', error);
      ElMessage.error('操作失败: ' + (error?.message || '未知错误'));
    }
    // 如果用户取消或检查失败，不显示弹窗
    return;
  }
};

/**
 * 修改功能 - 带未评仓提示检查和数据存在性检查
 * 功能：处理用户点击修改按钮时的逻辑，包括评仓状态检查、数据存在性检查和弹窗显示
 * 时间：2025.09.04
 * 作者：黄浩萌
 * 
 * 主要功能：
 * 1. 验证是否选择了合同
 * 2. 检查选中合同的评仓状态
 * 3. 如有未评仓合同，显示提示弹窗询问用户是否继续
 * 4. 检查选中合同是否有已存在的修改记录
 * 5. 如无数据，显示"暂无数据，是否新增？"提示弹窗
 * 6. 用户选择"是"则跳转到新增弹窗，选择"否"则取消操作
 * 7. 有数据则正常打开修改弹窗
 */
async function edit() {
  // 检查是否选择了合同
  if (!selectedRows.value || selectedRows.value.length === 0) {
    ElMessage.error('需选择申请查货合同号');
    return;
  }

  try {
    // 1. 首先检查评仓状态
    console.log('开始检查评仓状态...');
    const portStatusPromises = selectedRows.value.map(row => ({
      promise: fnCheckPortStatus({
        po_no: row.po_no || row.poNo || '',
        lic_type: Array.isArray(lic_type.value) ? lic_type.value[0] : lic_type.value
      }),
      po_no: row.po_no || row.poNo || ''
    }));

    const portStatusResults = await Promise.all(portStatusPromises.map(item => item.promise));
    
    // 检查是否有未评仓的合同，并收集未评仓的合同号
    const unCheckedPorts = [];
    portStatusResults.forEach((result, index) => {
      if (!result?.data?.Examples || result.data.Examples.length === 0) {
        unCheckedPorts.push(portStatusPromises[index].po_no);
      }
    });

    if (unCheckedPorts.length > 0) {
      const unCheckedPortsMsg = `以下合同号未评仓：<br>${unCheckedPorts.join(', ')},<br>是否继续？`;
      await ElMessageBox.confirm(
        unCheckedPortsMsg,
        '未评仓提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true  // 允许使用HTML标签
        }
      );
    }
    
    // 2. 检查选中合同是否有已存在的新增记录--黄浩萌 2025.09.04
    console.log('开始检查数据存在性...');
    const { selectedList, licTypeValue } = getEditDataParams();
    const uniquePoList = getEditUniquePoList(selectedList);

    if (uniquePoList.length === 0) {
      ElMessage.warning('未获取到选中的合同号，无法检查数据');
      return;
    }

    const checkParams = {
      polist: "'" + uniquePoList.join("','") + "'",
      sq_poqtylist: uniquePoList.join(','),
      is_sqsorlys: licTypeValue
    };
    
    const checkResponse = await fnGetlicCheckSqDetail(checkParams);
    
    // 3. 根据检查结果决定后续操作
    if (!checkResponse?.data?.Examples || checkResponse.data.Examples.length === 0) {
      // 没有数据，显示提示弹窗询问是否新增
      try {
        await ElMessageBox.confirm(
          '暂无数据，是否新增？',
          '提示',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'info',
          }
        );
        // 用户点击"是"，跳转到新增页面
        handleEditToAdd();
      } catch (confirmError) {
        // 用户点击"否"或关闭弹窗
        if (confirmError !== 'cancel') {
          ElMessage.info('用户取消操作');
        }
        return;
      }
    } else {
      // 有数据，正常打开修改弹窗
      sessionStorage.setItem('selectedRows', JSON.stringify(selectedRows.value));
      sessionStorage.setItem('currentLicType', JSON.stringify(lic_type.value));
      sessionStorage.setItem('currentPort', JSON.stringify(form.value?.port || ''));
      
      showEditDialog.value = true;
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改处理失败:', error);
      ElMessage.error('操作失败: ' + (error?.message || '未知错误'));
    }
    // 如果用户取消或检查失败，不显示弹窗
    return;
  }
}

/**
 * 获取修改功能的数据参数
 * 功能：从选中的行数据中获取合同号和联营类型
 * 时间：2025.09.04
 * 作者：黄浩萌
 */
function getEditDataParams() {
  let selectedList = selectedRows.value || [];
  let licTypeValue = Array.isArray(lic_type.value) ? lic_type.value[0] || '0' : lic_type.value || '0';
  
  return { selectedList, licTypeValue };
}

/**
 * 获取修改功能的唯一合同号列表
 * 功能：从选中的行数据中提取唯一的合同号列表，支持不同字段名兼容
 * 时间：2025.09.04
 * 作者：黄浩萌
 */
function getEditUniquePoList(selectedList) {
  const poListArr = selectedList
    .map(row => (row.poNo || row.po_no || '').toString().trim())
    .filter(Boolean);
  return Array.from(new Set(poListArr));
}

/**
 * 从修改跳转到新增功能
 * 功能：当用户确认新增时，关闭修改弹窗并打开新增弹窗
 * 时间：2025.09.04
 * 作者：黄浩萌
 */
function handleEditToAdd() {
  // 存储数据到sessionStorage，用于新增页面
  sessionStorage.setItem('selectedRows', JSON.stringify(selectedRows.value));
  sessionStorage.setItem('currentLicType', JSON.stringify(lic_type.value));
  sessionStorage.setItem('currentPort', JSON.stringify(form.value?.port || ''));
  
  // 关闭修改弹窗（如果已打开）
  showEditDialog.value = false;
  
  // 打开新增弹窗
  showAddDialog.value = true;
  
  ElMessage.success('正在跳转到新增页面...');
}

// 翻查-前端正常页面版本
// function fn_add() {
//   if (!selectedRows.value || selectedRows.value.length === 0) {
//     ElMessage.error('需选择申请查货合同号');
//     return;
//   }

//   showDtlDialog.value = true;
// }
// function fn_add() {}
// function edit() {
//   ElMessage.info('修改功能待开发');
// }
// function fn_mjadd() {}

// 修改 fn_add 函数-翻查实现
// async function fn_add() {
//   // 1. 验证选择
//   if (!selectedRows.value || selectedRows.value.length === 0) {
//     ElMessage.error('需选择申请查货合同号');
//     return;
//   }

//   try {
//     // 2. 检查评仓状态
//     const checkParams = {
//       selected: selectedRows.value,
//       lic_type: lic_type.value,
//     };

//     const checkRes = await checkLicPortStatus(checkParams);

//     // 如果存在未评仓的合同申请，提示用户确认
//     if (checkRes.data?.result?.Examples === true) {
//       try {
//         await ElMessageBox.confirm(
//           '存在未评仓的合同申请,是否继续?',
//           '提示',
//           {
//             confirmButtonText: '确认',
//             cancelButtonText: '取消',
//             type: 'warning',
//           }
//         );
//         // 用户点击确认后继续执行
//         processSelectedData();
//       } catch (action) {
//         // 用户点击取消或关闭对话框
//         return;
//       }
//     } else {
//       // 无未评仓合同，直接处理数据
//       processSelectedData();
//     }
//   } catch (error) {
//     console.error('检查评仓状态失败:', error);
//     ElMessage.error('检查评仓状态失败');
//   }
// }

// 处理选中数据的函数
function processSelectedData() {
  try {
    // 3. 处理选中数据
    const polist = [];
    let po_qty = 0;
    const po_qtylist = [];
    const style_nolist = [];

    for (let rr = 0; rr < selectedRows.value.length; rr++) {
      // 收集合同号、款号等信息
      const po_no = selectedRows.value[rr].poNo?.replace(/\s*$/g, '') || '';
      const po_style = selectedRows.value[rr].poStyle?.replace(/\s*$/g, '') || '';
      
      polist.push(po_no);
      style_nolist.push(po_style);
      po_qty += selectedRows.value[rr].poShipqty;

      po_qtylist.push({
        "po_no": po_no,
        "po_qty": selectedRows.value[rr].poShipqty,
        "po_shipdate": selectedRows.value[rr].poShipdate,
        "po_seq": selectedRows.value[rr].poSeq,
      });
    }

    // 检查是否有重复合同号
    if (isRepeat(polist)) {
      ElMessage.error('多选时不能选择相同的合同,请检查');
      return;
    }

    // 4. 存储翻查相关信息到 sessionStorage
    sessionStorage.setItem('sq_polist', JSON.stringify(polist));
    sessionStorage.setItem('sq_poqty', JSON.stringify(po_qty));
    sessionStorage.setItem('style_nolist', JSON.stringify(style_nolist));
    sessionStorage.setItem('plstatus', JSON.stringify(""));
    sessionStorage.setItem('sq_buttons', '翻查');
    sessionStorage.setItem('selected', JSON.stringify(selectedRows.value));
    
    if (selectedRows.value.length > 1) {
      sessionStorage.setItem('plstatus', JSON.stringify("(批量)"));
    }
    
    sessionStorage.setItem('sq_poqtylist', JSON.stringify(po_qtylist));
    sessionStorage.setItem('sq_mj', JSON.stringify("非免检"));
    
    for (let rr = 0; rr < selectedRows.value.length; rr++) {
      if (selectedRows.value[rr].isMj === "免检") {
        sessionStorage.setItem('sq_mj', JSON.stringify(selectedRows.value[rr].isMj));
        break;
      }
    }

    const style_no = JSON.parse(sessionStorage.getItem("style_nolist")) || [];
    const lic_type_val = lic_type.value.includes('0') ? 1 : 0;

    sessionStorage.setItem('is_sqsorlys', JSON.stringify(lic_type.value));
    
    // 5. 获取联营翻查数据
    getLicCheckSqLyData(style_no, lic_type_val);
  } catch (error) {
    console.error('处理选中数据失败:', error);
    ElMessage.error('处理选中数据失败');
  }
}

// 获取联营翻查数据
async function getLicCheckSqLyData(style_no, lic_type_val) {
  try {
    const params = {
      style_no: JSON.stringify(style_no),
      lic_type: lic_type_val,
    };

    // 发送请求获取联营翻查数据
    const res = await getLicCheckSqLy(params);
    
    // 设置路由返回信息
    sessionStorage.setItem('routerback', JSON.stringify("Y"));
    sessionStorage.setItem('routerbackpath', JSON.stringify("/lichome"));
    
    console.log('88888888888');
    // 跳转到翻查详情页
    router.push({ path: '/licdaichuSq/licdaichuSqdtl' });
  } catch (error) {
    console.error('获取联营翻查数据失败:', error);
    ElMessage.error('获取联营翻查数据失败');
  }
}

// 添加 dialogKey 用于强制刷新组件
const dialogKey = ref(0);

// 弹窗打开时的回调
const onDialogOpened = () => {
  dialogKey.value++;
}

// 弹窗关闭时的回调
const onDialogClosed = () => {
  // 可以在这里做一些清理工作
}

/**
 * 翻查功能 - 带未评仓提示检查
 * 功能：处理用户点击翻查按钮时的逻辑，包括评仓状态检查和翻查数据处理
 * 时间：2025.09.04
 * 作者：黄浩萌
 * 
 * 主要功能：
 * 1. 验证是否选择了合同
 * 2. 检查选中合同的评仓状态
 * 3. 如有未评仓合同，显示提示弹窗询问用户是否继续
 * 4. 所有检查通过后，继续处理翻查数据并打开翻查弹窗
 */
async function fn_add() {
  // 1. 验证选择
  if (!selectedRows.value || selectedRows.value.length === 0) {
    ElMessage.error('需选择申请查货合同号');
    return;
  }

  try {
    // 2. 首先检查评仓状态
    console.log('开始检查评仓状态...');
    const portStatusPromises = selectedRows.value.map(row => ({
      promise: fnCheckPortStatus({
        po_no: row.po_no || row.poNo || '',
        lic_type: Array.isArray(lic_type.value) ? lic_type.value[0] : lic_type.value
      }),
      po_no: row.po_no || row.poNo || ''
    }));

    const portStatusResults = await Promise.all(portStatusPromises.map(item => item.promise));
    
    // 检查是否有未评仓的合同，并收集未评仓的合同号
    const unCheckedPorts = [];
    portStatusResults.forEach((result, index) => {
      if (!result?.data?.Examples || result.data.Examples.length === 0) {
        unCheckedPorts.push(portStatusPromises[index].po_no);
      }
    });

    if (unCheckedPorts.length > 0) {
      const unCheckedPortsMsg = `以下合同号未评仓：<br>${unCheckedPorts.join(', ')},<br>是否继续？`;
      await ElMessageBox.confirm(
        unCheckedPortsMsg,
        '未评仓提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true  // 允许使用HTML标签
        }
      );
    }
    
    // 3. 所有检查通过，继续处理翻查数据
    processSelectedDataForDialog();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('翻查处理失败:', error);
      ElMessage.error('操作失败: ' + (error?.message || '未知错误'));
    }
    // 如果用户取消或检查失败，不继续执行
    return;
  }
}

// 处理选中数据并打开弹窗的函数
function processSelectedDataForDialog() {
  try {
    // 3. 处理选中数据
    const polist = [];
    let po_qty = 0;
    const po_qtylist = [];
    const style_nolist = [];

    for (let rr = 0; rr < selectedRows.value.length; rr++) {
      // 收集合同号、款号等信息
      const po_no = selectedRows.value[rr].poNo?.replace(/\s*$/g, '') || '';
      const po_style = selectedRows.value[rr].poStyle?.replace(/\s*$/g, '') || '';
      
      polist.push(po_no);
      style_nolist.push(po_style);
      po_qty += selectedRows.value[rr].poShipqty;

      po_qtylist.push({
        "po_no": po_no,
        "po_qty": selectedRows.value[rr].poShipqty,
        "po_shipdate": selectedRows.value[rr].poShipdate,
        "po_seq": selectedRows.value[rr].poSeq,
      });
    }

    // 检查是否有重复合同号
    if (isRepeat(polist)) {
      ElMessage.error('多选时不能选择相同的合同,请检查');
      return;
    }

    // 4. 存储翻查相关信息到 sessionStorage
    sessionStorage.setItem('sq_polist', JSON.stringify(polist));
    sessionStorage.setItem('sq_poqty', JSON.stringify(po_qty));
    sessionStorage.setItem('style_nolist', JSON.stringify(style_nolist));
    sessionStorage.setItem('plstatus', JSON.stringify(""));
    sessionStorage.setItem('sq_buttons', '翻查');
    sessionStorage.setItem('selected', JSON.stringify(selectedRows.value));
    
    if (selectedRows.value.length > 1) {
      sessionStorage.setItem('plstatus', JSON.stringify("(批量)"));
    }
    
    sessionStorage.setItem('sq_poqtylist', JSON.stringify(po_qtylist));
    sessionStorage.setItem('sq_mj', JSON.stringify("非免检"));
    
    for (let rr = 0; rr < selectedRows.value.length; rr++) {
      if (selectedRows.value[rr].isMj === "免检") {
        sessionStorage.setItem('sq_mj', JSON.stringify(selectedRows.value[rr].isMj));
        break;
      }
    }

    const style_no = JSON.parse(sessionStorage.getItem("style_nolist")) || [];
    const lic_type_val = lic_type.value.includes('0') ? 1 : 0;

    sessionStorage.setItem('is_sqsorlys', JSON.stringify(lic_type.value));
    
    // 5. 获取联营翻查数据
    getLicCheckSqLyDataForDialog(style_no, lic_type_val);
  } catch (error) {
    console.error('处理选中数据失败:', error);
    ElMessage.error('处理选中数据失败');
  }
}

// 获取联营翻查数据并打开弹窗
async function getLicCheckSqLyDataForDialog(style_no, lic_type_val) {
  try {
    const params = {
      style_no: JSON.stringify(style_no),
      lic_type: lic_type_val,
    };

    // 发送请求获取联营翻查数据
    const res = await getLicCheckSqLy(params);
    
    // 设置路由返回信息
    sessionStorage.setItem('routerback', JSON.stringify("Y"));
    sessionStorage.setItem('routerbackpath', JSON.stringify("/lichome"));
    
    // 打开弹窗而不是跳转页面
    showDtlDialog.value = true;
  } catch (error) {
    console.error('获取联营翻查数据失败:', error);
    ElMessage.error('获取联营翻查数据失败');
  }
}

// 翻查旧版本
// function fn_add() {
//   if (!selectedRows.value || selectedRows.value.length === 0) {
//     ElMessage.error('需选择申请查货合同号');
//     return;
//   }

/**
 * 处理从修改页面跳转到新增页面
 * 黄浩萌修改于2025/8/27
 * 功能：当用户在修改页面点击"是"确认新增时，关闭修改弹窗并打开新增弹窗
 */
function handleOpenAddFromEdit(data) {
  // 关闭修改弹窗
  showEditDialog.value = false
  
  // 更新选中的行数据（如果从修改页面传递了新的数据）
  if (data && data.selectedRows) {
    selectedRows.value = data.selectedRows
  }
  if (data && data.licType) {
    lic_type.value = data.licType
  }
  
  // 存储数据到sessionStorage
  sessionStorage.setItem('selectedRows', JSON.stringify(selectedRows.value))
  sessionStorage.setItem('currentLicType', JSON.stringify(lic_type.value))
  sessionStorage.setItem('currentPort', JSON.stringify(form.value?.port || ''))
  
  // 打开新增弹窗
  showAddDialog.value = true
}
function fn_mjadd() {}

function isRepeat(arr) {
  const unique = [...new Set(arr)];
  return unique.length !== arr.length;
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.second-main-container{
  width: 95%;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 13px rgba(83, 117, 227, 0.1);
}
.button-module {
  margin-bottom: 0;
}
.button-area {
  display: flex;
  gap: 12px;
}
.form-area {
  margin-bottom: 16px;
}
.table-area {
  width: 100%;
}
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.mode-switch {
  margin-top: 24px;
  margin-bottom: 16px;
}
.lc-remind-dialog {
  top: 10vh !important;
  margin: 0 auto;
  left: 0;
  right: 0;
}
// 导入
.clickMe {
  color: #3a68f2;
  cursor: pointer;
}
/* 表单布局优化 */
.search-form {
  overflow: visible;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.form-item {
  margin-bottom: 0 !important;
  margin-right: 0 !important;
}

.form-item-wide {
  flex: 1;
}

/* 日期范围组件 */
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
  margin: 0 4px;
}

/* 表单标签统一宽度 */
:deep(.form-item .el-form-item__label) {
  width: 80px !important;
  text-align: left;
  padding-right: 12px;
  font-weight: bold;
}

/* 长标签特殊处理 */
:deep(.form-item-long-label .el-form-item__label) {
  width: 120px !important;
  text-align: left;
  white-space: nowrap;
}

/* 设置下拉菜单的最小和最大宽度，确保内容能够完整显示 */
:deep(.wide-select-dropdown) {
  min-width: 300px !important;
  max-width: 500px !important;
  z-index: 9999 !important;
}

:deep(.wide-select-dropdown .el-select-dropdown__item) {
  white-space: normal;            /* 允许文本换行 */
  word-wrap: break-word;          /* 允许单词换行 */
  line-height: 1.4;               /* 允许文本行高 */
  padding: 8px 12px;
  max-width: 100%;
}

/* 确保表单区域有足够空间 */
.form-area {
  margin-bottom: 16px;
  overflow: visible;
  padding: 8px 0;
}

/* 导出弹窗选项对齐样式 */
.export-dialog-content {
  padding: 20px 0;
}

.export-option-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
  min-height: 32px;
}

.export-option-label {
  width: 110px;
  font-weight: 500;
  text-align: left;
  margin-right: 16px;
  flex-shrink: 0;
  display: inline-block;
}

.export-radio-group {
  flex: 1;
  display: flex;
  align-items: center;
}

.export-radio-group :deep(.el-radio) {
  margin-right: 24px;
  height: 32px;
  display: flex;
  align-items: center;
}

.export-radio-group :deep(.el-radio__input) {
  margin-right: 8px;
}

.export-radio-group :deep(.el-radio__label) {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
  padding-left: 0;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
.uploadDialog {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  :deep(.el-upload__tip) {
    display: inline-block;
    width: 360px;
    margin: auto;
  }

// .uploadDialog {
//   // display: flex;
//   // flex-direction: column;
//   // justify-content: center;
//   :deep(.el-upload__tip) {
//     display: inline-block;
//     width: 360px;
    margin: auto;
  }
  
  .form-item {
    width: 100%;
  }
  
  :deep(.form-item .el-form-item__label) {
    width: 120px !important;
  }
}



.summary-info-inline {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  margin: 20px 0;
  gap: 40px; // 可调整此值来控制间距大小
}
.summary-info-inline span {
  margin: 0 60px;
}

.divider-line {
  height: 1px;
  background-color: #DCDFE6;
  margin: 0 0;
  width: 100%;
}

/* 重复申请警告对话框样式 */
:deep(.duplicate-warning-dialog) {
  .el-message-box__content {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .el-message-box__message {
    white-space: pre-line;
    line-height: 1.6;
    font-size: 14px;
  }
}

/* 添加导出弹窗相关样式 */
:deep(.export-dialog-box) {
  .el-message-box__header {
    background-color: #4e73df !important;
    background: #4e73df !important;
    padding: 16px 20px !important;
    margin: 0 !important;
    border-radius: 4px 4px 0 0 !important;
    text-align: left !important;
    
    .el-message-box__title {
      color: #fff !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      text-align: left !important;
    }
    
    .el-message-box__headerbtn {
      top: 16px !important;
      right: 16px !important;
      
      .el-message-box__close {
        color: #fff !important;
        font-size: 16px !important;
      }
    }
  }
}
.summary-info-inline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;  /* 为新增的选项留出间距 */
}

.export-label {
  font-size: 14px;
  margin: 25px 0;
  gap: 40px; // 可调整此值来控制间距大小
}
.summary-info-inline span {
  margin: 0 60px;
}

.divider-line {
  height: 1px;
  background-color: #DCDFE6;
  margin: 0 0;
  width: 100%;
}

.export-radio-group :deep(.el-radio__label) {
  font-size: 14px;
}

/* 新增尺码表选项样式 */
.row {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}


/* 导出选项弹窗样式 */
.export-option-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;
  }
  
  :deep(.el-dialog__header) {
    background: #fff;
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #DCDFE6;
    
    .el-dialog__title {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  :deep(.el-dialog__footer) {
    padding: 16px 20px;
    border-top: 1px solid #DCDFE6;
  }
}

.export-option-content {
  padding: 20px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-option-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  
  &:hover {
    border-color: #409eff;
    background: #f5f7fa;
  }
  
  &.export-option-card--active {
    border-color: #409eff;
    background: #f0f7ff;
  }
}

.option-radio {
  margin-right: 12px;
  margin-top: 2px;
  
  :deep(.el-radio) {
    .el-radio__input.is-checked .el-radio__inner {
      background: #409eff;
      border-color: #409eff;
    }
  }
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

.export-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 保持与页面其他按钮一致 */
:deep(.el-button) {
  border-radius: 4px;
  padding: 8px 16px;
}

:deep(.el-button--primary) {
  background: #409eff;
  border-color: #409eff;
  
  &:hover {
    background: #66b1ff;
    border-color: #66b1ff;
  }
}
</style>
