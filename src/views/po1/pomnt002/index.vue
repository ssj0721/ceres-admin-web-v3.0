<template>
    <basic-container class="container">
    <div class="pic" v-if="permission">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm006</div>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="抽取审款生成采购单" />
        <el-step class="step" title="联营商新增采购单" />
        <el-step class="step" title="供货商确认采购单" />
        <el-step class="step" title="联营商下采购单" />
        <el-step class="step" title="聚水潭采购流程" />
        <el-step class="step" title="采购完成" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <div class="pic" v-else>
      <el-steps class="steps" finish-status="success" active="0">
        <el-step class="step" title="真维斯审款通过" />
        <el-step class="step" title="选款网站选款" />
        <el-step class="step" title="大投生成采购单" />
        <el-step class="step" title="供货商确认采购单" />
        <el-step class="step" title="大投下采购单" />
      </el-steps>
      <el-button type="text" @click="imgstate=true">查看完整流程图</el-button>
    </div>
    <el-dialog v-model="imgstate"  title="流程图" style="width: 850px; height: 700px; text-align: center;">
      <img style="width: 800px; height: 550px;" width="100%" :src="permission ? shoppingpic : DTshoppingpic" alt >
    </el-dialog>
    <div class="pending">
    <mybottons>
    <div>
        <el-button type="primary" @click="query()">{{ $t(`Action.Query`) }}</el-button>
        <el-button type="primary" :disabled="btn_add" @click="handleAdd()">新增</el-button>
        <el-button type="primary" :disabled="btn_dataImport"
            @click="dataImport()">导入R835生成追单</el-button>
        <!-- <el-button type="primary" :disabled="btn_edit" @click="handRowUpdate(1, 0)">保存</el-button>
        <el-button type="primary" :disabled="btn_confirm" @click="confirm(1, 0)">审核</el-button> -->
        <!-- <el-button type="primary" :disabled="!btn_confirm2"
            @click="confirm(2, 1)">供货商确认</el-button> -->
        <!-- <el-button type="primary" :disabled="btn_confirm3"
            @click="confirm(3, 2)">确认下单</el-button>
        <el-button type="primary" :disabled="btn_confirm4"
            @click="confirm(4, 4)">作废</el-button> -->
        <el-button type="primary" :disabled="bnt_dataExport"
            @click="dataExport()">导出</el-button>
        <!-- <el-button type="primary" @click="handRetrieval()">取回</el-button> -->
    </div>
    </mybottons>

    <div class="second-main-container">
        <avue-form :option="formOption" v-model="form">
        </avue-form>

    <div class="midcontainer">
      <div class="color-description">
        <i class="el-icon-star-on"></i>
        <span>聚水潭供应商和商品编码状态</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #32CD32;"
        ></div>
        <span>均有效</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: orange;"
        ></div>
        <span>仅聚水潭供应商有效</span>
      </div>

      <div class="color-description">
        <div
          class="color-box"
          style="background-color: #dd6e6e;"
        ></div>
        <span>均无效</span>
      </div>
    </div>

        <avue-crud v-model="table" ref="crud" :table-loading="tableLoading" :option="tableOption" :data="crudTableData"
            :page="page" @cell-click="showimage" @row-save="rowsave" @row-update="handRowUpdate"
            @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange" @row-dblclick="rowclick" v-horizontal-scroll="'always'">

            <!-- <template #menu="{ row, size, index}">
                <el-button @click="oneshenhe(index, 1)" v-if="row.orderstatus == 0"
                    :disabled="btn_confirm" :size="size" text type="primary">审核</el-button>

                <el-button @click="one_confirm(index, 2, 1)" v-if="row.orderstatus == 1"
                    :disabled="btn_confirm2" :size="size" text type="primary">确认</el-button>

                <el-button @click="handRowUpdate(index, 1)" :disabled="btn_edit" :size="size" text
                    type="primary">保存</el-button>
                <el-button @click="handRetrieval(row)" v-if="row.orderstatus == 4"  :size="size"
                    text type="primary">取回</el-button>
            </template> -->
        </avue-crud>
    </div>
        <el-dialog :title="'导入'" v-model="importDialogVisible"  @close="importBeforeClose"
            @open="importBeforeOpen" width="40%">
            <br>
            <Upload drag ref='importUpload' multiple :action="uploadUrl" :limit="1" :maxSize="20"
              :accept="'.xls,.xlsx'" :on-remove="importHandleDelete" :file-list="importFileList" 
              :fileList="importFileList" @getfileId="getfileId"
              @delfileId="delfileId">
            </Upload>
            <br>
            <!-- <span slot="footer" class="dialog-footer"> -->
                <!-- <el-button type="primary" @click="dowmloadTemplate()">{{
              $t(`Action.DownloadTemplate`)
            }}</el-button> -->
            <el-button type="primary" @click="importSubmit">确定导入</el-button>
            <el-button @click="importCancel">取 消</el-button>
            <!-- </span> -->
        </el-dialog>

    </div>
    </basic-container>

    <el-dialog v-model="guigeVisible" title="操作" :close-on-click-modal="false" :fullscreen="true" center
        width="1000px" @close="closeGuige">
        <!-- <GuiGe :itemno="itemno"></GuiGe> -->
        <!-- <el-button type="primary" @click="makesure">确认勾选数据</el-button> -->
        <el-button type="primary" @click="query2">刷新</el-button>
        <el-button type="primary" :disabled="btn_edit" @click="handRowUpdate(1, 0)">保存</el-button>
        <el-button type="primary" :disabled="btn_confirm" @click="confirm(1, 0)">审核</el-button>
        <el-button type="primary" :disabled="btn_confirm3" @click="confirm(3, 2)">确认下单</el-button>
        <el-button type="primary" :disabled="btn_confirm4" @click="confirm(4, 4)">作废</el-button>
        <el-button type="primary" @click="handRetrieval()">取回</el-button>
        <avue-crud v-model="table2" ref="crud2" :table-loading="tableLoading2" :option="tableOption2" :data="crudTableData2"
            :page="page2" @cell-click="showimage" @row-save="rowsave" @row-update="handRowUpdate"
            @current-change="currentChange2" @size-change="sizeChange2" @selection-change="selectionChange2">

            <template #menu="{ row, size, index}">
                <el-button @click="oneshenhe(index, 1)" v-if="row.orderstatus == 0"
                    :disabled="btn_confirm" :size="size" text type="primary">审核</el-button>

                <el-button @click="one_confirm(index, 2, 1)" v-if="row.orderstatus == 1"
                    :disabled="btn_confirm2" :size="size" text type="primary">确认</el-button>

                <el-button @click="handRowUpdate(index, 1)" v-if="row.orderstatus == 0" :disabled="btn_edit" :size="size" text
                    type="primary">保存</el-button>

                <el-button @click="handRetrieval(row)" v-if="row.orderstatus == 4"  :size="size"
                    text type="primary">取回</el-button>
            </template>
        </avue-crud>
    </el-dialog>
</template>
  
