<template>
  <div v-if="!item.hidden">
    <!-- 只包含一个子路由节点的路由，显示其【唯一子路由】 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <el-menu-item
        v-if="onlyOneChild.meta"
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
        @click="jump(resolvePath(onlyOneChild.path))"
      >
        <icon :icon="onlyOneChild.meta.icon" />
        <template #title
          ><span style="overflow-wrap: break-word; white-space: normal;">{{ onlyOneChild.meta.title }}</span></template
        >
      </el-menu-item>
    </template>

    <!-- 包含多个子路由  -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <Item
          v-if="item.meta"
          :icon="item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { getToken, getUserName } from "@/utils/auth";
import { isExternal } from "@/utils/validate";
import path from "path-browserify";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Item from "./Item.vue";
import { getSKtoken,saveMenuHist } from '@/api/user';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
});
const router = useRouter();
const store = useStore();
const sidebar = computed(() => store.state.app.sidebar);
const device = computed(() => store.state.app.device);
const onlyOneChild = ref();
const skToken = ref("")
const skTokenTime = ref(0)

const hasOneShowingChild = (children = [], parent) => {
  // 需要显示的子路由数组
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false; // 过滤不显示的子路由
    } else {
      onlyOneChild.value = item; // 唯一子路由赋值（多个子路由情况 onlyOneChild 变量是用不上的）
      return true;
    }
  });

  // 1：如果只有一个子路由, 返回 true
  if (showingChildren.length === 1) {
    return true;
  }

  // 2：如果无子路由, 复制当前路由信息作为其子路由，满足只拥有一个子路由的条件，所以返回 true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
};
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (props.basePath.indexOf("/http") === 0) {
    return props.basePath.slice(1);
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath); // 相对路径 → 绝对路径
  return fullPath;
};
const jump = async (path) => {
  console.log("jump", path);
  saveMenuHist(path)
  if (device.value === "mobile" && sidebar.value.opened === true) {
    store.dispatch("app/closeSideBar", { withoutAnimation: true });
  }
  if (isExternal(path)) {
    if (path.includes("/espNotUse/")) {
      let token = getToken();
      token = token.split(" ")[1];
      let url = path + "?u=" + getUserName() + "&jwt=" + token;
      console.log('跳转的url',url);
      window.open(url);
    } else if (path.includes("/etds/")) {
      // 查货系统跳转处理
      const hostname = window.location.hostname;
      const userName = getUserName();
      console.log('查货系统跳转处理',path,userName);
      let url = "";
      if (hostname === '172.20.32.198' || hostname.includes('test')) {
        url = `http://test.tradingerp.gsitcloud.com/App?user=${userName}&licstate=true`;
      } else {
        url = `https://tradingerp.gsitcloud.com/App?user=${userName}&licstate=true`;
      }
      window.open(url);
    }else if (path.includes("/#/login")) {
      let timestampMs = Date.now();
      let token = ""
      let url = ""
      console.log('skToken',skToken.value,skTokenTime.value);
      if(skToken.value==""||skTokenTime.value+7000000<=timestampMs){
        const res = await getSKtoken()
        console.log('获取审款token的res',res);
        token = res.data;
        skToken.value = token
        skTokenTime.value = timestampMs
        url = path + "&maxkey=" + token;
      }else{
        token = skToken.value
        url = path + "&maxkey=" + token;
      }
      console.log('跳转的url',url);
      window.open(url);
    }else {
      window.open(path);
    }
  } else {
    router.push({ path }).catch((err) => {
      console.error(err);
    });
  }
};
</script>
<style lang="scss" scoped>
.submenu-title-noDropdown {
  & > span {
    margin-left: 12px;
  }
}
</style>
