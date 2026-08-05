<template>
  <div>
    <el-container style="height: 32px;">
      <el-aside v-if="props.title" width="100px" class="el-form-item__label">{{
        props.title
      }}</el-aside>
      <el-main class="el-form-item__label">
        <el-select
          :filterable="props.filterable"
          v-model="items"
          :multiple="!props.radio"
          :placeholder="placeholder"
          style="width: 100%"
          @visible-change="deformation"
          :disabled="editDisabled"
          :remote="remote"
          value-key="id"
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading"
          collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
        >
          <span v-if="!props.radio">
            <el-checkbox
              style="margin: 0px 0px 0px 20px"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              :disabled="isView"
              >{{ $t(`Action.CheckAll`) }}</el-checkbox
            >
            <el-button
              style="margin: 0px 0px 0px 30px"
              size="mini"
              @click="checkOpposite"
              :disabled="isView"
              >{{ $t(`Action.Invert`) }}</el-button
            >
          </span>
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="props.showCode ? item.code + item.name : item.name"
            :value="item.id"
            :disabled="isView"
          ></el-option>
        </el-select>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import request from '@/utils/request'
import { ref, toRefs, reactive, onMounted, shallowRef } from 'vue';
import { watch } from 'vue'
// import {
//   requestService2
// } from '@/api/active'

// let model= ref({
//     prop: "value"
//   })

