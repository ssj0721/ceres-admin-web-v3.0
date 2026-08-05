<template>
    <div>
      <x-iframe :src="finalurl"></x-iframe>
    </div>
</template>
   
<script setup>
import { ref, toRefs, reactive, onMounted } from 'vue';
import ireIframe from '@/utils/ireIframe'

const finalurl = ref("")
const url = ref("/bm/bgm/spbm/bmmnt311")

async function completeIframeUrl() {
  finalurl.value = await ireIframe(url.value)
}

onMounted(() => {
  completeIframeUrl()
});
</script>