<template>
  <div>
    <el-popover
        placement="top"
        :width="600"
        :visible="popVisible"
        trigger="click"
        :disabled="disabled"
    >
        <template #reference>
            <span @click="popVisible = !popVisible;">
                <el-input
                  v-model="selected"
                  placeholder="点击快速选择数据"
                  readonly
                  style="width: 88%"
                  :class="staytrue"
                >
                <template #suffix>
                    <el-icon :class="{'el-input__icon':true, rotate:popVisible}"><Search /></el-icon>
                </template>
                </el-input>
            </span>
        </template>

        <el-container style="height: 461px;">
            <el-header>
                <el-form class="form">
                    <el-form-item label="名称">
                        <el-input v-model="query.name" maxlength="10" placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item label="代码">
                        <el-input v-model="query.code" maxlength="10" placeholder="请输入代码" />
                    </el-form-item>
                    <el-form-item label="代号">
                        <el-input v-model="query.cid" maxlength="10" placeholder="请输入代号" />
                    </el-form-item>
                    <div style="width:100%;display: flex;justify-content: flex-end;">
                        <el-button type="primary" @click="getData" style="margin-left: 5px;" :class="staytrue">查询</el-button>
                        <el-button type="primary" @click="commit">确定</el-button>
                        <el-button type="primary" @click="popVisible=false">关闭</el-button>
                    </div>
                </el-form>
            </el-header>

            <el-main style="overflow: auto">
                <div>
                    <el-button type="text" disabled>当前已选择{{ historySelection.length }}项</el-button>
                    <el-button type="text" @click="resetSelection">清空</el-button>
                    <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="{background: '#EEF3FF',color: '#333333'}" 
                    tooltip-effect="dark" style="width: 100%"  max-height="500" class="dataTable" 
                    @select="handleSelectionChange" @select-all="selectAll" v-horizontal-scroll="'always'" ref="tableRef">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="id" label="id" show-overflow-tooltip />
                        <el-table-column prop="name" label="名称" show-overflow-tooltip />
                        <el-table-column prop="code" label="代码" show-overflow-tooltip />
                        <el-table-column prop="cid" label="代号" show-overflow-tooltip />
                    </el-table>
                </div>
            </el-main>

            <el-footer>
                <div class="pagination-container">
                    <el-pagination :current-page="page.page" :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" background :total="page.total" style="margin: 20px 0 0 0;"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
                <!-- <div>
                  <el-button @click="popVisible=false" size="small" :icon="Close">关闭</el-button>
                  <el-button @click="1" size="small" type="primary" :icon="Check">确认</el-button>
                </div> -->
            </el-footer>
        </el-container>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue';
import {Check, Close} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import request from '@/utils/request'
const props = defineProps({
// ！！！不可以用驼峰命名法命名变量 ！！！
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: () => false,
  },
/** api路径 */
  url: {
    type: String,
    default: () => [],
  },
  returntype: {
    type: String,
    default: () => 'id',
  },
//一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
//vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
  modelValue: {
    type: Array,
    default : () => []
  }
});

const {
    disabled,
    url,
    returntype,
    modelValue
} = toRefs(props);

const emits = defineEmits(['update:modelValue']);

// 手动控制是否显示弹窗
const popVisible = ref(false)
//选择的数据
const selected = ref([])
//查询条件
let query = reactive({
  name:"",
  code:"",
  cid:""
})
let page = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
//表格数据
const tableData = ref([])
//实时选择的数据
const multipleSelection = ref([])
//
//历史选择的数据,仅存放id字段
const historySelection = ref([])
const tableRef = ref();

//查询
async function getData (){
    if(url.value!=""){
        let params = {
            page:page.page,
            pageSize:page.pageSize,
            name:query.name,
            code:query.code,
            cid:query.cid
        }
        await request({
            url: url.value,
            method: 'post',
            data: params,
        }).then((res) => {
            console.log('获取列表',res);
            tableData.value = res.data.list
            page.total = res.data.total
        })
        reSelect()
    }
}

const handleSelectionChange = (selection, row) => {
    console.log('复选框参数',selection, row);
    if(selection.includes(row)){
        console.log('新增');
        multipleSelection.value.push(row)
        saveSelectId()
    }else{
        console.log('取消',multipleSelection.value,historySelection.value);
        //如果是取消勾选操作，就把取消勾选后的选择数据selection传给multipleSelection，并且把historySelection里对应存的历史勾选id字段也去除，实现页数改变和一页展示总数改变也不会清空勾选数据。
        multipleSelection.value = selection
        historySelection.value.splice(historySelection.value.indexOf(row.id),1)
    }
    console.log("复选框变化", multipleSelection.value,historySelection.value)
}