<script setup>
import { uploadUrl } from '@/utils/request'
import { 
    queryData,
    queryRole,
    retrieval,
    querySupplierList,
    queryVendorList,
    getVendor,
    add,
    downShopGoods,
    importData,
    exportData,
    RowUpdate,
    handConfirm
 } from "@/views/po1/pomnt002/index";
 import {
  findPermission
} from '@/api/commodity';
import store from "@/store/";
import Upload from '@/components/Upload/index.vue'
import { h, computed, defineComponent, reactive, ref, shallowRef, toRefs, watch, onMounted, getCurrentInstance } from 'vue';
import { mapGetters } from "vuex";
import {excel} from '@/utils/excelExport'
import shoppingpic from '@/assets/images/shopping.jpg'
import DTshoppingpic from '@/assets/images/DTshopping.jpg'
import { ElLoading,ElMessage } from 'element-plus'

const permission = ref(true)  // 区分是供应连true还是智慧供销false

//点击行的productId
const productId = ref(0)
const guigeVisible = ref(false)

let imgstate = ref(false)

const instance = getCurrentInstance(); // 获取当前组件实例
const dateutil = instance.appContext.config.globalProperties.$dateutil;  // 访问全局属性

let tableSelectList = ref([])
let activeNames = ref({})
let loginsup = ref("")
let loginven1 = ref("")
let usertype1 = ref("")
let formOption = ref({
                column: [
                    {
                        prop: "suppliercode",
                        label: "联营商",
                        labelWidth: 130,
                        props: {
                            api: "/po1mnt001/querySupplierList",
                            checkall: true,
                            params: {
                                // type: "",
                                // userid: store.state.user.userInfo.code,
                            },
                        },
                        component: "DroplistControl",
                        span: 8,
                    },

                    {
                        prop: "goodscode",
                        label: "商品编码(外部码)",
                        labelWidth: 130,
                        span: 8
                    },

                    {
                        prop: "itemno",
                        label: "款式",
                        labelWidth: 130,
                        span: 8
                    },

                    {
                        label: "销售截止日期",
                        labelWidth: 130,
                        prop: "salesdeadlinedate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            //fromDate: this.$dateutil.curdatenear(-180),
                            //toDate: this.$dateutil.curdate(),
                            //type: "daterange",
                            clearable: true,
                        },
                    },

                    {
                        prop: "orderstatus",
                        label: "状态",
                        labelWidth: 130,
                        props: {
                            api: "/po1mnt001/querySysDictData",
                            checkall: true,
                            params: {
                                type: "biz.po1.purpostate",
                            },
                        },

                        component: "DroplistControl",
                        span: 8
                    },

                    {
                        prop: "vendorcode",
                        label: "供货商",
                        labelWidth: 130,
                        props: {
                            api: "/po1mnt002/queryVendorList",
                            checkall: true,
                            watch: true,
                            params: {
                                type: "0",
                                supplierlist: "",
                                // userid: store.state.user.userInfo.code,
                            },

                        },
                        component: "DroplistControl",
                        span: 8,
                    },


                    {
                        label: "要求到仓日期",
                        labelWidth: 130,
                        prop: "yaoqiudaocangdate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            //fromDate: this.$dateutil.curdatenear(-180),
                            //toDate: this.$dateutil.curdate(),
                            //type: "datetimerange",
                            clearable: true,
                        },
                    },

                    {
                        label: "完成日期",
                        labelWidth: 130,
                        prop: "finishdate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            //fromDate: this.$dateutil.curdatenear(-180),
                            //toDate: this.$dateutil.curdate(),
                            //type: "datetimerange",
                            clearable: true,
                        },
                    },

                    {
                        label: "审核日期",
                        labelWidth: 130,
                        prop: "audidate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            //fromDate: this.$dateutil.curdatenear(-180),
                            //toDate: this.$dateutil.curdate(),
                            //type: "datetimerange",
                            clearable: true,
                        },
                    },

                    {
                        label: "确认日期",
                        labelWidth: 130,
                        prop: "vendorconfirmdate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            //fromDate: this.$dateutil.curdatenear(-180),
                            //toDate: this.$dateutil.curdate(),
                            //type: "datetimerange",
                            clearable: true,
                        },
                    },

                    {
                        label: "最后修改日期",
                        labelWidth: 130,
                        prop: "lastmodidate",
                        span: 8,
                        component: "datePicker",
                        props: {
                            fromDate: dateutil.curdatenear(-180),
                            toDate: dateutil.curdate(),
                            //type: "datetimerange",
                            clearable: true,
                        },
                    },
                    {
                        prop: "buhuojianyi",
                        label: "补货建议",
                        labelWidth: 130,
                        // type: "select",
                        props: {
                            api: "/po1mnt001/querySysDictData",
                            checkall: true,
                            params: {
                                type: "biz.po1.buhuojianyi",
                            },
                        },
                        component: "DroplistControl",
                        span: 8
                    },
                    {
                        prop: "yaoqiudaocangqtyremark",
                        label: "按21天可销售推断库存缺口",
                        labelWidth: 230,
                        // type: "select",
                        props: {
                            api: "/po1mnt001/querySysDictData",
                            checkall: true,
                            params: {
                                type: "biz.po1.kucunquekou",
                            },
                        },
                        component: "DroplistControl",
                        span: 8
                    },
                    {
                        label: "要求到仓数量不为0",
                        prop: "allowpowergene",
                        labelWidth: 200,
                        span: 12,
                        type: "switch",
                        dicData: [{
                            label: '否',
                            value: "0"
                        },
                        {
                            label: '是',
                            value: '1'
                        }],
                        disabled: false,
                        valueDefault: '0',
                    },
                ],
                emptyBtn: false,
                submitBtn: false
            })
