<!-- BackToTop.vue -->
<template>
  <button 
    v-if="showButton"
    class="back-to-top" 
    @click="scrollToTop"
  >
    ↑ 回到顶部
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showButton = ref(false)  // 如果需要滚动超过某距离才显示，可以改为 false 并监听滚动

const container = document.querySelector('.main-content')   // 替换为实际class

const scrollToTop = () => {
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: 'smooth'   // 立即滚动，无动画
    })
  }
}

// 可选：监听滚动，控制按钮显示/隐藏（若不需要可删除）
const handleScroll = () => {
  if (container) {
    const scrollTop = container.scrollTop
    showButton.value = scrollTop > 300
  }
}

onMounted(() => {
  if (container) {
    container.addEventListener('scroll', handleScroll)
    handleScroll() // 立即检查一次初始状态
  }
})

onBeforeUnmount(() => {
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 5px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  z-index: 9999;        /* 确保在最上层 */
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.back-to-top:hover {
  background-color: #66b1ff;
}
</style>