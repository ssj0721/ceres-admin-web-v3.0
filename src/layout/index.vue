<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div>
    <Sidebar v-if="!embed" class="sidebar-container" />
    <div class="main-container">
      <div v-if="!embed" class="fixed-header">
        <Navbar />
      </div>
      <div class="main-content">
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Navbar, Sidebar, AppMain } from "./components";

const { width } = useWindowSize();
const WIDTH = 992;
const store = useStore();
const route = useRoute();
const { getters } = useStore();
const sidebar = computed(() => getters["sidebar"]);
const device = computed(() => getters["device"]);
const fixedHeader = computed(() => store.state.settings.fixedHeader);
const embed = computed(() => {
  return route.query.embed === "1";
});
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile",
  embedMode: embed.value,
}));

watchEffect(() => {
  if (width.value < WIDTH) {
    store.dispatch("app/toggleDevice", "mobile");
    store.dispatch("app/closeSideBar", { withoutAnimation: true });
  } else {
    store.dispatch("app/toggleDevice", "desktop");
  }
});

const handleClickOutside = () => {
  store.dispatch("app/closeSideBar", { withoutAnimation: false });
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
// @import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  overflow: hidden;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  transition: width 0.28s;
  height: 100vh;
  position: relative;
  z-index: 1;
  overflow-y: auto;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: margin-left 0.28s;
  position: relative;
  overflow: hidden;
}

.fixed-header {
  width: 100%;
  transition: width 0.28s;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.hideSidebar .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
