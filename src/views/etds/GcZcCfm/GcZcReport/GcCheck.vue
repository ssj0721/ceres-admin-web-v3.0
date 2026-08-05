<script setup>
import { ref, computed } from 'vue'
import { licZcCheckFormOption } from './option'
import ZcDetailsForm from '@/components/etds/ZcDetailsForm.vue'
import { useGcZcStore } from '@/stores/GcZcStore'

const gcZcStore = useGcZcStore()

const formData = computed({
  get: () => gcZcStore.GcCheckData,
  set: val => gcZcStore.updateGcCheckData(val),
})

// TODO: 初始化数据
function initData () {
}

</script>

<template>
  <div class="check-container">
    <div class="content-area">
      <ZcDetailsForm
        v-model="formData"
        :form-config="licZcCheckFormOption"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.check-container {
  height: 100%;

  .content-area {
    padding: 20px;
    height: 100%;

    :deep(.avue-form) {
      background-color: #fff;
      min-height: 200px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: $shadow-1;

    }
  }
}

</style>

