<template>
    <div>
      <x-iframe :src="finalurl"></x-iframe>
    </div>
</template>
   
<script setup>
import { ref, toRefs, reactive, onMounted, onBeforeMount } from 'vue';
import ireIframe from '@/utils/ireIframe'

const finalurl = ref("")
const url = ref("/po/Pomnt101/pomnt105")

async function completeIframeUrl() {
  let rsurl = await ireIframe(url.value)
    // 创建预连接链接
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = rsurl
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
  finalurl.value = rsurl
}

onBeforeMount(() => {
  completeIframeUrl()
});
</script>