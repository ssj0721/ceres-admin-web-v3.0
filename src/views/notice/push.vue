<template>
  <basic-container class="container">
  <div class="pending">
      <!-- 信息栏 -->
        <mybottons>
        <el-form
          ref="formParamsRef"
          :inline="true"
          :model="formParams"
          :rules="rules"
        >
          <el-form-item
            label="标题"
            prop="noticeTitle"
          >
            <el-input
              v-model="formParams.noticeTitle"
              maxlength="18"
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item
            label="消息类型"
            prop="noticeType"
          >
            <el-select
              v-model="formParams.noticeType"
              placeholder="请选择消息类型"
              size="large" style="width: 200px" clearable
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="接收用户"
            prop="receive"
          >
            <el-select
              v-model="formParams.receive"
              placeholder="请选择接收用户"
              size="large" style="width: 200px" clearable
            >
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </mybottons>
      <!-- 富文本编辑器 -->
      <div class="second-main-container">
      <div>
        <Tinymce
          ref="tinymceContent"
          v-model="formParams.noticeContent"
          :height="400"
        />
      </div>
      <div style="margin-top: 20px;display: flex;justify-content: flex-end;">
        <el-button
          :loading="btnLoading"
          style="width: 100px"
          type="primary"
          @click="send"
        >发送
        </el-button>
      </div>
      </div>
  </div>
  </basic-container>
</template>

<script setup>
import Tinymce from '@/components/Tinymce/index.vue'
import { noticeSave } from '@/api/notice'
import { ref } from 'vue';

const typeList = ref([
  {
    id: 2,
    name: '公告',
  },
  {
    id: 3,
    name: '站内信',
  },
])
const userList = ref([
  {
    id: 1,
    name: '全部用户',
  },
  {
    id: 2,
    name: '商家',
  },
  {
    id: 3,
    name: '普通用户',
  },
])
const btnLoading = ref(false)
const formParams = ref({
  noticeTitle: null,
  noticeType: null,
  noticeContent: '',
  receive: null,
})

const rules = {
  noticeTitle: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, message: '请输入标题', trigger: 'blur' },
  ],
  noticeType: [
    { required: true, message: '请选择消息类型', trigger: 'change' },
  ],
  receive: [
    { required: true, message: '请选择接收用户', trigger: 'change' }
  ]
}

const formParamsRef = ref()

async function send () {
  formParamsRef.value.validate((valid) => {
    if (valid) {
      if (formParams.value.noticeContent === null) {
        ElMessage({
          message: '请输入内容',
          type: 'warning',
        })
      } else {
        save()
      }
    } else {
      return false
    }
  })
}

const tinymceContent = ref()

function save () {
  btnLoading.value = true
  noticeSave(formParams.value).then(res => {
    if (res.code === '') {
      ElMessage({
        message: '消息发送成功',
        type: 'success',
      })
      formParamsRef.value.resetFields()
      formParams.value.noticeContent = ''
    }
  }).finally(() => {
    btnLoading.value = false
  })
}
</script>

<style
    lang="scss"
    scoped
>

.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container{
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;
  .el-form .el-form-item {
    margin-bottom: 0px;
  }
  box-shadow: $shadow-1;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin:24px;
  // margin-left:24px;
}

.push {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
}
</style>