let form = ref({
    suppliercode:[],
    goodscode:"",
    itemno:"",
    salesdeadlinedate:[],
    orderstatus:[],
    vendorcode:[],
    yaoqiudaocangdate:[],
    finishdate:[],
    audidate:[],
    vendorconfirmdate:[],
    lastmodidate:[],
    allowpowergene:"",
    buhuojianyi:[],
    yaoqiudaocangqtyremark:"",
})
let table = ref({})
let tableOption = ref({
                selection: true,
                delBtn: false,
                menuWidth: 150,
                height: 300,
                addBtn: false,
                editBtn: false,
                cancelBtn: false,
                cellBtn: false /* 行内编辑 */,
                columnBtn: false /* 行显隐按钮 */,
                refreshBtn: false /* 表格刷新按钮 */,
                menu: false,
                keyId: "id",
                column: [

                    {
                        label: '图',
                        prop: 'pictureaddr',
                        width: "80",
                        type: 'upload',
                        listType: 'picture-img',
                        //propsHttp: {
                        //home:'https://avuejs.com',
                        // },
                        viewDisplay: false,
                        editDisplay: false,
                        addDisplay: false,
                        span: 12
                    },


                    {
                        prop: 'orderstatusname',
                        label: '状态',
                        width: '80',
                        addDisplay: false,
                        span: 8,
                        // formatter: (row, column, cellValue /*, index, ...otherArgs*/) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        //   // 返回带有样式的 HTML 字符串
                        //   return `<div style="background-color: ${color}; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${cellValue}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.orderstatusname || 'orderstatusname');
                        },
                        hide: true,
                    },

                    {
                        prop: "isUpload",
                        label: "上传聚水潭",
                        width: "80",
                        addDisplay: false,
                        span: 8,
                        hide: true,
                    },

                    {
                        prop: "poid",
                        label: "聚水潭采购单号",
                        width: "80",
                        addDisplay: false,
                        span: 8,
                        hide: true,
                    },

                    {
                        prop: "orderno",
                        label: "追单编号",
                        width: "100",
                        span: 8,
                        addDisplay: false,
                        hide: true,
                    },
                    {
                        prop: "jstSupplierId",
                        label: "聚水潭供应商编号",
                        width: "140",
                        span: 6,
                        addDisplay: false,
                        // formatter: (row) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        // //   const icon = row.istestitem === 1 && row.state === 3 ? 'el-icon-star-on' : null;
                        //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${row.jstsupplierid?row.jstsupplierid:""}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.jstSupplierId || '无');
                        },
                        overHidden: true,
                        hide: true,
                    },
                    {
                        prop: "jstGoodsCode",
                        label: "聚水潭商品编码(skuId)",
                        width: "180",
                        span: 6,
                        addDisplay: false,
                        // formatter: (row) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        // //   const icon = row.istestitem === 1 && row.state === 3 ? 'el-icon-star-on' : null;
                        //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${row.jstgoodscode?row.jstgoodscode:""}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.jstGoodsCode || '无');
                        },
                        overHidden: true,
                        hide: true,
                    },

                    {
                        prop: "goodscode",
                        label: "商品编码(外部码)",
                        width: "180",
                        labelWidth: 130,
                        span: 8,
                        addDisplay: true,
                        overHidden: true,
                        hide: true,
                    },
                    {
                        prop: "goodsname",
                        label: "商品名称",
                        width: "100",
                        span: 5,
                        addDisplay: false,
                        overHidden: true,
                    },

                    {
                        prop: "yaoqiudaocangdate",
                        label: "要求到仓日期",
                        labelWidth: "140",
                        width: "150",
                        span: 8,
                        overHidden: true,
                        // component: "date",
                        format: "YYYY-MM-DD",
                        valueFormat: "YYYY-MM-DD",
                        type: "date",
                        value: dateutil.curdate(),
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            // message: "",
                          },
                        ],
                        addDisplay: false,
                        hide: true,
                    },
                    {
                        prop: "yaoqiudaocangqty",
                        label: "要求到仓数量",
                        width: "100",
                        addDisplay: false,
                        span: 5,
                        hide: true,
                    },

                    {
                        prop: "price",
                        label: "采购单单价",
                        width: "100",
                        labelWidth: "140",
                        span: 8,
                        addDisplay: false,
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            message: "采购单单价不能为空",
                          },
                        ],
                        hide: true,
                    },
                
                    {
                        prop: "sumprice",
                        label: "总金额",
                        width: "100",
                        labelWidth: "140",
                        span: 8,
                        // editDisabled: true,
                        editDisplay: false,
                        addDisplay: false,
                        render: ({ row }) => {
                            return h('p',
                                {
                                }, row.price * row.yaoqiudaocangqty);
                        },
                        hide: true,
                    },

                    {
                        prop: "vendordaocangdate",
                        label: "供货商确认到仓日期",
                        width: "150",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        overHidden: true,
                        addDisplay: false,
                        component: "date",
                        hide: true,
                    },
                    {
                        prop: "vendordaocangqty",
                        label: "供货商确认到仓数量",
                        width: "100",
                        addDisplay: false,
                        span: 5,
                        hide: true,
                    },

                    {
                        prop: "recaddress",
                        label: "收货地址",
                        width: "150",
                        addDisplay: false,
                        span: 5,
                        overHidden: true,
                        hide: true,
                    },

                    {
                        prop: "orderdate",
                        label: "下单日期",
                        width: "100",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true,
                        hide: true,
                    },

                    {
                        prop: "salesdeadlinedate",
                        label: "销售截数日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true
                    },


                    {
                        prop: "suppliercode",
                        label: "联营商代码",
                        width: "100",
                        addDisplay: false,
                        span: 5
                    },
                    {
                        prop: "suppliername",
                        label: "联营商名称",
                        width: "100",
                        span: 8,
                        props: {
                            api: "/po1mnt001/querySupplierList",
                            checkall: true,
                            params: {
                                type: "",
                                // userid: store.state.user.userInfo.code,
                            },
                        },
                        component: "DroplistControl",
                        overHidden: true
    
                    },
                    {
                        prop: "vendorname",
                        label: "供货商",
                        width: "80",
                        span: 8,
                        props: {
                            api: "/po1mnt002/queryVendorList",
                            checkall: true,
                            watch: true,
                            params: {
                                type: "0",
                                supplierlist: "",
                                // userid: store.state.user.userInfo.code,
                            },
                            // label: 'name',
                            // value: 'id'
                        },
                        hide: true,
                        component: "DroplistControl",
                        overHidden: true
                    },
                    {
                        prop: "itemno",
                        label: "款号/款式编码",
                        width: "180",
                        labelWidth: 130,
                        span: 8,
                        overHidden: true,
                        addDisplay: false,
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            message: "款号/款式编码不能为空",
                          },
                        ],

                    },
                    {
                        prop: "huohao",
                        label: "货号/款+颜色",
                        width: "80",
                        span: 5,
                        addDisplay: false,
                        overHidden: true
                    },

                    {
                        prop: "colorguige",
                        label: "颜色及规格",
                        width: "100",
                        span: 5,
                        addDisplay: false,
                        overHidden: true,
                        hide: true,
                    },

                    {
                        prop: "previousqty",
                        label: "带落数量",
                        width: "80",
                        span: 5,
                        addDisplay: false
                    },

                    {
                        prop: "audidate",
                        label: "审核日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true
                    },

                    {
                        prop: "audiman",
                        label: "审核人",
                        width: "80",
                        span: 5,
                        addDisplay: false,
                        //cell: true,
                    },


                    {
                        prop: "vendorconfirmdate",
                        label: "供货商确认日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true
                    },
                    {
                        prop: "finishdate",
                        label: "完成日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true,
                        hide: true,
                    },

                    {
                        prop: "lastmodidate",
                        label: "最后修改日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true,
                    },
                    {
                        prop: "voiddate",
                        label: "作废日期",
                        width: "120",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true,
                        hide: true,
                    },
                    {
                        prop: "buhuojianyiname",
                        label: "补货建议",
                        width: "100",
                        span: 5,
                        //cell: true,
                        addDisplay: false,
                        hide: true,
                    },

                    {
                        prop: "yaoqiudaocangqtyremarkname",
                        label: "按21天可销售推断库存缺口",
                        width: "150",
                        span: 5,
                        //cell: true,
                        addDisplay: false
                    },

                    //viewDisplay: false,
                    //editDisplay: false,
                    //addDisplay: false,
                    //tip: '只能上传jpg/png用户头像，且不超过500kb',
                    //action: '/imgupload'
                ]
            })
