<template>
  <div>
    <!-- 错误信息 -->
    <el-dialog v-model="errorDialogVisable" title="错误信息" :close-on-click-modal="false" center width="600px"
      @close="closeModal">
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="300"
        class="errorTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column prop="itemcode" label="款号"/>
        <el-table-column prop="error" label="错误信息"/>
      </el-table>
      <div style="display:flex; justify-content:flex-end; padding-top:10px">
        <el-button type="primary" @click="closeModal">确认</el-button>
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
  
  const prop = defineProps({
    errorDialogVisable: {
      type: Object,
      default : () => false,
    },
    tableData: {
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
  
  const {errorDialogVisable,tableData} = toRefs(prop);
  const emits = defineEmits(['update:errorDialogVisable']);
  
  function closeModal() {
    console.log("点x退出")
    tableData.value = []
    errorDialogVisable.value = false
    emits("update:errorDialogVisable", false)
    // getAll()
  }
  
  </script>
  
  <style scoped lang="scss">
  .errorTable{
    :deep(.el-table__row){
      height: 40px;
    }
  }
  </style>