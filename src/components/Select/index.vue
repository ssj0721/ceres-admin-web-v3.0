<template>
    <div style="width: 100%">
      <el-container style="width: 100%">
        <el-select
          v-model="items"
          :multiple="multiple"
          :placeholder="placeholder"
          :disabled="disabled"
          :filterable="filterable"
          :options="options"
          style="width: 100%"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
        >
          <span v-if="multiple">
            <el-checkbox
              style="margin: 0px 0px 0px 20px"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >{{ $t(`Action.CheckAll`) }}</el-checkbox
            >
            <el-button
              style="margin: 0px 0px 5px 30px"
              size="mini"
              @click="checkOpposite"
              >{{ $t(`Action.Invert`) }}</el-button
            >
          </span>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="valchoose == 'id' ? item.id : item.code"
          ></el-option>
        </el-select>
      </el-container>
    </div>
  </template>

<script setup>
/** 使用该组件注意：
 * 1.确保传进来的option的label是字段name，value是字段id。
 * 2.该组件相比原本的el-select新增了全选和反选的功能。
 */

import { ref, toRefs, reactive, onMounted, watch } from 'vue';
const props = defineProps({
// ！！！不可以用驼峰命名法命名变量 ！！！

  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: () => true,
  },
  /** 默认文本 */
  placeholder: {
    type: String,
    default: () => '',
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: () => false,
  },
  /** 是否支持搜索选项内容 */
  filterable: {
    type: Boolean,
    default: () => true,
  },
/** 选项数组 */
  options: {
    type: Array,
    default: () => [],
  },
  /** 值是id还是code */
  valchoose: {
    type: String,
    default: () => "id",
  },
//一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
//vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
  modelValue: {
    type: Array,
    default : () => []
  }
});
const {
    multiple,
    placeholder,
    disabled,
    filterable,
    options,
    valchoose,
    modelValue
} = toRefs(props);

const emits = defineEmits(['update:modelValue']);

//是否全选
const checkAll = ref(false)
//全选后获取的数组
const allKeys = ref([])
//选择的数据
const items = ref([])

onMounted(() => {
  console.log('接收到的props',props);
})

//监听:

watch(() => options.value, (nVal, oVal) => {
  console.log('检测到选项列表发生变化', nVal);
  if (nVal.length>0) {
    getAllKeys()
  }
});

watch(() => items.value, (nVal, oVal) => {
  console.log('检测到选择结果发生变化', nVal);
//将获取的值更新到父组件的v-model
  emits("update:modelValue", items.value)
});

watch(() => modelValue.value, (nVal) => {
//将父组件v-model的值更新到子组件的v-model
  items.value = nVal;
}, { immediate: true });

//方法:

function getAllKeys () {
    options.value.forEach(i => {
      console.log('valchoose.value',valchoose.value);
      if(valchoose.value=="id"){
        allKeys.value.push(i.id)
      }else allKeys.value.push(i.code)
    })
    console.log('全部选项的值',allKeys.value);
}

//全选
function handleCheckAllChange () {
    if(checkAll.value){
      if(allKeys.value.length==0){
        getAllKeys () 
      }
      items.value = allKeys.value
    }else{
        items.value = []
    }
}

//反选
function checkOpposite () {
  if(allKeys.value.length==0){
        getAllKeys () 
  }
  items.value = items.value
      .concat(allKeys.value)
      .filter((v) => !items.value.includes(v))
      
  if(items.value.length!=allKeys.value.length){
      checkAll.value = false
  }else checkAll.value = true
}
</script>

<style lang="scss" scoped>

</style>