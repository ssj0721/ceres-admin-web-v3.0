<template>
  <div>
    <!-- 导出 -->
    <el-dialog v-model="exportDialogVisable" title="导出选项" :close-on-click-modal="false" center width="520px"
      @close="closeModal">
      <div style="margin:40px 0 60px 40px; font-size:large">
        导出图片：<el-switch v-model="incImage" active-text="是" inactive-text="否" size="large"/>
      </div>
      <div style="display:flex; justify-content:flex-end">
        <el-button type="primary" @click="exportOk">确认</el-button>
        <el-button @click="closeModal">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick, reactive, watch, toRefs } from 'vue'
  import { getToken } from '@/utils/auth'
  import { uploadUrl } from '@/utils/request'
  import { ElLoading,ElMessage } from 'element-plus'
  import { excel } from '@/utils/excelExport'
  import { dataExport} from '@/api/itemaudit/ait002'
  
  const prop = defineProps({
    exportDialogVisable: {
      type: Object,
      default : () => false,
    },
    multipleSelection: {
      type: Array,
      default : () => []
    },
    //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
    //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
    modelValue: {
      type: Array,
      default : () => []
    } 
  });
  
  const {exportDialogVisable,multipleSelection} = toRefs(prop);
  const emits = defineEmits(['update:exportDialogVisable']);
  const incImage = ref(true)

  function exportOk() {
    let param = {
      incImage:incImage.value,
      selectList:multipleSelection.value
    }
    var loading = ElLoading.service({ fullscreen: true })
    dataExport(param).then(res=>{
      console.log('导出的res',res);
      if(res.message=='success'&&res.code==""){
        ElMessage.success("导出成功")
        let base64 = res.data.base64
        let filename = res.data.fileName
        excel.excelExport(filename, base64, '.xlsm')
        emits("update:exportDialogVisable", false)
      }else{
        ElMessage.error(res.message)
      }
    }).finally(() => {
      loading.close();
    })
  }
  
  function closeModal() {
    console.log("点x退出")
    incImage.value = true
    multipleSelection.value = []
    exportDialogVisable.value = false
    emits("update:exportDialogVisable", false)
    // getAll()
  }
  
  </script>
  
  <style scoped>
  
  </style>