<script setup>
import { useLicZcStore } from '@/stores/licZcStore'
import { useRoute } from 'vue-router'

import { computed } from 'vue'
// 表单数据
const route = useRoute()
const licZcStore = useLicZcStore()

// 判断是否是新增模式
const isAdd = computed(() => route.query.mode === 'add')

// 判断是否已送审
const isSubmitted = computed(() => licZcStore.checkFormData?.sconfirm === '已送审')

// 控制整体禁用状态
const isDisabled = computed(() => {
  // 新增模式下不禁用
  if (isAdd.value) {
    return false
  }
  // 如果是工厂报告或已送审,则禁用
  return licZcStore.disabledGcReport || isSubmitted.value
})

const problemForm = computed({
  get: () => licZcStore.problemFormData,
  set: val => licZcStore.updateProblemForm(val),
})

</script>

<template>
  <div class="container">
    <div class="content-area">
      <div class="problem-section">
        <el-row>
          <!-- 标签部分 -->
          <el-col :sapn="4">
            <span class="label-text">
              问题及跟进:
            </span>
          </el-col>
          <!-- 文本框部分 -->
          <el-col :sapn="18">
            <el-input
            v-model="problemForm.foreign"
              type="textarea"
              :rows="8"
              placeholder="请输入跟进问题"
              class="problem-textarea"
              resize="vertical"
              :disabled="isDisabled"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: $container-base-padding-2;
}

.content-area {
  background-color: $neutral-color-1;
  border-radius: $border-radius-medium;
  padding: $container-base-padding-3;
  box-shadow: $shadow-1;
}

.problem-section {
  .label-text {
    display: block;
    color: $secondary-text-color;
    font-size: $font-size-base;
    line-height: 1.5;
    padding: $container-base-padding-2 0;

    @media screen and (max-width: 768px) {
      padding: $container-base-padding-4 0;
    }
  }

  :deep(.problem-textarea) {
    .el-textarea__inner {
      min-height: 200px;
      padding: $container-base-padding-2 $container-base-padding-4;
      border: 1px solid #dcdfe6;
      border-radius: $border-radius-mini;
      font-size: $font-size-base;
      line-height: 1.5;
      color: $primary-text-color;

      &::placeholder {
        color: $placeholder-text-color;
      }

    }
  }
}
</style>

