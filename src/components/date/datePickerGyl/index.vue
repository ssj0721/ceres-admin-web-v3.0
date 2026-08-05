<template>
    <div class="block">
      <el-date-picker
        v-model="datetime"
        type="datetimerange"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :format="format"
        :value-format="valueFormat"
        :shortcuts="shortcuts"
        :size="size"
        :clearable="clearable"
      />
    </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, shallowRef, watch } from 'vue';

const prop = defineProps({
    defaultTimeType: {
        type: String,
        default : () => ''
    },
    clearable:{
        type: Boolean,
        default: () => true
    },
    //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
    //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
    modelValue: {
        type: Array,
        default : () => []
    }
});

const {defaultTimeType,clearable} = toRefs(prop);

const emits = defineEmits(['update:modelValue']);

const size = ref<'default' | 'large' | 'small'>('default')
const format = ref("YYYY-MM-DD HH:mm:ss")
const valueFormat = ref("YYYY-MM-DD HH:mm:ss")

let datetime = ref(["", ""])
const shortcuts = ref([
          {
            text: "最近一周",
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setDate(start.getDate() - 7)
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                return [start, end]
            },
          },
          {
            text: "最近一个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 1)
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "最近三个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 3)
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "最近半年",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "最近一年",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 12)
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "未来一周",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setDate(end.getDate() + 7)
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "未来一个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setMonth(end.getMonth() + 1);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "未来三个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setMonth(end.getMonth() + 3);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "未来半年",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setMonth(end.getMonth() + 6);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
          {
            text: "未来一年",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setMonth(end.getMonth() + 12);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              return [start, end]
            },
          },
        ])

watch(
() => datetime.value, (newVal) => {
  console.log('触发了供应链选择日期组件的datetime',datetime.value);
  emits("update:modelValue", datetime.value)
}, { immediate: true, deep: true },)

watch(
() => defaultTimeType.value, (newVal) => {
  console.log('触发了供应链选择日期组件的defaultTimeType',newVal);
  if(newVal=='day'){
    // 获取今天的日期对象（本地时间）
    const today = new Date();
    // 创建昨天的开始时间（00:00:00）
    const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0);
    // 创建今天的结束时间（23:59:59）
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    // 赋值
    datetime.value = [formatDateTime2(yesterdayStart), formatDateTime2(todayEnd)]
  }
  console.log('默认的datetime.value',datetime.value);
}, { immediate: true, deep: true },)

// 当前日期格式化为 YYYY-MM-DD HH:mm:ss  
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 格式化函数开始时间（00:00:00）到结束时间（23:59:59）
function formatDateTime2(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-') + ' ' + [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0')
  ].join(':');
}

</script>

<style scoped>
.block{
    width: 100%;
}

:deep(.el-date-editor.el-input__wrapper){
  width: 100%;
}
</style>