let tableLoading = ref(false)
let crudTableData = ref([])
let page = ref({
                currentPage: 1,
                total: 0,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100]
            })
let queryFormOptionExt = ref({})
// let subPath = ref("purpo/purpoin/" + new Date().Format("yyyyMM"))
let subPath = ref("")
let importDialogVisible = ref(false)
let importFileList = ref([])
let fileidList = ref([])
let btn_query = ref(false)
let btn_add = ref(false)
let btn_dataImport = ref(false)
let btn_dataExport = ref(false)
let btn_edit = ref(false)
let btn_confirm = ref(false)
let btn_confirm2 = ref(false)
let btn_confirm3 = ref(false)
let btn_confirm4 = ref(false)
let mainfileList = ref([]) //主图上传文件
// let subPathImg = ref("img/itemDraft/" + new Date().Format("yyyyMM"))
let subPathImg = ref("")
let noneUploadBtn = ref(false)
let otherfileList = ref([]) //附图上传文件
let alterFileList = ref([]) //修改后的上传文件
const crud = ref(null);

//子页面begin
const crud2 = ref(null);
let table2 = ref({
    vendorname:""
})
let tableLoading2 = ref(false)
let crudTableData2 = ref([])
let page2 = ref({
    currentPage: 1,
    total: 0,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
})
let tableSelectList2 = ref([])
let tableOption2 = ref({
                selection: true,
                delBtn: false,
                menuWidth: 150,
                height: 300,
                addBtn: false,
                editBtn: false,
                cancelBtn: false,
                cellBtn: false /* 行内编辑 */,
                columnBtn: false /* 行显隐按钮 */,
                refreshBtn: false /* 表格刷新按钮 */,
                menu: true,
                keyId: "id",
                column: [

                    {
                        prop: 'orderstatusname',
                        label: '状态',
                        width: '80',
                        addDisplay: false,
                        span: 8,
                        // formatter: (row, column, cellValue /*, index, ...otherArgs*/) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        //   // 返回带有样式的 HTML 字符串
                        //   return `<div style="background-color: ${color}; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${cellValue}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.orderstatusname || 'orderstatusname');
                        }
                    },

                    {
                        prop: "colorguige",
                        label: "颜色及规格",
                        width: "100",
                        span: 5,
                        addDisplay: false,
                        overHidden: true
                    },

                    {
                        prop: "isUpload",
                        label: "上传聚水潭",
                        width: "80",
                        addDisplay: false,
                        span: 8,
                    },

                    {
                        prop: "poid",
                        label: "聚水潭采购单号",
                        width: "80",
                        addDisplay: false,
                        span: 8
                    },

                    {
                        prop: "orderno",
                        label: "追单编号",
                        width: "100",
                        span: 8,
                        addDisplay: false
                    },
                    {
                        prop: "jstSupplierId",
                        label: "聚水潭供应商编号",
                        width: "140",
                        span: 6,
                        addDisplay: false,
                        // formatter: (row) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        // //   const icon = row.istestitem === 1 && row.state === 3 ? 'el-icon-star-on' : null;
                        //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${row.jstsupplierid?row.jstsupplierid:""}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.jstSupplierId || '无');
                        },
                        overHidden: true
                    },
                    {
                        prop: "jstGoodsCode",
                        label: "聚水潭商品编码(skuId)",
                        width: "180",
                        span: 6,
                        addDisplay: false,
                        // formatter: (row) => {
                        //   // 根据不同的值返回不同的背景颜色
                        //   const color = row.jststate === 2 ? '#32CD32' : (row.jststate === 1 ? 'orange' : '#dd6e6e');
                        // //   const icon = row.istestitem === 1 && row.state === 3 ? 'el-icon-star-on' : null;
                        //   return `<div style="background-color: ${color};box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${row.jstgoodscode?row.jstgoodscode:""}</div>`;
                        // },
                        render: ({ row }) => {
                            console.log('row',row);
                            const color = row.jstState === 2 ? '#32CD32' : (row.jstState === 1 ? 'orange' : '#dd6e6e');
                            return h('p',
                            {
                            style: { background : color},
                            }, row.jstGoodsCode || '无');
                        },
                        overHidden: true
                    },

                    {
                        prop: "goodscode",
                        label: "商品编码(外部码)",
                        width: "170",
                        span: 8,
                        addDisplay: false,
                        overHidden: true
                    },

                    {
                        prop: "yaoqiudaocangdate",
                        label: "要求到仓日期",
                        labelWidth: "140",
                        width: "150",
                        span: 8,
                        overHidden: true,
                        // component: "date",
                        format: "YYYY-MM-DD",
                        valueFormat: "YYYY-MM-DD",
                        type: "date",
                        value: dateutil.curdate(),
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            // message: "",
                          },
                        ],
                    },
                    {
                        prop: "yaoqiudaocangqty",
                        label: "要求到仓数量",
                        width: "100",
                        addDisplay: false,
                        span: 5
                    },

                    {
                        prop: "price",
                        label: "采购单单价",
                        width: "100",
                        labelWidth: "140",
                        span: 8,
                        addDisplay: false,
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            message: "采购单单价不能为空",
                          },
                        ],
                    },
                
                    {
                        prop: "sumprice",
                        label: "总金额",
                        width: "100",
                        labelWidth: "140",
                        span: 8,
                        // editDisabled: true,
                        editDisplay: false,
                        addDisplay: false,
                        render: ({ row }) => {
                            return h('p',
                                {
                                }, row.price * row.yaoqiudaocangqty);
                        },
                    },

                    {
                        prop: "vendordaocangdate",
                        label: "供货商确认到仓日期",
                        width: "150",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        overHidden: true,
                        addDisplay: false,
                        component: "date",
                    },
                    {
                        prop: "vendordaocangqty",
                        label: "供货商确认到仓数量",
                        width: "100",
                        addDisplay: false,
                        span: 5,
                    },

                    {
                        prop: "recaddress",
                        label: "收货地址",
                        width: "150",
                        addDisplay: false,
                        span: 5,
                        overHidden: true
                    },

                    {
                        prop: "orderdate",
                        label: "下单日期",
                        width: "100",
                        span: 5,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        addDisplay: false,
                        overHidden: true
                    },

                    {
                        prop: "vendorname",
                        label: "供货商",
                        width: "80",
                        span: 8,
                        props: {
                            api: "/po1mnt002/queryVendorList",
                            checkall: true,
                            watch: true,
                            params: {
                                type: "0",
                                supplierlist: "",
                                // userid: store.state.user.userInfo.code,
                            },
                            // label: 'name',
                            // value: 'id'
                        },
                        component: "DroplistControl",
                        overHidden: true
                    },
                    {
                        prop: "itemno",
                        label: "款号/款式编码",
                        width: "180",
                        labelWidth: 130,
                        span: 8,
                        overHidden: true,
                        rules: [
                          {
                            // trigger: "blur",
                            required: true,
                            message: "款号/款式编码不能为空",
                          },
                        ],

                    },
                    {
                        prop: "buhuojianyiname",
                        label: "补货建议",
                        width: "100",
                        span: 5,
                        //cell: true,
                        addDisplay: false
                    },
                ]
            })

