<template> <!-- 模板开始 -->
  <div class="container">
    <div class="second-main-container">
      <!-- 查询区 -->
      <div class="search-panel">
        <!-- 操作按钮区 -->
        <div class="action-btns">
          <el-button type="primary" class="custom-button" @click="getData">查询</el-button>
          <el-button class="custom-button" @click="resetForm">重置</el-button>
          <el-dropdown
            trigger="click"
            @command="handleMenuCommand"
            class="confirm-dropdown"
          >
            <el-button
              type="primary"
              class="custom-button confirm-button"
              :class="{'is-disabled-custom': !selected.length}"
              :disabled="!selected.length"
            >
              批量确认
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in select_type_list"
                  :key="item.value"
                  :command="item.value"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 原有表单区（去除按钮和el-select） -->
        <el-form :inline="true" :model="form" style="display: flex; flex-wrap: wrap; align-items: flex-end;">
          <el-form-item label="提交日期">
            <el-date-picker 
              v-model="form.dates" 
              type="daterange" 
              range-separator="至"
              start-placeholder="开始日期" 
              end-placeholder="结束日期" 
            />
          </el-form-item>
          <el-form-item label="联营类型" style="width: 250px;">
            <el-select
              v-model="form.lic_type"
              multiple
              filterable
              :collapse-tags="false"
              :collapse-tags-tooltip="false"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option label="联营业务" :value="0" />
              <el-option label="联营款" :value="1" />
            </el-select>
          </el-form-item>
          <div style="flex-basis: 100%; height: 0;"></div>
          <el-form-item label="抽检日期">
            <el-date-picker 
              v-model="form.spot_dates" 
              type="daterange" 
              range-separator="至"
              start-placeholder="开始日期" 
              end-placeholder="结束日期" 
            />
          </el-form-item>
          <el-form-item label="合同号">
            <el-input v-model="form.po_no" placeholder="请输入合同号" />
          </el-form-item>
          <div style="flex-basis: 100%; height: 0;"></div>
          
          <el-form-item label="确认结果" style="width: 250px;">
            <el-select
              v-model="form.result"
              multiple
              filterable
              :collapse-tags="false"
              :collapse-tags-tooltip="false"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option label="返修" :value="'0'" />
              <el-option label="不再上架" :value="'1'" />
              <el-option label="复测" :value="'2'" />
              <el-option label="未确认" :value="'null'" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-container">
      <el-table
          ref="dataTable"
          v-loading="tableLoading"
          :data="table"
          border
          stripe                  
          :header-cell-style="{ background: '#EEF3FF', color: '#333333', fontWeight: 'bold', height: '40px' }" 
          tooltip-effect="dark" 
          style="width: 100%; margin-top:16px;" 
          class="dataTable"
          v-horizontal-scroll="'always'" 
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          :highlight-current-row="true"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable" /> 
          <el-table-column prop="report_id" label="报告id" sortable="custom" :sort-method="sortNumber('report_id')" /> 
          <el-table-column prop="po_no" label="合同号" sortable="custom" :sort-method="sortPoNo" /> 
          <el-table-column prop="lic_type" label="联营类型" sortable="custom" :sort-method="sortString('lic_type')" /> 
          <el-table-column prop="result" label="确认结果" sortable="custom" :sort-method="sortString('result')" /> 
          <el-table-column prop="spot_status" label="结果" sortable="custom" :sort-method="sortString('spot_status')" /> 
          <el-table-column prop="date" label="提交日期" :formatter="formatSubmitDate" sortable="custom" :sort-method="sortSubmitDate" /> 
          <el-table-column prop="spot_date" label="抽检日期" :formatter="formatSpotDate" sortable="custom" :sort-method="sortSpotDate" /> 
          <el-table-column prop="lic_sname" label="联营商" sortable="custom" :sort-method="sortString('lic_sname')" /> 
          <el-table-column prop="cust_name" label="客户" sortable="custom" :sort-method="sortString('cust_name')" /> 
          <el-table-column prop="remarks" label="备注" sortable="custom" :sort-method="sortString('remarks')" /> 
        </el-table>
        <div class="pagination-container">
      <el-pagination
            :current-page="pagination.current"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- <el-form-item label="联营商" style="width: 250px;">
            <el-select
              v-model="form.lic_sname"
              multiple
              filterable
              :collapse-tags="false"
              :collapse-tags-tooltip="false"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option v-for="item in lic_code_list" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
