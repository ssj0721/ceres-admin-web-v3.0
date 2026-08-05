<!--集團辦公平臺 -->
<template>
  <div id="app">
      <iframe
         style="border:none"
         :width="searchTableWidth"
         :height="searchTableHeight"
         v-bind:src="reportUrl"
         sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
       ></iframe>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, nextTick } from 'vue'

const searchTableHeight = ref(0)
const searchTableWidth = ref(0)
const reportUrl = ref('https://dwa.gsitcloud.com/__4825884F0022101A.nsf/ContentPageByNo2/LWF_LYKLY.html')

function widthHeight() {
      searchTableHeight.value = window.innerHeight
      searchTableWidth.value = window.innerWidth
}

onBeforeMount(() => {
  window.onresize = () => {
      widthHeight(); // 自适应高宽度
    };
    nextTick(()=>{
      widthHeight();
    });
})
</script>