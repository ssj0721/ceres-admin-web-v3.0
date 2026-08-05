<template>
  <basic-container class="container">
    <ows-upload
      v-if="uploadVisable"
      v-model="uploadVisable"
      accept=".xls,.xlsx"
      single="true"
      @files-selected="handleFilesSelected"
    >
      <template #footer>
        <el-button type="primary" class="custom-button" @click="dataExport2()">
          导出装箱资料模板
        </el-button>
        <el-button
          type="primary"
          class="custom-button"
          @click="handleChangeFile"
        >
          确认
        </el-button>
        <el-button @click="uploadVisable = false"> 取消 </el-button>
      </template>
      <template #footer-tip>
        <div>{{ tipText }}</div>
      </template>
    </ows-upload>

    <mybottons :show-list="['check']" @handleCheck="query()">
      <el-button
        type="primary"
        class="custom-button"
        @click="uploadVisable = true"
      >
        导入装箱资料
      </el-button>
      <input
        id="excelUpload"
        type="file"
        style="display: none"
        accept="application/vnd.ms-excel,.xlsx"
        @change="handleChangeFile"
      />
      <el-button type="primary" class="custom-button" @click="dataExport()">
        导出装箱资料
      </el-button>
    </mybottons>
    <!-- <el-row type="flex" justify="center" align="middle">
      <el-button
        type="primary"
        class="custom-button"
        @click="query()"
      >查询
      </el-button>
    </el-row> -->
    <div class="second-main-container">
      <avue-form v-model="form" :option="formOption" />
      <el-header class="table-select-header" height="30px">
        <el-button type="text">
          <strong>当前表格已选择</strong>
          <strong style="font-size: 16px; margin: 4px">&#32; {{ mainSelectList.length }}&#32;</strong>
          <strong>项</strong>
        </el-button>
        <span>&#32;&#32;&#32;&#32;</span><el-button type="text" @click="clearSelect()">
          <!-- <strong>{{ $t(`Action.Empty`) }}</strong> -->
          <strong>清空</strong>
        </el-button>
        <span>&#32;&#32;&#32;&#32;</span>
        <el-button type="text" @click="checkAllSelect()">
          <!-- <strong>{{ $t(`Action.CheckAll`) }}</strong> -->
          <strong>选择全部</strong>
        </el-button>
      </el-header>

      <el-table
        ref="crud"
        v-loading="tableLoading"
        :data="data"
        :row-key="getRowKeys"
        :highlight-current-row="radio"
        :row-class-name="rowClassName"
        @row-dblclick="edit"
        @current-change="handleCurrentRowChange"
        @select="handleSelect"
        @select-all="hadleSelectAll"
        @filter-change="filterTagTable"
      >
        <!--:reserve-selection="true"-->
        <el-table-column v-if="!radio" type="selection" width="55" />
        <el-table-column
          v-for="column in option.column"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :filters="column.filters"
          :type="column.type"
          :formatter="formatDate"
          :width="column.width"
          show-overflow-tooltip
        />
        <!-- 在每列数据后添加一个按钮 -->
        <el-table-column :width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="edit(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="page.currentPage"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="装箱资料详情" center fullscreen>
      <el-row>
        <avue-form ref="form" v-model="form2" :option="formOption2" />
      </el-row>
      <el-row span="12">
        <el-button
          type="primary"
          size="mini"
          class="custom-button"
          @click="openDiag3()"
        >生成发车
        </el-button>
        <el-button
          type="primary"
          size="mini"
          class="custom-button"
          @click="dataExport3()"
        >
          列印
        </el-button>
        <el-button
          type="primary"
          class="custom-button"
          size="mini"
          @click="handleDetailAdd()"
        >新增</el-button>
        <el-button type="danger" size="mini" @click="delZx()">删除</el-button>
        <el-button size="mini" @click="handleClose1()">关闭</el-button>
      </el-row>
      <el-row>
        <avue-crud
          ref="crud2"
          :option="option2"
          :data="data2"
          :table-loading="tableLoading2"
          @selection-change="selectionChange"
          @row-dblclick="edit2"
        >
          <!-- <avue-crud
          ref="crud2"
          :option="option2"
          :data="data2"
          :table-loading="tableLoading2"
          @selection-change="selectionChange"
        > -->
          <template #menu="{ row, size, type }">
            <el-button
              :size="size"
              :type="type"
              class="custom-button"
              @click="editCargoInfo(row)"
            >发车信息修改</el-button>
            <el-button
              v-if="checkProduceCar(row)"
              :size="size"
              :type="type"
              class="custom-button"
              @click="edit2(row)"
            >查看明细</el-button>
          </template>
        </avue-crud>
      </el-row>
    </el-dialog>
    <el-dialog
      v-if="dialogVisible2"
      v-model="dialogVisible2"
      v-loading="loading"
      center
      :fullscreen="true"
      :header="false"
      :before-close="handleClose2"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="装箱资料明细" name="first">
          <!-- {{ saveFromData }} -->
          <el-row class="btnList">
            <!-- <el-button
              type="primary"
              v-if="saveFromData.status != '已送出'"
              size="mini"
              @click="handleSubmit"
              >保存</el-button
            > -->
            <el-button
              class="custom-button"
              type="primary"
              size="mini"
              @click="handleSubmit"
            >
              保存
            </el-button>

            <el-button type size="mini" @click="handleClose2">关闭</el-button>
            <!-- <el-button type size="mini" @click="ShowsavePreviewdialog">测试</el-button> -->
          </el-row>
          <avue-form ref="form" v-model="saveFromData" :option="topFormOp" />
          <!-- <div class="mainTable"> -->
          <el-row>
            <el-col :span="15">
              <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="装箱" name="first">
                  <el-row>
                    <div
                      v-if="saveFromData.status != '已送出'"
                      style="display: flex; align-items: center"
                    >
                      <el-button
                        type="success"
                        size="mini"
                        class="custom-button"
                        @click="handleAdd"
                      >新增</el-button>
                      <el-button
                        type="danger"
                        size="mini"
                        @click="handleDelete"
                      >删除</el-button>
                    </div>
                  </el-row>
                  <avue-crud
                    ref="mainCurd1"
                    :data="dtl1Data"
                    :option="dtlTableOp"
                    @selection-change="selectMethod"
                    @row-click="handleClick3"
                  />
                </el-tab-pane>
              </el-tabs>
            </el-col>

            <el-col :span="9">
              <el-tabs v-model="activeName1" type="border-card">
                <el-tab-pane id="tabCrud" label="装箱明细" name="first">
                  <el-row
                    v-if="saveFromData.status != '已送出'"
                    style="margin-left: 5px; display: flex"
                  >
                    <el-button
                      type="success"
                      size="small"
                      class="custom-button"
                      @click="handleAddDetail"
                    >
                      新增
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="handleDeleteDetail"
                    >删除</el-button>
                    <!-- <div style="margin-left:10px;justify-content: center;">
                        <el-checkbox v-model="checked">回车新增</el-checkbox>
                      </div> -->
                  </el-row>

                  <avue-crud
                    ref="dtl2Crud"
                    :data="dtl1Data2"
                    :option="dtlTableOp2"
                    :page.sync="mPage"
                    @row-click="handleClick4"
                    @selection-change="selectMethod2"
                  >
                    <!-- avue3中使用插槽需要使用的是prop的名字-form的形式 -->
                    <template #pkQty-form="{ row, column }">
                      <el-input
                        v-model.number="row[column.prop]"
                        @input="handlePkQtyChange(row, column)"
                      />
                    </template>
                  </avue-crud>
                </el-tab-pane>
                <el-tab-pane id="tabCrud" label="箱唛" name="first1">
                  <el-input
                    v-model="saveFromData.ship_mark"
                    type="textarea"
                    :rows="20"
                    style="font-size: 15px"
                    placeholder="请输入内容"
                  />
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
          <!-- </div> -->
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible3"
      title="发车明细输入"
      width="50%"
      height="50%"
      center
    >
      <avue-form v-model="form3" :option="formOption3" />
      <el-button
        type
        size="mini"
        class="custom-button"
        @click="produceCar"
      >确定</el-button>
      <el-button
        type
        size="mini"
        class="custom-button"
        @click="dialogVisible3 = false"
      >关闭</el-button>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible4"
      title="发车明细"
      width="50%"
      height="50%"
      center
    >
      <avue-form v-model="form4" :option="formOption4" />

      <el-button
        class="custom-button"
        type
        size="mini"
        @click="edit3"
      >修改</el-button>
      <el-button
        type
        size="mini"
        @click="dialogVisible4 = false"
      >关闭</el-button>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  queryapi,
  query2api,
  ImportInfpkdatjws,
  deleteInfpkdatjws,
  updateInfpkdatjws,
  SalCargoSave2,
  getinfpkdatdtlajws,
  infpkdatjwsPre,
  infpkdatdtlajwsPre,
  dataExport2,
  dataExport,
  dataExport3,
  findCaogoByNo,
  editCaogo,
} from './index';
import {
  packingListOption1,
  packingListOption2,
  packingListformOption,
  packingListformOption2,
  packingListformOption3,
  packingListformOption4,
  packingListTopFormOp,
  packingListDtlTableOp2,
  packingListDtlTableOp,
} from './option';
import { v1 } from 'uuid';
import * as XLSX from 'xlsx';
import { ElLoading } from 'element-plus';
import { excel } from '@/utils/excelExport';
import owsUpload from '@/components/Upload/owsUpload.vue';
export default {
  name: 'PackingList',
  components: {
    owsUpload,
  },
  data () {
    return {
      cargoVisual: false,
      tableAllData: [],
      uploadVisable: false,
      index: 1,
      names: null,
      visible: false,
      // 默认数据
      items: [],
      pkprops: null,
      nameprops: null,
      returnType: 'value',
      returnValue: 'id',
      // 已選擇的數據
      radio: false,
      tipText:
        '行的每箱数量不能为空且大于0，行的颜色不能为空，行的尺码不能为空',
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,

      dialogVisible4: false,
      form: {},
      formOption: packingListformOption,
      rowKey: 'itemcode',
      option: packingListOption1,
      option2: packingListOption2,
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
      formOption2: packingListformOption2,
      form3: {},
      formOption3: packingListformOption3,
      form4: {},
      formOption4: packingListformOption4,
      mainSelectList: [],
      selectList: [],
      selectList2: [],
      selectRows: [], // 用于左边细表的选中
      selectRows2: [], // 用于右边细表的选中
      uniqueSizIds: [],
      importDialogVisible: false,
      importFileList: [],
      activeName: 'first',
      activeName1: 'first',
      saveFromData: {},
      mPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      topFormOp: packingListTopFormOp,
      dtlTableOp: packingListDtlTableOp,
      dtlTableOp2: packingListDtlTableOp2,
      dtl1Data: [],
      dtl1Data2: [],
      loadingInstance: null,
      selectedFiles: [], // 存储选择的文件
      isEdit: false, // 详表详细信息是否可以编辑
      // 是否发车
      isProduceCar: false,
      // 校验时间
      shipDates: [],
    };
  },
  mounted () {
    let params = {
      PageSize: this.page.pageSize,
      PageNumber: this.page.currentPage,
    };
    this.tableLoading = true;
    queryapi(params).then((respose) => {
      if (respose.data) {
        this.data = respose.data;
        this.page.total = respose.data.length;
      }
      this.tableAllData = respose.data;
      // this.data = this.paging(this.page.pageSize, this.page.currentPage);
    });
    this.tableLoading = false;
  },
  methods: {
    isValidDate (dateString) {
      const regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
      // 首先检查格式是否正确（yyyy-mm-dd）
      if (!regex.test(dateString)) {
        return false;
      }
      const [year, month, day] = dateString.split('-').map(Number);
      // 检查月份和日期是否在逻辑上正确
      if (month < 1 || month > 12 || day < 1) {
        return false;
      }
      // 使用 JavaScript 的 Date 对象来验证日期
      const date = new Date(year, month - 1, day);
      // 检查转换后的日期是否和原始日期相匹配
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    // 导入excel
    // upLoadExcel () {
    //   document.querySelector('#excelUpload').click();
    // },
    // 2024.11.22 lk edit
    handleFilesSelected (files) {
      this.selectedFiles = files;
    },
    // 2024.11.22 lk edit
    handleChangeFile () {
      // if (e.target.files.length === 0) return;

      // this.loadingInstance = ElLoading.service({ text: '导入中...' });
      // let json;
      // let fileReader = new FileReader();
      // // 定义加载函数 （读取为二进制）
      // fileReader.onload = (ev) => {
      //   document.querySelector('#excelUpload').value = '';
      //   let data = ev.target.result; // excel表格的数据
      //   let workbook = XLSX.read(data, { type: 'binary' }); // 转码 }); //转码
      //   json = XLSX.utils.sheet_to_json(
      //     workbook.Sheets[workbook.SheetNames[0]]
      //   );
      //   console.log('导入前的数据', json);
      //   // this.upLoadData(json);
      // };
      // // 开始读取
      // let oFile = e.target.files[0];
      // if (
      //   ['xls', 'xlsx'].indexOf(
      //     oFile.name.substring(oFile.name.lastIndexOf('.') + 1)
      //   ) !== -1
      // ) {
      //   fileReader.readAsBinaryString(oFile);
      // } else {
      //   this.$message.warning('请选择正确的文件格式');
      //   this.loadingInstance.close();
      // }
      if (this.selectedFiles.length === 0) return;
      this.loadingInstance = ElLoading.service({ text: '导入中...' });
      let json;
      let fileReader = new FileReader();
      fileReader.onload = (ev) => {
        let data = ev.target.result;
        let workbook = XLSX.read(data, { type: 'binary' });
        json = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        console.log('导入前的数据', json);
        this.upLoadData(json);
      };

      let oFile = this.selectedFiles[0];
      if (
        ['xls', 'xlsx'].indexOf(oFile.name.split('.').pop().toLowerCase()) !==
        -1
      ) {
        fileReader.readAsBinaryString(oFile);
      } else {
        this.$message.warning('请选择正确的文件格式');
        this.loadingInstance.close();
      }
    },
    hadndleBlur (row, prop) {
      if (row[prop] == null) return;
      row[prop] = Number(row[prop]);
      console.log(row[prop]);
      console.log(this.data2);
      if (isNaN(row[prop]) || row[prop] < 0) {
        row[prop] = 0;
      }
    },
    // async upLoadData (jsonData) {
    //   let json = jsonData;
    //   let oProp = {};
    //   oProp['款号'] = 'itemcode';
    //   oProp['口岸'] = 'destBrief';
    //   oProp['走货日期'] = 'shipDate';
    //   oProp['开始箱数'] = 'startPkno';
    //   oProp['结束箱号'] = 'endPkno';
    //   oProp['颜色'] = 'colorNo';
    //   oProp['尺码'] = 'asssize';
    //   oProp['内长'] = 'assinseam';
    //   oProp['每箱数量'] = 'pkQty';
    //   let s = '';
    //   let resultMap = json.map((item, index) => {
    //     let tData = {};
    //     for (let key in item) {
    //       if (oProp[key] === 'shipDate') {
    //         if (typeof item[key] === 'number') {
    //           // 处理excel解析后是将日期转化是时间戳的格式,通过ssf转化回固定格式

    //           tData[oProp[key]] = XLSX.SSF.format('yyyy-MM-dd', item[key]);
    //         } else {
    //           // 处理excel解析后是将日期转化是字符串的格式,如果是字符串/形式会转化为-作为日期连接符
    //           tData[oProp[key]] = item[key].replace(/\//g, '-');
    //         }
    //       } else {
    //         tData[oProp[key]] = item[key];
    //       }
    //     }
    //     if (!this.isValidDate(tData['shipDate'])) {
    //       s = '第' + (index + 1) + '行的走货日期有误，请修改后重新导入！';
    //     }
    //     if (!tData['pkQty']) {
    //       s = '第' + (index + 1) + '行的每箱数量不能为空,请修改后重新导入！';
    //     } else if (s === '' && isNaN(tData['pkQty'])) {
    //       s =
    //         '第' + (index + 1) + '行的每箱数量出现非法字符，请修改后重新导入！';
    //     } else if (s === '' && tData['pkQty'] <= 0) {
    //       s =
    //         '第' +
    //         (index + 1) +
    //         '行的每箱数量不能小于等于0，请修改后重新导入！';
    //     }
    //     if (!tData['destBrief']) {
    //       s = '第' + (index + 1) + '行的口岸不能为空,请修改后重新导入！';
    //     }
    //     if (!tData['colorNo']) {
    //       s = '第' + (index + 1) + '行的颜色不能为空,请修改后重新导入！';
    //     }
    //     if (!tData['asssize']) {
    //       s = '第' + (index + 1) + '行的尺码不能为空,请修改后重新导入！';
    //     }
    //     return tData;
    //   });

    //   console.log('resultMap before', resultMap);
    //   resultMap.forEach((item, index) => {
    //     resultMap.forEach((item2, index2) => {
    //       if (
    //         index < index2 &&
    //         item.itemcode === item2.itemcode &&
    //         item.shipDate === item2.shipDate &&
    //         item.destBrief === item2.destBrief &&
    //         !(
    //           item.startPkno === item2.startPkno && item.endPkno === item2.endPkno
    //         )
    //       ) {
    //         if (
    //           (item.startPkno >= item2.startPkno &&
    //             item.startPkno <= item2.endPkno) ||
    //           (item.endPkno >= item2.startPkno && item.endPkno <= item2.endPkno)
    //         ) {
    //           s =
    //             '第' +
    //             (index + 1) +
    //             '条数据和第' +
    //             (index2 + 1) +
    //             '条数据中的起止箱号存在交叉';
    //         }
    //       }
    //     });
    //   });
    //   if (s !== '') {
    //     this.loadingInstance.close();
    //     return this.$message.warning(s);
    //   }

    //   if (resultMap.length <= 0) {
    //     if (this.loadingInstance) {
    //       this.loadingInstance.close();
    //     }
    //     return this.$message.warning('导入数据为空!');
    //   }
    //   let flag = false;

    //   // console.log('resultMap!!! ', resultMap);
    //   // 修改部分
    //   await updateInfpkdatjws(resultMap)
    //     .then((respose) => {
    //       resultMap = respose.data;
    //       console.log('从后台返回的数据', resultMap);
    //     })
    //     .catch((_err) => {
    //       flag = true;
    //       this.loadingInstance.close();
    //       this.$message.error('An error occurred while updating data.');
    //     });
    //   if (resultMap.length === 0) {
    //     this.loadingInstance.close();
    //     this.clearSelect();
    //     this.query();
    //     this.$message.success('导入成功 ');
    //     return;
    //   }
    //   if (flag) return;
    //   // return;
    //   // 新增部分
    //   // data1是InfPkDatJws表,data2是InfPkDatDtlaJws表,data3是InfPkDatDtlaDtlJws表
    //   let data1 = [];
    //   let data2 = [];
    //   let data3 = [];
    //   let result2 = resultMap.reduce((acc, curr) => {
    //     let uuid = v1();
    //     let key =
    //       curr.itemcode +
    //       curr.destBrief +
    //       curr.shipDate +
    //       curr.startPkno +
    //       curr.startPkno.endPkno;
    //     if (!acc[key]) {
    //       acc[key] = {
    //         infPkDatDtlaoid: uuid,
    //         itemcode: curr.itemcode,
    //         destBrief: curr.destBrief,
    //         shipDate: curr.shipDate,
    //         destination: curr.destination,
    //         startPkno: curr.startPkno,
    //         endPkno: curr.endPkno,
    //         cartonNum: Number(curr.endPkno - curr.startPkno + 1),
    //         cartonPkqty: 0,
    //         pkType: 'A',
    //         netWeight: 0.0,
    //         grossWeight: 0,
    //         cubaNum: 0,
    //         salPoFk: curr.salPoFk,
    //       };
    //     }
    //     acc[key].cartonPkqty += Number(curr.pkQty);
    //     return acc;
    //   }, {});
    //   data2 = Object.values(result2);
    //   let result1 = data2.reduce((acc, curr) => {
    //     let uuid = v1();
    //     let key = curr.itemcode + curr.destBrief + curr.shipDate;
    //     if (!acc[key]) {
    //       acc[key] = {
    //         infPkDatoid: uuid,
    //         itemcode: curr.itemcode,
    //         destBrief: curr.destBrief,
    //         destination: curr.destination,
    //         shipDate: curr.shipDate,
    //         ttlCarton: 0,
    //         ttlshipQty: 0,
    //         pkSeqno: null,
    //         destSeq: null,
    //         pkVerno: 0,
    //         salPoFk: curr.salPoFk,
    //       };
    //     }
    //     acc[key].ttlCarton += curr.endPkno - curr.startPkno + 1;
    //     acc[key].ttlshipQty +=
    //       (curr.endPkno - curr.startPkno + 1) * curr.cartonPkqty;
    //     return acc;
    //   }, {});
    //   data1 = Object.values(result1);

    //   data2.forEach((item2) => {
    //     data1.forEach((item1) => {
    //       if (
    //         item2.itemcode === item1.itemcode &&
    //         item2.destBrief === item1.destBrief &&
    //         item2.shipDate === item1.shipDate
    //       ) {
    //         item2.infPkDatFk = item1.infPkDatoid;
    //       }
    //     });
    //   });
    //   data3 = resultMap.map((item3) => {
    //     let uuid = v1();
    //     let infPkDatDtlaFk;
    //     data2.forEach((item2) => {
    //       if (
    //         item3.itemcode === item2.itemcode &&
    //         item3.destBrief === item2.destBrief &&
    //         item3.shipDate === item2.shipDate &&
    //         item3.startPkno === item2.startPkno &&
    //         item3.endPkno === item2.endPkno
    //       ) {
    //         infPkDatDtlaFk = item2.infPkDatDtlaoid;
    //       }
    //     });
    //     return {
    //       infPkDatDtlaDtloid: uuid,
    //       colorNo: item3.colorNo,
    //       asssize: item3.asssize,
    //       assinseam: item3.assinseam,
    //       pkQty: item3.pkQty,
    //       infPkDatDtlaFk: infPkDatDtlaFk,
    //     };
    //   });
    //   // console.log(data1);
    //   // console.log(data2);
    //   // console.log(data3);
    //   // 现在map数组包含了data1、data2、data3以及resultMap的数据
    //   // return ;

    //   let params = {
    //     infPkDatJwsList: data1,
    //     infPkDatDtlaJwsList: data2,
    //     infPkDatDtlaDtlJwsList: data3,
    //   };
    //   if (s !== '') {
    //     this.loadingInstance.close();
    //     return this.$message.warning(s);
    //   }
    //   console.log('导入前的所有数据', params);
    //   await ImportInfpkdatjws(params)
    //     .then((r) => {
    //       this.loadingInstance.close();
    //       this.query();
    //       this.$message.success('导入成功');
    //     })
    //     .catch(() => {
    //       this.loadingInstance.close();
    //     });
    //   return;
    // },
    /**
     * @description 导入数据
     */
    async upLoadData (jsonData) {
      let json = jsonData;
      let oProp = {};
      oProp['款号'] = 'itemcode';
      oProp['走货日期'] = 'shipDate';
      oProp['开始箱数'] = 'startPkno';
      oProp['结束箱号'] = 'endPkno';
      oProp['颜色'] = 'colorNo';
      oProp['尺码'] = 'asssize';
      oProp['内长'] = 'assinseam';
      oProp['每箱数量'] = 'pkQty';
      let s = '';
      let resultMap = json.map((item, index) => {
        let tData = {};
        for (let key in item) {
          if (oProp[key] === 'shipDate') {
            if (typeof item[key] === 'number') {
              // 处理excel解析后是将日期转化是时间戳的格式,通过ssf转化回固定格式
              tData[oProp[key]] = XLSX.SSF.format('yyyy-MM-dd', item[key]);
            } else {
              // 处理excel解析后是将日期转化是字符串的格式,如果是字符串/形式会转化为-作为日期连接符
              tData[oProp[key]] = item[key].replace(/\//g, '-');
            }
          } else {
            tData[oProp[key]] = item[key];
          }
        }
        // 设置 destBrief 固定值
        tData['destBrief'] = 'GD-101';

        if (!this.isValidDate(tData['shipDate'])) {
          s = '第' + (index + 1) + '行的走货日期有误，请修改后重新导入！';
        }
        if (!tData['pkQty']) {
          s = '第' + (index + 1) + '行的每箱数量不能为空,请修改后重新导入！';
        } else if (s === '' && isNaN(tData['pkQty'])) {
          s =
            '第' + (index + 1) + '行的每箱数量出现非法字符，请修改后重新导入！';
        } else if (s === '' && tData['pkQty'] <= 0) {
          s =
            '第' +
            (index + 1) +
            '行的每箱数量不能小于等于0，请修改后重新导入！';
        }
        if (!tData['colorNo']) {
          s = '第' + (index + 1) + '行的颜色不能为空,请修改后重新导入！';
        }
        if (!tData['asssize']) {
          s = '第' + (index + 1) + '行的尺码不能为空,请修改后重新导入！';
        }
        return tData;
      });

      console.log('resultMap before', resultMap);
      resultMap.forEach((item, index) => {
        resultMap.forEach((item2, index2) => {
          if (
            index < index2 &&
            item.itemcode === item2.itemcode &&
            item.shipDate === item2.shipDate &&
            item.destBrief === item2.destBrief &&
            !(
              item.startPkno === item2.startPkno &&
              item.endPkno === item2.endPkno
            )
          ) {
            if (
              (item.startPkno >= item2.startPkno &&
                item.startPkno <= item2.endPkno) ||
              (item.endPkno >= item2.startPkno && item.endPkno <= item2.endPkno)
            ) {
              s =
                '第' +
                (index + 1) +
                '条数据和第' +
                (index2 + 1) +
                '条数据中的起止箱号存在交叉';
            }
          }
        });
      });
      if (s !== '') {
        this.loadingInstance.close();
        return this.$message.warning(s);
      }

      if (resultMap.length <= 0) {
        if (this.loadingInstance) {
          this.loadingInstance.close();
        }
        return this.$message.warning('导入数据为空!');
      }
      let flag = false;
      console.log('resultMap 导入前!!! ', resultMap);
      await updateInfpkdatjws(resultMap)
        .then((respose) => {
          resultMap = respose.data;
          console.log('从后台返回的数据', resultMap);
        })
        .catch((_err) => {
          flag = true;
          this.loadingInstance.close();
          this.$message.error('An error occurred while updating data.');
        });
      if (resultMap.length === 0) {
        this.loadingInstance.close();
        this.clearSelect();
        this.query();
        this.$message.success('导入成功 ');
        return;
      }
      if (flag) return;

      let data1 = [];
      let data2 = [];
      let data3 = [];
      let result2 = resultMap.reduce((acc, curr) => {
        let uuid = v1();
        let key =
          curr.itemcode +
          curr.destBrief +
          curr.shipDate +
          curr.startPkno +
          curr.startPkno.endPkno;
        if (!acc[key]) {
          acc[key] = {
            infPkDatDtlaoid: uuid,
            itemcode: curr.itemcode,
            destBrief: curr.destBrief,
            shipDate: curr.shipDate,
            destination: curr.destination,
            startPkno: curr.startPkno,
            endPkno: curr.endPkno,
            cartonNum: Number(curr.endPkno - curr.startPkno + 1),
            cartonPkqty: 0,
            pkType: 'A',
            netWeight: 0.0,
            grossWeight: 0,
            cubaNum: 0,
            salPoFk: curr.salPoFk,
          };
        }
        acc[key].cartonPkqty += Number(curr.pkQty);
        return acc;
      }, {});
      data2 = Object.values(result2);
      let result1 = data2.reduce((acc, curr) => {
        let uuid = v1();
        let key = curr.itemcode + curr.destBrief + curr.shipDate;
        if (!acc[key]) {
          acc[key] = {
            infPkDatoid: uuid,
            itemcode: curr.itemcode,
            destBrief: curr.destBrief,
            destination: curr.destination,
            shipDate: curr.shipDate,
            ttlCarton: 0,
            ttlshipQty: 0,
            pkSeqno: null,
            destSeq: null,
            pkVerno: 0,
            salPoFk: curr.salPoFk,
          };
        }
        acc[key].ttlCarton += curr.endPkno - curr.startPkno + 1;
        acc[key].ttlshipQty +=
          (curr.endPkno - curr.startPkno + 1) * curr.cartonPkqty;
        return acc;
      }, {});
      data1 = Object.values(result1);

      data2.forEach((item2) => {
        data1.forEach((item1) => {
          if (
            item2.itemcode === item1.itemcode &&
            item2.destBrief === item1.destBrief &&
            item2.shipDate === item1.shipDate
          ) {
            item2.infPkDatFk = item1.infPkDatoid;
          }
        });
      });
      data3 = resultMap.map((item3) => {
        let uuid = v1();
        let infPkDatDtlaFk;
        data2.forEach((item2) => {
          if (
            item3.itemcode === item2.itemcode &&
            item3.destBrief === item2.destBrief &&
            item3.shipDate === item2.shipDate &&
            item3.startPkno === item2.startPkno &&
            item3.endPkno === item2.endPkno
          ) {
            infPkDatDtlaFk = item2.infPkDatDtlaoid;
          }
        });
        return {
          infPkDatDtlaDtloid: uuid,
          colorNo: item3.colorNo,
          asssize: item3.asssize,
          assinseam: item3.assinseam,
          pkQty: item3.pkQty,
          infPkDatDtlaFk: infPkDatDtlaFk,
        };
      });

      let params = {
        infPkDatJwsList: data1,
        infPkDatDtlaJwsList: data2,
        infPkDatDtlaDtlJwsList: data3,
      };
      if (s !== '') {
        this.loadingInstance.close();
        return this.$message.warning(s);
      }
      console.log('导入前的所有数据', params);
      await ImportInfpkdatjws(params)
        .then((r) => {
          this.loadingInstance.close();
          this.query();
          this.$message.success('导入成功');
        })
        .catch(() => {
          this.loadingInstance.close();
        });
      return;
    },
    edit (row) {
      this.form2 = row;
      this.dialogVisible = true;
      let params = {
        itemcode: row.itemcode,
      };
      this.tableLoading2 = true;
      // 按字符串大小排序的尺码表
      // let uniqueSizIds;
      query2api(params).then((respose) => {
        console.log(respose.data);
        this.data2 = respose.data;

        console.log('data2!', this.data2);
        this.tableLoading2 = false;
      });
    },
    /**
     * @title 查询
     *
     */
    query () {
      let itemcode = this.form.itemcode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      let params = {
        PageSize: this.page.pageSize,
        PageNumber: this.page.currentPage,
        itemcode: itemcode,
        itemcodelist: itemcodelist,
      };
      if (itemcode || itemcodelist.length > 1) {
        params.PageNumber = 1;
        this.page.currentPage = 1;
      }
      this.tableLoading = true;
      queryapi(params).then((respose) => {
        console.log(respose.data);
        this.tableAllData = respose.data;
        this.data = this.paging(this.page.pageSize, this.page.currentPage);
        console.log(this.data);
        // this.page.total = respose.data.result.total;
        // this.page.pageSize = respose.data.result.pageSize;
        this.tableLoading = false;
      });
    },
    // query () {
    //   let itemcode = this.form.itemcode || '';
    //   let itemcodelist = itemcode.split(/[,\n ]/).filter(code => code.trim() !== '');
    //   const data = this.data;
    //   let filteredData = data;

    //   if (itemcodelist.length > 0) {
    //     if (itemcodelist.length > 1) {
    //       filteredData = filteredData.filter(item => itemcodelist.includes(item.itemcode));
    //     } else {
    //       filteredData = filteredData.filter(item => item.itemcode.includes(itemcode.trim()));
    //     }
    //     this.page.currentPage = 1;
    //   }

    //   this.page.total = filteredData.length;
    //   console.log('data', filteredData);

    //   this.data = this.pagingData(filteredData, this.page.pageSize, this.page.currentPage);
    //   // console.log('data', this.data);
    // },
    pagingData (data, pageSize, currentPage) {
      let start = (currentPage - 1) * pageSize;
      let end = currentPage * pageSize;
      return data.slice(start, end);
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
    },
    close () {
      this.dialogVisible = false;
    },
    produceCar () {
      let data = this.selectList.filter((ele) => ele.status === '制作中');
      if (!this.form3.tel || !this.form3.person || !this.form3.address) {
        return this.$message.warning('请补充完整信息!');
      }
      if (!isNaN(this.form3.tel) === false || this.form3.tel.length !== 11) {
        return this.$message.warning('手机电话必须为数字和11位数字');
      }
      this.dialogVisible3 = false;
      // 判断是否存在相同类型的相同口岸的情况

      // let res=null;
      // let conDest=data.map((item)=>{
      //     return item.destination;
      // });
      // console.log(conDest);
      // let duplicateDest = conDest.reduce((acc, curr, index, arr) => {
      //     if (arr.indexOf(curr) !== index && !acc.includes(curr)) {
      //         acc.push(curr);
      //     }
      //     return acc;
      // }, []);

      // console.log(duplicateDest); // 输出重复的元素
      // res=duplicateDest.join(' , ');
      // if(duplicateDest.length>=1){
      //   return warning("存在多个相同的口岸有:"+res);
      // }
      // 判断发车是否存在类型不同的口岸
      let result = null;
      // let checkDest = data.map((item) => {
      //   return item.destBrief.substring(0, 2);
      // });
      let checkDest = data.map((item) => {
        // 暂定使用
        return item.destBrief;
      });
      console.log(checkDest);
      let uniqueDest = [...new Set(checkDest)]; // 过滤重复的元素
      if (uniqueDest.length > 1) {
        result = uniqueDest.join(' , ');
        this.$confirm(
          '存在' +
            result +
            '共' +
            uniqueDest.length +
            '种口岸' +
            ', 是否继续发车?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            this.produceCar2(data);
          })
          .catch(() => {});
      } else this.produceCar2(data);

      return;
    },
    openDiag3 () {
      console.log('selectList', this.selectList);
      this.form3 = {
        tel: null,
        address: null,
        person: null,
      };
      if (this.data2.length === 0) {
        return this.$message.warning('请新增数据!');
      }
      if (this.selectList.length === 0) {
        return this.$message.warning('请选择数据!');
      }
      let data = this.selectList.filter((ele) => ele.status === '制作中');
      if (data.length === 0) {
        return this.$message.warning('已全部发车!');
      }
      this.dialogVisible3 = true;
    },
    /**
     * @description:校验是否发车
     */
    checkProduceCar (row) {
      return row.status === '制作中';
    },
    delZx () {
      if (this.data2.length === 0) {
        return this.$message.warning('请新增数据!');
      }
      if (this.selectList.length === 0) {
        return this.$message.warning('请选择数据!');
      }
      let data = this.selectList.filter((ele) => ele.status === '已送出');
      if (data.length > 0) {
        return this.$message.warning('已发车数据无法删除,请重新选择!');
      }
      console.log(this.selectList);
      let infPkDatoids = this.selectList.map((item) => {
        return item.inf_PK_DATOID;
      });
      let params = {
        infPkDatoids: infPkDatoids,
      };
      deleteInfpkdatjws(params).then((respose) => {
        this.edit(this.form2);
        this.query();
        this.$message.success('删除成功');
      });
    },
    async produceCar2 (data) {
      this.tableLoading2 = true;
      let SalCargo = {
        cargoSeq: null, // 走货序号
        cargoNo: null, // 走货编号
        cargoComp: null, // 公司
        cargoTrade: null, // 品牌
        cargoTo: null, // 地址

        tel: this.form3.tel, // 电话号码
        person: this.form3.person, // 联系人
        address: this.form3.address, // 地址
        infPkDatJwss: data, // 装箱资料
      };
      await SalCargoSave2(SalCargo)
        .then((r) => {
          // this.reqboxMethod(this.curData);
          this.$message.success('发车成功');
          if (this.loadingInstance) {
            this.loadingInstance.close();
          }
          this.dialogVisible3 = false;
          this.form3 = {};
          query2api({
            itemcode: this.form2.itemcode,
          }).then((respose) => {
            console.log('respose!!!', respose.data);
            this.data2 = respose.data;
            this.tableLoading2 = false;
          });
        })
        .catch(() => {
          this.tableLoading2 = false;
          this.$message.warning('发车失败!');
          this.loadingInstance.close();
        });
    },
    edit2 (row) {
      if (row.status === '已送出') {
        return this.$message.warning('已发车数据无法修改!');
      }
      this.isEdit = true;
      this.requestMethod(row);
      this.topFormOp.column[1].disabled = false;
      this.dialogVisible2 = true;
    },
    /**
     * @description: 修改明细资料
     */
    // 新增详细页的方法
    handleDetailAdd () {
      // 首先需要清空详情页的数据
      // 清空详情页的数据

      this.saveFromData = {
        itemcode: this.form2.itemcode || '',
        dest_brief: 'GD-101',
        is_en: 'N',
        sal_po_fk: this.form2.itemcode,
      };
      this.dtl1Data = [];
      this.dtl1Data2 = [];
      this.selectList = {};
      this.dialogVisible2 = true;
      this.topFormOp.column[1].disabled = false;
      let data = {
        $cellEdit: true,
        matching: this.dtl1Data.length + 1, // 匹配值
        childrenList: [], // 存放子数据
        pkType: '', // 箱类型
        pkBarcode: '',
        cartonPkqty: 0,
        netWeight: 0,
        grossWeight: 0,
        cubaNum: 0,
        infPkDatDtlaoid: v1(),
      };
      // 处理shipDates
      this.shipDates = this.data2
        .map((item) => item.ship_date)
        .filter((item) => item !== this.saveFromData.ship_date);
      console.log('shipDates', this.shipDates);
      this.dtl1Data.push(data);
      // 高亮
      // 对应行数据
      this.selectList = { ...data };
      this.handleClick3(this.selectList);
    },
    requestMethod (row) {
      this.saveFromData = row;
      this.saveFromData.is_en = this.saveFromData.is_en || 'N';
      console.log('edit2row!!!', this.saveFromData);

      // 修改页面
      if (this.saveFromData.inf_PK_DATOID) {
        // 在这里获取到所有的外面的ship_date
        this.shipDates = this.data2
          .map((item) => item.ship_date)
          .filter((item) => item !== this.saveFromData.ship_date);
        // 请求装箱表
        getinfpkdatdtlajws({ dtlaFk: this.saveFromData.inf_PK_DATOID }).then(
          (respose) => {
            // return;
            this.dtl1Data = respose.data.map((item) => {
              item.$cellEdit = true;
              item.childrenList.forEach((citem) => (citem.$cellEdit = true));
              return item;
            });

            this.$refs.mainCurd1.setCurrentRow(this.dtl1Data[0]); // 高亮
            this.selectList2 = this.dtl1Data[0]; // 对应行数据
            console.log('此时的dtl1Data', this.dtl1Data);
            console.log('此时的selectList2', this.selectList2);
            this.handleClick3(this.selectList2);
          }
        );
      }
    },
    handleClick3 (row) {
      this.dtl1Data2 = [];
      this.selectList = row;
      console.log('点击细表具体行 selectlist1', this.selectList);

      this.dtl1Data2 = row.childrenList;
    },
    /**
     * @description: 右边细表的细表的点击行事件
     */
    handleClick4 (row) {
      this.selectList2 = row;
      console.log('点击细表的children具体行', row);
      // console.log('细表的ref', this.$refs.dtl2Crud)
    },
    handleClose1 () {
      this.dialogVisible = false;
    },
    handleClose2 () {
      this.selectList = [];
      this.dialogVisible2 = false;
    },
    handleSubmit () {
      this.dtl1Data.forEach((item) => {
        let pkQty2 = 0;
        item.childrenList.forEach((item2) => {
          // 遍历表2
          pkQty2 += Number(item2.pkQty);
        });
        item.cartonPkqty = pkQty2;
      });
      // 合计
      let pkqty = 0; // 总数量
      this.dtl1Data.forEach((fitem) => {
        if (fitem.cartonPkqty === '') {
          fitem.cartonPkqty = 0;
        }
        if (fitem.startPkno && fitem.endPkno) {
          fitem.cartonNum =
            parseInt(fitem.endPkno) - parseInt(fitem.startPkno) + 1;
        } else {
          fitem.cartonNum = 0;
        }
        pkqty = pkqty + parseInt(fitem.cartonPkqty) * parseInt(fitem.cartonNum);
      });
      // console.log('pkqty', pkqty);
      this.saveFromData.ttlship_qty = pkqty;

      let sum = 0;
      this.dtl1Data.forEach((item) => {
        sum += item.cartonNum;
      });
      // 总箱数
      this.saveFromData.ttl_carton = sum;

      // 修改or保存
      console.log('保存前的数据1 this.saveFromData', this.saveFromData);
      console.log('保存前的数据2 this.dtl1Data', this.dtl1Data);
      // 修改保存前校验
      const validationErrors = this.handleValidateBox();
      if (validationErrors.length > 0) {
        this.$message.error(validationErrors.join(' '));
        return;
      }
      // 检验如果时间为空则默认为当前时间
      if (!this.saveFromData.ship_date) {
        // 将时间转换成字符串格式为 2024-01-01这样
        this.saveFromData.ship_date = new Date().toISOString().split('T')[0];
      }

      // 需要检查一个款里的所有时间，不能有重复的，所有的装箱概览信息在this.data2中 而且要排除自己
      console.log('shipDates', this.shipDates);
      if (this.shipDates.includes(this.saveFromData.ship_date)) {
        this.$message.error('该款号已存在相同的走货日期');
        return;
      }
      if (this.saveFromData.inf_PK_DATOID) {
        // 保存主表
        let oid = '';
        this.loadingInstance = ElLoading.service({ text: '保存中...' });
        infpkdatjwsPre(this.saveFromData)
          .then((res) => {
            oid = this.saveFromData.inf_PK_DATOID;
            // oid赋值表1
            this.dtl1Data.forEach((item) => {
              item.infPkDatFk = oid;
            });
            if (this.dtl1Data.length > 0) {
              // 保存表1
              infpkdatdtlajwsPre(this.dtl1Data)
                .then((res) => {
                  // this.$dlg.showSuccess('保存成功！');
                  this.loadingInstance.close();
                  ElMessage.success('保存成功');
                  // 刷新数据
                  this.edit(this.form2);
                  this.query();
                })
                .catch(() => {
                  this.loadingInstance.close();
                  ElMessage.error('保存表1失败');
                });
            } else {
              this.loadingInstance.close();
              ElMessage.success('保存成功');
              // 刷新数据
              this.edit(this.form2);
              this.query();
            }
          })
          .catch(() => {
            this.loadingInstance.close();
            ElMessage.error('保存主表失败');
          });
      } else {
        this.loadingInstance = ElLoading.service({ text: '保存中...' });
        infpkdatjwsPre(this.saveFromData)
          .then((res) => {
            let oid = res.data;
            this.dtl1Data.forEach((item) => {
              item.infPkDatFk = oid;
            });
            if (this.dtl1Data.length > 0) {
              infpkdatdtlajwsPre(this.dtl1Data)
                .then((res) => {
                  this.loadingInstance.close();
                  ElMessage.success('保存成功');
                  this.edit(this.form2);
                  this.query();
                })
                .catch(() => {
                  this.loadingInstance.close();
                  ElMessage.error('保存表1失败');
                });
            } else {
              this.loadingInstance.close();
              ElMessage.success('保存成功');
              this.edit(this.form2);
              this.query();
            }
          })
          .catch(() => {
            this.loadingInstance.close();
            ElMessage.error('保存主表失败');
          });
      }
    },
    // 装箱新增
    handleAdd () {
      this.selectList = {};
      // 遍历查找 dtl1Data.endPkno 中最大的数，并加1赋值给pknoNum
      let pknoNum = 1;
      if (this.dtl1Data.length !== 0) {
        pknoNum =
          Math.max.apply(
            Math,
            this.dtl1Data.map((item) => {
              return item['endPkno'];
            })
          ) + 1;
      }
      // console.log('此时主表的数据', this.saveFromData);
      let data = {
        $cellEdit: true,
        matching: this.dtl1Data.length + 1, // 匹配值
        childrenList: [], // 存放子数据
        startPkno: pknoNum, // 开始箱数
        endPkno: pknoNum, // 结束箱数
        pkType: 'A', // 箱类型
        pkBarcode: '',
        infPkDatDtlaoid: v1(),
        cartonPkqty: 0,
        netWeight: 0,
        grossWeight: 0,
        cubaNum: 0,
      };
      this.dtl1Data.push(data);
      // 高亮
      this.$refs.mainCurd1.setCurrentRow(
        this.dtl1Data[this.dtl1Data.length - 1]
      );
      // 对应行数据
      this.selectList = this.dtl1Data[this.dtl1Data.length - 1];
      //  选中对应行数据
      this.handleClick3(this.dtl1Data[this.dtl1Data.length - 1]);
    },
    /**
     * @description: 细表选择选中项
     */
    selectMethod (row) {
      // console.log('selectMethod', row);
      this.selectList = row;
      this.selectRows = row;
    },
    /**
     * @description: 细表的细表选择选中项
     */
    selectMethod2 (row) {
      // console.log('selectMethod2', row);
      this.selectList2 = row;
      this.selectRows2 = row;
    },
    /**
     * @description: 细表删除，就是详细页里面左边的表
     */
    handleDelete () {
      // console.log('selectRows', this.selectRows);
      if (!this.selectRows || this.selectRows.length === 0) {
        return this.$message.warning('请先选择要删除的行');
      }
      this.$confirm('确定要删除选中的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const selectKeys = this.selectRows.map((row) => row.infPkDatDtlaoid);
          // console.log('selectKeys', selectKeys);
          this.dtl1Data = this.dtl1Data.filter(
            (item) => !selectKeys.includes(item.infPkDatDtlaoid)
          );
          // 同时删除表2
          console.log('this.dtl1Data2', this.dtl1Data2);
          this.dtl1Data2 = [];
          this.$message.success('删除成功');
          this.selectRows = [];
        })
        .catch(() => {
          // 取消操作
        });
    },
    /**
     * @description:装箱细表新增 需要附加细表的oid
     * */
    handleAddDetail () {
      console.log('this.selectList2', this.selectList2);
      console.log('this.selectList', this.selectList);
      let data = {
        $cellEdit: true,
        colorNo: '', // 颜色
        asssize: '', // 尺码
        assinseam: '', // 内长
        pkQty: 0, // 每箱数量
        infPkDatDtlaFk: this.selectList.infPkDatDtlaoid,
        infPkDatDtlaDtloid: v1(),
      };
      this.dtl1Data2.push(data);
    },
    /**
     * @description: 细表删除，就是详细页里面右边的表
     */
    handleDeleteDetail () {
      // console.log('selectRows2', this.selectRows2);
      if (!this.selectRows2 || Object.keys(this.selectRows2).length === 0) {
        return this.$message.warning('请先选择要删除的行');
      }
      this.$confirm('确定要删除选中的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const selectKeys = this.selectRows2.map(
          (row) => row.infPkDatDtlaDtloid
        );
        // console.log('selectKeys', selectKeys);
        this.dtl1Data2 = this.dtl1Data2.filter(
          (item) => !selectKeys.includes(item.infPkDatDtlaDtloid)
        );
        // 同时根据fk去删除ditl1Data里面的childrenList的具体数据
        this.dtl1Data.forEach((item) => {
          item.childrenList = item.childrenList.filter(
            (item2) => !selectKeys.includes(item2.infPkDatDtlaDtloid)
          );
        });
        // 同时要减去对应的装箱数
        const totalPkQty = this.dtl1Data2.reduce((sum, item) => {
          return sum + Number(item.pkQty);
        }, 0);
        this.selectList.cartonPkqty = totalPkQty;
        this.$message.success('删除成功');
      });
    },
    /**
     * @description: 处理细表的细表中装箱数量pkqty的变化
     */
    handlePkQtyChange (row, column) {
      // 每次在细表的细表中的数量变化，在细表中的对应的装箱数数量cartonPkqty也要变化
      // console.log('row', row);

      const totalPkQty = this.dtl1Data2.reduce((sum, item) => {
        return sum + Number(item.pkQty);
      }, 0);
      // 细表中的装箱数
      const parent = this.dtl1Data.find(
        (item) => item.infPkDatDtlaoid === row.infPkDatDtlaFk
      );
      // console.log('totalPkQty', totalPkQty);
      // console.log('parent', parent);
      parent.cartonPkqty = totalPkQty;
    },
    /**
     * @description: 处理提交中关于箱号的校验
     */
    handleValidateBox () {
      const errors = [];
      // 对数据按 startPkno 进行排序
      const sortedData = this.dtl1Data
        .slice()
        .sort((a, b) => a.startPkno - b.startPkno);
      let previousEnd = 0;
      //
      sortedData.forEach((row, index) => {
        const { startPkno, endPkno } = row;
        // 检查开始箱号是否小于等于结束箱号
        if (startPkno > endPkno) {
          errors.push(
            `第${
              index + 1
            }行：开始箱号 (${startPkno}) 不能大于结束箱号 (${endPkno})。`
          );
        }
        // 检查开始箱号是否大于前一行的结束箱号
        if (startPkno <= previousEnd) {
          errors.push(
            `第${
              index + 1
            }行：开始箱号 (${startPkno}) 必须大于前一行的结束箱号 (${previousEnd})。`
          );
        }
        previousEnd = endPkno;
      });

      // 检查是否有重叠
      for (let i = 0; i < sortedData.length; i++) {
        for (let j = i + 1; j < sortedData.length; j++) {
          const a = sortedData[i];
          const b = sortedData[j];
          if (a.startPkno <= b.endPkno && b.startPkno <= a.endPkno) {
            errors.push(`第${i + 1}行和第${j + 1}行存在箱号重叠。`);
          }
        }
      }

      return errors;
    },
    /**
     * 导出
     */
    async dataExport () {
      // if (Object.keys(this.selectList).length === 0) {
      //   this.$message.warning("导出前请选择要导出的数据");
      //   return;
      // }
      // this.$dlg.Loading('数据导出中...');

      this.loadingInstance = ElLoading.service({ text: '数据导出中...' });
      let params = {};
      // console.log(this.form);
      let itemcodelist = this.form.itemcode.split(/[,\n ]/);
      let selection = [];
      // 如果表格就没有数据，直接不给导出并提示
      if (this.data.length === 0) {
        this.loadingInstance.close();
        return this.$message.warning('没有数据可以导出');
      }
      // 如果没有勾选数据，默认导出所有表格的 itemcode
      if (this.mainSelectList.length === 0) {
        selection = this.data.map((item) => item.itemcode.trim());
      } else {
        selection = this.mainSelectList.map((item) => item.itemcode.trim());
      }
      if (itemcodelist.length > 1) {
        params = {
          selection: selection,
          itemcode: this.form.itemcode,
          itemcodelist: itemcodelist,
        };
      } else {
        params = {
          selection: selection,
          itemcode: this.form.itemcode,
        };
      }
      console.log('params', params);
      await dataExport(params)
        .then(async (res) => {
          if (res.data.code === 0) {
            let base64 = res.data.result.base64;
            // 调用导出
            excel.excelExport(res.data.result.fileName, base64, '.xlsx');
            // this.$dlg.showSuccess('导出成功！');
            this.loadingInstance.service.success('导出成功');
            this.loadingInstance.close();
          }
        })
        .catch(() => {
          // this.loadingInstance.close();
          this.loadingInstance.close();
          this.loadingInstance.service.error('导出失败');
          // this.$dlg.showError('导出错误');
        });
      if (this.loadingInstance) {
        this.loadingInstance.close();
      }
      // this.loadingInstance.close();
    },
    async dataExport2 () {
      this.loadingInstance = ElLoading.service({ text: '数据导出中...' });
      let params = {
        created: this.form.created,
        suppliercode: this.form.suppliercode,
      };

      await dataExport2(params)
        .then(async (res) => {
          let base64 = res.data;
          const name = res.name;
          // 调用导出
          excel.excelExport(name, base64, '.xlsx');
          // this.$dlg.showSuccess('导出成功！');
          this.loadingInstance.service.success('导出成功');
          this.loadingInstance.close();
        })
        .catch(() => {
          // this.loadingInstance.close();
          this.loadingInstance.close();
          this.loadingInstance.service.error('导出失败');
          // this.$dlg.showError('导出错误');
        });
      if (this.loadingInstance) {
        this.loadingInstance.close();
      }
    },
    // 页码改变事件
    handleCurrentChange (current) {
      this.page.currentPage = current;
      this.data = this.paging(this.page.pageSize, current);
      setTimeout(() => {
        this.setSelection();
      }, 5);
    },
    // 本地分页的方法
    paging (size, current) {
      // console.log('测试');
      // console.log(this.tableAllData);
      const tableList = JSON.parse(JSON.stringify(this.tableAllData));
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
    // 赋值选择项
    setSelection () {
      if (!this.radio) {
        for (let row of this.data) {
          console.log(this.rowKey);
          let el = this.mainSelectList.find(
            (itm) => row[this.rowKey] === itm[this.rowKey]
          );
          if (el) {
            this.$refs.crud.toggleRowSelection(row, true);
          }
        }
      }
    },
    handleSizeChange (size) {
      this.page.pageSize = size;
      this.data = this.paging(size, this.page.currentPage);
      setTimeout(() => {
        this.setSelection();
      }, 5);
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
        console.log('jin');
        for (let row of this.data) {
          let itm = this.mainSelectList.findIndex(
            (el) => el[this.rowKey] === row[this.rowKey]
          );
          if (itm > -1) {
            this.mainSelectList.splice(itm, 1);
          }
        }
      }
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

    clearSelect () {
      this.$refs.crud.setCurrentRow();
      this.$refs.crud.clearSelection();
      this.mainSelectList = [];
    },
    checkAllSelect () {
      this.$refs.crud.clearSelection();
      this.mainSelectList = JSON.parse(JSON.stringify(this.tableAllData));
      this.setSelection();
    },
    async dataExport3 () {
      if (this.data2.length === 0) {
        return this.$message.warning('请新增数据!');
      }
      if (this.selectList.length === 0) {
        return this.$message.warning('请选择数据!');
      }
      let data = this.selectList.filter((ele) => ele.status === '已送出');
      if (data.length === 0) {
        return this.$message.warning('选择项全部未发车!');
      }
      console.log('dataExport3 -> data', data);
      let cargooids = this.selectList
        .filter((item) => item.sal_CARGOOID)
        .map((item) => {
          return item.sal_CARGOOID;
        });
      console.log('dataExport3 -> cargooids', cargooids);
      cargooids = Array.from(new Set(cargooids));
      if (cargooids.length > 1) {
        return this.$message.warning('只能选择一个发车编号!');
      }
      let params = {
        SAL_CARGOOID: cargooids[0],
      };
      console.log('dataExport3 -> params', params);
      // this.$dlg.Loading('数据导出中...');
      this.loadingInstance = ElLoading.service({ text: '数据导出中...' });
      dataExport3(params)
        .then(async (res) => {
          if (res.data.code === 0) {
            let base64 = res.data.result.base64;
            // 调用导出
            excel.excelExport(res.data.result.fileName, base64, '.xlsx');
          }
          this.loadingInstance.close();
        })
        .catch(() => {
          this.loadingInstance.close();
          // this.$dlg.showError('导出错误');
          this.loadingInstance = ElLoading.error({ text: '导出错误' });
        });
    },
    editCargoInfo (row) {
      console.log(row);
      if (!row.cargo_no) {
        return this.$message.warning('未发车,无法查看');
      }
      findCaogoByNo({ cargoNo: row.cargo_no }).then((res) => {
        console.log('find', res);
        this.form4 = res.data;
        if (this.form4.prnFlag) {
          this.form4.prnFlag = '是';
        } else {
          this.form4.prnFlag = '否';
        }
        this.dialogVisible4 = true;
      });
    },
    edit3 () {
      if (!this.form4.tel || !this.form4.person || !this.form4.address) {
        return this.$message.warning('请补充完整信息!');
      }
      if (!isNaN(this.form4.tel) === false || this.form4.tel.length !== 11) {
        return this.$message.warning('手机电话必须为数字和11位数字');
      }
      // this.$dlg.Loading('保存中...');
      this.loadingInstance = ElLoading.service({ text: '保存中...' });
      console.log('this.form4', this.form4);
      editCaogo({ Cargo: this.form4 })
        .then((res) => {
          this.$message.success('保存成功');
          this.loadingInstance.close();
        })
        .catch(() => {
          this.$message.success('保存失败');
          this.loadingInstance.close();
        });
    },
  },
};
</script>