</template>                                                   

<script> // 脚本开始
// 引入日期格式化工具函数
import { formatTimeToStr, fetchReportList, fetchLicCodeOptions, updateLicSpotResult } from "./option.js";               // 导入日期格式化函数
import { ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

export default {                                             // 导出组件
  name: "LiZcTestDqr",                                       // 组件名
  props: [""],                                               // 组件props
  components: { ArrowDown },
  data() {                                                   // data函数
    return {                                                 // 返回数据对象
      // 查询表单数据对象
      form: {
        dates: [],                                           // 提交日期范围 [start, end]
        spot_dates: [],                                      // 抽检日期范围 [start, end]
        cfm_state: [],                                       // 确认结果筛选数组
        po_no: "",                                           // 合同号输入值
        lic_sname: [],                                       // 联营商选择数组
        lic_type: [],                                        // 联营类型选择数组
        result: [],                                          // 确认结果选择数组
      },
      // separator: "horizontal",                               // 表格分隔线样式
      table: [],                                             // 表格数据数组
      tableLoading: false,                                   // 表格加载状态
      confirmLoading: false,                                 // 确认操作加载状态
      // 分页配置
      pagination: {
        current: 1,                                          // 当前页码
        pageSize: 10,                                        // 每页条数
      },
      total: 0,                                              // 总条数
      // // 表格列定义配置
      // tablecolumns: [
      //   {
      //     name: "report_id",                                 // 字段名
      //     label: "报告id",                                   // 列标题
      //     field: "report_id",                                // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "po_no",                                     // 字段名
      //     label: "合同号",                                    // 列标题
      //     field: "po_no",                                    // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "lic_type",                                  // 字段名
      //     label: "联营类型",                                  // 列标题
      //     field: "lic_type",                                 // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "result",                                    // 字段名
      //     label: "确认结果",                                  // 列标题
      //     field: "result",                                   // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "spot_status",                               // 字段名
      //     label: "结果",                                      // 列标题
      //     field: "spot_status",                              // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "date",                                      // 字段名
      //     label: "提交日期",                                  // 列标题
      //     field: "date",                                     // 字段
      //     align: "center",                                   // 居中
      //     format: val => {
      //       if (!val) return '';
      //       // 兼容字符串带T的格式
      //       if (typeof val === 'string' && val.includes('T')) {
      //         return val.split('T')[0];
      //       }
      //       // 其它情况用原有格式化
      //       return formatTimeToStr(val, "yyyy-MM-dd");
      //     },
      //     sortable: true                                      // 可排序
      //   },
      //   {
      //     name: "spot_date",                                 // 字段名
      //     label: "抽检日期",                                  // 列标题
      //     field: "spot_date",                                // 字段
      //     align: "center",                                   // 居中
      //     format: val => {
      //       if (!val) return '';
      //       // 兼容字符串带T的格式
      //       if (typeof val === 'string' && val.includes('T')) {
      //         return val.split('T')[0];
      //       }
      //       // 其它情况用原有格式化
      //       return formatTimeToStr(val, "yyyy-MM-dd");
      //     },
      //     sortable: true                                      // 可排序
      //   },
      //   {
      //     name: "lic_sname",                                  // 字段名
      //     label: "联营商",                                    // 列标题
      //     field: "lic_sname",                                // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "cust_name",                                 // 字段名
      //     label: "客户",                                     // 列标题
      //     field: "cust_name",                                // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   },
      //   {
      //     name: "remarks",                                   // 字段名
      //     label: "备注",                                      // 列标题
      //     field: "remarks",                                  // 字段
      //     align: "center",                                   // 居中
      //     format: val => `${val || ''}`,                     // 格式化
      //     sortable: true                                     // 可排序
      //   }
      // ],
      selected: [],                                         // 表格选中项数组
      // 确认结果类型下拉选项
      select_type_list: [
        { label: "返修", value: 0 },                         // 返修
        { label: "不再上架", value: 1 },                     // 不再上架
        { label: "复测", value: 2 }                          // 复测
      ],
      lic_code_list: [],                                    // 联营商下拉选项数组
      select_type: undefined,                               // 批量确认类型
    };
  },
  computed: {},                                             // 计算属性
  watch: {},                                                // 监听属性
  methods: {
    // // 禁用今天之后的日期
    // disabledFutureDate(time) {
    //   return time.getTime() > Date.now();
    // },
    // // 禁用大于结束日期或未来的日期（用于开始日期选择器）
    // disabledStartDate(time, endDate) {
    //   const now = Date.now();
    //   if (endDate) {
    //     return time.getTime() > now || time.getTime() > new Date(endDate).getTime();
    //   }
    //   return time.getTime() > now;
    // },
    // // 禁用小于开始日期或未来的日期（用于结束日期选择器）
    // disabledEndDate(time, startDate) {
    //   const now = Date.now();
    //   if (startDate) {
    //     return time.getTime() > now || time.getTime() < new Date(startDate).getTime();
    //   }
    //   return time.getTime() > now;
    // },
    handleSelectionChange(val) {
      this.selected = val;
    },                       // 表格选中项变化回调
    /**
     * 查询数据方法 - 根据筛选条件获取表格数据
     * 处理域名配置、用户权限、参数格式化等
     */
    async getData() {
      console.log('getData called', this.form);                                           // 调试日志
      this.tableLoading = true;                                                           // 开启加载状态
      const hasSubmitRange = Array.isArray(this.form.dates) && this.form.dates.length === 2;
      const hasSpotRange = Array.isArray(this.form.spot_dates) && this.form.spot_dates.length === 2;
      const params = {
        sdate: hasSubmitRange ? formatTimeToStr(this.form.dates[0], "yyyy-MM-dd") : "",     // 提交起始日期
        edate: hasSubmitRange ? formatTimeToStr(this.form.dates[1], "yyyy-MM-dd") : "",     // 提交结束日期
        po_no: this.form.po_no,                                                             // 合同号
        lic_sname: this.form.lic_sname.length ? this.form.lic_sname.join(",") : "",         // 联营商
        lic_type: this.form.lic_type.length ? this.form.lic_type.join(",") : "",            // 联营类型
        spot_sdate: hasSpotRange ? formatTimeToStr(this.form.spot_dates[0], "yyyy-MM-dd") : "", // 抽检起始日期
        spot_edate: hasSpotRange ? formatTimeToStr(this.form.spot_dates[1], "yyyy-MM-dd") : "", // 抽检结束日期
        cfm_state: this.form.cfm_state.length ? this.form.cfm_state.join(",") : "",         // 确认结果
        result: this.form.result,
        page: this.pagination.current,                                                      // 当前页码
        pageSize: this.pagination.pageSize                                                  // 每页条数
      };
      console.log('请求参数', params);                                                       // 调试日志
      try {
        const res = await fetchReportList(params);
        console.log('接口响应', res);                                                        // 调试日志
        const payload = res?.data ?? res;                                                   // request封装已返回response.data
        if (payload) {
          this.table = Array.isArray(payload.result) ? payload.result : [];
          this.total = payload.total || payload.totalCount || 0;
        } else {
          this.table = [];
          this.total = 0;
        }
      } catch (err) {
        this.$util && this.$util.showError
          ? this.$util.showError("数据获取失败或格式异常")
          : alert("数据获取失败或格式异常");
        console.error("数据获取失败", err);
      } finally {
        this.tableLoading = false;                                                          // 关闭加载状态
      }
    },

    /**
     * 获取联营商下拉列表方法
     * 从API获取联营商数据，构建下拉选项
     */
    async getLicCodeList() {
      try {
        const res = await fetchLicCodeOptions();
        console.log("联营商接口返回：", res);         // 调试日志
        const payload = res?.data ?? res;
        const list = payload?.result;
        if (Array.isArray(list)) {
          this.lic_code_list = list.map(item => ({
            label: item,
            value: item
          }));
        } else {
          this.$util && this.$util.showError
            ? this.$util.showError("联营商列表获取失败或格式异常")
            : alert("联营商列表获取失败或格式异常");
          console.error("联营商接口数据格式异常", res);
        }
      } catch (err) {
        this.$util && this.$util.showError
          ? this.$util.showError("联营商列表获取失败")
          : alert("联营商列表获取失败");
        console.error("联营商接口请求失败", err);
      }
    },

    /**
     * 批量确认方法 
     * 选择数据，执行批量确认操作
     */
    handleMenuCommand(type) {
      const label = (this.select_type_list.find(item => item.value === type) || {}).label || '';
      ElMessageBox.confirm(
        `是否批量确认为“${label}”？`,
        '批量确认操作',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.confirm(type);
      }).catch(() => {
        // 用户取消
      });
    },

    async confirm(type) {
      this.confirmLoading = true;
      try {
        if (!this.selected || this.selected.length == 0) {
          this.$message.error("请选择要确认的数据");
          return;
        }
        // type 作为确认类型
        const confirmType = (typeof type !== 'undefined') ? type : this.select_type;
        if (typeof confirmType === 'undefined' || confirmType === null) {
          this.$message.error("请选择确认结果类型");
          return;
        }
        const oidList = this.selected.map(item => ({ oid: item.oid }));
        await updateLicSpotResult({ list: oidList, result: confirmType });
        this.$message.success("批量确认成功");
        this.selected = [];
        this.getData();
      } catch (error) {
        this.$message.error("批量确认失败");
      } finally {
        this.confirmLoading = false;
      }
    },

    /**
     * 重置表单和分页
     */
    resetForm() {
      this.form = {
        dates: [],                                 // 提交日期范围
        spot_dates: [],                            // 抽检日期范围
        cfm_state: [],                             // 确认结果筛选数组
        po_no: "",                                 // 合同号输入值
        lic_sname: [],                              // 联营商选择数组
        lic_type: [],                               // 联营类型选择数组
        result: [],                                 // 确认结果选择数组
      };
      this.pagination.current = 1;                   // 重置页码
      this.pagination.pageSize = 10;                 // 重置每页条数
      this.selected = [];                            // 清空选中项
      this.select_type = undefined;                  // 重置批量确认下拉框
      this.$nextTick(() => {
        if (this.$refs.dataTable) {
          this.$refs.dataTable.clearSelection();     // 清空表格多选
        }
      //   const dom = this.$refs.echartDom;
      //  if (!dom) {
      //    console.error('ECharts 容器 DOM 不存在，无法初始化');
      //    return;
      //  }
      //  if (!this.chart) {
      //    this.chart = echarts.init(dom);
      //  }
      });
      this.getData();                                // 重新查询
    },

    /**
     * 页面初始化方法
     * 获取表格数据和联营商列表
     */
    init() {
      try {
        this.getData();                              // 获取表格数据
        this.getLicCodeList();                       // 获取联营商列表
      } catch (error) {
        console.error("页面初始化失败:", error);
        this.$util.showError("页面初始化失败");
      }
    },
    // 分页每页条数变化回调
    handleSizeChange(val) {
      this.pagination.pageSize = val;                // 设置每页条数
      this.pagination.current = 1;                   // 重置页码
      this.getData();                                // 重新查询
    },
    // 分页页码变化回调
    handleCurrentChange(val) {
      this.pagination.current = val;                 // 设置当前页码
      this.getData();                                // 重新查询
    },

    /**
     * 格式化抽检日期为YYYY-MM-DD
     */
    formatSpotDate(row) {
      const val = row.spot_date;
      if (!val) return '';
      if (typeof val === 'string' && val.includes('T')) {
        return val.split('T')[0];
      }
      // 其它情况用已有格式化
      return this.$options.methods.formatTimeToStr
        ? this.$options.methods.formatTimeToStr(val, "yyyy-MM-dd")
        : val;
    },
    // 格式化提交日期为YYYY-MM-DD
    formatSubmitDate(row) {
      const val = row.date;
      if (!val) return '';
      if (typeof val === 'string' && val.includes('T')) {
        return val.split('T')[0];
      }
      // 其它情况用已有格式化
      return this.$options.methods.formatTimeToStr
        ? this.$options.methods.formatTimeToStr(val, "yyyy-MM-dd")
        : val;
    },
    // 通用数字排序
    sortNumber(field) {
      return (a, b) => {
        return Number(a[field] || 0) - Number(b[field] || 0);
      };
    },
    // 通用字符串排序
    sortString(field) {
      return (a, b) => {
        return (a[field] || '').localeCompare(b[field] || '');
      };
    },
    // 合同号排序（如需特殊处理可自定义，否则用 sortString）
    sortPoNo(a, b) {
      return (a.po_no || '').localeCompare(b.po_no || '');
    },
    // 抽检日期排序
    sortSpotDate(a, b) {
      const dateA = a.spot_date && typeof a.spot_date === 'string' ? a.spot_date.split('T')[0] : a.spot_date;
      const dateB = b.spot_date && typeof b.spot_date === 'string' ? b.spot_date.split('T')[0] : b.spot_date;
      return new Date(dateA) - new Date(dateB);
    },
    // 提交日期排序
    sortSubmitDate(a, b) {
      const dateA = a.date && typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
      const dateB = b.date && typeof b.date === 'string' ? b.date.split('T')[0] : b.date;
      return new Date(dateA) - new Date(dateB);
    },

    /**
     * 表格排序事件处理
     * @param {Object} param0 - { prop, order }
     */
    handleSortChange({ prop, order }) {
      if (!prop || !order) return;
      let sortFn;
      if (prop === 'report_id') sortFn = this.sortNumber('report_id');
      else if (prop === 'po_no') sortFn = this.sortPoNo;
      else if (prop === 'spot_date') sortFn = this.sortSpotDate;
      else if (prop === 'date') sortFn = this.sortSubmitDate;
      else sortFn = this.sortString(prop);

      if (order === 'ascending') {
        this.table = [...this.table].sort(sortFn);
      } else if (order === 'descending') {
        this.table = [...this.table].sort((a, b) => -sortFn(a, b));
      } else {
        // 如果 order 为空，恢复原始顺序（可选：此处可根据实际需求实现）
        // 这里暂时不处理
      }
    },

    // 行可选性判断函数
    isSelectable(row) {
      return row.result === '未确认'
    },
  },
  /**
   * 生命周期钩子 - 页面挂载后执行初始化
   */
  mounted() {
    try {
      this.init();                                    // 调用初始化方法
    } catch (e) {
      // swallow error
    }
  },
  /**
   * 生命周期钩子 - 页面销毁前清理资源
   */
  beforeDestroy() {
    try {
      this.selected = [];
      this.table = [];
      this.lic_code_list = [];
      // 清理所有定时器、事件监听、全局副作用
      if (this._cleanupFns) {
        this._cleanupFns.forEach(fn => {
          try { fn && fn(); } catch (e) {}
        });
        this._cleanupFns = [];
      }
    } catch (e) {
      // swallow error
    }
  }
};                                                          // 导出结束

