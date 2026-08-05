<template>
  <basic-container class="container">
    <!-- <el-button type="primary" @click="stylequerygmpo(false)">查询</el-button> -->
    <mybottons :show-list="['check']" @handleCheck="stylequerygmpo(false)">
      <el-button
        type="primary"
        class="custom-button"
        @click="Savestylegmpo()"
      >批量确认</el-button>
    </mybottons>

    <div class="second-main-container">
      <avue-form
        v-model="form"
        :option="formOption"
        @keyup.enter="stylequerygmpo(true)"
      />

      <el-header class="table-select-header" height="30px">
        <el-button type="text">
          <strong>当前表格已选择</strong>
          <strong style="font-size: 16px; margin: 4px">&#32; {{ mainSelectList.length }}&#32;</strong>
          <strong>项</strong>
        </el-button>

        <el-button type="text" @click="checkAllSelect()">
          <!-- <strong>{{ $t(`Action.CheckAll`) }}</strong> -->
          <strong>选择全部</strong>
        </el-button>
        <el-button type="text" @click="clearSelect()">
          <!-- <strong>{{ $t(`Action.Empty`) }}</strong> -->
          <strong>清空</strong>
        </el-button>
      </el-header>
      <el-table
        ref="crud"
        v-loading="tableLoading"
        :data="pageData"
        :row-key="getRowKeys"
        :highlight-current-row="radio"
        :row-class-name="rowClassName"
        class="specific-table"
        @row-dblclick="styledtlshow"
        @select="handleSelect"
        @select-all="hadleSelectAll"
      >
        <!--:reserve-selection="true"-->
        <el-table-column v-if="!radio" type="selection" width="55" />
        <el-table-column
          v-for="column in tableOption.column"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :filters="column.filters"
          :type="column.type"
          :formatter="formatDate"
          :width="column.width"
          show-overflow-tooltip
          :fixed="column.fixed ? 'right' : false"
        >
          <!-- 自定义插槽 -->
          <template v-if="column.prop === 'pictureaddr'" #default="{ row }">
            <el-image
              :src="`https://iretail.gsitcloud.com/esp/${row.pictureaddr}`"
              :preview-src-list="[
                `https://iretail.gsitcloud.com/esp/${row.pictureaddr}`,
              ]"
              style="width: 100px; height: 70px"
              fit="contain"
              preview-teleported="true"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="page.currentPage"
          background
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>

      <el-dialog v-model="dataprint" fullscreen @close="handleDialogClose">
        <el-button
          v-if="getstyle.status == '未确认'"
          type="primary"
          @click="Savestylegmpo()"
        >确认</el-button>

        <el-button
          v-if="getstyle.status == '已确认'"
          type="primary"
          @click="styledtlshow2"
        >查询</el-button>
        <avue-form v-model="verForm" :option="verOp" @change="verChange" />
        <avue-crud
          ref="cruddtl2"
          v-loading="tableLoading3"
          style="margin-top: 15px"
          :option="itemdtl2"
          :data="styledtl2"
          :page="pagedtl2"
          @size-change="sizeChangedtl2"
          @current-change="currentChangedtl2"
        >
          <template #qty="{ row }">
            <el-input v-model="row.qty" @blur="hadndleBlur(row)" />
          </template>
          <template #origpri="{ row }">
            <el-input v-model="row.origpri" @blur="hadndleBlur2(row)" />
          </template>
        </avue-crud>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import {
  stylequery,
  Savestyledata,
  itemdtlquery,
  itemdtlquery2,
} from '@/api/pogoods.js';
import {
  formOption,
  tableOption,
  itemdtl2,
  verOp,
} from '@/views/ows/pogoods/option.js';
export default {
  data () {
    return {
      // 已選擇的數據
      rowKey: 'idx',
      radio: false,
      verForm: {},
      verOp: verOp,
      verVal: '',
      mainSelectList: [],
      tableLoading: false,
      tableLoading2: false,
      tableLoading3: false,
      activeName: 'A',
      styledataList: [],
      styledatadtlList: [],
      styledatadtlList2: [],
      // this.styledatadtlList表示实际数量的表,this.styledatadtlList2表示审款的表
      form: {},
      stylelist: [],
      isshow: false, // 是否打开详情页
      formOption: formOption,
      tableOption: tableOption,
      styledtl: [],
      styledtl2: [],
      styledtl2All: [],
      itemdtl2: itemdtl2,
      dataprint: false,
      data: [],
      pageData: [],
      state: 0,
      getstyle: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50, 100],
      },
      pagedtl: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      pagedtl2: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  computed: {},
  watch: {},
  created () {
    this.stylequerygmpo(false);
  },
  methods: {
    hadndleBlur (row) {
      if (row.qty == null) return;
      row.qty = Number(row.qty);
      if (isNaN(row.qty) || row.qty < 0) {
        row.qty = 0;
      }
    },
    hadndleBlur2 (row) {
      if (row.origpri == null) return;
      row.origpri = Number(row.origpri);
      if (isNaN(row.origpri) || row.origpri < 0) {
        row.origpri = 0;
      }
    },
    // 本地分页的方法
    paging (size, current) {
      const tableList = JSON.parse(JSON.stringify(this.data));
      const tablePush = [];
      tableList.forEach((item, index) => {
        if (size * (current - 1) <= index && index <= size * current - 1) {
          tablePush.push(item);
        }
      });
      // 分页的总数据
      this.page.total = tableList.length;
      return tablePush;
    },
    /**
     * @title 查询
     *
     */
    stylequerygmpo (flag) {
      let params = {
        PageSize: this.page.pageSize,
        PageNumber: flag === true ? 1 : this.page.currentPage,
        condition: this.form,
      };
      this.tableLoading = true;
      stylequery(params)
        .then((respose) => {
          this.data = respose.data.map(item => {
            // 保留 origpri 两位小数
            item.origpri = parseFloat(item.origpri).toFixed(2);
            return item;
          });
          this.pageData = this.paging(this.page.pageSize, 1);
          this.tableLoading = false;
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    // 赋值选择项
    setSelection () {
      if (!this.radio) {
        // console.log("setSelection");
        for (let row of this.pageData) {
          //   console.log(this.mainSelectList);
          let el = this.mainSelectList.find(
            (itm) => row[this.rowKey] === itm[this.rowKey]
          );
          if (el) {
            console.log('setSelection');
            this.$refs.crud.toggleRowSelection(row, true);
          }
        }
      }
    },
    /**
     * @title 改变每页记录数
     *
     **/
    sizeChange (val) {
      this.pageData = this.paging(val, this.page.currentPage);
      setTimeout(() => {
        this.setSelection();
      }, 5);
    },
    /**
     * @title 换页
     *
     **/
    currentChange (val) {
      this.page.currentPage = val;
      this.pageData = this.paging(this.page.pageSize, val);
      setTimeout(() => {
        this.setSelection();
      }, 5);
    },
    /**
     * @title 详情页
     *
     */
    styledtlshow (row, event) {
      this.pagedtl2 = {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      };
      this.getstyle = JSON.parse(JSON.stringify(row));
      // 获取历史版本
      let vers = [];
      for (let i = 1; i <= parseInt(row.ver); i++) {
        vers.push({
          value: `${i}`,
          label: `${i}`,
        });
      }
      this.verOp.column[1].dicData = vers;
      this.verForm.styleNo = row.styleNo;
      this.verForm.ver = row.ver;
      this.isshow = true;
      this.stylequerydtlgmpo2(this.getstyle.styleNo);
    },
    // 获取历史版本详情页
    styledtlshow2 () {
      this.pagedtl2 = {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      };
      this.getstyle.ver = this.verForm.ver;
      this.stylequerydtlgmpo2(this.getstyle.styleNo);
    },
    /**
     * @title 关闭详情页
     *
     */
    handleDialogClose () {
      this.isshow = false;
      this.styledtl = [];
      this.styledatadtlList = [];
      this.styledatadtlList2 = [];
      this.pagedtl2.total = 0;
      this.pagedtl2.pageSize = 10;
    },
    /**
     * @title 查询明细资料(分页)
     *
     */

    async stylequerydtlgmpo2 (row) {
      if (this.getstyle.status == '已确认') {
        let params = {
          item: this.getstyle,
        };
        this.tableLoading3 = true;
        await itemdtlquery2(params).then((res) => {
          this.styledtl2All = res.data;
          console.log(this.styledtl2All);
          this.styledtl2 = this.dtl2Paging(
            this.pagedtl2.pageSize,
            this.pagedtl2.currentPage
          );
          this.tableLoading3 = false;
        });
      } else {
        let params = {
          styleNoList: row === undefined ? this.getstyle.styleNo : row,
        };
        this.tableLoading3 = true;
        await itemdtlquery(params).then((res) => {
          this.styledtl2All = res.data;

          this.styledtl2 = this.dtl2Paging(
            this.pagedtl2.pageSize,
            this.pagedtl2.currentPage
          );
          this.tableLoading3 = false;
        });
      }

      if (this.isshow) {
        this.dataprint = true;
      }
    },
    /**
     * @title 查询明细资料(不分页保存用)
     *
     */
    async itemquerydtlgmpo (data) {
      let params = {
        styleNoList: data,
      };
      await itemdtlquery(params).then((res) => {
        this.styledatadtlList = res.data;
        this.styledatadtlList2 = res.data;
      });
    },
    /**
     * @title 确认备货协议
     *
     **/
    async Savestylegmpo () {
      this.$confirm('选择的款资料将确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (this.isshow) {
          // 详情页中进行确认的情况,将选择行赋值
          this.styledataList = [this.getstyle];
        } else {
          // 选择的资料
          this.styledataList = this.mainSelectList;
        }
        if (this.styledataList.length == 0) {
          return this.$message.warning('请选择数据!');
        }
        let dataList = this.styledataList.filter(
          (ele) => ele.status == '未确认'
        );
        let data = dataList.map((item) => {
          return item.styleNo;
        });
        if (data.length == 0) {
          return this.$message.warning('选择项已全部确认!');
        }
        if (this.isshow) {
          // 详情页中进行确认的情况,将选择行赋值
          this.styledtl2All.forEach((item) => {
            const targetItem = this.styledtl2.find(
              (Item2) => Item2.colId == item.colId && Item2.sizId == item.sizId
            );
            if (targetItem) {
              item.qty = targetItem.qty;
            }
          });
          // this.styledatadtlList表示实际数量的表,this.styledatadtlList2表示审款的表
          this.styledatadtlList = this.styledtl2All;
          dataList[0].qty = this.styledtl2All.reduce(
            (acc, curr) => acc + curr.qty,
            0
          );
          console.log(dataList[0].qty);
          await itemdtlquery({ styleNoList: data }).then((res) => {
            this.styledatadtlList2 = res.data;
          });
        } else {
          await this.itemquerydtlgmpo(data);
          dataList.map((item) => {
            item.qty = item.skQty;
            return item;
          });
        }
        let params = {
          styledataList: dataList,
          styledatadtlList: this.styledatadtlList,
          styledatadtlList2: this.styledatadtlList2,
        };
        await Savestyledata(params).then((res) => {
          this.clearSelect();
          // 隐藏按钮
          this.getstyle.status = '已确认';
          this.state = res.data.state;
          if (this.state == 1) {
            this.$notify({
              title: '成功',
              message: '确认成功',
              type: 'success',
              duration: 2000,
            });
            this.stylequerygmpo(false);
          } else {
            this.$notify({
              title: '失败',
              message: '确认失败',
              type: 'error',
              duration: 2000,
            });
          }
        });
      });
    },
    sizeChangedtl2 (size) {
      // 页大小发生变化时更新总数据
      this.styledtl2All.forEach((item) => {
        const targetItem = this.styledtl2.find(
          (Item2) => Item2.colId == item.colId && Item2.sizId == item.sizId
        );
        if (targetItem) {
          item.qty = targetItem.qty;
        }
      });
      this.pagedtl2.pageSize = size;
      this.styledtl2 = this.dtl2Paging(size, this.pagedtl2.currentPage);
    },
    // 页码改变事件
    currentChangedtl2 (current) {
      // 页大小发生变化时更新总数据
      this.styledtl2All.forEach((item) => {
        const targetItem = this.styledtl2.find(
          (Item2) => Item2.colId == item.colId && Item2.sizId == item.sizId
        );
        if (targetItem) {
          item.qty = targetItem.qty;
        }
      });
      this.pagedtl2.currentPage = current;
      this.styledtl2 = this.dtl2Paging(this.pagedtl2.pageSize, current);
    },
    // 本地分页的方法
    dtl2Paging (size, current) {
      // 深度复制,防止引用出现问题
      const tableList = JSON.parse(JSON.stringify(this.styledtl2All));
      const tablePush = [];
      tableList.forEach((item, index) => {
        if (size * (current - 1) <= index && index <= size * current - 1) {
          // 使得数量可编辑
          item.$cellEdit = true;
          tablePush.push(item);
        }
      });
      // 分页的总数据
      this.pagedtl2.total = tableList.length;
      return tablePush;
    },
    clearSelect () {
      this.$refs.crud.setCurrentRow();
      this.$refs.crud.clearSelection();
      this.mainSelectList = [];
    },
    checkAllSelect () {
      this.$refs.crud.clearSelection();
      this.mainSelectList = JSON.parse(JSON.stringify(this.data));

      this.setSelection();
    },
    // 用户手动勾选选择框
    handleSelect (selection, row) {
      // console.log("当用户手动勾选数据行的 Checkbox 时触发的事件");
      let itm = this.mainSelectList.findIndex(
        (el) => el[this.rowKey] === row[this.rowKey]
      );
      if (itm > -1) {
        this.mainSelectList.splice(itm, 1);
      } else {
        this.mainSelectList.push(row);
      }
    },
    // 用户手动勾选全选按钮
    hadleSelectAll (list) {
      // console.log("当用户手动勾选全选事件", list);
      if (list.length > 0) {
        // 全选
        for (let row of list) {
          let itm = this.mainSelectList.find(
            (el) => el[this.rowKey] === row[this.rowKey]
          );
          if (!itm) {
            this.mainSelectList.push(row);
          }
        }
      } else {
        // 全不选
        for (let row of this.pageData) {
          let itm = this.mainSelectList.findIndex(
            (el) => el[this.rowKey] === row[this.rowKey]
          );
          if (itm > -1) {
            this.mainSelectList.splice(itm, 1);
          }
        }
      }
    },
    verChange (form) {
      this.styledtlshow2();
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table-select-header {
  line-height: 20px;
  text-align: left;
  font-size: 6px;
  display: flex;
  align-items: center;
  gap: 1rem;

  .el-button {
    color: $theme-color-4;
    padding: 0 5px;
    font-size: 12px;
  }
}
.specific-table {
  width: 100%;
  overflow: hidden;
  .specific-table .el-table__body-wrapper tbody tr {
    height: 30px; // 设置你想要的高度
  }

  .specific-table .el-table__header-wrapper thead th {
    height: 30px; // 设置你想要的高度
    line-height: 30px; // 确保文本垂直居中
  }
}
.second-main-container {
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;

  box-shadow: $shadow-1;
  :deep(.el-form .el-form-item){
    margin-bottom: 8px;
  }
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}
</style>