<style scoped lang="scss">
// @import '@/styles/variables.module.scss'; // 导入 SCSS 变量文件

.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // 处理一下装箱表的主要功能部分，之前没有放在一个容器里面，非常混乱
  .second-main-container {
    width: 95%;
    background: $neutral-color-1;
    display: flex;
    flex-direction: column;
    margin: $container-margin;
    padding: $container-base-padding-2;
    border-radius: $border-radius-medium;
    :deep(.el-form .el-form-item) {
      margin-bottom: 8px;
    }
    box-shadow: $shadow-1;
  }
}
.popover-select {
  /* height: 400px; */
  overflow: auto;
}
.el-table-disabled-row {
  color: rgba(155, 176, 221, 0.884);
  pointer-events: none;
}
.tableselectcrud > .avue-crud__pagination > .el-pagination {
  position: inherit !important;
}

.btn-list {
  width: 95%;
  display: flex;
  align-items: center;
  padding: 12px $container-base-padding-2;
  background-color: rgba($neutral-color-1, 0.5);
  border-radius: $border-radius-medium;
  backdrop-filter: $backdrop-filter-base;
  box-shadow: $shadow-2;
  margin-top: $container-margin;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
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
@media screen and (max-height: 900px) {
  .table-select-header {
    font-size: 12px;
  }
}
/* 修改element在火狐的默认margin数据 */
.el-table-filter__wrap.el-scrollbar__wrap {
  margin-bottom: -7px !important;
  margin-right: -7px !important;
}
</style>