function findpermission() {
  findPermission().then(res => {
    permission.value = (res.data == '1')
  })
}

function toggleSelection2(val) {
    //清空
    crud2.value.toggleSelection(val);
}

function sizeChange2(val) {
    //改变每页记录数
    page2.value.currentPage = 1;
    page2.value.pageSize = val;
    query2();
}
function currentChange2(val) {
    //换页
    page2.value.currentPage = val;
    query2();
}

function selectionChange2(list) {
    console.log('选择框改变',list);
    tableSelectList2.value = list;
}

function rowclick(row){
    console.log('点击行的row',row);
    productId.value = row.productId
    guigeVisible.value = true
    query2()
}

function closeGuige(){
    productId.value = 0
    guigeVisible.value = false
}

function query2(PageNumber) {
    let params = {
        pageSize: page.value.pageSize,
        pageNumber: page.value.currentPage,
        productId: productId.value,
        usertype: usertype1.value
    };
    let usertype = usertype1.value
    tableLoading2.value = true;
    console.log('查询的参数',params,form.value);
    queryData(params).then(res => {
        console.log('查询2的res',res);
        if (res.code === "") {
            const data = res.data;
            console.log('查询的res',data.list);
            crudTableData2.value = data.list;
            page2.value.total = data.total;
            page2.value.pageSize = params.pageSize;
            page2.value.currentPage = params.pageNumber;
            tableLoading2.value = false;
            toggleSelection2();
            crudTableData2.value.forEach(function (item) {
                if (usertype == "2" || usertype == 2) {
                    if (item.orderstatus == 0 || item.orderstatus == '0') {
                        item.$cellEdit = true
                    }
                }
                if (usertype != "2" || usertype != 2) {
                    if (item.orderstatus == 1 || item.orderstatus == '1') {
                        item.$cellEdit = true
                    }
                }
            })
        }
    });
}

//子页面end



const getfileId = (val, name) => {
    fileidList.value.push(val)
  // batchFileList.value.push(val)
  console.log("getfileId", fileidList.value)
}

const delfileId = (val) => {
  // fileid1.value=[]
  // fileid1.value.splice(fileid1.value.indexOf(val),1)
  // alterFileList.value.forEach(i=>{
  //   batchFileList.value.splice(batchFileList.value.indexOf(i),1)
  // })
  // val.forEach(i=>{
  //   batchFileList.value.push(i)
  // })
  fileidList.value = val
  console.log("delfileId", fileidList.value)
}

watch(
  () => form.suppliercode, (newVal) => {
    if (newVal) {
        formOption.value.column.forEach((item) => {
                    if (JSON.stringify(val.suppliercode).length > 2 && JSON.stringify(val.suppliercode) != "" && JSON.stringify(val.suppliercode) != "[]") {
                        if (item.prop === "vendorcode") {
                            item.props.params.supplierlist = val.suppliercode
                        }
                    }
                });
    }
}, { immediate: false, deep: true })

function handRetrieval(row){
    let ids = []
    let isright = true
    console.log("取回的row",row)
    if(row != undefined && row != null){
        ids.push(row.id)
    }else{
        tableSelectList2.value.forEach(i => {
            if(i.orderstatus==4){
                ids.push(i.id)
            }else{
                isright = false
                ElMessage.warning("只有作废状态的采购单才能取回");
                return;
            }
        })
    }
    if(!isright){
        return;
    }
    let param = {
        ids:ids
    }
    console.log("取回的参数",param)
    retrieval(param).then(res => {
        console.log('取回的res----------', res);
        if (res.code == "") {
            query2();
        } else {
            ElMessage.warning("操作失败");
        }
    })
}

async function oneshenhe(index, oristate) {
    await handRowUpdate(index, oristate)
    one_confirm(index, oristate, 0)
}

function confirm(state, oristate) {
            if (JSON.stringify(tableSelectList2.value) == "[]") {
                ElMessage.warning('请选择记录！!')
                return;
            }
            //
            let selectList = [], index = 0, item = {};
            while (index < tableSelectList2.value.length) {
                item = tableSelectList2.value[index];
                switch (state) {
                    case (1)://审核
                        if (item.orderstatus == 0) {
                            if (item.yaoqiudaocangdate == null || item.yaoqiudaocangdate == undefined) {
                                ElMessage.warning("要求到仓日期不能为空");
                                return;
                            }
                            if (item.yaoqiudaocangqty == 0 || item.yaoqiudaocangqty == null || item.yaoqiudaocangqty == undefined) {
                                ElMessage.warning("要求到仓数量不能为空");
                                return;
                            }
                            selectList.push(item)
                        }
                        break;
                    case (2)://供货商确认
                        if (item.orderstatus == 1) {
                            if (item.vendordaocangdate == null || item.vendordaocangdate == undefined) {
                                ElMessage.warning("供货商确认到仓日期不能为空");
                                return;
                            }
                            if (item.vendordaocangqty == 0 || item.vendordaocangqty == null || item.vendordaocangqty == undefined) {
                                ElMessage.warning("供货商确认到仓数量不能为空");
                                return;
                            }
                            if (item.yaoqiudaocangqty < item.vendordaocangqty) {
                                ElMessage.warning("供货商确认到仓数量不能大于要求到仓数量!");
                                return;
                            }
                            selectList.push(item)
                        }
                        break;
                    case (3)://确认下单
                        if (item.orderstatus == 2) {
                            selectList.push(item)
                        }
                        break;
                    case (4)://作废
                        if (item.orderstatus != 3) {
                            selectList.push(item)
                        }
                        break;
                }
                index++;
            }
            if (selectList.length != 0) {
                fn_confirm(selectList, state, oristate);
            } else {
                switch (state) {
                    case (1):
                        ElMessage.warning("当前勾选数据不存在[草稿]状态数据,仅[草稿]状态数据可进行[审核]操作！");
                        break;
                    case (2):
                        ElMessage.warning("仅[待确认]状态数据可进行[供货商确认]操作！");
                        break;
                    case (3):
                        ElMessage.warning("仅[供货商确认]状态数据可进行[确认下单]操作！");
                        break;
                    case (4):
                        ElMessage.warning("已[完成]的采购单不允许[作废]！");
                        break;
                }
            }
}

