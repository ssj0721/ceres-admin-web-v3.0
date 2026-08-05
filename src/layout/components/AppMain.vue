<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = computed(() => route.path)

</script>

<style scoped>
.app-main {
  width: 100%;
  position: relative;
  background:
    url('@/assets/images/background_home.png') no-repeat center top / 100% 50%,
    #F1F4FE;
  min-height: 100%;
  background-attachment: fixed;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
