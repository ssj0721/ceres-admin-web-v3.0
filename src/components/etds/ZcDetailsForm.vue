<script setup>
/**
 * @param {object} modelValue 表单数据对象
 * @param {object} formConfig 表单配置对象
 */
/**
 * 
 *   {
     type: 'select' | 'date' | 'number' | 'text',
     prop: '属性名',
     label: '标签名',
     disabled: true | false,
     placeholder: '占位文本',
     input: (value) => void, // 输入事件处理函数
     rules: { required: true, message: '必填项' }, // 校验规则
     // select 类型特有
     dicData: [{ label: '选项1', value: '1' }],
     // date 类型特有
     valueFormat: 'YYYY-MM-DD'
   }
 */

import { ref, computed } from 'vue'

const modelType = ['object', 'array', 'string', 'number', 'boolean', 'date']
const model = defineModel()
const formRef = ref(null)

const props = defineProps({
  formConfig: {
    type: Object,
    default: () => ({
      labelSpan: 12, // 标签列宽度
      valueSpan: 12, // 值列宽度
      showHeader: true, // 是否显示表头
      headerConfig: {
        labelText: '字段',
        valueText: '内容',
      },
      columns: [], // 列配置
      disabled: false, // 全局禁用配置
    }),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 生成表单校验规则
const rules = computed(() => {
  const result = {}
  props.formConfig.columns.forEach(column => {
    if (column.rules) {
      result[column.prop] = column.rules
    }
  })
  return result
})

// 表单校验方法
const validate = async () => {
  if (!formRef.value) return true
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

// 重置表单校验
const resetValidation = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 对外暴露方法
defineExpose({
  validate,
  resetValidation
})

// 处理输入事件
function handleInput (column, value) {
  // 如果配置了input处理函数，则调用
  if (column.input && typeof column.input === 'function') {
    column.input(value)
  }
}

// 处理选择事件
function handleSelect (column, value) {
  if (column.change && typeof column.change === 'function') {
    column.change(value)
  }
}

// 处理日期选择事件
function handleDateChange (column, value) {
  if (column.change && typeof column.change === 'function') {
    column.change(value)
  }
}
</script>

<template>
  <div class="zc-detail-form">
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
    >
      <div class="detail-table">
        <!-- 表头 -->
        <el-row v-if="formConfig.showHeader">
          <el-col :span="formConfig.labelSpan" class="table-header">
            {{ formConfig.headerConfig?.labelText || '字段' }}
          </el-col>
          <el-col :span="formConfig.valueSpan" class="table-header">
            {{ formConfig.headerConfig?.valueText || '内容' }}
          </el-col>
        </el-row>

        <!-- 表格内容 -->
        <el-row
          v-for="(column, index) in formConfig.columns"
          :key="index"
        >
          <template v-if="!column.hidden || !column.hidden(model)">
            <el-col
              :span="formConfig.labelSpan"
              class="table-cell"
            >
              <slot
                v-if="column.labelSlot"
                :name="column.labelSlot"
                :row="model"
                :column="column"
              ></slot>
              <template v-else>
                {{ column.label }}
                <span v-if="column.rules?.required" class="required-mark">*</span>
              </template>
            </el-col>
            <el-col
              :span="formConfig.valueSpan"
              class="table-cell"
            >
              <el-form-item
                :prop="column.prop"
                :rules="column.rules"
              >
                <!-- 自定义渲染插槽 -->
                <slot
                  v-if="column.slot"
                  :name="column.slot"
                  :row="model"
                  :column="column"
                ></slot>
                <!-- 默认渲染表单控件 -->
                <template v-else>
                  <!-- 选择器 -->
                  <el-select
                    v-if="column.type === 'select'"
                    v-model="model[column.prop]"
                    :disabled="column.disabled || formConfig.disabled || disabled"
                    :placeholder="column.placeholder || `请选择${column.label}`"
                    @change="(val) => handleSelect(column, val)"
                  >
                    <el-option
                      v-for="item in column.dicData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>

                  <!-- 日期选择器 -->
                  <el-date-picker
                    v-else-if="column.type === 'date'"
                    v-model="model[column.prop]"
                    type="date"
                    :disabled="column.disabled || formConfig.disabled || disabled"
                    :placeholder="column.placeholder || `请选择${column.label}`"
                    :value-format="column.valueFormat || 'YYYY-MM-DD'"
                    @change="(val) => handleDateChange(column, val)"
                  />

                  <!-- 默认输入框 -->
                  <el-input
                    v-else
                    v-model="model[column.prop]"
                    :type="column.type === 'number' ? 'number' : 'text'"
                    :disabled="column.disabled || formConfig.disabled || disabled"
                    :placeholder="column.placeholder || `请输入${column.label}`"
                    :maxlength="column.maxlength"
                    @input="(val) => handleInput(column, val)"
                  />
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.zc-detail-form {
  .detail-table {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: $shadow-2;
    border: 1px solid #eee;

    .table-header {
      background-color: #f5f7fa;
      padding: 12px;
      font-size: 14px;
      color: #606266;
      font-weight: bold;
      border: 1px solid #eee;
    }

    .table-cell {
      padding: 12px;
      border-bottom: 1px solid #eee;
      border-right: 1px solid #eee;

      &:last-child {
        border-right: none;
      }

      .required-mark {
        color: #f56c6c;
        margin-left: 4px;
        font-size: 16px;
      }

      :deep(.el-form-item) {
        margin-bottom: 0;

        .el-form-item__error {
          position: absolute;
          top: 100%;
          left: 0;
        }
      }

      :deep(.el-input),
      :deep(.el-select),
      :deep(.el-date-picker) {
        width: 100%;

        .el-input__wrapper {
          padding: 1px 11px;
          height: 32px;
          line-height: 32px;

          &.is-disabled {
            background-color: #f5f7fa;
            color: #909399;
          }
        }

        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>