function one_confirm(index, state, oristate) {
            let mplist = []
            mplist.push(crudTableData2.value[index])
            if (state == 1) {
                if (crudTableData2.value[index].yaoqiudaocangdate == null || crudTableData2.value[index].yaoqiudaocangdate == undefined || crudTableData2.value[index].yaoqiudaocangdate == "") {
                    ElMessage.warning("要求到仓日期不能为空");
                    return
                }
                if (crudTableData2.value[index].yaoqiudaocangqty == 0 || crudTableData2.value[index].yaoqiudaocangqty == null || crudTableData2.value[index].yaoqiudaocangqty == undefined) {
                    ElMessage.warning("要求到仓数量不能为空");
                    return
                }
                if (crudTableData2.value[index].goodscode == "" || crudTableData2.value[index].goodscode == null || crudTableData2.value[index].goodscode == undefined) {
                    ElMessage.warning("商品编码(外部码)不能为空");
                    return
                }
                if (crudTableData2.value[index].price == 0 || crudTableData2.value[index].price == null || crudTableData2.value[index].price == undefined || crudTableData2.value[index].price == "") {
                    ElMessage.warning("采购单单价不能为空");
                    return
                }
                if (crudTableData2.value[index].vendorname == 0 || crudTableData2.value[index].vendorname == null || crudTableData2.value[index].vendorname == undefined) {
                    ElMessage.warning("供应商不能为空");
                    return
                }
            }
            if (state == 2) {
                if (crudTableData2.value[index].orderstatus != 1) {
                    ElMessage.warning("只有状态为[待确认]的记录才能确认！");
                    return
                }
                if (crudTableData2.value[index].vendordaocangdate == null || crudTableData2.value[index].vendordaocangdate == undefined) {
                    ElMessage.warning("供货商确认到仓日期不能为空");
                    return
                }
                if (crudTableData2.value[index].vendordaocangqty == 0 || crudTableData2.value[index].vendordaocangqty == null || crudTableData2.value[index].vendordaocangqty == undefined) {
                    ElMessage.warning("供货商确认到仓数量不能为空");
                    return
                }
                if (crudTableData2.value[index].yaoqiudaocangqty < crudTableData2.value[index].vendordaocangqty) {
                    ElMessage.warning("供货商确认到仓数量不能大于要求到仓数量!");
                    return;
                }
            }
            fn_confirm(mplist, state, oristate)
        }

function fn_confirm(mplist, state, oristate) {
            if (mplist.length == 0) {
                if (state == 1)
                    ElMessage.warning("未选择记录,不能审核！");
                if (state == 2)
                    ElMessage.warning("未选择记录,不能确认！");
                if (state == 3)
                    ElMessage.warning("未选择记录,不能完成！");
                if (state == 4)
                    ElMessage.warning("未选择记录,不能作废！");
                return
            }
            let params = {
                detdata: mplist,
                state: state,  //2:联营商确认 1:待确认  0:草稿  3:完成 4:作废
                oristate: oristate, //1:联营商确认必须状态是已审核的  0:审核必须状态是待审核的  2:完成必须状态是联营商已确认的  4：任何状态都可以作废
                // user: store.state.user.userInfo.code
            };
            handConfirm(params).then(res => {
                console.log('审核的res----------',res);
                if (res.code == "") {
                    if (state == 1)
                        ElMessage.success("审核成功");
                    if (state == 2)
                        ElMessage.success("确认成功");
                    if (state == 3)
                        ElMessage.success("完成成功");
                    if (state == 4)
                        ElMessage.success("作废成功");
                    query2();
                } else {
                    // this.$message({
                    //     showClose: true,
                    //     message: "操作失败",
                    //     type: "error"
                    // });
                    ElMessage.warning("操作失败");
                }
            })
        }

function query(PageNumber) {
            let itemno = form.value.itemno;
            let itemnolist = itemno.split(/[,\n ]/);
            if (itemnolist.length > 1) {
                itemno = undefined;
            } else {
                itemnolist = [];
            }
            let goodscode = form.value.goodscode;
            let goodscodelist = goodscode.split(/[,\n ]/);
            if (goodscodelist.length > 1) {
                goodscode = undefined;
            } else {
                goodscodelist = [];
            }

            let vendorcode = form.value.vendorcode;

            let params = {
                pageSize: page.value.pageSize,
                pageNumber: PageNumber || page.value.currentPage,
                suppliercode: form.value.suppliercode,
                salesdeadlinedate: form.value.salesdeadlinedate,
                yaoqiudaocangdate: form.value.yaoqiudaocangdate,
                finishdate: form.value.finishdate,
                audidate: form.value.audidate,
                vendorconfirmdate: form.value.vendorconfirmdate,
                lastmodidate: form.value.lastmodidate,
                orderstatus: form.value.orderstatus,
                itemno: itemno,
                itemnolist: itemnolist,
                goodscode: goodscode,
                goodscodelist: goodscodelist,
                // loginsupp: loginsupp,
                // loginsupplist: loginsupplist,
                // loginven: loginven,
                // loginvenlist: loginvenlist,
                allowpowergene: form.value.allowpowergene,
                buhuojianyi: form.value.buhuojianyi,
                yaoqiudaocangqtyremark: form.value.yaoqiudaocangqtyremark,
                vendorcode: vendorcode,
                isgroup: 1,
                usertype: usertype1.value
            };
            let usertype = usertype1.value
            tableLoading.value = true;
            console.log('查询的参数',params,form.value);
            queryData(params).then(res => {
                console.log('查询的res',res);
                if (res.code === "") {
                    const data = res.data;
                    console.log('查询的res',data.list);
                    crudTableData.value = data.list;
                    page.value.total = data.total;
                    page.value.pageSize = params.pageSize;
                    page.value.currentPage = params.pageNumber;
                    tableLoading.value = false;
                    toggleSelection();
                    crudTableData.value.forEach(function (item) {
                        if (usertype == "2" || usertype == 2) {
                            if (item.orderstatus == 0 || item.orderstatus == '0') {
                                item.$cellEdit = true
                            }
                        }
                        if (usertype != "2" || usertype != 2) {
                            if (item.orderstatus == 1 || item.orderstatus == '1') {
                                item.$cellEdit = true
                            }
                        }
                    })
                }
            });
}

function handleAdd() {
    otherfileList.value = [];
    crud.value.rowAdd();
}
function handleChange() {}

function dataImport() {
    console.log('导入采购单');
    importDialogVisible.value = true;
}

function importCancel() {
    importDialogVisible.value = false; //关闭Dialog
    console.log("importCancel");
}

function importBeforeClose() {
            //
        }
function importBeforeOpen() {
            //
        }
function importHandleDelete() {
            //
        }