</script>                                                    // 脚本结束

<style scoped> /* 样式开始 */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.second-main-container {
  width: 95%;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 24px auto;
  padding: 32px 24px 24px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
  min-height: 200px;
}
.form-header {
  margin-bottom: 20px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-left: auto;
}
.custom-button,
.el-button.batch-confirm-btn {
  background-color: #3A68F2 !important;
  border-color: #3A68F2 !important;
  color: #fff !important;
}
.search-panel {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}
.search-btn-item {
  margin-left: auto;
}
.table-container {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}
:deep(.el-table) {
  .el-table__header-wrapper th {
    background-color: #f5f7fa;
    color: #333;
    font-weight: 500;
    height: 40px;
    padding: 8px 0;
  }
  .el-table__body-wrapper .el-table__row{
    height: 40px;
  }
  .el-table__row:hover {
    background-color: #f5f7fa;
  }
  .el-table__body-wrapper {
    overflow-y: auto;
  }
  .el-table__empty-block {
    min-height: 160px;
    height: 100%;
  }
}
:deep(.el-select .el-select__tags) {
  flex-wrap: wrap !important;
  max-height: 120px;
  overflow-y: auto;
}
.pagination-container {
  margin-top: 16px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
}
.action-btns {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.action-btns > * {
  margin-right: 12px;
}
.action-btns > *:last-child {
  margin-right: 0;
}
.confirm-dropdown {
  margin-right: 0;
}
.confirm-button {
  display: flex;
  align-items: center;
  padding: 8px 15px;
}
.confirm-button .el-icon--right {
  margin-left: 5px;
}
.is-disabled-custom {
  background-color: #e0e0e0 !important;
  border-color: #e0e0e0 !important;
  color: #fff !important;
  cursor: not-allowed !important;
  /* 可根据需要调整灰色深浅 */
}
</style>
