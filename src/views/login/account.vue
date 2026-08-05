<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="left"
    label-width="0px"
  >
    <el-form-item prop="username">
      <el-input
        v-model="ruleForm.username"
        type="text"
        maxlength="11"
        auto-complete="off"
        placeholder="请输入账户"
        class="iptHeight"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        maxlength="20"
        type="password"
        class="iptHeight"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter="handleLogin"
      />
    </el-form-item>
    <div class="boxBottom">
      <el-checkbox v-model="ruleForm.rememberMe" style="margin: 0 0 25px 0"
        >自动登录</el-checkbox
      >
      <div class="forgetPsd" @click="() => $emit('forgetPassword')">
        忘记密码
      </div>
    </div>

    <el-form-item style="width: 100%">
      <el-button
        :loading="loading.btns"
        type="primary"
        style="width: 100%; border-radius: 27px; height: 54px"
        @click.native.prevent="handleLogin"
      >
        <span v-if="!loading.btns">登录</span>
        <span v-else>登 录 中...</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import { UserActionEnum } from "@/store/modules/user/state";
import { useRouter } from "vue-router";
import { loginETDS } from "@/utils/authSecondary";
import { loginIretail, getUserInfo_iRetail } from "@/api/etds";
import { encrypt } from "@/utils/rsaEncrypt.js";
import { checkEtdsRole } from "@/utils/etds";
// import store from '@/store'
defineComponent({
  name: "AccountLoginComponent",
});
defineEmits(["forgetPassword"]);

const store = useStore();
const router = useRouter();
let ruleForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

let loading = reactive({
  btns: false,
});

const rules = {
  username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
};

async function isEtdsUser() {
  const roleList = await checkEtdsRole();
  // 要注意繁体
  return roleList.includes("查货" || "查貨");
}

const ruleFormRef = ref();
async function handleLogin() {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      console.log(898989);
      store
        .dispatch(UserActionEnum.LOGIN, {
          username: encrypt(ruleForm.username),
          password: encrypt(ruleForm.password),
          rememberMe: ruleForm.rememberMe,
        })
        .then(async () => {
          console.log("777");
          if (await isEtdsUser()) {
            console.log("isEtdsUser", ruleForm.username);
            const res = await loginETDS({
              userId: ruleForm.username,
              userPassword: ruleForm.password,
            });
           console.log("888");
            if (res.success) {
              // ElMessage.success('查货用户登录成功')
              console.log("查货用户登录成功", res);
            }

            // 传入用户ruleForm.username，没有传默认使用admin
          }
          //   try {
          //     // stroe.dispatch(UserActionEnum.GETIRETAIL_INFO,{
          // // 传入用户ruleForm.username，没有传默认使用admin
          //     // }).then(async () => {
          //     //   console.log("获取iretail信息");

          //     // })
          //     console.log("获取iretail信息");
              
          //     const res1 = await loginIretail(ruleForm.username);
          //     const iRetailToken = res1.result.token;
          //     // localStorage.setItem("iRetailToken", iRetailToken);
          //     const userinfo = await getUserInfo_iRetail();
          //     console.log("ireati");
          //     console.log(userinfo);
          //     store.commit(
          //       "SET_IRETAIL_PERMISSION",
          //       userinfo.result.permission
          //     );
          //     console.log(store);
          //     localStorage.setItem(
          //       "iRetailPermission",
          //       JSON.stringify(userinfo.result.permission)
          //     );
          //     localStorage.setItem(
          //       "userInfo",
          //       JSON.stringify(userinfo.result.userInfo)
          //     );
          //   } catch {
          //     console.log("获取iretail信息错误");
          //   }

          router.push({ path: "/" }).then(() => {
            window.location.reload(); 
            // setTimeout(() => {
            //   window.location.reload();
            // }, 8000);
          });

          //  const res = await loginIretail({});
          //  const iRetailToken = res.result.token;
          //  console.log(90909090);

          //  console.log(iRetailToken);

          // localStorage.setItem('iRetailToken', iRetailToken); // 保存新 token
        })
        .catch(() => {})
        .finally(() => {
          loading.btns = false;
        });
    } else {
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.boxBottom {
  display: flex;
  justify-content: space-between;
  .forgetPsd {
    font-size: 14px;
    color: #3a68f2;
    cursor: pointer;
  }
}
:deep(.iptHeight) {
  .el-input__wrapper {
    height: 54px;
    padding: 1px;
    .el-input__inner {
      height: 100%;
      padding: 0 11px;
      border-radius: 3px;
    }
  }
}
</style>
