<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm034</div>
    <div class="pending">
      <el-scrollbar style="width: 80%;">
        <el-container class="second-main-container">
          <el-header class="header">
            <div style="display: flex; justify-content: flex-end">
              <span>SCM供应链管理系统在线智能客服</span>
              <el-button type="text" style="margin-left: 30%;"  @click="deleteAll">清空历史记录</el-button>
            </div>
          </el-header>
          <el-main class="main">
            <el-scrollbar max-height="700px" ref="scrollbarRef" always @scroll="scroll">
            <div v-for="(message, index) in messages" :key="index">
              <div v-if="message.type == 'assistant'" class="assistant">
                <div class="content" style="white-space: pre-wrap; word-break: break-word;">
                  <!-- <el-icon style="width: 40px;"><Avatar style="width: 2em;"/></el-icon> -->
                  {{ message.content }}
                  <div style="margin-left: 5px">
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      content="复制"
                      placement="bottom"
                    >
                    <el-icon class="copy" @click="copy(message.content)"><CopyDocument /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div v-if="message.type == 'user'" class="user">
                <div class="content">
                  {{ message.content }}
                  <div style="margin-left: 5px">
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      content="复制"
                      placement="bottom"
                    >
                    <el-icon class="copy" @click="copy(message.content)"><CopyDocument /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          </el-main>
          <el-footer class="footer">
            <div class="footer-inner">
              <el-scrollbar max-height="100px" class="input">
              <el-input
                ref="textInput"
                v-loading="loading"
                v-model="userInput"
                style="width: 100%;"
                :autosize="{ minRows: 4, maxRows: 20 }"
                placeholder="请输入您的问题，shift+enter换行"
                show-word-limit
                type="textarea"
                @keyup.enter="commitQuestion"
                @keydown.shift.enter.prevent="handleShiftEnter"
              ></el-input>
              </el-scrollbar>
              <el-icon class="icon" @click="commitQuestion"><Position style="width: 2em; height: 2em;"/></el-icon>
            </div>
          </el-footer>
        </el-container>
      </el-scrollbar>
    </div>
  </basic-container>
</template>

<script setup>
import { ref, onBeforeMount, nextTick, reactive } from 'vue'
import clipboard3 from "vue-clipboard3";
import { ElMessage } from 'element-plus';
import { commit,query,deleteData } from '@/api/customer';

const userInput = ref("")
const messages = ref([
  {
    type:"assistant",
    content:"您好，请问您在供应链系统使用过程中遇到什么问题吗？"
  }
])
const loading = ref(false)
const scrollbarRef = ref(null)
const textInput = ref(null)
const scrolltop = ref(100000)
const isprevent = ref(false)

const copy = async (content) => {
  const { toClipboard } = clipboard3();
  try {
    await toClipboard(content);
    ElMessage({message: '复制成功',type: 'success'})
  } catch (error) {
    ElMessage({message: '复制失败',type: 'error'})
  }
};

onBeforeMount(() => {
  queryHistory()
})

// const scroll = ({ scrollTop }) => {
//   scrolltop.value = scrollTop
//   console.log('scrolltop.value',scrolltop.value);
// }

const commitQuestion = () => {
  console.log('触发了提交');
  if(!isprevent.value){
    loading.value = true
  if(userInput.value == null || userInput.value == "" || userInput.value == undefined){
    ElMessage({message: '请输入问题',type: 'error'})
    loading.value = false
    return;
  }else{
    commit({ question: userInput.value }).then((res) => {
    queryHistory()
    userInput.value = ""
    loading.value = false
  })
  }
  }else isprevent.value = false //重置isprevent为false，如果用户再次shift+enter则会重新让isprevent为true
}

const queryHistory = () => {
  query().then((res) => {
    console.log('查询的res',res);
    if(res.code == ""){
      messages.value = res.data
      nextTick(()=>{
        console.log('scrollbarRef.value',scrollbarRef.value);
        scrollbarRef.value.setScrollTop(scrolltop.value)
    })
    }
  })
}

const deleteAll = () => {
  deleteData().then((res) => {
    console.log('删除的res',res);
    queryHistory()
  })
}

const handleShiftEnter = (event) => {
  console.log('触发了回车阻止事件');
  // 阻止 shift+enter 触发 keyup.enter 事件
  isprevent.value = true
  event.preventDefault()
  const textarea = textInput.value.textarea; //获取输入框元素
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const newValue = value.substring(0, start) + "\n" + value.substring(end);//内容增加换行
  userInput.value = newValue;
  textarea.selectionStart = textarea.selectionEnd = start + 1;
  nextTick(()=>{
    console.log('scrollbarRef.value',scrollbarRef.value);
    scrollbarRef.value.setScrollTop(scrolltop.value)
  })
}

</script>

<style lang="scss" scoped>
.main-content{
  overflow: hidden;
}

.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.second-main-container{
  width: 95%;
  height: 88vh;
  // background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;
  // background-color: #f5f4f4;
  .el-form .el-form-item {
    margin-bottom: 0px;
  }
  box-shadow: $shadow-1;
  .header{
    height: 10%;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
  }
  .main{
    height: 72%
  }
  .assistant{
    padding: 10px 0 10px 0;
    display: flex;
    align-items: center;
    width: 45%;
    .content{
      background-color: #ffffff91;
      height: 100%;
      line-height: 20px;
      display: flex;
      align-items: flex-end;
      border-radius: 0 10px 10px 10px;
      padding: 10px;
      .copy{
        cursor: pointer;
      }
    }
  }
  .user{
    padding: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 45%;
    transform: translate(113%);
    .content{
      background-color: black;
      color: #fff;
      height: 100%;
      line-height: 20px;
      display: flex;
      align-items: flex-end;
      border-radius: 10px 0 10px 10px;
      padding: 10px;
      .copy{
        cursor: pointer;
      }
    }
  }
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
  height: 100%;
  // margin:24px;
  // margin-left:24px;
}

.footer{
  height: 20%;
  .footer-inner{
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    .input{
      width: 100%;
    }
    .icon{
      height: 100%;
      width: 4%;
      cursor: pointer;
    }
  }
}

</style>