const selectAll = (selection) => {
    console.log('全选',selection);
    multipleSelection.value = selection
    if(selection.length==0){
        //如果取消全选，那么将那一页的全部数据都从historySelection中移除
        console.log('tableData',tableData.value);
        tableData.value.forEach(i=>{
            if(historySelection.value.includes(i.id)){
                historySelection.value.splice(historySelection.value.indexOf(i.id),1)
            }
        })
    }else{
        //如果全选，将选择的数据全部放进到historySelection里
        selection.forEach(i=>{
        if(!historySelection.value.includes(i.id)){
            historySelection.value.push(i.id)
        }
    })
    }
}

onMounted(() => {
    console.log('进入组件select-table');
    registerGlobalClick();
    // getData()
})

onUnmounted(() => {
  unregisterGlobalClick();
});

watch(
  () => popVisible, (newVal) => {
    if(newVal.value){
        console.log('popVisible变成',newVal.value);
        getData()
        firstSet()
    }
}, { immediate: false, deep: true })

// watch(
//   () => modelValue, (newVal) => {
//     console.log('modelValue改变',modelValue,newVal);
//     modelValue.value.forEach(i=>{
//         historySelection.value.push(i)
//     })
//     reSelect()
// }, { immediate: false, deep: true })

async function handleSizeChange(val) {
    saveSelectId()
    page.pageSize = val
    await getData()
}
async function handleCurrentChange(val) {
    saveSelectId()
    page.page = val
    await getData()
}

async function saveSelectId(){
    //将选择的数据的id字段存进historySelection，已经存在的不存
    console.log('保存选择',multipleSelection.value,historySelection.value);
    multipleSelection.value.forEach(i=>{
        if(!historySelection.value.includes(i.id)){
            historySelection.value.push(i.id)
        }
    })
}

async function reSelect(){
    //将表格的数据与historySelection对比，将historySelection里的数据重新勾选
    console.log('改变后',multipleSelection.value,historySelection.value);
    for (let i = 0; i < tableData.value.length; i++) {
        if (historySelection.value.includes(tableData.value[i].id)) {
          const row = tableData.value[i];
          //选择的数据显示勾选
          tableRef.value.toggleRowSelection(row);
        }
    }
}

function commit(){
    //传回给父组件的v-model；传回的是选择的id列表
    if(returntype.value=='id'){
        emits("update:modelValue", historySelection.value)
    }else if(returntype.value=='code'){
        // emits("update:modelValue", historySelection.value)
    }
    popVisible.value=false
}

function resetSelection(){
    multipleSelection.value=[]
    historySelection.value=[]
    tableRef.value.clearSelection();
}

//接受父组件传来的初始勾选值
function firstSet(){
    for (let i = 0; i < modelValue.value.length; i++) {
        if (!historySelection.value.includes(modelValue.value[i])) {
            historySelection.value.push(modelValue.value[i])
        }
    }
    reSelect()
}

// 以下方法检测用户的点击，当点击到popover组件外时，关闭弹窗
const isPopoverChildComponent = (element) => {
    // console.log('element',element);
  if (element && element.classList) {
    if (element.classList.contains('el-input__inner') ||
    element.classList.contains('el-button') ||
    element.classList.contains('el-pager')||
    element.classList.contains('el-container')) {
      return true;
    }
  }
  if (element.parentElement) {
    return isPopoverChildComponent(element.parentElement);
  }
  return false;
};

const handleGlobalClick = (event) => {
  nextTick(() => {
    if (!isPopoverChildComponent(event.target)) {
      popVisible.value=false
    }
  });
};
const registerGlobalClick = () => {
  window.addEventListener('click', handleGlobalClick);
};
const unregisterGlobalClick = () => {
  window.removeEventListener('click', handleGlobalClick);
};

</script>

<style scoped>
.form{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
}
:deep(.el-form-item){
    width: 31%;
}
:deep(.el-main){
    padding-top: 0;
}
:deep(.dataTable .el-table__header){
    height: 0;
}
:deep(.dataTable .el-table__row){
    height: 0;
}
:deep(.el-header){
    height: 80px;
}

</style>