<template>
  <el-dialog
    v-model="visible"
    title="联营业务/联营款确认"
    fullscreen
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 这里放原来的内容 -->
    <div class="page-bg">
      <el-card class="main-card" shadow="never">
        <div class="table-footer">
   
        </div>
        <div class="search-panel" >
          <el-form :inline="true" :model="formInline">
            <el-form-item label="问题类型" v-if="sh_sign_id2" >
              <el-select
                v-model="fakuan_type"
                clearable
                placeholder="请选择问题类型"
                class="filter-item"
                style="width: 200px"
              >
              <el-option
              v-for="item in fakuan_list"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             
             />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="custom-button"
                :disabled="sh_sign_id"
                @click="fn_save1"
              >
                审阅
              </el-button>
            </el-form-item>
            <el-form-item label="处理方式" v-if="showSelect">
              <el-select
                v-model="select_type"
                clearable
                placeholder="请选择处理方式"
                class="filter-item"
                style="width: 200px"
              >
              
              <el-option
              v-for="item in select_type_list"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="custom-button"
                :disabled="sh_sign_id2"
                  @click="fn_save2"
              >
                确认
              </el-button>
            </el-form-item>

          </el-form>
          
        </div>

          <iframe
          width="100%"
          height="800px"
          style="border:none"
          v-bind:src="reportUrl"
         ></iframe>
        <!-- <el-pagination
          :current-page="formInline.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="formInline.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total"
          style="margin: 12px 0;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
        <AdForm ref="adFormRef" @reset="getAll" />
      </el-card>
    </div>
  </el-dialog>
</template>
  
  <script setup>
  import { Delete as ElIconDelete } from '@element-plus/icons-vue'
  import { delBlack, getIpBlackList, updateBlack } from '@/api/risk'
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router'
  import { 
    checkShenKuanPic_un,
    getlicPoDecision_result,
    getlicCheckSh_result,
    UPlicCheckReportsResult,
    getlicCheckSh_save,
    checkLicZcSh_result,
    updateLicZcResult
  } from '@/views/etds/licDqr/option'
  import { onMounted, ref, watch, defineProps, defineEmits} from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import LicqrDialog from './LicqrDialog.vue'
  
  
  const route = useRoute()
  
  // 接收父组件传递的弹窗显示和参数
  const props = defineProps({
    visible: Boolean,
    params: Object
  })
  const emit = defineEmits(['update:visible'])

  const visible = ref(props.visible)
  watch(() => props.visible, v => visible.value = v)
  watch(visible, v => emit('update:visible', v))

  //const sdisable = ref(true); // 定义响应式变量
  //const sdisable2 = ref(false);
  const sh_sign_id = ref(true)
  const sh_sign_id2 = ref(false)
  const showSelect = ref(false);
  const bc_result = ref('');
  const select_type_list = ref([]);
  const select_type = ref(1);
  const fakuan_type = ref('');
  const fakuan_list = ref([]);
  const selected = ref([]); // 用于 handleConfirm 中的选中项
  const confirmType = ref(''); // 用于 handleConfirm 中的 result
  const oid = ref('');
  const check_typenam = ref('');
  const reportUrl = ref('');

  // 你可以在这里用 props.params 初始化表单等
  function handleClose() {
    // 重置状态变量
  showSelect.value = false;
  bc_result.value = " ";
  fakuan_list.value='';
  //sdisable.value = true;
  //sdisable2.value = false;

    emit('update:visible', false)
  }
  
  // 定义所有字段
  const formInline = ref({
    checkoid: '',
    check_typenam: '',
    yingye_qc_result: '',
    b_sign_id: '',
    b_sign_id2: '',
    sh_address: '',
    sh_back: '',
    sh_bc_result: '',
    po_no: '',
    bc_seq: '',
    bc_qsname: '',
    bc_num: '',
    po_style: '',
    bc_checknum: '',
    bc_date: '',
    checker2: '',
    fact_code: '',
    attachkport_name: '',
    lic_typename: '',
    cust_code: '',
  })
  const tableLoading = ref(false)
  const total = ref(1)
  const tableData = ref([])
  

  function getAll () {
    tableLoading.value = true
    getIpBlackList(formInline.value).then(res => {
      tableData.value = res.data.list
      total.value = res.data.total
    }).finally(() => {
      tableLoading.value = false
    })
  }
  
  // 页码每页页数修改回调
  function handleSizeChange (val) {
    formInline.value.pageSize = val
    getAll(formInline.value)
  }
  
  function handleCurrentChange (val) {
    formInline.value.page = val
    getAll()
  }
  
  // 查询
  function search () {
    total.value = 1
    formInline.value.page = 1
    getAll()
  }
  
  function clear () {
    formInline.value = {
      ip: '', // 搜索字段
      state: '', // 是否启用 1-是 0-否
      page: 1, // 当前页
      pageSize: 10, // 每页记录数
    }
    getAll()
  }
  
  const adFormRef = ref()
  
  function add () {
    adFormRef.value.show()
  }
  
  function edit (row) {
    adFormRef.value.show(row)
  }
  
  async function del (id) {
    ElMessageBox.confirm('是否确认删除该内容？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delBlack({ id }).then((res) => {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
          getAll()
        })
      })
      .catch(() => {
        return false
      })
  }
  
  function toggle (id, state) {
    ElMessageBox.confirm(
      `${state ? '确定让选择项失效？' : '确定让选择项生效？'}`,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '我再想想',
        type: 'warning',
      }
    )
      .then(() => {
        updateBlack({
          id,
          state: state ? 0 : 1,
        }).then(({ data }) => {
          ElMessage({
            type: 'success',
            message: '操作成功!',
          })
          getAll()
        })
      })
      .catch(() => {
      })
  
   }
  
  async function fn_save1() {
  
  try {
    
      
    // 3. 验证不合格报告,因为2目前没存储，先跳过这一步
    if (bc_result.value === '不接受' && fakuan_type.value === '') {
      ElMessage.error('报告不合格，请选择问题');
      return;
    }
    
    // 5. 处理出口查货类型
    if (check_typenam.value === '出口查货') {
      await fn_save();
      return;
    }else{

    // 6. 处理普通联营抽查
    // const oid = JSON.parse(sessionStorage.getItem("sh_checkoid"));
    
     const params = { 
        oid: oid.value,
        fakuan_type: fakuan_type.value, 
      }

    // 7. 请求自查记录状态
    const res = await checkLicZcSh_result(params);
    const msg = res.data.result.msg;
      //  const msg = '1';
    // 8. 根据状态处理逻辑
    switch (msg) {
      case '0': // 无记录
        await fn_save();
        break;
      case '1': // 有记录无审阅
        await fn_update_zc(1);
        await fn_save();
        break;
      case '2': // 有记录且结果不一致
        if (confirm('该款已有自查结果，但与本次审核结果不一致，是否覆盖？')) {
          await fn_update_zc(1);
          await fn_save();
        } else {
          await fn_update_zc(0);
          await fn_save();
        }
        break;
      case '3': // 完全一致
        await fn_save();
        break;
      default:
        throw new Error(`未知响应状态: ${msg}`);
    }
    //ElMessage.success("确认:",msg);
   }
  } catch (error) {
    console.error('保存失败:', error);
    //this.$util.showError(`操作失败: ${error.message}`);
  }
}

