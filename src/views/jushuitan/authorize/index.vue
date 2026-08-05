<template>
    <basic-container class="container">
        <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm035</div>
        <div class="pending">
            <div class="steps">
                <el-steps :active="active" process-status="finish" style="font-size: 15px;">
                  <el-step title="验证" description="验证聚水潭授权信息是否有效，无效则继续"/>
                  <el-step title="生成链接" description="生成并进入授权链接重新授权"/>
                  <el-step title="更新信息" description="更新存储的授权信息"/>
                  <el-step title="确认结果" description="确认授权结果是否成功"/>
                </el-steps>
                <el-button type="primary" style="margin-top: 18px" v-if="active==0" @click="next">点击验证</el-button>
                <el-button type="primary" style="margin-top: 18px" v-if="active==1" @click="next">生成链接</el-button>
                <el-button type="primary" style="margin-top: 18px" v-if="active==2" @click="next">更新信息</el-button>
                <el-button type="primary" style="margin-top: 18px" v-if="active==2" @click="back">上一步</el-button>
                <el-button type="primary" style="margin-top: 18px" v-if="active==3" @click="next">重新验证</el-button>
            </div>
            <div class="page">
                <div v-if="active==0 && checkResult" style="text-align: center; font-size: 26px; color: green;">
                    联营商的聚水潭授权信息有效，无需重新授权
                </div>
                <div v-if="active==1">
                    聚水潭授权信息无效，需点击 "生成链接" 按钮并进入链接重新授权。
                </div>
                <div v-if="active==2" style="display: flex; flex-direction: column;">
                    <span>点击下方的授权链接，跳转到授权页面，填写聚水潭授权账号信息重新授权，授权结束回到此页面点击 "更新信息" 按钮。</span>
                    <span style="font-size: 13px;">注：链接的有效时间为15分钟，请尽快完成授权。若链接失效，请点击 "上一步" 按钮回到生成链接页面重新生成链接。</span>
                    <a :href="url" target="_blank" style="color: blue; text-decoration: underline; margin-top: 13px;">授权链接</a>
                </div>
                <div v-if="active==3">
                    <span>授权信息更新成功，点击 "重新验证" 按钮回到验证界面验证重新授权后的授权信息</span>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script setup>
import { ref, onBeforeMount, nextTick, reactive, shallowRef, toRefs } from 'vue'
import {
    verify,
    createUrl,
    updateData
} from '@/api/jushuitan'

const active = ref(0)
const checkResult = ref(false)
const url = ref("")

onBeforeMount(() => {

})

const next = () => {
    if(active.value==0){
        check()
    }
    if(active.value==1){
        create()
    }
    if(active.value==2){
        update()
    }
    if(active.value==3){
        activeadd()
        check()
    }
}

const back = () => {
    if(active.value==2){
        active.value--
    }
}

function activeadd(){
    if (active.value++ > 2) active.value = 0
}

async function check(){
    await verify().then(res => {
        console.log('验证的res',res);
        if(res.data=="1"){
            ElMessage.success("聚水潭信息有效，无需重新授权")
            checkResult.value = true
        }else if(res.data=="0"){
            ElMessage.error("聚水潭信息无效，需重新授权")
            activeadd()
        }
    })
}

async function create(){
    await createUrl().then(res => {
        console.log('生成链接的res',res);
        if(res.data!=""){
            ElMessage.success("生成授权链接成功")
            url.value = res.data
            activeadd()
        }else if(res.data==""){
            ElMessage.error("生成授权链接失败")
        }
    })
}

async function update(){
    await updateData().then(res => {
        console.log('更新信息的res',res);
        if(res.code==""){
            ElMessage.success("信息更新成功")
            activeadd()
        }else if(res.code!=""){
            ElMessage.error("信息更新失败")
        }
    })
}

</script>

<style lang="scss" scoped>
.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 95vh;
}

.pending {
  padding: 16px;
  display: flex;
//   justify-content: center;
//   flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin:24px;
  flex-direction: column;
  height: 100%;
  // margin-left:24px;

  .steps{
    width: 90%;
    // height: 30%;
  }
  .page{
    width: 90%;
    // height: 60%;
    margin-top: 5%;
    font-size: 18px;
  }
}
</style>