const prop = defineProps({
  props: {
      type: Object,
      default : () => {},
    },
  isView: {
      type: Boolean,
      default : () => false,
    },
  value: {},
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
  value} = toRefs(prop);

let placeholder = ref("请选择")
let remote = ref(false)
let editDisabled = ref(false)
let required = ref(true)
let checkAll = ref(false)
let items = ref([])
let tableData = ref([])
let AllKey = ref([])
let isIndeterminate = ref(false)
let selected = ref(
{
  checkState: undefined,
  checkall: undefined,
  items: undefined,
  name: undefined
})
let loading = ref(false)
let itemsName = ref("")
let list = ref([])
let same = ref()

const emits = defineEmits(['dadMethod','update:selected','input','update:prop']);

  onMounted(() => {
  console.log('props',props,props.value);
  // console.log('valueFormat和format',valueFormat.value,format.value);
  console.log("组件挂载props---droplist-Control",props.value)
  console.log('value.value',value.value);
  // if (props.value.radio) {
  //       console.log('radio为true');
  //       // items.value = value.value
  //       ValueChange()
  //     } 
  if (props.value.editDisabled !== undefined) {
        if (props.value.editDisabled) {
          editDisabled.value = true
        }
      }
  if (
      props.value.items === undefined &&
      value.value !== undefined &&
      value.value !== ""
    ) {
      if (props.value.radio) {
        console.log('radio为true');
        items.value = value.value
      } else {
        let val = value.value
        if (Array.prototype.isPrototypeOf(val)) {
          items.value = val
        } else if (val && typeof val === 'string') {
          items.value = val.split(',');
        } else {
          // 处理 val 不是字符串或 undefined 的情况
          items.value = [];
        }
      }
    }
    // requestService()
    initComponent()
    console.log('挂载DroplistControl');
});

watch(
  () => isIndeterminate, (newVal) => {
    ValueChange()
}, { immediate: false, deep: true })

watch(
  () => items, (newVal) => {
    console.log('items选择了');
    ValueChange()
    // AllKey.value.length === items.value.length ? isIndeterminate.value = true : isIndeterminate.value = false
}, { immediate: false, deep: true })

// watch(
//   () => radio, (newVal) => {
//     console.log('radio的watch',radio.value,newVal);
//     if(newVal) ValueChange()
// }, { immediate: false, deep: true })

watch(
  () => checkAll, (newVal) => {
    console.log('checkAll选择了',same.value,newVal.value);
    if(same.value != newVal.value){
      ValueChange()
    }
    same.value = newVal.value
}, { immediate: false, deep: true })

watch(
  () => required, (newVal) => {
    console.log('required选择了');
    ValueChange()
}, { immediate: false, deep: true })

watch(
  () => props, (newVal) => {
    console.log('props选择了');
    if (props.value.watch === true) {
      initComponent()
    }
}, { immediate: false, deep: true })

function initComponent() {
      //初始化
      default2()
      handleSelectList()
}

function remoteMethod(query) {
      //远程搜索
      if (!props.value.query) return
      AllKey.value = []
      //let num = query.length;
      if (query !== "" && query !== undefined) {
        loading.value = true
        tableData.value = list.value.filter((item) => {
          if (
            item.name
              //.substr(0, num)
              .toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          ) {
            if (
              props.value.filterSize != undefined &&
              typeof props.value.filterSize === "number"
            ) {
              if (AllKey.value.length <= props.value.filterSize) {
                AllKey.value.push(item.id) //得到ID串
              } else {
                return
              }
            } else {
              AllKey.value.push(item.id) //得到ID串
            }
            return true
          }
        })
        handlecheckedIdChange(items.value)
        loading.value = false
      } else {
        tableData.value = []
      }
}

function confValue() {
      //配置值的类型
      if (props.value.radio) items.value = ""
      else items.value = []
}

function setValue(value) {
      //动态赋值
      items.value = value
}

function setDisabled(value) {
      //动态禁用/启用
      editDisabled.value = value
}

function pickRoleName() {
      //获取文本
      itemsName.value = ""
      if (!props.value.radio) {
        if (items.value.length > 5) {
          itemsName.value = "略"
          return
        }
        for (let i = 0; i < items.value.length; i++) {
          let obj = ""
          if (remote.value)
            obj = list.value.find((item) => {
              return item.id === items.value[i] //筛选出匹配数据
            })
          else
            obj = tableData.value.find((item) => {
              return item.id === items.value[i] //筛选出匹配数据
            })
          if (obj === undefined) return
          itemsName.value += obj.name + " "
        }
      } else {
        let obj = ""
        if (remote.value)
          obj = list.value.find((item) => {
            return item.id === items.value //筛选出匹配数据
          })
        else
          obj = tableData.value.find((item) => {
            return item.id === items.value //筛选出匹配数据
          })
        if (obj === undefined) return
        itemsName.value = obj.name
      }
}


function deformation(value) {
  console.log('deformation');
  if (value) emits("dadMethod")
}

function default2() {
    //LiuJY add 设置新增页面控件不可选 新增时写前面mounted不生效
    if (props.value.addDisabled !== undefined) {
      if (props.value.addDisabled) {
        editDisabled.value = true
      }
    }
    if (props.value.required === undefined || props.value.required === true)
      required.value = true
    else required.value = false
    if (props.value.radio) required.value = true
    //是否必填
}

function ValueChange() {
      pickRoleName()
      let array = []
      array = items.value
      console.log('ValueChange的items',array,items,items.value);
      handlecheckedIdChange(array)
      if (tableData.value.length == 0) checkAll.value = false
      if (!props.value.radio) {
        if (!checkAll.value && !isIndeterminate.value)
          selected.value.checkState = 0
        //全不选
        else if (checkAll.value && !isIndeterminate.value)
          selected.value.checkState = 1
        //全选
        else if (!checkAll.value && isIndeterminate.value)
          selected.value.checkState = 2 //半选
        if (required.value) selected.value.checkall = true
        //必选
        else selected.value.checkall = false //非必选
        selected.value.items = items.value //选择值
      } else {
        selected.value.checkState = 2 //半选
        selected.value.checkall = true //必选
        selected.value.items = items.value.toString() //选择值
      }
      selected.value.name = itemsName.value
      console.log('组件选择的值',selected.value);
      emits("update:selected", selected.value) //更新值
      emits("input", selected.value.items)
      emits("update:modelValue", selected.value.items)
}

function handleCheckAllChange() {
      // 全选/全不选 
      console.log('全选的checkAll和AllKey和items',checkAll.value,AllKey.value,items.value);
      AllKey.value.length === items.value.length ? checkAll.value = false : checkAll.value = true
      if (checkAll.value) {
        items.value = AllKey.value
      } else {
        items.value = []
      }
      // isIndeterminate.value = false
      isIndeterminate.value = !checkAll.value
}

function checkOpposite() {
      //反选
      items.value = items.value
        .concat(AllKey.value)
        .filter((v) => !items.value.includes(v))
      handlecheckedIdChange(items.value)
}

function handlecheckedIdChange(value) {
      let checkedCount = value.length
      console.log('checkedCount',items,checkedCount,value);
      checkAll.value = checkedCount === tableData.value.length
      //全选按钮控制
      isIndeterminate.value =
        checkedCount > 0 && checkedCount < tableData.value.length
}

function checkRequirement() {
      //检查是否为空
      if (items.value == "" && required.value && !props.value.hide) return false
      else return true
}

function requestService() {
  requestService2().then((res) => {
        console.log('res---------',res);
        // return res
    })
  // return res
}

async function handleSelectList() {
  // 数据获取
  confValue();

  if (props.value.api === undefined && props.value.dicData !== undefined) {
    // 数据字典
    tableData.value = props.value.dicData;
    AllKey.value = [];
    tableData.value.forEach((item) => {
      AllKey.value.push(item.id); // 得到ID串
    });
    if (props.value.checkall && !props.value.radio) items.value = AllKey.value; // 全选
    if (props.value.items !== undefined) items.value = props.value.items; // 自定义赋值
    if (props.value.firstItems !== undefined)
      items.value = props.value.dicData[0].id; // 默认第一个值
    if (!props.value.radio) handlecheckedIdChange(items.value);
  }

  if (props.value.api !== undefined && props.value.dicData === undefined) {
    let param = props.value.params === undefined ? {} : props.value.params
    console.log('参数',props.value.params,param);
    // 后端取数
    console.log(7777777777);
    console.log(props.value.api);
    
    
    try {
      const response = await request({
        url: props.value.api, 
        method: 'post',
        data: param,
      })
      if (response.code === "") {
        console.log('handleSelectList的res',response);
        const data = response.data;
        console.log(props.value.api, data);

        if (props.value.filterable && data.tableData.length > 50 && props.value.query) {
          list.value = data.tableData;
          placeholder.value = "请输入关键字搜索";
          remote.value = true;
          if (props.value.query && props.value.items === undefined && value.value !== undefined && value.value !== "") {
            AllKey.value = [];
            tableData.value = [];
            tableData.value = list.value.filter((item) => {
              if (item.id.toString().indexOf(value.value.toString()) > -1) {
                AllKey.value.push(item.id); // 得到ID串
                return true;
              }
            });
            if (!props.value.radio) handlecheckedIdChange(items.value);
          }
        } else {
          list.value = data;
          tableData.value = data;
          tableData.value.forEach((item) => {
            AllKey.value.push(item.id); // 得到ID串
          });
          if (props.value.checkall && !props.value.radio) items.value = AllKey.value; // 全选
          if (props.value.items !== undefined) items.value = props.value.items; // 自定义赋值
          if (props.value.firstItems !== undefined) items.value = data.tableData[0].id; // 默认第一个值
          if (!props.value.radio) handlecheckedIdChange(items.value);
        }
      } else {
        console.log("数据获取错误", response);
      }
    } catch (error) {
      console.log("请求错误", error);
    }
  }
}

async function RefreshList(api, params) {
  console.log('参数222',params);
  try {
    const res = await request({
      url: api,
      method: 'post',
      data: params === undefined ? {} : params,
    });
    confValue();
    tableData.value = [];
    AllKey.value = [];
    list.value = [];
    loading.value = true;
    if (res.code === "") {
      const data = res.data.result;
      if (
        props.value.filterable &&
        data.tableData.length > 50 &&
        props.value.query
      ) {
        list.value = data.tableData;
        placeholder.value = "请输入关键字搜索";
        remote.value = true;
      } else {
        tableData.value = data.tableData;
        placeholder.value = "请选择";
        remote.value = false;
        tableData.value.forEach((item) => {
          AllKey.value.push(item.id); // 得到ID串
        });
        if (props.value.firstItems !== undefined) {
          items.value = data.tableData[0].id; // 默认第一个值
        }
        if (props.value.checkall && !props.value.radio) {
          items.value = AllKey.value; // 全选
        }
        if (!props.value.radio) {
          handlecheckedIdChange(items.value);
        }
      }
    } else {
      console.error("数据获取错误", res);
      // 可以在这里添加额外的错误处理逻辑，如显示错误消息
    }
  } catch (error) {
    console.error("请求发生错误", error);
    // 在这里处理请求错误，如显示错误消息或重置组件状态
  } finally {
    loading.value = false;
  }

  return res; // 根据需要返回响应或修改此行为
}
</script>
<style lang="scss" scoped>
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: hidden;
}


:deep(.el-main) {
   --el-main-padding: 0px;
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    /* padding: var(--el-main-padding); */
}

:deep(.el-form-item--default .el-form-item__label) {
    height: 32px;
    line-height: 32px;
}
</style>
