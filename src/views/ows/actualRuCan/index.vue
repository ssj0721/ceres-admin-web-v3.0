<template>
  <basic-container class="container">
    <mybottons :show-list="['check']" @handleCheck="query(1)" />
    <div class="second-main-container">
      <div style="margin: 0px 0px 10px 0px"></div>
      <avue-form v-model="form" :option="formOption" />
      <avue-crud
        ref="crud"
        v-model="table"
        class="transparent-border"
        style="margin-top: 15px; margin-bottom: 8px; padding: 0 32px;"
        :option="option"
        :data="data"
        :page="page"
        :table-loading="tableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-dblclick="edit"
        @selection-change="selectionChange"
      >
        <template #menu="{ row, index, size, type }">
          <el-button type="primary" class="custom-button" @click="edit(row)">查看详情</el-button>
        </template>
      </avue-crud>
      <el-dialog v-model="dialogVisible" title="款式详情" center fullscreen :modal="true">
        <el-row>
          <avue-form ref="form" v-model="form2" :option="formOption2" />
        </el-row>
        <el-row span="12">
          <el-button type="primary" class="custom-button" @click="handRowUpdate()">保存</el-button>
          <el-button type="primary" class="custom-button" @click="close()">关闭</el-button>
        </el-row>
        <div style="margin-bottom: 20px;"></div>
        <el-row>
          <el-tabs v-model="activeName" class="bottom-tab" type="border-card">
            <el-tab-pane label="合同" name="A">
              <avue-crud
                v-model="table22"
                style="margin-top: 15px"
                :option="option22"
                :summary-method="summaryMethod22"
                :data="data22"
              />
            </el-tab-pane>
            <el-tab-pane label="实际到仓" name="B">
              <avue-crud
                ref="crud2"
                style="margin-top: 15px"
                :option="option2"
                :data="data2"
                :table-loading="tableLoading2"
                :summary-method="summaryMethod"
              >
                <template v-for="(item, index) in option2.column[5].children" #[item.prop]="{ row }" :key="index">
                  <div>
                    <el-input v-model="row[item.prop]" @blur="hadndleBlur(row, item.prop)" />
                  </div>
                </template>
              </avue-crud>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import {
  queryapi,
  query2api,
  save,
  itemdtlquery3,
} from '@/api/actualRuCan';

