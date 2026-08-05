<template>
  <div>
    <x-iframe :src="finalurl" />
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, onBeforeMount } from 'vue';
import etdsIframe from '@/utils/etdsIframe'

const finalurl = ref('')

async function completeIframeUrl () {
  let rsurl = await etdsIframe()
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