async function fn_save2() {
          // var is_show=""
          // if (sessionStorage.getItem("is_sqs")==1 || sessionStorage.getItem("is_sqs")=='1')
          //  {
          //    is_show="true"

          //  }
          // else
          //  {
          //    is_show="false" 
          //  }  
           
          // if (is_show!="true")
          // {
          //   this.$util.showError('非联营业务/联营款账号不能确认')
          //   return
          // }
            
          //this.$router.push({path:'/lichome2'})  
         
        const user_name = localStorage.getItem("username");
       const params = { 
        checkoid: oid.value,
        check_typenam: check_typenam.value,
        confirmstate: '1',
        bc_factApply: user_name,
        select_type: showSelect.value ? select_type.value.toString() : null,
       }; 
       const res =await UPlicCheckReportsResult(params)

        if(res.data.result.msg == '1'){
                ElMessage.success("确认成功");
                //sessionStorage.setItem('sh_sign_id2',true);
                sh_sign_id2.value = true;
                await refreshOptions();
  
        } else
              {
                ElMessage.error("确认失败！");
              }  
         
       }

  
  async function fn_save() {
  

  // 2. 统一使用解构赋值和const声明变量
  //const oid = JSON.parse(sessionStorage.getItem("sh_checkoid"));
  const user_name = localStorage.getItem("username");

  // // 3. 参数校验前置
  if (!oid || !user_name || !check_typenam) {
    ElMessage.error("缺少必要参数");
    return;
  }

  const params = {
      oid: oid.value,//获取列表
      sign_id: user_name,             //用户ID
      check_typenam: check_typenam.value,  //报告类型（出口查货/联营自查）
      fakuan_type: fakuan_type.value ? fakuan_type.value.toString() : null,//用户选择的问题类型
    }

  try {
   //5.
    const res = await getlicCheckSh_save(params);
    const msg = res.data.result;


    // 6. 提前返回策略
    if (msg !== '0') {
      ElMessage.error('审阅失败');
      return;
    }

    // 7. 成功处理逻辑
    ElMessage.success('审阅成功');
    sh_sign_id.value=ture;
    // sessionStorage.setItem('sh_sign_id', 'true');  // 存储为字符串类型  不知咋处理，先放着
  

  } catch (error) {
    // 8. 统一错误处理
    console.error('保存请求异常:', error);
  }
}

  async function fn_update_zc (type) {
    try {

      ElMessage.success('审阅成功');
    // 2. 获取用户ID（安全读取）
     const username = localStorage.getItem("username");

    if (!username) {
      throw new Error("未获取到用户ID");
    }

    // 3. 构建请求体
     const params= {
        oid: oid.value,
        fakuan_type:fakuan_type.value,
        type: type,
        sign_id: username,
      }


    // 4. 发起异步请求
    const res = await updateLicZcResult(params);

    // 5. 根据类型处理成功响应
    if (res.data.result === 1) {
      ElMessage.success("已把力佳抽查记录同步更新至联营自查记录");
    }
    
   } catch (error) {
    // 6. 统一错误处理
    console.error("更新自查结果失败:", error);
    ElMessage.error(`操作失败: ${error.message || "未知错误"}`);
   }
  }

  
  const router = useRouter()
  function goBack() {
    router.push('/etds/licDqr')
  }