export default {
  name: 'ActualRuCan',
  data () {
    return {
      activeName: 'A',
      data22: [],
      table22: {},
      dialogVisible: false,
      form: {},
      formOption: {
        submitBtn: false,
        emptyBtn: false,
        dialogClickModal: false,
        column: [
          {
            prop: 'itemcode',
            label: '款号',
            labelWidth: 100,
            span: 12,
            placeholder: '多款用空格、半角逗号或换行符分隔，单款时模糊查询',
          },
        ],
      },
      option: {
        index: true,
        indexLabel: '#',
        indexWidth: 100,
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        cancelBtn: false,
        menu: true,
        // align: 'center',
        addBtn: false,
        cellBtn: false /* 行内编辑 */,
        columnBtn: false /* 行显隐按钮 */,
        refreshBtn: false /* 表格刷新按钮 */,
        menuWidth: '180',
        height: '400',
        labelWidth: '100',
        dialogWidth: '60%',
        dialogHeight: '50%',
        dialogClickModal: false,
        column: [
          {
            prop: 'cmp_id',
            label: '公司',
            span: 8,
          },
          {
            prop: 'bnd_id',
            label: '款字头',
            span: 8,
          },
          {
            prop: 'itemcode',
            label: '款号',
            span: 8,
          },

          {
            prop: 'qty',
            label: '合同总数量',
            span: 8,
          },
        ],
      },
      option2: {
        page: false,
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        cancelBtn: false,
        menu: false,
        // align: 'center',
        addBtn: false,
        cellBtn: false /* 行内编辑 */,
        columnBtn: false /* 行显隐按钮 */,
        refreshBtn: false /* 表格刷新按钮 */,
        menuWidth: '180',
        labelWidth: '100',
        dialogWidth: '70%',
        dialogHeight: '80%',
        dialogClickModal: false,
        showSummary: true, // 合计
        defaultExpandAll: true,
        column: [
          {
            prop: 'cmpId',
            label: '联营商代号',
            width: 70,
            align: 'center',
            hide: true,
          },
          {
            prop: 'itemcode',
            label: '款号',
            width: 70,
            align: 'center',
            hide: true,
          },
          {
            prop: 'colId',
            label: '颜色',
            width: 140,
          },
          {
            prop: 'actualDaoCanDate',
            label: '实际到仓期',
            width: '150',
            cell: true,
            overHidden: true,
            type: 'date',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
          },
          {
            label: '合计',
            prop: 'sizQty',
            width: 100,
            type: 'number',
            align: 'center',
            disabled: true,
          },
          {
            label: '实际到仓数量',
            align: 'center',
            children: [],
          },
        ],
      },
      option22: {
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        cancelBtn: false,
        menu: false,
        // align: 'center',
        addBtn: false,
        cellBtn: false /* 行内编辑 */,
        columnBtn: false /* 行显隐按钮 */,
        refreshBtn: false /* 表格刷新按钮 */,
        menuWidth: '180',
        labelWidth: '100',
        dialogWidth: '70%',
        dialogHeight: '80%',
        dialogClickModal: false,
        showSummary: true, // 合计
        column: [
          {
            prop: 'colId',
            label: '颜色',
            width: 140,
          },

          {
            prop: 'createdate',
            label: '确认时间',
            width: '150',
            overHidden: true,
            type: 'date',
            format: 'YYYY-MM-DD',
          },
          {
            label: '合计',
            prop: 'sizQty',
            width: 100,
            type: 'number',
            align: 'center',
            disabled: true,
          },
          {
            label: '实际备货数量',
            prop: 'actualQty',
            width: '150',
            align: 'center',
            children: [],
          },
        ],
      },
      tableLoading: false,
      tableLoading2: false,
      data: [],
      data2: [],
      table: {},
      table2: {},
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      form2: {},
      formOption2: {
        submitBtn: false,
        emptyBtn: false,
        dialogClickModal: false,
        column: [
          {
            prop: 'cmp_id',
            label: '公司',
            span: 12,
            align: 'center',
            disabled: true,
          },
          {
            prop: 'bnd_id',
            label: '款字头',
            span: 12,
            align: 'center',
            disabled: true,
          },
          {
            prop: 'itemcode',
            label: '款号',
            span: 12,
            align: 'center',
            disabled: true,
          },

          {
            prop: 'qty',
            label: '合同总数量',
            span: 12,
            disabled: true,
          },
        ],
      },
      selectList: [],
      uniqueSizIds: [],
    };
  },
  created () {
    let params = {
      pageSize: this.page.pageSize,
      page: this.page.currentPage,
      itemcode: '',
      itemcodelist: [],
    };
    this.tableLoading = true;
    queryapi(params).then((respose) => {
      console.log(respose.data.list);
      this.data = respose.data.list;
      this.page.total = respose.data.total;
    });
    this.tableLoading = false;
  },
  methods: {
    hadndleBlur (row, prop) {
      if (row[prop] == null) return;
      row[prop] = Number(row[prop]);
      console.log('111 ', row[prop]);
      console.log(this.data2);
      if (isNaN(row[prop]) || row[prop] < 0) {
        row[prop] = 0;
      }
    },
    async edit (row) {
      this.activeName = 'A';
      this.form2 = row;
      this.dialogVisible = true;

      // 合同tab部分
      let params3 = {
        bndId: row.bnd_id,
        styleNo: row.itemcode.trim(),
      };

      // 先执行itemdtlquery3并等待它完成
      await itemdtlquery3(params3).then((res) => {
        // 通过后端获取尺码顺序
        let uniqueSizIds = res.data.sizeSort;
        // 将所有尺码加入到表格列
        this.option22.column[3].children = uniqueSizIds.map((e, i) => {
          console.log(e.trim());
          return {
            label: e.trim(),
            prop: e.trim(),
            align: 'left',
            type: 'number',
            width: 110,
          };
        });
        console.log('111', this.option22.column[3].children);
        // 后端接口通过ORDER BY  s.col_id, ss.sizseq ASC进行排序
        // 其中ss.sizseq通过size尺码表进行排序
        let colId;
        let createdate;
        let i = -1; // 这些数据相同的部分为一行
        this.data22 = [];
        res.data.itemdtlquery.forEach((e, index) => {
          if (!index || e.col_id !== colId || e.createdate !== createdate) {
            i++;
            this.data22.push({
              createdate: e.createdate,
              [e.siz_id]: e.qty || 0,
              colId: e.col_id + '-' + e.name20,
              sizQty: e.qty || 0,
            });

            createdate = e.createdate;
            colId = e.col_id;
          } else {
            // this.$set(this.data22[i], e.siz_id, e.qty || 0);
            this.data22[i][e.siz_id] = e.qty || 0;
            this.data22[i].sizQty += Number(e.qty) || 0;
          }
        });
        console.log(this.data22);
      });

      // 实际入仓部分
      let params = {
        pageSize: this.page.pageSize,
        page: this.page.currentPage,
        itemcode: row.itemcode,
        cmpId: row.cmp_id,
        bndId: row.bnd_id,
        ver: row.ver,
        //    styleNo: this.form.styleNo,
      };
      this.tableLoading2 = true;
      // 按字符串大小排序的尺码表
      // let uniqueSizIds;

      // 再执行query2api
      query2api(params).then((respose) => {
        // 通过后端获取尺码顺序
        this.uniqueSizIds = respose.data.sizeSort;
        // 根据字符串大小从小到大进行排序
        // this.uniqueSizIds.sort((a, b) => a.localeCompare(b));
        console.log(this.uniqueSizIds);
        // 将所有尺码加入到表格列
        this.option2.column[5].children = this.uniqueSizIds.map((e, i) => {
          return {
            label: e,
            prop: e,
            align: 'left',
            slot: true,
            width: 110,
          };
        });
        console.log(this.option2.column);
        // 后端接口通过ORDER BY  s.col_id,ss.sizseq, sa.actual_dao_can_date ASC进行排序
        // 其中ss.sizseq通过size尺码表进行排序
        let colId;
        let actualDaoCanDate;
        let i = -1; // 这些数据相同的部分为一行
        this.data2 = [];
        respose.data.list.forEach((e, index) => {
          if (!index ||
            e.col_id !== colId ||
            JSON.stringify(e.actual_dao_can_date) !== JSON.stringify(actualDaoCanDate)
          ) {
            console.log('进入了多少次if')
            i++;
            this.data2.push({
              itemcode: e.itemcode,
              cmpId: e.cmp_id,
              bndId: e.bnd_id,
              ver: e.ver,
              actualDaoCanDate: e.actual_dao_can_date,
              [e.siz_id]: e.qty || 0,
              colId: e.col_id,
            });

            actualDaoCanDate = e.actual_dao_can_date;
            console.log('3333', e.actual_dao_can_date);
            colId = e.col_id;
            console.log(this.data[i]);
          } else {
            // this.data2[i][e.sizId] = e.qty; 这种方式添加的属性不会是响应式的，即不会触发视图更新,以下两种可以
            // this.$set(this.data2[i], e.sizId, e.qty || 0);d
            this.data2[i][e.siz_id] = e.qty || 0;
            // this.data2[i] = Object.assign({}, this.data2[i], {
            //   [e.sizId]: e.qty,
            // });
          }
        });
        console.log(this.data2);
        this.data2.forEach(function (item, index) {
          item.$cellEdit = true;
        });
        this.tableLoading2 = false;
      });
    },
    handRowUpdate () {
      this.tableLoading2 = true;
      let data = [];
      this.data2.forEach((item) => {
        this.uniqueSizIds.forEach((prop) => {
          console.log('item', item);
          console.log('item的prop', item[prop]);
          // 不包括undifind,undifind表示不存在的尺码
          if (item[prop] || item[prop] == 0) {
            let tempItem = {
              qty: item[prop],
              sizId: prop,
              itemcode: item.itemcode,
              cmpId: item.cmpId,
              bndId: item.bndId,
              ver: item.ver,
              actualDaoCanDate: item.actualDaoCanDate,
              colId: item.colId,
            };
            data.push(tempItem);
          }
        });
      });
      console.log(data);
      data.map((item) => {
        item.colId = item.colId.split('-')[0];
        return item;
      });
      let params = {
        data: data,
      };
      save(params)
        .then((respose) => {
          this.$message.success('保存成功');
          this.tableLoading2 = false;
        })
        .catch(() => {
          this.$message.error('保存失败， 请重试');
          this.tableLoading2 = false;
        });
    },
    /**
     * @title 改变每页记录数
     *
     **/
    sizeChange (val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.query();
    },
    /**
     * @title 换页
     *
     **/
    currentChange (val) {
      this.page.currentPage = val;
      this.query();
    },
    /**
     * @title 查询
     *
     */
    query (i) {
      if (i) {
        this.page.currentPage = 1;
      }
      let itemcode = this.form.itemcode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      let params = {
        pageSize: this.page.pageSize,
        page: this.page.currentPage,
        itemcode: itemcode,
        itemcodelist: itemcodelist,
      };
      this.tableLoading = true;
      queryapi(params).then((respose) => {
        console.log(respose.data.list);
        this.data = respose.data.list;
        this.page.total = respose.data.total;
        this.tableLoading = false;
      });
    },

    /**
     * @title 双击行
     *
     */
    dbClick (row, index) {
      this.dialogVisible = true;
    },

    /**
     *@title 选中（复选框）数据
     *
     */
    selectionChange (list) {
      this.selectList = list;
      console.log(this.selectList);
    },
    close () {
      this.dialogVisible = false;
    },
    // 合计
    summaryMethod ({ columns, data }) {
      let sums = [];
      let sum = 0;
      columns.forEach((column, index) => {
        if (index >= 3) {
          if (column.property) {
            sums[index] = 0;
            data.forEach((item) => {
              sums[index] += Number(item[column.property]) || 0;
              sum += Number(item[column.property]) || 0;
            });
          }
        }
      });

      // 横向总计部分
      data.forEach((item) => {
        let hsum = 0;
        columns.forEach((column, index) => {
          if (index >= 3) {
            if (column.property) {
              hsum += Number(item[column.property]) || 0;
            }
          }
        });
        item.sizQty = hsum;
      });
      //

      sums[2] = '合计: ' + sum;
      console.log(sums);
      return sums;
    },
    summaryMethod22 ({ columns, data }) {
      let sums = [];
      let sum = 0;
      columns.forEach((column, index) => {
        if (index >= 3) {
          if (column.property) {
            sums[index] = 0;
            data.forEach((item) => {
              sums[index] += Number(item[column.property]) || 0;
              sum += Number(item[column.property]) || 0;
            });
          }
        }
      });
      sums[2] = '合计: ' + sum;
      console.log(sums);
      return sums;
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

.second-main-container {
  width: 95%;
  background: $neutral-color-1;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;

  .el-form .el-form-item {
    margin-bottom: 0px;
  }

  box-shadow: $shadow-1;
}

:deep(.transparent-border .el-table) {
  border-radius: $border-radius-medium;
  border: 1px solid #dcdcdc;
}

:deep(.transparent-border .el th) {
  padding: 20px 0; // 设置表头的上下边距
  height: 30px;
}
</style>