async function importSubmit() {
            // if (!this.$refs.importUpload.isAllFileUploaded()) {
            //     ElMessage.warning("文件上传中，尚未全部上传完成，请稍后重新尝试！");
            //     return;
            // }

            if (fileidList.value.length <= 0) {
                ElMessage.warning("未有任何上传的文件！");
                return;
            }
            console.log("导入采购单的fileidList",fileidList.value)
            let fileId = fileidList.value[0];

            // this.$dlg.Loading("导入中...");
            let params = {
                fileId: fileId,
                ordertype: "1"
            };
            await importData(params)
                .then((res) => {
                    console.log('导入采购单的res',res);
                    if (res.data !== "") {
                        let data = res.data;
                        if (data === "success") {
                            ElMessage.success("导入成功！");
                            query();
                        } else {
                            // 调用导出
                            ElMessage.warning("导入完成，有数据错误产生！");
                            excel.excelExport(res.name, data, '.xls')
                            // this.$excel.excelExport("错误信息", data, ".xlsx");
                        }
                        importFileList.value = [];
                    } else {
                        ElMessage.warning("导入失败！请检查Excel表。");
                    }
                })
                .catch(() => {
                    console.log("error");
                });

            importFileList.value = [];
            fileidList.value = [];
            // this.$dlg.Loading(false);
            importDialogVisible.value = false; //关闭Dialog
}

function rowsave(row, done, loading) {
            let params = {
                suppliercode: row.suppliername,
                vendorname: row.vendorname,
                itemno: row.itemno,
                goodscode: row.goodscode,
            };
            add(params)
                .then((res) => {
                    if (res.code === "") {
                        ElMessage.success("保存成功!");
                        query();
                        loading();
                        done();
                    }
                })
                .catch(() => {
                    // ElMessage.warning("保存失败!");
                    loading();
                });
}

async function handRowUpdate(index, itype) {
            let params = {};
            let usertype2 = false
            //当前是否为联营商
            if (usertype1.value == "2" || usertype1.value == 2) {
                usertype2 = true
            }
            console.log('itype和usertype1.value',itype,usertype1.value);
            if (itype == 0) {
                if (JSON.stringify(tableSelectList2.value) == "[]") {
                    ElMessage.warning("请选择记录！");
                    return
                }
                let dat = []
                // this.tableSelectList.forEach((item) => {
                //     if (usertype || item.yaoqiudaocangqty != "" && item.vendordaocangqty <= item.yaoqiudaocangqty) {
                //         dat.push(item)
                //     }
                // })

                let index = 0;
                let item;
                while (index < tableSelectList2.value.length) {
                    item = tableSelectList2.value[index];
                    if (usertype1.value == 2) {
                        //联营商
                        if (usertype1.value == "2" && item.yaoqiudaocangdate == null || item.yaoqiudaocangdate == undefined || item.yaoqiudaocangdate == "") {
                            ElMessage.warning("要求到仓日期不能为空");
                            return;
                        }
                        if (usertype1.value == "2" && item.yaoqiudaocangqty == 0 || item.yaoqiudaocangqty == null || item.yaoqiudaocangqty == undefined) {
                            ElMessage.warning("要求到仓数量不能为空");
                            return;
                        }
                    } else {
                        //供货商
                        if (item.vendordaocangdate == null || item.vendordaocangdate == undefined) {
                            ElMessage.warning("供货商确认到仓日期不能为空");
                            return;
                        }
                        if (item.vendordaocangqty == 0 || item.vendordaocangqty == null || item.vendordaocangqty == undefined) {
                            ElMessage.warning("供货商确认到仓数量不能为空");
                            return;
                        }
                        if (item.yaoqiudaocangqty < item.vendordaocangqty) {
                            ElMessage.warning("供货商确认到仓数量不能大于要求到仓数量!");
                            return;
                        }
                    }
                    //入值
                    dat.push(item)
                    index++;
                }
                if (dat.length != 0) {
                    params = {
                        detdata: dat
                    };
                }
            }
            else {
                let mplist = []
                if (usertype2 || crudTableData2.value[index].yaoqiudaocangqty != "" 
                && crudTableData2.value[index].vendordaocangqty <= crudTableData2.value[index].yaoqiudaocangqty) {
                    console.log('进来了吗？',crudTableData2.value,crudTableData2.value[index],index);
                    mplist.push(crudTableData2.value[index])
                    params = {
                        detdata: mplist
                    };
                } else {
                    ElMessage.warning("供货商确认到仓数量不能大于要求到仓数量!");
                    return
                }
            }
            console.log('编辑的参数--',params);
            var loading = ElLoading.service({ fullscreen: true })
            await RowUpdate(params).then(res => {
                console.log('编辑的res',res);
                if (res.code === "") {
                    ElMessage.success("保存成功");
                    query2();
                } else {
                    // this.$message({
                    //     showClose: true,
                    //     message: "保存失败",
                    //     type: "error"
                    // });
                    ElMessage.warning("保存失败");
                }
            }).catch(error => {
                console.error('发生错误', error);
            }).finally(() => {
              loading.close();
            });
}

function showimage(row, column) {
            if (column.property === "pictureaddr") {
                ElMessageBox({
                    message: `<div><img src='${row.pictureaddr}' style='position:relative;width:100%;height:100%;'></div>`,
                    type: 'info', // 或者其他你想要的类型
                    dangerouslyUseHTMLString: true,
                    showConfirmButton: false,
                    customClass: 'winClass', // 弹窗样式
                    // 注意：在 Element Plus 中，没有直接的 .then() 方法链。
                    // 你需要使用回调函数或者 async/await 来处理后续逻辑。
                    callback: (action) => {
                        if (action === 'close') {
                        buyInsurancePrintTicket(); // 调用后续逻辑
                        }
                    }
                });
            }
            if (column.property === "sysimageview") {
                ElMessageBox({
                    message: `<div><img src='${row.sysimageview}' style='position:relative;width:100%;height:100%;'></div>`,
                    type: 'info', // 或者其他你想要的类型
                    dangerouslyUseHTMLString: true,
                    showConfirmButton: false,
                    customClass: 'winClass', // 弹窗样式
                    // 注意：在 Element Plus 中，没有直接的 .then() 方法链。
                    // 你需要使用回调函数或者 async/await 来处理后续逻辑。
                    callback: (action) => {
                        if (action === 'close') {
                        buyInsurancePrintTicket(); // 调用后续逻辑
                        }
                    }
                });
            }
        }

function sizeChange(val) {
            //改变每页记录数
            page.value.currentPage = 1;
            page.value.pageSize = val;
            query();
        }
function currentChange(val) {
            //换页
            page.value.currentPage = val;
            query();
        }
function toggleSelection(val) {
            //清空
            crud.value.toggleSelection(val);
        }
function selectionChange(list) {
            tableSelectList.value = list;
        }