onMounted(async () => {
  await initData(); // 把原来的逻辑封装成initData函数
});

// 新增：监听弹窗显示状态，每次打开时重新初始化
watch(
  () => visible.value,
  async (newVal) => {
    if (newVal) { // 当弹窗从关闭→打开时
      await initData(); // 重新执行初始化逻辑
    }
  }
);

//独立的选项刷新函数（核心逻辑）
async function refreshOptions() {
  select_type.value = null;
  fakuan_type.value =null;
  try {
    if (sh_sign_id2.value) { 
      select_type_list.value = [
        { label: '返修', value: 0 },
        { label: '不再上架', value: 1 },
        { label: '重审', value: 2 }
      ];

      const params = { 
        oid: oid.value,
        check_typenam: check_typenam.value,
      }; 
      
       const res1 = await getlicPoDecision_result(params);
       const res1Result = res1.data.result;
       if (res1Result && typeof res1Result !== 'object') {
         showSelect.value = true;
         const result = res1.data.result;
         // 先判断是否为有效数字（字符串数字或数字）
         const isNumber = !isNaN(Number(result));
         select_type.value = isNumber ? Number(result) : 1;
       } else {
         showSelect.value = false;
       }
       
      if (sh_sign_id.value) { 
        const res2 = await getlicCheckSh_result(params);
        if (res2.data && res2.data.result) {
         // 判断 type 是否为“字符串/数字”（即有效类型），否则设为空字符串
          fakuan_type.value = (typeof res2.data.result.type === 'string') ? res2.data.result.type : '';
          fakuan_list.value = res2.data.result.option;
        } 
      } else {
        const res2 = await getlicCheckSh_result({ oid:"null"});
        if (res2.data && res2.data.result) {
          fakuan_list.value = res2.data.result.option;
        } 
      }
    } else {
      const params = { oid: oid.value };
      const res = await checkShenKuanPic_un(params);
      
      if (res.data.result === '1') {
        select_type_list.value = [
          { label: '不再上架', value: 1 },
          { label: '重审', value: 2 }
        ];
        showSelect.value = true;
      } else {
        select_type_list.value = [
          { label: '返修', value: 0 },
          { label: '不再上架', value: 1 }
        ];
      }
    }

      //初始化确定下拉框
  } catch (error) {
    console.error('刷新选项失败:', error);
    ElMessage.error('刷新数据失败，请重试');
  }
}

// 把原来onMounted里的逻辑抽成独立函数，方便复用
async function initData() {

  // 从props初始化表单数据
  Object.keys(formInline.value).forEach(key => {
    if (props.params && props.params[key] !== undefined) {
      formInline.value[key] = props.params[key];
    }
  });

  // 初始化状态变量
  //sdisable.value = props.params?.sdisable || false;
  //sdisable2.value = props.params?.sdisable2 || false;
  bc_result.value = props.params?.bc_result || "";

  // 获取props中的参数（关键：给响应式变量赋值）
  const { 
    sh_sign_id2: paramsShSignId2, // 从props提取
    sh_sign_id: paramsShSignId,
    oid: paramsOid,
    check_typenam: paramsCheckTypenam,
    sh_address: paramsShAddress
  } = props.params || {};

  // 给响应式变量赋值（重要：模板中用的是这些变量）
  sh_sign_id2.value = paramsShSignId2;
  sh_sign_id.value = paramsShSignId;
  oid.value = paramsOid;
  check_typenam.value = paramsCheckTypenam;
  reportUrl.value =paramsShAddress;

  console.log('props.params:', props.params);

  // 初始化处理方式显示状态
  if (bc_result.value === '不接受') {  
    showSelect.value = true;
  } else {
    showSelect.value = false; // 补充：不满足时隐藏
  }

  // 接口调用逻辑
  await refreshOptions();

}


   
  </script>
  
  <style lang="scss" scoped>
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
  .search-panel {
    margin-bottom: 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
  }
  .table-footer {
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .table-footer > * {
    margin-right: 8px;
  }
  .custom-button {
    min-width: 90px;
  }
  .dataTable {
    margin-top: 16px;
  }
  .back-btn {
    position: static;
    margin-bottom: 0;
  }
  </style>
  
  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  </style>