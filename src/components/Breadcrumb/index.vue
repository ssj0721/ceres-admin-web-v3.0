<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        :key="item.path"
        :to="pathCompile(item.path)"
        class="breadcrumb-item"
        @click="choosePath(item.path)"
        v-for="(item, index) in levelList"
      >
        <span class="breadcrumb-title" :style="{ color: highlight === item.path? '#409EFF': 'black' }">
          {{ item.meta.title }}
          <span @click.stop="removeBreadcrumb(index, item.path)" >
            <el-icon v-if="levelList.length>1" class="close-icon">
              <Close />
            </el-icon>
          </span>
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import pathToRegexp from 'path-to-regexp';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { saveMenuHist } from '@/api/user';

const route = useRoute();
const router = useRouter();
const levelList = ref([]);
const isdelete = ref(false);
const highlight = ref('');

// 响应式状态
// const router = useRouter()
 
// // 初始化加载
// const loadState = () => {
//   const saved = localStorage.getItem('breadcrumbState')
//   console.log('loadState',saved);
//   if (saved) {
//     try {
//       levelList.value = JSON.parse(saved)
//     } catch (e) {
//       console.warn('Failed to load breadcrumb state:', e)
//     }
//   }
// }
 
// // 保存状态
// const saveState = () => {
//   console.log('saveState',JSON.stringify(levelList.value));
//   localStorage.setItem('breadcrumbState', JSON.stringify(levelList.value))
// }
 
// // 路由守卫
// router.beforeEach((to, from, next) => {
//   saveState() // 路由切换前保存
//   next()
// })
 
// // 监听路由变化
// watch(() => route.path, () => {
//   loadState() // 路由变化后重新加载
// })
 


watch(
  () => route,
  () => {
    getBreadcrumb();
  },
  { deep: true }
);

onBeforeMount(() => {
  levelList.value = []
  getBreadcrumb();
});

const getBreadcrumb = () => {
  if(!isdelete.value){
    let matched = route.matched.filter((item) => item.meta && item.meta.title);
    matched.forEach(i => {
      if(i.children.length==0 && levelList.value.indexOf(i)==-1 && levelList.value.length<4){
        levelList.value.push(i)
      }else if(i.children.length==0 && levelList.value.indexOf(i)==-1 && levelList.value.length>=4){
        levelList.value.splice(0, 1);
        levelList.value.push(i)
      }
    })
  }
  highlight.value = route.path
  isdelete.value = false
};

const pathCompile = (path) => {
  console.log('面包糠pathCompile',path);
  const { params } = route;
  var toPath = pathToRegexp.compile(path);
  return toPath(params);
};

const removeBreadcrumb = (index, path) => {
  console.log('面包糠removeBreadcrumb',path);
  if(route.path ==pathCompile(path)) {
    levelList.value.splice(index, 1);
    router.push(levelList.value[0].path);
  } else {
    levelList.value.splice(index, 1);
  }
  isdelete.value = true
};

const choosePath = (path) => {
  console.log('面包糠选择的path',path);
  saveMenuHist(path)
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: flex;
  font-size: 14px;
  color: $secondary-text-color;
  padding: 10px;
  border-radius: 4px;
  line-height: 24px;
 
  &:hover {
    color: $theme-color-3;
  }
  .breadcrumb-item {
    display: flex;
    align-items: center;

    .breadcrumb-title {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      transition: 0.2s;
      border-radius: $border-radius-mini;
      &:hover {
        background-color: rgba($neutral-color-1, 0.5);
        backdrop-filter: $backdrop-filter-base;
        color: $theme-color-3;
        box-shadow: $shadow-2;
        transition: 0.2s;
      }

      i {
        display: flex;
        align-items: center;
      }
      .close-icon {
        margin-left: 8px;
        font-size: 12px;
        cursor: pointer;

        &:hover {
          color: $theme-color-3;
        }
      }
    }
  }
}
</style>
