<template>
  <div>
    <el-date-picker
      v-model="datePicker"
      :type="type"
      unlink-panels
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :format="format"
      :value-format="valueFormat"
      :shortcuts="pickerOptions.shortcuts"
      :clearable="props.clearable || false"
      :disabled="editDisabled || isView"
    ></el-date-picker>
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, shallowRef } from 'vue';
import { watch } from 'vue'
const prop = defineProps({
  props: {
      type: Object,
      default : () => {},
    },
  isView: {
      type: Boolean,
      default : () => false,
    },
  firstDayOfWeek: {
      type: Number,
      default : () => 1,
    },
  value: "",
  //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
  //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
  modelValue: {
    type: Array,
    default : () => []
  }
});

const {
  props,
  isView,
  firstDayOfWeek,
  value} = toRefs(prop);

const emits = defineEmits(['update:selected','input','pick']);

let datePicker = ref(["", ""])
let editDisabled = ref(false)
let type = ref("daterange")
const format = ref("YYYY-MM-DD")
const valueFormat = ref("YYYY-MM-DD")
const pickerOptions = ref({
        shortcuts: [
          {
            text: "最近一周",
            value: () => {
              const end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              if (props.value.selectionMode === "week") {
                start = end; //由监听器自动处理周
              }
              return [start, end]
            },
          },
          {
            text: "最近一个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            },
          },
          {
            text: "最近三个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            },
          },
          {
            text: "最近半年",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - (365 / 2) * 3600 * 1000 * 24);
              return [start, end]
            },
          },
          {
            text: "最近一年",
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              return [start, end]
            },
          },
          {
            text: "未来一周",
            value: () => {
              const end = new Date()
              let start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              if (props.value.selectionMode === "week") {
                start = end; //由监听器自动处理周
              }
              return [start, end]
            },
          },
          {
            text: "未来一个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              return [start, end]
            },
          },
          {
            text: "未来三个月",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              return [start, end]
            },
          },
          {
            text: "未来半年",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + (365 / 2) * 3600 * 1000 * 24);
              return [start, end]
            },
          },
          {
            text: "未来一年",
            value: () => {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365);
              return [start, end]
            },
          },
        ],
        firstDayOfWeek: 1,
      })

onMounted(() => {
  // console.log('props',props,props.value);
  // console.log('valueFormat和format',valueFormat.value,format.value);
  // console.log("组件挂载props---pickerOptions.value",props,pickerOptions.value)
  if (
      props.value.fromDate === undefined &&
      props.value.toDate === undefined &&
      value.value !== undefined &&
      value.value !== ""
    ) {
      let value = value.value.split(",");
      datePicker.value = [value[0], value[1]];
      console.log("mounted", datePicker.value);
    }

    if (firstDayOfWeek.value !== undefined)
      pickerOptions.value.firstDayOfWeek = firstDayOfWeek.value;
    if (props.value.selectionMode !== undefined)
      pickerOptions.value.selectionMode = props.value.selectionMode;
    if (props.value.showWeekNumber !== undefined)
      pickerOptions.value.showWeekNumber = props.value.showWeekNumber;
    // if (props.value.format !== undefined)
    //   format.value = props.value.format;

    ValueChange()
    default2()
    console.log('挂载datePicker.value', datePicker.value);
});

watch(
  () => datePicker, (newVal) => {
    console.log("datePicker--newVal",newVal.value)
    emits("update:selected", datePicker.value); 
    emits("input", datePicker.value);
    emits("update:modelValue", datePicker.value)
    console.log("watch.datePicker", datePicker.value);
}, { immediate: false, deep: true })

function fixWeek1(val) {
  if (props.value.selectionMode === "week") {
    let fromDate = new Date(val[0]).datePart();
    let toDate = new Date(val[1]).datePart();
    if (fromDate.getDay() !== 1) {
      fromDate = fromDate.addDays(-fromDate.getDay() + 1);
    }
    if (toDate.getDay() !== 0) {
      toDate = toDate.addDays(7 - toDate.getDay());
    }
    val[0] = fromDate;
    val[1] = toDate;
  }
}

function setDisabled (value) {
  //动态禁用/启用
  editDisabled.value = value;
}

function default2() {
    if (props.value.type === undefined || props.value.type === "daterange") {
      type.value = "daterange"
      format.value = "YYYY-MM-DD"
      valueFormat.value = "YYYY-MM-DD"
    } else if (props.value.type === "datetimerange") {
      type.value = "datetimerange"
      format.value = "YYYY-MM-DD HH:mm:ss"
      valueFormat.value = "YYYY-MM-DD HH:mm:ss"
    } else if (props.value.type === "monthrange") {
      type.value = "monthrange"
      format.value = "YYYY-MM"
      valueFormat.value = "YYYY-MM"
    }
}

function ValueChange() {
  console.log('props.value.fromDate && props.value.toDate',props.value.fromDate, props.value.toDate );
    if (
      props.value.fromDate !== undefined &&
      props.value.toDate !== undefined
    ) {
      if (
        new Date(props.value.fromDate).getTime() <=
        new Date(props.value.toDate).getTime()
      ) {
        datePicker.value[0] = props.value.fromDate;
        datePicker.value[1] = props.value.toDate;
        emits("update:selected", datePicker.value); 
        emits("input", datePicker.value); 
        emits("ValueChange", datePicker.value); 
        console.log('ValueChange的datePicker.value',datePicker.value);
        emits("update:modelValue", datePicker.value)
        fixWeek1(datePicker.value);
      }
    } //赋值
}

function setValue(value) {
      datePicker.value = value;
}
function setTwoValue(value1, value2) {
      datePicker.value = [value1, value2];
}
</script>

<style scoped>
:deep(.el-date-editor.el-input__wrapper){
  width: 100%;
}
</style>