async function dataExport() {
            // this.$dlg.Loading("数据导出中...");
            //0为未勾选，1为勾选了(如果勾选了数据则以勾选的数据为准，为勾选的情况下按照查询情况进行导出)
            let type = 0;
            let itemno = form.value.itemno;
            let itemnolist = itemno.split(/[,\n ]/);
            let goodscode = form.value.goodscode;
            let goodscodelist = goodscode.split(/[,\n ]/);
            let loginsupp = loginsup.value;
            let loginsupplist = loginsupp.split(/[,\n ]/);
            let loginven = loginven1.value;
            let loginvenlist = loginven.split(/[,\n ]/);
            // let vendorcode = "";
            let list = []
            if (tableSelectList.value.length != 0) {
                type = 1
                list = tableSelectList.value.map((item) => {
                    // return item.id
                    return item.productId
                })
            }

            if (itemnolist.length > 1) {
                itemno = undefined;
            } else {
                itemnolist = [];
            }
            if (goodscodelist.length > 1) {
                goodscode = undefined;
            } else {
                goodscodelist = [];
            }
            if (loginsupplist.length > 1) {
                loginsupp = undefined;
            } else {
                loginsupplist = [];
            }
            if (loginvenlist.length > 1) {
                loginven = undefined;
            } else {
                loginvenlist = [];
            }
            // form.value.vendorcode.forEach(function (item) {
            //     vendorcode = vendorcode + item + ","
            // })
            // vendorcode = vendorcode.substring(0, vendorcode.length - 1)
            let vendorcode = form.value.vendorcode;

            let params = {
                suppliercode: form.value.suppliercode,
                salesdeadlinedate: form.value.salesdeadlinedate,
                yaoqiudaocangdate: form.value.yaoqiudaocangdate,
                finishdate: form.value.finishdate,
                audidate: form.value.audidate,
                vendorconfirmdate: form.value.vendorconfirmdate,
                lastmodidate: form.value.lastmodidate,
                orderstatus: form.value.orderstatus,

                itemno: itemno,
                itemnolist: itemnolist,
                goodscode: goodscode,
                goodscodelist: goodscodelist,

                loginsupp: loginsupp,
                loginsupplist: loginsupplist,

                loginven: loginven,
                loginvenlist: loginvenlist,
                allowpowergene: form.value.allowpowergene,
                buhuojianyi: form.value.buhuojianyi,
                yaoqiudaocangqtyremark: form.value.yaoqiudaocangqtyremark,
                vendorcode: vendorcode,
                type: type,
                list: list
            };
            console.log('导出采购单的params',params);
            await exportData(params)
                .then(async (res) => {
                    console.log('导出采购单的res',res);
                    if (res.data != "") {
                        let base64 = res.data;
                        excel.excelExport(res.name, base64, '.xls')
                        // 调用导出
                        // await this.$excel.excelExport(
                        //     res.data.result.fileName,
                        //     base64,
                        //     ".xlsx"
                        // );
                    }
                })
                .catch(() => {
                    // this.$dlg.Loading(false);
                    ElMessage.warning("导出错误");
                });
            // this.$dlg.Loading(false);
        }

    onMounted(() => {
        findpermission()
        // console.log('store.state.user.userInfo.code,',store.state.user.userInfo);
        loginsup.value = "";
        loginven1.value = "";
        usertype1.value = "";
        let params = {
            // userid: store.state.user.userInfo.code
        }
        queryRole(params).then(res => {
            console.log('queryRole的res',res);
            if (res.code == "") {
                const data = res.data;
                // this.loginsupp = data.tableData[0].supplierlist
                // this.loginven = data.tableData[0].vendorlistn
                usertype1.value = data[0].userType

                // let loginsupp = this.loginsupp;
                // let loginsupplist = loginsupp.split(/[,\n ]/);

                // if (loginsupplist.length > 1) {
                //     loginsupp = undefined;
                // } else {
                //     loginsupplist = [];
                // }

                // let loginven = this.loginven;
                // let loginvenlist = loginven.split(/[,\n ]/);
                // if (loginvenlist.length > 1) {
                //     loginven = undefined;
                // } else {
                //     loginvenlist = [];
                // }
                // localStorage.setItem("po1_loginsupp", loginsupp)
                // localStorage.setItem("po1_loginsupplist", loginsupplist)


                // this.btn_query = this.permission["Pomnt1002_query"] || false;
                // this.btn_add = this.permission["Pomnt1002_add"] || false;
                // this.btn_dataImport = this.permission["Pomnt1002_dataImport"] || false;
                // this.btn_edit = this.permission["Pomnt1002_edit"] || false;
                // this.btn_confirm = this.permission["Pomnt1002_confirm"] || false;

                // this.btn_confirm2 = this.permission["Pomnt1001_confirm2"] || false;//供货商确认

                // this.btn_confirm3 = this.permission["Pomnt1001_confirm3"] || false;//完成
                // this.btn_confirm4 = this.permission["Pomnt1001_confirm4"] || false;//作废
                // this.bnt_dataExport = this.permission["Pomnt1002_dataExport"] || false;//作废

                console.log("usertype1--------",usertype1.value)
                if (usertype1.value == "2" || usertype1.value == 2) {
                    btn_confirm2.value = false
                    tableOption2.value.column.forEach(function (item) {
                        if (item.prop == "recaddress") {
                            item.cell = true
                        }
                        if (item.prop == "yaoqiudaocangdate") {
                            item.cell = true
                        }
                        if (item.prop == "yaoqiudaocangqty") {
                            item.cell = true
                        }
                        if (item.prop == "jstSupplierId") {
                            item.cell = true
                        }
                        if (item.prop == "jstGoodsCode") {
                            item.cell = true
                        }
                        if (item.prop == "price") {
                        item.cell = true
                        }
                    })
                }
                else {
                    tableOption2.value.column.forEach(function (item) {
                        if (item.prop == "recaddress") {
                            item.cell = true
                        }
                        if (item.prop == "vendordaocangdate") {
                            item.cell = true
                        }
                        if (item.prop == "vendordaocangqty") {
                            item.cell = true
                        }

                    })
                }
            }
        })
    });

    // computed: {
    //     ...mapGetters(["elements", "permission"])
    // },

</script>
  
<style scoped>
.mention{
    margin-bottom: 40px;
}

.color-description {
  margin-left: 30px;
  float: left;
}

.color-box {
  width: 30px;
  height: 20px;
  display: inline-block;
  margin-right: 10px;
}

.description {
  font-size: 16px;
  display: inline-block;
  vertical-align: middle;
}
</style>

<style scoped>
div>>>.avue-form__group {
    margin-top: 15px;
}

div>>>.avue-form__row {
    margin-top: -15px;
}

.el-dropdown {
    vertical-align: top;
}

.el-dropdown+.el-dropdown {
    margin-left: 15px;
}

.el-icon-arrow-down {
    font-size: 12px;
}
:deep(.avue-crud__tip-button){
  border:0
}
</style>

<style lang="scss" scoped>

.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container{
  width: 95%;
  background: $neutral-color-1;
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.pic{
  width: 100%; 
  height:50px; 
  display: flex; 
  justify-content: end;
  // padding: 16px;
  // margin: 24px;
  // margin-top: 0;
  // padding-top: 0;
  .steps{
    max-width: 400px;
  }
}

:deep(.el-step__title){
  font-size:small;
  line-height: normal;
  width:60px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin:24px;
  margin-top: 0;
  padding-top: 0;
  // margin-left:24px;
}

.midcontainer{
  // padding:.4rem;
  display: flex;
  justify-content: center;
  width: 100%;
//   padding-top: 16px;
}

.button{
    // margin-top: 16px;
}
</style>