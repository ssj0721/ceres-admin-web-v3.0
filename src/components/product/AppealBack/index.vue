<template>
    <div>
      <el-dialog v-model="appealBackVisible" title="申请取回" :close-on-click-modal="false" center width="650px"
          @close="closeModal">
          <el-form :inline="true" :model="form" label-width="100px" ref="formItem" class="cancelform" v-loading="appealBackLoading">
              <el-form-item label="取回意见" required>
                  <el-input
                    v-model="form.reviewComments"
                    class="size"
                    :autosize="{ minRows: 10}"
                    type="textarea"
                    placeholder="请输入取回意见"
                  />
              </el-form-item>
              <el-form-item label="取回原因" required>
                <el-select v-model="form.rejectReasonId" placeholder="请输入取回原因" size="large" class="size" clearable>
                  <el-option v-for="item in rejectReasons" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <div style="display:flex;justify-content:flex-end">
                  <el-button type="primary" @click="requestRetrieval">确定</el-button>
                  <el-button type="primary" @click="closeModal">取消</el-button>
              </div>
          </el-form>
        </el-dialog>
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, nextTick, reactive, watch, toRefs } from 'vue'
    import { ElLoading,ElMessage } from 'element-plus'
    import { getRejectReasons,appealBack } from '@/api/itemaudit/ait001'
  
    const prop = defineProps({
      appealBackVisible: {
          type: Object,
          default : () => false,
      },
      selectList: {
          type: Array,
          default : () => [],
      },
      //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
      //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
      modelValue: {
          type: Array,
          default : () => []
      } 
  });
  
  const {appealBackVisible,selectList} = toRefs(prop);
  const emits = defineEmits(['update:appealBackVisible','getAll']);
  
  const form = ref({
      reviewComments:"",
      rejectReasonId:""
  })
  
  const appealBackLoading = ref(false)
  const rejectReasons = ref([])
  
  watch(() => appealBackVisible.value, (nVal, oVal) => {
    console.log('触发了appealBackVisible的监听', nVal);
    if (nVal) {
        queryRejectReasons()
    }
  });
  
  function closeModal(){
      console.log('触发了关闭申请取回弹窗');
      form.value = {
          reviewComments:"",
          rejectReasonId:""
      }
      appealBackVisible.value = false
      emits("update:appealBackVisible", false)
  }
  
function queryRejectReasons(){
  getRejectReasons().then(res => {
    //申请取回原因和否决原因的列表一样
    rejectReasons.value = res.data
  })
}
  
  function requestRetrieval(){
      console.log('申请取回的form',form.value,form.value.rejectReasonId);
      if (form.value.rejectReasonId == "" || form.value.rejectReasonId == undefined) {
        ElMessage.error("取回原因不能为空");
        return;
      }
      const newselectList = selectList.value.map((item) => {
          return {
            ...item,
            rejectReasonId: form.value.rejectReasonId || "未知原因取消",
            reviewComments: form.value.reviewComments,
          };
        });
      console.log('申请取回的list',selectList.value,newselectList);
      let param = {
          selectList: newselectList,
          singleSelect: false,
      }
      appealBackLoading.value = true
      appealBack(param).then((res)=>{
          console.log('申请取回的res',res);
          if(res.code == ""){
              ElMessage.success("申请取回成功")
              appealBackLoading.value = false
              closeModal()
              emits('getAll');
          }
      })
  }
  </script>
  
  <style lang="scss" scoped>
  .size{
    width: 90%;
  }
  
  .cancelform{
      :deep(.el-form-item){
          width: 600px;
      }
  }
  </style>