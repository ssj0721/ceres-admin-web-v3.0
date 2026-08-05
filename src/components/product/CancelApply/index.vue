<template>
  <div>
    <el-dialog v-model="cancelApplyVisible" title="作废申请" :close-on-click-modal="false" center width="650px"
        @close="closeModal">
        <el-form :inline="true" :model="form" label-width="100px" ref="formItem" class="cancelform" v-loading="cancelApplyLoading">
            <el-form-item label="作废意见" required>
                <el-input
                  v-model="form.reviewComments"
                  class="size"
                  :autosize="{ minRows: 10}"
                  type="textarea"
                  placeholder="请输入作废意见"
                />
            </el-form-item>
            <el-form-item label="作废原因" required>
              <el-select v-model="form.cancelReasonId" placeholder="请输入作废原因" size="large" class="size" clearable>
                <el-option v-for="item in cancelreasonlist" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <div style="display:flex;justify-content:flex-end">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button type="primary" @click="closeModal">取消</el-button>
            </div>
        </el-form>
      </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, reactive, watch, toRefs } from 'vue'
  import { ElLoading,ElMessage } from 'element-plus'
  import { querySysDictData,stateCancel} from '@/api/itemaudit/ait001'

  const prop = defineProps({
    cancelApplyVisible: {
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

const {cancelApplyVisible,selectList} = toRefs(prop);
const emits = defineEmits(['update:cancelApplyVisible','getAll']);

const form = ref({
    reviewComments:"",
    cancelReasonId:""
})

const cancelApplyLoading = ref(false)
const cancelreasonlist = ref([])

watch(() => cancelApplyVisible.value, (nVal, oVal) => {
  console.log('触发了cancelApplyVisible的监听', nVal);
  if (nVal) {
    getCancelreasonlist()
  }
});

function closeModal(){
    console.log('触发了关闭作废申请弹窗');
    form.value = {
        reviewComments:"",
        cancelReasonId:""
    }
    cancelApplyVisible.value = false
    emits("update:cancelApplyVisible", false)
}

function getCancelreasonlist(){
    querySysDictData("biz.itemdraft.CanceledReason").then(res => {
        cancelreasonlist.value = res.data
    })
}

function confirm(){
    console.log('作废申请的form',form.value);
    if (form.value.reviewComments == "") {
      ElMessage.error("作废意见不能为空");
      return;
    }
    if (form.value.cancelReasonId == "" || form.value.cancelReasonId == undefined) {
      ElMessage.error("作废原因不能为空");
      return;
    }
    let param = {
        idea: form.value.reviewComments,
        selectList: selectList.value,
        singleSelect: false,
        remark: form.value.cancelReasonId || "未知原因取消",
    }
    cancelApplyLoading.value = true
    stateCancel(param).then((res)=>{
        console.log('作废申请的res',res);
        if(res.code == ""){
            ElMessage.success("作废申请成功")
            cancelApplyLoading.value = false
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