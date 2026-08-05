<template>
    <basic-container class="container">
      <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm038</div>
    <div class="pending">
      <!-- 搜索 -->
      <mybottons>
        <el-form :inline="true" :model="searchData">
            <el-form-item label="品种">
              <el-select v-model="searchData.deps" placeholder="请选择品种" clearable multiple size="large" style="width: 200px">
                <el-option v-for="dep in depList" :key="dep.id" :label="dep.name" :value="dep.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="联营商">
              <selectAll v-model="searchData.orgcodes" :multiple="true" :placeholder="'请选择联营商'" :options="merchants" :valchoose="'code'" style="width: 200px"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="handle">处理</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
      </mybottons>
      <!-- 表格 -->
      <div class="second-main-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          :header-cell-style="{ 'background': '#EEF3FF', 'color': '#333333' }"
          tooltip-effect="dark"
          :style="{ 'width': '100%' }"
          class="dataTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="序号" width="100">
            <template #default="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column prop="depName" label="品种名称">
            <template #default="scope">
                <span>{{ depList.find(item => item.id === scope.row.depId)?.name || '未知品种' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isMainPic" label="是否搜主图">
            <template #default="scope">
                <span>{{scope.row.isMainPic == 1 ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mainPicCount" label="主图张数" />
          <el-table-column prop="isFuPic" label="是否搜附图">
            <template #default="scope">
                <span>{{scope.row.isFuPic == 1 ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fuPicCount" label="附图张数" />
          <el-table-column prop="orgname" label="所属联营商" />
          <el-table-column prop="created" label="创建时间" width="170"/>
          <el-table-column prop="creater" label="创建人" />
          <el-table-column prop="modified" label="修改时间" width="170"/>
          <el-table-column prop="modifier" label="修改人" />
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <div class="btnList">
                <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
                <el-popconfirm title="确认删除？" @confirm="del(scope.row)">
                  <template #reference>
                    <el-button type="danger" link>删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="searchData.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
  
      <!-- *************对话框开始************* -->
      <!-- 新增可搜图品种 -->
      <el-dialog
        v-model="addFormDialog"
        :title="userState ? '新增可搜图品种' : '修改可搜图品种'"
        width="30%"
        center
        :close-on-click-modal="false"
        @closed="onClosed"
      >
        <!-- 新增可搜图品种 -->
        <div>
          <el-form
            ref="formRef"
            :model="addForm"
            label-width="130px"
            :rules="userRules"
          >
            <el-form-item label="选择品种" prop="depIds">
                <el-select v-model="addForm.depIds" placeholder="请选择品种" multiple clearable size="large" style="width: 400px" :disabled="!userState" collapse-tags collapse-tags-tooltip :max-collapse-tags="4">
                    <el-option v-for="dep in depList" :key="dep.id" :label="dep.name" :value="dep.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="选择联营商" prop="orgname">
              <selectAll v-model="addForm.orgcodes" :multiple="true" :placeholder="'请选择联营商'" :options="merchants" :valchoose="'code'" :disabled="!userState"/>
                <!-- <el-select v-model="addForm.orgcodes" placeholder="请选择联营商" clearable multiple size="large" style="width: 300px" :disabled="!userState">
                    <el-option v-for="org in merchants" :key="org.id" :label="org.name" :value="org.code" />
                </el-select> -->
            </el-form-item>
            <el-form-item label="是否可搜主图" prop="isMainPic">
                <el-switch
                  v-model="addForm.isMainPic"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  size="large"
                  width="80px"
                />
            </el-form-item>
            <el-form-item label="主图可搜数量" prop="mainPicCount" v-if="addForm.isMainPic">
              <el-input-number v-model="addForm.mainPicCount" :min="1" :max="1" disabled/>
            </el-form-item>
            <el-form-item label="是否可搜附图" prop="isFuPic">
                <el-switch
                  v-model="addForm.isFuPic"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  size="large"
                  width="80px"
                />
            </el-form-item>
            <el-form-item label="附图可搜数量" prop="fuPicCount" v-if="addForm.isFuPic">
              <el-input-number v-model="addForm.fuPicCount" :min="1" :max="5"/>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addFormDialog = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="addForm_enter(formRef)">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="handleDialog"
        title="批量处理是否关闭或开启该品种的搜图权限"
        width="30%"
        center
        :close-on-click-modal="false"
        @handleClose="handleClosed"
      >
        <div style="">根据查询条件，请选择是开启或关闭这些品种和联营商的搜图权限</div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="openOrClose(1)">开启权限</el-button>
            <el-button type="primary" @click="openOrClose(0)">关闭权限</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    </basic-container>
  </template>
  
  <script setup>
    import { ref, onBeforeMount, watch } from 'vue'
    import { queryDepData01} from '@/api/itemaudit/ait001'
    import { picDepAdd,getAllData,picDepUpdate,picDepDelete,updateBySearchData} from '@/api/searchpicDep'
    import { ElMessage,ElMessageBox } from 'element-plus'
    import { getGylMerchants } from '@/api/merchants/merchantsList'
    
    const formRef = ref(null)
    const tableLoading = ref(false)
    const submitLoading = ref(false)
    const searchData = ref({
      deps:[],
      orgcodes:[],
      state:1,
      page: 1, // 当前页
      pageSize: 10, // 每页记录数
    })
    const total = ref(1)
    const tableData = ref([])
    const userState = ref(1)
    const addForm = ref({
      id:0,
      depIds:[],
      orgcodes:[],
      isMainPic:true,  //是否搜主图
      mainPicCount: 1, // 规格名称
      isFuPic: true, // 可搜图品种代码
      fuPicCount:0  //颜色id
    })
    const addFormDialog = ref(false)
    const userRules = ref({
      depIds: [
        { required: true, message: '请输入品种', trigger: 'blur' },
      ]
    })
    const handleDialog = ref(false)
    
    onBeforeMount(() => {
        getAll()
        queryDep01()
        queryMerchants()
    })

    let depList = ref([]);
    function queryDep01() {
      queryDepData01().then(res => {
        depList.value = res.data
      })
    }

    let merchants = ref([]);
    function queryMerchants(){
      getGylMerchants().then((res) => {
        console.log("获取联营商",res)
        if (res.code === '') {
          merchants.value=res.data
          console.log("联营商列表",merchants.value)
        }
      })
    }
  
    // 方法集合
    const handleSizeChange = (val) => {
      searchData.value.pageSize = val
      getAll()
    }
    const handleCurrentChange = (val) => {
      searchData.value.page = val
      getAll()
    }
    // 查询
    const search = () => {
      total.value = 1
      searchData.value.page = 1
      getAll()
    }
    // 新增可搜图品种
    const add = () => {
      userState.value = 1
      addFormDialog.value = true
      addForm.value ={
        id:0,
        depIds:[],
        isMainPic:true,  //是否搜主图
        mainPicCount: 1, // 规格名称
        isFuPic: true, // 可搜图品种代码
        fuPicCount:0  //颜色id
     }
    }
    
    // 确认新增可搜图品种
    const addForm_enter = async (formEl) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          submitLoading.value = true
          if(addForm.value.depIds.length==0){
            ElMessage.warning("请选择品种")
            return
          }
          let param = {
            id:addForm.value.id,
            depIds:addForm.value.depIds,
            orgcodes:addForm.value.orgcodes,
            isMainPic:addForm.value.isMainPic?1:0,
            mainPicCount: addForm.value.mainPicCount,
            isFuPic: addForm.value.isFuPic?1:0,
            fuPicCount:addForm.value.fuPicCount
          }
          if (userState.value) {
            picDepAdd(param).then((res) => {
              console.log('新增保存的res',res);
              if (res.code === '') {
                ElMessage({
                  message: '新增成功',
                  type: 'success',
                })
              getAll()
              addFormDialog.value = false
              }
              else{
                ElMessage.error(res.message)
              }
            }).finally(() => {
              submitLoading.value = false
            })
          } else {
            picDepUpdate(param).then((res) => {
              console.log('编辑保存的res',res);
              if (res.code === '') {
                ElMessage({
                  message: '修改成功',
                  type: 'success',
                })
              getAll()
              addFormDialog.value = false
              }
              else{
                  ElMessage.error(res.message)
              }
            }).finally(() => {
              submitLoading.value = false
            })
          }
        } else {
          return false
        }
      })
    }
    // 弹窗关闭
    const onClosed = () => {
      formRef.value.resetFields()
    }
    // 编辑可搜图品种
    const edit = (row) => {
      userState.value = 0
      addFormDialog.value = true
      addForm.value.id = row.id
      addForm.value.depIds = [row.depId]
      let orgcodes = []
      orgcodes.push(row.orgcode)
      addForm.value.orgcodes = orgcodes
      addForm.value.isMainPic = row.isMainPic==1?true:false
      addForm.value.mainPicCount =row.mainPicCount
      addForm.value.isFuPic = row.isFuPic==1?true:false
      addForm.value.fuPicCount =row.fuPicCount
    }

    // 删除可搜图品种
    const del = async (row) => {
      ElMessageBox.confirm(
        '此操作将永久删除该可搜图品种, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
            let param = {
                id: row.id
            }
            picDepDelete(param).then((res) => {
            if (res.code === '') {
              ElMessage({
                type: 'success',
                message: '删除成功!',
              })
            }
            getAll()
          })
        })
        .catch(() => {})
    }
    
    // 初始化查询所有数据
    const getAll = async () => {
      tableLoading.value = true
      try {
        const res = await getAllData(searchData.value)
        tableData.value = res.data.list
        total.value = res.data.total
      } finally {
        tableLoading.value = false
      }
    }

    const handle = () => {
      handleDialog.value = true
    }

    const handleClose = () => {
      handleDialog.value = false
    }

    const openOrClose = (val) => {
      searchData.value.state = val
      if(searchData.value.deps.length==0&&searchData.value.orgcodes.length==0){
        ElMessage({
            message: '请在查询条件里选择你要处理的品种或联营商',
            type: 'error',
          })
      }else{
        updateBySearchData(searchData.value).then((res)=>{
          if (res.code === '') {
            ElMessage({
              message: '处理成功',
              type: 'success',
            })
          getAll()
          handleDialog.value = false
          }
        })
      }
    }

    const reset = () => {
      searchData.value = {
        deps:[],
        orgcodes:[],
        state:1,
        page: 1, // 当前页
        pageSize: 10, // 每页记录数
      }
      getAll()
    }
    </script>
    
    <style lang="scss" scoped>
    .userStyle {
      padding: 20px;
      margin-top: 20px;
      background-color: #FFFFFF;
    }
    .el-tree {
      width: 100%;
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
    
    .pending {
      padding: 16px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      // margin-top: 20px;
      // background-color: #FFFFFF;
      width: 100%;
      margin:24px;
      // margin-left:24px;
    }
    
    </style>